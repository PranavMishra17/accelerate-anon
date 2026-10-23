"""The code on the concurrency guide, one entry per block, each run against fakes by check() below.
Run: python coding/concurrency/snippets.py (also run by tools/rebuild.py before gen.py)."""
import asyncio, os, subprocess, sys, tempfile, textwrap, threading, time

CODE = {}

CODE["thread_pool"] = '''from concurrent.futures import ThreadPoolExecutor

def fetch_all(urls, workers=8):
    # fetch() blocks on the network; the GIL is released while it waits
    with ThreadPoolExecutor(max_workers=workers) as pool:
        return list(pool.map(fetch, urls))     # results in input order'''

CODE["lock"] = '''import threading

count = 0
lock = threading.Lock()

def hit():
    global count
    with lock:          # count += 1 is read, add, write: three steps
        count += 1      # another thread can run between them'''

CODE["deadlock"] = '''def transfer(a, b, amount):
    # Thread 1 locks a then b, thread 2 locks b then a: each waits forever.
    # Fix: always take the locks in one global order.
    first, second = sorted((a, b), key=lambda acct: acct.id)
    with first.lock, second.lock:
        a.balance -= amount
        b.balance += amount'''

CODE["gather"] = '''import asyncio

async def call_all(prompts, limit=10, timeout=30):
    sem = asyncio.Semaphore(limit)              # at most 10 in flight: the rate limit

    async def one(p):
        async with sem:
            return await asyncio.wait_for(model.complete(p), timeout)

    # return_exceptions: one failure doesn't cancel the other 99
    return await asyncio.gather(*(one(p) for p in prompts), return_exceptions=True)'''

CODE["to_thread"] = '''import asyncio

async def summarise(doc):
    text = await asyncio.to_thread(parse_pdf, doc)   # blocking library, off the loop
    return await model.complete(text)                # the loop keeps serving others'''

CODE["background"] = '''import asyncio

background = set()

def fire_and_forget(coro):
    task = asyncio.create_task(coro)
    background.add(task)                     # the loop holds only a weak reference:
    task.add_done_callback(background.discard)   # without this, it can vanish mid-run
    return task'''

CODE["process_pool"] = '''from concurrent.futures import ProcessPoolExecutor

def score(item):                 # top level, so it can be pickled to a worker
    return sum(ord(c) for c in item) % 97     # stands in for CPU-heavy work

def score_all(items):
    with ProcessPoolExecutor() as pool:       # one worker per core by default
        return list(pool.map(score, items, chunksize=64))

if __name__ == "__main__":       # spawn re-imports this file in every worker
    print(len(score_all(["doc"] * 1000)))'''

CODE["mixed"] = '''import asyncio
from concurrent.futures import ProcessPoolExecutor

def grade(answer, rubric):       # CPU work, top level: runs in a worker process
    return sum(word in answer for word in rubric) / len(rubric)

async def run_eval(cases, limit=20):
    loop = asyncio.get_running_loop()
    sem = asyncio.Semaphore(limit)
    with ProcessPoolExecutor() as cpu:
        async def one(case):
            async with sem:                                   # I/O: the event loop
                answer = await model.complete(case["prompt"])
            return await loop.run_in_executor(cpu, grade, answer, case["rubric"])  # CPU: a process
        return await asyncio.gather(*(one(c) for c in cases))'''


# ---------------------------------------------------------------- checks
def load(name, **extra):
    g = {"__name__": "snip_" + name}
    g.update(extra)
    exec(CODE[name], g)
    return g

def run_file(src, extra=""):
    d = tempfile.mkdtemp()
    p = os.path.join(d, "m.py")
    with open(p, "w", encoding="utf-8") as f:
        f.write(src + "\n" + extra)
    out = subprocess.run([sys.executable, p], capture_output=True, text=True, timeout=120)
    assert out.returncode == 0, out.stderr
    return out.stdout.strip()

def check():
    # threads: 8 fetches of 0.2 s overlap, order kept
    def fetch(u):
        time.sleep(0.2); return u * 2
    g = load("thread_pool", fetch=fetch)
    t0 = time.monotonic(); r = g["fetch_all"](list(range(8)))
    assert r == [i * 2 for i in range(8)] and time.monotonic() - t0 < 0.6
    # lock: 8 threads x 10,000 hits, exact
    g = load("lock")
    ts = [threading.Thread(target=lambda: [g["hit"]() for _ in range(10000)]) for _ in range(8)]
    [t.start() for t in ts]; [t.join() for t in ts]
    assert g["count"] == 80000
    # deadlock fix: opposite-order transfers finish
    class Acct:
        def __init__(s, i): s.id, s.balance, s.lock = i, 1000, threading.Lock()
    a, b = Acct(1), Acct(2); g = load("deadlock")
    ts = [threading.Thread(target=lambda: [g["transfer"](a, b, 1) for _ in range(2000)]),
          threading.Thread(target=lambda: [g["transfer"](b, a, 1) for _ in range(2000)])]
    [t.start() for t in ts]; [t.join(10) for t in ts]
    assert not any(t.is_alive() for t in ts) and a.balance + b.balance == 2000
    # gather: cap holds, failures returned, order kept
    class Model:
        def __init__(s): s.now = s.peak = 0
        async def complete(s, p):
            s.now += 1; s.peak = max(s.peak, s.now)
            await asyncio.sleep(0.05); s.now -= 1
            if p == "bad": raise ValueError(p)
            return p.upper()
    m = Model(); g = load("gather", model=m)
    r = asyncio.run(g["call_all"](["a"] * 30 + ["bad", "b"]))
    assert m.peak <= 10 and r[0] == "A" and isinstance(r[30], ValueError) and r[31] == "B"
    # to_thread: a blocking parse doesn't stall another task
    class M2:
        async def complete(s, t): return t
    def parse_pdf(d): time.sleep(0.3); return d
    g = load("to_thread", model=M2(), parse_pdf=parse_pdf)
    async def go():
        ticks = 0
        async def ticker():
            nonlocal ticks
            for _ in range(10): await asyncio.sleep(0.02); ticks += 1
        r = await asyncio.gather(g["summarise"]("x"), ticker())
        return r[0], ticks
    r, ticks = asyncio.run(go()); assert r == "x" and ticks == 10
    # background: task kept until done, then dropped
    g = load("background")
    async def go2():
        done = []
        async def job(): await asyncio.sleep(0.01); done.append(1)
        t = g["fire_and_forget"](job()); assert t in g["background"]
        await t; await asyncio.sleep(0); return done
    assert asyncio.run(go2()) == [1] and not g["background"]
    # process pool: runs under spawn with the __main__ guard
    assert run_file(CODE["process_pool"]) == "1000"
    # mixed: model calls on the loop, grading in processes
    out = run_file(CODE["mixed"], textwrap.dedent('''
        class _M:
            async def complete(self, p):
                await asyncio.sleep(0.01); return p
        model = _M()
        if __name__ == "__main__":
            cases = [{"prompt": "cache key ttl", "rubric": ["cache", "ttl"]}, {"prompt": "nothing", "rubric": ["cache"]}]
            print(asyncio.run(run_eval(cases)))
    '''))
    assert out == "[1.0, 0.0]", out
    print("concurrency code checks out")

if __name__ == "__main__":
    check()
