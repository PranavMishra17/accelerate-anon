"""Key-value cache, built in layers: a dict, then a TTL, then a capacity with eviction, then hot-key protection.
Five classes and one interface: Cache (the facade), Entry (a value and when it dies), InFlight (one load in progress, so a
miss computes once), EvictionPolicy (the part that varies) with LRUPolicy, and Node (a link in LRU's list).
The recency list is a doubly linked list written by hand. The clock and the random source are passed in.
Shards, write policies, size-aware capacity and a near cache are the extensions."""
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
          1. Work out when the entry dies: the put's ttl, else the default, jittered; else never
          2. Under the lock, store a new Entry under the key; a replace restarts the ttl
          3. Tell the policy the key was used
          4. If that put the cache over capacity, evict until it fits
        Edge cases:
          1. A ttl of zero or less -> error
          2. A put on an existing key does not grow the cache, so nothing is evicted
        """
        ttl = self.default_ttl if ttl is None else ttl             # Step 1
        if ttl is not None and ttl <= 0:                           # Edge 1
            raise CacheError("ttl must be positive")
        expires_at = self._expiry(ttl)                             # Step 1: jitter has its own helper
        with self.lock:                                            # the checks above need no lock; the shared state does
            self.entries[key] = Entry(value, expires_at)           # Step 2: the old Entry, if any, is replaced
            self.policy.record_use(key)                            # Step 3: a put counts as a use
            self._evict_if_full()                                  # Step 4: named now, written below
''')

GET = method('''
    def get(self, key):
        """
        Core logic:
          1. Under the lock, look the key up
          2. An expired entry is removed and counts as a miss
          3. A live entry is a use: tell the policy, then return the value
        Edge cases:
          1. Missing or expired -> None
        """
        with self.lock:                                            # reads too: a hit reorders the policy
            entry = self.entries.get(key)                          # Step 1
            if entry is None:                                      # Edge 1
                return None
            if entry.is_expired(self.clock()):                     # Step 2: the entry knows, the cache does not
                self._drop(key)
                return None
            self.policy.record_use(key)                            # Step 3: a hit changes the order
            return entry.value
''')

GET_OR_LOAD = method('''
    def get_or_load(self, key, loader, ttl: float | None = None):
        """
        Core logic:
          1. Under the lock, a live cached value is the answer
          2. Else see whether a load for this key is already in flight
          3. If one is, wait for its result: this caller never runs the loader
          4. If not, this caller is the leader: register an InFlight, then run the loader outside the lock
          5. Cache the value, hand it to every waiter, and unregister the flight
        Edge cases:
          1. A hundred callers miss one key at once -> the loader runs once
          2. The loader raises -> every waiter gets that error, nothing is cached, the next call tries again
        """
        with self.lock:                                            # reentrant: get() takes it again
            value = self.get(key)                                  # Step 1
            if value is not None:
                return value
            flight = self.inflight.get(key)                        # Step 2
            leader = flight is None
            if leader:                                             # Step 4: the check and the register are one step
                flight = InFlight()
                self.inflight[key] = flight
        if not leader:
            return flight.wait()                                   # Step 3, Edge 1: no second load
        try:
            value = loader(key)                                    # the slow part, outside the lock
            self.put(key, value, ttl)                              # Step 5
            flight.finish(value)
            return value
        except Exception as error:                                 # Edge 2
            flight.finish(None, error)
            raise
        finally:
            with self.lock:
                del self.inflight[key]                             # the next miss starts a fresh flight
''')

EXPIRY = method('''
    def _expiry(self, ttl: float | None) -> float | None:
        """
        Core logic:
          1. No ttl -> never expires
          2. Otherwise stretch or shrink the ttl by a random factor within plus or minus jitter
          3. The expiry is now plus that ttl
        Edge cases:
          1. jitter of 0 -> the exact ttl
        """
        if ttl is None:                                            # Step 1
            return None
        spread = 1 + self.jitter * (2 * self.rand() - 1)           # Step 2: rand() in [0, 1) gives 1 - jitter up to 1 + jitter
        return self.clock() + ttl * spread                         # Step 3: keys written together now die at different times
''')

INFLIGHT_WAIT = method('''
    def wait(self):
        """
        Core logic:
          1. Block until the leader finishes
          2. If the leader failed, raise its error
          3. Otherwise return its value
        Edge cases:
          1. Many waiters -> every one gets the same value or the same error
        """
        self.done.wait()                                           # Step 1
        if self.error is not None:                                 # Step 2
            raise self.error
        return self.value                                          # Step 3
''')

INFLIGHT_FINISH = method('''
    def finish(self, value, error: Exception | None = None) -> None:
        self.value = value                                         # set before the event, so a waiter never sees half a result
        self.error = error
        self.done.set()
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
        with self.lock:
            if key not in self.entries:
                return False
            self._drop(key)
            return True

    def size(self) -> int:
        with self.lock:
            return len(self.entries)                               # expired entries nobody touched still count

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
    import random
    import threading
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

INFLIGHT = D('''\


    class InFlight:
        """One load in progress for a key. The first caller runs it; every other caller waits on it."""

        def __init__(self):
            self.done = threading.Event()  # set once the leader has a value or an error
            self.value = None
            self.error = None
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
                     policy: EvictionPolicy | None = None, clock=time.monotonic,
                     jitter: float = 0.1, rand=random.random):
            if capacity < 1:
                raise CacheError("capacity must be at least 1")
            if default_ttl is not None and default_ttl <= 0:
                raise CacheError("ttl must be positive")
            if not 0 <= jitter < 1:
                raise CacheError("jitter must be from 0 up to 1")
            self.capacity = capacity                               # put compares the size to this
            self.default_ttl = default_ttl                         # used when a put gives no ttl
            self.policy = policy if policy is not None else LRUPolicy()   # passed in, so LFU is a new class and not an edit
            self.clock = clock                                     # a function, so a test can fake time
            self.jitter = jitter                                   # every ttl varies by up to this fraction, either way
            self.rand = rand                                       # passed in, so a test can fix the "random" factor
            self.entries = {}                                      # key -> Entry
            self.inflight = {}                                     # key -> the InFlight being loaded right now
            self.lock = threading.RLock()                          # entries, policy and inflight change together; reentrant for get_or_load
    ''')

CORE = (HEAD + ENTRY + in_class(ENTRY_IS_EXPIRED) + INFLIGHT + in_class(INFLIGHT_WAIT, INFLIGHT_FINISH) + NODE + POLICY + LRU
        + in_class(LRU_VICTIM, LRU_RECORD_USE, LRU_HELPERS)
        + CACHE + in_class(GET_OR_LOAD, EXPIRY, PUT, GET, EVICT_IF_FULL, CACHE_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    now = [0.0]                                    # a fake clock we move by hand
    c = Cache(capacity=2, default_ttl=10, clock=lambda: now[0], rand=lambda: 0.5)   # 0.5 means no jitter
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

    # jitter: two keys written together with the same ttl of 10 die at different times
    factors = iter([0.0, 1.0])
    j = Cache(capacity=5, clock=lambda: 0.0, rand=lambda: next(factors))
    j.put("a", 1, ttl=10)
    j.put("b", 2, ttl=10)
    print(round(j.entries["a"].expires_at, 1), round(j.entries["b"].expires_at, 1))   # 9.0 11.0

    # hot key: five callers miss one key at once, and the loader runs once
    h = Cache(capacity=10)
    calls = []
    gate = threading.Event()
    def slow_load(key):
        calls.append(key)
        gate.wait()                                # hold the leader until every caller has arrived
        return key.upper()
    results = []
    readers = [threading.Thread(target=lambda: results.append(h.get_or_load("hot", slow_load))) for _ in range(5)]
    for t in readers:
        t.start()
    gate.set()
    for t in readers:
        t.join()
    print(len(calls), results)                     # 1 ['HOT', 'HOT', 'HOT', 'HOT', 'HOT']
    def broken(key):
        raise ValueError("database down")
    try:
        h.get_or_load("x", broken)
    except ValueError as e:
        print(e, h.get("x"))                       # a failed load is not cached
    ''')
DEMO_OUT = ("1\nNone 2\nNone\n1\n4\nNone\ncapacity must be at least 1\nttl must be positive\n"
            "9.0 11.0\n1 ['HOT', 'HOT', 'HOT', 'HOT', 'HOT']\ndatabase down None\n")

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

        def _shard(self, key) -> Cache:
            # crc32, not hash(): str hashes change on every run, so a key would move between runs
            return self.shards[zlib.crc32(str(key).encode()) % len(self.shards)]

        def put(self, key, value, ttl=None) -> None:
            self._shard(key).put(key, value, ttl)

        def get(self, key):
            return self._shard(key).get(key)

        def get_or_load(self, key, loader, ttl=None):
            return self._shard(key).get_or_load(key, loader, ttl)   # single-flight per key still works: one key, one shard

        def delete(self, key) -> bool:
            return self._shard(key).delete(key)

        def size(self) -> int:
            return sum(s.size() for s in self.shards)
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
F_HEAD = HEAD.replace("import time\n", "import time\nimport zlib\n")      # one more import: a stable hash for shards

F_CACHE = CACHE + '''        self.hits = 0                                              # new: counters, so you can tell whether the cache helps
        self.misses = 0
        self.evictions = 0
'''

F_GET = method('''
    def get(self, key):
        with self.lock:                        # reads too: a hit reorders the policy
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
        with self.lock:
            if key not in self.entries:
                return False
            self._drop(key)
            return True

    def size(self) -> int:
        with self.lock:
            return len(self.entries)

    def stats(self) -> dict:
        with self.lock:
            total = self.hits + self.misses
            ratio = round(self.hits / total, 2) if total else 0.0
            return {"hits": self.hits, "misses": self.misses, "evictions": self.evictions,
                    "size": len(self.entries), "hit_ratio": ratio}

    def _drop(self, key) -> None:
        del self.entries[key]
        self.policy.remove(key)
''')

FINAL = (F_HEAD + ENTRY + in_class(ENTRY_IS_EXPIRED) + INFLIGHT + in_class(INFLIGHT_WAIT, INFLIGHT_FINISH) + NODE + POLICY + LRU
         + in_class(LRU_VICTIM, LRU_RECORD_USE, LRU_HELPERS)
         + LFU + F_CACHE + in_class(GET_OR_LOAD, EXPIRY, PUT, F_GET, F_EVICT, F_REST) + SHARDED)

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
    "lead": "A cache grows one layer at a time: a dict, then a TTL, then a capacity with eviction, then protection for a hot key. A full round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design, e) implementation, f) extensibility. Five classes and one interface: the Cache, an Entry that knows when it dies, an InFlight that makes a miss compute once, an EvictionPolicy with LRU written on a hand-made linked list, and its Node. The eviction rule is a part you can swap because the interviewer says LFU is next. Shards, a backing database and memory limits are the extensions, argued as trade-offs. Try each box before you open the answer. The usual references land here: a Cache facade, a pluggable eviction policy, a doubly linked list, a lazy TTL check (the lld-cache repo on GitHub, and the techinterview.org cache write-up).",
    "prompt": "Design an in-memory key-value cache. Then add a time to live, then a capacity with least recently used eviction. Then one popular key expires and a thousand callers miss it at once.",
    "evidence": "Reported in Amazon rounds as a cache that starts as a dict and gains layers every few minutes: expiry, then capacity with LRU, then threads.",
    "drill": "part 7, a key-value cache built in layers.",

    "clarify": {
        "capabilities": [("What operations?", "put a key and value, get by key, delete, and how many entries there are"),
                         ("What is the time to live measured from?", "From the put. A default for the cache, and a put can override it"),
                         ("What counts toward capacity, and what is evicted?", "The number of keys. Evict the least recently used one; a get and a put both count as a use"),
                         ("Will the eviction rule change?", "Yes. LRU now, LFU is a likely follow-up, so the cache must take the rule as a part"),
                         ("A popular key expires and many callers ask at once?", "Only one should compute the value. The others wait for that result. Give the cache a loader: get_or_load(key, loader)"),
                         ("A batch of keys written together?", "They must not all expire together. Spread each ttl by up to 10 percent either way")],
        "errors": [("What does get return for a missing or expired key?", "None. Values are never None"),
                   ("Put on a key that exists?", "Replace the value and restart its time to live"),
                   ("A bad capacity, a time to live of zero, a bad jitter?", "Reject them with an error"),
                   ("The loader fails while others wait?", "Every waiter gets that same error. Nothing is cached, and the next call tries again")],
        "scope": [("Do expired entries have to disappear on their own?", "No. Expiry is checked when a key is touched"),
                  ("Threads?", "Yes: callers are threads in one process, so one lock. Shards, a network and persistence are follow-ups"),
                  ("A CDN or edge caching?", "Out of scope: that is an HTTP tier in front of the system, not this class")],
    },
    "clarify_hint": "The operations, what the ttl counts from, what capacity counts, whether the eviction rule changes. What happens when a hot key expires, and when a batch expires together. Missing, expired, bad numbers, a failing loader. Threads?",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** I ask what the time to live counts from and what capacity counts, because each one is a layer. I ask whether the eviction rule will change, because that decides whether eviction is a part of its own. And I ask what happens when a popular key expires, because that is the hot-key layer: one load, many waiters.",
    "clarify_why": "Each answer is a layer or a class. A ttl gives an expiry on each entry, capacity gives a recency list, 'the rule will change' is the only reason eviction becomes its own class, and the hot key gives a loader with one load in flight per key. Callers are threads, so the lock is in the core.",
    "answers": "put, get, delete and a count of entries. The time to live counts from the put: one default, and a put can override it, spread by up to 10 percent either way so a batch does not expire together. Capacity counts keys, and the least recently used key goes first; reads and writes both count as a use. The eviction rule will change, LFU is likely next. A missing or expired key returns None. A put on an existing key replaces the value and restarts its ttl. get_or_load(key, loader): on a miss one caller loads and the rest wait for that result; if the load fails they all get the error and nothing is cached. A bad capacity, ttl or jitter is an error. Expiry is checked when a key is touched. Callers are threads in one process. Shards, a database behind the cache and edge caching are out of scope.",
    "playback": ["Thanks, that's clear. **So: a map that expires entries when they are touched, spreads their expiry, evicts through a swappable policy, and loads a missing key once while the other callers wait.** Out of scope: persistence, networking, a background thread for expiry, shards, a CDN."],

    "requirements": [
        ["User stores a value under a key.", "The system keeps it with an expiry time: the put's ttl, else the default, spread by the jitter", "A put on an existing key replaces it and restarts the ttl; a ttl of zero or less is an error"],
        ["User reads a key.", "The system returns the value and marks the key as used", "A missing or expired key returns None; an expired one is removed"],
        ["The cache holds at most a set number of keys.", "A put that goes over evicts the key the policy names; the policy is LRU now and can be swapped", "A capacity under 1 is an error"],
        ["User reads a key with a loader.", "On a miss one caller runs the loader and caches the result; concurrent callers of the same key wait for that result", "A failing loader gives every waiter the same error and caches nothing"],
        ["User deletes a key or asks how many entries there are.", "Delete says whether the key was there", "Expired entries that nobody touched still count"],
    ],
    "out_of_scope": ["persistence and networking", "a background thread that removes expired entries", "shards and a backing store (extensions)", "edge caching and a CDN", "values that are None"],
    "req_hint": "Store with a spread expiry, read, the capacity limit with a swappable rule, load once on a miss, delete and count.",
    "req_say": "From your answers I get five requirements. **Each one is a layer or a method: put with a jittered ttl, get, the capacity limit inside put with a policy behind it, get_or_load, and delete with size.** I say the error case with each one, like a ttl of zero or a loader that fails.",
    "req_why": "Each requirement is a layer or a method: 1 is put and the ttl, 2 is get, 3 is eviction through the policy, 4 is get_or_load, 5 is delete and size.",

    "entities": [("User / caller", False, "External; not modelled"),
                 ("Key and value", False, "A key is the dict key and a value is any object; neither has behaviour"),
                 ("Entry", True, "A value and when it expires; it answers is_expired, so the ttl rule lives with the data"),
                 ("Cache", True, "Holds the entries, the policy and the loads in flight, and runs put, get, get_or_load, delete, size"),
                 ("Eviction policy", True, "The requirements say the rule changes (LRU now, LFU next), so it is a part with three calls"),
                 ("Load in flight", True, "One load in progress for a key: the first caller runs it and the rest wait on its result or its error"),
                 ("LRU list node", True, "A key with two neighbours; the policy's own record, so the cache never sees the list"),
                 ("Clock, random source", False, "Functions passed in, so a test can fake time and the jitter; not classes"),
                 ("Storage", False, "A dict inside Cache. It becomes a class only if another store is asked for"),
                 ("Backing store, shard, CDN", False, "Extensions or another tier; not in this scope")],
    "ent_hint": "What does an entry need besides its value? Does the eviction rule change? What does a waiting caller wait on? What does the recency list need from each key?",
    "ent_say": "I underline the nouns. **The entry, the cache, the eviction policy and the load in flight stay.** The entry carries its expiry and answers whether it is dead. The policy stays because you told me the rule will change. The load in flight stays because waiting callers need one thing to wait on, which holds the result or the error. The list node is the policy's own detail, and the clock is a function I pass in.",
    "ent_why": "Five classes and one interface. The policy earns its place only because the requirements make it vary. Entry holds the expiry rule, and InFlight holds the wait-for-the-leader rule. The clock and the storage stay out until something asks for them.",

    "classes": [
        {"name": "Cache", "state": ["capacity: int  # put compares the size to this to evict",
                                    "default_ttl: seconds | None  # used when a put gives no ttl",
                                    "policy: EvictionPolicy  # who goes when full; passed in, LRU by default",
                                    "clock: function returning seconds  # a passed-in clock, so time can be faked",
                                    "jitter: float, rand: function  # the spread on each ttl, and a random source a test can fix",
                                    "entries: Map<key, Entry>  # O(1) lookup of a value and its expiry",
                                    "inflight: Map<key, InFlight>  # the load running now for a key; the second caller finds it here",
                                    "lock: reentrant lock  # entries, policy and inflight change together"],
         "behaviour": ["get_or_load(key, loader, ttl) -> value | error  # req 4: one load per miss, the rest wait",
                       "put(key, value, ttl) -> void | error  # req 1 and 3: store, then evict if over capacity",
                       "get(key) -> value | None  # req 2: miss, expiry, and marks a use",
                       "delete(key) -> boolean  # req 5: says whether the key was there",
                       "size() -> int  # req 5: expired but untouched entries still count",
                       "_expiry(ttl) -> time | None  # req 1: now plus the ttl, spread by the jitter",
                       "_evict_if_full() -> void  # while over capacity, drop the policy's victim",
                       "_drop(key) -> void  # the one way a key leaves: entries and policy together"]},
        {"name": "Entry", "state": ["value: any  # what the caller stored",
                                    "expires_at: seconds | None  # expiry is per entry, set at put"],
         "behaviour": ["is_expired(now) -> boolean  # get asks the entry, not the cache"]},
        {"name": "InFlight", "state": ["done: Event  # set when the leader has a result",
                                       "value, error  # what the leader produced"],
         "behaviour": ["wait() -> value | error  # a follower blocks, then gets the leader's result",
                       "finish(value, error) -> void  # the leader publishes, and wakes every follower"]},
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
    "class_hint": "Cache holds a dict of entries, a dict of loads in flight, a lock, a clock and a policy. Entry holds a value and an expiry. InFlight holds an event, a value and an error. The policy takes three calls. LRU keeps a dict of nodes and a list with a sentinel at each end.",
    "class_say": "**I start from the methods and ask what each one has to read.** Get and put find a key in O(1), so the cache keeps a dict. Expiry needs the time and a deadline per value, so a clock I pass in and an entry with its expiry. Get_or_load must find a load already running for the key, so a second dict, and something for followers to wait on: that is InFlight. Eviction has to change later, so the cache tells a policy what happened and asks who goes. LRU gets O(1) from a dict of nodes plus a doubly linked list.",
    "class_why": "The cache owns the data, the ttl and the in-flight map. The policy owns the order. They meet at three calls, record_use, remove and victim, which LFU also needs. InFlight is the only thing callers share while a load runs. Sentinels in the list remove every empty-list and end-of-list case.",
    "class_qa": [{"ask": "Why a dict and a linked list, and not a dict plus a list of keys?",
                  "say": "Because the list makes every get O(n): finding the key to move. **The dict gives me the node, and the node already knows its neighbours, so unlinking it and putting it first is O(1).** Eviction is O(1) too: the node before the tail.",
                  "explain": ["The list has to be doubly linked: unlinking a node needs its previous neighbour without a scan."]},
                 {"ask": "Why sentinel nodes at the head and the tail?",
                  "say": "So no link is ever None. **Adding to an empty list and removing the first or last node run the same lines as any other case,** which is where hand-written linked lists usually break."},
                 {"ask": "Why is eviction its own class when you only have LRU?",
                  "say": "Because you told me the rule will change. **The cache only needs three calls from it, and LFU is a second class behind the same three,** so put and get never change. If you had said LRU forever, I would have kept it as two private methods on the cache.",
                  "explain": ["An interface with one implementation is a guess about the future. Here the requirement is the reason."]},
                 {"ask": "Why does the loader run outside the lock?",
                  "say": "Because it is slow: a database call. **If it ran under the lock, every other key would wait behind one slow load.** So the leader registers its InFlight under the lock, releases it, loads, and only takes the lock again to cache the value and remove the flight.",
                  "explain": ["The cost: between registering and finishing, followers of that one key block on the event. Other keys proceed."]},
                 {"ask": "Why jitter the TTL by a random amount?",
                  "say": "Because **keys written together with the same ttl die together, and the next wave of misses hits the database together.** A spread of 10 percent turns one cliff into a slope. The random source is passed in so a test can fix it.",
                  "explain": ["The cost: a key can live up to 10 percent shorter or longer than the ttl you asked for. Say that, and keep the jitter small."]},
                 {"ask": "The cache has a map of entries and the policy has a map of nodes. Is that one map too many?",
                  "say": "It is two maps with different jobs. **The cache's map answers 'what is the value and is it dead'; the policy's map answers 'where is this key in the order'.** Merging them would put list links into Entry and make LFU carry fields it does not use.",
                  "explain": ["The cost is a second lookup per call. Both are O(1), and _drop keeps the two in step."]}],

    "map": {"center": ("Cache", "get_or_load, put, get"),
            "owned": [("Entry", "value, expires_at"), ("InFlight", "done, value, error"), ("EvictionPolicy", "record_use, victim")],
            "uses": [("LRUPolicy", "dict + linked list"), ("now(), rand()", "the clock, jitter")]},

    "skeleton": {"q": "First the small pieces: Entry, InFlight, Node, the EvictionPolicy interface, LRUPolicy's __init__ with the two sentinels linked, and the cache's __init__.",
                 "hint": "Entry holds a value and an expiry. InFlight holds an event, a value and an error. Node holds a key and two neighbours. The policy has record_use, remove and victim. LRU holds a dict and a head and tail pointing at each other. The cache holds a capacity, a default ttl, a policy, a clock, a jitter, a random source, two dicts and a lock.",
                 "code": HEAD + ENTRY + INFLIGHT + NODE + POLICY + LRU + CACHE,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "get_or_load", "q": "Start with the most interesting method: get_or_load(key, loader). A hot key expires and many callers ask at once. Core logic and edge cases as comments, then the code.",
         "hint": "Under the lock: a live value is the answer; else look for an InFlight; if there is none, register yours. Followers wait on the flight. The leader loads outside the lock, puts the value, finishes the flight, and always removes it.", "code": GET_OR_LOAD,
         "why": "The check for a flight and the registration happen under one lock hold, so two callers cannot both become the leader. The loader runs outside it. The finally clause removes the flight even on failure."},
        {"name": "InFlight.wait", "q": "InFlight.wait(): what does a follower get?",
         "hint": "Block on the event. If the leader failed, raise its error. Else return its value.", "code": INFLIGHT_WAIT,
         "why": "Every follower gets the same value or the same error, and none of them runs the loader."},
        {"name": "_expiry", "q": "_expiry(ttl): when does an entry die, with the jitter?",
         "hint": "No ttl is never. Else now plus the ttl times a factor between 1 minus jitter and 1 plus jitter.", "code": EXPIRY,
         "why": "rand() is in [0, 1), so 2r - 1 is in [-1, 1). With a jitter of 0 the ttl is exact."},
        {"name": "put", "q": "put(key, value, ttl): core logic and edge cases as comments, then the code. Name the eviction as a helper.",
         "hint": "Work out the expiry. Under the lock, store a new Entry, tell the policy, self._evict_if_full(). Edges: ttl of zero, replace.", "code": PUT,
         "why": "A replace is the same lines as a new key, because a new Entry overwrites the old one. Eviction has a name here and its own box next."},
        {"name": "get", "q": "get(key): core logic, edge cases, code.",
         "hint": "Under the lock: look up, ask the entry if it is expired, tell the policy, return. Edge: missing.", "code": GET,
         "why": "An expired key is removed on the read, which is why size() can count dead entries. A hit changes the order, so even a read takes the lock."},
        {"name": "_evict_if_full", "q": "_evict_if_full(): when does eviction run, and who chooses the victim?",
         "hint": "While over capacity, ask the policy for a victim and drop it. Stop if there is none.", "code": EVICT_IF_FULL,
         "why": "The cache never looks at recency. It asks, then removes, so a new policy changes nothing here."},
        {"name": "LRUPolicy.victim", "q": "LRUPolicy.victim(): which key was used longest ago?",
         "hint": "The node before the tail. None if the list is empty.", "code": LRU_VICTIM,
         "why": "O(1) because the oldest use is always at the back. It only names the key; the cache removes it, so the policy never deletes a value by itself."},
        {"name": "LRUPolicy.record_use", "q": "LRUPolicy.record_use(key): what is a use, in terms of the list?",
         "hint": "New key: make a node. Known key: unlink it. Then link it first.", "code": LRU_RECORD_USE,
         "why": "A put and a hit are the same event to the policy. The sentinels mean the first key needs no special case."},
        {"name": "Entry.is_expired", "q": "Entry.is_expired(now): when is an entry dead?",
         "hint": "No expiry means never. Otherwise once the clock reaches the expiry time.", "code": ENTRY_IS_EXPIRED,
         "why": "The entry answers about itself. Say which side of the boundary you chose before they ask."},
    ],
    "helpers": [
        {"q": "InFlight.finish: how does the leader publish?",
         "hint": "Set the value and the error, then set the event.",
         "code": INFLIGHT_FINISH,
         "why": "The result is written before the event is set, so a woken follower never sees half a result."},
        {"q": "The policy's helpers: remove, _link_first and _unlink.",
         "hint": "remove forgets a key and unlinks its node. link first: four links. unlink: join the two neighbours.",
         "code": LRU_HELPERS,
         "why": "Because of the sentinels the old first node always exists, and unlinking has no case for the first or last node."},
        {"q": "The cache's plain ones: delete, size and _drop.",
         "hint": "delete finds the key and drops it. size is the dict length. _drop removes from the dict and the policy together. The first two take the lock.",
         "code": CACHE_HELPERS,
         "why": "_drop is the one way a key leaves, so the dict and the policy never disagree. size includes expired entries nobody touched. Say it before they ask."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies. Scale shows up as 'what varies', and each answer costs something.",
        "solid": [
            ("Single responsibility", "Entry knows its expiry; InFlight carries one load's result; the Cache owns the maps, the lock, the ttl and the capacity; the policy owns the order."),
            ("Open/closed", "LFU is a new class behind record_use, remove and victim. put, get and _evict_if_full are not edited."),
            ("Liskov substitution", "Any policy must honour the same three calls: victim names a tracked key or None, remove forgets a key. LFUPolicy does."),
            ("Interface segregation", "EvictionPolicy has the three calls the cache uses and nothing else. Callers use only Cache's five public methods."),
            ("Dependency inversion", "Cache is handed its policy, its clock and its random source; it builds none of them."),
        ],
        "varies": [
            ("The eviction rule (LFU, FIFO, TTL only)", "Strategy: it is already one", "LRUPolicy and LFUPolicy behind EvictionPolicy"),
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
        {"ask": "One lock is the bottleneck. How do you scale it?",
         "say": "Every call takes one lock, reads too, because a hit reorders the policy; a reader-writer lock would not help. So split the cache by key: **hash the key to one of N small caches, each with its own lock,** and two keys on different shards never wait for each other. Each shard evicts on its own, so the total capacity is N times the shard capacity. That is lock striping, and single-flight keeps working because one key lives on one shard.",
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
         "explain": ["Single-flight and jitter, already in the core, stop the stampede; this is for sheer read volume.",
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
            ("A different ttl for each key?", "Already there: the put's ttl overrides the default, and the jitter spreads it."),
            ("Why no Storage interface, like some references have?", "There is one storage, a dict, and nothing in the requirements makes it vary. It becomes a class when a second store is asked for: a database behind the cache, or a file. Then it sits beside the cache, as the backing store."),
            ("What do the usual references agree on?", "A Cache facade, a pluggable eviction policy (LRU on a doubly linked list), a lazy TTL check on read, then write policies, locking and sharding as follow-ups. Written ones: the lld-cache repo on GitHub and the cache write-up at techinterview.org. To watch: Jordan has no life, Google SWE Teaches Low Level Design, episode 2 (Cache), and Udit Agarwal's Cache low level design. Single-flight and jitter are the hot-key layer added here."),
            ("Where do I read more on the scale side?", "Mercor sessions wc32 and wc33 (cache code review, stampedes, stale data), week 5's caching session w5a, and the guide's hot-keys, cache-aside, invalidation and consistent-hashing techniques."),
            ("Why do the followers wait and not get a stale value?", "Because there is none: the key has expired. Serving the old value while one caller refreshes it (stale-while-revalidate) is a choice for later; it trades freshness for latency."),
            ("Real time and threads?", "The clock is a function, so a real run passes time.monotonic and a test passes a counter. The lock goes around the maps and the policy, never around the loader.")],

    "summary": ["**Five classes and one interface.** The Cache holds a dict from key to Entry, a dict of loads in flight, a lock, a clock and an eviction policy. put spreads the ttl, stores an Entry, tells the policy, and drops the policy's victim while it is over capacity; get removes an expired key, or tells the policy about a hit. get_or_load makes the first missing caller the leader: it loads outside the lock and publishes through an InFlight, and every other caller waits for that result. LRUPolicy keeps a dict of nodes and a doubly linked list with a sentinel at each end, so every call is O(1).",
                "**It grows one place at a time:** LFU is a second policy, shards with a lock each for contention and a hash ring when shards move, a near cache for a key too hot for one shard, a cache-aside write path for a database, a cost per entry for memory, and counters to see whether any of it helps. A CDN is a different tier in front. Each one costs something, and I say what."],

    "golden": [
        ("Build the layers in order: a dict, then expiry, then capacity with a policy, then the hot key. Say what each one costs.", "interviewers add layers on purpose, and over-building layer three first is the common failure."),
        ("A miss computes once: the first caller registers an InFlight, loads outside the lock, and the rest wait on it.", "it is the cache stampede answer, and the check-and-register under one lock hold is what makes it correct."),
        ("Eviction is a policy only because the rule will change; the cache asks it three things: record_use, remove, victim.", "an interface needs a reason, and a second class (LFU) behind the same three calls is the proof."),
        ("LRU is a dict plus a doubly linked list with sentinels: a use moves a node to the front, the victim is the one before the tail.", "every operation stays O(1), and the sentinels remove every end-of-list case."),
        ("Even get takes the lock, because it reorders. The loader never runs under it.", "reads are writes here, and a slow load under the lock would stall every other key."),
        ("For scale, name the cost with the fix: a lock per shard, a hash ring, a near cache, cache-aside.", "each fix has a price (uneven eviction, stale reads, write fan-out) and saying it is the answer."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with LFU as a second policy, hit and eviction counters, and shards with a lock each, and a run at the bottom: an LFU cache, then eight threads writing into four shards.",
    "final_title": "kvcache.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "b is evicted and a survives under LFU (None 1), then the counters (3 hits, 1 miss, 1 eviction, ratio 0.75), then 400: eight threads wrote 8,000 keys into four shards of 100 and no shard went over.",
}
