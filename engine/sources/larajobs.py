from sources.base import http_get, make_job
from xmlsafe import xml_root

NAME = 'larajobs'
PREFIXES = ('https://larajobs.com/',)
MIN_HOURS = 3
JOB_NS = '{https://larajobs.com}'  # the feed's own namespace for company, location, salary and tags
CONTENT = '{http://purl.org/rss/1.0/modules/content/}encoded'  # where this feed keeps the full post


def fetch():
    return http_get('https://larajobs.com/feed', 2_000_000)


def parse(raw):
    out = []
    for item in xml_root(raw).iterfind('.//item'):
        field = {t: (item.findtext(t) or '').strip() for t in ('guid', 'title', 'link', 'description', 'pubDate')}
        ns = lambda tag: item.findtext(JOB_NS + tag) or ''  # noqa: E731
        where = ns('location')
        job = make_job(NAME, PREFIXES, field['guid'], field['link'], field['title'], ns('company'), where,
                       [where] if where else [], 'remote' in where.lower(), '', ns('salary'),
                       [t for t in ns('tags').split(',') if t.strip()], field['description'] or item.findtext(CONTENT) or '',
                       field['pubDate'])
        if job:
            out.append(job)
    return out
