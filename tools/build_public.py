"""Build _site/, the public GitHub Pages site, from an allowlist. Nothing else is published.

    python tools/build_public.py

The public site is a toolkit: a landing page (written here) and four pages from the repo, the
system design guide, the coding page, the cheat sheet and the deep learning path. It carries no
tracker, no interview pages and nothing from private/. The copy of each page:
  - loses every <script src=".../private/..."> tag and every region between /* local-only */
    and /* end local-only */;
  - sets window.SITE_PUBLIC = true before site/nav.js, so the badges and the guide switch to
    their public mode;
  - takes only the files it loads (site/, figures/, coding/, fonts/, brand/), found by reading
    its src, href and url() references; figure notes drop links into pages that are not
    published, and links into the Alaap plan are pointed at the deep learning path.
Then every file is checked and the build exits non-zero on: "alfred" in any case, "private/",
"Pranav" (a GitHub handle in a github.com URL excepted), a link to a page that is not
published (INTERVIEWS.html, interviews/, ALAAP.html, ALFRED.html, tracker routes #/w/ and #/s/),
a local path like E:/, or a local link or asset that is not in _site/.

.github/workflows/pages.yml runs this on every push to main and deploys _site/.
DEEP-LEARNING.html is built by `python alaap/build.py --public`, which needs local checkouts,
so the built file is committed and this script only copies it.
"""
import hashlib, html, io, json, os, re, shutil, sys, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "_site")
PAGES = ["SYSTEM DESIGN.html", "CODING.html", "CHEATSHEET.html", "DEEP-LEARNING.html"]
EXTRA = ["brand/accelerate.svg"]           # drawn by site/nav.js, so no page names it in an attribute
TEXT = (".html", ".js", ".css", ".json", ".svg", ".txt", ".md")

BAD = [
    (re.compile(r"(?i)alfred"), "alfred"),
    (re.compile(r"private/"), "private/"),
    (re.compile(r"Pranav(?!Mishra17/)|(?<!github\.com/)PranavMishra17"), "Pranav"),
    (re.compile(r"INTERVIEWS\.html|interviews/|ALAAP\.html|ALFRED\.html|#/w/|#/s/"), "a link to an unpublished page"),
    (re.compile(r"(?<![A-Za-z])[A-Z]:[\\/]"), "a local path"),
]


def read(path):
    return io.open(os.path.join(ROOT, path), encoding="utf-8").read()


def flagged(text):
    return [name for rx, name in BAD if rx.search(text)]


def clean(text):
    """The public copy of any text file: private tags, local-only regions and comments that name
    unpublished things are cut; the code around them is untouched."""
    text = re.sub(r'<script[^>]*\ssrc="[^"]*private/[^"]*"[^>]*></script>\n?', "", text)
    text = re.sub(r"[ \t]*/\* local-only \*/[\s\S]*?/\* end local-only \*/\n?", "", text)
    text = re.sub(r"/\*[\s\S]*?\*/", lambda m: "" if flagged(m.group(0)) else m.group(0), text)
    return re.sub(r"<!--[\s\S]*?-->", lambda m: "" if flagged(m.group(0)) else m.group(0), text)


def public_link(link, num):
    """A figure note's link as the public site can follow it, or None."""
    url = link["url"]
    m = re.match(r"ALAAP\.html#/plan/stage-(\d+)$", url)
    if m and m.group(1) in num:
        n = num[m.group(1)]
        return {"label": re.sub(r"^Stage \d+", "Stage %d" % n, link["label"]), "url": "DEEP-LEARNING.html#/plan/stage-%d" % n}
    return None if flagged(url) or re.match(r"(index|ALAAP)\.html", url) else link


def fix_notes(text, num):
    """figures/notes*.js: window.FIG_NOTES = Object.assign(window.FIG_NOTES || {}, {JSON});"""
    head = "Object.assign(window.FIG_NOTES || {}, "
    a, b = text.index(head) + len(head), text.rindex("});") + 1
    notes = json.loads(text[a:b])
    for note in notes.values():
        for part in ("nodes", "edges"):
            for item in (note.get(part) or {}).values():
                if "links" in item:
                    item["links"] = [l for l in (public_link(x, num) for x in item["links"]) if l]
    return text[:a] + json.dumps(notes, ensure_ascii=False, indent=0) + text[b:]


def refs(path, text):
    """Local files a page or stylesheet loads or links: src, href and url(), without ?v= or #."""
    found = re.findall(r'(?:src|href)="([\w./%-]+)(?:[?#][^"]*)?"', text) if path.endswith(".html") else []
    found += re.findall(r"url\(['\"]?([\w./%-]+)(?:[?#][^)'\"]*)?['\"]?\)", text) if path.endswith((".css", ".html")) else []
    base = os.path.dirname(path)
    return {os.path.normpath(os.path.join(base, urllib.parse.unquote(f))).replace("\\", "/") for f in found}


def counts():
    """What the landing page says each page holds, read from the pages themselves."""
    guide = read("SYSTEM DESIGN.html")
    designs = re.findall(r'GUIDE\.examples\.push\(\{\s*id: "([^"]+)",\s*tabLabel: "[^"]+",\s*title: "([^"]+)"', guide)
    i = guide.index("GUIDE.patterns = {")
    block = guide[i:guide.index("GUIDE.examples.push(", i)]
    u = guide.index("GUIDE.patternUsage = {")
    usage = set(re.findall(r'^  "?([a-z-]+)"?: [\[{]', guide[u:guide.index("\n};", u)], re.M))
    s = read("coding/data.js")
    D = json.loads(s[s.index("window.CODING = ") + 16:].rstrip().rstrip(";"))
    algo = [p for p in D["patterns"] if not p.get("parts") and p["g"] != "ai-systems"]
    topics = [p for p in D["patterns"] if p.get("parts")]
    dl = read("DEEP-LEARNING.html")
    c = {
        "designs": [{"id": k, "title": t, "steps": 6 + (k in usage)} for k, t in designs],
        "patterns": len(re.findall(r'^      id: "[^"]+", family:', block, re.M)),
        "techniques": len(re.findall(r'^        \{ id: "[^"]+", name: ', block, re.M)),
        "algo": len(algo), "topics": len(topics),
        "probs": sum(len(p.get("probs", [])) for p in D["patterns"]),
        "vars": sum(len(p["vars"]) for p in D["patterns"]),
        "stages": len(set(re.findall(r'id="stage-(\d+)"', dl))),
    }
    c["marks"], c["n_designs"] = c["probs"] + c["vars"], len(c["designs"])
    c["num"] = json.loads(re.search(r"var num = (\{[^}]*\})", dl).group(1))
    assert c["designs"] and c["patterns"] and c["techniques"] and c["algo"] and c["topics"] and c["stages"], c
    return c


def stamp(page):
    """?v=<hash of the published copy> on each shared file the landing page loads."""
    def one(m):
        return '"%s?v=%s"' % (m.group(1), hashlib.sha1(open(os.path.join(OUT, m.group(1)), "rb").read()).hexdigest()[:8])
    return re.sub(r'"((?:site|fonts)/[a-z-]+\.(?:js|css))"', one, page)


def main():
    c = counts()
    shutil.rmtree(OUT, ignore_errors=True)
    todo, seen = list(PAGES) + EXTRA, set()
    while todo:
        path = todo.pop()
        if path in seen:
            continue
        seen.add(path)
        if path.endswith(".html") and path not in PAGES:
            if path == "index.html":      # the landing page, written below
                continue
            sys.exit("FAILED: a published page links to %s, which is not published" % path)
        src = os.path.join(ROOT, path)
        if not os.path.isfile(src):
            sys.exit("FAILED: %s is loaded or linked but does not exist" % path)
        dst = os.path.join(OUT, path)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if not path.endswith(TEXT):
            shutil.copyfile(src, dst)
            continue
        text = clean(read(path))
        todo += sorted(refs(path, text) - seen)   # what the published copy loads or links
        if re.match(r"figures/notes[\w-]*\.js$", path):
            text = fix_notes(text, c["num"])
        if path.endswith(".html"):
            text = re.sub(r'(<script src="site/nav\.js)', r"<script>window.SITE_PUBLIC = true;</script>\n\1", text, count=1)
        io.open(dst, "w", encoding="utf-8", newline="\n").write(text)
    landing = LANDING.replace("{{DATA}}", json.dumps({k: c[k] for k in c if k != "num"}).replace("</", "<\\/"))
    for k, v in c.items():
        landing = landing.replace("{{%s}}" % k, str(v) if not isinstance(v, (list, dict)) else "")
    landing = landing.replace("{{design_names}}", names([d["title"] for d in c["designs"]]))
    left = re.findall(r"\{\{\w+\}\}", landing)
    if left:
        sys.exit("FAILED: landing page has unfilled %s" % left)
    io.open(os.path.join(OUT, "index.html"), "w", encoding="utf-8", newline="\n").write(stamp(landing))
    open(os.path.join(OUT, ".nojekyll"), "w").close()
    check()


def names(xs):
    return ", ".join(xs[:-1]) + " and " + xs[-1] if len(xs) > 1 else "".join(xs)


def check():
    """Every published text file, read back: nothing personal, private or unpublished in it."""
    bad, files = [], []
    for d, _, fs in os.walk(OUT):
        for f in fs:
            p = os.path.join(d, f)
            files.append(p)
            if not f.endswith(TEXT):
                continue
            text = io.open(p, encoding="utf-8").read()
            for rx, name in BAD:
                m = rx.search(text)
                if m:
                    bad.append("%s: %s, near %r" % (os.path.relpath(p, OUT).replace("\\", "/"), name, text[max(0, m.start() - 50):m.end() + 30]))
    if bad:
        sys.exit("FAILED: the public site would publish\n  " + "\n  ".join(bad))
    size = sum(os.path.getsize(p) for p in files)
    print("wrote %s: %d files, %d KB; checks passed" % (os.path.relpath(OUT, ROOT), len(files), size // 1024))


LANDING = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Accelerate</title>
<meta name="description" content="A free study toolkit for system design, coding interviews and deep learning from scratch. Static pages, no account; progress stays in your browser.">
<link rel="icon" type="image/svg+xml" href="brand/accelerate.svg">
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="site/tokens.css">
<link rel="stylesheet" href="site/nav.css">
<script>window.SITE_PUBLIC = true;</script>
<script src="site/nav.js" defer></script>
<!-- Generated by tools/build_public.py. Edit the template there and rebuild. -->
<style>
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: var(--fs-md)/var(--lh-body) var(--font); -webkit-font-smoothing: antialiased; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 3px; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: var(--radius-sm); }
b, strong { font-weight: var(--w-strong); }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 var(--s5); }
.top { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s2) var(--s5); padding: var(--s4) 0 var(--s3); border-bottom: var(--hair); }
h1 { font-size: var(--fs-2xl); font-weight: var(--w-strong); line-height: var(--lh-tight); margin: 0; }
.lead { color: var(--soft); margin: var(--s4) 0 var(--s5); max-width: var(--measure); }
.lead b { color: var(--ink); }
.note { font-size: var(--fs-sm); color: var(--muted); margin: 0 0 var(--s6); max-width: var(--measure); }

/* The pages: a card each, as on the interviews hub. One neutral surface with the page's name in
   its colour (--b, a categorical token); hover and focus add a faint tint of it and a coloured border. */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--s4); margin: 0 0 var(--s3); padding: 0; list-style: none; }
.card {
  --c-bg: var(--surface); --c-name: var(--b); --c-ink: var(--ink); --c-soft: var(--soft); --c-muted: var(--muted); --c-rule: var(--rule);
  position: relative; display: flex; flex-direction: column; min-width: 0; padding: var(--s4);
  background: var(--c-bg); color: var(--c-ink); border: 1px solid var(--c-rule); border-radius: var(--radius);
}
.card:hover, .card:focus-within {
  --c-bg: color-mix(in srgb, var(--b) 6%, var(--surface)); --c-rule: color-mix(in srgb, var(--b) 45%, var(--rule));
}
.card, .card * { transition: background-color 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out; }
@media (prefers-reduced-motion: reduce) { .card, .card * { transition: none; } }
/* The wordmark: as on the hub, the one deliberate exception to the 24px ceiling. fit() sizes it. */
.wm { display: flex; align-items: flex-end; margin: 0; min-height: 1em; font-size: var(--fs-lg); }
.nm { display: inline-block; white-space: nowrap; color: var(--c-name); font-weight: 700; letter-spacing: -.035em; line-height: 1; padding-bottom: .04em; }
.nm:hover { text-decoration: none; }
.nm::after { content: ""; position: absolute; inset: 0; z-index: 1; border-radius: var(--radius); }
.nm:focus-visible { outline: none; }
.nm:focus-visible::after { outline: 2px solid var(--accent); outline-offset: 3px; }
.rd { font-size: var(--fs-sm); font-weight: var(--w-strong); color: var(--c-ink); margin: var(--s3) 0 0; }
.ctx { font-size: var(--fs-sm); color: var(--c-soft); margin: 0; }
.ft { margin-top: auto; padding-top: var(--s5); }
.hrs { font-size: var(--fs-xs); color: var(--c-muted); margin: 0; }
.hrs b { color: var(--c-ink); }
.bar { height: 2px; background: var(--c-rule); margin: var(--s2) 0 0; overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--c-soft); }
.go { display: flex; flex-wrap: wrap; gap: var(--s1) var(--s4); font-size: var(--fs-sm); padding-top: var(--s3); }
.go a { position: relative; z-index: 2; color: var(--c-soft); text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px; }
.go a:hover, .card:hover .go a, .card:focus-within .go a { text-decoration-color: currentColor; }
.go a:focus-visible { outline-color: currentColor; }

/* The reading below the cards: sections on hairlines, text at most 72 characters wide. */
section { border-top: var(--hair); padding: var(--s5) 0; }
h2 { font-size: var(--fs-xl); font-weight: var(--w-strong); line-height: var(--lh-tight); margin: 0 0 var(--s3); }
h3 { font-size: var(--fs-lg); font-weight: var(--w-strong); line-height: var(--lh-tight); margin: var(--s5) 0 var(--s2); }
h3 i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--b); margin-right: var(--s2); }
section p, section ol { max-width: var(--measure); margin: 0 0 var(--s3); color: var(--soft); }
section ol { padding-left: 22px; }
section li { margin: 0 0 var(--s2); }
section p b, section li b { color: var(--ink); }
.two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 var(--s7); }
.two h3:first-child { margin-top: 0; }
footer { border-top: var(--hair); padding: var(--s4) 0 var(--s6); font-size: var(--fs-xs); color: var(--muted); }
@media (max-width: 860px) { .two { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 720px) { .wrap { padding: 0 var(--s4); } .top { padding: var(--s3) 0; } }
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>Accelerate</h1>
    <nav class="sn-top" data-site-nav data-here="home"></nav>
  </header>
  <main>
    <p class="lead"><b>A free study toolkit for system design, coding interviews and deep learning from scratch.</b>
      Four static pages that teach rather than list: every idea opens to what it is, a diagram, and an answer kept shut until you have tried.</p>
    <ul class="grid" id="cards"></ul>
    <p class="note">Your progress is read from this browser's own storage and shown on the cards. Nothing is sent anywhere, and there is no account. Clearing this site's data resets it.</p>

    <section>
      <h2>What is inside</h2>
      <div class="two">
        <div>
          <h3 style="--b: var(--cat-1)"><i></i><a href="SYSTEM%20DESIGN.html">System design guide</a></h3>
          <p>A framework of six steps for any design question: requirements, core entities, the API, data flow, the high-level design and deep dives, each with a time budget.
            Then {{patterns}} deep-dive patterns, from scaling reads to agent safety, holding {{techniques}} techniques; each technique has its own diagram, when to reach for it and its trade-off.
            Then {{n_designs}} designs worked end to end: {{design_names}}. A design reads one step at a time; the arrow keys move between steps.</p>
          <h3 style="--b: var(--cat-2)"><i></i><a href="CODING.html">Algorithms and coding</a></h3>
          <p>The Start tab covers how to code out loud and what each operation costs. Then {{algo}} patterns, from two pointers and sliding windows to graphs, dynamic programming and backtracking.
            Each opens to an example, a template, classic problems and their variations. The page holds {{probs}} problems and {{vars}} variations, each with a full statement, two worked examples, constraints and the code, shut until you have tried.
            The AI systems tab has {{topics}} topics beyond LeetCode, such as RAG over a parser's output, an agent loop, a voice pipeline and fine-tuning with LoRA: the design in components, a skeleton for each, what to remember and what gets asked. Every code block runs and is tested.</p>
        </div>
        <div>
          <h3 style="--b: var(--cat-3)"><i></i><a href="CHEATSHEET.html">Cheat sheet</a></h3>
          <p>The coding page on one screen: a card per pattern and topic. Click a card for its examples and variations; F goes full screen. It fits one screen on a laptop and scrolls on a phone.
            It is also one self-contained file, with its fonts and figures inside: <a href="CHEATSHEET.html" download="coding-cheat-sheet.html">download it</a> and it works offline.</p>
          <h3 style="--b: var(--cat-4)"><i></i><a href="DEEP-LEARNING.html">Deep learning from scratch</a></h3>
          <p>{{stages}} stages in three parts. Foundations covers the maths and how audio becomes numbers. In the second part you build a small PyTorch-like framework on NumPy, module by module: tensors, autograd, optimisers, convolutions, attention and a transformer.
            The third reads a real speech system, from speaker identity to how a text-to-speech model turns a written description into a voice. Each stage has a goal, a diagram, what to build and an exit check with its answer. Python and NumPy; no GPU.</p>
        </div>
      </div>
      <p><b>Every diagram can be explored.</b> Click one and it opens full screen. Hover a part for a one-line note and click it for the explanation, with links to where it is taught; Walk through steps the flow one part at a time, and the arrow keys move.</p>
    </section>

    <section class="two">
      <div>
        <h2>Who it is for</h2>
        <p>Engineers preparing for system design and coding interviews, including roles where a model sits in the middle of the system. Students who know Python and want the common patterns named and practised.
          Anyone who wants to understand deep learning by building it rather than calling it.</p>
      </div>
      <div>
        <h2>How to study with it</h2>
        <ol>
          <li><b>Coding first.</b> Read the Start tab, then take one pattern a day: read its template, try a problem before opening the solution, and tick it once you can solve it cold.</li>
          <li><b>One design at a time.</b> Read the framework once, then work a design step by step, saying each step aloud before you read it.</li>
          <li><b>Patterns when a deep dive needs them.</b> Open the pattern a design names and read the techniques it lists.</li>
          <li><b>The cheat sheet for revision.</b> Keep it open while you practise, and download it for the week before an interview.</li>
          <li><b>Deep learning alongside.</b> A few hours a week, in order. Pass each stage's exit check before you move on.</li>
        </ol>
      </div>
    </section>
  </main>
  <footer>Icons: Lucide (ISC licence). Typefaces: Atkinson Hyperlegible and JetBrains Mono (SIL Open Font License).</footer>
</div>
<script type="application/json" id="site-data">{{DATA}}</script>
<script>
"use strict";
(function () {
  var C = JSON.parse(document.getElementById("site-data").textContent);

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function store(key) {
    try { var v = JSON.parse(window.localStorage.getItem(key) || "null"); return v && typeof v === "object" ? v : {}; }
    catch (err) { return {}; }
  }
  function line(n, total, what, none) {
    if (!n) { return '<p class="hrs">' + none + "</p>"; }
    return '<p class="hrs"><b>' + n + "</b> of " + total + " " + what + '</p><div class="bar" role="progressbar" aria-label="' + esc(what) +
      '" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + n + '"><i style="width:' + Math.round(100 * n / total) + '%"></i></div>';
  }

  /* Progress, each from the page's own store: the guide's visited steps, the coding page's
     ticks, the deep learning path's stages. Read only; this page writes nothing. */
  function progress(key) {
    if (key === "guide") {
      var seen = store("sd-delivery-guide:visited"), total = 0, n = 0;
      C.designs.forEach(function (d) { total += d.steps; n += Math.min(d.steps, (Array.isArray(seen[d.id]) ? seen[d.id] : []).length); });
      return line(n, total, "design steps read", "No design steps read yet. Start with the framework.");
    }
    if (key === "coding") {
      var done = store("coding.progress.v1").done || {};
      return line(Object.keys(done).length, C.marks, "problems and variations done", "Nothing ticked yet. Tick a problem once you can solve it cold.");
    }
    if (key === "dl") {
      var p = store("dl.progress.v1"), d = Object.keys(p.done || {}).length;
      return line(d, C.stages, "stages done", p.last ? "Started: stage " + esc(p.last.stage) + " was the last one open." : "Not started. Stage 1 is the maths you need.");
    }
    return '<p class="hrs">A reference to keep open. Nothing to mark.</p>';
  }

  var CARDS = [
    { key: "guide", name: "System design", href: "SYSTEM%20DESIGN.html", cat: 1,
      rd: "A framework, " + C.patterns + " patterns, " + C.designs.length + " designs",
      ctx: "Six steps for any design question, and every deep dive named.",
      links: [["Framework", "SYSTEM%20DESIGN.html#/framework"], ["Patterns", "SYSTEM%20DESIGN.html#/patterns"], ["Designs", "SYSTEM%20DESIGN.html#/designs"]] },
    { key: "coding", name: "Coding primer", href: "CODING.html", cat: 2,
      rd: C.algo + " patterns, " + C.topics + " AI systems topics",
      ctx: "Problems written out in full, with tested solutions.",
      links: [["Start", "CODING.html#start"], ["AI systems", "CODING.html#ai-systems"]] },
    { key: "cheat", name: "Cheat sheet", href: "CHEATSHEET.html", cat: 3,
      rd: "The coding page on one screen",
      ctx: "One file that works offline, on a laptop or a phone.",
      links: [["Download", "CHEATSHEET.html", "coding-cheat-sheet.html"]] },
    { key: "dl", name: "Deep learning", href: "DEEP-LEARNING.html", cat: 4,
      rd: C.stages + " stages, from the maths to a speech model",
      ctx: "Build a PyTorch-like framework, then read a speech system.",
      links: [["The path", "DEEP-LEARNING.html#/plan"], ["Architecture", "DEEP-LEARNING.html#/architecture"]] }
  ];

  function draw() {
    document.getElementById("cards").innerHTML = CARDS.map(function (c) {
      return '<li class="card" style="--b: var(--cat-' + c.cat + ')">' +
        '<h2 class="wm"><a class="nm" href="' + c.href + '">' + esc(c.name) + "</a></h2>" +
        '<p class="rd">' + esc(c.rd) + '</p><p class="ctx">' + esc(c.ctx) + "</p>" +
        '<div class="ft">' + progress(c.key) + '<div class="go">' + c.links.map(function (l) {
          return '<a href="' + l[1] + '"' + (l[2] ? ' download="' + l[2] + '"' : "") + ">" + esc(l[0]) + "</a>";
        }).join("") + "</div></div></li>";
    }).join("");
    fit();
  }

  /* As on the hub: every name is one height, and letter-spacing makes each fill its card's
     width. The height is the largest (up to 64px) at which every name fits with its letters at
     most 0.05em tighter than the base tracking; shorter names spread out. The trailing space
     after the last letter is cancelled, and a row's names share one baseline. */
  function fit() {
    var marks = [].slice.call(document.querySelectorAll(".wm"));
    if (!marks.length) { return; }
    marks.forEach(function (h) {
      h.style.minHeight = "";
      var s = h.firstChild.style;
      s.fontSize = "100px"; s.letterSpacing = ""; s.marginRight = "";
    });
    var size = 64;
    marks.forEach(function (h) {
      var co = h.firstChild, gaps = Math.max(0, co.textContent.length - 1);
      size = Math.min(size, 100 * (h.clientWidth - 1) / (co.getBoundingClientRect().width - 5 * gaps));
    });
    size = Math.max(17, Math.floor(size * 10) / 10);
    marks.forEach(function (h) {
      var co = h.firstChild, n = co.textContent.length;
      co.style.fontSize = size + "px";
      co.style.letterSpacing = "0px";
      var ls = n > 1 ? (h.clientWidth - 1 - co.getBoundingClientRect().width) / (n - 1) : 0;
      ls = Math.min(ls, 0.06 * size);   /* a short name is not stretched: it ends early instead */
      co.style.letterSpacing = ls.toFixed(2) + "px";
      co.style.marginRight = (-ls).toFixed(2) + "px";
    });
    var rows = {};
    marks.forEach(function (h) { var t = h.parentNode.offsetTop; rows[t] = Math.max(rows[t] || 0, h.getBoundingClientRect().height); });
    marks.forEach(function (h) { h.style.minHeight = rows[h.parentNode.offsetTop] + "px"; });
  }

  draw();
  window.addEventListener("storage", draw);
  window.addEventListener("pageshow", function (e) { if (e.persisted) { draw(); } });
  var grid = document.getElementById("cards"), width = 0;
  if (window.ResizeObserver) {
    new ResizeObserver(function () { if (grid.clientWidth !== width) { width = grid.clientWidth; fit(); } }).observe(grid);
  }
  if (document.fonts) { document.fonts.ready.then(fit); }
}());
</script>
</body>
</html>
"""

if __name__ == "__main__":
    assert flagged("see ALFRED.html") and flagged("x Alfred_ y") and flagged("E:/kitaru") and flagged("index.html#/s/2/1")
    assert not flagged("https://github.com/PranavMishra17/alaap") and flagged("Pranav's harness") and not flagged("index.html")
    assert clean('a<script src="private/site.js"></script>\nb') == "ab"
    assert clean("x /* local-only */ y /* end local-only */z") == "xz"
    assert clean("/* tracker (index.html#/s/1/1) */k") == "k" and clean("/* keep */k") == "/* keep */k"
    assert public_link({"label": "Stage 7: x", "url": "ALAAP.html#/plan/stage-7"}, {"7": 8})["url"] == "DEEP-LEARNING.html#/plan/stage-8"
    assert public_link({"label": "w", "url": "index.html#/s/1/1"}, {}) is None
    main()
