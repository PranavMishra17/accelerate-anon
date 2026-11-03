/* Mercor coding tab, part 2: Threads. Every code sample was run with Python 3.12. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "threads",
 "n": 2,
 "title": "Threads",
 "minutes": 40,
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
     "t": "p",
     "text": "A pool is the same idea with less typing. `submit` starts (or queues) the work and returns a `Future` right away. `.result()` is where you wait, and it re-raises any error the work raised."
    },
    {
     "t": "write",
     "id": "threads-start-w",
     "q": "The pool has 4 workers but the run takes 0.8 s. Change the code so the four tasks overlap (about 0.2 s).",
     "starter": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef slow_square(n):\n    time.sleep(0.2)\n    return n * n\n\nstart = time.perf_counter()\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    results = [pool.submit(slow_square, n).result() for n in range(4)]\nprint(results, round(time.perf_counter() - start, 1))   # want 0.2, not 0.8",
     "solution": "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef slow_square(n):\n    time.sleep(0.2)\n    return n * n\n\nstart = time.perf_counter()\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    futures = [pool.submit(slow_square, n) for n in range(4)]\n    results = [f.result() for f in futures]\nprint(results, round(time.perf_counter() - start, 1))   # want 0.2, not 0.8",
     "hint": "Submit all four first into a list, then call .result() on each in a second loop.",
     "why": "Rule: never call result() in the same expression as submit(). Submit first, collect after. It is the most common reason 'we added threads and nothing got faster'."
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
     "text": "A `threading.Lock` lets one thread at a time into a block. Other threads that reach `with lock:` wait at the door. Use it around the smallest piece of code that must not be interleaved: the read-modify-write, the check-then-act. The lock costs time: threads wait. So the rule has two halves. Hold it around the check-then-act. Never hold it around slow work that other threads do not need to wait for."
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
     "t": "p",
     "text": "The fix is not to remove the lock: that brings back the check-then-act race. You need the lock only to decide 'who loads this key', and the load runs outside it. That is single-flight, in section 7."
    },
    {
     "t": "list",
     "items": [
      "A single dict get or set, `list.append` and `queue.Queue` put/get are safe alone in CPython; compound operations are not.",
      "`n += 1` and `d[k] += 1` are read, add, write: three steps. `if k not in d: d[k] = v` is check-then-act with a gap.",
      "Iterating a dict while another thread adds keys raises RuntimeError.",
      "Do not claim safety from the GIL: it protects the interpreter, not your invariants."
     ]
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
    }
   ]
  },
  {
   "id": "threads-order",
   "title": "Keeping order, per-key locks and queues",
   "blocks": [
    {
     "t": "p",
     "text": "Two questions about results: in what order do they come back, and which jobs must never overlap? Both have a plain answer. `map` returns results in the order you gave the inputs, even though b finishes first; `as_completed` yields each Future as it finishes, fastest first. Next: sometimes two jobs for the same key must never run together (two updates to one user), but jobs for different keys can. That is one lock per key, held only for that key's work."
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
     "t": "p",
     "text": "The last tool is a queue with a fixed number of worker threads. The workers are the cap (three at a time); the queue holds the rest. This is `mock2_service/app/workers/refresh.py` in thread form: a bounded `asyncio.Queue` at line 36 and workers created at lines 41 to 43."
    },
    {
     "t": "mcq",
     "id": "threads-order-mcq",
     "q": "A queue has three worker threads, each stopping on a STOP marker, but the producer puts only one STOP. What happens?",
     "o": [
      "All three stop, since STOP is shared",
      "Python raises an error",
      "One worker stops; two stay blocked on get(), and join() hangs",
      "The queue closes itself"
     ],
     "a": 2,
     "why": "Each worker takes one STOP and exits. Two workers wait forever on get(). One sentinel per worker, always."
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
     "t": "write",
     "id": "threads-flight-w",
     "q": "Make ProfileCache single-flight. 50 threads asking for 'u1' must run the loader exactly once and all get the same object. Keep the part below the line unchanged.",
     "starter": "import threading, time\nfrom concurrent.futures import Future\n\nclass ProfileCache:\n    def __init__(self):\n        self._data = {}\n\n    def get_or_load(self, key, loader):\n        if key in self._data:\n            return self._data[key]\n        value = loader()\n        self._data[key] = value\n        return value\n\n# --- do not change below this line ---\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return {\"name\": \"ada\"}\n\ncache = ProfileCache()\nresults = []\n\ndef hit():\n    results.append(cache.get_or_load(\"u1\", loader))\n\nthreads = [threading.Thread(target=hit) for _ in range(50)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\ncache.get_or_load(\"u1\", loader)\nprint(\"loader calls:\", len(calls), \"same object:\", all(r is results[0] for r in results), \"results:\", len(results))",
     "solution": "import threading, time\nfrom concurrent.futures import Future\n\nclass ProfileCache:\n    def __init__(self):\n        self._data = {}\n        self._inflight = {}\n        self._lock = threading.Lock()\n\n    def get_or_load(self, key, loader):\n        with self._lock:\n            if key in self._data:\n                return self._data[key]\n            fut = self._inflight.get(key)\n            leader = fut is None\n            if leader:\n                fut = self._inflight[key] = Future()\n        if leader:\n            try:\n                value = loader()\n                with self._lock:\n                    self._data[key] = value\n                fut.set_result(value)\n            except Exception as exc:\n                fut.set_exception(exc)\n            finally:\n                with self._lock:\n                    del self._inflight[key]\n        return fut.result()\n\n# --- do not change below this line ---\n\ncalls = []\n\ndef loader():\n    calls.append(1)\n    time.sleep(0.1)\n    return {\"name\": \"ada\"}\n\ncache = ProfileCache()\nresults = []\n\ndef hit():\n    results.append(cache.get_or_load(\"u1\", loader))\n\nthreads = [threading.Thread(target=hit) for _ in range(50)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\ncache.get_or_load(\"u1\", loader)\nprint(\"loader calls:\", len(calls), \"same object:\", all(r is results[0] for r in results), \"results:\", len(results))",
     "hint": "Add self._inflight and self._lock. Under the lock check _data and _inflight; the leader loads outside it, stores under it, and resolves the Future; followers return fut.result().",
     "why": "Store the value in _data before removing the in-flight entry, so no thread can find neither. The output to expect is: loader calls: 1 same object: True results: 50."
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
     "ask": {
      "q": "Pass 2. Click the line that makes one slow load block every other key.",
      "lines": [
       14
      ],
      "why": "The slow call is made while holding the one global lock. Say: lock held across I/O, it serialises all keys. Fix: single-flight per key, loader outside the lock."
     }
    },
    {
     "t": "faq",
     "items": [
      {
       "q": "In what order should I say the bugs?",
       "a": "Say the correctness bug first (the race), then the performance one (lock across I/O), then resource growth. Name the line each time."
      }
     ]
    }
   ]
  }
 ]
});
