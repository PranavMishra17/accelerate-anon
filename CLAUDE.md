# CLAUDE.md

Accelerate: Pranav's study tracker, and beside it the references: the system design guide,
the coding page and cheat sheet, Alaap and TrenTorch, the alfred_ page, and the interview-loop
pages. Static HTML, no build step for the tracker, published from `main` to
https://pranavmishra17.github.io/self-study/. **The repo is public**: nothing private in files.

**The parent `E:/_Resume-Curator/CLAUDE.md` is about resume tailoring. None of it applies here.**

Read `README.md` for what each page does and the order of `index.html`'s script. Read
`CHARTER.md`, then `CHANGELOG.md`, before any re-plan. This file is the working notes.

## Commands

```bash
python -m http.server 8000 --bind 127.0.0.1   # or study.cmd; always http://localhost:8000
python tools/rebuild.py                       # stamp, every build, every check, in order; stops at the first failure
node figures/check.js                         # every shared figure renders; ids vs notes; figures/check.html gallery
node figures/check.js cand.js                 # same, for candidate DIA entries applied on top
python figures/stamp.py                       # after any figures/ or coding/ change: cache-busting hashes in index.html, the guide, CODING.html
python coding/build_sheet.py                  # after any figures/ or coding/ change: CHEATSHEET.html, one self-contained file to send anyone
python coding/test_data.py                    # every code block in coding/data.js runs; statement examples re-checked
python interviews/build.py zenml_round3       # interviews/zenml-round3.html from its content module (also mphasis, oxus)
python interviews/hub.py                      # INTERVIEWS.html, the hub: a card per loop
python alfred/build.py                        # ALFRED.html from alfred/content.py
python alaap/build.py                         # ALAAP.html + the AL:BEGIN..AL:END block in index.html
```

The wildcard as a flat checklist is the tracker's `#/sheet/wc` (Copy as markdown); no copy is kept in the repo.

Check a page's script still parses: extract the inline `<script>` and `node --check` it.
Check behaviour in the built-in browser pane at `localhost:8000`, asserting on state with
`javascript_tool` or `get_page_text` (screenshots often paint blank after a scroll; a
`resize_window` call repaints).

## Where things live

| Thing | Where | Note |
|---|---|---|
| Tracker | `index.html` (~8.9k lines, one IIFE, ES5) | Content in data (`PLAN`, `WILDCARD`, `STUDY`, `LOOPS`, `SD`, `AL`), views below it |
| Routes | `parseHash()` whitelist + `draw()` | `#/s/<w>/<n>` or `#/s/<id>`, `#/w/<id>` or `#/w/<n>` (wildcard, not `#/s/wc/`), `#/week/<n>`, `#/drill/<scope>`, `#/sheet/<scope>`, `#/progress`, `#/figure`, `#/book`, `#/sky`, ... A new page needs both. Hand-written links to a session use its id (`#/w/wc8`): positions shift |
| Progress | localStorage `selfstudy.m1.planner`, per origin | Shared with the loop pages. Never rename the key. Step keys look like `w2a:0`, `wc3:s2` |
| Extra reading per step | `data/reading.js` | `READING[stepKey] = {read, aieng, sd, figs, figIdea}`, `SD_TECH`. Read by the tracker and `interviews/extract.js`. Edit by hand now |
| Shared figures | `figures/figures.js` | `FIGURES = {S, DIA, slug}`. `S` = SVG helpers, `DIA.<key> = {title, cap, svg()}`. Drawn once, used by key on every page |
| Figure notes | `figures/notes.js`, `notes-sd.js`, `notes-alaap.js` | `FIG_NOTES[key] = {nodes:{id:{d,links}}, edges:{"a>b":{d}}, walk:[ids]}` |
| Figure viewer | `figures/viewer.js`, `viewer.css` | Any element with `data-fig="<key>"`; parts are `data-n="<id>"`, arrows `data-e="from>to"` (`#2` for a duplicate) |
| Icons | `figures/icons.js` | 75 Lucide icons (lucide-static 0.469.0, ISC). Add one by fetching its svg from jsDelivr into `ICONS` |
| System design guide | `SYSTEM DESIGN.html`, `const GUIDE` | Diagrams are `{nodes, edges}` data rendered by `renderDiagram`; keys from `assignFigKeys()`. A `{ type: "fig", key }` block draws a shared figure from `figures.js`. A design reads as step tabs with a sticky step bar (arrow keys, swipe); boards fold by `GUIDE.config.fold`. A design's `home: {text, label, href}` draws a card linking to where its material lives (alfred_ to `ALFRED.html`, Kitaru to the ZenML page). `GUIDE.accelerate` is kept by hand |
| Algorithms page | `coding/data.js` (`window.CODING`: `groups`, `patterns`, `algo`, `extra`, `sheets`), `coding/sheet.js` + `sheet.css` (sheet, popup, highlighter), `CODING.html` (the page), `CHEATSHEET.html` (the sheet alone, generated self-contained by `coding/build_sheet.py`; never edit it) | A pattern has `ex`, `sheet`, `tpl`, `probs` and `vars`; every problem and variation has `st` (statement `p`, two examples `ex`, constraints `k`). An AI systems topic has `hld`, `parts`, `tpl`, `remember`, `asks`, `vars`, `figs`. Tabs Start, Core, Structures, Techniques, AI systems; routes `#<tab>`, `#<id>`, `#cheat`. The sheet fits one screen on a wide display (`fit()` picks font and 6 to 8 columns; check at 1536x787) and switches to scroll mode on a phone, upright or on its side. All code is tested offline, with fakes for models and services; add a test when you add code |
| Alaap page | generated by `alaap/build.py` from `alaap/plan.py` | Never edit `ALAAP.html`. Keys `al:<DIAGRAMS key>`, `al:arch-<id>` |
| Alaap progress | `ALAAP.html`, localStorage `alaap.progress.v1` | Its own tracker: stages marked done, the last stage visited, 'Continue'. Separate from `selfstudy.m1.planner` |
| alfred_ page | generated by `alfred/build.py` from `alfred/content.py` | Never edit `ALFRED.html`. The one home for alfred_ facts, figures and stories; facts checked against the alfred_ code on `origin/main`. A reader: five tabs, a list and one item open at a time, arrow keys between items. Anchors `#start`, `#system`, `#stories`, `#ask`, `#else` (open the first or last-read item), `#a-<where, sms, memory>`, `#l-<doors, turn, wrap, pipe, memory, runs>`, `#s-<bench, wm, swap, multiturn, refunds, grant, notify, rules>`, `#q-1` to `#q-16`, `#fig-<key>`. The build checks verbatim answers against `interviews/zenml_round3.py` |
| Site bar | `site/nav.js`, `site/nav.css` | The one list of pages (`window.SITE_PAGES`); every page draws its badges (icon and a word) from it: beside Start on the tracker's home, in the header everywhere else |
| Interviews hub | `INTERVIEWS.html`, generated by `interviews/hub.py` (each module's `LOOP` carries `brand`, its company colour from its logo or site, and `brand_dark` for dark mode; an empty `when_iso` reads 'date to be set') | A card per loop from each module's `LOOP` and `SOURCES` and the tracker's sessions; progress read at runtime from `selfstudy.m1.planner`. 'Happened' comes from `when_iso` |
| Interview loops | `interviews/<module>.py` + `template.html` -> `<loop>.html` | Add a `LOOPS` entry in `index.html`. Optional `OWN` sets their system against yours; your own system's facts live in `alfred/content.py`. A Prep question can carry `learn: {read: [{url, label, why}]}` to link out (`../ALFRED.html#l-wrap`, `../CODING.html#rag`) instead of copying. Prep is a hub (`SHOW_UP`, banks from `SCRIPTS` and `QA` in `QA_ORDER`, `SOURCES`); banks open in the shared one-screen panel (`openPanel`), links `#/prep/<question id>` open a bank at that question |
| Mocks | `interviews/MOCKS.md` (how to run, personas, JSON shape), `<module>.mocks.json` | Rendered by the template as a read plus a one-screen conversation (`openConvo`). After saving one, rebuild and `git pull` in `E:/_Resume-Curator/self-study` so `localhost:8000` shows it |
| Open figure review points | `figures/REVIEW.md` | 117 items for the next figure pass, 7 of them text overlaps from `check.js` to confirm |
| Archive | `archive/`, `archive/README.md` | Finished work kept for reference; nothing links to it |

## Figures: the contract

- Draw with `S`: `S.box({id, x, y, w, h, label, sub, tone, icon})`, `S.arrow(x1,y1,x2,y2,{label})`,
  `S.node(id, markup)` for plots and free shapes, `S.icon`, `S.text`, `S.path`, `S.axes`,
  `S.frame(w, h, body)` last. Arrow ids are resolved to the nearest boxes within 28 px;
  pass `{id: "a>b"}` when an arrow is not near boxes. Tones: sys math alaap req iv now flat.
- Width 640 (720 at most), about 12 nodes at most, no overlapping text, caption leads with a
  `<b>sentence</b>`. Icons identify (a database is a database), never decorate.
- A note's first sentence stands alone as the hover tooltip. Nodes: what it is in this
  diagram, why it matters, a number where there is one. Walk follows the flow.
- Renaming a figure's parts, or a guide diagram's `title` (it is in the key), orphans its
  notes. Run `node figures/check.js` and fix what it lists.

## How Pranav wants the work done

The long form, for the material itself, is `PROTOCOL.md`, section **How you study best**
(read it before designing any new page, session or figure). The working rules:

- **One home per thing.** The plan is the tracker; the guide, the coding page, Alaap and
  TrenTorch, alfred_ and each loop page are references beside it. A figure, a story, an
  answer or a piece of code lives on one page; every other page links to it or pulls it in by
  key, never copies it. When you find the same text twice, one copy becomes a link.
- **'One screen' holds in every orientation**, a phone upright and on its side included,
  unless he says otherwise.
- **Ask first on anything sizeable or ambiguous; always.** New pages, content rewrites,
  design changes, anything with more than one reasonable reading: use
  `ask-questions-if-underspecified` before building. Numbered questions, lettered options,
  a recommended default in bold, and a `defaults` fast path; he answers like `1b 2a 3a`.
  Clear, small fixes (a typo, "make the header smaller") go ahead without questions. For
  "surprise me" asks, offer a list of options and build only the ones he picks.
- **Teach, don't script.** Every step should open to what it is, the figure that draws it,
  what to read with minutes, and where it sits in the guide, with the spoken answer shut
  behind a toggle until he has tried. He rejected blocks of text to memorise.
- **Design: follow `DESIGN.md`, always.** Every page uses `site/tokens.css` (two families, six
  sizes, body 15px, one accent) and the rules in `DESIGN.md` (no em dashes in written copy, no
  eyebrow labels, no boxes in boxes, a persistent index on long pages). He called the drift from
  this AI slop. Measure sizes and families in the browser before calling a page done.
- **Collapsible, calm, one look.** Steps start shut. One typeface (Atkinson Hyperlegible for
  step text), three sizes, three greys; no second style inside one section. He noticed and
  disliked mixed fonts and boxes.
- **Links are verified or absent.** Fetch every outside URL before adding it. AI Engineering
  from Scratch lessons link to the website, never GitHub (he cannot read the repo view):
  `https://aiengineeringfromscratch.com/lesson?path=phases%2F<phase>%2F<lesson>`. Verify
  the path is listed in the site's `data.js` (or with
  `gh api repos/rohitg00/ai-engineering-from-scratch/contents/phases/<phase>`). DDIA is
  cited as "DDIA, 2e: ch. N Title → Section → Subsection", never "look it up in the index"
  (he could not find things that way) and never 1st-edition numbers. 2e has 14 chapters:
  1 Trade-Offs, 2 Nonfunctional Requirements, 3 Data Models, 4 Storage and Retrieval,
  5 Encoding, 6 Replication, 7 Sharding, 8 Transactions, 9 Trouble with Distributed Systems,
  10 Consistency and Consensus, 11 Batch, 12 Stream Processing, 13 A Philosophy of
  Streaming Systems, 14 Doing the Right Thing (numbers checked against Kleppmann's
  `ept/ddia2-references`). No page numbers until he supplies them from his copy. Link guide
  techniques at `SYSTEM%20DESIGN.html#/patterns/<pattern>/<technique>`.
- **His own answers are verbatim.** When he supplies an answer in his words, it goes in
  exactly as written (mark it `# verbatim`); no polishing unless something is factually
  wrong, and then ask. New answers are written in his voice ("I think", "pretty much", a
  real alfred_ example, a plain closing line), using only facts from his prep, the master
  reference and `job_search/profile/`. Interview answers follow one shape: the question,
  what they may probe, one answer, and lines to swap in.
- **Quizzes**: open questions only, one at a time in a pop-up, at most eight. No blanks, no
  one-word answers.
- **Words**: plain sentence case, short sentences, no emojis, no marketing words, no
  "simply" or "just".
- **Docs stay current**: when a page or process changes, update README, the doc that
  describes it (`WILDCARD.md`, `PROTOCOL.md`, `MILESTONE-1.md`), and `CLAUDE.md` itself.
- **Each pass ends with**: a `CHANGELOG.md` entry (date, what, why, charter deviation or not),
  README updated if a page changed, commit to `main` and push (that publishes), then the live
  check: the Pages build has finished (`gh api repos/pranavmishra17/self-study/pages/builds/latest`,
  status `built`) and the changed pages load at https://pranavmishra17.github.io/self-study/.

## Gotchas

- Files are LF (`git ls-files --eol`). Keep them LF; a patch script must not write CRLF.
- The token shunt blocks reads over 350 lines: `index.html` and the guide are read by span
  (`grep -n` for the function, then `Read` with offset/limit). Cap every grep.
- Browser storage is per origin: `file://`, `127.0.0.1:8000` and `localhost:8000` are three
  different progress stores. Test on `localhost:8000`.
- Heredocs mangle `\n` and regex escapes in Python and JS; write scripts with `Write`.
- Lift-off and other effects must not fire on load (`booted` guard in `markSession`).
- Every page loads `figures/*` and `site/*` with a `?v=<content hash>`: loop pages get it from
  `build.py`, the tracker, the guide and CODING.html from `python figures/stamp.py`;
  CHEATSHEET.html inlines everything and is rebuilt by `python coding/build_sheet.py`. After
  any change in `figures/`, `coding/` or `site/`, run `python tools/rebuild.py`, or the
  browser serves the old file and the guide reports 'No shared figure'.
- Link a wildcard session by id (`#/w/wc8`), never by position: putting `wc18` first on 28 Sep
  sent every `#/w/<n>` link one session off.
- A wildcard session with no date in `forWhat` (like `wc18`, for every interview) is valid;
  `loopDate` returns null for it and the home page shows it without a date.
- The desktop pr-attribution hook may reject a commit trailer; commit without it if so.

## Wings of work ahead

- **Figure pass**: work through `figures/REVIEW.md` (missing failure paths, captions the
  drawing does not show). Figures are edited once in `figures.js`; notes follow.
- **Milestone 2**: TrenTorch as the spine, sequenced in `alaap/plan.py` stages 3 to 15;
  `ROADMAP-AHEAD.md` has the intent. Detailing it into sessions is a re-plan: charter first.
- **Next interview loop**: a new `interviews/<module>.py`, build its page, add to `LOOPS`,
  park the old loop's leftover sessions.
- **Improvements list**: `IMPROVEMENTS.md` names what was built and what is deliberately not.
