/* Mercor caching screen, simulated: a walkthrough for the Mocks tab. Written 22 Oct 2026 from Mercor's description of
   the screen and the candidate reports in wc32 to wc34. Conversational, no coding: code appears only as a picture. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "tab": "mocks",
 "id": "mock-bridge",
 "n": 1,
 "title": "Your notes, said out loud",
 "minutes": 20,
 "lead": "Every concept in your handwritten notes, as the failure it causes in tomorrow's kind of system and the one sentence you would say about it. No code tomorrow: this is the vocabulary turned into examples.",
 "sections": [
  {
   "id": "mock-bridge-frame",
   "title": "The system everything below refers to",
   "blocks": [
    {
     "t": "p",
     "text": "Expect the screen to start from something like this, described or shown: a service that looks up prices from a slow pricing service, with an in-memory cache someone added in front. Tomorrow you reason about it; you do not write it."
    },
    {
     "t": "code",
     "id": "mock-snippet",
     "title": "The kind of thing they may read out or show",
     "code": "cache = {}\n\ndef get_price(product_id):\n    if product_id in cache:\n        return cache[product_id]\n    price = pricing_client.fetch(product_id)   # about 200 ms, sometimes 2 s, sometimes fails\n    cache[product_id] = price\n    return price",
     "notes": {
      "1": "A plain dict: no bound, no expiry, shared by every thread in the process.",
      "4": "Check, then later set: the gap between them is where concurrent requests collide.",
      "6": "The slow, failing call. Everything interesting happens while this line runs.",
      "7": "Stores whatever came back, forever, under a key that may not hold everything the price depends on."
     }
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Where the request goes",
       "flow": [
        "Request",
        "Check the dict",
        "Hit: return",
        "Miss: call pricing (200 ms to 2 s)",
        "Store, return"
       ],
       "note": "Five places to talk about: the check, the call, the store, the key, and what lives in the dict over a week."
      }
     ]
    }
   ]
  },
  {
   "id": "mock-bridge-table",
   "title": "Each note, as a failure and a sentence",
   "blocks": [
    {
     "t": "table",
     "head": [
      "From your notes",
      "What goes wrong here",
      "What you say"
     ],
     "rows": [
      [
       "Stampede (thundering herd)",
       "A popular product's entry is missing or expires; 50 requests miss at once and all call pricing.",
       "Coalesce: one request loads, the others wait for its result (single-flight)."
      ],
      [
       "Avalanche",
       "Many entries were filled at the same moment with the same TTL and all expire together; the backend gets the whole load at once.",
       "Add jitter to TTLs; for a shared cache going down, a circuit breaker and a limit on concurrent loads."
      ],
      [
       "Penetration (invalid key)",
       "Requests for products that do not exist always miss and always hit the backend.",
       "Cache the 'not found' briefly (negative caching), or check a Bloom filter first."
      ],
      [
       "TTL",
       "The dict never expires anything, so a changed price is served forever.",
       "A TTL bounds staleness; pick it from how stale a price may be, not from a guess."
      ],
      [
       "Read-after-write",
       "An admin updates a price and immediately sees the old one.",
       "Invalidate (delete) on write, or write-through for that path."
      ],
      [
       "Replication lag / eventual consistency",
       "Invalidate, then re-read from a replica that has not caught up: the old value goes back in.",
       "Delete after the write commits, read the primary for that refill, or version the value."
      ],
      [
       "Hot key",
       "One product (a sale item) takes most of the traffic; its miss or its lock is the bottleneck.",
       "Single-flight for that key, refresh before expiry, replicate it locally if shared."
      ],
      [
       "Eviction (LRU, LFU, FIFO)",
       "The dict grows until the process runs out of memory.",
       "Bound it by entries or bytes and evict LRU; say why LRU suits a power-law workload."
      ],
      [
       "Small cache is enough (power law)",
       "The team wants to cache everything.",
       "A few percent of products take most reads; a small LRU gets most of the hit rate."
      ],
      [
       "Key design",
       "The price depends on currency or region, but the key is only the product id.",
       "The key must include everything the value depends on."
      ],
      [
       "Cache-aside / read-through / write-through / write-behind",
       "Who fills the cache and who keeps it fresh.",
       "This code is cache-aside; write-through helps read-after-write; write-behind risks losing writes."
      ],
      [
       "Where to cache",
       "Four instances each have their own dict.",
       "In-process is fastest but each copy goes stale on its own; Redis is shared but a network hop and a new failure mode."
      ],
      [
       "Proactive vs reactive refresh",
       "Every expiry costs a user a slow request.",
       "Refresh hot keys in the background before they expire, serve stale while refreshing."
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
 "minutes": 45,
 "lead": "The screen as it would likely run: about 30 minutes, conversational, no tools. Each move has what they are really checking, your answer as beats you say in order, a picture of what happens, and the answer that loses points.",
 "sections": [
  {
   "id": "mock-open",
   "title": "1. The setup (first 2 minutes)",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** We have a service that needs product prices. The pricing service is slow, around 200 milliseconds, sometimes two seconds, and it sometimes fails. Someone added a cache in front of it, a dictionary keyed by product id: check it, otherwise call pricing and store the result. Talk me through what you think of it."
    },
    {
     "t": "list",
     "items": [
      "Checking: Do you restate and frame before diving in?",
      "Checking: Do you name assumptions instead of guessing silently?"
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "**Restate:** 'So it's a read-through in front of a slow, flaky dependency, in-memory, per process. Before I judge it, a few assumptions.'",
      "**Give a plan:** 'I'll go through correctness first, then what happens under concurrent load, then memory, then failures, then what changes as it grows.'",
      "**One honest positive:** 'For a single process with a small, stable catalogue and prices that rarely change, this is fine. The problems start with concurrency, change and time.'"
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** Listing ten bugs in the first minute. They want to see you structure the problem, then go deep."
    }
   ]
  },
  {
   "id": "mock-assume",
   "title": "2. Assumptions",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** What would you want to know?"
    },
    {
     "t": "list",
     "items": [
      "Checking: Clear assumptions: this is literally what the description says they score."
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "**Freshness:** 'How stale may a price be? Seconds, minutes? That sets the TTL.'",
      "**Shape of reads:** 'How many products, how skewed is traffic? Usually a few products take most reads.'",
      "**Concurrency model:** 'Threads or asyncio, how many workers, how many instances?'",
      "**What the price depends on:** 'Only the product, or also currency, region, user tier?'",
      "**Failure behaviour:** 'When pricing fails, is a slightly old price acceptable, or must we error?'",
      "Then commit: 'I'll assume threads, a few instances, prices that change a few times a day, and that a price up to a minute old is fine.'"
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** Waiting for answers to everything. State a sensible assumption and move on; offer to revisit it."
    }
   ]
  },
  {
   "id": "mock-correct",
   "title": "3. Correctness",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** Leave load aside. Is it correct?"
    },
    {
     "t": "list",
     "items": [
      "Checking: Concrete examples of failure, not adjectives."
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "**Staleness:** 'Nothing ever expires. If a price changes at noon, we serve the old one until the process restarts. Example: a sale ends and we keep showing the sale price.'",
      "**Key:** 'If the price depends on currency, the first caller's currency wins for everyone. A user in Europe sees a dollar price.'",
      "**Failures:** 'If pricing returns an error object or None and we store it, we serve the failure until restart. Never cache an error by accident.'",
      "**Shared mutable value:** 'If the value is a dict and a caller changes it, every later caller sees the change. Return copies or immutable values.'",
      "**Fixes, in order:** a TTL from the freshness requirement; the key covers everything the value depends on; only store successful results; invalidate on write for paths that need read-after-write."
     ]
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Read-after-write with replication lag",
       "lanes": [
        [
         "Admin",
         [
          [
           "write new price to primary",
           "done",
           "2"
          ],
          [
           "delete cache entry",
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
           "miss: read replica (old value)",
           "hot",
           "2"
          ],
          [
           "store old value",
           "hot",
           "1"
          ]
         ]
        ]
       ],
       "note": "Invalidate-then-refill can put the old value back if the refill reads a lagging replica. Fix: refill from the primary, delay the delete, or store a version and reject older ones."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** 'It might be stale sometimes.' Say when, for whom, and what it costs."
    }
   ]
  },
  {
   "id": "mock-concurrency",
   "title": "4. Concurrent requests",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** Now a hundred requests for the same popular product arrive in the same second, and the entry is not there yet. What happens?"
    },
    {
     "t": "list",
     "items": [
      "Checking: Do you see the race, explain it with a timeline, and fix it with the right granularity?"
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "**What happens:** 'All hundred check, all miss, and all call pricing. That's a stampede: the cache does nothing at exactly the moment it matters, and the slow dependency gets a hundred times the load.'",
      "**Why:** 'Check-then-act. The check and the store are separate steps with a slow call between them.'",
      "**Fix:** 'Single-flight: the first request for a key starts the load and records it as in flight; the others wait on that same result. One call instead of a hundred.'",
      "**Granularity:** 'Not one global lock around the call: that serialises every product behind the slowest one. Per key, held only to register or find the in-flight load, never across the network call.'",
      "**Failure inside single-flight:** 'If the load fails, wake the waiters with the error and remove the in-flight entry, so the next request retries. Otherwise one failure is cached forever.'",
      "**In Python:** 'With threads, a dict of Futures or Events under a small lock. With asyncio, a dict of Tasks; awaiting the same Task is safe, a coroutine can only be awaited once.'"
     ]
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Without coalescing: three requests, three calls",
       "lanes": [
        [
         "Request A",
         [
          [
           "miss",
           "plain",
           "1"
          ],
          [
           "call pricing",
           "hot",
           "4"
          ],
          [
           "store",
           "plain",
           "1"
          ]
         ]
        ],
        [
         "Request B",
         [
          [
           "miss",
           "plain",
           "1"
          ],
          [
           "call pricing",
           "hot",
           "4"
          ],
          [
           "store",
           "plain",
           "1"
          ]
         ]
        ],
        [
         "Request C",
         [
          [
           "miss",
           "plain",
           "1"
          ],
          [
           "call pricing",
           "hot",
           "4"
          ],
          [
           "store",
           "plain",
           "1"
          ]
         ]
        ]
       ],
       "note": "Every request sees the empty cache before any of them stores."
      },
      {
       "title": "With single-flight: one call, two waiters",
       "lanes": [
        [
         "Request A",
         [
          [
           "miss, start load",
           "plain",
           "1"
          ],
          [
           "call pricing",
           "done",
           "4"
          ],
          [
           "store, wake",
           "plain",
           "1"
          ]
         ]
        ],
        [
         "Request B",
         [
          [
           "miss, join A",
           "plain",
           "1"
          ],
          [
           "wait",
           "gap",
           "4"
          ],
          [
           "result",
           "done",
           "1"
          ]
         ]
        ],
        [
         "Request C",
         [
          [
           "miss, join A",
           "plain",
           "1"
          ],
          [
           "wait",
           "gap",
           "4"
          ],
          [
           "result",
           "done",
           "1"
          ]
         ]
        ]
       ]
      }
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** 'Add a lock.' Which lock, around what, held for how long: that is the whole answer."
    }
   ]
  },
  {
   "id": "mock-lockfollow",
   "title": "5. The lock follow-up",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** Why not one lock around the whole function? It's simpler."
    },
    {
     "t": "list",
     "items": [
      "Checking: Do you understand what a lock held across I/O does to throughput?"
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "'It's correct but it serialises everything. With a 200 ms call, one lock caps the whole process at five lookups a second, and one slow two-second call blocks every other product.'",
      "'Lock to check and register, release, do the slow call outside the lock, lock again to store. Per key if contention is still high.'",
      "'The rule I use: never hold a lock across a network call.'"
     ]
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "One global lock across the call",
       "calc": [
        [
         "one call",
         "200 ms"
        ],
        [
         "calls one at a time",
         "5 per second for the whole process"
        ],
        [
         "one slow call",
         "2 s with everyone waiting"
        ]
       ]
      }
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** Defending the global lock as 'simple'. Simple is fine only when you say what it costs."
    }
   ]
  },
  {
   "id": "mock-memory",
   "title": "6. Resource management",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** This runs for a week. What happens to memory, and anything else it holds?"
    },
    {
     "t": "list",
     "items": [
      "Checking: Resource management in your language: memory, connections, threads."
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "**Memory:** 'The dict only grows. With a large catalogue and many currencies it can grow until the process is killed. Bound it: an LRU with a maximum size, in entries or bytes.'",
      "**Size it:** 'If an entry is about 1 KB and we keep 100,000, that's around 100 MB per process. Fine, but say the number. Thanks to the power law, a small cache already gets most hits.'",
      "**The in-flight map:** 'It must shrink too: remove entries when a load finishes, success or failure.'",
      "**Connections and threads:** 'Every miss uses a connection to pricing. Cap concurrent loads with a semaphore or a bounded pool so a burst of misses can't exhaust connections or threads.'",
      "**Python specifics:** '`functools.lru_cache` is bounded, but it has no TTL, caches per argument tuple, and on a method it keeps `self` alive. I'd use my own small LRU with a TTL, or `cachetools`.'"
     ]
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "A rough size",
       "calc": [
        [
         "1 KB per entry x 100,000 entries",
         "about 100 MB per process"
        ],
        [
         "x 4 instances",
         "about 400 MB in total, four separate copies"
        ]
       ]
      }
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** 'Memory is cheap.' Unbounded growth is a crash with a delay."
    }
   ]
  },
  {
   "id": "mock-failure",
   "title": "7. Failures",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** The pricing service goes down for two minutes. Walk me through it."
    },
    {
     "t": "list",
     "items": [
      "Checking: Reliability: timeouts, retries, degradation, and not making the outage worse."
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "**Timeouts:** 'Every call needs one, shorter than the caller's budget, or requests pile up behind a hung dependency.'",
      "**Serve stale:** 'If a price may be a minute old, keep expired entries and serve them when the refresh fails, with a cap on how stale. Users barely notice the outage.'",
      "**Don't cache the failure by accident, but do cache it on purpose for a few seconds:** a short negative cache stops every request hammering a dead service.",
      "**Retries:** 'Only for errors that can pass, a few attempts, exponential backoff with jitter. Retries without jitter turn recovery into a second stampede.'",
      "**Circuit breaker:** 'After repeated failures, stop calling for a short while and serve stale or fail fast, then let one probe through.'",
      "**When it recovers:** 'All the entries we kept failing to refresh expire together. Jittered TTLs and a cap on concurrent loads stop that avalanche.'"
     ]
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Retries with and without jitter",
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
           "all retry at 1 s",
           "hot",
           "1"
          ],
          [
           "all retry at 2 s",
           "hot",
           "1"
          ],
          [
           "all retry at 4 s",
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
           "retries spread over 0 to 1 s",
           "done",
           "2"
          ],
          [
           "spread over 0 to 2 s",
           "done",
           "3"
          ]
         ]
        ]
       ],
       "note": "Synchronised retries hit the recovering service in waves."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** 'Retry until it works.' Unbounded retries are how a two-minute outage becomes twenty."
    }
   ]
  },
  {
   "id": "mock-scale",
   "title": "8. As it grows",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** We go from one instance to twenty. Does your design still hold?"
    },
    {
     "t": "list",
     "items": [
      "Checking: Do you know what changes when the cache is per process and the fleet grows?"
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "**Twenty copies:** 'Each process has its own cache. A price change has to reach all twenty, and until each expires users see different prices depending on which instance they hit.'",
      "**Twenty cold starts:** 'Each instance warms on its own, so a deploy is twenty stampedes.'",
      "**Shared cache:** 'Redis gives one copy and one place to invalidate, at the cost of a network hop, a new failure mode, and coalescing that now has to work across processes: a short lock with SET NX and an expiry.'",
      "**Two levels:** 'A small in-process cache with a short TTL for the hottest keys in front of Redis keeps the hop off the hottest path.'",
      "**What I'd measure:** hit rate per key class, load on pricing, p99 latency, entries evicted, how stale served values are."
     ]
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Two levels",
       "flow": [
        "Request",
        "Local LRU (seconds)",
        "Redis (minutes)",
        "Pricing service"
       ],
       "note": "Each level absorbs most of the traffic the next would see; invalidation has to reach both."
      }
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** Jumping to Redis in the first minute. Earn it: say what breaks with per-process caches first."
    }
   ]
  },
  {
   "id": "mock-improve",
   "title": "9. 'What would you change first?'",
   "blocks": [
    {
     "t": "p",
     "text": "**Interviewer:** You've found a lot. If you had a day, what do you change, in what order?"
    },
    {
     "t": "list",
     "items": [
      "Checking: Thoughtful trade-offs and priorities, not a list."
     ]
    },
    {
     "t": "p",
     "text": "**You, out loud:**"
    },
    {
     "t": "list",
     "items": [
      "1. **Bound it and expire it:** an LRU with a TTL from the freshness requirement. It fixes the crash and the forever-stale value.",
      "2. **Single-flight per key, no lock across the call:** it fixes the stampede and the throughput.",
      "3. **Only cache successes; timeouts on the call; serve stale on failure:** it fixes the outage behaviour.",
      "4. **Fix the key:** include currency and region.",
      "5. **Then measure** before Redis: hit rate and load on pricing tell us whether a shared cache is worth its cost.",
      "Close: 'The trade-off I keep making is freshness against load on pricing, and the TTL is where that's decided, so I'd make it explicit and per data type.'"
     ]
    },
    {
     "t": "p",
     "text": "**Avoid:** Proposing everything at once with no order."
    }
   ]
  },
  {
   "id": "mock-close",
   "title": "10. Your questions (last 3 minutes)",
   "blocks": [
    {
     "t": "p",
     "text": "Ask one or two; they are on your Prep tab too."
    },
    {
     "t": "list",
     "items": [
      "'Where does caching bite you most at Mercor today: staleness, cost of model calls, or load on a dependency?'",
      "'How does the Enterprise team handle caching for model calls: responses, embeddings, or the provider's prompt cache?'",
      "'What does the next round look like?'"
     ]
    }
   ]
  }
 ]
});
window.LOOP_CODING.parts.push({
 "tab": "mocks",
 "id": "mock-curve",
 "n": 3,
 "title": "Curveballs, short answers",
 "minutes": 15,
 "lead": "Questions that may come in between. Say each answer in about 20 seconds.",
 "sections": [
  {
   "id": "mock-curve-faq",
   "title": "If they ask",
   "blocks": [
    {
     "t": "faq",
     "items": [
      {
       "q": "Make it async. What changes?",
       "a": "One thread, so no data race on the dict itself, but check-then-act across an `await` is still a race: two tasks both miss. Coalesce with a dict of Tasks; protect the shared load with `shield` so one caller's timeout doesn't cancel it for everyone; never put a blocking call inside async code without `to_thread`."
      },
      {
       "q": "Is a Python dict thread-safe?",
       "a": "A single get or set is atomic in CPython because of the GIL; check-then-set is not. The race is between operations, not inside one."
      },
      {
       "q": "Single-flight or stale-while-revalidate?",
       "a": "Single-flight stops the herd on a miss; stale-while-revalidate stops users waiting on an expiry by serving the old value while one request refreshes. For hot keys I'd use both."
      },
      {
       "q": "LRU or LFU?",
       "a": "LRU is cheap and fits most skewed workloads; LFU protects long-term popular keys from a scan of one-off keys but needs ageing. Start with LRU, measure."
      },
      {
       "q": "How do you choose the TTL?",
       "a": "From the business: how stale may this be, and what does a miss cost. Short for prices, long for product names. Add jitter so entries don't expire together."
      },
      {
       "q": "Cache-aside or write-through?",
       "a": "Cache-aside is simple and only caches what's read; write-through keeps the cache fresh on writes but caches things nobody reads and adds write latency. For read-after-write on a few paths, invalidate on write."
      },
      {
       "q": "How would you test the stampede fix?",
       "a": "Start fifty threads on the same missing key with a fake pricing client that counts calls and sleeps; assert one call and fifty identical results. Then make the fake fail and assert the next request retries."
      },
      {
       "q": "What about caching LLM calls?",
       "a": "Two different things: our own response cache, keyed on everything that changes the answer (model, prompt, parameters, the user's data), and the provider's prompt cache, which caches the prompt prefix. I've worked on the second in production; it's on my Prep tab."
      },
      {
       "q": "Where do you put the cache metrics?",
       "a": "Hits, misses, loads in flight, evictions, errors, and the age of values served, per key class. The age of served values is the one people forget."
      },
      {
       "q": "What's cache penetration and how do you stop it?",
       "a": "Requests for keys that never exist always reach the backend. Cache 'not found' for a short TTL, or check a Bloom filter of existing ids first."
      }
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
 "title": "How it is scored, and your next 3 hours",
 "minutes": 10,
 "lead": "What a strong screen looks like against Mercor's own words, and how to spend the time before 6 PM tomorrow.",
 "sections": [
  {
   "id": "mock-score",
   "title": "Their words, and what earns them",
   "blocks": [
    {
     "t": "table",
     "head": [
      "They said",
      "Strong",
      "Weak"
     ],
     "rows": [
      [
       "Clear assumptions",
       "States three or four and commits to them out loud",
       "Asks endless questions, or none"
      ],
      [
       "Concrete examples of potential failures",
       "'A hundred requests miss at once and all call pricing'",
       "'There could be race conditions'"
      ],
      [
       "Correctness, performance, reliability",
       "Covers all three, in an order said up front",
       "Only performance"
      ],
      [
       "As workloads grow and requests run concurrently",
       "Stampede, lock scope, per-process copies, coalescing across instances",
       "Jumps to Redis with no reason"
      ],
      [
       "Thoughtful tradeoffs when proposing improvements",
       "Each fix with its cost, in a priority order",
       "A list of every fix at once"
      ],
      [
       "Resource management in your language",
       "Bounded memory, connection caps, timeouts, Python specifics (GIL, lru_cache, asyncio)",
       "'Memory is cheap'"
      ]
     ]
    }
   ]
  },
  {
   "id": "mock-hours",
   "title": "The next 3 hours",
   "blocks": [
    {
     "t": "table",
     "head": [
      "When",
      "What",
      "How long"
     ],
     "rows": [
      [
       "Today",
       "Read this walkthrough once, part 1 then part 2",
       "60 min"
      ],
      [
       "Today",
       "Say part 2's answers out loud, one section at a time, without looking; then check",
       "45 min"
      ],
      [
       "Today",
       "Open `E:\\mercor-cache-mock\\mock1_review`, find the bugs out loud, timed 15 minutes",
       "20 min"
      ],
      [
       "Tomorrow morning",
       "Say 'run the Mercor mock' in chat: a live 30-minute screen, critique after",
       "45 min"
      ],
      [
       "Tomorrow, an hour before",
       "Reread part 4's table and the curveballs; nothing new",
       "15 min"
      ]
     ]
    }
   ]
  }
 ]
});
