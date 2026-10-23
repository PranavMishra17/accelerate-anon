"""Generate interviews/coding/mercor-mock.js (run: python interviews/coding/mercor_mock/gen.py; the code is checked by mercor_code.py): the simulated Mercor caching screen for the Mocks tab.
The call runs as the real 30 minutes would: opening, his caching work, a Mercor scenario with probes (or a snippet),
Python and proof, wrap-up. Each move is a `turn`. Answers about alfred_ internals come from private/loops/mercor.js
(`priv`), his intro and questions from Prep (`from`, `fromAsk`). Nothing private is written here."""
import json, io
from mercor_code import CODE  # the better code, tested by mercor_code.py
def C(name, title): return {"title": title, "code": CODE[name]}

import os
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "mercor-mock.js")

def TURN(ask, check=None, say=None, more=None, vis=None, avoid=None, **kw):
    t = {"t": "turn", "ask": ask, "check": check or [], "say": say or []}
    if more: t["more"] = more
    if vis: t["vis"] = vis
    if avoid: t["avoid"] = avoid
    t.update(kw)
    return t
def PROBE(ask, check=None, say=None, **kw): return TURN(ask, check, say, probe=True, **kw)
def P(text): return {"t": "p", "text": text}
def SEC(i, title, *blocks): return {"id": i, "title": title, "blocks": list(blocks)}

SNIPPET = ("cache = {}\n\n"
           "def get_price(product_id):\n"
           "    if product_id in cache:\n"
           "        return cache[product_id]\n"
           "    price = pricing_client.fetch(product_id)\n"
           "    cache[product_id] = price\n"
           "    return price")

parts = []

# ---------------------------------------------------------------- 1. the bridge
parts.append({"tab": "mocks", "id": "mock-bridge", "n": 1, "title": "Your notes, said out loud", "minutes": 15,
  "lead": "Each concept from your handwritten notes, as the failure it causes and the one line you would say.",
  "sections": [
    SEC("mock-bridge-map", "Concept to failure to sentence",
        {"t": "bridge", "rows": [
          ["Stampede", "A popular entry is missing; 50 requests miss together and all call the backend.", "**Coalesce:** one request loads, the rest **wait on its result**."],
          ["Avalanche", "Entries filled together with one TTL **expire together**; the backend takes all of it.", "**Jitter the TTLs** and **cap concurrent loads**."],
          ["Penetration", "Ids that don't exist **always miss** and always hit the backend.", "Cache **'not found' briefly**, or check a **Bloom filter**."],
          ["TTL", "Nothing expires, so a changed value is **served forever**.", "A TTL **bounds staleness**; pick it from **how stale is allowed**."],
          ["Read-after-write", "Someone edits a value and **still sees the old one**.", "**Invalidate on write** for paths that need it."],
          ["Replication lag", "Delete, then refill from a **lagging replica**: the old value is back.", "Refill **from the primary**, or **version** the value."],
          ["Hot key", "One item takes most traffic; **its miss is the outage**.", "**Single-flight** plus **refresh before expiry**."],
          ["Eviction", "The dict **grows until the process dies**.", "**Bound it** and evict **LRU**."],
          ["Power law", "'Let's cache everything.'", "A **small LRU** gets **most of the hits**."],
          ["Key design", "The value depends on the caller; the key is only the id: **one user sees another's data**.", "The key holds **everything the value depends on**."],
          ["Write patterns", "Who fills and who freshens the cache.", "**Cache-aside** by default; **write-through** helps freshness, **write-behind** can lose writes."],
          ["Where to cache", "Four instances, **four separate copies**.", "In-process is **fastest but drifts**; Redis is **shared but a hop and a new failure**."],
          ["Proactive refresh", "Every expiry costs **one user a slow request**.", "**Serve stale while one request refreshes.**"],
        ]}),
  ]})

# ---------------------------------------------------------------- 2. the call
call = []

call.append(SEC("mock-open", "Opening",
  P("**Minutes 0 to 4.** Sophie introduces herself and the format, then asks about you. Keep the intro to 45 seconds; the screen is about caching."),
  TURN("Hi Pranav, I'm Sophie, an Applied AI Engineer on the Enterprise team. This is about thirty minutes and conversational: I'll ask about your experience with caching, then we'll talk through a scenario and see where it goes. No code today. Sound good?",
       ["Calm, short, ready."],
       ["Sounds good, thanks Sophie. **I'll reason in Python** today, it's what I use day to day.",
        "And I'll **say my assumptions out loud** as I go, so **stop me if any are off**."],
       who="Sophie"),
  TURN("Great. Maybe start by telling me a bit about yourself.",
       ["Can you say who you are and why this role in under a minute?"],
       from_="intro", who="Sophie", avoid="The full history. 45 seconds, then stop and let her steer."),
))

call.append(SEC("mock-exp", "Your caching work",
  P("**Minutes 4 to 12.** Certain to come. She starts from what you have done, then probes two to four times; eight likely probes below. Frame it honestly (no classic cache layer; the caching that matters is the prompt cache), give a number, and name what is missing before she does."),
  TURN("Let's start with you. Tell me about your experience with caching. What have you built or run at alfred_?",
       ["Real production experience, not textbook.", "Numbers, and whether you measured them."],
       priv="exp", who="Sophie",
       avoid="Claiming caches that don't exist (a Redis layer, cached chat answers, hit rates you never measured)."),
  PROBE("How did you measure that?", ["Do you know your own numbers and how they were taken?"], priv="exp-measure"),
  PROBE("What breaks a prompt cache? How is your prompt laid out?", ["Do you understand the mechanism, not only the feature?"], priv="exp-break"),
  PROBE("How did you choose between five minutes and an hour?", ["Trade-offs with numbers.", "Do you know when not to cache?"], priv="exp-ttl"),
  PROBE("You mentioned background workers. What do they cache?", ["Breadth: is this one trick or a practice?"], priv="exp-workers"),
  PROBE("What about the agent itself: loading its code, cold starts?", ["Performance beyond data caching.", "Resource management in a long-lived process."], priv="exp-v8"),
  PROBE("Tell me about the inbox cache. How does it stay fresh, and what happens when two requests miss at the same time?",
        ["Staleness and concurrency on your own system.", "Honesty about gaps."], priv="exp-inbox"),
  PROBE("Why not Redis?", ["Trade-offs, not fashion."], priv="exp-redis"),
  PROBE("If you went back, what would you fix?", ["Self-critique: do you know your system's weak spots?"], priv="exp-gaps"),
))

SCEN = ("Let me give you something closer to what we do. On Enterprise we deploy agents inside a customer's company. "
        "Say an internal support agent: an employee asks a question, and the agent calls a model and a few of the customer's systems, "
        "their ticketing API and their docs search. The ticketing API is slow, 300 ms to 2 seconds, and rate-limited to a few hundred calls a minute. "
        "Usage is growing. How would you think about caching here?")
call.append(SEC("mock-scenario", "A Mercor scenario",
  P("**Minutes 10 to 22.** The core of the call. She sets up a system from their world, asks how you'd approach caching, then follows your answer. The probes below are the likely branches; she will take two or three, in the order your answer opens them."),
  TURN(SCEN,
       ["Do you frame before solving: what's slow, what's expensive, what must never be wrong?", "Clear assumptions."],
       ["Before caching anything I'd want to know **what's slow, what's expensive, and what must never be wrong**. My guess: the **model calls are the cost**, the **ticketing API is the latency and the rate limit**, and what must never happen is **one employee seeing another's data**.",
        "So I'd look at three layers: the **provider's prompt cache** for the agent's long, stable prompt, a **short-TTL cache of tool results** in front of the ticketing API, and I'd be **careful about caching model answers** at all.",
        "Concretely, one question goes: the agent's prompt **ordered stable to volatile** so the provider reuses it; each ticketing call through a cache **keyed by tenant, permissions and arguments**, with **single-flight** so a popular ticket is fetched once, and a **rate limiter shared by every worker** so we never burn the customer's quota; docs search results cached **longer**, because docs change slowly. And I'd **measure first**: calls per question, how many repeat within a minute, and how close we run to the quota.",
        "The trade-off I'd keep in view is **freshness against quota and cost**: a ticket's status wants seconds, its title can live for hours, and anything the agent **acts on** is read live."],
       vis=[{"title": "One question, the caching layers", "flow": ["Employee asks", "Agent: prompt cache (provider)", "Tool cache: tenant + scope key", "Single-flight + shared limiter", "Ticketing API, docs search"],
             "note": "The prompt cache cuts cost on every model call; the tool cache cuts latency and quota; the limiter protects everyone else's requests."}],
       more=["Ask: how fresh must ticket status be? One deployment per customer, or shared? How many workers? Does the ticketing system send webhooks?",
             "Then commit: 'I'll assume shared workers, a few minutes of staleness is fine for most fields, no webhooks yet.'"],
       who="Sophie", avoid="Jumping to Redis, or caching the model's answers, in the first minute."),
  PROBE("What exactly would you cache from the ticketing API, and what's the key?",
        ["Key design and multi-tenant safety: the Mercor-specific trap."],
        ["Reads that are **asked often and change slowly**: a ticket's details, a user's open tickets, docs search results. **Never writes**, and nothing the agent uses to **act**, like closing a ticket.",
         "The key holds **everything the answer depends on**: **tenant, the caller's permission scope, the normalised arguments, and the API version**. Leave out the permission scope and **the cache becomes a data leak**: a manager's view served to an intern."],
        more=["Normalise arguments (sorted, trimmed, lowercased) or the hit rate collapses on trivial differences.",
              "Per-user keys kill the hit rate; if the API's permissions are role-based, key on the role or group instead.",
              "Hash long arguments; keep the tenant id readable at the front for deletes and metrics."],
        avoid="Keying on the URL or the ticket id alone."),
  PROBE("Would you cache the model's responses?",
        ["Do you know when an LLM cache is wrong?"],
        ["**Exact-match only, and only where the answer is deterministic**: same model version, same prompt, same tool results, temperature zero. That's great for **re-running evals**: the same input costs nothing the second time.",
         "For live users I'd **avoid a semantic cache** by default: a near-duplicate question with a **different ticket behind it gets a confident wrong answer**. The **safe win is the provider's prompt cache**: same answer, cheaper prefix."],
        more=["Key: model id and version, a hash of the system prompt, the tool schemas and the full context. A prompt change then invalidates by itself.",
              "Prompt cache: order the prompt stable to volatile; a timestamp near the top breaks it.",
              "If they push on semantic caching: only for questions with no per-user context, with a high threshold, and measured against a judge."],
        avoid="'Embed the question and return the nearest cached answer' with no word on correctness."),
  PROBE("There's an outage. Two hundred employees ask about the same incident ticket in the same minute. What happens?",
        ["Concurrency: stampede against a quota.", "Do you see that several workers share one rate limit?"],
        ["Without care, **every request misses and calls the ticketing API**: we burn the **rate limit on one ticket**, and everything else starts getting 429s. A **stampede against a quota**.",
         "So **single-flight per key**: one call per ticket, everyone else waits on it. And with **several workers, the rate limit has to be shared**: a token bucket in Redis, or one gateway that owns the API, so twenty workers **don't each think they have the whole quota**."],
        more=["Never hold a lock across the API call: lock to register, release, call, lock to store.",
              "If the load fails, wake the waiters with the error and remove the in-flight entry.",
              "Interactive requests before batch ones when the quota is tight.",
              "Stale-while-revalidate keeps the hot ticket served while one request refreshes."],
        vis=[{"title": "Two hundred asks, one ticket", "lanes": [
               ["No coalescing", [["200 misses", "hot", "1"], ["200 API calls", "hot", "3"], ["quota gone, 429s", "hot", "2"]]],
               ["Single-flight", [["200 misses", "plain", "1"], ["1 API call, 199 wait", "done", "3"], ["quota left", "done", "2"]]]]}],
        avoid="'Add a lock.' Which lock, around what, held for how long."),
  PROBE("The incident gets resolved, but the agent keeps telling people it's still open. Why, and what do you do?",
        ["Staleness with a concrete fix, not 'lower the TTL'."],
        ["Because we served a **cached status inside its TTL**. If the ticketing system has **webhooks, invalidate on the status-change event**; if not, a **short TTL for status, longer for slow fields** like the title.",
         "For anything the agent **acts on, read through, not from cache**. And when it answers from cache it can say **'as of two minutes ago'**, so a stale answer is at least honest."],
        more=["Webhooks get lost: keep the TTL as a backstop.",
              "If the API supports conditional requests (ETag, updated_at), revalidate cheaply instead of refetching.",
              "Split fields by how often they change; one TTL for the whole ticket is the wrong grain."]),
  PROBE("The ticketing API goes down for ten minutes.",
        ["Reliability: timeouts, degradation, not making recovery worse."],
        ["**Timeouts on every call** first, so requests don't pile up. Then **serve the last good value with its age**, past its TTL, and a **circuit breaker** so we stop calling a dead API.",
         "What I would **not** do is **cache the error as if it were data**, or retry without **backoff and jitter**: when it comes back, we'd hit it with **ten minutes of retries at once**."],
        more=["Soft TTL (refresh) and hard TTL (still servable when the source is down).",
              "A 404 can be cached for a few seconds on purpose (negative cache); a 500 never by accident.",
              "The agent should say the system is unreachable rather than guess."],
        vis=[{"title": "Retries after an outage", "lanes": [
               ["No jitter", [["fail", "hot", "1"], ["all at 1 s", "hot", "1"], ["all at 2 s", "hot", "1"], ["all at 4 s", "hot", "1"]]],
               ["Full jitter", [["fail", "hot", "1"], ["spread 0 to 1 s", "done", "2"], ["spread 0 to 2 s", "done", "3"]]]]}]),
  PROBE("Memory on the workers keeps climbing over the week.",
        ["Resource management in your language."],
        ["Probably an **unbounded cache, or an in-flight map that never shrinks**. Tool results and model responses **vary a lot in size**, so I'd bound by **bytes, not entry count**, evict LRU, and **remove in-flight entries on success and on failure**.",
         "The other resources are **connections and the quota**: a **bounded HTTP pool and a semaphore per API**, so a burst of misses **queues instead of exhausting** sockets or threads."],
        more=["Watch entries, bytes and evictions, per tenant.",
              "`functools.lru_cache` counts entries, not bytes, and has no TTL."],
        vis=[{"title": "Rough size", "calc": [["20 KB per tool result x 50,000", "about 1 GB per worker"], ["bound by bytes", "a 200 MB budget, LRU inside it"]]}]),
  PROBE("We go from five customers to two hundred.",
        ["Growth: multi-tenant fairness, shared vs local."],
        ["Then it's **fairness between tenants**: one big customer **can evict everyone else's hot keys**, so keys are **namespaced by tenant** with a **quota each** in the shared cache. And a **per-tenant delete**: when a customer leaves, **their cached data goes with them**.",
         "Per-process caches stop being enough: twenty workers is **twenty copies and twenty cold starts**, so a **shared Redis tier** behind a **small local LRU** for the hottest keys."],
        more=["Coalescing across processes: a short lock with SET NX and an expiry.",
              "Hit rate and served age per tenant, or one tenant's bad TTL hides in the average."],
        vis=[{"title": "Two levels", "flow": ["Request", "Local LRU (seconds)", "Redis, per tenant (minutes)", "Ticketing API"],
              "note": "Each level absorbs most of what the next would see; invalidation must reach both."}]),
  PROBE("If you had a week, what would you build first?",
        ["Priorities with reasons, not a list."],
        ["**Prompt structure first**: the cheapest win, and it changes no behaviour. Then the **tool-result cache with the right key and a short TTL**, plus **single-flight and a shared rate limiter**, because that's where an outage hurts. **Model-response caching last**, and only for evals.",
         "And from day one, **metrics per tenant**: hit rate, **the age of what we serve**, 429s from the customer's API. **I'd want those numbers before tuning any TTL.**"]),
))

call.append(SEC("mock-code", "If she shows code instead",
  P("**Same minutes, a different opening.** Instead of the scenario she may read out or share a snippet and ask what you think. The same ideas, on a dict cache in front of a slow pricing service."),
  {"t": "code", "id": "mock-snippet", "title": "A cache in front of a slow pricing service (read out or shown, never written)", "code": SNIPPET,
   "notes": {"1": "A plain dict: no bound, no expiry, shared by every thread.",
             "4": "Check, then set later: concurrent requests collide in the gap.",
             "6": "The slow, flaky call (200 ms, sometimes 2 s, sometimes fails).",
             "7": "Stores whatever came back, forever, under a key that may be missing fields."}},
  TURN("Here's a function someone wrote. The pricing service is slow, around 200 ms, sometimes 2 seconds, and it sometimes fails. What do you think?",
       ["Do you frame before diving in?"],
       ["So it's a **cache-aside in front of a slow, flaky dependency**, in memory, per process.",
        "I'll go **correctness first, then concurrency, memory, failures, and growth**. For one process and a stable catalogue it's fine; **the problems come with concurrency, change and time.**"],
       who="Sophie", avoid="Listing ten bugs in the first minute."),
  PROBE("Leave load aside. Is it correct?",
        ["Concrete failures, not adjectives."],
        ["Not quite. **Nothing ever expires**, so when a sale ends we **keep showing the sale price** until a restart.",
         "The key is only the product id, so if price depends on currency, **the first caller's currency wins for everyone**. And if we store an error, **we serve the failure forever**."],
        more=["Fix: a TTL from the freshness requirement; a key with everything the value depends on; only store successes; invalidate on write where read-after-write matters."],
        code=C("correct", "The better version: a TTL, the full key, errors never stored"),
        vis=[{"title": "Read-after-write with replication lag", "lanes": [
               ["Admin", [["write to primary", "done", "2"], ["delete entry", "done", "1"], ["", "gap", "3"]]],
               ["Reader", [["", "gap", "3"], ["miss: read replica (old)", "hot", "2"], ["store old", "hot", "1"]]]],
              "note": "The refill reads a lagging replica and puts the old value back."}]),
  PROBE("A hundred requests for the same product arrive in the same second, and it's not cached yet.",
        ["Do you see the race, and fix it at the right grain?"],
        ["**All hundred check, all miss, and all call pricing.** Check-then-act with a slow call in the gap: a **stampede**.",
         "**Single-flight**: the first request **starts the load**, the other ninety-nine **wait on that same result**. **One call instead of a hundred.**"],
        more=["Threads: a dict of Futures under a small lock. asyncio: a dict of Tasks."],
        code=C("singleflight", "The better version: single-flight with threads (a Future per key in flight)")),
  PROBE("Why not one lock around the whole function?",
        ["Do you know what a lock across I/O costs?"],
        ["It's correct, but it **serialises everything**: with a 200 ms call, **about five lookups a second** for the whole process, and one 2-second call **blocks every product**.",
         "**Lock to check and register, release, call outside the lock**, lock again to store. **Never hold a lock across a network call.**"],
        vis=[{"title": "One global lock across the call", "calc": [["one call", "200 ms"], ["one at a time", "about 5 per second"], ["one slow call", "2 s, everyone waits"]]}],
        code=C("globallock", "The version to avoid: correct, and serial. The fix is the single-flight code two answers up")),
  PROBE("It runs for a week. What happens to memory?",
        ["Resource management."],
        ["**The dict only grows**, so it **grows until the process is killed**. **Bound it with an LRU and a TTL**: at about **1 KB an entry, 100,000 entries is about 100 MB**.",
         "And **cap concurrent loads** with a semaphore, so a burst of misses **can't exhaust connections or threads**."],
        code=C("lru", "The better version: bounded LRU with expiry, and a cap on calls in flight")),
  PROBE("Pricing goes down for two minutes. And then we go from one instance to twenty.",
        ["Failure, then growth, in one breath."],
        ["**Timeouts**, then **serve the last good price** if a minute old is fine, retries **with backoff and jitter**, and a **breaker**. Never **cache the error**.",
         "At twenty instances it's **twenty copies and twenty cold caches** per deploy, so a **shared Redis** with a **small local cache** in front, once the numbers say so."],
        code=C("stale", "The better version: timeouts, retries with jittered backoff, stale served when pricing is down")),
  PROBE("Say this service is asyncio. How does your fix change?",
        ["Python concurrency, precisely."],
        ["**One thread, so no data race on the dict**, but the **check and the load still race** if there's an await between them. So a **dict of Tasks**: the first miss creates the task, everyone else **awaits the same one**.",
         "And I'd **shield** it, so **one caller timing out doesn't cancel the load** for the other forty-nine."],
        code=C("async", "The asyncio version: a Task per key, shielded")),
  PROBE("After a deploy, every instance fills its cache at once, and an hour later the pricing service falls over. Why?",
        ["Do you know the avalanche?"],
        ["Everything was **filled together with the same TTL**, so it **expires together**: one burst of misses an hour later. That's a **cache avalanche**.",
         "**Jitter the TTL**, plus or minus ten percent, so expiries **spread out**. The **semaphore** caps what's left of the burst."],
        code=C("jitter", "The fix: a TTL with jitter")),
  PROBE("Bots are requesting product ids that don't exist. Every one goes to pricing.",
        ["Cache penetration, and a safe fix."],
        ["A miss for something that **doesn't exist is never stored**, so it **always reaches the backend**: **cache penetration**.",
         "**Cache the 'not found' briefly**, say thirty seconds, with a **marker that can't be confused with a price**. If the ids are random, a **Bloom filter of real ids** rejects them before the cache."],
        code=C("negative", "The fix: a short negative cache")),
  PROBE("An admin changes a price and immediately sees the old one.",
        ["Read-after-write, and invalidation order."],
        ["The cache doesn't know the source changed, so it serves the old price **until the TTL**. For a path that needs **read-after-write**, **invalidate on write**: **write the source first, then delete** every entry that depends on it.",
         "Delete, don't update: a **delete is safe to repeat**, and the next read fills the **current** value. If replicas lag, the refill should read **the primary**."],
        code=C("invalidate", "The fix: write the source, then drop the entries")),
  PROBE("How would you prove the stampede fix works?",
        ["Testing concurrency."],
        ["**Fifty threads, one missing key**, a **fake client that counts calls and sleeps** to widen the race: assert **one call, fifty equal results**.",
         "Then a failing fake: **everyone gets the error**, the in-flight entry is **cleared**, and the **next call retries**."],
        code=C("test", "The test")),
))

call.append(SEC("mock-python", "Python and proof",
  P("**Minutes 22 to 26.** The brief says 'in your preferred language', so expect a Python question or two, then how you'd know it works. Each comes with a probe."),
  TURN("You said Python. For this service, threads or asyncio?",
       ["Concurrency model, with the reason."],
       ["It's **I/O-bound**: waiting on the model and the API. So **asyncio** fits: thousands of waiting requests on one thread, cheaply. Threads work too, but **each waiting request holds a thread**.",
        "Either way **the race doesn't go away**: in asyncio, **check-then-set across an await** is still a race, so I'd coalesce with a **dict of Tasks**, and **shield** the shared load so one caller's timeout doesn't cancel it for everyone."],
       who="Sophie"),
  PROBE("Is a Python dict thread-safe?", [],
        ["**One get or set is atomic** in CPython; **check-then-set is not**. The race is **between** operations, so you still need a lock or a single-flight map."]),
  PROBE("Why not just use functools.lru_cache?", [],
        ["It's **bounded but has no TTL**, it **doesn't coalesce** concurrent misses, and on a method it **keeps self alive**.",
         "On an **async function it caches the coroutine object**, which can only be awaited once, so the second caller gets an error."]),
  TURN("How would you know the cache is actually working?",
       ["Measurement, and the metric people forget."],
       ["**Hit rate per key type**, **load on the backend**, **p50 and p99**, **evictions**, and the **age of the values we serve**.",
        "The last one is the one people forget: **a 99 percent hit rate on data an hour stale** is a bug, not a win."],
       who="Sophie"),
  PROBE("How would you test the stampede fix?", [],
        ["**Fifty concurrent callers on one missing key**, against a fake client that **counts calls and sleeps**: assert **one call and fifty equal results**.",
         "Then make the fake fail and assert **everyone gets the error and the next request retries**."]),
))

call.append(SEC("mock-wrap", "Wrap-up",
  P("**Minutes 26 to 30.** She wraps up and hands you the floor. One closing thought, one or two questions, a warm close."),
  TURN("That's most of what I had. Anything you'd add to what you said?",
       ["A crisp takeaway."],
       ["One thing: **the cache key is where correctness lives**. In a multi-tenant system I'd **review every key** before I'd tune a single TTL."],
       who="Sophie"),
  TURN("What questions do you have for me?", ["Interest in their real problems."], fromAsk="sophie", who="Sophie"),
  TURN("Thanks, Pranav. The recruiter will be in touch about next steps.", [],
       ["Really appreciate you taking the time today. This was helpful \u2014 honestly, the more I hear about what the team is working on, the more excited I am about the fit. Looking forward to hearing about next steps whenever you have them."],  # verbatim, INTRO.md closing
       who="Sophie"),
))

exec(io.open(os.path.join(HERE, 'explain.py'), encoding='utf-8').read())
# `from` is a Python keyword; the generator spells it from_.
for sec in call:
    for b in sec["blocks"]:
        if "from_" in b: b["from"] = b.pop("from_")

parts.append({"tab": "mocks", "id": "mock-call", "n": 2, "title": "The call, simulated", "minutes": 75,
  "lead": "Held on 23 October: what was actually asked, what you said and what to keep is on the Rounds tab. The thirty minutes as they were expected to run: opening, your caching work, a scenario from Mercor's world with probes, Python and proof, wrap-up. One phase at a time.",
  "sections": call})

# ---------------------------------------------------------------- 3. curveballs
curve = [
  ("Single-flight or stale-while-revalidate?", "Single-flight stops the herd **on a miss**; stale-while-revalidate stops users waiting **on an expiry**. For hot keys, **both**."),
  ("LRU or LFU?", "**LRU is cheap and fits skewed traffic**; LFU protects long-term favourites from one-off scans but needs ageing. **Start LRU, measure.**"),
  ("How do you pick a TTL?", "From **how stale is allowed** and **what a miss costs**: short for status, long for names. **Add jitter.**"),
  ("Cache-aside or write-through?", "Cache-aside **caches only what's read**; write-through **keeps it fresh** but caches unread data and slows writes. For a few read-after-write paths, **invalidate on write**."),
  ("What is cache penetration?", "Keys that **never exist always reach the backend**. Cache **'not found' briefly**, or a **Bloom filter** of real ids."),
  ("What is a cache avalanche?", "Many keys **expire at the same moment**, usually filled together after a deploy. **Jitter the TTLs** and **cap concurrent loads**."),
]
parts.append({"tab": "mocks", "id": "mock-curve", "n": 3, "title": "Curveballs", "minutes": 10,
  "lead": "Short questions that may come in between. Twenty seconds each.",
  "sections": [SEC("mock-curve-all", "If they ask", *[TURN(q, [], [a]) for q, a in curve])]})

# ---------------------------------------------------------------- 4. scoring and plan
parts.append({"tab": "mocks", "id": "mock-plan", "n": 4, "title": "How it is scored, and your plan", "minutes": 10,
  "lead": "Mercor's own words, what earns them, and how to spend the hours before 6 PM tomorrow.",
  "sections": [
    SEC("mock-score", "Their words, and what earns them",
        {"t": "bridge", "head": ["They said", "Weak", "Strong"], "rows": [
          ["Clear assumptions", "Asks endless questions, or none.", "States **three or four** and **commits** out loud."],
          ["Concrete failures", "'There could be race conditions.'", "'**Two hundred requests miss at once and burn the rate limit.**'"],
          ["Correctness, performance, reliability", "Only performance.", "**All three, in an order said up front.**"],
          ["Growth and concurrency", "Jumps to Redis with no reason.", "**Stampede, lock scope, per-process copies, tenants**, then shared cache."],
          ["Trade-offs in improvements", "Every fix at once.", "**Each fix with its cost, in priority order.**"],
          ["Resources in your language", "'Memory is cheap.'", "**Bounded memory, connection caps, timeouts**, Python specifics."],
        ]}),
    SEC("mock-hours", "Your plan",
        {"t": "bridge", "head": ["When", "What", "Time"], "rows": [
          ["Today", "Part 2 phase by phase, answers shown. **Say each sheet out loud once.**", "**75 min**"],
          ["Today", "Your caching work: say it **three times, timed to 90 seconds**", "**15 min**"],
          ["Today", "Part 2 again with **Try first**: answer before you open each sheet", "**45 min**"],
          ["Tomorrow morning", "Say **'run the Mercor mock'** in chat: live, 30 minutes, critique after", "**45 min**"],
          ["An hour before", "Reread the scenario phase and the curveballs. **Nothing new.**", "**15 min**"],
        ]}),
  ]})

js = ("/* Mercor caching screen, simulated, for the Mocks tab. 22 Oct 2026, from Mercor's description of the screen and the\n"
      "   candidate reports in wc32 to wc34. Conversational, no coding. Answers about alfred_ come from private/loops/mercor.js.\n"
      "   Generated by interviews/coding/mercor_mock/gen.py; edit that, not this file. */\n"
      "window.LOOP_CODING = window.LOOP_CODING || { parts: [] };\n")
for p in parts:
    js += "window.LOOP_CODING.parts.push(" + json.dumps(p, ensure_ascii=True, indent=1) + ");\n"
io.open(OUT, "w", encoding="utf-8", newline="\n").write(js)
print("wrote", len(js))
