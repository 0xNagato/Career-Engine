"""Compose the daily top jobs. Prints by default.

Run:  python3 engine/digest.py [--send] [--top N] [--db PATH]
"""
import argparse
import json
from datetime import datetime
from pathlib import Path

import common
import store
from sources import SOURCES
from textsafe import chat_safe, safe_link

PREFIXES = tuple(p for m in SOURCES.values() for p in m.PREFIXES)


def compose(db, top=5):
    """Returns (text, ids). Title, company, location and reason pass through chat_safe; the link is the stored checked one."""
    rows = [r for r in store.top_unshown(db, top * 3) if safe_link(r['url'], PREFIXES)][:top]
    if not rows:
        return '', []
    today = datetime.now()
    out = [f'Remote jobs, {today.day} {today:%b} ({len(rows)} of {store.count_unshown(db)} new)']
    for r in rows:
        place = chat_safe(r['location'] or ' '.join(json.loads(r['regions'])), 60) or 'location not stated'
        out += ['', f"#{r['id']}  score {r['score']}",  # numbers on a line of their own, away from post text
                f"Title: {chat_safe(r['title'], 100)}", f"Company: {chat_safe(r['company'], 60)}",
                f"Where: {place}, {r['employment'].replace('_', ' ')}, via {r['source'].replace('_', ' ').capitalize()}",
                f"Why: {chat_safe(r['reason'], 200)}", r['url']]
    first = rows[0]['id']
    out += ['', f'Reply: apply {first}, skip {first} too junior, more {first}']
    return '\n'.join(out), [r['id'] for r in rows]


def main(argv=None):
    args = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    args.add_argument('--send', action='store_true', help='send through the chat channel and mark the jobs shown')
    args.add_argument('--top', type=int, default=5)
    args.add_argument('--db', type=Path, help='read this database instead of data/careers.db')
    options = args.parse_args(argv)
    common.load_env()
    db = store.connect(options.db)
    text, ids = compose(db, options.top)
    if not ids:
        print('Nothing new to show.')
        return
    if options.send:
        if common.notify(text):
            store.mark_shown(db, ids)
    else:
        print(text)


if __name__ == '__main__':
    main()
