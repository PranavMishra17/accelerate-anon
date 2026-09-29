"""alfred_, the system you own: the content of ALFRED.html.

Edit this file, then run `python alfred/build.py`. Never edit ALFRED.html by hand.

Every fact here comes from the system design guide's alfred_ design (checked against
alfred_'s code on 28 September 2026), the tracker's wc18 drill, the ZenML and Mphasis loop
modules, or PRANAV_MASTER_REFERENCE.md section 3.1. Lists marked `# verbatim` are Pranav's
own words: copy them exactly, never polish them. build.py checks them against
interviews/zenml_round3.py while that file exists.

Inline markup in any string: `code` and **bold**. Figures are keys into figures/figures.js.
"""

TITLE = "alfred_"
KICKER = "The system you own"
LEAD = ("alfred_ is a consumer AI assistant over email, calendar, SMS, web and MCP, and you are its founding LLM engineer. "
        "Two loops share one tool layer: an agent the user talks to, and a background pipeline that acts on mail alone and never sends. "
        "Open a section, look at the figure, say it out loud, then open the answer.")

# 1. Start here: the three answers (moved here from the guide's start board; the guide links to it).
START = [
    {"title": "Where does the agent run?", "items": [
        "In a Deno edge function on Supabase: `conv-v6-turn` for SMS, `conv-v6-web` for the web app.",
        "Long-running work (documents, routines, the phone agent, EmailEngine for IMAP) runs in containers on Railway.",
        "State lives in one Postgres, with pgmq for queues and pg_cron for schedules. Postgres is where state lives, never where the agent runs."],
     "fig": "alfredDeploy"},
    {"title": "One SMS, end to end", "ordered": True, "items": [
        "Linq webhook to `conv-v6-ingress`: checks the signature, dedupes, stores the message, inserts a job row, returns fast.",
        "The job worker claims the job (`SKIP LOCKED`) and hands it to `conv-v6-turn`.",
        "The turn runs: lease, trace, context, prompt, then the LangGraph agent, up to 12 steps (50 on the web).",
        "Every tool call goes through the wrapper stack, then guards check the reply before it is sent back through Linq."]},
    {"title": "Memory across conversations: three kinds, each reaching the turn a different way", "items": [
        "**The conversation.** The last 30 messages, trimmed to 6,000 tokens, go in as the transcript, plus a rolling summary and related past chats.",
        "**Facts** sit in the cached per-user block.",
        "**Working memory** is fetched on demand through a lookup tool."],
     "fig": "alfredMemory"},
]

GUIDE = "SYSTEM%20DESIGN.html#/designs/alfred"

# 2. The system, layer by layer. A figure drawn in Start here is linked, not drawn twice.
LAYERS = [
    {"id": "doors", "title": "Three doors, ingress and the job queue",
     "point": "SMS, web and MCP converge on one tool package. SMS goes through a webhook and a job row, because the reply can take longer than a webhook should.",
     "figs": ["alfredHld"],
     "nuances": [
         "**SMS.** Linq posts a signed envelope to `conv-v6-ingress`. It verifies the HMAC, dedupes on the event id in `v6_webhook_events`, resolves the phone number to a user, stores the inbound row in `linq_messages`, inserts a `process_turn` row into `v6_agent_jobs`, returns fast and pokes the job worker.",
         "`conv-v6-job-worker`, woken by that poke or by the one-minute cron, claims the job with `FOR UPDATE SKIP LOCKED` and hands it to `conv-v6-turn`. For a small cohort, a cheaper v7 first pass tries first and hands back to v6 when it can't answer.",
         "The SMS surface is 202-shaped even though it returns 200: the webhook is acknowledged and the turn runs later from a job row.",
         "**Web.** `conv-v6-web` authenticates the JWT, loads the same context, runs the same loop, and streams SSE frames: connected, tool_start and tool_end, delta, data, done. The old frame protocol was kept on purpose, so the client did not change when the brain did.",
         "**MCP.** Claude calls `/api/mcp` on alfred-web, which forwards the user's API token to `mcp-exec`. The function resolves the token to a user and runs one allowlisted tool through the full wrapper stack. Writes return `requires_confirmation: true` first; the client calls again with `confirmed: true`. The web route holds no service key.",
         "Phone calls come in through LiveKit, and mail sent to alfred_ through the email channel.",
         "On `v6_agent_jobs`, `claimed_at` is overwritten on a re-claim; measure from `started_at`."],
     "numbers": [["Chat volume", "about 310 turns a day fleet-wide, one every 4.6 minutes"],
                 ["Job worker cron", "every minute, as a backstop to the poke"]],
     "say": ["Three doors, one brain. SMS arrives as a signed webhook that I acknowledge immediately and turn into a job. Web is a JWT call that streams events. MCP is an API token resolved to a user, running the same tools behind an allowlist.",
             "Why the job row: Linq retries a webhook that doesn't answer fast, and a turn can take many seconds. So the webhook acknowledges at once, the work is a row that exactly one worker claims, and the lease stops two turns answering the same conversation."],
     "guide": [["The API step: three doors, one tool contract", GUIDE + "/api"], ["The high-level design, 23 boxes", GUIDE + "/hld"]]},

    {"id": "turn", "title": "The turn, and the prompt as a cache layout",
     "point": "Acknowledge fast, then lease, trace, context, prompt, agent graph, tool wrappers, guards, reply, close the trace. The layer order is the senior signal.",
     "figs": ["alfredTurn"],
     "nuances": [
         "**Lease.** One turn per conversation: a lease of 90 seconds, renewed every 30. It is a column with an expiry, not a session lock, because the work spans several provider calls.",
         "**Loop.** The agent graph is LangGraph (`runAgentGraph`), up to 12 steps on SMS and 50 on the web, over a model stack of Sonnet, Opus and Haiku. The graph is small (a model node, a conditional edge, a tools node) and the tools node is alfred_'s own: LangGraph's prebuilt one would bypass the wrapper stack.",
         "**Guards.** Before the reply goes out, guards check for fabricated claims; then a tone filter, and the reply is sent through Linq. A failed chunk is retried by an outbound-retry function.",
         "**Block 1**, fleet-shared: the instructions, the tool catalog and the skill index, plus a small overlay per surface. Byte-identical for every user, cached for an hour.",
         "**Block 2**, per user: about the user, preferences, connected accounts, email rules, and up to 40 facts. Cached with the five-minute default.",
         "**Block 3**, per turn, uncached: now, the entities you can refer to, pending confirmations, recent actions, the conversation summary, related past conversations, people mentioned.",
         "The history is not a block: the last 30 messages, trimmed to 6,000 tokens, go in as the message list.",
         "Cache hits are measured on the first model call of each turn only, because later calls are warm by construction. A test guards the byte-identical block, because one formatter change broke it on main.",
         "Every turn writes `v6_turn_traces`: surface, model, steps, `first_ack_ms`, `block1_cache_hit`, `block2_cache_hit`, usage."],
     "numbers": [["Prompt prefix", "about 107k cacheable tokens a call; 4 blocks, 3 cache breakpoints"],
                 ["Cache hit", "91.4% inside 5 minutes at $0.38 per Mtok; 62% outside it at $1.04"],
                 ["Shared warmth", "another user's turn inside 5 minutes: 70.8% cached against 57.8% alone, 27% cheaper per token"],
                 ["Cache write", "1.25x input; the 5-minute TTL expires between most users' turns"],
                 ["Agent loop", "at most 12 steps a turn on SMS, 50 on the web"]],
     "say": ["For chat: acknowledge the webhook, enqueue a job, and let the turn function take a lease on the conversation, open a trace, build a cached prompt, run a bounded loop where every tool call goes through the wrapper stack, then filter tone and send.",
             "Cost is a cache layout problem. The shared prefix is about a hundred thousand tokens, so it has to be byte-identical across users and cached for an hour, with the per-user part in its own slot."],
     "guide": [["The data flow: the turn, step by step", GUIDE + "/dataflow"], ["The cost dive", GUIDE + "/deepdives"]]},

    {"id": "wrap", "title": "The tool wrapper stack",
     "point": "No surface calls execute(). Every tool declares its side-effect class, and one wrapper stack decides whether a call previews, confirms or replays.",
     "figs": ["alfredWrap"],
     "nuances": [
         "A tool (`ToolDef` in `packages/tools`) declares a name, a description, a zod schema, a capability (`read`, `write` or `bulk`), whether it is idempotent with an `idempotencyKey(input)`, and `execute(input, ctx)`, where `ctx.db` is service-role, scoped by `user_id`.",
         "Surfaces call `compose(tool)`, which wraps it in order: schemaValidation, capabilityGate, preview, confirmationPolicy, idempotency, conflictCheck, toolExecutionLog, entityEmission, proceduralObservation, timeout.",
         "The first MCP version called execute() raw, and would have double-booked meetings on a retry. That is the cost of skipping the stack.",
         "**No risk score.** Sending mail is never a matter of a threshold: the background executor has no send path, and only one function sends, after approval.",
         "**The effects ledger.** `turn_effects` and `side_effects` record what actually changed in the world. They, not the assistant's text, decide whether an action happened.",
         "**Every email is untrusted input.** Email bodies are tagged as data, a guard strips tool-call markup the model echoes, the fabrication guard checks that claimed reads happened this turn, and the silent action set is small and fixed."],
     "numbers": [["Wrappers", "10, in a fixed order, around every call"],
                 ["Capability classes", "read, write, bulk"]],
     "say": ["I do not gate on a risk score. Every tool declares what class of side effect it has, and one wrapper stack around every call decides whether it previews, confirms, or replays. On top of that, the background executor has no send path at all.",
             "Retries come from three places, so I need three layers: dedupe the webhook, lease the conversation, and key every write. A lock in memory would guard nothing across a provider call."],
     "guide": [["Action safety without a risk score", GUIDE + "/deepdives"]]},

    {"id": "pipe", "title": "The email pipeline",
     "point": "Nine steps, two model calls, and one function that sends, only after approval.",
     "figs": ["alfredPipe"],
     "nuances": [
         "**Ingest (code).** Push webhooks land on a pgmq queue; a consumer gates the user (entitlement, onboarding, deletion, two circuit breakers), applies skip filters (calendar invites, self-mail, older than 48 hours), fetches the body and upserts into staging. A cron poller covers accounts without push, with the same upsert.",
         "**Rule match (code).** `user_email_rules` runs deterministically inside triage, before any model call, and a rule fire is recorded on the pending action.",
         "**Triage (model).** One batched call per user batch. Per email: a category (archive, important, fyi, draft) and an autonomy level (`execute_silent`, `execute_inform`, `suggested`). A cheap-tier router sends obvious batches to a smaller model.",
         "**Decide, then act.** One `donna_pending_actions` row per email; the executor archives, marks read, labels and moves, and has no send path by construction. The worker drafts replies in the user's voice. Notify texts important and fyi items through the same Linq path chat uses.",
         "**Send (gated).** Only `donna-send-approved-draft` sends, and only after the user approves.",
         "**Verify and reverse.** A reconciler checks the provider and stamps `background_effect_verified_at`; a reverser undoes a silent action the user rejects.",
         "`donna_pending_actions` is the contended entity: the executor, the drafter, the reverser and the user all move its status.",
         "A completeness monitor samples the provider against staging, because a stage-to-stage diff cannot see mail that never entered the pipeline.",
         "**Rollout.** Nothing ships behind an environment variable: `donna_consumer_config` holds the percentage dials and `alfred_feature_flags` the kill switches. A wing ships dark and is turned up by one UPDATE."],
     "numbers": [["Pipeline", "9 steps, 2 model calls, 1 send path"],
                 ["Accounts", "up to six Gmail, Outlook or IMAP accounts a user"],
                 ["Email rules", "about 98% created in chat"]],
     "say": ["This is a pipeline, so I will list the steps and mark which ones are model calls. Nine steps, two model calls: triage and drafting. Everything that touches the provider is code.",
             "Silent actions are archive, label, move. Drafts wait for the user. Sending is a separate function that only runs after approval, and a reconciler verifies every silent effect against the provider afterwards."],
     "guide": [["The background pipeline, nine steps tagged", GUIDE + "/dataflow"]]},

    {"id": "memory", "title": "Memory",
     "point": "Three memories, three ways in: the conversation as transcript and summary, facts in the cached per-user block, working memory fetched on demand by a tool.",
     "figs": [], "figIn": "alfredMemory",
     "nuances": [
         "**The conversation.** Messages are stored per surface. A rolling summary is rewritten every 8 messages, and the three most related past conversations are recalled. The summary and related chats sit in the per-turn block; recent messages are the transcript.",
         "**Facts.** `v6_user_facts`, written by the agent's remember and update tools and by an extraction job every 12 messages, marked as inferred. Up to 40 sit in the cached per-user block. The user can read and correct them on the memory page.",
         "**Working memory.** `working_memory_items`: one row per loop (an owed reply, an awaited reply, an obligation), with whose move it is and whether it is open. Scheduled reconcilers build it from email and calendar, and code, not a model, decides open or closed.",
         "The agent reaches it through `working_memory_lookup`: first a compact view per topic, then a topic's threads. For people named in a message, their open loops can appear directly, behind a rollout dial.",
         "**Why a tool.** Loops change constantly and there can be many; in every prompt they would cost tokens and break the cache. On demand, the prompt stays stable and you pay only when a question needs them.",
         "**The brief** is separate: about every twenty minutes a working-memory brief is composed, and there the model only picks from real candidates behind opaque handles while code re-attaches ids and ownership."],
     "numbers": [["Transcript", "last 30 messages, trimmed to 6,000 tokens"],
                 ["Summary", "rewritten every 8 messages; 3 related past chats recalled"],
                 ["Facts", "extracted every 12 messages; up to 40 in the cached block"]],
     "say": ["There are three kinds. The conversation itself: the last 30 messages, trimmed to about 6,000 tokens, plus a rolling summary rewritten every 8 messages and the three most related past chats.",
             "Facts: the agent writes them with its own tools, and a background job extracts more every 12 messages. Up to 40 sit in the cached per-user part of the prompt, and the user can correct them.",
             "And working memory, which I work on: one row per open loop, an owed reply, an awaited reply, an obligation, built by scheduled reconcilers over email and calendar. The agent fetches it with a lookup tool when it needs it, because putting it in every prompt would cost tokens and break the cache."],
     "guide": [["The entities, including the memory stores", GUIDE + "/entities"]]},

    {"id": "runs", "title": "Where everything runs",
     "point": "The agent runs in a Deno edge function on Supabase, long work runs on Railway, and state lives in Postgres.",
     "figs": [], "figIn": "alfredDeploy",
     "nuances": [
         "**Requests** come in four ways: SMS through a Linq webhook; the web app, Next.js on Vercel; Claude over MCP, through alfred-web's `/api/mcp` on Vercel; and phone calls through LiveKit.",
         "**Compute** is Supabase edge functions in Deno: conv-v6 ingress, job worker and turn for SMS, `conv-v6-web` for the web app, `mcp-exec` for MCP, and the email pipeline.",
         "**Work that outlives a request** runs in Railway containers: the document writer, the routines worker, the LiveKit phone agent, and EmailEngine for IMAP. Edge invocations are short-lived, so those containers claim jobs from the same Postgres rows and run as long as they need.",
         "**State** is one Supabase Postgres with row-level security: jobs, traces and product data, pgmq queues for the event bus, pg_cron for schedules, storage buckets for files. Outside: Anthropic for the agent, and Google and Microsoft mail and calendars.",
         "**The honest ceiling.** One Postgres carries every workload: chat, ingestion, triage, briefs and crons. Isolation is in the schema today: partitioned event tables, partial indexes on hot statuses, SKIP LOCKED consumers, tuned vacuum on the pending-actions table. The signal to split is chat latency moving with triage batch size."],
     "numbers": [["Edge functions", "about 370 Deno functions, about 250 cron registrations, one Postgres"],
                 ["Users", "5,000+ active users"]],
     "say": ["Compute is Deno edge functions on Supabase, with a few long-running containers on Railway for documents, routines and phone calls; state is one Postgres with row-level security, pg_cron for schedules and pgmq for the event bus. That is a deliberate choice for a small team; the trade-off is that one database carries every workload.",
             "The day chat latency moves with triage batch size is the day the pipeline gets its own instance."],
     "guide": [["One Postgres for everything", GUIDE + "/deepdives"]]},
]

# 3. The stories. `verbatim: True` marks Pranav's own words (the `say` list), copied exactly.
STORIES = [
    {"id": "bench", "title": "The eval bench", "length": "about 2 minutes",
     "land": "The real agent against a frozen snapshot of the user's world; only the provider call swapped; scored on tool calls per completed task.",
     "tests": "Tell me about the eval harness. Headline first, every time.",
     "say": [
         "When I joined alfred_, we had no reliable way to say whether a new version of the agent was better than the old one. People tried it and had opinions. So I built the loop that turns production failures into regression tests.",
         "It starts with a scanner over real conversations. Cheap deterministic signals flag anything that looks like one of twelve failure types, and an LLM judge, trained on a week of labels I did by hand, decides which flags are real. Roughly three out of four are genuine bugs. Real ones get fixed and promoted into a bench of a little over a hundred cases.",
         "Replay is the interesting part. The real agent runs in a harness mode. The tools execute normally, so ranking, filtering and formatting are the production code. Only the call out to Gmail, the calendar or an MCP server gets routed to a SQLite snapshot. And the snapshot isn't one recorded path: for a query type we pulled about twenty-five real instances and covered every tool the agent used across all of them, plus deliberate ambiguity, like three people named Michael.",
         "So the agent can take a path it never took in production and still get truthful answers. We score on tool calls per completed task and on assertions against the snapshot, run it nightly, and it's what we used to sign off a full rewrite of the agent's multi-turn orchestration."],
     "numbers": ["5,000-plus users", "twelve failure classes", "about three in four genuine", "a little over a hundred cases",
                 "about twenty-five instances per snapshot", "2.5 down to 2.2 tool calls per task",
                 "about ten percent flaky, run three times", "under ten minutes for a subset, about half an hour nightly"],
     "probes": ["What started it?", "How do you find failures?", "What exactly is faked?", "How is a run scored?", "What did it change?"],
     "swaps": [
         {"when": "If they ask about nondeterminism", "line": "Remove it where an action commits a side effect. Elsewhere, the flaky ten percent run three times and report a pass rate; one lucky run never counts."},
         {"when": "If they ask whether it gated deploys", "line": "Nightly runs plus subset runs on changes, reviewed by whoever made the change. It blocked the big releases, like the orchestration rewrite. It wasn't a hard gate on every commit, because a thirty-minute run with model variance on every push would have slowed the team more than it protected them."},
         {"when": "If they ask what it doesn't catch", "line": "Anything where the right answer isn't countable from the fixture, like whether a meeting brief is actually useful. And the bench only knows failures that already happened, so new features start with no coverage."}],
     "figs": ["benchLoop", "harnessSeam"],
     "more": [
         {"q": "The bench, in five minutes: nine beats", "a": [
             "**The problem.** The agent runs over email and calendar for 5,000-plus users. Every change touched prompts, tools or orchestration, and we had no deterministic way to compare versions. The trigger was a rewrite of how the agent handles multi-turn conversations: too big to eyeball, too risky to ship on vibes.",
             "**Finding failures.** The scanner runs daily over conversations with cheap deterministic checks first: the agent said it did something and no tool ran, the user repeated themselves, a tool errored and the agent kept going. Twelve classes.",
             "**Judging.** Deterministic signals over-fire, so an LLM judge sits on top, its rubric built from a week of flags I labelled by hand. It agrees with a human on roughly three in four as genuine, reconciled weekly.",
             "**Promotion.** A genuine bug is fixed, then promoted: a reconciler adds a new case, updates one, or merges it into one that already covers the failure. A little over a hundred cases now.",
             "**The snapshot.** For a query type like 'create a task from this email', we pulled about twenty-five real instances and covered every tool used across them, plus deliberate ambiguity. The base is append-only.",
             "**Replay.** Tool code runs for real; at the provider boundary the call goes to the case's SQLite copy. Writes land there, so a task created at turn two is visible at turn three, and we reset between cases.",
             "**Scoring.** Deterministic assertions against the snapshot, then a judge only for what can't be counted. The headline is tool calls per completed task: 2.5 down to 2.2 means the same outcome, found faster.",
             "**Trust and cost.** About ten percent of cases are flaky, so those run three times. A tool change runs only the cases that touch it, under ten minutes; the full bench runs nightly, about half an hour.",
             "**Outcome.** It's how we signed off the orchestration rewrite: old and new agent against the same hundred-plus cases, and we could point at exactly which cases got better, which got worse, and why."]},
         {"q": "What makes a run count as done, and how is it scored?", "a": [
             "The snapshot decides it, not a model. For 'make a todo list from this email', the snapshot knows the right email and its action items, so the run passes only if the agent read that email and the tasks match.",
             "Tool calls per completed task is only counted over runs that pass, so an agent that wraps up early on an empty result doesn't look efficient, it fails. We moved it from 2.5 to 2.2 for the same outcomes.",
             "And we never pin expected text. The assertions come from what the snapshot holds, so if there are four action items, all four have to appear. Pinning a known-good answer would be teaching to the test."]},
         {"q": "How do you decide what becomes an eval case, and is the judge still right?", "a": [
             "The first filter is the whole game, because everything downstream depends on it. Early on a signal flagged 'abandoned' conversations, and a lot of them were one-way notifications where nobody expected a reply. Another class, 'agent did nothing', was wrong: the agent had acted, we weren't joining against the tool-execution record. Both got fixed by grounding the signal in what actually executed, not by tuning a threshold.",
             "Then there are two judges, in different states. The scanner's judge, which decides whether a flag is a real bug, is calibrated weekly against fresh human labels: about three in four agreement. The completeness judge on the bench isn't calibrated yet; where the answer is countable I replaced it with assertions, so it only judges what can't be counted.",
             "To tell judge drift from agent change I'd keep a frozen set of past outputs and re-judge it whenever the judge's model or prompt changes. The outputs didn't move, so if the verdicts did, the judge moved."]},
         {"q": "A tool the snapshot doesn't cover: what does the agent get back?", "a": [
             "It never leaves the machine: with the harness flag on, every provider call goes to the snapshot, so there's no path to a live system.",
             "What the agent gets back is honestly the weak spot. Today it's an empty result, and the call is logged against the run. But an empty result is a plausible answer: the agent can read it as 'there are no meeting notes', which is the harness telling it something false.",
             "So I'd return an explicit 'not in this snapshot' error it can't mistake for data, and treat any run that hit one as harness-limited: out of the headline number, onto a list that becomes the backlog for enriching the snapshot."]},
         {"q": "How long does one case take to author, and what would you change?", "a": [
             "I never instrumented it, so this is an estimate rather than a measurement: about three to four hours a case at the start, dropping to forty-five minutes to an hour once the scanner pulled the traces and prior turns together automatically.",
             "It's expensive, and that's the honest trade-off: we bought answers that hold up when the agent takes a new path, and paid in expert time per case.",
             "What I'd change: instrument authoring time from day one, since I can't give you a measured number, and version the base snapshot explicitly instead of relying on append-only discipline."]}]},

    {"id": "wm", "title": "Working memory", "length": "about 75 seconds",
     "land": "The model picks from real candidates; code attaches the ids, so it can't invent a thread.",
     "tests": "Hallucination, as a design problem: did you make it less likely, or impossible?",
     "voice": "Written in your voice from your own facts (the master reference, section 3.1, and the guide). Make it yours.",
     "say": [
         "Working memory is one of the parts of alfred_ I own. It's one row per open loop: a reply you owe, a reply you're waiting on, an obligation, with whose move it is and whether it's still open.",
         "The hard problem was trust. An LLM summarising an inbox invents threads, flips who owes the next move, and shows closed loops as open.",
         "So I re-architected it into a strict-ID pipeline. The model only picks from a menu of real candidates behind opaque handles, and writes the prose. It never emits an id or an ownership field; code re-attaches identity, ownership and closed state. That makes the whole class of hallucination structurally impossible, not less likely, and tests enforce it.",
         "Scheduled reconcilers build it from email and calendar, and code, not a model, decides open or closed. The agent reaches it through a lookup tool, a compact view per topic first, then a topic's threads, because loops change all the time and putting them in every prompt would cost tokens and break the cache.",
         "And I checked it against reality: a ground-truth audit loop grading the generated briefs against the live inboxes."],
     "numbers": ["one row per loop: owed reply, awaited reply, obligation", "a brief about every twenty minutes",
                 "3 kinds of memory; up to 40 facts in the cached block"],
     "probes": ["How do you stop the model inventing a thread?", "Who decides a loop is closed?", "How do you know who owes the next move?",
                "Why a tool and not the prompt?", "How do you know the briefs are right?"],
     "swaps": [
         {"when": "If they want it in one line", "line": "The model only picks from real candidates behind opaque handles, and code attaches the ids, so it can't invent a thread."},
         {"when": "If they ask how ownership is decided", "line": "By direction, in code: whether the last message came from the other person or from one of the user's own addresses."},
         {"when": "If they ask why it's a tool", "line": "It changes constantly and can be large; fetching on demand keeps the prompt cache stable and only costs tokens when a question needs it."},
         {"when": "If they ask how it scales with a big inbox", "line": "Live provider fetch, then map-reduce summarisation, so the work grows with the inbox rather than hitting one context window."}],
     "figs": [], "figIn": "alfredMemory"},

    {"id": "swap", "title": "The SQLite swap", "length": "about 90 seconds", "verbatim": True,
     "land": "I don't emulate every provider. I emulate the contract that the agent actually depends on.",
     "tests": "How do you actually replace third-party APIs with SQLite? Intercept depth, and whether the swap makes architectural sense.",
     "say": [  # verbatim
         "The “swap” isn't a generic runtime trick. I put an abstraction at the provider boundary.",
         "The agent calls something like `GmailAdapter.search()` or `CalendarAdapter.createEvent()`. In production, that adapter calls Gmail or Google Calendar. In the harness, the same interface is backed by a local implementation that reads and mutates the SQLite snapshot.",
         "So I don't try to make SQLite look like Gmail. I model the subset of the provider's domain that the evaluation needs — messages, threads, participants, attachments, events, contacts, tasks, notes, etc. — and implement the same operations the agent actually uses against that model.",
         "For example:",
         "`gmail.search()` → query `messages/threads` in SQLite",
         "`gmail.send()` → insert/update the corresponding message state",
         "`calendar.create()` → insert an event",
         "`calendar.update()` → mutate that event",
         "`asana.createTask()` → insert a task",
         "The important part is that the agent doesn't know which implementation it's talking to. The harness controls the dependency through the adapter boundary.",
         "The SQLite model is therefore a small relational representation of the user's world, not a copy of every provider's database. I only model the entities and operations needed by the evals, which keeps the snapshot deterministic and resettable."],
     "numbers": ["about twenty-five real instances per snapshot", "three Michaels, on purpose", "one fresh copy of the base per case"],
     "probes": ["What's real in a replay and what's faked?", "Where exactly does the faking happen?", "Isn't emulating Gmail a huge amount of work?",
                "What does the SQLite data model look like?", "Why not mock the whole tool?"],
     "swaps": [
         {"when": "If they challenge the complexity", "line": "I don't emulate every provider. I emulate the contract that the agent actually depends on."},
         {"when": "If they ask why not mock the whole tool", "line": "Because most of our bugs lived in the seam between what a tool returned and how the model read it. If I'd mocked the whole tool, I'd have been testing the model against a simplified world and missing exactly the bugs we had."},
         {"when": "If they ask what happens on a call you didn't model", "line": "It's logged against the run as not in the snapshot. Honestly that used to come back as an empty result, which is the weak spot; I'd make it an explicit error the agent can't mistake for data."}],
     "figs": ["benchAdapter", "benchSchema", "sqliteTemplate"],
     "more": [
         {"q": "The board: the seam, the contract, the tables", "a": [
             "**The seam.** Tools call a provider interface, never Gmail directly. Behind it sit production adapters (Gmail, Google Calendar, Outlook, Asana) and harness adapters backed by SQLite. A harness flag picks one; with it on, there is no path to a live system.",
             "**The contract.** `GmailAdapter`: `search`, `getThread`, `send`, `archive`, `label`. `CalendarAdapter`: `listEvents`, `createEvent`, `updateEvent`. Tasks: `createTask`, `listTasks`. Each returns the shape the production adapter returns.",
             "**The tables.** contacts, threads, messages, participants (a join table, so 'emails from Priya' is a query), events and attendees, tasks with `source_message_id`. Beside the world: `case_meta` (case id, world version, user, a pinned 'now') and `call_log` (turn, tool, argument hash, served_by).",
             "**Deterministic and resettable.** An immutable base file, a fresh copy per case, 'now' pinned, stable ids and a fixed sort order, no randomness in the adapters, every call in `call_log`.",
             "**Deliberately not modelled.** OAuth, rate limits, push, HTML rendering, pagination tokens. Provider errors are injected explicitly when a case needs one."]},
         {"q": "Why SQLite when production is Postgres?", "a": [
             "Two reasons, one good and one I'd revisit. The good one: a snapshot is a single file. Trivial to capture, trivial to spin up per case, full isolation between cases, and I can open it and see exactly what the agent saw.",
             "The one I'd revisit: it isn't the production engine. No row-level security, different types, dialect differences. So it tests agent behaviour faithfully and database behaviour not at all.",
             "Rebuilt today I'd use Postgres template databases, CREATE DATABASE ... TEMPLATE, cloning per case at near-SQLite speed on the real engine. Did the gap bite? Not that I caught, which isn't quite the same thing."]},
         {"q": "What happens when the production schema changes?", "a": [
             "The base snapshot is append-only by design: old rows don't move under old cases, and a new case that needs another Michael gets a new name. So a case that used to pass and now fails points at the agent, not the fixture.",
             "What I'd add on top is to version the snapshot, pin each case to a version, and fail loudly on a mismatch. A test that silently measures the wrong thing is worse than one that refuses to run."]}]},

    {"id": "multiturn", "title": "Multi-turn replay", "length": "about 45 seconds", "verbatim": True,
     "land": "Goal-oriented and stateful, not yet adaptive; the next step is a calibrated, goal-oriented user simulator.",
     "tests": "Does your harness actually support multi-turn evaluation? Honesty first, then a design you could defend.",
     "say": [  # verbatim
         "Not fully. I’d describe my current harness as a goal-oriented, stateful evaluation harness, rather than an adaptive multi-turn harness.",
         "I collect and aggregate a task spec from real production behavior, create a snapshot of the relevant user world, and then let the actual agent run against that snapshot. The state persists within the case, so multiple steps can affect the same world, but the user turns themselves are currently scripted rather than generated in response to what the agent actually says or does.",
         "The next thing I’d add is a goal-oriented user simulator: give it the user’s goal, constraints, and a controlled view of the resulting state, and let it decide whether the next turn should be a clarification, correction, confirmation, or termination."],
     "numbers": ["state persists within a case: a task made at turn two is there at turn three", "pass^k over a few runs"],
     "probes": ["Can the user side react to what the agent does?", "What happens when the agent's reply changes at turn two?",
                "How would you build the simulator?", "How do you keep a simulated user honest?", "Why not simulate from the start?"],
     "swaps": [
         {"when": "If they ask what happens when the reply changes at turn two", "line": "The recorded turn-three message may no longer make sense. Freezing the world fixes effects across turns, not a user who would have said something else."},
         {"when": "If they ask why not simulate from the start", "line": "Because a simulator is a second model in the loop. I'd replay the recorded user turns while the agent stays equivalent, and only hand over to the simulator at real divergence."},
         {"when": "If they ask how you'd keep it honest", "line": "Calibrate it on the unchanged baseline. If it can't reproduce what the real user said to the old agent, its behaviour on the new one isn't evidence."}],
     "figs": ["multiturn"],
     "more": [
         {"q": "The design: three options and the simulator", "a": [
             "**Truncate** at the first divergence and score only up to there: cheap and honest, but blind to what the change did afterwards.",
             "**Simulate** the user from the start: a full counterfactual, but a second model in the loop the whole time.",
             "**Hybrid** (the pick): replay recorded user turns while the agent's replies stay equivalent, and hand over to the simulator only at real divergence.",
             "**The simulator** gets the goal and constraints, a persona, and a controlled view of the state (what the user could see, never the answer key). Each turn it chooses clarification, correction, confirmation or termination; it stops on goal met, give-up, or the turn budget.",
             "**Keeping it honest.** Hold it fixed across baseline and fork, calibrate on the baseline, and mark every simulated turn as simulated. Risks: too cooperative, goal leakage, drift, error compounding, cost.",
             "**Scoring.** Final world state against the goal state for pass or fail; trajectory and policy scored separately; pass^k, because a simulator adds variance of its own."]}]},

    {"id": "refunds", "title": "The two missing refunds", "length": "about 75 seconds",
     "land": "The case first: a clean ledger missing two refunds. Then the lesson: assert against ground truth you hold.",
     "tests": "When did the bench pass something that was actually broken? A false signal, told as a story. Lead with the case.",
     "say": [
         "The clearest one was a ledger request: pull every financial event across my accounts and cards into one view. The agent produced a clean, well-formed ledger and left out two refunds. Every surface check passed, and the same omission showed up again on a later version.",
         "We found it the way you find most of these: a user noticed the output was wrong rather than malformed. The frustration signals don't fire when an answer merely looks right.",
         "The lesson was about what the scorer asserted. We checked trajectory and shape, and nothing checked completeness. For this class we could, because we own the snapshot: it knows how many financial events fall in that window, so the case can assert every one appears. That's the advantage of freezing a world rather than a transcript."],
     "numbers": ["two refunds missing", "four action items, three created: fails, scores 0.75 on completeness"],
     "probes": ["Four action items, the agent creates three: pass or fail?", "Who decides 'completed'?", "Where does that stop working?"],
     "swaps": [
         {"when": "If they ask where that stops working", "line": "When the answer isn't enumerable. A meeting brief isn't a set you can count, so those need a human lens and stay out of automated gating."},
         {"when": "If they ask about four items and three created", "line": "It fails, and code decides. Action items are countable, so the case asserts all four; three of four fails and scores 0.75 on completeness."}],
     "figs": ["completeness"]},

    {"id": "grant", "title": "The PUBLIC grant", "length": "about 45 seconds",
     "land": "Fix the class, not the instance.",
     "tests": "Hardest bug you've debugged? Mechanism-level understanding.",
     "say": [
         "Agent-facing read functions in Postgres were SECURITY DEFINER, so they run with the definer's privileges and can see past row-level security to do their job. The subtle part: Postgres grants EXECUTE to PUBLIC by default on a new function, so a function deliberately bypassing RLS was callable by any authenticated role. A cross-user leak class.",
         "Nothing was exploited; it came out of an adversarial design review. We fixed the grants, and the more important fix was the migration checklist and a test: no SECURITY DEFINER function may carry a PUBLIC execute grant."],
     "numbers": ["one class of cross-user leak, closed by a test"],
     "probes": ["Why SECURITY DEFINER at all?", "How did you find it?", "How do you stop it coming back?"],
     "swaps": [],
     "figs": ["definerGrant"]},

    {"id": "notify", "title": "Notifications: ninety seconds to three", "length": "about 30 seconds",
     "land": "The event as trigger, cron as backstop.",
     "tests": "Latency: do you find where the time actually goes?",
     "say": [
         "An important email reached the user by SMS about ninety seconds after it arrived, and it wasn't compute. It was the polling timer: a cron drain's worst case is its interval.",
         "So delivery fires on the event the moment a notification is queued, and the cron stays as a backstop. About ninety seconds down to about three, and the security and one-time-code path, which had been 189 seconds at p90, went to instant."],
     "numbers": ["~90s to ~3s, about 30x", "security and OTP path: 189s p90 to instant"],
     "probes": ["Where was the time going?", "What happens if the trigger misses?", "How do workers not double-send?"],
     "swaps": [{"when": "If they ask how two workers don't take the same job", "line": "Claiming is SELECT ... FOR UPDATE SKIP LOCKED, so two workers never take the same job."}],
     "figs": ["skipLocked"]},

    {"id": "rules", "title": "The rules matcher: a model call removed", "length": "about 30 seconds",
     "land": "The best cost cut was removing a model call.",
     "tests": "Cost: do you instrument first, and do you reach for code when code can decide?",
     "say": [
         "Email rules are the product's stickiest feature: users write them in plain language from chat, about 98 percent of them. Each message used to go through an LLM call to match rules.",
         "I replaced that with a deterministic three-stage matcher that runs before the model sees the mail. It cut per-user LLM cost about 30 percent and kept rule execution reliable. A verify-after-edit check warns when a new rule matches none of the user's recent mail."],
     "numbers": ["about 30% per-user LLM cost cut", "about 98% of rules created in chat"],
     "probes": ["How did you know where the money went?", "What does the model still decide?", "How do you catch a rule that never fires?"],
     "swaps": [{"when": "If they ask how you found it", "line": "Before changing anything I instrumented spend per model and per stage, because my guess about where the money went was wrong."}],
     "figs": []},
]

# 4. What they ask: the recurring questions, one answer each.
ASKS = [
    {"q": "What does your day-to-day look like at alfred_?", "verbatim": True,
     "a": [  # verbatim
         "It's pretty varied, which is one of the things I like about the role.",
         "A typical piece of work might start with a production failure. I'll look at the conversation and the tool trace, figure out whether it's a model problem, a tool problem, or something in our orchestration or memory layer.",
         "If it's something we need to reproduce, I'll add it to the eval harness. The harness takes a snapshot of the relevant user environment — email, calendar, whatever the task needs — and lets the actual agent code run against that state. So we're testing the same tool paths we use in production rather than mocking the whole agent.",
         "Then I'll usually build the fix, run the regression set, and look at whether we've actually improved the behavior without breaking something else.",
         "I've also worked on the production failure scanner, working memory, reliability infrastructure, and some of the cost and orchestration pieces.",
         "So it's a mix of debugging production behavior, building infrastructure, writing product code, and figuring out what we should build next."],
     "swaps": [{"when": "If they ask “how much coding?”", "line": "A lot. I'm usually in the codebase every day. The difference is that because we're a small team, the coding is usually preceded by figuring out what the right thing to build is."}]},
    {"q": "Why are you looking to leave alfred_?", "verbatim": True,
     "a": [  # verbatim (the ZenML version)
         "There's nothing particularly wrong with alfred_. I've actually learned a lot there and I still enjoy the work.",
         "I'm mostly looking at what I want the next few years of my career to look like. At alfred_, I've had a lot of ownership because it's a small team, and that's been great. But the work is ultimately internal to one product.",
         "What I'm increasingly interested in is building the infrastructure and developer experience that other engineers depend on. That's one of the reasons Kitaru caught my attention — it's very close to problems I've already been solving, but the product itself is the thing I'm building.",
         "So it's less “I need to get away from Alfred” and more “I've found a direction I want to go deeper into.”"],
     "note": "Paragraph 3 is written for each company: this is the ZenML version; the Mphasis page has one about range across clients."},
    {"q": "Where does alfred_'s agent turn actually run?",
     "a": ["In a Deno edge function on Supabase, conv-v6-turn for SMS and conv-v6-web for the web app. Long-running work runs in containers on Railway; state is in Postgres."]},
    {"q": "Why do documents, routines and phone calls run on Railway instead of in edge functions?",
     "a": ["Edge function invocations are short-lived. Work that outlives a request needs a long-running process, so those containers claim jobs from the same Postgres rows and run as long as they need."]},
    {"q": "Why acknowledge the webhook before doing any work?",
     "a": ["The provider retries anything slow, and the turn can take seconds. Acknowledging fast and moving the work to a claimed job row avoids duplicate turns and timeouts."]},
    {"q": "What stops two texts sent a second apart from producing two overlapping replies?",
     "a": ["Dedupe on the event id stops a retried webhook; the conversation lease lets only one turn run per chat, so the second job is requeued until the first finishes."]},
    {"q": "Name the three retry layers in a chat turn.",
     "a": ["Webhook dedupe on the event id, a lease per conversation, and idempotency keys on write tools. Each covers a retry the others cannot see."]},
    {"q": "Which parts of the prompt are cached, and for how long?",
     "a": ["The shared instructions and tool catalog for an hour; the per-user block with the five-minute default; the per-turn block isn't cached.",
           "It's a cost decision: the shared prefix is large, and another user's turn warms it for everyone if it's byte-identical, so it's laid out to maximise cache hits."]},
    {"q": "What stops the pipeline sending mail it shouldn't?",
     "a": ["Structure, not a threshold. The executor has no send path; silent actions are archive, mark read, label and move, and they're reversible. Only donna-send-approved-draft sends, and only after the user approves. A reconciler then verifies every silent effect against the provider."]},
    {"q": "Every email is untrusted input. How do you handle prompt injection?",
     "a": ["Three layers, in order of trust. Tell the model to treat mail as data; tag email bodies as untrusted and strip tool-call markup the model echoes, with a fabrication guard that checks claimed reads happened; and make the write path structurally unable to act on it, with a small fixed set of silent actions and send and forward behind preview and confirm. The last one is the one that holds when the first two fail."]},
    {"q": "A side-effecting tool call fails halfway. What happens?",
     "a": ["You can't get exactly-once against a third-party API you don't control, so the goal is exactly-once logical effect: at-least-once delivery with effects that are safe to repeat.",
           "We write the intent to a tool-execution ledger before the call, so there's a record even if the process dies mid-flight; the anti-fabrication guards read the same ledger. Writes preview and confirm first, and carry an idempotency key.",
           "If the send succeeded but the response timed out, look the effect up at the provider before retrying blind. The real design work is where the idempotency key lives."]},
    {"q": "Why a queue in Postgres, and how is it claimed?",
     "a": ["Postgres, with pgmq for the event bus and pg_cron for schedules, because everything else already lived there: one database to back up, secure and reason about, and at our volume it's plenty. Kafka or SQS would have been a second system for a small team to run.",
           "Claiming is SELECT ... FOR UPDATE SKIP LOCKED, so two workers never take the same job. I'd move off it the day queue load moves chat latency."]},
    {"q": "Which model for what, and how do you control cost?",
     "a": ["Match the model to the stakes. Low-stakes mail goes to a cheaper tier, and the expensive reasoning is kept for where it changes the outcome. Before changing anything I instrumented spend per model and per stage, because my guess about where the money went was wrong.",
           "Changes to reasoning budgets are gated behind evaluation, and a deprecated model raises an alarm before it breaks. The biggest single win wasn't a model at all: the deterministic matcher for email rules cut per-user LLM cost about 30 percent. And the prompt is a cache layout."]},
    {"q": "Why TypeScript and Deno?",
     "a": ["TypeScript on Deno, running as edge functions next to Supabase Postgres. One language across the web app and the backend, typed tool schemas with zod, so a tool's contract is checked at the boundary, and functions that deploy in seconds with no servers to run. The trade-off is the ML ecosystem, which lives in Python."]},
    {"q": "How do you normalise Gmail, Outlook and IMAP?",
     "a": ["One internal model behind all three, where each provider fails differently. Provider schemas stay at the edge; inside there's one canonical model with time zones, ids and contacts normalised. Contract tests against recorded payloads catch drift, and the raw payload is kept next to the normalised one for debugging."]},
    {"q": "What's the first thing that breaks at ten times the users?",
     "a": ["One Postgres carrying every workload: chat, ingestion, triage, briefs and crons. Isolation is in the schema today (partial indexes, SKIP LOCKED consumers, tuned vacuum); the signal to split is chat latency moving with triage batch size."]},
]

# 5. Where else. Pages on this site; every one is a relative link.
ELSEWHERE = [
    ["The guide's alfred_ design, worked end to end in six steps", GUIDE],
    ["The guide: the high-level design, 23 boxes", GUIDE + "/hld"],
    ["The guide: the deep dives (action safety, retries, cost, injection, eval, one Postgres)", GUIDE + "/deepdives"],
    ["ZenML round 3: alfred_ set against Kitaru, with the comparison table", "interviews/zenml-round3.html#/own"],
    ["ZenML round 3: your intro and why this role, and the Kitaru banks", "interviews/zenml-round3.html#/prep"],
    ["Mphasis: agentic AI fundamentals, each tied to alfred_", "interviews/mphasis.html#/prep"],
    ["The tracker's wildcard", "index.html#/wild"],
]
