
# What each answer means, keyed by the start of the interviewer's line. Shown under the dark sheet, never folded.
EXPLAIN = {
"Hi Pranav, I'm Sophie": [
  "Why say Python now: the brief says 'resource management in your preferred language'. Naming it early means her Python questions meet your strongest language.",
  "Why promise assumptions out loud: 'clear assumptions' is one of the four things the brief says they score. Saying it up front tells her you know the rubric.",
],
"Great. Maybe start by telling me": [
  "Why short: the screen is 30 minutes on caching. The intro earns the first question; the caching answer earns the round.",
],
"Let me give you something closer": [
  "Slow, expensive, must never be wrong: three different reasons to cache, each pointing at a different layer. Latency points at the ticketing API, cost at the model calls, correctness at the data each user may see.",
  "Model calls are the cost: every agent step re-sends instructions and tools, thousands of tokens, to the model. That's where the money goes.",
  "Ticketing API is the latency and the rate limit: 300 ms to 2 s per call, and only a few hundred calls a minute shared by all users. A cache here saves time and quota.",
  "One employee seeing another's data: a multi-tenant agent serves many companies and many people in each. A cache shared by mistake is a data leak, the worst failure here.",
  "Provider's prompt cache: the model provider reuses an identical prompt prefix at about a tenth of the price. Order the agent's prompt stable to volatile and it pays off with no staleness risk, since the answer is computed fresh.",
  "Short-TTL cache of tool results: store what the ticketing API returned for a few seconds to minutes, so repeated questions don't spend calls.",
  "Careful about caching model answers: reusing an answer is only right if every input behind it is the same. Here the inputs include live tickets, so it's rarely safe.",
  "Keyed by tenant, permissions and arguments: the cache key names everything the result depends on, so two companies, or two people with different access, never share an entry.",
  "Single-flight: when many requests miss the same key at once, one calls the API and the rest wait for its result.",
  "Rate limiter shared by every worker: the customer's quota is one number for all our workers, so the count lives in one place (Redis or a gateway), not in each process.",
  "Docs search cached longer: documentation changes on the scale of days, so its search results can live for hours; ticket status changes in minutes.",
  "Measure first: calls per question says how much a cache could save; repeats within a minute says what hit rate to expect; distance to the quota says how urgent the limiter is.",
  "Freshness against quota and cost: every second of TTL saves calls and risks staleness. Choose per field, and never serve cached data to an action.",
],
"What exactly would you cache from the ticketing API": [
  "Asked often, change slowly: the best cache candidates. A ticket's title, a user's open tickets, docs search results.",
  "Never writes: a write must reach the source. Caching it would mean the agent thinks something happened that didn't.",
  "Nothing the agent uses to act: if the agent closes or reassigns a ticket based on its status, it must read the live status. Acting on a stale value does real damage.",
  "Tenant: which customer company. Two companies can have a ticket 123; without the tenant in the key they'd share an entry.",
  "Caller's permission scope: what this user is allowed to see. A manager and an intern asking for 'my team's tickets' get different answers from the API; the key must keep them apart.",
  "Normalised arguments: the same query written differently ('Open', 'open ') should hit the same entry. Sort, trim, lowercase before building the key.",
  "API version: if the customer's API changes its response shape, old entries must not be read by new code.",
],
"Would you cache the model's responses": [
  "Exact-match: reuse an answer only when the whole input is byte for byte the same.",
  "Deterministic: at temperature zero, with the same model version and the same prompt, the model gives (nearly) the same answer, so reusing it is safe.",
  "Re-running evals: an evaluation replays the same cases many times while you change other things. Caching unchanged cases saves money and makes runs repeatable.",
  "Semantic cache: returns a stored answer for a question that's similar, not identical, matched by embeddings. Fast and cheap, but 'is incident 41 resolved?' and 'is incident 14 resolved?' look alike and need different answers.",
  "Confident wrong answer: the danger is that a reused answer reads as authoritative. Nobody can tell it came from someone else's question.",
  "Same answer, cheaper prefix: the prompt cache doesn't change the output at all, only the cost of reading the prompt. That's why it's the safe win.",
],
"There's an outage. Two hundred employees": [
  "Every request misses: the ticket wasn't cached yet, so all 200 check, find nothing, and call the API at once.",
  "429: the HTTP status for 'too many requests'. Once the quota is spent, every other call from every user fails until it refills.",
  "Stampede against a quota: a cache stampede normally overloads a backend; here it also burns a shared budget, so unrelated requests fail too.",
  "Single-flight per key: the first request for a key starts the call and records it as in flight; the others find that record and wait for the same result. One call per ticket.",
  "Shared rate limit: each worker counting its own calls doesn't work; twenty workers each think they have the whole quota. The count must live in one place.",
  "Token bucket in Redis: a counter that refills at the allowed rate; each call takes a token, and with none left the call waits or is refused. In Redis so every worker shares one bucket.",
  "One gateway that owns the API: the alternative, every call to the customer's API goes through one service that enforces the limit and can coalesce duplicates.",
],
"The incident gets resolved": [
  "Cached status inside its TTL: the entry said 'open' and hadn't expired yet, so it was served. The cache did exactly what it was told.",
  "Webhooks: the ticketing system calls our endpoint when a ticket changes. On that event we delete the entry, so the next read is fresh.",
  "Short TTL for status, longer for slow fields: status changes in minutes, a title almost never. One TTL for the whole ticket is either too stale for status or wasteful for the title.",
  "Read through: skip the cache and ask the source, then refresh the cache with the answer. Used before any action.",
  "'As of two minutes ago': the cache stores when it fetched the value, and the agent says it. A stale answer that says its age is honest; one that doesn't is a bug.",
],
"The ticketing API goes down": [
  "Timeouts on every call: without one, a hung API holds each request open indefinitely, and requests pile up until workers run out.",
  "Serve the last good value with its age: keep entries past their TTL (a soft TTL marks them stale, a hard TTL removes them). When the source is down, stale with a timestamp beats an error.",
  "Circuit breaker: after repeated failures, stop calling for a while and fail fast or serve stale; then let one trial request through to see if it's back.",
  "Cache the error as if it were data: storing a failure under the key means every user gets the failure until it expires, even after the API recovers.",
  "Backoff and jitter: wait longer after each failure (backoff) and add a random spread (jitter), so clients don't all retry at the same instant. Without it, recovery is met by a wall of retries.",
],
"Memory on the workers keeps climbing": [
  "Unbounded cache: a dict that only adds. Every new key stays forever, so memory grows with traffic until the process is killed.",
  "In-flight map: the single-flight table of loads in progress. If an entry isn't removed when its load fails, it leaks and the key is stuck.",
  "By bytes, not entry count: one tool result may be 1 KB, another 200 KB. A limit of 10,000 entries can mean 10 MB or 2 GB; a byte budget is what memory actually is.",
  "Evict LRU: when full, drop the least recently used entry. Under skewed traffic the popular entries stay.",
  "Bounded HTTP pool: a fixed number of open connections to the API; more requests wait for one to free up rather than opening thousands of sockets.",
  "Semaphore per API: a counter that allows at most N calls in flight; the rest queue. It turns a burst into a line instead of a crash.",
],
"We go from five customers to two hundred": [
  "Fairness between tenants: in one shared cache, the biggest customer's traffic fills it and evicts small customers' hot entries, so their hit rate collapses.",
  "Namespaced by tenant: every key starts with the tenant id, so entries never collide and you can count, limit or delete per customer.",
  "Quota each: a cap on how much of the shared cache one tenant may use.",
  "Per-tenant delete: when a customer leaves, delete every key with their prefix. Cached customer data is still customer data.",
  "Twenty copies and twenty cold starts: an in-process cache lives in each worker, so twenty workers hold twenty copies, and a deploy empties all of them at once.",
  "Shared Redis tier behind a small local LRU: Redis holds one copy for all workers; a small in-process cache in front keeps the hottest keys a few seconds, saving the network hop.",
],
"If you had a week, what would you build first": [
  "Prompt structure first: reordering the prompt and adding breakpoints costs a day, changes no answers, and cuts cost on every call.",
  "Tool-result cache with the right key: the key decides correctness and safety, so it comes before any tuning.",
  "Single-flight and a shared rate limiter: these are what keep an outage from turning into 429s for everyone.",
  "Model-response caching last: the highest risk of wrong answers and the smallest win once the prompt cache is in place.",
  "The age of what we serve: how old served values are, not only whether they hit. A high hit rate on stale data is a bug.",
],
"Here's a function someone wrote": [
  "Cache-aside: the code checks the cache, and on a miss loads from the source and stores it. The cache is beside the source, filled by the reader.",
  "In memory, per process: a module-level dict. Each process has its own, and a restart empties it.",
  "The order said up front: correctness, concurrency, memory, failures, growth. Saying it shows structure and lets her steer.",
],
"Leave load aside. Is it correct": [
  "Nothing ever expires: no TTL, so the first price fetched is served until the process restarts.",
  "The first caller's currency wins: if the service returns price in the caller's currency but the key is only the product id, the first answer is stored and served to everyone.",
  "Serve the failure forever: if fetch returns an error object and it's stored, every later call gets the error from cache.",
],
"A hundred requests for the same product": [
  "Check-then-act: the code checks 'is it in the cache?' and acts later. Between the two, other requests check too, all see a miss.",
  "Stampede: many simultaneous misses on one key all hitting the backend.",
  "Single-flight: one request loads, the rest wait on its result. In threads, a dict of Futures; in asyncio, a dict of Tasks.",
],
"Why not one lock around the whole function": [
  "Serialises everything: with one lock, only one lookup runs at a time, hits included.",
  "About five lookups a second: 1 second divided by 200 ms per call. The whole process, every product.",
  "Never hold a lock across a network call: the lock should guard the dict for microseconds, not wait on a slow service.",
],
"It runs for a week. What happens to memory": [
  "Grows until the process is killed: every distinct product id adds an entry and none leave.",
  "LRU and a TTL: the LRU bounds how much, the TTL bounds how old.",
  "1 KB an entry, 100,000 entries is about 100 MB: say a number; it shows you sized it.",
],
"Pricing goes down for two minutes": [
  "Serve the last good price: keep expired entries and return them when the refresh fails, if a slightly old price is acceptable.",
  "Breaker: stop calling a failing service for a while, then probe.",
  "Twenty cold caches per deploy: all instances restart together and all miss together.",
],
"You said Python. For this service": [
  "I/O-bound: the time goes to waiting on the network, not computing. That's the case asyncio was built for.",
  "asyncio: one thread runs many tasks; while one waits on the network, others run. Thousands of waiting requests cost little memory.",
  "Each waiting request holds a thread: with threads, every blocked call parks a whole OS thread and its stack.",
  "Check-then-set across an await: asyncio switches tasks only at an await. If the check and the set have an await between them, another task can run in the gap and also miss.",
  "Dict of Tasks: the first caller creates a Task for the load and stores it; later callers await the same Task. A Task can be awaited many times; a bare coroutine only once.",
  "Shield: asyncio.shield stops one caller's timeout from cancelling the shared Task that others are waiting on.",
],
"Is a Python dict thread-safe": [
  "Atomic: a single dict get or set can't be interrupted halfway in CPython, so the dict itself won't corrupt.",
  "The race is between operations: 'in' then '[]=' is two operations; another thread can run between them.",
],
"Why not just use functools.lru_cache": [
  "No TTL: entries leave only when evicted by size, never by age.",
  "Doesn't coalesce: two threads missing the same key both call the function.",
  "Keeps self alive: on a method, the cache holds a reference to every instance it was called with, so they're never freed.",
  "Caches the coroutine object: on an async def, lru_cache stores the coroutine, not its result; awaiting it a second time raises an error.",
],
"How would you know the cache is actually working": [
  "Hit rate per key type: one overall number hides a key type that never hits.",
  "Load on the backend: the point of the cache. If hits rise but backend load doesn't fall, something's off.",
  "p50 and p99: typical and worst-case latency. Misses and stampedes show up in p99 first.",
  "Evictions: how often entries are pushed out for space. High evictions mean the cache is too small for the working set.",
  "Age of the values we serve: how stale served data is. The metric that catches a cache that's fast and wrong.",
],
"How would you test the stampede fix": [
  "Fake client that counts calls and sleeps: replaces the real service; the sleep widens the race window, the counter proves how many calls happened.",
  "One call and fifty equal results: the assertion that single-flight works.",
  "Make the fake fail: checks the failure path, everyone gets the error, and the in-flight entry is removed so the next request retries.",
],
"Say this service is asyncio": [
  "No data race on the dict: asyncio runs one task at a time on one thread, switching only at an await, so a single dict operation is never interrupted.",
  "The check and the load still race: if a task checks the cache, then awaits the network, another task runs in that gap, misses too, and starts its own load.",
  "Dict of Tasks: create_task starts the load once and returns a handle many callers can await; there is no await between finding no task and storing one, so no lock is needed.",
  "Shield: wait_for cancels what it waits on when it times out. Without shield, one impatient caller would cancel the shared load for everyone.",
],
"After a deploy, every instance fills": [
  "Cache avalanche: many keys expiring at the same moment, so the backend sees a wall of misses, usually an hour or a TTL after a deploy or a restart.",
  "Jitter the TTL: give each entry a slightly different lifetime (54 to 66 seconds instead of 60), so expiries spread over time.",
],
"Bots are requesting product ids": [
  "Cache penetration: requests for keys that can never exist. Nothing is stored for them, so every one goes through to the backend.",
  "Negative cache: store 'not found' for a short time. Short, because the item might be created soon.",
  "A marker that can't be confused with a price: a unique object, so a real value like 0 or None is never mistaken for 'missing'.",
  "Bloom filter: a compact set of all real ids that answers 'definitely not here' or 'maybe here'. A 'definitely not' skips the cache and the backend entirely.",
],
"An admin changes a price": [
  "Read-after-write: someone who just wrote expects to read their own write. A cache in between breaks that until it expires.",
  "Source first, then delete: if you delete first, a reader can refill the old value from the source before the write lands.",
  "Delete, don't update: writing the new value into the cache can race with an older refill and lose; a delete is idempotent and lets the next read fetch the truth.",
  "The primary: with read replicas, a refill right after a write may read a replica that hasn't caught up, and put the old value back.",
],
"How would you prove the stampede fix": [
  "Widen the race: the sleep keeps the first load in flight long enough that every thread arrives during it. Without it the test could pass by luck.",
  "One call, fifty equal results: the count proves coalescing; equal results prove everyone got the leader's value.",
  "The failure path: the in-flight entry must be removed on failure, or the key is stuck and every later call waits on a dead load.",
],
"That's most of what I had": [
  "The cache key is where correctness lives: most caching bugs (wrong currency, wrong tenant, wrong permissions) are a key missing something the value depends on.",
],
}
for sec in call:
    for b in sec["blocks"]:
        if b.get("t") == "turn":
            for k, v in EXPLAIN.items():
                if b["ask"].startswith(k):
                    b["explain"] = v
missing = [k for k in EXPLAIN if not any(b.get("t") == "turn" and b["ask"].startswith(k) for s in call for b in s["blocks"])]
assert not missing, missing
