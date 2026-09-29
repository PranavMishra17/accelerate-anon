"""Build ALAAP.html: one linear study plan for Alaap and TrenTorch.

Reads, in place, and never edits:
    E:/VoiceForge TTV Pipeine/v3/learning/   the Alaap study guide, sanity check,
                                             accent research, architecture diagrams
    E:/TrenTorch/data/                       the twenty modules and six milestones
and the plan itself from alaap/plan.py, then writes ALAAP.html at the repo root in
the Alaap repo's visual style, and refreshes the plan's stage list and link labels
inside index.html (alaap/wire.py) so Accelerate and the page cannot disagree.

The Alaap and TrenTorch text is quoted, not rewritten. What this page adds is the
order (plan.STAGES), a diagram for each stage, an exit check with an answer, the
architecture diagrams' metadata, and links into Accelerate.

Re-run whenever either repo, or the plan, changes:

    python alaap/build.py             ALAAP.html, and the AL block in index.html
    python alaap/build.py --public    DEEP-LEARNING.html only: the same plan as a public learning
                                      path (plan.PUBLIC), nothing personal; never touches index.html
"""
import copy, hashlib, html, io, json, os, re, sys
import markdown

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import plan  # noqa: E402
import trentorch  # noqa: E402

SRC = r"E:\VoiceForge TTV Pipeine\v3\learning"
OUT = os.path.join(os.path.dirname(HERE), "ALAAP.html")
TT_WEB = "https://github.com/TrenTorch/TrenTorch/tree/TrenTorch-Main/TrenTorch_CLI/"
WHY = "Why it matters for Alaap"
PUB = None   # plan.PUBLIC while building the public page

SYMBOLS = [("\u2705", '<span class="ok">\u2713</span>'), ("\u274c", '<span class="bad">\u2717</span>'),
           ("\u26d4", '<span class="bad">\u2717</span>'), ("\U0001f7e1", '<span class="warn">\u25d0</span>'),
           ("\u26a0\ufe0f", '<span class="warn">!</span>'), ("\u26a0", '<span class="warn">!</span>')]
DOCS = {"01-STUDY-GUIDE.md": "#/plan", "00-SANITY-CHECK.md": "#/status",
        "02-ACCENT-AND-RIGHTS.md": "#/accent", "architecture.html": "#/architecture", "README.md": "#/plan"}


def esc(s):
    return html.escape(str(s), quote=True)


def read(name):
    return io.open(os.path.join(SRC, name), encoding="utf-8").read()


def slug(text):
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"[^a-z0-9]+", "-", html.unescape(text).lower()).strip("-")[:48]


# ------------------------------------------------------------------ markdown

def loosen(text):
    """Blank line before lists and fences that start straight under prose, as GitHub reads them."""
    out, fenced, prev = [], False, ""
    for line in text.split("\n"):
        starts = re.match(r"(\d+\.|[-*]) |```", line)
        if starts and not fenced and prev.strip() and not re.match(r"\s*(\d+\.|[-*]) |>|\|", prev):
            out.append("")
        if line.startswith("```"):
            fenced = not fenced
        out.append(line)
        prev = line
    return "\n".join(out)


def dedash(page):
    """No em dashes on the page (DESIGN.md): quoted Alaap and TrenTorch text gets a comma instead.
    Scripts, styles and code blocks are left exactly as they are."""
    parts = re.split(r"(<script[\s\S]*?</script>|<style[\s\S]*?</style>|<pre[\s\S]*?</pre>)", page)
    for i in range(0, len(parts), 2):
        parts[i] = re.sub(r"\s*\u2014\s*", ", ", parts[i])
    return "".join(parts)


def md(text):
    for a, b in SYMBOLS:
        text = text.replace(a, b)
    return relink(markdown.markdown(loosen(text), extensions=["tables", "fenced_code", "sane_lists"]))


def inline_md(text):
    return md(text)[3:-4]


def relink(out):
    """Links between the Alaap documents become tabs; links into the rest of that repo become paths."""
    def fix(m):
        href, label = m.group(1), m.group(2)
        base = href.split("#")[0].split("/")[-1]
        if href.startswith("http"):
            return '<a href="%s" target="_blank" rel="noopener">%s</a>' % (href, label)
        if base in DOCS and not href.startswith("../") and not (PUB and DOCS[base] in ("#/status", "#/accent")):
            return '<a href="%s">%s</a>' % (DOCS[base], label)
        path = href[3:] if href.startswith("../") else "learning/" + href
        return '<span class="repo" title="In the Alaap repo: %s">%s</span>' % (esc(path), label)
    return re.sub(r'<a href="([^"]+)">(.*?)</a>', fix, out)


def labels(out):
    rules = [
        (r"<p><strong>\u27f6 After this you can</strong>", '<p class="k after"><b class="lab">After this you can</b>'),
        (r"<p><strong>Read</strong>(\s*\u2014\s*)?", '<p class="k read"><b class="lab">Read</b> '),
        (r"<p><strong>Do</strong>(\s*\u2014\s*)?", '<p class="k do"><b class="lab">Do</b> '),
        (r"<p><strong>Check</strong>(\s*\u2014\s*)?", '<p class="k check"><b class="lab">Check</b> '),
        (r"<p><strong>Intuition:?</strong>:?", '<p class="k intu"><b class="lab">Intuition</b>'),
        (r"<p><strong>(Why it matters[^<]*?):?</strong>:?", r'<p class="k why"><b class="lab">\1</b>'),
    ]
    for pat, rep in rules:
        out = re.sub(pat, rep, out)
    return re.sub(r'<p class="k (do|read)">(.*?)</p>\s*(<pre>.*?</pre>|<ol>.*?</ol>|<ul>.*?</ul>)',
                  r'<div class="k \1">\2\3</div>', out, flags=re.S)


# ------------------------------------------------------------------ the Alaap study guide, in pieces

def guide_pieces():
    """part-N (the part's opening), sN-M (each section), five-ideas, ten-hours, and the prelude."""
    src = read("01-STUDY-GUIDE.md")
    body = src.split("\n", 1)[1]
    pre, rest = body.split("\n# Part 0", 1)
    rest = "# Part 0" + rest
    rest, epilogue = rest.split("\n## The five ideas", 1)
    epilogue = "## The five ideas" + epilogue
    pieces, parts = {}, {}
    for chunk in re.split(r"\n(?=# Part )", rest):
        head, text = chunk.split("\n", 1)
        m = re.match(r"# Part (\d+) \u00b7 (.+?) \u2014 (.+)$", head.strip())
        n = m.group(1)
        parts[n] = {"name": m.group(2), "meta": m.group(3)}
        text = text.strip().rstrip("-").strip()
        split = re.split(r"\n(?=### \d+\.\d+ )", "\n" + text)
        pieces["part-" + n] = labels(md(split[0]))
        for sec in split[1:]:
            h, body_ = sec.strip().split("\n", 1)
            mm = re.match(r"### (\d+)\.(\d+) (.+?)(?: \u2014 ([\d.]+ h))?(?: \u00b7 (.+))?$", h)
            sid = "s%s-%s" % (mm.group(1), mm.group(2))
            flag = ' <span class="flag">%s</span>' % inline_md(mm.group(5)) if mm.group(5) else ""
            hrs = ' <span class="hrs">%s</span>' % mm.group(4) if mm.group(4) else ""
            pieces[sid] = ('<h4 class="gs" id="%s"><span class="num">Guide %s.%s</span> %s%s%s</h4>'
                           % (sid, mm.group(1), mm.group(2), inline_md(mm.group(3)), hrs, flag)) + labels(md(body_.strip().rstrip("-").strip()))
    for chunk in re.split(r"\n(?=## )", epilogue.strip()):
        head, text = chunk.split("\n", 1)
        name = head.lstrip("# ").strip()
        key = "five-ideas" if name.startswith("The five") else "ten-hours"
        pieces[key] = '<h4 class="gs" id="%s">%s</h4>%s' % (key, esc(name), labels(md(text.strip().rstrip("-").strip())))
    cards = re.findall(r"^\| \*\*(.+?)\*\* \| (.+?) \|$", pre, re.M)
    cite = re.search(r"(\*\*Paper citations:\*\*.*?)\n\n", pre, re.S).group(1)
    target = re.search(r"((?:^>.*\n)+)", pre, re.M).group(1)
    tiny = re.search(r"### Where tinytorch fits\n(.*?)```", pre, re.S).group(1)
    return pieces, parts, {"cards": cards, "cite": cite, "target": target, "tiny": tiny}


# ------------------------------------------------------------------ architecture

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "figures"))
from annotate import annotate  # noqa: E402


def architecture():
    src = read("architecture.html")
    css = re.search(r"/\* --- svg primitives --- \*/(.*?)</style>", src, re.S).group(1)
    defs = re.search(r'(<svg width="0" height="0".*?</svg>)', src, re.S).group(1)
    figs, order = {}, []
    for m in re.finditer(r'<h2 id="(\w+)">(.*?)</h2>\s*(<p class="lede">.*?</p>)?\s*(<figure>.*?</figure>)', src, re.S):
        fid, title, lede, fig = m.group(1), m.group(2), m.group(3) or "", m.group(4)
        fig = re.sub(r'<a href="(https?://[^"]+)">', r'<a href="\1" target="_blank" rel="noopener">', fig)
        # explorable in the figure viewer: nodes and edges named, the figure keyed
        fig = annotate(fig).replace("<figure", '<figure data-fig="al:arch-%s"' % fid, 1)
        figs[fid] = {"title": title, "lede": lede, "fig": fig}
        order.append(fid)
    head = re.search(r"<h1>(.*?)</h1>", src).group(1)
    return head, css, defs, figs, order


def arch_meta(fid, figs):
    meta = plan.ARCH_META.get(fid)
    if not meta:
        return ""
    stages = {s["n"]: s for s in plan.STAGES}
    learn = " \u00b7 ".join('<a href="#/plan/stage-%d">Stage %d, %s</a>' % (n, n, esc(stages[n]["title"])) for n in meta["stages"])
    return ('<dl class="meta"><dt>Involves</dt><dd>%s</dd><dt>Topics</dt><dd><ul class="chips">%s</ul></dd>'
            '<dt>Learn it in</dt><dd>%s</dd></dl>'
            % (esc(", ".join(meta["involves"])), "".join("<li>%s</li>" % esc(t) for t in meta["topics"]), learn))


def arch_figure(fid, figs, inline=True):
    f = figs[fid]
    link = '<a class="to-arch" href="#/architecture/%s">Open in the architecture tab</a>' % fid if inline else ""
    return ('<div class="archfig"><h4 class="gs">Architecture: %s %s</h4>%s%s%s</div>'
            % (f["title"], link, f["lede"], f["fig"], arch_meta(fid, figs)))


# ------------------------------------------------------------------ diagrams drawn for the plan

def diagram(key):
    spec = plan.DIAGRAMS[key]
    cw, ch, bw, bh, pad = 216, 84, 176, 54, 16
    top = 34 if spec.get("heads") else 12
    nodes = {n["id"]: n for n in spec["nodes"]}
    cols = max(n["c"] + n.get("span", 1) for n in spec["nodes"])
    rows = max(n["r"] for n in spec["nodes"]) + 1
    W = pad * 2 + (cols - 1) * cw + bw
    H = top + (rows - 1) * ch + bh + pad
    box = {}
    for n in spec["nodes"]:
        x, y = pad + n["c"] * cw, top + n["r"] * ch
        w = bw + (n.get("span", 1) - 1) * cw
        box[n["id"]] = (x, y, w, bh)
    out = ['<svg viewBox="0 0 %d %d" role="img" aria-label="%s">' % (W, H, esc(re.sub(r"<[^>]+>", "", spec["caption"]).split(".")[0]))]
    for c, text in spec.get("heads", []):
        if text:
            out.append('<text class="hd" x="%d" y="16">%s</text>' % (pad + c * cw + bw / 2, esc(text)))

    def edge_point(b, tx, ty):
        x, y, w, h = b
        cx, cy = x + w / 2, y + h / 2
        dx, dy = tx - cx, ty - cy
        if dx == 0 and dy == 0:
            return cx, cy
        sx = (w / 2 + 4) / abs(dx) if dx else 1e9
        sy = (h / 2 + 4) / abs(dy) if dy else 1e9
        s = min(sx, sy)
        return cx + dx * s, cy + dy * s

    for e in spec["edges"]:
        a, b, label = e[0], e[1], e[2]
        cls = e[3] if len(e) > 3 else "ln"
        A, B = box[a], box[b]
        ac = (A[0] + A[2] / 2, A[1] + A[3] / 2)
        bc = (B[0] + B[2] / 2, B[1] + B[3] / 2)
        x1, y1 = edge_point(A, *bc)
        x2, y2 = edge_point(B, *ac)
        d = "M%.0f %.0f L%.0f %.0f" % (x1, y1, x2, y2)
        out.append('<g data-e="%s>%s"><path class="fv-hit" d="%s"/><path class="%s" d="%s"/>' % (a, b, d, cls, d))
        if label:
            out.append('<text class="tm lbl" x="%.0f" y="%.0f">%s</text>' % ((x1 + x2) / 2, (y1 + y2) / 2 - 7, esc(label)))
        out.append("</g>")
    for n in spec["nodes"]:
        x, y, w, h = box[n["id"]]
        out.append('<g data-n="%s">' % n["id"])
        out.append('<rect class="%s" x="%d" y="%d" width="%d" height="%d" rx="9"/>' % (n["cls"], x, y, w, h))
        if n.get("sub"):
            out.append('<text class="t" x="%d" y="%d">%s</text>' % (x + w / 2, y + 20, esc(n["label"])))
            out.append('<text class="tm" x="%d" y="%d">%s</text>' % (x + w / 2, y + 38, esc(n["sub"])))
        else:
            out.append('<text class="t" x="%d" y="%d">%s</text>' % (x + w / 2, y + h / 2, esc(n["label"])))
        out.append("</g>")
    out.append("</svg>")
    return '<figure class="plan-fig" data-fig="al:%s">%s<figcaption>%s</figcaption></figure>' % (key, "\n".join(out), spec["caption"])


def overview():
    """Every stage as a box, one band per milestone; each box opens its stage."""
    per_row, cw, bw, bh, rh = 6, 172, 158, 46, 58
    out, y = [], 10
    W = 16 + per_row * cw
    tone = {1: "b3", 2: "b1", 3: "b2"}
    for ms in plan.MILESTONES:
        stages = [s for s in plan.STAGES if s["ms"] == ms["id"]]
        out.append('<text class="hd" style="text-anchor:start" x="16" y="%d">%s</text>' % (y + 12, esc(ms["name"])))
        y += 22
        for i, s in enumerate(stages):
            x = 16 + (i % per_row) * cw
            yy = y + (i // per_row) * rh
            kind = s.get("kind") or ("TrenTorch" if s.get("tt") and not s.get("alaap") else ("Alaap guide" if not s.get("tt") else "both"))
            short = s["title"].split(":")[0]
            short = short if len(short) <= 24 else short[:22].rsplit(" ", 1)[0] + "\u2026"
            out.append('<a href="#/plan/stage-%d"><rect class="%s" x="%d" y="%d" width="%d" height="%d" rx="8"/>'
                       '<text class="tm" x="%d" y="%d">Stage %d \u00b7 %s</text><text class="t" x="%d" y="%d">%s</text></a>'
                       % (s["n"], tone[ms["id"]], x, yy, bw, bh, x + bw / 2, yy + 14, s["n"], kind,
                          x + bw / 2, yy + 32, esc(short)))
        y += ((len(stages) - 1) // per_row + 1) * rh + 12
    return '<svg class="ov" viewBox="0 0 %d %d" role="img" aria-label="Every stage of the plan, by milestone">%s</svg>' % (W, y, "".join(out))


# ------------------------------------------------------------------ TrenTorch

def tt_card(m):
    folder = m["id"]
    qs = [q for i, q in enumerate(m["questions"]) if q["title"] not in [p["title"] for p in m["questions"][:i]]]
    q_html = "".join('<li><b>%s.</b> %s%s</li>' % (
        esc(q["title"]), esc(q["scenario"]) + " " if q["scenario"] else "",
        esc(q["question"]) if q["question"] and q["question"] != q["title"] else "") for q in qs)
    return """<article class="tt" id="tt-%02d">
<header><span class="ttn">TrenTorch %02d</span><h4>%s</h4><span class="sub">%s</span>
<a class="src" href="%sdata/src/%s" target="_blank" rel="noopener">Module source</a></header>
<p>%s</p>
<dl class="io"><dt>You have built</dt><dd>%s</dd><dt>You build</dt><dd>%s</dd><dt>It enables</dt><dd>%s</dd></dl>
<div class="k do"><b class="lab">Build it</b> <code>tren module start %02d</code>, work in the notebook, then <code>tren module test %02d</code> and <code>tren module complete %02d</code>. It exports <code>trentorch.%s</code>; the source is <span class="repo" title="In E:/TrenTorch">%s</span>.</div>
<div class="cols"><div><p class="lab">Learning objectives</p><ol>%s</ol></div>
<div><p class="lab">Inside the module</p><ul class="chips">%s</ul></div></div>
%s
%s
</article>""" % (
        m["n"], m["n"], esc(m["title"].split(" - ")[0]), esc(m["subtitle"]), TT_WEB, folder,
        esc(m["description"]), esc(m["built"]), esc(m["build"]), esc(m["enable"]),
        m["n"], m["n"], m["n"], esc(m["export"]), esc(m["path"]),
        "".join("<li>%s</li>" % esc(o) for o in m["objectives"]),
        "".join("<li>%s</li>" % esc(t) for t in m["topics"]),
        '<pre class="cmap">%s</pre>' % esc(m["map"]) if m["map"] else "",
        '<details class="rq"><summary>Reflection questions from the module (%d)</summary><ol>%s</ol></details>' % (len(qs), q_html) if qs else "")


def unlock(mid, milestones):
    ms = next(x for x in milestones if x["id"] == mid)
    return ('<p class="k unlock"><b class="lab">Unlocks TrenTorch milestone %s \u00b7 %s (%s)</b> %s. Needs modules %s. '
            'Run it with <code>tren milestone run %s</code>.</p>' % (ms["id"], esc(ms["name"]), ms["year"], esc(ms["what"]), esc(ms["needs"]), ms["id"]))


# ------------------------------------------------------------------ the plan

def stage_hours(s):
    return s.get("hours", 0) + len(s.get("tt", [])) * plan.TT_HOURS


def fmt_h(h):
    return ("%g" % h) + " h"


def stage(s, pieces, parts, figs, tt, milestones):
    chips = []
    for a in s.get("alaap", []):
        if a.startswith("part-"):
            continue
        if a.startswith("s"):
            chips.append("Alaap guide %s" % a[1:].replace("-", "."))
        else:
            chips.append("Alaap guide, closing ideas")
    chips += ["TrenTorch %02d %s" % (n, tt[n]["title"].split(" - ")[0]) for n in s.get("tt", [])]
    chips += ["Unlocks milestone %s" % u for u in s.get("unlocks", [])]
    acc = []
    if s.get("accel"):
        acc.append("<b>Practised in Accelerate</b> " + " \u00b7 ".join(
            '<a href="%s" target="_blank" rel="noopener">%s</a>' % (h, esc(t)) for t, h in s["accel"]))
    if s.get("map"):
        acc.append('<b>On the map</b> <a href="index.html#/map" target="_blank" rel="noopener">%s</a>' % esc(s["map"]))
    body = []
    body.append('<p class="k after"><b class="lab">After this you can</b> %s</p>' % esc(s["goal"]))
    body.append('<p class="k why"><b class="lab">%s</b> %s</p>' % (WHY, esc(s["why"])))
    if s.get("diagram"):
        body.append(diagram(s["diagram"]))
    if s.get("html"):
        body.append(s["html"])
    for n in s.get("tt", []):
        body.append(tt_card(tt[n]))
    for u in s.get("unlocks", []):
        body.append(unlock(u, milestones))
    for a in s.get("alaap", []):
        if a.startswith("part-"):
            n = a.split("-")[1]
            body.append('<div class="partopen" id="%s"><p class="lab">From the Alaap guide, Part %s: %s <span class="pm">%s</span></p>%s</div>'
                        % (a, n, esc(parts[n]["name"]), esc(parts[n]["meta"]), pieces[a]))
        else:
            body.append('<div class="guide">%s</div>' % pieces[a])
    for fid in s.get("arch_inline", []):
        body.append(arch_figure(fid, figs))
    if s.get("arch"):
        body.append('<p class="acc"><b>Also in the architecture</b> %s</p>' % " \u00b7 ".join(
            '<a href="#/architecture/%s">%s</a>' % (f, figs[f]["title"]) for f in s["arch"]))
    q, a = s["check"]
    body.append('<div class="exit"><p><b class="lab">Exit check</b> %s</p><details><summary>Show the answer</summary><p>%s</p></details></div>'
                % (esc(q), esc(a)))
    return """<section class="stage" id="stage-%d">
<header class="sh"><span class="pn">Stage %d</span><h3>%s</h3><span class="pm">about %s</span></header>
<ul class="chips srcs">%s</ul>
%s
%s
</section>""" % (s["n"], s["n"], esc(s["title"]), fmt_h(stage_hours(s)),
                 "".join("<li>%s</li>" % esc(c) for c in chips),
                 '<p class="acc">%s</p>' % " &nbsp; ".join(acc) if acc else "", "\n".join(body))


def plan_tab(pieces, parts, pre, figs, tt, milestones):
    total = sum(stage_hours(s) for s in plan.STAGES)
    side, main = [], []
    for ms in plan.MILESTONES:
        stages = [s for s in plan.STAGES if s["ms"] == ms["id"]]
        hours = sum(stage_hours(s) for s in stages)
        side.append('<li class="msh">%s</li>' % esc(ms["name"].split(" \u00b7 ")[1]))
        side += ['<li><a href="#/plan/stage-%d"><span class="sn">%d</span>%s</a></li>' % (s["n"], s["n"], esc(s["title"].split(":")[0]))
                 for s in stages]
        main.append('<section class="ms" id="ms-%d"><h2>%s</h2><p class="pm">%sabout %s across %d stages</p><p>%s</p></section>'
                    % (ms["id"], esc(ms["name"]), esc(ms["when"]) + " \u00b7 " if ms["when"] else "", fmt_h(hours), len(stages), esc(ms["note"])))
        main += [stage(s, pieces, parts, figs, tt, milestones) for s in stages]
    if PUB:
        return ('<div class="split"><nav class="side" aria-label="Stages of the path"><ol>%s</ol></nav><div class="main">%s%s</div></div>'
                % ("".join(side), public_intro(total), "\n".join(main)))
    side.append('<li class="msh">Appendix</li><li><a href="#/plan/ten-hours">If you only have 10 hours</a></li>')
    cards = "".join('<div class="kc k%d"><b class="lab">%s</b><p>%s</p></div>'
                    % (i, esc(re.sub(r"^\u27f6 ", "", c[0])), inline_md(c[1])) for i, c in enumerate(pre["cards"]))
    intro = """<div class="lead">
<p class="big">Twenty-two stages, in the order to do them. Each one names what you can do afterwards and why it matters for Alaap, then puts in front of you everything that stage needs: the Alaap guide's own sections, the TrenTorch module you build, a diagram, the relevant architecture, where Accelerate practises it, and one exit check with its answer.</p>
<p class="sm">About %s in all: Alaap guide hours as the guide states them, TrenTorch at about %g hours a module. Milestones follow Accelerate's roadmap. The guide's own target, for reference:</p>
%s
<figure class="plan-fig">%s<figcaption><b>The whole plan.</b> Green is milestone 1, blue milestone 2, amber milestone 3. Select a stage to jump to it.</figcaption></figure>
<h3>How each stage is laid out</h3>
<div class="kcards">%s</div>
<p class="sm">%s</p>
</div>""" % (fmt_h(total), plan.TT_HOURS, md(pre["target"]), overview(), cards, inline_md(pre["cite"]))
    appendix = '<section class="stage" id="appendix">%s</section>' % pieces["ten-hours"]
    return ('<div class="split"><nav class="side" aria-label="Stages of the plan"><ol>%s</ol></nav><div class="main">%s%s%s</div></div>'
            % ("".join(side), intro, "\n".join(main), appendix))


def arch_tab(figs, order, head):
    nav = "".join('<li><a href="#/architecture/%s">%s</a></li>' % (f, re.sub(r"^\d+ \u00b7 ", "", figs[f]["title"])) for f in order)
    parts = []
    for f in order:
        parts.append('<h2 id="%s">%s</h2>%s%s%s' % (f, figs[f]["title"], figs[f]["lede"], figs[f]["fig"], arch_meta(f, figs)))
    return ('<h1 style="margin-top:40px">%s</h1><p class="sub">Each diagram now carries what it involves, its topics, and the plan stages that teach it.</p>'
            '<nav class="contents"><b>Contents</b><ol>%s</ol></nav>%s' % (head, nav, "\n".join(parts)))


def document(name, prefix):
    src = read(name)
    title = src.splitlines()[0].lstrip("# ").strip()
    out = md(src.split("\n", 1)[1])
    out = re.sub(r"<h2>(.*?)</h2>", lambda m: '<h2 id="%s-%s">%s</h2>' % (prefix, slug(m.group(1)), m.group(1)), out)
    return title, out


# ------------------------------------------------------------------ the public page

def public_view(P):
    """plan.py as the public path: parts for milestones, stages renumbered in path order, the maths
    stage added, and tracker pointers, project status and personal framing left out."""
    order = [o for part in P["parts"] for o in part["stages"]]
    num = {o: i for i, o in enumerate(order, 1)}

    def renum(text):
        return re.sub(r"\b(stages?) (\d+(?:(?:, | and )\d+)*)", lambda m: m.group(1) + " " + re.sub(
            r"\d+", lambda d: str(num[int(d.group())]), m.group(2)), text)

    byn = {s["n"]: s for s in plan.STAGES}
    stages, parts = [], []
    for i, part in enumerate(P["parts"], 1):
        parts.append({"id": i, "name": part["name"], "when": "", "note": part["note"]})
        for o in part["stages"]:
            s = dict(P["maths"] if o == "maths" else byn[o], **P["stage"].get(o, {}))
            s.pop("accel", None)
            s.pop("map", None)
            s["arch"] = [f for f in s.get("arch", []) if f not in P["drop_arch"]]
            s["goal"], s["why"], s["check"] = renum(s["goal"]), renum(s["why"]), tuple(renum(x) for x in s["check"])
            s["n"], s["ms"] = num[o], i
            if o == "maths":
                s["html"] = maths_table(P["maths_rows"], num)
            stages.append(s)
    meta = {f: dict(m, stages=[num[n] for n in m["stages"]]) for f, m in plan.ARCH_META.items() if f not in P["drop_arch"]}
    dias = copy.deepcopy(plan.DIAGRAMS)
    for k, v in P["diagrams"].items():
        dias[k].update(v)
    for d in dias.values():
        d["caption"] = renum(d["caption"])
        for n in d["nodes"]:
            if n.get("sub"):
                n["sub"] = renum(n["sub"])

    class View:
        STAGES, MILESTONES, ARCH_META, DIAGRAMS, TT_HOURS = stages, parts, meta, dias, plan.TT_HOURS
    return View, num


def maths_table(rows, num):
    out = []
    for topic, can, used, reads in rows:
        out.append("<tr><td><b>%s</b></td><td>%s</td><td>%s</td><td>%s</td></tr>" % (
            esc(topic), esc(can), ", ".join('<a href="#/plan/stage-%d">%d</a>' % (num[u], num[u]) for u in sorted(used, key=num.get)),
            "<br>".join('<a href="%s%s" target="_blank" rel="noopener">%s</a>' % (plan.MATHS_LESSON, slug_, esc(r)) for r, slug_ in reads)))
    return ('<div class="guide"><h4 class="gs">The maths, piece by piece</h4><p>Work down the table. If a row is already easy, '
            'do its task on paper and move on; if not, read the lesson beside it. Each reading is a free lesson from AI Engineering from Scratch.</p>'
            '<table><thead><tr><th>Topic</th><th>Be able to</th><th>Used in stage</th><th>Read</th></tr></thead><tbody>%s</tbody></table></div>'
            % "".join(out))


def public_text(piece):
    """Quoted Alaap guide text, read from outside the Alaap repo: 'this repo' names it."""
    piece = piece.replace("tinytorch", "TrenTorch")
    piece = re.sub(r"<li>(?:(?!</li>).)*00-SANITY-CHECK(?:(?!</li>).)*</li>\s*", "", piece, flags=re.S)   # project status: not on this page
    piece = re.sub(r"\b([Tt])his (repo|project)\b", lambda m: ("The" if m.group(1) == "T" else "the") + " Alaap " + m.group(2), piece)
    return piece


def public_intro(total):
    P = PUB
    fill = {"total": fmt_h(total), "tt": "%g" % plan.TT_HOURS, "weeks": int(round(total / 5.0))}
    rows = "".join('<div class="kc"><b class="lab">%s</b><p>%s</p></div>' % (esc(a), esc(b.format(**fill))) for a, b in P["intro"])
    cards = "".join('<div class="kc"><b class="lab">%s</b><p>%s</p></div>' % (esc(a), esc(b)) for a, b in P["cards"])
    return """<div class="lead">
<p class="big">Build a deep learning framework from nothing, then use it to understand how machines hear and speak: %d stages in three parts, from the maths to a speech model.</p>
<div class="kcards">%s</div>
<h3>Set up</h3>
<p><a href="%s" target="_blank" rel="noopener">TrenTorch</a> is an open framework you build yourself, module by module, in NumPy: its own take on the TinyTorch curriculum. Clone it and start the first module (the README has the Windows version):</p>
<pre>git clone https://github.com/TrenTorch/TrenTorch.git
cd TrenTorch/TrenTorch_CLI
python3 -m venv .venv &amp;&amp; source .venv/bin/activate
pip install -r requirements.txt &amp;&amp; pip install -e .
tren setup
tren module start 01</pre>
<p><a href="%s" target="_blank" rel="noopener">Alaap</a> is an open research system for voice design: a written character description becomes a persistent voice identity that can speak any dialogue. Part 3 quotes its study guide and its architecture diagrams, which are in the architecture tab.</p>
<h3>The path</h3>
<figure class="plan-fig">%s<figcaption><b>The whole path.</b> Green is part 1, blue part 2, amber part 3. Select a stage to open it.</figcaption></figure>
<h3>How each stage is laid out</h3>
<div class="kcards">%s</div>
</div>""" % (len(plan.STAGES), rows, P["tt_repo"], P["alaap_repo"], overview(), cards)


NOTES_JS = """<script>
/* The shared figure notes (figures/notes-alaap.js) were written for the personal plan. Here, stage
   links point at this page with its own numbers, TrenTorch links at the published source, and links
   into the study tracker are left out. */
document.addEventListener("DOMContentLoaded", function () {
  var num = %s, tt = %s, notes = window.FIG_NOTES || {};
  Object.keys(notes).forEach(function (key) {
    if (key.indexOf("al:") !== 0) { return; }
    ["nodes", "edges"].forEach(function (part) {
      var all = notes[key][part] || {};
      Object.keys(all).forEach(function (id) {
        if (!all[id].links) { return; }
        all[id].links = all[id].links.filter(function (l) { return !/^index\\.html/.test(l.url); }).map(function (l) {
          var m = /^ALAAP\\.html#\\/plan\\/stage-(\\d+)$/.exec(l.url);
          if (m && num[m[1]]) { return { label: l.label.replace(/^Stage \\d+/, "Stage " + num[m[1]]), url: "#/plan/stage-" + num[m[1]] }; }
          return { label: l.label, url: l.url.replace("https://github.com/TrenTorch/TrenTorch/tree/TrenTorch-Main/TrenTorch_CLI/", tt) };
        });
      });
    });
  });
});
</script>
"""


def stamp(page):
    """The ?v=<hash> on each shared file, as figures/stamp.py writes it."""
    def one(m):
        p = os.path.join(os.path.dirname(HERE), m.group(1), m.group(2))
        if not os.path.exists(p):
            return m.group(0)
        return '"%s/%s?v=%s"' % (m.group(1), m.group(2), hashlib.sha1(io.open(p, "rb").read()).hexdigest()[:8])
    return re.sub(r'"(figures|coding|site)/([a-z-]+\.(?:js|css))(?:\?v=[0-9a-f]+)?"', one, page)


def main_public():
    global PUB, WHY, TT_WEB, plan
    PUB = P = plan.PUBLIC
    WHY, TT_WEB = "Why it matters", P["tt_web"]
    pieces, parts, pre = guide_pieces()
    pieces = {k: public_text(v) for k, v in pieces.items()}
    for p in parts.values():
        p["meta"] = re.sub(r"^weeks? [^,]+, ", "", p["meta"])
    head, css, defs, figs, order = architecture()
    order = [f for f in order if f not in P["drop_arch"]]
    data = trentorch.load()
    tt = {m["n"]: m for m in data["modules"]}
    for m in tt.values():
        m["path"] = "TrenTorch_CLI/" + m["path"]
    real = plan
    plan, num = public_view(P)
    try:
        body, arch = plan_tab(pieces, parts, pre, figs, tt, data["milestones"]), arch_tab(figs, order, head)
        n_stages = len(plan.STAGES)
    finally:
        plan = real
    page = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    shell = {"TITLE": P["title"], "ICON": "brand/accelerate.svg", "BRAND": P["brand"], "HERE": "dl", "NAV_ASSETS": LOCAL["NAV_ASSETS"],
             "TABS": '    <a href="#/plan" data-tab="plan">The path</a>\n    <a href="#/architecture" data-tab="architecture">Architecture</a>\n',
             "DOCS": "", "TABS_JS": '["plan", "architecture"]', "H1_JS": json.dumps(P["title"]), "KEY_JS": json.dumps(P["key"]),
             "EXTRA": NOTES_JS % (json.dumps({str(k): v for k, v in num.items() if k != "maths"}), json.dumps(P["tt_web"]))}
    for k, v in list(shell.items()) + [("PLAN", body), ("ARCH", arch), ("ARCH_CSS", css), ("ARCH_DEFS", defs)]:
        page = page.replace("{{%s}}" % k, v)
    left = re.findall(r"\{\{\w+\}\}", page)
    if left:
        sys.exit("unfilled: %s" % left)
    page = page.replace('title="In E:/TrenTorch"', 'title="In the TrenTorch repo"').replace(
        "Each diagram now carries what it involves, its topics, and the plan stages that teach it.",
        "Each diagram lists what it involves, its topics, and the stages of the path that teach it.")
    page = stamp(dedash(page))
    for bad in ("index.html", "ALAAP.html", "E:/", "E:\\", "#/status", "#/accent", "Pranav"):
        if bad in page.replace(P["alaap_repo"], ""):
            sys.exit("public page still mentions %r" % bad)
    out = os.path.join(os.path.dirname(HERE), P["out"])
    io.open(out, "w", encoding="utf-8", newline="\n").write(page)
    print("wrote %s: %d bytes, %d stages, %d architecture diagrams" % (out, len(page), n_stages, len(order)))


# the local page's shell, filled into the template it shares with the public page
LOCAL = {"TITLE": "Alaap and TrenTorch", "ICON": "brand/alaap.svg", "BRAND": "Alaap and TrenTorch", "HERE": "alaap",
         "NAV_ASSETS": '<link rel="stylesheet" href="site/nav.css">\n<script src="site/nav.js" defer></script>\n',
         "TABS": ('    <a href="#/plan" data-tab="plan">The plan</a>\n    <a href="#/architecture" data-tab="architecture">Architecture</a>\n'
                  '    <a href="#/status" data-tab="status">Where Alaap stands</a>\n    <a href="#/accent" data-tab="accent">Accent and rights</a>\n'),
         "DOCS": ('<section id="tab-status" data-tab="status" class="doc" hidden><h1>{{STATUS_TITLE}}</h1>{{STATUS}}</section>\n'
                  '<section id="tab-accent" data-tab="accent" class="doc" hidden><h1>{{ACCENT_TITLE}}</h1>{{ACCENT}}</section>\n'),
         "TABS_JS": '["plan", "architecture", "status", "accent"]', "H1_JS": '"Alaap and TrenTorch: one study plan"',
         "KEY_JS": '"alaap.progress.v1"', "EXTRA": ""}


def main():
    pieces, parts, pre = guide_pieces()
    used = set(sum([s.get("alaap", []) for s in plan.STAGES], [])) | {"ten-hours"}
    missing = [k for k in pieces if k not in used]
    if missing:
        sys.exit("guide sections not placed in any stage: %s" % missing)
    head, css, defs, figs, order = architecture()
    data = trentorch.load()
    tt = {m["n"]: m for m in data["modules"]}
    placed = sorted(set(sum([s.get("tt", []) for s in plan.STAGES], [])))
    if placed != sorted(tt):
        sys.exit("TrenTorch modules not placed: %s" % sorted(set(tt) - set(placed)))
    s_title, status = document("00-SANITY-CHECK.md", "st")
    a_title, accent = document("02-ACCENT-AND-RIGHTS.md", "ac")
    page = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    fill = dict(LOCAL)
    fill.update({"PLAN": plan_tab(pieces, parts, pre, figs, tt, data["milestones"]), "ARCH": arch_tab(figs, order, head),
                 "STATUS_TITLE": s_title, "STATUS": status, "ACCENT_TITLE": a_title, "ACCENT": accent,
                 "ARCH_CSS": css, "ARCH_DEFS": defs})
    for k, v in fill.items():
        page = page.replace("{{%s}}" % k, v)
    left = re.findall(r"\{\{\w+\}\}", page)
    if left:
        sys.exit("unfilled: %s" % left)
    page = dedash(page)
    io.open(OUT, "w", encoding="utf-8", newline="\n").write(page)
    import wire
    wire.wire(plan, {f: figs[f]["title"] for f in order})
    print("wrote %s: %d bytes, %d stages, %d TrenTorch modules, %d guide pieces, %d architecture diagrams"
          % (OUT, len(page), len(plan.STAGES), len(placed), len(pieces), len(figs)))


if __name__ == "__main__":
    main_public() if "--public" in sys.argv else main()
