# Career Engine

Small scripts that read public remote-job sources, drop the roles I cannot take, ask a model to score the rest against my profile, and send me a short daily list. They also watch my inbox for replies from companies I have a lead with. The model is called through [OpenClaw](https://github.com/openclaw/openclaw).

## Three zones

Intake has no tools: it fetches public pages, parses them in plain code and makes one bare model call per job, so a hostile post can at worst earn a wrong score. The agent only sees checked records: every stored field has passed the text cleaners and every link has passed the link check. Anything done in my name, such as a message or an application, waits for my approval.

## Commands

| Command | What it does |
|---|---|
| `python3 engine/intake.py [--no-score] [--dry-run] [--limit N] [--only source]` | Fetches each source that is due, stores new jobs, applies the eligibility and relevance rules, then scores until `--limit` or the daily cap. `--dry-run` uses a temporary database (its path is printed) and ignores the fetch schedule. `--dry-run` fetches into a temporary database and scores nothing, because model calls are only counted on the real one. At most `SCORE_CAP` model calls are made a day (default 40, never more than 60), one source may use a third of them, and only one scoring run happens at a time. |
| `python3 engine/digest.py [--send] [--top N] [--db PATH]` | Prints the top scored jobs not yet shown (score 70 or more, eligible). `--send` sends it and marks the jobs shown. |
| `python3 engine/decide.py apply 412` / `skip 412 "too junior"` / `more 412` | Records my decision. Recent skip reasons are shown to the model when it scores later jobs. |
| `python3 engine/check_job_response.py [--dry-run]` | Searches the mailbox for replies from companies in the JSON ledger (`data/career_ledger.json`). |
| `python3 engine/check.py` | Offline self-check: no network, model or mailbox. |

## Sources

| Source | Feed | Hours between fetches |
|---|---|---|
| himalayas | JSON API, 5 pages | 3 |
| remotive | JSON API | 6 |
| remoteok | JSON API | 6 |
| weworkremotely | 3 RSS feeds | 3 |
| jobicy | JSON API | 6 |
| workingnomads | JSON API | 6 |
| larajobs | RSS (no descriptions) | 3 |
| hn_hiring | newest "Who is hiring?" thread, top-level comments | 12 |
| boards | Greenhouse, Ashby, Lever boards named in `engine/watchlist.json` | 12 |

Each source module in `engine/sources/` has `fetch()` (network) and `parse()` (pure, run by the self-check on a saved sample in `engine/samples/`). One failing source does not stop the others.

## Setup

You need Python 3.9 or newer (no packages) and the `openclaw` command. For the reply checker you also need [himalaya](https://github.com/pimalaya/himalaya) 2.x with a mail account.

```bash
cp .env.example .env                                   # set NOTIFY_TARGET (and NOTIFY_CHANNEL if not whatsapp)
mkdir profile
cp examples/preferences.example.md profile/preferences.md   # describe yourself and your constraints
cp examples/facts.example.md profile/facts.md               # optional: claims with evidence
```

`profile/`, `data/`, `outbox/`, `journal/`, `notes/`, `b2b/`, `.env` and `*.db` are ignored by git, and the self-check fails if git tracks any of those folders. Optional settings: `OPENCLAW_AGENT` (default `main`), `OPENCLAW_SCORING_MODEL` (passed as `--model`), `SCORE_CAP` (verdicts per day, default 40).

## Limits

- **Eligibility is a text rule.** The code reads the region fields and location text. "Remote" with no region is passed to the model as unknown; the model sees only your profile files.
- **Job posts are untrusted text.** Scoring uses `openclaw infer model run --local`, which in OpenClaw 2026.9.8 sends one prompt message with no tools and no session (checked in its source); the code refuses a reply that came by any other path and accepts only one JSON object with a known CV variant. Re-check after an OpenClaw upgrade.
- **What reaches chat is limited.** Stored text has links removed and is one capped line. In the digest, post text is cut down to letters, digits, spaces and a few plain marks after Unicode folding. A link is only stored or sent if it sits under its source's prefix and has only plain URL characters. You answer by number (`apply 412`).
- **Duplicates.** The same company and title seen within 30 days is not stored again, even from another source.
- **Daily cap.** At most `SCORE_CAP` verdicts per UTC day; unscored jobs wait for the next run.
- **Source terms.** Remotive asks for few requests a day, so it is fetched at most every 6 hours.
- **Nothing here applies for jobs.** Applications are done by hand or by an agent after I approve.
- **Email matching is by company name** in the sender or subject, so a newsletter that mentions the company also counts.
- **The reply checker still uses the JSON ledger,** not the database.

## Files

| Path | What it is |
|---|---|
| `engine/intake.py`, `digest.py`, `decide.py` | The three commands |
| `engine/store.py`, `eligibility.py`, `score.py`, `model.py` | Database, rules, scoring prompt, model call |
| `engine/textsafe.py`, `xmlsafe.py` | Text cleaners, link check, safe XML parser |
| `engine/sources/`, `samples/`, `watchlist.json` | Source modules, saved responses, company boards |
| `engine/common.py`, `check_job_response.py`, `check.py` | Settings and ledger, mailbox watcher, self-check |
| `examples/` | Profile templates |
| `protocols/` | Working notes and tool signatures given to the agent |
