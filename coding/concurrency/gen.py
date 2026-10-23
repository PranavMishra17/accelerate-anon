"""Generate coding/concurrency.js (window.CONCURRENCY): threads, asyncio and processes, side by side.
One source, two pages: the Concurrency tab on loop pages (interviews/template.html, parts with tab "concurrency")
and the Concurrency tab on CODING.html. Code comes from snippets.py, which runs it first.
Blocks: p, list, code {title, code}, table {head, rows}, fig {key}, say {lines}.
Run: python coding/concurrency/gen.py"""
import io, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from snippets import CODE  # noqa: E402  (coding/concurrency/snippets.py)

OUT = os.path.join(HERE, "..", "concurrency.js")
def P(t): return {"t": "p", "text": t}
def L(*items): return {"t": "list", "items": list(items)}
def CD(name, title): return {"t": "code", "title": title, "code": CODE[name]}
def T(head, *rows): return {"t": "table", "head": head, "rows": [list(r) for r in rows]}
def F(key): return {"t": "fig", "key": key}
def SAY(*lines): return {"t": "say", "lines": list(lines)}
def SEC(i, title, *blocks): return {"id": i, "title": title, "blocks": list(blocks)}
def PART(i, n, title, minutes, lead, *secs):
    return {"tab": "concurrency", "id": i, "n": n, "title": title, "minutes": minutes, "lead": lead, "sections": list(secs)}

parts = [
PART("cc-compare", 1, "The five, side by side", 12,
  "Process, thread, multithreading, async and multiprocessing: what each is, what each is for, and the one question that picks between them.",
  SEC("cc-words", "The words",
    P("**Concurrency** is handling many things at once: they overlap in time. **Parallelism** is doing many things at the same instant, on several cores. Threads and asyncio give you concurrency; processes give you parallelism."),
    T(["", "What it is", "Shares memory", "Truly parallel in Python", "Cost to start", "Best for"],
      ["**Process**", "A running program: its own memory, its own Python interpreter, its own GIL.", "No: copy, pipe or shared memory on purpose", "Yes, one per core", "Highest: tens of ms and MBs each", "CPU-heavy Python"],
      ["**Thread**", "A line of execution inside a process, scheduled by the OS.", "Yes, everything in the process", "No: one thread runs Python at a time (the GIL); waits overlap", "Low, but each holds a stack", "Blocking I/O calls"],
      ["**Multithreading**", "Several threads in one process, usually a pool.", "Yes, so shared state needs locks", "Only inside C code that releases the GIL", "Low", "Many blocking calls at once"],
      ["**Async (coroutines)**", "Functions that pause at `await`; one event loop on one thread switches between them.", "Yes, one thread", "No: one runs at a time, switching only at `await`", "Lowest: a few KB per task", "Many network waits"],
      ["**Multiprocessing**", "Several processes splitting work, usually a pool.", "No: arguments and results are pickled", "Yes", "High, plus pickling", "CPU work you can split"]),
    F("concModels")),
  SEC("cc-which", "Which one",
    F("concDecide"),
    T(["Workload", "Pick", "Why"],
      ["200 calls to a model API", "**asyncio** + a `Semaphore`", "All waiting; tasks are cheap; the semaphore holds the rate limit."],
      ["A blocking SDK (an S3 client, a sync database driver)", "**Threads**: a `ThreadPoolExecutor`, or `asyncio.to_thread`", "The library can't await; a thread waits for it and releases the GIL."],
      ["Parse 10,000 PDFs, tokenise a corpus", "**Processes**: a `ProcessPoolExecutor`", "Pure Python computation; only separate processes use more cores."],
      ["Big NumPy or PyTorch maths", "Often **threads**, or nothing extra", "The heavy part runs in C and releases the GIL; the library may already use every core."],
      ["A web API server", "An **async framework** (FastAPI on uvicorn) in **several worker processes**", "Async for the many waiting requests; processes to use every core."],
      ["More than one machine can do", "A **queue and workers** (SQS, Celery, Postgres `SKIP LOCKED`)", "Concurrency becomes distribution; the queue spreads and retries the work."]),
    SAY("My rule is **where does the time go: waiting or computing?** Waiting on the network, **asyncio**, or **threads** when the library blocks. Computing in Python, **processes**, because the **GIL lets one thread run Python at a time**.",
        "And past one machine, it's **a queue and workers**. Most real systems mix them: **async for the calls, a process pool for the heavy work**."))),

PART("cc-threads", 2, "Threads and the GIL", 9,
  "Threads share a process's memory and overlap waiting, not computing. The GIL is why, and shared memory is where the bugs come from.",
  SEC("cc-gil", "How threads run in Python",
    P("A **thread** is a separate line of execution inside your process. The OS can pause it at any instruction and run another, and all threads see the same objects."),
    P("CPython has a **global interpreter lock (GIL)**: a thread must hold it to run Python bytecode. A thread **releases it when it blocks** on I/O (a socket, a file, `time.sleep`), and a thread that keeps computing is **asked to hand it over every 5 ms** (`sys.getswitchinterval()`). So threads **overlap waiting, not computing**. C extensions such as NumPy and hashlib release it during their heavy work."),
    F("concGil"),
    P("Python 3.13 added an optional **free-threaded build** without the GIL, and 3.14 made it officially supported. It is not the default build; for now, plan on the GIL.")),
  SEC("cc-thread-code", "The code",
    CD("thread_pool", "Many blocking calls at once: a pool of threads"),
    CD("lock", "Shared state: a lock around the read-modify-write")),
  SEC("cc-thread-pitfalls", "Pitfalls",
    L("Race condition: two threads read-modify-write the same value, or check-then-act, and one update is lost. Lock the check and the write together.",
      "Deadlock: two threads each hold one lock and wait for the other's. Take locks in one global order, or use one lock.",
      "Lock held across I/O: a lock around a network call makes every thread wait for the slowest call. Lock only the shared data, for microseconds.",
      "Too many threads: each holds a stack and costs switching. Use a pool of a few dozen, not a thread per request.",
      "Lost exceptions: an error in a bare `Thread` prints and disappears. With an executor, `future.result()` raises it where you can handle it.",
      "Objects not built for threads: give each thread its own client, or check the library says it's thread-safe."),
    CD("deadlock", "Deadlock, and the fix: one lock order")),
  SEC("cc-thread-where", "Where it shows up",
    L("Calling a blocking SDK many times at once: an S3 client, a sync database driver, a vendor API with no async client.",
      "Background work inside a service: a poller, a heartbeat, flushing logs or metrics.",
      "At a team like Mercor Enterprise: pulling records from a customer's systems through a sync client, with the pool sized under their rate limit."),
    SAY("Threads in Python **overlap waiting, not computing**, because of the **GIL**: a thread releases it when it blocks on I/O. So I use a **thread pool for blocking libraries**, keep shared state behind **a lock held for microseconds**, and never **hold a lock across a network call**."))),

PART("cc-async", 3, "asyncio and the event loop", 10,
  "One thread, one loop, thousands of cheap tasks that pause at await. The fastest way to wait on many things, and easy to stall with one blocking call.",
  SEC("cc-loop", "How the loop works",
    P("An `async def` function is a **coroutine**: calling it doesn't run it, it returns an object you `await`. At each `await` on something not ready, the coroutine **parks** and the **event loop** runs another ready task. One thread, one task running at a time, switching **only at `await`**."),
    F("concLoop"),
    L("Task: a coroutine scheduled on the loop with `asyncio.create_task`; it runs while you do other things.",
      "gather: run many and wait for all, results in input order.",
      "Semaphore: at most n inside a block at once; the rate limit in code.",
      "wait_for: a timeout around any await; it cancels the inner task when it fires.",
      "to_thread: run a blocking function in a thread and await it, so the loop keeps going.",
      "Cancellation: a cancelled task gets `CancelledError` at its current await; clean up in `finally`.")),
  SEC("cc-async-code", "The code",
    CD("gather", "Many model calls, capped, each with a timeout"),
    CD("to_thread", "A blocking library inside async code"),
    CD("background", "Fire-and-forget without losing the task")),
  SEC("cc-async-pitfalls", "Pitfalls",
    L("Blocking the loop: `time.sleep`, `requests.get`, a long CPU loop or a sync database call inside `async def` freezes every task. Use the async client, `await asyncio.sleep`, or `to_thread`.",
      "Forgetting await: `fetch(k)` without `await` returns a coroutine that never runs (Python warns 'never awaited').",
      "Unbounded gather: 10,000 tasks at once means 10,000 open sockets and a burst past the rate limit. Cap with a `Semaphore`.",
      "Lost tasks: the loop keeps only a weak reference to a task; an unreferenced one can be garbage-collected mid-run. Keep it in a set.",
      "One failure in gather: without `return_exceptions=True` the first error propagates and the others carry on unobserved; use it, or a `TaskGroup`, deliberately.",
      "Shared work and timeouts: a timeout cancels what it waits on; `asyncio.shield` protects a load that other callers share.",
      "Races still exist: no data races on one thread, but check-then-act across an `await` is a race.")),
  SEC("cc-async-where", "Where it shows up",
    L("Fanning out to a model API: many prompts, a semaphore per provider limit, a timeout each.",
      "Streaming: tokens over server-sent events, audio frames over a WebSocket in a voice agent, all on one loop.",
      "API servers: FastAPI and uvicorn serve thousands of waiting requests on one thread per process.",
      "Agents calling several tools at once: independent tool calls gathered instead of awaited one by one.",
      "At a team like Mercor: grading thousands of answers with a model judge under the provider's rate limit, or calling many customer APIs per agent turn.",
      "The same model elsewhere: Node and Deno are one event loop too; `Promise.all` is `gather`."),
    SAY("asyncio is **one thread and an event loop**: each task runs until it **awaits**, then the loop runs another. It's the best fit for **many network waits**, like model calls, with a **Semaphore for the rate limit** and **a timeout on each**.",
        "The trap is **one blocking call**: it freezes **every** task, so blocking libraries go through **`to_thread`**."))),

PART("cc-procs", 4, "Processes and multiprocessing", 8,
  "Separate Pythons with their own memory and GIL: real parallel computing, paid for in start-up, pickling and memory.",
  SEC("cc-pool", "How a process pool works",
    P("A **process** is a whole separate Python: its own memory and its own GIL, so several compute **truly in parallel** on several cores. Nothing is shared by default: the pool **pickles** each argument to a worker and each result back."),
    F("concPool"),
    P("How workers start: **spawn** starts a fresh interpreter and re-imports your module (the default on Windows and macOS); **fork** copies the parent (the old Linux default); Python 3.14 moved Linux to **forkserver**. Under spawn your script **must** guard its entry point with `if __name__ == \"__main__\":`.")),
  SEC("cc-proc-code", "The code",
    CD("process_pool", "CPU work across every core")),
  SEC("cc-proc-pitfalls", "Pitfalls",
    L("Pickling cost: sending big objects can cost more than the work. Send ids or file paths and load inside the worker; `chunksize` batches small items.",
      "Start-up and memory: each worker is a full interpreter. Use a pool, created once, not a process per task.",
      "No shared state: a global changed in a worker isn't seen by the parent. Return results, or share on purpose (a `Queue`, `shared_memory`).",
      "What can't be pickled: lambdas, local functions, open connections. Make worker functions top-level; open connections inside the worker.",
      "Missing `__main__` guard: under spawn, each worker re-runs your top-level code; without the guard it tries to start pools of its own.",
      "Fork after threads: forking a process that has threads can copy a held lock and hang. Prefer spawn or forkserver.",
      "More workers than cores: only adds switching. Default to the core count.")),
  SEC("cc-proc-where", "Where it shows up",
    L("Document work: parsing PDFs, OCR, chunking and tokenising before embedding.",
      "Scoring and preprocessing: rule-based graders, feature extraction, data cleaning over large batches.",
      "Serving: gunicorn or `uvicorn --workers N` runs N processes so one API uses every core.",
      "At a team like Mercor: preparing large batches of expert-written data or customer documents, with a pool per machine and a queue across machines."),
    SAY("Processes are the way to **use more than one core for Python code**: each has **its own interpreter and GIL**. The cost is at the borders, **start-up and pickling**, so I use **a pool created once**, send **small arguments like ids or paths**, and do the heavy work inside."))),

PART("cc-mix", 5, "Mixing them, and the pitfalls in one place", 6,
  "Real systems combine them: async for the calls, threads for blocking libraries, processes for the heavy work, a queue across machines.",
  SEC("cc-mixed", "One system, three models",
    P("An evaluation run is a good example: thousands of **model calls** (waiting) and a **grade** for each answer (computing). The loop handles the calls under a semaphore; each grade goes to a **process pool** with `run_in_executor`, so the loop never blocks."),
    CD("mixed", "An eval runner: model calls on the loop, grading in processes"),
    L("API server: an async framework, in one worker process per core.",
      "Model calls: asyncio, a semaphore per provider, timeouts, retries with backoff and jitter.",
      "Blocking SDKs: `to_thread` or a small thread pool.",
      "Heavy Python work: a process pool, or a separate worker service.",
      "Across machines: a queue, workers that claim jobs, idempotent handlers so a retry is safe.")),
  SEC("cc-pitfalls", "Symptoms, causes and fixes",
    T(["You see", "Likely cause", "Fix"],
      ["Every request slows down together", "A blocking call on the event loop", "Async client, `to_thread`, or move the work out"],
      ["Adding threads doesn't speed it up", "The work is Python computation; the GIL serialises it", "A process pool"],
      ["A counter or balance is sometimes wrong", "Unlocked read-modify-write", "A lock around the whole update"],
      ["The program hangs with no error", "Deadlock: locks taken in different orders", "One lock order, or fewer locks"],
      ["429s from the provider in bursts", "Unbounded `gather` or too many threads", "A semaphore, or a shared rate limiter"],
      ["Process pool slower than one process", "Pickling big arguments, or tiny tasks", "Send ids, use `chunksize`, batch the work"],
      ["RuntimeError about starting a process before bootstrapping", "No `__main__` guard under spawn", "Guard the entry point"],
      ["A background task never finished", "Its task was garbage-collected, or never awaited", "Keep a reference; await or gather it"]),
    SAY("In practice I mix them: **asyncio for the model and API calls** with a **semaphore and timeouts**, **to_thread for blocking libraries**, a **process pool for heavy Python**, and a **queue with workers** once it's more than one machine.",
        "And the symptom tells me which bug: **everything slow together** is a blocked loop; **threads not helping** is the GIL; **wrong totals** is a missing lock."))),
]

js = ("/* Concurrency guide: threads, asyncio and processes. Generated by coding/concurrency/gen.py from snippets.py "
      "(every block runs there); edit those, not this file. */\n"
      "window.CONCURRENCY = " + json.dumps({"parts": parts}, ensure_ascii=True, indent=1) + ";\n")
io.open(OUT, "w", encoding="utf-8", newline="\n").write(js)
print("wrote", OUT, len(js))
