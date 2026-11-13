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
     "text": "**Not this round:** sorting theory (merge sort against a factorial or random sort), a coffee probability puzzle, a threaded-cache code review, a CSV writer review and an idempotent payment call are reported for the verbal phone screen, not the 30-minute onsite block. The onsite objects are the comparator, chained rates and the friend network, each with one well-posed question, a correctness argument and a cost or budget analysis, and no data model or diagram."
    },
    {
     "t": "p",
     "text": "**The pattern across all three:** each hides its difficulty in a model you must pin down first: the error model, the consistency assumption, or the restriction. Jump to an algorithm before clarifying it and you answer an easier problem than the one being graded. Open every prompt with three minutes of: what exactly is wrong or limited, deterministic or random, what is capped (count, rate or page size), what counts as success, what may be assumed. Then state the cost twice: total work, then elapsed time given parallelism and limits."
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
   "id": "onsite-friend",
   "title": "3. Friend network, few API calls",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** You can see a social network only through an API: friends(user) returns that user's friends, each call is a network round trip, and the API has a restriction on it. Reach the part of the network you need with as few calls as possible. Reported variants: everyone within k hops of a user (PracHub, 25 Sep 2026); the shortest path between two users, at most k hops."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.** The input is a graph you cannot see, only probe. The cost is calls, not CPU: the question is which users you ever need to ask about.",
      "The hidden structure is a layered search. A call on user u names all of u's friends, so you learn a user one hop further out without asking about that user.",
      "What is undefined: what a call returns (all friends, a page, a batch), what 'restricted' means (a rate limit, a budget, errors), a set within k hops or a path between two users, and whether friendship goes both ways.",
      "The size that decides it: with about 12 friends each, every hop multiplies the users by about 12. One ball of radius 4 is the whole network; two balls of radius 2 are a few hundred users.",
      "The trap: asking about the outermost layer. It is the biggest layer, and for the set within k hops you do not need it."
     ]
    },
    {
     "t": "table",
     "head": [
      "Ask",
      "If they say",
      "Then I"
     ],
     "rows": [
      [
       "What does one call return?",
       "All of a user's friends",
       "The cost is one call per user asked. I count calls with a wrapper, the way I count model calls."
      ],
      [
       "",
       "One page of c friends",
       "A user with d friends costs ceil(d / c) calls. I take pages lazily and expand low-degree users first."
      ],
      [
       "",
       "A batch of users in one call",
       "One call per level, so rounds equal hops. I ask if they charge by call or by lookup: the server does the same work."
      ],
      [
       "What is the question?",
       "Everyone within k hops of s",
       "Layer by layer. I ask only users below distance k. On a 20,000 user test network: 159 asked, 1,790 found."
      ],
      [
       "",
       "The shortest path between two users",
       "Two balls, one from each end, always growing the smaller frontier: 81 calls a query against 1,806 for one ball. For the path itself I keep parents and walk back from the meeting user."
      ],
      [
       "",
       "At most k hops",
       "Same, and I stop when the two depths add up to k: balls that deep would have met. Return None."
      ],
      [
       "",
       "Exactly k hops (the report was cut off)",
       "A different question: a walk can revisit people. I say so and ask which one they mean."
      ],
      [
       "Do I need the friendships among the outermost users?",
       "Yes",
       "Then that layer is asked too: 1,790 calls instead of 159. I say the price and ask if the set is enough."
      ],
      [
       "Do friendships go both ways?",
       "Yes",
       "Two balls are allowed."
      ],
      [
       "",
       "No",
       "Forward search only. A ball from b needs a 'who lists b' call: I ask if it exists."
      ],
      [
       "What is the restriction?",
       "A rate limit",
       "A token bucket before every call. On a refusal, wait a random time up to min(cap, base * 2^attempt) (full jitter) and retry a few times."
      ],
      [
       "",
       "A total budget of calls",
       "Layers, so a partial result is a clean ball. I say what I return when it runs out: the users found, with their distances."
      ],
      [
       "Can a long run stop?",
       "Yes",
       "Save the distance map and the set of users already asked. On resume, skip those. At most the call in flight repeats."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Two ideas. First, never ask about a user whose list you do not need. For the set within k hops that is every user below distance k and no one else: the users at distance k are named by those lists, and any user below k may have a friend at k that only they can tell you about, so no algorithm that has only friends(u) asks fewer. Second, for a path between two users a ball grows about 12 times a hop, so two balls of half the radius are far smaller than one ball of the full radius. Everything else (pages, rate limits, resume) is plumbing around one call."
    },
    {
     "t": "list",
     "items": [
      "**The conversation, in order.**",
      "**Restate and ask.** 'The only view of the graph is friends(u), each call costs, and I want the set within k hops, or a path? What does a call return, is friendship both ways, what is the restriction?' The table above is what I do with the answers.",
      "**Brute force and its cost.** 'BFS from s with a seen set. Each user is asked once, so calls equal users reached: about 12 to the d.'",
      "**The better idea.** For the set: stop asking at distance k, and say why that is the minimum. For a path: two balls, smaller frontier first.",
      "**Restrictions, as they name them.** Pages, token bucket, backoff with jitter, budget, batch. Each wraps the call, so the search does not change.",
      "**Code, small.** within_k is a layered loop. degrees is two dicts, two frontiers and a level at a time. The exit: after a whole level the smallest total is exact.",
      "**Test on a small case, aloud.** a-b, a-c, b-d, c-d, d-e: a to e is 3, and None with k = 2. Then the numbers from a larger run.",
      "**Follow-ups.** The second table. Say what changes and what it costs."
     ]
    },
    {
     "t": "write",
     "id": "onsite-fr-w",
     "q": "Try it first. Which questions do you ask, what are the two ideas, and what count would you quote?",
     "starter": "Questions:\n\nIdea 1 (the set within k hops):\n\nIdea 2 (the path):\n\nThe count I would quote:\n",
     "hint": "A call names a whole friend list. Which users must you ask about, and which can you skip? Each hop multiplies the users by about 12.",
     "solution": "Questions: what a call returns, the question (set or path), both ways or not, the restriction.\nIdea 1: ask only users below distance k. Users at distance k are named by those lists, and any user below k may have a friend at k that only they can tell me about, so none of them can be skipped.\nIdea 2: two balls, smaller frontier first, stop when they touch.\nCount: 20,000 users, 12 friends each: 159 asked for the set within 3 hops; for a path, 81 calls a query against 1,806 for one ball.",
     "say": "**I think the call is the cost, so I count calls the way I count model calls.** For the set I ask only the users below distance k, because their lists already name the users at k. For a path I grow a ball from each end, always the smaller one. On a 20,000 user test network that was 1,806 calls for one ball and 81 for two."
    },
    {
     "t": "problem",
     "id": "onsite-friend-p",
     "title": "Friend network through a limited API",
     "source": "Mercor-style algorithms discussion; PracHub and candidate reports, rebuilt",
     "d": "medium",
     "minutes": 30,
     "why": "Every call is a cost, so the question is which users you ever ask about. Say it aloud first, then open the solution.",
     "statement": "You can learn who is friends with whom only by calling friends(user). Part 1: return everyone within k hops of s, with their distances, using as few calls as you can. Part 2: given two users, return how many hops separate them (None if unconnected, or if more than max_hops), using as few calls as you can.",
     "examples": [
      {
       "input": "a-b, a-c, b-d, c-d, d-e; degrees(a, e)",
       "output": "3",
       "note": "With max_hops = 2 it is None."
      },
      {
       "input": "20,000 users, about 12 friends each, 40 random pairs",
       "output": "one ball 1,806 calls a query, two balls 81",
       "note": "Counted by the Api wrapper in the tests."
      },
      {
       "input": "the same network, within_k(0, 3)",
       "output": "1,790 users found, 159 calls",
       "note": "One call per user below distance 3."
      }
     ],
     "constraints": [
      "standard library only",
      "friendships go both ways",
      "friends(u) is the only way to see the graph",
      "a call costs the same whatever it returns"
     ],
     "starter": "def within_k(api, s, k):\n    ...\n\n\ndef degrees(api, a, b, max_hops=None):\n    ...",
     "hints": [
      "Level 1: layer by layer, and a seen set. Does a user at distance k need to be asked?",
      "Level 2: for a path, grow a ball around a and another around b, and always the smaller one.",
      "Level 3: finish the whole level before returning: two balls can touch at several users with different totals."
     ],
     "solution": "def within_k(api, s, k):\n    \"\"\"Everyone within k hops, with distances. Only users below distance k are asked about.\"\"\"\n    dist, level = {s: 0}, [s]\n    for d in range(k):\n        nxt = []\n        for u in level:\n            for v in api.friends(u):\n                if v not in dist:\n                    dist[v] = d + 1                # named by u's list: no call needed for v itself\n                    nxt.append(v)\n        level = nxt\n    return dist\n\n\ndef degrees(api, a, b, max_hops=None):\n    \"\"\"Hops between a and b, or None. A ball around each end; always grow the smaller frontier.\"\"\"\n    if a == b:\n        return 0\n    dist, frontier, depth = ({a: 0}, {b: 0}), ([a], [b]), [0, 0]\n    while frontier[0] and frontier[1]:\n        s = 0 if len(frontier[0]) <= len(frontier[1]) else 1\n        mine, other, nxt, best = dist[s], dist[1 - s], [], None\n        for u in frontier[s]:\n            for v in api.friends(u):\n                if v in other:                     # the balls touch\n                    t = mine[u] + 1 + other[v]\n                    best = t if best is None else min(best, t)\n                elif v not in mine:\n                    mine[v] = mine[u] + 1\n                    nxt.append(v)\n        depth[s] += 1\n        if best is not None:                       # a whole level is done, so the smallest total is exact\n            return best if max_hops is None or best <= max_hops else None\n        if max_hops is not None and sum(depth) >= max_hops:\n            return None                            # two balls that deep would have met\n        frontier = (nxt, frontier[1]) if s == 0 else (frontier[0], nxt)\n    return None\n",
     "complexity": "within_k makes one call per user below distance k. degrees asks about two balls of radius about d / 2 instead of one of radius d: balls grow about 12 times a hop, so measured 81 calls against 1,806. Memory: the users in the balls.",
     "explain": [
      "Api is a counter in the tests: friends(u) is one call, friends_many is one call for a level.",
      "within_k never asks about a user at distance k: they are named by the friend lists of users at k - 1.",
      "degrees keeps one distance map and one frontier per end. It grows the smaller frontier a whole level, and the smallest total after that level is exact.",
      "max_hops: when the two depths add up to max_hops and the balls have not touched, no path that short exists."
     ],
     "tests": "import random\nfrom collections import deque\n\n\nclass Api:\n    \"\"\"The only way to see the graph. Counts calls; a batch is one call.\"\"\"\n    def __init__(self, graph):\n        self.graph, self.calls = graph, 0\n\n    def friends(self, u):\n        self.calls += 1\n        return self.graph.get(u, [])\n\n    def friends_many(self, users):\n        self.calls += 1\n        return {u: self.graph.get(u, []) for u in users}\n\n\ndef one_sided(api, a, b):\n    \"\"\"Baseline: one ball from a, stop when b is first named.\"\"\"\n    if a == b:\n        return 0\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        for v in api.friends(u):\n            if v == b:\n                return d + 1\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\ndef batched(api, a, b):\n    \"\"\"One call per level: rounds = hops.\"\"\"\n    if a == b:\n        return 0\n    seen, level, hops = {a}, [a], 0\n    while level:\n        hops += 1\n        found, nxt = api.friends_many(level), []\n        for u in level:\n            for v in found[u]:\n                if v == b:\n                    return hops\n                if v not in seen:\n                    seen.add(v)\n                    nxt.append(v)\n        level = nxt\n    return None\n\n\ntiny = {\"a\": [\"b\", \"c\"], \"b\": [\"a\", \"d\"], \"c\": [\"a\", \"d\"], \"d\": [\"b\", \"c\", \"e\"], \"e\": [\"d\"]}\nprint(\"a to e:\", degrees(Api(tiny), \"a\", \"e\"), \"| within 2 hops of a:\", within_k(Api(tiny), \"a\", 2))\nprint(\"a to e with k = 2:\", degrees(Api(tiny), \"a\", \"e\", max_hops=2), \"| a to a:\", degrees(Api(tiny), \"a\", \"a\"),\n      \"| unconnected:\", degrees(Api({\"x\": [], \"y\": []}), \"x\", \"y\"))\n\nrng = random.Random(7)\nn = 20000                                          # about 12 friends each, friendships go both ways\ngraph = {u: [] for u in range(n)}\nfor u in range(n):\n    for _ in range(6):\n        v = rng.randrange(n)\n        if v != u and v not in graph[u]:\n            graph[u].append(v)\n            graph[v].append(u)\n\n\ndef truth(a, b):                                   # straight from the dict, no api\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        if u == b:\n            return d\n        for v in graph[u]:\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\npairs = [(rng.randrange(n), rng.randrange(n)) for _ in range(40)]\ntotal = {\"one ball\": 0, \"two balls\": 0, \"batched (rounds)\": 0}\nfor a, b in pairs:\n    want = truth(a, b)\n    for name, fn in ((\"one ball\", one_sided), (\"two balls\", degrees), (\"batched (rounds)\", batched)):\n        api = Api(graph)\n        assert fn(api, a, b) == want, (name, a, b)\n        total[name] += api.calls\nfor name, calls in total.items():\n    print(\"%-17s %7.1f calls a query\" % (name, calls / len(pairs)))\n\nfor k in (2, 4, 6):                                # the hop cap: right answer, or None past it\n    for a, b in pairs:\n        want = truth(a, b)\n        assert degrees(Api(graph), a, b, max_hops=k) == (want if want is not None and want <= k else None)\nprint(\"hop caps 2, 4, 6 agree with a plain search on all 40 pairs\")\n\napi = Api(graph)\nfound = within_k(api, 0, 3)\nwant = {0: 0}\nqueue = deque([0])\nwhile queue:                                       # plain search, to compare\n    u = queue.popleft()\n    if want[u] < 3:\n        for v in graph[u]:\n            if v not in want:\n                want[v] = want[u] + 1\n                queue.append(v)\nassert found == want\ninner = [u for u, d in found.items() if d < 3]\nassert api.calls == len(inner)                     # one call per user below distance 3, none for the rim\npages = sum(max(1, -(-len(graph[u]) // 8)) for u in inner)\nprint(\"within 3 hops of user 0: %d users, %d asked about, %d calls (%d with pages of 8)\" % (len(found), len(inner), api.calls, pages))\napi2 = Api(graph)\nwithin_k(api2, 0, 4)\nprint(\"asking the rim too (k = 4 to get its friendships): %d calls\" % api2.calls)\n"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "a to e: 3 | within 2 hops of a: {'a': 0, 'b': 1, 'c': 1, 'd': 2}\na to e with k = 2: None | a to a: 0 | unconnected: None\none ball           1805.9 calls a query\ntwo balls            80.7 calls a query\nbatched (rounds)      4.4 calls a query\nhop caps 2, 4, 6 agree with a plain search on all 40 pairs\nwithin 3 hops of user 0: 1790 users, 159 asked about, 159 calls (316 with pages of 8)\nasking the rim too (k = 4 to get its friendships): 1790 calls"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "Users with huge friend lists",
       "Pages, taken lazily. Grow the ball from the end with fewer friends.",
       "ceil(d / c) calls for a user with d friends"
      ],
      [
       "A rate limit",
       "A token bucket before each call. Full jitter backoff on a refusal.",
       "Time is calls divided by the rate, plus waits"
      ],
      [
       "Calls are slow",
       "Batch a level in one friends_many call. Rounds equal hops.",
       "4.4 calls a query here; the server does the same lookups"
      ],
      [
       "The run can crash",
       "Save the distance map and the asked set. Skip the asked on resume.",
       "One call in flight may repeat"
      ],
      [
       "Many queries on one network",
       "Cache every friend list across queries.",
       "Memory for the lists; a repeat query costs 0 calls"
      ],
      [
       "The graph changes while I search",
       "Cache entries get a time limit. Accept a slightly stale ball, or re-ask the frontier.",
       "Some repeat calls"
      ],
      [
       "Several workers, one global limit",
       "One token bucket under a lock, or one scheduler that owns every call.",
       "A lock per call; contention"
      ],
      [
       "Weighted friendships (closeness)",
       "BFS no longer finds the shortest. Ask in order of distance, with a heap (Dijkstra).",
       "A log factor"
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "1. Why check for b when it is named, not when it comes off the queue?",
       "a": "**Decided.** Return the moment b appears in a friend list.\n\n**Instead of.** Checking when the user is taken off the queue.\n\n**Why.** The last level is the biggest, and by then you have paid for every user ahead of b on it.\n\n**What it costs.** Nothing.\n\n**If they push.** \"Measured on my test network: 10,949 calls a query when popped, 1,806 when named. Same answers.\""
      },
      {
       "q": "2. Why finish the whole level before returning from two balls?",
       "a": "**Decided.** Expand a full level, then take the smallest total.\n\n**Instead of.** Returning at the first touch.\n\n**Why.** Two balls can touch at several users in one level, with different totals. The minimum is exact only after the whole level.\n\n**What it costs.** A few extra calls on the last level.\n\n**If they push.** \"Returning at the first touch can be one hop too long.\""
      },
      {
       "q": "3. Why only users below distance k, and why is that the minimum?",
       "a": "**Decided.** Ask users below k, never the rim.\n\n**Instead of.** Asking everyone reached.\n\n**Why.** A user below k may have a friend at distance k that only they can tell you about, so each must be asked. The rim is already named by their lists.\n\n**What it costs.** If they need the friendships among the rim, the rim is asked too: 1,790 calls instead of 159.\n\n**If they push.** \"That is a lower bound for any algorithm that has only friends(u), so no cleverness gets under it.\""
      },
      {
       "q": "4. Why the smaller frontier?",
       "a": "**Decided.** Always grow the smaller side.\n\n**Instead of.** Alternating sides.\n\n**Why.** Each level multiplies a frontier by the friend count. Growing the smaller side keeps the balls about equal, and a celebrity at one end cannot blow it up.\n\n**What it costs.** Needs friendship to go both ways, and a frontier size to compare.\n\n**If they push.** \"If it only goes one way I cannot grow from b, so I fall back to one ball.\""
      },
      {
       "q": "5. Why a token bucket, and why jitter?",
       "a": "**Decided.** A bucket of tokens refilled at the allowed rate, one token per call. Full jitter on a refusal.\n\n**Instead of.** Sleeping 1 / rate between calls, and a fixed backoff.\n\n**Why.** The bucket allows a burst up to its size and keeps the long-run rate. Without jitter every refused client retries at the same moment (AWS Architecture Blog, exponential backoff and jitter).\n\n**What it costs.** A lock if several crawlers share it.\n\n**If they push.** \"I inject the clock, so a test of a 20 second run takes no time.\""
      },
      {
       "q": "6. What I would do with another hour",
       "a": "**Decided.** Write the paged fetch with the bucket and backoff on a fake clock, and test a stop and resume.\n\n**Instead of.** Moving on with only the search written.\n\n**Why.** In the round the restrictions are talk; the search is the part that has to be right.\n\n**What it costs.** About twenty more lines.\n\n**If they push.** \"Resume must never ask a user twice: I would test that by counting calls with and without the stop.\""
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
   "id": "algo-ids",
   "title": "4. A million user IDs: check and insert",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** A service receives user IDs, or usernames that must be unique, and for each one must answer 'is this new?' and record it. A million of them. Balance latency, memory and accuracy. Reported variants: check and insert for a million user IDs (PracHub, 4 Oct 2026); unique usernames, first with memory to spare, then with the names on disk."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.** Two operations, one step: 'is it new' and 'record it' must be a single atomic action. Check, then insert, is the bug.",
      "The hidden structure is a set. The real question is what each mistake costs: a false 'new' makes a duplicate user; a false 'seen' costs a read if you confirm it, and a customer if you do not.",
      "What is undefined: dense integers or strings, whether two spellings are one name (case, Unicode), one process or many servers, memory or disk, deletes and reuse, whether it must survive a restart.",
      "The size that decides it: a million ids is small. A Python set holds them in about 62 MB, a Bloom filter at 1 percent in 1.2 MB, a bitmap of dense integers in 125 KB. A billion is where memory stops.",
      "The trap: reaching for a Bloom filter first. It is a speed-up in front of the exact record, never the record. 'Not in it' is certain; 'in it' means maybe."
     ]
    },
    {
     "t": "table",
     "head": [
      "Ask",
      "If they say",
      "Then I"
     ],
     "rows": [
      [
       "Must the answer be exact?",
       "Yes",
       "A hash set, or a unique index in a database. A million ids is about 62 MB in Python."
      ],
      [
       "",
       "A rare false 'seen' is fine, a false 'new' never",
       "A Bloom filter in front. It can say 'maybe' wrongly, never 'no' wrongly. A 'maybe' is confirmed against the exact record."
      ],
      [
       "What are the ids?",
       "Dense integers",
       "A bitmap: one bit per id, a million in 125 KB. Check and insert are one bit read and set."
      ],
      [
       "",
       "Strings, usernames",
       "Normalise first (NFKC, strip, casefold), then the set. Two spellings must be one key."
      ],
      [
       "",
       "Names with reserved words or holds",
       "A reserved set checked first. A hold is a key with an expiry time, so a name can be kept for someone mid sign-up."
      ],
      [
       "Who calls it?",
       "Many threads, one process",
       "One lock around check and insert. With 8 threads offering the same 5,000 ids, every id said 'new' once."
      ],
      [
       "",
       "Many servers",
       "The database decides: a unique key, and an insert that fails on a duplicate. The set in memory is only a cache."
      ],
      [
       "Does it fit in memory?",
       "No, the names live on disk",
       "Newest names in a memory table, older ones in sorted segments on disk, each with a Bloom filter. A free name reads about 1 percent of the segments."
      ],
      [
       "Are ids deleted and reused?",
       "Yes",
       "Exact set: remove it. A Bloom filter cannot delete: use a counting filter (counters, several times the memory) or rebuild the segment."
      ],
      [
       "Must it survive a restart?",
       "Yes",
       "Write to a log before acknowledging. Rebuild the memory table from the log."
      ],
      [
       "How many ids?",
       "A billion, or many servers",
       "Shard by hash of the id. Each shard owns its keys and enforces uniqueness with its own unique key. The filter lets a shard skip misses."
      ],
      [
       "What false positive rate?",
       "Tighter",
       "Each extra 4.8 bits an id divides it by about 10: 9.6 bits is 1 percent, 14.4 bits about 0.1 percent."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** One atomic add-if-absent is the correctness: a lock in one process, a unique key in a database across servers. The Bloom filter is only a speed-up in front. 'No' is certain, so a new id skips the exact record 99 times in 100; 'maybe' still asks the record. It never reports a duplicate as new, because add only sets bits and never clears them. Size it by bits per id: 9.6 bits and 7 hashes give 1 percent, so a million ids take 1.2 MB."
    },
    {
     "t": "list",
     "items": [
      "**The conversation, in order.**",
      "**Restate and ask.** 'Check and insert a million ids, many callers. Exact or approximate? Integers or strings? One process or many? Memory or disk? Are ids deleted?'",
      "**Brute force.** 'A hash set and a lock. A million ids is about 62 MB and every check is O(1). That is the answer unless a number says otherwise.'",
      "**Make it atomic.** 'Check then insert lets two threads both say new. One step under a lock, or a unique key.'",
      "**Memory is tight.** 'A Bloom filter in front of the exact record: no false new, a small false maybe, confirmed against the record.' Quote 9.6 bits for 1 percent.",
      "**Code, small.** normalise, a Bloom of fifteen lines, check_and_insert under the lock.",
      "**Test on a small case, aloud.** Ana, ANA, 'ana ' and a fullwidth A are one name. Eight threads, 5,000 ids, 5,000 'new'. Fresh ids: about 1 percent say maybe.",
      "**Follow-ups.** The second table: deletes, two servers, a billion ids."
     ]
    },
    {
     "t": "write",
     "id": "onsite-dd-w",
     "q": "Try it first. Which structure for a million ids, where does the atomic step sit, and what does the Bloom filter buy?",
     "starter": "Structure:\n\nThe atomic step:\n\nWhat the Bloom filter buys, and its limit:\n",
     "hint": "What is a false 'new' worth, and what is a false 'seen' worth? Which one can a filter never make?",
     "solution": "Structure: a hash set for the exact record (about 62 MB for a million ids); a bitmap if the ids are dense integers (125 KB).\nAtomic step: check and insert as one action, under a lock in one process, or a unique key in the database across servers.\nBloom filter: 'no' is certain, so most new ids skip the exact record. 'Maybe' is confirmed against it. At 9.6 bits an id it says maybe about 1 percent of the time for a new id. It never says 'no' for an id that was added.",
     "say": "**I think the exact record is the answer for a million ids, and the one thing to get right is that check and insert are a single step.** If memory is tight, a Bloom filter in front: a 'no' is certain and skips the record, a 'maybe' is confirmed against it. At 9.6 bits an id that is 1 percent, 1.2 MB for a million."
    },
    {
     "t": "problem",
     "id": "onsite-dedupe-p",
     "title": "Check and insert for a million user IDs",
     "source": "PracHub and candidate reports, rebuilt",
     "d": "medium",
     "minutes": 30,
     "why": "One atomic step, then a filter that never lies in the dangerous direction. Say it aloud first, then open the solution.",
     "statement": "check_and_insert(name) returns True if the name is new and records it. Names that differ only by case, spacing or Unicode form are the same name. Many threads call it. Then put a Bloom filter in front so that most new names never touch the exact record, without ever reporting a duplicate as new.",
     "examples": [
      {
       "input": "Ana, ANA, 'ana ', fullwidth A + na, Bo",
       "output": "True False False False True",
       "note": "Four spellings, one name."
      },
      {
       "input": "8 threads each offering the same 5,000 ids",
       "output": "5,000 'new' in total, once per id",
       "note": "The lock makes check and insert one step."
      },
      {
       "input": "200,000 new ids with the filter in front",
       "output": "338 exact reads instead of 200,000",
       "note": "Counted while the filter fills."
      }
     ],
     "constraints": [
      "standard library only",
      "a repeat is never reported as new",
      "the filter is only a speed-up, the set is the record"
     ],
     "starter": "def normalise(name):\n    ...\n\n\nclass Registry:\n    def check_and_insert(self, name):\n        ...",
     "hints": [
      "Level 1: a set and a lock. Check and add inside one 'with lock'.",
      "Level 2: normalise before anything else: NFKC, strip, casefold.",
      "Level 3: ask the filter first. A 'no' means new. A 'maybe' is confirmed against the set."
     ],
     "solution": "import hashlib\nimport math\nimport threading\nimport unicodedata\n\n\ndef normalise(name):\n    \"\"\"Two spellings that are the same name must give the same key.\"\"\"\n    return unicodedata.normalize(\"NFKC\", name).strip().casefold()\n\n\nclass Bloom:\n    \"\"\"m bits, k hashes. 'Not in it' is certain. 'In it' only means maybe. No deletes.\"\"\"\n    def __init__(self, n, bits_per_item=9.6):          # 9.6 bits an item is about 1 percent false positives\n        self.m = int(n * bits_per_item)\n        self.k = max(1, round(bits_per_item * math.log(2)))\n        self.bits = bytearray(self.m // 8 + 1)\n\n    def _spots(self, x):\n        h = hashlib.blake2b(x.encode(), digest_size=16).digest()\n        a, b = int.from_bytes(h[:8], \"big\"), int.from_bytes(h[8:], \"big\") | 1\n        return [(a + i * b) % self.m for i in range(self.k)]   # k positions from two hashes\n\n    def add(self, x):\n        for p in self._spots(x):\n            self.bits[p >> 3] |= 1 << (p & 7)\n\n    def __contains__(self, x):\n        return all(self.bits[p >> 3] >> (p & 7) & 1 for p in self._spots(x))\n\n\nclass Registry:\n    \"\"\"check_and_insert is ONE step under a lock: check, then add, lets two threads both say 'new'.\n    store is the exact record (a database in real life). The filter only saves reads of it.\"\"\"\n    def __init__(self, bloom=None):\n        self.store, self.bloom, self.reads, self.lock = set(), bloom, 0, threading.Lock()\n\n    def check_and_insert(self, name):\n        \"\"\"True if the name was new.\"\"\"\n        key = normalise(name)\n        with self.lock:\n            if self.bloom is None or key in self.bloom:    # no filter, or 'maybe seen': ask the exact record\n                self.reads += 1\n                if key in self.store:\n                    return False\n            self.store.add(key)\n            if self.bloom is not None:\n                self.bloom.add(key)\n            return True\n",
     "complexity": "check_and_insert is O(1) on average and one lock. The Bloom filter takes k hash positions per id: 7 at 9.6 bits. Memory: the set, plus 1.2 MB per million ids for the filter.",
     "explain": [
      "normalise gives one key to every spelling of a name. casefold, not lower: it turns the German sharp s into ss.",
      "Bloom adds by setting k bits and tests by reading them. Nothing ever clears a bit, so an added id is always found.",
      "Registry keeps the exact record in store (a database in real life) and counts reads of it.",
      "A 'maybe' from the filter is not trusted: it is confirmed against the store, so a false maybe costs one read and never a wrong answer."
     ],
     "tests": "import random\nimport sys\n\nnames = Registry()\nprint([names.check_and_insert(x) for x in (\"Ana\", \"ANA\", \"ana \", \"\\uff21na\", \"Bo\")])   # 4th is a fullwidth A\n\nn = 200000\nbloom = Bloom(n)\nr = Registry(bloom)\nassert all(r.check_and_insert(\"u%d\" % i) for i in range(n))              # every new id is reported new\nassert not any(r.check_and_insert(\"u%d\" % i) for i in range(0, n, 97))   # every repeat is caught\nprint(\"filling the filter: %d exact reads for %d new ids, instead of %d\" % (r.reads - len(range(0, n, 97)), n, n))\nfresh = sum(1 for i in range(n) if \"x%d\" % i in bloom)\ntheory = (1 - math.exp(-bloom.k * n / bloom.m)) ** bloom.k\nprint(\"full filter, %d hashes, %.1f bits an id: %.4f of fresh ids say 'maybe' (formula %.4f)\" % (bloom.k, bloom.m / n, fresh / n, theory))\n\nmillion = set(range(10 ** 6))\nexact = sys.getsizeof(million) + 28 * len(million)\nprint(\"a million ids: python set about %.0f MB; bloom at 1 percent %.1f MB; bitmap of dense ints %.3f MB\" % (exact / 1e6, 1e6 * 9.6 / 8 / 1e6, 1e6 / 8 / 1e6))\n\nreg = Registry()\nids = [\"u%d\" % i for i in range(5000)]\nwins = []\n\n\ndef worker(seed):\n    order = ids[:]\n    random.Random(seed).shuffle(order)\n    wins.append(sum(1 for u in order if reg.check_and_insert(u)))\n\n\nthreads = [threading.Thread(target=worker, args=(s,)) for s in range(8)]\n[t.start() for t in threads]\n[t.join() for t in threads]\nassert sum(wins) == len(ids) == len(reg.store)\nprint(\"8 threads offering the same 5000 ids: %d said 'new', once per id\" % sum(wins))\n"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "[True, False, False, False, True]\nfilling the filter: 338 exact reads for 200000 new ids, instead of 200000\nfull filter, 7 hashes, 9.6 bits an id: 0.0098 of fresh ids say 'maybe' (formula 0.0100)\na million ids: python set about 62 MB; bloom at 1 percent 1.2 MB; bitmap of dense ints 0.125 MB\n8 threads offering the same 5000 ids: 5000 said 'new', once per id"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "Ids can be deleted and reused",
       "Exact set: discard. Bloom filter: a counting filter, or rebuild.",
       "Counters cost several times the bits; a rebuild reads every id"
      ],
      [
       "Two servers get the same new id",
       "A unique key in the shared database; the insert fails on a duplicate. The set in memory is a cache.",
       "A round trip per new id"
      ],
      [
       "A billion ids",
       "A write-ahead log, a memory table, and sorted segments each with a Bloom filter. Shard by hash of the id.",
       "A free id reads about 1 percent of the segments; compaction later"
      ],
      [
       "A latency target",
       "The filter in memory answers 'new' with no read of the record.",
       "1.2 MB per million ids"
      ],
      [
       "A false 'seen' must never reach a user",
       "Always confirm a 'maybe' against the record.",
       "One read for about 1 percent of new ids, plus every real repeat"
      ],
      [
       "Reserved and held names",
       "A reserved set checked first; a hold is a key with an expiry.",
       "A clock, and a policy for how long to hold"
      ],
      [
       "Look-alike letters (Latin a and Cyrillic a)",
       "Reject names that mix alphabets, after normalising.",
       "Some real names are refused"
      ],
      [
       "Memory is much tighter",
       "Fewer bits per id. Each 4.8 fewer multiplies false maybes by about 10.",
       "More reads of the record"
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "1. Why a lock around check and insert?",
       "a": "**Decided.** One step under a lock.\n\n**Instead of.** Checking, then adding.\n\n**Why.** Two threads can both see 'not there' before either adds, and both report new. The test with 8 threads shows exactly one True per id.\n\n**What it costs.** Callers wait for each other.\n\n**If they push.** \"Across servers the unique key in the database does the same job, so no lock is shared.\""
      },
      {
       "q": "2. Why can the filter never report a duplicate as new?",
       "a": "**Decided.** Only set bits in add.\n\n**Instead of.** A filter that can clear bits.\n\n**Why.** An added id has its k bits set, and nothing clears them, so it is always found. The filter can only be wrong the other way: a 'maybe' for an id that was never added.\n\n**What it costs.** No deletes. A counting filter has counters and can delete, at several times the memory.\n\n**If they push.** \"A wrong 'maybe' costs one read of the record, never a wrong answer.\""
      },
      {
       "q": "3. Why is the filter a speed-up and not the record?",
       "a": "**Decided.** The set (or database) is the record. The filter sits in front.\n\n**Instead of.** Trusting a 'maybe'.\n\n**Why.** A Bloom filter cannot list or delete its members, and 1 percent of its maybes are wrong.\n\n**What it costs.** One exact read for each 'maybe'.\n\n**If they push.** \"In my run a filling filter saved 199,662 of 200,000 reads.\""
      },
      {
       "q": "4. Why normalise, and why casefold?",
       "a": "**Decided.** NFKC, strip, then casefold, before the key is made.\n\n**Instead of.** Comparing the raw string, or lower().\n\n**Why.** Two spellings must be one key. lower() keeps the German sharp s as one letter; casefold turns it into ss, so the string gets longer. Compare only casefolded keys.\n\n**What it costs.** A name can be refused that someone wanted.\n\n**If they push.** \"Dots in an email local part are a separate rule and a different problem.\""
      },
      {
       "q": "5. Why 9.6 bits and 7 hashes?",
       "a": "**Decided.** 9.6 bits an id, and k = bits times ln 2, about 7.\n\n**Instead of.** A bigger filter, or more hashes.\n\n**Why.** At the best k the false positive rate is about 0.6185 to the power of bits an id, so 9.6 bits is 1 percent. More hashes than the best k fill the filter faster and raise the rate.\n\n**What it costs.** 1.2 MB per million ids.\n\n**If they push.** \"0.1 percent needs 14.4 bits, 1.8 MB per million.\""
      },
      {
       "q": "6. What I would do with another hour",
       "a": "**Decided.** Add a write-ahead log and rebuild the filter from it on restart, and a counting filter for deletes.\n\n**Instead of.** Moving on with the in-memory version only.\n\n**Why.** The first question after 'it works' is what happens at restart.\n\n**What it costs.** A log file and a replay loop.\n\n**If they push.** \"I would also run the 8-thread test against a version without the lock, to show the race.\""
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
     "text": "**The problem, as you might hear it.** You have a pile of candidates, each with skills and levels, and a job with a weight on each skill. Return the best k. Reported (JobMentis question bank, Mercor onsite coding): the top k candidates by a weighted skill score from resume JSON, and whether a candidate matches a job's mandatory and optional skills. No report gives the follow-ups, so ties, streaming and changing weights below are the pushes the problem leads to, not reported wording."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "The input is a set of candidates, each a map of skill to level, plus a weight per skill. The score is a sum of weight times level.",
      "The structure is a selection problem, not a sort: I need k of n, and I never need the order of the other n - k.",
      "Undefined: mandatory versus optional skills, ties, k bigger than n, negative or missing weights, whether the data is a stream.",
      "The sizes that decide it are n and k. n in the millions and k of 10 points to a heap of k, not a sort.",
      "The trap: a max-heap puts the best at the root, which tells you nothing about who to drop. The root must be the worst of the kept k."
     ]
    },
    {
     "t": "table",
     "head": [
      "Ask",
      "If they say",
      "Then I"
     ],
     "rows": [
      [
       "How big are n and k?",
       "k is small, n is large",
       "A min-heap of size k, one pass: O(n log k) time, O(k) space. For k = 10 and a million candidates that is about 3 million steps against about 20 million for a sort."
      ],
      [
       "",
       "k is close to n",
       "Sort everyone, O(n log n). The heap has no advantage."
      ],
      [
       "",
       "n is small",
       "Sort, and say a heap is for when n or k is large."
      ],
      [
       "What is a mandatory skill?",
       "A filter: without it the candidate is out",
       "Skip that candidate before scoring."
      ],
      [
       "",
       "Only a bonus",
       "Give it weight in the score and keep the candidate."
      ],
      [
       "What about ties?",
       "Earlier arrival wins",
       "Heap item (score, -arrival, id). A later equal score never replaces an earlier one because replacement needs strictly better."
      ],
      [
       "",
       "Any order is fine",
       "Drop the arrival term, and say the output is then not repeatable."
      ],
      [
       "Is it a stream?",
       "Yes",
       "The same heap, offered one candidate at a time. O(k) memory however long it runs."
      ],
      [
       "Do weights change?",
       "Yes",
       "Keep scores up to date with an inverted index (skill to who has it), so a changed weight touches only the people with that skill. Use integer weights so stored scores do not drift."
      ],
      [
       "Does a candidate's level change?",
       "Yes",
       "Update that one score. A heap kept between calls needs lazy deletion, so I rebuild from the stored scores."
      ],
      [
       "Does it span machines?",
       "Yes",
       "Each shard returns its top k, and I merge shards x k items. Anyone in the global top k is in the top k of their own shard."
      ],
      [
       "k is 0, or above n?",
       "Edge cases",
       "k = 0 returns an empty list. k above n returns everyone."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Keep a min-heap of at most k items so its root is the worst of the best k. For each candidate, score it. If the heap is not full, push. Otherwise, if the candidate beats the root, replace the root. At the end, sort the k items. That is O(n log k) time and O(k) space, against O(n log n) to sort everyone. The tie rule rides on the tuple order: (score, minus arrival, id), so a higher score wins and, at equal scores, the earlier arrival wins."
    },
    {
     "t": "list",
     "items": [
      "**The conversation, in order.**",
      "Restate and ask: n and k, how the score works, mandatory versus optional, ties, a stream or fixed data.",
      "Brute force: score everyone, sort, take k. O(n log n). Fine for thousands, wasteful when k is 10 and n is a million.",
      "The better idea: a min-heap of k. The root is the worst of the kept, so it is what a new candidate must beat.",
      "Code top_k, a few lines. Say the tuple, say why strictly better.",
      "Test on a small case: three candidates with the same score, k = 2, the first two come back. Then compare against a full sort on many.",
      "Follow-ups from the table: a changing weight, a changing candidate, shards, a stream."
     ]
    },
    {
     "t": "write",
     "id": "onsite-tk-clarify-w",
     "q": "Try it first. Write your questions, each with the answer you expect.",
     "starter": "1. \n2. \n3. \n4. ",
     "hint": "The input shape and the score; mandatory skills; n and k; ties and edge cases; streaming and changing weights.",
     "solution": "What is the input? A candidate id with skills and levels, and a job with a weight per skill.\nWhat is the score? The sum of weight times level; an unweighted skill counts 0.\nMandatory skills? A filter: without it the candidate is out.\nHow big are n and k? n in thousands to millions, k of 10.\nTies, and k above n? Earlier arrival wins; k above n returns everyone.\nStreaming or changing weights? Possible follow-ups, so I design so they are cheap.",
     "say": [
      "**I ask how big n and k are, how the score works, what a mandatory skill does, and how ties are broken.** Those four set the algorithm."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-topk-p",
     "title": "Weighted top-k over candidates",
     "source": "Core of the top-k answer, run with Python 3",
     "d": "medium",
     "minutes": 20,
     "why": "A min-heap of k with a tie rule in the tuple, and the shard merge that follows from it.",
     "statement": "Write top_k(profiles, weights, k, mandatory=()) returning the best k as (id, score), best first, in one pass, ties by arrival.",
     "examples": [
      {
       "input": "three candidates scoring 2 each, k = 2",
       "output": "[('a', 2), ('b', 2)]",
       "note": "The earlier arrivals stay."
      }
     ],
     "constraints": [
      "standard library only",
      "O(n log k) time, O(k) space"
     ],
     "starter": "def top_k(profiles, weights, k, mandatory=()):\n    ...\n",
     "hints": [
      "The heap root must be the worst of the kept k, so use a min-heap.",
      "Put minus the arrival in the tuple so ties go to the earlier candidate."
     ],
     "solution": "import heapq\n\n\ndef score(skills, weights):\n    \"\"\"skills: {skill: level}. A skill nobody weighted counts for 0.\"\"\"\n    return sum(weights.get(s, 0) * lvl for s, lvl in skills.items())\n\n\ndef top_k(profiles, weights, k, mandatory=()):\n    \"\"\"Best k, best first. One pass, a min-heap of k: O(n log k) time, O(k) space.\n    Heap item (score, -arrival, id): higher score is better, and at equal scores the earlier arrival.\"\"\"\n    heap = []                                      # the root is the worst of the kept k\n    if k <= 0:\n        return []\n    for arrival, (cid, skills) in enumerate(profiles.items()):\n        if not all(m in skills for m in mandatory):\n            continue                               # mandatory skill missing: out\n        item = (score(skills, weights), -arrival, cid)\n        if len(heap) < k:\n            heapq.heappush(heap, item)\n        elif item > heap[0]:                       # strictly better than the worst kept\n            heapq.heapreplace(heap, item)\n    return [(cid, sc) for sc, _, cid in sorted(heap, reverse=True)]\n\n\ndef merge_shards(per_shard, k):\n    \"\"\"Each shard returns its own top k (id, score, arrival). The global top k is inside their union.\"\"\"\n    return heapq.nlargest(k, per_shard, key=lambda r: (r[1], -r[2]))",
     "complexity": "O(n log k) time, O(k) space. The shard merge offers shards x k items to one heap.",
     "explain": [
      "The tuple compares left to right: score first, then minus arrival. The id is never reached.",
      "item > heap[0] means strictly better, so a later equal score does not displace an earlier one."
     ],
     "tests": "import random\n\nrng = random.Random(1)\nweights = {\"python\": 3, \"sql\": 2, \"go\": 1}\npeople = {f\"c{i}\": {s: rng.randint(1, 5) for s in rng.sample(list(weights) + [\"rust\", \"java\"], rng.randint(1, 4))}\n          for i in range(20000)}\n\ndef baseline(k, mandatory=()):\n    rows = [(-score(sk, weights), i, cid) for i, (cid, sk) in enumerate(people.items()) if all(m in sk for m in mandatory)]\n    return [(cid, -neg) for neg, _, cid in sorted(rows)[:k]]\n\nprint(\"heap equals sort-everyone:\", top_k(people, weights, 10) == baseline(10))\nprint(\"with two mandatory skills:\", top_k(people, weights, 10, (\"python\", \"sql\")) == baseline(10, (\"python\", \"sql\")))\nprint(\"ties keep arrival order:\", top_k({\"a\": {\"x\": 2}, \"b\": {\"x\": 2}, \"c\": {\"x\": 2}}, {\"x\": 1}, 2))\nprint(\"k = 0:\", top_k(people, weights, 0), \"| k above n:\", len(top_k({\"a\": {\"x\": 1}}, {\"x\": 1}, 5)))\n\nnames = list(people)\nshards = [dict((c, people[c]) for c in names[i::4]) for i in range(4)]\nrows = []\nfor sh in shards:\n    for cid, sc in top_k(sh, weights, 10):\n        rows.append((cid, sc, names.index(cid)))\nprint(\"4 shards merged equals one machine:\", [r[0] for r in merge_shards(rows, 10)] == [c for c, _ in top_k(people, weights, 10)])"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "heap equals sort-everyone: True\nwith two mandatory skills: True\nties keep arrival order: [('a', 2), ('b', 2)]\nk = 0: [] | k above n: 1\n4 shards merged equals one machine: True"
    },
    {
     "t": "table",
     "head": [
      "They ask",
      "The change",
      "Cost"
     ],
     "rows": [
      [
       "Why a heap and not a sort?",
       "Selection needs only the best k. A heap of k does it in one pass.",
       "O(n log k) against O(n log n)."
      ],
      [
       "A stream of candidates",
       "The same heap, offered one at a time.",
       "O(k) memory, O(log k) per candidate."
      ],
      [
       "A weight changes",
       "An inverted index (skill to candidates) updates only the affected scores.",
       "Touches only candidates with that skill. Integer weights avoid drift."
      ],
      [
       "One candidate's level changes",
       "Change that one stored score, and read the top k from the stored scores.",
       "O(n log k) to read, or lazy deletion if the heap lives between calls."
      ],
      [
       "Spread over machines",
       "Each shard returns its top k, and I merge the shards x k items in one heap.",
       "Network is k items per shard."
      ],
      [
       "k is close to n",
       "Sort everyone.",
       "O(n log n)."
      ],
      [
       "Optional skills as a bonus",
       "Add them with a weight, keep the mandatory filter.",
       "Same pass."
      ],
      [
       "Equal scores and a fair order",
       "Break ties on arrival or on a stable key, and say which.",
       "None."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "A min-heap for the best k",
       "a": "**Decided.** The root is the worst of the kept k.\n\n**Instead of.** A max-heap.\n\n**Why.** The root is the one to compare a new candidate against and to throw out. A max-heap puts the best at the root and tells me nothing about who to drop.\n\n**What it costs.** None.\n\n**If they push.** Python's heapq is a min-heap, which is what I want."
      },
      {
       "q": "Minus the arrival in the tuple",
       "a": "**Decided.** (score, -arrival, id).\n\n**Instead of.** A separate tie-break check.\n\n**Why.** Tuples compare left to right and a bigger tuple is better. At equal scores the earlier arrival must be better, so it needs the bigger second part.\n\n**What it costs.** Slightly cryptic.\n\n**If they push.** Say it out loud, and write one test with equal scores."
      },
      {
       "q": "Strictly better than the root",
       "a": "**Decided.** item > heap[0].\n\n**Instead of.** At least as good.\n\n**Why.** A later equal score must not displace an earlier one. With 'at least as good' the output depends on arrival order in a way I cannot explain.\n\n**What it costs.** None.\n\n**If they push.** If they want the latest to win, flip the sign."
      },
      {
       "q": "Why not sort, and when is sorting right?",
       "a": "**Decided.** A heap.\n\n**Instead of.** Sorting everyone.\n\n**Why.** n log k against n log n. For k of 10 and a million candidates that is about 3 million steps against 20 million.\n\n**What it costs.** A heap is harder to read.\n\n**If they push.** If k is close to n, or n is small, I sort."
      },
      {
       "q": "Integers for weights and levels",
       "a": "**Decided.** Integer weights and levels.\n\n**Instead of.** Floats.\n\n**Why.** An index that adds deltas to stored scores drifts with floats over many changes.\n\n**What it costs.** Fractions or scaling for non-integer weights.\n\n**If they push.** With floats I recompute from scratch now and then."
      },
      {
       "q": "How the shards merge",
       "a": "**Decided.** Each shard returns its own top k, and I merge them.\n\n**Instead of.** Pulling every candidate to one machine.\n\n**Why.** Anyone in the global top k beats all but k - 1 others, so they are in the top k of their own shard.\n\n**What it costs.** Network of k items per shard.\n\n**If they push.** The tie rule needs a global arrival or a stable id."
      },
      {
       "q": "What I would do with another hour",
       "a": "**Decided.** An inverted index for changing weights, and tests for ties.\n\n**Instead of.** More features.\n\n**Why.** Weights and ties are where this breaks in practice.\n\n**What it costs.** Time.\n\n**If they push.** I would also test that the heap equals sort-everyone on random data, as in the output above."
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
