import subprocess
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER_FILE = os.path.join(BASE_DIR, 'data', 'career_ledger.json')
TARGET_NUMBER = os.getenv('TARGET_PHONE_NUMBER', '+00000000000')
LAST_ID_FILE = os.path.join(BASE_DIR, 'data', 'last_email_id.json')

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        try:
            with open(LEDGER_FILE, 'r') as f:
                return json.load(f)
        except:
            return None
    return None

def save_ledger(ledger):
    with open(LEDGER_FILE, 'w') as f:
        json.dump(ledger, f, indent=4)

def check_for_responses():
    ledger = load_ledger()
    if not ledger:
        return

    # Track every company we've ever lead or applied to
    trackable_names = set()
    for app in ledger.get('applications', []):
        trackable_names.add(app['company'].lower())
    for lead in ledger.get('leads', []):
        trackable_names.add(lead['company'].lower())
    
    if not trackable_names:
        return

    # Dynamic search for any of these names in from/subject
    query_parts = [f"subject {name} or from {name}" for name in trackable_names]
    search_query = " or ".join(query_parts)

    try:
        # Search the last 20 emails
        cmd = ['himalaya', '--output', 'json', 'envelope', 'list', search_query, '--page-size', '20']
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            return

        output = result.stdout.strip()
        json_start = output.find('[')
        if json_start == -1:
            return
            
        emails = json.loads(output[json_start:])
        if not emails:
            return

        # State tracking for emails already processed
        last_id = None
        if os.path.exists(LAST_ID_FILE):
            with open(LAST_ID_FILE, 'r') as f:
                last_id = json.load(f).get('id')

        # We only care about the most recent one if it's new
        latest_email = emails[0]
        latest_id = str(latest_email.get('id'))

        if latest_id != last_id:
            # Check if this response is already in our ledger to prevent duplicates
            already_logged = any(r.get('id') == latest_id for r in ledger.get('responses', []))
            
            if not already_logged:
                ledger['responses'].append({
                    "id": latest_id,
                    "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "from": latest_email.get('from'),
                    "subject": latest_email.get('subject'),
                    "body_preview": latest_email.get('body', '')[:200]
                })
                save_ledger(ledger)
                
                # Notify user immediately
                msg = f"📩 🦞 Jarvis: ALERT! New response regarding your career search!\n\nFrom: {latest_email.get('from')}\nSubject: {latest_email.get('subject')}\n\nI have updated your Career Ledger and am standing by for your next command."
                subprocess.run(['openclaw', 'message', 'send', '--channel', 'whatsapp', '--target', TARGET_NUMBER, '--message', msg])
                
                # Update high-water mark
                with open(LAST_ID_FILE, 'w') as f:
                    json.dump({'id': latest_id}, f)

    except Exception as e:
        print(f"Monitor error: {e}")

if __name__ == "__main__":
    check_for_responses()
