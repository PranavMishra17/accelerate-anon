"""Renders one LLD problem (a dict, see problems/locker.py) two ways:
mock_part(): the staged round a) clarify .. f) extensibility, the lines that set you apart, the final code.
cheat_tab(): one screen for part 0.5.
check(): runs every piece of code and compares its output."""
import os, subprocess, sys, tempfile, textwrap


def run(src, expect, label):
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
        f.write(src)
    out = subprocess.run([sys.executable, "-I", f.name], capture_output=True, text=True)
    os.unlink(f.name)
    assert out.returncode == 0, f"{label}: {out.stderr}"
    assert out.stdout == expect, f"{label}: got {out.stdout!r}, expected {expect!r}"


def norm(s):
    return textwrap.dedent(s).strip("\n")


def check(P):
    if "core_code" not in P:
        return
    run(P["core_code"] + P["demo"], P["demo_out"], P["id"] + " core")
    for m in P["methods"]:
        assert textwrap.indent(norm(m["code"]), "    ") in P["core_code"], f"{P['id']}: method {m['name']} is not in core_code"
    if "final_code" in P:
        run(P["final_code"] + P["final_demo"], P["final_out"], P["id"] + " final")
    for e in P.get("extensions", []):
        if e.get("run"):
            run(e["run"], e["run_out"], P["id"] + " extension")


# ---------- drawing ----------
def box(x, y, w, h, title, sub, cls="d-box"):
    return (f'<rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="6"/>'
            f'<text class="d-b" x="{x + 10}" y="{y + 20}">{title}</text>'
            f'<text class="d-s" x="{x + 10}" y="{y + 38}">{sub}</text>\n')


def class_map(label, m):
    """m: center (title, sub); owned: composition, drawn left; uses: enums, strategies or helpers, drawn right, dashed;
    links: (i, label) draws owned[i] -> owned[i+1]."""
    owned, uses = m.get("owned", []), m.get("uses", [])
    n = max(len(owned), len(uses), 1)
    h = 100 + n * 72
    s = [f'<svg viewBox="0 0 420 {h}" role="img" aria-label="{label}">\n', box(115, 6, 190, 48, *m["center"], "d-acc")]
    for i, (t, sub) in enumerate(owned):
        y = 100 + i * 72
        s.append(box(20, y, 190, 48, t, sub))
        s.append(f'<path class="d-ar" d="M115 30 L10 30 L10 {y + 24} L18 {y + 24}"/>\n')
    for i, (t, sub) in enumerate(uses):
        y = 100 + i * 72
        s.append(box(224, y, 180, 48, t, sub, "d-dashbox"))
        s.append(f'<path class="d-ar" d="M305 30 L412 30 L412 {y + 24} L406 {y + 24}"/>\n')
    for i, lab in m.get("links", []):
        y = 100 + i * 72
        s.append(f'<path class="d-ar" d="M115 {y + 48} L115 {y + 70}"/><text class="d-a" x="122" y="{y + 64}">{lab}</text>\n')
    if owned:
        s.append('<text class="d-a" x="14" y="22">owns</text>\n')
    if uses:
        s.append('<text class="d-a" x="352" y="22">uses</text>\n')
    s.append("</svg>")
    return "".join(s)


# ---------- text helpers ----------
BUCKETS = [("capabilities", "Primary capabilities"), ("errors", "Error handling"), ("scope", "Scope boundaries")]


def clarify_text(P):
    out = []
    for i, (k, name) in enumerate(BUCKETS, 1):
        out.append(f"{i}. {name}")
        out += [f"- {q}" for q, _ in P["clarify"][k]]
        out.append("")
    return "\n".join(out).strip()


def clarify_rows(P):
    return [[name, q, a] for k, name in BUCKETS for q, a in P["clarify"][k]]


def req_text(P):
    out = []
    for i, r in enumerate(P["requirements"], 1):
        out.append(f"{i}. {r[0]}")
        out += [f"   - {s}" for s in r[1:]]
    out.append(f"{len(P['requirements']) + 1}. Out of scope: " + ", ".join(P["out_of_scope"]) + ".")
    return "\n".join(out)


def entity_text(P):
    return "\n".join(f"{n}: {'keep' if k else 'drop'}. {why}" for n, k, why in P["entities"])


def class_text(P):
    out = []
    for c in P["classes"]:
        out.append(f"class {c['name']}")
        out += [f"- {s}" for s in c.get("state", [])]
        out += [f"+ {b}" for b in c.get("behaviour", [])]
        out.append("")
    return "\n".join(out).strip()


def logic_of(m):
    """The numbered 'Core logic' steps from the method's docstring, or m['logic'] when there is no code."""
    if "logic" in m:
        return m["logic"]
    lines = norm(m["code"]).splitlines()
    i = next(k for k, s in enumerate(lines) if s.strip() == "Core logic:")
    out = []
    for s in lines[i + 1:]:
        s = s.strip()
        if not s or s.endswith(":") or s.startswith('"""'):
            break
        out.append(s.split(". ", 1)[1] if s[:1].isdigit() and ". " in s else s)
    return out


def starter(m):
    first = norm(m["code"]).splitlines()[0]
    return first + '\n    """\n    Core logic:\n      1.\n    Edge cases:\n      1.\n    """\n'


def turn(ask, say, check=None, explain=None, who="Interviewer"):
    t = {"t": "turn", "who": who, "ask": ask, "say": say if isinstance(say, list) else [say]}
    if check: t["check"] = check
    if explain: t["explain"] = explain
    return t


def code(cid, title, src):
    return {"t": "code", "id": cid, "title": title, "code": norm(src) + "\n", "notes": {}}


def golden_list(P):
    return [f"**{line}** Why: {why}" for line, why in P["golden"]]


# ---------- the staged mock ----------
def design_check_blocks(P):
    """SOLID as it shows in this design, and what varies -> which pattern. Lives inside Extensibility."""
    dc = P.get("design_check")
    if not dc:
        return []
    return [
        {"t": "p", "text": "**Design check.** " + dc["lead"]},
        {"t": "table", "head": ["Principle", "Where it shows here"], "rows": [list(r) for r in dc["solid"]]},
        {"t": "p", "text": "**What varies decides the pattern.** If nothing varies, no pattern."},
        {"t": "table", "head": ["What could change", "Pattern", "In this design"], "rows": [list(r) for r in dc["varies"]]},
    ]


def mock_part(P):
    pid = P["id"]
    mp = class_map(P["title"] + " class map", P["map"])
    S = []
    S.append({"id": f"{pid}-prompt", "title": "The prompt", "blocks": [
        {"t": "p", "text": "One round, the way you'd run it: **a) clarify, b) requirements, c) entities, d) class design, e) implementation, f) extensibility.** About 40 minutes. At each stage try the box first, then open the answer. Set the switch above to Try first."},
        turn(P["prompt"], P.get("opening", "Sounds good. **Before requirements, I'd like to clarify a few things in three areas: what the system must do, how it handles errors, and where the scope stops.** Then I'll list requirements, pull out the entities, design the classes and implement the main methods."),
             check=["Do you clarify before you design?", "Do you say your plan out loud?"])]})
    S.append({"id": f"{pid}-clarify", "title": "a) Clarify", "blocks": [
        {"t": "p", "text": "Three buckets. **Primary capabilities:** what it must do. **Error handling:** what goes wrong. **Scope boundaries:** what you will not build."},
        {"t": "write", "id": f"{pid}-clarify-w", "q": "Write your questions under each bucket.",
         "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
         "hint": P["clarify_hint"], "solution": clarify_text(P), "why": P["clarify_why"], "say": P.get("clarify_say")}]})
    S.append({"id": f"{pid}-reqs", "title": "b) Requirements", "blocks": [
        {"t": "p", "text": "**The interviewer answers your questions:**"},
        turn(P["answers"], P["playback"]),
        {"t": "table", "head": ["Bucket", "Question", "Answer"], "rows": clarify_rows(P)},
        {"t": "p", "text": "Turn the answers into numbered requirements. **Each one: who does what, what the system does, and what can go wrong.** Then list what's out of scope."},
        {"t": "write", "id": f"{pid}-reqs-w", "q": "Write the requirements, numbered, then out of scope.",
         "starter": "1. \n2. \n3. \n", "hint": P["req_hint"], "solution": req_text(P), "why": P["req_why"], "say": P.get("req_say")}]})
    S.append({"id": f"{pid}-entities", "title": "c) Entities", "blocks": [
        {"t": "p", "text": "Underline the nouns in the requirements. **Keep a noun only if the design needs its data or behaviour.**"},
        {"t": "write", "id": f"{pid}-ent-w", "q": "List the nouns. For each, keep or drop, and why.",
         "starter": "\n".join(f"{n}: " for n, _, _ in P["entities"]), "hint": P["ent_hint"],
         "solution": entity_text(P), "why": P["ent_why"], "say": P.get("ent_say")}]})
    cls_blocks = [
        {"t": "p", "text": "For each class, think **requirements (−)**: the state it holds, set in __init__; and **behaviour (+)**: its methods, with what they return."},
        {"t": "write", "id": f"{pid}-classes-w", "q": "Write each class as − state and + behaviour.",
         "starter": "\n\n".join(f"class {c['name']}\n- \n+ " for c in P["classes"]), "hint": P["class_hint"],
         "solution": class_text(P), "why": P["class_why"], "say": P.get("class_say")}]
    for qa in P.get("class_qa", []):
        cls_blocks.append(turn(qa["ask"], qa["say"], explain=qa.get("explain")))
    S.append({"id": f"{pid}-classes", "title": "d) Class design", "blocks": cls_blocks})
    impl = [{"t": "svg", "svg": mp, "alt": "Class map"},
            {"t": "p", "text": "**Start with the most interesting method, not the easiest.** Write it at the level you'd say out loud: core logic as comments, edge cases, then code that names the hard part as a private helper (best = self._select_best(...)). Then write the most interesting helper the same way, and leave the plain ones for last."}]
    if P.get("skeleton"):
        k = P["skeleton"]
        impl.append({"t": "write", "id": f"{pid}-skeleton-w", "q": k["q"], "starter": k.get("starter", ""), "hint": k["hint"],
                     "solution": norm(k["code"]), "why": k["why"]})
    for m in P["methods"]:
        impl.append({"t": "write", "id": f"{pid}-m-{m['name'].replace('.', '-')}", "q": m["q"], "starter": starter(m), "hint": m["hint"],
                     "solution": norm(m["code"]), "why": m["why"]})
    hs = P.get("helpers") or []
    for k, h in enumerate([hs] if isinstance(hs, dict) else hs):     # one helpers box, or several in reading order
        impl.append({"t": "write", "id": f"{pid}-helpers-w" + (f"{k}" if k else ""), "q": h["q"], "starter": h.get("starter", ""),
                     "hint": h["hint"], "solution": norm(h["code"]), "why": h["why"]})
    S.append({"id": f"{pid}-impl", "title": "e) Implementation", "blocks": impl})
    ext = [{"t": "p", "text": "The interviewer changes the rules. **For each change, say which class it touches and what stays the same.** A good design changes in one place."}]
    ext += design_check_blocks(P)
    for e in P["extensions"]:
        ext.append(turn(e["ask"], e["say"], explain=e.get("explain")))
        if e.get("code"):
            ext.append(code(f"{pid}-ext-{len(ext)}", e["code_title"], e["code"]))
    if P.get("faq"):
        ext.append({"t": "faq", "items": [{"q": q, "a": a} for q, a in P["faq"]]})
    S.append({"id": f"{pid}-extend", "title": "f) Extensibility", "blocks": ext})
    S.append({"id": f"{pid}-explain", "title": "Explain it back", "blocks": [
        turn("Give me a summary.", P["summary"], check=["Under a minute?", "Do you end on what it can grow into?"])]})
    fin = [{"t": "p", "text": P["final_intro"]}, {"t": "svg", "svg": mp, "alt": "Class map"},
           code(f"{pid}-final-code", P["final_title"], P["final_code"] + P["final_demo"]),
           {"t": "p", "text": "The run prints: " + P["final_out_note"]}]
    S.append({"id": f"{pid}-final", "title": "The final code, in one file", "blocks": fin})
    # what sets you apart: the few thinking cues that crack the problem, shown as a panel at the top of the round
    apart = P.get("apart") or [f"**{line}** {why}" for line, why in P["golden"]]
    return {"tab": "lld", "id": P["part_id"], "n": P["n"], "one": True, "title": P["part_title"],
            "minutes": P.get("minutes", 45), "lead": P["lead"], "apart": apart, "sections": S}


# ---------- the one-screen cheat sheet ----------
def cheat_tab(P, number):
    blocks = [
        {"t": "p", "text": f"**What they ask:** {P['prompt']}"},
        {"t": "p", "text": f"**Reported:** {P['evidence']}" + (f" **Full practice:** {P['drill']}" if P.get("drill") else "")},
        {"t": "table", "head": ["Bucket", "Ask", "Usual answer"], "rows": clarify_rows(P)},
        {"t": "p", "text": "**Requirements**"},
        {"t": "list", "items": [r[0] + (" " + "; ".join(r[1:]) + "." if len(r) > 1 else "") for r in P["requirements"]]
            + ["Out of scope: " + ", ".join(P["out_of_scope"]) + "."]},
        {"t": "table", "head": ["Noun", "Keep?", "Why"], "rows": [[n, "keep" if k else "drop", w] for n, k, w in P["entities"]]},
        {"t": "code", "id": f"t10-{P['id']}-classes", "title": "Classes: − state, + behaviour", "code": class_text(P) + "\n", "notes": {}},
    ] + ([{"t": "say", "lines": [P["class_say"]]}] if P.get("class_say") else []) + [
        {"t": "svg", "svg": class_map(P["title"] + " class map", P["map"]), "alt": "Class map"},
        {"t": "p", "text": "**Core flow**"},
        {"t": "list", "items": [f"{m['name']}: " + "; ".join(logic_of(m)) + "." for m in P["methods"]]},
        {"t": "p", "text": "**Extensibility**"},
        {"t": "list", "items": [f"{e['short_q']}: {e['short_a']}" for e in P["extensions"]]},
    ] + design_check_blocks(P) + [
        {"t": "p", "text": "**What sets you apart**"},
        {"t": "list", "items": P.get("apart") or golden_list(P)[:4]},
    ]
    return {"id": f"t10-{P['id']}", "title": f"{number} {P['title']}", "blocks": blocks}
