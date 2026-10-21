/* Mercor coding tab, part 4: Failure, time and the review. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "failure",
 "n": 4,
 "title": "Failure, time and the review",
 "minutes": 25,
 "lead": "After this part you can say, with confidence, how concurrent code fails (timeouts, cancels, retries, duplicate writes) and what you would change, using a fixed six-step review order.",
 "sections": [
  {
   "id": "failure-timeouts",
   "title": "Timeouts and cancellation",
   "blocks": [
    {
     "t": "p",
     "text": "Every call that waits on something outside your process needs a deadline. Without one, a slow dependency makes your tasks pile up until memory or the connection pool runs out. asyncio gives two ways: `asyncio.wait_for(coro, seconds)` and the block form `async with asyncio.timeout(seconds):` (3.11+)."
    },
    {
     "t": "p",
     "text": "A timeout does not make the slow thing stop by itself being slow. It **cancels** the task: a `CancelledError` is thrown into the task at the line where it is waiting. Its `except` and `finally` blocks run, then it ends. The caller then gets a `TimeoutError`."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "What happens at the deadline",
       "lanes": [
        [
         "caller",
         [
          [
           "await wait_for(slow, 0.1)",
           "gap",
           "4"
          ],
          [
           "TimeoutError",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "slow task",
         [
          [
           "sleep(5)",
           "gap",
           "4"
          ],
          [
           "CancelledError, finally runs",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "The cancel is delivered at the line where slow is waiting. The caller continues only after slow has cleaned up."
      }
     ]
    },
    {
     "t": "code",
     "id": "p4-timeout",
     "title": "A deadline that cancels the work",
     "code": "import asyncio\n\nasync def slow():\n    try:\n        await asyncio.sleep(5)\n    except asyncio.CancelledError:\n        print(\"slow: cancelled\")\n        raise\n    finally:\n        print(\"slow: cleanup\")\n\nasync def main():\n    try:\n        async with asyncio.timeout(0.1):\n            await slow()\n    except TimeoutError:\n        print(\"caller: timed out\")\n\nasyncio.run(main())\n",
     "notes": {
      "5": "where the cancel arrives",
      "6": "the task can react, for example to release something",
      "8": "re-raise: the cancellation must continue",
      "9": "runs on success, error and cancel",
      "14": "deadline for everything inside the block",
      "16": "the caller sees TimeoutError, not CancelledError"
     },
     "ask": {
      "q": "Click the line where the CancelledError is raised inside slow().",
      "lines": [
       5
      ],
      "why": "A task can only be cancelled at an await. The cancel is delivered at the line where it is waiting, so the exception appears on that very line."
     }
    },
    {
     "t": "p",
     "text": "The rule on cancellation: never swallow `CancelledError`. If you catch it, do your cleanup and raise it again. A task that eats the cancel looks cancelled to you but keeps running, and timeouts stop working."
    },
    {
     "t": "p",
     "text": "One more tool: `asyncio.shield(task)`. It lets one waiter give up without cancelling the shared work other callers wait on. Open `app/cache/singleflight.py` line 29 and read the comment above it. Lines 35 to 38 handle the opposite case: the caller who started the load is cancelled, so the waiters get a `LoadAborted` error instead of hanging."
    },
    {
     "t": "predict",
     "id": "p4-shield-p",
     "code": "import asyncio\n\nasync def load():\n    await asyncio.sleep(0.3)\n    return \"value\"\n\nasync def main():\n    shared = asyncio.create_task(load())\n    try:\n        await asyncio.wait_for(asyncio.shield(shared), 0.1)\n    except TimeoutError:\n        print(\"waiter gave up\")\n    print(\"shared cancelled:\", shared.cancelled())\n    print(await shared)\n\nasyncio.run(main())\n",
     "q": "A waiter gives up after 0.1 s, but the load needs 0.3 s. The waiter wrapped the shared task in shield. What prints?",
     "answer": "waiter gave up\nshared cancelled: False\nvalue",
     "why": "Only the shield wrapper was cancelled. The shared load kept going, and a second waiter can still await it. Without the shield (try it: wait_for(shared, 0.1)) the timeout cancels the shared task itself, and everyone waiting on it fails."
    }
   ]
  },
  {
   "id": "failure-retries",
   "title": "Errors, retries and idempotency",
   "blocks": [
    {
     "t": "p",
     "text": "With one caller an error is simple: it comes back to the caller. With many callers sharing one load, one failure reaches all of them. Three rules."
    },
    {
     "t": "list",
     "items": [
      "Share the failure with the people waiting right now: they asked for the same thing, they get the same answer.",
      "Do not remember the failure. The next caller must try again. Remove the in-flight entry whatever happens (the `finally` at singleflight.py line 47).",
      "Do not cache failures as if they were data. A timeout is not 'the product does not exist'."
     ]
    },
    {
     "t": "p",
     "text": "A retry turns a short failure into a success. Done badly it turns a short failure into an outage. Five rules."
    },
    {
     "t": "list",
     "items": [
      "Retry only errors that can go away: timeouts, connection resets, 429, 503. Never a 400 or a validation error; it will fail the same way.",
      "Limit attempts. 3 or 4 is normal. Retries multiply: 3 attempts at each of 3 layers is 27 calls for one request.",
      "Back off: wait longer each time, doubling up to a cap.",
      "Add jitter: wait a random time between 0 and the cap, so clients that failed together do not retry together (full jitter).",
      "Put a timeout on each attempt, otherwise one hung attempt uses up all the time."
     ]
    },
    {
     "t": "code",
     "id": "p4-retry",
     "title": "Retry with backoff, jitter and a timeout per attempt",
     "code": "import asyncio\nimport random\n\nclass Transient(Exception):\n    pass\n\nasync def call_with_retry(op, attempts=4, base=0.1, cap=1.0, per_try=0.5,\n                          sleep=asyncio.sleep, rng=random.random):\n    for n in range(1, attempts + 1):\n        try:\n            return await asyncio.wait_for(op(), per_try)\n        except (Transient, TimeoutError):\n            if n == attempts:\n                raise\n            ceiling = min(cap, base * 2 ** (n - 1))\n            print(f\"attempt {n} failed, wait up to {ceiling}\")\n            await sleep(rng() * ceiling)\n\ncalls = 0\n\nasync def flaky():\n    global calls\n    calls += 1\n    if calls < 4:\n        raise Transient()\n    return \"ok\"\n\nprint(asyncio.run(call_with_retry(flaky, rng=lambda: 0.0)))\n",
     "notes": {
      "9": "bounded: at most `attempts` tries",
      "11": "a deadline on each attempt",
      "12": "only errors that can go away. Anything else leaves at once",
      "13": "out of attempts: raise the last error, do not return None",
      "15": "exponential: 0.1, 0.2, 0.4 ... up to the cap",
      "17": "full jitter: a random wait between 0 and the ceiling"
     },
     "ask": {
      "q": "Click the line that is the jitter.",
      "lines": [
       17
      ],
      "why": "The wait is `rng() * ceiling`, a random number between 0 and the ceiling. Without the random factor all clients wait the same time and retry together."
     }
    },
    {
     "t": "p",
     "text": "Retries are only safe for writes if doing the write twice has the same effect as doing it once. The client sends an **idempotency key** with the request. The server remembers the key."
    },
    {
     "t": "list",
     "items": [
      "Claim first: set the key only if it is absent, before any slow work. The second request sees the claim and does not start its own work.",
      "Store the result with the key, so a retry gets the same answer, not a new order.",
      "If the work fails, release the claim so the client can retry.",
      "If the same key arrives with a different request, reject it. It is a client bug."
     ]
    },
    {
     "t": "mcq",
     "id": "p4-idem-m1",
     "q": "A client sends an order and the connection drops. It does not know whether the order went through. It sends the same request with the same key. The first attempt had succeeded. What should happen?",
     "o": [
      "A second order is created, the key is only for logging",
      "The server returns the stored result of the first order",
      "The server returns an error saying the key exists",
      "The server waits for the client to confirm"
     ],
     "a": 1,
     "why": "That is the purpose of the key: the retry returns the same order. An error would force the client to guess what happened."
    }
   ]
  },
  {
   "id": "failure-models",
   "title": "Threads, asyncio or processes",
   "blocks": [
    {
     "t": "p",
     "text": "The GIL lets only one thread run Python code at a time. So threads help when the work is waiting (network, disk, a sleep), not when it is computing. For computing you need separate processes."
    },
    {
     "t": "table",
     "head": [
      "",
      "Threads",
      "asyncio",
      "Processes"
     ],
     "rows": [
      [
       "Good for",
       "blocking libraries; tens of waits at once",
       "thousands of waits on the network",
       "CPU-heavy work"
      ],
      [
       "Where it switches",
       "anywhere, at any time",
       "only at an await",
       "separate programs, no switching inside"
      ],
      [
       "Shared memory",
       "yes: needs locks",
       "yes: races only across awaits",
       "no: data is copied between them"
      ],
      [
       "Cost of each unit",
       "a stack each; tens to hundreds is normal",
       "small; tens of thousands is normal",
       "a whole interpreter; about one per core"
      ],
      [
       "How it breaks",
       "two threads change one thing: races, deadlocks",
       "one task blocks the loop and everything stops",
       "big arguments and results are slow to copy"
      ]
     ]
    },
    {
     "t": "code",
     "id": "p4-proc",
     "title": "CPU work moved to a process pool",
     "code": "import asyncio\nfrom concurrent.futures import ProcessPoolExecutor\n\ndef cpu(n):\n    return sum(i * i for i in range(n))\n\nasync def main():\n    loop = asyncio.get_running_loop()\n    with ProcessPoolExecutor(2) as pool:\n        a = loop.run_in_executor(pool, cpu, 10)\n        b = loop.run_in_executor(pool, cpu, 5)\n        print(await asyncio.gather(a, b))\n\nif __name__ == \"__main__\":\n    asyncio.run(main())\n",
     "notes": {
      "4": "plain function: it must be importable by the child process",
      "9": "two worker processes, each with its own interpreter and GIL",
      "10": "returns an awaitable. The loop stays free",
      "14": "required on Windows and macOS: children import this file"
     },
     "ask": {
      "q": "Click the line that sends work to another process without blocking the loop.",
      "lines": [
       10
      ],
      "why": "`run_in_executor` runs the function in the pool and gives you an awaitable. The loop keeps serving other tasks. `asyncio.to_thread` is the same idea with a thread, which is enough for waiting but not for CPU."
     }
    },
    {
     "t": "mcq",
     "id": "p4-models-m1",
     "q": "A service resizes 500 images per request, each takes 40 ms of CPU. Which fits?",
     "o": [
      "asyncio with gather",
      "A thread pool",
      "A process pool",
      "A bigger Semaphore"
     ],
     "a": 2,
     "why": "It is CPU work. Under the GIL, threads and tasks take turns on one core. Separate processes use separate cores. asyncio is for waiting on I/O."
    }
   ]
  },
  {
   "id": "failure-review",
   "title": "The review, out loud",
   "blocks": [
    {
     "t": "p",
     "text": "In the screen you get a short function and are asked to review it out loud. Do not hunt for bugs in random order. Use the same six questions every time, in the same order. It keeps you calm and covers what they listen for."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Review order",
       "flow": [
        "1 one caller",
        "2 concurrency",
        "3 memory",
        "4 errors",
        "5 staleness",
        "6 visibility"
       ]
      }
     ]
    },
    {
     "t": "list",
     "items": [
      "One caller: what does it do with a single caller? What does it return, and what if the value does not exist?",
      "Concurrency: what if 100 callers arrive at once? Is there a check, then a wait, then an act? Is there a cap? Is work in order where it must be? Is a lock held across a slow call?",
      "Memory: what is the biggest this can grow? What removes entries? Are queues and task lists bounded?",
      "Errors: what if the source is slow, down or wrong? Is there a timeout? Are failures shared, retried safely, and not cached? Is a cancel handled?",
      "Staleness: how old can an answer be? What expires it? What happens when the source changes?",
      "Visibility: could you tell it is working? Hits, misses, loads, in-flight count, size, errors, latency."
     ]
    },
    {
     "t": "p",
     "text": "Snippet 2 is an async cache with a batch read."
    },
    {
     "t": "code",
     "id": "p4-rev2",
     "title": "Review 2: an async cache",
     "code": "import asyncio\n\ncache = {}\ncalls = 0\n\nasync def fetch(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    return key.upper()\n\nasync def get(key):\n    if key not in cache:\n        cache[key] = await fetch(key)\n    return cache[key]\n\nasync def get_many(keys):\n    return await asyncio.gather(*(get(k) for k in keys))\n\nprint(len(asyncio.run(get_many([\"a\"] * 20 + list(\"bcdefghij\")))), \"calls\", calls)\n",
     "notes": {
      "3": "a plain dict again",
      "9": "stands in for the network call",
      "13": "the check",
      "14": "the act, after an await",
      "18": "one task per key, all at once"
     },
     "ask": {
      "q": "Click every line with a problem (there are four).",
      "lines": [
       3,
       13,
       14,
       18
      ],
      "why": "1. `cache = {}` is unbounded and never expires. 2. The check and the set are separated by an await: twenty callers for key a all miss. 3. `fetch` has no timeout, so a hung source hangs every caller. 4. gather starts every key at once with no cap."
     }
    },
    {
     "t": "write",
     "id": "p4-rev2-w",
     "q": "Fix it: one fetch per key, a timeout on the fetch, at most 5 fetches at a time, and a bounded cache. Expected last line: 29 calls 10.",
     "starter": "import asyncio\n\ncache = {}\ncalls = 0\n\nasync def fetch(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    return key.upper()\n\nasync def get(key):\n    if key not in cache:\n        cache[key] = await fetch(key)\n    return cache[key]\n\nasync def get_many(keys):\n    return await asyncio.gather(*(get(k) for k in keys))\n\nprint(len(asyncio.run(get_many([\"a\"] * 20 + list(\"bcdefghij\")))), \"calls\", calls)\n",
     "solution": "import asyncio\n\nMAX = 100\ncache, inflight = {}, {}\ngate = asyncio.Semaphore(5)\ncalls = 0\n\nasync def fetch(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    return key.upper()\n\nasync def load(key):\n    async with gate:\n        value = await asyncio.wait_for(fetch(key), 1)\n    if len(cache) >= MAX:\n        cache.pop(next(iter(cache)))\n    cache[key] = value\n    return value\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    task = inflight.get(key)\n    if task is None:\n        task = asyncio.create_task(load(key))\n        inflight[key] = task\n        task.add_done_callback(lambda _: inflight.pop(key, None))\n    return await task\n\nasync def get_many(keys):\n    return await asyncio.gather(*(get(k) for k in keys))\n\nprint(len(asyncio.run(get_many([\"a\"] * 20 + list(\"bcdefghij\")))), \"calls\", calls)\n",
     "hint": "An inflight dict of tasks, wait_for around fetch, a Semaphore(5) around it, and pop the oldest entry when the cache is full.",
     "why": "single-flight removes the duplicates, the semaphore sits around the slow call, and wait_for bounds each attempt. Expiry is left out here; add (expires_at, value) as in the threaded fix."
    }
   ]
  },
  {
   "id": "failure-faq",
   "title": "Eight quick questions",
   "blocks": [
    {
     "t": "p",
     "text": "Short questions that come up in the room. Read each answer, then close the page and say it in your own words."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "Is a Python dict thread-safe?",
       "a": "A single operation like `d[k] = v` or `d.get(k)` is atomic. A sequence of them is not: check-then-set is two steps and another thread can run between them. You need a lock around the whole sequence."
      },
      {
       "q": "Does asyncio need locks?",
       "a": "Less than threads, but yes sometimes. Code between two awaits runs alone, so a plain increment is safe. A lock is needed when your check and your act are separated by an await, or when two jobs for one key must not overlap."
      },
      {
       "q": "What does the GIL protect?",
       "a": "The interpreter's own state: it lets one thread run Python bytecode at a time. It does not protect your data across several steps, and it does not make check-then-act safe. It also means threads do not speed up CPU work."
      },
      {
       "q": "When would you use a process pool?",
       "a": "For CPU-heavy work: image processing, parsing big files, number crunching. Each process has its own GIL, so they use separate cores. The cost is copying data between processes."
      },
      {
       "q": "What is a race condition, in one sentence?",
       "a": "A bug where the result depends on the order in which two things happen, usually because one checks a value, something else changes it, and the first acts on the old answer."
      },
      {
       "q": "What is backpressure?",
       "a": "When a slow consumer makes the producer slow down instead of letting work pile up. A bounded queue is the simple form: when it is full, `put` waits (or the job is rejected)."
      },
      {
       "q": "What does await actually do?",
       "a": "It runs the awaited thing. If that thing is not ready, the current task is paused and the event loop runs another task; when the thing is ready the loop resumes you on the next line. If it is ready already it returns at once."
      },
      {
       "q": "Why jitter?",
       "a": "Clients that failed together would retry together and hit the recovering service in waves. A random wait spreads the retries out so the service can recover."
      }
     ]
    }
   ]
  }
 ]
});
