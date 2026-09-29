# Wildcard

A sixth slot on the planner, kept permanently open and normally empty. It is not
week six, it does not extend the milestone, and it does not move the gate.

## What it is for

Interviews arrive with two days' notice and demand something specific — a DSA round,
a system design loop, a domain the company cares about. Previously that meant
dropping the plan and never returning to it. The wildcard is the defined place for
that work to go, so it is *inside* the plan rather than a reason to abandon it.

## How sessions get added

When a loop is scheduled, say what it is and what they interview on. It then gets two
things:

1. **Sessions** in `index.html`'s `WILDCARD.sessions` array, the same shape as any
   planned session. Three sessions or eleven, depending on what the interview actually
   demands.
2. **Its own page**, `interviews/<loop>.html`, built by `python interviews/build.py
   <module>` from a content module (`interviews/<module>.py`): the brief, what to say
   in the words to say it, timed spoken drills, a technical question bank, figures,
   questions to ask, traps, and every session readable in place. Add a `LOOPS` entry in
   `index.html` so the wildcard page shows it as a card. Optional `OWN` in the module sets
   their system against yours; your own system's facts live in `alfred/content.py`
   (`ALFRED.html`), and a loop page links there rather than copying them. Code that
   `CODING.html` already holds is linked (`../CODING.html#<id>`), not pasted. The Prep tab is a hub: `SHOW_UP` (how to
   present yourself), then each bank (`SCRIPTS`, then each `QA` group in `QA_ORDER`) as one
   row that opens in the one-screen panel, then drills, questions to ask, traps and
   `SOURCES` folded shut. A question can carry `short` (its label in the list), `land` (the
   one point), `notes` (the nuance), `figs`, `probes` (what they may ask next) and `swaps`
   (lines to swap in); the answer shows on the dark sheet. A big design question also
   carries `parts`: titled sections (why, what I'd change, what breaks, how to scale, how
   to productionize, trade-offs, deep dives) drawn as a board on the light side.
   Questions you ask are `ASK_3C`: clarifying (during the interview, each tied to the
   decision it changes), contributing (at the end, about their problems and what success
   looks like) and collaborating (how the team decides, reviews and ships), each with when,
   why and how, and every question with who to ask, how to loop it in, and what it shows. Every
   loop gets a non-technical bank about the role itself, researched from the job post and
   the company's own pages, with every link checked.
3. **Mocks**, run in the Claude Code chat by `interviews/MOCKS.md`: named interviewers from
   the loop with distinct roles, the whole loop covered (story, why this move, the work,
   their product, questions), no reference to rounds you were not in. Each mock is saved
   to `interviews/<module>.mocks.json` and shows on the page's Mocks tab as a read (how it
   went, what landed, what to fix first) and a one-screen conversation: the turns on the
   left, and for each, the question and verdict, what you said, and what to say on a dark
   sheet. Every gap gets a full answer and a Prep question. The template draws all of this
   for any loop; a new loop only writes content.

Sessions **append**. Existing wildcard sessions are not cleared when new ones arrive.
When a loop is over, its sessions are marked `parked: true`. Never delete a session: saved
progress keys its steps by id (`wc3:s2`). A session opens by id (`#/w/wc8`) or by position
(`#/w/3`); every hand-written link uses the id, because positions shift when a session is
inserted (putting `wc18` first on 28 September sent every `#/w/<n>` link one session off).
Parked sessions still count toward credit (the fold rule counts every closed
wildcard session, parked or not), stay openable at their `#/w/<id>` address, and leave
every list: the home page, the rail, the wildcard page's open list, the sheet and the
drill. They sit under **Past loops**, folded shut on the wildcard page, with each past
loop's page linked.

## What each place shows

- **Home**: open wildcard sessions only (not parked, not done). With none open it reads
  "Nothing open." and links the loop in play, the first entry in `LOOPS`.
- **Wildcard page** (`#/wild`): the loop in play on one line, then one list of open
  sessions. Done sessions are hidden; a small "Show done (N)" toggle shows them struck
  through. The toggle lives in memory only and is off on every load. Then the credit
  line, Past loops (folded), and How it works (folded).
- **Rail**: the wildcard's open count, a link to the loop in play, and its open sessions.
- **The hero**: `nextSession()` never picks a parked or done wildcard session, nor one
  whose loop date has passed.
- **`WILDCARD.note`**: one line, the loop in play ("Mphasis, technical."). Everything
  about past loops lives on their pages and under Past loops, not in the note.

Session shape, for whoever is adding them:

    {
      id: "wc19",                        // unique, wc-prefixed
      track: "Systems",                  // Systems | Mathematics | Alaap | Interview | Requeue
      forWhat: "ZenML round 3, 28 Sep",  // which loop; LOOPS matches on its prefix
      len: "1h 30m", est: 90,
      name: "...",
      blurb: "one line, shown in lists",
      intro: "why this session exists",
      study: [{ t: "term", say: "said-out-loud definition", res: [...],
                do: [{ a: "action", m: 5, where: "...", url: "...", out: "done when", skip: "..." }] }],
      steps: [{ t: "...", d: "what it is", m: 10, ans: ["the words to say", "..."],
                sd: [{ p: "pattern", t: "technique", why: "..." }], links: [...],
                close: [{ k: "short", q: "open question", a: "model answer" }] }]
    }

Reading, figures and guide links per step can also live in `data/reading.js`, keyed
`<session id>:<step>` (`wc13:0`) or `:s<n>` for a study item; the tracker and the loop
page both read it. The end quiz is drawn from the steps' `close` questions, five to
eight, open questions only. Also add a `SHORT` label, put the new loop first in `LOOPS`,
and set `WILDCARD.note` to its name, one line.

## The fold rule

Closing a wildcard session earns **one credit**. A credit lets you fold one planned
session in — marking it covered, counting it toward the week's state, without doing
it separately. This is honest: interview prep genuinely does cover some of this
material, and pretending otherwise would make the tracker lie.

**The cap is four folds across the whole milestone, out of fifteen sessions.**

That number is the point. Interview work can cover part of the plan. It can never
quietly become the plan, which is the exact failure this whole thing was built to
prevent. If the wildcard is running and the planned weeks stay untouched for a
month, the tracker will show it rather than hide it behind a wall of green.

Folds are reversible. A folded session keeps all its material, so it can still be
done properly later if the interview prep turned out to be shallower than it felt.

## Currently in the slot

In play: **Mphasis, technical** (`interviews/mphasis.html`). It has no wildcard sessions;
its page holds the prep, and algorithms are on `CODING.html`. Nothing is open.

Parked, 29 September 2026:

- **ZenML round 3, 28 September.** Happened. Eleven sessions parked. Its page,
  `interviews/zenml-round3.html`, also holds everything learned about Kitaru.
- **Oxus, technical, 23 September.** Happened. Its three design sessions moved into weeks
  2, 3 and 4 as extra systems practice; the other three are parked. Its page,
  `interviews/oxus.html`, is a minimal archive.
- **`wc18`, 'alfred_ from the outside: draw it cold'.** Parked, not tied to one loop. Your
  own system now has its own page, `ALFRED.html`, as study material rather than a drill.

The wildcard as a flat checklist is the tracker's `#/sheet/wc`, Copy as markdown; no copy is kept in the repo.

## At the re-plan

Wildcard entries are cleared at the milestone boundary, and what was learned there
gets folded into the next milestone's plan if it turned out to matter. Anything
folded and never genuinely covered goes into `REQUEUE.md` rather than disappearing.
