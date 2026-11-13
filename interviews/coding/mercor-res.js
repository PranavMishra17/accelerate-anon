/* Mercor onsite: videos and articles per chapter. Keys are "<part id>/<section id>" (two parts reuse "onsite-dedupe").
   Every video was checked with tools/yt.py and every article opened on 2026-11-03. */
(function () {
  function v(req, id, ch, m, label, why) { return { kind: "video", req: req, label: label, url: "https://www.youtube.com/watch?v=" + id, yt: { id: id, ch: ch }, m: m, why: why }; }
  function r(req, url, m, label, why) { return { kind: "read", req: req, label: label, url: url, m: m, why: why }; }
  var C = "mercor-onsite-code/", A = "mercor-onsite-algo/", I = "mercor-infra-algo/";
  window.LOOP_RES = window.LOOP_RES || {};
  var R = {};

  /* Part 7: the one-hour solo coding round */
  R[C + "onsite-round"] = [
    v(true, "DIR_rxusO8Q", "Fullstack Academy", 16, "Whiteboard coding interviews: 6 steps to solve any problem", "A fixed routine for a round with no editor: restate, example, approach, code, test. Run it out loud once."),
    v(false, "yOKMIEOCkRU", "Tech With Tim", 12, "How to pass technical interviews without grinding LeetCode", "What the interviewer is actually scoring besides the answer, which matters in the 30 minute review."),
    r(true, "https://www.techinterviewhandbook.org/coding-interview-cheatsheet/", 10, "Tech Interview Handbook: coding interview cheatsheet", "Before, during and after checklist: clarify, test with your own cases, state the complexity."),
    r(false, "https://www.techinterviewhandbook.org/coding-interview-techniques/", 12, "Tech Interview Handbook: techniques to solve coding questions", "Edge cases to try first and how to recover when you are stuck.")
  ];
  R[C + "onsite-kit"] = [
    v(true, "34SNQHapJYE", "Indently", 6, "Python deque as a fast queue", "Why popleft is O(1) and list.pop(0) is not: the queue you reach for in every BFS."),
    v(false, "E2v9hBgG6gE", "Greg Hogg", 25, "Heaps and priority queues with heapq in Python", "heappush, heappop and the tuple trick for priorities, in the Python you will type with no autocomplete."),
    r(true, "https://realpython.com/python-heapq-module/", 15, "Real Python: the heapq module (part free)", "Min heap only, so how to fake a max heap and how to break ties."),
    r(false, "https://realpython.com/python-deque/", 15, "Real Python: Python's deque (part free)", "Queue and stack operations and their cost, side by side with a list.")
  ];
  R["mercor-yours/yours-q1"] = [
    v(true, "utDu3Q7Flrw", "NeetCode", 14, "Top 5 most common graph algorithms for coding interviews", "BFS, DFS, topological sort, union find and Dijkstra in one sitting: the menu for this whole part."),
    v(false, "4jyESQDrpls", "Greg Hogg", 33, "Graphs: adjacency list, DFS and BFS in Python", "Builds the adjacency list from an edge list and walks it, the exact first ten lines of a referral network."),
    r(true, "https://www.techinterviewhandbook.org/algorithms/graph/", 10, "Tech Interview Handbook: graph cheatsheet", "Traversal templates in Python, the visited set, and the corner cases (cycles, disconnected parts)."),
    r(false, "https://www.hellointerview.com/learn/system-design/problem-breakdowns/web-crawler", 20, "Hello Interview: design a web crawler", "A graph walk at scale; read it for the visited set and the queue, the same moves as a referral tree.")
  ];
  R[C + "onsite-scheduler"] = [
    v(true, "cIBFEhD77b4", "WilliamFiset", 14, "Topological sort with Kahn's algorithm", "In-degree counts and a queue, which is the task scheduler loop; also shows how a leftover node means a cycle."),
    v(false, "NX1_etRg078", "Hello Byte", 7, "Topological sorting, visually explained", "A fast animated pass over the same idea if the first one did not click."),
    r(true, "https://cp-algorithms.com/graph/topological-sort.html", 10, "cp-algorithms: topological sorting", "The DFS version with finish times, so you can write either version cold."),
    r(false, "https://sre.google/sre-book/addressing-cascading-failures/", 25, "Google SRE book: addressing cascading failures", "Optional: why a real scheduler needs retry limits and load shedding when tasks fail.")
  ];
  R[C + "onsite-skillgraph"] = [
    v(true, "sioNsVeSbQo", "Algorithm Every Day", 7, "Transitive closure of a graph (reachability matrix)", "What 'can skill A reach skill B' means for every pair, and the cost of computing it all."),
    v(false, "cS-198wtfj0", "AlgoMonster", 10, "DFS vs BFS, when to use which", "Picks the traversal for reachability, ancestors and shortest steps, the three questions this graph gets."),
    r(true, "https://www.techinterviewhandbook.org/algorithms/graph/", 10, "Tech Interview Handbook: graph cheatsheet", "Reachability by DFS with a visited set, and the directed versus undirected traps."),
    r(false, "https://cp-algorithms.com/graph/topological-sort.html", 10, "cp-algorithms: topological sorting", "A topological order lets you compute reachability sets in one pass, which is the speed-up for repeated queries.")
  ];
  R[C + "onsite-scheduler"] = (R[C + "onsite-scheduler"] || []).concat([
    v(true, "TXkDpqjDMHA", "WilliamFiset", 10, "Shortest and longest path on a DAG", "Longest path is a single pass in topological order, which is exactly the earliest finish time of a project."),
    v(false, "ZUFQfFaU-8U", "take U forward", 27, "Shortest path in a directed acyclic graph", "The same topological DP written out in code; skim for the relax loop."),
    r(true, "https://www.geeksforgeeks.org/find-longest-path-directed-acyclic-graph/", 8, "GeeksforGeeks: longest path in a DAG", "The critical path as code: order, then relax each edge once."),
    r(false, "https://cp-algorithms.com/graph/topological-sort.html", 10, "cp-algorithms: topological sorting", "Needed first for the order that the DP walks.")
  ]);
  R[C + "onsite-assign"] = [
    v(true, "XycnarZEBvQ", "ByteQuest", 13, "Heaps visually explained (priority queues)", "Why the next free contractor or the next cheapest task is a heap pop, shown step by step."),
    r(true, "https://www.hellointerview.com/learn/code/heap/overview", 10, "Hello Interview: heap overview", "When a heap is the answer, the two-heap trick and the typical Python code."),
    r(false, "https://realpython.com/python-heapq-module/", 15, "Real Python: the heapq module (part free)", "Tuples as heap entries so ties break the way you want.")
  ];
  R[C + "onsite-intervals"] = [
    v(true, "44H3cEC2fFM", "NeetCode", 11, "Merge intervals", "Sort by start, then extend or close: the base move behind slot scheduling."),
    v(false, "hVhOeaONg1Y", "Back To Back SWE", 21, "Interval scheduling maximization, with proof", "Why picking the earliest finish is correct; useful if the interviewer asks you to prove your greedy."),
    r(true, "https://www.hellointerview.com/learn/code/intervals/overview", 8, "Hello Interview: intervals overview", "The overlap test and the sort-first pattern, with the cases that break naive code."),
    r(false, "https://www.hellointerview.com/learn/code/heap/overview", 10, "Hello Interview: heap overview", "Rooms or interviewers needed at once is a heap of end times.")
  ];
  R[C + "onsite-dedupe"] = [
    v(true, "ibjEGG7ylHk", "WilliamFiset", 6, "Union find introduction", "Find and union with path compression: how you merge duplicate profiles into one group."),
    v(false, "92UpvDXc8fs", "Hello Byte", 14, "Union find, visually explained", "Animated version with union by rank, for the near-constant cost claim."),
    r(true, "https://cp-algorithms.com/data_structures/disjoint_set_union.html", 15, "cp-algorithms: disjoint set union", "The reference write-up: both optimisations, complexity, and how to keep a size per group."),
    r(false, "https://www.techinterviewhandbook.org/algorithms/graph/", 10, "Tech Interview Handbook: graph cheatsheet", "The DFS alternative, for when union find feels heavy for the size of input.")
  ];
  R[C + "onsite-crawler"] = [
    v(true, "6u25GckPhLU", "ByteByteGo", 6, "Design a web crawler", "Frontier queue, visited set, politeness per host: the three parts your small crawler needs."),
    v(false, "MdWvMX4J-Vc", "Jordan has no life", 33, "Design a web crawler", "A longer design with per-domain rate limits, which is the rate-limited part of the question."),
    r(true, "https://www.hellointerview.com/learn/system-design/problem-breakdowns/web-crawler", 20, "Hello Interview: design a web crawler", "Frontier, dedupe and politeness, and the failure cases a reviewer will probe."),
    r(false, "https://stripe.com/blog/rate-limiters", 15, "Stripe: scaling your API with rate limiters", "Token bucket in practice, for the per-host limit.")
  ];
  R[C + "onsite-ttlcache"] = [
    v(true, "wh98s0XhMmQ", "ByteByteGo", 7, "Caching pitfalls every developer should know", "Expiry, stampedes and stale reads: the second-layer questions after you write LRU."),
    v(false, "Ez1GK2imrsY", "sudoCODE", 23, "Caching: patterns, invalidation and eviction", "Where TTL fits next to eviction policies."),
    r(true, "https://redis.io/docs/latest/commands/expire/", 8, "Redis docs: EXPIRE", "Lazy expiry on read plus a background sweep: the two ways to drop dead keys you can copy."),
    r(false, "https://redis.io/docs/latest/develop/reference/eviction/", 10, "Redis docs: key eviction", "Eviction policies next to TTL, with the cost of each.")
  ];
  R[C + "onsite-leaderboard"] = [
    v(true, "MUKlxdBQZ7g", "Redis", 7, "Redis sorted sets explained", "A leaderboard as a sorted set: score update, rank and top-k, each in log time."),
    v(false, "fmT5nlEkl3U", "Hello Interview", 31, "Redis deep dive", "Where sorted sets sit among Redis structures, and their limits at scale."),
    r(true, "https://redis.io/docs/latest/develop/data-types/sorted-sets/", 10, "Redis docs: sorted sets", "The operations a leaderboard needs and their complexities."),
    r(false, "https://www.hellointerview.com/learn/code/heap/overview", 10, "Hello Interview: heap overview", "Top-k with a size-k heap, which is the in-memory version of the same answer.")
  ];
  R[C + "onsite-review"] = [
    v(true, "Y9sp8gONv9M", "Cody Engel", 13, "Code review tips from a staff engineer", "What a senior reviewer looks at; read your own solution the same way before they do."),
    r(true, "https://google.github.io/eng-practices/review/reviewer/looking-for.html", 10, "Google eng practices: what to look for in a code review", "Design, functionality, complexity, tests, naming, comments: the checklist they will use on your code."),
    r(false, "https://google.github.io/eng-practices/review/reviewer/standard.html", 5, "Google eng practices: the standard of code review", "The bar is 'improves the code', not perfect; useful for taking feedback calmly.")
  ];

  /* Part 8: the algorithms talk */
  R[A + "onsite-talk"] = [
    v(true, "FNL61tvwBUg", "Tech With Tim", 18, "How to pass coding interviews like the top 1%", "Talking through a problem, naming the cost, handling hints: the whole skill of a discussion-only round."),
    r(true, "https://www.techinterviewhandbook.org/coding-interview-techniques/", 12, "Tech Interview Handbook: techniques to solve coding questions", "Clarify, brute force first, then improve out loud.")
  ];
  R["mercor-yours/yours-q4"] = [
    v(true, "wiNfjkMDl3A", "AlgosWithMichael", 7, "Quick select algorithm visualized", "Why partition-based selection is O(n) on average and what sorting would cost instead."),
    r(true, "https://docs.python.org/3/howto/sorting.html", 12, "Python docs: sorting techniques", "key functions versus cmp_to_key, and the stability rule that explains many sort bugs."),
    r(false, "https://en.wikipedia.org/wiki/Strict_weak_ordering", 12, "Wikipedia: weak ordering", "The rules a comparator must follow (irreflexive, transitive); break one and a sort misbehaves.")
  ];
  R["mercor-yours/yours-q2"] = [
    v(true, "EFg3u_E6eHU", "Spanning Tree", 9, "How Dijkstra's algorithm works", "Best rate to a target as a shortest path, with the priority queue shown clearly."),
    v(false, "_lHSawdgXpI", "Michael Sambol", 3, "Dijkstra's algorithm in 3 minutes", "A fast recap to say it aloud from."),
    r(true, "https://cp-algorithms.com/graph/dijkstra.html", 15, "cp-algorithms: Dijkstra", "Complexity with a heap, and why negative edges break it."),
    r(false, "https://cp-algorithms.com/graph/bellman_ford.html", 12, "cp-algorithms: Bellman-Ford", "Negative cycles, which is how a currency arbitrage loop shows up.")
  ];
  R[A + "onsite-friend"] = [
    v(true, "oDqjPvD54Ss", "WilliamFiset", 8, "Breadth first search, shortest path", "Fewest hops between two people is BFS; you count levels, not edges."),
    r(true, "https://en.wikipedia.org/wiki/Bidirectional_search", 10, "Wikipedia: bidirectional search", "Searching from both ends cuts the calls on a wide friend graph, which is the 'few API calls' follow-up."),
    r(false, "https://www.techinterviewhandbook.org/algorithms/graph/", 10, "Tech Interview Handbook: graph cheatsheet", "Visited set and queue templates to code from memory.")
  ];
  R[A + "onsite-dedupe"] = [
    v(true, "V3pzxngeLqw", "ByteByteGo", 6, "Bloom filters", "When 'maybe seen' is enough, and how a million IDs fit in a few megabytes."),
    v(false, "wudyP4kkKLY", "LevelUp", 5, "Introduction to bit sets", "A bit per ID when the IDs are dense integers: exact, and 125 KB per million."),
    r(true, "https://en.wikipedia.org/wiki/Bit_array", 10, "Wikipedia: bit array", "Memory and speed of a bitmap, and when it beats a hash set."),
    r(false, "https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/", 8, "Redis docs: Bloom filter", "False-positive rate versus size, with real numbers to quote.")
  ];
  R[A + "onsite-topk"] = [
    v(true, "6_v6OoxvMOE", "AlgoMasterIO", 7, "Top K elements in 6 minutes", "A size-k min heap and why it beats sorting when k is small."),
    r(true, "https://www.hellointerview.com/learn/code/heap/overview", 10, "Hello Interview: heap overview", "Top-k and the two-heap pattern with Python code."),
    r(false, "https://en.wikipedia.org/wiki/Quickselect", 10, "Wikipedia: quickselect", "The O(n) average alternative and its worst case, for the trade-off question.")
  ];

  /* Part 9: infrastructure algorithms */
  R[I + "infra-talk"] = [
    v(true, "xbgzl2maQUU", "ByteByteGo", 7, "Algorithms you should know before system design interviews", "The list this round draws from, each in one breath: hashing, rate limits, Bloom filters and the rest."),
    v(false, "L9TfZdODuFQ", "Aced", 8, "How to answer system design interview questions", "A structure for talking through a design out loud, which carries over to a discussion round."),
    r(true, "https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery", 15, "Hello Interview: system design delivery framework", "How to pace a spoken answer and where to state trade-offs."),
    r(false, "https://github.com/donnemartin/system-design-primer", 30, "System design primer", "Skim the index of building blocks; the rest of this part goes deeper on the algorithm inside each.")
  ];
  R[I + "infra-hash"] = [
    v(true, "vccwdhfqIrI", "Hello Interview", 8, "Consistent hashing, easy explanation", "The ring, virtual nodes and what moves when a node joins: the exact talk track."),
    v(false, "zaRkONvyGr8", "Gaurav Sen", 11, "What is consistent hashing and where is it used", "The failure case of mod-N hashing drawn out, then the fix."),
    r(true, "https://www.toptal.com/big-data/consistent-hashing", 15, "Toptal: the ultimate guide to consistent hashing", "Worked code, virtual nodes and load balance, with the numbers."),
    r(false, "https://github.com/donnemartin/system-design-primer", 30, "System design primer", "Where consistent hashing sits in sharding and caching designs.")
  ];
  R[I + "infra-rate"] = [
    v(true, "YXkOdWBwqaA", "ByteByteGo", 8, "Rate limiter: token bucket, leaky bucket, scaling", "Four algorithms side by side with their memory cost and burst behaviour."),
    v(false, "mhUQe4BKZXs", "Tech Dummies", 36, "Rate limiting system design", "Longer walk through sliding log, sliding window counter and a distributed setup."),
    r(true, "https://stripe.com/blog/rate-limiters", 15, "Stripe: scaling your API with rate limiters", "Four limiter types a payments company actually runs, and why load shedding comes last."),
    r(false, "https://www.figma.com/blog/an-alternative-approach-to-rate-limiting/", 12, "Figma: an alternative approach to rate limiting", "A sliding window counter built on Redis, with the accuracy trade-off measured.")
  ];
  R[I + "infra-cache"] = [
    v(true, "ZqI7i3v4baQ", "Lazy Programmer", 8, "Cache eviction policies: LRU, LFU, FIFO, TTL", "Which policy fits which access pattern, in a form you can say aloud."),
    v(false, "0PSB9y8ehbk", "take U forward", 20, "Implement an LFU cache", "The O(1) LFU with frequency buckets, which is the hard half of the chapter."),
    r(true, "https://redis.io/docs/latest/develop/reference/eviction/", 10, "Redis docs: key eviction", "Approximated LRU and LFU in a real system: sample a few keys instead of tracking all."),
    r(false, "https://github.com/ben-manes/caffeine/wiki/Efficiency", 12, "Caffeine wiki: efficiency", "Why plain LRU loses to TinyLFU admission on skewed traffic, with hit-rate charts.")
  ];
  R[I + "infra-lb"] = [
    v(true, "dBmxNsS3BGE", "ByteByteGo", 6, "Top 6 load balancing algorithms", "Round robin, least connections, hashing and the rest: the menu before power of two choices."),
    r(true, "https://www.nginx.com/blog/nginx-power-of-two-choices-load-balancing-algorithm/", 10, "NGINX: power of two choices", "Why sampling two servers and taking the lighter one beats both random and least-connections."),
    r(false, "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers", 12, "Envoy docs: supported load balancers", "What a production proxy offers: least request with P2C, ring hash, Maglev.")
  ];
  R[I + "infra-retry"] = [
    v(true, "yGO4Igb45V0", "Software Developer Diaries", 10, "Retries with jitter", "Why synchronised retries cause a second outage, and how jitter spreads them."),
    v(false, "m6DtqSb1BDM", "Arpit Bhayani", 17, "Robust payments service with idempotency keys", "Retries are only safe if the call is idempotent; this builds that part."),
    r(true, "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/", 15, "AWS Builders' Library: timeouts, retries and backoff with jitter", "The production rules: time out first, cap retries, add jitter, watch for retry amplification across layers."),
    r(false, "https://stripe.com/blog/idempotency", 12, "Stripe: designing robust APIs with idempotency", "Idempotency keys and what to store, from the team that made them standard.")
  ];
  R[I + "infra-bloom"] = [
    v(true, "gBygn3cVP80", "Hussein Nasser", 10, "Bloom filters explained by example", "Hash k times, set bits, check bits: the false-positive-only guarantee."),
    v(false, "IgyU0iFIoqM", "Hello Interview", 26, "Data structures for big data in interviews", "Bloom filter next to count-min and HyperLogLog, and when to name each in an interview."),
    r(true, "https://llimllib.github.io/bloomfilter-tutorial/", 8, "Bloom filters by example", "An interactive filter where you add words and see false positives appear."),
    r(false, "https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/", 8, "Redis docs: Bloom filter", "Error rate and capacity as parameters you choose.")
  ];
  R[I + "infra-heavy"] = [
    v(true, "mPxslXpg8wA", "Niema Moshiri", 8, "Count-min sketches", "A grid of counters, d hashes, take the minimum: it never undercounts."),
    v(false, "ibxXO-b14j4", "Tech Dummies", 20, "Count-min sketch for counting a stream", "The same idea in a system design setting, with the top-k combination."),
    r(true, "https://florian.github.io/count-min-sketch/", 8, "Count-min sketch, interactive", "Change width and depth and watch the error move."),
    r(false, "https://redis.io/docs/latest/develop/data-types/probabilistic/top-k/", 8, "Redis docs: Top-K", "A heavy hitters structure in production use, with its parameters.")
  ];
  R[I + "infra-sample"] = [
    v(true, "A1iwzSew5QY", "Eric Laber", 5, "Reservoir sampling", "Keep the item with probability k over i; the proof in five minutes."),
    v(false, "Ybra0uGEkpM", "KNOWLEDGE TREE", 13, "Introduction to reservoir sampling", "A slower walk with a worked example."),
    r(true, "https://florian.github.io/reservoir-sampling/", 8, "Reservoir sampling, interactive", "Watch the reservoir change as a stream passes; good for checking the uniform claim."),
    r(false, "https://gregable.com/2007/10/reservoir-sampling.html", 8, "Gregable: reservoir sampling", "The proof by induction and the weighted variant.")
  ];
  R[I + "infra-extsort"] = [
    v(true, "oZsMMgtbZNs", "UniExercises", 9, "External sort explained", "Sort chunks that fit in memory, write runs, merge them: the whole algorithm."),
    v(false, "xS9Qix5RDA8", "Inside code", 12, "Merge k sorted lists (k-way merge)", "The heap-based k-way merge, which is the merge phase."),
    r(true, "https://en.wikipedia.org/wiki/K-way_merge_algorithm", 10, "Wikipedia: k-way merge algorithm", "Heap versus tournament tree, and the I/O cost of choosing k."),
    r(false, "https://www.geeksforgeeks.org/external-sorting/", 10, "GeeksforGeeks: external sorting", "Run counts and passes with a worked example.")
  ];
  R[I + "infra-match"] = [
    v(true, "cQ5MsiGaDY8", "CompSci", 8, "The Munkres assignment algorithm (Hungarian)", "The row and column reduction steps on a cost matrix, enough to explain it aloud."),
    v(false, "FCaD34z--bY", "Joel Speranza Math", 14, "The Hungarian algorithm for weighted assignments", "A second worked example, with the covering lines idea."),
    r(true, "https://cp-algorithms.com/graph/hungarian-algorithm.html", 15, "cp-algorithms: Hungarian algorithm", "O(n^3) implementation and the potentials idea behind it."),
    r(false, "https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linear_sum_assignment.html", 5, "SciPy: linear_sum_assignment", "What you would actually call in production, with the cost-matrix shape.")
  ];

  Object.keys(R).forEach(function (k) { window.LOOP_RES[k] = R[k]; });
})();
