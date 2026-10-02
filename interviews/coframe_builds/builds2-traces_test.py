# Test for builds2-traces.py: plain asserts on a hand-built trace.
# Run: python interviews/coframe_builds/builds2-traces_test.py
import importlib.util
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("builds2-traces.py")
_spec = importlib.util.spec_from_file_location("builds2_traces", _p)
m = importlib.util.module_from_spec(_spec)
sys.modules["builds2_traces"] = m
_spec.loader.exec_module(m)


def sp(run, sid, parent, name, kind, start, end, tokens=0, cost=0.0, status="ok", **kw):
    return {"run_id": run, "span_id": sid, "parent_id": parent, "name": name, "kind": kind,
            "start": start, "end": end, "tokens": tokens, "cost": cost, "status": status, **kw}


SPANS = [
    # r1: plan, a failing fetch retried, a lint in parallel, write, then tests fail. Root carries a roll-up cost.
    sp("r1", "a", None, "variant_run", "agent", 0, 10, cost=0.036, status="error"),
    sp("r1", "b", "a", "plan", "llm", 0, 1, 1200, 0.006),
    sp("r1", "c", "a", "fetch_page", "tool", 1, 3, status="error", error="timeout after 2s"),
    sp("r1", "d", "a", "lint", "tool", 1, 2),
    sp("r1", "e", "a", "fetch_page", "tool", 3, 5),
    sp("r1", "f", "a", "write_variant", "llm", 5, 9, 3000, 0.030),
    sp("r1", "g", "a", "run_tests", "tool", 9, 10, status="error", error="2 failed: test_cta_visible"),
    sp("r1", "b", "a", "plan", "llm", 0, 1, 1200, 0.006),            # duplicate delivery
    # r2: a sub-agent with two parallel searches. Wall time 4, the sum of leaf durations is 6.
    sp("r2", "s0", None, "research", "agent", 0, 4),
    sp("r2", "s1", "s0", "subagent", "agent", 0, 4),
    sp("r2", "s2", "s1", "plan", "llm", 0, 1, 500, 0.002),
    sp("r2", "s3", "s1", "search_a", "tool", 1, 3, cost=0.001),
    sp("r2", "s4", "s1", "search_b", "tool", 1, 4, cost=0.001),
    # r3: a span whose parent never arrived.
    sp("r3", "x0", None, "run", "agent", 0, 2),
    sp("r3", "x1", "ghost", "late_tool", "tool", 1, 2),
]

runs = m.build(SPANS)
r1 = m.analyse("r1", runs["r1"])
assert r1["spans"] == 7                                  # duplicate dropped
assert r1["wall"] == 10
assert abs(r1["cost"] - 0.036) < 1e-9                    # leaves only, the root roll-up is not added again
assert r1["tokens"] == 4200
assert [s["span_id"] for s in r1["path"]] == ["b", "c", "e", "f", "g"]   # lint ran in parallel, off the path
assert [(f["span"]["span_id"], f["recovered"]) for f in r1["failures"]] == [("c", True), ("g", False)]
assert r1["status"] == "error"

r2 = m.analyse("r2", runs["r2"])
assert r2["wall"] == 4 and r2["status"] == "ok"
assert [s["name"] for s in r2["path"]] == ["plan", "search_b"]
assert abs(r2["cost"] - 0.004) < 1e-9 and r2["tokens"] == 500

r3 = m.analyse("r3", runs["r3"])
assert r3["orphans"] == ["x1"] and r3["path"] == []

text = m.report(SPANS)
print(text)
assert "run r1: error | wall 10.0s | cost $0.0360 | tokens 4,200 | 7 spans" in text
assert "critical path: plan (llm 1.0s) > fetch_page (tool 2.0s) > fetch_page (tool 2.0s) > write_variant (llm 4.0s) > run_tests (tool 1.0s)" in text
assert "failed tool: run_tests at +9.0s: 2 failed: test_cta_visible (NOT recovered)" in text
assert "failed tool: fetch_page at +1.0s: timeout after 2s (recovered by retry)" in text
assert "warning: 1 span(s) with a missing parent: x1" in text
print("builds2-traces: ok")
