"""Build ALFRED.html, the living page for alfred_, from alfred/content.py and alfred/template.html.

    python alfred/build.py        -> ALFRED.html at the repo root

Never edit ALFRED.html by hand: edit content.py (or the template) and rebuild.

The shared figure files and the site bar (site/) are loaded with ?v=<hash of their contents>, so a changed figure is
never served from a stale cache. Every figure key must exist in figures/figures.js, and
Pranav's verbatim answers are checked word for word against interviews/zenml_round3.py
while that module exists.
"""
import hashlib, importlib, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
FIG_FILES = ("icons.js", "figures.js", "notes.js", "viewer.js", "viewer.css", "figures.css")
# Pages that may show a shared figure, for the "also in" line under each one.
# The labels are the site bar's (site/nav.js).
ELSEWHERE_PAGES = [("System design guide", "SYSTEM DESIGN.html", "SYSTEM%20DESIGN.html"), ("Accelerate tracker", "index.html", "index.html"),
                   ("Algorithms and coding", "CODING.html", "CODING.html"), ("Alaap and TrenTorch", "ALAAP.html", "ALAAP.html")]


def read(p):
    return io.open(os.path.join(ROOT, p), encoding="utf-8").read()


def check_verbatim(c):
    """His words must match the loop module they were first written in, exactly."""
    try:
        sys.path.insert(0, os.path.join(ROOT, "interviews"))
        z = importlib.import_module("zenml_round3")
    except ImportError:
        return
    script = {s["id"]: s for s in z.SCRIPTS}
    qa = {it["q"]: it for g in z.QA for it in g["items"]}
    pairs = [(c.ASKS[0]["a"], script["alfred-day"]["say"]), (c.ASKS[1]["a"], script["leave"]["say"]),
             (next(s for s in c.STORIES if s["id"] == "swap")["say"], qa["How do you actually replace third-party APIs with SQLite?"]["a"]),
             (next(s for s in c.STORIES if s["id"] == "multiturn")["say"], qa["Does your harness actually support multi-turn evaluation?"]["a"])]
    for mine, theirs in pairs:
        if mine != theirs:
            sys.exit("verbatim text differs from interviews/zenml_round3.py:\n%r\n%r" % (mine, theirs))


def build():
    c = importlib.import_module("content")
    check_verbatim(c)
    figs_js = read("figures/figures.js")
    keys = [s.get("fig") for s in c.START] + [k for x in c.LAYERS + c.STORIES + c.ASKS for k in x.get("figs", []) + [x.get("figIn")]]
    keys = [k for k in dict.fromkeys(keys) if k]
    missing = [k for k in keys if not re.search(r"DIA\.%s\s*=" % k, figs_js)]
    if missing:
        sys.exit("figure keys not in figures/figures.js: %s" % missing)
    pages = [(label, read(f) + (read("data/reading.js") if f == "index.html" else ""), href)
             for label, f, href in ELSEWHERE_PAGES if os.path.exists(os.path.join(ROOT, f))]
    for f in sorted(os.listdir(os.path.join(ROOT, "interviews"))):
        if f.endswith(".html") and f != "template.html":
            text = read("interviews/" + f)
            pages.append((re.search(r"<title>(.*?)</title>", text).group(1), text, "interviews/" + f))
    also = {k: [[label, href] for label, text, href in pages if re.search(r"[\"']%s[\"']" % k, text)] for k in keys}
    data = {"title": c.TITLE, "kicker": c.KICKER, "lead": c.LEAD, "start": c.START, "layers": c.LAYERS,
            "stories": c.STORIES, "asks": c.ASKS, "elsewhere": c.ELSEWHERE, "also": also}
    tpl = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    for f in ["figures/" + f for f in FIG_FILES] + ["site/nav.js", "site/nav.css"]:
        v = hashlib.sha1(io.open(os.path.join(ROOT, f), "rb").read()).hexdigest()[:8]
        tpl = tpl.replace('%s"' % f, '%s?v=%s"' % (f, v))
    page = tpl.replace("{{DATA}}", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    out = os.path.join(ROOT, "ALFRED.html")
    io.open(out, "w", encoding="utf-8", newline="\n").write(page)
    print("wrote %s: %d bytes, %d layers, %d stories, %d questions, %d figures"
          % (out, len(page), len(c.LAYERS), len(c.STORIES), len(c.ASKS), len(keys)))


if __name__ == "__main__":
    build()
