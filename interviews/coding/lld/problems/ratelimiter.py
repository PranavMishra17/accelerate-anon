"""Rate limiter. A drill in the Locker shape: RateLimiter, TokenBucket and Rule; time is passed in, so a run is deterministic.
Token bucket is the core. The sliding window log, rules per tier and a lock per client are extensions with code."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the limiter: the one call a service makes ----
ALLOW = method('''
    def allow(self, client_id: str, now: float) -> tuple[bool, float]:
        """
        Core logic:
          1. Check there is a client id
          2. Find that client's bucket (a new client gets a full one)
          3. Ask the bucket to take a token at this time
          4. Return its answer: allowed, or denied with how long to wait
        Edge cases:
          1. Empty client id -> error
          2. First request from a client -> full bucket, so a first burst is allowed
        """
        if not client_id:                                  # Edge 1
            raise RateLimitError("client_id is required")
        bucket = self._bucket_for(client_id, now)          # Step 2: named now, written in the helpers
        return bucket.try_consume(now)                     # Step 3: the bucket owns the algorithm; Step 4: pass its answer on
''')

HELPERS = method('''
    def _bucket_for(self, client_id: str, now: float) -> TokenBucket:
        if client_id not in self.buckets:                  # Edge 2: made on first sight, full
            self.buckets[client_id] = TokenBucket(self.rule, now)
        return self.buckets[client_id]
''')

# ---- the bucket: refill and take ----
TRY_CONSUME = method('''
    def try_consume(self, now: float) -> tuple[bool, float]:
        """
        Core logic:
          1. Refill for the time that has passed
          2. If at least one whole token is left, take it and allow
          3. Otherwise deny, and say how long until one token exists
        Edge cases:
          1. Denied -> the wait is (1 - tokens) / rate, so the caller can send a retry-after
          2. A denied request takes nothing, so retrying costs no tokens
        """
        self._refill(now)                                  # Step 1: lazy refill, no timer thread
        if self.tokens >= 1:                               # Step 2: a token is one whole unit
            self.tokens -= 1
            return True, 0.0
        wait = (1 - self.tokens) / self.rule.refill_per_sec   # Edge 1: seconds until tokens reaches 1
        return False, wait                                 # Step 3 and Edge 2: tokens untouched
''')

REFILL = method('''
    def _refill(self, now: float) -> None:
        """
        Core logic:
          1. Work out the time since the last refill
          2. Add that time times the rate to the tokens
          3. Cap the tokens at capacity
          4. Remember this time as the last refill
        Edge cases:
          1. Time has not moved, or went backwards -> nothing to add, and last_refill stays
          2. A long idle gap -> the cap stops the bucket growing past capacity
        """
        if now <= self.last_refill:                        # Edge 1: also stops a backwards clock from adding tokens
            return
        elapsed = now - self.last_refill                   # Step 1: seconds, so the rate is tokens per second
        # Step 2 and 3: tokens are a float, so half a second at 2 per second adds exactly one token
        self.tokens = min(self.rule.capacity, self.tokens + elapsed * self.rule.refill_per_sec)   # Edge 2
        self.last_refill = now                             # Step 4
''')

HEAD = D('''\
    from dataclasses import dataclass


    class RateLimitError(Exception):    # one error type for every bad input
        pass
    ''')

RULE = D('''\


    @dataclass(frozen=True)              # a rule is a value; every bucket of a tier can share one
    class Rule:
        """The burst size and the steady rate."""
        capacity: int                    # the most tokens a bucket holds, which is the biggest burst
        refill_per_sec: float            # tokens added per second, which is the long-run rate

        def __post_init__(self):
            if self.capacity <= 0 or self.refill_per_sec <= 0:   # rejected when built, so no bucket ever holds a bad rule
                raise RateLimitError("capacity and refill rate must be positive")
    ''')

BUCKET = D('''\


    class TokenBucket:
        """One client's tokens. It refills itself from the time passed in."""

        def __init__(self, rule: Rule, now: float):
            self.rule = rule                         # capacity and rate
            self.tokens = float(rule.capacity)       # a float, because it refills in fractions; full on first sight
            self.last_refill = now                   # refill by the time since this
    ''')

LIMITER = D('''\


    class RateLimiter:
        """The entry point: finds a client's bucket and asks it. It never reads a clock."""

        def __init__(self, rule: Rule):
            self.rule = rule                         # one rule for everyone to start with
            self.buckets = {}                        # client_id -> TokenBucket, made on first use
    ''')

CORE = (HEAD + RULE + BUCKET + in_class(TRY_CONSUME, REFILL) + LIMITER + in_class(ALLOW, HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    limiter = RateLimiter(Rule(capacity=3, refill_per_sec=2))
    for _ in range(4):
        print("a at 0.0:", limiter.allow("a", 0.0))     # a burst of 3 is allowed, the 4th waits half a second
    print("a at 0.5:", limiter.allow("a", 0.5))         # half a second at 2 per second refilled one token
    print("a at 0.5:", limiter.allow("a", 0.5))         # no time passed, so no new token
    print("b at 0.5:", limiter.allow("b", 0.5))         # b has its own full bucket
    print("a at 100:", sum(limiter.allow("a", 100.0)[0] for _ in range(5)), "of 5 allowed")   # idle, but capped at 3
    for bad in (lambda: Rule(0, 1), lambda: limiter.allow("", 1.0)):
        try:
            bad()
        except RateLimitError as e:
            print(e)
    ''')
DEMO_OUT = ("a at 0.0: (True, 0.0)\na at 0.0: (True, 0.0)\na at 0.0: (True, 0.0)\na at 0.0: (False, 0.5)\n"
            "a at 0.5: (True, 0.0)\na at 0.5: (False, 0.5)\nb at 0.5: (True, 0.0)\na at 100: 3 of 5 allowed\n"
            "capacity and refill rate must be positive\nclient_id is required\n")

# ---- extensions ----
EXT_WINDOW = D('''\
    from collections import deque


    class SlidingWindowLog:
        """Same call as TokenBucket, so the limiter can hold either. It remembers every allowed request."""

        def __init__(self, rule: Rule, now: float):
            self.limit = rule.capacity                         # at most this many requests ...
            self.window = rule.capacity / rule.refill_per_sec  # ... in any window this long, which keeps the same average rate
            self.hits = deque()                                # times of allowed requests, oldest first

        def try_consume(self, now: float) -> tuple[bool, float]:
            while self.hits and self.hits[0] <= now - self.window:   # drop the ones that left the window
                self.hits.popleft()
            if len(self.hits) < self.limit:
                self.hits.append(now)
                return True, 0.0
            return False, self.hits[0] + self.window - now     # the oldest hit leaving frees one slot


    class RateLimiter:
        def __init__(self, rule: Rule, algorithm=TokenBucket):
            ...
            self.algorithm = algorithm                         # a class with __init__(rule, now) and try_consume(now)

        def _bucket_for(self, client_id: str, now: float):
            if client_id not in self.buckets:
                self.buckets[client_id] = self.algorithm(self.rule, now)   # the one changed line
            return self.buckets[client_id]
    ''')

EXT_TIERS = D('''\
    class RateLimiter:
        def __init__(self, rules: dict, algorithm=TokenBucket):
            self.rules = rules                       # tier name -> Rule, such as {"free": ..., "pro": ...}
            ...

        def allow(self, client_id: str, now: float, tier: str = "free") -> tuple[bool, float]:
            ...
            bucket = self._bucket_for(client_id, tier, now)

        def _bucket_for(self, client_id: str, tier: str, now: float):
            if client_id not in self.buckets:
                if tier not in self.rules:
                    raise RateLimitError(f"no tier {tier!r}")
                self.buckets[client_id] = self.algorithm(self.rules[tier], now)   # the tier picks the Rule, once
            return self.buckets[client_id]
    ''')

EXT_LOCK = D('''\
    from threading import Lock


    class TokenBucket:
        def __init__(self, rule: Rule, now: float):
            ...
            self.lock = Lock()                       # one per client, so two clients never wait on each other

        def try_consume(self, now: float) -> tuple[bool, float]:
            with self.lock:                          # refill and take are one step
                ...


    class RateLimiter:
        def __init__(self, rule: Rule):
            ...
            self.lock = Lock()                       # guards the dict while a new bucket is added

        def _bucket_for(self, client_id: str, now: float):
            with self.lock:                          # two first requests must not make two buckets
                ...
    ''')

# the final file: core + sliding window + rules per tier
F_BUCKET = D('''\


    class TokenBucket:
        """One client's tokens. It refills itself from the time passed in."""

        def __init__(self, rule: Rule, now: float):
            self.rule = rule
            self.tokens = float(rule.capacity)
            self.last_refill = now
    ''')

F_WINDOW = D('''\


    class SlidingWindowLog:
        """Same call as TokenBucket. It remembers the time of every allowed request."""

        def __init__(self, rule: Rule, now: float):
            self.limit = rule.capacity                         # at most this many in any window
            self.window = rule.capacity / rule.refill_per_sec  # the same average rate as the bucket
            self.hits = deque()                                # allowed times, oldest first

        def try_consume(self, now: float) -> tuple[bool, float]:
            while self.hits and self.hits[0] <= now - self.window:   # drop what left the window
                self.hits.popleft()
            if len(self.hits) < self.limit:
                self.hits.append(now)
                return True, 0.0
            return False, self.hits[0] + self.window - now     # the oldest hit leaving frees a slot
    ''')

F_LIMITER = D('''\


    class RateLimiter:
        """The entry point: finds a client's bucket and asks it."""

        def __init__(self, rules: dict, algorithm=TokenBucket):
            self.rules = rules                       # tier name -> Rule
            self.algorithm = algorithm               # TokenBucket or SlidingWindowLog
            self.buckets = {}                        # client_id -> one of them
    ''')

F_ALLOW = method('''
    def allow(self, client_id: str, now: float, tier: str = "free") -> tuple[bool, float]:
        if not client_id:
            raise RateLimitError("client_id is required")
        bucket = self._bucket_for(client_id, tier, now)
        return bucket.try_consume(now)

    def _bucket_for(self, client_id: str, tier: str, now: float):
        if client_id not in self.buckets:
            if tier not in self.rules:                       # new edge: an unknown tier
                raise RateLimitError(f"no tier {tier!r}")
            self.buckets[client_id] = self.algorithm(self.rules[tier], now)   # the tier is read once, on first sight
        return self.buckets[client_id]
''')

FINAL = (HEAD.replace("from dataclasses import dataclass", "from collections import deque\nfrom dataclasses import dataclass")
         + RULE + F_BUCKET + in_class(TRY_CONSUME, REFILL) + F_WINDOW + F_LIMITER + in_class(F_ALLOW))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    rules = {"free": Rule(2, 1.0), "pro": Rule(4, 2.0)}
    tb = RateLimiter(rules)
    print("free", [tb.allow("a", 0.0)[0] for _ in range(3)], tb.allow("a", 0.0))   # a burst of 2, then a 1 second wait
    print("pro", sum(tb.allow("p", 0.0, "pro")[0] for _ in range(6)), "of 6")       # the pro rule allows a burst of 4
    sw = RateLimiter(rules, algorithm=SlidingWindowLog)                             # the window is 2 seconds for free
    for t in (0.0, 1.0, 1.5, 2.0):
        print("window at", t, sw.allow("a", t))        # the 0.0 hit leaves the window at 2.0, so 2.0 is allowed
    try:
        sw.allow("a", 3.0, "gold")
    except RateLimitError as e:
        print(e)
    ''')
FINAL_OUT = ("free [True, True, False] (False, 1.0)\npro 4 of 6\nwindow at 0.0 (True, 0.0)\nwindow at 1.0 (True, 0.0)\n"
             "window at 1.5 (False, 0.5)\nwindow at 2.0 (True, 0.0)\n")


PROBLEM = {
    "id": "ratelimiter", "title": "Rate limiter", "part_id": "lld-ratelimiter", "n": 13,
    "part_title": "Rate limiter", "minutes": 45,
    "lead": "A rate limiter round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. Time is passed into every call, so a run is deterministic. Token bucket is the core: refill from elapsed time, then take. The follow-up is always to swap the algorithm, so the sliding window log is an extension with code.",
    "prompt": "Design a rate limiter.",
    "evidence": "LeetCode Discuss Mar 2025 (token bucket, then sliding window) and Aug 2026 (fixed window, sliding window, token bucket, then Redis and distributed). Asked as a design, then pushed through algorithms.",
    "drill": "part 13, Rate limiter.",

    "clarify": {
        "capabilities": [("Limit by what?", "A client id: a user, an API key or an IP, as a string"),
                         ("What is the limit?", "N requests per second in the long run, with a small burst allowed"),
                         ("What does the caller learn?", "Allowed or denied, and how long to wait before retrying")],
        "errors": [("What happens when a client is over its limit?", "Deny with a retry-after; the HTTP 429 is someone else's job"),
                   ("A bad limit, such as zero or negative?", "Reject it when the rule is built"),
                   ("A request with no client id?", "Reject it")],
        "scope": [("Which algorithm?", "Token bucket to start; the interviewer may ask for others after"),
                  ("How does time work? A real clock?", "No: the caller passes the current time in seconds with each request, so a run is deterministic"),
                  ("One server or many? Different limits per plan?", "One server and one rule first; many servers and plans are follow-ups")],
    },
    "clarify_hint": "Limit by what, and what is the limit. Allowed or denied, and a wait. A bad limit. Which algorithm. How time works. One server or many, one rule or per plan.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** The key and the limit come first, because a burst plus a steady rate is exactly what a token bucket holds. Then bad rules, and last how time works: if the caller passes the time in, I never sleep and the whole run is deterministic.",
    "clarify_why": "Every question changes a class or a method. A burst plus a rate gives Rule's two numbers. The wait in the answer is why allow returns a pair. Time passed in is why no class reads a clock, and the algorithm question tells me to put it behind one call, try_consume.",
    "answers": "The limit is per client id, a string. A rule has a burst size and a steady rate. The caller learns allowed or denied, and how long to wait. Over the limit is a denial with a retry-after; the HTTP layer is out. A zero or negative rule and a missing client id are rejected. Token bucket first. The caller passes the time in with each request. One server, one rule to start.",
    "playback": ["Thanks, that's clear. **So: one limiter, a bucket per client, a burst plus a steady rate, and the caller passes the time in.** A denied request gets a retry-after. A bad rule or a missing client id is an error. Out of scope: the HTTP response, many servers, persistence, and different limits per plan for now."],

    "requirements": [
        ["A service asks whether a request from a client may go ahead.", "The limiter finds that client's bucket and takes a token if there is one", "Denies, with a retry-after, when the bucket is empty; an error for an empty client id"],
        ["Each client has its own bucket, full the first time it is seen.", "A bucket refills steadily with elapsed time, up to its capacity", "Time is passed in with each call; a time that has not moved, or goes backwards, adds nothing"],
        ["A rule sets the capacity (the burst) and the refill rate.", "A zero or negative rule is rejected when the Rule is built"],
    ],
    "out_of_scope": ["the HTTP layer and the 429 response", "many servers", "persistence", "different limits per plan (an extension)", "a real clock"],
    "req_hint": "A service asks, a bucket per client refilling with time, a rule with two numbers.",
    "req_say": "From your answers I get three requirements. **Each is something that happens, and each becomes a method or a class: allow, the bucket's refill, the Rule.** Requirement 2 is the hard one: refill from the time that has passed, never above capacity.",
    "req_why": "Requirement 1 is allow, 2 is TokenBucket.try_consume with its refill, and 3 is Rule. The retry-after in requirement 1 is why try_consume returns a pair.",

    "entities": [("Request", False, "Only its client id and time matter; both are arguments"),
                 ("User / API key / IP", False, "The client id itself, a string; not modelled"),
                 ("Rule", True, "Capacity and refill rate, validated once when built; one value so per-plan rules come cheaply"),
                 ("TokenBucket", True, "Tokens left and when it last refilled, for one client; it answers try_consume"),
                 ("RateLimiter", True, "Holds the rule and one bucket per client; the entry point"),
                 ("Clock", False, "Dropped: the time is a number passed into each call"),
                 ("Response, HTTP 429", False, "Someone else's job; allow returns a pair")],
    "ent_hint": "What does a bucket need to remember between requests? Where does the burst size live?",
    "ent_say": "I underline the nouns. **The limiter, the bucket and the rule stay.** A rule looks like two numbers, but it holds the check that they are positive, and a plan would swap in a different one. A request is a client id and a time, so it is two arguments. The clock goes away because the caller passes the time in.",
    "ent_why": "Three classes. Rule earns its class because it rejects a bad limit once, in one place, and a tier is another Rule. TokenBucket holds the two fields the refill needs.",

    "classes": [
        {"name": "RateLimiter", "state": ["rule: Rule  # req 3: every bucket follows it",
                                          "buckets: Map<client_id, TokenBucket>  # req 2: one bucket per client, made on first use"],
         "behaviour": ["allow(client_id, now) -> (allowed: bool, retry_after: seconds) | error  # req 1: the one call a service makes",
                       "_bucket_for(client_id, now) -> TokenBucket  # req 2: find or make the client's bucket"]},
        {"name": "TokenBucket", "state": ["rule: Rule  # capacity to cap at, rate to refill at",
                                          "tokens: float  # what is left to spend; fractional as it refills",
                                          "last_refill: seconds  # refill by the time since this"],
         "behaviour": ["try_consume(now) -> (allowed, retry_after)  # req 1: take a token or say when to retry",
                       "_refill(now) -> void  # req 2: tokens grow with time, up to capacity"]},
        {"name": "Rule", "state": ["capacity: int  # req 3: the burst size",
                                   "refill_per_sec: float  # req 3: the steady rate"],
         "behaviour": ["__post_init__() -> void | error  # req 3: reject a zero or negative rule when built"]},
    ],
    "class_hint": "The limiter holds a bucket per client. A bucket holds its tokens and when it last refilled. The rule holds the two numbers.",
    "class_say": "**I start from the methods and ask what each one has to read.** allow has to find a client's bucket, so the limiter keeps a map of them. try_consume has to know how many tokens are left and how long since the last refill, so those are the bucket's state, and it needs the capacity and the rate, which come from the Rule. Time is never state: it comes in as an argument.",
    "class_why": "The limiter finds the bucket; the bucket decides. That one call, try_consume(now), is the seam: a sliding window class with the same call drops in without touching allow.",
    "class_qa": [{"ask": "Why is time an argument, and not read inside the bucket?",
                  "say": "Because then nothing in the design sleeps or reads a clock. **The caller passes the time in, so I can show every case in one run and a test needs no sleep.** In production, one line at the top reads time.monotonic() and passes it down.",
                  "explain": ["Use a monotonic clock, not wall time: wall time can jump backwards, which is why _refill ignores a time that has not moved forward."]},
                 {"ask": "Why does the bucket hold floats?",
                  "say": "Because it refills in fractions. **At 2 tokens per second, half a second is exactly one token,** and a request needs one whole token to pass. An integer version stores milli-tokens and compares against 1000; I would say that and keep the float for clarity."}],

    "map": {"center": ("RateLimiter", "allow(client_id, now)"),
            "owned": [("TokenBucket", "tokens, last_refill"), ("Rule", "capacity, refill rate")],
            "uses": [("now (seconds)", "passed in, not read")]},

    "skeleton": {"q": "First the small pieces: the error, Rule with its check, TokenBucket's __init__, and the limiter's __init__.",
                 "hint": "Rule is a frozen dataclass that rejects zero or negative numbers. The bucket starts full and remembers when. The limiter holds the rule and a dict of buckets.",
                 "code": HEAD + RULE + BUCKET + LIMITER,
                 "why": "These come straight from the - state lines. The bucket starts full, which is what lets a first burst through."},
    "methods": [
        {"name": "allow", "q": "Start with the most interesting public method: allow(client_id, now). Core logic and edge cases as comments, then the code. Name the helper.",
         "hint": "Check the client id, bucket = self._bucket_for(client_id, now), return bucket.try_consume(now).", "code": ALLOW,
         "why": "Three lines of real work, written at the level you would say out loud. The algorithm is the bucket's job, so the limiter never knows how refill works."},
        {"name": "TokenBucket.try_consume", "q": "TokenBucket.try_consume(now): take a token, or say how long to wait.",
         "hint": "Refill first. One whole token or more: take it. Otherwise deny, and the wait is how much is missing divided by the rate.", "code": TRY_CONSUME,
         "why": "Refill and take happen together, in this order. A denied request takes nothing, and the wait is (1 - tokens) / rate, so the caller can send a retry-after."},
        {"name": "TokenBucket._refill", "q": "TokenBucket._refill(now): grow the tokens by the time that has passed.",
         "hint": "Elapsed times rate, added, capped at capacity. Skip it if time has not moved forward.", "code": REFILL,
         "why": "Computed when a request arrives, so there is no timer and an idle client costs nothing. The min with capacity is why a long idle gap is still only one burst."},
    ],
    "helpers": [
        {"q": "The limiter's helper: _bucket_for.",
         "hint": "Look the client up. If it is new, make a full bucket from the rule and the current time.",
         "code": HELPERS,
         "why": "One find-or-make in one place. The new bucket starts at the time of the first request, so a first burst is allowed."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "Rule holds and validates two numbers, TokenBucket refills and takes for one client, RateLimiter maps clients to buckets."),
            ("Open/closed", "A new algorithm is a new class with try_consume(now). allow is not edited."),
            ("Liskov substitution", "A sliding window class works anywhere TokenBucket does: the same call, the same answer shape, allowed or retry-after."),
            ("Interface segregation", "No interface until something varies. The bucket has one call, try_consume."),
            ("Dependency inversion", "Time is a number passed in, so nothing reads a clock. The limiter is handed its Rule (or its rules, and the algorithm class, once those vary)."),
        ],
        "varies": [
            ("Token bucket, sliding window or fixed window", "Strategy, once there are two", "each algorithm a class with try_consume(now); the limiter holds the class"),
            ("Limits per plan", "No pattern: a dict", "tier name -> Rule; the tier picks the Rule once"),
            ("Two requests, one client at once", "No pattern: a lock", "a lock per client around refill and take"),
            ("Many servers", "No pattern: a store", "buckets in Redis, one atomic script, the store's clock"),
        ],
    },
    "extensions": [
        {"ask": "Swap in a sliding window.",
         "say": "The bucket already sits behind one call, try_consume(now). **The sliding window log is a second class with that call, and the limiter is handed the class,** so allow never changes. The log keeps the time of every allowed request in a queue, drops the ones that left the window, and allows if fewer than the limit remain. The wait is when the oldest one leaves. A fixed window lets 2N through across a boundary, which is why I would not start there.",
         "code": EXT_WINDOW, "code_title": "Sliding window log",
         "short_q": "Other algorithms", "short_a": "one try_consume(now) interface; sliding window log = a deque of times, pop expired, compare to the limit; fixed window allows 2N at a boundary"},
        {"ask": "Different limits for free and pro clients.",
         "say": "The limiter holds a dict from tier name to Rule, and allow takes a tier. **The tier picks the Rule once, when the client's bucket is made,** and after that nothing knows about tiers. An unknown tier is an error.",
         "code": EXT_TIERS, "code_title": "Rules per tier",
         "short_q": "Limits per plan", "short_a": "dict of tier -> Rule; the tier picks the Rule when the bucket is made"},
        {"ask": "Two requests for one client at once.",
         "say": "Refill and take must be one step, or two requests can both see the last token. **A lock per client, so two clients never wait on each other,** plus a lock around the dict so two first requests do not make two buckets. If the buckets live in a store, the same idea is one atomic operation.",
         "code": EXT_LOCK, "code_title": "A lock per client",
         "short_q": "Two requests at once", "short_a": "refill and take as one step: a lock per client, one lock for the dict; or an atomic store operation"},
        {"ask": "A million clients, most seen once. Memory?",
         "say": "Idle buckets pile up. A bucket that has refilled to full is the same as a new one, so **drop buckets that are full and idle,** or evict the least recently used when the map is too big. Dropping is safe because the next request makes an identical full bucket.",
         "short_q": "Idle clients pile up", "short_a": "drop buckets that are full and idle; or LRU eviction"},
    ],
    "faq": [("Why refill on each request and not with a timer?", "A timer needs a thread per client or a sweep over all of them. Computing the refill from the elapsed time when a request arrives costs nothing for an idle client and gives the same answer."),
            ("Why does a fixed window allow 2N?", "N requests in the last moment of one window and N in the first moment of the next are both within their own window, so 2N pass in a moment. The sliding window and the bucket do not have this edge."),
            ("Many servers?", "Move the counters to Redis and make refill and take one atomic script. Use the store's clock, because the servers' clocks differ."),
            ("Is a deque the answer to the sliding window?", "No, it is only the queue. The answer is to drop what left the window, then compare the count to the limit. A list with pop(0) works too, but each pop is O(n).")],

    "summary": ["**Three classes.** The RateLimiter finds a client's TokenBucket, made full on first sight, and asks it to take a token. The bucket first refills from the time since the last refill, capped at capacity, then takes one token or denies with the wait. The Rule holds the burst and the rate and rejects a bad pair when it is built. Time is passed in, so nothing reads a clock.",
                "**It extends in one place each time:** a sliding window is a second class with the same call, tiers are a dict of Rules, a lock goes per client around refill and take, and idle buckets are dropped when full."],

    "golden": [
        ("Time is passed in, never read inside the bucket.", "the limiter can be shown, and tested, without sleeping."),
        ("Refill is computed from elapsed time when a request arrives; there is no timer thread.", "no background work, and an idle client costs nothing."),
        ("allow returns the decision and the wait, not only a bool.", "the caller can send a retry-after, which was in the requirements."),
        ("Refill and take are one step.", "it is the race in this design, and the one the follow-up goes after."),
        ("The bucket sits behind one call, try_consume(now).", "swapping to a sliding window then touches no other class, which is the usual follow-up."),
        ("Name the boundary problem of a fixed window: 2N requests across a window edge.", "it shows you know why the other algorithms exist."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with two extensions applied (the sliding window log, rules per tier), and a run at the bottom.",
    "final_title": "ratelimiter.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "the free bucket lets 2 through and asks the third to wait 1.0; the pro rule allows a burst of 4; the window allows two, denies at 1.5 until the 0.0 hit leaves, then allows at 2.0; an unknown tier is an error.",
}
