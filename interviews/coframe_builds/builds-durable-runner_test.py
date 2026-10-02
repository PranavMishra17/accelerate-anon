# Tests for builds-durable-runner.py: crash a run at each point, restart from the file, count the side effects.
# Run: python interviews/coframe_builds/builds-durable-runner_test.py
import importlib.util
import os
import pathlib
import sqlite3
import sys
import tempfile

_p = pathlib.Path(__file__).with_name("builds-durable-runner.py")
_spec = importlib.util.spec_from_file_location("durable_runner", _p)
m = importlib.util.module_from_spec(_spec)
sys.modules["durable_runner"] = m
_spec.loader.exec_module(m)


class Crash(Exception):
    """Stands in for a deploy, an OOM kill or a spot reclaim."""


class Repo:
    """A fake GitHub: open_pr dedupes on the idempotency key when one is sent."""

    def __init__(self):
        self.prs, self.by_key = [], {}

    def open_pr(self, branch, key=None):
        if key in self.by_key:
            return self.by_key[key]
        n = len(self.prs) + 1
        self.prs.append(branch)
        if key:
            self.by_key[key] = n
        return n


def workflow(r, run, repo, llm_calls, crash_at=None, send_key=True):
    plan = r.step(run, "plan", lambda: llm_calls.append("plan") or ["edit header", "run tests"])
    for i, task in enumerate(plan):                        # step names are deterministic: tool:0, tool:1
        r.step(run, "tool:%d" % i, lambda t=task: llm_calls.append(t) or "ok: " + t)
    if crash_at == "before_pr":
        raise Crash()

    def open_pr(key):
        n = repo.open_pr("agent/" + run, key if send_key else None)
        if crash_at == "after_pr_before_record":
            raise Crash()                                  # the PR exists, the checkpoint does not
        return n

    return r.effect(run, "open_pr", open_pr)


def fresh_runner(path):
    return m.Runner(sqlite3.connect(path))                 # a new process: only the file survives


with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as d:   # Windows holds the db file open
    path = os.path.join(d, "runs.db")

    # 1. Crash before the side effect: a restart skips plan and both tool steps.
    repo, calls = Repo(), []
    try:
        workflow(fresh_runner(path), "r1", repo, calls, crash_at="before_pr")
    except Crash:
        pass
    assert calls == ["plan", "edit header", "run tests"]
    assert workflow(fresh_runner(path), "r1", repo, calls) == 1
    assert calls == ["plan", "edit header", "run tests"]   # nothing re-ran
    assert repo.prs == ["agent/r1"]

    # 2. The in-flight problem: crash after the PR opened, before the result was recorded.
    repo, calls = Repo(), []
    r = fresh_runner(path)
    try:
        workflow(r, "r2", repo, calls, crash_at="after_pr_before_record")
    except Crash:
        pass
    assert r.in_flight("r2") == ["open_pr"]               # we know a call was in flight
    assert workflow(fresh_runner(path), "r2", repo, calls) == 1
    assert repo.prs == ["agent/r2"]                        # the key made the retry a no-op
    assert fresh_runner(path).in_flight("r2") == []

    # 3. The same crash without a key: the restart opens a second PR. This is the bug keys exist for.
    repo, calls = Repo(), []
    try:
        workflow(fresh_runner(path), "r3", repo, calls, crash_at="after_pr_before_record", send_key=False)
    except Crash:
        pass
    workflow(fresh_runner(path), "r3", repo, calls, send_key=False)
    assert repo.prs == ["agent/r3", "agent/r3"]

    # 4. A finished run replays entirely from checkpoints; a new run id starts clean.
    repo, calls = Repo(), []
    assert workflow(fresh_runner(path), "r1", repo, calls) == 1 and calls == [] and repo.prs == []
    workflow(fresh_runner(path), "r4", repo, calls)
    assert calls == ["plan", "edit header", "run tests"] and repo.prs == ["agent/r4"]

print("builds-durable-runner: all tests passed")
