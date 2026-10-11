"""Look for email from companies in the ledger and announce replies not seen before.

Run:  python3 automation/check_job_response.py [--dry-run]
Needs himalaya 2.x with a configured mail account.
"""
import argparse
import json
import re
import subprocess
from datetime import datetime

from common import load_env, load_ledger, notify, save_ledger

TOO_GENERIC = {'unknown', 'confidential', 'n/a', 'none'}


def company_names(ledger):
    """Company names from the ledger, cut down to characters that are safe inside a quoted search pattern."""
    names = {re.sub(r'[^\w &.\-]', ' ', entry.get('company', '').lower()) for entry in ledger['applications'] + ledger['leads']}
    names = {re.sub(r'\s+', ' ', name).strip() for name in names}
    return sorted(n for n in names - TOO_GENERIC if len(n) >= 3)


def search_query(names):
    """himalaya search query: sender or subject mentions a company. Quoted so names with spaces survive."""
    def quote(name):
        return '"' + name.replace('"', '') + '"'
    return ' or '.join(f'from {quote(n)} or subject {quote(n)}' for n in names)


def find_emails(names):
    done = subprocess.run(['himalaya', '--json', 'envelope', 'search', '--page-size', '50', search_query(names)],
                          capture_output=True, text=True, timeout=120)
    try:
        data = json.loads(done.stdout)
    except json.JSONDecodeError:
        data = {'error': done.stderr.strip()[:200] or 'himalaya printed no JSON'}
    if done.returncode != 0 or 'error' in data:  # himalaya reports some errors with exit code 0
        raise RuntimeError(f"himalaya: {data.get('error')}")
    return data.get('envelopes', [])


def sender(envelope):
    people = envelope.get('from') or []
    return ', '.join(f"{p.get('name') or ''} <{p.get('email', '')}>".strip() for p in people) or 'unknown sender'


def check(dry_run=False, find=find_emails, notify=notify):
    ledger = load_ledger()
    names = company_names(ledger)
    if not names:
        print('No companies in the ledger yet.')
        return 0

    logged = {str(r.get('id')) for r in ledger['responses']}
    fresh = [e for e in find(names) if str(e['id']) not in logged]
    for envelope in reversed(fresh):  # himalaya lists newest first; log oldest first
        ledger['responses'].append({
            'id': str(envelope['id']),
            'date': envelope.get('date') or datetime.now().strftime('%Y-%m-%d %H:%M'),
            'from': sender(envelope),
            'subject': envelope.get('subject', ''),
        })
    if fresh:
        if not dry_run:
            save_ledger(ledger)
        lines = [f"{r['from']}: {r['subject']}" for r in ledger['responses'][-len(fresh):][-5:]]
        more = f'\n(and {len(fresh) - 5} more in the ledger)' if len(fresh) > 5 else ''
        notify(f'{len(fresh)} new email(s) about your job search\n\n' + '\n'.join(lines) + more, dry_run)

    print(f'{len(fresh)} new email(s) from {len(names)} tracked compan(ies).')
    return len(fresh)


if __name__ == '__main__':
    args = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    args.add_argument('--dry-run', action='store_true', help='search and print, but write nothing and send nothing')
    options = args.parse_args()
    load_env()
    check(dry_run=options.dry_run)
