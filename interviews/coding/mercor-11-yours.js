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
     "text": "**The problem (Q1, solo coding hour, 60 minutes).** You are given experts (id to name and skills) and referrals, a list of (from_id, to_id) pairs meaning from_id will vouch for to_id. Edges are directed. The list may contain duplicates, self-loops and ids not present in experts. Honesty note from your write-up: this prompt is reconstructed from candidate reports of the Mercor onsite, not Mercor's actual prompt."
    },
    {
     "t": "p",
     "text": "**Part 1, build the graph (15 min).** build_graph(experts, referrals) returns an adjacency structure of your choice. Duplicate edges collapse to one. Self-loops are dropped. Edges touching an unknown id are dropped, and counted. Neighbors come out in a deterministic order."
    },
    {
     "t": "p",
     "text": "**Part 2, shortest referral path (20 min).** shortest_path(graph, start_id, target_id) returns the list of expert ids from start to target inclusive, using the fewest hops, by breadth-first search. If several shortest paths exist, return the one found first under your deterministic neighbor order. start_id == target_id returns [start_id]. Unreachable or unknown ids return []. It must terminate on cyclic graphs."
    },
    {
     "t": "p",
     "text": "**Part 3, rank reachable candidates (25 min).** rank_candidates(graph, experts, start_id, required_skills, max_hops) returns a ranked list of expert ids (excluding start_id) reachable within max_hops, each with its hop count and score. Score = 2 x (number of required skills the expert has) - hop_count. Sort by score descending, then hop_count ascending, then expert_id ascending. An expert with no matching required skill still appears, with its possibly negative score. max_hops = 0 returns []. Demo: a main() that prints the shortest path from e1 to e6 and the ranked candidates from e1 for [python, evals] within 3 hops. No stubbing: every function must run on the sample data."
    },
    {
     "t": "p",
     "text": "**Part 4, top-k referrers.** top_k_referrers(graph, k) returns the k people with the largest reach: everyone under them at any depth. You are given only this line. In the solo hour there is nobody to ask, so you decide and write the decision at the top of the code: reach excludes the person, ties break by id."
    },
    {
     "t": "p",
     "text": "**Part 5, influencers.** influencers(graph, k) picks k people who together reach the most people. Written down: greedy unique reach. Each pick is the person who adds the most people not already covered; stop early when nobody adds anyone. A follow-up some reports name is flow centrality: who sits between the most pairs. Written down: count the people strictly inside the one shortest path BFS finds for each pair."
    },
    {
     "t": "write",
     "id": "mercor-yours-q1-w",
     "q": "Try it first. Write how you would build it: the graph, the path and the ranking, and what you would say about why BFS and shortest path are two functions.",
     "starter": "Graph:\n\nShortest path:\n\nRanking:\n\nCost:\n",
     "hint": "One BFS gives parent and distance for every reachable node. The path is a walk back through the parents. The ranking reads the distances.",
     "solution": "1. build_graph: a dict of expert id to a sorted list of neighbours. Use a set while building so duplicates collapse. Drop self-loops and unknown ids, and count them.\n2. bfs_parents: one BFS records parent and hop count for every reachable node. The visited set stops cycles.\n3. shortest_path: no new traversal. Walk the parent chain from the target back to the start and reverse it.\n4. rank_candidates: reuse the hop counts from the same BFS. Score = 2 x matches - hops. Sort by score descending, hops ascending, id ascending.\n5. Scoring sits in its own class, so the formula can change without touching the graph or the traversal.\nCost: build O(E). BFS O(V + E) time, O(V) space. Ranking adds O(R log R) for R reachable candidates.",
     "say": [
      "**I built the graph as a dict of sorted neighbor lists, so duplicates collapse and traversal order is deterministic.** One BFS produces parent and distance maps; shortest path is a walk back through the parents, and ranking reuses the same distances.",
      "Scoring sits in its own class behind a simple interface, like a cache eviction policy, so weights, seniority or a learned scorer can change without touching the graph or the traversal. At scale I would return top-k with a heap and cache traversals per source instead of precomputing all pairs."
     ]
    },
    {
     "t": "faq",
     "title": "Your thinking, the cases and what to say",
     "prose": true,
     "items": [
      {
       "q": "BFS and shortest path are two functions, and they do reuse each other",
       "a": "They answer different questions. BFS is a traversal: starting from one node, it visits every reachable node in increasing hop order and records facts along the way. Shortest path is a query: given two nodes, return the actual route between them.\n\nBFS alone does not hand you a path. It hands you a parent map: for every node, the node you arrived from. Because BFS reaches each node by the fewest hops first, following parent links from the target back to the start rebuilds a shortest path. That walk-back is all shortest_path does. It never traverses the graph itself.\n\nThe one-sentence version for the review: BFS computes parent and distance for every reachable node once; shortest_path and ranking are both cheap read-outs of that single traversal.\n\nWhy not merge them into one function? Reuse: one BFS from a start node serves the path query, the ranking query and any distance query. Testability: the parent map can be checked on its own, and the walk-back can be checked on a hand-made parent map with no graph at all. Termination: the visited set lives in BFS, in one place, so every caller inherits cycle safety, and this graph has cycles (e2 -> e3 -> e2)."
      },
      {
       "q": "Parts 4 and 5: what I decided, and why greedy",
       "a": "There is no one to clarify with, so each undefined word gets a one-line decision in a comment at the top of the code, and the code follows it. Reach is BFS from the person, minus the person. Top-k sorts by reach descending, then id, so it is deterministic.\n\nInfluencers: picking the k people who together cover the most is set cover, which is hard to solve exactly. Greedy is the standard answer: take whoever adds the most new people, add them and everyone under them to covered, repeat. It is a few lines, it is explainable, and it is known to be close to the best. The trap is ranking by plain reach: two people with big reach who cover the same people waste a pick.\n\nFlow centrality, if it comes up: for every pair, walk back the BFS path and count the people in the middle. Say aloud that this counts one shortest path per pair, not all of them, and that counting all of them (Brandes) is the next step if they want it."
      },
      {
       "q": "What the built graph looks like, and the dictionary moves",
       "a": "The graph is a plain dictionary: outer key is an expert id, value is the sorted list of ids that expert vouches for. For the sample data, after duplicates collapse and the self-loop and unknown-id edge are dropped: e1: [e2]; e2: [e3, e6]; e3: [e2, e4]; e4: [e6]; e5: [e4]; e6: []. So graph[\"e2\"] is [\"e3\", \"e6\"], everyone Ben vouches for, in sorted order. Sorted order is what makes BFS deterministic: the same input always produces the same path and the same ranking.\n\ngraph.get(node, []) gives the neighbors of a node, or an empty list if the node has no entry. No KeyError, no if-check first.\n\n{eid: set() for eid in experts} starts every expert with an empty neighbor set, including experts nobody refers to, so e6 exists in the graph with no outgoing edges. graph.setdefault(src, set()) is the alternative to pre-filling: it returns the neighbor set for src, creating an empty one first if src has no entry yet.\n\nA set for neighbors while building: adding a duplicate edge to a set is a no-op, so deduplication costs no code. set(expert[\"skills\"]) & set(required_skills) is set intersection, the skills both sides share. Its length is the match count in the score."
      },
      {
       "q": "Edge cases handled, and the one lambda",
       "a": "Handled in code: duplicate edges, self-loops, unknown ids on either end, start equal to target, unreachable target, cycles, experts with no outgoing edges, max_hops = 0, and no-match experts kept in the ranking with negative scores rather than filtered.\n\nThe lambda key=lambda row: (-row[2], row[1], row[0]) sorts each (id, hops, score) row by score descending (the minus sign flips it), then hops ascending, then id ascending. A lambda is a small anonymous function used once, inline."
      },
      {
       "q": "How the scoring works, in four cases",
       "a": "With required skills [python, evals] and score = 2 x matches - hops: A, ideal and close (2 matches, 1 hop) scores 3. B, ideal and far (2 matches, 3 hops) scores 1. C, misaligned and close (0 matches, 1 hop) scores -1. D, misaligned and far (0 matches, 3 hops) scores -3.\n\nRanking: A ahead of B ahead of C ahead of D. The line that matters is B beating C: one matching skill is worth 2 hops in this formula, so skill beats proximity. That is a product decision, not a math truth. If the product wanted proximity to win, the hop weight goes up. Say exactly that in the review.\n\nAdding seniority changes one term, nothing else: score = 2 x matches - hops + seniority bonus, with senior +1, mid 0, junior -1. It is one extra term inside the scorer class. BFS, the graph and the sort never see it.\n\nNo NLP libraries are needed, and that is a deliberate choice. Skills here are structured tags, not free text, so matching is set intersection and seniority is a number: deterministic arithmetic. That determinism is what you want when a score feeds an evaluation endpoint. NLP would only enter if skills arrived as free text (\"built LLM evals\" versus \"evals\"), and even then the first move is a synonym map, not a library. Embeddings would make scores non-reproducible, which is the opposite of what this system needs."
      },
      {
       "q": "Scalability and extensibility",
       "a": "Three abstractions, each behind an interface. Scorer as a policy class: as a cache abstracts its eviction policy (LRU, LFU), ranking abstracts its scoring policy. Swap SimpleScorer for SeniorityScorer, or a learned model later, without touching traversal. That buys isolated unit tests, weight tuning without code changes and A/B testing of ranking policies in production.\n\nGraph store behind an interface: BFS only ever asks one question, give me the neighbors of this node. The in-memory dict is one implementation; a database or graph store is another, fetching neighbors per node instead of loading the whole graph.\n\nTraversal as a parameter: referrals are unweighted today, so BFS is right. If referrals ever gain weights (strength of vouch), swap the queue for a heap and BFS becomes Dijkstra, with ranking and scoring untouched.\n\nScaling the computation itself. Top-k with a heap: if only the top 10 are shown, do not sort all V candidates; a bounded heap gives O(V log k) instead of O(V log V). One BFS, many answers: the parent and distance maps from a single BFS answer every path and ranking query from that source. Cache them per source; never precompute all-pairs paths, because referrals change and stale caches are the production bug. Incremental updates: a new referral edits one adjacency entry, so invalidate only the cached traversals whose source can reach that edge. Early exit: for a single path query, BFS can stop the moment the target is first reached, since it is already shortest. Ranking cannot early-exit; it needs the full neighborhood up to max_hops."
      },
      {
       "q": "Complexity",
       "a": "Build: O(E). BFS: O(V + E) time, O(V) extra space for queue, visited, parent and distance. Ranking adds an O(R log R) sort over R reachable candidates."
      }
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q1-p",
     "title": "Referral network, the full library and demo (parts 1 to 5)",
     "source": "Your Q1 write-up (Muse), run with Python 3.12",
     "d": "medium",
     "minutes": 60,
     "why": "The complete running solution from your write-up. Try the box above first, then open the solution to compare.",
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
     "solution": "from collections import deque\n\n\ndef build_graph(experts, referrals):\n    # graph is a dict: expert_id -> set of neighbor ids.\n    # A set is used while building so duplicate edges collapse for free.\n    graph = {eid: set() for eid in experts}\n    dropped = 0\n    for src, dst in referrals:\n        if src == dst:  # self-loop: drop\n            dropped += 1\n            continue\n        if src not in experts or dst not in experts:\n            dropped += 1  # unknown id: drop\n            continue\n        graph[src].add(dst)  # duplicate adds are no-ops\n    # Convert sets to sorted lists: deterministic neighbor order,\n    # so BFS results are reproducible run after run.\n    return {eid: sorted(n) for eid, n in graph.items()}, dropped\n\n\ndef bfs_parents(graph, start_id):\n    # BFS explores in increasing hop order, so the first time\n    # we reach a node we used the fewest possible hops.\n    # parent[child] = the node we came from. Walking parent\n    # links back to start_id rebuilds the path.\n    queue = deque([start_id])\n    visited = {start_id}  # visited stops cycles looping forever\n    parent = {start_id: None}\n    dist = {start_id: 0}\n    while queue:\n        node = queue.popleft()\n        for nbr in graph.get(node, []):\n            if nbr not in visited:\n                visited.add(nbr)\n                parent[nbr] = node\n                dist[nbr] = dist[node] + 1\n                queue.append(nbr)\n    return parent, dist\n\n\ndef shortest_path(graph, start_id, target_id):\n    # This does NOT traverse again. It reuses bfs_parents,\n    # then walks the parent chain from target back to start.\n    if start_id not in graph or target_id not in graph:\n        return []\n    if start_id == target_id:\n        return [start_id]\n    parent, _dist = bfs_parents(graph, start_id)\n    if target_id not in parent:\n        return []\n    path = []\n    node = target_id\n    while node is not None:\n        path.append(node)\n        node = parent[node]\n    path.reverse()\n    return path\n\n\nclass SimpleScorer:\n    # The scoring policy, abstracted into its own class, the\n    # same move as abstracting a cache eviction policy behind\n    # an interface. rank_candidates only calls .score(...);\n    # it never knows the formula.\n    def score(self, expert, hops, required_skills):\n        have = set(expert[\"skills\"])\n        matches = len(have & set(required_skills))\n        return 2 * matches - hops\n\n\nclass SeniorityScorer(SimpleScorer):\n    # Extension: swap this in and ranking changes, while\n    # build_graph, BFS and shortest_path stay untouched.\n    BONUS = {\"senior\": 1, \"mid\": 0, \"junior\": -1}\n\n    def score(self, expert, hops, required_skills):\n        base = super().score(expert, hops, required_skills)\n        return base + self.BONUS.get(expert.get(\"seniority\", \"mid\"), 0)\n\n\ndef rank_candidates(graph, experts, start_id, required_skills,\n                    max_hops, scorer=None):\n    if max_hops == 0 or start_id not in graph:\n        return []\n    scorer = scorer or SimpleScorer()\n    _parent, dist = bfs_parents(graph, start_id)\n    ranked = []\n    for eid, hops in dist.items():\n        if eid == start_id or hops > max_hops:\n            continue  # no-match experts still appear; see loop\n        s = scorer.score(experts[eid], hops, required_skills)\n        ranked.append((eid, hops, s))\n    # score desc, then hops asc, then id asc: a total order\n    ranked.sort(key=lambda row: (-row[2], row[1], row[0]))\n    return ranked\n\n# ---- Part 4 and 5: top-k referrers and influencers ----\n# Decided and written down (solo round, nobody to ask):\n# - reach = how many people sit under a person, at any depth (BFS, self not counted)\n# - top-k ties break by id, so the answer is the same every run\n# - influencers = greedy unique reach: each pick adds the most people not yet covered,\n#   counting the pick themselves\n\n\ndef reach(graph, start_id):\n    _parent, dist = bfs_parents(graph, start_id)\n    return len(dist) - 1  # dist includes start_id itself\n\n\ndef top_k_referrers(graph, k):\n    rows = [(eid, reach(graph, eid)) for eid in graph]\n    rows.sort(key=lambda row: (-row[1], row[0]))  # reach desc, id asc\n    return rows[:k]\n\n\ndef influencers(graph, k):\n    # who each person reaches, computed once\n    under = {}\n    for eid in graph:\n        _parent, dist = bfs_parents(graph, eid)\n        under[eid] = set(dist)  # includes eid: a pick covers themselves\n    covered, picked = set(), []\n    for _ in range(k):\n        best, best_gain = None, 0\n        for eid in sorted(graph):  # sorted: ties go to the smaller id\n            if eid in covered:\n                continue\n            gain = len(under[eid] - covered)\n            if gain > best_gain:\n                best, best_gain = eid, gain\n        if best is None:\n            break  # nobody adds anyone new\n        picked.append((best, best_gain))\n        covered |= under[best]\n    return picked\n\n\n# ---- Follow-up: flow centrality ----\n# Decided: count, for every pair (s, t), the people strictly between them on the\n# one shortest path BFS finds. Not every shortest path, which is heavier to count.\ndef flow_centrality(graph):\n    count = {eid: 0 for eid in graph}\n    for s in graph:\n        parent, dist = bfs_parents(graph, s)\n        for t in dist:\n            if t == s:\n                continue\n            node = parent[t]\n            while node != s:  # walk back, counting the middle people\n                count[node] += 1\n                node = parent[node]\n    return sorted(count.items(), key=lambda row: (-row[1], row[0]))",
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
     "title": "Output, run with Python 3.12",
     "code": "graph: {'e1': ['e2'], 'e2': ['e3', 'e6'], 'e3': ['e2', 'e4'], 'e4': ['e6'], 'e5': ['e4'], 'e6': []}\ndropped edges: 2\npath e1->e6: ['e1', 'e2', 'e6']\npath e1->e1: ['e1']\npath e1->e5: []\nranked from e1 for ['python', 'evals'] within 3 hops:\n  e2 hops=1 score=1\n  e4 hops=3 score=1\n  e3 hops=2 score=0\n  e6 hops=2 score=0\ntop 3 referrers by reach: [('e1', 4), ('e2', 3), ('e3', 3)]\ninfluencers, k=2: [('e1', 5), ('e5', 1)]\nflow centrality: [('e2', 4), ('e3', 2), ('e4', 1), ('e1', 0), ('e5', 0), ('e6', 0)]"
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
     "text": "**The problem (Q2, algorithms round, 30 minutes, discussion only).** You are given a list of exchange rates. Each rate is a triple [from, to, rate], meaning 1 unit of from equals rate units of to. For example [USD, GBP, 0.77] means 1 USD = 0.77 GBP. Given the rates, a source currency and a target currency, return the exchange rate from source to target. You may chain through intermediate currencies, and you may use a rate in reverse by taking its reciprocal. The table is consistent, so the answer is unique apart from floating-point rounding."
    },
    {
     "t": "p",
     "text": "**Rules.** If source equals target, return 1.0, even if neither currency appears in the rates. If no chain of rates connects source to target, return -1.0. Positive answers are accepted within a relative error of 1e-6. Constraints: len(rates) is at most 10000; currency codes are 3 letters; each given rate is between 1e-3 and 1e3; exact answers lie between 1e-9 and 1e9. Example: rates [[USD, GBP, 0.77], [GBP, EUR, 1.2]], source USD, target EUR gives 0.924. Be ready to explain chained conversions, unknown or unreachable currencies, and the time and space complexity. Honesty note from your write-up: reconstructed from candidate reports, not a leaked Mercor paper."
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
     "t": "faq",
     "title": "Your thinking, the traps and what to say",
     "prose": true,
     "items": [
      {
       "q": "The one insight to say out loud, and how to think about it in order",
       "a": "Consistency is what makes this easy, not the absence of cycles. Cycles do exist (A to B to A, via the reciprocal edge). What saves the math is that the product around any cycle is 1, because a rate times its reciprocal is 1. So every path from source to target multiplies to the same answer. You do not need a shortest path at all. You need any path, plus its product.\n\nIn order: 1. Model it as a graph. Currencies are nodes. A rate is a weighted edge. The weight is the multiplier, not a distance.\n\n2. Make it bidirectional. For every given A to B at rate r, also add B to A at 1 / r. That single move is what lets you traverse D to C when only C to D was given.\n\n3. Find any path. BFS (or DFS) from source. Consistency guarantees the product is the same whichever path you find.\n\n4. Recover the product. Track each node's parent and the edge rate into it. Walk back from target to source, multiplying as you go.\n\n5. Handle the edges of the problem. Source equals target: 1.0. Unknown currency or unreachable target: -1.0."
      },
      {
       "q": "What the graph actually looks like, and what setdefault does",
       "a": "It is a nested dictionary. The outer key is a currency. Its value is another dictionary: neighbor currency to the rate for that hop. For rates USD to GBP 0.77, GBP to EUR 1.2, EUR to INR 90.0 the built graph is: USD: {GBP: 0.77}; GBP: {USD: 1.2987, EUR: 1.2}; EUR: {GBP: 0.8333, INR: 90.0}; INR: {EUR: 0.0111}. Read it as: graph[\"GBP\"][\"EUR\"] is 1.2, and graph[\"EUR\"][\"GBP\"] is 1 / 1.2 = 0.8333. Every lookup you will ever do in BFS is of exactly that shape: give me the inner dict for this node, then iterate its items.\n\ngraph.setdefault(src, {}) means: give me the neighbors dict for src, and if src has no entry yet, create an empty dict for it first, then give me that. It returns the inner dict, so [dst] = rate writes the edge straight into it. Without it you would write the same check by hand every time: if src not in graph: graph[src] = {} and then graph[src][dst] = rate. The alternative is defaultdict(dict), which creates the inner dict automatically. setdefault is more explicit about what is happening, which is why it reads better when you are explaining code out loud.\n\nThe confusion this removes: there are only ever two levels. Level 1: currency to its neighbors dict. Level 2: neighbor to rate. If you feel lost mid-traversal, ask: am I holding a node (a string), an inner dict, or a rate (a float)? Every variable in the solution is one of those three."
      },
      {
       "q": "Why parent tracking, instead of carrying the product in the queue?",
       "a": "Both work. Carrying (node, product_so_far) in the queue is shorter. Parent tracking was chosen deliberately, for three reasons you can defend.\n\nYou can show the path. The parent map reconstructs USD to GBP to EUR, not only 0.924. In a finance system that chain is an audit trail.\n\nOne BFS answers every target. The parent map holds a path to every reachable node, so repeat queries from the same source are free.\n\nIt separates concerns. Traversal finds structure; the walk-back does arithmetic. Each half is testable on its own."
      },
      {
       "q": "Two traps, corrected",
       "a": "Tempting claim: there are no cycles, so the math works. Why it is wrong: cycles exist the moment you add reciprocal edges, A to B to A. Consistency is what saves you, since the product around any cycle is 1. If the table were ever inconsistent, no path would be trustworthy.\n\nTempting claim: Dijkstra will not work because the graph is bidirectional. Why it is wrong: bidirectionality is irrelevant to Dijkstra. Dijkstra fails here because it minimizes sums and your cost is a product. Taking logs turns products into sums, but log(rate) is negative when rate is below 1, so plain Dijkstra still breaks. And it is unnecessary: consistency means any path is correct.\n\nAnd the reverse-edge worry, settled: yes, when you step A to B, B's neighbor list contains A again at the reciprocal rate. You never follow it back, because A is already in visited. No special do-not-go-back logic is needed. The visited set is that logic."
      },
      {
       "q": "Complexity",
       "a": "build_graph: O(E) time, O(V + E) space, two directed edges per rate. bfs_parents: O(V + E) time, O(V) for queue, visited and parent. Walk-back: O(path length), at most O(V), O(1) space. Overall per query O(V + E) time and space.\n\nWith at most 10,000 rates, that is at most 20,000 directed edges. BFS here is trivially fast. Say so plainly, then pivot: the interesting scaling questions are about many queries, changing rates and where the graph lives."
      },
      {
       "q": "Scalability and extensibility",
       "a": "Build once, query many times. As written, get_rate rebuilds the graph on every call. In a real service you build it once, hold it, and each query pays only for its BFS. Go one step further and cache the parent map per source: ten queries from USD become one BFS, because that one map already contains the path, and therefore the product, to every reachable currency.\n\nHide the store behind one question. BFS only ever asks: give me the neighbors of this node. Put that behind an interface, a neighbors(node) method, and the in-memory nested dict becomes one implementation. A database-backed store, where neighbors are fetched per node instead of loading the whole graph, becomes another. BFS itself never changes.\n\nHandle rates changing. Real rates update constantly. Add add_rate and remove_rate that edit one edge pair in place instead of rebuilding everything, and invalidate any cached parent map whose source could reach that edge. In production, stale rates, not raw speed, are the bug that costs money.\n\nMind precision at scale. Floats drift over long chains, which is why the tolerance exists. For real money you would switch to Decimal, or work in log space where products become sums and long chains stay numerically tame.\n\nThe extension that reuses everything: arbitrage. The whole solution rests on consistency. If the table ever stops being consistent, different paths give different answers, and the same graph now supports a new question: is there free money? In log space, an inconsistent cycle becomes a negative cycle, and Bellman-Ford finds it. Same graph, same build, new traversal.\n\nWhat else abstracts cleanly. Traversal strategy: BFS today; because consistency makes path choice irrelevant, DFS or an iterative deepening variant could be swapped in behind the same bfs_parents-shaped contract. Path reconstruction: returning the chain alongside the rate is a separate small function over the parent map. Validation at build time: reject non-positive rates and malformed codes inside build_graph, in one place."
      },
      {
       "q": "Review checklist: say these before they ask",
       "a": "Consistency, not acyclicity, is the load-bearing assumption.\n\nThe visited set, not special-case code, prevents the A-B-A loop.\n\nDijkstra is the wrong tool because the cost is a product, not a sum.\n\nParent tracking buys you the path, the audit trail and all-targets-from-one-BFS.\n\nFloat dust is expected; the 1e-6 tolerance absorbs it; Decimal is the production answer.\n\nScale story: build once, cache per source, hide the store, invalidate on rate change.\n\nExtension story: an inconsistent table means arbitrage, found with Bellman-Ford in log space."
      }
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q2-p",
     "title": "Exchange rate via chained conversions, the full solution",
     "source": "Your Q2 write-up (Muse), run with Python 3.12",
     "d": "medium",
     "minutes": 30,
     "why": "Four pieces: build the graph, BFS that records parents, get_rate that walks them back, and main. Try the box above first.",
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
     "title": "Output, run with Python 3.12",
     "code": "0.9239999999999999\n1.0822510822510822\n83.16\n1.0\n-1.0"
    }
   ]
  },
  {
   "id": "yours-q4",
   "title": "3. Q4 The comparator that lies (faulty comparator)",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem (Q4, algorithms round, discussion only, about 30 minutes, no code).** You need to sort a list of items. You have a comparison function that tells you which of two items is bigger, but it is faulty: it gives the wrong answer some of the time. How do you sort the list? That is the whole question. What the items are, how often it is wrong, whether the wrongness is random or repeatable, whether you can see the values and what a comparison costs are all left for you to ask. The notes come from your 14-page mock interview story; it has no code, so there is no code block in this section."
    },
    {
     "t": "write",
     "id": "mercor-yours-q4-clarify-w",
     "q": "Try it first. Write the clarifying questions you would ask before designing anything, and what each answer would change.",
     "starter": "1. \n2. \n3. \n4. \n",
     "hint": "The most important one: if I compare the same pair twice, do I get the same answer? Then what other truth I have, how exact the order must be, and what a call costs.",
     "solution": "Random or repeatable? Repeatable and deterministic. Same pair, same wrong answer, every time. It is a systematic fault, logic that is wrong on some cases, not noise or corruption in transit.\nAny other source of truth? No. You cannot see the values. You may call the comparator on any pair, as often as you like.\nHow exact? Fully sorted, exact order. Assume a true total order exists underneath the faults.\nCost of a comparison? Not fixed by the question. Treat count as the currency: state your cost assumption out loud, and say how your answer changes if calls are slow.\nDeterminism kills retry-and-vote. No oracle kills validation against truth. Whatever survives has to detect wrongness using only the comparator arguing with itself.",
     "why": "The first answer decides the whole plan: random faults can be voted away, repeatable ones cannot.",
     "say": [
      "**Before I design anything, the answer depends entirely on how it is faulty.** Can I ask a few things about the fault, what I am allowed to use, and how exact the result needs to be?",
      "That one move buys thinking time without stalling, signals that you know underspecification is where real systems break, and hands the interviewer the role they expect to play in this round: answering, narrowing, and watching how you update."
     ]
    },
    {
     "t": "write",
     "id": "mercor-yours-q4-w",
     "q": "Try it first. With deterministic faults and no oracle, write your whole answer: the model, how you detect lies, what you do about them, the cost and the limit.",
     "starter": "Model:\n\nDetection:\n\nRepair:\n\nCost:\n\nLimit:\n",
     "hint": "Transitivity is the only validator. What shape does a contradiction take in a graph of claims? What does one cycle prove, and what can it not tell you?",
     "solution": "1. Clarify the error model. Deterministic faults, no oracle, exact order wanted, comparison count is the cost.\n2. Sort through the comparator. Merge sort, O(n log n) comparisons. Record every comparison made.\n3. Build the directed graph: edge A to B means A bigger than B, per the comparator.\n4. Find the cycles. Each cycle proves at least one faulty edge inside it.\n5. Score edges by cycle participation. Reverse the highest-scoring edge. Rebuild and repeat until the graph is acyclic. This is a greedy approach to minimum feedback arc set.\n6. Topologically sort the now-acyclic graph.\n7. Spend extra comparisons only around previously cyclic regions. Do not pay O(n squared) everywhere by default.\n8. Close with the limit: consistent chains of faults create no cycles and are undetectable. Guarantee consistency; claim exact truth only under a stated bound on the number of faults.",
     "say": [
      "**First I clarify the fault: it is deterministic, so retrying never helps, and there is no oracle, so I can only catch the comparator contradicting itself.** I model comparisons as a directed graph. A true order has no cycles, so a cycle proves a lie inside it.",
      "I sort in n log n, build the graph, score edges by how many cycles they sit in, flip the worst, and repeat until it is a DAG, then topological sort is my order. That is minimum feedback arc set, which is NP-hard, so the greedy score is the practical answer. And I am honest about the limit: faults that agree with each other form no cycle, so exact recovery needs a bound on how many faults there are."
     ]
    },
    {
     "t": "faq",
     "title": "Your story, branches and Q&A",
     "prose": true,
     "items": [
      {
       "q": "What round this is, and how to use the story",
       "a": "This is not the coding round and not system design. The Mercor algorithms block is about 30 minutes, verbal, discussion only. No code is written. The interviewer is listening for how you clarify an underspecified problem, how you model it, how you reason about cost and scalability, and whether you are honest about what cannot be solved. A perfect construction delivered without the limits scores worse than a good construction with the limits named clearly.\n\nRead the story once, end to end. It follows the exact path of a real attempt: the question, the clarifying questions, the interviewer answers, the first ideas that fail, the linked list that becomes a directed graph, the cycle that proves a lie, and the moment when you realise the cycle cannot tell you which edge is the lie. Then rehearse from the back: the 30-second answer, the branch map and the Q&A. In the room you will not recite this; you will walk the same path, faster, out loud.\n\nThe one sentence to carry in: transitivity is your only validator. Everything here, the graph, the cycles, the flipping, the cost and the honest limit, follows from that single fact."
      },
      {
       "q": "The question as you will hear it, and your opening 20 seconds",
       "a": "There is no handout, no starter code, and no Part 1 and Part 2. The interviewer says it in one breath, roughly: You need to sort a list of items. You have a comparison function that tells you which of two items is bigger, but it is faulty. It gives the wrong answer some of the time. How do you sort the list?\n\nNotice what is missing: what the items are, how often it is wrong, whether the wrongness is random or repeatable, whether you can see the values, whether exact order matters, and what a comparison costs. None of that is an accident. The gaps are the test. A candidate who starts sorting immediately has failed the first minute. A candidate who starts asking has passed it.\n\nDo not fill the silence with a sort. Say what you heard, then clarify. Why the question is built this way: in production, comparators really do lie, such as a buggy ranking function, a stale ML scorer, a human labeler with a bias, or a service returning cached judgments. Nobody hands you the error model. Eliciting it is the job the question is simulating."
      },
      {
       "q": "The four clarifications, and why each matters",
       "a": "1. Is the fault random or repeatable? If I compare the same pair twice, do I get the same answer both times, or can it change? This is the most important question in the round. Random faults can be averaged away with repetition and majority vote. Repeatable faults cannot: asking again returns the same lie, so repetition is worthless and you need a completely different weapon.\n\n2. Can I see the values, or is the comparator my only window? If you could inspect the values, there would be no problem at all. The question only exists if the comparator is all you have.\n\n3. How exact does the order need to be? Exact total order, or approximately sorted, top-k correct, small displacements tolerated? Exactness decides whether a heuristic answer is a solution or a failure.\n\n4. What does a comparison cost, and how many can I make? Cheap and unlimited, or slow, paid or rate-limited? The cost model decides whether you minimise the number of calls first, or spend calls freely to buy certainty."
      },
      {
       "q": "Second-wave questions, and the fork each answer creates",
       "a": "What does wrong look like, a flipped answer, or can it also say equal? A comparator that only flips is a cleaner problem than one that can also collapse distinct items into ties. Ties break the total-order assumption your graph will rely on.\n\nIs there a bound on how many comparisons are wrong, at most k, or some fraction? This decides whether exact recovery is even possible. Few errors: cycles will betray them and repair is realistic. Unbounded errors: no algorithm can promise the true order, and the honest answer becomes a best-effort ranking plus that admission.\n\nAre the faults clustered or spread out? A comparator wrong only on a narrow family of items leaves most of the order trustworthy and concentrates suspicion. Faults spread evenly are the worst case.\n\nDo I sort once, or does this run repeatedly on new batches? Repeated batches let you learn: log suspect pairs, build evidence across runs, and eventually fix or route around the faulty cases.\n\nHow to ask without stalling: ask the first four, start working, and let the second wave arrive naturally as your design needs each answer. Interviewers read a long upfront interrogation as avoidance. They read a question asked at the exact moment the design forks as engineering.\n\nThe forks. Faults random per call: repeat each comparison, take majority vote, then sort normally; the graph is unnecessary. Faults deterministic (the real case): repetition is useless, so model comparisons as a graph and use transitivity. Approximate order acceptable: sort once, repair only the cycles you find, ship. At most k comparisons wrong: exact recovery becomes a real target, so find the smallest set of flips that removes every inconsistency."
      },
      {
       "q": "Two honest dead ends come first",
       "a": "Chapter 1: I will log the bad ones and flip them. The first instinct sounds like production engineering: keep using the faulty comparator, log the comparisons it gets wrong, flip those results, cache the corrected answers, and validate in batches. It collapses on one question from the interviewer: how do you know a comparison was wrong? The comparator only gives you its answer. Nothing tells you it lied. There is no flag on a wrong answer. A lie from this comparator looks exactly like the truth. And the cache makes it worse, because the fault is deterministic, so the cache faithfully stores and replays the same wrong answer forever. Say this out loud when you see it: naming why your own idea fails is scored, not penalised.\n\nChapter 2: I will compare the values myself. The second instinct is to step around the comparator: 3 is bigger than 2, 100 is bigger than 5, use math. The interviewer closes this door in one line: if you can see the values, you do not need a comparator and there is no problem. The premise is that you cannot. The items might be documents ranked by relevance, candidates ranked by a model, products ranked by a black-box service.\n\nWhat the dead ends teach: you have exactly one instrument, it sometimes lies, its lies are repeatable, and no alarm rings when it lies. So detection can only come from the comparator contradicting itself. Where can a comparator contradict itself? Only across multiple comparisons, never inside a single one. That is the doorway to the real solution."
      },
      {
       "q": "The linked list that had to become a graph",
       "a": "Chapter 3: start with chains, then watch them break. The natural first model is a linked list. Compare A and B, link them in order. Compare C and D, start a second chain. Soon you hold several ordered chains, and merging chains is familiar work. Then you compare A against D, two items from different chains. A chain can only say what sits next to what. But this comparison relates items with other items in between, and future comparisons will keep cutting across chains like that. The structure you need is not a set of chains. It is a network of relations.\n\nChapter 4: the directed graph. Upgrade the model, and say the upgrade out loud: a linked list is too weak for this. Every comparison is a relation between any two items, so I need a directed graph. Each item is a node. If the comparator says A is bigger than B, I draw an edge from A to B. The graph is the record of everything the comparator has claimed. It stores claims, not truth, which is exactly why its shape can expose a lie.\n\nTwo properties now do all the work. A true total order, drawn this way, is a directed acyclic graph: edges flow consistently from bigger to smaller and can never loop back. And a true order is transitive: if A beats B and B beats C, then A must beat C. Your graph inherits both tests for free."
      },
      {
       "q": "A cycle is the sound of the comparator lying",
       "a": "Ask the interviewer's own Socratic question before they ask you: if the comparator says A is less than B, and B is less than C, what must it say about A and C? It must say A is less than C. If it says anything else, it has contradicted itself, and a contradiction is detectable without any oracle, because a true order cannot contain one.\n\nIn graph language, a contradiction is a cycle. Follow the edges around and you return to where you started, which would mean an item is bigger than itself. That is impossible in any real ordering.\n\nThe central fact of the whole question: if the graph has a cycle, at least one edge in that cycle is a faulty comparison. No exceptions. And cycles are the only evidence of faultiness you can ever obtain, because they are the only way the comparator can disagree with itself. Example: A beats B, B beats C, but C beats A. All three cannot be true. At least one edge is a lie, even though no single comparison looked wrong.\n\nThis is also where your spanning-tree instinct belongs. A tree has no cycles, so a cycle-free skeleton of your graph is at least self-consistent. But a tree throws away exactly the redundant edges that create cycles, and the redundancy is the evidence. Keep the full graph for detection; use tree-like, acyclic structure only at the end, when you extract the final order.\n\nHow do you find cycles in the room? Name a method plainly: depth-first search watching for a back edge, or repeated topological removal, peeling off nodes with no incoming edges; whatever remains is trapped in cycles. You will not implement it. Naming a correct method is enough for a verbal round."
      },
      {
       "q": "The cycle accuses everyone in it, and no one",
       "a": "Chapter 6: so I reverse the edge that closed the cycle. The next instinct is tidy: when a new comparison creates a cycle, that new edge must be the faulty one, so reverse it. It survives about five seconds. The cycle only proves that at least one edge in the loop is wrong. The edge that closed the cycle might be the only truthful one, and the lie might be an older edge you trusted and built on. As you put it in the mock: it is not necessarily the new one, maybe some other edge in the circle needs reversal.\n\nSay exactly that in the room, because it converts a wrong move into a strong one. The cycle gives you a suspect set, not a culprit. Any single-edge flip inside the cycle breaks that cycle, but flipping the wrong edge fixes the shape while corrupting the order, and the graph cannot tell you that you did it. Detection is certain. Identification is inference. Keep those two words separate throughout the interview; conflating them is the main way candidates overclaim on this question.\n\nChapter 7: the shared-edge insight, your best idea in the session. Suppose you collect many comparisons and the graph contains three cycles. Some edges sit in only one cycle. But imagine one edge sits in two of the three, so every loop of contradiction passes through it. Reversing that single edge breaks both cycles at once. An edge that explains the most contradictions is the most likely lie.\n\nSay: score every edge by how many cycles it participates in. Flip the highest-scoring edge first, rebuild, and repeat until no cycles remain. One flip that resolves multiple cycles is more likely to be the true fault than a flip that resolves only one.\n\nThis heuristic has a principled name, and naming it elevates the answer: you are looking for the minimum feedback arc set, the smallest set of edges whose reversal makes the graph acyclic. Under the assumption that faults are rare, the smallest explanation is the best bet. Be ready for the follow-up, because it always comes: that problem is NP-hard in general. So the honest production answer is the heuristic, cycle-participation scoring, greedy flipping, re-checking, not an exact search."
      },
      {
       "q": "The logistics: what it costs, and the honest limit",
       "a": "First, correct the cost of sorting itself. Merge sort does not cost log n comparisons. It costs O(n log n): log n levels of merging, n comparisons per level. And that is not merge sort being wasteful: any comparison-based sort needs at least Omega(n log n) comparisons in the worst case, even with a perfect comparator. The faulty comparator does not lower that floor. It only adds verification work on top of it.\n\nHow much redundancy do you buy? Sort only (merge sort): O(n log n), a candidate order and only the comparisons the sort happened to make, so few overlapping paths and few cycles, little evidence to detect lies with. Sort, then probe around suspicion: O(n log n) plus targeted extras, spending extra comparisons only where cycles or near-inconsistencies appear, the practical middle ground. Compare all pairs: O(n squared), maximum redundancy and the richest cycle evidence, expensive, and still inference when a cycle appears.\n\nIf each comparison call is slow, a service round-trip or a model call, add the wall-clock point: comparisons at the same level of merge sort are independent, so batch and parallelise them. Minimise the number of calls first, then the time per call by running independent calls together.\n\nThe honest limit: wrong, acyclic and invisible. Suppose A to B is wrong, and B to C is also wrong, in a matching direction, and A to C is wrong in the matching direction too. The three claims agree with each other perfectly. The graph is acyclic. No cycle forms. And the order is still wrong. Say it this plainly: cycles are sufficient evidence of a fault, but they are not necessary. A set of faults that is internally consistent creates no cycle and cannot be detected by any method that only uses this comparator. So without a bound on how many comparisons are wrong, I cannot guarantee the exact true order. I can guarantee consistency, and, if faults are few, I can very likely recover the truth.\n\nThat paragraph is not a concession speech. On this question, it is the summit. The question is designed so that certainty is impossible, specifically to see whether you will claim it anyway."
      },
      {
       "q": "A worked miniature",
       "a": "Four items, true order A > B > C > D. The comparator lies once: it says C > A. Your comparisons give A>B, B>C, C>D and the lie C>A. The graph contains the cycle A>B>C>A. The lie sits in that cycle, but so do two truthful edges. Now add one more comparison, A>D (truthful), and B>D (truthful): no new cycles. The lie remains the edge whose removal leaves a graph perfectly consistent with a single clean order, and each truthful edge in the cycle is corroborated by paths outside it. Flip C>A to A>C, the graph becomes acyclic, and topological sort returns A, B, C, D. One lie, caught by contradiction, identified by being the least corroborated edge in its cycle."
      },
      {
       "q": "Why this is the answer: the deeper logic",
       "a": "Redundancy is the only error-correction mechanism that exists. Every error-detecting system works the same way: say the same thing twice, in forms that must agree, and check the agreement. A checksum, a parity bit, a repeated measurement: all are redundancy plus a consistency rule. Here, the consistency rule is transitivity, and the redundancy is overlapping comparison paths. A single comparison carries no redundancy, which is why a single comparison can never be validated. The graph is the machine that manufactures and checks redundancy.\n\nThat is also why more comparisons buy detection, not certainty. Each extra comparison adds paths, and each path is a new chance for a lie to contradict something. All-pairs comparison maximises contradiction surface. But a lie that is consistent with everything else has contradicted nothing, at any budget. Detection power scales with spend; identifiability never becomes absolute.\n\nThe spanning-tree instinct, resolved. A tree on n nodes has n-1 edges and zero cycles: zero redundancy, zero detection. The sort itself already gives you roughly that much structure. Everything beyond the tree, every extra edge that closes a loop, is pure evidence. So the design question is really: how much evidence do you buy, and where?\n\nThe assumption doing the heavy lifting is sparsity. Minimum feedback arc set is the right target only because faults are assumed few, so the smallest set of flips that restores consistency is likely the true fault set. If faults were dense, the smallest explanation could easily be a set of truthful edges, and flipping them would corrupt a mostly-right order into a consistently wrong one. Name the assumption and its failure mode together."
      },
      {
       "q": "Where the conversation can go next: six branches",
       "a": "1. What if at most k comparisons are wrong? Then exact recovery becomes well-posed. I need enough redundancy that any k flips cannot produce a consistent alternative order, practically denser comparisons, and I search for the unique flip-set of size at most k that makes the graph acyclic. If two different flip-sets that small both work, the data genuinely cannot distinguish them, and I would say so.\n\n2. What if the faults were random after all? Completely different problem, and easier. I repeat each comparison an odd number of times and take the majority; error probability collapses exponentially in the repetitions. Then any standard sort works. Cost is the repetition factor times n log n.\n\n3. What about equal items, ties? Ties turn the graph into a preorder: equal items should be mutually reachable or explicitly grouped. I would model equal as its own claim, cluster items the comparator calls equal, and sort the clusters, while noting a faulty equal can hide a real difference that no cycle will expose.\n\n4. Comparisons are a paid API, minimise calls. Then I sort with the fewest comparisons I can, reuse every result in the graph (never pay for the same pair twice, since answers are deterministic) and buy extra comparisons only inside cyclic regions, where each call has the highest chance of changing the answer.\n\n5. Items keep arriving, streaming. I keep the graph and insert each new item against a few well-connected existing items rather than all of them. Each insertion either lands consistently or creates cycles that localise suspicion near the new item. Periodically I re-run the flip repair on the affected region only.\n\n6. You own this comparator service. What do you do on Monday? The graph method is the band-aid that ships a correct order today. The fix is upstream: log the suspect edges the cycles identify, reproduce them, find the edge cases in the comparator logic, and add transitivity checks as a permanent monitor, random triples sampled continuously, alerting when the violation rate moves."
      },
      {
       "q": "Q&A: follow-ups answered at interview length",
       "a": "Why not run the sort several times and combine results? Because the comparator is deterministic, every run makes the identical comparisons and returns the identical wrong order. Repetition only helps against randomness. There is none here.\n\nCan you detect a faulty comparison from a single pair? No. A single claim has nothing to agree or disagree with. Detection needs at least a triangle: three items, three comparisons and a transitivity check.\n\nHow do you find cycles, concretely? Depth-first search and watch for an edge back into the current path, or peel the graph topologically, repeatedly removing nodes with no incoming edges; the nodes that survive are in or downstream of cycles. In this round, naming the method is the answer.\n\nYou flip an edge and a new cycle appears. Now what? Expected, not a failure. Flips change the graph, and the repair is iterative by design: score, flip the worst edge, re-check, repeat until acyclic. If flipping cycles forever, that signals faults are not sparse, the core assumption has broken, and I would stop and say the error rate is too high for this method.\n\nIs the flipped edge definitely the faulty one? No, it is the most likely one under the fewest-faults assumption. I would present it as maximum-likelihood repair, not identification. Overclaiming here is the trap the question sets.\n\nWhat is the total complexity? Comparisons dominate: O(n log n) for the sort plus whatever probing budget I choose, up to O(n squared) for all pairs. Cycle detection is linear in nodes plus edges per pass. The exact optimisation, fewest flips, is NP-hard, which is why the shipped version is the greedy heuristic.\n\nWhat if n is small? Then pay for everything: all pairs, full cycle evidence, and if the graph is small enough, an exact search over flip sets instead of the greedy heuristic. Small n is where certainty gets closest."
      },
      {
       "q": "How you are scored, the traps and the rehearsal",
       "a": "What the interviewer is listening for. Clarification before construction: the error-model question, random or repeatable, is the single highest-value sentence of the round. A model, not a procedure: the directed graph is the moment the answer becomes a model of claims rather than a sorting recipe. Detection versus identification: a cycle proves a lie exists but not which edge it is. Correct cost fluency: sorting is O(n log n), certainty-seeking is O(n squared), the exact repair is NP-hard. An honest limit, volunteered: consistent faults are invisible, and if the interviewer has to extract this from you, it counts for half. A heuristic with a reason: cycle-participation scoring, justified by the fewest-faults assumption.\n\nTraps to avoid. Do not say merge sort costs log n comparisons; it is n log n, and also the lower bound for any comparison sort. Do not propose retrying, voting or caching as a fix for deterministic faults. Do not claim the edge that closed the cycle is the faulty one; it is a suspect. Do not present a spanning tree as the detector; redundancy is the detector. Do not promise the exact order without an error bound; promise consistency, and likelihood under sparse faults.\n\nRehearsal checklist. 1. Say the question back and ask the four clarifications without notes. 2. Walk the story in order (dead ends, linked list, graph, cycle, which edge, shared edge, cost, limit) in under eight minutes. 3. Deliver the 30-second answer three times, out loud, timed. 4. Pick two branches at random and answer each in under a minute. 5. End every practice run with the limit paragraph. It is your closing line, not an apology.\n\nFinal posture: pause before each answer, headline first, then the reasoning, then the limit."
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
     "text": "**The problem (Q5).** A hidden tree has n nodes, numbered 1 to n. You can query any node, and the query returns the distance from that node to every other node. You get at most ceil(n/2) queries. Reconstruct all the edges of the tree. This one was parked in the log and is now solved."
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
     "t": "faq",
     "title": "Your thinking, the cases and the formal solution",
     "prose": true,
     "items": [
      {
       "q": "The thinking",
       "a": "The first idea is the distance map: one query hands you the distance from that node to every node at once, not a single distance. From that map, the neighbours of the queried node are exactly the nodes at distance 1. A parent and a child both sit at distance 1, and one query cannot tell them apart. That is fine, because the task asks for edges, not directions. An edge is an edge whichever endpoint is the parent.\n\nThe next instinct is breadth-first search: query the distance-1 nodes, then their distance-1 nodes, and keep going. That finds edges, but it does not respect the budget. In a star, node 1 has n-1 neighbours, and querying all of them already breaks the limit.\n\nThe detour to drop is the longest path. Whether the tree is skewed or balanced, whether the diameter runs through the root or sits inside a subtree, none of it changes the approach. The shape of the tree is irrelevant.\n\nThe crux is parity. Fix node 1 and query it. Every node is now at an even or an odd distance from 1. Every edge in the tree joins an even node to an odd node, because the path from 1 to one endpoint runs through the other, so their distances differ by exactly 1. So if you query every node on one side of that split, every edge has a queried endpoint, and the distance-1 rule reads it off.\n\nThe check that kills the halving idea is the double star: two centres A and B joined to each other, each with a bunch of leaves. Query A, take half of its neighbours, and if B lands in the half you skip, B never gets queried and every edge from B to its leaves is lost. Parity does not have that hole, because B is at distance 1 and its leaves are at distance 2, so one of the two sides is queried in full."
      },
      {
       "q": "What to say in the round, and the cases to have ready",
       "a": "Lead with the budget and the observation, not with the procedure. Say: a query returns the whole distance map, distance 1 means an edge, and the problem is choosing which nodes to query. Then state the parity fact and the procedure. Name the trick plainly: the parity split turns the query budget into a vertex cover, and the smaller side is at most half the nodes.\n\nStar with centre 1: one query finds every edge. The even side is only node 1.\n\nPath, the skewed case: the two sides split about half and half, and the bound is tight but holds.\n\nDouble star: the case that breaks naive breadth-first halving. Parity handles it because every edge crosses the cut.\n\nn equals 1: no edges, one query, done.\n\nNode 1 is a leaf or the centre: it does not matter, parity is relative to node 1 either way.\n\nIf the interviewer pushes on why the smaller side is enough, the answer is the cut argument: no edge has both endpoints on the same side, so no edge can hide from the queried side. If they push on the count, the answer is the arithmetic: the two sides add to n, so the smaller side plus the node 1 query is at most ceil(n/2)."
      },
      {
       "q": "The formal solution, correctness and cost",
       "a": "1. Query node 1. Split all nodes into even and odd distance from 1.\n\n2. Query every node on the smaller side. Node 1 is on the even side and is already queried. Total queries: 1 plus the size of the odd side if that side is smaller, else the size of the even side. Either way at most ceil(n/2).\n\n3. For every queried node u, for every node v with distance 1 from u, add edge (u, v).\n\n4. The result is all n-1 edges of the tree.\n\nCorrectness: every edge joins an even node to an odd node, so every edge has an endpoint on the queried side, and that endpoint reports the other endpoint at distance 1. No false edges appear, because distance 1 in a tree means adjacent. The count bound: the two sides add to n, so the smaller side has at most n/2 nodes, and adding the node 1 query keeps the total at or below ceil(n/2).\n\nComplexity. Queries: at most ceil(n/2), and that is the resource the problem measures. Time: each query returns n distances and you scan them, so O(n) per query and O(n^2) total. Space: O(n) for the distance arrays and the edge set."
      }
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q5-p",
     "title": "Lost Tree, the solution with a judge that checks the query limit",
     "source": "Your Q5 write-up (Muse), run with Python 3.12",
     "d": "hard",
     "minutes": 30,
     "why": "The judge is a simulator of the hidden tree, so the solution can be run and checked against random trees, a path, a star, a double star and a binary tree.",
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
     "starter": "def solve(n, query):\n    ...\n",
     "hints": [
      "Query node 1, split nodes by parity of distance, query the smaller side and read the distance-1 entries."
     ],
     "solution": "import math\nimport random\nfrom collections import deque\n\n\nclass TreeJudge:\n    # The judge: a hidden tree that answers distance queries.\n    # In the real problem this is the interactor; here it is a\n    # simulator so the solution can be run and checked.\n    def __init__(self, n, edges):\n        self.n = n\n        self.adj = {v: [] for v in range(1, n + 1)}\n        for a, b in edges:\n            self.adj[a].append(b)\n            self.adj[b].append(a)\n        self.queries_used = 0\n\n    def query(self, v):\n        # BFS from v; returns a distance list indexed 1..n.\n        self.queries_used += 1\n        dist = {v: 0}\n        q = deque([v])\n        while q:\n            u = q.popleft()\n            for w in self.adj[u]:\n                if w not in dist:\n                    dist[w] = dist[u] + 1\n                    q.append(w)\n        return [dist[i] for i in range(1, self.n + 1)]\n\n\ndef random_tree(n, rng):\n    # Random recursive tree: each new node attaches to a uniform\n    # earlier node. Produces varied shapes, sometimes skewed.\n    edges = []\n    for v in range(2, n + 1):\n        edges.append((v, rng.randint(1, v - 1)))\n    return edges\n\n\ndef solve(n, query):\n    # 1. Query node 1. Its answer splits every node into even\n    #    and odd distance from 1.\n    d1 = query(1)\n    even = [v for v in range(1, n + 1) if d1[v - 1] % 2 == 0]\n    odd = [v for v in range(1, n + 1) if d1[v - 1] % 2 == 1]\n\n    # 2. Query every node on the smaller side. Node 1 is on the\n    #    even side and is already queried, so it is skipped there.\n    #    Cost: 1 + len(odd) if the odd side is smaller, else\n    #    len(even). Either way at most ceil(n / 2).\n    if len(odd) < len(even):\n        to_query = odd\n    else:\n        to_query = [v for v in even if v != 1]\n\n    # 3. Read the edges off the answers: distance 1 means an edge.\n    #    The answer for node 1 counts too; its distance-1 nodes\n    #    are its neighbours.\n    answers = {1: d1}\n    for u in to_query:\n        answers[u] = query(u)\n\n    edges = set()\n    for u, du in answers.items():\n        for v in range(1, n + 1):\n            if du[v - 1] == 1:\n                edges.add((min(u, v), max(u, v)))\n    return edges",
     "complexity": "At most ceil(n/2) queries. O(n) per query, O(n^2) total. O(n) space.",
     "explain": [
      "TreeJudge is the hidden tree: query(v) runs a BFS and counts the query.",
      "The test box here prints one summary line for the 1,000 random trees; your write-up printed one line per run. The checks are the same."
     ],
     "tests": "def check(n, edges, label):\n    judge = TreeJudge(n, edges)\n    found = solve(n, judge.query)\n    want = {(min(a, b), max(a, b)) for a, b in edges}\n    assert found == want, (label, found ^ want)\n    assert judge.queries_used <= math.ceil(n / 2), (label, judge.queries_used)\n    return judge.queries_used\n\n\nif __name__ == \"__main__\":\n    rng = random.Random(11)\n    runs = 0\n    for n in range(1, 51):\n        for _ in range(20):\n            check(n, random_tree(n, rng), \"random\")\n            runs += 1\n    print(f\"random trees: {runs} runs, n = 1 to 50, all within ceil(n/2) queries\")\n    for label, n, edges in [\n        (\"path\", 7, [(1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7)]),\n        (\"star\", 8, [(1, i) for i in range(2, 9)]),\n        (\"double-star\", 10, [(1, 2)] + [(1, i) for i in range(3, 7)]\n         + [(2, i) for i in range(7, 11)]),\n        (\"binary-tree\", 15, [(i, 2 * i) for i in range(1, 8) if 2 * i <= 15]\n         + [(i, 2 * i + 1) for i in range(1, 8) if 2 * i + 1 <= 15]),\n    ]:\n        used = check(n, edges, label)\n        print(f\"{label}: n={n}, queries={used}, limit={math.ceil(n / 2)}, edges={len(edges)} ok\")\n    print(\"ALL PASS\")"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3.12",
     "code": "random trees: 1000 runs, n = 1 to 50, all within ceil(n/2) queries\npath: n=7, queries=4, limit=4, edges=6 ok\nstar: n=8, queries=1, limit=4, edges=7 ok\ndouble-star: n=10, queries=5, limit=5, edges=9 ok\nbinary-tree: n=15, queries=5, limit=8, edges=14 ok\nALL PASS"
    }
   ]
  },
  {
   "id": "yours-q8",
   "title": "5. Q8 RandomizedSet",
   "blocks": [
    {
     "t": "p",
     "text": "**The problem (Q8).** Design a data structure with insert(val), remove(val) and getRandom(), each O(1) on average, with getRandom returning any element with equal probability. Then: what changes if duplicates are allowed?"
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
     "t": "faq",
     "title": "Your thinking and the extension",
     "prose": true,
     "items": [
      {
       "q": "Why this fits the Mercor round",
       "a": "This came up as Night 21 in the Amazon loop prep. It is the same shape as the Mercor algorithms round: discussion-only, a resource constraint, find the structure that makes it possible. Same family as the friend-network API budget and the faulty comparator: the interviewer states a resource constraint and asks for the structure that makes it possible, then pushes on the extension. No code is written in the round; the discussion is the answer."
      },
      {
       "q": "The core idea",
       "a": "Two pieces. A dense array holds the values, because only an array gives O(1) random access by index. A map from value to its index in the array makes remove O(1), because you look up the index directly instead of scanning. The trick for remove is swap-with-last: copy the last element into the hole, fix its map entry, pop the end."
      },
      {
       "q": "Stage 2, duplicates allowed",
       "a": "The map now stores a set of indices per value, since a value can sit in several slots. A counter dict is not enough: a count says how many copies exist, not where they are, and remove still has to find one.\n\nIn remove, pick any one occurrence: set.pop() gives an index in O(1), and which one does not matter. Then the same swap-with-last trick, but update the moved element's index set: drop its old index (the last slot) and add the new one (the hole). Skip the move when the removed copy already was the last element."
      },
      {
       "q": "Extension: weighted getRandom (made up, not from any report)",
       "a": "New requirement: each value carries a weight, and getRandom returns each value with probability proportional to its weight. Operations become insert(val, weight), remove(val), updateWeight(val, newWeight).\n\nNaive: expand each value into weight copies in the array. Works only for tiny integer weights; memory is O(total weight).\n\nHonest answer: prefix sums plus binary search. Keep weights aligned with the array, sample r in [0, total weight), binary search for the bucket. With a Fenwick tree, point updates and prefix-sum search are both O(log n), so every operation is O(log n). You give up O(1) once weights enter.\n\nAlternative: the alias method gives O(1) sampling, but the alias table costs O(n) to build, so every insert or remove pays O(n) to rebuild. It wins only when sampling is far more frequent than updates.\n\nThe line to hold in the round: exact weighted sampling with O(1) updates does not exist. The choice is O(log n) everything (Fenwick) or O(1) sampling with O(n) rebuilds (alias)."
      }
     ]
    },
    {
     "t": "problem",
     "id": "mercor-yours-q8-p",
     "title": "RandomizedSet and RandomizedCollection",
     "source": "Your Q8 write-up (Muse), run with Python 3.12",
     "d": "medium",
     "minutes": 25,
     "why": "Stage 1 without duplicates, stage 2 with them. Your write-up said the code was verified with a uniformity spot check but did not print it, so the tests box here is one written for this page.",
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
     "starter": "class RandomizedSet:\n    ...\n",
     "hints": [
      "A list plus a dict from value to index. Remove by moving the last element into the hole."
     ],
     "solution": "import random\nfrom collections import defaultdict\n\n\nclass RandomizedSet:\n    def __init__(self):\n        # nums: dense array, the only thing getRandom touches.\n        self.nums = []\n        # pos: value -> index. The auxiliary structure.\n        self.pos = {}\n\n    def insert(self, val):\n        if val in self.pos:\n            return False\n        self.pos[val] = len(self.nums)\n        self.nums.append(val)\n        return True\n\n    def remove(self, val):\n        if val not in self.pos:\n            return False\n        # THE TRICK: swap with last. Deleting from the middle\n        # of a list is O(n) because everything after the hole\n        # shifts left. Copy the last element into the hole,\n        # fix up its index in the map, pop the end, O(1).\n        idx = self.pos[val]\n        last = self.nums[-1]\n        self.nums[idx] = last\n        self.pos[last] = idx\n        self.nums.pop()\n        del self.pos[val]\n        return True\n\n    def getRandom(self):\n        # Uniform: every slot equally likely, no holes.\n        return self.nums[random.randrange(len(self.nums))]\n\n\nclass RandomizedCollection:\n    def __init__(self):\n        self.nums = []\n        # value -> set of indices where that value occurs.\n        self.pos = defaultdict(set)\n\n    def insert(self, val):\n        self.pos[val].add(len(self.nums))\n        self.nums.append(val)\n        return True\n\n    def remove(self, val):\n        if not self.pos[val]:\n            return False\n        # Pick ANY one occurrence. set.pop() gives an index\n        # in O(1); which one does not matter.\n        idx = self.pos[val].pop()\n        # Same swap-with-last trick, but update the moved\n        # element index set: drop its old index (the last\n        # slot) and add the new one (the hole). Skip the move\n        # when the removed copy already was the last element.\n        if idx != len(self.nums) - 1:\n            last = self.nums[-1]\n            self.nums[idx] = last\n            self.pos[last].discard(len(self.nums) - 1)\n            self.pos[last].add(idx)\n        self.nums.pop()\n        return True\n\n    def getRandom(self):\n        return self.nums[random.randrange(len(self.nums))]",
     "complexity": "insert, remove and getRandom are O(1) on average. Space O(n).",
     "explain": [
      "RandomizedSet.remove copies the last element into the hole, updates its index in the map and pops the end.",
      "RandomizedCollection keeps a set of indices per value and skips the move when the removed copy is already last.",
      "getRandom on an empty structure raises, as in your write-up; add a guard if the interviewer wants an empty answer."
     ],
     "tests": "from collections import Counter\n\nrandom.seed(7)\ns = RandomizedSet()\nprint(s.insert(1), s.insert(2), s.insert(2), s.remove(1), s.remove(1), s.insert(3))\nprint(sorted(s.nums), s.pos)\n\n# uniformity spot check: 3 values, 30,000 draws, each should be near 10,000\ns = RandomizedSet()\nfor v in (10, 20, 30, 40):\n    s.insert(v)\ns.remove(20)\ndraws = Counter(s.getRandom() for _ in range(30000))\nprint(\"set draws:\", sorted(draws.items()))\nassert all(9000 < c < 11000 for c in draws.values()) and 20 not in draws\n\n# duplicates: 5, 5, 7 -> 5 should come up about twice as often as 7\nc = RandomizedCollection()\nfor v in (5, 5, 7):\n    c.insert(v)\ndraws = Counter(c.getRandom() for _ in range(30000))\nprint(\"collection draws:\", sorted(draws.items()))\nassert 19000 < draws[5] < 21000 and 9000 < draws[7] < 11000\nprint(c.remove(5), c.remove(5), c.remove(5), c.nums)\nassert c.nums == [7] and c.pos[7] == {0}\n\n# random operations checked against a plain list\nref, c = [], RandomizedCollection()\nfor _ in range(5000):\n    v = random.randrange(6)\n    if random.random() < 0.55:\n        c.insert(v)\n        ref.append(v)\n    else:\n        ok = c.remove(v)\n        assert ok == (v in ref)\n        if ok:\n            ref.remove(v)\n    assert sorted(c.nums) == sorted(ref)\n    for val, idxs in c.pos.items():\n        assert all(c.nums[i] == val for i in idxs)\nprint(\"5000 random operations match a plain list\")"
    },
    {
     "t": "code",
     "title": "Output, run with Python 3.12",
     "code": "True True False True False True\n[2, 3] {2: 0, 3: 1}\nset draws: [(10, 10061), (30, 9936), (40, 10003)]\ncollection draws: [(5, 19924), (7, 10076)]\nTrue True False [7]\n5000 random operations match a plain list"
    }
   ]
  }
 ]
});
