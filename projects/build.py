"""Build PROJECTS.html from projects/projects.py and projects/template.html.

    python projects/build.py

The shared files (site/) are loaded with ?v=<hash of their contents> so a changed file is never served stale.
Every guide link must name a real technique in SYSTEM DESIGN.html.
"""
import hashlib, importlib, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)


def read(p):
    return io.open(os.path.join(ROOT, p), encoding="utf-8").read()


def build():
    data = importlib.import_module("projects")
    guide = read("SYSTEM DESIGN.html")
    for p in data.PROJECTS:
        for t in p["topics"]:
            assert re.fullmatch(r"[a-z0-9-]+", t["video"]), t["id"]
            for _, href in t.get("plan", []):
                if "#/patterns/" in href:
                    tech = href.split("/")[-1]
                    assert re.search(r'id: "%s"' % re.escape(tech), guide), "unknown guide technique %s in %s" % (tech, t["id"])
    tpl = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    for f in ("site/tokens.css", "site/nav.js", "site/nav.css", "site/res.js", "site/res.css"):
        v = hashlib.sha1(io.open(os.path.join(ROOT, f), "rb").read()).hexdigest()[:8]
        tpl = tpl.replace('%s"' % f, '%s?v=%s"' % (f, v))
    page = tpl.replace("{{DATA}}", json.dumps({"projects": data.PROJECTS}, ensure_ascii=False).replace("</", "<\\/"))
    out = os.path.join(ROOT, "PROJECTS.html")
    io.open(out, "w", encoding="utf-8", newline="\n").write(page)
    print("wrote %s: %d projects, %d topics" % (out, len(data.PROJECTS), sum(len(p["topics"]) for p in data.PROJECTS)))


if __name__ == "__main__":
    build()
