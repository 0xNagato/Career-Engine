"""Shared by every source: the one network helper and the one place a job dict is built and checked."""
import json
import re
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

from textsafe import chat_safe, clean, plain, safe_link, short_list, text_only

USER_AGENT = 'career-engine (personal job reader; github.com/0xNagato)'


def http_get(url, cap=8_000_000):
    """GET with a timeout and a byte cap. Longer bodies are refused, not truncated."""
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as response:
        body = response.read(cap + 1)
    if len(body) > cap:
        raise ValueError(f'{url} is larger than {cap} bytes')
    return body


def get_json(url, cap=8_000_000):
    return json.loads(http_get(url, cap))


def employment_of(text):
    t = str(text).lower()
    if 'contract' in t or 'freelance' in t:
        return 'contract'
    if 'part' in t:
        return 'part_time'
    return 'full_time' if 'full' in t else 'unknown'


def iso_date(value):
    if isinstance(value, (int, float)) and value > 0:
        return datetime.fromtimestamp(value, timezone.utc).date().isoformat()
    value = str(value or '').strip()
    if re.match(r'\d{4}-\d{2}-\d{2}', value):
        return value[:10]
    try:
        return parsedate_to_datetime(value).date().isoformat()
    except (TypeError, ValueError):
        return ''


def make_job(source, prefixes, source_id, url, title, company='', location='', regions=(), remote=False,
             employment='', salary='', tags=(), description='', posted='', html_description=True):
    """Build the job dict. Fields a person may be shown go through chat_safe; location, regions and description
    go through text_only (see textsafe). None if the URL is off-site or the title is empty."""
    url = url if isinstance(url, str) else ''
    if not safe_link(url, prefixes):
        return None
    title = chat_safe(title, 120)
    if not title:
        return None
    return {
        'source': source, 'source_id': clean(source_id, 200), 'url': url, 'title': title,
        'company': chat_safe(company, 80) or 'Unknown', 'location': text_only(location, 120),
        'regions': [r for r in (text_only(x, 40).lower() for x in regions if isinstance(x, str)) if r][:8],
        'remote': bool(remote), 'employment': employment_of(employment),
        'salary': chat_safe(salary, 80), 'tags': short_list(list(tags)),
        'description': plain(str(description or ''), 6000) if html_description else text_only(description or '', 6000),
        'posted': iso_date(posted),
    }


def salary_text(low, high, currency='', period=''):
    nums = [str(int(n)) for n in (low, high) if isinstance(n, (int, float)) and n]
    return (' - '.join(nums) + f' {currency} {period}').strip() if nums else ''
