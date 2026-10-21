/* Mercor coding tab, part 2: Threads. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "threads",
 "n": 2,
 "title": "Threads",
 "minutes": 60,
 "lead": "After this part you can find where a thread starts, where it waits, where work is capped and where order is kept, and you can say what is wrong with a threaded cache and fix it.",
 "sections": [
  {
   "id": "threads-what",
   "title": "What a thread is, and the GIL in plain words",
   "blocks": [
    {
     "t": "p",
     "text": "A thread is a second line of execution inside the same program. Threads share memory: they see the same dicts, lists and objects. That sharing is what makes them useful, and it is the source of every bug in this part."
    },
    {
     "t": "p",
     "text": "CPython has a lock called the GIL. Only one thread runs Python bytecode at a time, and the interpreter switches between them. When a thread waits on the network, a file or `time.sleep`, it lets go of the GIL, so other threads run during the wait."
    },
    {
     "t": "list",
     "items": [
      "Waiting work (I/O-bound): threads help. 100 API calls that each wait on the network overlap their waiting.",
      "Computing work (CPU-bound): threads do not help. Two threads crunching numbers take turns on one core. Use processes for that.",
      "Shared memory still bites: the interpreter can switch threads between two lines of your code. That is where races come from (section 3)."
     ]
    },
    {
     "t": "code",
     "id": "threads-what-sleep",
     "title": "Three waits, three threads",
     "code": "import threading, time\n\ndef fetch(i, out):\n    time.sleep(0.3)\n    out.append(i)\n\nout = []\nstart = time.perf_counter()\nthreads = [threading.Thread(target=fetch, args=(i, out)) for i in range(3)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(sorted(out), round(time.perf_counter() - start, 1))",
     "notes": {
      "4": "Waiting. The GIL is released here, so the other threads run.",
      "9": "Builds a thread. Nothing runs yet.",
      "11": "The thread begins running now.",
      "13": "Main waits here until that thread has finished."
     },
     "ask": {
      "q": "Click the line where the three waits overlap in time instead of adding up.",
      "lines": [
       11
      ],
      "why": "start() is the moment each thread begins its 0.3 s wait. All three starts happen within microseconds, so the waits run side by side: total 0.3 s, not 0.9 s."
     }
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Waiting work: three threads overlap",
       "lanes": [
        [
         "Thread 0",
         [
          [
           "waits on I/O (GIL released)",
           "plain",
           "6"
          ],
          [
           "done",
           "done",
           "1"
          ]
         ]
        ],
        [
         "Thread 1",
         [
          [
           "waits on I/O (GIL released)",
           "plain",
           "6"
          ],
          [
           "done",
           "done",
           "1"
          ]
         ]
        ],
        [
         "Thread 2",
         [
          [
           "waits on I/O (GIL released)",
           "plain",
           "6"
          ],
          [
           "done",
           "done",
           "1"
          ]
         ]
        ]
       ],
       "note": "Total time is the longest wait, not the sum."
      },
      {
       "title": "Computing work: the GIL makes the threads take turns",
       "lanes": [
        [
         "Thread A",
         [
          [
           "runs",
           "hot",
           "2"
          ],
          [
           "paused",
           "gap",
           "2"
          ],
          [
           "runs",
           "hot",
           "2"
          ],
          [
           "paused",
           "gap",
           "2"
          ]
         ]
        ],
        [
         "Thread B",
         [
          [
           "paused",
           "gap",
           "2"
          ],
          [
           "runs",
           "hot",
           "2"
          ],
          [
           "paused",
           "gap",
           "2"
          ],
          [
           "runs",
           "hot",
           "2"
          ]
         ]
        ]
       ],
       "note": "Same total time as running A then B. Threads add nothing for number crunching."
      }
     ]
    },
    {
     "t": "predict",
     "id": "threads-what-p",
     "code": "import threading, time\n\ndef fetch(i, out):\n    time.sleep(0.3)\n    out.append(i)\n\nout = []\nstart = time.perf_counter()\nthreads = [threading.Thread(target=fetch, args=(i, out)) for i in range(3)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(sorted(out), round(time.perf_counter() - start, 1))",
     "q": "Three threads each wait 0.3 s. What does this print? (The second number is seconds, rounded to one decimal.)",
     "answer": "[0, 1, 2] 0.3",
     "why": "The waits overlap, so the elapsed time is the longest single wait: 0.3. Run one after another it would be 0.9."
    },
    {
     "t": "mcq",
     "id": "threads-what-mcq",
     "q": "You must resize 500 images, which is pure number crunching in Python. What helps most?",
     "o": [
      "A thread pool with 50 threads",
      "A process pool",
      "More sleep calls",
      "A bigger Semaphore"
     ],
     "a": 1,
     "why": "Threads take turns on the GIL for CPU work, so they do not speed it up. Separate processes each have their own interpreter and their own GIL."
    }
   ]
  },
  {
   "id": "threads-start",
   "title": "Starting and waiting: where each one happens",
   "blocks": [
    {
     "t": "p",
     "text": "Two questions decide how you read any threaded code: where does the work start, and where does the caller wait for it? They are almost never the same line. This is the skill you were missing in the Commure screen."
    },
    {
     "t": "code",
     "id": "threads-start-thread",
     "title": "Thread: start() begins, join() waits",
     "code": "import threading, time\n\ndef work():\n    time.sleep(0.1)\n    print(\"W: worker finishes\")\n\nt = threading.Thread(target=work)\nprint(\"A: before start\")\nt.start()\nprint(\"B: after start\")\nt.join()\nprint(\"C: after join\")",
     "notes": {
      "7": "Builds the thread. It is not running yet.",
      "9": "The worker starts running now, at the same time as the main thread.",
      "11": "Main stops here until the worker is done."
     },
     "ask": {
      "q": "Click the line where the worker thread starts running.",
      "lines": [
       9
      ],
      "why": "Constructing a Thread does nothing. start() is the moment it begins. join() is a different line: it is where main waits."
     }
    },
    {
     "t": "predict",
     "id": "threads-start-p1",
     "code": "import threading, time\n\ndef work():\n    time.sleep(0.1)\n    print(\"W: worker finishes\")\n\nt = threading.Thread(target=work)\nprint(\"A: before start\")\nt.start()\nprint(\"B: after start\")\nt.join()\nprint(\"C: after join\")",
     "q": "What is the exact order of the four prints?",
     "answer": "A: before start\nB: after start\nW: worker finishes\nC: after join",
     "why": "A, then start, then B immediately (main does not wait), then the worker finishes after 0.1 s (W), and C prints only after join returned."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Main thread and worker",
       "lanes": [
        [
         "Main",
         [
          [
           "A",
           "plain",
           "1"
          ],
          [
           "start()",
           "hot",
           "1"
          ],
          [
           "B",
           "plain",
           "1"
          ],
          [
           "join(): waiting",
           "gap",
           "4"
          ],
          [
           "C",
           "done",
           "1"
          ]
         ]
        ],
        [
         "Worker",
         [
          [
           "",
           "gap",
           "2"
          ],
          [
           "sleep, then W",
           "hot",
           "4"
          ],
          [
           "",
           "gap",
           "1"
          ]
         ]
        ]
       ],
       "note": "start() and join() are two different moments. The worker runs between them."
      }
     ]
    },
    {
     "t": "p",
     "text": "A pool is the same idea with less typing. `submit` starts (or queues) the work and returns a `Future` right away. `.result()` is where you wait, and it re-raises any error the work raised."
    },
    {
     "t": "code",
     "id": "threads-start-pool",
     "title": "ThreadPoolExecutor: submit starts, result() waits",
     "code": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef slow_square(n):\n    time.sleep(0.2)\n    return n * n\n\nwith ThreadPoolExecutor(max_workers=3) as pool:\n    futures = [pool.submit(slow_square, n) for n in range(3)]\n    print(\"submitted\")\n    results = [f.result() for f in futures]\nprint(results)",
     "notes": {
      "8": "Makes up to 3 worker threads. Leaving the with block waits for all submitted work.",
      "9": "Hands the call to a worker and returns a Future at once.",
      "10": "Prints while the workers are still sleeping.",
      "11": "Blocks until that Future is finished, then gives the value (or raises its error)."
     },
     "ask": {
      "q": "Click the line where the main thread waits for the work to finish.",
      "lines": [
       11
      ],
      "why": "submit() never waits. The wait is the .result() call. If you want the work to overlap, all submits must happen before the first .result()."
     }
    },
    {
     "t": "code",
     "id": "threads-start-serve",
     "title": "The mock1 serve(): find both moments",
     "code": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef handler(n):\n    time.sleep(0.1)\n    return n * 10\n\ndef serve(requests, workers=2):\n    with ThreadPoolExecutor(max_workers=workers) as pool:\n        futures = [pool.submit(handler, n) for n in requests]\n        return [f.result() for f in futures]\n\nstart = time.perf_counter()\nprint(serve([1, 2, 3, 4]), round(time.perf_counter() - start, 1))",
     "notes": {
      "10": "In mock1_review/app.py this is the `pool.submit(getattr(self, name), *args)` line.",
      "11": "The caller collects in submission order, so the output order is fixed."
     },
     "ask": {
      "q": "Click the line where the handlers start running.",
      "lines": [
       10
      ],
      "why": "Same as app.py's serve(): the list comprehension of submits is where work begins. With 4 requests and 2 workers the total is 0.2 s, two waves of 0.1 s."
     }
    },
    {
     "t": "predict",
     "id": "threads-start-serial",
     "code": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef slow_square(n):\n    time.sleep(0.2)\n    return n * n\n\nstart = time.perf_counter()\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    results = [pool.submit(slow_square, n).result() for n in range(4)]\nprint(results, round(time.perf_counter() - start, 1))",
     "q": "Four tasks of 0.2 s, four workers. What does this print? Look closely at where .result() sits.",
     "answer": "[0, 1, 4, 9] 0.8",
     "why": "Each loop turn submits one task and immediately waits for it, so the next submit does not happen until the previous task is done. The pool is idle: 4 x 0.2 = 0.8. The pool size does not matter here."
    },
    {
     "t": "write",
     "id": "threads-start-w",
     "q": "The pool has 4 workers but the run takes 0.8 s. Change the code so the four tasks overlap (about 0.2 s).",
     "starter": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef slow_square(n):\n    time.sleep(0.2)\n    return n * n\n\nstart = time.perf_counter()\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    results = [pool.submit(slow_square, n).result() for n in range(4)]\nprint(results, round(time.perf_counter() - start, 1))   # want 0.2, not 0.8",
     "solution": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef slow_square(n):\n    time.sleep(0.2)\n    return n * n\n\nstart = time.perf_counter()\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    futures = [pool.submit(slow_square, n) for n in range(4)]\n    results = [f.result() for f in futures]\nprint(results, round(time.perf_counter() - start, 1))   # want 0.2, not 0.8",
     "hint": "Submit all four first into a list, then call .result() on each in a second loop.",
     "why": "Rule: never call result() in the same expression as submit(). Submit first, collect after. It is the most common reason 'we added threads and nothing got faster'."
    },
    {
     "t": "predict",
     "id": "threads-start-p2",
     "code": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef job():\n    time.sleep(0.1)\n    print(\"job ran\")\n    return 1\n\nwith ThreadPoolExecutor(max_workers=1) as pool:\n    fut = pool.submit(job)\n    print(\"submitted\")\n    print(\"result\", fut.result())\nprint(\"after with\")",
     "q": "What is the exact order of the prints? Note where 'after with' sits.",
     "answer": "submitted\njob ran\nresult 1\nafter with",
     "why": "submitted prints first, because submit does not wait. job ran comes 0.1 s later from the worker. Then result 1. Finally after with, once the with block exited."
    },
    {
     "t": "mcq",
     "id": "threads-start-mcq",
     "q": "You submit 10 jobs inside `with ThreadPoolExecutor(...) as pool:` and never call result(). What happens at the end of the with block?",
     "o": [
      "Python waits for all 10 jobs to finish",
      "The jobs are cancelled",
      "The jobs keep running in the background after the program continues",
      "Python raises an error because no result was read"
     ],
     "a": 0,
     "why": "Leaving the with block calls shutdown(wait=True). It waits for all pending jobs, but errors inside them are silent unless you read a Future."
    }
   ]
  },
  {
   "id": "threads-race",
   "title": "Race conditions: the cache bug in mock1",
   "blocks": [
    {
     "t": "p",
     "text": "A race condition is a bug where the result depends on how two threads interleave. The interpreter can switch threads between any two lines. If a thread reads something, then another thread changes it, then the first thread writes based on the old read, an update is lost."
    },
    {
     "t": "p",
     "text": "`counter += 1` looks like one step. It is three: read the value, add one, write it back. The sample below spreads those steps out with a short sleep so the problem shows up every time instead of once in a million runs."
    },
    {
     "t": "code",
     "id": "threads-race-counter",
     "title": "Read, pause, write",
     "code": "import threading, time\n\ncounter = 0\n\ndef bump():\n    global counter\n    tmp = counter          # read\n    time.sleep(0.01)       # another thread runs here\n    counter = tmp + 1      # write\n\nthreads = [threading.Thread(target=bump) for _ in range(10)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(counter)",
     "notes": {
      "7": "Step 1: read. Every thread reads 0 before any of them has written.",
      "8": "The pause stands for 'the interpreter switches to another thread here'.",
      "9": "Step 3: write a result based on the old read. This overwrites the others."
     },
     "ask": {
      "q": "Click the line where a lost update happens.",
      "lines": [
       9
      ],
      "why": "The write uses tmp, a stale value. Ten threads each write 1, so nine increments vanish."
     }
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Two threads, one lost update",
       "lanes": [
        [
         "Thread 1",
         [
          [
           "read 0",
           "plain",
           "1"
          ],
          [
           "add: 1",
           "plain",
           "1"
          ],
          [
           "write 1",
           "done",
           "1"
          ],
          [
           "",
           "gap",
           "1"
          ]
         ]
        ],
        [
         "Thread 2",
         [
          [
           "",
           "gap",
           "1"
          ],
          [
           "read 0",
           "hot",
           "1"
          ],
          [
           "add: 1",
           "plain",
           "1"
          ],
          [
           "write 1",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "Thread 2 read 0 after thread 1 had read but before it wrote. Both write 1. Two increments, final value 1."
      }
     ]
    },
    {
     "t": "predict",
     "id": "threads-race-p1",
     "code": "import threading, time\n\ncounter = 0\n\ndef bump():\n    global counter\n    tmp = counter          # read\n    time.sleep(0.01)       # another thread runs here\n    counter = tmp + 1      # write\n\nthreads = [threading.Thread(target=bump) for _ in range(10)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(counter)",
     "q": "Ten threads each add 1 to a counter that starts at 0. What does it print? (The point: it is not what you would hope.)",
     "answer": "1",
     "why": "Nearly always 1. All ten threads read 0 inside the 10 ms window, and each writes 1. Without the sleep the same bug exists but shows up rarely, which is worse: it passes tests and fails in production."
    },
    {
     "t": "p",
     "text": "Now the same shape in a cache. This is `ProfileCache` from `mock1_review/cache.py` (lines 6 to 23): look in the dict, if missing call the loader, then store. The gap between the look and the store is the race window."
    },
    {
     "t": "code",
     "id": "threads-race-cache",
     "title": "Check, then act: the mock1 ProfileCache",
     "code": "import threading, time\n\nclass ProfileCache:\n    def __init__(self):\n        self._data = {}\n\n    def get_or_load(self, key, loader):\n        if key in self._data:\n            return self._data[key]\n        value = loader()\n        self._data[key] = value\n        return value\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return {\"name\": \"ada\"}\n\ncache = ProfileCache()\nthreads = [threading.Thread(target=cache.get_or_load, args=(\"u1\", loader)) for _ in range(5)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(\"loader calls:\", len(calls))",
     "notes": {
      "8": "The check. Five threads all see 'not there'.",
      "10": "The slow call. This is what keeps the window open (a database call).",
      "11": "The act. Five threads each store their own copy; the last one wins."
     },
     "ask": {
      "q": "Click the two lines that make up the check-then-act race.",
      "lines": [
       8,
       11
      ],
      "why": "The decision (miss) is made at the check, and acted on at the store, with a slow call in between. Anything that happens to the dict in that window makes the decision stale."
     }
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Five requests for the same key, empty cache",
       "lanes": [
        [
         "Thread 1",
         [
          [
           "check: miss",
           "plain",
           "1"
          ],
          [
           "loader() 0.1 s",
           "hot",
           "5"
          ],
          [
           "store",
           "plain",
           "1"
          ]
         ]
        ],
        [
         "Thread 2",
         [
          [
           "check: miss",
           "plain",
           "1"
          ],
          [
           "loader() 0.1 s",
           "hot",
           "5"
          ],
          [
           "store",
           "plain",
           "1"
          ]
         ]
        ],
        [
         "Thread 3",
         [
          [
           "check: miss",
           "plain",
           "1"
          ],
          [
           "loader() 0.1 s",
           "hot",
           "5"
          ],
          [
           "store",
           "plain",
           "1"
          ]
         ]
        ]
       ],
       "note": "Three database calls for one key. At 50 threads that is a cache stampede, on a cache that exists to prevent it."
      }
     ]
    },
    {
     "t": "predict",
     "id": "threads-race-p2",
     "code": "import threading, time\n\nclass ProfileCache:\n    def __init__(self):\n        self._data = {}\n\n    def get_or_load(self, key, loader):\n        if key in self._data:\n            return self._data[key]\n        value = loader()\n        self._data[key] = value\n        return value\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return {\"name\": \"ada\"}\n\ncache = ProfileCache()\nthreads = [threading.Thread(target=cache.get_or_load, args=(\"u1\", loader)) for _ in range(5)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(\"loader calls:\", len(calls))",
     "q": "Five threads ask for the same key on an empty cache. How many times does the loader run?",
     "answer": "loader calls: 5",
     "why": "5. All five check before the first store happens, so all five load. The cache works for later calls but gave no protection during the first 0.1 s."
    },
    {
     "t": "p",
     "text": "There is a second bug in the same file, in `app.py`. `profile_page` does `profile[\"views\"] = profile.get(\"views\", 0) + 1` on the dict that lives inside the cache. That is a read-modify-write on shared data, like the counter, and it also mutates the cached object for every other caller. In the review, say both."
    },
    {
     "t": "mcq",
     "id": "threads-race-mcq",
     "q": "Two threads call get_or_load('u1', loader) at the same moment on an empty ProfileCache. What can happen?",
     "o": [
      "The dict is corrupted and Python crashes",
      "The second thread gets a KeyError",
      "Both run the loader and both store; the second store overwrites the first",
      "The second thread sees a half-built value"
     ],
     "a": 2,
     "why": "In CPython a single dict read or write does not corrupt the dict. The bug is logical: two threads decide independently, so the work is duplicated and one result is thrown away."
    }
   ]
  },
  {
   "id": "threads-locks",
   "title": "Locks: what to hold them around",
   "blocks": [
    {
     "t": "p",
     "text": "A `threading.Lock` lets one thread at a time into a block. Other threads that reach `with lock:` wait at the door. Use it around the smallest piece of code that must not be interleaved: the read-modify-write, the check-then-act."
    },
    {
     "t": "code",
     "id": "threads-locks-counter",
     "title": "The counter, now with a lock",
     "code": "import threading, time\n\ncounter = 0\nlock = threading.Lock()\n\ndef bump():\n    global counter\n    with lock:\n        tmp = counter\n        time.sleep(0.01)\n        counter = tmp + 1\n\nthreads = [threading.Thread(target=bump) for _ in range(10)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(counter)",
     "notes": {
      "4": "One lock, shared by every thread that touches counter.",
      "8": "Take turns. Released automatically at the end, even if the body raises.",
      "11": "Safe now: nobody else read or wrote counter since our read."
     },
     "ask": {
      "q": "Click the line that makes the threads take turns.",
      "lines": [
       8
      ],
      "why": "Everything inside the with is one indivisible step as far as the other threads are concerned. The read and the write are both inside it, which is the point."
     }
    },
    {
     "t": "predict",
     "id": "threads-locks-p1",
     "code": "import threading, time\n\ncounter = 0\nlock = threading.Lock()\n\ndef bump():\n    global counter\n    with lock:\n        tmp = counter\n        time.sleep(0.01)\n        counter = tmp + 1\n\nthreads = [threading.Thread(target=bump) for _ in range(10)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(counter)",
     "q": "Same sample as before the race section, with the lock. What does it print?",
     "answer": "10",
     "why": "10. Each thread waits for the lock, reads the latest value, writes, and releases. It takes about 0.1 s because the threads go one by one."
    },
    {
     "t": "p",
     "text": "The lock costs time: threads wait. So the rule has two halves. Hold it around the check-then-act. Never hold it around slow work that other threads do not need to wait for."
    },
    {
     "t": "code",
     "id": "threads-locks-price",
     "title": "mock1 PriceCache: the lock covers the slow call",
     "code": "import threading, time\n\nclass PriceCache:\n    def __init__(self, ttl=60):\n        self.ttl = ttl\n        self._data = {}\n        self._lock = threading.Lock()\n\n    def get_or_load(self, key, loader):\n        with self._lock:\n            entry = self._data.get(key)\n            if entry and time.time() - entry[1] < self.ttl:\n                return entry[0]\n            value = loader()\n            self._data[key] = (value, time.time())\n            return value\n\ndef loader():\n    time.sleep(0.1)\n    return 9.99\n\ncache = PriceCache()\nstart = time.perf_counter()\nthreads = [threading.Thread(target=cache.get_or_load, args=(sku, loader)) for sku in (\"a\", \"b\", \"c\")]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(round(time.perf_counter() - start, 1))",
     "notes": {
      "10": "One lock for the whole cache, all keys.",
      "14": "The slow call happens while the lock is held."
     },
     "ask": {
      "q": "Click the line that is wrong to run while holding the lock.",
      "lines": [
       14
      ],
      "why": "Three different keys, three 0.1 s loads, one lock: they run one after another. Every key waits behind every other key's database call. This is the PriceCache bug in mock1_review/cache.py (line 39)."
     }
    },
    {
     "t": "predict",
     "id": "threads-locks-p2",
     "code": "import threading, time\n\nclass PriceCache:\n    def __init__(self, ttl=60):\n        self.ttl = ttl\n        self._data = {}\n        self._lock = threading.Lock()\n\n    def get_or_load(self, key, loader):\n        with self._lock:\n            entry = self._data.get(key)\n            if entry and time.time() - entry[1] < self.ttl:\n                return entry[0]\n            value = loader()\n            self._data[key] = (value, time.time())\n            return value\n\ndef loader():\n    time.sleep(0.1)\n    return 9.99\n\ncache = PriceCache()\nstart = time.perf_counter()\nthreads = [threading.Thread(target=cache.get_or_load, args=(sku, loader)) for sku in (\"a\", \"b\", \"c\")]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(round(time.perf_counter() - start, 1))",
     "q": "Three threads ask for three different skus at the same time. Each load takes 0.1 s. How long does it take?",
     "answer": "0.3",
     "why": "0.3. The loads cannot overlap because the lock is held across loader(). Without the lock-across-slow-call it would be about 0.1."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "PriceCache: three different keys, one lock",
       "lanes": [
        [
         "Thread a",
         [
          [
           "holds lock: loader() a",
           "hot",
           "4"
          ],
          [
           "",
           "gap",
           "8"
          ]
         ]
        ],
        [
         "Thread b",
         [
          [
           "waits for lock",
           "gap",
           "4"
          ],
          [
           "holds lock: loader() b",
           "hot",
           "4"
          ],
          [
           "",
           "gap",
           "4"
          ]
         ]
        ],
        [
         "Thread c",
         [
          [
           "waits for lock",
           "gap",
           "8"
          ],
          [
           "holds lock: loader() c",
           "hot",
           "4"
          ]
         ]
        ]
       ],
       "note": "Total 0.3 s for work that could have overlapped to 0.1 s. Worse, a cache hit for key 'a' also waits for the lock while b is loading."
      }
     ]
    },
    {
     "t": "p",
     "text": "The fix is not to remove the lock: that brings back the check-then-act race. You need the lock only to decide 'who loads this key', and the load runs outside it. That is single-flight, in section 7."
    },
    {
     "t": "p",
     "text": "Deadlock is the other lock bug. Thread 1 holds A and wants B; thread 2 holds B and wants A. Both wait forever. The cure is one rule: every thread takes locks in the same order. The sample below uses a timeout so it ends and you can see the shape."
    },
    {
     "t": "code",
     "id": "threads-locks-dead",
     "title": "Two locks, opposite order",
     "code": "import threading, time\n\na, b = threading.Lock(), threading.Lock()\nresults = []\n\ndef worker(name, first, second, patience):\n    with first:\n        time.sleep(0.1)                      # both threads now hold one lock\n        if second.acquire(timeout=patience):\n            second.release()\n            results.append(name + \" got both\")\n        else:\n            results.append(name + \" gave up\")\n\nt1 = threading.Thread(target=worker, args=(\"t1\", a, b, 0.2))\nt2 = threading.Thread(target=worker, args=(\"t2\", b, a, 0.6))\nt1.start()\nt2.start()\nt1.join()\nt2.join()\nprint(sorted(results))",
     "notes": {
      "7": "Each thread takes its own first lock.",
      "9": "Waits for the other lock. With a plain `with second:` and no timeout, both threads would wait here forever."
     },
     "ask": {
      "q": "Click the line where the two threads end up waiting on each other.",
      "lines": [
       9
      ],
      "why": "t1 holds a and waits for b; t2 holds b and waits for a. Nobody can move. A timeout breaks the stalemate: here t1 gives up after 0.2 s, releases a, and t2 gets through."
     }
    },
    {
     "t": "predict",
     "id": "threads-locks-p3",
     "code": "import threading, time\n\na, b = threading.Lock(), threading.Lock()\nresults = []\n\ndef worker(name, first, second, patience):\n    with first:\n        time.sleep(0.1)                      # both threads now hold one lock\n        if second.acquire(timeout=patience):\n            second.release()\n            results.append(name + \" got both\")\n        else:\n            results.append(name + \" gave up\")\n\nt1 = threading.Thread(target=worker, args=(\"t1\", a, b, 0.2))\nt2 = threading.Thread(target=worker, args=(\"t2\", b, a, 0.6))\nt1.start()\nt2.start()\nt1.join()\nt2.join()\nprint(sorted(results))",
     "q": "t1 waits at most 0.2 s for its second lock and t2 waits at most 0.6 s. What does it print (sorted)?",
     "answer": "['t1 gave up', 't2 got both']",
     "why": "t1 gives up at 0.2 s and leaves its with block, which frees lock a. t2 was waiting for a, gets it, and finishes. Without any timeout both would hang. In real code you avoid this by always taking locks in the same order."
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "What is RLock?",
       "a": "A lock the same thread can take again without blocking itself. Use it when a locked method calls another method that takes the same lock. With a plain Lock that second take would hang the thread forever."
      },
      {
       "q": "Should I use one lock or one per key?",
       "a": "One lock is simple and correct, and fine when the work inside is tiny. One lock per key lets different keys run in parallel (section 6). Start with one."
      }
     ]
    },
    {
     "t": "write",
     "id": "threads-locks-w",
     "q": "Stats.hit loses updates under threads. Add a lock so 20 threads give exactly 20.",
     "starter": "import threading, time\n\nclass Stats:\n    def __init__(self):\n        self.hits = 0\n\n    def hit(self):\n        tmp = self.hits\n        time.sleep(0.01)\n        self.hits = tmp + 1\n\nstats = Stats()\nthreads = [threading.Thread(target=stats.hit) for _ in range(20)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(stats.hits)   # want 20",
     "solution": "import threading, time\n\nclass Stats:\n    def __init__(self):\n        self.hits = 0\n        self._lock = threading.Lock()\n\n    def hit(self):\n        with self._lock:\n            tmp = self.hits\n            time.sleep(0.01)\n            self.hits = tmp + 1\n\nstats = Stats()\nthreads = [threading.Thread(target=stats.hit) for _ in range(20)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(stats.hits)   # want 20",
     "hint": "Create the lock in __init__ and wrap the read, pause and write in `with self._lock:`.",
     "why": "The lock goes around the whole read-modify-write, and it lives on the object that owns the data."
    }
   ]
  },
  {
   "id": "threads-cap",
   "title": "Capping concurrency: where the limit goes",
   "blocks": [
    {
     "t": "p",
     "text": "'Add a cap' means: at most N of these at the same time. There are two places to put it, and the question to ask is which thing you are limiting."
    },
    {
     "t": "table",
     "head": [
      "Tool",
      "What it limits",
      "Where it sits"
     ],
     "rows": [
      [
       "ThreadPoolExecutor(max_workers=N)",
       "Whole tasks running at once",
       "Where you build the pool"
      ],
      [
       "threading.Semaphore(N)",
       "One section of code, run by any number of threads",
       "Around the one slow call: `with sem:`"
      ]
     ]
    },
    {
     "t": "code",
     "id": "threads-cap-pool",
     "title": "Ten tasks, three workers",
     "code": "from concurrent.futures import ThreadPoolExecutor\nimport threading, time\n\nactive = 0\npeak = 0\nlock = threading.Lock()\n\ndef task(n):\n    global active, peak\n    with lock:\n        active += 1\n        peak = max(peak, active)\n    time.sleep(0.1)\n    with lock:\n        active -= 1\n    return n\n\nstart = time.perf_counter()\nwith ThreadPoolExecutor(max_workers=3) as pool:\n    list(pool.map(task, range(10)))\nprint(peak, round(time.perf_counter() - start, 1))",
     "notes": {
      "11": "Counts how many tasks are running right now.",
      "12": "Remembers the most that ever ran together.",
      "19": "The cap. Task 4 waits until a worker is free."
     },
     "ask": {
      "q": "Click the line that sets the cap.",
      "lines": [
       19
      ],
      "why": "max_workers is the cap on how many tasks run together. 10 tasks in waves of 3 is four waves: 4 x 0.1 = 0.4 s."
     }
    },
    {
     "t": "predict",
     "id": "threads-cap-p",
     "code": "from concurrent.futures import ThreadPoolExecutor\nimport threading, time\n\nactive = 0\npeak = 0\nlock = threading.Lock()\n\ndef task(n):\n    global active, peak\n    with lock:\n        active += 1\n        peak = max(peak, active)\n    time.sleep(0.1)\n    with lock:\n        active -= 1\n    return n\n\nstart = time.perf_counter()\nwith ThreadPoolExecutor(max_workers=5) as pool:\n    list(pool.map(task, range(10)))\nprint(peak, round(time.perf_counter() - start, 1))",
     "q": "Same code with max_workers=5 and ten tasks. What does it print: the peak and the seconds?",
     "answer": "5 0.2",
     "why": "Peak 5 (the cap), and two waves of 0.1 s: 0.2 s."
    },
    {
     "t": "p",
     "text": "The pool caps everything the task does. If the task also does other work (parsing, waiting for the database) that is fine to overlap, a pool cap is too blunt. Say the API allows 5 requests at once but you have 50 workers. Put a semaphore around only the API call."
    },
    {
     "t": "code",
     "id": "threads-cap-sem",
     "title": "Eight threads, two at a time through the slow part",
     "code": "import threading, time\n\nactive = 0\npeak = 0\nlock = threading.Lock()\nsem = threading.Semaphore(2)\n\ndef call_api(i):\n    global active, peak\n    time.sleep(0.02)                  # prepare: everyone does this at once\n    with sem:\n        with lock:\n            active += 1\n            peak = max(peak, active)\n        time.sleep(0.1)               # the slow call\n        with lock:\n            active -= 1\n\nstart = time.perf_counter()\nthreads = [threading.Thread(target=call_api, args=(i,)) for i in range(8)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(peak, round(time.perf_counter() - start, 1))",
     "notes": {
      "6": "A counter of 2 permits.",
      "10": "Prepare step. Not limited: all eight do it at once.",
      "11": "Take a permit; wait here if both are in use. Release at the end of the block.",
      "15": "The slow call. At most two threads are here together."
     },
     "ask": {
      "q": "Click the line that enforces the cap on the slow call.",
      "lines": [
       11
      ],
      "why": "Only the code inside the with is limited. mock2_service/app/cache/tiered.py does the same with asyncio.Semaphore (line 42, source_slots)."
     }
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Five callers, a semaphore of 2",
       "lanes": [
        [
         "Caller 1",
         [
          [
           "calls API",
           "hot",
           "2"
          ],
          [
           "",
           "gap",
           "4"
          ]
         ]
        ],
        [
         "Caller 2",
         [
          [
           "calls API",
           "hot",
           "2"
          ],
          [
           "",
           "gap",
           "4"
          ]
         ]
        ],
        [
         "Caller 3",
         [
          [
           "waits for a permit",
           "gap",
           "2"
          ],
          [
           "calls API",
           "hot",
           "2"
          ],
          [
           "",
           "gap",
           "2"
          ]
         ]
        ],
        [
         "Caller 4",
         [
          [
           "waits for a permit",
           "gap",
           "2"
          ],
          [
           "calls API",
           "hot",
           "2"
          ],
          [
           "",
           "gap",
           "2"
          ]
         ]
        ],
        [
         "Caller 5",
         [
          [
           "waits for a permit",
           "gap",
           "4"
          ],
          [
           "calls API",
           "hot",
           "2"
          ]
         ]
        ]
       ],
       "note": "Never more than two bars in the hot colour at the same time."
      }
     ]
    },
    {
     "t": "predict",
     "id": "threads-cap-p2",
     "code": "import threading, time\n\nactive = 0\npeak = 0\nlock = threading.Lock()\nsem = threading.Semaphore(2)\n\ndef call_api(i):\n    global active, peak\n    time.sleep(0.02)                  # prepare: everyone does this at once\n    with sem:\n        with lock:\n            active += 1\n            peak = max(peak, active)\n        time.sleep(0.1)               # the slow call\n        with lock:\n            active -= 1\n\nstart = time.perf_counter()\nthreads = [threading.Thread(target=call_api, args=(i,)) for i in range(8)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(peak, round(time.perf_counter() - start, 1))",
     "q": "What does the semaphore sample print: the peak and the seconds? Eight threads, 0.1 s each through the gate.",
     "answer": "2 0.4",
     "why": "Peak 2. Eight callers through a gate of 2 is four waves of 0.1 s: about 0.4 s, plus the 0.02 s prepare step that everyone does together (it prints 0.4 after rounding)."
    },
    {
     "t": "mcq",
     "id": "threads-cap-mcq",
     "q": "A pool has 50 workers, but the downstream API allows 5 requests at once. Each task also parses a big response. Where does the cap go?",
     "o": [
      "max_workers=5",
      "Threading.Semaphore(5) around only the API call",
      "A time.sleep before every task",
      "A bigger queue"
     ],
     "a": 1,
     "why": "A pool of 5 would also slow the parsing. A semaphore limits only the call the API cares about. If every task is only the API call, max_workers=5 is the simpler answer."
    },
    {
     "t": "write",
     "id": "threads-cap-w",
     "q": "Six threads call the API at the same time (the peak is 6). Add a semaphore so no more than 2 are inside at once. It must print 2.",
     "starter": "import threading, time\n\nactive = 0\npeak = 0\nlock = threading.Lock()\n\ndef call_api(i):\n    global active, peak\n    with lock:\n        active += 1\n        peak = max(peak, active)\n    time.sleep(0.1)\n    with lock:\n        active -= 1\n\nthreads = [threading.Thread(target=call_api, args=(i,)) for i in range(6)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(peak)   # want 2",
     "solution": "import threading, time\n\nactive = 0\npeak = 0\nlock = threading.Lock()\nsem = threading.Semaphore(2)\n\ndef call_api(i):\n    global active, peak\n    with sem:\n        with lock:\n            active += 1\n            peak = max(peak, active)\n        time.sleep(0.1)\n        with lock:\n            active -= 1\n\nthreads = [threading.Thread(target=call_api, args=(i,)) for i in range(6)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(peak)   # want 2",
     "hint": "Make sem = threading.Semaphore(2) and wrap the counting and the sleep in `with sem:`.",
     "why": "In the interview, say it in one sentence: 'I would add a semaphore of N around the slow call'. Then point at the line."
    }
   ]
  },
  {
   "id": "threads-order",
   "title": "Keeping order, per-key locks and queues",
   "blocks": [
    {
     "t": "p",
     "text": "Two questions about results: in what order do they come back, and which jobs must never overlap? Both have a plain answer."
    },
    {
     "t": "code",
     "id": "threads-order-map",
     "title": "map keeps submission order, as_completed does not",
     "code": "from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndelays = {\"a\": 0.3, \"b\": 0.1, \"c\": 0.2}\n\ndef job(name):\n    time.sleep(delays[name])\n    return name\n\nwith ThreadPoolExecutor(max_workers=3) as pool:\n    print(\"map:\", list(pool.map(job, [\"a\", \"b\", \"c\"])))\n    futures = [pool.submit(job, name) for name in [\"a\", \"b\", \"c\"]]\n    print(\"as_completed:\", [f.result() for f in as_completed(futures)])",
     "notes": {
      "11": "Results come back in the order you gave the inputs, even though b finishes first. If a is slow, the first result waits for it.",
      "13": "Yields each Future as it finishes. Fastest first."
     },
     "ask": {
      "q": "Click the line that hands you results in the order they finish.",
      "lines": [
       13
      ],
      "why": "as_completed is completion order: b, c, a. map and a list of futures read in order are submission order: a, b, c."
     }
    },
    {
     "t": "predict",
     "id": "threads-order-p",
     "code": "from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndelays = {\"a\": 0.3, \"b\": 0.1, \"c\": 0.2}\n\ndef job(name):\n    time.sleep(delays[name])\n    return name\n\nwith ThreadPoolExecutor(max_workers=3) as pool:\n    print(\"map:\", list(pool.map(job, [\"a\", \"b\", \"c\"])))\n    futures = [pool.submit(job, name) for name in [\"a\", \"b\", \"c\"]]\n    print(\"as_completed:\", [f.result() for f in as_completed(futures)])",
     "q": "Delays: a 0.3 s, b 0.1 s, c 0.2 s. What do the two prints show?",
     "answer": "map: ['a', 'b', 'c']\nas_completed: ['b', 'c', 'a']",
     "why": "map gives a, b, c: submission order, even though b is ready first. as_completed gives b, c, a: the order they finished."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Same three jobs, two orders",
       "lanes": [
        [
         "Job a (0.3 s)",
         [
          [
           "a",
           "hot",
           "3"
          ]
         ]
        ],
        [
         "Job b (0.1 s)",
         [
          [
           "b",
           "done",
           "1"
          ],
          [
           "",
           "gap",
           "2"
          ]
         ]
        ],
        [
         "Job c (0.2 s)",
         [
          [
           "c",
           "done",
           "2"
          ],
          [
           "",
           "gap",
           "1"
          ]
         ]
        ]
       ],
       "note": "Finishing order: b, c, a. map still returns a first and makes you wait for it."
      }
     ]
    },
    {
     "t": "write",
     "id": "threads-order-w",
     "q": "run_all returns results in finish order, but the caller needs them in the same order as the names. Keep as_completed (so each finish still prints as it happens) and return ['a', 'b', 'c'].",
     "starter": "from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndelays = {\"a\": 0.3, \"b\": 0.1, \"c\": 0.2}\n\ndef job(name):\n    time.sleep(delays[name])\n    print(\"finished\", name)\n    return name\n\ndef run_all(names):\n    out = []\n    with ThreadPoolExecutor(max_workers=3) as pool:\n        futures = [pool.submit(job, n) for n in names]\n        for f in as_completed(futures):\n            out.append(f.result())\n    return out\n\nprint(run_all([\"a\", \"b\", \"c\"]))   # want ['a', 'b', 'c'] while still logging each finish as it happens",
     "solution": "from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndelays = {\"a\": 0.3, \"b\": 0.1, \"c\": 0.2}\n\ndef job(name):\n    time.sleep(delays[name])\n    print(\"finished\", name)\n    return name\n\ndef run_all(names):\n    out = [None] * len(names)\n    with ThreadPoolExecutor(max_workers=3) as pool:\n        futures = {pool.submit(job, n): i for i, n in enumerate(names)}\n        for f in as_completed(futures):\n            out[futures[f]] = f.result()\n    return out\n\nprint(run_all([\"a\", \"b\", \"c\"]))   # want ['a', 'b', 'c'] while still logging each finish as it happens",
     "hint": "Build a dict future -> index when submitting, and write each result into out[index].",
     "why": "A dict from Future to its position is the standard way to get both: act on results as they arrive, return them in input order."
    },
    {
     "t": "p",
     "text": "Next: sometimes two jobs for the same key must never run together (two updates to one user), but jobs for different keys can. That is one lock per key, held only for that key's work."
    },
    {
     "t": "code",
     "id": "threads-order-keyed",
     "title": "A lock per key",
     "code": "import threading, time\n\nlocks = {}\ncounts = {}\n\ndef lock_for(key):\n    return locks.setdefault(key, threading.Lock())\n\ndef bump(key):\n    with lock_for(key):\n        tmp = counts.get(key, 0)\n        time.sleep(0.1)\n        counts[key] = tmp + 1\n\nstart = time.perf_counter()\nthreads = [threading.Thread(target=bump, args=(k,)) for k in [\"a\", \"a\", \"a\", \"b\", \"b\", \"c\"]]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(sorted(counts.items()), round(time.perf_counter() - start, 1))",
     "notes": {
      "7": "Gets the key's lock, creating it the first time. In CPython one setdefault on a dict is atomic, so every thread ends up with the same Lock.",
      "10": "Same key: wait your turn. Different key: a different lock, no waiting."
     },
     "ask": {
      "q": "Click the line that makes two jobs for the same key take turns.",
      "lines": [
       10
      ],
      "why": "The three 'a' jobs queue up behind one lock. The b jobs and the c job use other locks and run alongside."
     }
    },
    {
     "t": "predict",
     "id": "threads-order-p2",
     "code": "import threading, time\n\nlocks = {}\ncounts = {}\n\ndef lock_for(key):\n    return locks.setdefault(key, threading.Lock())\n\ndef bump(key):\n    with lock_for(key):\n        tmp = counts.get(key, 0)\n        time.sleep(0.1)\n        counts[key] = tmp + 1\n\nstart = time.perf_counter()\nthreads = [threading.Thread(target=bump, args=(k,)) for k in [\"a\", \"a\", \"a\", \"b\", \"b\", \"c\"]]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(sorted(counts.items()), round(time.perf_counter() - start, 1))",
     "q": "Six threads: keys a, a, a, b, b, c, each holding its lock for 0.1 s. What are the counts and the total time?",
     "answer": "[('a', 3), ('b', 2), ('c', 1)] 0.3",
     "why": "a:3, b:2, c:1, and 0.3 s: the three a jobs are serial (3 x 0.1), while b and c fit inside that time. With one global lock it would be 0.6 s."
    },
    {
     "t": "p",
     "text": "The last tool is a queue with a fixed number of worker threads. The workers are the cap (three at a time); the queue holds the rest. This is `mock2_service/app/workers/refresh.py` in thread form: a bounded `asyncio.Queue` at line 36 and workers created at lines 41 to 43."
    },
    {
     "t": "code",
     "id": "threads-order-queue",
     "title": "Producer, queue, three workers, stop markers",
     "code": "import queue, threading, time\n\njobs = queue.Queue()\ndone = queue.Queue()\nSTOP = None\n\ndef worker():\n    while True:\n        item = jobs.get()\n        if item is STOP:\n            break\n        time.sleep(0.05)\n        done.put(item * item)\n\nthreads = [threading.Thread(target=worker) for _ in range(3)]\nfor t in threads:\n    t.start()\nfor n in range(6):\n    jobs.put(n)\nfor _ in threads:\n    jobs.put(STOP)\nfor t in threads:\n    t.join()\nprint(sorted(done.get() for _ in range(done.qsize())))",
     "notes": {
      "3": "Thread-safe: put and get need no extra lock. Queue(maxsize=N) would make put wait when full, which slows the producer down.",
      "9": "A worker sleeps here until work arrives.",
      "10": "The stop check. The sentinel is a value that means 'no more work'.",
      "21": "One STOP per worker, queued after the real jobs.",
      "23": "Waits for the workers to exit after their STOP."
     },
     "ask": {
      "q": "Click the line where an idle worker waits for work.",
      "lines": [
       9
      ],
      "why": "get() blocks until something is put. Workers do not poll. They sit here, which is why the program never ends unless each one receives a STOP."
     }
    },
    {
     "t": "mcq",
     "id": "threads-order-mcq",
     "q": "The code above has three workers but the producer puts only one STOP. What happens?",
     "o": [
      "All three stop, since STOP is shared",
      "Python raises an error",
      "One worker stops; two stay blocked on get(), and join() hangs",
      "The queue closes itself"
     ],
     "a": 2,
     "why": "Each worker takes one STOP and exits. Two workers wait forever on get(). One sentinel per worker, always."
    },
    {
     "t": "predict",
     "id": "threads-order-p3",
     "code": "import queue, threading, time\n\njobs = queue.Queue()\ndone = queue.Queue()\nSTOP = None\n\ndef worker():\n    while True:\n        item = jobs.get()\n        if item is STOP:\n            break\n        time.sleep(0.05)\n        done.put(item * item)\n\nthreads = [threading.Thread(target=worker) for _ in range(3)]\nfor t in threads:\n    t.start()\nfor n in range(6):\n    jobs.put(n)\nfor _ in threads:\n    jobs.put(STOP)\nfor t in threads:\n    t.join()\nprint(sorted(done.get() for _ in range(done.qsize())))",
     "q": "Six jobs squared by three workers. What does it print (sorted)?",
     "answer": "[0, 1, 4, 9, 16, 25]",
     "why": "[0, 1, 4, 9, 16, 25]. The workers finish in any order, which is why the sample sorts the output. A queue gives you a cap and a buffer, not an order."
    }
   ]
  },
  {
   "id": "threads-flight",
   "title": "Single-flight: 50 threads, one load",
   "blocks": [
    {
     "t": "p",
     "text": "The mock1 ProfileCache loads the same key many times at once; the global-lock PriceCache loads different keys one at a time. The fix that answers both is single-flight: for each key, one thread (the leader) does the load, and everyone else asking for that key waits for the leader's answer."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "50 requests, key u1",
       "lanes": [
        [
         "Leader",
         [
          [
           "registers a Future",
           "plain",
           "1"
          ],
          [
           "loader() 0.1 s",
           "hot",
           "5"
          ],
          [
           "sets the result",
           "done",
           "1"
          ]
         ]
        ],
        [
         "Follower 1",
         [
          [
           "sees the Future",
           "plain",
           "1"
          ],
          [
           "waits on future.result()",
           "gap",
           "5"
          ],
          [
           "gets the value",
           "done",
           "1"
          ]
         ]
        ],
        [
         "Follower 2..49",
         [
          [
           "see the Future",
           "plain",
           "1"
          ],
          [
           "wait on future.result()",
           "gap",
           "5"
          ],
          [
           "get the value",
           "done",
           "1"
          ]
         ]
        ]
       ],
       "note": "One database call. The lock is held only for the quick bookkeeping at the start and end, never during loader()."
      }
     ]
    },
    {
     "t": "list",
     "items": [
      "Step 1, under the lock: is there already a Future for this key? If not, create one: you are the leader.",
      "Step 2, outside the lock: the leader calls the loader. Followers call future.result() and wait.",
      "Step 3, under the lock: remove the Future from the in-flight dict.",
      "Failure: if the loader raises, put the error on the Future so followers see it too, and remove it, so the next call tries again."
     ]
    },
    {
     "t": "code",
     "id": "threads-flight-fetch",
     "title": "Single-flight for one function",
     "code": "import threading, time\nfrom concurrent.futures import Future\n\nlock = threading.Lock()\ninflight = {}\ncalls = []\n\ndef slow_load(key):\n    calls.append(key)\n    time.sleep(0.1)\n    return key.upper()\n\ndef fetch(key):\n    with lock:\n        fut = inflight.get(key)\n        leader = fut is None\n        if leader:\n            fut = inflight[key] = Future()\n    if leader:\n        try:\n            fut.set_result(slow_load(key))\n        except Exception as exc:\n            fut.set_exception(exc)\n        finally:\n            with lock:\n                del inflight[key]\n    return fut.result()\n\nout = []\nthreads = [threading.Thread(target=lambda: out.append(fetch(\"u1\"))) for _ in range(50)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(len(out), set(out), \"loads:\", len(calls))",
     "notes": {
      "14": "Short critical section: decide who leads. No slow work in here.",
      "16": "No Future yet means nobody is loading this key: you are first.",
      "21": "Only the leader reaches this slow call, and it runs without the lock.",
      "23": "Followers get the same error, not a hang.",
      "27": "Everyone, leader included, waits here and reads the answer."
     },
     "ask": {
      "q": "Click the line that decides which thread does the load.",
      "lines": [
       16
      ],
      "why": "Under the lock, exactly one thread sees no Future and creates it; everyone after sees that Future. 50 threads, one leader, one load."
     }
    },
    {
     "t": "predict",
     "id": "threads-flight-p",
     "code": "import threading, time\nfrom concurrent.futures import Future\n\nlock = threading.Lock()\ninflight = {}\ncalls = []\n\ndef slow_load(key):\n    calls.append(key)\n    time.sleep(0.1)\n    if len(calls) == 1:\n        raise RuntimeError(\"db down\")\n    return key.upper()\n\ndef fetch(key):\n    with lock:\n        fut = inflight.get(key)\n        leader = fut is None\n        if leader:\n            fut = inflight[key] = Future()\n    if leader:\n        try:\n            fut.set_result(slow_load(key))\n        except Exception as exc:\n            fut.set_exception(exc)\n        finally:\n            with lock:\n                del inflight[key]\n    return fut.result()\n\nerrors = []\n\ndef attempt():\n    try:\n        fetch(\"u1\")\n    except RuntimeError:\n        errors.append(1)\n\nthreads = [threading.Thread(target=attempt) for _ in range(3)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(\"errors:\", len(errors), \"loads:\", len(calls))\nprint(fetch(\"u1\"), \"loads:\", len(calls))",
     "q": "The first load fails with RuntimeError, later ones succeed. Three threads call fetch('u1') together; then one more call is made afterwards. What do the two prints show?",
     "answer": "errors: 3 loads: 1\nU1 loads: 2",
     "why": "All three share the leader's failed load, so they all get the error: errors 3, loads 1. The in-flight entry was removed, so the later call starts a fresh load, which succeeds: U1 with loads 2."
    },
    {
     "t": "write",
     "id": "threads-flight-w",
     "q": "Make ProfileCache single-flight. 50 threads asking for 'u1' must run the loader exactly once and all get the same object. Keep the part below the line unchanged.",
     "starter": "import threading, time\nfrom concurrent.futures import Future\n\nclass ProfileCache:\n    def __init__(self):\n        self._data = {}\n\n    def get_or_load(self, key, loader):\n        if key in self._data:\n            return self._data[key]\n        value = loader()\n        self._data[key] = value\n        return value\n\n# --- do not change below this line ---\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return {\"name\": \"ada\"}\n\ncache = ProfileCache()\nresults = []\n\ndef hit():\n    results.append(cache.get_or_load(\"u1\", loader))\n\nthreads = [threading.Thread(target=hit) for _ in range(50)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\ncache.get_or_load(\"u1\", loader)\nprint(\"loader calls:\", len(calls), \"same object:\", all(r is results[0] for r in results), \"results:\", len(results))",
     "solution": "import threading, time\nfrom concurrent.futures import Future\n\nclass ProfileCache:\n    def __init__(self):\n        self._data = {}\n        self._inflight = {}\n        self._lock = threading.Lock()\n\n    def get_or_load(self, key, loader):\n        with self._lock:\n            if key in self._data:\n                return self._data[key]\n            fut = self._inflight.get(key)\n            leader = fut is None\n            if leader:\n                fut = self._inflight[key] = Future()\n        if leader:\n            try:\n                value = loader()\n                with self._lock:\n                    self._data[key] = value\n                fut.set_result(value)\n            except Exception as exc:\n                fut.set_exception(exc)\n            finally:\n                with self._lock:\n                    del self._inflight[key]\n        return fut.result()\n\n# --- do not change below this line ---\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return {\"name\": \"ada\"}\n\ncache = ProfileCache()\nresults = []\n\ndef hit():\n    results.append(cache.get_or_load(\"u1\", loader))\n\nthreads = [threading.Thread(target=hit) for _ in range(50)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\ncache.get_or_load(\"u1\", loader)\nprint(\"loader calls:\", len(calls), \"same object:\", all(r is results[0] for r in results), \"results:\", len(results))",
     "hint": "Add self._inflight and self._lock. Under the lock check _data and _inflight; the leader loads outside it, stores under it, and resolves the Future; followers return fut.result().",
     "why": "Store the value in _data before removing the in-flight entry, so no thread can find neither. The output to expect is: loader calls: 1 same object: True results: 50."
    },
    {
     "t": "mcq",
     "id": "threads-flight-mcq",
     "q": "In single-flight, why is the loader called outside the lock?",
     "o": [
      "Because Python forbids calling functions under a lock",
      "Because the Future needs the lock released",
      "It makes the loader run faster",
      "So a slow load does not block requests for other keys, or hits on loaded keys"
     ],
     "a": 3,
     "why": "Holding the lock across the loader is the PriceCache bug. The lock only protects the bookkeeping."
    }
   ]
  },
  {
   "id": "threads-facts",
   "title": "Thread-safety facts to say out loud",
   "blocks": [
    {
     "t": "p",
     "text": "In a review you do not need to prove anything. You need to say, per operation, whether it is safe alone, and why. These are the facts to know for CPython."
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Safe alone or not",
       "vs": {
        "cols": [
         "Safe without a lock?",
         "Why"
        ],
        "rows": [
         [
          "d[k] = v  or  d.get(k)",
          "yes",
          "One step; the dict itself stays intact"
         ],
         [
          "q.put(x), q.get()  (queue.Queue)",
          "yes",
          "Built to be shared"
         ],
         [
          "lst.append(x)",
          "yes",
          "One step"
         ],
         [
          "n += 1  or  d[k] += 1",
          "no",
          "Read, add, write: three steps"
         ],
         [
          "if k not in d: d[k] = v",
          "no",
          "Check-then-act with a gap"
         ],
         [
          "for x in d: ... while another thread adds keys",
          "no",
          "RuntimeError: changed size"
         ],
         [
          "a cache hit path, then a miss path",
          "no",
          "Each step is fine, the pair is not"
         ]
        ]
       }
      }
     ]
    },
    {
     "t": "list",
     "items": [
      "Say it like this: 'a single dict get or set is atomic in CPython; compound operations are not.'",
      "Say it like this: 'check-then-act is the bug: between the check and the act another thread can change the answer.'",
      "Do not claim safety from the GIL: it protects the interpreter, not your invariants."
     ]
    },
    {
     "t": "code",
     "id": "threads-facts-lru",
     "title": "functools.lru_cache under threads",
     "code": "import threading, time\nfrom functools import lru_cache\n\ncalls = []\n\n@lru_cache(maxsize=None)\ndef price(sku):\n    calls.append(sku)\n    time.sleep(0.1)\n    return 42\n\nthreads = [threading.Thread(target=price, args=(\"a\",)) for _ in range(4)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(len(calls), price(\"a\"), len(calls))",
     "notes": {
      "6": "Thread-safe for its own internal bookkeeping, but it does not lock around your function.",
      "8": "Counts how many times the real function body ran."
     },
     "ask": {
      "q": "Click the line that shows lru_cache can call the function more than once for the same key.",
      "lines": [
       17
      ],
      "why": "Four threads arrive on a cold cache; none finds a stored value, so all four run the body. The cache never breaks, but it does not deduplicate the work in flight."
     }
    },
    {
     "t": "predict",
     "id": "threads-facts-p",
     "code": "import threading, time\nfrom functools import lru_cache\n\ncalls = []\n\n@lru_cache(maxsize=None)\ndef price(sku):\n    calls.append(sku)\n    time.sleep(0.1)\n    return 42\n\nthreads = [threading.Thread(target=price, args=(\"a\",)) for _ in range(4)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(len(calls), price(\"a\"), len(calls))",
     "q": "Four threads call price('a') together on a cold lru_cache. The function body counts its calls. What does it print?",
     "answer": "4 42 4",
     "why": "4 42 4. All four threads missed before any finished, so the body ran four times. After that the cache holds 42 and the fifth call, from main, does not run the body: still 4."
    },
    {
     "t": "p",
     "text": "Tie to mock1: `pricing.py` decorates the method `with_tax` with `lru_cache` (line 11). Two things to say. It is a pure calculation, so a duplicate call is harmless. And the cache key includes `self`, so the cache keeps every calculator instance alive and is unbounded (`maxsize=None`)."
    },
    {
     "t": "mcq",
     "id": "threads-facts-mcq",
     "q": "Which of these needs a lock when shared by many threads?",
     "o": [
      "cache[key] = value (one assignment)",
      "queue.Queue().put(job)",
      "hits += 1",
      "cache.get(key)"
     ],
     "a": 2,
     "why": "hits += 1 is read, add, write. The other three are single operations that are safe alone (assuming you do not rely on what happened between them)."
    }
   ]
  },
  {
   "id": "threads-review",
   "title": "Review this code",
   "blocks": [
    {
     "t": "p",
     "text": "This is the shape of the Mercor screen: a short cache, three problems, and you say them out loud while pointing at the line. The code below has exactly three. Run it in your head first, then click."
    },
    {
     "t": "predict",
     "id": "threads-review-p",
     "code": "import threading, time\n\nclass TTLCache:\n    def __init__(self, ttl):\n        self.ttl = ttl\n        self.data = {}\n        self.lock = threading.Lock()\n\n    def get(self, key, loader):\n        entry = self.data.get(key)\n        if entry and time.time() - entry[1] < self.ttl:\n            return entry[0]\n        with self.lock:\n            value = loader()\n            self.data[key] = (value, time.time())\n        return value\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return \"v\"\n\ncache = TTLCache(60)\nstart = time.perf_counter()\nthreads = [threading.Thread(target=cache.get, args=(\"k\", loader)) for _ in range(5)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(len(calls), round(time.perf_counter() - start, 1))",
     "q": "Five threads ask for the same key on an empty cache; the loader takes 0.1 s. How many loads, and how long?",
     "answer": "5 0.5",
     "why": "5 loads and 0.5 s. All five miss at the unlocked check (bug 1), then take the lock one at a time and each runs the loader again (bug 1 plus bug 2): 5 x 0.1 s."
    },
    {
     "t": "code",
     "id": "threads-review-1",
     "title": "Review this code: pass 1",
     "code": "import threading, time\n\nclass TTLCache:\n    def __init__(self, ttl):\n        self.ttl = ttl\n        self.data = {}\n        self.lock = threading.Lock()\n\n    def get(self, key, loader):\n        entry = self.data.get(key)\n        if entry and time.time() - entry[1] < self.ttl:\n            return entry[0]\n        with self.lock:\n            value = loader()\n            self.data[key] = (value, time.time())\n        return value\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return \"v\"\n\ncache = TTLCache(60)\nstart = time.perf_counter()\nthreads = [threading.Thread(target=cache.get, args=(\"k\", loader)) for _ in range(5)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(len(calls), round(time.perf_counter() - start, 1))",
     "notes": {
      "10": "Read without the lock.",
      "13": "One lock for every key.",
      "15": "Writes a new entry; nothing ever removes one."
     },
     "ask": {
      "q": "Pass 1. Click the line that decides 'miss' in a way that is not safe.",
      "lines": [
       11
      ],
      "why": "The check is made outside the lock and never repeated inside it. Many threads all conclude 'miss' together and each loads. Say: check-then-act race, duplicate loads."
     }
    },
    {
     "t": "code",
     "id": "threads-review-2",
     "title": "Review this code: pass 2",
     "code": "import threading, time\n\nclass TTLCache:\n    def __init__(self, ttl):\n        self.ttl = ttl\n        self.data = {}\n        self.lock = threading.Lock()\n\n    def get(self, key, loader):\n        entry = self.data.get(key)\n        if entry and time.time() - entry[1] < self.ttl:\n            return entry[0]\n        with self.lock:\n            value = loader()\n            self.data[key] = (value, time.time())\n        return value\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return \"v\"\n\ncache = TTLCache(60)\nstart = time.perf_counter()\nthreads = [threading.Thread(target=cache.get, args=(\"k\", loader)) for _ in range(5)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(len(calls), round(time.perf_counter() - start, 1))",
     "notes": {
      "10": "Read without the lock.",
      "13": "One lock for every key.",
      "15": "Writes a new entry; nothing ever removes one."
     },
     "ask": {
      "q": "Pass 2. Click the line that makes one slow load block every other key.",
      "lines": [
       14
      ],
      "why": "The slow call is made while holding the one global lock. Say: lock held across I/O, it serialises all keys. Fix: single-flight per key, loader outside the lock."
     }
    },
    {
     "t": "code",
     "id": "threads-review-3",
     "title": "Review this code: pass 3",
     "code": "import threading, time\n\nclass TTLCache:\n    def __init__(self, ttl):\n        self.ttl = ttl\n        self.data = {}\n        self.lock = threading.Lock()\n\n    def get(self, key, loader):\n        entry = self.data.get(key)\n        if entry and time.time() - entry[1] < self.ttl:\n            return entry[0]\n        with self.lock:\n            value = loader()\n            self.data[key] = (value, time.time())\n        return value\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return \"v\"\n\ncache = TTLCache(60)\nstart = time.perf_counter()\nthreads = [threading.Thread(target=cache.get, args=(\"k\", loader)) for _ in range(5)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint(len(calls), round(time.perf_counter() - start, 1))",
     "notes": {
      "10": "Read without the lock.",
      "13": "One lock for every key.",
      "15": "Writes a new entry; nothing ever removes one."
     },
     "ask": {
      "q": "Pass 3. Click the line where memory grows without a bound.",
      "lines": [
       15
      ],
      "why": "Entries are added and expired entries are never removed unless the same key is read again. Say: no size limit or eviction, so an unbounded set of keys fills memory. Fix: a max size with LRU, or periodic purge."
     }
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "In what order should I say the bugs?",
       "a": "Say the correctness bug first (the race), then the performance one (lock across I/O), then resource growth. Name the line each time."
      },
      {
       "q": "What if I only spot two?",
       "a": "Say the two clearly and add 'I would also ask about size limits, retries and what happens when the loader fails'. Asking is a good answer."
      }
     ]
    },
    {
     "t": "write",
     "id": "threads-review-w",
     "q": "Write the three sentences you would say in the review, one per bug. Say them aloud once, too.",
     "starter": "# Write what you would say out loud in the review, one sentence per bug.\n# 1. the check:\n# 2. the lock:\n# 3. the growth:",
     "solution": "# Write what you would say out loud in the review, one sentence per bug.\n# 1. the check: the hit check is outside the lock and not repeated inside it, so threads that all miss each load the same key.\n# 2. the lock: the loader runs while holding one lock for the whole cache, so a slow load for one key blocks every other key.\n# 3. the growth: expired entries are only replaced when the same key is read again, so keys never read again stay in memory forever.",
     "hint": "Name the line, say what goes wrong, say the fix in a few words.",
     "why": "A good review sentence has three parts: where, what breaks under load, and the cheapest fix."
    }
   ]
  }
 ]
});
