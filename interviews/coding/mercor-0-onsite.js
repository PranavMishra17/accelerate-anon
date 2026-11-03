/* Mercor coding tab, part 0: the three onsite sessions: the coding round, the algorithms discussion, and the search build card. Rebuilt from candidate reports (AceOffer's synthesis of 20 reports, a Blind post from 26 Aug 2026); Mercor's prompts are not public. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-onsite-code",
 "n": 1,
 "title": "The coding round: referral network and task scheduler",
 "minutes": 130,
 "lead": "After this part you can work the coding round reported for Mercor's Applied AI onsite: solo, about 60 minutes, no AI, real data and no stubs, then a line-by-line review of your code. Reports describe two prompts, a referral network in three parts and a task scheduler in two, so you practise both. Each is taught first, then you write it in the box, then you check why it works. Mercor's own prompts are not public; these are rebuilt from candidate reports.",
 "sections": [
  {
   "id": "onsite-round",
   "title": "0. How the round runs",
   "blocks": [
    {
     "t": "p",
     "text": "**Say this up front, because it changes how you practise.** You work alone for about 60 minutes with your screen recorded. In the Applied AI version you may search for syntax, but you may not use an LLM in that hour, and no tests are given. You write real code on real data from an empty file: no stubbing a function to come back to it. Then about 30 minutes of review, where a person reads your code with you line by line and asks why. Sources: AceOffer's synthesis of 20 candidate reports (October 2025 to October 2026) and a Blind post from 26 August 2026. Both are paraphrased, so treat the details as likely, not certain."
    },
    {
     "t": "p",
     "text": "**What they grade.** That you ask before you code, that each part is solid enough for the next to sit on, that you write your own checks as you go, and that you can say what every line is for. A clean working part 2 with clear code beats a half-written part 3. Reports describe one of two prompts. You may get either, so do both."
    },
    {
     "t": "list",
     "items": [
      "Minutes 0 to 5: ask the questions in the part you got, and write the answers as comments at the top of the file.",
      "Minutes 5 to 20: part 1. The slow, obvious version first, then run it on a six-item example you worked out by hand.",
      "Minutes 20 to 35: part 2. Reuse part 1's structures. Do not rewrite them.",
      "Minutes 35 to 52: part 3, or the second half. State your choice in a comment before you write it.",
      "Minutes 52 to 60: stop adding. Read your own code the way the reviewer will, line by line, and fix what you cannot explain."
     ]
    },
    {
     "t": "faq",
     "title": "In the 30-minute review: what they ask",
     "items": [
      {
       "q": "Why this data structure and not another?",
       "a": "Name what you look up most often and what it costs. 'I needed both directions in one step, so I paid memory for a second dict' is a full answer."
      },
      {
       "q": "What does this line do on an empty input, or on an unknown name?",
       "a": "Walk it through out loud. If you wrote the rule down at the top of the file, point to it."
      },
      {
       "q": "What is the cost?",
       "a": "Time and space in n, then which part is the slow one and what you would change."
      },
      {
       "q": "How did you check it?",
       "a": "Name the asserts you wrote, the example you worked by hand, and one case that would have caught a real bug."
      },
      {
       "q": "What would you do with another hour?",
       "a": "Say what you left out on purpose and what you would build first. That is a scoping choice, not a miss."
      }
     ]
    },
    {
     "t": "say",
     "lines": [
      "I think I would tell them at the start what I am going to do: ask, write the slow version, check it on a small example, then tighten.",
      "Every few minutes I would say what I finished and what comes next, so the recording makes sense to a person who did not watch me think.",
      "If time runs short, I would hand over a clean earlier part and say what I would do next, not a rushed last part."
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
     "text": "**What it is.** Three parts that build on each other. Part 1 builds a network from referral events. Part 2 answers queries on it. Part 3 adds a 'flow centrality' score, and the prompt does not say what that means. That gap is deliberate: the round is checking whether you ask before you code. The original prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "faq",
     "title": "Ask these first (3 minutes, and write the answers as comments at the top of the file)",
     "items": [
      {
       "q": "Can a user be referred twice?",
       "a": "Assume no: one referrer per user and the first event wins. Say so out loud, because it makes the network a forest of trees and everything after is simpler."
      },
      {
       "q": "Can a referral point at itself, or close a loop?",
       "a": "Reject both and say how: the walk up from the referrer must not meet the new user."
      },
      {
       "q": "Are the events in time order, and can they repeat?",
       "a": "Assume order does not matter for the final network, and a repeated event is ignored."
      },
      {
       "q": "Does 'reach' mean direct referrals or everyone downstream?",
       "a": "Ask. Give both names: direct is one level, reach is every level below."
      },
      {
       "q": "What do I return for an unknown user?",
       "a": "Pick one answer and write it down. Here: None for who referred, an empty list for direct, 0 for reach."
      },
      {
       "q": "What does 'centrality' or 'flow' mean here?",
       "a": "Part 3 hides the definition on purpose. Do not guess. Use the three readings in the table below, ask which one, and if there is no answer, pick one and say why."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Plain approach.** Two dicts: user to referrer, and user to the list of people they referred. Part 1 is `add`, with the three rejections. Part 2 reads the dicts, and reach is a walk down the tree. Part 3 is a score from reach and depth. Write the slow, obvious version of each part first, run it on a six-person example, and only then tighten it."
    },
    {
     "t": "p",
     "text": "**How to clarify 'flow centrality'.** Three readings are plausible. Show each in one line on the same six-person example (a refers b and c; b refers d and e; d refers f; c refers g), ask which one the interviewer means, and if you get no answer, pick one and say why."
    },
    {
     "t": "table",
     "head": [
      "Reading",
      "What it counts",
      "On the example",
      "Pick it when"
     ],
     "rows": [
      [
       "A. Reach",
       "People downstream of you",
       "a 6, b 3, c 1, d 1, rest 0",
       "Rarely. Part 2 already computes it, so part 3 would add nothing."
      ],
      [
       "B. Chains through you",
       "(people upstream of you) times (people downstream of you): referral chains that pass through you",
       "b 3, d 2, c 1, rest 0",
       "A referral network with one referrer each. Roots and leaves score 0 because no chain passes through them."
      ],
      [
       "C. Betweenness",
       "Shortest paths between every pair of people that pass through you, either direction",
       "a 8, b 11, c 5, d 5, rest 0",
       "Someone says the network is a general graph, or that influence runs both ways."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The trap.** The prompt looks like it wants a famous algorithm: betweenness, PageRank, max flow. With no definition, any code you write is a guess, and the reviewer sees a candidate who did not ask. The quieter trap is that your definition may lean on part 1. B equals upstream times downstream only because each user has one referrer. If a user could have two, the product is wrong and you would need C. Say that dependency out loud when you choose."
    },
    {
     "t": "say",
     "lines": [
      "I think I would spend the first three minutes on questions, because part 3 is meant to be vague.",
      "I would write down that each user has one referrer and the first event wins, then check a six-person example by hand before I write the class.",
      "For part 3 I would say there are three reasonable scores, show a one-line example of each, and build chains-through-you, because reach is already part 2 and betweenness needs a different graph.",
      "If time runs short, I would rather hand over a clean part 2 and say what I would do next than a rushed part 3."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-referral-p",
     "title": "Referral network",
     "source": "Mercor-style referral round, rebuilt (three parts)",
     "minutes": 60,
     "why": "Part 1 is data modelling, part 2 is two tree walks, part 3 is the question 'what does the interviewer actually mean'. The round grades that third thing.",
     "statement": "Part 1. You get a list of referral events, each a pair (referrer, user) meaning that the referrer brought in that user. Build a network from them. Reject a self-referral, a second referrer for the same user, and any event that would close a loop.\n\nPart 2. Answer three queries on the network: who referred a user, who a user referred directly, and the reach of a user, meaning everyone downstream of them at any depth.\n\nPart 3. Add a centrality score per user. The prompt does not say what centrality means. Ask, name the readings you see, and implement one cleanly.",
     "examples": [
      {
       "input": "events: a>b, a>c, b>d, b>e, d>f, c>g",
       "output": "reach(a) = 6, reach(b) = 3, reach(e) = 0",
       "note": "Reach counts every level below, not only direct referrals."
      },
      {
       "input": "then: x>b",
       "output": "rejected",
       "note": "b already has a referrer, a. The first event wins."
      },
      {
       "input": "then: f>a",
       "output": "rejected",
       "note": "a > b > d > f is already a chain, so f>a would close a loop."
      }
     ],
     "constraints": [
      "standard library only",
      "up to about 100,000 users",
      "no AI and no internet",
      "write your own checks"
     ],
     "starter": "class ReferralNetwork:\n    ...",
     "hints": [
      "Level 1: keep two dicts, user to referrer and user to the list of people they referred. One person has at most one referrer.",
      "Level 2: to reject a loop, walk up from the referrer through the referrer dict. If you meet the new user, refuse the edge.",
      "Level 3: for every user's reach at once, list the users parents-first with a queue, then walk that list backwards and add each user's reach plus one to their parent. Flow is (depth) times (reach)."
     ],
     "solution": "from collections import deque\n\n\nclass ReferralNetwork:\n    def __init__(self):\n        self.referrer = {}   # user -> the one person who referred them\n        self.referred = {}   # user -> list of users they referred, in order\n        self.users = set()   # everyone seen, including users nobody referred\n\n    # Part 1: build from events\n    def add(self, referrer, user):\n        \"\"\"Record 'referrer referred user'. Return True if it was accepted.\"\"\"\n        if referrer == user:\n            return False                   # nobody refers themselves\n        if user in self.referrer:\n            return False                   # already referred: the first event wins\n        cur = referrer                     # walk up from the referrer: if we meet\n        while cur is not None:             # `user`, this edge would close a loop\n            if cur == user:\n                return False\n            cur = self.referrer.get(cur)\n        self.referrer[user] = referrer\n        self.referred.setdefault(referrer, []).append(user)\n        self.users.update((referrer, user))\n        return True\n\n    # Part 2: queries\n    def who_referred(self, user):\n        return self.referrer.get(user)     # None for a root or an unknown user\n\n    def direct(self, user):\n        return list(self.referred.get(user, []))\n\n    def reach(self, user):\n        \"\"\"Slow first version: walk the whole subtree under `user`. O(subtree) per call.\"\"\"\n        seen, queue = 0, deque(self.direct(user))\n        while queue:\n            u = queue.popleft()\n            seen += 1\n            queue.extend(self.referred.get(u, []))\n        return seen\n\n    def all_reach(self):\n        \"\"\"Faster for many queries: every user's reach in one O(n) pass.\"\"\"\n        order = []                         # parents always come before their children\n        queue = deque(u for u in self.users if u not in self.referrer)\n        while queue:\n            u = queue.popleft()\n            order.append(u)\n            queue.extend(self.referred.get(u, []))\n        reach = {u: 0 for u in self.users}\n        for u in reversed(order):          # children are finished before their parent\n            p = self.referrer.get(u)\n            if p is not None:\n                reach[p] += reach[u] + 1   # parent gains the child and the child's reach\n        return reach\n\n    # Part 3: a score (definition B below: chains that pass through the user)\n    def flow(self):\n        \"\"\"flow(u) = (people upstream of u) * (people downstream of u).\"\"\"\n        reach = self.all_reach()\n        depth = {}                         # number of people upstream of each user\n        queue = deque(u for u in self.users if u not in self.referrer)\n        for u in queue:\n            depth[u] = 0\n        while queue:\n            u = queue.popleft()\n            for c in self.referred.get(u, []):\n                depth[c] = depth[u] + 1\n                queue.append(c)\n        return {u: depth[u] * reach[u] for u in self.users}\n",
     "complexity": "add is O(depth of the referrer) because of the loop check, O(1) amortised when the network is shallow. who_referred and direct are O(1) and O(children). reach(u) is O(size of the subtree under u) per call, so a loop over all users is O(n * subtree size), up to O(n^2) on a chain. all_reach and flow do one pass over everyone: O(n) time and O(n) space.",
     "explain": [
      "Two dicts store the same edges from both sides. The cost is memory, the gain is that both 'who referred me' and 'who did I refer' are one lookup.",
      "add checks three things in order: self-referral, a second referrer, a loop. Each check returns False without changing anything, so a rejected event never leaves half an edge.",
      "The loop check walks up from the referrer. If the walk reaches the new user, the new edge would make the user their own ancestor.",
      "reach is the slow first version: a queue walk over the whole subtree, once per call. It is fine for one query.",
      "all_reach is the faster one for many queries. Build a parents-first order, then go through it backwards: by the time you reach a user, all their children have already added themselves, so adding reach + 1 to the parent is final.",
      "flow multiplies the number of people upstream (the depth) by the number downstream (the reach). Both come from one pass each. A root has depth 0 and a leaf has reach 0, so both score 0.",
      "Output on the example: reach is a=6, b=3, c=1, d=1, e=f=g=0; flow is b=3, d=2, c=1, everything else 0."
     ],
     "tests": "net = ReferralNetwork()\nevents = [(\"a\", \"b\"), (\"a\", \"c\"), (\"b\", \"d\"), (\"b\", \"e\"), (\"d\", \"f\"), (\"c\", \"g\")]\nfor r, u in events:\n    assert net.add(r, u)\nassert not net.add(\"x\", \"b\")          # b already has a referrer\nassert not net.add(\"f\", \"a\")          # would close the loop a > b > d > f > a\nassert not net.add(\"z\", \"z\")\nassert net.who_referred(\"f\") == \"d\" and net.who_referred(\"a\") is None\nassert net.direct(\"b\") == [\"d\", \"e\"]\nassert net.reach(\"a\") == 6 and net.reach(\"b\") == 3 and net.reach(\"e\") == 0\nr = net.all_reach()\nassert r == {u: net.reach(u) for u in net.users}\nprint(\"reach:\", dict(sorted(r.items())))\nprint(\"flow: \", dict(sorted(net.flow().items())))\nprint(\"ok\")\n",
     "followups": [
      {
       "q": "Line by line: why check `user in self.referrer` before the loop walk?",
       "a": "It is cheaper and it answers the common case first. If the user already has a referrer, the loop walk is not needed, and a user with a referrer can never be a root of a new loop. Order the checks from cheapest to most expensive."
      },
      {
       "q": "Why does add use `setdefault(referrer, []).append(user)` and not `self.referred[referrer].append(user)`?",
       "a": "A referrer seen for the first time has no list yet. setdefault creates it and returns it in one step. Without it you would need an if, or a defaultdict. Either is fine; say which you chose and why."
      },
      {
       "q": "Why a separate `users` set? The two dicts already hold every user.",
       "a": "A user nobody referred and who referred nobody is in neither dict. A root with referrals shows up only as a key in `referred`. The set gives one place to loop over everyone, including roots. If an interviewer finds a user missing, this is usually the bug."
      },
      {
       "q": "reach on a chain of 100,000 users is slow if I call it for every user. What do you do?",
       "a": "That is why all_reach exists. One pass in reverse order gives every user's reach in O(n). If queries arrive one at a time with new events in between, keep the counts up to date on each add instead: walk up from the referrer and add one to every ancestor. That makes add O(depth) and reach O(1)."
      },
      {
       "q": "Why a queue walk and not recursion?",
       "a": "A chain of 100,000 users would pass Python's recursion limit of about 1,000. A queue (or an explicit stack) uses the heap and has no such limit. Say that you know the recursive version is shorter and why you did not use it."
      },
      {
       "q": "What changes if a user can have two referrers?",
       "a": "Then it is a graph, not a forest. The loop check becomes a search up all parents, reach must count each user once (use a visited set), and the product formula for flow is no longer right. Use betweenness: for each pair, the share of shortest chains that pass through the user. Say that this is a different and more expensive problem, and ask before you build it."
      },
      {
       "q": "How did you test it, with no test framework?",
       "a": "Plain asserts under the class, run on every change: the six-person example, each of the three rejections, and a check that the fast all_reach equals the slow reach for every user. The last one compares two implementations of the same thing, which catches mistakes in either."
      }
     ],
     "d": "medium"
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
       "n": "Sum of Distances in Tree",
       "d": "hard",
       "lc": "sum-of-distances-in-tree",
       "yt": [
        "OCGPug-KirQ",
        "Timothy H Chang",
        13
       ],
       "why": "The harder follow-up: a score per node from counts below and above it. Reading C, closeness style, on a tree in O(n)."
      }
     ]
    },
    {
     "t": "predict",
     "id": "onsite-referral-pred",
     "code": "parent = {\"b\": \"a\", \"c\": \"b\"}\ncur, chain = \"c\", []\nwhile cur is not None:\n    chain.append(cur)\n    cur = parent.get(cur)\nprint(chain)\nprint(\"a\" in chain)",
     "q": "This is the loop check for the event 'c referred a'. What does it print, and is the event accepted?",
     "answer": "['c', 'b', 'a']\nTrue",
     "why": "Walking up from c gives c, b, a. The new user a is in the chain, so adding c>a would make a its own ancestor. The event is rejected."
    }
   ]
  },
  {
   "id": "onsite-scheduler",
   "title": "2. Task scheduler",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A two-part coding prompt in the same solo hour. Part 1 runs tasks that depend on each other, in order, and refuses a cycle. Part 2 adds failures and retries. The graph idea is topological order, which you may know as Course Schedule. The new part is deciding what a failure means for everything behind it. The original prompt is not public, so the shape is right and the numbers are mine."
    },
    {
     "t": "p",
     "text": "**What they grade.** That part 1 is correct on a cycle and on an unknown dependency, and that part 2 is a set of explicit rules you could state before coding: what is retried, how many times, what happens to the tasks that wait on a failed task, and what the caller sees at the end."
    },
    {
     "t": "faq",
     "title": "Ask these first",
     "items": [
      {
       "q": "What is a task: a name and a function, or only a name?",
       "a": "Assume a name with a list of dependency names, and a function to run it. Say you will separate the order from the running, so you can test the order alone."
      },
      {
       "q": "Does it run one task at a time or in parallel?",
       "a": "Assume one at a time for the first version. Say that Kahn's algorithm already gives the groups that could run together: all tasks that are ready at the same time."
      },
      {
       "q": "What should happen on a cycle?",
       "a": "Raise before running anything and name the tasks involved. Running half of a graph with a cycle is worse than running nothing."
      },
      {
       "q": "On a failure, do independent tasks still run?",
       "a": "Assume yes: only tasks behind the failed one are skipped. Failing fast and stopping everything is the other reading; ask."
      },
      {
       "q": "How many retries, and is there a wait between them?",
       "a": "A cap, say 2 retries. Say a delay with backoff and jitter is what you would add in production, and leave it out here."
      },
      {
       "q": "What does the caller get back?",
       "a": "A status for every task, so nothing is silently missing: ok, failed or skipped, and the attempts used."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Plain approach.** For each task count how many dependencies are still open. Start with the tasks that have zero. Each time a task finishes, lower the count of every task that waited for it; when a count reaches zero, that task is ready. If the queue empties before all tasks have run, what is left sits on a cycle or behind one. Part 2 wraps the run of each task in a loop of at most 1 + max_retries attempts. A task that fails every attempt is marked failed, and any task with a failed or skipped dependency is skipped without running."
    },
    {
     "t": "say",
     "lines": [
      "I think I would split this into the order and the running, so I can test the order without running anything.",
      "For the order I would count open dependencies per task and start from zero, and I would treat anything left over as a cycle and name it.",
      "For failures I would write the rules down first: retry up to a cap, then mark failed, then skip everything behind it, and keep running whatever does not depend on it.",
      "I would return a status for every task, so nothing is silently missing from the result."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-scheduler-p",
     "title": "Task scheduler",
     "source": "Mercor-style scheduler round, rebuilt (two parts)",
     "minutes": 40,
     "why": "Dependency order is a standard graph problem. The value is in part 2: stating the failure rules clearly, which is the same thinking as a real job orchestrator.",
     "statement": "Part 1. You have tasks, each with a name and a list of the tasks it needs to finish first. Return an order in which all of them can run. If the tasks depend on each other in a loop, raise an error that names the tasks involved. If a task needs one that does not exist, raise an error too.\n\nPart 2. Each task also has a function. Run them in dependency order. If a task raises, retry it up to a cap. If it still fails, mark it failed and skip every task that depends on it, directly or not. Tasks that do not depend on it still run. Return the status of every task and how many attempts it took.",
     "examples": [
      {
       "input": "build needs lint and fetch; lint needs fetch; test needs build; docs needs nothing",
       "output": "fetch, docs, lint, build, test",
       "note": "Any order with fetch before lint before build before test is valid."
      },
      {
       "input": "a needs b, b needs c, c needs a, d needs nothing",
       "output": "error: cycle among a, b, c",
       "note": "d is fine, but nothing runs because a cycle was found first."
      },
      {
       "input": "fetch fails twice then works; build always fails; max_retries = 2",
       "output": "fetch ok (3 attempts), build failed (3), test skipped",
       "note": "Docs and lint do not depend on build and still run."
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
      "Level 1: a task can run when every task it needs is done. Count how many are still open for each task.",
      "Level 2: also build the reverse map, task to the tasks that wait for it. When a task finishes, lower each waiting task's count, and queue it when it reaches zero.",
      "Level 3: after the queue is empty, if fewer tasks ran than exist, the rest are on or behind a cycle. For retries, loop over 1 + max_retries attempts with try/except and stop at the first success."
     ],
     "solution": "from collections import deque\n\n\ndef order_slow(deps):\n    \"\"\"First version: keep scanning for tasks whose dependencies are all done. O(n^2).\"\"\"\n    done, order = set(), []\n    while len(order) < len(deps):\n        ready = [t for t in deps if t not in done and all(d in done for d in deps[t])]\n        if not ready:\n            raise ValueError(\"cycle among: \" + \", \".join(sorted(t for t in deps if t not in done)))\n        for t in ready:\n            done.add(t)\n            order.append(t)\n    return order\n\n\ndef run_order(deps):\n    \"\"\"Kahn's algorithm. deps maps task -> list of tasks it needs first. O(tasks + edges).\"\"\"\n    for t, ds in deps.items():\n        for d in ds:\n            if d not in deps:\n                raise KeyError(f\"{t} needs unknown task {d}\")\n    waiting = {t: len(set(ds)) for t, ds in deps.items()}   # how many dependencies are still open\n    users = {t: [] for t in deps}                           # task -> tasks that wait for it\n    for t, ds in deps.items():\n        for d in set(ds):\n            users[d].append(t)\n    ready = deque(t for t, n in waiting.items() if n == 0)\n    order = []\n    while ready:\n        t = ready.popleft()\n        order.append(t)\n        for u in users[t]:\n            waiting[u] -= 1\n            if waiting[u] == 0:                             # its last dependency is done\n                ready.append(u)\n    if len(order) < len(deps):                              # tasks left over: they sit on or behind a cycle\n        raise ValueError(\"cycle among: \" + \", \".join(sorted(t for t in deps if waiting[t] > 0)))\n    return order\n\n\ndef run_all(deps, funcs, max_retries=2):\n    \"\"\"Run in dependency order. A task that fails every attempt marks everything behind it 'skipped'.\"\"\"\n    status = {}                                             # task -> 'ok' | 'failed' | 'skipped'\n    attempts = {}\n    for t in run_order(deps):\n        if any(status[d] != \"ok\" for d in deps[t]):         # a dependency failed or was skipped\n            status[t] = \"skipped\"\n            continue\n        for attempt in range(1 + max_retries):              # first try plus the retries\n            attempts[t] = attempt + 1\n            try:\n                funcs[t]()\n                status[t] = \"ok\"\n                break\n            except Exception:\n                status[t] = \"failed\"                        # stays 'failed' if the last attempt also fails\n    return status, attempts\n",
     "complexity": "order_slow rescans every task each round: O(n^2) in the worst case, a chain. run_order visits each task and each dependency once: O(tasks + dependencies) time and space. run_all adds the work of the functions, at most (1 + max_retries) calls per task.",
     "explain": [
      "order_slow is the first version: loop until nothing is left, each round take every task whose dependencies are all done. It is correct, and it re-checks the same tasks again and again.",
      "run_order first checks that every dependency exists. A typo should fail with a clear message, not with a KeyError somewhere deep.",
      "waiting holds the number of open dependencies. `set(ds)` counts a repeated dependency once, so a task that lists 'a' twice does not wait forever.",
      "users is the reverse map. It lets a finished task reach only the tasks that wait for it, instead of scanning all tasks.",
      "The queue holds tasks that are ready now. When a count reaches zero its last dependency has finished, so the task goes on the queue.",
      "If fewer tasks came out than exist, the rest are stuck. The message lists tasks that still wait, which are the cycle itself and anything behind it. For an exact cycle, follow dependencies from one stuck task until a name repeats.",
      "run_all uses the order and checks dependencies' status before running. A dependency that is failed or skipped makes this task skipped, so failure flows forward through the whole subgraph.",
      "Output on the example: order fetch, docs, lint, build, test; statuses fetch ok, docs ok, lint ok, build failed, test skipped; attempts fetch 3, docs 1, lint 1, build 3."
     ],
     "tests": "deps = {\"build\": [\"lint\", \"fetch\"], \"lint\": [\"fetch\"], \"fetch\": [], \"test\": [\"build\"], \"docs\": []}\norder = run_order(deps)\nassert order.index(\"fetch\") < order.index(\"lint\") < order.index(\"build\") < order.index(\"test\")\nassert sorted(order_slow(deps)) == sorted(order)\nprint(\"order:\", order)\nfor bad in ({\"a\": [\"b\"], \"b\": [\"c\"], \"c\": [\"a\"], \"d\": []}, {\"a\": [\"a\"]}):\n    try:\n        run_order(bad)\n    except ValueError as e:\n        print(\"cycle:\", e)\ntry:\n    run_order({\"a\": [\"zz\"]})\nexcept KeyError as e:\n    print(\"unknown:\", e)\n\ntries = {\"n\": 0}\ndef flaky():\n    tries[\"n\"] += 1\n    if tries[\"n\"] < 3:\n        raise RuntimeError(\"try again\")\ndef always_fails():\n    raise RuntimeError(\"down\")\nok = lambda: None\nfuncs = {\"fetch\": flaky, \"lint\": ok, \"build\": always_fails, \"test\": ok, \"docs\": ok}\nstatus, attempts = run_all(deps, funcs, max_retries=2)\nassert status == {\"fetch\": \"ok\", \"lint\": \"ok\", \"build\": \"failed\", \"test\": \"skipped\", \"docs\": \"ok\"}\nassert attempts == {\"fetch\": 3, \"lint\": 1, \"build\": 3, \"docs\": 1}\nprint(\"status:\", status)\nprint(\"attempts:\", attempts)\n",
     "followups": [
      {
       "q": "Line by line: why is `status[t] = \"failed\"` set inside the except and not after the loop?",
       "a": "So the final status is whatever the last attempt left. If the last attempt succeeds, the next line sets 'ok' and breaks. If every attempt fails, the status stays 'failed' without any extra code. The alternative, a flag after the loop, works too, but this has one fewer variable."
      },
      {
       "q": "Why not recurse with a depth-first search?",
       "a": "A DFS with three colours (new, visiting, done) also finds cycles and gives an order, and it names the exact cycle when it meets a 'visiting' node. The cost is recursion depth on a long chain, and it does not give you the ready groups that Kahn's algorithm gives for free. Either is acceptable. Say why you picked one."
      },
      {
       "q": "How do you run independent tasks at the same time?",
       "a": "Process the queue in waves. Each wave is the set of tasks that are ready right now. Submit the whole wave to a thread pool, wait for it, then lower the counts for what finished and form the next wave. Or submit each task as soon as it is ready and lower counts in the callback, with a lock around the counts. The wave version is simpler to reason about; the callback version wastes less time when task lengths differ."
      },
      {
       "q": "What should the retry do between attempts?",
       "a": "Wait with exponential backoff and a little random jitter, so many retrying tasks do not hit the same service at the same moment. Only retry errors that can pass on a second try (a timeout, a 503), not ones that cannot (bad input). Both are one line each; neither is in the solution to keep it readable."
      },
      {
       "q": "A task is retried but it already did half its work. What then?",
       "a": "Then it needs to be idempotent: running it twice has the same effect as once, or it checks what is already done. Give an example, such as writing to a file name based on the task and attempt, or using an idempotency key on an API call. This is the first thing to say in a real design review."
      },
      {
       "q": "How would you save the state so a crash does not rerun finished tasks?",
       "a": "Write each task's status to disk or a database after it changes. On restart, load the statuses, treat 'ok' as done, and continue from the queue. That is the seed of a durable orchestrator, and it leads straight to the job-scheduler design on the system design side."
      },
      {
       "q": "What if a task is skipped and the caller wants to retry only the failed branch?",
       "a": "Keep failed and skipped as separate statuses, as here. A rerun starts from the tasks that are failed or skipped and treats ok as already done. That is why skipped is not the same as failed."
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
       "why": "Cycle detection with a leftover count. This is the whole of part 1, as yes or no."
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
     "why": "c lists b twice, but it waits for b once. The reverse map also adds c to b's list once because it loops over the set. If you counted the duplicate, c would wait for 3 and the count would never reach zero, so c would be reported as part of a cycle."
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "id": "mercor-onsite-algo",
 "n": 2,
 "title": "The algorithms discussion: comparator, exchange rates, friend network",
 "minutes": 100,
 "lead": "After this part you can talk through the three questions reported for the algorithms round: a faulty or slow comparator, exchange rates across currency pairs, and a search through a friend network with a limited API. It is a conversation of 30 to 45 minutes and no code is expected. Each topic gives you the talk track as numbered beats to say aloud, then a code sketch shut behind the solution toggle for after you have tried. The original prompts are not public, so these are rebuilt from candidate reports.",
 "sections": [
  {
   "id": "onsite-talk",
   "title": "0. How the discussion runs",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A conversation, 30 to 45 minutes, with a whiteboard or a shared document. Candidate reports say the sorting question with a faulty comparator is the one asked most (four reports). Exchange rates and a friend-network search come up in other reports. You are graded on how you reason aloud, not on typed code: say what you would count, what you would try first, and where it breaks."
    },
    {
     "t": "p",
     "text": "**The shape of every answer here.** Each topic below has numbered beats. They all follow the same five moves, so you can run the shape even on a question you have not seen."
    },
    {
     "t": "list",
     "items": [
      "1. State the contract: say what goes in, what comes out, what a call costs, and ask what can fail.",
      "2. Name the slow, obvious answer and its cost: in calls, in time, in memory. Count before you optimise.",
      "3. Improve it in one move, and say what you give up for it.",
      "4. Change the goal and see what breaks: now each call is slow, now the answers are unreliable, now there are a million queries.",
      "5. Close on the tradeoff in one sentence and say which goal you would ask the interviewer to pick."
     ]
    },
    {
     "t": "p",
     "text": "**How to use the sketches.** Say the beats aloud first, with no code in front of you. Then open the solution under the problem to check your numbers and see the shape in a few lines. If you can reproduce the sketch from memory, you can talk about it with confidence."
    }
   ]
  },
  {
   "id": "onsite-comparator",
   "title": "1. A faulty or slow comparator",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** You get a function `compare(a, b)` that you cannot see inside, and you must sort or pick the best k. Three questions arrive in order: use as few calls as you can, then what if each call is slow, then what if the answers are unreliable. The most reported question of the round."
    },
    {
     "t": "p",
     "text": "**What they grade.** Whether you count before you optimise, whether you know the standard bounds, and whether you notice that 'fewest calls' and 'least waiting time' are different goals that sometimes pull against each other."
    },
    {
     "t": "faq",
     "title": "Ask these first",
     "items": [
      {
       "q": "What does compare return, and can it fail?",
       "a": "Say the contract: negative if a ranks first, positive if b does, zero for a tie. Then ask whether it can raise, time out or disagree with itself."
      },
      {
       "q": "Is the best k the smallest or the largest, and do I return them in order?",
       "a": "Pick one, state it, and note that sorted output costs about k log k more calls on top of finding them."
      },
      {
       "q": "What is k compared with n?",
       "a": "If k is close to n, sort everything. If k is small, a partial method wins. The answer decides the algorithm."
      },
      {
       "q": "Is the cost per call the same for every pair, and can I call it in parallel?",
       "a": "A rate limit or a per-key lock changes everything in the slow-call question. Ask early."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Talk track, in order.**"
    },
    {
     "t": "list",
     "items": [
      "1. The contract: compare(a, b) is negative when a ranks first. I would ask whether it can raise, disagree with itself, or take a long time.",
      "2. Count first: I would wrap it in a counter. Sorting n items needs about n log2 n - 1.44 n calls at best. Finding only the best one needs exactly n - 1.",
      "3. Pick by k: if k is close to n, sort. If k is small, a heap of size k costs about n calls on random input, and a tournament costs n - 1 plus about log2 n for each extra winner.",
      "4. If each call is slow: the number of calls stops being the cost and the number of rounds takes over. All n/2 matches of a bracket round are independent, so a bracket needs about log2 n rounds. If the service takes a batch, send each round as one batch.",
      "5. If the answers are unreliable: remember one answer per pair, treat the reverse call as free, ask an odd number of times and take the majority, and cap the retries on errors.",
      "6. If the answers contradict each other in a loop: no algorithm can fix a cycle, only find it. Sample triples, or sort twice with the input shuffled and compare. Then break the tie with a score per item instead of pairwise calls.",
      "7. Close: fewest calls, least waiting and most trust pull in different directions. I would ask which one matters here."
     ]
    },
    {
     "t": "table",
     "head": [
      "Method",
      "Calls to find the best k of n",
      "Wall-clock if calls are slow and independent"
     ],
     "rows": [
      [
       "Library sort or merge sort, then take k",
       "about n log2 n - n, all n sorted",
       "Merges are sequential inside a level, so about the number of calls on the longest chain"
      ],
      [
       "Min-heap of size k",
       "about n for random input, up to n log2 k in the worst order",
       "Each step depends on the one before. Hard to parallelise."
      ],
      [
       "Tournament (bracket)",
       "n - 1 for the first best, then about log2 n per extra winner: n - 1 + (k - 1) * ceil(log2 n)",
       "A round of the bracket is n/2, n/4, ... independent calls, so about log2 n rounds for the first winner"
      ],
      [
       "Quickselect style partition",
       "about 2n to 3n on average, and any pivot round is n - 1 independent calls",
       "A few rounds of one slow call each, because the n - 1 comparisons with the pivot can all run at once"
      ]
     ]
    },
    {
     "t": "say",
     "lines": [
      "I think the first thing I would do is wrap the comparator in a counter, because I would rather measure than argue about n log n.",
      "For a small k I would pick a tournament, since it reuses every earlier result and replays only one path per winner. For a big k I would sort everything.",
      "Before any of that I would ask whether the comparator is consistent, because if it is not, every algorithm is only as good as the wrapper I put around it.",
      "When calls are slow I would stop counting calls and start counting rounds, and run each round's independent calls together."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-comparator-p",
     "title": "Top-k with a slow or faulty comparator",
     "source": "Mercor-style algorithms discussion, rebuilt (talk first, the code is a sketch for after)",
     "minutes": 45,
     "why": "Counting comparisons, then handling a comparator that lies, then hiding latency. All three are things an applied AI engineer does with a model used as a judge. Say the answer aloud first; open the solution to check it.",
     "statement": "You are given a list of items and a function compare(a, b) that returns a negative number if a ranks before b, a positive number if after, and zero for a tie. Return the best k items in order, using as few calls to compare as you can.\n\nThen: the function sometimes gives wrong or inconsistent answers, and sometimes raises. Make the result trustworthy.\n\nThen: each call takes a long time (think of a model call). Reduce the total time, not the number of calls.",
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
       "note": "No 3 consecutive calls contain two wrong ones, so the majority is right."
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
      "Level 3: for the unreliable comparator keep a dict of answers per pair and reuse it for the reversed pair. For slow calls, one pivot round compares everything to the pivot at once with a thread pool."
     ],
     "solution": "import heapq\nimport random\nimport time\nfrom concurrent.futures import ThreadPoolExecutor\n\n\nclass Counted:\n    \"\"\"Wraps a comparator: cmp(a, b) < 0 means a ranks before b. Counts every call.\"\"\"\n    def __init__(self, cmp):\n        self.cmp, self.calls = cmp, 0\n\n    def __call__(self, a, b):\n        self.calls += 1\n        return self.cmp(a, b)\n\n\ndef merge_sort(items, cmp):\n    if len(items) <= 1:\n        return list(items)\n    mid = len(items) // 2\n    left, right = merge_sort(items[:mid], cmp), merge_sort(items[mid:], cmp)\n    out, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if cmp(right[j], left[i]) < 0:     # strict, so equal items keep their order\n            out.append(right[j]); j += 1\n        else:\n            out.append(left[i]); i += 1\n    return out + left[i:] + right[j:]\n\n\nclass Item:                                 # heapq needs __lt__, so route it to cmp\n    def __init__(self, v, cmp):\n        self.v, self.cmp = v, cmp\n\n    def __lt__(self, other):\n        return self.cmp(self.v, other.v) < 0\n\n\ndef heap_top_k(items, k, cmp):\n    \"\"\"Best k (those that rank first). A min-heap of size k holds the best so far.\"\"\"\n    heap = []                               # root = the worst of the k kept\n    for v in items:\n        # the heap wants the WORST at the root, so invert the comparison\n        wrapped = Item(v, lambda a, b: cmp(b, a))\n        if len(heap) < k:\n            heapq.heappush(heap, wrapped)\n        elif cmp(v, heap[0].v) < 0:         # v beats the worst kept: swap it in\n            heapq.heapreplace(heap, wrapped)\n    return merge_sort([x.v for x in heap], cmp)\n\n\ndef tournament_top_k(items, k, cmp):\n    \"\"\"Build a bracket once (n-1 calls). Each next winner replays one path (about log n calls).\"\"\"\n    n = len(items)\n    size = 1\n    while size < n:\n        size *= 2\n    tree = [None] * (2 * size)              # tree[size + i] = leaf i holds an index, or None\n    for i in range(n):\n        tree[size + i] = i\n\n    def play(a, b):                         # the index that ranks first; None is a bye\n        if a is None or b is None:\n            return b if a is None else a\n        return a if cmp(items[a], items[b]) <= 0 else b\n\n    for node in range(size - 1, 0, -1):\n        tree[node] = play(tree[2 * node], tree[2 * node + 1])\n    out = []\n    for _ in range(min(k, n)):\n        w = tree[1]\n        out.append(items[w])\n        node = size + w\n        tree[node] = None                   # remove the winner, replay only its path\n        node //= 2\n        while node >= 1:\n            tree[node] = play(tree[2 * node], tree[2 * node + 1])\n            node //= 2\n    return out\n\n\ndef make_safe(cmp, votes=3, retries=2):\n    \"\"\"Wrap a flaky comparator: cache one answer per pair, vote on noise, retry on errors.\"\"\"\n    cache = {}\n\n    def safe(a, b):\n        if a == b:\n            return 0\n        key = (a, b)\n        if key in cache:\n            return cache[key]\n        if (b, a) in cache:\n            return -cache[(b, a)]           # the reverse call is free and always consistent\n        score = 0\n        for _ in range(votes):              # odd number of votes, so there is no tie\n            for attempt in range(retries + 1):\n                try:\n                    r = cmp(a, b)\n                    break\n                except Exception:\n                    if attempt == retries:\n                        raise\n            score += 1 if r > 0 else -1 if r < 0 else 0\n        cache[key] = 1 if score > 0 else -1 if score < 0 else 0\n        return cache[key]\n    return safe\n\n\ndef parallel_top_k(items, k, cmp, workers=8):\n    \"\"\"Each round compares everything to one pivot at the same time, so a round costs one slow call.\"\"\"\n    rng = random.Random(0)\n    best, rest, rounds = [], list(range(len(items))), 0   # work with positions, so equal values stay distinct\n    with ThreadPoolExecutor(max_workers=workers) as pool:\n        while len(best) < k and rest:\n            p = rest[rng.randrange(len(rest))]\n            others = [i for i in rest if i != p]\n            verdicts = list(pool.map(lambda i: cmp(items[i], items[p]), others))  # one parallel round\n            rounds += 1\n            ahead = [i for i, v in zip(others, verdicts) if v < 0]\n            behind = [i for i, v in zip(others, verdicts) if v >= 0]\n            if len(ahead) >= k - len(best):\n                rest = ahead                # the rest of the top-k is all inside `ahead`\n            else:\n                best += ahead + [p]         # all of these make it; look for the rest behind\n                rest = behind\n    return merge_sort([items[i] for i in best], cmp), rounds\n\n\ndef find_intransitive(items, cmp, tries=200, seed=0):\n    \"\"\"Sample triples and look for x > y > z > x. A cycle cannot be repaired, only found.\"\"\"\n    rng = random.Random(seed)\n    for _ in range(tries):\n        a, b, c = rng.sample(items, 3)\n        for x, y, z in ((a, b, c), (a, c, b)):\n            if cmp(x, y) < 0 and cmp(y, z) < 0 and cmp(z, x) < 0:\n                return x, y, z\n    return None\n\n\ndef batched_best(items, cmp_batch):\n    \"\"\"A bracket in rounds. Each round is ONE batched call holding all of that round's matches.\"\"\"\n    alive, rounds = list(range(len(items))), 0\n    while len(alive) > 1:\n        pairs = [(alive[i], alive[i + 1]) for i in range(0, len(alive) - 1, 2)]\n        verdicts = cmp_batch([(items[a], items[b]) for a, b in pairs])\n        winners = [a if v <= 0 else b for (a, b), v in zip(pairs, verdicts)]\n        if len(alive) % 2:\n            winners.append(alive[-1])          # the odd one out gets a bye\n        alive, rounds = winners, rounds + 1\n    return items[alive[0]], rounds\n",
     "complexity": "merge sort about n log2 n calls. Heap of size k: worst case about n log2 k calls, usually near n for random input. Tournament: n - 1 + (k - 1) * ceil(log2 n) calls, O(n) space. make_safe multiplies calls by the number of votes but each pair is asked at most once. parallel_top_k: about 2n calls on average in about log n rounds, so time is rounds times one call when there are enough workers.",
     "explain": [
      "Counted is a thin wrapper. It is also how you would measure calls to a paid model: count first, then decide.",
      "merge_sort is the baseline. Its merge uses a strict test (`< 0`) so equal items keep their input order. That is stability, and the interviewer may ask.",
      "heap_top_k keeps the best k seen so far. heapq pops the smallest, so the comparison is inverted and the root is the worst of the kept items. A new item enters only if it beats that root.",
      "tournament_top_k builds a bracket once: n - 1 calls. When a winner leaves, only the matches on its path to the root change, about log2 n calls. That is why it wins when k is small.",
      "make_safe fixes the comparator before any algorithm touches it: one stored answer per pair, the reverse pair answered from the same entry, a vote on noise and a retry cap on errors. Inconsistent answers cannot reach the sort.",
      "parallel_top_k trades extra calls for fewer rounds. Each round compares everything with one pivot at the same time. The top k is then either inside the 'ahead' group or partly in it.",
      "find_intransitive samples triples and looks for x ahead of y, y ahead of z, z ahead of x. A cycle cannot be repaired, only found. On rock, paper, scissors it finds one at once; on plain numbers it finds none.",
      "batched_best is the bracket in rounds. Each round sends all of its matches in one batched call, so 1000 items take 10 rounds and 999 comparisons in total, with 500 in the first round.",
      "The measured output: merge sort 8715, heap 1081, tournament 1044 calls on 1000 numbers and k = 5."
     ],
     "tests": "rng = random.Random(1)\ndata = rng.sample(range(10000), 1000)\nby_value = lambda a, b: a - b\nwant = sorted(data)[:5]\n\nc = Counted(by_value); assert merge_sort(data, c) == sorted(data); print(\"merge sort all 1000:\", c.calls)\nc = Counted(by_value); assert heap_top_k(data, 5, c) == want; print(\"heap top 5:        \", c.calls)\nc = Counted(by_value); assert tournament_top_k(data, 5, c) == want; print(\"tournament top 5:  \", c.calls)\n\ncalls = {\"n\": 0}\ndef noisy(a, b):                            # every 4th call is wrong\n    calls[\"n\"] += 1\n    return -(a - b) if calls[\"n\"] % 4 == 0 else a - b\nsafe = make_safe(noisy, votes=3)\nassert merge_sort(list(range(20, 0, -1)), safe) == list(range(1, 21))\nprint(\"noisy comparator fixed by votes\")\nflaky_state = {\"n\": 0}\ndef sometimes_errors(a, b):\n    flaky_state[\"n\"] += 1\n    if flaky_state[\"n\"] % 3 == 0:\n        raise TimeoutError(\"slow upstream\")\n    return a - b\ns2 = make_safe(sometimes_errors, votes=1, retries=2)\nassert merge_sort([5, 3, 9, 1], s2) == [1, 3, 5, 9]\nprint(\"flaky comparator survived\")\n\ndef slow(a, b):\n    time.sleep(0.02)\n    return a - b\nitems = rng.sample(range(1000), 64)\nt = time.perf_counter(); seq = heap_top_k(items, 3, slow); t_seq = time.perf_counter() - t\nt = time.perf_counter(); par, rounds = parallel_top_k(items, 3, slow, workers=64); t_par = time.perf_counter() - t\nassert seq == par == sorted(items)[:3]\nprint(\"sequential heap about %.1f s, parallel about %.1f s in %d rounds\" % (t_seq, t_par, rounds))\n\nbeats = {(\"rock\", \"scissors\"), (\"scissors\", \"paper\"), (\"paper\", \"rock\")}\nrps = lambda a, b: -1 if (a, b) in beats else 1 if (b, a) in beats else 0\nprint(\"cycle in rock/paper/scissors:\", find_intransitive([\"rock\", \"paper\", \"scissors\"], rps))\nassert find_intransitive(list(range(30)), by_value) is None\nprint(\"no cycle in a plain number order\")\n\nbatches = []\ndef cmp_batch(pairs):\n    batches.append(len(pairs))\n    return [a - b for a, b in pairs]\nbest, rounds = batched_best(rng.sample(range(10000), 1000), cmp_batch)\nassert rounds == 10 and sum(batches) == 999\nprint(\"bracket of 1000: %d rounds, %d comparisons in total, first round holds %d\" % (rounds, sum(batches), batches[0]))\n",
     "followups": [
      {
       "q": "Which method do you pick for k = 5 and n = 1,000,000 if calls cost money?",
       "a": "The tournament: about n + 5 * 20 calls, which is close to the lower bound of n - 1 for the first and a few log n for each next. A heap of size 5 is close behind and is simpler to write, so if time in the interview is short, say you would start with the heap and move to the tournament only if call count is the stated goal."
      },
      {
       "q": "The comparator is not transitive: a beats b, b beats c, c beats a. What happens?",
       "a": "Merge sort and the heap still terminate, but the order is undefined and may change with the input order. A tournament still picks a winner, but not a meaningful best. Say that no algorithm can fix a cycle, only detect it: check a few triples, count how often the ranking changes with a shuffle, and report it. In practice you break cycles by adding a tiebreak, such as a score per item, and compare scores instead."
      },
      {
       "q": "Line by line: why cache the answer for (a, b) and return the negative of it for (b, a)?",
       "a": "Because a noisy comparator can say a < b and then b < a. One stored answer per pair gives a consistent order, and it also halves the calls. The cost is memory proportional to the pairs you compared, which is about the number of calls."
      },
      {
       "q": "Why an odd number of votes?",
       "a": "No ties. With an even number of votes you need a rule for 2 against 2. Three votes fixes isolated errors; if the error rate is high, more votes help only when the errors are independent. If the same item is always misjudged, voting does nothing, and you need a different judge."
      },
      {
       "q": "Would you run all the comparisons in a merge sort in parallel?",
       "a": "Not inside one merge: each step depends on the one before, so it is sequential. The two halves are independent, so you can run them at once, but only log n levels of that. A tournament round or a pivot round has n/2 or n - 1 independent calls and is much better suited."
      },
      {
       "q": "Parallel uses more calls than sequential. When is that wrong?",
       "a": "When calls cost money or you are rate limited. Then the goal is calls, not time, and the tournament with a small pool is the answer. Ask which one the interviewer means: 'fastest' and 'cheapest' point in different directions here."
      },
      {
       "q": "What if the API accepts a batch of pairs?",
       "a": "Then batching beats threads: one network round trip for many pairs, no thread overhead, and often a lower price per item. Send one pivot round, or one level of the bracket, as one batch. Add a cap on batch size and a retry for the whole batch."
      },
      {
       "q": "How would you use this with a model as the comparator?",
       "a": "Same shape: the model is a slow, noisy, sometimes inconsistent comparator. Cache by pair, ask both orders and treat disagreement as a tie, vote when it matters, and count tokens as the call cost. Scoring each item once (n calls) and sorting by score is often better than pairwise, because it is consistent by construction."
      }
     ],
     "d": "medium",
     "lc": "kth-largest-element-in-an-array",
     "yt": [
      "XEmy13g1Qxc",
      "NeetCode",
      19
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
    },
    {
     "t": "predict",
     "id": "onsite-comparator-pred",
     "code": "from functools import cmp_to_key\n\ncalls = [0]\n\ndef cmp(a, b):\n    calls[0] += 1\n    return a - b\n\nsorted([1, 2, 3, 4, 5], key=cmp_to_key(cmp))\nprint(calls[0])\ncalls[0] = 0\nsorted([5, 4, 3, 2, 1], key=cmp_to_key(cmp))\nprint(calls[0])\ncalls[0] = 0\nsorted([3, 1, 4, 1, 5, 9, 2, 6], key=cmp_to_key(cmp))\nprint(calls[0])",
     "q": "How many calls does Python's sort make in each case? (CPython 3.12.)",
     "answer": "4\n4\n15",
     "why": "Timsort looks for runs. Already in order, or strictly descending, is one run, found with n - 1 = 4 comparisons and no more. The eight shuffled numbers need 15, between n - 1 = 7 and n log2 n = 24. So 'fewest calls' depends on the input: say that out loud, and do not quote n log n as if it were the only number."
    }
   ]
  },
  {
   "id": "onsite-exchange",
   "title": "2. Exchange rates",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A list of quotes between currency pairs and the question 'how much of B do I get for one A'. It is a graph with a weight on each edge. Part 1 multiplies along a path. Part 2 asks for the best path, which brings in logarithms and Bellman-Ford, and then the idea of arbitrage."
    },
    {
     "t": "p",
     "text": "**What they grade.** That you see it as a graph at once, that you ask whether the reverse quote is the inverse or a separate quote with a spread, and that you can say why a negative log turns a product into a sum, and what a negative cycle means."
    },
    {
     "t": "faq",
     "title": "Ask these first",
     "items": [
      {
       "q": "Is the reverse rate always one over the quoted rate?",
       "a": "If yes, any path gives the same answer and a plain search is enough. If real quotes have a spread (buy and sell differ), the reverse is a separate quote and the best path really matters. Ask which."
      },
      {
       "q": "Can the quotes disagree with each other?",
       "a": "If they can, a loop of trades may end with more than you started with. That is arbitrage, and 'best rate' then has no answer. Say what you do: detect it and report it."
      },
      {
       "q": "What do I return if there is no connection, or an unknown currency?",
       "a": "None, and say it. Do not return 0, because 0 is a valid-looking rate."
      },
      {
       "q": "How many currencies and how many queries?",
       "a": "A few hundred currencies and a million queries mean precompute all pairs; a few queries mean search each time."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Talk track, in order.**"
    },
    {
     "t": "list",
     "items": [
      "1. A graph: currencies are nodes, each quote is an edge with a rate. I would ask first whether the reverse quote is one over the rate.",
      "2. One conversion: a search from the source that carries the product so far, with a set of currencies already seen. It finds the fewest hops, not the best rate, and I would say that.",
      "3. The best rate, slow version: try every simple path and keep the largest product. It is exponential, which is why I want something better.",
      "4. The log trick: the log of a product is the sum of the logs. Largest product becomes smallest sum of -log(rate). A rate above 1 gives a negative edge, so Dijkstra does not apply and Bellman-Ford does. A best path has at most V - 1 edges, so V - 1 rounds are enough.",
      "5. Arbitrage: one more round that still improves something means a loop that multiplies to more than 1. Then there is no best rate, so I report the loop and not a number.",
      "6. Scale: for a million queries over a few hundred currencies, Floyd-Warshall on the -log rates precomputes all pairs in O(V^3). For quotes that change by the second, rebuild on a schedule with a version number.",
      "7. Close: a percentage fee folds into the rate. A fixed fee or a minimum depends on the amount, so it is no longer a plain shortest path, and I would ask for the real rule."
     ]
    },
    {
     "t": "say",
     "lines": [
      "I think this is a graph: currencies are nodes and each quote is an edge with a rate.",
      "I would ask first whether the reverse quote is one over the rate, because that decides whether the best path matters at all.",
      "For one conversion I would search and multiply along the way. For the best rate I would take the negative log of each rate, so the product becomes a sum and I can use Bellman-Ford, since some of those edges are negative.",
      "And I would say out loud that a negative cycle is an arbitrage: a loop that makes money, where the best rate does not exist."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-exchange-p",
     "title": "Exchange rates across currency pairs",
     "source": "Mercor-style algorithms discussion, rebuilt (talk first, the code is a sketch for after)",
     "minutes": 30,
     "why": "A graph with weighted edges, a product turned into a sum with logs, and the idea of a negative cycle. All short and all things they ask to hear. Say it aloud first; open the solution to check it.",
     "statement": "You are given quotes (from, to, rate), where one unit of `from` buys `rate` units of `to`. Part 1. Write convert(src, dst) that returns how many units of dst one unit of src buys by following quotes, or None if there is no chain.\n\nPart 2. Return the best rate you can get for src to dst over any chain of quotes. If a loop of quotes lets you end with more than you started with, say so.",
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
     "solution": "import math\nfrom collections import deque\n\n\ndef build(quotes):\n    \"\"\"quotes: (from, to, rate) meaning 1 `from` buys `rate` of `to`. Adds the inverse edge too.\"\"\"\n    g = {}\n    for a, b, rate in quotes:\n        if rate <= 0:\n            raise ValueError(\"rate must be positive\")\n        g.setdefault(a, {})[b] = rate\n        g.setdefault(b, {}).setdefault(a, 1 / rate)   # an explicit reverse quote is kept, not overwritten\n    return g\n\n\ndef convert(g, src, dst):\n    \"\"\"Part 1: any chain of quotes from src to dst (the fewest hops). None if there is none.\"\"\"\n    if src not in g or dst not in g:\n        return None\n    seen = {src}\n    queue = deque([(src, 1.0)])                       # (currency, product of rates so far)\n    while queue:\n        cur, value = queue.popleft()\n        if cur == dst:\n            return value\n        for nxt, rate in g[cur].items():\n            if nxt not in seen:\n                seen.add(nxt)\n                queue.append((nxt, value * rate))\n    return None\n\n\ndef best_path_slow(g, src, dst, seen=None, value=1.0):\n    \"\"\"First version: try every simple path and keep the largest product. Exponential.\"\"\"\n    seen = (seen or set()) | {src}\n    if src == dst:\n        return value\n    best = None\n    for nxt, rate in g[src].items():\n        if nxt not in seen:\n            got = best_path_slow(g, nxt, dst, seen, value * rate)\n            if got is not None and (best is None or got > best):\n                best = got\n    return best\n\n\ndef best_rate(g, src, dst):\n    \"\"\"Part 2: the largest product. Bellman-Ford on -log(rate). Returns (rate, arbitrage).\"\"\"\n    dist = {c: math.inf for c in g}                   # shortest -log distance = best rate\n    dist[src] = 0.0\n    edges = [(a, b, -math.log(r)) for a, nbrs in g.items() for b, r in nbrs.items()]\n    for _ in range(len(g) - 1):                       # a best path has at most V-1 edges\n        changed = False\n        for a, b, w in edges:\n            if dist[a] + w < dist[b] - 1e-12:         # tolerance, so float noise is not a gain\n                dist[b] = dist[a] + w\n                changed = True\n        if not changed:\n            break\n    for a, b, w in edges:                             # one more pass: any gain left means a loop\n        if dist[a] + w < dist[b] - 1e-9:              # that multiplies to more than 1\n            return None, True\n    return (None if dist[dst] == math.inf else math.exp(-dist[dst])), False\n",
     "complexity": "convert: O(V + E) time and O(V) space per query. best_path_slow: exponential in the number of currencies, only for checking. best_rate: O(V * E) time for Bellman-Ford, O(V + E) space. For many queries between all pairs, Floyd-Warshall gives all answers in O(V^3).",
     "explain": [
      "build stores a dict of dicts. If the reverse quote is not given, it adds 1 / rate. If it is given, it keeps it, because a real reverse quote has a spread and must not be overwritten.",
      "convert is a breadth-first search that carries the product. It finds the chain with the fewest hops, not the best rate. Say that distinction out loud.",
      "best_path_slow tries every simple path. It is the honest first version and it is how you check the fast one on small inputs.",
      "best_rate uses -log(rate) as the weight, so a product of rates becomes a sum. A rate above 1 gives a negative weight, which is why Dijkstra is not allowed.",
      "Bellman-Ford relaxes every edge V - 1 times. A best path never needs more than V - 1 edges, so that many rounds are enough. It stops early when a round changes nothing.",
      "One more pass finds a negative cycle: if any edge still improves, a loop reduces the total, which means a loop multiplies to more than 1. The small tolerance stops float rounding from looking like a gain.",
      "exp(-distance) turns the sum back into a rate. On the example: fewest hops 144.4, best 145.35; with GBP>USD at 1.40 arbitrage is reported."
     ],
     "tests": "quotes = [(\"USD\", \"EUR\", 0.90), (\"EUR\", \"USD\", 1.10), (\"EUR\", \"GBP\", 0.85), (\"GBP\", \"EUR\", 1.15),\n          (\"USD\", \"GBP\", 0.76), (\"GBP\", \"USD\", 1.28), (\"GBP\", \"JPY\", 190.0), (\"CHF\", \"CAD\", 1.5)]\ng = build(quotes)\nprint(\"fewest hops USD>JPY:\", round(convert(g, \"USD\", \"JPY\"), 2))\nprint(\"USD>CAD:            \", convert(g, \"USD\", \"CAD\"))\nprint(\"JPY>GBP (inverse):  \", round(convert(g, \"JPY\", \"GBP\"), 5))\nrate, arb = best_rate(g, \"USD\", \"JPY\")\nprint(\"best USD>JPY:       \", round(rate, 2), arb)\nassert abs(rate - best_path_slow(g, \"USD\", \"JPY\")) < 1e-9\nassert convert(g, \"USD\", \"USD\") == 1.0 and best_rate(g, \"USD\", \"CAD\") == (None, False)\nbad = build([q if q[:2] != (\"GBP\", \"USD\") else (\"GBP\", \"USD\", 1.40) for q in quotes])\nprint(\"GBP>USD quoted 1.40:\", best_rate(bad, \"USD\", \"JPY\"))\n",
     "followups": [
      {
       "q": "Why a logarithm, and not multiply the rates directly in Bellman-Ford?",
       "a": "You can: relax with `best[b] = max(best[b], best[a] * rate)`. That also works and avoids the log. The log version is the textbook one because it reduces the problem to 'shortest path', which has known algorithms and a known meaning for a negative cycle. It also avoids a product of many numbers under 1 shrinking toward zero, though floats handle a few hundred hops."
      },
      {
       "q": "Why can't I use Dijkstra?",
       "a": "Dijkstra assumes that adding an edge never makes a path cheaper. A rate above 1 gives a negative weight in log space, so a longer path can be better, and Dijkstra's first-found answer for a node can be wrong. If every rate were at most 1 (every trade loses money), all weights would be non-negative and Dijkstra would work."
      },
      {
       "q": "What is the arbitrage check doing, exactly?",
       "a": "After V - 1 rounds every shortest distance is final if there is no negative cycle. A further round that still improves an edge proves a cycle whose weights sum below zero, which in rates is a product above 1. The result is then not a rate but a flag, because you could loop forever and improve."
      },
      {
       "q": "You have a million queries. What do you change?",
       "a": "Precompute. With a few hundred currencies, Floyd-Warshall over -log rates is O(V^3), about 10^7 to 10^8 steps once, and then every query is a table lookup. Rebuild it when quotes change, or for quotes that change every second keep a version number and rebuild on a schedule."
      },
      {
       "q": "Line by line: why `dist[a] + w < dist[b] - 1e-12`?",
       "a": "Floats. Two different routes to the same currency can differ by a tiny rounding error, and without a tolerance the loop would call that an improvement and keep going, and the cycle check would report arbitrage on clean data. The tolerance is small and written down in one place."
      },
      {
       "q": "What if quotes are given with fees or a minimum amount?",
       "a": "A fee that is a percentage is a smaller rate: fold it in. A fixed fee or a minimum breaks the multiplication, because the result now depends on how much you convert. Then the edge weight depends on the amount, and the problem is no longer a plain shortest path. Say that, and ask for the real constraint."
      }
     ],
     "d": "medium",
     "lc": "evaluate-division",
     "yt": [
      "Uei1fwDoyKk",
      "NeetCodeIO",
      18
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
    },
    {
     "t": "predict",
     "id": "onsite-exchange-pred",
     "code": "import math\n\nw = -math.log(0.9) - math.log(0.85)\nprint(round(w, 4), round(math.exp(-w), 3))",
     "q": "This is the log trick for the chain USD to EUR to GBP. What does it print?",
     "answer": "0.2679 0.765",
     "why": "The two edge weights add to 0.2679. Taking exp of the negative gives back the product 0.9 * 0.85 = 0.765. A sum of logs is a log of a product, so shortest sum means largest product."
    }
   ]
  },
  {
   "id": "onsite-friend",
   "title": "3. Friend network, few API calls",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** You can see a social network only through an API, and each call costs something. The question is some form of 'how are these two people connected' or 'who is within three hops', with as few calls as possible. Reported by a candidate in a September 2026 onsite. The exact wording is not public, so I fixed one version below. Ask which one you were given."
    },
    {
     "t": "p",
     "text": "**What they grade.** That you treat the call as the cost, not the CPU. That you keep a set of people already asked about. That you know when to stop. And that you can name the next step: grow from both ends, cache, batch."
    },
    {
     "t": "faq",
     "title": "Ask these first",
     "items": [
      {
       "q": "What does one call return, and what does it cost?",
       "a": "One user's friend list, or a page of it? Ask about the page size, a rate limit, and whether there is a batch call."
      },
      {
       "q": "Do friendships go both ways?",
       "a": "If yes, you can grow a search from both ends. If not, the far end cannot be searched backwards."
      },
      {
       "q": "What is the question: connected or not, the number of hops, or the path itself?",
       "a": "Each answer stops at a different point. 'Connected' can stop at the first sighting."
      },
      {
       "q": "Is there a limit on how far to look?",
       "a": "A cap of 3 or 4 hops saves most of the calls, because the network grows by the friend count at each hop."
      },
      {
       "q": "Will I be asked many questions on the same network?",
       "a": "Then a cache across queries is the first win."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Talk track, in order.**"
    },
    {
     "t": "list",
     "items": [
      "1. The contract: friends(u) is one call. I want the hops between a and b with as few calls as possible, so the call count is my cost. I would ask about the page size, the rate limit and whether a batch call exists.",
      "2. The baseline: breadth-first search with a set of users already asked about. Each user is asked about once. The calls grow like (friends per user) to the power of the distance.",
      "3. Stop early: check for b the moment it shows up in a friend list, not when it comes off the queue. That saves the whole last level, which is the biggest one.",
      "4. Grow from both ends: a ball around a and a ball around b, always the smaller. Two balls of half the radius hold far fewer people than one big ball. On my test graph this went from 1,806 calls to 81.",
      "5. Remember: keep every answer in a cache, so a second question over the same people costs nothing. Bound the search with a maximum number of hops.",
      "6. Batch: send a whole level in one call. Rounds equal hops, which is what matters when each call is slow. The server still does the same lookups, so ask whether it charges by call or by lookup.",
      "7. Real life: a rate limit needs a token bucket and retries with a cap. A celebrity returns a page, not a list. A private profile returns nothing, and that is an answer, not an error. Close on the goal: fewest calls, least waiting, or least load on their server."
     ]
    },
    {
     "t": "say",
     "lines": [
      "I think the call is the cost here, so I would count calls the way I count model calls.",
      "I would start with breadth-first search and a set of people already asked about, then stop the moment I see the target, and say how much that saves.",
      "Then I would grow from both ends and always expand the smaller side, and I would say why two small balls beat one big one.",
      "If calls are slow I would batch a whole level, and I would ask whether the server charges by call or by lookup."
     ]
    },
    {
     "t": "problem",
     "id": "onsite-friend-p",
     "title": "Friend network through a limited API",
     "source": "Mercor-style algorithms discussion, rebuilt (talk first, the code is a sketch for after)",
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
     "solution": "from collections import deque\n\n\nclass Api:\n    \"\"\"A pretend network. friends(u) is one call; friends_many(users) is one call for many users.\"\"\"\n    def __init__(self, graph):\n        self.graph, self.calls, self.lookups = graph, 0, 0\n\n    def friends(self, u):\n        self.calls += 1\n        self.lookups += 1\n        return self.graph.get(u, [])\n\n    def friends_many(self, users):\n        self.calls += 1                    # one round trip\n        self.lookups += len(users)         # but the server still did this much work\n        return {u: self.graph.get(u, []) for u in users}\n\n\ndef bfs_naive(api, a, b):\n    \"\"\"First version: checks for b only when a user is taken off the queue.\"\"\"\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        if u == b:\n            return d\n        for v in api.friends(u):\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\ndef bfs(api, a, b, max_hops=None):\n    \"\"\"Checks for b the moment it is seen, so it never expands the last level. Stops at max_hops.\"\"\"\n    if a == b:\n        return 0\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        if max_hops is not None and d >= max_hops:\n            return None                    # everything further away is beyond the limit\n        for v in api.friends(u):\n            if v == b:\n                return d + 1               # stop here: no more calls\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\ndef cached(api):\n    \"\"\"Remember every answer: a second query over the same people costs nothing.\"\"\"\n    memo = {}\n\n    class C:\n        def friends(self, u):\n            if u not in memo:\n                memo[u] = api.friends(u)\n            return memo[u]\n    return C()\n\n\ndef bidirectional(api, a, b):\n    \"\"\"Grow a ball around each end, always the smaller one. They meet after about half the hops.\"\"\"\n    if a == b:\n        return 0\n    dist = ({a: 0}, {b: 0})\n    frontier = ([a], [b])\n    while frontier[0] and frontier[1]:\n        s = 0 if len(frontier[0]) <= len(frontier[1]) else 1   # expand the smaller side\n        mine, other = dist[s], dist[1 - s]\n        nxt, best = [], None\n        for u in frontier[s]:\n            for v in api.friends(u):\n                if v in other:             # the two balls touch\n                    total = mine[u] + 1 + other[v]\n                    best = total if best is None else min(best, total)\n                elif v not in mine:\n                    mine[v] = mine[u] + 1\n                    nxt.append(v)\n        if best is not None:               # a full level is done, so the minimum is exact\n            return best\n        frontier = (nxt, frontier[1]) if s == 0 else (frontier[0], nxt)\n    return None\n\n\ndef batched_bfs(api, a, b):\n    \"\"\"One call per level, not per user. Rounds = hops, which is what matters when each call is slow.\"\"\"\n    if a == b:\n        return 0\n    seen, level, hops = {a}, [a], 0\n    while level:\n        hops += 1\n        found = api.friends_many(level)    # the whole level in one round trip\n        nxt = []\n        for u in level:\n            for v in found[u]:\n                if v == b:\n                    return hops\n                if v not in seen:\n                    seen.add(v)\n                    nxt.append(v)\n        level = nxt\n    return None\n",
     "complexity": "bfs_naive asks about every user within distance d of a: about (friends per user)^d calls. bfs with an early exit saves the whole last level. bidirectional asks about about two balls of radius d/2, so roughly 2 * (friends per user)^(d/2) calls. batched_bfs makes one call per level: d calls, but the same number of lookups on the server as bfs.",
     "explain": [
      "Api is a counter in front of the graph. You cannot improve a number you have not measured, and it is how you would count paid model calls.",
      "bfs_naive is the first version. It checks for b only when a user comes off the queue, so on the last level it asks about everyone before it notices b was already seen.",
      "bfs checks for b the moment it appears in a friend list. It never expands the last level. max_hops stops the search when the answer would be too far to matter.",
      "cached remembers every friends() answer. A second query over the same people costs nothing, and it is the first thing to add when queries repeat.",
      "bidirectional keeps two sets of distances and two frontiers. It expands the smaller frontier a full level at a time. When a friend is already in the other ball, a path exists. After a full level the smallest total is exact.",
      "batched_bfs sends a whole level in one friends_many call. Rounds equal hops, which is what matters when every call is slow. The server still does the same lookups, so ask whether it charges by call or by lookup.",
      "Measured on the test graph: 10,949 calls for naive, 1,806 with an early exit, 81 bidirectional, 4.4 batched rounds."
     ],
     "tests": "import random\n\nrng = random.Random(7)\nn, deg = 20000, 6                          # about 12 friends each, friendships go both ways\ngraph = {u: [] for u in range(n)}\nfor u in range(n):\n    for _ in range(deg):\n        v = rng.randrange(n)\n        if v != u and v not in graph[u]:\n            graph[u].append(v)\n            graph[v].append(u)\n\n\ndef truth(a, b):                           # ground truth, straight from the dict, no api\n    seen, queue = {a}, deque([(a, 0)])\n    while queue:\n        u, d = queue.popleft()\n        if u == b:\n            return d\n        for v in graph[u]:\n            if v not in seen:\n                seen.add(v)\n                queue.append((v, d + 1))\n    return None\n\n\npairs = [(rng.randrange(n), rng.randrange(n)) for _ in range(40)]\ntotal = {\"naive\": 0, \"early exit\": 0, \"bidirectional\": 0, \"batched (rounds)\": 0}\nfor a, b in pairs:\n    want = truth(a, b)\n    for name, fn in ((\"naive\", bfs_naive), (\"early exit\", bfs), (\"bidirectional\", bidirectional), (\"batched (rounds)\", batched_bfs)):\n        api = Api(graph)\n        assert fn(api, a, b) == want, (name, a, b)\n        total[name] += api.calls\nfor name, calls in total.items():\n    print(\"%-17s %7.1f calls per query\" % (name, calls / len(pairs)))\n\napi = Api(graph)\nc = cached(api)\nbfs(c, 0, 5000); first = api.calls\nbfs(c, 0, 5000)\nassert api.calls == first                  # the repeat was free\nprint(\"repeat query after caching: 0 new calls (first query used %d)\" % first)\nassert bfs(Api(graph), 0, 5000, max_hops=1) in (None, 1)\nprint(\"ok\")\n",
     "followups": [
      {
       "q": "Why is checking for b on discovery better than when popped?",
       "a": "When you pop users from the queue you have already paid for every user ahead of them on that level. Checking on discovery stops at the first sighting. In the test it cut about 10,900 calls to about 1,800."
      },
      {
       "q": "Why expand the smaller frontier in the bidirectional search?",
       "a": "Each level multiplies the size of a frontier by the average friend count. Growing the smaller side keeps the two balls about equal in size and keeps the total number of calls low, even when one end is a celebrity with a huge friend list and the other is not."
      },
      {
       "q": "What if a user has a million friends?",
       "a": "One call may be a page, not the whole list. Ask for the page size, take pages lazily, and prefer to expand the end with fewer friends. A path through a celebrity is usually not the one you want to pay for."
      },
      {
       "q": "The API is rate limited. What do you change?",
       "a": "Add a token bucket in front of the call, and retry on a rate-limit error with a cap and backoff. Then calls are the scarce thing again, so bidirectional search and caching matter more than batching."
      },
      {
       "q": "What if the answer only needs to be 'within 3 hops'?",
       "a": "Pass max_hops=3 and stop. With 12 friends each, hop 4 would cost about twenty thousand calls, and you never needed them."
      },
      {
       "q": "How do you know it is correct?",
       "a": "Compare every fast version with the plain one on random pairs of a random graph, as the test does. Two implementations of the same answer catch mistakes in either."
      },
      {
       "q": "What if the graph changes while you search?",
       "a": "Then a cached answer can be stale. Put a time limit on cache entries, or return the answer with the time it was true. Say which one the product needs."
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
  }
 ]
});
window.LOOP_CODING.parts.push({
 "id": "mercor-onsite-build",
 "n": 3,
 "one": true,
 "title": "The search build: what to pin down",
 "minutes": 20,
 "lead": "After this card you know what to pin down in the first minutes of the candidate-search build, and which lines to say. There is no code to practise here: the prompt is not public. Reports describe about 90 minutes: 75 minutes building with LLMs allowed against an evaluation endpoint, where you improve a score and submit, then 15 minutes on how you used the LLMs, the design and the debugging. To rehearse the loop, do session wc38 (../index.html#/w/wc38). For the design behind it, read the guide's candidate-search case study (../SYSTEM%20DESIGN.html#/designs/candidate-search/requirements).",
 "sections": [
  {
   "id": "build-card",
   "title": "Candidate search build",
   "blocks": [
    {
     "t": "p",
     "text": "**What they ask (as reported):** Given a job description, rank candidate profiles and call an evaluation endpoint to see how good your ranking is. You iterate on the score and submit. The prompt is paraphrased in the reports, so every answer below is a likely one. Ask the question, then say the answer you are assuming."
    },
    {
     "t": "table",
     "head": [
      "Bucket",
      "Ask",
      "Likely answer"
     ],
     "rows": [
      [
       "Primary capabilities",
       "What goes in: a job description as free text, as fields, or both?",
       "Free text, maybe with a few structured fields"
      ],
      [
       "Primary capabilities",
       "What comes out: how many results, and in what shape?",
       "A ranked list of candidate ids, top N, with a score each"
      ],
      [
       "Primary capabilities",
       "Which tools may I use: LLMs, embeddings, search libraries?",
       "LLMs are allowed in this build; ask whether query-time calls are allowed and counted"
      ],
      [
       "Error handling",
       "What do profiles look like: missing fields, duplicates, conflicting values?",
       "Messy: sparse profiles and some repeated people"
      ],
      [
       "Error handling",
       "What does the endpoint return: one number, or detail per query?",
       "Often one score; ask whether there are per-query results"
      ],
      [
       "Error handling",
       "Is the endpoint rate limited, and is there a budget of submissions?",
       "Ask. It decides how many experiments you can afford"
      ],
      [
       "Scope boundaries",
       "Is latency per query graded, or only the score?",
       "The score first; latency and cost come up in the discussion"
      ],
      [
       "Scope boundaries",
       "Is training a model in scope?",
       "No. Retrieval, features and ranking with what you have"
      ],
      [
       "Scope boundaries",
       "Is the last 15 minutes graded on how I used the LLMs?",
       "Yes, by report: how you used them, the design, the debugging"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**Requirements**"
    },
    {
     "t": "list",
     "items": [
      "1. Given a job description, return a ranked list of candidates, each with a score.",
      "2. Hard requirements (a must-have skill, location, work authorization) filter people out. Soft preferences only change the order.",
      "3. A sparse or messy profile must not crash the run and must not rank first by accident.",
      "4. The same person appearing twice becomes one candidate.",
      "5. Each result can say why it matched: which fields and terms.",
      "6. Every change is run against the evaluation endpoint, and the score is written down next to the change.",
      "7. Out of scope: a user interface, training a model from scratch, live data ingestion."
     ]
    },
    {
     "t": "table",
     "head": [
      "Noun",
      "Keep?",
      "Why"
     ],
     "rows": [
      [
       "JobDescription",
       "keep",
       "Parsed into must-haves, nice-to-haves and free text. Everything else reads it."
      ],
      [
       "CandidateProfile",
       "keep",
       "An id, structured fields and free text. The thing you rank."
      ],
      [
       "Match",
       "keep",
       "A candidate id, a score and the reasons. What the endpoint and the reader both see."
      ],
      [
       "Retriever",
       "keep",
       "Finds a few hundred candidates cheaply, so the expensive step runs on few."
      ],
      [
       "Ranker",
       "keep",
       "Reorders the few. This is where an LLM or an embedding earns its cost."
      ],
      [
       "EvalClient",
       "keep",
       "Wraps the endpoint and writes one log line per run: the change and the score."
      ],
      [
       "Recruiter / Company",
       "drop",
       "External. Not modelled."
      ],
      [
       "Interview / Application",
       "drop",
       "Out of scope for ranking."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**The evaluation endpoint, and how to use it without overfitting**"
    },
    {
     "t": "list",
     "items": [
      "Score the dumbest baseline first, keyword overlap with the hard filters. That number is the one to beat.",
      "Change one thing per submission and write one line: the change, the score before, the score after.",
      "Keep a slice out. If you can split the examples the endpoint gives you, tune on one part and check the other. If you only get one number, treat a gain smaller than the noise as nothing.",
      "Do not chase a quirk. A rule that helps one query is a fit to that query, not a feature.",
      "Read the failures, not only the score. Pick five bad results and find out why each was ranked where it was."
     ]
    },
    {
     "t": "p",
     "text": "**The first 15 minutes**"
    },
    {
     "t": "list",
     "items": [
      "1. Minutes 0 to 3: ask the buckets above, and write the answers at the top of your notes.",
      "2. Minutes 3 to 5: look at the data. Print five profiles, count missing fields, check for repeats. Say one sentence about what is messy.",
      "3. Minutes 5 to 8: say the plan aloud: baseline first, then one change at a time, and what you optimise for.",
      "4. Minutes 8 to 13: write the dumbest end-to-end version: parse the job description, apply the hard filters, score by keyword overlap, return the top N in the required shape.",
      "5. Minutes 13 to 15: call the endpoint once and write down the baseline score. Pick the first experiment."
     ]
    },
    {
     "t": "p",
     "text": "**Lines that set you apart**"
    },
    {
     "t": "table",
     "head": [
      "Line",
      "Why it matters"
     ],
     "rows": [
      [
       "Is this field a hard filter or a soft preference? A hard filter removes people. A soft one only moves them.",
       "Mixing them either drops good candidates or ranks people who cannot take the job."
      ],
      [
       "What does the score reward: the top of the list, or the whole list? I will tune to that, not to a general idea of good.",
       "Precision at k, recall and NDCG reward different things. Tuning to the wrong one moves nothing."
      ],
      [
       "How do I break ties and handle duplicates? I will use a stable, deterministic order.",
       "Equal scores come out in arbitrary order, and one person twice takes two slots. A stable order makes two runs comparable."
      ],
      [
       "A profile with no history gets 'unknown', not zero.",
       "Zero ranks a new person last for lack of data. A guess may rank them first. Say which you chose and why."
      ],
      [
       "Every result carries its reasons.",
       "You can debug a match you can explain, and the review in the last 15 minutes goes better."
      ],
      [
       "Cost and latency per query: retrieve many cheaply, rerank a few with the expensive model.",
       "One model call per candidate per query does not scale. Two stages and cached embeddings do. Count tokens like calls."
      ],
      [
       "I will hold a slice out and check it before I trust a gain.",
       "An endpoint score can be fitted. Showing that you know it is the answer to 'how do you know it improved'."
      ]
     ]
    },
    {
     "t": "say",
     "lines": [
      "I think I would spend the first three minutes asking what goes in, what comes out, and what the score rewards.",
      "Then I would build the dumbest version that runs end to end, submit it, and write the score down as the number to beat.",
      "After that I would change one thing at a time and keep a one-line log, so the last 15 minutes is a story and not a memory test."
     ]
    }
   ]
  }
 ]
});
