# Career Engine

Two small scripts that watch a job board and my inbox for me, and message me on WhatsApp when something needs attention. They use an [OpenClaw](https://github.com/openclaw/openclaw) agent to judge each job post against my profile.

## What it does

**`larajobs_hunter.py`** reads the [LaraJobs](https://larajobs.com) feed. For each post it has not handled before, it asks an agent to score the fit from 0 to 100 and say whether I am eligible. Posts that score 80 or more are saved as leads and sent to me on WhatsApp.

**`check_job_response.py`** searches my mailbox for email from any company I have a lead or an application with. New ones are logged and sent to me in one message.

Everything is kept in one file, `data/career_ledger.json`, with three lists: `leads`, `applications` and `responses`.

```
LaraJobs feed ──> agent scores the post ──> ledger ──> WhatsApp
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

This runs both scripts against made-up data, with no network, agent or mailbox. It checks that a match is recorded and announced once, that a failed evaluation is retried on the next run, that every new email is logged, and that a damaged ledger stops the run instead of being overwritten.

## Limits

- **One job board.** Only LaraJobs is read.
- **Job posts are untrusted text.** The prompt tells the agent to treat the post as data and not to act on it, and evaluations run in their own session. That lowers the risk of a post steering the agent, but it does not remove it. Point `OPENCLAW_AGENT` at an agent with no tools if you want a hard guarantee.
- **Email matching is by company name** in the sender or subject, so a newsletter that mentions the company also counts.
- **Nothing here applies for jobs.** The WhatsApp message offers to draft a cover letter; that step is done by the agent you reply to, not by this code.
- **A post the agent cannot score is retried on every run** until it succeeds or leaves the feed.

## Files

| Path | What it is |
|---|---|
| `automation/larajobs_hunter.py` | Feed reader and scorer |
| `automation/check_job_response.py` | Mailbox watcher |
| `automation/common.py` | Settings, ledger file, WhatsApp sending |
| `automation/check.py` | Offline self-check |
| `protocols/` | Working notes and tool signatures given to the agent |
