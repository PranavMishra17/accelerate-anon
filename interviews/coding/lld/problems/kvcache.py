"""Key-value cache, built in layers: a dict, then a TTL, then a capacity with eviction.
Four classes and one interface: Cache (the facade), Entry (a value and when it dies), EvictionPolicy (the part that
varies, abstracted away from the cache) with LRUPolicy, and Node (a link in LRU's list). The recency list is a doubly
linked list written by hand. The clock is passed in. Single-threaded: threads, hot keys (single-flight, TTL jitter),
shards, write policies and memory limits are the extensions."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the cache: put, get, eviction ----
PUT = method('''
    def put(self, key, value, ttl: float | None = None) -> None:
        """
        Core logic:
          1. Work out when the entry dies: the put's ttl, else the default, else never
          2. Store a new Entry under the key; a replace restarts the ttl
          3. Tell the policy the key was used
          4. If that put the cache over capacity, evict until it fits
        Edge cases:
          1. A ttl of zero or less -> error
          2. A put on an existing key does not grow the cache, so nothing is evicted
        """
        ttl = self.default_ttl if ttl is None else ttl             # Step 1
        if ttl is not None and ttl <= 0:                           # Edge 1
            raise CacheError("ttl must be positive")
        expires_at = None if ttl is None else self.clock() + ttl
        self.entries[key] = Entry(value, expires_at)               # Step 2: the old Entry, if any, is replaced
        self.policy.record_use(key)                                # Step 3: a put counts as a use
        self._evict_if_full()                                      # Step 4: the hard part, named now and written next
''')

GET = method('''
    def get(self, key):
        """
        Core logic:
          1. Look the key up
          2. An expired entry is removed and counts as a miss
          3. A live entry is a use: tell the policy, then return the value
        Edge cases:
          1. Missing or expired -> None
        """
        entry = self.entries.get(key)                              # Step 1
        if entry is None:                                          # Edge 1
            return None
        if entry.is_expired(self.clock()):                         # Step 2: the entry knows, the cache does not
            self._drop(key)
            return None
        self.policy.record_use(key)                                # Step 3: a hit changes the order
        return entry.value
''')

EVICT_IF_FULL = method('''
    def _evict_if_full(self) -> None:
        """
        Core logic:
          1. While there are more entries than the capacity
          2. Ask the policy which key goes, and drop it
        Edge cases:
          1. The policy has no victim -> stop, so a broken policy cannot spin forever
        """
        while len(self.entries) > self.capacity:                   # Step 1: a loop, so a smaller capacity later still works
            victim = self.policy.victim()                          # Step 2: the policy decides, the cache removes
            if victim is None:                                     # Edge 1
                return
            self._drop(victim)
''')

CACHE_HELPERS = method('''
    def delete(self, key) -> bool:
        if key not in self.entries:
            return False
        self._drop(key)
        return True

    def size(self) -> int:
        return len(self.entries)                                   # expired entries nobody touched still count

    def _drop(self, key) -> None:
        # the one way a key leaves, so the dict and the policy never disagree
        del self.entries[key]
        self.policy.remove(key)
''')

# ---- the policy: LRU on a hand-written list ----
LRU_VICTIM = method('''
    def victim(self):
        """
        Core logic:
          1. The node before the tail was used longest ago
          2. Return its key; the cache removes it
        Edge cases:
          1. Nothing tracked -> None
        """
        last = self.tail.prev                                      # Step 1: most recent is after the head, oldest before the tail
        if last is self.head:                                      # Edge 1: only the two sentinels
            return None
        return last.key                                            # Step 2
''')

LRU_RECORD_USE = method('''
    def record_use(self, key) -> None:
        """
        Core logic:
          1. A key never seen gets a new node
          2. A key already tracked is unlinked from where it is
          3. Either way the node goes first: most recently used
        Edge cases:
          1. The very first key: the list is empty, and the sentinels make it the same lines
        """
        node = self.nodes.get(key)
        if node is None:                                           # Step 1
            node = Node(key)
            self.nodes[key] = node
        else:
            self._unlink(node)                                     # Step 2: O(1), the node knows its neighbours
        self._link_first(node)                                     # Step 3
''')

LRU_HELPERS = method('''
    def remove(self, key) -> None:
        node = self.nodes.pop(key, None)                           # a key never tracked is fine
        if node is not None:
            self._unlink(node)

    def _link_first(self, node: Node) -> None:
        first = self.head.next                                     # always there: the tail, when the list is empty
        node.prev = self.head
        node.next = first
        self.head.next = node
        first.prev = node

    def _unlink(self, node: Node) -> None:
        node.prev.next = node.next                                 # no case for first or last: their neighbours are sentinels
        node.next.prev = node.prev
''')

ENTRY_IS_EXPIRED = method('''
    def is_expired(self, now: float) -> bool:
        """
        Core logic:
          1. No expiry -> never expired
          2. Otherwise expired once the clock reaches the expiry time
        Edge cases:
          1. A ttl of 10 means gone at exactly 10 seconds, so >= and not >
        """
        return self.expires_at is not None and now >= self.expires_at   # Step 1, Step 2, Edge 1
''')

HEAD = D('''\
    import time
    from abc import ABC, abstractmethod


    class CacheError(Exception):       # one error type the caller can catch for every refusal
        pass
    ''')

ENTRY = D('''\


    class Entry:
        """A stored value and when it dies. It answers is_expired; the cache never reads expires_at itself."""

        def __init__(self, value, expires_at: float | None):
            self.value = value             # whatever the caller stored; None is not allowed as a value
            self.expires_at = expires_at   # clock seconds, or None for never
    ''')

NODE = D('''\


    class Node:
        """One key in the recency list. The policy's, not the cache's."""

        def __init__(self, key):
            self.key = key                 # so eviction can name the key to remove
            self.prev = None               # the neighbours; linked by the policy
            self.next = None
    ''')

POLICY = D('''\


    class EvictionPolicy(ABC):
        """Decides who goes when the cache is full. The cache tells it what happens; it never touches the values."""

        @abstractmethod
        def record_use(self, key) -> None:     # a put or a hit
            ...

        @abstractmethod
        def remove(self, key) -> None:         # the key left the cache, for any reason
            ...

        @abstractmethod
        def victim(self):                      # the key to evict next, or None
            ...
    ''')

LRU = D('''\


    class LRUPolicy(EvictionPolicy):
        """Least recently used: a dict to find a node in O(1), a doubly linked list to order the nodes."""

        def __init__(self):
            self.nodes = {}                    # key -> Node
            self.head = Node(None)             # sentinels: never real keys, so no link is ever None
            self.tail = Node(None)
            self.head.next = self.tail
            self.tail.prev = self.head
    ''')

CACHE = D('''\


    class Cache:
        """The entry point: a map of entries with a ttl, and a policy that keeps it within capacity."""

        def __init__(self, capacity: int, default_ttl: float | None = None,
                     policy: EvictionPolicy | None = None, clock=time.monotonic):
            if capacity < 1:
                raise CacheError("capacity must be at least 1")
            if default_ttl is not None and default_ttl <= 0:
                raise CacheError("ttl must be positive")
            self.capacity = capacity                               # put compares the size to this
            self.default_ttl = default_ttl                         # used when a put gives no ttl
            self.policy = policy if policy is not None else LRUPolicy()   # passed in, so LFU is a new class and not an edit
            self.clock = clock                                     # a function, so a test can fake time
            self.entries = {}                                      # key -> Entry
    ''')

CORE = (HEAD + ENTRY + in_class(ENTRY_IS_EXPIRED) + NODE + POLICY + LRU + in_class(LRU_VICTIM, LRU_RECORD_USE, LRU_HELPERS)
        + CACHE + in_class(PUT, GET, EVICT_IF_FULL, CACHE_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    now = [0.0]                                    # a fake clock we move by hand
    c = Cache(capacity=2, default_ttl=10, clock=lambda: now[0])
    c.put("a", 1)
    c.put("b", 2)
    print(c.get("a"))                              # 1, and a is now the most recently used
    c.put("c", 3)                                  # over capacity: b is the least recently used, so b goes
    print(c.get("b"), c.size())                    # None 2
    now[0] = 10                                    # a's ttl is up
    print(c.get("a"))                              # None, and it is removed
    print(c.size())                                # 1: c is expired too, but nobody touched it
    c.put("c", 4, ttl=5)                           # a replace restarts the clock, with its own ttl
    now[0] = 14
    print(c.get("c"))                              # 4
    now[0] = 15
    print(c.get("c"))                              # None
    for bad in (lambda: Cache(0), lambda: c.put("x", 1, ttl=0)):
        try:
            bad()
        except CacheError as e:
            print(e)

    ''')
DEMO_OUT = "1\nNone 2\nNone\n1\n4\nNone\ncapacity must be at least 1\nttl must be positive\n"

# ---- extensions ----
LFU = D('''\


    class LFUPolicy(EvictionPolicy):
        """Least frequently used: evict the key with the fewest uses; the oldest of those on a tie."""

        def __init__(self):
            self.counts = {}                   # key -> number of uses
            self.buckets = {}                  # uses -> the keys with that count; a dict keeps insertion order, so oldest first

        def record_use(self, key) -> None:
            n = self.counts.get(key, 0)
            if n:
                self._leave_bucket(key, n)
            self.counts[key] = n + 1
            self.buckets.setdefault(n + 1, {})[key] = None

        def remove(self, key) -> None:
            n = self.counts.pop(key, None)
            if n is not None:
                self._leave_bucket(key, n)

        def victim(self):
            if not self.counts:
                return None
            return next(iter(self.buckets[min(self.buckets)]))     # min over distinct counts; a tracked min makes it O(1)

        def _leave_bucket(self, key, n: int) -> None:
            del self.buckets[n][key]
            if not self.buckets[n]:
                del self.buckets[n]
    ''')

SHARDED = D('''\


    class ShardedCache:
        """Many small caches, each with its own lock. A key always lands on the same one."""

        def __init__(self, shards: int, capacity_per_shard: int, policy_factory=LRUPolicy, **options):
            self.shards = [Cache(capacity_per_shard, policy=policy_factory(), **options) for _ in range(shards)]
            self.locks = [threading.Lock() for _ in range(shards)]   # one per shard: keys on different shards never wait

        def _index(self, key) -> int:
            # crc32, not hash(): str hashes change on every run, so a key would move between runs
            return zlib.crc32(str(key).encode()) % len(self.shards)

        def put(self, key, value, ttl=None) -> None:
            i = self._index(key)
            with self.locks[i]:
                self.shards[i].put(key, value, ttl)

        def get(self, key):
            i = self._index(key)
            with self.locks[i]:                  # reads too: a hit reorders that shard's policy
                return self.shards[i].get(key)

        def delete(self, key) -> bool:
            i = self._index(key)
            with self.locks[i]:
                return self.shards[i].delete(key)

        def size(self) -> int:
            return sum(s.size() for s in self.shards)
    ''')

EXT_LOCK = D('''\
    import threading


    class Cache:
        def __init__(self, ...):
            ...
            self.lock = threading.Lock()

        def get(self, key):
            with self.lock:              # reads too: get reorders the policy, so a read is a write
                ...

        def put(self, key, value, ttl=None):
            ...                          # validate and work out the expiry outside the lock
            with self.lock:
                ...                      # store, record_use, evict: one step, so no one sees half of it
    ''')

EXT_HOT = D('''\
    import random
    import threading


    class InFlight:
        """One load in progress for a key: the first caller runs it, every other caller waits on it."""

        def __init__(self):
            self.done = threading.Event()
            self.value = None
            self.error = None


    class Cache:
        def get_or_load(self, key, loader, ttl=None):
            with self.lock:
                value = self.get(key)            # needs a reentrant lock, since get takes it too
                if value is not None:
                    return value
                flight = self.inflight.get(key)  # someone already loading this key?
                leader = flight is None
                if leader:                       # check and register in one lock hold: only one leader
                    flight = self.inflight[key] = InFlight()
            if not leader:
                flight.done.wait()               # a hot key's other callers queue here; the loader runs once
                if flight.error:
                    raise flight.error
                return flight.value
            try:
                flight.value = loader(key)       # the slow part, outside the lock, so other keys never wait
                self.put(key, flight.value, ttl)
                return flight.value
            except Exception as error:
                flight.error = error             # every waiter gets the same error; nothing is cached
                raise
            finally:
                with self.lock:
                    del self.inflight[key]
                flight.done.set()

        def _expiry(self, ttl):
            # jitter: keys written together with one ttl must not all die together and miss together
            return self.clock() + ttl * random.uniform(0.9, 1.1)
    ''')

EXT_NEAR = D('''\
    class NearCache:
        """A tiny cache in each process, in front of the shared one. A hot key is answered here, with no network."""

        def __init__(self, shared, size: int = 64, ttl: float = 1.0):
            self.local = Cache(size, default_ttl=ttl)    # the same class; the short ttl bounds how stale it can be
            self.shared = shared

        def get(self, key):
            value = self.local.get(key)
            if value is None:
                value = self.shared.get(key)
                if value is not None:
                    self.local.put(key, value)
            return value
    ''')

EXT_RING = D('''\
    from bisect import bisect_right
    import zlib


    class HashRing:
        """Which node owns a key. Adding a node moves only the keys that fall in its arcs, about 1/N of them."""

        def __init__(self, nodes: list, vnodes: int = 100):
            # each node sits on the ring at many points (virtual nodes), so load spreads evenly
            self.ring = sorted((zlib.crc32(f"{n}#{i}".encode()), n) for n in nodes for i in range(vnodes))
            self.points = [h for h, _ in self.ring]

        def node_for(self, key) -> str:
            i = bisect_right(self.points, zlib.crc32(str(key).encode())) % len(self.ring)   # next point clockwise
            return self.ring[i][1]
    ''')

EXT_STORE = D('''\
    # cache-aside: the caller reads the cache, falls back to the store, then fills the cache
    def read(key):
        value = cache.get(key)
        if value is None:
            value = store.load(key)
            if value is not None:
                cache.put(key, value)
        return value

    # write with invalidation: change the store, then delete the cache key; the next read refills it
    def update(key, value):
        store.save(key, value)
        cache.delete(key)                # delete, not put: two writers cannot leave the cache in the wrong order

    # write-through: both on every write, the store first, so a failed save leaves the cache untouched
    def write_through(key, value):
        store.save(key, value)
        cache.put(key, value)

    # write-back: the cache takes the write now, the store gets it later
    def write_back(key, value):
        cache.put(key, value)
        dirty[key] = value               # lost if we crash before flush(), and if the key is evicted first

    def flush():
        for key, value in list(dirty.items()):
            store.save(key, value)
            del dirty[key]
    ''')

EXT_COST = D('''\
    class Entry:
        def __init__(self, value, expires_at, cost: int = 1):
            ...
            self.cost = cost                 # bytes, or 1 to keep counting entries


    class Cache:
        def __init__(self, max_cost: int, ...):
            ...
            self.used = 0                    # the sum of cost over entries; put adds, _drop subtracts

        def _evict_if_full(self):
            while self.used > self.max_cost:           # was: len(self.entries) > self.capacity
                ...                                    # one big value may now evict several small ones


    MISSING = object()                       # negative caching: remember "the store has no such key"
    cache.put(key, MISSING, ttl=5)           # short ttl, so a key created a moment later is found soon
    ''')

# the final file: core + lock + stats + LFU + shards
F_HEAD = HEAD.replace("import time\n", "import threading\nimport time\nimport zlib\n")   # locks and a stable hash, for the shards

F_CACHE = CACHE + '''        self.hits = 0                                              # new: counters, so you can tell whether the cache helps
        self.misses = 0
        self.evictions = 0
'''

F_GET = method('''
    def get(self, key):
        entry = self.entries.get(key)
        if entry is None:
            self.misses += 1
            return None
        if entry.is_expired(self.clock()):
            self._drop(key)
            self.misses += 1
            return None
        self.policy.record_use(key)
        self.hits += 1
        return entry.value
''')

F_EVICT = method('''
    def _evict_if_full(self) -> None:
        while len(self.entries) > self.capacity:
            victim = self.policy.victim()
            if victim is None:
                return
            self._drop(victim)
            self.evictions += 1
''')

F_REST = method('''
    def delete(self, key) -> bool:
        if key not in self.entries:
            return False
        self._drop(key)
        return True

    def size(self) -> int:
        return len(self.entries)

    def stats(self) -> dict:
        total = self.hits + self.misses
        ratio = round(self.hits / total, 2) if total else 0.0
        return {"hits": self.hits, "misses": self.misses, "evictions": self.evictions,
                "size": len(self.entries), "hit_ratio": ratio}

    def _drop(self, key) -> None:
        del self.entries[key]
        self.policy.remove(key)
''')

FINAL = (F_HEAD + ENTRY + in_class(ENTRY_IS_EXPIRED) + NODE + POLICY + LRU
         + in_class(LRU_VICTIM, LRU_RECORD_USE, LRU_HELPERS)
         + LFU + F_CACHE + in_class(PUT, F_GET, F_EVICT, F_REST) + SHARDED)

FINAL_DEMO = D('''\


    # ---- a quick run ----
    c = Cache(capacity=2, policy=LFUPolicy())      # the same Cache, a different rule
    c.put("a", 1)
    c.put("b", 2)
    c.get("a")
    c.get("a")
    c.put("c", 3)                                  # a has 3 uses, b and c have 1: b is older, so b goes
    print(c.get("b"), c.get("a"))                  # None 1
    print(c.stats())

    s = ShardedCache(shards=4, capacity_per_shard=100)
    def work(t):
        for i in range(1000):
            s.put(f"k{t}-{i}", i)
    threads = [threading.Thread(target=work, args=(t,)) for t in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print(s.size())                                # 4 shards of 100: the shards never overfill
    ''')
FINAL_OUT = ("None 1\n{'hits': 3, 'misses': 1, 'evictions': 1, 'size': 2, 'hit_ratio': 0.75}\n400\n")


PROBLEM = {
    "id": "kvcache", "title": "A key-value cache", "part_id": "lld-kvstore", "n": 7,
    "part_title": "A key-value cache, built in layers", "minutes": 45,
    "lead": "A cache grows one layer at a time: a dict, then a TTL, then a capacity with eviction. A full round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design, e) implementation, f) extensibility. Four classes and one interface: the Cache, an Entry that knows when it dies, an EvictionPolicy with LRU written on a hand-made linked list, and its Node. The eviction rule is abstracted away from the cache because the interviewer says LFU is next: that split is half the design. Threads, hot keys, shards, a backing database and memory limits are the extensions, argued as trade-offs. Try each box before you open the answer. The usual references land here: a Cache facade, a pluggable eviction policy, a doubly linked list, a lazy TTL check (the lld-cache repo on GitHub, and the techinterview.org cache write-up).",
    "prompt": "Design an in-memory key-value cache. Then add a time to live, then a capacity with least recently used eviction.",
    "evidence": "Reported in Amazon rounds as a cache that starts as a dict and gains layers every few minutes: expiry, then capacity with LRU, then threads.",
    "drill": "part 7, a key-value cache built in layers.",

    "clarify": {
        "capabilities": [("What operations?", "put a key and value, get by key, delete, and how many entries there are"),
                         ("What is the time to live measured from?", "From the put. A default for the cache, and a put can override it"),
                         ("What counts toward capacity, and what is evicted?", "The number of keys. Evict the least recently used one; a get and a put both count as a use"),
                         ("Will the eviction rule change?", "Yes. LRU now, LFU is a likely follow-up, so the cache must take the rule as a part")],
        "errors": [("What does get return for a missing or expired key?", "None. Values are never None"),
                   ("Put on a key that exists?", "Replace the value and restart its time to live"),
                   ("A bad capacity, or a time to live of zero?", "Reject them with an error")],
        "scope": [("Do expired entries have to disappear on their own?", "No. Expiry is checked when a key is touched"),
                  ("Threads?", "Not to start: one thread, one process. Threads, a hot key under load, shards and persistence are follow-ups"),
                  ("A CDN or edge caching?", "Out of scope: that is an HTTP tier in front of the system, not this class")],
    },
    "clarify_hint": "The operations, what the ttl counts from, what capacity counts, whether the eviction rule changes. Missing, expired, put on an existing key, bad numbers. Does expiry need a background job? Threads?",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** I ask what the time to live counts from and what capacity counts, because each one is a layer. I ask whether the eviction rule will change, because that decides whether eviction is a part of its own. Then missing and expired keys, and last threads and a backing store.",
    "clarify_why": "Each answer is a layer or a class. A ttl gives an expiry on each entry, capacity gives a recency list that evicts from one end, and 'the rule will change' is the only reason eviction becomes its own class. 'Checked when touched' means no background thread yet, and one thread means no lock yet.",
    "answers": "put, get, delete and a count of entries. The time to live counts from the put: one default, and a put can override it. Capacity counts keys, and the least recently used key goes first; reads and writes both count as a use. The eviction rule will change, LFU is likely next. A missing or expired key returns None. A put on an existing key replaces the value and restarts its ttl. A bad capacity or a ttl of zero is an error. Expiry is checked when a key is touched, not by a background job. Single-threaded and in one process to start; threads, hot keys, shards and a backing store are follow-ups.",
    "playback": ["Thanks, that's clear. **So: a map that expires entries when they are touched and, when it is full, evicts whichever key a swappable policy names, LRU first.** Out of scope: persistence, networking, a background thread for expiry. Threads and scale come as follow-ups."],

    "requirements": [
        ["User stores a value under a key.", "The system keeps it with an expiry time: the put's ttl, else the default", "A put on an existing key replaces it and restarts the ttl; a ttl of zero or less is an error"],
        ["User reads a key.", "The system returns the value and marks the key as used", "A missing or expired key returns None; an expired one is removed"],
        ["The cache holds at most a set number of keys.", "A put that goes over evicts the key the policy names; the policy is LRU now and can be swapped", "A capacity under 1 is an error"],
        ["User deletes a key or asks how many entries there are.", "Delete says whether the key was there", "Expired entries that nobody touched still count"],
    ],
    "out_of_scope": ["persistence and networking", "a background thread that removes expired entries", "threads, hot keys, shards and a backing store (extensions)", "edge caching and a CDN", "values that are None"],
    "req_hint": "Store with an expiry, read, the capacity limit with a swappable rule, delete and count.",
    "req_say": "From your answers I get four requirements. **Each one is a layer or a method: put with a ttl, get, the capacity limit inside put with a policy behind it, and delete with size.** I say the error case with each one, like a ttl of zero.",
    "req_why": "Each requirement is a layer or a method: 1 is put and the ttl, 2 is get, 3 is eviction through the policy, 4 is delete and size.",

    "entities": [("User / caller", False, "External; not modelled"),
                 ("Key and value", False, "A key is the dict key and a value is any object; neither has behaviour"),
                 ("Entry", True, "A value and when it expires; it answers is_expired, so the ttl rule lives with the data"),
                 ("Cache", True, "Holds the entries and the policy, and runs put, get, delete and size"),
                 ("Eviction policy", True, "The requirements say the rule changes (LRU now, LFU next), so it is a part with three calls"),
                 ("LRU list node", True, "A key with two neighbours; the policy's own record, so the cache never sees the list"),
                 ("Clock", False, "A function passed in, so a test can fake time; not a class"),
                 ("Storage", False, "A dict inside Cache. It becomes a class only if another store is asked for"),
                 ("Lock, loader, backing store, shard, CDN", False, "Extensions or another tier; not in this scope")],
    "ent_hint": "What does an entry need besides its value? Does the eviction rule change? What does the recency list need from each key? Is the clock a class?",
    "ent_say": "I underline the nouns. **The entry, the cache and the eviction policy stay.** The entry carries its expiry and answers whether it is dead. The policy stays because you told me the rule will change; without that I would keep eviction as a method. The list node is the policy's own detail. Keys and values sit in a dict, and the clock is a function I pass in.",
    "ent_why": "Four classes and one interface. The policy earns its place only because the requirements make it vary. Entry earns its class because expiry is a rule about a value. The clock and the storage stay out until something asks for them.",

    "classes": [
        {"name": "Cache", "state": ["capacity: int  # put compares the size to this to evict",
                                    "default_ttl: seconds | None  # used when a put gives no ttl",
                                    "policy: EvictionPolicy  # who goes when full; passed in, LRU by default",
                                    "clock: function returning seconds  # a passed-in clock, so time can be faked",
                                    "entries: Map<key, Entry>  # O(1) lookup of a value and its expiry"],
         "behaviour": ["put(key, value, ttl) -> void | error  # req 1 and 3: store, then evict if over capacity",
                       "get(key) -> value | None  # req 2: miss, expiry, and marks a use",
                       "delete(key) -> boolean  # req 4: says whether the key was there",
                       "size() -> int  # req 4: expired but untouched entries still count",
                       "_evict_if_full() -> void  # while over capacity, drop the policy's victim",
                       "_drop(key) -> void  # the one way a key leaves: entries and policy together"]},
        {"name": "Entry", "state": ["value: any  # what the caller stored",
                                    "expires_at: seconds | None  # expiry is per entry, set at put"],
         "behaviour": ["is_expired(now) -> boolean  # get asks the entry, not the cache"]},
        {"name": "EvictionPolicy", "state": ["(none)  # an interface: three calls the cache makes"],
         "behaviour": ["record_use(key) -> void  # a put or a hit",
                       "remove(key) -> void  # the key left the cache, for any reason",
                       "victim() -> key | None  # who to evict next"]},
        {"name": "LRUPolicy", "state": ["nodes: Map<key, Node>  # O(1) from a key to its place in the list",
                                        "head, tail: Node  (sentinels)  # list ends that are never real keys, so no edge cases",
                                        "(list order)  # head.next is the most recently used, tail.prev the least"],
         "behaviour": ["record_use(key) -> void  # new node, or unlink the old one, then link first",
                       "victim() -> key | None  # the key before the tail",
                       "remove(key) -> void  # unlink and forget",
                       "_link_first(node), _unlink(node) -> void  # the two list operations"]},
        {"name": "Node", "state": ["key: any  # eviction names the key to remove",
                                   "prev, next: Node  # the neighbours in the recency list"],
         "behaviour": ["(none)  # a link; the policy joins and splits them"]},
    ],
    "class_hint": "Cache holds a dict of entries, a clock and a policy. Entry holds a value and an expiry. The policy takes three calls. LRU keeps a dict of nodes and a list with a sentinel at each end.",
    "class_say": "**I start from the methods and ask what each one has to read.** Get and put find a key in O(1), so the cache keeps a dict. Expiry needs the time and a deadline per value, so a clock I pass in and an entry with its expiry. Eviction has to change later, so the cache tells a policy what happened and asks who goes. LRU gets O(1) from a dict of nodes plus a doubly linked list.",
    "class_why": "The cache owns the data and the ttl. The policy owns the order. They meet at three calls, record_use, remove and victim, which is exactly what LFU would also need. Sentinels in the list remove every empty-list and end-of-list case.",
    "class_qa": [{"ask": "Why is the value not a member of Node: key, prev, next, value?",
                  "say": "Because in this design **the list only keeps the order, not the data.** The cache's entries map holds the data, key to Entry with its value and expiry; the policy's nodes hold only key, prev and next. When the cache is full the policy names a key, and the cache removes that key's value itself.",
                  "explain": ["Keeping the value out of Node is what makes the policy swappable. LRU never needs the value, it only answers which key was used longest ago. LFU has no linked list at all, it counts uses per key; with the value inside Node, switching to LFU would mean moving the data too.",
                              "The cost: two maps, two O(1) lookups instead of one, and _drop keeps them in step.",
                              "When value does belong in Node: the LeetCode-style LRU cache, one class, one map from key to node, no swappable policy. There the node is both the order and the data, key, value, prev and next. That is simpler and fine when LRU is the only rule; once the interviewer says the rule will change, you split them."]},
                 {"ask": "Why a dict and a linked list, and not a dict plus a list of keys?",
                  "say": "Because the list makes every get O(n): finding the key to move. **The dict gives me the node, and the node already knows its neighbours, so unlinking it and putting it first is O(1).** Eviction is O(1) too: the node before the tail.",
                  "explain": ["The list has to be doubly linked: unlinking a node needs its previous neighbour without a scan."]},
                 {"ask": "Why sentinel nodes at the head and the tail?",
                  "say": "So no link is ever None. **Adding to an empty list and removing the first or last node run the same lines as any other case,** which is where hand-written linked lists usually break."},
                 {"ask": "Why is eviction its own class when you only have LRU?",
                  "say": "Because you told me the rule will change. **The cache only needs three calls from it, and LFU is a second class behind the same three,** so put and get never change. If you had said LRU forever, I would have kept it as two private methods on the cache.",
                  "explain": ["An interface with one implementation is a guess about the future. Here the requirement is the reason."]},
                 {"ask": "The cache has a map of entries and the policy has a map of nodes. Is that one map too many?",
                  "say": "It is two maps with different jobs. **The cache's map answers 'what is the value and is it dead'; the policy's map answers 'where is this key in the order'.** Merging them would put list links into Entry and make LFU carry fields it does not use.",
                  "explain": ["The cost is a second lookup per call. Both are O(1), and _drop keeps the two in step."]}],

    "map": {"center": ("Cache", "put, get, delete, size"),
            "owned": [("Entry", "value, expires_at"), ("EvictionPolicy", "record_use, victim")],
            "uses": [("LRUPolicy", "dict + linked list"), ("now()", "the clock, passed in")]},

    "skeleton": {"q": "First the small pieces: Entry, Node, the EvictionPolicy interface, LRUPolicy's __init__ with the two sentinels linked, and the cache's __init__.",
                 "hint": "Entry holds a value and an expiry. Node holds a key and two neighbours. The policy has record_use, remove and victim. LRU holds a dict and a head and tail pointing at each other. The cache holds a capacity, a default ttl, a policy, a clock and a dict.",
                 "code": HEAD + ENTRY + NODE + POLICY + LRU + CACHE,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "Entry.is_expired", "q": "Quick win first: Entry.is_expired(now). When is an entry dead?",
         "hint": "No expiry means never. Otherwise once the clock reaches the expiry time.", "code": ENTRY_IS_EXPIRED,
         "why": "One line, and it banks a working piece in the first minute. The entry answers about itself. Say which side of the boundary you chose before they ask."},
        {"name": "put", "q": "The moat, the part to get right: put(key, value, ttl). Core logic and edge cases as comments, then the code. Name the eviction as a helper.",
         "hint": "Work out the expiry, store a new Entry, tell the policy, self._evict_if_full(). Edges: ttl of zero, replace.", "code": PUT,
         "why": "A replace is the same lines as a new key, because a new Entry overwrites the old one. The cache only tells the policy what happened; it never touches recency itself."},
        {"name": "get", "q": "The moat: get(key). Core logic, edge cases, code.",
         "hint": "Look up, ask the entry if it is expired, tell the policy, return. Edge: missing.", "code": GET,
         "why": "An expired key is removed on the read, which is why size() can count dead entries. A hit changes the order: with threads, that makes a read a write."},
        {"name": "_evict_if_full", "q": "The moat: _evict_if_full(). When does eviction run, and who chooses the victim?",
         "hint": "While over capacity, ask the policy for a victim and drop it. Stop if there is none.", "code": EVICT_IF_FULL,
         "why": "The cache asks, then removes. It does not know or care which policy answers, so LRU, LFU or anything else changes nothing here. That is the moat."},
    ],
    "helpers": [
        {"q": "Helpers: the cache's plain ones, delete, size and _drop.",
         "hint": "delete finds the key and drops it. size is the dict length. _drop removes from the dict and the policy together.",
         "code": CACHE_HELPERS,
         "why": "_drop is the one way a key leaves, so the dict and the policy never disagree. size includes expired entries nobody touched. Say it before they ask."},
        {"q": "The add-on: LRUPolicy.record_use(key). The cache works with any policy; LRU is one you plug in. What is a use, in terms of the list?",
         "hint": "New key: make a node. Known key: unlink it. Then link it first.",
         "code": LRU_RECORD_USE,
         "why": "A put and a hit are the same event to the policy. The sentinels mean the first key needs no special case."},
        {"q": "The add-on: LRUPolicy.victim(). Which key was used longest ago?",
         "hint": "The node before the tail. None if the list is empty.",
         "code": LRU_VICTIM,
         "why": "O(1) because the oldest use is always at the back. It only names the key; the cache removes it, so the policy never deletes a value by itself."},
        {"q": "The add-on's helpers: remove, _link_first and _unlink.",
         "hint": "remove forgets a key and unlinks its node. link first: four links. unlink: join the two neighbours.",
         "code": LRU_HELPERS,
         "why": "Because of the sentinels the old first node always exists, and unlinking has no case for the first or last node."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies. Scale shows up as 'what varies', and each answer costs something.",
        "solid": [
            ("Single responsibility", "Entry knows its expiry; the Cache owns the map, the ttl and the capacity; the policy owns the order."),
            ("Open/closed", "LFU is a new class behind record_use, remove and victim. put, get and _evict_if_full are not edited."),
            ("Liskov substitution", "Any policy must honour the same three calls: victim names a tracked key or None, remove forgets a key. LFUPolicy does."),
            ("Interface segregation", "EvictionPolicy has the three calls the cache uses and nothing else. Callers use only Cache's five public methods."),
            ("Dependency inversion", "Cache is handed its policy and its clock; it builds neither."),
        ],
        "varies": [
            ("The eviction rule (LFU, FIFO, TTL only)", "Strategy: it is already one", "LRUPolicy and LFUPolicy behind EvictionPolicy"),
            ("Callers become threads", "No pattern: a lock", "one lock around every method, reads too"),
            ("A hot key expires under load", "Single-flight and TTL jitter", "get_or_load with an InFlight per key; a spread on each ttl"),
            ("One lock is the bottleneck", "Sharding, a lock per shard (lock striping)", "ShardedCache; a hot key still lands on one shard"),
            ("Shards added or removed", "Consistent hashing with virtual nodes", "HashRing; about 1/N of the keys move, not nearly all"),
            ("A hot key beyond one process", "A near cache in front, or replicas of the key", "NearCache, stale up to its short ttl"),
            ("A database behind the cache", "Cache-aside, write-through or write-back", "a store beside the cache, never inside it"),
            ("Memory pressure, not entry count", "A cost per entry, negative caching, warming", "Entry.cost and a byte limit in _evict_if_full"),
            ("Edge caching of HTTP responses", "A CDN: another tier, not this class", "in front of the whole service"),
            ("Knowing whether it helps", "No pattern: counters", "hits, misses and evictions in stats()"),
        ],
    },
    "extensions": [
        {"ask": "Evict the least frequently used key instead. What changes?",
         "say": "One new class. **LFUPolicy answers the same three calls, record_use, remove and victim, so put, get and _evict_if_full do not change.** LRU keeps a list, LFU keeps a count per key, with keys of the same count in arrival order so ties go to the oldest.",
         "explain": ["LFU wins when a few keys are hot for a long time, and loses when popularity moves: an old favourite keeps its count and blocks new keys. LRU adapts faster, LFU resists a one-time scan. A TTL-only cache needs no policy at all, but memory is bounded only by how fast keys die."],
         "code": LFU, "code_title": "LFU as a second policy",
         "short_q": "Another eviction policy", "short_a": "LFUPolicy behind record_use, remove, victim; the cache is unchanged"},
        {"ask": "Now callers are threads. What breaks, and what do you change?",
         "say": "Two threads can interleave inside put and get and leave the dict and the policy disagreeing. **One lock around every public method, and reads take it too, because a hit reorders the policy: a read is a write here.** I work out the expiry before taking the lock, and keep the critical section to the dict and the policy.",
         "explain": ["A reader-writer lock does not help, since every get writes the order. The cost is that every call queues on one lock; the next extension shards it."],
         "code": EXT_LOCK, "code_title": "One lock around the cache",
         "short_q": "Threads", "short_a": "one lock around every method, reads too, since get reorders"},
        {"ask": "One popular key expires and a thousand callers miss it at once. What happens?",
         "say": "All of them miss and hit the database together: a stampede. **Make the first miss the leader: it registers an InFlight for the key, loads outside the lock, and every other caller waits for that result (single-flight).** If the load fails, they all get the error and nothing is cached. Then spread the risk: jitter each ttl by about 10 percent, so keys loaded together do not expire together.",
         "explain": ["The check for a flight and the registration happen under one lock hold, so two callers cannot both become the leader. The loader runs outside the lock, so other keys never wait behind a slow load.",
                     "Costs: the followers of that key block for one load time; jitter makes a key live up to 10 percent shorter or longer than asked. Serving the old value while one caller refreshes (stale-while-revalidate) is the next step if waiting is too slow."],
         "code": EXT_HOT, "code_title": "Single-flight on a miss, and TTL jitter",
         "short_q": "Hot key / stampede", "short_a": "get_or_load with one InFlight per key; ttl jitter; cost is queued callers"},
        {"ask": "One lock is the bottleneck. How do you scale it?",
         "say": "With threads, every call takes one lock. So split the cache by key: **hash the key to one of N small caches, each with its own lock,** and two keys on different shards never wait for each other. Each shard evicts on its own, so the total capacity is N times the shard capacity. That is lock striping, and single-flight still works because one key lives on one shard.",
         "explain": ["Costs: a hot key still lands on one shard, so it only moves the queue; eviction is only approximately global, since a shard can evict while another has room.",
                     "Use a stable hash. Python's hash() of a string changes on every run."],
         "code": SHARDED, "code_title": "Sharding: a Cache and a lock per shard",
         "short_q": "Scale past one lock", "short_a": "hash(key) to N small caches, a lock each; hot keys and uneven eviction are the cost"},
        {"ask": "The shards are separate servers now, and we add one. What happens to the keys?",
         "say": "With hash % N, **changing N moves almost every key, so the whole cache goes cold at once.** A hash ring puts each node at many points (virtual nodes); a key belongs to the next point clockwise, so adding a node takes keys only from its neighbours, about 1 in N.",
         "explain": ["Virtual nodes even out the load and let a bigger machine take more points.",
                     "In one process, shards rarely change and hash % N is fine. The ring matters when shards are servers. The guide has a consistent-hashing technique under Scaling writes."],
         "code": EXT_RING, "code_title": "Consistent hashing with virtual nodes",
         "short_q": "Shards added or removed", "short_a": "hash ring with virtual nodes; adding a node moves about 1/N of the keys"},
        {"ask": "That one key is so hot that even one shard cannot serve it. What now?",
         "say": "Take the reads away from the shard. **A near cache: the same Cache class, a few dozen entries and a TTL of a second or so, in each process,** so the hot key is answered with no network at all. The price is staleness: after an update, a process may serve the old value for up to that TTL. The other option is replicating the key to several shards, which spreads reads but multiplies every write and invalidation.",
         "explain": ["Single-flight and jitter, the extension above, stop the stampede; this is for sheer read volume.",
                     "The stampede and stale-data cases are in Mercor sessions wc32 and wc33 and week 5's caching session w5a; the guide's hot-keys technique sits under Scaling reads."],
         "code": EXT_NEAR, "code_title": "A near cache in front of the shared one",
         "short_q": "Hot key beyond one process", "short_a": "a tiny short-ttl Cache per process in front; or replicate the key; cost is staleness or write fan-out"},
        {"ask": "The cache sits in front of a database. How do writes work?",
         "say": "Four choices, each a trade-off. **Cache-aside with invalidation: write the store, delete the key, let the next read refill it.** Write-through writes both, store first: consistent, but every write pays for two. Write-back writes the cache and flushes later: fast, but a crash loses what was not flushed, and an evicted dirty key must be saved first. I would start with cache-aside.",
         "explain": ["Stale reads: a reader loads the old value, a writer updates the store and deletes the key, then the reader fills the cache with the old value. A short TTL bounds it; a version number on the entry closes it.",
                     "Delete beats update on write: two concurrent writers can apply their cache puts in the opposite order to their store writes. See the guide's cache-aside and invalidation techniques."],
         "code": EXT_STORE, "code_title": "Cache-aside, invalidation, write-through, write-back",
         "short_q": "Backing store", "short_a": "cache-aside + delete on write; write-through is consistent but slower; write-back can lose data"},
        {"ask": "Values vary from 100 bytes to 10 MB. Memory is the limit. What changes?",
         "say": "Capacity counts cost, not entries. **Each Entry gets a cost, the cache keeps a running total, and _evict_if_full loops while the total is over the limit.** One large value may push out several small ones. Also remember misses for a short TTL (negative caching) so a missing key does not hit the database every time, and warm the cache from the store or a snapshot after a restart.",
         "explain": ["Costs: you must measure size, which is approximate in Python. Negative entries use space and hide a key created a moment later, so keep their TTL short. Warming delays startup and can itself cause a database spike, so do it gradually."],
         "code": EXT_COST, "code_title": "Size-aware capacity and negative caching",
         "short_q": "Memory pressure", "short_a": "Entry.cost and a byte limit; negative caching with a short ttl; warm up after restart"},
        {"ask": "Expired entries pile up if nobody reads them. How do you clean up?",
         "say": "Add purge_expired(), which drops every expired entry through _drop and returns how many. **Something calls it on a timer,** a background thread or the caller. Until then, size counts them and the capacity still bounds memory.",
         "short_q": "Expired entries pile up", "short_a": "purge_expired() on a timer; capacity still bounds memory meanwhile"},
        {"ask": "How would you know the cache is helping?",
         "say": "Count three things: **hits, misses and evictions, and report the hit ratio,** as stats() does in the final file. Add latency percentiles for get (p50, p99). A falling hit ratio with rising evictions says the cache is too small or the policy is wrong; a high ratio on few keys says look for hot keys.",
         "explain": ["Costs: counters under the same lock add contention; per-shard counters summed on read avoid it.",
                     "Judge the cache by what it saves downstream: database load and p99 latency, not the ratio alone."],
         "short_q": "Is it helping", "short_a": "hits, misses, evictions, hit ratio, p50 and p99 of get; stats() under the lock"},
        {"ask": "Would a CDN help here?",
         "say": "Not for this class. **A CDN caches HTTP responses at the edge, near the user, in front of the whole service,** so it answers a request before it reaches our servers or this cache. It suits public, cacheable pages and files. This cache sits behind the service and holds computed values by key, which a CDN cannot see. They stack: CDN, then the service, then this cache, then the database.",
         "explain": ["The costs are the same kind: stale content until the edge entry expires or is purged, and a hot URL needs cache headers right. The guide has a CDN technique under Scaling reads."],
         "short_q": "A CDN", "short_a": "edge caching of HTTP responses in front of the service; a different tier, not this class"},
    ],
    "faq": [("Why not an OrderedDict?", "It is the shortcut I would name, not use: move_to_end and popitem(last=False) do the whole LRU in a few lines. I write the linked list first so the O(1) argument is visible, then say OrderedDict is the same idea built in."),
            ("Why now >= expires_at and not >?", "A ttl of 10 should mean gone at exactly 10 seconds. Say which you chose."),
            ("A different ttl for each key?", "Already there: the put's ttl overrides the default."),
            ("Why no Storage interface, like some references have?", "There is one storage, a dict, and nothing in the requirements makes it vary. It becomes a class when a second store is asked for: a database behind the cache, or a file. Then it sits beside the cache, as the backing store."),
            ("What do the usual references agree on?", "A Cache facade, a pluggable eviction policy (LRU on a doubly linked list), a lazy TTL check on read, then write policies, locking and sharding as follow-ups. Written ones: the lld-cache repo on GitHub and the cache write-up at techinterview.org. To watch: Jordan has no life, Google SWE Teaches Low Level Design, episode 2 (Cache), and Udit Agarwal's Cache low level design. Threads, single-flight and jitter are the follow-ups added here."),
            ("Where do I read more on the scale side?", "Mercor sessions wc32 and wc33 (cache code review, stampedes, stale data), week 5's caching session w5a, and the guide's hot-keys, cache-aside, invalidation and consistent-hashing techniques."),
            ("Real time and threads?", "The clock is a function, so a real run passes time.monotonic and a test passes a counter. Threads are the first extension: one lock around the dict and the policy.")],

    "summary": ["**Four classes and one interface.** The Cache holds a dict from key to Entry, a clock and an eviction policy. put stores an Entry with its expiry, tells the policy, and drops the policy's victim while it is over capacity; get removes an expired key, or tells the policy about a hit. The cache never looks at recency: it tells the policy what happened and asks who goes. LRUPolicy keeps a dict of nodes and a doubly linked list with a sentinel at each end, so every call is O(1).",
                "**It grows one place at a time:** LFU is a second policy, a lock for threads, single-flight and jitter for a hot key, shards with a lock each for contention and a hash ring when shards move, a near cache for a key too hot for one shard, a cache-aside write path for a database, a cost per entry for memory, and counters to see whether any of it helps. A CDN is a different tier in front. Each one costs something, and I say what."],

    "apart": [
        "**Abstract the eviction policy away from the cache.** Everything about which key leaves and when a key counts as used is the policy, behind an interface; the cache only reports what happened and asks who goes. That swap is half the win.",
        "**The value is not in the Node.** Entry holds the value and its expiry in the cache's map; the policy's nodes hold only key, prev and next. You need O(1) lookup (a map) and O(1) reordering (a doubly linked list), and they are two structures with two jobs.",
        "**Time is a clock you pass in, and the default ttl can be None.** That makes expiry testable and optional.",
        "**An expired key found on get is handled on that read:** drop it and return None, or return it once and mark it for refresh. Lazy expiry needs no background job."
    ],
    "golden": [
        ("Eviction is abstracted away from the cache: it asks the policy three things, record_use, remove, victim.", "that split is half the design, and a second class (LFU) behind the same three calls is the proof."),
        ("Build the layers in order: a dict, then expiry, then capacity with a policy. Say what each one costs.", "interviewers add layers on purpose, and over-building layer three first is the common failure."),
        ("LRU is a dict plus a doubly linked list with sentinels: a use moves a node to the front, the victim is the one before the tail.", "every operation stays O(1), and the sentinels remove every end-of-list case."),
        ("With threads, even get takes the lock, because it reorders; a hot key gets single-flight and jitter.", "reads are writes here, and a stampede is the follow-up every cache round ends on."),
        ("For scale, name the cost with the fix: a lock per shard, a hash ring, a near cache, cache-aside.", "each fix has a price (uneven eviction, stale reads, write fan-out) and saying it is the answer."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with LFU as a second policy, hit and eviction counters, and shards with a lock each (the core itself stays single-threaded), and a run at the bottom: an LFU cache, then eight threads writing into four shards.",
    "final_title": "kvcache.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "b is evicted and a survives under LFU (None 1), then the counters (3 hits, 1 miss, 1 eviction, ratio 0.75), then 400: eight threads wrote 8,000 keys into four shards of 100 and no shard went over.",
}
