# Test for builds2-sync.py: plain asserts against fake sheet and fake API.
# Run: python interviews/coframe_builds/builds2-sync_test.py
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("builds2-sync.py")
_spec = importlib.util.spec_from_file_location("builds2_sync", _p)
m = importlib.util.module_from_spec(_spec)
sys.modules["builds2_sync"] = m
_spec.loader.exec_module(m)

SEED = [
    {"id": "v1", "name": "Hero copy A", "status": "ready_for_review"},
    {"id": "v2", "name": "Pricing table", "status": "ready_for_review"},
    {"id": "v3", "name": "Old banner", "status": "launched"},
]


def row(vid, status, *votes):
    return {"variant_id": vid, "name": vid, "status": status, **dict(zip(m.REVIEWERS, votes))}


# The decision rule: any No wins, blanks are undecided, Skip counts only beside a Yes.
assert m.decision(row("x", "", "Yes", "Yes", "Skip", "Yes")) == "approved"
assert m.decision(row("x", "", "Yes", "No", "Yes", "Yes")) == "need_fixes"
assert m.decision(row("x", "", "Yes", "", "Yes", "Yes")) is None
assert m.decision(row("x", "", "Skip", "Skip", "Skip", "Skip")) is None

api = m.FakeApi(SEED)
sheet = m.FakeSheet([
    row("v1", "ready_for_review", "Yes", "Yes", "Skip", "Yes"),   # approved in the sheet
    row("v3", "launched", "No", "Yes", "Yes", "Yes"),            # late No on a launched variant
    row("v9", "approved", "Yes", "Yes", "Yes", "Yes"),           # the API has never heard of it
])

# Dry run: the full report, zero writes.
dry = m.sync(sheet, api, dry_run=True)
assert dry["counts"] == {"set_status": 1, "set_sheet_status": 1, "add_row": 1, "conflict": 1, "orphan": 1}, dry["counts"]
assert api.writes == 0 and sheet.writes == 0
assert m.report(dry).startswith("DRY RUN ")

# Real run applies the same plan.
res = m.sync(sheet, api)
assert res["counts"] == dry["counts"] and not res["errors"]
status = {v["id"]: v["status"] for v in api.list_variants()}
assert status == {"v1": "approved", "v2": "ready_for_review", "v3": "launched"}
assert any(r["variant_id"] == "v2" for r in sheet.rows())          # new variant appeared in the sheet
assert any(r["variant_id"] == "v9" for r in sheet.rows())          # orphan row kept, not deleted

# Idempotent: a second run writes nothing (conflict and orphan are reported, not written).
w = (api.writes, sheet.writes)
again = m.sync(sheet, api)
assert (api.writes, sheet.writes) == w
assert set(again["counts"]) == {"conflict", "orphan"}

# The API restarts and forgets the approval. Reconciling re-applies it; an event-only sync would not.
api.restart()
assert {v["id"]: v["status"] for v in api.list_variants()}["v1"] == "ready_for_review"
after = m.sync(sheet, api)
assert after["counts"].get("set_status") == 1
assert {v["id"]: v["status"] for v in api.list_variants()}["v1"] == "approved"

# A failed write is reported, the rest proceed, the sheet does not mirror a status the API refused, the next run heals.
sheet.update("v2", "product", "Yes")
sheet.update("v2", "brand", "No")
api.fail_ids.add("v2")
bad = m.sync(sheet, api)
assert [e["variant_id"] for e in bad["errors"]] == ["v2"]
assert next(r for r in sheet.rows() if r["variant_id"] == "v2")["status"] == "ready_for_review"
api.fail_ids.clear()
good = m.sync(sheet, api)
assert not good["errors"]
assert {v["id"]: v["status"] for v in api.list_variants()}["v2"] == "need_fixes"
assert next(r for r in sheet.rows() if r["variant_id"] == "v2")["status"] == "need_fixes"

print(m.report(good))
print("builds2-sync: ok")
