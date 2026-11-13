/* How to work any question in the two Mercor coding rounds: the method each rewritten answer follows. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-method",
 "n": 14,
 "title": "How to work any question",
 "minutes": 30,
 "lead": "The problem on the day will not be one you have seen. These two pages are the method: how to read a new problem, where the questions come from, and how the conversation runs. Every reported answer is this method applied.",
 "sections": [
  {
   "id": "method-algo",
   "title": "1. The algorithms talk: how to work any question",
   "blocks": [
    {"t": "p", "text": "**What the round is.** Thirty minutes, discussion first. They watch how you think: what you ask, which structure you see, what each idea costs, and how you move when they change the problem. Code may be a few lines or pseudocode. A clean conversation that reaches the right idea beats a rushed full solution."},
    {"t": "list", "items": [
     "**Read it before you speak. The first two minutes, mostly silent.**",
     "Restate it in one sentence, in your own words.",
     "Name the input and the output as types: a list of pairs, a dict, a stream, a function you can call.",
     "Find the hidden structure. Things that point to things: a graph. Things you compare and rank: an order. Is it in or out: a set. Values over time: a stream. A yes or no that flips once as a number grows: binary search on the answer.",
     "Underline the size words: a million, rate-limited, costs money, wrong sometimes, as few as possible. They choose the algorithm.",
     "List every word that is not defined. Each one is a clarifying question."
    ]},
    {"t": "table", "head": ["Look at", "Ask", "What the answer changes"], "rows": [
     ["Size", "How big is n? Does it fit in memory?", "O(n squared) is fine for a thousand, n log n for a million, streaming or approximate beyond memory."],
     ["Shape of the input", "Directed? Duplicates? Cycles? Missing entries?", "Which traversal, whether you need a visited set, whether you must detect a cycle."],
     ["Errors in the data or the oracle", "Wrong always on the same input, or at random? How often?", "Random errors: repeat and take the majority. Fixed errors: repeating does not help; cross-check with other comparisons."],
     ["Cost of one operation", "Is there a rate limit, a price, a latency per call?", "You minimise calls: cache, batch, pick the algorithm with the fewest queries."],
     ["The output", "One answer or all? Exact or approximate? How are ties broken?", "Heap against full sort; a set against a Bloom filter; a tie rule you must state."],
     ["Queries", "One query, or many? Does the data change between them?", "Precompute once and answer fast, or compute on demand; how you invalidate."],
     ["No answer", "What if it is impossible: no path, a cycle, not enough budget?", "What you return, and whether you report why."]
    ]},
    {"t": "p", "text": "**Then branch out loud.** Ask, listen, and say which branch you are taking: \"if it fits in memory I would do X; if not, Y.\" When they say \"you decide\", take the simpler branch, say the other one exists, and move. That sentence alone shows you saw the whole tree."},
    {"t": "list", "items": [
     "**The conversation, in order.**",
     "Restate and ask, about three minutes. Write the answers down where they can see them.",
     "Brute force first, with its cost. It proves you understand the problem and gives a baseline.",
     "The insight: which structure makes it better, and why. This is the part they score most.",
     "Walk a small example by hand before any code.",
     "Code the core, or pseudocode if they prefer. Say each line's job as you write it.",
     "Test on the edge cases: empty, one item, ties, the cycle, the impossible case.",
     "Follow-ups: they will change one thing (bigger, noisier, live updates). Say what changes and what it costs."
    ]},
    {"t": "table", "head": ["When you hear", "Think"], "rows": [
     ["depends on, before, prerequisite", "A directed graph; topological sort; a cycle means impossible."],
     ["convert, via, chain of rates", "A weighted graph; multiply along a path; BFS or DFS; inconsistent cycles."],
     ["fewest calls, as few steps as possible", "BFS for fewest hops; cache every answer; never ask twice; batch."],
     ["top k, best few", "A heap of size k: O(n log k), not a full sort."],
     ["a million, memory, unique", "A set if it fits; sort and binary search; a Bloom filter when approximate is fine."],
     ["wrong sometimes, noisy, unreliable", "Repeat and vote for random errors; win counts across many pairs and cycle detection for fixed errors."],
     ["costs money per call, budget", "Count operations, not time; the algorithm with the fewest comparisons or queries wins."],
     ["O(1) insert, remove, random", "An array plus a dict from value to index; swap with the last on remove."],
     ["hidden, you can only query", "How much each query tells you; choose queries that split the possibilities."],
     ["reach, influence, spread", "BFS from each node; greedy set cover for picking a few."]
    ]},
    {"t": "list", "items": [
     "**Habits that score.**",
     "Say the cost of every idea you propose, time and space.",
     "Name the trade-off before they ask for it.",
     "Pick, then defend. Do not list five options and stop.",
     "Stuck: solve a smaller case by hand, or drop one constraint and add it back.",
     "Watch the time. At 20 minutes you should have the main idea out loud."
    ]}
   ]
  },
  {
   "id": "method-solo",
   "title": "2. The solo hour and the review: how to work any build",
   "blocks": [
    {"t": "p", "text": "**What the round is.** Sixty minutes alone with a prompt: no AI, no search, nobody to ask. The code must run end to end on their input. Then thirty minutes with an engineer who has read it and asks why. The hour gets you into the review; the review is where you are judged."},
    {"t": "list", "items": [
     "**The hour, in order.**",
     "Minutes 0 to 5: read every part before writing a line. Pick a data model that serves all of them.",
     "Minutes 5 to 10: write the decisions block at the top of the file (below), then the data model.",
     "Minutes 10 to 15: read the input and print what you built, with a count of what you skipped. Now it runs.",
     "Then part by part. After each part, a few asserts and a run. Never leave the file broken for long.",
     "Last five minutes: run it on their input, fix names, and add a comment of what you would do with more time."
    ]},
    {"t": "table", "head": ["Gap type", "Default decision", "Why it holds up in review"], "rows": [
     ["Bad or malformed rows", "Skip and count them; print the count to stderr.", "One bad row does not kill a batch, and nothing disappears unseen."],
     ["Duplicates", "Collapse them.", "Counting the same fact twice is almost never wanted."],
     ["Ties in any ranking", "Break by id.", "The output is the same every run, so it can be tested."],
     ["An undefined metric (reach, influence, best)", "The simplest reasonable definition, named in a comment.", "You can defend simple, and name the richer version as the follow-up."],
     ["Unknown ids or references", "Drop and count.", "Same as bad rows: robust and visible."],
     ["Order of output", "Deterministic: sorted.", "Reproducible output is testable output."],
     ["Big input", "Stream it line by line.", "Memory stays flat; costs nothing extra to write."],
     ["Errors", "Raise specific exceptions inside; catch once in main with a clear message.", "One place decides what the user sees."]
    ]},
    {"t": "code", "title": "The decisions block, at the top of the file", "code": "\"\"\"Referral network.\n\nDecided (no one to ask, so written down here):\n- A bad row (missing name, self-referral, unknown id) is skipped and counted.\n- Reach = everyone under a person at any depth, not counting them.\n- Ties in any ranking break by id, so output is the same every run.\n- Influencers = greedy: each pick adds the most people not yet covered.\n\nRun: python solution.py input.csv\n\"\"\"\n"},
    {"t": "table", "head": ["The reviewer asks", "Have ready"], "rows": [
     ["Why this data structure?", "What it makes cheap, and what you gave up."],
     ["What is the complexity?", "Time and space per function, and the one that dominates."],
     ["What breaks first at scale?", "The function you would change first, and how."],
     ["How do you know it works?", "What you tested, and the cases you would add."],
     ["What if the input is malformed?", "Your skip-and-count rule, and the strict alternative."],
     ["Is it thread-safe?", "Where shared state is, and where the lock would go."],
     ["Why did you decide X?", "The decisions block: the alternative, why, the cost."],
     ["What would you change?", "Two or three things, most valuable first. Concede fast when they are right."]
    ]}
   ]
  }
 ]
});
