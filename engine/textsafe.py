"""Text cleaners. Everything from a job post passes through one of these before it is stored or sent.

chat_safe: every short field a person may be shown (title, company, salary, tags, the model's reason).
text_only: the long description and the location, which are read by code and by the tool-free model only;
           the location is shown to a person only through chat_safe in digest.py.
"""
import html
import re
import unicodedata


def clean(text, limit):
    """One line of printable text, capped. Text from a post or a model reply passes through this before it is stored or sent."""
    text = ''.join(ch if ch.isprintable() else ' ' for ch in str(text))
    return re.sub(r'\s+', ' ', text).strip()[:limit]


def text_only(text, limit):
    """clean(), minus anything that looks like a link. The only link we store or send is the checked job link."""
    return clean(re.sub(r'(?i)\b(?:https?://|www\.)\S+', '[link removed]', str(text)), limit)


def chat_safe(text, limit):
    """For post text shown in a chat message. Only letters, digits, spaces and a few plain marks survive,
    so the chat app has nothing to turn into a link, a mention, a command or formatting."""
    folded = unicodedata.normalize('NFKC', str(text))
    return clean(''.join(ch if ch.isalpha() or ch.isdecimal() or ch in " ,()&+#'!?-" else ' ' for ch in folded), limit)


def safe_link(link, prefixes):
    """True for a link under one of the allowed prefixes made only of plain URL characters."""
    for prefix in prefixes:
        if link.startswith(prefix) and len(link) <= 400 and re.fullmatch(r'[A-Za-z0-9\-._~/%?=&#+:,]*', link[len(prefix):]):
            return True
    return False


def short_list(value):
    return [chat_safe(x, 40) for x in value[:8] if isinstance(x, str)] if isinstance(value, list) else []


def plain(text, limit=4000):
    """Descriptions are HTML. Keep the words, drop the tags."""
    return text_only(html.unescape(re.sub(r'<[^>]+>', ' ', text)), limit)
