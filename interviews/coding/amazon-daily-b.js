/* Amazon loop: the daily two, days 9 to 15. Every solution and test was run with Python 3.12. */
window.LOOP_DAILY = window.LOOP_DAILY || { days: [] };
window.LOOP_DAILY.days.push({
  date: "2026-10-30",
  n: 9,
  problems: [
    {
      id: "d09-a",
      minutes: 10,
      title: "Two catalog layouts",
      scenario: "The catalog team stores product categories as a tree. Every category has a numeric label and at most two sub-categories, a left one and a right one. A category with no sub-categories is a leaf, and shoppers see the leaf labels from left to right as the aisle order. Two layouts are shelf-equivalent when their aisle orders are the same sequence of labels, even if the two trees are shaped differently. Given the roots of two layouts, return `True` if they are shelf-equivalent, otherwise `False`.",
      examples: [
        {
          input: "a = [3,5,1,6,2,9,8,None,None,7,4], b = [3,5,1,6,7,4,2,None,None,None,None,None,None,9,8]",
          output: "True",
          note: "Both layouts have leaves 6, 7, 4, 9, 8 in that order, although the shapes differ."
        },
        {
          input: "a = [1,2,3], b = [1,3,2]",
          output: "False",
          note: "The leaves read 2, 3 in a and 3, 2 in b. Same labels, different order."
        },
        {
          input: "a = [1,2], b = [1,None,2]",
          output: "True",
          note: "Each layout has one leaf, labelled 2. One sits on the left and one on the right, which does not matter."
        }
      ],
      constraints: [
        "1 <= nodes in each tree <= 200",
        "0 <= label <= 200",
        "labels can repeat; compare the order of leaf labels, not the set of labels",
        "trees are given in level order with None for a missing child, and the starter has a `build` helper"
      ],
      clarify: [
        {
          q: "Can a layout be empty?",
          a: "No. Each layout has at least one category."
        },
        {
          q: "Do I compare labels or the category objects?",
          a: "Labels. Two different leaves with the same label count as equal."
        },
        {
          q: "If the root has no sub-categories, is it a leaf?",
          a: "Yes. A one-node tree has one leaf: the root."
        },
        {
          q: "How large and how deep can a layout get?",
          a: "Up to 200 nodes each. Depth is not a concern here, but be ready to say what changes if it were."
        }
      ],
      starter: "from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build(vals):\n    # level order, None for a missing child: build([1, 2, None, 3]) is 1 with left child 2, and 2 has left child 3\n    if not vals:\n        return None\n    root = TreeNode(vals[0])\n    q, i = deque([root]), 1\n    while q and i < len(vals):\n        node = q.popleft()\n        if i < len(vals) and vals[i] is not None:\n            node.left = TreeNode(vals[i])\n            q.append(node.left)\n        i += 1\n        if i < len(vals) and vals[i] is not None:\n            node.right = TreeNode(vals[i])\n            q.append(node.right)\n        i += 1\n    return root\n\ndef same_aisles(a, b):\n    ...\n",
      hints: [
        "Two trees with different shapes can still match. Decide what exactly has to be equal, and what you can ignore.",
        "Write down the leaf labels of each tree in left-to-right order, using a depth-first walk that visits the left child before the right child. Then compare the two lists.",
        "Write a helper `walk(node)`: return if the node is `None`; if it has no left and no right child, append its label to a list; otherwise `walk(left)` then `walk(right)`. Run it on both roots and return `list_a == list_b`."
      ],
      solution: "from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build(vals):\n    # level order, None for a missing child: build([1, 2, None, 3]) is 1 with left child 2, and 2 has left child 3\n    if not vals:\n        return None\n    root = TreeNode(vals[0])\n    q, i = deque([root]), 1\n    while q and i < len(vals):\n        node = q.popleft()\n        if i < len(vals) and vals[i] is not None:\n            node.left = TreeNode(vals[i])\n            q.append(node.left)\n        i += 1\n        if i < len(vals) and vals[i] is not None:\n            node.right = TreeNode(vals[i])\n            q.append(node.right)\n        i += 1\n    return root\n\ndef leaves(root):\n    out = []\n    def walk(n):\n        if n is None:\n            return\n        if n.left is None and n.right is None:\n            out.append(n.val)          # no children: a leaf, record it\n            return\n        walk(n.left)                   # left before right keeps reading order\n        walk(n.right)\n    walk(root)\n    return out\n\ndef same_aisles(a, b):\n    return leaves(a) == leaves(b)\n",
      complexity: "O(a + b) time, O(a + b) space: every node is visited once and the two leaf lists hold at most that many labels; the recursion adds O(height).",
      explain: [
        "Brute force: list the leaf labels of each tree in order, then compare the two lists. That is O(a + b) time and space, and it is already the standard answer; the work is in getting 'leaf' and 'order' right.",
        "A leaf has no left child and no right child. A node with only one child is not a leaf.",
        "Visit the left child before the right child, so labels come out in reading order.",
        "Compare the two lists with `==`. The shapes do not matter, only the sequence.",
        "The improvement to mention: yield leaves lazily from two generators and compare them side by side, so a mismatch near the start costs almost nothing."
      ],
      dryrun: "Tree a, example 1. Start at 3: it has children, so go left to 5. 5 has children, go left to 6. 6 has no children: record 6. Back at 5, go right to 2. 2 has children: its left child 7 is a leaf, record 7, then its right child 4, record 4. Back up to 3, go right to 1. 1's left child is 9, record 9, then 8, record 8. List a is [6, 7, 4, 9, 8]. Tree b in the same way gives [6, 7, 4, 9, 8]. The lists are equal, so return True.",
      tests: "# uses build from the starter\nassert same_aisles(build([3,5,1,6,2,9,8,None,None,7,4]), build([3,5,1,6,7,4,2,None,None,None,None,None,None,9,8])) is True\nassert same_aisles(build([1,2,3]), build([1,3,2])) is False\nassert same_aisles(build([1,2]), build([1,None,2])) is True\nassert same_aisles(build([1]), build([1])) is True            # a lone root is a leaf\nassert same_aisles(build([1]), build([2])) is False\nassert same_aisles(build([1,2,3]), build([4,2,3])) is True    # inner labels do not matter\nassert same_aisles(build([1,2,3,4]), build([1,2,3])) is False\nassert same_aisles(build([5,1,None,None,3]), build([9,3])) is True   # a node with one child is not a leaf\nprint(\"all good\")\n",
      followups: [
        {
          q: "The catalog is not binary: each category can have any number of sub-categories, and the trees are huge. How do you compare without building both full lists?",
          a: "Write a generator that yields leaves lazily and compare two generators side by side with `zip_longest` and a sentinel. A mismatch at the first leaf then costs O(depth), not O(n). For n-ary nodes, a node is a leaf when `node.children` is empty. The generator yields the label for a leaf; otherwise it does `yield from` on each child in order."
        },
        {
          q: "A layout is 100,000 categories deep, a long chain. What breaks and what do you do?",
          a: "Python's default recursion limit is about 1000, so the walk raises `RecursionError`. Use an explicit stack: push the root, pop a node, push its right child then its left child so the left one pops first, and record the label when both children are `None`."
        },
        {
          q: "Why compare the leaf sequence and not, say, the sorted leaf labels?",
          a: "Order is part of the requirement. Sorting would call [2, 3] and [3, 2] equal, which example 2 says is wrong. Labels can also repeat, so a set would lose the counts."
        }
      ],
      reveal: {
        lc: "LeetCode 872 Leaf-Similar Trees (easy)",
        topic: "Depth-first walk that collects leaves in order",
        pattern: "trees"
      }
    },
    {
      id: "d09-b",
      minutes: 15,
      title: "Fewest relay flights",
      scenario: "A cargo drone moves along a line of relay stations numbered 0 to n-1 and starts at station 0. Station i has a number `reach[i]`: from there the drone can fly forward to any station from i+1 up to i+`reach[i]` in a single flight. Given `reach`, return the smallest number of flights needed to land on station n-1. You can assume the last station can always be reached.",
      examples: [
        {
          input: "reach = [2,3,1,1,4]",
          output: "2",
          note: "Fly 0 to 1, then 1 to 4 (reach 3 lands exactly on station 4). No single flight gets there."
        },
        {
          input: "reach = [1,1,1,1]",
          output: "3",
          note: "Each station only reaches the next one, so every step is a flight."
        },
        {
          input: "reach = [5]",
          output: "0",
          note: "The drone already stands on the last station."
        }
      ],
      constraints: [
        "1 <= n <= 10^4",
        "0 <= reach[i] <= 1000",
        "the last station is always reachable from station 0"
      ],
      clarify: [
        {
          q: "Can the drone fly less than its full reach?",
          a: "Yes. Any distance from 1 up to `reach[i]`."
        },
        {
          q: "What do I return if there is only one station?",
          a: "0, the drone is already there."
        },
        {
          q: "Can `reach[i]` be 0?",
          a: "Yes. That station is a dead end, but the last station stays reachable by some other route."
        },
        {
          q: "Do you want the route or only the count?",
          a: "Only the count."
        }
      ],
      starter: "def fewest_flights(reach):\n    ...\n",
      hints: [
        "After k flights the drone can be on any station in a block. Think about the whole block, not one chosen path.",
        "Treat it as levels, like a breadth-first search, but do it greedily without a queue: track where the current block ends and the farthest station anyone in the scanned part can reach.",
        "Scan i from 0 to n-2. Update `far = max(far, i + reach[i])`. When i reaches the end of the current block, one more flight is unavoidable: add 1 to the count and set `end = far`. Return the count."
      ],
      solution: "def fewest_flights(reach):\n    flights = 0\n    end = 0                       # last station reachable with `flights` flights\n    far = 0                       # farthest station reachable with one more flight\n    for i in range(len(reach) - 1):\n        far = max(far, i + reach[i])\n        if i == end:              # the current block is used up: one more flight\n            flights += 1\n            end = far\n    return flights\n",
      complexity: "O(n) time, O(1) space: one pass and three integers.",
      explain: [
        "Brute force: `best[i]` is the fewest flights to reach station i; for each i, try every earlier j that can reach i. O(n^2) time, O(n) space.",
        "The stations first reachable on flight k form one block that starts right after the previous block, so you do not have to track individual stations.",
        "Scan the stations in order. For each one, remember the farthest it could reach.",
        "When the scan passes the end of the current block, one more flight is unavoidable, and the next block ends at the farthest reach seen so far.",
        "Stop at n-2: the last station does not need a flight from itself."
      ],
      dryrun: "reach = [2,3,1,1,4]. Start: flights = 0, end = 0, far = 0. i = 0: far = max(0, 0+2) = 2. i equals end (0), so take a flight: flights = 1, end = 2. i = 1: far = max(2, 1+3) = 4. i = 2: far = max(4, 2+1) = 4. i equals end (2), so another flight: flights = 2, end = 4. i = 3: far stays 4, and i is not the end. The loop stops at n-2 = 3. Answer: 2.",
      tests: "assert fewest_flights([2,3,1,1,4]) == 2\nassert fewest_flights([2,3,0,1,4]) == 2\nassert fewest_flights([1,1,1,1]) == 3\nassert fewest_flights([5]) == 0\nassert fewest_flights([1,2]) == 1\nassert fewest_flights([10,1,1,1,1]) == 1\nassert fewest_flights([1,2,1,1,1]) == 3\nprint(\"all good\")\n",
      followups: [
        {
          q: "Some stations may be unreachable. What do you return then, and where does the code change?",
          a: "Return -1. Inside the loop, if `i > far` then no flight ever lands on station i, so return -1. After the loop, return `flights` only if `far >= n-1`, otherwise -1."
        },
        {
          q: "Why is it safe to always extend to the farthest reach? Could a shorter hop ever win?",
          a: "After k flights the drone can stand on any station up to `end`, and every one of them is a legal place to start the next flight. So the stations reachable with k+1 flights run up to the maximum of `i + reach[i]` over that whole range. Nothing is lost by taking the maximum: it is exactly the next level of a breadth-first search, and each level is one contiguous range, so no queue is needed."
        },
        {
          q: "Return the actual route, not only the count.",
          a: "While scanning a block, remember the station that gave the largest `i + reach[i]`. The route is 0, then the best station of each block between the start and the last station, then n-1. Time stays O(n); the route costs O(flights) space."
        }
      ],
      reveal: {
        lc: "LeetCode 45 Jump Game II (medium)",
        topic: "Greedy reach window (breadth-first levels without a queue)",
        pattern: "dp"
      }
    }
  ]
});
window.LOOP_DAILY.days.push({
  date: "2026-10-31",
  n: 10,
  problems: [
    {
      id: "d10-a",
      minutes: 15,
      title: "Staging copy of a hub network",
      scenario: "Delivery hubs form a network. Every hub has an integer id and a list of the hubs it is directly linked to. Links go both ways: if hub A lists B, then B lists A. Every hub can be reached from any other through some chain of links. You are given one hub. Build a full copy of the network for a staging system: new hub objects with the same ids and the same links among the copies, sharing no object with the original. Return the copy of the hub you were given. If you are given `None`, return `None`.",
      examples: [
        {
          input: "adj = [[2,4],[1,3],[2,4],[1,3]], start = hub 1 (hub i+1 links to the ids in adj[i])",
          output: "a copy of hub 1 whose links are copies of hubs 2 and 4",
          note: "Four hubs in a ring. Copy 1 links to copy 2 and copy 4, and copies 2 and 4 both link to copy 3."
        },
        {
          input: "adj = [[]]",
          output: "one new hub with id 1 and no links",
          note: "A single hub with nothing to link."
        },
        {
          input: "adj = [[2],[1]]",
          output: "two new hubs linked to each other",
          note: "Two hubs that point at each other. The copy must not follow the cycle forever."
        }
      ],
      constraints: [
        "0 <= number of hubs <= 100",
        "ids are unique, 1 to 100",
        "no duplicate links and no hub links to itself",
        "the starter has `Hub` and a `build` helper that turns an adjacency list into a network"
      ],
      clarify: [
        {
          q: "Can the network contain cycles?",
          a: "Yes, most of them do."
        },
        {
          q: "Are links always two-way?",
          a: "In the given input, yes. Your code should not depend on that if you can avoid it."
        },
        {
          q: "Can the starting hub be `None`?",
          a: "Yes, return `None`."
        },
        {
          q: "Should the copied link lists keep the original order?",
          a: "Yes."
        }
      ],
      starter: "class Hub:\n    def __init__(self, id, links=None):\n        self.id = id\n        self.links = links if links is not None else []\n\ndef build(adj):\n    # adj[i] lists the ids linked to hub i + 1; returns hub 1, or None for an empty list\n    hubs = [Hub(i + 1) for i in range(len(adj))]\n    for i, ids in enumerate(adj):\n        hubs[i].links = [hubs[j - 1] for j in ids]\n    return hubs[0] if hubs else None\n\ndef copy_network(hub):\n    ...\n",
      hints: [
        "If you copy a hub and then copy each of its neighbors the same way, a ring of hubs sends you around forever. What must you be able to answer before you copy a hub?",
        "Keep a dictionary from each original hub to its copy, and consult it before making a copy. Walk the network with a queue (breadth-first) or with recursion (depth-first).",
        "Make the copy of the start hub, store it in the dictionary, and queue the start hub. Take a hub from the queue; for each neighbor, make its copy if the dictionary has none (and queue it), then append the neighbor's copy to the current copy's links."
      ],
      solution: "class Hub:\n    def __init__(self, id, links=None):\n        self.id = id\n        self.links = links if links is not None else []\n\ndef build(adj):\n    # adj[i] lists the ids linked to hub i + 1; returns hub 1, or None for an empty list\n    hubs = [Hub(i + 1) for i in range(len(adj))]\n    for i, ids in enumerate(adj):\n        hubs[i].links = [hubs[j - 1] for j in ids]\n    return hubs[0] if hubs else None\n\nfrom collections import deque\n\ndef copy_network(hub):\n    if hub is None:\n        return None\n    made = {hub: Hub(hub.id)}          # original hub -> its copy\n    todo = deque([hub])\n    while todo:\n        cur = todo.popleft()\n        for nb in cur.links:\n            if nb not in made:         # first time we see this hub: make its copy\n                made[nb] = Hub(nb.id)\n                todo.append(nb)\n            made[cur].links.append(made[nb])\n    return made[hub]\n",
      complexity: "O(V + E) time, O(V) space: every hub is copied once and every link is followed once; the dictionary and queue hold up to V hubs.",
      explain: [
        "Brute force: recursively copy a hub, then recursively copy each neighbor. On any cycle it never stops, and even if you stopped it, one hub could be copied many times, so the copies would not be shared. It does not work.",
        "The fix is to remember every hub you have already copied: a dictionary from original hub to copy.",
        "Make the copy of the start hub, store it, and queue the original.",
        "Take a hub out of the queue. For each neighbor, if it has no copy yet, make one and queue the original. Either way, append the neighbor's copy to the current copy's links.",
        "Return the dictionary entry for the start hub."
      ],
      dryrun: "Example 1, start = hub 1. made = {1: copy1}, queue = [1]. Pop 1: its neighbors are 2 and 4. Hub 2 has no copy, so make copy2, queue it, and link copy1 to copy2. Same for 4: copy4, queued, linked. Pop 2: neighbors are 1 and 3. Hub 1 already has a copy, so only link copy2 to copy1. Hub 3 is new: make copy3, queue it, link it. Pop 4: neighbors 1 and 3 both have copies, so link copy4 to them. Pop 3: neighbors 2 and 4 both have copies, so link. The queue is empty. Return copy1.",
      tests: "# uses Hub and build from the starter\nfrom collections import deque\n\ndef shape(h):\n    seen, order, q = {h}, [], deque([h])\n    while q:\n        cur = q.popleft()\n        order.append(cur)\n        for nb in cur.links:\n            if nb not in seen:\n                seen.add(nb)\n                q.append(nb)\n    return {x.id: [n.id for n in x.links] for x in order}, order\n\ndef check(adj):\n    orig = build(adj)\n    cp = copy_network(orig)\n    if orig is None:\n        assert cp is None\n        return\n    s1, o1 = shape(orig)\n    s2, o2 = shape(cp)\n    assert s1 == s2                                          # same ids, same links\n    assert not ({id(x) for x in o1} & {id(x) for x in o2})   # no object shared with the original\n    assert cp.id == orig.id\n\ncheck([[2,4],[1,3],[2,4],[1,3]])\ncheck([[]])\ncheck([[2],[1]])\ncheck([])\ncheck([[2,3],[1,3],[1,2]])\ncheck([[2],[1,3],[2,4],[3]])\nprint(\"all good\")\n",
      followups: [
        {
          q: "The network now has 100,000 hubs in one long chain. What goes wrong with a recursive version, and does yours survive?",
          a: "A recursive walk hits Python's recursion limit (about 1000 frames) and raises `RecursionError`. The queue-based version has no recursion, so it survives. A depth-first version would need an explicit stack."
        },
        {
          q: "The network may be split into several separate groups, and you get a list of hubs, one per group. Copy all of it.",
          a: "Share one dictionary across the whole list. Loop over the given hubs, and run the same traversal only when a hub is not in the dictionary yet. Return the copies in the same order as the inputs."
        },
        {
          q: "Why key the dictionary by hub object and not by hub id?",
          a: "The links point to objects, so keying by object always matches what you meet while walking. Keying by id works only while ids are unique; if two hubs ever share an id (a reused warehouse number) they would be merged into one copy."
        }
      ],
      reveal: {
        lc: "LeetCode 133 Clone Graph (medium)",
        topic: "Graph traversal with an original-to-copy map",
        pattern: "graphs"
      }
    },
    {
      id: "d10-b",
      minutes: 15,
      title: "Shifts with a gap",
      scenario: "A delivery partner can pick shifts from a day-long list of n back-to-back slots. Slot i pays `pay[i]` dollars. The partner needs a break, so two slots that sit right next to each other (i and i+1) cannot both be taken. Choose any set of slots with no two adjacent, and return the largest total pay.",
      examples: [
        {
          input: "pay = [1,2,3,1]",
          output: "4",
          note: "Take slots 0 and 2: 1 + 3. Slots 1 and 3 give only 3."
        },
        {
          input: "pay = [2,7,9,3,1]",
          output: "12",
          note: "Take slots 0, 2 and 4: 2 + 9 + 1."
        },
        {
          input: "pay = [5,1,1,5]",
          output: "10",
          note: "The two 5s are three slots apart, so both can be taken."
        }
      ],
      constraints: ["1 <= n <= 10^5", "0 <= pay[i] <= 10^4"],
      clarify: [
        {
          q: "Can pay be negative?",
          a: "No. Every value is zero or more."
        },
        {
          q: "Can the partner take no slots at all?",
          a: "Yes, but with non-negative pay taking some slot never hurts, so the answer is at least the largest single pay."
        },
        {
          q: "Is adjacency only about slots i and i+1?",
          a: "Yes. One empty slot between two taken slots is enough."
        },
        {
          q: "Do you want the chosen slots or only the total?",
          a: "Only the total."
        }
      ],
      starter: "def best_pay(pay):\n    ...\n",
      hints: [
        "Look at the last slot. The best answer for the whole day either includes it or does not. What does each case leave you to solve?",
        "Dynamic programming: let `best[i]` be the best total using only the first i slots. The value for i depends only on the two values before it.",
        "`best[i] = max(best[i-1], best[i-2] + pay[i-1])`. Only the last two values are ever read, so keep two variables instead of a table."
      ],
      solution: "def best_pay(pay):\n    prev2 = prev1 = 0                 # best totals for the first i-2 and i-1 slots\n    for p in pay:\n        prev2, prev1 = prev1, max(prev1, prev2 + p)\n    return prev1\n",
      complexity: "O(n) time, O(1) space: one pass with two rolling values.",
      explain: [
        "Brute force: try every subset of slots with no two adjacent. The count grows like the Fibonacci numbers, so it dies past n of about 40.",
        "The same idea as a recursion: `best(i) = max(best(i-1), best(i-2) + pay[i])`. Plain recursion recomputes the same i many times and is still exponential.",
        "Store each `best(i)` once, in a table or a memo: O(n) time and space.",
        "Only the previous two values are ever read, so keep two variables and drop the table: O(1) space."
      ],
      dryrun: "pay = [1,2,3,1]. Start with prev2 = 0 and prev1 = 0. Slot value 1: new best = max(0, 0 + 1) = 1, so prev2 = 0, prev1 = 1. Value 2: max(1, 0 + 2) = 2, so prev2 = 1, prev1 = 2. Value 3: max(2, 1 + 3) = 4, so prev2 = 2, prev1 = 4. Value 1: max(4, 2 + 1) = 4. Return 4.",
      tests: "assert best_pay([1,2,3,1]) == 4\nassert best_pay([2,7,9,3,1]) == 12\nassert best_pay([5,1,1,5]) == 10\nassert best_pay([5]) == 5\nassert best_pay([0]) == 0\nassert best_pay([3,10]) == 10\nassert best_pay([2,1,1,2]) == 4\nassert best_pay([0,0,0]) == 0\nassert best_pay([10,1,1,10,1,1,10]) == 30\nprint(\"all good\")\n",
      followups: [
        {
          q: "The slots are now in a circle, so the last slot is next to the first. What changes?",
          a: "You cannot take both ends. Solve the line version twice, once on `pay[:-1]` and once on `pay[1:]`, and return the larger result. Handle n == 1 by returning `pay[0]`."
        },
        {
          q: "Return which slots were taken, not only the total.",
          a: "Keep the full table `best[0..n]`, then walk back from the end. If `best[i] == best[i-1]`, slot i-1 was skipped, so move to i-1. Otherwise it was taken, so record it and move to i-2. This costs O(n) space, which is why the two-variable version cannot do it."
        },
        {
          q: "The partner now needs at least k empty slots between any two taken slots. How does the recurrence change?",
          a: "`best[i] = max(best[i-1], best[i-k-1] + pay[i-1])`, reading a negative index as 0. With k = 1 this is the original rule. The two-variable trick becomes a rolling window of k+1 values, or keep the whole table."
        }
      ],
      reveal: {
        lc: "LeetCode 198 House Robber (medium); follow-up LeetCode 213",
        topic: "One-dimensional dynamic programming: take it or skip it",
        pattern: "dp"
      }
    }
  ]
});
window.LOOP_DAILY.days.push({
  date: "2026-11-01",
  n: 11,
  problems: [
    {
      id: "d11-a",
      minutes: 15,
      title: "How many bays",
      scenario: "A fulfillment center receives trucks. Truck i arrives at time `arrive` and leaves at time `depart`, with arrive < depart. A loading bay holds one truck at a time, and a bay is free again at the exact moment a truck leaves, so a truck that arrives at that moment can use it. The trucks come in no particular order. Return the smallest number of bays that lets every truck load with no waiting.",
      examples: [
        {
          input: "trucks = [[0,30],[5,10],[15,20]]",
          output: "2",
          note: "The long truck holds one bay all day. The other two never overlap each other, so they share a second bay."
        },
        {
          input: "trucks = [[1,5],[5,8]]",
          output: "1",
          note: "The first truck leaves at 5, the second arrives at 5, so one bay is enough."
        },
        {
          input: "trucks = [[1,4],[2,5],[3,6]]",
          output: "3",
          note: "At time 3 all three trucks are on site."
        }
      ],
      constraints: [
        "1 <= len(trucks) <= 10^4",
        "0 <= arrive < depart <= 10^6, all integers",
        "the list is in no particular order"
      ],
      clarify: [
        {
          q: "If one truck leaves exactly when another arrives, can they share a bay?",
          a: "Yes."
        },
        {
          q: "Can the list be empty?",
          a: "No, there is at least one truck."
        },
        {
          q: "Do I need to say which truck uses which bay?",
          a: "No, only the number of bays."
        },
        {
          q: "Are the times integers, and can they be large?",
          a: "Integers up to 10^6."
        }
      ],
      starter: "def min_bays(trucks):\n    ...\n",
      hints: [
        "A new bay is needed only when a truck arrives and every bay is busy. When a truck arrives, which bay is the one worth checking first?",
        "Sort the trucks by arrival time. Keep a min-heap of the departure times of the bays in use. The top of the heap is the bay that frees first.",
        "For each truck in arrival order: if the heap is not empty and `heap[0] <= arrive`, replace that bay's departure with this truck's departure (`heapq.heapreplace`). Otherwise push the departure, which opens a new bay. The answer is the heap size at the end."
      ],
      solution: "import heapq\n\ndef min_bays(trucks):\n    free_at = []                          # departure times of the bays in use\n    for arrive, depart in sorted(trucks):\n        if free_at and free_at[0] <= arrive:\n            heapq.heapreplace(free_at, depart)   # the earliest-freeing bay is free: reuse it\n        else:\n            heapq.heappush(free_at, depart)      # every bay is busy: open a new one\n    return len(free_at)\n",
      complexity: "O(n log n) time, O(n) space: one sort plus one heap operation per truck; the heap holds at most one entry per bay.",
      explain: [
        "Brute force: for each truck's arrival time t, count the trucks on site at that moment (arrive <= t < depart). The largest count is the answer. O(n^2) time.",
        "The answer is the peak number of trucks on site at once. Sorting by arrival lets you sweep time forward.",
        "A min-heap of departure times keeps the soonest-free bay at the top.",
        "If the top is at or before the arriving truck's arrival, reuse that bay (replace the top). If it is not, no other bay is free either, so open a new one (push).",
        "The heap size at the end equals the peak."
      ],
      dryrun: "Example 1, trucks sorted by arrival: [0,30], [5,10], [15,20]. Truck [0,30]: the heap is empty, so push 30. Heap [30]. Truck [5,10]: the top is 30, which is after 5, so every bay is busy; push 10. Heap [10, 30]. Truck [15,20]: the top is 10, which is at or before 15, so reuse that bay: replace 10 with 20. Heap [20, 30]. Two entries, so the answer is 2.",
      tests: "assert min_bays([[0,30],[5,10],[15,20]]) == 2\nassert min_bays([[7,10],[2,4]]) == 1\nassert min_bays([[1,5],[5,8]]) == 1\nassert min_bays([[1,4],[2,5],[3,6]]) == 3\nassert min_bays([[1,2]]) == 1\nassert min_bays([[1,10],[2,3],[3,4],[4,5]]) == 2\nassert min_bays([[5,6],[1,2],[3,4],[1,6]]) == 2\nprint(\"all good\")\n",
      followups: [
        {
          q: "Can you drop the heap and use less memory once the input is sorted?",
          a: "Yes. Sort the arrivals and the departures separately. Walk the arrivals with a pointer j over the departures: if `arrival >= departures[j]`, a bay has freed up, so move j on; otherwise count a new bay. Only the counts matter, not which truck holds which bay. Still O(n log n) for the sorts, O(1) extra after that."
        },
        {
          q: "Return a schedule: which bay each truck gets.",
          a: "Keep (depart, bay_id) pairs in the heap. On reuse, pop the pair and give the truck that bay id; on a new bay, give it the next unused id. To report by truck, sort the trucks' indexes by arrival so you can write the bay id back to the original position."
        },
        {
          q: "Each bay needs 10 minutes of cleaning after a truck leaves. What changes?",
          a: "Only the reuse test: reuse when `free_at[0] + 10 <= arrive`. Everything else stays the same. The reason the heap top still decides is that if the soonest-free bay is not ready, no other bay is either."
        }
      ],
      reveal: {
        lc: "LeetCode 253 Meeting Rooms II (medium)",
        topic: "Interval overlap count with a min-heap (or a sweep over sorted endpoints)",
        pattern: "intervals"
      }
    },
    {
      id: "d11-b",
      minutes: 15,
      title: "Exact box fill",
      scenario: "An order has `amount` units of items to pack so that every box is filled exactly. The warehouse stocks boxes in a few sizes: `sizes[i]` is how many units one box of type i holds, and you can use as many boxes of each type as you like. Return the fewest boxes that hold exactly `amount` units in total, or -1 if no combination of boxes can do it. An amount of 0 needs 0 boxes.",
      examples: [
        {
          input: "sizes = [1,2,5], amount = 11",
          output: "3",
          note: "5 + 5 + 1."
        },
        {
          input: "sizes = [2], amount = 3",
          output: "-1",
          note: "Boxes of 2 only make even totals."
        },
        {
          input: "sizes = [1,3,4], amount = 6",
          output: "2",
          note: "3 + 3. Starting with the biggest box gives 4 + 1 + 1, which is 3 boxes."
        }
      ],
      constraints: ["1 <= len(sizes) <= 12", "1 <= sizes[i] <= 2^31 - 1, all distinct", "0 <= amount <= 10^4"],
      clarify: [
        {
          q: "Can I use a box type more than once?",
          a: "Yes, as many times as you like."
        },
        {
          q: "Can a box be partly full?",
          a: "No. Every box must be completely full."
        },
        {
          q: "What if amount is 0?",
          a: "0 boxes."
        },
        {
          q: "Are the sizes sorted?",
          a: "No, and do not rely on it."
        }
      ],
      starter: "def fewest_boxes(sizes, amount):\n    ...\n",
      hints: [
        "Try the biggest box first on the third example. Does that give the best answer? If not, think about which smaller question you could answer for every amount below the target.",
        "Dynamic programming over amounts: `best[x]` is the fewest boxes that fill exactly x units.",
        "`best[0] = 0` and everything else starts at a value no real answer reaches (`amount + 1` works). For x from 1 to amount, for each size s <= x: `best[x] = min(best[x], best[x - s] + 1)`. Return `best[amount]`, or -1 if it is still the starting value."
      ],
      solution: "def fewest_boxes(sizes, amount):\n    NONE = amount + 1                     # bigger than any real answer\n    best = [0] + [NONE] * amount          # best[x] = fewest boxes that fill exactly x units\n    for x in range(1, amount + 1):\n        for s in sizes:\n            if s <= x and best[x - s] + 1 < best[x]:\n                best[x] = best[x - s] + 1\n    return best[amount] if best[amount] != NONE else -1\n",
      complexity: "O(amount * len(sizes)) time, O(amount) space: one table cell per amount, each tried with every size.",
      explain: [
        "Brute force: recursion. To fill x, try each size s, solve x - s, and keep the best. Without memory it is exponential, because many branches reach the same smaller amount.",
        "Taking the biggest box first is tempting but wrong: sizes [1,3,4], amount 6.",
        "Define `best[x]` for every amount from 0 up, with `best[0] = 0`.",
        "For each x, the last box has some size s <= x and the rest costs `best[x - s]`. Take the minimum over s, plus one box.",
        "If `best[amount]` is still the starting value, nothing fits, so return -1."
      ],
      dryrun: "sizes = [1,2,5], amount = 11. Fill best[0..11]. best[0] = 0. x = 1: via size 1, best[0] + 1 = 1. x = 2: via size 2, best[0] + 1 = 1. x = 3: via 1, best[2] + 1 = 2. x = 4: via 2, best[2] + 1 = 2. x = 5: via 5, best[0] + 1 = 1. x = 6: via 5, best[1] + 1 = 2. x = 7: via 5, best[2] + 1 = 2. x = 8: via 5, best[3] + 1 = 3. x = 9: via 5, best[4] + 1 = 3. x = 10: via 5, best[5] + 1 = 2. x = 11: via 1 gives best[10] + 1 = 3, via 2 gives best[9] + 1 = 4, via 5 gives best[6] + 1 = 3. The smallest is 3, so return 3.",
      tests: "assert fewest_boxes([1,2,5], 11) == 3\nassert fewest_boxes([2], 3) == -1\nassert fewest_boxes([1,3,4], 6) == 2\nassert fewest_boxes([1], 0) == 0\nassert fewest_boxes([5,10], 0) == 0\nassert fewest_boxes([2,5,10,1], 27) == 4\nassert fewest_boxes([3,7], 11) == -1\nassert fewest_boxes([186,419,83,408], 6249) == 20\nassert fewest_boxes([7], 7000) == 1000\nprint(\"all good\")\n",
      followups: [
        {
          q: "Can the work stop early instead of filling the whole table?",
          a: "Treat amounts as nodes and each box as a step: start at 0 and expand level by level, where level k is every amount reachable with k boxes. The first level that contains `amount` is the answer, so you can stop there. Worst case is still O(amount * len(sizes)), but it often finishes sooner and only touches reachable amounts."
        },
        {
          q: "Count the number of different ways to make the amount, where the order of boxes does not matter.",
          a: "Different recurrence: `ways[0] = 1`; put the loop over sizes on the outside and the loop over x inside: `ways[x] += ways[x - s]`. Sizes outside counts combinations. Swapping the loops would count ordered sequences, so 1+2 and 2+1 would count twice."
        },
        {
          q: "Why does biggest-first fail, and when is it safe?",
          a: "With sizes [1,3,4] and amount 6, it takes 4, then 1, 1: three boxes, while 3 + 3 is two. Greedy is safe only for special size sets (1, 5, 10, 25 is one), and there is no cheap general check, so without that guarantee you use the table."
        }
      ],
      reveal: {
        lc: "LeetCode 322 Coin Change (medium)",
        topic: "Unbounded knapsack: fewest items for an exact total",
        pattern: "dp"
      }
    }
  ]
});
window.LOOP_DAILY.days.push({
  date: "2026-11-02",
  n: 12,
  problems: [
    {
      id: "d12-a",
      minutes: 15,
      title: "Bins on a shelf",
      scenario: "A shelf has n bins in a row, numbered 0 to n-1, all empty at first. Build a class `Shelf(n)` with two methods. `allocate(size, owner)` finds the leftmost run of `size` empty bins that sit next to each other, marks all of them as belonging to `owner` (a positive integer id), and returns the index of the first bin of that run, or -1 if there is no such run. `free(owner)` empties every bin that belongs to `owner` (one owner can allocate many times) and returns how many bins it emptied.",
      examples: [
        {
          input: "s = Shelf(3); s.allocate(2, 5); s.allocate(2, 6); s.free(5); s.allocate(2, 6)",
          output: "the four calls return 0, -1, 2, 0",
          note: "Owner 5 takes bins 0 and 1. Only one empty bin is left, so owner 6 gets -1. Freeing owner 5 empties two bins, and now owner 6 fits at 0."
        },
        {
          input: "s = Shelf(10); allocate(1,1); allocate(1,2); allocate(1,3); free(2); allocate(3,4); allocate(1,1); allocate(1,1); free(1); allocate(10,2); free(7)",
          output: "0, 1, 2, 1, 3, 1, 6, 3, -1, 0",
          note: "After free(2), bin 1 is empty but bin 2 is taken, so the run of 3 starts at bin 3. Owner 1 ends up holding bins 0, 1 and 6."
        },
        {
          input: "s = Shelf(4); s.allocate(2, 1); s.allocate(1, 2); s.free(1); s.allocate(3, 3)",
          output: "0, 2, 2, -1",
          note: "Three bins are empty (0, 1 and 3), but not three in a row."
        }
      ],
      constraints: [
        "1 <= n <= 1000",
        "1 <= size, owner <= 1000",
        "at most 1000 calls in total",
        "`free` on an owner with no bins returns 0"
      ],
      clarify: [
        {
          q: "Do the bins of one allocation have to be next to each other?",
          a: "Yes. One allocation is one unbroken run."
        },
        {
          q: "If several runs fit, which one do I use?",
          a: "The leftmost, meaning the one with the smallest first index."
        },
        {
          q: "Can the same owner id allocate again?",
          a: "Yes. `free` empties all of that owner's bins at once."
        },
        {
          q: "What does `free` return for an owner that holds nothing?",
          a: "0."
        }
      ],
      starter: "class Shelf:\n    def __init__(self, n):\n        ...\n\n    def allocate(self, size, owner):\n        ...\n\n    def free(self, owner):\n        ...\n",
      hints: [
        "n and the number of calls are both small. What is the least you must remember about each bin, and what does 'leftmost run' tell you about the order in which to look?",
        "Keep one slot per bin holding the owner id, with 0 for empty. To allocate, scan left to right counting the current run of empty bins; when the run reaches `size`, you found the leftmost one. To free, scan and clear every slot with that owner.",
        "allocate: `run = 0`; for each bin i, `run = run + 1` if it is empty, else `run = 0`; when `run == size`, set `start = i - size + 1`, fill `start..i` with the owner, return start; after the loop return -1. free: loop, clear every slot equal to the owner, count them."
      ],
      solution: "class Shelf:\n    def __init__(self, n):\n        self.bins = [0] * n                  # 0 = empty, otherwise the owner id\n\n    def allocate(self, size, owner):\n        run = 0                              # empty bins in a row ending at bin i\n        for i, who in enumerate(self.bins):\n            run = run + 1 if who == 0 else 0\n            if run == size:\n                start = i - size + 1         # leftmost run: the first one the scan completes\n                for j in range(start, i + 1):\n                    self.bins[j] = owner\n                return start\n        return -1\n\n    def free(self, owner):\n        freed = 0\n        for i, who in enumerate(self.bins):\n            if who == owner:\n                self.bins[i] = 0\n                freed += 1\n        return freed\n",
      complexity: "O(n) time per call, O(n) space: both methods scan the bins once. That is fine for n and the call count at 1000.",
      explain: [
        "Brute force is close to the answer here: keep one slot per bin (0 for empty, else the owner id). Trying every start index and checking `size` bins each time is O(n * size); the running counter makes allocate O(n).",
        "allocate: walk left to right with a counter of consecutive empty bins, and reset it at a taken bin.",
        "When the counter equals `size`, the run has ended at bin i and began at `i - size + 1`. Fill it and return the start. The first run the scan completes is the leftmost.",
        "free: scan once, clear every bin of that owner, and count them.",
        "Say the limits out loud: at 10^5 bins and 10^5 calls you would index the ranges instead of scanning."
      ],
      dryrun: "Example 1: Shelf(3), bins [0,0,0]. allocate(2, 5): bin 0 is empty, run 1. Bin 1 is empty, run 2, which equals size. Start is 1 - 2 + 1 = 0. Fill bins 0 and 1 with 5. Return 0. allocate(2, 6): bin 0 is taken, run 0. Bin 1 taken, run 0. Bin 2 empty, run 1. The loop ends without reaching 2, so return -1. free(5): bins 0 and 1 match, clear them, return 2. allocate(2, 6): bins 0 and 1 are empty, run reaches 2 at bin 1, start 0. Return 0.",
      tests: "s = Shelf(3)\nassert s.allocate(2, 5) == 0\nassert s.allocate(2, 6) == -1\nassert s.free(5) == 2\nassert s.allocate(2, 6) == 0\n\ns = Shelf(10)\nassert [s.allocate(1, 1), s.allocate(1, 2), s.allocate(1, 3)] == [0, 1, 2]\nassert s.free(2) == 1\nassert s.allocate(3, 4) == 3\nassert s.allocate(1, 1) == 1\nassert s.allocate(1, 1) == 6\nassert s.free(1) == 3\nassert s.allocate(10, 2) == -1\nassert s.free(7) == 0\n\ns = Shelf(4)\nassert s.allocate(2, 1) == 0\nassert s.allocate(1, 2) == 2\nassert s.free(1) == 2\nassert s.allocate(3, 3) == -1          # three empty bins, but not together\nassert Shelf(2).allocate(3, 1) == -1   # bigger than the whole shelf\nassert Shelf(1).allocate(1, 9) == 0\nprint(\"all good\")\n",
      followups: [
        {
          q: "n is now 10^6 and there are 10^5 calls. What breaks, and what do you change?",
          a: "O(n) per call is too slow. Keep a dictionary from owner to a list of (start, size) ranges, so `free` touches only that owner's bins. Keep the empty gaps as a sorted list of (start, length): `allocate` takes the first gap with length >= size and shrinks it, and `free` puts ranges back and merges neighboring gaps. That is about O(log n) to O(number of gaps) per call."
        },
        {
          q: "Two threads call allocate and free at the same time. What do you add?",
          a: "A lock around both methods (`with self.lock:`). Both read and write the same bins, and 'find a run, then fill it' must be one atomic step, or two callers can claim the same run. Finer-grained locks add deadlock risk and are not worth it at this size."
        },
        {
          q: "Leftmost fit can fragment the shelf. What would you offer instead, and what does it cost?",
          a: "Best fit (the smallest gap that is big enough) wastes less in the short run, but it needs the gaps indexed by length and can leave many tiny unusable gaps. Leftmost is simple and predictable, which is what the spec asks for. I would keep leftmost and add a compaction operation only if asked."
        }
      ],
      reveal: {
        lc: "LeetCode 2502 Design Memory Allocator (medium)",
        topic: "Simulation with a scan, then interval bookkeeping per owner",
        pattern: "hashing"
      }
    },
    {
      id: "d12-b",
      minutes: 20,
      title: "Typical delivery time",
      scenario: "Orders finish all day, and the operations dashboard shows the typical delivery time. Build a class `DeliveryStats` with `add(minutes)`, which records the delivery time of one finished order (an integer), and `median()`, which returns the median of every time recorded so far: the middle value when the count is odd, and the average of the two middle values when it is even. `median()` is called after almost every `add`, and there can be 50,000 calls in total, so both methods must stay fast.",
      examples: [
        {
          input: "d = DeliveryStats(); d.add(1); d.add(2); d.median(); d.add(3); d.median()",
          output: "1.5 then 2.0",
          note: "The middle of 1, 2 is 1.5; the middle of 1, 2, 3 is 2."
        },
        {
          input: "add(40) median(); add(10) median(); add(30) median(); add(20) median()",
          output: "40.0, 25.0, 30.0, 25.0",
          note: "Sorted values: [40], [10, 40], [10, 30, 40], [10, 20, 30, 40]."
        },
        {
          input: "add(5); add(5); add(100); median()",
          output: "5.0",
          note: "Duplicates count. The middle of 5, 5, 100 is 5."
        }
      ],
      constraints: [
        "-10^5 <= minutes <= 10^5",
        "`median()` is only called after at least one `add()`",
        "up to 5 * 10^4 calls in total",
        "an answer within 10^-5 of the true median is accepted"
      ],
      clarify: [
        {
          q: "What should `median()` return when the count is even?",
          a: "The average of the two middle values, as a float."
        },
        {
          q: "Can `median()` be called before any `add()`?",
          a: "No. At least one `add` comes first."
        },
        {
          q: "Can the same value be added many times?",
          a: "Yes, and each one counts."
        },
        {
          q: "Which call pattern should I optimise for?",
          a: "Mixed: many adds and many median calls, interleaved."
        }
      ],
      starter: "class DeliveryStats:\n    def __init__(self):\n        ...\n\n    def add(self, minutes):\n        ...\n\n    def median(self):\n        ...\n",
      hints: [
        "The median only needs the middle one or two values. Think about splitting everything seen so far into a smaller half and a larger half. What do you need to know about each half?",
        "Keep the smaller half in a max-heap and the larger half in a min-heap, so the boundary value of each half is at its root. Keep the two sizes within one of each other.",
        "Python only has a min-heap, so store the smaller half negated. add: push into the low half, move the low half's largest across to the high half, then if the high half is now bigger, move its smallest back. median: if low has more, return its top; otherwise average the two tops."
      ],
      solution: "import heapq\n\nclass DeliveryStats:\n    def __init__(self):\n        self.low = []        # smaller half, stored negated so the largest is on top\n        self.high = []       # larger half, smallest on top\n\n    def add(self, minutes):\n        heapq.heappush(self.low, -minutes)\n        heapq.heappush(self.high, -heapq.heappop(self.low))   # largest of low crosses over\n        if len(self.high) > len(self.low):                    # keep low the same size or one bigger\n            heapq.heappush(self.low, -heapq.heappop(self.high))\n\n    def median(self):\n        if len(self.low) > len(self.high):\n            return float(-self.low[0])\n        return (-self.low[0] + self.high[0]) / 2\n",
      complexity: "add is O(log n), median is O(1), and the space is O(n): each value sits in exactly one heap, and each add does a constant number of heap pushes and pops.",
      explain: [
        "Brute force: keep a list; on each `median()` sort it and read the middle. add is O(1) but median is O(n log n), too slow for 50,000 calls. Keeping the list sorted with `bisect.insort` makes median O(1) but add O(n).",
        "The median sits at the boundary between the smaller half and the larger half. You only need the largest of the smaller half and the smallest of the larger half.",
        "Store the smaller half as a max-heap (negated values) and the larger half as a min-heap.",
        "On add: push into the small half, move its largest across to the big half, then rebalance so the small half has the same count or one more.",
        "On median: with an odd count, return the root of the small half; with an even count, average the two roots."
      ],
      dryrun: "add(1): push to low, low = [-1]. Move its top across: high = [1], low = []. High is bigger, so move it back: low = [-1], high = []. add(2): push to low, low holds {1, 2}. Move the largest, 2, to high: low = [-1], high = [2]. Sizes are equal. median(): the sizes are equal, so (1 + 2) / 2 = 1.5. add(3): push to low, low holds {1, 3}. Move 3 across: high = [2, 3], low = [-1]. High is bigger, so move its smallest, 2, back: low holds {1, 2}, high = [3]. median(): low has more, so the top of low is 2.",
      tests: "d = DeliveryStats()\nd.add(1); d.add(2)\nassert d.median() == 1.5\nd.add(3)\nassert d.median() == 2\nd = DeliveryStats()\nout = []\nfor x in [40, 10, 30, 20]:\n    d.add(x)\n    out.append(d.median())\nassert out == [40, 25, 30, 25]\nd = DeliveryStats()\nd.add(5); d.add(5); d.add(100)\nassert d.median() == 5\nd = DeliveryStats()\nd.add(-3)\nassert d.median() == -3\nd = DeliveryStats()\nfor x in [-1, -2, -3, -4]:\n    d.add(x)\nassert d.median() == -2.5\nprint(\"all good\")\n",
      followups: [
        {
          q: "All times are whole minutes between 0 and 100. Can you do better?",
          a: "Keep 101 counters. add is O(1). median walks the counters to the middle rank (or the two middle ranks) using the running total, which is at most 101 steps, so constant time. Space is O(101)."
        },
        {
          q: "99% of the times fall in 0 to 100 and a few are outliers. What do you do?",
          a: "Keep the 101 counters plus two counts, one for values below 0 and one for values above 100. Because the outliers are under half of the data, the median always falls inside the counters, so you find it by walking them, after skipping the count below 0."
        },
        {
          q: "Why two heaps and not a sorted list with `bisect.insort`?",
          a: "`insort` finds the spot in O(log n) but inserting shifts elements, so each add is O(n). It is fast in practice for small n, but heaps stay O(log n) at any size. The trade-off: two heaps answer only the median; if you also need arbitrary percentiles you want a sorted container or an order-statistic tree."
        }
      ],
      reveal: {
        lc: "LeetCode 295 Find Median from Data Stream (hard)",
        topic: "Two heaps: a max-heap for the lower half and a min-heap for the upper half",
        pattern: "heap"
      }
    }
  ]
});
window.LOOP_DAILY.days.push({
  date: "2026-11-03",
  n: 13,
  problems: [
    {
      id: "d13-a",
      minutes: 15,
      title: "Spaceless search",
      scenario: "A shopper's search query arrives with the spaces stripped out, like `wirelessearbuds`. The catalog has a list of known words. Decide whether the query can be cut into one or more consecutive pieces so that every piece is a known word. A word can be used more than once, and every letter of the query must be used, in order, with none left over. Return `True` or `False`.",
      examples: [
        {
          input: "query = 'wirelessearbuds', words = ['wireless','ear','buds','earbuds','wire','less']",
          output: "True",
          note: "wireless + earbuds, or wireless + ear + buds."
        },
        {
          input: "query = 'catsandog', words = ['cats','dog','sand','and','cat']",
          output: "False",
          note: "cats + and + og fails, and cat + sand + og fails. No cut uses every letter."
        },
        {
          input: "query = 'applepenapple', words = ['apple','pen']",
          output: "True",
          note: "apple + pen + apple. The word apple is used twice."
        }
      ],
      constraints: [
        "1 <= len(query) <= 300",
        "1 <= len(words) <= 1000, each word is 1 to 20 lowercase letters, all distinct",
        "query contains lowercase letters only"
      ],
      clarify: [
        {
          q: "Can a word be used more than once?",
          a: "Yes."
        },
        {
          q: "Do I return the cut itself, or only yes or no?",
          a: "Only True or False."
        },
        {
          q: "Can the query be empty?",
          a: "No. It has at least one letter."
        },
        {
          q: "Any uppercase letters, digits or punctuation?",
          a: "No. Lowercase letters only."
        }
      ],
      starter: "def can_split(query, words):\n    ...\n",
      hints: [
        "Cutting off the longest known word you see first can paint you into a corner (try `catsandog`). Ask a smaller question instead: for each prefix of the query, can that prefix be cut up?",
        "Dynamic programming over prefix length: `ok[i]` is True when the first i letters can be cut into words. `ok[0]` is True.",
        "For each i, look for a j < i with `ok[j]` True and `query[j:i]` in the word set. Put the words in a set for fast lookup, and only try j within the longest word length of i."
      ],
      solution: "def can_split(query, words):\n    known = set(words)\n    longest = max(len(w) for w in known)\n    ok = [True] + [False] * len(query)         # ok[i]: the first i letters can be cut into words\n    for i in range(1, len(query) + 1):\n        for j in range(max(0, i - longest), i):\n            if ok[j] and query[j:i] in known:  # a good cut at j, then one word from j to i\n                ok[i] = True\n                break\n    return ok[-1]\n",
      complexity: "O(n * L) set lookups for a query of length n and longest word length L, each hashing up to L letters, so O(n * L^2) character work; O(n + total word length) space.",
      explain: [
        "Brute force: recursion. Try every known word as the first piece, then solve the rest. Without memory it is exponential, for example `aaaa...ab` with words `a` and `aa`.",
        "Many branches solve the same remainder over and over. Name the sub-question once: can the first i letters be cut?",
        "`ok[0] = True` (nothing to cut). For each i from 1 to n, `ok[i]` is True if some j has `ok[j]` True and `query[j:i]` is a word.",
        "Put the words in a set, and only look back at most as far as the longest word.",
        "The answer is `ok[n]`."
      ],
      dryrun: "Example 1, query `wirelessearbuds` (15 letters), ok[0] = True. At i = 4: j = 0 gives `wire`, which is a word, so ok[4] = True. At i = 8: j = 0 gives `wireless`, a word, so ok[8] = True. At i = 11: j = 8 gives `ear`, and ok[8] is True, so ok[11] = True. At i = 15: j = 8 gives `earbuds`, a word, so ok[15] = True (j = 11 gives `buds`, also fine). The answer is ok[15] = True.",
      tests: "assert can_split(\"wirelessearbuds\", [\"wireless\", \"ear\", \"buds\", \"earbuds\", \"wire\", \"less\"]) is True\nassert can_split(\"catsandog\", [\"cats\", \"dog\", \"sand\", \"and\", \"cat\"]) is False\nassert can_split(\"applepenapple\", [\"apple\", \"pen\"]) is True\nassert can_split(\"a\", [\"a\"]) is True\nassert can_split(\"a\", [\"b\"]) is False\nassert can_split(\"aaaaaaa\", [\"aaaa\", \"aaa\"]) is True\nassert can_split(\"aaaaaaab\", [\"a\", \"aa\"]) is False      # the case that kills plain recursion\nassert can_split(\"a\" * 300 + \"b\", [\"a\", \"aa\", \"aaa\"]) is False\nassert can_split(\"cars\", [\"car\", \"ca\", \"rs\"]) is True\nprint(\"all good\")\n",
      followups: [
        {
          q: "Return every valid way to cut the query, as sentences.",
          a: "Backtrack from each start position with a memo from start index to its list of sentences. The output itself can be exponential (`aaaa` with `a` and `aa` already gives several), so the cost is bound by the output. Run the yes-or-no DP first: if it says False, return an empty list at once."
        },
        {
          q: "The catalog has a million words and you get a hundred thousand queries. What do you change?",
          a: "Build a trie of the words once. From each start position walk the trie letter by letter and mark `ok[end]` whenever you pass a word end; stop when the trie has no branch. That avoids creating slices, and each walk is bounded by the longest word."
        },
        {
          q: "Why bound j by the longest word, and does that change the worst case?",
          a: "A slice longer than the longest word can never be in the set, so skipping it is pure savings. The lookups drop from about n^2 to n * L. If L is close to n it saves little, but then there are few such words."
        }
      ],
      reveal: {
        lc: "LeetCode 139 Word Break (medium)",
        topic: "Prefix dynamic programming: can the first i letters be segmented",
        pattern: "dp"
      }
    },
    {
      id: "d13-b",
      minutes: 15,
      title: "Bookend route",
      scenario: "A delivery route is a chain of stops. Each stop holds a stop number and a link to the next stop, and the last stop's link is `None`. To spread the early and late stops across the shift, dispatch wants the chain re-linked so it visits the first stop, then the last, then the second, then the second to last, and so on, meeting in the middle. Do it in place: re-link the existing stops, without creating new ones and without changing their numbers. Return nothing.",
      examples: [
        {
          input: "head = build([1,2,3,4])",
          output: "to_list(head) is [1,4,2,3] after the call",
          note: "First 1, last 4, then 2, then 3."
        },
        {
          input: "head = build([1,2,3,4,5])",
          output: "to_list(head) is [1,5,2,4,3] after the call",
          note: "An odd count: the middle stop, 3, ends the route."
        },
        {
          input: "head = build([1,2])",
          output: "to_list(head) is [1,2] after the call",
          note: "Two stops are already in bookend order. A single stop or an empty route is also left alone."
        }
      ],
      constraints: [
        "0 <= number of stops <= 5 * 10^4",
        "1 <= stop number <= 1000",
        "O(n) time; extra space should be O(1) if you can",
        "the starter has `Stop`, `build` and `to_list` helpers"
      ],
      clarify: [
        {
          q: "May I use extra memory?",
          a: "O(n) is accepted, but expect to be pushed towards O(1)."
        },
        {
          q: "Do I return a new head?",
          a: "No. The head stays the same stop. Change the links in place."
        },
        {
          q: "Can I swap the numbers between stops instead of re-linking?",
          a: "No. The numbers stay with their stops."
        },
        {
          q: "What about an empty or one-stop route?",
          a: "Handle them. There is nothing to change."
        }
      ],
      starter: "class Stop:\n    def __init__(self, num=0, next=None):\n        self.num = num\n        self.next = next\n\ndef build(nums):\n    head = None\n    for x in reversed(nums):\n        head = Stop(x, head)\n    return head\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.num)\n        head = head.next\n    return out\n\ndef bookend_route(head):\n    ...\n",
      hints: [
        "The new order takes one stop from the front, then one from the back. A chain only lets you walk forward, so how can you reach the back stops in reverse order?",
        "Three steps: find the middle, reverse the second half in place, then weave the two halves together by alternating.",
        "Walk `slow` one step and `fast` two steps while `fast.next` and `fast.next.next` exist. Cut after `slow` and reverse the rest. Then loop: save `a.next` and `b.next`, set `a.next = b`, set `b.next` to the saved `a.next`, and advance both pointers."
      ],
      solution: "class Stop:\n    def __init__(self, num=0, next=None):\n        self.num = num\n        self.next = next\n\ndef build(nums):\n    head = None\n    for x in reversed(nums):\n        head = Stop(x, head)\n    return head\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.num)\n        head = head.next\n    return out\n\ndef bookend_route(head):\n    if head is None or head.next is None:\n        return\n    # 1. find the end of the first half\n    slow = fast = head\n    while fast.next and fast.next.next:\n        slow, fast = slow.next, fast.next.next\n    # 2. cut after slow and reverse the second half\n    prev, cur = None, slow.next\n    slow.next = None\n    while cur:\n        nxt = cur.next\n        cur.next = prev\n        prev, cur = cur, nxt\n    # 3. weave: one stop from the front half, one from the reversed half\n    a, b = head, prev\n    while b:\n        a_next, b_next = a.next, b.next\n        a.next = b\n        b.next = a_next\n        a, b = a_next, b_next\n",
      complexity: "O(n) time, O(1) space: three linear passes and a few pointers.",
      explain: [
        "Brute force: copy the stops into a list, then link them in the order front, back, front, back using two indexes. O(n) time, O(n) space.",
        "To use O(1) space you need back-to-front access without a list, so reverse the second half in place.",
        "Find the middle: `slow` moves one step and `fast` two; the loop ends with `slow` on the last stop of the first half.",
        "Cut the chain after `slow`, then reverse the second half.",
        "Weave: take a stop from the first half, then one from the reversed half, and repeat until the reversed half runs out."
      ],
      dryrun: "Route 1, 2, 3, 4. slow and fast start at 1. fast.next is 2 and fast.next.next is 3, so slow moves to 2 and fast to 3. Now fast.next is 4 but fast.next.next is None, so stop. slow is 2. Cut after 2: the first half is 1, 2 and the second half is 3, 4. Reverse the second half: 4, 3. Weave with a = 1 and b = 4: save a_next = 2 and b_next = 3, link 1 to 4 and 4 to 2, move on with a = 2 and b = 3. Save a_next = None and b_next = None, link 2 to 3 and 3 to None. Now b is None, so stop. The route reads 1, 4, 2, 3.",
      tests: "# uses build and to_list from the starter\ndef expect(nums):\n    out, i, j = [], 0, len(nums) - 1\n    while i <= j:\n        out.append(nums[i])\n        i += 1\n        if i <= j:\n            out.append(nums[j])\n            j -= 1\n    return out\n\nh = build([1, 2, 3, 4]); bookend_route(h)\nassert to_list(h) == [1, 4, 2, 3]\nh = build([1, 2, 3, 4, 5]); bookend_route(h)\nassert to_list(h) == [1, 5, 2, 4, 3]\nh = build([1, 2]); bookend_route(h)\nassert to_list(h) == [1, 2]\nh = build([7]); bookend_route(h)\nassert to_list(h) == [7]\nbookend_route(None)                      # an empty route is fine\nfor nums in ([1, 2, 3], [5, 4, 3, 2, 1, 0], list(range(9)), list(range(10))):\n    h = build(nums); bookend_route(h)\n    assert to_list(h) == expect(nums), nums\n\nh = build([1, 2, 3, 4, 5])               # the same stop objects, only re-linked\nbefore = []\nn = h\nwhile n:\n    before.append(n)\n    n = n.next\nbookend_route(h)\nafter = []\nn = h\nwhile n:\n    after.append(n)\n    n = n.next\nassert h is before[0] and len(after) == 5 and {id(x) for x in after} == {id(x) for x in before}\nprint(\"all good\")\n",
      followups: [
        {
          q: "The route is doubly linked (each stop has `prev` and `next`) and you hold both the head and the tail. Does that simplify things?",
          a: "Yes. You do not need the reversal, because the tail walks backwards with `prev`. Use one pointer from each end moving inward and re-link front and back alternately, stopping when they meet. The pointer surgery is still delicate, so write the order of assignments down before coding."
        },
        {
          q: "Why reverse the second half instead of using recursion to reach the back stops?",
          a: "Recursion keeps one stack frame per stop. At 50,000 stops Python's recursion limit (about 1000) raises `RecursionError`, and even when it fits the stack costs O(n) space. The iterative reversal uses O(1) space."
        },
        {
          q: "You may not modify the input. Return a new chain instead.",
          a: "Collect the numbers in a list, then build a new chain by taking from the front and the back alternately with two indexes. O(n) time and space, which is the best possible here because you must allocate n new stops."
        }
      ],
      reveal: {
        lc: "LeetCode 143 Reorder List (medium)",
        topic: "Linked list: find the middle, reverse the second half, weave",
        pattern: "linked"
      }
    }
  ]
});
window.LOOP_DAILY.days.push({
  date: "2026-11-04",
  n: 14,
  problems: [
    {
      id: "d14-a",
      minutes: 20,
      title: "Pallet under the ceiling",
      scenario: "A warehouse has n loading bays side by side, each 1 unit wide. Bay i has a ceiling of height `h[i]`. You want to set down one rectangular pallet block that stands on the floor, covers a run of consecutive bays, and fits under the ceiling of every bay in the run, so its height can be at most the lowest ceiling in that run. Return the largest block area you can place.",
      examples: [
        {
          input: "h = [2,1,5,6,2,3]",
          output: "10",
          note: "Bays 2 and 3 have ceilings 5 and 6, so the block is 5 high and 2 wide: area 10."
        },
        {
          input: "h = [2,4]",
          output: "4",
          note: "Bay 1 alone gives 4 x 1, and both bays at height 2 give 2 x 2. Both are 4."
        },
        {
          input: "h = [6,2,5,4,5,1,6]",
          output: "12",
          note: "Bays 2 to 4 have ceilings 5, 4, 5: the block is 4 high and 3 wide."
        }
      ],
      constraints: ["1 <= n <= 10^5", "0 <= h[i] <= 10^4"],
      clarify: [
        {
          q: "Must the block cover whole bays and stand on the floor?",
          a: "Yes."
        },
        {
          q: "Can a ceiling be 0?",
          a: "Yes. No block fits in that bay."
        },
        {
          q: "Do I return the area or the dimensions?",
          a: "Only the area."
        },
        {
          q: "How big can n get?",
          a: "Up to 100,000, so an O(n^2) answer is too slow."
        }
      ],
      starter: "def largest_block(h):\n    ...\n",
      hints: [
        "Pick one bay and imagine its ceiling is the block's height. How far to the left and to the right can the block stretch before a lower ceiling stops it?",
        "For each bay you need the nearest lower bay on the left and on the right. A monotonic stack finds both in one pass.",
        "Walk the bays left to right, keeping a stack of bays with rising ceilings. When the current bay is lower than the top, pop the top: its block runs from right after the new top of the stack (or from the start) to right before the current index. Add a ceiling of 0 at the end to empty the stack."
      ],
      solution: "def largest_block(h):\n    best = 0\n    stack = []                                # bay indexes, ceilings strictly rising towards the top\n    for i, cur in enumerate(h + [0]):         # the trailing 0 empties the stack at the end\n        while stack and h[stack[-1]] >= cur:\n            height = h[stack.pop()]\n            left = stack[-1] if stack else -1         # nearest lower bay on the left\n            best = max(best, height * (i - left - 1)) # i is the nearest lower bay on the right\n        stack.append(i)\n    return best\n",
      complexity: "O(n) time, O(n) space: each bay is pushed once and popped once.",
      explain: [
        "Brute force: for every pair of bays (l, r) take the lowest ceiling between them times the width. With a running minimum that is O(n^2) time, O(1) space, too slow at n = 10^5.",
        "The best block that uses bay i as its lowest ceiling stretches until the first lower bay on each side. So the answer is the maximum over bays of ceiling times (right limit - left limit - 1).",
        "A stack of bays with rising ceilings holds exactly the bays that still wait for a lower bay on their right.",
        "When a lower bay arrives, pop. The right limit is the current index, and the left limit is the bay now on top of the stack, or -1 if the stack is empty.",
        "Append a ceiling of 0 so every bay is popped. Each bay is pushed once and popped once, so the total is O(n)."
      ],
      dryrun: "h = [2,1,5,6,2,3] with a 0 added at the end. i = 0, ceiling 2: stack empty, push 0. i = 1, ceiling 1: bay 0 (2) is higher, pop it: left is -1, width 1 - (-1) - 1 = 1, area 2. Push 1. i = 2, ceiling 5: push. i = 3, ceiling 6: push. Stack is [1, 2, 3]. i = 4, ceiling 2: pop bay 3 (6): left is 2, width 4 - 2 - 1 = 1, area 6. Pop bay 2 (5): left is 1, width 4 - 1 - 1 = 2, area 10. Bay 1 (1) is lower than 2, stop. Push 4. i = 5, ceiling 3: push. i = 6, ceiling 0: pop bay 5 (3): left is 4, width 1, area 3. Pop bay 4 (2): left is 1, width 4, area 8. Pop bay 1 (1): left is -1, width 6, area 6. The best seen is 10.",
      tests: "assert largest_block([2, 1, 5, 6, 2, 3]) == 10\nassert largest_block([2, 4]) == 4\nassert largest_block([6, 2, 5, 4, 5, 1, 6]) == 12\nassert largest_block([5]) == 5\nassert largest_block([0]) == 0\nassert largest_block([3, 3, 3, 3]) == 12\nassert largest_block([1, 2, 3, 4, 5]) == 9\nassert largest_block([5, 4, 3, 2, 1]) == 9\nassert largest_block([2, 0, 2]) == 2\nprint(\"all good\")\n",
      followups: [
        {
          q: "The floor is a grid of rows of 0 and 1, where 1 means usable. Find the largest rectangle of 1s.",
          a: "Build a histogram per row: the height at column j is the previous height plus one when the cell is 1, else 0. Run this function on each row's histogram and take the best. O(rows * columns) time."
        },
        {
          q: "A stack inside a loop looks quadratic. Why is it O(n)?",
          a: "Each bay is pushed once and popped at most once, so the inner `while` runs at most n times in total across the whole loop, not n times per bay."
        },
        {
          q: "Someone suggests splitting at the lowest bay and recursing on both sides. What does that cost?",
          a: "It is correct, but on sorted ceilings each split peels off one bay, so with a linear search for the minimum it is O(n^2). A segment tree for range-minimum brings it to O(n log n). The stack gets O(n) with less code."
        }
      ],
      reveal: {
        lc: "LeetCode 84 Largest Rectangle in Histogram (hard)",
        topic: "Monotonic stack: nearest lower bar on each side",
        pattern: "stack"
      }
    },
    {
      id: "d14-b",
      minutes: 15,
      title: "Everyone gets the update",
      scenario: "A company has n delivery hubs numbered 1 to n. Hubs are joined by one-way routes: `routes[i] = [u, v, m]` means a message sent from hub u reaches hub v after m minutes. A routing update starts at hub k at time 0. Whenever a hub receives the update it forwards it at the same instant along every outgoing route at once. Return the time at which the last hub has received the update, or -1 if some hub never gets it.",
      examples: [
        {
          input: "routes = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
          output: "2",
          note: "Hubs 1 and 3 hear at time 1, and hub 4 hears from hub 3 at time 2."
        },
        {
          input: "routes = [[1,2,1]], n = 2, k = 2",
          output: "-1",
          note: "Hub 2 has no outgoing route, so hub 1 never hears the update."
        },
        {
          input: "routes = [[1,2,10],[1,3,1],[3,2,2]], n = 3, k = 1",
          output: "3",
          note: "Hub 2 hears at time 3 through hub 3, which beats the direct 10-minute route."
        }
      ],
      constraints: [
        "1 <= k <= n <= 100",
        "1 <= len(routes) <= 6000",
        "routes are one-way, 0 <= m <= 100",
        "at most one route from u to v"
      ],
      clarify: [
        {
          q: "Are routes one-way?",
          a: "Yes. `[u, v, m]` does not give a route from v back to u."
        },
        {
          q: "Does a hub wait before forwarding?",
          a: "No. It forwards the instant it receives the update."
        },
        {
          q: "Can a hub be unreachable?",
          a: "Yes. Then return -1."
        },
        {
          q: "Can m be 0, and do I return the total or the maximum?",
          a: "m can be 0. Return the time at which the last hub receives the update, not a sum."
        }
      ],
      starter: "def all_hubs_time(routes, n, k):\n    ...\n",
      hints: [
        "A hub hears the update at the earliest time over all chains of routes leading to it, not by the first chain you happen to find. Once you are sure of one hub's time, what can you do with it?",
        "This is a shortest path from k to every hub with non-negative route times: Dijkstra's algorithm with a min-heap of (time, hub).",
        "Build an adjacency map. Pop the smallest (time, hub) from the heap; if the hub already has a time, skip it; otherwise record it and push each neighbor with time + minutes. The answer is the largest recorded time, or -1 if fewer than n hubs were recorded."
      ],
      solution: "import heapq\n\ndef all_hubs_time(routes, n, k):\n    graph = {}\n    for u, v, minutes in routes:\n        graph.setdefault(u, []).append((v, minutes))\n    heard = {}                                   # hub -> time it first hears the update\n    heap = [(0, k)]\n    while heap:\n        t, u = heapq.heappop(heap)\n        if u in heard:\n            continue                             # a faster entry for this hub was already used\n        heard[u] = t\n        for v, minutes in graph.get(u, []):\n            if v not in heard:\n                heapq.heappush(heap, (t + minutes, v))\n    return max(heard.values()) if len(heard) == n else -1\n",
      complexity: "O((n + E) log E) time, O(n + E) space: each route pushes at most one heap entry, and each hub is finalised once.",
      explain: [
        "Brute force: Bellman-Ford. Repeat n-1 times: for every route, improve `time[v]` with `time[u] + m`. O(n * E), which is about 6 * 10^5 steps here and perfectly fine at these limits; know it, and know why the heap version scales better.",
        "The time a hub hears the update is its shortest-path distance from k, and the last hub to hear sets the answer.",
        "Dijkstra: always finalise the unfinished hub with the smallest tentative time. With non-negative minutes, nothing found later can improve it.",
        "Use a heap of (time, hub), and skip entries for hubs that are already finalised, since they are stale.",
        "If any hub was never finalised, return -1. Otherwise return the largest time."
      ],
      dryrun: "Example 1: routes 2 to 1 (1), 2 to 3 (1), 3 to 4 (1); k = 2. Heap [(0, 2)]. Pop (0, 2): hub 2 is recorded at 0. Push (1, 1) and (1, 3). Pop (1, 1): hub 1 is recorded at 1, no outgoing routes. Pop (1, 3): hub 3 is recorded at 1, push (2, 4). Pop (2, 4): hub 4 is recorded at 2. All 4 hubs are recorded and the largest time is 2.",
      tests: "assert all_hubs_time([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2) == 2\nassert all_hubs_time([[1, 2, 1]], 2, 1) == 1\nassert all_hubs_time([[1, 2, 1]], 2, 2) == -1\nassert all_hubs_time([[1, 2, 10], [1, 3, 1], [3, 2, 2]], 3, 1) == 3\nassert all_hubs_time([[1, 2, 0], [2, 3, 0]], 3, 1) == 0\nassert all_hubs_time([], 1, 1) == 0\nassert all_hubs_time([[1, 2, 5], [2, 1, 5], [3, 1, 1]], 3, 1) == -1\nprint(\"all good\")\n",
      followups: [
        {
          q: "Some routes now have negative minutes (a time credit). Does your solution still work?",
          a: "No. Dijkstra relies on a finalised hub never being improved later, and a negative route breaks that. Use Bellman-Ford: relax all routes n-1 times in O(n * E); if a further pass still improves something, there is a negative cycle."
        },
        {
          q: "Every route takes exactly 1 minute. Can you do better than the heap?",
          a: "Yes. A plain breadth-first search from k with a deque gives each hub's time as its level, in O(n + E) with no heap. The answer is the depth of the last hub reached."
        },
        {
          q: "Several hubs start the update at time 0 at the same moment. What changes?",
          a: "Seed the heap with `(0, s)` for each starting hub s. Nothing else changes. It is the same as adding a start hub linked to each of them by 0-minute routes."
        }
      ],
      reveal: {
        lc: "LeetCode 743 Network Delay Time (medium)",
        topic: "Dijkstra shortest paths with a min-heap",
        pattern: "graphs"
      }
    }
  ]
});
window.LOOP_DAILY.days.push({
  date: "2026-11-05",
  n: 15,
  problems: [
    {
      id: "d15-a",
      minutes: 15,
      title: "Room to breathe",
      scenario: "A locker bank has n lockers in one row. `lockers[i]` is 1 if locker i holds a parcel and 0 if it is free. At least one locker is occupied and at least one is free. You will pick a free locker for your own parcel, and you want it as far as possible from the nearest occupied locker. The distance between lockers i and j is |i - j|. Return the largest distance you can get.",
      examples: [
        {
          input: "lockers = [1,0,0,0,1,0,1]",
          output: "2",
          note: "Locker 2 is 2 away from locker 0 and 2 away from locker 4. Locker 3 is only 1 away from locker 4."
        },
        {
          input: "lockers = [1,0,0,0]",
          output: "3",
          note: "The last locker is 3 away from the only occupied one."
        },
        {
          input: "lockers = [0,1]",
          output: "1",
          note: "The only free locker is next to the occupied one."
        }
      ],
      constraints: ["2 <= n <= 2 * 10^4", "lockers[i] is 0 or 1", "at least one 0 and at least one 1"],
      clarify: [
        {
          q: "Can the free locker be at either end of the row?",
          a: "Yes."
        },
        {
          q: "How is distance measured?",
          a: "|i - j| in locker positions, so neighbors are 1 apart."
        },
        {
          q: "Can the row be all free or all occupied?",
          a: "No. There is at least one of each."
        },
        {
          q: "Do I return the position or the distance?",
          a: "The distance."
        }
      ],
      starter: "def farthest_free(lockers):\n    ...\n",
      hints: [
        "Between two occupied lockers only the free locker in the middle matters, and at the two ends of the row the best spot is different. What is the best distance in each kind of gap?",
        "One scan from left to right, keeping the index of the previous occupied locker. Measure each gap between occupied lockers, plus the gap before the first and the gap after the last.",
        "A gap between occupied lockers at p and i: the best free locker is the middle, at distance `(i - p) // 2`. The gap before the first occupied locker i: the distance is i. The gap after the last one at p: the distance is `n - 1 - p`. Return the largest."
      ],
      solution: "def farthest_free(lockers):\n    best = 0\n    prev = -1                                   # index of the last occupied locker seen\n    for i, taken in enumerate(lockers):\n        if taken:\n            if prev == -1:\n                best = max(best, i)             # free lockers before the first occupied one: the end is best\n            else:\n                best = max(best, (i - prev) // 2)   # between two occupied lockers: the middle is best\n            prev = i\n    return max(best, len(lockers) - 1 - prev)   # free lockers after the last occupied one\n",
      complexity: "O(n) time, O(1) space: one pass and two integers.",
      explain: [
        "Brute force: for every free locker, scan for the nearest occupied one and keep the largest distance. O(n^2). A two-pass version (nearest occupied on the left, then on the right, take the smaller) is O(n) time and O(n) space.",
        "Split the row into runs of free lockers: one before the first occupied locker, those between occupied lockers, and one after the last.",
        "At an end run, the best spot is the very end, so the distance is the whole run measured to its occupied neighbor.",
        "Between occupied lockers at p and i, the best spot is the middle: distance `(i - p) // 2`.",
        "Scan once with the previous occupied index and take the largest over all runs."
      ],
      dryrun: "lockers = [1,0,0,0,1,0,1]. best = 0, prev = -1. i = 0 is occupied and prev is -1, so the free run before it has length 0: best = max(0, 0) = 0, prev = 0. i = 4 is occupied: the gap from 0 to 4 gives (4 - 0) // 2 = 2, so best = 2, prev = 4. i = 6 is occupied: (6 - 4) // 2 = 1, best stays 2, prev = 6. After the loop, the run after the last occupied locker has length n - 1 - prev = 6 - 6 = 0. Return max(2, 0) = 2.",
      tests: "assert farthest_free([1, 0, 0, 0, 1, 0, 1]) == 2\nassert farthest_free([1, 0, 0, 0]) == 3\nassert farthest_free([0, 1]) == 1\nassert farthest_free([0, 0, 1]) == 2\nassert farthest_free([1, 0, 1]) == 1\nassert farthest_free([1, 0, 0, 1]) == 1\nassert farthest_free([0, 0, 0, 1, 0, 0, 0, 0, 1]) == 3\nassert farthest_free([1, 1, 0]) == 1\nprint(\"all good\")\n",
      followups: [
        {
          q: "Why is the middle distance `(i - p) // 2` and not `(i - p) / 2` or that minus one?",
          a: "The free lockers are p+1 to i-1. A locker at p + d is d away from p and (i - p - d) away from i, and the smaller of the two is largest at d = (i - p) // 2. Check p = 0, i = 3: d = 1 gives distances 1 and 2, so the best is 1, which is 3 // 2."
        },
        {
          q: "Lockers get occupied and freed through the day, and you must answer 'best free locker' after each change. How?",
          a: "Keep the occupied positions in a sorted structure (a sorted list with `bisect`, or a balanced tree) and the gaps in a max-heap with lazy deletion. Each change touches at most two or three gaps, so an update is O(log n) and a query is O(1) amortised."
        },
        {
          q: "The lockers are in a grid and distance is Manhattan. How does it change?",
          a: "Start a breadth-first search from every occupied cell at once. Each cell's level is its distance to the nearest occupied cell, in O(rows * columns) total. Take the largest level over free cells."
        }
      ],
      reveal: {
        lc: "LeetCode 849 Maximize Distance to Closest Person (medium)",
        topic: "One scan with a last-seen index: measure each gap",
        pattern: "pointers"
      }
    },
    {
      id: "d15-b",
      minutes: 15,
      title: "Price grid lookup",
      scenario: "A pricing table is a grid with m rows and n columns of integer prices. Each row rises from left to right, and each column rises from top to bottom (equal neighbors are allowed). Given the grid and a target price, return `True` if the target appears anywhere in the grid, otherwise `False`.",
      examples: [
        {
          input: "grid = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5",
          output: "True",
          note: "5 is in row 1, column 1."
        },
        {
          input: "same grid, target = 20",
          output: "False",
          note: "20 falls between neighbors but is not in the table."
        },
        {
          input: "grid = [[-5]], target = -5",
          output: "True",
          note: "A one-cell grid."
        }
      ],
      constraints: [
        "1 <= m, n <= 300",
        "-10^9 <= price <= 10^9",
        "each row and each column is in non-decreasing order"
      ],
      clarify: [
        {
          q: "Is the whole grid in order when I read it row by row?",
          a: "No. Only each row on its own and each column on its own. The first price of a row can be lower than the last price of the row above."
        },
        {
          q: "Can prices repeat?",
          a: "Yes."
        },
        {
          q: "Do I return the position?",
          a: "No, only True or False."
        },
        {
          q: "Can the grid be empty?",
          a: "No. It has at least one cell."
        }
      ],
      starter: "def has_price(grid, target):\n    ...\n",
      hints: [
        "Pick a corner and compare the target with it. Which corner lets a single comparison rule out a whole row or a whole column?",
        "Start at the top-right corner (the bottom-left works too). It is the largest value in its row and the smallest in its column, so each comparison discards one full row or one full column.",
        "`r = 0`, `c = n - 1`. While inside the grid: if `grid[r][c] == target`, return True. If it is bigger than the target, everything below it in the column is at least as big, so move left (`c -= 1`). If it is smaller, everything to its left in the row is at most as big, so move down (`r += 1`). Falling off the grid means False."
      ],
      solution: "def has_price(grid, target):\n    r, c = 0, len(grid[0]) - 1               # start at the top-right corner\n    while r < len(grid) and c >= 0:\n        v = grid[r][c]\n        if v == target:\n            return True\n        if v > target:\n            c -= 1                           # everything below in this column is at least as big\n        else:\n            r += 1                           # everything left in this row is at most this big\n    return False\n",
      complexity: "O(m + n) time, O(1) space: each step removes one row or one column, so at most m + n steps.",
      explain: [
        "Brute force: scan every cell, O(m * n). A step better: binary search each row, O(m log n).",
        "Use both orderings together. The top-right cell is the largest of its row and the smallest of its column.",
        "If it is too big, the cells below it are no help, since they are at least as big: drop the column. If it is too small, the cells to its left are no help, since they are at most as big: drop the row.",
        "Each step discards a full row or column, so there are at most m + n steps."
      ],
      dryrun: "Example 1, target 5, grid 5 by 5. Start at row 0, column 4: the value is 15, which is above 5, so move left to column 3. Value 11, above 5, move left to column 2. Value 7, above 5, move left to column 1. Value 4, below 5, so drop the row and move down to row 1. The value at row 1, column 1 is 5. Found, return True.",
      tests: "G = [[1, 4, 7, 11, 15],\n     [2, 5, 8, 12, 19],\n     [3, 6, 9, 16, 22],\n     [10, 13, 14, 17, 24],\n     [18, 21, 23, 26, 30]]\nassert has_price(G, 5) is True\nassert has_price(G, 20) is False\nassert has_price([[-5]], -5) is True\nassert has_price([[-5]], 0) is False\nassert has_price(G, 1) is True        # top-left\nassert has_price(G, 30) is True       # bottom-right\nassert has_price(G, 18) is True       # bottom-left\nassert has_price(G, 15) is True       # top-right\nassert has_price(G, 0) is False\nassert has_price(G, 31) is False\nassert has_price([[1, 1, 1]], 1) is True\nassert has_price([[1], [2], [3]], 2) is True\nprint(\"all good\")\n",
      followups: [
        {
          q: "Binary searching each row costs O(m log n). When would that beat your O(m + n)?",
          a: "When one side is tiny. With m = 1 and n = 10^6, binary search takes about 20 steps while the corner walk can take up to a million. When the sides are about equal, the corner walk's O(m + n) wins. In practice: binary search along the longer dimension if it is much longer, otherwise the corner walk."
        },
        {
          q: "Now the grid is fully in order: each row starts above the last value of the previous row. How does the search change?",
          a: "One binary search over the flattened positions 0 to m*n-1: for a middle position, the cell is row `mid // n`, column `mid % n`. That is O(log(m * n)). This is the stronger guarantee, so the corner walk is no longer needed."
        },
        {
          q: "Why can't you start at the top-left corner?",
          a: "The top-left is the smallest in both its row and its column. If the target is bigger, it could be to the right or below, two options, and no row or column can be ruled out. At the top-right or bottom-left the two directions disagree in size, so each comparison leaves exactly one sensible move."
        }
      ],
      reveal: {
        lc: "LeetCode 240 Search a 2D Matrix II (medium)",
        topic: "Corner (staircase) search: discard a row or a column per step",
        pattern: "binary"
      }
    }
  ]
});
