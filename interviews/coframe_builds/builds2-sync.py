# Exercise: two-way sync between an approval sheet and a variants API that forgets its state on restart: reconcile, idempotent writes, a conflict rule, dry run, a report.
# Run its test: python interviews/coframe_builds/builds2-sync_test.py
from dataclasses import dataclass

REVIEWERS = ("product", "brand", "design", "legal")
TERMINAL = {"launched", "cancelled"}       # the API owns these; the sheet never overrides them
REVIEWABLE = {"ready_for_review", "need_fixes", "approved"}


@dataclass
class Change:
    action: str        # add_row | set_status | set_sheet_status | conflict | orphan
    variant_id: str
    before: str | None = None
    after: str | None = None
    why: str = ""


def decision(row: dict) -> str | None:
    """What the sheet has decided. A blank is not a No: no decision yet."""
    votes = [str(row.get(r, "")).strip().lower() for r in REVIEWERS]
    if "no" in votes:
        return "need_fixes"
    if all(v in ("yes", "skip") for v in votes) and "yes" in votes:
        return "approved"
    return None


def plan(rows: list[dict], variants: list[dict]) -> list[Change]:
    """Pure: compare full current state of both sides, return the writes that make them agree."""
    by_id = {r["variant_id"]: r for r in rows}
    api_ids = set()
    out: list[Change] = []
    for v in variants:
        vid, status = v["id"], v["status"]
        api_ids.add(vid)
        row = by_id.get(vid)
        if row is None:
            out.append(Change("add_row", vid, None, status, "new in the API"))
            continue
        want = decision(row)
        if want and want != status:
            if status in TERMINAL:
                out.append(Change("conflict", vid, status, want, "API is terminal, sheet not applied"))
            elif status in REVIEWABLE:
                out.append(Change("set_status", vid, status, want, "sheet decision"))
                status = want
        if row.get("status") != status:
            out.append(Change("set_sheet_status", vid, row.get("status"), status, "API owns status"))
    for vid in by_id.keys() - api_ids:
        out.append(Change("orphan", vid, why="missing from API (restart?), row kept"))
    return out


def sync(sheet, api, dry_run: bool = False) -> dict:
    """Read both sides, plan, apply unless dry_run. Safe to run on a schedule: a second run writes nothing."""
    variants = api.list_variants()
    changes = plan(sheet.rows(), variants)
    names = {v["id"]: v.get("name", "") for v in variants}
    errors, failed = [], set()
    if not dry_run:
        for c in changes:
            if c.variant_id in failed:
                continue                     # do not mirror a status the API never took
            try:
                if c.action == "add_row":
                    sheet.append({"variant_id": c.variant_id, "name": names[c.variant_id], "status": c.after,
                                  **{r: "" for r in REVIEWERS}})
                elif c.action == "set_status":
                    api.patch_status(c.variant_id, c.after)     # a set, not a toggle: retrying is safe
                elif c.action == "set_sheet_status":
                    sheet.update(c.variant_id, "status", c.after)
            except Exception as e:                              # one bad write must not stop the rest
                errors.append({"variant_id": c.variant_id, "action": c.action, "error": str(e)})
                failed.add(c.variant_id)
    counts = {}
    for c in changes:
        counts[c.action] = counts.get(c.action, 0) + 1
    return {"dry_run": dry_run, "counts": counts, "changes": changes, "errors": errors}


def report(result: dict) -> str:
    body = ", ".join(f"{k} {v}" for k, v in sorted(result["counts"].items())) or "in sync"
    lines = [("DRY RUN " if result["dry_run"] else "") + body]
    for c in result["changes"]:
        move = f" {c.before} -> {c.after}" if c.before or c.after else ""
        lines.append(f"  {c.action} {c.variant_id}:{move} ({c.why})")
    for e in result["errors"]:
        lines.append(f"  ERROR {e['action']} {e['variant_id']}: {e['error']}")
    return "\n".join(lines)


# Fakes for both sides. The real ones are a Google Sheets client and the Coframe variants API.
class FakeSheet:
    def __init__(self, rows=None):
        self._rows = [dict(r) for r in rows or []]
        self.writes = 0

    def rows(self):
        return [dict(r) for r in self._rows]

    def append(self, row):
        self._rows.append(dict(row))
        self.writes += 1

    def update(self, variant_id, col, value):
        next(r for r in self._rows if r["variant_id"] == variant_id)[col] = value
        self.writes += 1


class FakeApi:
    def __init__(self, seed):
        self._seed = [dict(v) for v in seed]
        self.fail_ids: set[str] = set()
        self.writes = 0
        self.restart()

    def restart(self):
        """The mock API resets state on restart: every write since boot is gone."""
        self._v = {v["id"]: dict(v) for v in self._seed}

    def list_variants(self):
        return [dict(v) for v in self._v.values()]

    def patch_status(self, vid, status):
        if vid in self.fail_ids:
            raise ConnectionError("503")
        self._v[vid]["status"] = status
        self.writes += 1
