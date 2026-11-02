"""Rate limiter. Cheat only (one screen in part 0.5). Token bucket is the core; the other algorithms are extensions."""

PROBLEM = {
    "id": "ratelimiter", "title": "Rate limiter",
    "prompt": "Design a rate limiter.",
    "evidence": "LeetCode Discuss Mar 2025 (token bucket, then sliding window) and Aug 2026 (fixed window, sliding window, token bucket, then Redis and distributed). Asked as a design, then pushed through algorithms.",

    "clarify": {
        "capabilities": [("Limit by what?", "A key: a user, an API key or an IP"),
                         ("What is the limit?", "N requests per time, with a small burst allowed"),
                         ("What does the caller learn?", "Allowed or denied, and how long to wait")],
        "errors": [("What happens when a key is over its limit?", "Deny with a retry-after; the HTTP 429 is someone else's job"),
                   ("A bad limit, such as zero or negative?", "Reject it at construction")],
        "scope": [("One server or many?", "One to start; many is the follow-up"),
                  ("Different limits per endpoint or plan?", "Later; one rule first")],
    },

    "requirements": [
        ["A service asks whether a request from a key may go ahead.", "The limiter takes a token from that key's bucket if there is one", "Denies, with a retry-after, when the bucket is empty"],
        ["Each key has its own bucket, full the first time it is seen.", "A bucket refills steadily with time, up to its capacity", "Time comes from an injected clock"],
        ["A rule sets the capacity (the burst) and the refill rate.", "A zero or negative rule is rejected when the limiter is built"],
    ],
    "out_of_scope": ["the HTTP layer and the 429 response", "many servers", "persistence"],

    "entities": [("Request", False, "Only its key matters; the key is a string"),
                 ("User / API key / IP", False, "The key itself; not modelled"),
                 ("Rule", True, "Capacity and refill rate; one object so per-plan rules come cheaply"),
                 ("TokenBucket", True, "Tokens left and when it last refilled, for one key"),
                 ("RateLimiter", True, "Holds the rule and one bucket per key"),
                 ("Clock", False, "A function passed in; tests fake it")],

    "classes": [
        {"name": "RateLimiter", "state": ["rule: Rule  # req 3: every bucket follows the same rule",
                                          "buckets: Map<key, TokenBucket>  # req 2: one bucket per key, made on first use",
                                          "now: function returning seconds  # injected clock, so tests can fake time"],
         "behaviour": ["allow(key) -> (allowed: boolean, retry_after: seconds)  # req 1: the one call a service makes"]},
        {"name": "TokenBucket", "state": ["tokens: float  # what is left to spend; fractional as it refills",
                                          "last_refill: seconds  # refill by the time since this"],
         "behaviour": ["try_take(now) -> (allowed, retry_after)  # req 1: take a token or say when to retry",
                       "_refill(now) -> void  # req 2: tokens grow with time, up to capacity"]},
        {"name": "Rule", "state": ["capacity: int  # req 3: the burst size",
                                   "refill_per_sec: float  # req 3: the steady rate"], "behaviour": []},
    ],
    "class_say": "**I start from the one method the requirements gave me: allow(key).** It has to read that key's token count and when it last refilled, so each key gets a bucket with those two fields. The limiter keeps a map of buckets and a rule for capacity and rate. Time comes in as a function, so the refill can be tested.",

    "map": {"center": ("RateLimiter", "allow(key)"),
            "owned": [("TokenBucket", "tokens, last_refill"), ("Rule", "capacity, refill")],
            "uses": [("now()", "the clock, a function")]},

    "methods": [
        {"name": "allow", "logic": ["Find the key's bucket, making a full one if it is new", "Ask the bucket to take a token at the current time", "Return its answer: allowed, or denied with a retry-after"]},
        {"name": "try_take", "logic": ["Refill first: tokens grow by elapsed time times the rate, capped at capacity", "If at least one token, take it and allow", "Otherwise deny; retry-after is the time until one token exists"]},
    ],

    "design_check": {
        "lead": "Check each choice against SOLID in a minute. The algorithm is what varies, and try_take is the seam.",
        "solid": [
            ("Single responsibility", "Rule holds numbers, TokenBucket does the refill and take for one key, RateLimiter maps keys to buckets."),
            ("Open/closed", "A new algorithm is a new class with try_take(now). allow is not edited."),
            ("Liskov substitution", "A fixed or sliding window class works anywhere TokenBucket does: same try_take answer, allowed or retry-after."),
            ("Interface segregation", "No interface until something varies. The bucket has one call, try_take."),
            ("Dependency inversion", "The clock is a function passed in, so tests fake it. The limiter is handed its Rule."),
        ],
        "varies": [
            ("Fixed or sliding window", "Strategy", "each algorithm a class with try_take(now)"),
            ("Idle keys pile up", "No pattern: a map", "drop full idle buckets, or LRU eviction"),
            ("Two requests, one key", "No pattern: a lock", "refill and take as one step per key"),
            ("Many servers", "No pattern: a store", "buckets in Redis, one atomic script, the store's clock"),
        ],
    },
    "extensions": [
        {"ask": "Swap in a fixed window or a sliding window.",
         "say": "Put the bucket behind one call, try_take(now), and each algorithm becomes a class with that call. **The limiter picks one and never knows which.** A fixed window lets 2N through at a boundary, so say why a sliding window or a token bucket is better.",
         "short_q": "Other algorithms", "short_a": "one try_take(now) interface; the limiter does not know which; fixed window allows 2N at a boundary"},
        {"ask": "A million keys, most seen once. Memory?",
         "say": "Idle buckets pile up. A bucket that has refilled to full is the same as a new one, so **drop buckets that are full and idle,** or evict the least recently used when the map is too big.",
         "short_q": "Idle keys pile up", "short_a": "drop buckets that are full and idle; or LRU eviction"},
        {"ask": "Two requests for one key at once.",
         "say": "Refill and take must be one step. **A lock per key,** or one lock to start, or an atomic operation if the buckets live in a store.",
         "short_q": "Two requests at once", "short_a": "refill and take as one step: a lock per key, or an atomic store operation"},
        {"ask": "Many servers share the limit.",
         "say": "Move the counters to Redis and make refill and take one atomic script. **Use the store's clock,** because the servers' clocks differ.",
         "short_q": "Many servers", "short_a": "buckets in Redis, refill and take as one atomic script, the store's clock"},
    ],

    "golden": [
        ("Time is a function passed in, never read inside the bucket.", "the limiter can be shown, and tested, without sleeping."),
        ("Refill is computed from elapsed time when a request arrives; there is no timer thread.", "no background work, and an idle key costs nothing."),
        ("allow returns the decision and the wait, not only a bool.", "the caller can send a retry-after, which was in the requirements."),
        ("Refill and take are one step.", "it is the race in this design, and the one the follow-up goes after."),
        ("Name the boundary problem of a fixed window: 2N requests across a window edge.", "it shows you know why the other algorithms exist."),
    ],
}
