"""The better versions of the Mercor snippet, one per answer, each run against a fake pricing client below.
Imported by mercor_mock_gen.py (CODE dict); run directly to test: python mercor_code.py"""
import asyncio, random, threading, time

CODE = {}

CODE["correct"] = '''import time

TTL = 60  # seconds a price may be stale: from the business, not a guess

cache = {}  # (product_id, currency) -> (price, expires_at)

def get_price(product_id, currency):
    key = (product_id, currency)               # everything the price depends on
    hit = cache.get(key)
    if hit and hit[1] > time.monotonic():      # fresh: serve it
        return hit[0]
    price = pricing_client.fetch(product_id, currency)  # raises on failure,
    cache[key] = (price, time.monotonic() + TTL)        # so errors are never stored
    return price'''

CODE["singleflight"] = '''import threading, time
from concurrent.futures import Future

TTL = 60
_lock = threading.Lock()   # guards the two dicts only, for microseconds
_cache = {}                # key -> (price, expires_at)
_inflight = {}             # key -> Future of the load in progress

def get_price(product_id, currency):
    key = (product_id, currency)
    with _lock:
        hit = _cache.get(key)
        if hit and hit[1] > time.monotonic():
            return hit[0]
        fut = _inflight.get(key)
        leader = fut is None
        if leader:                              # first miss: I load it
            fut = _inflight[key] = Future()
    if not leader:
        return fut.result()                     # everyone else waits on mine
    try:
        price = pricing_client.fetch(product_id, currency)  # outside the lock
    except Exception as e:
        with _lock:
            del _inflight[key]                  # next request retries
        fut.set_exception(e)                    # waiters get the same error
        raise
    with _lock:
        _cache[key] = (price, time.monotonic() + TTL)
        del _inflight[key]
    fut.set_result(price)
    return price'''

CODE["globallock"] = '''import threading

_lock = threading.Lock()

def get_price(product_id, currency):
    with _lock:                                 # held for the whole call
        key = (product_id, currency)
        if key in cache:
            return cache[key]
        price = pricing_client.fetch(product_id, currency)  # 200 ms, lock held:
        cache[key] = price                      # every other product waits
        return price'''

CODE["lru"] = '''import threading, time
from collections import OrderedDict

TTL, MAX_ENTRIES = 60, 100_000                  # ~1 KB each: ~100 MB
_cache = OrderedDict()                          # key -> (price, expires_at), oldest first
_lock = threading.Lock()
_loads = threading.BoundedSemaphore(20)         # at most 20 calls to pricing at once

def _get(key):
    with _lock:
        hit = _cache.get(key)
        if hit is None:
            return None
        if hit[1] <= time.monotonic():          # expired: drop it
            del _cache[key]
            return None
        _cache.move_to_end(key)                 # recently used
        return hit[0]

def _put(key, price):
    with _lock:
        _cache[key] = (price, time.monotonic() + TTL)
        _cache.move_to_end(key)
        while len(_cache) > MAX_ENTRIES:
            _cache.popitem(last=False)          # evict least recently used

def get_price(product_id, currency):
    key = (product_id, currency)
    price = _get(key)
    if price is None:
        with _loads:                            # a burst queues, never floods
            price = pricing_client.fetch(product_id, currency)
        _put(key, price)
    return price'''

CODE["stale"] = '''import random, time

SOFT, HARD = 60, 600   # fresh for 1 minute; servable up to 10 if pricing is down
_cache = {}            # key -> (price, fetched_at)

class TransientError(Exception):
    """Timeouts and 5xx: worth a retry. A 4xx is not."""

def fetch_with_retry(product_id, currency, attempts=3, base=0.1):
    for i in range(attempts):
        try:
            return pricing_client.fetch(product_id, currency, timeout=0.5)
        except TransientError:
            if i == attempts - 1:
                raise
            time.sleep(random.uniform(0, base * 2 ** i))   # backoff, full jitter

def get_price(product_id, currency):
    key, now = (product_id, currency), time.monotonic()
    hit = _cache.get(key)
    if hit and now - hit[1] < SOFT:
        return hit[0]
    try:
        price = fetch_with_retry(product_id, currency)
    except TransientError:
        if hit and now - hit[1] < HARD:
            return hit[0]                       # stale beats an error
        raise
    _cache[key] = (price, now)
    return price'''

CODE["async"] = '''import asyncio, time

TTL = 60
_cache = {}      # key -> (price, expires_at)
_inflight = {}   # key -> Task of the load in progress

async def get_price(product_id, currency):
    key = (product_id, currency)
    hit = _cache.get(key)
    if hit and hit[1] > time.monotonic():
        return hit[0]
    task = _inflight.get(key)
    if task is None:                            # no await between check and set:
        task = _inflight[key] = asyncio.create_task(_load(key))  # no race, no lock
    return await asyncio.shield(task)           # my timeout won't cancel others

async def _load(key):
    try:
        price = await pricing_client.fetch(*key)
        _cache[key] = (price, time.monotonic() + TTL)
        return price
    finally:
        _inflight.pop(key, None)                # success or failure: clear it'''

CODE["jitter"] = '''import random, time

TTL = 60

def _put(key, price):
    ttl = TTL * random.uniform(0.9, 1.1)        # 54 to 66 s, not all at 60
    cache[key] = (price, time.monotonic() + ttl)'''

CODE["negative"] = '''import time

NOT_FOUND = object()                            # a marker, never a real price
NEG_TTL = 30

def get_price(product_id, currency):
    key = (product_id, currency)
    hit = cache.get(key)
    if hit and hit[1] > time.monotonic():
        if hit[0] is NOT_FOUND:
            raise KeyError(product_id)          # answered from cache, no call
        return hit[0]
    try:
        price = pricing_client.fetch(product_id, currency)
    except KeyError:                            # 404: cache the absence, briefly
        cache[key] = (NOT_FOUND, time.monotonic() + NEG_TTL)
        raise
    cache[key] = (price, time.monotonic() + TTL)
    return price'''

CODE["invalidate"] = '''def set_price(product_id, prices):
    db.write_prices(product_id, prices)         # the source first
    for currency in prices:                     # then drop what is now wrong
        cache.pop((product_id, currency), None)'''

CODE["test"] = '''import threading, time

class FakePricing:
    def __init__(self):
        self.calls = 0
    def fetch(self, product_id, currency):
        self.calls += 1
        time.sleep(0.2)                         # widen the race window
        return 9.99

def test_fifty_callers_one_call():
    global pricing_client
    pricing_client = FakePricing()
    results = []
    threads = [threading.Thread(target=lambda: results.append(get_price("p1", "USD")))
               for _ in range(50)]
    for t in threads: t.start()
    for t in threads: t.join()
    assert pricing_client.calls == 1
    assert results == [9.99] * 50'''


# ---------------------------------------------------------------- the checks
class TransientErrorFake(Exception):
    pass

class Fake:
    def __init__(self, price=9.99, fail=0, missing=(), delay=0.05, transient=None):
        self.calls, self.price, self.fail, self.missing, self.delay, self.transient = 0, price, fail, set(missing), delay, transient
    def fetch(self, product_id, currency, timeout=None):
        self.calls += 1
        time.sleep(self.delay)
        if product_id in self.missing:
            raise KeyError(product_id)
        if self.fail:
            self.fail -= 1
            raise (self.transient or RuntimeError)("down")
        return (self.price, currency)

def load(name, **extra):
    g = {"__name__": "snip_" + name}
    g.update(extra)
    exec(CODE[name], g)
    return g

def threads(fn, n=50):
    out, errs = [], []
    def run():
        try: out.append(fn())
        except Exception as e: errs.append(e)
    ts = [threading.Thread(target=run) for _ in range(n)]
    for t in ts: t.start()
    for t in ts: t.join()
    return out, errs

def check():
    # correct: currency in key, no error stored, expiry
    f = Fake(); g = load("correct", pricing_client=f)
    assert g["get_price"]("p", "USD") == (9.99, "USD") and g["get_price"]("p", "EUR") == (9.99, "EUR") and f.calls == 2
    g["get_price"]("p", "USD"); assert f.calls == 2
    f2 = Fake(fail=1); g = load("correct", pricing_client=f2)
    try: g["get_price"]("p", "USD"); raise SystemExit("expected error")
    except RuntimeError: pass
    assert g["cache"] == {} and g["get_price"]("p", "USD") == (9.99, "USD")
    g["TTL"] = 0; g["cache"].clear(); g["get_price"]("q", "USD"); n = f2.calls; time.sleep(0.01); g["get_price"]("q", "USD"); assert f2.calls == n + 1
    # single-flight: 50 threads, 1 call; failure wakes all with the error, then retries
    f = Fake(delay=0.2); g = load("singleflight", pricing_client=f)
    out, errs = threads(lambda: g["get_price"]("p", "USD"))
    assert f.calls == 1 and len(out) == 50 and not errs and g["_inflight"] == {}
    f = Fake(delay=0.2, fail=1); g = load("singleflight", pricing_client=f)
    out, errs = threads(lambda: g["get_price"]("p", "USD"))
    assert f.calls == 1 and len(errs) == 50 and g["_inflight"] == {}
    assert g["get_price"]("p", "USD") == (9.99, "USD") and f.calls == 2
    # global lock: correct but serial (two different products take two delays)
    f = Fake(delay=0.2); g = load("globallock", pricing_client=f, cache={})
    t0 = time.monotonic(); threads(lambda: g["get_price"](str(random.random()), "USD"), n=3); assert time.monotonic() - t0 >= 0.55
    # lru: bound holds, recency kept, semaphore caps concurrency
    f = Fake(delay=0); g = load("lru", pricing_client=f); g["MAX_ENTRIES"] = 3
    for p in "abc": g["get_price"](p, "USD")
    g["get_price"]("a", "USD"); g["get_price"]("d", "USD")
    assert list(k[0] for k in g["_cache"]) == ["c", "a", "d"]
    class Peak(Fake):
        def __init__(s): Fake.__init__(s, delay=0.05); s.now = s.peak = 0; s.l = threading.Lock()
        def fetch(s, *a, **k):
            with s.l: s.now += 1; s.peak = max(s.peak, s.now)
            try: return Fake.fetch(s, *a, **k)
            finally:
                with s.l: s.now -= 1
    pk = Peak(); g = load("lru", pricing_client=pk)
    threads(lambda: g["get_price"](str(random.random()), "USD"), n=60); assert pk.peak <= 20
    # stale: retries on transient, serves stale inside HARD, raises after
    g = load("stale"); TE = g["TransientError"]
    f = Fake(delay=0, fail=2, transient=TE); g["pricing_client"] = f
    assert g["get_price"]("p", "USD") == (9.99, "USD") and f.calls == 3
    g["SOFT"] = 0; f.fail = 99
    assert g["get_price"]("p", "USD") == (9.99, "USD")
    g["HARD"] = 0
    try: g["get_price"]("p", "USD"); raise SystemExit("expected error")
    except TE: pass
    # async: 50 tasks, 1 call; one caller's timeout doesn't cancel the load
    class AFake:
        def __init__(s): s.calls = 0
        async def fetch(s, pid, cur):
            s.calls += 1; await asyncio.sleep(0.1); return (9.99, cur)
    async def go():
        af = AFake(); g = load("async", pricing_client=af)
        res = await asyncio.gather(*[g["get_price"]("p", "USD") for _ in range(50)])
        assert af.calls == 1 and res == [(9.99, "USD")] * 50 and g["_inflight"] == {}
        af2 = AFake(); g = load("async", pricing_client=af2)
        impatient = asyncio.wait_for(g["get_price"]("q", "USD"), 0.01)
        patient = g["get_price"]("q", "USD")
        r = await asyncio.gather(impatient, patient, return_exceptions=True)
        assert isinstance(r[0], asyncio.TimeoutError) and r[1] == (9.99, "USD") and af2.calls == 1
    asyncio.run(go())
    # jitter: expiries spread
    g = load("jitter", cache={})
    for i in range(200): g["_put"](i, 1)
    exps = [v[1] for v in g["cache"].values()]; assert max(exps) - min(exps) > 5
    # negative: one call for a missing id, then from cache
    f = Fake(delay=0, missing={"ghost"}); g = load("negative", pricing_client=f, cache={}, TTL=60)
    for _ in range(3):
        try: g["get_price"]("ghost", "USD"); raise SystemExit("expected KeyError")
        except KeyError: pass
    assert f.calls == 1
    # invalidate: source first, then the entries
    class DB:
        def write_prices(s, pid, prices): s.w = (pid, prices)
    c = {("p", "USD"): 1, ("p", "EUR"): 2, ("q", "USD"): 3}; g = load("invalidate", cache=c, db=DB())
    g["set_price"]("p", {"USD": 5, "EUR": 6}); assert c == {("q", "USD"): 3}
    # the test itself passes against single-flight
    gs = load("singleflight", pricing_client=None); gt = load("test")
    gt["get_price"] = gs["get_price"]
    def fake_global(): pass
    exec(CODE["test"] + "\n", gs)   # test reads pricing_client/get_price from the snippet's globals
    gs["test_fifty_callers_one_call"]()
    print("all snippets check out")

if __name__ == "__main__":
    check()
