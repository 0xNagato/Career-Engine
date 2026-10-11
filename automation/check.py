"""Offline self-check. No network, no OpenClaw, no mailbox needed.

Run:  python3 automation/check.py
"""
import json
import os
import tempfile
from pathlib import Path

tmp = Path(tempfile.mkdtemp())
os.environ['CAREER_ENGINE_DATA'] = str(tmp)  # must be set before the modules load

import check_job_response as responses  # noqa: E402
import common  # noqa: E402
import larajobs_hunter as hunter  # noqa: E402

hunter.PROFILE_FILE = tmp / 'profile.md'
hunter.PROFILE_FILE.write_text('Backend engineer. Remote only.')

# The agent's reply is inside a run envelope, and may be wrapped in a code fence.
envelope = json.dumps({'runId': 'x', 'status': 'ok', 'result': {'payloads': [], 'meta': {
    'finalAssistantVisibleText': '```json\n{"eligible": true, "score": 91, "reason": "fits", "company_name": "Acme Inc"}\n```'}}})
verdict = hunter.parse_verdict(hunter.reply_text('log line before the json\n' + envelope))
assert verdict['eligible'] is True and verdict['score'] == 91, verdict
assert hunter.plain('<p>Senior &amp; remote</p>\n<b>PHP</b>') == 'Senior & remote PHP'

jobs = [{'guid': g, 'title': g, 'link': 'https://example.com/' + g, 'description': ''} for g in ('a', 'b', 'c')]
sent, flaky = [], {'b'}


def fake_evaluate(job, profile):
    if job['guid'] in flaky:
        raise RuntimeError('agent timed out')
    return {'eligible': True, 'score': 90 if job['guid'] == 'a' else 60, 'reason': 'r', 'company_name': 'Acme Inc'}


def record(message, dry_run=False):
    sent.append(message)


assert hunter.hunt(fetch=lambda: iter(jobs), evaluate=fake_evaluate, notify=record) == 1
assert len(sent) == 1 and 'Acme Inc' in sent[0]
assert common.read_json(hunter.STATE_FILE, {})['seen'] == ['a', 'c'], 'a failed post is not marked as handled'

flaky.clear()  # second run: only the post that failed is retried, and nothing is announced twice
assert hunter.hunt(fetch=lambda: iter(jobs), evaluate=fake_evaluate, notify=record) == 0
assert len(sent) == 1 and len(common.load_ledger()['leads']) == 1

# Replies: every new email is logged, one message is sent, and a second run finds nothing new.
assert responses.search_query(['acme inc']) == 'from "acme inc" or subject "acme inc"'
mail = [{'id': 7, 'subject': 'Interview', 'from': [{'name': 'Ada', 'email': 'ada@acme.test'}], 'date': '2026-10-11'},
        {'id': 5, 'subject': 'Thanks for applying', 'from': [{'name': None, 'email': 'jobs@acme.test'}]}]
assert responses.check(find=lambda names: mail, notify=record) == 2
assert [r['id'] for r in common.load_ledger()['responses']] == ['5', '7'] and len(sent) == 2
assert responses.check(find=lambda names: mail, notify=record) == 0 and len(sent) == 2

# A damaged ledger stops the run and is left untouched.
common.LEDGER_FILE.write_text('{"leads": [')
try:
    common.load_ledger()
    raise AssertionError('a damaged ledger must stop the run')
except SystemExit:
    assert common.LEDGER_FILE.read_text() == '{"leads": ['

print('ok: hunter, reply checker and ledger behave')
