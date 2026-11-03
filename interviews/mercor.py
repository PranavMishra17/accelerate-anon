"""Mercor, Software Engineer, Applied AI (Enterprise). The onsite: about five hours in person in downtown San Francisco.

Date to be set, about a week out (target around 10 November 2026), beside the Amazon loop (6, 9, 10 or
11 November), which has priority on those days. Mercor's prep email names three parts: an AI-assisted
coding exercise with a presentation, a practical system design on AI systems, and a behavioral round
(not in scope for these sessions). Round 1 (Neel Taneja) went well; round 2 (Sophie Guo, the caching
screen, 23 October) is kept below, unchanged. Todd Dockery at Mercor is the recruiter.

The teaching lives in the tracker: wc35 (the build), wc36 (AI system design), wc37 (the basics), with
wc32 to wc34 and week 5's w5a as light review. The Plan tab is the day-by-day work order; two mocks run
in chat. Facts about Mercor come from SOURCES, every link opened. Pranav's story is his own text from
E:/_Resume-Curator/INTRO.md, verbatim. Logistics answers stay in chat.
"""

LOOP = {
    "id": "mercor",
    "title": "Mercor, Applied AI (Enterprise)",
    "company": "Mercor",
    "subtitle": "Onsite: about five hours in person in San Francisco",
    # Brand colour for the hub's wordmark. Mercor publishes no single accent: #3923B1, a deep indigo,
    # is among the inline colours on mercor.com/enterprise (read 2026-10-19); #9FA2FF from the same
    # page for the dark surface.
    "brand": "#3923B1", "brand_dark": "#9FA2FF",
    "when_iso": "",
    "when": "Date to be set, about a week out; full day, downtown San Francisco",
    "who": ("Interviewers not named yet. Todd Dockery is the recruiter. Round 1 was with Neel Taneja, round 2 with "
            "Sophie Guo, Applied AI Engineer."),
    "format": ("About five hours, in person, downtown San Francisco. From Mercor's prep email: a coding exercise that is "
               "not an algorithm interview, AI assistance encouraged, then a presentation of what you built; a practical "
               "system design on AI systems; and a behavioral round on judgment and ownership under ambiguity. Candidates "
               "report async build time with a 15 to 30 minute debrief after, a whiteboard design, and an algorithms part."),
    "bar": ("Mercor's one takeaway: show how you think, in a collaborative engineering conversation, not a performance. "
            "Coding: break the problem down, weigh alternatives, recover when stuck, collaborate, deliver a fast working "
            "prototype; narrate, write tests, validate assumptions, say what you optimise for. Design: tradeoffs on latency, "
            "cost, reliability, scale, deployment and observability, plus retrieval, evaluation, failure modes and monitoring. "
            "Why over tool names. Reviewers penalise code you cannot explain."),
    "plan_kicker": "Date to be set; about a week out",
    "extra": ("<b>The work order.</b> "
              "1. Plan tab: day by day from Tuesday 3 November, one to one and a half hours a day, because the Amazon loop has priority "
              "and its days (6, 9, 10 or 11 November) are not fixed. "
              "2. Sessions: wc35, the AI-assisted build and its presentation; wc36, AI system design (candidate search, evaluation, failure); "
              "wc37, the basics the reports say to drill (complexity, hashing, graph search, cache races). "
              "3. Light review: wc32 to wc34 (the cache code review, stale data and stampedes, LLM caches) and "
              "<a href=\"../index.html#/s/w5a\" target=\"_blank\" rel=\"noopener\">week 5's caching</a>. "
              "4. Two mocks in chat: 'run the Mercor onsite design mock' and 'run the Mercor build mock'. "
              "5. The day before: reread the cheat sheets and the logistics list on the Plan tab."),
}

SESSION_IDS = [("wc35", "1"), ("wc36", "2"), ("wc37", "3"), ("wc32", "4"), ("wc33", "5"), ("wc34", "6")]   # the onsite first; wc32 to wc34 (round 2) are the light review

PREP_LEAD = ("The teaching is on the Sessions tab. Here: how to show up, then your story out loud, and the timed drills: "
             "the build presentation, the candidate search opening, a complexity answer, and the earlier cache drills.")

SHOW_UP = [
    ("Make your thinking visible.", "Narrate as you go: what you are about to try, why, and what would change your mind. The brief judges how you break the problem down and recover when stuck."),
    ("Lead with intent.", "Open the presentation with what you set out to build and why, before any code. Then the tradeoffs you made under time pressure."),
    ("Own every AI-written line.", "Read what the model gives you to pull-request quality. Reviewers penalise code the candidate cannot explain. Write your own first answer before you ask it."),
    ("Tests and assumptions, out loud.", "Say the assumption, write the test that checks it, run it. Say what you optimise for: speed to a working prototype, or correctness on the edge cases."),
    ("Scoping is not failure.", "What you did not reach is a deliberate choice. Name it, say why, and say what you would do next and in what order."),
    ("End the build with next steps.", "Two or three, ranked: the next test, the next risk, the next feature. Then stop."),
    ("Think past the code, to production.", "How it scales, where latency or reliability bite, how you know it performs, what happens when an outside service fails, how it is deployed and monitored."),
    ("A teammate, not a performer.", "Ask questions, take hints, and change your mind when the interviewer gives a good reason. It is a conversation."),
    ("Ask which parts allow AI tools.", "The brief says encouraged; one candidate report says an early part did not. Ask early, and ask whether the build prompt is shared in advance."),
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
    {"label": "Jointaro: a senior onsite report (October 2025)", "url": "https://www.jointaro.com/interviews/companies/mercor/experiences/senior-software-engineer-united-states-october-28-2025-no-offer-negative-c87ecf87",
     "why": "AI tools allowed at the onsite; the design prompt reported as a candidate search system built with RAG."},
    {"label": "Canva: AI interview success, an interviewer's guide", "url": "https://www.canva.dev/blog/engineering/ai-interview-success/",
     "why": "How an interviewer scores an AI-assisted build: skeleton ready, scope first, own answer before the model, pull-request quality, three failure modes."},
    {"label": "Chip Huyen: a generative AI platform", "url": "https://huyenchip.com/2024/07/25/genai-platform.html",
     "why": "The skeleton for an AI design: retrieval, guardrails, routing, caches, orchestration, observability."},
    {"label": "Anthropic: demystifying evals for AI agents", "url": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
     "why": "Code, model and human graders; one judge per rubric dimension; calibrating judges to humans."},
    {"label": "Anthropic: contextual retrieval", "url": "https://www.anthropic.com/news/contextual-retrieval",
     "why": "Contextual embeddings, BM25 and reranking; top-20 retrieval failure falls from 5.7% to 1.9%."},
    {"label": "Dealroom: Mercor at $2B gross run rate", "url": "https://dealroom.co/news/137121-mercor-doubles-to-2b-gross-revenue-run-rate-as-ai-labs-buy-expert-data/",
     "why": "The $2B figure is gross annualised revenue (June 2026)."},
    {"label": "The Next Web: the $20B talks and Deeptune", "url": "https://thenextweb.com/news/mercor-20-billion-valuation-deeptune-acquisition",
     "why": "Contractors keep roughly 60 to 70%, so net revenue is a fraction of the gross figure."},
    {"label": "TechCrunch: Mercor in talks at a $20B valuation (July 2026)", "url": "https://techcrunch.com/2026/07/09/mercor-is-in-talks-for-a-20b-valuation/",
     "why": "Reported talks; a close is unconfirmed, so say 'reported in talks'."},
]

COMPANY = [
    "Mercor connects AI labs with vetted domain experts (doctors, lawyers, bankers, engineers) who write training data, tasks, rubrics and RL environments. Founded in 2023 in San Francisco by Brendan Foody, Adarsh Hiremath and Surya Midha. A $350M Series C at a $10B valuation (October 2025). Gross annualised revenue passed $2B in June 2026. Say gross: contractors keep roughly 60 to 70%, so net revenue is far smaller. Talks at about $20B were reported in July 2026 and a close is unconfirmed: say 'reported in talks'. Revenue leans on a few labs, with OpenAI and Anthropic the anchors.",
    "It bought Deeptune in July 2026: simulation environments where agents practise before they touch live systems. APEX is its benchmark family for real professional work (APEX-Agents and APEX-SWE since), graded with rubrics and a judge model. That is the evaluation layer you talked about with Neel.",
    "Mercor Enterprise, the team you would join, takes the same machinery to large companies: find where agents pay off (Discover), put them in production with custom evaluations wired into the customer's tools (Deploy), review and tune them live (Improve), and license opt-in data to labs (Monetize). Delivered by business experts and forward deployed engineers on one platform. The posting says engineering, product and customer success in one role. No source describes the team's internal work, so ask.",
    "Know, don't raise: the March 2026 breach through a compromised open-source dependency (LiteLLM) and the contractor lawsuits, and Scale AI's September 2025 suit over a former employee, which Mercor disputes. If the breach comes up, it bears on how you design for customer data: what is cached, and for whom. Culture reports describe an intense in-person environment; ask about hours directly.",
]

POSTING = {
    "url": "https://jobs.generalcatalyst.com/companies/mercor/jobs/77183222-software-engineer-enterprise-applied-ai",
    "lead": "Software Engineer, Applied AI on Mercor's Enterprise team: engineering, product and customer success in one role, builders first, embedded with enterprise clients.",
    "facts": [["Team", "Mercor Enterprise"], ["Offices", "San Francisco, New York or London, in person five days a week"],
              ["Onsite", "About five hours, downtown San Francisco; date to be set, about a week out"], ["Interviewers", "Not named yet"]],
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
    {"title": "Round 3: the onsite",
     "when": "Date to be set, about a week out",
     "who": "Not named yet",
     "format": ("About five hours, in person, downtown San Francisco. Mercor's email: a coding exercise (AI assistance encouraged, then a presentation), "
                "a practical system design on AI systems, and a behavioral round. Candidates report async builds with a 15 to 30 minute debrief after each, "
                "system design on a whiteboard, and an algorithms part."),
     "outcome": "To come.",
     "notes": ["The brief's one takeaway: show how you think; a collaborative engineering conversation, not a performance.",
               "Open points to ask early: which parts allow AI tools, whether the build prompt is shared in advance, who the interviewers are, and the real hours."],
     "asked": []},
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
TABS = ["overview", "plan", "prep", "sessions", "rounds", "mocks", "coding", "concurrency"]
SHARED_JS = ["coding/concurrency.js"]   # the Concurrency tab, shared with CODING.html

ASK_3C = [
    {"id": "onsite", "title": "For the onsite interviewers", "when": "The last minutes of each part. One or two each.",
     "why": "They build on Enterprise; a question about the work shows you think past the exercise.",
     "how": ["Ask one, listen, ask one follow-up on what they said."],
     "items": [
         {"to": "Any engineer", "q": "What does a first month look like for someone on the Enterprise team?",
          "loop": "Early in the day.", "why": "Makes the job concrete and shows you are planning to start."},
         {"to": "An Applied AI engineer", "q": "How do you build the evaluations for a customer: who writes the rubric, and how do you know the judge can be trusted?",
          "loop": "After the design part.", "why": "Ties to the evaluation work you own at alfred_ and to what Mercor sells."},
         {"to": "The coding interviewer", "q": "Which parts of today allow AI tools, and what do you look for in how people use them?",
          "loop": "Before the build, if not already said.", "why": "The brief says encouraged; one report says an early part did not."},
         {"to": "Any engineer", "q": "To get to know the product, what are some recent pain points you've solved, and some that are ongoing work?",
          "loop": "Any time.", "why": "Your question from INTRO.md, reworded only for spelling."},
         {"to": "The recruiter or last interviewer", "q": "What does the full interview process look like from here, and the rough timeline?",
          "loop": "Last.", "why": "Your question from INTRO.md."}]},
    {"id": "sophie", "title": "For Sophie (round 2, kept)", "when": "The last two or three minutes. One or two.",
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
    {"id": "present", "prompt": "Present what you built: intent, the tradeoffs you made under time, what you cut and why, next steps.", "target": "8 minutes", "seconds": 480, "ref": "../index.html#/w/wc35"},
    {"id": "search", "prompt": "Design a candidate search system with RAG. Open it: requirements, the shape, where it fails, how you would know it works.", "target": "5 minutes", "seconds": 300, "ref": "../index.html#/w/wc36"},
    {"id": "complexity", "prompt": "State the time and space complexity of what you just wrote, and of the worst sort that still works.", "target": "2 minutes", "seconds": 120, "ref": "../index.html#/w/wc37"},
]

MOCK_HOW = ("Two onsite mocks run in chat. Say 'run the Mercor onsite design mock': 45 minutes, candidate search with RAG, then production push-back. "
            "Say 'run the Mercor build mock': a 60 to 90 minute build brief with your own AI tool, then a 10-minute presentation and debrief questions. "
            "Critique after each. The interviewer guides are in private/mercor-mock/onsite.html, local only. "
            "The round 2 caching mock still runs as 'run the Mercor mock'; for its code version open E:\\mercor-cache-mock: "
            "mock1_review (threads, a cache with planted bugs) and mock2_service (asyncio, a two-tier cache to navigate).")

# ------------------------------------------------------------------ the plan: Tuesday 3 to Monday 9 November
def _d(date, hours, focus, *items):
    return {"date": date, "hours": hours, "focus": focus,
            "items": [dict(zip(("k", "t", "href", "m"), it)) for it in items]}


SES = lambda sid, label, m: ("plan", label, "../index.html#/w/" + sid, m)
REV = lambda sid, label, m="20 min": ("revise", "Light review: " + label, "../index.html#/w/" + sid, m)

PLAN = {
    "title": "The onsite: Tuesday 3 to Monday 9 November",
    "lead": ("One to one and a half hours a day, because the Amazon loop has priority on these days and its days (6, 9, 10 or 11 November) are not "
             "fixed. The Mercor date is also not set, about a week out. If Amazon takes a day, skip that day here and carry its items forward; "
             "nothing on this page depends on the order of the days except that the build comes before its presentation. Tick items as you go."),
    "split": [
        ["The build", "about 35%", "wc35 and the build mock: an AI-assisted prototype, tests said aloud, then the presentation."],
        ["AI system design", "about 35%", "wc36 and the design mock: candidate search, evaluation, failure modes, production."],
        ["The basics", "about 20%", "wc37: complexity, hashing, graph search and cache races, the soft spot from round 2."],
        ["Light review", "about 10%", "wc32 to wc34 and week 5's caching, only the cheat sheets."],
    ],
    "weeks": [
        {"id": "onsite", "title": "Tuesday 3 to Monday 9 November",
         "note": "Short days on purpose. Amazon comes first; the days are a sequence, not calendar slots.",
         "days": [
             _d("2026-11-03", "1 h", "Read what the day is, then the build session.",
                ("other", "Prep tab: the show-up list, read once", "#/prep", "10 min"),
                SES("wc35", "Session wc35: the AI-assisted build, steps 1 to 3", "50 min")),
             _d("2026-11-04", "1.5 h", "Finish the build session and time one presentation.",
                SES("wc35", "Session wc35: the rest, then its cheat sheets", "40 min"),
                ("other", "Drill: the build presentation, 8 minutes, aloud", "#/prep", "20 min"),
                ("other", "Canva's interviewer guide, read for the three failure modes", "https://www.canva.dev/blog/engineering/ai-interview-success/", "15 min")),
             _d("2026-11-05", "1.5 h", "AI system design: candidate search first.",
                SES("wc36", "Session wc36: AI system design, candidate search and retrieval", "50 min"),
                ("other", "Chip Huyen's generative AI platform post, against your search design", "https://huyenchip.com/2024/07/25/genai-platform.html", "25 min"),
                ("other", "Drill: the candidate search opening, 5 minutes, aloud", "#/prep", "15 min")),
             _d("2026-11-06", "1 h", "Evaluation and failure modes. Amazon may take this day.",
                SES("wc36", "Session wc36: evaluation, failure and production, the rest", "40 min"),
                ("other", "Anthropic on evals: graders, one judge per dimension, calibration", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", "20 min")),
             _d("2026-11-07", "1.5 h", "The basics, and the first mock.",
                SES("wc37", "Session wc37: the basics (complexity, hashing, graph search, cache races)", "40 min"),
                ("other", "Drill: complexity, 2 minutes, aloud", "#/prep", "10 min"),
                ("other", "Mock in chat: say 'run the Mercor onsite design mock' (45 minutes, critique after)", "#/mocks", "60 min")),
             _d("2026-11-08", "1.5 h", "The build mock, then light review.",
                ("other", "Mock in chat: say 'run the Mercor build mock' (brief, build with your AI tool, presentation, debrief)", "#/mocks", "75 min"),
                REV("wc32", "wc32, the cache code review: cheat sheet only", "10 min")),
             _d("2026-11-09", "1 h", "Light. Rest before the date; Amazon may fall on this day.",
                REV("wc33", "wc33, stale data and stampedes: cheat sheet only", "10 min"),
                REV("wc34", "wc34, LLM caches and your own: cheat sheet only", "10 min"),
                ("revise", "Week 5's caching session, the key terms only", "../index.html#/s/w5a", "10 min"),
                ("loop", "Logistics for the day: laptop charged with your AI tool signed in and a skeleton repo ready, charger and spare cable, a notebook and pen, water, the address and the way there", "", "15 min"),
                ("loop", "Questions to ask: reread the onsite list on the Prep tab", "#/prep", "10 min"))
         ]},
    ],
}

