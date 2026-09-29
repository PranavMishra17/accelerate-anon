# Revamp: one plan, parallel references, nothing said twice

Written 29 September 2026. Executed one phase at a time; each phase ends with a commit to
`main`, a live check, and a pause for Pranav before the next one starts.

## The shape we have arrived at

There is **one plan**: the study plan in the tracker (`index.html`), five weeks at a time,
with a wildcard for interviews. Beside it run **references**, used every week or so and
never finished:

| Reference | Home | What it is for |
|---|---|---|
| System design | `SYSTEM DESIGN.html` | The framework, patterns and techniques, and designs worked end to end |
| Coding | `CODING.html`, `CHEATSHEET.html` | Algorithm patterns, problems and variations, AI systems coding; the sheet on one screen |
| Alaap and TrenTorch | `ALAAP.html` | The ML and audio plan, TrenTorch stage by stage |
| alfred_ | `ALFRED.html` (new) | Your own system and its stories, refreshed before any interview |
| Interview loops | `interviews/<loop>.html` | One page per loop; ZenML's page also holds everything learned about Kitaru |

**The rule: one home per thing.** A figure is drawn once in `figures/figures.js` and shown
by key. A story or an answer lives on one page; every other page links to it. When the same
text appears on two pages, one of them becomes a link.

## Phase 1. The tracker's home page and the launch bar

**Done, 29 Sep** (commit a137ca6): the launch bar, the flight plan gone, a lean home; Progress and Explain a figure on their own routes.

- A launch bar at the top right of `index.html`: icon buttons with hover labels for System
  design, Coding, Cheat sheet, Alaap and TrenTorch, alfred_, and the current interview loop
  (the first entry in `LOOPS`). Each opens in a new tab.
- Remove the flight plan chart (the plane and trajectory) and its styles and code.
- The home page keeps four things: the next session, this week's sessions, open wildcard
  items, and three for today. The stats, the book, the sky, the craft and the year map move
  behind the left rail, each on its own route.
- Done when: the home page fits about one screen at 1536x787, every launch button opens its
  page in a new tab, no console errors, the rail reaches everything that left the home page.

## Phase 2. The wildcard

**Done, 29 Sep** (acf1d2d): done sessions hidden behind a toggle, a one-line note, ZenML's sessions and `wc18` parked, past loops folded.

- One list, as now, with done sessions hidden and a "show done" toggle.
- The note shrinks to one line: the loop in play ("Mphasis, technical"). Loops that have
  happened are parked: their sessions stay counted, out of sight.
- `wc18` ("alfred_ from the outside") leaves the wildcard; its substance moves to
  `ALFRED.html` in phase 3, as study material rather than a recitation drill.
- Update `WILDCARD.md` and `STUDY-LIST.md` to match.

## Phase 3. `ALFRED.html`, a living page for your own system

**Done, 29 Sep** (acf1d2d): `ALFRED.html` built by `alfred/build.py` from `alfred/content.py`; its facts re-checked against the code in phase 6.

Quick and short, for refreshing before any interview. Sections, each folded:

1. **Start here**: where it runs, one SMS end to end, memory in three kinds (the guide's
   'three answers', moved here as their home; the guide links to it).
2. **The system, layer by layer**: ingress and the job queue, the turn, the tool wrapper
   stack, the email pipeline, memory, where everything runs. Each with its shared figure by
   key (`alfredHld`, `alfredTurn`, `alfredWrap`, `alfredPipe`, `alfredMemory`,
   `alfredDeploy`), the nuances, and the numbers.
3. **The stories**: the eval bench, working memory, the SQLite swap, multi-turn replay, the
   two missing refunds. Your own words where you gave them (`# verbatim`), the numbers, what
   they probe, lines to swap in. Figures `benchLoop`, `benchAdapter`, `benchSchema`,
   `sqliteTemplate`, `multiturn`, `completeness`, `harnessSeam`.
4. **What they ask**: the recurring questions, one answer each.
5. **Where else**: the guide's six-step alfred_ design, the ZenML page's alfred_ against
   Kitaru, the tracker sessions that use it.

Facts are checked against the alfred_ code on `origin/main` before they go in, as the
three answers were. Built from one content module (like the loop pages) so an answer is
edited in one place.

## Phase 4. The system design guide: structure and movement

**Done, 29 Sep** (acf1d2d): design steps as tabs with a sticky step bar, arrow keys and swipe, boards folded by `GUIDE.config.fold`; the alfred_ design links to `ALFRED.html`.

- **Designs page**: each design becomes step tabs (Requirements, Entities, API, High-level
  design, Deep dives, and the rest), one step on screen at a time, with a sticky mini-map
  of the steps and a progress mark. Boards fold to their essentials; the spoken script and
  the probes sit behind toggles.
- **Movement**: keyboard and swipe between steps, the scroll position kept per step, no
  jumps when a section opens, back and forward work.
- **Length**: long boards get a summary line and a 'show all'.
- A polish pass over the framework and patterns pages with the same eye: headings, spacing,
  what is shown before a click.
- Done when: every design reads one step per screen at 1536x787 and on a phone, and every
  existing link into the guide (`#/designs/<id>/<step>`, `#/patterns/...`) still lands.

## Phase 5. Polish across the whole site

**Built alongside phase 6, 29 Sep**: one site bar from `site/nav.js` on every page. Marked done once it is checked live.

- One launch bar on every page (tracker, guide, coding, Alaap, loop pages, alfred_), from
  one shared file, so the pages feel like one site and each can reach the others.
- One look: Atkinson Hyperlegible, three sizes, three greys, the same cream; dark mode
  checked on every page.
- Every page checked at 1536x787, 1920x1080, and a phone upright and on its side.

## Phase 6. Re-audit: duplicates become links, dead content goes

**Done, 29 Sep.** Every candidate below was confirmed and acted on; the summary is in `CHANGELOG.md`.

Candidates found so far, to confirm one by one:

- alfred_ content on three pages (the guide's design, the ZenML page's alfred_ tab, the
  wildcard's `wc18`): `ALFRED.html` becomes the home, the others link.
- Kitaru in the guide and on the ZenML page: the ZenML page stays the home for what you
  learned; the guide keeps only the design walk-through and links across.
- Quick Python on the Mphasis page and the AI-flavoured coding on `CODING.html`.
- Folders and files that may be finished with: `variants/` (layout experiments),
  `handoffs/dictation-and-shell.md`, `diagnostics/baseline-diagnostic.html`,
  `interviews/oxus.*` (archived loop). Each is kept, archived or removed on your say.
- Docs brought current: `README.md`, `CLAUDE.md`, `WILDCARD.md`, `PROTOCOL.md`,
  `MILESTONE-1.md`, `IMPROVEMENTS.md`, `figures/REVIEW.md`.
- Three working rules into `CLAUDE.md`, pending your yes (from the reflection on 29 Sep):
  one home per thing; 'one screen' holds in every orientation unless you say otherwise;
  a pass ends with the live check (the Pages build and the live URL).

## Backlog: checks instead of rules

- Done: `tools/rebuild.py`: stamp, build the sheet, build the loop pages, `check.js`,
  `test_data.py`, in one command, so no step is skipped.
- Done: a text-overlap check in `figures/check.js`. Its seven warnings are in
  `figures/REVIEW.md` to confirm by eye.
- A layout check that renders pages at the three sizes above and fails on overflow.
- Generate `GUIDE.accelerate` (the guide's links back into the tracker) from the tracker's
  `sd` refs in `tools/rebuild.py`, instead of keeping it by hand.

## What is left for you

1. **alfred_'s safety gate.** Your master reference and resume say the Execution Decision
   Layer sorts each action into five verdicts by deterministic risk scoring. The alfred_
   code on `origin/main` has no risk score: a code floor (sends and irreversible deletes
   always confirm) plus the preferences you write in plain text, applied by the agent. The
   pages now follow the code. Is the five-verdict layer an earlier version, the take-home,
   or somewhere the code search missed?
2. **Mphasis.** Did the round on 28 September happen? If so, park it (`LOOPS` and
   `WILDCARD.md`) and the wildcard has no loop in play.
3. **`progress/`.** Nothing was ever committed there, and the repo is public. Keep the
   folder, or remove it and change the README line to "keep the export somewhere private"?
4. **`STUDY-LIST.md`.** It is a generated copy of `#/sheet/wc` and reads "Nothing open".
   Keep it, or remove it and use the sheet's copy-as-markdown when needed?
5. **Six or twelve.** `MILESTONE-1.md` says six requeue items are what the milestone exists
   to clear; `REQUEUE.md` has twelve. Which six, or all twelve? Due before 26 October.
