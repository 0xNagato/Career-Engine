import os
import json
import subprocess
import xml.etree.ElementTree as ET
import urllib.request
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
RSS_URL = 'https://larajobs.com/feed'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE_FILE = os.path.join(BASE_DIR, 'data', 'hunter_state.json')
LEDGER_FILE = os.path.join(BASE_DIR, 'data', 'career_ledger.json')
TARGET_NUMBER = os.getenv('TARGET_PHONE_NUMBER', '+00000000000')

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        try:
            with open(LEDGER_FILE, 'r') as f:
                return json.load(f)
        except:
            return {"applications": [], "leads": [], "responses": []}
    return {"applications": [], "leads": [], "responses": []}

def save_ledger(ledger):
    os.makedirs(os.path.dirname(LEDGER_FILE), exist_ok=True)
    with open(LEDGER_FILE, 'w') as f:
        json.dump(ledger, f, indent=4)

def get_last_guid():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as f:
                return json.load(f).get('last_guid')
        except:
            return None
    return None

def save_last_guid(guid):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump({'last_guid': guid}, f)

def evaluate_job(title, description):
    prompt = f"""
    Evaluate my eligibility for this job based on my profile:
    PROFILE: Senior Systems & Full-Stack Architect. Mastery in Laravel 12, React 19, Rust (MEV), and high-performance data engineering.
    CONSTRAINT: APPLY ONLY FOR REMOTE JOBS. If the job is not remote, set 'eligible' to false.
    JOB TITLE: {title}
    DESCRIPTION: {description[:1000]}
    
    REPLY ONLY IN JSON:
    {{
        "eligible": boolean,
        "score": integer (0-100),
        "reason": "short string",
        "company_name": "string",
        "key_requirements": ["list", "of", "requirements"],
        "search_keywords": ["list", "of", "keywords"]
    }}
    """
    try:
        cmd = ['openclaw', 'agent', '--message', prompt, '--json']
        result = subprocess.run(cmd, capture_output=True, text=True)
        output = result.stdout.strip()
        json_start = output.find('{')
        if json_start != -1:
            return json.loads(output[json_start:])
    except:
        return None
    return None

def hunt():
    try:
        req = urllib.request.Request(RSS_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
        
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')
        last_guid = get_last_guid()
        new_guid = None
        ledger = load_ledger()
        
        for item in items:
            guid = item.find('guid').text
            if guid == last_guid:
                break
            
            if not new_guid:
                new_guid = guid
            
            title = item.find('title').text
            link = item.find('link').text
            description = item.find('description').text
            
            eval_result = evaluate_job(title, description)
            
            if eval_result and eval_result.get('eligible') and eval_result.get('score', 0) >= 80:
                company = eval_result.get('company_name', 'Unknown')
                
                # Add to ledger
                lead = {
                    "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "title": title,
                    "company": company,
                    "score": eval_result['score'],
                    "reason": eval_result['reason'],
                    "link": link,
                    "requirements": eval_result.get('key_requirements', []),
                    "keywords": eval_result.get('search_keywords', [company.lower()])
                }
                ledger['leads'].append(lead)
                
                # Notify with the "Bespeak & Merge" value proposition
                msg = f"🎯 🦞 Jarvis Hunter: ELITE MATCH FOUND!\n\nRole: {title}\nCompany: {company}\nScore: {eval_result['score']}/100\n\nJarvis is ready to:\n1. Draft a BESPOKE cover letter for {company}.\n2. MERGE it with your resume into a single PDF.\n3. AUTO-APPLY via the link.\n\nReply 'Apply to {company}' to trigger."
                subprocess.run(['openclaw', 'message', 'send', '--channel', 'whatsapp', '--target', TARGET_NUMBER, '--message', msg])
        
        save_ledger(ledger)
        if new_guid:
            save_last_guid(new_guid)
            
    except Exception as e:
        print(f"Hunter error: {e}")

if __name__ == "__main__":
    hunt()
