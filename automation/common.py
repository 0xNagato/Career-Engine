"""Shared pieces: settings, the ledger file, and WhatsApp notification."""
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.environ.get('CAREER_ENGINE_DATA', BASE_DIR / 'data'))
LEDGER_FILE = DATA_DIR / 'career_ledger.json'


def load_env(path=BASE_DIR / '.env'):
    """Read KEY=VALUE lines from .env. Values already in the environment win."""
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"\''))


def read_json(path, default):
    """A missing file gives the default. A file that will not parse stops the run."""
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError as e:
        sys.exit(f'{path} is not valid JSON ({e}). Fix it or move it aside. Refusing to overwrite it.')


def write_json(path, data):
    """Write through a temporary file so a crash cannot leave a half-written file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=path.parent, suffix='.tmp')
    with os.fdopen(fd, 'w') as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, path)


def load_ledger():
    ledger = read_json(LEDGER_FILE, {})
    for key in ('applications', 'leads', 'responses'):
        ledger.setdefault(key, [])
    return ledger


def save_ledger(ledger):
    write_json(LEDGER_FILE, ledger)


def notify(message, dry_run=False):
    """Send a WhatsApp message through OpenClaw. Returns True if it was sent."""
    if dry_run:
        print('[dry run] would send:\n' + message + '\n')
        return False
    target = os.environ.get('TARGET_PHONE_NUMBER', '')
    if not target or set(target) <= set('+0'):
        sys.exit('Set TARGET_PHONE_NUMBER in .env before sending messages.')
    done = subprocess.run(
        ['openclaw', 'message', 'send', '--channel', 'whatsapp', '--target', target, '--message', message],
        capture_output=True, text=True, timeout=60)
    if done.returncode != 0:
        print(f'WhatsApp send failed: {done.stderr.strip()[:200]}', file=sys.stderr)
    return done.returncode == 0
