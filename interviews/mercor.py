"""Mercor, Software Engineer, Applied AI (Enterprise). The onsite: about five hours in person in downtown San Francisco.

Date to be set, about a week out (target around 10 November 2026), beside the Amazon loop (6, 9, 10 or
11 November), which has priority on those days. Mercor's prep email names three parts: an AI-assisted
coding exercise with a presentation, a practical system design on AI systems, and a behavioral round
(not in scope for these sessions). Round 1 (Neel Taneja) went well; round 2 (Sophie Guo, the caching
screen, 23 October) is kept below, unchanged. Todd Dockery at Mercor is the recruiter.

The teaching lives in the tracker: wc35 (the build), wc36 (AI system design), wc37 (the basics), wc38 (the search build), with
wc32 to wc34 and week 5's w5a as light review. The overview lists the work order; the Learn tab holds the case studies; two mocks run
in chat. Facts about Mercor come from SOURCES, every link opened. Pranav's story is his own text from
E:/_Resume-Curator/INTRO.md, verbatim. Logistics answers stay in chat.
"""

LOOP = {
    "id": "mercor",
    "title": "Mercor, Applied AI (Enterprise)",
    "company": "Mercor",
    "subtitle": "Onsite, Wednesday 11 November: coding, system design, algorithms, GTM",
    # Brand colour for the hub's wordmark. Mercor publishes no single accent: #3923B1, a deep indigo,
    # is among the inline colours on mercor.com/enterprise (read 2026-10-19); #9FA2FF from the same
    # page for the dark surface.
    "brand": "#3923B1", "brand_dark": "#9FA2FF",
    "when_iso": "2026-11-11T10:00:00-08:00",
    "when": "Wednesday 11 November 2026, 10:00 AM to 2:30 PM Pacific, in person at Mercor HQ, San Francisco",
    "who": ("Coding review: Bradley Moon, Member of Technical Staff. System design: Ishwari Nalgirkar. Algorithms: Pranav Mereddy, "
            "Tech Lead Manager. GTM: Will Ledingham, Engagement Manager, and Lily Liu, Principal, both Enterprise AI. Set-up and wrap-up: "
            "Maggie Cassidy. Leadership chats may be slotted into spare time."),
    "format": ("The agenda, Pacific time: 10:00 set-up; 10:15 coding challenge, one hour solo and screen-recorded; 11:15 coding review, 30 minutes; "
               "11:45 break; 12:15 SWE system design, 45 minutes; 1:00 break; 1:15 algorithms, 30 minutes; 1:45 break; 2:00 GTM, 15 minutes; "
               "2:15 wrap-up. The calendar block runs longer in case leadership chats are added."),
    "bar": ("Coding: data structures, graph reasoning, correctness under constraints, explaining and extending your code live. No LLM tools, "
            "no Google search or Gemini, no IDE plugins; any language, Python recommended. System design: a backend system end to end: data "
            "model and schema, API, block diagram, behaviour under concurrent load, recovery from failures, the trade-offs. No code. "
            "Algorithms: real architecture and scaling problems, discussion-based; not LeetCode, not system design. GTM: communication, "
            "product sense, user empathy, how you handle users and stakeholders."),
    "plan_kicker": "Things to do for round 3, Wednesday 11 November",
    "extra": ("<b>Things to do for round 3, in order.</b> Every item links to where it lives. "
              "<ol>"
              "<li><b>System design brush-up.</b> <a href=\"#/learn/sd-brushup\">Learn: the brush-up</a>: <a href=\"../index.html#/s/w1a\" target=\"_blank\" rel=\"noopener\">w1a</a>, <a href=\"../index.html#/s/w4e\" target=\"_blank\" rel=\"noopener\">w4e</a>, <a href=\"../index.html#/s/w4a\" target=\"_blank\" rel=\"noopener\">w4a</a>, <a href=\"../index.html#/s/w5e\" target=\"_blank\" rel=\"noopener\">w5e</a> first.</li>"
              "<li><b>Coding challenge, 10:15, no AI and no Google.</b> <a href=\"#/coding/mercor-onsite-code\">Coding 7: referral network and task scheduler</a>, one timed solo hour each in a plain editor, then defend every line. Warm up on <a href=\"#/coding/problems\">Coding 6: four problems</a>; <a href=\"#/coding/concurrency\">Coding 4: concurrency</a> if threads come up in the review.</li>"
              "<li><b>Algorithms, 1:15.</b> <a href=\"#/coding/mercor-onsite-algo\">Coding 8: the reported problems</a> (comparator, exchange rates, friend network, a million IDs, weighted top-k), then <a href=\"#/coding/mercor-infra-algo\">Coding 9: infrastructure and scaling</a>, said aloud with the numbers. <a href=\"../index.html#/w/wc37\" target=\"_blank\" rel=\"noopener\">wc37</a> for complexity.</li>"
              "<li><b>System design, 12:15.</b> <a href=\"#/learn/m-round\">Learn: the system design round</a>: how to run 45 minutes, the job scheduler, contractor payouts, Ticketmaster, other prompts. <a href=\"../index.html#/w/wc36\" target=\"_blank\" rel=\"noopener\">wc36</a> step 1 for the checklist.</li>"
              "<li><b>GTM, 2:00, and a possible leadership chat.</b> <a href=\"../index.html#/w/wc39\" target=\"_blank\" rel=\"noopener\">wc39</a>, then <a href=\"#/prep\">Prep: GTM round, Leadership chat and your questions</a>.</li>"
              "<li><b>Mocks in chat.</b> Say 'run the Mercor coding mock', 'run the Mercor design mock' or 'run the Mercor GTM mock'.</li>"
              "<li><b>Optional, not on the agenda.</b> The AI build: <a href=\"../index.html#/w/wc35\" target=\"_blank\" rel=\"noopener\">wc35</a>, <a href=\"../index.html#/w/wc38\" target=\"_blank\" rel=\"noopener\">wc38</a>, <a href=\"#/coding/mercor-onsite-build\">Coding 10</a>; <a href=\"#/lld\">the LLD tab</a>; the AI designs on the Learn tab.</li>"
              "<li><b>On the day.</b> Photo ID and a charger. Ask early whether any round ends the day early, and confirm the coding rules before you start.</li>"
              "</ol>"),
}

SESSION_IDS = [("wc37", "1"), ("wc36", "2"), ("wc39", "3"), ("wc35", "4"), ("wc38", "5"), ("wc32", "6"), ("wc33", "7"), ("wc34", "8")]   # the 11 Nov agenda first (basics, design, GTM); wc35 and wc38 (the AI build) optional; wc32 to wc34 light review

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
    ("Expect a solo hour, then a review.", "AceOffer's synthesis of 20 reports: about 60 minutes alone and screen-recorded, then 30 minutes of review. In the Applied AI version, Google for syntax but no LLMs in that hour, and no tests given. Write your own tests."),
    ("Clarify an under-specified prompt before coding.", "Reports say the referral network leaves 'flow centrality' deliberately vague. State your reading, ask, and only then build."),
    ("The search build allows LLMs, and is scored.", "About 75 minutes building against an evaluation endpoint, then 15 minutes on how you used the LLMs, the design and debugging. Baseline early, one change at a time, a log of score per change (wc38)."),
    ("Rounds may be eliminatory.", "One report says a candidate who failed system design was sent home at noon. Ask the end time and whether each round decides the day, and do not save your best for the afternoon."),
    ("Expect a direct question on pace.", "Mercor works fast. Answer with a real example of moving quickly and keeping quality, not a claim."),
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
     "when": "Wednesday 11 November 2026, 10:00 AM to 2:30 PM Pacific",
     "who": "Bradley Moon (coding review), Ishwari Nalgirkar (system design), Pranav Mereddy (algorithms), Will Ledingham and Lily Liu (GTM); Maggie Cassidy (set-up, wrap-up)",
     "format": ("Coding challenge: the link arrives by email on the day; one hour of solo work, no kickoff, screen-recorded; then 30 minutes of live "
                "review and collaborative coding. No LLM tools, no Google search or Gemini, no IDE plugins. Focus: data structures, graph reasoning, "
                "correctness under constraints, explaining and iterating. System design, 45 minutes, live: a backend system end to end (schema, API, "
                "block diagram, concurrent load, failure recovery, trade-offs), whiteboard, no code. Algorithms, 30 minutes, live, discussion: real "
                "architecture challenges, infrastructure decisions and scaling strategies; not LeetCode, not system design. GTM, 15 minutes: "
                "communication, product sense, user empathy, users and stakeholders."),
     "outcome": "To come.",
     "notes": ["Confirmed by Mercor on 3 November: no candidate-search build and no AI anywhere in the coding challenge. The build material on this page is now optional.",
               "The brief's one takeaway: show how you think; a collaborative engineering conversation, not a performance.",
               "Open points to ask early: which parts allow AI tools, whether the build prompt is shared in advance, who the interviewers are, and the real hours.",
               "From AceOffer's synthesis of 20 candidate reports (3 Nov 2026, https://aceoffer.app/interviews/mercor/interview-process; paraphrased there, not verbatim prompts):",
               "Coding, about 90 minutes: 60 alone and screen-recorded, then 30 of review. In the Applied AI version, Google for syntax but no LLMs in the first hour, and no tests given. Prompts reported: a three-part referral network where 'flow centrality' is deliberately under-specified, and a two-part task scheduler.",
               "Algorithms, 30 to 45 minutes, discussion only: sorting or top-k with a faulty comparator is the most reported (minimise comparison calls, then wall-clock time when each call is slow); also exchange rates across currency pairs, and friend-network search with few API calls.",
               "System design, 45 minutes: a distributed job scheduler or work orchestration, and candidate search for a job description.",
               "Candidate-search build, about 90 minutes: 75 building with LLMs allowed against an evaluation endpoint, 15 discussing how you used the LLMs, the design and the debugging.",
               "Eliminatory rounds are possible: one report says a candidate who failed system design was sent home at noon. Days ran noon to 4 or 5 pm. An Applied AI variant is three hours: the referral-network coding round plus the search build.",
               "Expect a direct question on pace, and answer with a real example."],
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

QA = [
    {"group": "GTM round", "blurb": "Fifteen minutes with an Engagement Manager and a Principal, Enterprise AI. Pointers, not scripts: remember the bold line, then tell it your way. Session wc39 teaches each one.", "items": [
        {"q": "The four stories to have ready (yours, about 90 seconds each)", "short": "Four stories",
         "a": ["**A 30 to 60 second introduction.** Current role, the most relevant experience, one or two depth areas, why this role. Your intro on this page is the base.",
               "**A stakeholder story.** A time you listened, clarified what they needed, and changed course. Pick it from your work; tell it in your words.",
               "**A plain-language story.** A time you explained a technical constraint simply to a non-technical person.",
               "**An honest-no story.** A time you said no or reset expectations and kept their trust.",
               "**The shape for each:** situation in one sentence, task in one, action in two or three short sentences, a result with one number. Then close: 'Does that answer it?'"],
         "land": "Four stories, reused across questions, each about 90 seconds with one number.",
         "notes": ["These are prompts, not answers: each story has to be yours. Say 'capture' in chat with the story in your words and it goes in as you said it.", "Practise aloud with a 90-second timer; if one runs long, cut a point, do not speed up."]},
        {"q": "What do you know about Mercor Enterprise, and what would you improve in how it is sold or delivered?", "short": "Product sense on Enterprise", "learn": {"read": [{"url": "https://mercor.com/enterprise", "label": "Mercor Enterprise (the product page)", "why": "Discover, Deploy, Improve, Monetize in Mercor's own words. Read it once before the call."}, {"url": "https://www.youtube.com/watch?v=MtZTf-2JH2g", "label": "Learn Product Sense in 9 Minutes (DataInterview)", "why": "10 minutes. A frame for thinking about a product as its user would: user, pain, options, trade-off."}]}, "tests": "Did you learn the product, and can you think about it as a customer would.",
         "a": ["**Four parts, one loop.** Discover finds where agents pay off, Deploy puts them in the customer's tools with custom evaluations, Improve tunes them live, Monetize is opt-in data licensing.",
               "**Lead with one number.** The incident-response agent cut median time to mitigation by over 50%. Say 'they report'. It shows an evaluation-defined goal with an operational result.",
               "**Name the hard part.** Mercor's APEX-Agents work found models finish under 25% of long professional tasks, often failing on ambiguity and context. So a customer's messy real work is harder than a demo.",
               "**Then a customer's questions.** Who grades the agent, what happens when it is unsure, how does it stay good after launch. Ask them as questions, not as criticism."],
         "land": "I know the offer, one number, the real difficulty, and what a customer would ask.",
         "notes": ["No public report of this round exists. Mercor's figures are anonymised case studies on its Enterprise page; never present them as yours."]},
        {"q": "A customer is unhappy: their agent was good last week and is making mistakes now. What do you do?", "short": "Quality dropped", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=846ZWzRznjo", "label": "How to De-escalate Calls with Angry or Agitated Customers (Myra Golden)", "why": "8 minutes. Acknowledge the impact before you explain anything."}, {"url": "https://fde.academy/blog/forward-deployed-engineer-interview-questions", "label": "FDE Academy: forward deployed engineer interview questions (free to read)", "why": "The unhappy-customer scenarios: acknowledge first, then diagnose, and keep what you tell the client apart from what you fix."}]}, "tests": "Acknowledge, then diagnose, with a plan and a time.",
         "a": ["**Acknowledge first.** Say it is hitting their team and that you will have a first diagnosis by a time you name.",
               "**Three real examples.** Ask what worse means, when it started, and for the actual failures.",
               "**Replay before and after.** Your eval harness replays real traces: run the same cases and see whether quality moved or the input changed.",
               "**Say it in two tracks.** What you tell the customer, and what you do technically, at the same time."],
         "land": "Acknowledge, three examples, replay the same cases, report in plain words."},
        {"q": "How do you handle a stakeholder who wants something that will not solve their problem?", "short": "Handling a stakeholder", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=16c_phbGgNE", "label": "What to Say When the Answer Is No (Myra Golden)", "why": "4 minutes. Agree with the goal, say what you can do, then the limit."}, {"url": "https://getperspective.ai/blog/forward-deployed-engineer-interview-questions-2026-prep-guide", "label": "Perspective AI: FDE interview questions, 2026 guide (free to read)", "why": "The 'customer demands a feature that will not solve their problem' question, and what interviewers grade: process over conclusion."}]}, "tests": "Can you say no without losing the person.",
         "a": ["**Agree with the goal.** Start from what they are trying to achieve, not from the feature.",
               "**Ask what sits behind it.** The request is often a guess at a solution.",
               "**Be honest about the risk.** An answer-anything box sounds sure and is sometimes wrong, and that loses trust.",
               "**Offer the version that works, with a number.** A smaller first step, sources shown, and a way to measure it."],
         "land": "I validate the goal, reframe the scope, and keep the relationship."},
        {"q": "Tell me about a time you worked with a non-technical user.", "short": "A non-technical user", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=-Y6YmuqGLpY", "label": "Forward Deployed Engineer Behavioral Mock Interview (Aced)", "why": "27 minutes. A real FDE answers behavioural questions; hear how a good story sounds when it is short and concrete."}, {"url": "https://www.aced.io/guides/cognition-forward-deployed-engineer-interview", "label": "Aced: Cognition FDE interview guide (account prompt on page)", "why": "What a simulated customer call tests: structure fast, plain words, stay calm on a surprise question."}]}, "tests": "Real empathy, a real example, plain words.",
         "a": ["**Everyday users, not engineers.** alfred_ has over 5,000 active users who talk to an assistant about email and calendar.",
               "**Plain-language rules.** About 98% of rules are made from chat. I added a check that warns when a new rule matches none of their recent mail.",
               "**Show the reason.** I built a read-only tool that answers why was I notified, so trust grows when a user can see why.",
               "**Say the limit.** It is a consumer product, not an enterprise engagement. What carries over is asking what they need and measuring it."],
         "land": "Plain-language rules, a check that warns, and a tool that explains why.",
         "notes": ["Add one real moment of your own: a user report or a non-technical teammate's question. If you have none, say so and use the tool you built; that is true."]},
        {"q": "How would you measure whether a pilot worked?", "short": "Measuring a pilot", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=UlPn9GOCswE", "label": "5 Rules for Successful Startup Pilots, POCs, Trials (Dreamit)", "why": "8 minutes. Success criteria agreed before the pilot starts, and what happens after."}, {"url": "https://hamel.dev/blog/posts/evals/", "label": "Hamel Husain: Your AI Product Needs Evals (free to read)", "why": "Why an evaluation set is what lets you say a change made it better. Your eval harness story sits here."}]}, "tests": "Metrics, baseline, expansion rule.",
         "a": ["**Baseline first.** Measure how the work goes today, or the pilot proves nothing.",
               "**One outcome and one guardrail.** For example share handled without a person, and the errors that should not happen.",
               "**An evaluation set made with their experts.** It is what lets you say a change made it better. Mercor's HR case used 132 expert-graded runs.",
               "**Write the expansion and stop rule before you start.** When both numbers hold for two weeks, add the next request type."],
         "land": "Baseline, one outcome, one guardrail, and the rule written first."},
        {"q": "What would you ask a new enterprise customer in the first meeting?", "short": "Discovery questions", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=_DbSgU5naDQ", "label": "How To Run A Discovery Call (Patrick Dang)", "why": "12 minutes. Goal, current process, cost of the problem, who decides: the order of a first meeting."}, {"url": "https://fde.academy/blog/forward-deployed-engineer-interview-questions", "label": "FDE Academy: scoping and discovery scenarios (free to read)", "why": "Ask two or three targeted questions before proposing anything: success, owner, constraints, cost of failure."}]}, "tests": "Ask before solving.",
         "a": ["**The goal and who decides.** A named person, not a team.",
               "**One real case, start to finish.** Where it starts, who touches it, where it goes wrong, how long it takes.",
               "**What a wrong answer costs.** It sets how much a person must check.",
               "**What cannot change.** Data they cannot share, systems, security review, sign-off."],
         "land": "Goal, one real case, cost of a wrong answer, constraints."},
        {"q": "Explain to a non-technical executive why an AI system gives a different answer to the same question.", "short": "Why the output varies", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=EN8jVkv0kiw", "label": "Why Everyone Should Know About AI Evals (ByteByteGo)", "why": "9 minutes. Because wording varies, you test a fixed set of cases instead of trusting one run."}, {"url": "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency", "label": "Anthropic docs: increase output consistency (free to read)", "why": "What makes outputs steadier: fixed formats, examples, grounding in retrieved facts. Matches your 'facts stable, wording free' line."}]}, "tests": "Plain words, an analogy from their world.",
         "a": ["**Say it is expected.** Not a bug.",
               "**Two good analysts.** Ask both the same question and the wording will differ.",
               "**Facts stable, wording free.** In your memory work the model picks from real items and code attaches names and owners.",
               "**Test a fixed set.** So you can see if the answers on the things that matter ever change."],
         "land": "Wording varies, facts should not, and here is how I check."}]},
    {"group": "Leadership chat", "blurb": "Why Mercor, why now, why leave, two years out, and pace. Built on your own words in INTRO.md and the scripts on this tab (Your story), which stay as you wrote them. Pointers to weave a story around.", "items": [
        {"q": "Why Mercor, and why now?", "short": "Why Mercor, why now", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=x-4MewJpaso", "label": "Why Do You Want to Work Here? (Jeff Su)", "why": "9 minutes. Tie your past work to something specific about them, not praise."}, {"url": "https://mercor.com/enterprise", "label": "Mercor Enterprise (the product page)", "why": "Pick one thing here to name: custom evaluations tied to each client's quality bar."}]}, "tests": "Fit with Enterprise, and a reason for the timing.",
         "a": ["Your verbatim answer is in Your story, Why Mercor. These are the INTRO.md pointers to weave in.",
               "**Evaluations are the product here, and they are my core work.** I built the eval harness and the production-failure scanner. Mercor measures whether AI does real professional work.",
               "**Engineering, product and customer at once.** Finding where agents pay off, deploying them into real tools, improving them live. It is the vertical slice I already own, across many customers.",
               "**Reusable systems out of one-off deployments.** Turning each deployment into shared connectors and eval templates.",
               "**The stakes are real.** Reliability failures cost something, and that is where I get better fastest."],
         "land": "Evals at the centre, a slice I already own, many customers.",
         "notes": ["Why now: Enterprise is early and growing; ask them rather than assert it."]},
        {"q": "Why leave alfred_?", "short": "Why leave", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=QSPGdAvnUv4", "label": "Why Are You Leaving Your Current Job? (Jeff Su)", "why": "8 minutes. Pull toward, not push away; no criticism of the current place."}]}, "tests": "Pull toward, not push away.",
         "a": ["Your verbatim answer is in Your story, Why leave alfred_.",
               "**Nothing is wrong at alfred_.** I have owned real parts of a production AI product from early on and learned a lot.",
               "**From agent features to the systems around agents.** Evals, observability, memory, reliability. I want to apply that to many problems and customers, not one product.",
               "**Own the outcome with the customer.** The customer, the technical solution and the business result together, and Enterprise is built that way."],
         "land": "Toward customers and ownership of the outcome."},
        {"q": "Where do you want to be in two years?", "short": "Two years", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=ClmHniKlt6k", "label": "Where Do You See Yourself in 5 Years (Jeff Su)", "why": "7 minutes. Show ambition that fits the role you are applying for."}]}, "tests": "Ambition that fits a hands-on role.",
         "a": ["From your INTRO.md goals, in your words.",
               "**Somewhere agentic engineering is at the frontier.** Running against real stakes, where getting it wrong has weight, which is the fastest way I know to get good.",
               "**Hard, ambiguous problems handed to me.** Someone the team can give a messy problem to without much hand-holding.",
               "**Still in the code.** I want to be able to call the direction and still build it, because the judgment comes from hitting the failure modes myself."],
         "land": "Frontier work, trusted with ambiguity, hands still on the code."},
        {"q": "Mercor moves fast and the hours are intense. How do you feel about the pace?", "short": "The pace question", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=55YF0Ff5owc", "label": "Tell Me About a Time You Worked Under Pressure (CareerVidz)", "why": "8 minutes. Answer with one concrete example, which is the shape you planned."}]}, "tests": "A real example, not a claim.",
         "a": ["**Answer with an example, not a claim.** Over about three months I shipped dozens of production changes on a live system with paying users.",
               "**Speed with a safety net.** My eval harness and failure scanner are why I can move quickly and still know what broke.",
               "**One result.** Notification delivery went from about 90 seconds to about 3, found and fixed in production.",
               "**Then ask.** What the real hours and rhythm look like on Enterprise. It shows you want the true answer."],
         "land": "Fast with evidence, and I asked what the pace really is.",
         "notes": ["Culture reports describe an intense in-person environment. Do not argue with it; answer with how you work."]},
        {"q": "What questions do you have for us?", "short": "Your questions", "learn": {"read": [{"url": "https://www.youtube.com/watch?v=gOOFLK655y4", "label": "Strategic Questions to Ask at the End of the Job Interview (Cass Thompson)", "why": "13 minutes. Questions about the work, not benefits. Pick two."}]}, "tests": "Curiosity about the work.",
         "a": ["Your four questions are in INTRO.md and the two groups added under Questions to ask. Pick two.",
               "**Week to week.** What an Enterprise engagement looks like from discovery to the agent running, and where it gets stuck.",
               "**Evaluation without ground truth.** Rubrics, expert reviewers, live signals, or a mix.",
               "**The first 90 days.** What a strong start looks like.",
               "**The team.** How engineers, forward deployed engineers and business experts are structured, and the next steps."],
         "land": "Two questions, then your closing line."}]},
]
TABS =["overview", "learn", "sessions", "coding", "lld", "prep", "rounds", "mocks"]   # Concurrency folds into Coding
CONC_N = 4   # the shared concurrency guide, as one part with chapters, after asyncio (part 3)
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
    {"id": "coding-reviewer", "title": "For the coding reviewer (Member of Technical Staff)", "when": "In the last minutes of the thirty-minute review. One or two.",
     "why": "A hands-on engineer who reads your code and runs the review. Questions about how they build show you read code the way they do.",
     "how": ["Ask one, listen, then say in a sentence how you have seen the same thing at alfred_."],
     "items": [
         {"to": "The coding reviewer", "q": "To get to know the product, what are some recent pain points you've solved, and some that are ongoing work?",
          "loop": "First choice.", "why": "Your question from INTRO.md, reworded only for spelling. Their answer is the real work."},
         {"to": "The coding reviewer", "q": "When you review a teammate's first working version, what do you look at first: correctness, tests, or how it is structured to change?",
          "loop": "Second.", "why": "Tells you what they score, and shows you care about review as a shared habit."},
         {"to": "The coding reviewer", "q": "How do engineering decisions get made on your team: who proposes, who pushes back, and how does a disagreement end?",
          "loop": "If time.", "why": "How the team works day to day, not the process document."},
         {"to": "The coding reviewer", "q": "What would a strong first 90 days look like for someone joining Enterprise now?",
          "loop": "Last.", "why": "Your INTRO.md question, asked of an engineer who would work beside you."}]},
    {"id": "sd-interviewer", "title": "For the system design interviewer", "when": "After the forty-five minutes. One or two.",
     "why": "They have just watched you reason about a backend. Ask about the real systems behind it.",
     "how": ["Ask one, listen, ask one follow-up on a failure or tradeoff they mention."],
     "items": [
         {"to": "The system design interviewer", "q": "How do you evaluate an agent inside a customer's environment when there's no ground truth? Rubrics, expert reviewers, live signals, or a mix?",
          "loop": "First choice.", "why": "Your INTRO.md question. It follows the design of an AI system and ties to the evaluation work you own."},
         {"to": "The system design interviewer", "q": "Which part of the systems you run has failed in a way nobody predicted, and what changed in the design afterwards?",
          "loop": "Second.", "why": "Invites a real story and shows you think about failure first."},
         {"to": "The system design interviewer", "q": "Where do you draw the line between a reusable service and a one-off build for a single customer?",
          "loop": "If time.", "why": "Your reusable-systems point from INTRO.md, as a design question."},
         {"to": "The system design interviewer", "q": "How is the team structured, engineers versus forward deployed and business experts, and what are the next steps and timeline from here?",
          "loop": "Last.", "why": "Your INTRO.md question, whole."}]},
    {"id": "algo-tlm", "title": "For the algorithms interviewer (Tech Lead Manager)", "when": "The last two or three minutes of the thirty. One or two.",
     "why": "The role is half hands-on building and half leading. Ask about both halves.",
     "how": ["Ask one, listen, then say in a sentence what you would bring."],
     "items": [
         {"to": "The Tech Lead Manager", "q": "What does a typical Enterprise engagement look like week to week, from discovery to the agent running in a customer's tools? Where does it usually get stuck?",
          "loop": "First choice.", "why": "Your INTRO.md question, to someone who leads the people doing it."},
         {"to": "The Tech Lead Manager", "q": "What scaling problem have you had to rethink in the last few months, and what pushed you to change the approach?",
          "loop": "Second.", "why": "Matches the round, which is about real infrastructure and scaling decisions."},
         {"to": "The Tech Lead Manager", "q": "How do you split your own time between building and leading, and what does an engineer need to show to take on more?",
          "loop": "If time.", "why": "How the team grows people, and where you could grow."},
         {"to": "The Tech Lead Manager", "q": "What does the full interview process look like from here, and the rough timeline?",
          "loop": "Last.", "why": "Your question from INTRO.md."}]},
    {"id": "gtm", "title": "For the GTM interviewers", "when": "The last two minutes of the fifteen. One or two.",
     "why": "They sit between the customer and the engineers; a question about their side shows you think about the customer too.",
     "how": ["Ask one, listen, then say in a sentence how you have seen the same thing."],
     "items": [
         {"to": "The Engagement Manager", "q": "What does a good first month with a new enterprise customer look like, and where does it usually get stuck?",
          "loop": "First choice.", "why": "Your INTRO.md question, aimed at the person who runs the engagement."},
         {"to": "The Principal, Enterprise AI", "q": "How do you agree what good looks like with a customer, and who grades the agent when there is no ground truth?",
          "loop": "Second.", "why": "Ties to the evaluation work you own and to what Enterprise sells."},
         {"to": "The Engagement Manager", "q": "When a customer asks for something that will not solve their problem, how do you handle it, and when do engineers join that conversation?",
          "loop": "If time.", "why": "Shows you have thought about saying no, and asks how engineers fit in."},
         {"to": "The Principal, Enterprise AI", "q": "What does a customer have to see in a pilot before they expand it?",
          "loop": "If time.", "why": "Pilot metrics and expansion criteria, the part you prepared."},
         {"to": "Either", "q": "What have you seen make a deployment go badly, and what would you want an engineer to do differently?",
          "loop": "Last.", "why": "Invites a real story and shows you want the honest answer."}]},
    {"id": "leadership", "title": "For a leadership chat", "when": "When they ask if you have questions. Two, then your closing line.",
     "why": "About the company, the pace and where you would add, from someone who sets direction.",
     "how": ["Ask one, listen, then close in your words from INTRO.md."],
     "items": [
         {"to": "Leadership", "q": "Why is Enterprise being built now, and what would you want its first engineers to have solved by the end of the year?",
          "loop": "First choice.", "why": "The company direction, and what you would be measured on."},
         {"to": "Leadership", "q": "What does a strong first 90 days look like for someone joining Enterprise?",
          "loop": "Second.", "why": "Your INTRO.md question."},
         {"to": "Leadership", "q": "What does the real week look like here, hours and rhythm included?",
          "loop": "If the pace came up.", "why": "Culture reports describe an intense in-person environment; ask directly."},
         {"to": "Leadership", "q": "How do deployments turn into reusable tools and eval templates, and who owns that?",
          "loop": "If time.", "why": "Your reusable-systems point from INTRO.md."},
         {"to": "Leadership", "q": "What is the full interview process from here, and the rough timeline?",
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

MOCK_HOW = ("Three mocks run in chat, each as the round on 11 November: 'run the Mercor coding mock' (a solo hour on a graph problem, no AI, then a 30-minute review where you extend it), 'run the Mercor design mock' (45 minutes of backend design: schema, API, block diagram, concurrent load, failure recovery) and 'run the Mercor GTM mock' (15 minutes with an engagement manager and a principal). Critique after each.")
