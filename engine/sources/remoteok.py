import json

from sources.base import http_get, make_job, salary_text

NAME = 'remoteok'
PREFIXES = ('https://remoteok.com/', 'https://remoteOK.com/')
MIN_HOURS = 6


def fetch():
    return http_get('https://remoteok.com/api')


def parse(raw):
    out = []
    for j in json.loads(raw):
        if not isinstance(j, dict) or 'position' not in j:  # the first element is a legal notice
            continue
        where = j.get('location') or ''
        job = make_job(NAME, PREFIXES, j.get('id'), j.get('url'), j.get('position', ''), j.get('company', ''),
                       where, [where] if where else [], True, '', salary_text(j.get('salary_min'), j.get('salary_max')),
                       j.get('tags') or [], j.get('description') or '', j.get('date'))
        if job:
            out.append(job)
    return out
