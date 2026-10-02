# Exercise: a durable step runner. Each step's result is checkpointed by (run id, step name); after a crash a rerun skips finished steps, and side effects carry an idempotency key.
# Run the test: python interviews/coframe_builds/builds-durable-runner_test.py
import json
import sqlite3


class Runner:
    """Checkpoints in SQLite here; in production the same two columns live in Postgres."""

    def __init__(self, db):
        self.db = db
        db.execute(
            "create table if not exists steps("
            " run text, step text, status text, out text,"
            " primary key (run, step))"
        )

    def _get(self, run, name):
        return self.db.execute("select status, out from steps where run=? and step=?", (run, name)).fetchone()

    def _put(self, run, name, status, out=None):
        self.db.execute(
            "insert into steps values (?,?,?,?) on conflict(run, step) do update set status=excluded.status, out=excluded.out",
            (run, name, status, None if out is None else json.dumps(out)),
        )
        self.db.commit()                                   # durable before the next step starts

    def step(self, run, name, fn):
        """Pure or repeatable work (an LLM call you are happy to pay for twice). Replays the recorded result."""
        row = self._get(run, name)
        if row and row[0] == "done":
            return json.loads(row[1])
        out = fn()
        self._put(run, name, "done", out)
        return out

    def effect(self, run, name, fn):
        """A side effect. fn receives the idempotency key and must pass it downstream.
        'started' is written first, so after a crash we know this call was in flight."""
        row = self._get(run, name)
        if row and row[0] == "done":
            return json.loads(row[1])
        self._put(run, name, "started")
        out = fn("%s:%s" % (run, name))                      # same key on every attempt of this step
        self._put(run, name, "done", out)
        return out

    def in_flight(self, run):
        """Steps that started and never recorded a result: the crash window."""
        return [r[0] for r in self.db.execute("select step from steps where run=? and status='started'", (run,))]
