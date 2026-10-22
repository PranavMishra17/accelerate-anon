/* Mercor caching screen, simulated, for the Mocks tab. 22 Oct 2026, from Mercor's description of the screen and the
   candidate reports in wc32 to wc34. Conversational, no coding. Generated; edit the generator, not this file. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "tab": "mocks",
 "id": "mock-bridge",
 "n": 1,
 "title": "Your notes, said out loud",
 "minutes": 20,
 "lead": "Each concept from your handwritten notes, as the failure it causes and the one line you would say.",
 "sections": [
  {
   "id": "mock-bridge-frame",
   "title": "The system they will likely describe",
   "blocks": [
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
    }
   ]
  },
  {
   "id": "mock-bridge-map",
   "title": "Concept to failure to sentence",
   "blocks": [
    {
     "t": "bridge",
     "rows": [
      [
       "Stampede",
       "A popular entry is missing; 50 requests miss together and all call pricing.",
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
       "Nothing expires, so a changed price is **served forever**.",
       "A TTL **bounds staleness**; pick it from **how stale is allowed**."
      ],
      [
       "Read-after-write",
       "An admin edits a price and **still sees the old one**.",
       "**Invalidate on write** for paths that need it."
      ],
      [
       "Replication lag",
       "Delete, then refill from a **lagging replica**: the old value is back.",
       "Refill **from the primary**, or **version** the value."
      ],
      [
       "Hot key",
       "One sale item takes most traffic; **its miss is the outage**.",
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
       "Price depends on currency; key is only the id: **wrong currency** for some users.",
       "The key holds **everything the value depends on**."
      ],
      [
       "Write patterns",
       "Who fills and who freshens the cache.",
       "This is **cache-aside**; **write-through** helps freshness, **write-behind** can lose writes."
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
 "minutes": 45,
 "lead": "Ten moves, one at a time. Read the interviewer's line, say your answer out loud before reading the sheet, then compare.",
 "sections": [
  {
   "id": "mock-open",
   "title": "Setup",
   "blocks": [
    {
     "t": "turn",
     "ask": "We have a service that needs product prices. The pricing service is slow, around 200 ms, sometimes 2 seconds, and it sometimes fails. Someone put a dictionary cache in front of it. Talk me through what you think.",
     "check": [
      "Do you frame before diving in?",
      "Do you name assumptions out loud?"
     ],
     "say": [
      "So it's a **cache-aside in front of a slow, flaky dependency**, in memory, per process.",
      "I'll go **correctness first, then concurrency, memory, failures, and growth**. For one process and a stable catalogue it's fine; **the problems come with concurrency, change and time.**"
     ],
     "more": [
      "Restate in one sentence.",
      "Give the order you will go in.",
      "One honest positive before the problems."
     ],
     "avoid": "Listing ten bugs in the first minute."
    }
   ]
  },
  {
   "id": "mock-assume",
   "title": "Assumptions",
   "blocks": [
    {
     "t": "turn",
     "ask": "What would you want to know?",
     "check": [
      "Clear assumptions: their exact words."
     ],
     "say": [
      "A few things: **how stale a price may be**, how **skewed** the traffic is, **threads or asyncio** and how many instances, and whether the price depends on **currency or region**.",
      "I'll assume **threads, a few instances, prices that change a few times a day, and up to a minute of staleness is fine**. I can revisit any of these."
     ],
     "more": [
      "Freshness sets the TTL.",
      "Skew sets the cache size (power law).",
      "Concurrency model sets the fix.",
      "Dependencies of the value set the key.",
      "Failure tolerance sets whether to serve stale."
     ],
     "avoid": "Waiting for every answer. State it, commit, move on."
    }
   ]
  },
  {
   "id": "mock-correct",
   "title": "Correctness",
   "blocks": [
    {
     "t": "turn",
     "ask": "Leave load aside for now. Is it correct?",
     "check": [
      "Concrete examples of failure, not adjectives."
     ],
     "say": [
      "Not quite. **Nothing ever expires**, so when a sale ends we **keep showing the sale price** until a restart.",
      "The key is only the product id, so if price depends on currency, **the first caller's currency wins for everyone**. And if pricing returns an error and we store it, **we serve the failure forever**."
     ],
     "more": [
      "Fix 1: a TTL from the freshness requirement.",
      "Fix 2: the key covers everything the value depends on.",
      "Fix 3: only store successful results.",
      "Fix 4: invalidate on write where read-after-write matters.",
      "Also: return copies, not a shared mutable dict."
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
     "avoid": "'It might be stale sometimes.' Say when, for whom, and what it costs."
    }
   ]
  },
  {
   "id": "mock-concurrency",
   "title": "Concurrent requests",
   "blocks": [
    {
     "t": "turn",
     "ask": "A hundred requests for the same popular product arrive in the same second, and it's not cached yet. What happens?",
     "check": [
      "Do you see the race?",
      "Can you fix it at the right granularity?"
     ],
     "say": [
      "**All hundred check, all miss, and all call pricing.** It's check-then-act with a slow call in the gap: a **stampede**, exactly when the cache should help most.",
      "I'd use **single-flight**: the first request **starts the load**, the other ninety-nine **wait on that same result**. **One call instead of a hundred.**"
     ],
     "more": [
      "Lock only to register or find the in-flight load, **never across the network call**.",
      "Per key, not global.",
      "If the load fails, **wake waiters with the error and remove the in-flight entry**, so the next request retries.",
      "Threads: a dict of Futures under a small lock. asyncio: a dict of Tasks (a Task can be awaited many times; a coroutine once)."
     ],
     "vis": [
      {
       "title": "Without coalescing",
       "lanes": [
        [
         "A",
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
         "B",
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
         "C",
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
       ]
      },
      {
       "title": "With single-flight",
       "lanes": [
        [
         "A",
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
         "B",
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
         "C",
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
     ],
     "avoid": "'Add a lock.' Which lock, around what, held for how long: that is the answer."
    }
   ]
  },
  {
   "id": "mock-lock",
   "title": "Lock scope",
   "blocks": [
    {
     "t": "turn",
     "ask": "Why not put one lock around the whole function? Simpler.",
     "check": [
      "Do you know what a lock across I/O costs?"
     ],
     "say": [
      "It's correct, but it **serialises everything**. With a 200 ms call, **one lock caps the process at about five lookups a second**, and one slow 2-second call **blocks every product**.",
      "So: **lock to check and register, release, call outside the lock**, lock again to store. **Never hold a lock across a network call.**"
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
         "about 5 per second, whole process"
        ],
        [
         "one slow call",
         "2 s, everyone waits"
        ]
       ]
      }
     ],
     "avoid": "Defending it as 'simple' without saying what it costs."
    }
   ]
  },
  {
   "id": "mock-memory",
   "title": "Resources",
   "blocks": [
    {
     "t": "turn",
     "ask": "This runs for a week. What happens to memory, and what else does it hold?",
     "check": [
      "Resource management in your language."
     ],
     "say": [
      "**The dict only grows**, so with a big catalogue and several currencies it **grows until the process is killed**. I'd **bound it with an LRU and a TTL**: at about **1 KB an entry, 100,000 entries is about 100 MB** per process.",
      "And every miss holds a connection, so I'd **cap concurrent loads** with a semaphore or a bounded pool, so a burst of misses **can't exhaust connections or threads**."
     ],
     "more": [
      "The in-flight map must shrink too: remove on success and failure.",
      "`functools.lru_cache`: bounded but **no TTL**, and on a method it **keeps self alive**.",
      "Power law: a small LRU already gets most hits; say the number."
     ],
     "vis": [
      {
       "title": "Rough size",
       "calc": [
        [
         "1 KB x 100,000",
         "about 100 MB per process"
        ],
        [
         "x 4 instances",
         "about 400 MB, four copies"
        ]
       ]
      }
     ],
     "avoid": "'Memory is cheap.' Unbounded growth is a crash with a delay."
    }
   ]
  },
  {
   "id": "mock-failure",
   "title": "Failures",
   "blocks": [
    {
     "t": "turn",
     "ask": "Pricing goes down for two minutes. Walk me through it.",
     "check": [
      "Timeouts, retries, degradation, not making it worse."
     ],
     "say": [
      "First, **every call needs a timeout**, or requests pile up behind a hung service. Then, if a minute-old price is fine, **keep expired entries and serve them when the refresh fails**: users barely notice.",
      "Retries **only for errors that can pass, a few times, with backoff and jitter**; a **circuit breaker** stops us hammering it. And when it comes back, **jittered TTLs stop everything expiring at once**."
     ],
     "more": [
      "Cache a failure on purpose for a few seconds (negative cache); never by accident.",
      "Without jitter, retries arrive in waves: recovery becomes a second stampede.",
      "Breaker: open after repeated failures, fail fast or serve stale, let one probe through."
     ],
     "vis": [
      {
       "title": "Retries",
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
     "avoid": "'Retry until it works.' That turns two minutes into twenty."
    }
   ]
  },
  {
   "id": "mock-scale",
   "title": "Growth",
   "blocks": [
    {
     "t": "turn",
     "ask": "We go from one instance to twenty. Does it still hold?",
     "check": [
      "What changes when the cache is per process and the fleet grows?"
     ],
     "say": [
      "Each instance has **its own copy**, so a price change has to reach **twenty caches**, and until then **users see different prices on different instances**. Every deploy is **twenty cold caches**, twenty stampedes.",
      "That's when a **shared cache like Redis** earns its place: **one copy, one invalidation**, at the cost of a **network hop and a new failure mode**. I'd keep a **small local cache with a short TTL** in front for the hottest keys."
     ],
     "more": [
      "Coalescing now has to work across processes: a short lock with SET NX and an expiry.",
      "Measure first: hit rate, load on pricing, p99, evictions, the age of served values."
     ],
     "vis": [
      {
       "title": "Two levels",
       "flow": [
        "Request",
        "Local LRU (seconds)",
        "Redis (minutes)",
        "Pricing"
       ],
       "note": "Each level absorbs most of what the next would see; invalidation must reach both."
      }
     ],
     "avoid": "Jumping to Redis in minute one. Earn it."
    }
   ]
  },
  {
   "id": "mock-improve",
   "title": "What first",
   "blocks": [
    {
     "t": "turn",
     "ask": "You've found a lot. If you had a day, what do you change, in what order?",
     "check": [
      "Trade-offs and priorities, not a list."
     ],
     "say": [
      "**First, bound and expire it**: an LRU with a TTL, which fixes the crash and the forever-stale price. **Second, single-flight per key** with no lock across the call. **Third, timeouts and serve-stale** for outages. Then fix the key, and **measure before reaching for Redis**.",
      "The trade-off I keep making is **freshness against load on pricing**, and **the TTL is where that's decided**, so I'd make it explicit, per data type."
     ],
     "avoid": "Proposing everything at once with no order."
    }
   ]
  },
  {
   "id": "mock-close",
   "title": "Your questions",
   "blocks": [
    {
     "t": "turn",
     "ask": "We have a few minutes. Any questions for me?",
     "check": [
      "Interest in their real problems."
     ],
     "say": [
      "**Where does caching bite you most at Mercor today**: staleness, the cost of model calls, or load on a dependency?",
      "And how does the Enterprise team **cache model calls**: responses, embeddings, or the provider's prompt cache?"
     ],
     "more": [
      "Last: 'What does the next round look like?'"
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
 "title": "Curveballs",
 "minutes": 15,
 "lead": "Questions that may come in between. Twenty seconds each.",
 "sections": [
  {
   "id": "mock-curve-all",
   "title": "If they ask",
   "blocks": [
    {
     "t": "turn",
     "ask": "Make it async. What changes?",
     "check": [],
     "say": [
      "**One thread, so no data race on the dict**, but **check-then-act across an await is still a race**. Coalesce with a **dict of Tasks**, and **shield** the shared load so one caller's timeout doesn't cancel it for everyone."
     ]
    },
    {
     "t": "turn",
     "ask": "Is a Python dict thread-safe?",
     "check": [],
     "say": [
      "**One get or set is atomic** in CPython; **check-then-set is not**. The race is **between** operations."
     ]
    },
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
     "ask": "How do you pick the TTL?",
     "check": [],
     "say": [
      "From **how stale is allowed** and **what a miss costs**: short for prices, long for names. **Add jitter.**"
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
     "ask": "How would you test the stampede fix?",
     "check": [],
     "say": [
      "**Fifty threads on one missing key**, a fake client that **counts calls and sleeps**: assert **one call, fifty equal results**. Then make it fail and assert **the next request retries**."
     ]
    },
    {
     "t": "turn",
     "ask": "What about caching LLM calls?",
     "check": [],
     "say": [
      "Two things: **our own response cache**, keyed on **everything that changes the answer**, and **the provider's prompt cache** on the prompt prefix. **I've run the second in production.**"
     ]
    },
    {
     "t": "turn",
     "ask": "Which metrics?",
     "check": [],
     "say": [
      "Hits, misses, loads in flight, evictions, errors, and **the age of values served**: the one people forget."
     ]
    },
    {
     "t": "turn",
     "ask": "What is cache penetration?",
     "check": [],
     "say": [
      "Keys that **never exist always reach the backend**. Cache **'not found' briefly**, or a **Bloom filter** of real ids."
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
       "'**A hundred requests miss at once and all call pricing.**'"
      ],
      [
       "Correctness, performance, reliability",
       "Only performance.",
       "**All three, in an order said up front.**"
      ],
      [
       "Growth and concurrency",
       "Jumps to Redis with no reason.",
       "**Stampede, lock scope, per-process copies**, then shared cache."
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
       "Read part 1, then part 2 one move at a time",
       "**60 min**"
      ],
      [
       "Today",
       "Part 2 again: **say each answer before opening the sheet**",
       "**45 min**"
      ],
      [
       "Today",
       "Find the bugs in `E:\\mercor-cache-mock\\mock1_review` out loud, timed",
       "**20 min**"
      ],
      [
       "Tomorrow morning",
       "Say **'run the Mercor mock'** in chat: live, 30 minutes, critique after",
       "**45 min**"
      ],
      [
       "An hour before",
       "Reread this part and the curveballs. **Nothing new.**",
       "**15 min**"
      ]
     ]
    }
   ]
  }
 ]
});
