/* Mercor caching screen, simulated, for the Mocks tab. 22 Oct 2026, from Mercor's description of the screen and the
   candidate reports in wc32 to wc34. Conversational, no coding. Answers about alfred_ come from private/loops/mercor.js.
   Generated; edit the generator, not this file. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "tab": "mocks",
 "id": "mock-bridge",
 "n": 1,
 "title": "Your notes, said out loud",
 "minutes": 15,
 "lead": "Each concept from your handwritten notes, as the failure it causes and the one line you would say.",
 "sections": [
  {
   "id": "mock-bridge-map",
   "title": "Concept to failure to sentence",
   "blocks": [
    {
     "t": "bridge",
     "rows": [
      [
       "Stampede",
       "A popular entry is missing; 50 requests miss together and all call the backend.",
       "**Coalesce:** one request loads, the rest **wait on its result**."
      ],
      [
       "Avalanche",
       "Entries filled together with one TTL **expire together**; the backend takes all of it.",
       "**Jitter the TTLs** and **cap concurrent loads**."
      ],
      [
       "Penetration",
       "Ids that don't exist **always miss** and always hit the backend.",
       "Cache **'not found' briefly**, or check a **Bloom filter**."
      ],
      [
       "TTL",
       "Nothing expires, so a changed value is **served forever**.",
       "A TTL **bounds staleness**; pick it from **how stale is allowed**."
      ],
      [
       "Read-after-write",
       "Someone edits a value and **still sees the old one**.",
       "**Invalidate on write** for paths that need it."
      ],
      [
       "Replication lag",
       "Delete, then refill from a **lagging replica**: the old value is back.",
       "Refill **from the primary**, or **version** the value."
      ],
      [
       "Hot key",
       "One item takes most traffic; **its miss is the outage**.",
       "**Single-flight** plus **refresh before expiry**."
      ],
      [
       "Eviction",
       "The dict **grows until the process dies**.",
       "**Bound it** and evict **LRU**."
      ],
      [
       "Power law",
       "'Let's cache everything.'",
       "A **small LRU** gets **most of the hits**."
      ],
      [
       "Key design",
       "The value depends on the caller; the key is only the id: **one user sees another's data**.",
       "The key holds **everything the value depends on**."
      ],
      [
       "Write patterns",
       "Who fills and who freshens the cache.",
       "**Cache-aside** by default; **write-through** helps freshness, **write-behind** can lose writes."
      ],
      [
       "Where to cache",
       "Four instances, **four separate copies**.",
       "In-process is **fastest but drifts**; Redis is **shared but a hop and a new failure**."
      ],
      [
       "Proactive refresh",
       "Every expiry costs **one user a slow request**.",
       "**Serve stale while one request refreshes.**"
      ]
     ]
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "mocks",
 "id": "mock-call",
 "n": 2,
 "title": "The call, simulated",
 "minutes": 75,
 "lead": "The thirty minutes as they will likely run: opening, your caching work, a scenario from Mercor's world with probes, Python and proof, wrap-up. One phase at a time.",
 "sections": [
  {
   "id": "mock-open",
   "title": "Opening",
   "blocks": [
    {
     "t": "p",
     "text": "**Minutes 0 to 4.** Sophie introduces herself and the format, then asks about you. Keep the intro to 45 seconds; the screen is about caching."
    },
    {
     "t": "turn",
     "ask": "Hi Pranav, I'm Sophie, an Applied AI Engineer on the Enterprise team. This is about thirty minutes and conversational: I'll ask about your experience with caching, then we'll talk through a scenario and see where it goes. No code today. Sound good?",
     "check": [
      "Calm, short, ready."
     ],
     "say": [
      "Sounds good, thanks Sophie. **I'll reason in Python** today, it's what I use day to day.",
      "And I'll **say my assumptions out loud** as I go, so **stop me if any are off**."
     ],
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "Great. Maybe start by telling me a bit about yourself.",
     "check": [
      "Can you say who you are and why this role in under a minute?"
     ],
     "say": [],
     "avoid": "The full history. 45 seconds, then stop and let her steer.",
     "who": "Sophie",
     "from": "intro"
    }
   ]
  },
  {
   "id": "mock-exp",
   "title": "Your caching work",
   "blocks": [
    {
     "t": "p",
     "text": "**Minutes 4 to 12.** Certain to come. She starts from what you have done, then probes two to four times; eight likely probes below. Frame it honestly (no classic cache layer; the caching that matters is the prompt cache), give a number, and name what is missing before she does."
    },
    {
     "t": "turn",
     "ask": "Let's start with you. Tell me about your experience with caching. What have you built or run at alfred_?",
     "check": [
      "Real production experience, not textbook.",
      "Numbers, and whether you measured them."
     ],
     "say": [],
     "avoid": "Claiming caches that don't exist (a Redis layer, cached chat answers, hit rates you never measured).",
     "priv": "exp",
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "How did you measure that?",
     "check": [
      "Do you know your own numbers and how they were taken?"
     ],
     "say": [],
     "probe": true,
     "priv": "exp-measure"
    },
    {
     "t": "turn",
     "ask": "What breaks a prompt cache? How is your prompt laid out?",
     "check": [
      "Do you understand the mechanism, not only the feature?"
     ],
     "say": [],
     "probe": true,
     "priv": "exp-break"
    },
    {
     "t": "turn",
     "ask": "How did you choose between five minutes and an hour?",
     "check": [
      "Trade-offs with numbers.",
      "Do you know when not to cache?"
     ],
     "say": [],
     "probe": true,
     "priv": "exp-ttl"
    },
    {
     "t": "turn",
     "ask": "You mentioned background workers. What do they cache?",
     "check": [
      "Breadth: is this one trick or a practice?"
     ],
     "say": [],
     "probe": true,
     "priv": "exp-workers"
    },
    {
     "t": "turn",
     "ask": "What about the agent itself: loading its code, cold starts?",
     "check": [
      "Performance beyond data caching.",
      "Resource management in a long-lived process."
     ],
     "say": [],
     "probe": true,
     "priv": "exp-v8"
    },
    {
     "t": "turn",
     "ask": "Tell me about the inbox cache. How does it stay fresh, and what happens when two requests miss at the same time?",
     "check": [
      "Staleness and concurrency on your own system.",
      "Honesty about gaps."
     ],
     "say": [],
     "probe": true,
     "priv": "exp-inbox"
    },
    {
     "t": "turn",
     "ask": "Why not Redis?",
     "check": [
      "Trade-offs, not fashion."
     ],
     "say": [],
     "probe": true,
     "priv": "exp-redis"
    },
    {
     "t": "turn",
     "ask": "If you went back, what would you fix?",
     "check": [
      "Self-critique: do you know your system's weak spots?"
     ],
     "say": [],
     "probe": true,
     "priv": "exp-gaps"
    }
   ]
  },
  {
   "id": "mock-scenario",
   "title": "A Mercor scenario",
   "blocks": [
    {
     "t": "p",
     "text": "**Minutes 10 to 22.** The core of the call. She sets up a system from their world, asks how you'd approach caching, then follows your answer. The probes below are the likely branches; she will take two or three, in the order your answer opens them."
    },
    {
     "t": "turn",
     "ask": "Let me give you something closer to what we do. On Enterprise we deploy agents inside a customer's company. Say an internal support agent: an employee asks a question, and the agent calls a model and a few of the customer's systems, their ticketing API and their docs search. The ticketing API is slow, 300 ms to 2 seconds, and rate-limited to a few hundred calls a minute. Usage is growing. How would you think about caching here?",
     "check": [
      "Do you frame before solving: what's slow, what's expensive, what must never be wrong?",
      "Clear assumptions."
     ],
     "say": [
      "Before caching anything I'd want to know **what's slow, what's expensive, and what must never be wrong**. My guess: the **model calls are the cost**, the **ticketing API is the latency and the rate limit**, and what must never happen is **one employee seeing another's data**.",
      "So I'd look at three layers: the **provider's prompt cache** for the agent's long, stable prompt, a **short-TTL cache of tool results** in front of the ticketing API, and I'd be **careful about caching model answers** at all."
     ],
     "more": [
      "Ask: how fresh must ticket status be? One deployment per customer, or shared? How many workers? Does the ticketing system send webhooks?",
      "Then commit: 'I'll assume shared workers, a few minutes of staleness is fine for most fields, no webhooks yet.'"
     ],
     "avoid": "Jumping to Redis, or caching the model's answers, in the first minute.",
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "What exactly would you cache from the ticketing API, and what's the key?",
     "check": [
      "Key design and multi-tenant safety: the Mercor-specific trap."
     ],
     "say": [
      "Reads that are **asked often and change slowly**: a ticket's details, a user's open tickets, docs search results. **Never writes**, and nothing the agent uses to **act**, like closing a ticket.",
      "The key holds **everything the answer depends on**: **tenant, the caller's permission scope, the normalised arguments, and the API version**. Leave out the permission scope and **the cache becomes a data leak**: a manager's view served to an intern."
     ],
     "more": [
      "Normalise arguments (sorted, trimmed, lowercased) or the hit rate collapses on trivial differences.",
      "Per-user keys kill the hit rate; if the API's permissions are role-based, key on the role or group instead.",
      "Hash long arguments; keep the tenant id readable at the front for deletes and metrics."
     ],
     "avoid": "Keying on the URL or the ticket id alone.",
     "probe": true
    },
    {
     "t": "turn",
     "ask": "Would you cache the model's responses?",
     "check": [
      "Do you know when an LLM cache is wrong?"
     ],
     "say": [
      "**Exact-match only, and only where the answer is deterministic**: same model version, same prompt, same tool results, temperature zero. That's great for **re-running evals**: the same input costs nothing the second time.",
      "For live users I'd **avoid a semantic cache** by default: a near-duplicate question with a **different ticket behind it gets a confident wrong answer**. The **safe win is the provider's prompt cache**: same answer, cheaper prefix."
     ],
     "more": [
      "Key: model id and version, a hash of the system prompt, the tool schemas and the full context. A prompt change then invalidates by itself.",
      "Prompt cache: order the prompt stable to volatile; a timestamp near the top breaks it.",
      "If they push on semantic caching: only for questions with no per-user context, with a high threshold, and measured against a judge."
     ],
     "avoid": "'Embed the question and return the nearest cached answer' with no word on correctness.",
     "probe": true
    },
    {
     "t": "turn",
     "ask": "There's an outage. Two hundred employees ask about the same incident ticket in the same minute. What happens?",
     "check": [
      "Concurrency: stampede against a quota.",
      "Do you see that several workers share one rate limit?"
     ],
     "say": [
      "Without care, **every request misses and calls the ticketing API**: we burn the **rate limit on one ticket**, and everything else starts getting 429s. A **stampede against a quota**.",
      "So **single-flight per key**: one call per ticket, everyone else waits on it. And with **several workers, the rate limit has to be shared**: a token bucket in Redis, or one gateway that owns the API, so twenty workers **don't each think they have the whole quota**."
     ],
     "more": [
      "Never hold a lock across the API call: lock to register, release, call, lock to store.",
      "If the load fails, wake the waiters with the error and remove the in-flight entry.",
      "Interactive requests before batch ones when the quota is tight.",
      "Stale-while-revalidate keeps the hot ticket served while one request refreshes."
     ],
     "vis": [
      {
       "title": "Two hundred asks, one ticket",
       "lanes": [
        [
         "No coalescing",
         [
          [
           "200 misses",
           "hot",
           "1"
          ],
          [
           "200 API calls",
           "hot",
           "3"
          ],
          [
           "quota gone, 429s",
           "hot",
           "2"
          ]
         ]
        ],
        [
         "Single-flight",
         [
          [
           "200 misses",
           "plain",
           "1"
          ],
          [
           "1 API call, 199 wait",
           "done",
           "3"
          ],
          [
           "quota left",
           "done",
           "2"
          ]
         ]
        ]
       ]
      }
     ],
     "avoid": "'Add a lock.' Which lock, around what, held for how long.",
     "probe": true
    },
    {
     "t": "turn",
     "ask": "The incident gets resolved, but the agent keeps telling people it's still open. Why, and what do you do?",
     "check": [
      "Staleness with a concrete fix, not 'lower the TTL'."
     ],
     "say": [
      "Because we served a **cached status inside its TTL**. If the ticketing system has **webhooks, invalidate on the status-change event**; if not, a **short TTL for status, longer for slow fields** like the title.",
      "For anything the agent **acts on, read through, not from cache**. And when it answers from cache it can say **'as of two minutes ago'**, so a stale answer is at least honest."
     ],
     "more": [
      "Webhooks get lost: keep the TTL as a backstop.",
      "If the API supports conditional requests (ETag, updated_at), revalidate cheaply instead of refetching.",
      "Split fields by how often they change; one TTL for the whole ticket is the wrong grain."
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "The ticketing API goes down for ten minutes.",
     "check": [
      "Reliability: timeouts, degradation, not making recovery worse."
     ],
     "say": [
      "**Timeouts on every call** first, so requests don't pile up. Then **serve the last good value with its age**, past its TTL, and a **circuit breaker** so we stop calling a dead API.",
      "What I would **not** do is **cache the error as if it were data**, or retry without **backoff and jitter**: when it comes back, we'd hit it with **ten minutes of retries at once**."
     ],
     "more": [
      "Soft TTL (refresh) and hard TTL (still servable when the source is down).",
      "A 404 can be cached for a few seconds on purpose (negative cache); a 500 never by accident.",
      "The agent should say the system is unreachable rather than guess."
     ],
     "vis": [
      {
       "title": "Retries after an outage",
       "lanes": [
        [
         "No jitter",
         [
          [
           "fail",
           "hot",
           "1"
          ],
          [
           "all at 1 s",
           "hot",
           "1"
          ],
          [
           "all at 2 s",
           "hot",
           "1"
          ],
          [
           "all at 4 s",
           "hot",
           "1"
          ]
         ]
        ],
        [
         "Full jitter",
         [
          [
           "fail",
           "hot",
           "1"
          ],
          [
           "spread 0 to 1 s",
           "done",
           "2"
          ],
          [
           "spread 0 to 2 s",
           "done",
           "3"
          ]
         ]
        ]
       ]
      }
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "Memory on the workers keeps climbing over the week.",
     "check": [
      "Resource management in your language."
     ],
     "say": [
      "Probably an **unbounded cache, or an in-flight map that never shrinks**. Tool results and model responses **vary a lot in size**, so I'd bound by **bytes, not entry count**, evict LRU, and **remove in-flight entries on success and on failure**.",
      "The other resources are **connections and the quota**: a **bounded HTTP pool and a semaphore per API**, so a burst of misses **queues instead of exhausting** sockets or threads."
     ],
     "more": [
      "Watch entries, bytes and evictions, per tenant.",
      "`functools.lru_cache` counts entries, not bytes, and has no TTL."
     ],
     "vis": [
      {
       "title": "Rough size",
       "calc": [
        [
         "20 KB per tool result x 50,000",
         "about 1 GB per worker"
        ],
        [
         "bound by bytes",
         "a 200 MB budget, LRU inside it"
        ]
       ]
      }
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "We go from five customers to two hundred.",
     "check": [
      "Growth: multi-tenant fairness, shared vs local."
     ],
     "say": [
      "Then it's **fairness between tenants**: one big customer **can evict everyone else's hot keys**, so keys are **namespaced by tenant** with a **quota each** in the shared cache. And a **per-tenant delete**: when a customer leaves, **their cached data goes with them**.",
      "Per-process caches stop being enough: twenty workers is **twenty copies and twenty cold starts**, so a **shared Redis tier** behind a **small local LRU** for the hottest keys."
     ],
     "more": [
      "Coalescing across processes: a short lock with SET NX and an expiry.",
      "Hit rate and served age per tenant, or one tenant's bad TTL hides in the average."
     ],
     "vis": [
      {
       "title": "Two levels",
       "flow": [
        "Request",
        "Local LRU (seconds)",
        "Redis, per tenant (minutes)",
        "Ticketing API"
       ],
       "note": "Each level absorbs most of what the next would see; invalidation must reach both."
      }
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "If you had a week, what would you build first?",
     "check": [
      "Priorities with reasons, not a list."
     ],
     "say": [
      "**Prompt structure first**: the cheapest win, and it changes no behaviour. Then the **tool-result cache with the right key and a short TTL**, plus **single-flight and a shared rate limiter**, because that's where an outage hurts. **Model-response caching last**, and only for evals.",
      "And from day one, **metrics per tenant**: hit rate, **the age of what we serve**, 429s from the customer's API. **I'd want those numbers before tuning any TTL.**"
     ],
     "probe": true
    }
   ]
  },
  {
   "id": "mock-code",
   "title": "If she shows code instead",
   "blocks": [
    {
     "t": "p",
     "text": "**Same minutes, a different opening.** Instead of the scenario she may read out or share a snippet and ask what you think. The same ideas, on a dict cache in front of a slow pricing service."
    },
    {
     "t": "code",
     "id": "mock-snippet",
     "title": "A cache in front of a slow pricing service (read out or shown, never written)",
     "code": "cache = {}\n\ndef get_price(product_id):\n    if product_id in cache:\n        return cache[product_id]\n    price = pricing_client.fetch(product_id)\n    cache[product_id] = price\n    return price",
     "notes": {
      "1": "A plain dict: no bound, no expiry, shared by every thread.",
      "4": "Check, then set later: concurrent requests collide in the gap.",
      "6": "The slow, flaky call (200 ms, sometimes 2 s, sometimes fails).",
      "7": "Stores whatever came back, forever, under a key that may be missing fields."
     }
    },
    {
     "t": "turn",
     "ask": "Here's a function someone wrote. The pricing service is slow, around 200 ms, sometimes 2 seconds, and it sometimes fails. What do you think?",
     "check": [
      "Do you frame before diving in?"
     ],
     "say": [
      "So it's a **cache-aside in front of a slow, flaky dependency**, in memory, per process.",
      "I'll go **correctness first, then concurrency, memory, failures, and growth**. For one process and a stable catalogue it's fine; **the problems come with concurrency, change and time.**"
     ],
     "avoid": "Listing ten bugs in the first minute.",
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "Leave load aside. Is it correct?",
     "check": [
      "Concrete failures, not adjectives."
     ],
     "say": [
      "Not quite. **Nothing ever expires**, so when a sale ends we **keep showing the sale price** until a restart.",
      "The key is only the product id, so if price depends on currency, **the first caller's currency wins for everyone**. And if we store an error, **we serve the failure forever**."
     ],
     "more": [
      "Fix: a TTL from the freshness requirement; a key with everything the value depends on; only store successes; invalidate on write where read-after-write matters."
     ],
     "vis": [
      {
       "title": "Read-after-write with replication lag",
       "lanes": [
        [
         "Admin",
         [
          [
           "write to primary",
           "done",
           "2"
          ],
          [
           "delete entry",
           "done",
           "1"
          ],
          [
           "",
           "gap",
           "3"
          ]
         ]
        ],
        [
         "Reader",
         [
          [
           "",
           "gap",
           "3"
          ],
          [
           "miss: read replica (old)",
           "hot",
           "2"
          ],
          [
           "store old",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "The refill reads a lagging replica and puts the old value back."
      }
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "A hundred requests for the same product arrive in the same second, and it's not cached yet.",
     "check": [
      "Do you see the race, and fix it at the right grain?"
     ],
     "say": [
      "**All hundred check, all miss, and all call pricing.** Check-then-act with a slow call in the gap: a **stampede**.",
      "**Single-flight**: the first request **starts the load**, the other ninety-nine **wait on that same result**. **One call instead of a hundred.**"
     ],
     "more": [
      "Threads: a dict of Futures under a small lock. asyncio: a dict of Tasks."
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "Why not one lock around the whole function?",
     "check": [
      "Do you know what a lock across I/O costs?"
     ],
     "say": [
      "It's correct, but it **serialises everything**: with a 200 ms call, **about five lookups a second** for the whole process, and one 2-second call **blocks every product**.",
      "**Lock to check and register, release, call outside the lock**, lock again to store. **Never hold a lock across a network call.**"
     ],
     "vis": [
      {
       "title": "One global lock across the call",
       "calc": [
        [
         "one call",
         "200 ms"
        ],
        [
         "one at a time",
         "about 5 per second"
        ],
        [
         "one slow call",
         "2 s, everyone waits"
        ]
       ]
      }
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "It runs for a week. What happens to memory?",
     "check": [
      "Resource management."
     ],
     "say": [
      "**The dict only grows**, so it **grows until the process is killed**. **Bound it with an LRU and a TTL**: at about **1 KB an entry, 100,000 entries is about 100 MB**.",
      "And **cap concurrent loads** with a semaphore, so a burst of misses **can't exhaust connections or threads**."
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "Pricing goes down for two minutes. And then we go from one instance to twenty.",
     "check": [
      "Failure, then growth, in one breath."
     ],
     "say": [
      "**Timeouts**, then **serve the last good price** if a minute old is fine, retries **with backoff and jitter**, and a **breaker**. Never **cache the error**.",
      "At twenty instances it's **twenty copies and twenty cold caches** per deploy, so a **shared Redis** with a **small local cache** in front, once the numbers say so."
     ],
     "probe": true
    }
   ]
  },
  {
   "id": "mock-python",
   "title": "Python and proof",
   "blocks": [
    {
     "t": "p",
     "text": "**Minutes 22 to 26.** The brief says 'in your preferred language', so expect a Python question or two, then how you'd know it works. Each comes with a probe."
    },
    {
     "t": "turn",
     "ask": "You said Python. For this service, threads or asyncio?",
     "check": [
      "Concurrency model, with the reason."
     ],
     "say": [
      "It's **I/O-bound**: waiting on the model and the API. So **asyncio** fits: thousands of waiting requests on one thread, cheaply. Threads work too, but **each waiting request holds a thread**.",
      "Either way **the race doesn't go away**: in asyncio, **check-then-set across an await** is still a race, so I'd coalesce with a **dict of Tasks**, and **shield** the shared load so one caller's timeout doesn't cancel it for everyone."
     ],
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "Is a Python dict thread-safe?",
     "check": [],
     "say": [
      "**One get or set is atomic** in CPython; **check-then-set is not**. The race is **between** operations, so you still need a lock or a single-flight map."
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "Why not just use functools.lru_cache?",
     "check": [],
     "say": [
      "It's **bounded but has no TTL**, it **doesn't coalesce** concurrent misses, and on a method it **keeps self alive**.",
      "On an **async function it caches the coroutine object**, which can only be awaited once, so the second caller gets an error."
     ],
     "probe": true
    },
    {
     "t": "turn",
     "ask": "How would you know the cache is actually working?",
     "check": [
      "Measurement, and the metric people forget."
     ],
     "say": [
      "**Hit rate per key type**, **load on the backend**, **p50 and p99**, **evictions**, and the **age of the values we serve**.",
      "The last one is the one people forget: **a 99 percent hit rate on data an hour stale** is a bug, not a win."
     ],
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "How would you test the stampede fix?",
     "check": [],
     "say": [
      "**Fifty concurrent callers on one missing key**, against a fake client that **counts calls and sleeps**: assert **one call and fifty equal results**.",
      "Then make the fake fail and assert **everyone gets the error and the next request retries**."
     ],
     "probe": true
    }
   ]
  },
  {
   "id": "mock-wrap",
   "title": "Wrap-up",
   "blocks": [
    {
     "t": "p",
     "text": "**Minutes 26 to 30.** She wraps up and hands you the floor. One closing thought, one or two questions, a warm close."
    },
    {
     "t": "turn",
     "ask": "That's most of what I had. Anything you'd add to what you said?",
     "check": [
      "A crisp takeaway."
     ],
     "say": [
      "One thing: **the cache key is where correctness lives**. In a multi-tenant system I'd **review every key** before I'd tune a single TTL."
     ],
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "What questions do you have for me?",
     "check": [
      "Interest in their real problems."
     ],
     "say": [],
     "fromAsk": "sophie",
     "who": "Sophie"
    },
    {
     "t": "turn",
     "ask": "Thanks, Pranav. The recruiter will be in touch about next steps.",
     "check": [],
     "say": [
      "Really appreciate you taking the time today. This was helpful \u2014 honestly, the more I hear about what the team is working on, the more excited I am about the fit. Looking forward to hearing about next steps whenever you have them."
     ],
     "who": "Sophie"
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "mocks",
 "id": "mock-curve",
 "n": 3,
 "title": "Curveballs",
 "minutes": 10,
 "lead": "Short questions that may come in between. Twenty seconds each.",
 "sections": [
  {
   "id": "mock-curve-all",
   "title": "If they ask",
   "blocks": [
    {
     "t": "turn",
     "ask": "Single-flight or stale-while-revalidate?",
     "check": [],
     "say": [
      "Single-flight stops the herd **on a miss**; stale-while-revalidate stops users waiting **on an expiry**. For hot keys, **both**."
     ]
    },
    {
     "t": "turn",
     "ask": "LRU or LFU?",
     "check": [],
     "say": [
      "**LRU is cheap and fits skewed traffic**; LFU protects long-term favourites from one-off scans but needs ageing. **Start LRU, measure.**"
     ]
    },
    {
     "t": "turn",
     "ask": "How do you pick a TTL?",
     "check": [],
     "say": [
      "From **how stale is allowed** and **what a miss costs**: short for status, long for names. **Add jitter.**"
     ]
    },
    {
     "t": "turn",
     "ask": "Cache-aside or write-through?",
     "check": [],
     "say": [
      "Cache-aside **caches only what's read**; write-through **keeps it fresh** but caches unread data and slows writes. For a few read-after-write paths, **invalidate on write**."
     ]
    },
    {
     "t": "turn",
     "ask": "What is cache penetration?",
     "check": [],
     "say": [
      "Keys that **never exist always reach the backend**. Cache **'not found' briefly**, or a **Bloom filter** of real ids."
     ]
    },
    {
     "t": "turn",
     "ask": "What is a cache avalanche?",
     "check": [],
     "say": [
      "Many keys **expire at the same moment**, usually filled together after a deploy. **Jitter the TTLs** and **cap concurrent loads**."
     ]
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "mocks",
 "id": "mock-plan",
 "n": 4,
 "title": "How it is scored, and your plan",
 "minutes": 10,
 "lead": "Mercor's own words, what earns them, and how to spend the hours before 6 PM tomorrow.",
 "sections": [
  {
   "id": "mock-score",
   "title": "Their words, and what earns them",
   "blocks": [
    {
     "t": "bridge",
     "head": [
      "They said",
      "Weak",
      "Strong"
     ],
     "rows": [
      [
       "Clear assumptions",
       "Asks endless questions, or none.",
       "States **three or four** and **commits** out loud."
      ],
      [
       "Concrete failures",
       "'There could be race conditions.'",
       "'**Two hundred requests miss at once and burn the rate limit.**'"
      ],
      [
       "Correctness, performance, reliability",
       "Only performance.",
       "**All three, in an order said up front.**"
      ],
      [
       "Growth and concurrency",
       "Jumps to Redis with no reason.",
       "**Stampede, lock scope, per-process copies, tenants**, then shared cache."
      ],
      [
       "Trade-offs in improvements",
       "Every fix at once.",
       "**Each fix with its cost, in priority order.**"
      ],
      [
       "Resources in your language",
       "'Memory is cheap.'",
       "**Bounded memory, connection caps, timeouts**, Python specifics."
      ]
     ]
    }
   ]
  },
  {
   "id": "mock-hours",
   "title": "Your plan",
   "blocks": [
    {
     "t": "bridge",
     "head": [
      "When",
      "What",
      "Time"
     ],
     "rows": [
      [
       "Today",
       "Part 2 phase by phase, answers shown. **Say each sheet out loud once.**",
       "**75 min**"
      ],
      [
       "Today",
       "Your caching work: say it **three times, timed to 90 seconds**",
       "**15 min**"
      ],
      [
       "Today",
       "Part 2 again with **Try first**: answer before you open each sheet",
       "**45 min**"
      ],
      [
       "Tomorrow morning",
       "Say **'run the Mercor mock'** in chat: live, 30 minutes, critique after",
       "**45 min**"
      ],
      [
       "An hour before",
       "Reread the scenario phase and the curveballs. **Nothing new.**",
       "**15 min**"
      ]
     ]
    }
   ]
  }
 ]
});
