import json

from sources.base import get_json, make_job, salary_text

NAME = 'himalayas'
PREFIXES = ('https://himalayas.app/',)
MIN_HOURS = 3
URL = 'https://himalayas.app/jobs/api?limit=20&offset={}'


def fetch():
    jobs = []
    for page in range(5):
        batch = get_json(URL.format(page * 20)).get('jobs', [])
        jobs += batch
        if len(batch) < 20:
            break
    return json.dumps({'jobs': jobs}).encode()


def parse(raw):
    out = []
    for j in json.loads(raw).get('jobs', []):
        url = next((u for u in (j.get('guid'), j.get('applicationLink')) if isinstance(u, str) and u.startswith(PREFIXES)), '')
        regions = j.get('locationRestrictions') or []
        job = make_job(NAME, PREFIXES, url, url, j.get('title', ''), j.get('companyName', ''),
                       ', '.join(r for r in regions if isinstance(r, str)), regions, True,
                       j.get('employmentType', ''), salary_text(j.get('minSalary'), j.get('maxSalary'), j.get('currency') or '', j.get('salaryPeriod') or ''),
                       (j.get('categories') or [])[:8] if isinstance(j.get('categories'), list) else [],
                       j.get('description') or j.get('excerpt') or '', j.get('pubDate'))
        if job:
            out.append(job)
    return out
