"""Company job boards named in engine/watchlist.json (Greenhouse, Ashby, Lever). fetch() wraps the responses in JSON."""
import html
import json
from pathlib import Path

from sources.base import get_json, make_job

NAME = 'boards'
PREFIXES = ('https://job-boards.greenhouse.io/', 'https://boards.greenhouse.io/', 'https://jobs.ashbyhq.com/', 'https://jobs.lever.co/')
MIN_HOURS = 12
CAP = 16_000_000
WATCHLIST = Path(__file__).resolve().parent.parent / 'watchlist.json'
ENDPOINTS = {
    'greenhouse': 'https://boards-api.greenhouse.io/v1/boards/{}/jobs?content=true',
    'ashby': 'https://api.ashbyhq.com/posting-api/job-board/{}',
    'lever': 'https://api.lever.co/v0/postings/{}?mode=json',
}


def watchlist():
    return json.loads(WATCHLIST.read_text())


def slugs(kind, wl):
    value = wl.get(kind) or []
    return list(value)  # a list of slugs, or a dict of slug -> allowed URL prefixes


def fetch():
    wl = watchlist()
    result = {}
    for kind, endpoint in ENDPOINTS.items():
        result[kind] = {}
        for slug in slugs(kind, wl):
            try:
                result[kind][slug] = get_json(endpoint.format(slug), CAP)
            except Exception as e:  # one failing board must not hide the others
                result[kind][slug] = {'error': str(e)[:100]}
    return json.dumps(result).encode()


def parse(raw):
    wl, data, out = watchlist(), json.loads(raw), []
    for slug, board in (data.get('greenhouse') or {}).items():
        extra = tuple((wl.get('greenhouse') or {}).get(slug, ())) if isinstance(wl.get('greenhouse'), dict) else ()
        allowed = tuple(p for p in extra if p.startswith(PREFIXES + ('https://www.anthropic.com/',)))
        for j in board.get('jobs', []) if isinstance(board, dict) else []:
            where = (j.get('location') or {}).get('name', '')
            job = make_job(NAME, allowed or PREFIXES, f"greenhouse:{slug}:{j.get('id')}", j.get('absolute_url'), j.get('title', ''),
                           j.get('company_name') or slug, where, [where] if where else [], 'remote' in where.lower(), '', '', [],
                           html.unescape(j.get('content') or ''), j.get('first_published') or j.get('updated_at'))
            if job:
                out.append(job)
    for slug, board in (data.get('ashby') or {}).items():
        for j in board.get('jobs', []) if isinstance(board, dict) else []:
            where = j.get('location') or ''
            job = make_job(NAME, PREFIXES, f"ashby:{slug}:{j.get('jobUrl')}", j.get('jobUrl'), j.get('title', ''), slug, where,
                           [where] if where else [], j.get('isRemote') is True or 'remote' in where.lower(),
                           j.get('employmentType') or '', '', [], j.get('descriptionPlain') or '', j.get('publishedAt'),
                           html_description=False)
            if job:
                out.append(job)
    for slug, board in (data.get('lever') or {}).items():
        for j in board if isinstance(board, list) else []:
            cat = j.get('categories') or {}
            where = cat.get('location') or ''
            job = make_job(NAME, PREFIXES, f"lever:{slug}:{j.get('id')}", j.get('hostedUrl'), j.get('text', ''), slug, where,
                           [where] if where else [], j.get('workplaceType') == 'remote' or 'remote' in where.lower(),
                           cat.get('commitment') or '', '', [], j.get('descriptionPlain') or '', '', html_description=False)
            if job:
                out.append(job)
    return out
