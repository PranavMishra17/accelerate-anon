/* Mercor coding tab, part 1: Python, back in your hands. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "basics",
 "n": 1,
 "title": "Python, back in your hands",
 "minutes": 45,
 "lead": "After this part you can read and write the loops, dicts, small classes and loaders in the mock code without stopping to look things up.",
 "sections": [
  {
   "id": "basics-loops",
   "title": "Loops that read well",
   "blocks": [
    {
     "t": "p",
     "text": "Most code you will read in the mocks is a loop over something. Write the loop so it says what it walks over: items, items with a position, or two lists side by side. Reach for `range(len(x))` last."
    },
    {
     "t": "code",
     "id": "basics-loops-tour",
     "title": "Six loops in one file",
     "code": "names = [\"ada\", \"bo\", \"cy\"]\nscores = [90, 72, 85]\n\nfor name in names:\n    print(name)\nfor i, name in enumerate(names, start=1):\n    print(i, name)\nfor name, score in zip(names, scores):\n    print(name, score)\nfor n in range(10, 0, -4):\n    print(n)\n\ntries = 0\nwhile tries < 3:\n    tries += 1\n    if tries == 2:\n        continue\n    print(\"try\", tries)\n\nfor n in [4, 6, 9]:\n    if n % 2 == 1:\n        print(\"odd\", n)\n        break\nelse:\n    print(\"no odd\")",
     "notes": {
      "4": "Walk the items. No index needed.",
      "6": "Gives (position, item) pairs. start=1 for human counting.",
      "8": "Walks two lists in step. Stops at the shorter one.",
      "10": "10, 6, 2. The stop value 0 is never included.",
      "14": "Repeat while a condition holds. Something inside must change it.",
      "17": "Skip the rest of this pass and go to the next check.",
      "23": "Leave the loop now.",
      "24": "Belongs to the for. Runs only when the loop ended without a break."
     },
     "ask": {
      "q": "Click the line that runs only if the for loop finished without hitting break.",
      "lines": [
       25
      ],
      "why": "The else on a loop is 'no break happened'. It is rare. Know it so you do not read it as an if-else."
     }
    },
    {
     "t": "predict",
     "id": "basics-loops-p1",
     "code": "seen = []\nfor n in range(1, 8):\n    if n % 3 == 0:\n        continue\n    if n > 5:\n        break\n    seen.append(n)\nelse:\n    seen.append(\"done\")\nprint(seen)",
     "q": "What does this print? Watch continue, break and the else.",
     "answer": "[1, 2, 4, 5]",
     "why": "n=3 and n=6 are skipped by continue. n=7 is above 5 so break fires, and the else is skipped because of the break. Only 1, 2, 4, 5 were appended."
    },
    {
     "t": "mcq",
     "id": "basics-loops-mcq",
     "q": "After `for i in range(3): pass` finishes, what is `i`?",
     "o": [
      "It does not exist; the name is gone after the loop",
      "3",
      "2",
      "0"
     ],
     "a": 2,
     "why": "A for loop variable is an ordinary name in the enclosing scope. It keeps the last value it had, 2. Late-binding bugs (section 4) come from this."
    },
    {
     "t": "p",
     "text": "Where you will see it: `delete_prefix` in `mock2_service/app/cache/lru.py` (line 73) loops over a list; `_evict_over_budget` (line 86) is a while loop with a condition on two limits."
    },
    {
     "t": "write",
     "id": "basics-loops-w1",
     "q": "Rewrite this loop so it uses enumerate and zip instead of range(len(...)). Same output.",
     "starter": "names = [\"ada\", \"bo\", \"cy\"]\nscores = [90, 72, 85]\n\nfor i in range(len(names)):\n    print(str(i + 1) + \". \" + names[i] + \" \" + str(scores[i]))",
     "solution": "names = [\"ada\", \"bo\", \"cy\"]\nscores = [90, 72, 85]\n\nfor rank, (name, score) in enumerate(zip(names, scores), start=1):\n    print(f\"{rank}. {name} {score}\")",
     "hint": "enumerate(zip(names, scores), start=1) gives (rank, (name, score)); unpack it in the for line.",
     "why": "range(len(...)) plus indexing works but hides intent. enumerate says 'I need the position', zip says 'two lists in step'."
    }
   ]
  },
  {
   "id": "basics-dicts",
   "title": "Dicts and sets, the workhorses",
   "blocks": [
    {
     "t": "p",
     "text": "A cache is a dict with rules. Four moves cover most of what you will read: `get` with a default, `in`, `setdefault`, and `defaultdict`. A set is a dict with keys only, for 'have I seen this'."
    },
    {
     "t": "code",
     "id": "basics-dicts-tour",
     "title": "Counting and grouping four ways",
     "code": "from collections import Counter, defaultdict\n\nwords = \"the cat and the hat and the bat\".split()\n\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)\n\nprint(Counter(words).most_common(2))\n\ngroups = defaultdict(list)\nfor w in words:\n    groups[len(w)].append(w)\nprint(dict(groups))\n\nby_len = {}\nfor w in words:\n    by_len.setdefault(len(w), []).append(w)\nprint(by_len == dict(groups))\n\nunique = set(words)\nprint(\"cat\" in unique, sorted(unique))",
     "notes": {
      "7": "get returns the default instead of raising KeyError. The classic counter.",
      "10": "The same count in one call. most_common(n) sorts for you.",
      "12": "A missing key creates an empty list on first touch.",
      "19": "Returns the existing value, or stores the default and returns that.",
      "22": "Unique items. Membership with in is fast."
     },
     "ask": {
      "q": "Click the line that counts one word without raising KeyError the first time a word appears.",
      "lines": [
       7
      ],
      "why": "Without the 0 default, the first sighting of a word raises KeyError. This get-then-set shape is the same one a cache uses: look, else fill."
     }
    },
    {
     "t": "predict",
     "id": "basics-dicts-p1",
     "code": "from collections import Counter\nwords = \"the cat and the hat and the bat\".split()\nprint(Counter(words).most_common(2))",
     "q": "What does this print?",
     "answer": "[('the', 3), ('and', 2)]",
     "why": "'the' appears 3 times, 'and' twice, the rest once. most_common returns (word, count) pairs, biggest first."
    },
    {
     "t": "predict",
     "id": "basics-dicts-order",
     "code": "d = {}\nd[\"b\"] = 1\nd[\"a\"] = 2\nd[\"b\"] = 3\ndel d[\"a\"]\nd[\"a\"] = 4\nprint(list(d), d)",
     "q": "Dicts keep insertion order. What does this print?",
     "answer": "['b', 'a'] {'b': 3, 'a': 4}",
     "why": "Updating an existing key keeps its place, so 'b' stays first. 'a' was deleted and added again, so it goes to the end. To change the order of a plain dict you have to delete and re-add; OrderedDict has move_to_end for that (next section)."
    },
    {
     "t": "p",
     "text": "Deleting while iterating is a bug. Python refuses to continue because the dict changed size under the loop. This is the one dict bug you should be able to spot at a glance in a review."
    },
    {
     "t": "predict",
     "id": "basics-dicts-mut",
     "code": "prices = {\"a\": 5, \"b\": 0, \"c\": 7, \"d\": 0}\ntry:\n    for key, value in prices.items():\n        if value == 0:\n            del prices[key]\nexcept RuntimeError as e:\n    print(type(e).__name__ + \": \" + str(e))",
     "q": "This loop deletes zero-priced entries while walking the dict. What happens?",
     "answer": "RuntimeError: dictionary changed size during iteration",
     "why": "The first del changes the dict's size mid-walk and Python raises RuntimeError on the next step. Fix: walk a copy (list(prices)) or build a new dict."
    },
    {
     "t": "p",
     "text": "Where you will see it: `delete_prefix` in `mock2_service/app/cache/lru.py` (lines 73 to 77) first collects the doomed keys in a list, then deletes. That is exactly the fix. In `mock1_review/cache.py`, `invalidate` uses `self._data.pop(key, None)`, the safe delete that does not raise when the key is missing."
    },
    {
     "t": "write",
     "id": "basics-dicts-fix",
     "q": "Fix the loop so it removes zero-priced entries without crashing. It should print {'a': 5, 'c': 7}.",
     "starter": "prices = {\"a\": 5, \"b\": 0, \"c\": 7, \"d\": 0}\nfor key, value in prices.items():\n    if value == 0:\n        del prices[key]\nprint(prices)",
     "solution": "prices = {\"a\": 5, \"b\": 0, \"c\": 7, \"d\": 0}\nfor key in list(prices):\n    if prices[key] == 0:\n        del prices[key]\nprint(prices)",
     "hint": "Loop over list(prices) instead of prices.items().",
     "why": "A list copy of the keys is safe to walk while you delete from the dict. A dict comprehension that keeps the non-zero entries works too."
    },
    {
     "t": "write",
     "id": "basics-dicts-freq",
     "q": "Write top_words(text): count words ignoring case, return (word, count) pairs, most frequent first, ties alphabetical. Use get, not Counter.",
     "starter": "def top_words(text):\n    # return [(word, count), ...], most frequent first, ties alphabetical\n    pass\n\nprint(top_words(\"The cat and the hat and THE bat\"))",
     "solution": "def top_words(text):\n    counts = {}\n    for w in text.lower().split():\n        counts[w] = counts.get(w, 0) + 1\n    return sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))\n\nprint(top_words(\"The cat and the hat and THE bat\"))",
     "hint": "Count with counts.get(w, 0) + 1, then sorted(counts.items(), key=...) with a tuple key like (-count, word).",
     "why": "A word count is the shape of every hit-counter and every group-by. The sort key (-count, word) is the standard trick for 'descending, then alphabetical'."
    }
   ]
  },
  {
   "id": "basics-lru",
   "title": "OrderedDict, the LRU building block",
   "blocks": [
    {
     "t": "p",
     "text": "A least-recently-used cache is a dict plus an order. `OrderedDict` keeps the order and gives two moves: `move_to_end(key)` marks something as freshly used, `popitem(last=False)` removes the oldest. That is the whole LRU."
    },
    {
     "t": "code",
     "id": "basics-lru-moves",
     "title": "The two moves",
     "code": "from collections import OrderedDict\n\nd = OrderedDict()\nd[\"a\"] = 1\nd[\"b\"] = 2\nd[\"c\"] = 3\nd.move_to_end(\"a\")\nprint(list(d))\noldest = d.popitem(last=False)\nprint(oldest, list(d))\nnewest = d.popitem()\nprint(newest, list(d))",
     "notes": {
      "7": "a becomes the most recently used: it goes to the back.",
      "9": "Removes and returns the front: the least recently used.",
      "11": "With no argument it takes from the back (last=True): the newest."
     },
     "ask": {
      "q": "Click the line that throws out the least recently used entry.",
      "lines": [
       9
      ],
      "why": "Front is oldest, back is newest. last=False takes from the front. Easy to flip in your head, so say it aloud: 'front is the victim'."
     }
    },
    {
     "t": "p",
     "text": "In `mock2_service/app/cache/lru.py`, `get` calls `move_to_end` on a hit (line 53) and `_evict_over_budget` calls `popitem(last=False)` (line 89). Same two moves, with TTL and byte limits around them."
    },
    {
     "t": "predict",
     "id": "basics-lru-p",
     "code": "from collections import OrderedDict\n\ncache = OrderedDict()\n\ndef put(k, v):\n    cache[k] = v\n    cache.move_to_end(k)\n    if len(cache) > 2:\n        cache.popitem(last=False)\n\ndef get(k):\n    if k not in cache:\n        return None\n    cache.move_to_end(k)\n    return cache[k]\n\nput(\"a\", 1)\nput(\"b\", 2)\nget(\"a\")\nput(\"c\", 3)\nprint(list(cache), get(\"b\"))",
     "q": "A cache of size 2. What does the last line print?",
     "answer": "['a', 'c'] None",
     "why": "put a, put b: order a, b. get a moves a to the back: b, a. put c adds c and the size is 3, so the front (b) is evicted: a, c. get('b') is now None."
    },
    {
     "t": "mcq",
     "id": "basics-lru-mcq",
     "q": "Why must get() call move_to_end, and not only put()?",
     "o": [
      "Without it get would raise KeyError",
      "move_to_end makes the lookup faster",
      "Reading a key also counts as using it, so a hot read must protect the key from eviction",
      "put cannot work unless get was called first"
     ],
     "a": 2,
     "why": "LRU means least recently used, and a read is a use. If get did not move the key, a key read a thousand times could still be evicted first."
    },
    {
     "t": "write",
     "id": "basics-lru-w",
     "q": "Write a tiny LRU with capacity 2 using OrderedDict. get returns None on a miss and counts as a use. put inserts or updates, and evicts the oldest when over capacity.",
     "starter": "from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap = cap\n        self._d = OrderedDict()\n\n    def get(self, key):\n        ...\n\n    def put(self, key, value):\n        ...\n\n    def __len__(self):\n        return len(self._d)\n\nc = LRU(2)\nc.put(\"a\", 1)\nc.put(\"b\", 2)\nc.get(\"a\")\nc.put(\"c\", 3)\nprint(c.get(\"b\"), c.get(\"a\"), len(c))\nc.put(\"a\", 10)\nc.put(\"d\", 4)\nprint(c.get(\"c\"), c.get(\"a\"), c.get(\"d\"))",
     "solution": "from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap = cap\n        self._d = OrderedDict()\n\n    def get(self, key):\n        if key not in self._d:\n            return None\n        self._d.move_to_end(key)\n        return self._d[key]\n\n    def put(self, key, value):\n        self._d[key] = value\n        self._d.move_to_end(key)\n        if len(self._d) > self.cap:\n            self._d.popitem(last=False)\n\n    def __len__(self):\n        return len(self._d)\n\nc = LRU(2)\nc.put(\"a\", 1)\nc.put(\"b\", 2)\nc.get(\"a\")\nc.put(\"c\", 3)\nprint(c.get(\"b\"), c.get(\"a\"), len(c))\nc.put(\"a\", 10)\nc.put(\"d\", 4)\nprint(c.get(\"c\"), c.get(\"a\"), c.get(\"d\"))",
     "hint": "Both get (on a hit) and put call move_to_end. After put, if len > cap, popitem(last=False).",
     "why": "Writing this once from nothing is the screen warm-up: it is the bottom layer of every cache question. Check the expected output: None 1 2, then None 10 4."
    }
   ]
  },
  {
   "id": "basics-closures",
   "title": "Functions, closures and the loader pattern",
   "blocks": [
    {
     "t": "p",
     "text": "A cache never knows how to load a value. The caller hands it a small function: 'call this if you miss'. That function is a closure: it remembers variables from where it was written. This is the part that explains a lot of concurrency code, because the thing you hand a thread or a pool is also a function."
    },
    {
     "t": "code",
     "id": "basics-closures-loader",
     "title": "The loader pattern",
     "code": "calls = []\n\ndef load(sku):\n    calls.append(sku)\n    return sku.upper()\n\nclass Cache:\n    def __init__(self):\n        self.data = {}\n\n    def get_or_load(self, key, loader):\n        if key not in self.data:\n            self.data[key] = loader()\n        return self.data[key]\n\ncache = Cache()\nprint(cache.get_or_load(\"a\", lambda: load(\"a\")))\nprint(cache.get_or_load(\"a\", lambda: load(\"a\")))\nprint(calls)",
     "notes": {
      "11": "The cache takes a function, not a value.",
      "13": "Only here is the loader called. The cache decides if and when.",
      "17": "A tiny function with no name. It remembers \"a\". Writing it does not call load."
     },
     "ask": {
      "q": "Click the line where the loader actually runs.",
      "lines": [
       13
      ],
      "why": "Passing lambda: load('a') only builds a function. load runs on this line, and only on a miss. The second call finds 'a' and never calls the loader."
     }
    },
    {
     "t": "p",
     "text": "Where you will see it: in `mock1_review/app.py`, `get_profile` defines a small `load()` inside the method and passes it to the cache. `get_price` passes `lambda: self.db.get_price(sku, currency)`. Both remember `user_id` or `sku` from the method that built them."
    },
    {
     "t": "p",
     "text": "The classic bug: a closure remembers the variable, not its value at that moment. If you build functions in a loop and call them after the loop, they all see the last value."
    },
    {
     "t": "predict",
     "id": "basics-closures-late",
     "code": "fs = [lambda: i for i in range(3)]\nprint([f() for f in fs])",
     "q": "What does this print?",
     "answer": "[2, 2, 2]",
     "why": "Each lambda looks up i when it is called, not when it was made. By then the loop is over and i is 2, so all three return 2."
    },
    {
     "t": "predict",
     "id": "basics-closures-late2",
     "code": "def load(sku):\n    return sku.upper()\n\njobs = []\nfor sku in [\"a\", \"b\", \"c\"]:\n    jobs.append(lambda: load(sku))\nprint([job() for job in jobs])",
     "q": "Same idea with the loader shape. What does this print?",
     "answer": "['C', 'C', 'C']",
     "why": "All three lambdas look at the variable sku, which ends as 'c'. This is the exact bug you get from `pool.submit(lambda: load(sku))` in a loop when the task runs later. The fix is to bind the value: `lambda sku=sku: load(sku)`, or pass it as an argument: `pool.submit(load, sku)`."
    },
    {
     "t": "write",
     "id": "basics-closures-w",
     "q": "Fix the list of lambdas so it prints [0, 1, 2].",
     "starter": "fs = [lambda: i for i in range(3)]\nprint([f() for f in fs])   # want [0, 1, 2]",
     "solution": "fs = [lambda i=i: i for i in range(3)]\nprint([f() for f in fs])   # want [0, 1, 2]",
     "hint": "Give the lambda a parameter that defaults to the current i: lambda i=i: i.",
     "why": "The default value is evaluated when the lambda is created, so each one keeps its own i. In real code prefer submit(fn, arg) or functools.partial."
    }
   ]
  },
  {
   "id": "basics-classes",
   "title": "Classes, dataclasses, __len__ and properties",
   "blocks": [
    {
     "t": "p",
     "text": "A cache is a class with a dict inside. Three small things show up everywhere: a dataclass for a record, `__len__` so `len(cache)` works, and `@property` so a computed value reads like a field."
    },
    {
     "t": "code",
     "id": "basics-classes-tour",
     "title": "A small cache class",
     "code": "from dataclasses import dataclass\n\n@dataclass\nclass Entry:\n    value: int\n    hits: int = 0\n\nclass Cache:\n    def __init__(self, cap):\n        self.cap = cap\n        self._data = {}\n\n    def __len__(self):\n        return len(self._data)\n\n    @property\n    def full(self):\n        return len(self) >= self.cap\n\n    def put(self, key, value):\n        self._data[key] = Entry(value)\n\nc = Cache(1)\nprint(len(c), c.full, bool(c))\nc.put(\"a\", 1)\nprint(len(c), c.full, bool(c), c._data[\"a\"])",
     "notes": {
      "3": "Writes __init__, __repr__ and __eq__ from the annotated fields. hits: int = 0 is a default.",
      "13": "Makes len(c) work. It also decides truthiness: length 0 means False.",
      "16": "Call it as c.full, no parentheses. It runs the method each time.",
      "21": "One record per key. The dataclass repr shows both fields."
     },
     "ask": {
      "q": "Click the line that makes len(c) work on a Cache.",
      "lines": [
       13
      ],
      "why": "len(x) calls x.__len__(). Both lru.py (line 38) and mock1's caches define it so you can check the size."
     }
    },
    {
     "t": "predict",
     "id": "basics-classes-p",
     "code": "class Cache:\n    def __init__(self):\n        self._data = {}\n\n    def __len__(self):\n        return len(self._data)\n\nc = Cache()\nprint(bool(c))\nc._data[\"a\"] = 1\nprint(bool(c))",
     "q": "What does this print?",
     "answer": "False\nTrue",
     "why": "An object with __len__ is truthy when its length is not 0. An empty cache is falsy."
    },
    {
     "t": "mcq",
     "id": "basics-classes-mcq",
     "q": "A function does `cache = cache or Cache()` and you pass in your own empty Cache (it has __len__). What happens?",
     "o": [
      "Your cache is used",
      "Your cache is ignored and a new one is created, because an empty cache is falsy",
      "TypeError, because Cache has no __bool__",
      "Both caches are merged"
     ],
     "a": 1,
     "why": "This is a real source of 'my cache is never used' bugs. Write `if cache is None` when you mean 'was nothing passed'."
    },
    {
     "t": "p",
     "text": "Where you will see it: `_Slot` in `mock2_service/app/cache/lru.py` (line 11) is a dataclass; `__len__` is on line 38 and the `bytes_used` property on line 41. The `[V]` after the class name is the Python 3.12 way to say 'generic over V'. Read it as decoration."
    },
    {
     "t": "write",
     "id": "basics-classes-w",
     "q": "Add a read-only property hit_rate to Stats: hits divided by hits plus misses, and 0.0 when there have been no calls.",
     "starter": "from dataclasses import dataclass\n\n@dataclass\nclass Stats:\n    hits: int = 0\n    misses: int = 0\n\n    # add a property hit_rate: hits / (hits + misses), 0.0 when there are no calls\n\ns = Stats()\nprint(s.hit_rate)\ns.hits = 3\ns.misses = 1\nprint(s.hit_rate)",
     "solution": "from dataclasses import dataclass\n\n@dataclass\nclass Stats:\n    hits: int = 0\n    misses: int = 0\n\n    @property\n    def hit_rate(self):\n        total = self.hits + self.misses\n        return self.hits / total if total else 0.0\n\ns = Stats()\nprint(s.hit_rate)\ns.hits = 3\ns.misses = 1\nprint(s.hit_rate)",
     "hint": "Use @property and guard the division: return self.hits / total if total else 0.0.",
     "why": "A cache question often ends with 'how would you know it works?'. A hit rate is the first number you name."
    }
   ]
  },
  {
   "id": "basics-errors",
   "title": "with, try, except, finally",
   "blocks": [
    {
     "t": "p",
     "text": "`with` runs setup and guaranteed cleanup. `try/except/finally` handles failure. You need three facts: `finally` always runs, a bare `raise` re-raises the same error, and `with lock:` releases the lock even if the body raises."
    },
    {
     "t": "code",
     "id": "basics-errors-tour",
     "title": "Setup, failure, cleanup",
     "code": "class Guard:\n    def __enter__(self):\n        print(\"enter\")\n        return self\n\n    def __exit__(self, exc_type, exc, tb):\n        print(\"exit\", exc_type.__name__ if exc_type else None)\n        return False\n\ndef work(fail):\n    try:\n        with Guard():\n            if fail:\n                raise ValueError(\"boom\")\n            return \"ok\"\n    except ValueError:\n        print(\"caught\")\n        raise\n    finally:\n        print(\"finally\")\n\nfor fail in (False, True):\n    try:\n        print(work(fail))\n    except ValueError as e:\n        print(\"outer\", e)",
     "notes": {
      "2": "Runs when the with block starts. What it returns is the 'as' value.",
      "6": "Runs when the block ends, normally or by an error. Locks do their release here.",
      "8": "Do not swallow the error: let it keep travelling.",
      "18": "A bare raise re-raises the same exception with its original traceback."
     },
     "ask": {
      "q": "Click the two lines that run whether or not work() fails.",
      "lines": [
       7,
       20
      ],
      "why": "__exit__ runs when the with block ends, and finally runs when the whole try ends. Both run on the return path too. That is why a lock taken with `with` is never left held."
     }
    },
    {
     "t": "predict",
     "id": "basics-errors-p",
     "code": "class Guard:\n    def __enter__(self):\n        print(\"enter\")\n        return self\n\n    def __exit__(self, exc_type, exc, tb):\n        print(\"exit\", exc_type.__name__ if exc_type else None)\n        return False\n\ndef work(fail):\n    try:\n        with Guard():\n            if fail:\n                raise ValueError(\"boom\")\n            return \"ok\"\n    except ValueError:\n        print(\"caught\")\n        raise\n    finally:\n        print(\"finally\")\n\nfor fail in (False, True):\n    try:\n        print(work(fail))\n    except ValueError as e:\n        print(\"outer\", e)",
     "q": "Trace both calls. What is printed, in order?",
     "answer": "enter\nexit None\nfinally\nok\nenter\nexit ValueError\ncaught\nfinally\nouter boom",
     "why": "work(False): enter, exit None, finally, ok. work(True): enter, exit ValueError, caught, finally, then the re-raise reaches the outer handler: outer boom. The return inside the with still triggers exit and finally first."
    },
    {
     "t": "p",
     "text": "Where you will see it: `PriceCache.get_or_load` in `mock1_review/cache.py` takes its lock with `with self._lock:` (line 35), so an error in `loader()` (line 39) still releases it. In `app.py`, `get_profile` catches `TimeoutError` and returns a Guest dict. Look at what `get_or_load` then does with that value. In a review, say: 'the fallback gets cached as if it were the real profile'."
    },
    {
     "t": "mcq",
     "id": "basics-errors-mcq",
     "q": "Inside `with self._lock:` the loader raises an exception. What state is the lock in afterwards?",
     "o": [
      "Still held, so every later call blocks forever",
      "Released only if you wrote finally",
      "Held until the garbage collector runs",
      "Released, because with always runs the exit"
     ],
     "a": 3,
     "why": "This is the reason to use `with lock:` and not lock.acquire() / lock.release() by hand."
    },
    {
     "t": "write",
     "id": "basics-errors-w",
     "q": "load_user hides every error behind a Guest. Narrow it so only TimeoutError returns the Guest and any other error escapes.",
     "starter": "def load_user(loader):\n    try:\n        return loader()\n    except Exception:\n        return {\"name\": \"Guest\"}\n\ndef broken():\n    raise KeyError(\"no such user\")\n\ndef slow():\n    raise TimeoutError()\n\nprint(load_user(slow))\ntry:\n    load_user(broken)\n    print(\"hidden\")\nexcept KeyError:\n    print(\"escaped\")",
     "solution": "def load_user(loader):\n    try:\n        return loader()\n    except TimeoutError:\n        return {\"name\": \"Guest\"}\n\ndef broken():\n    raise KeyError(\"no such user\")\n\ndef slow():\n    raise TimeoutError()\n\nprint(load_user(slow))\ntry:\n    load_user(broken)\n    print(\"hidden\")\nexcept KeyError:\n    print(\"escaped\")",
     "hint": "Change `except Exception` to the one error you mean to handle.",
     "why": "Catching Exception around a loader turns real bugs (a KeyError, a bad query) into a polite Guest. Say it in the review: catch the specific error, and never cache the fallback."
    }
   ]
  },
  {
   "id": "basics-generators",
   "title": "Generators, briefly",
   "blocks": [
    {
     "t": "p",
     "text": "A function with `yield` hands back one item at a time and pauses between them. You will meet it as `(x for x in ...)` inside `sum` or `any`, and in code that streams chunks. One rule to hold: a generator can be walked once."
    },
    {
     "t": "code",
     "id": "basics-generators-tour",
     "title": "Chunks and a one-shot walk",
     "code": "def chunks(items, n):\n    for i in range(0, len(items), n):\n        yield items[i:i + n]\n\ngen = chunks([1, 2, 3, 4, 5], 2)\nprint(next(gen))\nprint(list(gen))\nprint(list(gen))\nprint(sum(x * x for x in range(4)))",
     "notes": {
      "3": "Hands back one slice and pauses here until the next item is asked for.",
      "6": "Asks for one item. Work runs up to the next yield.",
      "7": "list() drains whatever is left.",
      "9": "A generator expression: no brackets, no list built in memory."
     },
     "ask": {
      "q": "Click the line that makes chunks a generator rather than a normal function.",
      "lines": [
       3
      ],
      "why": "Any yield in the body turns the function into a generator. Calling it builds the generator without running the body."
     }
    },
    {
     "t": "predict",
     "id": "basics-generators-p",
     "code": "def chunks(items, n):\n    for i in range(0, len(items), n):\n        yield items[i:i + n]\n\ngen = chunks([1, 2, 3, 4, 5], 2)\nprint(next(gen))\nprint(list(gen))\nprint(list(gen))\nprint(sum(x * x for x in range(4)))",
     "q": "What do the four prints show? Note that the same generator is drained twice.",
     "answer": "[1, 2]\n[[3, 4], [5]]\n[]\n14",
     "why": "next gives [1, 2]. list(gen) drains the rest: [[3, 4], [5]]. The third print finds the generator already used up, so []. The sum is 0+1+4+9 = 14."
    },
    {
     "t": "p",
     "text": "This is also why a queue worker's loop is often `while True: item = q.get()`: it is a generator in disguise, producing work until a stop marker shows up (part 2)."
    },
    {
     "t": "write",
     "id": "basics-generators-w",
     "q": "Write a generator until(items, stop) that yields each item and ends at the first item equal to stop. It is the shape of a worker that reads from a queue until it sees a sentinel.",
     "starter": "def until(items, stop):\n    # yield items one by one, and stop at the first item equal to stop\n    ...\n\nprint(list(until([1, 2, None, 3], None)))\nprint(list(until([5, 6], None)))",
     "solution": "def until(items, stop):\n    for x in items:\n        if x == stop:\n            return\n        yield x\n\nprint(list(until([1, 2, None, 3], None)))\nprint(list(until([5, 6], None)))",
     "hint": "for x in items: if x == stop: return, otherwise yield x.",
     "why": "return inside a generator ends it. You will write the same stop check in a queue worker."
    }
   ]
  }
 ]
});
