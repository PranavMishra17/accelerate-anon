/* Mercor coding tab, part 9: onsite algorithms on infrastructure and scaling. Mercor describes the round as real architecture challenges, infrastructure decisions and scaling strategies, discussion-based, 'not Leetcode, not system design, true algorithms'; the questions are not public, so these chapters are preparation breadth. Every Python block was run with Python 3.12 and the output under it is what it printed. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-infra-algo",
 "n": 9,
 "one": true,
 "title": "Onsite algorithms: infrastructure and scaling",
 "minutes": 330,
 "lead": "After this part you can run the 30 minute algorithms discussion on infrastructure and scaling. Each of ten chapters is a talk track framed as a Mercor-shaped problem: an expert marketplace, evaluation pipelines, calls to a model provider. You solve it in the order a) clarify, b) requirements, c) entities, d) the logic in English with the numbers, e) a short sketch of the code, f) the follow-ups an interviewer chains. The naive way and its cost come first every time. The round's questions are not public; this is preparation breadth, built from Mercor's own description of the round.",
 "sections": [
  {
   "id": "infra-talk",
   "title": "0. How to run an infrastructure algorithms round",
   "blocks": [
    {
     "t": "p",
     "text": "**What Mercor says.** The algorithms round is 30 minutes of 'problem-solving on real architecture challenges, infrastructure decisions, and scaling strategies that mirror a challenge you may face at Mercor'. It is interactive and discussion-based: 'not Leetcode, not system design, true algorithms'. No candidate report confirms the exact questions. The reports we have (the faulty comparator, exchange rates, the friend network) are in the previous part. These ten chapters are preparation breadth: the infrastructure algorithms that sit inside those reported follow-ups (rate limits, backoff, caches, Bloom filters) plus the ones an invitation with that wording could reach."
    },
    {
     "t": "p",
     "text": "**What it grades.** Whether you can reason about cost out loud. 'True algorithms' means a data structure or an algorithm with a complexity you can state, applied to a system. Not a diagram of boxes, and not a coding contest."
    },
    {
     "t": "p",
     "text": "**The moves, in this order, every time.**"
    },
    {
     "t": "list",
     "items": [
      "1. Clarify in three buckets: what it must do, what goes wrong, where it stops. Ask about scale and failure early. They change the answer.",
      "2. Say the naive approach and its cost as a number: calls, time, memory. Before you improve anything.",
      "3. Say the better approach, what it gives up, and its new number. A claim without a number is a guess.",
      "4. Check it on a tiny example, aloud, with the numbers.",
      "5. Change the goal: more traffic, a node dying, stale data, a hot key. Say what breaks and what you would change.",
      "6. Close in one sentence on the tradeoff, and ask which side they care about."
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
       "'Three things first: what it must do, what goes wrong, where it stops. How big is it, and what if a node dies?'"
      ],
      [
       "5 to 10",
       "Requirements and the naive way",
       "'The obvious way costs about this much. Here is where it breaks.'"
      ],
      [
       "10 to 20",
       "The better way, with numbers",
       "'This moves one key in six, not five in six. Here is why.'"
      ],
      [
       "20 to 27",
       "Follow-ups: scale and failure",
       "'If a node dies, then... If the data is stale, then...'"
      ],
      [
       "27 to 30",
       "Tradeoff and close",
       "'I gave up exactness for memory. Is that the right side for you?'"
      ]
     ]
    },
    {
     "t": "write",
     "id": "infra-talk-w",
     "q": "For each problem, say the naive way and its cost as one number. Write what you would say.",
     "starter": "1. Spread 100 million expert profiles over 50 nodes:\n\n2. Stay under a model provider's 10 calls a second:\n\n3. Know whether an id was seen before, out of 1 billion ids:\n\n4. Sort 300 GB with 16 GB of memory:",
     "hint": "The naive way is the cost you name before you improve. Put a number in each line.",
     "solution": "1. hash(key) mod 50. Fine until the node count changes: going from 50 to 51 moves 50 out of 51 keys, 98%. A ring moves 1 in 51.\n2. A counter reset every second: 10 calls at 0.99 s and 10 at 1.00 s is 20 calls in 20 ms. A token bucket caps that at the burst.\n3. A hash set: about 70 GB for a billion ids. A Bloom filter at 1% is about 1.2 GB, and 'definitely not' skips the database.\n4. Load it and sort it: it does not fit. Sort 16 GB chunks into 19 runs and merge them with a heap: two passes, about 40 minutes at 500 MB/s.",
     "why": "Each line names the slow answer and its cost. The number is what you improve against.",
     "say": "**I always say the naive way and its cost first.** Mod N moves nearly every key. A reset counter allows twice the limit. A hash set needs 70 GB. Loading 300 GB into 16 GB cannot work. Then I say how much I think I can save."
    },
    {
     "t": "faq",
     "title": "Questions to ask early, and why",
     "items": [
      {
       "q": "How big is it?",
       "a": "Keys, requests per second, bytes. Every algorithm here has a size where the naive way is fine. Ask so you do not over-build."
      },
      {
       "q": "What happens when a node dies, or a call fails?",
       "a": "Failure decides whether you replicate, retry, or rebuild. Ask early, because it is half of 'infrastructure'."
      },
      {
       "q": "How exact must it be?",
       "a": "Exact needs memory. 'A few percent off' unlocks the sketches: Bloom filters, count-min, sampling."
      },
      {
       "q": "Is the information fresh?",
       "a": "Stale load data is why least-loaded herds and two choices works. Stale caches need a key that changes, not an invalidation."
      },
      {
       "q": "One machine or many?",
       "a": "Many machines turns a class into a system: shared counters, merging sketches, a ring. Say which you are solving."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Where these chapters link.** Chapter 2 and chapter 5 pair: the limiter decides when you may call, the retry code decides what to do after a failure. Chapter 1 and chapter 4 pair: a ring sends the same key to the same node, load balancing spreads load. Chapter 3 links to the caching sessions wc32 to wc34, and chapters 6 to 8 are the 'too much data for memory' family. Every Python block was run with Python 3.12, and the output shown under it is what it printed."
    }
   ]
  },
  {
   "id": "infra-hash",
   "title": "1. Consistent hashing",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** Mercor holds millions of expert profiles and their evaluation results. One machine cannot hold them, so they are spread over N nodes by key. A key is an expert id. The question: which node owns a key, and what happens to the data when a node joins or dies? **The naive way** is `hash(key) % N`. It balances well and it is one line. Its cost shows when N changes: going from 5 to 6 nodes moves 5 out of 6 keys, about 83%. That is a cache that goes cold, or a reshuffle of most of the data, at the worst moment, when you are adding capacity because you are already busy. **The better way** is a ring: hash keys and nodes onto the same circle, and a key belongs to the next node clockwise. A node joining takes keys from one neighbour only, about 1/N of the total."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-hash-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: what is a key, who computes the owner, equal nodes or not. Errors: node failure, a hot key, clients with different node lists. Scope: how big, move data or not, replicas.",
     "solution": "1. Primary capabilities\n- What is a key and a value: an expert id and a profile or result, a few KB each? Likely yes, and reads are most of the traffic.\n- Do we need to find the owner of a key fast, with no central lookup? Likely yes, any client can compute it.\n- Do nodes have equal capacity? Likely mostly, but one box may be twice as big, so weights matter.\n\n2. Error handling\n- What happens when a node dies: do we copy data to replicas or only rehash? Likely a cache, so rehash is fine, but the profiles are the source of truth elsewhere.\n- Is a hot key possible (one famous expert)? Likely yes, and a ring does not fix it by itself.\n- Can two clients disagree on the node list for a moment? Likely yes, and a stale view must cost a miss, not a wrong answer.\n\n3. Scope boundaries\n- How many nodes and keys? Say 50 nodes, 100 million keys.\n- Do we also move the data, or only compute the owner? Compute first, then say what moves.\n- Replication and consistency between replicas: out of scope unless asked. Say you would use the next 2 or 3 nodes on the ring.",
     "why": "Two answers change the design: equal nodes or not (decides virtual node counts and weights) and whether any client can compute the owner (decides if the ring lives in every client). The hot key question shows you know hashing spreads keys, not traffic.",
     "say": "**I ask three things before I design.** What a key is and who computes the owner. What happens when a node dies. And how big this is. Then I say what I leave out: replicas, which I would place on the next nodes along the ring."
    },
    {
     "t": "write",
     "id": "infra-hash-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. owner(key) returns the same node on every client that has the same node list.\n2. Adding one node to N moves about 1/(N+1) of the keys, and only to the new node.\n3. Removing one node moves only that node's keys, spread over the rest.\n4. With 5 nodes and 10,000 keys, the busiest node holds within 10% of the even share.\n5. A node can be given a weight (a bigger box takes more keys).\n6. Lookup is O(log P) for P points on the ring.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-hash-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Key: KEEP. It is the input; hashed to a 64-bit number\n- Node: KEEP. A server; it appears on the ring many times (virtual nodes)\n- Virtual node: KEEP. A label like n1#37. It evens out the share and carries the weight. A sorted list of points plus a dict point to node\n- Ring: KEEP. A sorted array of points; lookup is a binary search; wrap with modulo\n- Replica: DROP for now. Say it aloud: the next 2 distinct nodes clockwise\n- Load counter: KEEP for bounded load. A dict node to count, only needed when you cap the load",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-hash-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Hash every node 100 times (n1#0 ... n1#99) onto a 64-bit circle. Keep the points in one sorted list. 50 nodes make 5,000 points, about 80 KB.\n2. To find the owner, hash the key and binary search for the first point after it. At the end of the list wrap to the first. 5,000 points is 13 steps.\n3. To add a node, insert its 100 points. Only keys between each new point and the point before it change owner. With 5 nodes going to 6 that is 1,780 of 10,000 keys, close to the ideal 1,667.\n4. To remove a node, delete its points. Its keys fall to the next point clockwise, which belongs to many different nodes, so no single neighbour is flooded.\n5. To cap the load, give each node a limit of ceil(1.25 x average) keys. A key walks clockwise past any node that is full. Cost: a few more steps for keys near a full node.\n6. Compare with mod N at the end: 8,348 of 10,000 keys moved for the same change.\n\nEdge cases:\n- Ring empty: no owner; return an error, do not divide by zero.\n- Two points with the same hash: break the tie by node name so every client agrees.\n- One label per node: the busiest node held 4,120 of 10,000 (twice its share). A hundred labels: 2,208 (about 10% over).",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-hash-code-w",
     "q": "e) Code. Write the Ring class: add(node), get(key), and get_bounded(key, load, cap). Say what each line costs.",
     "starter": "class Ring:\n    def __init__(self, vnodes=100):\n        ...\n    def add(self, node): ...\n    def get(self, key): ...\n    def get_bounded(self, key, load, cap): ...",
     "hint": "One sorted list of points, one dict point to node. get is bisect plus modulo. get_bounded is get in a loop that skips full nodes.",
     "solution": "import bisect\nimport hashlib\n\n\ndef h(text):                       # a 64-bit position on the ring\n    return int(hashlib.md5(text.encode()).hexdigest()[:16], 16)\n\n\nclass Ring:\n    def __init__(self, vnodes=100):\n        self.vnodes, self.points, self.owner = vnodes, [], {}\n\n    def add(self, node):           # many labels per node: \"n1#0\", \"n1#1\", ...\n        for i in range(self.vnodes):\n            p = h(f\"{node}#{i}\")\n            bisect.insort(self.points, p)\n            self.owner[p] = node\n\n    def get(self, key):            # the first point clockwise from the key\n        i = bisect.bisect(self.points, h(key)) % len(self.points)\n        return self.owner[self.points[i]]\n\n    def get_bounded(self, key, load, cap):   # walk on past nodes that are already full\n        i = bisect.bisect(self.points, h(key))\n        while True:\n            node = self.owner[self.points[i % len(self.points)]]\n            if load.get(node, 0) < cap:\n                return node\n            i += 1\n\n\nkeys = [f\"expert{i}\" for i in range(10000)]\n\n# what moves when a sixth node joins: mod N against the ring\nmod5 = {k: h(k) % 5 for k in keys}\nmod6 = {k: h(k) % 6 for k in keys}\nprint(\"mod N, 5 -> 6 nodes, keys moved:\", sum(mod5[k] != mod6[k] for k in keys))\n\nring = Ring()\nfor n in range(5):\n    ring.add(f\"n{n}\")\nbefore = {k: ring.get(k) for k in keys}\nring.add(\"n5\")\nafter = {k: ring.get(k) for k in keys}\nprint(\"ring, 5 -> 6 nodes, keys moved: \", sum(before[k] != after[k] for k in keys), \"(even share would be 1667)\")\n\n# skew: one label per node against a hundred\nfor v in (1, 100):\n    r = Ring(v)\n    for n in range(5):\n        r.add(f\"n{n}\")\n    counts = {}\n    for k in keys:\n        counts[r.get(k)] = counts.get(r.get(k), 0) + 1\n    print(f\"vnodes={v:3}: busiest node holds {max(counts.values())} of 10000 (even share 2000)\")\n\n# bounded load on the lopsided one-label ring: no node may hold more than ceil(1.25 * average)\nr2 = Ring(1)\nfor n in range(5):\n    r2.add(f\"n{n}\")\nload, cap = {}, -(-125 * len(keys) // (100 * 5))\nfor k in keys:\n    node = r2.get_bounded(k, load, cap)\n    load[node] = load.get(node, 0) + 1\nprint(\"bounded load, cap\", cap, \"-> busiest node holds\", max(load.values()))\n\n\n# What it printed:\n#   mod N, 5 -> 6 nodes, keys moved: 8348\n#   ring, 5 -> 6 nodes, keys moved:  1780 (even share would be 1667)\n#   vnodes=  1: busiest node holds 4120 of 10000 (even share 2000)\n#   vnodes=100: busiest node holds 2208 of 10000 (even share 2000)\n#   bounded load, cap 2500 -> busiest node holds 2500",
     "why": "Three methods, one sorted list. The point of the code is the two measured lines: 8,348 keys move with mod N, 1,780 with the ring.",
     "say": "**It is a sorted list and a binary search.** A node is a hundred labels on the circle. The owner of a key is the next label clockwise. Adding a node only takes keys from the labels it lands next to. That is why the move is about one in six and not five in six."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "What moves when a node joins?",
       "a": "About 1/(N+1) of the keys, all of them to the new node. With 5 nodes becoming 6 that is about 17%, and the run shows 1,780 of 10,000. With mod N it is 83%, the run shows 8,348."
      },
      {
       "q": "Why virtual nodes?",
       "a": "One point per node leaves uneven arcs: the busiest node held twice its share. With v points the spread shrinks about as 1/sqrt(v), so 100 points gives about 10%. They also carry weight: a node with twice the memory gets twice the points."
      },
      {
       "q": "What does bounded load add?",
       "a": "A cap of ceil((1 + eps) x average) per node, with eps = 0.25 here. A key that reaches a full node moves on clockwise. Google's post sets each server's capacity to the average load times (1 + eps), and a key goes clockwise to the first server with spare capacity. The cost is that a key's owner now depends on load, so every client needs the same load view."
      },
      {
       "q": "A key is very hot. Does the ring help?",
       "a": "No. Hashing spreads keys, not traffic. A hot key still sits on one node. Replicate that key to several nodes, or put a small cache in front, and say which."
      },
      {
       "q": "A node dies. What do you do?",
       "a": "Its keys fall to the next points clockwise. If the data is a cache, they miss once and refill from the source. If it is the source of truth, copies on the next two nodes mean nothing is lost."
      },
      {
       "q": "How do you add 10 nodes at once?",
       "a": "Add them one at a time, or all points together; the keys that move are the same either way. Move data in the background and keep serving from the old owner until the copy finishes."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: Consistent hashing",
       "url": "https://en.wikipedia.org/wiki/Consistent_hashing",
       "m": 8,
       "why": "The ring, virtual nodes and the 1/n move in one page. Opened and checked."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Google Research: Consistent hashing with bounded loads",
       "url": "https://research.google/blog/consistent-hashing-with-bounded-loads/",
       "m": 6,
       "why": "The cap of (1 + eps) x average per server and the walk clockwise to a server with room. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "Design HashMap",
       "d": "easy",
       "lc": "design-hashmap",
       "yt": [
        "cNWsgbKwwoU",
        "NeetCodeIO",
        15
       ],
       "why": "Buckets and a hash function by hand. A ring is the same idea with the bucket index replaced by a clockwise search."
      },
      {
       "n": "Random Pick with Weight",
       "d": "medium",
       "lc": "random-pick-with-weight",
       "yt": [
        "fWS0TCcr-lE",
        "Techdose",
        12
       ],
       "why": "Prefix sums and a binary search, the lookup you use on the ring. Weights here are the virtual node counts."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-rate",
   "title": "2. Rate limiting",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** Evaluation workers call a model provider, and the provider allows a fixed number of requests per second per key. Go over and you get 429 errors, and a bad enough burst can get the key throttled for minutes. Several AI-lab customers share your workers, so one customer must not eat the whole quota. **The naive way** is a counter that resets every minute. Its cost: a customer can send 100 calls at 0:59 and 100 more at 1:00. That is 200 calls in two seconds against a limit of 100 a minute. **The better ways** are a token bucket (a burst is allowed, the long run rate is capped), a sliding window log (exact, one timestamp per call) and a sliding window counter (two numbers per customer, a small error)."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-rate-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: quota unit, burst, per tenant or global. Errors: reject or delay, limiter down, provider says 429 anyway. Scope: one process or many, how exact.",
     "solution": "1. Primary capabilities\n- What is the quota: calls per second, tokens per minute, or both? Likely both, and a call costs tokens, so cost is not always 1.\n- Is a burst allowed? Likely yes, up to some size, because jobs start in waves.\n- Is the limit per tenant, global, or both? Likely both: each lab gets a share and the provider key has a total.\n\n2. Error handling\n- What happens to a call over the limit: reject, queue, or delay? Likely delay for batch work and reject for interactive.\n- What if the limiter itself is down? Likely fail open for a short time, with a lower local limit.\n- What if the provider answers 429 anyway? Likely yes, so honour Retry-After and slow the bucket down.\n\n3. Scope boundaries\n- One process or many workers? Say 40 workers, so the counters must be shared.\n- How exact must it be? Likely a few percent over is fine; a 2x burst is not.\n- Do we fix clocks across machines? Out of scope; use one clock source, the store's.",
     "why": "The unit of the quota (requests or tokens) and whether to reject or delay change the algorithm. Many workers means shared counters, and that is where the real cost sits.",
     "say": "**I ask what the quota is measured in, whether a burst is fine, and whether it is per tenant, global or both.** Then what happens to a call over the limit, and what if the limiter itself is down. Many workers is the question that turns this from a class into a system."
    },
    {
     "t": "write",
     "id": "infra-rate-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. At most `burst` calls pass at once; after that, at most `rate` per second on average.\n2. A rejected call does not use up tokens.\n3. A call passes only if the tenant bucket and the global bucket both have tokens, and then both are charged.\n4. Two windows side by side cannot let through twice the limit.\n5. A decision takes O(1) time and O(1) memory per tenant.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-rate-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Bucket: KEEP. Two numbers: tokens and last refill time. Refill is computed when asked, not on a timer\n- Tenant: KEEP. A dict tenant id to bucket\n- Global bucket: KEEP. One more bucket checked together with the tenant's\n- Request: DROP. Only its cost matters (1 call, or its token estimate)\n- Clock: KEEP as a parameter. Pass time in, so the code can be tested without sleeping\n- Window counters: KEEP for the other design. previous count, current count, window start",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-rate-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Token bucket. State: tokens and the time of the last refill. Rate 5 per second, burst 10.\n2. On a call at time t: tokens = min(burst, tokens + (t - last) x rate). If tokens >= cost, subtract cost and allow. Otherwise reject and change nothing. O(1), 16 bytes per tenant.\n3. Check: 30 calls at t = 0 let 10 through (the burst). 30 more at t = 1 let 5 through (one second of refill).\n4. Per tenant and global: refill both, then check both. Charge both only if both pass, never one alone, or a rejected call leaks a token. In the run, three tenants at 2 per second share a global 5: the answer is 2, 2 and 1.\n5. Sliding window log: keep one timestamp per call, drop the old ones, count. Exact, but 600 calls a minute is 600 timestamps, about 5 KB per tenant, 48 MB for 10,000 tenants.\n6. Sliding window counter: keep the previous window count and the current one. Estimate = previous x (share of the window still in view) + current. Two numbers, 160 KB for 10,000 tenants. Cloudflare reports 0.003% of 400 million requests wrongly decided, with an average gap of 6% from the true rate.\n7. Leaky bucket as a queue: calls drain at a fixed rate, so output has no bursts. Use it when the provider cannot take a burst. It adds delay; the token bucket does not.\n\nEdge cases:\n- Cost bigger than the burst: the call can never pass; reject it up front with a clear error.\n- Clock goes backwards: clamp elapsed time at 0.\n- Many workers: keep the counters in a shared store with an atomic increment, or give each worker a slice of the rate and rebalance slowly. The first costs a network call per request; the second is cheap and a little loose.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-rate-code-w",
     "q": "e) Code. Write TokenBucket (allow), allow_both for a tenant plus a global bucket, and the sliding window counter estimate.",
     "starter": "class TokenBucket:\n    def __init__(self, rate, burst, now=0.0): ...\n    def allow(self, now, cost=1): ...\n\ndef allow_both(tenant, glob, now, cost=1): ...\n\ndef sliding_counter(prev, cur, window, elapsed): ...",
     "hint": "Refill first, then compare. In allow_both refill both, check both, then subtract from both. The counter is one line of arithmetic.",
     "solution": "class TokenBucket:\n    \"\"\"rate tokens per second, at most burst held. Time is passed in, so it can be tested.\"\"\"\n    def __init__(self, rate, burst, now=0.0):\n        self.rate, self.burst, self.tokens, self.t = rate, burst, burst, now\n\n    def refill(self, now):\n        self.tokens = min(self.burst, self.tokens + (now - self.t) * self.rate)\n        self.t = now\n\n    def allow(self, now, cost=1):\n        self.refill(now)\n        if self.tokens >= cost:\n            self.tokens -= cost\n            return True\n        return False                       # rejected: the bucket is left as it is\n\n\ndef allow_both(tenant, glob, now, cost=1):\n    \"\"\"Spend from the tenant bucket and the global bucket, or from neither.\"\"\"\n    tenant.refill(now)\n    glob.refill(now)\n    if tenant.tokens >= cost and glob.tokens >= cost:\n        tenant.tokens -= cost\n        glob.tokens -= cost\n        return True\n    return False\n\n\ndef sliding_counter(prev, cur, window, elapsed):\n    \"\"\"Cloudflare's approximation: weight the previous window by the part of it still in view.\"\"\"\n    return prev * (window - elapsed) / window + cur\n\n\n# 1. burst and refill: 5 calls per second, burst 10\nb = TokenBucket(rate=5, burst=10)\nprint(\"30 calls at t=0   :\", sum(b.allow(0) for _ in range(30)), \"allowed\")\nprint(\"30 calls at t=1.0 :\", sum(b.allow(1.0) for _ in range(30)), \"allowed\")\n\n# 2. the fixed-window flaw: limit 100 per minute, 100 calls at 0:59 and 100 more at 1:00\nprint(\"fixed window lets through 200 calls in 2 seconds\")\nprint(\"sliding counter at 1:01, previous 100, current 100:\", sliding_counter(100, 100, 60, 1), \"-> reject\")\nprint(\"Cloudflare's example, previous 42, current 18, 15 s in:\", sliding_counter(42, 18, 60, 15), \"of 50\")\n\n# 3. per tenant 2 per second, global 5 per second, three tenants at the same instant\ntenants = [TokenBucket(2, 2) for _ in range(3)]\nglob = TokenBucket(5, 5)\nok = [sum(allow_both(t, glob, 0) for _ in range(4)) for t in tenants]\nprint(\"allowed per tenant:\", ok, \"| global total:\", sum(ok), \"(limit 5)\")\n\n\n# What it printed:\n#   30 calls at t=0   : 10 allowed\n#   30 calls at t=1.0 : 5 allowed\n#   fixed window lets through 200 calls in 2 seconds\n#   sliding counter at 1:01, previous 100, current 100: 198.33333333333331 -> reject\n#   Cloudflare's example, previous 42, current 18, 15 s in: 49.5 of 50\n#   allowed per tenant: [2, 2, 1] | global total: 5 (limit 5)",
     "why": "Time is a parameter so a test needs no sleep. The three printed groups are the three claims: the burst, the 2x flaw of a fixed window, and the shared quota.",
     "say": "**A bucket is two numbers.** Tokens and when I last looked. I top it up when a call arrives, and I spend only if there is enough. For a tenant and a global limit I check both before I spend from either."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "Token bucket or leaky bucket?",
       "a": "Token bucket allows a burst up to its depth and caps the long run rate. A leaky bucket used as a queue smooths output to a fixed rate with no burst, at the price of delay. As a meter it accepts the same calls as a token bucket. I pick by whether the provider can take a burst."
      },
      {
       "q": "Why not a fixed window?",
       "a": "It lets through up to twice the limit across a boundary: 100 at 0:59 and 100 at 1:00. A sliding window removes that. The log is exact and costs memory. The counter costs two numbers and is a few percent off."
      },
      {
       "q": "How do you rate limit across 40 workers?",
       "a": "Shared counters in Redis with an atomic increment cost one round trip per call and make Redis a dependency. Or each worker takes a slice (rate / 40) and a coordinator moves slices to busy workers. Say the tradeoff: exact against cheap."
      },
      {
       "q": "Limits count tokens, not calls. What changes?",
       "a": "The cost is the estimated tokens of the prompt plus the max output. Charge the estimate first, then refund or top up when the real usage is known. A call that can never fit is rejected at once."
      },
      {
       "q": "The limiter is down. What do you do?",
       "a": "Fail open with a small local limit for a few seconds, so the provider limit still holds roughly. Failing closed stops all evaluation work for a problem that is not the customer's."
      },
      {
       "q": "The provider returns 429 with Retry-After: 7. What now?",
       "a": "Drain the bucket for 7 seconds and stop retrying that key. Then lower the rate a little. The limiter and the retry code must agree, which leads to the retries chapter."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Cloudflare: Counting things, a lot of different things",
       "url": "https://blog.cloudflare.com/counting-things-a-lot-of-different-things/",
       "m": 10,
       "why": "Fixed window, log, leaky bucket and the sliding window counter, with the 42 x (45/60) + 18 = 49.5 example and their error numbers. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "Number of Recent Calls",
       "d": "easy",
       "lc": "number-of-recent-calls",
       "yt": [
        "HlmNEfcgyjM",
        "Nick White",
        5
       ],
       "why": "The sliding window log in its smallest form: a queue of timestamps, drop the old ones, count."
      },
      {
       "n": "Task Scheduler",
       "d": "medium",
       "lc": "task-scheduler",
       "yt": [
        "s8p8ukTyA2I",
        "NeetCode",
        18
       ],
       "why": "A cooldown between two uses of the same resource. It is the same arithmetic as spacing calls to stay under a rate."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-cache",
   "title": "3. Cache eviction: LRU and LFU",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** The platform calls a model to score the same kinds of answers again and again: the same rubric, the same expert answer, run on a new day or after a retry. Each call costs money and 2 to 10 seconds. A cache turns a repeat into a lookup. Memory is limited, so when it is full something must go. **The naive way** is to scan all entries for the oldest, O(n) per eviction, which is slow exactly when the cache is big. **The better way** is O(1): a hash map for lookup plus an order structure for eviction. LRU drops the entry untouched the longest. LFU drops the entry used least often. I ran a Redis cache in front of a CMS for 10 to 20K daily users, so I think in hit rates and not in hopes."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-cache-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: what is cached, entry count or bytes, read heavy. Errors: stale answers, two callers for one key, cache down. Scope: one process or shared, TTL, determinism.",
     "solution": "1. Primary capabilities\n- What is cached: model responses, embeddings, or both? Likely both, keyed by the full input.\n- Is the limit a count of entries or bytes? Likely bytes in real life; start with a count and say what changes.\n- Reads or writes first? Likely reads by far, so get must be O(1).\n\n2. Error handling\n- What if the answer is wrong or stale? Likely the model version changes, so it must be in the key.\n- What if two calls ask for the same missing key at once? Likely a stampede: one call should fill it.\n- What if the cache is down? Likely call the model and carry on.\n\n3. Scope boundaries\n- Is the cache in one process or shared? Say one process; a shared one is the same policy plus a network.\n- Do entries expire by time as well? Likely yes, a TTL, and say it is separate from eviction.\n- Is the model output deterministic? Only cache when temperature is 0 or the caller accepts a repeat.",
     "why": "What to cache decides the key. Bytes against count decides the eviction value. Stampede and staleness are the two failures you name before the interviewer does.",
     "say": "**I ask what goes in the cache and what makes an answer wrong.** For model calls the key is the model, the prompt and the settings, and a new model version changes the key. Then I ask if two callers can ask for the same missing key at once, because that needs one call and not two."
    },
    {
     "t": "write",
     "id": "infra-cache-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. get(key) and put(key, value) are O(1).\n2. The cache never holds more than `cap` entries.\n3. LRU: when full, the entry used longest ago is removed.\n4. LFU: when full, the entry used least often is removed; on a tie, the older one.\n5. The key for a model call changes when the model, the prompt or any setting changes.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-cache-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Entry: KEEP. Key and value; LFU also needs a use count\n- Hash map: KEEP. Key to value in O(1)\n- Recency order: KEEP. A doubly linked list; Python's OrderedDict is a hash map plus that list\n- Frequency buckets: KEEP for LFU. A dict count to OrderedDict of keys, plus min_freq\n- Model call key: KEEP. sha256 of model, prompt and settings\n- TTL: DROP here. Name it as separate: eviction is about space, TTL is about age",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-cache-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. LRU. A dict gives O(1) lookup. A doubly linked list orders keys from least to most recent. Python's OrderedDict is both.\n2. get: if missing return nothing. Otherwise move the key to the back and return it. O(1).\n3. put: store, move to the back. If the size is over cap, remove the front. O(1).\n4. LFU. Keep key to value, key to count, and for each count an ordered group of keys. Also keep min_freq, the smallest count in use.\n5. A use moves the key from group c to group c + 1. If group c was the minimum and is now empty, min_freq grows by 1. A new key goes in group 1 and sets min_freq to 1.\n6. When full, remove the oldest key of group min_freq. All O(1), no scan.\n7. Measure. 20 hot prompts take 80% of calls and 20% are one-off scans. With room for 30 entries the best possible hit rate is 0.80. LRU got 0.73 because the scan keys push hot ones out. LFU got 0.80.\n8. Model call specifics: key on a hash of the model name and version, the prompt and every setting. Cache when temperature is 0. Weigh an entry by (cost saved x hit rate) / size, and drop the lowest.\n\nEdge cases:\n- cap = 0: put stores nothing.\n- Updating an existing key counts as a use.\n- LFU keeps an old favourite forever; add aging (halve counts on a schedule) if the workload moves.\n- Two callers on one missing key: one calls the model, the other waits for its answer (single flight).",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-cache-code-w",
     "q": "e) Code. Write LRU with an OrderedDict, then LFU with the count groups. Say why each operation is O(1).",
     "starter": "class LRU:\n    def __init__(self, cap): ...\n    def get(self, k): ...\n    def put(self, k, v): ...\n\nclass LFU:\n    def __init__(self, cap): ...\n    def get(self, k): ...\n    def put(self, k, v): ...",
     "hint": "LRU: move_to_end on use, popitem(last=False) on overflow. LFU: by_freq[count] is an OrderedDict; track min_freq and bump it only when the minimum group empties.",
     "solution": "import hashlib\nimport json\nimport random\nfrom collections import OrderedDict, defaultdict\n\n\nclass LRU:\n    \"\"\"OrderedDict is a hash map plus a doubly linked list: get and put are O(1).\"\"\"\n    def __init__(self, cap):\n        self.cap, self.d = cap, OrderedDict()\n\n    def get(self, k):\n        if k not in self.d:\n            return None\n        self.d.move_to_end(k)                  # most recent goes to the back\n        return self.d[k]\n\n    def put(self, k, v):\n        self.d[k] = v\n        self.d.move_to_end(k)\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)         # drop the front: least recently used\n\n\nclass LFU:\n    \"\"\"freq -> keys in recency order, plus min_freq. get and put are O(1).\"\"\"\n    def __init__(self, cap):\n        self.cap, self.val, self.freq = cap, {}, {}\n        self.by_freq, self.min_freq = defaultdict(OrderedDict), 0\n\n    def _touch(self, k):\n        f = self.freq[k]\n        del self.by_freq[f][k]\n        if not self.by_freq[f] and self.min_freq == f:\n            self.min_freq += 1                 # nothing is left at the old minimum\n        self.freq[k] = f + 1\n        self.by_freq[f + 1][k] = None\n\n    def get(self, k):\n        if k not in self.val:\n            return None\n        self._touch(k)\n        return self.val[k]\n\n    def put(self, k, v):\n        if k in self.val:\n            self.val[k] = v\n            return self._touch(k)\n        if len(self.val) >= self.cap:\n            old, _ = self.by_freq[self.min_freq].popitem(last=False)   # least used, oldest on a tie\n            del self.val[old], self.freq[old]\n        self.val[k], self.freq[k] = v, 1\n        self.by_freq[1][k] = None\n        self.min_freq = 1\n\n\ndef model_key(model, prompt, **params):\n    \"\"\"The cache key for a model call: everything that changes the answer.\"\"\"\n    return hashlib.sha256(json.dumps([model, prompt, params], sort_keys=True).encode()).hexdigest()\n\n\ndef hit_rate(cache, trace):\n    hits = 0\n    for k in trace:\n        if cache.get(k) is not None:\n            hits += 1\n        else:\n            cache.put(k, 1)\n    return hits / len(trace)\n\n\nc = LRU(2); c.put(\"a\", 1); c.put(\"b\", 2); c.get(\"a\"); c.put(\"c\", 3)\nprint(\"LRU cap 2, b evicted:\", c.get(\"b\"), c.get(\"a\"), c.get(\"c\"))\nc = LFU(2); c.put(\"a\", 1); c.put(\"b\", 2); c.get(\"a\"); c.put(\"c\", 3)\nprint(\"LFU cap 2, b evicted:\", c.get(\"b\"), c.get(\"a\"), c.get(\"c\"))\n\nrng = random.Random(7)                         # 80% of calls hit 20 hot prompts, 20% are one-off scans\ntrace = [f\"hot{rng.randrange(20)}\" if rng.random() < 0.8 else f\"scan{i}\" for i in range(20000)]\nprint(\"hit rate with room for 30: LRU %.2f, LFU %.2f\" % (hit_rate(LRU(30), trace), hit_rate(LFU(30), trace)))\nsame = model_key(\"m1\", \"Rate this answer\", temperature=0)\nprint(\"same call, same key:\", same == model_key(\"m1\", \"Rate this answer\", temperature=0),\n      \"| other temperature, same key:\", same == model_key(\"m1\", \"Rate this answer\", temperature=1))\n\n\n# What it printed:\n#   LRU cap 2, b evicted: None 1 3\n#   LFU cap 2, b evicted: None 1 3\n#   hit rate with room for 30: LRU 0.73, LFU 0.80\n#   same call, same key: True | other temperature, same key: False",
     "why": "Two small classes and a measured hit rate. The model_key function is the answer to what to cache: everything that changes the answer goes into the key.",
     "say": "**LRU is a dictionary that remembers order.** On every use the key goes to the back, and when I am full I drop the front. LFU keeps a group per count and one number for the smallest count, so evicting never scans."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "LRU or LFU for model calls?",
       "a": "It depends on the trace. A scan of one-off prompts pollutes LRU, so hot entries fall out; the run shows 0.73 against 0.80. LFU holds the hot ones but keeps old favourites, so I add aging. If I cannot measure, I start with LRU because it is simple, then look at the hit rate."
      },
      {
       "q": "Why a doubly linked list and not a singly linked one?",
       "a": "To remove a node from the middle in O(1) I need its previous node. The dict points straight at the node, and the previous pointer makes the unlink constant time."
      },
      {
       "q": "Count of entries or bytes?",
       "a": "Bytes. An embedding is a few hundred bytes and a long answer is several KB, so a count lets a few big answers eat the memory. Track size per entry and evict until the total fits."
      },
      {
       "q": "What about the cost of a miss?",
       "a": "Misses are not equal. A 10-second model call is worth keeping over a 50 ms lookup. Weigh by cost saved x hit rate / size. Plain LRU and LFU ignore that."
      },
      {
       "q": "How do you keep the cache from serving a stale answer?",
       "a": "Put the model name and version in the key, so a new version misses by design. Add a TTL for anything that depends on outside data. Do not try to invalidate; change the key."
      },
      {
       "q": "Ten workers ask for the same missing key. What happens?",
       "a": "Ten model calls and ten bills. One worker takes a lock or a marker for the key and calls; the rest wait and read its answer, with a timeout. That is the stampede answer from the caching sessions wc33 and wc34."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: Cache replacement policies",
       "url": "https://en.wikipedia.org/wiki/Cache_replacement_policies",
       "m": 8,
       "why": "LRU, LFU, scan pollution, and why LFU needs aging. Opened and checked. The O(1) structures are in the problems below."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "LRU Cache",
       "d": "medium",
       "lc": "lru-cache",
       "yt": [
        "7ABFKPK2hD4",
        "NeetCode",
        18
       ],
       "why": "The exact class above, by hand with a linked list."
      },
      {
       "n": "LFU Cache",
       "d": "hard",
       "lc": "lfu-cache",
       "yt": [
        "bLEIHn-DgoA",
        "NeetCodeIO",
        15
       ],
       "why": "The harder follow-up: count groups and min_freq in O(1)."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-lb",
   "title": "4. Load balancing",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** A job spreads 10,000 evaluation calls over 100 workers or over several model endpoints. Some calls are 100 times slower than others, and a worker can fall behind. Where does each call go? **The naive way** is round robin: call i goes to worker i mod 100. It is perfect when every job costs the same, and it ignores the queue when they do not. **The next way** is least connections: send to the server with the least work. It is good with fresh numbers and bad with old ones, because every client sees the same best server and sends to it at once. **The better way** is the power of two choices: pick two servers at random and take the lighter one."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-lb-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: equal jobs, equal servers, stickiness. Errors: dead or slow server, stale load data, many balancers. Scope: how big, how even.",
     "solution": "1. Primary capabilities\n- Are the jobs equal in cost? Likely no; some are 100 times longer.\n- Are the servers equal? Likely no; weights matter.\n- Do requests need to stick to one server (a session, a warm cache)? Likely some do.\n\n2. Error handling\n- What if a server dies or slows down? Likely health checks, and the balancer stops sending to it.\n- How fresh is the load information? Likely stale by tens of milliseconds, and that decides the algorithm.\n- What if many balancers run at once? Likely yes, and they share no state.\n\n3. Scope boundaries\n- How many servers and how many requests per second? Say 100 servers, 10,000 requests.\n- Do we need exact balance, or no server above 1.3x the average? Likely the second.\n- Out of scope: connection draining and TLS. Name them and move on.",
     "why": "Job variance picks round robin or a queue-aware method. Stale load data is the question that explains why 'send to the least loaded' fails and why two random choices work.",
     "say": "**I ask whether jobs are equal, whether the servers are equal, and how fresh my view of the load is.** Equal jobs: round robin is enough. Unequal jobs with a stale view: two random choices, take the lighter."
    },
    {
     "t": "write",
     "id": "infra-lb-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. Every request goes to a healthy server.\n2. With equal jobs, no server gets more than average + 1 (round robin).\n3. With 100 servers and 10,000 requests, the busiest server stays within 10% of the average of 100.\n4. A balancer needs no shared lock and no global view.\n5. A server with weight 2 gets twice the share.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-lb-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Server: KEEP. Name, weight, health, a load number\n- Load number: KEEP. Open requests or queued work; a possibly stale snapshot\n- Picker: KEEP. A function: servers, snapshot to server\n- Request: KEEP its cost. Only if it is known; else count it as 1\n- Session table: DROP. Mention hash on session id for stickiness\n- Health checker: DROP. Name it: it removes servers from the pool",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-lb-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Round robin: pointer i, send to i mod n, move on. Zero state, zero queries. With equal jobs the busiest server gets 100 of 10,000 requests, the even share.\n2. Random: each request picks any server. The busiest server got 129 against an average of 100, about 29% over. That is the noise of throwing 10,000 balls into 100 bins.\n3. Least loaded with fresh numbers: always the best, busiest 100. The cost is a lookup of every server for every request.\n4. Least loaded with a snapshot refreshed every 200 requests: every request in that period sees the same lightest server and goes there. The busiest server got 200, twice the average. This is the herd.\n5. Two choices: pick two servers at random, send to the lighter. It needs only two reads per request. With fresh data the busiest got 102. With the stale snapshot it got 105, because two random servers are rarely the same pair for everyone.\n6. Why it works: a server much above average loses most of the two-way contests it enters, so heavy servers stop growing. The gap between the busiest server and the average shrinks from about ln n / ln ln n to about ln ln n, from the balls-and-bins result.\n7. Uneven jobs (about 1 in 100 is 100 times longer): the even share is 203. Round robin's busiest server got 397, since it never sees the queue. Two choices got 329.\n\nEdge cases:\n- Fewer than 2 healthy servers: pick the one, or fail.\n- Picking the same server twice: sample two different ones.\n- Weights: pick by weight, or compare load divided by weight.\n- Stickiness: hash the session id, and fall back to a pick when the chosen server is down.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-lb-code-w",
     "q": "e) Code. Write run(n_servers, n_requests, pick, refresh) and three pickers: random, least loaded, two choices. Say what you measure.",
     "starter": "def run(n_servers, n_requests, pick, refresh):\n    ...\n\ndef pick_random(seen, rng): ...\ndef pick_least(seen, rng): ...\ndef pick_two(seen, rng): ...",
     "hint": "Keep real load and a snapshot. Refresh the snapshot every `refresh` requests. The picker only sees the snapshot. Return the maximum real load.",
     "solution": "import random\n\n\ndef run(n_servers, n_requests, pick, refresh, seed=1):\n    \"\"\"Each request goes where `pick` says, using a load snapshot refreshed every `refresh` requests.\"\"\"\n    rng = random.Random(seed)\n    load, seen = [0] * n_servers, [0] * n_servers\n    for i in range(n_requests):\n        if i % refresh == 0:\n            seen = load[:]                          # a possibly stale view of the real load\n        load[pick(seen, rng)] += 1\n    return max(load)\n\n\ndef pick_random(seen, rng):\n    return rng.randrange(len(seen))\n\n\ndef pick_least(seen, rng):\n    return seen.index(min(seen))                    # the best server, as last seen\n\n\ndef pick_two(seen, rng):\n    a, b = rng.sample(range(len(seen)), 2)          # two at random, the lighter one wins\n    return a if seen[a] <= seen[b] else b\n\n\nN, R = 100, 10000\nprint(\"average load per server:\", R // N)\nprint(\"round robin, equal jobs: busiest gets\", -(-R // N))\nfor refresh in (1, 200):\n    print(f\"load data refreshed every {refresh:3} requests, busiest server:\",\n          \"random\", run(N, R, pick_random, refresh),\n          \"| least loaded\", run(N, R, pick_least, refresh),\n          \"| two choices\", run(N, R, pick_two, refresh))\n\n# about one job in a hundred is 100 times slower; round robin does not look at the queue, two choices does\nrng = random.Random(3)\ncost = [100 if rng.random() < 0.01 else 1 for _ in range(R)]\nrr, tc = [0] * N, [0] * N\nfor i, c in enumerate(cost):\n    rr[i % N] += c\n    a, b = rng.sample(range(N), 2)\n    tc[a if tc[a] <= tc[b] else b] += c\nprint(\"uneven jobs, busiest server -> round robin:\", max(rr), \"| two choices:\", max(tc), \"| even share:\", sum(cost) // N)\n\n\n# What it printed:\n#   average load per server: 100\n#   round robin, equal jobs: busiest gets 100\n#   load data refreshed every   1 requests, busiest server: random 129 | least loaded 100 | two choices 102\n#   load data refreshed every 200 requests, busiest server: random 129 | least loaded 200 | two choices 105\n#   uneven jobs, busiest server -> round robin: 397 | two choices: 329 | even share: 203",
     "why": "The snapshot is the whole point. With refresh 1 the data is fresh, with 200 it is stale, and the herd shows up as a busiest server of 200.",
     "say": "**Two random choices, take the lighter.** It needs two reads, not a scan, and it still works when my numbers are old. The best server in a stale list is the best for everybody, so everybody goes there. Two random ones are different for different callers."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "Why does two choices beat one so much?",
       "a": "With one random choice the busiest server drifts above the average by about ln n / ln ln n. With the better of two it is about ln ln n. That is an exponential improvement from one extra read. The run shows 129 against 102."
      },
      {
       "q": "Why not always pick the least loaded?",
       "a": "It is best with fresh data (busiest 100) and worst with stale data (busiest 200): the herd. Fresh data from every server per request also costs a lookup of all of them."
      },
      {
       "q": "When is round robin right?",
       "a": "When jobs cost about the same and servers are alike. It needs no state and no reads. With uneven jobs it ignores the queue, and the run shows 397 against an even share of 203."
      },
      {
       "q": "What is least connections, and when does it fail?",
       "a": "Send to the server with the fewest open requests. It handles uneven jobs well. It fails when many balancers act on old counts, or when open connections are not a good measure of work, as with long-lived idle connections."
      },
      {
       "q": "How do you handle servers of different sizes?",
       "a": "Weights: give a server with twice the capacity twice the share, or compare load divided by capacity in the two-choices contest."
      },
      {
       "q": "Many balancers, no shared state. What do you do?",
       "a": "Two choices, because it needs no coordination and tolerates old data. For stickiness, consistent hashing on the session id from chapter 1, with the bounded-load variant so a hot key does not drown one server."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Marc Brooker: Two random choices",
       "url": "https://brooker.co.za/blog/2012/01/17/two-random.html",
       "m": 6,
       "why": "A simulation with stale load data: best of two beats both random and pick-the-best when the numbers are old. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "Random Pick with Weight",
       "d": "medium",
       "lc": "random-pick-with-weight",
       "yt": [
        "fWS0TCcr-lE",
        "Techdose",
        12
       ],
       "why": "Weighted choice by prefix sums and binary search: the weighted server pick."
      },
      {
       "n": "Find Servers That Handled Most Number of Requests",
       "d": "hard",
       "lc": "find-servers-that-handled-most-number-of-requests",
       "yt": [
        "majyT38GSKE",
        "Coder on A Farm",
        16
       ],
       "why": "Round robin with busy servers: find the next free server clockwise. A sorted set and a heap."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-retry",
   "title": "5. Retries: backoff, budgets and idempotency",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** A job calls a model provider, and the provider fails now and then: a timeout, a 503, a 429. Another job pays an expert through a payment API, and the reply is lost on the way back. Do you try again? **The naive way** is to retry at once, a fixed number of times. Its cost: when the provider is struggling, every client retries at the same moment and the load doubles or triples. Three layers that each retry 3 times turn one request into 27. **The better way** has three parts: wait with exponential backoff and full jitter, cap the retries with a budget, and make the call safe to repeat with an idempotency key."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-retry-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: which errors, is it safe to repeat, deadline. Errors: Retry-After, all retries fail, lost reply. Scope: how many clients, how many layers.",
     "solution": "1. Primary capabilities\n- Which errors are worth retrying? Likely timeouts, 429, 500, 502, 503 and 504. Not 400 or 401.\n- Is the call safe to repeat? A read is. A payment is not, unless it carries an idempotency key.\n- Is there a deadline for the whole job? Likely yes, and retries must fit inside it.\n\n2. Error handling\n- What if the provider sends Retry-After? Likely honour it before our own delay.\n- What if every retry also fails? Likely give up after a cap and surface the error, with a record to retry later.\n- What if the reply is lost but the work was done? Likely a second attempt, so the server must deduplicate.\n\n3. Scope boundaries\n- One client or many? Say hundreds of workers, so they must not retry together.\n- Do retries happen at one layer or several? Name the 27x risk and say one layer retries.\n- Out of scope: circuit breakers. Name them as the next step after the budget.",
     "why": "Safe to repeat decides whether an idempotency key is needed. Many clients decide whether jitter is needed. Several layers is the multiplier question, 3 x 3 x 3.",
     "say": "**I ask which errors are worth another try and whether the call is safe to repeat.** If it is a payment, I need an idempotency key before I think about timing. Then I ask how many clients there are, because that is why I add jitter."
    },
    {
     "t": "write",
     "id": "infra-retry-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. Retry only the errors named as retryable.\n2. The wait before attempt n is random between 0 and min(cap, base x 2^n).\n3. Retries never exceed 10% of first tries in a window (a budget).\n4. Repeating a call with the same idempotency key does the work once and returns the first result.\n5. Stop at the job deadline or after max attempts, whichever comes first.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-retry-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Attempt: KEEP. A counter, which sets the ceiling of the wait\n- Delay function: KEEP. Full jitter: uniform(0, min(cap, base x 2^attempt))\n- Retry budget: KEEP. Two counters: first tries and retries; allow a retry while retries < ratio x first\n- Idempotency key: KEEP. A unique id the client makes once per logical operation\n- Result store: KEEP. Dict key to result, with a TTL, kept by the server\n- Circuit breaker: DROP. Name it as the step after the budget",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-retry-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Backoff. The ceiling for attempt n is min(30 s, 0.5 s x 2^n): 0.5, 1, 2, 4, 8 ... up to 30.\n2. Full jitter: wait a random time between 0 and the ceiling. Clients that failed together now retry at different times.\n3. Measure it: 100 clients start at once at a service that answers 20 per second. With a fixed ladder (2, 4, 8 s) they came back in waves: 300 calls and 31 seconds to finish. With full jitter: 255 calls and 17 seconds. Fewer calls and sooner done.\n4. Budget. Count first tries and retries. Allow a retry only while retries < 10% of first tries. After 100 first tries, 10 retries are allowed, no more. This stops a struggling service from getting three times the load.\n5. Layers. If each of 3 layers retries 3 times, the bottom sees 27 calls per request. Retry at one layer, near the caller, and pass the error up from the others.\n6. Idempotency. The client makes a key per operation (order-17). The server looks it up: if found, return the stored result; if not, do the work, store the result with the key, return it. The order of those last steps matters: store and do the work together, in one transaction, or two attempts can both run.\n7. Stop on whichever comes first: max attempts (say 5) or the deadline. Return the last error with the attempt count.\n\nEdge cases:\n- Retry-After larger than the backoff: wait for Retry-After.\n- Same key, different body: reject with an error, it is a client bug.\n- Two attempts at once with one key: the store's unique key makes the second wait or fail.\n- A 400 or 401: do not retry, it will fail again.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-retry-code-w",
     "q": "e) Code. Write backoff (full jitter), RetryBudget, and IdempotentCall. Then the storm test that compares a ladder with jitter.",
     "starter": "def backoff(attempt, base=0.5, cap=30, rng=random): ...\n\nclass RetryBudget:\n    def first_try(self): ...\n    def may_retry(self): ...\n\nclass IdempotentCall:\n    def __call__(self, key, *args): ...",
     "hint": "backoff is one line with uniform. The budget compares two counters. IdempotentCall is a dict: if the key is missing, run the work and store the result.",
     "solution": "import random\n\n\ndef backoff(attempt, base=0.5, cap=30, rng=random):\n    \"\"\"Full jitter: wait a random time between 0 and min(cap, base * 2^attempt).\"\"\"\n    return rng.uniform(0, min(cap, base * 2 ** attempt))\n\n\nclass RetryBudget:\n    \"\"\"Retries may add at most `ratio` extra calls on top of first tries.\"\"\"\n    def __init__(self, ratio=0.1):\n        self.ratio, self.first, self.retries = ratio, 0, 0\n\n    def first_try(self):\n        self.first += 1\n\n    def may_retry(self):\n        if self.retries < self.ratio * self.first:\n            self.retries += 1\n            return True\n        return False\n\n\nclass IdempotentCall:\n    \"\"\"Same key, same result: a retry after a lost reply does not do the work twice.\"\"\"\n    def __init__(self, work):\n        self.work, self.done, self.runs = work, {}, 0\n\n    def __call__(self, key, *args):\n        if key not in self.done:\n            self.runs += 1\n            self.done[key] = self.work(*args)\n        return self.done[key]\n\n\ndef storm(delay, clients=100, per_sec=20, seed=5):\n    \"\"\"100 clients call at second 0. The service answers 20 per second; the rest fail and retry later.\"\"\"\n    rng = random.Random(seed)\n    due_at = {c: 0.0 for c in range(clients)}\n    tries = {c: 0 for c in range(clients)}\n    calls = t = 0\n    while due_at:\n        now = [c for c, when in due_at.items() if int(when) == t]\n        calls += len(now)\n        for c in now[:per_sec]:\n            del due_at[c]                                # served\n        for c in now[per_sec:]:\n            tries[c] += 1\n            due_at[c] = t + delay(tries[c], rng)         # failed: wait, then call again\n        t += 1\n    return calls, t\n\n\nladder = lambda a, rng: min(30, 2 ** a)                 # 2, 4, 8 seconds: everyone waits the same\njitter = lambda a, rng: max(1, backoff(a, 1, 30, rng))  # random between 0 and the ladder step\nprint(\"100 clients, 20 served per second, ladder, no jitter: calls=%d, seconds=%d\" % storm(ladder))\nprint(\"100 clients, 20 served per second, full jitter      : calls=%d, seconds=%d\" % storm(jitter))\n\nb = RetryBudget(0.1)\nfor _ in range(100):\n    b.first_try()\nprint(\"retries allowed after 100 first tries at a 10% budget:\", sum(b.may_retry() for _ in range(50)))\n\npay = IdempotentCall(lambda amount: f\"paid {amount}\")\nprint(pay(\"order-17\", 40), \"|\", pay(\"order-17\", 40), \"| the work ran\", pay.runs, \"time\")\n\n\n# What it printed:\n#   100 clients, 20 served per second, ladder, no jitter: calls=300, seconds=31\n#   100 clients, 20 served per second, full jitter      : calls=255, seconds=17\n#   retries allowed after 100 first tries at a 10% budget: 10\n#   paid 40 | paid 40 | the work ran 1 time",
     "why": "Three small pieces and one measurement. The storm run is the claim that jitter helps, in numbers: 300 calls and 31 s against 255 calls and 17 s.",
     "say": "**Random wait, a cap on retries, and a key.** The random wait spreads the clients. The cap stops a retry storm from finishing off a service that is already hurt. The key makes a repeat safe, so a lost reply does not mean a second payment."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "Why jitter, if backoff already grows?",
       "a": "Backoff alone keeps clients that failed together in step; they come back in waves. Jitter spreads them. The AWS Architecture Blog compares full, equal and decorrelated jitter in a simulation and finds jitter cuts the number of calls a lot."
      },
      {
       "q": "Full jitter or equal jitter?",
       "a": "Full jitter: uniform from 0 to the ceiling. Equal jitter keeps half the ceiling fixed and randomises the other half. In AWS's simulation equal jitter was the slowest of the jittered options. I start with full jitter."
      },
      {
       "q": "What is a retry budget?",
       "a": "A cap on retries as a share of normal traffic, say 10%. When the service is down, retries cannot multiply the load by 3. It is also called a retry ratio or retry throttling."
      },
      {
       "q": "Where do you put the retries in a stack?",
       "a": "In one layer, close to the caller who knows the deadline. If every layer retries 3 times, one request becomes 27. Lower layers fail fast and pass the error up."
      },
      {
       "q": "How does an idempotency key work for a payment to an expert?",
       "a": "The client makes a key for the logical payment. The server stores key to result. A second request with the same key returns the stored result. Keep keys for a day or longer than the longest retry window, and compare the body so a reused key with a different amount is rejected."
      },
      {
       "q": "Which errors do you not retry?",
       "a": "Anything the caller must fix: 400, 401, 403, 404, 422. A retry changes nothing. For 429 and 503, retry after the wait the server gives."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "AWS Architecture Blog: Exponential backoff and jitter",
       "url": "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/",
       "m": 10,
       "why": "Full, equal and decorrelated jitter compared in a 100-client simulation. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "Task Scheduler",
       "d": "medium",
       "lc": "task-scheduler",
       "yt": [
        "s8p8ukTyA2I",
        "NeetCode",
        18
       ],
       "why": "Waiting out a cooldown between attempts. No LeetCode problem asks about backoff; this is the closest arithmetic on gaps."
      },
      {
       "n": "Number of Recent Calls",
       "d": "easy",
       "lc": "number-of-recent-calls",
       "yt": [
        "HlmNEfcgyjM",
        "Nick White",
        5
       ],
       "why": "Counting calls in a window: the check behind a retry budget."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-bloom",
   "title": "6. Membership at scale: the Bloom filter",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** Millions of applicants and answers arrive. For each new one you ask: have we seen this id or this answer before? The exact record sits in a database, and a database read costs about a millisecond. **The naive way** is a hash set in memory. It is exact and fast, and for 100,000 ids it takes about 7 MB; for 1 billion ids it takes about 70 GB. **The better way** is a Bloom filter in front of the database. It answers 'definitely not seen' or 'maybe seen' from about 10 bits per id. 'Definitely not' skips the database. 'Maybe' goes to the exact store to confirm. Mercor candidates have reported a check-and-insert question about a million user ids that goes this way."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-bloom-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: item count, target error rate, add only or delete too. Errors: false positive cost, false negatives, over-filling. Scope: one server or many, persisted or rebuilt.",
     "solution": "1. Primary capabilities\n- How many items, and what error rate is acceptable? Say 100 million ids, 1% false positives.\n- Do we only add, or also remove? Likely add only at first; deletes are a follow-up.\n- Is 'maybe' acceptable? Likely yes, if the exact store confirms it.\n\n2. Error handling\n- What does a false positive cost? Likely one extra database read, which is fine.\n- What does a false negative cost? It must never happen. A Bloom filter has none.\n- What if we insert more than planned? The false positive rate climbs; resize and rebuild.\n\n3. Scope boundaries\n- One server or many? Say a filter per shard, sized for that shard.\n- Persisted or rebuilt on start? Likely rebuilt from the database on start.\n- Exact answers? Out of scope: the exact store is the source of truth.",
     "why": "The error rate and the count give the size. 'Does a false positive cost much' is the question that justifies a Bloom filter at all: if one extra read is cheap, a 1% error is a good trade.",
     "say": "**I ask how many items and how wrong I may be.** A false positive costs one extra read, a false negative is never allowed, and a Bloom filter has none of those. Then I ask if I need deletes, because that changes the structure."
    },
    {
     "t": "write",
     "id": "infra-bloom-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. maybe(x) is true for every x that was added (no false negatives).\n2. For x never added, maybe(x) is true with probability about p = 1%.\n3. For n = 100,000 ids and p = 1%, memory is under 150 KiB.\n4. add and maybe each take k hash steps, independent of n.\n5. After removal in a counting filter, the removed id is no longer reported (unless another id shares all its spots).",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-bloom-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Bit array: KEEP. m bits, all zero at the start\n- Hash functions: KEEP. k of them; get k spots from one digest by double hashing: a + i x b\n- Item: KEEP. A string id, hashed\n- Exact store: KEEP outside. The database that confirms a 'maybe'\n- Counters: KEEP for deletes. Small numbers in place of bits; the counting Bloom filter\n- Size formula: KEEP. m = -n ln p / (ln 2)^2 and k = (m / n) ln 2",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-bloom-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Choose p and n. Compute m = -n ln p / (ln 2)^2. For n = 100,000 and p = 1%: m = 958,506 bits, which is 117 KiB, 9.6 bits per id.\n2. Choose k = (m / n) ln 2. Here k = 7.\n3. add(x): compute 7 spots from the hash of x and set those bits to 1.\n4. maybe(x): compute the 7 spots. If any bit is 0, x was never added: answer 'definitely not'. If all are 1, answer 'maybe'.\n5. Why no false negatives: add set those bits and nothing ever clears them.\n6. Check by running it: 100,000 absent ids gave 1,005 false positives, 1.00%. A Python set of the same ids would take about 6.8 MB, 58 times more.\n7. Overfill: the false positive rate is about (1 - e^(-kn/m))^k. At twice the planned n the same 117 KiB gives (1 - e^(-1.46))^7, about 16%. Plan for growth, or rebuild larger.\n8. Deletes: store a small counter per spot. add increments, remove decrements. Cost: with 4-bit counters, 4 times the memory, about 470 KiB here.\n\nEdge cases:\n- Removing an id that was never added in a counting filter corrupts it; check with the exact store first.\n- A counter at its maximum must stay put, or a later remove gives a false negative.\n- p very small: k grows; 0.1% needs k = 10 and 14.4 bits per id.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-bloom-code-w",
     "q": "e) Code. Write Bloom(n, p) with add and maybe, using the size formulas. Then CountingBloom with remove.",
     "starter": "class Bloom:\n    def __init__(self, n, p): ...\n    def add(self, item): ...\n    def maybe(self, item): ...\n\nclass CountingBloom(Bloom):\n    def remove(self, item): ...",
     "hint": "m and k come from the formulas. One sha256 digest gives two numbers a and b; the spots are (a + i x b) mod m for i in range(k).",
     "solution": "import hashlib\nimport math\n\n\nclass Bloom:\n    def __init__(self, n, p):\n        self.m = math.ceil(-n * math.log(p) / math.log(2) ** 2)      # bits\n        self.k = round(self.m / n * math.log(2))                     # hash functions\n        self.bits = bytearray(self.m)                                # a byte per bit, for clarity\n\n    def _spots(self, item):\n        d = hashlib.sha256(item.encode()).digest()\n        a, b = int.from_bytes(d[:8], \"big\"), int.from_bytes(d[8:16], \"big\")\n        return [(a + i * b) % self.m for i in range(self.k)]         # double hashing: k spots from one digest\n\n    def add(self, item):\n        for s in self._spots(item):\n            self.bits[s] = 1\n\n    def maybe(self, item):\n        return all(self.bits[s] for s in self._spots(item))\n\n\nclass CountingBloom(Bloom):\n    \"\"\"Counters in place of bits, so an item can be removed.\"\"\"\n    def add(self, item):\n        for s in self._spots(item):\n            self.bits[s] = min(255, self.bits[s] + 1)\n\n    def remove(self, item):\n        for s in self._spots(item):\n            self.bits[s] = max(0, self.bits[s] - 1)\n\n\nf = Bloom(n=100000, p=0.01)\nprint(f\"n=100000, p=1%: m={f.m} bits ({f.m // 8 // 1024} KiB), k={f.k}, {f.m / 100000:.1f} bits per item\")\nfor i in range(100000):\n    f.add(f\"user{i}\")\nassert all(f.maybe(f\"user{i}\") for i in range(100000))               # no false negatives\nfp = sum(f.maybe(f\"stranger{i}\") for i in range(100000))\nprint(\"false positives among 100000 absent ids:\", fp, f\"({fp / 1000:.2f}%)\")\nprint(\"a Python set of the same ids takes about\", 100000 * 70 // 1024, \"KiB\")\n\nc = CountingBloom(n=1000, p=0.01)\nc.add(\"user1\"); c.add(\"user2\")\nc.remove(\"user1\")\nprint(\"after removing user1 -> user1:\", c.maybe(\"user1\"), \"| user2:\", c.maybe(\"user2\"))\n\n\n# What it printed:\n#   n=100000, p=1%: m=958506 bits (117 KiB), k=7, 9.6 bits per item\n#   false positives among 100000 absent ids: 1005 (1.00%)\n#   a Python set of the same ids takes about 6835 KiB\n#   after removing user1 -> user1: False | user2: True",
     "why": "The printed size is the formula made concrete: 9.6 bits an id. The measured false positive rate of 1.00% is the check that the sizing is right.",
     "say": "**Ten bits an id buys a one in a hundred error.** I set k bits when I add, and I check the same k bits when I ask. One zero among them and I am sure it was never added. All ones and I still ask the database."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "What is the false positive rate?",
       "a": "About (1 - e^(-kn/m))^k. With the best k = (m / n) ln 2, it is about 0.6185^(m/n). So 9.6 bits per item gives 1%, and each extra 4.8 bits divides the error by 10 roughly."
      },
      {
       "q": "Why are there no false negatives?",
       "a": "An added item set its bits and no operation clears a bit. So all its bits are 1 when you ask later."
      },
      {
       "q": "How do you delete?",
       "a": "A counting Bloom filter: counters in place of bits, add increments, remove decrements. It costs about 4 times the memory. A cuckoo filter is another way. Or rebuild the plain filter on a schedule."
      },
      {
       "q": "What happens when you pass the planned n?",
       "a": "The false positive rate climbs: at twice n, a 1% filter gives about 16%. A scalable Bloom filter adds a second, bigger filter when the first fills, or you rebuild."
      },
      {
       "q": "Where does it sit in the system?",
       "a": "In front of the exact store. 'Definitely not' means insert without a read. 'Maybe' means check the store. For two servers that receive the same new id, the store still needs a unique key or a conditional insert; the filter only saves reads."
      },
      {
       "q": "Bloom filter or hash set?",
       "a": "A set when memory allows: it is exact. A Bloom filter when the set is too large for memory or the 'no' answer saves a slow read. At 100 million ids that is about 120 MB against about 7 GB."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: Bloom filter",
       "url": "https://en.wikipedia.org/wiki/Bloom_filter",
       "m": 10,
       "why": "The false positive formula, the optimal k, 9.6 bits per element at 1%, and counting filters. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
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
       "why": "The exact version with a hash set. Then ask what to do when the set does not fit."
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
       "why": "Buckets and hashing by hand: the machinery a Bloom filter drops."
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
       "why": "A harder membership question: near-duplicates in a window, solved with buckets."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-heavy",
   "title": "7. Heavy hitters and counting over a stream",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** Events stream in from the platform: 200 million a day, each tagged with a task id, a customer or a failure type. Which 10 tags are the most common right now? A dashboard, an abuse check and a cost report all want this. **The naive way** is a dictionary of counts. It is exact, and the memory grows with the number of distinct ids. If there are 50 million distinct ids, that is gigabytes, per window. **The better way** is a sketch: a count-min sketch gives an estimate for any id in a fixed small table; Misra-Gries keeps k - 1 counters and guarantees to keep every id above N / k. Add a small heap or dict of the best k and you have top-k over a stream in fixed memory."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-heavy-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: k, exact or not, window. Errors: which direction the error goes, how big. Scope: one machine or many, memory limit.",
     "solution": "1. Primary capabilities\n- Top k of what, and how big is k? Say top 10 ids.\n- Exact counts or estimates? Likely estimates are fine if the top ones are right and the error is bounded.\n- A window or since the start? Likely a window; say a sliding one costs more.\n\n2. Error handling\n- Can the estimate be wrong? Yes: count-min only over-counts. Misra-Gries only under-counts.\n- How wrong may it be? Say 0.1% of the stream length.\n- What if the stream has a long tail of ids seen once? Likely yes; the sketch ignores them well.\n\n3. Scope boundaries\n- One machine or many? Say many; sketches add cell by cell, so merging is easy.\n- Is memory fixed? Likely yes, a few KB per counter group.\n- Out of scope: exact top-k with an offline job. Name it as the way to check.",
     "why": "The direction of the error is what makes the answer usable. Count-min never says less than the truth, so a real top id is never hidden by an undercount. Merging across machines is the scaling answer.",
     "say": "**I ask for k, and how much error I can take.** Count-min only counts too high, never too low, and I can say by how much. Misra-Gries only counts too low, and it keeps every id above one in k of the stream. Both fit in a few KB however many distinct ids there are."
    },
    {
     "t": "write",
     "id": "infra-heavy-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. count(x) is never less than the true count of x.\n2. With probability 99%, count(x) is at most the true count + 0.1% of the stream.\n3. Memory is fixed and does not grow with the number of distinct ids.\n4. top_k returns the k ids with the highest estimates, using k extra slots.\n5. Every id above N / k occurrences appears in the Misra-Gries result.\n6. Two sketches with the same shape merge by adding cells.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-heavy-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Counter table: KEEP. d rows by w columns of integers\n- Row hash: KEEP. One hash function per row, seeded by the row number\n- Best-k set: KEEP. A small dict id to estimate; drop the smallest when over k\n- Counters for Misra-Gries: KEEP. A dict of at most k - 1 ids\n- Stream: KEEP as input. A generator; read once\n- Exact dictionary: KEEP offline. Only to check the sketch in a test",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-heavy-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Count-min. Choose error eps = 0.001 of the stream and failure probability delta = 1%. Width w = ceil(2.718 / eps) = 2,719 columns. Depth d = ceil(ln(1 / delta)) = 5 rows. That is 13,595 counters.\n2. add(x): for each row r, add 1 to cell [r][hash_r(x) mod w].\n3. count(x): the smallest of the 5 cells. Other ids share cells and only add to them, so each cell is at or above the truth, and the smallest is closest.\n4. Top k: for each event, add it, take its estimate, and keep a dict of the k ids with the highest estimates; when it has k + 1, drop the smallest.\n5. Measure: 200,000 events, 42,334 distinct ids. The sketch top 5 matched the true top 5, and the worst overcount over all ids was 47 against an allowed 200.\n6. Misra-Gries with k = 10 keeps at most 9 counters. A known id gets +1. A new id takes a free counter. If none is free, subtract 1 from every counter and drop the zeros. An id with more than N / 10 events cannot be fully cancelled, so it stays. The run kept both ids above 20,000.\n7. Compare: count-min estimates any id, Misra-Gries lists candidates. Count-min cells add across machines. Misra-Gries summaries can also be merged, with a rule I would look up before claiming it.\n\nEdge cases:\n- The window moves: keep a sketch per time slice (say per minute) and add the last 60.\n- k larger than the real number of heavy ids: the extra slots show noise; read the counts.\n- Hash seeds differ across machines: sketches only merge when the hashes match. Fix the seeds in the code.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-heavy-code-w",
     "q": "e) Code. Write CountMin(eps, delta) with add and count, Misra-Gries, and top_k that uses the sketch. Say the memory.",
     "starter": "class CountMin:\n    def __init__(self, eps, delta): ...\n    def add(self, x): ...\n    def count(self, x): ...\n\ndef misra_gries(stream, k): ...\ndef top_k(stream, k, cm): ...",
     "hint": "Use a stable hash such as zlib.crc32 of row and id, because Python's hash changes per run. count is the min over rows. Misra-Gries decrements everyone when it has no free counter.",
     "solution": "import heapq\nimport math\nimport random\nimport zlib\nfrom collections import Counter\n\n\ndef slot(r, x, w):\n    return zlib.crc32(f\"{r}:{x}\".encode()) % w             # a different hash per row\n\n\nclass CountMin:\n    def __init__(self, eps, delta):\n        self.w = math.ceil(math.e / eps)                   # columns: overcount is at most eps * N\n        self.d = math.ceil(math.log(1 / delta))            # rows: the bound fails with probability delta\n        self.t = [[0] * self.w for _ in range(self.d)]\n\n    def add(self, x):\n        for r in range(self.d):\n            self.t[r][slot(r, x, self.w)] += 1\n\n    def count(self, x):                                    # the smallest row: never below the truth\n        return min(self.t[r][slot(r, x, self.w)] for r in range(self.d))\n\n\ndef misra_gries(stream, k):\n    \"\"\"k - 1 counters. Anything seen more than N / k times is guaranteed to be left in them.\"\"\"\n    c = {}\n    for x in stream:\n        if x in c:\n            c[x] += 1\n        elif len(c) < k - 1:\n            c[x] = 1\n        else:\n            c = {y: n - 1 for y, n in c.items() if n > 1}  # a new id cancels one of each kept id\n    return c\n\n\ndef top_k(stream, k, cm):\n    \"\"\"Count-min for the counts, a small dict of the k best seen so far.\"\"\"\n    best = {}\n    for x in stream:\n        cm.add(x)\n        best[x] = cm.count(x)\n        if len(best) > k:\n            del best[min(best, key=best.get)]              # k is small, so a scan is fine\n    return sorted(best.items(), key=lambda p: -p[1])\n\n\nrandom.seed(4)\nhot = random.choices(range(5), weights=[25, 12, 8, 5, 3], k=106000)     # 5 hot ids: 53% of the traffic\ntail = [random.randrange(5, 50000) for _ in range(94000)]               # 47% spread over 50,000 ids\nstream = hot + tail\nrandom.shuffle(stream)\ntruth = Counter(stream)\ncm = CountMin(eps=0.001, delta=0.01)\nprint(f\"count-min: {cm.d} rows x {cm.w} columns = {cm.d * cm.w} counters; distinct ids in the stream: {len(truth)}\")\nprint(\"true top 5  :\", truth.most_common(5))\nprint(\"sketch top 5:\", top_k(stream, 5, cm))\nprint(\"worst overcount over all ids:\", max(cm.count(x) - n for x, n in truth.items()), \"| allowed eps * N:\", int(0.001 * len(stream)))\nmg = misra_gries(stream, 10)\nbig = sorted(x for x, n in truth.items() if n > len(stream) // 10)\nprint(\"Misra-Gries k=10 holds\", len(mg), \"counters; ids above N/10 =\", len(stream) // 10, \"are\", big, \"and all are kept:\", all(x in mg for x in big))\n\n\n# What it printed:\n#   count-min: 5 rows x 2719 columns = 13595 counters; distinct ids in the stream: 42334\n#   true top 5  : [(0, 50071), (1, 23822), (2, 15940), (3, 10126), (4, 6041)]\n#   sketch top 5: [(0, 50092), (1, 23858), (2, 15961), (3, 10145), (4, 6063)]\n#   worst overcount over all ids: 47 | allowed eps * N: 200\n#   Misra-Gries k=10 holds 6 counters; ids above N/10 = 20000 are [0, 1] and all are kept: True",
     "why": "Memory is rows x columns however many ids come: 13,595 counters here. The three measured lines are the three claims: top-5 matches, overcount under the bound, heavy ids kept.",
     "say": "**A small table and five hash functions.** Every event adds one in five cells. To read an id I take the smallest of its five cells. Other ids can only push a cell up, so the smallest is never below the truth and usually close to it."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "What are the guarantees of count-min?",
       "a": "It never under-counts. With probability 1 - delta, the over-count is at most eps x N, where N is the number of events. Width is 2.718 / eps and depth is ln(1 / delta). Here that is 2,719 by 5."
      },
      {
       "q": "Count-min or Misra-Gries?",
       "a": "Count-min answers 'how often did x occur?' for any x, and has no list of candidates by itself. Misra-Gries produces candidates: every id above N / k. I use Misra-Gries to find them and count-min, or an exact second pass, to size them."
      },
      {
       "q": "How do you get top k with count-min?",
       "a": "Keep a small dict of the k best ids seen. For each event, add it, read its estimate, and update the dict. Count-min cannot list ids by itself, so the dict does the listing."
      },
      {
       "q": "How do you combine counts from 20 machines?",
       "a": "Count-min tables with the same shape and hash seeds add cell by cell. That is why it fits a stream split across machines."
      },
      {
       "q": "Why not a dictionary?",
       "a": "The dictionary is exact and its size is the number of distinct ids. With 50 million distinct ids it is gigabytes per window. The sketch is a few tens of KB. If the distinct count is small, use the dictionary."
      },
      {
       "q": "How do you check the sketch is right?",
       "a": "Run an exact count offline on a sample day and compare the top k and the worst overcount, as the run does. The sketch is a production shortcut, and the exact job is the test."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: Count-min sketch",
       "url": "https://en.wikipedia.org/wiki/Count%E2%80%93min_sketch",
       "m": 8,
       "why": "Width, depth, the never-under-counts guarantee and the epsilon x N bound. Opened and checked."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: Misra-Gries heavy hitters algorithm",
       "url": "https://en.wikipedia.org/wiki/Misra%E2%80%93Gries_heavy_hitters_algorithm",
       "m": 6,
       "why": "k - 1 counters and the guarantee for ids above N / k. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "Majority Element",
       "d": "easy",
       "lc": "majority-element",
       "yt": [
        "7pnhv842keE",
        "NeetCode",
        15
       ],
       "why": "Boyer-Moore voting is Misra-Gries with one counter: find the id above half the stream."
      },
      {
       "n": "Top K Frequent Elements",
       "d": "medium",
       "lc": "top-k-frequent-elements",
       "yt": [
        "YPTqKIgVk-k",
        "NeetCode",
        14
       ],
       "why": "The exact version, with a dictionary and buckets. Ask what changes when the stream does not fit."
      },
      {
       "n": "Majority Element II",
       "d": "medium",
       "lc": "majority-element-ii",
       "yt": [
        "Eua-UrQ_ANo",
        "NeetCodeIO",
        15
       ],
       "why": "Misra-Gries with 2 counters: ids above a third. The follow-up that shows the k - 1 counters idea."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-sample",
   "title": "8. Sampling: reservoir sampling",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** Every day millions of model answers are scored. You cannot read them all. You want 1,000 chosen fairly, to hand to a human reviewer or to estimate a quality rate. The stream has no known length and does not fit in memory. **The naive way** is to store everything, then pick: memory grows with the stream. Or pick every 1,000th item, which is biased if anything repeats on that period. **The better way** is reservoir sampling: keep k items, and for item number i, with probability k / i let it replace a random kept item. Every item ends up in the sample with the same probability, k / n, using memory for k items."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-sample-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: sample size, unknown length, equal or weighted. Errors: short stream, restart and reproducibility, duplicates. Scope: many machines, exact or approximate size.",
     "solution": "1. Primary capabilities\n- How big is the sample and what is it for? Say 1,000 for a quality estimate and for review.\n- Is the stream length known? Likely no, or too large to count first.\n- Equal chance for every item, or weighted? Likely equal; weights are a follow-up.\n\n2. Error handling\n- What if the stream has fewer than k items? Return all of them.\n- What if the job restarts? Likely it must reproduce the same sample, so seed the random generator and log it.\n- What if the same item arrives twice? Likely yes; say whether it counts twice.\n\n3. Scope boundaries\n- One machine or many? Say many streams; merge by sampling from the samples, weighted by stream size.\n- Exact sample size, or about 1%? Both are possible; say which tool gives which.\n- Out of scope: stratified sampling by customer. Name it as the next step.",
     "why": "Unknown length is why a plain random pick fails. Reproducibility is the question an evaluation owner cares about: the same run twice should give the same sample.",
     "say": "**I ask how big the sample is and whether I know the length.** If I do not, I keep a reservoir of k and replace a slot with probability k over i. Every item then has the same chance, k over n, and I only ever hold k items."
    },
    {
     "t": "write",
     "id": "infra-sample-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. For a stream of n items, each item is in the final sample with probability k / n.\n2. Memory is O(k), independent of n.\n3. One pass over the stream; no length needed in advance.\n4. If n < k, the sample is the whole stream.\n5. A fixed seed gives the same sample on every run.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-sample-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Reservoir: KEEP. A list of at most k items\n- Counter i: KEEP. The number of items seen so far\n- Random generator: KEEP, seeded. randrange(i) gives a number from 0 to i - 1\n- Stream: KEEP as input. A generator; never held in memory\n- Hash sampler: KEEP as the other option. Take an item if hash(id) mod 10000 is under 1% of 10000\n- Weights: DROP. Say: A-Res uses a key u^(1/w) per item",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-sample-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Keep the first k items in a list.\n2. For item number i after that (counting from 1), draw j between 0 and i - 1.\n3. If j < k, replace slot j with this item. Otherwise drop the item. The chance of entering is k / i.\n4. Why it is fair: item i enters with probability k / i. A kept item survives item i + 1 with probability 1 - (k / (i + 1)) x (1 / k) = i / (i + 1). Multiply the survivals from i to n: k / n for every item. It is a proof by induction.\n5. Check it: sample 1 from 5 items, 50,000 times. Each item won about 10,000 times (10,090, 9,875, 10,070, 9,951, 10,014).\n6. Scale check: 3 from a stream of a million used memory for 3 items.\n7. Hash sampling is the other tool. Keep an item if hash(salt + id) mod 10,000 < 100 for 1%. It keeps no state, gives the same answer on every machine and run, and merges for free. Its sample size is about 1%, not exactly 1,000.\n8. How good is a sample of 1,000? For a rate near 50%, the standard error is sqrt(0.25 / 1000) = 1.6%, so a 95% interval is about plus or minus 3.1 points.\n\nEdge cases:\n- The stream ends before k: return what you have.\n- Python's randrange(i) per item costs a random call per item; faster variants skip ahead (Algorithm L).\n- Duplicate ids: decide first. Deduplicate before the sampler if each id should count once.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-sample-code-w",
     "q": "e) Code. Write reservoir(stream, k, rng) and a hash-based in_sample(id, percent). Then test that item 0 to 4 each win about 20%.",
     "starter": "def reservoir(stream, k, rng):\n    ...\n\ndef in_sample(item_id, percent, salt=\"eval-v1\"):\n    ...",
     "hint": "enumerate(stream, 1) gives i. j = rng.randrange(i). Replace slot j only when j < k. The hash sampler takes the first 8 hex digits of sha256 as a number.",
     "solution": "import hashlib\nimport random\nfrom collections import Counter\n\n\ndef reservoir(stream, k, rng):\n    \"\"\"Keep k items. Item number i (counting from 1) takes a random slot with probability k / i.\"\"\"\n    sample = []\n    for i, x in enumerate(stream, 1):\n        if i <= k:\n            sample.append(x)\n        else:\n            j = rng.randrange(i)               # 0 .. i-1\n            if j < k:\n                sample[j] = x\n    return sample\n\n\ndef in_sample(item_id, percent, salt=\"eval-v1\"):\n    \"\"\"Same id, same answer, on any machine: sample by hash, keep no state.\"\"\"\n    h = int(hashlib.sha256(f\"{salt}:{item_id}\".encode()).hexdigest()[:8], 16)\n    return h % 10000 < percent * 100\n\n\nrng = random.Random(11)\nseen = Counter()\nfor _ in range(50000):                         # 5 items, a sample of 1: each should win about 20% of the time\n    seen[reservoir(range(5), 1, rng)[0]] += 1\nprint(\"sample 1 of 5, 50000 runs:\", dict(sorted(seen.items())))\n\ns = reservoir((f\"answer{i}\" for i in range(1000000)), 3, random.Random(2))   # a generator: never held in memory\nprint(\"3 of a million, memory for 3:\", s)\n\npicked = sum(in_sample(f\"id{i}\", 1) for i in range(100000))\nagain = sum(in_sample(f\"id{i}\", 1) for i in range(100000))\nprint(\"hash sampling at 1% of 100000 ids:\", picked, \"| a second run picks the same:\", picked == again)\n\n\n# What it printed:\n#   sample 1 of 5, 50000 runs: {0: 10090, 1: 9875, 2: 10070, 3: 9951, 4: 10014}\n#   3 of a million, memory for 3: ['answer436442', 'answer967572', 'answer724012']\n#   hash sampling at 1% of 100000 ids: 995 | a second run picks the same: True",
     "why": "Fifty thousand trials with equal counts is the fairness claim made visible. The generator of a million items shows the memory claim.",
     "say": "**Keep the first k. After that, item i gets in with probability k over i and kicks out a random one.** Earlier items are slightly less likely to survive each new arrival, but they were more likely to get in first. The two cancel, and every item ends at k over n."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "Prove each item has probability k / n.",
       "a": "By induction. After i items every item is in the sample with probability k / i. Item i + 1 enters with probability k / (i + 1). A kept item stays with probability 1 - 1 / (i + 1) = i / (i + 1). So its chance is k / i x i / (i + 1) = k / (i + 1)."
      },
      {
       "q": "Reservoir or hash sampling?",
       "a": "Reservoir gives an exact size and needs one stream and state. Hash sampling needs no state, repeats exactly on any machine, and gives about a percentage. For a repeatable evaluation sample I prefer the hash, with a salt I record."
      },
      {
       "q": "What if the items are weighted?",
       "a": "A-Res: give each item the key u^(1/w) with u uniform in (0,1), and keep the k items with the largest keys. A heap of size k does it."
      },
      {
       "q": "How do you sample across 10 machines?",
       "a": "Each machine keeps a reservoir and counts its items. To merge, draw from each reservoir in proportion to its stream's count. Or use hash sampling, which needs no merge."
      },
      {
       "q": "How do you sample fairly per customer?",
       "a": "Stratify: one reservoir per customer, sized by the share you want, so a big customer does not hide a small one."
      },
      {
       "q": "Why not shuffle the stream and take the first k?",
       "a": "A shuffle needs the whole stream in memory, or its length, and a pass to write it. The reservoir does the same in one pass with memory for k."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: Reservoir sampling",
       "url": "https://en.wikipedia.org/wiki/Reservoir_sampling",
       "m": 8,
       "why": "Algorithm R, the proof by induction, O(k) space and the skip-ahead variants. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "Shuffle an Array",
       "d": "medium",
       "lc": "shuffle-an-array",
       "yt": [
        "81z5a4StXHM",
        "Coding Decoded",
        13
       ],
       "why": "Fair random order: the Fisher-Yates idea behind a fair replacement step."
      },
      {
       "n": "Linked List Random Node",
       "d": "medium",
       "lc": "linked-list-random-node",
       "yt": [
        "Rl7dOXde_2s",
        "Coding Decoded",
        15
       ],
       "why": "Reservoir sampling with k = 1 on a list of unknown length."
      },
      {
       "n": "Random Pick Index",
       "d": "medium",
       "lc": "random-pick-index",
       "yt": [
        "HXRN8ZfAQOI",
        "Cracking FAANG",
        15
       ],
       "why": "Reservoir sampling over the indexes that match a target: sampling with a condition."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-extsort",
   "title": "9. External sort and k-way merge",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** A day of evaluation results is a 300 GB export of rows, and you must sort it by score or by time to find the worst cases. The worker has 16 GB of memory. **The naive way** is to load it and sort it. That fails: the data does not fit. Swapping to disk makes it slower than any plan. **The better way** is an external merge sort. Pass 1: read what fits in memory, sort it, write it out as a sorted run. Pass 2: merge all the runs with a heap that holds the front item of each run. Every item is read and written twice, and memory only needs to hold one chunk and one buffer per run."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-extsort-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: data size, memory, key, one output file. Errors: crash midway, disk space, bad rows. Scope: one machine, disk speed, stability.",
     "solution": "1. Primary capabilities\n- How big is the data and how much memory? Say 300 GB and 16 GB.\n- Sort by what key, and are rows fixed size? Likely a numeric key with variable rows.\n- Does the output need to be one file? Likely yes, in order.\n\n2. Error handling\n- What if the process dies midway? Likely the runs are on disk, so resume from them.\n- What if the disk fills? Likely we need about 2x the data in space; name it.\n- What if the input has bad rows? Likely skip and log with a count.\n\n3. Scope boundaries\n- One machine or a cluster? Say one machine first; mention range partitioning for many.\n- Disk speed? Say 500 MB/s for a fast SSD, 100 for a hard disk.\n- Stable order for equal keys? Say yes, break ties by run order.",
     "why": "Data and memory decide the number of runs and whether one merge pass is enough. Disk speed turns passes into hours, which is the number the interviewer wants.",
     "say": "**I ask how big the data is and how much memory I have.** Then I say the plan out loud: sort memory-sized chunks into runs, merge the runs with a heap. For 300 GB in 16 GB that is about 19 runs and one merge pass."
    },
    {
     "t": "write",
     "id": "infra-extsort-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. The output is every input item, in sorted order.\n2. Memory use never exceeds M items plus one buffer per run.\n3. Each item is read twice and written twice (two passes), unless more runs than the fan-in forces a third.\n4. Equal keys keep their input order.\n5. A crash after pass 1 resumes from the runs, without re-sorting.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-extsort-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Chunk: KEEP. As many items as fit in memory, sorted in memory\n- Run: KEEP. A sorted chunk written to a file\n- Reader: KEEP. One open file and one buffer per run\n- Heap: KEEP. Holds (front item, run number); size equals the number of runs\n- Output file: KEEP. Written in order, buffered\n- Merge pass count: KEEP. 1 + ceil(log base fan-in of runs)",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-extsort-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Plan the numbers. 300 GB / 16 GB gives 19 runs. In the demo, 200,000 numbers with room for 10,000 gave 20 runs.\n2. Pass 1: read M items, sort them in memory, write run i. Repeat to the end of the input. Cost: one read and one write of everything.\n3. Pass 2: open all runs. Push the first item of each run onto a min-heap as (value, run number). A heap with 20 entries.\n4. Pop the smallest, write it, and push the next item from the same run. Each pop is O(log r) with r runs.\n5. When a run is empty, nothing is pushed for it. When the heap is empty, the output is complete. In the demo the output matched Python's sorted list.\n6. Total work: N log r for the merge plus N log M for the chunks, so N log N overall. I/O cost: read, write, read, write, which is 4 x 300 GB = 1.2 TB. At 500 MB/s that is about 2,400 seconds, 40 minutes.\n7. Too many runs for memory: with 16 GB and 19 runs, each run buffer can be about 800 MB, which is comfortable. With 10,000 runs the buffers are small and the disk seeks dominate. Then merge in rounds: merge 100 runs at a time, then merge those results. That is a third pass.\n8. Many machines: sample the keys to choose range boundaries, send each range to one machine, sort each locally, and concatenate. No final merge is needed.\n\nEdge cases:\n- Fewer items than memory: sort in memory, no runs.\n- Equal keys: put the run number in the heap tuple so ties go to the earlier run, and the sort is stable.\n- A run that ends: close its file and do not push.\n- Heap tuples that compare equal values and then unorderable items: always include the run number second.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-extsort-code-w",
     "q": "e) Code. Write make_runs (sort chunks into files) and merge (heap over runs). Say what is in memory at each step.",
     "starter": "def make_runs(path, folder):\n    ...\n\ndef merge(runs, out_path):\n    ...",
     "hint": "Pass 1: take MEMORY lines at a time, sort, write. Pass 2: a list of open files and a heap of (value, run index); after a pop, read the next line from that same file.",
     "solution": "import heapq\nimport os\nimport random\nimport tempfile\n\nMEMORY = 10000                                  # how many numbers fit in \"memory\" at once\n\n\ndef make_runs(path, folder):\n    \"\"\"Pass 1: read a memory-sized chunk, sort it, write it out as one run.\"\"\"\n    runs = []\n    with open(path) as f:\n        while True:\n            chunk = [int(line) for _, line in zip(range(MEMORY), f)]\n            if not chunk:\n                return runs\n            run = os.path.join(folder, f\"run{len(runs)}.txt\")\n            with open(run, \"w\") as out:\n                out.writelines(f\"{x}\\n\" for x in sorted(chunk))\n            runs.append(run)\n\n\ndef merge(runs, out_path):\n    \"\"\"Pass 2: a heap holds the front number of every run; pop the smallest, refill from its run.\"\"\"\n    files = [open(r) for r in runs]\n    heap = [(int(f.readline()), i) for i, f in enumerate(files)]\n    heapq.heapify(heap)\n    with open(out_path, \"w\") as out:\n        while heap:\n            x, i = heapq.heappop(heap)\n            out.write(f\"{x}\\n\")\n            nxt = files[i].readline()\n            if nxt:\n                heapq.heappush(heap, (int(nxt), i))\n    for f in files:\n        f.close()\n\n\nwith tempfile.TemporaryDirectory() as d:\n    src = os.path.join(d, \"big.txt\")\n    rng = random.Random(9)\n    with open(src, \"w\") as f:\n        f.writelines(f\"{rng.randrange(10**9)}\\n\" for _ in range(200000))\n    runs = make_runs(src, d)\n    print(\"numbers: 200000, memory holds\", MEMORY, \"-> runs:\", len(runs))\n    merge(runs, os.path.join(d, \"sorted.txt\"))\n    with open(os.path.join(d, \"sorted.txt\")) as f:\n        out = [int(x) for x in f]\n    with open(src) as f:\n        want = sorted(int(x) for x in f)\n    print(\"sorted correctly:\", out == want, \"| numbers held in the merge heap at once:\", len(runs))\n\n\n# What it printed:\n#   numbers: 200000, memory holds 10000 -> runs: 20\n#   sorted correctly: True | numbers held in the merge heap at once: 20",
     "why": "Peak memory is one chunk in pass 1 and one item per run in pass 2. The printed check that the output equals sorted(input) is the correctness proof for this size.",
     "say": "**Sort what fits, write it out, then merge the pieces with a heap.** The heap holds one item from each piece, so memory stays small however much data there is. I read everything twice and write everything twice, and that is the cost I quote."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "Why a heap for the merge?",
       "a": "To find the smallest of r fronts in O(log r) instead of O(r). With 20 runs that is 5 steps against 20 per item, and with 1,000 runs it is 10 against 1,000."
      },
      {
       "q": "How many passes?",
       "a": "Two when the number of runs fits the merge fan-in: one to make runs, one to merge. If there are more runs than you can open with decent buffers, add rounds: 1 + ceil(log base fan-in of runs). The I/O cost is about (N / B) x log base (M / B) of (N / B)."
      },
      {
       "q": "What are the buffers?",
       "a": "Each run needs a read buffer, so that you read a block at a time instead of a line at a time, plus an output buffer. More runs mean smaller buffers and more disk seeks, which is why the fan-in has a limit."
      },
      {
       "q": "How do you speed it up?",
       "a": "Overlap reading, sorting and writing. Use larger chunks, since memory sets the run length. Compress the runs if the disk is the bottleneck. Or sort on many machines by key ranges."
      },
      {
       "q": "How is it different from Merge k Sorted Lists?",
       "a": "It is the same merge with a heap of k heads. The new parts are the chunk sort to make the lists, files in place of lists, and the I/O arithmetic."
      },
      {
       "q": "Would you do this at all today?",
       "a": "Often a database or a distributed engine does it for me. I would still say the plan, since 'sort more than fits in memory' is the idea under every large sort, and I want the cost in passes."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: External sorting",
       "url": "https://en.wikipedia.org/wiki/External_sorting",
       "m": 8,
       "why": "Runs, the k-way merge, buffers per run, and why you minimise passes. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
     "items": [
      {
       "n": "Merge Sorted Array",
       "d": "easy",
       "lc": "merge-sorted-array",
       "yt": [
        "P1Ic85RarKY",
        "NeetCode",
        11
       ],
       "why": "The two-way merge, the building block."
      },
      {
       "n": "Kth Smallest Element in a Sorted Matrix",
       "d": "medium",
       "lc": "kth-smallest-element-in-a-sorted-matrix",
       "yt": [
        "gQuH27Xz5mk",
        "Techdose",
        16
       ],
       "why": "A heap over the fronts of sorted rows: a k-way merge that stops early."
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
       "why": "The merge phase exactly. A heap of k heads, n log k."
      }
     ]
    }
   ]
  },
  {
   "id": "infra-match",
   "title": "10. Assignment and matching: experts to tasks",
   "blocks": [
    {
     "t": "p",
     "text": "**The Mercor-shaped problem.** This is the marketplace itself. There are experts and there are tasks. Each pair has a fit: a cost, where 0 is a perfect fit. Give every task to one expert so the total fit is best, and some experts can take two tasks. **The naive way** is greedy: take the best pair left, remove both, repeat. It is fast, and it can be wrong: the best pair can use an expert that another task needed more. **The exact way** tries all assignments, n! of them, which is 20! = 2.4 quintillion at n = 20. **The better way** is the Hungarian algorithm, O(n^3), or min-cost flow when there are capacities and missing pairs."
    },
    {
     "t": "p",
     "text": "**The flow, the way you will say it:** a) clarify, b) requirements, c) entities, d) core logic in English with numbers, e) a short sketch of the code (shut until you have talked it through), f) the follow-ups they chain. Aim for 30 minutes. Try each box before you open the answer."
    },
    {
     "t": "write",
     "id": "infra-match-clarify-w",
     "q": "a) Clarify. Write your questions under each bucket, each with the answer you expect.",
     "starter": "1. Primary capabilities\n- \n\n2. Error handling\n- \n\n3. Scope boundaries\n- ",
     "hint": "Capabilities: best total or stable match, capacity per expert, allowed pairs. Errors: unequal counts, missing costs, refusals. Scope: size, online or batch.",
     "solution": "1. Primary capabilities\n- Is the aim the best total fit, or a fair split, or a stable match where nobody wants to swap? Likely best total; stable match if both sides have preferences.\n- One task per expert, or can an expert take several? Likely several, with a limit per expert.\n- Is every pair allowed? Likely no: an expert must have the skill.\n\n2. Error handling\n- More tasks than experts, or fewer? Likely either; some tasks wait.\n- What if the cost is unknown for a pair? Treat the pair as not allowed.\n- What if experts say no after the assignment? Likely they do, so re-run for the open tasks.\n\n3. Scope boundaries\n- How big? Say 5,000 experts and 1,000 tasks, each task with about 50 qualified experts.\n- Online (tasks arrive one by one) or a batch each hour? Say a batch.\n- Out of scope: pay and fairness over time. Name them.",
     "why": "'Best total' and 'stable' are different problems. Capacity and forbidden pairs are what make flow the natural model. Size and sparsity decide whether n^3 is acceptable.",
     "say": "**I ask what best means: lowest total cost, or a match nobody wants to leave.** Then I ask if an expert can take more than one task and if every pair is allowed. I start with greedy, show it can fail, and then say what I use instead."
    },
    {
     "t": "write",
     "id": "infra-match-reqs-w",
     "q": "b) Requirements. Number them. Each must be testable.",
     "starter": "1. \n2. \n3. ",
     "hint": "Each line says what is true when the system is right, with a number where there is one.",
     "solution": "1. Every task goes to at most one expert, and no expert exceeds their capacity.\n2. Only allowed pairs (the expert has the skill) are used.\n3. The total cost is the lowest possible among all valid assignments.\n4. Running time is polynomial: no trying every assignment.\n5. Tasks with no valid expert are listed as unassigned, not dropped.",
     "why": "A requirement you can test is one you can check with a small run. Each of these has a number or a yes or no answer.",
     "say": "**I turn the answers into numbered requirements I can test.** Each has a number or a clear yes or no. They are also the checks I will run on the code at the end."
    },
    {
     "t": "write",
     "id": "infra-match-entities-w",
     "q": "c) Entities. List the nouns. Keep or drop each, with a reason and the data structure it becomes.",
     "starter": "- Noun: KEEP or DROP. Why. Structure.",
     "hint": "Keep what holds state or a rule. Drop what is only a word in the prompt.",
     "solution": "- Expert: KEEP. An id and a capacity; a capacity of 2 becomes 2 slots\n- Task: KEEP. An id\n- Cost matrix: KEEP for dense. cost[e][t]; for sparse, a list of (e, t, cost) edges\n- Slot: KEEP. One unit of an expert's capacity, so one row per slot\n- Assignment: KEEP. A list of (expert, task) pairs\n- Preferences: DROP. Only for a stable match (Gale-Shapley); name it",
     "why": "Every kept noun is a structure with a cost. Dropped nouns are named aloud so the interviewer sees they were considered.",
     "say": "**I list the nouns and keep the ones that hold state.** Each kept one becomes a data structure, and I say its cost. The ones I drop I name, so you know I saw them."
    },
    {
     "t": "write",
     "id": "infra-match-logic-w",
     "q": "d) Core logic. Numbered steps in plain English, with the numbers (costs, error rates, memory). Then the edge cases.",
     "starter": "1. \n2. \n3. \n\nEdge cases:\n- ",
     "hint": "Start with the naive cost as a number, then the better way and its new number. Check with a small example.",
     "solution": "1. Greedy: sort all pairs by cost, take a pair if both its expert and its task are free. O(P log P) for P pairs.\n2. Why it fails: in the demo 3 x 3 table, greedy takes the 0 first, then gets pushed into worse pairs: total 6. The best total is 5. The cheap pair stole the expert another task needed.\n3. Brute force: try every permutation. Exact, and 20! = 2,432,902,008,176,640,000 assignments at n = 20.\n4. Hungarian algorithm, in words: subtract the smallest number from every row, then from every column, so every row and column has a zero. Cover all zeros with as few lines as possible. If it takes n lines, the zeros hold an optimal assignment. If fewer, find the smallest uncovered number, subtract it from the uncovered cells, add it to cells covered twice, and repeat. About n^3 steps: 8,000 at n = 20.\n5. Capacity: an expert who can take 2 tasks becomes 2 rows with the same costs. With 4 tasks and expert 1 given 2 slots, the best total is 6 and greedy gets 7.\n6. Sparse and large: 5,000 experts times 1,000 tasks is 5 million cells, and n^3 on 1,000 tasks is 10^9 steps. Only about 50 experts qualify per task, so there are 50,000 edges. Build a flow network: source to each expert (capacity = their slots, cost 0), expert to task (capacity 1, cost = fit), task to sink (capacity 1). Push flow along the cheapest path again and again until all tasks are served. Each push is a shortest path search.\n7. Greedy is not useless. For maximum weight matching, greedy always gets at least half the best total, and it is fast. If the structure is simple, such as sorting both sides (Assign Cookies), greedy is exact.\n8. If both sides have preferences and the aim is that nobody wants to swap, that is stable matching: Gale-Shapley, O(n^2). Say which one the business wants.\n\nEdge cases:\n- More tasks than slots: add dummy experts with a high cost, then read their tasks as unassigned.\n- Ties in cost: any optimum is fine; pick by a tiebreak such as the least-used expert.\n- Costs that are huge or infinite: leave the edge out in the flow model, not a big number in a matrix.\n- A change in one expert: re-run the batch, or fix the flow incrementally.",
     "why": "The naive cost, the better cost, and a measured check. Those three numbers are what the interviewer waits for.",
     "say": "**I say the naive way and its cost first.** Then the better way and its cost, and I check it by hand on a small case. Last, I list the edge cases before I am asked."
    },
    {
     "t": "write",
     "id": "infra-match-code-w",
     "q": "e) Code. Write greedy and best (all permutations) for a cost matrix, and with_capacity that turns capacities into extra rows. Show that greedy is worse.",
     "starter": "def greedy(cost):\n    ...\n\ndef best(cost):\n    ...\n\ndef with_capacity(cost, slots):\n    ...",
     "hint": "greedy: sort (cost, expert, task) triples and take a pair if both are free. best: min over permutations of the column order. with_capacity: repeat a row once per slot.",
     "solution": "import math\nfrom itertools import permutations\n\n# cost[expert][task]: 0 is a perfect fit, higher is a worse fit\ncost = [[4, 1, 3],\n        [2, 0, 5],\n        [3, 2, 2]]\n\n\ndef greedy(cost):\n    \"\"\"Take the cheapest pair left, remove that expert and that task, repeat.\"\"\"\n    pairs = sorted((c, e, t) for e, row in enumerate(cost) for t, c in enumerate(row))\n    used_e, used_t, total, chosen = set(), set(), 0, []\n    for c, e, t in pairs:\n        if e not in used_e and t not in used_t:\n            used_e.add(e)\n            used_t.add(t)\n            total += c\n            chosen.append((e, t))\n    return total, chosen\n\n\ndef best(cost):\n    \"\"\"Try every assignment, n! of them. Fine to check a 3 x 3, hopeless at n = 20.\"\"\"\n    return min((sum(cost[e][t] for e, t in enumerate(p)), list(enumerate(p)))\n               for p in permutations(range(len(cost[0])), len(cost)))\n\n\ndef with_capacity(cost, slots):\n    \"\"\"An expert who can take 2 tasks becomes 2 rows. Then it is the same problem.\"\"\"\n    return [row for row, s in zip(cost, slots) for _ in range(s)]\n\n\nprint(\"greedy :\", greedy(cost))\nprint(\"optimal:\", best(cost))\n\nwide = [[4, 1, 3, 2], [2, 0, 5, 1], [3, 2, 2, 6]]          # 3 experts, 4 tasks\nrows = with_capacity(wide, [1, 2, 1])                       # the second expert can take two tasks\nprint(\"4 tasks, expert 1 has 2 slots, optimal:\", best(rows)[0], \"| greedy:\", greedy(rows)[0])\n\nn = 20\nprint(\"assignments to try at n = 20:\", f\"{math.factorial(n):,}\", \"| Hungarian steps, about n^3:\", f\"{n ** 3:,}\")\n\n\n# What it printed:\n#   greedy : (6, [(1, 1), (2, 2), (0, 0)])\n#   optimal: (5, [(0, 1), (1, 0), (2, 2)])\n#   4 tasks, expert 1 has 2 slots, optimal: 6 | greedy: 7\n#   assignments to try at n = 20: 2,432,902,008,176,640,000 | Hungarian steps, about n^3: 8,000",
     "why": "The brute force is the check, not the plan. It is fine for 3 x 3 and shows greedy 6 against 5 and 7 against 6. The last line is the n! against n^3 gap in numbers.",
     "say": "**Greedy takes the best pair first and that can steal an expert another task needed.** On my small table it costs 6 and the best is 5. For the real size I would use the Hungarian method, or a flow if experts have capacity and not every pair is allowed."
    },
    {
     "t": "faq",
     "title": "f) Follow-ups an interviewer chains, with short answers",
     "items": [
      {
       "q": "When does greedy work?",
       "a": "When the structure helps: sort experts and tasks by one number and match in order, as in Assign Cookies. For general costs it can be bad. For maximum weight matching it is always at least half the best, which is a reason to use it as a fast first pass."
      },
      {
       "q": "What is the Hungarian algorithm's running time?",
       "a": "O(n^3) for n experts and n tasks, after the improvement by Edmonds and Karp and by Tomizawa of the original O(n^4). That is 8,000 steps at n = 20, against 20! for brute force."
      },
      {
       "q": "How do you handle an expert who can take several tasks?",
       "a": "Make one row per slot with the same costs. Or in a flow model, give the source-to-expert edge that capacity. Both are the same problem."
      },
      {
       "q": "Why use min-cost flow?",
       "a": "It handles capacities, missing pairs, and unequal sizes without padding a matrix. On sparse data, 50,000 edges beat a 5 million cell matrix. The cost is a more complex implementation, so I would use a library."
      },
      {
       "q": "What is the difference between the best total and a stable match?",
       "a": "Best total minimises the sum of costs; some pair may prefer each other over their assignments. A stable match has no such pair. Gale-Shapley finds one in O(n^2). Pick by what the marketplace needs: efficiency or no complaints."
      },
      {
       "q": "The experts decline. What now?",
       "a": "Remove the declined pairs, mark those experts as busy, and run again on the open tasks. If it happens often, add a probability of accepting into the cost."
      }
     ]
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "Wikipedia: Hungarian algorithm",
       "url": "https://en.wikipedia.org/wiki/Hungarian_algorithm",
       "m": 10,
       "why": "The assignment problem, the O(n^3) bound, and a worked cost table. Opened and checked."
      }
     ]
    },
    {
     "t": "probs",
     "title": "Practise: related problems, easiest first, ending on a harder follow-up",
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
       "why": "Greedy that is exact: sort both sides and match in order."
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
       "why": "Matching with a threshold: a player needs a trainer at least as strong. Two pointers after sorting."
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
       "why": "The harder follow-up: workers, tasks and a limited boost. Binary search on the answer with greedy matching inside."
      }
     ]
    }
   ]
  }
 ]
});
