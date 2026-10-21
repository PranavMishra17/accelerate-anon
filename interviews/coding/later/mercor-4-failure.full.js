/* Mercor coding tab, part 4: Failure, time and the review. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "failure",
 "n": 4,
 "title": "Failure, time and the review",
 "minutes": 45,
 "lead": "After this part you can say, with confidence, how concurrent code fails (timeouts, cancels, retries, duplicate writes, growth) and what you would change, using a fixed six-step review order.",
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
     "t": "predict",
     "id": "p4-timeout-p",
     "code": "import asyncio\n\nasync def slow():\n    try:\n        await asyncio.sleep(5)\n    except asyncio.CancelledError:\n        print(\"slow: cancelled\")\n        raise\n    finally:\n        print(\"slow: cleanup\")\n\nasync def main():\n    try:\n        async with asyncio.timeout(0.1):\n            await slow()\n    except TimeoutError:\n        print(\"caller: timed out\")\n\nasyncio.run(main())\n",
     "q": "What prints, in order?",
     "answer": "slow: cancelled\nslow: cleanup\ncaller: timed out",
     "why": "The deadline cancels slow(). Inside it, the except block prints, re-raises, the finally block prints. Only then does the caller see TimeoutError."
    },
    {
     "t": "predict",
     "id": "p4-waitfor-p",
     "code": "import asyncio\n\nasync def slow():\n    try:\n        await asyncio.sleep(5)\n    finally:\n        print(\"slow: cleanup\")\n\nasync def main():\n    try:\n        await asyncio.wait_for(slow(), 0.1)\n    except TimeoutError:\n        print(\"caller: timed out\")\n\nasyncio.run(main())\n",
     "q": "Same idea with wait_for and no except block in slow(). What prints?",
     "answer": "slow: cleanup\ncaller: timed out",
     "why": "wait_for cancels slow() at the deadline. The finally block still runs. This is why cleanup belongs in finally."
    },
    {
     "t": "p",
     "text": "The rule on cancellation: never swallow `CancelledError`. If you catch it, do your cleanup and raise it again. A task that eats the cancel looks cancelled to you but keeps running, and timeouts stop working."
    },
    {
     "t": "predict",
     "id": "p4-stub-p",
     "code": "import asyncio\n\nasync def stubborn():\n    try:\n        await asyncio.sleep(5)\n    except asyncio.CancelledError:\n        print(\"ignored cancel\")\n    return \"done anyway\"\n\nasync def main():\n    t = asyncio.create_task(stubborn())\n    await asyncio.sleep(0.1)\n    t.cancel()\n    print(await t)\n    print(\"cancelled:\", t.cancelled())\n\nasyncio.run(main())\n",
     "q": "The task catches CancelledError and does not re-raise. What prints?",
     "answer": "ignored cancel\ndone anyway\ncancelled: False",
     "why": "The task ignored the cancel, finished normally and returned a value. t.cancelled() is False. Nothing stopped it."
    },
    {
     "t": "write",
     "id": "p4-stub-w",
     "q": "The worker eats the cancel. Fix it so the task really ends as cancelled and still prints its cleanup line.",
     "starter": "import asyncio\n\nasync def worker():\n    try:\n        await asyncio.sleep(5)\n    except asyncio.CancelledError:\n        print(\"cleanup\")\n\nasync def main():\n    t = asyncio.create_task(worker())\n    await asyncio.sleep(0.1)\n    t.cancel()\n    await asyncio.gather(t, return_exceptions=True)\n    print(\"cancelled:\", t.cancelled())\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\nasync def worker():\n    try:\n        await asyncio.sleep(5)\n    except asyncio.CancelledError:\n        print(\"cleanup\")\n        raise\n\nasync def main():\n    t = asyncio.create_task(worker())\n    await asyncio.sleep(0.1)\n    t.cancel()\n    await asyncio.gather(t, return_exceptions=True)\n    print(\"cancelled:\", t.cancelled())\n\nasyncio.run(main())\n",
     "hint": "Add one line at the end of the except block.",
     "why": "`raise` inside the except block lets the cancellation continue. Expected: cleanup, then cancelled: True."
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
    },
    {
     "t": "mcq",
     "id": "p4-timeout-m1",
     "q": "A cache loader has no timeout and the source hangs. 500 requests per second arrive for one key, and they all join the in-flight load. What do you see after a minute?",
     "o": [
      "Nothing, single-flight protects the source",
      "30,000 tasks all waiting on one hung load, and memory climbing",
      "The hung load times out by itself after 30 s",
      "Requests are rejected automatically"
     ],
     "a": 1,
     "why": "Single-flight shares the wait, so every caller waits on the same hung call. Put the timeout on the load, not only on the caller, so the shared wait ends and the entry is removed."
    }
   ]
  },
  {
   "id": "failure-errors",
   "title": "Errors in concurrent code",
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
     "t": "predict",
     "id": "p4-err0-p",
     "code": "import asyncio\n\ninflight = {}\ncalls = 0\n\nasync def load(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    if calls == 1:\n        raise RuntimeError(\"source down\")\n    return \"ok\"\n\nasync def get(key):\n    if key not in inflight:\n        inflight[key] = asyncio.create_task(load(key))\n    return await inflight[key]\n\nasync def main():\n    for i in range(3):\n        try:\n            print(i, await get(\"a\"))\n        except RuntimeError as e:\n            print(i, \"error:\", e)\n    print(\"calls\", calls)\n\nasyncio.run(main())\n",
     "q": "The first load fails; later loads would succeed. Three calls to get('a') one after another. What prints?",
     "answer": "0 error: source down\n1 error: source down\n2 error: source down\ncalls 1",
     "why": "The failed task stays in the dict, so every later call awaits the same dead task and gets the same error. The source recovered, but calls stays at 1. One failure is now permanent."
    },
    {
     "t": "write",
     "id": "p4-err-w",
     "q": "A failed load stays in `inflight` forever. Make every later call try again after a failure (and also clean up after a success).",
     "starter": "import asyncio\n\ninflight = {}\ncalls = 0\n\nasync def load(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    if calls == 1:\n        raise RuntimeError(\"source down\")\n    return \"ok\"\n\nasync def get(key):\n    if key not in inflight:\n        inflight[key] = asyncio.create_task(load(key))\n    return await inflight[key]\n\nasync def main():\n    for i in range(3):\n        try:\n            print(i, await get(\"a\"))\n        except RuntimeError as e:\n            print(i, \"error:\", e)\n    print(\"calls\", calls)\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\ninflight = {}\ncalls = 0\n\nasync def load(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    if calls == 1:\n        raise RuntimeError(\"source down\")\n    return \"ok\"\n\nasync def get(key):\n    if key not in inflight:\n        task = asyncio.create_task(load(key))\n        task.add_done_callback(lambda _: inflight.pop(key, None))\n        inflight[key] = task\n    return await inflight[key]\n\nasync def main():\n    for i in range(3):\n        try:\n            print(i, await get(\"a\"))\n        except RuntimeError as e:\n            print(i, \"error:\", e)\n    print(\"calls\", calls)\n\nasyncio.run(main())\n",
     "hint": "Remove the key from inflight when the task finishes, success or failure: task.add_done_callback.",
     "why": "Expected: call 0 fails, calls 1 and 2 succeed, calls 3. The sample has no value cache, so each call loads again; the point is that the dead task is gone from the dict."
    },
    {
     "t": "table",
     "head": [
      "Result of the load",
      "Cache it?",
      "Why"
     ],
     "rows": [
      [
       "a value",
       "yes, with a TTL",
       "the normal case"
      ],
      [
       "'does not exist' (the source answered)",
       "yes, for a short time (negative caching)",
       "stops repeated misses from hitting the source; the mock does this at tiered.py lines 100 and 101"
      ],
      [
       "a timeout or a 5xx",
       "no",
       "the source did not answer; you know nothing"
      ],
      [
       "an old value when the refresh failed",
       "serve it, do not renew it",
       "stale on error: better than an error page (tiered.py lines 85 to 88)"
      ]
     ]
    },
    {
     "t": "mcq",
     "id": "p4-err-m1",
     "q": "A product lookup times out. Which cache write is right?",
     "o": [
      "Store None for 5 minutes so the source is left alone",
      "Store nothing, raise the error, and let the next request retry",
      "Store the exception object for 1 hour",
      "Store an empty dict"
     ],
     "a": 1,
     "why": "A timeout says nothing about the product. Caching it as 'does not exist' turns a short outage into five minutes of wrong answers. Negative caching is for answers the source actually gave."
    }
   ]
  },
  {
   "id": "failure-retries",
   "title": "Retries done right",
   "blocks": [
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
     "t": "vis",
     "vis": [
      {
       "title": "Retry storm: no jitter",
       "lanes": [
        [
         "client 1",
         [
          [
           "call",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "2"
          ],
          [
           "retry",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "4"
          ],
          [
           "retry",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "client 2",
         [
          [
           "call",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "2"
          ],
          [
           "retry",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "4"
          ],
          [
           "retry",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "client 3",
         [
          [
           "call",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "2"
          ],
          [
           "retry",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "4"
          ],
          [
           "retry",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "Three clients fail together and retry together, again and again. The source gets a spike every time."
      },
      {
       "title": "Full jitter",
       "lanes": [
        [
         "client 1",
         [
          [
           "call",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "1"
          ],
          [
           "retry",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "5"
          ],
          [
           "retry",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "client 2",
         [
          [
           "call",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "2"
          ],
          [
           "",
           "plain",
           "1"
          ],
          [
           "retry",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "3"
          ],
          [
           "retry",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "client 3",
         [
          [
           "call",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "3"
          ],
          [
           "",
           "plain",
           "2"
          ],
          [
           "retry",
           "hot",
           "1"
          ],
          [
           "wait",
           "gap",
           "1"
          ],
          [
           "retry",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "Each client waits a random time up to the cap. The retries spread out and the source can recover."
      }
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
     "t": "predict",
     "id": "p4-retry-p",
     "code": "import asyncio\nimport random\n\nclass Transient(Exception):\n    pass\n\nasync def call_with_retry(op, attempts=4, base=0.1, cap=1.0, per_try=0.5,\n                          sleep=asyncio.sleep, rng=random.random):\n    for n in range(1, attempts + 1):\n        try:\n            return await asyncio.wait_for(op(), per_try)\n        except (Transient, TimeoutError):\n            if n == attempts:\n                raise\n            ceiling = min(cap, base * 2 ** (n - 1))\n            print(f\"attempt {n} failed, wait up to {ceiling}\")\n            await sleep(rng() * ceiling)\n\ncalls = 0\n\nasync def flaky():\n    global calls\n    calls += 1\n    if calls < 4:\n        raise Transient()\n    return \"ok\"\n\nprint(asyncio.run(call_with_retry(flaky, rng=lambda: 0.0)))\n",
     "q": "flaky() fails three times and then works. The random number is stubbed to 0.0. What prints?",
     "answer": "attempt 1 failed, wait up to 0.1\nattempt 2 failed, wait up to 0.2\nattempt 3 failed, wait up to 0.4\nok",
     "why": "The ceiling doubles each time: 0.1, 0.2, 0.4. The real wait is random up to that ceiling (0 here, because of the stub). The fourth attempt works."
    },
    {
     "t": "write",
     "id": "p4-bk-w",
     "q": "backoff() grows without a limit and has no jitter. Make it return a random wait between 0 and min(cap, base * 2 ** (attempt - 1)). The tests pass rng = 1.0 (the ceiling) and then 0.5.",
     "starter": "def backoff(attempt, base=0.1, cap=1.0, rng=lambda: 1.0):\n    return base * 2 ** attempt\n\nprint([round(backoff(n, rng=lambda: 1.0), 2) for n in range(1, 7)])\nprint([round(backoff(n, rng=lambda: 0.5), 2) for n in range(1, 7)])\n",
     "solution": "def backoff(attempt, base=0.1, cap=1.0, rng=lambda: 1.0):\n    ceiling = min(cap, base * 2 ** (attempt - 1))\n    return rng() * ceiling\n\nprint([round(backoff(n, rng=lambda: 1.0), 2) for n in range(1, 7)])\nprint([round(backoff(n, rng=lambda: 0.5), 2) for n in range(1, 7)])\n",
     "hint": "ceiling = min(cap, base * 2 ** (attempt - 1)), then return rng() * ceiling.",
     "why": "Expected, first list: [0.1, 0.2, 0.4, 0.8, 1.0, 1.0], second: half of each. Attempt 1 uses 2 ** 0, so the first ceiling is the base."
    },
    {
     "t": "p",
     "text": "A circuit breaker protects the source and your own capacity when it is clearly down. In one paragraph: it is **closed** and lets calls through while counting failures in a row; after N failures it **opens** and fails every call at once without calling the source; after a cool-off it goes **half-open** and lets one probe call through; if the probe succeeds it closes, if it fails it opens again."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Circuit breaker",
       "flow": [
        "closed: calls pass",
        "N failures in a row",
        "open: fail fast",
        "cool-off over: one probe",
        "success closes, failure reopens"
       ]
      }
     ]
    },
    {
     "t": "p",
     "text": "Now open the mock and find it: `app/clients/pricing.py`. The retry loop is lines 75 to 98. Line 82 is `wait_for` on every attempt. Line 85 retries only `TransientProviderError`; line 87 sends `PermanentProviderError` straight out. Lines 100 to 103 are the full-jitter backoff. Line 36 has a TODO: a cancelled probe leaves the breaker stuck. A reviewer who finds a known gap and says so is more convincing than one who says everything is fine."
    },
    {
     "t": "mcq",
     "id": "p4-retry-m1",
     "q": "A service retries 3 times with no jitter. The provider goes down for 2 seconds and 2,000 clients are connected. What does it look like when it comes back?",
     "o": [
      "A smooth return to normal load",
      "A wave of about 2,000 calls at the same moments, again and again, which can knock it over again",
      "The breaker opens by itself",
      "Only one client retries"
     ],
     "a": 1,
     "why": "Everyone failed at the same time and waits the same time. Jitter spreads the retries over the whole window. This is the answer to 'why jitter' in the quick questions."
    }
   ]
  },
  {
   "id": "failure-idempotency",
   "title": "Idempotency: a retry must not charge twice",
   "blocks": [
    {
     "t": "p",
     "text": "Retries are only safe for writes if doing the write twice has the same effect as doing it once. The client sends an **idempotency key** with the request. The server remembers the key."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "How the server handles a key",
       "flow": [
        "claim the key (set if absent)",
        "do the work",
        "store the result under the key",
        "a retry with the key replays the stored result"
       ]
      }
     ]
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
     "t": "predict",
     "id": "p4-idem0-p",
     "code": "import asyncio\n\ndone = {}\ncharges = 0\n\nasync def place(key):\n    global charges\n    if key in done:\n        return done[key]\n    await asyncio.sleep(0.1)\n    charges += 1\n    done[key] = f\"order-{charges}\"\n    return done[key]\n\nasync def main():\n    results = await asyncio.gather(place(\"k1\"), place(\"k1\"))\n    print(results, \"charges\", charges)\n\nasyncio.run(main())\n",
     "q": "A client retried the same request, so two calls with key k1 run together. What prints?",
     "answer": "['order-1', 'order-2'] charges 2",
     "why": "The check `key in done` and the write `done[key] = ...` are separated by an await. That is the same race as the cache stampede, and here it charges the customer twice."
    },
    {
     "t": "write",
     "id": "p4-idem-w",
     "q": "Two calls with the same key charge twice. Claim the key before the slow part so the second call waits for the first and gets the same order. A later call must replay too.",
     "starter": "import asyncio\n\ndone = {}\ncharges = 0\n\nasync def place(key):\n    global charges\n    if key in done:\n        return done[key]\n    await asyncio.sleep(0.1)\n    charges += 1\n    done[key] = f\"order-{charges}\"\n    return done[key]\n\nasync def main():\n    results = await asyncio.gather(place(\"k1\"), place(\"k1\"))\n    print(results, \"charges\", charges)\n    print(await place(\"k1\"), \"charges\", charges)\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\nclaims = {}\ncharges = 0\n\nasync def place(key):\n    global charges\n    if key in claims:\n        return await claims[key]\n    fut = asyncio.get_running_loop().create_future()\n    claims[key] = fut\n    try:\n        await asyncio.sleep(0.1)\n        charges += 1\n        fut.set_result(f\"order-{charges}\")\n    except Exception as exc:\n        del claims[key]\n        fut.set_exception(exc)\n        fut.exception()\n        raise\n    return fut.result()\n\nasync def main():\n    results = await asyncio.gather(place(\"k1\"), place(\"k1\"))\n    print(results, \"charges\", charges)\n    print(await place(\"k1\"), \"charges\", charges)\n\nasyncio.run(main())\n",
     "hint": "Put a Future in a dict before the first await; a second call awaits it. Remove the entry if the work fails.",
     "why": "Expected: ['order-1', 'order-1'] charges 1, then order-1 charges 1. The claim is stored before the await, the same trick as single-flight. In production the claim lives in a shared store (set-if-absent with an expiry), because the retry may reach another server."
    },
    {
     "t": "p",
     "text": "Now open the mock and find it: `app/orders.py`. Line 39 is the claim: `set_nx` returns false if the slot exists, then line 40 replays. Line 44 deletes the claim when the work failed, so the client can retry. Line 47 stores the finished order under the key with a TTL. Lines 70 and 71 reject a key reused for a different quote. Line 72 and 73 return the stored order. In `app/clients/pricing.py` line 71 to 73, `confirm_order` can be retried only because the provider also dedups on the idempotency key."
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
   "id": "failure-memory",
   "title": "Memory and growth",
   "blocks": [
    {
     "t": "p",
     "text": "A cache that works in a test can fall over in production because something only ever grows. In the review, walk through every container and ask: what removes things from here?"
    },
    {
     "t": "list",
     "items": [
      "Unbounded dict: a cache keyed by user input (user ids, search text) with no maximum size and no expiry.",
      "Unbounded queue: `Queue()` with no maxsize accepts work faster than it is finished, until memory ends.",
      "A task per item: `create_task` for 1,000,000 items makes 1,000,000 live tasks. Cap them or use workers.",
      "In-flight maps never cleaned: an entry that is not removed on failure or cancel stays forever (see the earlier write).",
      "Per-key locks and state: a dict of locks that is never emptied grows with every key ever seen (refresh.py lines 80 to 82 clean up).",
      "`lru_cache` on a method: the cache holds `self` as part of every key, so the object is never freed."
     ]
    },
    {
     "t": "predict",
     "id": "p4-mem1-p",
     "code": "import gc\nimport weakref\nfrom functools import lru_cache\n\nclass Pricing:\n    @lru_cache(maxsize=None)\n    def price(self, sku):\n        return len(sku)\n\np = Pricing()\np.price(\"abc\")\nref = weakref.ref(p)\ndel p\ngc.collect()\nprint(\"freed:\", ref() is None)\n",
     "q": "An object is deleted after calling a method that has lru_cache on it. Was it freed?",
     "answer": "freed: False",
     "why": "The cache stores the call arguments, and `self` is one of them. The cache is on the class, so it keeps every instance that ever called the method alive. In mock1_review/pricing.py look for this."
    },
    {
     "t": "write",
     "id": "p4-mem-w",
     "q": "Fix the leak: the Pricing object should be freed after `del p`, and the cache should have a maximum size.",
     "starter": "import gc\nimport weakref\nfrom functools import lru_cache\n\nclass Pricing:\n    @lru_cache(maxsize=None)\n    def price(self, sku):\n        return len(sku)\n\np = Pricing()\np.price(\"abc\")\nref = weakref.ref(p)\ndel p\ngc.collect()\nprint(\"freed:\", ref() is None)\n",
     "solution": "import gc\nimport weakref\nfrom functools import lru_cache\n\n@lru_cache(maxsize=128)\ndef _price(sku):\n    return len(sku)\n\nclass Pricing:\n    def price(self, sku):\n        return _price(sku)\n\np = Pricing()\np.price(\"abc\")\nref = weakref.ref(p)\ndel p\ngc.collect()\nprint(\"freed:\", ref() is None)\n",
     "hint": "Move the cached function out of the class and key it on sku only. Give it a maxsize.",
     "why": "A module-level cached function is keyed on the sku, not on self, so instances are not held. Expected: freed: True."
    },
    {
     "t": "predict",
     "id": "p4-qshed-p",
     "code": "import asyncio\n\nasync def main():\n    q = asyncio.Queue(maxsize=2)\n    for i in range(4):\n        try:\n            q.put_nowait(i)\n        except asyncio.QueueFull:\n            print(\"shed\", i)\n    print(\"size\", q.qsize())\n\nasyncio.run(main())\n",
     "q": "A queue with maxsize 2 receives four put_nowait calls. What prints?",
     "answer": "shed 2\nshed 3\nsize 2",
     "why": "A full queue refuses more work. The caller decides: wait (put), or drop the job (put_nowait and shed). Shedding is what refresh.py does at line 48; it keeps the request path fast."
    },
    {
     "t": "mcq",
     "id": "p4-mem-m1",
     "q": "Which of these most likely grows without bound?",
     "o": [
      "`cache = OrderedDict()` with a max of 10,000 entries and eviction",
      "`seen = {}` filled with every request id the service has handled",
      "`Queue(maxsize=100)` drained by 4 workers",
      "A Semaphore(5)"
     ],
     "a": 1,
     "why": "The request-id dict has no limit and nothing removes entries. The other three are bounded by design. Always ask what removes things from a container."
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
     "t": "predict",
     "id": "p4-proc-p",
     "code": "import asyncio\nfrom concurrent.futures import ProcessPoolExecutor\n\ndef cpu(n):\n    return sum(i * i for i in range(n))\n\nasync def main():\n    loop = asyncio.get_running_loop()\n    with ProcessPoolExecutor(2) as pool:\n        a = loop.run_in_executor(pool, cpu, 10)\n        b = loop.run_in_executor(pool, cpu, 5)\n        print(await asyncio.gather(a, b))\n\nif __name__ == \"__main__\":\n    asyncio.run(main())\n",
     "q": "cpu(10) is the sum of squares of 0..9 and cpu(5) of 0..4. What prints?",
     "answer": "[285, 30]",
     "why": "285 and 30, returned in the order passed to gather. The work ran in other processes."
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
    },
    {
     "t": "mcq",
     "id": "p4-models-m2",
     "q": "You have an async service and one library call that is a blocking HTTP request, called ten times per request. What do you do first?",
     "o": [
      "Rewrite the service with threads",
      "Wrap each call in asyncio.to_thread (or switch to an async client) and cap how many run at once",
      "Add a process pool",
      "Raise the timeout"
     ],
     "a": 1,
     "why": "It is waiting, not computing, so a thread is right. Cap it: the default thread pool is limited, and ten calls per request times many requests can fill it."
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
     "text": "Snippet 1 is a threaded cache. Click the lines you would raise."
    },
    {
     "t": "code",
     "id": "p4-rev1",
     "title": "Review 1: a threaded cache",
     "code": "import threading\nimport time\nfrom concurrent.futures import ThreadPoolExecutor\n\ncache = {}\nlock = threading.Lock()\nloads = 0\n\ndef load(key):\n    global loads\n    loads += 1\n    time.sleep(0.05)\n    return key.upper()\n\ndef get(key):\n    if key in cache:\n        return cache[key]\n    with lock:\n        value = load(key)\n        cache[key] = value\n    return value\n\nwith ThreadPoolExecutor(8) as pool:\n    list(pool.map(get, [\"a\"] * 8))\nprint(\"loads\", loads, \"size\", len(cache))\n",
     "notes": {
      "5": "a plain dict as the cache",
      "6": "one lock for the whole cache",
      "16": "a check that is made without the lock",
      "18": "one lock for every key",
      "19": "the slow call",
      "20": "stored with no expiry"
     },
     "ask": {
      "q": "Click every line with a problem (there are four).",
      "lines": [
       5,
       16,
       18,
       20
      ],
      "why": "1. `cache = {}` has no maximum size. 2. The check is outside the lock and nothing re-checks after taking it, so eight threads miss and load one after the other. 3. One lock for all keys and the slow load happens inside it, so a miss on key x stops a miss on key y. 4. The value never expires, so it is stale forever."
     }
    },
    {
     "t": "predict",
     "id": "p4-rev1-p",
     "code": "import threading\nimport time\nfrom concurrent.futures import ThreadPoolExecutor\n\ncache = {}\nlock = threading.Lock()\nloads = 0\n\ndef load(key):\n    global loads\n    loads += 1\n    time.sleep(0.05)\n    return key.upper()\n\ndef get(key):\n    if key in cache:\n        return cache[key]\n    with lock:\n        value = load(key)\n        cache[key] = value\n    return value\n\nwith ThreadPoolExecutor(8) as pool:\n    list(pool.map(get, [\"a\"] * 8))\nprint(\"loads\", loads, \"size\", len(cache))\n",
     "q": "Eight threads ask for key a. What prints?",
     "answer": "loads 8 size 1",
     "why": "All eight miss before the first load finishes, then they load one after the other inside the lock. Eight loads for one key."
    },
    {
     "t": "write",
     "id": "p4-rev1-w",
     "q": "Fix it: one load per key, a lock that does not block other keys, a maximum size and an expiry. Expected last line: loads 1 size 1.",
     "starter": "import threading\nimport time\nfrom concurrent.futures import ThreadPoolExecutor\n\ncache = {}\nlock = threading.Lock()\nloads = 0\n\ndef load(key):\n    global loads\n    loads += 1\n    time.sleep(0.05)\n    return key.upper()\n\ndef get(key):\n    if key in cache:\n        return cache[key]\n    with lock:\n        value = load(key)\n        cache[key] = value\n    return value\n\nwith ThreadPoolExecutor(8) as pool:\n    list(pool.map(get, [\"a\"] * 8))\nprint(\"loads\", loads, \"size\", len(cache))\n",
     "solution": "import threading\nimport time\nfrom concurrent.futures import ThreadPoolExecutor\n\nTTL, MAX = 60, 1000\ncache = {}\nguard = threading.Lock()\nlocks = [threading.Lock() for _ in range(16)]\nloads = 0\n\ndef load(key):\n    global loads\n    loads += 1\n    time.sleep(0.05)\n    return key.upper()\n\ndef fresh(key):\n    hit = cache.get(key)\n    if hit and hit[0] > time.monotonic():\n        return hit[1]\n\ndef get(key):\n    value = fresh(key)\n    if value is None:\n        with locks[hash(key) % 16]:\n            value = fresh(key)\n            if value is None:\n                value = load(key)\n                with guard:\n                    if len(cache) >= MAX:\n                        cache.pop(next(iter(cache)))\n                    cache[key] = (time.monotonic() + TTL, value)\n    return value\n\nwith ThreadPoolExecutor(8) as pool:\n    list(pool.map(get, [\"a\"] * 8))\nprint(\"loads\", loads, \"size\", len(cache))\n",
     "hint": "Re-check after taking the lock. Use a small list of locks chosen by hash(key). Store (expires_at, value) and drop the oldest entry when full.",
     "why": "Check, take the key's lock, check again, load, store with an expiry. The striped locks are a fixed number, so the lock table itself can not grow. Eviction of the oldest inserted entry is crude; say a real LRU is the next step."
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
     "t": "predict",
     "id": "p4-rev2-p",
     "code": "import asyncio\n\ncache = {}\ncalls = 0\n\nasync def fetch(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    return key.upper()\n\nasync def get(key):\n    if key not in cache:\n        cache[key] = await fetch(key)\n    return cache[key]\n\nasync def get_many(keys):\n    return await asyncio.gather(*(get(k) for k in keys))\n\nprint(len(asyncio.run(get_many([\"a\"] * 20 + list(\"bcdefghij\")))), \"calls\", calls)\n",
     "q": "29 keys requested, 10 different. What prints: the number of results, and the number of fetch calls?",
     "answer": "29 calls 29",
     "why": "Every one of the twenty a-callers sees a miss, so fetch is called 29 times, not 10."
    },
    {
     "t": "write",
     "id": "p4-rev2-w",
     "q": "Fix it: one fetch per key, a timeout on the fetch, at most 5 fetches at a time, and a bounded cache. Expected last line: 29 calls 10.",
     "starter": "import asyncio\n\ncache = {}\ncalls = 0\n\nasync def fetch(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    return key.upper()\n\nasync def get(key):\n    if key not in cache:\n        cache[key] = await fetch(key)\n    return cache[key]\n\nasync def get_many(keys):\n    return await asyncio.gather(*(get(k) for k in keys))\n\nprint(len(asyncio.run(get_many([\"a\"] * 20 + list(\"bcdefghij\")))), \"calls\", calls)\n",
     "solution": "import asyncio\n\nMAX = 100\ncache, inflight = {}, {}\ngate = asyncio.Semaphore(5)\ncalls = 0\n\nasync def fetch(key):\n    global calls\n    calls += 1\n    await asyncio.sleep(0.05)\n    return key.upper()\n\nasync def load(key):\n    async with gate:\n        value = await asyncio.wait_for(fetch(key), 1)\n    if len(cache) >= MAX:\n        cache.pop(next(iter(cache)))\n    cache[key] = value\n    return value\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    task = inflight.get(key)\n    if task is None:\n        task = asyncio.create_task(load(key))\n        inflight[key] = task\n        task.add_done_callback(lambda _: inflight.pop(key, None))\n    return await task\n\nasync def get_many(keys):\n    return await asyncio.gather(*(get(k) for k in keys))\n\nprint(len(asyncio.run(get_many([\"a\"] * 20 + list(\"bcdefghij\")))), \"calls\", calls)\n",
     "hint": "An inflight dict of tasks, wait_for around fetch, a Semaphore(5) around it, and pop the oldest entry when the cache is full.",
     "why": "single-flight removes the duplicates, the semaphore sits around the slow call, and wait_for bounds each attempt. Expiry is left out here; add (expires_at, value) as in the threaded fix."
    },
    {
     "t": "p",
     "text": "Snippet 3 is a retry wrapper. The test calls it with a permanent error and with a transient error that never goes away."
    },
    {
     "t": "code",
     "id": "p4-rev3",
     "title": "Review 3: an async retry",
     "code": "import asyncio\n\nDELAY = 0.01\n\nclass Transient(Exception):\n    pass\n\nclass Permanent(Exception):\n    pass\n\nasync def fetch_with_retry(op):\n    for attempt in range(10):\n        try:\n            return await op()\n        except Exception:\n            await asyncio.sleep(DELAY)\n\ncounts = {}\n\nasync def bad_request():\n    counts[\"bad_request\"] = counts.get(\"bad_request\", 0) + 1\n    raise Permanent(\"400\")\n\nasync def always_transient():\n    counts[\"always_transient\"] = counts.get(\"always_transient\", 0) + 1\n    raise Transient()\n\nasync def main():\n    for op in (bad_request, always_transient):\n        try:\n            result = await fetch_with_retry(op)\n        except Exception as exc:\n            result = type(exc).__name__\n        print(op.__name__, result, \"attempts\", counts[op.__name__])\n\nasyncio.run(main())\n",
     "notes": {
      "12": "ten attempts",
      "14": "no deadline on an attempt",
      "15": "every error is retried",
      "16": "the same wait every time"
     },
     "ask": {
      "q": "Click every line with a problem (there are four).",
      "lines": [
       12,
       14,
       15,
       16
      ],
      "why": "1. Ten attempts is a lot, and retries multiply across layers. 2. `op()` has no timeout, so one hung attempt can use up all the time. 3. A permanent error (400) is retried ten times. 4. The same wait each time has no backoff and no jitter. Also: after the last attempt the function returns None silently, so the caller thinks it worked."
     }
    },
    {
     "t": "predict",
     "id": "p4-rev3-p",
     "code": "import asyncio\n\nDELAY = 0.01\n\nclass Transient(Exception):\n    pass\n\nclass Permanent(Exception):\n    pass\n\nasync def fetch_with_retry(op):\n    for attempt in range(10):\n        try:\n            return await op()\n        except Exception:\n            await asyncio.sleep(DELAY)\n\ncounts = {}\n\nasync def bad_request():\n    counts[\"bad_request\"] = counts.get(\"bad_request\", 0) + 1\n    raise Permanent(\"400\")\n\nasync def always_transient():\n    counts[\"always_transient\"] = counts.get(\"always_transient\", 0) + 1\n    raise Transient()\n\nasync def main():\n    for op in (bad_request, always_transient):\n        try:\n            result = await fetch_with_retry(op)\n        except Exception as exc:\n            result = type(exc).__name__\n        print(op.__name__, result, \"attempts\", counts[op.__name__])\n\nasyncio.run(main())\n",
     "q": "What prints for the two operations?",
     "answer": "bad_request None attempts 10\nalways_transient None attempts 10",
     "why": "The permanent error is tried ten times, then the function returns None. The transient one also ends with None and never raises. Both hide the failure."
    },
    {
     "t": "write",
     "id": "p4-rev3-w",
     "q": "Fix it: 3 attempts, a timeout per attempt, retry only Transient and TimeoutError, backoff with jitter, and raise the last error. Expected: bad_request Permanent attempts 1, always_transient Transient attempts 3.",
     "starter": "import asyncio\n\nDELAY = 0.01\n\nclass Transient(Exception):\n    pass\n\nclass Permanent(Exception):\n    pass\n\nasync def fetch_with_retry(op):\n    for attempt in range(10):\n        try:\n            return await op()\n        except Exception:\n            await asyncio.sleep(DELAY)\n\ncounts = {}\n\nasync def bad_request():\n    counts[\"bad_request\"] = counts.get(\"bad_request\", 0) + 1\n    raise Permanent(\"400\")\n\nasync def always_transient():\n    counts[\"always_transient\"] = counts.get(\"always_transient\", 0) + 1\n    raise Transient()\n\nasync def main():\n    for op in (bad_request, always_transient):\n        try:\n            result = await fetch_with_retry(op)\n        except Exception as exc:\n            result = type(exc).__name__\n        print(op.__name__, result, \"attempts\", counts[op.__name__])\n\nasyncio.run(main())\n",
     "solution": "import asyncio\nimport random\n\nDELAY = 0.01\n\nclass Transient(Exception):\n    pass\n\nclass Permanent(Exception):\n    pass\n\nasync def fetch_with_retry(op, attempts=3, per_try=0.5):\n    for n in range(1, attempts + 1):\n        try:\n            return await asyncio.wait_for(op(), per_try)\n        except (Transient, TimeoutError):\n            if n == attempts:\n                raise\n            await asyncio.sleep(random.random() * DELAY * 2 ** (n - 1))\n\ncounts = {}\n\nasync def bad_request():\n    counts[\"bad_request\"] = counts.get(\"bad_request\", 0) + 1\n    raise Permanent(\"400\")\n\nasync def always_transient():\n    counts[\"always_transient\"] = counts.get(\"always_transient\", 0) + 1\n    raise Transient()\n\nasync def main():\n    for op in (bad_request, always_transient):\n        try:\n            result = await fetch_with_retry(op)\n        except Exception as exc:\n            result = type(exc).__name__\n        print(op.__name__, result, \"attempts\", counts[op.__name__])\n\nasyncio.run(main())\n",
     "hint": "Catch (Transient, TimeoutError) only, wait_for(op(), per_try), raise on the last attempt, and sleep random() * DELAY * 2 ** (n - 1).",
     "why": "A permanent error leaves at once with one attempt. The transient error is tried three times and then raised, so the caller knows. Say out loud that this retry is only safe for a write if it carries an idempotency key."
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
    },
    {
     "t": "mcq",
     "id": "p4-faq-m1",
     "q": "A bounded queue is full and the producer calls `await q.put(job)`. What happens?",
     "o": [
      "The oldest job is dropped",
      "The producer waits until a worker takes a job",
      "QueueFull is raised",
      "The queue grows by one"
     ],
     "a": 1,
     "why": "`put` waits when the queue is full: that is backpressure. `put_nowait` is the one that raises QueueFull, and the mock uses it to shed load (refresh.py line 48)."
    }
   ]
  }
 ]
});
