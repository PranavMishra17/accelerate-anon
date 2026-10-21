"""Behaviour checks for the concurrency and ood patterns in coding/data.js.

    python coding/test_data.py        runs these after the code-block pass

test_data.py proves that every code block runs. These checks prove the code does what the page says: the
template, each variation and each classic problem of the two patterns is run against the behaviour its
statement promises (one load per key, a cap that holds, no lost update, no deadlock, the right order, the
right total). They read the code from the data, so a change on the page that breaks the code fails here.
"""
import asyncio, itertools, random, threading, time

CHECKS = []


def check(pid, name=None):
    """Register a check for a pattern's template (no name) or for the variation or problem whose name starts with `name`."""
    def deco(fn):
        CHECKS.append((pid, name, fn))
        return fn
    return deco


def load(D, pid, name):
    p = next(x for x in D["patterns"] if x["id"] == pid)
    if name is None:
        code = p["tpl"]
    else:
        item = next(i for i in p["probs"] + p["vars"] if i["n"].startswith(name))
        code = item.get("sol") or item["code"]
    ns = {"__name__": "check"}
    exec(code, ns)
    return ns


def run(D):
    """Run every check; returns (how many ran, the failures)."""
    fails = []
    for pid, name, fn in CHECKS:
        label = "%s / %s" % (pid, name or "template")
        try:
            fn(load(D, pid, name))
        except Exception as ex:  # a failed assertion or a crash is a failure of the page's code
            fails.append("%s: %s %s" % (label, type(ex).__name__, ex))
    return len(CHECKS), fails


def threads(*targets, timeout=5):
    """Start the targets as threads, in order, and wait; fails if one is still alive (a deadlock or a missed wake-up)."""
    ts = [threading.Thread(target=t, daemon=True) for t in targets]
    for t in ts:
        t.start()
    end = time.monotonic() + timeout          # one deadline for all of them, so a deadlock fails in `timeout` seconds
    for t in ts:
        t.join(max(0, end - time.monotonic()))
    assert not any(t.is_alive() for t in ts), "a thread is still running: deadlock or lost wake-up"


def raises(exc, fn, *args):
    try:
        fn(*args)
    except exc as e:
        return e
    raise AssertionError("expected %s" % exc.__name__)


async def araises(exc, coro):
    try:
        await coro
    except exc as e:
        return e
    raise AssertionError("expected %s" % exc.__name__)


# ---- concurrency ----

@check("concurrency")
def _template(ns):
    async def main():
        calls, st = [], {"active": 0, "peak": 0}

        async def fetch(key):
            calls.append(key)
            st["active"] += 1
            st["peak"] = max(st["peak"], st["active"])
            await asyncio.sleep(0.01)
            st["active"] -= 1
            return 0

        f = ns["Fetcher"](fetch, limit=3)
        await asyncio.gather(*(f.get(k) for k in "abcdef" * 3))
        assert sorted(calls) == list("abcdef"), "single-flight: one load per key, got %s" % calls
        assert st["peak"] == 3, "the cap holds and is used: %s" % st

        async def inc(v):
            await asyncio.sleep(0)
            return v + 1

        await asyncio.gather(*(f.update("a", inc) for _ in range(10)))
        assert f.cache["a"] == 10, "the per-key lock stops lost updates: %s" % f.cache["a"]

        async def slow(key):
            calls.append(key)
            await asyncio.sleep(0.05)
            return "v"

        g = ns["Fetcher"](slow)
        r = await asyncio.gather(asyncio.wait_for(g.get("z"), 0.01), g.get("z"), g.get("z"), return_exceptions=True)
        assert isinstance(r[0], asyncio.TimeoutError) and r[1:] == ["v", "v"], r
        assert calls.count("z") == 1, "the caller that timed out did not cancel the shared load"

        n = {"c": 0}

        async def flaky(key):
            n["c"] += 1
            if n["c"] == 1:
                raise RuntimeError("boom")
            return "ok"

        h = ns["Fetcher"](flaky)
        await araises(RuntimeError, h.get("k"))
        assert await h.get("k") == "ok", "a failed load is not cached"

    asyncio.run(main())


@check("concurrency", "Thread-safe counter")
def _counter(ns):
    c = ns["Counter"]()
    threads(*[lambda: [c.add() for _ in range(1000)]] * 8)
    assert c.value == 8000
    c2 = ns["Counter"]()
    c2.add(5)
    assert c2.value == 5


@check("concurrency", "Cache that loads each key once")
def _cache(ns):
    calls = []

    def load_(key):
        calls.append(key)
        time.sleep(0.1)
        return key.upper()

    out = []
    cache = ns["Cache"](load_)
    threads(*[lambda: out.append(cache.get("u1"))] * 5)
    assert calls == ["u1"] and out == ["U1"] * 5, (calls, out)
    calls.clear()
    t0 = time.perf_counter()
    threads(*[lambda k=k: cache.get(k) for k in "abc"])
    assert len(calls) == 3 and time.perf_counter() - t0 < 0.25, "different keys load at the same time"
    n = {"c": 0}

    def flaky(key):
        n["c"] += 1
        if n["c"] == 1:
            raise RuntimeError("boom")
        return "ok"

    c = ns["Cache"](flaky)
    raises(RuntimeError, c.get, "k")
    assert c.get("k") == "ok", "a failed load stores nothing"


@check("concurrency", "Results in order")
def _order(ns):
    delays = {"a": 0.3, "b": 0.1, "c": 0.2}

    def fetch(k):
        time.sleep(delays[k])
        return k.upper()

    assert ns["fetch_all"](list("abc"), fetch) == ["A", "B", "C"]
    assert ns["fetch_ready_first"](list("abc"), fetch) == [("b", "B"), ("c", "C"), ("a", "A")]

    def bad(k):
        if k == "b":
            raise ValueError(k)
        return k

    raises(ValueError, ns["fetch_all"], list("ab"), bad)
    raises(ValueError, ns["fetch_ready_first"], list("ab"), bad)


@check("concurrency", "Two locks without deadlock")
def _transfer(ns):
    A, transfer = ns["Account"], ns["transfer"]
    a, b = A(1, 100), A(2, 50)
    threads(lambda: transfer(a, b, 30), lambda: transfer(b, a, 10))
    assert (a.balance, b.balance) == (80, 70), (a.balance, b.balance)
    assert transfer(a, b, 500) is False and (a.balance, b.balance) == (80, 70)
    assert transfer(a, a, 1) is False
    class Slow:                      # a lock that lingers after it is taken, so opposite transfers collide
        def __init__(self):
            self._l = threading.Lock()

        def __enter__(self):
            self._l.acquire()
            time.sleep(0.002)

        def __exit__(self, *exc):
            self._l.release()

    a, b = A(1, 1000), A(2, 1000)
    a.lock, b.lock = Slow(), Slow()
    threads(*[lambda: [transfer(a, b, 1) for _ in range(20)], lambda: [transfer(b, a, 1) for _ in range(20)]] * 4, timeout=15)
    assert a.balance + b.balance == 2000, "money is conserved"


@check("concurrency", "A bounded queue with N workers")
def _pipeline(ns):
    async def main():
        st = {"active": 0, "peak": 0}

        async def square(x):
            st["active"] += 1
            st["peak"] = max(st["peak"], st["active"])
            await asyncio.sleep(0.005)
            st["active"] -= 1
            return x * x

        out = await ns["run_pipeline"](list(range(20)), square, workers=3, size=5)
        assert out == [x * x for x in range(20)] and st["peak"] <= 3, (out, st)

        async def bad(x):
            if x == 3:
                raise ValueError(x)
            return x

        out = await ns["run_pipeline"](list(range(6)), bad, workers=2, size=2)
        assert isinstance(out[3], ValueError) and out[:3] == [0, 1, 2] and out[4:] == [4, 5], out
        assert await ns["run_pipeline"]([], bad) == []

    asyncio.run(main())


@check("concurrency", "Timeout and cancellation")
def _timeout(ns):
    async def main():
        seen = []

        async def slow(key):
            try:
                await asyncio.sleep(1)
            except asyncio.CancelledError:
                seen.append("cancelled")
                raise

        assert await ns["fetch_or_none"](slow, "k", 0.02) is None and seen == ["cancelled"]

        async def quick(key):
            return key

        assert await ns["fetch_or_none"](quick, "k", 1) == "k"
        log = []

        async def job():
            await asyncio.sleep(1)

        t = asyncio.create_task(ns["worker"](job, log))
        await asyncio.sleep(0)
        t.cancel()
        await araises(asyncio.CancelledError, t)
        assert log == ["cleanup"]

    asyncio.run(main())


@check("concurrency", "Async retry")
def _retry(ns):
    Transient, call = ns["Transient"], ns["call_with_retry"]

    async def main():
        waits, n = [], {"c": 0}

        async def sleep(s):
            waits.append(s)

        async def flaky():
            n["c"] += 1
            if n["c"] < 3:
                raise Transient()
            return "ok"

        assert await call(flaky, sleep=sleep) == "ok" and n["c"] == 3
        assert len(waits) == 2 and waits[0] <= 0.1 and waits[1] <= 0.2, waits
        n["c"] = 0

        async def bad():
            n["c"] += 1
            raise ValueError()

        await araises(ValueError, call(bad, sleep=sleep))
        assert n["c"] == 1, "a non-transient error is not retried"
        n["c"] = 0

        async def always():
            n["c"] += 1
            raise Transient()

        await araises(Transient, call(always, attempts=3, sleep=sleep))
        assert n["c"] == 3

        async def hang():
            await asyncio.sleep(1)

        await araises(asyncio.TimeoutError, call(hang, attempts=2, per_try=0.01, sleep=sleep))

    asyncio.run(main())


@check("concurrency", "Blocking calls inside async code")
def _blocking(ns):
    async def main():
        t0 = time.perf_counter()
        out = await ns["read_all"](list("abcde"))
        assert out == list("ABCDE") and time.perf_counter() - t0 < 0.3, "the five calls overlap"

    asyncio.run(main())


@check("concurrency", "Print in order")
def _print_in_order(ns):
    for order in itertools.permutations(["first", "second", "third"]):
        foo, out = ns["Foo"](), []
        calls = {k: (lambda k=k: getattr(foo, k)(lambda: out.append(k))) for k in order}
        ts = [threading.Thread(target=calls[k], daemon=True) for k in order]
        for t in ts:
            t.start()
            time.sleep(0.005)
        for t in ts:
            t.join(5)
        assert "".join(out) == "firstsecondthird", (order, out)


@check("concurrency", "Design bounded blocking queue")
def _bounded_queue(ns):
    q, got = ns["BoundedBlockingQueue"](2), []
    prod = threading.Thread(target=lambda: [q.enqueue(i) for i in (1, 2, 3)], daemon=True)
    prod.start()
    time.sleep(0.05)
    assert q.size() == 2, "the third enqueue is blocked"
    threads(lambda: got.extend(q.dequeue() for _ in range(3)))
    prod.join(5)
    assert got == [1, 2, 3] and q.size() == 0, got
    q2, res = ns["BoundedBlockingQueue"](1), []
    t = threading.Thread(target=lambda: res.append(q2.dequeue()), daemon=True)
    t.start()
    time.sleep(0.05)
    assert not res, "dequeue waits on an empty queue"
    q2.enqueue(7)
    t.join(5)
    assert res == [7]
    q3, seen = ns["BoundedBlockingQueue"](3), []
    producers = [lambda s=s: [q3.enqueue(s * 100 + i) for i in range(50)] for s in range(4)]
    consumers = [lambda: [seen.append(q3.dequeue()) for _ in range(50)] for _ in range(4)]
    threads(*producers, *consumers, timeout=20)
    assert sorted(seen) == sorted(s * 100 + i for s in range(4) for i in range(50))


@check("concurrency", "Fizz Buzz multithreaded")
def _fizzbuzz(ns):
    for n in (15, 2, 1, 30):
        fb, out = ns["FizzBuzz"](n), []
        jobs = [lambda: fb.fizz(lambda: out.append("fizz")), lambda: fb.buzz(lambda: out.append("buzz")),
                lambda: fb.fizzbuzz(lambda: out.append("fizzbuzz")), lambda: fb.number(lambda i: out.append(i))]
        random.shuffle(jobs)
        threads(*jobs)
        want = ["fizzbuzz" if i % 15 == 0 else "fizz" if i % 3 == 0 else "buzz" if i % 5 == 0 else i for i in range(1, n + 1)]
        assert out == want, (n, out)


@check("concurrency", "Building H2O")
def _h2o(ns):
    for _ in range(40):
        h2o, out = ns["H2O"](), []
        atoms = ["H"] * 8 + ["O"] * 4
        random.shuffle(atoms)
        jobs = [(lambda a=a: (h2o.hydrogen if a == "H" else h2o.oxygen)(lambda: out.append(a))) for a in atoms]
        threads(*jobs)
        assert len(out) == 12 and all(sorted(out[i:i + 3]) == ["H", "H", "O"] for i in range(0, 12, 3)), out


# ---- ood ----

@check("ood")
def _cart(ns):
    Cart, Item, Pct, Flat = ns["Cart"], ns["Item"], ns["PercentOff"], ns["FlatOff"]

    def total(ds):
        c = Cart(ds)
        c.add(Item("a", 2000, 2))
        c.add(Item("b", 500))
        return c.total()

    assert total([]) == 4500
    assert total([Pct(10), Flat(300)]) == 3750
    assert total([Flat(300), Pct(10)]) == 3780, "order matters"
    assert total([Flat(10 ** 6)]) == 0, "never below zero"
    raises(TypeError, ns["Discount"])


@check("ood", "Model the nouns")
def _nouns(ns):
    import dataclasses
    Size, Vehicle = ns["Size"], ns["Vehicle"]
    small, large = Vehicle("KA01", Size.SMALL), Vehicle("KA02", Size.LARGE)
    assert ns["Compact"]().fits(small) is True and ns["Compact"]().fits(large) is False
    raises(dataclasses.FrozenInstanceError, setattr, small, "plate", "x")
    raises(TypeError, ns["Spot"])
    assert small == Vehicle("KA01", Size.SMALL)


@check("ood", "Factory")
def _factory(ns):
    assert ns["make_notifier"]("sms").send("ann", "hi") == "sms ann: hi"
    assert ns["make_notifier"]("email").send("ann", "hi") == "email ann: hi"
    assert "fax" in str(raises(ValueError, ns["make_notifier"], "fax"))


@check("ood", "Observer")
def _observer(ns):
    s, a, b = ns["Stock"](1), [], []
    s.subscribe(a.append)
    off = s.subscribe(b.append)
    s.set_price(10)
    s.set_price(12)
    assert a == [10, 12] and b == [10, 12]
    off()
    s.set_price(15)
    assert a == [10, 12, 15] and b == [10, 12]
    s2, seen = ns["Stock"](1), []
    cancel = []
    cancel.append(s2.subscribe(lambda p: (seen.append(p), cancel[0]())))     # unsubscribes while being called
    s2.subscribe(seen.append)
    s2.set_price(5)
    assert seen == [5, 5], seen


@check("ood", "State")
def _state(ns):
    t = ns["Turnstile"]()
    assert [t.coin(), t.push(), t.push()] == ["unlocked", "passed", "locked"]
    t = ns["Turnstile"]()
    assert [t.coin(), t.coin()] == ["unlocked", "already unlocked"]


@check("ood", "Composite")
def _composite(ns):
    File, Folder = ns["File"], ns["Folder"]
    root = Folder("root").add(File("a", 10)).add(Folder("sub").add(File("b", 5)))
    assert root.total_size() == 15 and Folder("e").total_size() == 0


@check("ood", "Singleton")
def _singleton(ns):
    REG, Registry, register = ns["REGISTRY"], ns["Registry"], ns["register"]
    register("a", 1)
    assert REG.items == {"a": 1}
    mine = register("a", 2, Registry())
    assert mine.items == {"a": 2} and REG.items == {"a": 1}


@check("ood", "Money and time")
def _money(ns):
    Money, Clock, Ticket = ns["Money"], ns["Clock"], ns["Ticket"]

    class Fake(Clock):
        t = 0.0

        def now(self):
            return self.t

    clock = Fake()
    ticket = Ticket(clock, Money(200))
    clock.t = 1
    assert ticket.fee() == Money(200), "minimum one hour"
    clock.t = 5400
    assert ticket.fee() == Money(400), "90 minutes bills 2 started hours"
    clock.t = 3600
    assert ticket.fee() == Money(200), "exactly one hour is one hour"
    assert str(Money(1050)) == "10.50" and str(Money(5)) == "0.05" and Money(5) + Money(7) == Money(12)
    assert isinstance(Clock().now(), float)


@check("ood", "Parking lot")
def _parking(ns):
    Size, Vehicle, Lot = ns["Size"], ns["Vehicle"], ns["ParkingLot"]
    now = {"t": 0.0}
    lot = Lot([Size.SMALL, Size.LARGE], lambda: now["t"])
    t1, t2 = lot.park(Vehicle("a", Size.SMALL)), lot.park(Vehicle("b", Size.SMALL))
    assert (t1.spot_id, t2.spot_id) == (0, 1)
    assert lot.park(Vehicle("c", Size.SMALL)) is None
    now["t"] = 5400
    assert lot.leave(t2.id) == 400
    t3 = lot.park(Vehicle("c", Size.SMALL))
    assert t3.spot_id == 1 and t3.id != t2.id
    assert Lot([Size.SMALL], lambda: 0).park(Vehicle("x", Size.LARGE)) is None
    raises(KeyError, lot.leave, t2.id)


@check("ood", "In-memory file system")
def _fs(ns):
    fs = ns["FileSystem"]()
    assert fs.ls("/") == []
    fs.mkdir("/a/b/c")
    fs.add_content("/a/b/c/d", "hello")
    assert fs.ls("/") == ["a"] and fs.ls("/a/b/c") == ["d"] and fs.ls("/a/b/c/d") == ["d"]
    fs.add_content("/a/b/c/d", "!")
    assert fs.read_content("/a/b/c/d") == "hello!"
    fs.mkdir("/a/z")
    fs.add_content("/a/y", "")
    assert fs.ls("/a") == ["b", "y", "z"]
    raises(FileNotFoundError, fs.ls, "/nope")


@check("ood", "Shopping cart")
def _coupons(ns):
    Coupon, Cart = ns["Coupon"], ns["Cart"]
    cart = Cart([Coupon("SAVE10", percent=10), Coupon("TAKE3", flat_cents=300, min_spend_cents=4000), Coupon("BIG", flat_cents=1, min_spend_cents=10 ** 6)])
    cart.add("a", 2000, 2)
    cart.add("b", 500)
    cart.add("b", 0, 0)
    assert cart.subtotal() == 4500
    assert cart.apply("SAVE10") is True and cart.apply("SAVE10") is False
    assert cart.apply("nope") is False and cart.apply("BIG") is False
    assert cart.apply("TAKE3") is True
    assert cart.total() == 3750
    tiny = Cart([Coupon("X", flat_cents=999)])
    tiny.add("a", 100)
    tiny.apply("X")
    assert tiny.total() == 0


@check("ood", "Library")
def _library(ns):
    lib = ns["Library"]()
    lib.add_book("b1")
    lib.add_book("b2", 2)
    lib.join("ann")
    lib.join("bob")
    assert lib.borrow("ann", "b1", 1) is True
    assert lib.borrow("bob", "b1", 2) is False, "no copy left"
    assert lib.borrow("ann", "b2", 3) is True and lib.borrow("ann", "b2", 3) is False, "already holds it"
    assert lib.give_back("ann", "b1", 20) == 125
    assert lib.borrow("bob", "b1", 21) is True
    assert lib.give_back("bob", "b1", 22) == 0
    assert lib.give_back("ann", "b2", 3) == 0
    lib.add_book("b3")
    lib.add_book("b4")
    assert [lib.borrow("ann", i, 30) for i in ("b1", "b2", "b3", "b4")] == [True, True, True, False], "3 loans at most"


@check("ood", "Elevator")
def _elevator(ns):
    e = ns["Elevator"](10)
    for f in (5, 2, 8):
        e.request(f)
    assert e.run() == [2, 5, 8] and e.floor == 8
    e.request(3)
    e.request(9)
    assert e.run() == [9, 3]
    e.request(3)
    e.request(99)
    assert e.run() == [] and e.floor == 3
    e2 = ns["Elevator"](10)
    e2.request(5)
    e2.step()
    e2.step()
    e2.request(1)
    e2.request(4)
    assert e2.run() == [4, 5, 1], "a request ahead is served on the way, one behind on the way back"
    assert e2.step() is None and e2.dir.name == "IDLE"


@check("ood", "Time-based key-value store")
def _timemap(ns):
    m = ns["TimeMap"]()
    m.set("k", "a", 1)
    m.set("k", "b", 4)
    assert [m.get("k", t) for t in (0, 1, 3, 4, 5)] == ["", "a", "a", "b", "b"]
    assert m.get("missing", 9) == ""
