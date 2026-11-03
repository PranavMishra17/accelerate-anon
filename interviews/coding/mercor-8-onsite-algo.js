/* Mercor onsite, algorithms discussion. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-onsite-algo",
 "n": 8,
 "flow": true,
 "title": "Onsite algorithms: the reported problems",
 "minutes": 240,
 "lead": "After this part you can run a 30 minute talk-only algorithms round on the problems candidates reported: the faulty comparator (including the paid one that is right 90 percent of the time), exchange rates, the friend network, the sorting-theory warm-up, a million user IDs and weighted top-k. Each problem goes in the order you solve it: clarify, requirements, entities, the logic in English with numbers, the code for after, and the review. Mercor describes the round as interactive and discussion-based, true algorithms on real architecture challenges. The original prompts are not public; these are rebuilt from candidate reports, and each source is named where it is used.",
 "sections": [
  {
   "id": "onsite-talk",
   "title": "0. How to run a talk-only algorithms round",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A conversation with no code expected. Mercor describes the round as 30 minutes, interactive and discussion-based; candidate reports say 30 to 45 minutes. AceOffer's synthesis of 20 candidate reports (aceoffer.app, Mercor interview process page, Oct 2025 to Oct 2026) lists three questions: sorting or top-k with a faulty comparator (the most reported, four reports), exchange rates across currency pairs, and a friend-network search with few API calls. PracHub, a site of candidate-written questions, has a fuller version of each: the paid comparator that is right 90 percent of the time (listed 12 Sep 2026), chained currency conversion (13 Sep 2026) and the friend network through a restricted API (25 Sep 2026). AceOffer adds that one version of the exchange question was entirely spoken. The sites paraphrase the prompts and do not quote them, so the versions below are rebuilt. Do not memorise a wording; learn the shape."
    },
    {
     "t": "p",
     "text": "**What a talk round grades.** The same things the coding round grades, said aloud: do you break the problem down, do you count, do you compare alternatives, do you recover when pushed. AceOffer says the candidates who passed the comparator question clarified the error model first and treated calls and wall-clock time as two separate goals. Two PracHub reports describe verbal sorting-theory warm-ups. A Mercor software engineer interviewed in May 2026 (published 19 Sep 2026, a technical phone screen of about 50 minutes) was asked how to beat n squared, what quicksort's worst case is, and to design a sort slower than n squared; the interviewer defined subsequences, asked how many there are (2 to the n, minus 1) and how many permutations (n factorial), and wanted: try every permutation until one is sorted, O(n!). A second candidate (interviewed Sep 2026, published 1 Oct 2026, a 30 minute screen) got the same pair: a sort faster than n squared (merge sort) and one slower (shuffle and compare, which the candidate called O(n times n!)). Both were screens, not the onsite, so read them as the likely warm-up and not as a promise."
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
     "title": "Warm-up theory questions a talk round may open with (the sorting-theory reports)",
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
       "a": "Generate every permutation and check each for sorted order: n factorial permutations, each check is n steps, so O(n!) permutations tried and O(n times n!) if you count the checks. Both PracHub reports ask this; in one the interviewer first defined subsequences, so be ready to count them. Shuffle and compare (a random permutation until sorted) has the same expected cost with no worst-case bound. Say you would never ship it; the point is to show you can count."
      },
      {
       "q": "How many calls does a library sort make?",
       "a": "It depends on the input. Python's sort finds runs, so an already sorted list of n items costs n minus 1 calls, and a shuffled one costs close to n log2 n. Say 'it depends on the input' before you quote a number."
      },
      {
       "q": "How many subsequences does a list of n items have? How many permutations?",
       "a": "Each item is in or out, so 2 to the n subsets, and 2 to the n minus 1 if the empty one is left out. Permutations are n times n minus 1 times n minus 2 and so on down to 1: n factorial. For 4 items that is 15 and 24, for 5 items 31 and 120. This is the counting step the first PracHub report says the interviewer led with."
      },
      {
       "q": "Why is n factorial slower than 2 to the n?",
       "a": "Each extra item multiplies n factorial by n, but only doubles 2 to the n. From 4 items on, n factorial is bigger: 24 against 16, then 120 against 32, then 720 against 64. Say it as 'the multiplier grows, the doubling does not'."
      },
      {
       "q": "What is the best possible comparison sort?",
       "a": "No comparison sort can beat log2 of n factorial comparisons, which is about n log2 n minus 1.44 n. There are n factorial possible orders and each comparison at best halves them. Merge sort is within a small constant of that bound."
      }
     ]
    },
    {
     "t": "predict",
     "id": "onsite-slow-sort-pred",
     "code": "from itertools import permutations\n\n\ndef slow_sort(a):\n    tries = 0\n    for p in permutations(a):\n        tries += 1\n        if all(p[i] <= p[i + 1] for i in range(len(p) - 1)):\n            return list(p), tries\n\n\nprint(slow_sort([1, 2, 3, 4]))\nprint(slow_sort([4, 3, 2, 1]))\nprint(2 ** 4 - 1, 5 * 4 * 3 * 2)\n",
     "q": "This sort tries every ordering of the list until one is sorted. What does it print? (Python 3.12.)",
     "answer": "([1, 2, 3, 4], 1)\n([1, 2, 3, 4], 24)\n15 120",
     "why": "A sorted list is the very first ordering tried, so one try. A reversed list is the very last of the 24, so 24 tries. The last line is 2 to the 4 minus 1 subsequences and 5 factorial permutations. Add the n steps of each sortedness check and the worst case is n times n factorial."
    }
   ]
  },
  {
   "id": "onsite-comparator",
   "title": "1. A faulty or slow comparator",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** You get a function you cannot see inside, and you must sort or pick the best k. It is the most reported question of the round (four reports in AceOffer's synthesis): sorting or finding the top items with a comparison function that is wrong some of the time, then minimise the comparison calls, then account for wall-clock time when each call is slow. PracHub lists a fuller version (a software engineer question, Hard, listed 12 Sep 2026): n objects and a paid comparison API that is right with probability 0.9 and costs 1 cent a call. Part 1 is one call per comparison: which errors are fatal, and how does accuracy behave as n grows? Part 2 spends more calls (repeat and vote) to raise accuracy: give accuracy and cost as functions of n and your parameter, and reach the same accuracy with fewer calls. Its follow-ups are: if a pair always gets the same answer, what is achievable; if accuracy means few out-of-order pairs, which algorithm; if only the greatest or the top few are needed, how do accuracy and cost change. PracHub says a strong answer states the noise model first and notes that an inconsistent comparator can break a standard sort. It is close to a real job: ranking with a model as a judge, where every comparison is a slow, paid, sometimes wrong call. In my eval harness I used a model as a judge next to deterministic checks, so I can talk about that."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) the code (shut until you have talked it through), f) the review. Try each box before you open the answer."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, but one question comes before them: is the comparator wrong at random, a fresh coin each call, or does a given pair always get the same answer? Every later answer depends on it. AceOffer reports that passing candidates clarified the error model before proposing anything, and that the errors are repeatable. PracHub leaves it for you to ask and lists the repeated-pair case as a follow-up. So do not assume either. Ask, then say what you do in each case."
    },
    {
     "t": "write",
     "id": "onsite-cmp-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "First: random or repeatable errors? Then capabilities: what compare returns, how big k is, what accurate means, price. Errors: close values only or anywhere, raises, contradicts itself. Scope: parallel and rate limit, code or talk, ties, streaming.",
     "solution": "FIRST QUESTION, before the buckets: is it wrong at random, a fresh coin each call, or does the same pair always get the same answer?\n- Random: asking again can give a different answer, so storing one answer per pair and voting works, and the accuracy is a formula in the number of votes.\n- Repeatable: asking again returns the same answer, so voting costs more and changes nothing. The only help is to compare each item against several different others, so one bad pair is outvoted.\nBoth cases are worked below in the paid comparator. AceOffer says the reported errors are repeatable.\n\n1. Primary capabilities\n- What does compare return? Likely negative, zero or positive, like Python's cmp, or a yes or no.\n- Return the best k in order, or the whole sorted list? Likely the best k, in order.\n- How big is k next to n? Likely small: k of 5 to 10, n in the thousands. A big k changes the answer to 'sort everything'.\n- Is each call paid, and how accurate is one call? PracHub: 1 cent a call, right 90 percent of the time. Then cents are the second thing to minimise, after accuracy.\n- What does accurate mean: the exact order, few pairs out of place, or only the top item right? Likely open. It picks the algorithm.\n- Which goal comes first: fewest calls, or least wall-clock time? Likely calls first, then time when each call is slow.\n\n2. Error handling\n- Random or repeatable? Asked first, above.\n- Is it wrong only when two items are close, or anywhere? Close-only means the top set is nearly right.\n- Can it raise or time out? Likely yes: retry with a cap, then raise.\n- Can it contradict itself: a before b, b before c, c before a? Likely yes. No algorithm repairs a cycle; I detect it. PracHub adds that an inconsistent comparator can break a standard sort.\n\n3. Scope boundaries\n- Can I call it in parallel, in a batch, and is there a rate limit? Decides the slow-call answer.\n- Do I write code, or talk? Talk, 30 to 45 minutes.\n- Ties and duplicates? Keep input order (stable).\n- Streaming input? Out of scope until asked: it is a follow-up.",
     "why": "The error model changes the whole plan: voting fixes random errors and does nothing for repeatable ones. The meaning of accurate picks the algorithm. The parallel question changes which goal I can serve. The size of k picks between sorting and a partial method.",
     "say": "**Before anything else I ask whether the wrong answers are random or the same every time for the same pair.** Voting fixes the first and does nothing for the second, so it decides the plan. Then my three buckets: what it must do, what goes wrong, where it stops. I also ask what accurate means and how big k is, and whether I can call in parallel, because those decide the algorithm."
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
     "hint": "Result, counting, the method by k, ties, rounds, the error handling, the paid version, out of scope.",
     "solution": "1. Given items and compare, return the best k in rank order. Test: 1,000 distinct numbers, k = 5, the result equals sorted(data)[:5].\n2. Every call to compare is counted and the count is reported. Test: sorting 2 items makes 1 call.\n3. The method follows from k. If k is at least half of n, sort everything. Otherwise do not sort everything. Test: k = 5 on 1,000 items uses under a quarter of the calls of a full sort (1,044 against 8,715).\n4. Equal items keep their input order. Test: two equal items come back in input order.\n5. When calls are slow, independent calls run together and the number of rounds is reported. Test: 64 items, k = 3 finishes in 5 rounds.\n6. Random wrong answers are fixed by one stored answer per pair and an odd vote; errors raised are retried up to a cap, then re-raised. Test: every 4th call wrong, still sorted.\n7. Repeatable wrong answers are not fixed but detected: a cycle among three items is reported. Test: rock, paper, scissors returns a cycle; plain numbers return none.\n8. With a paid comparator that is right 90 percent of the time, report accuracy and cost in cents as functions of n and the votes a comparison gets. Test: 5 votes make one comparison right 99.14 percent of the time, and the best of 256 is found in about 95 percent of runs for 1,275 cents.\n9. Out of scope: learning the comparator's rule, streaming input, a distributed run.",
     "why": "Requirement 3 is the main design decision, 6 and 7 are the two sides of the open question, and 5 is the second goal. Each has a number a reviewer can check.",
     "say": "From your answers I get nine requirements. **The first is the contract: best k in order. The next five are the goals: count calls, pick by k, keep ties stable, run independent calls together, handle wrong answers.** I'd write a test number next to each, like 1,044 calls for k of 5 on a thousand items. The ninth part is the paid version: cents as a function of the votes."
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
     "t": "write",
     "id": "onsite-cmp-paid-w",
     "q": "Layer 4, the paid version (PracHub): right 90 percent of the time, 1 cent a call. Part 1 one call each, part 2 repeat and vote. Write accuracy and cost as functions of n and the votes m, and how to reach the same accuracy for fewer cents.",
     "starter": "Part 1, one call each:\nPart 2, m votes:\nSame accuracy for less:",
     "hint": "A majority of m asks is right with a binomial sum. A merge sort makes about n log2 n comparisons. A wrong comparison moves an item a few places; it does not break the sort.",
     "solution": "Part 1, one call a comparison (p = 0.9):\n1. Merge sort asks about n log2 n minus 1.44 n comparisons, so about that many cents. Measured: 1,245 cents for 200 items (mean of 10 runs).\n2. No single wrong answer is fatal. It puts two neighbours the wrong way round, or sends an item to the wrong side of a merge, which moves it a few places. Measured: about 3,260 of the 19,900 pairs end up out of order on 200 items.\n3. As n grows the chance of a perfectly sorted result is 0.9 to the power of about n log2 n, which is nearly zero. So the promise is never 'sorted'. It is 'few pairs out of order', and you need a measure for that, such as the count of out-of-order pairs.\n\nPart 2, m votes, m odd, take the majority:\n1. One comparison is right with chance the sum, for i above m/2, of C(m, i) times 0.9^i times 0.1^(m-i). m = 1: 0.9. m = 3: 0.972. m = 5: 0.99144. m = 7: 0.99727. m = 9: 0.99911.\n2. Cost is m cents a comparison, so about m times n log2 n cents. Measured on 200 items: 1 vote leaves 3,260 pairs out of order for 1,245 cents; 3 votes 999 for 3,840; 5 votes 282 for 6,464.\n3. How many votes: the wrong chance falls like e to the minus 0.32 m (Hoeffding's bound for p = 0.9, a loose upper bound). To get all n log2 n comparisons right with probability 1 minus delta each needs error delta over n log2 n, so m grows like log(n log n / delta). The cost is n log n times an extra log factor. These are my own derivations, not from the PracHub page.\n\nSame accuracy for fewer cents:\n1. Ask until one answer leads by 2, or by 3 (a sequential vote). Lead 2 is wrong 1.22 percent of the time and takes 2.44 asks on average; 3 fixed votes are wrong 2.8 percent for 3 asks. Lead 3 is wrong 0.137 percent in 3.74 asks; 5 fixed votes are wrong 0.86 percent for 5. Two agreeing answers in a row (82 percent of the time) end it after two asks.\n2. Measured on 200 items: lead 3 leaves 68.5 pairs out of order for 4,859 cents, against 282 pairs for 6,464 cents with 5 fixed votes.\n3. Store one answer per pair and read the reverse from it, so a pair is never paid for twice.\n4. Compare fewer pairs when you do not need the whole order (top-k, next block).\n\nEdge cases: an even number of votes (a tie); a cap on the sequential rule (15 asks, then the majority), because a comparator near 50 percent never settles; p unknown, so measure it on pairs with a known order first.",
     "why": "Accuracy rises fast over the first few votes while the cost is linear, so the question is where the next cent buys the most. Stopping when the answers agree buys accuracy cheaply.",
     "say": "**Part 1 costs about n log n cents and gives a sort that is mostly right, never exactly right.** One wrong answer moves an item a few places, so I'd count pairs out of order and not ask for a perfect sort. Part 2: three votes make a comparison right 97.2 percent of the time and five 99.1 percent, at m cents each. To get the same accuracy for less I'd ask until one answer leads by three. On 200 items that was 4,859 cents and 68 pairs out of order, against 6,464 cents and 282 pairs for five fixed votes. Those numbers are my own, worked out and measured, not the reported answer."
    },
    {
     "t": "write",
     "id": "onsite-cmp-top-w",
     "q": "Only the best one, or the best few, are needed. How do accuracy and cost change? Write which wrong answers matter and where to spend the votes.",
     "starter": "Best one:\nBest few:\nWhere to spend the votes:",
     "hint": "In a knockout bracket the true best plays only log2 n matches. Which wrong answers matter? How many matches are there in each round?",
     "solution": "Best one (a knockout bracket):\n1. The bracket plays n minus 1 matches, but only the true best item's own matches matter. It plays ceil(log2 n) of them. A wrong answer anywhere else changes only which other item it meets.\n2. So the chance the true best wins is q to the power of log2 n, where q is the chance one comparison is right. For 256 items that is 8 matches. 1 vote: 0.9^8 = 0.430 (measured 0.446). 5 votes: 0.99144^8 = 0.934 (measured 0.946). 7 votes: measured 0.976.\n3. Cost is n minus 1 matches times m votes: 255 times 5 = 1,275 cents. A full sort of 256 items with 5 votes each is about 1,680 comparisons, so about 8,400 cents. The best one is about 6 times cheaper.\n\nBest few (k):\n1. Each of the k true best items must survive its own matches, so about k times log2 n matches matter. A heap of size k asks about n comparisons, but a wrong 'worse than the root' answer throws a true top-k item away for good, so each of those needs the full vote.\n2. A bracket with repeated removal replays one path per winner: n minus 1 plus (k minus 1) times log2 n matches. A wrong answer on the path of a true top-k item matters.\n3. If accuracy means few out-of-order pairs inside the top k, sort the k candidates at the end with extra votes. That is k log k comparisons, small.\n\nWhere to spend the votes:\n1. Round r of the bracket has n / 2^r matches, and every round gives the best item the same exposure: one match. So votes are cheap in late rounds and costly in early ones. Give few votes early and more later.\n2. Measured on 256 items: 3, 3, 5, 9, 9, 9, 11, 11 votes by round succeeds 0.942 of the time for 1,021 cents. 5 votes in every round succeeds 0.946 for 1,275 cents. That is 20 percent fewer cents for the same accuracy.\n3. Too few votes early loses the best item before the cheap rounds begin: 1, 1, 3, 3, 5, 5, 7, 9 votes succeeded only 0.726.\n4. The rule behind it (my own derivation): to minimise cost for a fixed total error, the error allowed in each round should be proportional to the number of matches in that round.\n\nEdge cases: n not a power of two (the odd item gets a bye, and the best item then plays fewer matches); k close to n (sort everything instead); a tie (earlier index wins).",
     "why": "Only the true best item's matches matter for the best one, so the votes can follow the number of matches in a round. Sorting everything pays for accuracy on pairs nobody asked about.",
     "say": "**For the best one, only its own matches matter.** In a bracket of 256 it plays eight, so with five votes it wins about 93 percent of the time, and the whole thing costs 255 times 5, about 1,300 cents, against about 8,400 for a full sort. I'd also spend the votes unevenly: few in the first rounds, where there are many matches, and more in the last ones. That kept the same 94 percent for 20 percent fewer cents in my run. For the best few I'd count about k times log n matches that matter."
    },
    {
     "t": "write",
     "id": "onsite-cmp-repeat-w",
     "q": "If the same pair always gets the same answer, what is achievable? Write what voting does, what you can guarantee, what helps and what it costs.",
     "starter": "Voting:\nGuarantee:\nWhat helps:\nCost:",
     "hint": "Asking the same pair again returns the same answer. Asking a different pair is a new question.",
     "solution": "Voting: it does nothing. Asking the same pair again returns the same answer, so m votes cost m times and change nothing. Measured on 200 items: 1 vote and 9 votes returned the identical order (3,063 pairs out of order), for 11,394 cents against 1,266.\n\nGuarantee:\n1. No method can be more sure of a pair than one call is, which is 90 percent. A single pair is as good as it will get.\n2. What you can promise is about the whole list: each item is compared with many different others, so one bad pair is outvoted by the rest.\n3. The result is the best according to what the comparator says. If the comparator is wrong for a pair, only another pair can contradict it.\n\nWhat helps:\n1. Compare each item with many different others and rank by wins. One wrong pair moves an item's win count by one, out of n minus 1.\n2. Measured on 100 items: merge sort puts an item 12.6 places off on average (507 cents). Ranking by wins from all pairs puts it 2.9 places off (4,950 cents). That is about 10 times the price for a quarter of the error.\n3. A bracket with different opponents each time also helps: the best item faces new pairs, and each new pair has its own fixed chance of being wrong. A reshuffled bracket needs the pairs to be independent of each other, which is an assumption to state.\n4. Add a second signal: a score per item, or a second judge, and compare scores instead of pairs.\n\nCost: all pairs is n(n - 1) / 2 calls: 4,950 for 100 items, 499,500 for 1,000. Sampling fewer opponents per item cuts that; I have not measured how far.\n\nEdge cases: errors that are not independent across pairs (a systematic bias, such as always preferring the longer answer) cannot be outvoted by any number of pairs; say so and add a different signal.",
     "why": "Repeating an ask only helps when a second ask can differ. If it cannot, the only new information is a different pair.",
     "say": "**If the same pair always gets the same answer, voting is wasted money.** My run: one vote and nine votes gave the same order, nine times the price. What helps is asking each item against many different others and ranking by wins, so one bad pair is outvoted. On 100 items that moved an item 2.9 places off on average instead of 12.6, for about ten times the cents. And if the mistakes are systematic and not independent, no number of pairs fixes it, so I'd add a different signal."
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
     "t": "problem",
     "id": "onsite-comparator-paid-p",
     "title": "A paid comparator that is right 90 percent of the time",
     "source": "PracHub, 'Sort With a 90%-Accurate Paid Comparator' (listed 12 Sep 2026), rebuilt",
     "d": "hard",
     "minutes": 40,
     "why": "Accuracy and cost as functions of a parameter, the limit of voting, and the way the best item's matches decide a bracket. The last part is the exact follow-up PracHub lists. Say it aloud first; open the solution to check it.",
     "statement": "n objects have a hidden order. A paid API before(a, b) says whether a ranks ahead of b. It is right with probability 0.9 and costs 1 cent a call.\n\nPart 1. Sort with one call per comparison. Say which errors are fatal and how accuracy behaves as n grows.\n\nPart 2. Spend more calls to raise accuracy. Give accuracy and cost as functions of n and your parameter, and reach the same accuracy for fewer cents.\n\nPart 3. Only the best item is needed. How do accuracy and cost change?\n\nPart 4. The same pair always gets the same answer. What is achievable?",
     "examples": [
      {
       "input": "200 items, 1 vote, 3 votes, 5 votes, then 'ask until one answer leads by 3'",
       "output": "pairs out of order 3,260, 999, 282, 68.5; cents 1,245, 3,840, 6,464, 4,859",
       "note": "Mean of 10 runs, random errors. Counted by PaidApi below."
      },
      {
       "input": "the best of 256 items, 5 votes in every round, against 3, 3, 5, 9, 9, 9, 11, 11 by round",
       "output": "success 0.946 for 1,275 cents; 0.942 for 1,021 cents",
       "note": "1,000 runs each. The true best plays 8 matches, so 5 votes give 0.99144^8 = 0.934 by the formula."
      },
      {
       "input": "the same pair always gets the same answer, 200 items, 1 vote against 9 votes",
       "output": "the identical order, at 1,266 cents against 11,394",
       "note": "Voting cannot fix a repeatable error. Ranking 100 items by wins from all pairs puts an item 2.9 places off, against 12.6 for merge sort."
      }
     ],
     "constraints": [
      "standard library only",
      "items are compared only through before",
      "each call costs one cent",
      "k = 1 for part 3"
     ],
     "starter": "def sort_paid(items, api, votes=1):\n    ...",
     "hints": [
      "Level 1: a merge sort that takes before(a, b) as its test. Count the calls: that is the cost in cents.",
      "Level 2: make the test a majority of m asks, m odd. Then try asking until one answer leads by 2 or 3: easy pairs stop early.",
      "Level 3: for the best one, a bracket. Only the best item's matches matter, so put the votes where the matches are few: late rounds."
     ],
     "solution": "import random\r\nfrom math import comb\r\n\r\n\r\nclass PaidApi:\r\n    \"\"\"before(a, b): is a ahead of b? Wrong with probability p_wrong. Costs one cent a call.\r\n    mode \"random\": a fresh coin every call. mode \"repeat\": each pair has one fixed answer.\"\"\"\r\n    def __init__(self, p_wrong=0.1, mode=\"random\", seed=0):\r\n        self.p_wrong, self.mode, self.seed = p_wrong, mode, seed\r\n        self.rng, self.calls = random.Random(seed), 0\r\n\r\n    def before(self, a, b):                       # items are ints; the smaller one really ranks first\r\n        self.calls += 1\r\n        if self.mode == \"random\":\r\n            wrong = self.rng.random() < self.p_wrong\r\n        else:                                     # same pair, same answer, in either order\r\n            wrong = random.Random(\"%d:%d:%d\" % (self.seed, min(a, b), max(a, b))).random() < self.p_wrong\r\n        return (a < b) != wrong\r\n\r\n\r\ndef majority(api, a, b, m):\r\n    \"\"\"m asks, an odd number, take the majority.\"\"\"\r\n    return sum(api.before(a, b) for _ in range(m)) * 2 > m\r\n\r\n\r\ndef sequential(api, a, b, lead=2):\r\n    \"\"\"Ask until one answer leads by `lead`. Easy pairs stop early, so it spends fewer cents.\"\"\"\r\n    yes = no = 0\r\n    while abs(yes - no) < lead:\r\n        if api.before(a, b):\r\n            yes += 1\r\n        else:\r\n            no += 1\r\n    return yes > no\r\n\r\n\r\ndef p_majority(p, m):\r\n    \"\"\"Exact chance that a majority of m asks is right when each ask is right with chance p.\"\"\"\r\n    return sum(comb(m, i) * p ** i * (1 - p) ** (m - i) for i in range(m // 2 + 1, m + 1))\r\n\r\n\r\ndef lead_error(p, lead):\r\n    \"\"\"Exact chance that the sequential rule ends on the wrong side (gambler's ruin).\"\"\"\r\n    r = (1 - p) / p\r\n    return r ** lead / (1 + r ** lead)\r\n\r\n\r\ndef lead_asks(p, lead, sweeps=3000):\r\n    \"\"\"Expected asks of the sequential rule, solved by repeated sweeps over the lead -lead+1 .. lead-1.\"\"\"\r\n    e = {i: 0.0 for i in range(-lead, lead + 1)}\r\n    for _ in range(sweeps):\r\n        for i in range(-lead + 1, lead):\r\n            e[i] = 1 + p * e[i + 1] + (1 - p) * e[i - 1]\r\n    return e[0]\r\n\r\n\r\ndef merge_sort(items, before):\r\n    if len(items) <= 1:\r\n        return list(items)\r\n    mid = len(items) // 2\r\n    left, right = merge_sort(items[:mid], before), merge_sort(items[mid:], before)\r\n    out, i, j = [], 0, 0\r\n    while i < len(left) and j < len(right):\r\n        if before(right[j], left[i]):\r\n            out.append(right[j]); j += 1\r\n        else:\r\n            out.append(left[i]); i += 1\r\n    return out + left[i:] + right[j:]\r\n\r\n\r\ndef inversions(order):\r\n    \"\"\"Pairs that are out of order. 0 means sorted.\"\"\"\r\n    return sum(1 for i in range(len(order)) for j in range(i + 1, len(order)) if order[i] > order[j])\r\n\r\n\r\ndef tournament_max(items, before_for_round):\r\n    \"\"\"Knockout bracket. before_for_round(r) gives the comparison used in round r (r = 0, 1, ...).\"\"\"\r\n    alive, r = list(items), 0\r\n    while len(alive) > 1:\r\n        before = before_for_round(r)\r\n        nxt = [a if before(a, b) else b for a, b in zip(alive[0::2], alive[1::2])]\r\n        if len(alive) % 2:\r\n            nxt.append(alive[-1])\r\n        alive, r = nxt, r + 1\r\n    return alive[0]\r\n\r\n\r\ndef rank_by_wins(items, api):\r\n    \"\"\"Ask every pair once and rank by wins. When one pair always gets the same answer, asking it again\r\n    is useless; asking each item against many others is the only cross-check, and it costs n(n-1)/2.\"\"\"\r\n    wins = dict.fromkeys(items, 0)\r\n    for i, a in enumerate(items):\r\n        for b in items[i + 1:]:\r\n            wins[a if api.before(a, b) else b] += 1\r\n    return sorted(items, key=lambda x: -wins[x])\r\n",
     "complexity": "Merge sort with m votes: about m * n log2 n cents. Sequential lead d: about 3.74 asks at d = 3 for p = 0.9. A bracket for the best one: (n - 1) * m cents and a success chance about q^log2 n. Ranking by wins from all pairs: n(n - 1) / 2 cents.",
     "explain": [
      "PaidApi is the counter in front of the oracle. mode 'random' flips a fresh coin each call; mode 'repeat' gives each pair one fixed answer, and the same answer in either order.",
      "majority asks m times and takes the majority. p_majority gives the exact chance that is right: 0.972 at 3 votes, 0.99144 at 5.",
      "sequential asks until one answer leads by `lead`. lead_error and lead_asks give its exact error and average asks by gambler's ruin: 1.22 percent in 2.44 asks at lead 2, 0.137 percent in 3.74 at lead 3.",
      "merge_sort takes any before function, so the same sort runs with 1 vote, 5 votes or the sequential rule. inversions counts pairs out of order, the accuracy measure.",
      "tournament_max plays a bracket and asks which comparison to use in round r, so the votes can differ by round.",
      "rank_by_wins asks every pair once and ranks by wins. It is the only cross-check when a pair always gets the same answer.",
      "The measured output is printed by the tests; the numbers in the examples come from it."
     ],
     "tests": "rng = random.Random(3)\nprint(\"chance a majority of m asks is right, p = 0.9\")\nfor m in (1, 3, 5, 7, 9):\n    print(\"  m = %d: %.5f   cost %d cents a comparison\" % (m, p_majority(0.9, m), m))\nprint(\"sequential rule: lead 2 errs %.4f in %.2f asks; lead 3 errs %.5f in %.2f asks\" % (\n    lead_error(0.9, 2), lead_asks(0.9, 2), lead_error(0.9, 3), lead_asks(0.9, 3)))\n\napi = PaidApi(mode=\"random\", seed=1)\nerrs = sum(sequential(api, 1, 2, 2) is False for _ in range(20000))\nprint(\"measured: lead 2 wrong %.4f of the time, %.2f asks a comparison\" % (errs / 20000, api.calls / 20000))\n\nn = 200\ndata = rng.sample(range(10 * n), n)\nprint(\"sort %d items, p_wrong = 0.1, random errors (mean of 10 runs):\" % n)\nfor m in (1, 3, 5):\n    inv = calls = 0\n    for t in range(10):\n        api = PaidApi(mode=\"random\", seed=100 + t)\n        order = merge_sort(data, lambda a, b: majority(api, a, b, m))\n        inv += inversions(order); calls += api.calls\n    print(\"  %d vote(s): %6.1f pairs out of order, %5d cents\" % (m, inv / 10, calls / 10))\ninv = calls = 0\nfor t in range(10):\n    api = PaidApi(mode=\"random\", seed=100 + t)\n    order = merge_sort(data, lambda a, b: sequential(api, a, b, 3))\n    inv += inversions(order); calls += api.calls\nprint(\"  sequential lead 3: %6.1f pairs out of order, %5d cents\" % (inv / 10, calls / 10))\n\nprint(\"best of 256, 1000 runs, random errors; success = the true best wins:\")\nitems = list(range(256))\ndef trial(sched, seed):\n    api = PaidApi(mode=\"random\", seed=seed)\n    best = tournament_max(items[:], lambda r: (lambda a, b: majority(api, a, b, sched[min(r, len(sched) - 1)])))\n    return best == 0, api.calls\nfor name, sched in ((\"1 vote\", [1]), (\"3 votes\", [3]), (\"5 votes\", [5]), (\"7 votes\", [7]),\n                    (\"1,1,3,3,5,5,7,9 by round\", [1, 1, 3, 3, 5, 5, 7, 9]), (\"3,3,5,9,9,9,11,11 by round\", [3, 3, 5, 9, 9, 9, 11, 11])):\n    wins = cents = 0\n    for s in range(1000):\n        ok, c = trial(sched, 1000 + s)\n        wins += ok; cents += c\n    print(\"  %-28s success %.3f, %5.0f cents\" % (name, wins / 1000, cents / 1000))\nprint(\"  formula, 8 rounds, one path: 0.9^8 = %.3f; 5 votes: %.3f\" % (0.9 ** 8, p_majority(0.9, 5) ** 8))\n\nprint(\"one fixed answer per pair (mode repeat), 200 items:\")\na1, a9 = PaidApi(mode=\"repeat\", seed=5), PaidApi(mode=\"repeat\", seed=5)\no1 = merge_sort(data, lambda a, b: majority(a1, a, b, 1))\no9 = merge_sort(data, lambda a, b: majority(a9, a, b, 9))\nassert o1 == o9\nprint(\"  1 vote and 9 votes give the same order (%d pairs out), 9 votes cost %d cents against %d\" % (inversions(o1), a9.calls, a1.calls))\nsmall = rng.sample(range(1000), 100)\napw = PaidApi(mode=\"repeat\", seed=5)\nby_wins = rank_by_wins(small, apw)\napm = PaidApi(mode=\"repeat\", seed=5)\nby_sort = merge_sort(small, lambda a, b: apm.before(a, b))\ntrue = sorted(small)\ndef drift(order):\n    return sum(abs(order.index(x) - true.index(x)) for x in small) / len(small)\nprint(\"  100 items: merge sort places an item %.1f spots off on average (%d cents); ranking by wins %.1f spots off (%d cents)\" % (\n    drift(by_sort), apm.calls, drift(by_wins), apw.calls))\n"
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
      },
      {
       "q": "Why does the best of n need so many fewer votes than a full sort?",
       "a": "Only the true best item's own matches decide the bracket, about log2 n of them. A full sort needs about n log2 n comparisons right, so the error budget per comparison is far smaller."
      },
      {
       "q": "Why give more votes in the later rounds?",
       "a": "Every round puts the best item in one match, so the risk per round is the same, but the late rounds have few matches and are cheap to vote in. Early rounds have many matches, so a vote there is expensive."
      },
      {
       "q": "Why can an inconsistent comparator break a standard sort?",
       "a": "Sort routines assume a strict weak order: if a is before b and b is before c, then a is before c. Java's sort can throw an error saying the comparison method violates its contract, and C++ std::sort has undefined behaviour with such a comparator. Python's sort returns some order. So check for cycles or wrap the comparator in a consistent one (cache the answer per pair) before sorting."
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
     "text": "**What it is.** A list of quotes between currency pairs and the question 'how much of B do I get for one A'. PracHub lists it as a software engineer question, Medium, tagged onsite (listed 13 Sep 2026): a list of [from, to, rate]; each entry works both ways, so the reverse is 1 over the rate; rates multiply along a chain; the table is consistent, so any chain gives the same product; the same currency returns 1.0; no chain returns -1.0; up to 10,000 entries. Its outline is an undirected graph with edges of weight r and 1/r, a breadth-first or depth-first walk from the source that multiplies the weights, O(R + V). AceOffer says one version of this question was entirely spoken. PracHub gives no follow-ups, so part 2 (the best rate, which brings in logarithms and Bellman-Ford, then arbitrage and stale quotes) is the harder problem the question leads to, not reported wording. Do the reported version first, in two minutes, then say what changes if the table is not consistent."
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
     "hint": "Capabilities: the input shape, the queries, the reverse rate, a consistent table or not, many queries. Errors: no path, same currency, unknown currency, bad rate, loops that gain, stale quotes. Scope: fees, amounts, live updates, size.",
     "solution": "1. Primary capabilities\n- What does a quote look like? Likely (from, to, rate): one unit of from buys rate units of to.\n- Is the reverse rate one over the rate, or a separate quote? Likely a separate quote with a spread; if it is missing, one over the rate.\n- Is the table consistent: does every chain between two currencies give the same product? PracHub's version says yes. Then any chain works, one walk is the whole answer, and logarithms are not needed. If not, the best path matters.\n- Which queries: one conversion, the best rate, or both? Likely both, in two parts.\n- How many currencies and how many queries? PracHub: up to 10,000 entries. Likely a few queries first, then a million.\n\n2. Error handling\n- No chain between two currencies, or an unknown currency? PracHub: return -1.0. I ask which sentinel they want. Never 0, because 0 looks like a real rate.\n- The same currency on both sides? Likely 1.0, even if the currency is in no quote.\n- A rate that is zero or negative? Reject it.\n- Quotes that disagree so a loop makes money? Likely yes: that is arbitrage. Detect and report it, since no best rate exists.\n- Quotes that are stale or missing? Likely quotes carry a timestamp, and old ones are dropped.\n\n3. Scope boundaries\n- Fees and minimum amounts? Percentage fees fold into the rate; a fixed fee depends on the amount and is out.\n- Live updates? Out of scope; follow-up.\n- Do I write code, or talk? Talk.",
     "why": "The reverse-rate question decides whether the best path matters. The query count decides search against precompute. The arbitrage and staleness questions are the two failure modes the problem leads to.",
     "say": "**Three buckets again: what it must do, what goes wrong, where it stops.** I'd ask first whether the table is consistent, because then any chain gives the same answer and one walk is enough. If a reverse rate is a separate quote with a spread, the best path matters. Then what to return with no path (the reported version says -1.0) and for the same currency (1.0), and what to do about loops that gain and stale quotes."
    },
    {
     "t": "write",
     "id": "onsite-ex-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "Part 1, part 2, no path, arbitrage, stale quotes, many queries, out of scope.",
     "solution": "1. convert(src, dst) returns the product of rates along a chain of quotes, the chain with the fewest hops. Test: USD to JPY is 144.4 (0.76 * 190).\n2. The same currency returns 1.0. No chain, or an unknown currency, returns None, or -1.0 in the reported version. Test: USD to USD is 1.0, USD to CAD is None.\n3. A missing reverse quote is one over the rate; a given reverse quote is kept. Test: JPY to GBP is 1 / 190 = 0.00526.\n4. best_rate(src, dst) returns the largest product over any chain. Test: USD to JPY is 145.35 (0.9 * 0.85 * 190), above the 144.4 of the direct route.\n5. If a loop of quotes multiplies to more than 1, say so and give no rate. Test: GBP to USD at 1.40 reports arbitrage.\n6. Quotes older than a maximum age are dropped before searching. Test: with GBP to JPY 90 old and a maximum age of 30, USD to JPY is None.\n7. For many queries, one precompute answers all pairs. Test: the table agrees with best_rate on the example.\n8. The reported version: with a consistent table, chain_rate walks the graph once and costs O(R + V). Test: 9,998 entries agree with price ratios, and a chain of 9,999 hops works with no recursion error.\n9. Out of scope: fixed fees, minimum amounts, live updates, money amounts.",
     "why": "Requirement 4 is why a plain search is not enough. 5 is why the answer is a flag. 6 and 7 are the two follow-ups that come next.",
     "say": "From your answers I get nine requirements. **A conversion, no path means None, a best rate, arbitrage reported, stale quotes dropped, and all pairs for many queries.** I'd put the example numbers next to them: 144.4 for the fewest hops, 145.35 for the best."
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
     "t": "write",
     "id": "onsite-ex-spoken-w",
     "q": "AceOffer says one version was entirely spoken. Say the reported version aloud in about 90 seconds, no code, on three quotes: USD to EUR 0.9, EUR to GBP 0.8, GBP to JPY 200. How many JPY for one USD?",
     "starter": "Model:\nWalk:\nNumbers:\nCost:\nEdge cases:",
     "hint": "Currencies are points, quotes are lines that work both ways. You walk from the source and multiply. Say the cost with R for quotes and V for currencies.",
     "solution": "Model: currencies are nodes. A quote from A to B at rate r is a line with weight r one way and 1 over r the other.\nWalk: start at USD with a value of 1. Visit each currency once, marking it seen. Moving along a line multiplies the value by that line's weight. Stop when you reach the target.\nNumbers: USD to EUR: 1 * 0.9 = 0.9. EUR to GBP: 0.9 * 0.8 = 0.72. GBP to JPY: 0.72 * 200 = 144. So one USD buys 144 JPY. Backwards, JPY to USD is 1 / 144, found by the same walk on the reverse lines.\nCost: every quote is looked at at most twice and every currency once, so O(R + V). For 10,000 quotes that is about 30,000 steps.\nEdge cases: the same currency is 1.0. If the walk ends with no target, there is no chain: return -1.0 (or whatever sentinel they asked for). The table is consistent, so the first chain I find is as good as any other. If it were not, I would say that the walk finds the fewest hops and not the best rate, and ask whether the best rate matters.",
     "why": "Spoken answers fail on the order: model, walk, numbers, cost. This one says the model in one sentence, walks a three-quote example with the arithmetic, and ends with the cost and the sentinel.",
     "say": "**Currencies are points and each quote is a line that works both ways, at the rate one way and one over the rate back.** I start at dollars with a value of one and walk, multiplying. Dollars to euros is 0.9, then to pounds is 0.72, then to yen is 144. Each quote is looked at at most twice, so the cost is the number of quotes plus the number of currencies. Same currency is 1.0, no chain is minus 1.0."
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
     "statement": "You are given quotes (from, to, rate), where one unit of `from` buys `rate` units of `to`. Part 1. Write convert(src, dst) that returns how many units of dst one unit of src buys by following quotes, or None if there is no chain.\n\nPart 2. Return the best rate you can get for src to dst over any chain of quotes. If a loop of quotes lets you end with more than you started with, say so.\n\nPart 3. Quotes carry a timestamp. Drop the old ones. Then answer a million queries.\n\nThe reported version (PracHub) is simpler: a consistent table, each entry works both ways, and chain_rate(entries, src, dst) returns 1.0 for the same currency and -1.0 when there is no chain. Do that first.",
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
      },
      {
       "input": "10,000 entries from a consistent table of prices, chain_rate(entries, 'C2999', 'C0')",
       "output": "price(C2999) / price(C0)",
       "note": "A depth-first walk that multiplies, O(R + V). Same currency 1.0, no chain -1.0."
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
     "solution": "import math\nfrom collections import deque\n\n\ndef build(quotes):\n    \"\"\"quotes: (from, to, rate) meaning 1 `from` buys `rate` of `to`. Adds the inverse edge too.\"\"\"\n    g = {}\n    for a, b, rate in quotes:\n        if rate <= 0:\n            raise ValueError(\"rate must be positive\")\n        g.setdefault(a, {})[b] = rate\n        g.setdefault(b, {}).setdefault(a, 1 / rate)   # an explicit reverse quote is kept, not overwritten\n    return g\n\n\ndef convert(g, src, dst):\n    \"\"\"Part 1: any chain of quotes from src to dst (the fewest hops). None if there is none.\"\"\"\n    if src not in g or dst not in g:\n        return None\n    seen = {src}\n    queue = deque([(src, 1.0)])                       # (currency, product of rates so far)\n    while queue:\n        cur, value = queue.popleft()\n        if cur == dst:\n            return value\n        for nxt, rate in g[cur].items():\n            if nxt not in seen:\n                seen.add(nxt)\n                queue.append((nxt, value * rate))\n    return None\n\n\ndef best_path_slow(g, src, dst, seen=None, value=1.0):\n    \"\"\"First version: try every simple path and keep the largest product. Exponential.\"\"\"\n    seen = (seen or set()) | {src}\n    if src == dst:\n        return value\n    best = None\n    for nxt, rate in g[src].items():\n        if nxt not in seen:\n            got = best_path_slow(g, nxt, dst, seen, value * rate)\n            if got is not None and (best is None or got > best):\n                best = got\n    return best\n\n\ndef best_rate(g, src, dst):\n    \"\"\"Part 2: the largest product. Bellman-Ford on -log(rate). Returns (rate, arbitrage).\"\"\"\n    if src not in g or dst not in g:\n        return None, False                            # an unknown currency is \"no path\", not a crash\n    dist = {c: math.inf for c in g}                   # shortest -log distance = best rate\n    dist[src] = 0.0\n    edges = [(a, b, -math.log(r)) for a, nbrs in g.items() for b, r in nbrs.items()]\n    for _ in range(len(g) - 1):                       # a best path has at most V-1 edges\n        changed = False\n        for a, b, w in edges:\n            if dist[a] + w < dist[b] - 1e-12:         # tolerance, so float noise is not a gain\n                dist[b] = dist[a] + w\n                changed = True\n        if not changed:\n            break\n    for a, b, w in edges:                             # one more pass: any gain left means a loop\n        if dist[a] + w < dist[b] - 1e-9:              # that multiplies to more than 1\n            return None, True\n    return (None if dist[dst] == math.inf else math.exp(-dist[dst])), False\n\n\ndef fresh(quotes, now, max_age):\n    \"\"\"Drop stale quotes. A quote here is (from, to, rate, timestamp). Returns (from, to, rate).\"\"\"\n    return [(a, b, r) for a, b, r, ts in quotes if now - ts <= max_age]\n\n\ndef floyd(g):\n    \"\"\"All pairs at once on -log(rate): O(V^3) once, then each query is a lookup.\"\"\"\n    names = list(g)\n    d = {a: {b: (0.0 if a == b else math.inf) for b in names} for a in names}\n    for a, nbrs in g.items():\n        for b, r in nbrs.items():\n            d[a][b] = min(d[a][b], -math.log(r))\n    for k in names:\n        for i in names:\n            if d[i][k] == math.inf:\n                continue\n            for j in names:\n                if d[i][k] + d[k][j] < d[i][j] - 1e-12:\n                    d[i][j] = d[i][k] + d[k][j]\n    loops = [c for c in names if d[c][c] < -1e-9]          # a currency that can reach itself with a gain\n    table = {a: {b: (None if d[a][b] == math.inf else math.exp(-d[a][b])) for b in names} for a in names}\n    return table, loops\n\n\ndef exchange(quotes, src, dst, best=True, now=None, max_age=None):\n    \"\"\"The whole answer in one place: drop stale quotes, build the graph, then a search or the best rate.\"\"\"\n    if max_age is not None:\n        quotes = fresh(quotes, now, max_age)\n    g = build(quotes)\n    return best_rate(g, src, dst) if best else (convert(g, src, dst), False)\n\n\ndef chain_rate(entries, src, dst):\n    \"\"\"The version reported for the onsite: entries (from, to, rate), each works both ways, the table is\n    consistent, so ANY chain gives the same product. 1.0 if src == dst, -1.0 if there is no chain.\n    A plain depth-first walk that multiplies as it goes: O(R + V), and no recursion for 10,000 entries.\"\"\"\n    if src == dst:\n        return 1.0\n    g = {}\n    for a, b, r in entries:\n        g.setdefault(a, []).append((b, r))\n        g.setdefault(b, []).append((a, 1 / r))        # the reverse works at one over the rate\n    seen, stack = {src}, [(src, 1.0)]\n    while stack:\n        cur, value = stack.pop()\n        if cur == dst:\n            return value\n        for nxt, r in g.get(cur, ()):\n            if nxt not in seen:\n                seen.add(nxt)\n                stack.append((nxt, value * r))\n    return -1.0\n",
     "complexity": "chain_rate: O(R + V) once, for a consistent table. convert: O(V + E) per query. best_path_slow: exponential, only for checking. best_rate: O(V * E) with O(V + E) space. floyd: O(V^3) once, then O(1) a query, and it finds currencies on a profitable loop.",
     "explain": [
      "build stores a dict of dicts. If the reverse quote is not given, it adds 1 / rate. If it is given, it keeps it, because a real reverse quote has a spread.",
      "convert is a breadth-first search that carries the product. It finds the chain with the fewest hops, not the best rate. Say that distinction out loud.",
      "best_path_slow tries every simple path. It is the honest first version and it is how you check the fast one on small inputs.",
      "best_rate uses -log(rate) as the weight. A rate above 1 gives a negative weight, which is why Dijkstra is not allowed. It now returns None for an unknown currency instead of raising.",
      "Bellman-Ford relaxes every edge V - 1 times, and one more pass finds a negative cycle. The small tolerance stops float rounding from looking like a gain.",
      "fresh drops quotes older than the maximum age; with GBP to JPY 90 old and a limit of 30, USD to JPY has no path.",
      "floyd computes every pair once. A currency whose own distance is negative is on a profitable loop; with GBP to USD at 1.40 it lists EUR, GBP, JPY and USD, since JPY connects back to GBP.",
      "exchange is the plan: drop stale quotes, build, then search or best rate.",
      "chain_rate is the reported version. A consistent table means any chain gives the same product, so a depth-first walk with a seen set is the whole answer. It uses a stack, not recursion, so 10,000 entries in a line cannot overflow."
     ],
     "tests": "quotes = [(\"USD\", \"EUR\", 0.90), (\"EUR\", \"USD\", 1.10), (\"EUR\", \"GBP\", 0.85), (\"GBP\", \"EUR\", 1.15),\n          (\"USD\", \"GBP\", 0.76), (\"GBP\", \"USD\", 1.28), (\"GBP\", \"JPY\", 190.0), (\"CHF\", \"CAD\", 1.5)]\ng = build(quotes)\nprint(\"fewest hops USD>JPY:\", round(convert(g, \"USD\", \"JPY\"), 2))\nprint(\"USD>CAD:            \", convert(g, \"USD\", \"CAD\"))\nprint(\"JPY>GBP (inverse):  \", round(convert(g, \"JPY\", \"GBP\"), 5))\nrate, arb = best_rate(g, \"USD\", \"JPY\")\nprint(\"best USD>JPY:       \", round(rate, 2), arb)\nassert abs(rate - best_path_slow(g, \"USD\", \"JPY\")) < 1e-9\nassert convert(g, \"USD\", \"USD\") == 1.0 and best_rate(g, \"USD\", \"CAD\") == (None, False)\nbad = build([q if q[:2] != (\"GBP\", \"USD\") else (\"GBP\", \"USD\", 1.40) for q in quotes])\nprint(\"GBP>USD quoted 1.40:\", best_rate(bad, \"USD\", \"JPY\"))\n\ntable, loops = floyd(g)\nassert abs(table[\"USD\"][\"JPY\"] - rate) < 1e-9 and loops == []\nprint(\"floyd USD>JPY:      \", round(table[\"USD\"][\"JPY\"], 2), \"loops:\", loops)\nbad_table, bad_loops = floyd(bad)\nprint(\"floyd with 1.40:    \", sorted(bad_loops))\nassert {\"USD\", \"EUR\", \"GBP\"} <= set(bad_loops)\nstamped = [q + (100,) for q in quotes]\nstamped = [q if q[:2] != (\"GBP\", \"JPY\") else q[:3] + (10,) for q in stamped]     # GBP>JPY is 90 old\nprint(\"stale GBP>JPY, max age 30:\", exchange(stamped, \"USD\", \"JPY\", now=100, max_age=30))\nassert exchange(stamped, \"USD\", \"JPY\", now=100, max_age=30) == (None, False)\nassert abs(exchange(stamped, \"USD\", \"JPY\", now=100, max_age=300)[0] - 145.35) < 1e-9\nprint(\"fresh enough, max age 300:\", round(exchange(stamped, \"USD\", \"JPY\", now=100, max_age=300)[0], 2))\n\nimport random as _random\n_rng = _random.Random(2)\nprice = {\"C%d\" % i: _rng.uniform(0.5, 200) for i in range(3000)}      # a consistent table: rate = price(from) / price(to)\nnames = list(price)\nentries = [(names[i], names[_rng.randrange(i)], 0) for i in range(1, 3000)]\nentries += [(_rng.choice(names), _rng.choice(names), 0) for _ in range(7000)]\nentries = [(a, b, price[a] / price[b]) for a, b, _ in entries if a != b]\ngot = chain_rate(entries, \"C2999\", \"C0\")\nassert abs(got - price[\"C2999\"] / price[\"C0\"]) < 1e-9\nassert chain_rate(entries, \"C5\", \"C5\") == 1.0 and chain_rate(entries, \"C5\", \"nowhere\") == -1.0\nline = [(\"L%d\" % i, \"L%d\" % (i + 1), 1.0001) for i in range(9999)]       # one chain of 9,999 hops, no recursion error\nassert abs(chain_rate(line, \"L0\", \"L9999\") - 1.0001 ** 9999) < 1e-9\nprint(\"chain_rate: %d entries agree with price ratios; same currency 1.0; no chain -1.0; a 9,999-hop line works\" % len(entries))\n"
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
      },
      {
       "q": "The table is consistent. Why do you not need logarithms or Bellman-Ford?",
       "a": "A consistent table means every chain between two currencies multiplies to the same number, so there is no better route and no arbitrage loop. One walk that multiplies is enough: O(R + V). Logarithms matter only when the quotes can disagree."
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
     "text": "**What it is.** You can see a social network only through an API, and each call costs something. PracHub lists the fuller version as a machine learning engineer onsite question, Medium (listed 25 Sep 2026): get_friends(user_id), each call a network round trip, and collect everyone within k hops of a start user s. Its outline is a layered breadth-first search with a visited set that expands only the users at distance below k. The call count is then the number of users with distance below k, which is a lower bound for the version that wants only the set. If the edges among the users at distance k are needed, those are expanded too. For the API's restrictions it lists pagination (about ceil(d / c) calls for a user with d friends and a page of c), a token bucket or pacing, exponential backoff with jitter, checkpointing, partial results, and caching with staleness. Its follow-ups are: the shortest path between two users (bidirectional breadth-first search, expanding the smaller frontier), huge friend lists, a changing graph, and a shared global rate limit (a central scheduler or a shared token bucket). AceOffer's synthesis lists the same question with no more detail. Below, the shortest-path version is worked first, then the k-hop set version the page describes."
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
     "solution": "1. Primary capabilities\n- What does one call return? Likely friends(u): the full friend list of one user. Ask about a page size.\n- What is the question: everyone within k hops of one user, or the hops between two users, or the path? PracHub: everyone within k hops. The shortest-path question is its follow-up. I ask, because the two have different lower bounds.\n- If it is the set within k hops: do I need only who they are, or also the friendships among the users at distance k? Only who they are is cheaper by a whole layer of calls.\n- Is there a batch call? Likely yes, as a follow-up.\n- Many questions on the same network? Likely yes, so a cache across queries pays.\n\n2. Error handling\n- What does a call cost, and is there a rate limit? Likely a limit; retry with backoff and jitter, with a cap.\n- A private or unknown user? Likely an empty list. That is an answer, not an error.\n- A user with a million friends? Likely a page, not a list; ask the page size.\n\n3. Scope boundaries\n- Do friendships go both ways? Likely yes. If not, the far end cannot be searched backwards, so no bidirectional search.\n- Is there a limit on distance? A cap of 3 or 4 hops saves most of the calls.\n- Which cost matters: calls, time, or load on their server? Calls first, then time.\n- Code, or talk? Talk.",
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
     "t": "write",
     "id": "onsite-fr-khop-reqs-w",
     "q": "Now the PracHub version: everyone within k hops of s. Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "The set, the call count, the layers, pagination, rate limit, errors, resume, shared limit, out of scope.",
     "solution": "1. within_k(s, k) returns every user with distance at most k from s, with the distance. Test: it equals a plain search on the dict (1,790 users within 3 hops on the test network).\n2. Only users at distance below k are asked about. Test: 159 users asked, and exactly that many users have distance below 3.\n3. A user's whole friend list is taken page by page. Test: with pages of 8, the call count is the sum of ceil(friends / 8) over the asked users (316).\n4. Each page waits for a token. Test: at 20 a second with a burst of 5, the attempts never exceed 20 times the elapsed seconds plus 5.\n5. A rate-limit error backs off with full jitter and a cap, then retries, and gives up after a number of tries. Test: every 7th call refused, the answer is still right.\n6. A stopped run resumes from its saved state and never asks a user twice. Test: stop after 40 users, resume, 316 calls in total.\n7. If the friendships among the outermost users are needed, one more layer is expanded. Test: 3,597 calls instead of 316.\n8. Several crawlers can share one limit. Test: two crawlers on one bucket stay at the limit; 8 threads on a bucket of 50 get exactly 50.\n9. Out of scope: weighted edges, a changing graph, an exact path.",
     "why": "Requirement 2 is the lower bound. 3 to 6 are the four restrictions the page lists. 7 and 8 are two of its follow-ups.",
     "say": "**Nine requirements, each with a number from the run.** The set within k hops, only users below distance k asked about, pages, a token bucket, backoff with jitter, a resume that never asks twice, one more layer if the edges between the outermost users are needed, and one limit shared by several crawlers. The count I can say out loud: 159 users asked, 316 calls with pages of eight, against 3,597 if I also expanded the outermost layer."
    },
    {
     "t": "write",
     "id": "onsite-fr-khop-entities-w",
     "q": "List the nouns for the k-hop version. For each, keep or drop, why, and the data structure.",
     "starter": "User: \nFriend list: \nLayers: \nDistance map: \nAsked set: \nToken bucket: \nClock: \nSaved state: ",
     "hint": "What must survive a crash? What is shared between crawlers? What is only an id?",
     "solution": "User: drop as a class. An id.\nFriend list: drop. What a fetch returns, assembled from pages.\nLayers: keep. A list of lists: layers[d] holds the users first met at distance d. Each layer is expanded in turn.\nDistance map: keep. A dict from user to distance; it is also the seen set.\nAsked set: keep. The users whose friend list is already taken. It is what makes a resume safe.\nToken bucket: keep. Tokens, a rate, a burst, a lock. Shared by every crawler that must obey one limit.\nClock: keep as an injected object (time, sleep), so the test never sleeps and the real one does.\nSaved state: keep. The distance map, the layers and the asked set. Write it out after each user and a crash loses at most the call in flight.",
     "why": "Three structures carry the answer (layers, distance map, asked set). The bucket and the clock carry the restrictions.",
     "say": "I'd keep the layers, the distance map that doubles as a seen set, an asked set, a token bucket with a lock and a clock I can swap. **The asked set and the layers are the saved state**, so a crash costs one call at most."
    },
    {
     "t": "write",
     "id": "onsite-fr-khop-w",
     "q": "Write the steps for within_k(s, k): the layers, the lower bound on calls, then each restriction (pages, token bucket, backoff with jitter, checkpoint, shared limit) and the shortest-path follow-up. Put numbers on each.",
     "starter": "Layers:\nLower bound:\nPages:\nToken bucket:\nBackoff with jitter:\nCheckpoint:\nShared limit:\nShortest path:",
     "hint": "Users at distance k are named by the friends of users at distance k minus 1. Do you need to ask them?",
     "solution": "Layers (breadth-first):\n1. dist = {s: 0}, layer 0 = [s], asked = {}.\n2. For d = 0 up to k minus 1: for each user u in layer d, take u's whole friend list; every friend not in dist gets distance d + 1 and joins layer d + 1.\n3. Users in layer k are never asked about. They are already in the answer, because a friend list names them.\n4. Cost: one fetch per user at distance below k. On the test network, 159 users, 316 calls.\n\nLower bound (the argument to say):\n1. A user at distance below k may have friends at distance exactly k that nobody else has told you about. The only way to learn them is to ask that user.\n2. So for the version that wants only the set, every user with distance below k must be asked, and no algorithm that has only get_friends can do fewer. The layered search asks exactly those users, so it is optimal.\n3. With branching b the count is about (b^k minus 1) / (b minus 1): 1 + 12 + 144 = 157 for k = 3, b = 12, close to the 159 measured.\n4. If the friendships among the users at distance k are needed, those users must be asked too: 3,597 calls instead of 316.\n\nPages: a user with d friends and a page of c costs ceil(d / c) calls (at least 1). Take pages with a cursor until it is None. Celebrities: stop at a page cap, or skip, and say that the answer is partial.\n\nToken bucket: tokens refill at rate r up to a burst b. Before each call take a token, or sleep until one exists. Long-run calls are at most r per second; the burst allows b at once. Measured: 20 a second, burst 5: 368 attempts in 22.2 s.\n\nBackoff with jitter: on a rate-limit error wait a random time between 0 and min(cap, base * 2^attempt) (full jitter), then retry up to a number of tries. Without jitter every refused client retries at the same moment (AWS Architecture Blog, exponential backoff and jitter); jitter spreads them.\n\nCheckpoint: save the distance map, the layers and the asked set after each user. On restart skip users in the asked set. Only the call in flight can repeat. Measured: stop after 40 users, resume, 316 calls in total, none twice.\n\nShared global limit: one token bucket shared by every crawler, taken under a lock; or one scheduler process that owns all calls. Measured: two crawlers on one bucket made 49 calls in 2.2 s, which is the limit plus the burst. 8 threads on a bucket of 50 got exactly 50.\n\nShortest path between two users (the follow-up): bidirectional breadth-first search, expanding the smaller frontier, as in the section above. Two balls of radius d / 2 hold far fewer users than one ball of radius d.\n\nEdge cases: k = 0 (just s); a user with no friends; a page that fails halfway (retry the page, not the user); a user listed twice; the graph changes between pages (give cache entries a time limit).",
     "why": "The lower bound is the one claim an interviewer will test. The restrictions are mechanical once the layers are right, and each has a number you can say.",
     "say": "**For the set within k hops I expand layer by layer and only ask about users below distance k.** The users at distance k are already named by their neighbours' lists, and any user below k may have a friend at k that only they can tell me about, so every one of them has to be asked. That is the lower bound: 159 users and 316 calls on my test network. On top: pages, a token bucket, backoff with jitter, a saved state so a crash repeats at most one call, and one shared bucket if several crawlers share a limit. For the shortest path between two users I switch to growing a ball from each end."
    },
    {
     "t": "write",
     "id": "onsite-fr-khop-code-w",
     "q": "Write within_k first at the level you would say it aloud. Name the helpers, do not write them yet.",
     "starter": "def within_k(fetch, s, k, state=None, max_new_calls=None, with_edges=False):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "Layers; skip the asked; one fetch per user; mark the new ones; stop at the layer limit.",
     "solution": "def within_k(fetch, s, k, state=None, max_new_calls=None, with_edges=False):\n    \"\"\"Everyone within k hops, in layers. Only users below distance k are asked about.\"\"\"\n    state = state or new_state(s)                       # distance map, layers, asked set\n    dist, layers, asked = state[\"dist\"], state[\"layers\"], state[\"asked\"]\n    last = k + 1 if with_edges else k                   # the edges among the outermost users need one more layer\n    for d in range(last):\n        for u in list(layers[d]):\n            if u in asked:\n                continue                                # asked before a stop: never twice\n            for v in fetch(u):                          # fetch = pages + token bucket + backoff with jitter\n                if v not in dist:\n                    dist[v] = d + 1\n                    layers[d + 1].append(v)\n            asked.add(u)                                # state saved after each user\n    return dist\n\n# helpers, defined in the workbench below:\n#   make_fetch(api, bucket, clock, rng)   all pages of one user, with a token and a backoff per page\n#   TokenBucket(rate, burst, clock)       shared by every crawler on one limit\n#   new_state(s)                          the saved state",
     "why": "The plan fits in twelve lines. Everything the API does to you hides inside fetch, so the algorithm stays a plain layered search.",
     "say": "I'd write within_k first: **layers, skip anyone already asked, one fetch per user, mark the new friends one layer out.** The pages, the token bucket and the backoff all live inside fetch, so the search itself stays small and easy to resume."
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
     "t": "problem",
     "id": "onsite-friend-khop-p",
     "title": "Everyone within k hops, through a restricted API",
     "source": "PracHub, 'Exploring a Friend Network Through a Restricted API With as Few Calls as Possible' (listed 25 Sep 2026), rebuilt",
     "d": "medium",
     "minutes": 40,
     "why": "The call is the cost, and the API pushes back: pages, a rate limit, errors, a crash. Each restriction has a small standard answer and a number. Say it aloud first; open the solution to check it.",
     "statement": "get_friends(user_id, cursor) returns one page of a user's friends and the next cursor. Each call is a network round trip.\n\nPart 1. Return everyone within k hops of s, with their distance, using as few calls as possible. Say why you cannot do fewer.\n\nPart 2. The API is paged, rate limited with a token bucket, and sometimes refuses a call. Handle all three.\n\nPart 3. The run can stop. Resume it without asking a user twice.\n\nPart 4. Several crawlers share one rate limit.",
     "examples": [
      {
       "input": "20,000 users, about 12 friends each, s = 0, k = 3, pages of 8",
       "output": "1,790 users found; 159 asked about; 316 calls",
       "note": "159 is the count of users with distance below 3. Asking the outermost layer too would be 3,597 calls."
      },
      {
       "input": "20 calls a second, burst 5, every 7th call refused",
       "output": "368 attempts in 22.2 s, same answer",
       "note": "On a fake clock, so the test never sleeps. Full jitter on every refusal."
      },
      {
       "input": "stop after 40 users, resume from the saved state",
       "output": "316 calls in total, none twice",
       "note": "The asked set is what makes the resume safe."
      }
     ],
     "constraints": [
      "standard library only",
      "friendships go both ways",
      "a user's friends are only visible through get_friends",
      "time comes from an injected clock"
     ],
     "starter": "def within_k(fetch, s, k):\n    ...",
     "hints": [
      "Level 1: layer by layer. A user at distance d puts its friends at distance d + 1. Do you have to ask a user at distance k?",
      "Level 2: wrap one user's friend list in fetch(u): loop over the pages, and before each page wait for a token.",
      "Level 3: catch the rate-limit error, sleep a random time between 0 and min(cap, base * 2 ** attempt), and retry up to a limit. Keep the distance map, layers and asked set in one dict you can save."
     ],
     "solution": "import random\r\nimport threading\r\nfrom collections import deque\r\n\r\n\r\nclass RateLimited(Exception):\r\n    pass\r\n\r\n\r\nclass Clock:\r\n    \"\"\"A fake clock, so a test never sleeps.\"\"\"\r\n    def __init__(self):\r\n        self.now = 0.0\r\n\r\n    def time(self):\r\n        return self.now\r\n\r\n    def sleep(self, seconds):\r\n        self.now += seconds\r\n\r\n\r\nclass TokenBucket:\r\n    \"\"\"`rate` tokens a second, at most `burst` stored. Safe to share between threads or crawlers.\"\"\"\r\n    def __init__(self, rate, burst, clock):\r\n        self.rate, self.burst, self.clock = rate, burst, clock\r\n        self.tokens, self.last = float(burst), clock.time()\r\n        self.lock = threading.Lock()\r\n\r\n    def try_take(self):\r\n        \"\"\"0.0 if a token was taken, else the seconds until one exists.\"\"\"\r\n        with self.lock:\r\n            now = self.clock.time()\r\n            self.tokens = min(self.burst, self.tokens + (now - self.last) * self.rate)\r\n            self.last = now\r\n            if self.tokens >= 1 - 1e-9:                  # tolerance, so float rounding cannot make it wait forever\r\n                self.tokens = max(0.0, self.tokens - 1)\r\n                return 0.0\r\n            return (1 - self.tokens) / self.rate\r\n\r\n    def wait(self):\r\n        while True:\r\n            w = self.try_take()\r\n            if w == 0.0:\r\n                return\r\n            self.clock.sleep(w)\r\n\r\n\r\nclass PagedApi:\r\n    \"\"\"get_friends(u, cursor) returns (one page of friends, next cursor or None).\r\n    Every `fail_every`th call raises RateLimited, to test the backoff.\"\"\"\r\n    def __init__(self, graph, page=8, fail_every=0):\r\n        self.graph, self.page, self.fail_every, self.attempts = graph, page, fail_every, 0\r\n\r\n    def get_friends(self, u, cursor=None):\r\n        self.attempts += 1\r\n        if self.fail_every and self.attempts % self.fail_every == 0:\r\n            raise RateLimited(u)\r\n        friends = self.graph.get(u, [])\r\n        start = cursor or 0\r\n        end = start + self.page\r\n        return friends[start:end], (end if end < len(friends) else None)\r\n\r\n\r\ndef make_fetch(api, bucket, clock, rng, max_tries=6, cap=30.0):\r\n    \"\"\"One user's whole friend list: every page waits for the bucket, and a rate-limit error\r\n    backs off with full jitter (a random wait between 0 and the capped exponential).\"\"\"\r\n    def fetch(u):\r\n        out, cursor = [], None\r\n        while True:\r\n            for attempt in range(max_tries):\r\n                bucket.wait()\r\n                try:\r\n                    page, nxt = api.get_friends(u, cursor)\r\n                    break\r\n                except RateLimited:\r\n                    clock.sleep(rng.uniform(0, min(cap, 0.5 * 2 ** attempt)))\r\n            else:\r\n                raise RateLimited(u)\r\n            out += page\r\n            if nxt is None:\r\n                return out\r\n            cursor = nxt\r\n    return fetch\r\n\r\n\r\ndef new_state(s):\r\n    return {\"dist\": {s: 0}, \"layers\": [[s]], \"asked\": set()}\r\n\r\n\r\ndef within_k(fetch, s, k, state=None, max_new_calls=None, with_edges=False):\r\n    \"\"\"Everyone within k hops of s, in k layers. Only users at distance < k are asked about:\r\n    users at distance k are named by their friends, so asking them adds nothing to the set.\r\n    `state` makes it resumable. Returns (distances, state, finished).\"\"\"\r\n    state = state or new_state(s)\r\n    dist, layers, asked = state[\"dist\"], state[\"layers\"], state[\"asked\"]\r\n    last_layer = k + 1 if with_edges else k          # edges among the outermost users need one more layer\r\n    new_calls = 0\r\n    for d in range(last_layer):\r\n        while len(layers) <= d + 1:\r\n            layers.append([])\r\n        for u in list(layers[d]):\r\n            if u in asked:\r\n                continue                              # asked before the crash: do not ask again\r\n            if max_new_calls is not None and new_calls >= max_new_calls:\r\n                return dist, state, False             # checkpoint: the state is already saved in `state`\r\n            friends = fetch(u)\r\n            new_calls += 1\r\n            for v in friends:\r\n                if v not in dist:\r\n                    dist[v] = d + 1\r\n                    layers[d + 1].append(v)\r\n            asked.add(u)\r\n    return dist, state, True\r\n\r\n\r\ndef bfs_truth(graph, s, k):\r\n    \"\"\"Ground truth straight from the dict, no api.\"\"\"\r\n    dist, queue = {s: 0}, deque([s])\r\n    while queue:\r\n        u = queue.popleft()\r\n        if dist[u] == k:\r\n            continue\r\n        for v in graph.get(u, []):\r\n            if v not in dist:\r\n                dist[v] = dist[u] + 1\r\n                queue.append(v)\r\n    return dist\r\n",
     "complexity": "Calls: one fetch per user at distance below k, each costing ceil(friends / page) calls. Time: calls divided by the rate, plus backoff. Memory: the users within k hops. Resume: nothing repeated except the call in flight.",
     "explain": [
      "Clock is a fake clock with time and sleep. The real one has the same two methods. It is why the test of a 22 second run takes no time.",
      "TokenBucket refills at `rate` a second up to `burst`. try_take returns 0.0 when a token was taken, otherwise the seconds to wait. The lock makes it safe to share. The 1e-9 tolerance stops float rounding from waiting forever.",
      "PagedApi returns one page and a cursor, and refuses every `fail_every`th call.",
      "make_fetch takes all pages of one user. Each page waits for a token. A refusal sleeps a random time between 0 and the capped exponential (full jitter) and retries.",
      "within_k is the layered search. It asks only users below distance k, skips the asked ones, and keeps everything in one state dict, so a stop returns state and a second call continues.",
      "bfs_truth is the ground truth from the dict, for the tests.",
      "The measured output is printed by the tests: 159 users asked, 316 calls, 3,597 if the outermost layer is also asked, 368 attempts in 22.2 s, 49 calls in 2.2 s for two crawlers on one bucket."
     ],
     "tests": "rng = random.Random(7)\nn, deg = 20000, 6\ngraph = {u: [] for u in range(n)}\nfor u in range(n):\n    for _ in range(deg):\n        v = rng.randrange(n)\n        if v != u and v not in graph[u]:\n            graph[u].append(v)\n            graph[v].append(u)\ns, k = 0, 3\nwant = bfs_truth(graph, s, k)\nasked_users = [u for u, d in want.items() if d < k]\npages = sum(max(1, -(-len(graph[u]) // 8)) for u in asked_users)\nprint(\"within %d hops of user %d: %d users; %d are at distance below %d\" % (k, s, len(want), len(asked_users), k))\n\nclock = Clock()\napi = PagedApi(graph, page=8)\nfetch = make_fetch(api, TokenBucket(1e9, 1e9, clock), clock, random.Random(1))\ndist, state, done = within_k(fetch, s, k)\nassert done and dist == want\nassert len(state[\"asked\"]) == len(asked_users) and api.attempts == pages\nprint(\"layered search: %d users asked about, %d calls (pages of 8); the users below distance k, no more\" % (len(state[\"asked\"]), api.attempts))\n\nnaive_api = PagedApi(graph, page=8)\nnaive_fetch = make_fetch(naive_api, TokenBucket(1e9, 1e9, clock), clock, random.Random(1))\nwithin_k(naive_fetch, s, k + 1)\nprint(\"asking the users at distance %d as well would be %d calls instead of %d\" % (k, naive_api.attempts, api.attempts))\n\nedge_api = PagedApi(graph, page=8)\nedge_fetch = make_fetch(edge_api, TokenBucket(1e9, 1e9, clock), clock, random.Random(1))\nwithin_k(edge_fetch, s, k, with_edges=True)\nprint(\"the edges among the outermost users need that extra layer: %d calls\" % edge_api.attempts)\n\nclock = Clock()\napi = PagedApi(graph, page=8, fail_every=7)\nbucket = TokenBucket(20, 5, clock)\nfetch = make_fetch(api, bucket, clock, random.Random(2))\ndist, _, done = within_k(fetch, s, k)\nassert done and dist == want\nelapsed = clock.time()\nprint(\"rate limit 20 a second, burst 5, every 7th call refused: %d attempts in %.1f s\" % (api.attempts, elapsed))\nassert api.attempts <= 20 * elapsed + 5 + 1\n\nfirst = PagedApi(graph, page=8)\nclock = Clock()\nfetch = make_fetch(first, TokenBucket(1e9, 1e9, clock), clock, random.Random(1))\ndist, state, done = within_k(fetch, s, k, max_new_calls=40)\nassert not done and len(state[\"asked\"]) == 40\nbefore_resume = first.attempts\ndist, state, done = within_k(fetch, s, k, state=state)\nassert done and dist == want\nassert len(state[\"asked\"]) == len(asked_users) and first.attempts == pages\nprint(\"stop after 40 users, resume from the saved state: no user asked twice (%d calls in total, %d before the stop)\" % (first.attempts, before_resume))\n\nclock = Clock()\nshared = TokenBucket(20, 5, clock)\na1, a2 = PagedApi(graph, page=8), PagedApi(graph, page=8)\nf1 = make_fetch(a1, shared, clock, random.Random(1))\nf2 = make_fetch(a2, shared, clock, random.Random(2))\nwithin_k(f1, 0, 2)\nwithin_k(f2, 1, 2)\ntotal = a1.attempts + a2.attempts\nprint(\"two crawlers on one shared bucket: %d calls in %.1f s = %.1f a second (limit 20, burst 5)\" % (total, clock.time(), total / clock.time()))\nassert total <= 20 * clock.time() + 5 + 1\n\nfrozen = TokenBucket(1, 50, Clock())\ngranted = []\n\n\ndef hammer():\n    granted.append(sum(1 for _ in range(100) if frozen.try_take() == 0.0))\n\n\nthreads = [threading.Thread(target=hammer) for _ in range(8)]\n[t.start() for t in threads]\n[t.join() for t in threads]\nassert sum(granted) == 50\nprint(\"8 threads, 800 tries, a bucket of 50: exactly %d granted\" % sum(granted))\n"
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
      },
      {
       "q": "Why do you not ask about the users at distance k?",
       "a": "Their names are already in the friend lists of the users at distance k minus 1, and for the set you need nothing else about them. Asking them would cost a whole layer, 3,597 calls instead of 316 on the test network. You ask them only if the friendships among the outermost users are required."
      },
      {
       "q": "Why is the layered search the best possible for the set?",
       "a": "A user at distance below k can have a friend at distance k that only that user's list reveals. Any algorithm with only get_friends must ask every such user. The layered search asks exactly those, so no algorithm does better."
      },
      {
       "q": "Why full jitter and not a plain exponential wait?",
       "a": "With a plain wait every refused client retries at the same moments and refuses each other again. A random wait between 0 and the capped exponential spreads them. The AWS Architecture Blog's simulation with 100 clients found jitter cut the calls by more than half."
      },
      {
       "q": "Why does the token bucket take a lock?",
       "a": "Two threads can both read 'one token left' and both take it. Under the lock the refill, the check and the take are one step. The test with 8 threads on a bucket of 50 grants exactly 50."
      },
      {
       "q": "What can repeat after a crash?",
       "a": "Only the call in flight, because the asked set is updated after a user's friend list is complete. A page that fails halfway is retried as a page, not as a user."
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
   "id": "onsite-dedupe",
   "title": "4. A million user IDs: check and insert",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** One service receives user IDs and must answer 'is this one new?' and record it, fast. PracHub lists it as a software engineer technical-screen question, Medium (listed 4 Oct 2026): check-and-insert for a million user IDs, balancing latency, memory and accuracy. Its outline is a hash set against a Bloom filter (a hit means maybe, so confirm against an exact store), an atomic check-and-insert, deletions (counting or cuckoo filters), a write-ahead log plus sorted segments, and sharding. Its follow-up: two servers receive the same new ID, so use a conditional or unique-key insert. It was reported for a screen, not the onsite, and the page is a reconstruction. It fits the onsite's wording about infrastructure decisions, so it is here as preparation. The numbers below come from the code in the workbench."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Ask what an error costs. A false 'new' makes a duplicate user. A false 'seen' that is checked against the exact store costs a read; one that is shown to the user costs a customer."
    },
    {
     "t": "write",
     "id": "onsite-dd-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: what the call returns, how many ids, how fast, mostly new or mostly repeats. Errors: two at the same moment, a crash, deletions, a wrong answer. Scope: exact or approximate, one machine or many, code or talk.",
     "solution": "1. Primary capabilities\n- What does the call return? Likely True if the id is new and now recorded, False if it was already there.\n- How many ids and how fast? Likely a million now, a billion later; a few milliseconds. A million fits in memory; a billion does not.\n- Mostly new ids (signup) or mostly repeats (dedupe an event stream)? It decides whether a Bloom filter pays.\n- What is the price of a wrong answer? Likely a false 'new' is not allowed (a duplicate user). A false 'maybe' that is then checked is fine.\n\n2. Error handling\n- Two requests with the same new id at the same moment? Likely yes: exactly one wins.\n- A crash after the answer: must the id survive? Likely yes, so the log is written first.\n- Can an id be deleted, and reused? Likely yes: accounts are deleted.\n- Two servers receive the same new id? PracHub's follow-up. Yes later: the database decides, not memory.\n\n3. Scope boundaries\n- Exact for 'new', approximate only as a first filter? Yes.\n- One machine, or sharded? One first, then say how it shards.\n- Do I write code, or talk? Talk.",
     "why": "The price of a wrong answer picks the structure: approximate in front, exact behind. Mostly-new or mostly-repeats picks whether the filter pays. The two-servers question moves the authority from memory to the database.",
     "say": "**Three buckets: what it must do, what goes wrong, where it stops.** The question I care about most is what a wrong answer costs. A false 'new' makes a duplicate user, so that can never happen. A false 'maybe' only costs a read, so a Bloom filter in front is fine as long as an exact store has the last word. Then two servers: the database decides, not memory."
    },
    {
     "t": "p",
     "text": "**b) Requirements.**"
    },
    {
     "t": "write",
     "id": "onsite-dd-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "The call, atomic, never a false new, the filter's rules, delete, memory, many servers, the log, out of scope.",
     "solution": "1. check_and_insert(id) returns True the first time and False after. Test: 8 threads offering the same 5,000 ids get exactly 5,000 True in total.\n2. The check and the insert are one step. Test: the same run, so no id is reported new twice.\n3. An id that exists is never reported new. Test: 100,000 offers with repeats say 'new' exactly 48,672 times, the number of distinct ids.\n4. A Bloom filter in front says only 'certainly not here' or 'maybe', and a 'maybe' is confirmed against the exact store. Test: 1.03 percent false positives at 9.6 bits an id, and no false negatives.\n5. remove(id) frees the id for reuse. Test: remove then insert returns True. A plain Bloom filter cannot remove; the counting version can.\n6. Memory is stated: a million ids in a hash set about 62 MB; a Bloom filter at 1 percent 1.2 MB; at 0.1 percent 1.8 MB.\n7. With many servers a unique key in the database decides. Test: 4 servers offering the same 300 ids give 300 True and 300 rows.\n8. An id is written to a log before it becomes visible, so a crash cannot lose an id the caller was told about.\n9. Out of scope: consensus across regions, id generation, access control.",
     "why": "Requirements 1 to 3 are the contract. 4 and 6 are the memory trade. 5, 7 and 8 are the three follow-ups.",
     "say": "I get nine requirements. **The call, atomic, never a false new, a filter that says only certainly-not or maybe, delete, the memory I'll quote, a unique key for many servers, and a log first.** Numbers: 62 MB for a million ids in a set, 1.2 MB for a Bloom filter at one percent."
    },
    {
     "t": "p",
     "text": "**c) Entities.**"
    },
    {
     "t": "write",
     "id": "onsite-dd-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "ID: \nRegistry: \nBloom filter: \nCounting Bloom filter: \nTable and segments: \nLog: \nUnique-key store: \nLock: \nServer: ",
     "hint": "What holds state? What must be immutable? What only names something?",
     "solution": "ID: drop as a class. An int or a string used as a key.\nRegistry: keep. A hash set and a lock. One method, check_and_insert.\nBloom filter: keep. A bytearray of m bits and k hash positions. Two methods: add, and 'in'. It never says no wrongly.\nCounting Bloom filter: keep as a variant. A counter in place of each bit, so remove works.\nTable and segments: keep. The table is a mutable set in memory; a segment is a frozen set plus its own Bloom filter, never changed.\nLog (write-ahead): keep. An append-only list, written before the table. A file in real life.\nUnique-key store: keep. A database table with the id as primary key; the insert is the check.\nLock: keep. One step for check and insert.\nServer: drop. Only the database matters to the answer.",
     "why": "Immutable segments with their own filters are why a new id skips almost every read. The unique key is why two servers cannot both win.",
     "say": "I'd keep the set and its lock, the Bloom filter and its counting variant, the table with immutable segments and their filters, the log, and the unique-key store. **An id is only a key, and a server is only a client of the database.**"
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.**"
    },
    {
     "t": "write",
     "id": "onsite-dd-logic-w",
     "q": "Write the steps from a hash set, to a Bloom filter in front, to deletions, to two servers, to a billion ids. Put numbers on each.",
     "starter": "Hash set:\nBloom filter:\nWhere the filter pays:\nDeletions:\nTwo servers:\nA billion ids:",
     "hint": "Why is 'check then add' not safe? What does a Bloom 'yes' really mean? Who has the last word?",
     "solution": "Hash set, one machine:\n1. Under a lock: remember the size, add the id, compare the size. A larger size means it was new. O(1) on average.\n2. The lock matters: two threads can both see 'not there' before either adds. (A single set.add is safe in CPython; the check then add is two steps.)\n3. Memory: a million ints in a set is about 62 MB (measured). A million fits, so this is the honest first answer.\n\nBloom filter in front:\n1. m bits and k hash positions per id. A new id sets k bits. To check, read the k bits: any 0 means certainly not here; all 1 means maybe.\n2. No false negatives, so a 'no' is trusted without a read. A 'maybe' is confirmed against the exact store.\n3. Size: about 9.6 bits an id and 7 hashes give 1 percent false positives (Wikipedia, Bloom filter). Measured 1.03 percent. A million ids: 1.2 MB, about 50 times smaller than the set. 14.4 bits an id gives 0.1 percent, 1.8 MB.\n\nWhere the filter pays:\n1. When most checks are for ids that are not there and the exact store is slow, such as sorted segments on disk. A 'no' skips the disk.\n2. Measured: 100,000 offers over 24 segments, 1,041,844 segment reads without a filter, 59,710 with one.\n3. When everything fits in memory the set is already O(1) and exact; the filter only saves memory.\n\nDeletions:\n1. A plain filter cannot delete: clearing a bit may clear another id's bit.\n2. A counting filter keeps a counter per slot (4 bits each in real systems, so about 4 times the memory); remove subtracts. Only remove ids that were added. A cuckoo filter is the other known answer.\n3. Or leave the filter alone: a stale bit only makes more false 'maybe' answers, and the exact store, which does delete, has the last word. Rebuild the filter on a schedule.\n\nTwo servers, same new id:\n1. Memory on each server cannot decide. The database does, with a unique key: insert, and if a row was written the id was new.\n2. Examples: SQL INSERT with ON CONFLICT DO NOTHING (rows written is 1 or 0), Redis SADD (returns 1 or 0), a conditional put. Measured: 4 servers, 300 ids, 300 True, 300 rows.\n3. A local Bloom filter may still sit in front, but its 'no' is only a hint: the unique key decides.\n\nA billion ids:\n1. Write-ahead log, an in-memory table, and immutable sorted segments written when the table is full. Each segment has its own Bloom filter.\n2. Check: table, then each segment newest first, reading a segment only if its filter says maybe. Then log, then table.\n3. Shard by hash of the id so each shard owns a slice and a check goes to one shard.\n4. A filter at 1 percent for a billion ids is about 1.2 GB; the exact ids are tens of GB, so they live on disk.\n\nEdge cases: an id normalised differently (case, spaces) is a different key; a crash between the log and the table (replay the log); a filter sized for n that receives 2n (the false positive rate climbs: rebuild bigger); the empty id.",
     "why": "Each step removes one cost: the lock removes a race, the filter removes reads, the unique key removes a split-brain, the segments remove memory.",
     "say": "**I'd start with a hash set and a lock, because a million ids is 62 MB and exact.** Then, if memory or disk reads matter, a Bloom filter in front: a no is certain, a maybe is checked in the exact store. At nine and a half bits an id it is one percent false positives and about 1.2 MB. A plain filter can't delete, so I'd use a counting one or leave it and let the exact store decide. With two servers I'd let the database decide with a unique key. For a billion ids: a log, a table, and sorted segments with a filter each, sharded by hash."
    },
    {
     "t": "p",
     "text": "**e) The code, for after.** Main function first."
    },
    {
     "t": "write",
     "id": "onsite-dd-code-w",
     "q": "Write check_and_insert first, for the table-and-segments design. Name the helpers, do not write them yet.",
     "starter": "def check_and_insert(self, uid):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "Newest data first. A filter says certainly-not or maybe. The log before the table.",
     "solution": "def check_and_insert(self, uid):\n    \"\"\"True if new. Cheap and certain checks first; the exact data has the last word.\"\"\"\n    with self.lock:                                   # check and insert are ONE step\n        if uid in self.table:\n            return False                              # newest data first\n        for seg, bloom in reversed(self.segments):\n            if uid not in bloom:\n                continue                              # certainly not here: no read\n            if uid in seg:                            # maybe: read the segment to be sure\n                return False\n        self.wal.append(uid)                          # durable first, then visible\n        self.table.add(uid)\n        self.flush_if_full()                          # table to an immutable segment with its own filter\n        return True\n\n# helpers, defined in the workbench below:\n#   Bloom(n).add / in           certainly-not or maybe\n#   flush_if_full()              freeze the table into a segment, build its filter, drop the log",
     "why": "The method reads in the order of cost: memory, then filters, then segment reads. The log line comes before the add, which is the whole durability argument.",
     "say": "I'd write check_and_insert first: **under one lock, table first, then each segment newest first but only if its filter says maybe, then the log, then the table.** The helpers are the filter and the flush."
    },
    {
     "t": "predict",
     "id": "onsite-dedupe-pred",
     "code": "import math\n\nn, bits = 1_000_000, 9.6\nk = round(bits * math.log(2))\nfp = (1 - math.exp(-k / bits)) ** k\nprint(k, round(fp, 4), round(n * bits / 8 / 1e6, 1))",
     "q": "A Bloom filter for a million ids at 9.6 bits an id. What does this print: the hashes, the false positive rate, the size in MB?",
     "answer": "7 0.01 1.2",
     "why": "The best k is bits per id times ln 2, which rounds to 7. The chance a probe is a false positive is (1 - e^(-k n / m))^k, and n / m is 1 / 9.6, so it comes to 1 percent. A million times 9.6 bits is 1.2 megabytes."
    },
    {
     "t": "problem",
     "id": "onsite-dedupe-p",
     "title": "Check and insert for a million user IDs",
     "source": "PracHub, 'Check-and-Insert for a Million User IDs: Balancing Latency, Memory and Accuracy' (listed 4 Oct 2026), rebuilt",
     "d": "medium",
     "minutes": 40,
     "why": "Memory against accuracy against latency, in one small service, with a race, a deletion problem and a second server. Say the answer aloud first; open the solution to check it.",
     "statement": "Part 1. A service receives user IDs. check_and_insert(id) returns True if the id is new and records it. A million ids, many threads.\n\nPart 2. Memory is tight. Put a Bloom filter in front without ever reporting a duplicate as new.\n\nPart 3. Ids can be deleted and reused.\n\nPart 4. Two servers receive the same new id.\n\nPart 5. A billion ids: a log, a table and sorted segments.",
     "examples": [
      {
       "input": "a Bloom filter for 200,000 ids at 9.6 bits an id, 200,000 probes of ids never added",
       "output": "7 hashes, false positives 0.0103 measured against 0.0100 by the formula",
       "note": "No false negatives: every added id is found."
      },
      {
       "input": "100,000 offers over 60,000 possible ids, in 24 segments of 2,000",
       "output": "48,672 distinct; segment reads 1,041,844 without a filter, 59,710 with one",
       "note": "Same answers both ways. The filter only saves the reads."
      },
      {
       "input": "4 servers offering the same 300 ids to one database with a unique key",
       "output": "300 True in total and 300 rows",
       "note": "The insert is the check, so two servers cannot both win."
      }
     ],
     "constraints": [
      "standard library only",
      "an id is an int or a string",
      "a false 'new' is never allowed",
      "a million ids must fit the first version in memory"
     ],
     "starter": "class Registry:\n    def check_and_insert(self, uid):\n        ...",
     "hints": [
      "Level 1: a set. Before adding, remember len(set); after, compare. Put both inside one lock.",
      "Level 2: a Bloom filter says 'certainly not' or 'maybe'. Only a 'maybe' needs the exact store.",
      "Level 3: a unique key in the database makes the insert the check. For a billion ids keep a table, a log and immutable segments with a filter each."
     ],
     "solution": "import hashlib\nimport math\nimport os\nimport sqlite3\nimport tempfile\nimport threading\n\n\nclass Bloom:\n    \"\"\"m bits, k hashes. 'Not in it' is certain. 'In it' only means maybe. No deletes.\"\"\"\n    def __init__(self, n, bits_per_item=9.6):          # 9.6 bits an item is about 1 percent false positives\n        self.m = int(n * bits_per_item)\n        self.k = max(1, round(bits_per_item * math.log(2)))\n        self.bits = bytearray((self.m + 7) // 8)\n\n    def _positions(self, x):\n        h = hashlib.blake2b(str(x).encode(), digest_size=16).digest()\n        a, b = int.from_bytes(h[:8], \"big\"), int.from_bytes(h[8:], \"big\") | 1\n        return [(a + i * b) % self.m for i in range(self.k)]   # k positions from two hashes\n\n    def add(self, x):\n        for p in self._positions(x):\n            self.bits[p >> 3] |= 1 << (p & 7)\n\n    def __contains__(self, x):\n        return all(self.bits[p >> 3] & (1 << (p & 7)) for p in self._positions(x))\n\n\nclass CountingBloom(Bloom):\n    \"\"\"A counter in place of each bit, so an item can be removed. Costs several times the memory.\"\"\"\n    def __init__(self, n, bits_per_item=9.6):\n        super().__init__(n, bits_per_item)\n        self.counts = bytearray(self.m)                  # one byte a slot here; real ones use 4 bits\n\n    def add(self, x):\n        for p in self._positions(x):\n            self.counts[p] = min(255, self.counts[p] + 1)\n\n    def remove(self, x):                                 # only remove what was added, or counts go wrong\n        for p in self._positions(x):\n            self.counts[p] = max(0, self.counts[p] - 1)\n\n    def __contains__(self, x):\n        return all(self.counts[p] for p in self._positions(x))\n\n\nclass Registry:\n    \"\"\"One process, every id in a hash set. check_and_insert is ONE step under a lock, because\n    'is it there' followed by 'add it' lets two threads both see 'not there'.\"\"\"\n    def __init__(self):\n        self.ids, self.lock = set(), threading.Lock()\n\n    def check_and_insert(self, uid):\n        \"\"\"True if the id was new.\"\"\"\n        with self.lock:\n            before = len(self.ids)\n            self.ids.add(uid)\n            return len(self.ids) > before\n\n    def remove(self, uid):\n        with self.lock:\n            self.ids.discard(uid)\n\n\nclass SegmentedRegistry:\n    \"\"\"Too many ids for memory: a write-ahead log, one in-memory table, and sorted segments on disk\n    (frozen sets here). Each segment has a Bloom filter, so a new id skips nearly every segment.\"\"\"\n    def __init__(self, table_limit=1000, use_bloom=True):\n        self.table, self.segments, self.wal = set(), [], []\n        self.limit, self.use_bloom, self.segment_reads = table_limit, use_bloom, 0\n        self.lock = threading.Lock()\n\n    def check_and_insert(self, uid):\n        with self.lock:\n            if uid in self.table:\n                return False\n            for seg, bloom in reversed(self.segments):\n                if self.use_bloom and uid not in bloom:\n                    continue                              # certainly not here: no read\n                self.segment_reads += 1                   # 'maybe': read the segment to be sure\n                if uid in seg:\n                    return False\n            self.wal.append(uid)                          # durable first, then visible\n            self.table.add(uid)\n            if len(self.table) >= self.limit:\n                bloom = Bloom(len(self.table))\n                for x in self.table:\n                    bloom.add(x)\n                self.segments.append((frozenset(self.table), bloom))\n                self.table, self.wal = set(), []          # the segment is durable, so the log can go\n            return True\n\n\nclass SqlRegistry:\n    \"\"\"Many servers: the database decides. A unique key makes the insert itself the check, so two\n    servers that get the same new id cannot both succeed.\"\"\"\n    def __init__(self, path):\n        self.path = path\n        with self.connect() as db:\n            db.execute(\"CREATE TABLE IF NOT EXISTS ids (id INTEGER PRIMARY KEY)\")\n\n    def connect(self):\n        return sqlite3.connect(self.path, timeout=30)\n\n    def check_and_insert(self, db, uid):\n        cur = db.execute(\"INSERT OR IGNORE INTO ids (id) VALUES (?)\", (uid,))\n        db.commit()\n        return cur.rowcount == 1                          # 1 row written means it was new\n",
     "complexity": "Registry: O(1) per call, about 62 MB per million ints. Bloom: O(k) per call, 9.6 bits an id for 1 percent. CountingBloom: several times that. SegmentedRegistry: O(segments) filter checks and few reads. SqlRegistry: one indexed insert per call.",
     "explain": [
      "Bloom positions come from two halves of one hash: position i is a + i * b. That gives k positions without k hashes. The |1 keeps the step odd.",
      "CountingBloom replaces each bit with a counter, so remove subtracts. It must only remove ids that were added.",
      "Registry makes check and insert one step with a lock: remember the size, add, compare.",
      "SegmentedRegistry is the large version: a log, a table, frozen segments each with a Bloom filter. A 'no' from the filter skips the read.",
      "SqlRegistry uses INSERT OR IGNORE on a primary key. One row written means the id was new, whichever server asked.",
      "The measured output is printed by the tests: 1.03 percent false positives, about 62 MB for a million ids in a set, 1,041,844 against 59,710 segment reads."
     ],
     "tests": "import random\nimport sys\n\nn = 200000\nbloom = Bloom(n)\nfor i in range(n):\n    bloom.add(i)\nassert all(i in bloom for i in range(0, n, 97))                      # no false negatives\nprobe = range(10 ** 9, 10 ** 9 + n)\nfp = sum(1 for x in probe if x in bloom) / n\ntheory = (1 - math.exp(-bloom.k * n / bloom.m)) ** bloom.k\nprint(\"bloom: %d bits, %d hashes, %.2f bits an id; false positives %.4f measured, %.4f by the formula\" % (bloom.m, bloom.k, bloom.m / n, fp, theory))\n\nmillion = set(range(10 ** 6))\nexact = sys.getsizeof(million) + 28 * len(million)\nprint(\"a million ids: hash set about %.0f MB; bloom at 1 percent %.1f MB; at 0.1 percent (14.4 bits) %.1f MB\" % (exact / 1e6, 1e6 * 9.6 / 8 / 1e6, 1e6 * 14.4 / 8 / 1e6))\n\nreg = Registry()\nids = list(range(5000))\nfirsts = []\n\n\ndef worker(seed):\n    order = ids[:]\n    random.Random(seed).shuffle(order)\n    firsts.append(sum(1 for u in order if reg.check_and_insert(u)))\n\n\nthreads = [threading.Thread(target=worker, args=(s,)) for s in range(8)]\n[t.start() for t in threads]\n[t.join() for t in threads]\nassert sum(firsts) == len(ids) == len(reg.ids)\nprint(\"8 threads each offering the same 5000 ids: %d said 'new', once per id\" % sum(firsts))\n\nreg.remove(7)\nassert reg.check_and_insert(7) is True and reg.check_and_insert(7) is False\nprint(\"remove then insert again: new once more\")\n\ncb = CountingBloom(1000)\ncb.add(\"a\"); cb.add(\"b\")\nassert \"a\" in cb\ncb.remove(\"a\")\nassert \"a\" not in cb and \"b\" in cb\nprint(\"counting bloom: removed id is gone, the other stays\")\n\nrng = random.Random(4)\nstream = [rng.randrange(60000) for _ in range(100000)]               # many repeats\nresult = {}\nfor use in (False, True):\n    seg = SegmentedRegistry(table_limit=2000, use_bloom=use)\n    new = sum(1 for u in stream if seg.check_and_insert(u))\n    result[use] = (new, seg.segment_reads, len(seg.segments))\nassert result[True][0] == result[False][0] == len(set(stream))\nprint(\"100,000 ids offered, %d distinct, %d segments of 2000:\" % (result[True][0], result[True][2]))\nprint(\"  segment reads without a bloom filter: %d; with one: %d\" % (result[False][1], result[True][1]))\n\npath = os.path.join(tempfile.mkdtemp(), \"ids.db\")\nsql = SqlRegistry(path)\nnews = []\n\n\ndef server(name):\n    db = sql.connect()\n    news.append(sum(1 for u in range(300) if sql.check_and_insert(db, u)))\n    db.close()\n\n\nthreads = [threading.Thread(target=server, args=(i,)) for i in range(4)]\n[t.start() for t in threads]\n[t.join() for t in threads]\nwith sql.connect() as db:\n    rows = db.execute(\"SELECT COUNT(*) FROM ids\").fetchone()[0]\nassert sum(news) == 300 == rows\nprint(\"4 servers offering the same 300 ids to one database: %d said 'new' and %d rows exist\" % (sum(news), rows))\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why a lock around the check and the insert?",
       "a": "Two threads can both see 'not there' before either adds, and both report new. Under the lock the pair is one step. The test with 8 threads shows exactly one True per id."
      },
      {
       "q": "Why can a Bloom filter never report a duplicate as new?",
       "a": "A bit is only ever set, never cleared, by add. So every id that was added has its k bits set and is found. A false answer can only be a 'maybe' for an id that was not added."
      },
      {
       "q": "Why not use only a Bloom filter?",
       "a": "A 'maybe' is wrong 1 percent of the time. Reporting it as 'seen' would reject a real new user. So a 'maybe' is confirmed in the exact store."
      },
      {
       "q": "When is the filter useless?",
       "a": "When the exact set fits in memory, because the set is exact and O(1) already. The filter pays when the exact data lives on disk or over a network and most checks are for ids that are not there."
      },
      {
       "q": "What does a counting filter cost?",
       "a": "A counter per slot instead of a bit. At 4 bits a counter that is about 4 times the memory. Removing an id that was never added corrupts other ids' counts."
      },
      {
       "q": "Why does the unique key beat 'check, then insert'?",
       "a": "Between your check and your insert another server can insert the same id. A unique key makes the database do both as one step, so exactly one insert succeeds."
      },
      {
       "q": "Why write the log before the table?",
       "a": "If the process dies after the table but before the log, the caller was told 'new' and the id is gone. Log first means the worst case is an id recorded that the caller never heard about."
      },
      {
       "q": "Why does each segment have its own filter?",
       "a": "A check then reads a segment only when its filter says maybe. With 24 segments a new id costs about 24 filter checks and almost no reads: 59,710 reads against 1,041,844."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Contains Duplicate",
       "d": "easy",
       "lc": "contains-duplicate",
       "yt": [
        "3OamzN90kPg",
        "NeetCode",
        7
       ],
       "why": "The hash set answer to 'seen before?' in one pass."
      },
      {
       "n": "Design HashSet",
       "d": "easy",
       "lc": "design-hashset",
       "yt": [
        "VymjPQUXjL8",
        "NeetCodeIO",
        12
       ],
       "why": "Build the set yourself: buckets, a hash, collisions. It is what the set in the first version does."
      },
      {
       "n": "Insert Delete GetRandom O(1)",
       "d": "medium",
       "lc": "insert-delete-getrandom-o1",
       "yt": [
        "j4KwhBziOpg",
        "NeetCode",
        14
       ],
       "why": "Insert and delete on a set, each O(1). The deletion half of this chapter."
      },
      {
       "n": "Contains Duplicate III",
       "d": "hard",
       "lc": "contains-duplicate-iii",
       "yt": [
        "HVh6u2Rf4P4",
        "DKodeTree",
        15
       ],
       "why": "The harder follow-up: duplicates inside a window with bounded memory, where you decide what to forget."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-topk",
   "title": "5. Weighted top-k over candidates",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A pile of candidates, each with skills and levels, and a job with a weight on each skill. Return the best k. JobMentis, a question bank (last updated 3 Nov 2026; the dates of single questions are not shown), lists for Mercor, as onsite coding: the top k candidates by a weighted skill score from resume JSON, and whether a candidate's skill set matches a job's mandatory and optional skills. No report gives the follow-ups, so ties, streaming and changing weights below are the pushes the problem leads to, not reported wording."
    },
    {
     "t": "p",
     "text": "**a) Clarify.**"
    },
    {
     "t": "write",
     "id": "onsite-tk-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: the input shape, the score, mandatory and optional skills, how big n and k are. Errors: ties, fewer than k, missing or unknown skills, negative weights. Scope: streaming, changing weights, distributed.",
     "solution": "1. Primary capabilities\n- What is the input? Likely a candidate id and skills with a level (1 to 5) or years, from JSON; a job with a weight per skill.\n- What is the score? Likely the sum of weight times level; a skill nobody weighted counts for 0.\n- Mandatory and optional skills? Likely mandatory is a filter (without it the candidate is out) and optional only adds weight.\n- How big are n and k? Likely n in thousands to millions, k of 10. A big k means sort.\n- What do I return? Likely ids with scores, best first.\n\n2. Error handling\n- Ties? Likely the earlier candidate first, or by id; ask, because it changes the output.\n- Fewer than k candidates, k of 0? Return what exists, an empty list for 0.\n- A skill name spelled or cased differently? Likely normalise before.\n- A negative weight, or a missing level? Likely a missing level is 0; negative weights are allowed and mean penalties.\n- A broken JSON record? Skip it and count it.\n\n3. Scope boundaries\n- Do candidates stream in, or are they all there? Likely all there first; stream as a follow-up.\n- Do weights change while the job is open? Follow-up.\n- One machine, or sharded? One, with a note on how it splits.\n- Do I write code, or talk? Talk.",
     "why": "Mandatory against optional decides filter against weight. The tie rule changes the output. Streaming and changing weights change the data structure.",
     "say": "**Three buckets again: what it must do, what goes wrong, where it stops.** I'd ask what the score is, whether mandatory skills are a filter, how big k is next to n, and what a tie does. Then whether candidates stream in or the weights change, because those move me from sorting to a heap and an index."
    },
    {
     "t": "p",
     "text": "**b) Requirements.**"
    },
    {
     "t": "write",
     "id": "onsite-tk-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "The result, the score, mandatory, ties, k edge cases, streaming, updates, out of scope.",
     "solution": "1. top_k(profiles, weights, k) returns the best k as (id, score), best first. Test: on 20,000 candidates it equals sorting everyone and taking the first k.\n2. score = sum of weight times level over the candidate's skills; an unweighted skill counts 0. Test: a candidate with python 3 and weight 2 scores 6.\n3. A candidate missing a mandatory skill is not returned. Test: with two mandatory skills, 362 of 20,000 stay.\n4. Equal scores keep arrival order. Test: three candidates with the same score, k = 2, the first two come back.\n5. k = 0 gives an empty list; k above n gives everyone. Test: both.\n6. The heap holds at most k items however many candidates stream in. Test: heap size 10 for 20,000 candidates.\n7. When one weight changes, only the candidates with that skill are re-scored. Test: 2,981 cells touched against 120,000 to score everyone again, and the top k equals a fresh run.\n8. Out of scope: learning the weights, text matching of skill names, a distributed run.",
     "why": "Requirement 1 is the contract and the check on every other. 4 and 5 are the edges an interviewer tries. 6 and 7 are the two follow-ups.",
     "say": "I get eight requirements. **The result, the score, mandatory as a filter, stable ties, the edges for k, a heap of size k, and an index so one changed weight re-scores only the people who have that skill.** Numbers: 362 of 20,000 pass two mandatory skills, 2,981 cells against 120,000."
    },
    {
     "t": "p",
     "text": "**c) Entities.**"
    },
    {
     "t": "write",
     "id": "onsite-tk-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "Candidate: \nSkill and level: \nJob and weights: \nScore: \nHeap item: \nHeap: \nInverted index: \nScore table: ",
     "hint": "What carries state between calls? What is only a number?",
     "solution": "Candidate: keep as a dict entry: id to a dict of skill to level. No class; the score does not need behaviour on it.\nSkill and level: keep as the entries of that inner dict.\nJob and weights: keep. A dict from skill to weight, plus a tuple of mandatory skills.\nScore: drop as a class. An integer, computed by one function.\nHeap item: keep. A tuple (score, minus arrival, id). Higher score is better; at equal scores the smaller arrival is better, and tuple order does it.\nHeap: keep. A min-heap of at most k items; its root is the worst of the best.\nInverted index: keep, for updates. skill to {id: level}. It is how one changed weight finds the people it touches.\nScore table: keep, for updates. id to score, kept up to date.",
     "why": "The heap item is the whole tie rule. The index and the score table exist only because of the follow-up on changing weights.",
     "say": "I'd keep the candidate dict, the weights and mandatory skills, the heap item as a tuple, the heap itself, and for updates an inverted index and a score table. **A score is only an integer, and the tie rule lives in the heap item's tuple order.**"
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.**"
    },
    {
     "t": "write",
     "id": "onsite-tk-logic-w",
     "q": "Write the steps: the baseline, the heap of k, the tie rule, streaming, a changing weight, a changing candidate, and splitting across machines. Put numbers on each.",
     "starter": "Baseline:\nHeap of k:\nTies:\nStreaming:\nA weight changes:\nA candidate changes:\nSplit across machines:",
     "hint": "Which is the worst of the best k? What is the cost of one offer? What does one weight touch?",
     "solution": "Baseline:\n1. Score everyone, sort by (minus score, arrival), take k. O(n log n). Fine for thousands; wasteful when k is 10 and n is a million.\n\nHeap of k:\n1. Keep a min-heap of at most k items. Its root is the worst of the kept.\n2. For each candidate (skipping those without the mandatory skills): score it. If the heap has fewer than k items, push. Else if the candidate beats the root, replace the root.\n3. At the end sort the k items, best first.\n4. Cost: scoring is O(skills) per candidate, the heap O(log k) only when a candidate beats the root. Total O(n log k). Space O(k) extra.\n\nTies:\n1. The heap item is (score, minus arrival, id). Compare as tuples: a higher score wins; at equal scores the smaller arrival has the larger second part, so it wins. The id is never compared.\n2. 'Strictly better than the root' means a later candidate with an equal score never displaces an earlier one.\n\nStreaming:\n1. Same heap, offered one at a time. Memory is k, whatever the length. About k * ln(n / k) replacements for a random order: 76 predicted, 75 measured for k = 10, n = 20,000.\n\nA weight changes:\n1. Scoring everyone again reads every table cell: 120,000 for 20,000 candidates with 6 skills.\n2. With an inverted index (skill to who has it), a change of weight from w to w' adds (w' minus w) times level to each candidate who has the skill: 2,981 cells for one skill, about 40 times fewer.\n3. Then take the top k from the stored scores: O(n log k).\n4. Use integers, or fractions: adding float deltas drifts. Recompute from scratch now and then.\n5. To answer in O(log n) per change you need an ordered structure (a balanced tree or skip list). The standard library has none; say so and say what you would use.\n\nA candidate changes: new score = old + weight * (new level minus old level). One cell.\n\nSplit across machines: every shard returns its own top k; the global top k is among the union. Proof: a candidate in the global top k beats all but k minus 1 others, so it is in the top k of its own shard. Merge shards * k items with the same heap.\n\nEdge cases: k above n; k of 0; no candidates; all scores equal (ties decide everything); a mandatory skill that nobody has (empty result); a skill in the weights that nobody has (adds 0).",
     "why": "The heap's root is the answer to 'who do I throw out'. The tie rule is one tuple. The index turns a re-score of everyone into a re-score of the few it touches.",
     "say": "**I'd keep a min-heap of size k, so the root is the worst of the best.** Each candidate is scored once and only pushes into the heap if it beats the root: n log k in total. Ties go to the earlier candidate, and I get that by putting minus the arrival in the heap item. When a weight changes I keep an index from skill to who has it, and only re-score those people: 2,981 cells against 120,000 in my run. And across machines each shard sends its top k, because anyone in the global top k is in the top k of their own shard."
    },
    {
     "t": "p",
     "text": "**e) The code, for after.** Main function first."
    },
    {
     "t": "write",
     "id": "onsite-tk-code-w",
     "q": "Write top_k first. Name the helpers, do not write them yet.",
     "starter": "def top_k(profiles, weights, k, mandatory=()):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "A heap of k. Skip the ones missing a mandatory skill. Score and offer.",
     "solution": "def top_k(profiles, weights, k, mandatory=()):\n    \"\"\"Best k by weighted score. One pass and a heap of k: O(n log k) time, O(k) space.\"\"\"\n    heap = Heap(k)                                    # keeps the best k; its root is the worst of them\n    for i, (cid, skills) in enumerate(profiles.items()):\n        if all(m in skills for m in mandatory):       # a missing mandatory skill removes the candidate\n            heap.offer(score(skills, weights), i, cid)\n    return heap.result()                              # best first\n\n# helpers, defined in the workbench below:\n#   score(skills, weights)       sum of weight times level\n#   Heap(k).offer(score, arrival, id)   push, or replace the root if strictly better\n#   Board                        scores kept up to date when a weight changes",
     "why": "Four lines of plan. The heap hides the tie rule, so the main function reads as filter, score, offer.",
     "say": "I'd write top_k first: **a heap of k, skip anyone missing a mandatory skill, score, offer.** The helpers are the score function, the heap with its tie rule, and a board for when weights change."
    },
    {
     "t": "predict",
     "id": "onsite-topk-pred",
     "code": "import heapq\n\nheap = []\nfor arrival, (name, score) in enumerate([(\"a\", 6), (\"b\", 9), (\"c\", 6), (\"d\", 6), (\"e\", 7)]):\n    item = (score, -arrival, name)\n    if len(heap) < 3:\n        heapq.heappush(heap, item)\n    elif item > heap[0]:\n        heapq.heapreplace(heap, item)\nprint([n for s, a, n in sorted(heap, reverse=True)])",
     "q": "k is 3. Candidates arrive a, b, c, d, e with scores 6, 9, 6, 6, 7. Who is returned, best first? (Python 3.12.)",
     "answer": "['b', 'e', 'a']",
     "why": "b has 9 and e has 7. Three candidates score 6: a, c and d. The second tuple part is minus the arrival, so the earliest has the largest second part and wins the tie: a is kept, and c and d lose. A later equal score never replaces an earlier one, because replacement needs strictly better."
    },
    {
     "t": "problem",
     "id": "onsite-topk-p",
     "title": "Weighted top-k over candidates",
     "source": "JobMentis list of Mercor onsite coding questions (bank updated 3 Nov 2026), rebuilt",
     "d": "medium",
     "minutes": 35,
     "why": "A heap with a real tie rule, then the two pushes that change the design: items that stream in, and weights that change. Say the answer aloud first; open the solution to check it.",
     "statement": "profiles maps a candidate id to {skill: level}. weights maps a skill to its weight. A candidate's score is the sum of weight times level.\n\nPart 1. Return the best k as (id, score), best first. Equal scores keep arrival order.\n\nPart 2. Some skills are mandatory: a candidate without them is out.\n\nPart 3. Candidates arrive as a stream. Use memory proportional to k.\n\nPart 4. A weight changes, or a candidate's level changes, and you are asked for the top k again. Do less work than scoring everyone.",
     "examples": [
      {
       "input": "k = 3; a, b, c, d, e score 6, 9, 6, 6, 7",
       "output": "b, e, a",
       "note": "Three tie at 6; the earliest wins."
      },
      {
       "input": "20,000 candidates, 6 skills each out of 40, k = 10, two mandatory skills",
       "output": "362 candidates stay",
       "note": "The heap result equals sorting everyone, checked by the tests."
      },
      {
       "input": "one weight changes",
       "output": "2,981 cells touched, against 120,000 to score everyone again",
       "note": "The inverted index finds only the candidates who have the skill."
      }
     ],
     "constraints": [
      "standard library only",
      "levels and weights are integers",
      "k may be 0 or above n",
      "ties keep arrival order"
     ],
     "starter": "def top_k(profiles, weights, k, mandatory=()):\n    ...",
     "hints": [
      "Level 1: score everyone and sort by (minus score, arrival). That is the answer to check against.",
      "Level 2: a min-heap of size k. The root is the worst of the kept. Replace it only when a candidate is strictly better. Put minus the arrival in the tuple for the tie rule.",
      "Level 3: for a changing weight keep skill -> {id: level} and a score table. A change adds (new minus old weight) times level to each person in that skill's list."
     ],
     "solution": "import heapq\r\nfrom collections import defaultdict\r\n\r\n\r\ndef score(profile, weights):\r\n    \"\"\"profile: {skill: level}. weights: {skill: weight}. A skill nobody weighted counts for 0.\"\"\"\r\n    return sum(weights.get(s, 0) * level for s, level in profile.items())\r\n\r\n\r\ndef top_k_sorted(profiles, weights, k, mandatory=()):\r\n    \"\"\"The baseline: score everyone, sort everyone. O(n log n). Ties go to the candidate who came first.\"\"\"\r\n    rows = [(-score(sk, weights), i, cid) for i, (cid, sk) in enumerate(profiles.items())\r\n            if all(m in sk for m in mandatory)]\r\n    return [(cid, -neg) for neg, _, cid in sorted(rows)[:k]]\r\n\r\n\r\nclass Heap:\r\n    \"\"\"The best k seen so far. A min-heap, so the root is the worst of the kept k.\r\n    An item is (score, -arrival, id): a higher score is better, and at equal scores the earlier arrival is.\"\"\"\r\n    def __init__(self, k):\r\n        self.k, self.items, self.replaced = k, [], 0\r\n\r\n    def offer(self, sc, arrival, cid):\r\n        item = (sc, -arrival, cid)\r\n        if self.k <= 0:\r\n            return                                    # k = 0 keeps nothing\r\n        if len(self.items) < self.k:\r\n            heapq.heappush(self.items, item)\r\n        elif item > self.items[0]:                    # strictly better than the worst kept\r\n            heapq.heapreplace(self.items, item)\r\n            self.replaced += 1\r\n\r\n    def result(self):\r\n        return [(cid, sc) for sc, _, cid in sorted(self.items, reverse=True)]\r\n\r\n\r\ndef top_k(profiles, weights, k, mandatory=()):\r\n    \"\"\"Best k by weighted score. One pass, a heap of k: O(n log k) time, O(k) extra space.\"\"\"\r\n    heap = Heap(k)\r\n    for i, (cid, sk) in enumerate(profiles.items()):\r\n        if all(m in sk for m in mandatory):           # a missing mandatory skill removes the candidate\r\n            heap.offer(score(sk, weights), i, cid)\r\n    return heap.result()\r\n\r\n\r\nclass Board:\r\n    \"\"\"Scores kept up to date when a weight changes. An inverted index (skill -> who has it)\r\n    means one changed weight touches only the candidates who have that skill.\"\"\"\r\n    def __init__(self, profiles, weights):\r\n        self.profiles, self.weights = profiles, dict(weights)\r\n        self.order = {cid: i for i, cid in enumerate(profiles)}\r\n        self.by_skill = defaultdict(dict)             # skill -> {cid: level}\r\n        self.scores = {}\r\n        self.touched = 0                              # table cells read, to compare the two ways\r\n        for cid, sk in profiles.items():\r\n            self.scores[cid] = score(sk, weights)\r\n            self.touched += len(sk)\r\n            for s, level in sk.items():\r\n                self.by_skill[s][cid] = level\r\n\r\n    def set_weight(self, skill, new):\r\n        delta = new - self.weights.get(skill, 0)      # integers keep this exact; floats would drift\r\n        self.weights[skill] = new\r\n        for cid, level in self.by_skill[skill].items():\r\n            self.scores[cid] += delta * level\r\n            self.touched += 1\r\n\r\n    def set_level(self, cid, skill, level):\r\n        old = self.profiles[cid].get(skill, 0)\r\n        self.profiles[cid][skill] = level\r\n        self.by_skill[skill][cid] = level\r\n        self.scores[cid] += self.weights.get(skill, 0) * (level - old)\r\n        self.touched += 1\r\n\r\n    def top(self, k):\r\n        \"\"\"O(n log k) from the stored scores. No profile is read.\"\"\"\r\n        best = heapq.nsmallest(k, self.scores, key=lambda c: (-self.scores[c], self.order[c]))\r\n        return [(c, self.scores[c]) for c in best]\r\n",
     "complexity": "top_k: O(n log k) time, O(k) space; top_k_sorted: O(n log n). Streaming: O(log k) per candidate. Board.set_weight: O(people with that skill). Board.top: O(n log k) from stored scores. Splitting: shards * k items to merge.",
     "explain": [
      "score is the one place the formula lives. A skill nobody weighted adds 0.",
      "top_k_sorted is the baseline and the check: sort by (minus score, arrival).",
      "Heap keeps a tuple (score, minus arrival, id). Python compares tuples from the left, so a higher score wins and, at equal scores, the earlier arrival does. offer replaces the root only when the new item is strictly better, and k of 0 keeps nothing.",
      "top_k is the plan: filter by mandatory skills, score, offer, return best first.",
      "Board keeps scores and an index from skill to who has it. set_weight adds the change to those people only; set_level changes one cell. top reads only stored scores.",
      "The measured output is printed by the tests: 75 heap changes for 20,000 candidates (about k ln(n / k) = 76), 2,981 cells against 120,000."
     ],
     "tests": "import math\nimport random\n\nrng = random.Random(11)\nskills = [\"s%d\" % i for i in range(40)]\nn = 20000\nprofiles = {\"c%05d\" % i: {s: rng.randint(1, 5) for s in rng.sample(skills, 6)} for i in range(n)}\nweights = {s: rng.randint(1, 9) for s in rng.sample(skills, 15)}\nk = 10\n\nwant = top_k_sorted(profiles, weights, k)\ngot = top_k(profiles, weights, k)\nassert got == want\nscores = [score(sk, weights) for sk in profiles.values()]\nprint(\"top 3:\", got[:3])\nprint(\"score of the k-th: %d; candidates with that exact score: %d (ties are real)\" % (got[-1][1], sum(1 for s in scores if s == got[-1][1])))\n\nmust = (\"s1\", \"s2\")\nassert top_k(profiles, weights, k, must) == top_k_sorted(profiles, weights, k, must)\nkept = sum(1 for sk in profiles.values() if all(m in sk for m in must))\nprint(\"with mandatory skills s1 and s2: %d of %d candidates stay\" % (kept, n))\n\ntie = {\"first\": {\"python\": 3}, \"second\": {\"python\": 3}, \"third\": {\"python\": 3}, \"weak\": {\"python\": 1}}\nassert top_k(tie, {\"python\": 2}, 2) == [(\"first\", 6), (\"second\", 6)]\nassert top_k(tie, {\"python\": 2}, 10)[-1] == (\"weak\", 2) and top_k({}, {\"python\": 2}, 3) == []\nassert top_k(tie, {\"python\": 2}, 0) == []\nprint(\"ties keep arrival order; k = 0 and no candidates give an empty list\")\n\nstream = Heap(k)\nfor i, (cid, sk) in enumerate(profiles.items()):\n    stream.offer(score(sk, weights), i, cid)\nassert stream.result() == want\nprint(\"streaming: heap size %d for %d candidates; the heap changed %d times (about k ln(n/k) = %d)\" % (\n    len(stream.items), n, stream.replaced, k * math.log(n / k)))\n\nboard = Board(profiles, weights)\nbuild = board.touched\nassert board.top(k) == want\nboard.touched = 0\nboard.set_weight(\"s3\", 9)\nchanged = board.touched\nfresh = dict(weights); fresh[\"s3\"] = 9\nassert board.top(k) == top_k(profiles, fresh, k)\nprint(\"one weight changes: %d cells touched, against %d to score everyone again\" % (changed, build))\nboard.set_level(\"c00007\", \"s3\", 5)\nassert board.top(k) == top_k(profiles, fresh, k)\nboard.set_weight(\"s3\", 0)\nassert board.top(k) == top_k(profiles, {**fresh, \"s3\": 0}, k)\nprint(\"a candidate's level and a weight set to zero also agree with scoring from scratch\")\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why a min-heap for the best k?",
       "a": "The root is the worst of the kept k, which is the one to compare a new candidate against and to throw out. A max-heap would put the best at the root and tell you nothing about who to drop."
      },
      {
       "q": "Why minus the arrival in the tuple?",
       "a": "Tuples compare left to right and a bigger tuple is better. At equal scores the earlier arrival must be better, so it needs the bigger second part, which minus the arrival gives. The id is never reached."
      },
      {
       "q": "Why strictly better than the root?",
       "a": "A later candidate with an equal score must not displace an earlier one. With 'at least as good' the output would depend on arrival order in a way you cannot explain."
      },
      {
       "q": "Why not sort? When is sorting right?",
       "a": "Sorting is n log n, the heap is n log k. For k of 10 and a million candidates that is about 20 million steps against 3 million. If k is close to n, sort."
      },
      {
       "q": "Why integers for weights and levels?",
       "a": "The index adds deltas to stored scores. With floats the stored score drifts from a fresh one over many changes. Integers or fractions stay exact; with floats, recompute now and then."
      },
      {
       "q": "What if one candidate's level changes while it is in the top k?",
       "a": "Board.set_level changes that one score and top reads the stored scores, so it works with no extra step. A heap that you keep between calls would need lazy deletion, which is why the board is rebuilt from scores."
      },
      {
       "q": "How would the shards merge?",
       "a": "Each returns its top k. Anyone in the global top k beats all but k minus 1 others, so is in the top k of their own shard. Offer all shards * k items to one heap."
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
       "why": "A heap of size k over a stream. The streaming part of this chapter."
      },
      {
       "n": "Top K Frequent Words",
       "d": "medium",
       "lc": "top-k-frequent-words",
       "yt": [
        "huvf-VEuJyo",
        "CheatCodeNinja",
        6
       ],
       "why": "A score plus a tie rule (alphabetical here). The same tuple trick."
      },
      {
       "n": "Find K Pairs with Smallest Sums",
       "d": "medium",
       "lc": "find-k-pairs-with-smallest-sums",
       "yt": [
        "Youk8DDnLU8",
        "TechError",
        11
       ],
       "why": "A heap over candidates you generate lazily, so you never score all n squared."
      },
      {
       "n": "Maximum Frequency Stack",
       "d": "hard",
       "lc": "maximum-frequency-stack",
       "yt": [
        "Z6idIicFDOE",
        "NeetCode",
        14
       ],
       "why": "The harder follow-up: the top changes as items are added and removed, so you keep structure per score. It is the updates part."
      }
     ]
    }
   ]
  },
  {
   "id": "onsite-followups",
   "title": "6. The follow-ups they may chain",
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
      },
      {
       "q": "Only the best one is needed. What changes?",
       "a": "A bracket of n minus 1 matches, and only the true best item's own matches (about log2 n) decide it. With 5 votes a bracket of 256 finds it about 94 percent of the time for 1,275 cents, against about 8,400 cents for a full sort. Spend the votes late, where matches are few."
      },
      {
       "q": "The same pair always gets the same answer. What is achievable?",
       "a": "Voting does nothing. Compare each item with many different others and rank by wins: on 100 items that moved an item 2.9 places off instead of 12.6, for about ten times the cents. PracHub lists this as a follow-up of the paid comparator."
      },
      {
       "q": "Accuracy means few pairs out of order. Which algorithm?",
       "a": "A merge sort with votes or the sequential rule, since a wrong answer in a merge moves an item only a few places. Ranking by wins averages over n comparisons per item and is steadier, at n(n - 1) / 2 cost. This is my own reasoning; PracHub lists the question without an answer."
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
      },
      {
       "q": "The table is consistent, as in the reported version. What is the answer?",
       "a": "One walk that multiplies, breadth-first or depth-first: O(R + V). The same currency is 1.0 and no chain is -1.0. No logarithms and no Bellman-Ford, because every chain gives the same product."
      },
      {
       "q": "How do you say it with no code?",
       "a": "Currencies are points, quotes are lines that work both ways at r and 1 over r. Walk from the source multiplying, mark seen, stop at the target. Give the cost and the two sentinels. AceOffer says one version was entirely spoken."
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
      },
      {
       "q": "Everyone within k hops, not a path.",
       "a": "Layered search that asks only users below distance k. The call count is the number of users with distance below k, which is also the lower bound for the set. PracHub's outline says this."
      },
      {
       "q": "Pagination and a token bucket.",
       "a": "A user with d friends and pages of c costs ceil(d / c) calls. A token bucket refills at rate r up to a burst b, and each call takes a token, so the long-run rate is at most r and bursts are at most b. PracHub lists both."
      },
      {
       "q": "Backoff with jitter.",
       "a": "On a rate-limit error wait a random time between 0 and the capped exponential, then retry. A plain exponential keeps the refused clients in step. The AWS Architecture Blog found jitter cut the calls by more than half in a 100-client simulation."
      },
      {
       "q": "Checkpointing and partial results.",
       "a": "Save the distance map, the layers and the asked set after each user. A restart skips the asked set, so only the call in flight can repeat. A run that must stop returns the layers it finished and says it is partial."
      },
      {
       "q": "Shortest path between two users.",
       "a": "Bidirectional breadth-first search, expanding the smaller frontier a full level at a time. Two balls of radius d / 2 hold far fewer users than one of radius d: 81 calls against 10,949 on the test network."
      },
      {
       "q": "A shared global rate limit.",
       "a": "One token bucket shared by all crawlers, taken under a lock, or one scheduler that owns every call. Two crawlers on one bucket stayed at the limit in the test. Across machines the bucket lives in one place, such as a shared store or a service."
      }
     ]
    },
    {
     "t": "faq",
     "title": "A million user IDs",
     "items": [
      {
       "q": "Two servers get the same new id.",
       "a": "A unique-key or conditional insert in the database decides. One row written means new. PracHub lists this follow-up. A local filter is only a hint."
      },
      {
       "q": "Ids are deleted.",
       "a": "A counting filter or a cuckoo filter can delete. Or leave the filter and let the exact store decide, since a stale bit only makes more 'maybe' answers. Rebuild on a schedule."
      },
      {
       "q": "A billion ids.",
       "a": "A write-ahead log, a table, and immutable sorted segments each with a Bloom filter, sharded by hash of the id. A check reads a segment only on a 'maybe'."
      },
      {
       "q": "How big should the filter be?",
       "a": "About 9.6 bits an id and 7 hashes for 1 percent false positives, 14.4 bits for 0.1 percent. If the count grows past what it was sized for, the rate climbs: rebuild bigger."
      }
     ]
    },
    {
     "t": "faq",
     "title": "Weighted top-k",
     "items": [
      {
       "q": "Candidates arrive as a stream.",
       "a": "The same heap of size k, O(log k) when a candidate beats the root. Memory is k, whatever the length."
      },
      {
       "q": "Weights change.",
       "a": "Keep an index from skill to who has it and a score table. One changed weight re-scores only those candidates: 2,981 cells against 120,000. Use integers so the deltas stay exact."
      },
      {
       "q": "Ties.",
       "a": "Say the rule: the earlier candidate wins. Put minus the arrival in the heap item. Ask whether they want something else, such as a second score."
      },
      {
       "q": "Too many for one machine.",
       "a": "Each shard returns its top k; merge shards * k items. Anyone in the global top k is in the top k of their own shard."
      },
      {
       "q": "Mandatory and optional skills.",
       "a": "Mandatory is a filter before scoring, optional only adds weight. Say which, because 'matches the job' could mean either."
      }
     ]
    },
    {
     "t": "p",
     "text": "**If you freeze.** Say the brute force and its cost. Say what you would count. Ask the interviewer one clarifying question. Then do the smallest example by hand, aloud. All three problems yield to that."
    },
    {
     "t": "p",
     "text": "**Where each finding came from.** AceOffer: aceoffer.app/interviews/mercor/interview-process (synthesis of 20 reports, Oct 2025 to Oct 2026). PracHub: the paid comparator (prachub.com/interview-questions/sort-with-a-90percent-accurate-paid-comparator-algorithm-accuracy-and-cost), chained currency conversion (prachub.com/interview-questions/currency-exchange-rate-between-two-currencies-via-chained-conversions), the friend network (prachub.com/interview-questions/exploring-a-friend-network-through-a-restricted-api-with-as-few-calls-as-possible), check-and-insert (prachub.com/interview-questions/check-and-insert-for-a-million-user-ids-balancing-latency-memory-and-accuracy), and the two sorting-theory reports (prachub.com/interview-experiences, the 19 Sep and 1 Oct 2026 posts for Mercor). JobMentis: jobmentis.com/en/interviews/mercor/swe. Bloom filter figures: Wikipedia, Bloom filter. Backoff and jitter: the AWS Architecture Blog, exponential backoff and jitter. All are candidate-written or third-party reconstructions, not Mercor's own words."
    }
   ]
  }
 ]
});
