/* Mercor onsite, algorithms discussion. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-onsite-algo",
 "n": 8,
 "title": "Onsite algorithms discussion: comparator, exchange rates, friend network",
 "minutes": 150,
 "lead": "After this part you can run a 30 to 45 minute talk-only algorithms round: the faulty comparator, exchange rates and the friend network. Each problem goes in the order you solve it: clarify, requirements, entities, the logic in English with numbers, the code for after, and the review. Open with how to run the round and close on the follow-ups they chain. The original prompts are not public; these are rebuilt from candidate reports.",
 "sections": [
  {
   "id": "onsite-talk",
   "title": "0. How to run a talk-only algorithms round",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A conversation of 30 to 45 minutes with no code expected. AceOffer's synthesis of 20 candidate reports (aceoffer.app, interview process page for Mercor, Oct 2025 to Oct 2026) lists three questions: sorting or top-k with a faulty comparator (the most reported, four reports), exchange rates across currency pairs, and a search through a friend network with few API calls. Exchange rates and the friend network have one report each and no more detail than that line. The prompts are paraphrased there, not verbatim, so the versions below are rebuilt. Do not memorise a wording; learn the shape."
    },
    {
     "t": "p",
     "text": "**What a talk round grades.** The same things the coding round grades, said aloud: do you break the problem down, do you count, do you compare alternatives, do you recover when pushed. AceOffer says the candidates who passed the comparator question clarified the error model first and treated calls and wall-clock time as two separate goals. One PracHub report (a Mercor software engineer, May 2026) describes a purely verbal sorting round: insertion sort and how to beat n squared, quicksort's worst case, then 'design a sort slower than n squared'. So expect plain theory next to the exotic question."
    },
    {
     "t": "p",
     "text": "**The five moves, in this order, every time.**"
    },
    {
     "t": "list",
     "items": [
      "1. Clarify in three buckets: what it must do, what goes wrong, where it stops. Ask the question whose answer changes the algorithm.",
      "2. State the brute force first, with its cost as a number: calls, time, memory. Say it before you improve it.",
      "3. Improve it in one move, say what you give up, and say the new count. A claim without a count is a guess.",
      "4. Check with a small example by hand: 5 items, 4 currencies, 6 people. Say the numbers as you go.",
      "5. Change the goal and see what breaks (slow calls, unreliable answers, many queries). Close on the tradeoff in one sentence and ask which goal they want."
     ]
    },
    {
     "t": "table",
     "head": [
      "Minutes",
      "What you are doing",
      "What you say"
     ],
     "rows": [
      [
       "0 to 5",
       "Clarify, in three buckets",
       "'Before I answer, three things: what it must do, what can go wrong, where it stops.'"
      ],
      [
       "5 to 10",
       "Requirements, then the brute force",
       "'The obvious way costs about n log n calls. I'll count it, then try to beat it.'"
      ],
      [
       "10 to 25",
       "The improvement, with the count",
       "'This drops it from 8,715 calls to about 1,044 on a thousand items. Here is why.'"
      ],
      [
       "25 to 35",
       "Change the goal",
       "'If each call takes a second, I stop counting calls and count rounds.'"
      ],
      [
       "35 to 40",
       "Small example, then the tradeoff",
       "'Let me run five items through it. Fewest calls and least waiting pull apart; which one matters here?'"
      ]
     ]
    },
    {
     "t": "write",
     "id": "onsite-talk-w",
     "q": "For each prompt, say the brute force in one sentence and its cost as a number. Write what you would say.",
     "starter": "1. Best 5 of 1,000 items, only a compare(a, b) call:\n\n2. How many units of B for one unit of A, given a list of quotes:\n\n3. Hops between two users, only friends(user) calls:",
     "hint": "The brute force is the cost you name before improving. Say n, k, V, E in it.",
     "solution": "1. Sort all 1,000 and take 5. About n log2 n minus 1.44 n, so roughly 8,500 calls. I'll try to do it in about n.\n2. Treat quotes as edges. Try every simple path and keep the largest product. That is exponential in the number of currencies, so I want a search that visits each currency once.\n3. Breadth-first search, asking about every user reached. About (friends per user) to the power of the distance: with 12 friends and 4 hops, about 20,000 calls. I'll try to ask about far fewer users.",
     "why": "Each line names the slow answer and puts a number on it. The number is the thing you improve against, and it is what the interviewer is waiting for.",
     "say": "**I always start with the slow answer and its cost.** Sorting everything is about 8,500 calls for a thousand items. Trying every path is exponential. Asking about every user is twelve to the power of the distance. Then I say how much I think I can save."
    },
    {
     "t": "faq",
     "title": "Warm-up theory questions a talk round may open with",
     "items": [
      {
       "q": "Insertion sort is O(n squared). How do you beat it?",
       "a": "Divide and conquer. Merge sort splits in half, sorts each half and merges: about n log2 n calls. Quicksort partitions around a pivot and recurses: n log n on average. The lower bound for any comparison sort is log2(n!), which is about n log2 n minus 1.44 n."
      },
      {
       "q": "What is quicksort's worst case?",
       "a": "O(n squared), when the pivot is always the smallest or largest. A sorted input with a first-element pivot does it. A random pivot or the median of three makes it unlikely, and you can say expected n log n."
      },
      {
       "q": "Design a sort slower than n squared.",
       "a": "Generate every permutation and check each for sorted order: n factorial permutations, so O(n!). Counting subsequences gives 2 to the n minus 1, which is also slower than any polynomial. Say you would never ship it; the point is to show you can count."
      },
      {
       "q": "How many calls does a library sort make?",
       "a": "It depends on the input. Python's sort finds runs, so an already sorted list of n items costs n minus 1 calls, and a shuffled one costs close to n log2 n. Say 'it depends on the input' before you quote a number."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-comparator",
   "title": "1. A faulty or slow comparator",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** You get a function `compare(a, b)` you cannot see inside, and you must sort or pick the best k. Reports say it comes in layers: use the fewest calls, then the least wall-clock time when each call is slow, then what if the answers are wrong. It is the most reported question of the round (four reports). It is also close to a real job: ranking with a model as a judge, where every comparison is a slow, paid, sometimes wrong call. In my eval harness I used a model as a judge next to deterministic checks, so I can talk about that."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) the code (shut until you have talked it through), f) the review. Try each box before you open the answer."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets. Ask the question whose answer changes the algorithm. One question is left open on purpose: is the comparator wrong at random, or the same wrong answer every time? AceOffer's report says the errors are repeatable. Do not assume either. Ask, then say what you do in each case."
    },
    {
     "t": "write",
     "id": "onsite-cmp-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: what compare returns, what to return, how big k is, which goal first. Errors: random or repeatable, tied to close values or not, raises, contradicts itself. Scope: parallel and rate limit, code or talk, ties, streaming.",
     "solution": "1. Primary capabilities\n- What does compare return? Likely negative, zero or positive, like Python's cmp.\n- Return the best k in order, or the whole sorted list? Likely the best k, in order.\n- How big is k next to n? Likely small: k of 5 to 10, n in the thousands. A big k changes the answer to 'sort everything'.\n- Which goal comes first: fewest calls, or least wall-clock time? Likely calls first, then time when each call is slow.\n\n2. Error handling\n- Is it wrong at random, or the same wrong answer every time for the same pair? LEFT OPEN ON PURPOSE. Random: cache and vote. Repeatable: re-asking is useless, so I detect and report. One report says repeatable.\n- Is it wrong only when two items are close, or anywhere? Close-only means the top set is nearly right.\n- Can it raise or time out? Likely yes: retry with a cap, then raise.\n- Can it contradict itself: a before b, b before c, c before a? Likely yes. No algorithm repairs a cycle; I detect it.\n\n3. Scope boundaries\n- Can I call it in parallel, in a batch, and is there a rate limit? Decides the slow-call answer.\n- Do I write code, or talk? Talk, 30 to 45 minutes.\n- Ties and duplicates? Keep input order (stable).\n- Streaming input? Out of scope until asked: it is a follow-up.",
     "why": "The determinism question changes the whole error plan: voting fixes random errors and does nothing to repeatable ones. The parallel question changes which goal I can serve. The size of k picks between sorting and a partial method.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, where it stops.** The one I care about most is whether the wrong answers are random or the same every time, because voting fixes the first and does nothing for the second. I also ask how big k is, and whether I can call it in parallel, because those decide the algorithm."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each testable. The interviewer's answers become these."
    },
    {
     "t": "write",
     "id": "onsite-cmp-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "Result, counting, the method by k, ties, rounds, the error handling, out of scope.",
     "solution": "1. Given items and compare, return the best k in rank order. Test: 1,000 distinct numbers, k = 5, the result equals sorted(data)[:5].\n2. Every call to compare is counted and the count is reported. Test: sorting 2 items makes 1 call.\n3. The method follows from k. If k is at least half of n, sort everything. Otherwise do not sort everything. Test: k = 5 on 1,000 items uses under a quarter of the calls of a full sort (1,044 against 8,715).\n4. Equal items keep their input order. Test: two equal items come back in input order.\n5. When calls are slow, independent calls run together and the number of rounds is reported. Test: 64 items, k = 3 finishes in 5 rounds.\n6. Random wrong answers are fixed by one stored answer per pair and an odd vote; errors raised are retried up to a cap, then re-raised. Test: every 4th call wrong, still sorted.\n7. Repeatable wrong answers are not fixed but detected: a cycle among three items is reported. Test: rock, paper, scissors returns a cycle; plain numbers return none.\n8. Out of scope: learning the comparator's rule, streaming input, a distributed run.",
     "why": "Requirement 3 is the main design decision, 6 and 7 are the two sides of the open question, and 5 is the second goal. Each has a number a reviewer can check.",
     "say": "From your answers I get seven requirements. **The first is the contract: best k in order. The next five are the goals: count calls, pick by k, keep ties stable, run independent calls together, handle wrong answers.** I'd write a test number next to each, like 1,044 calls for k of 5 on a thousand items."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if the design needs its data or behaviour. Say what data structure each becomes."
    },
    {
     "t": "write",
     "id": "onsite-cmp-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "Comparator: \nCounted wrapper: \nItem (for the heap): \nTournament tree: \nPair answer cache: \nBatch of pairs: \nRound: \nVote: \nk, n: ",
     "hint": "What carries state? The count, the cache, the tree. What is only a step or a number?",
     "solution": "Comparator: keep as an input, never as our class. A function we can only call.\nCounted wrapper: keep. One integer, calls. It is how we measure.\nItem (for the heap): keep. Wraps a value so heapq's less-than calls compare. One method, __lt__.\nTournament tree: keep. A list of size 2 * size; leaf i holds an index; each parent holds the winner. Replaying one path is the whole trick.\nPair answer cache: keep. A dict from (a, b) to a verdict. The reverse pair reads the same entry with the sign flipped.\nBatch of pairs: keep. A list of (a, b) sent as one round. This is how the slow-call plan is expressed.\nRound: drop as a class. It is a counter incremented per batch.\nVote: drop. A loop with an odd count.\nk, n: values.",
     "why": "The two real structures are the tournament tree and the pair cache. The wrapper earns its place because everything else is judged by the number it holds.",
     "say": "I underline the nouns. **The wrapper that counts, the tree for the tournament, the cache for one answer per pair, and the batch for one round stay.** A vote and a round are only loops and counters. The comparator itself is the thing I am given, so it is never my class."
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.** Three layers, as the reports ask them. First the number of calls."
    },
    {
     "t": "write",
     "id": "onsite-cmp-logic1-w",
     "q": "Layer 1, fewest calls. For sort-all, a heap of size k, a tournament and quickselect: the steps in English and the count for n = 1,000, k = 5.",
     "starter": "Sort all:\nHeap of size k:\nTournament:\nQuickselect:\nWhich one when:",
     "hint": "Sort-all costs about n log2 n minus 1.44 n. The best of n needs exactly n minus 1. A heap compares each new item with the root.",
     "solution": "Sort all (merge sort):\n1. Split in half, sort each half, merge.\n2. Each merge step is one call; compare with strict less-than so equal items keep their order.\n3. Count: about n log2 n minus 1.44 n, so 8,526 by the bound, 8,715 measured.\n\nHeap of size k:\n1. Push the first k items.\n2. For each next item, one call against the root, which is the worst of the kept k.\n3. If it ranks ahead of the root, replace the root: about log2 k more calls.\n4. Count: about n on random input (1,081 measured), up to n log2 k = 2,322 in the worst order.\n\nTournament:\n1. Build a bracket: n minus 1 calls, which is the proven minimum for the best one.\n2. Take the winner out. Replay only the matches on its path: ceil(log2 n) = 10 calls.\n3. Repeat for the other winners.\n4. Count: n - 1 + (k - 1) * 10 = 999 + 40 = 1,039 by the formula, 1,044 measured.\n\nQuickselect:\n1. Pick a pivot, compare every other item with it (n minus 1 calls).\n2. Keep the group that contains the cut-off and repeat.\n3. Count: about 2n on average; 1,695 measured for k = 5 in 8 pivot rounds.\n\nWhich one when:\n- k at least half of n: sort all.\n- Calls are the cost and k is small: tournament.\n- Short on time to write it: heap. It is close behind (1,081).\n- Calls are cheap but waiting is not: pivot rounds (layer 2).\n\nEdge cases: k = 0 returns empty; k above n returns everything sorted; n = 1; duplicates; an odd number of items in a bracket round (the odd one gets a bye).",
     "why": "The tournament reuses every earlier result and replays one path per winner. That is why it is the answer for a small k and why a heap, which forgets, costs more.",
     "say": "**I'd count first: sorting a thousand items is about 8,500 calls, a heap of five is about 1,100, a tournament is about 1,040.** The tournament builds a bracket once, n minus 1 calls, and each next winner replays one path of about ten calls. Quickselect is about 2n. For a big k I'd sort everything."
    },
    {
     "t": "write",
     "id": "onsite-cmp-logic2-w",
     "q": "Layer 2, each call takes one second. Redo the table in seconds and in rounds. What do you trade?",
     "starter": "Sequential, seconds:\nBracket, rounds:\nPivot rounds:\nTwo-round trick:\nWhat I trade:",
     "hint": "Sequential time is calls times one second. Parallel time is rounds. Independent calls in a round run together.",
     "solution": "Sequential, one second a call (n = 1,000, k = 5):\n- Sort all: 8,715 s, about 2.4 hours.\n- Heap: 1,081 s, about 18 minutes.\n- Tournament: 1,044 s, about 17 minutes.\n\nIn rounds (independent calls run together):\n1. Bracket, best one: round r holds n / 2^r matches, all independent. 10 rounds, 999 calls, at most 500 at once. About 10 s.\n2. Bracket, best 5: each next winner replays a path of 10 calls, one after the other: 10 + 4 * 10 = 50 rounds, about 50 s.\n3. Pivot rounds: each round compares everything with one pivot, all at once. 8 rounds, 1,695 calls measured, about 8 s, plus one round to order the 5 (all pairs, 10 calls).\n4. Two-round trick for the best one: all pairs inside groups of 32 in round 1, all pairs among the 32 winners in round 2. 15,900 calls (15,404 + 496), about 2 s.\n5. All pairs: 499,500 calls in 1 round, 1 s. Never worth it at this size.\n\nWhat I trade: time for calls. 10 s costs 999 calls, 2 s costs 15,900, 1 s costs 499,500. A rate limit or a price per call decides where to stop. With concurrency c, time is at least the larger of the rounds and calls / c.\n\nIf the API takes a batch, each round is one request. Merge sort does not parallelise inside a merge: each step needs the one before.\n\nEdge cases: a rate limit (cap the pool); a batch size cap; one slow call stalls the whole round (use a timeout and a retry).",
     "why": "When calls are slow the unit of cost changes from calls to rounds. A bracket has few rounds and few calls, which is why it beats the rest for the best one; for the best five the replays are sequential, so pivot rounds win on time.",
     "say": "**When each call takes a second I stop counting calls and start counting rounds.** A bracket of a thousand items is ten rounds and 999 calls, about ten seconds. For the best five the replays are sequential, so pivot rounds do it in eight rounds with about 1,700 calls. I can go down to two rounds with 15,900 calls. I buy time with calls, and I'd ask which one they want."
    },
    {
     "t": "write",
     "id": "onsite-cmp-logic3-w",
     "q": "Layer 3, the answers are wrong. Write the plan for both answers to the open question.",
     "starter": "Random errors:\nRepeatable errors:\nWhat I always do:",
     "hint": "Voting only helps if a second ask can give a different answer. What can you still do if it cannot?",
     "solution": "Random errors (a second ask can differ):\n1. Keep one stored answer per pair; the reverse pair reads it with the sign flipped. This also halves the calls.\n2. Ask an odd number of times (3) and take the majority. Cost: about three times the calls: 1,081 becomes about 3,243 for the heap.\n3. If it raises, retry up to a cap (2), then re-raise.\n4. Voting helps only when errors are independent between asks.\n\nRepeatable errors (same wrong answer for the same pair every time):\n1. Say it plainly: re-asking cannot help, so voting is wasted calls. A test: five votes return the same verdict as one call.\n2. State what is guaranteed: the result is the best according to the comparator, not according to the truth.\n3. Detect, not fix. Sample triples and look for x before y, y before z, z before x. A cycle is proof of a wrong answer. Or sort twice with the input shuffled and compare: a consistent comparator gives the same order.\n4. If the errors hit only close values, items out of place are within that gap. Verify the winner by comparing it with the others and look for one that beats it: n minus 1 extra calls.\n5. Add a different signal: a score per item, or a second judge, and compare scores instead of pairs.\n\nWhat I always do: count the calls, make the answer for (a, b) and (b, a) agree, and cap the retries.\n\nEdge cases: an even number of votes (a tie); an error on the same item every time (voting hides nothing, a second judge is needed); the cache memory is about the number of calls.",
     "why": "A cycle cannot be repaired by any algorithm, only found. The honest answer for repeatable errors is what you can guarantee and what you can detect.",
     "say": "**I'd ask whether the wrong answers repeat, because that decides everything.** If they are random, I keep one answer per pair and take three votes. If the same pair is always wrong, voting costs three times the calls and fixes nothing, so I'd say what I can guarantee, check for cycles by sampling triples, and bring a second signal like a score."
    },
    {
     "t": "p",
     "text": "**e) The code, for after you have talked it through.** Main function first, naming its helpers. In the round you would not type this; you would say it. Open it to check your numbers."
    },
    {
     "t": "write",
     "id": "onsite-cmp-code-w",
     "q": "Write top_k first, at the level you would say it aloud. Name the helpers, do not write them yet.",
     "starter": "def top_k(items, k, cmp, cost=\"calls\", flaky=False):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "If the comparator is flaky, wrap it. If k is big, sort. Otherwise the tournament for calls, pivot rounds for time.",
     "solution": "def top_k(items, k, cmp, cost=\"calls\", flaky=False):\n    \"\"\"Pick the method from k and from what is expensive.\"\"\"\n    if flaky:\n        cmp = make_safe(cmp)                      # cache + vote + retry; helps only when errors are random\n    if k * 2 >= len(items):\n        return merge_sort(items, cmp)[:k]         # k is big: sorting everything is the honest answer\n    if cost == \"calls\":\n        return tournament_top_k(items, k, cmp)    # fewest calls for a small k\n    return parallel_top_k(items, k, cmp)[0]       # cost == \"time\": fewest rounds\n\n# helpers, defined in the workbench below:\n#   make_safe(cmp)                     one stored answer per pair, an odd vote, a retry cap\n#   merge_sort(items, cmp)             the baseline, strict less-than, so it is stable\n#   tournament_top_k(items, k, cmp)    a bracket, replay one path per winner\n#   parallel_top_k(items, k, cmp)      pivot rounds, one thread pool\n",
     "why": "It reads like the plan: wrap if flaky, sort if k is big, then choose by what is expensive. Each helper has one job and a number attached from layer 1 or 2.",
     "say": "I'd write the dispatcher first because it is the plan in code. **Wrap the comparator if it is flaky, sort if k is big, then pick the tournament when calls are the cost and pivot rounds when time is.** The helpers are a counter, a bracket and a pool, and I'd write them in that order."
    },
    {
     "t": "predict",
     "id": "onsite-comparator-pred",
     "code": "from functools import cmp_to_key\n\ncalls = [0]\n\ndef cmp(a, b):\n    calls[0] += 1\n    return a - b\n\nsorted([1, 2, 3, 4, 5], key=cmp_to_key(cmp))\nprint(calls[0])\ncalls[0] = 0\nsorted([5, 4, 3, 2, 1], key=cmp_to_key(cmp))\nprint(calls[0])\ncalls[0] = 0\nsorted([3, 1, 4, 1, 5, 9, 2, 6], key=cmp_to_key(cmp))\nprint(calls[0])",
     "q": "How many calls does Python's sort make in each case? (CPython 3.12.)",
     "answer": "4\n4\n15",
     "why": "Timsort looks for runs. Already in order, or strictly descending, is one run, found with n - 1 = 4 comparisons and no more. The eight shuffled numbers need 15, between n - 1 = 7 and n log2 n = 24. So 'fewest calls' depends on the input: say that out loud, and do not quote n log n as if it were the only number."
    },
    {
     "t": "problem",
     "id": "onsite-comparator-p",
     "title": "Top-k with a slow or faulty comparator",
     "source": "Mercor-style algorithms discussion, rebuilt (talk first, the code is for after)",
     "d": "medium",
     "lc": "kth-largest-element-in-an-array",
     "yt": [
      "XEmy13g1Qxc",
      "NeetCode",
      19
     ],
     "minutes": 45,
     "why": "Counting comparisons, then handling a comparator that lies, then hiding latency. All three are things an applied AI engineer does with a model used as a judge. Say the answer aloud first; open the solution to check it.",
     "statement": "You are given a list of items and a function compare(a, b) that returns a negative number if a ranks before b, a positive number if after, and zero for a tie. Return the best k items in order, using as few calls to compare as you can.\n\nThen: the function sometimes gives wrong or inconsistent answers, and sometimes raises. Make the result trustworthy, and say what you can and cannot fix.\n\nThen: each call takes a long time (think of a model call). Reduce the total time, not the number of calls.",
     "examples": [
      {
       "input": "1000 distinct numbers, k = 5, compare = a - b",
       "output": "merge sort 8,715 calls, heap 1,081, tournament 1,044",
       "note": "Counted by the Counted wrapper below. Sorting everything is about eight times the work."
      },
      {
       "input": "64 items, k = 3, each call sleeps 20 ms",
       "output": "sequential heap about 1.5 s, parallel rounds about 0.2 s in 5 rounds",
       "note": "Timings vary a little by machine; the round count is fixed by the seed."
      },
      {
       "input": "compare is wrong on every 4th call",
       "output": "sorted correctly with 3 votes per pair",
       "note": "No 3 consecutive calls contain two wrong ones, so the majority is right. A repeatable error is different: voting changes nothing."
      }
     ],
     "constraints": [
      "standard library only",
      "items can be compared only through compare",
      "compare may be slow, noisy or raise",
      "k much smaller than n"
     ],
     "starter": "def top_k(items, k, compare):\n    ...",
     "hints": [
      "Level 1: wrap compare in a class that counts calls. You cannot improve what you have not measured.",
      "Level 2: a min-heap of size k keeps the best k so far, but heapq has no comparator, so wrap each item in a class with __lt__ that calls compare. A tournament bracket is the version that uses the fewest calls for a small k.",
      "Level 3: for a random-error comparator keep a dict of answers per pair and reuse it for the reversed pair. For slow calls, one pivot round compares everything to the pivot at once with a thread pool."
     ],
     "solution": "import heapq\nimport random\nimport time\nfrom concurrent.futures import ThreadPoolExecutor\n\n\nclass Counted:\n    \"\"\"Wraps a comparator: cmp(a, b) < 0 means a ranks before b. Counts every call.\"\"\"\n    def __init__(self, cmp):\n        self.cmp, self.calls = cmp, 0\n\n    def __call__(self, a, b):\n        self.calls += 1\n        return self.cmp(a, b)\n\n\ndef merge_sort(items, cmp):\n    if len(items) <= 1:\n        return list(items)\n    mid = len(items) // 2\n    left, right = merge_sort(items[:mid], cmp), merge_sort(items[mid:], cmp)\n    out, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if cmp(right[j], left[i]) < 0:     # strict, so equal items keep their order\n            out.append(right[j]); j += 1\n        else:\n            out.append(left[i]); i += 1\n    return out + left[i:] + right[j:]\n\n\nclass Item:                                 # heapq needs __lt__, so route it to cmp\n    def __init__(self, v, cmp):\n        self.v, self.cmp = v, cmp\n\n    def __lt__(self, other):\n        return self.cmp(self.v, other.v) < 0\n\n\ndef heap_top_k(items, k, cmp):\n    \"\"\"Best k (those that rank first). A min-heap of size k holds the best so far.\"\"\"\n    heap = []                               # root = the worst of the k kept\n    for v in items:\n        # the heap wants the WORST at the root, so invert the comparison\n        wrapped = Item(v, lambda a, b: cmp(b, a))\n        if len(heap) < k:\n            heapq.heappush(heap, wrapped)\n        elif cmp(v, heap[0].v) < 0:         # v beats the worst kept: swap it in\n            heapq.heapreplace(heap, wrapped)\n    return merge_sort([x.v for x in heap], cmp)\n\n\ndef tournament_top_k(items, k, cmp):\n    \"\"\"Build a bracket once (n-1 calls). Each next winner replays one path (about log n calls).\"\"\"\n    n = len(items)\n    size = 1\n    while size < n:\n        size *= 2\n    tree = [None] * (2 * size)              # tree[size + i] = leaf i holds an index, or None\n    for i in range(n):\n        tree[size + i] = i\n\n    def play(a, b):                         # the index that ranks first; None is a bye\n        if a is None or b is None:\n            return b if a is None else a\n        return a if cmp(items[a], items[b]) <= 0 else b\n\n    for node in range(size - 1, 0, -1):\n        tree[node] = play(tree[2 * node], tree[2 * node + 1])\n    out = []\n    for _ in range(min(k, n)):\n        w = tree[1]\n        out.append(items[w])\n        node = size + w\n        tree[node] = None                   # remove the winner, replay only its path\n        node //= 2\n        while node >= 1:\n            tree[node] = play(tree[2 * node], tree[2 * node + 1])\n            node //= 2\n    return out\n\n\ndef make_safe(cmp, votes=3, retries=2):\n    \"\"\"Wrap a flaky comparator: cache one answer per pair, vote on noise, retry on errors.\"\"\"\n    cache = {}\n\n    def safe(a, b):\n        if a == b:\n            return 0\n        key = (a, b)\n        if key in cache:\n            return cache[key]\n        if (b, a) in cache:\n            return -cache[(b, a)]           # the reverse call is free and always consistent\n        score = 0\n        for _ in range(votes):              # odd number of votes, so there is no tie\n            for attempt in range(retries + 1):\n                try:\n                    r = cmp(a, b)\n                    break\n                except Exception:\n                    if attempt == retries:\n                        raise\n            score += 1 if r > 0 else -1 if r < 0 else 0\n        cache[key] = 1 if score > 0 else -1 if score < 0 else 0\n        return cache[key]\n    return safe\n\n\ndef parallel_top_k(items, k, cmp, workers=8):\n    \"\"\"Each round compares everything to one pivot at the same time, so a round costs one slow call.\"\"\"\n    rng = random.Random(0)\n    best, rest, rounds = [], list(range(len(items))), 0   # work with positions, so equal values stay distinct\n    with ThreadPoolExecutor(max_workers=workers) as pool:\n        while len(best) < k and rest:\n            p = rest[rng.randrange(len(rest))]\n            others = [i for i in rest if i != p]\n            verdicts = list(pool.map(lambda i: cmp(items[i], items[p]), others))  # one parallel round\n            rounds += 1\n            ahead = [i for i, v in zip(others, verdicts) if v < 0]\n            behind = [i for i, v in zip(others, verdicts) if v >= 0]\n            if len(ahead) >= k - len(best):\n                rest = ahead                # the rest of the top-k is all inside `ahead`\n            else:\n                best += ahead + [p]         # all of these make it; look for the rest behind\n                rest = behind\n    return merge_sort([items[i] for i in best], cmp), rounds\n\n\ndef find_intransitive(items, cmp, tries=200, seed=0):\n    \"\"\"Sample triples and look for x > y > z > x. A cycle cannot be repaired, only found.\"\"\"\n    rng = random.Random(seed)\n    for _ in range(tries):\n        a, b, c = rng.sample(items, 3)\n        for x, y, z in ((a, b, c), (a, c, b)):\n            if cmp(x, y) < 0 and cmp(y, z) < 0 and cmp(z, x) < 0:\n                return x, y, z\n    return None\n\n\ndef batched_best(items, cmp_batch):\n    \"\"\"A bracket in rounds. Each round is ONE batched call holding all of that round's matches.\"\"\"\n    alive, rounds = list(range(len(items))), 0\n    while len(alive) > 1:\n        pairs = [(alive[i], alive[i + 1]) for i in range(0, len(alive) - 1, 2)]\n        verdicts = cmp_batch([(items[a], items[b]) for a, b in pairs])\n        winners = [a if v <= 0 else b for (a, b), v in zip(pairs, verdicts)]\n        if len(alive) % 2:\n            winners.append(alive[-1])          # the odd one out gets a bye\n        alive, rounds = winners, rounds + 1\n    return items[alive[0]], rounds\n\n\ndef all_pairs_winners(items, groups, cmp_batch):\n    \"\"\"ONE batch holds every pair inside every group. The winner of a group is the item with the most wins.\"\"\"\n    pairs = [(a, b) for g in groups for i, a in enumerate(g) for b in g[i + 1:]]\n    verdicts = cmp_batch([(items[a], items[b]) for a, b in pairs])\n    wins = dict.fromkeys((i for g in groups for i in g), 0)\n    for (a, b), v in zip(pairs, verdicts):\n        wins[a if v <= 0 else b] += 1\n    return [max(g, key=wins.get) for g in groups], len(pairs)\n\n\ndef two_round_best(items, cmp_batch, m=32):\n    \"\"\"The best one in 2 rounds: all pairs inside groups of m, then all pairs among the group winners.\"\"\"\n    ids = list(range(len(items)))\n    groups = [ids[i:i + m] for i in range(0, len(ids), m)]\n    winners, calls1 = all_pairs_winners(items, groups, cmp_batch)      # round 1\n    final, calls2 = all_pairs_winners(items, [winners], cmp_batch)     # round 2\n    return items[final[0]], calls1 + calls2\n\n\ndef top_k(items, k, cmp, cost=\"calls\", flaky=False):\n    \"\"\"Pick the method from k and from what is expensive.\"\"\"\n    if flaky:\n        cmp = make_safe(cmp)                      # cache + vote + retry; helps only when errors are random\n    if k * 2 >= len(items):\n        return merge_sort(items, cmp)[:k]         # k is big: sorting everything is the honest answer\n    if cost == \"calls\":\n        return tournament_top_k(items, k, cmp)    # fewest calls for a small k\n    return parallel_top_k(items, k, cmp)[0]       # cost == \"time\": fewest rounds\n",
     "complexity": "merge sort: about n log2 n - 1.44 n calls. Heap of size k: about n on random input, up to n log2 k. Tournament: n - 1 + (k - 1) * ceil(log2 n). Pivot rounds: about 2n calls in a few rounds. Two-round best: about n * m / 2 + (n / m)^2 / 2 calls in 2 rounds for groups of m.",
     "explain": [
      "Counted is a thin wrapper. It is also how you would measure calls to a paid model: count first, then decide.",
      "merge_sort is the baseline. Its merge uses a strict test (`< 0`) so equal items keep their input order. That is stability, and the interviewer may ask.",
      "heap_top_k keeps the best k seen so far. heapq pops the smallest, so the comparison is inverted and the root is the worst of the kept items. A new item enters only if it beats that root.",
      "tournament_top_k builds a bracket once: n - 1 calls. When a winner leaves, only the matches on its path to the root change, about log2 n calls. That is why it wins when k is small.",
      "make_safe fixes a random comparator before any algorithm touches it: one stored answer per pair, the reverse pair answered from the same entry, a vote on noise and a retry cap on errors. It cannot fix a repeatable error, and the test shows five votes returning the same verdict.",
      "parallel_top_k trades extra calls for fewer rounds. Each round compares everything with one pivot at the same time.",
      "find_intransitive samples triples and looks for x ahead of y, y ahead of z, z ahead of x. A cycle cannot be repaired, only found.",
      "batched_best is the bracket in rounds: 1000 items take 10 rounds and 999 comparisons in total, 500 in the first round. two_round_best uses 15,900 calls to do it in 2 rounds.",
      "top_k is the plan in one function: wrap if flaky, sort if k is big, then choose by what is expensive.",
      "The measured output: merge sort 8715, heap 1081, tournament 1044 calls on 1000 numbers and k = 5."
     ],
     "tests": "rng = random.Random(1)\ndata = rng.sample(range(10000), 1000)\nby_value = lambda a, b: a - b\nwant = sorted(data)[:5]\n\nc = Counted(by_value); assert merge_sort(data, c) == sorted(data); print(\"merge sort all 1000:\", c.calls)\nc = Counted(by_value); assert heap_top_k(data, 5, c) == want; print(\"heap top 5:        \", c.calls)\nc = Counted(by_value); assert tournament_top_k(data, 5, c) == want; print(\"tournament top 5:  \", c.calls)\n\ncalls = {\"n\": 0}\ndef noisy(a, b):                            # every 4th call is wrong\n    calls[\"n\"] += 1\n    return -(a - b) if calls[\"n\"] % 4 == 0 else a - b\nsafe = make_safe(noisy, votes=3)\nassert merge_sort(list(range(20, 0, -1)), safe) == list(range(1, 21))\nprint(\"noisy comparator fixed by votes\")\nflaky_state = {\"n\": 0}\ndef sometimes_errors(a, b):\n    flaky_state[\"n\"] += 1\n    if flaky_state[\"n\"] % 3 == 0:\n        raise TimeoutError(\"slow upstream\")\n    return a - b\ns2 = make_safe(sometimes_errors, votes=1, retries=2)\nassert merge_sort([5, 3, 9, 1], s2) == [1, 3, 5, 9]\nprint(\"flaky comparator survived\")\n\ndef slow(a, b):\n    time.sleep(0.02)\n    return a - b\nitems = rng.sample(range(1000), 64)\nt = time.perf_counter(); seq = heap_top_k(items, 3, slow); t_seq = time.perf_counter() - t\nt = time.perf_counter(); par, rounds = parallel_top_k(items, 3, slow, workers=64); t_par = time.perf_counter() - t\nassert seq == par == sorted(items)[:3]\nprint(\"sequential heap about %.1f s, parallel about %.1f s in %d rounds\" % (t_seq, t_par, rounds))\n\nbeats = {(\"rock\", \"scissors\"), (\"scissors\", \"paper\"), (\"paper\", \"rock\")}\nrps = lambda a, b: -1 if (a, b) in beats else 1 if (b, a) in beats else 0\nprint(\"cycle in rock/paper/scissors:\", find_intransitive([\"rock\", \"paper\", \"scissors\"], rps))\nassert find_intransitive(list(range(30)), by_value) is None\nprint(\"no cycle in a plain number order\")\n\nbatches = []\ndef cmp_batch(pairs):\n    batches.append(len(pairs))\n    return [a - b for a, b in pairs]\nbest, rounds = batched_best(rng.sample(range(10000), 1000), cmp_batch)\nassert rounds == 10 and sum(batches) == 999\nprint(\"bracket of 1000: %d rounds, %d comparisons in total, first round holds %d\" % (rounds, sum(batches), batches[0]))\n\ncounted = Counted(by_value); assert top_k(data, 5, counted) == want\nassert top_k(data, 5, by_value, cost=\"time\") == want and top_k(data, 600, by_value) == sorted(data)[:600]\nprint(\"top_k picks:\", counted.calls, \"calls for k = 5 (tournament)\")\n\ndef repeatable(a, b):                       # wrong whenever the values are close, the same way every time\n    return -(a - b) if abs(a - b) < 3 else a - b\nvoted = make_safe(repeatable, votes=5)\nassert all(voted(a, b) == (1 if repeatable(a, b) > 0 else -1) for a in range(12) for b in range(12) if a != b)\nprint(\"voting on a repeatable error changes nothing\")\n\nbatches = []\ndef cmp_batch2(pairs):\n    batches.append(len(pairs))\n    return [a - b for a, b in pairs]\nbest, total = two_round_best(rng.sample(range(10000), 1000), cmp_batch2)\nassert len(batches) == 2\nprint(\"two rounds for the best of 1000: %d calls (%d + %d)\" % (total, batches[0], batches[1]))\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why strict less-than in the merge?",
       "a": "So equal items keep their input order. With less-than-or-equal an equal item from the right half would jump ahead of its twin on the left. Stability matters if the order of ties is visible."
      },
      {
       "q": "Why invert the comparison in the heap?",
       "a": "heapq is a min-heap, and the root must be the worst of the kept k, the one to throw out first. Inverting makes the worst rank first in the heap's own order."
      },
      {
       "q": "Why cache (a, b) and return the negative for (b, a)?",
       "a": "A random-error comparator can say a before b and then b before a. One stored answer gives a consistent order and halves the calls. The cost is memory about equal to the number of calls."
      },
      {
       "q": "Why an odd number of votes?",
       "a": "No ties. With an even count you need a rule for 2 against 2. More votes help only when errors are independent between asks."
      },
      {
       "q": "Why does the tournament give each next winner only about log2 n calls?",
       "a": "The bracket already holds every earlier result. Removing the winner changes only the matches on its path to the root: ceil(log2 n) matches."
      },
      {
       "q": "Why does the pivot-round code work with positions and not values?",
       "a": "Equal values must stay distinct. Positions make 'is this the pivot' exact, and the final sort still compares through the same comparator."
      },
      {
       "q": "The test says five votes change nothing. Why is that useful?",
       "a": "It shows the limit of the fix in a runnable line. If I say 'voting does not help a repeatable error', I can point at the line that proves it."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Kth Largest Element in a Stream",
       "d": "easy",
       "lc": "kth-largest-element-in-a-stream",
       "yt": [
        "hOjcdrqMoQ8",
        "NeetCode",
        12
       ],
       "why": "A heap of size k, the small-k answer, with the comparator hidden inside."
      },
      {
       "n": "Sort an Array",
       "d": "medium",
       "lc": "sort-an-array",
       "yt": [
        "MsYZSinhuFo",
        "NeetCodeIO",
        18
       ],
       "why": "Write merge sort by hand and count the calls. The first layer of the talk track starts here."
      },
      {
       "n": "Kth Largest Element in an Array",
       "d": "medium",
       "lc": "kth-largest-element-in-an-array",
       "yt": [
        "XEmy13g1Qxc",
        "NeetCode",
        19
       ],
       "why": "Heap of size k against quickselect: the two answers to 'top k without sorting'."
      },
      {
       "n": "Merge k Sorted Lists",
       "d": "hard",
       "lc": "merge-k-sorted-lists",
       "yt": [
        "q5a5OiGbT6Q",
        "NeetCode",
        11
       ],
       "why": "The harder follow-up: a heap of heads is a tournament in disguise, n log k calls. It is the bridge to the bracket."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-exchange",
   "title": "2. Exchange rates",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A list of quotes between currency pairs and the question 'how much of B do I get for one A'. It is a graph with a weight on each edge. Part 1 multiplies along a path. Part 2 asks for the best path, which brings in logarithms and Bellman-Ford, then arbitrage, then stale or missing quotes. One report mentions this question and no more, so the follow-ups below are the ones the problem leads to, not reported wording."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** The question that matters most: is the reverse rate always one over the rate, or a separate quote with a spread? It decides whether the best path matters at all."
    },
    {
     "t": "write",
     "id": "onsite-ex-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: the input shape, the queries, the reverse rate, many queries or few. Errors: no path, unknown currency, bad rate, loops that gain, stale or missing quotes. Scope: fees, amounts, live updates, size.",
     "solution": "1. Primary capabilities\n- What does a quote look like? Likely (from, to, rate): one unit of from buys rate units of to.\n- Is the reverse rate one over the rate, or a separate quote? Likely a separate quote with a spread; if it is missing, one over the rate.\n- Which queries: one conversion, the best rate, or both? Likely both, in two parts.\n- How many currencies and how many queries? Likely a few hundred currencies; a few queries first, then a million.\n\n2. Error handling\n- No chain between two currencies, or an unknown currency? Likely None, never 0.\n- A rate that is zero or negative? Reject it.\n- Quotes that disagree so a loop makes money? Likely yes: that is arbitrage. Detect and report it, since no best rate exists.\n- Quotes that are stale or missing? Likely quotes carry a timestamp, and old ones are dropped.\n\n3. Scope boundaries\n- Fees and minimum amounts? Percentage fees fold into the rate; a fixed fee depends on the amount and is out.\n- Live updates? Out of scope; follow-up.\n- Do I write code, or talk? Talk.",
     "why": "The reverse-rate question decides whether the best path matters. The query count decides search against precompute. The arbitrage and staleness questions are the two failure modes the problem leads to.",
     "say": "**Three buckets again: what it must do, what goes wrong, where it stops.** I'd ask first whether the reverse rate is one over the rate or a separate quote, because a spread is what makes the best path matter. Then what to return with no path (None, never zero), what to do about loops that gain, and about stale quotes."
    },
    {
     "t": "write",
     "id": "onsite-ex-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "Part 1, part 2, no path, arbitrage, stale quotes, many queries, out of scope.",
     "solution": "1. convert(src, dst) returns the product of rates along a chain of quotes, the chain with the fewest hops. Test: USD to JPY is 144.4 (0.76 * 190).\n2. No chain, or an unknown currency, returns None. Test: USD to CAD is None.\n3. A missing reverse quote is one over the rate; a given reverse quote is kept. Test: JPY to GBP is 1 / 190 = 0.00526.\n4. best_rate(src, dst) returns the largest product over any chain. Test: USD to JPY is 145.35 (0.9 * 0.85 * 190), above the 144.4 of the direct route.\n5. If a loop of quotes multiplies to more than 1, say so and give no rate. Test: GBP to USD at 1.40 reports arbitrage.\n6. Quotes older than a maximum age are dropped before searching. Test: with GBP to JPY 90 old and a maximum age of 30, USD to JPY is None.\n7. For many queries, one precompute answers all pairs. Test: the table agrees with best_rate on the example.\n8. Out of scope: fixed fees, minimum amounts, live updates, money amounts.",
     "why": "Requirement 4 is why a plain search is not enough. 5 is why the answer is a flag. 6 and 7 are the two follow-ups that come next.",
     "say": "From your answers I get seven requirements. **A conversion, no path means None, a best rate, arbitrage reported, stale quotes dropped, and all pairs for many queries.** I'd put the example numbers next to them: 144.4 for the fewest hops, 145.35 for the best."
    },
    {
     "t": "p",
     "text": "**c) Entities.**"
    },
    {
     "t": "write",
     "id": "onsite-ex-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "Quote: \nCurrency: \nGraph: \nQueue entry: \nDistance map: \nEdge list: \nTable (all pairs): \nMoney, exchange: ",
     "hint": "Which nouns carry a rule? Which are only a name or a number?",
     "solution": "Quote: keep. A tuple (from, to, rate, timestamp). The timestamp is what lets us drop stale ones.\nCurrency: drop as a class. It is a node name, a string.\nGraph: keep. A dict of dicts, g[a][b] = rate. A given reverse quote is kept, not overwritten.\nQueue entry: keep. (currency, product so far) in a deque, with a set of seen currencies.\nDistance map: keep. dist[c] is the smallest sum of -log(rate) found so far; a missing path is infinity.\nEdge list: keep. A flat list of (a, b, -log rate) that Bellman-Ford sweeps V minus 1 times.\nTable: keep. For many queries, table[a][b] built once by Floyd-Warshall.\nMoney, exchange: drop. Nothing in this problem needs an amount or a service object.",
     "why": "The graph is the model. The distance map and the edge list are what turn a product into a shortest-path problem.",
     "say": "I'd keep the quote with its timestamp, the graph as a dict of dicts, and for the best rate a distance map and a flat edge list. **A currency is only a name, so it is not a class.** For a million queries I'd add one table of all pairs."
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.**"
    },
    {
     "t": "write",
     "id": "onsite-ex-logic-w",
     "q": "Write the steps for convert, then best_rate, then arbitrage, then many queries, then stale or missing quotes. Put numbers on each.",
     "starter": "convert:\nbest_rate:\nArbitrage:\nMany queries:\nStale or missing:",
     "hint": "Part 1 multiplies along a path. A product of rates is a sum of logs. Count the cost of each version.",
     "solution": "convert (fewest hops):\n1. If either currency is unknown, return None.\n2. Start a queue with (src, 1.0) and a set holding src.\n3. Take an entry. If it is dst, return the product.\n4. For each neighbour not yet seen, mark it seen and queue (neighbour, product * rate).\n5. Cost: O(V + E) a query. It finds the fewest hops, not the best rate: 144.4 here, while the two-hop route to GBP gives 0.765, which beats the direct 0.76.\n\nbest_rate, slow version: try every simple path and keep the largest product. Exponential in V. It is the check on small inputs.\n\nbest_rate, Bellman-Ford:\n1. Weight each edge -log(rate). A product becomes a sum, and the largest product becomes the smallest sum. USD to EUR to GBP: -log(0.9) - log(0.85) = 0.2679; exp(-0.2679) = 0.765.\n2. A rate above 1 is a negative weight, so Dijkstra is not allowed. Bellman-Ford is.\n3. Relax every edge V - 1 times. A best path has at most V - 1 edges. Stop early when a pass changes nothing.\n4. Return exp(-distance). Cost: O(V * E): 300 currencies with 90,000 quotes is 27 million steps a query.\n\nArbitrage:\n1. Do one more pass. If any edge still improves, some loop has a negative total, so its rates multiply to more than 1.\n2. Report the flag and no rate: there is no best rate, you could loop forever. With GBP to USD at 1.40, USD to EUR to GBP to USD is 0.9 * 0.85 * 1.4 = 1.07, so each lap earns 7 percent.\n3. Use a small tolerance (1e-12) so float rounding is not read as a gain.\n\nMany queries:\n1. Floyd-Warshall on the -log rates: O(V^3) once. For V = 300 that is 27 million steps.\n2. Each query is then a lookup. A million queries with Bellman-Ford would be 27 trillion steps; with the table, 27 million plus a million lookups.\n3. A currency whose own distance is below zero is on a profitable loop.\n\nStale or missing quotes:\n1. Each quote has a timestamp. Drop any older than a maximum age before building the graph.\n2. A missing quote is a missing edge; the best path may now go another way, or there may be none: return None.\n3. Do not invent a rate for a missing pair, except one over the reverse if we agreed that.\n4. Take one snapshot of the quotes per query, so a refresh in the middle cannot mix old and new.\n\nEdge cases: src equals dst (1.0); a zero or negative rate (reject); a currency with no quotes; two quotes for the same pair (keep the better, or the latest).",
     "why": "Two ideas carry the whole problem: log turns a product into a sum, and one extra Bellman-Ford pass turns 'no best rate' into a detectable fact.",
     "say": "**This is a graph: currencies are nodes and each quote is an edge with a rate.** For one conversion I search and multiply along the way, and I say it finds the fewest hops, not the best rate. For the best rate I take the negative log so the product is a sum and use Bellman-Ford, since some edges are negative. One more pass that still improves means a loop that makes money, so there is no best rate and I report the loop."
    },
    {
     "t": "p",
     "text": "**e) The code, for after.** Main function first."
    },
    {
     "t": "write",
     "id": "onsite-ex-code-w",
     "q": "Write exchange() first. Name the helpers, do not write them yet.",
     "starter": "def exchange(quotes, src, dst, best=True, now=None, max_age=None):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "Drop stale quotes, build the graph, then either the search or the best rate.",
     "solution": "def exchange(quotes, src, dst, best=True, now=None, max_age=None):\n    \"\"\"The whole answer in one place: drop stale quotes, build the graph, then a search or the best rate.\"\"\"\n    if max_age is not None:\n        quotes = fresh(quotes, now, max_age)\n    g = build(quotes)\n    return best_rate(g, src, dst) if best else (convert(g, src, dst), False)\n\n# helpers, defined in the workbench below:\n#   fresh(quotes, now, max_age)   drop stale quotes\n#   build(quotes)                 dict of dicts, adds the reverse when it is missing\n#   convert(g, src, dst)          breadth-first, carries the product\n#   best_rate(g, src, dst)        Bellman-Ford on -log(rate), returns (rate, arbitrage)\n#   floyd(g)                      all pairs for many queries\n",
     "why": "The dispatcher has one decision per line: stale, graph, which question. A reviewer can read the plan without reading a helper.",
     "say": "I'd write exchange first: **drop the stale quotes, build the graph, then either a search or the best rate.** The helpers are the filter, the builder, a breadth-first search and Bellman-Ford. The all-pairs table is for when someone says a million queries."
    },
    {
     "t": "predict",
     "id": "onsite-exchange-pred",
     "code": "import math\n\nw = -math.log(0.9) - math.log(0.85)\nprint(round(w, 4), round(math.exp(-w), 3))",
     "q": "This is the log trick for the chain USD to EUR to GBP. What does it print?",
     "answer": "0.2679 0.765",
     "why": "The two edge weights add to 0.2679. Taking exp of the negative gives back the product 0.9 * 0.85 = 0.765. A sum of logs is a log of a product, so shortest sum means largest product."
    },
    {
     "t": "problem",
     "id": "onsite-exchange-p",
     "title": "Exchange rates across currency pairs",
     "source": "Mercor-style algorithms discussion, rebuilt (talk first, the code is for after)",
     "d": "medium",
     "lc": "evaluate-division",
     "yt": [
      "Uei1fwDoyKk",
      "NeetCodeIO",
      18
     ],
     "minutes": 30,
     "why": "A graph with weighted edges, a product turned into a sum with logs, and the idea of a negative cycle. All short and all things they ask to hear. Say it aloud first; open the solution to check it.",
     "statement": "You are given quotes (from, to, rate), where one unit of `from` buys `rate` units of `to`. Part 1. Write convert(src, dst) that returns how many units of dst one unit of src buys by following quotes, or None if there is no chain.\n\nPart 2. Return the best rate you can get for src to dst over any chain of quotes. If a loop of quotes lets you end with more than you started with, say so.\n\nPart 3. Quotes carry a timestamp. Drop the old ones. Then answer a million queries.",
     "examples": [
      {
       "input": "USD>GBP 0.76 direct, USD>EUR 0.90 then EUR>GBP 0.85, GBP>JPY 190",
       "output": "fewest hops USD>JPY = 144.4; best = 145.35",
       "note": "The two-hop route to GBP gives 0.765, which beats the direct 0.76."
      },
      {
       "input": "USD>CAD with no chain between them",
       "output": "None",
       "note": "Not 0. Report a missing path as missing."
      },
      {
       "input": "GBP>USD quoted 1.40 instead of 1.28",
       "output": "arbitrage found, no best rate",
       "note": "USD>EUR>GBP>USD multiplies to 0.9 * 0.85 * 1.4 = 1.07, so every lap earns 7 percent."
      }
     ],
     "constraints": [
      "standard library only",
      "rates are positive floats",
      "a few hundred currencies",
      "both directions are quoted separately"
     ],
     "starter": "def convert(quotes, src, dst):\n    ...\n\ndef best_rate(quotes, src, dst):\n    ...",
     "hints": [
      "Level 1: currencies are nodes and quotes are edges. A conversion along a path multiplies the rates on its edges.",
      "Level 2: part 1 is a breadth-first search where each queue entry carries the product so far. Mark a currency as seen when you queue it.",
      "Level 3: part 2, take the negative log of each rate. The best product becomes the smallest sum. Relax every edge V - 1 times (Bellman-Ford). If another pass still improves something, there is a negative cycle."
     ],
     "solution": "import math\nfrom collections import deque\n\n\ndef build(quotes):\n    \"\"\"quotes: (from, to, rate) meaning 1 `from` buys `rate` of `to`. Adds the inverse edge too.\"\"\"\n    g = {}\n    for a, b, rate in quotes:\n        if rate <= 0:\n            raise ValueError(\"rate must be positive\")\n        g.setdefault(a, {})[b] = rate\n        g.setdefault(b, {}).setdefault(a, 1 / rate)   # an explicit reverse quote is kept, not overwritten\n    return g\n\n\ndef convert(g, src, dst):\n    \"\"\"Part 1: any chain of quotes from src to dst (the fewest hops). None if there is none.\"\"\"\n    if src not in g or dst not in g:\n        return None\n    seen = {src}\n    queue = deque([(src, 1.0)])                       # (currency, product of rates so far)\n    while queue:\n        cur, value = queue.popleft()\n        if cur == dst:\n            return value\n        for nxt, rate in g[cur].items():\n            if nxt not in seen:\n                seen.add(nxt)\n                queue.append((nxt, value * rate))\n    return None\n\n\ndef best_path_slow(g, src, dst, seen=None, value=1.0):\n    \"\"\"First version: try every simple path and keep the largest product. Exponential.\"\"\"\n    seen = (seen or set()) | {src}\n    if src == dst:\n        return value\n    best = None\n    for nxt, rate in g[src].items():\n        if nxt not in seen:\n            got = best_path_slow(g, nxt, dst, seen, value * rate)\n            if got is not None and (best is None or got > best):\n                best = got\n    return best\n\n\ndef best_rate(g, src, dst):\n    \"\"\"Part 2: the largest product. Bellman-Ford on -log(rate). Returns (rate, arbitrage).\"\"\"\n    if src not in g or dst not in g:\n        return None, False                            # an unknown currency is \"no path\", not a crash\n    dist = {c: math.inf for c in g}                   # shortest -log distance = best rate\n    dist[src] = 0.0\n    edges = [(a, b, -math.log(r)) for a, nbrs in g.items() for b, r in nbrs.items()]\n    for _ in range(len(g) - 1):                       # a best path has at most V-1 edges\n        changed = False\n        for a, b, w in edges:\n            if dist[a] + w < dist[b] - 1e-12:         # tolerance, so float noise is not a gain\n                dist[b] = dist[a] + w\n                changed = True\n        if not changed:\n            break\n    for a, b, w in edges:                             # one more pass: any gain left means a loop\n        if dist[a] + w < dist[b] - 1e-9:              # that multiplies to more than 1\n            return None, True\n    return (None if dist[dst] == math.inf else math.exp(-dist[dst])), False\n\n\ndef fresh(quotes, now, max_age):\n    \"\"\"Drop stale quotes. A quote here is (from, to, rate, timestamp). Returns (from, to, rate).\"\"\"\n    return [(a, b, r) for a, b, r, ts in quotes if now - ts <= max_age]\n\n\ndef floyd(g):\n    \"\"\"All pairs at once on -log(rate): O(V^3) once, then each query is a lookup.\"\"\"\n    names = list(g)\n    d = {a: {b: (0.0 if a == b else math.inf) for b in names} for a in names}\n    for a, nbrs in g.items():\n        for b, r in nbrs.items():\n            d[a][b] = min(d[a][b], -math.log(r))\n    for k in names:\n        for i in names:\n            if d[i][k] == math.inf:\n                continue\n            for j in names:\n                if d[i][k] + d[k][j] < d[i][j] - 1e-12:\n                    d[i][j] = d[i][k] + d[k][j]\n    loops = [c for c in names if d[c][c] < -1e-9]          # a currency that can reach itself with a gain\n    table = {a: {b: (None if d[a][b] == math.inf else math.exp(-d[a][b])) for b in names} for a in names}\n    return table, loops\n\n\ndef exchange(quotes, src, dst, best=True, now=None, max_age=None):\n    \"\"\"The whole answer in one place: drop stale quotes, build the graph, then a search or the best rate.\"\"\"\n    if max_age is not None:\n        quotes = fresh(quotes, now, max_age)\n    g = build(quotes)\n    return best_rate(g, src, dst) if best else (convert(g, src, dst), False)\n",
     "complexity": "convert: O(V + E) per query. best_path_slow: exponential, only for checking. best_rate: O(V * E) with O(V + E) space. floyd: O(V^3) once, then O(1) a query, and it finds currencies on a profitable loop.",
     "explain": [
      "build stores a dict of dicts. If the reverse quote is not given, it adds 1 / rate. If it is given, it keeps it, because a real reverse quote has a spread.",
      "convert is a breadth-first search that carries the product. It finds the chain with the fewest hops, not the best rate. Say that distinction out loud.",
      "best_path_slow tries every simple path. It is the honest first version and it is how you check the fast one on small inputs.",
      "best_rate uses -log(rate) as the weight. A rate above 1 gives a negative weight, which is why Dijkstra is not allowed. It now returns None for an unknown currency instead of raising.",
      "Bellman-Ford relaxes every edge V - 1 times, and one more pass finds a negative cycle. The small tolerance stops float rounding from looking like a gain.",
      "fresh drops quotes older than the maximum age; with GBP to JPY 90 old and a limit of 30, USD to JPY has no path.",
      "floyd computes every pair once. A currency whose own distance is negative is on a profitable loop; with GBP to USD at 1.40 it lists EUR, GBP, JPY and USD, since JPY connects back to GBP.",
      "exchange is the plan: drop stale quotes, build, then search or best rate."
     ],
     "tests": "quotes = [(\"USD\", \"EUR\", 0.90), (\"EUR\", \"USD\", 1.10), (\"EUR\", \"GBP\", 0.85), (\"GBP\", \"EUR\", 1.15),\n          (\"USD\", \"GBP\", 0.76), (\"GBP\", \"USD\", 1.28), (\"GBP\", \"JPY\", 190.0), (\"CHF\", \"CAD\", 1.5)]\ng = build(quotes)\nprint(\"fewest hops USD>JPY:\", round(convert(g, \"USD\", \"JPY\"), 2))\nprint(\"USD>CAD:            \", convert(g, \"USD\", \"CAD\"))\nprint(\"JPY>GBP (inverse):  \", round(convert(g, \"JPY\", \"GBP\"), 5))\nrate, arb = best_rate(g, \"USD\", \"JPY\")\nprint(\"best USD>JPY:       \", round(rate, 2), arb)\nassert abs(rate - best_path_slow(g, \"USD\", \"JPY\")) < 1e-9\nassert convert(g, \"USD\", \"USD\") == 1.0 and best_rate(g, \"USD\", \"CAD\") == (None, False)\nbad = build([q if q[:2] != (\"GBP\", \"USD\") else (\"GBP\", \"USD\", 1.40) for q in quotes])\nprint(\"GBP>USD quoted 1.40:\", best_rate(bad, \"USD\", \"JPY\"))\n\ntable, loops = floyd(g)\nassert abs(table[\"USD\"][\"JPY\"] - rate) < 1e-9 and loops == []\nprint(\"floyd USD>JPY:      \", round(table[\"USD\"][\"JPY\"], 2), \"loops:\", loops)\nbad_table, bad_loops = floyd(bad)\nprint(\"floyd with 1.40:    \", sorted(bad_loops))\nassert {\"USD\", \"EUR\", \"GBP\"} <= set(bad_loops)\nstamped = [q + (100,) for q in quotes]\nstamped = [q if q[:2] != (\"GBP\", \"JPY\") else q[:3] + (10,) for q in stamped]     # GBP>JPY is 90 old\nprint(\"stale GBP>JPY, max age 30:\", exchange(stamped, \"USD\", \"JPY\", now=100, max_age=30))\nassert exchange(stamped, \"USD\", \"JPY\", now=100, max_age=30) == (None, False)\nassert abs(exchange(stamped, \"USD\", \"JPY\", now=100, max_age=300)[0] - 145.35) < 1e-9\nprint(\"fresh enough, max age 300:\", round(exchange(stamped, \"USD\", \"JPY\", now=100, max_age=300)[0], 2))\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why a logarithm, and not multiply directly?",
       "a": "You can: relax with best[b] = max(best[b], best[a] * rate). The log version is the textbook one because it turns the problem into shortest path, which has a known meaning for a negative cycle."
      },
      {
       "q": "Why not Dijkstra?",
       "a": "Dijkstra assumes adding an edge never makes a path cheaper. A rate above 1 is a negative weight in log space, so a longer path can be better. If every rate were at most 1, Dijkstra would work."
      },
      {
       "q": "Why `1e-12` in the comparison?",
       "a": "Two routes to the same currency can differ by rounding error. Without a tolerance the loop would count that as an improvement and the cycle check would report arbitrage on clean data."
      },
      {
       "q": "Why `setdefault` for the reverse edge?",
       "a": "So an explicit reverse quote is kept. Overwriting it with one over the rate would throw away the spread, which is the reason the best path matters."
      },
      {
       "q": "Why check `src not in g` before Bellman-Ford?",
       "a": "An unknown currency has no entry, and indexing the distance map would raise. It is 'no path', so return None, False. The first version of this code missed it; the stale-quote test found it."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Evaluate Division",
       "d": "medium",
       "lc": "evaluate-division",
       "yt": [
        "Uei1fwDoyKk",
        "NeetCodeIO",
        18
       ],
       "why": "Part 1 exactly: equations are exchange rates, queries are conversions."
      },
      {
       "n": "Network Delay Time",
       "d": "medium",
       "lc": "network-delay-time",
       "yt": [
        "EaphyqKU4PQ",
        "NeetCode",
        20
       ],
       "why": "Shortest path from one source with weights. The warm-up for Dijkstra and Bellman-Ford."
      },
      {
       "n": "Path with Maximum Probability",
       "d": "medium",
       "lc": "path-with-maximum-probability",
       "yt": [
        "kPsDTGcrzGM",
        "NeetCodeIO",
        14
       ],
       "why": "A best product over a path, as in part 2. Probabilities are at most 1, so Dijkstra is allowed here; rates above 1 are why you need Bellman-Ford."
      },
      {
       "n": "Cheapest Flights Within K Stops",
       "d": "medium",
       "lc": "cheapest-flights-within-k-stops",
       "yt": [
        "5eIK3zUdYmE",
        "NeetCode",
        21
       ],
       "why": "The harder follow-up: Bellman-Ford with a cap on the number of edges. It teaches why the loop runs V - 1 rounds."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-friend",
   "title": "3. Friend network, few API calls",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** You can see a social network only through an API, and each call costs something. The question is some form of 'how are these two people connected' or 'who is within three hops', with as few calls as possible. One report mentions it, in the same line as the other two, with no more detail. I fixed one version below and the question that tells you which you were given is in the clarify box."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** The call is the cost, not the CPU. Ask what a call returns and what it costs."
    },
    {
     "t": "write",
     "id": "onsite-fr-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: what a call returns, the question asked, a batch call, many queries. Errors: rate limit, private users, celebrities, a user that does not exist. Scope: hop limit, directed or not, path or count.",
     "solution": "1. Primary capabilities\n- What does one call return? Likely friends(u): the full friend list of one user. Ask about a page size.\n- What is the question: connected or not, the number of hops, or the path? Likely the number of hops, or None.\n- Is there a batch call? Likely yes, as a follow-up.\n- Many questions on the same network? Likely yes, so a cache across queries pays.\n\n2. Error handling\n- What does a call cost, and is there a rate limit? Likely a limit; retry with a cap.\n- A private or unknown user? Likely an empty list. That is an answer, not an error.\n- A user with a million friends? Likely a page, not a list; ask the page size.\n\n3. Scope boundaries\n- Do friendships go both ways? Likely yes. If not, the far end cannot be searched backwards, so no bidirectional search.\n- Is there a limit on distance? A cap of 3 or 4 hops saves most of the calls.\n- Which cost matters: calls, time, or load on their server? Calls first, then time.\n- Code, or talk? Talk.",
     "why": "Whether friendships go both ways decides if I may grow a ball from the far end. Whether a batch call exists decides what 'fewest rounds' means. The cost question picks the goal.",
     "say": "**Three buckets: what it must do, what goes wrong, where it stops.** The call is the cost here, so I ask what one call returns and whether there is a rate limit or a batch call. And I ask whether friendships go both ways, because if they do I can grow a search from both ends."
    },
    {
     "t": "write",
     "id": "onsite-fr-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "The answer, one ask per user, the early stop, the hop limit, the cache, the rounds, out of scope.",
     "solution": "1. degrees(a, b) returns the number of hops, or None if they are not connected. Test: a-b, a-c, b-d, c-d, d-e gives 3 from a to e.\n2. Each user is asked about at most once per query. Test: a seen set; the call count never exceeds the number of users reached.\n3. Stop when b is first seen in a friend list, not when it comes off the queue. Test: 1,806 calls a query against 10,949 for the naive version, same answers.\n4. A maximum number of hops stops the search with None. Test: max_hops = 1 on a pair 4 apart returns None.\n5. A repeat query over the same users costs zero new calls. Test: the second call makes 0 new calls.\n6. Growing from both ends gives the same answer in far fewer calls. Test: 81 a query on the test network.\n7. With a batch call, rounds equal hops. Test: about 4.4 calls a query.\n8. Out of scope: weighted or directed edges, printing the path (a parent map adds it), live changes.",
     "why": "Requirements 3, 5, 6 and 7 are the four steps of the improvement, each with the number from the measured run.",
     "say": "I get seven requirements. **An answer in hops, one ask per user, stop at the first sighting, a hop limit, a cache, two balls, and batched levels.** Each has a call count I measured: 10,949 for naive, 1,806 with the early stop, 81 with two balls, 4.4 rounds batched."
    },
    {
     "t": "p",
     "text": "**c) Entities.**"
    },
    {
     "t": "write",
     "id": "onsite-fr-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "User: \nFriend list: \nAPI wrapper: \nSeen set: \nFrontier: \nBall: \nCache: \nLevel (batch): ",
     "hint": "We cannot see the graph, so which nouns are only what the API gives us?",
     "solution": "User: drop as a class. An id; we only ever pass it to friends().\nFriend list: drop. What a call returns, a list of ids.\nAPI wrapper: keep. Counts calls and lookups. friends(u) is one call; friends_many(users) is one call for many users. The count is what we optimise.\nSeen set: keep. A set of users already asked about; the guard that gives one ask per user.\nFrontier: keep. A deque of (user, hops) for the plain search, a list per level for the batched one.\nBall: keep. For the bidirectional search: a dict of user to distance, plus a frontier, one for each end.\nCache: keep. A dict from user to friend list, shared across queries.\nLevel (batch): keep. A list of users sent as one friends_many call.",
     "why": "The seen set is the correctness. The cache and the ball are the two savings. The wrapper is how we prove them.",
     "say": "I'd keep the wrapper that counts calls, a seen set, a frontier, a ball on each side, a cache and a level for the batch. **A user is only an id, so it is not a class.** The graph is not mine, so it is not an entity at all."
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.**"
    },
    {
     "t": "write",
     "id": "onsite-fr-logic-w",
     "q": "Write the steps from the naive search to bidirectional, then the batched version, then the real-life limits. Put numbers on each.",
     "starter": "Naive:\nEarly stop:\nBidirectional:\nCache and hop limit:\nBatched:\nRate limits and real life:",
     "hint": "Each step improves one count. With about 12 friends each, each hop multiplies the users by about 12.",
     "solution": "Naive breadth-first search:\n1. A queue with (a, 0) and a seen set with a.\n2. Take a user. If it is b, return its hops.\n3. Ask friends(u). Queue each friend not seen, with hops + 1.\n4. Cost: every user within the answer's distance is asked about: about 12 to the power of d. Measured 10,949 calls a query on 20,000 users.\n\nEarly stop:\n1. Check for b the moment it appears in a friend list, not when it is taken off the queue.\n2. This saves the whole last level, which is the biggest one.\n3. Measured: 1,806 calls a query.\n\nBidirectional:\n1. Keep a ball around a and a ball around b, each with a distance map and a frontier.\n2. Expand the smaller frontier, a full level at a time.\n3. When a friend is already in the other ball, a path exists. After the full level, the smallest total is exact.\n4. Two balls of radius d / 2 hold far fewer users than one ball of radius d: about 2 * 12^(d/2) against 12^d.\n5. Measured: 81 calls a query. Needs friendships to go both ways.\n\nCache and hop limit:\n1. Remember every answer. A second query over the same users makes 0 new calls.\n2. max_hops stops early with None. With 12 friends each, hop 4 would cost thousands of calls you never needed.\n\nBatched:\n1. Send a whole level in one friends_many call.\n2. Rounds equal hops: about 4.4 calls a query.\n3. The server does the same lookups as before, so ask whether it charges by call or by lookup.\n\nRate limits and real life (at 100 calls a second):\n- naive 109 s, early stop 18 s, bidirectional 0.8 s.\n- A token bucket in front of the call; on a rate-limit error, retry with backoff and a cap.\n- A celebrity returns a page, not a list: take pages lazily and expand the end with fewer friends.\n- A private profile returns an empty list, an answer and not an error.\n- If the graph changes while you search, a cached answer can be stale: give entries a time limit.\n\nEdge cases: a equals b (0); b unknown or unconnected (the frontier empties, return None); cycles (the seen set); max_hops = 0.",
     "why": "Each version removes one wasted ask. The early stop removes the last level, the second ball removes the far half, the cache removes repeats, and the batch removes round trips.",
     "say": "**I think the call is the cost here, so I'd count calls the way I count model calls.** I'd start with breadth-first search and a set of people already asked about, stop the moment I see the target, then grow from both ends and always expand the smaller side. On my test network that went from 10,949 calls to 81. If calls are slow I'd batch a whole level, and ask whether the server charges by call or by lookup."
    },
    {
     "t": "p",
     "text": "**e) The code, for after.** Main function first."
    },
    {
     "t": "write",
     "id": "onsite-fr-code-w",
     "q": "Write degrees() first. Name the helpers, do not write them yet.",
     "starter": "def degrees(api, a, b, cost=\"calls\"):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "What is expensive decides the search: calls or time.",
     "solution": "def degrees(api, a, b, cost=\"calls\"):\n    \"\"\"The answer in one place: what is expensive decides the search.\"\"\"\n    if cost == \"time\":\n        return batched_bfs(api, a, b)             # one call per level: rounds = hops\n    return bidirectional(cached(api), a, b)       # fewest calls: two small balls, every answer remembered\n\n# helpers, defined in the workbench below:\n#   cached(api)             remember every friends() answer\n#   bidirectional(api, a, b) two balls, always expand the smaller\n#   batched_bfs(api, a, b)  one call per level, rounds = hops\n",
     "why": "Two goals, two searches. The cache is on the calls path because a repeat query is the cheapest win.",
     "say": "I'd write degrees first: **if time is the cost, batch a level at a time; if calls are, grow two balls over a cache.** The helpers are the cache, the two-ball search and the batched search."
    },
    {
     "t": "predict",
     "id": "onsite-friend-pred",
     "code": "# 12 friends each. Users first met at each hop from a.\nlevels = [1]\nfor _ in range(4):\n    levels.append(levels[-1] * 12)\nprint(levels)\nprint(sum(levels[:4]), sum(levels[:3]) * 2)",
     "q": "What does this print? Read the second line as: asked about by a plain search of 3 hops, and by two balls of radius 2.",
     "answer": "[1, 12, 144, 1728, 20736]\n1885 314",
     "why": "Each hop multiplies by 12. A search that must expand three levels asks about 1 + 12 + 144 + 1,728 = 1,885 users, and one more level is 20,736. Two balls of radius 2 ask about 2 * (1 + 12 + 144) = 314. That gap is the whole argument for growing from both ends."
    },
    {
     "t": "problem",
     "id": "onsite-friend-p",
     "title": "Friend network through a limited API",
     "source": "Mercor-style algorithms discussion, rebuilt (talk first, the code is for after)",
     "d": "medium",
     "minutes": 30,
     "why": "Every API call is a cost, so the question is which users you ever need to ask about. It is the same thinking as a model call or a database read. Say it aloud first; open the solution to check it.",
     "statement": "You can learn who is friends with whom only by calling friends(user), which returns that user's friends. Part 1. Given two users, return how many hops separate them, or None if they are not connected, using as few calls as you can.\n\nPart 2. Each call takes 200 ms. Reduce the time, not only the calls.\n\nPart 3. The API also accepts a batch of users in one call. Use it.",
     "examples": [
      {
       "input": "a-b, a-c, b-d, c-d, d-e; degrees(a, e)",
       "output": "3",
       "note": "a to b or c, then d, then e."
      },
      {
       "input": "20,000 users, about 12 friends each, 40 random pairs",
       "output": "naive 10,949 calls a query, early exit 1,806, bidirectional 81",
       "note": "Counted by the Api wrapper below. Same answers, very different cost."
      },
      {
       "input": "the same pairs, one call per level",
       "output": "about 4.4 calls a query",
       "note": "Rounds equal hops. The server still looks up as many users as before."
      }
     ],
     "constraints": [
      "standard library only",
      "friendships go both ways",
      "the API is the only way to see the graph",
      "a call costs the same whatever it returns"
     ],
     "starter": "def degrees(api, a, b):\n    ...",
     "hints": [
      "Level 1: it is a shortest path in a graph you cannot see all of. Expand people one level at a time and keep a set of the people you have already asked about.",
      "Level 2: do not wait until b comes off the queue. The moment b appears in someone's friend list you know the answer, and the last level's calls were never needed.",
      "Level 3: grow a ball around a and another around b, always the smaller one. Two balls of radius d/2 hold far fewer people than one ball of radius d."
     ],
     "solution": "from collections import deque\n\n\nclass Api:\n    \"\"\"A pretend network. friends(u) is one call; friends_many(users) is one call for many users.\"\"\"\n    def __init__(self, graph):\n        self.graph, self.calls, self.lookups = graph, 0, 0\n\n    def friends(self, u):\n        self.calls += 1\n        self.lookups += 1\n        return self.graph.get(u, [])\n\n    def friends_many(self, users):\n        self.calls += 1                    # one round trip\n        self.lookups += len(users)         # but the server still did this much work\n        return {u: self.graph.get(u, []) for u in users}\n\n\ndef bfs_naive(api, a, b):\n    \"\"\"First version: checks for b only when a user is taken off the queue.\"\"\"\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        if u == b:\n            return d\n        for v in api.friends(u):\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\ndef bfs(api, a, b, max_hops=None):\n    \"\"\"Checks for b the moment it is seen, so it never expands the last level. Stops at max_hops.\"\"\"\n    if a == b:\n        return 0\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        if max_hops is not None and d >= max_hops:\n            return None                    # everything further away is beyond the limit\n        for v in api.friends(u):\n            if v == b:\n                return d + 1               # stop here: no more calls\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\ndef cached(api):\n    \"\"\"Remember every answer: a second query over the same people costs nothing.\"\"\"\n    memo = {}\n\n    class C:\n        def friends(self, u):\n            if u not in memo:\n                memo[u] = api.friends(u)\n            return memo[u]\n    return C()\n\n\ndef bidirectional(api, a, b):\n    \"\"\"Grow a ball around each end, always the smaller one. They meet after about half the hops.\"\"\"\n    if a == b:\n        return 0\n    dist = ({a: 0}, {b: 0})\n    frontier = ([a], [b])\n    while frontier[0] and frontier[1]:\n        s = 0 if len(frontier[0]) <= len(frontier[1]) else 1   # expand the smaller side\n        mine, other = dist[s], dist[1 - s]\n        nxt, best = [], None\n        for u in frontier[s]:\n            for v in api.friends(u):\n                if v in other:             # the two balls touch\n                    total = mine[u] + 1 + other[v]\n                    best = total if best is None else min(best, total)\n                elif v not in mine:\n                    mine[v] = mine[u] + 1\n                    nxt.append(v)\n        if best is not None:               # a full level is done, so the minimum is exact\n            return best\n        frontier = (nxt, frontier[1]) if s == 0 else (frontier[0], nxt)\n    return None\n\n\ndef batched_bfs(api, a, b):\n    \"\"\"One call per level, not per user. Rounds = hops, which is what matters when each call is slow.\"\"\"\n    if a == b:\n        return 0\n    seen, level, hops = {a}, [a], 0\n    while level:\n        hops += 1\n        found = api.friends_many(level)    # the whole level in one round trip\n        nxt = []\n        for u in level:\n            for v in found[u]:\n                if v == b:\n                    return hops\n                if v not in seen:\n                    seen.add(v)\n                    nxt.append(v)\n        level = nxt\n    return None\n\n\ndef degrees(api, a, b, cost=\"calls\"):\n    \"\"\"The answer in one place: what is expensive decides the search.\"\"\"\n    if cost == \"time\":\n        return batched_bfs(api, a, b)             # one call per level: rounds = hops\n    return bidirectional(cached(api), a, b)       # fewest calls: two small balls, every answer remembered\n",
     "complexity": "bfs_naive asks about every user within distance d of a: about (friends per user)^d calls. bfs with an early exit saves the whole last level. bidirectional asks about two balls of radius d/2, roughly 2 * (friends per user)^(d/2) calls. batched_bfs makes one call per level: d calls, but the same lookups on the server.",
     "explain": [
      "Api is a counter in front of the graph. You cannot improve a number you have not measured, and it is how you would count paid model calls.",
      "bfs_naive checks for b only when a user comes off the queue, so on the last level it asks about everyone before it notices b was already seen.",
      "bfs checks for b the moment it appears in a friend list. It never expands the last level. max_hops stops the search when the answer would be too far to matter.",
      "cached remembers every friends() answer. A second query over the same people costs nothing.",
      "bidirectional keeps two sets of distances and two frontiers. It expands the smaller frontier a full level at a time. After a full level the smallest total is exact.",
      "batched_bfs sends a whole level in one friends_many call. Rounds equal hops. The server still does the same lookups.",
      "degrees is the plan: batch a level at a time when time is the cost; two balls over a cache when calls are.",
      "Measured on the test graph: 10,949 calls for naive, 1,806 with an early exit, 81 bidirectional, 4.4 batched rounds. At 100 calls a second those are 109 s, 18 s and 0.8 s."
     ],
     "tests": "import random\n\nrng = random.Random(7)\nn, deg = 20000, 6                          # about 12 friends each, friendships go both ways\ngraph = {u: [] for u in range(n)}\nfor u in range(n):\n    for _ in range(deg):\n        v = rng.randrange(n)\n        if v != u and v not in graph[u]:\n            graph[u].append(v)\n            graph[v].append(u)\n\n\ndef truth(a, b):                           # ground truth, straight from the dict, no api\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        if u == b:\n            return d\n        for v in graph[u]:\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\npairs = [(rng.randrange(n), rng.randrange(n)) for _ in range(40)]\ntotal = {\"naive\": 0, \"early exit\": 0, \"bidirectional\": 0, \"batched (rounds)\": 0}\nfor a, b in pairs:\n    want = truth(a, b)\n    for name, fn in ((\"naive\", bfs_naive), (\"early exit\", bfs), (\"bidirectional\", bidirectional), (\"batched (rounds)\", batched_bfs)):\n        api = Api(graph)\n        assert fn(api, a, b) == want, (name, a, b)\n        total[name] += api.calls\nfor name, calls in total.items():\n    print(\"%-17s %7.1f calls per query\" % (name, calls / len(pairs)))\n\napi = Api(graph)\nc = cached(api)\nbfs(c, 0, 5000); first = api.calls\nbfs(c, 0, 5000)\nassert api.calls == first                  # the repeat was free\nprint(\"repeat query after caching: 0 new calls (first query used %d)\" % first)\nassert bfs(Api(graph), 0, 5000, max_hops=1) in (None, 1)\nprint(\"ok\")\n\nwant = truth(0, 5000)\napi1, api2 = Api(graph), Api(graph)\nassert degrees(api1, 0, 5000) == want and degrees(api2, 0, 5000, cost=\"time\") == want\nprint(\"degrees: %d calls for fewest calls, %d rounds for fewest rounds (hops = %s)\" % (api1.calls, api2.calls, want))\ncps = 100\nper = {k: v / len(pairs) for k, v in total.items()}\nprint(\"at %d calls a second: naive %.0f s, early exit %.0f s, bidirectional %.1f s\" % (cps, per[\"naive\"] / cps, per[\"early exit\"] / cps, per[\"bidirectional\"] / cps))\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why is checking for b on discovery better than when popped?",
       "a": "When you pop users you have already paid for every user ahead on that level. Checking on discovery stops at the first sighting. It cut about 10,900 calls to about 1,800."
      },
      {
       "q": "Why expand the smaller frontier in the bidirectional search?",
       "a": "Each level multiplies a frontier by the average friend count. Growing the smaller side keeps the two balls about equal and keeps the total low, even when one end is a celebrity."
      },
      {
       "q": "Why must a full level finish before returning?",
       "a": "Two balls can touch at several users in one level, with different totals. The smallest of them is exact only after the whole level."
      },
      {
       "q": "Why does the cache wrap the API and not live inside bfs?",
       "a": "One cache then serves every search and every query. bfs stays a plain search and does not know it is being helped."
      },
      {
       "q": "What does `max_hops` return when the limit is hit?",
       "a": "None, which means 'not within the limit', not 'not connected'. Say which one you mean."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Find if Path Exists in Graph",
       "d": "easy",
       "lc": "find-if-path-exists-in-graph",
       "yt": [
        "knLFe7hEp3Y",
        "Greg Hogg",
        13
       ],
       "why": "Part 1 as yes or no: a visited set and a search. Nothing else."
      },
      {
       "n": "Clone Graph",
       "d": "medium",
       "lc": "clone-graph",
       "yt": [
        "mQeF6bN8hMk",
        "NeetCode",
        12
       ],
       "why": "Visit each node once and remember what you saw. The same discipline as asking about each user once."
      },
      {
       "n": "Word Ladder",
       "d": "hard",
       "lc": "word-ladder",
       "yt": [
        "h9iTnkgv05E",
        "NeetCode",
        18
       ],
       "why": "The harder follow-up: shortest path in a graph you build as you go. Bidirectional search is the known speed-up, and it is the bidirectional step here."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-followups",
   "title": "4. The follow-ups they may chain",
   "blocks": [
    {
     "t": "p",
     "text": "**How to use this.** After your answer the interviewer pushes. These are the pushes each problem leads to, with a short answer. Say the answer aloud in two or three sentences, then give a number. If you do not know, say what you would measure."
    },
    {
     "t": "faq",
     "title": "Comparator",
     "items": [
      {
       "q": "What if the comparator is inconsistent?",
       "a": "Ask whether it repeats. If random: one stored answer per pair and three votes. If the same pair is always wrong: voting changes nothing, so I detect cycles by sampling triples and report them."
      },
      {
       "q": "How do you detect an intransitive cycle?",
       "a": "Sample triples and look for x before y, y before z, z before x. Or sort twice with the input shuffled and compare the orders. A cycle is proof, a clean sample is not."
      },
      {
       "q": "What about ties?",
       "a": "Strict less-than in the merge, so equal items keep their input order. In the bracket, a tie goes to the earlier index. Say it, because a tie rule changes the output."
      },
      {
       "q": "The input arrives as a stream. What changes?",
       "a": "A heap of size k, O(log k) per item and one call against the root for most items. The tournament needs all items up front, so it is out. Memory is k, whatever the stream length."
      },
      {
       "q": "What if k is close to n?",
       "a": "Sort everything. The partial methods win only for a small k; at half of n the heap's replace cost catches up with sorting."
      },
      {
       "q": "Can you get the answer in a fixed number of rounds?",
       "a": "Yes, buy rounds with calls: 10 rounds and 999 calls for the best one, 2 rounds and 15,900 calls, 1 round and 499,500. Say which the rate limit lets you afford."
      },
      {
       "q": "How would you test it?",
       "a": "Wrap the comparator in a counter, check the output against sorted() on random inputs, and add a comparator that is wrong on every fourth call and one that is wrong on close values."
      }
     ]
    },
    {
     "t": "faq",
     "title": "Exchange rates",
     "items": [
      {
       "q": "What does a negative cycle mean?",
       "a": "A loop of trades whose rates multiply to more than 1, so each lap earns money: arbitrage. There is no best rate, because you could loop forever. Report the loop."
      },
      {
       "q": "How do you print the loop?",
       "a": "Keep a parent for each currency during Bellman-Ford. When the extra pass still improves a currency, walk its parents V times to land inside the loop, then follow parents until you return."
      },
      {
       "q": "Quotes are stale or missing. What do you do?",
       "a": "Drop quotes older than a maximum age before searching. A missing quote is a missing edge, so the best path reroutes or there is none: return None. Do not invent a rate."
      },
      {
       "q": "A million queries. What changes?",
       "a": "Floyd-Warshall once on the -log rates, 27 million steps for 300 currencies, then each query is a lookup. Bellman-Ford each time would be 27 trillion."
      },
      {
       "q": "Quotes update every second.",
       "a": "Take a snapshot per query, or rebuild the table on a schedule with a version number, and return the version with the answer."
      },
      {
       "q": "There is a fee on each trade.",
       "a": "A percentage fee multiplies into the rate, so fold it in. A fixed fee or a minimum depends on the amount, so the weight is not fixed and it is not a plain shortest path. Ask for the real rule."
      },
      {
       "q": "Float errors?",
       "a": "Use a small tolerance in the relax and the cycle check. For money use decimals or integers at the end; the logs are for choosing a path only."
      }
     ]
    },
    {
     "t": "faq",
     "title": "Friend network",
     "items": [
      {
       "q": "The API is rate limited.",
       "a": "A token bucket in front of the call and retries with backoff and a cap. Calls are the scarce thing again, so the two balls and the cache matter more than batching."
      },
      {
       "q": "A user has a million friends.",
       "a": "A call returns a page. Take pages lazily and expand the end with fewer friends; a path through a celebrity is rarely worth paying for."
      },
      {
       "q": "The API takes a batch.",
       "a": "One request per level, so rounds equal hops. Ask whether the server charges by call or by lookup: the lookups are the same."
      },
      {
       "q": "Friendships are one-way.",
       "a": "No search from the far end, because you cannot ask who follows b. Fall back to the early-stop search with a cache and a hop limit."
      },
      {
       "q": "Many queries on the same network.",
       "a": "Share one cache across queries. If the network is stable, pick a few well-connected users, keep their distance to everyone, and use them to bound answers. Say that is an extension, not the first answer."
      },
      {
       "q": "The graph changes while you search.",
       "a": "A cached friend list can be stale. Give cache entries a time limit, or return the answer with the time it was true."
      },
      {
       "q": "How do you return the path, not the count?",
       "a": "Keep a parent map when you first see a user, and walk it back from b. For two balls, join the two walks at the meeting user."
      }
     ]
    },
    {
     "t": "p",
     "text": "**If you freeze.** Say the brute force and its cost. Say what you would count. Ask the interviewer one clarifying question. Then do the smallest example by hand, aloud. All three problems yield to that."
    }
   ]
  }
 ]
});
