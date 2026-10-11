"""Three RSS feeds. fetch() joins them in a small JSON wrapper so parse() stays pure."""
import json

from sources.base import http_get, make_job
from xmlsafe import xml_root

NAME = 'weworkremotely'
PREFIXES = ('https://weworkremotely.com/',)
MIN_HOURS = 3
FEEDS = ('remote-back-end-programming-jobs', 'remote-full-stack-programming-jobs', 'remote-devops-sysadmin-jobs')


def fetch():
    feeds = [http_get(f'https://weworkremotely.com/categories/{name}.rss').decode('utf-8') for name in FEEDS]
    return json.dumps({'feeds': feeds}).encode()


def parse(raw):
    out = []
    for feed in json.loads(raw).get('feeds', []):
        for item in xml_root(feed.encode('utf-8')).iterfind('.//item'):
            field = {t: (item.findtext(t) or '').strip() for t in ('title', 'link', 'description', 'region', 'pubDate', 'guid')}
            company, _, role = field['title'].partition(': ')
            if not role:
                company, role = '', field['title']
            region = field['region']
            job = make_job(NAME, PREFIXES, field['guid'] or field['link'], field['link'], role, company, region,
                           [region] if region else [], True, '', '', [], field['description'], field['pubDate'])
            if job:
                out.append(job)
    return out
