import json

from sources.base import http_get, make_job

NAME = 'jobicy'
PREFIXES = ('https://jobicy.com/',)
MIN_HOURS = 6


def fetch():
    return http_get('https://jobicy.com/api/v2/remote-jobs?count=50&industry=dev')


def listy(value):
    return value if isinstance(value, list) else ([value] if isinstance(value, str) and value else [])


def parse(raw):
    out = []
    for j in json.loads(raw).get('jobs', []):
        geo = listy(j.get('jobGeo'))
        job = make_job(NAME, PREFIXES, j.get('id'), j.get('url'), j.get('jobTitle', ''), j.get('companyName', ''),
                       ', '.join(geo), geo, True, ' '.join(listy(j.get('jobType'))), '',
                       listy(j.get('jobIndustry')), j.get('jobDescription') or j.get('jobExcerpt') or '', j.get('pubDate'))
        if job:
            out.append(job)
    return out
