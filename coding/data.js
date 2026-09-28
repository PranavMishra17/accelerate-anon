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
        "why": "[4, 3] sums to 7 in just two elements, shorter than any other qualifying run"
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
      "p": "`is_bst` receives the `root` of a binary tree and returns `True` if it is a valid binary search tree, `False` otherwise. A node is valid only if its value falls strictly between the lower and upper bounds inherited from every ancestor, not just its direct parent. An empty tree is valid.",
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
        "why": "edge case: k larger than the number of documents just returns all of them"
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
    "ai"
   ]
  }
 ]
};
