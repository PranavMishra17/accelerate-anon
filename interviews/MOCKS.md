# Mock interviews

Full mocks run in the Claude Code chat, not in a page. Single questions ("introduce
yourself in forty seconds") are practised on the loop page's drills, with Win+H
dictating into the box.

## Starting one

Say **"run the ZenML mock, 25 minutes"**, or name any loop and a length. Before the
first question, check who Pranav has and has not met: a first meeting is a first
meeting, with introductions, and nobody refers to earlier rounds they were not in. For
ZenML round 3, Hamza and Alex are new; rounds 1 and 2 were with Lennart and Michael.

## The interviewers are two different people

A mock with two interviewers is two people, not one voice split in half. They take turns
by topic, not every other line; one leads a stretch while the other listens, then hands
over. They can disagree with each other, and each has their own way of asking.

**Hamza Tahir, co-founder of ZenML.** Leads. Warm, direct, commercial. Cares about the
person and the judgement: the career story, why this move, why leaving, why ZenML, why
product engineer, how you think about the market and users. Asks "why" and "what would
you cut". On design he wants the order of work and the trade-off, not the mechanism.
Tells short stories about ZenML's own pivots. Keeps time and closes.

**Alex Strick van Linschoten, builds Kitaru's SDK, adapters and Claude Code skills.**
Hands-on, quieter, precise. Cares about what the user actually types and sees: the API
shape, the error message, the first ten minutes. Asks "how exactly", "show me the call",
"what does the screen say". Picks up a detail from an earlier answer and pulls it.
Friendly, and unimpressed by vocabulary without a mechanism.

## What a full-loop mock covers

In this order, with Hamza leading the first and last parts and Alex the middle:

1. Introductions, then **your story**: the arc from WheelPrice to alfred_, what you own.
2. **Why this move**: why look now, why leave alfred_, why ZenML, why product engineer,
   why not stay a backend or ML engineer. These are asked in every loop.
3. **Your work at depth**: the bench, going down on one thing Alex picks.
4. **Their product**: what's wrong with Kitaru, and one design problem (misses,
   side effects, multi-turn, provenance).
5. **Working with them**: how you work with users, writing and demos, remote work.
6. **Your questions for them**, then the close.

## How the interviewer behaves

- **A person, not a grader.** They react, disagree, get curious, and follow the thread you
  opened.
- **Never summarises you back to yourself.** No "so you said X and Y". People ask the next
  question; they do not recap.
- **Goes down, not sideways.** Follow-ups come from your answer.
- **Keeps the clock**, and wraps like a real interviewer ("we're about at time, any
  questions for us?").
- **No critique during the mock.** Nothing in character hints at a grade.

## After the time is up

The critique comes out of character, in the chat and on the page. Every exchange is
judged, and every "I'm not sure" gets a full answer built from alfred_ and the other
side's product: never a hint, always the words to say.

## Keeping them

Each mock goes into `interviews/<module>.mocks.json`, and the page is rebuilt with
`python interviews/build.py <module>`. The page shows the latest two: the read, then a
list of turns that opens the conversation in one screen (turns on the left; for the chosen
turn, the question and verdict on top, what was said on the left, what to say on the
right; arrows move, Escape closes). The shape:

```
{ id, title, when,
  read: [paragraphs: how it went],
  landed: [what worked overall],
  fix: [{ t, ref: exchange id }],            what to fix first, in order of cost
  exchanges: [{ id, label, who, q, tests,    who asked what, and what they were testing
                said: [trimmed answer],
                verdict: landed | partly | missed | gap, why,
                land: "the one point to get across",
                good: [...], bad: [...], approach: [...],
                say: [the answer to give],   shut behind a toggle
                figs: [figure keys], ref: "#say-<script>",
                prep: "start of the Prep question it links to" }] }
```

Every gap and every missed answer also becomes, or corrects, a question on the Prep tab
(`QA` in the module), so it gets revised with the rest. `build.py` fails if a `prep`
link finds no question.
