/* The coding page's data: patterns, AI systems topics, algorithm cards, the Algorithms tab (algos) and sheet extras.
   Shared by CODING.html and CHEATSHEET.html (coding/sheet.js). Edit here; every code block is tested,
   so add a test when you add one. An algos item is {id, title, also, spot or card, pat, ex, code, time, space, notes, vars}:
   a card key takes its spot from the cheat-sheet card in algo; every item needs a check in coding/test_behaviour.py.
   lc: per problem and variation, keyed "<pattern>/<name>": difficulty d, LeetCode slug lc, yt [video id, channel, minutes]. */
window.CODING = {
 "groups": [
  {
   "id": "start",
   "title": "Start",
   "blurb": "How to code out loud, and what each operation costs. Then a tab per group: every pattern opens to an example, a template, classic problems and their variations; every AI topic to its design, components, what to remember and what they will ask. The Algorithms tab is one long page with every algorithm's code. The <a href=\"CHEATSHEET.html\">cheat sheet</a> has all of it on one screen."
  },
  {
   "id": "core",
   "title": "Core",
   "blurb": "Arrays and strings. Most first-round problems are one of these six."
  },
  {
   "id": "structures",
   "title": "Structures",
   "blurb": "Linked lists, trees, graphs, heaps and intervals."
  },
  {
   "id": "techniques",
   "title": "Techniques",
   "blurb": "Dynamic programming, backtracking, concurrency and object-oriented design."
  },
  {
   "id": "algorithms",
   "title": "Algorithms",
   "blurb": "The algorithms a coding loop leans on, in Python, on one page: when to reach for each, the code, what it costs, and the variants worth knowing. Scroll it, or jump with the index."
  },
  {
   "id": "ai-systems",
   "title": "AI systems",
   "blurb": "The coding beyond LeetCode: 'here is our parser, build RAG over it'. Each topic is its design in components, a short skeleton for each, the whole thing wired end to end, what to remember and what they will ask. The code runs offline with small fakes where a model or a service would be."
  }
 ],
 "patterns": [
  {
   "id": "hashing",
   "title": "Arrays and hashing",
   "group": "Core",
   "ex": {
    "i": "nums = [2, 7, 11, 15], target = 9",
    "o": "[0, 1]",
    "w": "the two numbers that add to 9"
   },
   "sheet": {
    "spot": "Seen it before? Pairs, duplicates, groups, counts.",
    "move": "dict value &rarr; index, Counter, set.",
    "code": "seen = {}\nfor i, x in enumerate(a):\n    if t - x in seen: return [seen[t - x], i]\n    seen[x] = i",
    "notes": [
     "Group anagrams: key = tuple(sorted(w)).",
     "Longest run: start only where x - 1 not in set.",
     "O(n) time, O(n) space."
    ]
   },
   "vars": [
    {
     "n": "Contains duplicate",
     "ex": {
      "i": "[1, 2, 3, 1]",
      "o": "True",
      "w": "1 appears twice"
     },
     "t": "You only need to know whether a value was seen before, not where. Which structure answers that quickly, and when can you stop?",
     "code": "def contains_duplicate(nums):\n    seen = set()  # every value met so far\n    for x in nums:\n        if x in seen:\n            return True  # x came earlier, so it appears twice\n        seen.add(x)\n    return False  # we got through the list without a repeat",
     "st": {
      "p": "Given a list of integers `nums`, return True if any value appears at least twice, and False if every value is distinct.\n\nAn empty list returns False.",
      "ex": [
       {
        "i": "nums = [1, 2, 3, 1]",
        "o": "True",
        "why": "1 appears at index 0 and again at index 3"
       },
       {
        "i": "nums = []",
        "o": "False",
        "why": "an empty list has no repeated value"
       }
      ],
      "k": [
       "0 <= len(nums) <= 10^5",
       "-10^9 <= nums[i] <= 10^9"
      ]
     }
    },
    {
     "n": "Valid anagram",
     "ex": {
      "i": "\"anagram\", \"nagaram\"",
      "o": "True",
      "w": "same letters, same counts"
     },
     "t": "If t is a rearrangement of s, how do the letter counts of the two strings compare?",
     "code": "def is_anagram(s, t):\n    if len(s) != len(t):\n        return False  # different lengths can never match\n    counts = {}  # letter -> how many more times s has it than t\n    for a, b in zip(s, t):\n        counts[a] = counts.get(a, 0) + 1\n        counts[b] = counts.get(b, 0) - 1\n    # Anagrams use every letter equally often, so every balance is back to zero\n    for n in counts.values():\n        if n != 0:\n            return False\n    return True",
     "st": {
      "p": "Given two strings `s` and `t`, return True if `t` is an anagram of `s`, and False otherwise.\n\nAn anagram uses exactly the same characters the same number of times. Comparison is case-sensitive, so 'A' and 'a' are different characters.",
      "ex": [
       {
        "i": "s = \"anagram\", t = \"nagaram\"",
        "o": "True",
        "why": "both strings use the same letters with the same counts"
       },
       {
        "i": "s = \"aacc\", t = \"ccac\"",
        "o": "False",
        "why": "s has two a's and two c's, but t has one a and three c's: same length, different counts"
       }
      ],
      "k": [
       "0 <= len(s), len(t) <= 5*10^4",
       "s and t contain letters (any case)",
       "strings of different lengths are never anagrams"
      ]
     },
     "alt": {
      "note": "Same idea in one line: `Counter` builds the letter counts for both strings and compares them.",
      "code": "from collections import Counter\n\ndef is_anagram(s, t):\n    return Counter(s) == Counter(t)"
     }
    },
    {
     "n": "Top k frequent elements",
     "ex": {
      "i": "[1, 1, 1, 2, 2, 3], k = 2",
      "o": "[1, 2]",
      "w": "the two most common"
     },
     "t": "Count how often each value appears, then order the values by that count. What does a stable sort do with equal counts?",
     "code": "def top_k_frequent(nums, k):\n    counts = {}  # value -> how many times it appears (keys stay in first-seen order)\n    for x in nums:\n        counts[x] = counts.get(x, 0) + 1\n    # sorted is stable: values with equal counts keep their first-seen order\n    values = sorted(counts, key=lambda v: -counts[v])\n    return values[:k]  # the k most frequent",
     "st": {
      "p": "Given a list of integers `nums` and an integer `k`, return the `k` most frequent values, from most frequent to least frequent.\n\nWhen two values appear equally often, the one that appeared first in `nums` comes first. `k` never exceeds the number of distinct values.",
      "ex": [
       {
        "i": "nums = [1, 1, 1, 2, 2, 3], k = 2",
        "o": "[1, 2]",
        "why": "1 appears 3 times, 2 appears 2 times, both more than 3's single appearance"
       },
       {
        "i": "nums = [1, 2, 3], k = 2",
        "o": "[1, 2]",
        "why": "all three values appear once, so ties go by first appearance and the first two are kept"
       }
      ],
      "k": [
       "1 <= len(nums) <= 10^5",
       "k <= number of distinct values in nums",
       "ties broken by first-seen order"
      ]
     },
     "alt": {
      "note": "Same result in one line: `Counter` does the counting and `most_common(k)` returns the k biggest, ties in first-seen order.",
      "code": "from collections import Counter\n\ndef top_k_frequent(nums, k):\n    return [x for x, _ in Counter(nums).most_common(k)]"
     }
    },
    {
     "n": "First unique character",
     "ex": {
      "i": "\"leetcode\"",
      "o": "0",
      "w": "\"l\" appears once"
     },
     "t": "A character is unique only if it appears once in the whole string. What must you know about every letter before you can answer for the first one?",
     "code": "def first_uniq(s):\n    counts = {}  # character -> how many times it appears in s\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    # Walk left to right so the first character with a count of 1 wins\n    for i, c in enumerate(s):\n        if counts[c] == 1:\n            return i\n    return -1  # every character repeats, or s is empty",
     "st": {
      "p": "Given a string `s`, return the index of the first character that appears exactly once in `s`.\n\nIf no character appears exactly once, including when `s` is empty, return -1.",
      "ex": [
       {
        "i": "s = \"leetcode\"",
        "o": "0",
        "why": "'l' at index 0 appears only once"
       },
       {
        "i": "s = \"aabb\"",
        "o": "-1",
        "why": "every character appears twice"
       }
      ],
      "k": [
       "0 <= len(s) <= 10^5",
       "s contains lowercase English letters",
       "returns -1 when no character is unique"
      ]
     },
     "alt": {
      "note": "Same counts in one line: `Counter` builds the dictionary for you.",
      "code": "from collections import Counter\n\ndef first_uniq(s):\n    cnt = Counter(s)\n    for i, c in enumerate(s):\n        if cnt[c] == 1:\n            return i\n    return -1"
     }
    }
   ],
   "spot": "You need to find pairs, duplicates or groups, or count things. <b>Signal:</b> 'have I seen this before?'",
   "cx": "Usually O(n) time, O(n) space.",
   "tpl": "seen = {}\nfor i, x in enumerate(nums):\n    if target - x in seen:\n        return [seen[target - x], i]\n    seen[x] = i",
   "probs": [
    {
     "n": "Two Sum",
     "ex": {
      "i": "nums = [2, 7, 11, 15], target = 9",
      "o": "[0, 1]",
      "w": "2 + 7 = 9"
     },
     "l": "easy",
     "task": "Return indices of two numbers that add up to target.",
     "hint": "For each number, the partner you need is target minus it. How could you check in O(1) whether you have already seen that partner?",
     "sol": "def two_sum(nums, target):\n    seen = {}  # value -> the index where we saw it\n    for i, x in enumerate(nums):\n        need = target - x  # the partner that would complete the pair\n        if need in seen:\n            # The partner came earlier, so its index goes first\n            return [seen[need], i]\n        seen[x] = i  # remember x for the numbers after it\n    return []",
     "c": "O(n) time: one dictionary look-up per number. O(n) space for the dictionary.",
     "st": {
      "p": "Given a list of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nExactly one pair adds up to `target`, and you may not use the same index twice. Return the smaller index first.",
      "ex": [
       {
        "i": "nums = [2, 7, 11, 15], target = 9",
        "o": "[0, 1]",
        "why": "nums[0] + nums[1] = 2 + 7 = 9"
       },
       {
        "i": "nums = [3, 2, 4], target = 6",
        "o": "[1, 2]",
        "why": "2 + 4 = 6; the pair does not have to include index 0"
       }
      ],
      "k": [
       "2 <= len(nums) <= 10^4",
       "-10^9 <= nums[i], target <= 10^9",
       "exactly one valid pair exists",
       "Aim for O(n) time"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "Try every pair. It works, but for each number it rescans the rest of the list. What if we remembered the numbers we have already passed?",
      "code": "def two_sum(nums, target):\n    # Try every pair (i, j) with i before j\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []  # never reached: a pair always exists"
     }
    },
    {
     "n": "Group anagrams",
     "ex": {
      "i": "[\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
      "o": "[[\"eat\", \"tea\", \"ate\"], [\"tan\", \"nat\"], [\"bat\"]]",
      "w": "same letters, same group"
     },
     "l": "medium",
     "task": "Group words that are anagrams of each other.",
     "hint": "Two anagrams look identical once their letters are put in order. Could that sorted form be a label that every word of a group shares?",
     "sol": "def group_anagrams(words):\n    groups = {}  # sorted letters -> the words that have those letters\n    for w in words:\n        # Anagrams all sort to the same string, so it works as their label\n        key = \"\".join(sorted(w))\n        if key not in groups:\n            groups[key] = []\n        groups[key].append(w)\n    # A dict keeps insertion order, so groups come out by first appearance\n    return list(groups.values())",
     "c": "O(n k log k) time for n words of length k: each word is sorted once. O(n k) space for the groups.",
     "st": {
      "p": "Given a list of lowercase strings `words`, group together the words that are anagrams of each other and return the groups.\n\nEvery word belongs to exactly one group. Groups are listed in the order of their first word in `words`, and the words inside a group keep their input order.",
      "ex": [
       {
        "i": "words = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
        "o": "[[\"eat\", \"tea\", \"ate\"], [\"tan\", \"nat\"], [\"bat\"]]",
        "why": "eat, tea and ate use the same letters; tan and nat use the same letters; bat is alone"
       },
       {
        "i": "words = [\"ab\", \"ba\", \"a\"]",
        "o": "[[\"ab\", \"ba\"], [\"a\"]]",
        "why": "ab and ba are anagrams; a has no partner"
       }
      ],
      "k": [
       "1 <= len(words) <= 10^4",
       "0 <= len(word) <= 100",
       "words contain lowercase English letters only",
       "group and within-group order matches first appearance in the input"
      ]
     },
     "alt": {
      "note": "Same grouping with `defaultdict(list)`: a missing key starts as an empty list, so the `if` is not needed.",
      "code": "from collections import defaultdict\n\ndef group_anagrams(words):\n    groups = defaultdict(list)\n    for w in words:\n        groups[\"\".join(sorted(w))].append(w)\n    return list(groups.values())"
     }
    },
    {
     "n": "Longest consecutive sequence",
     "ex": {
      "i": "[100, 4, 200, 1, 3, 2]",
      "o": "4",
      "w": "the run 1, 2, 3, 4"
     },
     "l": "medium",
     "task": "Length of the longest run of consecutive integers, in O(n).",
     "hint": "Sorting would cost O(n log n). If you could test in O(1) whether x + 1 is present, which numbers are worth starting a count from, so that no run is counted twice?",
     "sol": "def longest_consecutive(nums):\n    s = set(nums)  # a set: quick membership test, and repeats vanish\n    best = 0\n    for x in s:\n        # x starts a run only if x - 1 is missing\n        if x - 1 not in s:\n            y = x\n            # Walk up the run one number at a time\n            while y + 1 in s:\n                y += 1\n            best = max(best, y - x + 1)  # the run is x..y\n    return best",
     "c": "O(n) time: the inner walk only starts at the first number of a run, so each number is visited at most twice. O(n) space for the set.",
     "st": {
      "p": "Given a list of integers `nums`, return the length of the longest run of consecutive integers (such as 3, 4, 5) among its values.\n\nThe values do not have to sit next to each other in the list, and a repeated value counts once. An empty list returns 0.",
      "ex": [
       {
        "i": "nums = [100, 4, 200, 1, 3, 2]",
        "o": "4",
        "why": "1, 2, 3 and 4 form the longest run"
       },
       {
        "i": "nums = [1, 2, 2, 3]",
        "o": "3",
        "why": "the run is 1, 2, 3; the repeated 2 does not make it longer"
       }
      ],
      "k": [
       "0 <= len(nums) <= 10^5",
       "-10^9 <= nums[i] <= 10^9",
       "duplicates do not count twice toward a run's length",
       "Aim for O(n) time"
      ]
     }
    }
   ],
   "g": "core"
  },
  {
   "id": "prefix",
   "title": "Prefix sums",
   "group": "Core",
   "ex": {
    "i": "nums = [1, 1, 1], k = 2",
    "o": "2",
    "w": "two subarrays sum to 2"
   },
   "sheet": {
    "spot": "Subarray sum equals k; range sums; negatives allowed.",
    "move": "Count earlier prefixes equal to run - k.",
    "code": "seen, run, ans = Counter({0: 1}), 0, 0\nfor x in a:\n    run += x\n    ans += seen[run - k]\n    seen[run] += 1",
    "notes": [
     "Seed {0: 1}: a run from index 0.",
     "Range sum = pre[r + 1] - pre[l].",
     "O(n)."
    ]
   },
   "vars": [
    {
     "n": "Range sum queries",
     "ex": {
      "i": "nums = [-2, 0, 3, -5, 2, -1]; sum of 0..2",
      "o": "1",
      "w": "-2 + 0 + 3"
     },
     "t": "You will be asked about the same list many times. If you stored the running total up to each position, what would one query cost?",
     "code": "class RangeSum:\n    def __init__(self, nums):\n        # pre[i] = sum of the first i numbers, so pre[0] = 0\n        self.pre = [0]\n        for x in nums:\n            self.pre.append(self.pre[-1] + x)\n\n    def sum(self, i, j):  # inclusive\n        # Total up to and including j, minus the total before i\n        return self.pre[j + 1] - self.pre[i]",
     "st": {
      "p": "Design a class `RangeSum`. `RangeSum(nums)` is built once from a list of integers. Its method `sum(i, j)` returns the sum of `nums[i..j]`, both ends included.\n\n`nums` never changes after it is built, and `i <= j` always holds. Aim for O(n) to build and O(1) per query.",
      "ex": [
       {
        "i": "nums = [-2, 0, 3, -5, 2, -1]; ops: RangeSum(nums), sum(0, 2)",
        "o": "1",
        "why": "-2 + 0 + 3 = 1"
       },
       {
        "i": "nums = [-2, 0, 3, -5, 2, -1]; ops: RangeSum(nums), sum(2, 5)",
        "o": "-1",
        "why": "3 + -5 + 2 + -1 = -1"
       }
      ],
      "k": [
       "1 <= len(nums) <= 10^4",
       "-10^5 <= nums[i] <= 10^5",
       "0 <= i <= j < len(nums) for every query",
       "each query answered in O(1) after the O(n) build"
      ]
     }
    },
    {
     "n": "Product of array except self",
     "ex": {
      "i": "[1, 2, 3, 4]",
      "o": "[24, 12, 8, 6]",
      "w": "no division allowed"
     },
     "t": "The product of everything except nums[i] is the product on its left times the product on its right. Can you build each side in its own sweep?",
     "code": "def product_except_self(nums):\n    out = [1] * len(nums)  # out[i] will hold the product of all the others\n    # Left to right: out[i] gets the product of everything before i\n    left = 1  # product of the numbers to the left of i\n    for i in range(len(nums)):\n        out[i] = left\n        left *= nums[i]\n    # Right to left: multiply in the product of everything after i\n    right = 1  # product of the numbers to the right of i\n    for i in range(len(nums) - 1, -1, -1):\n        out[i] *= right\n        right *= nums[i]\n    return out",
     "st": {
      "p": "Given a list of integers `nums`, return a list where position `i` holds the product of every element of `nums` except `nums[i]`.\n\nDo not use division. Aim for O(n) time and O(1) extra space beyond the output list.",
      "ex": [
       {
        "i": "nums = [1, 2, 3, 4]",
        "o": "[24, 12, 8, 6]",
        "why": "each position multiplies the other three values, for example 2 * 3 * 4 = 24"
       },
       {
        "i": "nums = [1, 0, 3]",
        "o": "[0, 3, 0]",
        "why": "index 1 leaves out the zero, so its product is 1 * 3 = 3; the other two products include the zero"
       }
      ],
      "k": [
       "2 <= len(nums) <= 10^5",
       "-30 <= nums[i] <= 30",
       "no division allowed",
       "Aim for O(n) time"
      ]
     }
    },
    {
     "n": "Longest subarray with equal 0s and 1s",
     "ex": {
      "i": "[0, 1, 0]",
      "o": "2",
      "w": "[0, 1] or [1, 0]"
     },
     "t": "Score each 0 as -1 and each 1 as +1, so a balanced stretch scores 0. When does the running score return to a value it has had before, and which earlier index is the best one to remember?",
     "code": "def find_max_length(nums):\n    # first: running score -> the first index where we reached it\n    first = {0: -1}  # score 0 before the list starts (index -1)\n    run = 0  # +1 for each 1, -1 for each 0\n    best = 0\n    for i, x in enumerate(nums):\n        if x == 1:\n            run += 1\n        else:\n            run -= 1\n        if run in first:\n            # Same score as before: the stretch in between has equal 0s and 1s\n            best = max(best, i - first[run])\n        else:\n            first[run] = i  # keep the earliest index, so stretches come out longest\n    return best",
     "st": {
      "p": "Given a list `nums` that contains only 0s and 1s, return the length of the longest contiguous subarray with an equal number of 0s and 1s.\n\nIf there is no such subarray, return 0.",
      "ex": [
       {
        "i": "nums = [0, 1, 0]",
        "o": "2",
        "why": "[0, 1] has one 0 and one 1, and so does [1, 0]"
       },
       {
        "i": "nums = [0, 0, 1, 1]",
        "o": "4",
        "why": "the whole list has two 0s and two 1s"
       }
      ],
      "k": [
       "1 <= len(nums) <= 10^5",
       "nums[i] is 0 or 1",
       "returns 0 when no balanced subarray exists"
      ]
     }
    },
    {
     "n": "Subarrays divisible by k",
     "ex": {
      "i": "[4, 5, 0, -2, -3, 1], k = 5",
      "o": "7",
      "w": "sums like 5, 0, -5"
     },
     "t": "Two running totals that leave the same remainder after dividing by k differ by a multiple of k. What should you count as you go?",
     "code": "def subarrays_div_by_k(nums, k):\n    # seen: remainder -> how many times the running total has left it\n    seen = {0: 1}  # the empty start has remainder 0\n    run = 0  # running total, kept modulo k\n    count = 0\n    for x in nums:\n        run = (run + x) % k  # Python's % is never negative when k is positive\n        # Each earlier total with this remainder leaves a stretch divisible by k\n        count += seen.get(run, 0)\n        seen[run] = seen.get(run, 0) + 1\n    return count",
     "st": {
      "p": "Given a list of integers `nums` and a positive integer `k`, return the number of contiguous subarrays whose sum is divisible by `k`.\n\n`nums` may contain negative numbers. A sum of 0 counts as divisible.",
      "ex": [
       {
        "i": "nums = [4, 5, 0, -2, -3, 1], k = 5",
        "o": "7",
        "why": "seven contiguous subarrays sum to a multiple of 5"
       },
       {
        "i": "nums = [5, 0, 0], k = 5",
        "o": "6",
        "why": "every one of the six subarrays sums to 0, 5 or 10, all divisible by 5"
       }
      ],
      "k": [
       "1 <= len(nums) <= 3*10^4",
       "-10^4 <= nums[i] <= 10^4",
       "2 <= k <= 10^4",
       "Aim for O(n) time"
      ]
     }
    }
   ],
   "spot": "Sums over subarrays, many range queries. <b>Signal:</b> 'sum of a subarray equals k'.",
   "cx": "O(n) to build; O(1) per range sum.",
   "tpl": "prefix = [0]\nfor x in nums:\n    prefix.append(prefix[-1] + x)\n# sum of nums[i:j] == prefix[j] - prefix[i]",
   "probs": [
    {
     "n": "Subarray sum equals k",
     "ex": {
      "i": "nums = [1, 1, 1], k = 2",
      "o": "2",
      "w": "[1, 1] starting at 0 and at 1"
     },
     "l": "medium",
     "task": "Count contiguous subarrays summing to k (numbers can be negative).",
     "hint": "A subarray from i to j adds up to k exactly when the running total at j minus the running total before i is k. As you go, how many earlier running totals equal the current one minus k?",
     "sol": "def subarray_sum(nums, k):\n    # seen: running total -> how many times we have had that total so far\n    seen = {0: 1}  # the empty start, so a subarray beginning at index 0 can count\n    run = 0  # sum of nums up to the current position\n    count = 0\n    for x in nums:\n        run += x\n        # A subarray ending here adds up to k for every earlier total equal to run - k\n        count += seen.get(run - k, 0)\n        seen[run] = seen.get(run, 0) + 1\n    return count",
     "c": "O(n) time: one dictionary look-up and update per number. O(n) space for the totals.",
     "st": {
      "p": "Given a list of integers `nums` and an integer `k`, return the number of contiguous subarrays whose elements add up to `k`.\n\n`nums` may contain negative numbers. Subarrays are counted by position: two subarrays with the same values at different places both count.",
      "ex": [
       {
        "i": "nums = [1, 1, 1], k = 2",
        "o": "2",
        "why": "nums[0:2] and nums[1:3] both add up to 2"
       },
       {
        "i": "nums = [1, -1, 0], k = 0",
        "o": "3",
        "why": "[1, -1], [1, -1, 0] and [0] each add up to 0"
       }
      ],
      "k": [
       "1 <= len(nums) <= 2*10^4",
       "-1000 <= nums[i] <= 1000",
       "k can be negative, zero, or positive",
       "Aim for O(n) time"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "Try every start and extend the end, adding as you go. Each start redoes work the others share: a subarray sum is the difference of two running totals, so could you count earlier totals instead?",
      "code": "def subarray_sum(nums, k):\n    count = 0\n    # Try every start, and extend the end one element at a time\n    for start in range(len(nums)):\n        total = 0  # sum of nums[start..end]\n        for end in range(start, len(nums)):\n            total += nums[end]\n            # Negative numbers mean the total can come back to k, so never stop early\n            if total == k:\n                count += 1\n    return count"
     },
     "alt": {
      "note": "Same idea with `Counter`: a missing key counts as 0, so no `.get` is needed.",
      "code": "from collections import Counter\n\ndef subarray_sum(nums, k):\n    seen, run, count = Counter({0: 1}), 0, 0\n    for x in nums:\n        run += x\n        count += seen[run - k]\n        seen[run] += 1\n    return count"
     }
    }
   ],
   "g": "core"
  },
  {
   "id": "pointers",
   "title": "Two pointers",
   "group": "Core",
   "ex": {
    "i": "[2, 7, 11, 15] sorted, target = 9",
    "o": "(0, 1)",
    "w": "sorted, so move the ends inward"
   },
   "sheet": {
    "spot": "Sorted array; pair or triplet sums; palindromes; in place.",
    "move": "Ends inward; move the side that fixes it.",
    "code": "l, r = 0, len(a) - 1\nwhile l < r:\n    s = a[l] + a[r]\n    if s == t: return l, r\n    if s < t: l += 1\n    else: r -= 1",
    "notes": [
     "3sum: sort, fix i, two pointers; skip duplicates.",
     "O(n) after an O(n log n) sort."
    ]
   },
   "vars": [
    {
     "n": "Remove duplicates in place",
     "ex": {
      "i": "[1, 1, 2, 2, 3]",
      "o": "3, array starts [1, 2, 3]",
      "w": "sorted input"
     },
     "t": "Keep a write position behind your read position. When is a number new enough to be written?",
     "code": "def remove_duplicates(nums):\n    w = 0  # next slot to write; nums[:w] holds the distinct values so far\n    for x in nums:\n        # The list is sorted, so x is new when it differs from the last value kept\n        if w == 0 or x != nums[w - 1]:\n            nums[w] = x\n            w += 1\n    return w  # how many distinct values",
     "st": {
      "p": "Given a list `nums` sorted in non-decreasing order, remove the duplicates in place so that each distinct value appears once at the front of the list, and return the number of distinct values.\n\nWhat is left in the positions after that count does not matter.",
      "ex": [
       {
        "i": "nums = [1, 1, 2, 2, 3]",
        "o": "3, array starts [1, 2, 3]",
        "why": "there are three distinct values: 1, 2 and 3"
       },
       {
        "i": "nums = [2, 2, 2, 2]",
        "o": "1, array starts [2]",
        "why": "every entry is the same value, so only one distinct value remains"
       }
      ],
      "k": [
       "0 <= len(nums) <= 3*10^4",
       "nums is sorted in non-decreasing order",
       "-100 <= nums[i] <= 100",
       "modifies nums in place and returns the new length"
      ]
     }
    },
    {
     "n": "Move zeroes",
     "ex": {
      "i": "[0, 1, 0, 3, 12]",
      "o": "[1, 3, 12, 0, 0]",
      "w": "order kept"
     },
     "t": "Where should the next non-zero value go? What is left to fill once all of them are in place?",
     "code": "def move_zeroes(nums):\n    w = 0  # next slot for a non-zero value\n    for x in nums:\n        if x != 0:\n            nums[w] = x  # copy non-zeros forward, keeping their order\n            w += 1\n    # Everything from w onward is left over, so fill it with zeros\n    for i in range(w, len(nums)):\n        nums[i] = 0\n    return nums",
     "st": {
      "p": "Given a list of integers `nums`, move all the zeros to the end while keeping the order of the non-zero values, and return the list.\n\nChange `nums` in place, without building a second list.",
      "ex": [
       {
        "i": "nums = [0, 1, 0, 3, 12]",
        "o": "[1, 3, 12, 0, 0]",
        "why": "the non-zero values keep their order and the zeros collect at the end"
       },
       {
        "i": "nums = [0, 0, 0]",
        "o": "[0, 0, 0]",
        "why": "there are no non-zero values, so the list stays the same"
       }
      ],
      "k": [
       "0 <= len(nums) <= 10^4",
       "-2^31 <= nums[i] <= 2^31 - 1",
       "must run in place using O(1) extra space"
      ]
     }
    },
    {
     "n": "Trapping rain water",
     "ex": {
      "i": "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
      "o": "6",
      "w": "units of water held"
     },
     "t": "The water above a bar depends on the tallest bar on each side. If you look at both ends of the list, which side already has its answer?",
     "code": "def trap(h):\n    l = 0  # left end\n    r = len(h) - 1  # right end\n    lmax = 0  # tallest bar seen so far from the left\n    rmax = 0  # tallest bar seen so far from the right\n    water = 0\n    while l < r:\n        if h[l] < h[r]:\n            # The right side has a wall at least as tall as anything on the left,\n            # so the left's best wall (lmax) sets the water level above h[l]\n            lmax = max(lmax, h[l])\n            water += lmax - h[l]\n            l += 1\n        else:\n            # Mirror image: the right's best wall sets the level above h[r]\n            rmax = max(rmax, h[r])\n            water += rmax - h[r]\n            r -= 1\n    return water",
     "st": {
      "p": "Given a list `h` of non-negative bar heights, each bar one unit wide, return how many units of water the bars hold after rain.\n\nWater sits above a bar up to the height of the shorter of the tallest bar to its left and the tallest bar to its right.",
      "ex": [
       {
        "i": "h = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        "o": "6",
        "why": "the dips between the taller bars hold 6 units of water in total"
       },
       {
        "i": "h = [5, 4, 3, 2, 1]",
        "o": "0",
        "why": "the heights only go down, so no dip can hold water"
       }
      ],
      "k": [
       "1 <= len(h) <= 2*10^4",
       "0 <= h[i] <= 10^5",
       "returns 0 when the terrain traps no water"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "For each bar, look left and right for the tallest wall. That rescans the list for every bar. Could you know the tallest wall on each side without searching for it every time?",
      "code": "def trap(h):\n    water = 0\n    for i in range(len(h)):\n        # Tallest wall on each side of bar i (bar i itself counts)\n        left_wall = max(h[:i + 1])\n        right_wall = max(h[i:])\n        # Water above bar i fills up to the shorter wall\n        water += min(left_wall, right_wall) - h[i]\n    return water"
     }
    }
   ],
   "spot": "Sorted arrays, pairs, palindromes, in-place changes. <b>Signal:</b> the input is sorted, or you compare both ends.",
   "cx": "O(n) time, O(1) space.",
   "tpl": "left, right = 0, len(a) - 1\nwhile left < right:\n    if condition(a[left], a[right]):\n        left += 1\n    else:\n        right -= 1",
   "probs": [
    {
     "n": "Valid palindrome",
     "ex": {
      "i": "\"A man, a plan, a canal: Panama\"",
      "o": "True",
      "w": "letters only, lowercased"
     },
     "l": "easy",
     "task": "Is a string a palindrome, ignoring case and non-alphanumerics?",
     "hint": "Compare the first and last characters that count, then move inward. What do you do when one of them is a space or punctuation?",
     "sol": "def is_palindrome(s):\n    l = 0  # left end\n    r = len(s) - 1  # right end\n    while l < r:\n        if not s[l].isalnum():\n            l += 1  # skip punctuation or a space on the left\n        elif not s[r].isalnum():\n            r -= 1  # same on the right\n        elif s[l].lower() != s[r].lower():\n            return False  # a mirrored pair that differs\n        else:\n            # This pair matches, so look at the next pair in\n            l += 1\n            r -= 1\n    return True",
     "c": "O(n) time: each character is looked at once. O(1) extra space.",
     "st": {
      "p": "Given a string `s`, return True if it reads the same forwards and backwards after you ignore case and everything that is not a letter or a digit, and False otherwise.\n\nA string with no letters or digits counts as a palindrome.",
      "ex": [
       {
        "i": "s = \"A man, a plan, a canal: Panama\"",
        "o": "True",
        "why": "ignoring punctuation, spaces and case, it reads amanaplanacanalpanama both ways"
       },
       {
        "i": "s = \"race a car\"",
        "o": "False",
        "why": "raceacar does not read the same backwards"
       }
      ],
      "k": [
       "0 <= len(s) <= 2*10^5",
       "s can contain letters, digits, spaces, and punctuation",
       "comparison is case-insensitive and ignores non-alphanumeric characters"
      ]
     }
    },
    {
     "n": "Container with most water",
     "ex": {
      "i": "[1, 8, 6, 2, 5, 4, 8, 3, 7]",
      "o": "49",
      "w": "lines at 1 and 8: width 7 times height 7"
     },
     "l": "medium",
     "task": "Max area between two lines.",
     "hint": "The widest pair has the biggest width. To beat it with a narrower pair, what has to happen to the shorter bar?",
     "sol": "def max_area(h):\n    l = 0  # left bar\n    r = len(h) - 1  # right bar: start as wide as possible\n    best = 0\n    while l < r:\n        # Water is limited by the shorter bar; the width is the gap between them\n        best = max(best, (r - l) * min(h[l], h[r]))\n        # Moving the taller bar inward shrinks the width and cannot raise the\n        # limit, so the only move that can help is to drop the shorter bar\n        if h[l] < h[r]:\n            l += 1\n        else:\n            r -= 1\n    return best",
     "c": "O(n) time: each step moves one end inward, so there are at most n steps. O(1) space.",
     "st": {
      "p": "Given a list `h` of non-negative bar heights, where neighbouring bars are one unit apart, return the largest amount of water that two of the bars can hold between them.\n\nThe water between two bars is the distance between their indices times the height of the shorter bar.",
      "ex": [
       {
        "i": "h = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        "o": "49",
        "why": "the bars at index 1 (height 8) and index 8 (height 7) give width 7 times height 7"
       },
       {
        "i": "h = [1, 1]",
        "o": "1",
        "why": "the only pair available has width 1 and height 1"
       }
      ],
      "k": [
       "2 <= len(h) <= 10^5",
       "0 <= h[i] <= 10^4",
       "Aim for O(n) time"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "Try every pair of bars. Most pairs can never win: starting from the widest pair, which bar can you safely give up on, and why?",
      "code": "def max_area(h):\n    best = 0\n    # Try every pair of bars (i, j) with i left of j\n    for i in range(len(h)):\n        for j in range(i + 1, len(h)):\n            area = (j - i) * min(h[i], h[j])  # width times the shorter bar\n            best = max(best, area)\n    return best"
     }
    },
    {
     "n": "3Sum",
     "ex": {
      "i": "[-1, 0, 1, 2, -1, -4]",
      "o": "[[-1, -1, 2], [-1, 0, 1]]",
      "w": "each triplet once"
     },
     "l": "medium",
     "task": "All unique triplets summing to zero.",
     "hint": "Fixing one number turns this into Two Sum on the rest. If the list is sorted, how can two ends close in on the target, and how do you avoid reporting repeats?",
     "sol": "def three_sum(nums):\n    nums.sort()  # sorted order lets two ends close in on a target sum\n    out = []\n    for i in range(len(nums) - 2):\n        # Skip a repeated first number so the same triplet is not reported twice\n        if i and nums[i] == nums[i - 1]:\n            continue\n        # With nums[i] fixed, look after it for two numbers that add up to -nums[i]\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0:\n                l += 1  # too small: we need a bigger number\n            elif s > 0:\n                r -= 1  # too big: we need a smaller number\n            else:\n                out.append([nums[i], nums[l], nums[r]])\n                l += 1\n                # Skip repeats of the middle number we just used\n                while l < r and nums[l] == nums[l - 1]:\n                    l += 1\n    return out",
     "c": "O(n^2) time: n choices for the first number, each with one linear sweep. O(1) extra space besides the output.",
     "st": {
      "p": "Given a list of integers `nums`, return all unique triplets of values that add up to 0.\n\nEach triplet is listed from low to high and the triplets come in increasing order. No triplet appears twice, even if it can be made from different positions, and a value can be used more than once in a triplet only if it appears that many times in `nums`.",
      "ex": [
       {
        "i": "nums = [-1, 0, 1, 2, -1, -4]",
        "o": "[[-1, -1, 2], [-1, 0, 1]]",
        "why": "these are the only two sets of three values that add up to 0, with repeats merged"
       },
       {
        "i": "nums = [0, 1, 1]",
        "o": "[]",
        "why": "no three values in this list sum to zero"
       }
      ],
      "k": [
       "3 <= len(nums) <= 3000",
       "-10^5 <= nums[i] <= 10^5",
       "duplicate triplets are reported only once",
       "Aim for O(n^2) time"
      ]
     }
    }
   ],
   "g": "core"
  },
  {
   "id": "window",
   "title": "Sliding window",
   "group": "Core",
   "ex": {
    "i": "s = \"abcabcbb\"",
    "o": "3",
    "w": "\"abc\", the longest run with no repeat"
   },
   "sheet": {
    "spot": "Longest or shortest contiguous run with a rule.",
    "move": "Grow right; shrink left while invalid.",
    "code": "l = best = 0\nfor r, c in enumerate(s):\n    cnt[c] += 1\n    while bad(cnt):\n        cnt[s[l]] -= 1; l += 1\n    best = max(best, r - l + 1)",
    "notes": [
     "Works only if shrinking restores validity.",
     "Length is r - l + 1. O(n)."
    ]
   },
   "vars": [
    {
     "n": "Shortest subarray with sum at least target",
     "ex": {
      "i": "target = 7, [2, 3, 1, 2, 4, 3]",
      "o": "2",
      "w": "[4, 3]"
     },
     "t": "All numbers are positive, so adding one grows the sum and removing one shrinks it. Once the sum reaches target, how do you find the shortest stretch that ends here?",
     "code": "def min_subarray_len(target, nums):\n    l = 0  # start of the current stretch\n    total = 0  # sum of nums[l..r]\n    best = len(nums) + 1  # longer than any real answer: \"none found yet\"\n    for r, x in enumerate(nums):\n        total += x  # extend the stretch to the right\n        # While the stretch is big enough, record it, then try dropping from the left\n        while total >= target:\n            best = min(best, r - l + 1)\n            total -= nums[l]\n            l += 1\n    # No stretch ever reached target\n    if best == len(nums) + 1:\n        return 0\n    return best",
     "st": {
      "p": "Given a positive integer `target` and a list `nums` of positive integers, return the length of the shortest contiguous subarray whose sum is at least `target`.\n\nIf no subarray reaches `target`, return 0.",
      "ex": [
       {
        "i": "target = 7, nums = [2, 3, 1, 2, 4, 3]",
        "o": "2",
        "why": "[4, 3] adds up to 7 using two elements, shorter than any other that reaches it"
       },
       {
        "i": "target = 100, nums = [1, 2, 3]",
        "o": "0",
        "why": "the whole list only adds up to 6, never reaching 100"
       }
      ],
      "k": [
       "1 <= target <= 10^9",
       "1 <= len(nums) <= 10^5",
       "1 <= nums[i] <= 10^4",
       "returns 0 when no subarray reaches target"
      ]
     }
    },
    {
     "n": "Longest run after k replacements",
     "ex": {
      "i": "\"AABABBA\", k = 1",
      "o": "4",
      "w": "\"AABA\" -> \"AAAA\""
     },
     "t": "A stretch can become one letter when its length minus the count of its most common letter is at most k. When that fails, which end of the stretch should move?",
     "code": "def character_replacement(s, k):\n    counts = {}  # letter -> how many times it appears in the stretch s[l..r]\n    l = 0\n    top = 0  # highest count any one letter has reached in a stretch so far\n    best = 0\n    for r, c in enumerate(s):\n        counts[c] = counts.get(c, 0) + 1\n        top = max(top, counts[c])  # never lowered: a smaller top cannot give a longer answer\n        # Letters to change = stretch length minus the most common letter's count.\n        # If that is more than k, drop the leftmost letter\n        while (r - l + 1) - top > k:\n            counts[s[l]] -= 1\n            l += 1\n        best = max(best, r - l + 1)\n    return best",
     "st": {
      "p": "Given a string `s` of uppercase letters and an integer `k`, return the length of the longest substring that can be turned into one repeated letter by changing at most `k` of its characters.\n\nCharacters outside the chosen substring are not touched.",
      "ex": [
       {
        "i": "s = \"AABABBA\", k = 1",
        "o": "4",
        "why": "\"AABA\" needs one change (the B to an A) to become all A's"
       },
       {
        "i": "s = \"ABAB\", k = 0",
        "o": "1",
        "why": "with k = 0 no two neighbouring characters match, so the best is a single character"
       }
      ],
      "k": [
       "1 <= len(s) <= 10^5",
       "s consists of uppercase English letters",
       "0 <= k <= len(s)"
      ]
     }
    },
    {
     "n": "Permutation in a string",
     "ex": {
      "i": "s1 = \"ab\", s2 = \"eidbaooo\"",
      "o": "True",
      "w": "\"ba\" is in s2"
     },
     "t": "A match must be a stretch of s2 that is exactly len(s1) long. How do its letter counts change when the stretch moves one step?",
     "code": "def check_inclusion(s1, s2):\n    k = len(s1)\n    need = {}  # letter -> how many times s1 has it\n    for c in s1:\n        need[c] = need.get(c, 0) + 1\n    win = {}  # letter -> how many times the current stretch of s2 has it\n    for r, c in enumerate(s2):\n        win[c] = win.get(c, 0) + 1  # the new letter enters on the right\n        if r >= k:\n            # The stretch is now k + 1 long, so the oldest letter leaves on the left\n            out = s2[r - k]\n            win[out] -= 1\n            if win[out] == 0:\n                del win[out]  # drop empty entries so equal counts mean equal dicts\n        if win == need:\n            return True  # the stretch has exactly the letters of s1\n    return False",
     "st": {
      "p": "Given two strings `s1` and `s2`, return True if `s2` contains a substring that is a rearrangement of `s1`, and False otherwise.\n\nA rearrangement uses exactly the same letters with the same counts.",
      "ex": [
       {
        "i": "s1 = \"ab\", s2 = \"eidbaooo\"",
        "o": "True",
        "why": "the substring \"ba\" inside s2 uses the letters of \"ab\""
       },
       {
        "i": "s1 = \"ab\", s2 = \"eidboaoo\"",
        "o": "False",
        "why": "no two neighbouring characters in s2 are the letters a and b together"
       }
      ],
      "k": [
       "1 <= len(s1) <= len(s2) <= 10^4",
       "s1 and s2 consist of lowercase English letters"
      ]
     }
    }
   ],
   "spot": "Contiguous subarrays or substrings with a condition. <b>Signal:</b> 'longest' or 'shortest' substring or subarray such that...",
   "cx": "O(n): each element enters and leaves the window once.",
   "tpl": "left = 0\nfor right, x in enumerate(s):\n    add(x)\n    while window_is_invalid():\n        remove(s[left])\n        left += 1\n    best = max(best, right - left + 1)",
   "probs": [
    {
     "n": "Longest substring without repeating characters",
     "ex": {
      "i": "\"abcabcbb\"",
      "o": "3",
      "w": "\"abc\""
     },
     "l": "medium",
     "task": "Length of the longest substring with all distinct characters.",
     "hint": "When the next character already appears in your current stretch, where must the stretch begin from now on? What would you need to remember to know that at once?",
     "sol": "def length_of_longest_substring(s):\n    last = {}  # character -> the index where we last saw it\n    left = 0  # start of the current stretch with no repeats\n    best = 0\n    for right, ch in enumerate(s):\n        # ch is already inside the stretch (a copy before left is out of it),\n        # so the stretch must now start just after that copy\n        if ch in last and last[ch] >= left:\n            left = last[ch] + 1\n        last[ch] = right\n        best = max(best, right - left + 1)  # the stretch is s[left..right]\n    return best",
     "c": "O(n) time: each character is visited once. O(k) space for the dictionary, k being the number of distinct characters.",
     "st": {
      "p": "Given a string `s`, return the length of the longest substring that has no repeated character.\n\nA substring is a contiguous stretch of `s`. An empty string returns 0.",
      "ex": [
       {
        "i": "s = \"abcabcbb\"",
        "o": "3",
        "why": "\"abc\" is the longest stretch with no repeated character"
       },
       {
        "i": "s = \"\"",
        "o": "0",
        "why": "an empty string has no substring to measure"
       }
      ],
      "k": [
       "0 <= len(s) <= 5*10^4",
       "s consists of printable characters",
       "returns 0 for an empty string"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "From every start, extend until a character repeats. Each new start rebuilds work the last one already did. When a repeat shows up, how far does the start really have to move?",
      "code": "def length_of_longest_substring(s):\n    best = 0\n    # Try every start, and extend the end until a character repeats\n    for start in range(len(s)):\n        seen = set()  # characters in s[start..end]\n        for end in range(start, len(s)):\n            if s[end] in seen:\n                break  # a repeat: no longer substring begins at this start\n            seen.add(s[end])\n            best = max(best, end - start + 1)\n    return best"
     }
    },
    {
     "n": "Maximum sum of a window of size k",
     "ex": {
      "i": "[1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4",
      "o": "39",
      "w": "4 + 2 + 10 + 23"
     },
     "l": "easy",
     "task": "Largest sum of any k consecutive numbers.",
     "hint": "Two neighbouring groups of k numbers share k - 1 of them. How does the sum change when the group moves one step?",
     "sol": "def max_window_sum(nums, k):\n    cur = sum(nums[:k])  # sum of the first k numbers\n    best = cur  # largest sum seen so far\n    for i in range(k, len(nums)):\n        # Move one step: nums[i] enters on the right, nums[i - k] leaves on the left\n        cur += nums[i] - nums[i - k]\n        best = max(best, cur)\n    return best",
     "c": "O(n) time: each step adds one number and removes one. O(1) space.",
     "st": {
      "p": "Given a list of integers `nums` and an integer `k`, return the largest sum of any `k` consecutive elements.\n\n`k` never exceeds the length of `nums`.",
      "ex": [
       {
        "i": "nums = [1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4",
        "o": "39",
        "why": "4, 2, 10 and 23 add up to 39, the highest of any four in a row"
       },
       {
        "i": "nums = [1, 2, 3], k = 3",
        "o": "6",
        "why": "with k equal to the full length, the only window is the whole array"
       }
      ],
      "k": [
       "1 <= k <= len(nums) <= 10^5",
       "-10^4 <= nums[i] <= 10^4"
      ]
     }
    }
   ],
   "g": "core"
  },
  {
   "id": "stack",
   "title": "Stack",
   "group": "Core",
   "ex": {
    "i": "[73, 74, 75, 71, 69, 72, 76, 73]",
    "o": "[1, 1, 4, 2, 1, 1, 0, 0]",
    "w": "days until a warmer day"
   },
   "sheet": {
    "spot": "Brackets; next greater or warmer; undo; expressions.",
    "move": "Pop while the top is answered by the current item.",
    "code": "st = []\nfor i, x in enumerate(a):\n    while st and a[st[-1]] < x:\n        j = st.pop(); ans[j] = i - j\n    st.append(i)",
    "notes": [
     "Store indices, not values.",
     "Each item pushed and popped once: O(n)."
    ]
   },
   "vars": [
    {
     "n": "Next greater element",
     "ex": {
      "i": "[2, 1, 2, 4, 3]",
      "o": "[4, 2, 4, -1, -1]",
      "w": "the next bigger value, or -1"
     },
     "t": "This is the daily temperatures idea, but you store the greater value itself instead of the distance. What do you write when a waiting index is settled?",
     "code": "def next_greater(nums):\n    out = [-1] * len(nums)  # stays -1 if nothing greater ever appears\n    waiting = []  # indices whose next greater value has not appeared yet\n    for i, x in enumerate(nums):\n        # x is the next greater value for every smaller waiting value\n        while waiting and nums[waiting[-1]] < x:\n            j = waiting.pop()\n            out[j] = x  # store the value itself, not the distance\n        waiting.append(i)\n    return out",
     "st": {
      "p": "Given a list `nums` of integers, return a list of the same length where each position holds the next value to its right that is strictly greater than it, or -1 if there is none.",
      "ex": [
       {
        "i": "nums = [2, 1, 2, 4, 3]",
        "o": "[4, 2, 4, -1, -1]",
        "why": "for example, the 2 at index 0 is followed by a 4, which is its next greater value"
       },
       {
        "i": "nums = [5, 4, 3]",
        "o": "[-1, -1, -1]",
        "why": "the values only decrease, so none has a greater value to its right"
       }
      ],
      "k": [
       "1 <= len(nums) <= 10^5",
       "-10^9 <= nums[i] <= 10^9",
       "-1 marks no greater value to the right",
       "Aim for O(n) time"
      ]
     }
    },
    {
     "n": "Min stack",
     "ex": {
      "i": "push 3, push 1, pop, get_min",
      "o": "3",
      "w": "min in O(1) after any pop"
     },
     "t": "When you push x, what is the smallest value in the stack at that moment? That answer stays true until x is popped, so where could you keep it?",
     "code": "class MinStack:\n    def __init__(self):\n        # Each entry is (value, smallest value in the stack up to and including it)\n        self.items = []\n\n    def push(self, x):\n        if len(self.items) == 0:\n            smallest = x  # the first value is the minimum so far\n        else:\n            smallest = self.items[-1][1]  # the minimum before this push\n            if x < smallest:\n                smallest = x\n        self.items.append((x, smallest))\n\n    def pop(self):\n        # The minimum stored under it goes away with it\n        self.items.pop()\n\n    def get_min(self):\n        # The top entry always knows the minimum of the whole stack\n        return self.items[-1][1]",
     "st": {
      "p": "Design a stack that supports pushing, popping and reading the minimum value, all in O(1) time.\n\nImplement the class `MinStack` with `push(x)`, which pushes a value; `pop()`, which removes the most recently pushed value; and `get_min()`, which returns the smallest value currently in the stack. `pop` and `get_min` are never called on an empty stack.",
      "ex": [
       {
        "i": "ops: push(5), push(3), push(7), get_min()",
        "o": "3",
        "why": "3 is the smallest of the three pushed values"
       },
       {
        "i": "ops: push(2), push(2), pop(), get_min()",
        "o": "2",
        "why": "after removing one of the two 2s, the other 2 is still in the stack and is the smallest"
       }
      ],
      "k": [
       "at most 3*10^4 total calls",
       "-10^5 <= x <= 10^5",
       "get_min and pop are never called on an empty stack",
       "every method runs in O(1) time"
      ]
     }
    },
    {
     "n": "Evaluate reverse Polish notation",
     "ex": {
      "i": "[\"2\", \"1\", \"+\", \"3\", \"*\"]",
      "o": "9",
      "w": "(2 + 1) * 3"
     },
     "t": "Numbers wait until an operator needs them. Which two waiting numbers does an operator take, and does the order matter for - and /?",
     "code": "def eval_rpn(tokens):\n    values = []  # numbers that are waiting for an operator\n    for tok in tokens:\n        if tok in (\"+\", \"-\", \"*\", \"/\"):\n            # The right operand was pushed last, so it comes off first\n            b = values.pop()\n            a = values.pop()\n            if tok == \"+\":\n                r = a + b\n            elif tok == \"-\":\n                r = a - b\n            elif tok == \"*\":\n                r = a * b\n            else:\n                # Divide the sizes, then restore the sign: this truncates toward zero\n                r = abs(a) // abs(b)\n                if (a < 0) != (b < 0):\n                    r = -r\n            values.append(r)  # the result waits for the next operator\n        else:\n            values.append(int(tok))\n    return values[0]  # one value is left: the whole expression",
     "st": {
      "p": "Given a list of string `tokens` holding an arithmetic expression in reverse Polish notation, return its integer value.\n\nEach token is an integer or one of the operators `+`, `-`, `*`, `/`. An operator applies to the two values that came right before it. Division truncates toward zero rather than rounding down.",
      "ex": [
       {
        "i": "tokens = [\"2\", \"1\", \"+\", \"3\", \"*\"]",
        "o": "9",
        "why": "(2 + 1) * 3 = 9"
       },
       {
        "i": "tokens = [\"-7\", \"2\", \"/\"]",
        "o": "-3",
        "why": "-7 / 2 is -3.5, which truncates toward zero to -3, not floors to -4"
       }
      ],
      "k": [
       "1 <= len(tokens) <= 10^4",
       "each token is an integer literal or one of + - * /",
       "the expression is always valid and never divides by zero"
      ]
     }
    },
    {
     "n": "Largest rectangle in a histogram",
     "ex": {
      "i": "[2, 1, 5, 6, 2, 3]",
      "o": "10",
      "w": "bars 5 and 6, width 2"
     },
     "t": "A rectangle is as tall as its shortest bar. For each bar, how far can a rectangle of that bar's height stretch left and right, and what ends the stretch?",
     "code": "def largest_rectangle(h):\n    best = 0\n    # open: (leftmost index its height reaches, height), heights rising bottom to top\n    open_bars = []\n    # The extra 0 at the end is lower than every bar, so it closes all that remain\n    for i, x in enumerate(h + [0]):\n        start = i\n        # A lower bar x ends every taller rectangle that is still open\n        while open_bars and open_bars[-1][1] > x:\n            j, height = open_bars.pop()\n            # This rectangle ran from j to i - 1 at the given height\n            area = height * (i - j)\n            if area > best:\n                best = area\n            start = j  # x is at least this tall, so x reaches back to j\n        open_bars.append((start, x))\n    return best",
     "st": {
      "p": "Given a list `h` of non-negative integers, the heights of bars that stand side by side and are one unit wide, return the area of the largest rectangle that fits entirely inside the bars.",
      "ex": [
       {
        "i": "h = [2, 1, 5, 6, 2, 3]",
        "o": "10",
        "why": "bars 5 and 6 side by side give a rectangle of width 2 and height 5, area 10"
       },
       {
        "i": "h = [3, 3, 3]",
        "o": "9",
        "why": "all three bars have height 3, so the whole width of 3 times height 3 fits"
       }
      ],
      "k": [
       "1 <= len(h) <= 10^5",
       "0 <= h[i] <= 10^4",
       "bars are contiguous and one unit wide",
       "Aim for O(n) time"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "Try every left edge and extend to the right, keeping the lowest bar seen. It works, but it redoes the same stretches for every start. What if a bar's rectangle was settled the moment a lower bar arrives?",
      "code": "def largest_rectangle(h):\n    best = 0\n    for i in range(len(h)):\n        low = h[i]  # the lowest bar between i and j\n        for j in range(i, len(h)):\n            if h[j] < low:\n                low = h[j]\n            area = low * (j - i + 1)  # a rectangle from i to j, as tall as the lowest bar\n            if area > best:\n                best = area\n    return best"
     }
    }
   ],
   "spot": "Matching pairs, 'next greater element', undoing. <b>Signal:</b> brackets, or 'for each item, the next item that is larger'.",
   "cx": "O(n): each item is pushed and popped once.",
   "tpl": "stack = []\nfor i, x in enumerate(nums):\n    while stack and nums[stack[-1]] < x:\n        j = stack.pop()      # x is the next greater for j\n    stack.append(i)",
   "probs": [
    {
     "n": "Valid parentheses",
     "ex": {
      "i": "\"([]{})\" and \"(]\"",
      "o": "True, False",
      "w": "every closer matches the last opener"
     },
     "l": "easy",
     "task": "Are the brackets balanced and correctly nested?",
     "hint": "The bracket you meet in a closer has to pair with the latest opener still open. Where could you keep the openers so the latest one is the easiest to reach?",
     "sol": "def is_valid(s):\n    # Each closer maps to the opener it must match\n    pairs = {')': '(', ']': '[', '}': '{'}\n    stack = []  # openers seen so far that are still waiting to be closed\n    for ch in s:\n        if ch in pairs:\n            # A closer: the latest open bracket must be its partner\n            if len(stack) == 0:\n                return False  # nothing is open, so this closer has no partner\n            top = stack.pop()\n            if top != pairs[ch]:\n                return False  # wrong type, e.g. ( closed by ]\n        else:\n            stack.append(ch)  # an opener: wait for its closer\n    # Anything left over was opened and never closed\n    return len(stack) == 0",
     "c": "O(n) time: each character is pushed and popped at most once. O(n) space for the stack.",
     "st": {
      "p": "Given a string `s` made only of the characters `(`, `)`, `[`, `]`, `{` and `}`, return `True` if the brackets are balanced and correctly nested, and `False` otherwise.\n\nEvery closing bracket must match the type of the most recent opening bracket that is still unclosed, and every opening bracket must get closed. An empty string is valid.",
      "ex": [
       {
        "i": "s = \"()[]{}\"",
        "o": "True",
        "why": "each opener is immediately closed by the matching bracket type"
       },
       {
        "i": "s = \"(]\"",
        "o": "False",
        "why": "the opener ( is closed by ], which is the wrong bracket type"
       }
      ],
      "k": [
       "0 <= len(s) <= 10^4",
       "s contains only ( ) [ ] { } characters",
       "an empty string is valid"
      ]
     }
    },
    {
     "n": "Daily temperatures",
     "ex": {
      "i": "[73, 74, 75, 71, 69, 72, 76, 73]",
      "o": "[1, 1, 4, 2, 1, 1, 0, 0]",
      "w": "days until a warmer day"
     },
     "l": "medium",
     "task": "For each day, how many days until a warmer one?",
     "hint": "A day is still waiting until something warmer shows up. When a warm day arrives, which waiting days does it answer, and where would you keep the waiting ones?",
     "sol": "def daily_temperatures(t):\n    out = [0] * len(t)  # 0 stays if no warmer day ever comes\n    waiting = []  # indices of days still waiting for a warmer day\n    for i, x in enumerate(t):\n        # Day i is warmer than every waiting day colder than x\n        while waiting and t[waiting[-1]] < x:\n            j = waiting.pop()\n            out[j] = i - j  # day j waited from j until today\n        waiting.append(i)  # today now waits for its own warmer day\n    return out",
     "c": "O(n) time: every index is pushed once and popped at most once. O(n) space for the stack.",
     "st": {
      "p": "Given a list `t` of daily temperatures, return a list `answer` of the same length where `answer[i]` is the number of days you have to wait after day `i` to get a strictly warmer temperature.\n\nIf no warmer day ever comes, `answer[i]` is 0.",
      "ex": [
       {
        "i": "t = [73, 74, 75, 71, 69, 72, 76, 73]",
        "o": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "why": "for example, day 0 (73) waits 1 day for 74, and the last two days never see a warmer one"
       },
       {
        "i": "t = [80, 79, 78]",
        "o": "[0, 0, 0]",
        "why": "temperatures only fall, so no day ever gets a warmer one"
       }
      ],
      "k": [
       "1 <= len(t) <= 10^5",
       "30 <= t[i] <= 100",
       "Aim for O(n) time"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "For each day, scan ahead until a warmer one appears. It works, but a long cold stretch gets rescanned again and again. What if the days still waiting for an answer could be settled together when a warm day arrives?",
      "code": "def daily_temperatures(t):\n    out = [0] * len(t)\n    for i in range(len(t)):\n        # Look right from day i for the first warmer day\n        for j in range(i + 1, len(t)):\n            if t[j] > t[i]:\n                out[i] = j - i\n                break  # the first warmer day is the answer\n    return out"
     }
    }
   ],
   "g": "core"
  },
  {
   "id": "binary",
   "title": "Binary search",
   "group": "Core",
   "ex": {
    "i": "[-1, 0, 3, 5, 9, 12], target = 9",
    "o": "4",
    "w": "each step halves the range"
   },
   "sheet": {
    "spot": "Sorted; rotated; smallest k such that a check passes.",
    "move": "Halve the range; keep one invariant.",
    "code": "lo, hi = 0, len(a) - 1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if a[mid] == t: return mid\n    if a[mid] < t: lo = mid + 1\n    else: hi = mid - 1",
    "notes": [
     "On the answer: lo, hi = min, max; test check(mid).",
     "bisect_left(a, x): first index with a[i] &ge; x.",
     "Rotated: one half is always sorted. O(log n)."
    ]
   },
   "vars": [
    {
     "n": "First and last position",
     "ex": {
      "i": "[5, 7, 7, 8, 8, 10], target = 8",
      "o": "[3, 4]",
      "w": "the range of 8s"
     },
     "t": "Finding any 8 is not enough. How would you find the first index holding a value that is 8 or more? The last 8 sits right before the first value of 9 or more.",
     "code": "def search_range(nums, t):\n    # lower(x): the first index whose value is >= x (len(nums) if there is none)\n    def lower(x):\n        lo, hi = 0, len(nums)\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if nums[mid] >= x:\n                hi = mid  # mid might be the first one, so keep it\n            else:\n                lo = mid + 1  # mid is too small, drop it\n        return lo\n\n    first = lower(t)\n    if first == len(nums) or nums[first] != t:\n        return [-1, -1]  # t is not in the list\n    # Values are integers, so the first index of t + 1 comes right after the last t\n    last = lower(t + 1) - 1\n    return [first, last]",
     "st": {
      "p": "Given a list `nums` sorted in non-decreasing order, which may contain duplicates, and a value `t`, return `[first, last]`, the first and last index where `t` occurs, or `[-1, -1]` if `t` does not appear.\n\nAim for O(log n) time.",
      "ex": [
       {
        "i": "nums = [5, 7, 7, 8, 8, 10], target = 8",
        "o": "[3, 4]",
        "why": "8 first appears at index 3 and last appears at index 4"
       },
       {
        "i": "nums = [5, 7, 7, 8, 8, 10], target = 6",
        "o": "[-1, -1]",
        "why": "6 does not appear in the list"
       }
      ],
      "k": [
       "0 <= len(nums) <= 10^5",
       "nums is sorted in non-decreasing order and may contain duplicates",
       "-10^9 <= nums[i], t <= 10^9",
       "Aim for O(log n) time"
      ]
     },
     "first": {
      "label": "First idea, O(n)",
      "note": "Scan the whole list and note where t first and last appears. It works, but it ignores that the list is sorted. Where could you look to find the start of the run of t without walking to it?",
      "code": "def search_range(nums, t):\n    first, last = -1, -1\n    for i in range(len(nums)):\n        if nums[i] == t:\n            if first == -1:\n                first = i  # the first time we meet t\n            last = i  # keeps moving right while t keeps appearing\n    return [first, last]"
     },
     "alt": {
      "note": "Same idea with the library: `bisect_left` is `lower(t)` and `bisect_right` is `lower(t + 1)`.",
      "code": "from bisect import bisect_left, bisect_right\n\ndef search_range(nums, t):\n    first = bisect_left(nums, t)\n    if first == len(nums) or nums[first] != t:\n        return [-1, -1]\n    return [first, bisect_right(nums, t) - 1]"
     }
    },
    {
     "n": "Minimum of a rotated array",
     "ex": {
      "i": "[3, 4, 5, 1, 2]",
      "o": "1",
      "w": "where the rotation starts"
     },
     "t": "Compare the middle value with the last one. If the middle is bigger, where must the drop in the list be, and what if it is smaller?",
     "code": "def find_min(nums):\n    lo, hi = 0, len(nums) - 1  # the minimum is somewhere in nums[lo..hi]\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] > nums[hi]:\n            # mid is bigger than the end, so the drop is to the right of mid\n            lo = mid + 1\n        else:\n            # mid is smaller than the end, so mid could be the minimum itself\n            hi = mid\n    return nums[lo]  # the range has shrunk to one index",
     "st": {
      "p": "Given a list `nums` of unique integers that was sorted ascending and then rotated at an unknown pivot, return the smallest value in the list.\n\nAim for O(log n) time.",
      "ex": [
       {
        "i": "nums = [3, 4, 5, 1, 2]",
        "o": "1",
        "why": "1 is the smallest value, where the rotation wraps back around"
       },
       {
        "i": "nums = [1, 2, 3, 4, 5]",
        "o": "1",
        "why": "the list is not actually rotated, so the smallest value is the first one"
       }
      ],
      "k": [
       "1 <= len(nums) <= 5000",
       "all values in nums are unique",
       "Aim for O(log n) time"
      ]
     }
    },
    {
     "n": "Binary search on the answer",
     "ex": {
      "i": "piles = [3, 6, 7, 11], h = 8",
      "o": "4",
      "w": "slowest eating speed that finishes in 8 hours"
     },
     "t": "Speeds are ordered: if a speed finishes in time, every faster speed does too. Can you test one speed quickly, and use that test to cut the range of speeds in half?",
     "code": "def min_eating_speed(piles, h):\n    # hours_needed(k): total hours to finish every pile at speed k\n    def hours_needed(k):\n        total = 0\n        for p in piles:\n            total += (p + k - 1) // k  # ceil(p / k) using whole numbers\n        return total\n\n    # The answer is between 1 and the biggest pile (that speed does one pile per hour)\n    lo, hi = 1, max(piles)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if hours_needed(mid) <= h:\n            hi = mid  # fast enough, but a slower speed might work too\n        else:\n            lo = mid + 1  # too slow, and so is everything below mid\n    return lo",
     "st": {
      "p": "Given a list `piles` of banana pile sizes and an integer `h`, return the smallest whole eating speed `k`, in bananas per hour, that lets you finish every pile within `h` hours.\n\nAt speed `k`, a pile of `p` bananas takes `ceil(p / k)` hours, because a partly eaten pile still uses up the whole hour. Piles are eaten one at a time.",
      "ex": [
       {
        "i": "piles = [3, 6, 7, 11], h = 8",
        "o": "4",
        "why": "at speed 4, the piles take ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours, exactly the limit, and speed 3 would take longer"
       },
       {
        "i": "piles = [30, 11, 23, 4, 20], h = 5",
        "o": "30",
        "why": "there is only one hour per pile on average, so the speed must cover the largest pile, 30, in a single hour"
       }
      ],
      "k": [
       "1 <= len(piles) <= 10^4",
       "1 <= piles[i] <= 10^9",
       "len(piles) <= h <= 10^9",
       "Aim for O(n log(max(piles))) time"
      ]
     },
     "first": {
      "label": "First idea, O(n * max(piles))",
      "note": "Try speed 1, 2, 3, and so on until one finishes in time. It is correct, but piles can be 10^9, so that is far too many tries. Speeds are ordered, so can one test rule out half of them at once?",
      "code": "def min_eating_speed(piles, h):\n    # Try every speed from slowest to fastest; the first that fits is the smallest\n    for k in range(1, max(piles) + 1):\n        total = 0\n        for p in piles:\n            total += (p + k - 1) // k  # ceil(p / k) using whole numbers\n        if total <= h:\n            return k\n    return max(piles)  # never reached: the biggest pile as the speed always fits"
     }
    }
   ],
   "spot": "Sorted data, or a yes/no condition that flips once. <b>Signal:</b> 'find the first' or 'minimum x such that...'.",
   "cx": "O(log n).",
   "tpl": "lo, hi = 0, len(a)            # search in [lo, hi)\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    if condition(a[mid]):      # True from some point on\n        hi = mid\n    else:\n        lo = mid + 1\nreturn lo                      # first index where condition holds",
   "probs": [
    {
     "n": "Search in a sorted array",
     "ex": {
      "i": "[-1, 0, 3, 5, 9, 12], target = 9",
      "o": "4",
      "w": "halve the range each step"
     },
     "l": "easy",
     "task": "Index of target, or -1.",
     "hint": "Look at the middle value. If it is too small, which half can you throw away, and what if it is too big?",
     "sol": "def search(nums, target):\n    lo, hi = 0, len(nums) - 1  # target can only be in nums[lo..hi]\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1  # mid and everything left of it are too small\n        else:\n            hi = mid - 1  # mid and everything right of it are too big\n    return -1  # the range emptied without finding target",
     "c": "O(log n) time: each step halves the range. O(1) space.",
     "st": {
      "p": "Given a list `nums` of distinct integers sorted in ascending order and an integer `target`, return the index of `target` in the list, or -1 if it is not there.\n\nAim for O(log n) time.",
      "ex": [
       {
        "i": "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        "o": "4",
        "why": "9 sits at index 4"
       },
       {
        "i": "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        "o": "-1",
        "why": "2 does not appear in the list"
       }
      ],
      "k": [
       "1 <= len(nums) <= 10^4",
       "nums is sorted ascending with all distinct values",
       "-10^4 <= nums[i], target <= 10^4",
       "Aim for O(log n) time"
      ]
     },
     "alt": {
      "note": "Same search with the library: `bisect_left` finds where target would go, then we check that it is really there.",
      "code": "from bisect import bisect_left\n\ndef search(nums, target):\n    i = bisect_left(nums, target)\n    if i < len(nums) and nums[i] == target:\n        return i\n    return -1"
     }
    },
    {
     "n": "Search in a rotated sorted array",
     "ex": {
      "i": "[4, 5, 6, 7, 0, 1, 2], target = 0",
      "o": "4",
      "w": "one half is always sorted"
     },
     "l": "medium",
     "task": "Find target in a sorted array that was rotated.",
     "hint": "Cut the list at the middle. Is at least one of the two halves still in plain sorted order, and how can you tell whether the target lies inside it?",
     "sol": "def search_rotated(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[lo] <= nums[mid]:\n            # The left half is in order, so we can test the target against its ends\n            if nums[lo] <= target < nums[mid]:\n                hi = mid - 1  # target is inside the ordered left half\n            else:\n                lo = mid + 1  # it must be in the other half\n        else:\n            # The right half is in order\n            if nums[mid] < target <= nums[hi]:\n                lo = mid + 1  # target is inside the ordered right half\n            else:\n                hi = mid - 1\n    return -1",
     "c": "O(log n) time: each step discards half of the range. O(1) space.",
     "st": {
      "p": "Given a list `nums` of distinct integers that was sorted ascending and then rotated at an unknown pivot, and an integer `target`, return the index of `target`, or -1 if it is not there.\n\nAim for O(log n) time.",
      "ex": [
       {
        "i": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
        "o": "4",
        "why": "0 sits at index 4 after the rotation"
       },
       {
        "i": "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
        "o": "-1",
        "why": "3 does not appear anywhere in the rotated list"
       }
      ],
      "k": [
       "1 <= len(nums) <= 5000",
       "all values in nums are unique",
       "the list was sorted ascending, then rotated at an unknown pivot",
       "Aim for O(log n) time"
      ]
     }
    }
   ],
   "g": "core"
  },
  {
   "id": "linked",
   "title": "Linked lists",
   "group": "Structures",
   "ex": {
    "i": "1 -> 2 -> 3 -> None",
    "o": "3 -> 2 -> 1 -> None",
    "w": "turn the pointers one node at a time"
   },
   "sheet": {
    "spot": "Reverse, cycle, middle, merge, kth from the end.",
    "move": "Dummy head; prev and cur; slow and fast.",
    "code": "prev, cur = None, head\nwhile cur:\n    nxt = cur.next\n    cur.next = prev\n    prev, cur = cur, nxt\nreturn prev",
    "notes": [
     "Cycle: fast two steps, slow one; they meet.",
     "Kth from end: fast starts k ahead. O(n), O(1)."
    ]
   },
   "vars": [
    {
     "n": "Middle of the list",
     "ex": {
      "i": "1 -> 2 -> 3 -> 4 -> 5",
      "o": "3",
      "w": "slow is halfway when fast ends"
     },
     "t": "Move one pointer one step and another two steps at a time. Where is the slow one when the fast one runs out?",
     "code": "def middle(head):\n    # Both pointers start at the head\n    slow = fast = head\n    # fast moves two steps for every one step of slow,\n    # so when fast reaches the end, slow is halfway\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    # Even length: fast stops on None, which leaves slow on the second middle\n    return slow",
     "st": {
      "p": "Given the `head` of a singly linked list, return its middle node.\n\nIf the list has an even number of nodes, it has two middle nodes: return the second one.",
      "ex": [
       {
        "i": "head = [1, 2, 3, 4, 5]",
        "o": "3",
        "why": "five nodes, so the third one is the middle"
       },
       {
        "i": "head = [1, 2, 3, 4, 5, 6]",
        "o": "4",
        "why": "six nodes: the two middles are 3 and 4, and the second is returned"
       }
      ],
      "k": [
       "1 <= number of nodes <= 100",
       "Aim for O(n) time and O(1) extra space"
      ]
     }
    },
    {
     "n": "Remove the nth node from the end",
     "ex": {
      "i": "1 -> 2 -> 3 -> 4 -> 5, n = 2",
      "o": "1 -> 2 -> 3 -> 5",
      "w": "4 is gone"
     },
     "t": "If one pointer is exactly n nodes ahead of another, where is the second one when the first falls off the end? Which node do you need to stand on to cut the target out?",
     "code": "def remove_nth_from_end(head, n):\n    # A placeholder before head, so removing the first node needs no special case\n    dummy = ListNode(0, head)\n    fast = dummy\n    slow = dummy\n    # Put fast n + 1 nodes ahead of slow\n    for _ in range(n + 1):\n        fast = fast.next\n    # Move both until fast falls off the end; the gap between them stays n + 1\n    while fast:\n        fast = fast.next\n        slow = slow.next\n    # slow now stands just before the nth node from the end: skip over that node\n    slow.next = slow.next.next\n    return dummy.next",
     "st": {
      "p": "Given the `head` of a linked list and an integer `n`, remove the nth node counting from the end of the list, and return the head of the result.\n\nThe list may have only one node, and removing the first node must work too.",
      "ex": [
       {
        "i": "head = [1, 2, 3, 4, 5], n = 2",
        "o": "[1, 2, 3, 5]",
        "why": "the second node from the end, 4, is removed"
       },
       {
        "i": "head = [1], n = 1",
        "o": "[]",
        "why": "removing the only node leaves an empty list"
       }
      ],
      "k": [
       "`n` is always within the length of the list",
       "Aim for O(n) time in a single walk",
       "Aim for O(1) extra space"
      ]
     }
    },
    {
     "n": "Where the cycle starts",
     "ex": {
      "i": "3 -> 2 -> 0 -> -4 -> back to 2",
      "o": "the node 2",
      "w": "the entry point"
     },
     "t": "First find a node inside the loop with a fast and a slow runner. Then restart one of them at the head and move both one step at a time: where do they meet?",
     "code": "def cycle_start(head):\n    slow = head\n    fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            # They met inside the loop. The distance from the head to the loop\n            # start equals the distance from here to the start (going around),\n            # so two walkers one step apart in speed meet exactly at the start\n            slow = head\n            while slow is not fast:\n                slow = slow.next\n                fast = fast.next\n            return slow\n    return None  # fast reached the end, so there is no loop",
     "st": {
      "p": "Given the `head` of a linked list, return the node where a cycle begins, or `None` if the list has no cycle.",
      "ex": [
       {
        "i": "head = [3, 2, 0, -4], with the tail's `next` pointed back at the node holding 2",
        "o": "the node holding 2",
        "why": "that node is where the loop begins"
       },
       {
        "i": "head = [1, 2, 3]",
        "o": "None",
        "why": "the list ends at None, so it has no cycle"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "Aim for O(1) extra space"
      ]
     }
    }
   ],
   "spot": "Reversal, cycles, merging. <b>Signal:</b> a ListNode class, 'in place'.",
   "cx": "O(n) time, O(1) space with pointers.",
   "tpl": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val, self.next = val, next\n\nslow = fast = head\nwhile fast and fast.next:\n    slow, fast = slow.next, fast.next.next",
   "probs": [
    {
     "n": "Reverse a linked list",
     "ex": {
      "i": "1 -> 2 -> 3",
      "o": "3 -> 2 -> 1",
      "w": "turn each pointer around"
     },
     "l": "easy",
     "task": "Reverse it in place.",
     "hint": "Each node must end up pointing at the node that used to be before it. As you walk the list, what do you need to remember so you do not lose the rest?",
     "sol": "def reverse(head):\n    prev = None  # the part already reversed; it starts empty\n    cur = head  # the next node to turn around\n    while cur:\n        nxt = cur.next  # save the rest of the list before we cut the link\n        cur.next = prev  # turn this node back to point at the reversed part\n        prev = cur  # the reversed part now starts at cur\n        cur = nxt  # move on to the saved rest\n    return prev  # prev is the old last node, the new head",
     "c": "O(n) time: each node is visited once. O(1) space: only a few references.",
     "st": {
      "p": "Given the `head` of a singly linked list, reverse the list and return the new head.\n\nAn empty list (`head` is `None`) returns `None`.",
      "ex": [
       {
        "i": "head = [1, 2, 3, 4, 5]",
        "o": "[5, 4, 3, 2, 1]",
        "why": "the same nodes, now in the opposite order"
       },
       {
        "i": "head = []",
        "o": "[]",
        "why": "an empty list stays empty, there is nothing to reverse"
       }
      ],
      "k": [
       "0 <= number of nodes <= 5000",
       "Aim for O(n) time and O(1) extra space"
      ]
     }
    },
    {
     "n": "Detect a cycle",
     "ex": {
      "i": "1 -> 2 -> 3 -> back to 2",
      "o": "True",
      "w": "fast catches slow inside the loop"
     },
     "l": "easy",
     "task": "Does the list loop?",
     "hint": "Picture two runners on a track where one runs twice as fast. What happens if the track is a loop, and what if it has an end?",
     "sol": "def has_cycle(head):\n    slow = head  # moves one node per step\n    fast = head  # moves two nodes per step\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        # Inside a loop the faster one gains a node each step, so it must meet slow\n        if slow is fast:\n            return True\n    return False  # fast reached the end of the list, so there is no loop",
     "c": "O(n) time: fast either hits the end or meets slow within a few laps. O(1) space.",
     "st": {
      "p": "Given the `head` of a linked list, return `True` if the list has a cycle, meaning some node's `next` points back to an earlier node, and `False` if the list ends at `None`.",
      "ex": [
       {
        "i": "head = [1, 2, 3]",
        "o": "False",
        "why": "the list ends cleanly at None"
       },
       {
        "i": "head = [1, 2, 3], with the tail's `next` pointed back at the node holding 2",
        "o": "True",
        "why": "the tail points back to the node holding 2, so the list loops forever"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "Aim for O(1) extra space"
      ]
     }
    },
    {
     "n": "Merge two sorted lists",
     "ex": {
      "i": "1 -> 2 -> 4 and 1 -> 3 -> 4",
      "o": "1 -> 1 -> 2 -> 3 -> 4 -> 4",
      "w": "take the smaller head each time"
     },
     "l": "easy",
     "task": "Merge into one sorted list.",
     "hint": "At every step the next node of the merged list is the smaller of the two heads. How could a placeholder node at the front save you from special-casing the first node?",
     "sol": "def merge_two(a, b):\n    head = ListNode()  # a placeholder in front, so the first real node is not special\n    tail = head  # the last node of the merged list so far\n    while a and b:\n        # Take the smaller front node; on a tie take a's\n        if a.val <= b.val:\n            tail.next = a\n            a = a.next\n        else:\n            tail.next = b\n            b = b.next\n        tail = tail.next\n    # One list ran out; what is left of the other is already sorted\n    if a:\n        tail.next = a\n    else:\n        tail.next = b\n    return head.next  # skip the placeholder",
     "c": "O(n + m) time: each node is attached once. O(1) space: nodes are reused.",
     "st": {
      "p": "Given the heads `a` and `b` of two sorted singly linked lists, merge them into one sorted list by joining their existing nodes, and return its head.\n\nWhen two values are equal, the node from `a` comes first. Either list can be empty.",
      "ex": [
       {
        "i": "a = [1, 2, 4], b = [1, 3, 4]",
        "o": "[1, 1, 2, 3, 4, 4]",
        "why": "the two 1s are equal, so the node from a comes first"
       },
       {
        "i": "a = [], b = [0]",
        "o": "[0]",
        "why": "an empty list leaves the other list as it is"
       }
      ],
      "k": [
       "Aim for O(n + m) time for lists of length n and m",
       "Aim for O(1) extra space beyond the merged nodes"
      ]
     }
    }
   ],
   "g": "structures"
  },
  {
   "id": "trees",
   "title": "Trees",
   "group": "Structures",
   "ex": {
    "i": "tree [3, 9, 20, null, null, 15, 7]",
    "o": "3",
    "w": "max depth: 3 -> 20 -> 15"
   },
   "sheet": {
    "spot": "Depth, paths, validate a BST, LCA, level order.",
    "move": "Recurse and return info up; BFS for levels.",
    "code": "def depth(n):\n    if not n: return 0\n    return 1 + max(depth(n.left), depth(n.right))",
    "notes": [
     "BST: pass (lo, hi) bounds down; in-order is sorted.",
     "Levels: for _ in range(len(q)).",
     "O(n) time, O(h) stack."
    ]
   },
   "vars": [
    {
     "n": "Invert a tree",
     "ex": {
      "i": "[4, 2, 7]",
      "o": "[4, 7, 2]",
      "w": "mirror every level"
     },
     "t": "If you could invert each child's subtree, what would you do with the two results to finish this node?",
     "code": "def invert(n):\n    if not n:\n        return None  # nothing to swap in an empty tree\n    # Invert both subtrees first\n    left = invert(n.left)\n    right = invert(n.right)\n    # Then put them back in swapped places\n    n.left = right\n    n.right = left\n    return n",
     "st": {
      "p": "Given the `root` of a binary tree, invert it by swapping the left and right children of every node, and return its root.\n\nAn empty tree returns `None`.",
      "ex": [
       {
        "i": "root = [4, 2, 7, 1, 3, 6, 9]",
        "o": "[4, 7, 2, 9, 6, 3, 1]",
        "why": "every left and right pair is mirrored, at every level"
       },
       {
        "i": "root = []",
        "o": "[]",
        "why": "there is nothing to swap"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "O(h) extra space for a tree of height h"
      ]
     }
    },
    {
     "n": "Lowest common ancestor in a BST",
     "ex": {
      "i": "BST [6, 2, 8, 0, 4, 7, 9], p = 2, q = 8",
      "o": "6",
      "w": "the split point"
     },
     "t": "In a search tree, the values tell you which way to go. When do `p` and `q` stay together on the same side, and what does it mean when they do not?",
     "code": "def lca_bst(root, p, q):\n    node = root\n    while node:\n        if p < node.val and q < node.val:\n            node = node.left  # both values are smaller, so both are on the left\n        elif p > node.val and q > node.val:\n            node = node.right  # both are larger, so both are on the right\n        else:\n            # They split here (or one of them is this node): nothing lower holds both\n            return node\n    return None  # never reached: p and q exist in the tree",
     "st": {
      "p": "Given the `root` of a binary search tree and two values `p` and `q` that both exist in it, return the lowest node that has both values in its subtree.\n\nA node counts as part of its own subtree, so if one value sits under the other, the upper one is the answer.",
      "ex": [
       {
        "i": "root = [6, 2, 8, 0, 4, 7, 9], p = 2, q = 8",
        "o": "the node holding 6",
        "why": "2 and 8 are on opposite sides of 6, and 6 is the lowest node above both"
       },
       {
        "i": "root = [6, 2, 8, 0, 4, 7, 9], p = 2, q = 4",
        "o": "the node holding 2",
        "why": "4 is in the subtree of 2, and a node counts as its own ancestor"
       }
      ],
      "k": [
       "`p` and `q` both exist in the tree",
       "Aim for O(h) time for a tree of height h",
       "Aim for O(1) extra space"
      ]
     },
     "first": {
      "label": "First idea, O(h) time and space",
      "note": "Write down the path from the root to p and the path to q, then take the last node the two paths share. It works, but it stores two paths and walks each one twice. The paths are the same until the split, so can you spot the split while walking down once?",
      "code": "def lca_bst(root, p, q):\n    # path_to(v): the nodes from the root down to the node holding v\n    def path_to(v):\n        path = []\n        node = root\n        while node:\n            path.append(node)\n            if v == node.val:\n                break\n            if v < node.val:\n                node = node.left\n            else:\n                node = node.right\n        return path\n\n    path_p = path_to(p)\n    path_q = path_to(q)\n    # The paths share a prefix; the last shared node is the answer\n    answer = root\n    for a, b in zip(path_p, path_q):\n        if a is b:\n            answer = a\n        else:\n            break\n    return answer"
     }
    },
    {
     "n": "Diameter",
     "ex": {
      "i": "[1, 2, 3, 4, 5]",
      "o": "3",
      "w": "4 -> 2 -> 1 -> 3, three edges"
     },
     "t": "The longest path that bends at a node goes down its left side and down its right side. If every node reported its height, how would you get that length at each node?",
     "code": "def diameter(root):\n    best = 0  # the longest path seen so far, in edges\n\n    # height(n): the number of nodes on the longest path from n down to a leaf\n    def height(n):\n        nonlocal best\n        if not n:\n            return 0\n        left = height(n.left)\n        right = height(n.right)\n        # The longest path bending at n uses the deepest left and the deepest right\n        if left + right > best:\n            best = left + right\n        return 1 + max(left, right)  # n's own height, passed up to its parent\n\n    height(root)\n    return best",
     "st": {
      "p": "Given the `root` of a binary tree, return its diameter: the number of edges on the longest path between any two nodes.\n\nThe path may or may not pass through the root. A tree with one node, or none, has diameter 0.",
      "ex": [
       {
        "i": "root = [1, 2, 3, 4, 5]",
        "o": "3",
        "why": "the path 4 -> 2 -> 1 -> 3 crosses three edges"
       },
       {
        "i": "root = [1]",
        "o": "0",
        "why": "one node has no path to measure"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "O(h) extra space for a tree of height h"
      ]
     }
    },
    {
     "n": "Right side view",
     "ex": {
      "i": "[1, 2, 3, null, 5, null, 4]",
      "o": "[1, 3, 4]",
      "w": "the last node of each level"
     },
     "t": "Which node on a level hides all the others from the right? How do you know you are at the last node of a level?",
     "code": "from collections import deque  # deque: a queue with O(1) pops from the front\n\ndef right_view(root):\n    out = []\n    queue = deque()\n    if root:\n        queue.append(root)\n    while queue:\n        # The queue holds one level in left-to-right order, so its last node is seen\n        out.append(queue[-1].val)\n        # Visit the whole level, queueing the children for the next one\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n    return out",
     "st": {
      "p": "Given the `root` of a binary tree, return the values you would see standing on its right side and looking at it, from top to bottom.\n\nThat is the rightmost node of each level. An empty tree returns an empty list.",
      "ex": [
       {
        "i": "root = [1, 2, 3, None, 5, None, 4]",
        "o": "[1, 3, 4]",
        "why": "node 5 is hidden behind 3 on its level"
       },
       {
        "i": "root = [1, 2, 3]",
        "o": "[1, 3]",
        "why": "on a full level, the rightmost node is the one you see"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "O(n) space for the queue and the output"
      ]
     }
    }
   ],
   "spot": "Hierarchies, BSTs, depth, paths. <b>Signal:</b> a TreeNode class.",
   "cx": "O(n) to visit every node; recursion depth O(h).",
   "tpl": "def dfs(node):\n    if not node:\n        return base_value\n    left, right = dfs(node.left), dfs(node.right)\n    return combine(node, left, right)\n\nfrom collections import deque\nq = deque([root])\nwhile q:\n    for _ in range(len(q)):        # one level at a time\n        node = q.popleft()\n        q.extend(c for c in (node.left, node.right) if c)",
   "probs": [
    {
     "n": "Maximum depth",
     "ex": {
      "i": "tree [3, 9, 20, null, null, 15, 7]",
      "o": "3",
      "w": "3 -> 20 -> 15"
     },
     "l": "easy",
     "task": "Depth of a binary tree.",
     "hint": "How deep is a tree in terms of how deep its two subtrees are?",
     "sol": "def max_depth(node):\n    if not node:\n        return 0  # an empty tree has depth 0\n    # The deeper side decides the depth; add 1 for this node itself\n    left = max_depth(node.left)\n    right = max_depth(node.right)\n    if left > right:\n        return 1 + left\n    return 1 + right",
     "c": "O(n) time: every node is visited once. O(h) space for the call stack, h being the height.",
     "st": {
      "p": "Given the `root` of a binary tree, return its maximum depth: the number of nodes on the longest path from the root down to a leaf.\n\nAn empty tree (`root` is `None`) has depth 0.",
      "ex": [
       {
        "i": "root = [3, 9, 20, None, None, 15, 7]",
        "o": "3",
        "why": "the path 3 -> 20 -> 15 has three nodes"
       },
       {
        "i": "root = []",
        "o": "0",
        "why": "an empty tree has no nodes to count"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "O(h) extra space for a tree of height h"
      ]
     }
    },
    {
     "n": "Level order traversal",
     "ex": {
      "i": "tree [3, 9, 20, null, null, 15, 7]",
      "o": "[[3], [9, 20], [15, 7]]",
      "w": "one list per level"
     },
     "l": "medium",
     "task": "Values level by level.",
     "hint": "You need to finish one level before touching the next. How can you know where one level ends in a line of waiting nodes?",
     "sol": "from collections import deque  # deque: a queue with O(1) pops from the front\n\ndef level_order(root):\n    if not root:\n        return []\n    out = []\n    queue = deque([root])  # nodes waiting to be visited, oldest first\n    while queue:\n        level = []\n        # Right now the queue holds exactly one level, so take that many nodes\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            # Their children join the back and form the next level\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        out.append(level)\n    return out",
     "c": "O(n) time: each node is queued and dequeued once. O(n) space for the queue and the output.",
     "st": {
      "p": "Given the `root` of a binary tree, return its values level by level, from left to right, as a list of lists with one inner list per level.\n\nAn empty tree returns an empty list.",
      "ex": [
       {
        "i": "root = [3, 9, 20, None, None, 15, 7]",
        "o": "[[3], [9, 20], [15, 7]]",
        "why": "three levels, read left to right"
       },
       {
        "i": "root = []",
        "o": "[]",
        "why": "no levels to report"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "O(n) space for the output"
      ]
     }
    },
    {
     "n": "Validate a BST",
     "ex": {
      "i": "[2, 1, 3] and [5, 1, 4, null, null, 3, 6]",
      "o": "True, False",
      "w": "3 sits right of 5 but is smaller"
     },
     "l": "medium",
     "task": "Is it a valid binary search tree?",
     "hint": "Comparing a node with its parent is not enough. What range of values is allowed at a node, and how does that range narrow as you go down?",
     "sol": "def is_bst(node, lo=float('-inf'), hi=float('inf')):\n    if not node:\n        return True  # an empty tree is fine\n    # The value must fall strictly inside the range set by all its ancestors\n    if not (lo < node.val < hi):\n        return False\n    # Going left, this value becomes the new upper limit; going right, the lower\n    left_ok = is_bst(node.left, lo, node.val)\n    right_ok = is_bst(node.right, node.val, hi)\n    return left_ok and right_ok",
     "c": "O(n) time: every node is checked once. O(h) space for the call stack.",
     "st": {
      "p": "Given the `root` of a binary tree, return `True` if it is a valid binary search tree, and `False` otherwise.\n\nIn a valid one, every node is larger than everything in its left subtree and smaller than everything in its right subtree, with no equal values. An empty tree is valid.",
      "ex": [
       {
        "i": "root = [2, 1, 3]",
        "o": "True",
        "why": "1 < 2 < 3 holds at every node"
       },
       {
        "i": "root = [5, 1, 4, None, None, 3, 6]",
        "o": "False",
        "why": "3 sits in the right subtree of 5, so it would have to be larger than 5, but it is smaller"
       }
      ],
      "k": [
       "Aim for O(n) time",
       "O(h) extra space for a tree of height h"
      ]
     }
    }
   ],
   "g": "structures"
  },
  {
   "id": "graphs",
   "title": "Graphs: BFS and DFS",
   "group": "Structures",
   "ex": {
    "i": "grid rows 11000, 11000, 00100, 00011 (lists of '1' and '0')",
    "o": "3",
    "w": "three separate pieces of land"
   },
   "sheet": {
    "spot": "Grids, islands, components, fewest steps.",
    "move": "BFS for fewest steps; mark seen when you push.",
    "code": "q, seen = deque([s]), {s}\nwhile q:\n    u = q.popleft()\n    for v in g[u]:\n        if v not in seen:\n            seen.add(v); q.append(v)",
    "notes": [
     "Grid: four directions and a bounds check.",
     "Build g with defaultdict(list). O(V + E)."
    ]
   },
   "vars": [
    {
     "n": "Rotting oranges (BFS from many sources)",
     "ex": {
      "i": "[[2, 1, 1], [1, 1, 0], [0, 1, 1]]",
      "o": "4",
      "w": "minutes until every orange is rotten"
     },
     "t": "All the rotten oranges spread at the same moment. What if they all start in the queue together, and each round of the queue is one minute?",
     "code": "from collections import deque\n\ndef oranges_rotting(grid):\n    rows, cols = len(grid), len(grid[0])\n    # deque: a queue with O(1) pops from the front\n    q = deque()  # rotten oranges whose neighbours we have not rotted yet\n    fresh = 0    # fresh oranges still waiting\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                q.append((r, c))\n            elif grid[r][c] == 1:\n                fresh += 1\n\n    minutes = 0\n    while q and fresh > 0:\n        # Everything in the queue right now rots its neighbours in the same minute\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2  # now rotten, and it will rot its own neighbours next minute\n                    fresh -= 1\n                    q.append((nr, nc))\n        minutes += 1\n\n    # Fresh oranges left over could not be reached from any rotten one\n    if fresh > 0:\n        return -1\n    return minutes",
     "st": {
      "p": "Given a grid `grid` where 0 is an empty cell, 1 is a fresh orange and 2 is a rotten orange, return the number of minutes until no fresh orange is left.\n\nEvery minute, each fresh orange that is up, down, left or right of a rotten orange becomes rotten. Return -1 if some fresh orange can never rot.",
      "ex": [
       {
        "i": "grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]",
        "o": "4",
        "why": "the farthest fresh orange, in the bottom-right corner, takes four minutes to rot"
       },
       {
        "i": "grid = [[0, 2]]",
        "o": "0",
        "why": "there is no fresh orange to wait on"
       }
      ],
      "k": [
       "grid has at least one row and one column",
       "Aim for O(rows x cols) time"
      ]
     }
    },
    {
     "n": "Connected components",
     "ex": {
      "i": "n = 5, edges [[0, 1], [1, 2], [3, 4]]",
      "o": "2",
      "w": "{0, 1, 2} and {3, 4}"
     },
     "t": "Build a list of neighbours for each node. Starting from a node nobody has reached yet, how many other nodes can you walk to?",
     "code": "def count_components(n, edges):\n    # neighbours[u]: the nodes joined to u by an edge (an edge works both ways)\n    neighbours = [[] for _ in range(n)]\n    for a, b in edges:\n        neighbours[a].append(b)\n        neighbours[b].append(a)\n\n    seen = set()  # nodes already assigned to a component\n    count = 0\n    for start in range(n):\n        if start in seen:\n            continue\n        # A node nobody reached before: a new component. Visit everything it connects to.\n        count += 1\n        seen.add(start)\n        stack = [start]  # nodes found but whose neighbours we have not looked at\n        while stack:\n            u = stack.pop()\n            for v in neighbours[u]:\n                if v not in seen:\n                    seen.add(v)\n                    stack.append(v)\n    return count",
     "st": {
      "p": "Given `n` nodes numbered 0 to n - 1 and a list `edges` of undirected connections `[a, b]`, return the number of connected components.\n\nTwo nodes are in the same component if you can walk from one to the other along edges. A node with no edges is a component by itself.",
      "ex": [
       {
        "i": "n = 5, edges = [[0, 1], [1, 2], [3, 4]]",
        "o": "2",
        "why": "{0, 1, 2} and {3, 4} are the two groups"
       },
       {
        "i": "n = 3, edges = []",
        "o": "3",
        "why": "with no edges every node is a component by itself"
       }
      ],
      "k": [
       "node ids run from 0 to n - 1",
       "Aim for O(n + e) time for n nodes and e edges"
      ]
     }
    },
    {
     "n": "Word ladder (fewest steps)",
     "ex": {
      "i": "\"hit\" to \"cog\" via [hot, dot, dog, lot, log, cog]",
      "o": "5",
      "w": "hit, hot, dot, dog, cog"
     },
     "t": "Think of each word as a place and each one-letter change as a road. Which search reaches the nearest places first?",
     "code": "from collections import deque\n\ndef ladder_length(begin, end, words):\n    allowed = set(words)  # a set makes \"is this a real word?\" an O(1) check\n    # deque: a queue with O(1) pops from the front\n    q = deque([(begin, 1)])  # (word, how many words in the chain so far)\n    seen = {begin}  # words already queued, so no word is queued twice\n    while q:\n        word, length = q.popleft()\n        if word == end:\n            return length  # the first time we reach end is by the shortest chain\n        # Try changing each position to each letter\n        for i in range(len(word)):\n            for ch in \"abcdefghijklmnopqrstuvwxyz\":\n                nxt = word[:i] + ch + word[i + 1:]\n                if nxt in allowed and nxt not in seen:\n                    seen.add(nxt)\n                    q.append((nxt, length + 1))\n    return 0  # the queue ran dry without reaching end",
     "st": {
      "p": "Given a `begin` word, an `end` word and a list of allowed `words`, return the number of words in the shortest chain from `begin` to `end`, counting both ends.\n\nEach step changes exactly one letter, and every word after `begin` must be in `words`. Return 0 if there is no such chain, including when `end` is not in `words`.",
      "ex": [
       {
        "i": "begin = 'hit', end = 'cog', words = ['hot', 'dot', 'dog', 'lot', 'log', 'cog']",
        "o": "5",
        "why": "hit, hot, dot, dog, cog is the shortest chain, five words long"
       },
       {
        "i": "begin = 'hit', end = 'cog', words = ['hot', 'dot', 'dog', 'lot', 'log']",
        "o": "0",
        "why": "cog is missing from the word list, so it can never be reached"
       }
      ],
      "k": [
       "all words have the same length",
       "Aim for O(w x 26 x L) time for w words of length L"
      ]
     }
    }
   ],
   "spot": "Connections and grids. <b>Signal:</b> islands, 'minimum steps', 'are these connected'.",
   "cx": "O(V + E).",
   "tpl": "from collections import deque\n\ndef bfs(start, neighbours):\n    seen, q, dist = {start}, deque([start]), {start: 0}\n    while q:\n        u = q.popleft()\n        for v in neighbours(u):\n            if v not in seen:\n                seen.add(v)\n                dist[v] = dist[u] + 1\n                q.append(v)\n    return dist",
   "probs": [
    {
     "n": "Number of islands",
     "ex": {
      "i": "grid rows 11000, 11000, 00100, 00011",
      "o": "3",
      "w": "three separate pieces of land"
     },
     "l": "medium",
     "task": "Count groups of connected '1's in a grid.",
     "hint": "Once you find one land cell, how could you make sure every other cell of that island is never counted again?",
     "sol": "def num_islands(grid):\n    rows, cols = len(grid), len(grid[0])\n    count = 0  # islands found so far\n\n    def sink(r, c):\n        # Stop at the edge of the grid, at water, and at land we already sank\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':\n            return\n        grid[r][c] = '0'  # turn it to water so this cell is never counted twice\n        # The neighbours on land belong to the same island\n        sink(r + 1, c)\n        sink(r - 1, c)\n        sink(r, c + 1)\n        sink(r, c - 1)\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                # Land we have not seen yet: a new island, so sink all of it\n                count += 1\n                sink(r, c)\n    return count",
     "c": "O(rows x cols) time: every cell is sunk once and looked at a few times. O(rows x cols) space for the call stack in the worst case.",
     "st": {
      "p": "Given a `grid` of `'1'` (land) and `'0'` (water) characters, stored as a list of lists, return the number of islands.\n\nAn island is a group of land cells joined up, down, left or right, not diagonally.",
      "ex": [
       {
        "i": "grid = [['1','1','0','0','0'], ['1','1','0','0','0'], ['0','0','1','0','0'], ['0','0','0','1','1']]",
        "o": "3",
        "why": "three groups of connected land cells: the top-left block, the middle cell and the bottom-right pair"
       },
       {
        "i": "grid = [['0']]",
        "o": "0",
        "why": "a single water cell has no land"
       }
      ],
      "k": [
       "grid has at least one row and one column",
       "Aim for O(rows x cols) time"
      ]
     }
    }
   ],
   "g": "structures"
  },
  {
   "id": "order",
   "title": "Graphs: order and weights",
   "group": "Structures",
   "ex": {
    "i": "n = 2, prereqs = [[1, 0]]",
    "o": "True",
    "w": "take 0, then 1; no cycle"
   },
   "sheet": {
    "spot": "Prerequisites; weighted shortest path; merging groups.",
    "move": null,
    "code": "parent = list(range(n))\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x",
    "notes": [
     "<b>Topological (Kahn):</b> queue indegree 0; done &lt; n means a cycle.",
     "<b>Dijkstra:</b> heap of (dist, node); skip stale; no negative weights. O(E log V).",
     "<b>Union-find:</b> components, redundant edge; union = parent[find(a)] = find(b)."
    ]
   },
   "vars": [
    {
     "n": "Course schedule II (return an order)",
     "ex": {
      "i": "n = 4, [[1, 0], [2, 0], [3, 1], [3, 2]]",
      "o": "[0, 1, 2, 3]",
      "w": "any valid order"
     },
     "t": "A course can be taken once everything it needs is taken. In what order do courses become available, and what does it mean if some never do?",
     "code": "from collections import deque\n\ndef find_order(n, prereqs):\n    unlocks = [[] for _ in range(n)]  # unlocks[p]: courses that need p first\n    waiting = [0] * n                 # waiting[c]: prerequisites of c not yet taken\n    for course, pre in prereqs:\n        unlocks[pre].append(course)\n        waiting[course] += 1\n\n    # deque: a queue with O(1) pops from the front\n    q = deque()  # courses that can be taken right now\n    for c in range(n):\n        if waiting[c] == 0:\n            q.append(c)\n\n    order = []  # courses in the order we take them\n    while q:\n        u = q.popleft()\n        order.append(u)\n        # u is taken, so each course that needed it has one blocker fewer\n        for v in unlocks[u]:\n            waiting[v] -= 1\n            if waiting[v] == 0:\n                q.append(v)\n\n    # Fewer than n means some courses sit on a cycle and were never freed\n    if len(order) < n:\n        return []\n    return order",
     "st": {
      "p": "Given `n` courses numbered 0 to n - 1 and a list `prereqs` of pairs `[course, prereq]`, meaning `prereq` must be taken before `course`, return one order in which you can take all the courses. Return an empty list if that is impossible.\n\nAny order that respects every prerequisite is accepted.",
      "ex": [
       {
        "i": "n = 4, prereqs = [[1, 0], [2, 0], [3, 1], [3, 2]]",
        "o": "[0, 1, 2, 3]",
        "why": "0 unlocks 1 and 2, which both unlock 3"
       },
       {
        "i": "n = 2, prereqs = [[1, 0], [0, 1]]",
        "o": "[]",
        "why": "a cycle means no valid order exists"
       }
      ],
      "k": [
       "course ids run from 0 to n - 1",
       "any valid order is accepted, not only the one shown",
       "Aim for O(n + e) time"
      ]
     }
    },
    {
     "n": "Redundant connection (union-find)",
     "ex": {
      "i": "[[1, 2], [1, 3], [2, 3]]",
      "o": "[2, 3]",
      "w": "the edge that closes a loop"
     },
     "t": "Add the edges one at a time and track which nodes are already connected. What does it mean when both ends of a new edge are in the same group?",
     "code": "def redundant_connection(edges):\n    # parent[x]: a node in x's group that is closer to the group's leader;\n    # the leader is the node that is its own parent. Everyone starts alone.\n    parent = list(range(len(edges) + 1))\n\n    def find(x):\n        # Walk up to the leader of x's group\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]  # shortcut: skip a level so later walks are shorter\n            x = parent[x]\n        return x\n\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            # a and b were already connected, so this edge closes a loop\n            return [a, b]\n        parent[ra] = rb  # join the two groups\n    return []  # never reached: one edge always closes a loop",
     "st": {
      "p": "Given a list of `edges` `[a, b]` for an undirected graph on nodes 1 to n that was a tree before one extra edge was added, return the edge that can be removed to make it a tree again.\n\nIf several edges could be removed, return the one that appears last in `edges`.",
      "ex": [
       {
        "i": "edges = [[1, 2], [1, 3], [2, 3]]",
        "o": "[2, 3]",
        "why": "2 and 3 are already linked through node 1, so this edge closes a loop"
       },
       {
        "i": "edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]",
        "o": "[1, 4]",
        "why": "1 and 4 are already linked through 1-2-3-4, so this edge closes a loop"
       }
      ],
      "k": [
       "exactly one extra edge was added",
       "nodes are numbered 1 to len(edges)",
       "Aim for close to O(n) time"
      ]
     }
    },
    {
     "n": "Network delay time (Dijkstra)",
     "ex": {
      "i": "times [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n = 4, from 2",
      "o": "2",
      "w": "the last node hears at time 2"
     },
     "t": "You need the earliest time the signal reaches each node. Once you have those, which one decides when the whole network has the signal?",
     "code": "import heapq  # heapq: a min-heap kept inside a plain list, so the smallest entry pops first\n\ndef network_delay(times, n, k):\n    out = [[] for _ in range(n + 1)]  # out[u]: (v, w) pairs for edges leaving u\n    for u, v, w in times:\n        out[u].append((v, w))\n\n    dist = {}  # node -> earliest time the signal arrives; set once, when finalised\n    heap = [(0, k)]  # (arrival time, node): the earliest arrival pops first\n    while heap:\n        d, u = heapq.heappop(heap)\n        if u in dist:  # u was already reached by an earlier signal\n            continue\n        dist[u] = d\n        for v, w in out[u]:\n            if v not in dist:\n                heapq.heappush(heap, (d + w, v))\n\n    # The last node to hear the signal decides the delay, if every node heard it\n    if len(dist) < n:\n        return -1\n    return max(dist.values())",
     "st": {
      "p": "Given a list `times` of directed edges `[source, target, weight]`, the number of nodes `n` (numbered 1 to n) and a start node `k`, return how long it takes for a signal sent from `k` to reach every node, or -1 if some node is never reached.\n\nThe weight of an edge is the time the signal needs to travel along it. The signal leaves a node along all of its edges at once.",
      "ex": [
       {
        "i": "times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n = 4, k = 2",
        "o": "2",
        "why": "node 4 is reached last, at time 2, via 2 -> 3 -> 4"
       },
       {
        "i": "times = [[1, 2, 1]], n = 2, k = 2",
        "o": "-1",
        "why": "no edge leaves node 2, so node 1 is never reached"
       }
      ],
      "k": [
       "all weights are non-negative",
       "Aim for O(e log v) time"
      ]
     }
    },
    {
     "n": "Cheapest flight within k stops",
     "ex": {
      "i": "0 -> 1 -> 3 costs 700; 0 -> 1 -> 2 -> 3 costs 400 but has 2 stops; k = 1",
      "o": "700",
      "w": "the stop limit changes the answer"
     },
     "t": "A trip with k stops uses at most k + 1 flights. How could you improve the best known price to each city by allowing one more flight at a time?",
     "code": "def cheapest_flights(n, flights, src, dst, k):\n    inf = float('inf')\n    # cost[city]: cheapest price found so far to reach city using the flights allowed so far\n    cost = [inf] * n\n    cost[src] = 0\n    # k stops means at most k + 1 flights, so allow one more flight each round\n    for _ in range(k + 1):\n        nxt = cost[:]  # build the new round from a copy, so a flight added now is not reused this round\n        for u, v, w in flights:\n            if cost[u] + w < nxt[v]:\n                nxt[v] = cost[u] + w\n        cost = nxt\n    if cost[dst] == inf:\n        return -1  # dst cannot be reached within k stops\n    return cost[dst]",
     "st": {
      "p": "Given `n` cities numbered 0 to n - 1, a list of one-way `flights` `[source, target, price]`, a start city `src`, a destination `dst` and an integer `k`, return the cheapest total price to get from `src` to `dst` with at most `k` stops, or -1 if no such trip exists.\n\nA stop is a city you pass through between `src` and `dst`.",
      "ex": [
       {
        "i": "n = 3, flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src = 0, dst = 2, k = 1",
        "o": "200",
        "why": "one stop at city 1 allows the two cheap flights, 100 + 100"
       },
       {
        "i": "n = 3, flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src = 0, dst = 2, k = 0",
        "o": "500",
        "why": "zero stops forces the direct, pricier flight"
       }
      ],
      "k": [
       "Aim for O(k x e) time for e flights"
      ]
     }
    }
   ],
   "spot": "Dependencies, weighted shortest paths, merging groups. <b>Signal:</b> prerequisites, 'cheapest', 'which edge closes a loop'.",
   "cx": "Kahn O(V + E); Dijkstra O(E log V); union-find close to O(1) per call.",
   "tpl": "parent = list(range(n))\n\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]   # path halving\n        x = parent[x]\n    return x\n\ndef union(a, b):\n    ra, rb = find(a), find(b)\n    if ra == rb:\n        return False                   # already connected\n    parent[ra] = rb\n    return True",
   "probs": [
    {
     "n": "Course schedule (topological sort)",
     "ex": {
      "i": "n = 2, prereqs = [[1, 0]] and [[1, 0], [0, 1]]",
      "o": "True, False",
      "w": "the second is a cycle"
     },
     "l": "medium",
     "task": "Can all courses be finished given prerequisite pairs?",
     "hint": "A course with no prerequisites left can be taken right now. What does taking it do for the courses waiting on it, and what happens to courses stuck in a cycle?",
     "sol": "from collections import deque\n\ndef can_finish(n, prereqs):\n    unlocks = [[] for _ in range(n)]  # unlocks[p]: courses that need p first\n    waiting = [0] * n                 # waiting[c]: prerequisites of c not yet taken\n    for course, pre in prereqs:\n        unlocks[pre].append(course)\n        waiting[course] += 1\n\n    # deque: a queue with O(1) pops from the front\n    q = deque()  # courses that can be taken right now\n    for c in range(n):\n        if waiting[c] == 0:\n            q.append(c)\n\n    taken = 0\n    while q:\n        u = q.popleft()\n        taken += 1\n        # Taking u removes one blocker from every course that needed it\n        for v in unlocks[u]:\n            waiting[v] -= 1\n            if waiting[v] == 0:\n                q.append(v)\n\n    # Courses on a cycle wait for each other forever, so they are never taken\n    return taken == n",
     "c": "O(V + E) time: each course and each prerequisite pair is handled once. O(V + E) space for the lists.",
     "st": {
      "p": "Given `n` courses numbered 0 to n - 1 and a list `prereqs` of pairs `[course, prereq]`, meaning `prereq` must be taken before `course`, return `True` if you can take every course, otherwise `False`.",
      "ex": [
       {
        "i": "n = 2, prereqs = [[1, 0]]",
        "o": "True",
        "why": "take course 0, then course 1"
       },
       {
        "i": "n = 2, prereqs = [[1, 0], [0, 1]]",
        "o": "False",
        "why": "0 needs 1 and 1 needs 0, so neither can go first"
       }
      ],
      "k": [
       "course ids run from 0 to n - 1",
       "Aim for O(n + e) time for n courses and e prerequisite pairs"
      ]
     }
    },
    {
     "n": "Shortest path with weights (Dijkstra)",
     "ex": {
      "i": "{a: [(b, 1), (c, 4)], b: [(c, 2)]}, from a",
      "o": "{a: 0, b: 1, c: 3}",
      "w": "a -> b -> c beats a -> c"
     },
     "l": "medium",
     "task": "Cheapest cost from a source to every node, non-negative weights.",
     "hint": "With no negative weights, the closest node you have not finished can never be improved later. How could you always pick that node next?",
     "sol": "import heapq  # heapq: a min-heap kept inside a plain list, so the smallest entry pops first\n\ndef dijkstra(graph, src):\n    dist = {src: 0}  # node -> cheapest distance found so far\n    heap = [(0, src)]  # (distance, node): the closest unexplored node pops first\n    while heap:\n        d, u = heapq.heappop(heap)\n        # An older, longer entry for u: a shorter route was already recorded\n        if d > dist[u]:\n            continue\n        for v, w in graph.get(u, []):\n            new_dist = d + w  # cost of reaching v by going through u\n            # First route to v, or a cheaper one than we knew\n            if v not in dist or new_dist < dist[v]:\n                dist[v] = new_dist\n                heapq.heappush(heap, (new_dist, v))\n    return dist",
     "c": "O(E log V) time: each edge can push one heap entry, and each push or pop costs O(log). O(V + E) space.",
     "st": {
      "p": "Given a directed weighted `graph`, a dict mapping each node to a list of `(neighbor, weight)` pairs, and a start node `src`, return a dict of the cheapest total distance from `src` to every node it can reach.\n\nAll weights are non-negative. A node that cannot be reached from `src` is left out of the result.",
      "ex": [
       {
        "i": "graph = {'a': [('b', 1), ('c', 4)], 'b': [('c', 2)]}, src = 'a'",
        "o": "{'a': 0, 'b': 1, 'c': 3}",
        "why": "a -> b -> c costs 3, cheaper than the direct edge a -> c at 4"
       },
       {
        "i": "graph = {'a': [('b', 1)], 'c': []}, src = 'a'",
        "o": "{'a': 0, 'b': 1}",
        "why": "no edge reaches c from a, so it is left out of the result"
       }
      ],
      "k": [
       "all edge weights are non-negative",
       "Aim for O(e log v) time for v nodes and e edges"
      ]
     }
    }
   ],
   "g": "structures"
  },
  {
   "id": "heap",
   "title": "Heaps and top k",
   "group": "Structures",
   "ex": {
    "i": "[3, 2, 1, 5, 6, 4], k = 2",
    "o": "5",
    "w": "the second largest"
   },
   "sheet": {
    "spot": "Top k, kth largest, merge k sorted, scheduling.",
    "move": "Min-heap of size k keeps the k largest.",
    "code": "h = []\nfor x in a:\n    heapq.heappush(h, x)\n    if len(h) > k: heapq.heappop(h)\nreturn h[0]  # kth largest",
    "notes": [
     "heapq is min only: push -x for a max-heap.",
     "Ties: push (key, i, item). O(n log k)."
    ]
   },
   "vars": [
    {
     "n": "K closest points to the origin",
     "ex": {
      "i": "[[1, 3], [-2, 2]], k = 1",
      "o": "[[-2, 2]]",
      "w": "distance 8 beats 10"
     },
     "t": "Only the k closest points matter. Which point would you want to find fastest, to throw it out when a closer one arrives?",
     "code": "import heapq  # heapq: a min-heap kept inside a plain list, so the smallest entry pops first\n\ndef k_closest(points, k):\n    # Keep the k closest so far. Entries are (-squared distance, -index): negating\n    # makes the farthest point the smallest entry, so it is the first one to pop.\n    heap = []\n    for i in range(len(points)):\n        x, y = points[i]\n        d = x * x + y * y  # squared distance orders points like the real one, no square root needed\n        if len(heap) < k:\n            heapq.heappush(heap, (-d, -i))\n        elif -d > heap[0][0]:\n            # Closer than the farthest point we are keeping: swap it out\n            heapq.heapreplace(heap, (-d, -i))\n\n    # Popping gives the farthest first, so reverse to get nearest first\n    result = []\n    while heap:\n        neg_d, neg_i = heapq.heappop(heap)\n        result.append(points[-neg_i])\n    result.reverse()\n    return result",
     "st": {
      "p": "Given a list of 2D `points` `[x, y]` and an integer `k`, return the `k` points closest to the origin (0, 0), nearest first.\n\nIf two points are the same distance away, the one that appears earlier in `points` comes first.",
      "ex": [
       {
        "i": "points = [[1, 3], [-2, 2]], k = 1",
        "o": "[[-2, 2]]",
        "why": "(-2, 2) is closer than (1, 3): squared distance 8 against 10"
       },
       {
        "i": "points = [[3, 3], [5, -1], [-2, 4]], k = 2",
        "o": "[[3, 3], [-2, 4]]",
        "why": "(3, 3) and (-2, 4) are at squared distance 18 and 20, both closer than (5, -1) at 26"
       }
      ],
      "k": [
       "1 <= k <= len(points)",
       "Aim for O(n log k) time"
      ]
     },
     "alt": {
      "note": "Same answer in one line: `heapq.nsmallest` runs the keep-the-k-smallest loop for you.",
      "code": "import heapq\n\ndef k_closest(points, k):\n    return heapq.nsmallest(k, points, key=lambda p: p[0] ** 2 + p[1] ** 2)"
     }
    },
    {
     "n": "Running median",
     "ex": {
      "i": "add 1, 2, 3",
      "o": "medians 1, 1.5, 2",
      "w": "after each add"
     },
     "t": "The median sits between the smaller half and the larger half. What if you kept each half so that its edge, the half's largest or smallest value, is quick to read?",
     "code": "import heapq  # heapq: a min-heap kept inside a plain list, so the smallest entry pops first\n\nclass MedianFinder:\n    def __init__(self):\n        # lo: the smaller half, stored as negatives so its smallest entry is the\n        #     largest real value (a max-heap)\n        # hi: the larger half, a plain min-heap\n        self.lo = []\n        self.hi = []\n\n    def add(self, x):\n        # Send x through lo, then move lo's largest value up to hi,\n        # so every value in lo stays <= every value in hi\n        heapq.heappush(self.lo, -x)\n        biggest_low = -heapq.heappop(self.lo)\n        heapq.heappush(self.hi, biggest_low)\n        # Keep lo the same size as hi, or one bigger\n        if len(self.hi) > len(self.lo):\n            smallest_high = heapq.heappop(self.hi)\n            heapq.heappush(self.lo, -smallest_high)\n\n    def median(self):\n        # Odd count: lo has the extra value, and its top is the middle\n        if len(self.lo) > len(self.hi):\n            return -self.lo[0]\n        # Even count: the middle is between the two tops\n        return (-self.lo[0] + self.hi[0]) / 2",
     "st": {
      "p": "Design a class `MedianFinder` with `add(x)`, which adds a number to the collection, and `median()`, which returns the median of all numbers added so far.\n\nThe median is the middle value in sorted order, or the average of the two middle values when the count is even. `add` is called before the first `median`.",
      "ex": [
       {
        "i": "add(1), add(2), add(3), reading `median()` after each add",
        "o": "1, 1.5, 2",
        "why": "after 1, 2, 3 the middle value is 1, then 1.5, then 2"
       },
       {
        "i": "add(5), add(2), add(8), add(1), reading `median()` after each add",
        "o": "5, 3.5, 5, 3.5",
        "why": "with an even count the median is the average of the two middle values"
       }
      ],
      "k": [
       "add() is called before the first median()",
       "Aim for O(log n) per add and O(1) per median"
      ]
     },
     "first": {
      "label": "First idea, O(n) per add",
      "note": "Keep one sorted list and read the middle. Every add shifts up to n values, though the median only needs the middle. What if you kept only the two halves, with their edges easy to reach?",
      "code": "class MedianFinder:\n    def __init__(self):\n        self.nums = []  # all numbers so far, always in sorted order\n\n    def add(self, x):\n        # Walk from the left to find where x belongs\n        i = 0\n        while i < len(self.nums) and self.nums[i] < x:\n            i += 1\n        self.nums.insert(i, x)  # inserting shifts everything after i\n\n    def median(self):\n        n = len(self.nums)\n        mid = n // 2\n        # Odd count: the middle element. Even count: average the two middle ones.\n        if n % 2 == 1:\n            return self.nums[mid]\n        return (self.nums[mid - 1] + self.nums[mid]) / 2"
     }
    },
    {
     "n": "Top k frequent words",
     "ex": {
      "i": "[\"i\", \"love\", \"code\", \"i\", \"love\", \"coding\"], k = 2",
      "o": "[\"i\", \"love\"]",
      "w": "ties broken alphabetically"
     },
     "t": "First count each word. Then how could you order the words so that the answer comes out first, highest count first and alphabetical on ties?",
     "code": "import heapq  # heapq: a min-heap kept inside a plain list, so the smallest entry pops first\n\ndef top_k_words(words, k):\n    counts = {}  # word -> how many times it appears\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n\n    # Entries are (-count, word). Python compares tuples left to right, so the smallest\n    # entry has the highest count, and among equal counts the alphabetically first word.\n    heap = []\n    for w in counts:\n        heap.append((-counts[w], w))\n    heapq.heapify(heap)\n\n    # The k smallest entries are the answer, already in the required order\n    result = []\n    for _ in range(k):\n        neg_count, w = heapq.heappop(heap)\n        result.append(w)\n    return result",
     "st": {
      "p": "Given a list of strings `words` and an integer `k`, return the `k` most frequent words.\n\nOrder the answer from the highest frequency to the lowest. Words with the same frequency are ordered alphabetically.",
      "ex": [
       {
        "i": "words = ['i', 'love', 'code', 'i', 'love', 'coding'], k = 2",
        "o": "['i', 'love']",
        "why": "'i' and 'love' each appear twice, more than any other word"
       },
       {
        "i": "words = ['a', 'b', 'c'], k = 2",
        "o": "['a', 'b']",
        "why": "all three words appear once, so alphabetical order picks 'a' and 'b'"
       }
      ],
      "k": [
       "1 <= k <= number of distinct words",
       "Aim for O(n log n) time"
      ]
     },
     "alt": {
      "note": "Same counts in one line each: `Counter` builds the counts and `nsmallest` picks the k best by the same key.",
      "code": "import heapq\nfrom collections import Counter\n\ndef top_k_words(words, k):\n    cnt = Counter(words)\n    return heapq.nsmallest(k, cnt, key=lambda w: (-cnt[w], w))"
     }
    }
   ],
   "spot": "The k largest or smallest, streaming medians, merging sorted lists. <b>Signal:</b> 'top k', 'kth largest'.",
   "cx": "O(n log k) for top k.",
   "tpl": "import heapq\nheap = []\nfor x in nums:\n    heapq.heappush(heap, x)\n    if len(heap) > k:\n        heapq.heappop(heap)     # keep the k largest\n# heap[0] is the kth largest",
   "probs": [
    {
     "n": "Kth largest element",
     "ex": {
      "i": "[3, 2, 1, 5, 6, 4], k = 2",
      "o": "5",
      "w": "the second largest"
     },
     "l": "medium",
     "task": "The kth largest in an unsorted array.",
     "hint": "Only the k biggest numbers matter. What could you keep while scanning so that the smallest of them is always easy to find?",
     "sol": "import heapq  # heapq: a min-heap kept inside a plain list, so heap[0] is the smallest\n\ndef kth_largest(nums, k):\n    # Start with the first k numbers as the \"k largest so far\"\n    heap = nums[:k]\n    heapq.heapify(heap)  # rearrange the list so heap[0] is the smallest\n    for x in nums[k:]:\n        # x beats the smallest of the current k largest, so it takes its place\n        if x > heap[0]:\n            heapq.heapreplace(heap, x)  # pop the smallest and push x in one step\n    # The smallest of the k largest is exactly the kth largest\n    return heap[0]",
     "c": "O(n log k) time: each number costs at most one heap update of size k. O(k) space for the heap.",
     "st": {
      "p": "Given an unsorted list of integers `nums` and an integer `k`, return the kth largest element.\n\nIt is the kth largest in sorted order, not the kth distinct value, so duplicates count.",
      "ex": [
       {
        "i": "nums = [3, 2, 1, 5, 6, 4], k = 2",
        "o": "5",
        "why": "6 is largest, 5 is second"
       },
       {
        "i": "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4",
        "o": "4",
        "why": "duplicates each count as their own position: 6, 5, 5, 4"
       }
      ],
      "k": [
       "1 <= k <= len(nums)",
       "Aim for O(n log k) time and O(k) space"
      ]
     },
     "first": {
      "label": "First idea, O(n log n)",
      "note": "Sort everything and read off position k. It works, but it orders all n numbers when only the top k matter. What if you only kept the k largest as you scan?",
      "code": "def kth_largest(nums, k):\n    # Sort from largest to smallest\n    ordered = sorted(nums, reverse=True)\n    # Position 0 is the largest, so the kth largest is at index k - 1\n    return ordered[k - 1]"
     }
    },
    {
     "n": "Merge k sorted lists",
     "ex": {
      "i": "[[1, 4, 5], [1, 3, 4], [2, 6]]",
      "o": "[1, 1, 2, 3, 4, 4, 5, 6]",
      "w": "always pop the smallest head"
     },
     "l": "hard",
     "task": "Merge k sorted Python lists into one.",
     "hint": "The smallest value left anywhere must be at the front of one of the k lists. What could you keep so that finding the smallest of those k fronts is cheap?",
     "sol": "import heapq  # heapq: a min-heap kept inside a plain list, so the smallest entry pops first\n\ndef merge_k(lists):\n    # One candidate per list: its front value, as (value, which list, position in it).\n    # On equal values the list number breaks the tie, so entries always compare.\n    heap = []\n    for i in range(len(lists)):\n        if lists[i]:\n            heap.append((lists[i][0], i, 0))\n    heapq.heapify(heap)\n\n    out = []\n    while heap:\n        # The smallest front value is the smallest value left anywhere\n        val, i, j = heapq.heappop(heap)\n        out.append(val)\n        # Replace it with the next value from the same list, if it has one\n        if j + 1 < len(lists[i]):\n            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))\n    return out",
     "c": "O(N log k) time: each of the N values is pushed and popped once on a heap of at most k entries. O(k) space for the heap.",
     "st": {
      "p": "Given a list `lists` of k lists that are each sorted in ascending order, return one sorted list holding all of their values.\n\nAny of the lists, or `lists` itself, can be empty.",
      "ex": [
       {
        "i": "lists = [[1, 4, 5], [1, 3, 4], [2, 6]]",
        "o": "[1, 1, 2, 3, 4, 4, 5, 6]",
        "why": "each step takes the smallest front value across the three lists"
       },
       {
        "i": "lists = [[]]",
        "o": "[]",
        "why": "a single empty list contributes nothing"
       }
      ],
      "k": [
       "Aim for O(N log k) time for N total values across k lists",
       "O(k) extra space besides the output"
      ]
     },
     "first": {
      "label": "First idea, O(N log N)",
      "note": "Put every value in one list and sort it. This ignores that each list is already sorted. The smallest left is always at the front of one list: could you track only those k fronts?",
      "code": "def merge_k(lists):\n    everything = []\n    # Gather every value from every list\n    for lst in lists:\n        for x in lst:\n            everything.append(x)\n    # Sort the lot from scratch, as if the input had no order\n    everything.sort()\n    return everything"
     }
    }
   ],
   "g": "structures"
  },
  {
   "id": "intervals",
   "title": "Intervals",
   "group": "Structures",
   "ex": {
    "i": "[[1, 3], [2, 6], [8, 10], [15, 18]]",
    "o": "[[1, 6], [8, 10], [15, 18]]",
    "w": "[1, 3] and [2, 6] overlap"
   },
   "sheet": {
    "spot": "Overlap, merge, insert, meeting rooms.",
    "move": "Sort by start; compare with the last end.",
    "code": "out = []\nfor s, e in sorted(iv):\n    if out and s <= out[-1][1]:\n        out[-1][1] = max(out[-1][1], e)\n    else: out.append([s, e])",
    "notes": [
     "Rooms needed: a heap of end times.",
     "O(n log n) for the sort."
    ]
   },
   "vars": [
    {
     "n": "Insert an interval",
     "ex": {
      "i": "[[1, 3], [6, 9]], insert [2, 5]",
      "o": "[[1, 5], [6, 9]]",
      "w": "already sorted"
     },
     "t": "Intervals that end before the new one starts stay put. Which others touch it, and what are the start and end of the combined interval?",
     "code": "def insert(ivs, new):\n    out = []\n    i, n = 0, len(ivs)\n\n    # 1. Intervals that end before new starts stay exactly as they are\n    while i < n and ivs[i][1] < new[0]:\n        out.append(ivs[i])\n        i += 1\n\n    # 2. Intervals that start by the time new ends overlap it: stretch new to cover them\n    start, end = new[0], new[1]\n    while i < n and ivs[i][0] <= end:\n        start = min(start, ivs[i][0])\n        end = max(end, ivs[i][1])\n        i += 1\n    out.append([start, end])  # the merged interval goes in its sorted place\n\n    # 3. Whatever is left starts after new ends, so copy it unchanged\n    return out + ivs[i:]",
     "st": {
      "p": "Given a list `ivs` of non-overlapping `[start, end]` intervals sorted by start, and a new interval `new`, return the list with `new` added.\n\nMerge any intervals that overlap, so the result is still sorted and non-overlapping. Intervals that only touch at an endpoint count as overlapping.",
      "ex": [
       {
        "i": "ivs = [[1, 3], [6, 9]], new = [2, 5]",
        "o": "[[1, 5], [6, 9]]",
        "why": "[2, 5] overlaps [1, 3], so they merge into [1, 5]"
       },
       {
        "i": "ivs = [[1, 5]], new = [6, 8]",
        "o": "[[1, 5], [6, 8]]",
        "why": "the new interval starts after the existing one ends, so nothing merges"
       }
      ],
      "k": [
       "ivs is sorted and has no overlaps",
       "Aim for O(n) time"
      ]
     }
    },
    {
     "n": "Can one person attend every meeting?",
     "ex": {
      "i": "[[0, 30], [5, 10]]",
      "o": "False",
      "w": "5 starts before 30 ends"
     },
     "t": "If you list the meetings by start time, which neighbouring pair would tell you there is a clash?",
     "code": "def can_attend(meetings):\n    ordered = sorted(meetings)  # earliest start first\n    for i in range(1, len(ordered)):\n        # This meeting starts before the one just before it ends: a clash\n        if ordered[i][0] < ordered[i - 1][1]:\n            return False\n    # Every meeting starts after the previous one ended\n    return True",
     "st": {
      "p": "Given a list `meetings` of `[start, end]` meeting times, return `True` if one person could attend every meeting, otherwise `False`.\n\nMeetings that touch, where one starts exactly when another ends, do not clash.",
      "ex": [
       {
        "i": "meetings = [[0, 30], [5, 10]]",
        "o": "False",
        "why": "the second meeting starts at 5, before the first ends at 30"
       },
       {
        "i": "meetings = [[7, 10], [2, 4]]",
        "o": "True",
        "why": "[2, 4] ends before [7, 10] begins, so they never overlap"
       }
      ],
      "k": [
       "Aim for O(n log n) time"
      ]
     }
    },
    {
     "n": "Fewest removals to stop overlaps",
     "ex": {
      "i": "[[1, 2], [2, 3], [3, 4], [1, 3]]",
      "o": "1",
      "w": "remove [1, 3]"
     },
     "t": "When two intervals clash, which one leaves more room for the rest? Think about which one ends sooner.",
     "code": "def erase_overlap(ivs):\n    last_end = float('-inf')  # end of the last interval we chose to keep\n    removed = 0\n    # Look at intervals in order of when they end\n    for s, e in sorted(ivs, key=lambda x: x[1]):\n        if s >= last_end:\n            # No clash with the last kept interval: keep this one\n            last_end = e\n        else:\n            # It clashes with one that ends no later, so removing this one costs least\n            removed += 1\n    return removed",
     "st": {
      "p": "Given a list `ivs` of `[start, end]` intervals, return the minimum number of intervals to remove so that none of the remaining ones overlap.\n\nIntervals that only touch at an endpoint, like [1, 2] and [2, 3], do not overlap.",
      "ex": [
       {
        "i": "ivs = [[1, 2], [2, 3], [3, 4], [1, 3]]",
        "o": "1",
        "why": "removing [1, 3] leaves [1, 2], [2, 3], [3, 4] with no overlap"
       },
       {
        "i": "ivs = [[1, 2], [1, 2], [1, 2]]",
        "o": "2",
        "why": "only one of three identical intervals can be kept"
       }
      ],
      "k": [
       "Aim for O(n log n) time"
      ]
     }
    }
   ],
   "spot": "Meetings, ranges, bookings. <b>Signal:</b> pairs of [start, end].",
   "cx": "O(n log n) for the sort.",
   "tpl": "for start, end in sorted(intervals):\n    if out and start <= out[-1][1]:\n        out[-1][1] = max(out[-1][1], end)\n    else:\n        out.append([start, end])",
   "probs": [
    {
     "n": "Meeting rooms needed",
     "ex": {
      "i": "[[0, 30], [5, 10], [15, 20]]",
      "o": "2",
      "w": "[0, 30] overlaps both others"
     },
     "l": "medium",
     "task": "Minimum number of rooms for all meetings.",
     "hint": "When a meeting starts, you only need to know whether some room has already been freed. What could you keep so the earliest-freed room is quick to find?",
     "sol": "import heapq  # heapq: a min-heap kept inside a plain list, so ends[0] is the smallest\n\ndef min_rooms(meetings):\n    ends = []  # end time of the last meeting in each room; ends[0] frees up first\n    for start, end in sorted(meetings):  # take meetings in order of start time\n        if ends and ends[0] <= start:\n            # The room that frees first is free by now: reuse it\n            heapq.heapreplace(ends, end)  # pop its old end time, push the new one\n        else:\n            # Every room is still busy: open a new one\n            heapq.heappush(ends, end)\n    # One entry per room we ever had to open\n    return len(ends)",
     "c": "O(n log n) time: sorting, then one heap update per meeting. O(n) space for the heap.",
     "st": {
      "p": "Given a list of `[start, end]` times in `meetings`, return the minimum number of rooms needed to hold all the meetings.\n\nTwo meetings overlap if one starts before the other ends. A meeting that starts exactly when another ends can use the same room.",
      "ex": [
       {
        "i": "meetings = [[0, 30], [5, 10], [15, 20]]",
        "o": "2",
        "why": "[5, 10] and [15, 20] each overlap [0, 30], so a second room is needed"
       },
       {
        "i": "meetings = [[7, 10], [2, 4]]",
        "o": "1",
        "why": "the two meetings do not overlap, so one room covers both"
       }
      ],
      "k": [
       "Aim for O(n log n) time"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "The busiest moment is when some meeting starts, so count how many meetings are running at each start. It works, but every count rescans all meetings. What if you handled meetings in start order and remembered only when each room frees up?",
      "code": "def min_rooms(meetings):\n    most = 0  # the highest number of meetings running at once\n    for start, end in meetings:\n        # Count the meetings that are running at this meeting's start time\n        running = 0\n        for s, e in meetings:\n            if s <= start < e:\n                running += 1\n        if running > most:\n            most = running\n    return most"
     }
    }
   ],
   "g": "structures"
  },
  {
   "id": "dp",
   "title": "Dynamic programming",
   "group": "Techniques",
   "ex": {
    "i": "coins = [1, 2, 5], amount = 11",
    "o": "3",
    "w": "5 + 5 + 1"
   },
   "sheet": {
    "spot": "Count ways, min or max cost, can you; choices overlap.",
    "move": "State in words, recurrence, base, order.",
    "code": "dp = [0] + [inf] * amt\nfor x in range(1, amt + 1):\n    for c in coins:\n        if c <= x:\n            dp[x] = min(dp[x], dp[x - c] + 1)",
    "notes": [
     "Start top-down with @cache, then a table.",
     "Two strings: dp[i][j]. Only the last row needed: O(n) space.",
     "Know: climb, rob, coin change, LIS, LCS, knapsack."
    ]
   },
   "vars": [
    {
     "n": "Maximum subarray (Kadane's)",
     "ex": {
      "i": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
      "o": "6",
      "w": "[4, -1, 2, 1]"
     },
     "t": "For each position, ask for the best sum of a run that ends there. Is it better to extend the run before it, or to start a new run at this number?",
     "code": "def max_subarray(nums):\n    # cur: best sum of a run that ends at the current element\n    # best: best sum seen for any run so far\n    best = cur = nums[0]\n    for x in nums[1:]:\n        # a run ending at x either extends the run before it, or starts fresh at x\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best",
     "st": {
      "p": "Given an integer list `nums`, return the largest sum of any non-empty run of neighbouring elements.\n\nA single element counts as a run, so a list holding one negative number returns that number.",
      "ex": [
       {
        "i": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "o": "6",
        "why": "the run [4, -1, 2, 1] adds up to 6, the largest of any run"
       },
       {
        "i": "nums = [-5]",
        "o": "-5",
        "why": "edge case: the only run is [-5], so it is also the best"
       }
      ],
      "k": [
       "nums has at least one element",
       "Aim for O(n) time and O(1) extra space"
      ]
     }
    },
    {
     "n": "Longest increasing subsequence",
     "ex": {
      "i": "[10, 9, 2, 5, 3, 7, 101, 18]",
      "o": "4",
      "w": "2, 3, 7, 18"
     },
     "t": "For each length, keep the smallest number that can end an increasing run of that length. Where does a new number x fit among those ends, and which one does it replace?",
     "code": "def lis(nums):\n    # tails[k]: the smallest number that can end an increasing run of length k + 1\n    # tails stays sorted, so the place for a new number can be found by halving\n    tails = []\n    for x in nums:\n        # find the first position whose tail is >= x\n        lo, hi = 0, len(tails)\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if tails[mid] < x:\n                lo = mid + 1  # x is bigger than this tail, so the place is further right\n            else:\n                hi = mid  # this tail could be the place, so keep it in range\n        if lo == len(tails):\n            tails.append(x)  # x is bigger than every tail: it makes a longer run\n        else:\n            tails[lo] = x  # x is a smaller end for runs of length lo + 1\n    return len(tails)",
     "st": {
      "p": "Given an integer list `nums`, return the length of its longest strictly increasing subsequence.\n\nA subsequence keeps the original order but may skip elements, so it does not have to be contiguous. An empty list has length 0.",
      "ex": [
       {
        "i": "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
        "o": "4",
        "why": "2, 3, 7, 18 is strictly increasing, and no longer one exists"
       },
       {
        "i": "nums = []",
        "o": "0",
        "why": "edge case: an empty list has no subsequence at all"
       }
      ],
      "k": [
       "Aim for O(n log n) time",
       "O(n) space"
      ]
     },
     "first": {
      "label": "First idea, O(n^2)",
      "note": "For each number, look back at every earlier number and extend the best run that ends below it. That is a full scan per number. Do you need the best run ending at each earlier number, or only the smallest end for each length?",
      "code": "def lis(nums):\n    # best[i]: length of the longest increasing run that ends at nums[i]\n    best = []\n    for i in range(len(nums)):\n        best.append(1)  # nums[i] alone is a run of length 1\n        for j in range(i):\n            if nums[j] < nums[i]:\n                # nums[i] can extend the run that ends at nums[j]\n                best[i] = max(best[i], best[j] + 1)\n    if not best:\n        return 0\n    return max(best)"
     },
     "alt": {
      "note": "Same idea with the library: `bisect_left` finds the place of `x` in `tails` for you.",
      "code": "from bisect import bisect_left\n\ndef lis(nums):\n    tails = []\n    for x in nums:\n        i = bisect_left(tails, x)\n        if i == len(tails):\n            tails.append(x)\n        else:\n            tails[i] = x\n    return len(tails)"
     }
    },
    {
     "n": "Unique paths in a grid",
     "ex": {
      "i": "3 rows, 7 columns",
      "o": "28",
      "w": "moves right or down only"
     },
     "t": "A cell can only be entered from above or from the left. How do the path counts of those two neighbours combine, and how much of the grid do you need to keep?",
     "code": "def unique_paths(m, n):\n    # row[j]: number of paths to column j of the row we are on\n    row = [1] * n  # top row: only one path, all moves to the right\n    for _ in range(1, m):\n        for j in range(1, n):\n            # row[j] still holds the count from the cell above; row[j - 1] is the cell to the left\n            row[j] = row[j] + row[j - 1]\n    return row[n - 1]",
     "st": {
      "p": "A robot starts in the top-left corner of a grid with `m` rows and `n` columns and wants to reach the bottom-right corner. Return the number of distinct paths it can take if it moves only right or down, one cell at a time.\n\nA 1 by 1 grid has one path, since the robot starts where it needs to end.",
      "ex": [
       {
        "i": "m = 3, n = 7",
        "o": "28",
        "why": "3 rows and 7 columns give 28 right-or-down paths"
       },
       {
        "i": "m = 1, n = 1",
        "o": "1",
        "why": "edge case: a single cell needs no moves, so there is exactly one path"
       }
      ],
      "k": [
       "m, n >= 1",
       "Aim for O(m x n) time and O(n) space"
      ]
     }
    },
    {
     "n": "Word break",
     "ex": {
      "i": "\"leetcode\", [\"leet\", \"code\"]",
      "o": "True",
      "w": "\"leet\" + \"code\""
     },
     "t": "A prefix can be split if it ends in a word and what comes before that word can also be split. How would you record that for every prefix length?",
     "code": "def word_break(s, words):\n    word_set = set(words)  # a set answers \"is this a word?\" quickly\n    # ok[i]: can the first i characters of s be split into words?\n    ok = [True] + [False] * len(s)  # zero characters need no words\n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            # s[:j] can be split and s[j:i] is a word, so s[:i] can be split\n            if ok[j] and s[j:i] in word_set:\n                ok[i] = True\n                break  # one way is enough\n    return ok[len(s)]",
     "st": {
      "p": "Given a string `s` and a list of strings `words`, return whether `s` can be split into a sequence of words from `words`.\n\nA word may be used any number of times. An empty `s` can be split, since it needs no words.",
      "ex": [
       {
        "i": "s = \"leetcode\", words = [\"leet\", \"code\"]",
        "o": "True",
        "why": "\"leetcode\" splits into \"leet\" and \"code\""
       },
       {
        "i": "s = \"\", words = [\"a\", \"b\"]",
        "o": "True",
        "why": "edge case: an empty string needs no words, so it can be split"
       }
      ],
      "k": [
       "Aim for O(n^2) time for a string of length n",
       "O(n) space"
      ]
     }
    },
    {
     "n": "0/1 knapsack",
     "ex": {
      "i": "weights [1, 3, 4], values [15, 20, 30], capacity 4",
      "o": "35",
      "w": "items 1 and 3"
     },
     "t": "Let dp[c] be the best value for capacity c. When you add an item, which older entries may it build on, and why must you not use entries you have already updated for this item?",
     "code": "def knapsack(wts, vals, cap):\n    # dp[c]: best value that fits in capacity c, using the items seen so far\n    dp = [0] * (cap + 1)  # no items yet, so every capacity is worth 0\n    for w, v in zip(wts, vals):\n        # go from the largest capacity down, so dp[c - w] still excludes this item\n        for c in range(cap, w - 1, -1):\n            # either leave the item, or take it on top of the best for the room left\n            dp[c] = max(dp[c], dp[c - w] + v)\n    return dp[cap]",
     "st": {
      "p": "You are given `wts`, the weight of each item, `vals`, the value of each item, and a knapsack that holds at most `cap` weight. Return the largest total value you can carry.\n\nEach item can be taken at most once. An item heavier than `cap` can never be taken.",
      "ex": [
       {
        "i": "wts = [1, 3, 4], vals = [15, 20, 30], cap = 4",
        "o": "35",
        "why": "the items of weight 1 and 3 together weigh 4 and are worth 15 + 20 = 35"
       },
       {
        "i": "wts = [5], vals = [10], cap = 4",
        "o": "0",
        "why": "edge case: the only item is heavier than the knapsack holds, so nothing fits"
       }
      ],
      "k": [
       "weights and values are non-negative",
       "Aim for O(len(wts) x cap) time and O(cap) space"
      ]
     }
    }
   ],
   "spot": "Count the ways, min or max cost, choices that overlap. <b>Signal:</b> 'how many ways', 'minimum cost', and a brute force that repeats work.",
   "cx": "States times transitions; memoisation turns exponential into polynomial.",
   "tpl": "# memo: i -> best result from position i onward (filled as we go)\nmemo = {}\n\ndef best(i):\n    if i >= n:\n        return 0\n    if i in memo:\n        return memo[i]  # already solved, reuse it\n    memo[i] = max(take(i) + best(i + 2), best(i + 1))\n    return memo[i]\n",
   "probs": [
    {
     "n": "Climbing stairs",
     "ex": {
      "i": "n = 5, steps of 1 or 2",
      "o": "8",
      "w": "ways(n) = ways(n - 1) + ways(n - 2)"
     },
     "l": "easy",
     "task": "Ways to climb n steps taking 1 or 2 at a time.",
     "hint": "Think about the last move: you reached step n from step n - 1 or from step n - 2. How do the ways to reach those two steps add up?",
     "sol": "def climb(n):\n    # prev: ways to reach step i, cur: ways to reach step i + 1 (we start at i = 0)\n    prev, cur = 1, 1\n    for _ in range(n):\n        # the last move was 1 step from the step before, or 2 steps from the one before that\n        nxt = prev + cur\n        prev = cur\n        cur = nxt\n    # after n rounds, i has reached step n\n    return prev",
     "c": "O(n) time: one addition per step. O(1) space: only the last two counts are kept.",
     "st": {
      "p": "Given an integer `n`, the number of steps in a staircase, return the number of distinct ways to climb to the top when each move is 1 or 2 steps.\n\nTwo ways differ if their sequences of moves differ. With `n = 0` you are already at the top, so there is exactly one way: take no steps.",
      "ex": [
       {
        "i": "n = 5",
        "o": "8",
        "why": "eight different sequences of 1s and 2s add up to 5 steps"
       },
       {
        "i": "n = 0",
        "o": "1",
        "why": "edge case: you are already at the top, so the one way is to take no steps"
       }
      ],
      "k": [
       "n >= 0",
       "Aim for O(n) time and O(1) extra space"
      ]
     }
    },
    {
     "n": "House robber",
     "ex": {
      "i": "[2, 7, 9, 3, 1]",
      "o": "12",
      "w": "2 + 9 + 1, never two neighbours"
     },
     "l": "medium",
     "task": "Max sum without taking two adjacent houses.",
     "hint": "At each house you either rob it and add the best total from two houses back, or skip it. What two numbers do you need to carry along as you walk down the street?",
     "sol": "def rob(nums):\n    # take: best total so far if we robbed the latest house\n    # skip: best total so far if we did not rob the latest house\n    take, skip = 0, 0\n    for x in nums:\n        # robbing this house is only allowed if the previous one was skipped\n        new_take = skip + x\n        # skipping this house keeps the better of the two earlier outcomes\n        new_skip = max(take, skip)\n        take = new_take\n        skip = new_skip\n    return max(take, skip)",
     "c": "O(n) time: one step per house. O(1) space: two running totals.",
     "st": {
      "p": "Given a list `nums` where `nums[i]` is the cash in house `i`, return the most cash you can steal in one night.\n\nYou cannot rob two houses next to each other. An empty list has nothing to steal.",
      "ex": [
       {
        "i": "nums = [2, 7, 9, 3, 1]",
        "o": "12",
        "why": "houses 0, 2 and 4 give 2 + 9 + 1 = 12, and no allowed choice gives more"
       },
       {
        "i": "nums = []",
        "o": "0",
        "why": "edge case: no houses means nothing to steal"
       }
      ],
      "k": [
       "amounts are non-negative",
       "Aim for O(n) time and O(1) extra space"
      ]
     }
    },
    {
     "n": "Coin change",
     "ex": {
      "i": "coins = [1, 2, 5], amount = 11",
      "o": "3",
      "w": "5 + 5 + 1"
     },
     "l": "medium",
     "task": "Fewest coins to make an amount, or -1.",
     "hint": "Suppose you already knew the fewest coins for every smaller amount. Which coin would be the last one you add to reach the current amount?",
     "sol": "def coin_change(coins, amount):\n    INF = amount + 1  # more coins than could ever be needed, so it means \"unreachable\"\n    # dp[a]: fewest coins that make exactly a\n    dp = [0] + [INF] * amount  # zero coins make 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                # use coin c last: the rest, a - c, was already solved\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    if dp[amount] == INF:\n        return -1  # no combination reached the amount\n    return dp[amount]",
     "c": "O(amount x coins) time: each amount tries each coin once. O(amount) space for the table.",
     "st": {
      "p": "Given a list of coin values `coins` and an integer `amount`, return the fewest coins that add up to exactly `amount`.\n\nYou have an unlimited supply of each coin value. If no combination makes the amount, return -1.",
      "ex": [
       {
        "i": "coins = [1, 2, 5], amount = 11",
        "o": "3",
        "why": "5 + 5 + 1 = 11 uses 3 coins, and no 2 coins make 11"
       },
       {
        "i": "coins = [2], amount = 3",
        "o": "-1",
        "why": "edge case: a single coin of 2 only reaches even amounts, and 3 is odd"
       }
      ],
      "k": [
       "coin values are positive integers, amount is non-negative",
       "Aim for O(amount x len(coins)) time and O(amount) space"
      ]
     },
     "first": {
      "label": "First idea, O(coins^amount)",
      "note": "Try every coin as the next one and solve what is left, over and over. The same remaining amount is solved many times. What if you stored the answer for each amount, smallest first?",
      "code": "def coin_change(coins, amount):\n    # fewest coins that make exactly `left`, or -1 if impossible\n    def fewest(left):\n        if left == 0:\n            return 0  # nothing left to make\n        best = -1\n        for c in coins:\n            if c <= left:\n                # take coin c, then solve what remains from scratch\n                sub = fewest(left - c)\n                if sub != -1 and (best == -1 or sub + 1 < best):\n                    best = sub + 1\n        return best\n    return fewest(amount)"
     }
    },
    {
     "n": "Longest common subsequence",
     "ex": {
      "i": "\"abcde\" and \"ace\"",
      "o": "3",
      "w": "\"ace\""
     },
     "l": "medium",
     "task": "Length of the longest subsequence common to two strings.",
     "hint": "Look at the last characters of the first i letters of a and the first j letters of b. If they are equal, what happens to the answer? If not, which smaller pair of prefixes should you look at?",
     "sol": "def lcs(a, b):\n    # dp[i][j]: longest common subsequence of the first i characters of a and the first j of b\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]  # row 0 and column 0 stay 0: one side is empty\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                # the last characters match, so keep them and extend the shorter pair\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                # no match: drop the last character of a, or of b, and keep the better result\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[len(a)][len(b)]",
     "c": "O(n x m) time and space: one table cell per pair of prefixes.",
     "st": {
      "p": "Given two strings `a` and `b`, return the length of their longest common subsequence.\n\nA subsequence keeps the original order of the characters but may skip some. Either string may be empty.",
      "ex": [
       {
        "i": "a = \"abcde\", b = \"ace\"",
        "o": "3",
        "why": "\"ace\" appears in order in both strings"
       },
       {
        "i": "a = \"\", b = \"abc\"",
        "o": "0",
        "why": "edge case: an empty string shares no characters with anything"
       }
      ],
      "k": [
       "Aim for O(n x m) time and space for strings of length n and m",
       "n and m are the lengths of a and b"
      ]
     },
     "first": {
      "label": "First idea, O(2^(n+m))",
      "note": "At each mismatch, try dropping a character from a and from b, and follow both. The same pair of positions is solved again and again. What if you stored the answer for each pair (i, j)?",
      "code": "def lcs(a, b):\n    # longest common subsequence of a[i:] and b[j:]\n    def go(i, j):\n        if i == len(a) or j == len(b):\n            return 0  # one string is used up\n        if a[i] == b[j]:\n            return 1 + go(i + 1, j + 1)  # equal characters: keep both\n        # different: skip a character of a, or of b, and take the better result\n        return max(go(i + 1, j), go(i, j + 1))\n    return go(0, 0)"
     }
    }
   ],
   "g": "techniques"
  },
  {
   "id": "backtrack",
   "title": "Backtracking",
   "group": "Techniques",
   "ex": {
    "i": "[1, 2, 3]",
    "o": "8 subsets",
    "w": "each number is in or out"
   },
   "sheet": {
    "spot": "Every subset, permutation or combination; n small.",
    "move": "Choose, recurse, undo.",
    "code": "def go(i, path):\n    if i == len(a):\n        out.append(path[:]); return\n    go(i + 1, path)            # skip\n    path.append(a[i])          # take\n    go(i + 1, path)\n    path.pop()                 # undo",
    "notes": [
     "Copy the path when you save it.",
     "Sort and skip duplicates; prune early.",
     "O(2<sup>n</sup>) subsets, O(n!) permutations."
    ]
   },
   "vars": [
    {
     "n": "Combination sum",
     "ex": {
      "i": "[2, 3, 6, 7], target = 7",
      "o": "[[2, 2, 3], [7]]",
      "w": "numbers can repeat"
     },
     "t": "After choosing a number you may choose it again. How do you stop the same combination showing up in two orders, and when do you stop going deeper?",
     "code": "def combination_sum(cands, target):\n    out = []  # every combination that reached the target\n    def go(i, path, left):\n        # path: numbers chosen so far; left: how much is still needed\n        # i: only candidates from index i on may be chosen, so no combination repeats in another order\n        if left == 0:\n            out.append(path[:])  # a copy, because path keeps changing\n            return\n        for j in range(i, len(cands)):\n            if cands[j] <= left:  # a bigger number would overshoot\n                path.append(cands[j])\n                go(j, path, left - cands[j])  # j, not j + 1: the same number may be used again\n                path.pop()  # undo this choice\n    go(0, [], target)\n    return out",
     "st": {
      "p": "Given a list of distinct positive integers `cands` and an integer `target`, return all unique combinations of `cands` that add up to `target`.\n\nThe same number may be used any number of times. Two combinations are the same if they hold the same numbers, in whatever order. If none reaches `target`, return an empty list.",
      "ex": [
       {
        "i": "cands = [2, 3, 6, 7], target = 7",
        "o": "[[2, 2, 3], [7]]",
        "why": "2 + 2 + 3 and 7 both add up to 7, and no other combination does"
       },
       {
        "i": "cands = [2], target = 3",
        "o": "[]",
        "why": "edge case: a single even number only reaches even sums, and 3 is odd"
       }
      ],
      "k": [
       "candidates and target are positive integers",
       "The number of combinations can grow exponentially"
      ]
     }
    },
    {
     "n": "Subsets with duplicates",
     "ex": {
      "i": "[1, 2, 2]",
      "o": "6 subsets",
      "w": "[2] and [1, 2] only once"
     },
     "t": "Equal numbers should be treated as the same choice. How can you arrange the input so that, at one step, you can skip a number equal to the one before it?",
     "code": "def subsets_dup(nums):\n    nums = sorted(nums)  # equal numbers now sit next to each other\n    out = []  # every distinct subset\n    def go(i, path):\n        # every path is a subset, so record it on arrival\n        out.append(path[:])\n        for j in range(i, len(nums)):\n            # an equal number was already tried first at this step, so this branch would repeat it\n            if j > i and nums[j] == nums[j - 1]:\n                continue\n            path.append(nums[j])\n            go(j + 1, path)  # j + 1: each position is used at most once\n            path.pop()  # undo this choice\n    go(0, [])\n    return out",
     "st": {
      "p": "Given a list of integers `nums` that may contain duplicates, return all distinct subsets.\n\nNo subset may appear twice, even if it can be built from different positions. The subsets may come in any order.",
      "ex": [
       {
        "i": "nums = [1, 2, 2]",
        "o": "[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]",
        "why": "6 distinct subsets: [2] and [1, 2] each appear once even though 2 occurs twice"
       },
       {
        "i": "nums = []",
        "o": "[[]]",
        "why": "edge case: an empty list still has one subset, the empty one"
       }
      ],
      "k": [
       "Aim for O(n x 2^n) time in the worst case",
       "nums may be in any order"
      ]
     }
    },
    {
     "n": "Generate parentheses",
     "ex": {
      "i": "n = 3",
      "o": "5 strings",
      "w": "\"((()))\", \"(()())\", ..."
     },
     "t": "Build the string left to right. When is it still safe to add an opening bracket, and when is a closing bracket allowed?",
     "code": "def gen_parens(n):\n    out = []  # every well-formed string\n    def go(s, opened, closed):\n        # s: the string built so far; opened and closed count the brackets in it\n        if len(s) == 2 * n:\n            out.append(s)  # all 2n characters placed, and the rules kept it balanced\n            return\n        if opened < n:\n            go(s + \"(\", opened + 1, closed)  # an opener is fine while some are left\n        if closed < opened:\n            go(s + \")\", opened, closed + 1)  # a closer needs an unmatched opener\n    go(\"\", 0, 0)\n    return out",
     "st": {
      "p": "Given an integer `n`, the number of pairs of parentheses, return all well-formed strings made of `n` pairs.\n\nA string is well-formed when every closing bracket matches an earlier opening bracket and the two counts are equal at the end. The strings may come in any order.",
      "ex": [
       {
        "i": "n = 3",
        "o": "[\"((()))\", \"(()())\", \"(())()\", \"()(())\", \"()()()\"]",
        "why": "the 5 well-formed strings for 3 pairs (the 3rd Catalan number); any order is accepted"
       },
       {
        "i": "n = 0",
        "o": "[\"\"]",
        "why": "edge case: zero pairs gives exactly one string, the empty one"
       }
      ],
      "k": [
       "O(4^n / sqrt(n)) strings are generated, each built in O(n)",
       "n counts pairs, so each string has 2n characters"
      ]
     }
    }
   ],
   "spot": "Generate all combinations, subsets or permutations. <b>Signal:</b> 'all possible', small n.",
   "cx": "Exponential, O(2^n) or O(n!); fine for n up to about 20.",
   "tpl": "def backtrack(path, choices):\n    if done(path):\n        out.append(path[:])\n        return\n    for c in choices:\n        path.append(c)\n        backtrack(path, next_choices(c))\n        path.pop()              # undo",
   "probs": [
    {
     "n": "Subsets",
     "ex": {
      "i": "[1, 2, 3]",
      "o": "8 subsets",
      "w": "[], [1], [2], [3], [1, 2], ..."
     },
     "l": "medium",
     "task": "All subsets of distinct numbers.",
     "hint": "For each number there are two choices: it is in the subset or it is not. How can you make those choices one number at a time, and undo each one when you step back?",
     "sol": "def subsets(nums):\n    out = []  # every finished subset\n    def go(i, path):\n        # path holds the choices made so far; i is the next number to decide on\n        if i == len(nums):\n            out.append(path[:])  # a copy, because path keeps changing\n            return\n        go(i + 1, path)  # first branch: leave nums[i] out\n        path.append(nums[i])  # second branch: put nums[i] in\n        go(i + 1, path)\n        path.pop()  # undo, so the caller sees path as it was\n    go(0, [])\n    return out",
     "c": "O(n x 2^n): 2^n subsets, each copied in O(n) time. Space is the same for the output.",
     "st": {
      "p": "Given a list of distinct integers `nums`, return all of its subsets, including the empty subset and `nums` itself.\n\nThe subsets may come in any order.",
      "ex": [
       {
        "i": "nums = [1, 2, 3]",
        "o": "[[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]",
        "why": "2^3 = 8 subsets; any order is accepted"
       },
       {
        "i": "nums = []",
        "o": "[[]]",
        "why": "edge case: an empty list still has one subset, the empty one"
       }
      ],
      "k": [
       "Aim for O(n x 2^n) time and space",
       "nums has no duplicate values"
      ]
     }
    },
    {
     "n": "Permutations",
     "ex": {
      "i": "[1, 2, 3]",
      "o": "6 orderings",
      "w": "[1, 2, 3], [1, 3, 2], ..."
     },
     "l": "medium",
     "task": "All orderings of distinct numbers.",
     "hint": "Build an ordering one position at a time. Which numbers are still free to place next, and how do you give one back when you step back?",
     "sol": "def permutations(nums):\n    out = []  # every finished ordering\n    used = [False] * len(nums)  # used[i]: is nums[i] already in the current path?\n    def go(path):\n        if len(path) == len(nums):\n            out.append(path[:])  # a copy, because path keeps changing\n            return\n        for i in range(len(nums)):\n            if not used[i]:  # a number can appear only once per ordering\n                used[i] = True\n                path.append(nums[i])\n                go(path)\n                path.pop()  # undo: take the number back out\n                used[i] = False  # and free it for other orderings\n    go([])\n    return out",
     "c": "O(n x n!): n! orderings, each copied in O(n) time. Space is the same for the output.",
     "st": {
      "p": "Given a list of distinct integers `nums`, return all possible orderings of its elements.\n\nThe orderings may come in any order.",
      "ex": [
       {
        "i": "nums = [1, 2, 3]",
        "o": "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
        "why": "3! = 6 orderings; any order is accepted"
       },
       {
        "i": "nums = []",
        "o": "[[]]",
        "why": "edge case: an empty list has exactly one ordering, the empty one"
       }
      ],
      "k": [
       "Aim for O(n x n!) time and space",
       "nums has no duplicate values"
      ]
     },
     "alt": {
      "note": "Same orderings from the library: `itertools.permutations` yields them in this order as tuples.",
      "code": "from itertools import permutations as _perms\n\ndef permutations(nums):\n    return [list(p) for p in _perms(nums)]"
     }
    }
   ],
   "g": "techniques"
  },
  {
   "id": "concurrency",
   "title": "Concurrency: threads and asyncio",
   "group": "Techniques",
   "ex": {
    "i": "20 fetches of 0.1 s, at most 5 at once",
    "o": "about 0.4 s",
    "w": "the waits overlap; never more than 5 in flight"
   },
   "sheet": {
    "spot": "Many slow calls at once, shared state, a cap on load.",
    "move": "Lock the check and the write; cap with a Semaphore.",
    "code": "sem = asyncio.Semaphore(5)\nasync def one(k):\n    async with sem:     # cap the call\n        return await fetch(k)\nawait asyncio.gather(*map(one, ks))",
    "notes": [
     "<b>Pick:</b> I/O waits, threads or asyncio; CPU work, processes (the GIL).",
     "<b>Start and wait:</b> <code>t.start()</code> and <code>t.join()</code>; <code>pool.submit</code> and <code>f.result()</code>; <code>create_task</code> and <code>await</code>. A bare <code>fetch(k)</code> with no await never runs.",
     "<b>Race:</b> check-then-act and <code>n += 1</code> are not atomic. In asyncio the gap is any <code>await</code> between the check and the write.",
     "<b>Lock:</b> around the check and the write, never across slow I/O. One lock per key, so other keys do not wait. Two locks: one global order.",
     "<b>Cap and order:</b> <code>Semaphore(n)</code> around the slow call, or a bounded <code>Queue</code> with n workers. <code>map</code> and <code>gather</code> keep input order; <code>as_completed</code> does not.",
     "<b>Single-flight:</b> one shared Future or Task per key. <b>Stop:</b> <code>wait_for</code> for a deadline; re-raise <code>CancelledError</code>; <code>to_thread</code> for a blocking call."
    ]
   },
   "vars": [
    {
     "n": "Thread-safe counter",
     "ex": {
      "i": "8 threads each call add() 1,000 times",
      "o": "value is 8000",
      "w": "the lock makes read, add, write one step"
     },
     "t": "Guard the read-modify-write with a lock; `+=` is three steps, not one.",
     "code": "import threading\n\nclass Counter:\n    def __init__(self):\n        self.value = 0\n        self._lock = threading.Lock()\n\n    def add(self, n=1):\n        with self._lock:          # read, add and write as one step\n            self.value += n",
     "st": {
      "p": "Implement a `Counter` with `add(n=1)` and a `value` attribute. Many threads call `add` at the same time.\n\nWhen they all finish, `value` must equal the sum of everything that was added.",
      "ex": [
       {
        "i": "8 threads each call `add()` 1,000 times",
        "o": "`value` is 8000",
        "why": "every update is applied exactly once, so 8 x 1,000 = 8000"
       },
       {
        "i": "`add(5)` called once on a new counter",
        "o": "`value` is 5",
        "why": "one thread, no one to compete with: the result is the amount added"
       }
      ],
      "k": [
       "any number of threads may call add",
       "threads must wait on each other for as short a time as possible"
      ]
     }
    },
    {
     "n": "Cache that loads each key once (threads)",
     "ex": {
      "i": "5 threads call get('u1') at once",
      "o": "load runs once; all 5 get its value",
      "w": "four wait on the key's lock, then find the value"
     },
     "t": "Check, lock that key, check again; the slow load holds only that key's lock.",
     "code": "import threading\n\nclass Cache:\n    def __init__(self, load):\n        self._load, self._data, self._locks = load, {}, {}\n\n    def get(self, key):\n        if key in self._data:                       # fast path: no lock\n            return self._data[key]\n        with self._locks.setdefault(key, threading.Lock()):    # one lock per key\n            if key not in self._data:               # check again: a waiter finds it loaded\n                self._data[key] = self._load(key)   # slow call holds only this key's lock\n            return self._data[key]",
     "st": {
      "p": "Implement `Cache(load)` with `get(key)`. The first call for a key runs `load(key)`, which is slow, and stores the result. Later calls for that key return the stored value.\n\nMany threads ask at once. `load` must run only once per key, and a slow load for one key must not make a thread asking for another key wait.",
      "ex": [
       {
        "i": "5 threads call `get('u1')` together; `load` takes 0.1 s",
        "o": "`load` runs once, all five get its value",
        "why": "four of the threads arrive while the value loads, and each finds it stored when it is their turn"
       },
       {
        "i": "3 threads call `get('a')`, `get('b')` and `get('c')`; each load takes 0.1 s",
        "o": "about 0.1 s in total",
        "why": "the three keys do not depend on each other, so the three loads run at the same time"
       }
      ],
      "k": [
       "a load that raises stores nothing; the next call tries again",
       "a thread reading a key that is already stored must not wait for other threads"
      ]
     }
    },
    {
     "n": "Results in order, or as they finish",
     "ex": {
      "i": "delays a 0.3 s, b 0.1 s, c 0.2 s",
      "o": "map: a, b, c. as_completed: b, c, a",
      "w": "map keeps input order"
     },
     "t": "`pool.map` yields in input order; `as_completed` yields whichever finishes first.",
     "code": "from concurrent.futures import ThreadPoolExecutor, as_completed\n\ndef fetch_all(keys, fetch, workers=8):\n    with ThreadPoolExecutor(workers) as pool:\n        return list(pool.map(fetch, keys))                  # input order\n\ndef fetch_ready_first(keys, fetch, workers=8):\n    with ThreadPoolExecutor(workers) as pool:\n        futures = {pool.submit(fetch, k): k for k in keys}\n        return [(futures[f], f.result()) for f in as_completed(futures)]   # fastest first",
     "st": {
      "p": "Implement `fetch_all(keys, fetch)`, which returns `fetch(key)` for every key in the order of `keys`, and `fetch_ready_first(keys, fetch)`, which returns `(key, result)` pairs in the order the fetches finish.\n\nThe fetches are slow and must overlap. If a fetch raises, the exception must reach the caller.",
      "ex": [
       {
        "i": "keys a, b, c where `fetch` sleeps 0.3, 0.1 and 0.2 s",
        "o": "`fetch_all` gives a, b, c; `fetch_ready_first` gives b, c, a",
        "why": "`fetch_all` follows the order of `keys`; `fetch_ready_first` follows the finishing times, 0.1 s, 0.2 s, 0.3 s"
       },
       {
        "i": "keys a, b where `fetch('b')` raises ValueError",
        "o": "both functions raise ValueError",
        "why": "the worker's exception is raised again in the caller when its result is asked for"
       }
      ],
      "k": [
       "eight fetches run at a time by default",
       "no worker threads are left running when the function returns"
      ]
     }
    },
    {
     "n": "Two locks without deadlock",
     "ex": {
      "i": "thread 1 moves a to b while thread 2 moves b to a",
      "o": "both finish; the total is unchanged",
      "w": "both take the lower id's lock first"
     },
     "t": "Take locks in one global order, so no thread waits on a lock held by a thread that waits on yours.",
     "code": "import threading\n\nclass Account:\n    def __init__(self, id, balance):\n        self.id, self.balance, self.lock = id, balance, threading.Lock()\n\ndef transfer(src, dst, amount):\n    if src is dst:\n        return False\n    first, second = sorted((src, dst), key=lambda a: a.id)   # one global order\n    with first.lock, second.lock:\n        if src.balance < amount:\n            return False\n        src.balance -= amount\n        dst.balance += amount\n        return True",
     "st": {
      "p": "Implement `transfer(src, dst, amount)` for `Account` objects that each have an `id`, a `balance` and a `lock`. It moves the money and returns True if `src` has enough, otherwise it returns False and changes nothing.\n\nMany threads transfer in both directions at once, so two transfers can need the same two locks. Never deadlock, and never lose or create money.",
      "ex": [
       {
        "i": "`transfer(a, b, 30)` and `transfer(b, a, 10)` run at once; a holds 100 and b holds 50",
        "o": "both return True; a ends at 80, b at 70",
        "why": "both threads take the lower id first, so neither can hold a lock the other is waiting for"
       },
       {
        "i": "`transfer(a, b, 500)` when a holds 100",
        "o": "False, balances unchanged",
        "why": "the balance is read while both accounts are held, so it is the true balance"
       }
      ],
      "k": [
       "a transfer from an account to itself does nothing and returns False",
       "the balance check and both updates cannot be interleaved with another transfer"
      ]
     }
    },
    {
     "n": "A bounded queue with N workers (asyncio)",
     "ex": {
      "i": "20 items, 3 workers, a queue of 5",
      "o": "results in input order, at most 3 running",
      "w": "put waits when the queue is full"
     },
     "t": "A bounded `Queue` is the cap and the backpressure; N workers pull from it.",
     "code": "import asyncio\n\nasync def run_pipeline(items, work, workers=3, size=10):\n    q = asyncio.Queue(maxsize=size)\n    out = [None] * len(items)\n\n    async def worker():\n        while True:\n            i, item = await q.get()\n            try:\n                out[i] = await work(item)\n            except Exception as exc:\n                out[i] = exc                  # one bad item must not kill the worker\n            finally:\n                q.task_done()\n\n    tasks = [asyncio.create_task(worker()) for _ in range(workers)]\n    for pair in enumerate(items):\n        await q.put(pair)                     # waits when the queue is full: backpressure\n    await q.join()                            # every item has been processed\n    for t in tasks:\n        t.cancel()\n    await asyncio.gather(*tasks, return_exceptions=True)\n    return out",
     "st": {
      "p": "Implement `async run_pipeline(items, work, workers=3, size=10)`. A producer feeds the items into a queue that holds at most `size` items. `workers` tasks take items from it, `await work(item)` and store the result at the item's index.\n\nReturn the results in input order. If `work` raises for an item, store the exception object in its place and carry on. When every item is done, the workers must stop.",
      "ex": [
       {
        "i": "`items` 0 to 5, `work` squares after a short sleep, 2 workers",
        "o": "`[0, 1, 4, 9, 16, 25]`",
        "why": "each result goes to its own index, so the order the workers finish in does not matter"
       },
       {
        "i": "`work` raises ValueError for item 3",
        "o": "index 3 holds the ValueError, the rest are normal results",
        "why": "each worker catches the error for that one item and moves on to the next"
       }
      ],
      "k": [
       "the producer waits when the queue is full",
       "cancelling is how the workers are stopped, so a cancel must not be swallowed"
      ]
     }
    },
    {
     "n": "Timeout and cancellation (asyncio)",
     "ex": {
      "i": "fetch takes 1 s, timeout 0.05 s",
      "o": "None; the fetch was cancelled",
      "w": "wait_for cancels the inner work"
     },
     "t": "`wait_for` cancels the work on timeout; a task that catches `CancelledError` cleans up and re-raises.",
     "code": "import asyncio\n\nasync def fetch_or_none(fetch, key, seconds):\n    try:\n        return await asyncio.wait_for(fetch(key), seconds)   # cancels fetch on timeout\n    except asyncio.TimeoutError:\n        return None\n\nasync def worker(job, log):\n    try:\n        await job()\n    except asyncio.CancelledError:\n        log.append(\"cleanup\")        # undo partial work\n        raise                        # never swallow a cancel",
     "st": {
      "p": "Implement `async fetch_or_none(fetch, key, seconds)`: await `fetch(key)`, but give up after `seconds` and return None, leaving no work running.\n\nThen implement `async worker(job, log)`: it awaits `job()`. If it is cancelled, it appends `'cleanup'` to `log` and the cancellation must still reach whoever cancelled it.",
      "ex": [
       {
        "i": "`fetch` sleeps 1 s, `seconds` is 0.05",
        "o": "None",
        "why": "the fetch is cancelled when the time runs out, so nothing keeps running"
       },
       {
        "i": "a task running `worker(job, log)` is cancelled",
        "o": "`log` is `['cleanup']` and awaiting the task raises CancelledError",
        "why": "the cleanup runs and the cancel is raised again, so the caller still sees it"
       }
      ],
      "k": [
       "a cancel must never be swallowed",
       "a timeout raises `TimeoutError` on Python 3.11 and up, `asyncio.TimeoutError` before; `asyncio.TimeoutError` matches both"
      ]
     }
    },
    {
     "n": "Async retry with a timeout per try",
     "ex": {
      "i": "an op that raises Transient twice, then returns 'ok'",
      "o": "'ok' on the third try",
      "w": "waits up to 0.1 s, then up to 0.2 s"
     },
     "t": "Time each try out separately; back off with jitter; retry only errors that can succeed later.",
     "code": "import asyncio, random\n\nclass Transient(Exception):\n    pass\n\nasync def call_with_retry(op, attempts=4, base=0.1, cap=1.0, per_try=0.5, sleep=asyncio.sleep):\n    for n in range(1, attempts + 1):\n        try:\n            return await asyncio.wait_for(op(), per_try)\n        except (Transient, asyncio.TimeoutError):       # retry only what can succeed later\n            if n == attempts:\n                raise\n            await sleep(random.random() * min(cap, base * 2 ** (n - 1)))   # full jitter",
     "st": {
      "p": "Implement `async call_with_retry(op, attempts=4, base=0.1, cap=1.0, per_try=0.5, sleep=asyncio.sleep)`. It awaits `op()` and gives each try at most `per_try` seconds.\n\nIf a try raises `Transient` or times out, wait a random time between 0 and `min(cap, base * 2**(n-1))` after try n, then try again, up to `attempts` tries; after the last one, raise the error. Any other exception is raised at once, without a retry.",
      "ex": [
       {
        "i": "`op` raises `Transient` twice, then returns 'ok'",
        "o": "'ok', after 3 calls",
        "why": "the first two tries fail with a retryable error, and the third succeeds"
       },
       {
        "i": "`op` raises ValueError",
        "o": "ValueError after 1 call",
        "why": "a bad request will fail the same way again, so retrying only wastes time"
       }
      ],
      "k": [
       "`sleep` is passed in, so that a caller can replace the real wait",
       "the wait is a random time up to the ceiling, not the ceiling itself"
      ]
     }
    },
    {
     "n": "Blocking calls inside async code",
     "ex": {
      "i": "5 calls to a function that sleeps 0.1 s",
      "o": "about 0.1 s in total",
      "w": "to_thread runs each in a pool thread"
     },
     "t": "A blocking call freezes the whole loop; hand it to a thread (I/O) or a process (CPU).",
     "code": "import asyncio, time\n\ndef blocking_read(path):              # a sync library call: it would freeze the loop\n    time.sleep(0.1)\n    return path.upper()\n\nasync def read_all(paths):\n    return await asyncio.gather(*(asyncio.to_thread(blocking_read, p) for p in paths))",
     "st": {
      "p": "A synchronous library function `blocking_read(path)` takes 0.1 s and cannot be rewritten as async. Implement `async read_all(paths)` that reads every path so that the reads overlap and the event loop stays free for other tasks.\n\nReturn the results in input order.",
      "ex": [
       {
        "i": "5 paths",
        "o": "5 results in about 0.1 s",
        "why": "the five reads wait at the same time, so the total is about one read"
       },
       {
        "i": "calling `blocking_read` directly inside a coroutine",
        "o": "every other task stops for 0.1 s",
        "why": "the loop is stuck for the whole read, so nothing else can run in the meantime"
       }
      ],
      "k": [
       "`asyncio.to_thread` needs Python 3.9 or newer",
       "work that is limited by the processor, not by waiting, gains nothing from threads: they share one interpreter lock"
      ]
     }
    }
   ],
   "spot": "Run slow calls at the same time without corrupting shared state. Four questions settle most of it: where does each thread or task <b>start</b>, where does it <b>wait</b>, what is <b>shared</b>, and what <b>caps</b> the work. <b>Signal:</b> 'fetch in parallel', 'at most N at a time', 'two requests, one load', 'make it thread-safe', or a shared dict next to a sleep or an await.",
   "cx": "I/O waits overlap; CPU work does not (the GIL): 100 calls of 0.2 s on 10 workers take about 2 s.",
   "tpl": "import asyncio\n\nclass Fetcher:\n    def __init__(self, fetch, limit=5):\n        self._fetch = fetch                      # async def fetch(key)\n        self._sem = asyncio.Semaphore(limit)     # cap: at most `limit` calls in flight\n        self._inflight = {}                      # key -> Task: single-flight\n        self._locks = {}                         # key -> Lock: one writer at a time\n        self.cache = {}\n\n    async def _load(self, key):\n        async with self._sem:                    # the cap wraps only the slow call\n            value = await self._fetch(key)\n        self.cache[key] = value                  # one writer for loads: the task itself\n        return value\n\n    async def get(self, key):\n        if key in self.cache:\n            return self.cache[key]\n        task = self._inflight.get(key)\n        if task is None:                         # no await between this check and the store\n            task = self._inflight[key] = asyncio.create_task(self._load(key))\n            task.add_done_callback(lambda _: self._inflight.pop(key, None))\n        return await asyncio.shield(task)        # a caller that times out must not cancel the load\n\n    async def update(self, key, change):         # read, change, write: one at a time per key\n        async with self._locks.setdefault(key, asyncio.Lock()):\n            self.cache[key] = await change(await self.get(key))",
   "probs": [
    {
     "n": "Print in order (LeetCode 1114)",
     "ex": {
      "i": "threads call third(), second(), first()",
      "o": "firstsecondthird",
      "w": "second and third wait for their turn"
     },
     "l": "easy",
     "task": "Make three methods run in order, whichever thread calls first.",
     "hint": "Each method needs to know that the one before it has finished. What could `second` wait on, and who tells it the wait is over?",
     "sol": "import threading\n\nclass Foo:\n    def __init__(self):\n        self._one, self._two = threading.Event(), threading.Event()\n\n    def first(self, print_first):\n        print_first()\n        self._one.set()\n\n    def second(self, print_second):\n        self._one.wait()          # blocks until first has printed\n        print_second()\n        self._two.set()\n\n    def third(self, print_third):\n        self._two.wait()\n        print_third()",
     "c": "O(1) per call; each method waits once on an event, no spinning.",
     "st": {
      "p": "Implement the class `Foo` with three methods, `first(print_first)`, `second(print_second)` and `third(print_third)`. Three different threads each call one of the methods, in any order, and each method calls the function it is given.\n\nThe output must always be `first`, `second`, `third`, in that order, whichever method is called first.",
      "ex": [
       {
        "i": "the threads call `third`, `second`, `first`, in that order",
        "o": "firstsecondthird",
        "why": "`third` cannot print until `second` has, and `second` cannot print until `first` has"
       },
       {
        "i": "the threads call `first`, `second`, `third`, in that order",
        "o": "firstsecondthird",
        "why": "`first` already ran, so `second` and `third` find nothing to wait for"
       }
      ],
      "k": [
       "each method is called exactly once",
       "a method that is called too early must wait without using the processor"
      ]
     }
    },
    {
     "n": "Design bounded blocking queue (LeetCode 1188)",
     "ex": {
      "i": "capacity 2; one thread enqueues 1, 2, 3 while another dequeues three times",
      "o": "dequeue returns 1, 2, 3",
      "w": "the third enqueue waits for room"
     },
     "l": "medium",
     "task": "A thread-safe queue that blocks when full or empty.",
     "hint": "Full and empty are two reasons to wait, on the same shared state. How can a sleeping thread be woken exactly when that state changes, and how does it re-check the condition when it wakes?",
     "sol": "import threading\nfrom collections import deque\n\nclass BoundedBlockingQueue:\n    def __init__(self, capacity):\n        self._q, self._cap = deque(), capacity\n        self._cv = threading.Condition()\n\n    def enqueue(self, element):\n        with self._cv:\n            self._cv.wait_for(lambda: len(self._q) < self._cap)   # wait while full\n            self._q.append(element)\n            self._cv.notify_all()          # producers and consumers share the condition\n\n    def dequeue(self):\n        with self._cv:\n            self._cv.wait_for(lambda: self._q)                    # wait while empty\n            element = self._q.popleft()\n            self._cv.notify_all()\n            return element\n\n    def size(self):\n        with self._cv:\n            return len(self._q)",
     "c": "O(1) per call; waiting threads sleep on the condition, they do not poll.",
     "st": {
      "p": "Design a queue shared by many producer and consumer threads, with a fixed `capacity`.\n\n`enqueue(element)` adds to the back and waits while the queue is full. `dequeue()` removes and returns the front item and waits while the queue is empty. `size()` returns the current count.",
      "ex": [
       {
        "i": "capacity 2; one thread calls `enqueue` with 1, 2, 3 while another calls `dequeue` three times",
        "o": "`dequeue` returns 1, 2, 3",
        "why": "the third `enqueue` has no room until the first `dequeue` takes an item out"
       },
       {
        "i": "`dequeue` is called on an empty queue, then another thread enqueues 7",
        "o": "`dequeue` returns 7",
        "why": "the caller waits until an item arrives, then returns it"
       }
      ],
      "k": [
       "1 <= capacity",
       "first in, first out",
       "a waiting thread must not use the processor while it waits"
      ]
     }
    },
    {
     "n": "Fizz Buzz multithreaded (LeetCode 1195)",
     "ex": {
      "i": "FizzBuzz(15) with four threads",
      "o": "1 2 fizz 4 buzz fizz 7 8 fizz buzz 11 fizz 13 14 fizzbuzz",
      "w": "each thread prints only its own numbers"
     },
     "l": "medium",
     "task": "Four threads cooperate to print one sequence in order.",
     "hint": "All four threads look at the same next number. How can each one sleep until that number is its kind, and what must it check once it wakes up, including after n is passed?",
     "sol": "import threading\n\nclass FizzBuzz:\n    def __init__(self, n):\n        self.n, self.i = n, 1\n        self._cv = threading.Condition()\n\n    def _run(self, mine, emit):\n        with self._cv:\n            while True:\n                self._cv.wait_for(lambda: self.i > self.n or mine(self.i))\n                if self.i > self.n:\n                    return                 # all numbers done: every thread leaves\n                emit(self.i)\n                self.i += 1\n                self._cv.notify_all()\n\n    def fizz(self, print_fizz):\n        self._run(lambda i: i % 3 == 0 and i % 5 != 0, lambda i: print_fizz())\n\n    def buzz(self, print_buzz):\n        self._run(lambda i: i % 5 == 0 and i % 3 != 0, lambda i: print_buzz())\n\n    def fizzbuzz(self, print_fizzbuzz):\n        self._run(lambda i: i % 15 == 0, lambda i: print_fizzbuzz())\n\n    def number(self, print_number):\n        self._run(lambda i: i % 3 != 0 and i % 5 != 0, print_number)",
     "c": "O(n) turns; notify_all wakes all four threads on each turn.",
     "st": {
      "p": "Four threads share one `FizzBuzz(n)` object. One calls `fizz(print_fizz)`, one `buzz(print_buzz)`, one `fizzbuzz(print_fizzbuzz)` and one `number(print_number)`.\n\nTogether they print the numbers 1 to n: a multiple of 3 prints fizz, a multiple of 5 prints buzz, a multiple of both prints fizzbuzz, and any other number prints itself. The output is in order, each thread prints only its own kind, and every thread returns once n is done.",
      "ex": [
       {
        "i": "`FizzBuzz(15)`, the four threads started in any order",
        "o": "1 2 fizz 4 buzz fizz 7 8 fizz buzz 11 fizz 13 14 fizzbuzz",
        "why": "whichever thread starts first, the next number to print decides whose turn it is"
       },
       {
        "i": "`FizzBuzz(2)`",
        "o": "1 2",
        "why": "no number from 1 to 2 is a multiple of 3 or 5, so those three threads print nothing and must still return"
       }
      ],
      "k": [
       "every thread must return once n is done",
       "`print_number` receives the number to print"
      ]
     }
    },
    {
     "n": "Building H2O (LeetCode 1117)",
     "ex": {
      "i": "threads arrive as H, H, H, O, O, H",
      "o": "every group of 3 outputs has 2 H and 1 O, for example HHOHOH",
      "w": "a semaphore per element and a barrier of three"
     },
     "l": "medium",
     "task": "Release hydrogen and oxygen threads as valid water molecules.",
     "hint": "Count what a molecule needs: two H, one O. What can limit how many of each type may enter at once, and what makes the three of them leave together?",
     "sol": "import threading\n\nclass H2O:                            # two hydrogens and one oxygen make a molecule\n    def __init__(self):\n        self._h = threading.Semaphore(2)       # at most two hydrogens in a molecule\n        self._o = threading.Semaphore(1)       # and one oxygen\n        self._barrier = threading.Barrier(3)   # the three meet before any releases\n\n    def hydrogen(self, release_hydrogen):\n        with self._h:\n            self._barrier.wait()\n            release_hydrogen()\n\n    def oxygen(self, release_oxygen):\n        with self._o:\n            self._barrier.wait()\n            release_oxygen()",
     "c": "O(1) per call; the next molecule cannot form until this one has released.",
     "st": {
      "p": "Design `H2O` with `hydrogen(release_hydrogen)` and `oxygen(release_oxygen)`. Many threads call them in any order, and there are always twice as many hydrogen calls as oxygen calls.\n\nA thread waits until a molecule can form, then calls its release function. Every consecutive group of three outputs must be two H and one O.",
      "ex": [
       {
        "i": "threads arrive as H, H, H, O, O, H",
        "o": "HHOHOH, or any order where each group of 3 is two H and one O",
        "why": "a molecule is released only when two hydrogens and one oxygen have all arrived"
       },
       {
        "i": "one oxygen arrives long before any hydrogen",
        "o": "it waits at the barrier",
        "why": "no molecule can form with an atom missing, so the oxygen waits"
       }
      ],
      "k": [
       "the order of the three atoms within a molecule does not matter",
       "a new molecule may not start releasing before the previous one is out"
      ]
     }
    }
   ],
   "g": "techniques"
  },
  {
   "id": "ood",
   "title": "Object-oriented design",
   "group": "Techniques",
   "ex": {
    "i": "4,500 cents, 10% off, then 300 off",
    "o": "3750",
    "w": "4500 - 450 = 4050, then 4050 - 300"
   },
   "sheet": {
    "spot": "Parking lot, cart, library, elevator: write the classes.",
    "move": "Requirements, entities, sketch, code, extensions.",
    "code": "class Discount(ABC):   # Strategy\n    @abstractmethod\n    def apply(self, cents): ...\nclass Cart:            # takes strategies\n    def __init__(self, ds): ...",
    "notes": [
     "<b>The round:</b> ask, name the entities, say how they relate, sketch, code the main path, extend.",
     "<b>Python tools:</b> <code>ABC</code> and <code>@abstractmethod</code> for a contract; <code>Protocol</code> for any object with the right methods; <code>Enum</code> for fixed choices; <code>@dataclass(frozen=True)</code> for values.",
     "<b>SOLID:</b><br>S: one reason to change.<br>O: add by extending, not by editing.<br>L: a subtype keeps its parent's promise.<br>I: small interfaces, nothing unused.<br>D: depend on abstractions; pass them in.",
     "<b>Patterns:</b> Strategy swaps a rule; Factory builds by name; Observer tells listeners; State changes behaviour with the state; Composite treats a tree like one node. Singleton is a hidden global that tests cannot reset: pass one object in.",
     "<b>Money and time:</b> integer cents or <code>Decimal</code>, never float. <code>time.monotonic()</code> for durations, and inject a clock so a test can move time."
    ]
   },
   "vars": [
    {
     "n": "Model the nouns: Enum, dataclass, ABC, Protocol",
     "ex": {
      "i": "Vehicle('KA01', Size.SMALL) against a compact spot",
      "o": "fits is True",
      "w": "a frozen dataclass is a value"
     },
     "t": "Each Python tool has one job: Enum for fixed choices, dataclass for values, ABC for a contract, Protocol for a shape.",
     "code": "from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\nfrom enum import Enum\nfrom typing import Protocol\n\nclass Size(Enum):\n    SMALL = 1\n    LARGE = 2\n\n@dataclass(frozen=True)\nclass Vehicle:                    # a value: compared by fields, cannot change\n    plate: str\n    size: Size\n\nclass Spot(ABC):                  # a contract; subclasses fill in the rule\n    @abstractmethod\n    def fits(self, vehicle): ...\n\nclass Compact(Spot):\n    def fits(self, vehicle):\n        return vehicle.size is Size.SMALL\n\nclass Payment(Protocol):          # any object with pay() works; no inheritance needed\n    def pay(self, cents) -> bool: ...",
     "st": {
      "p": "Model the nouns of a parking lot in Python, choosing for each the language feature that fits it.\n\nA vehicle is a value, a plate and a size, that never changes after it is created. A size is one of a fixed set. A spot is a contract with a `fits` rule that each kind of spot fills in. A payment method is anything that has a `pay` method, whatever its class.",
      "ex": [
       {
        "i": "a small `Vehicle` and a `Compact` spot",
        "o": "`fits` is True",
        "why": "a Compact spot fits a vehicle whose size is SMALL"
       },
       {
        "i": "assigning to `plate` on a `Vehicle`",
        "o": "raises FrozenInstanceError",
        "why": "a vehicle is a fixed value, so changing a field after it is created is an error"
       }
      ],
      "k": [
       "`Spot()` itself cannot be created, because its rule is left unfilled",
       "a payment method needs no base class; a type checker only checks that it has the right shape"
      ]
     }
    },
    {
     "n": "Factory: build by name",
     "ex": {
      "i": "make_notifier('sms')",
      "o": "an Sms object",
      "w": "callers pass a name, not a class"
     },
     "t": "A registry maps a name to a class; a new kind is one line and no caller changes.",
     "code": "from abc import ABC, abstractmethod\n\nclass Notifier(ABC):\n    @abstractmethod\n    def send(self, to, text): ...\n\nclass Email(Notifier):\n    def send(self, to, text):\n        return \"email \" + to + \": \" + text\n\nclass Sms(Notifier):\n    def send(self, to, text):\n        return \"sms \" + to + \": \" + text\n\nNOTIFIERS = {\"email\": Email, \"sms\": Sms}      # a new kind is one more line\n\ndef make_notifier(kind):\n    try:\n        return NOTIFIERS[kind]()\n    except KeyError:\n        raise ValueError(\"unknown notifier: \" + kind) from None",
     "st": {
      "p": "The caller has a name from a config file or a request, such as 'email' or 'sms', not a class. Implement `make_notifier(kind)` that returns the right `Notifier` for the name and raises a clear ValueError for an unknown name.\n\nAdding a new channel must not change any caller.",
      "ex": [
       {
        "i": "`make_notifier('sms').send('ann', 'hi')`",
        "o": "'sms ann: hi'",
        "why": "the name 'sms' gives an Sms notifier, whose `send` makes that line"
       },
       {
        "i": "`make_notifier('fax')`",
        "o": "raises ValueError",
        "why": "no channel is called 'fax', so the call fails and the message names it"
       }
      ],
      "k": [
       "the name is never compared in a chain of if statements",
       "the caller knows only the `Notifier` type, not the concrete classes"
      ]
     }
    },
    {
     "n": "Observer: tell the listeners",
     "ex": {
      "i": "two subscribers, then set_price(10), set_price(12)",
      "o": "each receives 10, then 12",
      "w": "the stock never knows who listens"
     },
     "t": "The subject keeps a list of callbacks and calls each on a change; it knows no listener's type.",
     "code": "class Stock:\n    def __init__(self, price):\n        self.price, self._watchers = price, []\n\n    def subscribe(self, fn):\n        self._watchers.append(fn)\n        return lambda: self._watchers.remove(fn)       # call it to unsubscribe\n\n    def set_price(self, price):\n        self.price = price\n        for fn in list(self._watchers):                # a copy: a watcher may unsubscribe\n            fn(price)",
     "st": {
      "p": "Design a `Stock` that holds a price. Other code wants to hear about every change without the stock knowing who is listening.\n\n`subscribe(fn)` registers a callback and returns a function that removes it again. `set_price(p)` stores the price and calls every current subscriber with it.",
      "ex": [
       {
        "i": "two subscribers, then `set_price(10)` and `set_price(12)`",
        "o": "each subscriber sees 10, then 12",
        "why": "both subscribers are called with each new price, in turn"
       },
       {
        "i": "a subscriber unsubscribes, then `set_price(15)`",
        "o": "only the remaining subscriber is called",
        "why": "the removed subscriber no longer hears anything, so only the other one is called"
       }
      ],
      "k": [
       "the stock holds callbacks, not listener classes",
       "a callback may unsubscribe itself while the stock is notifying"
      ]
     }
    },
    {
     "n": "State: behaviour changes with the state",
     "ex": {
      "i": "a locked turnstile gets coin(), then push(), then push()",
      "o": "unlocked, passed, locked",
      "w": "each state class answers the same calls"
     },
     "t": "Each state is a class with the same methods; the machine forwards calls and states swap themselves in.",
     "code": "class Locked:\n    def coin(self, t):\n        t.state = Unlocked()\n        return \"unlocked\"\n\n    def push(self, t):\n        return \"locked\"\n\nclass Unlocked:\n    def coin(self, t):\n        return \"already unlocked\"\n\n    def push(self, t):\n        t.state = Locked()\n        return \"passed\"\n\nclass Turnstile:\n    def __init__(self):\n        self.state = Locked()\n\n    def coin(self):\n        return self.state.coin(self)\n\n    def push(self):\n        return self.state.push(self)",
     "st": {
      "p": "Design a turnstile that starts locked. A coin unlocks it. A push while it is unlocked lets one person through and locks it again. A push while it is locked does nothing, and a coin while it is unlocked does nothing.\n\nAdding a new condition later must not mean editing a chain of checks in every method.",
      "ex": [
       {
        "i": "`coin()`, `push()`, `push()` on a new turnstile",
        "o": "'unlocked', 'passed', 'locked'",
        "why": "the first push lets the person through and locks it again, so the second push finds it locked"
       },
       {
        "i": "`coin()` twice",
        "o": "'unlocked', 'already unlocked'",
        "why": "a coin that arrives while it is already unlocked changes nothing"
       }
      ],
      "k": [
       "adding a new condition means adding code in one place",
       "if the conditions differ only in which moves are allowed, a table of allowed moves is enough"
      ]
     }
    },
    {
     "n": "Composite: a tree that answers like one node",
     "ex": {
      "i": "a folder holding a 10-byte file and a folder with a 5-byte file",
      "o": "total_size() is 15",
      "w": "a file and a folder answer the same call"
     },
     "t": "Leaves and containers share a method, so the caller never asks which one it holds.",
     "code": "class File:\n    def __init__(self, name, size):\n        self.name, self.size = name, size\n\n    def total_size(self):\n        return self.size\n\nclass Folder:\n    def __init__(self, name):\n        self.name, self.children = name, []\n\n    def add(self, child):\n        self.children.append(child)\n        return self\n\n    def total_size(self):\n        return sum(c.total_size() for c in self.children)     # the same call on a file or a folder",
     "st": {
      "p": "Design files and folders so that both answer `total_size()`. A file returns its own size. A folder holds files and other folders, to any depth, and returns the size of everything inside it.\n\nThe caller must not need to check which kind it is holding.",
      "ex": [
       {
        "i": "a folder with a 10-byte file and a subfolder with a 5-byte file",
        "o": "`total_size()` is 15",
        "why": "the subfolder answers the same call a file does, and 10 + 5 = 15"
       },
       {
        "i": "an empty folder",
        "o": "`total_size()` is 0",
        "why": "an empty folder holds nothing, so its size is 0"
       }
      ],
      "k": [
       "the caller never checks the type of what it holds",
       "the same shape fits menus, org charts and expression trees"
      ]
     }
    },
    {
     "n": "Singleton, and what to do instead",
     "ex": {
      "i": "register('a', 1) into REGISTRY, and into a fresh Registry()",
      "o": "each registry holds only its own entries",
      "w": "a test passes its own registry"
     },
     "t": "A module-level object is already one instance; pass it in with a default so tests can pass a fresh one.",
     "code": "class Registry:\n    def __init__(self):\n        self.items = {}\n\nREGISTRY = Registry()                 # a module is imported once: this is the one shared object\n\ndef register(name, item, registry=REGISTRY):     # callers use the default; tests pass their own\n    registry.items[name] = item\n    return registry",
     "st": {
      "p": "Design how a `Registry` exists once for the whole program, so that the code that needs it reaches the shared one by default and a test can still give its own. Implement `register(name, item, ...)` accordingly.\n\nSay why the classic way of forcing a single instance inside `__new__` is a poor fit in Python: it is hidden global state that a test cannot reset, and its check is a race when threads call it at once.",
      "ex": [
       {
        "i": "`register('a', 1)` with the default registry",
        "o": "`REGISTRY.items` holds a",
        "why": "the default is the one shared registry, so the entry appears there"
       },
       {
        "i": "`register('a', 1, Registry())`",
        "o": "the new registry holds a; `REGISTRY` is unchanged",
        "why": "the test passes its own registry, so the shared one is untouched"
       }
      ],
      "k": [
       "no check inside `__new__`",
       "hidden global state is the reason to avoid it, not style"
      ]
     }
    },
    {
     "n": "Money and time",
     "ex": {
      "i": "a ticket billed per started hour, 90 minutes on a fake clock at 200 cents an hour",
      "o": "400 cents",
      "w": "ceil(1.5) hours, integer cents"
     },
     "t": "Money is integer cents, never float; time comes from a clock you pass in, so a test can move it.",
     "code": "import math, time\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Money:\n    cents: int                         # integer cents: 0.1 + 0.2 never appears\n\n    def __add__(self, other):\n        return Money(self.cents + other.cents)\n\n    def __str__(self):\n        return \"%d.%02d\" % divmod(self.cents, 100)\n\nclass Clock:\n    def now(self):\n        return time.monotonic()        # durations: the wall clock can jump back\n\nclass Ticket:\n    def __init__(self, clock, rate):\n        self.clock, self.rate, self.start = clock, rate, clock.now()\n\n    def fee(self):\n        hours = max(1, math.ceil((self.clock.now() - self.start) / 3600))   # each started hour is billed\n        return Money(self.rate.cents * hours)",
     "st": {
      "p": "A parking ticket bills a `Money` rate for every started hour, with a minimum of one hour. Design `Money` so that amounts are exact, and `Ticket` so that a test can control the time: it reads time from a `Clock` object that is passed in, and in production that clock never goes backwards.",
      "ex": [
       {
        "i": "a fake clock, a rate of 200 cents, and `fee()` after 90 minutes",
        "o": "`Money(400)`",
        "why": "90 minutes is 1.5 hours, which counts as 2 started hours of 200 cents"
       },
       {
        "i": "`str(Money(1050))`",
        "o": "'10.50'",
        "why": "1050 cents print as 10 whole units and 50 cents"
       }
      ],
      "k": [
       "state the rounding rule out loud",
       "when amounts have fractions of a cent, the `Decimal` type is the alternative"
      ]
     }
    }
   ],
   "spot": "Turn a vague prompt into a few small classes that work and can grow. The round has six steps: <b>requirements</b> (what must it do, what is out of scope), <b>entities</b> (the nouns), <b>relationships</b> (who owns whom), a <b>class sketch</b> (fields and methods), the <b>core code</b> for the main path, then the <b>extensions</b> the interviewer adds. <b>Signal:</b> 'design a parking lot', 'write the classes for', and no talk of scale.",
   "cx": "Three to six classes, the main path running, extensions named. Say the trade-off of each choice.",
   "tpl": "from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Item:\n    sku: str\n    price_cents: int                  # money is an int of cents, never a float\n    qty: int = 1\n\nclass Discount(ABC):                  # Strategy: one contract, many rules\n    @abstractmethod\n    def apply(self, total_cents):\n        \"\"\"Return the new total.\"\"\"\n\n@dataclass\nclass PercentOff(Discount):\n    percent: int\n\n    def apply(self, total_cents):\n        return total_cents - total_cents * self.percent // 100\n\n@dataclass\nclass FlatOff(Discount):\n    cents: int\n\n    def apply(self, total_cents):\n        return max(0, total_cents - self.cents)\n\nclass Cart:\n    def __init__(self, discounts=()):\n        self.items = []\n        self.discounts = list(discounts)          # injected, not built inside\n\n    def add(self, item):\n        self.items.append(item)\n\n    def total(self):\n        total = sum(i.price_cents * i.qty for i in self.items)\n        for d in self.discounts:                  # a new rule is a new class, not an edit here\n            total = d.apply(total)\n        return total",
   "probs": [
    {
     "n": "Parking lot",
     "ex": {
      "i": "one SMALL and one LARGE spot; park two SMALL cars, then a third",
      "o": "first gets SMALL, second gets LARGE, third gets None",
      "w": "smallest spot that fits"
     },
     "l": "medium",
     "task": "Allocate spots by size, issue tickets, bill by the started hour.",
     "hint": "Of the free spots that are big enough, which one wastes the least space? What do you need to remember about each ticket to bill it later?",
     "sol": "import itertools, math\nfrom dataclasses import dataclass\nfrom enum import IntEnum\n\nclass Size(IntEnum):\n    SMALL = 1\n    MEDIUM = 2\n    LARGE = 3                       # a vehicle fits a spot of its own size or bigger\n\n@dataclass(frozen=True)\nclass Vehicle:\n    plate: str\n    size: Size\n\n@dataclass\nclass Spot:\n    id: int\n    size: Size\n    vehicle: Vehicle = None\n\n@dataclass(frozen=True)\nclass Ticket:\n    id: int\n    spot_id: int\n    start: float\n\nclass ParkingLot:\n    def __init__(self, sizes, clock, rate_cents=200):\n        self.spots = [Spot(i, s) for i, s in enumerate(sizes)]\n        self.clock, self.rate = clock, rate_cents          # clock() returns seconds\n        self._ids = itertools.count(1)\n        self._open = {}                                    # ticket id -> Ticket\n\n    def park(self, vehicle):\n        free = [s for s in self.spots if s.vehicle is None and s.size >= vehicle.size]\n        if not free:\n            return None                                    # nothing fits\n        spot = min(free, key=lambda s: (s.size, s.id))     # smallest spot that fits\n        spot.vehicle = vehicle\n        ticket = Ticket(next(self._ids), spot.id, self.clock())\n        self._open[ticket.id] = ticket\n        return ticket\n\n    def leave(self, ticket_id):\n        ticket = self._open.pop(ticket_id)\n        self.spots[ticket.spot_id].vehicle = None\n        hours = max(1, math.ceil((self.clock() - ticket.start) / 3600))\n        return hours * self.rate                           # fee in cents",
     "c": "park is O(spots); leave is O(1). A heap of free spots per size makes park O(log n).",
     "st": {
      "p": "Design a parking lot with spots of three sizes. A vehicle fits a spot of its own size or a bigger one.\n\n`park(vehicle)` returns a ticket, or None when no spot fits. `leave(ticket_id)` frees the spot and returns the fee in cents: every started hour is charged, with a one-hour minimum. The clock is passed in, so a caller can control the time.",
      "ex": [
       {
        "i": "a lot with spots [SMALL, LARGE]; park two SMALL cars, then a third",
        "o": "tickets for spot 0 and spot 1, then None",
        "why": "the first car takes the smallest spot it fits; for the third car every spot is taken"
       },
       {
        "i": "`leave` 90 minutes after `park`, at 200 cents an hour",
        "o": "400",
        "why": "1.5 hours counts as 2 started hours, and 2 x 200 = 400"
       }
      ],
      "k": [
       "sizes, spot count and rate are constructor arguments",
       "a ticket can be used once"
      ]
     }
    },
    {
     "n": "In-memory file system (LeetCode 588)",
     "ex": {
      "i": "mkdir('/a/b'), add_content('/a/b/f', 'hi'), ls('/a/b')",
      "o": "['f']",
      "w": "a node is a folder or a file"
     },
     "l": "medium",
     "task": "ls, mkdir, add_content and read_content over a tree of folders and files.",
     "hint": "A folder and a file are both things with a name. What would one type that can be either look like, and how do you reach a node from a path like /a/b/f one part at a time?",
     "sol": "class Node:\n    def __init__(self):\n        self.children = {}            # name -> Node, for a folder\n        self.content = None           # a string, for a file\n\nclass FileSystem:\n    def __init__(self):\n        self.root = Node()\n\n    def _walk(self, path, create=False):\n        node = self.root\n        for part in [p for p in path.split(\"/\") if p]:\n            if part not in node.children:\n                if not create:\n                    raise FileNotFoundError(path)\n                node.children[part] = Node()\n            node = node.children[part]\n        return node\n\n    def ls(self, path):\n        node = self._walk(path)\n        if node.content is not None:                   # a file lists as itself\n            return [path.split(\"/\")[-1]]\n        return sorted(node.children)\n\n    def mkdir(self, path):\n        self._walk(path, create=True)\n\n    def add_content(self, path, text):\n        node = self._walk(path, create=True)\n        node.content = (node.content or \"\") + text\n\n    def read_content(self, path):\n        return self._walk(path).content",
     "c": "O(length of the path) per call; ls adds a sort of the names.",
     "st": {
      "p": "Design an in-memory file system. `ls(path)` returns the sorted names inside a folder, or only the file's own name if the path is a file. `mkdir(path)` creates a folder and any parents that are missing. `add_content(path, text)` creates the file if needed and appends the text to it. `read_content(path)` returns the content of a file.\n\nPaths start with '/', and '/' is the root.",
      "ex": [
       {
        "i": "`mkdir('/a/b')`, `add_content('/a/b/f', 'hi')`, `ls('/a/b')`",
        "o": "['f']",
        "why": "the file `f` was created inside the folder /a/b"
       },
       {
        "i": "then `add_content('/a/b/f', '!')` and `read_content('/a/b/f')`",
        "o": "'hi!'",
        "why": "the second add is appended after the first, giving 'hi!'"
       }
      ],
      "k": [
       "names are unique inside a folder",
       "a path that does not exist raises FileNotFoundError"
      ]
     }
    },
    {
     "n": "Shopping cart with discounts",
     "ex": {
      "i": "4,500 cents in the cart; apply SAVE10, then TAKE3 (300 cents off, 4,000 minimum)",
      "o": "total is 3750",
      "w": "the minimum is checked on the subtotal"
     },
     "l": "medium",
     "task": "A cart with coupons that have a minimum spend and cannot be reused.",
     "hint": "A coupon is data: a code, a percent, a flat amount, a minimum spend. What does the cart need to remember to answer apply and total, and in which order are the discounts taken?",
     "sol": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Coupon:\n    code: str\n    percent: int = 0\n    flat_cents: int = 0\n    min_spend_cents: int = 0\n\nclass Cart:\n    def __init__(self, coupons):\n        self._coupons = {c.code: c for c in coupons}      # what the shop accepts\n        self._lines = {}                                  # sku -> [price_cents, qty]\n        self._applied = []\n\n    def add(self, sku, price_cents, qty=1):\n        line = self._lines.setdefault(sku, [price_cents, 0])\n        line[1] += qty\n\n    def subtotal(self):\n        return sum(price * qty for price, qty in self._lines.values())\n\n    def apply(self, code):\n        coupon = self._coupons.get(code)\n        if coupon is None or coupon in self._applied:\n            return False                                  # unknown, or already used\n        if self.subtotal() < coupon.min_spend_cents:\n            return False\n        self._applied.append(coupon)\n        return True\n\n    def total(self):\n        total = self.subtotal()\n        for c in self._applied:                           # in the order applied\n            total = max(0, total - total * c.percent // 100 - c.flat_cents)\n        return total",
     "c": "O(items) for the subtotal, O(coupons) for the total.",
     "st": {
      "p": "Design a shopping cart. `add(sku, price_cents, qty)` adds items; adding a sku again adds to its quantity. `apply(code)` applies a coupon and returns True, or False if the code is unknown, was already applied, or the subtotal is below the coupon's minimum spend.\n\n`total()` applies the coupons in the order they were applied, the percent discount first and then the flat amount, and never goes below zero. All money is in integer cents.",
      "ex": [
       {
        "i": "4,500 cents in the cart; the shop has SAVE10 (10%) and TAKE3 (300 cents off, minimum 4,000); apply SAVE10, then TAKE3",
        "o": "both return True; `total()` is 3750",
        "why": "4500 - 450 = 4050, then 4050 - 300 = 3750"
       },
       {
        "i": "apply SAVE10 twice",
        "o": "True, then False",
        "why": "the first apply works; the same code a second time is refused"
       }
      ],
      "k": [
       "round percent discounts down, in the customer's disfavour, and say so",
       "a total never goes negative"
      ]
     }
    },
    {
     "n": "Library",
     "ex": {
      "i": "borrow on day 1, give back on day 20",
      "o": "fine is 125 cents",
      "w": "due day 15, 5 days late at 25 cents"
     },
     "l": "medium",
     "task": "Books, members, loans with a limit, due dates and fines.",
     "hint": "Track how many copies are on the shelf and what each member holds. A loan's due day is the day it was borrowed plus the loan period; what makes a return late?",
     "sol": "from dataclasses import dataclass, field\n\nLOAN_DAYS, MAX_LOANS, FINE_PER_DAY = 14, 3, 25     # fine in cents\n\n@dataclass\nclass Member:\n    name: str\n    loans: dict = field(default_factory=dict)      # isbn -> due day\n\nclass Library:\n    def __init__(self):\n        self.copies = {}                           # isbn -> copies on the shelf\n        self.members = {}\n\n    def add_book(self, isbn, copies=1):\n        self.copies[isbn] = self.copies.get(isbn, 0) + copies\n\n    def join(self, name):\n        self.members[name] = Member(name)\n\n    def borrow(self, name, isbn, today):\n        m = self.members[name]\n        if self.copies.get(isbn, 0) == 0 or len(m.loans) >= MAX_LOANS or isbn in m.loans:\n            return False\n        self.copies[isbn] -= 1\n        m.loans[isbn] = today + LOAN_DAYS\n        return True\n\n    def give_back(self, name, isbn, today):\n        due = self.members[name].loans.pop(isbn)\n        self.copies[isbn] += 1\n        return max(0, today - due) * FINE_PER_DAY",
     "c": "O(1) per call.",
     "st": {
      "p": "Design a small library. `add_book(isbn, copies)` and `join(name)` set it up. `borrow(name, isbn, today)` starts a 14-day loan and returns True, or returns False if no copy is on the shelf, the member already holds 3 books, or the member already holds this book.\n\n`give_back(name, isbn, today)` returns the copy and the fine in cents: 25 for each day it is late. Days are whole numbers.",
      "ex": [
       {
        "i": "one copy of a book; `borrow` on day 1, then `give_back` on day 20",
        "o": "True, then 125",
        "why": "it was due on day 15 and came back on day 20, 5 days late at 25 cents each"
       },
       {
        "i": "a second member borrows the same single copy while it is out",
        "o": "False",
        "why": "the only copy is out on loan, so none is on the shelf"
       }
      ],
      "k": [
       "a member holds at most 3 loans",
       "a late fine is never negative"
      ]
     }
    },
    {
     "n": "Elevator",
     "ex": {
      "i": "at floor 0, requests 5, 2 and 8",
      "o": "stops at 2, 5, 8",
      "w": "keep going one way, then turn around"
     },
     "l": "hard",
     "task": "One elevator that serves floor requests without wasting trips.",
     "hint": "Which way is the elevator facing, and is any stop still ahead of it? Only when nothing is ahead does it have a reason to turn around.",
     "sol": "from enum import Enum\n\nclass Dir(Enum):\n    UP = 1\n    DOWN = -1\n    IDLE = 0\n\nclass Elevator:\n    def __init__(self, floors):\n        self.floors, self.floor, self.dir = floors, 0, Dir.IDLE\n        self.stops = set()                              # floors someone asked for\n\n    def request(self, floor):\n        if 0 <= floor < self.floors and floor != self.floor:\n            self.stops.add(floor)\n\n    def step(self):\n        \"\"\"One tick: move a floor. Returns the floor if the doors open there.\"\"\"\n        if not self.stops:\n            self.dir = Dir.IDLE\n            return None\n        if self.dir is Dir.IDLE:\n            nearest = min(self.stops, key=lambda f: abs(f - self.floor))\n            self.dir = Dir.UP if nearest > self.floor else Dir.DOWN\n        if not any((f - self.floor) * self.dir.value > 0 for f in self.stops):\n            self.dir = Dir.UP if self.dir is Dir.DOWN else Dir.DOWN   # nothing ahead: turn around\n        self.floor += self.dir.value\n        if self.floor in self.stops:\n            self.stops.remove(self.floor)\n            return self.floor\n        return None\n\n    def run(self):\n        visited = []\n        while self.stops:\n            f = self.step()\n            if f is not None:\n                visited.append(f)\n        return visited",
     "c": "O(stops) per step; a sorted structure makes the 'anything ahead' check O(log n).",
     "st": {
      "p": "Design one elevator for a building with `floors` floors, starting at floor 0. `request(floor)` records a stop. `step()` moves one floor and returns the floor if the doors open there.\n\nThe elevator keeps its direction while any requested floor is ahead of it, and turns around when none is. When it is idle it heads for the nearest request. `run()` steps until no stops remain and returns the floors in the order they were served.",
      "ex": [
       {
        "i": "at floor 0, `request(5)`, `request(2)`, `request(8)`, then `run()`",
        "o": "[2, 5, 8]",
        "why": "every request is above floor 0, so it goes up once and stops at 2, 5 and 8 in turn"
       },
       {
        "i": "at floor 8 after that, `request(3)`, `request(9)`, then `run()`",
        "o": "[9, 3]",
        "why": "9 is nearer than 3, so it goes up to 9 first, then turns and goes down to 3"
       }
      ],
      "k": [
       "ignore a request for the current floor or outside the building",
       "a request made while moving is served if it is ahead, otherwise on the way back"
      ]
     }
    },
    {
     "n": "Time-based key-value store (LeetCode 981)",
     "ex": {
      "i": "set('k','a',1), set('k','b',4), get('k',3), get('k',5)",
      "o": "'a', then 'b'",
      "w": "the latest value at or before the time"
     },
     "l": "medium",
     "task": "set(key, value, time) and get(key, time) returns the value as it was at that time.",
     "hint": "For one key, the timestamps only ever grow. Given that, how can you find the last one at or before a time without looking at every entry?",
     "sol": "import bisect\n\nclass TimeMap:\n    def __init__(self):\n        self._times, self._values = {}, {}      # key -> timestamps in increasing order, values\n\n    def set(self, key, value, timestamp):\n        self._times.setdefault(key, []).append(timestamp)\n        self._values.setdefault(key, []).append(value)\n\n    def get(self, key, timestamp):\n        i = bisect.bisect_right(self._times.get(key, []), timestamp)    # entries at or before it\n        return self._values[key][i - 1] if i else \"\"",
     "c": "set is O(1); get is O(log n) by binary search.",
     "st": {
      "p": "Design a time-based key-value store. `set(key, value, timestamp)` stores a value for a key at a time. `get(key, timestamp)` returns the value stored at the latest time that is at or before `timestamp`, or an empty string if there is none.\n\nThe `set` calls for one key arrive with increasing timestamps.",
      "ex": [
       {
        "i": "`set('k', 'a', 1)`, `set('k', 'b', 4)`, then `get('k', 3)` and `get('k', 5)`",
        "o": "'a', then 'b'",
        "why": "at time 3 the latest value set is the one from time 1; at time 5 it is the one from time 4"
       },
       {
        "i": "`get('k', 0)` and `get('missing', 9)`",
        "o": "'' and ''",
        "why": "nothing was set at or before time 0, and the key `missing` never existed"
       }
      ],
      "k": [
       "timestamps for one key are strictly increasing",
       "O(log n) for get"
      ]
     }
    }
   ],
   "g": "techniques"
  },
  {
   "id": "numpy",
   "title": "NumPy and matrix basics",
   "group": "AI systems",
   "spot": "Any interview that asks you to score, rank or batch vectors by hand instead of calling a library. <b>Signal:</b> \"implement cosine similarity\", \"no sklearn\", \"do this with matrices\".",
   "cx": "Matmul is the dominant cost; broadcasting avoids materializing copies, but a shape mismatch broadcasts silently to a wrong-looking result instead of erroring.",
   "ex": {
    "i": "one query vector against 3 document vectors",
    "o": "softmax weights peaking on the identical document (index 0)",
    "w": "shows normalize, cosine similarity, mask, and softmax as one scoring pipeline"
   },
   "hld": [
    "Arrays and dtypes: build typed arrays; dtype controls memory and precision.",
    "Shape, reshape and transpose: reshape must preserve element count; transpose is a view.",
    "Broadcasting: shapes align from the trailing dimension outward.",
    "Matmul and einsum: @ contracts the shared axis; einsum names which axes contract.",
    "Reductions along an axis: sum or mean over one axis, keepdims to stay broadcastable.",
    "Stable softmax: subtract the row max before exp to avoid overflow to inf or nan.",
    "Cosine similarity matrix: normalize both sides, then one matmul.",
    "Masking with where: replace entries that fail a condition, elementwise."
   ],
   "parts": [
    {
     "n": "Arrays and dtypes",
     "t": "Typed arrays control memory and precision; float32 halves memory versus float64, which matters once you're indexing millions of vectors.",
     "code": "\nimport numpy as np\n\ndef make_array(values, dtype=np.float32):\n    return np.array(values, dtype=dtype)\n"
    },
    {
     "n": "Shape, reshape and transpose",
     "t": "Reshape must preserve the total element count; -1 lets numpy infer one dimension. Transpose is a view, not a copy, so mutating it mutates the original.",
     "code": "\ndef reshape_and_transpose(a):\n    flat = a.reshape(-1)\n    grid = flat.reshape(2, -1)\n    return grid, grid.T\n"
    },
    {
     "n": "Broadcasting",
     "t": "Shapes align from the trailing dimension. (n, d) + (d,) broadcasts the vector across every row; (n, d) + (n,) usually does NOT do what people expect and either errors or broadcasts on the wrong axis.",
     "code": "\ndef broadcast_add(matrix, vector):\n    return matrix + vector\n"
    },
    {
     "n": "Matmul and einsum",
     "t": "@ contracts the shared axis; einsum spells out which axes contract, which is easier to audit in batched code even when it isn't faster.",
     "code": "\ndef scores_matmul(queries, docs):\n    return queries @ docs.T\n\ndef scores_einsum(queries, docs):\n    return np.einsum(\"qd,nd->qn\", queries, docs)\n"
    },
    {
     "n": "Reductions along an axis",
     "t": "axis=1 reduces across columns, one value per row; keepdims keeps the result broadcastable back against the original array without a manual reshape.",
     "code": "\ndef row_normalize(matrix):\n    norms = np.linalg.norm(matrix, axis=1, keepdims=True)\n    return matrix / np.clip(norms, 1e-8, None)\n"
    },
    {
     "n": "Stable softmax",
     "t": "Subtracting the row max before exp is invariant to the softmax result but keeps exp() away from overflow; skip it and a large logit in float32 turns into inf, then inf/inf is nan.",
     "code": "\ndef softmax(x, axis=-1):\n    shifted = x - np.max(x, axis=axis, keepdims=True)\n    exp = np.exp(shifted)\n    return exp / np.sum(exp, axis=axis, keepdims=True)\n"
    },
    {
     "n": "Cosine similarity matrix and masking",
     "t": "Normalize both sides so the matmul IS cosine similarity, then use np.where to drop scores under a threshold to -inf so a later softmax sends them to ~0 instead of deleting the row.",
     "code": "\ndef cosine_similarity_matrix(a, b):\n    a_n = row_normalize(a)\n    b_n = row_normalize(b)\n    return a_n @ b_n.T\n\ndef mask_self(sim_matrix, threshold=0.0):\n    return np.where(sim_matrix >= threshold, sim_matrix, -np.inf)\n"
    }
   ],
   "tpl": "\nquery = make_array([[1.0, 0.0, 1.0, 0.0]])\ndocs = make_array([[1.0, 0.0, 1.0, 0.0], [0.0, 1.0, 0.0, 1.0], [1.0, 1.0, 0.0, 0.0]])\nsims = cosine_similarity_matrix(query, docs)\nmasked = mask_self(sims, threshold=0.1)\nweights = softmax(masked, axis=-1)\nbest_doc_index = int(np.argmax(weights[0]))\n",
   "remember": [
    "Subtract the row max before exp; skipping it is how a fine-looking softmax turns into nan in production on a big logit.",
    "A dot product is cosine similarity only once both sides are unit-normalized; forgetting one side silently returns something else.",
    "Broadcasting failures are usually silent, not an error: (n, d) + (n,) can broadcast on the wrong axis instead of raising.",
    "axis=0 reduces down a column (across rows), axis=1 reduces across a row (across columns); keepdims=True is what keeps the result broadcastable afterward.",
    "einsum is not automatically faster than @; use it when naming the contracted axes prevents a bug, not by default."
   ],
   "asks": [
    {
     "q": "Why subtract the max before exponentiating in softmax?",
     "a": "exp() of a large logit overflows float32 to inf, and inf divided by inf is nan. Subtracting the row's max shifts every value to at most 0 before exponentiating, which leaves the softmax result mathematically unchanged but keeps every intermediate value finite."
    },
    {
     "q": "What's the practical difference between axis=0 and axis=1 in a reduction?",
     "a": "For a 2D array shaped (rows, cols), axis=0 collapses the rows and returns one value per column; axis=1 collapses the columns and returns one value per row. Getting this backwards is a common bug when normalizing a batch of vectors stored as rows."
    },
    {
     "q": "When would you reach for einsum instead of @ or a loop?",
     "a": "When the contraction involves more than two plain 2D matrices, or when a batch dimension makes @ ambiguous, naming the axes explicitly in einsum makes the intended contraction unambiguous and easy to review, even though for a simple 2D matmul it usually isn't faster than @."
    }
   ],
   "vars": [
    {
     "n": "Now batch multiple queries at once",
     "ex": {
      "i": "2 queries against the same 3 docs",
      "o": "a (2, 3) weight matrix, each row summing to 1",
      "w": "the same pipeline batched with one einsum call instead of a python loop"
     },
     "t": "einsum handles the extra batch dimension in a single call; looping over queries in python would give the same numbers far slower.",
     "code": "\nqueries_batch = make_array([[1.0, 0.0, 1.0, 0.0], [0.0, 1.0, 0.0, 1.0]])\nbatch_sims = np.einsum(\"qd,nd->qn\", queries_batch, docs)\nbatch_weights = softmax(batch_sims, axis=-1)\nbatch_shape = batch_weights.shape\n"
    },
    {
     "n": "Now scale by temperature before softmax",
     "ex": {
      "i": "the same similarity row at temperature 0.1 vs 5.0",
      "o": "a near one-hot distribution vs a near-uniform one",
      "w": "temperature controls how peaked the softmax output is"
     },
     "t": "Dividing the logits by temperature before softmax controls confidence: temperature below 1 sharpens the distribution, above 1 flattens it.",
     "code": "\ndef softmax_with_temperature(x, temperature=1.0, axis=-1):\n    return softmax(x / temperature, axis=axis)\n\nsharp_weights = softmax_with_temperature(sims, temperature=0.1)\nflat_weights = softmax_with_temperature(sims, temperature=5.0)\nsharp_max = float(np.max(sharp_weights))\nflat_max = float(np.max(flat_weights))\n"
    },
    {
     "n": "Now do the whole thing with einsum, no @",
     "ex": {
      "i": "the same query and docs",
      "o": "identical similarity matrix computed via einsum",
      "w": "shows @ and einsum computing the same contraction"
     },
     "t": "einsum and @ compute the same contraction here; einsum spells out which axes are being summed over.",
     "code": "\ndef cosine_similarity_matrix_einsum(a, b):\n    a_n = row_normalize(a)\n    b_n = row_normalize(b)\n    return np.einsum(\"id,jd->ij\", a_n, b_n)\n\nsims_einsum = cosine_similarity_matrix_einsum(query, docs)\neinsum_matches_matmul = bool(np.allclose(sims_einsum, sims))\n"
    }
   ],
   "sheet": {
    "spot": "Score or rank vectors by hand, no library helper allowed.",
    "move": "normalize rows, one matmul for cosine, subtract max before exp.",
    "code": "from numpy.linalg import norm as nrm\nqn = q / nrm(q)\ndn = d / nrm(d, axis=1, keepdims=True)\nsim = qn @ dn.T\nsim -= sim.max(axis=-1, keepdims=True)\nex = np.exp(sim)\nw = ex / ex.sum(axis=-1, keepdims=True)",
    "notes": [
     "dot product = cosine only if both sides are unit-normalized first.",
     "subtract the max before exp, every time, or risk inf/nan on real logits.",
     "a broadcasting shape mismatch is usually silent, not an error."
    ]
   },
   "figs": [
    "numpyShapes",
    "vectors"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "torch",
   "title": "PyTorch basics",
   "group": "AI systems",
   "spot": "Interviewer hands you a small dataset and asks for a training loop from scratch, or asks you to explain what a line in an existing loop does. <b>Signal:</b> \"write the training loop\", \"what does zero_grad do\", \"no Trainer class\".",
   "cx": "The Python loop over batches is not the bottleneck; the forward/backward pass on the model is. Keep the loop itself simple and correct rather than clever.",
   "ex": {
    "i": "32 synthetic examples, a 3-feature linear target",
    "o": "training loss that drops over 5 epochs, then a reloaded checkpoint matching the trained weights",
    "w": "exercises the full tensor -> model -> loop -> checkpoint path"
   },
   "hld": [
    "Tensors and devices: typed tensors, placed on cpu or gpu.",
    "Autograd: requires_grad records ops; backward() computes gradients by walking the graph.",
    "nn.Module: a model is parameters plus a forward() that uses them.",
    "Dataset and DataLoader: __getitem__ defines one example; DataLoader batches and shuffles.",
    "The training step: forward, loss, backward, step, zero_grad, in that order.",
    "Evaluation with no_grad: eval() changes layer behavior, no_grad() skips the autograd graph.",
    "Save and load a state_dict: weights keyed by name; architecture must match on load."
   ],
   "parts": [
    {
     "n": "Tensors and devices",
     "t": "Device placement decides where the tensor's memory and ops live; moving a tensor mid-graph breaks autograd, so pick the device once, up front.",
     "code": "\nimport torch\nimport torch.nn as nn\n\nDEVICE = torch.device(\"cpu\")\n\ndef make_tensor(values):\n    return torch.tensor(values, dtype=torch.float32, device=DEVICE)\n"
    },
    {
     "n": "Autograd",
     "t": "requires_grad=True tells torch to record every operation on that tensor; backward() walks the recorded graph in reverse to compute gradients into .grad.",
     "code": "\ndef autograd_demo():\n    x = torch.tensor([2.0, 3.0], requires_grad=True)\n    y = (x ** 2).sum()\n    y.backward()\n    return x.grad\n"
    },
    {
     "n": "nn.Module",
     "t": "A model is parameters plus a forward() that combines them; nn.Linear owns a weight and bias tensor and registers them for the optimizer automatically.",
     "code": "\nclass TinyRegressor(nn.Module):\n    def __init__(self, in_features: int):\n        super().__init__()\n        self.linear = nn.Linear(in_features, 1)\n\n    def forward(self, x):\n        return self.linear(x).squeeze(-1)\n"
    },
    {
     "n": "Dataset and DataLoader",
     "t": "__getitem__ defines what one example looks like; DataLoader handles batching and shuffling on top of that, so the training loop never indexes the raw data itself.",
     "code": "\nfrom torch.utils.data import Dataset, DataLoader\n\nclass TinyDataset(Dataset):\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __len__(self):\n        return len(self.x)\n\n    def __getitem__(self, idx):\n        return self.x[idx], self.y[idx]\n\ndef make_loader(x, y, batch_size=4):\n    return DataLoader(TinyDataset(x, y), batch_size=batch_size, shuffle=True)\n"
    },
    {
     "n": "The training step",
     "t": "zero_grad must run before backward on every batch, or gradients from the previous batch accumulate into the new ones; forward, loss, backward, step is the fixed order after that.",
     "code": "\ndef train_one_epoch(model, loader, optimizer, loss_fn):\n    model.train()\n    total_loss = 0.0\n    for xb, yb in loader:\n        optimizer.zero_grad()\n        pred = model(xb)\n        loss = loss_fn(pred, yb)\n        loss.backward()\n        optimizer.step()\n        total_loss += loss.item()\n    return total_loss / len(loader)\n"
    },
    {
     "n": "Evaluation, save and load",
     "t": "model.eval() changes layer behavior (dropout, batchnorm); no_grad() separately skips building the autograd graph to save memory and time. A checkpoint is tensors keyed by name, so the architecture must match on load.",
     "code": "\ndef evaluate(model, x, y, loss_fn):\n    model.eval()\n    with torch.no_grad():\n        pred = model(x)\n        return loss_fn(pred, y).item()\n\ndef save_checkpoint(model, path):\n    torch.save(model.state_dict(), path)\n\ndef load_checkpoint(model, path):\n    model.load_state_dict(torch.load(path, weights_only=True))\n    return model\n"
    }
   ],
   "tpl": "\ntorch.manual_seed(0)\nx = torch.randn(32, 3)\ntrue_w = torch.tensor([1.5, -2.0, 0.5])\ny = x @ true_w + 0.1 * torch.randn(32)\n\nmodel = TinyRegressor(in_features=3)\noptimizer = torch.optim.SGD(model.parameters(), lr=0.1)\nloss_fn = nn.MSELoss()\nloader = make_loader(x, y, batch_size=8)\n\nlosses = [train_one_epoch(model, loader, optimizer, loss_fn) for _ in range(5)]\nfinal_eval_loss = evaluate(model, x, y, loss_fn)\n\nimport tempfile, os\nckpt_path = os.path.join(tempfile.gettempdir(), \"tiny_regressor_ai_topics_a.pt\")\nsave_checkpoint(model, ckpt_path)\nreloaded = TinyRegressor(in_features=3)\nload_checkpoint(reloaded, ckpt_path)\nos.remove(ckpt_path)\n",
   "remember": [
    "zero_grad before backward, every batch; backward() accumulates into .grad by default, it does not overwrite.",
    "eval() and no_grad() solve different problems and are usually used together: eval() changes layer behavior, no_grad() skips graph bookkeeping.",
    "Freezing a layer means both param.requires_grad = False AND leaving it out of the optimizer's parameter list; requires_grad alone doesn't stop the optimizer from touching a frozen tensor if it's still handed to it.",
    "A state_dict is tensors by name; loading into a different architecture fails or, worse under strict=False, silently loads nothing.",
    "Batch size and shuffling change training dynamics, not speed; a shrinking loss curve that looks stalled is sometimes a batching artifact, not a broken model."
   ],
   "asks": [
    {
     "q": "Why call optimizer.zero_grad() before backward() instead of after?",
     "a": "backward() accumulates gradients into .grad with += rather than overwriting them, so without a zero_grad() call at the start of each batch, gradients from the previous step get added on top of the new ones and corrupt the update."
    },
    {
     "q": "What's the difference between model.eval() and torch.no_grad()?",
     "a": "eval() switches modules like dropout and batchnorm to their inference behavior; no_grad() disables autograd's graph-building to save memory and time. They solve different problems, which is why evaluation code almost always uses both together rather than either alone."
    },
    {
     "q": "How would you fine-tune only part of a pretrained model?",
     "a": "Set requires_grad=False on the parameters you want frozen, and only pass the remaining trainable parameters into the optimizer. The frozen layers still run during forward(), they receive no gradient and get no update from optimizer.step()."
    }
   ],
   "vars": [
    {
     "n": "Now add a validation split and early stopping",
     "ex": {
      "i": "a held-out 16-example split",
      "o": "training stops once validation loss stops improving for 2 epochs",
      "w": "shows a loop that watches a held-out metric instead of running a fixed epoch count"
     },
     "t": "Track the best validation loss seen so far; stop once it fails to improve for `patience` epochs in a row instead of training a fixed number of epochs.",
     "code": "\ndef train_with_early_stopping(model, loader, val_x, val_y, optimizer, loss_fn, patience=2, max_epochs=10):\n    best_val = float(\"inf\")\n    bad_epochs = 0\n    for epoch in range(max_epochs):\n        train_one_epoch(model, loader, optimizer, loss_fn)\n        val_loss = evaluate(model, val_x, val_y, loss_fn)\n        if val_loss < best_val:\n            best_val, bad_epochs = val_loss, 0\n        else:\n            bad_epochs += 1\n            if bad_epochs >= patience:\n                break\n    return best_val\n\nval_x = torch.randn(16, 3)\nval_y = val_x @ true_w + 0.1 * torch.randn(16)\nearly_stop_val_loss = train_with_early_stopping(model, loader, val_x, val_y, optimizer, loss_fn)\n"
    },
    {
     "n": "Now freeze the body and fine-tune only the head",
     "ex": {
      "i": "a 2-layer net with a frozen body",
      "o": "only the head's parameters have nonzero gradients",
      "w": "shows freezing a layer AND excluding it from the optimizer"
     },
     "t": "Freezing requires two things: requires_grad = False on the frozen parameters, and building the optimizer from only the remaining trainable parameters.",
     "code": "\nclass TwoLayerRegressor(nn.Module):\n    def __init__(self, in_features):\n        super().__init__()\n        self.body = nn.Linear(in_features, 8)\n        self.head = nn.Linear(8, 1)\n\n    def forward(self, x):\n        return self.head(torch.relu(self.body(x))).squeeze(-1)\n\nfinetune_model = TwoLayerRegressor(in_features=3)\nfor param in finetune_model.body.parameters():\n    param.requires_grad = False\nfinetune_optimizer = torch.optim.SGD(\n    [p for p in finetune_model.parameters() if p.requires_grad], lr=0.1\n)\nfinetune_loader = make_loader(x, y, batch_size=8)\nfinetune_loss = train_one_epoch(finetune_model, finetune_loader, finetune_optimizer, loss_fn)\nfrozen_param_count = sum(p.numel() for p in finetune_model.body.parameters())\ntrainable_param_count = sum(p.numel() for p in finetune_model.head.parameters())\n"
    },
    {
     "n": "Now clip gradients before the optimizer step",
     "ex": {
      "i": "one batch's gradients",
      "o": "a gradient norm capped at 1.0 before the step is applied",
      "w": "shows where clipping sits relative to backward and step"
     },
     "t": "Clipping happens after backward() has populated .grad but before optimizer.step() consumes it; it caps the gradient norm so one bad batch can't blow up the weights.",
     "code": "\nclip_model = TinyRegressor(in_features=3)\nclip_optimizer = torch.optim.SGD(clip_model.parameters(), lr=0.1)\nclip_optimizer.zero_grad()\npred = clip_model(x)\nloss = loss_fn(pred, y)\nloss.backward()\ntorch.nn.utils.clip_grad_norm_(clip_model.parameters(), max_norm=1.0)\ngrad_norm_after_clip = torch.sqrt(sum((p.grad ** 2).sum() for p in clip_model.parameters()))\nclip_optimizer.step()\n"
    }
   ],
   "sheet": {
    "spot": "Write a training loop from scratch, no Trainer class.",
    "move": "forward, loss, backward, step, zero_grad - every batch.",
    "code": "for xb, yb in loader:\n    opt.zero_grad()\n    pred = model(xb)\n    loss = loss_fn(pred, yb)\n    loss.backward()\n    opt.step()",
    "notes": [
     "zero_grad before backward, not after - grads accumulate by default.",
     "eval() changes layer behavior; no_grad() skips the graph. Use both.",
     "freezing needs requires_grad=False AND excluding it from the optimizer."
    ]
   },
   "figs": [
    "trainLoop",
    "descent",
    "chain"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "embed",
   "title": "Embeddings and vector search",
   "group": "AI systems",
   "spot": "Building retrieval over a document set without a vector database. <b>Signal:</b> \"build search over these docs\", \"no pinecone/faiss\", \"combine keyword and semantic search\".",
   "cx": "Embedding is the slow, batchable step, done once per chunk; retrieval at query time is one matmul against the index, cheap even at hundreds of thousands of vectors.",
   "ex": {
    "i": "\"how many days do I have to return something\" over a chunked policy document",
    "o": "the refund-window chunk ranked first by both dense and hybrid search",
    "w": "shows chunk, embed, index, and retrieve as one flow with a keyword fallback"
   },
   "hld": [
    "Chunk: split text into overlapping pieces sized for the embedding model.",
    "Embed and normalise: turn text into a unit vector so dot product equals cosine similarity.",
    "Index as a matrix: stack chunk vectors into one array for a single matmul at query time.",
    "Embed the query: same embedding function, same normalisation, as the chunks.",
    "Top k by dot product: index @ query, then argsort for the highest scores.",
    "Hybrid with keyword scores: blend a BM25-style score with the dense score.",
    "Metadata filters: restrict the candidate set before scoring, not after."
   ],
   "parts": [
    {
     "n": "Chunk text",
     "t": "Split on a word count with overlap so a sentence that straddles a chunk boundary is still readable in at least one chunk.",
     "code": "\nimport hashlib\nimport re\nfrom collections import Counter\nimport numpy as np\n\ndef chunk_text(text: str, max_words: int = 15, overlap: int = 4) -> list[str]:\n    words = text.split()\n    chunks = []\n    start = 0\n    while start < len(words):\n        end = start + max_words\n        chunks.append(\" \".join(words[start:end]))\n        if end >= len(words):\n            break\n        start = end - overlap\n    return chunks\n"
    },
    {
     "n": "Fake embed and normalise",
     "t": "A deterministic hashed bag-of-words stands in for a real embedding call: every token hashes into a fixed dimension, giving a reproducible vector without a real model. Normalising means the later dot product equals cosine similarity.",
     "code": "\nEMBED_DIM = 64\n\ndef _hash_bucket(token: str, dim: int) -> int:\n    # md5 instead of the builtin hash(): builtin hash() is randomized per process for\n    # strings, which would make retrieval ranking non-reproducible between runs\n    return int(hashlib.md5(token.encode()).hexdigest(), 16) % dim\n\ndef fake_embed(text: str) -> np.ndarray:\n    # real: client.embeddings.create(model=..., input=text)\n    vec = np.zeros(EMBED_DIM, dtype=np.float32)\n    for token in re.findall(r\"[a-z0-9]+\", text.lower()):\n        vec[_hash_bucket(token, EMBED_DIM)] += 1.0\n    norm = np.linalg.norm(vec)\n    return vec / norm if norm > 0 else vec\n"
    },
    {
     "n": "Build the index matrix",
     "t": "Stacking every chunk vector into one array turns retrieval into a single matmul instead of a per-chunk python loop.",
     "code": "\ndef build_index(chunks: list[str]) -> np.ndarray:\n    return np.stack([fake_embed(c) for c in chunks])\n"
    },
    {
     "n": "Top k by dot product",
     "t": "Both sides are unit vectors, so the dot product already is cosine similarity; no extra division needed at query time.",
     "code": "\ndef top_k(query: str, chunks: list[str], index: np.ndarray, k: int = 3) -> list[tuple[str, float]]:\n    q = fake_embed(query)\n    scores = index @ q\n    order = np.argsort(-scores)[:k]\n    return [(chunks[i], float(scores[i])) for i in order]\n"
    },
    {
     "n": "Hybrid with keyword scores",
     "t": "A simplified BM25-style term-frequency score catches exact-word matches that a hashed embedding can dilute; blending needs both scores rescaled onto a comparable range first.",
     "code": "\ndef bm25_like_score(query: str, chunk: str) -> float:\n    q_terms = re.findall(r\"[a-z0-9]+\", query.lower())\n    c_terms = re.findall(r\"[a-z0-9]+\", chunk.lower())\n    counts = Counter(c_terms)\n    return sum(counts[t] for t in q_terms) / (len(c_terms) + 1)\n\ndef hybrid_top_k(query, chunks, index, k=3, alpha=0.5):\n    dense = index @ fake_embed(query)\n    sparse = np.array([bm25_like_score(query, c) for c in chunks])\n    sparse = sparse / (sparse.max() + 1e-8)\n    combined = alpha * dense + (1 - alpha) * sparse\n    order = np.argsort(-combined)[:k]\n    return [(chunks[i], float(combined[i])) for i in order]\n"
    },
    {
     "n": "Metadata filters",
     "t": "Filter the candidate set before scoring, not after; scoring everything and filtering afterward can return fewer than k results or let an excluded match crowd out one that should have been kept.",
     "code": "\ndef filtered_top_k(query, records, index, k=3, where=None):\n    allowed = [i for i, r in enumerate(records) if where is None or where(r[\"meta\"])]\n    if not allowed:\n        return []\n    sub_index = index[allowed]\n    q = fake_embed(query)\n    scores = sub_index @ q\n    order = np.argsort(-scores)[:k]\n    return [(records[allowed[i]][\"text\"], float(scores[i])) for i in order]\n"
    }
   ],
   "tpl": "\ndocument = (\n    \"The refund policy allows returns within 30 days of purchase with a receipt. \"\n    \"Shipping typically takes 3 to 5 business days within the continental US. \"\n    \"International orders may be subject to customs fees set by the destination country.\"\n)\nchunks = chunk_text(document, max_words=15, overlap=4)\nrecords = [{\"text\": c, \"meta\": {\"source\": f\"chunk{i}\"}} for i, c in enumerate(chunks)]\nindex = build_index(chunks)\n\nquery = \"how many days do I have to return something\"\ndense_hits = top_k(query, chunks, index, k=2)\nhybrid_hits = hybrid_top_k(query, chunks, index, k=2, alpha=0.6)\nfiltered_hits = filtered_top_k(query, records, index, k=2, where=lambda m: m[\"source\"] != records[0][\"meta\"][\"source\"])\n",
   "remember": [
    "Normalise embeddings once at index time and once for the query; skip it and the dot product stops being cosine similarity.",
    "Embedding is batchable and cacheable; only re-embed chunks that changed, not the whole corpus on every run.",
    "Apply metadata filters before ranking, not after, or a good match gets crowded out by an excluded one that should never have been scored.",
    "Hybrid search needs both scores rescaled onto a comparable range before blending; raw BM25-style counts and cosine similarity live in different numeric ranges.",
    "A fixed top-k returns garbage when nothing in the corpus is relevant; a score threshold or a reranker catches what a fixed k can't."
   ],
   "asks": [
    {
     "q": "Why normalise the embeddings before taking a dot product?",
     "a": "Normalising makes every vector unit length, so the dot product reduces to exactly cosine similarity. Without it, the score is inflated by vector magnitude, and a longer or more repetitive chunk would win purely on length rather than relevance."
    },
    {
     "q": "How do you combine keyword and semantic search without one dominating?",
     "a": "Rescale each score onto a comparable range, such as dividing by its own max, then blend with a tunable weight. Without rescaling, whichever score happens to have the larger raw numbers dominates the ranking regardless of actual relevance."
    },
    {
     "q": "Your index has a metadata field like source or date. How do you restrict retrieval to a subset?",
     "a": "Filter the candidate set before scoring, not after. Scoring everything and filtering afterward can return fewer than k results, or let an excluded document's high score crowd out an included document that ranked lower but should have been kept."
    }
   ],
   "vars": [
    {
     "n": "Now add an embedding cache so re-indexing skips unchanged chunks",
     "ex": {
      "i": "indexing the same chunks twice",
      "o": "the second pass makes zero new embedding calls",
      "w": "shows why embedding is the step worth caching"
     },
     "t": "Key the cache on the chunk text (a content hash in a real system); the second build reuses cached vectors instead of recomputing them.",
     "code": "\nembed_cache: dict[str, np.ndarray] = {}\n\ndef cached_embed(text: str) -> np.ndarray:\n    if text not in embed_cache:\n        embed_cache[text] = fake_embed(text)\n    return embed_cache[text]\n\ndef build_index_cached(chunks):\n    return np.stack([cached_embed(c) for c in chunks])\n\nindex_first_pass = build_index_cached(chunks)\ncache_size_after_first_pass = len(embed_cache)\nindex_second_pass = build_index_cached(chunks)\ncache_size_after_second_pass = len(embed_cache)\n"
    },
    {
     "n": "Now use a score threshold instead of a fixed k",
     "ex": {
      "i": "the same query",
      "o": "a variable-length result: everything over the bar, possibly zero or all of them",
      "w": "shows a fixed k returning noise when relevance actually falls off a cliff"
     },
     "t": "A threshold returns however many chunks clear the bar, which can be zero (nothing relevant) or the whole corpus, unlike a fixed k that always returns exactly k results regardless of quality.",
     "code": "\ndef top_by_threshold(query, chunks, index, min_score=0.15):\n    q = fake_embed(query)\n    scores = index @ q\n    order = np.argsort(-scores)\n    return [(chunks[i], float(scores[i])) for i in order if scores[i] >= min_score]\n\nthreshold_hits = top_by_threshold(query, chunks, index, min_score=0.05)\nno_match_hits = top_by_threshold(\"completely unrelated topic about volcanoes\", chunks, index, min_score=0.9)\n"
    },
    {
     "n": "Now rerank the dense top-k with the keyword score instead of blending upfront",
     "ex": {
      "i": "the same query",
      "o": "the dense candidate set reordered by exact term overlap",
      "w": "shows a cheap two-stage retrieve-then-rerank instead of blending scores in one pass"
     },
     "t": "Stage one is a cheap dense search over the whole index to get a small candidate set; stage two reranks only that small set with the keyword score, which is cheap precisely because it never touches the full corpus.",
     "code": "\ndef retrieve_then_rerank(query, chunks, index, first_k=3, final_k=2):\n    dense_candidates = top_k(query, chunks, index, k=first_k)\n    reranked = sorted(\n        dense_candidates,\n        key=lambda pair: bm25_like_score(query, pair[0]),\n        reverse=True,\n    )\n    return reranked[:final_k]\n\nreranked_hits = retrieve_then_rerank(query, chunks, index)\n"
    }
   ],
   "sheet": {
    "spot": "Given a parser's output, retrieve the top matches for a query.",
    "move": "normalize embeddings, one matmul against the index, argsort.",
    "code": "idx = np.stack([embed(c) for c in chunks])\nq = embed(query)\nscores = idx @ q\ntop = np.argsort(-scores)[:k]\nhits = [chunks[i] for i in top]",
    "notes": [
     "dot product = cosine only if both sides are unit-normalized.",
     "filter by metadata before scoring, never after.",
     "cache embeddings; re-embedding unchanged chunks wastes the slow step."
    ]
   },
   "figs": [
    "vectors",
    "embed",
    "hybridRetrieval"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "rag",
   "title": "RAG over a parser's output",
   "group": "AI systems",
   "spot": "Given a document parser's structured output, build retrieval-augmented answers with citations. <b>Signal:</b> \"here is our parser, build RAG over it\", \"answers must cite the source\".",
   "cx": "Retrieval and rerank are cheap, a matmul and a small sort; the LLM call is the slow, expensive step, so keep the reranked set small before it ever reaches the prompt.",
   "ex": {
    "i": "\"how much PTO do I accrue per month\" over 4 parsed policy blocks",
    "o": "an answer citing [1], resolving to the PTO chunk with its page and section",
    "w": "shows structure-aware chunking carrying metadata through to a checkable citation"
   },
   "hld": [
    "Parser output: blocks of text, each carrying its page and section.",
    "Chunk by structure with overlap, keeping metadata: split on structure, not a blind window.",
    "Embed and index: vectorize each chunk, stack into a matrix.",
    "Retrieve top k: one matmul against the index, argsort.",
    "Rerank: score the small candidate set more precisely, e.g. by term overlap.",
    "Prompt with numbered sources: number every retrieved chunk so a citation can point to one.",
    "LLM answer with citations: the model answers and cites sources by number.",
    "Check the citations: every cited number must resolve to a retrieved source."
   ],
   "parts": [
    {
     "n": "Parser output blocks",
     "t": "What a document parser hands you: text already split into blocks, each carrying the page and section it came from. That's the metadata a citation depends on later.",
     "code": "\nfrom dataclasses import dataclass\nimport hashlib\nimport re\nimport numpy as np\n\n@dataclass\nclass Block:\n    text: str\n    page: int\n    section: str\n\ndef fake_parser_output() -> list[Block]:\n    return [\n        Block(\"Employees accrue 1.5 days of PTO per month worked, capped at 20 days per year.\", 1, \"Time Off\"),\n        Block(\"Unused PTO does not roll over into the next calendar year.\", 1, \"Time Off\"),\n        Block(\"Remote employees must be available during core hours, 10am to 3pm local time.\", 2, \"Remote Work\"),\n        Block(\"Expense reports over $500 require manager approval before reimbursement.\", 3, \"Expenses\"),\n    ]\n"
    },
    {
     "n": "Chunk by structure with overlap, keeping metadata",
     "t": "Chunking walks each block, not the whole document blindly, so a chunk never crosses a section boundary; metadata rides along with every chunk or a citation later has nothing to point back to.",
     "code": "\n@dataclass\nclass Chunk:\n    text: str\n    page: int\n    section: str\n    chunk_id: int\n\ndef chunk_blocks(blocks: list[Block], max_chars: int = 160, overlap_chars: int = 30) -> list[Chunk]:\n    chunks = []\n    cid = 0\n    for block in blocks:\n        text = block.text\n        start = 0\n        while start < len(text):\n            end = start + max_chars\n            piece = text[start:end]\n            chunks.append(Chunk(piece, block.page, block.section, cid))\n            cid += 1\n            if end >= len(text):\n                break\n            start = end - overlap_chars\n    return chunks\n"
    },
    {
     "n": "Embed and index",
     "t": "Same hashed bag-of-words trick as plain embedding search; stacked once into a matrix for a single matmul at query time.",
     "code": "\nEMBED_DIM = 64\n\ndef _hash_bucket(token: str, dim: int) -> int:\n    return int(hashlib.md5(token.encode()).hexdigest(), 16) % dim\n\ndef fake_embed(text: str) -> np.ndarray:\n    # real: client.embeddings.create(model=..., input=text)\n    vec = np.zeros(EMBED_DIM, dtype=np.float32)\n    for token in re.findall(r\"[a-z0-9]+\", text.lower()):\n        vec[_hash_bucket(token, EMBED_DIM)] += 1.0\n    norm = np.linalg.norm(vec)\n    return vec / norm if norm > 0 else vec\n\ndef build_index(chunks: list[Chunk]) -> np.ndarray:\n    return np.stack([fake_embed(c.text) for c in chunks])\n"
    },
    {
     "n": "Retrieve top k",
     "t": "One matmul against the whole index, then argsort; the cheap approximate pass that narrows a large corpus down to a small candidate set.",
     "code": "\ndef retrieve(query: str, chunks: list[Chunk], index: np.ndarray, k: int = 3) -> list[Chunk]:\n    q = fake_embed(query)\n    scores = index @ q\n    order = np.argsort(-scores)[:k]\n    return [chunks[i] for i in order]\n"
    },
    {
     "n": "Rerank",
     "t": "A real reranker is a cross-encoder scoring (query, chunk) pairs jointly, far more accurate but too slow to run over a whole index; it only runs on the small candidate set retrieval already narrowed down.",
     "code": "\ndef rerank(query: str, candidates: list[Chunk]) -> list[Chunk]:\n    def overlap_score(chunk: Chunk) -> int:\n        q_terms = set(re.findall(r\"[a-z0-9]+\", query.lower()))\n        c_terms = set(re.findall(r\"[a-z0-9]+\", chunk.text.lower()))\n        return len(q_terms & c_terms)\n    return sorted(candidates, key=overlap_score, reverse=True)\n"
    },
    {
     "n": "Prompt with numbered sources and LLM answer with citations",
     "t": "Numbering every retrieved chunk in the prompt gives the model something concrete to cite by number, instead of a free-text reference that's hard to verify.",
     "code": "\ndef build_prompt(query: str, sources: list[Chunk]) -> str:\n    numbered = \"\\n\".join(f\"[{i+1}] (p.{s.page}, {s.section}) {s.text}\" for i, s in enumerate(sources))\n    return (\n        f\"Answer the question using only the numbered sources. Cite each claim as [n].\\n\\n\"\n        f\"Sources:\\n{numbered}\\n\\nQuestion: {query}\"\n    )\n\ndef fake_llm_answer(prompt: str, sources: list[Chunk]) -> str:\n    # real: client.messages.create(model=..., messages=[{\"role\": \"user\", \"content\": prompt}])\n    query_line = prompt.rsplit(\"Question: \", 1)[-1]\n    q_terms = set(re.findall(r\"[a-z0-9]+\", query_line.lower()))\n    best_i, best_overlap = 0, -1\n    for i, s in enumerate(sources):\n        overlap = len(q_terms & set(re.findall(r\"[a-z0-9]+\", s.text.lower())))\n        if overlap > best_overlap:\n            best_i, best_overlap = i, overlap\n    return f\"{sources[best_i].text} [{best_i + 1}]\"\n"
    },
    {
     "n": "Check the citations",
     "t": "Every citation number in the answer must resolve to one of the sources actually retrieved; an uncited claim or an out-of-range citation number is treated as a failure, not waved through.",
     "code": "\nCITATION_RE = re.compile(r\"\\[(\\d+)\\]\")\n\ndef check_citations(answer: str, sources: list[Chunk]) -> bool:\n    cited = [int(n) for n in CITATION_RE.findall(answer)]\n    if not cited:\n        return False\n    return all(1 <= n <= len(sources) for n in cited)\n"
    }
   ],
   "tpl": "\nblocks = fake_parser_output()\nchunks = chunk_blocks(blocks)\nindex = build_index(chunks)\n\nquery = \"how much PTO do I accrue per month\"\ncandidates = retrieve(query, chunks, index, k=3)\nranked = rerank(query, candidates)\nprompt = build_prompt(query, ranked)\nanswer = fake_llm_answer(prompt, ranked)\ncitations_ok = check_citations(answer, ranked)\n",
   "remember": [
    "Chunk on structural boundaries (blocks, sections, pages), not a fixed character count blind to sentence or table edges; carry page/section metadata on every chunk or citations have nothing to point to.",
    "Overlap between chunks trades a bit of duplicate content for not losing a sentence that straddles a cut.",
    "Rerank only the top-k candidates, never the full index; the point of retrieval is to shrink the set the expensive step has to look at.",
    "Number the sources in the prompt and require citation by number; free-text citations are much harder to verify against the actual retrieved chunks.",
    "Checking citations means the numbers resolve to real sources, not that the answer is factually correct; it catches fabricated references, not factual errors."
   ],
   "asks": [
    {
     "q": "Why chunk by structure instead of a fixed token window?",
     "a": "A fixed window cuts mid-sentence or mid-table with no regard for meaning. Structural chunking, using the parser's own block or section boundaries, keeps each chunk coherent, and carrying that block's page and section metadata through the chunk is what makes a later citation checkable."
    },
    {
     "q": "What does reranking add that retrieval alone doesn't?",
     "a": "Initial retrieval, a bi-encoder dot product, is fast but approximate because the query and document are embedded independently. A reranker looks at the query and each candidate together, which is more accurate but too slow to run over a whole index, so it only reorders the small top-k set retrieval already narrowed down."
    },
    {
     "q": "How do you keep a RAG system from making up citations?",
     "a": "Require numbered sources in the prompt and instruct the model to cite by number, then programmatically check that every citation number in the answer resolves to one of the sources actually retrieved. An answer with no citations, or a citation number outside the source list, gets rejected or flagged rather than trusted."
    }
   ],
   "vars": [
    {
     "n": "Now refuse instead of answering when nothing is relevant",
     "ex": {
      "i": "a question with no matching policy section",
      "o": "a refusal instead of a fabricated answer",
      "w": "shows a relevance bar on the reranked set, not just top-k regardless of quality"
     },
     "t": "Add a minimum overlap bar to the reranked candidates; if nothing clears it, the corpus doesn't actually answer the question, so refuse rather than forcing an answer out of a weak match.",
     "code": "\ndef rerank_with_bar(query, candidates, min_overlap=1):\n    scored = []\n    for c in candidates:\n        q_terms = set(re.findall(r\"[a-z0-9]+\", query.lower()))\n        c_terms = set(re.findall(r\"[a-z0-9]+\", c.text.lower()))\n        scored.append((len(q_terms & c_terms), c))\n    scored.sort(key=lambda pair: pair[0], reverse=True)\n    return [c for score, c in scored if score >= min_overlap]\n\noff_topic_query = \"what is the parking validation policy\"\noff_topic_candidates = retrieve(off_topic_query, chunks, index, k=3)\nrelevant = rerank_with_bar(off_topic_query, off_topic_candidates, min_overlap=2)\nrefusal_answer = (\n    \"I don't have enough information in the provided sources to answer that.\"\n    if not relevant else fake_llm_answer(build_prompt(off_topic_query, relevant), relevant)\n)\n"
    },
    {
     "n": "Now cite multiple sources for one merged claim",
     "ex": {
      "i": "a claim spanning two chunks",
      "o": "an answer citing both, e.g. \"...[1][2]\"",
      "w": "shows the citation checker validating more than one number per answer"
     },
     "t": "A claim that draws on two sources cites both by number; the citation checker doesn't care how many numbers appear, only that each one resolves.",
     "code": "\ndef fake_llm_answer_multi(prompt: str, sources: list[Chunk]) -> str:\n    query_line = prompt.rsplit(\"Question: \", 1)[-1]\n    q_terms = set(re.findall(r\"[a-z0-9]+\", query_line.lower()))\n    scored = sorted(\n        range(len(sources)),\n        key=lambda i: len(q_terms & set(re.findall(r\"[a-z0-9]+\", sources[i].text.lower()))),\n        reverse=True,\n    )\n    top_two = scored[:2] if len(scored) >= 2 else scored\n    merged_text = \" and \".join(sources[i].text for i in top_two)\n    citation = \"\".join(f\"[{i + 1}]\" for i in sorted(top_two))\n    return f\"{merged_text} {citation}\"\n\nmulti_answer = fake_llm_answer_multi(prompt, ranked)\nmulti_citations_ok = check_citations(multi_answer, ranked)\n"
    },
    {
     "n": "Now restrict retrieval to one section the user picked",
     "ex": {
      "i": "the same PTO question, scoped to the \"Time Off\" section only",
      "o": "candidates drawn only from Time Off chunks",
      "w": "shows filtering the index before scoring, not after"
     },
     "t": "Filter the chunk list to the chosen section before building the sub-index to score against; scoring the whole index and filtering afterward risks returning fewer than k results.",
     "code": "\ndef retrieve_in_section(query, chunks, index, section, k=3):\n    allowed = [i for i, c in enumerate(chunks) if c.section == section]\n    if not allowed:\n        return []\n    sub_index = index[allowed]\n    q = fake_embed(query)\n    scores = sub_index @ q\n    order = np.argsort(-scores)[:k]\n    return [chunks[allowed[i]] for i in order]\n\nsection_scoped_hits = retrieve_in_section(query, chunks, index, section=\"Time Off\", k=2)\n"
    }
   ],
   "sheet": {
    "spot": "Retrieve from a parser's blocks and answer with a citation.",
    "move": "chunk with metadata, retrieve, rerank, cite by number, verify.",
    "code": "chunks = chunk_blocks(blocks)\nidx = build_index(chunks)\ncands = retrieve(query, chunks, idx, k=5)\nranked = rerank(query, cands)[:3]\nans = llm(prompt(query, ranked))\nok = check_citations(ans, ranked)",
    "notes": [
     "metadata (page, section) must ride the chunk from parse to citation.",
     "rerank only the retrieved top-k, never the whole index.",
     "a citation check verifies the number resolves, not that it's true."
    ]
   },
   "figs": [
    "ragPipeline",
    "hybridRetrieval"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "graphrag",
   "title": "GraphRAG",
   "group": "AI systems",
   "spot": "The answer requires connecting facts that live in different chunks, not something a single retrieved passage states directly. <b>Signal:</b> \"multi-hop question\", \"who is ultimately responsible for\", \"build a knowledge graph from these docs\".",
   "cx": "Extraction is the expensive step, one LLM call per chunk, done once and cacheable; graph traversal at query time is pointer-following over an adjacency list, effectively free next to the LLM calls on either end.",
   "ex": {
    "i": "a document about a team and its dependency chain, question about who is ultimately responsible",
    "o": "the chain traced 3 hops to the maintaining team, with a citation",
    "w": "shows GraphRAG answering a question no single chunk states directly, by walking relations"
   },
   "hld": [
    "Chunks: split the document into pieces small enough to extract facts from.",
    "Extract triples with an LLM: pull (subject, relation, object) facts from each chunk.",
    "Build the graph: nodes and edges, each edge tagged with its source chunk.",
    "Find the query's entities: match named entities in the query against graph nodes.",
    "Expand the neighbourhood (k hops): walk outward from the seed entities.",
    "Gather facts and their chunks: collect the edges touched, deduped, with citations.",
    "Answer with an LLM: synthesize the gathered facts into a cited answer."
   ],
   "parts": [
    {
     "n": "Chunks",
     "t": "Split on sentence boundaries so each fact extracted later stays inside one chunk instead of straddling two.",
     "code": "\ndef make_chunks(text: str) -> list[str]:\n    return [s.strip() for s in text.split(\". \") if s.strip()]\n"
    },
    {
     "n": "Extract triples with an LLM",
     "t": "A deterministic lookup stands in for the extraction call: a real one would ask an LLM to pull (subject, relation, object) triples out of the chunk text.",
     "code": "\nfrom dataclasses import dataclass\n\n@dataclass\nclass Triple:\n    subject: str\n    relation: str\n    obj: str\n    source_chunk: int\n\ndef fake_llm_extract_triples(chunk: str, chunk_id: int) -> list[Triple]:\n    # real: client.messages.create(..., prompt asking for (subject, relation, object) triples)\n    known = {\n        \"Ava leads the Platform team\": Triple(\"Ava\", \"leads\", \"Platform team\", chunk_id),\n        \"Platform team owns the deploy pipeline\": Triple(\"Platform team\", \"owns\", \"deploy pipeline\", chunk_id),\n        \"deploy pipeline depends on the artifact registry\": Triple(\"deploy pipeline\", \"depends_on\", \"artifact registry\", chunk_id),\n        \"artifact registry is maintained by the Infra team\": Triple(\"artifact registry\", \"maintained_by\", \"Infra team\", chunk_id),\n    }\n    return [triple for phrase, triple in known.items() if phrase in chunk]\n"
    },
    {
     "n": "Build the graph",
     "t": "An adjacency list keyed by node name; each edge is added in both directions so the later neighborhood expansion can walk outward from either endpoint, and every edge keeps the chunk id it came from.",
     "code": "\ndef build_graph(triples: list[Triple]) -> dict[str, list[tuple[str, str, int]]]:\n    graph: dict[str, list[tuple[str, str, int]]] = {}\n    for t in triples:\n        graph.setdefault(t.subject, []).append((t.relation, t.obj, t.source_chunk))\n        graph.setdefault(t.obj, []).append((t.relation, t.subject, t.source_chunk))\n    return graph\n"
    },
    {
     "n": "Find the query's entities and expand the neighbourhood",
     "t": "Naive substring matching finds which graph nodes the query mentions; expansion then does a bounded breadth-first walk outward, stopping early if a hop adds nothing new.",
     "code": "\ndef find_query_entities(query: str, graph: dict) -> list[str]:\n    return [node for node in graph if node.lower() in query.lower()]\n\ndef expand_neighborhood(seed_entities: list[str], graph: dict, hops: int = 2) -> set[str]:\n    frontier = set(seed_entities)\n    visited = set(seed_entities)\n    for _ in range(hops):\n        next_frontier = set()\n        for node in frontier:\n            for relation, neighbor, source_chunk in graph.get(node, []):\n                if neighbor not in visited:\n                    next_frontier.add(neighbor)\n        visited |= next_frontier\n        frontier = next_frontier\n        if not frontier:\n            break\n    return visited\n"
    },
    {
     "n": "Gather facts and their chunks",
     "t": "Collect every edge touching the visited neighborhood, deduped since each edge was stored on both endpoints; iterate nodes in a fixed order so the gathered fact list is reproducible.",
     "code": "\ndef gather_facts(entities: set[str], graph: dict) -> list[Triple]:\n    facts = []\n    seen = set()\n    for node in sorted(entities):\n        for relation, neighbor, source_chunk in graph.get(node, []):\n            key = tuple(sorted([node, neighbor])) + (relation,)\n            if key not in seen:\n                seen.add(key)\n                facts.append(Triple(node, relation, neighbor, source_chunk))\n    return facts\n"
    },
    {
     "n": "Answer with an LLM",
     "t": "The gathered facts, each still tagged with its source chunk, become numbered evidence for a final answer that cites by number, the same discipline as plain RAG.",
     "code": "\ndef build_graph_prompt(query: str, facts: list[Triple]) -> str:\n    lines = \"\\n\".join(f\"[{i+1}] {f.subject} {f.relation} {f.obj} (chunk {f.source_chunk})\" for i, f in enumerate(facts))\n    return f\"Answer using only these facts, cite by number.\\n\\nFacts:\\n{lines}\\n\\nQuestion: {query}\"\n\ndef fake_llm_graph_answer(prompt: str, facts: list[Triple]) -> str:\n    # real: client.messages.create(...)\n    if not facts:\n        return \"Not enough connected facts to answer.\"\n    best = facts[-1]\n    return f\"{best.subject} {best.relation} {best.obj}. [{len(facts)}]\"\n"
    }
   ],
   "tpl": "\ndocument = (\n    \"Ava leads the Platform team. The Platform team owns the deploy pipeline. \"\n    \"The deploy pipeline depends on the artifact registry. \"\n    \"The artifact registry is maintained by the Infra team.\"\n)\nchunks = make_chunks(document)\nall_triples = [t for i, c in enumerate(chunks) for t in fake_llm_extract_triples(c, i)]\ngraph = build_graph(all_triples)\n\nquery = \"Who is ultimately responsible for what Ava's team depends on\"\nseeds = find_query_entities(\"Ava\", graph)\nneighborhood = expand_neighborhood(seeds, graph, hops=3)\nfacts = gather_facts(neighborhood, graph)\nprompt = build_graph_prompt(query, facts)\nanswer = fake_llm_graph_answer(prompt, facts)\n",
   "remember": [
    "Graph edges carry their source chunk id so a fact traced through the graph can still be cited back to text, the same discipline as chunk metadata in plain RAG.",
    "Extraction quality caps everything downstream; a missed or malformed triple is a broken edge the traversal can never repair.",
    "k hops is a real knob: too few misses the answer if it isn't directly in one chunk, too many pulls in unrelated facts and floods the prompt. Expand until the frontier stops growing or the hop limit, whichever comes first.",
    "Dedupe facts gathered from a neighborhood; the same edge is reachable from both of its endpoints since traversal is undirected.",
    "GraphRAG earns its cost over plain RAG specifically for multi-hop questions where the answer requires connecting facts across chunks; for a fact stated directly in one place, plain retrieval is simpler and cheaper.",
    "Local search starts from the entities in the question and walks their neighbourhood, for a question like 'what reads EMP_TABLE?'. Global search clusters the graph into communities, summarises each, and answers from the summaries, for 'what does this system do?'.",
    "Building the graph with an LLM is the expensive step. For code, a parser gives you the graph far more cheaply and reliably."
   ],
   "asks": [
    {
     "q": "When does GraphRAG beat plain vector RAG?",
     "a": "When the answer requires connecting facts that live in separate chunks, a multi-hop question like who is ultimately responsible for X, where no single chunk states the answer directly but a chain of relations does. For a fact stated in one place, plain retrieval is simpler and cheaper."
    },
    {
     "q": "How do you decide how many hops to expand?",
     "a": "Treat it as a tunable stopping condition: expand until the frontier of newly reached nodes stops growing, or a fixed hop limit, whichever comes first. Too few hops misses multi-hop answers; too many pulls in unrelated facts that dilute the prompt."
    },
    {
     "q": "How do you keep triple extraction from silently corrupting the graph?",
     "a": "Validate extracted triples against an allowed schema of relation types before inserting them, and keep the source chunk id on every triple so a suspicious edge can be traced back and checked against the text it supposedly came from."
    }
   ],
   "vars": [
    {
     "n": "Now find the shortest path, not just the last fact reached",
     "ex": {
      "i": "\"Ava\" to \"Infra team\"",
      "o": "the 4-hop chain through Platform team, deploy pipeline, artifact registry",
      "w": "shows the chain length itself is answerable, not just endpoint membership"
     },
     "t": "A breadth-first search finds the shortest path by construction: the first time the target is dequeued, that path used the fewest hops.",
     "code": "\ndef shortest_path(start: str, end: str, graph: dict) -> list[str] | None:\n    from collections import deque\n    queue = deque([[start]])\n    visited = {start}\n    while queue:\n        path = queue.popleft()\n        node = path[-1]\n        if node == end:\n            return path\n        for relation, neighbor, source_chunk in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(path + [neighbor])\n    return None\n\npath_to_infra = shortest_path(\"Ava\", \"Infra team\", graph)\npath_length = len(path_to_infra) - 1 if path_to_infra else None\n"
    },
    {
     "n": "Now two chunks disagree; keep both edges with a confidence field",
     "ex": {
      "i": "two conflicting depends_on triples for the same subject",
      "o": "both edges survive, each tagged with its own confidence",
      "w": "shows the graph not silently overwriting a conflicting fact"
     },
     "t": "Instead of one triple overwriting another for the same subject, both survive as separate edges, each carrying a confidence score a downstream consumer can use to prefer one over the other.",
     "code": "\n@dataclass\nclass ScoredTriple:\n    subject: str\n    relation: str\n    obj: str\n    source_chunk: int\n    confidence: float\n\ndef build_graph_with_confidence(triples_with_conf: list[tuple[Triple, float]]) -> dict:\n    graph_c: dict[str, list] = {}\n    for t, conf in triples_with_conf:\n        graph_c.setdefault(t.subject, []).append((t.relation, t.obj, t.source_chunk, conf))\n    return graph_c\n\nconflicting = [\n    (Triple(\"deploy pipeline\", \"depends_on\", \"artifact registry\", 2), 0.9),\n    (Triple(\"deploy pipeline\", \"depends_on\", \"config service\", 3), 0.4),\n]\ngraph_with_conf = build_graph_with_confidence(conflicting)\nedges_for_pipeline = graph_with_conf[\"deploy pipeline\"]\n"
    },
    {
     "n": "Now expand only along specific relation types",
     "ex": {
      "i": "expand from Ava following only leads/owns edges",
      "o": "the walk stops before crossing a depends_on edge",
      "w": "shows filtering the walk by relation type, not just by hop count"
     },
     "t": "Filtering which relation types the walk is allowed to cross keeps an ownership query from wandering into unrelated dependency edges, even within the hop budget.",
     "code": "\ndef expand_by_relation(seed_entities, graph, allowed_relations, hops=2):\n    frontier = set(seed_entities)\n    visited = set(seed_entities)\n    for _ in range(hops):\n        next_frontier = set()\n        for node in frontier:\n            for relation, neighbor, source_chunk in graph.get(node, []):\n                if relation in allowed_relations and neighbor not in visited:\n                    next_frontier.add(neighbor)\n        visited |= next_frontier\n        frontier = next_frontier\n        if not frontier:\n            break\n    return visited\n\nownership_only = expand_by_relation([\"Ava\"], graph, allowed_relations={\"leads\", \"owns\"}, hops=3)\n"
    }
   ],
   "sheet": {
    "spot": "Answer needs facts connected across chunks, not in one place.",
    "move": "extract triples, build adjacency, expand k hops, cite chunks.",
    "code": "trip = [extract(c, i) for i, c in enum(chunks)]\ngraph = build_graph(flatten(trip))\nseeds = find_entities(query, graph)\nnbhd = expand(seeds, graph, hops=2)\nfacts = gather_facts(nbhd, graph)\nans = llm(prompt(query, facts))",
    "notes": [
     "extraction quality caps everything downstream - a bad triple breaks an edge.",
     "hop count trades recall for prompt noise; stop when the frontier stalls.",
     "keep the source chunk id on every edge so a fact traces back to text."
    ]
   },
   "figs": [
    "graphRag"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "agent",
   "title": "An agent loop",
   "group": "AI systems",
   "spot": "Build a tool-using agent from scratch: model call, tool execution, and a loop, with no framework. <b>Signal:</b> \"implement the agent loop\", \"no LangChain\", \"what stops it from looping forever\".",
   "cx": "The model call is the slow, billed step; validating arguments and running a guarded tool is comparatively free, so validate before spending a tool call, or a retry round-trip, on bad input.",
   "ex": {
    "i": "\"What's the weather like right now?\"",
    "o": "a final answer citing the tool's observation, after exactly one tool call",
    "w": "shows the loop taking one tool step then stopping at a final answer, not the step limit"
   },
   "hld": [
    "User message: the new turn that starts this loop iteration.",
    "Build context: system prompt, conversation history, and durable memory, combined.",
    "Model call: the model reads context and returns either a tool call or a final answer.",
    "Tool call decision: the model's response says whether it wants to act or answer.",
    "Validate arguments and run the tool behind a guard: check the schema, then call it with a budget.",
    "Append the observation: the tool's result goes back into context for the next model call.",
    "Loop until a final answer or the step limit: keep calling the model until it's done or capped.",
    "Reply and write memory: return the final answer, save any durable fact worth keeping."
   ],
   "parts": [
    {
     "n": "User message and context",
     "t": "Memory is a small set of durable facts that survive across sessions; history is the raw transcript of this session. Both fold into context, but they aren't the same thing.",
     "code": "\nfrom dataclasses import dataclass\n\n@dataclass\nclass Message:\n    role: str  # \"system\" | \"user\" | \"assistant\" | \"tool\"\n    content: str\n\ndef build_context(system_prompt: str, history: list[Message], memory: dict, user_message: str) -> list[Message]:\n    memory_note = \"; \".join(f\"{k}: {v}\" for k, v in memory.items())\n    system = f\"{system_prompt}\\nKnown facts: {memory_note}\" if memory_note else system_prompt\n    return [Message(\"system\", system), *history, Message(\"user\", user_message)]\n"
    },
    {
     "n": "Model call decides tool or final answer",
     "t": "The model reads the whole context and decides, each turn, whether it needs a tool or can answer directly; the fake below inspects the last user turn and whether a tool observation is already present.",
     "code": "\nTOOLS = {\n    \"get_weather\": lambda args: f\"{args.get('city', 'unknown')}: 72F and sunny\",\n    \"search_docs\": lambda args: f\"found 2 matches for '{args.get('query', '')}'\",\n}\n\ndef fake_llm_step(context: list[Message]) -> dict:\n    # real: client.messages.create(model=..., messages=[...], tools=[...])\n    last_user = next((m.content for m in reversed(context) if m.role == \"user\"), \"\")\n    if \"weather\" in last_user.lower() and not any(m.role == \"tool\" for m in context):\n        return {\"type\": \"tool_call\", \"tool\": \"get_weather\", \"arguments\": {\"city\": \"Chicago\"}}\n    if any(m.role == \"tool\" for m in context):\n        observation = next(m.content for m in reversed(context) if m.role == \"tool\")\n        return {\"type\": \"final_answer\", \"content\": f\"Here's what I found: {observation}\"}\n    return {\"type\": \"final_answer\", \"content\": \"I don't have a tool for that.\"}\n"
    },
    {
     "n": "Validate the arguments",
     "t": "Every proposed tool call is checked against a schema before it reaches real code; a missing field or an unknown tool name (a hallucinated tool) fails here instead of inside the tool.",
     "code": "\nTOOL_SCHEMAS = {\n    \"get_weather\": {\"city\": str},\n    \"search_docs\": {\"query\": str},\n}\n\ndef validate_arguments(tool_name: str, arguments: dict) -> bool:\n    schema = TOOL_SCHEMAS.get(tool_name)\n    if schema is None:\n        return False\n    return all(name in arguments and isinstance(arguments[name], typ) for name, typ in schema.items())\n"
    },
    {
     "n": "Run the tool behind a guard",
     "t": "A per-turn call budget caps a runaway loop, and any exception a tool raises is caught and turned into an observation instead of crashing the whole agent turn.",
     "code": "\nMAX_TOOL_CALLS_PER_TURN = 3\n\ndef run_tool(tool_name: str, arguments: dict, calls_so_far: int) -> str:\n    if calls_so_far >= MAX_TOOL_CALLS_PER_TURN:\n        return \"error: tool call budget exceeded for this turn\"\n    if tool_name not in TOOLS:\n        return f\"error: unknown tool '{tool_name}'\"\n    try:\n        return TOOLS[tool_name](arguments)\n    except Exception as exc:\n        return f\"error: tool raised {exc}\"\n"
    },
    {
     "n": "Append the observation",
     "t": "The tool's result becomes part of the context for the next model call, the same as any other message; the model 'sees' a tool result by re-reading the transcript, not through a side channel.",
     "code": "\ndef append_observation(context: list[Message], observation: str) -> list[Message]:\n    return [*context, Message(\"tool\", observation)]\n"
    },
    {
     "n": "The loop until a final answer or the step limit",
     "t": "The step limit, checked every iteration independent of what the model says, is what turns a bug like a repeating tool call into a bounded failure instead of an infinite loop.",
     "code": "\nMAX_STEPS = 5\n\ndef run_agent(system_prompt: str, history: list[Message], memory: dict, user_message: str) -> tuple[str, list[Message]]:\n    context = build_context(system_prompt, history, memory, user_message)\n    tool_calls = 0\n    for step in range(MAX_STEPS):\n        decision = fake_llm_step(context)\n        if decision[\"type\"] == \"final_answer\":\n            return decision[\"content\"], context\n        tool_name, arguments = decision[\"tool\"], decision[\"arguments\"]\n        if not validate_arguments(tool_name, arguments):\n            context = append_observation(context, f\"error: invalid arguments for {tool_name}\")\n            continue\n        observation = run_tool(tool_name, arguments, tool_calls)\n        tool_calls += 1\n        context = append_observation(context, observation)\n    return \"I couldn't complete this within the step limit.\", context\n"
    },
    {
     "n": "Reply and write memory",
     "t": "Memory stays small and durable: a fact worth remembering next turn, not a copy of the transcript.",
     "code": "\ndef write_memory(memory: dict, user_message: str, final_answer: str) -> dict:\n    updated = dict(memory)\n    if \"weather\" in user_message.lower():\n        updated[\"last_topic\"] = \"weather\"\n    return updated\n"
    }
   ],
   "tpl": "\nmemory = {}\nhistory: list[Message] = []\nuser_message = \"What's the weather like right now?\"\n\nfinal_answer, final_context = run_agent(\"You are a helpful assistant with tools.\", history, memory, user_message)\nmemory = write_memory(memory, user_message, final_answer)\nsteps_taken = sum(1 for m in final_context if m.role == \"tool\")\n",
   "remember": [
    "The step limit is what turns a bug, the model looping on the same tool call, into a bounded failure instead of an infinite loop; always cap it and fail loudly when hit, never silently.",
    "Validate tool arguments against a schema before running the tool; a hallucinated argument or missing field should never reach real code, a real API call, a shell command, a database write.",
    "A tool must never raise past the loop; catch its exception and turn it into an observation the model can react to, or one bad tool call kills the whole turn.",
    "Memory is small and durable, facts worth keeping next turn; history is the raw transcript. Conflating them makes context grow unbounded and buries the facts that matter.",
    "The guard on tool execution, budget, allow-list, timeout, belongs next to the tool call itself, not scattered across every place a tool might get invoked."
   ],
   "asks": [
    {
     "q": "What stops an agent loop from running forever?",
     "a": "A hard step limit checked every iteration of the loop, independent of what the model says. When it's hit, the loop returns a clear failure instead of a guessed answer, so the caller can see the turn didn't complete rather than silently getting something wrong."
    },
    {
     "q": "Where do you validate a tool call's arguments, and why there?",
     "a": "Right after the model proposes the call and before it reaches the tool's real implementation, that's the one place every tool call passes through, so a schema check there, types, required fields, an allow-list of tool names, blocks a hallucinated or malformed call before it can touch a real API, a shell command, or a database."
    },
    {
     "q": "How is memory different from the conversation history you pass to the model?",
     "a": "History is the raw transcript of this session's turns; memory is a small set of durable facts meant to persist across sessions, a preference, a decision already made. Passing all of history back every turn as memory makes context grow unbounded and buries the handful of facts that actually need to survive."
    }
   ],
   "vars": [
    {
     "n": "Now two tools can run per step, not just one",
     "ex": {
      "i": "a request needing weather and a doc search",
      "o": "both tool calls validated and run independently in the same step",
      "w": "shows each proposed call still going through the same guard, just more than one at a time"
     },
     "t": "The model can propose several tool calls in one step; each one still goes through the same validate-then-guard path independently, so one bad call among several doesn't block the rest.",
     "code": "\ndef fake_llm_parallel_step(context: list[Message]) -> dict:\n    last_user = next((m.content for m in reversed(context) if m.role == \"user\"), \"\")\n    if \"weather\" in last_user.lower() and \"docs\" in last_user.lower() and not any(m.role == \"tool\" for m in context):\n        return {\"type\": \"tool_calls\", \"calls\": [\n            {\"tool\": \"get_weather\", \"arguments\": {\"city\": \"Chicago\"}},\n            {\"tool\": \"search_docs\", \"arguments\": {\"query\": \"weather policy\"}},\n        ]}\n    return {\"type\": \"final_answer\", \"content\": \"combined result\"}\n\nparallel_decision = fake_llm_parallel_step(build_context(\"sys\", [], {}, \"weather and docs please\"))\nparallel_observations = []\nfor call_index, call in enumerate(parallel_decision[\"calls\"]):\n    if validate_arguments(call[\"tool\"], call[\"arguments\"]):\n        parallel_observations.append(run_tool(call[\"tool\"], call[\"arguments\"], call_index))\nparallel_tool_count = len(parallel_observations)\n"
    },
    {
     "n": "Now a sensitive tool needs approval before it runs",
     "ex": {
      "i": "a search_docs call marked sensitive, denied by the approval callback",
      "o": "an error observation instead of the tool result",
      "w": "shows the guard denying execution outright rather than running and asking forgiveness"
     },
     "t": "A sensitive tool checks an approval callback before running at all; a denial returns an error observation the model can react to, the tool body never executes.",
     "code": "\nSENSITIVE_TOOLS = {\"search_docs\"}\n\ndef run_tool_with_approval(tool_name, arguments, calls_so_far, approve_fn):\n    if tool_name in SENSITIVE_TOOLS and not approve_fn(tool_name, arguments):\n        return \"error: user did not approve this tool call\"\n    return run_tool(tool_name, arguments, calls_so_far)\n\napprovals_seen = []\ndef auto_deny(tool_name, arguments):\n    approvals_seen.append((tool_name, arguments))\n    return False\n\ndenied_result = run_tool_with_approval(\"search_docs\", {\"query\": \"salary bands\"}, 0, auto_deny)\n"
    },
    {
     "n": "Now retry a failed tool call once with the error fed back",
     "ex": {
      "i": "a call to a nonexistent tool",
      "o": "one retry, then the error is returned rather than retried forever",
      "w": "shows a bounded retry instead of either giving up immediately or looping unbounded"
     },
     "t": "A bounded retry gives a transient failure one more chance, but the retry count is capped the same way the step limit caps the outer loop; it does not retry forever.",
     "code": "\ndef run_tool_with_retry(tool_name, arguments, calls_so_far, max_retries=1):\n    attempt = 0\n    last_error = None\n    while attempt <= max_retries:\n        result = run_tool(tool_name, arguments, calls_so_far + attempt)\n        if not result.startswith(\"error:\"):\n            return result\n        last_error = result\n        attempt += 1\n    return last_error\n\nretry_result = run_tool_with_retry(\"unknown_tool\", {}, 0, max_retries=1)\n"
    }
   ],
   "sheet": {
    "spot": "Build a tool-using agent loop from scratch.",
    "move": "model call, validate args, guarded tool run, append, cap steps.",
    "code": "for step in range(MAX_STEPS):\n    d = llm(ctx)\n    if d[\"type\"] == \"final_answer\":\n        break\n    if not valid(d[\"tool\"], d[\"args\"]):\n        continue\n    obs = run_tool(d[\"tool\"], d[\"args\"])\n    ctx.append(obs)",
    "notes": [
     "step limit is the difference between a bug and an infinite loop.",
     "validate arguments before the tool runs, not after it errors.",
     "memory is durable facts, not the whole transcript - keep it small."
    ]
   },
   "figs": [
    "agentLoop"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "research",
   "title": "A web research agent",
   "group": "AI systems",
   "spot": "Answer a question by searching, reading multiple pages, and synthesizing with citations, looping only on what's still missing. <b>Signal:</b> \"build a research agent\", \"cite your sources\", \"decide when you have enough\".",
   "cx": "Search and fetch are the slow, external steps, network calls; extraction and ranking are local string work, so batch or cache the network calls and keep the local passes cheap.",
   "ex": {
    "i": "\"What is the population of Iceland and what is its capital?\"",
    "o": "an answer citing both facts with two source urls, resolved in one round",
    "w": "shows sub-query planning finding two independent facts a single search would likely miss"
   },
   "hld": [
    "Question: the thing to answer.",
    "Plan sub-queries: break a compound question into separately searchable pieces.",
    "Search: run each sub-query against a search index.",
    "Fetch pages: retrieve the full text behind each search result.",
    "Extract relevant passages: keep the sentences that actually address the question.",
    "Dedupe and rank: drop repeated facts, order what's left by relevance.",
    "Synthesise with citations: write the answer, citing which source each claim came from.",
    "Check coverage and loop if something is missing: search again only for what's still unresolved."
   ],
   "parts": [
    {
     "n": "Plan sub-queries",
     "t": "A compound question is split into separately searchable pieces; a real planner would use an LLM call, the fake below splits on a known conjunction so the shape, one question becomes several searches, is testable.",
     "code": "\ndef plan_sub_queries(question: str) -> list[str]:\n    # real: an LLM call asked to decompose the question into independent sub-questions\n    if \" and \" in question.lower():\n        parts = [p.strip() for p in question.split(\" and \")]\n        return [p if p.endswith(\"?\") else p + \"?\" for p in parts]\n    return [question]\n"
    },
    {
     "n": "Search",
     "t": "A tiny fake index stands in for a real search API; overlap between the query's words and each indexed key decides which snippets come back.",
     "code": "\nFAKE_WEB_INDEX = {\n    \"population of iceland\": [(\"iceland-stats.example\", \"Iceland's population was about 380,000 in 2023.\")],\n    \"capital of iceland\": [(\"iceland-gov.example\", \"Reykjavik is the capital and largest city of Iceland.\")],\n    \"iceland renewable energy\": [(\"iceland-energy.example\", \"Iceland generates nearly 100% of its electricity from renewable geothermal and hydro power.\")],\n}\n\ndef fake_search(query: str, k: int = 2) -> list[tuple[str, str]]:\n    # real: search_client.search(query, num_results=k)\n    query_terms = set(query.lower().replace(\"?\", \"\").split())\n    scored = []\n    for key, results in FAKE_WEB_INDEX.items():\n        overlap = len(query_terms & set(key.split()))\n        if overlap:\n            scored.extend(results)\n    return scored[:k]\n"
    },
    {
     "n": "Fetch pages",
     "t": "The search snippet stands in for a fetched, cleaned page body; a real fetch would hit the url and strip boilerplate down to article text.",
     "code": "\ndef fake_fetch(url: str, snippet: str) -> str:\n    # real: http_client.get(url).text, then strip boilerplate/nav down to article text\n    return snippet\n"
    },
    {
     "n": "Extract relevant passages",
     "t": "A keyword-overlap check on each sentence stands in for an LLM relevance judgment; every kept passage carries the url it came from.",
     "code": "\ndef extract_passages(question: str, page_text: str, url: str) -> list[dict]:\n    q_terms = set(question.lower().replace(\"?\", \"\").split())\n    passages = []\n    for sentence in page_text.split(\". \"):\n        s_terms = set(sentence.lower().split())\n        if q_terms & s_terms:\n            passages.append({\"text\": sentence.strip(), \"url\": url})\n    return passages\n"
    },
    {
     "n": "Dedupe and rank",
     "t": "Dedupe on normalized text, not the source url, since the same fact often shows up on more than one page; rank what's left by term overlap with the question.",
     "code": "\ndef dedupe_and_rank(question: str, passages: list[dict]) -> list[dict]:\n    q_terms = set(question.lower().replace(\"?\", \"\").split())\n    seen_text = set()\n    unique = []\n    for p in passages:\n        key = p[\"text\"].lower()\n        if key not in seen_text:\n            seen_text.add(key)\n            unique.append(p)\n    return sorted(unique, key=lambda p: len(q_terms & set(p[\"text\"].lower().split())), reverse=True)\n"
    },
    {
     "n": "Synthesise with citations",
     "t": "The final answer cites each claim by the number of the passage it came from; the source list is kept separately for anyone who wants to verify further.",
     "code": "\ndef synthesize(question: str, ranked_passages: list[dict]) -> str:\n    # real: client.messages.create(...) with the passages as numbered sources\n    if not ranked_passages:\n        return \"No sources found.\"\n    return \"; \".join(f\"{p['text']} [{i + 1}]\" for i, p in enumerate(ranked_passages))\n\ndef source_list(ranked_passages: list[dict]) -> list[str]:\n    return [p[\"url\"] for p in ranked_passages]\n"
    },
    {
     "n": "Check coverage and loop if something is missing",
     "t": "A sub-query counts as covered once a gathered passage shares a term with it; the loop only re-searches what's still missing, and a round cap keeps an unanswerable sub-query from looping forever.",
     "code": "\nMAX_RESEARCH_ROUNDS = 3\n\ndef check_coverage(sub_queries: list[str], all_passages: list[dict]) -> list[str]:\n    covered_terms = set()\n    for p in all_passages:\n        covered_terms |= set(p[\"text\"].lower().split())\n    missing = []\n    for sq in sub_queries:\n        sq_terms = set(sq.lower().replace(\"?\", \"\").split())\n        if not (sq_terms & covered_terms):\n            missing.append(sq)\n    return missing\n\ndef research(question: str) -> dict:\n    sub_queries = plan_sub_queries(question)\n    all_passages: list[dict] = []\n    rounds = 0\n    remaining = list(sub_queries)\n    while remaining and rounds < MAX_RESEARCH_ROUNDS:\n        for sq in list(remaining):\n            for url, snippet in fake_search(sq):\n                page = fake_fetch(url, snippet)\n                all_passages.extend(extract_passages(sq, page, url))\n        rounds += 1\n        remaining = check_coverage(remaining, all_passages)\n    ranked = dedupe_and_rank(question, all_passages)\n    answer = synthesize(question, ranked)\n    return {\"answer\": answer, \"sources\": source_list(ranked), \"rounds\": rounds, \"unresolved\": remaining}\n"
    }
   ],
   "tpl": "\nresult = research(\"What is the population of Iceland and what is its capital?\")\nanswer = result[\"answer\"]\nsources = result[\"sources\"]\nrounds_taken = result[\"rounds\"]\nunresolved = result[\"unresolved\"]\n",
   "remember": [
    "Dedupe on normalized text, not the source url; the same fact often shows up on multiple pages, and citing it twice pads the answer without adding information.",
    "Track the source per passage from the moment it's extracted; synthesis can only cite what was captured with its origin attached, not reconstruct it after the fact.",
    "Coverage checking exists so the loop is driven by what's actually missing, not by re-running the whole plan; re-searching a sub-query that's already answered wastes a network round-trip for nothing new.",
    "Cap the number of research rounds the same way an agent caps tool steps; an unanswerable sub-query would otherwise loop until the plan itself is the bug.",
    "A sub-query decomposition is a bet, not a guarantee: verify each piece got covered rather than assuming more searches automatically means more coverage."
   ],
   "asks": [
    {
     "q": "Why break one question into sub-queries before searching?",
     "a": "A compound or multi-part question often needs facts from different pages that a single search is unlikely to surface together. Decomposing into sub-queries lets each one search independently, and synthesis reassembles the results into one answer instead of hoping a single search result covers everything."
    },
    {
     "q": "How do you decide when the research agent has done enough and should stop?",
     "a": "Check coverage: after each round, see which sub-queries still have no passage addressing them, and only search again for those. Stop when nothing is left uncovered or a round limit is hit, and report what's still unresolved rather than guessing at an answer."
    },
    {
     "q": "Two different sites report the same fact; how does that affect the final answer?",
     "a": "Dedupe on the normalized passage text before ranking and synthesis, so the same fact from two sources counts once toward relevance instead of appearing twice in the answer. The source list can still keep both urls for corroboration, but the cited claim itself shouldn't repeat."
    }
   ],
   "vars": [
    {
     "n": "Now weight a source by domain trust",
     "ex": {
      "i": "the same passages, ranked with a per-domain trust multiplier",
      "o": "a government source outranking a lower-trust one at similar relevance",
      "w": "shows ranking on more than raw term overlap"
     },
     "t": "An unknown domain defaults to a low but nonzero trust score rather than zero, so an unfamiliar source can still surface, ranked below a known-trustworthy one at similar relevance.",
     "code": "\nTRUSTED_DOMAINS = {\"iceland-gov.example\": 1.0, \"iceland-stats.example\": 0.8, \"iceland-energy.example\": 0.6}\n\ndef dedupe_and_rank_trusted(question, passages):\n    q_terms = set(question.lower().replace(\"?\", \"\").split())\n    seen_text = set()\n    unique = []\n    for p in passages:\n        key = p[\"text\"].lower()\n        if key not in seen_text:\n            seen_text.add(key)\n            unique.append(p)\n    def score(p):\n        relevance = len(q_terms & set(p[\"text\"].lower().split()))\n        trust = TRUSTED_DOMAINS.get(p[\"url\"], 0.3)\n        return relevance * trust\n    return sorted(unique, key=score, reverse=True)\n\ncapital_passages = extract_passages(\"capital of iceland\", \"Reykjavik is the capital and largest city of Iceland.\", \"iceland-gov.example\")\ntrusted_ranked = dedupe_and_rank_trusted(\"capital of iceland\", capital_passages)\n"
    },
    {
     "n": "Now flag disagreeing sources instead of picking one",
     "ex": {
      "i": "two passages with different population figures",
      "o": "a flagged-conflict answer instead of a single confident number",
      "w": "shows a crude conflict signal instead of silently trusting the top-ranked passage"
     },
     "t": "Two top-ranked passages about the same thing but citing different numbers is a conflict signal a relevance score alone won't catch; surface both instead of silently picking the higher-ranked one.",
     "code": "\nimport re\n\ndef synthesize_with_conflict_check(question, ranked_passages):\n    if len(ranked_passages) < 2:\n        return synthesize(question, ranked_passages)\n    nums_a = set(re.findall(r\"\\d[\\d,]*\", ranked_passages[0][\"text\"]))\n    nums_b = set(re.findall(r\"\\d[\\d,]*\", ranked_passages[1][\"text\"]))\n    if nums_a and nums_b and nums_a != nums_b:\n        return f\"Sources disagree: [1] {ranked_passages[0]['text']}  vs  [2] {ranked_passages[1]['text']}\"\n    return synthesize(question, ranked_passages)\n\nconflict_passages = (\n    extract_passages(\"population of iceland\", \"Iceland's population was about 380,000 in 2023.\", \"a.example\")\n    + extract_passages(\"population of iceland\", \"Iceland's population was about 400,000 in 2024.\", \"b.example\")\n)\nconflict_answer = synthesize_with_conflict_check(\"population of iceland\", conflict_passages)\n"
    },
    {
     "n": "Now cap total fetches across the whole call, not per round",
     "ex": {
      "i": "the same compound question, fetch budget of 1",
      "o": "only one page ever fetched, the rest of the plan left unresolved",
      "w": "shows a global budget instead of one that resets every round"
     },
     "t": "The fetch counter is shared across the whole research call, not reset per sub-query or per round, so a tight budget actually bounds total network calls rather than bounding them per round.",
     "code": "\ndef research_with_fetch_cap(question, max_fetches=2):\n    sub_queries = plan_sub_queries(question)\n    all_passages: list[dict] = []\n    fetch_count = 0\n    for sq in sub_queries:\n        for url, snippet in fake_search(sq):\n            if fetch_count >= max_fetches:\n                break\n            page = fake_fetch(url, snippet)\n            all_passages.extend(extract_passages(sq, page, url))\n            fetch_count += 1\n    return {\"passages\": all_passages, \"fetch_count\": fetch_count}\n\ncapped = research_with_fetch_cap(\"What is the population of Iceland and what is its capital?\", max_fetches=1)\n"
    }
   ],
   "sheet": {
    "spot": "Answer a question by searching, reading, and citing sources.",
    "move": "plan sub-queries, search+fetch, extract, dedupe, cite, check.",
    "code": "subq = plan(question)\nhits = [search(q) for q in subq]\npages = [fetch(u) for u in hits]\npas = [extract(q, p) for p in pages]\nranked = dedupe_rank(pas)\nans = synth(ranked)\nmissing = coverage(subq, pas)",
    "notes": [
     "dedupe on normalized text, not url - the same fact repeats across sites.",
     "loop only on sub-queries coverage says are missing, not the whole plan.",
     "cap rounds and fetches; a bounded failure beats an infinite crawl."
    ]
   },
   "figs": [
    "webResearch"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "voice",
   "title": "Audio to audio: a voice pipeline",
   "group": "AI systems",
   "spot": "Comes up as 'build a voice agent' or 'why does our assistant feel slow'. <b>Signal:</b> words like <code>barge-in</code>, <code>endpointing</code>, <code>time to first audio</code>.",
   "cx": "Time to first audio is the metric that matters, not total latency: start TTS on the first sentence while the LLM is still generating the rest.",
   "ex": {
    "i": "user says \"what's the weather in Boston\" then goes quiet",
    "o": "system starts speaking the first sentence of the answer while it is still generating the rest, then stops mid-word the instant the user says \"wait\"",
    "w": "shows streaming end to end plus barge-in cutting it off"
   },
   "hld": [
    "Microphone: capture raw audio frames.",
    "Voice activity detection and endpointing: decide when the user has stopped talking.",
    "Streaming speech-to-text: transcribe as audio arrives, not after it ends.",
    "LLM streaming tokens: generate the reply token by token.",
    "Sentence chunker: group tokens into sentences so TTS can start before the reply is finished.",
    "Streaming text-to-speech and playback: speak each sentence as soon as it is ready.",
    "Barge-in: cancel TTS the instant the user starts talking again.",
    "Latency budget: track time-to-first-audio per stage, not the total."
   ],
   "parts": [
    {
     "n": "Microphone frames",
     "t": "The mic yields fixed-size audio frames continuously; everything downstream is a generator pulling from this stream.",
     "code": "import numpy as np\n\ndef mic_frames(utterance: str, frame_ms: int = 20, sample_rate: int = 16000):\n    # real: sounddevice.InputStream callback pushing frames into a queue\n    samples_per_frame = int(sample_rate * frame_ms / 1000)\n    # simulate: each non-space character \"speaks\" one frame of louder audio, then trailing silence\n    for ch in utterance:\n        level = 0.01 if ch == \" \" else 0.5\n        frame = np.random.randn(samples_per_frame).astype(np.float32) * 0.05 + level\n        yield frame\n    for _ in range(15):  # silence long enough for the endpointer to fire\n        yield np.random.randn(samples_per_frame).astype(np.float32) * 0.01"
    },
    {
     "n": "Voice activity detection and endpointing",
     "t": "VAD flags each frame as speech or silence; endpointing decides the turn is over after enough consecutive silent frames. Short window = low latency but risks cutting off a speaker who pauses mid-thought; long window = safer but adds that much wait on every turn.",
     "code": "def vad_is_speech(frame: np.ndarray, energy_threshold: float = 0.15) -> bool:\n    # real: webrtcvad.Vad().is_speech(frame_bytes, sample_rate)\n    return float(np.abs(frame).mean()) > energy_threshold\n\ndef endpointer(frames, silence_frames_to_end: int = 10):\n    silence_run = 0\n    for frame in frames:\n        speaking = vad_is_speech(frame)\n        yield frame, speaking\n        silence_run = 0 if speaking else silence_run + 1\n        if silence_run >= silence_frames_to_end:\n            return"
    },
    {
     "n": "Streaming speech-to-text",
     "t": "A real streaming recognizer emits growing partial transcripts and a final one; here the fake counts spoken frames to reveal one more word at a time.",
     "code": "def fake_stt(frames_with_vad, utterance_text: str):\n    # real: a streaming recognizer (e.g. a Whisper/Deepgram-style websocket) emitting\n    # partial hypotheses as audio arrives, then a final transcript at endpointing\n    spoken_frame_count = sum(1 for _, speaking in frames_with_vad if speaking)\n    words = utterance_text.split()\n    reveal_every = max(1, spoken_frame_count // max(1, len(words)))\n    for i, word in enumerate(words):\n        yield {\"text\": \" \".join(words[: i + 1]), \"final\": i == len(words) - 1}"
    },
    {
     "n": "LLM streaming tokens and sentence chunker",
     "t": "The LLM streams tokens; the chunker buffers until a sentence boundary so TTS can start on sentence one without waiting for the whole reply.",
     "code": "def fake_llm_stream(prompt: str):\n    # real: client.messages.create(..., stream=True)\n    question = prompt.split(\":\")[-1].strip()\n    canned = f\"Sure, here is the answer to {question}. It has two parts. That is everything.\"\n    for word in canned.split(\" \"):\n        yield word + \" \"\n\ndef sentence_chunker(token_stream):\n    # this boundary is what shortens time-to-first-audio: TTS gets sentence one\n    # while the LLM is still generating sentence two\n    buf = \"\"\n    for tok in token_stream:\n        buf += tok\n        if buf.strip().endswith((\".\", \"!\", \"?\")):\n            yield buf.strip()\n            buf = \"\"\n    if buf.strip():\n        yield buf.strip()"
    },
    {
     "n": "Streaming TTS, playback and barge-in",
     "t": "TTS speaks sentence by sentence; while playing, every audio chunk is interleaved with a check of the mic, and speech there cancels the TTS generator mid-utterance.",
     "code": "def fake_tts(sentence: str, sample_rate: int = 16000):\n    # real: a streaming TTS engine yielding audio chunks per sentence, not per whole reply\n    n_frames = max(1, len(sentence) // 5)\n    for _ in range(n_frames):\n        yield np.zeros(int(sample_rate * 0.02), dtype=np.float32)\n\ndef speak_with_barge_in(sentences, user_frames):\n    # cancelling here is the whole point of barge-in: a bare-metal player would also\n    # stop the speaker hardware the moment this fires\n    played = []\n    user_frames = iter(user_frames)\n    for sentence in sentences:\n        tts_gen = fake_tts(sentence)\n        for chunk in tts_gen:\n            user_frame = next(user_frames, None)\n            if user_frame is not None and vad_is_speech(user_frame):\n                tts_gen.close()\n                return played, True\n            played.append(chunk)\n    return played, False"
    },
    {
     "n": "Latency budget per stage",
     "t": "A rough per-stage budget, labelled as targets not measurements, for reasoning about where time-to-first-audio actually goes.",
     "code": "LATENCY_BUDGET_MS = {\n    # rough targets, not measurements - actual numbers depend on model, network, hardware\n    \"endpointing_silence_wait\": (150, 400),\n    \"stt_partial_to_final\": (100, 300),\n    \"llm_time_to_first_token\": (200, 600),\n    \"sentence_chunk_to_tts_start\": (50, 150),\n    \"tts_time_to_first_audio\": (150, 400),\n    \"total_time_to_first_audio_response\": (600, 1500),\n}"
    }
   ],
   "tpl": "utterance = \"what is the capital of France\"\nframes = list(endpointer(mic_frames(utterance)))\ntranscript = None\nfor partial in fake_stt(frames, utterance):\n    transcript = partial[\"text\"]\n\nllm_prompt = f\"user said: {transcript}\"\nsentences = list(sentence_chunker(fake_llm_stream(llm_prompt)))\n\nsilent_user_frames = [np.zeros(320, dtype=np.float32) for _ in range(1000)]\naudio_out, was_interrupted = speak_with_barge_in(sentences, silent_user_frames)",
   "remember": [
    "Endpointing is a latency-vs-cutoff trade-off: shorter silence windows respond faster but clip speakers who pause mid-thought.",
    "Optimize time to first audio, not total response time - start TTS on sentence one while the LLM is still generating.",
    "Barge-in means cancelling the TTS generator (and stopping playback) the instant VAD detects the user speaking, not waiting for the sentence to finish.",
    "Streaming STT gives partial transcripts you can act on early, but only the final one after endpointing is safe to hand to the LLM.",
    "A latency budget is per stage, not one number - it tells you which stage to optimize first."
   ],
   "asks": [
    {
     "q": "Why not wait for a long silence to be sure the user is done?",
     "a": "Because every millisecond of that wait is added latency on every single turn. The trade-off is tuned per product: voice UIs for quick commands use a short window, ones expecting pauses (dictation, thinking out loud) use a longer one, sometimes with a max-wait override."
    },
    {
     "q": "What actually determines time to first audio?",
     "a": "The sum of endpointing wait, STT finalization, LLM time-to-first-token, sentence chunking, and TTS time-to-first-audio. Streaming at every stage and starting TTS per sentence instead of per full reply is what keeps this sum small."
    },
    {
     "q": "How do you implement barge-in correctly?",
     "a": "Keep listening to the mic while TTS is playing, and the moment VAD fires, cancel the TTS generator and stop playback immediately - don't wait for the current sentence to finish, or the interruption feels broken."
    }
   ],
   "vars": [
    {
     "n": "Now the user actually interrupts mid-reply",
     "ex": {
      "i": "user starts talking again right as TTS begins speaking",
      "o": "playback stops immediately, only a few audio chunks were produced",
      "w": "shows barge-in actually cancelling, not just being wired up"
     },
     "t": "Feed loud frames (VAD-positive) into the user-frame stream instead of silence.",
     "code": "loud_user_frames = [np.ones(320, dtype=np.float32) * 0.5] + [\n    np.zeros(320, dtype=np.float32) for _ in range(999)\n]\naudio_out_interrupted, was_interrupted_now = speak_with_barge_in(sentences, loud_user_frames)"
    },
    {
     "n": "Now compare a short vs long endpointing window",
     "ex": {
      "i": "silence_frames_to_end of 5 vs 20, at 20ms frames",
      "o": "100ms of added wait vs 400ms of added wait before the turn is seen as done",
      "w": "makes the endpointing trade-off a concrete number"
     },
     "t": "Convert the silence-frame count directly to milliseconds of added latency.",
     "code": "def endpoint_latency_ms(silence_frames_to_end: int, frame_ms: int = 20) -> int:\n    # short window: less latency, more risk of cutting off a mid-thought pause\n    # long window: safer endpointing, but this many extra ms before the turn is \"done\"\n    return silence_frames_to_end * frame_ms\n\nfast_endpoint_ms = endpoint_latency_ms(5)\nsafe_endpoint_ms = endpoint_latency_ms(20)"
    }
   ],
   "sheet": {
    "spot": "Building or debugging latency in a voice agent.",
    "move": "Stream every stage; start TTS per sentence; cancel on VAD.",
    "code": "frames = mic_frames(text)\nspeaking = vad_is_speech(frame)\nframes = endpointer(frames, silence_n)\ntext = fake_stt(frames)\ntokens = fake_llm_stream(prompt)\nsents = sentence_chunker(tokens)\naudio = speak_with_barge_in(sents, mic)\n# barge-in: tts_gen.close() on VAD hit",
    "notes": [
     "Endpointing window is a direct latency-vs-cutoff dial, not a fixed constant.",
     "Time to first audio beats total latency as the metric users actually feel.",
     "Barge-in must cancel mid-sentence, not wait for the current sentence to end."
    ]
   },
   "figs": [
    "voicePipeline",
    "spectrogramReading"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "transformer",
   "title": "Attention and a transformer block",
   "group": "AI systems",
   "spot": "Comes up as 'implement attention' or 'why is there a causal mask'. <b>Signal:</b> <code>Q, K, V</code>, <code>causal mask</code>, <code>sqrt(d_k)</code>.",
   "cx": "Attention cost is roughly O(t^2 * d) in sequence length; KV caching during generation avoids recomputing it over the whole prefix at every new token.",
   "ex": {
    "i": "token sequence for \"the cat sat\"",
    "o": "logits over the vocabulary for the token after \"sat\", softmax picks one next token",
    "w": "shows the causal forward pass producing one next-token prediction"
   },
   "hld": [
    "Tokens: integer ids for each input position.",
    "Embedding plus positions: token id and position each get a learned vector, summed.",
    "Pre-norm: layer norm applied before each sublayer, not after.",
    "Multi-head causal attention: split into heads, score Q against K scaled by sqrt(d_head), mask future tokens, weight V.",
    "Residual add around the attention sublayer.",
    "MLP (two linear layers with a nonlinearity), its own pre-norm and residual.",
    "Stack N of these blocks.",
    "Final norm, a linear head to logits, softmax, pick the next token."
   ],
   "parts": [
    {
     "n": "Tokens and embeddings",
     "t": "Token ids look up a learned vector; a separate position embedding (added, not concatenated) is what tells the model where in the sequence each token sits.",
     "code": "import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\nclass TokenEmbedding(nn.Module):\n    def __init__(self, vocab_size: int, d_model: int, max_len: int = 64):\n        super().__init__()\n        self.tok_emb = nn.Embedding(vocab_size, d_model)\n        self.pos_emb = nn.Embedding(max_len, d_model)\n\n    def forward(self, ids: torch.Tensor) -> torch.Tensor:\n        positions = torch.arange(ids.shape[1], device=ids.device)\n        return self.tok_emb(ids) + self.pos_emb(positions)"
    },
    {
     "n": "Multi-head causal self-attention",
     "t": "Q, K, V are linear projections split across heads. Scores are scaled by sqrt(d_head) so the softmax does not saturate as the head dimension grows; the causal mask blocks each position from attending to anything after it.",
     "code": "class CausalSelfAttention(nn.Module):\n    def __init__(self, d_model: int, n_heads: int):\n        super().__init__()\n        assert d_model % n_heads == 0\n        self.n_heads = n_heads\n        self.d_head = d_model // n_heads\n        self.qkv = nn.Linear(d_model, 3 * d_model)\n        self.out = nn.Linear(d_model, d_model)\n\n    def forward(self, x: torch.Tensor) -> torch.Tensor:\n        b, t, d = x.shape\n        q, k, v = self.qkv(x).chunk(3, dim=-1)\n        q = q.view(b, t, self.n_heads, self.d_head).transpose(1, 2)\n        k = k.view(b, t, self.n_heads, self.d_head).transpose(1, 2)\n        v = v.view(b, t, self.n_heads, self.d_head).transpose(1, 2)\n        # scaling by sqrt(d_head) keeps dot-product variance ~1 so softmax doesn't saturate\n        scores = (q @ k.transpose(-2, -1)) / (self.d_head ** 0.5)\n        causal_mask = torch.triu(torch.ones(t, t, dtype=torch.bool), diagonal=1)\n        scores = scores.masked_fill(causal_mask, float(\"-inf\"))  # token t can't see t+1..\n        weights = F.softmax(scores, dim=-1)\n        attended = (weights @ v).transpose(1, 2).reshape(b, t, d)\n        return self.out(attended)"
    },
    {
     "n": "Transformer block: pre-norm, residual, MLP",
     "t": "Pre-norm normalizes before the sublayer and adds the residual after; this keeps gradients well scaled through many stacked blocks (post-norm, which normalizes after the residual add, is harder to train stably at depth).",
     "code": "class TransformerBlock(nn.Module):\n    def __init__(self, d_model: int, n_heads: int, d_ff: int):\n        super().__init__()\n        self.ln1 = nn.LayerNorm(d_model)\n        self.attn = CausalSelfAttention(d_model, n_heads)\n        self.ln2 = nn.LayerNorm(d_model)\n        self.mlp = nn.Sequential(nn.Linear(d_model, d_ff), nn.GELU(), nn.Linear(d_ff, d_model))\n\n    def forward(self, x: torch.Tensor) -> torch.Tensor:\n        x = x + self.attn(self.ln1(x))  # pre-norm + residual\n        x = x + self.mlp(self.ln2(x))\n        return x"
    },
    {
     "n": "Stack blocks and produce logits",
     "t": "N blocks stacked, a final norm, then a linear head projects to vocabulary-sized logits for the next token.",
     "code": "class TinyTransformer(nn.Module):\n    def __init__(self, vocab_size: int, d_model: int = 16, n_heads: int = 2, d_ff: int = 32,\n                 n_blocks: int = 2, max_len: int = 64):\n        super().__init__()\n        self.embed = TokenEmbedding(vocab_size, d_model, max_len)\n        self.blocks = nn.ModuleList([TransformerBlock(d_model, n_heads, d_ff) for _ in range(n_blocks)])\n        self.final_norm = nn.LayerNorm(d_model)\n        self.head = nn.Linear(d_model, vocab_size)\n\n    def forward(self, ids: torch.Tensor) -> torch.Tensor:\n        x = self.embed(ids)\n        for block in self.blocks:\n            x = block(x)\n        x = self.final_norm(x)\n        return self.head(x)  # logits, one vector per position"
    }
   ],
   "tpl": "torch.manual_seed(0)\nvocab_size = 12\nmodel = TinyTransformer(vocab_size, d_model=16, n_heads=2, d_ff=32, n_blocks=2)\nids = torch.randint(0, vocab_size, (1, 6))\nlogits = model(ids)\nnext_token_probs = F.softmax(logits[0, -1], dim=-1)\nnext_token = int(torch.argmax(next_token_probs))",
   "remember": [
    "Scale attention scores by sqrt(d_head) - unscaled dot products grow with dimension and push softmax into a near-one-hot, low-gradient regime.",
    "The causal mask is what makes this autoregressive: position t only ever attends to <= t.",
    "Pre-norm (norm then sublayer then residual) trains more stably at depth than post-norm.",
    "Multi-head splits d_model across heads, it does not repeat full-width attention per head.",
    "Generation cost is dominated by attention over a growing sequence; KV caching avoids recomputing K and V for tokens already processed."
   ],
   "asks": [
    {
     "q": "Why scale by sqrt(d_k)?",
     "a": "Dot products of random vectors grow with their dimension, so raw scores get large as d_head grows. Large scores push softmax toward one-hot outputs with near-zero gradient almost everywhere else, which stalls learning. Dividing by sqrt(d_head) keeps the score variance roughly constant regardless of dimension."
    },
    {
     "q": "Why the causal mask?",
     "a": "Training and inference are both autoregressive: the model predicts each token from only the tokens before it. Without the mask, position t could attend to t+1 and beyond during training, which is seeing the answer, and the model would never learn to generate."
    },
    {
     "q": "Pre-norm vs post-norm?",
     "a": "Pre-norm normalizes the input to a sublayer before applying it, then adds the residual on top of the un-normalized stream, which keeps gradient magnitudes stable through many stacked blocks. Post-norm normalizes after the residual add and can diverge at depth without careful warmup, which is why most modern stacks default to pre-norm."
    }
   ],
   "vars": [
    {
     "n": "Now decode token by token, growing the sequence",
     "ex": {
      "i": "a 6-token prompt",
      "o": "3 more tokens appended one at a time",
      "w": "shows the autoregressive decode loop; a real server would cache K/V here instead of recomputing attention over the whole growing prefix each step"
     },
     "t": "Each step reruns the forward pass and appends the argmax token; comment marks where a real implementation would reuse cached K/V instead of recomputing them.",
     "code": "def decode_step(model: TinyTransformer, ids: torch.Tensor) -> torch.Tensor:\n    # real serving loop: cache each block's K/V so step t only computes attention for the\n    # new token, not the whole prefix again - this is what makes decoding cheap per step\n    with torch.no_grad():\n        logits = model(ids)\n    next_id = torch.argmax(logits[0, -1]).view(1, 1)\n    return torch.cat([ids, next_id], dim=1)\n\ngenerated = ids\nfor _ in range(3):\n    generated = decode_step(model, generated)"
    },
    {
     "n": "Now make it multi-query attention",
     "ex": {
      "i": "the same 6-token input",
      "o": "a smaller K/V projection shared across all heads",
      "w": "cuts the memory a KV cache needs during serving, at some quality cost"
     },
     "t": "All query heads share one K/V head instead of each head having its own; fewer parameters and a much smaller KV cache to carry during generation.",
     "code": "class MultiQueryAttention(nn.Module):\n    def __init__(self, d_model: int, n_heads: int):\n        super().__init__()\n        self.n_heads = n_heads\n        self.d_head = d_model // n_heads\n        self.q_proj = nn.Linear(d_model, d_model)\n        self.kv_proj = nn.Linear(d_model, 2 * self.d_head)  # one shared K/V head, not one per head\n\n    def forward(self, x: torch.Tensor) -> torch.Tensor:\n        b, t, d = x.shape\n        q = self.q_proj(x).view(b, t, self.n_heads, self.d_head).transpose(1, 2)\n        k, v = self.kv_proj(x).chunk(2, dim=-1)\n        k = k.unsqueeze(1)  # broadcast the single K/V head across all query heads\n        v = v.unsqueeze(1)\n        scores = (q @ k.transpose(-2, -1)) / (self.d_head ** 0.5)\n        causal_mask = torch.triu(torch.ones(t, t, dtype=torch.bool), diagonal=1)\n        scores = scores.masked_fill(causal_mask, float(\"-inf\"))\n        weights = F.softmax(scores, dim=-1)\n        return (weights @ v).transpose(1, 2).reshape(b, t, d)\n\nmqa = MultiQueryAttention(d_model=16, n_heads=2)\nmqa_out = mqa(torch.randn(1, 6, 16))\nmqa_param_count = sum(p.numel() for p in mqa.parameters())\nmha_param_count = sum(p.numel() for p in CausalSelfAttention(16, 2).parameters())"
    }
   ],
   "sheet": {
    "spot": "Asked to implement or explain attention from scratch.",
    "move": "Scale by sqrt(d_head), mask future, pre-norm + residual.",
    "code": "x = embed(ids) + pos\nq,k,v = proj(x).split()\ns = q@k.T / sqrt(d_head)\ns = s.masked_fill(causal, -inf)\nw = softmax(s); out = w@v\nx = x + attn(ln(x))\nx = x + mlp(ln(x))\nlogits = head(ln_f(x))",
    "notes": [
     "sqrt(d_head) scaling stops softmax saturating as head dim grows.",
     "Causal mask is the only thing making this autoregressive.",
     "Pre-norm trains more stably deep; post-norm needs careful warmup."
    ]
   },
   "figs": [
    "transformerBlock",
    "qkvAttention",
    "attention"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "bpe",
   "title": "A tokenizer: byte-pair encoding",
   "group": "AI systems",
   "spot": "Comes up as 'implement a tokenizer' or 'why did this input get split like that'. <b>Signal:</b> <code>merges</code>, <code>vocab size</code>, <code>byte fallback</code>.",
   "cx": "Training is the slow, one-time cost (recounting pairs every merge); encoding is fast, replaying a fixed list of merges in order.",
   "ex": {
    "i": "corpus of common English words trained for 10 merges, then encode \"the fox jumps\"",
    "o": "a short id sequence that decodes back to the exact input text",
    "w": "shows merges compressing common substrings losslessly"
   },
   "hld": [
    "Text to bytes: start from raw UTF-8 bytes, the byte-fallback alphabet.",
    "Count adjacent pairs across the corpus.",
    "Merge the most frequent pair into one symbol.",
    "Repeat: the vocabulary grows by one symbol per merge, recorded in order.",
    "Encode: replay the learned merges, in order, on new text.",
    "Map symbols to ids via the vocabulary.",
    "Decode: look up ids, concatenate bytes, decode as UTF-8."
   ],
   "parts": [
    {
     "n": "Text to bytes, with byte fallback",
     "t": "Starting from raw UTF-8 bytes rather than characters means every possible input, including unseen unicode, always has a representation: worst case it falls back to individual bytes, never an unknown token.",
     "code": "from collections import Counter\n\ndef text_to_symbols(text: str) -> list:\n    # byte fallback: start from raw utf-8 bytes, not characters - any input, including\n    # unseen unicode or emoji, can always fall back to single bytes, never \"unknown\"\n    return [bytes([b]) for b in text.encode(\"utf-8\")]"
    },
    {
     "n": "Count pairs and merge the most frequent",
     "t": "One training step: count every adjacent symbol pair, merge the single most frequent one into a new symbol. This greedy choice, repeated, is what BPE training is.",
     "code": "def count_pairs(symbols: list) -> Counter:\n    pairs = Counter()\n    for a, b in zip(symbols, symbols[1:]):\n        pairs[(a, b)] += 1\n    return pairs\n\ndef merge_pair(symbols: list, pair: tuple) -> list:\n    merged = pair[0] + pair[1]\n    out = []\n    i = 0\n    while i < len(symbols):\n        if i < len(symbols) - 1 and (symbols[i], symbols[i + 1]) == pair:\n            out.append(merged)\n            i += 2\n        else:\n            out.append(symbols[i])\n            i += 1\n    return out"
    },
    {
     "n": "Train: repeat merges, build the vocab",
     "t": "Merges are recorded in the order they were learned - that order is part of the trained tokenizer and must be replayed exactly at encode time.",
     "code": "def train_bpe(corpus: str, num_merges: int):\n    symbols = text_to_symbols(corpus)\n    merges = []  # order matters: encode must replay merges in this exact order\n    for _ in range(num_merges):\n        pairs = count_pairs(symbols)\n        if not pairs:\n            break\n        best = max(pairs, key=pairs.get)  # most frequent pair wins this round\n        symbols = merge_pair(symbols, best)\n        merges.append(best)\n    return merges\n\ndef build_vocab(merges: list) -> list:\n    base = [bytes([i]) for i in range(256)]  # every raw byte is always in vocab: the fallback\n    return base + [a + b for a, b in merges]"
    },
    {
     "n": "Encode and decode",
     "t": "Encoding replays the learned merges in order on new text, then maps symbols to ids. Decoding reverses the id lookup and concatenates bytes.",
     "code": "def encode(text: str, merges: list) -> list:\n    symbols = text_to_symbols(text)\n    for pair in merges:  # must apply in the order they were learned\n        symbols = merge_pair(symbols, pair)\n    return symbols\n\ndef symbols_to_ids(symbols: list, vocab: list) -> list:\n    index = {sym: i for i, sym in enumerate(vocab)}\n    return [index[s] for s in symbols]\n\ndef decode(ids: list, vocab: list) -> str:\n    return b\"\".join(vocab[i] for i in ids).decode(\"utf-8\")"
    }
   ],
   "tpl": "corpus = \"the quick brown fox jumps over the lazy dog the fox runs the fox jumps again\"\nmerges = train_bpe(corpus, num_merges=10)\nvocab = build_vocab(merges)\n\ntext = \"the fox jumps\"\nsymbols = encode(text, merges)\nids = symbols_to_ids(symbols, vocab)\ndecoded = decode(ids, vocab)",
   "remember": [
    "Byte fallback guarantees no out-of-vocabulary input, ever, at the cost of a 256-symbol base alphabet before any merges.",
    "Merge order must be replayed exactly at encode time - it is part of the trained tokenizer, not re-derived by recounting frequencies on new text.",
    "Each training step is a greedy choice (the single most frequent pair), not a globally optimal compression.",
    "Vocab size is roughly 256 plus the number of merges - that number is a tuning knob.",
    "More merges means shorter token sequences for text similar to the training corpus, with diminishing returns."
   ],
   "asks": [
    {
     "q": "Why start from bytes instead of characters?",
     "a": "It guarantees full coverage of any input, including unicode the tokenizer never saw during training, emoji, or malformed text, without ever needing an unknown-token symbol. The cost is a larger base alphabet (256 byte values) before any merges are learned."
    },
    {
     "q": "Does merge order matter when encoding new text?",
     "a": "Yes, it must be replayed exactly in the order it was learned. Re-deriving merges by recounting pair frequencies on the new text would produce a different, inconsistent tokenization than what the model was trained on."
    },
    {
     "q": "How do you control vocabulary size?",
     "a": "By the number of merges: vocab size is about 256 plus that count. More merges compress text into fewer tokens (cheaper context, faster generation) but grow the embedding table and the softmax output layer, so it is a trade-off, not a free win."
    }
   ],
   "vars": [
    {
     "n": "Now encode text the tokenizer never trained on",
     "ex": {
      "i": "\"the fox 🦊 jumps\", an emoji absent from training",
      "o": "encodes and decodes back losslessly via single-byte fallback symbols",
      "w": "proves byte fallback covers unseen input"
     },
     "t": "Run encode/decode on text containing a character with zero training-set frequency.",
     "code": "unseen_text = \"the fox \\U0001F98A jumps\"  # emoji never appeared in the training corpus\nunseen_symbols = encode(unseen_text, merges)\nunseen_ids = symbols_to_ids(unseen_symbols, vocab)\nunseen_decoded = decode(unseen_ids, vocab)"
    },
    {
     "n": "Now measure the compression BPE buys",
     "ex": {
      "i": "the training corpus, with vs without merges applied",
      "o": "tokens-per-character ratio drops once merges are learned",
      "w": "makes the cost line concrete: fewer tokens per unit of text"
     },
     "t": "Compare tokens-per-character with zero merges against the trained tokenizer.",
     "code": "def compression_ratio(text: str, merges: list) -> float:\n    # lower ratio = fewer tokens spent per character, which is what merges are buying you\n    return len(encode(text, merges)) / len(text)\n\nratio_trained = compression_ratio(corpus, merges)\nratio_untrained = compression_ratio(corpus, [])"
    }
   ],
   "sheet": {
    "spot": "Asked to implement a tokenizer or explain merge behavior.",
    "move": "Bytes in, greedy-merge most frequent pair, replay in order.",
    "code": "syms = bytes_of(text)  # byte fallback\npairs = count_adjacent(syms)\nbest = argmax(pairs)\nsyms = merge(syms, best)  # repeat\nmerges.append(best)  # order matters!\nencode: replay merges in order\nids = vocab_index(syms)\ndecode: join bytes, utf-8 decode",
    "notes": [
     "Byte fallback means there is never an unknown-token failure.",
     "Encode must replay learned merges in order, not recompute frequencies.",
     "Vocab size = 256 + merge count; that count trades sequence length for table size."
    ]
   },
   "figs": [
    "bpeMerge"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "evals",
   "title": "Evaluating LLM output",
   "group": "AI systems",
   "spot": "Comes up as 'how do you know your agent didn't regress' or 'design an eval harness'. <b>Signal:</b> <code>golden set</code>, <code>LLM judge</code>, <code>regression gate</code>.",
   "cx": "An LLM-judge call per example is the slow, costly scorer; exact-match and citation checks are nearly free, so run those first and save judge calls for what they can't catch.",
   "ex": {
    "i": "a golden set of 3 QA pairs, run against one regressed candidate system",
    "o": "pass_rate drops on the regressed system and the regression gate fails the build",
    "w": "shows exact match catching a real regression before deploy"
   },
   "hld": [
    "Golden set: held-out (input, expected) pairs.",
    "Run the system under test on each input.",
    "Scorers: exact match, an LLM-judge rubric, and a citation check.",
    "Aggregate: pass rate, and pass^k across repeated samples.",
    "Compare against the baseline's scores.",
    "Regression gate: fail only on a real drop past tolerance."
   ],
   "parts": [
    {
     "n": "Golden set and the system under test",
     "t": "A small held-out set of (input, expected) pairs, kept separate from anything used to tune prompts, plus the fake system being evaluated.",
     "code": "GOLDEN_SET = [\n    {\"id\": \"g1\", \"input\": \"capital of France\", \"expected\": \"Paris\"},\n    {\"id\": \"g2\", \"input\": \"2 + 2\", \"expected\": \"4\"},\n    {\"id\": \"g3\", \"input\": \"author of Hamlet\", \"expected\": \"Shakespeare\"},\n]\n\ndef fake_system(prompt: str) -> str:\n    # real: call the agent/model under test\n    canned = {\"capital of France\": \"Paris\", \"2 + 2\": \"4\", \"author of Hamlet\": \"Shakespeare\"}\n    return canned.get(prompt, \"I don't know\")"
    },
    {
     "n": "Scorers: exact match, LLM judge, citation check",
     "t": "Exact match is cheap and strict but brittle to paraphrasing. An LLM judge is more flexible but biased toward longer, more confident-sounding, self-similar phrasing - calibrate it against a small human-labelled sample before trusting it. A citation check catches a different failure: fabricated sources.",
     "code": "def exact_match(output: str, expected: str) -> bool:\n    return output.strip().lower() == expected.strip().lower()\n\ndef fake_llm_judge(output: str, expected: str) -> float:\n    # real: ask a strong model to score against a written rubric.\n    # judges are biased toward longer, more confident, self-similar answers - calibrate\n    # against a small human-labelled sample before trusting the score\n    return 1.0 if expected.lower() in output.lower() else 0.0\n\ndef citation_check(output: str, sources: list) -> bool:\n    # did the output cite one of the retrieved sources, not a hallucinated one\n    return any(src in output for src in sources)"
    },
    {
     "n": "Aggregate: pass rate and pass^k",
     "t": "Pass rate is the mean of a binary scorer over the set. pass^k is stricter than the usual pass@k: it asks whether ALL of k independent samples pass, a measure of consistency, not whether the model can get it right once.",
     "code": "def run_eval(golden_set, system_fn) -> dict:\n    results = [exact_match(system_fn(item[\"input\"]), item[\"expected\"]) for item in golden_set]\n    return {\"pass_rate\": sum(results) / len(results), \"results\": results}\n\ndef pass_at_k(sample_results: list, k: int) -> float:\n    # pass^k: probability ALL of k samples pass - stricter and more consistency-sensitive\n    # than pass@k (at least one of k passes), and drops fast as k grows on a flaky item\n    if not sample_results:\n        return 0.0\n    window = sample_results[:k]\n    return 1.0 if all(window) else 0.0"
    },
    {
     "n": "Compare against baseline and gate",
     "t": "The gate fails a build only on a drop past a tolerance band, so one flaky example does not block a deploy, but a real regression does.",
     "code": "def regression_gate(current: dict, baseline: dict, tolerance: float = 0.02) -> bool:\n    return current[\"pass_rate\"] >= baseline[\"pass_rate\"] - tolerance"
    }
   ],
   "tpl": "baseline_scores = run_eval(GOLDEN_SET, fake_system)\n\ndef regressed_system(prompt: str) -> str:\n    if prompt == \"author of Hamlet\":\n        return \"I don't know\"  # simulate a real regression on one item\n    return fake_system(prompt)\n\ncurrent_scores = run_eval(GOLDEN_SET, regressed_system)\ngate_passed = regression_gate(current_scores, baseline_scores)\n\nsamples = [exact_match(fake_system(GOLDEN_SET[0][\"input\"]), GOLDEN_SET[0][\"expected\"]) for _ in range(4)]\np_at_4 = pass_at_k(samples, 4)",
   "remember": [
    "An LLM judge is biased toward longer, more confident, self-similar phrasing - calibrate it against a small human-labelled sample before trusting its scores.",
    "pass^k (all k samples pass) is much stricter than the usual pass@k (any of k samples pass), and measures consistency, not capability.",
    "Exact match alone is brittle to paraphrasing; combine scorers rather than relying on one.",
    "A regression gate needs a tolerance band - gating on any drop at all reacts to noise.",
    "The golden set must stay held out from prompt tuning, or the eval stops measuring anything real."
   ],
   "asks": [
    {
     "q": "Why is an LLM judge risky as your only scorer?",
     "a": "It is biased toward longer, more confident-sounding answers and toward phrasing similar to its own style, and it can be gamed by output that sounds right without being right. You calibrate it by scoring a small human-labelled sample first and checking agreement before trusting it on the rest."
    },
    {
     "q": "What is the difference between pass@k and pass^k?",
     "a": "pass@k asks whether at least one of k sampled generations is correct - useful when you can pick the best of several tries. pass^k asks whether all k are correct, a much stricter bar that measures consistency, and it drops quickly as k grows if the system is flaky on an item."
    },
    {
     "q": "How do you gate a deploy on eval results without blocking on noise?",
     "a": "Compare the current run's pass rate to a stored baseline with a tolerance band, and fail the gate only on a drop past that tolerance. You also keep the golden set held out from prompt tuning, so the eval doesn't reward overfitting to it."
    }
   ],
   "vars": [
    {
     "n": "Now blend exact match with the LLM judge",
     "ex": {
      "i": "the golden set scored by both scorers",
      "o": "one composite score per item",
      "w": "shows combining a strict and a soft scorer instead of picking just one"
     },
     "t": "A composite score catches more real regressions than either scorer alone: exact match is brittle, the judge is gameable.",
     "code": "def composite_score(output: str, expected: str) -> float:\n    return 0.5 * float(exact_match(output, expected)) + 0.5 * fake_llm_judge(output, expected)\n\ncomposite_scores = [composite_score(fake_system(g[\"input\"]), g[\"expected\"]) for g in GOLDEN_SET]"
    },
    {
     "n": "Now watch pass^k drop as k grows on a flaky item",
     "ex": {
      "i": "3 samples on one golden item, one of them sampled wrong",
      "o": "pass^1 is 1.0 but pass^3 is 0.0",
      "w": "makes the pass^k trade-off concrete: consistency, not just capability"
     },
     "t": "Simulate k independent generations on the same item, one of which is wrong.",
     "code": "def sample_candidates(prompt: str, expected: str, n: int, flaky_index) -> list:\n    return [\n        exact_match(fake_system(prompt), expected) if i != flaky_index else False\n        for i in range(n)\n    ]\n\nflaky_samples = sample_candidates(GOLDEN_SET[0][\"input\"], GOLDEN_SET[0][\"expected\"], n=3, flaky_index=1)\np_at_1 = pass_at_k(flaky_samples, 1)\np_at_3 = pass_at_k(flaky_samples, 3)"
    }
   ],
   "sheet": {
    "spot": "Asked to design or debug an eval harness / regression gate.",
    "move": "Score cheap-to-costly, aggregate, gate on drop past tolerance.",
    "code": "gold = [{input, expected}, ...]\nout = system(input)\nok = exact_match(out, expected)\njudge = llm_judge(out, expected)  # bias\nrate = mean(ok for g in gold)\npassk = all(ok for k samples)\ngate: rate >= baseline - tol",
    "notes": [
     "LLM judges are biased toward long, confident, self-similar answers.",
     "pass^k (all k) is stricter than pass@k (any of k) and drops fast.",
     "Gate on a tolerance band, not any drop, or noise blocks every deploy."
    ]
   },
   "figs": [
    "evalHarness",
    "passk"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "structured",
   "title": "Structured output and function calling",
   "group": "AI systems",
   "spot": "Comes up as 'get reliable JSON out of the model' or 'wire up a tool call'. <b>Signal:</b> <code>schema</code>, <code>validate</code>, <code>retry</code>.",
   "cx": "Each repair round is a full extra model call; capping retries bounds cost as much as it bounds latency.",
   "ex": {
    "i": "\"Extract the person's contact info\", model returns age as a string on attempt one",
    "o": "a typed object with age as an int, after one repair round",
    "w": "shows the validate-then-repair loop converging instead of crashing or guessing"
   },
   "hld": [
    "Schema: fields and types the output must satisfy.",
    "Prompt (or tool definition) carrying that schema to the model.",
    "Model output: raw text, hopefully JSON.",
    "Parse JSON.",
    "Validate against the schema.",
    "On error, feed the exact error back and retry, capped at n attempts.",
    "Return a typed object, or a clean failure - never a silent bad guess."
   ],
   "parts": [
    {
     "n": "Schema and prompt",
     "t": "The schema names required fields and their types; passing it as a proper tool/function definition is enforced closer to generation and is more reliable than only describing it in prose.",
     "code": "import json\n\nSCHEMA = {\n    \"type\": \"object\",\n    \"properties\": {\n        \"name\": {\"type\": \"string\"},\n        \"age\": {\"type\": \"integer\"},\n        \"email\": {\"type\": \"string\"},\n    },\n    \"required\": [\"name\", \"age\", \"email\"],\n}\n\ndef build_prompt(instruction: str, schema: dict) -> str:\n    # real: pass schema as a tool/function definition or a json_schema response format,\n    # not just prose - models follow a typed schema far more reliably than a described one\n    return f\"{instruction}\\nRespond with JSON matching this schema:\\n{json.dumps(schema)}\""
    },
    {
     "n": "Model output and JSON parsing",
     "t": "The fake model simulates a common real failure: a numeric field returned as a string on the first attempt, fixed on the second.",
     "code": "def fake_llm_structured(prompt: str, attempt: int) -> str:\n    # real: client.messages.create(..., tools=[...]) or a json_schema response format\n    if attempt == 0:\n        return '{\"name\": \"Ada Lovelace\", \"age\": \"36\", \"email\": \"ada@example.com\"}'  # age is a string\n    return '{\"name\": \"Ada Lovelace\", \"age\": 36, \"email\": \"ada@example.com\"}'\n\ndef parse_json(text: str):\n    try:\n        return json.loads(text), None\n    except json.JSONDecodeError as e:\n        return None, f\"invalid JSON: {e}\""
    },
    {
     "n": "Validate against the schema",
     "t": "Check required fields are present and every present field has the right type; return None for valid, or a specific message pointing at what broke.",
     "code": "_TYPE_MAP = {\"string\": str, \"integer\": int}\n\ndef validate(obj, schema: dict):\n    if obj is None:\n        return \"no object to validate\"\n    for field in schema[\"required\"]:\n        if field not in obj:\n            return f\"missing required field: {field}\"\n    for field, spec in schema[\"properties\"].items():\n        if field in obj and not isinstance(obj[field], _TYPE_MAP[spec[\"type\"]]):\n            return f\"field {field} should be {spec['type']}, got {type(obj[field]).__name__}\"\n    return None  # None means valid"
    },
    {
     "n": "Validate then repair, capped retries",
     "t": "On failure, the exact validation error is fed back into the next prompt - this specific feedback is what makes the loop converge instead of repeating the same mistake. Past the retry cap it returns a clean failure, never a silently wrong guess.",
     "code": "def get_structured_output(prompt: str, schema: dict, max_retries: int = 3):\n    error = None\n    for attempt in range(max_retries):\n        raw = fake_llm_structured(prompt, attempt)\n        obj, parse_error = parse_json(raw)\n        error = parse_error or validate(obj, schema)\n        if error is None:\n            return obj, None  # typed object, success\n        # feed the exact error back, not a generic \"try again\" - this is what converges\n        prompt = f\"{prompt}\\nYour last output was invalid: {error}. Try again.\"\n    return None, f\"failed after {max_retries} attempts: {error}\"  # clean failure, not a crash"
    }
   ],
   "tpl": "prompt = build_prompt(\"Extract the person's contact info.\", SCHEMA)\nresult, error = get_structured_output(prompt, SCHEMA, max_retries=3)",
   "remember": [
    "Validate then repair beats regex-patching JSON: point at the exact field that broke, not a vague retry.",
    "Feed the specific validation error back into the next prompt - a generic 'try again' converges far less reliably.",
    "Cap retries and fail clean (None + reason) rather than looping forever or returning garbage.",
    "A tool/function-calling schema is enforced closer to generation and is more reliable than a schema only described in prose.",
    "Stringified numbers and missing required fields are the most common real-world validation failures."
   ],
   "asks": [
    {
     "q": "Why validate then repair instead of re-prompting harder?",
     "a": "Because you can name the exact field and rule that broke ('age should be integer, got str') and hand that back verbatim, which converges in one or two retries. A vaguer nudge like 'please fix your JSON' gives the model far less to correct."
    },
    {
     "q": "What happens after max_retries is hit?",
     "a": "Return a clean typed failure, None plus a reason, rather than raising or silently returning a best-effort guess. The caller can then fall back to a default, ask a human, or surface the error, instead of shipping a plausible-looking wrong object."
    },
    {
     "q": "Prose schema vs a tool/function-calling schema, does it matter?",
     "a": "Yes - a schema passed as a proper tool definition is enforced closer to how the model actually generates output, and is far more reliable than one only described in the prompt text, which the model can drift away from."
    }
   ],
   "vars": [
    {
     "n": "Now the model keeps failing past the retry cap",
     "ex": {
      "i": "a model that never fixes the type error",
      "o": "None plus a clean failure reason",
      "w": "shows the cap actually bounding cost and returning cleanly, not looping forever"
     },
     "t": "Swap in a model stub that always returns the same invalid field; confirm the loop stops at max_retries with a clean failure, not an exception.",
     "code": "def always_wrong_llm(prompt: str, attempt: int) -> str:\n    return '{\"name\": \"Ada Lovelace\", \"age\": \"not a number\", \"email\": \"ada@example.com\"}'\n\ndef get_structured_output_stubborn(prompt, schema, max_retries=2):\n    error = None\n    for attempt in range(max_retries):\n        raw = always_wrong_llm(prompt, attempt)\n        obj, parse_error = parse_json(raw)\n        error = parse_error or validate(obj, schema)\n        if error is None:\n            return obj, None\n    return None, f\"failed after {max_retries} attempts: {error}\"\n\nstubborn_result, stubborn_error = get_structured_output_stubborn(prompt, SCHEMA, max_retries=2)"
    },
    {
     "n": "Now add an enum-constrained field",
     "ex": {
      "i": "a status field limited to active/inactive, given \"pending\"",
      "o": "validation fails naming the allowed values",
      "w": "shows validation growing beyond just type checks"
     },
     "t": "Extend validation with a constraint the plain type map cannot express: membership in a fixed set of allowed values.",
     "code": "SCHEMA_WITH_ENUM = dict(SCHEMA, properties=dict(\n    SCHEMA[\"properties\"], status={\"type\": \"string\", \"enum\": [\"active\", \"inactive\"]},\n))\nSCHEMA_WITH_ENUM[\"required\"] = SCHEMA[\"required\"] + [\"status\"]\n\ndef validate_with_enum(obj, schema: dict):\n    plain_props = {k: v for k, v in schema[\"properties\"].items() if \"enum\" not in v}\n    base_error = validate(obj, {**schema, \"properties\": plain_props})\n    if base_error:\n        return base_error\n    for field, spec in schema[\"properties\"].items():\n        if \"enum\" in spec and obj.get(field) not in spec[\"enum\"]:\n            return f\"field {field} must be one of {spec['enum']}\"\n    return None\n\nbad_status_obj = {\"name\": \"Ada\", \"age\": 36, \"email\": \"a@b.com\", \"status\": \"pending\"}\nenum_error = validate_with_enum(bad_status_obj, SCHEMA_WITH_ENUM)"
    }
   ],
   "sheet": {
    "spot": "Wiring up JSON output or a tool call that must be reliable.",
    "move": "Validate, feed the exact error back, retry with a cap.",
    "code": "schema = {required, properties}\nprompt = with_schema(instruction, schema)\nraw = model(prompt)\nobj, err = parse_json(raw)\nerr = err or validate(obj, schema)\nif err and tries < n: retry with err\nif err: return None, err  # clean fail\nreturn obj  # typed",
    "notes": [
     "Feed the specific validation error back, not a generic retry prompt.",
     "Cap retries; past the cap return a clean failure, never a silent guess.",
     "A tool-call schema is enforced more reliably than one only in prose."
    ]
   },
   "figs": [
    "schemaRepair"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "serving",
   "title": "Serving a model: streaming, batching, limits",
   "group": "AI systems",
   "spot": "Comes up as 'design the inference API' or 'why is p95 latency bad under load'. <b>Signal:</b> <code>batching</code>, <code>rate limit</code>, <code>SSE</code>.",
   "cx": "Batching raises throughput per GPU-second but adds queueing latency to every request in the batch - the knob to tune against your SLA is max_wait, not max_batch_size.",
   "ex": {
    "i": "two concurrent requests for different prompts, micro-batch size 2",
    "o": "one batched model call serving both, each streamed back as SSE token events",
    "w": "shows the batcher coalescing concurrent requests into a single forward pass"
   },
   "hld": [
    "Client sends a request to the API endpoint.",
    "Auth and a token-bucket rate limit gate the request.",
    "Cache check: skip the model entirely on a hit.",
    "Queue and micro-batch concurrent requests together.",
    "Model runs the batch in one forward pass.",
    "Stream tokens back over server-sent events as they are generated.",
    "Metrics and timeouts: track p95 latency, bound worst-case wait."
   ],
   "parts": [
    {
     "n": "Auth and a token-bucket rate limiter",
     "t": "The bucket refills continuously based on elapsed time rather than resetting on a fixed window, which avoids a burst of requests all landing right at a window boundary.",
     "code": "import time\nimport asyncio\nfrom collections import OrderedDict\n\nclass TokenBucket:\n    def __init__(self, rate_per_sec: float, capacity: int):\n        self.rate = rate_per_sec\n        self.capacity = capacity\n        self.tokens = capacity\n        self.last_check = time.monotonic()\n\n    def allow(self) -> bool:\n        # continuous refill, not a fixed window - avoids a burst right at a window edge\n        now = time.monotonic()\n        self.tokens = min(self.capacity, self.tokens + (now - self.last_check) * self.rate)\n        self.last_check = now\n        if self.tokens >= 1:\n            self.tokens -= 1\n            return True\n        return False\n\ndef check_auth(api_key: str, valid_keys: set) -> bool:\n    # real: look up a hashed key in a datastore, not a set literal\n    return api_key in valid_keys"
    },
    {
     "n": "LRU cache check",
     "t": "A cache hit skips the model entirely. The key must cover everything that affects the output (prompt, params, prompt-version) or two different requests can collide.",
     "code": "class LRUCache:\n    def __init__(self, capacity: int = 128):\n        self.capacity = capacity\n        self.store = OrderedDict()\n\n    def get(self, key):\n        if key not in self.store:\n            return None\n        self.store.move_to_end(key)  # mark as recently used\n        return self.store[key]\n\n    def put(self, key, value):\n        self.store[key] = value\n        self.store.move_to_end(key)\n        if len(self.store) > self.capacity:\n            self.store.popitem(last=False)  # evict least recently used"
    },
    {
     "n": "Micro-batcher",
     "t": "Coalesces concurrent requests into one model call. Bigger batches (or a longer wait) raise GPU utilization and throughput but add queueing latency to every request in the batch - tune this to the latency SLA, not to maximize GPU usage.",
     "code": "class MicroBatcher:\n    def __init__(self, batch_fn, max_batch_size: int = 4):\n        # trade-off: bigger batches raise throughput per GPU-second but add queueing\n        # latency to every request in the batch - tune to the SLA, not the GPU\n        self.batch_fn = batch_fn\n        self.max_batch_size = max_batch_size\n        self.pending = []\n\n    async def submit(self, item):\n        fut = asyncio.get_event_loop().create_future()\n        self.pending.append((item, fut))\n        if len(self.pending) >= self.max_batch_size:\n            await self._flush()\n        return await fut\n\n    async def _flush(self):\n        batch, futs = [i for i, _ in self.pending], [f for _, f in self.pending]\n        self.pending = []\n        for fut, result in zip(futs, self.batch_fn(batch)):\n            if not fut.done():\n                fut.set_result(result)"
    },
    {
     "n": "Model call, SSE streaming, metrics and timeouts",
     "t": "The model runs the batch in one forward pass; results stream back as server-sent events so the client renders tokens as they arrive. Timeouts bound worst-case wait; p95 (not average) is what a user-facing SLA should track.",
     "code": "def fake_model(prompts: list) -> list:\n    # real: one batched forward pass on GPU\n    return [f\"answer to: {p}\" for p in prompts]\n\ndef sse_format(event: str, data: str) -> str:\n    # real: yielded from a StreamingResponse in a framework like this (not installed here):\n    # \"from fastapi import FastAPI\" ... return StreamingResponse(gen(), media_type=\"text/event-stream\")\n    return f\"event: {event}\\ndata: {data}\\n\\n\"\n\ndef stream_tokens(text: str):\n    for word in text.split(\" \"):\n        yield sse_format(\"token\", word)\n    yield sse_format(\"done\", \"\")\n\nclass Metrics:\n    def __init__(self):\n        self.latencies_ms = []\n        self.timeouts = 0\n\n    def record(self, start: float):\n        self.latencies_ms.append((time.monotonic() - start) * 1000)\n\n    def p95_ms(self) -> float:\n        if not self.latencies_ms:\n            return 0.0\n        ordered = sorted(self.latencies_ms)\n        return ordered[min(int(len(ordered) * 0.95), len(ordered) - 1)]\n\nasync def call_with_timeout(coro, timeout_s: float, metrics: \"Metrics\"):\n    start = time.monotonic()\n    try:\n        result = await asyncio.wait_for(coro, timeout=timeout_s)\n        metrics.record(start)\n        return result\n    except asyncio.TimeoutError:\n        metrics.timeouts += 1\n        return None"
    }
   ],
   "tpl": "async def handle_request(api_key, prompt, bucket, cache, batcher, valid_keys, metrics):\n    if not check_auth(api_key, valid_keys):\n        return None, \"unauthorized\"\n    if not bucket.allow():\n        return None, \"rate limited\"\n    cached = cache.get(prompt)\n    if cached is not None:\n        return cached, \"cache hit\"\n    result = await call_with_timeout(batcher.submit(prompt), timeout_s=1.0, metrics=metrics)\n    cache.put(prompt, result)\n    return result, \"served\"\n\nasync def main():\n    bucket = TokenBucket(rate_per_sec=100, capacity=10)\n    cache = LRUCache(capacity=16)\n    batcher = MicroBatcher(fake_model, max_batch_size=2)\n    valid_keys = {\"key-abc\"}\n    metrics = Metrics()\n    results = await asyncio.gather(\n        handle_request(\"key-abc\", \"hello\", bucket, cache, batcher, valid_keys, metrics),\n        handle_request(\"key-abc\", \"world\", bucket, cache, batcher, valid_keys, metrics),\n    )\n    return results, list(stream_tokens(\"hello world\")), metrics\n\nserving_results, sse_events, serving_metrics = asyncio.run(main())",
   "remember": [
    "Batching trades latency for throughput - the knob to tune is max_wait against your SLA, not max_batch_size against the GPU.",
    "A token bucket refills continuously, so it avoids the burst-at-boundary problem a fixed-window limiter has.",
    "The cache key must cover everything that affects the output, or you serve a stale or wrong answer for a request that looks identical but isn't.",
    "SSE lets the client render tokens as they're generated instead of waiting for the full response.",
    "Track p95 (or p99) latency and timeout counts, not the average - that's what a user-facing SLA actually feels."
   ],
   "asks": [
    {
     "q": "How do you pick a micro-batch size?",
     "a": "Bigger batches (or waiting longer to fill one) raise GPU utilization and throughput, but every request in the batch waits for it to fill or flush, so it adds latency. Size and max-wait are chosen against your p95 latency SLA, not to maximize GPU usage."
    },
    {
     "q": "Why a token bucket instead of a fixed-window rate limiter?",
     "a": "A fixed window resets all at once, so a burst of requests can land right at the boundary and double the effective rate for a moment. A token bucket refills continuously based on elapsed time, which smooths that out."
    },
    {
     "q": "What goes wrong if the cache key is the prompt text?",
     "a": "If the response also depends on things like sampling temperature, a system prompt version, or per-user context, two genuinely different requests can collide on the same key and one gets served the other's cached, wrong answer. The key has to cover everything that affects the output."
    }
   ],
   "vars": [
    {
     "n": "Now show a cache hit skipping the batcher entirely",
     "ex": {
      "i": "a prompt already in the cache",
      "o": "returned immediately, status 'cache hit'",
      "w": "shows the cache short-circuiting before batching or the model are touched"
     },
     "t": "Pre-populate the cache and confirm the request never reaches the batcher.",
     "code": "async def main_cache_hit():\n    bucket = TokenBucket(rate_per_sec=100, capacity=10)\n    cache = LRUCache(capacity=16)\n    cache.put(\"hello\", \"cached answer\")\n    batcher = MicroBatcher(fake_model, max_batch_size=2)\n    metrics = Metrics()\n    return await handle_request(\"key-abc\", \"hello\", bucket, cache, batcher, {\"key-abc\"}, metrics)\n\ncache_hit_result, cache_hit_status = asyncio.run(main_cache_hit())"
    },
    {
     "n": "Now show the rate limiter rejecting a burst",
     "ex": {
      "i": "5 requests fired back to back against a bucket of capacity 1",
      "o": "the first is allowed, the rest are throttled",
      "w": "makes the token-bucket throttling behavior concrete"
     },
     "t": "A tiny bucket makes the throttling visible after one request.",
     "code": "burst_bucket = TokenBucket(rate_per_sec=1, capacity=1)\nburst_allowed = [burst_bucket.allow() for _ in range(5)]  # only the first should succeed"
    }
   ],
   "sheet": {
    "spot": "Designing or debugging an inference API under load.",
    "move": "Auth, rate limit, cache, batch, stream, measure p95.",
    "code": "if not auth(key): reject\nif not bucket.allow(): 429\nif cache.get(key): return cached\nawait batcher.submit(req)  # coalesce\nmodel(batch)  # one fwd pass\nstream: sse \"data: tok\\n\\n\"\nmetrics.p95(); timeout via wait_for",
    "notes": [
     "Batch size/wait trades throughput for latency - tune to the SLA.",
     "Token bucket avoids the fixed-window burst-at-boundary problem.",
     "Cache key must cover everything that affects the output."
    ]
   },
   "figs": [
    "servingPath"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "lora",
   "title": "Fine-tuning with LoRA",
   "group": "AI systems",
   "spot": "Comes up as 'how would you fine-tune this cheaply' or 'explain LoRA'. <b>Signal:</b> <code>rank</code>, <code>alpha</code>, <code>merge weights</code>.",
   "cx": "Trainable parameters (and optimizer state) shrink by orders of magnitude versus full fine-tuning; the forward pass cost barely changes.",
   "ex": {
    "i": "a frozen 8x8 layer with a rank-2 adapter, trained 20 steps against a random target",
    "o": "training loss drops, and the merged weight reproduces the adapted layer exactly",
    "w": "shows only a small fraction of parameters training while W stays untouched"
   },
   "hld": [
    "Frozen base weight W (d by k) - never updated.",
    "Low-rank adapters: A (r by k) down-projects, B (d by r) up-projects, r small.",
    "Scale the adapter by alpha/r so its magnitude stays stable as r changes.",
    "Forward pass: Wx plus the scaled adapter path, B(Ax).",
    "Only A and B train; W stays frozen the whole time.",
    "Merge A and B into W after training for zero-overhead inference.",
    "Parameter count: a small fraction of full fine-tuning's trainable parameters."
   ],
   "parts": [
    {
     "n": "Frozen base weight and low-rank adapters",
     "t": "W is a normal linear weight but frozen. A and B are the low-rank pair: A projects down to rank r, B projects back up. B starts at zero so the adapter is a no-op until training moves it, preserving the frozen model's original behavior at init.",
     "code": "import torch\nimport torch.nn as nn\n\nclass LoRALinear(nn.Module):\n    def __init__(self, d_in: int, d_out: int, r: int = 4, alpha: int = 8):\n        super().__init__()\n        self.weight = nn.Parameter(torch.randn(d_out, d_in) * 0.02, requires_grad=False)  # frozen\n        self.lora_A = nn.Parameter(torch.randn(r, d_in) * 0.02)  # (r, k) down-projects to rank r\n        self.lora_B = nn.Parameter(torch.zeros(d_out, r))         # (d, r) starts at 0: no-op at init\n        self.scale = alpha / r  # keeps the adapter's effective magnitude stable as r changes\n\n    def forward(self, x: torch.Tensor) -> torch.Tensor:\n        base = x @ self.weight.T\n        adapter = x @ self.lora_A.T @ self.lora_B.T\n        return base + self.scale * adapter\n\n    def merged_weight(self) -> torch.Tensor:\n        # fold the adapter into W for inference - same shape as the original layer,\n        # zero added latency and no separate adapter module to carry at serve time\n        return self.weight + self.scale * (self.lora_B @ self.lora_A)"
    },
    {
     "n": "Train only A and B",
     "t": "W's requires_grad is already False from construction, so the optimizer only ever sees A and B - this is what makes LoRA cheap in optimizer memory, not in parameter count (Adam keeps two extra moment tensors per trainable parameter).",
     "code": "def trainable_params(model: nn.Module) -> list:\n    return [p for p in model.parameters() if p.requires_grad]\n\ndef train_step(model: \"LoRALinear\", x: torch.Tensor, y: torch.Tensor, optimizer) -> float:\n    optimizer.zero_grad()\n    pred = model(x)\n    loss = ((pred - y) ** 2).mean()\n    loss.backward()\n    optimizer.step()\n    return float(loss)"
    },
    {
     "n": "Parameter count vs full fine-tuning",
     "t": "Compares what LoRA actually trains against what full fine-tuning would have to train, the frozen weight included.",
     "code": "def param_counts(model: \"LoRALinear\") -> dict:\n    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)\n    frozen = sum(p.numel() for p in model.parameters() if not p.requires_grad)\n    return {\n        \"trainable\": trainable,\n        \"frozen\": frozen,\n        \"full_finetune_equivalent\": frozen + trainable,  # what unfreezing everything would train\n    }"
    }
   ],
   "tpl": "torch.manual_seed(0)\nd_in, d_out, r = 8, 8, 2\nmodel = LoRALinear(d_in, d_out, r=r, alpha=8)\noptimizer = torch.optim.SGD(trainable_params(model), lr=0.1)\n\nx = torch.randn(4, d_in)\ntarget = x @ (torch.randn(d_in, d_out) * 0.1)\n\nlosses = [train_step(model, x, target, optimizer) for _ in range(20)]\nmerged = model.merged_weight()\ncounts = param_counts(model)",
   "remember": [
    "Only A and B train, W stays frozen - this is what makes LoRA cheap in optimizer memory, not in raw parameter count.",
    "B starts at zero so the adapter contributes nothing at initialization; training is what moves it away from the frozen model's original behavior.",
    "alpha/r scales the adapter's contribution so changing rank r doesn't force you to re-tune the learning rate as much.",
    "Merging folds the adapter into W for inference - same shape as the original layer, zero added latency, no separate module to serve.",
    "Pick r by task complexity, not by reflex - too small underfits, too large erodes the compute/memory savings that are the whole point."
   ],
   "asks": [
    {
     "q": "Why does B start at zero?",
     "a": "So the adapter path contributes exactly nothing at initialization - the frozen model's original behavior is preserved until training actually begins moving A and B away from their start."
    },
    {
     "q": "What is alpha/r actually doing?",
     "a": "It scales the adapter's output so that as you change the rank r, the effective magnitude of the update stays roughly comparable. Without it, changing r would also change how strongly the adapter perturbs the frozen weight, forcing you to re-tune the learning rate every time."
    },
    {
     "q": "Why merge the weights before serving?",
     "a": "Merging folds the frozen weight and the adapter into a single matrix of the original shape, so inference has no added latency and there's no extra module to load - versus keeping them separate, which only pays off if you need to swap adapters at runtime."
    }
   ],
   "vars": [
    {
     "n": "Now swap in a different task's adapter on the same frozen base",
     "ex": {
      "i": "a second LoRA adapter trained on the same W",
      "o": "a distinct A/B pair, W identical to the first adapter's",
      "w": "shows the point of adapters: one frozen base, many cheap task-specific adapters"
     },
     "t": "Reuse the same frozen weight tensor and attach a fresh A/B pair for a second task.",
     "code": "task_b_model = LoRALinear(d_in, d_out, r=r, alpha=8)\ntask_b_model.weight = model.weight  # same frozen base, swapped adapter - the point of LoRA\ntask_b_optimizer = torch.optim.SGD(trainable_params(task_b_model), lr=0.1)\ntask_b_losses = [train_step(task_b_model, x, target, task_b_optimizer) for _ in range(10)]\nsame_base = torch.equal(model.weight, task_b_model.weight)"
    },
    {
     "n": "Now compare trainable fraction as rank grows",
     "ex": {
      "i": "rank 1, 4, and 16 adapters on the same 8x8 layer",
      "o": "trainable-parameter fraction rises with rank, still far below full fine-tuning",
      "w": "makes the rank-vs-savings trade-off concrete"
     },
     "t": "Sweep rank and compute the trainable fraction of the full-fine-tune-equivalent count for each.",
     "code": "param_ratios = {}\nfor rank in (1, 4, 16):\n    m = LoRALinear(d_in, d_out, r=rank, alpha=8)\n    c = param_counts(m)\n    param_ratios[rank] = c[\"trainable\"] / c[\"full_finetune_equivalent\"]"
    }
   ],
   "sheet": {
    "spot": "Asked how to fine-tune cheaply, or to explain LoRA.",
    "move": "Freeze W, train a low-rank A/B pair, merge for serving.",
    "code": "W frozen (d,k); A (r,k); B (d,r)\ny = x@W.T + (a/r)*(x@A.T@B.T)\nB init 0 -> adapter starts no-op\ntrain only A,B; W.requires_grad=False\nmerged = W + (a/r)*(B@A)\nserve: merged, no extra latency",
    "notes": [
     "B initialized to zero keeps the adapter a no-op until trained.",
     "alpha/r decouples effective update size from the choice of rank.",
     "Merging removes all inference-time overhead versus keeping them apart."
    ]
   },
   "figs": [
    "lora"
   ],
   "probs": [],
   "g": "ai-systems"
  },
  {
   "id": "ai",
   "title": "AI-flavoured coding",
   "group": "AI systems",
   "ex": {
    "i": "2,000 characters, size 800, overlap 100",
    "o": "3 chunks at 0, 700, 1400",
    "w": "neighbours share 100 characters"
   },
   "sheet": {
    "spot": "Top k by cosine, retries, parsing model output, rate limits.",
    "move": null,
    "code": "q = q / np.linalg.norm(q)\nM = M / np.linalg.norm(M, axis=1, keepdims=True)\ntop = np.argsort(-(M @ q))[:k]",
    "notes": [
     "<b>Retry:</b> sleep base &times; 2<sup>i</sup> plus jitter; cap; retry only retryable errors.",
     "<b>Model JSON:</b> strip fences, json.loads in try, validate, None on failure.",
     "<b>Token bucket:</b> refill elapsed &times; rate, capped. <b>LRU:</b> OrderedDict, move_to_end."
    ]
   },
   "vars": [
    {
     "n": "Retry with exponential backoff",
     "ex": {
      "i": "a call that fails twice, then works",
      "o": "the result, on the third try",
      "w": "waits about 0.5 s, then 1 s"
     },
     "t": "Wait base times 2 to the attempt, plus jitter; re-raise on the last try.",
     "code": "import random, time\n\ndef retry(fn, tries=4, base=0.5):\n    for i in range(tries):\n        try:\n            return fn()\n        except Exception:\n            if i == tries - 1:\n                raise\n            time.sleep(base * 2 ** i + random.random() * base)   # jitter spreads retries",
     "st": {
      "p": "Your service calls a model API that sometimes fails with transient errors. Write `retry(fn, tries, base)` that calls `fn()` and returns its result on success. On an exception, it waits `base * 2^attempt` seconds plus a small random jitter before trying again, up to `tries` attempts total, then re-raises the last exception if every attempt failed.",
      "ex": [
       {
        "i": "retry(flaky, tries=4, base=0)  # flaky() raises twice, then returns 42",
        "o": "42, on the 3rd call",
        "why": "the first two calls raise and are retried; the third succeeds, so no fourth attempt happens"
       },
       {
        "i": "retry(always_fails, tries=2, base=0)  # always_fails() always raises",
        "o": "raises the same exception",
        "why": "edge case: once the last of the allowed tries also fails, the exception is re-raised instead of swallowed"
       }
      ],
      "k": [
       "at most `tries` calls to fn",
       "only retries on exceptions, never on a successful return"
      ]
     }
    },
    {
     "n": "Parse a model's JSON safely",
     "ex": {
      "i": "{\"a\": 1} wrapped in ```json fences",
      "o": "{\"a\": 1}",
      "w": "fences stripped; bad JSON gives None"
     },
     "t": "Strip code fences, try json.loads, return None on failure instead of crashing.",
     "code": "import json\n\ndef parse_json(text):\n    text = text.strip()\n    if text.startswith(\"```\"):\n        text = text.split(\"\\n\", 1)[1].rsplit(\"```\", 1)[0]\n    try:\n        return json.loads(text)\n    except json.JSONDecodeError:\n        return None",
     "st": {
      "p": "Your service asks a model for JSON and the reply sometimes arrives wrapped in a markdown code fence such as ```json ... ```. Write `parse_json(text)` that strips a leading and trailing code fence if present, then parses the remainder as JSON. Return the parsed value on success, or None if the text is not valid JSON, without raising.",
      "ex": [
       {
        "i": "parse_json('```json\\n{\"a\": 1}\\n```')",
        "o": "{\"a\": 1}",
        "why": "the fences are stripped before parsing"
       },
       {
        "i": "parse_json(\"not json at all\")",
        "o": "None",
        "why": "edge case: text that never parses as JSON returns None instead of raising"
       }
      ],
      "k": [
       "O(n) time in the length of text",
       "must not raise on malformed input"
      ]
     }
    },
    {
     "n": "LRU cache",
     "ex": {
      "i": "capacity 2: put 1, put 2, get 1, put 3",
      "o": "key 2 is evicted",
      "w": "1 was used more recently"
     },
     "t": "An OrderedDict: move a key to the end on use, pop from the front when full.",
     "code": "from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap, self.d = cap, OrderedDict()\n\n    def get(self, k):\n        if k not in self.d:\n            return -1\n        self.d.move_to_end(k)\n        return self.d[k]\n\n    def put(self, k, v):\n        self.d[k] = v\n        self.d.move_to_end(k)\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)   # least recently used",
     "st": {
      "p": "Write a class `LRU(cap)` implementing a least-recently-used cache with `get(k)` and `put(k, v)`. `get` returns the value for `k`, or -1 if `k` is not present, and counts as a use of `k`. `put` inserts or updates `k`, and also counts as a use; if inserting a new key would push the cache past `cap`, evict the least recently used key first. Both operations must run in O(1).",
      "ex": [
       {
        "i": "LRU(2); put(1, 'a'); put(2, 'b'); get(1); put(3, 'c'); get(2)",
        "o": "-1",
        "why": "getting key 1 makes key 2 the least recently used, so key 2 is the one evicted when key 3 is inserted"
       },
       {
        "i": "LRU(1); get(5)",
        "o": "-1",
        "why": "edge case: a miss on an empty cache returns -1 rather than raising"
       }
      ],
      "k": [
       "O(1) time per get and put",
       "O(cap) space"
      ]
     }
    }
   ],
   "spot": "Small utilities that come up in AI engineering rounds.",
   "cx": "Mostly O(n).",
   "tpl": "# chunk text with overlap\ndef chunk(text, size=800, overlap=100):\n    step = size - overlap\n    return [text[i:i + size] for i in range(0, len(text), step)]",
   "probs": [
    {
     "n": "Token-bucket rate limiter",
     "ex": {
      "i": "rate = 1 per second, capacity = 2; three calls at once",
      "o": "True, True, False",
      "w": "the burst is two"
     },
     "l": "medium",
     "task": "Allow at most rate requests per second with bursts up to capacity.",
     "hint": "Refill tokens by elapsed time; spend one per request.",
     "sol": "import time\n\nclass TokenBucket:\n    def __init__(self, rate, capacity):\n        self.rate, self.capacity = rate, capacity\n        self.tokens, self.last = capacity, time.monotonic()\n\n    def allow(self):\n        now = time.monotonic()\n        # refill for the time since the last call, capped\n        self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.rate)\n        self.last = now\n        if self.tokens >= 1:\n            self.tokens -= 1\n            return True\n        return False",
     "c": "O(1) per call.",
     "st": {
      "p": "Your service enforces a rate limit using a token bucket. Write a class `TokenBucket(rate, capacity)` whose `allow()` method returns True and consumes one token if a token is available, or False otherwise. Tokens refill continuously at `rate` tokens per second, up to `capacity`, based on the elapsed time since the last check.",
      "ex": [
       {
        "i": "TokenBucket(1, 2); allow(); allow(); allow()  # three calls back to back",
        "o": "True, True, False",
        "why": "capacity 2 allows a burst of 2 with almost no elapsed time between calls, then the third call finds no tokens left"
       },
       {
        "i": "TokenBucket(0, 1); allow(); allow()",
        "o": "True, False",
        "why": "edge case: a rate of 0 never refills, so only the initial token is ever spent"
       }
      ],
      "k": [
       "O(1) time per call",
       "no background timer; refill is computed lazily from elapsed time"
      ]
     }
    },
    {
     "n": "Cosine top-k retrieval",
     "ex": {
      "i": "query [1, 0]; docs [1, 0], [0, 1], [0.9, 0.1]; k = 2",
      "o": "docs 0 and 2",
      "w": "closest in angle"
     },
     "l": "easy",
     "task": "Given a query vector and document vectors, return the k most similar.",
     "hint": "Normalise, dot product, argsort.",
     "sol": "import numpy as np\n\ndef top_k(query, docs, k=5):\n    q = query / np.linalg.norm(query)\n    d = docs / np.linalg.norm(docs, axis=1, keepdims=True)\n    scores = d @ q\n    idx = np.argsort(-scores)[:k]\n    return list(zip(idx.tolist(), scores[idx].tolist()))",
     "c": "O(n d) for n docs of dimension d.",
     "st": {
      "p": "Your retrieval service has a `query` embedding and a matrix `docs` of document embeddings, one row per document. Write `top_k(query, docs, k)` that returns the `k` documents most similar to the query by cosine similarity, as a list of (index, score) pairs ordered from most to least similar. If there are fewer than `k` documents, return all of them.",
      "ex": [
       {
        "i": "top_k([1, 0], [[1, 0], [0, 1], [0.9, 0.1]], 2)",
        "o": "[(0, 1.0), (2, 0.9939)]",
        "why": "document 0 points exactly at the query and document 2 is nearly aligned; document 1 is orthogonal and dropped"
       },
       {
        "i": "top_k([1, 0], [[1, 0]], 5)",
        "o": "[(0, 1.0)]",
        "why": "edge case: k larger than the number of documents returns all of them"
       }
      ],
      "k": [
       "O(n x d) time for n documents of dimension d",
       "vectors are normalised before the dot product"
      ]
     }
    },
    {
     "n": "Simple word tokenizer and vocabulary",
     "ex": {
      "i": "vocab from \"Hello world\", \"hello there\"; encode \"hello unknown\"",
      "o": "[1, 0]",
      "w": "0 is unknown"
     },
     "l": "easy",
     "task": "Turn texts into lists of integer ids with a vocabulary.",
     "hint": "Lowercase, split on non-letters, assign ids in order, reserve 0 for unknown.",
     "sol": "import re\n\ndef build_vocab(texts):\n    vocab = {\"<unk>\": 0}\n    for t in texts:\n        for w in re.findall(r\"[a-z']+\", t.lower()):\n            vocab.setdefault(w, len(vocab))\n    return vocab\n\ndef encode(text, vocab):\n    return [vocab.get(w, 0) for w in re.findall(r\"[a-z']+\", text.lower())]",
     "c": "O(total characters).",
     "st": {
      "p": "Write `build_vocab(texts)` that scans a list of texts and returns a dictionary mapping each distinct lowercase word to an integer id, reserving id 0 for an `<unk>` unknown-word entry. Then write `encode(text, vocab)` that turns a text into a list of ids using that vocabulary, mapping any word not seen during `build_vocab` to 0. A word is a maximal run of letters and apostrophes; digits and punctuation are not part of any word and are skipped rather than becoming unknown tokens.",
      "ex": [
       {
        "i": "build_vocab([\"Hello world\", \"hello there\"]); encode(\"hello unknown\", vocab)",
        "o": "[1, 0]",
        "why": "\"hello\" was seen while building the vocabulary and gets its id; \"unknown\" was not, so it maps to 0"
       },
       {
        "i": "build_vocab([\"cat, dog!\"]); encode(\"Cat dog 123\", vocab)",
        "o": "[1, 2]",
        "why": "edge case: the digits in \"123\" contain no letters, so they produce no token at all, not an unknown one"
       }
      ],
      "k": [
       "O(total characters) time to build the vocabulary and to encode a text",
       "vocabulary ids are assigned in first-seen order"
      ]
     }
    }
   ],
   "g": "ai-systems"
  }
 ],
 "algo": {
  "bfs": {
   "title": "BFS",
   "pop": "graphs",
   "at": 0,
   "ex": {
    "i": "edges 1-2, 1-3, 3-4, from 1",
    "o": "{1: 0, 2: 1, 3: 1, 4: 2}",
    "w": ""
   },
   "spot": "Fewest steps; level by level; unweighted.",
   "code": "q, dist = deque([s]), {s: 0}\nwhile q:\n    u = q.popleft()\n    for v in g[u]:\n        if v not in dist:\n            dist[v] = dist[u] + 1\n            q.append(v)",
   "notes": [
    "Mark when you push, not when you pop.",
    "Many sources: start the queue with all of them.",
    "O(V + E)."
   ]
  },
  "dfs": {
   "title": "DFS",
   "pop": "graphs",
   "at": 1,
   "ex": {
    "i": "edges 1-2, 3-4; count pieces",
    "o": "2",
    "w": ""
   },
   "spot": "Explore everything; components, paths, cycles.",
   "code": "def dfs(u):\n    seen.add(u)\n    for v in g[u]:\n        if v not in seen:\n            dfs(v)",
   "notes": [
    "Iterative: a stack instead of the call stack.",
    "Directed cycle: meeting a node still on the path.",
    "Past 1,000 deep: go iterative. O(V + E)."
   ]
  },
  "topo": {
   "title": "Topological sort",
   "pop": "order",
   "at": 1,
   "ex": {
    "i": "0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3",
    "o": "[0, 1, 2, 3]",
    "w": ""
   },
   "spot": "Prerequisites; build order; can all finish.",
   "code": "q = deque(u for u in range(n) if indeg[u] == 0)\norder = []\nwhile q:\n    u = q.popleft()\n    order.append(u)\n    for v in g[u]:\n        indeg[v] -= 1\n        if indeg[v] == 0:\n            q.append(v)",
   "notes": [
    "len(order) &lt; n means a cycle.",
    "DFS version: post-order, reversed. O(V + E)."
   ]
  },
  "dijkstra": {
   "title": "Dijkstra",
   "pop": "order",
   "at": 2,
   "ex": {
    "i": "a-b 1, b-c 2, a-c 4, from a",
    "o": "c = 3",
    "w": ""
   },
   "spot": "Cheapest path; non-negative weights.",
   "code": "dist, h = {s: 0}, [(0, s)]\nwhile h:\n    d, u = heapq.heappop(h)\n    if d > dist[u]: continue   # stale\n    for v, w in g[u]:\n        if d + w < dist.get(v, inf):\n            dist[v] = d + w\n            heapq.heappush(h, (d + w, v))",
   "notes": [
    "Negative weights: Bellman-Ford, n - 1 rounds.",
    "At most k stops: Bellman-Ford, k + 1 rounds.",
    "O(E log V)."
   ]
  },
  "uf": {
   "title": "Union-find",
   "pop": "order",
   "at": 0,
   "ex": {
    "i": "union(0, 1), union(1, 2); find(0) == find(2)",
    "o": "True",
    "w": ""
   },
   "spot": "Are these connected; merge groups; redundant edge.",
   "code": "def find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\n\ndef union(a, b):\n    ra, rb = find(a), find(b)\n    if ra == rb: return False   # a cycle\n    parent[ra] = rb\n    return True",
   "notes": [
    "parent = list(range(n)) to start.",
    "Components = n minus successful unions.",
    "Nearly O(1) per call."
   ]
  },
  "kadane": {
   "title": "Kadane's: max subarray",
   "pop": "dp",
   "at": 5,
   "ex": {
    "i": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    "o": "6",
    "w": "[4, -1, 2, 1]"
   },
   "spot": "Best contiguous sum.",
   "code": "best = cur = a[0]\nfor x in a[1:]:\n    cur = max(x, cur + x)   # extend, or restart at x\n    best = max(best, cur)",
   "notes": [
    "Max product: track the min too; a negative flips them.",
    "Circular: total minus the min subarray. O(n), O(1)."
   ]
  },
  "sorting": {
   "title": "Sorting and selection",
   "pop": "heap",
   "at": 1,
   "ex": {
    "i": "[3, 2, 1, 5, 6, 4], kth largest, k = 2",
    "o": "5",
    "w": ""
   },
   "spot": "Sort to expose order; select without a full sort.",
   "code": "def merge_sort(a):\n    if len(a) <= 1: return a\n    m = len(a) // 2\n    l, r = merge_sort(a[:m]), merge_sort(a[m:])\n    out, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]: out.append(l[i]); i += 1\n        else: out.append(r[j]); j += 1\n    return out + l[i:] + r[j:]",
   "notes": [
    "sorted() is Timsort: stable, O(n log n).",
    "Kth: quickselect, O(n) average; or a heap of k.",
    "Small values: counting sort, O(n + k)."
   ]
  }
 },
 "algos": [
  {
   "id": "searching",
   "title": "Searching",
   "items": [
    {
     "id": "binary-search",
     "title": "Binary search",
     "also": "exact, lower bound, upper bound",
     "spot": "Sorted input; find, first or last position; log n time asked for.",
     "pat": "binary",
     "ex": {
      "i": "a = [1, 3, 5, 7, 9], x = 7",
      "o": "3"
     },
     "code": "def binary_search(a, x):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == x:\n            return mid\n        if a[mid] < x:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
     "time": "O(log n)",
     "space": "O(1)",
     "notes": [
      "An exact hit uses `lo <= hi` and moves by `mid + 1` or `mid - 1`. A boundary search uses `lo < hi` and `hi = mid`. Pick one habit for each.",
      "`bisect_left` is the lower bound and `bisect_right` the upper bound."
     ],
     "vars": [
      {
       "n": "Lower bound",
       "t": "The first index with `a[i] >= x`, or `len(a)` if none. A half-open range `[lo, hi)`: `hi` can be the answer, so it starts at `len(a)`.",
       "code": "def lower_bound(a, x):\n    lo, hi = 0, len(a)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if a[mid] < x:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo"
      },
      {
       "n": "Upper bound",
       "t": "The first index with `a[i] > x`. One comparison changes: `<=` instead of `<`. The count of `x` is upper minus lower.",
       "code": "def upper_bound(a, x):\n    lo, hi = 0, len(a)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if a[mid] <= x:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo"
      },
      {
       "n": "Standard library",
       "t": "Both bounds are built in. Use them unless the interviewer asks you to write the loop.",
       "code": "from bisect import bisect_left, bisect_right\n\ndef count_of(a, x):\n    return bisect_right(a, x) - bisect_left(a, x)"
      }
     ]
    },
    {
     "id": "binary-search-answer",
     "title": "Search on the answer",
     "also": "the first value where a yes/no check turns yes",
     "spot": "Smallest or largest value that works; minimise the maximum; a yes/no check on a guess that flips once.",
     "pat": "binary",
     "ex": {
      "i": "piles = [3, 6, 7, 11], h = 8",
      "o": "4"
     },
     "code": "def first_true(lo, hi, ok):\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if ok(mid):\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo\n\ndef min_speed(piles, h):\n    return first_true(1, max(piles), lambda k: sum((p + k - 1) // k for p in piles) <= h)",
     "time": "O(n log R) for a check of cost n over a range of size R",
     "space": "O(1)",
     "notes": [
      "`ok(hi)` must be true before you start: the loop never tests it.",
      "To find the largest value that works, search for the first one that fails and subtract one."
     ],
     "vars": [
      {
       "n": "Ship packages in D days",
       "t": "Same loop. The check simulates loading with a given capacity and counts the days.",
       "code": "# needs first_true from above\ndef ship_within_days(weights, days):\n    def ok(cap):\n        need, load = 1, 0\n        for w in weights:\n            if load + w > cap:\n                need, load = need + 1, 0\n            load += w\n        return need <= days\n    return first_true(max(weights), sum(weights), ok)"
      },
      {
       "n": "Integer square root",
       "t": "The largest `x` with `x * x <= n`: find the first `x` that fails and step back one.",
       "code": "# needs first_true from above\ndef isqrt_floor(n):\n    return first_true(0, n + 1, lambda x: x * x > n) - 1"
      }
     ]
    }
   ]
  },
  {
   "id": "windows",
   "title": "Pointers, windows, prefix sums",
   "items": [
    {
     "id": "two-pointers",
     "title": "Two pointers",
     "also": "from both ends",
     "spot": "Sorted array and a target; pairs or triples; in-place rewrite; compare from both ends.",
     "pat": "pointers",
     "ex": {
      "i": "a = [2, 7, 11, 15], target = 9",
      "o": "[0, 1]"
     },
     "code": "def two_sum_sorted(a, target):\n    l, r = 0, len(a) - 1\n    while l < r:\n        s = a[l] + a[r]\n        if s == target:\n            return [l, r]\n        if s < target:\n            l += 1\n        else:\n            r -= 1\n    return []",
     "time": "O(n)",
     "space": "O(1)",
     "notes": [
      "Unsorted input and one pair: a dict of seen values is O(n) without sorting."
     ],
     "vars": [
      {
       "n": "Container with most water",
       "t": "Move the pointer at the shorter wall: the other move can only make the area smaller.",
       "code": "def max_area(height):\n    l, r, best = 0, len(height) - 1, 0\n    while l < r:\n        best = max(best, min(height[l], height[r]) * (r - l))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return best"
      },
      {
       "n": "3Sum",
       "t": "Sort, fix one number, run the pair search on the rest, skip repeated values. O(n^2).",
       "code": "def three_sum(nums):\n    nums = sorted(nums)\n    out = []\n    for i, x in enumerate(nums):\n        if i and x == nums[i - 1]:\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = x + nums[l] + nums[r]\n            if s < 0:\n                l += 1\n            elif s > 0:\n                r -= 1\n            else:\n                out.append([x, nums[l], nums[r]])\n                l += 1\n                while l < r and nums[l] == nums[l - 1]:\n                    l += 1\n    return out"
      },
      {
       "n": "Remove duplicates in place",
       "t": "Fast and slow: `fast` reads, `slow` marks where the next kept value goes.",
       "code": "def dedupe_sorted(a):\n    slow = 0\n    for fast in range(1, len(a)):\n        if a[fast] != a[slow]:\n            slow += 1\n            a[slow] = a[fast]\n    return slow + 1 if a else 0"
      }
     ]
    },
    {
     "id": "window-fixed",
     "title": "Fixed window",
     "also": "slide by adding one and dropping one",
     "spot": "Subarray or substring of exactly k; best, sum or count of every window of size k.",
     "pat": "window",
     "ex": {
      "i": "a = [2, 1, 5, 1, 3, 2], k = 3",
      "o": "9"
     },
     "code": "def max_sum_k(a, k):\n    if k > len(a):\n        return None\n    cur = best = sum(a[:k])\n    for i in range(k, len(a)):\n        cur += a[i] - a[i - k]\n        best = max(best, cur)\n    return best",
     "time": "O(n)",
     "space": "O(1)",
     "vars": [
      {
       "n": "Maximum of every window",
       "t": "A deque of indices whose values fall from front to back: the front is the window's maximum.",
       "code": "from collections import deque\n\ndef window_max(a, k):\n    q, out = deque(), []\n    for i, x in enumerate(a):\n        while q and a[q[-1]] <= x:\n            q.pop()\n        q.append(i)\n        if q[0] <= i - k:\n            q.popleft()\n        if i >= k - 1:\n            out.append(a[q[0]])\n    return out"
      },
      {
       "n": "Anagrams of p in s",
       "t": "Keep a count of the window; when it equals the count of `p`, record the start.",
       "code": "from collections import Counter\n\ndef find_anagrams(s, p):\n    need, win, out = Counter(p), Counter(), []\n    for i, c in enumerate(s):\n        win[c] += 1\n        if i >= len(p):\n            old = s[i - len(p)]\n            win[old] -= 1\n            if win[old] == 0:\n                del win[old]\n        if win == need:\n            out.append(i - len(p) + 1)\n    return out"
      }
     ]
    },
    {
     "id": "window-variable",
     "title": "Variable window",
     "also": "a dict inside the window",
     "spot": "Longest or shortest substring or subarray that meets a rule; the rule can be kept up to date as the window grows and shrinks.",
     "pat": "window",
     "ex": {
      "i": "s = \"abcabcbb\"",
      "o": "3"
     },
     "code": "def longest_unique(s):\n    last, l, best = {}, 0, 0\n    for r, c in enumerate(s):\n        if c in last and last[c] >= l:\n            l = last[c] + 1\n        last[c] = r\n        best = max(best, r - l + 1)\n    return best",
     "time": "O(n)",
     "space": "O(k) for k distinct characters",
     "notes": [
      "The right edge always moves. The left edge moves while the window is invalid (for a longest) or while it is still valid (for a shortest).",
      "Keep the rule as one counter, never a rescan of the window."
     ],
     "vars": [
      {
       "n": "At most k distinct characters",
       "t": "Count each character; shrink from the left while there are more than k kinds.",
       "code": "def longest_k_distinct(s, k):\n    cnt, l, best = {}, 0, 0\n    for r, c in enumerate(s):\n        cnt[c] = cnt.get(c, 0) + 1\n        while len(cnt) > k:\n            cnt[s[l]] -= 1\n            if cnt[s[l]] == 0:\n                del cnt[s[l]]\n            l += 1\n        best = max(best, r - l + 1)\n    return best"
      },
      {
       "n": "Minimum window substring",
       "t": "`missing` counts the needed characters not yet covered. While it is zero, record the window and shrink.",
       "code": "from collections import Counter\n\ndef min_window(s, t):\n    if not t:\n        return \"\"\n    need, missing = Counter(t), len(t)\n    best, l = \"\", 0\n    for r, c in enumerate(s):\n        if need[c] > 0:\n            missing -= 1\n        need[c] -= 1\n        while missing == 0:\n            if not best or r - l + 1 < len(best):\n                best = s[l:r + 1]\n            need[s[l]] += 1\n            if need[s[l]] > 0:\n                missing += 1\n            l += 1\n    return best"
      }
     ]
    },
    {
     "id": "prefix-map",
     "title": "Prefix sums and a map",
     "also": "subarray sum equals k",
     "spot": "Subarray sum equals k or is divisible by k; negatives allowed, so a window fails; count the subarrays or find the longest.",
     "pat": "prefix",
     "ex": {
      "i": "nums = [1, 2, 3], k = 3",
      "o": "2"
     },
     "code": "def subarray_sum(nums, k):\n    seen, total, count = {0: 1}, 0, 0\n    for x in nums:\n        total += x\n        count += seen.get(total - k, 0)\n        seen[total] = seen.get(total, 0) + 1\n    return count",
     "time": "O(n)",
     "space": "O(n)",
     "notes": [
      "Seed the map with `{0: 1}`: a prefix that equals k by itself."
     ],
     "vars": [
      {
       "n": "Range sum queries",
       "t": "Build the prefix array once; any range sum is two lookups.",
       "code": "from itertools import accumulate\n\ndef build_prefix(a):\n    return list(accumulate(a, initial=0))\n\ndef range_sum(prefix, l, r):\n    return prefix[r + 1] - prefix[l]"
      },
      {
       "n": "Longest subarray with sum k",
       "t": "Store the first index where each prefix sum appears; the longest span is the earliest match.",
       "code": "def longest_sum_k(nums, k):\n    first, total, best = {0: -1}, 0, 0\n    for i, x in enumerate(nums):\n        total += x\n        if total - k in first:\n            best = max(best, i - first[total - k])\n        first.setdefault(total, i)\n    return best"
      }
     ]
    }
   ]
  },
  {
   "id": "stacks",
   "title": "Stacks",
   "items": [
    {
     "id": "brackets",
     "title": "Balanced brackets",
     "also": "a stack of openers",
     "spot": "Nested pairs; the last thing opened is the first closed; undo the latest step.",
     "pat": "stack",
     "ex": {
      "i": "s = \"([]{})\"",
      "o": "True"
     },
     "code": "def is_valid(s):\n    pairs, stack = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}, []\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]:\n                return False\n        else:\n            stack.append(c)\n    return not stack",
     "time": "O(n)",
     "space": "O(n)",
     "notes": [
      "Check for an empty stack before every pop."
     ],
     "vars": [
      {
       "n": "Fewest additions to balance",
       "t": "No stack needed for one bracket type: count the unmatched openers and the closers that found none.",
       "code": "def min_add_to_make_valid(s):\n    open_, add = 0, 0\n    for c in s:\n        if c == \"(\":\n            open_ += 1\n        elif open_:\n            open_ -= 1\n        else:\n            add += 1\n    return add + open_"
      }
     ]
    },
    {
     "id": "monotonic-stack",
     "title": "Monotonic stack",
     "also": "next greater; largest rectangle",
     "spot": "Next greater or smaller element; days until warmer; the widest span where one value is the extreme.",
     "pat": "stack",
     "ex": {
      "i": "a = [2, 1, 2, 4, 3]",
      "o": "[4, 2, 4, -1, -1]"
     },
     "code": "def next_greater(a):\n    res, st = [-1] * len(a), []\n    for i, x in enumerate(a):\n        while st and a[st[-1]] < x:\n            res[st.pop()] = x\n        st.append(i)\n    return res",
     "time": "O(n): each index is pushed and popped once",
     "space": "O(n)",
     "notes": [
      "Store indices, not values, when you need a distance or a width.",
      "The stack stays sorted: decreasing for next greater, increasing for next smaller."
     ],
     "vars": [
      {
       "n": "Days until warmer",
       "t": "The same loop, writing the distance `i - j` instead of the value.",
       "code": "def daily_temperatures(t):\n    res, st = [0] * len(t), []\n    for i, x in enumerate(t):\n        while st and t[st[-1]] < x:\n            j = st.pop()\n            res[j] = i - j\n        st.append(i)\n    return res"
      },
      {
       "n": "Largest rectangle in a histogram",
       "t": "Pop every taller bar when a shorter one arrives; each popped bar's width reaches back to where its group started. A final 0 flushes the stack.",
       "code": "def largest_rectangle(h):\n    st, best = [], 0\n    for i, x in enumerate(h + [0]):\n        start = i\n        while st and st[-1][1] > x:\n            j, height = st.pop()\n            best = max(best, height * (i - j))\n            start = j\n        st.append((start, x))\n    return best"
      }
     ]
    }
   ]
  },
  {
   "id": "trees",
   "title": "Trees",
   "items": [
    {
     "id": "tree-dfs",
     "title": "Tree DFS",
     "also": "pre, in and post order, recursive and iterative",
     "spot": "Visit every node; a value built from the children (post-order) or passed down to them (pre-order); a BST in sorted order (in-order).",
     "pat": "trees",
     "ex": {
      "i": "root = [4, 2, 6, 1, 3]",
      "o": "[4, 2, 1, 3, 6]"
     },
     "code": "def preorder(root):\n    return [root.val] + preorder(root.left) + preorder(root.right) if root else []\n\ndef inorder(root):\n    return inorder(root.left) + [root.val] + inorder(root.right) if root else []\n\ndef postorder(root):\n    return postorder(root.left) + postorder(root.right) + [root.val] if root else []",
     "time": "O(n)",
     "space": "O(h) for the call stack, h the height",
     "notes": [
      "Python stops near 1,000 frames: a skewed tree of 10^5 nodes needs the iterative form.",
      "Only the position of the node's own value changes between the three orders.",
      "The examples use the usual `TreeNode(val, left, right)` class."
     ],
     "vars": [
      {
       "n": "In-order, iterative",
       "t": "Walk left pushing nodes, pop one, visit it, go right.",
       "code": "def inorder_iter(root):\n    out, st, cur = [], [], root\n    while cur or st:\n        while cur:\n            st.append(cur)\n            cur = cur.left\n        cur = st.pop()\n        out.append(cur.val)\n        cur = cur.right\n    return out"
      },
      {
       "n": "Pre-order, iterative",
       "t": "Pop, visit, push right then left so left comes off first.",
       "code": "def preorder_iter(root):\n    out, st = [], [root]\n    while st:\n        n = st.pop()\n        if n:\n            out.append(n.val)\n            st.append(n.right)\n            st.append(n.left)\n    return out"
      },
      {
       "n": "Post-order, iterative",
       "t": "Root, right, left in a mirrored pre-order, then reverse the result.",
       "code": "def postorder_iter(root):\n    out, st = [], [root]\n    while st:\n        n = st.pop()\n        if n:\n            out.append(n.val)\n            st.append(n.left)\n            st.append(n.right)\n    return out[::-1]"
      }
     ]
    },
    {
     "id": "level-order",
     "title": "Level order",
     "also": "BFS on a tree",
     "spot": "By level; shortest depth; right side view; anything said layer by layer.",
     "pat": "trees",
     "ex": {
      "i": "root = [3, 9, 20, None, None, 15, 7]",
      "o": "[[3], [9, 20], [15, 7]]"
     },
     "code": "from collections import deque\n\ndef level_order(root):\n    out, q = [], deque([root] if root else [])\n    while q:\n        out.append([n.val for n in q])\n        for _ in range(len(q)):\n            n = q.popleft()\n            if n.left:\n                q.append(n.left)\n            if n.right:\n                q.append(n.right)\n    return out",
     "time": "O(n)",
     "space": "O(w), w the widest level",
     "notes": [
      "Take `len(q)` before the inner loop: the queue grows while you drain it."
     ],
     "vars": [
      {
       "n": "Right side view",
       "t": "The last node of each level.",
       "code": "from collections import deque\n\ndef right_side_view(root):\n    out, q = [], deque([root] if root else [])\n    while q:\n        out.append(q[-1].val)\n        for _ in range(len(q)):\n            n = q.popleft()\n            if n.left:\n                q.append(n.left)\n            if n.right:\n                q.append(n.right)\n    return out"
      },
      {
       "n": "Zigzag",
       "t": "Reverse every second level as you collect it.",
       "code": "from collections import deque\n\ndef zigzag(root):\n    out, q = [], deque([root] if root else [])\n    while q:\n        level = [n.val for n in q]\n        out.append(level[::-1] if len(out) % 2 else level)\n        for _ in range(len(q)):\n            n = q.popleft()\n            if n.left:\n                q.append(n.left)\n            if n.right:\n                q.append(n.right)\n    return out"
      }
     ]
    },
    {
     "id": "validate-bst",
     "title": "Validate a BST",
     "also": "carry a range down",
     "spot": "Check the search-tree rule across the whole tree, not only parent and child; every node sits inside a range.",
     "pat": "trees",
     "ex": {
      "i": "root = [5, 1, 4, None, None, 3, 6]",
      "o": "False"
     },
     "code": "def is_valid_bst(root, lo=float(\"-inf\"), hi=float(\"inf\")):\n    if not root:\n        return True\n    if not lo < root.val < hi:\n        return False\n    return is_valid_bst(root.left, lo, root.val) and is_valid_bst(root.right, root.val, hi)",
     "time": "O(n)",
     "space": "O(h)",
     "notes": [
      "Comparing a node only with its parent passes the example above: 3 sits in the right subtree of 5."
     ],
     "vars": [
      {
       "n": "In-order stays increasing",
       "t": "A BST read in order is strictly increasing: compare each value with the one before it.",
       "code": "def is_valid_bst_inorder(root):\n    st, cur, prev = [], root, float(\"-inf\")\n    while cur or st:\n        while cur:\n            st.append(cur)\n            cur = cur.left\n        cur = st.pop()\n        if cur.val <= prev:\n            return False\n        prev = cur.val\n        cur = cur.right\n    return True"
      },
      {
       "n": "Kth smallest in a BST",
       "t": "The same walk, stopping at the kth visit.",
       "code": "def kth_smallest(root, k):\n    st, cur = [], root\n    while cur or st:\n        while cur:\n            st.append(cur)\n            cur = cur.left\n        cur = st.pop()\n        k -= 1\n        if k == 0:\n            return cur.val\n        cur = cur.right"
      }
     ]
    },
    {
     "id": "lca",
     "title": "Lowest common ancestor",
     "also": "binary tree, and a BST",
     "spot": "Closest shared ancestor of two nodes; where two paths up meet.",
     "pat": "trees",
     "ex": {
      "i": "root = [3, 5, 1, 6, 2, 0, 8], p = 5, q = 1",
      "o": "3"
     },
     "code": "def lca(root, p, q):\n    if not root or root is p or root is q:\n        return root\n    l, r = lca(root.left, p, q), lca(root.right, p, q)\n    return root if l and r else l or r",
     "time": "O(n)",
     "space": "O(h)",
     "notes": [
      "When `p` and `q` sit in different subtrees, the current node is the answer; otherwise pass up whichever side found something."
     ],
     "vars": [
      {
       "n": "In a BST",
       "t": "Both smaller go left, both larger go right, otherwise this node splits them. No recursion needed.",
       "code": "def lca_bst(root, p, q):\n    while root:\n        if p.val < root.val and q.val < root.val:\n            root = root.left\n        elif p.val > root.val and q.val > root.val:\n            root = root.right\n        else:\n            return root"
      }
     ]
    },
    {
     "id": "serialize-tree",
     "title": "Serialize a tree",
     "also": "pre-order with markers, and level order",
     "spot": "Turn a tree into a string and back; the string has to carry the nulls.",
     "pat": "trees",
     "ex": {
      "i": "root = [1, 2, 3, None, None, 4, 5]",
      "o": "\"1,2,#,#,3,4,#,#,5,#,#\""
     },
     "code": "def serialize(root):\n    out = []\n    def go(n):\n        if not n:\n            out.append(\"#\")\n            return\n        out.append(str(n.val))\n        go(n.left)\n        go(n.right)\n    go(root)\n    return \",\".join(out)\n\ndef deserialize(data):\n    it = iter(data.split(\",\"))\n    def go():\n        v = next(it)\n        if v == \"#\":\n            return None\n        n = TreeNode(int(v))\n        n.left = go()\n        n.right = go()\n        return n\n    return go()",
     "time": "O(n)",
     "space": "O(n)",
     "notes": [
      "Pre-order with null markers rebuilds any binary tree. In-order alone does not."
     ],
     "vars": [
      {
       "n": "Level order",
       "t": "The format LeetCode shows. Each real node is followed by markers for both children.",
       "code": "from collections import deque\n\ndef serialize_bfs(root):\n    out, q = [], deque([root])\n    while q:\n        n = q.popleft()\n        if n:\n            out.append(str(n.val))\n            q.append(n.left)\n            q.append(n.right)\n        else:\n            out.append(\"#\")\n    return \",\".join(out)\n\ndef deserialize_bfs(data):\n    vals = data.split(\",\")\n    if vals[0] == \"#\":\n        return None\n    root = TreeNode(int(vals[0]))\n    q, i = deque([root]), 1\n    while q:\n        n = q.popleft()\n        if vals[i] != \"#\":\n            n.left = TreeNode(int(vals[i]))\n            q.append(n.left)\n        if vals[i + 1] != \"#\":\n            n.right = TreeNode(int(vals[i + 1]))\n            q.append(n.right)\n        i += 2\n    return root"
      }
     ]
    },
    {
     "id": "bst-edit",
     "title": "BST insert and delete",
     "also": "the in-order successor",
     "spot": "Build or edit a search tree; delete a node that has two children.",
     "pat": "trees",
     "ex": {
      "i": "root = [5, 3, 6, 2, 4, None, 7], key = 3",
      "o": "[5, 4, 6, 2, None, None, 7]"
     },
     "code": "def bst_insert(root, val):\n    if not root:\n        return TreeNode(val)\n    if val < root.val:\n        root.left = bst_insert(root.left, val)\n    else:\n        root.right = bst_insert(root.right, val)\n    return root\n\ndef bst_delete(root, key):\n    if not root:\n        return None\n    if key < root.val:\n        root.left = bst_delete(root.left, key)\n    elif key > root.val:\n        root.right = bst_delete(root.right, key)\n    else:\n        if not root.left:\n            return root.right\n        if not root.right:\n            return root.left\n        nxt = root.right\n        while nxt.left:\n            nxt = nxt.left\n        root.val = nxt.val\n        root.right = bst_delete(root.right, nxt.val)\n    return root",
     "time": "O(h): log n balanced, n skewed",
     "space": "O(h) for the recursion",
     "notes": [
      "Two children: copy the in-order successor (the smallest value on the right) into the node, then delete that value from the right subtree."
     ],
     "vars": [
      {
       "n": "Insert, iterative",
       "t": "Walk down to a missing child and hang the new node there.",
       "code": "def bst_insert_iter(root, val):\n    node = TreeNode(val)\n    if not root:\n        return node\n    cur = root\n    while True:\n        if val < cur.val:\n            if not cur.left:\n                cur.left = node\n                return root\n            cur = cur.left\n        else:\n            if not cur.right:\n                cur.right = node\n                return root\n            cur = cur.right"
      },
      {
       "n": "In-order successor",
       "t": "The next larger value: the tightest ancestor whose left side you came from.",
       "code": "def successor(root, p):\n    best = None\n    while root:\n        if p.val < root.val:\n            best = root\n            root = root.left\n        else:\n            root = root.right\n    return best"
      }
     ]
    },
    {
     "id": "tree-height",
     "title": "Height and diameter",
     "also": "return one thing, record another",
     "spot": "A number that depends on both subtrees: height, diameter, balance, best path sum.",
     "pat": "trees",
     "ex": {
      "i": "root = [1, 2, 3, 4, 5]",
      "o": "3"
     },
     "code": "def diameter(root):\n    best = 0\n    def height(n):\n        nonlocal best\n        if not n:\n            return 0\n        l, r = height(n.left), height(n.right)\n        best = max(best, l + r)\n        return 1 + max(l, r)\n    height(root)\n    return best",
     "time": "O(n)",
     "space": "O(h)",
     "notes": [
      "What you return to the parent (the height) and what you record (the diameter through this node) are different numbers."
     ],
     "vars": [
      {
       "n": "Maximum depth",
       "t": "The smallest case of the same shape.",
       "code": "def max_depth(root):\n    return 1 + max(max_depth(root.left), max_depth(root.right)) if root else 0"
      },
      {
       "n": "Maximum path sum",
       "t": "Return the best downward path; record the best path that bends at this node. Negative branches count as zero.",
       "code": "def max_path_sum(root):\n    best = float(\"-inf\")\n    def gain(n):\n        nonlocal best\n        if not n:\n            return 0\n        l, r = max(gain(n.left), 0), max(gain(n.right), 0)\n        best = max(best, n.val + l + r)\n        return n.val + max(l, r)\n    gain(root)\n    return best"
      }
     ]
    }
   ]
  },
  {
   "id": "graphs",
   "title": "Graphs",
   "items": [
    {
     "id": "bfs",
     "title": "BFS",
     "also": "adjacency list, and a grid",
     "card": "bfs",
     "pat": "graphs",
     "ex": {
      "i": "g = {1: [2, 3], 2: [1], 3: [1, 4], 4: [3]}, s = 1",
      "o": "{1: 0, 2: 1, 3: 1, 4: 2}"
     },
     "code": "from collections import deque\n\ndef bfs(g, s):\n    dist, q = {s: 0}, deque([s])\n    while q:\n        u = q.popleft()\n        for v in g[u]:\n            if v not in dist:\n                dist[v] = dist[u] + 1\n                q.append(v)\n    return dist",
     "time": "O(V + E)",
     "space": "O(V)",
     "notes": [
      "Mark a node when you push it, not when you pop it, or it is queued many times.",
      "The distance dict doubles as the visited set."
     ],
     "vars": [
      {
       "n": "Shortest path on a grid",
       "t": "The node is a cell `(r, c)` and the four neighbours are computed. 0 is open, 1 is a wall.",
       "code": "from collections import deque\n\ndef grid_steps(grid, start, goal):\n    R, C = len(grid), len(grid[0])\n    q, seen = deque([(start, 0)]), {start}\n    while q:\n        (r, c), d = q.popleft()\n        if (r, c) == goal:\n            return d\n        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):\n            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0 and (nr, nc) not in seen:\n                seen.add((nr, nc))\n                q.append(((nr, nc), d + 1))\n    return -1"
      }
     ]
    },
    {
     "id": "dfs",
     "title": "DFS",
     "also": "recursive, and with a stack",
     "card": "dfs",
     "pat": "graphs",
     "ex": {
      "i": "n = 5, edges = [[0, 1], [1, 2], [3, 4]]",
      "o": "2"
     },
     "code": "def count_components(n, edges):\n    g = [[] for _ in range(n)]\n    for a, b in edges:\n        g[a].append(b)\n        g[b].append(a)\n    seen = set()\n    def dfs(u):\n        seen.add(u)\n        for v in g[u]:\n            if v not in seen:\n                dfs(v)\n    count = 0\n    for u in range(n):\n        if u not in seen:\n            dfs(u)\n            count += 1\n    return count",
     "time": "O(V + E)",
     "space": "O(V) for the seen set and the call stack",
     "notes": [
      "Python stops near 1,000 frames: a long path or a big grid needs the stack version.",
      "A directed cycle shows up as reaching a node that is still on the current path."
     ],
     "vars": [
      {
       "n": "Iterative",
       "t": "A list is the stack. Mark when you pop, since a node can be pushed more than once.",
       "code": "def dfs_iter(g, s):\n    seen, order, st = set(), [], [s]\n    while st:\n        u = st.pop()\n        if u in seen:\n            continue\n        seen.add(u)\n        order.append(u)\n        for v in g[u]:\n            if v not in seen:\n                st.append(v)\n    return order"
      },
      {
       "n": "Number of islands",
       "t": "A grid DFS with a stack: each unvisited land cell starts a new island.",
       "code": "def num_islands(grid):\n    R, C = len(grid), len(grid[0])\n    seen, count = set(), 0\n    def land(r, c):\n        return 0 <= r < R and 0 <= c < C and grid[r][c] == \"1\" and (r, c) not in seen\n    for r in range(R):\n        for c in range(C):\n            if land(r, c):\n                count += 1\n                seen.add((r, c))\n                st = [(r, c)]\n                while st:\n                    x, y = st.pop()\n                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):\n                        if land(nx, ny):\n                            seen.add((nx, ny))\n                            st.append((nx, ny))\n    return count"
      }
     ]
    },
    {
     "id": "topological-sort",
     "title": "Topological sort",
     "also": "Kahn's queue, and DFS with colours",
     "card": "topo",
     "pat": "order",
     "ex": {
      "i": "n = 4, edges = [[0, 1], [0, 2], [1, 3], [2, 3]]",
      "o": "[0, 1, 2, 3]"
     },
     "code": "from collections import deque\n\ndef topo_kahn(n, edges):\n    g, indeg = [[] for _ in range(n)], [0] * n\n    for a, b in edges:\n        g[a].append(b)\n        indeg[b] += 1\n    q = deque(u for u in range(n) if indeg[u] == 0)\n    order = []\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in g[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0:\n                q.append(v)\n    return order if len(order) == n else []",
     "time": "O(V + E)",
     "space": "O(V + E)",
     "notes": [
      "An edge `[a, b]` means a comes first. An empty result means a cycle.",
      "Kahn is a BFS that only enters a node once all its prerequisites are out."
     ],
     "vars": [
      {
       "n": "DFS with colours",
       "t": "0 is new, 1 is on the current path, 2 is finished. Meeting a 1 is a cycle. Finished nodes, reversed, are the order.",
       "code": "def topo_dfs(n, edges):\n    g = [[] for _ in range(n)]\n    for a, b in edges:\n        g[a].append(b)\n    color, order = [0] * n, []\n    def dfs(u):\n        color[u] = 1\n        for v in g[u]:\n            if color[v] == 1 or (color[v] == 0 and not dfs(v)):\n                return False\n        color[u] = 2\n        order.append(u)\n        return True\n    for u in range(n):\n        if color[u] == 0 and not dfs(u):\n            return []\n    return order[::-1]"
      }
     ]
    },
    {
     "id": "union-find",
     "title": "Union-find",
     "also": "path compression and union by rank",
     "card": "uf",
     "pat": "order",
     "ex": {
      "i": "UnionFind(4); union(0, 1); union(2, 3); union(1, 3)",
      "o": "count == 1"
     },
     "code": "class UnionFind:\n    def __init__(self, n):\n        self.parent, self.rank, self.count = list(range(n)), [0] * n, n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False\n        if self.rank[ra] < self.rank[rb]:\n            ra, rb = rb, ra\n        self.parent[rb] = ra\n        if self.rank[ra] == self.rank[rb]:\n            self.rank[ra] += 1\n        self.count -= 1\n        return True",
     "time": "Nearly O(1) per call (inverse Ackermann)",
     "space": "O(n)",
     "notes": [
      "`union` returning False means the two were already joined: that edge closes a cycle.",
      "The number of groups is `n` minus the successful unions, kept here in `count`."
     ],
     "vars": [
      {
       "n": "Redundant connection",
       "t": "The first edge whose ends are already joined. A bare `find` with path halving is enough.",
       "code": "def redundant_connection(edges):\n    parent = list(range(len(edges) + 1))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            return [a, b]\n        parent[ra] = rb"
      }
     ]
    },
    {
     "id": "dijkstra",
     "title": "Dijkstra",
     "also": "with a heap",
     "card": "dijkstra",
     "pat": "order",
     "ex": {
      "i": "g = {\"a\": [(\"b\", 1), (\"c\", 4)], \"b\": [(\"c\", 2)], \"c\": []}, s = \"a\"",
      "o": "{'a': 0, 'b': 1, 'c': 3}"
     },
     "code": "import heapq\n\ndef dijkstra(g, s):\n    dist, h = {s: 0}, [(0, s)]\n    while h:\n        d, u = heapq.heappop(h)\n        if d > dist[u]:\n            continue\n        for v, w in g[u]:\n            nd = d + w\n            if nd < dist.get(v, float(\"inf\")):\n                dist[v] = nd\n                heapq.heappush(h, (nd, v))\n    return dist",
     "time": "O(E log V)",
     "space": "O(V + E)",
     "notes": [
      "The heap is never updated, only added to. A popped entry with `d > dist[u]` is stale: skip it.",
      "A negative edge breaks the proof. Use Bellman-Ford."
     ],
     "vars": [
      {
       "n": "Recover the path",
       "t": "Remember the node each distance came from, then walk back from the target.",
       "code": "import heapq\n\ndef shortest_path(g, s, t):\n    dist, prev, h = {s: 0}, {}, [(0, s)]\n    while h:\n        d, u = heapq.heappop(h)\n        if d > dist[u]:\n            continue\n        if u == t:\n            break\n        for v, w in g[u]:\n            if d + w < dist.get(v, float(\"inf\")):\n                dist[v] = d + w\n                prev[v] = u\n                heapq.heappush(h, (d + w, v))\n    if t not in dist:\n        return []\n    path = [t]\n    while path[-1] != s:\n        path.append(prev[path[-1]])\n    return path[::-1]"
      }
     ]
    },
    {
     "id": "bellman-ford",
     "title": "Bellman-Ford",
     "also": "relax every edge n - 1 times",
     "spot": "Negative edge weights; at most k edges or stops; detect a negative cycle.",
     "pat": "order",
     "ex": {
      "i": "n = 4, edges = [[0, 1, 4], [0, 2, 5], [2, 1, -3], [1, 3, 2]], s = 0",
      "o": "[0, 2, 5, 4]"
     },
     "code": "def bellman_ford(n, edges, s):\n    dist = [float(\"inf\")] * n\n    dist[s] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    if any(dist[u] + w < dist[v] for u, v, w in edges):\n        return None\n    return dist",
     "time": "O(V * E)",
     "space": "O(V)",
     "notes": [
      "A path has at most n - 1 edges, so n - 1 rounds are enough. One more round that still improves something means a negative cycle."
     ],
     "vars": [
      {
       "n": "Cheapest flight within k stops",
       "t": "k stops is k + 1 edges. Relax from a copy of last round's distances so one round adds one edge.",
       "code": "def cheapest_within_k(n, flights, src, dst, k):\n    dist = [float(\"inf\")] * n\n    dist[src] = 0\n    for _ in range(k + 1):\n        nxt = dist[:]\n        for u, v, w in flights:\n            if dist[u] + w < nxt[v]:\n                nxt[v] = dist[u] + w\n        dist = nxt\n    return -1 if dist[dst] == float(\"inf\") else dist[dst]"
      }
     ]
    },
    {
     "id": "multi-source-bfs",
     "title": "Multi-source BFS",
     "also": "start the queue with every source",
     "spot": "Spread from many starts at once; minutes until everything is reached; distance to the nearest of several.",
     "pat": "graphs",
     "ex": {
      "i": "grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]",
      "o": "4"
     },
     "code": "from collections import deque\n\ndef rotting_oranges(grid):\n    R, C = len(grid), len(grid[0])\n    q = deque((r, c) for r in range(R) for c in range(C) if grid[r][c] == 2)\n    fresh = sum(row.count(1) for row in grid)\n    minutes = 0\n    while q and fresh:\n        minutes += 1\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):\n                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2\n                    fresh -= 1\n                    q.append((nr, nc))\n    return -1 if fresh else minutes",
     "time": "O(rows * columns)",
     "space": "O(rows * columns)",
     "notes": [
      "Put every source in the queue before the first pop: they all sit at distance 0.",
      "This version marks cells in place. Copy the grid first if the caller needs it back."
     ],
     "vars": [
      {
       "n": "Distance to the nearest 0",
       "t": "The zeros are the sources; each 1 learns its distance from the cell that reached it.",
       "code": "from collections import deque\n\ndef nearest_zero(mat):\n    R, C = len(mat), len(mat[0])\n    dist = [[0 if mat[r][c] == 0 else -1 for c in range(C)] for r in range(R)]\n    q = deque((r, c) for r in range(R) for c in range(C) if mat[r][c] == 0)\n    while q:\n        r, c = q.popleft()\n        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):\n            if 0 <= nr < R and 0 <= nc < C and dist[nr][nc] < 0:\n                dist[nr][nc] = dist[r][c] + 1\n                q.append((nr, nc))\n    return dist"
      }
     ]
    },
    {
     "id": "spanning-tree",
     "title": "Minimum spanning tree",
     "also": "Kruskal, and Prim",
     "spot": "Connect every node at the lowest total cost; cables, roads, the cheapest links.",
     "pat": "order",
     "ex": {
      "i": "n = 4, edges = [[1, 0, 1], [4, 0, 2], [3, 1, 2], [2, 2, 3]]",
      "o": "6"
     },
     "code": "def kruskal(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    total, used = 0, 0\n    for w, u, v in sorted(edges):\n        ru, rv = find(u), find(v)\n        if ru != rv:\n            parent[ru] = rv\n            total += w\n            used += 1\n    return total if used == n - 1 else -1",
     "time": "O(E log E)",
     "space": "O(V)",
     "notes": [
      "Edges are `[weight, u, v]` so they sort by weight. -1 means the graph is not connected.",
      "Kruskal suits an edge list. Prim grows from one node with a heap and suits a dense graph."
     ],
     "vars": [
      {
       "n": "Prim",
       "t": "Grow one tree: always take the cheapest edge that reaches a new node.",
       "code": "import heapq\n\ndef prim(n, g):\n    seen, h, total = set(), [(0, 0)], 0\n    while h and len(seen) < n:\n        w, u = heapq.heappop(h)\n        if u in seen:\n            continue\n        seen.add(u)\n        total += w\n        for w2, v in g[u]:\n            if v not in seen:\n                heapq.heappush(h, (w2, v))\n    return total if len(seen) == n else -1"
      }
     ]
    }
   ]
  },
  {
   "id": "heaps",
   "title": "Heaps",
   "items": [
    {
     "id": "heapq-basics",
     "title": "heapq basics",
     "also": "min-heap, max-heap, ties",
     "spot": "You always need the smallest or largest next; repeated removal of the extreme; a priority queue.",
     "pat": "heap",
     "ex": {
      "i": "nums = [5, 1, 4, 2]",
      "o": "[1, 2, 4, 5]"
     },
     "code": "import heapq\n\ndef heap_sort(nums):\n    h = list(nums)\n    heapq.heapify(h)\n    return [heapq.heappop(h) for _ in range(len(h))]",
     "time": "push and pop O(log n), heapify O(n)",
     "space": "O(n)",
     "notes": [
      "`heapq` is a min-heap, and `h[0]` is the smallest. For a max-heap push `-x`.",
      "Tuples compare left to right. Put an index second so items that cannot be compared never are."
     ],
     "vars": [
      {
       "n": "Max-heap",
       "t": "Negate on the way in and again on the way out.",
       "code": "import heapq\n\ndef sort_desc(nums):\n    h = [-x for x in nums]\n    heapq.heapify(h)\n    return [-heapq.heappop(h) for _ in range(len(h))]"
      },
      {
       "n": "Ties",
       "t": "Lowest priority number first; the arrival index breaks ties, so the names are never compared.",
       "code": "import heapq\n\ndef run_tasks(tasks):\n    h = [(p, i, name) for i, (p, name) in enumerate(tasks)]\n    heapq.heapify(h)\n    return [heapq.heappop(h)[2] for _ in range(len(h))]"
      }
     ]
    },
    {
     "id": "top-k",
     "title": "Top k",
     "also": "a heap of size k",
     "spot": "Kth largest, smallest or most frequent; k is much smaller than n.",
     "pat": "heap",
     "ex": {
      "i": "nums = [3, 2, 1, 5, 6, 4], k = 2",
      "o": "5"
     },
     "code": "import heapq\n\ndef kth_largest(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return h[0]",
     "time": "O(n log k)",
     "space": "O(k)",
     "notes": [
      "A min-heap of size k holds the k largest seen so far. Its root is the kth largest, the first one to be evicted.",
      "k near n: sort instead. k = 1: a single `max`."
     ],
     "vars": [
      {
       "n": "Top k frequent",
       "t": "Count, then keep a heap of the k highest counts.",
       "code": "import heapq\nfrom collections import Counter\n\ndef top_k_frequent(nums, k):\n    h = []\n    for x, c in Counter(nums).items():\n        heapq.heappush(h, (c, x))\n        if len(h) > k:\n            heapq.heappop(h)\n    return [x for _, x in h]"
      },
      {
       "n": "K closest points",
       "t": "Keep the k smallest distances: a max-heap by negating the distance.",
       "code": "import heapq\n\ndef k_closest(points, k):\n    h = []\n    for x, y in points:\n        heapq.heappush(h, (-(x * x + y * y), x, y))\n        if len(h) > k:\n            heapq.heappop(h)\n    return [[x, y] for _, x, y in h]"
      }
     ]
    },
    {
     "id": "k-way-merge",
     "title": "K-way merge",
     "also": "a heap of the k heads",
     "spot": "Merge k sorted lists, arrays or streams; the next smallest is always at one of k heads.",
     "pat": "heap",
     "ex": {
      "i": "lists = [[1, 4, 5], [1, 3, 4], [2, 6]]",
      "o": "[1, 1, 2, 3, 4, 4, 5, 6]"
     },
     "code": "import heapq\n\ndef merge_k_sorted(lists):\n    h = [(l[0], i, 0) for i, l in enumerate(lists) if l]\n    heapq.heapify(h)\n    out = []\n    while h:\n        v, i, j = heapq.heappop(h)\n        out.append(v)\n        if j + 1 < len(lists[i]):\n            heapq.heappush(h, (lists[i][j + 1], i, j + 1))\n    return out",
     "time": "O(N log k) for N items in total",
     "space": "O(k)",
     "notes": [
      "Push the list index next to the value so equal values never compare the lists."
     ],
     "vars": [
      {
       "n": "Linked lists",
       "t": "The same heap holds the head of each list. Splice the smallest onto the tail.",
       "code": "import heapq\n\ndef merge_k_lists(lists):\n    h = [(n.val, i, n) for i, n in enumerate(lists) if n]\n    heapq.heapify(h)\n    dummy = tail = ListNode()\n    while h:\n        _, i, n = heapq.heappop(h)\n        tail.next = n\n        tail = n\n        if n.next:\n            heapq.heappush(h, (n.next.val, i, n.next))\n    return dummy.next"
      },
      {
       "n": "Standard library",
       "t": "`heapq.merge` is the same idea and is lazy.",
       "code": "import heapq\n\ndef merge_stdlib(lists):\n    return list(heapq.merge(*lists))"
      }
     ]
    },
    {
     "id": "running-median",
     "title": "Running median",
     "also": "two heaps",
     "spot": "Median of a stream; the middle moves as numbers arrive.",
     "pat": "heap",
     "ex": {
      "i": "add 1, add 2, add 3, add 4; median",
      "o": "2.5"
     },
     "code": "import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.lo = []\n        self.hi = []\n\n    def add(self, x):\n        heapq.heappush(self.lo, -x)\n        heapq.heappush(self.hi, -heapq.heappop(self.lo))\n        if len(self.hi) > len(self.lo):\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\n\n    def median(self):\n        if len(self.lo) > len(self.hi):\n            return -self.lo[0]\n        return (-self.lo[0] + self.hi[0]) / 2",
     "time": "add O(log n), median O(1)",
     "space": "O(n)",
     "notes": [
      "`lo` is a max-heap (negated) holding the smaller half; `hi` is a min-heap holding the larger half. `lo` has the same size or one more.",
      "Push through the other heap first, then rebalance: it keeps every value in the right half."
     ],
     "vars": [
      {
       "n": "Kth largest in a stream",
       "t": "When k is fixed, one min-heap of size k is enough.",
       "code": "import heapq\n\nclass KthLargest:\n    def __init__(self, k, nums):\n        self.k, self.h = k, []\n        for x in nums:\n            self.add(x)\n\n    def add(self, x):\n        heapq.heappush(self.h, x)\n        if len(self.h) > self.k:\n            heapq.heappop(self.h)\n        return self.h[0]"
      }
     ]
    },
    {
     "id": "quickselect",
     "title": "QuickSelect",
     "also": "partition, then keep one side",
     "spot": "Kth smallest or largest in O(n) on average, without sorting everything.",
     "pat": "heap",
     "ex": {
      "i": "a = [3, 2, 1, 5, 6, 4], k = 1",
      "o": "2"
     },
     "code": "import random\n\ndef quickselect(a, k):\n    a = list(a)\n    lo, hi = 0, len(a) - 1\n    while lo < hi:\n        i = random.randint(lo, hi)\n        a[i], a[hi] = a[hi], a[i]\n        pivot, p = a[hi], lo\n        for j in range(lo, hi):\n            if a[j] < pivot:\n                a[j], a[p] = a[p], a[j]\n                p += 1\n        a[p], a[hi] = a[hi], a[p]\n        if p == k:\n            return a[p]\n        if p < k:\n            lo = p + 1\n        else:\n            hi = p - 1\n    return a[lo]",
     "time": "O(n) average, O(n^2) worst",
     "space": "O(n) for the copy",
     "notes": [
      "k is zero-based. The kth largest of n is index `n - k` of the sorted order.",
      "A random pivot avoids the quadratic case on sorted input. Many equal values: use the three-way form."
     ],
     "vars": [
      {
       "n": "Three-way partition",
       "t": "Split into smaller, equal and larger. Equal values all land in place, so duplicates stop being a problem.",
       "code": "import random\n\ndef quickselect_3way(a, k):\n    a = list(a)\n    lo, hi = 0, len(a) - 1\n    while lo < hi:\n        pivot = a[random.randint(lo, hi)]\n        lt, i, gt = lo, lo, hi\n        while i <= gt:\n            if a[i] < pivot:\n                a[lt], a[i] = a[i], a[lt]\n                lt += 1\n                i += 1\n            elif a[i] > pivot:\n                a[i], a[gt] = a[gt], a[i]\n                gt -= 1\n            else:\n                i += 1\n        if k < lt:\n            hi = lt - 1\n        elif k > gt:\n            lo = gt + 1\n        else:\n            return pivot\n    return a[lo]"
      }
     ]
    }
   ]
  },
  {
   "id": "hash-designs",
   "title": "Hash designs",
   "items": [
    {
     "id": "lru-cache",
     "title": "LRU cache",
     "also": "OrderedDict, and a hash map with a doubly linked list",
     "spot": "Evict the least recently used; get and put both O(1).",
     "ex": {
      "i": "capacity 2: put(1, 1), put(2, 2), get(1), put(3, 3), get(2)",
      "o": "1, then -1"
     },
     "code": "from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap, self.d = capacity, OrderedDict()\n\n    def get(self, key):\n        if key not in self.d:\n            return -1\n        self.d.move_to_end(key)\n        return self.d[key]\n\n    def put(self, key, value):\n        if key in self.d:\n            self.d.move_to_end(key)\n        self.d[key] = value\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)",
     "time": "O(1) per call",
     "space": "O(capacity)",
     "notes": [
      "Every get and every put moves the key to the recent end. Evict from the other end.",
      "Interviewers often ask for the second form: a dict to nodes plus a linked list you maintain by hand."
     ],
     "vars": [
      {
       "n": "Dict and doubly linked list",
       "t": "The structure behind `OrderedDict`. Sentinels at both ends remove the empty-list cases.",
       "code": "class Node:\n    def __init__(self, key=0, val=0):\n        self.key, self.val, self.prev, self.next = key, val, None, None\n\nclass LRUCacheList:\n    def __init__(self, capacity):\n        self.cap, self.map = capacity, {}\n        self.head, self.tail = Node(), Node()\n        self.head.next, self.tail.prev = self.tail, self.head\n\n    def _remove(self, n):\n        n.prev.next, n.next.prev = n.next, n.prev\n\n    def _add_front(self, n):\n        n.next, n.prev = self.head.next, self.head\n        self.head.next.prev = n\n        self.head.next = n\n\n    def get(self, key):\n        if key not in self.map:\n            return -1\n        n = self.map[key]\n        self._remove(n)\n        self._add_front(n)\n        return n.val\n\n    def put(self, key, value):\n        if key in self.map:\n            self._remove(self.map[key])\n        self.map[key] = n = Node(key, value)\n        self._add_front(n)\n        if len(self.map) > self.cap:\n            lru = self.tail.prev\n            self._remove(lru)\n            del self.map[lru.key]"
      }
     ]
    },
    {
     "id": "time-map",
     "title": "Time-based key-value store",
     "also": "bisect over a sorted history",
     "spot": "The value at or before a timestamp; versions; snapshots; a sorted history per key.",
     "pat": "ood",
     "ex": {
      "i": "set(\"k\", \"a\", 1), set(\"k\", \"b\", 4); get(\"k\", 3)",
      "o": "\"a\""
     },
     "code": "from bisect import bisect_right\nfrom collections import defaultdict\n\nclass TimeMap:\n    def __init__(self):\n        self.times, self.vals = defaultdict(list), defaultdict(list)\n\n    def set(self, key, value, timestamp):\n        self.times[key].append(timestamp)\n        self.vals[key].append(value)\n\n    def get(self, key, timestamp):\n        i = bisect_right(self.times[key], timestamp)\n        return self.vals[key][i - 1] if i else \"\"",
     "time": "set O(1), get O(log n)",
     "space": "O(total entries)",
     "notes": [
      "Timestamps arrive in increasing order, so each key's list is already sorted. `bisect_right` then one step back is the latest entry at or before the time."
     ],
     "vars": [
      {
       "n": "Snapshot array",
       "t": "The same lookup, with the snapshot id as the timestamp. Only changed indexes store anything.",
       "code": "from bisect import bisect_right\n\nclass SnapshotArray:\n    def __init__(self, n):\n        self.hist = [[(0, 0)] for _ in range(n)]\n        self.snap_id = 0\n\n    def set(self, i, val):\n        if self.hist[i][-1][0] == self.snap_id:\n            self.hist[i][-1] = (self.snap_id, val)\n        else:\n            self.hist[i].append((self.snap_id, val))\n\n    def snap(self):\n        self.snap_id += 1\n        return self.snap_id - 1\n\n    def get(self, i, snap_id):\n        j = bisect_right(self.hist[i], (snap_id, float(\"inf\"))) - 1\n        return self.hist[i][j][1]"
      }
     ]
    },
    {
     "id": "random-set",
     "title": "Insert, delete, random",
     "also": "a list for picking, a dict for finding",
     "spot": "Insert, delete and pick-at-random all in O(1).",
     "ex": {
      "i": "insert(1), insert(2), remove(1), get_random()",
      "o": "2"
     },
     "code": "import random\n\nclass RandomizedSet:\n    def __init__(self):\n        self.items, self.pos = [], {}\n\n    def insert(self, x):\n        if x in self.pos:\n            return False\n        self.pos[x] = len(self.items)\n        self.items.append(x)\n        return True\n\n    def remove(self, x):\n        if x not in self.pos:\n            return False\n        i, last = self.pos[x], self.items[-1]\n        self.items[i] = last\n        self.pos[last] = i\n        self.items.pop()\n        del self.pos[x]\n        return True\n\n    def get_random(self):\n        return random.choice(self.items)",
     "time": "O(1) average per call",
     "space": "O(n)",
     "notes": [
      "Deleting from the middle of a list is O(n). Move the last item into the hole and pop the end instead.",
      "Set `pos[last]` before you delete `pos[x]`: when `x` is the last item, the delete must win."
     ],
     "vars": []
    }
   ]
  },
  {
   "id": "greedy",
   "title": "Greedy",
   "items": [
    {
     "id": "intervals",
     "title": "Intervals",
     "also": "merge, schedule, count the rooms",
     "spot": "Overlapping ranges; merge them, count the rooms, or remove the fewest; sort first.",
     "pat": "intervals",
     "ex": {
      "i": "intervals = [[1, 3], [8, 10], [2, 6]]",
      "o": "[[1, 6], [8, 10]]"
     },
     "code": "def merge_intervals(intervals):\n    out = []\n    for s, e in sorted(intervals):\n        if out and s <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], e)\n        else:\n            out.append([s, e])\n    return out",
     "time": "O(n log n)",
     "space": "O(n)",
     "notes": [
      "Merge and count rooms: sort by start. Keep the most non-overlapping intervals: sort by end, the one that frees up soonest."
     ],
     "vars": [
      {
       "n": "Fewest removals",
       "t": "Interval scheduling. Sort by end and keep every interval that starts after the last kept one ends.",
       "code": "def erase_overlap(intervals):\n    end, kept = float(\"-inf\"), 0\n    for s, e in sorted(intervals, key=lambda p: p[1]):\n        if s >= end:\n            kept += 1\n            end = e\n    return len(intervals) - kept"
      },
      {
       "n": "Meeting rooms needed",
       "t": "A min-heap of end times: reuse the room that frees up first, or open a new one.",
       "code": "import heapq\n\ndef min_rooms(intervals):\n    h = []\n    for s, e in sorted(intervals):\n        if h and h[0] <= s:\n            heapq.heapreplace(h, e)\n        else:\n            heapq.heappush(h, e)\n    return len(h)"
      }
     ]
    },
    {
     "id": "jump-game",
     "title": "Jump game",
     "also": "the furthest reach so far",
     "spot": "Can you reach the end; fewest jumps; each cell offers a range; one pass keeping the furthest reach.",
     "ex": {
      "i": "nums = [2, 3, 1, 1, 4]",
      "o": "True"
     },
     "code": "def can_jump(nums):\n    reach = 0\n    for i, step in enumerate(nums):\n        if i > reach:\n            return False\n        reach = max(reach, i + step)\n    return True",
     "time": "O(n)",
     "space": "O(1)",
     "notes": [
      "The greedy choice: you never need the exact path, only how far the best path could go."
     ],
     "vars": [
      {
       "n": "Fewest jumps",
       "t": "A BFS in disguise: `end` closes the current jump's range, `far` is the furthest cell the next jump can reach.",
       "code": "def min_jumps(nums):\n    jumps = end = far = 0\n    for i in range(len(nums) - 1):\n        far = max(far, i + nums[i])\n        if i == end:\n            jumps += 1\n            end = far\n    return jumps"
      },
      {
       "n": "Gas station",
       "t": "If total gas covers total cost a start exists. Whenever the tank goes negative, restart from the next station.",
       "code": "def can_complete_circuit(gas, cost):\n    if sum(gas) < sum(cost):\n        return -1\n    start = tank = 0\n    for i in range(len(gas)):\n        tank += gas[i] - cost[i]\n        if tank < 0:\n            start, tank = i + 1, 0\n    return start"
      }
     ]
    }
   ]
  },
  {
   "id": "dp",
   "title": "Dynamic programming",
   "items": [
    {
     "id": "dp-1d",
     "title": "1D DP",
     "also": "house robber, climbing stairs",
     "spot": "The best up to i depends on the last one or two; choose or skip; count the ways to reach n.",
     "pat": "dp",
     "ex": {
      "i": "nums = [2, 7, 9, 3, 1]",
      "o": "12"
     },
     "code": "def rob(nums):\n    prev = cur = 0\n    for x in nums:\n        prev, cur = cur, max(cur, prev + x)\n    return cur",
     "time": "O(n)",
     "space": "O(1)",
     "notes": [
      "Write the table first: `dp[i]` is the best using the first i items. When it only looks back one or two cells, two variables replace the table."
     ],
     "vars": [
      {
       "n": "Climbing stairs",
       "t": "Ways to reach a step are the ways to reach the two below: Fibonacci.",
       "code": "def climb_stairs(n):\n    a, b = 1, 1\n    for _ in range(n - 1):\n        a, b = b, a + b\n    return b"
      },
      {
       "n": "Decode ways",
       "t": "A digit alone counts if it is not 0. Two digits together count if they are 10 to 26.",
       "code": "def num_decodings(s):\n    dp = [1] + [0] * len(s)\n    for i in range(1, len(s) + 1):\n        if s[i - 1] != \"0\":\n            dp[i] += dp[i - 1]\n        if i > 1 and \"10\" <= s[i - 2:i] <= \"26\":\n            dp[i] += dp[i - 2]\n    return dp[-1]"
      }
     ]
    },
    {
     "id": "kadane",
     "title": "Kadane's",
     "also": "best contiguous sum",
     "card": "kadane",
     "pat": "dp",
     "ex": {
      "i": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
      "o": "6"
     },
     "code": "def max_subarray(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best",
     "time": "O(n)",
     "space": "O(1)",
     "notes": [
      "`cur` is the best sum of a subarray that ends here. Extend it, or start again at `x`."
     ],
     "vars": [
      {
       "n": "Maximum product",
       "t": "A negative flips the largest into the smallest, so track both.",
       "code": "def max_product(nums):\n    best = hi = lo = nums[0]\n    for x in nums[1:]:\n        hi, lo = max(x, hi * x, lo * x), min(x, hi * x, lo * x)\n        best = max(best, hi)\n    return best"
      }
     ]
    },
    {
     "id": "knapsack",
     "title": "0/1 knapsack",
     "also": "one row, capacity downwards",
     "spot": "Take each item once under a limit; a subset that hits a target sum; split into two equal halves.",
     "pat": "dp",
     "ex": {
      "i": "weights = [1, 3, 4, 5], values = [1, 4, 5, 7], cap = 7",
      "o": "9"
     },
     "code": "def knapsack(weights, values, cap):\n    dp = [0] * (cap + 1)\n    for w, v in zip(weights, values):\n        for c in range(cap, w - 1, -1):\n            dp[c] = max(dp[c], dp[c - w] + v)\n    return dp[cap]",
     "time": "O(n * cap)",
     "space": "O(cap)",
     "notes": [
      "Loop the capacity downwards so each item is used once. Upwards lets an item repeat: that is coin change."
     ],
     "vars": [
      {
       "n": "Partition equal subset sum",
       "t": "Can some subset reach half the total? The same loop with booleans.",
       "code": "def can_partition(nums):\n    total = sum(nums)\n    if total % 2:\n        return False\n    half = total // 2\n    dp = [True] + [False] * half\n    for x in nums:\n        for s in range(half, x - 1, -1):\n            dp[s] = dp[s] or dp[s - x]\n    return dp[half]"
      }
     ]
    },
    {
     "id": "coin-change",
     "title": "Coin change",
     "also": "unbounded, fewest coins",
     "spot": "Fewest items, or number of ways, to make a total with unlimited reuse.",
     "pat": "dp",
     "ex": {
      "i": "coins = [1, 2, 5], amount = 11",
      "o": "3"
     },
     "code": "def coin_change(coins, amount):\n    INF = amount + 1\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    return dp[amount] if dp[amount] < INF else -1",
     "time": "O(amount * coins)",
     "space": "O(amount)",
     "notes": [
      "`dp[a]` is the fewest coins for amount a. Greedy (largest coin first) fails on coins like 1, 3, 4."
     ],
     "vars": [
      {
       "n": "Number of ways",
       "t": "Coins on the outside counts combinations once. Swap the loops and it counts orderings instead.",
       "code": "def coin_ways(coins, amount):\n    dp = [1] + [0] * amount\n    for c in coins:\n        for a in range(c, amount + 1):\n            dp[a] += dp[a - c]\n    return dp[amount]"
      }
     ]
    },
    {
     "id": "lis",
     "title": "Longest increasing subsequence",
     "also": "n log n with bisect",
     "spot": "Longest increasing run you can pick from a sequence, not contiguous.",
     "pat": "dp",
     "ex": {
      "i": "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
      "o": "4"
     },
     "code": "from bisect import bisect_left\n\ndef lis(nums):\n    tails = []\n    for x in nums:\n        i = bisect_left(tails, x)\n        if i == len(tails):\n            tails.append(x)\n        else:\n            tails[i] = x\n    return len(tails)",
     "time": "O(n log n)",
     "space": "O(n)",
     "notes": [
      "`tails[i]` is the smallest possible last value of an increasing run of length i + 1. The list is sorted, so `bisect_left` finds where x belongs.",
      "`tails` is not a real subsequence. Only its length is the answer."
     ],
     "vars": [
      {
       "n": "The O(n^2) table",
       "t": "Easier to explain, and it lets you rebuild the subsequence itself.",
       "code": "def lis_n2(nums):\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp, default=0)"
      },
      {
       "n": "Non-decreasing",
       "t": "Equal values may repeat: `bisect_right` instead of `bisect_left`.",
       "code": "from bisect import bisect_right\n\ndef lis_non_decreasing(nums):\n    tails = []\n    for x in nums:\n        i = bisect_right(tails, x)\n        if i == len(tails):\n            tails.append(x)\n        else:\n            tails[i] = x\n    return len(tails)"
      }
     ]
    },
    {
     "id": "lcs-edit",
     "title": "LCS and edit distance",
     "also": "two prefixes, one table",
     "spot": "Two strings or sequences compared; shared subsequence; fewest edits; a table indexed by both prefixes.",
     "pat": "dp",
     "ex": {
      "i": "a = \"abcde\", b = \"ace\"",
      "o": "3"
     },
     "code": "def lcs(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[-1][-1]",
     "time": "O(m * n)",
     "space": "O(m * n), or O(min(m, n)) for the length alone",
     "notes": [
      "`dp[i][j]` is the answer for the first i characters of a and the first j of b. Row 0 and column 0 are the empty prefix."
     ],
     "vars": [
      {
       "n": "Edit distance",
       "t": "Same table. On a mismatch take one more than the best of replace, delete or insert.",
       "code": "def edit_distance(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(len(a) + 1):\n        dp[i][0] = i\n    for j in range(len(b) + 1):\n        dp[0][j] = j\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])\n    return dp[-1][-1]"
      }
     ]
    },
    {
     "id": "word-break",
     "title": "Word break",
     "also": "bottom-up, and with a cache",
     "spot": "Split a string into dictionary words; can the prefix of length i be built from a shorter good prefix.",
     "pat": "dp",
     "ex": {
      "i": "s = \"leetcode\", words = [\"leet\", \"code\"]",
      "o": "True"
     },
     "code": "def word_break(s, words):\n    known = set(words)\n    ok = [True] + [False] * len(s)\n    for i in range(1, len(s) + 1):\n        ok[i] = any(ok[j] and s[j:i] in known for j in range(i))\n    return ok[-1]",
     "time": "O(n^2) splits, each slice up to n characters",
     "space": "O(n)",
     "notes": [
      "`ok[i]` means `s[:i]` can be split. Try every last word `s[j:i]` that starts at a good `j`."
     ],
     "vars": [
      {
       "n": "Top-down with a cache",
       "t": "The same recursion written the way you think it: from position i, try every word that starts there.",
       "code": "from functools import cache\n\ndef word_break_memo(s, words):\n    known = set(words)\n    @cache\n    def can(i):\n        if i == len(s):\n            return True\n        return any(s[i:j] in known and can(j) for j in range(i + 1, len(s) + 1))\n    return can(0)"
      }
     ]
    }
   ]
  },
  {
   "id": "backtracking",
   "title": "Backtracking",
   "items": [
    {
     "id": "subsets",
     "title": "Subsets",
     "also": "the template: append, recurse, pop",
     "spot": "All subsets or combinations; choose, explore, undo; n up to about 20.",
     "pat": "backtrack",
     "ex": {
      "i": "nums = [1, 2, 3]",
      "o": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]"
     },
     "code": "def subsets(nums):\n    out, path = [], []\n    def go(start):\n        out.append(path[:])\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            go(i + 1)\n            path.pop()\n    go(0)\n    return out",
     "time": "O(n * 2^n)",
     "space": "O(n) for the path",
     "notes": [
      "Copy the path when you record it (`path[:]`), or every answer ends up as the same empty list.",
      "Every node of the recursion is a valid subset, so record before the loop."
     ],
     "vars": [
      {
       "n": "With duplicates",
       "t": "Sort, then skip a value that equals the one before it at the same depth.",
       "code": "def subsets_dup(nums):\n    nums = sorted(nums)\n    out, path = [], []\n    def go(start):\n        out.append(path[:])\n        for i in range(start, len(nums)):\n            if i > start and nums[i] == nums[i - 1]:\n                continue\n            path.append(nums[i])\n            go(i + 1)\n            path.pop()\n    go(0)\n    return out"
      },
      {
       "n": "Bitmask",
       "t": "For n up to about 20 each number from 0 to 2^n - 1 is one subset.",
       "code": "def subsets_mask(nums):\n    n = len(nums)\n    return [[nums[i] for i in range(n) if mask >> i & 1] for mask in range(1 << n)]"
      }
     ]
    },
    {
     "id": "permutations",
     "title": "Permutations",
     "also": "a used flag per item",
     "spot": "All orderings; each position tries every unused item.",
     "pat": "backtrack",
     "ex": {
      "i": "nums = [1, 2, 3]",
      "o": "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]"
     },
     "code": "def permutations(nums):\n    out, path, used = [], [], [False] * len(nums)\n    def go():\n        if len(path) == len(nums):\n            out.append(path[:])\n            return\n        for i, x in enumerate(nums):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(x)\n            go()\n            path.pop()\n            used[i] = False\n    go()\n    return out",
     "time": "O(n * n!)",
     "space": "O(n)",
     "notes": [
      "Combinations pass a start index. Permutations restart the loop at 0 and track what is used."
     ],
     "vars": [
      {
       "n": "With duplicates",
       "t": "Sort, and skip a value equal to the previous one unless the previous one is already in the path.",
       "code": "def permutations_dup(nums):\n    nums = sorted(nums)\n    out, path, used = [], [], [False] * len(nums)\n    def go():\n        if len(path) == len(nums):\n            out.append(path[:])\n            return\n        for i, x in enumerate(nums):\n            if used[i] or (i and x == nums[i - 1] and not used[i - 1]):\n                continue\n            used[i] = True\n            path.append(x)\n            go()\n            path.pop()\n            used[i] = False\n    go()\n    return out"
      },
      {
       "n": "Standard library",
       "t": "`itertools.permutations` gives tuples, in the same order.",
       "code": "from itertools import permutations as perms\n\ndef permutations_stdlib(nums):\n    return [list(p) for p in perms(nums)]"
      }
     ]
    },
    {
     "id": "combination-sum",
     "title": "Combination sum",
     "also": "reuse allowed",
     "spot": "Combinations that add to a target; a number may repeat; prune once over.",
     "pat": "backtrack",
     "ex": {
      "i": "candidates = [2, 3, 6, 7], target = 7",
      "o": "[[2, 2, 3], [7]]"
     },
     "code": "def combination_sum(candidates, target):\n    out, path = [], []\n    def go(start, left):\n        if left == 0:\n            out.append(path[:])\n            return\n        for i in range(start, len(candidates)):\n            if candidates[i] > left:\n                continue\n            path.append(candidates[i])\n            go(i, left - candidates[i])\n            path.pop()\n    go(0, target)\n    return out",
     "time": "Exponential; bounded by the number of answers",
     "space": "O(target / smallest) for the path",
     "notes": [
      "Pass `i`, not `i + 1`, to allow a number to repeat. Sort first and `break` instead of `continue` to prune harder."
     ],
     "vars": [
      {
       "n": "Each number once, with duplicates",
       "t": "Pass `i + 1`, sort, and skip a repeat of the value before it at the same depth.",
       "code": "def combination_sum2(candidates, target):\n    candidates = sorted(candidates)\n    out, path = [], []\n    def go(start, left):\n        if left == 0:\n            out.append(path[:])\n            return\n        for i in range(start, len(candidates)):\n            if i > start and candidates[i] == candidates[i - 1]:\n                continue\n            if candidates[i] > left:\n                break\n            path.append(candidates[i])\n            go(i + 1, left - candidates[i])\n            path.pop()\n    go(0, target)\n    return out"
      },
      {
       "n": "Generate parentheses",
       "t": "Choices instead of a loop: add an open while fewer than n, add a close while fewer than the opens.",
       "code": "def generate_parentheses(n):\n    out = []\n    def go(s, opened, closed):\n        if len(s) == 2 * n:\n            out.append(s)\n            return\n        if opened < n:\n            go(s + \"(\", opened + 1, closed)\n        if closed < opened:\n            go(s + \")\", opened, closed + 1)\n    go(\"\", 0, 0)\n    return out"
      }
     ]
    }
   ]
  },
  {
   "id": "strings",
   "title": "Strings",
   "items": [
    {
     "id": "kmp",
     "title": "KMP prefix function",
     "also": "what to do after a mismatch",
     "spot": "Find a pattern in text in O(n + m); periods and repeats; the longest prefix that is also a suffix.",
     "ex": {
      "i": "p = \"abacabab\"",
      "o": "[0, 0, 1, 0, 1, 2, 3, 2]"
     },
     "code": "def prefix_function(p):\n    pi, k = [0] * len(p), 0\n    for i in range(1, len(p)):\n        while k and p[i] != p[k]:\n            k = pi[k - 1]\n        if p[i] == p[k]:\n            k += 1\n        pi[i] = k\n    return pi\n\ndef kmp_search(text, p):\n    if not p:\n        return 0\n    pi, k = prefix_function(p), 0\n    for i, c in enumerate(text):\n        while k and c != p[k]:\n            k = pi[k - 1]\n        if c == p[k]:\n            k += 1\n        if k == len(p):\n            return i - k + 1\n    return -1",
     "time": "O(n + m)",
     "space": "O(m)",
     "notes": [
      "`pi[i]` is the length of the longest proper prefix of `p[:i+1]` that is also its suffix. On a mismatch, fall back to `pi[k - 1]` instead of starting over.",
      "In an interview say `text.find(p)` first. Write KMP when asked to."
     ],
     "vars": [
      {
       "n": "Repeated pattern",
       "t": "A string is built from a repeated block when the border leaves a length that divides it.",
       "code": "# needs prefix_function from above\ndef repeated_pattern(s):\n    n = len(s)\n    k = prefix_function(s)[-1]\n    return k > 0 and n % (n - k) == 0"
      }
     ]
    },
    {
     "id": "trie",
     "title": "Trie",
     "also": "a dict of dicts",
     "spot": "Prefix lookups; autocomplete; many words that share starts; word search on a grid.",
     "ex": {
      "i": "insert(\"apple\"); search(\"app\"), starts_with(\"app\")",
      "o": "False, True"
     },
     "code": "class Trie:\n    def __init__(self):\n        self.root = {}\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node[\"$\"] = True\n\n    def walk(self, s):\n        node = self.root\n        for ch in s:\n            if ch not in node:\n                return None\n            node = node[ch]\n        return node\n\n    def search(self, word):\n        node = self.walk(word)\n        return node is not None and \"$\" in node\n\n    def starts_with(self, prefix):\n        return self.walk(prefix) is not None",
     "time": "O(L) per word of length L",
     "space": "O(total characters)",
     "notes": [
      "The `$` key marks the end of a word: \"app\" is a prefix of \"apple\" without being a word."
     ],
     "vars": [
      {
       "n": "Autocomplete",
       "t": "Walk to the prefix, then depth-first over everything below it.",
       "code": "# needs Trie from above\ndef words_with_prefix(trie, prefix):\n    node = trie.walk(prefix)\n    out = []\n    def go(n, path):\n        for ch, child in n.items():\n            if ch == \"$\":\n                out.append(prefix + path)\n            else:\n                go(child, path + ch)\n    if node:\n        go(node, \"\")\n    return sorted(out)"
      }
     ]
    }
   ]
  },
  {
   "id": "sorting",
   "title": "Sorting",
   "items": [
    {
     "id": "merge-sort",
     "title": "Merge sort",
     "also": "split, sort each half, merge",
     "spot": "A stable O(n log n) sort; sorting a linked list; counting inversions while merging.",
     "ex": {
      "i": "a = [5, 2, 4, 7, 1, 3, 2, 6]",
      "o": "[1, 2, 2, 3, 4, 5, 6, 7]"
     },
     "code": "def merge_sort(a):\n    if len(a) <= 1:\n        return a\n    m = len(a) // 2\n    l, r = merge_sort(a[:m]), merge_sort(a[m:])\n    out, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]:\n            out.append(l[i])\n            i += 1\n        else:\n            out.append(r[j])\n            j += 1\n    return out + l[i:] + r[j:]",
     "time": "O(n log n)",
     "space": "O(n)",
     "notes": [
      "Use `<=` when taking from the left half: it keeps equal values in their original order, which is what stable means.",
      "Python's own `sorted` is Timsort, stable and O(n log n)."
     ],
     "vars": [
      {
       "n": "Count inversions",
       "t": "Whenever the right half wins, every item left in the left half is bigger than it: add that many.",
       "code": "def count_inversions(a):\n    def sort(a):\n        if len(a) <= 1:\n            return a, 0\n        m = len(a) // 2\n        l, x = sort(a[:m])\n        r, y = sort(a[m:])\n        out, i, j, c = [], 0, 0, x + y\n        while i < len(l) and j < len(r):\n            if l[i] <= r[j]:\n                out.append(l[i])\n                i += 1\n            else:\n                out.append(r[j])\n                j += 1\n                c += len(l) - i\n        return out + l[i:] + r[j:], c\n    return sort(a)[1]"
      }
     ]
    },
    {
     "id": "quicksort",
     "title": "Quicksort",
     "also": "partition around a random pivot",
     "spot": "An in-place sort; partition around a pivot; the same step as QuickSelect.",
     "ex": {
      "i": "a = [3, 6, 1, 8, 2, 9, 2]",
      "o": "[1, 2, 2, 3, 6, 8, 9]"
     },
     "code": "import random\n\ndef quicksort(a, lo=0, hi=None):\n    if hi is None:\n        hi = len(a) - 1\n    if lo >= hi:\n        return a\n    i = random.randint(lo, hi)\n    a[i], a[hi] = a[hi], a[i]\n    pivot, p = a[hi], lo\n    for j in range(lo, hi):\n        if a[j] < pivot:\n            a[j], a[p] = a[p], a[j]\n            p += 1\n    a[p], a[hi] = a[hi], a[p]\n    quicksort(a, lo, p - 1)\n    quicksort(a, p + 1, hi)\n    return a",
     "time": "O(n log n) average, O(n^2) worst",
     "space": "O(log n) for the recursion",
     "notes": [
      "After the partition the pivot is in its final place. Sort the two sides.",
      "Not stable. Many equal values make this partition degrade to O(n^2) and recurse n deep: use three-way."
     ],
     "vars": [
      {
       "n": "Three-way, one pass",
       "t": "Sort colours: 0s to the front, 2s to the back, 1s stay. This is the three-way partition on its own.",
       "code": "def sort_colors(a):\n    lo, i, hi = 0, 0, len(a) - 1\n    while i <= hi:\n        if a[i] == 0:\n            a[lo], a[i] = a[i], a[lo]\n            lo += 1\n            i += 1\n        elif a[i] == 2:\n            a[i], a[hi] = a[hi], a[i]\n            hi -= 1\n        else:\n            i += 1"
      },
      {
       "n": "Short version",
       "t": "Not in place, but easy to write on a whiteboard and fine with duplicates.",
       "code": "def quicksort_short(a):\n    if len(a) <= 1:\n        return a\n    p = a[len(a) // 2]\n    return (quicksort_short([x for x in a if x < p]) + [x for x in a if x == p]\n            + quicksort_short([x for x in a if x > p]))"
      }
     ]
    },
    {
     "id": "counting-sort",
     "title": "Counting sort",
     "also": "count, then write back",
     "spot": "Values in a small known range; sort or group in O(n + k).",
     "ex": {
      "i": "a = [3, 1, 2, 3, 0, 1], k = 3",
      "o": "[0, 1, 1, 2, 3, 3]"
     },
     "code": "def counting_sort(a, k):\n    count = [0] * (k + 1)\n    for x in a:\n        count[x] += 1\n    out = []\n    for v, c in enumerate(count):\n        out += [v] * c\n    return out",
     "time": "O(n + k)",
     "space": "O(k)",
     "notes": [
      "It beats O(n log n) only when k is about n or smaller. Ages, scores out of 100, letters."
     ],
     "vars": [
      {
       "n": "Top k frequent in O(n)",
       "t": "Bucket by frequency: the count of a value is at most n, so the buckets are a counting sort.",
       "code": "from collections import Counter\n\ndef top_k_frequent_bucket(nums, k):\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for x, f in Counter(nums).items():\n        buckets[f].append(x)\n    out = []\n    for f in range(len(buckets) - 1, 0, -1):\n        out += buckets[f]\n        if len(out) >= k:\n            return out[:k]\n    return out"
      }
     ]
    }
   ]
  }
 ],
 "extra": {
  "tools": {
   "title": "Python you reach for",
   "code": "Counter(a).most_common(k)\ndefaultdict(list); deque().popleft()\nheapq.heappush / heappop / nlargest\nbisect_left(a, x)\nsorted(a, key=lambda p: (p[1], -p[0]))\n@functools.cache\nitertools.combinations / accumulate",
   "notes": [
    "float('inf'); divmod(a, b); ''.join(parts)."
   ]
  },
  "edge": {
   "title": "Edge cases to say",
   "notes": [
    "Empty input; one element; all the same.",
    "Negatives and zero; duplicates.",
    "Already sorted, or reversed.",
    "Off by one: r - l + 1, lo &le; hi.",
    "Deep recursion past 1,000: go iterative.",
    "Strings: case, spaces, unicode."
   ]
  },
  "traps": {
   "title": "Python traps",
   "notes": [
    "[[0] * m] * n shares rows: use a comprehension.",
    "def f(x=[]) shares the list across calls.",
    "list.pop(0) is O(n): use deque.",
    "s += c in a loop is O(n<sup>2</sup>): use join.",
    "-7 // 2 is -4: floor division.",
    "Don't mutate a list while looping over it."
   ]
  }
 },
 "sheets": [
  {
   "id": "algorithms",
   "title": "Algorithms",
   "order": [
    "hashing",
    "prefix",
    "pointers",
    "window",
    "stack",
    "binary",
    "linked",
    "trees",
    "heap",
    "intervals",
    "bfs",
    "dfs",
    "topo",
    "dijkstra",
    "uf",
    "dp",
    "kadane",
    "backtrack",
    "concurrency",
    "ood",
    "sorting",
    "tools",
    "edge",
    "traps"
   ]
  },
  {
   "id": "ai",
   "title": "AI systems",
   "order": [
    "numpy",
    "torch",
    "embed",
    "rag",
    "graphrag",
    "agent",
    "research",
    "voice",
    "transformer",
    "bpe",
    "evals",
    "structured",
    "serving",
    "lora",
    "ai"
   ]
  }
 ],
"lc": {
  "agent/Now a sensitive tool needs approval before it runs": {"d": "medium"},
  "agent/Now retry a failed tool call once with the error fed back": {"d": "medium"},
  "agent/Now two tools can run per step, not just one": {"d": "medium"},
  "ai/Cosine top-k retrieval": {"d": "easy"},
  "ai/LRU cache": {"d": "medium", "lc": "lru-cache", "yt": ["7ABFKPK2hD4", "NeetCode", 18]},
  "ai/Parse a model's JSON safely": {"d": "easy"},
  "ai/Retry with exponential backoff": {"d": "easy"},
  "ai/Simple word tokenizer and vocabulary": {"d": "easy"},
  "ai/Token-bucket rate limiter": {"d": "medium"},
  "backtrack/Combination sum": {"d": "medium", "lc": "combination-sum", "yt": ["GBKI9VSKdGg", "NeetCode", 16]},
  "backtrack/Generate parentheses": {"d": "medium", "lc": "generate-parentheses", "yt": ["s9fokUqJ76A", "NeetCode", 14]},
  "backtrack/Permutations": {"d": "medium", "lc": "permutations", "yt": ["FZe0UqISmUw", "NeetCodeIO", 12]},
  "backtrack/Subsets": {"d": "medium", "lc": "subsets", "yt": ["REOH22Xwdkk", "NeetCode", 9]},
  "backtrack/Subsets with duplicates": {"d": "medium", "lc": "subsets-ii", "yt": ["Vn2v6ajA7U0", "NeetCode", 16]},
  "binary/Binary search on the answer": {"d": "medium", "lc": "koko-eating-bananas", "yt": ["U2SozAs9RzA", "NeetCode", 16]},
  "binary/First and last position": {"d": "medium", "lc": "find-first-and-last-position-of-element-in-sorted-array", "yt": ["4sQL7R5ySUU", "NeetCode", 10]},
  "binary/Minimum of a rotated array": {"d": "medium", "lc": "find-minimum-in-rotated-sorted-array", "yt": ["nIVW4P8b1VA", "NeetCode", 13]},
  "binary/Search in a rotated sorted array": {"d": "medium", "lc": "search-in-rotated-sorted-array", "yt": ["U8XENwh8Oy8", "NeetCode", 14]},
  "binary/Search in a sorted array": {"d": "easy", "lc": "binary-search", "yt": ["s4DPM8ct1pI", "NeetCode", 10]},
  "bpe/Now encode text the tokenizer never trained on": {"d": "medium"},
  "bpe/Now measure the compression BPE buys": {"d": "easy"},
  "concurrency/A bounded queue with N workers (asyncio)": {"d": "medium"},
  "concurrency/Async retry with a timeout per try": {"d": "medium"},
  "concurrency/Blocking calls inside async code": {"d": "easy"},
  "concurrency/Building H2O (LeetCode 1117)": {"d": "medium", "lc": "building-h2o", "yt": ["QTFjV8_vhK4", "leetloaf", 10]},
  "concurrency/Cache that loads each key once (threads)": {"d": "medium"},
  "concurrency/Design bounded blocking queue (LeetCode 1188)": {"d": "medium", "lc": "design-bounded-blocking-queue", "yt": ["O8hzY9DdkgU", "Learn with Amine", 5]},
  "concurrency/Fizz Buzz multithreaded (LeetCode 1195)": {"d": "medium", "lc": "fizz-buzz-multithreaded", "yt": ["N3wJhiH0QGw", "EverydayLeetcode", 12]},
  "concurrency/Print in order (LeetCode 1114)": {"d": "easy", "lc": "print-in-order", "yt": ["k1XIiw-4Jno", "EverydayLeetcode", 10]},
  "concurrency/Results in order, or as they finish": {"d": "easy"},
  "concurrency/Thread-safe counter": {"d": "easy"},
  "concurrency/Timeout and cancellation (asyncio)": {"d": "medium"},
  "concurrency/Two locks without deadlock": {"d": "medium", "lc": "the-dining-philosophers", "yt": ["MtmYcn1hAyA", "H William Polenz", 15]},
  "dp/0/1 knapsack": {"d": "medium", "lc": "partition-equal-subset-sum", "yt": ["IsvocB5BJhw", "NeetCode", 15]},
  "dp/Climbing stairs": {"d": "easy", "lc": "climbing-stairs", "yt": ["Y0lT9Fck7qI", "NeetCode", 19]},
  "dp/Coin change": {"d": "medium", "lc": "coin-change", "yt": ["H9bfqozjoqs", "NeetCode", 20]},
  "dp/House robber": {"d": "medium", "lc": "house-robber", "yt": ["73r3KWiEvyk", "NeetCode", 11]},
  "dp/Longest common subsequence": {"d": "medium", "lc": "longest-common-subsequence", "yt": ["Ua0GhsJSlWM", "NeetCode", 19]},
  "dp/Longest increasing subsequence": {"d": "medium", "lc": "longest-increasing-subsequence", "yt": ["cjWnW0hdF1Y", "NeetCode", 19]},
  "dp/Maximum subarray (Kadane's)": {"d": "medium", "lc": "maximum-subarray", "yt": ["5WZl3MMT0Eg", "NeetCode", 9]},
  "dp/Unique paths in a grid": {"d": "medium", "lc": "unique-paths", "yt": ["IlEsdxuD4lY", "NeetCode", 11]},
  "dp/Word break": {"d": "medium", "lc": "word-break", "yt": ["Sx9NNgInc3A", "NeetCode", 16]},
  "embed/Now add an embedding cache so re-indexing skips unchanged chunks": {"d": "medium"},
  "embed/Now rerank the dense top-k with the keyword score instead of blending upfront": {"d": "medium"},
  "embed/Now use a score threshold instead of a fixed k": {"d": "easy"},
  "evals/Now blend exact match with the LLM judge": {"d": "medium"},
  "evals/Now watch pass^k drop as k grows on a flaky item": {"d": "medium"},
  "graphrag/Now expand only along specific relation types": {"d": "easy"},
  "graphrag/Now find the shortest path, not just the last fact reached": {"d": "hard"},
  "graphrag/Now two chunks disagree; keep both edges with a confidence field": {"d": "medium"},
  "graphs/Connected components": {"d": "medium", "lc": "number-of-connected-components-in-an-undirected-graph", "yt": ["8f1XPm4WOUc", "NeetCode", 16]},
  "graphs/Number of islands": {"d": "medium", "lc": "number-of-islands", "yt": ["pV2kpPD66nE", "NeetCode", 12]},
  "graphs/Rotting oranges (BFS from many sources)": {"d": "medium", "lc": "rotting-oranges", "yt": ["y704fEOx0s0", "NeetCode", 13]},
  "graphs/Word ladder (fewest steps)": {"d": "hard", "lc": "word-ladder", "yt": ["h9iTnkgv05E", "NeetCode", 18]},
  "hashing/Contains duplicate": {"d": "easy", "lc": "contains-duplicate", "yt": ["3OamzN90kPg", "NeetCode", 7]},
  "hashing/First unique character": {"d": "easy", "lc": "first-unique-character-in-a-string", "yt": ["rBENYgWy3xU", "NeetCodeIO", 5]},
  "hashing/Group anagrams": {"d": "medium", "lc": "group-anagrams", "yt": ["vzdNOK2oB2E", "NeetCode", 9]},
  "hashing/Longest consecutive sequence": {"d": "medium", "lc": "longest-consecutive-sequence", "yt": ["P6RZZMu_maU", "NeetCode", 10]},
  "hashing/Top k frequent elements": {"d": "medium", "lc": "top-k-frequent-elements", "yt": ["YPTqKIgVk-k", "NeetCode", 14]},
  "hashing/Two Sum": {"d": "easy", "lc": "two-sum", "yt": ["KLlXCFG5TnA", "NeetCode", 9]},
  "hashing/Valid anagram": {"d": "easy", "lc": "valid-anagram", "yt": ["9UtInBqnCgA", "NeetCode", 13]},
  "heap/K closest points to the origin": {"d": "medium", "lc": "k-closest-points-to-origin", "yt": ["rI2EBUEMfTk", "NeetCode", 10]},
  "heap/Kth largest element": {"d": "medium", "lc": "kth-largest-element-in-an-array", "yt": ["XEmy13g1Qxc", "NeetCode", 19]},
  "heap/Merge k sorted lists": {"d": "hard", "lc": "merge-k-sorted-lists", "yt": ["q5a5OiGbT6Q", "NeetCode", 11]},
  "heap/Running median": {"d": "hard", "lc": "find-median-from-data-stream", "yt": ["itmhHWaHupI", "NeetCode", 24]},
  "heap/Top k frequent words": {"d": "medium", "lc": "top-k-frequent-words", "yt": ["huvf-VEuJyo", "CheatCode Ninja", 6]},
  "intervals/Can one person attend every meeting?": {"d": "easy", "lc": "meeting-rooms", "yt": ["PaJxqZVPhbg", "NeetCode", 9]},
  "intervals/Fewest removals to stop overlaps": {"d": "medium", "lc": "non-overlapping-intervals", "yt": ["nONCGxWoUfM", "NeetCode", 13]},
  "intervals/Insert an interval": {"d": "medium", "lc": "insert-interval", "yt": ["A8NUOmlwOlM", "NeetCode", 12]},
  "intervals/Meeting rooms needed": {"d": "medium", "lc": "meeting-rooms-ii", "yt": ["FdzJmTCVyJU", "NeetCode", 12]},
  "linked/Detect a cycle": {"d": "easy", "lc": "linked-list-cycle", "yt": ["gBTe7lFR3vc", "NeetCode", 11]},
  "linked/Merge two sorted lists": {"d": "easy", "lc": "merge-two-sorted-lists", "yt": ["XIdigk956u0", "NeetCode", 7]},
  "linked/Middle of the list": {"d": "easy", "lc": "middle-of-the-linked-list", "yt": ["A2_ldqM4QcY", "NeetCodeIO", 5]},
  "linked/Remove the nth node from the end": {"d": "medium", "lc": "remove-nth-node-from-end-of-list", "yt": ["XVuQxVej6y8", "NeetCode", 8]},
  "linked/Reverse a linked list": {"d": "easy", "lc": "reverse-linked-list", "yt": ["G0_I-ZF0S38", "NeetCode", 12]},
  "linked/Where the cycle starts": {"d": "medium", "lc": "linked-list-cycle-ii", "yt": ["95ZfuoSAUPI", "Nikhil Lohia", 19]},
  "lora/Now compare trainable fraction as rank grows": {"d": "easy"},
  "lora/Now swap in a different task's adapter on the same frozen base": {"d": "medium"},
  "numpy/Now batch multiple queries at once": {"d": "medium"},
  "numpy/Now do the whole thing with einsum, no @": {"d": "medium"},
  "numpy/Now scale by temperature before softmax": {"d": "easy"},
  "ood/Composite: a tree that answers like one node": {"d": "medium"},
  "ood/Elevator": {"d": "hard"},
  "ood/Factory: build by name": {"d": "easy"},
  "ood/In-memory file system (LeetCode 588)": {"d": "hard", "lc": "design-in-memory-file-system", "yt": ["Eb8GRDxyhfI", "Cracking FAANG", 22]},
  "ood/Library": {"d": "medium"},
  "ood/Model the nouns: Enum, dataclass, ABC, Protocol": {"d": "easy"},
  "ood/Money and time": {"d": "medium"},
  "ood/Observer: tell the listeners": {"d": "easy"},
  "ood/Parking lot": {"d": "medium"},
  "ood/Shopping cart with discounts": {"d": "medium"},
  "ood/Singleton, and what to do instead": {"d": "easy"},
  "ood/State: behaviour changes with the state": {"d": "medium"},
  "ood/Time-based key-value store (LeetCode 981)": {"d": "medium", "lc": "time-based-key-value-store", "yt": ["fu2cD_6E8Hw", "NeetCode", 18]},
  "order/Cheapest flight within k stops": {"d": "medium", "lc": "cheapest-flights-within-k-stops", "yt": ["5eIK3zUdYmE", "NeetCode", 21]},
  "order/Course schedule (topological sort)": {"d": "medium", "lc": "course-schedule", "yt": ["EgI5nU9etnU", "NeetCode", 16]},
  "order/Course schedule II (return an order)": {"d": "medium", "lc": "course-schedule-ii", "yt": ["Akt3glAwyfY", "NeetCode", 18]},
  "order/Network delay time (Dijkstra)": {"d": "medium", "lc": "network-delay-time", "yt": ["EaphyqKU4PQ", "NeetCode", 20]},
  "order/Redundant connection (union-find)": {"d": "medium", "lc": "redundant-connection", "yt": ["1lNK80tOTfc", "NeetCodeIO", 19]},
  "order/Shortest path with weights (Dijkstra)": {"d": "medium", "lc": "network-delay-time", "yt": ["EaphyqKU4PQ", "NeetCode", 20]},
  "pointers/3Sum": {"d": "medium", "lc": "3sum", "yt": ["jzZsG8n2R9A", "NeetCode", 13]},
  "pointers/Container with most water": {"d": "medium", "lc": "container-with-most-water", "yt": ["UuiTKBwPgAo", "NeetCode", 13]},
  "pointers/Move zeroes": {"d": "easy", "lc": "move-zeroes", "yt": ["aayNRwUN3Do", "NeetCode", 9]},
  "pointers/Remove duplicates in place": {"d": "easy", "lc": "remove-duplicates-from-sorted-array", "yt": ["DEJAZBq0FDA", "NeetCode", 11]},
  "pointers/Trapping rain water": {"d": "hard", "lc": "trapping-rain-water", "yt": ["ZI2z5pq0TqA", "NeetCode", 24]},
  "pointers/Valid palindrome": {"d": "easy", "lc": "valid-palindrome", "yt": ["jJXJ16kPFWg", "NeetCode", 15]},
  "prefix/Longest subarray with equal 0s and 1s": {"d": "medium", "lc": "contiguous-array", "yt": ["agB1LyObUNE", "NeetCodeIO", 16]},
  "prefix/Product of array except self": {"d": "medium", "lc": "product-of-array-except-self", "yt": ["bNvIQI2wAjk", "NeetCode", 12]},
  "prefix/Range sum queries": {"d": "easy", "lc": "range-sum-query-immutable", "yt": ["2pndAmo_sMA", "NeetCodeIO", 8]},
  "prefix/Subarray sum equals k": {"d": "medium", "lc": "subarray-sum-equals-k", "yt": ["fFVZt-6sgyo", "NeetCode", 16]},
  "prefix/Subarrays divisible by k": {"d": "medium", "lc": "subarray-sums-divisible-by-k", "yt": ["bcXy-T4Sc3E", "NeetCodeIO", 17]},
  "rag/Now cite multiple sources for one merged claim": {"d": "medium"},
  "rag/Now refuse instead of answering when nothing is relevant": {"d": "easy"},
  "rag/Now restrict retrieval to one section the user picked": {"d": "easy"},
  "research/Now cap total fetches across the whole call, not per round": {"d": "medium"},
  "research/Now flag disagreeing sources instead of picking one": {"d": "medium"},
  "research/Now weight a source by domain trust": {"d": "easy"},
  "serving/Now show a cache hit skipping the batcher entirely": {"d": "easy"},
  "serving/Now show the rate limiter rejecting a burst": {"d": "medium"},
  "stack/Daily temperatures": {"d": "medium", "lc": "daily-temperatures", "yt": ["cTBiBSnjO3c", "NeetCode", 12]},
  "stack/Evaluate reverse Polish notation": {"d": "medium", "lc": "evaluate-reverse-polish-notation", "yt": ["iu0082c4HDE", "NeetCode", 10]},
  "stack/Largest rectangle in a histogram": {"d": "hard", "lc": "largest-rectangle-in-histogram", "yt": ["zx5Sw9130L0", "NeetCode", 18]},
  "stack/Min stack": {"d": "medium", "lc": "min-stack", "yt": ["qkLl7nAwDPo", "NeetCode", 9]},
  "stack/Next greater element": {"d": "easy", "lc": "next-greater-element-i", "yt": ["68a1Dc_qVq4", "NeetCode", 15]},
  "stack/Valid parentheses": {"d": "easy", "lc": "valid-parentheses", "yt": ["WTzjTskDFMg", "NeetCode", 11]},
  "structured/Now add an enum-constrained field": {"d": "easy"},
  "structured/Now the model keeps failing past the retry cap": {"d": "medium"},
  "torch/Now add a validation split and early stopping": {"d": "medium"},
  "torch/Now clip gradients before the optimizer step": {"d": "easy"},
  "torch/Now freeze the body and fine-tune only the head": {"d": "medium"},
  "transformer/Now decode token by token, growing the sequence": {"d": "hard"},
  "transformer/Now make it multi-query attention": {"d": "medium"},
  "trees/Diameter": {"d": "easy", "lc": "diameter-of-binary-tree", "yt": ["K81C31ytOZE", "NeetCodeIO", 8]},
  "trees/Invert a tree": {"d": "easy", "lc": "invert-binary-tree", "yt": ["OnSn2XEQ4MY", "NeetCode", 4]},
  "trees/Level order traversal": {"d": "medium", "lc": "binary-tree-level-order-traversal", "yt": ["6ZnyEApgFYg", "NeetCode", 10]},
  "trees/Lowest common ancestor in a BST": {"d": "medium", "lc": "lowest-common-ancestor-of-a-binary-search-tree", "yt": ["gs2LMfuOR9k", "NeetCode", 7]},
  "trees/Maximum depth": {"d": "easy", "lc": "maximum-depth-of-binary-tree", "yt": ["hTM3phVI6YQ", "NeetCode", 17]},
  "trees/Right side view": {"d": "medium", "lc": "binary-tree-right-side-view", "yt": ["d4zLyf32e3I", "NeetCode", 11]},
  "trees/Validate a BST": {"d": "medium", "lc": "validate-binary-search-tree", "yt": ["s6ATEkipzow", "NeetCode", 10]},
  "voice/Now compare a short vs long endpointing window": {"d": "easy"},
  "voice/Now the user actually interrupts mid-reply": {"d": "hard"},
  "window/Longest run after k replacements": {"d": "medium", "lc": "longest-repeating-character-replacement", "yt": ["gqXU1UyA8pk", "NeetCode", 21]},
  "window/Longest substring without repeating characters": {"d": "medium", "lc": "longest-substring-without-repeating-characters", "yt": ["wiGpQwVHdE0", "NeetCode", 7]},
  "window/Maximum sum of a window of size k": {"d": "easy", "lc": "maximum-average-subarray-i", "yt": ["UdUUnoiLkPg", "Greg Hogg", 8]},
  "window/Permutation in a string": {"d": "medium", "lc": "permutation-in-string", "yt": ["UbyhOgBN834", "NeetCode", 20]},
  "window/Shortest subarray with sum at least target": {"d": "medium", "lc": "minimum-size-subarray-sum", "yt": ["aYqYMIqZx5s", "NeetCode", 13]}
}
};
