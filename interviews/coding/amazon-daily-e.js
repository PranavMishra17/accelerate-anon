/* Amazon loop: the daily two, extra day (swap-ins), part 2. Every solution and test was run with Python 3.12. */
(function () {
  var day = (window.LOOP_DAILY && window.LOOP_DAILY.days.filter(function (d) { return d.n === 17; })[0]);
  if (!day) { return; }
  day.problems.push(
{
  "id": "d17-f",
  "minutes": 25,
  "title": "Longest clean scan streak",
  "scenario": "A fulfillment line scans each package as it passes, producing a list where `1` means the scan was good and `0` means it failed. Operations can manually re-scan at most `k` of the failed packages and turn them into good ones. Given the scan list and `k`, return the length of the longest unbroken run of good scans you can get.",
  "examples": [
    {
      "input": "flags = [1,1,1,0,0,0,1,1,1,1,0], k = 2",
      "output": "6",
      "note": "Re-scan the zeros at positions 4 and 5 (0-indexed) and positions 4 to 9 are all good."
    },
    {
      "input": "flags = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3",
      "output": "10",
      "note": "Re-scan three zeros inside positions 3 to 12 and ten in a row are good."
    },
    {
      "input": "flags = [1,1,1], k = 0",
      "output": "3",
      "note": "Nothing to repair; the whole list is already good."
    }
  ],
  "constraints": [
    "0 <= len(flags) <= 100000",
    "flags[i] is 0 or 1",
    "0 <= k <= len(flags)",
    "an empty list gives 0"
  ],
  "clarify": [
    {
      "q": "Do the re-scans change the list for later queries?",
      "a": "No. Think of it as a what-if: the answer is the best run you could get, and the input stays as it is."
    },
    {
      "q": "Do I have to use all k re-scans?",
      "a": "No. At most k."
    },
    {
      "q": "Can k be larger than the number of zeros?",
      "a": "Yes. Then the answer is the whole list length."
    },
    {
      "q": "Is the run contiguous?",
      "a": "Yes. Good scans must sit side by side."
    }
  ],
  "starter": "def longest_run(flags: list[int], k: int) -> int:\n    ...\n",
  "hints": [
    "Any run you pick contains some zeros. What makes a run allowed, in terms of how many zeros it holds?",
    "Grow a window to the right one scan at a time and count the zeros inside it. When the count goes above k, the window is not allowed, so move its left edge forward.",
    "Keep `left`, `zeros` and `best`. For each `right`: if `flags[right]` is 0 add one to `zeros`. While `zeros > k`, if `flags[left]` is 0 subtract one, then `left += 1`. Then `best = max(best, right - left + 1)`."
  ],
  "solution": "def longest_run(flags: list[int], k: int) -> int:\n    best = left = zeros = 0\n    for right, f in enumerate(flags):\n        if f == 0:\n            zeros += 1                  # a broken scan entered the window\n        while zeros > k:                # too many repairs: shrink from the left\n            if flags[left] == 0:\n                zeros -= 1\n            left += 1\n        best = max(best, right - left + 1)\n    return best\n",
  "complexity": "O(n) time, O(1) space: each index enters the window once and leaves it at most once.",
  "explain": [
    "Brute force: try every start, extend right until you pass k zeros, record the length. That is O(n^2).",
    "The waste: when start moves one step right, the earlier work is thrown away although most of the window is still valid.",
    "Keep one window that never contains more than k zeros. Expand the right edge always; shrink the left edge only when the zero count goes over k.",
    "Both edges only move forward, so the total work is O(n). The answer is the largest window size seen."
  ],
  "dryrun": "flags = [1,0,0,1,1], k = 1. right=0: flag 1, window is index 0 only, best 1. right=1: flag 0, zeros 1, window size 2, best 2. right=2: flag 0, zeros 2 > 1, so move left: flags[0] is 1, left=1; flags[1] is 0, zeros 1, left=2. Window is index 2 only, size 1. right=3: flag 1, window 2 to 3, size 2. right=4: flag 1, window 2 to 4, size 3, best 3. Return 3.",
  "tests": "assert longest_run([1,1,1,0,0,0,1,1,1,1,0], 2) == 6\nassert longest_run([0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 3) == 10\nassert longest_run([], 1) == 0\nassert longest_run([0,0,0], 0) == 0\nassert longest_run([0,0,0], 2) == 2\nassert longest_run([1,1,1], 0) == 3\nassert longest_run([0], 1) == 1\nassert longest_run([1,0,1,0,1], 5) == 5\nassert longest_run([1,0,0,1,1], 1) == 3\nprint(\"all good\")\n",
  "followups": [
    {
      "q": "Return the indices of the zeros you would re-scan, not just the length.",
      "a": "Remember where the best window starts, then list the zeros inside it.\n\n```python\ndef repaired_positions(flags, k):\n    best, best_l, left, zeros = 0, 0, 0, 0\n    for right, f in enumerate(flags):\n        if f == 0:\n            zeros += 1\n        while zeros > k:\n            if flags[left] == 0:\n                zeros -= 1\n            left += 1\n        if right - left + 1 > best:\n            best, best_l = right - left + 1, left     # remember where the best window starts\n    return [i for i in range(best_l, best_l + best) if flags[i] == 0]\n```\nSame O(n) pass; the final list scan is O(window)."
    },
    {
      "q": "The scans arrive as a stream and you cannot store them all. What changes?",
      "a": "The window is needed only to know which flag leaves on the left. Keep a deque of the positions of zeros in the window (at most k+1). When it holds k+1, the left edge jumps to just after the oldest zero. Memory is O(k)."
    },
    {
      "q": "Why does the window shrink with `while` and not `if`?",
      "a": "One new zero can push the count over k, and the left edge may have to pass many good scans before it passes a zero. A single step is not enough, so loop until the window is allowed again."
    }
  ],
  "reveal": {
    "lc": "LeetCode 1004 Max Consecutive Ones III (medium)",
    "topic": "Sliding window with at most k bad items",
    "pattern": "pointers"
  }
},
{
  "id": "d17-g",
  "minutes": 25,
  "title": "One van, many drops",
  "scenario": "A delivery van drives one straight road with numbered stops, starting at stop 0 and never turning back. Each booking is `[packages, pickup_stop, dropoff_stop]`: that many packages ride from the pickup to the dropoff. Packages leave the van at the drop-off stop before new ones board there. The van holds at most `capacity` packages at once. Return `True` if it can carry every booking, otherwise `False`.",
  "examples": [
    {
      "input": "trips = [[2,1,5],[3,3,7]], capacity = 4",
      "output": "False",
      "note": "Between stops 3 and 5 the van holds 2 + 3 = 5 packages."
    },
    {
      "input": "trips = [[2,1,5],[3,3,7]], capacity = 5",
      "output": "True",
      "note": "The peak load is 5, which fits."
    },
    {
      "input": "trips = [[2,1,5],[3,5,7]], capacity = 3",
      "output": "True",
      "note": "The first booking leaves at stop 5, just as the second boards."
    }
  ],
  "constraints": [
    "0 <= len(trips) <= 1000",
    "1 <= packages <= 100",
    "0 <= pickup < dropoff <= 1000",
    "1 <= capacity <= 100000"
  ],
  "clarify": [
    {
      "q": "If one booking ends at stop 5 and another starts at stop 5, do they overlap?",
      "a": "No. Drop-offs happen before pickups at the same stop."
    },
    {
      "q": "Can bookings be in any order?",
      "a": "Yes."
    },
    {
      "q": "Can the van go back?",
      "a": "No. Stops only increase."
    },
    {
      "q": "Is the empty list valid?",
      "a": "Yes, return True."
    }
  ],
  "starter": "def can_deliver(trips: list[list[int]], capacity: int) -> bool:\n    ...\n",
  "hints": [
    "Only the load at each stop matters. What is the van's load between two neighbouring stops?",
    "Instead of adding a booking's load to every stop it spans, record only the change: plus at the pickup, minus at the dropoff. A running total of the changes gives the load.",
    "Make an array `delta` sized to the largest dropoff + 1. For each booking add its packages at `delta[pickup]` and subtract at `delta[dropoff]`. Walk the array with a running sum; if it ever exceeds capacity, return False."
  ],
  "solution": "def can_deliver(trips: list[list[int]], capacity: int) -> bool:\n    if not trips:\n        return True\n    delta = [0] * (max(t[2] for t in trips) + 1)\n    for load, start, end in trips:\n        delta[start] += load            # packages get on at start\n        delta[end] -= load              # and get off at end (end is free to reuse)\n    cur = 0\n    for d in delta:\n        cur += d                        # running sum = load at this stop\n        if cur > capacity:\n            return False\n    return True\n",
  "complexity": "O(n + m) time, O(m) space, where n is the number of bookings and m the highest stop number.",
  "explain": [
    "Brute force: for each booking add its load to every stop it covers, then take the max. That is O(n * m).",
    "Difference array: store only the change in load at each stop. A prefix sum turns changes back into loads, in one pass over the stops.",
    "The dropoff is subtracted at its own stop, so the load there is already without those packages. That is why a drop and a pickup at the same stop do not clash.",
    "Sorted-events version: make a list of (stop, change) pairs, sort it, and keep a running sum. Negative changes sort before positive ones at the same stop, so drops happen first. This is the TreeMap approach, O(n log n), and it is better when stop numbers are huge or sparse."
  ],
  "dryrun": "trips = [[2,1,5],[3,3,7]], capacity 4. delta[1]=+2, delta[5]=-2, delta[3]=+3, delta[7]=-3. Running sum by stop: 0:0, 1:2, 2:2, 3:5. 5 > 4, so return False.",
  "tests": "assert can_deliver([[2,1,5],[3,3,7]], 4) is False\nassert can_deliver([[2,1,5],[3,3,7]], 5) is True\nassert can_deliver([[2,1,5],[3,5,7]], 3) is True\nassert can_deliver([], 1) is True\nassert can_deliver([[3,0,1000]], 3) is True\nassert can_deliver([[3,0,1000]], 2) is False\nassert can_deliver([[1,0,2],[1,1,3],[1,2,4]], 2) is True\nassert can_deliver([[1,0,3],[1,1,3],[1,2,3]], 2) is False\nassert can_deliver([[5,2,3],[5,3,4]], 5) is True\nprint(\"all good\")\n",
  "followups": [
    {
      "q": "Stops are GPS timestamps up to 10^9. The array is too big. What now?",
      "a": "Use the sorted-events version, which depends on the number of bookings and not on the stop numbers.\n\n```python\ndef can_deliver_events(trips, capacity):\n    events = []\n    for load, start, end in trips:\n        events.append((start, load))\n        events.append((end, -load))\n    events.sort()                       # at equal stops, drops (negative) sort first\n    cur = 0\n    for _, d in events:\n        cur += d\n        if cur > capacity:\n            return False\n    return True\n```\nSorting the tuples puts a drop (negative) before a pickup at the same stop. O(n log n) time, O(n) space. In Java use a TreeMap from stop to change and iterate its values."
    },
    {
      "q": "This runs in a database: bookings live in a table and arrive concurrently. How do you design it?",
      "a": "Store one row per trip: `trip_id`, `van_id`, `packages`, `pickup`, `dropoff`. A new booking is valid if, for every segment it covers, current load + packages <= capacity. Query the load per segment with a range query on pickup < new_dropoff and dropoff > new_pickup, grouped by the breakpoints, or keep a `segment_load(van_id, stop, load)` table and update the covered rows. Concurrency: two requests can both see room and both insert. Do the check and insert in one transaction that locks the van's row (SELECT ... FOR UPDATE) or use serializable isolation with retry. At large scale, partition by van so the lock is narrow."
    },
    {
      "q": "Return the stop where the van is fullest, too.",
      "a": "Track the max of the running sum and the stop where it was reached while walking the `delta` array. It is the same pass."
    }
  ],
  "reveal": {
    "lc": "LeetCode 1094 Car Pooling (medium)",
    "topic": "Difference array (or sorted events) for peak overlap",
    "pattern": "intervals"
  }
},
{
  "id": "d17-h",
  "minutes": 25,
  "title": "Shared manager, if both exist",
  "scenario": "A company's reporting lines form a tree: each employee has at most two direct reports, a left one and a right one, and every employee has a distinct numeric id. Given the root and two ids `p` and `q`, return the id of their closest shared manager: the lowest employee who has both of them somewhere beneath (or is one of them). Either id may not be in the company at all. If either one is missing, return `None`.",
  "examples": [
    {
      "input": "root = [3,5,1,6,2,0,8,None,None,7,4], p = 5, q = 1",
      "output": "3",
      "note": "5 is under the left report and 1 under the right report, so the root is the first shared manager."
    },
    {
      "input": "root = [3,5,1,6,2,0,8,None,None,7,4], p = 5, q = 4",
      "output": "5",
      "note": "4 sits under 5, and an employee counts as their own manager."
    },
    {
      "input": "root = [3,5,1,6,2,0,8,None,None,7,4], p = 5, q = 10",
      "output": "None",
      "note": "Nobody has id 10."
    }
  ],
  "constraints": [
    "0 <= employees <= 10000",
    "ids are distinct",
    "p and q may or may not be present",
    "the starter has a TreeNode class and a `build` helper (level order, None for a missing child)"
  ],
  "clarify": [
    {
      "q": "Can p equal q?",
      "a": "Treat p and q as different ids. If they were equal, a single present node would count as only one match, so return None."
    },
    {
      "q": "Is a node its own manager?",
      "a": "Yes: if p is above q, the answer is p."
    },
    {
      "q": "Is the tree a search tree?",
      "a": "No, ids are in no order, so you cannot choose a side by comparing values."
    },
    {
      "q": "What if the tree is empty?",
      "a": "Return None."
    }
  ],
  "starter": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\ndef shared_manager(root: TreeNode, p: int, q: int):\n    ...\n",
  "hints": [
    "In the version where both ids exist, a post-order walk returns a node when it finds p or q or when both sides report a find. What goes wrong if one id is missing?",
    "If q is missing but p exists, the usual walk returns p and you cannot tell whether q was below it. You need a separate count of how many of p and q were actually seen.",
    "Walk both children before looking at the current node, so nothing is skipped. Add one to a counter whenever a node matches p or q. Return the candidate as usual, and at the end return its id only if the counter is 2."
  ],
  "solution": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\ndef shared_manager(root: TreeNode, p: int, q: int):\n    found = 0                           # how many of p and q exist in the tree\n\n    def walk(node):\n        nonlocal found\n        if node is None:\n            return None\n        left = walk(node.left)          # visit children first, so every node is seen\n        right = walk(node.right)\n        if node.val == p or node.val == q:\n            found += 1                  # count it; this node is a candidate\n            return node\n        if left and right:\n            return node                 # p and q sit in different subtrees\n        return left or right\n\n    ans = walk(root)\n    return ans.val if found == 2 and ans else None\n",
  "complexity": "O(n) time, O(h) space for the recursion, where h is the tree height.",
  "explain": [
    "Brute force: find the path from the root to p and to q, and if both exist, compare the paths to find the last shared node. O(n) time but two passes and two path lists.",
    "One pass is enough. Post-order: ask the left subtree and the right subtree what they found, then decide about the current node.",
    "A node is the answer candidate if it is p or q, or if p and q were found one in each subtree.",
    "The classic version returns early when it matches p, so it never looks below it. Here that is wrong, because q might be missing below p. So always walk both children first, and count matches.",
    "At the end, if the count is not 2, one id is absent and the answer is None."
  ],
  "dryrun": "Tree [3,5,1,6,2,0,8,None,None,7,4], p=5, q=10. Walk 6: no match, nothing returned. Walk 7, 4, then 2: no match. At 5: it matches p, found=1, return node 5. Walk 0, 8, then 1: no match, nothing. At 3: left returns 5, right returns None, 3 is not p or q, so return left (5). ans is node 5 but found is 1, so return None.",
  "tests": "assert shared_manager(build([3,5,1,6,2,0,8,None,None,7,4]), 5, 1) == 3\nassert shared_manager(build([3,5,1,6,2,0,8,None,None,7,4]), 5, 4) == 5\nassert shared_manager(build([3,5,1,6,2,0,8,None,None,7,4]), 5, 10) is None\nassert shared_manager(build([3,5,1,6,2,0,8,None,None,7,4]), 10, 11) is None\nassert shared_manager(build([1]), 1, 1) is None\nassert shared_manager(build([1, 2]), 1, 2) == 1\nassert shared_manager(build([1, 2]), 2, 2) is None\nassert shared_manager(build([]), 1, 2) is None\nassert shared_manager(build([1, 2, None, 3]), 3, 2) == 2\nassert shared_manager(build([1, 2, 3]), 2, 3) == 1\nprint(\"all good\")\n",
  "followups": [
    {
      "q": "You are given parent pointers instead. How does it change?",
      "a": "Climb from p to the root recording the ancestors in a set, then climb from q until you hit one in the set. If the climb from q reaches the top, the nodes are not linked. Existence still needs a separate lookup, e.g. a map from id to node built once."
    },
    {
      "q": "The same tree answers a million queries. What do you do?",
      "a": "Preprocess: an Euler tour plus a sparse table for range-minimum depth gives O(1) per query after O(n log n) setup, or binary lifting gives O(log n). A hash map from id to node answers the existence check in O(1)."
    },
    {
      "q": "Why not return early when you match p, as in the usual version?",
      "a": "Because you would never count q if it lies below p. The early return is only safe when you already know both nodes exist."
    }
  ],
  "reveal": {
    "lc": "LeetCode 1644 Lowest Common Ancestor of a Binary Tree II (medium)",
    "topic": "Post-order pass with a found-counter",
    "pattern": "trees"
  }
},
{
  "id": "d17-i",
  "minutes": 25,
  "title": "Currency conversion table",
  "scenario": "A marketplace lists a few exchange rates between currency codes, each given as a pair `[a, b]` with a value `v` meaning one unit of `a` is worth `v` units of `b`. Customers then ask for conversions between any two codes. Answer each query `[x, y]` with how many units of `y` one unit of `x` buys, using the listed rates (in either direction, and chained through other currencies). If a code was never listed, or no chain of rates connects the two, answer `-1.0`.",
  "examples": [
    {
      "input": "rates = [[a,b],[b,c]], values = [2.0, 3.0], queries = [[a,c],[b,a],[a,e],[a,a],[x,x]]",
      "output": "[6.0, 0.5, -1.0, 1.0, -1.0]",
      "note": "a to c is 2 * 3. b to a is the inverse of 2. e and x were never listed, so those answers are -1.0, even for x to x."
    },
    {
      "input": "rates = [[a,b],[b,c],[bc,cd]], values = [1.5, 2.5, 5.0], queries = [[a,c],[c,b],[bc,cd],[cd,bc]]",
      "output": "[3.75, 0.4, 5.0, 0.2]",
      "note": "Two separate groups of currencies; queries stay inside a group."
    },
    {
      "input": "rates = [[a,b]], values = [0.5], queries = [[a,b],[b,a],[a,c],[c,c]]",
      "output": "[0.5, 2.0, -1.0, -1.0]",
      "note": "c is unknown."
    }
  ],
  "constraints": [
    "0 <= len(rates) <= 20",
    "values are positive and never zero",
    "no contradictions among the rates",
    "answers within 1e-5 count as correct",
    "codes are short lowercase strings"
  ],
  "clarify": [
    {
      "q": "Can I use a rate in reverse?",
      "a": "Yes. If a is worth 2 b, then b is worth 1/2 a."
    },
    {
      "q": "What is x to x for a listed code?",
      "a": "1.0."
    },
    {
      "q": "What is x to x for an unlisted code?",
      "a": "-1.0."
    },
    {
      "q": "Can the rates contradict each other?",
      "a": "No, assume they are consistent."
    }
  ],
  "starter": "def convert(rates: list[list], values: list[float], queries: list[list]) -> list[float]:\n    ...\n",
  "hints": [
    "Think of each currency as a point and each rate as a link between two points. What does a query ask about the points?",
    "Build a graph where a -> b has weight v and b -> a has weight 1/v. A conversion is a path, and its value is the product of the weights on it.",
    "For each query, check both codes exist, then run a BFS from the source carrying the product so far. When you reach the destination return the product; if the queue empties return -1.0. Use a visited set."
  ],
  "solution": "from collections import deque\n\ndef convert(rates: list[list], values: list[float], queries: list[list]) -> list[float]:\n    graph = {}\n    for (a, b), v in zip(rates, values):\n        graph.setdefault(a, []).append((b, v))        # a -> b costs v\n        graph.setdefault(b, []).append((a, 1 / v))    # b -> a is the inverse\n\n    def solve(src, dst):\n        if src not in graph or dst not in graph:\n            return -1.0                               # unknown currency\n        seen, q = {src}, deque([(src, 1.0)])\n        while q:\n            cur, acc = q.popleft()\n            if cur == dst:\n                return acc\n            for nxt, w in graph[cur]:\n                if nxt not in seen:\n                    seen.add(nxt)\n                    q.append((nxt, acc * w))          # multiply rates along the path\n        return -1.0                                   # disconnected\n\n    return [solve(s, d) for s, d in queries]\n",
  "complexity": "O(q * (v + e)) time for q queries on a graph with v currencies and e rates; O(v + e) space.",
  "explain": [
    "Brute force idea: for each query try every chain of rates by recursion. That repeats work, and without a visited set it can loop forever.",
    "Model it as a graph. Each rate adds two directed edges: the rate and its inverse. The answer to a query is the product of edge weights along any path, since the rates are consistent.",
    "A BFS or DFS per query with a visited set finds a path if one exists. Each search is O(v + e).",
    "Unknown codes and disconnected groups both give -1.0; check unknown codes first, because the x to x case should also be -1.0 when x is unlisted.",
    "If there are many queries, preprocess with weighted union-find or Floyd-Warshall (follow-up)."
  ],
  "dryrun": "rates a->b = 2, b->c = 3. Graph: a: [(b,2)], b: [(a,0.5),(c,3)], c: [(b,1/3)]. Query a to c: queue [(a,1)]. Pop a: add (b,2). Pop b with 2: add (c,6), skip a. Pop c with 6: it is the destination, return 6.0.",
  "tests": "def close(a, b):\n    return len(a) == len(b) and all(abs(x - y) < 1e-5 for x, y in zip(a, b))\n\nassert close(convert([[\"a\",\"b\"],[\"b\",\"c\"]], [2.0, 3.0], [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]), [6.0, 0.5, -1.0, 1.0, -1.0])\nassert close(convert([[\"a\",\"b\"],[\"b\",\"c\"],[\"bc\",\"cd\"]], [1.5, 2.5, 5.0], [[\"a\",\"c\"],[\"c\",\"b\"],[\"bc\",\"cd\"],[\"cd\",\"bc\"]]), [3.75, 0.4, 5.0, 0.2])\nassert close(convert([[\"a\",\"b\"]], [0.5], [[\"a\",\"b\"],[\"b\",\"a\"],[\"a\",\"c\"],[\"c\",\"c\"]]), [0.5, 2.0, -1.0, -1.0])\nassert close(convert([], [], [[\"a\",\"a\"]]), [-1.0])\nassert close(convert([[\"a\",\"b\"],[\"c\",\"d\"]], [2.0, 3.0], [[\"a\",\"d\"]]), [-1.0])\nassert close(convert([[\"a\",\"b\"],[\"b\",\"c\"],[\"c\",\"d\"]], [2.0, 2.0, 2.0], [[\"a\",\"d\"],[\"d\",\"a\"]]), [8.0, 0.125])\nprint(\"all good\")\n",
  "followups": [
    {
      "q": "There are a million queries and few rates. How do you avoid a search per query?",
      "a": "Weighted union-find: each node stores its ratio to its parent, and path compression folds ratios along the way. Each query is then near O(1).\n\n```python\ndef convert_uf(rates, values, queries):\n    parent, ratio = {}, {}                  # ratio[x] = value of x / value of parent[x]\n\n    def find(x):\n        if parent[x] != x:\n            root = find(parent[x])\n            ratio[x] *= ratio[parent[x]]    # parent[x] now points at root; fold its ratio in\n            parent[x] = root\n        return parent[x]\n\n    for (a, b), v in zip(rates, values):\n        for n in (a, b):\n            if n not in parent:\n                parent[n], ratio[n] = n, 1.0\n        ra, rb = find(a), find(b)\n        if ra != rb:\n            parent[ra] = rb                 # hang a's root under b's root\n            ratio[ra] = v * ratio[b] / ratio[a]\n\n    out = []\n    for s, d in queries:\n        if s not in parent or d not in parent or find(s) != find(d):\n            out.append(-1.0)\n        else:\n            out.append(ratio[s] / ratio[d])\n    return out\n```\nTwo codes are convertible exactly when they share a root, and the answer is `ratio[x] / ratio[y]`."
    },
    {
      "q": "What if the rates can contradict (an arbitrage cycle)?",
      "a": "Then the product around a cycle is not 1. Taking the logarithm turns products into sums, so a cycle with total log weight greater than 0 is found by Bellman-Ford looking for a positive cycle. Plain BFS would return the first path it finds and hide the contradiction."
    },
    {
      "q": "Why use a visited set at all?",
      "a": "Every edge has an inverse, so a-b-a-b loops forever without one."
    }
  ],
  "reveal": {
    "lc": "LeetCode 399 Evaluate Division (medium)",
    "topic": "Weighted graph search; product of edge weights",
    "pattern": "graphs"
  }
}
  );
})();
