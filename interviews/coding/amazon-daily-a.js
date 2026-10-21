/* Amazon loop: the daily two, days 1 to 8. Every solution and test was run with Python 3.12. */
window.LOOP_DAILY = window.LOOP_DAILY || { days: [] };
window.LOOP_DAILY.days.push({
 "date": "2026-10-22",
 "n": 1,
 "problems": [
  {
   "id": "d01-a",
   "minutes": 15,
   "title": "Stocked zones",
   "scenario": "A fulfillment center is mapped as a grid. Each cell is a character: \"1\" means the floor cell holds stocked bins and \"0\" means it is empty. A zone is a group of stocked cells that touch each other up, down, left or right (touching at a corner does not count). Safety wants to know how many separate zones exist. Given the grid as a list of strings, return the number of zones.",
   "examples": [
    {
     "input": "[\"11000\", \"11000\", \"00100\", \"00011\"]",
     "output": "3",
     "note": "The top-left block, the single middle cell and the bottom-right pair are three separate zones."
    },
    {
     "input": "[\"111\", \"010\", \"111\"]",
     "output": "1",
     "note": "The middle column joins the top row and the bottom row."
    },
    {
     "input": "[\"101\", \"010\", \"101\"]",
     "output": "5",
     "note": "Cells that only meet at corners are not joined, so every stocked cell is its own zone."
    }
   ],
   "constraints": [
    "1 <= rows, cols <= 300",
    "Each cell is \"0\" or \"1\"",
    "Up to 90,000 cells"
   ],
   "clarify": [
    {
     "q": "Do diagonal neighbours count as connected?",
     "a": "No. Only up, down, left and right."
    },
    {
     "q": "Can the grid have no stocked cells?",
     "a": "Yes. Then the answer is 0. There is always at least one row and one column."
    },
    {
     "q": "May I modify the input grid?",
     "a": "Better not to. If you do want to, tell me what you gain and what it costs."
    },
    {
     "q": "How large can the grid be?",
     "a": "Up to 300 by 300. Think about what that means for how you walk the grid in Python."
    }
   ],
   "starter": "def count_zones(grid: list[str]) -> int:\n    ...",
   "hints": [
    "Pick any stocked cell. Which other cells are you sure belong to its zone? Think about how to visit all of them once, so that you never count the same zone twice.",
    "Scan the grid. Each time you meet a stocked cell you have not seen, count one zone and explore everything connected to it with a BFS or DFS, marking cells as seen.",
    "Keep a set of seen (row, col) pairs. For an unseen stocked cell: add one to the answer, mark it seen, push it on a deque. Pop a cell, and for each of its four neighbours that is in bounds, stocked and unseen, mark it seen and push it. Stop when the deque is empty."
   ],
   "solution": "from collections import deque\n\ndef count_zones(grid):\n    rows, cols = len(grid), len(grid[0])\n    seen = set()\n    zones = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == \"1\" and (r, c) not in seen:\n                zones += 1                           # first cell of a new zone\n                seen.add((r, c))\n                q = deque([(r, c)])\n                while q:                             # flood the whole zone\n                    y, x = q.popleft()\n                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):\n                        if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == \"1\" and (ny, nx) not in seen:\n                            seen.add((ny, nx))       # mark when pushed, not when popped\n                            q.append((ny, nx))\n    return zones",
   "complexity": "O(R x C) time and space: every cell is pushed at most once and looked at from four sides.",
   "explain": [
    "Brute force: for every stocked cell, search outward to find its whole zone, then count the distinct zones. The same area is searched again for every cell in it, which can cost O((R x C)^2).",
    "That work is wasted. Once a cell belongs to a flooded zone you never need to start from it again, so keep a seen set.",
    "Scan the cells in row order. A stocked cell that is not seen starts a new zone, so add one.",
    "Flood that zone with a queue (or an explicit stack) and mark each cell seen when you push it, so it is pushed only once.",
    "Prefer the explicit queue over recursion: a full 300 by 300 grid is 90,000 cells and Python stops at about 1,000 nested calls."
   ],
   "dryrun": "Example 1. I scan row 0. Cell (0,0) is stocked and unseen, so zones is 1 and I flood from it. The flood visits (0,0), (0,1), (1,0) and (1,1) and then stops, because every other neighbour is empty or off the grid. Scanning on, those cells are all seen, so I skip them. In row 2, cell (2,2) is stocked and unseen: zones is 2. Its neighbours are all empty, so the flood is only itself. In row 3, cell (3,3) is unseen: zones is 3, and the flood adds (3,4). Nothing else is stocked and unseen, so I return 3.",
   "tests": "assert count_zones([\"11000\", \"11000\", \"00100\", \"00011\"]) == 3\nassert count_zones([\"111\", \"010\", \"111\"]) == 1\nassert count_zones([\"101\", \"010\", \"101\"]) == 5\nassert count_zones([\"0\"]) == 0\nassert count_zones([\"1\"]) == 1\nassert count_zones([\"0000\", \"0000\"]) == 0\nassert count_zones([\"1\" * 300] * 300) == 1                 # full grid, no recursion blow-up\nassert count_zones([\"10\" * 150, \"01\" * 150] * 150) == 45000  # checkerboard: every cell alone",
   "followups": [
    {
     "q": "Can you drop the seen set to save memory?",
     "a": "Yes, if you may change the input: turn it into a list of lists and write \"0\" into each cell as you push it. That saves O(R x C) memory but destroys the grid, so only do it if the interviewer agrees. Otherwise keep the set."
    },
    {
     "q": "Stocking events now arrive one cell at a time, and after each event you report the current number of zones. Re-scanning is too slow.",
     "a": "Use union-find over cells. Stocking a cell adds one zone, then each already-stocked neighbour that sits in a different set merges two zones and takes one away. Each event costs close to O(1) amortised."
    },
    {
     "q": "A teammate wrote the flood as a recursive DFS and it crashes on a full 300 by 300 grid. Why?",
     "a": "A full grid makes the recursion go up to 90,000 calls deep, and Python stops at about 1,000. Use an explicit stack or the queue above. Raising the limit works until the C stack overflows, so I would not rely on it."
    }
   ],
   "reveal": {
    "lc": "LeetCode 200 (medium)",
    "topic": "Number of islands: grid traversal (BFS or DFS flood fill)",
    "pattern": "graphs"
   }
  },
  {
   "id": "d01-b",
   "minutes": 10,
   "title": "Packing instructions",
   "scenario": "A packing station prints its instructions as a string of marks. Three kinds of container exist: ( ) for a small box, [ ] for a crate and { } for a pallet. An opening mark starts a container and the matching closing mark ends it. The instructions are valid when every container that is opened gets closed by a mark of the same kind, and a container opened inside another one is closed before the outer one is. Given the string, return True if the instructions are valid and False otherwise.",
   "examples": [
    {
     "input": "\"([]{})\"",
     "output": "True",
     "note": "The crate and the pallet both open and close inside the small box, one after the other."
    },
    {
     "input": "\"([)]\"",
     "output": "False",
     "note": "The small box is closed while the crate inside it is still open."
    },
    {
     "input": "\"((\"",
     "output": "False",
     "note": "Two small boxes are opened and never closed."
    }
   ],
   "constraints": [
    "0 <= len(s) <= 10^4",
    "s contains only the characters ( ) [ ] { }"
   ],
   "clarify": [
    {
     "q": "Is the empty string valid?",
     "a": "Yes. Nothing is open, so nothing is wrong."
    },
    {
     "q": "Can the string contain any other characters?",
     "a": "No. Only the six marks."
    },
    {
     "q": "What if a closing mark appears before anything is open?",
     "a": "That is invalid."
    },
    {
     "q": "How long can the string be?",
     "a": "Up to 10,000 characters."
    }
   ],
   "starter": "def packing_valid(s: str) -> bool:\n    ...",
   "hints": [
    "When a closing mark shows up, which of the containers that are still open must it close? Think about which one that is, and what you need to remember to find it.",
    "The most recently opened container has to be the next one closed, so keep the open marks on a stack. Push openings; on a closing mark, compare it with the top of the stack.",
    "Map each closing mark to its opener. Loop over the characters: push openers. For a closer, if the stack is empty or its top is not the matching opener, return False; otherwise pop. At the end, return whether the stack is empty."
   ],
   "solution": "def packing_valid(s):\n    match = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for ch in s:\n        if ch in match:                          # a closing mark\n            if not stack or stack.pop() != match[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return not stack                             # anything left open is invalid",
   "complexity": "O(n) time, O(n) space: one pass, and the stack holds at most every opening mark.",
   "explain": [
    "Brute force: keep deleting adjacent matching pairs \"()\", \"[]\" and \"{}\" from the string until nothing changes. Each pass is O(n) and there can be n/2 passes, so O(n^2).",
    "Look at what a closing mark can match: only the most recently opened container that is still open.",
    "That is last in, first out, so use a stack and push every opener.",
    "On a closer, the stack must be non-empty and its top must be the matching opener. Pop it. Otherwise return False.",
    "Finish with an emptiness check: leftover openers are containers that were never closed."
   ],
   "dryrun": "Example 1, \"([]{})\". I push \"(\", then push \"[\". The mark \"]\" needs \"[\" on top and it is there, so I pop. I push \"{\", then \"}\" pops it. Finally \")\" finds \"(\" on top and pops it. The stack is empty, so I return True. On example 2, \"([)]\", I push \"(\" and \"[\", then \")\" needs \"(\" on top but the top is \"[\", so I return False.",
   "tests": "assert packing_valid(\"([]{})\") is True\nassert packing_valid(\"([)]\") is False\nassert packing_valid(\"((\") is False\nassert packing_valid(\"\") is True\nassert packing_valid(\")\") is False\nassert packing_valid(\"(]\") is False\nassert packing_valid(\"{[()()]}\") is True\nassert packing_valid(\"()\" * 5000) is True\nassert packing_valid(\"(\" * 5000 + \")\" * 5000) is True",
   "followups": [
    {
     "q": "Can you reject some inputs without running the loop?",
     "a": "Yes. An odd length can never be valid, so return False at once. While scanning, if the stack holds more marks than there are characters left, no future closers can empty it, so return False early."
    },
    {
     "q": "Suppose only one kind of mark exists and the instructions arrive one character at a time, with no end. How much memory do you need?",
     "a": "One counter. Add one for an opener, subtract one for a closer, return False the moment it goes below zero, and require zero at the end. That is O(1) space. With three kinds you cannot drop the stack, because both the order and the kind matter."
    },
    {
     "q": "Why not keep three counters, one per kind of mark?",
     "a": "Counters ignore order. \"([)]\" has balanced counts for each kind but is invalid, because the small box closes while the crate is still open. The stack remembers the order in which containers were opened."
    }
   ],
   "reveal": {
    "lc": "LeetCode 20 (easy)",
    "topic": "Valid parentheses: a stack for nested matching",
    "pattern": "stack"
   }
  }
 ]
});
window.LOOP_DAILY.days.push({
 "date": "2026-10-23",
 "n": 2,
 "problems": [
  {
   "id": "d02-a",
   "minutes": 15,
   "title": "Best sellers",
   "scenario": "A product page wants a Best Sellers strip. You get the order lines as a list of integers, each one the id of the product on that line (a product appears once for every line it is on). Return the ids of the k products that appear on the most lines, in any order. The k best sellers are always uniquely determined: there is no tie at the cut-off.",
   "examples": [
    {
     "input": "orders = [1, 1, 1, 2, 2, 3], k = 2",
     "output": "[1, 2]",
     "note": "Product 1 is on 3 lines, product 2 on 2 lines and product 3 on 1 line."
    },
    {
     "input": "orders = [7], k = 1",
     "output": "[7]",
     "note": "One product, one line."
    },
    {
     "input": "orders = [4, 4, 5, 5, 5, 6, 6, 6, 6, 9], k = 3",
     "output": "[6, 5, 4]",
     "note": "Counts are 6:4, 5:3, 4:2, 9:1. Any order of 4, 5, 6 is accepted."
    }
   ],
   "constraints": [
    "1 <= len(orders) <= 10^5",
    "-10^4 <= id <= 10^4",
    "1 <= k <= number of distinct ids"
   ],
   "clarify": [
    {
     "q": "What if two products tie for the last place in the top k?",
     "a": "That will not happen. The set of top k products is unique."
    },
    {
     "q": "Does the order of the returned ids matter?",
     "a": "No."
    },
    {
     "q": "Can k be larger than the number of distinct products?",
     "a": "No. It is at most the number of distinct ids."
    },
    {
     "q": "Should I aim to beat sorting every product by its count?",
     "a": "Yes. Tell me the cost in terms of n and k."
    }
   ],
   "starter": "def top_sellers(orders: list[int], k: int) -> list[int]:\n    ...",
   "hints": [
    "You need each product's number of lines first. Then the question is how to pick the biggest k of those counts without fully sorting them.",
    "Count with a hash map. Then either keep a min-heap of size k over the counts, or note that a count is at most n and put each id into a bucket indexed by its count.",
    "Buckets: make n + 1 empty lists and put each id into buckets[count]. Walk from the highest count down, collecting ids, and stop once you hold k of them."
   ],
   "solution": "from collections import Counter\n\ndef top_sellers(orders, k):\n    count = Counter(orders)\n    buckets = [[] for _ in range(len(orders) + 1)]      # buckets[c] = ids seen c times\n    for pid, c in count.items():\n        buckets[c].append(pid)\n    out = []\n    for c in range(len(buckets) - 1, 0, -1):            # highest count first\n        out.extend(buckets[c])\n        if len(out) >= k:\n            return out[:k]\n    return out",
   "complexity": "O(n) time, O(n) space: counting is one pass, the buckets hold at most n ids in total and the walk visits at most n + 1 buckets.",
   "explain": [
    "Brute force: count each id, sort the (id, count) pairs by count and take the first k. Counting is O(n); sorting m distinct ids is O(m log m).",
    "Better: a min-heap of size k over the counts. Each of the m distinct ids costs O(log k), so O(n + m log k).",
    "Best: a count can only be 1 to n, so index buckets by count. No comparisons are needed at all.",
    "Fill the buckets from the counter, then read from the highest count downward until you hold k ids."
   ],
   "dryrun": "orders = [1, 1, 1, 2, 2, 3] and k = 2. Counting gives 1:3, 2:2, 3:1. I make 7 empty buckets, index 0 to 6, and place id 3 in bucket 1, id 2 in bucket 2 and id 1 in bucket 3. Now I walk down from bucket 6. Buckets 6, 5 and 4 are empty. Bucket 3 gives [1], so out has 1 id, fewer than k, and I continue. Bucket 2 gives [2], so out is [1, 2], which has k ids, and I return it.",
   "tests": "assert sorted(top_sellers([1, 1, 1, 2, 2, 3], 2)) == [1, 2]\nassert top_sellers([7], 1) == [7]\nassert sorted(top_sellers([4, 4, 5, 5, 5, 6, 6, 6, 6, 9], 3)) == [4, 5, 6]\nassert sorted(top_sellers([-1, -1, 2], 1)) == [-1]\nassert sorted(top_sellers([1, 2, 3], 3)) == [1, 2, 3]\nassert top_sellers([5] * 100000, 1) == [5]\nassert sorted(top_sellers([3, 3, 2, 2, 2, 1], 2)) == [2, 3]",
   "followups": [
    {
     "q": "Walk me through the heap version. When would you choose it over buckets?",
     "a": "Keep a min-heap of (count, id) with at most k entries and pop the smallest whenever it grows past k; `heapq.nlargest(k, count, key=count.get)` does exactly this in O(m log k). It does not beat buckets on time, but it needs only O(k) extra space instead of n + 1 lists, and it works for any score, not only whole-number counts."
    },
    {
     "q": "The orders arrive as an endless stream and you cannot store them, but you must report the top k at any time.",
     "a": "If the distinct ids fit in memory, keep the hash map of counts and a size-k heap that you update on every line. If even the ids do not fit, use a Space-Saving or Misra-Gries summary, or a count-min sketch plus a small heap of candidates. These trade exact counts for fixed memory."
    },
    {
     "q": "Two products tie for the last place in the top k. What do you return, and what do you say to me?",
     "a": "I ask you for the rule. A stable rule, such as lower id first, makes the output deterministic: with buckets I sort inside that one bucket. With no rule, any k of the tied products is a correct answer, and I say so."
    }
   ],
   "reveal": {
    "lc": "LeetCode 347 (medium)",
    "topic": "Top K frequent elements: hash map plus heap or bucket sort",
    "pattern": "heap"
   }
  },
  {
   "id": "d02-b",
   "minutes": 15,
   "title": "Ordered catalogue",
   "scenario": "A catalogue stores product categories in a binary tree. Each node holds an integer category code. For fast lookups the tree must be ordered: for every node, every code anywhere in its left subtree is strictly smaller than the node's code, and every code anywhere in its right subtree is strictly larger. Given the root, return True if the whole tree is ordered, otherwise False.",
   "examples": [
    {
     "input": "build([2, 1, 3])",
     "output": "True",
     "note": "1 < 2 < 3."
    },
    {
     "input": "build([5, 1, 4, None, None, 3, 6])",
     "output": "False",
     "note": "Node 4 is the right child of 5 but is smaller than 5."
    },
    {
     "input": "build([5, 4, 6, None, None, 3, 7])",
     "output": "False",
     "note": "Node 3 is smaller than its parent 6, but it sits in the right subtree of 5, so it must be larger than 5."
    }
   ],
   "constraints": [
    "1 <= nodes <= 10^4",
    "-2^31 <= code <= 2^31 - 1"
   ],
   "clarify": [
    {
     "q": "Are equal codes allowed?",
     "a": "No. Left must be strictly smaller and right strictly larger, so an equal code anywhere on the wrong side makes the tree invalid."
    },
    {
     "q": "Can a code be the smallest or largest 32-bit integer?",
     "a": "Yes. Do not use those values as stand-ins for no limit."
    },
    {
     "q": "How deep can the tree get?",
     "a": "Assume plain recursion is fine, but tell me what you would change for a very long chain."
    },
    {
     "q": "Is an empty tree ordered?",
     "a": "There is always at least one node, but an empty tree would count as ordered."
    }
   ],
   "starter": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\ndef is_ordered(root: TreeNode) -> bool:\n    ...",
   "hints": [
    "Comparing each node only with its own children is not enough. Look at the third example: what extra limit does node 3 carry from further up the tree?",
    "Every node must lie inside an open range of values set by its ancestors. Pass a lower and an upper bound down as you recurse, tightening one side at each step.",
    "ok(node, lo, hi): None is fine. If node.val is not strictly between lo and hi, return False. The left child gets (lo, node.val) and the right child gets (node.val, hi). Start with no bounds, using None for each."
   ],
   "solution": "def is_ordered(root):\n    def ok(node, lo, hi):                        # lo and hi are exclusive; None = no limit\n        if node is None:\n            return True\n        if (lo is not None and node.val <= lo) or (hi is not None and node.val >= hi):\n            return False\n        return ok(node.left, lo, node.val) and ok(node.right, node.val, hi)\n    return ok(root, None, None)",
   "complexity": "O(n) time, O(h) space for the recursion (h = height of the tree): each node is checked once against its allowed range.",
   "explain": [
    "Brute force: for each node, scan its whole left subtree for a code that is too big and its whole right subtree for one that is too small. That is O(n) per node, O(n^2) on a chain.",
    "The local check (left < node < right) is wrong. A node deep in the right subtree must still beat the ancestor it hangs below.",
    "Carry the allowed open range (lo, hi) down. Going left tightens hi to the parent's code; going right tightens lo.",
    "Use None for no limit, so every 32-bit code is safe.",
    "An alternative: an in-order walk of an ordered tree is strictly increasing, so compare each code to the previous one."
   ],
   "dryrun": "Example 1, build([2, 1, 3]): the root is 2 with children 1 and 3. I call ok(2, None, None). There are no limits, so 2 passes. Left: ok(1, None, 2). 1 is below 2, so it passes, and its children are None. Right: ok(3, 2, None). 3 is above 2, so it passes. Everything passed, so I return True. On example 3, the call for node 3 is ok(3, 5, 6), because it is the left child of 6, which is the right child of 5. 3 is not above 5, so I return False.",
   "tests": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\nassert is_ordered(build([2, 1, 3])) is True\nassert is_ordered(build([5, 1, 4, None, None, 3, 6])) is False\nassert is_ordered(build([5, 4, 6, None, None, 3, 7])) is False\nassert is_ordered(build([1])) is True\nassert is_ordered(build([2, 2, 2])) is False\nassert is_ordered(build([-2147483648])) is True\nassert is_ordered(build([2147483647, -2147483648])) is True\nassert is_ordered(build([1, None, 2, None, 3])) is True\nassert is_ordered(build([10, 5, 15, None, None, 6, 20])) is False",
   "followups": [
    {
     "q": "Can you do it without passing bounds around?",
     "a": "Yes. An in-order walk of an ordered tree visits codes in strictly increasing order. Walk iteratively with an explicit stack, keep the previous code, and return False the first time a code is not greater than it. Same O(n) time and O(h) space. A Morris traversal gets O(1) extra space by temporarily threading pointers."
    },
    {
     "q": "Duplicates are now allowed, always on the right side. What changes?",
     "a": "Only the comparison against the lower bound: the right side now allows a code equal to the node, so the lower bound becomes inclusive while the upper bound stays exclusive. In the in-order version, the failing check becomes code < previous instead of code <= previous."
    },
    {
     "q": "The tree is a chain of 10,000 nodes. What happens, and what do you do?",
     "a": "The recursion goes 10,000 calls deep and Python raises RecursionError near 1,000. Switch to the iterative in-order walk, or an explicit stack of (node, lo, hi) triples. Raising the recursion limit works until the C stack overflows, so I would not rely on it."
    }
   ],
   "reveal": {
    "lc": "LeetCode 98 (medium)",
    "topic": "Validate binary search tree: bounds or in-order",
    "pattern": "trees"
   }
  }
 ]
});
window.LOOP_DAILY.days.push({
 "date": "2026-10-24",
 "n": 3,
 "problems": [
  {
   "id": "d03-a",
   "minutes": 12,
   "title": "Leaderboard cutoff",
   "scenario": "A delivery-driver dashboard shows the score needed to be in the top k. Build a class `Leaderboard`. Its constructor takes k and a list of starting scores. Its method `add(score)` records one new score and returns the k-th highest score among all scores recorded so far, counting repeated scores separately. Higher is better. After every call to `add` there are at least k scores recorded.",
   "examples": [
    {
     "input": "Leaderboard(3, [4, 5, 8, 2]), then add(3), add(5), add(10), add(9), add(4)",
     "output": "4, 5, 5, 8, 8",
     "note": "After add(3) the scores from high to low are 8, 5, 4, 3, 2, so the 3rd highest is 4."
    },
    {
     "input": "Leaderboard(2, [0]), then add(-1), add(1), add(-2), add(-4), add(3)",
     "output": "-1, 0, 0, 0, 1",
     "note": "After add(-1) there are exactly two scores, 0 and -1, so the 2nd highest is -1."
    }
   ],
   "constraints": [
    "1 <= k <= 10^4",
    "0 <= number of starting scores <= 10^4",
    "-10^4 <= score <= 10^4",
    "Up to 10^4 calls to add"
   ],
   "clarify": [
    {
     "q": "Are repeated scores counted separately?",
     "a": "Yes. Two scores of 5 take two ranks."
    },
    {
     "q": "Can there be fewer than k scores when the object is created?",
     "a": "Yes. After the first call to add there are always at least k."
    },
    {
     "q": "How many calls to add, and how fast must each be?",
     "a": "Up to 10,000 calls. Sorting everything again on each call is the slow answer I would like you to improve."
    },
    {
     "q": "Do I need to support removing a score?",
     "a": "No."
    }
   ],
   "starter": "class Leaderboard:\n    def __init__(self, k: int, scores: list[int]):\n        ...\n\n    def add(self, score: int) -> int:\n        ...",
   "hints": [
    "You only care about the k highest scores. Once k better scores exist, a score below them can never be the answer again. What do you need to remember, and what can you forget?",
    "Keep a min-heap of size k that holds the k highest scores. Its smallest element is the k-th highest score overall.",
    "For each score, including the starting ones: if the heap has fewer than k items, push it; otherwise, if it beats the top of the heap, replace the top. In add, do that and return heap[0]."
   ],
   "solution": "import heapq\n\nclass Leaderboard:\n    def __init__(self, k, scores):\n        self.k = k\n        self.heap = []                           # min-heap holding the k highest scores\n        for s in scores:\n            self._push(s)\n\n    def _push(self, s):\n        if len(self.heap) < self.k:\n            heapq.heappush(self.heap, s)\n        elif s > self.heap[0]:\n            heapq.heapreplace(self.heap, s)      # drop the smallest of the top k\n\n    def add(self, score):\n        self._push(score)\n        return self.heap[0]                      # the k-th highest",
   "complexity": "Constructor O(n log k); each add is O(log k) time. O(k) space: the heap never holds more than k scores.",
   "explain": [
    "Brute force: store every score, sort in descending order on each add and return the item at index k - 1. That is O(n log n) per add.",
    "The k-th highest depends only on the top k scores. Scores never leave, so anything below the current k-th highest can never matter.",
    "A min-heap of size k holds the top k with the smallest of them on top, and that smallest is exactly the answer.",
    "For a new score: if the heap is not full, push it. Otherwise, if it beats the top, replace the top. If not, ignore it.",
    "Return heap[0] after every add."
   ],
   "dryrun": "Example 1, k = 3 and starting scores [4, 5, 8, 2]. In the constructor I push 4, 5 and 8, so the heap is full and its top is 4. Score 2 is not greater than 4, so I ignore it. add(3): not greater than 4, ignored, return 4. add(5): 5 beats 4, so I replace the top; the heap holds 5, 5, 8 and I return 5. add(10): beats 5, replace; heap holds 5, 8, 10; return 5. add(9): beats 5, replace; heap holds 8, 9, 10; return 8. add(4): not greater than 8, ignored, return 8. The answers are 4, 5, 5, 8, 8.",
   "tests": "b = Leaderboard(3, [4, 5, 8, 2])\nassert [b.add(x) for x in (3, 5, 10, 9, 4)] == [4, 5, 5, 8, 8]\nb = Leaderboard(2, [0])\nassert [b.add(x) for x in (-1, 1, -2, -4, 3)] == [-1, 0, 0, 0, 1]\nb = Leaderboard(1, [])\nassert [b.add(x) for x in (-3, -2, -4, 0, 4)] == [-3, -2, -2, 0, 4]\nb = Leaderboard(2, [5, 5])\nassert b.add(5) == 5\nb = Leaderboard(3, [1, 1, 1, 1])\nassert b.add(0) == 1",
   "followups": [
    {
     "q": "Now there is no stream: one array of n scores and you want its k-th largest once. Can you beat sorting?",
     "a": "Yes, with QuickSelect. Partition around a random pivot and recurse only into the side that holds the k-th element. Expected O(n); the worst case is O(n^2) without a random pivot. The heap version costs O(n log k) and is the safer choice for a stream."
    },
    {
     "q": "Scores are whole numbers from 0 to 100. Does that change the design?",
     "a": "Yes. Keep a count array of 101 slots. add bumps one slot; to find the k-th highest, walk from 100 downward adding up counts until you reach k. That is at most 101 steps, O(1) per call, with no heap."
    },
    {
     "q": "Why a min-heap of size k, and not a max-heap of everything or a sorted list with `bisect.insort`?",
     "a": "A max-heap of everything costs O(n) memory and k pops per query. A sorted list finds the slot in O(log n) but inserting shifts items, which is O(n). The size-k min-heap uses O(k) memory and O(log k) per add, with the answer on top. If k is close to n, flip it: keep a max-heap of the n - k + 1 smallest."
    }
   ],
   "reveal": {
    "lc": "LeetCode 703 (easy)",
    "topic": "Kth largest element in a stream: min-heap of size k (QuickSelect for the static case)",
    "pattern": "heap"
   }
  },
  {
   "id": "d03-b",
   "minutes": 15,
   "title": "Camera on the right",
   "scenario": "Sorting chutes in a warehouse branch out like a binary tree, drawn with left children on the left and right children on the right. A camera is mounted to the right of the whole tree. Looking across one level at a time, it sees only the rightmost node of each level, because nodes further left on that level are hidden behind it. Given the root, return the codes of the nodes the camera sees, from the top level to the bottom level. An empty tree gives an empty list.",
   "examples": [
    {
     "input": "build([1, 2, 3, None, 5, None, 4])",
     "output": "[1, 3, 4]",
     "note": "On level 1, node 3 hides node 2. On level 2, node 4 hides node 5."
    },
    {
     "input": "build([1, 2, 3, 4])",
     "output": "[1, 3, 4]",
     "note": "Node 4 is on level 2, and nothing is to its right on that level, so the camera sees it even though it hangs off the left side."
    },
    {
     "input": "build([])",
     "output": "[]",
     "note": "No tree, nothing to see."
    }
   ],
   "constraints": [
    "0 <= nodes <= 100",
    "-100 <= code <= 100"
   ],
   "clarify": [
    {
     "q": "Can codes repeat?",
     "a": "Yes. Return codes in level order, repeats included."
    },
    {
     "q": "What if the left side of the tree is deeper than the right?",
     "a": "Then the camera sees the deeper left-side nodes on the lower levels, as in the second example."
    },
    {
     "q": "What do I return for an empty tree?",
     "a": "An empty list."
    },
    {
     "q": "Is the tree balanced?",
     "a": "There is no guarantee."
    }
   ],
   "starter": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\ndef camera_view(root: TreeNode) -> list[int]:\n    ...",
   "hints": [
    "Group the nodes by level. For each level, which single node do you want?",
    "Walk the tree level by level with a queue (BFS). The last node you take from each level is the one the camera sees.",
    "While the queue is not empty: let n be its current length and process exactly n nodes, pushing their children. After those n, append the code of the last node you processed."
   ],
   "solution": "from collections import deque\n\ndef camera_view(root):\n    out = []\n    q = deque([root] if root else [])\n    while q:\n        for _ in range(len(q)):                  # exactly one level\n            node = q.popleft()\n            if node.left:\n                q.append(node.left)\n            if node.right:\n                q.append(node.right)\n        out.append(node.val)                     # node is the last one of this level\n    return out",
   "complexity": "O(n) time, O(w) space where w is the widest level (up to about n / 2).",
   "explain": [
    "Brute force: record (level, code) for every node in left-to-right order, group by level and keep the last of each group. O(n) time but O(n) space for the groups.",
    "Only the last node of each level matters, so keep only that one.",
    "A BFS visits a level left to right. Freeze the queue length at the start of each round so you process exactly one level.",
    "After the round, the last node you popped is the visible one: append its code.",
    "A depth-first alternative visits the right child first and records a code whenever it reaches a depth it has not seen yet."
   ],
   "dryrun": "Example 1, build([1, 2, 3, None, 5, None, 4]): 1 has children 2 and 3; 2 has a right child 5; 3 has a right child 4. The queue starts as [1]. Round 1 has one node: I pop 1 and push 2 and 3. The last popped is 1, so out is [1]. Round 2 has two nodes: I pop 2 and push 5, then pop 3 and push 4. The last popped is 3, so out is [1, 3]. Round 3 has two nodes: I pop 5, then 4. The last popped is 4, so out is [1, 3, 4]. The queue is empty and I return [1, 3, 4].",
   "tests": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\nassert camera_view(build([1, 2, 3, None, 5, None, 4])) == [1, 3, 4]\nassert camera_view(build([1, 2, 3, 4])) == [1, 3, 4]\nassert camera_view(build([])) == []\nassert camera_view(build([1])) == [1]\nassert camera_view(build([1, None, 3])) == [1, 3]\nassert camera_view(build([1, 2, None, 3, None, 4])) == [1, 2, 3, 4]",
   "followups": [
    {
     "q": "Can you do it depth-first, with memory proportional to the height instead of the width?",
     "a": "Yes. Visit the right child before the left child, passing the depth down. The first node you reach at each new depth is the rightmost one: if depth == len(out), append its code. Space is O(h) for the recursion instead of O(w) for the queue, which helps on wide, shallow trees."
    },
    {
     "q": "Now show the view from the left as well, and the average code on each level.",
     "a": "Left view: take the first node of each round instead of the last. Average per level: add up the codes in the round and divide by the round size. Both reuse the same level loop."
    },
    {
     "q": "The node limit is lifted and the tree is a chain of 100,000 nodes. Which version do you use?",
     "a": "The BFS one. On a chain its queue holds one node at a time and it needs no recursion. The recursive version would hit Python's recursion limit. On a very wide tree the roles flip: the queue holds about n / 2 nodes while the recursion holds only the height."
    }
   ],
   "reveal": {
    "lc": "LeetCode 199 (medium)",
    "topic": "Binary tree right side view: level-order BFS",
    "pattern": "trees"
   }
  }
 ]
});
window.LOOP_DAILY.days.push({
 "date": "2026-10-25",
 "n": 4,
 "problems": [
  {
   "id": "d04-a",
   "minutes": 15,
   "title": "Build pipeline",
   "scenario": "A deployment pipeline has n stages numbered 0 to n - 1. You get a list of pairs [a, b]; each one means stage b must finish before stage a can start. Stages may run in any order that respects every pair. Return True if all the stages can be run in some valid order, and False if the rules make that impossible.",
   "examples": [
    {
     "input": "n = 2, rules = [[1, 0]]",
     "output": "True",
     "note": "Run stage 0, then stage 1."
    },
    {
     "input": "n = 2, rules = [[1, 0], [0, 1]]",
     "output": "False",
     "note": "Each stage waits for the other one."
    },
    {
     "input": "n = 4, rules = [[1, 0], [2, 1], [3, 2], [1, 3]]",
     "output": "False",
     "note": "Stage 2 waits for 1, stage 3 waits for 2, and stage 1 waits for 3, so stages 1, 2 and 3 wait on each other in a loop."
    }
   ],
   "constraints": [
    "1 <= n <= 2000",
    "0 <= len(rules) <= 5000",
    "0 <= a, b < n",
    "The same pair may be listed more than once"
   ],
   "clarify": [
    {
     "q": "Can the same rule be listed twice?",
     "a": "Yes. It does not change the answer, but make sure your bookkeeping survives it."
    },
    {
     "q": "Can a stage depend on itself?",
     "a": "Yes, such a pair can appear, and it makes the answer False."
    },
    {
     "q": "Do I return an order, or only whether one exists?",
     "a": "Only whether one exists."
    },
    {
     "q": "Can some stages have no rules at all?",
     "a": "Yes."
    }
   ],
   "starter": "def can_finish(n: int, rules: list[list[int]]) -> bool:\n    ...",
   "hints": [
    "Which stages could you run right now? What happens to the others once those finish? Think about what is blocking you if some stages are still waiting and none is free to run.",
    "Treat stages as nodes and rules as directed edges. All stages can run exactly when the graph has no cycle. Use a topological sort (Kahn's algorithm with in-degree counts), or a DFS with three colours.",
    "For each stage, count how many rules it still waits on, and for each stage store the stages that wait for it. Queue every stage whose count is 0. Pop one, count it as done, subtract 1 from each stage waiting on it, and queue any that reach 0. Return whether you finished all n stages."
   ],
   "solution": "from collections import deque\n\ndef can_finish(n, rules):\n    waiting_on = [0] * n                         # unmet prerequisites per stage\n    unlocks = [[] for _ in range(n)]             # b -> stages that wait for b\n    for a, b in rules:\n        unlocks[b].append(a)\n        waiting_on[a] += 1\n    q = deque(i for i in range(n) if waiting_on[i] == 0)\n    done = 0\n    while q:\n        b = q.popleft()\n        done += 1\n        for a in unlocks[b]:\n            waiting_on[a] -= 1\n            if waiting_on[a] == 0:\n                q.append(a)\n    return done == n                             # stages stuck in a loop never reach zero",
   "complexity": "O(n + r) time and space, r = number of rules: every stage and every rule is touched once.",
   "explain": [
    "Brute force: repeatedly scan all rules for a stage whose prerequisites are all done; stop when a full scan finds none. Each scan is O(n + r) and there can be n scans, so O(n x (n + r)).",
    "Count the unmet prerequisites of each stage, and index the rules by the stage that unlocks others, so finishing a stage updates only its dependants.",
    "Start from the stages with zero unmet prerequisites.",
    "Each finished stage lowers the count of its dependants. When a count reaches zero, that stage becomes available.",
    "If a cycle exists, its stages never reach zero, so the number of finished stages stays below n."
   ],
   "dryrun": "Example 1: n = 2 and rules [[1, 0]]. waiting_on is [0, 1] and unlocks[0] is [1]. The queue starts with stage 0. I pop 0, done is 1, and stage 1's count drops to 0, so it joins the queue. I pop 1 and done is 2. The queue is empty and done equals n, so I return True. For example 2 both counts are 1, so the queue starts empty, done stays 0, and I return False.",
   "tests": "assert can_finish(2, [[1, 0]]) is True\nassert can_finish(2, [[1, 0], [0, 1]]) is False\nassert can_finish(4, [[1, 0], [2, 1], [3, 2], [1, 3]]) is False\nassert can_finish(1, []) is True\nassert can_finish(1, [[0, 0]]) is False\nassert can_finish(3, [[1, 0], [1, 0], [2, 1]]) is True\nassert can_finish(5, []) is True\nassert can_finish(5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]]) is True\nassert can_finish(2000, [[i + 1, i] for i in range(1999)]) is True     # a long chain",
   "followups": [
    {
     "q": "Rules are added one at a time, and after each one you must say whether the pipeline is still valid. Rerunning everything is too slow.",
     "a": "Only the new rule can create a cycle, and it does so exactly when its dependant a already leads to its prerequisite b through the existing rules. Search from a for b over the stages it unlocks. The worst case is still O(n + r), but typical searches touch only a small region."
    },
    {
     "q": "Independent stages may run at the same time. What is the fewest rounds the pipeline needs?",
     "a": "Process the queue one wave at a time, like a level-order walk, and count the waves until it is empty. The number of waves equals the longest chain of dependent stages. Appending each popped stage to a list also gives you one valid order. If done < n, it is impossible."
    },
    {
     "q": "Why Kahn's method and not a DFS with three colours?",
     "a": "Both are O(n + r). Kahn's is iterative, so a long chain cannot hit Python's recursion limit, and the order and the wave count come free. The DFS is shorter when you must print the cycle itself, because the stack of grey stages is the cycle."
    }
   ],
   "reveal": {
    "lc": "LeetCode 207 (medium)",
    "topic": "Course schedule: cycle detection with topological sort",
    "pattern": "order"
   }
  },
  {
   "id": "d04-b",
   "minutes": 10,
   "title": "Look-alike listings",
   "scenario": "Sellers upload product names as lowercase strings. Two listings are look-alikes when one can be made from the other by rearranging its letters (the same letters, with the same count of each). Given the list of names, group the look-alikes together. Return a list of groups; the groups, and the names inside each group, may be in any order.",
   "examples": [
    {
     "input": "[\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
     "output": "[[\"eat\", \"tea\", \"ate\"], [\"tan\", \"nat\"], [\"bat\"]]",
     "note": "Any order of groups, and of names inside a group, is accepted."
    },
    {
     "input": "[\"\"]",
     "output": "[[\"\"]]",
     "note": "An empty name only matches other empty names."
    },
    {
     "input": "[\"ab\", \"ba\", \"ab\"]",
     "output": "[[\"ab\", \"ba\", \"ab\"]]",
     "note": "A repeated name stays in the list twice."
    }
   ],
   "constraints": [
    "1 <= len(names) <= 10^4",
    "0 <= len(name) <= 100",
    "Names contain only the letters a to z"
   ],
   "clarify": [
    {
     "q": "Can the same name appear twice?",
     "a": "Yes. Keep both copies, in the same group."
    },
    {
     "q": "Can a name be empty?",
     "a": "Yes."
    },
    {
     "q": "Can there be capital letters or other characters?",
     "a": "No. Only lowercase a to z."
    },
    {
     "q": "Does the order of the groups or of the names matter?",
     "a": "No."
    }
   ],
   "starter": "def group_listings(names: list[str]) -> list[list[str]]:\n    ...",
   "hints": [
    "Two look-alike names share something that does not depend on the order of the letters. What can you compute from a name that comes out the same for every rearrangement?",
    "Build a canonical key for each name, either its sorted letters or a tuple of 26 letter counts, and group the names in a hash map by that key.",
    "groups = defaultdict(list). For each name compute key = tuple(counts) (or \"\".join(sorted(name))) and do groups[key].append(name). Return list(groups.values())."
   ],
   "solution": "from collections import defaultdict\n\ndef group_listings(names):\n    groups = defaultdict(list)\n    for name in names:\n        counts = [0] * 26\n        for ch in name:\n            counts[ord(ch) - 97] += 1\n        groups[tuple(counts)].append(name)       # same letter counts -> same key\n    return list(groups.values())",
   "complexity": "O(n x L) time and space, L = longest name. The sorted-letters key costs O(n x L log L) time.",
   "explain": [
    "Brute force: compare every pair of names by sorting both (or counting letters) and merge the matches into groups. That is n^2 pair checks, each costing O(L log L).",
    "Better: give every name a canonical key that is the same for all its rearrangements, and keep a hash map from key to group.",
    "Sorted letters work and are short to write: O(L log L) per name.",
    "A tuple of 26 counts removes the sort and costs O(L) per name. Tuples can be dictionary keys; lists cannot.",
    "One pass over the names, then return the map's values."
   ],
   "dryrun": "Example 1. \"eat\" has counts a=1, e=1, t=1; that 26-slot tuple is its key and it starts a group. \"tea\" has the same counts, so the same key, and it joins that group. \"tan\" has a=1, n=1, t=1, which is a new key, so it starts a second group. \"ate\" joins the first group, \"nat\" joins the second. \"bat\" has b=1, a=1, t=1, a new key, so it starts a third group. The map holds [eat, tea, ate], [tan, nat], [bat], and I return those.",
   "tests": "def norm(groups):\n    return sorted(sorted(g) for g in groups)\n\nassert norm(group_listings([\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"])) == [[\"ate\", \"eat\", \"tea\"], [\"bat\"], [\"nat\", \"tan\"]]\nassert group_listings([\"\"]) == [[\"\"]]\nassert group_listings([\"a\"]) == [[\"a\"]]\nassert norm(group_listings([\"ab\", \"ba\", \"ab\"])) == [[\"ab\", \"ab\", \"ba\"]]\nassert norm(group_listings([\"\", \"a\", \"\"])) == [[\"\", \"\"], [\"a\"]]\nassert len(group_listings([\"abc\", \"abd\", \"abe\"])) == 3",
   "followups": [
    {
     "q": "What does each key cost, and when would you still pick the sorted-letters key?",
     "a": "Sorted letters cost O(L log L) per name; the count tuple costs O(L) with a fixed 26-slot key, so counts win for long names. For short names the difference vanishes and sorting is shorter to write. In an interview I would write the sorted version first, state its cost and offer the count version."
    },
    {
     "q": "Names can now contain any Unicode characters, and listings stream in one at a time. How do you adapt?",
     "a": "A 26-slot array no longer covers the alphabet, so use `tuple(sorted(Counter(name).items()))` as the key. For a stream, keep the dictionary between calls: each arrival costs O(L) to compute its key plus one append to its group."
    },
    {
     "q": "A colleague suggests giving each letter a prime and multiplying them to make the key. Do you accept that?",
     "a": "Prime products are unique by the fundamental theorem of arithmetic, so it is correct in theory. But the product overflows fixed-size integers in most languages and gets huge for long names; Python's big integers avoid overflow but slow down. The count tuple gives the same guarantee with no overflow."
    }
   ],
   "reveal": {
    "lc": "LeetCode 49 (medium)",
    "topic": "Group anagrams: a canonical key in a hash map",
    "pattern": "hashing"
   }
  }
 ]
});
window.LOOP_DAILY.days.push({
 "date": "2026-10-26",
 "n": 5,
 "problems": [
  {
   "id": "d05-a",
   "minutes": 15,
   "title": "Price history",
   "scenario": "A shop keeps the price history of each product. Build a class `PriceHistory` with two methods. `record(sku, price, t)` stores that product `sku` is priced `price` (a string) from time `t` onward. `price_at(sku, t)` returns the price in force at time `t`: the price recorded with the latest time that is at most `t`. If the product has no price recorded at or before `t`, return the empty string. For any one product, calls to `record` always come with strictly increasing times.",
   "examples": [
    {
     "input": "record(\"mug\", \"4.00\", 1); price_at(\"mug\", 1); price_at(\"mug\", 3); record(\"mug\", \"5.00\", 4); price_at(\"mug\", 4); price_at(\"mug\", 5)",
     "output": "\"4.00\", \"4.00\", \"5.00\", \"5.00\"",
     "note": "At time 3 the latest record at or before 3 is the one at time 1."
    },
    {
     "input": "record(\"pen\", \"1.20\", 10); price_at(\"pen\", 9); price_at(\"pen\", 10); price_at(\"lamp\", 10)",
     "output": "\"\", \"1.20\", \"\"",
     "note": "Nothing is recorded for the pen before time 10, and the lamp has no records at all."
    }
   ],
   "constraints": [
    "1 <= len(sku), len(price) <= 100",
    "1 <= t <= 10^7",
    "Up to 200,000 calls in total"
   ],
   "clarify": [
    {
     "q": "Can the same time be recorded twice for one product?",
     "a": "No. Times are strictly increasing per product."
    },
    {
     "q": "What do I return for a product that was never recorded, or a time before its first record?",
     "a": "The empty string."
    },
    {
     "q": "Are calls for different products interleaved?",
     "a": "Yes, in any order."
    },
    {
     "q": "Which method is called more often?",
     "a": "price_at, by a wide margin."
    }
   ],
   "starter": "class PriceHistory:\n    def __init__(self):\n        ...\n\n    def record(self, sku: str, price: str, t: int) -> None:\n        ...\n\n    def price_at(self, sku: str, t: int) -> str:\n        ...",
   "hints": [
    "For one product the times arrive already in order. What does that let you do when you are asked for the latest time at or before t, without looking at every record?",
    "Keep a dict from product to its list of times (and a parallel list of prices). A lookup is a binary search for the rightmost time that is at most t.",
    "bisect_right(times, t) gives how many times are at most t. If that is 0, return the empty string. Otherwise the answer is prices[i - 1]. record appends to both lists."
   ],
   "solution": "from bisect import bisect_right\n\nclass PriceHistory:\n    def __init__(self):\n        self.times = {}          # sku -> sorted list of times\n        self.prices = {}         # sku -> prices in the same order\n\n    def record(self, sku, price, t):\n        self.times.setdefault(sku, []).append(t)\n        self.prices.setdefault(sku, []).append(price)\n\n    def price_at(self, sku, t):\n        i = bisect_right(self.times.get(sku, []), t)     # how many records are at or before t\n        return self.prices[sku][i - 1] if i else \"\"",
   "complexity": "record O(1), price_at O(log m) where m is the number of records for that product. O(total records) space.",
   "explain": [
    "Brute force: store the records per product and scan them all in price_at, keeping the latest time that is at most t. That is O(m) per query.",
    "Times for one product are appended in increasing order, so each list is already sorted.",
    "A sorted list lets you binary search for where t would be inserted.",
    "bisect_right returns how many times are at most t. The answer is the record directly before that point, or the empty string when the count is zero.",
    "Keep prices in a parallel list so one index serves both lists."
   ],
   "dryrun": "Example 1. After record(\"mug\", \"4.00\", 1) the lists are times [1], prices [\"4.00\"]. price_at(\"mug\", 1): bisect_right([1], 1) is 1, so I return prices[0], \"4.00\". price_at(\"mug\", 3): bisect_right([1], 3) is 1, so \"4.00\" again. After record(\"mug\", \"5.00\", 4) the lists are [1, 4] and [\"4.00\", \"5.00\"]. price_at(\"mug\", 4): bisect_right gives 2, so prices[1], \"5.00\". price_at(\"mug\", 5): bisect_right gives 2 again, so \"5.00\".",
   "tests": "ph = PriceHistory()\nph.record(\"mug\", \"4.00\", 1)\nassert ph.price_at(\"mug\", 1) == \"4.00\"\nassert ph.price_at(\"mug\", 3) == \"4.00\"\nph.record(\"mug\", \"5.00\", 4)\nassert ph.price_at(\"mug\", 4) == \"5.00\"\nassert ph.price_at(\"mug\", 5) == \"5.00\"\nassert ph.price_at(\"mug\", 0) == \"\"\nph.record(\"pen\", \"1.20\", 10)\nassert ph.price_at(\"pen\", 9) == \"\"\nassert ph.price_at(\"pen\", 10) == \"1.20\"\nassert ph.price_at(\"lamp\", 10) == \"\"\nassert ph.price_at(\"mug\", 10 ** 7) == \"5.00\"",
   "followups": [
    {
     "q": "price_at is called far more than record. Where does the time go, and is anything worth changing?",
     "a": "record is O(1) and price_at is O(log m), which is already the right split for read-heavy use. The main cost is memory: two lists per product. You can keep one list of (time, price) pairs and call `bisect_right(records, t, key=lambda r: r[0])`, which Python 3.10 and later accept. If prices repeat, store only the changes."
    },
    {
     "q": "Now record can arrive with times out of order, and recording an existing time overwrites its price.",
     "a": "Appending no longer keeps the list sorted. Find the slot with bisect_left; if that time already exists, overwrite its price, otherwise insert into both lists. Insert is O(m) because items shift, so for heavy out-of-order writes use a balanced tree or `sortedcontainers.SortedList`, or buffer writes and sort lazily."
    },
    {
     "q": "Why not a dict from (sku, time) to price, or an array indexed by time?",
     "a": "A dict answers only exact times, but price_at needs the latest time at or before t. An array indexed by time would need up to 10 million slots per product. Sorted records with a binary search take space proportional to the number of records only."
    }
   ],
   "reveal": {
    "lc": "LeetCode 981 (medium)",
    "topic": "Time based key-value store: hash map of sorted lists plus binary search",
    "pattern": "binary"
   }
  },
  {
   "id": "d05-b",
   "minutes": 15,
   "title": "Shared parent category",
   "scenario": "A catalogue keeps its categories in a binary tree, and every node holds a distinct integer code. You are given the root and two codes p and q that both exist in the tree. Return the code of the lowest category that has both p and q at or below it. A category counts as being below itself, so if p sits below q, the answer is q.",
   "examples": [
    {
     "input": "build([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), p = 5, q = 1",
     "output": "3",
     "note": "5 and 1 are in different halves of the tree, so only the root has both of them below it."
    },
    {
     "input": "the same tree, p = 5, q = 4",
     "output": "5",
     "note": "4 sits below 5, and a category counts as below itself."
    },
    {
     "input": "build([1, 2]), p = 1, q = 2",
     "output": "1",
     "note": "The root has 2 below it and is itself 1."
    }
   ],
   "constraints": [
    "2 <= nodes <= 10^4",
    "All codes are distinct",
    "p != q, and both are in the tree"
   ],
   "clarify": [
    {
     "q": "Are the codes unique?",
     "a": "Yes."
    },
    {
     "q": "Are p and q always in the tree?",
     "a": "Yes."
    },
    {
     "q": "Is the tree ordered, so I can compare codes to decide which way to go?",
     "a": "No. The codes are in no particular order."
    },
    {
     "q": "How deep can the tree be?",
     "a": "Plain recursion is fine here, but say what you would change for a very deep chain."
    }
   ],
   "starter": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\ndef shared_parent(root: TreeNode, p: int, q: int) -> int:\n    ...",
   "hints": [
    "Think about the answer node from its own point of view. Where are p and q relative to it, and what would each side of it report back?",
    "Do a post-order walk. Each call returns the node if it finds p or q at or below it. The lowest node whose left and right calls both find something is the answer.",
    "find(node): if node is None or node.val is p or q, return node. Set left = find(node.left) and right = find(node.right). If both are not None, return node. Otherwise return whichever is not None. The answer is the value of find(root)."
   ],
   "solution": "def shared_parent(root, p, q):\n    def find(node):\n        if node is None or node.val == p or node.val == q:\n            return node                          # reached a target (or nothing)\n        left, right = find(node.left), find(node.right)\n        if left and right:\n            return node                          # p and q are on different sides\n        return left or right                     # pass up whichever side found one\n    return find(root).val",
   "complexity": "O(n) time, O(h) space for the recursion (h = height): each node is visited once.",
   "explain": [
    "Brute force: for each node, check whether p and q are both in its subtree (O(n) each) and keep the deepest such node. That is O(n^2) on a chain.",
    "Another O(n) way: record parent links in one traversal, climb from p storing every ancestor in a set, then climb from q until you land on one.",
    "Single pass: let each call report what it found below, either the node itself if it is p or q, or whatever its children found.",
    "If the left and right sides both report something, p and q are split here, so this node is the answer.",
    "If only one side reports, pass that up. It is either the lower target or an answer already found, which covers the case where one target sits below the other."
   ],
   "dryrun": "Example 1: 3 has children 5 and 1; 5 has children 6 and 2; 2 has children 7 and 4; 1 has children 0 and 8. p is 5 and q is 1. find(3): 3 is not a target, so I call find(5). It is a target, so it returns node 5 without looking deeper. Then find(1) is a target too and returns node 1. Both sides are set, so find(3) returns node 3 and the answer is 3. For example 2 with q = 4: find(5) returns node 5 at once, and find(1) searches 0 and 8, finds nothing and returns None. Only the left side is set, so node 5 is passed up and the answer is 5.",
   "tests": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef build(vals):\n    # level-order list, None = missing child (LeetCode style); [] gives None\n    nodes = [None if v is None else TreeNode(v) for v in vals]\n    kids = iter(nodes[1:])\n    for node in nodes:\n        if node:\n            node.left = next(kids, None)\n            node.right = next(kids, None)\n    return nodes[0] if nodes else None\n\nt = build([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4])\nassert shared_parent(t, 5, 1) == 3\nassert shared_parent(t, 5, 4) == 5\nassert shared_parent(t, 7, 4) == 2\nassert shared_parent(t, 6, 4) == 5\nassert shared_parent(t, 0, 8) == 1\nassert shared_parent(build([1, 2]), 1, 2) == 1\nassert shared_parent(build([1, 2]), 2, 1) == 1",
   "followups": [
    {
     "q": "There are 100,000 queries on the same tree. Repeating an O(n) walk is too slow.",
     "a": "Preprocess once. Binary lifting gives O(log n) per query after O(n log n) setup, and an Euler tour with a range-minimum structure gives O(1) per query. For a modest number of queries, parent pointers plus depths cost O(depth) per query: lift the deeper node, then lift both together."
    },
    {
     "q": "The tree is now ordered: smaller codes on the left, larger on the right. What changes?",
     "a": "You no longer need to visit everything. Start at the root: if both p and q are smaller than the node, go left; if both are larger, go right; otherwise this node splits them and is the answer. That is O(h) time and O(1) space when written as a loop."
    },
    {
     "q": "The tree is a chain of 10,000 nodes. What breaks, and what do you switch to?",
     "a": "Recursion reaches 10,000 calls deep and Python stops near 1,000. Build the parent links iteratively with an explicit stack, collect p's ancestors in a set, then climb from q until you meet one. That is O(n) time and space with no recursion."
    }
   ],
   "reveal": {
    "lc": "LeetCode 236 (medium)",
    "topic": "Lowest common ancestor of a binary tree: post-order recursion",
    "pattern": "trees"
   }
  }
 ]
});
window.LOOP_DAILY.days.push({
 "date": "2026-10-27",
 "n": 6,
 "problems": [
  {
   "id": "d06-a",
   "minutes": 15,
   "title": "Spreading spoilage",
   "scenario": "A cold-storage room is a grid of crates. A cell holds 0 for an empty slot, 1 for a fresh crate and 2 for a spoiled crate. Every minute, each fresh crate that touches a spoiled crate (up, down, left or right) becomes spoiled. Return the minimum number of minutes that must pass until no fresh crate is left, or -1 if some fresh crate can never be reached.",
   "examples": [
    {
     "input": "[[2, 1, 1], [1, 1, 0], [0, 1, 1]]",
     "output": "4",
     "note": "Spoilage moves one step per minute from the top-left corner; the bottom-right crate is reached at minute 4."
    },
    {
     "input": "[[2, 1, 1], [0, 1, 1], [1, 0, 1]]",
     "output": "-1",
     "note": "The crate at the bottom-left has only empty slots or the edge next to it, so it never spoils."
    },
    {
     "input": "[[0, 2]]",
     "output": "0",
     "note": "There is no fresh crate, so no time is needed."
    }
   ],
   "constraints": [
    "1 <= rows, cols <= 100",
    "Each cell is 0, 1 or 2"
   ],
   "clarify": [
    {
     "q": "Can there be several spoiled crates at the start?",
     "a": "Yes. They all spread at the same time."
    },
    {
     "q": "What if there are no fresh crates at all?",
     "a": "Return 0."
    },
    {
     "q": "What if there are fresh crates but no spoiled one?",
     "a": "Then nothing ever spoils, so return -1."
    },
    {
     "q": "Do diagonal neighbours count?",
     "a": "No."
    }
   ],
   "starter": "def minutes_to_spoil(grid: list[list[int]]) -> int:\n    ...",
   "hints": [
    "Spoilage from every starting crate advances at the same time. What do all the crates that spoil at minute 1 have in common, and how about minute 2?",
    "This is a multi-source BFS: put every initially spoiled crate in the queue together and process the queue one level at a time, where one level is one minute.",
    "Count the fresh crates and queue every 2. While the queue is not empty and fresh crates remain: add a minute, then for every cell currently in the queue spoil its fresh neighbours, decrement the count and queue them. At the end return the minutes if no fresh crate remains, else -1."
   ],
   "solution": "from collections import deque\n\ndef minutes_to_spoil(grid):\n    rows, cols = len(grid), len(grid[0])\n    q, fresh = deque(), 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                q.append((r, c))                 # every source starts in the queue\n            elif grid[r][c] == 1:\n                fresh += 1\n    seen = set()\n    minutes = 0\n    while q and fresh:\n        minutes += 1\n        for _ in range(len(q)):                  # one level = one minute\n            r, c = q.popleft()\n            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):\n                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1 and (nr, nc) not in seen:\n                    seen.add((nr, nc))           # mark when queued\n                    fresh -= 1\n                    q.append((nr, nc))\n    return minutes if fresh == 0 else -1",
   "complexity": "O(R x C) time and space: each cell enters the queue at most once and has four neighbours.",
   "explain": [
    "Brute force: simulate each minute by scanning the whole grid, spoil every fresh crate next to a spoiled one, and repeat until nothing changes. Each scan is O(R x C) and there can be O(R x C) minutes, so O((R x C)^2).",
    "Only crates that became spoiled in the last minute can spoil new ones, so keep exactly those in a queue.",
    "Start with all spoiled crates in the queue together, so that the sources spread in parallel.",
    "Process the queue one level at a time. One level is one minute.",
    "Keep the count of fresh crates. If any remain once the queue is empty, return -1."
   ],
   "dryrun": "Example 1 has 6 fresh crates and one source at (0,0). The queue is [(0,0)]. Minute 1: I pop (0,0) and spoil (1,0) and (0,1), leaving 4 fresh. Minute 2: the queue holds (1,0) and (0,1). (1,0) spoils (1,1), and (0,1) spoils (0,2) because (1,1) is already seen, leaving 2 fresh. Minute 3: the queue holds (1,1) and (0,2). (1,1) spoils (2,1), leaving 1 fresh, and (0,2) finds nothing. Minute 4: (2,1) spoils (2,2), leaving 0 fresh. The loop ends and I return 4.",
   "tests": "assert minutes_to_spoil([[2, 1, 1], [1, 1, 0], [0, 1, 1]]) == 4\nassert minutes_to_spoil([[2, 1, 1], [0, 1, 1], [1, 0, 1]]) == -1\nassert minutes_to_spoil([[0, 2]]) == 0\nassert minutes_to_spoil([[0]]) == 0\nassert minutes_to_spoil([[1]]) == -1\nassert minutes_to_spoil([[2]]) == 0\nassert minutes_to_spoil([[2, 1], [1, 2]]) == 1\nassert minutes_to_spoil([[2] + [1] * 99]) == 99",
   "followups": [
    {
     "q": "A teammate rescans the whole grid every minute. How bad is that, in numbers?",
     "a": "Each scan is O(R x C), and on a snake-shaped layout the spread can take about R x C / 2 minutes, so O((R x C)^2). That is around 10^8 steps for a 100 by 100 room. The queue touches each cell once, about 10^4."
    },
    {
     "q": "Some crates sit in insulated slots and take 2 minutes to spoil once touched. What changes?",
     "a": "Edges now have different weights, so plain BFS no longer gives the shortest times. Use Dijkstra with a min-heap keyed by time (or a bucketed BFS when the weights are small integers). The answer is the largest finishing time among all crates you reach."
    },
    {
     "q": "Why do you mark a crate as seen when you queue it, not when you pop it?",
     "a": "Marking on pop lets several neighbours queue the same crate in the same minute. That wastes time and double-counts when you decrement the fresh count. Marking on push puts each crate in the queue exactly once."
    }
   ],
   "reveal": {
    "lc": "LeetCode 994 (medium)",
    "topic": "Rotting oranges: multi-source BFS by level",
    "pattern": "graphs"
   }
  },
  {
   "id": "d06-b",
   "minutes": 10,
   "title": "Back-to-back windows",
   "scenario": "Delivery partners register time windows as [start, end] pairs of minutes. Windows that overlap, or that touch because one ends exactly when the next begins, can be handled as one longer window. Given the windows in no particular order, return the combined windows, ordered by start time, so that no two of them overlap or touch.",
   "examples": [
    {
     "input": "[[1, 3], [2, 6], [8, 10], [15, 18]]",
     "output": "[[1, 6], [8, 10], [15, 18]]",
     "note": "[1, 3] and [2, 6] overlap; the other two stand alone."
    },
    {
     "input": "[[1, 4], [4, 5]]",
     "output": "[[1, 5]]",
     "note": "They touch at minute 4, so they join."
    },
    {
     "input": "[[5, 6], [1, 10], [2, 3]]",
     "output": "[[1, 10]]",
     "note": "One window contains the other two, and the input is not in order."
    }
   ],
   "constraints": [
    "1 <= len(windows) <= 10^4",
    "0 <= start <= end <= 10^4"
   ],
   "clarify": [
    {
     "q": "Do windows that only share an endpoint merge?",
     "a": "Yes."
    },
    {
     "q": "Is the input in any order?",
     "a": "No, it is in no particular order."
    },
    {
     "q": "Can a window have start equal to end?",
     "a": "Yes."
    },
    {
     "q": "May I modify the input list?",
     "a": "Better not. Work on a copy."
    }
   ],
   "starter": "def merge_windows(windows: list[list[int]]) -> list[list[int]]:\n    ...",
   "hints": [
    "If two windows overlap, what do you know about the windows that sit between them? Think about which order would put overlapping windows next to each other.",
    "Sort the windows by start time, then make one pass comparing each window with the last merged one.",
    "Sort by start. Keep a result list. For each window: if the result is empty or its start is greater than the last result's end, append a copy. Otherwise set the last end to the larger of the two ends."
   ],
   "solution": "def merge_windows(windows):\n    out = []\n    for start, end in sorted(windows):           # sorted copy: the input is untouched\n        if out and start <= out[-1][1]:          # overlaps or touches the last window\n            out[-1][1] = max(out[-1][1], end)\n        else:\n            out.append([start, end])\n    return out",
   "complexity": "O(n log n) time for the sort, O(n) space for the output. The merging pass itself is O(n).",
   "explain": [
    "Brute force: repeatedly look for any pair that overlaps, merge it and start again until no pair overlaps. Each pass is O(n^2) and there can be n passes, so O(n^3).",
    "Sorting by start puts every window that could overlap the current one right after it.",
    "Keep the last merged window. The next window either starts at or before its end (overlap or touch) or after it (a gap).",
    "On an overlap, extend the end with max, because the new window may end earlier than the current one.",
    "On a gap, start a new merged window."
   ],
   "dryrun": "Example 1. After sorting by start the order is [1, 3], [2, 6], [8, 10], [15, 18]. The result is empty, so it becomes [[1, 3]]. Next, [2, 6]: 2 is at most 3, so it overlaps, and the last end becomes max(3, 6) = 6, giving [[1, 6]]. Next, [8, 10]: 8 is greater than 6, a gap, so I append it. Next, [15, 18]: 15 is greater than 10, so I append it. I return [[1, 6], [8, 10], [15, 18]].",
   "tests": "assert merge_windows([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]\nassert merge_windows([[1, 4], [4, 5]]) == [[1, 5]]\nassert merge_windows([[5, 6], [1, 10], [2, 3]]) == [[1, 10]]\nassert merge_windows([[3, 3]]) == [[3, 3]]\nassert merge_windows([[1, 2], [3, 4]]) == [[1, 2], [3, 4]]\nassert merge_windows([[4, 5], [1, 4], [0, 1]]) == [[0, 5]]\nw = [[2, 6], [1, 3]]\nmerge_windows(w)\nassert w == [[2, 6], [1, 3]]                      # input unchanged",
   "followups": [
    {
     "q": "The list is already merged and in order, and you must add one new window. Can you beat sorting again?",
     "a": "Yes, one O(n) pass: copy the windows that end before the new one starts, merge every window that overlaps it by taking the smallest start and the largest end, then copy the rest. A binary search finds the two boundaries in O(log n), but building the output list is still O(n)."
    },
    {
     "q": "Instead of merging, find the fewest delivery bays so that no two overlapping windows share a bay.",
     "a": "Sort by start and keep a min-heap of end times. For each window, free the bay with the earliest end if that end is at or before the new start, push the new end, and track the biggest heap size. O(n log n). Decide, and say, whether touching windows may share a bay."
    },
    {
     "q": "Why sort by start, and not by end or not at all?",
     "a": "After sorting by start, once a window begins after the current merged end no later window can reach back, so one pass is enough. Sorting by end works with a mirrored sweep from the right. Without sorting you need repeated passes or an interval tree, so the O(n log n) of the sort is the price of a simple scan."
    }
   ],
   "reveal": {
    "lc": "LeetCode 56 (medium)",
    "topic": "Merge intervals: sort by start, then one pass",
    "pattern": "intervals"
   }
  }
 ]
});
window.LOOP_DAILY.days.push({
 "date": "2026-10-28",
 "n": 7,
 "problems": [
  {
   "id": "d07-a",
   "minutes": 15,
   "title": "Nearest drop-offs",
   "scenario": "A delivery hub sits at the origin (0, 0) of a city grid measured in kilometres. You get the coordinates [x, y] of many customers. Return the k customers closest to the hub by straight-line distance, in any order. The set of k closest customers is unique: there is no tie at the cut-off.",
   "examples": [
    {
     "input": "points = [[1, 3], [-2, 2]], k = 1",
     "output": "[[-2, 2]]",
     "note": "The squared distances are 10 and 8, so (-2, 2) is closer."
    },
    {
     "input": "points = [[3, 3], [5, -1], [-2, 4]], k = 2",
     "output": "[[3, 3], [-2, 4]]",
     "note": "The squared distances are 18, 26 and 20, so the two smallest belong to (3, 3) and (-2, 4)."
    },
    {
     "input": "points = [[0, 0]], k = 1",
     "output": "[[0, 0]]",
     "note": "A customer standing at the hub."
    }
   ],
   "constraints": [
    "1 <= k <= len(points) <= 10^5",
    "-10^4 <= x, y <= 10^4"
   ],
   "clarify": [
    {
     "q": "Does the order of the returned points matter?",
     "a": "No."
    },
    {
     "q": "What happens when two points tie for the k-th place?",
     "a": "That will not occur."
    },
    {
     "q": "Do I need the exact distances, with square roots?",
     "a": "No. You only need to pick the right customers."
    },
    {
     "q": "Can two customers share the same coordinates?",
     "a": "Yes. Each copy is a separate customer."
    }
   ],
   "starter": "def nearest_drops(points: list[list[int]], k: int) -> list[list[int]]:\n    ...",
   "hints": [
    "You do not need the exact distance, only a number that orders the points the same way. Then ask what you must remember while scanning to know the k best so far.",
    "Keep a max-heap of size k keyed by distance. A new point enters only if it is closer than the farthest of the current k.",
    "Python's heapq is a min-heap, so store (-d, x, y) where d is x squared plus y squared. For each point: if the heap has fewer than k items, push; otherwise if -d is bigger than the top's key, replace the top. At the end, the heap holds the k closest points."
   ],
   "solution": "import heapq\n\ndef nearest_drops(points, k):\n    heap = []                                    # max-heap via negated squared distance\n    for x, y in points:\n        d = x * x + y * y                        # same order as the distance, no sqrt\n        if len(heap) < k:\n            heapq.heappush(heap, (-d, x, y))\n        elif -d > heap[0][0]:                    # closer than the farthest one kept\n            heapq.heapreplace(heap, (-d, x, y))\n    return [[x, y] for _, x, y in heap]",
   "complexity": "O(n log k) time, O(k) space: each point costs at most one O(log k) heap operation.",
   "explain": [
    "Brute force: compute every distance, sort the points by it and take the first k. That is O(n log n).",
    "Use the squared distance: it orders the points the same way and stays an exact integer.",
    "You only need the k smallest, so a bounded heap beats sorting everything: O(n log k).",
    "Keep the k closest in a max-heap, so the farthest of them sits on top and is the first to leave.",
    "Python only has a min-heap, so negate the key."
   ],
   "dryrun": "Example 2, k = 2. Point (3, 3) has squared distance 18. The heap is not full, so I push key -18. Point (5, -1) has 26. The heap has one item, so I push -26, and now the top is -26, the farthest. Point (-2, 4) has 20, so its key is -20. That is bigger than the top key -26, so I replace the top. The heap now holds -20 and -18, which are the points (-2, 4) and (3, 3). I return those two in any order.",
   "tests": "def srt(ps):\n    return sorted(map(tuple, ps))\n\nassert srt(nearest_drops([[1, 3], [-2, 2]], 1)) == [(-2, 2)]\nassert srt(nearest_drops([[3, 3], [5, -1], [-2, 4]], 2)) == [(-2, 4), (3, 3)]\nassert nearest_drops([[0, 0]], 1) == [[0, 0]]\nassert srt(nearest_drops([[1, 1], [1, 1], [9, 9]], 2)) == [(1, 1), (1, 1)]\nassert srt(nearest_drops([[i, i] for i in range(1000)], 3)) == [(0, 0), (1, 1), (2, 2)]\nassert len(nearest_drops([[i, -i] for i in range(100000)], 10)) == 10",
   "followups": [
    {
     "q": "Can you get O(n) on average?",
     "a": "Yes, with QuickSelect. Partition the points around the squared distance of a random pivot and recurse only into the side that contains position k. Expected O(n), worst case O(n^2) with bad pivots, and it needs all the points in memory. It is the same shape as the k-th largest follow-up on day 3."
    },
    {
     "q": "Customers arrive one at a time, and at any moment you must report the current k nearest.",
     "a": "The heap is already online: each new point costs O(log k) and memory stays O(k). QuickSelect needs the whole array, so re-running it for each arrival would cost O(n) every time."
    },
    {
     "q": "Why compare squared distances, and when would that stop working?",
     "a": "Squaring keeps the order for non-negative distances and keeps the arithmetic in exact integers: no square root and no floating-point rounding. It stops working when the distance is not the straight-line one on a flat grid, for example latitude and longitude on a sphere; then compare any increasing function of the true distance."
    }
   ],
   "reveal": {
    "lc": "LeetCode 973 (medium)",
    "topic": "K closest points to origin: bounded max-heap, or QuickSelect",
    "pattern": "heap"
   }
  },
  {
   "id": "d07-b",
   "minutes": 15,
   "title": "Matching stretches",
   "scenario": "A fulfillment center logs the net change in stock for each hour: positive numbers are arrivals, and negative numbers are outgoing shipments or returns, so a value can also be zero. A stretch is an unbroken run of one or more consecutive hours. Given the hourly changes and a target k, return how many stretches have a total change of exactly k.",
   "examples": [
    {
     "input": "changes = [1, 1, 1], k = 2",
     "output": "2",
     "note": "Hours 0 to 1, and hours 1 to 2."
    },
    {
     "input": "changes = [1, 2, 3], k = 3",
     "output": "2",
     "note": "The stretch [1, 2] and the single hour [3]."
    },
    {
     "input": "changes = [1, -1, 0], k = 0",
     "output": "3",
     "note": "The stretches [1, -1], [1, -1, 0] and [0]."
    }
   ],
   "constraints": [
    "1 <= len(changes) <= 20,000",
    "-1000 <= change <= 1000",
    "-10^7 <= k <= 10^7"
   ],
   "clarify": [
    {
     "q": "Can the values be negative or zero?",
     "a": "Yes."
    },
    {
     "q": "Are stretches counted by position, so equal-looking stretches in different places count separately?",
     "a": "Yes. Count by position."
    },
    {
     "q": "Does a stretch need at least one hour?",
     "a": "Yes."
    },
    {
     "q": "What do I return if no stretch matches?",
     "a": "0."
    }
   ],
   "starter": "def count_stretches(changes: list[int], k: int) -> int:\n    ...",
   "hints": [
    "Think about the running total after each hour. How does the total of one stretch relate to two of those running totals?",
    "Use prefix sums with a hash map from each prefix value to how many times it has occurred. At each hour, add the number of earlier prefixes equal to the current prefix minus k.",
    "seen = {0: 1}, total = 0, answer = 0. For each x: total += x; answer += seen.get(total - k, 0); then seen[total] = seen.get(total, 0) + 1. Count before you record, so a prefix is never paired with itself."
   ],
   "solution": "def count_stretches(changes, k):\n    seen = {0: 1}                 # prefix total -> times seen; 0 stands for \"before hour 0\"\n    total = answer = 0\n    for x in changes:\n        total += x\n        answer += seen.get(total - k, 0)         # earlier prefixes that leave exactly k\n        seen[total] = seen.get(total, 0) + 1\n    return answer",
   "complexity": "O(n) time, O(n) space for the map of prefix totals.",
   "explain": [
    "Brute force: try every start and end and add up the stretch, extending a running sum as the end moves. That is O(n^2), or O(n^3) if you re-add every stretch.",
    "Let P[i] be the total of the first i hours. The stretch from hour i to hour j - 1 totals P[j] - P[i].",
    "So for each end j you need the number of earlier prefixes equal to P[j] - k.",
    "Keep a hash map from prefix value to count, starting with {0: 1} for the empty prefix.",
    "Count first, then record the current prefix."
   ],
   "dryrun": "Example 2, [1, 2, 3] with k = 3. seen is {0: 1} and total is 0. Hour 1: total becomes 1, and I look up 1 - 3 = -2, which has no matches; I record 1. Hour 2: total becomes 3, and I look up 0, which was seen once, so answer is 1: that is the stretch [1, 2]. I record 3. Hour 3: total becomes 6, and I look up 3, seen once, so answer is 2: the single hour [3]. I return 2.",
   "tests": "assert count_stretches([1, 1, 1], 2) == 2\nassert count_stretches([1, 2, 3], 3) == 2\nassert count_stretches([1, -1, 0], 0) == 3\nassert count_stretches([0, 0, 0], 0) == 6\nassert count_stretches([5], 5) == 1\nassert count_stretches([5], 4) == 0\nassert count_stretches([-1, -1, 1], 0) == 1\nassert count_stretches([1000] * 20000, 2000) == 19999",
   "followups": [
    {
     "q": "Every value is positive. Can you drop the hash map?",
     "a": "Yes: a sliding window with two pointers. Grow the right end and shrink the left end while the total is above k. That is O(n) time and O(1) space. It relies on positive values, which make the total grow as the window grows; with negatives or zeros it breaks, which is why the general case needs the map."
    },
    {
     "q": "The changes arrive as an endless stream and you answer after each hour. What state do you keep?",
     "a": "The same loop works online. You keep the running total, the answer so far and the map. The map grows with the number of distinct prefix totals, up to the length of the stream. If only recent hours matter, drop totals that fall outside the window."
    },
    {
     "q": "Why does the map start with {0: 1}?",
     "a": "It stands for the empty prefix before hour 0, so a stretch that begins at the very first hour is counted. Without it, the stretch [1, 2] in [1, 2, 3] with k = 3 would be missed, because it needs a prefix total of 0 to subtract."
    }
   ],
   "reveal": {
    "lc": "LeetCode 560 (medium)",
    "topic": "Subarray sum equals K: prefix sums plus a hash map",
    "pattern": "prefix"
   }
  }
 ]
});
window.LOOP_DAILY.days.push({
 "date": "2026-10-29",
 "n": 8,
 "problems": [
  {
   "id": "d08-a",
   "minutes": 20,
   "title": "Code changes",
   "scenario": "A catalogue system renames a product code by changing exactly one letter at a time. Every new code you pass through must be on an approved list; the code you start from does not need to be on it. Given a start code, a target code and the approved list (all codes have the same length and use lowercase letters), return the number of codes in the shortest sequence, counting both the start and the target, or 0 if no sequence exists. The target must be on the approved list.",
   "examples": [
    {
     "input": "begin = \"hit\", end = \"cog\", words = [\"hot\", \"dot\", \"dog\", \"lot\", \"log\", \"cog\"]",
     "output": "5",
     "note": "hit, hot, dot, dog, cog."
    },
    {
     "input": "begin = \"hit\", end = \"cog\", words = [\"hot\", \"dot\", \"dog\", \"lot\", \"log\"]",
     "output": "0",
     "note": "The target is not approved, so no sequence is allowed."
    },
    {
     "input": "begin = \"a\", end = \"c\", words = [\"a\", \"b\", \"c\"]",
     "output": "2",
     "note": "a, then c in one change."
    }
   ],
   "constraints": [
    "1 <= len(code) <= 10",
    "1 <= len(words) <= 5000",
    "All codes have the same length and use a to z",
    "begin != end",
    "words has no duplicates"
   ],
   "clarify": [
    {
     "q": "Does the start code have to be on the approved list?",
     "a": "No."
    },
    {
     "q": "Must the target be on the list?",
     "a": "Yes. If it is not, return 0."
    },
    {
     "q": "Do I return the sequence or its length?",
     "a": "Its length, counting both ends."
    },
    {
     "q": "Can the sequence pass through the start code again?",
     "a": "It is allowed, but it can never help."
    }
   ],
   "starter": "def shortest_rename(begin: str, end: str, words: list[str]) -> int:\n    ...",
   "hints": [
    "Imagine each code as a point, with two codes joined when they differ by one letter. You want the fewest steps from begin to end. How can you explore so that the first time you reach the target is by the shortest route?",
    "Run a BFS on an implicit graph. Do not build all pairs: generate a code's neighbours by changing each position to each of the 26 letters and checking membership in a set.",
    "Put the words in a set. The queue holds (code, length). Pop one; if it equals end, return its length. For each position and letter, build the candidate; if it is in the set, remove it from the set (that is the visited mark) and push (candidate, length + 1). If the queue empties, return 0."
   ],
   "solution": "from collections import deque\nfrom string import ascii_lowercase\n\ndef shortest_rename(begin, end, words):\n    pool = set(words)\n    if end not in pool:\n        return 0\n    pool.discard(begin)\n    q = deque([(begin, 1)])\n    while q:\n        code, steps = q.popleft()\n        if code == end:\n            return steps\n        for i in range(len(code)):\n            for ch in ascii_lowercase:\n                nxt = code[:i] + ch + code[i + 1:]\n                if nxt in pool:\n                    pool.remove(nxt)             # removing = marking visited, so each code is queued once\n                    q.append((nxt, steps + 1))\n    return 0",
   "complexity": "O(N x L x 26 x L) time for N codes of length L (each of the 26 L candidates costs O(L) to build); O(N x L) space.",
   "explain": [
    "Brute force: compare every code with every other code to find neighbours (N^2 comparisons of length L), then search that graph for the shortest route. N = 5000 means 25 million comparisons.",
    "Better: do not precompute all pairs. Generate a code's possible neighbours by trying every letter in every position, 26 x L candidates, each checked in a set.",
    "Fewest steps in an unweighted graph is BFS: the first time you pop the target, you have the minimum.",
    "Remove a code from the set as soon as you queue it. That is the visited marker, so each code is queued once.",
    "The start code need not be approved, but the target must be."
   ],
   "dryrun": "Example 1. The pool is {hot, dot, dog, lot, log, cog} and the target is in it. The queue starts as (hit, 1). I pop hit. Changing its letters finds hot (middle letter i to o), so I remove hot from the pool and queue (hot, 2). I pop hot and find dot and lot (first letter), so I queue (dot, 3) and (lot, 3). I pop dot and find dog, so I queue (dog, 4). I pop lot and find log, so I queue (log, 4). I pop dog and find cog, so I queue (cog, 5). I pop log; cog is already gone from the pool. I pop cog, which equals the target, and return 5.",
   "tests": "assert shortest_rename(\"hit\", \"cog\", [\"hot\", \"dot\", \"dog\", \"lot\", \"log\", \"cog\"]) == 5\nassert shortest_rename(\"hit\", \"cog\", [\"hot\", \"dot\", \"dog\", \"lot\", \"log\"]) == 0\nassert shortest_rename(\"a\", \"c\", [\"a\", \"b\", \"c\"]) == 2\nassert shortest_rename(\"a\", \"b\", [\"b\"]) == 2\nassert shortest_rename(\"ab\", \"cd\", [\"cd\"]) == 0\nassert shortest_rename(\"ab\", \"cd\", [\"cb\", \"cd\"]) == 3\nassert shortest_rename(\"hot\", \"dog\", [\"hot\", \"dog\"]) == 0\nassert shortest_rename(\"hot\", \"dog\", [\"hot\", \"dog\", \"dot\"]) == 3",
   "followups": [
    {
     "q": "You know both ends. Can you search from both sides?",
     "a": "Yes, with a bidirectional BFS. Keep a frontier set at each end, always expand the smaller one, and stop when a new code is found in the other frontier. With branching factor b and distance d it explores about 2 x b^(d/2) codes instead of b^d."
    },
    {
     "q": "Return one actual shortest sequence, not only its length.",
     "a": "Store a parent for each code when you queue it, as a dict from code to the code it came from. When you reach the target, walk the parents back to the start and reverse the list. To list every shortest sequence, keep all parents from the previous level and backtrack through them."
    },
    {
     "q": "Why generate 26 x L candidates per code and not compare all pairs? Is that always better?",
     "a": "Generating costs about 26 x L x L per code, independent of N; comparing pairs costs about N x L per code. With N = 5000 and L = 10 that is roughly 2,600 versus 50,000. For a huge alphabet or a tiny N, pairs can win. Another option is a dict of wildcard patterns such as h_t, so that neighbours share a bucket."
    }
   ],
   "reveal": {
    "lc": "LeetCode 127 (hard)",
    "topic": "Word ladder: BFS on an implicit graph",
    "pattern": "graphs"
   }
  },
  {
   "id": "d08-b",
   "minutes": 12,
   "title": "Warmer days ahead",
   "scenario": "A refrigerated locker records its peak temperature once a day. For every day, work out how many days you must wait until a strictly warmer day arrives. If no later day is warmer, the answer for that day is 0. Given the list of daily temperatures, return the list of waits, one per day.",
   "examples": [
    {
     "input": "[73, 74, 75, 71, 69, 72, 76, 73]",
     "output": "[1, 1, 4, 2, 1, 1, 0, 0]",
     "note": "Day 2 has 75 and waits 4 days for 76. The last two days never see a warmer one."
    },
    {
     "input": "[30, 40, 50, 60]",
     "output": "[1, 1, 1, 0]",
     "note": "Each day is followed at once by a warmer one, except the last."
    },
    {
     "input": "[60, 50, 40]",
     "output": "[0, 0, 0]",
     "note": "Nothing later is ever warmer."
    }
   ],
   "constraints": [
    "1 <= len(temps) <= 10^5",
    "30 <= temperature <= 100"
   ],
   "clarify": [
    {
     "q": "Does an equal temperature count as warmer?",
     "a": "No. It must be strictly warmer."
    },
    {
     "q": "What exactly is the answer for day i?",
     "a": "The number of days from day i to the next warmer day. If day 2 waits for day 6, the answer is 4."
    },
    {
     "q": "What if there is no warmer day later?",
     "a": "Return 0 for that day."
    },
    {
     "q": "How long can the list be?",
     "a": "Up to 100,000 days, so checking every pair of days is too slow."
    }
   ],
   "starter": "def days_to_warmer(temps: list[int]) -> list[int]:\n    ...",
   "hints": [
    "When you reach a warm day, which earlier days can you answer right away? What do the days you cannot answer yet have in common?",
    "Use a monotonic stack of day indices whose answers are still unknown. Their temperatures never increase from the bottom of the stack to the top.",
    "For each day i: while the stack is not empty and temps[i] is greater than the temperature of the day on top, pop that day j and set answer[j] = i - j. Then push i. Days left on the stack keep 0."
   ],
   "solution": "def days_to_warmer(temps):\n    ans = [0] * len(temps)\n    stack = []                                   # days still waiting for a warmer one\n    for i, t in enumerate(temps):\n        while stack and t > temps[stack[-1]]:\n            j = stack.pop()\n            ans[j] = i - j                       # day i is the first warmer day for day j\n        stack.append(i)\n    return ans",
   "complexity": "O(n) time, O(n) space: every index is pushed once and popped at most once.",
   "explain": [
    "Brute force: for each day, scan forward until a warmer day shows up. That is O(n^2) in the worst case, for example a steadily falling list.",
    "Turn the question around: when a new day arrives, it is the answer for every earlier day that is still waiting and is cooler.",
    "The waiting days form a run with non-increasing temperatures, so the cooler ones are always the most recent. They sit on top of a stack.",
    "Pop while the new temperature beats the top and record i - j for each popped day j.",
    "Then push the new day. Days that stay on the stack never see a warmer day, so they keep 0."
   ],
   "dryrun": "Example 1, [73, 74, 75, 71, 69, 72, 76, 73]. Day 0 (73): the stack is empty, so I push 0. Day 1 (74): it beats 73, so I pop 0 and set ans[0] = 1; I push 1. Day 2 (75): I pop 1 and set ans[1] = 1; push 2. Day 3 (71): it does not beat 75, so I push 3. Day 4 (69): I push 4. Day 5 (72): I pop day 4 (69) and set ans[4] = 1, then pop day 3 (71) and set ans[3] = 2; 75 on top is bigger, so I stop and push 5. Day 6 (76): I pop day 5, ans[5] = 1, then pop day 2, ans[2] = 4; I push 6. Day 7 (73): I push 7. Days 6 and 7 stay at 0. The answer is [1, 1, 4, 2, 1, 1, 0, 0].",
   "tests": "assert days_to_warmer([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]\nassert days_to_warmer([30, 40, 50, 60]) == [1, 1, 1, 0]\nassert days_to_warmer([60, 50, 40]) == [0, 0, 0]\nassert days_to_warmer([50]) == [0]\nassert days_to_warmer([50, 50, 50]) == [0, 0, 0]\nassert days_to_warmer([99] * 50000 + [100]) == [50000 - i for i in range(50000)] + [0]",
   "followups": [
    {
     "q": "Temperatures only range from 30 to 100. Is there another O(n) approach that avoids the stack?",
     "a": "Yes. Walk the days from right to left and keep nxt[temp], the latest index seen for each of the 71 temperatures. For day i, the answer is the smallest nxt[t] - i over the temperatures t above it, a scan of at most 70 slots. That is O(71 x n) time with only a small fixed array besides the output. It wins only when the range is tiny."
    },
    {
     "q": "The days now wrap around: after the last day comes the first one again. How do you handle that?",
     "a": "Walk the indices twice, using i % n, but push an index only during the first pass. A wait is measured around the circle, so it is always less than n. A day still on the stack after the second pass keeps 0."
    },
    {
     "q": "Your loop has a while inside a for. Why is it O(n) and not O(n^2)?",
     "a": "Each index is pushed exactly once and popped at most once, so the total number of pops across the whole run is at most n. However the pops are spread over the days, the sum of all the inner iterations stays bounded by n."
    }
   ],
   "reveal": {
    "lc": "LeetCode 739 (medium)",
    "topic": "Daily temperatures: monotonic stack",
    "pattern": "stack"
   }
  }
 ]
});
