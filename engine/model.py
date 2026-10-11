"""One bare local model call, and strict parsing of its reply."""
import json
import os
import re
import subprocess

VARIANTS = ('agent-systems', 'rust-backend', 'laravel-fullstack')
FENCE = re.compile(r'^```(?:json)?\s*\n(.*)\n```$', re.S)


def reply_text(stdout):
    """`openclaw infer model run --local --json` prints one JSON object with the reply in outputs[].text.

    Only the local transport is accepted. In OpenClaw 2026.9.8 it sends the model the single prompt message
    and nothing else: no tools, no session. The gateway transport is a different code path, so it is refused.
    """
    result = json.loads(stdout)
    if result.get('ok') is not True or result.get('capability') != 'model.run' or result.get('transport') != 'local':
        raise RuntimeError('reply did not come from a local one-shot model run')
    return ''.join(output.get('text') or '' for output in result.get('outputs', []))


def parse_verdict(text):
    """The whole reply must be one JSON object, optionally inside a code fence. Anything else is rejected."""
    text = text.strip()
    fenced = FENCE.match(text)
    verdict = json.loads(fenced.group(1) if fenced else text)  # raises on trailing text or a second object
    if not isinstance(verdict, dict):
        raise ValueError('reply is not a JSON object')
    score = verdict.get('score')
    if (not isinstance(verdict.get('eligible'), bool) or type(score) is not int or not 0 <= score <= 100
            or not isinstance(verdict.get('reason', ''), str) or verdict.get('variant') not in VARIANTS):
        raise ValueError('reply is not a valid verdict')
    return verdict


def run_model(prompt):
    """Send one prompt to the model on the local transport and return the reply text. A hostile post can at worst earn a wrong score."""
    argv = ['openclaw', 'infer', 'model', 'run', '--agent', os.environ.get('OPENCLAW_AGENT', 'main'), '--local', '--json']
    if os.environ.get('OPENCLAW_SCORING_MODEL'):
        argv += ['--model', os.environ['OPENCLAW_SCORING_MODEL']]
    done = subprocess.run(argv + ['--prompt', prompt], capture_output=True, text=True, timeout=150)
    if done.returncode != 0:
        raise RuntimeError(done.stderr.strip()[-200:] or 'openclaw infer failed')
    return reply_text(done.stdout)
