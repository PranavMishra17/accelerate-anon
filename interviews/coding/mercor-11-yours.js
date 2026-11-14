/* Your Muse write-ups for Mercor Q1, Q2, Q4, Q5 and Q8. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-yours",
 "n": 11,
 "flow": true,
 "title": "Your worked solutions (from your Muse notes)",
 "minutes": 150,
 "lead": "After this part you have your own worked version of the problems you solved with Muse: Q1 referral network, Q2 exchange rate, Q4 faulty comparator, Q5 Lost Tree and Q8 RandomizedSet. Each has a box to try first, your thinking and what to say behind a click, and the code with its real output. Q3, Q6 and Q7 were never written up.",
 "sections": [
  {
   "id": "yours-intro",
   "title": "0. What this part is",
   "blocks": [
    {
     "t": "p",
     "text": "**One home for these problems.** These are your own write-ups from the Muse sessions, kept close to your words: the problem, your thinking, what to say in the round, the cases, the formal solution, the cost and the code. Each question has a box to try first, a shut set of notes, and the code with its real output."
    },
    {
     "t": "p",
     "text": "**Q3, Q6 and Q7 were never written up,** so they are not here. The sections below are Q1 referral network, Q2 exchange rate, Q4 faulty comparator, Q5 Lost Tree and Q8 RandomizedSet, in the order of the log."
    },
    {
     "t": "p",
     "text": "**Where the other parts overlap.** Coding 7 section 2 (referral network) and Coding 8 sections 1 (faulty comparator) and 2 (exchange rates) keep their answer boxes and their other material, and each now links to your section here for the worked version."
    }
   ]
  },
  {
   "id": "yours-q1",
   "title": "1. Q1 Referral network",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** You get experts (id, name, skills) and referrals (from_id, to_id: from vouches for to). Build the graph, find the shortest referral path between two people, rank everyone reachable within some hops by skill match, then pick the top-k referrers by reach and k influencers. 60 minutes, alone, nothing to ask. Reported variants: add referrals one at a time (no self-referral, one referrer each, no cycle), growth simulation in days, minimum bonus by binary search, flow centrality. This prompt is reconstructed from reports, not Mercor's own."
    },
    {
     "t": "list",
     "items": [
      "**Read it before you speak.**",
      "**It is a directed graph, and every question starts from one person.** One BFS from a start gives hops and a parent for everyone reachable. Path, ranking and reach all read from that one result.",
      "**The data is messy:** duplicates, self-loops, ids not in experts. Cycles are possible, so every traversal carries a visited set.",
      "**Five words are undefined:** reach, the top-k tie rule, influencer, flow centrality, and the score. Nobody answers, so each gets one line at the top of the file.",
      "**Size decides top-k.** A BFS per person is O(V x (V + E)): fine for thousands, slow for millions. Say it before the reviewer does.",
      "**The trap:** other reports say one referrer and no cycles. Then it is a forest, reach is a subtree size, and top-k is one pass. Write which one you assumed."
     ]
    },
    {
     "t": "table",
     "head": [
      "The gap in the prompt",
      "I decide, and write at the top",
      "If the reviewer wanted otherwise"
     ],
     "rows": [
      [
       "Are edges one way, and can a person have several referrers?",
       "One way. Several referrers and cycles allowed; a visited set keeps BFS safe.",
       "Strict version: add_referral rejects self, a second referrer and a cycle. See the block below."
      ],
      [
       "Bad rows: duplicates, self-loops, unknown ids",
       "Drop them, count them, return the count with the graph.",
       "Raise on the first, or log each with its reason."
      ],
      [
       "Which shortest path when there are several?",
       "The first one found under sorted neighbour order.",
       "Return all: keep a list of parents per node."
      ],
      [
       "What counts as reach?",
       "Everyone under you at any depth, not counting you.",
       "Direct referrals only: len(graph[p]). Or count closer people more."
      ],
      [
       "Top-k ties, and k larger than the people",
       "Reach descending, then id. Return fewer if there are fewer.",
       "A real signal as the tie-break, such as seniority."
      ],
      [
       "The score, and experts with no matching skill",
       "2 x matches - hops. Keep no-match experts, they come last.",
       "Drop them, or weigh hops more. It is a product call."
      ],
      [
       "What is an influencer?",
       "Greedy unique reach: each pick adds the most people not yet covered, stop when nobody adds any.",
       "Top k by reach. Worse, two big groups can overlap."
      ],
      [
       "What is flow centrality?",
       "For each pair, the people strictly inside the one shortest path BFS finds.",
       "All shortest paths share credit (Brandes), or direction ignored (betweenness)."
      ],
      [
       "max_hops = 0, unknown start",
       "Return [].",
       "Raise a clear error."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** BFS reaches a node by the fewest hops the first time it sees it, so one BFS gives the shortest path, the hop counts for ranking and the reach, all at O(V + E). Everything else is a read-out of that. The one extra idea is influencers: picking the best k exactly is maximum coverage, which is hard, and greedy is the standard answer with a proof that it covers at least 63 percent (1 - 1/e) of the best possible."
    },
    {
     "t": "list",
     "items": [
      "**The hour, in order.**",
      "**5 minutes:** read all five parts. List every undefined word.",
      "**5 minutes:** write the decisions from the table as a comment at the top. Then stick to them.",
      "**Data model:** dict of id to sorted neighbour list. build_graph returns the graph and the dropped count. Run it on the sample and print it.",
      "**Parts 1 and 2:** bfs_parents, then shortest_path as a walk back. Run main. Check an unreachable target and start equal to target.",
      "**Part 3:** the scorer, then rank_candidates reading the hops. Check one case by hand.",
      "**Parts 4 and 5:** reach, top_k_referrers, influencers. Flow centrality only if there is time.",
      "**Last 10 minutes:** asserts for the edge cases, main prints everything, and a comment listing what you would change first."
     ]
    },
    {
     "t": "write",
     "id": "mercor-yours-q1-w",
     "q": "Try it first. Write the graph, the path and the ranking, and why BFS and shortest path are two functions.",
     "starter": "Graph:\n\nBFS gives:\n\nPath:\n\nRanking:\n\nCost:\n",
     "hint": "One BFS gives parent and distance for every reachable node. The path walks the parents back. The ranking reads the distances.",
     "solution": "1. build_graph: dict of id to sorted neighbour list, built with sets so duplicates collapse. Drop self-loops and unknown ids, and count them.\n2. bfs_parents: one BFS, parent and hops for every reachable node. The visited set stops cycles.\n3. shortest_path: walk the parent chain from the target back to the start, reverse it. No second traversal.\n4. rank_candidates: read the hops from the same BFS. Score = 2 x matches - hops. Sort by score desc, hops asc, id asc.\nCost: build O(E), BFS O(V + E), ranking adds O(R log R).",
     "say": [
      "**I built the graph as a dict of sorted neighbour lists, so duplicates collapse and the order is the same every run.** One BFS gives parent and distance; the path is a walk back through the parents and the ranking reads the same distances.",
      "Where the prompt left a word undefined I wrote my decision at the top of the file and coded to it. The two places I would look first are the score weights and top-k, which runs a BFS per person."
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q1-p",
     "title": "Referral network, your code: parts 1 to 5 and the flow follow-up",
     "source": "Your Q1 write-up (Muse), run with Python 3.12",
     "d": "medium",
     "minutes": 60,
     "why": "Your own code from the Q1 write-up, cut to the core functions. Open it after the box above.",
     "statement": "Build build_graph, bfs_parents, shortest_path, a scorer class, rank_candidates, then top_k_referrers, influencers and the flow centrality follow-up, for the experts and referrals in the tests box, and run main().",
     "examples": [
      {
       "input": "path from e1 to e6",
       "output": "['e1', 'e2', 'e6']",
       "note": "e5 is unreachable from e1, so its path is []."
      }
     ],
     "constraints": [
      "standard library only",
      "deterministic neighbor order",
      "no stubbing"
     ],
     "starter": "def build_graph(experts, referrals):\n    ...\n",
     "hints": [
      "Build with sets, then sort each neighbor list. BFS records parent and dist; the path is a walk back through parent."
     ],
     "solution": "from collections import deque\n\n\ndef build_graph(experts, referrals):\n    # graph is a dict: expert_id -> set of neighbor ids.\n    # A set is used while building so duplicate edges collapse for free.\n    graph = {eid: set() for eid in experts}\n    dropped = 0\n    for src, dst in referrals:\n        if src == dst:  # self-loop: drop\n            dropped += 1\n            continue\n        if src not in experts or dst not in experts:\n            dropped += 1  # unknown id: drop\n            continue\n        graph[src].add(dst)  # duplicate adds are no-ops\n    # Convert sets to sorted lists: deterministic neighbor order,\n    # so BFS results are reproducible run after run.\n    return {eid: sorted(n) for eid, n in graph.items()}, dropped\n\n\ndef bfs_parents(graph, start_id):\n    # BFS explores in increasing hop order, so the first time\n    # we reach a node we used the fewest possible hops.\n    # parent[child] = the node we came from. Walking parent\n    # links back to start_id rebuilds the path.\n    queue = deque([start_id])\n    visited = {start_id}  # visited stops cycles looping forever\n    parent = {start_id: None}\n    dist = {start_id: 0}\n    while queue:\n        node = queue.popleft()\n        for nbr in graph.get(node, []):\n            if nbr not in visited:\n                visited.add(nbr)\n                parent[nbr] = node\n                dist[nbr] = dist[node] + 1\n                queue.append(nbr)\n    return parent, dist\n\n\ndef shortest_path(graph, start_id, target_id):\n    # This does NOT traverse again. It reuses bfs_parents,\n    # then walks the parent chain from target back to start.\n    if start_id not in graph or target_id not in graph:\n        return []\n    if start_id == target_id:\n        return [start_id]\n    parent, _dist = bfs_parents(graph, start_id)\n    if target_id not in parent:\n        return []\n    path = []\n    node = target_id\n    while node is not None:\n        path.append(node)\n        node = parent[node]\n    path.reverse()\n    return path\n\n\nclass SimpleScorer:\n    # The scoring policy, abstracted into its own class, the\n    # same move as abstracting a cache eviction policy behind\n    # an interface. rank_candidates only calls .score(...);\n    # it never knows the formula.\n    def score(self, expert, hops, required_skills):\n        have = set(expert[\"skills\"])\n        matches = len(have & set(required_skills))\n        return 2 * matches - hops\n\n\ndef rank_candidates(graph, experts, start_id, required_skills,\n                    max_hops, scorer=None):\n    if max_hops == 0 or start_id not in graph:\n        return []\n    scorer = scorer or SimpleScorer()\n    _parent, dist = bfs_parents(graph, start_id)\n    ranked = []\n    for eid, hops in dist.items():\n        if eid == start_id or hops > max_hops:\n            continue  # no-match experts still appear; see loop\n        s = scorer.score(experts[eid], hops, required_skills)\n        ranked.append((eid, hops, s))\n    # score desc, then hops asc, then id asc: a total order\n    ranked.sort(key=lambda row: (-row[2], row[1], row[0]))\n    return ranked\n\n# ---- Part 4 and 5: top-k referrers and influencers ----\n# Decided and written down (solo round, nobody to ask):\n# - reach = how many people sit under a person, at any depth (BFS, self not counted)\n# - top-k ties break by id, so the answer is the same every run\n# - influencers = greedy unique reach: each pick adds the most people not yet covered,\n#   counting the pick themselves\n\n\ndef reach(graph, start_id):\n    _parent, dist = bfs_parents(graph, start_id)\n    return len(dist) - 1  # dist includes start_id itself\n\n\ndef top_k_referrers(graph, k):\n    rows = [(eid, reach(graph, eid)) for eid in graph]\n    rows.sort(key=lambda row: (-row[1], row[0]))  # reach desc, id asc\n    return rows[:k]\n\n\ndef influencers(graph, k):\n    # who each person reaches, computed once\n    under = {}\n    for eid in graph:\n        _parent, dist = bfs_parents(graph, eid)\n        under[eid] = set(dist)  # includes eid: a pick covers themselves\n    covered, picked = set(), []\n    for _ in range(k):\n        best, best_gain = None, 0\n        for eid in sorted(graph):  # sorted: ties go to the smaller id\n            if eid in covered:\n                continue\n            gain = len(under[eid] - covered)\n            if gain > best_gain:\n                best, best_gain = eid, gain\n        if best is None:\n            break  # nobody adds anyone new\n        picked.append((best, best_gain))\n        covered |= under[best]\n    return picked\n\n\n# ---- Follow-up: flow centrality ----\n# Decided: count, for every pair (s, t), the people strictly between them on the\n# one shortest path BFS finds. Not every shortest path, which is heavier to count.\ndef flow_centrality(graph):\n    count = {eid: 0 for eid in graph}\n    for s in graph:\n        parent, dist = bfs_parents(graph, s)\n        for t in dist:\n            if t == s:\n                continue\n            node = parent[t]\n            while node != s:  # walk back, counting the middle people\n                count[node] += 1\n                node = parent[node]\n    return sorted(count.items(), key=lambda row: (-row[1], row[0]))",
     "complexity": "Build O(E). One BFS O(V + E). Ranking adds O(R log R). Top-k and influencers run a BFS from every person: O(V(V + E)), plus O(k V^2) set work for the greedy picks. Flow centrality is O(V(V + E)) plus the walk-backs.",
     "explain": [
      "The only import is deque from collections, a queue with fast pops from the left. No third-party libraries are needed anywhere.",
      "BFS is the only function that touches the queue. Everything else reads the two maps it returns.",
      "Dropped = 2 counts the self-loop (e5, e5) and the unknown-id edge (e1, e9). The duplicate (e1, e2) collapses silently in the set. e5 is unreachable from e1, so the path is [] and it never appears in the ranking."
     ],
     "tests": "experts = {\n    \"e1\": {\"name\": \"Ana\", \"skills\": [\"python\", \"evals\"]},\n    \"e2\": {\"name\": \"Ben\", \"skills\": [\"python\"]},\n    \"e3\": {\"name\": \"Cid\", \"skills\": [\"evals\", \"rust\"]},\n    \"e4\": {\"name\": \"Dee\", \"skills\": [\"python\", \"evals\", \"rust\"]},\n    \"e5\": {\"name\": \"Eli\", \"skills\": [\"go\"]},\n    \"e6\": {\"name\": \"Fay\", \"skills\": [\"evals\"]},\n}\nreferrals = [\n    (\"e1\", \"e2\"), (\"e1\", \"e2\"), (\"e2\", \"e3\"), (\"e3\", \"e2\"),\n    (\"e3\", \"e4\"), (\"e4\", \"e6\"), (\"e2\", \"e6\"), (\"e5\", \"e5\"),\n    (\"e1\", \"e9\"), (\"e5\", \"e4\"),\n]\n\n\ndef main():\n    graph, dropped = build_graph(experts, referrals)\n    print(\"graph:\", graph)\n    print(\"dropped edges:\", dropped)\n    print(\"path e1->e6:\", shortest_path(graph, \"e1\", \"e6\"))\n    print(\"path e1->e1:\", shortest_path(graph, \"e1\", \"e1\"))\n    print(\"path e1->e5:\", shortest_path(graph, \"e1\", \"e5\"))\n    ranked = rank_candidates(graph, experts, \"e1\",\n                             [\"python\", \"evals\"], max_hops=3)\n    print(\"ranked from e1 for ['python', 'evals'] \"\n          \"within 3 hops:\")\n    for eid, hops, s in ranked:\n        print(f\"  {eid} hops={hops} score={s}\")\n    print(\"top 3 referrers by reach:\", top_k_referrers(graph, 3))\n    print(\"influencers, k=2:\", influencers(graph, 2))\n    print(\"flow centrality:\", flow_centrality(graph))\n\n\nif __name__ == \"__main__\":\n    main()"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "graph: {'e1': ['e2'], 'e2': ['e3', 'e6'], 'e3': ['e2', 'e4'], 'e4': ['e6'], 'e5': ['e4'], 'e6': []}\ndropped edges: 2\npath e1->e6: ['e1', 'e2', 'e6']\npath e1->e1: ['e1']\npath e1->e5: []\nranked from e1 for ['python', 'evals'] within 3 hops:\n  e2 hops=1 score=1\n  e4 hops=3 score=1\n  e3 hops=2 score=0\n  e6 hops=2 score=0\ntop 3 referrers by reach: [('e1', 4), ('e2', 3), ('e3', 3)]\ninfluencers, k=2: [('e1', 5), ('e5', 1)]\nflow centrality: [('e2', 4), ('e3', 2), ('e4', 1), ('e1', 0), ('e5', 0), ('e6', 0)]"
    },
    {
     "t": "code",
     "title": "If the rule is one referrer and no cycles: the check on add, and union-find",
     "code": "def add_referral(referrer_of, a, b):\n    # a vouches for b. The strict version: one referrer each, no self, no cycle.\n    if a == b:\n        return \"self\"\n    if b in referrer_of:\n        return \"second_referrer\"\n    cur = a\n    while cur is not None:  # walk up from a; meeting b would make b its own ancestor\n        if cur == b:\n            return \"cycle\"\n        cur = referrer_of.get(cur)\n    referrer_of[b] = a\n    return \"ok\"\n\n\ndef find(up, x):  # union-find: the loop check in near O(1)\n    up.setdefault(x, x)\n    while up[x] != x:\n        up[x] = up[up[x]]\n        x = up[x]\n    return x\n\n\n# b has no referrer yet, so b is the root of its own tree.\n# The edge a -> b closes a loop exactly when a is already in that tree:\n#   closes_loop = find(up, a) == find(up, b)\n# After accepting it: up[find(up, b)] = find(up, a)\n\nr = {}\nassert [add_referral(r, \"a\", \"b\"), add_referral(r, \"b\", \"c\"), add_referral(r, \"c\", \"a\"),\n        add_referral(r, \"x\", \"b\"), add_referral(r, \"z\", \"z\")] == [\"ok\", \"ok\", \"cycle\", \"second_referrer\", \"self\"]\nup = {}\nassert find(up, \"a\") != find(up, \"b\")\nup[find(up, \"b\")] = find(up, \"a\")\nassert find(up, \"a\") == find(up, \"b\")\nprint(\"add_referral and union-find ok\")"
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
       "Each person has one referrer and no cycles",
       "add_referral walks up from the referrer and refuses if it meets the new person. Block above.",
       "O(depth) per add. Union-find: near O(1)."
      ],
      [
       "It is a forest: faster top-k",
       "Reach is the subtree size. One post-order pass fills it for everyone.",
       "O(V + E) instead of V BFS runs. Heap of size k: heapq.nlargest."
      ],
      [
       "Cycles are allowed: still fast",
       "Collapse each strongly connected component to one node, then count on what is left.",
       "O(V + E)."
      ],
      [
       "Simulate growth in days",
       "Each day every active referrer brings x people. Loop days and stop at the target.",
       "O(days)."
      ],
      [
       "Smallest bonus that reaches the target",
       "More bonus never gives fewer referrals, so the answer is monotone. Binary search the bonus and simulate each.",
       "O(log range x one simulation)."
      ],
      [
       "Best k influencers exactly",
       "Maximum coverage: hard. Keep greedy, speed it with a heap of stale gains re-checked at the top.",
       "Gains only shrink, so most re-checks are skipped."
      ],
      [
       "True flow centrality",
       "Brandes: one BFS per person that also counts shortest paths, then a backward pass sharing credit.",
       "O(V x E) unweighted."
      ],
      [
       "Weighted vouches",
       "Swap the deque for a heap: Dijkstra. Nothing else changes.",
       "O((V + E) log V)."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "The code review: every decision, and how to stand behind it",
     "prose": true,
     "items": [
      {
       "q": "How the 30 minutes go, and the opener",
       "a": "The reviewer has read your code. They will ask why, over and over, and they are checking three things: that every choice was a choice, that you know what it costs, and that you can say what you would change without getting defensive. A working solution gets you into the room; this is what is judged.\n\nOpen with about a minute, before they ask anything: \"I treated it as a pipeline. Build a clean graph and count what I dropped. One BFS gives parent and hop count for every reachable person, and everything else reads from that: the path walks back the parents, ranking reads the hop counts, reach is the size of the BFS. Where the prompt left a word undefined, I wrote my decision as a comment at the top and coded to it. The two places I would look first are the scoring weights, which are a product decision, and top-k, which runs a BFS per person.\"\n\nThen let them steer. For each question: the decision, the alternative you considered, why, and what it costs. Concede fast when they are right, then say how you would change it. \"Fair, I would do X\" is a strong answer, not a weak one."
      },
      {
       "q": "1. The graph is a dict of sorted neighbour lists",
       "a": "**Decided.** A plain dict from expert id to a sorted list of the ids they vouch for, built with sets first.\n\n**Instead of.** A Graph class, networkx, or keeping sets.\n\n**Why.** Sets while building make duplicate edges free to drop. Sorting at the end makes every traversal deterministic: the same input gives the same path and the same ranking every run, which is what makes the output testable. A dict of lists is the smallest thing that works and the reviewer reads it in one glance.\n\n**What it costs.** Sorting is O(d log d) per person at build time, paid once. No encapsulation: any code can edit the dict.\n\n**If they push.** \"In a live system I would wrap it in a class with add_referral, so the rules are enforced in one place. For an hour, functions over a dict kept every part runnable.\""
      },
      {
       "q": "2. Bad rows are dropped and counted, not raised",
       "a": "**Decided.** Self-loops and edges with an unknown id are skipped; duplicates collapse; build_graph returns how many were dropped.\n\n**Instead of.** Raising on the first bad row, or dropping silently.\n\n**Why.** One bad row should not throw away a batch of good ones, so I keep going. But silent dropping hides bugs, so the count comes back with the graph and main prints it. It is the middle ground: robust, and still visible.\n\n**What it costs.** The count says how many, not which or why.\n\n**If they push.** \"If silent data loss matters here, I would log each dropped row with its reason, or add a strict flag that raises. Which is right depends on whether this data comes from a person or a pipeline.\""
      },
      {
       "q": "3. Cycles and several referrers are allowed",
       "a": "**Decided.** The graph accepts any directed edge that passes the checks, including e2 -> e3 -> e2.\n\n**Instead of.** Enforcing one referrer per person and no cycles, as some versions of this prompt ask.\n\n**Why.** 'Vouches for' can be mutual, so I did not invent a rule the prompt did not give me. Every traversal carries a visited set, so cycles are safe: nothing loops forever.\n\n**What it costs.** Reach can no longer be a subtree size (see top-k), and a referral tree view is not available.\n\n**If they push.** \"If the rule is one referrer and no cycles, add_referral checks two things before adding a -> b: b has no referrer yet, and walking up from a through the referrers never reaches b. That walk is O(depth). Then the graph is a forest.\""
      },
      {
       "q": "4. BFS, iterative, with a deque",
       "a": "**Decided.** Breadth-first search with collections.deque and a visited set.\n\n**Instead of.** DFS, or recursion.\n\n**Why.** BFS visits people in order of hops, so the first time it reaches someone is by the fewest hops. That one property gives both the shortest path and the hop counts for ranking. Iterative, because recursion in Python stops around a thousand levels and a long referral chain would crash it. A deque, because list.pop(0) shifts the whole list every time.\n\n**What it costs.** O(V) extra memory for the queue, visited, parent and distance.\n\n**If they push.** \"DFS would find a path, not the shortest one. For weighted vouches I would swap the deque for a heap and it becomes Dijkstra; nothing else changes.\""
      },
      {
       "q": "5. One BFS returns parent and distance; everything reads from it",
       "a": "**Decided.** bfs_parents is the only function that traverses. shortest_path walks back the parents; rank_candidates and reach read the distances.\n\n**Instead of.** Each query doing its own traversal.\n\n**Why.** Cycle safety lives in one place. Each piece is testable alone: the walk-back can be tested on a hand-made parent map with no graph at all. And one BFS from a person answers every question about that person.\n\n**What it costs.** shortest_path explores the whole reachable graph even when the target is one hop away.\n\n**If they push.** \"For a single path query I would stop the BFS the moment the target is reached; it is already the shortest. I did not, to keep one traversal for everything.\""
      },
      {
       "q": "6. The score is 2 x matched skills minus hops",
       "a": "**Decided.** score = 2 x (required skills the expert has) - hop count. Experts with no match stay in the list with a negative score.\n\n**Instead of.** Filtering out no-match experts, normalising, or weighting hops more.\n\n**Why.** The 2 means one matching skill is worth two hops: a skilled person three hops away beats an unskilled friend one hop away. That is a product decision and I say it as one. Keeping no-match experts means ranking returns everything reachable and the caller decides what to cut; ranking should not also filter.\n\n**What it costs.** The weights are a guess. Negative scores look odd in a list.\n\n**If they push.** \"The weight is the knob. If proximity matters more, because a direct vouch is a stronger signal, raise the hop weight. I would tune it against hires that worked out, not by intuition.\""
      },
      {
       "q": "7. Scoring sits in a small class",
       "a": "**Decided.** SimpleScorer with one score method, passed into rank_candidates; SeniorityScorer shows a change.\n\n**Instead of.** The formula inline in rank_candidates.\n\n**Why.** The formula is the part most likely to change. Behind one method it can change, be tested on its own, or be swapped for an A/B test, without touching the graph or BFS.\n\n**What it costs.** A class for one method is close to over-engineering in an hour.\n\n**If they push.** \"Fair: a plain function passed as a parameter does the same job. I used a class because seniority showed state could come in. Either way the point is that rank_candidates never knows the formula.\" Concede this one quickly if pushed."
      },
      {
       "q": "8. Every sort has a full tie-break",
       "a": "**Decided.** Ranking sorts by score descending, then hops ascending, then id ascending. Top-k sorts by reach descending, then id.\n\n**Instead of.** Sorting by the main key only.\n\n**Why.** Without a final tie-break, equal scores come out in whatever order the dict produced, so two runs or two machines can disagree and a test cannot pin the output. The id as the last key makes it a total order.\n\n**What it costs.** Ties by id are arbitrary: they favour e1 over e9 for no real reason.\n\n**If they push.** \"If ties should mean something, the tie-break becomes a real signal, like most recent referral or seniority. The id is there to be deterministic, not to be fair.\""
      },
      {
       "q": "9. Reach means everyone under you, at any depth, not counting you",
       "a": "**Decided.** reach(p) is the number of people BFS reaches from p, minus p.\n\n**Instead of.** Direct referrals only, or depth-weighted reach (closer counts more).\n\n**Why.** 'Who brought the most people in' should credit the people your referrals brought in too. It counts each person once even when several paths lead to them, because visited dedupes.\n\n**What it costs.** A top referrer can be credited for a large network they barely touched.\n\n**If they push.** \"Direct count is one line if that is what they meant. If indirect should count less, weight each person by a decay per hop, which BFS already gives me the hops for.\""
      },
      {
       "q": "10. Top-k runs a BFS from every person",
       "a": "**Decided.** Compute reach for everyone, sort, take the first k. Ties by id; k larger than the number of people returns everyone.\n\n**Instead of.** Something faster.\n\n**Why.** It is correct on any graph, cycles included, and it is five lines in an hour.\n\n**What it costs.** O(V x (V + E)). Fine for thousands of people, slow for millions. A full sort where a heap of size k would do.\n\n**If they push.** \"This is the one I would change first. If the graph is a forest, one referrer and no cycles, reach is subtree size: one post-order pass gives everyone's reach in O(V + E). With cycles, collapse each cycle into one node first (strongly connected components), then do the same on what is left. And heapq.nlargest(k, ...) instead of a full sort.\""
      },
      {
       "q": "11. Influencers are picked greedily by new people covered",
       "a": "**Decided.** Pick the person who adds the most people not yet covered, counting themselves; mark them and everyone under them covered; repeat k times; stop early when nobody adds anyone.\n\n**Instead of.** The top k by reach.\n\n**Why.** Two people with big reach who cover the same group would waste a pick; greedy avoids that. Choosing the best k exactly is the maximum coverage problem, which is too slow to solve exactly at any real size. Greedy is the standard answer, and it is proven to get at least about 63 percent (1 - 1/e) of the best possible coverage.\n\n**What it costs.** A BFS from everyone to build the 'under' sets, O(V x (V + E)), and up to O(V squared) memory for those sets. Each round scans everyone: O(k x V) set differences.\n\n**If they push.** \"Gains only shrink as more is covered, so a heap of stale gains that are re-checked only when they reach the top (lazy greedy) skips most of the scanning. I kept the plain version because it is easy to verify.\""
      },
      {
       "q": "12. Flow centrality counts one shortest path per pair",
       "a": "**Decided.** For every pair, walk back the one shortest path BFS found and add one to each person strictly in the middle.\n\n**Instead of.** True betweenness centrality, which splits credit across all shortest paths.\n\n**Why.** It is ten lines on top of bfs_parents, and it answers the question 'who sits between people' in a way I can explain.\n\n**What it costs.** When several shortest paths exist, only the first one in sorted order gets credit, so the numbers depend on id order.\n\n**If they push.** \"The exact version is Brandes' algorithm: one BFS per person that also counts how many shortest paths reach each node, then a backward pass that shares credit. O(V x E) for an unweighted graph. I would name it and say it is the next step, not write it in the hour.\""
      },
      {
       "q": "13. What I tested, and what I would add",
       "a": "Tested in main on the sample: a duplicate edge, a self-loop, an unknown id, a cycle (e2 and e3), an unreachable person (e5 from e1), start equal to target, ties in the ranking.\n\nI would add, as asserts or a test file: max_hops = 0 returns []; k = 0 and k larger than everyone for top-k; an empty graph; a person with no edges; influencers stopping early when nobody adds anyone; and one larger random graph where top-k's reach is checked against a brute force.\n\nIf they ask how you know it is right: \"Every function is deterministic, so I can write exact expected outputs. I checked the small cases by hand and the printed output matches.\""
      },
      {
       "q": "14. What I would do with another hour",
       "a": "Say these in order of value, not all of them:\n\n1. Top-k in O(V + E) with subtree sizes, after collapsing cycles.\n2. A Graph class with add_referral that enforces the rules in one place.\n3. A real test file covering the cases above.\n4. Cache each person's BFS result, and on a new referral invalidate only the people who can reach its source.\n5. Lazy greedy for influencers.\n\nClose with one plain line: \"I kept it simple so every part runs end to end, and I know where each part breaks first.\""
      }
     ]
    }
   ]
  },
  {
   "id": "yours-q2",
   "title": "2. Q2 Exchange rate via chained conversions",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** You get a list of exchange rates, each [from, to, rate], meaning 1 unit of from is rate units of to. Given a source and a target currency, return the rate from source to target. You may chain through other currencies and use a rate in reverse. The same currency gives 1.0, no chain gives -1.0, and there are up to 10,000 rates. Reported variant (PracHub, Medium, onsite): the table is consistent. A follow-up the problem leads to, not reported wording: the best rate when quotes disagree, and arbitrage."
    },
    {
     "t": "skim",
     "clarify": [
      [
       "Is the reverse rate 1 over the rate?",
       "Yes: add a reciprocal edge. No, a separate quote: chains can disagree."
      ],
      [
       "Is the table consistent?",
       "Yes: any path works. No: the question becomes the best rate."
      ],
      [
       "One query or many?",
       "Many: build once and cache, or a weighted union-find."
      ],
      [
       "Same currency, unknown currency?",
       "1.0 first, even if it is not in the table; -1.0 when no chain."
      ]
     ],
     "road": [
      [
       "A directed weighted graph.",
       "Currency is a node, a rate is a multiplier edge, plus its reciprocal."
      ],
      [
       "BFS from the source.",
       "Record (parent, rate) per node, then multiply walking back from the target."
      ],
      [
       "Why any path is enough.",
       "Cycles exist (A to B to A), but consistency makes the product around any cycle 1."
      ],
      [
       "Edge cases out loud.",
       "Same currency 1.0; unknown or unreachable -1.0; compare floats with a tolerance, never ==."
      ],
      [
       "Rates disagree.",
       "Take logs: the best product is a shortest path on -log(rate). Bellman-Ford, because a rate above 1 is a negative edge; a cycle above 1 is arbitrage."
      ]
     ],
     "cost": "one query O(V + E) · many queries union-find, near O(1) each · best rate Bellman-Ford O(V x E) · tolerance 1e-6",
     "limit": "Dijkstra minimises sums of non-negative weights; here the cost is a product and rates above 1 break it."
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
       "Is the reverse rate 1 over the rate?",
       "Yes, always",
       "Add a reciprocal edge for every rate and I am done."
      ],
      [
       "",
       "No, a separate quote with a spread",
       "Keep the given quote and add 1 over the rate only where none is given. Chains can now disagree, so the best rate matters."
      ],
      [
       "Is the table consistent?",
       "Yes",
       "Any path gives the same product. BFS from the source, multiply on the way back. O(V + E)."
      ],
      [
       "",
       "No, or not sure",
       "The question becomes the best rate. Work in logs: the best product is the shortest path on -log(rate). Use Bellman-Ford, because a rate above 1 is a negative edge. A cycle with product above 1 is arbitrage."
      ],
      [
       "Source equals target?",
       "Yes",
       "Return 1.0 first, even if the currency is not in the table."
      ],
      [
       "Unknown currency or no chain?",
       "Return -1.0",
       "Check membership before the BFS. If BFS finds no parent for the target, return -1.0."
      ],
      [
       "How many queries?",
       "One",
       "Build the graph and BFS. O(V + E)."
      ],
      [
       "",
       "Many",
       "Build once. Cache the parent map per source, or use a weighted union-find where each currency stores its value in units of its root. A query is a ratio of two values, near constant time."
      ],
      [
       "Do rates change?",
       "Yes, live",
       "Overwrite one edge pair and drop any cached parent map that could reach it. Union-find cannot delete, so I rebuild it."
      ],
      [
       "Is there a fee per hop?",
       "Yes",
       "Multiply by (1 - fee) per hop. Now hop count matters, so the best path matters again."
      ],
      [
       "Do I need the chain as well as the rate?",
       "Yes",
       "The parent map already holds it. It is an audit trail."
      ],
      [
       "Precision?",
       "Real money",
       "Decimal, or logs. Floats are fine inside a 1e-6 relative tolerance."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** It is a graph where the weights multiply. Because every rate has a reciprocal and the table is consistent, every path from source to target multiplies to the same number, so I need any path, found with BFS, and I multiply the rate into each node on the way back. That is O(V + E). If the table can disagree, I need the best path: take logs so products become sums, and use Bellman-Ford, since a rate above 1 gives a negative edge and breaks Dijkstra. A cycle whose rates multiply to more than 1 is free money."
    },
    {
     "t": "write",
     "id": "mercor-yours-q2-w",
     "q": "Try it first. Write your approach: the model, the traversal, how you get the rate back, the edge cases and the cost.",
     "starter": "Model:\n\nTraversal:\n\nGetting the rate:\n\nEdge cases:\n\nCost:\n",
     "hint": "Currencies are nodes, a rate is a multiplier edge, and every edge has a reciprocal. Why is any path enough?",
     "solution": "1. Model currencies as nodes and each rate as a weighted edge. The weight is a multiplier, not a distance.\n2. Make it bidirectional: for every A to B at rate r, also add B to A at 1 / r.\n3. Find any path with BFS from the source. Consistency makes every path give the same product.\n4. Track each node's parent and the rate into it. Walk back from the target to the source, multiplying.\n5. Source equals target: 1.0. Unknown currency or unreachable target: -1.0.\nCost: O(V + E) time and space per query.",
     "say": [
      "**Build an adjacency dict with reciprocal edges: A to B at r, B to A at 1 over r.** BFS from the source, recording each node's parent and the rate into it; the visited set stops you walking back along the edge you came from. Walk the parents back from the target to the source, multiplying as you go.",
      "Source equals target is 1.0, unreachable is minus 1.0. It works because the table is consistent, so every path gives the same product. I do not need a shortest path, only a path. O(V plus E) time and space."
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q2-p",
     "title": "Exchange rate via chained conversions",
     "source": "Your Q2 write-up (Muse), run with Python 3.12",
     "d": "medium",
     "minutes": 30,
     "why": "Build the graph with reciprocal edges, BFS that records parents, then walk back multiplying. His code, unchanged.",
     "statement": "Write get_rate(rates, source, target) that returns the chained exchange rate, 1.0 for the same currency and -1.0 when no chain connects them.",
     "examples": [
      {
       "input": "USD to EUR with USD to GBP 0.77 and GBP to EUR 1.2",
       "output": "0.924",
       "note": "Float dust is expected: it prints 0.9239999999999999."
      }
     ],
     "constraints": [
      "standard library only",
      "at most 10,000 rates",
      "relative error 1e-6"
     ],
     "starter": "def get_rate(rates, source, target):\n    ...\n",
     "hints": [
      "Add a reciprocal edge for every rate. BFS with a visited set, storing (parent, rate) for each node, then multiply on the way back."
     ],
     "solution": "from collections import deque\n\n\ndef build_graph(rates):\n    \"\"\"Adjacency dict: currency -> {neighbor: rate}.\n    Each given rate adds a forward edge and a\n    reciprocal reverse edge.\"\"\"\n    graph = {}\n    for src, dst, rate in rates:\n        # setdefault: get src's neighbors dict, creating\n        # an empty one first if src is new. Then add edge.\n        graph.setdefault(src, {})[dst] = rate\n        graph.setdefault(dst, {})[src] = 1.0 / rate\n    return graph\n\n\ndef bfs_parents(graph, source, target):\n    \"\"\"BFS from source. Returns a parent map:\n    node -> (parent, rate parent->node).\n    Returns None if target is unreachable.\n    The visited set is what stops the walk going back\n    along the reciprocal edge it came from.\"\"\"\n    queue = deque([source])\n    visited = {source}\n    parent = {source: (None, 1.0)}\n    while queue:\n        node = queue.popleft()\n        if node == target:\n            return parent\n        for neighbor, rate in graph.get(node, {}).items():\n            if neighbor not in visited:\n                visited.add(neighbor)\n                parent[neighbor] = (node, rate)\n                queue.append(neighbor)\n    return None\n\n\ndef get_rate(rates, source, target):\n    \"\"\"Exchange rate from source to target,\n    or -1.0 if no chain connects them.\"\"\"\n    if source == target:\n        return 1.0\n    graph = build_graph(rates)\n    if source not in graph or target not in graph:\n        return -1.0\n    parent = bfs_parents(graph, source, target)\n    if parent is None:\n        return -1.0\n    # Walk target -> parent -> parent ... -> source,\n    # multiplying each hop's rate on the way back.\n    result = 1.0\n    node = target\n    while parent[node][0] is not None:\n        result *= parent[node][1]\n        node = parent[node][0]\n    return result",
     "complexity": "Per query O(V + E) time and space. build_graph O(E).",
     "explain": [
      "The only import is deque from collections.",
      "The first line of output is float dust: 0.77 x 1.2 is not exact in binary floating point. The 1e-6 relative tolerance exists to absorb it."
     ],
     "tests": "rates = [\n    [\"USD\", \"GBP\", 0.77],\n    [\"GBP\", \"EUR\", 1.2],\n    [\"EUR\", \"INR\", 90.0],\n]\n\n\ndef main():\n    print(get_rate(rates, \"USD\", \"EUR\"))  # 0.924\n    print(get_rate(rates, \"EUR\", \"USD\"))  # 1 / 0.924\n    print(get_rate(rates, \"USD\", \"INR\"))  # 0.77*1.2*90\n    print(get_rate(rates, \"USD\", \"USD\"))  # 1.0\n    print(get_rate(rates, \"USD\", \"JPY\"))  # -1.0\n\n\nif __name__ == \"__main__\":\n    main()"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "0.9239999999999999\n1.0822510822510822\n83.16\n1.0\n-1.0"
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
       "Many queries",
       "Build the graph once. Cache the parent map per source: one BFS answers every target from it.",
       "O(V + E) per new source, then a walk-back per query."
      ],
      [
       "Weighted union-find instead of BFS",
       "Each currency stores its value in units of its root. A query divides two stored values.",
       "Near constant per query. No path out, and no delete."
      ],
      [
       "Rates change",
       "Overwrite one edge pair, drop affected cached parent maps.",
       "A rebuild of any cache that could reach the edge."
      ],
      [
       "The best rate when quotes disagree",
       "Logs, then Bellman-Ford on -log(rate). Dijkstra works only if every rate is at most 1.",
       "O(V x E), against O(V + E) for BFS."
      ],
      [
       "Is there arbitrage?",
       "In log space a cycle with product above 1 is a negative cycle. Bellman-Ford finds it with one more pass.",
       "One extra pass over the edges."
      ],
      [
       "Stale quotes",
       "Keep a timestamp per quote and prefer the newest, or reject one past a limit.",
       "A field per edge."
      ],
      [
       "Fees or spread",
       "Multiply (1 - fee) per hop, keep the given reverse quote.",
       "The best path now matters, so BFS is not enough."
      ],
      [
       "The store is a database",
       "Put BFS behind neighbors(node). The nested dict is one implementation, a database lookup another.",
       "A call per node visited."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "BFS with a parent map, not the product in the queue",
       "a": "**Decided.** Record (parent, rate) for each node and multiply while walking back.\n\n**Instead of.** Carrying (node, product_so_far) in the queue, which is shorter.\n\n**Why.** It gives the path as an audit trail, one BFS answers every target from the same source, and traversal and arithmetic stay separate so each can be tested alone.\n\n**What it costs.** A parent map of size V.\n\n**If they push.** Both are correct, and I would switch if a reviewer wanted the shorter code."
      },
      {
       "q": "Any path, not a shortest path",
       "a": "**Decided.** I do not use Dijkstra.\n\n**Instead of.** Dijkstra or a best-path search.\n\n**Why.** Consistency makes every path give the same product. Dijkstra minimises sums, and the cost here is a product.\n\n**What it costs.** None while the table is consistent.\n\n**If they push.** If the table can disagree, the answer is the best rate and it needs logs and Bellman-Ford."
      },
      {
       "q": "Cycles exist, so why does the maths work?",
       "a": "**Decided.** I say consistency is the load-bearing assumption.\n\n**Instead of.** Saying there are no cycles.\n\n**Why.** The reverse edges create cycles at once, A to B to A. The product around any cycle is 1, so the path I pick does not matter. The visited set stops the walk going back.\n\n**What it costs.** If the table is ever inconsistent, no path is trustworthy.\n\n**If they push.** Check consistency when the graph is built if the data source is not trusted."
      },
      {
       "q": "A dict of dicts with setdefault",
       "a": "**Decided.** graph[src][dst] = rate, creating the inner dict on first use.\n\n**Instead of.** A class or a list of edges.\n\n**Why.** It is the smallest structure that gives neighbors in O(1), and setdefault avoids a membership test.\n\n**What it costs.** No encapsulation.\n\n**If they push.** In a live service I would wrap it, with add_rate in one place."
      },
      {
       "q": "Same currency checked first",
       "a": "**Decided.** Return 1.0 before looking anything up.\n\n**Instead of.** Letting an unknown currency fall to -1.0.\n\n**Why.** The rule says the same currency is 1.0 even if it is not in the table.\n\n**What it costs.** None.\n\n**If they push.** State the order of checks out loud."
      },
      {
       "q": "Float dust and the tolerance",
       "a": "**Decided.** Floats, with the 1e-6 relative tolerance.\n\n**Instead of.** Decimal.\n\n**Why.** 0.77 x 1.2 prints 0.9239999999999999, which the tolerance absorbs.\n\n**What it costs.** Long chains drift a little.\n\n**If they push.** For real money I would use Decimal or logs."
      },
      {
       "q": "The graph is rebuilt on every call",
       "a": "**Decided.** As written, yes, for one clear function.\n\n**Instead of.** A class that builds once.\n\n**Why.** It keeps the code short for the hour.\n\n**What it costs.** O(E) per query that I do not need.\n\n**If they push.** Build once, cache parent maps per source, or use the union-find version."
      },
      {
       "q": "What I would do with another hour",
       "a": "**Decided.** Build once and cache, then validate the table for consistency.\n\n**Instead of.** More features.\n\n**Why.** Many queries and bad data are the real production risks.\n\n**What it costs.** Time.\n\n**If they push.** Add the best-rate and arbitrage version only if the table can disagree."
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
   "id": "yours-q4",
   "title": "3. Q4 The comparator that lies (faulty comparator)",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** You need to sort a list of items. You have a comparison function that says which of two items is bigger, but it is wrong some of the time, maybe about 10 percent. How do you sort the list? No code, 30 minutes, a discussion. Reported variants: top k only, minimise the number of calls, calls that are slow, and a paid API that is right 90 percent of the time (chapter 4 plans that one)."
    },
    {
     "t": "skim",
     "clarify": [
      [
       "Same pair asked twice, same answer?",
       "This one question picks the tool: random errors are fixed by repeating, fixed errors only by structure."
      ],
      [
       "How often is it wrong?",
       "About 10 percent: mostly right. At 50 percent there is no signal at all."
      ],
      [
       "Can I cache answers?",
       "Yes, and I should when errors are fixed: each pair costs one call, ever."
      ],
      [
       "All sorted, or only the best k?",
       "Only k changes where the calls go: to the boundary."
      ]
     ],
     "road": [
      [
       "A plain sort is wrong.",
       "One bad comparison misplaces an element, and one comparison can never tell you it lied."
      ],
      [
       "Random errors: repeat and vote.",
       "Ask each pair m times and keep the majority, then sort normally."
      ],
      [
       "Fixed errors: rank by wins.",
       "Compare many pairs and rank each item by its win rate. About 10 percent of edges lie, so the counts are mostly right."
      ],
      [
       "A cycle is the lie detector.",
       "a over b over c over a proves a lie inside it, but not which edge. So I fix the ranking, not single edges."
      ],
      [
       "Top k and slow calls.",
       "A tournament for candidates, then spend the remaining calls on the k-th against the (k+1)-th. Slow calls: independent pairs in parallel rounds."
      ]
     ],
     "cost": "all pairs O(n^2) calls · one knockout O(n) · m votes multiply calls by m · exact recovery is minimum feedback arc set, NP-hard",
     "limit": "Consistent lies make no cycle, so they are invisible. An exact order is not achievable in general; I give the most likely one."
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
       "Same pair twice, same answer?",
       "Different answers (random)",
       "Repeat each pair m times, odd m, take the majority. At 10 percent wrong, 15 votes leave a pair wrong about 3 times in 100,000. Or keep win counts over repeated rounds."
      ],
      [
       "",
       "Same answer every time (fixed)",
       "Repeating is useless, so I stop paying for it. Compare many different pairs, rank by win count, and use cycles as the lie detector."
      ],
      [
       "Can I see the values or any true answer?",
       "No, the comparator is all I have",
       "Transitivity is my only check: a over b and b over c must give a over c. A cycle contradicts it."
      ],
      [
       "",
       "A few trusted items or a slow exact check",
       "Use them as anchors and spot checks, not as the sort."
      ],
      [
       "How often is it wrong?",
       "About 10 percent, no bound given",
       "Rank by wins, and say the result is close to the true order, not guaranteed exact."
      ],
      [
       "",
       "At most k answers wrong",
       "Exact recovery is possible: find the smallest set of at most k edges whose flip makes the graph acyclic. If two such sets exist, the data cannot tell them apart, and I say so."
      ],
      [
       "How exact must the order be?",
       "Fully sorted",
       "I need a bound on the faults, or I say I can only promise consistency."
      ],
      [
       "",
       "Roughly right is fine",
       "One win-count pass is enough. I report the largest distance an item can sit from its true place."
      ],
      [
       "What does a call cost?",
       "Cheap",
       "All n(n-1)/2 pairs, then win counts. For n = 40 that is 780 calls."
      ],
      [
       "",
       "Paid or slow",
       "Merge sort first (about n log2 n calls, roughly 213 for n = 40), then spend extra calls only where cycles show up. For slow calls, batch each round."
      ],
      [
       "Can it say equal?",
       "Yes",
       "A tie breaks the strict order. I count it as half a win to each side."
      ],
      [
       "Do I need all of them sorted?",
       "Only the best k",
       "A bracket with votes on the best item's matches (about log2 n of them) beats sorting everyone."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Two cases, two tools. If a repeated question can get a different answer, the errors are noise: ask each pair m times and keep the majority, or keep win counts and average them. With 10 percent wrong, the average is right once there are enough repetitions. If the same pair always gets the same answer, repeating changes nothing. Then compare many different pairs and rank each item by how many it wins, its win rate. Only about 10 percent of edges are lies, so every item's win count is mostly right and the errors wash out. A true order has no cycle, so every cycle (a over b over c over a) proves a lie inside it. It does not say which edge, so I fix the ranking, not single edges."
    },
    {
     "t": "write",
     "id": "mercor-yours-q4-clarify-w",
     "q": "Try it first. Write the questions you would ask before designing anything, and what each answer changes.",
     "starter": "1. \n2. \n3. \n4. \n",
     "hint": "The first one: if I compare the same pair twice, do I get the same answer? Then what other truth I have, how exact the order must be, and what a call costs.",
     "solution": "Random or fixed? Fixed: same pair, same wrong answer, every time, so a systematic fault, not noise.\nAny other source of truth? No. I cannot see the values, but I can call the comparator on any pair, as often as I like.\nHow exact? Fully sorted, assuming a true total order underneath.\nWhat does a call cost? Not given. I state my assumption and say how the answer changes if calls are slow.\nA fixed fault kills retry and vote, and no oracle kills checking against truth. What survives is catching the comparator contradicting itself.",
     "say": [
      "**Before I design anything, the answer depends on how it is wrong.** Can I ask what kind of fault it is, what I am allowed to use, and how exact the result must be?"
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q4-p",
     "title": "Rank with a comparator that lies, random and fixed",
     "source": "Core of the Q4 answer, run with Python 3",
     "d": "medium",
     "minutes": 20,
     "why": "Two liars, the vote that fixes one, the win count that handles the other, and the cycle check that proves a lie.",
     "statement": "Write random_liar and fixed_liar (wrong 10 percent of the time), vote(cmp, m), rank_by_wins(items, cmp) and cycles(items, cmp), then show what each fixes.",
     "examples": [
      {
       "input": "40 items, 10 percent wrong, 15 votes",
       "output": "random: exact order; fixed: same lies as without votes",
       "note": "A fixed liar gives the same answer again, so the votes cannot change it."
      }
     ],
     "constraints": [
      "standard library only",
      "items are comparable numbers, so the true order is known for testing"
     ],
     "starter": "def rank_by_wins(items, cmp):\n    ...\n",
     "hints": [
      "Compare every pair once, give the winner a point, sort by points.",
      "A cycle needs three items, so look at triples in both orientations."
     ],
     "solution": "import random\nfrom itertools import combinations\n\n\ndef random_liar(p=0.9, seed=0):\n    \"\"\"Wrong with chance 1 - p, a fresh coin on every call.\"\"\"\n    rng = random.Random(seed)\n    return lambda a, b: (a > b) if rng.random() < p else (a < b)\n\n\ndef fixed_liar(p=0.9, seed=0):\n    \"\"\"The same pair always gets the same answer: each pair's lie is decided once.\"\"\"\n    rng, lies = random.Random(seed), {}\n    def cmp(a, b):\n        lie = lies.setdefault((min(a, b), max(a, b)), rng.random() > p)\n        return (a > b) != lie\n    return cmp\n\n\ndef vote(cmp, m):\n    \"\"\"Random liar: ask m times (odd), go with the majority.\"\"\"\n    return lambda a, b: sum(cmp(a, b) for _ in range(m)) * 2 > m\n\n\ndef rank_by_wins(items, cmp):\n    \"\"\"Fixed liar: compare every pair once, rank by win count.\"\"\"\n    wins = dict.fromkeys(items, 0)\n    for a, b in combinations(items, 2):\n        wins[a if cmp(a, b) else b] += 1\n    return sorted(items, key=wins.get, reverse=True)\n\n\ndef cycles(items, cmp):\n    \"\"\"Every 3-cycle a>b>c>a proves at least one lie among its three edges.\"\"\"\n    return [t for t in combinations(items, 3)\n            if any(cmp(x, y) and cmp(y, z) and cmp(z, x)\n                   for x, y, z in (t, (t[0], t[2], t[1])))]",
     "complexity": "rank_by_wins: O(n^2) calls and O(n log n) to sort the counts. vote: m times the calls. cycles: O(n^3) triples, fine for a demo, sampled in practice.",
     "explain": [
      "fixed_liar decides each pair's lie once and keeps it, so asking again returns the same answer. That is the case the interviewer is probing.",
      "rank_by_wins is a heuristic, not an exact repair: it gives a close order, and the largest place error is printed so you can quote it."
     ],
     "tests": "items = list(range(40))\nwant = sorted(items, reverse=True)\n\ndef off(order):  # biggest distance any item sits from its true place\n    return max(abs(order.index(x) - want.index(x)) for x in items)\n\nc = random_liar()\nprint(\"random, 1 vote, ranked by wins: max place error\", off(rank_by_wins(items, c)))\nprint(\"random, 15 votes, ranked by wins:\", rank_by_wins(items, vote(random_liar(), 15)) == want)\n\nf = fixed_liar()\nprint(\"fixed, 15 votes, same lies every time:\", rank_by_wins(items, vote(f, 15)) == rank_by_wins(items, f))\nprint(\"fixed, ranked by wins: max place error\", off(rank_by_wins(items, f)))\nprint(\"fixed, 3-cycles found:\", len(cycles(items, f)), \"of\", 40 * 39 * 38 // 6, \"triples\")\nprint(\"honest comparator, 3-cycles found:\", len(cycles(items, lambda a, b: a > b)))"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "random, 1 vote, ranked by wins: max place error 6\nrandom, 15 votes, ranked by wins: True\nfixed, 15 votes, same lies every time: True\nfixed, ranked by wins: max place error 6\nfixed, 3-cycles found: 935 of 9880 triples\nhonest comparator, 3-cycles found: 0"
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
       "What if at most k answers are wrong?",
       "Add redundancy, then search for the smallest set of at most k flips that leaves the graph acyclic.",
       "Dense comparisons up to n(n-1)/2, and a search that grows quickly with k."
      ],
      [
       "What if the faults were random after all?",
       "Repeat each pair an odd number of times and take the majority. The error falls exponentially in m.",
       "m times the calls, so m x n log2 n with a sort."
      ],
      [
       "Calls are slow",
       "Batch a whole round of comparisons into one parallel step. Wall time becomes rounds, not calls.",
       "Same calls, fewer waits. Needs a comparator that takes a batch."
      ],
      [
       "Only the best, or the top k",
       "A bracket, with votes on the best item's matches (about log2 n of them).",
       "About (n-1) x m calls for the best, far below a full sort at the same accuracy."
      ],
      [
       "Calls cost money",
       "Sort once, then vote only where pairs are close or a cycle appears.",
       "Between n log2 n and the full vote cost. See chapter 4."
      ],
      [
       "Near-equal items are wrong more often",
       "Votes fix none of it for a fixed fault. I accept an unordered band of near-equal items and say how wide.",
       "No extra calls. The result is a partial order."
      ],
      [
       "Can I use the library sort?",
       "Not directly. Java can throw because the comparator breaks its contract, C++ std::sort is undefined, Python returns some order. Wrap the comparator in a cached, consistent one, or sort by win count.",
       "Memory for the cache, about one entry per call."
      ],
      [
       "Make it exact with any number of lies",
       "I cannot, and I say so: consistent lies leave no cycle. Best effort ranking plus the cycles that remain.",
       "None. The honest limit is the point."
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "Why ask 'same pair twice' first?",
       "a": "**Decided.** It is the first question, before any design.\n\n**Instead of.** Assuming the faults are random and voting.\n\n**Why.** Random faults are averaged away, fixed ones are not. Every later answer depends on it.\n\n**What it costs.** One sentence of the interview.\n\n**If they push.** If they will not say, I name both plans and say which I take if I must guess."
      },
      {
       "q": "Why not log the wrong ones and flip them?",
       "a": "**Decided.** I never do that.\n\n**Instead of.** Keeping a log of comparisons that were wrong and a cache of corrected answers.\n\n**Why.** Nothing marks a wrong answer. A lie looks exactly like the truth, and with a fixed fault the cache stores the lie for ever.\n\n**What it costs.** I give up that tidy production story.\n\n**If they push.** Say it as a dead end I tried and dropped, and move to the graph."
      },
      {
       "q": "Why not reverse the edge that closed the cycle?",
       "a": "**Decided.** I treat the cycle as evidence against all its edges.\n\n**Instead of.** Flipping the newest edge.\n\n**Why.** A cycle proves at least one lie inside it. The edge that closed it may be the only true one, and the lie may be an older edge I already built on.\n\n**What it costs.** I need more comparisons so edges are corroborated by paths outside the cycle.\n\n**If they push.** A four-item example: true order A over B over C over D, the lie is C over A. The cycle A, B, C holds two true edges. Add A over D and B over D, which are true: no new cycles, and flipping C over A leaves one clean order."
      },
      {
       "q": "Why rank by wins, not sort once?",
       "a": "**Decided.** Compare all pairs and rank by win count.\n\n**Instead of.** One merge sort, n log2 n calls.\n\n**Why.** Each item takes part in n-1 comparisons, about 10 percent of them lies, so its count is mostly right. A sort uses each item in only about log2 n comparisons, so one lie can move an item a long way.\n\n**What it costs.** n(n-1)/2 calls instead of n log2 n: 780 against about 213 at n = 40.\n\n**If they push.** If calls are costly, sort first and spend the extra calls only near cycles."
      },
      {
       "q": "Why not run the sort again and combine?",
       "a": "**Decided.** I do not.\n\n**Instead of.** Repeating the whole sort.\n\n**Why.** A fixed fault makes the same comparisons and the same wrong order every run. Repeating helps only against randomness.\n\n**What it costs.** Wasted calls.\n\n**If they push.** Say: that is exactly the random case, and there I do vote."
      },
      {
       "q": "Can you tell which edge is a lie?",
       "a": "**Decided.** I say no, not from one cycle.\n\n**Instead of.** Claiming I can name the bad edge.\n\n**Why.** A single comparison has nothing to agree with, so detection needs at least three items and a transitivity check. Even then a cycle names its edges as suspects, not culprits.\n\n**What it costs.** I score edges by how many cycles they sit in and treat the top ones as likeliest.\n\n**If they push.** Minimum feedback arc set is NP-hard, so I say best effort."
      },
      {
       "q": "What can this never catch?",
       "a": "**Decided.** I volunteer the limit before they ask.\n\n**Instead of.** Promising exact order.\n\n**Why.** Lies that agree with each other, for example a comparator wrong on every pair involving one item, create no cycle. Redundancy detects errors only when the faults disagree.\n\n**What it costs.** I can only promise consistency, and exactness under a stated bound on the faults.\n\n**If they push.** Interviewers score an honest limit above a perfect construction that hides it."
      },
      {
       "q": "What I would do with another hour",
       "a": "**Decided.** Test the ranking against a bound on place error and a cost model.\n\n**Instead of.** More theory.\n\n**Why.** Numbers are what make a verbal answer credible.\n\n**What it costs.** Time.\n\n**If they push.** I would add the sampled cycle search for large n and the batched version for slow calls."
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
   "id": "yours-q5",
   "title": "4. Q5 Lost Tree",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** A hidden tree has n nodes, numbered 1 to n. You can query any node, and the query returns the distance from that node to every other node. You get at most ceil(n / 2) queries. Reconstruct every edge of the tree."
    },
    {
     "t": "skim",
     "clarify": [
      [
       "What does a query return?",
       "The distance from that node to every node."
      ],
      [
       "Is it a tree?",
       "Connected, n - 1 edges. Cycles would break the parity trick."
      ],
      [
       "What is the budget?",
       "At most ceil(n / 2) queries."
      ],
      [
       "Can n be 1 or 2?",
       "Yes: no edges, or one."
      ]
     ],
     "road": [
      [
       "Querying every node is n queries and loses.",
       "The budget is half that."
      ],
      [
       "Query node 1 and split by parity.",
       "Even distance on one side, odd on the other."
      ],
      [
       "Every edge joins even to odd.",
       "Its two ends differ by one in distance from node 1."
      ],
      [
       "Query every node on the smaller side.",
       "A node reports each neighbour at distance 1, so every edge is found."
      ],
      [
       "Count the queries.",
       "The smaller side is at most n / 2; with node 1 the total is at most ceil(n / 2)."
      ]
     ],
     "cost": "at most ceil(n / 2) queries · O(n) per query, O(n^2) total · O(n) space",
     "limit": "The trick needs a tree. In a graph with an odd cycle two neighbours can share a parity."
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
       "What does a query return?",
       "The distance from that node to every node",
       "One row gives all of that node's neighbours (the 1s). Node 1's row also gives the parity of every node."
      ],
      [
       "Is it a tree?",
       "Yes: connected, n - 1 edges",
       "Then it is bipartite, and every edge crosses the even and odd split, measured from any node."
      ],
      [
       "",
       "It might have cycles",
       "Parity breaks on an odd cycle: an edge can join two nodes of the same parity and hide. I say so and ask for a tree."
      ],
      [
       "What is the budget?",
       "At most ceil(n / 2) queries",
       "Query node 1, then the smaller parity side. The sides add up to n, so the smaller one is at most n / 2."
      ],
      [
       "",
       "Fewer than that",
       "This method queries a set that touches every edge, which on a path is about n / 2. I say that, and ask if the limit is tight, rather than guess."
      ],
      [
       "What do I return?",
       "The edges",
       "A set of unordered pairs (min, max). A parent and a child are both at distance 1: I do not need to tell them apart."
      ],
      [
       "Are the labels 1 to n?",
       "Yes",
       "A row is a list indexed by label, so position v - 1 holds node v."
      ],
      [
       "Can n be 1 or 2?",
       "Yes",
       "n = 1: no edges, one query. n = 2: node 1's row shows the edge and no more queries are needed."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** Parity. Query node 1 and split every node by the parity of its distance. Every edge joins an even node to an odd node, so every edge has one end on each side, and querying every node on one side finds every edge: that node reports the other end at distance 1. Query the smaller side. The two sides add up to n, so the smaller one is at most n / 2, and counting the query of node 1 the total is at most ceil(n / 2)."
    },
    {
     "t": "write",
     "id": "mercor-yours-q5-w",
     "q": "Try it first. Which nodes do you query, and why does that find every edge within ceil(n/2) queries?",
     "starter": "Which nodes I query:\n\nWhy every edge is found:\n\nWhy at most ceil(n/2):\n",
     "hint": "One query gives the whole distance map, and distance 1 means an edge. Query node 1 first and look at even and odd distances.",
     "solution": "1. Query node 1. Split all nodes into even and odd distance from 1.\n2. Query every node on the smaller side. Node 1 is on the even side and is already queried.\n3. For every queried node u, for every node v at distance 1 from u, add edge (u, v).\n4. The result is all n - 1 edges.\nQueries: at most ceil(n / 2). Time O(n) per query, O(n^2) total. Space O(n).",
     "say": [
      "**A query returns the whole distance map, distance 1 means an edge, and the problem is choosing which nodes to query.** Every edge joins an even node to an odd node relative to node 1, so querying the smaller side finds every edge.",
      "The parity split turns the query budget into a vertex cover, and the smaller side is at most half the nodes."
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q5-p",
     "title": "Lost Tree, with a judge that checks the query limit",
     "source": "Your Q5 write-up (Muse), run with Python 3",
     "d": "hard",
     "minutes": 30,
     "why": "The judge is a simulator of the hidden tree, so the solution runs against random trees, a path, a star, a double star and a binary tree.",
     "statement": "Write solve(n, query) that returns the set of all edges as (min, max) pairs, using query(v) at most ceil(n / 2) times.",
     "examples": [
      {
       "input": "star with centre 1, n = 8",
       "output": "1 query, 7 edges",
       "note": "The even side is only node 1."
      }
     ],
     "constraints": [
      "standard library only",
      "at most ceil(n / 2) queries"
     ],
     "starter": "def solve(n, query):\n    ...",
     "hints": [
      "Query node 1, split nodes by parity of distance, query the smaller side and read the distance-1 entries."
     ],
     "solution": "import math\nimport random\nfrom collections import deque\n\n\ndef solve(n, query):\n    # 1. Query node 1. Its answer splits every node into even\n    #    and odd distance from 1.\n    d1 = query(1)\n    even = [v for v in range(1, n + 1) if d1[v - 1] % 2 == 0]\n    odd = [v for v in range(1, n + 1) if d1[v - 1] % 2 == 1]\n\n    # 2. Query every node on the smaller side. Node 1 is on the\n    #    even side and is already queried, so it is skipped there.\n    #    Cost: 1 + len(odd) if the odd side is smaller, else\n    #    len(even). Either way at most ceil(n / 2).\n    if len(odd) < len(even):\n        to_query = odd\n    else:\n        to_query = [v for v in even if v != 1]\n\n    # 3. Read the edges off the answers: distance 1 means an edge.\n    #    The answer for node 1 counts too; its distance-1 nodes\n    #    are its neighbours.\n    answers = {1: d1}\n    for u in to_query:\n        answers[u] = query(u)\n\n    edges = set()\n    for u, du in answers.items():\n        for v in range(1, n + 1):\n            if du[v - 1] == 1:\n                edges.add((min(u, v), max(u, v)))\n    return edges\n",
     "complexity": "At most ceil(n / 2) queries. O(n) per query, O(n^2) total. O(n) space.",
     "explain": [
      "The first query splits the nodes into even and odd distance from node 1.",
      "Node 1 is on the even side and already queried, so the even side costs len(even) - 1 more queries, the odd side len(odd) more.",
      "Every queried row gives its node's neighbours: the entries equal to 1.",
      "TreeJudge, random_tree and the checks are in the tests: the judge counts queries and the check asserts the limit."
     ],
     "tests": "class TreeJudge:\n    # The judge: a hidden tree that answers distance queries.\n    # In the real problem this is the interactor; here it is a\n    # simulator so the solution can be run and checked.\n    def __init__(self, n, edges):\n        self.n = n\n        self.adj = {v: [] for v in range(1, n + 1)}\n        for a, b in edges:\n            self.adj[a].append(b)\n            self.adj[b].append(a)\n        self.queries_used = 0\n\n    def query(self, v):\n        # BFS from v; returns a distance list indexed 1..n.\n        self.queries_used += 1\n        dist = {v: 0}\n        q = deque([v])\n        while q:\n            u = q.popleft()\n            for w in self.adj[u]:\n                if w not in dist:\n                    dist[w] = dist[u] + 1\n                    q.append(w)\n        return [dist[i] for i in range(1, self.n + 1)]\n\n\ndef random_tree(n, rng):\n    # Random recursive tree: each new node attaches to a uniform\n    # earlier node. Produces varied shapes, sometimes skewed.\n    edges = []\n    for v in range(2, n + 1):\n        edges.append((v, rng.randint(1, v - 1)))\n    return edges\n\n\ndef check(n, edges, label):\n    judge = TreeJudge(n, edges)\n    found = solve(n, judge.query)\n    want = {(min(a, b), max(a, b)) for a, b in edges}\n    assert found == want, (label, found ^ want)\n    assert judge.queries_used <= math.ceil(n / 2), (label, judge.queries_used)\n    return judge.queries_used\n\n\nif __name__ == \"__main__\":\n    rng = random.Random(11)\n    runs = 0\n    for n in range(1, 51):\n        for _ in range(20):\n            check(n, random_tree(n, rng), \"random\")\n            runs += 1\n    print(f\"random trees: {runs} runs, n = 1 to 50, all within ceil(n/2) queries\")\n    for label, n, edges in [\n        (\"path\", 7, [(1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7)]),\n        (\"star\", 8, [(1, i) for i in range(2, 9)]),\n        (\"double-star\", 10, [(1, 2)] + [(1, i) for i in range(3, 7)]\n         + [(2, i) for i in range(7, 11)]),\n        (\"binary-tree\", 15, [(i, 2 * i) for i in range(1, 8) if 2 * i <= 15]\n         + [(i, 2 * i + 1) for i in range(1, 8) if 2 * i + 1 <= 15]),\n    ]:\n        used = check(n, edges, label)\n        print(f\"{label}: n={n}, queries={used}, limit={math.ceil(n / 2)}, edges={len(edges)} ok\")\n    print(\"ALL PASS\")\n"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "random trees: 1000 runs, n = 1 to 50, all within ceil(n/2) queries\npath: n=7, queries=4, limit=4, edges=6 ok\nstar: n=8, queries=1, limit=4, edges=7 ok\ndouble-star: n=10, queries=5, limit=5, edges=9 ok\nbinary-tree: n=15, queries=5, limit=8, edges=14 ok\nALL PASS"
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
       "Return the rooted tree",
       "From node 1's row, the end of an edge with the smaller distance is the parent.",
       "Free: row 1 is in hand"
      ],
      [
       "The graph is connected and bipartite, not a tree",
       "Same method: distance 1 still means an edge and every edge still crosses the cut. The smaller side is still at most n / 2.",
       "Same ceil(n / 2) queries"
      ],
      [
       "The graph has an odd cycle",
       "Parity no longer covers every edge. A different method is needed; I would ask for the spec.",
       "Not solved by this method"
      ],
      [
       "Weighted edges",
       "Distance 1 no longer means an edge, and parity of a weighted distance proves nothing. Different problem.",
       "Not solved by this method"
      ],
      [
       "A tighter budget",
       "I know no better than a set of nodes touching every edge. Ask if the bound is tight.",
       "On a path, about n / 2 queries"
      ],
      [
       "Reading the rows is slow",
       "Each row has n entries, so one scan is O(n); at most ceil(n / 2) rows.",
       "O(n^2) total, the size of what is read"
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "1. Why parity and not breadth-first search from node 1?",
       "a": "**Decided.** Split by the parity of the distance from node 1 and query the smaller side.\n\n**Instead of.** Querying the neighbours of node 1, then theirs.\n\n**Why.** BFS finds the edges but does not respect the budget. In a star, node 1 has n - 1 neighbours, and querying them already breaks the limit.\n\n**What it costs.** Nothing: parity needs the same first query.\n\n**If they push.** \"The shape of the tree does not matter: skewed or balanced, the parity split is the same.\""
      },
      {
       "q": "2. Why is the smaller side enough?",
       "a": "**Decided.** Query every node on one side.\n\n**Instead of.** Querying nodes until I think every edge is seen.\n\n**Why.** No edge has both ends on the same side, so none can hide from the queried side. That end reports the other at distance 1.\n\n**What it costs.** Nothing.\n\n**If they push.** \"It is a cut argument: the parity split is a cut that every edge crosses.\""
      },
      {
       "q": "3. Why is the count at most ceil(n / 2)?",
       "a": "**Decided.** Count node 1's query and the smaller side.\n\n**Instead of.** Hoping it is about half.\n\n**Why.** The two sides add up to n. If the odd side is smaller it has at most (n - 1) / 2 nodes, plus the query of node 1. If the even side is smaller, node 1 is on it and already queried, so it costs len(even).\n\n**What it costs.** Nothing.\n\n**If they push.** \"Path with 7 nodes: odd side 3, plus node 1, is 4, and the limit is 4. It is tight.\""
      },
      {
       "q": "4. Why not query half of each neighbour list?",
       "a": "**Decided.** Parity.\n\n**Instead of.** Halving each node's neighbours.\n\n**Why.** A double star: two centres A and B joined to each other, each with leaves. Query A, take half its neighbours, and if B falls in the half you skip, B is never queried and every edge from B to its leaves is lost. Parity has no such hole: B is at distance 1 and its leaves at distance 2, so one of the two sides is queried in full.\n\n**What it costs.** Nothing.\n\n**If they push.** \"Parity gives a guarantee. Halving gives a hope.\""
      },
      {
       "q": "5. A parent and a child are both at distance 1. How do you tell them apart?",
       "a": "**Decided.** I do not. The task asks for edges, not directions.\n\n**Instead of.** Working out a root and orienting edges.\n\n**Why.** An edge is an edge whichever end is the parent. If they want the rooted tree, node 1's row orients every edge for free.\n\n**What it costs.** Nothing.\n\n**If they push.** \"The end with the smaller distance from node 1 is the parent.\""
      },
      {
       "q": "6. What I would do with another hour",
       "a": "**Decided.** Check every labelled tree up to about n = 7, not only random ones, and print the query count against the bound.\n\n**Instead of.** Trusting 1,000 random trees.\n\n**Why.** Random trees hit the tight cases rarely. All small trees include every path, star and double star.\n\n**What it costs.** A Prufer sequence decoder, about ten lines.\n\n**If they push.** \"The random run already covers n from 1 to 50, 20 trees each.\""
      }
     ]
    }
   ]
  },
  {
   "id": "yours-q8",
   "title": "5. Q8 RandomizedSet",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem, as you might hear it.** Design a data structure with insert(val), remove(val) and getRandom(), each O(1) on average, where getRandom returns any element with equal probability. Then: what changes if duplicates are allowed? Then: what if elements have weights?"
    },
    {
     "t": "skim",
     "clarify": [
      [
       "Duplicates allowed?",
       "No: this design. Yes: a set of indices per value."
      ],
      [
       "Uniform over copies or values?",
       "With 5, 5, 7: over copies 5 is twice as likely."
      ],
      [
       "Average or worst-case O(1)?",
       "A hash map only promises average."
      ],
      [
       "Weights?",
       "They break O(1): pick the trade."
      ]
     ],
     "road": [
      [
       "Neither structure alone works.",
       "An array gives random access but O(n) remove; a map gives O(1) remove but no random access."
      ],
      [
       "Keep both.",
       "The array holds the values; the map holds value to index."
      ],
      [
       "Insert.",
       "Append, record the index."
      ],
      [
       "Remove: swap with the last.",
       "Copy the last element into the hole, fix its index in the map, pop the end."
      ],
      [
       "getRandom.",
       "A uniform index over a dense array is uniform over the values."
      ]
     ],
     "cost": "all three O(1) average · space O(n) · weighted: Fenwick O(log n) everything, or alias O(1) sampling with O(n) rebuilds",
     "limit": "Removing the last element itself: the swap must not write back the entry I am about to delete."
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
       "What do insert and remove return?",
       "True if it changed the set, else False",
       "Both look in the map first, so the False cases cost O(1)."
      ],
      [
       "What does getRandom do when empty?",
       "Raise",
       "randrange(0) raises ValueError. If they want None, it is one guard line."
      ],
      [
       "Is O(1) average or worst case?",
       "Average",
       "A list append is amortised O(1) and dict operations are average O(1). I say it so the claim is exact."
      ],
      [
       "Are duplicates allowed?",
       "No",
       "A list plus a dict from value to index."
      ],
      [
       "",
       "Yes, remove one copy",
       "The dict holds a set of indices per value. A counter says how many copies there are, not where."
      ],
      [
       "Uniform over what?",
       "Over copies (5, 5, 7: 5 twice as likely)",
       "The same array. Every slot is equally likely and 5 holds two slots."
      ],
      [
       "",
       "Over distinct values",
       "Keep a RandomizedSet of the distinct values and a count per value. Remove from the set when the count reaches 0."
      ],
      [
       "Do elements have weights?",
       "Small integers",
       "Store each value weight times. Memory grows with the total weight."
      ],
      [
       "",
       "Any weights, updates and samples both common",
       "A Fenwick tree over the weights: sample by a prefix-sum search, every operation O(log n)."
      ],
      [
       "",
       "Many samples, rare updates",
       "The alias method: O(1) a sample, O(n) to rebuild after any change."
      ],
      [
       "Several threads?",
       "Yes",
       "One lock around each operation. The swap in remove is several writes that another thread must not see half done."
      ],
      [
       "Does a test need a fixed seed?",
       "Yes",
       "Pass in a random.Random, so a test can seed it."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The crux.** A dense array for getRandom, plus a map from value to index so remove finds its slot in O(1). Remove does not shift: it copies the last element into the hole, fixes that element's entry in the map, and pops the end. With duplicates the map holds a set of indices per value, and the move updates that set. Weights break the O(1): there is no simple structure with exact sampling and O(1) updates, so the choice is O(log n) everything (Fenwick) or O(1) sampling with O(n) rebuilds (alias)."
    },
    {
     "t": "write",
     "id": "mercor-yours-q8-w",
     "q": "Try it first. Which two structures do you keep, how does remove stay O(1), and what changes with duplicates?",
     "starter": "Structures:\n\nremove:\n\nDuplicates:\n",
     "hint": "Which structure gives O(1) random access by index? Then how do you delete from the middle of it in O(1)?",
     "solution": "1. A dense array holds the values: only an array gives O(1) random access by index.\n2. A map from value to its index makes remove O(1): look the index up, do not scan.\n3. remove uses swap-with-last: copy the last element into the hole, fix its map entry, pop the end.\n4. With duplicates the map holds a set of indices per value. A counter is not enough: a count says how many copies exist, not where they are.\nEvery operation is O(1) on average. Weighted getRandom gives up O(1): Fenwick tree makes every operation O(log n).",
     "say": [
      "**Two pieces: a dense array for getRandom and a map from value to index for remove.** Remove swaps the last element into the hole, fixes its index in the map and pops the end, so everything is O(1) on average.",
      "With duplicates, the map stores a set of indices per value. For weights, exact sampling with O(1) updates does not exist: it is O(log n) everything with a Fenwick tree, or O(1) sampling with O(n) rebuilds with the alias method."
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q8-p",
     "title": "RandomizedSet and RandomizedCollection",
     "source": "Your Q8 write-up (Muse), run with Python 3",
     "d": "medium",
     "minutes": 25,
     "why": "Without duplicates, then with them. Your write-up said the code was spot-checked for uniformity but did not print it, so the tests here are written for this page.",
     "statement": "Write RandomizedSet with insert, remove and getRandom, each O(1) on average, then RandomizedCollection that allows duplicates.",
     "examples": [
      {
       "input": "insert 1, insert 2, insert 2, remove 1, remove 1, insert 3",
       "output": "True True False True False True",
       "note": "A repeated insert and a missing remove return False."
      }
     ],
     "constraints": [
      "standard library only",
      "O(1) on average",
      "getRandom is uniform"
     ],
     "starter": "class RandomizedSet:\n    ...",
     "hints": [
      "A list plus a dict from value to index. Remove by moving the last element into the hole."
     ],
     "solution": "import random\nfrom collections import defaultdict\n\n\nclass RandomizedSet:\n    def __init__(self):\n        self.nums = []\n        self.pos = {}\n\n    def insert(self, val):\n        if val in self.pos:\n            return False\n        self.pos[val] = len(self.nums)\n        self.nums.append(val)\n        return True\n\n    def remove(self, val):\n        if val not in self.pos:\n            return False\n        idx = self.pos[val]\n        last = self.nums[-1]\n        self.nums[idx] = last\n        self.pos[last] = idx\n        self.nums.pop()\n        del self.pos[val]\n        return True\n\n    def getRandom(self):\n        return self.nums[random.randrange(len(self.nums))]\n\n\nclass RandomizedCollection:\n    def __init__(self):\n        self.nums = []\n        self.pos = defaultdict(set)\n\n    def insert(self, val):\n        self.pos[val].add(len(self.nums))\n        self.nums.append(val)\n        return True\n\n    def remove(self, val):\n        if not self.pos[val]:\n            return False\n        idx = self.pos[val].pop()\n        if idx != len(self.nums) - 1:\n            last = self.nums[-1]\n            self.nums[idx] = last\n            self.pos[last].discard(len(self.nums) - 1)\n            self.pos[last].add(idx)\n        self.nums.pop()\n        return True\n\n    def getRandom(self):\n        return self.nums[random.randrange(len(self.nums))]\n",
     "complexity": "insert, remove and getRandom are O(1) on average. Space O(n).",
     "explain": [
      "RandomizedSet.remove copies the last element into the hole, updates its index in the map and pops the end. Deleting from the middle of a list would shift everything after it, O(n).",
      "RandomizedCollection keeps a set of indices per value and skips the move when the removed copy is already last.",
      "getRandom on an empty structure raises. Add a guard if the interviewer wants an empty answer."
     ],
     "tests": "from collections import Counter\n\nrandom.seed(7)\ns = RandomizedSet()\nprint(s.insert(1), s.insert(2), s.insert(2), s.remove(1), s.remove(1), s.insert(3))\nprint(sorted(s.nums), s.pos)\n\n# uniformity spot check: 3 values, 30,000 draws, each should be near 10,000\ns = RandomizedSet()\nfor v in (10, 20, 30, 40):\n    s.insert(v)\ns.remove(20)\ndraws = Counter(s.getRandom() for _ in range(30000))\nprint(\"set draws:\", sorted(draws.items()))\nassert all(9000 < c < 11000 for c in draws.values()) and 20 not in draws\n\n# duplicates: 5, 5, 7 -> 5 should come up about twice as often as 7\nc = RandomizedCollection()\nfor v in (5, 5, 7):\n    c.insert(v)\ndraws = Counter(c.getRandom() for _ in range(30000))\nprint(\"collection draws:\", sorted(draws.items()))\nassert 19000 < draws[5] < 21000 and 9000 < draws[7] < 11000\nprint(c.remove(5), c.remove(5), c.remove(5), c.nums)\nassert c.nums == [7] and c.pos[7] == {0}\n\n# random operations checked against a plain list\nref, c = [], RandomizedCollection()\nfor _ in range(5000):\n    v = random.randrange(6)\n    if random.random() < 0.55:\n        c.insert(v)\n        ref.append(v)\n    else:\n        ok = c.remove(v)\n        assert ok == (v in ref)\n        if ok:\n            ref.remove(v)\n    assert sorted(c.nums) == sorted(ref)\n    for val, idxs in c.pos.items():\n        assert all(c.nums[i] == val for i in idxs)\nprint(\"5000 random operations match a plain list\")\n"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3",
     "code": "True True False True False True\n[2, 3] {2: 0, 3: 1}\nset draws: [(10, 10061), (30, 9936), (40, 10003)]\ncollection draws: [(5, 19924), (7, 10076)]\nTrue True False [7]\n5000 random operations match a plain list"
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
       "Duplicates",
       "A set of indices per value; pick any copy with set.pop().",
       "Still O(1) on average, one set per value"
      ],
      [
       "Weighted getRandom",
       "A Fenwick tree over the weights, kept aligned with the array.",
       "Every operation O(log n)"
      ],
      [
       "Weighted, many samples and rare updates",
       "The alias method.",
       "O(1) a sample, O(n) rebuild per change"
      ],
      [
       "Remove a random element and return it",
       "Pick an index, swap with last, pop.",
       "O(1)"
      ],
      [
       "k distinct random elements",
       "random.sample(nums, k) on the array.",
       "About O(k) when k is small against n"
      ],
      [
       "Thread safe",
       "One lock around each operation.",
       "Callers wait for each other"
      ]
     ]
    },
    {
     "t": "faq",
     "title": "Push-backs, and what to say",
     "prose": true,
     "items": [
      {
       "q": "1. Why a list and a dict, not one of them?",
       "a": "**Decided.** A dense list for getRandom and a dict from value to index for remove.\n\n**Instead of.** A list alone, or a set alone.\n\n**Why.** Only an array gives O(1) random access by index. Only a map gives O(1) find by value. Each alone makes one operation O(n).\n\n**What it costs.** Two copies of each value's reference, so about twice the memory of one structure.\n\n**If they push.** \"A set with random.choice(list(s)) is O(n) a call.\""
      },
      {
       "q": "2. Why swap with the last element in remove?",
       "a": "**Decided.** Copy the last element into the hole, fix its map entry, pop the end.\n\n**Instead of.** list.remove, or pop(index) from the middle.\n\n**Why.** Deleting from the middle shifts everything after the hole: O(n). Swapping with the last keeps the array dense and costs O(1).\n\n**What it costs.** The order of the elements changes. getRandom does not care.\n\n**If they push.** \"If order mattered I would need a different structure.\""
      },
      {
       "q": "3. Why a set of indices per value, not a counter, for duplicates?",
       "a": "**Decided.** A dict from value to a set of indices.\n\n**Instead of.** A dict from value to a count.\n\n**Why.** A count says how many copies exist, not where they are, and remove must find one slot. set.pop() gives any index in O(1), and which copy goes does not matter.\n\n**What it costs.** A set object per distinct value.\n\n**If they push.** \"A count works only if the interviewer wants uniform over distinct values.\""
      },
      {
       "q": "4. Why skip the move when the removed copy is already last?",
       "a": "**Decided.** Check idx against the last slot first.\n\n**Instead of.** Always moving the last element.\n\n**Why.** If the removed copy is the last slot, there is nothing to move. Doing the move anyway would add that slot's index back into the value's set right before the slot is popped, leaving a stale index.\n\n**What it costs.** One comparison.\n\n**If they push.** \"The 5,000 random operations in the test check every index against the array.\""
      },
      {
       "q": "5. What does O(1) mean here?",
       "a": "**Decided.** O(1) on average.\n\n**Instead of.** Claiming O(1) worst case.\n\n**Why.** A list append is amortised O(1) and a dict lookup is O(1) on average. The array occasionally grows by copying.\n\n**What it costs.** A rare slow call.\n\n**If they push.** \"If they need worst case, I would preallocate and say it costs memory.\""
      },
      {
       "q": "6. Weighted: Fenwick or alias?",
       "a": "**Decided.** I say both, with the trade, and ask whether samples or updates dominate.\n\n**Instead of.** Claiming O(1) everything.\n\n**Why.** Expanding values into weight copies is O(total weight) memory. A Fenwick tree makes sample and update O(log n). The alias method samples in O(1) but rebuilds in O(n), so it wins only when updates are rare.\n\n**What it costs.** O(log n) on every operation, or an O(n) rebuild.\n\n**If they push.** \"There is research on dynamic samplers with near constant expected time. I would name it, not build it in thirty minutes.\""
      },
      {
       "q": "7. What I would do with another hour",
       "a": "**Decided.** A lock, a seedable random, and a Fenwick version of getRandom with a uniformity check.\n\n**Instead of.** Stopping at the unweighted code.\n\n**Why.** The follow-ups are threads and weights, and each has a small answer I can check.\n\n**What it costs.** About thirty lines.\n\n**If they push.** \"The uniformity check is a spot check: draws near n / 3 each, as in the test.\""
      }
     ]
    }
   ]
  }
 ]
});
