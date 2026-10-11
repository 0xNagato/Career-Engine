"""SQLite store in data/careers.db. Parameterised SQL only."""
import json
import sqlite3
from datetime import datetime, timedelta, timezone

import common
from textsafe import chat_safe, clean, short_list

SCHEMA = """
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY, source TEXT, source_id TEXT, url TEXT UNIQUE, title TEXT, company TEXT, location TEXT,
  regions TEXT, remote INTEGER, employment TEXT, salary TEXT, tags TEXT, description TEXT, posted TEXT,
  key TEXT, first_seen TEXT, state TEXT CHECK (state IN ('new','ineligible','unscored','scored','shown','failed')));
CREATE INDEX IF NOT EXISTS jobs_key ON jobs (key);
CREATE TABLE IF NOT EXISTS verdicts (
  job_id INTEGER, eligible INTEGER, score INTEGER, reason TEXT, variant TEXT, requirements TEXT, at TEXT);
CREATE TABLE IF NOT EXISTS decisions (
  job_id INTEGER, action TEXT CHECK (action IN ('apply','skip','more')), reason TEXT, at TEXT);
CREATE TABLE IF NOT EXISTS source_runs (source TEXT, at TEXT, fetched INTEGER, added INTEGER, error TEXT);
CREATE TABLE IF NOT EXISTS score_attempts (job_id INTEGER, at TEXT);
"""


def now():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')


def ago(**delta):
    return (datetime.now(timezone.utc) - timedelta(**delta)).strftime('%Y-%m-%dT%H:%M:%S')


def connect(path=None):
    path = path or common.DB_FILE
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str(path))
    db.row_factory = sqlite3.Row
    db.executescript(SCHEMA)
    return db


def job_key(job):
    return ''.join(c for c in (job['company'] + job['title']).lower() if c.isalnum())


def add_job(db, job):
    """Row id of the new job, or None if the URL exists or the same company and title was seen in the last 30 days."""
    key = job_key(job)
    if db.execute('SELECT 1 FROM jobs WHERE url = ? OR (key = ? AND first_seen >= ?)', (job['url'], key, ago(days=30))).fetchone():
        return None
    cur = db.execute(
        'INSERT INTO jobs (source, source_id, url, title, company, location, regions, remote, employment, salary, tags,'
        ' description, posted, key, first_seen, state) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        (job['source'], job['source_id'], job['url'], job['title'], job['company'], job['location'],
         json.dumps(job['regions']), int(job['remote']), job['employment'], job['salary'], json.dumps(job['tags']),
         job['description'], job['posted'], key, now(), 'new'))
    db.commit()
    return cur.lastrowid


def get_job(db, job_id):
    row = db.execute('SELECT * FROM jobs WHERE id = ?', (job_id,)).fetchone()
    if row is None:
        return None
    job = dict(row)
    job['regions'], job['tags'], job['remote'] = json.loads(job['regions']), json.loads(job['tags']), bool(job['remote'])
    return job


def set_state(db, job_id, state):
    db.execute('UPDATE jobs SET state = ? WHERE id = ?', (state, job_id))
    db.commit()


def due(db, source, min_hours):
    last = db.execute('SELECT MAX(at) FROM source_runs WHERE source = ?', (source,)).fetchone()[0]
    return last is None or last < ago(hours=min_hours)


def log_run(db, source, fetched, added, error=''):
    db.execute('INSERT INTO source_runs VALUES (?,?,?,?,?)', (source, now(), fetched, added, clean(error, 200)))
    db.commit()


def save_verdict(db, job_id, verdict):
    db.execute('INSERT INTO verdicts VALUES (?,?,?,?,?,?,?)',
               (job_id, int(verdict['eligible']), verdict['score'], chat_safe(verdict.get('reason', ''), 200),
                verdict['variant'], json.dumps(short_list(verdict.get('key_requirements'))), now()))
    set_state(db, job_id, 'scored')


def log_attempt(db, job_id):
    """Recorded before the model is called, so a failed or crashed call still counts against the daily cap."""
    db.execute('INSERT INTO score_attempts VALUES (?,?)', (job_id, now()))
    db.commit()


def attempts_today(db):
    return db.execute('SELECT COUNT(*) FROM score_attempts WHERE substr(at, 1, 10) = ?', (now()[:10],)).fetchone()[0]


def attempts_for(db, job_id):
    return db.execute('SELECT COUNT(*) FROM score_attempts WHERE job_id = ?', (job_id,)).fetchone()[0]


def scored_today(db):
    return db.execute('SELECT COUNT(*) FROM verdicts WHERE substr(at, 1, 10) = ?', (now()[:10],)).fetchone()[0]


def record_decision(db, job_id, action, reason=''):
    if action not in ('apply', 'skip', 'more'):
        raise ValueError(f'unknown action {action!r}')
    if get_job(db, job_id) is None:
        raise KeyError(f'no job with id {job_id}')
    db.execute('INSERT INTO decisions VALUES (?,?,?,?)', (job_id, action, clean(reason, 200), now()))
    db.commit()


def top_unshown(db, n, min_score=70):
    return db.execute(
        "SELECT j.*, v.score, v.reason, v.variant FROM jobs j JOIN verdicts v ON v.job_id = j.id "
        "WHERE j.state = 'scored' AND v.eligible = 1 AND v.score >= ? ORDER BY v.score DESC, j.id LIMIT ?",
        (min_score, n)).fetchall()


def count_unshown(db, min_score=70):
    return db.execute("SELECT COUNT(*) FROM jobs j JOIN verdicts v ON v.job_id = j.id "
                      "WHERE j.state = 'scored' AND v.eligible = 1 AND v.score >= ?", (min_score,)).fetchone()[0]


def mark_shown(db, ids):
    for i in ids:
        set_state(db, i, 'shown')


def recent_skips(db, n):
    return db.execute("SELECT j.title, d.reason FROM decisions d JOIN jobs j ON j.id = d.job_id "
                      "WHERE d.action = 'skip' ORDER BY d.rowid DESC LIMIT ?", (n,)).fetchall()
