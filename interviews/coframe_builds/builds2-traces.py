# Exercise: from flat span events, build each run's tree; wall time, cost, tokens, the critical path, failing tool calls; a summary an agent can read to fix itself.
# Run its test: python interviews/coframe_builds/builds2-traces_test.py
from collections import defaultdict

LEAF_KINDS = ("llm", "tool")   # sum cost here only: a parent span may carry a roll-up, summing it double counts


def build(spans: list[dict]) -> dict[str, dict]:
    """Group by run, index children, find roots. A span whose parent never arrived is an orphan root."""
    runs: dict[str, dict] = {}
    for s in spans:
        run = runs.setdefault(s["run_id"], {"spans": {}, "kids": defaultdict(list), "roots": [], "orphans": []})
        run["spans"].setdefault(s["span_id"], s)          # duplicate delivery: keep the first
    for run in runs.values():
        for s in run["spans"].values():
            pid = s.get("parent_id")
            if pid is None:
                run["roots"].append(s)
            elif pid in run["spans"]:
                run["kids"][pid].append(s)
            else:
                run["roots"].append(s)                     # parent dropped by sampling or still in flight
                run["orphans"].append(s["span_id"])
        for k in run["kids"].values():
            k.sort(key=lambda s: s["start"])
    return runs


def critical_path(span: dict, kids: dict) -> list[dict]:
    """Walk back from the span's end: the child that finished last is what it waited for; repeat before its start."""
    chosen, t = [], max([span["end"]] + [c["end"] for c in kids.get(span["span_id"], [])])
    for c in sorted(kids.get(span["span_id"], []), key=lambda c: c["end"], reverse=True):
        if c["end"] <= t:
            chosen.insert(0, c)
            t = c["start"]
    out = [span]
    for c in chosen:
        out += critical_path(c, kids)
    return out


def analyse(run_id: str, run: dict) -> dict:
    spans = list(run["spans"].values())
    leaves = [s for s in spans if s.get("kind") in LEAF_KINDS]
    root = min(run["roots"], key=lambda s: s["start"])
    path = critical_path(root, run["kids"]) if len(run["roots"]) == 1 else []
    failures = []
    for s in spans:
        if s.get("kind") == "tool" and s.get("status") == "error":
            # ponytail: O(failures x spans) scan for a later successful sibling; index by (parent, name) for huge runs
            later_ok = any(o["name"] == s["name"] and o.get("parent_id") == s.get("parent_id")
                           and o["start"] >= s["end"] and o.get("status") == "ok" for o in spans)
            failures.append({"span": s, "recovered": later_ok})
    failures.sort(key=lambda f: f["span"]["start"])
    t0 = min(s["start"] for s in spans)
    failed = root.get("status") == "error" or any(not f["recovered"] for f in failures)
    return {
        "run_id": run_id,
        "status": "error" if failed else "ok",
        "wall": max(s["end"] for s in spans) - t0,          # not the sum: parallel tool calls overlap
        "cost": sum(s.get("cost") or 0 for s in leaves),
        "tokens": sum(s.get("tokens") or 0 for s in spans if s.get("kind") == "llm"),
        "spans": len(spans),
        "path": [s for s in path if s.get("kind") in LEAF_KINDS],
        "failures": failures,
        "orphans": run["orphans"],
        "t0": t0,
    }


def summary(a: dict) -> str:
    """Compact on purpose: it goes into an agent's context, so every line must earn its tokens."""
    lines = [f"run {a['run_id']}: {a['status']} | wall {a['wall']:.1f}s | cost ${a['cost']:.4f} | "
             f"tokens {a['tokens']:,} | {a['spans']} spans"]
    if a["path"]:
        lines.append("critical path: " + " > ".join(
            f"{s['name']} ({s['kind']} {s['end'] - s['start']:.1f}s)" for s in a["path"]))
    else:
        lines.append("critical path: unknown (several roots)")
    for f in a["failures"]:
        s = f["span"]
        tag = "recovered by retry" if f["recovered"] else "NOT recovered"
        lines.append(f"failed tool: {s['name']} at +{s['start'] - a['t0']:.1f}s: {s.get('error', 'no message')} ({tag})")
    if a["orphans"]:
        lines.append(f"warning: {len(a['orphans'])} span(s) with a missing parent: {', '.join(a['orphans'])}")
    return "\n".join(lines)


def report(spans: list[dict]) -> str:
    runs = build(spans)
    return "\n\n".join(summary(analyse(rid, runs[rid])) for rid in sorted(runs))
