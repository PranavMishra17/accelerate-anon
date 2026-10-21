/* Mercor coding tab, part 3: asyncio. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "asyncio",
 "n": 3,
 "title": "asyncio",
 "minutes": 60,
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
     "t": "list",
     "items": [
      "One thread: only one line of your Python runs at a time, so a plain `x += 1` between two awaits can not be cut in half.",
      "Many tasks: each task is a function the loop can pause at an `await` and resume later.",
      "An await that is not ready: a sleep, a network reply, an empty queue, a lock someone else holds.",
      "An await that is ready returns at once and does not give up the thread."
     ]
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
    },
    {
     "t": "mcq",
     "id": "p3-loop-m1",
     "q": "One task runs a loop of 50 million additions with no await. What happens to the other tasks?",
     "o": [
      "They run at the same time on other cores",
      "They wait until the loop is done",
      "The loop pauses the task after a few milliseconds",
      "They run, but slower"
     ],
     "a": 1,
     "why": "Nothing interrupts a task between awaits. A long stretch of code with no await freezes every other task. That is the idea behind the last section of this part."
    }
   ]
  },
  {
   "id": "asyncio-task",
   "title": "Coroutine or task: when does it run",
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
     "t": "code",
     "id": "p3-coro",
     "title": "Coroutine and task side by side",
     "code": "import asyncio\n\nasync def fetch(n):\n    print(\"fetch\", n, \"runs\")\n    await asyncio.sleep(1)\n    return n * 10\n\nasync def main():\n    c = fetch(1)\n    print(\"made coroutine\")\n    t = asyncio.create_task(fetch(2))\n    print(\"made task\")\n    print(await c)\n    print(await t)\n\nasyncio.run(main())\n",
     "notes": {
      "9": "a coroutine object. Nothing printed yet",
      "11": "fetch(2) is scheduled. It has not run a single line yet",
      "13": "fetch(1) starts running here, inside main's own turn",
      "14": "t has been running since main first paused"
     },
     "ask": {
      "q": "Click the line that schedules fetch(2) to run later.",
      "lines": [
       11
      ],
      "why": "create_task puts fetch(2) on the loop's list and returns at once. The line `c = fetch(1)` only builds an object, and `await c` runs it right there."
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
     "t": "p",
     "text": "Two mistakes to spot on sight. First, calling an async function and forgetting `await`. Second, creating a task and letting `main` end before it ran. Keep a reference to every task you create and await it, or the loop may drop it."
    },
    {
     "t": "code",
     "id": "p3-noawait",
     "title": "A forgotten await",
     "code": "import asyncio\n\nasync def save(x):\n    print(\"saved\", x)\n\nasync def main():\n    save(1)\n    await save(2)\n\nasyncio.run(main())\n",
     "notes": {
      "7": "no await: builds a coroutine, never runs it",
      "8": "this one runs"
     },
     "ask": {
      "q": "Click the line that never runs its function body.",
      "lines": [
       7
      ],
      "why": "Without await or create_task the coroutine is thrown away. Python warns about it: RuntimeWarning: coroutine 'save' was never awaited."
     }
    },
    {
     "t": "predict",
     "id": "p3-orphan-p",
     "code": "import asyncio\n\nasync def side():\n    print(\"side start\")\n    await asyncio.sleep(0.1)\n    print(\"side end\")\n\nasync def main():\n    asyncio.create_task(side())\n    print(\"main done\")\n\nasyncio.run(main())\n",
     "q": "main creates a task and returns at once. What prints?",
     "answer": "main done\nside start",
     "why": "main returns at once. asyncio.run then cancels every task still pending. The side task gets one turn during that shutdown, prints side start, and is cancelled at its sleep, so side end never prints. You needed to `await` it."
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
   "id": "asyncio-read",
   "title": "Reading async code: now, wait, or later",
   "blocks": [
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
     "t": "code",
     "id": "p3-read2",
     "title": "Which lines can pause?",
     "code": "import asyncio\n\nasync def step(name):\n    await asyncio.sleep(0.2)\n    return name\n\nasync def pipeline():\n    a = await step(\"a\")\n    b = asyncio.create_task(step(\"b\"))\n    c = step(\"c\")\n    d = await asyncio.gather(step(\"d\"), step(\"e\"))\n    return a, await b, await c, d\n\nasync def main():\n    t0 = asyncio.get_running_loop().time()\n    print(await pipeline())\n    print(round(asyncio.get_running_loop().time() - t0, 1))\n\nasyncio.run(main())\n",
     "notes": {
      "8": "waits 0.2 s, nothing else is running",
      "9": "scheduled, b starts at the next pause",
      "10": "only an object. Nothing runs",
      "11": "waits; b runs during this wait",
      "12": "b is finished by now; c has not started, so `await c` runs it and waits"
     },
     "ask": {
      "q": "Click every line of pipeline() where it can pause.",
      "lines": [
       8,
       11,
       12
      ],
      "why": "The first line waits for a. The gather line waits for d and e (b runs during it). On the return line, `await b` is already done, but `await c` is the first time c runs, so it waits 0.2 s. `create_task` and `c = step(...)` never pause."
     }
    },
    {
     "t": "predict",
     "id": "p3-read2-p",
     "code": "import asyncio\n\nasync def step(name):\n    await asyncio.sleep(0.2)\n    return name\n\nasync def pipeline():\n    a = await step(\"a\")\n    b = asyncio.create_task(step(\"b\"))\n    c = step(\"c\")\n    d = await asyncio.gather(step(\"d\"), step(\"e\"))\n    return a, await b, await c, d\n\nasync def main():\n    t0 = asyncio.get_running_loop().time()\n    print(await pipeline())\n    print(round(asyncio.get_running_loop().time() - t0, 1))\n\nasyncio.run(main())\n",
     "q": "What does main print? The second line is the elapsed seconds, rounded to one decimal.",
     "answer": "('a', 'b', 'c', ['d', 'e'])\n0.6",
     "why": "Three waits happen one after the other: a, then the gather (b runs in it), then c. That is 3 x 0.2 = 0.6 s."
    },
    {
     "t": "code",
     "id": "p3-read3",
     "title": "Where does the worker wait?",
     "code": "import asyncio\n\nasync def worker(q, results, lock):\n    while True:\n        item = await q.get()\n        async with lock:\n            results.append(item)\n        q.task_done()\n\nasync def main():\n    q, results, lock = asyncio.Queue(), [], asyncio.Lock()\n    w = asyncio.create_task(worker(q, results, lock))\n    for i in range(3):\n        q.put_nowait(i)\n    await q.join()\n    w.cancel()\n    print(results)\n\nasyncio.run(main())\n",
     "notes": {
      "5": "waits while the queue is empty",
      "6": "waits if another task holds the lock",
      "8": "tells q.join() one item is finished",
      "15": "main waits until every item is marked done",
      "16": "the worker loops forever, so main cancels it"
     },
     "ask": {
      "q": "Click both lines where worker can wait.",
      "lines": [
       5,
       6
      ],
      "why": "`await q.get()` waits for an item. `async with lock` waits for the lock if someone holds it. The `results.append` inside has no await, so nobody can slip in between its steps."
     }
    },
    {
     "t": "mcq",
     "id": "p3-read-m1",
     "q": "Between `jobs = [create_task(...)]` and the first `await`, can any of the new tasks run?",
     "o": [
      "Yes, create_task starts them at once",
      "No, they start when the current task first pauses",
      "Only the first one",
      "Yes, but on another thread"
     ],
     "a": 1,
     "why": "A new task is only on the list. It gets its first turn when the current task reaches an await that is not ready."
    }
   ]
  },
  {
   "id": "asyncio-patterns",
   "title": "Many things at once: gather and friends",
   "blocks": [
    {
     "t": "p",
     "text": "Sequential awaits add up. Gathered awaits overlap, so the total is about the slowest one. This is the first thing to check when someone says async code is slow."
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
     "t": "predict",
     "id": "p3-gex-p",
     "code": "import asyncio\n\nasync def job(n):\n    await asyncio.sleep(n * 0.1)\n    if n == 1:\n        raise ValueError(\"bad 1\")\n    return n\n\nasync def main():\n    r = await asyncio.gather(job(0), job(1), job(2), return_exceptions=True)\n    print(r)\n    try:\n        await asyncio.gather(job(0), job(1), job(2))\n    except ValueError as e:\n        print(\"raised\", e)\n\nasyncio.run(main())\n",
     "q": "job 1 raises. What do the two print lines show?",
     "answer": "[0, ValueError('bad 1'), 2]\nraised bad 1",
     "why": "With return_exceptions=True the error becomes a list item and the other results still arrive. Without it, the first error is raised to you."
    },
    {
     "t": "predict",
     "id": "p3-tg-p",
     "code": "import asyncio\n\nasync def ok():\n    try:\n        await asyncio.sleep(1)\n    finally:\n        print(\"ok cancelled\")\n\nasync def bad():\n    await asyncio.sleep(0.1)\n    raise ValueError(\"boom\")\n\nasync def main():\n    try:\n        async with asyncio.TaskGroup() as tg:\n            tg.create_task(ok())\n            tg.create_task(bad())\n    except* ValueError as eg:\n        print(\"caught\", eg.exceptions)\n\nasyncio.run(main())\n",
     "q": "bad() fails after 0.1 s while ok() is still sleeping. What prints?",
     "answer": "ok cancelled\ncaught (ValueError('boom'),)",
     "why": "TaskGroup cancels the sibling when one task fails. The `finally` in ok() still runs, then the group raises an ExceptionGroup, which `except*` unpacks."
    },
    {
     "t": "mcq",
     "id": "p3-patterns-m1",
     "q": "Plain `gather(job(0), job(1), job(2))`: job 1 raises. What happens to job 0 and job 2?",
     "o": [
      "They are cancelled at once",
      "They keep running, but you only see the error",
      "They never started",
      "gather waits for them and then returns their results"
     ],
     "a": 1,
     "why": "gather does not cancel its other awaitables when one fails. If you need all-or-nothing, use a TaskGroup."
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
     "t": "predict",
     "id": "p3-peak0-p",
     "code": "import asyncio, time\n\nactive = peak = 0\n\nasync def fetch(i):\n    global active, peak\n    active += 1\n    peak = max(peak, active)\n    await asyncio.sleep(1)\n    active -= 1\n    return i\n\nasync def main():\n    t0 = time.perf_counter()\n    await asyncio.gather(*(fetch(i) for i in range(10)))\n    print(\"peak\", peak, \"seconds\", round(time.perf_counter() - t0))\n\nasyncio.run(main())\n",
     "q": "Ten fetches, each sleeps 1 s, no cap. What prints? (peak = most fetches inside the sleep at once)",
     "answer": "peak 10 seconds 1",
     "why": "All ten start before the first one finishes: peak 10. They sleep side by side, so the total is 1 second."
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
     "t": "predict",
     "id": "p3-peak1-p",
     "code": "import asyncio, time\n\nactive = peak = 0\n\nasync def fetch(i, sem):\n    global active, peak\n    async with sem:\n        active += 1\n        peak = max(peak, active)\n        await asyncio.sleep(1)\n        active -= 1\n    return i\n\nasync def main():\n    sem = asyncio.Semaphore(3)\n    t0 = time.perf_counter()\n    await asyncio.gather(*(fetch(i, sem) for i in range(10)))\n    print(\"peak\", peak, \"seconds\", round(time.perf_counter() - t0))\n\nasyncio.run(main())\n",
     "q": "Same ten fetches, Semaphore(3). What prints? Think in rounds of 3.",
     "answer": "peak 3 seconds 4",
     "why": "Rounds of 3, 3, 3 and 1 are four rounds of 1 s = 4 s. peak never goes above 3."
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
     "t": "p",
     "text": "A bounded Queue with workers gives the same cap and also bounds the waiting line. `put` waits when the queue is full. That wait is backpressure: the producer slows down instead of piling up memory."
    },
    {
     "t": "code",
     "id": "p3-queue",
     "title": "Producer, 2 workers, queue of 2",
     "code": "import asyncio\n\nasync def worker(name, q, done):\n    while True:\n        item = await q.get()\n        await asyncio.sleep(0.1)\n        done.append(item)\n        q.task_done()\n\nasync def main():\n    q, done = asyncio.Queue(maxsize=2), []\n    workers = [asyncio.create_task(worker(n, q, done)) for n in range(2)]\n    for i in range(6):\n        await q.put(i)\n        print(\"put\", i, \"queued\", q.qsize())\n    await q.join()\n    for w in workers:\n        w.cancel()\n    await asyncio.gather(*workers, return_exceptions=True)\n    print(\"done\", sorted(done))\n\nasyncio.run(main())\n",
     "notes": {
      "5": "worker waits for an item",
      "8": "marks one item finished for q.join()",
      "11": "at most 2 items waiting",
      "12": "2 workers: that is the cap on concurrent work",
      "14": "waits here when 2 items are already queued",
      "16": "waits until every item is task_done",
      "18": "the workers loop forever, so cancel them at the end"
     },
     "ask": {
      "q": "Click the line where the producer slows down when the workers fall behind.",
      "lines": [
       14
      ],
      "why": "`await q.put(i)` waits while the queue is full. The producer can not run ahead of the workers by more than the queue size. That is backpressure."
     }
    },
    {
     "t": "predict",
     "id": "p3-queue-p",
     "code": "import asyncio\n\nasync def worker(name, q, done):\n    while True:\n        item = await q.get()\n        await asyncio.sleep(0.1)\n        done.append(item)\n        q.task_done()\n\nasync def main():\n    q, done = asyncio.Queue(maxsize=2), []\n    workers = [asyncio.create_task(worker(n, q, done)) for n in range(2)]\n    for i in range(6):\n        await q.put(i)\n        print(\"put\", i, \"queued\", q.qsize())\n    await q.join()\n    for w in workers:\n        w.cancel()\n    await asyncio.gather(*workers, return_exceptions=True)\n    print(\"done\", sorted(done))\n\nasyncio.run(main())\n",
     "q": "What prints? Notice what the queued count shows and when each put can finish.",
     "answer": "put 0 queued 1\nput 1 queued 2\nput 2 queued 1\nput 3 queued 2\nput 4 queued 1\nput 5 queued 2\ndone [0, 1, 2, 3, 4, 5]",
     "why": "The queue never holds more than 2 (queued is always 1 or 2). From put 2 on, the producer finds the queue full and waits until the workers take items, so it can not run ahead. Every item is processed exactly once."
    },
    {
     "t": "write",
     "id": "p3-cap-w",
     "q": "Ten fetches run at once. Add a cap of 3 so `peak` never goes above 3.",
     "starter": "import asyncio\n\nactive = peak = 0\n\nasync def fetch(i):\n    global active, peak\n    active += 1\n    peak = max(peak, active)\n    await asyncio.sleep(0.2)\n    active -= 1\n    return i * 2\n\nasync def main():\n    results = await asyncio.gather(*(fetch(i) for i in range(10)))\n    print(results)\n    print(\"peak\", peak)\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\nactive = peak = 0\n\nasync def fetch(i, sem):\n    global active, peak\n    async with sem:\n        active += 1\n        peak = max(peak, active)\n        await asyncio.sleep(0.2)\n        active -= 1\n    return i * 2\n\nasync def main():\n    sem = asyncio.Semaphore(3)\n    results = await asyncio.gather(*(fetch(i, sem) for i in range(10)))\n    print(results)\n    print(\"peak\", peak)\n\nasyncio.run(main())\n",
     "hint": "Create one Semaphore(3) in main, pass it to fetch, and wrap the slow part in async with sem.",
     "why": "Create the semaphore once, share it, and wrap only the slow part. Expected last line: peak 3."
    },
    {
     "t": "p",
     "text": "Now open the mock and find it."
    },
    {
     "t": "list",
     "items": [
      "`app/cache/tiered.py` lines 42 and 96: `source_slots` is a Semaphore. What is inside the `async with`? Only the loader call. What is it a cap on? Calls to the source, for all keys of this cache.",
      "`app/services/quotes.py` lines 51 to 58: gather plus a Semaphore in `get_many`. Where is the semaphore created, and what does that mean for two batch requests at the same time?",
      "`app/workers/refresh.py` lines 36 and 41 to 43: a bounded queue and a fixed number of worker tasks. In `submit` (line 48) find what happens when the queue is full."
     ]
    },
    {
     "t": "mcq",
     "id": "p3-cap-m1",
     "q": "In `get_many` (quotes.py 51 to 58) the Semaphore is created inside the function. Two batch requests arrive together. How many quote loads can run from the batch gates?",
     "o": [
      "At most batch_concurrency in total",
      "Up to 2 x batch_concurrency, each call has its own gate",
      "Only one batch at a time",
      "Unbounded"
     ],
     "a": 1,
     "why": "Each call builds its own gate, so that cap is per batch call. The limit on source calls overall is the other semaphore, `source_slots` in tiered.py. Saying this in the review shows you read where each cap lives."
    }
   ]
  },
  {
   "id": "asyncio-order",
   "title": "Ordering: results and per-key locks",
   "blocks": [
    {
     "t": "p",
     "text": "Two kinds of order matter. The order results come back to you, and the order two jobs for the same key run."
    },
    {
     "t": "predict",
     "id": "p3-order1-p",
     "code": "import asyncio\n\nasync def job(name, d):\n    await asyncio.sleep(d)\n    return name\n\nasync def main():\n    spec = [(\"slow\", 0.3), (\"fast\", 0.1), (\"mid\", 0.2)]\n    print(await asyncio.gather(*(job(n, d) for n, d in spec)))\n    done = []\n    for fut in asyncio.as_completed([job(n, d) for n, d in spec]):\n        done.append(await fut)\n    print(done)\n\nasyncio.run(main())\n",
     "q": "Two lists print. What is each?",
     "answer": "['slow', 'fast', 'mid']\n['fast', 'mid', 'slow']",
     "why": "`gather` returns results in the order you passed the jobs, however they finish. `as_completed` hands you results in finish order, so the fast one comes first."
    },
    {
     "t": "p",
     "text": "The second kind: two refreshes for the same key must never run at the same time, and must run in the order they arrived. One `asyncio.Lock` per key does both. asyncio.Lock wakes waiters in the order they arrived (first in, first out)."
    },
    {
     "t": "predict",
     "id": "p3-lock0-p",
     "code": "import asyncio\n\nlogs = {\"a\": [], \"b\": []}\n\nasync def refresh(key, tag):\n    logs[key].append(tag + \" start\")\n    await asyncio.sleep(0.1)\n    logs[key].append(tag + \" end\")\n\nasync def main():\n    await asyncio.gather(refresh(\"a\", \"r1\"), refresh(\"a\", \"r2\"), refresh(\"b\", \"r3\"))\n    print(logs)\n\nasyncio.run(main())\n",
     "q": "No lock yet. Three refreshes, two for key a and one for key b. What is in logs for each key?",
     "answer": "{'a': ['r1 start', 'r2 start', 'r1 end', 'r2 end'], 'b': ['r3 start', 'r3 end']}",
     "why": "Both refreshes of a start before either ends: r1 start, r2 start, r1 end, r2 end. They overlap. The refresh for b has nothing to do with a, so no lock should connect them."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Same key, with and without a lock",
       "lanes": [
        [
         "no lock: r1",
         [
          [
           "start",
           "hot",
           "1"
          ],
          [
           "waits: sleep",
           "gap",
           "3"
          ],
          [
           "end",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "no lock: r2",
         [
          [
           "start",
           "hot",
           "1"
          ],
          [
           "waits: sleep",
           "gap",
           "3"
          ],
          [
           "end",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "lock: r1",
         [
          [
           "start",
           "hot",
           "1"
          ],
          [
           "waits: sleep",
           "gap",
           "3"
          ],
          [
           "end",
           "done",
           "1"
          ]
         ]
        ],
        [
         "lock: r2",
         [
          [
           "waits for the lock",
           "gap",
           "5"
          ],
          [
           "start",
           "hot",
           "1"
          ],
          [
           "waits: sleep",
           "gap",
           "3"
          ],
          [
           "end",
           "done",
           "1"
          ]
         ]
        ]
       ],
       "note": "With the lock the second refresh starts only after the first one ends."
      }
     ]
    },
    {
     "t": "write",
     "id": "p3-lock-w",
     "q": "Two refreshes for key a overlap. Make refreshes for the same key run one after the other, in the order they were started, while key b stays independent.",
     "starter": "import asyncio\n\nlogs = {\"a\": [], \"b\": []}\n\nasync def refresh(key, tag):\n    logs[key].append(tag + \" start\")\n    await asyncio.sleep(0.1)\n    logs[key].append(tag + \" end\")\n\nasync def main():\n    await asyncio.gather(refresh(\"a\", \"r1\"), refresh(\"a\", \"r2\"), refresh(\"b\", \"r3\"))\n    print(logs)\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\nlogs = {\"a\": [], \"b\": []}\nlocks = {}\n\nasync def refresh(key, tag):\n    lock = locks.setdefault(key, asyncio.Lock())\n    async with lock:\n        logs[key].append(tag + \" start\")\n        await asyncio.sleep(0.1)\n        logs[key].append(tag + \" end\")\n\nasync def main():\n    await asyncio.gather(refresh(\"a\", \"r1\"), refresh(\"a\", \"r2\"), refresh(\"b\", \"r3\"))\n    print(logs)\n\nasyncio.run(main())\n",
     "hint": "Keep a dict of key to asyncio.Lock. Use setdefault to get the key's lock, then put the body in async with lock.",
     "why": "The lock is per key, so a and b do not wait for each other. Expected: a gets r1 start, r1 end, r2 start, r2 end. A real version also needs to delete idle locks, or the dict grows with every key."
    },
    {
     "t": "p",
     "text": "Now open the mock and find it: `app/workers/refresh.py` line 72, `async with state.lock:`. The comment above it says what it guarantees. Line 73 skips a job whose sequence number is older than one already applied. Lines 80 to 82 delete the key's state when nothing is pending, which is the cleanup the write box above leaves out."
    },
    {
     "t": "mcq",
     "id": "p3-order-m1",
     "q": "You need results in the order the user asked, and you want to show each one as soon as it is ready. Which is right?",
     "o": [
      "gather, then show",
      "as_completed, and keep the index with each result",
      "a Lock around each job",
      "Semaphore(1)"
     ],
     "a": 1,
     "why": "as_completed gives finish order, so tag each job with its position and place the result where it belongs. gather gives input order but only at the very end."
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
     "t": "predict",
     "id": "p3-race-p",
     "code": "import asyncio\n\ncache = {}\nloads = 0\n\nasync def load(key):\n    global loads\n    loads += 1\n    await asyncio.sleep(0.1)\n    return key.upper()\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    value = await load(key)\n    cache[key] = value\n    return value\n\nasync def main():\n    await asyncio.gather(get(\"a\"), get(\"a\"), get(\"a\"))\n    print(\"loads\", loads)\n\nasyncio.run(main())\n",
     "q": "Three callers ask for key a at the same moment. How many loads?",
     "answer": "loads 3",
     "why": "All three checks happen before the first load finishes. Three misses, three loads. With 1000 callers that is a stampede on the source."
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
     "t": "code",
     "id": "p3-sf",
     "title": "Single-flight with an in-flight dict",
     "code": "import asyncio\n\ncache, inflight = {}, {}\nloads = 0\n\nasync def load(key):\n    global loads\n    loads += 1\n    await asyncio.sleep(0.1)\n    return key.upper()\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    task = inflight.get(key)\n    if task is None:\n        task = asyncio.create_task(load(key))\n        inflight[key] = task\n        task.add_done_callback(lambda _: inflight.pop(key, None))\n    value = await task\n    cache[key] = value\n    return value\n\nasync def main():\n    await asyncio.gather(get(\"a\"), get(\"a\"), get(\"a\"))\n    print(\"loads\", loads, \"inflight\", len(inflight))\n\nasyncio.run(main())\n",
     "notes": {
      "15": "is a load for this key already running?",
      "17": "start it once",
      "18": "store it before the next await: from here on callers join it",
      "19": "remove the entry when it finishes, success or failure",
      "20": "every caller waits on the same task"
     },
     "ask": {
      "q": "Click the line that makes the other callers join instead of starting their own load.",
      "lines": [
       18
      ],
      "why": "The task is stored in `inflight` straight after it is created, with no await in between. A caller that arrives later finds it with `inflight.get(key)` and awaits it. This is the whole trick."
     }
    },
    {
     "t": "predict",
     "id": "p3-sf-p",
     "code": "import asyncio\n\ncache, inflight = {}, {}\nloads = 0\n\nasync def load(key):\n    global loads\n    loads += 1\n    await asyncio.sleep(0.1)\n    return key.upper()\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    task = inflight.get(key)\n    if task is None:\n        task = asyncio.create_task(load(key))\n        inflight[key] = task\n        task.add_done_callback(lambda _: inflight.pop(key, None))\n    value = await task\n    cache[key] = value\n    return value\n\nasync def main():\n    await asyncio.gather(get(\"a\"), get(\"a\"), get(\"a\"))\n    print(\"loads\", loads, \"inflight\", len(inflight))\n\nasyncio.run(main())\n",
     "q": "Same three callers. What prints?",
     "answer": "loads 1 inflight 0",
     "why": "One load, three callers, and the in-flight dict is empty again at the end because the done callback removed the entry."
    },
    {
     "t": "p",
     "text": "Why store the task and not the coroutine? A coroutine can be awaited once. A task can be awaited by any number of callers."
    },
    {
     "t": "predict",
     "id": "p3-reuse-p",
     "code": "import asyncio\n\nasync def f():\n    return 1\n\nasync def main():\n    c = f()\n    print(await c)\n    try:\n        print(await c)\n    except RuntimeError as e:\n        print(\"error:\", e)\n\nasyncio.run(main())\n",
     "q": "The same coroutine object is awaited twice. What prints?",
     "answer": "1\nerror: cannot reuse already awaited coroutine",
     "why": "The second await fails with RuntimeError: cannot reuse already awaited coroutine. A Task (or a Future) remembers its result, so many callers can wait on it."
    },
    {
     "t": "write",
     "id": "p3-stamp-w",
     "q": "Twenty callers ask for key k together and the source is hit twenty times. Make it load once.",
     "starter": "import asyncio\n\ncache = {}\nloads = 0\n\nasync def load(key):\n    global loads\n    loads += 1\n    await asyncio.sleep(0.1)\n    return key.upper()\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    value = await load(key)\n    cache[key] = value\n    return value\n\nasync def main():\n    results = await asyncio.gather(*(get(\"k\") for _ in range(20)))\n    print(set(results), \"loads\", loads)\n\nasyncio.run(main())\n",
     "solution": "import asyncio\n\ncache, inflight = {}, {}\nloads = 0\n\nasync def load(key):\n    global loads\n    loads += 1\n    await asyncio.sleep(0.1)\n    return key.upper()\n\nasync def get(key):\n    if key in cache:\n        return cache[key]\n    task = inflight.get(key)\n    if task is None:\n        task = asyncio.create_task(load(key))\n        inflight[key] = task\n        task.add_done_callback(lambda _: inflight.pop(key, None))\n    value = await task\n    cache[key] = value\n    return value\n\nasync def main():\n    results = await asyncio.gather(*(get(\"k\") for _ in range(20)))\n    print(set(results), \"loads\", loads)\n\nasyncio.run(main())\n",
     "hint": "Store asyncio.create_task(load(key)) in an inflight dict before the first await, and have everyone await it.",
     "why": "Expected last line: {'K'} loads 1. Also remove the entry when the task is done, or a failure would sit in the dict forever (next part)."
    },
    {
     "t": "p",
     "text": "Now open the mock and find it: `app/cache/singleflight.py`. Line 20 is the in-flight dict. Line 25 is the check, line 31 creates a Future, line 32 stores it before any await. Line 48, in a `finally`, deletes the entry whatever happened. Line 29 is the shield; that comes next part."
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
     "t": "predict",
     "id": "p3-block-p",
     "code": "import asyncio, time\n\nticks = 0\n\nasync def ticker():\n    global ticks\n    while True:\n        await asyncio.sleep(0.05)\n        ticks += 1\n\nasync def main():\n    t = asyncio.create_task(ticker())\n    await asyncio.sleep(0)\n    time.sleep(0.5)\n    print(\"ticker ran during time.sleep:\", ticks > 0)\n    await asyncio.sleep(0.5)\n    print(\"ticker ran during asyncio.sleep:\", ticks > 0)\n    t.cancel()\n\nasyncio.run(main())\n",
     "q": "What do the two lines say?",
     "answer": "ticker ran during time.sleep: False\nticker ran during asyncio.sleep: True",
     "why": "During the blocking sleep the ticker had no turn, so it was still at its first sleep (False). During the friendly sleep it ran about ten times (True)."
    },
    {
     "t": "p",
     "text": "The fix for a blocking call you can not rewrite is `asyncio.to_thread(func, *args)`. It runs the function in a worker thread and lets you await it, so the loop stays free. It helps with waiting (network, disk, sleep). It does not make CPU work faster, because of the GIL; for CPU work use a process pool (next part)."
    },
    {
     "t": "predict",
     "id": "p3-thread-p",
     "code": "import asyncio, time\n\nticks = 0\n\nasync def ticker():\n    global ticks\n    while True:\n        await asyncio.sleep(0.05)\n        ticks += 1\n\nasync def main():\n    t = asyncio.create_task(ticker())\n    await asyncio.to_thread(time.sleep, 0.5)\n    print(\"ticker ran during to_thread:\", ticks > 0)\n    t.cancel()\n\nasyncio.run(main())\n",
     "q": "The sleep is moved into a thread. What prints?",
     "answer": "ticker ran during to_thread: True",
     "why": "The loop awaits a thread, so the ticker keeps running and its count goes up."
    },
    {
     "t": "write",
     "id": "p3-to-w",
     "q": "slow_square blocks the loop. Run the three calls in threads at the same time so the ticker keeps running, and the whole thing takes about 0.3 s instead of 0.9 s.",
     "starter": "import asyncio, time\n\nticks = 0\n\ndef slow_square(n):\n    time.sleep(0.3)\n    return n * n\n\nasync def ticker():\n    global ticks\n    while True:\n        await asyncio.sleep(0.05)\n        ticks += 1\n\nasync def main():\n    t = asyncio.create_task(ticker())\n    start = time.perf_counter()\n    results = [slow_square(n) for n in range(3)]\n    print(results, \"ticks > 0:\", ticks > 0, \"seconds\", round(time.perf_counter() - start, 1))\n    t.cancel()\n\nasyncio.run(main())\n",
     "solution": "import asyncio, time\n\nticks = 0\n\ndef slow_square(n):\n    time.sleep(0.3)\n    return n * n\n\nasync def ticker():\n    global ticks\n    while True:\n        await asyncio.sleep(0.05)\n        ticks += 1\n\nasync def main():\n    t = asyncio.create_task(ticker())\n    start = time.perf_counter()\n    results = await asyncio.gather(*(asyncio.to_thread(slow_square, n) for n in range(3)))\n    print(results, \"ticks > 0:\", ticks > 0, \"seconds\", round(time.perf_counter() - start, 1))\n    t.cancel()\n\nasyncio.run(main())\n",
     "hint": "asyncio.to_thread(slow_square, n) gives an awaitable. Gather three of them.",
     "why": "Expected: [0, 1, 4] ticks > 0: True seconds 0.3. The starter shows False and 0.9: the three sleeps ran one after the other on the loop's thread."
    },
    {
     "t": "p",
     "text": "Last, open the mock and find it. `app/clients/pricing.py` awaits the transport at line 82 under a timeout, and nothing in mock2 blocks the loop. In `mock1_review/app.py` look at how work is handed to a `ThreadPoolExecutor` in `serve()`: that is the same idea as `to_thread`, written by hand."
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
