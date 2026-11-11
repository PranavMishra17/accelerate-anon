/* Amazon loop: the daily two, extra day (swap-ins), part 1. Every solution and test was run with Python 3.12. */
window.LOOP_DAILY = window.LOOP_DAILY || { days: [] };
window.LOOP_DAILY.days.push({
  "date": "2026-11-12",
  "n": 17,
  "label": "Extra",
  "problems": [
    {
      "id": "d17-a",
      "minutes": 35,
      "title": "The safest delivery route",
      "scenario": "A delivery robot crosses a square warehouse floor, `n` by `n`. Each cell holds `1` if a guard is standing there and `0` if it is empty. The robot starts in the top-left cell and must reach the bottom-right cell, moving one step up, down, left or right at a time, and it may walk through guarded cells. The safety of a cell is its Manhattan distance to the nearest guard. The safety of a route is the smallest cell safety along it, start and end included. Return the largest safety any route can achieve.",
      "examples": [
        {
          "input": "grid = [[1,0,0],[0,0,0],[0,0,1]]",
          "output": "0",
          "note": "The start and the end are both guarded cells, so every route has safety 0."
        },
        {
          "input": "grid = [[0,0,1],[0,0,0],[0,0,0]]",
          "output": "2",
          "note": "Go down the left side and along the bottom. The guard is in the top-right corner. Down the left side and across the bottom the cells are 2, 3, 4, 3, 2 steps away, so the weakest is 2, and no route does better."
        },
        {
          "input": "grid = [[0,0,0,1],[0,0,0,0],[0,0,0,0],[1,0,0,0]]",
          "output": "2",
          "note": "The two guards sit in opposite corners. Every route starts and ends 3 steps from a guard, but must pass through cells that are at most 2 steps away, and a route through the middle keeps that at 2."
        }
      ],
      "constraints": [
        "1 <= n <= 400",
        "grid[i][j] is 0 or 1",
        "there is at least one guard",
        "if the start or end cell holds a guard, the answer is 0"
      ],
      "clarify": [
        {
          "q": "Can the robot step on a guarded cell?",
          "a": "Yes, but that cell has safety 0, so the whole route then scores 0."
        },
        {
          "q": "Is distance measured through walls or around them?",
          "a": "There are no walls. It is plain Manhattan distance, |r1 - r2| + |c1 - c2|, ignoring other cells."
        },
        {
          "q": "Do the start and end cells count in the route's score?",
          "a": "Yes. Every cell on the route counts, including both ends."
        },
        {
          "q": "Is there always a route?",
          "a": "Yes. The floor is fully open, so you can always reach the end. The question is only how safe the best route is."
        }
      ],
      "starter": "def safest_route(grid):\n    ...\n",
      "hints": [
        "Two separate questions are mixed here: how far is each cell from the nearest guard, and which route keeps the weakest cell as large as possible. Answer the first for the whole floor before you think about routes.",
        "Start a breadth-first search from every guard at the same time to fill a distance table. Then ask a yes or no question: can the robot reach the end using only cells at distance `d` or more? The answer to that is monotone in `d`, so you can binary search `d`.",
        "Compute `dist` with a multi-source BFS. Binary search `d` between 0 and `dist[0][0]`. For each `d`, run a BFS from the start that only enters cells with `dist >= d`, and see whether it reaches the bottom-right. Keep the largest `d` that works."
      ],
      "solution": "from collections import deque\n\ndef safest_route(grid):\n    n = len(grid)\n    if grid[0][0] == 1 or grid[n - 1][n - 1] == 1:\n        return 0\n    steps = ((1, 0), (-1, 0), (0, 1), (0, -1))\n\n    # 1) distance from every cell to its nearest guard: BFS from all guards at once\n    dist = [[-1] * n for _ in range(n)]\n    q = deque()\n    for r in range(n):\n        for c in range(n):\n            if grid[r][c] == 1:\n                dist[r][c] = 0\n                q.append((r, c))\n    while q:\n        r, c = q.popleft()\n        for dr, dc in steps:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n and dist[nr][nc] == -1:\n                dist[nr][nc] = dist[r][c] + 1\n                q.append((nr, nc))\n\n    # 2) can we get from the start to the end using only cells with dist >= d?\n    def reachable(d):\n        if dist[0][0] < d:\n            return False\n        seen = [[False] * n for _ in range(n)]\n        seen[0][0] = True\n        q = deque([(0, 0)])\n        while q:\n            r, c = q.popleft()\n            if (r, c) == (n - 1, n - 1):\n                return True\n            for dr, dc in steps:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < n and 0 <= nc < n and not seen[nr][nc] and dist[nr][nc] >= d:\n                    seen[nr][nc] = True\n                    q.append((nr, nc))\n        return False\n\n    # 3) binary search the largest d that still works\n    lo, hi = 0, dist[0][0]\n    while lo < hi:\n        mid = (lo + hi + 1) // 2        # round up so the loop always moves\n        if reachable(mid):\n            lo = mid\n        else:\n            hi = mid - 1\n    return lo\n",
      "complexity": "O(n^2 log n) time, O(n^2) space: one BFS to build the distances, then about log n BFS checks, each touching every cell at most once.",
      "explain": [
        "Brute force: list every route, score each by its weakest cell, take the best. The number of routes grows exponentially, so this is out. Even a cheaper version, a search whose state is the cell plus the best score so far, has too many states to be comfortable.",
        "Step one is to measure the floor: a breadth-first search that starts from every guard together gives each cell its distance to the nearest guard in one O(n^2) pass.",
        "Step two is to turn 'maximise the weakest cell' into a yes or no question: with a threshold `d`, can the robot get from the start to the end using only cells with distance at least `d`? One BFS answers that.",
        "If `d` works then every smaller `d` works too, so the answer is monotone and we can binary search it. The largest possible answer is `dist[0][0]`, since the start cell is on every route.",
        "The improvement is a single pass: a max-heap Dijkstra that always expands the cell with the best score so far (see the follow-up). It drops the log factor and adds a heap, so the two are close in practice."
      ],
      "dryrun": "grid = [[0,0,1],[0,0,0],[0,0,0]]. The guard is at (0,2). Distances: row 0 is 2, 1, 0; row 1 is 3, 2, 1; row 2 is 4, 3, 2. The start has distance 2, so the search range is 0 to 2. Try mid = 1: all cells with distance 1 or more, the start and end are reachable, so lo = 1. Try mid = 2: the allowed cells need distance 2 or more, which is every cell except (0,1), (0,2) and (1,2). From (0,0) go down to (1,0), across to (1,1), down to (2,1), across to (2,2). The end is reached, so lo = 2. lo equals hi, so return 2.",
      "tests": "assert safest_route([[1,0,0],[0,0,0],[0,0,1]]) == 0\nassert safest_route([[0,0,1],[0,0,0],[0,0,0]]) == 2\nassert safest_route([[0,0,0,1],[0,0,0,0],[0,0,0,0],[1,0,0,0]]) == 2\nassert safest_route([[1]]) == 0                       # a single guarded cell\nassert safest_route([[0,1],[0,0]]) == 1               # start and end are each 1 step from the guard\nassert safest_route([[1,0],[0,0]]) == 0               # guard on the start\nassert safest_route([[0,0],[0,1]]) == 0               # guard on the end\nassert safest_route([[0,0,0],[0,1,0],[0,0,0]]) == 1   # guard in the middle, corners are 2 away but the walk passes cells at 1\nimport random\ndef brute(g):\n    n = len(g)\n    gs = [(i, j) for i in range(n) for j in range(n) if g[i][j]]\n    d = [[min(abs(i - a) + abs(j - b) for a, b in gs) for j in range(n)] for i in range(n)]\n    best = 0\n    for k in range(d[0][0] + 1):\n        seen, st = {(0, 0)}, [(0, 0)]\n        while st:\n            r, c = st.pop()\n            for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):\n                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen and d[nr][nc] >= k:\n                    seen.add((nr, nc)); st.append((nr, nc))\n        if (n - 1, n - 1) in seen and d[0][0] >= k:\n            best = k\n    return best\nrandom.seed(1)\nfor _ in range(300):\n    n = random.randint(1, 6)\n    g = [[1 if random.random() < 0.15 else 0 for _ in range(n)] for _ in range(n)]\n    if not any(map(any, g)):\n        g[random.randrange(n)][random.randrange(n)] = 1\n    assert safest_route(g) == brute(g), g\nprint(\"all good\")\n",
      "followups": [
        {
          "q": "Can you do it in one pass without the binary search?",
          "a": "Yes: a max-heap Dijkstra on the distance table. The score of a route is its minimum, so push `(-dist[0][0], 0, 0)`, pop the cell with the best score, and push each neighbour with `min(score, dist[neighbour])`. The first time you pop the bottom-right cell, its score is the answer. It is O(n^2 log n) too, but with a single traversal. The code is below.\n\n```python\nimport heapq\n\ndef safest_route_heap(grid):\n    n = len(grid)\n    dist = multi_source_bfs(grid)   # same table as above\n    best = [[-1] * n for _ in range(n)]\n    best[0][0] = dist[0][0]\n    heap = [(-dist[0][0], 0, 0)]\n    while heap:\n        neg, r, c = heapq.heappop(heap)\n        score = -neg\n        if (r, c) == (n - 1, n - 1):\n            return score\n        if score < best[r][c]:\n            continue\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n:\n                s = min(score, dist[nr][nc])\n                if s > best[nr][nc]:\n                    best[nr][nc] = s\n                    heapq.heappush(heap, (-s, nr, nc))\n```"
        },
        {
          "q": "Why is it fine to run the BFS from all guards at once, instead of one BFS per guard?",
          "a": "All guards start at distance 0 in the queue, so the first time the search reaches a cell it comes from the nearest guard. One pass gives the nearest-guard distance for every cell in O(n^2). One BFS per guard would cost O(guards * n^2)."
        },
        {
          "q": "What if the robot could only step on cells with at least some minimum safety, and you had many different minimums to answer?",
          "a": "Sort the cells by distance, largest first, and add them to a union-find one at a time, joining each new cell to neighbours already added. The first moment the start and end share a set, the current distance is the answer. Every query then needs no new search."
        }
      ],
      "reveal": {
        "lc": "LeetCode 2812 Find the Safest Path in a Grid (medium, feels hard)",
        "topic": "Multi-source BFS for distances, then binary search on the answer with a BFS check",
        "pattern": "graphs"
      }
    },
    {
      "id": "d17-b",
      "minutes": 25,
      "title": "The cable that closes a loop",
      "scenario": "A data centre is wiring up `n` servers numbered `1` to `n`. Cables are announced one at a time as pairs `[a, b]`, and after all of them the network forms a single connected group with no loops, except that exactly one extra cable has been added. Find the cable that closes a loop. If several cables could be removed to leave a loop-free network, return the one that appears last in the announcement list.",
      "examples": [
        {
          "input": "cables = [[1,2],[1,3],[2,3]]",
          "output": "[2, 3]",
          "note": "1-2 and 1-3 connect all three. The cable 2-3 joins two servers that are already linked."
        },
        {
          "input": "cables = [[1,2],[2,3],[3,4],[1,4],[1,5]]",
          "output": "[1, 4]",
          "note": "1-2-3-4 is already a chain, so 1-4 closes the loop."
        },
        {
          "input": "cables = [[1,2],[2,3],[3,1],[1,4]]",
          "output": "[3, 1]",
          "note": "Cables 1-2, 2-3 and 3-1 form the loop. Removing any one fixes it, so take the one that appears last."
        }
      ],
      "constraints": [
        "3 <= n <= 1000",
        "len(cables) == n",
        "1 <= a, b <= n and a != b; a cable can be written in either order",
        "no cable repeats, and the network has exactly one loop"
      ],
      "clarify": [
        {
          "q": "Is exactly one cable redundant?",
          "a": "Exactly one extra cable was added to a loop-free network, so the loop count is one. But several cables on that loop could each be removed, which is why the last one is asked for."
        },
        {
          "q": "Can a cable join a server to itself?",
          "a": "No."
        },
        {
          "q": "Do I return the pair in the order it was given?",
          "a": "Yes, exactly as it appears in the list."
        },
        {
          "q": "Is the answer the first or the last cable that is on the loop?",
          "a": "The one that appears last in the list among the cables that can be removed."
        }
      ],
      "starter": "def find_loop_cable(cables):\n    ...\n",
      "hints": [
        "Think of the cables arriving as a stream. When a new cable arrives, what question tells you it is the one that makes a loop?",
        "A cable makes a loop exactly when its two servers are already connected. You need a structure that merges groups and answers 'are these two in the same group' fast: union-find.",
        "Give each server a parent, starting as itself. For each cable, find the root of both ends (compress the path as you go). If the roots match, return the cable. Otherwise attach the shorter tree under the taller one (union by rank)."
      ],
      "solution": "def find_loop_cable(cables):\n    n = len(cables)\n    parent = list(range(n + 1))      # servers are 1..n, slot 0 unused\n    rank = [0] * (n + 1)\n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]    # path compression: skip a level as we climb\n            x = parent[x]\n        return x\n\n    for a, b in cables:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            return [a, b]                    # already connected: this cable closes the loop\n        if rank[ra] < rank[rb]:              # hang the shorter tree under the taller one\n            ra, rb = rb, ra\n        parent[rb] = ra\n        if rank[ra] == rank[rb]:\n            rank[ra] += 1\n    return []\n",
      "complexity": "O(n * alpha(n)) time, essentially O(n): each find is nearly constant thanks to path compression and union by rank. O(n) space for the parent and rank arrays.",
      "explain": [
        "Brute force: add the cables one by one to an adjacency list, and before adding each, run a DFS to see whether its two ends are already connected. That is O(n) per cable and O(n^2) overall, which is fine at n = 1000 but does not scale.",
        "The improvement is to keep the groups explicitly. Union-find stores each group as a tree whose root is its label, so 'are a and b in the same group' is 'do they have the same root'.",
        "Path compression flattens the tree while you climb. Union by rank keeps trees shallow when you merge. Together they make each operation almost constant time.",
        "Because the cables are processed in order and exactly one closes a loop, the first cable whose ends already share a root is the answer. That is also the last one on its loop, which matches the 'last in the list' rule."
      ],
      "dryrun": "cables = [[1,2],[2,3],[3,4],[1,4],[1,5]]. Start: every server is its own root. [1,2]: roots 1 and 2 differ, merge them, root 1 now covers {1,2}. [2,3]: 2 climbs to root 1, 3 is its own root, merge, {1,2,3}. [3,4]: root 1 and root 4 differ, merge, {1,2,3,4}. [1,4]: both climb to root 1. Same root, so return [1, 4].",
      "tests": "assert find_loop_cable([[1,2],[1,3],[2,3]]) == [2,3]\nassert find_loop_cable([[1,2],[2,3],[3,4],[1,4],[1,5]]) == [1,4]\nassert find_loop_cable([[1,2],[2,3],[3,1],[1,4]]) == [3,1]         # a cable after the loop does not matter\nassert find_loop_cable([[2,1],[3,1],[3,2]]) == [3,2]               # order inside a pair is kept\nassert find_loop_cable([[1,2],[2,3],[3,1]]) == [3,1]\nassert find_loop_cable([[1,2],[3,4],[5,6],[2,3],[4,5],[6,1]]) == [6,1]   # a long loop\nassert find_loop_cable([[1,4],[3,4],[1,3],[1,2],[4,5]]) == [1,3]\nbig = [[i, i + 1] for i in range(1, 1000)] + [[1, 1000]]\nassert find_loop_cable(big) == [1, 1000]                           # deep chain, no recursion needed\nprint(\"all good\")\n",
      "followups": [
        {
          "q": "Why do we need both path compression and union by rank?",
          "a": "Either one alone gives about O(log n) per operation. Rank keeps merged trees from becoming long chains, and compression flattens whatever depth is left each time you climb. Together the cost per operation is the inverse Ackermann function, which is at most 4 for any real input."
        },
        {
          "q": "The cables now come from a directed graph, and you must remove one edge so each server has one parent. Does the same code work?",
          "a": "Not directly. That is a different problem (LC 685). A node can have two parents, or the cycle can be directed, so you have to check for a node with in-degree two first and test which of its two edges to drop. Union-find still does the cycle check, but the case analysis comes first."
        },
        {
          "q": "Can you write find without a loop?",
          "a": "Yes, recursively: `def find(x): if parent[x] != x: parent[x] = find(parent[x]); return parent[x]`. It is shorter, but on a long chain the recursion depth can reach n, so the iterative version is safer in Python."
        }
      ],
      "reveal": {
        "lc": "LeetCode 684 Redundant Connection (medium)",
        "topic": "Union-find with path compression and union by rank",
        "pattern": "graphs"
      }
    },
    {
      "id": "d17-c",
      "minutes": 25,
      "title": "The circular street of vending machines",
      "scenario": "A route driver restocks vending machines along a circular street, so the last machine is next to the first. Machine `i` has `cash[i]` dollars of coin box to collect. The machines are wired to an alarm so that collecting from two neighbouring machines on the same trip trips it. Return the largest amount the driver can collect in one trip without collecting from two neighbours.",
      "examples": [
        {
          "input": "cash = [2,3,2]",
          "output": "3",
          "note": "The first and last machines are neighbours, so 2 + 2 is not allowed. Take the middle machine."
        },
        {
          "input": "cash = [1,2,3,1]",
          "output": "4",
          "note": "Take machines 0 and 2 for 1 + 3."
        },
        {
          "input": "cash = [1,2,3]",
          "output": "3",
          "note": "Any two machines are neighbours on a circle of three, so take the best one."
        }
      ],
      "constraints": [
        "1 <= len(cash) <= 100",
        "0 <= cash[i] <= 1000",
        "the first and last machines are neighbours when there are two or more"
      ],
      "clarify": [
        {
          "q": "What if there is only one machine?",
          "a": "Collect from it. It has no neighbour."
        },
        {
          "q": "With two machines, are they neighbours?",
          "a": "Yes, so take the larger one."
        },
        {
          "q": "Can an amount be zero?",
          "a": "Yes."
        },
        {
          "q": "Must I return the machines or only the amount?",
          "a": "Only the amount."
        }
      ],
      "starter": "def best_trip(cash):\n    ...\n",
      "hints": [
        "Imagine the street is a straight line first. How would you solve that? Then ask what the circle changes.",
        "On a line, at each machine you either skip it (keep the best so far) or take it (add to the best from two machines back). On a circle, the first and last machines cannot both be taken.",
        "Write a helper `line(nums)` for the straight-line version using two running values. The answer is the larger of `line(cash[1:])` and `line(cash[:-1])`, plus a special case for a single machine."
      ],
      "solution": "def best_trip(cash):\n    if len(cash) == 1:\n        return cash[0]\n\n    def line(nums):\n        prev, cur = 0, 0                  # best up to two back, best up to one back\n        for x in nums:\n            prev, cur = cur, max(cur, prev + x)   # skip x, or take x on top of the older best\n        return cur\n\n    # the first and last machines are neighbours: drop one of them and solve the line\n    return max(line(cash[1:]), line(cash[:-1]))\n",
      "complexity": "O(n) time, O(n) space for the two slices (O(1) if you pass index bounds instead of slicing).",
      "explain": [
        "Brute force: try every subset with no two neighbours on the circle. That is exponential.",
        "On a straight line, the standard DP is `best[i] = max(best[i-1], best[i-2] + cash[i])`. Only the last two values matter, so two variables are enough.",
        "The circle adds one rule: machine 0 and machine n-1 cannot both be taken. So either machine 0 is not used, or machine n-1 is not used (or neither). Those two cases cover every valid trip.",
        "Solve the line twice, once without the first machine and once without the last, and take the larger result. A single machine has no neighbour, so it is a special case."
      ],
      "dryrun": "cash = [1,2,3,1]. Without the first: [2,3,1]. prev,cur = 0,0. x=2: cur = max(0, 0+2) = 2, prev = 0. x=3: cur = max(2, 0+3) = 3, prev = 2. x=1: cur = max(3, 2+1) = 3. Result 3. Without the last: [1,2,3]. x=1: cur=1. x=2: cur = max(1, 0+2) = 2. x=3: cur = max(2, 1+3) = 4. Result 4. The answer is max(3, 4) = 4.",
      "tests": "assert best_trip([2,3,2]) == 3\nassert best_trip([1,2,3,1]) == 4\nassert best_trip([1,2,3]) == 3\nassert best_trip([5]) == 5                  # one machine\nassert best_trip([4,9]) == 9                # two neighbours\nassert best_trip([0,0,0]) == 0\nassert best_trip([200,3,140,20,10]) == 340  # 200 + 140, first and third\nassert best_trip([1,3,1,3,100]) == 103      # 3 + 100, not the first machine\nassert best_trip([2,7,9,3,1]) == 11\nprint(\"all good\")\n",
      "followups": [
        {
          "q": "Why is it enough to solve two lines instead of tracking whether the first machine was used?",
          "a": "Every valid trip either skips machine 0 or skips machine n-1, since taking both is forbidden. The two lines cover exactly those two families, so the larger of the two answers is the best trip. A state-carrying DP would work too, but it needs a flag in the state and is easier to get wrong."
        },
        {
          "q": "Can you avoid copying the lists?",
          "a": "Yes. Give `line` bounds: `def line(lo, hi): prev = cur = 0; for i in range(lo, hi): prev, cur = cur, max(cur, prev + cash[i]); return cur`, then return `max(line(1, n), line(0, n - 1))`. That is O(1) extra space."
        },
        {
          "q": "Now the street is a tree (LC 337). What changes?",
          "a": "The state per node becomes a pair: the best if this node is taken, and the best if it is not. A post-order walk combines the children: taking the node adds the 'not taken' values of the children, and not taking it adds the better value of each child. The answer is the larger of the root's pair."
        }
      ],
      "reveal": {
        "lc": "LeetCode 213 House Robber II (medium)",
        "topic": "Run the linear take-or-skip DP twice, once without each end of the circle",
        "pattern": "dp"
      }
    },
    {
      "id": "d17-d",
      "minutes": 25,
      "title": "Can the courier reach the last locker",
      "scenario": "A courier moves along a row of lockers numbered from 0. She starts at locker 0. Each locker `i` has a battery pack worth `reach[i]`, and from locker `i` she may jump forward any number of lockers from 0 up to `reach[i]`. Return `True` if she can get to the last locker, otherwise `False`.",
      "examples": [
        {
          "input": "reach = [2,3,1,1,4]",
          "output": "True",
          "note": "Jump 1 to locker 1, then 3 to the end."
        },
        {
          "input": "reach = [3,2,1,0,4]",
          "output": "False",
          "note": "Every path lands on locker 3, which has reach 0, and the end is one further."
        },
        {
          "input": "reach = [0]",
          "output": "True",
          "note": "She is already at the last locker."
        }
      ],
      "constraints": [
        "1 <= len(reach) <= 10000",
        "0 <= reach[i] <= 100000",
        "a jump may be shorter than reach[i]"
      ],
      "clarify": [
        {
          "q": "Must each jump be exactly reach[i]?",
          "a": "No. Any distance from 0 up to reach[i] is allowed."
        },
        {
          "q": "Can she jump backwards?",
          "a": "No, only forward."
        },
        {
          "q": "Is a single locker a success?",
          "a": "Yes. She starts on the last locker."
        },
        {
          "q": "Do I need the actual path?",
          "a": "No, only whether it can be done."
        }
      ],
      "starter": "def can_reach_end(reach):\n    ...\n",
      "hints": [
        "Do not think about which jump to take. Ask instead: given the lockers I have looked at so far, what is the furthest locker I could possibly be standing on?",
        "Walk left to right and keep `furthest`, the largest `i + reach[i]` seen so far. If you arrive at a locker `i` that is beyond `furthest`, you could never have stood there.",
        "For each `i`, if `i > furthest` return `False`. Otherwise update `furthest = max(furthest, i + reach[i])`. If you finish the loop, return `True`."
      ],
      "solution": "def can_reach_end(reach):\n    furthest = 0                          # the furthest locker we can stand on so far\n    for i, r in enumerate(reach):\n        if i > furthest:                  # a gap we cannot cross\n            return False\n        furthest = max(furthest, i + r)\n        if furthest >= len(reach) - 1:    # early exit, the end is within reach\n            return True\n    return True\n",
      "complexity": "O(n) time, O(1) space: one pass with one number of state.",
      "explain": [
        "Brute force: from locker 0, try every jump length, recursively. That is exponential. Adding a memo on 'can I reach the end from locker i' makes it O(n^2), because each locker looks at up to `reach[i]` next lockers.",
        "The DP version: work from the right, mark `good[i]` true if some `j` in `i+1 .. i+reach[i]` is good, and `good[n-1]` is true. It is correct but still O(n^2) in the worst case.",
        "The greedy improvement: the set of lockers she can stand on is always a prefix, because any locker up to the furthest one is reachable. So one number, `furthest`, is the whole state.",
        "If the scan arrives at a locker beyond `furthest`, it is unreachable, so the answer is `False`. If `furthest` ever covers the last locker, the answer is `True`."
      ],
      "dryrun": "reach = [3,2,1,0,4]. furthest = 0. i=0: not beyond 0, furthest = max(0, 0+3) = 3. i=1: furthest = max(3, 1+2) = 3. i=2: furthest = max(3, 2+1) = 3. i=3: furthest = max(3, 3+0) = 3. i=4: 4 > 3, so return False.",
      "tests": "assert can_reach_end([2,3,1,1,4]) is True\nassert can_reach_end([3,2,1,0,4]) is False\nassert can_reach_end([0]) is True\nassert can_reach_end([0,1]) is False          # stuck at the start\nassert can_reach_end([1,0]) is True\nassert can_reach_end([2,0,0]) is True         # jump over zeros\nassert can_reach_end([1,1,0,1]) is False\nassert can_reach_end([5,0,0,0,0,0]) is True   # one long jump\nassert can_reach_end([1] * 10000) is True\nassert can_reach_end([1] * 5000 + [0] + [1] * 4999) is False\nprint(\"all good\")\n",
      "followups": [
        {
          "q": "Now return the minimum number of jumps (LC 45). What changes?",
          "a": "Keep two borders: the end of the current jump's range and the furthest reach seen. When the scan hits the current border, count a jump and move the border to `furthest`. Still O(n) time, O(1) space."
        },
        {
          "q": "Why does greedy work here when it usually needs a proof?",
          "a": "Reachability is a prefix: if locker k is reachable then every locker before it on the way was reachable too, and anything less than `furthest` can be landed on by shortening a jump. So tracking the max is lossless."
        },
        {
          "q": "Can you show the DP version and say why it is slower?",
          "a": "From the right: `good = [False] * n; good[-1] = True; for i in range(n - 2, -1, -1): good[i] = any(good[j] for j in range(i + 1, min(n, i + reach[i] + 1)))`. The inner scan can touch many lockers for each i, so it is O(n^2) in the worst case. The greedy pass replaces the scan with one running maximum."
        }
      ],
      "reveal": {
        "lc": "LeetCode 55 Jump Game (medium)",
        "topic": "Greedy furthest reach, one pass",
        "pattern": "dp"
      }
    },
    {
      "id": "d17-e",
      "minutes": 25,
      "title": "Find a label on a rotated shelf",
      "scenario": "A warehouse keeps item labels in increasing order along a circular rack, but the rack was rotated by some unknown amount, so the list starts part-way through. For example, the order 0, 1, 2, 4, 5, 6, 7 might appear as 4, 5, 6, 7, 0, 1, 2. All labels are distinct. Given the rotated list and a target label, return its position, or `-1` if it is not there. It must run in O(log n) time.",
      "examples": [
        {
          "input": "labels = [4,5,6,7,0,1,2], target = 0",
          "output": "4",
          "note": "The label 0 sits at position 4."
        },
        {
          "input": "labels = [4,5,6,7,0,1,2], target = 3",
          "output": "-1",
          "note": "3 is not on the rack."
        },
        {
          "input": "labels = [1], target = 0",
          "output": "-1",
          "note": "A one-item rack without the target."
        }
      ],
      "constraints": [
        "1 <= len(labels) <= 5000",
        "all labels are distinct",
        "the list is a sorted list rotated at an unknown pivot, possibly by 0",
        "-10000 <= label, target <= 10000"
      ],
      "clarify": [
        {
          "q": "Can labels repeat?",
          "a": "Not here. All are distinct. Be ready to say what changes if they could."
        },
        {
          "q": "Can the rotation be zero, so the list is simply sorted?",
          "a": "Yes."
        },
        {
          "q": "Do I need to find the rotation point first?",
          "a": "You may, but it is not required."
        },
        {
          "q": "What do I return when the target is missing?",
          "a": "-1."
        }
      ],
      "starter": "def find_label(labels, target):\n    ...\n",
      "hints": [
        "A plain binary search needs a sorted list, and this one is sorted in two pieces. Can you still throw half away each step?",
        "Look at the middle. One of the two halves, left of it or right of it, is always fully sorted. Find out which, then ask whether the target lies inside that sorted half.",
        "If `labels[lo] <= labels[mid]`, the left half is sorted: if `labels[lo] <= target < labels[mid]` go left, else go right. Otherwise the right half is sorted: if `labels[mid] < target <= labels[hi]` go right, else go left."
      ],
      "solution": "def find_label(labels, target):\n    lo, hi = 0, len(labels) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if labels[mid] == target:\n            return mid\n        if labels[lo] <= labels[mid]:                    # left half is sorted\n            if labels[lo] <= target < labels[mid]:\n                hi = mid - 1                             # target is inside the sorted left half\n            else:\n                lo = mid + 1\n        else:                                            # right half is sorted\n            if labels[mid] < target <= labels[hi]:\n                lo = mid + 1                             # target is inside the sorted right half\n            else:\n                hi = mid - 1\n    return -1\n",
      "complexity": "O(log n) time, O(1) space: each step discards half of the range.",
      "explain": [
        "Brute force: scan the list for the target. That is O(n) and ignores the structure, and the problem asks for O(log n).",
        "Two passes also work: binary search for the pivot (the smallest label), then a normal binary search in the correct side. It is O(log n) but you write two searches.",
        "The improvement is one search. At any `mid`, at least one half is sorted, because the pivot can only be in one of them. A sorted half lets us test in O(1) whether the target is inside it.",
        "If the target is in the sorted half, search there. If not, it must be in the other half, so search that. Either way, half the range is gone."
      ],
      "dryrun": "labels = [4,5,6,7,0,1,2], target = 0. lo=0, hi=6, mid=3, labels[3]=7, not 0. labels[0]=4 <= 7, so the left half is sorted. Is 4 <= 0 < 7? No, so lo = 4. Now lo=4, hi=6, mid=5, labels[5]=1. labels[4]=0 <= 1, so left half [0,1] is sorted. Is 0 <= 0 < 1? Yes, hi = 4. Now lo=4, hi=4, mid=4, labels[4] = 0. Match, return 4.",
      "tests": "assert find_label([4,5,6,7,0,1,2], 0) == 4\nassert find_label([4,5,6,7,0,1,2], 3) == -1\nassert find_label([1], 0) == -1\nassert find_label([1], 1) == 0\nassert find_label([1,3], 3) == 1\nassert find_label([3,1], 1) == 1\nassert find_label([3,1], 3) == 0\nassert find_label([1,2,3,4,5], 4) == 3              # not rotated\nassert find_label([5,1,2,3,4], 5) == 0              # pivot right after the first item\nassert find_label([2,3,4,5,1], 1) == 4\nfor n in range(1, 12):                               # every rotation, every target\n    base = list(range(0, 2 * n, 2))\n    for k in range(n):\n        arr = base[k:] + base[:k]\n        for t in range(-1, 2 * n + 1):\n            want = arr.index(t) if t in arr else -1\n            assert find_label(arr, t) == want, (arr, t)\nprint(\"all good\")\n",
      "followups": [
        {
          "q": "Labels can now repeat (LC 81). Does the same code work, and what is the cost?",
          "a": "Not as written. When `labels[lo] == labels[mid] == labels[hi]` you cannot tell which half is sorted, so shrink both ends by one and carry on. The worst case, an array of all equal labels with the target missing, is O(n). Code:\n\n```python\ndef find_label_dups(labels, target):\n    lo, hi = 0, len(labels) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if labels[mid] == target:\n            return True\n        if labels[lo] == labels[mid] == labels[hi]:\n            lo += 1                       # cannot tell which half is sorted\n            hi -= 1\n        elif labels[lo] <= labels[mid]:\n            if labels[lo] <= target < labels[mid]:\n                hi = mid - 1\n            else:\n                lo = mid + 1\n        else:\n            if labels[mid] < target <= labels[hi]:\n                lo = mid + 1\n            else:\n                hi = mid - 1\n    return False\n```"
        },
        {
          "q": "Why does the test use `<=` on the left comparison?",
          "a": "When `lo == mid` the left half is a single item and counts as sorted. With `<` the code would take the wrong branch on two-item ranges, such as [3, 1] searching for 1."
        },
        {
          "q": "How would you find the rotation point alone?",
          "a": "Binary search for the minimum: compare `labels[mid]` with `labels[hi]`. If it is larger, the minimum is to the right, so `lo = mid + 1`. Otherwise `hi = mid`. When the range has one item, that is the pivot."
        }
      ],
      "reveal": {
        "lc": "LeetCode 33 Search in Rotated Sorted Array (medium)",
        "topic": "One binary search that decides which half is sorted",
        "pattern": "binary"
      }
    }
  ]
});
