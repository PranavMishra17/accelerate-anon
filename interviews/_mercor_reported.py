"""Mercor: every question reported for the onsite, by round, for the Reported tab (REPORTED in mercor.py).

Built 12 November 2026 from two research passes (the first-hand reports and likely prompts of 12 November; the
onsite research of 3 November), a gap pass the same day, and his own worked solutions. Evidence is counted per
distinct linked report; aggregators overlap, so counts are upper bounds. GTM has no reported question anywhere:
those rows are the research's ten likely prompts, from Mercor's other finals and comparable rounds, marked as such.

Reshaped the same day (his review): duplicates merged (47 boxes to 37), a Python input kit before the solo hour, a
video on every design, every design in the guide's format, and GTM as his four answers (private/loops/mercor.js,
`assets`, keyed by an item's `asset`) followed by one-line pointers. LIVE names the guide designs that have landed;
a design not in it still opens its Coding 13 section."""

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
HARVARD = S("Harvard FAS career services, FDE interview guide (comparable)", "https://careerservices.fas.harvard.edu/blog/2026/08/01/forward-deployed-engineer-interview-the-definitive-2026-guide-fde/")
ADASCI = S("ADaSci, FDE interview questions (comparable)", "https://adasci.org/blog/forward-deployed-engineer-interview-questions")
FRAI = S("Final Round AI, FDE interview (comparable: OpenAI solution design)", "https://www.finalroundai.com/blog/forward-deployed-engineer-interview")
DEVTO = S("DEV, practising for an FDE interview (comparable: Palantir decomposition)", "https://dev.to/neurapath/how-to-practise-for-a-forward-deployed-engineer-interview-when-nobody-can-mock-interview-you-4pok")

YOURS = C + "mercor-yours"
ALGO = C + "mercor-reported-algo"
DESIGN = C + "mercor-reported-design"

# Guide designs that have landed. Until a design is here, its box opens the Coding 13 section instead.
LIVE = {"job-scheduler", "candidate-search", "contractor-payouts", "ticketmaster", "dataset-copy", "prompt-injection", "chat-context", "tenant-fair"}


def L(label, href):
    return {"label": label, "href": href}


def GD(id, label, fallback):
    """The guide design when it has landed, else the Coding 13 section."""
    return L("Guide: " + label, G + id + "/requirements") if id in LIVE else L("Reported designs: " + label, C + fallback)


def V(req, id, ch, m, label, why):
    """A video card (site/res.js). Every one checked with tools/yt.py on 12 November 2026: title, channel, length."""
    return {"kind": "video", "req": req, "label": label, "url": "https://www.youtube.com/watch?v=" + id, "yt": {"id": id, "ch": ch}, "m": m, "why": why}


def Q(id, q, ev, tests, approach, solve, src, detail="", video=None, asset=None):
    return {"id": id, "q": q, "ev": ev, "tests": tests, "approach": approach, "solve": solve, "src": src, "detail": detail,
            "video": video or [], "asset": asset or []}


REPORTED = {
    "lead": ("Every question candidates have reported for Mercor's onsite, round by round, and the likely GTM prompts "
             "(no GTM question has ever been reported). Do the baseline first: it is what every question below rests on. "
             "Then open each question, try it aloud, write the outline, and only then show the approach. The question and "
             "its buttons stay at the top while a box is open. Your attempts and ticks stay in this browser."),
    "baselineLead": "The fundamentals the reported questions assume. In order; tick as you go.",
    "baseline": [
        {"id": "b-w4e", "t": "w4e Transactions and indexes", "href": T + "s/w4e", "why": "atomic claims, locks, isolation"},
        {"id": "b-w5f", "t": "w5f Streams and events: the log as the source", "href": T + "s/w5f", "why": "outbox, at-least-once"},
        {"id": "b-2pc", "t": "Hello Interview: Distributed Transactions, 2 Phase Commit vs Saga (15 min)", "href": "https://www.youtube.com/watch?v=DOFflggE_0Q", "why": "video"},
        {"id": "b-durable", "t": "Jordan has no life: Durable Execution, Temporal and Inngest (19 min)", "href": "https://www.youtube.com/watch?v=GT9k8OSjzX8", "why": "video, multi-step processes"},
        {"id": "b-durable-read", "t": "Temporal: the definitive guide to Durable Execution (free to read)", "href": "https://temporal.io/blog/what-is-durable-execution", "why": "article, multi-step processes"},
        {"id": "b-run45", "t": "Learn: how to run the 45-minute design round", "href": "#/learn/sd-run-45", "why": "the order to talk in"},
        {"id": "b-kit", "t": "Coding 7: the no-IDE drill kit, then what the reviewer asks", "href": C + "onsite-kit", "why": "the solo hour"},
        {"id": "b-talk", "t": "Coding 8: how to run a talk-only algorithms round", "href": C + "onsite-talk", "why": "the algorithms round"},
        {"id": "b-locks", "t": "Threads: locks, check then act, the cache race", "href": C + "threads", "why": "review extensions"},
        {"id": "b-retry", "t": "Failure: retries, idempotency, timeouts", "href": C + "failure", "why": "review extensions"},
    ],
    "rounds": [
        {"id": "solo", "title": "Coding: the solo hour, then the review",
         "blurb": "60 minutes alone, no AI, no search, screen-recorded; then 30 minutes with the reviewer, who reads it line by line and may add a part live. It must run end to end on real input, no stubs. Python only.",
         "items": [
             Q("k-io", "Before the hour: read input from a file, stdin or arguments (lines, JSON, CSV), skip bad rows, and run the file end to end.",
               "do this first", "That your solution runs on their input. The algorithm earns nothing if the file does not load.",
               ["One `load()` that takes a path from `sys.argv` or falls back to `sys.stdin`.",
                "Three readers to know cold: split lines, `json.load`, `csv.DictReader`. Convert types yourself; everything arrives as text.",
                "Validate each row, skip and count the bad ones, and print what you built before any logic.",
                "Asserts at the bottom under `if __name__ == \"__main__\":`, then the real run. `python solution.py input.csv` and `python solution.py < input.csv`."],
               [L("Coding 7: read the input, run the file", C + "onsite-io"), L("Coding 7: the no-IDE drill kit", C + "onsite-kit")], []),
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
             Q("r-fileparse", "A multi-part build from a file: read raw input, build the structure, answer the queries, end to end. One report had four parts, each easy to medium.",
               "3 reports, first-hand", "That it runs like a product on their input: parsing, validation, errors, then the logic. Pace and completeness across parts more than any one hard idea.",
               ["Read all the parts first and pick data structures that serve every part.",
                "Write the parser first and print what it built; then the algorithm.",
                "Validate rows (missing fields, duplicates, unknown ids) and say what you do with bad ones.",
                "Ship part 1 working before starting part 2; leave a line of notes for anything cut. Keep your own asserts at the bottom; no tests are provided."],
               [L("Coding 7: read the input, run the file", C + "onsite-io"), L("Coding 7: expert-skill graph", C + "onsite-skillgraph")], [BLIND_AUG, GD_ALL, BLIND_HOW]),
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
         "blurb": "30 minutes, discussion only or a whiteboard. Correctness, then complexity, then the cost under a constraint: API calls, comparator calls, wall-clock, memory. The warm-up on a fast sort and the slowest possible sort is on [Rounds](#/rounds), round 2: bogosort is expected O(n * n!).",
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
             Q("r-friend", "Reach a friend network through a restricted, rate-limited API with as few calls as possible. Variant: the shortest path between two users, of length at most k.",
               "2 first-hand, 2 aggregators", "Cost model in API calls, BFS with a depth cap, caching what you fetched, and bidirectional search to cut the frontier.",
               ["BFS with a visited set; each node fetched once. Batch calls if the API allows; cache.",
                "At most k hops: stop expanding past depth k.",
                "A path between two people: bidirectional BFS, expand the smaller frontier, meet in the middle, depth k/2 each way."],
               [L("Coding 8: friend network", C + "onsite-friend"), L("Reported algorithms: k hops", C + "ra-friend")], [PH_MLE, FAST, P13_TAG]),
             Q("r-millionids", "Membership under a budget: a million user IDs, or unique usernames. Check and insert, memory-rich versus disk-constrained, safely under concurrency. Then as a service at scale.",
               "4 reports and listings", "Hash set versus bitmap versus Bloom filter, normalisation, one atomic add-if-absent, and where the uniqueness lives when it is sharded.",
               ["Exact and in memory: a hash set, about tens of MB; dense integer IDs fit a bitmap.",
                "Usernames: normalise first (case, Unicode) so two spellings are one name.",
                "Concurrency: one atomic add-if-absent (a unique index, or set-if-absent), never check then insert.",
                "Disk-constrained: a sorted index or LSM with a Bloom filter in front; false positives only, so a hit still checks the store.",
                "As a service: shard by hash of the ID, uniqueness by a unique key per shard, the Bloom filter to skip misses."],
               [L("Coding 8: a million IDs", C + "onsite-dedupe"), L("Reported algorithms: usernames", C + "ra-names"), L("Coding 9: Bloom filter", C + "infra-bloom")], [FAST],
               video=[V(True, "V3pzxngeLqw", "ByteByteGo", 6, "Bloom Filters, Algorithms You Should Know #2", "What a Bloom filter can and cannot tell you, with where real systems put one."),
                      V(False, "kfFacplFY4Y", "Spanning Tree", 7, "What Are Bloom Filters?", "The same idea drawn slowly, if the first one went too fast.")]),
             Q("r-losttree", "A hidden tree: each query returns a node's distance to every node. Rebuild all edges in at most ceil(n/2) queries.",
               "your question log, Q5", "Seeing the parity cut: every edge joins an even and an odd node.",
               ["Query node 1; split by even and odd distance.", "Query every node on the smaller side; distance 1 means an edge."],
               [L("Your write-up (Q5)", C + "yours-q5")], []),
             Q("r-randset", "insert, remove and getRandom, each O(1). Then duplicates. Then weighted.",
               "your question log, Q8", "A dense array plus a value-to-index map, swap with last.",
               ["Array for random access, map for O(1) find, swap the last element into the hole.",
                "Duplicates: a set of indices per value.", "Weighted: Fenwick tree O(log n), or the alias method with O(n) rebuilds."],
               [L("Your write-up (Q8)", C + "yours-q8")], []),
             Q("r-topk", "Weighted top-k over candidates, or a custom comparator for ranking.",
               "2 reports, low confidence", "A heap of size k, ties, and a comparator that is a total order.",
               ["Score once, keep a min-heap of size k: O(n log k).", "State the tie rule; check the comparator is transitive."],
               [L("Coding 8: weighted top-k", C + "onsite-topk")], [ACE]),
         ]},
        {"id": "design", "title": "System design",
         "blurb": "45 minutes on a whiteboard with a security engineer: data model, API, block diagram, behaviour under concurrent load, recovery from failures, trade-offs. Each box opens with a video, then the design in the guide's order: requirements, entities, API, the diagram built up stage by stage, the deep dives. Rebuild the staged diagram from blank; do not memorise the final one.",
         "items": [
             Q("r-jobs", "Design a distributed job scheduler or workflow orchestrator.",
               "5 reports", "No duplicate runs, retries, dependencies, and recovery when a worker dies.",
               ["Jobs table with status; workers claim with a lease (compare and swap or SKIP LOCKED).",
                "Idempotent execution; retries with backoff; a dead-letter state.",
                "DAG dependencies with a counter per job; recovery by lease expiry."],
               [L("Guide: job scheduler", G + "job-scheduler/requirements")], [ACE, PH_MLE, FAST, IQ],
               video=[V(True, "pzDwYHRzEnk", "Jordan has no life", 31, "Distributed Job Scheduler, Systems Design Interview", "The closest free walk of this exact prompt: the claim, run-twice and failure cases in the order the round asks them."),
                      V(False, "zl8BPH74GY4", "TechPrep", 23, "Distributed Task Scheduler: System Design Interview", "A shorter second pass, as a candidate would present it in the room.")]),
             Q("r-search", "Design candidate search or ranking for a job description.",
               "5 reports", "Retrieval plus ranking, hard filters from the job description, evaluation.",
               ["An LLM turns the description into hard filters; retrieve with hybrid search; rerank.",
                "Measure against labelled matches; say how you would debug a bad result."],
               [L("Guide: candidate search", G + "candidate-search/requirements")], [TARO_SR, GD_IN, IQ, ACE],
               video=[V(True, "r0Dciuq0knU", "IBM Technology", 9, "Top 3 RAG Retrieval Strategies: Sparse, Dense and Hybrid", "The three retrieval choices the design turns on, in nine minutes."),
                      V(False, "K1F8BIgcoNk", "vectorize", 14, "Rerank for better RAG (Explained)", "Why a reranker sits after retrieval and what it costs.")]),
             Q("r-pay", "Design payment or payout processing with reconciliation.",
               "3 reports", "Idempotency, a ledger as the source of truth, and reconciling with the provider.",
               ["Double-entry ledger; idempotency key per payout; outbox to the provider.",
                "Reconcile daily against provider reports; repair by state machine."],
               [L("Guide: contractor payouts", G + "contractor-payouts/requirements"), L("Reported designs: payments deltas", C + "payments-recon")], [FAST, PH_MAY],
               video=[V(True, "m6DtqSb1BDM", "Arpit Bhayani", 17, "Build a robust Payments service using Idempotency Keys", "The one mechanism every payment follow-up comes back to."),
                      V(False, "olfaBgJrUBI", "Code with Lucian", 32, "Design a Payment System, System Design Interview", "A full payment design end to end, for the ledger and reconciliation parts.")]),
             Q("r-copy", "Design an API to copy a dataset with its tasks, model responses and grades, so the copy changes independently.",
               "2 reports", "ID remapping, dependency order, async jobs that resume.",
               ["Map old to new IDs; copy parents before children.",
                "Async job with a job ID, batched, checkpointing the mapping so it resumes."],
               [GD("dataset-copy", "dataset copy", "copy-api")], [PH_MAY, FAST],
               video=[V(True, "GT9k8OSjzX8", "Jordan has no life", 19, "Durable Execution (Temporal and Inngest)", "No video covers this prompt itself. This is its hard part: a long job that checkpoints and resumes after a crash."),
                      V(False, "0yZAqIsyskA", "Stripe Developers", 23, "Simplifying distributed systems development with Temporal's durable execution", "The same idea from the team that runs it for payments.")]),
             Q("r-injection", "Design defences against prompt injection for an agent that calls tools.",
               "2 reports", "Trust boundaries and least privilege, a natural probe for a security interviewer.",
               ["Treat retrieved content as data; tools scoped per task and user; confirmation on side effects.",
                "Check outputs before they act; log every tool call."],
               [GD("prompt-injection", "prompt injection", "prompt-injection")], [PH_AAI, FAST],
               video=[V(True, "5ZA1lTxTH3c", "IBM Technology", 11, "Securing AI Agents: How to Prevent Hidden Prompt Injection Attacks", "Indirect injection through content the agent reads, and the layers that contain it."),
                      V(False, "2Er7bmyhPfM", "Donato Capitella", 34, "Design Patterns for Securing LLM Agents Against Prompt Injection", "A paper review of six design patterns; the vocabulary a security engineer will use.")]),
             Q("r-chat", "Design a persistent multi-thread AI chat, with context-window management.",
               "2 reports", "Storage per thread, and what goes into the window when the history is too long.",
               ["Messages table per thread; summary of old turns; retrieve relevant older turns.",
                "A token budget per section of the prompt."],
               [GD("chat-context", "multi-thread chat", "chat-context")], [PH_AAI, FAST],
               video=[V(True, "esY99nYXxR4", "AI Engineer", 17, "How we solved Context Management in Agents (Sally-Ann Delucia)", "A production team on what they keep, summarise and drop from the window."),
                      V(False, "4GiqzUHD5AA", "LangChain", 23, "Context Engineering for Agents", "The four moves on context: write, select, compress, isolate.")]),
             Q("r-tenantfair", "Design durable, tenant-fair work orchestration for slow LLM tasks, aware of quotas, with resumable progress.",
               "1 listing", "Fairness across tenants and respecting the model provider's rate limits.",
               ["Per-tenant queues, weighted fair or deficit round robin dispatch.",
                "Token buckets per tenant and per provider; checkpoint progress per step."],
               [GD("tenant-fair", "tenant-fair orchestration", "tenant-fair"), L("Guide: job scheduler", G + "job-scheduler/requirements")], [FAST],
               video=[V(True, "uoXqqMkuiP0", "Inngest", 5, "Solving problems with multi-tenant queueing with concurrency keys", "Five minutes from a queue vendor on one tenant starving the rest, and a key per tenant as the fix.")]),
             Q("r-mlpipe", "Design ML pipeline orchestration.",
               "1 listing", "A DAG of steps, artifacts and lineage, idempotent retries.",
               ["Steps as a DAG with versioned artifacts; each step idempotent by input hash."],
               [GD("ml-pipeline", "ML pipelines", "ml-pipeline"), L("Guide: job scheduler", G + "job-scheduler/requirements")], [PH_CO],
               video=[V(True, "9TDR-17wFY4", "Jordan has no life", 22, "Apache Airflow: DAGs and Batches", "How a real orchestrator runs a DAG of batch steps, and where it breaks.")]),
             Q("r-ticket", "Design an event ticket marketplace.",
               "2 reports", "Holding seats without double-selling under a rush.",
               ["Seat hold with expiry; atomic reserve; a waiting room for spikes."],
               [L("Guide: Ticketmaster", G + "ticketmaster/requirements")], [ACE, PH_CO],
               video=[V(True, "_1AF8eZI0RA", "TechPrep", 20, "Ticketmaster: System Design Interview", "The whole design in twenty minutes, as a candidate would present it."),
                      V(False, "fhdPyoO6aXI", "Hello Interview", 59, "Design Ticketmaster with an ex-Meta staff engineer", "The long, careful version; watch the seat-hold part if short on time.")]),
         ]},
        {"id": "gtm", "title": "GTM and the chat: likely prompts",
         "blurb": "Fifteen minutes with a Principal, Enterprise AI. No GTM question has been reported anywhere; these are the research's likely prompts, from Mercor's other finals and comparable forward-deployed rounds. The first four have your own answer: say it aloud, then compare. The rest are pointers: remember the bold line, tell it your way. Answer scenarios with questions first, then a scoped plan, one metric, and the risk.",
         "res": [V(True, "BAJMNQXzrgg", "Vinh Giang", 10, "How I Learned To Speak Clearly (English is my 3rd Language!)", "Pace, pauses and finishing a sentence: what a fifteen-minute round hears first."),
                 V(True, "_DbSgU5naDQ", "Patrick Dang", 12, "How To Run A Discovery Call", "Goal, current process, cost of the problem, who decides: the order of your scenario answer."),
                 V(False, "PLhAzAymMsY", "Maria Sheeran", 6, "40 English Phrases You Need for Online Meetings", "Stock phrases for buying time, checking you understood, and handing back.")],
         "items": [
             Q("g-pitch", "Why Mercor, and what does Mercor do? Pitch Mercor Enterprise.", "2 reports: background round, a 'Mercor Pitch' final",
               "That you can pitch it in two sentences and want this work specifically.",
               ["**Two sentences, then stop.** What Mercor does for labs, then what Enterprise does for companies.",
                "**One reason that is yours.** Evaluations are the product here, and they are your core work.",
                "Your verbatim Why Mercor is on [Prep](#/prep), Your story."],
               [], [ACE, DG_BEH], asset=["pitch"]),
             Q("g-project", "Tell me about a project from the product angle: whose decision was it, how did you define success, what was the outcome?", "2 reports: background round, Applied AI screen",
               "Ownership, and a metric named before the work.",
               ["**Owner first.** Say whose call it was in the first two sentences.",
                "**The metric before the build.** What you wrote down as success.",
                "**The outcome with a number, and one thing you would do differently.**"],
               [], [ACE, PH_AAI], asset=["project"]),
             Q("g-pushback", "Tell me about a time you pushed back on a customer or stakeholder.", "comparable: Palantir hiring manager",
               "Judgement: saying no with a reason and an alternative, and keeping the person.",
               ["**Agree with the goal first.** The problem they are solving is real.",
                "**Disagree on the mechanism, with a reason.** Cost, risk, or a rule you both agreed to.",
                "**Bring the alternative.** Never only a no. Then say what you conceded."],
               [], [ADASCI, ACED_PAL], asset=["pushback", "pushback2"]),
             Q("g-ambiguous", "An enterprise AI lab says its training data quality is slipping. What do you do? (Any ambiguous request: scope it before you design.)", "3 comparables: Palantir, OpenAI, Harvard guide",
               "Discovery before solutions.",
               ["**Do not propose yet.** Who noticed, how it is measured, slipping against what, what changed.",
                "**Ten real examples,** good ones from before and bad ones from now.",
                "**Check the measurement before the data.**",
                "**Then split it, scope one fix, one agreed number, a date, and the risk said plainly.**"],
               [], [DEVTO, FRAI, HARVARD], asset=["discovery"]),
             Q("g-aitools", "How do you use AI tools day to day? When did one give you a wrong answer?", "1 report, in detail",
               "Fluent but critical use, with verification.",
               ["**A real workflow.** Name the tools, what you hand them, and what stays yours: the decisions and the checks.",
                "**A real wrong answer and how you caught it.** You check by what was written to the database, not by how the output reads.",
                "**The rule you work to.** Measure the cause before acting on it."],
               [], [ACE, DG_BEH]),
             Q("h-owner", "What are you leading now, and why are you the owner rather than a participant? Your most intense work, and work you are proud of.", "2 reports: Applied AI screen and loop",
               "Ownership in plain terms, with a number.",
               ["**Name the decisions that were yours,** and what would have stopped without you.",
                "**One story, owned end to end,** with a number before and after. The project answer above works here too."],
               [], [PH_AAI, P13_AAI], asset=["project"]),
             Q("g-unhappy", "An enterprise stakeholder is unhappy: deliverables are late, or quality dropped since last week. What do you do?", "inferred from the panel's roles",
               "Empathy, then a calm diagnosis plan.",
               ["**Acknowledge first,** and name a time for a first diagnosis.",
                "**Three real examples.** What worse means, when it started.",
                "**Replay the same cases before and after:** model, input, their side, or the prompt.",
                "**Two tracks at once:** what you tell them, and what you fix."],
               [], [ACED_SCALE]),
             Q("g-present", "Present your solution to a customer executive (a role-play).", "comparable: Harvard guide",
               "Translating a technical plan for someone who decides and does not build.",
               ["**Their outcome in one sentence,** in their words.",
                "**The plan in three steps, one number, one risk.**",
                "**What you need from them, then stop and ask.** No architecture unless they ask."],
               [], [HARVARD]),
             Q("g-shared", "Several teams need to use one dataset without seeing raw or personal data. How?", "comparable: Palantir sample prompt",
               "Access design in plain words: least privilege, not copies.",
               ["**Ask who needs what, at what grain.**",
                "**Views or an API over the raw table, never copies.** Mask columns, filter rows per team, aggregates with a minimum group size.",
                "**Log every query; raw access by request, with an expiry.**",
                "Your own example: row-level security, and the default execute grant you caught."],
               [], [ACED_PAL, DEVTO]),
             Q("g-incentive", "An incentive or quality trade-off: referral bonuses raise volume and lower quality. What do you change?", "1 report, a non-engineering final",
               "Product sense on a two-sided marketplace.",
               ["**Define quality first:** hired, or still active after 30 days.",
                "**Pay on the outcome, not the sign-up;** tier or cap it.",
                "**One guardrail** (duplicate or fake accounts), and try it on one segment before all of them."],
               [], []),
             Q("h-pace", "Mercor moves fast and the hours are intense. How do you feel about that?", "several reports",
               "An honest answer with evidence, not a performative yes.",
               ["**An example, not a claim.** One concrete stretch of sustained intensity you have lived.",
                "**Speed with a safety net:** what you do to keep quality.",
                "**Then ask** what the real rhythm on Enterprise looks like."],
               [], [GD_SWE]),
             Q("g-ask", "What do you want to ask us?", "every round",
               "Curiosity and taste.",
               ["Ask what customer-facing work gets wrong, or how they decide what to build each week. Avoid pointed business questions.",
                "Your questions are on [Prep](#/prep/ask)."],
               [], [P13_CTO]),
         ]},
    ],
    "sources": [BLIND_AUG, BLIND_JUL, BLIND_HOW, GD_SWE, GD_ALL, GD_IN, GD_NOON, P13_TAG, P13_AAI, P13_CTO, TARO_SR, PH_MLE,
                PH_MAY, PH_AAI, PH_FX, PH_CO, ACE, FAST, IQ, GH_REF, DG_BEH, ACED_SCALE, ACED_PAL, ACED_DS, HARVARD, ADASCI, FRAI, DEVTO],
}
