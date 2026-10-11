"""Top-level comments of the newest "Who is hiring?" thread. fetch() wraps the story id and its comments in JSON."""
import html
import json
import re

from sources.base import get_json, make_job

NAME = 'hn_hiring'
PREFIXES = ('https://news.ycombinator.com/item?id=',)
MIN_HOURS = 12
API = 'https://hn.algolia.com/api/v1/search_by_date?'
THREADS = API + 'query=%22who%20is%20hiring%22&tags=story,author_whoishiring&hitsPerPage=2'


def fetch():
    story = get_json(THREADS)['hits'][0]['objectID']
    comments = get_json(API + f'tags=comment,story_{story}&hitsPerPage=100')
    return json.dumps({'story': str(story), 'hits': comments.get('hits', [])}).encode()


def parse(raw):
    data = json.loads(raw)
    out = []
    for c in data.get('hits', []):
        if str(c.get('parent_id')) != str(data.get('story')) or not c.get('comment_text'):
            continue
        text = re.sub(r'(?i)<p>|<br\s*/?>', '\n', c['comment_text'])  # HN comments break lines with <p>
        text = html.unescape(re.sub(r'<[^>]+>', ' ', text)).strip()
        first = text.split('\n', 1)[0]
        job = make_job(NAME, PREFIXES, c.get('objectID'), f"https://news.ycombinator.com/item?id={c.get('objectID')}",
                       first, first.split('|', 1)[0], '', [], 'remote' in text.lower(), '', '', [], text,
                       c.get('created_at'), html_description=False)
        if job:
            out.append(job)
    return out
