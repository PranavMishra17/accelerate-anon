"""Mercor, Software Engineer, Applied AI (Enterprise). Round 2: Friday 23 October 2026, 6:00 PM Eastern.

A 30-minute conversational technical screen on caching with Sophie Guo, Applied AI Engineer. No
coding tools and no LLMs. Round 1 (recruiter-arranged, with Neel Taneja) went well: the evaluation
layer and agents. Todd Dockery at Mercor is the recruiter.

What the screen is: the recruiter's brief (quoted in ROUNDS) and three candidate reports (PracHub,
May and September 2026) agree: a short cached function to review out loud, then concurrency, memory,
failures and staleness. The teaching lives in the tracker: week 5's Caching session (w5a, linked, not
copied) and three wildcard sessions written for this round (wc32 to wc34), shown on the Sessions tab.

Facts about Mercor come from SOURCES, every link opened 19 October 2026. alfred_'s caches were read
from the code on 19 October (wc34). Pranav's story is his own text from E:/_Resume-Curator/INTRO.md,
verbatim. Logistics answers (location, relocation, pay, work authorization, start date) stay in chat.
"""

LOOP = {
    "id": "mercor",
    "title": "Mercor, Applied AI (Enterprise)",
    "company": "Mercor",
    "subtitle": "Round 2: a conversational technical screen on caching",
    # Brand colour for the hub's wordmark. Mercor publishes no single accent: #3923B1, a deep indigo,
    # is among the inline colours on mercor.com/enterprise (read 2026-10-19); #9FA2FF from the same
    # page for the dark surface.
    "brand": "#3923B1", "brand_dark": "#9FA2FF",
    "when_iso": "2026-10-23T18:00:00-04:00",
    "when": "Friday 23 October, 6:00 to 6:30 PM Eastern",
    "who": ("Sophie Guo, Applied AI Engineer at Mercor (MIT, EECS and Biological Engineering; ML before that at J&J "
            "and Cellarity). Round 1 was with Neel Taneja; Todd Dockery is the recruiter."),
    "format": ("Thirty minutes on Google Meet, conversational: no coding tools, no LLMs. Candidates report a short "
               "function that caches an expensive call, handed over for a spoken code review, then deeper questions "
               "on concurrency, memory, failures and staleness. One report adds a quick follow-up on another topic "
               "(retries and idempotency)."),
    "bar": ("From the brief: clear assumptions, concrete examples of what fails, and trade-offs when you propose a "
            "fix, as the workload grows and requests run concurrently. Say the assumption, name the failure with an "
            "example, give the fix and what it costs. Breadth and pace: one report says the screen was rapid-fire."),
    "plan_kicker": "Before Friday, 6 PM",
    "extra": ("<b>Work in this order.</b> "
              "1. Week 5, Caching, in the tracker: <a href=\"../index.html#/s/w5a\" target=\"_blank\" rel=\"noopener\">finish it there</a> "
              "(placement, keys, TTL against invalidation). It is the base; this page does not repeat it. "
              "2. Sessions tab: wc32, the code review out loud (the screen itself), then wc33 (stale data, stampedes, failure) "
              "and wc34 (LLM caches and your own at alfred_). Each step ends on its cheat sheet and key terms. "
              "3. Prep tab: your intro and why Mercor out loud, with the timer. "
              "4. Thursday: say 'run the Mercor mock' in chat for a 30-minute screen, critique after. "
              "5. Friday, an hour before: reread the three cheat sheets of wc32 and the one page of assumptions below."),
}

SESSION_IDS = [("wc32", "1"), ("wc33", "2"), ("wc34", "3")]

PREP_LEAD = ("The teaching is on the Sessions tab and in week 5. Here: how to show up, then your story out loud, "
             "and two drills: the cache review in two minutes, and the stampede.")

SHOW_UP = [
    ("Assumptions before answers.", "Before you judge the code, say what you assume: one process or many, threads or asyncio, how slow compute is, whether it is pure, how stale an answer may be. The brief asks for exactly this."),
    ("Review in a fixed order.", "One caller, concurrency, memory, errors, staleness, visibility. Each with a concrete failure ('two requests miss at once and compute runs twice') and its fix."),
    ("Every fix with its cost.", "A global lock is correct and slows every hit; a TTL bounds staleness and adds misses; a shared cache is consistent and adds a network hop. Say both halves."),
    ("Read the code literally first.", "One reported snippet has await in a non-async function and a set with no value. Catch the plain bugs before the clever ones."),
    ("Python, said precisely.", "One dict operation is atomic under the GIL, check-then-set is not; lru_cache can call the function twice; in asyncio cache the Task, not the coroutine; a failed Task must be evicted."),
    ("Real examples from alfred_.", "The Outlook calendar call shares one in-flight request after Microsoft returned 503s; token refresh has no lock; some maps grow without a cap. Only what you confirmed, and say which you built."),
    ("Keep the pace.", "Thirty minutes, possibly rapid-fire. Two or three sentences per point, then stop and let her pick the next one."),
    ("End with a real question.", "One question for Sophie about how Enterprise deployments handle caching or evaluation, then the process question."),
]

STORY_BLURB = "Your intro, why Mercor, why leave alfred_, and logistics."

# Every outside link, opened 2026-10-19.
SOURCES = [
    {"label": "Mercor Enterprise", "url": "https://mercor.com/enterprise",
     "why": "Discover, Deploy, Improve, Monetize; business experts, forward deployed engineers and a platform for context, connectors and evaluation."},
    {"label": "The posting: Software Engineer, Applied AI (Enterprise)", "url": "https://jobs.generalcatalyst.com/companies/mercor/jobs/77183222-software-engineer-enterprise-applied-ai",
     "why": "Embedded with enterprise customers; integrations, APIs and workflows on Mercor's platform; in person five days a week."},
    {"label": "Sacra: Mercor", "url": "https://sacra.com/c/mercor/",
     "why": "Funding rounds, revenue estimates (gross against net), customers and controversies."},
    {"label": "Fortune: Mercor acquires Deeptune (July 2026)", "url": "https://fortune.com/2026/07/09/ai-unicorn-mercor-acquires-deeptune-brendan-foody-investor-a16z-openai-anthropic/",
     "why": "About $2B annualised revenue in June 2026; Deeptune builds simulation environments where agents practise before live systems."},
    {"label": "TechCrunch: the March 2026 breach (April 2026)", "url": "https://techcrunch.com/2026/04/09/after-data-breach-10b-valued-startup-mercor-is-having-a-month",
     "why": "A breach tied to a compromised open-source dependency (LiteLLM); contractor lawsuits. Know it; don't raise it."},
    {"label": "PracHub: a candidate's report of the caching code review (May 2026)", "url": "https://prachub.com/interview-experiences/mercor-software-engineer-interview-experience-a-product-focused-recruiter-screen-then-sorting-theory-and-a-concurrency-code-review",
     "why": "A cached compute(x) handed over for review; probes: two threads miss, a lock, double-checked locking, lock scope, dict semantics."},
    {"label": "PracHub: a 30-minute screen with an async cache (September 2026)", "url": "https://prachub.com/interview-experiences/mercor-software-engineer-interview-experience-a-rushed-30-minute-screen-on-sorting-probability-and-a-cache-race-condition",
     "why": "A JavaScript Map cache; the interviewer wanted race conditions, locking, memory and eviction."},
    {"label": "PracHub: a rapid-fire screen (September 2026)", "url": "https://prachub.com/interview-experiences/mercor-software-engineer-interview-experience-30-minute-rapid-fire-technical-screen-rejected-after-three-questions",
     "why": "No eviction, the expensive call repeated, errors and input validation; then idempotency and retries for a payment integration."},
]

COMPANY = [
    "Mercor connects AI labs with vetted domain experts (doctors, lawyers, bankers, engineers) who write training data, tasks, rubrics and RL environments. Founded in 2023 in San Francisco by Brendan Foody, Adarsh Hiremath and Surya Midha. A $350M Series C at a $10B valuation (October 2025). Revenue is reported at about $2B annualised in June 2026; that is gross, and most of it is paid out to experts. Customers include Anthropic and OpenAI. It bought Deeptune in July 2026: simulation environments where agents practise before they touch live systems.",
    "APEX is its benchmark family for real professional work (banking, consulting, law, medicine; APEX-Agents and APEX-SWE since), graded with rubrics and a judge model. That is the evaluation layer you talked about with Neel.",
    "Mercor Enterprise, the team you would join, takes the same machinery to large companies: find where agents pay off (Discover), put them in production with custom evaluations wired into the customer's tools (Deploy), review and tune them live (Improve), and license opt-in data to labs (Monetize). It is delivered by business experts and forward deployed engineers on one platform for context, connectors and evaluation. The page cites an incident-response agent that cut median time to mitigation by more than half.",
    "Know, don't raise: a March 2026 breach through a compromised open-source dependency, followed by contractor lawsuits. If it comes up, it is a reason caching and keys matter (what is cached, and for whom).",
]

POSTING = {
    "url": "https://jobs.generalcatalyst.com/companies/mercor/jobs/77183222-software-engineer-enterprise-applied-ai",
    "lead": "Software Engineer, Applied AI on Mercor's Enterprise team: engineering, product and customer success in one role, builders first, embedded with enterprise clients.",
    "facts": [["Team", "Mercor Enterprise"], ["Offices", "San Francisco, New York or London, in person five days a week"],
              ["Round 2", "Friday 23 October, 6:00 PM Eastern, 30 minutes"], ["Interviewer", "Sophie Guo, Applied AI Engineer"]],
    "does": [
        "Embed with enterprise customers to understand technical requirements and business goals.",
        "Architect and implement custom integrations, APIs and workflows on top of Mercor's platform.",
        "Deploy scalable solutions in client environments and drive launches and expansions.",
        "Build internal tools and reusable components that speed up future deployments.",
        "Turn ambiguous enterprise needs into clear technical plans and shipped systems.",
    ],
    "wants": [
        "A computer science or related degree.",
        "Strong fundamentals in a modern language (Python, Go, Rust).",
        "Production systems deployed on AWS, GCP or Azure.",
        "Comfort with customers, and explaining technical ideas to non-technical people.",
        "High ownership in ambiguous, high-stakes work.",
    ],
}

# Round 1 as an outline (his choice); round 2 with the recruiter's brief, quoted.
ROUNDS = [
    {"title": "Round 1: call with Neel Taneja",
     "when": "Before 19 October 2026",
     "who": "Neel Taneja, Mercor",
     "format": "A conversation about your work; you discussed the evaluation layer and agents.",
     "outcome": "Passed. The recruiter wrote that Neel was 'very complimentary' and moved you to the technical screen.",
     "notes": [], "asked": []},
    {"title": "Round 2: conversational technical screen on caching",
     "when": "Friday 23 October 2026, 6:00 to 6:30 PM Eastern",
     "who": "Sophie Guo, Applied AI Engineer",
     "format": "Thirty minutes on Google Meet. No coding tools or LLMs.",
     "outcome": "Held. You think okay-ish: strong on the cache code and the follow-ups, shaky on the sorting complexity. Waiting to hear.",
     "notes": ["How it ran: your intro, a warm-up on the worst sort that still works, then a five-line cache-aside snippet (a dict cache in front of an expensive external call) and its follow-ups, then your questions.",
               "The brief, from the recruiter: \u201cThis technical screen explores how you reason about caching in production systems. Be prepared to discuss how caching affects correctness, performance, and reliability as workloads grow and multiple requests run concurrently. We\u2019ll look for clear assumptions, concrete examples of potential failures, and thoughtful tradeoffs when proposing improvements. To prepare, review caching fundamentals, concurrency concepts, and resource management in your preferred language.\u201d",
               "Your preferred language is Python: say so at the start."],
     "asked": [
         {"q": "Tell me about yourself.", "short": "Intro",
          "said": ["Your intro."], "keep": [], "prep": "say-intro"},
         {"q": "Write a sort that works but is the most inefficient you can think of. What is its time complexity?", "short": "Worst sort that works",
          "said": ["Started from what efficient sorts look like, then an O(n²) loop: find the minimum, append it, repeat (selection sort).",
                   "Joked about random sort. First said O(n^n), then corrected yourself to O(n²)."],
          "land": "The worst sort that still works is bogosort: expected O(n · n!), and with true randomness no worst-case bound at all.",
          "keep": ["**Bogosort:** shuffle, check if sorted, repeat. A shuffle is sorted with probability 1/n!, so it takes n! shuffles on average, each costing O(n): **expected O(n · n!)**. Best case O(n), already sorted.",
                   "**Worst case is unbounded:** random shuffles never guarantee success; the algorithm only finishes with probability 1. That is the monkey-and-typewriter point, said precisely.",
                   "**Deterministic version:** try every permutation in order: worst O(n · n!), and it always finishes.",
                   "**The ladder:** selection or bubble O(n²), stooge sort about O(n^2.71), bogosort expected O(n · n!)."],
          "notes": ["O(n²) is inefficient but normal, not the worst. Your first instinct, O(n^n), was closer to the intended answer than the correction: n! is roughly (n/e)^n."]},
         {"q": "What is the random sort actually doing? Walk me through it.", "short": "Inside random sort",
          "said": ["Jumble the numbers, a validator inside a while loop; estimated O(n³)."],
          "land": "Each round is a shuffle and a check, O(n); the number of rounds averages n!.",
          "keep": ["One round: a Fisher-Yates shuffle, O(n), then an is-sorted check, O(n).",
                   "Rounds until success are geometric with mean n! (distinct values), so the total is expected O(n · n!). Duplicates make it faster, since more orderings count as sorted."],
          "notes": ["O(n³) was the miss: the number of rounds grows like n!, not like n. Count rounds times work per round."]},
         {"q": "Here is a small cache-aside snippet: a dict cache in front of an expensive external call. What can go wrong?", "short": "The cache-aside snippet",
          "said": ["No size limit, so it needs eviction: LRU.",
                   "With multiple processes, contention.",
                   "Staleness: if the source value changes, the cache is stale forever. Invalidate the key on write, and add a TTL."],
          "land": "Correctness first (staleness, the key), then concurrency (the stampede), then memory, then failures.",
          "keep": ["**Name the stampede:** many concurrent misses on one key all call the expensive function. Single-flight: one loads, the rest wait on it.",
                   "**Per-process dicts:** each process has its own copy, so many processes means inconsistency between copies, not contention on one dict. Contention is between threads in one process, or on a shared cache like Redis.",
                   "**Failures:** if the external call raises, nothing is stored; if it returns an error value and that is stored, it is served forever. Add a timeout."],
          "notes": ["Good coverage, and she kept probing, which reads as interest. The two to add next time: the stampede by name, and the per-process copies."]},
         {"q": "If the value is edited all the time, why cache it at all?", "short": "Write-heavy",
          "said": ["Agreed: cache-aside suits read-heavy data. For write-heavy there are other patterns, like write-through."],
          "land": "Cache-aside is for read-heavy data; for write-heavy data, don't cache it, or batch the writes with write-behind if a little loss is fine.",
          "keep": ["Read-heavy, some staleness fine: cache-aside.",
                   "Must read your own write: write-through (every write updates both, reads stay fresh).",
                   "Write-heavy, a little loss fine (counters, view counts): write-behind. Otherwise skip the cache for that value."],
          "notes": ["Right call that cache-aside fits read-heavy work. Write-through does not help write-heavy load: it makes every write slower. It buys freshness, not throughput."]},
         {"q": "How would you avoid race conditions and contention?", "short": "Races",
          "said": ["Compare-and-swap when many processes update one value; a mutex so one thread at a time touches it."],
          "land": "In one process a lock per key, held only around the dict; across processes, atomic operations on the shared cache.",
          "keep": ["**In one process:** a lock per key, held only to check and register, never across the expensive call; single-flight so one thread loads.",
                   "**Across processes:** the cache is shared (Redis): SET NX with an expiry as a short lock, atomic INCR, or optimistic compare-and-swap with a version (WATCH and MULTI, or compare the version on write).",
                   "**Writes to the source:** carry a version or timestamp, so an older write cannot overwrite a newer one."],
          "notes": ["Correct. Next time, tie it to the snippet in one sentence each: where the lock goes, and what changes once the cache is shared."]},
         {"q": "What questions do you have for me?", "short": "Your questions",
          "said": ["Why Enterprise now (the team opened in March): the gap is that only a few frontier companies can do this themselves.",
                   "The pain points she has personally solved recently: she walked through her own work.",
                   "How the team is structured across sales, MVP building and forward deployment: very flexible, no fixed lines yet."],
          "keep": [],
          "notes": ["A good set; she answered at length."]}]},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 45 seconds",
     "when": "Thirty minutes, so the short one. Then stop.",
     "probes": ["What do you own at alfred_?", "Which language do you work in day to day?"],
     "say": [
         "I'm currently a founding LLM engineer at alfred_, where I work across AI agent reliability, memory architecture, evaluation infrastructure, and automation for a product with 5,000-plus active users. A big part of my work has been taking ambiguous problems and building the systems underneath them that make AI actually work reliably in production.",  # verbatim
         "Before that, I worked at an early-stage startup called WheelPrice and did AI research at UIC. What I enjoy most is working across the stack, understanding a real problem, and building something that solves it end to end. That's what caught my attention about Mercor's Enterprise team \u2014 it combines applied AI engineering with customer problems, integrations, and ownership of the final outcome."],  # verbatim
     "swaps": [{"when": "If she asks your language", "line": "Python, mostly, and TypeScript for our edge functions and web app. I'll reason in Python today."}],
     "land": "Production AI reliability at alfred_, and why Enterprise: customer problems you own end to end.",
     "notes": ["Your words from INTRO.md, unchanged."]},
    {"id": "why-mercor", "title": "Why Mercor?", "length": "about 30 seconds",
     "when": "If she asks; a technical screen may not.",
     "probes": ["Why Enterprise and not research?", "What do you know about Mercor Enterprise?"],
     "say": [
         "What interests me is that Mercor is going beyond building AI tools as The role also sits at the intersection of engineering, product, and customer needs, - I enjoy working most. I'd get to solve different problems, build production integrations, and turn what works for one customer into reusable systems for others. This hands-on engineering and direct business impact is particularly appealing to me."],  # verbatim
     "swaps": [{"when": "If she asks what you know", "line": "From what I read, Enterprise finds where agents pay off, deploys them with custom evaluations in the customer's tools, and keeps improving them live. The evaluation part is the work I do at alfred_."}],
     "land": "Engineering, product and customers in one role, and reusable systems out of one-off deployments.",
     "notes": ["Your words from INTRO.md, unchanged. The first sentence breaks off mid-way ('beyond building AI tools as The role also...'): finish it in your own words before Friday."]},
    {"id": "leave", "title": "Why leave alfred_?", "length": "about 30 seconds",
     "when": "If asked.",
     "probes": [],
     "say": [
         "I\u2019m not looking to leave because there\u2019s something fundamentally wrong with alfred_. The reason I'm exploring is more about the direction I want to take my career",  # verbatim
         "I've learned a lot at alfred_ and have had the opportunity to own important parts of a production AI product from the ground up. I've gradually moved beyond just building agent features and into building the systems around the agent \u2014 evaluations, observability, memory, reliability",  # verbatim
         "I'm still there and not looking to leave just for the sake of moving. I'm exploring roles where I can apply that experience to a broader range of problems, work directly with customers, and grow as an engineer who can own both the technical solution and its business outcome. Mercor's Enterprise team seems particularly aligned with that."],  # verbatim
     "land": "Not away from alfred_; toward customers and ownership of the outcome.",
     "notes": ["Your words from INTRO.md, unchanged."]},
    {"id": "logistics", "title": "Logistics they may ask", "length": "a line each",
     "when": "Unlikely in a technical screen. Your answers are in chat, not on this page.",
     "probes": ["In person five days a week in San Francisco?", "Start date?", "Work authorization?"],
     "say": [],
     "land": "One sentence each, then back to the work.",
     "notes": ["Location, relocation, start date and work authorization: your answers from chat."]},
]

QA = []
TABS = ["overview", "prep", "sessions", "rounds", "mocks", "coding", "concurrency"]
SHARED_JS = ["coding/concurrency.js"]   # the Concurrency tab, shared with CODING.html

ASK_3C = [
    {"id": "sophie", "title": "For Sophie", "when": "The last two or three minutes. One or two.",
     "why": "She builds on Enterprise; a question about her work shows you think past the screen.",
     "how": ["Ask one, listen, ask one follow-up on what she said."],
     "items": [
         {"to": "Sophie", "q": "Where does caching actually bite in Enterprise deployments: model calls, customer APIs with rate limits, or the evaluation runs?",
          "loop": "First.", "why": "Ties the screen to the job, and her answer is the real problem you'd work on."},
         {"to": "Sophie", "q": "To get to know the product, what are some recent pain points you've solved, and some that are ongoing work?",
          "loop": "Second.", "why": "Your question from INTRO.md, reworded only for spelling."},
         {"to": "Sophie", "q": "What does the full interview process look like from here, and the rough timeline?",
          "loop": "Last.", "why": "Your question from INTRO.md."}]},
]
ASK = []

TRAPS = []

DRILLS = [
    {"id": "review", "prompt": "Here's a function that caches an expensive call. What would you say in a code review?", "target": "2 minutes", "seconds": 120, "ref": "../index.html#/w/wc32"},
    {"id": "stampede", "prompt": "A hot key expires under load. What happens, and how do you stop it?", "target": "90 seconds", "seconds": 90, "ref": "../index.html#/w/wc33"},
    {"id": "navigate", "prompt": "In mock2_service: where is concurrency capped, where is order kept, and where is the stampede stopped? Go to each line.", "target": "3 minutes", "seconds": 180, "ref": "../index.html#/w/wc33"},
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "45 seconds", "seconds": 45, "ref": "#say-intro"},
]

MOCK_HOW = ("Say 'run the Mercor mock' in chat: Sophie's caching screen, 30 minutes, a snippet to review, no tools; critique after. "
            "For the code version, open E:\\mercor-cache-mock: mock1_review (threads, a cache with planted bugs to review) and "
            "mock2_service (asyncio, a two-tier cache to navigate). The interviewer guide and your map are in private/mercor-mock, local only.")
