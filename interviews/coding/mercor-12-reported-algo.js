/* Mercor onsite, reported prompts not yet covered. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-reported-algo",
 "n": 12,
 "flow": true,
 "title": "Reported prompts not yet covered: algorithms",
 "minutes": 150,
 "lead": "After this part you can answer four reported Mercor prompts that the earlier parts leave open: the shortest path between two users within k hops, whether every car can park when each accepts a list of spots, unique usernames in memory and on disk, and the votes and cost of a paid comparator for a target accuracy. Each goes in the order you solve it: clarify, requirements, entities, the logic in English with numbers, the code for after, the review, and what the interviewer pushes on next. The prompts are not public, so these are rebuilt from candidate reports, and each links to the chapter that covers its base.",
 "sections": [
  {
   "id": "ra-intro",
   "title": "0. What is here, and what it leaves to other chapters",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Candidates have reported four prompts for the Mercor onsite that the earlier parts do not fully cover. The prompts are not public and the wording is rebuilt from the reports, so learn the shape and not a sentence. Each problem goes in the order you solve it: clarify, requirements, entities, the logic in English with numbers, the code for after, the review, and what the interviewer pushes on next. Every code sample was run with Python 3.12 and the printed output is the real one."
    },
    {
     "t": "list",
     "items": [
      "**1. The shortest path between two users, within k hops.** The report stops mid-sentence at 'of length k or', so the first thing to ask is whether the limit is at most k or exactly k. Coding 8 chapter 3 covers the friend network through a limited API (everyone within k hops, pages, rate limits, batching). This chapter adds the path itself, the hop cap and the two cost models side by side.",
      "**2. Cars with a list of acceptable spots.** Coding 7 chapter 12 solves the forward-only street. The reported follow-up is whether every car can park when each car accepts a list of spots. That is a different problem: a search, then a matching.",
      "**3. Unique usernames.** Coding 8 chapter 4 covers check-and-insert for a million IDs and Coding 9 chapter 6 covers the Bloom filter. This chapter covers what is new for names: two spellings of one name, two registrations at once, and reserved names.",
      "**4. A paid comparator that is right 90 percent of the time.** Coding 8 chapter 1 has the full treatment. This chapter keeps only the planning question: given a target accuracy, how many votes, and what does it cost in calls."
     ]
    },
    {
     "t": "p",
     "text": "**How to use it.** Say each answer aloud before you open the solution. The talk-only round is described in Coding 8 chapter 0: three minutes of clarifying, the slow answer with its cost as a number, one improvement with its new number, a small example, then change the goal."
    }
   ]
  },
  {
   "id": "ra-friend",
   "title": "1. Shortest path between two users, at most k hops",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A friend graph you can only see through a call: friends(user) returns that user's friends. Given two users, find the shortest chain of friends between them if it is at most k hops long. The report was cut off at 'of length k or', so the limit may be 'at most k' or something stricter. Ask. This chapter takes 'at most k', and returns None when the shortest chain is longer. The wide search is the slow answer. The fast answer grows a search from both ends, and the interesting part is the cost: how many friend lists you touch, and how many calls that is when each call is a slow request."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** 'You have a social network behind an API. Given two users and a number k, return the shortest path between them if it has at most k hops, otherwise say there is none. Minimise the work.'"
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** Each line changes the code: is the friendship two-way (the search from b needs it to be), is the answer a count of hops or the people on the path, and is the cost the edges you read or the calls you make."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets. The cost model is the question that matters most."
    },
    {
     "t": "write",
     "id": "ra-fr-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: what the call returns, the answer's shape, what counts as k. Errors: unknown user, a celebrity, the same user twice. Scope: who pays for a call, one query or many, code or talk.",
     "solution": "1. Primary capabilities\n- What does friends(u) return? Likely the whole list of u's friends. If it pages, a call is a page, and the count changes (Coding 8 chapter 3 has that).\n- Is friendship two-way? Likely yes. If not, the search from b needs a 'who lists b' call, which may not exist, and then two-sided search is off the table.\n- What does the answer look like? Likely the path, the people in order, and None when there is none within k.\n- 'Of length k or ...': at most k, or exactly k? Likely at most k. Exactly k is a different question (a walk may revisit people) and I would say so.\n- What is the cost: edges read, or calls? Likely calls, because each is a request. Edges matter when the graph is in memory.\n\n2. Error handling\n- A user that does not exist? Likely friends() returns an empty list or raises. I treat unknown as no friends.\n- a equal to b? Likely a path of one person, zero hops.\n- A celebrity with a million friends? Likely yes. One call returns a million entries, so I never grow a side that has a celebrity in its frontier if the other side is cheaper.\n\n3. Scope boundaries\n- One query, or many over the same graph? Likely many. Then a cache of friend lists pays. Out of scope for the core; a follow-up.\n- Can calls run together? Likely yes. It changes the unit from calls to rounds.\n- Code or talk? Talk first, code if asked.",
     "why": "The cost model decides between 'few edges' and 'few calls', and two-way friendship decides whether the second search exists at all. Each of the other answers is one line of code.",
     "say": "**First I ask what limit k is: at most k, or exactly k, since the prompt was cut off. Then three buckets.** What does a call return and is friendship two-way, because the second search needs that. What goes wrong, like a missing user or a celebrity. And what is the cost: edges I read, or calls I make, because they pull in different directions."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each testable."
    },
    {
     "t": "write",
     "id": "ra-fr-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "The answer, the cap, the cost counters, the early stop, equal users, unreachable, out of scope.",
     "solution": "1. path_within(api, a, b, k) returns the shortest path as a list of users from a to b if it has at most k hops, else None. Test: 60 random pairs on a 20,000 user network match a plain search from a, for k of 2, 4 and 6.\n2. Every step of a returned path is a real friendship. Test: each consecutive pair appears in the graph.\n3. The search never asks about a user at distance k or more from the start. Test: a pair 3 hops apart with k = 2 returns None.\n4. Each user is asked about at most once per query. Test: calls never exceed the number of users reached.\n5. a equals b returns [a]. A user with no friends gives None. Test: both.\n6. Calls and edges read are counted by the wrapper. Test: the printed averages.\n7. The second version, growing from both ends, returns the same answers with fewer calls. Test: the same 60 pairs; at k = 6 about 78 calls a query against about 2,655.\n8. Out of scope: pages, rate limits, caching across queries, weighted friendships, exactly-k paths.",
     "why": "Requirements 3 and 4 are the whole point of the cap and the seen set. Number 7 puts the comparison in a test so the claim has a number behind it.",
     "say": "I get eight requirements. **The answer is the shortest path with at most k hops, or None. The search never asks about anyone k hops out, and never asks about anyone twice.** The two-ended version must give the same answers with fewer calls, and I would put the average calls in a test."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if the design needs its data or behaviour."
    },
    {
     "t": "write",
     "id": "ra-fr-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "User: \nFriend list: \nAPI wrapper: \nParent map: \nFrontier: \nBall: \nPath: ",
     "hint": "We cannot see the graph. Which nouns are only what the API hands us?",
     "solution": "User: drop as a class. An id we pass to friends().\nFriend list: drop. What one call returns, a list of ids.\nAPI wrapper: keep. Two integers: calls (users asked about) and edges (entries received). It is how the cost is measured, and it is the only way the code touches the graph.\nParent map: keep. A dict from user to the user who first named them. It is also the seen set, and it gives the path by walking back.\nFrontier: keep. The list of users first met at the latest level; the next level is built from it.\nBall: keep, for the two-ended version. A parent map, a distance map and a frontier, one set for each end.\nPath: drop as a class. A list built by walking parents from the meeting user to each end.",
     "why": "The parent map does three jobs: seen set, distance carrier and path builder. That is why there is no Path class.",
     "say": "I keep the wrapper that counts, the parent map and the frontier. **The parent map is the seen set and also how I rebuild the path.** For the two-ended search there is one ball per end. A user, a friend list and a path are only ids and lists."
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.** Slow first, then the improvement, then the cost in both models."
    },
    {
     "t": "write",
     "id": "ra-fr-logic-w",
     "q": "Write the steps for the capped search, then the two-ended one, then the cost in edges and in calls. Put numbers on each.",
     "starter": "Capped search:\nWhy stop at k:\nTwo-ended search:\nWhy the smaller side:\nWhen to stop:\nCost in edges:\nCost in calls:\nCost in time:",
     "hint": "Each hop multiplies the users by about the number of friends. Two small balls instead of one big one.",
     "solution": "Capped search (breadth first):\n1. parent = {a: None}, level = [a].\n2. Repeat k times: for each user in the level, ask for the friends; each friend not in parent gets a parent and joins the next level. If it is b, walk the parents back and return.\n3. If the next level is empty, stop: b is not in a's part of the network.\n4. Users k hops out are named by the last level but never asked about. That is the cap.\n\nWhy stop at k: the cost is the number of users asked about. Each hop multiplies it by the average friends f. With f = 8 and k = 6 a full search asks about 1 + 8 + 64 + 512 + 4,096 + 32,768 = 37,449 users.\n\nTwo-ended search:\n1. One ball from a and one from b, each with its own parent map, distances and frontier.\n2. Grow the ball with the smaller frontier by one level.\n3. After each level, look at the users met in this level. One that both balls know is a meeting point with total hops da + db.\n4. Finish the level, then take the smallest total. That is exact: no shorter meeting exists, because every shorter path would have met earlier.\n5. Rebuild the path: a to the meeting user by a's parents, then the meeting user to b by b's parents, reversed.\n\nWhy the smaller side: a level multiplies a frontier by f. Growing the smaller keeps the two balls about the same size, and when one end is a celebrity the other end does the work.\n\nWhen to stop: when the balls have grown ha + hb levels with no meeting, the shortest path is longer than ha + hb. So stop at ha + hb = k and say None. Each ball reaches about k / 2 levels, so each asks about 1 + f + ... + f^(k/2 - 1): at k = 6, 2 * (1 + 8 + 64) = 146 users against 37,449.\n\nCost in edges (the graph in memory, so the cost is reads): the sum of the friend-list lengths of the users asked about. Measured on 20,000 users with 7.6 friends on average, k = 6: 20,994 edges a query for the capped search, 619 for two balls.\n\nCost in calls (each call a request): one per user asked about. Same runs: 2,655 calls against 78. The ratio is about 34 for calls and 34 for edges, because both grow with the ball.\n\nCost in time: at 100 ms a call one at a time, the first pair took 5,562 calls = 556 s for the capped search and 100 calls = 10 s for two balls. If a whole level goes out together the time is rounds: one per level, at most k for either search. The cheaper search is also the one with fewer requests in each round.\n\nEdge cases: a equal to b; no friends; a cycle (the parent map stops it); k = 0 (only a equal to b succeeds); k larger than needed (the search stops at the first meeting); a path longer than k (None).",
     "why": "Calls and edges move together in this graph because a call returns the whole list. They separate when a call pages, or when only the edges matter, which is why I say which cost I am counting.",
     "say": "**Slow first: ask about everyone, level by level, stop at k hops. With about eight friends each and k of six that is 37,000 users.** Better: grow from both ends, always the smaller side, and stop when the two balls meet or when their depths add up to k. Each ball is only three levels deep, so about 146 users. I count it two ways: edges I read if the graph is local, and calls if each friend list is a request. My run: 2,655 calls against 78 at k of six."
    },
    {
     "t": "p",
     "text": "**e) The code, for after you have talked it through.** Main function first, naming its helpers."
    },
    {
     "t": "write",
     "id": "ra-fr-code-w",
     "q": "Write path_within first, at the level you would say it aloud. Name the helpers, do not write them yet.",
     "starter": "def path_within(api, a, b, k):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "The cap is the loop count. Parents are both the seen set and the path.",
     "solution": "def path_within(api, a, b, k):\n    \"\"\"Shortest path with at most k hops, or None. One level a pass.\"\"\"\n    if a == b:\n        return [a]\n    parent = {a: None}                       # seen set and path in one\n    level = [a]\n    for _ in range(k):                       # the cap: k levels\n        level = ask_level(api, level, parent)\n        if b in parent:\n            return walk_back(parent, b)       # b was named: stop\n        if not level:\n            break                            # nothing left to explore\n    return None\n\n# helpers, in the workbench below:\n#   ask_level(api, level, parent)     ask about each user once, name the new ones (inline in the workbench)\n#   walk_back(parent, node)           follow the parents back to the start\n#   bidirectional(api, a, b, k)       the two-ended version, same answers\n",
     "why": "The main function reads like the plan. The workbench version checks b the moment it is named, inside the loop, which saves the rest of the last level.",
     "say": "I write the loop first because it is the plan. **Start with a in the parent map, run k levels, each level asks about each user once and names the new ones, and stop the moment b is named.** The helpers are the level step, the walk back, and the two-ended version."
    },
    {
     "t": "predict",
     "id": "ra-friend-pred",
     "code": "d = 8\nasked = lambda levels: sum(d ** i for i in range(levels))\nprint(asked(6), 2 * asked(3))\n",
     "q": "With 8 friends each: users asked about by a 6-hop search from one end, and by two balls of 3 levels each. What does this print? (Python 3.12.)",
     "answer": "37449 146",
     "why": "asked(levels) is 1 + 8 + 64 and so on, one term a level. Six levels: 1 + 8 + 64 + 512 + 4,096 + 32,768 = 37,449. Three levels is 73, and there are two balls. Halving the depth takes the cost from a power of 6 to twice a power of 3: this gap is the whole argument for the second search."
    },
    {
     "t": "problem",
     "id": "ra-friend-p",
     "title": "Shortest path within k hops, through a friend API",
     "source": "Candidate reports of a Mercor friend-network prompt, rebuilt; the original is cut off at 'of length k or'",
     "d": "medium",
     "minutes": 35,
     "why": "Two cost models for one search, the cap, and the reason the second ball is worth building. Say it aloud first; open the solution to check it.",
     "statement": "You can see a social network only through friends(user), which returns that user's friends. Given two users a and b and a number k, return the shortest chain of users from a to b if it has at most k hops, and None if there is no such chain.\n\nThen: count the cost two ways, the friend-list entries you read and the calls you make, and reduce both.",
     "examples": [
      {
       "input": "1-2, 1-3, 2-4, 3-4, 4-5; a = 1, b = 5, k = 3",
       "output": "[1, 2, 4, 5] (or [1, 3, 4, 5])",
       "note": "Three hops, exactly the cap."
      },
      {
       "input": "the same network, k = 2",
       "output": "None",
       "note": "The shortest chain has 3 hops, which is over the cap."
      },
      {
       "input": "20,000 users, 7.6 friends each, 60 random pairs, k = 6",
       "output": "capped search 2,655.3 calls and 20,993.8 edges a query; two balls 77.8 and 618.8",
       "note": "Averages printed by the tests below."
      }
     ],
     "constraints": [
      "standard library only",
      "the graph is seen only through api.friends(user)",
      "friendship goes both ways",
      "k is small, 2 to 6"
     ],
     "starter": "def path_within(api, a, b, k):\n    ...",
     "hints": [
      "Level 1: what does one call give you, and what do you do with a user you have seen already?",
      "Level 2: a user k hops from a is named by the last level you ask about. Do you need to ask about them?",
      "Level 3: the work grows by a factor of the friends each hop. What if two searches each went half as deep?"
     ],
     "solution": "class Api:\n    \"\"\"The only way to see the graph. friends(u) is one call and returns u's whole friend list.\n    calls counts users asked about; edges counts friend-list entries received.\"\"\"\n    def __init__(self, graph):\n        self.graph, self.calls, self.edges = graph, 0, 0\n\n    def friends(self, u):\n        self.calls += 1\n        out = self.graph.get(u, [])\n        self.edges += len(out)\n        return out\n\n\ndef walk_back(parent, node):\n    \"\"\"Follow parent pointers from node back to the start; return the path start..node.\"\"\"\n    path = []\n    while node is not None:\n        path.append(node)\n        node = parent[node]\n    path.reverse()\n    return path\n\n\ndef path_within(api, a, b, k):\n    \"\"\"Shortest path a..b with at most k hops, or None. Breadth first, one level per hop.\"\"\"\n    if a == b:\n        return [a]\n    parent = {a: None}               # also the seen set: a user in here is never asked about again\n    level = [a]\n    for _ in range(k):               # the depth cap: k levels, so users k hops away are named but never asked\n        next_level = []\n        for u in level:\n            for v in api.friends(u):\n                if v in parent:\n                    continue\n                parent[v] = u\n                if v == b:           # stop the moment b is named, not when it comes up to be asked\n                    return walk_back(parent, b)\n                next_level.append(v)\n        level = next_level\n        if not level:                # the whole component is explored and b is not in it\n            break\n    return None\n\n\ndef grow(api, frontier, parent, dist):\n    \"\"\"Ask about every user in the frontier; return the users first met now (the next frontier).\"\"\"\n    out = []\n    for u in frontier:\n        for v in api.friends(u):\n            if v in parent:\n                continue\n            parent[v] = u\n            dist[v] = dist[u] + 1\n            out.append(v)\n    return out\n\n\ndef bidirectional(api, a, b, k):\n    \"\"\"Same answer, two balls that grow towards each other. Always grow the smaller one.\"\"\"\n    if a == b:\n        return [a]\n    pa, pb = {a: None}, {b: None}    # parents, one map per side\n    da, db = {a: 0}, {b: 0}          # hops from each end\n    fa, fb = [a], [b]                # the frontier of each side\n    ha = hb = 0                      # how many levels each side has grown\n    best = None                      # (total hops, meeting user)\n    while fa and fb and ha + hb < k: # if no meeting by ha + hb, the path is longer than ha + hb\n        if len(fa) <= len(fb):       # grow the cheaper side by one level\n            fa, ha = grow(api, fa, pa, da), ha + 1\n            fresh = fa\n        else:\n            fb, hb = grow(api, fb, pb, db), hb + 1\n            fresh = fb\n        for u in fresh:              # a user known to both sides is a meeting point\n            if u in da and u in db and (best is None or da[u] + db[u] < best[0]):\n                best = (da[u] + db[u], u)\n        if best:                     # the whole level is done, so the smallest total is exact\n            break\n    if best is None or best[0] > k:\n        return None\n    meet = best[1]\n    return walk_back(pa, meet) + walk_back(pb, meet)[-2::-1]\n",
     "complexity": "Capped search: one call per user within k - 1 hops, so about f^(k-1) calls and f^k edges read for f friends each. Two balls: about 2 * f^(k/2 - 1) calls. The parent maps take memory the size of the users named.",
     "explain": [
      "Api is the counter in front of the graph. calls is the number of users asked about; edges is the number of entries received. A call returns the whole friend list, so edges is calls times the friends a user has.",
      "path_within runs k levels. The parent map is the seen set and the way back. A user is named by the level before and never asked about at the cap level.",
      "walk_back follows parents to the start and reverses the list.",
      "grow asks about every user in one frontier and returns the users first met. The same step serves both balls.",
      "bidirectional grows the smaller ball, and stops when the depths add up to k without a meeting. It finishes the level before taking the smallest total, so the answer is exact. The path is a's side to the meeting user, then b's side reversed.",
      "The tests compare both searches with a plain search from a on 60 pairs and 3 caps. The printed output:\ncap 2  bfs        calls a query     8.9   edges touched a query     70.9\ncap 2  two balls  calls a query     2.0   edges touched a query     15.9\ncap 4  bfs        calls a query   408.0   edges touched a query   3244.2\ncap 4  two balls  calls a query    17.9   edges touched a query    143.3\ncap 6  bfs        calls a query  2655.3   edges touched a query  20993.8\ncap 6  two balls  calls a query    77.8   edges touched a query    618.8\nbfs        5562 calls =  556.2 s at 100 ms a call, one at a time\ntwo balls   100 calls =   10.0 s at 100 ms a call, one at a time\naverage friends a user: 7.6"
     ],
     "tests": "import random\nfrom collections import deque\n\nrng = random.Random(7)\nn = 20000\ngraph = {u: set() for u in range(n)}\nfor u in range(n):                          # friendship goes both ways\n    while len(graph[u]) < 6:\n        v = rng.randrange(n)\n        if v != u:\n            graph[u].add(v)\n            graph[v].add(u)\ngraph = {u: sorted(vs) for u, vs in graph.items()}\n\n\ndef true_hops(a):\n    \"\"\"The slow, certain answer: hops from a to everyone, by plain breadth first search.\"\"\"\n    dist, queue = {a: 0}, deque([a])\n    while queue:\n        u = queue.popleft()\n        for v in graph[u]:\n            if v not in dist:\n                dist[v] = dist[u] + 1\n                queue.append(v)\n    return dist\n\n\ndef check(path, a, b, hops, k):\n    if hops is None or hops > k:\n        assert path is None, (a, b, path)\n        return\n    assert path[0] == a and path[-1] == b and len(path) - 1 == hops, (a, b, path, hops)\n    assert all(y in graph[x] for x, y in zip(path, path[1:]))     # every step is a real friendship\n\n\n# small hand-made cases first\ntiny = {1: [2, 3], 2: [1, 4], 3: [1, 4], 4: [2, 3, 5], 5: [4], 6: []}\nassert path_within(Api(tiny), 1, 5, 3) in ([1, 2, 4, 5], [1, 3, 4, 5])\nassert path_within(Api(tiny), 1, 5, 2) is None             # 3 hops needed, cap is 2\nassert path_within(Api(tiny), 1, 6, 9) is None             # not connected\nassert path_within(Api(tiny), 1, 1, 0) == [1]\nassert bidirectional(Api(tiny), 1, 5, 3) in ([1, 2, 4, 5], [1, 3, 4, 5])\nassert bidirectional(Api(tiny), 1, 5, 2) is None\nassert bidirectional(Api(tiny), 1, 6, 9) is None\n\n# both searches against the certain answer, on many pairs and several caps\npairs = [(rng.randrange(n), rng.randrange(n)) for _ in range(60)]\nfor k in (2, 4, 6):\n    total = {\"bfs\": [0, 0], \"two balls\": [0, 0]}\n    for a, b in pairs:\n        hops = true_hops(a).get(b)\n        for name, fn in ((\"bfs\", path_within), (\"two balls\", bidirectional)):\n            api = Api(graph)\n            check(fn(api, a, b, k), a, b, hops, k)\n            total[name][0] += api.calls\n            total[name][1] += api.edges\n    for name, (calls, edges) in total.items():\n        print(\"cap %d  %-9s  calls a query %7.1f   edges touched a query %8.1f\" % (\n            k, name, calls / len(pairs), edges / len(pairs)))\n\n# slow API: 100 ms a call, one after the other, and then with a whole level asked together\na, b = pairs[0]\nfor name, fn in ((\"bfs\", path_within), (\"two balls\", bidirectional)):\n    api = Api(graph)\n    fn(api, a, b, 6)\n    print(\"%-9s %5d calls = %6.1f s at 100 ms a call, one at a time\" % (name, api.calls, api.calls * 0.1))\nprint(\"average friends a user: %.1f\" % (sum(len(v) for v in graph.values()) / n))\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why check for b when it is named and not when it comes up to be asked?",
       "a": "Asking is the cost. When b is named you already have the answer, so you skip the rest of the level. On the last level that is most of the work."
      },
      {
       "q": "Why does the loop run k times and not k plus one?",
       "a": "Level 0 is a. Asking about it names the users 1 hop away. After k passes the users k hops away are named, and that is as far as the cap lets a path go. A user k hops out is never asked about, since their friends would be k + 1 hops away."
      },
      {
       "q": "Why finish the whole level in the two-ended search before taking the best meeting?",
       "a": "Two users on the same level can both be known to the other ball, with different totals. The first one found is not always the smallest. The whole level has been paid for, so take the smallest."
      },
      {
       "q": "Why stop when ha + hb reaches k?",
       "a": "No meeting after ha + hb levels means every path is longer than ha + hb. So at ha + hb = k a path of at most k hops cannot exist."
      },
      {
       "q": "Why grow the smaller frontier?",
       "a": "A level multiplies a frontier by the friends. The smaller frontier is the cheaper to multiply, and it keeps the balls balanced. With a celebrity at one end the other end does the work."
      },
      {
       "q": "What breaks if friendship is one-way?",
       "a": "The search from b needs the users who list b as a friend. If the API cannot give that, the two-ended search is not possible and only the capped search from a works."
      }
     ]
    },
    {
     "t": "faq",
     "title": "g) What the interviewer pushes on next",
     "items": [
      {
       "q": "The call is slow. What changes?",
       "a": "The unit becomes rounds. All users in one level can be asked together, so rounds is the number of levels: at most k for either search. The two-ended search sends fewer requests in each round. At 100 ms a call one at a time, the first test pair was 556 s against 10 s."
      },
      {
       "q": "Many queries on the same graph?",
       "a": "Cache every friend list. A repeat query over users you have already asked about costs zero new calls. Say the memory cost: about the entries received."
      },
      {
       "q": "What if the API pages, or has a rate limit?",
       "a": "A call is a page, so a user with d friends and pages of c costs ceil(d / c) calls. A rate limit turns calls into time. Coding 8 chapter 3 has both, with a token bucket and backoff."
      },
      {
       "q": "Why not run the two searches in two threads?",
       "a": "You can: it halves the rounds, since each ball needs about k / 2. The cost is that the balls grow at their own speed, so you lose the smaller-side rule. I would measure before choosing."
      },
      {
       "q": "Exactly k hops, not at most?",
       "a": "Say what is allowed first: can a path revisit a person? If not, the question is a longest-style search and is much harder in general. With walks allowed it is the set of users reachable in exactly k steps, built level by level without a seen set."
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
       "why": "The yes-or-no version: a seen set and a search. The cap and the path are added here."
      },
      {
       "n": "Shortest Path in Binary Matrix",
       "d": "medium",
       "lc": "shortest-path-in-binary-matrix",
       "yt": [
        "YnxUdAO7TAo",
        "NeetCodeIO",
        13
       ],
       "why": "The same level-by-level search on a grid, with the path length as the answer."
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
       "why": "The harder follow-up: the graph is built as you go, and growing from both ends is the known speed-up."
      }
     ]
    }
   ]
  },
  {
   "id": "ra-parking",
   "title": "2. Cars with a list of acceptable spots",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Coding 7 chapter 12 has cars that take their preferred spot and move only forward. The reported follow-up changes the rule: each car accepts a list of spots, any one of them will do. Can every car park? It looks like the same street and it is not. A car's choice now blocks other cars, and the greedy 'take the first free spot' can fail on an input that has a solution. The slow answer is to try every choice and undo the ones that lead nowhere. The better answer sees the cars and the spots as two groups with lines between them, and moves cars that are already parked."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** 'There are n spots and some cars. Each car can use any spot from its own list. Can every car park?'"
    },
    {
     "t": "p",
     "text": "**What is left unsaid.** Do you return the parking or only yes or no, and if the answer is no, do you have to say why? Are there more cars than spots? Do the lists have any shape, like a run of spots? Each answer changes the algorithm."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets."
    },
    {
     "t": "write",
     "id": "ra-pk-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: yes or no, or the parking; the lists' shape. Errors: more cars than spots, an empty list, a spot named twice. Scope: size, forward-only or not.",
     "solution": "1. Primary capabilities\n- Is the answer yes or no, or a parking? Likely a parking, so I can check it.\n- Does a car take exactly one spot and a spot hold exactly one car? Likely yes.\n- What shape are the lists: any set, or a run of neighbouring spots (the forward-only street is a run)? Likely any set. A run has a faster special case, and I would mention it.\n- If it cannot be done, must I say why? Likely a short proof is a plus. A group of cars that accept fewer spots than there are cars in the group is one.\n\n2. Error handling\n- More cars than spots? Then the answer is no at once.\n- A car with an empty list? No, and that car is the proof.\n- A spot listed twice for one car? Harmless; the second is ignored.\n- A spot outside 0 to n - 1? Reject.\n\n3. Scope boundaries\n- How big? Likely hundreds of cars for the code, and I would say what changes at a million.\n- Cars arriving over time, or all known up front? Up front. Arriving one by one is the same method run once per car.\n- Best parking by some cost? Out of scope; that is the weighted version, the Hungarian method in Coding 9 chapter 10.",
     "why": "The shape of the lists is the question that can make the problem easy. A run of spots has a greedy answer; a general set needs the matching.",
     "say": "**I ask whether I return the parking or only yes or no, and what shape the lists have.** A run of neighbouring spots has a fast greedy. An arbitrary list does not. I also ask about more cars than spots, which is a no at once, and whether a short reason for a no is wanted."
    },
    {
     "t": "p",
     "text": "**b) Requirements.**"
    },
    {
     "t": "write",
     "id": "ra-pk-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "The answer, validity, the proof of a no, agreement between methods, the failure of greedy, the cost, out of scope.",
     "solution": "1. matching(ok, n) returns a spot for every car, or None with a group of cars that proves it. Test: 3,000 random cases agree with backtracking on yes or no.\n2. A returned parking is valid: every car has a spot it accepts and no spot is used twice. Test: checked on every yes.\n3. A no comes with a group of cars whose lists together name fewer spots than there are cars in the group. Test: checked on every no.\n4. Greedy, taking the first free spot in car order, is shown to fail. Test: cars [0, 1] and [0] give [0, None].\n5. A run of spots per car has a greedy that is right. Test: 2,000 random cases agree with the matching.\n6. Backtracking's cost on a no is shown. Test: 10 cars that all accept the same 9 spots take 986,409 tries.\n7. 400 cars in a chain where each pushes the next is solved. Test: everyone parks.\n8. Out of scope: costs, cars leaving, a million cars.",
     "why": "Requirements 4 and 6 are the two lessons: greedy fails, and trying everything explodes. Number 3 is the answer to 'why not?'.",
     "say": "**Seven things I would test: a valid parking, a reason for a no, greedy failing on a small case, the run-shaped greedy being right, and backtracking blowing up on a no.** Out of scope: costs, cars leaving, and a million cars."
    },
    {
     "t": "p",
     "text": "**c) Entities.**"
    },
    {
     "t": "write",
     "id": "ra-pk-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "Car: \nSpot: \nAcceptable list: \nOwner array: \nSeen set: \nStuck group: ",
     "hint": "What holds state during the search? What is only an index?",
     "solution": "Car: drop as a class. An index into the lists.\nSpot: drop as a class. An index 0 to n - 1.\nAcceptable list: keep. ok[c] is the list of spots car c accepts. The whole input.\nOwner array: keep. owner[s] is the car that holds spot s, or None. It is the current parking and the only state the matching keeps.\nSeen set: keep. The spots already tried while placing one car, so one search never visits a spot twice.\nStuck group: keep. The car that could not be placed plus the owners of every spot the search reached. It is the proof of a no.",
     "why": "The owner array is the current parking. The seen set is the guard that stops the search from going in circles.",
     "say": "I keep three things: the lists, the owner array which is the current parking, and the seen set for one attempt. **When a car cannot be placed, that car plus the owners of every spot the search visited is my proof of a no.**"
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.** Slow first, then the better view, then why greedy fails."
    },
    {
     "t": "write",
     "id": "ra-pk-logic-w",
     "q": "Write the steps for greedy and why it fails, then backtracking, then the matching, then the run-shaped special case. Put numbers on each.",
     "starter": "Greedy:\nWhy it fails:\nBacktracking:\nIts cost:\nMatching:\nWhy a no is a proof:\nRuns of spots:",
     "hint": "A car already parked can move if it has another acceptable spot. Follow the chain.",
     "solution": "Greedy:\n1. In car order, give each car the first acceptable spot that is free.\n2. O(total list length). It is fast.\n\nWhy it fails:\n1. Car 0 accepts spots 0 and 1; car 1 accepts only spot 0. Greedy gives car 0 spot 0, and car 1 has nothing. A valid parking exists: car 0 takes spot 1.\n2. A car's choice blocks later cars, and greedy never reconsiders. On 3,000 random small cases, greedy gave up on 314 of the 2,888 inputs that have a solution, about 11 percent.\n\nBacktracking:\n1. Place car 0 on its first free acceptable spot, then car 1, and so on.\n2. If a car has no free spot, go back to the previous car and try its next spot.\n3. It is always right, since it tries every choice.\n\nIts cost:\n1. When the answer is yes, it can be quick. When the answer is no, it must try every choice before saying so.\n2. 8 cars that all accept the same 7 spots: 13,699 tries. 9 cars, 8 spots: 109,600. 10 cars, 9 spots: 986,409. Roughly 8 to 9 times more for each car added.\n\nMatching (augmenting paths):\n1. Take the cars in order. To place car c, look at each spot it accepts, once.\n2. If the spot is free, take it. If it is held by car d, ask whether d can move to another spot it accepts, by the same steps, and the seen set stops loops.\n3. If d can move, d moves and c takes the spot. A chain of moves ending at a free spot is an augmenting path. Each successful chain adds one parked car.\n4. If no chain exists for c, c cannot be placed, and no later change helps it. Say no.\n5. Cost: each car does one search through at most all spots and lists: O(cars times total list length). A fast version (Hopcroft-Karp) is O(E times the square root of V).\n\nWhy a no is a proof (Hall's condition):\n1. When car c fails, every spot it reached is held by a car that also failed to move. The cars reached plus c are one more than the spots reached.\n2. All of their acceptable spots are among the spots reached. So a group of cars accepts fewer spots than it has cars. No parking can exist. Test: 3 cars that accept only spots 0 and 1: the stuck group is all three, accepting 2 spots.\n\nRuns of spots:\n1. If every car accepts a run lo to hi of neighbouring spots, walk the spots left to right.\n2. Give each spot to the waiting car whose run ends soonest; drop a car whose run has ended.\n3. This greedy is right, and O((cars + spots) log cars) with a heap. The forward-only street of Coding 7 chapter 12 is the case where every run ends at the last spot.\n\nEdge cases: more cars than spots (a no, the same proof); a car with an empty list; deep chains (400 cars pushing one by one needed 399 moves; recursion depth equals the chain, so an iterative version for thousands).",
     "why": "The lesson is when greedy is safe: only when a car's choice cannot hurt a later car. A list of any spots does not have that property; a run of spots sorted by its end does.",
     "say": "**Greedy, first free spot, fails: one car accepting 0 and 1 takes spot 0, and the car that accepts only 0 is stuck.** Backtracking is always right and explodes on a no: ten cars and nine spots took a million tries. The real answer is matching: if a car's spot is held, ask the holder to move, following a chain of moves until a free spot. If a car cannot be placed, that car and the owners of the spots I reached are my proof: more cars than spots they accept."
    },
    {
     "t": "p",
     "text": "**e) The code, for after you have talked it through.**"
    },
    {
     "t": "write",
     "id": "ra-pk-code-w",
     "q": "Write matching first, at the level you would say it aloud. Name the helper.",
     "starter": "def matching(ok, n):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "One car at a time; the helper asks 'can this car get a spot, moving others if needed?'.",
     "solution": "def matching(ok, n):\n    \"\"\"A spot for every car, or a group of cars that proves it is impossible.\"\"\"\n    owner = [None] * n                       # owner[s] = the car holding spot s\n    for c in range(len(ok)):\n        seen = set()\n        if not try_car(c, seen, owner, ok):  # c may push a parked car to another spot\n            group = [c] + [owner[s] for s in seen]\n            return None, group               # c and the holders it ran into: the proof\n    return assignment(owner, len(ok)), None\n\n# helpers, in the workbench below:\n#   try_car(c, seen, owner, ok)   the chain of moves; True if c now has a spot\n#   assignment(owner, cars)       spot per car, from the owner array (a short loop in the workbench)\n",
     "why": "The main function is a loop with a proof on failure. The workbench has try_car nested inside matching, to share the owner array.",
     "say": "**One car at a time. For each, try to place it; the helper may move a parked car to another spot it accepts. If a car cannot be placed, I return that car and the holders of the spots I reached as the reason.**"
    },
    {
     "t": "predict",
     "id": "ra-parking-pred",
     "code": "ok = [[0, 1], [1, 2], [0]]      # the spots each car accepts\ntaken, got = set(), []\nfor spots in ok:\n    pick = next((s for s in spots if s not in taken), None)\n    if pick is not None:\n        taken.add(pick)\n    got.append(pick)\nprint(got)\n",
     "q": "Greedy, first free acceptable spot in car order. What does this print? Then: is there a parking where all three park? (Python 3.12.)",
     "answer": "[0, 1, None]\nYes: car 2 takes spot 0, car 0 takes spot 1, car 1 takes spot 2.",
     "why": "Car 0 takes spot 0 and car 1 takes spot 1, so car 2, who accepts only spot 0, is stuck. A chain fixes it: car 2 asks car 0 to move; car 0 moves to spot 1, which asks car 1 to move; car 1 moves to spot 2, which is free. Three moves, all three park. Greedy never undoes a choice."
    },
    {
     "t": "problem",
     "id": "ra-parking-p",
     "title": "Can every car park, when each accepts a list of spots?",
     "source": "Candidate follow-up to the Mercor car-parking prompt, rebuilt",
     "d": "medium",
     "minutes": 40,
     "why": "The same street with a different rule turns a loop into a search and then into a matching. Say it aloud first; open the solution to check it.",
     "statement": "There are n spots numbered 0 to n - 1 and some cars. Car i accepts any spot in the list ok[i]. A spot holds one car and a car takes one spot.\n\nReturn a spot for every car, or None if that cannot be done. If it cannot, also return a group of cars that shows why.",
     "examples": [
      {
       "input": "ok = [[0, 1], [0]], n = 2",
       "output": "[1, 0]",
       "note": "A first-free-spot rule gives [0, None] and fails here."
      },
      {
       "input": "ok = [[0, 1], [0, 1], [0, 1]], n = 3",
       "output": "None, stuck group [0, 1, 2]",
       "note": "The group accepts 2 spots and has 3 cars."
      },
      {
       "input": "10 cars that all accept the same 9 spots",
       "output": "backtracking: 986,409 tries to say no; matching: no search of that size",
       "note": "Printed by the tests below."
      }
     ],
     "constraints": [
      "standard library only",
      "a car's list may have any spots",
      "n up to a few hundred for the recursive version"
     ],
     "starter": "def matching(ok, n):\n    ...",
     "hints": [
      "Level 1: try the cars in order, and put each on the first free spot it accepts. When does that go wrong?",
      "Level 2: when a car's spot is held, could the holder move to another spot it accepts?",
      "Level 3: follow a chain of such moves until a free spot. Keep a seen set so the chain cannot loop."
     ],
     "solution": "import heapq\n\n\ndef greedy(ok, n):\n    \"\"\"Each car, in order, takes the first acceptable spot that is free. Fast, and wrong on some inputs.\n    ok[c] is the list of spots car c accepts, spots are 0..n-1.\"\"\"\n    taken, got = set(), []\n    for spots in ok:\n        pick = None\n        for s in spots:\n            if s not in taken:\n                pick = s\n                break\n        if pick is not None:\n            taken.add(pick)\n        got.append(pick)\n    return got\n\n\ndef backtrack(ok, n):\n    \"\"\"Try every choice, undo when stuck. Returns (assignment or None, number of tries).\"\"\"\n    got = [None] * len(ok)\n    taken = set()\n    tries = [0]\n\n    def place(c):\n        if c == len(ok):\n            return True                       # every car has a spot\n        for s in ok[c]:\n            if s in taken:\n                continue\n            tries[0] += 1\n            taken.add(s)\n            got[c] = s\n            if place(c + 1):\n                return True\n            taken.remove(s)                   # undo: this choice led to a dead end\n            got[c] = None\n        return False\n\n    found = place(0)\n    return (list(got) if found else None), tries[0]\n\n\ndef matching(ok, n):\n    \"\"\"A car may push the car that holds its spot to another spot (an augmenting path).\n    Returns (assignment, None) when everyone parks, else (None, a stuck group of cars).\"\"\"\n    owner = [None] * n                        # owner[s] = the car holding spot s\n\n    def try_car(c, seen):\n        for s in ok[c]:\n            if s in seen:\n                continue                      # already tried for this car this round\n            seen.add(s)\n            if owner[s] is None or try_car(owner[s], seen):   # free, or its holder can move on\n                owner[s] = c\n                return True\n        return False\n\n    for c in range(len(ok)):\n        seen = set()\n        if not try_car(c, seen):\n            # c is stuck. The spots it visited (seen) are all held by cars that are also stuck.\n            group = [c] + [owner[s] for s in seen]\n            return None, group\n    got = [None] * len(ok)\n    for s, c in enumerate(owner):\n        if c is not None:\n            got[c] = s\n    return got, None\n\n\ndef greedy_for_ranges(ok_ranges, n):\n    \"\"\"Special case: every car accepts a run of spots lo..hi. Then greedy is right if you\n    walk the spots left to right and give each spot to the waiting car whose run ends soonest.\"\"\"\n    cars = sorted(range(len(ok_ranges)), key=lambda c: ok_ranges[c][0])\n    waiting, got, i = [], [None] * len(ok_ranges), 0\n    for s in range(n):\n        while i < len(cars) and ok_ranges[cars[i]][0] <= s:\n            heapq.heappush(waiting, (ok_ranges[cars[i]][1], cars[i]))\n            i += 1\n        while waiting and waiting[0][0] < s:  # this car's run ended before spot s: it can never park\n            heapq.heappop(waiting)\n        if waiting:\n            got[heapq.heappop(waiting)[1]] = s\n    return got\n",
     "complexity": "Greedy: O(total list length), and wrong on some inputs. Backtracking: up to n! tries on a no. Matching: O(cars times total list length); Hopcroft-Karp O(E times the square root of V). Range greedy: O((cars + spots) log cars).",
     "explain": [
      "greedy takes the first free acceptable spot. It is the plan the question tempts you into, kept so the failure can be shown.",
      "backtrack places cars in order, undoes a choice when the next car is stuck, and counts tries. On a no it must exhaust every choice.",
      "matching keeps owner[s]. try_car looks at each acceptable spot once (the seen set), and a held spot is passed to the holder, which tries to move. A success along the chain flips every owner on it.",
      "On a failure the group is the car plus the owner of every spot in seen: each of those owners also failed to move, and every acceptable spot of the group is in seen.",
      "greedy_for_ranges handles runs: each spot goes to the waiting car whose run ends first, and cars whose run ended are dropped.",
      "The tests compare the three methods on 3,000 random cases and check every yes and every no. The printed output:\ngreedy [0, None]   backtracking [1, 0]   matching [1, 0]\n3 cars, only spots 0 and 1 acceptable: stuck group [0, 1, 2] accepts 2 spots\n3000 random cases: 2888 can all park, 112 cannot; greedy gave up on 314 of the 2888 that can\n2000 random range cases: the range greedy agrees with matching\n 8 cars, 7 spots they all accept: backtracking made   13699 tries to say no\n 9 cars, 8 spots they all accept: backtracking made  109600 tries to say no\n10 cars, 9 spots they all accept: backtracking made  986409 tries to say no\n400 cars in a chain of pushes: everyone parks, greedy parks 399"
     ],
     "tests": "import random\n\n\ndef valid(ok, got):\n    \"\"\"Every car has a spot it accepts, and no spot is used twice.\"\"\"\n    spots = [s for s in got if s is not None]\n    return all(g in ok[c] for c, g in enumerate(got) if g is not None) and len(spots) == len(set(spots))\n\n\n# the case where greedy fails: car 0 takes spot 0, and car 1 accepts only spot 0\nok = [[0, 1], [0]]\nassert None in greedy(ok, 2)\ngot, group = matching(ok, 2)\nassert got == [1, 0] and group is None\nassert backtrack(ok, 2)[0] == [1, 0]\nprint(\"greedy %s   backtracking %s   matching %s\" % (greedy(ok, 2), backtrack(ok, 2)[0], got))\n\n# when it cannot be done, the stuck group is the proof (Hall): more cars than the spots they accept\nok = [[0, 1], [0, 1], [0, 1]]\ngot, group = matching(ok, 3)\nunion = {s for c in group for s in ok[c]}\nassert got is None and len(group) > len(union)\nprint(\"3 cars, only spots 0 and 1 acceptable: stuck group %s accepts %d spots\" % (sorted(group), len(union)))\n\n# random small cases: all three agree on yes or no, and every yes is a valid parking\nrng = random.Random(5)\nyes = no = greedy_wrong = 0\nfor _ in range(3000):\n    n = rng.randint(1, 6)\n    cars = rng.randint(1, n)\n    ok = [rng.sample(range(n), rng.randint(1, n)) for _ in range(cars)]\n    b, _ = backtrack(ok, n)\n    m, group = matching(ok, n)\n    assert (b is None) == (m is None)\n    if m is not None:\n        assert valid(ok, m) and valid(ok, b)\n        yes += 1\n        if None in greedy(ok, n):\n            greedy_wrong += 1\n    else:\n        no += 1\n        assert len(group) > len({s for c in group for s in ok[c]})\nprint(\"3000 random cases: %d can all park, %d cannot; greedy gave up on %d of the %d that can\" % (yes, no, greedy_wrong, yes))\n\n# ranges: the sorted-by-end greedy matches the full method\nfor _ in range(2000):\n    n = rng.randint(1, 8)\n    cars = rng.randint(1, n)\n    runs = []\n    for _ in range(cars):\n        lo = rng.randrange(n)\n        runs.append((lo, rng.randrange(lo, n)))\n    ok = [list(range(lo, hi + 1)) for lo, hi in runs]\n    g = greedy_for_ranges(runs, n)\n    assert valid(ok, g)\n    assert (None not in g) == (matching(ok, n)[0] is not None)\nprint(\"2000 random range cases: the range greedy agrees with matching\")\n\n# backtracking blows up on a no; matching does not\nfor cars in (8, 9, 10):\n    ok = [list(range(cars - 1)) for _ in range(cars)]          # one spot too few\n    got, tries = backtrack(ok, cars - 1)\n    assert got is None and matching(ok, cars - 1)[0] is None\n    print(\"%2d cars, %d spots they all accept: backtracking made %7d tries to say no\" % (cars, cars - 1, tries))\n\n# a bigger yes: car c prefers spot c + 1 but accepts spot c; the last car accepts only the last spot\nn = 400\nok = [[c + 1, c] for c in range(n - 1)] + [[n - 1]]           # the last car pushes 399 cars back one spot each\ngot, group = matching(ok, n)\nassert group is None and valid(ok, got)\nprint(\"400 cars in a chain of pushes: everyone parks, greedy parks %d\" % sum(g is not None for g in greedy(ok, n)))\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why a seen set inside one car's search?",
       "a": "Without it the chain can return to a spot it has already tried and loop. With it each spot is looked at once per car, so one car costs one pass over the lists."
      },
      {
       "q": "Why is it safe to say no the moment one car cannot be placed?",
       "a": "A car that cannot be placed after every chain of moves has been tried has a group of cars with too few acceptable spots between them. Later cars can only add demands. So the answer for the whole set is no."
      },
      {
       "q": "Why does the order of cars not matter for yes or no?",
       "a": "It can change which parking you get, not whether one exists. The chain of moves can reshuffle earlier cars, so an early car never blocks a later one for good."
      },
      {
       "q": "Why does backtracking explode on a no?",
       "a": "Every dead end is found only after trying all choices below it. With 10 cars on 9 spots the cars below the first choice are all stuck for the same reason, and backtracking rediscovers that in each branch."
      },
      {
       "q": "Why is the range case easy?",
       "a": "A car whose run ends soonest has the fewest chances left. Giving the spot to that car never takes a spot a later car needs more. That rule needs the ends to be ordered, which a general list does not have."
      }
     ]
    },
    {
     "t": "faq",
     "title": "g) What the interviewer pushes on next",
     "items": [
      {
       "q": "Make it faster for a million cars.",
       "a": "The recursive chain is too deep and O(cars times lists) is too slow. Hopcroft-Karp finds many shortest chains at once: O(E times the square root of V). Start from a greedy parking to cut the number of chains."
      },
      {
       "q": "Cars arrive one at a time. Do you redo everything?",
       "a": "No. Keep the owner array and run one try_car for the new car. If it fails, the new car does not park, and the earlier cars keep their spots."
      },
      {
       "q": "Cars leave.",
       "a": "Free the spot. No other car moves by itself. The next arrival may use it, and its chain of moves handles the rest."
      },
      {
       "q": "Each car has a cost per spot, and you want the cheapest total.",
       "a": "That is the weighted version, the assignment problem. The Hungarian method, O(n^3), or a minimum-cost flow when spots have capacities. Coding 9 chapter 10 has it."
      },
      {
       "q": "Why is this a bipartite matching?",
       "a": "Cars on the left, spots on the right, a line for each acceptable pair. A parking is a set of lines with no two touching the same car or spot. Everyone parks when that set can have one line per car."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Assign Cookies",
       "d": "easy",
       "lc": "assign-cookies",
       "yt": [
        "JW8fgvoxPTg",
        "NeetCodeIO",
        10
       ],
       "why": "A greedy that is right because of how the two sides are ordered: the range case in miniature."
      },
      {
       "n": "Maximum Matching of Players With Trainers",
       "d": "medium",
       "lc": "maximum-matching-of-players-with-trainers",
       "yt": [
        "ORr5HNEJNlU",
        "codestorywithMIK",
        15
       ],
       "why": "Matching with a threshold on each side, solved by sorting and a greedy pass."
      },
      {
       "n": "Maximum Number of Tasks You Can Assign",
       "d": "hard",
       "lc": "maximum-number-of-tasks-you-can-assign",
       "yt": [
        "bRxpEMjrb7c",
        "Leetcode Daily",
        9
       ],
       "why": "The harder follow-up: a matching with a limited number of boosts, where the greedy and a search on the answer meet."
      }
     ]
    }
   ]
  },
  {
   "id": "ra-names",
   "title": "3. Unique usernames: memory first, then disk",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Users pick a username and no two users may have the same one. It is reported in two parts: with plenty of memory, and with memory that is too small for the names, so they live on disk. Coding 8 chapter 4 covers the check-and-insert for a million IDs, and Coding 9 chapter 6 covers the Bloom filter itself. Read those first. What is new for names is that two different strings can be the same name, two sign-ups can arrive together, and some names are not for anyone to take."
    },
    {
     "t": "p",
     "text": "**The prompt, as a real one would give it.** 'Design username registration. Names must be unique. First with enough memory, then with the names on disk. How do you check, and what goes wrong?'"
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets. The question that decides the most is what counts as the same name."
    },
    {
     "t": "write",
     "id": "ra-un-clarify-w",
     "q": "Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: what counts as the same name, what is allowed. Errors: two at once, a crash, look-alikes. Scope: how many names, one server or many, who may release a name.",
     "solution": "1. Primary capabilities\n- What counts as the same name? Likely Alice and alice are the same, and a name with trailing spaces is the same. Probably also two ways of writing the same letter.\n- What names are allowed? Likely letters, digits, underscore, dot; 3 to 20 characters.\n- Is there a check before registering ('is it free?') as well as the registration? Likely yes. The check is only advice; the registration is the one that decides.\n- Can a name be reserved: words nobody may take, or a name held for someone mid sign-up? Likely yes to both.\n\n2. Error handling\n- Two sign-ups for the same name at the same moment? Likely exactly one wins.\n- Look-alike letters, like a Cyrillic a for a Latin a? Likely refused, since that is the impersonation trick.\n- Can a name be released, and reused at once? Likely after a pause, to stop one person taking a name another has left. A policy question.\n- A crash between check and write? The name must not be lost or given twice.\n\n3. Scope boundaries\n- How many names? A million fit in memory; a billion do not.\n- One server or many? Many, so the database's unique rule is the last word.\n- Code or talk? Talk first.",
     "why": "The first question is the most important. If the key is the raw string, 'Alice' and 'alice' are two users, and no data structure fixes that.",
     "say": "**I first ask what counts as the same name: case, spaces, and look-alike letters.** Then what goes wrong: two sign-ups at once, and a name released and taken again. And scope: a million names fit in memory, a billion do not, and with many servers the database's unique rule has the last word."
    },
    {
     "t": "p",
     "text": "**b) Requirements.**"
    },
    {
     "t": "write",
     "id": "ra-un-reqs-w",
     "q": "Write the requirements, numbered, each one testable, then what is out of scope.",
     "starter": "1. \n2. \n3. ",
     "hint": "The key, the registration, atomic, reserved, held, disk, the filter, out of scope.",
     "solution": "1. normalise(name) returns one key for names that are the same, and raises for names that are not allowed. Test: Alice, ALICE, '  alice ' and fullwidth ALICE give 'alice'; STRASSE and Strasse give 'strasse'; a name mixing Latin and Cyrillic letters is refused.\n2. register(name, account) returns True once and False after. Test: eight threads offering the same 2,000 names produce 2,000 registrations in total.\n3. The check and the add are one step. Test: with the other request run in the gap, the broken version says True twice and the fixed one says True once.\n4. Reserved words are refused to everyone. Test: admin and support.\n5. A name can be held for a token for a time. Others are refused until the hold runs out. Test: a 60 second hold, tried at 61 seconds.\n6. On disk, the newest names are in memory and older ones are in sorted files, each behind a Bloom filter. Test: 20,000 names in 8 files.\n7. A free name costs under 1.5 disk reads with 10 bits a name. Test: 0.81 against 88.\n8. A name that exists is never reported free. Test: taken names are found in every file.\n9. Out of scope: a write-ahead log, deleting from files, many servers (the unique rule of the database, as in Coding 8 chapter 4).",
     "why": "Requirement 1 comes first because every other requirement is about the key it returns. The tests give each a number.",
     "say": "**Nine requirements. The key function comes first, since everything uses its output. Then one winner per name even under a race, reserved and held names, then the disk version: newest names in memory, sorted files behind Bloom filters, and under 1.5 reads for a free name.**"
    },
    {
     "t": "p",
     "text": "**c) Entities.**"
    },
    {
     "t": "write",
     "id": "ra-un-entities-w",
     "q": "List the nouns. For each, keep or drop, why, and the data structure.",
     "starter": "Name: \nKey: \nRegistry: \nReserved list: \nHold: \nSorted file: \nBloom filter: \nMemory table: \nLock: ",
     "hint": "What carries state? What is only a string you compute?",
     "solution": "Name: drop as a class. What the user typed; kept only for display, not for comparison.\nKey: drop as a class. The output of normalise, a string used as the dict key.\nRegistry: keep. A dict from key to account id and a lock. One method, register.\nReserved list: keep. A set of keys. A reserved word is stored as a key, so it is matched the same way as any name.\nHold: keep. A dict from key to (token, expiry time). The clock is passed in, so it can be tested.\nSorted file: keep, for disk. Fixed-width records in sorted order, searched by seek. Immutable once written.\nBloom filter: keep, for disk. One per file, built when the file is written.\nMemory table: keep, for disk. A set of the newest names; flushed to a new file when it is full.\nLock: keep. One lock makes check and add a single step.",
     "why": "The key is what makes the names comparable. Everything else stores or finds keys.",
     "say": "**The name the user typed is for display. The key, made by normalise, is what every structure stores and compares.** A registry is a dict and a lock. For disk I add sorted files, one Bloom filter for each, and a memory table for the newest names."
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.**"
    },
    {
     "t": "write",
     "id": "ra-un-logic-w",
     "q": "Write the steps: the key, the in-memory registry and the race, reserved and held names, then the disk version and what the filter costs. Put numbers on each.",
     "starter": "The key:\nRegistry:\nThe race:\nReserved and held:\nDisk:\nBloom filter:\nTrade-off:\nMany servers:",
     "hint": "Normalise first. Then check and add as one step. On disk, newest first, filter before file.",
     "solution": "The key:\n1. Normalise to the compatibility form (fullwidth letters and ligatures become plain letters), strip spaces, then casefold. Casefold, not lower: it turns the German sharp s into 'ss', so STRASSE and Strasse are one name.\n2. Check the allowed characters and length on the key.\n3. Refuse a key whose letters come from two alphabets. Normalising does not merge a Cyrillic a with a Latin a, since they are different letters that look alike, so refusal is the defence.\n4. Keep the typed name beside the key, for display.\n\nRegistry (memory):\n1. A dict from key to account id. register under one lock: if the key is taken or reserved, False; otherwise store it and return True.\n2. O(1) a registration. A million names is tens of MB.\n\nThe race:\n1. Check then add is two steps. Between them the other request can run, so both see the name free and both add it.\n2. Shown by hand: with the second request run inside the gap, both said True, and the owner is whichever wrote last or first by accident.\n3. Fix: one lock around check and add. 8 threads offering the same 2,000 names produced 2,000 registrations in total, one per name.\n4. A free-looking 'is it available?' check shown while typing is advice. Only register decides.\n\nReserved and held:\n1. Reserved words (admin, support) are stored as keys, so 'ADMIN' is refused like 'admin'.\n2. A hold keeps a name for a token (the sign-up form) for some time. register succeeds only for the same token, or after the hold's expiry. A held name tried at second 10 by someone else is refused; after the hold runs out it is free.\n3. A released name is free at once here. A cool-off before reuse is a policy choice, to stop one user taking a name another has left.\n\nDisk, names too many for memory:\n1. Newest names in a memory table. When it holds 2,500, write it as a sorted file of fixed-width records and start a new table.\n2. To check a name: the table first, then the files from newest to oldest.\n3. A file is searched by binary search with seek: about log2 of its records, 12 reads for 2,500.\n4. 20,000 names are 8 files. With no filter, a free name costs a search in every file: 88 reads on average. That is the cost to cut.\n\nBloom filter:\n1. One per file, built when the file is written. It says 'certainly not here' or 'maybe'.\n2. A 'certainly not' skips the file. A 'maybe' costs the search of the file.\n3. A free name, the usual case at sign-up, then costs a read only where the filter lies. At 10 bits a name: 0.81 reads, 100 times fewer.\n4. A taken name must be confirmed on disk, so the filter does not save the file where it lives.\n\nTrade-off:\n1. More bits a name, fewer wrong 'maybe' answers and more memory. Measured per file asked: 4 bits, 14.8 percent wrong, 13.0 reads; 8 bits, 2.4 percent, 2.1 reads; 10 bits, 0.92 percent, 0.81 reads; 16 bits, 0.05 percent, 0.04 reads.\n2. Memory is bits a name times the names in files: 10 bits for 20,000 names is 25 KB. Most of the gain comes by 8 to 10 bits.\n3. The filter never says no for a name that is there, so it cannot cause a duplicate. Its error is a wasted read.\n\nMany servers:\n1. Two servers can both check, and both see the name free. The database's unique key makes one insert fail; the server whose insert succeeds wins. Coding 8 chapter 4 shows that with four servers.\n2. Or send every name to one owner by hashing its key, so one process decides for that name.\n\nEdge cases: a crash between a flush and the table being cleared (a log written first); a name held and released twice; a hold's token is wrong; casefold changes the length of a string (ss); the key's bytes are longer than the record width.",
     "why": "The money line for disk: sign-ups are mostly free names, and a Bloom filter is exactly right for 'certainly not here'. It is wrong for a taken name, which needs the read anyway.",
     "say": "**First the key: normalise, casefold, refuse mixed alphabets. Then one lock, so check and add are one step. I show the race with the other request in the gap: both say yes.** Reserved words are stored as keys; a hold is a key with a token and an expiry. For disk: a memory table, sorted files, and a Bloom filter in front of each. Twenty thousand names in eight files cost 88 reads to say a name is free, and 0.8 with ten bits a name. The filter's price is a wasted read when it says maybe wrongly, about one in a hundred."
    },
    {
     "t": "p",
     "text": "**e) The code, for after you have talked it through.**"
    },
    {
     "t": "write",
     "id": "ra-un-code-w",
     "q": "Write register for the in-memory version first. Name the helpers.",
     "starter": "def register(self, name, account, now=0, token=None):\n    \"\"\"\n    Core logic:\n      1.\n    \"\"\"\n",
     "hint": "Key first, then the lock, then taken, reserved, held, then store.",
     "solution": "def register(self, name, account, now=0, token=None):\n    \"\"\"True if the name was free and is now yours.\"\"\"\n    key = normalise(name)                    # raises for a name that is not allowed\n    with self.lock:                          # check and add are ONE step\n        if key in self.reserved or key in self.owner:\n            return False\n        if self.held_by_other(key, token, now):\n            return False\n        self.owner[key] = account\n        return True\n\n# helpers, in the workbench below:\n#   normalise(name)                    one key for names that are the same\n#   held_by_other(key, token, now)     a live hold that is not yours (three lines inline in the workbench)\n",
     "why": "The order is cheap and certain checks first, inside the lock. The workbench has the hold check inline.",
     "say": "**Normalise first, then take the lock, then refuse if reserved, taken or held by someone else, then store.** The lock is the only reason it is safe with two sign-ups at once."
    },
    {
     "t": "predict",
     "id": "ra-names-pred",
     "code": "name = 'Stra\\u00dfe'\nprint(name.lower() == 'strasse', name.casefold() == 'strasse', len(name), len(name.casefold()))\n",
     "q": "Python's lower() and casefold() on 'Stra\\u00dfe' (the German sharp s). What does this print? (Python 3.12.)",
     "answer": "False True 6 7",
     "why": "lower() keeps the sharp s as one letter. casefold() turns it into two letters, 'ss', so the string gets longer. For names you compare, use casefold, and do not assume the length stays the same."
    },
    {
     "t": "problem",
     "id": "ra-names-p",
     "title": "Unique usernames in memory and on disk",
     "source": "Candidate reports of a Mercor unique-username prompt, rebuilt",
     "d": "medium",
     "minutes": 40,
     "why": "The key, the race, reserved names, and then the disk version with a Bloom filter and its price. Say it aloud first; open the solution to check it.",
     "statement": "Users register usernames, and no two users may have the same one.\n\nPart 1. Names are in memory. Write register(name, account) that returns True once for a name and False after, for two spellings of the same name and for two requests at once. Names like admin are not for anyone, and a name can be held for a few minutes while a person fills in a form.\n\nPart 2. The names no longer fit in memory. Keep them on disk and say how much a free name costs to check.",
     "examples": [
      {
       "input": "Alice, then ALICE",
       "output": "True, then False",
       "note": "One key: 'alice'."
      },
      {
       "input": "8 threads offering the same 2,000 names",
       "output": "2,000 registrations in total",
       "note": "One winner for each name."
      },
      {
       "input": "20,000 names in 8 files, 4,000 free names checked, 10 bits a name",
       "output": "0.81 disk reads a check against 88 with no filter",
       "note": "Printed by the tests below."
      }
     ],
     "constraints": [
      "standard library only",
      "names are 3 to 20 characters",
      "the disk files are written once and never changed"
     ],
     "starter": "class Names:\n    def register(self, name, account):\n        ...",
     "hints": [
      "Level 1: Alice and alice are the same user. What do you store?",
      "Level 2: two requests can both find the name free. What makes check and add one step?",
      "Level 3: on disk, most names asked about are free. What answers 'certainly not here' without a read?"
     ],
     "solution": "import hashlib\nimport os\nimport re\nimport threading\nimport unicodedata\n\n\ndef normalise(name):\n    \"\"\"The key two names must share to count as the same name. Raises ValueError for a name that is not allowed.\"\"\"\n    key = unicodedata.normalize(\"NFKC\", name).strip().casefold()   # fullwidth letters, ligatures; case; ss for the German sharp s\n    if not re.fullmatch(r\"[\\w.]{3,20}\", key):                       # letters, digits, underscore, dot; 3 to 20 characters\n        raise ValueError(\"not an allowed name: %r\" % name)\n    scripts = {unicodedata.name(ch).split()[0] for ch in key if ch.isalpha()}\n    if len(scripts) > 1:                                            # a Latin letter beside a Cyrillic look-alike\n        raise ValueError(\"mixes alphabets: %r\" % name)\n    return key\n\n\nclass Names:\n    \"\"\"Everything in memory. One lock makes 'is it free?' and 'take it' a single step.\"\"\"\n    def __init__(self, reserved=()):\n        self.lock = threading.Lock()\n        self.owner = {}                         # key -> account id\n        self.holds = {}                         # key -> (token, expires_at): kept for someone mid sign-up\n        self.reserved = {normalise(r) for r in reserved}    # words nobody may take: admin, support\n\n    def register(self, name, account, now=0, token=None):\n        key = normalise(name)                   # a bad name raises before anything is touched\n        with self.lock:\n            if key in self.reserved or key in self.owner:\n                return False\n            held = self.holds.get(key)\n            if held and held[1] > now and held[0] != token:\n                return False                    # someone else is holding it and the hold is still live\n            self.holds.pop(key, None)\n            self.owner[key] = account\n            return True\n\n    def hold(self, name, token, now, ttl):\n        \"\"\"Keep a name for token for ttl seconds, for the minutes a sign-up form takes.\"\"\"\n        key = normalise(name)\n        with self.lock:\n            held = self.holds.get(key)\n            if key in self.reserved or key in self.owner or (held and held[1] > now and held[0] != token):\n                return False\n            self.holds[key] = (token, now + ttl)\n            return True\n\n    def release(self, name):\n        \"\"\"The account is deleted. A cool-off before reuse is a policy choice: this frees it at once.\"\"\"\n        with self.lock:\n            self.owner.pop(normalise(name), None)\n\n\ndef naive_register(owner, key, account, pause):\n    \"\"\"The broken version: check, then add, as two steps. pause() is where the other request gets in.\"\"\"\n    if key in owner:\n        return False\n    pause()\n    owner[key] = account\n    return True\n\n\nWIDTH = 80                                      # bytes a record takes on disk, so record i starts at i * WIDTH\n\n\nclass SortedFile:\n    \"\"\"One immutable file of names in sorted order, searched by binary search with seek.\"\"\"\n    def __init__(self, path, keys):\n        self.path, self.count, self.reads = path, len(keys), 0\n        with open(path, \"wb\") as f:\n            for key in sorted(k.encode().ljust(WIDTH) for k in keys):\n                f.write(key)\n\n    def has(self, key):\n        want = key.encode().ljust(WIDTH)\n        lo, hi = 0, self.count - 1\n        with open(self.path, \"rb\") as f:\n            while lo <= hi:\n                mid = (lo + hi) // 2\n                f.seek(mid * WIDTH)\n                record = f.read(WIDTH)\n                self.reads += 1                 # one disk read\n                if record == want:\n                    return True\n                if record < want:\n                    lo = mid + 1\n                else:\n                    hi = mid - 1\n        return False\n\n\nclass Bloom:\n    \"\"\"A bit array. 'Not in' is certain; 'maybe in' is wrong a small fraction of the time (see Coding 9, chapter 6).\"\"\"\n    def __init__(self, n, bits_per_key):\n        self.m = max(8, n * bits_per_key)\n        self.k = max(1, round(bits_per_key * 0.693))\n        self.bits = bytearray((self.m + 7) // 8)\n\n    def _spots(self, key):\n        h = hashlib.blake2b(key.encode(), digest_size=16).digest()\n        a, b = int.from_bytes(h[:8], \"big\"), int.from_bytes(h[8:], \"big\") | 1\n        return [(a + i * b) % self.m for i in range(self.k)]\n\n    def add(self, key):\n        for s in self._spots(key):\n            self.bits[s // 8] |= 1 << (s % 8)\n\n    def __contains__(self, key):\n        return all(self.bits[s // 8] >> (s % 8) & 1 for s in self._spots(key))\n\n\nclass DiskNames:\n    \"\"\"Newest names in memory; older ones in sorted files, each with a Bloom filter in front.\"\"\"\n    def __init__(self, folder, flush_at=2500, bits_per_key=10, use_bloom=True):\n        self.folder, self.flush_at, self.bits, self.use_bloom = folder, flush_at, bits_per_key, use_bloom\n        self.lock = threading.Lock()\n        self.table = set()                      # the newest names, in memory\n        self.segments = []                      # (SortedFile, Bloom), oldest first\n        self.maybe_wrong = 0                    # the filter said maybe and the file said no\n\n    def exists(self, key):\n        if key in self.table:\n            return True\n        for seg, bloom in reversed(self.segments):          # newest file first\n            if self.use_bloom and key not in bloom:\n                continue                                    # certainly not in this file: no disk read\n            if seg.has(key):\n                return True\n            self.maybe_wrong += 1                           # a read that found nothing: the filter's price\n        return False\n\n    def register(self, name):\n        key = normalise(name)\n        with self.lock:\n            if self.exists(key):\n                return False\n            self.table.add(key)\n            if len(self.table) >= self.flush_at:\n                self.flush()\n            return True\n\n    def flush(self):\n        path = os.path.join(self.folder, \"seg%03d.bin\" % len(self.segments))\n        bloom = Bloom(len(self.table), self.bits)\n        for key in self.table:\n            bloom.add(key)\n        self.segments.append((SortedFile(path, self.table), bloom))\n        self.table = set()                      # a real service writes a log first, so a crash loses nothing\n\n    def reads(self):\n        return sum(seg.reads for seg, _ in self.segments)\n",
     "complexity": "Memory: O(1) a registration, memory about the number of names. Disk: a free name costs about (files times log2 of a file) reads with no filter; with a Bloom filter of b bits a name, about that times 0.6185 to the power b per file asked. Memory for filters: b bits a name.",
     "explain": [
      "normalise makes the key. NFKC folds look-alike forms of the same letter, casefold ignores case, and the check refuses a name with letters from two alphabets, since NFKC does not merge Cyrillic and Latin.",
      "Names is the in-memory registry. register is one step under the lock. hold keeps a name for a token until a time; release frees the name.",
      "naive_register is the broken version, with a pause between check and add so a test can put the other request in the gap.",
      "SortedFile writes fixed-width records in sorted order and finds a name by binary search with seek, counting reads.",
      "Bloom is the filter: 'certainly not' or 'maybe'. Coding 9 chapter 6 explains the sizing.",
      "DiskNames keeps a memory table and flushes it to a new file and filter when it is full. exists checks the table, then the files from newest to oldest, skipping a file the filter rules out.",
      "The printed output:\nAlice, ALICE, '  alice ' and fullwidth ALICE are all 'alice'; STRASSE and Strasse are 'strasse'\na name with a Cyrillic a among Latin letters is refused (4 of 4 bad names raised)\ncheck then add, with the other request in the gap: both said registered [True, True], owner is 'first'\nunder the lock, a second registration of 'Alice' says False\n8 threads offering the same 2000 names: 2000 registrations in total, 2000 rows\nreserved words refused; a held name is refused to others until the hold runs out (60 s hold, tried at 61 s)\nbits a name   disk reads to say 'free'   filter wrong, per file asked\n  no filter                    88.00   -\n          4                    13.01   0.1479\n          8                     2.08   0.0236\n         10                     0.81   0.0092\n         16                     0.04   0.0005"
     ],
     "tests": "import tempfile\n\n# 1. Two spellings, one name\nassert normalise(\"Alice\") == normalise(\"ALICE\") == normalise(\"  alice \") == \"alice\"\nassert normalise(\"\\uff21\\uff2c\\uff29\\uff23\\uff25\") == \"alice\"            # fullwidth letters\nassert normalise(\"Stra\\u00dfe\") == normalise(\"STRASSE\") == \"strasse\"     # German sharp s\nassert normalise(\"\\ufb01sh\") == \"fish\"                                    # the fi ligature\nrefused = 0\nfor bad in (\"al\", \"a\" * 21, \"a b c\", \"p\\u0430ypal\"):                      # too short, too long, space, Cyrillic a inside\n    try:\n        normalise(bad)\n        raise AssertionError(bad)\n    except ValueError:\n        refused += 1\nprint(\"Alice, ALICE, '  alice ' and fullwidth ALICE are all 'alice'; STRASSE and Strasse are 'strasse'\")\nprint(\"a name with a Cyrillic a among Latin letters is refused (%d of 4 bad names raised)\" % refused)\n\n# 2. The race, interleaved by hand\nowner = {}\nresults = []\nother = lambda: results.append(naive_register(owner, \"alice\", \"second\", lambda: None))\nresults.append(naive_register(owner, \"alice\", \"first\", other))             # the second request runs inside the pause\nassert results == [True, True] and owner[\"alice\"] == \"first\"\nprint(\"check then add, with the other request in the gap: both said registered %s, owner is %r\" % (results, owner[\"alice\"]))\n\nfixed = Names()\nassert fixed.register(\"alice\", \"first\") is True\nsecond = fixed.register(\"Alice\", \"second\")\nassert second is False\nprint(\"under the lock, a second registration of 'Alice' says %s\" % second)\n\n# 3. Eight threads, the same 2,000 names\nnames = Names()\nwins = [0] * 8\n\n\ndef go(i):\n    for j in range(2000):\n        if names.register(\"user_%04d\" % j, \"t%d\" % i):\n            wins[i] += 1\n\n\nthreads = [threading.Thread(target=go, args=(i,)) for i in range(8)]\n[t.start() for t in threads]\n[t.join() for t in threads]\nassert sum(wins) == 2000 == len(names.owner)\nprint(\"8 threads offering the same 2000 names: %d registrations in total, %d rows\" % (sum(wins), len(names.owner)))\n\n# 4. Reserved words and holds\nshop = Names(reserved=[\"Admin\", \"support\"])\nassert shop.register(\"ADMIN\", \"x\") is False and shop.register(\"support\", \"x\") is False\nassert shop.hold(\"maria\", \"form-1\", now=0, ttl=600) is True\nassert shop.register(\"maria\", \"someone-else\", now=10) is False             # held for form-1\nassert shop.hold(\"maria\", \"form-2\", now=10, ttl=600) is False\nassert shop.register(\"maria\", \"acct-1\", now=20, token=\"form-1\") is True     # the holder finishes\nshop.release(\"maria\")\nassert shop.hold(\"maria\", \"form-3\", now=0, ttl=60) and shop.register(\"maria\", \"acct-9\", now=61) is True   # hold ran out\nprint(\"reserved words refused; a held name is refused to others until the hold runs out (60 s hold, tried at 61 s)\")\n\n# 5. Disk: 20,000 names in 8 files, then 4,000 lookups of names nobody has\nwith tempfile.TemporaryDirectory() as folder:\n    rows = []\n    for bits in (0, 4, 8, 10, 16):\n        sub = os.path.join(folder, \"b%d\" % bits)\n        os.mkdir(sub)\n        db = DiskNames(sub, flush_at=2500, bits_per_key=max(bits, 1), use_bloom=bits > 0)\n        for i in range(20000):\n            assert db.register(\"user_%05d\" % i)\n        assert len(db.segments) == 8 and not db.table\n        assert db.register(\"user_00007\") is False and db.register(\"USER_19999\") is False     # taken names are found\n        before, wrong_before = db.reads(), db.maybe_wrong\n        for i in range(4000):\n            assert db.exists(\"fresh_%05d\" % i) is False\n        reads, wrong = db.reads() - before, db.maybe_wrong - wrong_before\n        rows.append((bits, reads / 4000, wrong / (4000 * 8)))\n    print(\"bits a name   disk reads to say 'free'   filter wrong, per file asked\")\n    for bits, reads, wrong in rows:\n        print(\"%11s   %22.2f   %s\" % (\"no filter\" if bits == 0 else bits, reads, \"-\" if bits == 0 else \"%.4f\" % wrong))\n    assert rows[0][1] > 80 and rows[3][1] < 1.5\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why casefold and not lower?",
       "a": "lower() is for display. casefold() is for comparison: it handles letters like the German sharp s, which becomes 'ss'. Alice and ALICE match with either; Strasse and Stra\u00dfe only with casefold."
      },
      {
       "q": "Why is NFKC not enough to stop look-alikes?",
       "a": "It merges forms of the same letter, like fullwidth A and plain A. A Cyrillic a is a different letter that happens to look like a Latin a, so it stays different. Refusing names that mix alphabets closes that gap. A full fix uses a table of confusable letters."
      },
      {
       "q": "Why one lock and not a check followed by an add?",
       "a": "Between the check and the add the other request can run. Both see the name free and both add it. The lock makes the two a single step."
      },
      {
       "q": "Why is the 'is it available?' check not enough?",
       "a": "It is true when asked and may be false a moment later. Only the registration, under the lock or the database's unique rule, decides. The check is a hint for the form."
      },
      {
       "q": "Why does a Bloom filter never cause a duplicate?",
       "a": "A name that was added has all of its bits set, so it is always reported as 'maybe'. The filter can only be wrong the other way, saying 'maybe' for a name that is not there, which costs a read."
      },
      {
       "q": "Why does the filter not help for a taken name?",
       "a": "It says 'maybe' for the file the name is in, and you must read that file to be sure. It saves the other files only."
      }
     ]
    },
    {
     "t": "faq",
     "title": "g) What the interviewer pushes on next",
     "items": [
      {
       "q": "Two servers register the same name at once.",
       "a": "The database's unique key is the last word: one insert fails. Or hash the key to one owner process. In-memory locks cover one process only. Coding 8 chapter 4 has the four-server test."
      },
      {
       "q": "A name is released. Can someone take it at once?",
       "a": "A policy. Impersonation is the risk: a user leaves and another takes the name. A cool-off of some days, or only the previous owner may take it back, are common answers."
      },
      {
       "q": "How do you reserve a name for someone mid sign-up?",
       "a": "A hold: key, token, expiry. Register works for the same token or after the hold ends. Old holds are removed when read, or by a sweep."
      },
      {
       "q": "A billion names.",
       "a": "Shard by a hash of the key, so one shard decides for one name. Each shard is the disk version here: memory table, sorted files, Bloom filters, plus a log written before the table. Merge old files in the background."
      },
      {
       "q": "The filter says maybe too often.",
       "a": "Add bits a name. My run: 4 bits a name was wrong 14.8 percent of the time per file; 10 bits 0.92 percent. Doubling the bits roughly squares the error rate down."
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
       "why": "Build the set yourself: buckets, a hash, collisions. It is the registry without the lock."
      },
      {
       "n": "Contains Duplicate III",
       "d": "hard",
       "lc": "contains-duplicate-iii",
       "yt": [
        "jRKEp4IYY3E",
        "Knowledge Center",
        13
       ],
       "why": "The harder follow-up: duplicates under a rule, with bounded memory."
      }
     ]
    }
   ]
  },
  {
   "id": "ra-paid",
   "title": "4. A paid comparator, planned from a target accuracy",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A hidden order, and a paid call before(a, b) that is right 90 percent of the time and costs one cent. The reported ask is to sort with it and give the algorithm, the accuracy and the cost. Coding 8 chapter 1 has the full treatment: counting calls, the sequential vote, spending votes unevenly across a bracket, and what to do when the same pair always gets the same answer. This chapter keeps one question: you are given an accuracy you must reach. How many votes, and what does it cost? The question assumes the errors are random: a second ask of the same pair can differ."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** The three questions that change the numbers."
    },
    {
     "t": "write",
     "id": "ra-pd-clarify-w",
     "q": "Write your questions, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Random or repeatable errors; what accurate means; what is paid; the size.",
     "solution": "1. Primary capabilities\n- Is the wrong answer random, a fresh coin each ask? Likely yes in this version. If the same pair always gets the same answer, voting does nothing, and Coding 8 chapter 1 says what to do instead.\n- What does accurate mean: the whole list exactly right, or the best one right? Likely open. It changes the votes a lot.\n- What chance of any mistake is allowed? Likely a number like 1 percent, which I call delta.\n\n2. Error handling\n- Is 90 percent the same for every pair? Likely yes. Near-equal items may be harder; I would say so.\n- Can a call fail or time out? Likely yes; retry without paying twice.\n\n3. Scope boundaries\n- How many items? Likely hundreds to thousands.\n- Is cost only in cents, or time too? Cents first.",
     "why": "'Accurate' picks the answer. The whole list right needs about n log n comparisons all correct. The best one right needs about log n.",
     "say": "**I ask whether the errors are random, what accurate means, and how much risk of a mistake is allowed.** Random errors are the case where voting helps. The meaning of accurate sets how many comparisons must all be right."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Short."
    },
    {
     "t": "write",
     "id": "ra-pd-reqs-w",
     "q": "Write the requirements, numbered, each one testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "The exact chance of a wrong majority, the plan, the check by simulation, the cost.",
     "solution": "1. p_wrong_majority(p, m) is the exact chance that a majority of m asks is wrong. Test: 0.1 for 1 ask, 0.028 for 3.\n2. votes_needed(p, err) returns the smallest odd m that gets that chance down to err.\n3. plan_sort(n, p, delta) and plan_best(n, p, delta) return the votes and the cents so that the whole list, or the best one, is right with chance at least 1 minus delta. Test: the printed table.\n4. The plan is checked by running it. Test: for 64 items and delta 0.05, at least 95 percent of 1,000 runs are exactly sorted, and the average cost is within the plan.\n5. Out of scope: the sequential vote and uneven votes (Coding 8 chapter 1), and repeatable errors.",
     "why": "Requirement 4 is the one that matters: a formula for accuracy that is not checked by running it is a guess.",
     "say": "**Four requirements: the exact wrong-majority chance, the smallest number of votes for a target, the two plans, and a simulation that checks the plan holds.**"
    },
    {
     "t": "p",
     "text": "**c) Entities.** Three, no more: the paid API (a counter and a coin), the comparison that votes, and the two sorts that use it. A vote and a round are loops, not classes. Keep the API and the voting comparison; the sorts are functions."
    },
    {
     "t": "p",
     "text": "**d) Core logic in English, with numbers.**"
    },
    {
     "t": "write",
     "id": "ra-pd-logic-w",
     "q": "Write how to get from a target accuracy to votes and cents, for the whole list and for the best one. Put numbers on each.",
     "starter": "One comparison, m votes:\nWhole list right:\nBest one right:\nCost:\nWhy it is cheap:\nWhat it assumes:",
     "hint": "A majority of m independent asks is wrong when at most half are right. Use a union bound over the comparisons that must all be right.",
     "solution": "One comparison, m votes (m odd, so no ties):\n1. The majority is wrong when at most m // 2 of the m asks are right. That is a sum of binomial terms, exact.\n2. m = 1: 0.1. m = 3: 0.028. m = 5: 0.0086. Each extra pair of votes multiplies the error by about 0.3.\n\nWhole list right:\n1. Merge sort makes at most n * ceil(log2 n) comparisons. All of them must be right for the list to be exactly sorted.\n2. If each is wrong with chance at most delta / c (c the most comparisons), the chance that any is wrong is at most delta (a union bound).\n3. So find the smallest m with error at most delta / c. Cost is c * m cents.\n4. n = 256, delta = 0.01: 19 votes, 38,912 cents. n = 1,000: 23 votes, 230,000 cents.\n\nBest one right:\n1. In a knockout bracket only the best item's own matches matter: ceil(log2 n) of them. Other matches change who it meets, not whether it wins.\n2. Each of those must be right: error at most delta / ceil(log2 n). The bracket plays n - 1 matches, all with the same m.\n3. n = 256, delta = 0.01: 9 votes, 2,295 cents. n = 1,000: 9 votes, 8,991 cents. About 26 times cheaper than the whole list.\n\nCost:\n1. Whole list: about n log n * m. The votes grow like the log of n log n over delta, so the cost is n log n times a log factor. 100,000 items: 33 votes, 56 million cents.\n2. Best one: (n - 1) * m, and m grows like the log of log n over delta. 100,000 items: 11 votes, about 1.1 million cents.\n\nWhy it is cheap enough to say aloud: the error falls off exponentially in the votes and the cost rises only linearly, so the votes stay small even for large n.\n\nWhat it assumes:\n1. Independent asks. A second ask must be able to differ from the first. If the same pair always gets the same answer, the formula is wrong and the votes do nothing.\n2. A fixed 90 percent for every pair. Close pairs may be worse. Measure on pairs with a known order.\n3. The union bound is a guarantee, not a prediction. The real chance of an exactly sorted result is higher: 971 in 1,000 for a plan aimed at 950.\n\nEdge cases: an even number of votes (a tie; take an odd number); p at or below 0.5 (more votes do not help); n = 1 (zero comparisons); an odd item in a bracket (a bye).",
     "why": "The two plans differ only in how many comparisons must all be right: about n log n for the list, about log n for the best. That is why the best one is 26 times cheaper.",
     "say": "**For one comparison, a majority of m votes is wrong with an exact binomial chance. For the whole list I need about n log n comparisons all right, so each can be wrong with chance delta over n log n; the votes come out of that.** For a thousand items and one percent risk that is 23 votes and 230,000 cents. For only the best one, the bracket plays about log n matches that matter, so 9 votes and about 9,000 cents. It assumes the errors are random; if the same pair always gets the same answer, voting does nothing."
    },
    {
     "t": "p",
     "text": "**e) The code, for after.** The planners are three lines each; the workbench has the voting comparison and a simulation to check them."
    },
    {
     "t": "problem",
     "id": "ra-paid-p",
     "title": "Votes and cents for a target accuracy",
     "source": "Candidate reports of a paid-comparator prompt (right 90 percent of the time), rebuilt; see Coding 8 chapter 1 for the full treatment",
     "d": "medium",
     "minutes": 25,
     "why": "Going from a target accuracy to a number of votes and a cost, and checking the plan by running it. Say it aloud first; open the solution to check it.",
     "statement": "A paid call before(a, b) says whether a ranks ahead of b. It is right with probability 0.9 each time, independently, and costs one cent.\n\nFor n items, how many times should each comparison be asked so that the whole list comes out exactly sorted with probability at least 1 - delta, and what does it cost? Then the same question for finding only the best one.",
     "examples": [
      {
       "input": "n = 1,000, p = 0.9, delta = 0.01",
       "output": "whole list: 23 votes, 230,000 cents; best one: 9 votes, 8,991 cents",
       "note": "Printed by the tests below."
      },
      {
       "input": "64 items, delta = 0.05, 1,000 runs",
       "output": "13 votes; 971 runs exactly sorted; 3,961 cents a run",
       "note": "With 1 vote, 0 of 1,000 runs were exactly sorted."
      },
      {
       "input": "best of 256, delta = 0.05, 1,000 runs",
       "output": "7 votes; 977 runs found it; 1,785 cents a run",
       "note": "The plan's guarantee is 950."
      }
     ],
     "constraints": [
      "standard library only",
      "errors are independent between asks",
      "votes are odd"
     ],
     "starter": "def plan_sort(n, p, delta):\n    ...",
     "hints": [
      "Level 1: a majority of m asks is wrong when at most half are right. Write the chance.",
      "Level 2: how many comparisons must all be right for the whole list to be sorted?",
      "Level 3: for the best one in a bracket, which matches matter?"
     ],
     "solution": "import random\nfrom math import ceil, comb, log2\n\n\ndef p_wrong_majority(p, m):\n    \"\"\"Chance that a majority of m independent asks is wrong, when each ask is right with chance p.\n    m is odd. The majority is wrong when at most m // 2 asks are right.\"\"\"\n    q = 1 - p\n    return sum(comb(m, right) * p ** right * q ** (m - right) for right in range(m // 2 + 1))\n\n\ndef votes_needed(p, err):\n    \"\"\"The smallest odd number of asks whose majority is wrong with chance at most err.\"\"\"\n    m = 1\n    while p_wrong_majority(p, m) > err:\n        m += 2\n    return m\n\n\ndef plan_sort(n, p, delta):\n    \"\"\"Votes and cents so that the WHOLE sorted list is right with chance at least 1 - delta.\n    Merge sort makes at most c = n * ceil(log2 n) comparisons. If each is wrong with chance\n    at most delta / c, the chance that any one is wrong is at most delta (a union bound).\"\"\"\n    c = n * ceil(log2(n))\n    m = votes_needed(p, delta / c)\n    return m, c * m\n\n\ndef plan_best(n, p, delta):\n    \"\"\"Votes and cents so that the best one is found with chance at least 1 - delta.\n    Only the best item's own matches matter: it plays ceil(log2 n) of them in a bracket.\"\"\"\n    matches = ceil(log2(n))\n    m = votes_needed(p, delta / matches)\n    return m, (n - 1) * m\n\n\nclass PaidApi:\n    \"\"\"before(a, b): is a ahead of b? Right with chance p, a fresh coin each ask. One cent an ask.\"\"\"\n    def __init__(self, p=0.9, seed=0):\n        self.p, self.rng, self.cents = p, random.Random(seed), 0\n\n    def before(self, a, b):\n        self.cents += 1\n        truth = a < b                          # the hidden order is the plain order of the numbers\n        return truth if self.rng.random() < self.p else not truth\n\n\ndef make_less(api, m):\n    \"\"\"A comparison that asks m times (m odd) and goes with the majority.\"\"\"\n    def less(a, b):\n        yes = 0\n        for _ in range(m):\n            if api.before(a, b):\n                yes += 1\n        return yes * 2 > m\n    return less\n\n\ndef merge_sort(items, less):\n    if len(items) <= 1:\n        return list(items)\n    mid = len(items) // 2\n    left, right = merge_sort(items[:mid], less), merge_sort(items[mid:], less)\n    out, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if less(right[j], left[i]):\n            out.append(right[j])\n            j += 1\n        else:\n            out.append(left[i])\n            i += 1\n    return out + left[i:] + right[j:]\n\n\ndef bracket_best(items, less):\n    \"\"\"Knockout: pair up, the one that is ahead goes through, until one is left.\"\"\"\n    alive = list(items)\n    while len(alive) > 1:\n        nxt = []\n        for i in range(0, len(alive) - 1, 2):\n            a, b = alive[i], alive[i + 1]\n            nxt.append(a if less(a, b) else b)\n        if len(alive) % 2:\n            nxt.append(alive[-1])              # an odd one out gets a bye\n        alive = nxt\n    return alive[0]\n",
     "complexity": "p_wrong_majority is O(m). votes_needed tries odd m up to the answer. Whole list: about n log2 n * m cents, with m of the order of log(n log n / delta). Best one: (n - 1) * m cents, with m of the order of log(log n / delta).",
     "explain": [
      "p_wrong_majority is the exact binomial sum. It does not use an approximation.",
      "votes_needed raises m by 2 until the chance is low enough.",
      "plan_sort divides the allowed risk over the c = n * ceil(log2 n) comparisons that merge sort can make. plan_best divides it over the ceil(log2 n) matches that the best item plays.",
      "PaidApi is a fresh coin each ask, and counts cents. make_less asks m times and goes with the majority.",
      "The simulation runs merge sort and the bracket with the planned votes, and counts how often the result is exactly right, and the cents spent.",
      "The printed output:\nplanner, p = 0.9, 1 cent an ask, delta = 0.01 (chance of any mistake)\n     n  whole list sorted       best one found        \n    16  13 votes,       832 cents   9 votes,       135 cents\n   256  19 votes,     38912 cents   9 votes,      2295 cents\n  1000  23 votes,    230000 cents   9 votes,      8991 cents\n100000  33 votes,  56100000 cents  11 votes,   1099989 cents\nsort 64 items, plan says 13 votes: 971 of 1000 runs exactly sorted, 3961 cents a run (planned at most 4992)\nthe same sort with 1 vote: 0 of 1000 runs exactly sorted\nbest of 256, plan says 7 votes: 977 of 1000 runs found it, 1785 cents a run (planned 1785)"
     ],
     "tests": "assert abs(p_wrong_majority(0.9, 1) - 0.1) < 1e-12\nassert abs(p_wrong_majority(0.9, 3) - 0.028) < 1e-12              # 3 * 0.9^... : two or more of three wrong\nassert votes_needed(0.9, 0.1) == 1 and votes_needed(0.9, 0.03) == 3\n\nprint(\"planner, p = 0.9, 1 cent an ask, delta = 0.01 (chance of any mistake)\")\nprint(\"%6s  %-22s  %-22s\" % (\"n\", \"whole list sorted\", \"best one found\"))\nfor n in (16, 256, 1000, 100000):\n    ms, cs = plan_sort(n, 0.9, 0.01)\n    mb, cb = plan_best(n, 0.9, 0.01)\n    print(\"%6d  %2d votes, %9d cents  %2d votes, %9d cents\" % (n, ms, cs, mb, cb))\nassert plan_sort(1000, 0.9, 0.01)[1] > 10 * plan_best(1000, 0.9, 0.01)[1]\n\n# does the plan hold up? Run it many times and count how often the result is exactly right\nruns = 1000\nn, delta = 64, 0.05\nm_sort, planned = plan_sort(n, 0.9, delta)\ndata_rng = random.Random(1)\nexact, spent = 0, 0\nfor r in range(runs):\n    items = data_rng.sample(range(10 * n), n)\n    api = PaidApi(0.9, seed=r)\n    if merge_sort(items, make_less(api, m_sort)) == sorted(items):\n        exact += 1\n    spent += api.cents\nprint(\"sort %d items, plan says %d votes: %d of %d runs exactly sorted, %.0f cents a run (planned at most %d)\" % (\n    n, m_sort, exact, runs, spent / runs, planned))\nassert exact / runs >= 1 - delta and spent / runs <= planned\n\none_vote = sum(\n    merge_sort(items, make_less(PaidApi(0.9, seed=r), 1)) == sorted(items)\n    for r, items in enumerate(data_rng.sample(range(10 * n), n) for _ in range(runs)))\nprint(\"the same sort with 1 vote: %d of %d runs exactly sorted\" % (one_vote, runs))\n\nn, delta = 256, 0.05\nm_best, planned = plan_best(n, 0.9, delta)\nfound, spent = 0, 0\nfor r in range(runs):\n    items = data_rng.sample(range(10 * n), n)\n    api = PaidApi(0.9, seed=r)\n    if bracket_best(items, make_less(api, m_best)) == min(items):\n        found += 1\n    spent += api.cents\nprint(\"best of %d, plan says %d votes: %d of %d runs found it, %.0f cents a run (planned %d)\" % (\n    n, m_best, found, runs, spent / runs, planned))\nassert found / runs >= 1 - delta and spent / runs <= planned\n"
    },
    {
     "t": "faq",
     "title": "f) Review: the line-by-line questions",
     "items": [
      {
       "q": "Why an odd number of votes?",
       "a": "No ties. With an even number you need a rule for a split, and the extra vote buys almost nothing."
      },
      {
       "q": "Why divide delta by the number of comparisons?",
       "a": "The list is right only if every comparison used is right. If each is wrong with chance at most delta over c, the chance that some comparison is wrong is at most c times that, which is delta. That is the union bound."
      },
      {
       "q": "Why is the measured accuracy above the plan's?",
       "a": "The union bound counts the chance that any one of the comparisons is wrong, and allows for all of them to be wrong together. Real runs make fewer than the maximum comparisons, and some wrong answers do not change the order. The plan is safe and a little wasteful."
      },
      {
       "q": "Why is the best one so much cheaper?",
       "a": "Only the matches the best item plays can cost you it. That is about log n matches, not n log n comparisons."
      }
     ]
    },
    {
     "t": "faq",
     "title": "g) What the interviewer pushes on next",
     "items": [
      {
       "q": "Can you do better than a fixed number of votes?",
       "a": "Yes: ask until one answer leads by 3, and stop early on easy pairs. In Coding 8 chapter 1: 4,859 cents for 68 pairs out of order against 6,464 cents for 282 with five fixed votes."
      },
      {
       "q": "What if the same pair always gets the same answer?",
       "a": "Voting does nothing; the formula does not apply. Compare each item with many different others and rank by wins. Coding 8 chapter 1 has the numbers."
      },
      {
       "q": "What if the comparator is not 90 percent for every pair?",
       "a": "Near-equal items are likely worse. Measure the accuracy on pairs with a known order, by gap, and plan with the worst gap you care about."
      }
     ]
    }
   ]
  }
 ]
});
