"""Key-value cache, built in layers: a dict, then a TTL, then LRU capacity; thread safety is the extension.
Two classes (Node, Cache). The recency list is a doubly linked list with sentinel ends, beside a dict key -> node.
The layers are the requirements, in the order the interviewer adds them."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the cache: put and get, the two operations that matter ----
PUT = method('''
    def put(self, key: str, value, ttl: float | None = None) -> None:
        """
        Core logic:
          1. Work out when the entry expires: now plus its ttl, or the default ttl
          2. Key already present: replace the value and expiry, and mark it most recently used
          3. Otherwise add a new node at the front of the list and in the dict
          4. If the cache is over capacity, evict the least recently used node
        Edge cases:
          1. Key already present -> replace the value and restart its ttl
          2. ttl of zero or less -> error
        """
        ttl = self.default_ttl if ttl is None else ttl     # Step 1: a put's own ttl beats the default
        if ttl is not None and ttl <= 0:                   # Edge 2: would be expired on arrival
            raise ValueError("ttl must be positive")
        expires_at = None if ttl is None else self.now() + ttl     # an absolute time, so get compares to now
        node = self.nodes.get(key)
        if node is not None:                               # Step 2 / Edge 1: same node, new value, ttl restarts
            node.value, node.expires_at = value, expires_at
            self._move_to_front(node)                      # a put counts as a use
            return
        node = Node(key, value, expires_at)                # Step 3: the node carries its key, so eviction can find the dict entry
        self.nodes[key] = node
        self._add_to_front(node)
        if len(self.nodes) > self.capacity:                # Step 4: at most one over, since each put adds one
            self._evict_lru()
''')

GET = method('''
    def get(self, key: str):
        """
        Core logic:
          1. Look the key up in the dict
          2. If it has expired, remove it and treat it as missing
          3. Otherwise move it to the front and return the value
        Edge cases:
          1. Missing key -> None (values are never None)
        """
        node = self.nodes.get(key)                         # Step 1: O(1), .get gives None instead of a KeyError
        if node is None:                                   # Edge 1
            return None
        if node.is_expired(self.now()):                    # Step 2: the node knows its own expiry
            self._drop(node)                               # remove it on this read; no background job
            return None
        self._move_to_front(node)                          # Step 3: a read counts as a use
        return node.value
''')

# ---- the recency list: the part that is the LRU ----
MOVE_TO_FRONT = method('''
    def _move_to_front(self, node: Node) -> None:
        """Mark a node most recently used: unlink it, then put it first."""
        self._remove(node)
        self._add_to_front(node)
''')

EVICT_LRU = method('''
    def _evict_lru(self) -> None:
        """
        Core logic:
          1. The least recently used node is the one right before the tail
          2. Unlink it and delete its key from the dict
        Edge cases:
          1. Called on an empty list -> never: capacity is at least 1 and put calls it only when over
        """
        lru = self.tail.prev                               # Step 1: the back of the list is the oldest use
        self._drop(lru)                                    # Step 2: both structures, or the dict would keep a dead node
''')

ADD_TO_FRONT = method('''
    def _add_to_front(self, node: Node) -> None:
        """
        Core logic:
          1. Point the node at the old first node and at the head
          2. Point the head and the old first node back at it
        Edge cases:
          1. Empty list -> the old first node is the tail, and the same four links work
        """
        first = self.head.next                             # the sentinels mean first always exists
        node.prev, node.next = self.head, first            # Step 1
        self.head.next = node                              # Step 2: four links in all, order matters
        first.prev = node
''')

REMOVE = method('''
    def _remove(self, node: Node) -> None:
        """
        Core logic:
          1. Link the node's neighbours to each other
        Edge cases:
          1. First or last real node -> its neighbour is a sentinel, so there is no special case
        """
        node.prev.next = node.next                         # skip over the node in both directions
        node.next.prev = node.prev
''')

HELPERS = method('''
    def _drop(self, node: Node) -> None:
        self._remove(node)                                 # out of the list...
        del self.nodes[node.key]                           # ...and out of the dict

    def delete(self, key: str) -> bool:
        """
        Core logic:
          1. Remove the key if it is there
          2. Say whether anything was removed
        Edge cases:
          1. Missing key -> False
        """
        node = self.nodes.get(key)
        if node is None:                                   # Edge 1
            return False
        self._drop(node)
        return True

    def size(self) -> int:
        """
        Core logic:
          1. Count the entries held
        Edge cases:
          1. Expired entries nobody has touched yet still count
        """
        return len(self.nodes)                             # no scan for expired ones: that is Edge 1, by design
''')

HEAD = D('''\
    import time


    class Node:
        """One cache entry and its place in the recency list: a value, when it expires, and its two neighbours."""

        def __init__(self, key, value, expires_at: float | None):
            self.key = key                       # eviction knows only the node, so it needs the key to leave the dict
            self.value = value
            self.expires_at = expires_at         # None means it never expires
            self.prev = None                     # towards the most recently used end
            self.next = None                     # towards the least recently used end

        def is_expired(self, now: float) -> bool:
            # >= so a ttl of 10 means gone at exactly 10 seconds
            return self.expires_at is not None and now >= self.expires_at
    ''')

CACHE = D('''\


    class Cache:
        """A dict for lookup and a doubly linked list for recency: the front is the latest use, the back is the oldest."""

        def __init__(self, capacity: int, default_ttl: float | None = None, now=time.monotonic):
            if capacity < 1:                     # a cache that holds nothing makes put meaningless
                raise ValueError("capacity must be at least 1")
            self.capacity = capacity             # put compares the size to this to evict
            self.default_ttl = default_ttl       # used when a put gives no ttl
            self.now = now                       # a clock we can fake in a test
            self.nodes = {}                      # key -> Node: O(1) lookup
            self.head = Node(None, None, None)   # sentinels, so no link is ever None and no edge case exists
            self.tail = Node(None, None, None)
            self.head.next = self.tail           # empty list: head and tail point at each other
            self.tail.prev = self.head
    ''')

CORE = HEAD + CACHE + in_class(PUT, GET, MOVE_TO_FRONT, EVICT_LRU, ADD_TO_FRONT, REMOVE, HELPERS)

DEMO = D('''\


    # ---- a quick run ----
    class FakeClock:                             # time we move by hand, so the run needs no sleeping
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
    clock.t += 11                                # past the default ttl of 10
    print(cache.get("a"), cache.size())          # a expired; c is expired too but untouched
    cache.put("d", 4, ttl=100)                   # this put overrides the default ttl
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
            self.lock = threading.Lock()    # one lock for the whole cache

        def get(self, key):
            with self.lock:              # get changes the list, so reads lock too
                node = self.nodes.get(key)
                ...

        def put(self, key, value, ttl=None):
            with self.lock:              # find, store and evict as one step
                ...

        # delete and size take the lock the same way
    ''')

PUT_LOCKED = method('''
    def put(self, key: str, value, ttl: float | None = None) -> None:
        """Same steps; the store and the eviction happen under one lock."""
        ttl = self.default_ttl if ttl is None else ttl
        if ttl is not None and ttl <= 0:                   # checked before the lock: it touches no shared state
            raise ValueError("ttl must be positive")
        with self.lock:                                    # store and evict as one step
            expires_at = None if ttl is None else self.now() + ttl
            node = self.nodes.get(key)
            if node is not None:
                node.value, node.expires_at = value, expires_at
                self._move_to_front(node)
                return
            node = Node(key, value, expires_at)
            self.nodes[key] = node
            self._add_to_front(node)
            if len(self.nodes) > self.capacity:            # inside the lock, so no thread sees it over capacity
                self._evict_lru()
''')

GET_LOCKED = method('''
    def get(self, key: str):
        """Same steps; the whole read is under the lock because a hit reorders."""
        with self.lock:                      # get changes the list, so reads lock too
            node = self.nodes.get(key)
            if node is None:
                return None
            if node.is_expired(self.now()):
                self._drop(node)             # removing is a write too
                return None
            self._move_to_front(node)
            return node.value
''')

HELPERS_LOCKED = method('''
    def _drop(self, node: Node) -> None:
        self._remove(node)                                 # callers already hold the lock
        del self.nodes[node.key]

    def delete(self, key: str) -> bool:
        """Same steps, under the lock."""
        with self.lock:
            node = self.nodes.get(key)
            if node is None:
                return False
            self._drop(node)
            return True

    def size(self) -> int:
        """Same steps, under the lock so the count never lands mid-change."""
        with self.lock:
            return len(self.nodes)
''')

PURGE = method('''
    def purge_expired(self) -> int:
        """Drop every expired entry and say how many. A timer or a background thread calls this."""
        with self.lock:
            now = self.now()                               # read the clock once, so every entry is judged at one moment
            # collect first: unlinking while looping over the dict would change it under the loop
            dead = [n for n in self.nodes.values() if n.is_expired(now)]
            for n in dead:
                self._drop(n)
            return len(dead)                               # lets the caller log how much was cleaned
''')

HEAD_FINAL = HEAD.replace("import time\n", "import threading\nimport time\n")
CACHE_FINAL = CACHE.replace("        self.tail.prev = self.head\n",
                            "        self.tail.prev = self.head\n"
                            "            self.lock = threading.Lock()         # one lock around every change\n"
                            .replace("            self.lock", "        self.lock"))
FINAL = HEAD_FINAL + CACHE_FINAL + in_class(PUT_LOCKED, GET_LOCKED, MOVE_TO_FRONT, EVICT_LRU, ADD_TO_FRONT, REMOVE,
                                           HELPERS_LOCKED, PURGE)
FINAL_DEMO = D('''\


    # ---- a quick run ----
    class FakeClock:                             # time we move by hand, so the run needs no sleeping
        def __init__(self):
            self.t = 0.0

        def __call__(self):
            return self.t


    def hammer(cache, base):                     # each thread writes its own keys and reads recent ones
        for i in range(1000):
            cache.put(f"{base}-{i}", i)
            cache.get(f"{base}-{i // 2}")


    clock = FakeClock()
    cache = Cache(capacity=100, default_ttl=10, now=clock)
    threads = [threading.Thread(target=hammer, args=(cache, n)) for n in range(8)]    # 8 threads, one shared cache
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print(cache.size())
    clock.t += 11                                # every entry is now past its ttl
    print(cache.purge_expired(), cache.size())
    ''')
FINAL_OUT = "100\n100 0\n"

PROBLEM = {
    "id": "kvcache", "title": "A key-value cache", "part_id": "lld-kvstore", "n": 7,
    "part_title": "A key-value cache, built in layers", "minutes": 40,
    "lead": "A cache grows one layer at a time: a dict, then a TTL, then an LRU capacity, then thread safety when the interviewer asks. A full round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design, e) implementation, f) extensibility. Two classes. The LRU is a doubly linked list you write, beside the dict. Try each box before you open the answer.",
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
    "clarify_why": "Each answer is a layer. A ttl gives an expiry on each entry, capacity gives a recency list that evicts from one end, and 'checked when touched' means no background thread yet.",
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
    "req_why": "Each requirement is a layer or a method: 1 is put and the ttl, 2 is get, 3 is the LRU eviction in put, 4 is delete and size.",

    "entities": [("User / caller", False, "External; not modelled"),
                 ("Key and value", False, "A string and anything else; the key is the dict key, the value sits in the node"),
                 ("Entry / list node", True, "A value, when it expires, its key and two neighbours; one class, so the dict and the list share the same object"),
                 ("Cache", True, "Holds the dict and the list, and runs put, get, delete"),
                 ("Clock", False, "A function passed in, so a test can fake time; not a class"),
                 ("Eviction policy", False, "Only LRU is asked for; it becomes a class only if another policy is requested")],
    "ent_hint": "What does an entry need besides its value? What does the recency list need from each entry? Is the clock a class?",
    "ent_say": "I underline the nouns. **The entry stays, and it doubles as the list node, because expiry belongs to each value and the list links the same objects the dict finds.** The cache stays to hold them. Keys and values sit in the dict, the clock is a function I pass in, and eviction is a method, not a class, until a second policy is asked for.",
    "ent_why": "Two classes. One Node serves as entry and list node, so a dict hit gives the node to move in O(1). The clock is a function and eviction is a method; neither earns a class yet.",

    "classes": [
        {"name": "Cache", "state": ["capacity: int  # put compares the size to this to evict",
                                    "default_ttl: seconds | None  # used when a put gives no ttl",
                                    "now: function returning seconds  # a passed-in clock, so time can be faked",
                                    "nodes: Map<key, Node>  # O(1) lookup, and the way back from a node to its key",
                                    "head, tail: Node  (sentinels)  # list ends that are never real entries, so no edge cases",
                                    "(list order)  # head.next is the most recently used, tail.prev the least"],
         "behaviour": ["put(key, value, ttl) -> void | error  # req 1 and 3: store, then evict if over capacity",
                       "get(key) -> value | None  # req 2: miss, expiry, and marks a use",
                       "delete(key) -> boolean  # req 4: says whether the key was there",
                       "size() -> int  # req 4: expired but untouched entries still count",
                       "_move_to_front(node) -> void  # a use: unlink, then add first",
                       "_evict_lru() -> void  # the node before the tail goes, from list and dict",
                       "_add_to_front(node), _remove(node) -> void  # the two list operations"]},
        {"name": "Node", "state": ["key: any  # eviction finds the dict entry from the node",
                                   "value: any  # what the caller stored",
                                   "expires_at: seconds | None  # expiry is per entry, set at put",
                                   "prev, next: Node  # the neighbours in the recency list"],
         "behaviour": ["is_expired(now) -> boolean  # get asks the node, not the cache"]},
    ],
    "class_hint": "Cache holds a dict of nodes, a clock, and a list with a sentinel at each end. A node holds a key, a value, an expiry time and two neighbours.",
    "class_say": "**I start from the four methods and ask what each one has to read.** Get and put find a key in O(1), so the cache keeps a dict of nodes. Eviction needs the least recently used key and a use needs to move an entry to the other end, both in O(1), so the nodes also form a doubly linked list. Expiry needs the time, so I pass in a clock, and each node stores when it expires.",
    "class_why": "The dict finds a node, the list orders the nodes, and both point at the same objects. Sentinels at both ends remove every empty-list and end-of-list case.",
    "class_qa": [{"ask": "Why a dict and a linked list, and not a dict plus a list of keys?",
                  "say": "Because the list makes every get O(n): finding the key to move. **The dict gives me the node, and the node already knows its neighbours, so unlinking it and putting it first is O(1).** Eviction is O(1) too: the node before the tail.",
                  "explain": ["The list has to be doubly linked: unlinking a node needs its previous neighbour without a scan."]},
                 {"ask": "Why sentinel nodes at the head and the tail?",
                  "say": "So no link is ever None. **Adding to an empty list and removing the first or last node run the same lines as any other case,** which is where hand-written linked lists usually break."}],

    "map": {"center": ("Cache", "put, get, delete, size"),
            "owned": [("Node", "key, value, prev, next")],
            "uses": [("Dict", "key -> Node"), ("now()", "the clock, a function")]},

    "skeleton": {"q": "First the small pieces: Node and the cache's __init__, with the two sentinels linked to each other. Each line from the class design.",
                 "hint": "Node holds a key, a value, an expiry and two neighbours, and answers is_expired. The cache holds a capacity, a default ttl, a clock, a dict, and a head and tail node pointing at each other.",
                 "code": HEAD + CACHE,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "put", "q": "Start with the most interesting method: put(key, value, ttl). Core logic and edge cases as comments, then the code. Name the list work as helpers.",
         "hint": "Work out the expiry. Existing key: update it and self._move_to_front(node). New key: make a node, add it to the dict and the front, and self._evict_lru() if over capacity. Edges: replace, ttl of zero.", "code": PUT,
         "why": "Replacing a key moves it to the front too, so a put counts as a use. The list work has names here, and gets its own boxes next."},
        {"name": "get", "q": "get(key): core logic, edge cases, code.",
         "hint": "Look up, check expiry, move to the front, return. Edge: missing.", "code": GET,
         "why": "An expired key is removed on the read, which is why size() can count dead entries. A hit changes the order, which matters for threads."},
        {"name": "_move_to_front", "q": "_move_to_front(node): what is a use, in terms of the list?",
         "hint": "Unlink the node, then add it first.", "code": MOVE_TO_FRONT,
         "why": "Two calls to the list operations, so there is one place that says what a use means."},
        {"name": "_evict_lru", "q": "_evict_lru(): which node goes, and what must you remove it from?",
         "hint": "The node right before the tail. Both the list and the dict.", "code": EVICT_LRU,
         "why": "The LRU is O(1) because the oldest use is always at the back. Forgetting the dict entry leaves a dead node that get would still find."},
        {"name": "_add_to_front", "q": "_add_to_front(node): link it between the head and the old first node.",
         "hint": "Four links: the node's prev and next, the head's next, the old first node's prev.", "code": ADD_TO_FRONT,
         "why": "Because of the sentinels the old first node always exists, even in an empty list."},
        {"name": "_remove", "q": "_remove(node): unlink it from the list.",
         "hint": "Join its two neighbours to each other.", "code": REMOVE,
         "why": "Two lines, and no case for the first or last node: their neighbours are sentinels."},
    ],
    "helpers": {"q": "Last, the plain ones: _drop, delete and size.",
                "starter": "def _drop(self, node):\n    ...\n",
                "hint": "_drop unlinks the node and deletes its key from the dict. delete finds the node and drops it. size is the dict length.",
                "code": HELPERS,
                "why": "_drop is the one way a node leaves, so list and dict never disagree. size includes expired entries nobody touched. Say it before they ask."},

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Node knows its own expiry; Cache owns the dict, the list order, the capacity and put, get, delete, size."),
            ("Open/closed", "Today a new eviction rule edits _evict_lru and _move_to_front. Pulling eviction into a policy makes it a new class instead."),
            ("Liskov substitution", "Nothing to substitute yet: no subclasses. An LFU policy would have to honour on_use and victim like the LRU one."),
            ("Interface segregation", "Nothing to segregate yet: no interfaces, and callers use all four public Cache methods."),
            ("Dependency inversion", "Cache is handed its clock now instead of calling time itself; eviction is still built in."),
        ],
        "varies": [
            ("The eviction policy (LFU)", "Strategy", "a policy with on_use(key) and victim() that Cache asks"),
            ("Several threads", "No pattern: a lock", "self.lock around every public method, reads too"),
            ("Expired entries piling up", "No pattern: a method", "purge_expired() called on a timer"),
            ("Load on a miss", "No pattern: a function passed in", "get_or_load(key, loader), one caller loads and the rest wait"),
        ],
    },
    "extensions": [
        {"ask": "Now several threads use the cache at once. What goes wrong and what do you do?",
         "say": "Unlinking and relinking a node, and the dict update beside it, are not atomic, and **even get changes the list, so reads need the lock too.** One lock around each public method keeps it simple and correct. Contention is the cost.",
         "explain": ["A reader-writer lock does not help here, because every read is also a write to the list."],
         "code": EXT_LOCK, "code_title": "Thread safety: one lock, taken by every public method",
         "short_q": "Several threads", "short_a": "one lock around every public method, reads too, because get reorders"},
        {"ask": "Expired entries pile up if nobody reads them. How do you clean up?",
         "say": "Add purge_expired(), which drops every expired entry and returns how many. **Something calls it on a timer,** a background thread or the caller. Until then, size counts them and LRU still bounds memory.",
         "short_q": "Expired entries pile up", "short_a": "purge_expired() on a timer; LRU still bounds memory meanwhile"},
        {"ask": "Evict the least frequently used key instead. What changes?",
         "say": "The eviction methods. **Pull them into one small class with two calls, on_use(key) and victim(),** and let the cache ask it. LRU keeps the list, LFU keeps counts. Put and get stay the same.",
         "short_q": "Another eviction policy", "short_a": "pull eviction into a policy with on_use(key) and victim(); the cache asks it"},
        {"ask": "On a miss, load the value from a database. Many callers miss the same key at once.",
         "say": "Add get_or_load(key, loader). **Only the first caller runs the loader; the others wait for its result** (a per-key lock or a pending future), so one popular key does not send a hundred queries.",
         "short_q": "Load on a miss", "short_a": "get_or_load(key, loader); one caller loads, the rest wait on it"},
    ],
    "faq": [("Why not an OrderedDict?", "It is the shortcut I would name, not use: move_to_end and popitem(last=False) do the whole LRU in a few lines. If the interviewer allows it, say so after the linked list, and mention it is the same idea built in."),
            ("Why now >= expires_at and not >?", "A ttl of 10 should mean gone at exactly 10 seconds. Say which you chose."),
            ("A different ttl for each key?", "Already there: the put's ttl overrides the default.")],

    "summary": ["**Two classes.** The Cache holds a dict from key to node, and a doubly linked list of the same nodes with a sentinel at each end, most recently used first. put stores the value with an expiry and evicts the node before the tail when it is over capacity; get removes an expired key, or moves a live one to the front. A Node holds a value, its key, its expiry time and its neighbours, and the clock is a function we pass in.",
                "**It grows by layer:** one lock around every method for threads (reads too, because get reorders), a purge for entries nobody touches, an eviction policy pulled out if LFU is asked for, and a loader so one miss fills the key once."],

    "golden": [
        ("Build the layers in order: a dict, then expiry, then capacity. Say what each one costs.", "interviewers add layers on purpose, and over-building layer three first is the common failure."),
        ("The LRU is a dict plus a doubly linked list with sentinels: a use moves a node to the front, eviction drops the one before the tail.", "every operation stays O(1), and the sentinels remove every end-of-list case."),
        ("The node carries its key, so evicting a node can delete its dict entry.", "forgetting this leaves the dict pointing at an unlinked node."),
        ("Time is a function passed in, so the demo and the tests fake it.", "ttl logic cannot be shown any other way without sleeping."),
        ("Expiry is checked when a key is touched, and size() admits that expired entries count.", "it follows the agreed scope and shows you know the edge before they ask."),
        ("Even get takes the lock, because it reorders.", "it is the senior answer to threads: reads are writes here."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with thread safety and the expiry purge applied, and a run at the bottom: eight threads hammer a small cache, then the fake clock moves past the ttl.",
    "final_title": "kvcache.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "100 (eight threads wrote 8,000 keys into a cache of 100, and it never went over), then purge_expired removed all 100 and left 0 after the clock moved past the ttl.",
}
