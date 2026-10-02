"""Build one interview loop's page from its content module and the template.

    python interviews/build.py zenml_round3      -> interviews/zenml-round3.html

A content module (see zenml_round3.py) holds the loop's brief, spoken scripts,
technical questions, drills, questions to ask, traps and tables, and optionally
OWN: your own system, walked part by part, set against theirs. Sessions still
held in the tracker are read from index.html (SESSION_IDS), and each session's
quiz is built from its own questions: open questions with a model answer only,
no blanks and no one-word answers, at most eight. Past mocks live in
<module>.mocks.json, the latest two shown: each is a read (verdict, what landed,
what to fix) and its exchanges, every one with what was asked, what was said, a
verdict, how to approach it and the answer to say (see MOCKS.md for the shape).
"""
import html, importlib, io, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)


def sessions_from_tracker(ids):
    if not ids:
        return []   # a loop can be prep-only, with no tracker sessions
    out = subprocess.run(["node", os.path.join(HERE, "extract.js"), ",".join(i for i, _ in ids)],
                         capture_output=True, text=True, encoding="utf-8", check=True).stdout
    data = json.loads(out)
    days = dict(ids)
    for s in data:
        s["day"] = days[s["id"]]
    return data


def ans_text(ans):
    if isinstance(ans, list):
        return " ".join(a.rstrip(".") + "." for a in ans)
    return ans or ""


def quiz_for(s, cap=8):
    """Open questions only: short, why and figure closers, pick closers as open
    questions answered by their correct option, then 'say it' prompts from steps."""
    qs = []

    def take(closers):
        for c in closers or []:
            k = c.get("k")
            if k in ("short", "why", "figure"):
                qs.append({"q": c["q"], "a": c["a"]})
            elif k == "pick" and isinstance(c.get("a"), int):
                a = c["o"][c["a"]] + (". " + c["why"] if c.get("why") else "")
                qs.append({"q": c["q"], "a": a})

    for st in s["steps"]:
        take(st.get("close"))
    for it in s.get("study", []):
        take(it.get("close"))
    seen, uniq = set(), []
    for q in qs:
        if q["q"] not in seen:
            seen.add(q["q"])
            uniq.append(q)
    # spread across the session rather than front-loading the first step
    if len(uniq) > cap:
        step = len(uniq) / cap
        uniq = [uniq[int(i * step)] for i in range(cap)]
    for st in s["steps"]:
        if len(uniq) >= 5:
            break
        if st.get("ans"):
            uniq.append({"q": "In your own words: " + st["t"].rstrip(".") + ".", "a": ans_text(st["ans"])})
    for it in s.get("study", []):
        if len(uniq) >= 5:
            break
        if it.get("say"):
            uniq.append({"q": "Explain, as you would out loud: " + it["t"] + ".", "a": it["say"]})
    return uniq[:cap]


def build(module_name):
    m = importlib.import_module(module_name)
    L = m.LOOP
    sessions = sessions_from_tracker(m.SESSION_IDS)
    for s in sessions:
        s["quiz_src"] = s.get("quiz")
        s["hasTrackerQuiz"] = bool(s.get("quiz"))
        s["quiz"] = quiz_for(s)
    # Prep: what each technical question rests on (figures, checked reading, guide links).
    qx = getattr(m, "QA_EXTRA", {})
    if qx:
        rj = io.open(os.path.join(HERE, "..", "data", "reading.js"), encoding="utf-8").read()
        known = {}
        for v in json.loads(rj[rj.index("var READING = ") + 14: rj.index(";\n/*SD_TECH*/")]).values():
            for r in v.get("read", []) + v.get("aieng", []):
                if r.get("url"):
                    known.setdefault(r["url"], r)
        sd = json.loads(subprocess.run(["node", os.path.join(HERE, "extract.js"), "--sd"], input=json.dumps({k: v.get("sd", []) for k, v in qx.items()}),
                                       capture_output=True, text=True, encoding="utf-8", check=True).stdout)
        for g in m.QA:
            for it in g["items"]:
                k = next((k for k in qx if it["q"].startswith(k)), None)
                if not k:
                    continue
                missing = [u for u in qx[k].get("read", []) if u not in known]
                if missing:
                    sys.exit("QA_EXTRA reading not in data/reading.js: %s" % missing)
                it["learn"] = {"figs": qx[k].get("figs", []), "read": [known[u] for u in qx[k].get("read", [])], "sdLinks": sd[k]}
    # Your own system (OWN): each part's guide references resolve the same way.
    own = getattr(m, "OWN", None)
    if own:
        sd = json.loads(subprocess.run(["node", os.path.join(HERE, "extract.js"), "--sd"], input=json.dumps({p["id"]: p.get("sd", []) for p in own["parts"]}),
                                       capture_output=True, text=True, encoding="utf-8", check=True).stdout)
        for p in own["parts"]:
            p["learn"] = {"figs": p.get("figs", []), "sdLinks": sd[p["id"]]}
    order = getattr(m, "QA_ORDER", None)
    if order:
        m.QA.sort(key=lambda g: order.index(g["group"]) if g["group"] in order else len(order))
    # Every Prep question gets an anchor, so a mock exchange can point at its revision, and
    # figures written on the question itself join whatever QA_EXTRA gave it.
    for g in getattr(m, "QA", []):
        for it in g["items"]:
            it["id"] = it.get("id") or "q-" + re.sub(r"[^a-z0-9]+", "-", it["q"].lower()).strip("-")[:60]
            if it.get("figs"):
                ln = it.setdefault("learn", {"figs": [], "read": [], "sdLinks": []})
                ln["figs"] = ln.get("figs", []) + [f for f in it["figs"] if f not in ln.get("figs", [])]
    mocks_path = os.path.join(HERE, module_name + ".mocks.json")
    mocks = json.load(io.open(mocks_path, encoding="utf-8")) if os.path.exists(mocks_path) else []
    # Research tab: <module>.research.json, an industry pass: {lead, questions, themes: [{id, title, blurb, topics}]}
    research_path = os.path.join(HERE, module_name + ".research.json")
    research = json.load(io.open(research_path, encoding="utf-8")) if os.path.exists(research_path) else None
    # Learn tab: <module>.learn.json, one path of modules and topics (learn, check, explain, say); see template.html
    learn_path = os.path.join(HERE, module_name + ".learn.json")
    learn = json.load(io.open(learn_path, encoding="utf-8")) if os.path.exists(learn_path) else None
    for mk in mocks:
        for ex in mk.get("exchanges", []):
            if ex.get("prep"):
                hit = [it for g in m.QA for it in g["items"] if it["q"].startswith(ex["prep"])]
                if not hit:
                    sys.exit("mock %s exchange %s: no Prep question starts with %r" % (mk.get("id"), ex["id"], ex["prep"]))
                ex["prepId"] = hit[0]["id"]
    data = {
        "id": L["id"], "title": L["title"], "subtitle": L["subtitle"], "when": L["when"], "when_iso": L["when_iso"],
        "who": L["who"], "format": L["format"], "bar": L["bar"],
        "sessions": [{k: s.get(k) for k in ("id", "name", "blurb", "intro", "len", "day", "steps", "study", "quiz", "hasTrackerQuiz", "figs")}
                     for s in sessions],
        "scripts": getattr(m, "SCRIPTS", []), "drills": getattr(m, "DRILLS", []), "qa": getattr(m, "QA", []), "ask": getattr(m, "ASK", []), "ask3": getattr(m, "ASK_3C", []), "traps": getattr(m, "TRAPS", []),
        "tables": getattr(m, "KITARU_TABLES", []), "admire": getattr(m, "ADMIRE", ""), "kitaruLead": getattr(m, "KITARU_LEAD", ""),
        "figures": L.get("figures", []), "mockHow": getattr(m, "MOCK_HOW", ""), "mocks": mocks[-2:],
        "planKicker": L.get("plan_kicker", ""), "mechTitle": L.get("mech_title", ""),
        "designLink": L.get("design_link"), "extra": L.get("extra", ""),
        "emphasis": getattr(m, "EMPHASIS", []), "own": own,
        # Prep hub: how to show up, a line under each bank, and the links it rests on.
        "showUp": getattr(m, "SHOW_UP", []), "prepLead": getattr(m, "PREP_LEAD", ""), "storyBlurb": getattr(m, "STORY_BLURB", ""),
        "sources": getattr(m, "SOURCES", []),
        # Overview: the company and the role from its posting; Rounds: what each round asked.
        "company": getattr(m, "COMPANY", []), "posting": getattr(m, "POSTING", None), "rounds": getattr(m, "ROUNDS", []),
        "research": research,
        "learn": learn, "tabs": getattr(m, "TABS", None),
    }
    tpl = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    # Shared figure files carry a hash of their contents, so a changed figure is never
    # served from a stale browser cache.
    import hashlib
    # The design tokens and the site badges (site/) are stamped the same way.
    for f in [("figures", f) for f in ("icons.js", "figures.js", "notes.js", "viewer.js", "viewer.css", "figures.css")] + [("site", "tokens.css"), ("site", "nav.js"), ("site", "nav.css"), ("site", "res.js"), ("site", "res.css")] + \
            [("private", f) for f in ("site.js", "figures.js", "notes.js")]:   # gitignored; stamped when present
        p = os.path.join(HERE, "..", *f)
        if os.path.exists(p):
            v = hashlib.sha1(io.open(p, "rb").read()).hexdigest()[:8]
            tpl = tpl.replace('../%s/%s"' % f, '../%s/%s?v=%s"' % (f + (v,)))
    # A loop's private module (gitignored) is loaded only when it exists here, so other pages ask for nothing.
    if not os.path.exists(os.path.join(HERE, "..", "private", "loops", module_name + ".js")):
        tpl = tpl.replace('<script src="../private/loops/{{MODULE}}.js"></script>\n', "")
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    page = tpl.replace("{{DATA}}", blob).replace("{{TITLE}}", L["title"]).replace("{{MODULE}}", module_name)
    out = os.path.join(HERE, module_name.replace("_", "-") + ".html")
    io.open(out, "w", encoding="utf-8", newline="\n").write(page)
    print("wrote %s: %d bytes, %d sessions, %d quiz questions, %d figures, %d mocks"
          % (out, len(page), len(sessions), sum(len(s["quiz"]) for s in sessions), len(data["figures"]), len(data["mocks"])))


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "zenml_round3")
