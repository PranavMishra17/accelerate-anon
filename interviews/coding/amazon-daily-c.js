/* Amazon loop: the daily two, final day. Every solution and test was run with Python 3.12. */
window.LOOP_DAILY = window.LOOP_DAILY || { days: [] };
window.LOOP_DAILY.days.push({ date: "2026-11-11", n: 16, label: "Final", problems: [
  {
    "id": "d16-a",
    "minutes": 25,
    "title": "Spreading spoilage",
    "scenario": "A cold-storage room is laid out as a grid of racks. Each rack is `0` (empty), `1` (a fresh crate) or `2` (a crate that has already started to spoil). Every minute, each spoiled crate spoils any fresh crate directly above, below, left or right of it. Return the number of minutes until no fresh crate is left, or `-1` if some fresh crate can never be reached.",
    "examples": [
      {
        "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        "output": "4",
        "note": "Minute 1 reaches (0,1) and (1,0). Minute 2 reaches (0,2) and (1,1). Minute 3 reaches (2,1). Minute 4 reaches (2,2)."
      },
      {
        "input": "grid = [[2,1,1],[0,1,1],[1,0,1]]",
        "output": "-1",
        "note": "The crate at (2,0) has an empty rack above it and to its right, so nothing reaches it."
      },
      {
        "input": "grid = [[0,2]]",
        "output": "0",
        "note": "There is no fresh crate, so no time has to pass."
      }
    ],
    "constraints": [
      "0 <= rows, cols <= 10",
      "each cell is 0, 1 or 2",
      "an empty grid, or a grid with no fresh crate, answers 0",
      "spreading is in four directions only, not diagonal",
      "you may change the grid you are given"
    ],
    "clarify": [
      {
        "q": "Do the spoiled crates all start at the same moment?",
        "a": "Yes. Everything marked 2 is spoiled at minute 0 and they all spread at once."
      },
      {
        "q": "Does the spread go through empty racks?",
        "a": "No. It moves only between neighbouring cells that hold a crate, so an empty rack blocks it."
      },
      {
        "q": "If there are no fresh crates at all, what do I return?",
        "a": "0, even if there are also no spoiled crates."
      },
      {
        "q": "If there are fresh crates but no spoiled one?",
        "a": "-1, because nothing can ever start the spread."
      }
    ],
    "starter": "def spoil_minutes(grid):\n    ...\n",
    "hints": [
      "Think of the spoilage as a wave. Everything the wave touches in minute 1 comes from the cells that were spoiled at minute 0. What does that say about the order you should process cells in?",
      "Use a queue seeded with every spoiled crate at once. Process the queue one full level at a time: the number of levels you process is the number of minutes. Count the fresh crates up front so you know when you are done.",
      "Loop `for _ in range(len(q))` for one minute. For each cell popped, look at the four neighbours; if one is `1`, set it to `2` immediately, subtract one from `fresh`, and append it. After each level add one minute. At the end return `minutes` if `fresh == 0`, else `-1`."
    ],
    "solution": "from collections import deque\n\ndef spoil_minutes(grid):\n    if not grid or not grid[0]:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                q.append((r, c))              # every spoiled crate starts the spread at minute 0\n            elif grid[r][c] == 1:\n                fresh += 1\n    minutes = 0\n    while q and fresh:\n        for _ in range(len(q)):               # one pass over the queue is one minute\n            r, c = q.popleft()\n            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2          # mark now, so no other crate can enqueue it again\n                    fresh -= 1\n                    q.append((nr, nc))\n        minutes += 1\n    return minutes if fresh == 0 else -1      # fresh left over means a crate nothing can reach\n",
    "complexity": "O(rows * cols) time and space: each cell enters the queue at most once and does four neighbour checks.",
    "explain": [
      "Brute force: simulate minute by minute. Scan the whole grid, find every fresh crate next to a spoiled one, spoil them all together, repeat until nothing changes. A grid of N cells can need up to N minutes, so that is O(N^2) rescanning.",
      "The improvement is to notice that only cells spoiled in the last minute can spoil anything new. A queue holds exactly those cells, so each cell is looked at once when it is popped, not once per minute.",
      "Start from all spoiled crates together (multi-source BFS). That makes the queue order equal to time order: every cell at distance d is popped before any cell at distance d + 1.",
      "Every cell is enqueued once because a cell is marked spoiled at the moment it is enqueued, not when it is popped. Marking at pop time would let two neighbours both enqueue the same fresh cell before either is popped, so the cell would be counted twice and `fresh` would go wrong.",
      "Processing by `len(q)` per round keeps minutes honest: all cells in one round spoil in the same minute.",
      "Stop when `fresh` reaches 0, so we do not add a trailing minute for a last round that spoils nothing. If the queue empties while `fresh > 0`, the leftovers are unreachable: return -1."
    ],
    "dryrun": "Grid [[2,1,1],[1,1,0],[0,1,1]]. fresh = 6, queue = [(0,0)], minutes = 0. Round 1: pop (0,0); (0,1) and (1,0) are fresh, spoil both, fresh = 4, minutes = 1. Round 2: pop (0,1): (0,2) and (1,1) spoil, fresh = 2. Pop (1,0): nothing fresh near it. minutes = 2. Round 3: pop (0,2): nothing. Pop (1,1): (2,1) spoils, fresh = 1. minutes = 3. Round 4: pop (2,1): (2,2) spoils, fresh = 0. minutes = 4. The loop ends because fresh is 0. Return 4.",
    "tests": "import copy\ndef f(g): return spoil_minutes(copy.deepcopy(g))\nassert f([[2,1,1],[1,1,0],[0,1,1]]) == 4\nassert f([[2,1,1],[0,1,1],[1,0,1]]) == -1\nassert f([[0,2]]) == 0\nassert f([]) == 0                       # empty grid\nassert f([[0,0],[0,0]]) == 0            # no crates at all\nassert f([[1,1],[1,1]]) == -1           # fresh crates but no spoiled one\nassert f([[2]]) == 0\nassert f([[1]]) == -1\nassert f([[2,1,0,1]]) == -1             # an empty cell walls off the last crate\nassert f([[2,1,1,1,1]]) == 4\nassert f([[2,1,2]]) == 1                # two sources reach the middle in the same minute\nprint(\"all good\")\n",
    "followups": [
      {
        "q": "Return -1 when some crate is unreachable: where does that fall out of your code, and what is the trap?",
        "a": "It is already in the main version: after the loop, `fresh` is still above zero exactly when some crate was never reached, so we return -1. The trap is to test `minutes` or the queue instead, which cannot tell the difference between 'finished' and 'stuck'. Also check the case with fresh crates and no spoiled one: the queue starts empty, the loop never runs, `fresh > 0`, and the answer is -1."
      },
      {
        "q": "Return the minute at which every crate spoils, as a grid.",
        "a": "Keep a `time` grid and let the BFS fill it as it goes. Each newly reached cell gets its parent's time plus one, which also serves as the visited mark.\n```python\nfrom collections import deque\n\ndef spoil_times(grid):\n    # time[r][c] = minute the crate spoils, None if it never does or was never a crate\n    rows, cols = len(grid), len(grid[0]) if grid else 0\n    time = [[None] * cols for _ in range(rows)]\n    q = deque()\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                time[r][c] = 0\n                q.append((r, c))\n    while q:\n        r, c = q.popleft()\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1 and time[nr][nc] is None:\n                time[nr][nc] = time[r][c] + 1\n                q.append((nr, nc))\n    return time\n```"
      },
      {
        "q": "Return the path the spoilage took to reach a given crate.",
        "a": "Store a parent for each cell when you enqueue it, then walk the parent links back from the target and reverse. Sources have no parent.\n```python\nfrom collections import deque\n\ndef spoil_path(grid, target):\n    # path from the nearest spoiled crate to target, as a list of cells; [] if unreachable\n    rows, cols = len(grid), len(grid[0]) if grid else 0\n    parent = {}\n    q = deque()\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                parent[(r, c)] = None         # a source has no parent\n                q.append((r, c))\n    while q:\n        cell = q.popleft()\n        r, c = cell\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1 and (nr, nc) not in parent:\n                parent[(nr, nc)] = cell\n                q.append((nr, nc))\n    if target not in parent:\n        return []\n    path = []\n    cell = target\n    while cell is not None:                   # walk the parent links back to a source\n        path.append(cell)\n        cell = parent[cell]\n    return path[::-1]\n```"
      },
      {
        "q": "Why not DFS?",
        "a": "DFS reaches a cell by whichever path it tries first, not the shortest one, so the recorded time would be wrong. BFS visits cells in order of distance from the nearest source, which is exactly the question."
      }
    ],
    "reveal": {
      "lc": "LeetCode 994 Rotting Oranges (medium)",
      "topic": "Multi-source BFS, level by level",
      "pattern": "graphs"
    }
  },
  {
    "id": "d16-b",
    "minutes": 25,
    "title": "Recently used shelf",
    "scenario": "A product page keeps a small shelf of recently viewed items. The shelf has a fixed capacity. Reading an item moves it to the front of the shelf. Adding a new item also puts it at the front; if the shelf is already full, the item that has gone longest without being read or added is removed first. Both reading and adding must take constant time on average. Build `RecentCache` with `get(key)`, which returns the stored value or `-1`, and `put(key, value)`, which inserts or updates.",
    "examples": [
      {
        "input": "cap 2: put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)",
        "output": "1, -1, -1, 3, 4",
        "note": "put(3,3) removes key 2, because 1 was read more recently. put(4,4) then removes key 1."
      },
      {
        "input": "cap 1: put(1,10), put(2,20), get(1), get(2)",
        "output": "-1, 20",
        "note": "With room for one item, every new key removes the previous one."
      },
      {
        "input": "cap 2: put(1,1), put(2,2), put(1,5), put(3,3), get(2), get(1)",
        "output": "-1, 5",
        "note": "Updating key 1 counts as using it, so key 2 is the one removed."
      }
    ],
    "constraints": [
      "1 <= capacity <= 3000",
      "keys and values are integers",
      "get and put should be O(1) on average",
      "build the ordering yourself with a doubly linked list; the starter has a `Node` class",
      "a put on an existing key updates the value and refreshes it"
    ],
    "clarify": [
      {
        "q": "Does a put on an existing key count as a use?",
        "a": "Yes. It updates the value and moves the item to the front."
      },
      {
        "q": "Does a failed get change anything?",
        "a": "No. A missing key leaves the shelf untouched."
      },
      {
        "q": "Is capacity ever zero?",
        "a": "No, at least 1."
      },
      {
        "q": "Can I use a library ordered dictionary?",
        "a": "Not in the solution. The point is to build the ordering yourself; you can mention it as the shortcut."
      }
    ],
    "starter": "class Node:\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = None\n        self.next = None\n\nclass RecentCache:\n    def __init__(self, capacity):\n        ...\n\n    def get(self, key):\n        ...\n\n    def put(self, key, value):\n        ...\n",
    "hints": [
      "You need two things at once: find a key in O(1), and know which item is oldest in O(1) while moving any item to the front in O(1). What structure gives each of those?",
      "A hash map from key to node finds the item. A doubly linked list keeps the order, newest at the head side and oldest at the tail side. Removing a node from the middle is O(1) only if the node knows both neighbours.",
      "Add a dummy head and dummy tail so there are no empty-list special cases. Write two helpers, `_unlink(node)` and `_push_front(node)`. `get` unlinks then pushes front. `put` on a new key evicts `tail.prev` first if full, and the evicted node must remember its key so you can delete it from the map."
    ],
    "solution": "class Node:\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = None\n        self.next = None\n\nclass RecentCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.map = {}                          # key -> node, for O(1) lookup\n        self.head = Node()                     # dummy: the node after it is the most recent\n        self.tail = Node()                     # dummy: the node before it is the least recent\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def _unlink(self, node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def _push_front(self, node):\n        node.prev = self.head\n        node.next = self.head.next\n        self.head.next.prev = node\n        self.head.next = node\n\n    def get(self, key):\n        if key not in self.map:\n            return -1\n        node = self.map[key]\n        self._unlink(node)                     # a read makes it the most recent\n        self._push_front(node)\n        return node.val\n\n    def put(self, key, value):\n        if key in self.map:\n            node = self.map[key]\n            node.val = value\n            self._unlink(node)\n            self._push_front(node)\n            return\n        if len(self.map) == self.cap:\n            oldest = self.tail.prev            # evict the least recent\n            self._unlink(oldest)\n            del self.map[oldest.key]           # the node keeps its key for exactly this\n        node = Node(key, value)\n        self.map[key] = node\n        self._push_front(node)\n",
    "complexity": "O(1) time for get and put. O(capacity) space for the map and the list.",
    "explain": [
      "Brute force: keep a plain list in recency order. A get finds the item by scanning (O(n)) and moves it, and an eviction pops the front. Correct, but O(n) per operation.",
      "A dict alone finds items in O(1) but has no cheap way to say which is oldest. A list alone gives order but finds items in O(n). Combine them: the dict points straight at nodes in the list.",
      "A doubly linked list makes removal from anywhere O(1), because each node has `prev` and `next`. A singly linked list could not unlink a node without walking to its predecessor.",
      "Dummy head and tail nodes mean `_unlink` and `_push_front` never check for an empty list or for the first or last real node. That removes the bugs most people hit.",
      "The node stores its key as well as its value. When we evict `tail.prev`, we only have the node, and we need its key to delete the dict entry.",
      "In Python, `OrderedDict` with `move_to_end` and `popitem(last=False)` does all of this in a few lines. It is the right answer in production code and worth mentioning, but it hides the structure the interviewer wants to see."
    ],
    "dryrun": "Capacity 2. put(1,1): list is head, 1, tail. put(2,2): head, 2, 1, tail. get(1): unlink 1 and push to front, list is head, 1, 2, tail; returns 1. put(3,3): the map is full, so evict tail.prev, which is 2; delete key 2 from the map; push 3: head, 3, 1, tail. get(2): not in the map, return -1. put(4,4): full, evict tail.prev, which is 1; list is head, 4, 3, tail. get(1) is -1, get(3) moves 3 to the front and returns 3, get(4) returns 4.",
    "tests": "c = RecentCache(2)\nc.put(1, 1); c.put(2, 2)\nassert c.get(1) == 1\nc.put(3, 3)                              # evicts 2\nassert c.get(2) == -1\nc.put(4, 4)                              # evicts 1\nassert c.get(1) == -1\nassert c.get(3) == 3\nassert c.get(4) == 4\nc = RecentCache(1)                       # capacity 1\nc.put(1, 10)\nassert c.get(1) == 10\nc.put(2, 20)\nassert c.get(1) == -1 and c.get(2) == 20\nc.put(2, 21)                             # update in place, no eviction\nassert c.get(2) == 21\nc = RecentCache(2)\nc.put(1, 1); c.put(2, 2); c.put(1, 5)    # update makes 1 the most recent\nc.put(3, 3)                              # so 2 goes\nassert c.get(2) == -1 and c.get(1) == 5 and c.get(3) == 3\nc = RecentCache(3)\nassert c.get(9) == -1\nfor k in range(10):\n    c.put(k, k)\nassert [c.get(k) for k in range(10)] == [-1] * 7 + [7, 8, 9]\nprint(\"all good\")\n",
    "followups": [
      {
        "q": "Each item now has a time to live. How do you expire items: lazily on get, or with a background sweep? Show the code.",
        "a": "Lazy expiry checks the expiry time only when the key is read: if it has passed, remove the item and report a miss. It costs nothing when nobody reads, but dead items keep using capacity until they are read or evicted by pressure. A background sweep removes dead items on a schedule, so memory is reclaimed, but it needs an expiry-ordered structure, because our list is ordered by recency, not by expiry. A min-heap of (expiry, key) does it; entries go stale when a key is refreshed, so the sweep checks that the heap entry still matches the live expiry. The sweep can also run opportunistically at the start of get and put. The clock is passed in so it can be faked in tests. The class below does both:\n```python\nimport heapq\n\nclass TTLCache(RecentCache):\n    def __init__(self, capacity, clock):\n        super().__init__(capacity)\n        self.clock = clock                     # a function returning now, so tests can fake time\n        self.expires = {}                      # key -> expiry time\n        self.heap = []                         # (expiry, key), used only by the sweep\n\n    def put(self, key, value, ttl):\n        super().put(key, value)\n        self.expires[key] = self.clock() + ttl\n        heapq.heappush(self.heap, (self.expires[key], key))\n\n    def get(self, key):\n        if key in self.map and self.expires[key] <= self.clock():\n            self._drop(key)                    # lazy expiry: only a read notices it\n        return super().get(key)\n\n    def _drop(self, key):\n        self._unlink(self.map[key])\n        del self.map[key]\n        del self.expires[key]\n\n    def sweep(self):\n        now = self.clock()\n        while self.heap and self.heap[0][0] <= now:\n            exp, key = heapq.heappop(self.heap)\n            if key in self.map and self.expires[key] == exp:   # skip stale heap entries\n                self._drop(key)\n```"
      },
      {
        "q": "Make it thread safe.",
        "a": "The simplest correct answer is one lock around get and put, since even a get mutates the list. If contention matters, shard the cache by key hash into several independent caches, each with its own lock. That gives up one global recency order but keeps a good approximation."
      },
      {
        "q": "Why does the node keep its key?",
        "a": "Eviction starts from the list, not the dict. We reach `tail.prev` and need to delete its dict entry, which needs the key. Without it we would scan the dict for the node."
      }
    ],
    "reveal": {
      "lc": "LeetCode 146 LRU Cache (medium)",
      "topic": "Hash map plus doubly linked list with dummy ends",
      "pattern": "linked"
    }
  },
  {
    "id": "d16-c",
    "minutes": 25,
    "title": "Build order for services",
    "scenario": "A deployment pipeline has `n` services numbered `0` to `n-1`. Each pair `[a, b]` in `prereqs` means service `b` must be deployed before service `a`. Return one order in which every service can be deployed so that all dependencies are respected. If no such order exists, return an empty list.",
    "examples": [
      {
        "input": "n = 2, prereqs = [[1,0]]",
        "output": "[0, 1]",
        "note": "Service 0 must go first."
      },
      {
        "input": "n = 4, prereqs = [[1,0],[2,0],[3,1],[3,2]]",
        "output": "[0, 1, 2, 3] or [0, 2, 1, 3]",
        "note": "Any order that respects the pairs is accepted."
      },
      {
        "input": "n = 2, prereqs = [[1,0],[0,1]]",
        "output": "[]",
        "note": "Each waits on the other, so nothing can go first."
      }
    ],
    "constraints": [
      "0 <= n <= 2000",
      "0 <= number of pairs <= n * (n - 1)",
      "a pair may repeat; a pair `[x, x]` is possible and makes an order impossible",
      "services with no pairs can appear anywhere",
      "if several orders work, return any one"
    ],
    "clarify": [
      {
        "q": "Is the answer unique?",
        "a": "No. Return any valid order; the checker verifies the pairs, it does not compare to one list."
      },
      {
        "q": "Can a service depend on itself?",
        "a": "Yes in the input, and that has no valid order, so return []."
      },
      {
        "q": "What if n is 0?",
        "a": "Return an empty list."
      },
      {
        "q": "Do I need to name the services in the cycle?",
        "a": "No, only to return [] when one exists. Be ready to discuss how you would find one."
      }
    ],
    "starter": "def build_order(n, prereqs):\n    ...\n",
    "hints": [
      "Which services could you deploy first, right now? What changes for the others once those are done?",
      "Count, for each service, how many prerequisites it is still waiting on. Start with every service whose count is 0. Deploying one lowers the count of everything that waits on it.",
      "Build `after[b]` (services waiting on b) and `indeg[a]`. Put all zero-count services in a queue. Pop one, add it to the order, decrement each dependent's count and queue it when it hits 0. At the end, if the order has fewer than `n` services, return `[]`."
    ],
    "solution": "from collections import deque\n\ndef build_order(n, prereqs):\n    after = [[] for _ in range(n)]            # after[b] = tasks that wait for b\n    indeg = [0] * n                           # indeg[a] = prerequisites a still waits on\n    for a, b in prereqs:\n        after[b].append(a)\n        indeg[a] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0)    # nothing blocks these\n    order = []\n    while q:\n        b = q.popleft()\n        order.append(b)\n        for a in after[b]:\n            indeg[a] -= 1                     # one prerequisite of a is done\n            if indeg[a] == 0:\n                q.append(a)\n    return order if len(order) == n else []   # fewer than n processed means a cycle\n",
    "complexity": "O(V + E) time and space, where V = n and E = len(prereqs).",
    "explain": [
      "Brute force: repeatedly scan all services for one whose prerequisites are all deployed, deploy it, and repeat. Each scan is O(V + E) and there are up to V rounds, so O(V * (V + E)).",
      "Kahn's algorithm removes the rescanning. Keep an in-degree per service, the number of undeployed prerequisites. A service with in-degree 0 is ready. Deploying it lowers the in-degree of its dependents, and any that reach 0 become ready.",
      "Each edge is touched once, when its prerequisite is deployed, and each service enters the queue once, so the total is O(V + E).",
      "Cycle detection comes free. Services on a cycle never reach in-degree 0, because each waits on another one on the cycle. So if the number of processed services is below V, there is a cycle and no order exists. Return [].",
      "A repeated pair adds to the in-degree twice and releases twice, so it stays consistent without special handling. A self-pair keeps in-degree at least 1 forever, so it is caught the same way."
    ],
    "dryrun": "n = 4, prereqs = [[1,0],[2,0],[3,1],[3,2]]. after[0] = [1,2], after[1] = [3], after[2] = [3]. indeg = [0,1,1,2]. Queue = [0]. Pop 0, order = [0]; indeg[1] becomes 0 and indeg[2] becomes 0, both queued. Pop 1, order = [0,1]; indeg[3] becomes 1. Pop 2, order = [0,1,2]; indeg[3] becomes 0, queued. Pop 3, order = [0,1,2,3]. The queue is empty and len(order) = 4 = n, so return it. For the cycle [[1,0],[0,1]], both in-degrees are 1, the queue starts empty, the order stays empty with length 0 < 2, so return [].",
    "tests": "def valid(order, n, prereqs):\n    if sorted(order) != list(range(n)):\n        return False\n    pos = {x: i for i, x in enumerate(order)}\n    return all(pos[b] < pos[a] for a, b in prereqs)\n\nassert valid(build_order(2, [[1,0]]), 2, [[1,0]])\nassert build_order(2, [[1,0]]) == [0, 1]\np = [[1,0],[2,0],[3,1],[3,2]]\nassert valid(build_order(4, p), 4, p)\nassert build_order(2, [[1,0],[0,1]]) == []          # two-task cycle\nassert build_order(1, [[0,0]]) == []                # self-loop\nassert build_order(1, []) == [0]\nassert build_order(0, []) == []\nassert sorted(build_order(3, [])) == [0, 1, 2]      # no prerequisites\np = [[1,0],[2,1],[0,2],[3,3]]\nassert build_order(4, p) == []\np = [[1,0],[1,0],[2,1]]                              # repeated edge counted twice and released twice\nassert build_order(3, p) == [0, 1, 2]\np = [[1,0],[2,1],[3,2],[1,3]]                        # cycle hanging off a good start\nassert build_order(4, p) == []\nprint(\"all good\")\n",
    "followups": [
      {
        "q": "Do it with DFS and three colours. Show the code and compare it with Kahn's.",
        "a": "Colour each service white (unseen), grey (on the current DFS path) or black (finished). Reaching a grey service means we looped back to our own path: a cycle. A service is appended when it finishes, after everything that waits on it, so the reverse of the finish list is a valid order.\n```python\ndef build_order_dfs(n, prereqs):\n    after = [[] for _ in range(n)]\n    for a, b in prereqs:\n        after[b].append(a)\n    WHITE, GREY, BLACK = 0, 1, 2              # unseen, on the current path, finished\n    color = [WHITE] * n\n    out = []\n    def visit(u):\n        color[u] = GREY\n        for v in after[u]:\n            if color[v] == GREY:              # back edge: v is on our own path, a cycle\n                return False\n            if color[v] == WHITE and not visit(v):\n                return False\n        color[u] = BLACK\n        out.append(u)                         # appended after everything that waits on it\n        return True\n    for i in range(n):\n        if color[i] == WHITE and not visit(i):\n            return []\n    return out[::-1]                          # reverse finish order is a valid build order\n```\nComparison: both are O(V + E). Kahn's is iterative, has no recursion depth problem, and detects a cycle with a simple count. It also lets you process in waves, useful for parallel deploys. The DFS version is short and is the base for other things (strongly connected components, finding the actual cycle), but it recurses to depth V, so a long chain of 100,000 services needs an explicit stack in Python."
      },
      {
        "q": "How do you return the services in each wave that could deploy in parallel?",
        "a": "Process the queue level by level, as in a BFS: take everything currently in the queue as one wave, then release their dependents into the next. The number of waves is the length of the longest dependency chain."
      },
      {
        "q": "How would you report the cycle, not only fail?",
        "a": "After Kahn's finishes, the services still with in-degree above 0 contain every cycle plus things that depend on one. To pull out one actual cycle, run the DFS version on that leftover set and follow the grey back edge, then walk the parent chain from the service where it was found."
      }
    ],
    "reveal": {
      "lc": "LeetCode 210 Course Schedule II (medium)",
      "topic": "Topological sort with in-degrees (Kahn's algorithm)",
      "pattern": "graphs"
    }
  },
  {
    "id": "d16-d",
    "minutes": 40,
    "title": "Best freelance payout",
    "scenario": "A freelancer sees a list of gigs. Gig `i` starts at `start[i]`, ends at `end[i]` and pays `pay[i]`. They can only do one gig at a time, but a gig that ends at time `t` can be followed by one that starts at time `t`. Return the largest total pay they can earn.",
    "examples": [
      {
        "input": "start = [1,2,3,3], end = [3,4,5,6], pay = [50,10,40,70]",
        "output": "120",
        "note": "Take the first gig (1 to 3, pay 50) and the last (3 to 6, pay 70)."
      },
      {
        "input": "start = [1,2,3,4,6], end = [3,5,10,6,9], pay = [20,20,100,70,60]",
        "output": "150",
        "note": "Take gigs 1, 4 and 5: 20 + 70 + 60."
      },
      {
        "input": "start = [1,1,1], end = [2,3,4], pay = [5,6,4]",
        "output": "6",
        "note": "All three overlap, so take the best single one."
      }
    ],
    "constraints": [
      "0 <= number of gigs <= 50,000",
      "1 <= start[i] < end[i] <= 10^9",
      "1 <= pay[i] <= 10,000",
      "gigs touching at an endpoint do not overlap",
      "the three lists have the same length"
    ],
    "clarify": [
      {
        "q": "Can two gigs touch, one ending exactly when the next starts?",
        "a": "Yes. End time t and start time t are compatible."
      },
      {
        "q": "Do I need to say which gigs I picked?",
        "a": "Only the total. A follow-up asks for the gigs."
      },
      {
        "q": "Is the input sorted?",
        "a": "No, in any order."
      },
      {
        "q": "Can the list be empty?",
        "a": "Yes, and the answer is 0."
      }
    ],
    "starter": "def best_payout(start, end, pay):\n    ...\n",
    "hints": [
      "Think about the last gig in a good plan. Either you take it or you do not. What does each choice leave you with? Does sorting the gigs help you describe that?",
      "Sort by end time. Let `best[i]` be the top pay using only the first `i` gigs in that order. For gig `i`, either skip it (`best[i]`) or take it, and then add `best[k]` where `k` is how many earlier gigs end at or before its start.",
      "The count `k` comes from a binary search over the sorted end times, restricted to the first `i` gigs: find the first position whose end is greater than this gig's start. Write the loop by hand with `lo = 0`, `hi = i`. Then `best[i + 1] = max(best[i], best[k] + pay)`."
    ],
    "solution": "def best_payout(start, end, pay):\n    n = len(start)\n    jobs = sorted(zip(end, start, pay))       # sort by end time\n    ends = [j[0] for j in jobs]\n    best = [0] * (n + 1)                      # best[i] = top payout using only the first i jobs\n    for i in range(n):\n        e, s, p = jobs[i]\n        lo, hi = 0, i                         # count earlier jobs that end at or before s\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if ends[mid] <= s:\n                lo = mid + 1                  # mid fits, look right for more\n            else:\n                hi = mid\n        best[i + 1] = max(best[i], best[lo] + p)    # skip this job, or take it after the last fit\n    return best[n]\n",
    "complexity": "O(n log n) time: the sort, plus n binary searches of O(log n) each. O(n) space for the sorted list and the table.",
    "explain": [
      "Brute force: try every subset of gigs, keep those with no overlap, take the best total. That is O(2^n * n). Not usable beyond about 20 gigs.",
      "Recursion: sort by end time and define f(i) as the best pay from the first i gigs. Either skip gig i (f(i - 1)) or take it, which leaves the gigs that end by its start time: pay + f(k). Written directly, the recursion branches twice per call and repeats work, so it is exponential.",
      "Memo: f only depends on i, so there are only n distinct states. Cache each result and the cost is n states times the cost of finding k.",
      "Bottom-up: fill `best[0..n]` left to right. `best[0] = 0` (no gigs, no pay). Each entry only needs earlier entries, so a plain array replaces the call stack and removes the recursion depth limit at 50,000 gigs.",
      "Finding k is the only non-constant step. The end times are sorted, so a binary search gives k in O(log n): the first index in `[0, i)` whose end is greater than this gig's start. Use `<=` on the end time so touching gigs count as compatible.",
      "Total cost: sorting O(n log n) plus n searches of O(log n) is O(n log n). Sorting by end makes the prefix `best[0..k]` meaningful: every gig in it has ended by this gig's start."
    ],
    "dryrun": "start = [1,2,3,3], end = [3,4,5,6], pay = [50,10,40,70]. Sorted by end: (3,1,50), (4,2,10), (5,3,40), (6,3,70). ends = [3,4,5,6]. best = [0,0,0,0,0]. i = 0, start 1: search in [0,0) gives 0; best[1] = max(0, best[0] + 50) = 50. i = 1, start 2: search in [0,1): ends[0] = 3 > 2, so k = 0; best[2] = max(50, 0 + 10) = 50. i = 2, start 3: search in [0,2): ends[1] = 4 > 3 so hi moves to 1; ends[0] = 3 <= 3 so lo moves to 1; k = 1; best[3] = max(50, best[1] + 40) = 90. i = 3, start 3: same k = 1; best[4] = max(90, best[1] + 70) = 120. Return 120.",
    "tests": "assert best_payout([1,2,3,3],[3,4,5,6],[50,10,40,70]) == 120\nassert best_payout([1,2,3,4,6],[3,5,10,6,9],[20,20,100,70,60]) == 150\nassert best_payout([1,1,1],[2,3,4],[5,6,4]) == 6          # all overlap fully: take the best one\nassert best_payout([], [], []) == 0\nassert best_payout([1],[2],[7]) == 7\nassert best_payout([1,2],[2,3],[5,6]) == 11               # touching at 2 is allowed\nassert best_payout([1,1,1],[5,5,5],[3,9,4]) == 9\nassert best_payout([1,3,5],[3,5,7],[1,1,1]) == 3          # a chain of touching jobs\nassert best_payout([1,2],[10,3],[100,1]) == 100           # one long job beats a short one\nassert best_payout([1,2,4],[3,5,6],[10,100,10]) == 100    # one big job beats the two small ones around it\nimport random\nrandom.seed(7)\ndef brute(s, e, p):\n    best = 0\n    n = len(s)\n    for mask in range(1 << n):\n        pick = sorted((s[i], e[i], p[i]) for i in range(n) if mask >> i & 1)\n        if all(pick[k][1] <= pick[k+1][0] for k in range(len(pick) - 1)):\n            best = max(best, sum(x[2] for x in pick))\n    return best\nfor _ in range(200):\n    n = random.randint(0, 8)\n    s = [random.randint(1, 10) for _ in range(n)]\n    e = [x + random.randint(1, 6) for x in s]\n    p = [random.randint(1, 20) for _ in range(n)]\n    assert best_payout(s, e, p) == brute(s, e, p)\nprint(\"all good\")\n",
    "followups": [
      {
        "q": "In real code, what would you use instead of the hand-written binary search?",
        "a": "`bisect_right(ends, s, 0, i)` from the standard library, which returns the number of earlier gigs whose end is at most `s`. It is the same loop, tested and in C. Writing it by hand in the interview shows you can get the boundary right, which is where most bugs are.\n```python\nfrom bisect import bisect_right\n\ndef best_payout_bisect(start, end, pay):\n    jobs = sorted(zip(end, start, pay))\n    ends = [j[0] for j in jobs]\n    best = [0] * (len(jobs) + 1)\n    for i, (e, s, p) in enumerate(jobs):\n        k = bisect_right(ends, s, 0, i)       # same count as the hand-written loop\n        best[i + 1] = max(best[i], best[k] + p)\n    return best[-1]\n```"
      },
      {
        "q": "Return which gigs were chosen, not only the total.",
        "a": "Remember, for each gig, how many gigs fit before it and whether taking it improved the answer. Then walk back from the end: if the last gig was taken, record it and jump to its prefix; otherwise step back one.\n```python\ndef best_jobs(start, end, pay):\n    n = len(start)\n    jobs = sorted(zip(end, start, pay))\n    ends = [j[0] for j in jobs]\n    best = [0] * (n + 1)\n    prev = [0] * n                            # prev[i] = how many jobs fit before job i\n    take = [False] * n\n    for i in range(n):\n        e, s, p = jobs[i]\n        lo, hi = 0, i\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if ends[mid] <= s:\n                lo = mid + 1\n            else:\n                hi = mid\n        prev[i] = lo\n        if best[lo] + p > best[i]:\n            best[i + 1] = best[lo] + p\n            take[i] = True\n        else:\n            best[i + 1] = best[i]\n    chosen = []\n    i = n\n    while i > 0:                              # walk back: jump over the prefix a taken job allows\n        if take[i - 1]:\n            chosen.append(jobs[i - 1])\n            i = prev[i - 1]\n        else:\n            i -= 1\n    return best[n], chosen[::-1]\n```"
      },
      {
        "q": "Why does the binary search need `<=` and not `<`?",
        "a": "A gig ending at time t may be followed by one starting at t. With `<`, the search would treat the touching gig as overlapping and miss pay. The test with gigs 1 to 2 and 2 to 3 checks it."
      },
      {
        "q": "Why sort by end time, not start time?",
        "a": "With gigs sorted by end, the gigs that finish before a given start form a prefix of the list, which is exactly what a binary search and a prefix table need. Sorted by start, the compatible earlier gigs are not a prefix."
      }
    ],
    "reveal": {
      "lc": "LeetCode 1235 Maximum Profit in Job Scheduling (hard)",
      "topic": "Weighted interval scheduling: sort by end, DP with binary search",
      "pattern": "dp"
    }
  }
] });
