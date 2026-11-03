/* Mercor coding tab, part 7: the onsite coding round. A referral network in three parts and a task scheduler in two, each laid out in the order you solve it (clarify, requirements, entities, core logic, code, review), then what the reviewer asks. Rebuilt from candidate reports (AceOffer's synthesis of 20 reports, a Blind post from 26 Aug 2026, two public candidate repositories, FastPrep); Mercor's prompts are not public. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-onsite-code",
 "n": 7,
 "title": "Onsite coding round: referral network and task scheduler",
 "minutes": 170,
 "lead": "After this part you can work the coding round reported for Mercor's Applied AI onsite: alone, about 60 minutes, screen recorded, no AI, real data, no stubs, then about 30 minutes where a person reviews your code. Reports describe two prompts, a referral network in three parts and a task scheduler in two. Each one is laid out in the order you solve it: a) clarify, b) requirements, c) entities, d) core logic in plain English, e) code, f) review. You write each stage in a box, open the answer and the Say it sheet, then run the whole problem in the workbench. Mercor's own prompts are not public, so these are rebuilt from candidate reports and the numbers are mine.",
 "sections": [
  {
   "id": "onsite-round",
   "title": "0. How the round runs",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** You work alone for about 60 minutes with your screen recorded. In the Applied AI version you may search for syntax, but you may not use an LLM, and no tests are given. You write real code on real data from an empty file: no stubbing a function to come back to it. Then about 30 minutes of review, where a person goes through your code and asks why. These are the same minutes the coding exercise in Mercor's own prep document grades: break the problem down, weigh alternatives, recover when stuck, and deliver something that works."
    },
    {
     "t": "p",
     "text": "**How to pace the hour.** The aim is a working core by minute 35. A part that runs and is checked beats a bigger part that does not."
    },
    {
     "t": "list",
     "items": [
      "Minutes 0 to 5, clarify: ask the three buckets (what it must do, what goes wrong, where it stops) and write the answers as comments at the top of the file. Say them out loud: the recording is part of the grade.",
      "Minutes 5 to 15, data model: pick the dicts and the one class. Write the rules that decide the structure (one referrer per user, a dependency counts once) as comments.",
      "Minutes 15 to 35, core path: part 1 and the first queries, slow and obvious first. Run it on a six-item example you worked out by hand before you move on.",
      "Minutes 35 to 45, your own checks: plain asserts under the code. Include one for each refusal and one that compares the fast version with the slow one.",
      "Minutes 45 to 57, extensions: part 3, or retries. State your choice in a comment before you write it.",
      "Minutes 57 to 60, read it as the reviewer: go through your own code line by line and fix what you cannot explain."
     ]
    },
    {
     "t": "p",
     "text": "**If you are behind at minute 35,** cut extensions, never checks. Hand over a clean part 2 with asserts and say what you would build next. That is a scoping choice, not a miss."
    },
    {
     "t": "p",
     "text": "**What is reported, and how much to trust it.** Everything below is secondhand: candidate reports and two candidates' public repositories, not Mercor's prompt. AceOffer's synthesis of 20 reports names a three-part referral network with 'flow centrality' left open on purpose and a two-part task scheduler. A Blind post from 26 August 2026 says the first part had to work end to end with no stubbing and no AI, and was then reviewed with someone. AceOffer gives no detail for the scheduler, so failures and retries as part 2 is my reading, backed only by FastPrep's practice page, which lists bounded retries. The two repositories disagree on the exact score, which is the point: ask before you code."
    },
    {
     "t": "res",
     "items": [
      {
       "kind": "read",
       "req": false,
       "label": "AceOffer: Mercor interview process, from 20 candidate reports",
       "url": "https://aceoffer.app/interviews/mercor/interview-process",
       "m": 10,
       "why": "Names the three-part referral network, the open flow centrality definition and the two-part task scheduler."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Blind: a Mercor experience, 26 August 2026",
       "url": "https://www.teamblind.com/post/mercor-experience-vv02w0gy",
       "m": 3,
       "why": "Solo first part, end to end, no stubbing; then a review of the code with someone."
      },
      {
       "kind": "read",
       "req": false,
       "label": "A candidate's public repo: Mercor referral network (Manyachandra/Mercor)",
       "url": "https://github.com/Manyachandra/Mercor",
       "m": 6,
       "why": "One person's reading: a graph with no self-referrals, one referrer and no cycles; reach; top k; flow centrality as shortest paths through a node. Not the official statement."
      },
      {
       "kind": "read",
       "req": false,
       "label": "Another candidate repo: Referral Network System (BishtAmi)",
       "url": "https://github.com/BishtAmi/Referral-Network-System",
       "m": 4,
       "why": "A different reading: flow centrality as how much a user connects parts of the network, scored with subtree sizes."
      },
      {
       "kind": "read",
       "req": false,
       "label": "FastPrep: Mercor practice questions",
       "url": "https://www.fastprep.io/mercor-interview",
       "m": 4,
       "why": "Lists a dependency-aware workflow with bounded retries, cancellation and backpressure, the shape part 2 of the scheduler follows."
      }
     ]
    },
    {
     "t": "say",
     "lines": [
      "I think I would tell them at the start what I am going to do: ask, write the slow version, check it on a small example, then tighten.",
      "Every few minutes I would say what I finished and what comes next, so the recording makes sense to someone who did not watch me think.",
      "If time runs short, I would hand over a clean earlier part with its checks and say what I would do next, not a rushed last part."
     ]
    }
   ]
  },
  {
   "id": "onsite-referral",
   "title": "1. Referral network",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Three parts that build on each other. Part 1 builds a network from referral events and has to survive messy data. Part 2 answers queries on it. Part 3 adds a 'flow centrality' score, and the prompt does not say what that means. That gap is deliberate: the round is checking whether you ask before you code. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "Solve it in your order. At each stage try the box first, then open the answer and the Say it sheet. Set the switch above to Try first if you want the answers shut."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-referral-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: what an event is, how names arrive, which queries, what 'reach' means, what part 3 means. Errors: every kind of bad row, and a query about someone unknown. Scope: one referrer per user or several, how big, a stream or a batch.",
     "solution": "1. Primary capabilities\n- What is an event, and how do they arrive?  Likely: a (referrer, user) pair of strings, in a list, in time order.\n- Do names appear for the first time in events, or is there a user list?  Likely: first time in events. If a list is given, a name outside it is unknown.\n- Which queries in part 2?  Likely: who referred a user, direct referrals, the chain above a user, reach, top k by reach.\n- Does 'reach' mean direct referrals or everyone below?  Everyone below, at any depth. Name both: direct is one level, reach is all levels.\n- What does 'flow centrality' mean?  The prompt leaves it open on purpose. Do not guess: use the three readings below, ask which, and pick one if there is no answer.\n\n2. Error handling\n- Someone refers themselves?  Refuse, reason 'self'.\n- The same event twice?  Ignore the second, reason 'duplicate'. It is harmless, but count it.\n- A second, different referrer for a user?  The first event wins. Refuse, reason 'second_referrer'.\n- An event that closes a loop (a refers b, then b refers a)?  Refuse, reason 'cycle'.\n- An empty name, or a name outside the user list?  Refuse, reasons 'bad_event' and 'unknown_user'.\n- A query about a user nobody has heard of?  Neutral answers: None, an empty list, 0. Ask, because the other choice is to raise.\n- Does a refused event leave anything behind?  No. Nothing is changed.\n\n3. Scope boundaries\n- Can a user have two referrers?  No. One referrer each makes the network a forest, and the part 3 formula depends on that.\n- How big?  Say up to 100,000 users. That rules out recursion, which stops near 1,000 levels.\n- A stream or a batch?  A batch in memory. Say what changes for a stream.\n- Saving to disk, threads, deleting or editing a referral?  Out of scope.",
     "why": "Every question changes a line of code. 'Duplicate' and 'second referrer' are different answers, so they are different reasons. 'One referrer each' decides the data structure and part 3. 'Up to 100,000' decides an iterative walk. The unknown-user answer decides what every query returns.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, and where it stops.** First, I ask what an event looks like, which queries part 2 wants, and whether reach means direct or everyone below. Then the bad rows: self-referral, a repeat, a second referrer, a loop, an empty or unknown name. I would like each refusal to have a reason, so I can report them. Last, I check that each user has one referrer and about how many users, because that decides the structure. And I ask what 'flow centrality' means, because I would rather ask than guess."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable."
    },
    {
     "t": "write",
     "id": "onsite-referral-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "One for add and its six outcomes, one for build and the report, one each for the queries, one for the fast reach, one for top k, one for flow, one for size.",
     "solution": "1. add(referrer, user) returns \"ok\" or the reason it refused.\n   - Reasons: bad_event, unknown_user, self, duplicate, second_referrer, cycle\n   - A refused add changes nothing (test: queries before and after are equal)\n2. build(events) feeds the events in order and returns the network and the refused events grouped by reason.\n   - The first event wins when two disagree (test: a>b then c>b leaves b's referrer as a)\n3. who_referred(u), direct(u) and upline(u) read the network.\n   - Unknown user: None, [], []\n4. reach(u) is the number of users below u at any depth, not counting u.\n   - Test: a leaf is 0, the example root is 6\n5. all_reach() gives every user's reach in one pass and equals reach(u) for each u.\n6. top_k(k) lists the k largest reaches, ties broken by name, and k larger than the user count returns everyone.\n7. flow() gives the chosen centrality for every user, and equals its definition counted by brute force on small networks.\n8. A chain of 100,000 users does not hit the recursion limit.\n9. Out of scope: two referrers per user, deleting a referral, saving, threads.",
     "why": "Each line becomes a test. 1 and 2 are the messy data, 5 and 7 compare two implementations, 8 is the iterative walk. Requirement 7 is how you check part 3 without an answer key.",
     "say": "From the answers I get nine requirements, and I can test each one. **The two that I would not skip are 5 and 7: the fast reach has to equal the slow reach, and the flow score has to equal its own definition counted the long way.** That is how I check part 3 when nobody gives me an answer key. The rest are the refusals, the queries and the size. Out of scope: two referrers per user, deleting, saving and threads."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Keep a noun only if it carries a rule. Everything else is a key, a dict or a list."
    },
    {
     "t": "write",
     "id": "onsite-referral-c",
     "q": "List the nouns in the requirements. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Event: \nUser: \nReferrer link: \nReferred list: \nNetwork: \nUser list (roster): \nRefusal reason: \nReach, depth, flow score: \nChain (upline): \nLoop: ",
     "hint": "Ask of each noun: does it have behaviour, or is it only a value? A value becomes a dict, a list or a string, not a class.",
     "solution": "Event: drop as a class. It is a (referrer, user) tuple, read once and never kept.\nUser: drop as a class. It is a name, used as the key in every dict.\nReferrer link: keep. dict user -> referrer. One entry per user is the rule 'one referrer each'.\nReferred list: keep. dict user -> list of users, in event order. The same edges seen from the other side, so 'who did I refer' is one lookup.\nNetwork: keep. The one class. It owns both dicts, the user list and the rule that no loop forms, so no outside code can break the rule.\nUser list (roster): keep. A set of allowed names, or None when any name is allowed.\nRefusal reason: drop as a class. A string returned by add; build groups the refused events by it in a dict.\nReach, depth, flow score: drop as stored state. Dicts computed on demand, because stored counts go stale the moment an event is added.\nChain (upline): drop. A list built by walking up the referrer dict.\nLoop: drop. It is not a thing in the data, only a reason to refuse an event.",
     "why": "One class and two dicts carry the whole problem. The reviewer's first question is 'why two dicts' and the answer is in the Referred list line: both directions cost one lookup, and you pay memory for it.",
     "say": "I underline the nouns. **Only the network earns a class, because it is the only noun that has a rule to protect: no loops and one referrer each.** An event is a pair, a user is a name, and a refusal reason is a string, so I do not make classes for them. The two dicts are the same edges from both sides, so that 'who referred me' and 'who did I refer' are both one lookup. I compute reach and the score on demand instead of storing them, because a stored count is wrong after the next event."
    },
    {
     "t": "p",
     "text": "**Part 3 first: which flow centrality?** Decide this before the core logic, because it changes what you build. Three readings are plausible. Here they are on one seven-person example (a refers b and c; b refers d and e; d refers f; c refers g)."
    },
    {
     "t": "table",
     "head": [
      "Reading",
      "What it counts",
      "On the example",
      "What to ask",
      "The trap"
     ],
     "rows": [
      [
       "1. Reach",
       "People below you",
       "a 6, b 3, c 1, d 1, rest 0",
       "Do you mean how many people someone brought in?",
       "Part 2 already computes it, so part 3 would add nothing. A root always wins."
      ],
      [
       "2. Chains through you",
       "(people above you) x (people below you): referral chains that pass through you",
       "b 3, d 2, c 1, rest 0",
       "Do chains follow the direction of a referral, and are the two ends excluded?",
       "Running a breadth-first search from every user is O(n x (n + edges)), about 10^10 steps at 100,000 users. Or using the product when a user can have two referrers: it is then wrong."
      ],
      [
       "3. Betweenness, direction ignored",
       "Pairs of people whose path passes through you, either way",
       "a 8, b 11, c 5, d 5, rest 0",
       "Can influence run both ways, and would losing this person split the network?",
       "A different number, not a different spelling. On a tree it is the sum over pairs of the pieces left when you are removed. Reading 2 code gives the wrong answer for it."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**What candidates report.** One public repo counts shortest paths with dist(s, v) + dist(v, t) = dist(s, t) from a breadth-first search at every node, and excludes the two ends. On a forest where each user has one referrer, that is reading 2. Another repo scores with subtree sizes and calls it 'edge cut contribution', which reads like reading 3 or reading 1. Neither is the official statement. So ask, and say which you picked and why."
    },
    {
     "t": "write",
     "id": "onsite-referral-readings",
     "q": "Write the three readings of 'flow centrality' with the score each gives on the example, the one question you ask, which you pick and one line why.",
     "starter": "Reading 1: \nReading 2: \nReading 3: \n\nI ask: \nI pick: \nBecause: \nIf there is no answer I say: ",
     "hint": "Start from what already exists: reach is part 2. Then count pairs of people with a chain between them that passes through the user, once along the referral direction and once ignoring direction.",
     "solution": "Example: a>b, a>c, b>d, b>e, d>f, c>g\n\nReading 1, reach: people below you. a 6, b 3, c 1, d 1, rest 0.\nReading 2, chains through you along the referral direction: (people above you) x (people below you). b 3, d 2, c 1, rest 0.\nReading 3, betweenness ignoring direction: pairs of people whose path passes through you. a 8, b 11, c 5, d 5, rest 0.\n\nI ask: 'Do you want the number of people someone brought in, or how many referral chains pass through them? And do chains follow the arrows, or can influence run both ways?'\nI pick: reading 2.\nBecause: it matches the shortest-path-through-a-node definition candidates report, it follows the direction of a referral, it costs O(n) with one referrer each, and I can check it against its own definition on small networks.\nIf there is no answer I say: 'I am going with reading 2, chains through a user along the referral direction. Here is the one-line change for the other two.'",
     "why": "The pick is not the point. Asking, showing the readings on one example, and writing down what you chose is. Reading 2 also has a clean check: count, by brute force, the pairs (s, t) where dist(s, v) + dist(v, t) = dist(s, t), and compare.",
     "say": "**The prompt leaves flow centrality open, so I would ask, and I would show three readings on one example.** Reach is people below you, which is part 2 again. Chains through you is people above times people below, and it follows the arrows. Betweenness ignoring direction is a different number: b is 11, not 3. If nobody answers, I pick chains through you, because it is the shortest-path definition along the referral direction, and I say what changes if a user could have two referrers. I would write the choice as a comment before I code it."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per method, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-referral-d",
     "q": "Core logic in plain English, numbered, for each method, and the edge cases. No code yet.",
     "starter": "add:\n  1.\n  Edge cases:\n\n_closes_loop:\n  1.\n\nall_reach:\n  1.\n\nflow:\n  1.\n",
     "hint": "add checks in an order from cheapest to dearest. The loop check walks up. all_reach needs parents before children. flow needs the count above each user.",
     "solution": "add(referrer, user):\n  1. If either name is empty, return \"bad_event\"\n  2. If a roster exists and either name is not in it, return \"unknown_user\"\n  3. If referrer equals user, return \"self\"\n  4. If user already has this same referrer, return \"duplicate\"\n  5. If user already has a different referrer, return \"second_referrer\"\n  6. If _closes_loop(referrer, user), return \"cycle\"\n  7. Store the link in both dicts, add both names to the user list, return \"ok\"\n  Edge cases: the checks run from cheapest to dearest; nothing is written until the last line; a user seen only as a referrer is still a user\n\n_closes_loop(referrer, user):\n  1. Start at the referrer and walk up through the referrer dict\n  2. If the walk meets user, user would become their own ancestor: True\n  3. If the walk reaches someone with no referrer, False\n  Edge case: a chain of 100,000 is a loop, not recursion\n\nreach(user), the slow one:\n  1. Queue the user's direct referrals\n  2. Pop one, count it, queue its referrals\n  3. Return the count\n  Edge case: unknown user gives 0\n\nall_reach, the fast one:\n  1. List every user with each one after their referrer (breadth first from the roots)\n  2. Go through that list backwards, so all of a user's referrals are finished first\n  3. For each user, add their reach plus one to their referrer's reach\n  Edge case: a user nobody referred and who referred nobody has 0\n\ntop_k(k):\n  1. Compute all_reach\n  2. Take the k smallest by (minus reach, name), so the largest reach comes first and ties go alphabetical\n\nflow, reading 2:\n  1. Walk parents first: above[u] = above[referrer] + 1, and 0 for a root\n  2. Multiply above[u] by reach[u] for each user\n  Edge cases: a root has 0 above, a leaf has 0 below, both score 0\n\nflow_bruteforce, for checking only:\n  1. Breadth first from every user to get the distances\n  2. For each pair (s, t) and each other user v, count v when dist(s, v) + dist(v, t) = dist(s, t)",
     "why": "The order of the checks in add is a design choice you can defend: the cheap ones first, the walk up last, and nothing written before the end. Step 2 of all_reach is the trick that avoids a quadratic walk.",
     "say": "**Before any code I write the steps for each method in plain English.** For add, the checks go from cheapest to dearest, and nothing is written until the last line, so a refused event leaves no half-edge. The loop check walks up from the referrer, and meeting the new user means a loop. For the fast reach, I list users parents first, then go backwards, so that each user is finished before their parent adds them. The score is the count above times the count below, and I will check it against a brute-force count of the definition."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main method first, naming its helpers. Slow then fast. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-referral-e1",
     "q": "Code, top-down. The class with __init__ and add first, naming the loop check as a helper; then the helper; then build.",
     "starter": "class ReferralNetwork:\n    def __init__(self, known_users=None):\n        ...\n\n    def add(self, referrer, user):\n        ...\n",
     "hint": "Six returns in the order you wrote them, then the two stores. add calls self._closes_loop before it writes anything.",
     "solution": "class ReferralNetwork:\n    \"\"\"Who referred whom. Every user has at most one referrer, so the network is a forest.\"\"\"\n\n    def __init__(self, known_users=None):\n        self.known = None if known_users is None else set(known_users)   # None: any name is allowed\n        self.referrer = {}                  # user -> the one person who referred them\n        self.referred = {}                  # user -> list of users they referred, in event order\n        self.users = dict.fromkeys(known_users or ())   # everyone seen; a dict keeps insertion order\n\n    def add(self, referrer, user):\n        \"\"\"Record 'referrer referred user'. Return \"ok\", or the reason it was refused. Refusing changes nothing.\"\"\"\n        if not referrer or not user:\n            return \"bad_event\"                              # None or empty name: a broken row\n        if self.known is not None and (referrer not in self.known or user not in self.known):\n            return \"unknown_user\"\n        if referrer == user:\n            return \"self\"\n        if self.referrer.get(user) == referrer:\n            return \"duplicate\"                              # the same event again: harmless, counted once\n        if user in self.referrer:\n            return \"second_referrer\"                        # a different referrer: the first event wins\n        if self._closes_loop(referrer, user):\n            return \"cycle\"\n        self.referrer[user] = referrer\n        self.referred.setdefault(referrer, []).append(user)\n        self.users[referrer] = self.users[user] = None\n        return \"ok\"\n\n    def _closes_loop(self, referrer, user):\n        \"\"\"Walk up from the referrer. Meeting `user` means user would become their own ancestor.\"\"\"\n        cur = referrer\n        while cur is not None:\n            if cur == user:\n                return True\n            cur = self.referrer.get(cur)\n        return False\n\n\ndef build(events, known_users=None):\n    \"\"\"Feed every event in order. Return the network and the refused events grouped by reason.\"\"\"\n    net, refused = ReferralNetwork(known_users), {}\n    for referrer, user in events:\n        why = net.add(referrer, user)\n        if why != \"ok\":\n            refused.setdefault(why, []).append((referrer, user))\n    return net, refused\n",
     "why": "add reads like the requirements: six refusals, then the write. The loop check has a name, so add stays short and the walk is written once, below it. build is eight lines because add already says why it refused.",
     "say": "**add is the method they will read first, so it reads like the list of rules.** Empty name, unknown name, self, same event again, a different referrer, a loop, and only then do I write to the two dicts. The loop check is a helper that walks up from the referrer. If it meets the new user, that user would become their own ancestor. build feeds events in order and groups the refusals by reason."
    },
    {
     "t": "write",
     "id": "onsite-referral-e2",
     "q": "The queries, slow then fast: who_referred, direct, upline, reach (the obvious walk), then all_reach (one pass), top_k and the helper that lists parents first.",
     "starter": "    def who_referred(self, user):\n        ...\n\n    def reach(self, user):\n        ...\n\n    def all_reach(self):\n        ...\n",
     "hint": "reach is a queue over the referred dict. all_reach goes backwards over a parents-first list and adds reach + 1 to the parent. top_k is heapq.nsmallest with a key of (-reach, name).",
     "solution": "    # Part 2: queries. An unknown user gets a neutral answer: None, [], 0.\n    def who_referred(self, user):\n        return self.referrer.get(user)\n\n    def direct(self, user):\n        return list(self.referred.get(user, []))\n\n    def upline(self, user):\n        \"\"\"The chain of referrers above `user`, nearest first.\"\"\"\n        chain, cur = [], self.referrer.get(user)\n        while cur is not None:\n            chain.append(cur)\n            cur = self.referrer.get(cur)\n        return chain\n\n    def reach(self, user):\n        \"\"\"Slow first version: walk the subtree under `user`. O(size of that subtree) per call.\"\"\"\n        count, queue = 0, deque(self.direct(user))\n        while queue:\n            u = queue.popleft()\n            count += 1\n            queue.extend(self.referred.get(u, ()))\n        return count\n\n    def all_reach(self):\n        \"\"\"Fast version for many queries: every user's reach in one pass, O(n).\"\"\"\n        reach = dict.fromkeys(self.users, 0)\n        for u in reversed(self._parents_first()):      # a child is finished before its parent\n            p = self.referrer.get(u)\n            if p is not None:\n                reach[p] += reach[u] + 1               # the parent gains the child and the child's reach\n        return reach\n\n    def top_k(self, k):\n        \"\"\"The k users with the largest reach, ties broken by name. O(n log k).\"\"\"\n        return heapq.nsmallest(k, self.all_reach().items(), key=lambda kv: (-kv[1], kv[0]))\n\n    def _parents_first(self):\n        \"\"\"Every user, each one after their referrer: a breadth-first walk from the roots.\"\"\"\n        queue = deque(u for u in self.users if u not in self.referrer)\n        order = []\n        while queue:\n            u = queue.popleft()\n            order.append(u)\n            queue.extend(self.referred.get(u, ()))\n        return order\n",
     "why": "reach is correct and costs the size of the subtree on every call, which on a chain of 100,000 is quadratic over all users. all_reach costs one pass. Keeping both lets the fast one be checked against the slow one.",
     "say": "I write the obvious version first: a queue walk that counts the subtree under one user. **It is correct, and it is slow when I call it for every user, so the fast version is one pass backwards over the users, parents first.** By the time I reach a user, all their referrals have already added themselves, so adding reach plus one to the parent is final. I keep the slow one to check the fast one against. top k uses a heap, so it is n log k, not a full sort."
    },
    {
     "t": "write",
     "id": "onsite-referral-e3",
     "q": "Part 3, reading 2: flow() in two passes, then flow_bruteforce() as the definition counted the long way.",
     "starter": "    # Part 3: flow centrality, reading 2 (chains through a user)\n    def flow(self):\n        ...\n",
     "hint": "above[u] = above[parent] + 1 on a parents-first list; the score is above times reach. The brute force runs a breadth-first search from every user and counts v when dist(s, v) + dist(v, t) = dist(s, t).",
     "solution": "    # Part 3: flow centrality, reading B: how many (upstream, downstream) pairs have a chain through you\n    def flow(self):\n        \"\"\"flow(u) = (people above u) * (people below u). Both counts come from one pass each, so O(n).\"\"\"\n        order = self._parents_first()\n        reach = self.all_reach()\n        above = {}\n        for u in order:                                # parents first, so the parent's count is ready\n            p = self.referrer.get(u)\n            above[u] = 0 if p is None else above[p] + 1\n        return {u: above[u] * reach[u] for u in order}\n\n    def flow_bruteforce(self):\n        \"\"\"The definition, word for word: count pairs (s, t) with v on a shortest s-to-t chain. For checking only.\"\"\"\n        dist = {s: self._distances(s) for s in self.users}\n        score = dict.fromkeys(self.users, 0)\n        for s, from_s in dist.items():\n            for t, d_st in from_s.items():\n                for v, d_sv in from_s.items():\n                    if v in (s, t):\n                        continue\n                    d_vt = dist[v].get(t)\n                    if d_vt is not None and d_sv + d_vt == d_st:\n                        score[v] += 1\n        return score\n\n    def _distances(self, start):\n        \"\"\"Breadth-first distances from `start`, following referrals downward.\"\"\"\n        dist, queue = {start: 0}, deque([start])\n        while queue:\n            u = queue.popleft()\n            for c in self.referred.get(u, ()):\n                if c not in dist:\n                    dist[c] = dist[u] + 1\n                    queue.append(c)\n        return dist\n",
     "why": "flow is two O(n) passes and a multiplication. The product is right only because each user has one referrer, so there is one chain between two users. flow_bruteforce does not use that fact, so if it agrees with flow on random networks, the shortcut is correct.",
     "say": "**The score is the number above you times the number below you, and the reason it works is that each user has one referrer, so there is exactly one chain between two people.** I computed the number above in one pass and the number below with the fast reach. Then I wrote the definition the long way, a breadth-first search from every user, and compared the two on a few hundred random networks. If a user could have two referrers, the product is wrong and I would count shortest paths with their multiplicities instead."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** add is O(depth of the referrer) because of the loop check: O(1) on a shallow network, O(n) on a chain, so O(n squared) for 100,000 events on a chain. who_referred is O(1), direct is O(children), upline is O(depth). reach(u) is O(size of u's subtree) per call. all_reach, flow and _parents_first are O(n) time and O(n) space. top_k is O(n log k). flow_bruteforce is O(n cubed) and is for checking only."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-referral-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: the order of the checks in add, setdefault, why a dict for users, why a queue not recursion, what the unknown-user answer is.",
     "solution": "1. Why is 'duplicate' checked before 'second_referrer'?  The same referrer again is harmless and the other is a conflict, so they must be told apart, and the equal case has to come first.\n2. Why do the checks run in that order?  Cheapest first and the walk up last, so the common bad rows never pay for it.\n3. What does add leave behind when it refuses?  Nothing. Every return happens before the first write.\n4. Why setdefault(referrer, []).append(user)?  A referrer seen for the first time has no list yet. setdefault makes it and returns it in one step.\n5. Why is users a dict and not a set?  Two reasons: a root with referrals is only a key in one dict, so I need one place to loop over everyone, and a dict keeps insertion order, so the output is the same every run.\n6. Why a queue and not recursion?  A chain of 100,000 users is far past Python's recursion limit. The queue lives on the heap.\n7. Why does all_reach go backwards?  A user's reach is final only after all their referrals have added themselves. Parents-first reversed gives children first.\n8. What does reach return for a name nobody has seen?  0, by the answer we agreed in the clarify stage.\n9. Where does flow depend on 'one referrer each'?  In the product: above times below counts chains only when there is one chain between two users.\n10. What would you check with another ten minutes?  A long chain for speed, and add after a refused event to prove the network is unchanged.",
     "why": "These are the questions asked of the code on screen. The workbench below has the follow-ups about size and changes. Together they cover what the 30-minute review reports describe.",
     "say": "**In the review I answer from the lines on the screen.** The checks are in a cheap-to-dear order and a refusal writes nothing. setdefault creates the list the first time a referrer appears. The queue is there because a long chain would break recursion. And flow is above times below only because each user has one referrer. If they ask what I would do with more time, I say a speed check on a long chain, and the proof that a refused add changes nothing."
    },
    {
     "t": "problem",
     "id": "onsite-referral-p",
     "title": "Referral network",
     "source": "Mercor-style referral round, rebuilt (three parts)",
     "minutes": 60,
     "why": "Part 1 is data modelling on messy rows, part 2 is two walks, part 3 is the question 'what does the interviewer mean'. The round grades that third thing.",
     "statement": "Part 1. You get a list of referral events, each a pair (referrer, user) meaning the referrer brought in that user. The data is messy. Build the network and refuse, with a reason, any event that is empty, names an unknown user, refers a user to themselves, repeats an event, gives a user a second referrer, or closes a loop. Report how many events were refused for each reason.\n\nPart 2. Answer queries on the network: who referred a user, who a user referred directly, the chain of referrers above a user, the reach of a user (everyone below them at any depth), and the top k users by reach.\n\nPart 3. Add a flow centrality score for every user. The prompt does not say what that means. Ask, name the readings you see, pick one, say why, and implement it cleanly.",
     "examples": [
      {
       "input": "events: a>b, a>c, b>d, b>e, d>f, c>g",
       "output": "reach(a) = 6, reach(b) = 3, reach(e) = 0",
       "note": "Reach counts every level below, not only direct referrals."
      },
      {
       "input": "then: x>b",
       "output": "refused: second_referrer",
       "note": "b already has a referrer, a. The first event wins."
      },
      {
       "input": "then: f>a",
       "output": "refused: cycle",
       "note": "a > b > d > f is already a chain, so f>a would close a loop."
      },
      {
       "input": "ann>bob, ann>bob, cy>bob, bob>bob, bob>ann, (empty)>dee, ann>zed, with roster ann, bob, cy, dee, eve",
       "output": "ok, duplicate, second_referrer, self, cycle, bad_event, unknown_user",
       "note": "Every kind of bad row, each with its own reason."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 100,000 users, so no recursion",
      "no AI; search for syntax only",
      "write your own checks"
     ],
     "starter": "class ReferralNetwork:\n    ...\n\ndef build(events, known_users=None):\n    ...",
     "hints": [
      "Level 1: keep two dicts, user to referrer and user to the list of people they referred. Return a reason string from add, and \"ok\" when it worked.",
      "Level 2: to refuse a loop, walk up from the referrer through the referrer dict. If you meet the new user, refuse the edge. Check duplicate before second_referrer.",
      "Level 3: for every user's reach at once, list users parents first with a queue, go through that list backwards and add reach + 1 to each parent. The score is (users above) x reach."
     ],
     "solution": "from collections import deque\nimport heapq\n\nclass ReferralNetwork:\n    \"\"\"Who referred whom. Every user has at most one referrer, so the network is a forest.\"\"\"\n\n    def __init__(self, known_users=None):\n        self.known = None if known_users is None else set(known_users)   # None: any name is allowed\n        self.referrer = {}                  # user -> the one person who referred them\n        self.referred = {}                  # user -> list of users they referred, in event order\n        self.users = dict.fromkeys(known_users or ())   # everyone seen; a dict keeps insertion order\n\n    def add(self, referrer, user):\n        \"\"\"Record 'referrer referred user'. Return \"ok\", or the reason it was refused. Refusing changes nothing.\"\"\"\n        if not referrer or not user:\n            return \"bad_event\"                              # None or empty name: a broken row\n        if self.known is not None and (referrer not in self.known or user not in self.known):\n            return \"unknown_user\"\n        if referrer == user:\n            return \"self\"\n        if self.referrer.get(user) == referrer:\n            return \"duplicate\"                              # the same event again: harmless, counted once\n        if user in self.referrer:\n            return \"second_referrer\"                        # a different referrer: the first event wins\n        if self._closes_loop(referrer, user):\n            return \"cycle\"\n        self.referrer[user] = referrer\n        self.referred.setdefault(referrer, []).append(user)\n        self.users[referrer] = self.users[user] = None\n        return \"ok\"\n\n    def _closes_loop(self, referrer, user):\n        \"\"\"Walk up from the referrer. Meeting `user` means user would become their own ancestor.\"\"\"\n        cur = referrer\n        while cur is not None:\n            if cur == user:\n                return True\n            cur = self.referrer.get(cur)\n        return False\n\n    # Part 2: queries. An unknown user gets a neutral answer: None, [], 0.\n    def who_referred(self, user):\n        return self.referrer.get(user)\n\n    def direct(self, user):\n        return list(self.referred.get(user, []))\n\n    def upline(self, user):\n        \"\"\"The chain of referrers above `user`, nearest first.\"\"\"\n        chain, cur = [], self.referrer.get(user)\n        while cur is not None:\n            chain.append(cur)\n            cur = self.referrer.get(cur)\n        return chain\n\n    def reach(self, user):\n        \"\"\"Slow first version: walk the subtree under `user`. O(size of that subtree) per call.\"\"\"\n        count, queue = 0, deque(self.direct(user))\n        while queue:\n            u = queue.popleft()\n            count += 1\n            queue.extend(self.referred.get(u, ()))\n        return count\n\n    def all_reach(self):\n        \"\"\"Fast version for many queries: every user's reach in one pass, O(n).\"\"\"\n        reach = dict.fromkeys(self.users, 0)\n        for u in reversed(self._parents_first()):      # a child is finished before its parent\n            p = self.referrer.get(u)\n            if p is not None:\n                reach[p] += reach[u] + 1               # the parent gains the child and the child's reach\n        return reach\n\n    def top_k(self, k):\n        \"\"\"The k users with the largest reach, ties broken by name. O(n log k).\"\"\"\n        return heapq.nsmallest(k, self.all_reach().items(), key=lambda kv: (-kv[1], kv[0]))\n\n    def _parents_first(self):\n        \"\"\"Every user, each one after their referrer: a breadth-first walk from the roots.\"\"\"\n        queue = deque(u for u in self.users if u not in self.referrer)\n        order = []\n        while queue:\n            u = queue.popleft()\n            order.append(u)\n            queue.extend(self.referred.get(u, ()))\n        return order\n\n    # Part 3: flow centrality, reading B: how many (upstream, downstream) pairs have a chain through you\n    def flow(self):\n        \"\"\"flow(u) = (people above u) * (people below u). Both counts come from one pass each, so O(n).\"\"\"\n        order = self._parents_first()\n        reach = self.all_reach()\n        above = {}\n        for u in order:                                # parents first, so the parent's count is ready\n            p = self.referrer.get(u)\n            above[u] = 0 if p is None else above[p] + 1\n        return {u: above[u] * reach[u] for u in order}\n\n    def flow_bruteforce(self):\n        \"\"\"The definition, word for word: count pairs (s, t) with v on a shortest s-to-t chain. For checking only.\"\"\"\n        dist = {s: self._distances(s) for s in self.users}\n        score = dict.fromkeys(self.users, 0)\n        for s, from_s in dist.items():\n            for t, d_st in from_s.items():\n                for v, d_sv in from_s.items():\n                    if v in (s, t):\n                        continue\n                    d_vt = dist[v].get(t)\n                    if d_vt is not None and d_sv + d_vt == d_st:\n                        score[v] += 1\n        return score\n\n    def _distances(self, start):\n        \"\"\"Breadth-first distances from `start`, following referrals downward.\"\"\"\n        dist, queue = {start: 0}, deque([start])\n        while queue:\n            u = queue.popleft()\n            for c in self.referred.get(u, ()):\n                if c not in dist:\n                    dist[c] = dist[u] + 1\n                    queue.append(c)\n        return dist\n\n\ndef build(events, known_users=None):\n    \"\"\"Feed every event in order. Return the network and the refused events grouped by reason.\"\"\"\n    net, refused = ReferralNetwork(known_users), {}\n    for referrer, user in events:\n        why = net.add(referrer, user)\n        if why != \"ok\":\n            refused.setdefault(why, []).append((referrer, user))\n    return net, refused\n",
     "complexity": "add is O(depth of the referrer), O(n) on a chain. who_referred O(1), direct O(children), upline O(depth). reach(u) is O(subtree under u) per call; looping it over all users is O(n^2) on a chain. all_reach, flow and top_k's input are one O(n) pass; top_k is O(n log k). Space is O(n). flow_bruteforce is O(n^3) and only for checking.",
     "explain": [
      "Two dicts store the same edges from both sides. The cost is memory; the gain is that 'who referred me' and 'who did I refer' are each one lookup.",
      "add returns a reason, not a bool. Every refusal returns before the first write, so a rejected event never leaves a half-edge, and build can report the counts.",
      "Duplicate comes before second_referrer: the same referrer again is harmless, a different one is a conflict.",
      "The loop check walks up from the referrer. If it reaches the new user, the new edge would make the user their own ancestor.",
      "reach is the slow, obvious version, a queue over the subtree. all_reach does the same work for every user in one pass, backwards over a parents-first list.",
      "flow multiplies the number of people above by the number below. A root has none above and a leaf none below, so both score 0.",
      "flow_bruteforce counts the definition directly. flow and flow_bruteforce must agree on every network, which the random check tests.",
      "Output on the example: reach a=6, b=3, c=1, d=1, rest 0; flow b=3, d=2, c=1, rest 0."
     ],
     "tests": "events = [(\"a\", \"b\"), (\"a\", \"c\"), (\"b\", \"d\"), (\"b\", \"e\"), (\"d\", \"f\"), (\"c\", \"g\")]\nnet, refused = build(events)\nassert not refused\nassert net.add(\"x\", \"b\") == \"second_referrer\"      # b already has a referrer, a\nassert net.add(\"f\", \"a\") == \"cycle\"                # a > b > d > f is a chain\nassert net.add(\"z\", \"z\") == \"self\"\nassert net.add(\"a\", \"b\") == \"duplicate\"\nassert net.add(\"\", \"q\") == \"bad_event\"\nassert net.who_referred(\"f\") == \"d\" and net.who_referred(\"a\") is None\nassert net.direct(\"b\") == [\"d\", \"e\"] and net.upline(\"f\") == [\"d\", \"b\", \"a\"]\nassert net.reach(\"a\") == 6 and net.reach(\"b\") == 3 and net.reach(\"e\") == 0 and net.reach(\"nobody\") == 0\nreach = net.all_reach()\nassert reach == {u: net.reach(u) for u in net.users}\nprint(\"reach:\", dict(sorted(reach.items())))\nprint(\"flow: \", dict(sorted(net.flow().items())))\nassert net.flow() == net.flow_bruteforce()\nprint(\"top 2:\", net.top_k(2))\n\n# messy real data: every kind of bad row, then the report\nrows = [(\"ann\", \"bob\"), (\"ann\", \"bob\"), (\"cy\", \"bob\"), (\"bob\", \"bob\"), (\"bob\", \"ann\"), (\"\", \"dee\"), (\"bob\", \"eve\"), (\"ann\", \"zed\")]\nnet2, refused2 = build(rows, known_users=[\"ann\", \"bob\", \"cy\", \"dee\", \"eve\"])\nprint({why: len(rs) for why, rs in sorted(refused2.items())})\nprint(\"ok\")\n\nimport random\n\ndef random_events(rng, n_users, n_events):\n    names = [f\"u{i}\" for i in range(n_users)]\n    return [(rng.choice(names + [\"\"]), rng.choice(names)) for _ in range(n_events)]\n\nrng = random.Random(7)\nfor trial in range(300):\n    net, _ = build(random_events(rng, rng.randint(2, 12), rng.randint(1, 30)))\n    for u in net.users:                                       # no loops: a walk up always ends\n        assert u not in net.upline(u)\n        assert len(set(net.upline(u))) == len(net.upline(u))\n    assert net.all_reach() == {u: net.reach(u) for u in net.users}\n    assert net.flow() == net.flow_bruteforce()\nprint(\"300 random networks: loops never form, fast equals slow, flow equals its definition\")\n",
     "followups": [
      {
       "q": "What breaks at a million events?",
       "a": "Two things. The loop check walks up the referrer chain, so a long chain costs O(depth) per event and about n squared over the stream. And memory: two dicts of strings and a list per referrer is a lot of Python objects, so use integer ids for names and read events from a stream instead of holding the list. The loop check is fixed with union-find, which is the next question. Say the order of magnitude, then say you would measure it before you changed anything."
      },
      {
       "q": "How would you make the loop check fast?",
       "a": "Use union-find over the trees. The new user has no referrer yet, so they are the root of their own tree. The event closes a loop exactly when the referrer is already in that tree, so the check is find(referrer) == find(user), which is close to O(1). After an accepted event, union the two trees. The code is in the block below this list, and it agrees with the walk up on random streams."
      },
      {
       "q": "Why a queue and not recursion?",
       "a": "A chain of 100,000 users is far past Python's recursion limit of about 1,000. A queue lives on the heap and has no such limit. Say you know the recursive version is shorter and why you did not use it."
      },
      {
       "q": "What changes if a user can have two referrers?",
       "a": "It becomes a graph, not a forest. The loop check searches up every parent. Reach counts each user once, with a visited set. And the product formula is no longer right, because there can be several shortest chains between two users: count shortest paths with their multiplicities (Brandes) and say it costs more. Ask before you build it."
      },
      {
       "q": "What if events arrive one at a time and queries are mixed in?",
       "a": "Keep the counts up to date on every add: walk up from the referrer and add one plus the new user's reach to every ancestor. That makes add O(depth) and reach O(1). Or keep the lazy version and cache all_reach until the next accepted event."
      },
      {
       "q": "Why return a reason and not raise an exception?",
       "a": "A bad row in real data is expected, not exceptional. Raising would stop a batch of 100,000 rows at the first bad one. A reason lets the loop carry on and report the counts at the end."
      },
      {
       "q": "How did you test it, with no test framework?",
       "a": "Plain asserts under the class. The seven-person example, one assert per refusal, a check that a refused add changes nothing, and two comparisons of the fast code with the slow code: all_reach with reach, and flow with its brute-force definition on a few hundred random networks. Comparing two implementations catches mistakes in either."
      }
     ],
     "d": "medium",
     "lc": "employee-importance"
    },
    {
     "t": "code",
     "id": "onsite-referral-uf",
     "title": "Faster loop check with union-find (follow-up; runs together with the solution above)",
     "code": "class Components:\n    \"\"\"Union-find: which tree each user is in, in near O(1) per call.\"\"\"\n\n    def __init__(self):\n        self.up = {}\n\n    def find(self, x):\n        self.up.setdefault(x, x)\n        while self.up[x] != x:\n            self.up[x] = self.up[self.up[x]]          # path halving keeps the chains short\n            x = self.up[x]\n        return x\n\n    def union(self, a, b):\n        self.up[self.find(a)] = self.find(b)\n\n\n# The new user has no referrer yet, so they are the root of their own tree.\n# The event closes a loop exactly when the referrer is already in that tree.\ndef closes_loop_fast(parts, referrer, user):\n    return parts.find(referrer) == parts.find(user)\n\nimport random\nrng = random.Random(3)\nfor trial in range(200):\n    slow, parts = ReferralNetwork(), Components()\n    for _ in range(40):\n        r, u = f\"u{rng.randrange(10)}\", f\"u{rng.randrange(10)}\"\n        if r == u or u in slow.referrer:\n            continue\n        fast = closes_loop_fast(parts, r, u)\n        assert fast == slow._closes_loop(r, u)\n        if slow.add(r, u) == \"ok\":\n            parts.union(r, u)\nprint(\"union-find loop check agrees with the walk up on 200 random streams\")\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Employee Importance",
       "d": "medium",
       "lc": "employee-importance",
       "why": "Reach of one node down a manager tree. This is part 2 with other names."
      },
      {
       "n": "Time Needed to Inform All Employees",
       "d": "medium",
       "lc": "time-needed-to-inform-all-employees",
       "yt": [
        "zdBYi0p4L5Q",
        "NeetCodeIO",
        11
       ],
       "why": "Depth along referral chains. The same walk, now carrying a number down."
      },
      {
       "n": "Redundant Connection",
       "d": "medium",
       "lc": "redundant-connection",
       "yt": [
        "FXWRE67PLL0",
        "NeetCode",
        17
       ],
       "why": "Union-find to refuse an edge that closes a loop. This is the fast loop check from the follow-up."
      },
      {
       "n": "Redundant Connection II",
       "d": "hard",
       "lc": "redundant-connection-ii",
       "yt": [
        "U7_ynlauYh0",
        "InterviewDose",
        6
       ],
       "why": "A directed graph where one node gets two parents or an edge closes a loop. Your add() rules, as one problem."
      },
      {
       "n": "Sum of Distances in Tree",
       "d": "hard",
       "lc": "sum-of-distances-in-tree",
       "yt": [
        "OCGPug-KirQ",
        "Timothy H Chang",
        13
       ],
       "why": "The harder follow-up: a score per node from counts below and above it, in O(n). The shape of reading 3."
      }
     ]
    },
    {
     "t": "predict",
     "id": "onsite-referral-pred",
     "code": "parent = {\"b\": \"a\", \"c\": \"b\"}\ncur, chain = \"c\", []\nwhile cur is not None:\n    chain.append(cur)\n    cur = parent.get(cur)\nprint(chain)\nprint(\"a\" in chain)",
     "q": "This is the loop check for the event 'c referred a'. What does it print, and is the event accepted?",
     "answer": "['c', 'b', 'a']\nTrue",
     "why": "Walking up from c gives c, b, a. The new user a is in the chain, so adding c>a would make a its own ancestor. The event is refused with reason cycle."
    }
   ]
  },
  {
   "id": "onsite-scheduler",
   "title": "2. Task scheduler",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A two-part prompt in the same solo hour. Part 1 runs tasks that depend on each other, in order, and refuses a loop. Part 2 adds failures and retries. The graph idea is topological order, which you may know as Course Schedule. The new part is deciding what a failure means for everything behind it. Reports name the two parts but not what part 2 holds, so failures and retries is a reading, not a fact. The prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**a) Clarify.** Three buckets, each question with the answer you will assume."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-a",
     "q": "Write your questions under each bucket, and the answer you will assume if the interviewer does not give one.",
     "starter": "1. Primary capabilities (what it must do)\n- \n\n2. Error handling (what goes wrong)\n- \n\n3. Scope boundaries (where it stops)\n- ",
     "hint": "Capabilities: what a task is, how dependencies are written, what part 1 returns, one at a time or in parallel. Errors: a loop, an unknown dependency, a task that raises, the tasks behind it. Scope: backoff, timeouts, saving state.",
     "solution": "1. Primary capabilities\n- What is a task, and how are dependencies given?  Likely: a name, with a dict name -> list of names it needs; the functions are in a second dict.\n- What does part 1 return?  The order as a list. Ties go in input order, so the answer is the same every run.\n- One task at a time, or in parallel?  One at a time. Say that the groups that could run together fall out of the same algorithm.\n- Can a dependency be listed twice?  Yes. Count it once.\n- What does part 2 return?  A result for every task, so nothing is silently missing: status, attempts, last error, and for a skipped task which failure blocked it.\n\n2. Error handling\n- A loop in the dependencies?  Raise before running anything, and name the loop: a -> b -> c -> a.\n- A task needs a name that is not a task?  Raise, naming both.\n- A task has no function?  Raise before running anything.\n- A task raises?  Retry up to a cap, say 2 retries, so 3 calls. Then it is failed.\n- What happens to the tasks that need a failed task?  They are skipped without being run, and so are theirs, all the way down.\n- Do tasks that do not need it still run?  Yes. Failing everything on the first error is the other reading, so ask.\n\n3. Scope boundaries\n- Waiting between retries, or a timeout per call?  Not in the first version. Say backoff with jitter is what you add next.\n- Saving state so a crash does not rerun finished tasks?  Out of scope. Say it is the start of a durable scheduler.\n- Passing one task's result to the next, or cancelling a run?  Out of scope.",
     "why": "Every question picks a line of code. The cycle answer decides when the error is raised. The failure answers decide the whole of part 2: skip, not stop, and a result per task.",
     "say": "**I sort my questions into three buckets: what it must do, what goes wrong, where it stops.** A task is a name with a list of what it needs, and part 1 returns an order. Then the failures, which are most of the problem: a loop, an unknown name, a task that raises, and what that does to the tasks behind it. I would like the answer to be that independent tasks still run. Last, I ask to leave backoff and saving state out of the first version, and I say I know they come next."
    },
    {
     "t": "p",
     "text": "**b) Requirements.** Numbered, each one testable. Part 2 is written as rules first."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-b",
     "q": "Write the requirements, numbered, each one testable. Then what is out of scope.",
     "starter": "1. \n2. \n3. \n",
     "hint": "Order, the two errors, deterministic output, the retry cap, skipping, the result for every task.",
     "solution": "1. run_order(deps) returns every task once, each after all the tasks it needs.\n   - Test: for every task, its dependencies come earlier in the list\n   - A dependency listed twice counts once\n   - Ties keep input order, so two runs give the same list\n2. A loop raises CycleError that names the loop (a -> b -> a), before anything runs.\n   - A task that needs itself is a loop\n   - Tasks that are only behind a loop are not in the message\n3. A dependency that is not a task raises KeyError naming both. A task with no function raises before anything runs.\n4. run_all(deps, funcs, max_retries) runs tasks in that order.\n   - A task that raises is called again, at most 1 + max_retries calls in all, and stops at the first success\n5. A task that fails every call is 'failed', with the last error and the number of calls.\n6. Every task that needs a failed or skipped task is 'skipped', is never called, and names the failed task at the start of the chain.\n7. Tasks that do not need a failed task still run.\n8. run_all returns a result for every task, so len(results) equals len(deps).\n9. Out of scope: parallel runs, waiting between tries, timeouts, saving state, passing results between tasks.",
     "why": "2 and 3 are part 1. 4 to 8 are part 2, and they are written as rules before any code. That is what the reviewer wants to see: the failure behaviour decided in words, then implemented.",
     "say": "I get nine requirements, and I can test each one. **Requirements 6 and 7 are the heart of part 2: a task behind a failure is skipped and never called, and a task that does not need it still runs.** I also want 8: a result for every task, so nothing disappears from the report. Out of scope: parallel runs, waiting between tries, timeouts and saving state."
    },
    {
     "t": "p",
     "text": "**c) Entities.** Few classes here, and that is a decision you say out loud."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-c",
     "q": "List the nouns. For each: keep or drop, why, and the data structure it becomes.",
     "starter": "Task: \nDependency: \nOrder: \nCycle: \nAttempt, retry cap: \nStatus: \nResult: \nReady queue: \nScheduler: ",
     "hint": "A name with a list is a dict entry. What carries a rule, or is returned to the caller, may be a small class.",
     "solution": "Task: drop as a class. A name (the dict key) with a list of needs (deps) and a function (funcs). Two dicts, so the order can be tested with no functions at all.\nDependency: keep as data. deps[t] is the list of names t needs. The reverse map users[d], the tasks that wait for d, is built once so a finished task reaches only its waiters.\nOrder: drop as a class. A list returned by run_order.\nCycle: keep as an error. CycleError, whose message is the loop. It is raised, not stored.\nAttempt, retry cap: drop. An int in a loop and a parameter max_retries.\nStatus: drop as a class. One of three strings: ok, failed, skipped.\nResult: keep. A small dataclass: status, attempts, error, blocked_by. It is what the caller reads and it is the same shape for every task.\nReady queue: keep as a local. A deque of tasks whose waiting count is zero; it never leaves run_order.\nScheduler: drop. Three functions are enough; a class would only hold state that does not outlive one call.",
     "why": "No big class here, and that is a decision you say out loud: the state lives for one call, so functions and one dataclass do the work. The one structure to defend is the reverse map: it is why a finished task costs the number of its waiters, not the number of tasks.",
     "say": "I underline the nouns. **Only the result earns a class, because it is what the caller reads, and the same shape for every task makes a missing task impossible to miss.** A task is a name with a list and a function, so I keep them as two dicts, which lets me test the order without running anything. The reverse map is the one structure worth explaining: it tells a finished task exactly who is waiting for it. I do not write a scheduler class, because nothing needs to outlive one call."
    },
    {
     "t": "p",
     "text": "**d) Core logic.** Plain English, numbered, per function, with the edge cases. No code yet."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-d",
     "q": "Core logic in plain English, numbered, for each function, and the edge cases. No code yet.",
     "starter": "run_order:\n  1.\n  Edge cases:\n\n_find_cycle:\n  1.\n\nrun_all:\n  1.\n\n_attempt:\n  1.\n",
     "hint": "Count open dependencies, start from zero, lower the count of the waiters when a task finishes. Leftovers are a cycle or behind one. Retries are a loop of 1 + max_retries calls that stops at the first success.",
     "solution": "run_order(deps):\n  1. Check every dependency is a task; if not, raise KeyError naming both\n  2. waiting[t] = number of different tasks t needs; users[d] = tasks that need d\n  3. Queue every task with waiting 0, in input order\n  4. Pop one, add it to the order; for each task that waits for it, lower its count, and queue it when it reaches 0\n  5. If the order has fewer tasks than there are, raise CycleError with the loop\n  Edge cases: a repeated dependency counts once (use a set); a task that needs itself never reaches 0; an empty dict gives []\n\n_find_cycle(deps, waiting):\n  1. The leftover tasks are the ones with waiting above 0, in input order\n  2. Every leftover task needs at least one other leftover task\n  3. Start at the first leftover and follow 'needs' links until a name repeats\n  4. The names from the first visit of the repeated one to the repeat are the loop\n  Edge cases: a task behind a loop is not in the message; a self-loop is 'a -> a'\n\nrun_all(deps, funcs, max_retries):\n  1. If any task has no function, raise before running anything\n  2. Get the order; a loop raises here, so nothing has run\n  3. For each task, in order: look for a dependency whose result is not ok\n  4. If there is one: the task is skipped; blocked_by is that dependency if it failed, else whatever blocked it. Do not call it\n  5. Otherwise call _attempt and store its result\n  Edge case: a dependency always has a result already, because the order puts it first\n\n_attempt(fn, max_retries):\n  1. Start with a failed result\n  2. Call fn up to 1 + max_retries times, counting calls\n  3. On an exception, keep its text and go again; on success mark ok, clear the error and stop\n  Edge cases: max_retries 0 means one call; catch Exception, not BaseException, so Ctrl-C still stops the run",
     "why": "Writing blocked_by as 'the failed task at the start of the chain' is a decision made in step 4. It costs one line and it answers the first question after a failure: why was this skipped?",
     "say": "**Before any code I write the steps for each function.** For the order, I count what each task still waits for and start from zero, and a repeated dependency counts once. If tasks are left over, they are on a loop or behind one, so I follow needs links from the first leftover until a name repeats, and that is the loop. For running, I decide in words that a task behind a failure is never called, and that it records which failure is to blame. A retry is a loop of one plus the cap, and it stops at the first success."
    },
    {
     "t": "p",
     "text": "**e) Code.** Top-down: the main function first, naming its helpers. Slow then fast. Complexity said precisely."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-e1",
     "q": "Code, top-down. First the slow order (keep scanning), then run_order (count open dependencies) naming its helpers, then the three helpers.",
     "starter": "def order_slow(deps):\n    ...\n\ndef run_order(deps):\n    ...\n",
     "hint": "order_slow loops until nothing is left, taking every task whose dependencies are done. run_order calls _check_known and _count_open, then queues zeros. A leftover count means a loop, and _find_cycle names it.",
     "solution": "from collections import deque\nfrom dataclasses import dataclass\n\n\nclass CycleError(ValueError):\n    \"\"\"The tasks depend on each other in a loop. The message names the loop.\"\"\"\n\n\ndef run_order(deps):\n    \"\"\"An order in which every task comes after the tasks it needs. deps: task -> list of tasks it needs first.\n    Raises KeyError for an unknown dependency and CycleError for a loop, before anything runs. O(tasks + edges).\"\"\"\n    _check_known(deps)\n    waiting, users = _count_open(deps)\n    ready = deque(t for t in deps if waiting[t] == 0)      # no open dependency: can go now\n    order = []\n    while ready:\n        t = ready.popleft()\n        order.append(t)\n        for u in users[t]:                                 # t is done: one fewer thing for u to wait for\n            waiting[u] -= 1\n            if waiting[u] == 0:\n                ready.append(u)\n    if len(order) < len(deps):                             # something never became ready\n        raise CycleError(\" -> \".join(_find_cycle(deps, waiting)))\n    return order\n\n\ndef _check_known(deps):\n    for t, needs in deps.items():\n        for d in needs:\n            if d not in deps:\n                raise KeyError(f\"{t} needs {d}, which is not a task\")\n\n\ndef _count_open(deps):\n    \"\"\"waiting[t]: how many different tasks t still needs. users[d]: the tasks that wait for d.\"\"\"\n    waiting = {t: len(set(needs)) for t, needs in deps.items()}   # set: a repeated dependency counts once\n    users = {t: [] for t in deps}\n    for t, needs in deps.items():\n        for d in set(needs):\n            users[d].append(t)\n    return waiting, users\n\n\ndef _find_cycle(deps, waiting):\n    \"\"\"Leftover tasks are on a loop or behind one. Follow 'needs' links until a name repeats: that is the loop.\"\"\"\n    stuck = [t for t, n in waiting.items() if n > 0]       # a list in input order, so the message is the same every run\n    path, t = [], stuck[0]\n    while t not in path:\n        path.append(t)\n        t = next(d for d in deps[t] if waiting[d] > 0)     # every stuck task has a stuck dependency\n    return path[path.index(t):] + [t]\n\n\ndef order_slow(deps):\n    \"\"\"First version: keep scanning for tasks whose dependencies are all done. O(n^2) on a chain.\"\"\"\n    done, order = set(), []\n    while len(order) < len(deps):\n        ready = [t for t in deps if t not in done and all(d in done for d in deps[t])]\n        if not ready:\n            raise CycleError(\"stuck: \" + \", \".join(sorted(t for t in deps if t not in done)))\n        for t in ready:\n            done.add(t)\n            order.append(t)\n    return order\n",
     "why": "The slow version is five lines and obviously right, so it checks the fast one. run_order reads like the steps: check, count, queue, drain, and complain about leftovers. The loop message comes from a helper, not from a guess.",
     "say": "I write the slow version first: keep scanning for tasks whose dependencies are done. **It is correct and it is quadratic on a chain, so the fast one counts open dependencies and lowers the count of the waiters.** Both are short, and I keep the slow one to check the fast one. If tasks are left over, I do say more than that there is a cycle. I follow needs links from the first leftover until a name repeats, and print that loop, so the person reading the error knows what to fix."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-e2",
     "q": "Part 2: Result, then run_all (skip what is behind a failure), then _attempt (the retry loop).",
     "starter": "@dataclass\nclass Result:\n    ...\n\ndef run_all(deps, funcs, max_retries=2):\n    ...\n\ndef _attempt(fn, max_retries):\n    ...\n",
     "hint": "run_all gets the order first so a loop raises before anything runs. For each task look for a dependency that is not ok. _attempt is a for loop over range(1, max_retries + 2) with try, except Exception, else.",
     "solution": "@dataclass\nclass Result:\n    status: str              # \"ok\", \"failed\" or \"skipped\"\n    attempts: int = 0        # times the function was called; 0 for a skipped task\n    error: str = \"\"          # the last error, for a failed task\n    blocked_by: str = \"\"     # for a skipped task: the failed task at the start of the chain\n\n\ndef run_all(deps, funcs, max_retries=2):\n    \"\"\"Run every task in dependency order. Returns task -> Result, in the order they were reached.\"\"\"\n    missing = deps.keys() - funcs.keys()\n    if missing:\n        raise KeyError(\"no function for: \" + \", \".join(sorted(missing)))\n    results = {}\n    for t in run_order(deps):                              # a cycle raises here, before anything has run\n        bad = next((d for d in deps[t] if results[d].status != \"ok\"), None)\n        if bad is not None:                                # a dependency failed or was skipped\n            root = bad if results[bad].status == \"failed\" else results[bad].blocked_by\n            results[t] = Result(\"skipped\", blocked_by=root)\n            continue\n        results[t] = _attempt(funcs[t], max_retries)\n    return results\n\n\ndef _attempt(fn, max_retries):\n    \"\"\"Call fn up to 1 + max_retries times; stop at the first success.\"\"\"\n    result = Result(\"failed\")\n    for n in range(1, max_retries + 2):\n        result.attempts = n\n        try:\n            fn()\n        except Exception as e:                             # not BaseException: Ctrl-C must still stop us\n            result.error = f\"{type(e).__name__}: {e}\"\n        else:\n            result.status, result.error = \"ok\", \"\"\n            return result\n    return result\n",
     "why": "run_all is the whole policy in nine lines: order first, skip behind a failure, otherwise attempt. _attempt is the whole retry rule. The for-else shape means a success returns at once and a final failure falls out of the loop already marked failed.",
     "say": "**run_all gets the order first, so a loop raises before anything has run.** Then for each task I look for a dependency that is not ok. If there is one, the task is skipped, never called, and it records the failed task at the start of the chain. Otherwise I call _attempt, which tries up to one plus the cap and stops at the first success. I catch Exception and not BaseException, so Ctrl-C still stops the run. And the result for every task is stored, so nothing goes missing from the report."
    },
    {
     "t": "p",
     "text": "**Complexity, precisely.** order_slow rescans every task each round: O(n squared) on a chain. run_order visits each task and each dependency once: O(tasks + dependencies) time and space. _find_cycle is O(tasks). run_all adds the work of the functions themselves: at most 1 + max_retries calls per task, and the checks around them are O(dependencies) in all."
    },
    {
     "t": "p",
     "text": "**f) Review.** The line-by-line questions, then the follow-ups under the workbench."
    },
    {
     "t": "write",
     "id": "onsite-scheduler-f",
     "q": "Review. Write the questions a reviewer asks line by line on this code, and your one-line answer to each.",
     "starter": "1. \n2. \n3. \n4. \n5. ",
     "hint": "Look at your own lines: the set in the count, the reverse map, why leftovers mean a loop, where status is set to failed, why Exception, what blocked_by holds.",
     "solution": "1. Why len(set(needs)) and not len(needs)?  A task that lists a dependency twice would wait for a count that never reaches zero and be reported as part of a loop.\n2. Why build the reverse map users?  A finished task then reaches only the tasks that wait for it. Without it every finish would scan all tasks.\n3. Why do leftover tasks mean a loop?  A task is queued only when all its dependencies are done. A task left over has a dependency that never finished, which is a loop or a path from one.\n4. Why does the cycle message not include the tasks behind the loop?  Because _find_cycle follows needs links until a name repeats, and a name repeats only on the loop itself.\n5. Why is the cycle raised before anything runs?  Half a run of a graph with a loop is worse than none: you cannot tell what state it left.\n6. Why range(1, max_retries + 2)?  The first call plus max_retries more: with 2 retries that is 3 calls.\n7. Why except Exception and not BaseException?  A KeyboardInterrupt must stop the run, not be counted as a failed attempt.\n8. Why is a dependency's result always there in run_all?  The order puts every dependency before the task that needs it.\n9. What is blocked_by for a task two steps behind the failure?  The failed task at the start of the chain, copied forward from the skipped one.\n10. What did you not test?  A task that raises something odd, and a very long chain for speed. I would add both with more time.",
     "why": "These are the questions asked of the code on screen. The workbench below has the follow-ups about parallel runs, backoff and saving state.",
     "say": "**In the review I answer from the lines on the screen.** The set stops a repeated dependency from waiting forever. The reverse map is why a finished task costs its waiters, not all tasks. Leftover tasks have a dependency that never finished, so the loop is somewhere in what remains, and I follow the links to name it. The retry range is one plus the cap, and I catch Exception so that Ctrl-C still works. If they ask what I did not test, I say a very long chain for speed and an unusual exception, and I would add both next."
    },
    {
     "t": "problem",
     "id": "onsite-scheduler-p",
     "title": "Task scheduler",
     "source": "Mercor-style scheduler round, rebuilt (two parts)",
     "minutes": 45,
     "why": "Dependency order is a standard graph problem. The value is in part 2: stating the failure rules clearly, which is the same thinking as a real job orchestrator.",
     "statement": "Part 1. You have tasks, each with a name and a list of the tasks it needs to finish first. Return an order in which all of them can run. If tasks depend on each other in a loop, raise an error that names the loop and run nothing. If a task needs one that does not exist, raise an error that names both.\n\nPart 2. Each task also has a function. Run the tasks in dependency order. If a task raises, retry it up to a cap. If it still fails, mark it failed and skip every task that depends on it, directly or not. Tasks that do not depend on it still run. Return a result for every task: its status, how many times it was called, the last error, and for a skipped task which failure blocked it.",
     "examples": [
      {
       "input": "build needs lint and fetch; lint needs fetch; test needs build; docs needs nothing",
       "output": "fetch, docs, lint, build, test",
       "note": "Any order with fetch before lint before build before test is valid. Ties keep input order."
      },
      {
       "input": "a needs b, b needs c, c needs a, d needs nothing",
       "output": "CycleError: a -> b -> c -> a",
       "note": "d is fine, but nothing runs because the loop is found first."
      },
      {
       "input": "fetch fails twice then works; build always fails; max_retries = 2",
       "output": "fetch ok (3 calls), build failed (3 calls), test skipped, blocked by build",
       "note": "Docs and lint do not need build and still run."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 10,000 tasks",
      "dependencies may repeat in a list",
      "functions take no arguments"
     ],
     "starter": "def run_order(deps):\n    ...\n\ndef run_all(deps, funcs, max_retries=2):\n    ...",
     "hints": [
      "Level 1: a task can run when every task it needs is done. Count how many it still waits for.",
      "Level 2: also build the reverse map, task to the tasks that wait for it. When a task finishes, lower each waiter's count and queue it at zero.",
      "Level 3: when the queue is empty and fewer tasks came out than exist, the rest are on or behind a loop. For retries, loop over 1 + max_retries calls with try, except Exception and else, and stop at the first success."
     ],
     "solution": "from collections import deque\nfrom dataclasses import dataclass\n\n\nclass CycleError(ValueError):\n    \"\"\"The tasks depend on each other in a loop. The message names the loop.\"\"\"\n\n\ndef run_order(deps):\n    \"\"\"An order in which every task comes after the tasks it needs. deps: task -> list of tasks it needs first.\n    Raises KeyError for an unknown dependency and CycleError for a loop, before anything runs. O(tasks + edges).\"\"\"\n    _check_known(deps)\n    waiting, users = _count_open(deps)\n    ready = deque(t for t in deps if waiting[t] == 0)      # no open dependency: can go now\n    order = []\n    while ready:\n        t = ready.popleft()\n        order.append(t)\n        for u in users[t]:                                 # t is done: one fewer thing for u to wait for\n            waiting[u] -= 1\n            if waiting[u] == 0:\n                ready.append(u)\n    if len(order) < len(deps):                             # something never became ready\n        raise CycleError(\" -> \".join(_find_cycle(deps, waiting)))\n    return order\n\n\ndef _check_known(deps):\n    for t, needs in deps.items():\n        for d in needs:\n            if d not in deps:\n                raise KeyError(f\"{t} needs {d}, which is not a task\")\n\n\ndef _count_open(deps):\n    \"\"\"waiting[t]: how many different tasks t still needs. users[d]: the tasks that wait for d.\"\"\"\n    waiting = {t: len(set(needs)) for t, needs in deps.items()}   # set: a repeated dependency counts once\n    users = {t: [] for t in deps}\n    for t, needs in deps.items():\n        for d in set(needs):\n            users[d].append(t)\n    return waiting, users\n\n\ndef _find_cycle(deps, waiting):\n    \"\"\"Leftover tasks are on a loop or behind one. Follow 'needs' links until a name repeats: that is the loop.\"\"\"\n    stuck = [t for t, n in waiting.items() if n > 0]       # a list in input order, so the message is the same every run\n    path, t = [], stuck[0]\n    while t not in path:\n        path.append(t)\n        t = next(d for d in deps[t] if waiting[d] > 0)     # every stuck task has a stuck dependency\n    return path[path.index(t):] + [t]\n\n\n@dataclass\nclass Result:\n    status: str              # \"ok\", \"failed\" or \"skipped\"\n    attempts: int = 0        # times the function was called; 0 for a skipped task\n    error: str = \"\"          # the last error, for a failed task\n    blocked_by: str = \"\"     # for a skipped task: the failed task at the start of the chain\n\n\ndef run_all(deps, funcs, max_retries=2):\n    \"\"\"Run every task in dependency order. Returns task -> Result, in the order they were reached.\"\"\"\n    missing = deps.keys() - funcs.keys()\n    if missing:\n        raise KeyError(\"no function for: \" + \", \".join(sorted(missing)))\n    results = {}\n    for t in run_order(deps):                              # a cycle raises here, before anything has run\n        bad = next((d for d in deps[t] if results[d].status != \"ok\"), None)\n        if bad is not None:                                # a dependency failed or was skipped\n            root = bad if results[bad].status == \"failed\" else results[bad].blocked_by\n            results[t] = Result(\"skipped\", blocked_by=root)\n            continue\n        results[t] = _attempt(funcs[t], max_retries)\n    return results\n\n\ndef _attempt(fn, max_retries):\n    \"\"\"Call fn up to 1 + max_retries times; stop at the first success.\"\"\"\n    result = Result(\"failed\")\n    for n in range(1, max_retries + 2):\n        result.attempts = n\n        try:\n            fn()\n        except Exception as e:                             # not BaseException: Ctrl-C must still stop us\n            result.error = f\"{type(e).__name__}: {e}\"\n        else:\n            result.status, result.error = \"ok\", \"\"\n            return result\n    return result\n\n\ndef order_slow(deps):\n    \"\"\"First version: keep scanning for tasks whose dependencies are all done. O(n^2) on a chain.\"\"\"\n    done, order = set(), []\n    while len(order) < len(deps):\n        ready = [t for t in deps if t not in done and all(d in done for d in deps[t])]\n        if not ready:\n            raise CycleError(\"stuck: \" + \", \".join(sorted(t for t in deps if t not in done)))\n        for t in ready:\n            done.add(t)\n            order.append(t)\n    return order\n",
     "complexity": "order_slow is O(n^2) on a chain. run_order is O(tasks + dependencies) time and space. _find_cycle is O(tasks). run_all adds at most (1 + max_retries) calls per task plus O(dependencies) for the checks.",
     "explain": [
      "order_slow is the first version: loop until nothing is left, taking every task whose dependencies are all done. It is correct, and it re-checks the same tasks again and again.",
      "run_order first checks that every dependency exists. A typo should fail with a clear message, not a KeyError deep inside.",
      "waiting holds the number of different tasks still needed. The set makes a repeated dependency count once.",
      "users is the reverse map, so a finished task reaches only the tasks that wait for it.",
      "The queue holds tasks that are ready now. When a count reaches zero its last dependency has finished.",
      "If fewer tasks came out than exist, the rest are on or behind a loop. _find_cycle follows needs links from the first leftover until a name repeats, and that slice is the loop.",
      "run_all gets the order first, so a loop raises before anything has run. A task with a failed or skipped dependency is skipped and never called, so failure flows forward through everything behind it.",
      "Output on the example: order fetch, docs, lint, build, test; fetch ok in 3 calls, docs ok, lint ok, build failed in 3 calls, test skipped and blocked by build."
     ],
     "tests": "deps = {\"build\": [\"lint\", \"fetch\"], \"lint\": [\"fetch\"], \"fetch\": [], \"test\": [\"build\"], \"docs\": []}\norder = run_order(deps)\nassert order.index(\"fetch\") < order.index(\"lint\") < order.index(\"build\") < order.index(\"test\")\nprint(\"order:\", order)\nfor bad in ({\"a\": [\"b\"], \"b\": [\"c\"], \"c\": [\"a\"], \"d\": []}, {\"a\": [\"a\"]}, {\"x\": [\"a\"], \"a\": [\"b\"], \"b\": [\"a\"]}):\n    try:\n        run_order(bad)\n    except CycleError as e:\n        print(\"cycle:\", e)\ntry:\n    run_order({\"a\": [\"zz\"]})\nexcept KeyError as e:\n    print(\"unknown:\", e)\nassert run_order({\"a\": [], \"b\": [\"a\", \"a\"]}) == [\"a\", \"b\"]       # a repeated dependency is fine\n\ncalls = {\"fetch\": 0}\ndef flaky():\n    calls[\"fetch\"] += 1\n    if calls[\"fetch\"] < 3:\n        raise RuntimeError(\"timeout\")\ndef broken():\n    raise RuntimeError(\"disk full\")\nok = lambda: None\nfuncs = {\"fetch\": flaky, \"lint\": ok, \"build\": broken, \"test\": ok, \"docs\": ok}\nresults = run_all(deps, funcs, max_retries=2)\nfor t, r in results.items():\n    print(t, r)\nassert [results[t].status for t in (\"fetch\", \"lint\", \"build\", \"test\", \"docs\")] == [\"ok\", \"ok\", \"failed\", \"skipped\", \"ok\"]\nassert results[\"fetch\"].attempts == 3 and results[\"build\"].attempts == 3 and results[\"test\"].attempts == 0\nassert results[\"test\"].blocked_by == \"build\"\nprint(\"ok\")\n\nimport random\nrng = random.Random(5)\nfor trial in range(300):\n    n = rng.randint(1, 9)\n    names = [f\"t{i}\" for i in range(n)]\n    deps = {t: [d for d in names if rng.random() < 0.25] for t in names}\n    try:\n        order = run_order(deps)\n    except CycleError:\n        try:\n            order_slow(deps)\n        except CycleError:\n            continue\n        raise AssertionError(\"fast says cycle, slow does not\")\n    assert sorted(order) == sorted(names)\n    pos = {t: i for i, t in enumerate(order)}\n    assert all(pos[d] < pos[t] for t in deps for d in deps[t])      # every dependency comes first\n    assert sorted(order_slow(deps)) == sorted(order)\nprint(\"300 random graphs: order valid, cycles agree with the slow version\")\n",
     "followups": [
      {
       "q": "How do you run independent tasks at the same time?",
       "a": "Process the queue in waves. A wave is the set of tasks ready right now. Submit the whole wave to a thread pool, wait for it, lower the counts for what finished and form the next wave. The code for the waves is in the block below this list. The other way is to submit each task as soon as it is ready and lower the counts in a callback, with a lock around the counts. The wave version is easier to reason about; the callback version wastes less time when task lengths differ."
      },
      {
       "q": "What should the retry do between calls?",
       "a": "Wait with exponential backoff and a little random jitter, so many retrying tasks do not hit the same service at the same moment. Retry only errors that can pass on a second try, such as a timeout, and not ones that cannot, such as bad input. Both are a line or two, and neither is in the solution so that it stays readable."
      },
      {
       "q": "A task is retried but did half its work the first time. What then?",
       "a": "It needs to be idempotent: running it twice has the same effect as once. Examples are writing to a file named after the task, or sending an idempotency key with an API call. At work I have written idempotent migrations, so this is the first point I would raise in a real design review."
      },
      {
       "q": "How would you save state so a crash does not rerun finished tasks?",
       "a": "Write each task's status to disk or a database when it changes. On restart load the statuses, treat ok as done, and continue from the queue. That is the seed of a durable orchestrator, and it leads straight to the job-scheduler design on the system design side."
      },
      {
       "q": "The caller wants to rerun only the failed branch. How?",
       "a": "Keep failed and skipped as separate statuses, as here, and keep blocked_by. A rerun starts from the tasks that are failed or skipped and treats ok as already done."
      },
      {
       "q": "Why not a depth-first search?",
       "a": "A depth-first search with three colours (new, visiting, done) also finds loops and gives an order, and names the loop when it meets a visiting node. The cost is recursion depth on a long chain, and it does not give you the groups that could run together for free. Either is acceptable. Say why you picked one."
      },
      {
       "q": "How did you test it, with no test framework?",
       "a": "Plain asserts under the code. The five-task example, each of the errors, a flaky function that fails twice then works, and a random-graph check: for 300 random graphs every dependency comes before its task, and the fast order agrees with the slow one on whether there is a loop."
      }
     ],
     "d": "medium",
     "lc": "course-schedule-ii",
     "yt": [
      "Akt3glAwyfY",
      "NeetCode",
      18
     ]
    },
    {
     "t": "code",
     "id": "onsite-scheduler-waves",
     "title": "Follow-up: the groups that could run together (runs together with the solution above)",
     "code": "def waves(deps):\n    \"\"\"Groups of tasks that could run at the same time: each group needs only earlier groups.\"\"\"\n    _check_known(deps)\n    waiting, users = _count_open(deps)\n    wave, out, seen = [t for t in deps if waiting[t] == 0], [], 0\n    while wave:\n        out.append(wave)\n        seen += len(wave)\n        nxt = []\n        for t in wave:\n            for u in users[t]:\n                waiting[u] -= 1\n                if waiting[u] == 0:\n                    nxt.append(u)\n        wave = nxt\n    if seen < len(deps):\n        raise CycleError(\" -> \".join(_find_cycle(deps, waiting)))\n    return out\n\ndeps = {\"build\": [\"lint\", \"fetch\"], \"lint\": [\"fetch\"], \"fetch\": [], \"test\": [\"build\"], \"docs\": []}\nprint(waves(deps))\nassert waves(deps) == [[\"fetch\", \"docs\"], [\"lint\"], [\"build\"], [\"test\"]]\n"
    },
    {
     "t": "probs",
     "title": "Related, then harder",
     "items": [
      {
       "n": "Course Schedule",
       "d": "medium",
       "lc": "course-schedule",
       "yt": [
        "EgI5nU9etnU",
        "NeetCode",
        16
       ],
       "why": "Loop detection with a leftover count. This is part 1 as yes or no."
      },
      {
       "n": "Course Schedule II",
       "d": "medium",
       "lc": "course-schedule-ii",
       "yt": [
        "Akt3glAwyfY",
        "NeetCode",
        18
       ],
       "why": "Return the order, not only yes or no. Exactly what run_order returns."
      },
      {
       "n": "Parallel Courses III",
       "d": "hard",
       "lc": "parallel-courses-iii",
       "yt": [
        "a_NlRPnqCrg",
        "NeetCodeIO",
        12
       ],
       "why": "The harder follow-up: with unlimited workers, how long does the whole job take? The longest chain, found in the same pass. It is what 'run independent tasks together' turns into."
      }
     ]
    },
    {
     "t": "predict",
     "id": "onsite-scheduler-pred",
     "code": "deps = {\"a\": [], \"b\": [\"a\"], \"c\": [\"a\", \"b\", \"b\"]}\nwaiting = {t: len(set(ds)) for t, ds in deps.items()}\nprint(waiting)",
     "q": "What does this print? Why does the set matter?",
     "answer": "{'a': 0, 'b': 1, 'c': 2}",
     "why": "c lists b twice, but it waits for b once. The reverse map also adds c to b's list once because it loops over the set. If you counted the duplicate, c would wait for 3 and the count would never reach zero, so c would be reported as part of a loop."
    }
   ]
  },
  {
   "id": "onsite-review",
   "title": "3. What the reviewer asks",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** About 30 minutes where a person goes through your code. They ask about lines, not about theory: why this, what happens here, what would break. The answers below are short on purpose. You say them looking at your own code. Open each question, say your answer aloud, then compare. The first five rows are for the referral network, the next five for the scheduler, the rest for both."
    },
    {
     "t": "faq",
     "title": "Line by line, across both problems",
     "items": [
      {
       "q": "Referral: why is the check for a second referrer after the check for a duplicate?",
       "a": "The same referrer again is harmless. A different one is a conflict. To tell them apart, the equal case must come first."
      },
      {
       "q": "Referral: why does add return a string and not raise?",
       "a": "A bad row is normal in real data. Raising would stop a batch at the first one. A reason lets the loop carry on and report counts."
      },
      {
       "q": "Referral: what happens if the walk up in the loop check is very long?",
       "a": "It costs the depth for that event. On a chain of 100,000 the stream costs about n squared. Union-find makes it close to constant, and I can show it."
      },
      {
       "q": "Referral: why compute reach on demand instead of storing it?",
       "a": "A stored count is wrong after the next accepted event. Computing it keeps one source of truth. If queries dominate, I update the ancestors on every add."
      },
      {
       "q": "Referral: where does flow stop being correct?",
       "a": "When a user can have two referrers. The product of above and below assumes one chain between two users. Then I would count shortest paths with their multiplicities."
      },
      {
       "q": "Scheduler: what is the first thing that goes wrong if I remove the set in the count?",
       "a": "A task that lists a dependency twice waits for a count that never reaches zero, and is reported as part of a loop. The set makes it count once."
      },
      {
       "q": "Scheduler: why check for a loop before running anything?",
       "a": "Running half of a graph with a loop leaves a state nobody can describe. Failing first leaves the system untouched."
      },
      {
       "q": "Scheduler: why is a skipped task not called?",
       "a": "Its input is not there. Calling it would either fail again or do something on stale data. It is recorded with blocked_by so the report says why."
      },
      {
       "q": "Scheduler: what does a retry do to a task that was half done?",
       "a": "It repeats the half. The task has to be idempotent, or check what is done. This is the first point to raise in a real design."
      },
      {
       "q": "Scheduler: why catch Exception and not everything?",
       "a": "A KeyboardInterrupt or SystemExit must stop the run. They are not task failures."
      },
      {
       "q": "Both: which line are you least sure of?",
       "a": "Say a real one and what you did about it. For example: the loop message when a task is behind a loop, which I checked with a three-task case. Naming a doubt and a check is stronger than saying there is none."
      },
      {
       "q": "Both: what would you do with another hour?",
       "a": "Name two things in order: the speed check on a long chain, then the next feature. For the network, the faster loop check or a second referrer. For the scheduler, waves on a pool or saved state."
      },
      {
       "q": "Both: why did you name that function that way?",
       "a": "Say what it returns or does in plain words: reach returns a count, _closes_loop answers a yes or no, _attempt is one retry loop. If the name is wrong, say so and rename it. That is a good sign, not a bad one."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Three questions you will get in some form.** Write your own answer in each box before you open the model one."
    },
    {
     "t": "write",
     "id": "onsite-review-structure",
     "q": "Write your answer to 'Why this structure?' for the referral network. Then for the scheduler. Two or three sentences each.",
     "starter": "Referral network: \n\nTask scheduler: ",
     "hint": "Name what you look up most often, what it costs, and what you gave up. For each: the lookup, the cost, the alternative.",
     "solution": "Referral network: 'I look up in both directions all the time: who referred this user, and who did they refer. Two dicts make each one a single lookup, and I paid memory for the second. I used one class because it owns the rule that no loop forms, so no caller can break it. The alternative was an edge list, which is smaller but makes every query a scan.'\n\nTask scheduler: 'The thing I need most is, when a task finishes, which tasks were waiting for it. The reverse map answers that directly, so each finish costs the number of waiters, not all tasks. I used functions and one small result class, because the state does not outlive one call. The alternative was a scheduler class, which would have held state I never reuse.'",
     "why": "The pattern is the same twice: name the lookup you do most, name the cost you paid for it, name the alternative you did not take. The reviewer is checking that the structure came from the problem.",
     "say": "**For 'why this structure' I name the lookup I do most, what it costs, and what I did not choose.** In the network it is who referred me and who did I refer, so two dicts, and I paid memory. In the scheduler it is who is waiting for this task, so a reverse map. The alternative was simpler in both, an edge list or a scan, and slower in the same place."
    },
    {
     "t": "write",
     "id": "onsite-review-million",
     "q": "Write your answer to 'What breaks at a million events?' for each problem. Say what breaks first, the fix, and what you would measure.",
     "starter": "Referral network: \n\nTask scheduler: ",
     "hint": "Referral: the loop check on a long chain, then memory. Scheduler: the slow order if you wrote it, recursion if you used it, and the memory of one result per task.",
     "solution": "Referral network: 'First the loop check. It walks up the referrer chain, so on a long chain each event costs the depth and the stream costs about n squared. I would use union-find, which is close to constant per event. Second, memory: two dicts of strings. I would map names to integer ids and read the events from a stream. I would measure the time on a chain of a million before I changed anything.'\n\nTask scheduler: 'The counting order is linear, so a million tasks is fine in time. The slow rescan would not be, which is why I kept it only as a check. Memory is a few dicts and one result per task. The bigger problem is that one process cannot run that many tasks, so I would move to waves on a worker pool and save each status so a crash does not start over.'",
     "why": "The shape: name the first thing to break and why, the fix, and what you measure. 'It depends' with no number is the weak answer. The honest strong answer is the order of magnitude and a plan to measure.",
     "say": "**For 'what breaks at a million events' I name the first thing to break, the fix and what I would measure.** In the network, the loop check walks up the chain, so a long chain is quadratic, and union-find fixes it. Names should become integer ids. In the scheduler, the counting order is linear, so the real limit is running the tasks, which needs waves on a pool and saved statuses. In both, I measure before I change anything."
    },
    {
     "t": "write",
     "id": "onsite-review-test",
     "q": "Write your answer to 'How did you test it?' with no framework and no tests given. Name the checks, one case that would catch a real bug, and what you did not test.",
     "starter": "Checks: \nA bug it would catch: \nNot tested: ",
     "hint": "Plain asserts under the code. One per rule, one hand-worked example, one comparison of two implementations on random input.",
     "solution": "Checks: 'Plain asserts under the code, run after every change. A six-item example I worked out by hand first. One assert for every refusal or error. And a comparison of the fast code with the slow code, or with the definition counted by brute force, on a few hundred random inputs.'\n\nA bug it would catch: 'The check that flow equals its brute-force definition would catch the product formula being wrong, for example if I let a user have two referrers. The check that a refused add changes nothing would catch a half-written edge.'\n\nNot tested: 'Speed on a very long chain, and an odd exception in a task function. I would add both next.'",
     "why": "Reviewers ask this to see if you know what a test is for. The best answer has one example that would have caught a real mistake, and an honest list of what was left out.",
     "say": "**For 'how did you test it' I say plain asserts, a hand-worked example first, one check per rule, and a comparison of the fast version with the slow or brute-force one on random input.** The comparison is the one I trust most, because it catches a mistake in either side. I give one bug it would catch, and I say what I did not test, which is speed on a long chain and an odd exception."
    },
    {
     "t": "say",
     "lines": [
      "I think the review is the same conversation I have been having while I build: why this, what it costs, what I left out.",
      "When I am asked about a line, I read it aloud and say what it does on an empty input and on an unknown name.",
      "When I do not know, I say what I would check and how, and I do it, if there is time."
     ]
    }
   ]
  }
 ]
});
