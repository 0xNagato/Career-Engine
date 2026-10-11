"""Record a decision about a job.

Run:  python3 engine/decide.py apply 412 | skip 412 "too junior" | more 412
"""
import argparse
import sys

import store


def main(argv=None):
    args = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    args.add_argument('action', choices=('apply', 'skip', 'more'))
    args.add_argument('job_id', type=int)
    args.add_argument('reason', nargs='*')
    options = args.parse_args(argv)
    try:
        store.record_decision(store.connect(), options.job_id, options.action, ' '.join(options.reason))
    except KeyError as e:
        sys.exit(str(e.args[0]))
    print(f'{options.action} {options.job_id} recorded')


if __name__ == '__main__':
    main()
