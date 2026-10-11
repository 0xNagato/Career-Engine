# Career Engine

Two small scripts that watch a job board and my inbox for me, and message me on WhatsApp when something needs attention. They use a model, called through [OpenClaw](https://github.com/openclaw/openclaw), to judge each job post against my profile.

## What it does

**`larajobs_hunter.py`** reads the [LaraJobs](https://larajobs.com) feed. For each post it has not handled before, it asks a model to score the fit from 0 to 100 and say whether I am eligible. Posts that score 80 or more are saved as leads and sent to me on WhatsApp.

**`check_job_response.py`** searches my mailbox for email from any company I have a lead or an application with. New ones are logged and sent to me in one message.

Everything is kept in one file, `data/career_ledger.json`, with three lists: `leads`, `applications` and `responses`.

```
LaraJobs feed ──> model scores the post ──> ledger ──> WhatsApp
mailbox ────────> match on company name ──> ledger ──> WhatsApp
```

## Setup

You need Python 3.9 or newer (no packages to install), the `openclaw` command with a WhatsApp channel connected, and, for the reply checker, [himalaya](https://github.com/pimalaya/himalaya) 2.x with a mail account configured.

```bash
cp .env.example .env                 # then set your WhatsApp number
cp profile.example.md profile.md     # then describe yourself and your constraints
```

`.env`, `profile.md` and `data/` are ignored by git, so nothing personal is committed.

## Run

```bash
python3 automation/larajobs_hunter.py --dry-run --limit 3   # score 3 posts, write nothing, send nothing
python3 automation/larajobs_hunter.py                       # score up to 10 new posts
python3 automation/check_job_response.py --dry-run
python3 automation/check_job_response.py
```

To run them on a schedule, add lines like these with `crontab -e`:

```
0 * * * *     cd /path/to/Career-Engine && python3 automation/larajobs_hunter.py
*/30 * * * *  cd /path/to/Career-Engine && python3 automation/check_job_response.py
```

## Check it works

```bash
python3 automation/check.py
```

This runs both scripts against made-up data, with no network, model or mailbox. It checks that a match is recorded and announced once, that a failed evaluation is retried on the next run, that every new email is logged, and that a damaged ledger stops the run instead of being overwritten. It also checks the defences: a feed carrying a DTD is refused in any encoding, a model reply that is not exactly one valid verdict is rejected, off-site links are dropped, and hostile text cannot reach the mail search.

## Limits

- **One job board, and a thin one.** Only LaraJobs is read, and its feed carries no job description. Each post is scored on its title, company, location, salary and tags.
- **The model knows only your profile file.** It has no other context about you, so location and work-authorisation limits must be written in `profile.md`.
- **Job posts are untrusted text.** A post is scored by a single model call, `openclaw infer model run --local`. In OpenClaw 2026.9.8 that path sends the model one prompt message with no tools and no session (checked in its source), and the script refuses a reply that came by any other path. A post that tries to give instructions can then at worst earn a wrong score. Re-check this after an OpenClaw upgrade.
- **What reaches you is limited too.** The company name comes from the feed, not the model. Stored post text is flattened to one capped line with links removed. In the alert itself, post text is cut down further to letters, digits, spaces and a few plain marks, so the chat app has nothing to turn into a link, a mention or a command. The only link sent is the checked `larajobs.com` one, and you answer an alert by its number (`apply 3`), which a post cannot forge.
- **The ledger still holds text written by strangers.** Titles, company names and reasons come from job posts. Any agent that reads the ledger should treat them as data, not as instructions.
- **Email matching is by company name** in the sender or subject, so a newsletter that mentions the company also counts.
- **Nothing here applies for jobs.** The WhatsApp message offers to draft a cover letter; that step is done by the agent you reply to, not by this code.
- **A post the model cannot score is retried on every run** until it succeeds or leaves the feed.

## Files

| Path | What it is |
|---|---|
| `automation/larajobs_hunter.py` | Feed reader and scorer |
| `automation/check_job_response.py` | Mailbox watcher |
| `automation/common.py` | Settings, ledger file, WhatsApp sending |
| `automation/check.py` | Offline self-check |
| `protocols/` | Working notes and tool signatures given to the agent |
