"""Fetch the job sources, store new jobs, filter by eligibility, score the rest.

Run:  python3 engine/intake.py [--no-score] [--dry-run] [--limit N] [--only source]
"""
import argparse
import sys
import tempfile
from pathlib import Path

import common
import eligibility
import score
import store
from sources import SOURCES
from textsafe import clean, safe_link


def run(db, sources, only=None, ignore_due=False):
    """Fetch, parse and store. Returns {source: [fetched, added, yes, unknown, no, error]}."""
    table = {}
    for name, mod in sources.items():
        if only and name != only:
            continue
        if not ignore_due and not store.due(db, name, mod.MIN_HOURS):
            continue
        row = table[name] = [0, 0, 0, 0, 0, '']
        try:
            jobs = mod.parse(mod.fetch())
            row[0] = len(jobs)
            for job in jobs:
                if not safe_link(job['url'], mod.PREFIXES):
                    continue
                job_id = store.add_job(db, job)
                if job_id is None:
                    continue
                row[1] += 1
                verdict, _ = eligibility.check(job)
                row[{'yes': 2, 'unknown': 3, 'no': 4}[verdict]] += 1
                store.set_state(db, job_id, 'unscored' if verdict != 'no' and eligibility.relevant(job) else 'ineligible')
        except Exception as e:  # one failing source must not stop the others
            row[5] = clean(e, 100)
        store.log_run(db, name, row[0], row[1], row[5])
    return table


def main(argv=None):
    args = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    args.add_argument('--no-score', action='store_true')
    args.add_argument('--dry-run', action='store_true', help='use a temporary database and ignore the fetch schedule')
    args.add_argument('--limit', type=int, default=None, help='most jobs to score in this run')
    args.add_argument('--only', help='one source name')
    options = args.parse_args(argv)
    common.load_env()
    path = Path(tempfile.mkdtemp()) / 'careers.db' if options.dry_run else None
    db = store.connect(path)
    table = run(db, SOURCES, options.only, options.dry_run)
    print(f"{'source':<16}{'fetched':>8}{'added':>7}{'yes':>5}{'unk':>5}{'no':>5}  error")
    for name, r in table.items():
        print(f'{name:<16}{r[0]:>8}{r[1]:>7}{r[2]:>5}{r[3]:>5}{r[4]:>5}  {r[5]}')
    totals = [sum(r[i] for r in table.values()) for i in range(5)]
    scored = 0 if options.no_score else score.score_pending(db, score.load_profile(), options.limit)
    print(f"{'total':<16}{totals[0]:>8}{totals[1]:>7}{totals[2]:>5}{totals[3]:>5}{totals[4]:>5}  scored {scored}")
    if path:
        print(f'database: {path}')


if __name__ == '__main__':
    main()
