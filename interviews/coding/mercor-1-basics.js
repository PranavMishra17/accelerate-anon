/* Mercor coding tab, part 1: Python, back in your hands. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "basics",
 "n": 1,
 "title": "Python, back in your hands",
 "minutes": 15,
 "lead": "After this part you can read the dict, OrderedDict and loader code in the mock code, and spot the delete-while-iterating and late-binding lambda bugs, without stopping to look things up.",
 "sections": [
  {
   "id": "basics-dicts",
   "title": "Dicts and sets, the workhorses",
   "blocks": [
    {
     "t": "p",
     "text": "A cache is a dict with rules. "
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
     "t": "write",
     "id": "basics-dicts-fix",
     "q": "Fix the loop so it removes zero-priced entries without crashing. It should print {'a': 5, 'c': 7}.",
     "starter": "prices = {\"a\": 5, \"b\": 0, \"c\": 7, \"d\": 0}\nfor key, value in prices.items():\n    if value == 0:\n        del prices[key]\nprint(prices)",
     "solution": "prices = {\"a\": 5, \"b\": 0, \"c\": 7, \"d\": 0}\nfor key in list(prices):\n    if prices[key] == 0:\n        del prices[key]\nprint(prices)",
     "hint": "Loop over list(prices) instead of prices.items().",
     "why": "A list copy of the keys is safe to walk while you delete from the dict. A dict comprehension that keeps the non-zero entries works too."
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
     "t": "predict",
     "id": "basics-lru-p",
     "code": "from collections import OrderedDict\n\ncache = OrderedDict()\n\ndef put(k, v):\n    cache[k] = v\n    cache.move_to_end(k)\n    if len(cache) > 2:\n        cache.popitem(last=False)\n\ndef get(k):\n    if k not in cache:\n        return None\n    cache.move_to_end(k)\n    return cache[k]\n\nput(\"a\", 1)\nput(\"b\", 2)\nget(\"a\")\nput(\"c\", 3)\nprint(list(cache), get(\"b\"))",
     "q": "A cache of size 2. What does the last line print?",
     "answer": "['a', 'c'] None",
     "why": "put a, put b: order a, b. get a moves a to the back: b, a. put c adds c and the size is 3, so the front (b) is evicted: a, c. get('b') is now None."
    }
   ]
  },
  {
   "id": "basics-closures",
   "title": "Functions, closures and the loader pattern",
   "blocks": [
    {
     "t": "p",
     "text": "A cache never knows how to load a value. The caller hands it a small function: 'call this if you miss'."
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
     "text": "The classic bug: a closure remembers the variable, not its value at that moment. If you build functions in a loop and call them after the loop, they all see the last value."
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
  }
 ]
});
