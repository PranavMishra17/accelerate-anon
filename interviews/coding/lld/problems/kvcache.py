"""Key-value cache, built in layers: a dict, then a TTL, then LRU capacity; thread safety is the extension.
Two classes (Entry, Cache). The layers are the requirements, in the order the interviewer adds them."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


PUT = method('''
    def put(self, key: str, value, ttl: float | None = None) -> None:
        """
        Core logic:
          1. Work out when the entry expires: now plus its ttl, or the default ttl
          2. Store it and mark the key most recently used
          3. If the cache is over capacity, drop the least recently used key
        Edge cases:
          1. Key already present -> replace the value and restart its ttl
          2. ttl of zero or less -> error
        """
        ttl = self.default_ttl if ttl is None else ttl
        if ttl is not None and ttl <= 0:
            raise ValueError("ttl must be positive")
        expires_at = None if ttl is None else self.now() + ttl
        self.entries[key] = Entry(value, expires_at)
        self.entries.move_to_end(key)
        while len(self.entries) > self.capacity:
            self.entries.popitem(last=False)
''')

GET = method('''
    def get(self, key: str):
        """
        Core logic:
          1. Look the key up
          2. If it has expired, remove it and treat it as missing
          3. Otherwise mark it most recently used and return the value
        Edge cases:
          1. Missing key -> None (values are never None)
        """
        entry = self.entries.get(key)
        if entry is None:
            return None
        if entry.is_expired(self.now()):
            del self.entries[key]
            return None
        self.entries.move_to_end(key)
        return entry.value
''')

DELETE = method('''
    def delete(self, key: str) -> bool:
        """
        Core logic:
          1. Remove the key if it is there
          2. Say whether anything was removed
        Edge cases:
          1. Missing key -> False
        """
        return self.entries.pop(key, None) is not None
''')

SIZE = method('''
    def size(self) -> int:
        """
        Core logic:
          1. Count the entries held
        Edge cases:
          1. Expired entries nobody has touched yet still count
        """
        return len(self.entries)
''')

HEAD = D('''\
    import time
    from collections import OrderedDict


    class Entry:
        def __init__(self, value, expires_at: float | None):
            self.value = value
            self.expires_at = expires_at         # None means it never expires

        def is_expired(self, now: float) -> bool:
            return self.expires_at is not None and now >= self.expires_at
    ''')

CACHE = D('''\


    class Cache:
        def __init__(self, capacity: int, default_ttl: float | None = None, now=time.monotonic):
            if capacity < 1:
                raise ValueError("capacity must be at least 1")
            self.capacity = capacity
            self.default_ttl = default_ttl
            self.now = now                       # a clock we can fake in a test
            self.entries = OrderedDict()         # key -> Entry, least recently used first
    ''')

CORE = HEAD + CACHE + in_class(PUT, GET, DELETE, SIZE)

DEMO = D('''\


    # ---- a quick run ----
    class FakeClock:
        def __init__(self):
            self.t = 0.0

        def __call__(self):
            return self.t


    clock = FakeClock()
    cache = Cache(capacity=2, default_ttl=10, now=clock)
    cache.put("a", 1)
    cache.put("b", 2)
    cache.get("a")                               # a is now the most recently used
    cache.put("c", 3)                            # over capacity: b is the least recently used
    print(cache.get("b"), cache.get("a"), cache.get("c"))
    clock.t += 11
    print(cache.get("a"), cache.size())          # a expired; c is expired too but untouched
    cache.put("d", 4, ttl=100)
    clock.t += 50
    print(cache.get("d"), cache.get("c"))
    ''')
DEMO_OUT = "None 1 3\nNone 1\n4 None\n"

# ---- extensions ----
EXT_LOCK = D('''\
    import threading


    class Cache:
        def __init__(self, capacity, default_ttl=None, now=time.monotonic):
            ...
            self.lock = threading.Lock()

        def get(self, key):
            with self.lock:              # get changes the order, so reads lock too
                entry = self.entries.get(key)
                ...

        def put(self, key, value, ttl=None):
            with self.lock:
                ...

        # delete and size take the lock the same way
    ''')

PUT_LOCKED = method('''
    def put(self, key: str, value, ttl: float | None = None) -> None:
        ttl = self.default_ttl if ttl is None else ttl
        if ttl is not None and ttl <= 0:
            raise ValueError("ttl must be positive")
        with self.lock:
            expires_at = None if ttl is None else self.now() + ttl
            self.entries[key] = Entry(value, expires_at)
            self.entries.move_to_end(key)
            while len(self.entries) > self.capacity:
                self.entries.popitem(last=False)
''')

GET_LOCKED = method('''
    def get(self, key: str):
        with self.lock:                      # get changes the order, so reads lock too
            entry = self.entries.get(key)
            if entry is None:
                return None
            if entry.is_expired(self.now()):
                del self.entries[key]
                return None
            self.entries.move_to_end(key)
            return entry.value
''')

DELETE_LOCKED = method('''
    def delete(self, key: str) -> bool:
        with self.lock:
            return self.entries.pop(key, None) is not None
''')

SIZE_LOCKED = method('''
    def size(self) -> int:
        with self.lock:
            return len(self.entries)
''')

PURGE = method('''
    def purge_expired(self) -> int:
        """Drop every expired entry and say how many. A timer or a background thread calls this."""
        with self.lock:
            now = self.now()
            dead = [k for k, e in self.entries.items() if e.is_expired(now)]
            for k in dead:
                del self.entries[k]
            return len(dead)
''')

HEAD_FINAL = HEAD.replace("import time\n", "import threading\nimport time\n")
CACHE_FINAL = CACHE.replace("        self.entries = OrderedDict()         # key -> Entry, least recently used first\n",
                            "        self.entries = OrderedDict()         # key -> Entry, least recently used first\n"
                            "        self.lock = threading.Lock()         # one lock around every change\n")
FINAL = HEAD_FINAL + CACHE_FINAL + in_class(PUT_LOCKED, GET_LOCKED, DELETE_LOCKED, SIZE_LOCKED, PURGE)
FINAL_DEMO = D('''\


    # ---- a quick run ----
    class FakeClock:
        def __init__(self):
            self.t = 0.0

        def __call__(self):
            return self.t


    def hammer(cache, base):
        for i in range(1000):
            cache.put(f"{base}-{i}", i)
            cache.get(f"{base}-{i // 2}")


    clock = FakeClock()
    cache = Cache(capacity=100, default_ttl=10, now=clock)
    threads = [threading.Thread(target=hammer, args=(cache, n)) for n in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print(cache.size())
    clock.t += 11
    print(cache.purge_expired(), cache.size())
    ''')
FINAL_OUT = "100\n100 0\n"

PROBLEM = {
    "id": "kvcache", "title": "A key-value cache", "part_id": "lld-kvstore", "n": 7,
    "part_title": "A key-value cache, built in layers", "minutes": 40,
    "lead": "A cache grows one layer at a time: a dict, then a TTL, then an LRU capacity, then thread safety when the interviewer asks. A full round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design, e) implementation, f) extensibility. Two classes. Try each box before you open the answer.",
    "prompt": "Design an in-memory key-value cache. Then add a time to live, then a capacity with least recently used eviction.",
    "evidence": "Reported in Amazon rounds as a cache that starts as a dict and gains layers every few minutes: expiry, then capacity with LRU, then threads.",
    "drill": "part 7, a key-value cache built in layers.",

    "clarify": {
        "capabilities": [("What operations?", "put a key and value, get by key, delete, and how many entries there are"),
                         ("What is the time to live measured from?", "From the put. A default for the cache, and a put can override it"),
                         ("What counts toward capacity, and what is evicted?", "The number of keys. Evict the least recently used one; a get and a put both count as a use")],
        "errors": [("What does get return for a missing or expired key?", "None. Values are never None"),
                   ("Put on a key that exists?", "Replace the value and restart its time to live"),
                   ("A bad capacity or a time to live of zero?", "Reject it with an error")],
        "scope": [("Do expired entries have to disappear on their own?", "No. Expiry is checked when a key is touched"),
                  ("Threads, persistence, a network?", "Start single-threaded. Threads are a follow-up. No persistence, no network")],
    },
    "clarify_hint": "The operations, what the ttl counts from, what capacity counts. Missing, expired, put on an existing key, bad numbers. Does expiry need a background job? Threads?",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** I ask what the time to live counts from and what capacity counts, because each one is a layer. Then missing and expired keys, and last whether expiry needs a background job or threads.",
    "clarify_why": "Each answer is a layer. A ttl gives an expiry on each entry, capacity gives an ordered dict, and 'checked when touched' means no background thread yet.",
    "answers": "put, get, delete and a count of entries. The time to live counts from the put: one default, and a put can override it. Capacity counts keys, and the least recently used key goes first; reads and writes both count as a use. A missing or expired key returns None. A put on an existing key replaces the value and restarts its ttl. A bad capacity or a ttl of zero is an error. Expiry is checked when a key is touched, not by a background job. Single-threaded to start; threads are a follow-up.",
    "playback": ["Thanks, that's clear. **So: a dict that expires entries when they are touched and evicts the least recently used key when it is full.** Out of scope: persistence, networking, a background thread for expiry. Threads come as the follow-up."],

    "requirements": [
        ["User stores a value under a key.", "The system keeps it with an expiry time (the put's ttl, else the default)", "A put on an existing key replaces it and restarts the ttl; a ttl of zero or less is an error"],
        ["User reads a key.", "The system returns the value and marks the key most recently used", "A missing or expired key returns None; an expired one is removed"],
        ["The cache holds at most a set number of keys.", "A put that goes over drops the least recently used key", "A capacity under 1 is an error"],
        ["User deletes a key or asks how many entries there are.", "Delete says whether the key was there", "Expired entries that nobody touched still count"],
    ],
    "out_of_scope": ["persistence and networking", "a background thread that removes expired entries", "threads (an extension)", "values that are None"],
    "req_hint": "Store with an expiry, read, the capacity limit, delete and count.",
    "req_say": "From your answers I get four requirements. **Each one is a layer or a method: put with a ttl, get, the capacity limit inside put, and delete with size.** I say the error case with each one, like a ttl of zero.",
    "req_why": "Each requirement is a layer or a method: 1 is put and the ttl, 2 is get, 3 is the LRU in put, 4 is delete and size.",

    "entities": [("User / caller", False, "External; not modelled"),
                 ("Key and value", False, "A string and anything else; they sit in the dict, not in classes"),
                 ("Entry", True, "A value and when it expires, so expiry is per entry"),
                 ("Cache", True, "Holds the entries in recency order and runs put, get, delete"),
                 ("Clock", False, "A function passed in, so a test can fake time; not a class"),
                 ("Eviction policy", False, "Only LRU is asked for; it becomes a class only if another policy is requested")],
    "ent_hint": "What does an entry need besides its value? Is the clock a class? Is the eviction policy one?",
    "ent_say": "I underline the nouns. **An entry stays, because expiry belongs to each value, and the cache stays to hold them in order.** Keys and values sit in the dict, the clock is a function I pass in, and eviction is a line in put. None of those earns a class yet.",
    "ent_why": "Two classes. The clock is a function and eviction is a line in put; neither earns a class until the requirements force it.",

    "classes": [
        {"name": "Cache", "state": ["capacity: int  # put compares the size to this to evict",
                                    "default_ttl: seconds | None  # used when a put gives no ttl",
                                    "now: function returning seconds  # a passed-in clock, so time can be faked",
                                    "entries: OrderedDict<key, Entry>  (least recently used first)  # lookup by key, and order is the LRU"],
         "behaviour": ["put(key, value, ttl) -> void | error  # req 1 and 3: store, then evict if over capacity",
                       "get(key) -> value | None  # req 2: miss, expiry, and marks a use",
                       "delete(key) -> boolean  # req 4: says whether the key was there",
                       "size() -> int  # req 4: expired but untouched entries still count"]},
        {"name": "Entry", "state": ["value: any  # what the caller stored",
                                    "expires_at: seconds | None  # expiry is per entry, set at put"],
         "behaviour": ["is_expired(now) -> boolean  # get asks the entry, not the cache"]},
    ],
    "class_hint": "Cache holds an ordered dict of entries and a clock. An entry holds a value and an expiry time.",
    "class_say": "**I start from the four methods and ask what each one has to read.** Get and put find a key, so the cache keeps a dict of entries. Eviction needs the least recently used key, so an ordered dict gives me both lookup and order. Expiry needs the time, so I pass in a clock, and each entry stores when it expires.",
    "class_why": "An ordered dict is the whole LRU: the front is the oldest use, move_to_end marks a use, and popitem from the front evicts.",
    "class_qa": [{"ask": "Why an OrderedDict and not a dict plus a list of keys?",
                  "say": "Because the list makes every get O(n): finding the key to move. **An ordered dict does the lookup, the move to the end and the eviction from the front all in O(1),** and that's all LRU needs.",
                  "explain": ["Since Python 3.7 a plain dict keeps insertion order, but it has no move_to_end, so a use cannot reorder it cheaply."]}],

    "map": {"center": ("Cache", "put, get, delete, size"),
            "owned": [("Entry", "value, expires_at")],
            "uses": [("OrderedDict", "recency order"), ("now()", "the clock, a function")]},

    "methods": [
        {"name": "put", "q": "put(key, value, ttl): core logic and edge cases as comments, then the code.",
         "hint": "Work out the expiry, store, move to the end, drop from the front while over capacity. Edges: replace, ttl of zero.", "code": PUT,
         "why": "Replacing a key moves it to the end too, so a put counts as a use. The loop is a while because capacity never changes, but it is harmless."},
        {"name": "get", "q": "get(key): core logic, edge cases, code.",
         "hint": "Look up, check expiry, mark used, return. Edge: missing.", "code": GET,
         "why": "An expired key is removed on the read, which is why size() can count dead entries. A hit changes the order, which matters for threads."},
        {"name": "delete", "q": "delete(key): what does it return?",
         "hint": "Pop the key; say whether it was there.", "code": DELETE,
         "why": "pop with a default never raises, and the boolean tells the caller whether anything happened."},
        {"name": "size", "q": "size(): what does it count?",
         "hint": "The entries held. Say what that includes.", "code": SIZE,
         "why": "It includes expired entries nobody touched. Say it before they ask."},
    ],

    "extensions": [
        {"ask": "Now several threads use the cache at once. What goes wrong and what do you do?",
         "say": "Move to end and pop from the front are not atomic, and **even get changes the order, so reads need the lock too.** One lock around each public method keeps it simple and correct. Contention is the cost.",
         "explain": ["A reader-writer lock does not help here, because every read is also a write to the order."],
         "code": EXT_LOCK, "code_title": "Thread safety: one lock, taken by every public method",
         "short_q": "Several threads", "short_a": "one lock around every public method, reads too, because get reorders"},
        {"ask": "Expired entries pile up if nobody reads them. How do you clean up?",
         "say": "Add purge_expired(), which drops every expired entry and returns how many. **Something calls it on a timer,** a background thread or the caller. Until then, size counts them and LRU still bounds memory.",
         "short_q": "Expired entries pile up", "short_a": "purge_expired() on a timer; LRU still bounds memory meanwhile"},
        {"ask": "Evict the least frequently used key instead. What changes?",
         "say": "The eviction line. **Pull it into one small class with two calls, on_use(key) and victim(),** and let the cache ask it. LRU keeps order, LFU keeps counts. Put and get stay the same.",
         "short_q": "Another eviction policy", "short_a": "pull eviction into a policy with on_use(key) and victim(); the cache asks it"},
        {"ask": "On a miss, load the value from a database. Many callers miss the same key at once.",
         "say": "Add get_or_load(key, loader). **Only the first caller runs the loader; the others wait for its result** (a per-key lock or a pending future), so one popular key does not send a hundred queries.",
         "short_q": "Load on a miss", "short_a": "get_or_load(key, loader); one caller loads, the rest wait on it"},
    ],
    "faq": [("Why now >= expires_at and not >?", "A ttl of 10 should mean gone at exactly 10 seconds. Say which you chose."),
            ("A different ttl for each key?", "Already there: the put's ttl overrides the default.")],

    "summary": ["**Two classes.** The Cache holds an ordered dict of entries, least recently used first. put stores the value with an expiry and drops the front entry when it is over capacity; get removes an expired key, or marks a live one used. An Entry holds a value and its expiry time, and the clock is a function we pass in.",
                "**It grows by layer:** one lock around every method for threads (reads too, because get reorders), a purge for entries nobody touches, an eviction policy pulled out if LFU is asked for, and a loader so one miss fills the key once."],

    "golden": [
        ("Build the layers in order: a dict, then expiry, then capacity. Say what each one costs.", "interviewers add layers on purpose, and over-building layer three first is the common failure."),
        ("An OrderedDict is the whole LRU: move_to_end on a use, popitem from the front to evict.", "every operation stays O(1), and it is five lines instead of a linked list."),
        ("Time is a function passed in, so the demo and the tests fake it.", "ttl logic cannot be shown any other way without sleeping."),
        ("Expiry is checked when a key is touched, and size() admits that expired entries count.", "it follows the agreed scope and shows you know the edge before they ask."),
        ("Even get takes the lock, because it reorders.", "it is the senior answer to threads: reads are writes here."),
        ("Each extension changes one place: a lock, a purge, a policy, a loader.", "it shows the design stayed small and open."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with thread safety and the expiry purge applied, and a run at the bottom: eight threads hammer a small cache, then the fake clock moves past the ttl.",
    "final_title": "kvcache.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "100 (eight threads wrote 8,000 keys into a cache of 100, and it never went over), then purge_expired removed all 100 and left 0 after the clock moved past the ttl.",
}
