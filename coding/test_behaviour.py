"""Behaviour checks for the concurrency and ood patterns, and for the Algorithms tab, in coding/data.js.

    python coding/test_data.py        runs these after the code-block pass

test_data.py proves that every code block runs. These checks prove the code does what the page says: the
template, each variation and each classic problem of the two patterns is run against the behaviour its
statement promises (one load per key, a cap that holds, no lost update, no deadlock, the right order, the
right total). They read the code from the data, so a change on the page that breaks the code fails here.

The last section checks every algorithm on the Algorithms tab (D["algos"]): each block runs on its own, each page example
is called, and each algorithm has a check, mostly against a brute force on small random inputs.
"""
import ast, asyncio, bisect, collections, functools, inspect, itertools, math, random, statistics, threading, time

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


# ---- the Algorithms tab (D["algos"]) ----
#
# Every block of every algorithm runs on its own (a "# needs" first line lets a variant use the block above it).
# TreeNode and ListNode are the two classes the page assumes. Each algorithm must have a check below; a check
# fetches names from `ns`, and a function or class that no check fetched is a failure, so a variant cannot sit
# on the page untested. Most checks compare with a brute force on small random inputs (fixed seed).

ALGO = {}


def algo(aid):
    """Register the check for the algorithm `aid`; it gets a Names dict holding every function and class of the item."""
    def deco(fn):
        ALGO[aid] = fn
        return fn
    return deco


class Names(dict):
    """The names an item defines; remembers which ones a check asked for."""
    def __init__(self, *a):
        super().__init__(*a)
        self.used = set()

    def __getitem__(self, k):
        self.used.add(k)
        return super().__getitem__(k)


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


def T(xs):
    """A tree from a level-order list with None for gaps, as the page writes them."""
    if not xs or xs[0] is None:
        return None
    nodes = [None if x is None else TreeNode(x) for x in xs]
    kids = iter(nodes[1:])
    for n in nodes:
        if n:
            n.left, n.right = next(kids, None), next(kids, None)
    return nodes[0]


def flat(root):
    out, q = [], collections.deque([root])
    while q:
        n = q.popleft()
        if n is None:
            out.append(None)
        else:
            out.append(n.val)
            q.append(n.left)
            q.append(n.right)
    while out and out[-1] is None:
        out.pop()
    return out


def L(xs):
    head = None
    for x in reversed(xs):
        head = ListNode(x, head)
    return head


def unL(n):
    out = []
    while n:
        out.append(n.val)
        n = n.next
    return out


def nodes_of(root):
    out, st = [], [root] if root else []
    while st:
        n = st.pop()
        out.append(n)
        st += [c for c in (n.left, n.right) if c]
    return out


def rand_tree(r, n, distinct=False):
    if n == 0:
        return None
    vals = r.sample(range(-50, 50), n) if distinct else [r.randint(-9, 9) for _ in range(n)]
    root = TreeNode(vals[0])
    slots = [(root, "left"), (root, "right")]
    for v in vals[1:]:
        node, side = slots.pop(r.randrange(len(slots)))
        child = TreeNode(v)
        setattr(node, side, child)
        slots += [(child, "left"), (child, "right")]
    return root


def ref_insert(root, v):
    if not root:
        return TreeNode(v)
    cur = root
    while True:
        side = "left" if v < cur.val else "right"
        if getattr(cur, side) is None:
            setattr(cur, side, TreeNode(v))
            return root
        cur = getattr(cur, side)


def rand_bst(r, n):
    root = None
    for v in r.sample(range(-50, 50), n):
        root = ref_insert(root, v)
    return root


def ref_inorder(root):
    return ref_inorder(root.left) + [root.val] + ref_inorder(root.right) if root else []


def ref_height(n):
    return 1 + max(ref_height(n.left), ref_height(n.right)) if n else 0


def pick(ns, *names):
    return [ns[k] for k in names]


def fresh():
    return {"__name__": "algo", "TreeNode": TreeNode, "ListNode": ListNode}


def public(g):
    return {k for k, v in g.items() if (inspect.isfunction(v) or inspect.isclass(v)) and getattr(v, "__module__", None) == "algo" and not k.startswith("_")}


def load_algo(it):
    """Run an item's main block and each variant; returns (Names of every function and class, the main block's namespace)."""
    main = fresh()
    exec(it["code"], main)
    ns = Names({k: main[k] for k in public(main)})
    for v in it["vars"]:
        g = dict(main) if v["code"].lstrip().startswith("# needs") else fresh()
        before = public(g)
        exec(v["code"], g)
        new = public(g) - before
        assert new, "variant %s defines nothing" % v["n"]
        for k in new:
            assert k not in ns, "variant %s redefines %s" % (v["n"], k)
            dict.__setitem__(ns, k, g[k])
    return ns, main


def _kwargs(text):
    try:
        call = ast.parse("f(" + text.replace(" = ", "=") + ")", mode="eval").body
        return {k.arg: ast.literal_eval(k.value) for k in call.keywords} if call.keywords and not call.args else None
    except (ValueError, SyntaxError):
        return None


def _plain(got):
    if isinstance(got, TreeNode):
        return flat(got)
    if isinstance(got, ListNode):
        return unL(got)
    return got


def run_example(it, main):
    """Call the function whose parameters match the example's keywords. Returns True (checked), False (not callable), or raises."""
    ex = it.get("ex")
    kw = _kwargs(ex["i"]) if ex else None
    try:
        want = ast.literal_eval(ex["o"]) if ex else None
    except (ValueError, SyntaxError):
        return False
    if not kw:
        return False
    fn = None
    pub = public(main)
    for k, f in main.items():
        if k in pub and inspect.isfunction(f):
            ps = inspect.signature(f).parameters
            req = {n for n, p in ps.items() if p.default is inspect.Parameter.empty}
            if req <= set(kw) <= set(ps):
                fn = f
                break
    if fn is None:
        return False
    args = dict(kw)
    if isinstance(args.get("root"), list):
        args["root"] = T(args["root"])
        for k in ("p", "q"):
            if k in args:
                args[k] = next(n for n in nodes_of(args["root"]) if n.val == args[k])
    got = fn(**args)
    if isinstance(got, TreeNode) and not isinstance(want, list):
        got = got.val
    got = _plain(got)
    assert got == want, "%s(%s) gave %r, the page says %r" % (fn.__name__, it["ex"]["i"], got, want)
    return True


def run_algos(D):
    """Returns (blocks that ran, checks run, examples checked, examples not callable, failures)."""
    ran = checks = ex_ok = ex_skip = 0
    fails = []
    ids = set()
    for grp in D["algos"]:
        for it in grp["items"]:
            ids.add(it["id"])
            label = "algos/" + it["id"]
            try:
                ns, main = load_algo(it)
                ran += 1 + len(it["vars"])
                if run_example(it, main):
                    ex_ok += 1
                else:
                    ex_skip += 1
                assert it["id"] in ALGO, "no check registered"
                ALGO[it["id"]](ns)
                checks += 1
                left = sorted(set(ns) - ns.used)
                assert not left, "no check touched " + ", ".join(left)
            except Exception as ex:
                fails.append("%s: %s %s" % (label, type(ex).__name__, ex))
    for aid in sorted(set(ALGO) - ids):
        fails.append("algos/%s: a check for an algorithm that is not on the page" % aid)
    return ran, checks, ex_ok, ex_skip, fails


R = random.Random(20261021)


@algo("binary-search")
def _(ns):
    bs, lb, ub, cnt = pick(ns, "binary_search", "lower_bound", "upper_bound", "count_of")
    for _ in range(300):
        a = sorted(R.randint(0, 12) for _ in range(R.randint(0, 12)))
        for x in range(-1, 15):
            assert lb(a, x) == bisect.bisect_left(a, x), (a, x)
            assert ub(a, x) == bisect.bisect_right(a, x), (a, x)
            i = bs(a, x)
            assert (i == -1 and x not in a) or (i >= 0 and a[i] == x), (a, x, i)
            assert cnt(a, x) == a.count(x)


@algo("binary-search-answer")
def _(ns):
    ft, ms, ship, isq = pick(ns, "first_true", "min_speed", "ship_within_days", "isqrt_floor")
    assert ft(0, 100, lambda x: x >= 37) == 37 and ft(5, 9, lambda x: True) == 5 and ft(5, 9, lambda x: x >= 9) == 9
    assert [isq(n) for n in range(300)] == [math.isqrt(n) for n in range(300)]
    assert ms([30, 11, 23, 4, 20], 5) == 30 and ms([30, 11, 23, 4, 20], 6) == 23
    assert ship([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5) == 15 and ship([3, 2, 2, 4, 1, 4], 3) == 6
    for _ in range(200):
        piles = [R.randint(1, 20) for _ in range(R.randint(1, 6))]
        h = R.randint(len(piles), len(piles) + 12)
        want = next(k for k in range(1, max(piles) + 1) if sum(-(-p // k) for p in piles) <= h)
        assert ms(piles, h) == want, (piles, h)
        w = [R.randint(1, 9) for _ in range(R.randint(1, 8))]
        d = R.randint(1, len(w))

        def days(cap):
            n, load = 1, 0
            for x in w:
                if load + x > cap:
                    n, load = n + 1, 0
                load += x
            return n
        assert ship(w, d) == next(c for c in range(max(w), sum(w) + 1) if days(c) <= d), (w, d)


@algo("two-pointers")
def _(ns):
    two, area, three, dd = pick(ns, "two_sum_sorted", "max_area", "three_sum", "dedupe_sorted")
    for _ in range(300):
        a = sorted(R.randint(-6, 12) for _ in range(R.randint(0, 9)))
        t = R.randint(-5, 20)
        got = two(a, t)
        pairs = [(i, j) for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] + a[j] == t]
        if got:
            assert got[0] < got[1] and a[got[0]] + a[got[1]] == t, (a, t, got)
        else:
            assert not pairs, (a, t)
        h = [R.randint(0, 9) for _ in range(R.randint(2, 9))]
        assert area(h) == max(min(h[i], h[j]) * (j - i) for i in range(len(h)) for j in range(i + 1, len(h))), h
        nums = [R.randint(-4, 4) for _ in range(R.randint(0, 9))]
        keep = list(nums)
        want = {tuple(sorted(c)) for c in itertools.combinations(nums, 3) if sum(c) == 0}
        got = three(nums)
        assert nums == keep, "three_sum changed its input"
        assert sorted(map(tuple, got)) == sorted(want), (nums, got)
        b = sorted(nums)
        n = dd(b)
        assert b[:n] == sorted(set(nums)), (nums, b, n)
    assert dd([]) == 0


@algo("window-fixed")
def _(ns):
    ms, wm, fa = pick(ns, "max_sum_k", "window_max", "find_anagrams")
    assert ms([1, 2], 3) is None
    for _ in range(300):
        a = [R.randint(-5, 9) for _ in range(R.randint(1, 10))]
        k = R.randint(1, len(a))
        assert ms(a, k) == max(sum(a[i:i + k]) for i in range(len(a) - k + 1)), (a, k)
        assert wm(a, k) == [max(a[i:i + k]) for i in range(len(a) - k + 1)], (a, k)
        s = "".join(R.choice("abc") for _ in range(R.randint(0, 10)))
        p = "".join(R.choice("abc") for _ in range(R.randint(1, 3)))
        want = [i for i in range(len(s) - len(p) + 1) if sorted(s[i:i + len(p)]) == sorted(p)]
        assert fa(s, p) == want, (s, p)


@algo("window-variable")
def _(ns):
    lu, lk, mw = pick(ns, "longest_unique", "longest_k_distinct", "min_window")
    for _ in range(400):
        s = "".join(R.choice("abcd") for _ in range(R.randint(0, 11)))
        subs = [s[i:j] for i in range(len(s)) for j in range(i + 1, len(s) + 1)]
        assert lu(s) == max([len(x) for x in subs if len(set(x)) == len(x)] + [0]), s
        k = R.randint(1, 3)
        assert lk(s, k) == max([len(x) for x in subs if len(set(x)) <= k] + [0]), (s, k)
        t = "".join(R.choice("abcd") for _ in range(R.randint(0, 4)))
        want = ""
        if t:
            for n in range(len(t), len(s) + 1):
                hit = [s[i:i + n] for i in range(len(s) - n + 1) if not collections.Counter(t) - collections.Counter(s[i:i + n])]
                if hit:
                    want = hit[0]
                    break
        assert mw(s, t) == want, (s, t)
    assert mw("ADOBECODEBANC", "ABC") == "BANC"


@algo("prefix-map")
def _(ns):
    ss, bp, rs, ls = pick(ns, "subarray_sum", "build_prefix", "range_sum", "longest_sum_k")
    for _ in range(300):
        a = [R.randint(-3, 4) for _ in range(R.randint(0, 10))]
        k = R.randint(-3, 5)
        spans = [(i, j) for i in range(len(a)) for j in range(i, len(a)) if sum(a[i:j + 1]) == k]
        assert ss(a, k) == len(spans), (a, k)
        assert ls(a, k) == max([j - i + 1 for i, j in spans] + [0]), (a, k)
        p = bp(a)
        assert len(p) == len(a) + 1
        for i in range(len(a)):
            for j in range(i, len(a)):
                assert rs(p, i, j) == sum(a[i:j + 1])


@algo("brackets")
def _(ns):
    ok, add = pick(ns, "is_valid", "min_add_to_make_valid")

    def reduces(s):
        while "()" in s or "[]" in s or "{}" in s:
            s = s.replace("()", "").replace("[]", "").replace("{}", "")
        return s == ""
    for _ in range(600):
        s = "".join(R.choice("()[]{}") for _ in range(R.randint(0, 10)))
        assert ok(s) == reduces(s), s
        q = "".join(R.choice("()") for _ in range(R.randint(0, 10)))
        r = q
        while "()" in r:
            r = r.replace("()", "")
        assert add(q) == len(r), q
    assert ok("([]{})") and not ok("(]") and not ok("]") and ok("")


@algo("monotonic-stack")
def _(ns):
    ng, dt, lr = pick(ns, "next_greater", "daily_temperatures", "largest_rectangle")
    for _ in range(400):
        a = [R.randint(0, 9) for _ in range(R.randint(0, 10))]
        assert ng(a) == [next((x for x in a[i + 1:] if x > a[i]), -1) for i in range(len(a))], a
        assert dt(a) == [next((j - i for j in range(i + 1, len(a)) if a[j] > a[i]), 0) for i in range(len(a))], a
        want = max([min(a[i:j + 1]) * (j - i + 1) for i in range(len(a)) for j in range(i, len(a))] + [0])
        assert lr(list(a)) == want, a
    assert lr([2, 1, 5, 6, 2, 3]) == 10


@algo("tree-dfs")
def _(ns):
    pre, ino, post, ino_i, pre_i, post_i = pick(ns, "preorder", "inorder", "postorder", "inorder_iter", "preorder_iter", "postorder_iter")

    def rpre(n):
        return [n.val] + rpre(n.left) + rpre(n.right) if n else []

    def rpost(n):
        return rpost(n.left) + rpost(n.right) + [n.val] if n else []
    for _ in range(300):
        t = rand_tree(R, R.randint(0, 12))
        assert pre(t) == rpre(t) and ino(t) == ref_inorder(t) and post(t) == rpost(t)
        assert pre_i(t) == rpre(t) and ino_i(t) == ref_inorder(t) and post_i(t) == rpost(t)
    root = cur = TreeNode(0)
    for i in range(1, 5000):
        cur.right = TreeNode(i)
        cur = cur.right
    assert ino_i(root) == pre_i(root) == list(range(5000)) and post_i(root) == list(range(4999, -1, -1))


@algo("level-order")
def _(ns):
    lo, rv, zz = pick(ns, "level_order", "right_side_view", "zigzag")
    assert lo(None) == [] and rv(None) == [] and zz(None) == []
    for _ in range(300):
        t = rand_tree(R, R.randint(1, 12))
        levels, row = [], [t]
        while row:
            levels.append([n.val for n in row])
            row = [c for n in row for c in (n.left, n.right) if c]
        assert lo(t) == levels
        assert rv(t) == [x[-1] for x in levels]
        assert zz(t) == [x if i % 2 == 0 else x[::-1] for i, x in enumerate(levels)]


@algo("validate-bst")
def _(ns):
    v, vi, kth = pick(ns, "is_valid_bst", "is_valid_bst_inorder", "kth_smallest")
    assert v(T([5, 1, 4, None, None, 3, 6])) is False and vi(T([5, 1, 4, None, None, 3, 6])) is False
    assert v(T([2, 2, 2])) is False and vi(T([2, 2, 2])) is False and v(None) and vi(None)
    for _ in range(400):
        t = rand_bst(R, R.randint(0, 9)) if R.random() < 0.4 else rand_tree(R, R.randint(0, 9))
        io = ref_inorder(t)
        want = all(x < y for x, y in zip(io, io[1:]))
        assert v(t) == want and vi(t) == want, flat(t)
    for _ in range(100):
        t = rand_bst(R, R.randint(1, 10))
        io = ref_inorder(t)
        for k in range(1, len(io) + 1):
            assert kth(t, k) == io[k - 1]


@algo("lca")
def _(ns):
    f, fb = pick(ns, "lca", "lca_bst")
    for _ in range(300):
        t = rand_tree(R, R.randint(1, 12), distinct=True)
        ns_ = nodes_of(t)
        p, q = R.choice(ns_), R.choice(ns_)
        parent = {id(c): n for n in ns_ for c in (n.left, n.right) if c}
        up, x = [], p
        while x:
            up.append(x)
            x = parent.get(id(x))
        want, x = None, q
        while x:
            if any(x is u for u in up):
                want = x
                break
            x = parent.get(id(x))
        assert f(t, p, q) is want
        b = rand_bst(R, R.randint(1, 12))
        bn = nodes_of(b)
        p, q = R.choice(bn), R.choice(bn)
        assert fb(b, p, q) is f(b, p, q)


@algo("serialize-tree")
def _(ns):
    s, d, sb, db = pick(ns, "serialize", "deserialize", "serialize_bfs", "deserialize_bfs")
    assert s(None) == "#" and d("#") is None and sb(None) == "#" and db("#") is None
    for _ in range(400):
        t = rand_tree(R, R.randint(0, 12))
        assert flat(d(s(t))) == flat(t) and flat(db(sb(t))) == flat(t)
    assert sb(T([1, 2, 3])) == "1,2,3,#,#,#,#"


@algo("bst-edit")
def _(ns):
    ins, dele, ins_i, succ = pick(ns, "bst_insert", "bst_delete", "bst_insert_iter", "successor")
    for _ in range(200):
        model, a, b = [], None, None
        for _ in range(R.randint(1, 14)):
            v = R.randint(0, 20)
            a, b = ins(a, v), ins_i(b, v)
            model.append(v)
            assert flat(a) == flat(b)
        for _ in range(R.randint(1, 14)):
            k = R.randint(0, 20)
            a = dele(a, k)
            if k in model:
                model.remove(k)
            io = ref_inorder(a)
            assert io == sorted(model), (k, io, model)
        if a:
            for p in nodes_of(a):
                nxt = [x for x in sorted(model) if x > p.val]
                got = succ(a, p)
                assert (got.val if got else None) == (nxt[0] if nxt else None)
    assert dele(None, 3) is None


@algo("tree-height")
def _(ns):
    dia, depth, mps = pick(ns, "diameter", "max_depth", "max_path_sum")
    assert dia(None) == 0 and depth(None) == 0

    def paths_best(t):
        ns_ = nodes_of(t)
        adj = {id(n): [] for n in ns_}
        for n in ns_:
            for c in (n.left, n.right):
                if c:
                    adj[id(n)].append(c)
                    adj[id(c)].append(n)
        best = float("-inf")
        for u in ns_:
            st = [(u, None, u.val)]
            while st:
                x, par, tot = st.pop()
                best = max(best, tot)
                for y in adj[id(x)]:
                    if y is not par:
                        st.append((y, x, tot + y.val))
        return best
    for _ in range(300):
        t = rand_tree(R, R.randint(1, 9))
        assert depth(t) == ref_height(t)
        assert dia(t) == max(ref_height(n.left) + ref_height(n.right) for n in nodes_of(t))
        assert mps(t) == paths_best(t), flat(t)
    assert mps(T([-10, 9, 20, None, None, 15, 7])) == 42


def rand_graph(r, n, p=0.3, directed=False):
    g = {i: [] for i in range(n)}
    for i in range(n):
        for j in range(n if directed else i):
            if i != j and r.random() < p:
                g[i].append(j)
                if not directed:
                    g[j].append(i)
    return g


def closure(g):
    """Hop counts between every pair, by Floyd-Warshall (None when unreachable)."""
    inf = float("inf")
    d = {(u, v): (0 if u == v else 1 if v in g[u] else inf) for u in g for v in g}
    for k in g:
        for i in g:
            for j in g:
                if d[i, k] + d[k, j] < d[i, j]:
                    d[i, j] = d[i, k] + d[k, j]
    return d


def adj_edges(edges, directed=False):
    n = 1 + max([max(e[:2]) for e in edges] + [-1])
    g = {i: [] for i in range(n)}
    for e in edges:
        g[e[0]].append(e[1])
        if not directed:
            g[e[1]].append(e[0])
    return g


@algo("bfs")
def _(ns):
    bfs, steps = pick(ns, "bfs", "grid_steps")
    for _ in range(200):
        n = R.randint(1, 8)
        g = rand_graph(R, n)
        d = closure(g)
        s = R.randrange(n)
        assert bfs(g, s) == {v: d[s, v] for v in g if d[s, v] != float("inf")}, g
        rows, cols = R.randint(1, 5), R.randint(1, 5)
        grid = [[1 if R.random() < 0.3 else 0 for _ in range(cols)] for _ in range(rows)]
        a, b = (R.randrange(rows), R.randrange(cols)), (R.randrange(rows), R.randrange(cols))
        grid[a[0]][a[1]] = grid[b[0]][b[1]] = 0
        dist = {a: 0}
        changed = True
        while changed:
            changed = False
            for r_ in range(rows):
                for c_ in range(cols):
                    if grid[r_][c_] == 0 and (r_, c_) in dist:
                        for nr, nc in ((r_ + 1, c_), (r_ - 1, c_), (r_, c_ + 1), (r_, c_ - 1)):
                            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and dist[r_, c_] + 1 < dist.get((nr, nc), 10 ** 9):
                                dist[nr, nc] = dist[r_, c_] + 1
                                changed = True
        assert steps(grid, a, b) == dist.get(b, -1), (grid, a, b)


@algo("dfs")
def _(ns):
    cc, it, isl = pick(ns, "count_components", "dfs_iter", "num_islands")
    for _ in range(200):
        n = R.randint(1, 8)
        g = rand_graph(R, n)
        d = closure(g)
        edges = [[u, v] for u in g for v in g[u] if u < v]
        assert cc(n, edges) == len({min(v for v in g if d[u, v] != float("inf")) for u in g}), edges
        s = R.randrange(n)
        order = it(g, s)
        assert order[0] == s and len(order) == len(set(order))
        assert set(order) == {v for v in g if d[s, v] != float("inf")}
        for i, v in enumerate(order[1:], 1):
            assert any(u in g[v] for u in order[:i]), "every visited node is next to an earlier one"
        rows, cols = R.randint(1, 5), R.randint(1, 5)
        grid = [["1" if R.random() < 0.45 else "0" for _ in range(cols)] for _ in range(rows)]
        label = {(r_, c_): r_ * cols + c_ for r_ in range(rows) for c_ in range(cols) if grid[r_][c_] == "1"}
        changed = True
        while changed:
            changed = False
            for (r_, c_), v in list(label.items()):
                for nb in ((r_ + 1, c_), (r_, c_ + 1), (r_ - 1, c_), (r_, c_ - 1)):
                    if nb in label and label[nb] < label[r_, c_]:
                        label[r_, c_] = label[nb]
                        changed = True
        assert isl(grid) == len(set(label.values())), grid


@algo("topological-sort")
def _(ns):
    kahn, dfs = pick(ns, "topo_kahn", "topo_dfs")
    for _ in range(300):
        n = R.randint(1, 8)
        perm = R.sample(range(n), n)
        edges = [[perm[i], perm[j]] for i in range(n) for j in range(i + 1, n) if R.random() < 0.3]
        for f in (kahn, dfs):
            order = f(n, edges)
            assert sorted(order) == list(range(n)), (f.__name__, edges, order)
            pos = {v: i for i, v in enumerate(order)}
            assert all(pos[a] < pos[b] for a, b in edges), (f.__name__, edges, order)
        if edges:
            a, b = R.choice(edges)
            cyc = edges + [[b, a]]
            assert kahn(n, cyc) == [] and dfs(n, cyc) == [], cyc
    assert kahn(1, [[0, 0]]) == [] and dfs(1, [[0, 0]]) == []


@algo("union-find")
def _(ns):
    UF, rc = pick(ns, "UnionFind", "redundant_connection")
    for _ in range(300):
        n = R.randint(1, 9)
        uf, comp = UF(n), list(range(n))
        for _ in range(R.randint(0, 12)):
            a, b = R.randrange(n), R.randrange(n)
            joined = comp[a] != comp[b]
            assert uf.union(a, b) == joined
            if joined:
                old = comp[b]
                comp = [comp[a] if c == old else c for c in comp]
            assert uf.count == len(set(comp))
            for x in range(n):
                assert (uf.find(x) == uf.find(a)) == (comp[x] == comp[a])
        n = R.randint(2, 8)
        order = R.sample(range(1, n + 1), n)
        edges = [[order[R.randrange(i)], order[i]] for i in range(1, n)]
        edges.append(R.sample(range(1, n + 1), 2))
        R.shuffle(edges)
        seen, want = {}, None
        for a, b in edges:
            ra, rb = a, b
            while seen.get(ra, ra) != ra:
                ra = seen[ra]
            while seen.get(rb, rb) != rb:
                rb = seen[rb]
            if ra == rb:
                want = [a, b]
                break
            seen[ra] = rb
        assert rc(edges) == want, edges
    assert rc([[1, 2], [1, 3], [2, 3]]) == [2, 3] and rc([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]) == [1, 4]


def rand_wgraph(r, n, lo=1, hi=9, p=0.4):
    return {u: [(v, r.randint(lo, hi)) for v in range(n) if v != u and r.random() < p] for u in range(n)}


def all_pairs(g, n):
    inf = float("inf")
    d = [[0 if i == j else inf for j in range(n)] for i in range(n)]
    for u in g:
        for v, w in g[u]:
            d[u][v] = min(d[u][v], w)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                d[i][j] = min(d[i][j], d[i][k] + d[k][j])
    return d


@algo("dijkstra")
def _(ns):
    dj, sp = pick(ns, "dijkstra", "shortest_path")
    inf = float("inf")
    for _ in range(300):
        n = R.randint(1, 8)
        g = rand_wgraph(R, n)
        d = all_pairs(g, n)
        s, t = R.randrange(n), R.randrange(n)
        assert dj(g, s) == {v: d[s][v] for v in range(n) if d[s][v] < inf}, g
        path = sp(g, s, t)
        if d[s][t] == inf:
            assert path == []
        else:
            assert path[0] == s and path[-1] == t
            cost = sum(min(w for v, w in g[a] if v == b) for a, b in zip(path, path[1:]))
            assert cost == d[s][t], (g, s, t, path)


@algo("bellman-ford")
def _(ns):
    bf, kf = pick(ns, "bellman_ford", "cheapest_within_k")
    inf = float("inf")
    for _ in range(300):
        n = R.randint(1, 6)
        edges = [[u, v, R.randint(-2, 6)] for u in range(n) for v in range(n) if u != v and R.random() < 0.35]
        g = {u: [(v, w) for a, v, w in edges if a == u] for u in range(n)}
        d = all_pairs(g, n)
        neg = any(d[i][i] < 0 for i in range(n))
        s = R.randrange(n)
        got = bf(n, edges, s)
        if any(d[s][i] < inf and d[i][i] < 0 for i in range(n)):
            assert got is None, edges
        else:
            assert got == [d[s][v] for v in range(n)], (edges, s, got)
        pos = [[u, v, abs(w) + 1] for u, v, w in edges]
        src, dst, k = R.randrange(n), R.randrange(n), R.randint(0, 3)
        best = inf
        stack = [(src, 0, 0)]
        while stack:
            u, used, cost = stack.pop()
            if u == dst and used - 1 <= k:
                best = min(best, cost)
            if used <= k:
                for a, v, w in pos:
                    if a == u:
                        stack.append((v, used + 1, cost + w))
        assert kf(n, pos, src, dst, k) == (-1 if best == inf else best), (pos, src, dst, k)
    assert kf(4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1) == 700


@algo("multi-source-bfs")
def _(ns):
    rot, nz = pick(ns, "rotting_oranges", "nearest_zero")
    for _ in range(300):
        rows, cols = R.randint(1, 5), R.randint(1, 5)
        grid = [[R.choice([0, 1, 1, 2]) for _ in range(cols)] for _ in range(rows)]
        sim, minutes = {(r_, c_): v for r_, row in enumerate(grid) for c_, v in enumerate(row)}, 0
        while True:
            hit = {nb for (r_, c_), v in sim.items() if v == 2 for nb in ((r_ + 1, c_), (r_ - 1, c_), (r_, c_ + 1), (r_, c_ - 1)) if sim.get(nb) == 1}
            if not hit:
                break
            for nb in hit:
                sim[nb] = 2
            minutes += 1
        want = -1 if 1 in sim.values() else minutes
        assert rot([row[:] for row in grid]) == want, grid
        mat = [[R.choice([0, 1, 1]) for _ in range(cols)] for _ in range(rows)]
        zeros = [(r_, c_) for r_ in range(rows) for c_ in range(cols) if mat[r_][c_] == 0]
        want = [[min([abs(r_ - a) + abs(c_ - b) for a, b in zeros] or [-1]) for c_ in range(cols)] for r_ in range(rows)]
        assert nz(mat) == want, mat


@algo("spanning-tree")
def _(ns):
    kr, pr = pick(ns, "kruskal", "prim")
    for _ in range(300):
        n = R.randint(1, 6)
        edges = [[R.randint(1, 9), u, v] for u in range(n) for v in range(u) if R.random() < 0.5]
        best = -1
        for sub in itertools.combinations(edges, n - 1):
            comp = list(range(n))
            ok = True
            for _, u, v in sub:
                if comp[u] == comp[v]:
                    ok = False
                    break
                old = comp[v]
                comp = [comp[u] if c == old else c for c in comp]
            if ok and (best < 0 or sum(e[0] for e in sub) < best):
                best = sum(e[0] for e in sub)
        assert kr(n, [e[:] for e in edges]) == best, (n, edges)
        g = [[] for _ in range(n)]
        for w, u, v in edges:
            g[u].append((w, v))
            g[v].append((w, u))
        assert pr(n, g) == best, (n, edges)


@algo("heapq-basics")
def _(ns):
    hs, desc, rt = pick(ns, "heap_sort", "sort_desc", "run_tasks")
    for _ in range(100):
        a = [R.randint(-9, 9) for _ in range(R.randint(0, 12))]
        keep = list(a)
        assert hs(a) == sorted(a) and a == keep and desc(a) == sorted(a, reverse=True)
        tasks = [(R.randint(1, 3), "t%d" % i) for i in range(R.randint(0, 8))]
        assert rt(tasks) == [name for _, name in sorted(tasks, key=lambda t: t[0])], tasks


@algo("top-k")
def _(ns):
    kl, tf, kc = pick(ns, "kth_largest", "top_k_frequent", "k_closest")
    for _ in range(300):
        a = [R.randint(-9, 9) for _ in range(R.randint(1, 12))]
        k = R.randint(1, len(a))
        assert kl(a, k) == sorted(a, reverse=True)[k - 1]
        cnt = collections.Counter(a)
        k = R.randint(1, len(cnt))
        got = tf(a, k)
        assert len(got) == k and len(set(got)) == k
        assert sorted((cnt[x] for x in got), reverse=True) == sorted(cnt.values(), reverse=True)[:k], (a, k, got)
        pts = [[R.randint(-5, 5), R.randint(-5, 5)] for _ in range(R.randint(1, 10))]
        k = R.randint(1, len(pts))
        d = lambda p: p[0] ** 2 + p[1] ** 2
        assert sorted(map(d, kc(pts, k))) == sorted(map(d, pts))[:k], (pts, k)


@algo("k-way-merge")
def _(ns):
    mk, ml, ms = pick(ns, "merge_k_sorted", "merge_k_lists", "merge_stdlib")
    for _ in range(200):
        lists = [sorted(R.randint(0, 15) for _ in range(R.randint(0, 5))) for _ in range(R.randint(0, 5))]
        want = sorted(x for l in lists for x in l)
        assert mk(lists) == want and ms(lists) == want
        assert unL(ml([L(l) for l in lists])) == want
    assert mk([[1, 4, 5], [1, 3, 4], [2, 6]]) == [1, 1, 2, 3, 4, 4, 5, 6]


@algo("running-median")
def _(ns):
    MF, KL = pick(ns, "MedianFinder", "KthLargest")
    for _ in range(200):
        m, seen = MF(), []
        for _ in range(R.randint(1, 15)):
            x = R.randint(-9, 9)
            m.add(x)
            seen.append(x)
            assert m.median() == statistics.median(seen), seen
        k = R.randint(1, 4)
        init = [R.randint(0, 9) for _ in range(R.randint(0, 5))]
        kl, seen = KL(k, init), list(init)
        for _ in range(8):
            x = R.randint(0, 9)
            seen.append(x)
            got = kl.add(x)
            if len(seen) >= k:
                assert got == sorted(seen, reverse=True)[k - 1], (k, seen)


@algo("quickselect")
def _(ns):
    qs, q3 = pick(ns, "quickselect", "quickselect_3way")
    for _ in range(300):
        a = [R.randint(0, 6) for _ in range(R.randint(1, 14))]
        keep = list(a)
        k = R.randrange(len(a))
        assert qs(a, k) == sorted(a)[k] and q3(a, k) == sorted(a)[k], (a, k)
        assert a == keep
    assert qs([7] * 2000, 1000) == 7 and q3([7] * 2000, 1000) == 7


class Ref:
    """A plain list-based LRU cache, for comparing the two real ones."""
    def __init__(self, cap):
        self.cap, self.items = cap, []

    def get(self, k):
        for i, (key, v) in enumerate(self.items):
            if key == k:
                self.items.append(self.items.pop(i))
                return v
        return -1

    def put(self, k, v):
        self.items = [(a, b) for a, b in self.items if a != k] + [(k, v)]
        if len(self.items) > self.cap:
            self.items.pop(0)


@algo("lru-cache")
def _(ns):
    A, B, Node = pick(ns, "LRUCache", "LRUCacheList", "Node")
    assert Node(1, 2).val == 2
    for cls in (A, B):
        c = cls(2)
        c.put(1, 1)
        c.put(2, 2)
        assert c.get(1) == 1
        c.put(3, 3)
        assert c.get(2) == -1
        c.put(4, 4)
        assert (c.get(1), c.get(3), c.get(4)) == (-1, 3, 4)
        for _ in range(200):
            cap = R.randint(1, 4)
            c, ref = cls(cap), Ref(cap)
            for _ in range(40):
                k = R.randint(0, 5)
                if R.random() < 0.5:
                    v = R.randint(0, 99)
                    c.put(k, v)
                    ref.put(k, v)
                else:
                    assert c.get(k) == ref.get(k)


@algo("time-map")
def _(ns):
    TM, SA = pick(ns, "TimeMap", "SnapshotArray")
    for _ in range(200):
        m, log, t = TM(), {}, {}
        for _ in range(R.randint(1, 15)):
            k = R.choice("ab")
            t[k] = t.get(k, 0) + R.randint(1, 3)
            v = "v%d" % R.randint(0, 99)
            m.set(k, v, t[k])
            log.setdefault(k, []).append((t[k], v))
        for k in "abc":
            for q in range(0, 30):
                want = [v for ts, v in log.get(k, []) if ts <= q]
                assert m.get(k, q) == (want[-1] if want else ""), (k, q)
        n = R.randint(1, 4)
        sa, now, snaps = SA(n), [0] * n, []
        for _ in range(R.randint(1, 15)):
            if R.random() < 0.3:
                assert sa.snap() == len(snaps)
                snaps.append(list(now))
            else:
                i, v = R.randrange(n), R.randint(1, 9)
                sa.set(i, v)
                now[i] = v
        for sid, row in enumerate(snaps):
            for i in range(n):
                assert sa.get(i, sid) == row[i]


@algo("random-set")
def _(ns):
    RS = pick(ns, "RandomizedSet")[0]
    for _ in range(200):
        s, model = RS(), set()
        for _ in range(30):
            x = R.randint(0, 6)
            if R.random() < 0.5:
                assert s.insert(x) == (x not in model)
                model.add(x)
            else:
                assert s.remove(x) == (x in model)
                model.discard(x)
            if model:
                assert {s.get_random() for _ in range(60)} <= model
                assert len(s.items) == len(model) and all(s.items[s.pos[v]] == v for v in s.pos)
    s = RS()
    s.insert(1)
    s.insert(2)
    assert s.remove(1) and s.get_random() == 2


@algo("intervals")
def _(ns):
    mi, er, rooms = pick(ns, "merge_intervals", "erase_overlap", "min_rooms")
    for _ in range(300):
        iv = []
        for _ in range(R.randint(0, 8)):
            s = R.randint(0, 12)
            iv.append([s, s + R.randint(1, 4)])
        comp = list(range(len(iv)))
        for i in range(len(iv)):
            for j in range(len(iv)):
                if iv[i][0] <= iv[j][1] and iv[j][0] <= iv[i][1]:
                    old = comp[j]
                    comp = [comp[i] if c == old else c for c in comp]
        want = sorted([min(iv[i][0] for i in range(len(iv)) if comp[i] == c), max(iv[i][1] for i in range(len(iv)) if comp[i] == c)] for c in set(comp))
        assert mi([x[:] for x in iv]) == want, iv
        best = 0
        for mask in range(1 << len(iv)):
            pick_ = [iv[i] for i in range(len(iv)) if mask >> i & 1]
            if all(a[1] <= b[0] or b[1] <= a[0] for a, b in itertools.combinations(pick_, 2)):
                best = max(best, len(pick_))
        assert er(iv) == len(iv) - best, iv
        assert rooms(iv) == max([sum(s <= t < e for s, e in iv) for t, _ in iv] + [0]), iv


@algo("jump-game")
def _(ns):
    cj, mj, gas = pick(ns, "can_jump", "min_jumps", "can_complete_circuit")
    for _ in range(400):
        a = [R.randint(0, 4) for _ in range(R.randint(1, 8))]
        best = [0] + [10 ** 9] * (len(a) - 1)
        for i in range(len(a)):
            for j in range(i + 1, min(len(a), i + a[i] + 1)):
                best[j] = min(best[j], best[i] + 1)
        assert cj(a) == (best[-1] < 10 ** 9), a
        if best[-1] < 10 ** 9:
            assert mj(a) == best[-1], a
        g = [R.randint(0, 5) for _ in range(R.randint(1, 6))]
        c = [R.randint(0, 5) for _ in g]
        ok = [s for s in range(len(g)) if all(sum(g[(s + t) % len(g)] - c[(s + t) % len(g)] for t in range(m + 1)) >= 0 for m in range(len(g)))]
        got = gas(g, c)
        assert (got == -1 and not ok) or got in ok, (g, c, got, ok)


@algo("dp-1d")
def _(ns):
    rob, cs, dec = pick(ns, "rob", "climb_stairs", "num_decodings")
    for _ in range(300):
        a = [R.randint(0, 9) for _ in range(R.randint(0, 9))]
        best = max(sum(a[i] for i in range(len(a)) if m >> i & 1) for m in range(1 << len(a)) if not m & (m >> 1))
        assert rob(a) == best, a
        s = "".join(R.choice("0123456789"[:R.choice([3, 10])]) for _ in range(R.randint(1, 8)))

        def ways(i):
            if i == len(s):
                return 1
            if s[i] == "0":
                return 0
            return ways(i + 1) + (ways(i + 2) if i + 1 < len(s) and int(s[i:i + 2]) <= 26 else 0)
        assert dec(s) == ways(0), s
    fib = [1, 1]
    for _ in range(30):
        fib.append(fib[-1] + fib[-2])
    assert [cs(n) for n in range(1, 25)] == fib[1:25]


@algo("kadane")
def _(ns):
    ms, mp = pick(ns, "max_subarray", "max_product")
    for _ in range(400):
        a = [R.randint(-5, 6) for _ in range(R.randint(1, 9))]
        sub = [a[i:j] for i in range(len(a)) for j in range(i + 1, len(a) + 1)]
        assert ms(a) == max(map(sum, sub)), a
        assert mp(a) == max(math.prod(x) for x in sub), a


@algo("knapsack")
def _(ns):
    ks, part = pick(ns, "knapsack", "can_partition")
    for _ in range(300):
        n = R.randint(0, 8)
        w = [R.randint(1, 6) for _ in range(n)]
        v = [R.randint(0, 9) for _ in range(n)]
        cap = R.randint(0, 14)
        best = max(sum(v[i] for i in range(n) if m >> i & 1) for m in range(1 << n) if sum(w[i] for i in range(n) if m >> i & 1) <= cap)
        assert ks(w, v, cap) == best, (w, v, cap)
        a = [R.randint(1, 7) for _ in range(R.randint(0, 8))]
        want = sum(a) % 2 == 0 and any(sum(a[i] for i in range(len(a)) if m >> i & 1) * 2 == sum(a) for m in range(1 << len(a)))
        assert part(a) == want, a


@algo("coin-change")
def _(ns):
    cc, cw = pick(ns, "coin_change", "coin_ways")
    for _ in range(300):
        coins = sorted(R.sample(range(1, 9), R.randint(1, 4)))
        amount = R.randint(0, 20)

        @functools.lru_cache(None)
        def fewest(a):
            if a == 0:
                return 0
            return min([fewest(a - c) + 1 for c in coins if c <= a] + [10 ** 9])

        @functools.lru_cache(None)
        def ways(a, i):
            if a == 0:
                return 1
            if i == len(coins) or a < 0:
                return 0
            return ways(a - coins[i], i) + ways(a, i + 1)
        assert cc(coins, amount) == (fewest(amount) if fewest(amount) < 10 ** 9 else -1), (coins, amount)
        assert cw(coins, amount) == ways(amount, 0), (coins, amount)
    assert cc([2], 3) == -1 and cc([1, 3, 4], 6) == 2


@algo("lis")
def _(ns):
    f, f2, fnd = pick(ns, "lis", "lis_n2", "lis_non_decreasing")
    for _ in range(300):
        a = [R.randint(0, 8) for _ in range(R.randint(0, 9))]
        strict = max([len(c) for r_ in range(len(a) + 1) for c in itertools.combinations(a, r_) if all(x < y for x, y in zip(c, c[1:]))])
        loose = max([len(c) for r_ in range(len(a) + 1) for c in itertools.combinations(a, r_) if all(x <= y for x, y in zip(c, c[1:]))])
        assert f(a) == strict and f2(a) == strict and fnd(a) == loose, a


@algo("lcs-edit")
def _(ns):
    lcs, ed = pick(ns, "lcs", "edit_distance")
    for _ in range(300):
        a = "".join(R.choice("abc") for _ in range(R.randint(0, 7)))
        b = "".join(R.choice("abc") for _ in range(R.randint(0, 7)))

        @functools.lru_cache(None)
        def common(i, j):
            if i == len(a) or j == len(b):
                return 0
            return common(i + 1, j + 1) + 1 if a[i] == b[j] else max(common(i + 1, j), common(i, j + 1))

        @functools.lru_cache(None)
        def edits(i, j):
            if i == len(a):
                return len(b) - j
            if j == len(b):
                return len(a) - i
            if a[i] == b[j]:
                return edits(i + 1, j + 1)
            return 1 + min(edits(i + 1, j + 1), edits(i + 1, j), edits(i, j + 1))
        assert lcs(a, b) == common(0, 0) and ed(a, b) == edits(0, 0), (a, b)
    assert ed("horse", "ros") == 3 and ed("intention", "execution") == 5


@algo("word-break")
def _(ns):
    wb, wm = pick(ns, "word_break", "word_break_memo")
    for _ in range(400):
        words = ["".join(R.choice("ab") for _ in range(R.randint(1, 3))) for _ in range(R.randint(1, 4))]
        s = "".join(R.choice("ab") for _ in range(R.randint(0, 9)))

        def can(i):
            return i == len(s) or any(s.startswith(w, i) and can(i + len(w)) for w in words)
        assert wb(s, words) == can(0) and wm(s, words) == can(0), (s, words)


@algo("subsets")
def _(ns):
    sub, dup, mask = pick(ns, "subsets", "subsets_dup", "subsets_mask")
    for _ in range(100):
        a = [R.randint(0, 4) for _ in range(R.randint(0, 7))]
        keep = list(a)
        uniq = list(dict.fromkeys(a))
        every = [list(c) for r_ in range(len(uniq) + 1) for c in itertools.combinations(uniq, r_)]
        assert sorted(sub(uniq)) == sorted(every) and len(sub(uniq)) == 2 ** len(uniq)
        assert sorted(mask(uniq)) == sorted(every)
        want = {tuple(sorted(c)) for r_ in range(len(a) + 1) for c in itertools.combinations(a, r_)}
        got = dup(a)
        assert a == keep and sorted(map(tuple, got)) == sorted(want), (a, got)
        assert len(mask(a)) == 2 ** len(a)


@algo("permutations")
def _(ns):
    pm, pd, ps = pick(ns, "permutations", "permutations_dup", "permutations_stdlib")
    for _ in range(100):
        a = [R.randint(0, 3) for _ in range(R.randint(0, 6))]
        uniq = list(dict.fromkeys(a))
        assert pm(uniq) == [list(p) for p in itertools.permutations(uniq)] == ps(uniq)
        assert sorted(pd(a)) == sorted(map(list, set(itertools.permutations(a)))), a


@algo("combination-sum")
def _(ns):
    cs, c2, gp = pick(ns, "combination_sum", "combination_sum2", "generate_parentheses")
    for _ in range(300):
        cand = R.sample(range(1, 9), R.randint(1, 4))
        target = R.randint(1, 14)
        want = {tuple(sorted(c)) for n in range(1, target + 1) for c in itertools.combinations_with_replacement(cand, n) if sum(c) == target}
        got = cs(cand, target)
        assert sorted(map(lambda x: tuple(sorted(x)), got)) == sorted(want) and len(got) == len(want), (cand, target)
        dups = [R.randint(1, 5) for _ in range(R.randint(1, 7))]
        keep = list(dups)
        want = {tuple(sorted(c)) for n in range(1, len(dups) + 1) for c in itertools.combinations(dups, n) if sum(c) == target}
        got = c2(dups, target)
        assert dups == keep and sorted(map(tuple, got)) == sorted(want), (dups, target, got)
    for n in range(0, 7):
        out = gp(n)
        assert len(out) == len(set(out)) == math.comb(2 * n, n) // (n + 1)
        for s in out:
            depth = 0
            for ch in s:
                depth += 1 if ch == "(" else -1
                assert depth >= 0
            assert depth == 0


@algo("kmp")
def _(ns):
    pf, ks, rp = pick(ns, "prefix_function", "kmp_search", "repeated_pattern")
    for _ in range(500):
        p = "".join(R.choice("ab") for _ in range(R.randint(1, 8)))
        want = [max([k for k in range(i + 1) if p[:k] == p[i + 1 - k:i + 1]]) for i in range(len(p))]
        assert pf(p) == want, p
        text = "".join(R.choice("ab") for _ in range(R.randint(0, 14)))
        assert ks(text, p) == text.find(p), (text, p)
        assert rp(p) == (p in (p + p)[1:-1]), p
    assert ks("abc", "") == 0 and pf("") == []


@algo("trie")
def _(ns):
    Trie, wp = pick(ns, "Trie", "words_with_prefix")
    for _ in range(200):
        words = ["".join(R.choice("abc") for _ in range(R.randint(1, 4))) for _ in range(R.randint(0, 8))]
        t = Trie()
        for w in words:
            t.insert(w)
        for q in ["".join(R.choice("abc") for _ in range(R.randint(0, 4))) for _ in range(12)]:
            assert t.search(q) == (q in words), (words, q)
            assert t.starts_with(q) == (q == "" or any(w.startswith(q) for w in words)), (words, q)
            assert wp(t, q) == sorted(w for w in set(words) if w.startswith(q)), (words, q)


class Keyed:
    """Compares by key only, so a stable sort keeps equal keys in their original order."""
    def __init__(self, key, tag):
        self.key, self.tag = key, tag

    def __le__(self, other):
        return self.key <= other.key


@algo("merge-sort")
def _(ns):
    ms, inv = pick(ns, "merge_sort", "count_inversions")
    for _ in range(300):
        a = [R.randint(-9, 9) for _ in range(R.randint(0, 14))]
        keep = list(a)
        assert ms(a) == sorted(a) and a == keep
        assert inv(a) == sum(a[i] > a[j] for i in range(len(a)) for j in range(i + 1, len(a))), a
        items = [Keyed(R.randint(0, 3), i) for i in range(R.randint(0, 12))]
        assert [x.tag for x in ms(items)] == [x.tag for x in sorted(items, key=lambda x: x.key)], "merge sort must be stable"


@algo("quicksort")
def _(ns):
    qs, col, short = pick(ns, "quicksort", "sort_colors", "quicksort_short")
    for _ in range(300):
        a = [R.randint(-5, 5) for _ in range(R.randint(0, 15))]
        b = list(a)
        assert qs(b) is b and b == sorted(a) and short(a) == sorted(a), a
        c = [R.randint(0, 2) for _ in range(R.randint(0, 12))]
        d = list(c)
        col(d)
        assert d == sorted(c), c
    big = [1] * 400
    assert qs(big) == big


@algo("counting-sort")
def _(ns):
    cs, tb = pick(ns, "counting_sort", "top_k_frequent_bucket")
    for _ in range(300):
        k = R.randint(0, 9)
        a = [R.randint(0, k) for _ in range(R.randint(0, 14))]
        assert cs(a, k) == sorted(a), (a, k)
        if a:
            n = R.randint(1, len(set(a)))
            cnt = collections.Counter(a)
            got = tb(a, n)
            assert len(got) == n and len(set(got)) == n
            assert sorted((cnt[x] for x in got), reverse=True) == sorted(cnt.values(), reverse=True)[:n], (a, n, got)
