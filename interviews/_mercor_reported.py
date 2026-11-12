"""Mercor: every question reported for the onsite, by round, for the Reported tab (REPORTED in mercor.py).

Built 12 November 2026 from two research passes (the first-hand reports and likely prompts of 12 November; the
onsite research of 3 November), a gap pass the same day, and his own worked solutions. Evidence is counted per
distinct linked report; aggregators overlap, so counts are upper bounds. GTM has no reported question anywhere:
those rows are likely questions from comparable rounds, marked as such."""

T = "../index.html#/"
G = "../SYSTEM%20DESIGN.html#/designs/"
C = "#/coding/"


def S(label, url):
    return {"label": label, "url": url}


# Sources, first-hand first. Several Glassdoor, Blind and 1point3acres pages refuse automated fetches; they were read
# through search snippets by the research pass and are linked as found.
BLIND_AUG = S("Blind, SWE onsite, 26 Aug 2026 (first-hand)", "https://www.teamblind.com/post/mercor-swe-interview-experience-vv02w0gy")
BLIND_JUL = S("Blind, SWE onsite, Jul 2026 (first-hand)", "https://www.teamblind.com/post/expecting-an-offer-from-mercor-fpqihyz6")
BLIND_HOW = S("Blind, how is the onsite (first-hand reply)", "https://www.teamblind.com/post/hows-mercor-onsite-interview-like-r8sg0tnn")
GD_SWE = S("Glassdoor, Software Engineer (first-hand)", "https://www.glassdoor.com/Interview/Mercor-Software-Engineer-Interview-Questions-EI_IE9031572.0,6_KO7,24.htm")
GD_ALL = S("Glassdoor, all Mercor interviews", "https://www.glassdoor.co.uk/Interview/Mercor-Interview-Questions-E9031572.htm")
GD_IN = S("Glassdoor India, virtual super day (first-hand)", "https://www.glassdoor.co.in/Interview/Mercor-Software-Engineer-Interview-Questions-EI_IE9031572.0,6_KO7,24.htm")
GD_NOON = S("Glassdoor, sent home at noon (first-hand)", "https://www.glassdoor.com/Interview/Mercor-Software-Developer-Interview-Questions-EI_IE9031572.0,6_KO7,25.htm")
P13_TAG = S("1point3acres, Mercor tag (first-hand snippets)", "https://www.1point3acres.com/bbs/tag/mercor-10074-1.html")
P13_AAI = S("1point3acres, Applied AI full loop (first-hand)", "https://www.1point3acres.com/bbs/thread-1176596-1-1.html")
P13_CTO = S("1point3acres, CTO chat (first-hand)", "https://www.1point3acres.com/bbs/thread-1152075-1-1.html")
TARO_SR = S("Jointaro, senior onsite, Oct 2025 (first-hand)", "https://www.jointaro.com/interviews/companies/mercor/experiences/senior-software-engineer-united-states-october-28-2025-no-offer-negative-c87ecf87/")
PH_MLE = S("PracHub, MLE onsite, Sep 2026 (first-hand)", "https://prachub.com/interview-experiences/mercor-machine-learning-engineer-interview-experience-three-onsite-rounds-kicked-out-of-the-meeting-room-mid-interview")
PH_MAY = S("PracHub, screen, May 2026 (first-hand)", "https://prachub.com/interview-experiences/mercor-software-engineer-interview-experience-half-hour-online-round-of-code-review-and-design-questions")
PH_AAI = S("PracHub, Applied AI screen, Sep 2026 (first-hand)", "https://prachub.com/interview-experiences/mercor-software-engineer-interview-experience-applied-ai-tech-screen-with-an-async-refund-debugging-question-and-rapid-fire-llm-questions")
PH_FX = S("PracHub, exchange rate (aggregator)", "https://prachub.com/interview-questions/currency-exchange-rate-between-two-currencies-via-chained-conversions")
PH_CO = S("PracHub, Mercor questions (aggregator)", "https://prachub.com/companies/mercor")
ACE = S("AceOffer, 20 reports (aggregator)", "https://aceoffer.app/interviews/mercor/interview-process")
FAST = S("FastPrep, Mercor questions (aggregator)", "https://www.fastprep.io/mercor-interview")
IQ = S("Interview Query, SWE guide (aggregator)", "https://www.interviewquery.com/guides/mercor-software-engineer")
GH_REF = S("GitHub, a referral-network take-home (artifact)", "https://github.com/Manyachandra/Mercor")
DG_BEH = S("DesignGurus, behavioural questions (synthesis)", "https://www.designgurus.io/answers/detail/top-mercor-behavioral-interview-questions-and-how-to-answer-them")
ACED_SCALE = S("Aced, Scale AI FDE questions (comparable)", "https://www.aced.io/guides/scale-ai-forward-deployed-engineer-interview/questions")
ACED_PAL = S("Aced, Palantir FDE guide (comparable)", "https://www.aced.io/guides/palantir-forward-deployed-engineer-interview")
ACED_DS = S("Aced, Mercor data scientist final (first-hand)", "https://www.aced.io/experiences/mercor-data-scientist-interview-13cdc3")

YOURS = C + "mercor-yours"
ALGO = C + "mercor-reported-algo"
DESIGN = C + "mercor-reported-design"


def L(label, href):
    return {"label": label, "href": href}


def Q(id, q, ev, tests, approach, solve, src, detail=""):
    return {"id": id, "q": q, "ev": ev, "tests": tests, "approach": approach, "solve": solve, "src": src, "detail": detail}


REPORTED = {
    "lead": ("Every question candidates have reported for Mercor's onsite, round by round, and the likely GTM questions "
             "(no GTM question has ever been reported). Do the baseline first: it is what every question below rests on. "
             "Then open each question, try it aloud, write the outline, and only then show the approach. Your attempts and "
             "ticks stay in this browser."),
    "baselineLead": "The fundamentals the reported questions assume. In order; tick as you go.",
    "baseline": [
        {"id": "b-w4e", "t": "w4e Transactions and indexes", "href": T + "s/w4e", "why": "atomic claims, locks, isolation"},
        {"id": "b-w5f", "t": "w5f Streams and events: the log as the source", "href": T + "s/w5f", "why": "outbox, at-least-once"},
        {"id": "b-2pc", "t": "Hello Interview: Distributed Transactions, 2 Phase Commit vs Saga (15 min)", "href": "https://www.youtube.com/watch?v=DOFflggE_0Q", "why": "video"},
        {"id": "b-multistep", "t": "Hello Interview: the multi-step processes pattern (sagas, durable execution)", "href": "https://www.hellointerview.com/learn/system-design/patterns/multi-step-processes", "why": "article"},
        {"id": "b-run45", "t": "Learn: how to run the 45-minute design round", "href": "#/learn/sd-run-45", "why": "the order to talk in"},
        {"id": "b-jobs", "t": "Guide: the job scheduler, the most reported design", "href": G + "job-scheduler/requirements", "why": "5 reports"},
        {"id": "b-pay", "t": "Guide: contractor payouts (idempotency, ledger, reconciliation)", "href": G + "contractor-payouts/requirements", "why": "3 reports"},
        {"id": "b-search", "t": "Guide: candidate search with RAG", "href": G + "candidate-search/requirements", "why": "5 reports"},
        {"id": "b-kit", "t": "Coding 7: the no-IDE drill kit, then what the reviewer asks", "href": C + "onsite-kit", "why": "the solo hour"},
        {"id": "b-talk", "t": "Coding 8: how to run a talk-only algorithms round", "href": C + "onsite-talk", "why": "the algorithms round"},
        {"id": "b-locks", "t": "Threads: locks, check then act, the cache race", "href": C + "threads", "why": "review extensions"},
        {"id": "b-retry", "t": "Failure: retries, idempotency, timeouts", "href": C + "failure", "why": "review extensions"},
        {"id": "b-gtm", "t": "wc39 GTM session, all six steps with their videos", "href": T + "w/wc39", "why": "the GTM round"},
    ],
    "rounds": [
        {"id": "solo", "title": "Coding: the solo hour, then the review",
         "blurb": "60 minutes alone, no AI, no search, screen-recorded; then 30 minutes with the reviewer, who reads it line by line and may add a part live. It must run end to end on real input, no stubs.",
         "items": [
             Q("r-referral", "Referral network: add referrals as a graph (no self-referral, one referrer each, no cycles), then reach by BFS, top-k referrers, and influencers.",
               "6 reports, 2 first-hand", "Graph modelling, cycle checks, BFS, and asking what an undefined term (flow centrality) means before coding.",
               ["Clarify first: what counts as reach, ties in top-k, and the exact influencer definition.",
                "Store referrer of each candidate and children lists; reject self, second referrer, and any edge that closes a cycle (walk up from the referrer).",
                "Reach is BFS over children; top-k sorts by reach with a stated tie rule.",
                "Influencers two ways: greedy unique reach (set cover), and flow centrality (pairs whose shortest path passes through v).",
                "Live extension: growth simulation in days, or the minimum bonus by binary search on a monotone function."],
               [L("Your write-up (Q1)", C + "yours-q1"), L("Coding 7: referral network drill", C + "onsite-referral")], [P13_AAI, ACE, GH_REF, BLIND_AUG]),
             Q("r-scheduler", "Task scheduler with dependencies, in two parts: run tasks in a valid order, then a second constraint added.",
               "2 reports, aggregators", "Topological sort, cycle detection, and extending working code without breaking it.",
               ["Kahn's algorithm: indegree counts and a queue; a leftover node means a cycle, say which.",
                "Part two is usually a constraint (workers, durations, priorities): a heap keyed by ready time or priority.",
                "State complexity, O(V + E), and the test cases you would run."],
               [L("Coding 7: task scheduler", C + "onsite-scheduler"), L("Coding 7: project dependency planner", C + "onsite-planner")], [ACE]),
             Q("r-fileparse", "Graph problems from parsing a file: read raw input, build the structure, answer the queries, end to end.",
               "2 reports, first-hand", "That it runs like a product on their input: parsing, validation, errors, then the logic.",
               ["Write the parser first and print what it built; then the algorithm.",
                "Validate rows (missing fields, duplicates, unknown ids) and say what you do with bad ones.",
                "Keep your own asserts at the bottom; no tests are provided."],
               [L("Coding 7: the drill kit", C + "onsite-kit"), L("Coding 7: expert-skill graph", C + "onsite-skillgraph")], [BLIND_AUG, GD_ALL]),
             Q("r-fourpart", "A four-part build, each part easy to medium, from a real-world use case.",
               "1 report, first-hand", "Pace and completeness across parts more than any one hard idea.",
               ["Read all parts first, design data structures that serve every part, then build in order.",
                "Ship part 1 working before starting part 2; leave a line of notes for anything cut."],
               [L("Coding 7: builds 4 to 12", C + "onsite-skillgraph")], [BLIND_HOW]),
             Q("r-carpark", "Cars and preferred parking spots: can every car park? Follow-up: each car accepts a list of spots.",
               "2 reports, 1 first-hand", "Greedy where it works, and knowing when it fails and backtracking or matching is needed.",
               ["Forward-only version: a greedy scan with the next free spot.",
                "List of acceptable spots: backtracking DFS, then bipartite matching with augmenting paths.",
                "Say why greedy fails with a two-car counterexample."],
               [L("Coding 7: car parking, forward only", C + "onsite-carpark"), L("Reported algorithms: acceptable-spot lists", C + "ra-parking")], [PH_MLE, FAST]),
             Q("r-review-cache", "Review extension: make this cache or memoizer thread-safe. Where does the lock go?",
               "4 reports, screens", "Lock scope, check-then-act races, duplicate computation of the same key.",
               ["Name the race: two threads miss, both compute, both write.",
                "A lock around the dict only; per-key locks or a future per key so the slow call runs once.",
                "Across processes: an atomic add-if-absent in a shared store."],
               [L("Threads: the cache race", C + "threads"), L("Coding 7: what the reviewer asks", C + "onsite-review")], [PH_MAY, PH_AAI, FAST]),
             Q("r-review-refund", "Review extension: the refund or payment call can run twice. Fix it.",
               "3 reports, screens", "Idempotency keys, retries, and where the uniqueness is enforced.",
               ["An idempotency key per logical request, stored with a unique constraint.",
                "Retry with backoff; the second attempt finds the key and returns the first result.",
                "Say what happens if the process dies between charging and recording."],
               [L("Failure: retries and idempotency", C + "failure"), L("Coding 9: retries", C + "infra-retry")], [PH_AAI, PH_MAY, FAST]),
             Q("r-review-defend", "Walk me through your code, line by line. Why this structure? What would you change?",
               "3 reports, first-hand", "That you wrote it and understand every line; judgement on what you cut.",
               ["Lead with the data model and invariants, then each function in one line.",
                "Name complexity, the tests you ran, and the two things you would change with more time."],
               [L("Coding 7: what the reviewer asks", C + "onsite-review")], [BLIND_AUG, ACE]),
         ]},
        {"id": "algo", "title": "Algorithms: the talk round",
         "blurb": "30 minutes, discussion only or a whiteboard. Correctness, then complexity, then the cost under a constraint: API calls, comparator calls, wall-clock, memory.",
         "items": [
             Q("r-comparator", "Sort, or find the top k, with a comparator that is deterministically wrong on some pairs. Minimise calls, then wall-clock when each call is slow.",
               "4 reports plus listings", "Clarifying the error model, then cost models: calls first, then parallel time.",
               ["Ask: are errors deterministic? Then re-asking the same pair never helps.",
                "The answers form a tournament graph with cycles; rank by wins, or find a Hamiltonian path.",
                "Fewer calls: a tournament for top k. Faster: compare independent pairs in parallel rounds."],
               [L("Your write-up (Q4)", C + "yours-q4"), L("Coding 8: the comparator", C + "onsite-comparator")], [ACE, FAST, PH_CO]),
             Q("r-paidcmp", "Sort with a comparator that is right 90% of the time and costs money per call. The algorithm, the accuracy, the cost.",
               "1 listing", "Random rather than deterministic errors: repeat and vote, and price it.",
               ["Repeat each comparison an odd number of times and take the majority.",
                "Accuracy of a majority of 3 at 90%: about 97%; the cost triples.",
                "Spend repeats only where it matters, near the top k."],
               [L("Reported algorithms: the paid comparator", C + "ra-paid")], [PH_CO]),
             Q("r-fx", "Exchange rates: given pairs like ['USD','GBP',0.77], convert any currency to any other.",
               "2 first-hand, 3 aggregators", "Modelling as a weighted graph, then follow-ups on caching and precision.",
               ["Edges both ways, reverse weight 1/r; BFS or DFS multiplying along the path.",
                "Return 1.0 for the same currency and -1 when disconnected or unknown.",
                "Follow-ups: weighted union-find for many queries, caching, floating-point error."],
               [L("Your write-up (Q2)", C + "yours-q2"), L("Coding 8: exchange rates", C + "onsite-exchange")], [P13_TAG, PH_FX, FAST]),
             Q("r-friend", "Reach a friend network through a restricted, rate-limited API with as few calls as possible.",
               "1 first-hand, 2 aggregators", "Cost model in API calls, BFS, caching what you fetched.",
               ["BFS with a visited set; each node fetched once.",
                "Batch calls if the API allows; cache; stop early at the depth you need.",
                "Bidirectional search when the goal is a path between two people."],
               [L("Coding 8: friend network", C + "onsite-friend")], [PH_MLE, FAST]),
             Q("r-khop", "Shortest path between two users in an undirected graph, of length at most k.",
               "1 report, first-hand", "BFS with a depth cap, and bidirectional BFS to cut the frontier.",
               ["BFS from the source, stop expanding past depth k.",
                "Bidirectional: expand the smaller frontier, meet in the middle, depth k/2 each way."],
               [L("Reported algorithms: k hops", C + "ra-friend")], [P13_TAG]),
             Q("r-millionids", "A million user IDs: check membership and insert, under a memory budget, safely under concurrency.",
               "2 reports", "Hash set versus bitmap versus Bloom filter, and atomic add-if-absent.",
               ["Exact: a hash set, about tens of MB; dense integer IDs fit a bitmap.",
                "Bloom filter in front of an exact store when memory is tight; false positives only.",
                "Concurrency: a single atomic add-if-absent, not check then insert."],
               [L("Coding 8: a million IDs", C + "onsite-dedupe"), L("Coding 9: Bloom filter", C + "infra-bloom")], [FAST]),
             Q("r-username", "Unique username registration: memory-rich versus disk-constrained.",
               "1 listing", "Normalisation, races between two registrations, and on-disk indexes.",
               ["Normalise first (case, Unicode) so two spellings are one name.",
                "The uniqueness lives in one place: a unique index or an atomic set-if-absent.",
                "Disk-constrained: a sorted index or LSM with a Bloom filter in front."],
               [L("Reported algorithms: usernames", C + "ra-names")], [FAST]),
             Q("r-topk", "Weighted top-k over candidates, or a custom comparator for ranking.",
               "2 reports, low confidence", "A heap of size k, ties, and a comparator that is a total order.",
               ["Score once, keep a min-heap of size k: O(n log k).", "State the tie rule; check the comparator is transitive."],
               [L("Coding 8: weighted top-k", C + "onsite-topk")], [ACE]),
             Q("r-losttree", "A hidden tree: each query returns a node's distance to every node. Rebuild all edges in at most ceil(n/2) queries.",
               "your question log, Q5", "Seeing the parity cut: every edge joins an even and an odd node.",
               ["Query node 1; split by even and odd distance.", "Query every node on the smaller side; distance 1 means an edge."],
               [L("Your write-up (Q5)", C + "yours-q5")], []),
             Q("r-randset", "insert, remove and getRandom, each O(1). Then duplicates. Then weighted.",
               "your question log, Q8", "A dense array plus a value-to-index map, swap with last.",
               ["Array for random access, map for O(1) find, swap the last element into the hole.",
                "Duplicates: a set of indices per value.", "Weighted: Fenwick tree O(log n), or the alias method with O(n) rebuilds."],
               [L("Your write-up (Q8)", C + "yours-q8")], []),
             Q("r-sortwarm", "Warm-up: a fast sort, then the slowest possible sort, and their costs.",
               "recurring screen theme", "Saying a cost precisely: rounds times work per round.",
               ["Merge sort O(n log n).", "Bogosort: each round O(n), expected n! rounds, so O(n * n!)."],
               [L("Session: the basics they still check", "#/sessions/wc37")], [ACE]),
         ]},
        {"id": "design", "title": "System design",
         "blurb": "45 minutes on a whiteboard with a security engineer: data model, API, block diagram, behaviour under concurrent load, recovery from failures, trade-offs.",
         "items": [
             Q("r-jobs", "Design a distributed job scheduler or workflow orchestrator.",
               "5 reports", "No duplicate runs, retries, dependencies, and recovery when a worker dies.",
               ["Jobs table with status; workers claim with a lease (compare and swap or SKIP LOCKED).",
                "Idempotent execution; retries with backoff; a dead-letter state.",
                "DAG dependencies with a counter per job; recovery by lease expiry."],
               [L("Guide: job scheduler", G + "job-scheduler/requirements")], [ACE, PH_MLE, FAST, IQ]),
             Q("r-search", "Design candidate search or ranking for a job description.",
               "5 reports", "Retrieval plus ranking, hard filters from the job description, evaluation.",
               ["An LLM turns the description into hard filters; retrieve with hybrid search; rerank.",
                "Measure against labelled matches; say how you would debug a bad result."],
               [L("Guide: candidate search", G + "candidate-search/requirements")], [TARO_SR, GD_IN, IQ, ACE]),
             Q("r-pay", "Design payment or payout processing with reconciliation.",
               "3 reports", "Idempotency, a ledger as the source of truth, and reconciling with the provider.",
               ["Double-entry ledger; idempotency key per payout; outbox to the provider.",
                "Reconcile daily against provider reports; repair by state machine."],
               [L("Guide: contractor payouts", G + "contractor-payouts/requirements"), L("Reported designs: payments deltas", C + "payments-recon")], [FAST, PH_MAY]),
             Q("r-copy", "Design an API to copy a dataset with its tasks, model responses and grades, so the copy changes independently.",
               "2 reports", "ID remapping, dependency order, async jobs that resume.",
               ["Map old to new IDs; copy parents before children.",
                "Async job with a job ID, batched, checkpointing the mapping so it resumes."],
               [L("Reported designs: dataset copy", C + "copy-api")], [PH_MAY, FAST]),
             Q("r-tenantfair", "Design durable, tenant-fair work orchestration for slow LLM tasks, aware of quotas, with resumable progress.",
               "1 listing", "Fairness across tenants and respecting the model provider's rate limits.",
               ["Per-tenant queues, weighted fair or deficit round robin dispatch.",
                "Token buckets per tenant and per provider; checkpoint progress per step."],
               [L("Reported designs: tenant-fair orchestration", C + "tenant-fair"), L("Guide: job scheduler", G + "job-scheduler/requirements")], [FAST]),
             Q("r-ticket", "Design an event ticket marketplace.",
               "2 reports", "Holding seats without double-selling under a rush.",
               ["Seat hold with expiry; atomic reserve; a waiting room for spikes."],
               [L("Guide: Ticketmaster", G + "ticketmaster/requirements")], [ACE, PH_CO]),
             Q("r-injection", "Design defences against prompt injection for an agent that calls tools.",
               "2 reports", "Trust boundaries and least privilege, a natural probe for a security interviewer.",
               ["Treat retrieved content as data; tools scoped per task and user; confirmation on side effects.",
                "Check outputs before they act; log every tool call."],
               [L("Reported designs: prompt injection", C + "prompt-injection")], [PH_AAI, FAST]),
             Q("r-chat", "Design a persistent multi-thread AI chat, with context-window management.",
               "2 reports", "Storage per thread, and what goes into the window when the history is too long.",
               ["Messages table per thread; summary of old turns; retrieve relevant older turns.",
                "A token budget per section of the prompt."],
               [L("Reported designs: multi-thread chat", C + "chat-context")], [PH_AAI, FAST]),
             Q("r-mlpipe", "Design ML pipeline orchestration.",
               "1 listing", "A DAG of steps, artifacts and lineage, idempotent retries.",
               ["Steps as a DAG with versioned artifacts; each step idempotent by input hash."],
               [L("Reported designs: ML pipelines", C + "ml-pipeline")], [PH_CO]),
             Q("r-idstore", "Design an exact user-ID membership service, or unique usernames, at scale.",
               "2 reports", "Partitioning, atomic add-if-absent, caches and Bloom filters.",
               ["Shard by hash of the ID; uniqueness by a unique key per shard; Bloom filter to skip misses."],
               [L("Reported algorithms: usernames", C + "ra-names"), L("Coding 9: Bloom filter", C + "infra-bloom")], [FAST]),
         ]},
        {"id": "gtm", "title": "GTM: likely questions",
         "blurb": "No GTM question has been reported anywhere. These are likely, from Mercor's other finals and comparable forward-deployed rounds. Fifteen minutes with a Principal, Enterprise AI.",
         "items": [
             Q("g-pitch", "What does Mercor Enterprise do, and why do you want to work on it?", "likely: Mercor pitch round",
               "That you can pitch it in two sentences and want this work specifically.",
               ["Two sentences on what Mercor sells to enterprises, then one specific reason tied to your own work."],
               [L("Prep: GTM round", "#/prep"), L("wc39 step 2", T + "w/wc39")], [ACE, DG_BEH]),
             Q("g-unhappy", "A customer is unhappy: their agent was good last week and is worse now. What do you do?", "likely",
               "Empathy, then a calm diagnosis plan.",
               ["Acknowledge, ask for three real examples, replay the same cases before and after.",
                "Model, input, their side, or the prompt: find which changed; tell them what you do and when."],
               [L("wc39 step 4: scenarios", T + "w/wc39"), L("Prep: GTM round", "#/prep")], [ACED_SCALE]),
             Q("g-pushback", "Tell me about a time you pushed back on a customer or stakeholder request.", "comparable: Palantir",
               "Judgement: saying no with a reason and an alternative.",
               ["Their goal, why the request would not reach it, the smaller version you offered, the result."],
               [L("Prep: GTM round", "#/prep")], [ACED_PAL]),
             Q("g-ambiguous", "An enterprise AI lab says its training data quality is slipping. What do you do?", "likely",
               "Discovery before solutions.",
               ["Ask who noticed, how it is measured, what changed; then scope a fix with a metric and the risks."],
               [L("wc39 step 3: discovery", T + "w/wc39")], []),
             Q("g-first", "What would you ask a new enterprise customer in the first meeting?", "comparable: OpenAI",
               "Discovery: users, data access, success, constraints, the current workflow.",
               ["Outcome and who decides; one real case; the cost of a wrong answer; what cannot change."],
               [L("wc39 step 3", T + "w/wc39"), L("Prep: GTM round", "#/prep")], []),
             Q("g-pilot", "How would you measure whether a pilot worked?", "likely",
               "Product sense: a metric, a baseline and a guardrail written down before it starts.",
               ["Baseline first; one success metric and one guardrail; expand only if both hold."],
               [L("wc39 step 3", T + "w/wc39")], []),
             Q("g-explain", "Explain to a non-technical executive why an AI system gives different answers to the same question.", "likely",
               "Translating technical ideas.",
               ["Wording varies, facts should not; how you keep facts stable and test it."],
               [L("wc39 step 4", T + "w/wc39")], []),
             Q("g-ragft", "Explain RAG versus fine-tuning to a non-technical VP.", "inferred",
               "Plain words and a cost trade-off.",
               ["RAG: look things up at answer time, easy to update. Fine-tuning: teach a habit, costly to change."],
               [L("Prep: GTM round", "#/prep")], []),
             Q("g-friday", "The customer wants it by Friday and it cannot be done well by then. What do you say?", "inferred",
               "Stakeholder management under pressure.",
               ["A reduced scope with a firm date, and the risk of the full scope said plainly."],
               [L("wc39 step 4", T + "w/wc39")], []),
             Q("g-twostake", "Two stakeholders at the customer want opposite things. Who wins?", "inferred",
               "Finding the decision-maker and the shared goal.",
               ["Name the shared goal, ask who decides, decide on data, write it down."],
               [L("Prep: GTM round", "#/prep")], []),
             Q("g-nontech", "Tell me about a time you worked with non-technical users.", "likely",
               "Empathy turned into product decisions.",
               ["alfred_ users are everyday people: the rule check, 'why was I notified', a trade-off in their words."],
               [L("wc39 step 5", T + "w/wc39")], []),
             Q("g-project", "Tell me about a project from the product angle: whose decision, what success meant, the outcome.", "2 reports",
               "Ownership and a named metric before and after.",
               ["Who decided, the metric, before and after, and what you would do differently."],
               [L("Prep: GTM round", "#/prep")], [ACE, PH_AAI]),
             Q("g-aitools", "How do you use AI tools day to day? When did one give you a wrong answer?", "2 reports",
               "Fluent but critical use, with verification.",
               ["A real workflow, a real wrong answer, how you caught it."],
               [L("Prep", "#/prep")], [ACE, DG_BEH]),
             Q("g-grow", "How would you grow Mercor's enterprise customers?", "1 report, data scientist final",
               "Product and growth thinking on a two-sided marketplace.",
               ["Pick a segment, a hypothesis and a metric; remember the expert side too."],
               [L("wc39 step 2", T + "w/wc39")], [ACED_DS]),
             Q("g-ask", "What do you want to ask us?", "every round",
               "Curiosity and taste.",
               ["Ask what customer-facing work gets wrong, or how they decide what to build each week. Avoid pointed business questions."],
               [L("Prep: questions to ask", "#/prep/ask")], [P13_CTO]),
         ]},
        {"id": "chat", "title": "Pace and the hiring-manager chat",
         "blurb": "Reported around the loop rather than in one round. A short executive chat can still end the day.",
         "items": [
             Q("h-pace", "Mercor moves fast and the hours are intense. How do you feel about that?", "several reports",
               "An honest answer with evidence, not a performative yes.",
               ["One concrete stretch of sustained intensity you have lived, and what you do to keep quality."],
               [L("Prep: leadership chat", "#/prep")], [GD_SWE]),
             Q("h-intense", "Tell me about your most intense work, and work you are proud of.", "1 report, Applied AI",
               "Ownership and a metric.",
               ["One story, owned end to end, with a number before and after."],
               [L("Prep", "#/prep")], [P13_AAI]),
             Q("h-owner", "What are you leading now, and why are you the owner rather than a participant?", "1 report, screen",
               "Ownership in plain terms.",
               ["Name the decisions that were yours and what would have stopped without you."],
               [L("Prep", "#/prep")], [PH_AAI]),
         ]},
    ],
    "sources": [BLIND_AUG, BLIND_JUL, BLIND_HOW, GD_SWE, GD_ALL, GD_IN, GD_NOON, P13_TAG, P13_AAI, P13_CTO, TARO_SR, PH_MLE,
                PH_MAY, PH_AAI, PH_FX, PH_CO, ACE, FAST, IQ, GH_REF, DG_BEH, ACED_SCALE, ACED_PAL, ACED_DS],
}
