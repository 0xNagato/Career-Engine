import json

from sources.base import http_get, make_job

NAME = 'remotive'
PREFIXES = ('https://remotive.com/',)
MIN_HOURS = 6


def fetch():
    return http_get('https://remotive.com/api/remote-jobs?category=software-dev&limit=50')


def parse(raw):
    out = []
    for j in json.loads(raw).get('jobs', []):
        where = j.get('candidate_required_location') or ''
        job = make_job(NAME, PREFIXES, j.get('id'), j.get('url'), j.get('title', ''), j.get('company_name', ''),
                       where, str(where).split(','), True, j.get('job_type', ''), j.get('salary') or '',
                       j.get('tags') or [], j.get('description') or '', j.get('publication_date'))
        if job:
            out.append(job)
    return out
