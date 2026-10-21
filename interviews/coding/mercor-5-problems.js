/* Mercor coding tab, part 5: Four problems, no internet. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "problems",
 "n": 5,
 "title": "Four problems, no internet",
 "minutes": 120,
 "lead": "After this part you can solve four small problems offline: a dict, an eviction policy, two thread primitives and a sliding window. You write each in the box, use hints only when stuck, and then check why the solution works.",
 "sections": [
  {
   "id": "problems-twosum",
   "title": "1. Two Sum (warm-up)",
   "blocks": [
    {
     "t": "p",
     "text": "Read the statement twice. Work the first example by hand on paper. Write the slow version first, even if you can see the fast one: a correct slow answer beats a broken fast one. Then ask what you keep looking up, and whether a dict can answer it in one step."
    },
    {
     "t": "problem",
     "id": "problems-twosum-p",
     "title": "Two Sum",
     "source": "LeetCode 1 (easy)",
     "minutes": 20,
     "why": "Gets loops and dict lookups back in your hands. Every later problem here is a loop plus a dict or a lock.",
     "statement": "You get a list of integers and a target. Return the positions of two different items that add up to the target. Exactly one answer exists. You may not use the same position twice, and the order of the two positions in the result does not matter.",
     "examples": [
      {
       "input": "nums = [2, 7, 11, 15], target = 9",
       "output": "[0, 1]",
       "note": "2 + 7 = 9, at positions 0 and 1."
      },
      {
       "input": "nums = [3, 2, 4], target = 6",
       "output": "[1, 2]",
       "note": "3 + 3 would match, but there is only one 3. Use 2 + 4."
      },
      {
       "input": "nums = [3, 3], target = 6",
       "output": "[0, 1]",
       "note": "Equal values are fine when they sit at different positions."
      }
     ],
     "constraints": [
      "2 <= len(nums) <= 10,000",
      "values and target fit in a normal int",
      "exactly one valid pair exists"
     ],
     "starter": "def two_sum(nums, target):\n    ...",
     "hints": [
      "Level 1: for each number x, the partner you need is target - x. The question is how fast you can ask 'have I seen that number?'.",
      "Level 2: keep a dict from value to index. Walk the list once. For each x, look up target - x in the dict before you add x.",
      "Level 3: seen = {}; for i, x in enumerate(nums): if target - x in seen: return [seen[target - x], i]; then seen[x] = i."
     ],
     "solution": "def two_sum(nums, target):\n    seen = {}  # value -> index\n    for i, x in enumerate(nums):\n        need = target - x\n        if need in seen:  # check before storing, so an item never pairs with itself\n            return [seen[need], i]\n        seen[x] = i",
     "complexity": "Brute force (two nested loops) is O(n^2) time and O(1) space. The dict version is O(n) time and O(n) space.",
     "explain": [
      "Brute force: try every pair with two loops. It is correct and takes about n squared steps.",
      "Observation: for a given x there is only one number that completes the sum, target - x. You do not need to scan for it, only to ask whether it exists.",
      "A dict answers 'seen it, and where?' in one step, so keep value to index as you walk.",
      "Check the dict before you store x. That is why [3, 3] with target 6 works and a lone 3 never pairs with itself.",
      "One pass, one lookup per item: O(n)."
     ],
     "tests": "assert two_sum([2, 7, 11, 15], 9) == [0, 1]\nassert two_sum([3, 2, 4], 6) == [1, 2]\nassert two_sum([3, 3], 6) == [0, 1]\nassert two_sum([-1, -2, -3, -4], -6) == [1, 3]\nassert two_sum([0, 4, 0], 0) == [0, 2]\nprint(\"two_sum ok\")",
     "followups": [
      {
       "q": "What if the list is sorted and you must use O(1) extra space?",
       "a": "Two pointers. Put one at each end. If the sum is too small move the left pointer right, if too big move the right pointer left. Each step discards one item, so it is O(n) time and O(1) space. Say that sorting first would cost O(n log n) and lose the original positions."
      },
      {
       "q": "What if there can be many valid pairs and you must return all of them?",
       "a": "Keep the same dict but do not return early. Collect every pair as you go. Decide with the interviewer how to treat duplicates (pairs of positions or pairs of values), because that choice changes the dict: value to a list of indices, or a counter."
      },
      {
       "q": "What if the list does not fit in memory?",
       "a": "Say what you would trade. Sort on disk and use two pointers, or split values into buckets by hash so that a number and its partner land in the same bucket, then solve each bucket in memory. This is the same idea as sharding a cache by key."
      }
     ]
    },
    {
     "t": "predict",
     "id": "problems-twosum-pred",
     "code": "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i\n\nprint(two_sum([5, 1, 5, 9], 10))\nprint(two_sum([4, 4, 1], 8))",
     "q": "What do the two lines print? Trace the dict by hand.",
     "answer": "[0, 2]\n[0, 1]",
     "why": "In the first call, 5 is stored at index 0, 1 at index 1, then the second 5 finds 10 - 5 = 5 in the dict at index 0, so [0, 2]. In the second call the second 4 finds 8 - 4 = 4 at index 0. The dict is checked before the current item is stored."
    },
    {
     "t": "mcq",
     "id": "problems-twosum-mcq",
     "q": "Why does the solution look in the dict before storing the current number?",
     "o": [
      "It is faster that way",
      "So an item cannot pair with itself",
      "Dict inserts are slow",
      "To keep the dict sorted",
      "So the answer comes back in sorted order"
     ],
     "a": 1,
     "why": "If you stored x first, a lone 3 with target 6 would find itself at its own position. Looking first means only earlier items can be the partner."
    }
   ]
  },
  {
   "id": "problems-lru",
   "title": "2. LRU Cache",
   "blocks": [
    {
     "t": "p",
     "text": "This is the eviction policy from the screen, written by hand. Read it as an interface first: two methods, both must be fast. Run the example by hand and write down the order of keys after every call. Then ask: which structure gives lookup by key, and which gives 'oldest first' with cheap moves? Python has one that does both."
    },
    {
     "t": "problem",
     "id": "problems-lru-p",
     "title": "LRU Cache",
     "source": "LeetCode 146 (medium)",
     "minutes": 40,
     "why": "The eviction policy from the screen, by hand. If you can write this you can also explain what a cache library does when it is full.",
     "statement": "Build a class LRUCache with a fixed capacity. get(key) returns the stored value, or -1 if the key is not there, and counts as a use of that key. put(key, value) stores or updates a value and counts as a use. When storing a new key would push the size over capacity, drop the key that was used longest ago. Both methods must run in O(1) time on average.",
     "examples": [
      {
       "input": "c = LRUCache(2); c.put(1, 10); c.put(2, 20); c.get(1); c.put(3, 30); c.get(2)",
       "output": "get(1) = 10, then get(2) = -1",
       "note": "get(1) made key 1 the newest, so adding key 3 dropped key 2."
      },
      {
       "input": "c = LRUCache(1); c.put(5, 50); c.put(6, 60); c.get(5)",
       "output": "-1",
       "note": "Capacity 1: the second put pushed key 5 out."
      },
      {
       "input": "c = LRUCache(2); c.put(1, 1); c.put(1, 99); c.get(1)",
       "output": "99",
       "note": "Updating an existing key replaces the value and does not grow the cache."
      }
     ],
     "constraints": [
      "1 <= capacity <= 3000",
      "keys and values are ints",
      "up to about 100,000 calls",
      "get and put are O(1) on average"
     ],
     "starter": "class LRUCache:\n    def __init__(self, capacity: int):\n        ...\n\n    def get(self, key: int) -> int:\n        ...\n\n    def put(self, key: int, value: int) -> None:\n        ...",
     "hints": [
      "Level 1: you need two things at once: find a key fast, and know which key is the oldest. A plain dict gives the first and forgets order of use.",
      "Level 2: collections.OrderedDict keeps keys in order and has move_to_end(key) and popitem(last=False). Keep the oldest at the front and the newest at the back.",
      "Level 3: on get, if the key exists move_to_end it and return its value. On put, set the value, move_to_end, and if len > capacity do popitem(last=False)."
     ],
     "solution": "from collections import OrderedDict\n\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.d = OrderedDict()  # oldest first, newest last\n\n    def get(self, key: int) -> int:\n        if key not in self.d:\n            return -1\n        self.d.move_to_end(key)  # a read counts as a use\n        return self.d[key]\n\n    def put(self, key: int, value: int) -> None:\n        self.d[key] = value\n        self.d.move_to_end(key)\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)  # drop the oldest",
     "complexity": "O(1) average for get and put. O(capacity) space.",
     "explain": [
      "The OrderedDict is a hash map that also remembers insertion order, so one structure gives lookup and 'who is oldest'.",
      "Keep the oldest key at the front and the newest at the back. A use means 'move to the back'.",
      "get: a miss returns -1 and changes nothing. A hit moves the key to the back, then returns the value.",
      "put: setting the value and moving to the back covers both the new-key and the update case. If the size is now over capacity, pop from the front.",
      "Interview-by-hand version: a hash map from key to node, plus a doubly linked list ordered by use. A hit unlinks the node and relinks it at the newest end; eviction removes the node at the oldest end and deletes its key from the map. That is exactly what OrderedDict does inside, and the usual follow-up is to write it without OrderedDict. Code for it is in the first follow-up below."
     ],
     "tests": "c = LRUCache(2)\nc.put(1, 1)\nc.put(2, 2)\nassert c.get(1) == 1\nc.put(3, 3)            # evicts key 2\nassert c.get(2) == -1\nc.put(4, 4)            # evicts key 1\nassert c.get(1) == -1\nassert c.get(3) == 3 and c.get(4) == 4\nc.put(3, 30)           # update, not a new entry\nassert c.get(3) == 30 and c.get(4) == 4\nd = LRUCache(1)\nd.put(1, 1)\nd.put(2, 2)\nassert d.get(1) == -1 and d.get(2) == 2\nprint(\"lru ok\")",
     "followups": [
      {
       "q": "Write it without OrderedDict: a dict plus a doubly linked list.",
       "a": "Use sentinel head and tail nodes so you never test for None. The map goes from key to node. head.next is the oldest, tail.prev is the newest. The node keeps its key so eviction can delete it from the map.\n\nclass Node:\n    def __init__(self, key=0, val=0):\n        self.key, self.val = key, val\n        self.prev = self.next = None\n\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.map = {}                              # key -> Node\n        self.head, self.tail = Node(), Node()      # sentinels: head.next is oldest\n        self.head.next, self.tail.prev = self.tail, self.head\n\n    def _unlink(self, n):\n        n.prev.next, n.next.prev = n.next, n.prev\n\n    def _push_newest(self, n):\n        last = self.tail.prev\n        last.next = n\n        n.prev, n.next = last, self.tail\n        self.tail.prev = n\n\n    def get(self, key: int) -> int:\n        n = self.map.get(key)\n        if n is None:\n            return -1\n        self._unlink(n)\n        self._push_newest(n)\n        return n.val\n\n    def put(self, key: int, value: int) -> None:\n        n = self.map.get(key)\n        if n:\n            n.val = value\n            self._unlink(n)\n        else:\n            n = self.map[key] = Node(key, value)\n            if len(self.map) > self.cap:\n                oldest = self.head.next\n                self._unlink(oldest)\n                del self.map[oldest.key]\n        self._push_newest(n)\n\nThe same tests pass. Say out loud why the node stores its key: when you evict the oldest node you only hold the node, and you need its key to remove the map entry."
      },
      {
       "q": "Make it safe for several threads. Where does the lock go?",
       "a": "One lock around the whole body of get and put. get needs it too, because it writes (move_to_end). A check like 'if key in d' followed by a move is check-then-act, the same race as in the mock ProfileCache. Never hold this lock across a slow load; if a miss triggers a slow call, release the lock, call, then take it again to store.\n\nimport threading\nfrom collections import OrderedDict\n\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.d = OrderedDict()\n        self.lock = threading.Lock()\n\n    def get(self, key: int) -> int:\n        with self.lock:  # get also writes (move_to_end), so it needs the lock too\n            if key not in self.d:\n                return -1\n            self.d.move_to_end(key)\n            return self.d[key]\n\n    def put(self, key: int, value: int) -> None:\n        with self.lock:\n            self.d[key] = value\n            self.d.move_to_end(key)\n            if len(self.d) > self.cap:\n                self.d.popitem(last=False)\n\nA global lock serialises every call. If that becomes the bottleneck, shard: N small caches picked by hash(key) % N, each with its own lock."
      },
      {
       "q": "Add a TTL, so entries expire after some seconds.",
       "a": "Store (value, expires_at) and compare with time.monotonic() on get. Treat an expired entry as a miss and delete it then (lazy expiry). Lazy expiry means dead entries still use a slot until touched or evicted; a background sweep or checking the oldest entries on put fixes that. Use monotonic, not time.time(), so a clock change does not expire or revive entries.\n\nimport time\nfrom collections import OrderedDict\n\n\nclass TTLCache:\n    def __init__(self, capacity, ttl):\n        self.cap, self.ttl = capacity, ttl\n        self.d = OrderedDict()  # key -> (value, expires_at)\n\n    def get(self, key):\n        item = self.d.get(key)\n        if item is None:\n            return -1\n        value, exp = item\n        if time.monotonic() >= exp:  # expired: treat as a miss, remove lazily\n            del self.d[key]\n            return -1\n        self.d.move_to_end(key)\n        return value\n\n    def put(self, key, value):\n        self.d[key] = (value, time.monotonic() + self.ttl)\n        self.d.move_to_end(key)\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)"
      },
      {
       "q": "What would an interviewer ask next?",
       "a": "Likely: what happens on a miss (who loads, and do two threads load the same key at once, which is a stampede), what the memory cost is (capacity is entries, not bytes), whether to count get as a use, how you would measure the hit rate, and when LRU is the wrong policy (a one-time scan flushes the hot set; LFU or a segmented LRU copes better)."
      }
     ]
    },
    {
     "t": "predict",
     "id": "problems-lru-pred",
     "code": "from collections import OrderedDict\n\nd = OrderedDict()\nd[\"a\"] = 1\nd[\"b\"] = 2\nd[\"c\"] = 3\nd.move_to_end(\"a\")\nd.popitem(last=False)\nprint(list(d))",
     "q": "What does this print? It shows the two OrderedDict calls the solution uses.",
     "answer": "['c', 'a']",
     "why": "Start: a, b, c. move_to_end('a') gives b, c, a. popitem(last=False) removes the first item, b, leaving c, a."
    },
    {
     "t": "mcq",
     "id": "problems-lru-mcq",
     "q": "In the thread-safe version, why does get need the lock as well as put?",
     "o": [
      "get is slower than put",
      "get changes the order (move_to_end), so it writes",
      "Locks are only needed on writes of new keys",
      "Python dicts are not readable from two threads",
      "To make the return value an int"
     ],
     "a": 1,
     "why": "In an LRU a read is also a write: it reorders the keys. Two threads reordering at once, or one reordering while another evicts, can corrupt the order or the size check."
    }
   ]
  },
  {
   "id": "problems-order",
   "title": "3. Concurrency: order and a cap",
   "blocks": [
    {
     "t": "p",
     "text": "Two small problems that use the real primitives. First, ordering: three methods arrive from three threads in any order and the output must still be 1, 2, 3. Think of each step as a gate that the previous step opens. Second, a cap: a queue that makes producers wait when it is full and consumers wait when it is empty. Read the statement, then draw a timeline with three threads and mark where each one waits. This is the Commure gap: where order is kept and where work is capped."
    },
    {
     "t": "problem",
     "id": "problems-order-p",
     "title": "Print in Order",
     "source": "LeetCode 1114 (easy), follow-up LeetCode 1188 (medium)",
     "minutes": 35,
     "why": "Ordering and capping with real primitives. In the Commure round you could not find where to add a cap and an order. Event gives you an order gate; Condition gives you a cap.",
     "statement": "A class Foo has three methods: first(), second() and third(). Each takes a function that prints its own number (1, 2 or 3). Three different threads call the three methods, and the threads can start in any order. Make the printing happen as 1, 2, 3 every time. No method may print before the one before it has printed, and none may wait forever once its turn has come.",
     "examples": [
      {
       "input": "threads start in order first, second, third",
       "output": "1 2 3",
       "note": "The easy case."
      },
      {
       "input": "threads start in order third, second, first",
       "output": "1 2 3",
       "note": "third and second must wait until first has printed."
      },
      {
       "input": "threads start in order second, first, third",
       "output": "1 2 3",
       "note": "second waits for first. third waits for second."
      }
     ],
     "constraints": [
      "exactly one thread calls each method, once",
      "standard library only (threading)",
      "no busy loops and no sleep() to guess the timing"
     ],
     "starter": "class Foo:\n    def __init__(self):\n        ...\n\n    def first(self, printFirst):\n        printFirst()\n\n    def second(self, printSecond):\n        printSecond()\n\n    def third(self, printThird):\n        printThird()",
     "hints": [
      "Level 1: second must wait for first to finish, third must wait for second. A waiting thread should sleep, not spin.",
      "Level 2: threading.Event has wait() and set(). Make two events: one set when first is done, one set when second is done.",
      "Level 3: first prints then sets first_done; second waits on first_done, prints, sets second_done; third waits on second_done, then prints."
     ],
     "solution": "import threading\n\n\nclass Foo:\n    def __init__(self):\n        self.first_done = threading.Event()\n        self.second_done = threading.Event()\n\n    def first(self, printFirst):\n        printFirst()\n        self.first_done.set()          # open the gate for second\n\n    def second(self, printSecond):\n        self.first_done.wait()         # block until first has printed\n        printSecond()\n        self.second_done.set()\n\n    def third(self, printThird):\n        self.second_done.wait()\n        printThird()",
     "complexity": "O(1) time and space. Threads that arrive early block, so no CPU is used while they wait.",
     "explain": [
      "Three threads, one required order, so each step needs a signal from the step before it.",
      "An Event is a flag threads can wait on. wait() blocks until some other thread calls set(). Once set it stays set, so a late arriver does not block.",
      "first has nothing to wait for. It prints, then sets first_done.",
      "second blocks on first_done, prints, sets second_done. third blocks on second_done and prints.",
      "Because Events stay set, it does not matter who arrives first: if the signal already came, wait() returns immediately. Variant: a Condition and a counter 'turn', with wait_for(lambda: turn == mine), is also correct and extends to N steps (see the follow-ups)."
     ],
     "tests": "import itertools\nimport threading\n\nfor _ in range(20):\n    for order in itertools.permutations([\"first\", \"second\", \"third\"]):\n        foo, out = Foo(), []\n        fns = {\n            \"first\": lambda: foo.first(lambda: out.append(1)),\n            \"second\": lambda: foo.second(lambda: out.append(2)),\n            \"third\": lambda: foo.third(lambda: out.append(3)),\n        }\n        threads = [threading.Thread(target=fns[name]) for name in order]\n        for t in threads:  # started in the shuffled order\n            t.start()\n        for t in threads:\n            t.join(timeout=5)\n        assert out == [1, 2, 3], (order, out)\nprint(\"foo ok\")",
     "followups": [
      {
       "q": "Do it with a Condition and one counter instead of two Events. Why does wait_for matter?",
       "a": "One Condition guards a counter 'turn'. Each method waits until turn equals its own number, runs, increments turn and calls notify_all.\n\nimport threading\n\n\nclass Foo:\n    def __init__(self):\n        self.cond = threading.Condition()\n        self.turn = 1\n\n    def _run(self, my_turn, fn):\n        with self.cond:\n            self.cond.wait_for(lambda: self.turn == my_turn)  # re-checks after every wake\n            fn()\n            self.turn += 1\n            self.cond.notify_all()\n\n    def first(self, printFirst):\n        self._run(1, printFirst)\n\n    def second(self, printSecond):\n        self._run(2, printSecond)\n\n    def third(self, printThird):\n        self._run(3, printThird)\n\nwait_for re-checks the test after every wake-up. A bare cond.wait() can wake when it is not your turn (another thread notified), so the test must sit in a loop. wait_for is that loop. With N steps the Event version needs N-1 events; this one needs none extra."
      },
      {
       "q": "What goes wrong if second() calls first_done.wait() and first() is never called?",
       "a": "second blocks forever, and so does third. The program never exits if those threads are not daemons. In real code you pass a timeout to wait() (it returns False on timeout) and decide what to do: raise, log, cancel. A wait with no timeout is the bug behind many stuck production threads."
      },
      {
       "q": "Bounded Blocking Queue (LeetCode 1188, medium): enqueue blocks when full, dequeue blocks when empty. Write it, with a test.",
       "a": "One Condition, two tests. A producer waits while the queue is full, a consumer waits while it is empty. After any change, notify_all so the other side re-checks. The capacity is the cap: it is what stops a fast producer from piling up work.\n\nimport threading\nfrom collections import deque\n\n\nclass BoundedBlockingQueue:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.q = deque()\n        self.cond = threading.Condition()  # one lock; waiters re-check their own test\n\n    def enqueue(self, element: int) -> None:\n        with self.cond:\n            self.cond.wait_for(lambda: len(self.q) < self.cap)  # block while full\n            self.q.append(element)\n            self.cond.notify_all()  # wake consumers waiting on empty\n\n    def dequeue(self) -> int:\n        with self.cond:\n            self.cond.wait_for(lambda: len(self.q) > 0)  # block while empty\n            item = self.q.popleft()\n            self.cond.notify_all()  # wake producers waiting on full\n            return item\n\n    def size(self) -> int:\n        with self.cond:\n            return len(self.q)\n\nTest with producers and consumers (the producers outnumber the capacity, so they must block; it passed 20 runs):\n\nimport threading\n\nfor _ in range(20):\n    q = BoundedBlockingQueue(2)\n    got, peak = [], [0]\n    n_producers, per = 3, 50\n\n    def producer(base):\n        for i in range(per):\n            q.enqueue(base + i)\n            peak[0] = max(peak[0], q.size())\n\n    def consumer():\n        for _ in range(n_producers * per // 2):\n            got.append(q.dequeue())\n\n    ts = [threading.Thread(target=producer, args=(b * 1000,)) for b in range(n_producers)]\n    ts += [threading.Thread(target=consumer) for _ in range(2)]\n    for t in ts:\n        t.start()\n    for t in ts:\n        t.join(timeout=10)\n        assert not t.is_alive(), \"deadlock\"\n    assert len(got) == n_producers * per and len(set(got)) == len(got)\n    assert peak[0] <= 2 and q.size() == 0\n    for b in range(n_producers):  # per-producer order is kept\n        mine = [x for x in got if x // 1000 == b]\n        assert mine == sorted(mine)\nprint(\"queue ok\")\n\nSay why notify_all and not notify: producers and consumers wait on the same condition, and a single notify could wake the wrong kind (a producer, when the room was made for a consumer), losing the wake-up. Two Conditions on one lock, not_full and not_empty, would let you use notify. In the mocks this is the shape of the bounded asyncio.Queue in app/workers/refresh.py."
      },
      {
       "q": "How do you test code like this, since the order of threads is not under your control?",
       "a": "Start the threads in every order you can (all six permutations here) and repeat many times, then assert on the result and use join with a timeout so a deadlock fails the test instead of hanging. A pass is evidence, not proof. Say so in the interview."
      }
     ]
    },
    {
     "t": "predict",
     "id": "problems-order-pred",
     "code": "import threading\n\ne = threading.Event()\nout = []\n\ndef waiter():\n    e.wait()\n    out.append(\"waiter\")\n\nt = threading.Thread(target=waiter)\nt.start()\nout.append(\"before\")\ne.set()\nt.join()\ne.wait()\nout.append(\"after\")\nprint(out)",
     "q": "What does this print? Is the order the same on every run?",
     "answer": "['before', 'waiter', 'after']",
     "why": "The waiter thread blocks on e.wait() until the main thread calls e.set(), which happens after 'before' is appended. 'after' is appended after t.join(), so it comes last. The order is the same every run because the Event forces it. Without the Event, 'before' and 'waiter' could swap."
    },
    {
     "t": "mcq",
     "id": "problems-order-mcq",
     "q": "In the bounded queue, what stops a fast producer from using all your memory?",
     "o": [
      "Python's garbage collector",
      "enqueue waits while the queue is at capacity",
      "The consumer threads run faster",
      "notify_all slows the producer",
      "A sleep() in enqueue"
     ],
     "a": 1,
     "why": "The capacity check in wait_for(lambda: len(q) < cap) makes the producer block until a consumer removes an item. That blocking is the backpressure."
    }
   ]
  },
  {
   "id": "problems-window",
   "title": "4. Sliding window",
   "blocks": [
    {
     "t": "p",
     "text": "This loop shape appears everywhere: a window with a left edge and a right edge, where the right edge moves every step and the left edge moves only when needed. Brute force first: from each start, extend until a repeat. Write that, test it on the examples, then ask what work it repeats and what single thing you could remember to skip it."
    },
    {
     "t": "problem",
     "id": "problems-window-p",
     "title": "Longest Substring Without Repeating Characters",
     "source": "LeetCode 3 (medium)",
     "minutes": 30,
     "why": "The two-pointer loop that appears in rate limiters, log scans and stream processing: a window that grows on the right and shrinks on the left. The dict of last-seen index is the same trick as the Two Sum dict.",
     "statement": "Given a string, return the length of the longest stretch of consecutive characters in which no character appears twice.",
     "examples": [
      {
       "input": "s = \"abcabcbb\"",
       "output": "3",
       "note": "\"abc\" is the longest run with no repeat."
      },
      {
       "input": "s = \"bbbbb\"",
       "output": "1",
       "note": "Every window longer than one repeats b."
      },
      {
       "input": "s = \"pwwkew\"",
       "output": "3",
       "note": "\"wke\" counts. \"pwke\" does not, because it is not consecutive."
      }
     ],
     "constraints": [
      "0 <= len(s) <= 50,000",
      "s holds letters, digits, symbols and spaces",
      "the empty string gives 0"
     ],
     "starter": "def length_of_longest_substring(s: str) -> int:\n    ...",
     "hints": [
      "Level 1: keep a window s[left..right] with no repeats. Move right one step at a time. When the new character is already in the window, move left past it.",
      "Level 2: a dict from character to the last index where you saw it lets you jump left straight past the old copy instead of stepping.",
      "Level 3: for right, ch in enumerate(s): if ch is in last and last[ch] >= left, set left = last[ch] + 1. Then last[ch] = right and best = max(best, right - left + 1)."
     ],
     "solution": "def length_of_longest_substring(s: str) -> int:\n    last = {}        # char -> index where it was last seen\n    left = best = 0  # window is s[left..right]\n    for right, ch in enumerate(s):\n        if ch in last and last[ch] >= left:  # repeat inside the window\n            left = last[ch] + 1              # jump past it\n        last[ch] = right\n        best = max(best, right - left + 1)\n    return best",
     "complexity": "O(n) time (each character is visited once), O(k) space where k is the number of distinct characters.",
     "explain": [
      "Brute force: for each start, extend until a repeat. That is O(n^2) because the same characters are re-read from many starts.",
      "The window s[left..right] never contains a repeat. Each step adds s[right].",
      "If ch was last seen at index j and j >= left, then j is inside the window. Move left to j + 1 so the old copy drops out.",
      "If j < left, the old copy is already outside the window, so do nothing. This is the check people forget.",
      "Record last[ch] = right and update best with the window size, right - left + 1."
     ],
     "tests": "f = length_of_longest_substring\nassert f(\"\") == 0\nassert f(\"a\") == 1\nassert f(\"abcabcbb\") == 3\nassert f(\"bbbbb\") == 1\nassert f(\"pwwkew\") == 3\nassert f(\"abba\") == 2\nassert f(\"dvdf\") == 3\nassert f(\"tmmzuxt\") == 5\nprint(\"window ok\")",
     "followups": [
      {
       "q": "Why the check last[ch] >= left? What breaks without it?",
       "a": "Without it, left can move backwards. For 'abba': at the second b, left becomes 2. At the final a, the old a is at index 0, and the code would set left = 1, which brings the second b back into the window and returns 3 instead of 2. The check says: only react to a repeat that is still inside the window. max(left, last[ch] + 1) is the same fix in one line."
      },
      {
       "q": "Return the substring itself, not just the length.",
       "a": "Track the start of the best window: when best improves, save left and right. At the end return s[start:start + best]. Costs one extra variable and no extra pass."
      },
      {
       "q": "Where else does this window shape show up?",
       "a": "A rate limiter that counts requests in the last 60 seconds (the left edge moves as time passes), the longest run of requests under an error budget, log scans for the shortest span containing all of some events, and 'at most K distinct' problems, which swap the dict for a counter. If asked, say the pattern is: grow right every step, shrink left only while the window breaks the rule."
      }
     ]
    },
    {
     "t": "predict",
     "id": "problems-window-pred",
     "code": "def f(s):\n    last, left, best = {}, 0, 0\n    for right, ch in enumerate(s):\n        if ch in last:\n            left = last[ch] + 1   # no check that it is inside the window\n        last[ch] = right\n        best = max(best, right - left + 1)\n    return best\n\nprint(f(\"abba\"))\nprint(f(\"abcb\"))",
     "q": "This version drops the 'is it inside the window' check. What do the two lines print? The correct answers are 2 and 3.",
     "answer": "3\n3",
     "why": "For 'abba' the first line should be 2, but this code returns 3: at the last a, last['a'] is 0 so left is set back to 1, and the window 'bba' is counted as length 3 while it contains two b. 'abcb' is 3 and is right, because the old b is inside the window. The bug only shows when the old copy is already to the left of the window."
    },
    {
     "t": "mcq",
     "id": "problems-window-mcq",
     "q": "Why is the sliding-window solution O(n) and not O(n^2)?",
     "o": [
      "Python dicts are O(1) so everything is",
      "right moves forward every step and left never moves back, so each character is handled at most twice",
      "It stops early when it finds a repeat",
      "It sorts the string first",
      "It uses recursion"
     ],
     "a": 1,
     "why": "Both pointers only move forward, so the total movement is at most 2n. The brute force restarts the scan from every position, which re-reads the same characters."
    }
   ]
  }
 ]
});
