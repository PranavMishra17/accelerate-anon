# MCQ bank

Multiple-choice questions for every pointer group (a session's step, with its sub-pointers),
one file per week: `week1.js` ... `week5.js` for Milestone 1. Each file calls `MCQ.add(...)`.
Checked by `node data/mcq/check.js` (run by `tools/rebuild.py`).

Decided with Pranav on 1 October 2026: steps are **judged first** with these questions (before
the material, to show what he knows, partly knows, or does not), and every finished week is
**reviewed** in later weeks on a widening gap (week N is reviewed in weeks N+1, N+3, N+7, N+11,
then every four weeks), shuffled across weeks with confusable questions placed together.

```js
MCQ.add("w1a:0", [                    // the step key: session id, colon, step index (study items: "w1a:s0")
  { q: "A service's p99 latency is 2 s and its mean is 120 ms. What does that tell you?",
    o: ["Most requests are slow",                                // exactly 5 options
        "1 in 100 requests takes 2 s or longer, and the mean hides them",
        "The median is 2 s",
        "The service is overloaded",
        "p99 is the slowest request ever seen"],
    a: 1,                                                       // index of the one correct option
    why: "p99 is the value 99% of requests beat; the mean is pulled down by the fast majority.",
    pair: "p50-vs-p99" }                                        // optional: a confusable-pair tag
]);
```

Rules:
- 3 to 5 questions for a step that teaches a concept; 0 to 2 for a pure action (run a demo,
  record yourself). A step with none is fine: it is simply not judged.
- Exactly 5 options, one correct, all plausible: distractors are the real misconceptions and
  the look-alike ideas, never jokes or "all of the above". Options similar in length and form.
- Questions test understanding and choosing (which applies, what happens if, why), not recall
  of a sentence on the page. A good bank tells apart someone who knows it, someone who half
  knows it, and someone guessing.
- `why` is one or two sentences that teach, read after answering.
- `pair` names a confusable concept pair (kebab-case) shared by questions that test the
  boundary between two look-alikes; reviews place them next to each other.
- Plain words, sentence case, no em dashes, no "simply" or "just". Facts must be correct.
