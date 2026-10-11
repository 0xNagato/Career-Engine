import json

from sources.base import http_get, make_job

NAME = 'workingnomads'
PREFIXES = ('https://www.workingnomads.com/',)
MIN_HOURS = 6


def fetch():
    return http_get('https://www.workingnomads.com/api/exposed_jobs/')


def parse(raw):
    out = []
    for j in json.loads(raw):
        if not isinstance(j, dict):
            continue
        where = j.get('location') or ''
        tags = j.get('tags') or []
        tags = tags.split(',') if isinstance(tags, str) else tags
        job = make_job(NAME, PREFIXES, j.get('url'), j.get('url'), j.get('title', ''), j.get('company_name', ''),
                       where, [where] if where else [], True, '', '', tags, j.get('description') or '', j.get('pub_date'))
        if job:
            out.append(job)
    return out
