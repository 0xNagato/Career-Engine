"""Pure rules: can the candidate (Lagos, remote contractor, no US/UK/EU work authorisation) take this job?"""
import re

YES = ['worldwide', 'anywhere', 'global', 'international', 'emea', 'africa', 'nigeria']
NO = ['us', 'usa', 'united states', 'u.s.', 'north america', 'americas', 'canada', 'uk', 'united kingdom', 'eu',
      'europe', 'european', 'latam', 'latin america', 'apac', 'asia', 'australia', 'india', 'germany']
INCLUDE = ['engineer', 'developer', 'programmer', 'rust', 'laravel', 'php', 'backend', 'back-end', 'full stack',
           'full-stack', 'fullstack', 'software', 'platform', 'devops', 'sre', 'ai', 'ml', 'llm', 'agent',
           'automation', 'data engineer']
EXCLUDE = ['sales', 'marketing', 'recruiter', 'designer', 'account executive', 'customer support',
           'customer success', 'copywriter', 'hr', 'legal counsel']


def words(terms):
    return re.compile(r'(?<![a-z0-9])(?:' + '|'.join(re.escape(t) for t in terms) + r')(?![a-z0-9])')


YES_RE, NO_RE, INCLUDE_RE, EXCLUDE_RE = words(YES), words(NO), words(INCLUDE), words(EXCLUDE)
ONLY_RE = re.compile(r'(?<![a-z0-9])(?!remote only)[a-z][a-z.]* only(?![a-z0-9])')  # "remote only" is not a place


def check(job):
    """('yes' | 'no' | 'unknown', reason)"""
    if not job.get('remote'):
        return 'no', 'not remote'
    text = ' '.join(list(job.get('regions') or []) + [job.get('location') or '']).lower()
    yes, no = YES_RE.search(text), NO_RE.search(text) or ONLY_RE.search(text)
    if yes and no:  # "Anywhere in the US", "Americas, EMEA": let the model read the post
        return 'unknown', f'mentions both {yes.group()} and {no.group()}'
    if yes:
        return 'yes', f'open to {yes.group()}'
    if no:
        return 'no', f'restricted to {no.group()}'
    return 'unknown', 'no region stated'


def relevant(job):
    text = (job.get('title') or '').lower() + ' ' + ' '.join(job.get('tags') or []).lower()
    return bool(INCLUDE_RE.search(text)) and not EXCLUDE_RE.search(text)
