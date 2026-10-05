# Changelog

Every re-plan, every deviation, every change of mind. Append only.

The purpose is narrow: to be able to tell, six months from now, whether the plan
adapted or whether it drifted. A deviation recorded with a reason is adaptation. The
same deviation unrecorded is how a year disappears.

Format: date, what changed, why, and whether it contradicts `CHARTER.md`.

---

**2026-09-14 — Baseline diagnostic taken.**
Twenty questions, taken on a busy day. Used as a calibration reading for where to
start, nothing more. Mathematics needs ground-up work; machine learning needs the
mechanisms rather than the descriptions; systems is the strongest area and mostly
needs vocabulary; DSA needs a foundation before maintenance. Full result in
`diagnostics/2026-09-14-baseline.json`.

**2026-09-17 — Plan created. Milestone 1 detailed.**
Systems leads because the pipeline is live and because it is the only track with
existing raw material to hang vocabulary on. Mathematics runs underneath every week
rather than as a block, aimed at TrenTorch-readiness rather than at general
improvement. DSA deliberately at zero through milestone 1. Alaap capped at four
hours — Part 0 and the physics half of Part 2 only — because its own study guide
assumes ML theory the diagnostic showed is not there, and because at 65 hours over
13 weeks it would otherwise consume the entire budget.

**2026-09-17 — Tracker rebuilt as a wall planner; wildcard slot added.**
Five week columns visible at once, a day board carrying session closures and the
life toggles, timestamps on every step and session, an answer field on every step,
and automatic logging of resources opened. A sixth planner slot holds
interview-driven sessions, capped at four folds against planned sessions. See
`WILDCARD.md`.

**2026-09-21 — Week 1 begins.**

**2026-09-22 — Wildcard opened for two loops.**
Oxus technical on 23 September (60 minutes, past work plus one design exercise) and
ZenML round 3 on Monday 28 September at 9 AM Eastern (90 minutes with Hamza Tahir and
Alex Strick van Linschoten). Twelve wildcard sessions written: six for Oxus, weighted
to system design because the intro call was behavioural and no technical ground had
been covered yet; six for ZenML, weighted to side effects in replay and multi-turn
replay, since round 2 probed the bench and idempotency. Week 1 continues in parallel
at whatever state the loops allow; that is a Red or Amber week by design, not a
deviation. The ZenML side-effects session genuinely covers week 4's retries and
idempotency material and is the natural first fold.

**2026-09-22 — Tracker navigation reworked; repo prepared for Claude Code.**
A contents rail replaces the top navigation, session pages get a previous and next
stepper that crosses week boundaries, arrow keys and Escape navigate, and every page
has its own address. Wildcard sessions now open with a study list of terms and
resources before practice. README documents the file structure for further work in
Claude Code. Progress snapshots now belong in `progress/` and are committed.

**2026-09-22 — Recall added to the tracker: drill, self-rating, printable sheet.**
The tracker could record that a step was ticked and never that it could not be said
out loud, which is the exact state the charter is hunting. Every study item is
already a term and a said-out-loud definition, and every practice step is already a
prompt and a model answer, so those became a card deck with no new content written.
A drill view turns one card at a time, hides the back until you have said it, and
takes a three-way self-rating — said it clean, roughly with gaps, could not say it.
Cold cards come first on the next pass. Session and wildcard pages now carry a state
bar and, when anything is shaky or cold, a band naming it. A sheet view renders any
session, week or the whole wildcard as a dense two-column page that prints, so the
morning before an interview does not need a laptop. Ratings live in
`state.recall` under the same storage key and export with everything else.
No contradiction with `CHARTER.md`; this measures the honest floor rather than
changing it.

**2026-09-22 — Figure added for wildcard session one.**
The Oxus design-frame session was pure sequencing with no figure. `DIA.oxusFrame`
draws the thirty-five minutes to scale, which makes the point the prose only states:
twelve of the thirty-five go on one deep dive, and requirements come first because
they decide which one.

**2026-09-22 — Repo initialised. Twenty-one improvements, built in parallel.**
The README had assumed a git repository since the seventeenth and there was not
one, so `progress/` snapshots had nowhere to be committed to and no change had an
undo. Initialised, and pushed private.

`IMPROVEMENTS.md` records the twenty-one items and why each exists. Five of them
were rules in `PROTOCOL.md` with no mechanism in the code, which is the failure this
repo was built to detect and had quietly accumulated in itself: week state was
derived rather than declared, and derived wrongly — Red meant any one session rather
than the mathematics, so a week that touched only Alaap reported that the one track
Red exists to protect had been protected. The re-entry ramp could not fire because
nothing counted consecutive Reds. The requeue could not be answered or added to. The
streak did not exist. The ten-minute floor had no prompt.

Also: every answer ever written now has a page rather than being write-only; quiz
attempts are kept rather than overwritten, so decay between week one and week five
is recordable; the quiz explanations join the drill deck rather than vanishing on a
pass; time is measured rather than assumed from the plan; search covers everything
including your own writing.

Nine agents worked in parallel and none of them wrote to `index.html`. Each returned
a patch script against verified anchors, applied one at a time with a syntax check
and a browser pass between each. Seven anchors broke during integration and were
repaired by hand; two patches were dropped as superseded. The file went from 3,201
lines to roughly 5,000.

**2026-09-22 — The landing page gains a map of all the work ahead.**
`DIA.arc` drew milestone 1 as five boxes over five boxes and stopped there. It is
replaced by eighty-five topic nodes across four milestones with a hundred and
nineteen prerequisite edges, thirty-three of which cross a milestone boundary.
Hovering a node lights everything it needs and everything that needs it. Detail
decays with distance, so the further-out columns render faint and milestone 3 has
five nodes because `ROADMAP-AHEAD.md` names five things. This is a presentation of
the existing plan and not a change to it; nothing in `CHARTER.md` is contradicted.

**2026-09-24 — The tracker is called Accelerate, and opens on a flight plan.**
The icon was chosen from fifteen directions over two rounds, judged at the sizes an
icon actually lives at rather than only large. The winner is Craft: a delta-wing ship
climbing through deep space with two afterimages behind it. It is on the desktop
shortcut, now called Accelerate, and on the browser tab.

The landing page opens on the milestone drawn as an ascent, launch at week one and
orbit at the gate, with the ship at today's position. The obvious version of this
chart, a planned-hours line with the real line beneath it, was rejected because a
gap under a plan line is debt drawn on a screen, and `CHARTER.md` says missed hours
are never owed. So each week's segment is drawn by its declared state instead: heavy
for Green, lighter for Amber, thin but unbroken for Red. Only a week that ended empty
breaks the line. What the chart draws is the streak, which `PROTOCOL.md` names as the
thing being protected.

Two bugs fixed on the way, both of which the new page would have put front and
centre. The streak read zero every Monday, because the week in progress counted as a
break before it had had a chance to be anything. And the next session stayed pinned
to Oxus the day after the Oxus interview, because an unfinished session in a loop
that is already over still counted as next. Neither is a deviation from the charter;
both were the code disagreeing with it.

**2026-09-24 — The system design guide, woven in both directions.**
`SYSTEM DESIGN.html` is committed as written first, then changed only additively. In
the tracker, forty five study items and steps now point at the exact place in the
guide that deepens them, fifty eight pointers across twenty eight distinct targets,
each with one line on why, and each opening in a new tab so the session stays put.
The strongest pairings are the prior authorization design against the SOX control
agent, NotebookLM against evidence ingestion, and alfred_ against the past-work
session, since the guide already contains the system being asked about.

In the guide, each pattern now lists the sessions that practise it, written from the
same table as the tracker's pointers so the two directions cannot disagree. Four
patterns list nothing: real-time updates, contention, geo search and LLM cost are not
taught by any session yet. That is a finding rather than a gap in the linking, and
worth a thought at the milestone 2 re-plan. No actions were added and no session
minutes changed.

**2026-09-24 — The guide in three tabs, the map on its side, the rail grouped.**
The system design guide was too wordy to skim. It now has three tabs. Framework is
the landing page: the six-step diagram, one card per step, the classic-versus-agentic
table, and the signals and transition lines folded away. Patterns opens on a gallery
of fifteen diagrams; each pattern page shows its diagram, then every technique with a
small diagram of its own mechanism (ninety eight new), what it is, an example and its
trade-off, the designs that use it, and where Accelerate practises it. Designs lists
the six worked designs; a design page keeps a side list of its steps, and "Patterns
this design uses" is a grid of cards. The guide's text is unchanged. Old links still
work: `#/overview/...` and `#/<design>/...` redirect to the new routes, and the
tracker's pointers use the new routes directly.

In Accelerate, the map of the work ahead was two and a half screens wide and needed
sideways scrolling. Time now runs downward, one band per milestone, with the five
tracks as columns; it fits the page and sits just above the Day board. The side rail's
loose list of nine links is grouped into Practise, Look ahead, Reference, and Rules
and data. No plan content changed.

**2026-09-24 — The Alaap study guide gets its own page, folded into the weeks.**
`ALAAP.html` is new: the Alaap repo's study guide, sanity check, accent and rights
research, and architecture diagrams on one page, in the Alaap repo's own style rather
than Accelerate's. It is generated by `alaap/build.py` from the Alaap repo's
`learning/` folder, so when those documents change the page is rebuilt rather than
edited. The text is Alaap's; the page adds the tabs, a thirteen-week timeline, how the
guide maps onto Accelerate's milestones, and, on each part, the Accelerate session
that practises it.

In Accelerate, fifteen steps now carry an "In your Alaap study guide" pointer: the
three Alaap sessions (Part 0, Nyquist, source and filter), and the mathematics steps
that feed the guide directly, such as cosine similarity into speaker verification,
eigenvectors into the Vendi score, and negative log-likelihood and softmax into the
mixture density network. The Alaap nodes on the map link to their part, and the rail
and the landing page link to the guide. No session minutes or actions changed; the
charter's four-hour Alaap cap in milestone 1 stands.

The system design guide now loads its typefaces from `fonts/` rather than Google, and
has its own icon: the Accelerate craft with the colours inverted.

**2026-09-24 — One study plan for Alaap and TrenTorch.**
The Alaap page was the Alaap documents side by side, which meant choosing where to go
next each time. It is now one linear plan of twenty-two stages across the three
milestones. Each stage says what you can do afterwards and why it matters for Alaap,
then brings everything it needs into place: a diagram drawn for it, the TrenTorch
module to build (objectives, what it exports, the `tren` commands, its reflection
questions), the Alaap guide's own sections, the architecture diagrams that apply, the
TrenTorch historical milestone it unlocks, and one exit check with a short answer.
All twenty TrenTorch modules and every section of the Alaap guide are placed; the
build refuses to run if one is left out. The fourteen architecture diagrams now carry
what each involves, its topics, and the stages that teach it.

TrenTorch is read in place from `E:/TrenTorch` rather than copied here, so there is one
copy of it. The sequence is `alaap/plan.py`; `alaap/build.py` regenerates the page and
the plan's stage list and labels inside the tracker from it.

In Accelerate, milestone 2's map nodes (tensors, modules, autograd, the loop, batch
normalisation, embeddings, attention) and milestone 3's now open the stage that teaches
them, "What comes after" lists each milestone's stages, and six more mathematics steps
point at the stage that uses them. As sequenced, milestone 2 is about 40 hours of this
work against the roadmap's twenty for TrenTorch alone; the milestone 2 re-plan decides
what moves. Milestone 1 is unchanged, with Alaap still capped at four hours.

**2026-09-25 — Public, and on GitHub Pages.**
The repo is public and the three pages are published at
https://pranavmishra17.github.io/self-study/, republished on every push to `main`.
This was a deliberate choice, made knowing it exposes the alfred_ design, the interview
preparation and the personal plan along with the full history; the history was scanned
for secrets first and none were found. Progress stays in each browser, so the online copy
starts empty and carries progress across only through Export and Import. The tracker's
address banner says so when opened online.

**2026-09-25 — Interview loops get their own pages.**
Working through the ZenML sessions in the tracker was the wrong shape: small grey text,
content hidden behind Detail and Answer toggles, twenty-five controls on a page, and
about twenty-five memorisation questions per session, some of them fill-in-the-blank.
Every interview loop now gets its own page in `interviews/`. The ZenML round 3 page has
the brief, spoken scripts, timed speak-aloud drills, a technical question bank
(including LangChain, LangGraph and LangSmith, trace stores, and Supabase), Kitaru's
mechanisms with the teardown's diagrams, questions to ask, traps, and all eleven sessions
readable in place. Each session has one quiz, five to eight open questions shown one at
a time in a pop-up, answered by typing or with Win+H, then compared with a model answer
and self-rated. Ticks on the page are the tracker's own progress, shared because both
are served from the same address. Oxus has a minimal archive page. The tracker's wildcard
page leads with a card per loop, and the home page's button opens the loop's page. Full
mock interviews run in the Claude Code chat, by the protocol in `interviews/MOCKS.md`.
The whole-tracker overhaul waits on a choice between layout variants.

**2026-09-25 — Sessions become a workbench, one card at a time.**
Picked from the five layouts in `variants/sessions.html`: a mix of B (one step at a
time) and E (read, write, check). Every session in every week now shows one card at
a time: the figures, then each thing to know, then each step. Each card has Read
(the source and actions), Write (your answer, typed or dictated), and Check (the
model answer, then Had it, Partly or Missed it). A finish card runs the end quiz
as a popup, one open question at a time, five to eight per session. Arrows move
between cards; Shift and an arrow moves between sessions. Progress keys are
unchanged, so earlier ticks, answers and quiz results carry over. No change to the
plan or to `CHARTER.md`.

**2026-09-26 — Sessions as collapsible step lists, with reading and figures on every step.**
The one-card-at-a-time layout from the day before is replaced by what worked on the ZenML
page: every step collapses and opens to what it is, its figure, what to read with minutes,
the system design technique it uses and why, and the answer behind a toggle. Reading for
all 135 steps and study items in weeks 1 to 5 and the wildcard now lives in
`data/reading.js`: 147 outside links, 58 AI Engineering from Scratch lessons, 82 system
design techniques, every URL checked. Figures moved into `figures/figures.js`, one registry
shared with the interview pages, with nine new ones for the ZenML sessions; 29 figure
ideas are recorded for the figure pass. Reading time shows as optional on top of each
session's planned hours, not inside them, so the plan's totals are unchanged. No change to
`CHARTER.md`.

**2026-09-26 — Small pleasures, picked from a list.**
Chosen by Pranav from proposals: three open questions a day on the home page (replacing
the single spaced card), a figure to explain in a minute, the book (a compact page per
closed week, printable, `#/book`), the sky (sessions as stars, `#/sky`), a livery for the
craft per closed week, and a lift-off when a session closes. None adds planned work.

**2026-09-26 — One type system for a step; Prep questions teach before they script; dead code out.**
A step in the tracker now uses one face, three sizes and three greys: a quiet grid for
where, done-when and skip; one list style for reading, guide links and Alaap links; one
toggle for the answer. DDIA references follow the 2nd edition the plan uses (the research
agents had cited 1st-edition chapter numbers). On the ZenML page every technical question
opens to its point, its figure, what to read and the guide technique, with the spoken
answer behind the same toggle. About 620 lines of unused tracker code went: the old quiz
panel, closers, spaced card, answer boxes and their styles.

**2026-09-26 — Every diagram explorable.**
Asked for by Pranav: diagrams that open full screen, explain each part on hover and click,
and walk through the flow. One viewer (`figures/viewer.js`) now serves the tracker, the
interview pages, the system design guide and the Alaap page. Every node and edge of 205
diagrams has a note written for its context, with links to guide techniques, tracker
sessions, Alaap stages, TrenTorch source and AI Engineering from Scratch lessons. The 39
shared figures were redrawn with named parts and Lucide icons (fixing an unwired value
matrix in attention, an invisible validation curve, colliding ids), the five Kitaru teardown
figures were redrawn so they can be explored, and ten new figures were drawn from the ideas
recorded in the reading pass. Two errors in other pages were fixed (the Alaap autograd
formulas, an async flag in the guide); 113 smaller review points are in `figures/REVIEW.md`.

**2026-09-26 — What was learned about studying, written down; the ten-minute floor dropped.**
`PROTOCOL.md` gains **How you study best**: understand first and say it last, diagrams you
can take apart, reading with a stopping point, steps shut by default, one look, open
questions one at a time, honest ratings that bring misses back, a page and a real mock per
interview, small rewards without debt, and big changes chosen from options. Each is there
because something else was tried first and dropped. The ten-minute floor is removed from
the protocol and the tracker's protocol page: its timer went with the old session layout,
and a step's answer staying shut until you have tried now does the same job. Not in
`CHARTER.md`, so not a deviation. The README is rewritten for anyone who lands on the
repo: what it is, the method, and how to make it your own. `WILDCARD.md` describes loop
pages and the current session shape, `MILESTONE-1.md` records the three Oxus design
sessions now in weeks 2 to 4, `STUDY-LIST.md` is regenerated with each step's reading and
guide links, and of eight 1st-edition DDIA chapter references in the reading, five that
duplicated a 2nd-edition entry were removed and three were rewritten as 2nd-edition topics.

**2026-09-26 — Kitaru drawn from the teardown; alfred_ fresh for the ZenML round.**
Asked for by Pranav, choices picked from a list. Six new figures come from the teardown
sections that had only prose or tables: the SessionNode tree, how one tool call is
answered on replay, the one-hash join, last-turn-only multi-turn, what runs live whatever
you configure, and what breaks as each design grows. Each is drawn once in
`figures/figures.js` with notes on every part. They show on the ZenML page's Design tab and
on its Prep questions, and on the Kitaru deep dives in the system design guide, which can
now show any shared figure through a `fig` block. The ZenML page gains an alfred_ tab: the
system you own in seven parts (three doors and one tool package, one chat turn, the wrapper
stack, the pipeline that never sends, cost, the eval scanner, the one-Postgres ceiling),
each with its point, its figure and the words behind a toggle, then the numbers to have
ready and a comparison with Kitaru. Four alfred_ figures and one that maps alfred_'s
records onto Kitaru's are new. Content modules can now carry an `OWN` block for the next
loop. No change to the plan or to `CHARTER.md`.

**2026-09-26 — AI Engineering from Scratch links open the website, not GitHub.**
Asked for by Pranav: the GitHub folder view is hard to read and navigate. All 115 lesson
links (57 distinct lessons) in the reading, the figure notes and the study list now point
at the lesson's page on aiengineeringfromscratch.com. Every path was checked against the
site's own catalog, and three were opened. No change to the plan or to `CHARTER.md`.

**2026-09-26 — Every DDIA reference names the chapter, section and subsection.**
Asked for by Pranav, who could not find the idempotence reading in his copy. References
said "look it up in the index", and five step titles still carried 1st-edition chapter
numbers (chapter 6 for sharding, chapter 11 for idempotence). All 50 passages now read "DDIA 2e,
ch. N Title → Section → Subsection" in the tracker, the reading, `MILESTONE-1.md` and
`STUDY-LIST.md`. Chapter numbers are checked against Kleppmann's own 2e references
repository; section names against a chapter-by-chapter 2e reading. Page numbers are left
out: no source reachable here gives them for the 2nd edition. No change to the plan or to
`CHARTER.md`.

**2026-09-27 — The Mocks tab rebuilt; mock 1 judged exchange by exchange.**
Asked for by Pranav after the first ZenML mock: the critique was one block of text and
could not be read or revised from. The tab now opens with the read (how it went, a tally
of verdicts, what landed, what to fix first) and then the conversation as a read-along:
each exchange shows who asked, what you said and a verdict, and opens to what worked,
what did not, how to approach it, its figure, and the answer to give behind a toggle.
All four gaps and the missed answer have full answers, and six Prep questions were added
or corrected (the empty result, what counts as done, four items and three created, the
two judges, the miss that punishes improvement, the accept button); each exchange links
to its Prep question. `MOCKS.md` now gives Hamza and Alex distinct roles and lays out a
full-loop mock, including why this move and why leaving. No change to the plan or to
`CHARTER.md`.

**2026-09-27 — A mock's conversation opens in one screen.**
Asked for by Pranav: reading turn by turn down the page meant scrolling per turn. The
conversation now opens as a full-screen panel: the ten turns on the left with their
verdicts, and for the one picked, what was asked and how it landed on top, what you said
(in short, what worked, what did not) on the left, and what to say (the one point to land,
the answer, how to approach it, the figure) on the right, each scrolling on its own.
Arrows move between turns; Escape closes. The mock page keeps the read and a one-line list
of turns. No change to the plan or to `CHARTER.md`.

**2026-09-27 — The mock conversation reads light, with the answer on a dark typewriter sheet.**
Asked for by Pranav. The panel is always light whatever the page's theme, the header is a
small strip (who, the question, the verdict, what they were testing), and the turn list
fits all ten turns. What to say is the one dark area: the point to land, then the answer
in a typewriter face with the key phrases in amber. No change to the plan or to
`CHARTER.md`.

**2026-09-27 — The ZenML Prep tab rebuilt as a hub; the role, in depth.**
Asked for by Pranav: the tab was one long scroll, and the non-technical side of a product
engineer role was thin. It now opens with how to show up (ten points, several from mock
1), then the question banks as rows, each opening in the same one-screen panel as the
mocks: the nuance, figures and reading on the light side, the answer on the dark sheet,
with a mark for each question revised and a search across every bank. Drills, questions
to ask, traps and sources fold shut; the page is 2,700 px instead of 6,500. New: a bank
on the role itself (what product engineer means, the move into it, the public half that
Lennart and Michael both raised, the first post, the first month, their values), built on
the job post and ZenML's own pages, every link checked; eight design questions and five on
product work at Kitaru, folding in the mind map from the ZenML sessions (the four design
steps, final state over path, pass^k, leases and process trees, the isolation ladder,
durable execution against replay, fakes against record-replay, traces as a tree); deeper
answers on side effects, SQLite and providers; and mock 1's answers on scoring and misses.
No change to the plan or to `CHARTER.md`.

**2026-09-27 — The one-screen panel on warm paper.**
Asked for by Pranav: pure white was hard on the eyes, and the dark sheet ran to the
panel's edge like a box with a stretched header. The panel and its list are now a warm
off-white, and the dark sheet is a rounded card set inside the panel with even margins.
No change to the plan or to `CHARTER.md`.

**2026-09-27 — Questions to ask, as three Cs.**
Asked for by Pranav. The flat list of eight questions is now three kinds, built from
interview advice with every link checked: clarifying, asked during the interview and tied
to the decision each changes (six, including 'who is the user of this screen', the
question the mock's design gap needed); contributing, at the end, about their problems
and what success looks like (six); and collaborating, how the team decides, reviews and
ships (five). Each kind has when, why and how; each question has who to ask, how to loop
it in, and what it shows. No change to the plan or to `CHARTER.md`.

**2026-09-27 — The role bank as six themes, in Pranav's voice.**
Asked for by Pranav, with his own answer to the first theme. The eleven separate role
questions are merged into six themes: why product engineering and why Kitaru, the public
half, Kitaru explained, how you'd work here, working with people, and why leave and where
next. Each theme lists what they may probe, gives one answer, and adds lines to swap in
when they push. Theme 1 is Pranav's text verbatim; the others follow its voice and use
only facts already in the prep. The panel shows probes on the light side and the swap-in
lines on the dark sheet under the answer. No change to the plan or to `CHARTER.md`.

**2026-09-27 — Prep reordered and merged; the story in Pranav's own words.**
Asked for by Pranav, with four answers in his own words. The story bank is now ten items
in one shape (the question, what they may probe, one answer, lines to swap in): his career,
why this role and ZenML, why leave alfred_, and his days at alfred_ (all four verbatim),
why he left WheelPrice and what he did there (written in his voice from his WheelPrice
notes), the bench in two minutes, what he found reading Kitaru's source (he did not run
it, and the earlier claim that he imported traces into it is removed), the comparison and
the close. The banks now run: story, the role, product engineering on Kitaru, tools and
the landscape (grounded in what he has built with: TypeScript and Deno, FastAPI and
Pydantic, a Postgres queue, his own agent loop, model choice and cost), his work at depth
(merged into stories he can remember in parts), designing replay and evals, a new bank on
Kitaru's own details to drop in unasked, and backend depth. Similar questions were merged
before new ones were added, so the count held at 57 while the overlaps went. No change to the plan or to
`CHARTER.md`.

**2026-09-27 — Two big design questions, each with its own board.**
Asked for by Pranav, at the end of Backend depth. First: your eval harness, why it has
this shape, what you would keep and change if you rebuilt it, what breaks at ten and a
hundred times in the order it breaks (authoring first, then drift, redaction, one runner,
repeat cost, multi-turn), how you would scale it (an immutable base world with a
copy-on-write fork per run, automated world building from the scanner, a leased queue that
runs only affected cases) and how you would productionize it for other teams. Second: if
Kitaru moved toward your design, with stateful worlds, fakes and multi-turn runs: the
requirements, new entities, infrastructure changes (a resolver chain in the adapter,
a world store, fakes in the SDK, the turn loop in the worker), trade-offs, four deep dives
and what to build first. Both draw on the replay-design and multi-turn sessions, the
teardown's scaling section and the mind map; each is a numbered board on the light side
and a five-beat story on the dark sheet. No change to the plan or to `CHARTER.md`.

**2026-09-27 — The current job post folded in; two stories in Pranav's words; a Python bank.**
Asked for by Pranav, with the newer job post and two stories of his own. The newer post
puts building in public on X and GitHub at the centre, a different hat each week, customer
demos, and four success points at six months, and describes Kitaru as turning agent
traces into reliable evals. The role bank now answers the X question honestly (he reads it
more than he posts there, with a plan for week one) and gains five themes: the week's
hat, a live customer demo, six months, keeping up with the field and who the users are,
and open source. His two bench stories go in verbatim: how the harness replaces
third-party APIs with SQLite (with a board on the contract, the data model, one read, one
write, determinism and what it leaves out) and whether the harness supports multi-turn
(with a board on the options, the goal-oriented simulator and calibration). Two new
figures draw the provider interface with its two implementations, and a small relational
model of the user's world. A new Python bank covers decorators, asyncio, Pydantic,
Protocols, context managers, packaging, pytest, SQLAlchemy and an honest comparison with
his TypeScript. Loop pages now load shared figure files with a content hash, so a changed
figure is never served stale. No change to the plan or to `CHARTER.md`.

**2026-09-27 — The Python bank with worked examples from his own projects; no empty columns.**
Asked for by Pranav. The Python bank now opens with three questions answered at the depth
of years of work: his experience (UIC services, WheelPrice's FastAPI backend, MockFlow-AI's
real-time voice workers, SnakeAI's Python-to-C++ bridge, and Alaap as the example of how he
writes Python now), why he likes Python and where he wouldn't use it, and how he would
build his eval harness in Python and what would change. Every technical question now has a
worked example in code: checkpointing Alaap's renders, MockFlow-AI's fallback timer and a
concurrent cohort replay, Kitaru's policies and Alaap's direction as Pydantic models,
Alaap's two engines behind one Protocol, a context manager for a 6 GB GPU, invariant tests,
and SQLAlchemy over Kitaru-style sessions. Five questions that showed an empty
'Understand it' column now have probes, notes and figures, and the board widens when it
holds code. No change to the plan or to `CHARTER.md`.

**2026-09-28 — alfred_ from the outside: a draw-it-cold drill, checked against the code.**
After the ZenML call, where Pranav couldn't draw alfred_ top-down or say cleanly where the
agent runs. Two readers checked the architecture against the alfred_ code on origin/main:
the agent turn runs in Supabase edge functions in Deno (conv-v6 ingress, job worker, turn;
conv-v6-web; mcp-exec), long work in Railway containers (documents, routines, the phone
agent, EmailEngine), state in one Postgres with pgmq and pg_cron; the agent loop is a
LangGraph graph of 12 steps on SMS and 50 on web; memory is three kinds (the conversation,
facts in the cached per-user block, working memory fetched by a lookup tool). A new
wildcard session, first in the list and for every interview, drills it as six exercises,
each drawn cold with the answer hidden. Two new figures (where everything runs; memory
across conversations) sit in the guide's alfred_ design and on the ZenML alfred_ tab; the
chat-turn figure and the guide's stale 'runAgent, max 12 steps' and 'one Supabase project'
are corrected. The home page no longer fails on a wildcard session without a date, and
`figures/stamp.py` stamps content hashes on the tracker's and guide's figure links so a new
figure is never served stale. No change to the plan or to `CHARTER.md`.

**2026-09-28 — Mphasis loop page, and an algorithms page.**
An Mphasis technical round came in with two hours' notice: agentic skills, AI
fundamentals, a possible short coding exercise. A new loop page, `interviews/mphasis.html`,
holds a two-hour plan and how to show up on a recorded video call, Mphasis's generative AI
work (NeoZeta's relearning of legacy code into a knowledge graph, checked on their site),
AI fundamentals, agentic AI tied to alfred_, RAG and GraphRAG with runnable code, and quick
Python. A new page, `CODING.html`, covers thirteen algorithm patterns with templates and 34
classic problems; every solution, and every code block on the Mphasis page, was run against
test cases. The tracker links both: the Mphasis card in the wildcard, and 'Algorithms and
coding' under Reference. `interviews/build.py` accepts a loop with no tracker sessions. No
change to the plan or to `CHARTER.md`.

**2026-09-28 — Ask first, always; code on cream.**
`CLAUDE.md` now says it outright: clarifying questions come before anything sizeable or
ambiguous (new pages, rewrites, design changes, anything with two readings), in the same
numbered, lettered, recommended-default format; clear small fixes go ahead. On
`CODING.html`, code sits on cream in light and dark mode alike and is coloured by a small
in-page Python highlighter (keywords, strings, comments, numbers, function names,
builtins); the harder solutions carry short comments on the line that holds the trick
(prefix counts, monotonic stack, stale heap entries, DP state, backtracking undo). All 34
solutions still pass their tests. No change to the plan or to `CHARTER.md`.

**2026-09-28 — alfred_: the three answers at the very top.**
The guide's alfred_ design opens with a 'Start here' board before step 1: where the agent
runs, one SMS end to end, and the three kinds of memory, with the deployment and memory
figures beside them (moved up from the high-level design and the entities step, so each
appears once). The tracker's draw-it-cold drill links there first. The ZenML page is not
where this will be looked for again, so it lives in the guide. No change to the plan or to
`CHARTER.md`.

**2026-09-28 — Mphasis answers written for Mphasis; a one-screen coding cheat sheet.**
The Mphasis story bank was your ZenML intro with one new line. It now has six answers,
each written for this round: the intro (your words, plus MetaRAG's production
code-translation use case, the closest thing you have to Mphasis's work), why Mphasis
(NeoZeta parses before the model; the same order alfred_ uses), why this role (what's
enough, evaluated and auditable; classic ML as a swap line), why leave alfred_ (your
words, with range across clients in place of Kitaru), why now, and your day at alfred_
unchanged. Each note says what changed from your version. `CODING.html` gains a cheat
sheet, one landscape screen of twenty cards (how to code out loud, the input size and
the target cost, every pattern with its signal, move, core code and nuance, Python tools,
edge cases, Python traps, AI-flavoured coding), opened from the top bar or
`CODING.html#cheat`, which the tracker's Reference links. No change to the plan or to
`CHARTER.md`.

**2026-09-28 — CODING.html: examples everywhere, variations, tabs, a side-by-side view.**
You asked for small examples so the code says what it solves, variations of each classic
problem, and a better structure as the page grew. Every pattern and every problem now
carries a worked example (input, output, one line on why). Each pattern gains three or
four variations, 51 in all: the same idea asked differently, each with its example, what
changes, and code tested against cases. Graphs split into BFS and DFS, and order and
weights (topological sort, Dijkstra, union-find), making fifteen patterns. The page is
now tabs (Start, Core, Structures, Techniques), each pattern a folded section, search
across every tab. The cheat sheet is drawn from the same data, six columns with an
example on each card, still one 1920x1080 screen; clicking a card, or 'See it side by
side' on the page, opens a landscape popup with the nuances and the list of problems on
the left and the chosen one's code on the right. No change to the plan or to `CHARTER.md`.

**2026-09-28 — Cheat sheet: the algorithms, and a fit to any screen.**
The sheet had patterns but not the algorithms themselves. It now has cards for BFS, DFS,
topological sort, Dijkstra, union-find, Kadane's and sorting and selection, each with a
tested snippet; each opens its popup at the matching problem (Kadane's is a new DP
variation). 'Say it out loud' and 'The input tells you the target' left the sheet (both
stay on the Start tab), and the two graph pattern cards gave way to the algorithm cards
that cover them. At 125% display scaling the screen was smaller than the sheet was built
for, so it spilled sideways: it now fills columns top to bottom and picks the largest
text that fits in six to eight columns, and each clickable card keeps its sharpest
nuance, with the rest in its popup. No change to the plan or to `CHARTER.md`.

**2026-09-28 — CODING.html: full statements, an AI systems tab, and a cheat sheet of its own.**
You asked for longer questions, coding beyond LeetCode, and a cheat sheet that works on a
phone. Every classic problem and variation (86) now reads as a full interview question in
our own words: the problem, two worked examples with why, and constraints, each example
checked by running the solution. A new AI systems tab holds fourteen topics: NumPy, PyTorch,
embeddings and vector search, RAG over a parser's output, GraphRAG, an agent loop, a web
research agent, a voice pipeline, a transformer block, BPE, evals, structured output,
serving, and LoRA. Each is its design in components, a figure, a skeleton per component,
the whole thing end to end, what to remember, what they ask, and two or three variations;
all the code runs offline with small fakes and is tested. Thirteen new shared figures draw
them (`numpyShapes` to `lora`). The page's data moved to `coding/data.js`, with the sheet
and popup in `coding/sheet.js`, so `CHEATSHEET.html`, the sheet as its own page, shares
everything with `CODING.html`. The sheet has an Algorithms and an AI systems tab; on a
wide screen it fits one screen, and on a phone it scrolls, upright as one column and on its
side as two, with the popup full screen (a Notes and Code switch upright, side by side on
its side). `python coding/test_data.py` runs all 210 code blocks and re-checks the
examples. The tracker's Reference links the standalone sheet. No change to the plan or to
`CHARTER.md`.

**2026-09-28 — The cheat sheet is one file you can send.**
`CHEATSHEET.html` is now built by `coding/build_sheet.py` with everything inlined: the
data, the sheet code and styles, the figures and the fonts. It makes no network requests,
works offline on a desktop and on a phone, and its 'Full page' and 'Open on the page'
links go to the published site. Run the build after any change in `coding/` or `figures/`.
No change to the plan or to `CHARTER.md`.

**2026-09-28 — Cheat sheet on a phone on its side: one screen, tiles, notes and code together.**
Scrolling the sheet sideways on a phone was worse than the one-screen sheet. On a phone on
its side every card is now a tile (its title and example), all on one screen with no
scrolling; a tap opens the popup with the notes on the left and the code on the right,
code first and in smaller type, with no Notes / Code switch. The reference cards (Python
tools, edge cases, traps) open too. Upright is unchanged. No change to the plan or to
`CHARTER.md`.

**2026-09-29 — Revamp, phase 1: the launch bar and a lean home page.**
Following `REVAMP.md`. The tracker's header gains a launch bar: one button per reference
(system design guide, coding, cheat sheet, Alaap and TrenTorch, the current interview
loop), each opening in a new tab. The flight plan chart is gone; the week's status stays
as one line under the next session. The home page keeps the next session, this week, the
open wildcard items and three for today. The five weeks, the figures, the craft, the day
board and every session moved to Progress (`#/progress`); Explain a figure has its own
route (`#/figure`). No change to the plan or to `CHARTER.md`.

**2026-09-29 — Revamp, phase 6: one home per thing, dead content out, docs current.**
Following `REVAMP.md` and the phase 6 audit. Wildcard sessions now open by id
(`#/w/wc8`, and `#/s/w2a` for planned ones) as well as by position, and every hand-written
link uses the id: putting `wc18` first on 28 September had sent twelve links in the guide
and the figure notes one session off. alfred_'s facts were checked against its code on
`origin/main` and fixed everywhere they were told: the agent loop is a LangGraph graph with
alfred_'s own tools node, 12 steps on SMS and 50 on the web; there is no risk score (a code
floor confirms sends and irreversible deletes); the rules matcher cut cost about 30 percent,
not 40; triage runs on Gemini 3.1 Flash Lite with a dial for an OpenAI cohort; EmailEngine
runs on Railway. `ALFRED.html` is now the one home for your own system: the ZenML page's
alfred_ tab keeps only the comparison with Kitaru, and the Mphasis page links to it. This
supersedes the 28 September note that the alfred_ design "lives in the guide": the guide
keeps the design walk and links across. The Mphasis page's copies of your intro and "why
leave" are marked verbatim again, with "Alfred" restored. Kitaru's default tool policy is
passthrough everywhere (wc8 said otherwise), and Kitaru is record-replay, not stubs. The
Mphasis page's code that `CODING.html` already holds became links; GraphRAG's local and
global search moved to `CODING.html`. A guide link said twice on a step now shows once.
`brand/concepts/`, `variants/` and `icon.png` were removed (nothing used them; history
keeps them); `handoffs/` moved to `archive/`. `CLAUDE.md` gains three rules: one home per
thing, one screen in every orientation, and a pass ends with the live check. No change to
the plan or to `CHARTER.md`.

**2026-09-29 — Revamp finished: a home that motivates, an interviews hub, badges everywhere.**
After Pranav's review of phase 1: the tracker's home returns to the five weeks in a row with
the wildcard, and opens on where you are and the next session, with three numbers that move
every time you work (hours in, wildcard included; sessions closed; this week against the
floor). A badge per reference (System design, Coding, Cheat sheet, Alaap, alfred_,
Interviews) sits beside Start this session; every other page carries the same badges in its
header, from one file, `site/nav.js`. The map is back on the home, below three for today.
The wildcard column shows only what is open and the hours left, with a button to the new
hub, `INTERVIEWS.html`: a card per loop with its date, total hours, how much is done, and its
job post and company links. Mphasis has happened and shows so. `STUDY-LIST.md` is removed
(the sheet view is its source). The gate's requeue bar is the six named maths items; the
other six clear with their sessions. No change to `CHARTER.md`; the gate's bar is now stated
rather than changed.

**2026-09-29 — Design standard: no more AI slop.**
Pranav called the pages AI slop: text too large on his 1920x1080 at 125%, five or six fonts in
one board, the Alaap plan and alfred_ page generated-looking, the alfred_ page one long scroll.
A survey found 24 and 25 font sizes on the guide and Alaap, a handwriting face, and hundreds of
em dashes. After reading what the tells of generated UI are, the rules went into `DESIGN.md`
and the values into `site/tokens.css`: two families, six sizes (body 15), one accent, warm
neutrals, a muted colour per company, no em dashes in written copy (his verbatim answers
exempt), no eyebrow labels, no boxes in boxes, navigation on every long page. Every page now
loads the tokens and was redone against them: the guide (no Kalam, definition rows as a clean
table, boards fold by whole parts before trimming lists, the "+0 more" bug fixed), coding (a
problem's parts in labelled rows with clear dividers), the interviews hub (a grid, a colour
per company), the loop pages, Alaap (a stage index with one stage at a time; the plan's prose
rewritten; quoted em dashes and hype lines cleaned at build time), alfred_ (a reader with tabs
and one item at a time) and the shared badges and figure viewer. `CLAUDE.md` now requires
`DESIGN.md`. No change to the plan or to `CHARTER.md`.

**2026-09-29 — Alaap tracks itself; interview cards in brand colours; Vanguard.**
The Alaap page keeps its own progress (`alaap.progress.v1`): mark a stage done, see stages and
hours done, and continue from the last stage visited. The interview cards lost their coloured
stripe and dot: every card is one plain surface and only the company name carries the
company's colour, taken from its own logo or site (Mphasis magenta, ZenML green, Oxus navy,
Vanguard red), with a lighter value for dark mode. A new loop, Vanguard, technical, has a
skeleton page (`interviews/vanguard.py`) ready for its details and leads the tracker's loops.
No change to the plan or to `CHARTER.md`.

**2026-09-29 — A public toolkit on Pages; personal pages stay local.**
GitHub Pages is now built by a workflow (`.github/workflows/pages.yml`, `tools/build_public.py`)
from an allowlist: a landing page explaining the toolkit, the system design guide, the coding
page and its cheat sheet, and a new deep learning path built from the Alaap plan
(`DEEP-LEARNING.html`: foundations, PyTorch from scratch, audio ML). Visitors mark their own
progress in their browser. The build fails if anything personal or unpublished leaks. The
local app is unchanged. Material about one employer now lives in a gitignored `private/`
folder that local pages load when present. The interview cards carry each company's name as a
full-width wordmark, open the loop page in a new tab, and flip to the brand colour on hover.
No change to the plan or to `CHARTER.md`.

**2026-09-29 — Coframe, recruiter screen (Thu 1 Oct).**
A new loop page, `interviews/coframe.py`: the company and the Agent Platform Engineer posting
researched with checked links, how to run fifteen minutes with a founding talent lead, the
intro (his verbatim paragraphs, a Coframe closing line), why Coframe, why leave, one story told
for a non-technical listener, the common questions, and questions to ask in three groups. Pay,
location and work authorization are handled in chat only; the repo is public. The hub now
lists the next call first, then undated loops, then past ones. Loop-page headings are generic.
No change to the plan or to `CHARTER.md`.

**2026-09-29 — The README is the public toolkit; a name slot and a star.**
The README now describes only what the public site holds, with the Accelerate icon and
screenshots of the live pages (`tools/screenshots.py`, headless Edge). The landing page's title
reads "anon Accelerate": the name is drawn in the background colour and a soft band of light
reveals it every few seconds; a visitor can click it and put in their own name, kept in their
browser. A "Star on GitHub" link shows the repository's star count; the repository name lives in
one constant in `tools/build_public.py`. `CLAUDE.md` is now local only (gitignored).

**2026-09-29 — Two new loops: Raydar and River.**
Raydar, a 15-minute screen with an AI interviewer for a Founding Forward Deployed Engineer role
(30 September), and River, a founder call with Tarek Abillama for a founding engineer role (date
to be set). Each is an `interviews/<module>.py` with its sources checked the same day, a `LOOPS`
entry and a card on the hub. Logistics answers stay in chat. No charter deviation.

**2026-09-30 — Parked: inference engineering, with the backend and cloud under it.**
Added to `ROADMAP-AHEAD.md` "Beyond", after the deep learning and PyTorch track: host,
batch, quantize and measure a small open model (a voice one by preference), with the
backend fundamentals it runs on learned in depth alongside. A six-phase sketch, about twenty
weeks part-time; placement decided at the re-plan after Milestone 3. Raydar's page gained the
stack item by item, the resume lines to call out, and how AI interviewers grade.
No charter deviation: parked, not scheduled.

**2026-09-30 — A new loop: Commure, Software Engineer, Voice Agents.**
A recruiter screen, date to be set. `interviews/commure.py` with Commure's own pages and the
posting as sources, checked the same day; numbers from the resume he applied with. A `LOOPS`
entry and a hub card. No charter deviation.

**2026-09-30 — A seventh worked design: a voice agent for patient calls; the voice story leads.**
The guide gains `voice-agent`: six steps, a high-level design, and `DIA.voiceParallel`, a timeline
of escalate-then-wait against starting the fast and heavy agents together on every turn. Sizing
anchors on a deployment Commure reports (200K calls a year), shown as assumptions. The Commure and
River pages now lead with his own voice agent (live, phone and web, the parallel front and back
agents), then MockFlow-AI; UIC is a healthcare swap. Sizing for his own system is written as
"sized for", never as traffic. README counts seven designs. No charter deviation.

**2026-09-30 — Commure prep rebuilt: understand, then design, then say.**
Six wildcard sessions, wc19 to wc24, Thursday to Sunday before the Commure screen on 5 October:
how a call reaches an agent (SIP, RTP, WebRTC, the SFU, dispatch), the conversation loop,
the backend under a live agent (edge functions and workers, push and pull, idempotency,
timeouts, scaling), Python async with a small orchestrator to build, his own voice agent drawn
cold, and the guide's patient-call design timed, then the pitch. Each step teaches first, with
checked reading in `data/reading.js`. Four shared figures: `callPath`, `turnTaking`, `eventLoop`,
`idempotencyKey`. The Commure page opens with the order of work and an "Understand first" bank;
its answers link to the sessions behind them. Why: the page had become answers to say without
the understanding under them. No charter deviation: interview-driven wildcard sessions.

**2026-09-30 — Weeks become a sequence; no week states, no declaring.**
Decided with Pranav after ten days of interviews and work left week 1 untouched. A week is its
content, not its dates: weeks are done in order, none skipped, and a week finishes when its
sessions close, showing the day it finished and how far after its planned dates. The tracker
shows plain progress instead of Green, Amber or Red, projects the gate from the real pace (a
week for every week still to do, never earlier than planned), and keeps one streak: weeks
running with a maths session closed. The declare panel, the Red-week ramp and their code are
gone. Undated wildcard sessions now wait behind the plan; Commure's six sessions are groundwork
for the round after Monday's fifteen-minute screen. `PROTOCOL.md` "Week states" and "No
back-filling" are rewritten as "Weeks are a sequence".
**Charter deviation.** Commitment 3's Red weeks and commitment 4, "no back-filling", are
replaced: missed weeks are now done late, in order, rather than dropped. Reason: he will not
skip material, and declaring states never happened in practice. The guard against debt is now
the projected gate, which moves instead of compressing the work.

**2026-09-30 — Baseline: a map of fifteen fields.**
`BASELINE.html`, decided in a grilling session with Pranav: a public reference, not a track,
nothing to mark. Fifteen fields (overview; systems, distributed systems, data; backend, frontend,
mobile, cloud, DevOps and security; ML, AI engineering, inference, audio and speech; graphics,
game development), 266 topics. Each field opens to an overview, a map of how its parts connect,
a Start here list, and topics shut to a line, each a short explainer: what it is, where you meet
it in industry, the nuance, and checked reading. Its own look by request, the one exception
recorded in `DESIGN.md`: Source Serif 4 and JetBrains Mono, a paper palette, an ink per field.
Data in `baseline/fields/*.js`, drawn by `baseline/atlas.js`, checked by `baseline/check.js`
(shape, counts, banned words, links, map geometry), which `tools/rebuild.py` now runs. On the
public site with a landing card, in every page's badges, and linked from the live loop pages as
"Refresh the basics". Sources from Pranav's links: Kiely's Inference Engineering and its
companion, 100 days of inference, Learn to Cloud, the Sarvam AI interview write-up as the bar,
Paul Graham's How to Do Great Work. No charter deviation: a reference beside the plan.

**2026-10-01 — Baseline: two panes, one topic at a time, and a reshaped topic.**
Pranav found each field one long scroll. The page is now two panes: the rail holds a field
picker, search and the field's outline; the reader shows one thing at a time, the field's About
(overview, map, Start here and a contents grid, all up front as he asked) or one topic, with
Previous and Next and the arrow keys. Every one of the 266 topics was reshaped into five short
parts: what it is (40 to 150 words), where it is used (2 to 4 named bullets), an example (a
worked scenario or number), the catch, and reading; `baseline/check.js` enforces the shape. On
the overview, hovering a field previews its own map in a fixed pane beside the overview map,
and a click keeps it there; nothing on the page moves. No charter deviation.

**2026-10-01 — The tracker, re-polished: a rail and one page at a time.**
Pranav found the home hard to move around. Measured at 1536x864 it was three screens with fifteen
font sizes; a session put its steps two screens down; Progress was 2,600px with the book, sky and
liveries mixed into the numbers. Now: a rail that is only the plan (Overview, the five weeks and
their sessions, Wildcard, Practice, Reference), one page at a time with a breadcrumb and previous
and next, a drawer on phones. The overview fits one screen before the map: the next session, the
milestone bar and projected gate, week and wildcard cards with a coloured dot per session, four
numbers, and the site's pages as a grid. Weeks open to what they cover and a card per session;
sessions open to their steps first. It follows the system theme, uses the six token sizes, and
colours each track consistently as a small mark. The book, sky and liveries left the navigation
(routes kept, lift-off kept). Raydar moved to the past loops. No mechanics changed; no charter
deviation.

**2026-10-01 — The tracker opens light, with a switch; your answers get a box.**
Pranav preferred the light look and the earlier faces: the tracker opens light (dark from a switch
in the bar, remembered in this browser) and uses Bahnschrift for headings, Helvetica Neue for the
page and Atkinson for steps again; recorded in `DESIGN.md`. Every step with a model answer, or that
asks you to say, explain or record something, now has an optional "Your answer" box (type or
dictate with Win+H), saved as you go into the tracker's own `answers`, so the loop pages and the
tracker show the same text and Written work lists it. "What you would say" is an inverse sheet on
both the tracker and the loop pages, its points numbered with the lead phrase in bold. No charter
deviation.

**2026-10-01 — Baseline's know-now topics glow; week 1 links to them.**
41 of Baseline's 266 topics, picked from Pranav's resume and current work (agents and evals,
voice agents, Postgres-backed backends) and the interviews it leads to, glow in their field's ink
in every outline, contents list, search result and map (`baseline/core.js`). Week 1's twelve
reading links were all checked and load; eight of its steps now also link to the Baseline topic
that explains the same idea in a minute (`data/reading.js`). No charter deviation.

**2026-10-01 — The page grid moves top right; the cheat sheet's titles grow.**
On the tracker's overview the site's pages are a slim 3 by 2 grid at the top right beside the
next session, with visible borders and accent icons. The cheat sheet leaves the shared page list
(`site/nav.js`): it lives inside Coding, which links to it. Its cards' titles are about a quarter
larger than their text, and the sheet still fits one screen. No charter deviation.

**2026-10-01 — Judge first with multiple choice; weekly spaced reviews.**
From a learning-science summary Pranav shared (retrieval and spacing rated highest; interleaving,
why-questions and self-explanation next; rereading lowest) and his choices. Every step of Milestone
1 now has 3 to 5 multiple-choice questions (0 to 2 for pure actions): 317 questions over 80 steps,
in `data/mcq/week1.js` to `week5.js`, checked by `data/mcq/check.js`. Each has five options, plus
"I don't know" and a guess flag, so a right guess counts as Partly, never Know. Steps and whole
sessions can be judged first, never forced; each step shows Know, Partly or Not yet. Finished weeks
come back as an interleaved review on a widening gap: week N in weeks N+1, N+3, N+7, N+11, then
every four, with confusable questions placed together. The open end-of-session quiz stays.
`PROTOCOL.md`'s "no multiple choice" line changes by his decision; `IMPROVEMENTS.md` 15 and 16
noted. Also fixed: two week-3 closing answers had the sample-rate error backwards (24 kHz read as
16 kHz gives two-thirds, not 1.5 times; 22.05 kHz read as 44.1 kHz gives double, not half), found
by the question writer. **Charter deviation:** none to the charter; a protocol rule changed, recorded.

**2026-10-01 — Judging resumes where you stopped, and moves freely.**
Pranav stopped a session judgement after about ten questions and found it gone. The answers had
been saved, but reopening started a new run at question 1 with empty dots, so it read as lost, and
a step answered part way already showed a level. Now a run keeps its question order; Stop keeps it
open, and the session or step button reads "Continue judging (10 of 21)" (with Start over), opening
at the first unanswered question. Inside a run: Previous, Next, Skip, click any dot to jump, the
arrow keys, and See the result at any time; answered questions show their answer and why when
revisited. A step gets a level only once all its questions are answered; until then it shows how
many are. Runs saved before the fix are recovered from their scope. No charter deviation.

**2026-10-01 — A session's steps are a table; the answer box has its question.**
Pranav found a "Your answer" box with no question above it, and the open step hard to read: no
visible order of work, the model answer the loudest thing on it, boxes in boxes, the level a
small mark beside the minutes. A critique named four directions; he saw them side by side on his
real week 1 session and picked the session table. Steps now run down a table with Judge, Read,
Say, Rate and Done across, each a dot, a level or a rating, so a session's state reads at a glance.
One row is open at a time (the first step not done, until you pick another) as a drawer: the
material on the left; on the right the judge line, the answer box headed by the step's done-when
as its question, then What you would say and the rating. Open all and Close all are gone. Saved
progress is untouched. No charter deviation.

**2026-10-01 — Loop pages: an Overview that briefs, a Prep that is the question bank, and Rounds.**
After the Coframe screen, Pranav found the loop pages upside down: Prep was the biggest page, the
question banks opened in a pop-up that showed what to say but hid the detail, and the Overview did
not say what the company or the role is. Now the Overview is the call, the company, the role from
its posting (what you would do, what they look for, a link to the full posting), how to show up and
how to prepare. Prep is one question bank in sections: your intro and story, each bank, logistics,
practising aloud, and the questions to ask; a question opens in place, one at a time, with what
they test, the probes, the nuances and reading on the left and what to say on the dark sheet. Traps
and the sources list are gone from the page. A new Rounds tab records what a round asked: Coframe
round 1 with Neesha Malik (six questions, what he said, what to keep for the team rounds). Coframe
and Commure carry their company and posting; the other loops have happened and keep the new layout
without them. No charter deviation.

**2026-10-01 — Opening a step or question keeps your place; Prep sections are coloured cards.**
Opening a row closed the one above it, and the page jumped, so Pranav lost his place mid-read.
Now the tracker's session table and every loop page glide to whatever was just opened, its title
just under the header (instant when reduced motion is asked for). On the loop pages, each Prep
section (intro and story, each bank, logistics, practising aloud, questions to ask) and each round
is a card in its own track colour, with a count, so the sections no longer run into one another.
No charter deviation.

**2026-10-01 — 3 Dots IT: a conversational AI and NLP client interview, Friday 2 October.**
A new loop: a 30-minute client interview arranged by 3 Dots IT, a staffing vendor (end client and
platform not yet named), on two areas: building and improving enterprise virtual assistants
(conversation design, intent and entity modelling, error analysis, production improvements) and
deep NLP and LLM theory (text classification, embeddings, LLM fundamentals, the Transformer,
lightly). Pranav asked for it built strongly, with industry practice and the theory he has not
revised this year. Built from four research passes: a loop page (interviews/threedots.html, 64
questions in seven groups); six teach-first wildcard sessions, wc25 to wc30, about 55 minutes each
for his 5 to 6 hours; a new Baseline field, NLP and conversational AI (18 topics, the sixteenth
field); and a guide design, Enterprise virtual assistant. Each links the others instead of copying.
Charter deviation: none; a wildcard loop, its sessions count toward wildcard credit as usual.

**2026-10-01 — The 3 Dots IT sessions get figures, points and links; loop page sessions in two panes.**
Pranav found the six new sessions to be walls of paragraphs with no diagrams, the loop page's
Sessions tab still one column with an answer box that had no question, the Prep tab's cards
template-looking, Baseline's type too large, and the NLP map unlinked. Now: twelve new shared
figures (the NLP map, the representation ladder, the classification ladder, contrastive learning,
ANN indexes, the LLM lifecycle, a virtual assistant turn, confidence bands, the repair ladder, an
intent taxonomy, a confusion matrix, the error-analysis loop), each step's text cut to a short
lead plus key points, and 143 links from steps to the Baseline map and topics, the guide design
and the Prep questions they prepare for (and every Prep question back to its step). Loop page
session steps open one at a time in two panes like the tracker, the answer box asks the step's
question, Prep sections are a coloured spine with plain rows, and Baseline's sizes are back on
the shared scale (body 15, title 24). No charter deviation.

**2026-10-01 — Baseline's main map: NLP on it, more connections, and on the tracker's home.**
The field map now has fifteen fields with NLP and conversational AI between ML and AI
engineering, laid out as foundations, then what is built and learned on them, then the model and
real-time fields, and nineteen labelled arrows instead of nine. Hovering or focusing a field (on
any Baseline map) lights it, its neighbours and the arrows between them and dims the rest; on the
overview the lit arrows are spelled out under the map, since their labels would cover boxes. The
map code moved from baseline/atlas.js into baseline/map.js and map.css, so the tracker's home page
draws the same interactive map, with the hover preview, below The work ahead; its links open
Baseline. Pranav asked for all three. No charter deviation.

**2026-10-01 — Coframe round 2 booked in; the working notes brought up to date for a new agent.**
Neesha put Pranav forward: round 2 is a technical exercise with Pavlo Razumovskyi, Coframe's technical
co-founder, on Tuesday 6 October (30 to 40 minutes, an hour held; coding and technical talk; AI tools
encouraged; Python and TypeScript; screen share). It is on the Coframe page's Rounds tab with how to
prepare, the page's call details point at it, and LOOPS lists it after Commure. No teach-first
sessions yet: the next agent asks him. CLAUDE.md (gitignored, now copied to the main checkout),
WILDCARD.md and the auto-memory notes now record how he wants pages laid out, how a loop is built,
the repo mechanics, the interviews in play and the facts still to confirm with him. No charter
deviation.

**2026-10-01 — Tomorrow's interview is Vanguard, not 3 Dots IT.**
The invite shows Vanguard's team, organised by Mphasis, and Mphasis said Vanguard picked Pranav; the
two areas came from Rama at Mphasis and stand. The 3 Dots IT page moved to the existing Vanguard skeleton
(interviews/vanguard.html; threedots removed), Friday 2 PM. Research on Vanguard added its company
picture (crew-facing generative tools live, client-facing staged, AWS and Bedrock), a first Prep group
of 12 questions on Vanguard and financial services (the no-advice line, authentication, FINRA 2210,
4511 and Notice 24-09, Reg BI, SR 26-2), questions for Vanguard's team, and a seventh session, wc31,
about 70 minutes. He set aside 7 to 9 hours. No charter deviation.

**2026-10-02 — Vanguard: a Research tab, the industry pass.**
Asked for by Pranav on the morning of the Vanguard call: the nuance of how conversational AI and
NLP are run in production, not definitions. Six research agents covered conversation design and
intent and entity modelling, error analysis and the improvement loop, grounding per mechanic
(FAQ retrieval, account data, transactions, agent assist, the advice boundary, guardrails),
evaluation with telemetry and cost, classification and embeddings in production, and the ground
around it (voice, handoff, authentication, LLM orchestration, model risk, Vanguard's public AI
work). 54 topics with 238 sources, and 27 likely questions that link to the topics answering them.
Claims were not independently validated, at his request, and the agents flagged vendor-reported
numbers in place. Loop pages now take an optional `<module>.research.json`. No charter deviation.

**2026-10-03 — Vanguard as one learning path, judged; the call moves to Wed 7 Oct, 3 PM.**
Asked for by Pranav: compress the Vanguard page into a way to learn, with multiple choice and
open questions that show how much he knows. Prep (72 questions), Research (61 topics) and the
sessions' material became one Learn tab: 9 modules, 71 topics, 201 multiple-choice questions.
Each topic is learned, checked (five options, I don't know, a guess flag), explained aloud against
a model answer and self-rated, then said; each gets Know, Partly or Not yet, and a map of squares
shows where he stands. 'Test me' runs the weakest questions first. Old Prep links from the
tracker land on the topic that absorbed them. Overview gains a One page view of fifteen points,
from his banking copilot handbook. His alfred_ agent read the alfred_ code: there is no risk score,
decision layer, verdict enum, trained classifier or NER, and the verdict gate was removed on 3
August. His story and work answers now describe what is live and what he built (the first pass
and its guards, entity resolution in chat, the confirm flow and code floors, the grounding guards,
the failure scanner); the code-level detail sits in a private, gitignored module with its own
quiz. `vanguard.py` went from 1,270 lines to 273. The interview moved to Wednesday 7 October,
3 PM. No charter deviation.

**2026-10-03 — Learn tab: calmer layout and real navigation.**
Asked for by Pranav: the switch between Learn, Check, Explain and Say was hard to reach, and the
coloured stripes beside each module were unwanted. The list still opens in place, without module
colours; topics are set apart by a hairline, the level square beside the title and their place in
the module, and the open topic sits on a tint. Its step bar stays pinned under the top bar with
previous and next topic. Left and Right move between steps, J and K between topics; Check moves on
after its last question, and after Say, Next opens the next topic. Opening a topic or changing step
jumps to its top, and the tab reopens on the last topic and step. No charter deviation.

**2026-10-03 — Baseline: check yourself on every topic.**
Asked for by Pranav. All 268 topics in fifteen fields now end with two or three multiple-choice
questions (730 in all, `baseline/quiz/<field>.js`), five options each with I don't know and a guess
flag, one question per topic on its catch. A topic gets Know, Partly or Not yet, shown in the rail;
a field's About page says where you stand and runs a test of fifteen, weakest first. Answers stay in
the browser. Written in parallel by five writers and checked by `baseline/quiz/check.js`. No charter
deviation.

**2026-10-03 — Commure as a learning path; Coframe round 2 moves to Friday 9 October.**
The Commure page now has the Learn tab Vanguard uses, in place of Prep and Sessions: seven modules
(Monday's screen first, then the call path, the conversation loop, the backend, Python async, his
voice agent and the design), 35 topics, 91 multiple-choice questions. Old Prep links land on the
topic that absorbed them. Learn topics can now carry code files, shown folded under Learn. Coframe
round 2 is now Friday 9 October, one hour with Pavlo: coding, system design, Python and TypeScript.
No charter deviation.

**2026-10-03 — Coframe round 2 as a learning path, with live builds in Python and TypeScript.**
For Friday's hour with Pavlo. Four research passes (Coframe and its take-homes, Python and
TypeScript at senior depth, agent-platform design and how AI-allowed rounds are judged) became a
Learn tab of eleven modules: the round, Coframe as an engineer sees it, his work through the
platform lens, Python, TypeScript, async in both, two modules of live builds (a just-in-time UI
under a 4-second budget, a durable step runner, a rate-limited fan-out, an SSE parser, a bandit
assignment service, a reconciling two-way sync, a sandboxed runner, a trace summariser), agent
platform design, Coframe-shaped design, and his story. 75 topics, 205 multiple-choice questions,
63 code files in `interviews/coframe_builds/`, every test passing. The Overview has a One page view
and a new way to show up for a technical round; round 1 stays on the Rounds tab. No charter deviation.

**2026-10-03 — System design guide: everything open, and each design's HLD built in stages.**
Asked for by Pranav: a step took three or four clicks to read. Boards now open whole, with the
fold as an option, and How to get there and What to say are shown by default. Each of the eight
designs' high-level diagrams opens on its first stage and builds in four (Build it in order, Next
stage, Show all): the boxes a stage adds are marked, later ones wait in place, and a line says why
they come next. Deep-dive and pattern diagrams per design are the next pass. No charter deviation.

**2026-10-03 — Resources cut to two articles and two videos per sub-pointer.**
Asked for by Pranav: pages were buried in article links, with almost no videos. Every tracker step
in weeks 1 to 5 and the live wildcard sessions, every Learn topic on the Vanguard, Commure and
Coframe pages, and every Baseline topic now has one curated list (594 in all): at most two outside
articles and two YouTube videos, split Required and Optional, with his own references kept beyond
the cap (AI Engineering from Scratch lessons, his books, Alaap, tutorials and roadmaps, links on this
site). 818 articles kept from about 1,400; 400 distinct conceptual videos added, each checked on
YouTube for title, channel and length (`tools/yt.py`), and drawn as thumbnail cards by one shared
renderer (`site/res.js`). 264 sub-pointers have no video yet: the search budget ran out partway,
so a top-up pass can fill them. Parked loops (ZenML, Oxus) were left as they were. No charter deviation.

**2026-10-03: System design guide, a sketch on every deep dive and the key patterns.**
Every deep dive on the eight worked designs (33) now draws its picked solution, with the spot
where the problem happens marked in a warning colour with a cross, a caption, and one sentence
on what breaks there without the pick. Races, crashes between steps, retries and expiries are
drawn as sequence diagrams (a new renderer: actors across, time down, Step through one step at
a time); the rest as boxes. Each design's Patterns used shows the three most central patterns as
sketches in its own components (24), chosen so no pattern repeats a dive's picture; the other
cards stay text. Sketches scroll sideways on a phone rather than shrink. Asked for after the
staged HLD pass; scoped by him to all dives and the top three patterns. No charter deviation.

**2026-10-03: Video top-up, 264 sub-pointers without a video down to 44.**
392 videos added across the tracker, the three loop pages and Baseline, found through YouTube's own
results page (`python tools/yt.py --search`), so no web-search budget is spent. Each was checked
for title, channel and length, and any with fewer than 1,000 views was dropped (28 picks), except
the Coframe founder's AGI House talk and Rasa's own talk. The 44 left empty are steps with no
concept to teach (rehearse, pitch your own system, a personal story) or niche topics where only
weak videos exist; an empty slot beats a weak video. No charter deviation.

**2026-10-03: Every "What you would say" in weeks 1 to 5 is shaped to skim; the hundred-million answer rewritten.**
He found the model answers were 10 to 20 line paragraphs with nothing bold and no clear start or
end. All 61 are now an opening line in bold, three to six beats each with a bold head, and one
closing line (`ans: {lead, pts, close}`), same facts and shorter sentences. Week 1 session A step
4 (the hundred-million answer, no product names) was rewritten by hand: a new "How to think it
through" block (`think`: the questions to ask yourself, in order) and an answer that walks the
scale from a hundred a day to a hundred million (about 1,200 a second), naming what changes at
each step: a queue off the request path, a bounded queue and backpressure, partitioning on a skewed
key, idempotent retries and dead letters, admission per caller, sizing from the tail. The rehearsal
step after it got the matching short version. Four factual slips found on the way were corrected
(the base-rate ratio is about a thousand, adult male F0 is about 85 to 180 Hz, a retry's dedup key
is the scenario id alone, the latency ladder steps are one to three orders of magnitude). No
charter deviation.

**2026-10-03: Week 1, logarithms step 4 (why minimise negative log-likelihood) rebuilt to teach.**
He could not answer the step from what it gave him: the resources covered likelihood in general,
the figure was the log-sum one, and the step jumped from log rules to likelihood with no bridge.
It now says what the question is (two rewrites that keep the same best parameter), shows the
mathematics as equations (a new `eq` field drawn in a math face: the likelihood as a product,
arg max, log is increasing so the arg max is unchanged, product to sum, the minus sign to a loss,
seven heads in ten worked to p = 0.7, underflow in numbers), adds a think-it-through list and a
new figure (`nll`: the likelihood's peak and the negative log-likelihood's valley at the same
p = 0.7), and points to sources on exactly this: IntuitiveML's three-minute video, Dive into Deep
Learning 22.7.2, StatQuest's binomial walk-through. `figures/stamp.py` now also stamps
`data/reading.js` and `baseline/res/`, so new resources show without a hard refresh. No charter
deviation.

**2026-10-03: Weeks 2 to 5, every maths step rebuilt to teach, like week 1's negative log-likelihood step.**
26 steps: the four mathematics sessions (derivatives, vectors and matrices, gradients and descent,
probability) and the three that are mathematics underneath (sampling and Nyquist, attention's
square-root scaling, the source-filter model). Each lead now says what the question asks and the one
idea that unlocks it; the mathematics is written as equations (198 lines, each with a plain line under
it and a worked example in numbers); each step has a think-it-through list and a new check question on
the unlocking idea; resources were replaced wherever they covered the topic but not the question (the
whole-book PDFs are gone; d2l.ai sections, 3Blue1Brown, StatQuest, Khan Academy, Better Explained and
others in their place, every link fetched and every video checked). Eight new figures where none showed
the idea: a square growing by dx, a grid under a matrix, transposed shapes, backprop with the step's
numbers, a die's shrunk sample space, a tone read at the wrong rate, spectra before and after
resampling, one envelope sampled at 90 and 250 Hz. Model answers were corrected where they missed the
unlocking idea. No charter deviation.

**2026-10-03: Multiple choice written as maths; the last two figures drawn.**
He found the multiple-choice and check questions about equations were worded in English in the question,
the options and the answers. 346 strings across the week MCQ banks, the tracker's step checks and session
quizzes, the Baseline quizzes and the three interview Learn paths now use notation (log₂ 32 = ?, σ′(x) =
σ(x)(1 − σ(x)), (AB)ᵀ = BᵀAᵀ, θ ← θ − η∇L, √dₖ, P(A | B)), plain Unicode so every page draws it as is;
option order and answers unchanged, prose kept where it is an idea and not a formula. Two figures drawn for
the steps that had none: choosing a derivative rule by the expression's shape (w2b step 2) and the voice
measurements placed on the source or filter side (w5c step 2). No charter deviation.

**2026-10-03: Streams, a view of everything being learned (tracker, #/streams).**
He asked what all the streams are and whether a map of them should change the approach. Answer, as a
page: one trunk (Foundations: mathematics, DSA, how computers and networks work), three rivers (Systems;
ML, by mechanism; AI engineering), a bridge (inference engineering), his edge (audio and voice) and two
far rivers (space, defence and hardware; graphics, games and XR). Each shows how deep he is (sessions
closed out of those feeding it, Baseline answers for its fields), what feeds it now (sessions, interview
pages, guide, Baseline) and a backlog of whole courses for later, seeded with verified links. Any
resource card in a step now has For later, which parks a course in a stream's backlog (the step's own by
default) so a detour never takes over a session. The far rivers carry a research week's questions
before any study time. A view only, his pick: the milestone plan is unchanged. No charter deviation.

**2026-10-03: Week 2 back in sequence; every session tagged with what it teaches.**
The maths pass had turned week 2's chain-rule step into backprop through a network, with partial
derivatives and the 3Blue1Brown backpropagation video, a week before partial derivatives are taught
(week 4, Gradients and descent, which already carries backprop by hand and that video). The step is
one variable again: composition, dy/dx = dy/du · du/dx, (3x + 1)² worked and checked by expanding,
σ(2x) using the step before, a longer chain, and a pointer forward to week 4. The sigmoid step lost its
one partial-derivative line. Sessions now show a tag for what they teach (Maths, Systems, ML, Audio,
Interview) in the rail, the week list and the session header, since the track names a slot in the plan
(Requeue, Alaap), not the subject: Overfitting reads ML. No charter deviation.

**2026-10-04: Weeks 3 to 5 in sequence; Vanguard's path rebuilt for the three days before the call.**
Weeks 3 to 5 were audited the way week 2 was fixed: 18 places where a step leaned on something not yet
taught. Week 4's backprop watch now comes after partial derivatives and gradient descent (its resources and
questions re-keyed); attention's square-root scaling gets a primer on E[ ] and variance; the null space,
covariance and determinant left week 3's eigenvector step; spectrum, FFT and decibels are explained before
the resampling and source-filter steps use them; replication gets its one-line leader and follower primer.
Vanguard: modules now run foundations first (the map, classification and embeddings, LLMs, then intents
and dialogue, design, grounding, error analysis, evals) with a day tag each (Sunday to Tuesday, your story on
Wednesday morning); every non-story topic's answer is shaped to skim; resources were re-aimed at each
topic's question with 22 more videos; one-line primers replace forward leans. Six tested Python builds
(`interviews/vanguard_builds/`: an intent classifier with out-of-scope thresholds, entity extraction and
resolution, a transfer dialogue with confirm and repair, a grounded FAQ with citations and refusal, a hybrid
router with a code guard, an eval harness with a regression gate) sit inside the topics they teach. A new
system design module draws on the guide, which gains three compact designs: a grounded FAQ assistant, a
contact-centre voice line with handoff, and the conversation analytics and improvement loop. It also links
his week 2 and 3 design sessions. No charter deviation.

**2026-10-04: Vanguard's system design topics show the designs themselves; the flowchart topic removed.**
The design topics were text that pointed to the guide. Each now opens the design inside the topic: the guide
in a new embed mode (`?embed=<design>`: no top bar, footer or design list; the design's own step tabs kept),
so requirements, the high-level design built in stages, the deep dives with their sketches and the patterns
used are all on the Vanguard page, from one home in the guide. The frame takes the height the guide posts and
the page jumps to it on a step change. The topic linking the week 3 walkthrough-to-flowchart session was
removed: it is audit automation and has nothing to do with this call (it had been added because he mentioned
the week 3 design without checking what it was). No charter deviation.

**2026-10-04: Vanguard: resources on exactly what each topic asks, a voice AI module, harness engineering, long watches; every loop page's Learn tab in Accelerate's two-pane layout.**
He found the resources thin and off-target (one general video where the topic asked something specific). For
this path only the cap is three videos and three articles per topic: every topic was re-sourced against its own
questions (Dialogflow CX, Azure CLU, Rasa CALM and Amazon Lex docs on the exact concept, conference talks,
Hamel Husain on error analysis and evals), 235 videos and 198 articles in all. New: Voice AI, end to end (Day 2,
8 topics: the cascade, streaming against batch speech to text, turn detection and barge-in, speech to speech
models behind an orchestrator, WebSocket and WebRTC streaming and the stateful worker per call, the latency
budget and co-location, scaling voice workers, cost per call minute); three harness engineering topics in
evals, built on the Learn Harness Engineering course (also added to the AI engineering stream's backlog); and
Long watches, fifteen 20 to 85 minute talks found by a deep crawl. The Learn tab on every loop page now reads
like an Accelerate session: a table of topics (level, check, explain, rated) and a two-pane drawer, the
material left and your work right, what to say shut until tried; design topics take the full width. No
charter deviation.

**2026-10-04: Loop pages: the work pane stays with you, and Check yourself is a pop-up.**
In an open topic the right pane (Check yourself, Explain it, What you would say) is pinned under the bar
while the material scrolls, as on Accelerate. Check yourself opens the topic's questions one at a time in the
pop-up the tests use (Judge first's way), and the pane shows how many are answered and the level after.
No charter deviation.

**2026-10-04: AI Engineering from Scratch, served locally; ten of its NLP lessons in the Vanguard path.**
Every lesson on the course's site failed on his network: the site loads lessons from raw.githubusercontent.com,
whose connections are cut here (the TLS handshake breaks, over IPv4 and IPv6), while github.com works. The
course is cloned to E:\ai-engineering-from-scratch and study.cmd now also pulls it and serves it on port 8010
(the site reads lessons from the clone when served locally). site/nav.js, loaded by every page, opens course
lesson links on the local copy when it is running and on the website otherwise. Ten phase 5 lessons sit as
Required items in the Vanguard topics they serve (text classification, NER, entity linking, embedding models,
chatbots from rules to agents, dialogue state tracking, structured outputs, retrieval, NLI, LLM evaluation);
the phase as a whole is in the AI engineering backlog for after the call. No charter deviation.

**2026-10-05: Seven explainer videos, played in the steps and topics they teach.**
His picks, made in E:/explainer-videos (Remotion, captions burned in; narration once an ElevenLabs key is
added): the voice agent cascade, WebSockets and stateful voice workers, the hybrid NLU router, a transfer
dialogue with confirm and repair, the assistant improvement loop (Vanguard), backprop on week 4's tiny chain
and why minimise negative log-likelihood (week 1). Each is about two and a half minutes, built from the page it
sits on. The MP4s live in a gitignored media/videos (local only, nothing published); the shared resource
renderer gained a `clip` kind that plays a video in place, placed first in the topic or step. No charter
deviation.

**2026-10-05: The five Vanguard explainers narrated.** Voiced with ElevenLabs' built-in George voice (the free
plan cannot use library voices through the API, and its monthly allowance covers about five of the seven), so
captions now follow the voice word for word. Backprop and negative log-likelihood stay captions-only until the
next allowance or an upgrade. No charter deviation.

**2026-10-05: Each loop module shows its explainer videos up front.** Under a module's heading, the videos its
topics carry play in a row, each linking to the topic that teaches it (Vanguard: voice, NLU, design, errors,
system design). No charter deviation.

**2026-10-05: Videos can be skipped and sped up.** Skipping never worked because Python's http.server sends whole
files and browsers cannot seek in a video served that way; tools/serve.py adds byte ranges and study.cmd now runs
it. Every explainer video has speed buttons (1× to 2×), Open in a new tab, Copy file path (for Explorer or VLC; a
page cannot open Explorer itself), and hotkeys on the video last used: Space or K, Left and Right 5 s, J and L 10 s,
Shift+> and Shift+< speed, 0 to 9 jump, F full screen, M mute. No charter deviation.

**2026-10-05: Commure's Prep tab is back, with why leave, why voice AI and a screen question bank.** The intro (his
words), why Commure, his voice work, logistics and the questions to ask were in the module but hidden when the page
became a Learn path. The Prep tab shows them again, with two new answers: why leave alfred_ (paragraphs 1, 2 and 4 his
words, as for Mphasis and Coframe; paragraph 3 names voice agents in healthcare) and why voice AI; and a bank of the
eleven questions a recruiter screen asks, each pointing to its script. No charter deviation.

**2026-10-05: Commure uses his base intro.** The intro was the career-history version; his base intro (INTRO.md:
who he is now, the systems around the agent, then WheelPrice and UIC, then demo to reliable) replaces it on the Prep
and Learn tabs, word for word, with only the last sentence pointed at voice and patients' calls. His short- and
long-term goals, his closing and his own questions (process and timeline, how the team has changed, the first 90
days) are added from the same file. No charter deviation.
