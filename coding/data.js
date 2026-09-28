/* The coding page's data: patterns, AI systems topics, algorithm cards and sheet extras.
   Shared by CODING.html and CHEATSHEET.html (coding/sheet.js). Edit here; every code block is tested,
   so add a test when you add one. */
window.CODING = {
 "groups": [
  {
   "id": "start",
   "title": "Start",
   "blurb": "How to code out loud, and what each operation costs. Then a tab per group: every pattern opens to an example, a template, classic problems and their variations; every AI topic to its design, components, what to remember and what they will ask. The <a href=\"CHEATSHEET.html\">cheat sheet</a> has all of it on one screen."
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
   "blurb": "Dynamic programming and backtracking."
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
     "t": "A set instead of a dict; stop at the first repeat.",
     "code": "def contains_duplicate(nums):\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False",
     "st": {
      "p": "Write `contains_duplicate(nums)`. It receives a list of integers and returns True if any value appears at least twice, and False if every value is distinct. An empty list returns False.",
      "ex": [
       {
        "i": "nums = [1, 2, 3, 1]",
        "o": "True",
        "why": "1 appears at index 0 and index 3"
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
     "t": "Compare two Counters.",
     "code": "from collections import Counter\n\ndef is_anagram(s, t):\n    return Counter(s) == Counter(t)",
     "st": {
      "p": "Write `is_anagram(s, t)`. It receives two strings and returns True if `t` is an anagram of `s`, meaning both use exactly the same characters the same number of times, and False otherwise. Comparison is case-sensitive, so 'A' and 'a' are different characters. Strings of different lengths can never be anagrams.",
      "ex": [
       {
        "i": "s = \"anagram\", t = \"nagaram\"",
        "o": "True",
        "why": "both strings use the same seven letters with the same counts"
       },
       {
        "i": "s = \"aacc\", t = \"ccac\"",
        "o": "False",
        "why": "s has two a's and two c's, but t has one a and three c's, same length, different counts"
       }
      ],
      "k": [
       "0 <= len(s), len(t) <= 5*10^4",
       "s and t contain letters (any case)",
       "strings of different lengths are never anagrams"
      ]
     }
    },
    {
     "n": "Top k frequent elements",
     "ex": {
      "i": "[1, 1, 1, 2, 2, 3], k = 2",
      "o": "[1, 2]",
      "w": "the two most common"
     },
     "t": "Count, then take the k largest counts.",
     "code": "from collections import Counter\n\ndef top_k_frequent(nums, k):\n    return [x for x, _ in Counter(nums).most_common(k)]",
     "st": {
      "p": "Write `top_k_frequent(nums, k)`. It receives a list of integers and an integer `k`, and returns a list of the `k` most frequent values, ordered from most frequent to least. When counts tie, the value that appeared first in `nums` comes first. `k` never exceeds the number of distinct values.",
      "ex": [
       {
        "i": "nums = [1, 1, 1, 2, 2, 3], k = 2",
        "o": "[1, 2]",
        "why": "1 appears 3 times, 2 appears 2 times, both more than 3's single appearance"
       },
       {
        "i": "nums = [1, 2, 3], k = 2",
        "o": "[1, 2]",
        "why": "all three values appear once, so the tie is broken by first appearance and only the first two are kept"
       }
      ],
      "k": [
       "1 <= len(nums) <= 10^5",
       "k <= number of distinct values in nums",
       "ties broken by first-seen order"
      ]
     }
    },
    {
     "n": "First unique character",
     "ex": {
      "i": "\"leetcode\"",
      "o": "0",
      "w": "\"l\" appears once"
     },
     "t": "Count first, then a second pass finds the first count of 1.",
     "code": "from collections import Counter\n\ndef first_uniq(s):\n    cnt = Counter(s)\n    for i, c in enumerate(s):\n        if cnt[c] == 1:\n            return i\n    return -1",
     "st": {
      "p": "Write `first_uniq(s)`. It receives a string and returns the index of the first character that appears exactly once in the whole string. If no character appears exactly once (including an empty string), it returns -1.",
      "ex": [
       {
        "i": "s = \"leetcode\"",
        "o": "0",
        "why": "'l' at index 0 is the first character that appears only once"
       },
       {
        "i": "s = \"aabb\"",
        "o": "-1",
        "why": "every character in the string appears twice"
       }
      ],
      "k": [
       "0 <= len(s) <= 10^5",
       "s contains lowercase English letters",
       "returns -1 when no character is unique"
      ]
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
     "hint": "Store each number's index; look up target minus the current number.",
     "sol": "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i\n    return []",
     "c": "O(n) time, O(n) space.",
     "st": {
      "p": "Write `two_sum(nums, target)`. It receives a list of integers `nums` and an integer `target`, and returns a list of the two indices whose values add up to `target`. Exactly one valid pair exists, and the same index cannot be used twice. Return the earlier index first.",
      "ex": [
       {
        "i": "nums = [2, 7, 11, 15], target = 9",
        "o": "[0, 1]",
        "why": "nums[0] + nums[1] = 2 + 7 = 9"
       },
       {
        "i": "nums = [3, 2, 4], target = 6",
        "o": "[1, 2]",
        "why": "nums[1] + nums[2] = 2 + 4 = 6, the first pair found is not at the start of the array"
       }
      ],
      "k": [
       "2 <= len(nums) <= 10^4",
       "-10^9 <= nums[i], target <= 10^9",
       "exactly one valid pair exists",
       "runs in O(n) time"
      ]
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
     "hint": "Anagrams share the same sorted letters: use that as the key.",
     "sol": "from collections import defaultdict\n\ndef group_anagrams(words):\n    groups = defaultdict(list)\n    for w in words:\n        groups[\"\".join(sorted(w))].append(w)\n    return list(groups.values())",
     "c": "O(n k log k) for n words of length k.",
     "st": {
      "p": "Write `group_anagrams(words)`. It receives a list of lowercase strings and returns a list of groups, where each group holds words that are anagrams of one another. A word belongs to exactly one group. The order of groups follows each group's first appearance in `words`, and the order of words inside a group follows the input order too, so the output is fully determined by the input.",
      "ex": [
       {
        "i": "words = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
        "o": "[[\"eat\", \"tea\", \"ate\"], [\"tan\", \"nat\"], [\"bat\"]]",
        "why": "eat/tea/ate share the same letters, tan/nat share the same letters, bat is alone"
       },
       {
        "i": "words = [\"ab\", \"ba\", \"a\"]",
        "o": "[[\"ab\", \"ba\"], [\"a\"]]",
        "why": "ab and ba are anagrams of each other; a has no match"
       }
      ],
      "k": [
       "1 <= len(words) <= 10^4",
       "0 <= len(word) <= 100",
       "words contain lowercase English letters only",
       "group and within-group order matches first appearance in the input"
      ]
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
     "hint": "Put everything in a set; only start counting from numbers with no left neighbour.",
     "sol": "def longest_consecutive(nums):\n    s, best = set(nums), 0\n    for x in s:\n        if x - 1 not in s:            # x starts a run\n            y = x\n            while y + 1 in s:\n                y += 1\n            best = max(best, y - x + 1)\n    return best",
     "c": "O(n): each number is visited in at most one run.",
     "st": {
      "p": "Write `longest_consecutive(nums)`. It receives a list of integers (duplicates allowed, order irrelevant) and returns the length of the longest run of consecutive integers that appears anywhere among them. An empty list returns 0. The solution must run in O(n) time, so sorting first is not allowed.",
      "ex": [
       {
        "i": "nums = [100, 4, 200, 1, 3, 2]",
        "o": "4",
        "why": "1, 2, 3, 4 form the longest run"
       },
       {
        "i": "nums = [1, 2, 2, 3]",
        "o": "3",
        "why": "the run is 1, 2, 3; the repeated 2 does not extend it"
       }
      ],
      "k": [
       "0 <= len(nums) <= 10^5",
       "-10^9 <= nums[i] <= 10^9",
       "duplicates do not count twice toward a run's length",
       "must run in O(n) time"
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
     "t": "Build the prefix once; every query is one subtraction.",
     "code": "class RangeSum:\n    def __init__(self, nums):\n        self.pre = [0]\n        for x in nums:\n            self.pre.append(self.pre[-1] + x)\n\n    def sum(self, i, j):  # inclusive\n        return self.pre[j + 1] - self.pre[i]",
     "st": {
      "p": "Implement a class `RangeSum`. `RangeSum(nums)` builds it once from a list of integers, in O(n) time. Its method `sum(i, j)` returns the sum of `nums[i..j]` inclusive, answered in O(1) regardless of how many times it is called. `nums` is never modified after construction, and `i <= j` always holds.",
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
     "t": "Prefix products from the left, then suffix products from the right.",
     "code": "def product_except_self(nums):\n    out = [1] * len(nums)\n    left = 1\n    for i in range(len(nums)):\n        out[i] = left              # product of everything before i\n        left *= nums[i]\n    right = 1\n    for i in range(len(nums) - 1, -1, -1):\n        out[i] *= right            # times everything after i\n        right *= nums[i]\n    return out",
     "st": {
      "p": "Write `product_except_self(nums)`. It receives a list of at least two integers and returns a new list where each position holds the product of every other element, without using division. It must run in O(n) time using only a constant amount of extra space beyond the output list.",
      "ex": [
       {
        "i": "nums = [1, 2, 3, 4]",
        "o": "[24, 12, 8, 6]",
        "why": "each output position multiplies together the other three values"
       },
       {
        "i": "nums = [1, 0, 3]",
        "o": "[0, 3, 0]",
        "why": "the zero at index 1 makes every product that excludes it zero, and the product excluding the zero itself is 1 * 3 = 3"
       }
      ],
      "k": [
       "2 <= len(nums) <= 10^5",
       "-30 <= nums[i] <= 30",
       "no division allowed",
       "runs in O(n) time"
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
     "t": "Count 0 as -1; a repeated prefix means a zero-sum stretch. Store the first index of each prefix.",
     "code": "def find_max_length(nums):\n    first, run, best = {0: -1}, 0, 0\n    for i, x in enumerate(nums):\n        run += 1 if x else -1\n        if run in first:\n            best = max(best, i - first[run])\n        else:\n            first[run] = i\n    return best",
     "st": {
      "p": "Write `find_max_length(nums)`. It receives a list containing only 0s and 1s and returns the length of the longest contiguous subarray that has an equal count of 0s and 1s. If no such subarray exists (other than the empty one), it returns 0.",
      "ex": [
       {
        "i": "nums = [0, 1, 0]",
        "o": "2",
        "why": "[0, 1] (or equivalently [1, 0]) has one 0 and one 1"
       },
       {
        "i": "nums = [0, 0, 1, 1]",
        "o": "4",
        "why": "the whole array has two 0s and two 1s"
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
     "t": "Count prefixes by run % k instead of by run.",
     "code": "from collections import Counter\n\ndef subarrays_div_by_k(nums, k):\n    seen, run, count = Counter({0: 1}), 0, 0\n    for x in nums:\n        run = (run + x) % k\n        count += seen[run]\n        seen[run] += 1\n    return count",
     "st": {
      "p": "Write `subarrays_div_by_k(nums, k)`. It receives a list of integers, which may include negative numbers, and a positive integer `k`. It returns the count of contiguous subarrays whose sum is divisible by `k` (a sum of 0 counts).",
      "ex": [
       {
        "i": "nums = [4, 5, 0, -2, -3, 1], k = 5",
        "o": "7",
        "why": "seven contiguous subarrays sum to a multiple of 5"
       },
       {
        "i": "nums = [5, 0, 0], k = 5",
        "o": "6",
        "why": "every one of the six contiguous subarrays here sums to 0, 5, or 10, all divisible by 5"
       }
      ],
      "k": [
       "1 <= len(nums) <= 3*10^4",
       "-10^4 <= nums[i] <= 10^4",
       "2 <= k <= 10^4",
       "runs in O(n) time"
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
     "hint": "A running sum; count how often running - k has been seen.",
     "sol": "from collections import Counter\n\ndef subarray_sum(nums, k):\n    seen, run, count = Counter({0: 1}), 0, 0  # prefix 0 seen once: a run from index 0\n    for x in nums:\n        run += x\n        count += seen[run - k]  # every earlier prefix p with run - p == k\n        seen[run] += 1\n    return count",
     "c": "O(n) time and space.",
     "st": {
      "p": "Write `subarray_sum(nums, k)`. It receives a list of integers, which may include negative numbers, and an integer `k`. It returns the count of contiguous subarrays whose elements sum to exactly `k`. The same subarray is counted once even if other subarrays overlap it; two subarrays with the same sum but different start or end positions both count. The solution should run in O(n) time.",
      "ex": [
       {
        "i": "nums = [1, 1, 1], k = 2",
        "o": "2",
        "why": "nums[0:2] and nums[1:3] both sum to 2"
       },
       {
        "i": "nums = [1, -1, 0], k = 0",
        "o": "3",
        "why": "the subarrays [1, -1], [1, -1, 0], and [0] each sum to 0"
       }
      ],
      "k": [
       "1 <= len(nums) <= 2*10^4",
       "-1000 <= nums[i] <= 1000",
       "k can be negative, zero, or positive",
       "runs in O(n) time"
      ]
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
     "t": "Same direction: a slow write pointer and a fast read pointer.",
     "code": "def remove_duplicates(nums):\n    w = 0\n    for x in nums:\n        if w == 0 or x != nums[w - 1]:\n            nums[w] = x\n            w += 1\n    return w",
     "st": {
      "p": "Write `remove_duplicates(nums)`. It receives a list `nums` that is already sorted in non-decreasing order, rewrites it in place so that the first positions hold each distinct value once in order, and returns the count of distinct values. What ends up in the remaining positions past that count does not matter.",
      "ex": [
       {
        "i": "nums = [1, 1, 2, 2, 3]",
        "o": "3, array starts [1, 2, 3]",
        "why": "there are three distinct values: 1, 2, 3"
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
     "t": "Write the non-zeros forward, then fill the rest with zeros.",
     "code": "def move_zeroes(nums):\n    w = 0\n    for x in nums:\n        if x != 0:\n            nums[w] = x\n            w += 1\n    for i in range(w, len(nums)):\n        nums[i] = 0\n    return nums",
     "st": {
      "p": "Write `move_zeroes(nums)`. It receives a list of integers, moves every zero to the end of the list while keeping the relative order of the non-zero values unchanged, and returns the same list modified in place.",
      "ex": [
       {
        "i": "nums = [0, 1, 0, 3, 12]",
        "o": "[1, 3, 12, 0, 0]",
        "why": "the non-zero values keep their order and the zeros collect at the end"
       },
       {
        "i": "nums = [0, 0, 0]",
        "o": "[0, 0, 0]",
        "why": "there are no non-zero values to move, so the list is unchanged"
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
     "t": "Move the lower side inward; the water there is its best height so far minus its height.",
     "code": "def trap(h):\n    l, r, lmax, rmax, water = 0, len(h) - 1, 0, 0, 0\n    while l < r:\n        if h[l] < h[r]:            # the left wall decides\n            lmax = max(lmax, h[l])\n            water += lmax - h[l]\n            l += 1\n        else:\n            rmax = max(rmax, h[r])\n            water += rmax - h[r]\n            r -= 1\n    return water",
     "st": {
      "p": "Write `trap(h)`. It receives a list of non-negative bar heights, one unit wide each, and returns the total units of water that rain would trap between the bars. A bar can only hold water up to the shorter of the tallest bar to its left and the tallest bar to its right.",
      "ex": [
       {
        "i": "h = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        "o": "6",
        "why": "the dips between the taller bars collect 6 units of water in total"
       },
       {
        "i": "h = [5, 4, 3, 2, 1]",
        "o": "0",
        "why": "the terrain only slopes downward, so no dip can hold water"
       }
      ],
      "k": [
       "1 <= len(h) <= 2*10^4",
       "0 <= h[i] <= 10^5",
       "returns 0 when the terrain traps no water"
      ]
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
     "hint": "Pointers from both ends, skipping non-alphanumerics.",
     "sol": "def is_palindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        if not s[l].isalnum():\n            l += 1\n        elif not s[r].isalnum():\n            r -= 1\n        elif s[l].lower() != s[r].lower():\n            return False\n        else:\n            l, r = l + 1, r - 1\n    return True",
     "c": "O(n) time, O(1) space.",
     "st": {
      "p": "Write `is_palindrome(s)`. It receives a string and returns True if the string reads the same forwards and backwards once punctuation and spaces are removed and letters are treated as lowercase, and False otherwise. A string with no letters or digits at all counts as a palindrome.",
      "ex": [
       {
        "i": "s = \"A man, a plan, a canal: Panama\"",
        "o": "True",
        "why": "ignoring punctuation, spaces, and case, it reads amanaplanacanalpanama both ways"
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
     "hint": "Start wide; always move the shorter line inward.",
     "sol": "def max_area(h):\n    l, r, best = 0, len(h) - 1, 0\n    while l < r:\n        best = max(best, (r - l) * min(h[l], h[r]))\n        if h[l] < h[r]:\n            l += 1\n        else:\n            r -= 1\n    return best",
     "c": "O(n).",
     "st": {
      "p": "Write `max_area(h)`. It receives a list of non-negative bar heights, where each bar sits one unit apart, and returns the largest amount of water two of the bars can trap between them. The area between two bars is the distance between their indices times the shorter bar's height.",
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
       "0 <= h[i] <= 10^4"
      ]
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
     "hint": "Sort; fix one number; two pointers on the rest; skip duplicates.",
     "sol": "def three_sum(nums):\n    nums.sort()\n    out = []\n    for i in range(len(nums) - 2):\n        if i and nums[i] == nums[i - 1]:  # skip a duplicate anchor\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0:\n                l += 1\n            elif s > 0:\n                r -= 1\n            else:\n                out.append([nums[i], nums[l], nums[r]])\n                l += 1\n                while l < r and nums[l] == nums[l - 1]:  # skip a duplicate middle\n                    l += 1\n    return out",
     "c": "O(n^2) time.",
     "st": {
      "p": "Write `three_sum(nums)`. It receives a list of integers and returns every unique triplet of values (as three-element lists) that sums to zero. Each triplet's three values are listed low to high, no triplet is repeated even if it can be formed from different index combinations, and a value cannot be reused within the same triplet unless it appears more than once in `nums`.",
      "ex": [
       {
        "i": "nums = [-1, 0, 1, 2, -1, -4]",
        "o": "[[-1, -1, 2], [-1, 0, 1]]",
        "why": "those are the only two combinations of three values that sum to zero, with duplicates collapsed"
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
       "runs in O(n^2) time"
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
     "t": "Shrink while the window is valid, and record the minimum as you shrink.",
     "code": "def min_subarray_len(target, nums):\n    l = total = 0\n    best = float('inf')\n    for r, x in enumerate(nums):\n        total += x\n        while total >= target:\n            best = min(best, r - l + 1)\n            total -= nums[l]\n            l += 1\n    return 0 if best == float('inf') else best",
     "st": {
      "p": "Write `min_subarray_len(target, nums)`. It receives a positive `target` and a list of positive integers, and returns the length of the shortest contiguous subarray whose sum is at least `target`. If no subarray reaches `target`, it returns 0.",
      "ex": [
       {
        "i": "target = 7, nums = [2, 3, 1, 2, 4, 3]",
        "o": "2",
        "why": "[4, 3] sums to 7 in two elements, shorter than any other qualifying run"
       },
       {
        "i": "target = 100, nums = [1, 2, 3]",
        "o": "0",
        "why": "the whole array only sums to 6, never reaching 100"
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
     "t": "Valid while window length minus its most common count is at most k.",
     "code": "from collections import Counter\n\ndef character_replacement(s, k):\n    cnt, l, top, best = Counter(), 0, 0, 0\n    for r, c in enumerate(s):\n        cnt[c] += 1\n        top = max(top, cnt[c])\n        while (r - l + 1) - top > k:   # more than k letters to change\n            cnt[s[l]] -= 1\n            l += 1\n        best = max(best, r - l + 1)\n    return best",
     "st": {
      "p": "Write `character_replacement(s, k)`. It receives a string of uppercase letters and an integer `k`, and returns the length of the longest substring obtainable by changing at most `k` characters of that substring so every character in it matches. Characters outside the chosen substring are left alone.",
      "ex": [
       {
        "i": "s = \"AABABBA\", k = 1",
        "o": "4",
        "why": "\"AABA\" needs only one change (the middle B to A) to become all A's"
       },
       {
        "i": "s = \"ABAB\", k = 0",
        "o": "1",
        "why": "with no replacements allowed, no two adjacent characters already match, so the best run is a single character"
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
     "t": "A fixed window of len(s1); compare letter counts as it slides.",
     "code": "from collections import Counter\n\ndef check_inclusion(s1, s2):\n    need, win, k = Counter(s1), Counter(), len(s1)\n    for r, c in enumerate(s2):\n        win[c] += 1\n        if r >= k:                       # drop the letter leaving the window\n            out = s2[r - k]\n            win[out] -= 1\n            if win[out] == 0:\n                del win[out]\n        if win == need:\n            return True\n    return False",
     "st": {
      "p": "Write `check_inclusion(s1, s2)`. It receives two strings and returns True if some contiguous substring of `s2` is a rearrangement (uses exactly the same letters, same counts) of `s1`, and False otherwise.",
      "ex": [
       {
        "i": "s1 = \"ab\", s2 = \"eidbaooo\"",
        "o": "True",
        "why": "the substring \"ba\" inside s2 uses the same letters as \"ab\""
       },
       {
        "i": "s1 = \"ab\", s2 = \"eidboaoo\"",
        "o": "False",
        "why": "no two adjacent characters in s2 form the letters a and b together"
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
     "hint": "Remember each character's last index; jump the left edge past a repeat.",
     "sol": "def length_of_longest_substring(s):\n    last, left, best = {}, 0, 0\n    for right, ch in enumerate(s):\n        if ch in last and last[ch] >= left:  # a repeat inside the window\n            left = last[ch] + 1  # jump past it\n        last[ch] = right\n        best = max(best, right - left + 1)\n    return best",
     "c": "O(n) time, O(alphabet) space.",
     "st": {
      "p": "Write `length_of_longest_substring(s)`. It receives a string and returns the length of the longest contiguous substring in which every character is distinct. An empty string returns 0.",
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
     "hint": "Add the new element, subtract the one leaving.",
     "sol": "def max_window_sum(nums, k):\n    cur = best = sum(nums[:k])\n    for i in range(k, len(nums)):\n        cur += nums[i] - nums[i - k]\n        best = max(best, cur)\n    return best",
     "c": "O(n).",
     "st": {
      "p": "Write `max_window_sum(nums, k)`. It receives a list of integers and an integer `k`, and returns the largest sum of any `k` consecutive elements. `k` never exceeds the length of `nums`.",
      "ex": [
       {
        "i": "nums = [1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4",
        "o": "39",
        "why": "the window [4, 2, 10, 23] sums to 39, the highest of any 4 consecutive elements"
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
     "t": "Record the value that pops an index, not the distance.",
     "code": "def next_greater(nums):\n    out, st = [-1] * len(nums), []\n    for i, x in enumerate(nums):\n        while st and nums[st[-1]] < x:\n            out[st.pop()] = x\n        st.append(i)\n    return out",
     "st": {
      "p": "Write `next_greater(nums)`. It receives a list of integers and returns a list of the same length where each position holds the next value to its right that is strictly greater, or -1 if no such value exists.",
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
       "-1 marks no greater value to the right"
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
     "t": "Push each value with the minimum so far.",
     "code": "class MinStack:\n    def __init__(self):\n        self.st = []                     # (value, min so far)\n\n    def push(self, x):\n        low = min(x, self.st[-1][1]) if self.st else x\n        self.st.append((x, low))\n\n    def pop(self):\n        self.st.pop()\n\n    def get_min(self):\n        return self.st[-1][1]",
     "st": {
      "p": "Implement a class `MinStack` with three methods: `push(x)` pushes a value, `pop()` removes the most recently pushed value, and `get_min()` returns the current minimum value in the stack in O(1) time. `pop` and `get_min` are never called on an empty stack.",
      "ex": [
       {
        "i": "ops: push(5), push(3), push(7), get_min()",
        "o": "3",
        "why": "3 is the smallest of the three pushed values"
       },
       {
        "i": "ops: push(2), push(2), pop(), get_min()",
        "o": "2",
        "why": "after popping one of the two 2s, the remaining stack still has a 2 as its minimum"
       }
      ],
      "k": [
       "at most 3*10^4 total calls",
       "-10^5 <= x <= 10^5",
       "get_min and pop are never called on an empty stack",
       "get_min runs in O(1) time"
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
     "t": "Numbers push; an operator pops two and pushes the result.",
     "code": "def eval_rpn(tokens):\n    st = []\n    for t in tokens:\n        if t in {\"+\", \"-\", \"*\", \"/\"}:\n            b, a = st.pop(), st.pop()    # order matters for - and /\n            if t == \"+\": st.append(a + b)\n            elif t == \"-\": st.append(a - b)\n            elif t == \"*\": st.append(a * b)\n            else: st.append(int(a / b))  # truncate toward zero\n        else:\n            st.append(int(t))\n    return st[0]",
     "st": {
      "p": "Write `eval_rpn(tokens)`. It receives a list of string tokens representing an expression in reverse Polish (postfix) notation, using integers and the operators +, -, *, /, and returns the integer result. Division truncates toward zero rather than flooring.",
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
     "t": "An increasing stack; a lower bar closes every taller rectangle before it.",
     "code": "def largest_rectangle(h):\n    st, best = [], 0                     # (start index, height)\n    for i, x in enumerate(h + [0]):      # the 0 flushes the stack\n        start = i\n        while st and st[-1][1] > x:\n            j, y = st.pop()\n            best = max(best, y * (i - j))\n            start = j                    # x can extend back to j\n        st.append((start, x))\n    return best",
     "st": {
      "p": "Write `largest_rectangle(h)`. It receives a list of non-negative bar heights, each one unit wide and standing side by side, and returns the area of the largest rectangle that fits entirely under the bars.",
      "ex": [
       {
        "i": "h = [2, 1, 5, 6, 2, 3]",
        "o": "10",
        "why": "the bars of height 5 and 6 together give a rectangle of width 2 and height 5"
       },
       {
        "i": "h = [3, 3, 3]",
        "o": "9",
        "why": "all three bars share height 3, so the full width 3 times height 3 rectangle fits"
       }
      ],
      "k": [
       "1 <= len(h) <= 10^5",
       "0 <= h[i] <= 10^4",
       "bars are contiguous and one unit wide"
      ]
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
     "hint": "Push openers; on a closer, the top must be its match.",
     "sol": "def is_valid(s):\n    pairs, stack = {')': '(', ']': '[', '}': '{'}, []\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return not stack",
     "c": "O(n).",
     "st": {
      "p": "Write `is_valid(s)`. It receives a string made only of the characters `(`, `)`, `[`, `]`, `{`, `}` and returns True if every closing bracket matches the type of the most recently unclosed opening bracket, with every opener eventually closed, and False otherwise. An empty string is valid.",
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
     "hint": "A monotonic stack of indices waiting for a warmer day.",
     "sol": "def daily_temperatures(t):\n    out, stack = [0] * len(t), []  # stack: indices still waiting for a warmer day\n    for i, x in enumerate(t):\n        while stack and t[stack[-1]] < x:  # x is the warmer day they waited for\n            j = stack.pop()\n            out[j] = i - j\n        stack.append(i)\n    return out",
     "c": "O(n).",
     "st": {
      "p": "Write `daily_temperatures(t)`. It receives a list of daily temperatures and returns a list of the same length where each position holds how many days until a strictly warmer day occurs; if no warmer day ever comes, that position is 0.",
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
       "0 marks a day with no future warmer day"
      ]
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
     "t": "bisect_left for the first, bisect_right minus one for the last.",
     "code": "from bisect import bisect_left, bisect_right\n\ndef search_range(nums, t):\n    l = bisect_left(nums, t)\n    if l == len(nums) or nums[l] != t:\n        return [-1, -1]\n    return [l, bisect_right(nums, t) - 1]",
     "st": {
      "p": "Write `search_range(nums, t)`. It receives a list sorted in non-decreasing order, which may contain duplicates, and a target `t`. It returns a two-element list `[first, last]` giving the first and last index where `t` occurs, or `[-1, -1]` if `t` does not appear. It must run in O(log n) time.",
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
       "runs in O(log n) time"
      ]
     }
    },
    {
     "n": "Minimum of a rotated array",
     "ex": {
      "i": "[3, 4, 5, 1, 2]",
      "o": "1",
      "w": "where the rotation starts"
     },
     "t": "Compare mid with hi: bigger means the drop is to the right.",
     "code": "def find_min(nums):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] > nums[hi]:\n            lo = mid + 1\n        else:\n            hi = mid\n    return nums[lo]",
     "st": {
      "p": "Write `find_min(nums)`. It receives a list of unique integers that was sorted ascending and then rotated at an unknown pivot, and returns the minimum value in the list. It must run in O(log n) time.",
      "ex": [
       {
        "i": "nums = [3, 4, 5, 1, 2]",
        "o": "1",
        "why": "1 is the smallest value, where the rotation wraps back around"
       },
       {
        "i": "nums = [1, 2, 3, 4, 5]",
        "o": "1",
        "why": "the array happens not to be rotated, so the minimum is the first element"
       }
      ],
      "k": [
       "1 <= len(nums) <= 5000",
       "all values in nums are unique",
       "runs in O(log n) time"
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
     "t": "Search the speed, not the array: if a speed works, every faster one does.",
     "code": "def min_eating_speed(piles, h):\n    lo, hi = 1, max(piles)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        hours = sum((p + mid - 1) // mid for p in piles)   # ceil(p / mid)\n        if hours <= h:\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo",
     "st": {
      "p": "Write `min_eating_speed(piles, h)`. It receives a list of banana pile sizes and an integer `h` for the number of hours available. Eating at a constant integer speed of `k` bananas per hour, finishing pile `p` takes `ceil(p / k)` hours (a partially eaten pile still costs a full hour before moving on). It returns the smallest integer speed `k` that lets every pile be eaten within `h` hours total.",
      "ex": [
       {
        "i": "piles = [3, 6, 7, 11], h = 8",
        "o": "4",
        "why": "at speed 4, the piles take ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours, exactly the limit, and speed 3 would take longer"
       },
       {
        "i": "piles = [30, 11, 23, 4, 20], h = 5",
        "o": "30",
        "why": "with only one hour per pile on average, the speed must cover the largest pile, 30, in a single hour"
       }
      ],
      "k": [
       "1 <= len(piles) <= 10^4",
       "1 <= piles[i] <= 10^9",
       "len(piles) <= h <= 10^9",
       "runs in O(n log(max(piles))) time"
      ]
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
     "hint": "Classic halving.",
     "sol": "def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
     "c": "O(log n).",
     "st": {
      "p": "Write `search(nums, target)`. It receives a list of distinct integers sorted in ascending order and a target value, and returns the index of `target` in the list, or -1 if it is not present. It must run in O(log n) time.",
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
       "runs in O(log n) time"
      ]
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
     "hint": "One half is always sorted; check whether the target is in it.",
     "sol": "def search_rotated(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[lo] <= nums[mid]:                  # left half sorted\n            if nums[lo] <= target < nums[mid]:\n                hi = mid - 1\n            else:\n                lo = mid + 1\n        else:                                      # right half sorted\n            if nums[mid] < target <= nums[hi]:\n                lo = mid + 1\n            else:\n                hi = mid - 1\n    return -1",
     "c": "O(log n).",
     "st": {
      "p": "Write `search_rotated(nums, target)`. It receives a list that was originally sorted ascending with all distinct values, then rotated at some unknown pivot, and a target value. It returns the index of `target`, or -1 if it is not present, in O(log n) time.",
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
       "the array is sorted ascending then rotated at an unknown pivot",
       "runs in O(log n) time"
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
     "t": "Slow moves one, fast moves two.",
     "code": "def middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    return slow",
     "st": {
      "p": "`middle` receives the `head` of a linked list and returns the middle node. For an even-length list it returns the second of the two middle nodes, since the fast pointer reaches the end first. Use a slow pointer and a fast pointer that moves twice as fast.",
      "ex": [
       {
        "i": "head = [1, 2, 3, 4, 5]",
        "o": "3",
        "why": "slow lands exactly on the middle of an odd-length list"
       },
       {
        "i": "head = [1, 2, 3, 4, 5, 6]",
        "o": "4",
        "why": "fast runs out first, leaving slow on the later of the two middles"
       }
      ],
      "k": [
       "O(n) time, one pass",
       "O(1) space"
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
     "t": "A dummy head, and fast starts n + 1 ahead so slow stops before the target.",
     "code": "def remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    fast = slow = dummy\n    for _ in range(n + 1):\n        fast = fast.next\n    while fast:\n        fast, slow = fast.next, slow.next\n    slow.next = slow.next.next\n    return dummy.next",
     "st": {
      "p": "`remove_nth_from_end` receives the `head` of a linked list and an integer `n`, and returns the head after removing the nth node counting from the end. Use a dummy node before `head` so removing the true head needs no special case, and advance a fast pointer n + 1 steps ahead of a slow pointer before moving both.",
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
       "n is always within the list's length",
       "O(n) time, single pass",
       "O(1) space"
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
     "t": "After they meet, restart one pointer at the head; step both by one; they meet at the entry.",
     "code": "def cycle_start(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n        if slow is fast:\n            slow = head\n            while slow is not fast:\n                slow, fast = slow.next, fast.next\n            return slow\n    return None",
     "st": {
      "p": "`cycle_start` receives the `head` of a linked list and returns the node where a cycle begins, or `None` if the list has no cycle. First find a meeting point with slow and fast pointers, then restart one pointer at `head`; advancing both one step at a time, they meet exactly at the entry node.",
      "ex": [
       {
        "i": "head = [3, 2, 0, -4], with the tail's `next` pointed back at the node holding 2",
        "o": "the node holding 2",
        "why": "that node is where the loop begins"
       },
       {
        "i": "head = [1, 2, 3]",
        "o": "None",
        "why": "the list has no cycle"
       }
      ],
      "k": [
       "O(n) time",
       "O(1) space, no visited set"
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
     "hint": "Three pointers: prev, current, next.",
     "sol": "def reverse(head):\n    prev = None\n    while head:\n        head.next, prev, head = prev, head, head.next\n    return prev",
     "c": "O(n), O(1) space.",
     "st": {
      "p": "The function `reverse` receives the `head` of a singly linked list and returns the head of the reversed list. Walk the list once, redirecting each node's `next` pointer to the node before it. An empty list (`head` is `None`) returns `None`.",
      "ex": [
       {
        "i": "head = [1, 2, 3, 4, 5]",
        "o": "[5, 4, 3, 2, 1]",
        "why": "each pointer flips to point at the previous node"
       },
       {
        "i": "head = []",
        "o": "[]",
        "why": "an empty list stays empty, nothing to reverse"
       }
      ],
      "k": [
       "O(n) time",
       "O(1) extra space, only pointers",
       "n can be 0"
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
     "hint": "Fast and slow pointers meet if there's a cycle.",
     "sol": "def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n        if slow is fast:  # fast can only lap slow inside a loop\n            return True\n    return False",
     "c": "O(n), O(1).",
     "st": {
      "p": "`has_cycle` receives the `head` of a linked list and returns `True` if the list loops back on itself, `False` if it ends in `None`. Use a slow pointer and a fast pointer moving one and two nodes at a time; they meet only if a cycle exists.",
      "ex": [
       {
        "i": "head = [1, 2, 3]",
        "o": "False",
        "why": "the list ends cleanly"
       },
       {
        "i": "head = [1, 2, 3], with the tail's `next` pointed back at the node holding 2",
        "o": "True",
        "why": "the fast pointer laps the slow pointer inside the loop"
       }
      ],
      "k": [
       "O(n) time",
       "O(1) space, no visited set"
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
     "hint": "A dummy head; attach the smaller node each time.",
     "sol": "def merge_two(a, b):\n    dummy = tail = ListNode()\n    while a and b:\n        if a.val <= b.val:\n            tail.next, a = a, a.next\n        else:\n            tail.next, b = b, b.next\n        tail = tail.next\n    tail.next = a or b\n    return dummy.next",
     "c": "O(n + m).",
     "st": {
      "p": "`merge_two` receives the heads of two already-sorted linked lists, `a` and `b`, and returns the head of one merged sorted list built from their nodes. Use a dummy head and attach whichever node has the smaller value, then attach whatever is left of the other list once one runs out. Either input can be empty.",
      "ex": [
       {
        "i": "a = [1, 2, 4], b = [1, 3, 4]",
        "o": "[1, 1, 2, 3, 4, 4]",
        "why": "on a tie, list a's node is attached first"
       },
       {
        "i": "a = [], b = [0]",
        "o": "[0]",
        "why": "an empty list passes the other list through unchanged"
       }
      ],
      "k": [
       "O(n + m) time for lists of length n and m",
       "O(1) extra space beyond the merged nodes"
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
     "t": "Swap the children, recursively.",
     "code": "def invert(n):\n    if n:\n        n.left, n.right = invert(n.right), invert(n.left)\n    return n",
     "st": {
      "p": "`invert` receives the `root` of a binary tree and returns the same tree with every node's left and right children swapped, recursively. An empty tree returns `None` unchanged.",
      "ex": [
       {
        "i": "root = [4, 2, 7, 1, 3, 6, 9]",
        "o": "[4, 7, 2, 9, 6, 3, 1]",
        "why": "every left and right pair is mirrored, level by level"
       },
       {
        "i": "root = []",
        "o": "[]",
        "why": "nothing to swap"
       }
      ],
      "k": [
       "O(n) time, visits every node once",
       "O(h) recursion stack"
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
     "t": "Both smaller: go left. Both larger: go right. Otherwise you are at it.",
     "code": "def lca_bst(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.left\n        elif p > root.val and q > root.val:\n            root = root.right\n        else:\n            return root",
     "st": {
      "p": "`lca_bst` receives the `root` of a binary search tree and two values `p` and `q` that both exist in it, and returns the node where their paths from the root first split. If both values are smaller than the current node, move left; if both are larger, move right; otherwise the current node is the answer, including when one value is an ancestor of the other.",
      "ex": [
       {
        "i": "root = [6, 2, 8, 0, 4, 7, 9], p = 2, q = 8",
        "o": "the node holding 6",
        "why": "2 and 8 fall on opposite sides of 6"
       },
       {
        "i": "root = [6, 2, 8, 0, 4, 7, 9], p = 2, q = 4",
        "o": "the node holding 2",
        "why": "4 sits under 2, so 2 is its own ancestor here"
       }
      ],
      "k": [
       "p and q both exist in the tree",
       "O(h) time for a tree of height h",
       "O(1) space, no recursion"
      ]
     }
    },
    {
     "n": "Diameter",
     "ex": {
      "i": "[1, 2, 3, 4, 5]",
      "o": "3",
      "w": "4 -> 2 -> 1 -> 3, three edges"
     },
     "t": "Return height up; at each node the best path through it is left + right.",
     "code": "def diameter(root):\n    best = 0\n    def height(n):\n        nonlocal best\n        if not n:\n            return 0\n        l, r = height(n.left), height(n.right)\n        best = max(best, l + r)          # the longest path through n\n        return 1 + max(l, r)\n    height(root)\n    return best",
     "st": {
      "p": "`diameter` receives the `root` of a binary tree and returns the number of edges on the longest path between any two nodes, which may or may not pass through the root. While computing each subtree's height, track the best left-height-plus-right-height seen at any node. A single node or empty tree has diameter 0.",
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
       "O(n) time, one pass computing heights bottom-up",
       "O(h) recursion stack"
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
     "t": "Level-order BFS; keep the last node of each level.",
     "code": "from collections import deque\n\ndef right_view(root):\n    out, q = [], deque([root] if root else [])\n    while q:\n        out.append(q[-1].val)            # rightmost of this level\n        for _ in range(len(q)):\n            n = q.popleft()\n            if n.left:\n                q.append(n.left)\n            if n.right:\n                q.append(n.right)\n    return out",
     "st": {
      "p": "`right_view` receives the `root` of a binary tree and returns the values visible when looking at the tree from the right side, top to bottom: one value per level, the rightmost node on that level. An empty tree returns an empty list. Use a level-order pass and keep the last node processed on each level.",
      "ex": [
       {
        "i": "root = [1, 2, 3, None, 5, None, 4]",
        "o": "[1, 3, 4]",
        "why": "node 5 is hidden behind 3 on its level"
       },
       {
        "i": "root = [1, 2, 3]",
        "o": "[1, 3]",
        "why": "a full level always shows its rightmost node"
       }
      ],
      "k": [
       "O(n) time and O(n) space for the queue and output"
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
     "hint": "1 plus the deeper child.",
     "sol": "def max_depth(node):\n    if not node:\n        return 0\n    return 1 + max(max_depth(node.left), max_depth(node.right))",
     "c": "O(n).",
     "st": {
      "p": "`max_depth` receives the `root` of a binary tree and returns the number of nodes on the longest path from root to a leaf. An empty tree (`root` is `None`) has depth 0. Recurse into both children and take one plus the deeper side.",
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
       "O(n) time, visits every node once",
       "O(h) recursion stack for a tree of height h"
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
     "hint": "BFS with a queue, one level per loop.",
     "sol": "from collections import deque\n\ndef level_order(root):\n    if not root:\n        return []\n    out, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            n = q.popleft()\n            level.append(n.val)\n            q.extend(c for c in (n.left, n.right) if c)\n        out.append(level)\n    return out",
     "c": "O(n).",
     "st": {
      "p": "`level_order` receives the `root` of a binary tree and returns a list of lists, one per level, each holding that level's node values left to right. An empty tree returns an empty list. Use a queue and process one full level per loop iteration.",
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
       "O(n) time and O(n) space for the output and queue"
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
     "hint": "Pass the allowed range down, not just parent comparisons.",
     "sol": "def is_bst(node, lo=float('-inf'), hi=float('inf')):\n    if not node:\n        return True\n    if not (lo < node.val < hi):  # every ancestor bounds it, not only the parent\n        return False\n    return is_bst(node.left, lo, node.val) and is_bst(node.right, node.val, hi)",
     "c": "O(n).",
     "st": {
      "p": "`is_bst` receives the `root` of a binary tree and returns `True` if it is a valid binary search tree, `False` otherwise. A node is valid only if its value falls strictly between the lower and upper bounds inherited from every ancestor, not its direct parent. An empty tree is valid.",
      "ex": [
       {
        "i": "root = [2, 1, 3]",
        "o": "True",
        "why": "1 < 2 < 3 holds at every node"
       },
       {
        "i": "root = [5, 1, 4, None, None, 3, 6]",
        "o": "False",
        "why": "3 sits under 5 in the tree but is smaller than the bound 5 imposes on that side"
       }
      ],
      "k": [
       "O(n) time, one pass with bounds carried down",
       "O(h) recursion stack"
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
     "t": "Start the queue with every source at once; each BFS level is one minute.",
     "code": "from collections import deque\n\ndef oranges_rotting(g):\n    R, C = len(g), len(g[0])\n    q = deque((r, c) for r in range(R) for c in range(C) if g[r][c] == 2)\n    fresh = sum(row.count(1) for row in g)\n    mins = 0\n    while q and fresh:\n        for _ in range(len(q)):          # one minute\n            r, c = q.popleft()\n            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < R and 0 <= nc < C and g[nr][nc] == 1:\n                    g[nr][nc] = 2\n                    fresh -= 1\n                    q.append((nr, nc))\n        mins += 1\n    return -1 if fresh else mins",
     "st": {
      "p": "`oranges_rotting` receives a grid where 0 is an empty cell, 1 is a fresh orange, and 2 is a rotten orange, and returns the number of minutes until no fresh orange remains, or -1 if some fresh orange can never be reached. Start a BFS from every rotten orange at once, since they all rot their neighbors simultaneously; each full round of the queue is one minute.",
      "ex": [
       {
        "i": "grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]",
        "o": "4",
        "why": "the farthest fresh orange takes four minutes to rot"
       },
       {
        "i": "grid = [[0, 2]]",
        "o": "0",
        "why": "there is no fresh orange to wait on"
       }
      ],
      "k": [
       "grid dimensions bound the BFS to O(rows x cols) time",
       "returns -1 only when a fresh orange stays unreachable"
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
     "t": "Build an adjacency list; one DFS per unseen node counts one component.",
     "code": "from collections import defaultdict\n\ndef count_components(n, edges):\n    g = defaultdict(list)\n    for a, b in edges:\n        g[a].append(b)\n        g[b].append(a)\n    seen, count = set(), 0\n    for s in range(n):\n        if s in seen:\n            continue\n        count += 1\n        stack = [s]\n        seen.add(s)\n        while stack:\n            u = stack.pop()\n            for v in g[u]:\n                if v not in seen:\n                    seen.add(v)\n                    stack.append(v)\n    return count",
     "st": {
      "p": "`count_components` receives an integer `n` (nodes numbered 0 to n - 1) and a list of undirected `edges`, and returns how many separate connected groups the nodes form. Build an adjacency list, then run one DFS from each node not yet visited; each such DFS accounts for one component. A node with no edges is its own component.",
      "ex": [
       {
        "i": "n = 5, edges = [[0, 1], [1, 2], [3, 4]]",
        "o": "2",
        "why": "{0, 1, 2} and {3, 4} are the two groups"
       },
       {
        "i": "n = 3, edges = []",
        "o": "3",
        "why": "with no edges every node is its own component"
       }
      ],
      "k": [
       "O(n + e) time for n nodes and e edges",
       "node ids run from 0 to n - 1"
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
     "t": "The nodes are words; neighbours differ by one letter; BFS gives the fewest steps.",
     "code": "from collections import deque\n\ndef ladder_length(begin, end, words):\n    words = set(words)\n    q, seen = deque([(begin, 1)]), {begin}\n    while q:\n        w, d = q.popleft()\n        if w == end:\n            return d\n        for i in range(len(w)):\n            for ch in \"abcdefghijklmnopqrstuvwxyz\":\n                nw = w[:i] + ch + w[i + 1:]\n                if nw in words and nw not in seen:\n                    seen.add(nw)\n                    q.append((nw, d + 1))\n    return 0",
     "st": {
      "p": "`ladder_length` receives a `begin` word, an `end` word, and a list of allowed `words`, and returns the fewest steps to turn `begin` into `end` by changing one letter at a time, where every intermediate word must appear in `words`. Return 0 if no such sequence exists, including when `end` itself is not in `words`. Treat each word as a graph node and BFS gives the shortest sequence.",
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
       "O(w x 26 x L) time for w words of length L in the worst case"
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
     "hint": "For each unvisited land cell, flood-fill it and count one.",
     "sol": "def num_islands(grid):\n    rows, cols, count = len(grid), len(grid[0]), 0\n    def sink(r, c):\n        if 0 <= r < rows and 0 <= c < cols and grid[r][c] == '1':\n            grid[r][c] = '0'\n            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                sink(r + dr, c + dc)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                count += 1\n                sink(r, c)\n    return count",
     "c": "O(rows x cols).",
     "st": {
      "p": "`num_islands` receives a grid of `'1'` (land) and `'0'` (water) characters, given as a list of lists so cells can be marked visited in place, and returns the count of separate land masses. Land cells connect up, down, left and right, not diagonally. Flood-fill and clear each island's cells as you count it so it is never counted twice.",
      "ex": [
       {
        "i": "grid = [['1','1','0','0','0'], ['1','1','0','0','0'], ['0','0','1','0','0'], ['0','0','0','1','1']]",
        "o": "3",
        "why": "three groups of connected land cells"
       },
       {
        "i": "grid = [['0']]",
        "o": "0",
        "why": "a single water cell has no land"
       }
      ],
      "k": [
       "O(rows x cols) time, each cell visited once",
       "grid has at least one row and one column"
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
     "t": "Same Kahn loop; append each course as you pop it; empty if a cycle.",
     "code": "from collections import deque, defaultdict\n\ndef find_order(n, prereqs):\n    g, indeg = defaultdict(list), [0] * n\n    for c, p in prereqs:\n        g[p].append(c)\n        indeg[c] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0)\n    order = []\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in g[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0:\n                q.append(v)\n    return order if len(order) == n else []",
     "st": {
      "p": "`find_order` receives an integer `n` and a list of `prereqs` pairs `[course, prereq]`, and returns one valid order to take all n courses, or an empty list if the prerequisites contain a cycle. It runs the same indegree-zero queue as course scheduling, appending each course to the result as it is taken. Any order consistent with the prerequisites is accepted.",
      "ex": [
       {
        "i": "n = 4, prereqs = [[1, 0], [2, 0], [3, 1], [3, 2]]",
        "o": "[0, 1, 2, 3]",
        "why": "0 unlocks 1 and 2, which both unlock 3; any order respecting prerequisites is accepted"
       },
       {
        "i": "n = 2, prereqs = [[1, 0], [0, 1]]",
        "o": "[]",
        "why": "a cycle means no valid order exists"
       }
      ],
      "k": [
       "O(n + e) time",
       "course ids run from 0 to n - 1",
       "any valid order is accepted, not only the one shown"
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
     "t": "The first edge whose two ends already share a root.",
     "code": "def redundant_connection(edges):\n    parent = list(range(len(edges) + 1))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]   # path halving\n            x = parent[x]\n        return x\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            return [a, b]\n        parent[ra] = rb",
     "st": {
      "p": "`redundant_connection` receives a list of `edges` for a graph that started as a tree and had exactly one extra edge added, and returns the edge that can be removed to make it a tree again. Process edges in order with union-find; the first edge whose two endpoints already share a root is the one that closes a cycle.",
      "ex": [
       {
        "i": "edges = [[1, 2], [1, 3], [2, 3]]",
        "o": "[2, 3]",
        "why": "1 and 2 are already connected through 1-2 and 1-3 before this edge arrives"
       },
       {
        "i": "edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]",
        "o": "[1, 4]",
        "why": "1 and 4 are already connected through 1-2-3-4 before this edge arrives"
       }
      ],
      "k": [
       "exactly one redundant edge exists",
       "close to O(1) amortized per union-find operation"
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
     "t": "Dijkstra from the source; the answer is the largest distance, or -1 if any node is unreachable.",
     "code": "import heapq\nfrom collections import defaultdict\n\ndef network_delay(times, n, k):\n    g = defaultdict(list)\n    for u, v, w in times:\n        g[u].append((v, w))\n    dist, heap = {}, [(0, k)]\n    while heap:\n        d, u = heapq.heappop(heap)\n        if u in dist:                    # already settled with a shorter path\n            continue\n        dist[u] = d\n        for v, w in g[u]:\n            if v not in dist:\n                heapq.heappush(heap, (d + w, v))\n    return max(dist.values()) if len(dist) == n else -1",
     "st": {
      "p": "`network_delay` receives a list of directed `times` edges `[source, target, weight]`, a node count `n` (nodes numbered 1 to n), and a starting node `k`, and returns how long it takes for a signal sent from `k` to reach every node, or -1 if some node is unreachable. Run Dijkstra from `k`; the answer is the largest of the settled distances, but only once all n nodes have been reached.",
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
       "O(e log v) time"
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
     "t": "Bellman-Ford for k + 1 rounds, relaxing from a copy so one round is one more edge.",
     "code": "def cheapest_flights(n, flights, src, dst, k):\n    cost = [float('inf')] * n\n    cost[src] = 0\n    for _ in range(k + 1):\n        nxt = cost[:]                    # from the copy: one more edge per round\n        for u, v, w in flights:\n            if cost[u] + w < nxt[v]:\n                nxt[v] = cost[u] + w\n        cost = nxt\n    return -1 if cost[dst] == float('inf') else cost[dst]",
     "st": {
      "p": "`cheapest_flights` receives a node count `n`, a list of `flights` `[source, target, price]`, a `src`, a `dst`, and a maximum number of stops `k`, and returns the cheapest total price from `src` to `dst` using at most k stops, or -1 if no such route exists. Run k + 1 rounds of Bellman-Ford relaxation from a copy of the cost array each round, since each round can only add one more edge to a path.",
      "ex": [
       {
        "i": "n = 3, flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src = 0, dst = 2, k = 1",
        "o": "200",
        "why": "one stop at 1 allows the two cheap legs, 100 + 100"
       },
       {
        "i": "n = 3, flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src = 0, dst = 2, k = 0",
        "o": "500",
        "why": "zero stops forces the direct, pricier edge"
       }
      ],
      "k": [
       "O(k x e) time for e flights and k stops"
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
     "hint": "Kahn's algorithm: repeatedly take courses with no remaining prerequisites.",
     "sol": "from collections import deque, defaultdict\n\ndef can_finish(n, prereqs):\n    graph, indeg = defaultdict(list), [0] * n\n    for course, pre in prereqs:\n        graph[pre].append(course)\n        indeg[course] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0)  # no prerequisites left\n    done = 0\n    while q:\n        u = q.popleft()\n        done += 1\n        for v in graph[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0:\n                q.append(v)\n    return done == n  # a cycle never reaches indegree 0",
     "c": "O(V + E).",
     "st": {
      "p": "`can_finish` receives an integer `n` (courses numbered 0 to n - 1) and a list of `prereqs` pairs `[course, prereq]`, and returns `True` if every course can be completed, `False` if the prerequisites contain a cycle. Repeatedly take courses whose prerequisites are all satisfied (indegree 0); if fewer than n courses can ever be taken this way, a cycle is blocking the rest.",
      "ex": [
       {
        "i": "n = 2, prereqs = [[1, 0]]",
        "o": "True",
        "why": "take course 0, then course 1"
       },
       {
        "i": "n = 2, prereqs = [[1, 0], [0, 1]]",
        "o": "False",
        "why": "0 needs 1 and 1 needs 0, a cycle"
       }
      ],
      "k": [
       "O(n + e) time for n courses and e prerequisite pairs",
       "course ids run from 0 to n - 1"
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
     "hint": "A min-heap of (cost, node); skip stale entries.",
     "sol": "import heapq\n\ndef dijkstra(graph, src):          # graph: {u: [(v, w), ...]}\n    dist = {src: 0}\n    heap = [(0, src)]\n    while heap:\n        d, u = heapq.heappop(heap)\n        if d > dist.get(u, float('inf')):  # stale entry: a shorter path won already\n            continue\n        for v, w in graph.get(u, []):\n            nd = d + w\n            if nd < dist.get(v, float('inf')):\n                dist[v] = nd\n                heapq.heappush(heap, (nd, v))\n    return dist",
     "c": "O(E log V).",
     "st": {
      "p": "`dijkstra` receives a `graph` mapping each node to a list of `(neighbor, weight)` pairs, all weights non-negative, and a `src` node, and returns a dictionary of the cheapest distance from `src` to every node it can reach. A node with no path from `src` is left out of the result entirely. Use a min-heap keyed by distance and skip any popped entry already beaten by a shorter recorded distance.",
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
       "O(e log v) time for v nodes and e edges"
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
     "t": "Same top k, keyed by squared distance; no square root needed.",
     "code": "import heapq\n\ndef k_closest(points, k):\n    return heapq.nsmallest(k, points, key=lambda p: p[0] ** 2 + p[1] ** 2)",
     "st": {
      "p": "`k_closest` receives a list of 2D `points` and an integer `k`, and returns the k points closest to the origin, ordered by increasing distance. Compare squared distance instead of true distance, since it avoids a square root and preserves the same ordering.",
      "ex": [
       {
        "i": "points = [[1, 3], [-2, 2]], k = 1",
        "o": "[[-2, 2]]",
        "why": "squared distance 8 beats squared distance 10"
       },
       {
        "i": "points = [[3, 3], [5, -1], [-2, 4]], k = 2",
        "o": "[[3, 3], [-2, 4]]",
        "why": "squared distances 18 and 20 both beat 26"
       }
      ],
      "k": [
       "1 <= k <= len(points)",
       "O(n log k) time"
      ]
     }
    },
    {
     "n": "Running median",
     "ex": {
      "i": "add 1, 2, 3",
      "o": "medians 1, 1.5, 2",
      "w": "after each add"
     },
     "t": "Two heaps: a max-heap for the lower half, a min-heap for the upper half.",
     "code": "import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.lo, self.hi = [], []        # lo holds negatives: a max-heap\n\n    def add(self, x):\n        heapq.heappush(self.lo, -x)\n        heapq.heappush(self.hi, -heapq.heappop(self.lo))\n        if len(self.hi) > len(self.lo):  # keep lo the same size or one bigger\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\n\n    def median(self):\n        if len(self.lo) > len(self.hi):\n            return -self.lo[0]\n        return (-self.lo[0] + self.hi[0]) / 2",
     "st": {
      "p": "The `MedianFinder` class supports `add(x)`, which inserts a number, and `median()`, which returns the median of every number inserted so far. Keep a max-heap for the lower half of the values and a min-heap for the upper half, rebalancing after each add so their sizes never differ by more than one; the median comes from the top of one or both heaps.",
      "ex": [
       {
        "i": "add(1), add(2), add(3), reading `median()` after each add",
        "o": "1, 1.5, 2",
        "why": "the two halves rebalance to keep the median at the boundary"
       },
       {
        "i": "add(5), add(2), add(8), add(1), reading `median()` after each add",
        "o": "5, 3.5, 5, 3.5",
        "why": "with an even count the median averages the two middle values"
       }
      ],
      "k": [
       "add() is called before the first median()",
       "O(log n) time per add, O(1) time per median call"
      ]
     }
    },
    {
     "n": "Top k frequent words",
     "ex": {
      "i": "[\"i\", \"love\", \"code\", \"i\", \"love\", \"coding\"], k = 2",
      "o": "[\"i\", \"love\"]",
      "w": "ties broken alphabetically"
     },
     "t": "Count, then top k by (-count, word).",
     "code": "import heapq\nfrom collections import Counter\n\ndef top_k_words(words, k):\n    cnt = Counter(words)\n    return heapq.nsmallest(k, cnt, key=lambda w: (-cnt[w], w))",
     "st": {
      "p": "`top_k_words` receives a list of `words` and an integer `k`, and returns the k most frequent words, ties broken alphabetically. Count occurrences, then take the k smallest by the key `(-count, word)`, which sorts by highest count first and alphabetically within a tied count.",
      "ex": [
       {
        "i": "words = ['i', 'love', 'code', 'i', 'love', 'coding'], k = 2",
        "o": "['i', 'love']",
        "why": "'i' and 'love' each appear twice, more than any other word"
       },
       {
        "i": "words = ['a', 'b', 'c'], k = 2",
        "o": "['a', 'b']",
        "why": "all three tie at one occurrence, so alphabetical order breaks the tie"
       }
      ],
      "k": [
       "1 <= k <= number of distinct words",
       "O(n log k) time"
      ]
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
     "hint": "A min-heap of size k.",
     "sol": "import heapq\n\ndef kth_largest(nums, k):\n    heap = nums[:k]\n    heapq.heapify(heap)\n    for x in nums[k:]:\n        if x > heap[0]:\n            heapq.heapreplace(heap, x)\n    return heap[0]",
     "c": "O(n log k).",
     "st": {
      "p": "`kth_largest` receives an unsorted list `nums` and an integer `k`, and returns the kth largest value, counting duplicates by position rather than by distinct value. Keep a min-heap of the k largest values seen so far; anything smaller than the heap's minimum can be discarded right away.",
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
       "O(n log k) time, O(k) space"
      ]
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
     "hint": "A heap of (value, list index, position).",
     "sol": "import heapq\n\ndef merge_k(lists):\n    # (value, list, position); list breaks ties\n    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]\n    heapq.heapify(heap)\n    out = []\n    while heap:\n        val, i, j = heapq.heappop(heap)\n        out.append(val)\n        if j + 1 < len(lists[i]):\n            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))\n    return out",
     "c": "O(N log k) for N total items.",
     "st": {
      "p": "`merge_k` receives a list of k already-sorted Python lists and returns one sorted list containing all of their values. Keep a heap of one candidate value per input list, always popping the smallest and pushing that list's next value in its place. Any input list, or the whole input, can be empty.",
      "ex": [
       {
        "i": "lists = [[1, 4, 5], [1, 3, 4], [2, 6]]",
        "o": "[1, 1, 2, 3, 4, 4, 5, 6]",
        "why": "the heap always yields the smallest value across all three lists"
       },
       {
        "i": "lists = [[]]",
        "o": "[]",
        "why": "a single empty list contributes nothing"
       }
      ],
      "k": [
       "O(N log k) time for N total items across k lists",
       "O(k) heap size"
      ]
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
     "t": "Copy what ends before it, merge what overlaps it, copy the rest.",
     "code": "def insert(ivs, new):\n    out, i, n = [], 0, len(ivs)\n    while i < n and ivs[i][1] < new[0]:\n        out.append(ivs[i])\n        i += 1\n    s, e = new\n    while i < n and ivs[i][0] <= e:\n        s, e = min(s, ivs[i][0]), max(e, ivs[i][1])\n        i += 1\n    out.append([s, e])\n    return out + ivs[i:]",
     "st": {
      "p": "`insert` receives a list of non-overlapping intervals `ivs` already sorted by start time, plus one `new` interval, and returns the intervals after inserting `new` and merging any overlaps it creates. Copy over intervals ending before `new` starts, merge every interval that overlaps `new` into a single expanded interval, then copy the rest.",
      "ex": [
       {
        "i": "ivs = [[1, 3], [6, 9]], new = [2, 5]",
        "o": "[[1, 5], [6, 9]]",
        "why": "[2, 5] overlaps [1, 3] and absorbs it"
       },
       {
        "i": "ivs = [[1, 5]], new = [6, 8]",
        "o": "[[1, 5], [6, 8]]",
        "why": "the new interval starts after the existing one ends, so nothing merges"
       }
      ],
      "k": [
       "ivs is sorted and non-overlapping on input",
       "O(n) time, one pass"
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
     "t": "Sort; any start before the previous end is a clash.",
     "code": "def can_attend(ivs):\n    ivs = sorted(ivs)\n    return all(ivs[i][0] >= ivs[i - 1][1] for i in range(1, len(ivs)))",
     "st": {
      "p": "`can_attend` receives a list of `[start, end]` meeting intervals and returns `True` if one person could attend all of them without any overlap, `False` otherwise. Sort by start time and check that each meeting starts no earlier than the previous one ends; back-to-back meetings, where one starts exactly when the last ends, are allowed.",
      "ex": [
       {
        "i": "meetings = [[0, 30], [5, 10]]",
        "o": "False",
        "why": "the second meeting starts at 5, before the first ends at 30"
       },
       {
        "i": "meetings = [[7, 10], [2, 4]]",
        "o": "True",
        "why": "sorted by start, [2, 4] ends before [7, 10] begins"
       }
      ],
      "k": [
       "O(n log n) time for the sort"
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
     "t": "Sort by end; keep whatever ends first, count the rest. Greedy.",
     "code": "def erase_overlap(ivs):\n    end, removed = float('-inf'), 0\n    for s, e in sorted(ivs, key=lambda x: x[1]):\n        if s >= end:\n            end = e\n        else:\n            removed += 1\n    return removed",
     "st": {
      "p": "`erase_overlap` receives a list of `[start, end]` intervals and returns the minimum number of intervals to remove so none of the remaining ones overlap. Sort by end time and greedily keep whichever interval ends earliest at each step, counting as removed any interval that starts before the last kept interval ends.",
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
       "O(n log n) time for the sort"
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
     "hint": "Sort by start; a min-heap of end times; reuse a room when the earliest ends first.",
     "sol": "import heapq\n\ndef min_rooms(meetings):\n    ends = []\n    for start, end in sorted(meetings):\n        if ends and ends[0] <= start:\n            heapq.heapreplace(ends, end)   # reuse the room that frees first\n        else:\n            heapq.heappush(ends, end)\n    return len(ends)",
     "c": "O(n log n).",
     "st": {
      "p": "`min_rooms` receives a list of `[start, end]` meeting intervals and returns the minimum number of rooms needed so no two overlapping meetings share a room. Sort meetings by start time and track room end times in a min-heap; reuse the room that frees earliest when it frees before the next meeting starts, otherwise open a new room.",
      "ex": [
       {
        "i": "meetings = [[0, 30], [5, 10], [15, 20]]",
        "o": "2",
        "why": "[5, 10] and [15, 20] both need a room while [0, 30] is still going"
       },
       {
        "i": "meetings = [[7, 10], [2, 4]]",
        "o": "1",
        "why": "the two meetings do not overlap, so one room covers both"
       }
      ],
      "k": [
       "O(n log n) time for the sort and heap operations"
      ]
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
     "t": "The state is the best sum ending here: extend the run or restart at x. O(n), O(1).",
     "code": "def max_subarray(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)     # extend the run, or restart at x\n        best = max(best, cur)\n    return best",
     "st": {
      "p": "Write `max_subarray(nums)` that returns the largest possible sum of a contiguous subarray of `nums`. Assume `nums` has at least one element; a single-element array returns that element even if it is negative.",
      "ex": [
       {
        "i": "max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])",
        "o": "6",
        "why": "the subarray [4, -1, 2, 1] has the largest sum"
       },
       {
        "i": "max_subarray([-5])",
        "o": "-5",
        "why": "edge case: a single negative element is still the best, and only, subarray"
       }
      ],
      "k": [
       "O(n) time, O(1) space",
       "nums has at least one element"
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
     "t": "Keep the smallest tail for each length; bisect places each number. O(n log n).",
     "code": "from bisect import bisect_left\n\ndef lis(nums):\n    tails = []                           # tails[i]: smallest end of a run of length i + 1\n    for x in nums:\n        i = bisect_left(tails, x)\n        if i == len(tails):\n            tails.append(x)\n        else:\n            tails[i] = x\n    return len(tails)",
     "st": {
      "p": "Write `lis(nums)` that returns the length of the longest strictly increasing subsequence of `nums`. The subsequence does not have to be contiguous. Your solution should not fall back on the slower quadratic approach.",
      "ex": [
       {
        "i": "lis([10, 9, 2, 5, 3, 7, 101, 18])",
        "o": "4",
        "why": "2, 3, 7, 18 is strictly increasing and is the longest such run"
       },
       {
        "i": "lis([])",
        "o": "0",
        "why": "edge case: an empty list has no subsequence at all"
       }
      ],
      "k": [
       "O(n log n) time",
       "O(n) space"
      ]
     }
    },
    {
     "n": "Unique paths in a grid",
     "ex": {
      "i": "3 rows, 7 columns",
      "o": "28",
      "w": "moves right or down only"
     },
     "t": "Each cell is paths from above plus paths from the left; one row is enough.",
     "code": "def unique_paths(m, n):\n    row = [1] * n\n    for _ in range(1, m):\n        for j in range(1, n):\n            row[j] += row[j - 1]         # above (old row[j]) + left\n    return row[-1]",
     "st": {
      "p": "A robot sits at the top-left corner of an `m` by `n` grid and can only move right or down. Write `unique_paths(m, n)` that returns how many distinct paths reach the bottom-right corner. A 1 by 1 grid means the robot starts where it needs to end.",
      "ex": [
       {
        "i": "unique_paths(3, 7)",
        "o": "28",
        "why": "3 rows and 7 columns give 28 right-or-down paths"
       },
       {
        "i": "unique_paths(1, 1)",
        "o": "1",
        "why": "edge case: a single cell needs no moves, so there is exactly one path"
       }
      ],
      "k": [
       "O(m x n) time",
       "O(n) space if only one row is kept"
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
     "t": "ok[i] means s[:i] can be split; try every last word.",
     "code": "def word_break(s, words):\n    words = set(words)\n    ok = [True] + [False] * len(s)\n    for i in range(1, len(s) + 1):\n        ok[i] = any(ok[j] and s[j:i] in words for j in range(i))\n    return ok[-1]",
     "st": {
      "p": "Given a string `s` and a list of dictionary `words`, write `word_break(s, words)` that returns whether `s` can be split into a sequence of words from the dictionary. Words may be reused any number of times. An empty string counts as breakable, since it needs zero words.",
      "ex": [
       {
        "i": "word_break(\"leetcode\", [\"leet\", \"code\"])",
        "o": "True",
        "why": "\"leetcode\" splits into \"leet\" plus \"code\""
       },
       {
        "i": "word_break(\"\", [\"a\", \"b\"])",
        "o": "True",
        "why": "edge case: an empty string needs no words, so it trivially breaks"
       }
      ],
      "k": [
       "O(n^2) time for a string of length n",
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
     "t": "Loop capacity downward so each item is used at most once.",
     "code": "def knapsack(wts, vals, cap):\n    dp = [0] * (cap + 1)\n    for w, v in zip(wts, vals):\n        for c in range(cap, w - 1, -1):  # downward: this item once\n            dp[c] = max(dp[c], dp[c - w] + v)\n    return dp[cap]",
     "st": {
      "p": "You have items described by parallel lists `wts` (weights) and `vals` (values), and a knapsack of capacity `cap`. Each item can be taken at most once. Write `knapsack(wts, vals, cap)` that returns the maximum total value that fits without exceeding capacity. An item heavier than the capacity contributes nothing.",
      "ex": [
       {
        "i": "knapsack([1, 3, 4], [15, 20, 30], 4)",
        "o": "35",
        "why": "items with weights 1 and 3 together weigh 4 and are worth 35"
       },
       {
        "i": "knapsack([5], [10], 4)",
        "o": "0",
        "why": "edge case: the only item is heavier than the capacity, so nothing fits"
       }
      ],
      "k": [
       "O(len(items) x cap) time",
       "O(cap) space",
       "weights and values are non-negative"
      ]
     }
    }
   ],
   "spot": "Count the ways, min or max cost, choices that overlap. <b>Signal:</b> 'how many ways', 'minimum cost', and a brute force that repeats work.",
   "cx": "States times transitions; memoisation turns exponential into polynomial.",
   "tpl": "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef best(i):\n    if i >= n:\n        return 0\n    return max(take(i) + best(i + 2), best(i + 1))",
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
     "hint": "ways(n) = ways(n-1) + ways(n-2).",
     "sol": "def climb(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a",
     "c": "O(n), O(1) space.",
     "st": {
      "p": "You are climbing a staircase with `n` steps and can take either 1 or 2 steps at a time. Write `climb(n)` that returns the number of distinct ways to reach the top. Treat `n = 0` as already at the top, so there is exactly one way: taking no steps at all.",
      "ex": [
       {
        "i": "climb(5)",
        "o": "8",
        "why": "the 1s-and-2s step counts follow the Fibonacci recurrence"
       },
       {
        "i": "climb(0)",
        "o": "1",
        "why": "edge case: zero steps means one trivial way, taking none"
       }
      ],
      "k": [
       "O(n) time, O(1) space",
       "n is a non-negative integer"
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
     "hint": "At each house: rob it plus best two back, or skip it.",
     "sol": "def rob(nums):\n    take, skip = 0, 0\n    for x in nums:\n        take, skip = skip + x, max(take, skip)\n    return max(take, skip)",
     "c": "O(n).",
     "st": {
      "p": "You are robbing houses on a street where `nums[i]` is the cash in house i. You cannot rob two adjacent houses, since it trips the alarm. Write `rob(nums)` that returns the maximum total you can steal. An empty list of houses has nothing to steal.",
      "ex": [
       {
        "i": "rob([2, 7, 9, 3, 1])",
        "o": "12",
        "why": "rob houses at indices 0, 2 and 4 (2 + 9 + 1) and skip the rest"
       },
       {
        "i": "rob([])",
        "o": "0",
        "why": "edge case: no houses means nothing to rob"
       }
      ],
      "k": [
       "O(n) time, O(1) space",
       "amounts are non-negative"
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
     "hint": "dp[a] = 1 + min over coins of dp[a - coin].",
     "sol": "def coin_change(coins, amount):\n    INF = amount + 1  # more coins than could ever be needed\n    dp = [0] + [INF] * amount  # dp[a] = fewest coins that make a\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    return dp[amount] if dp[amount] != INF else -1",
     "c": "O(amount x coins).",
     "st": {
      "p": "Given a list of coin denominations `coins` and a target `amount`, write `coin_change(coins, amount)` that returns the fewest coins needed to make exactly that amount, reusing any denomination as many times as needed. If no combination makes the amount exactly, return -1.",
      "ex": [
       {
        "i": "coin_change([1, 2, 5], 11)",
        "o": "3",
        "why": "5 + 5 + 1 uses the fewest coins"
       },
       {
        "i": "coin_change([2], 3)",
        "o": "-1",
        "why": "edge case: an odd amount is unreachable with only even coins"
       }
      ],
      "k": [
       "O(amount x len(coins)) time",
       "O(amount) space",
       "coin values and amount are non-negative integers"
      ]
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
     "hint": "A 2D table: match extends the diagonal, else take the best neighbour.",
     "sol": "def lcs(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1  # match: extend the diagonal\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # drop a character from a or b\n    return dp[-1][-1]",
     "c": "O(n m).",
     "st": {
      "p": "Write `lcs(a, b)` that returns the length of the longest subsequence common to strings `a` and `b`. A subsequence keeps the original order but may skip characters. Either string may be empty.",
      "ex": [
       {
        "i": "lcs(\"abcde\", \"ace\")",
        "o": "3",
        "why": "\"ace\" appears in order in both strings"
       },
       {
        "i": "lcs(\"\", \"abc\")",
        "o": "0",
        "why": "edge case: an empty string shares no characters with anything"
       }
      ],
      "k": [
       "O(n x m) time and space for strings of length n and m",
       "n and m are the lengths of a and b"
      ]
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
     "t": "Recurse from the same index to allow reuse; stop when the rest would overshoot.",
     "code": "def combination_sum(cands, target):\n    out = []\n    def go(i, path, left):\n        if left == 0:\n            out.append(path[:])\n            return\n        for j in range(i, len(cands)):\n            if cands[j] <= left:\n                path.append(cands[j])\n                go(j, path, left - cands[j])   # j, not j + 1: reuse allowed\n                path.pop()\n    go(0, [], target)\n    return out",
     "st": {
      "p": "Given a list of distinct positive numbers `cands` and a `target`, write `combination_sum(cands, target)` that returns every combination of candidates that sums exactly to target. A candidate may be reused any number of times, and no combination should be a reordering of another already returned. If no combination reaches the target, return an empty list.",
      "ex": [
       {
        "i": "combination_sum([2, 3, 6, 7], 7)",
        "o": "[[2, 2, 3], [7]]",
        "why": "2 + 2 + 3 and 7 both sum to 7; no other combination does"
       },
       {
        "i": "combination_sum([2], 3)",
        "o": "[]",
        "why": "edge case: only even sums are reachable with a single even candidate, so an odd target has no combination"
       }
      ],
      "k": [
       "worst case exponential in target and len(cands)",
       "candidates and target are positive integers"
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
     "t": "Sort; at one depth, skip a number equal to the one before it.",
     "code": "def subsets_dup(nums):\n    nums, out = sorted(nums), []\n    def go(i, path):\n        out.append(path[:])\n        for j in range(i, len(nums)):\n            if j > i and nums[j] == nums[j - 1]:   # same choice at this depth\n                continue\n            path.append(nums[j])\n            go(j + 1, path)\n            path.pop()\n    go(0, [])\n    return out",
     "st": {
      "p": "Given a list of numbers `nums` that may contain duplicates, write `subsets_dup(nums)` that returns every distinct subset, with no duplicate subset appearing twice, as a list of lists.",
      "ex": [
       {
        "i": "subsets_dup([1, 2, 2])",
        "o": "[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]",
        "why": "6 distinct subsets; [2] and [1, 2] each appear once even though 2 repeats, any order is accepted"
       },
       {
        "i": "subsets_dup([])",
        "o": "[[]]",
        "why": "edge case: an empty input still has one subset, the empty one"
       }
      ],
      "k": [
       "O(n x 2^n) time worst case",
       "input may be unsorted; sort first to group duplicates together"
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
     "t": "Add an opener while any are left; a closer only while it has an opener to match.",
     "code": "def gen_parens(n):\n    out = []\n    def go(s, opened, closed):\n        if len(s) == 2 * n:\n            out.append(s)\n            return\n        if opened < n:\n            go(s + \"(\", opened + 1, closed)\n        if closed < opened:\n            go(s + \")\", opened, closed + 1)\n    go(\"\", 0, 0)\n    return out",
     "st": {
      "p": "Write `gen_parens(n)` that returns every string of `n` pairs of balanced parentheses, as a list of strings. A string is balanced when every closing bracket has a matching, earlier opening bracket and the counts are equal at the end.",
      "ex": [
       {
        "i": "gen_parens(3)",
        "o": "[\"((()))\", \"(()())\", \"(())()\", \"()(())\", \"()()()\"]",
        "why": "the 5 balanced strings for 3 pairs (the 3rd Catalan number), in the order the openers-first recursion visits them, any order is accepted"
       },
       {
        "i": "gen_parens(0)",
        "o": "[\"\"]",
        "why": "edge case: zero pairs gives exactly one result, the empty string"
       }
      ],
      "k": [
       "O(4^n / sqrt(n)) strings generated, each built in O(n)",
       "n counts pairs, so the result holds 2n-character strings"
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
     "hint": "At each index, include it or not.",
     "sol": "def subsets(nums):\n    out = []\n    def go(i, path):\n        if i == len(nums):\n            out.append(path[:])\n            return\n        go(i + 1, path)  # skip nums[i]\n        path.append(nums[i])  # take nums[i]\n        go(i + 1, path)\n        path.pop()  # undo before going back up\n    go(0, [])\n    return out",
     "c": "O(n 2^n).",
     "st": {
      "p": "Write `subsets(nums)` that returns every subset of a list of distinct numbers, as a list of lists, including the empty subset and the full list itself. The order of the subsets in the result does not matter.",
      "ex": [
       {
        "i": "subsets([1, 2, 3])",
        "o": "[[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]",
        "why": "8 subsets total (2^3); this is the order the skip-then-take recursion visits them, any order is accepted"
       },
       {
        "i": "subsets([])",
        "o": "[[]]",
        "why": "edge case: an empty input still has one subset, the empty one"
       }
      ],
      "k": [
       "O(n x 2^n) time and space",
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
     "hint": "Choose an unused number, recurse, undo.",
     "sol": "def permutations(nums):\n    out, used = [], [False] * len(nums)\n    def go(path):\n        if len(path) == len(nums):\n            out.append(path[:])\n            return\n        for i, x in enumerate(nums):\n            if not used[i]:  # each number once per path\n                used[i] = True\n                path.append(x)\n                go(path)\n                path.pop()\n                used[i] = False  # undo the choice\n    go([])\n    return out",
     "c": "O(n n!).",
     "st": {
      "p": "Write `permutations(nums)` that returns every ordering of a list of distinct numbers, as a list of lists. The order of the permutations in the result does not matter.",
      "ex": [
       {
        "i": "permutations([1, 2, 3])",
        "o": "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
        "why": "3! = 6 orderings; this is the order the used-array recursion visits them, any order is accepted"
       },
       {
        "i": "permutations([])",
        "o": "[[]]",
        "why": "edge case: an empty input has exactly one ordering, the empty one"
       }
      ],
      "k": [
       "O(n x n!) time and space",
       "nums has no duplicate values"
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
    "GraphRAG earns its cost over plain RAG specifically for multi-hop questions where the answer requires connecting facts across chunks; for a fact stated directly in one place, plain retrieval is simpler and cheaper."
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
 ]
};
