/* Mercor coding tab, part 3: asyncio. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "asyncio",
 "n": 3,
 "title": "asyncio",
 "minutes": 40,
 "lead": "After this part you can read async code and say, at every line, whether it runs now, waits, or runs later, and you can add a cap or an order to it in a few minutes.",
 "sections": [
  {
   "id": "asyncio-loop",
   "title": "The event loop in plain words",
   "blocks": [
    {
     "t": "p",
     "text": "asyncio runs all your code on one thread. There are many tasks, but only one of them runs at any moment. A task keeps the thread until it reaches an `await` on something that is not ready yet. Then it hands the thread back and the loop runs another task."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Two tasks on one thread (time goes left to right)",
       "lanes": [
        [
         "task a",
         [
          [
           "runs",
           "hot",
           "1"
          ],
          [
           "waits: sleep(2)",
           "gap",
           "4"
          ],
          [
           "runs, ends",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "task b",
         [
          [
           "",
           "plain",
           "1"
          ],
          [
           "runs",
           "hot",
           "1"
          ],
          [
           "waits: sleep(1)",
           "gap",
           "2"
          ],
          [
           "runs, ends",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "Task b runs while a waits. At no point do two hot blocks sit on top of each other."
      },
      {
       "rule": "A task gives up the thread only at an await. Between two awaits your code runs alone."
      }
     ]
    },
    {
     "t": "code",
     "id": "p3-loop1",
     "title": "Two workers, one thread",
     "code": "import asyncio\n\nasync def worker(name, delay):\n    print(name, \"start\")\n    await asyncio.sleep(delay)\n    print(name, \"end\")\n\nasync def main():\n    await asyncio.gather(worker(\"a\", 2), worker(\"b\", 1))\n\nasyncio.run(main())\n",
     "notes": {
      "4": "runs right away when the task gets the thread",
      "5": "not ready for `delay` seconds: the task steps aside here",
      "9": "main waits for both workers to finish"
     },
     "ask": {
      "q": "Click the line where worker a hands the thread back to the loop.",
      "lines": [
       5
      ],
      "why": "The sleep is not ready, so the task pauses on that line and the loop starts worker b. When the delay is over the loop comes back to the line after it."
     }
    },
    {
     "t": "predict",
     "id": "p3-loop1-p",
     "code": "import asyncio\n\nasync def worker(name, delay):\n    print(name, \"start\")\n    await asyncio.sleep(delay)\n    print(name, \"end\")\n\nasync def main():\n    await asyncio.gather(worker(\"a\", 2), worker(\"b\", 1))\n\nasyncio.run(main())\n",
     "q": "What prints, in order?",
     "answer": "a start\nb start\nb end\na end",
     "why": "Both workers start before either ends: a pauses at its sleep, then b starts. b's sleep is shorter, so b ends first."
    }
   ]
  },
  {
   "id": "asyncio-task",
   "title": "Coroutine or task, and reading async code",
   "blocks": [
    {
     "t": "p",
     "text": "Calling an async function runs nothing. `fetch(1)` builds a coroutine object, like a bookmark. It runs when somebody awaits it, or when you wrap it in a task."
    },
    {
     "t": "table",
     "head": [
      "You write",
      "What happens",
      "Runs when"
     ],
     "rows": [
      [
       "`c = f()`",
       "makes a coroutine object, runs nothing",
       "never, unless you await it"
      ],
      [
       "`await f()`",
       "runs f to the end, right here, and gives you its result",
       "now, inside the current task"
      ],
      [
       "`t = asyncio.create_task(f())`",
       "schedules f as its own task, gives you a Task",
       "later, the next time the current task awaits"
      ],
      [
       "`await t`",
       "waits for that task and gives you its result",
       "t may already be finished"
      ]
     ]
    },
    {
     "t": "p",
     "text": "Two mistakes to spot on sight. First, calling an async function and forgetting `await`. Second, creating a task and letting `main` end before it ran. Keep a reference to every task you create and await it, or the loop may drop it."
    },
    {
     "t": "p",
     "text": "This is the skill the interview tests. For every line, say one of three things: it runs now, it may wait here, or it only schedules something to run later. Practise on the next three samples."
    },
    {
     "t": "code",
     "id": "p3-read1",
     "title": "Where do the tasks really start?",
     "code": "import asyncio\n\nasync def get_price(sym):\n    await asyncio.sleep(0.5)\n    return {\"AAA\": 10, \"BBB\": 20}[sym]\n\nasync def report(syms):\n    total = 0\n    jobs = [asyncio.create_task(get_price(s)) for s in syms]\n    print(\"scheduled\", len(jobs))\n    for j in jobs:\n        total += await j\n    print(\"total\", total)\n    return total\n\nasyncio.run(report([\"AAA\", \"BBB\"]))\n",
     "notes": {
      "5": "dictionary lookup, runs now, no pause",
      "9": "schedules, runs nothing yet",
      "10": "still main's turn: prints before any get_price line ran",
      "12": "first real pause of report: the loop now runs the two tasks"
     },
     "ask": {
      "q": "Click the line where get_price(\"AAA\") actually begins to run.",
      "lines": [
       12
      ],
      "why": "create_task only schedules. report keeps the thread through the print. At `await j` it has to wait, and the loop finally gives the two tasks their first turn."
     }
    },
    {
     "t": "predict",
     "id": "p3-coro-p",
     "code": "import asyncio\n\nasync def fetch(n):\n    print(\"fetch\", n, \"runs\")\n    await asyncio.sleep(1)\n    return n * 10\n\nasync def main():\n    c = fetch(1)\n    print(\"made coroutine\")\n    t = asyncio.create_task(fetch(2))\n    print(\"made task\")\n    print(await c)\n    print(await t)\n\nasyncio.run(main())\n",
     "q": "What prints, in order? Watch where each fetch starts.",
     "answer": "made coroutine\nmade task\nfetch 1 runs\nfetch 2 runs\n10\n20",
     "why": "main keeps the thread until `await c`. That starts fetch 1 inline, it prints, then it sleeps. Only now does the loop start the task, so fetch 2 prints second. The sleeps overlap, so the whole thing takes about 1 second."
    },
    {
     "t": "mcq",
     "id": "p3-task-m1",
     "q": "`results = [fetch(i) for i in range(3)]` then `print(results)`. How many fetches have started?",
     "o": [
      "3, they run in the background",
      "1, the first",
      "0, you only have three coroutine objects",
      "3, but they are paused"
     ],
     "a": 2,
     "why": "A list of coroutine objects is a list of bookmarks. Wrap each in `asyncio.create_task` or pass them to `asyncio.gather` to start them."
    }
   ]
  },
  {
   "id": "asyncio-patterns",
   "title": "Many at once, and in order",
   "blocks": [
    {
     "t": "p",
     "text": "Sequential awaits add up. Gathered awaits overlap, so the total is about the slowest one. This is the first thing to check when someone says async code is slow."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Three 1-second jobs",
       "lanes": [
        [
         "one by one",
         [
          [
           "job 0",
           "hot",
           "1"
          ],
          [
           "job 1",
           "hot",
           "1"
          ],
          [
           "job 2",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "gather: job 0",
         [
          [
           "sleep",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "gather: job 1",
         [
          [
           "sleep",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "gather: job 2",
         [
          [
           "sleep",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "Same work. The wait is shared instead of added."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Tool",
      "Use it when",
      "Order of results",
      "If one fails"
     ],
     "rows": [
      [
       "`asyncio.gather(*coros)`",
       "you want all results together",
       "input order",
       "first error is raised; the others keep running (cancel them yourself)"
      ],
      [
       "`gather(..., return_exceptions=True)`",
       "partial results are fine",
       "input order, errors sit in the list",
       "nothing is raised, you check each item"
      ],
      [
       "`asyncio.as_completed(coros)`",
       "you want to handle each result as it finishes",
       "finish order",
       "the error is raised when you await that item"
      ],
      [
       "`async with asyncio.TaskGroup()` (3.11+)",
       "all-or-nothing work",
       "you read each task's result",
       "the others are cancelled, errors arrive as an ExceptionGroup"
      ]
     ]
    },
    {
     "t": "p",
     "text": "Two kinds of order matter. The order results come back to you, and the order two jobs for the same key run."
    },
    {
     "t": "p",
     "text": "The second kind: two refreshes for the same key must never run at the same time, and must run in the order they arrived. One `asyncio.Lock` per key does both. asyncio.Lock wakes waiters in the order they arrived (first in, first out)."
    },
    {
     "t": "predict",
     "id": "p3-seq-p",
     "code": "import asyncio, time\n\nasync def job(n):\n    await asyncio.sleep(1)\n    return n\n\nasync def main():\n    t0 = time.perf_counter()\n    for n in range(3):\n        await job(n)\n    print(\"sequential\", round(time.perf_counter() - t0))\n    t0 = time.perf_counter()\n    await asyncio.gather(job(0), job(1), job(2))\n    print(\"gathered\", round(time.perf_counter() - t0))\n\nasyncio.run(main())\n",
     "q": "Each job sleeps 1 second. What prints?",
     "answer": "sequential 3\ngathered 1",
     "why": "Three awaits in a for loop run one after the other: 3 s. gather starts all three at once, they sleep side by side: 1 s."
    },
    {
     "t": "write",
     "id": "p3-lock-w",
     "q": "Two refreshes for key a overlap. Make refreshes for the same key run one after the other, in the order they were started, while key b stays independent.",
     "starter": "import asyncio\n\nlogs = {\"a\": [], \"b\": []}\n\nasync def refresh(key, tag):\n    logs[key].append(tag + \" start\")\n    await asyncio.sleep(0.1)\n    logs[key].append(tag + \" end\")\n\nasync def main():\n    await asyncio.gather(refresh(\"a\", \"r1\"), refresh(\"a\", \"r2\"), refresh(\"b\", \"r3\"))\n    print(logs)\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\nlogs = {\"a\": [], \"b\": []}\nlocks = {}\n\nasync def refresh(key, tag):\n    lock = locks.setdefault(key, asyncio.Lock())\n    async with lock:\n        logs[key].append(tag + \" start\")\n        await asyncio.sleep(0.1)\n        logs[key].append(tag + \" end\")\n\nasync def main():\n    await asyncio.gather(refresh(\"a\", \"r1\"), refresh(\"a\", \"r2\"), refresh(\"b\", \"r3\"))\n    print(logs)\n\nasyncio.run(main())\n",
     "hint": "Keep a dict of key to asyncio.Lock. Use setdefault to get the key's lock, then put the body in async with lock.",
     "why": "The lock is per key, so a and b do not wait for each other. Expected: a gets r1 start, r1 end, r2 start, r2 end. A real version also needs to delete idle locks, or the dict grows with every key."
    }
   ]
  },
  {
   "id": "asyncio-cap",
   "title": "Capping: Semaphore and a bounded Queue",
   "blocks": [
    {
     "t": "p",
     "text": "gather on 10,000 items starts 10,000 calls at once. A cap says: at most N of these at the same time. There are two tools. A Semaphore is a counter of free slots. A bounded Queue with N worker tasks is a fixed pool plus a waiting line."
    },
    {
     "t": "code",
     "id": "p3-peak1",
     "title": "A Semaphore around the slow part",
     "code": "import asyncio, time\n\nactive = peak = 0\n\nasync def fetch(i, sem):\n    global active, peak\n    async with sem:\n        active += 1\n        peak = max(peak, active)\n        await asyncio.sleep(1)\n        active -= 1\n    return i\n\nasync def main():\n    sem = asyncio.Semaphore(3)\n    t0 = time.perf_counter()\n    await asyncio.gather(*(fetch(i, sem) for i in range(10)))\n    print(\"peak\", peak, \"seconds\", round(time.perf_counter() - t0))\n\nasyncio.run(main())\n",
     "notes": {
      "5": "the semaphore is passed in so all tasks share one",
      "7": "takes a slot. If all 3 are taken, this task waits here",
      "10": "the slow call. It is inside the slot",
      "15": "created once, shared by all ten tasks",
      "17": "still starts all ten tasks. Seven of them wait at `async with sem`"
     },
     "ask": {
      "q": "Click the line where the cap is enforced.",
      "lines": [
       7
      ],
      "why": "`async with sem:` is where a task waits for a free slot. The cap goes around the slow call, inside the task, not around the gather."
     }
    },
    {
     "t": "p",
     "text": "A bounded Queue with workers gives the same cap and also bounds the waiting line. `put` waits when the queue is full. That wait is backpressure: the producer slows down instead of piling up memory."
    },
    {
     "t": "predict",
     "id": "p3-wrong-p",
     "code": "import asyncio\n\nactive = peak = 0\n\nasync def fetch(i):\n    global active, peak\n    active += 1\n    peak = max(peak, active)\n    await asyncio.sleep(0.1)\n    active -= 1\n\nasync def main():\n    sem = asyncio.Semaphore(3)\n    async with sem:\n        await asyncio.gather(*(fetch(i) for i in range(10)))\n    print(\"peak\", peak)\n\nasyncio.run(main())\n",
     "q": "The Semaphore is put around the whole gather instead. What does peak show?",
     "answer": "peak 10",
     "why": "One slot is taken once, by main, while it awaits the gather. The ten fetches inside never take a slot, so nothing is capped. Put the `async with` where each slow call happens."
    },
    {
     "t": "write",
     "id": "p3-cap-w",
     "q": "Ten fetches run at once. Add a cap of 3 so `peak` never goes above 3.",
     "starter": "import asyncio\n\nactive = peak = 0\n\nasync def fetch(i):\n    global active, peak\n    active += 1\n    peak = max(peak, active)\n    await asyncio.sleep(0.2)\n    active -= 1\n    return i * 2\n\nasync def main():\n    results = await asyncio.gather(*(fetch(i) for i in range(10)))\n    print(results)\n    print(\"peak\", peak)\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\nactive = peak = 0\n\nasync def fetch(i, sem):\n    global active, peak\n    async with sem:\n        active += 1\n        peak = max(peak, active)\n        await asyncio.sleep(0.2)\n        active -= 1\n    return i * 2\n\nasync def main():\n    sem = asyncio.Semaphore(3)\n    results = await asyncio.gather(*(fetch(i, sem) for i in range(10)))\n    print(results)\n    print(\"peak\", peak)\n\nasyncio.run(main())\n",
     "hint": "Create one Semaphore(3) in main, pass it to fetch, and wrap the slow part in async with sem.",
     "why": "Create the semaphore once, share it, and wrap only the slow part. Expected last line: peak 3."
    }
   ]
  },
  {
   "id": "asyncio-races",
   "title": "Races without threads: check, await, set",
   "blocks": [
    {
     "t": "p",
     "text": "A single thread does not mean no races. A race needs only this: a check, then an await, then an act on what the check said. During the await any other task can run and change the answer."
    },
    {
     "t": "code",
     "id": "p3-race",
     "title": "A cache with a race window",
     "code": "import asyncio\n\ncache = {}\nloads = 0\n\nasync def load(key):\n    global loads\n    loads += 1\n    await asyncio.sleep(0.1)\n    return key.upper()\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    value = await load(key)\n    cache[key] = value\n    return value\n\nasync def main():\n    await asyncio.gather(get(\"a\"), get(\"a\"), get(\"a\"))\n    print(\"loads\", loads)\n\nasyncio.run(main())\n",
     "notes": {
      "8": "counts calls to the slow source",
      "13": "the check: a miss for all three tasks",
      "15": "the gap: every other task runs here",
      "16": "the act: too late to stop the duplicate loads"
     },
     "ask": {
      "q": "Click the line where the other tasks get their chance to run between the check and the set.",
      "lines": [
       15
      ],
      "why": "The check `key in cache` and the write `cache[key] = value` are separated by an await. While task 1 waits in load, tasks 2 and 3 run their own check, still see a miss, and start their own loads."
     }
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "The race window across an await",
       "lanes": [
        [
         "task 1",
         [
          [
           "check: miss",
           "hot",
           "1"
          ],
          [
           "await load: race window",
           "gap",
           "5"
          ],
          [
           "set",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "task 2",
         [
          [
           "",
           "plain",
           "1"
          ],
          [
           "check: miss",
           "hot",
           "1"
          ],
          [
           "await load: race window",
           "gap",
           "5"
          ],
          [
           "set",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "task 3",
         [
          [
           "",
           "plain",
           "2"
          ],
          [
           "check: miss",
           "hot",
           "1"
          ],
          [
           "await load: race window",
           "gap",
           "5"
          ],
          [
           "set",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "Every check happens inside the window of the one before. Nothing is cached yet, so all three load."
      }
     ]
    },
    {
     "t": "p",
     "text": "The fix is single-flight: the first caller starts the load and stores the running **task** in a dict. Everybody else awaits that same task. One load, many waiters."
    },
    {
     "t": "p",
     "text": "Why store the task and not the coroutine? A coroutine can be awaited once. A task can be awaited by any number of callers."
    },
    {
     "t": "mcq",
     "id": "p3-race-m1",
     "q": "Which change removes the race in `if key in cache: ... await load(key) ... cache[key] = v`?",
     "o": [
      "Wrap the line `cache[key] = v` in a Lock",
      "Add a Semaphore(1) around load only",
      "Store the running task in a dict before the first await and have everyone await it",
      "Use gather instead of awaiting load"
     ],
     "a": 2,
     "why": "Locking only the set still lets three loads happen. A Semaphore(1) around load would run them one after the other, three loads in a row. The fix is to not start the second load at all."
    }
   ]
  },
  {
   "id": "asyncio-block",
   "title": "Blocking the loop",
   "blocks": [
    {
     "t": "p",
     "text": "Every task shares the thread. A plain `time.sleep`, a synchronous HTTP call, a database driver that is not async, or a big CPU loop does not await. It holds the thread, and every other task stops: timeouts do not fire, other requests wait, the health check fails."
    },
    {
     "t": "code",
     "id": "p3-block",
     "title": "A blocking sleep and a friendly one",
     "code": "import asyncio, time\n\nticks = 0\n\nasync def ticker():\n    global ticks\n    while True:\n        await asyncio.sleep(0.05)\n        ticks += 1\n\nasync def main():\n    t = asyncio.create_task(ticker())\n    await asyncio.sleep(0)\n    time.sleep(0.5)\n    print(\"ticker ran during time.sleep:\", ticks > 0)\n    await asyncio.sleep(0.5)\n    print(\"ticker ran during asyncio.sleep:\", ticks > 0)\n    t.cancel()\n\nasyncio.run(main())\n",
     "notes": {
      "5": "a heartbeat task: counts every 0.05 s while it can run",
      "13": "lets the ticker start",
      "14": "blocks the whole thread. No task runs",
      "16": "yields. The ticker runs during the wait"
     },
     "ask": {
      "q": "Click the line that freezes every other task.",
      "lines": [
       14
      ],
      "why": "`time.sleep` is not an await. It keeps the only thread for half a second, so the ticker can not run. `asyncio.sleep` gives the thread away."
     }
    },
    {
     "t": "p",
     "text": "The fix for a blocking call you can not rewrite is `asyncio.to_thread(func, *args)`. It runs the function in a worker thread and lets you await it, so the loop stays free. It helps with waiting (network, disk, sleep). It does not make CPU work faster, because of the GIL; for CPU work use a process pool (next part)."
    },
    {
     "t": "mcq",
     "id": "p3-block-m1",
     "q": "An async handler calls `requests.get(url)` (a synchronous HTTP client). The service handles 200 requests at once. What do you see?",
     "o": [
      "Nothing, requests is fast",
      "Each call stops the loop for its duration, so requests are served one after the other",
      "The calls run in threads automatically",
      "An error is raised"
     ],
     "a": 1,
     "why": "A sync client blocks the loop for every call. Use an async client (httpx.AsyncClient, aiohttp) or wrap the call in `asyncio.to_thread`. In a review, say which one and why."
    }
   ]
  }
 ]
});
