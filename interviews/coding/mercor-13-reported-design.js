/* Mercor coding tab, part 13: system designs reported by candidates that the guide does not cover (dataset copy, tenant-fair orchestration, persistent chat context, prompt-injection defense, ML pipeline orchestration, payments with reconciliation). Prompts are from candidate reports; the designs are rehearsal material, not Mercor's questions. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "id": "mercor-reported-design",
 "n": 13,
 "one": true,
 "title": "Reported prompts not yet covered: system design",
 "minutes": 180,
 "lead": "After this part you can take a system design prompt that the guide does not cover and walk it in the order the round expects: clarify, requirements with numbers, data model, API, block diagram, the hard part under concurrent load, failure and recovery, trade-offs, and the security questions this interviewer may push on. The round is 45 minutes at a whiteboard with no code, and the interviewer is an engineer in security, so every design has a security section and each answer has to hold up for more than two minutes. The prompts come from candidate reports, not from Mercor. The guide already has the [job scheduler](../SYSTEM%20DESIGN.html#/designs/job-scheduler), [candidate search](../SYSTEM%20DESIGN.html#/designs/candidate-search), [contractor payouts](../SYSTEM%20DESIGN.html#/designs/contractor-payouts) and [ticketmaster](../SYSTEM%20DESIGN.html#/designs/ticketmaster); this part does not repeat them. Each design opens with what it is and why, and ends with the opening you say first, shut until you try it.",
 "sections": [
  {
   "id": "copy-api",
   "title": "1. Dataset copy API",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A dataset is a tree of rows: tasks, the model responses to each task, and the grades on each response. A copy gives a new dataset whose rows can be changed without touching the original. The system problem is that the rows point at each other by id, the copy can hold millions of rows, and the work will not fit in one request. The reported expected answer has four parts: remap old ids to new ids, copy in dependency order, run it as an async job with a job id, and checkpoint so it can resume. Everything below is how to make those four true under load and failure. This is a different problem from the guide's [job scheduler](../SYSTEM%20DESIGN.html#/designs/job-scheduler), which only supplies the job-and-worker plumbing."
    },
    {
     "t": "p",
     "text": "**1. Clarify.** Ask these first. Each has the answer I will assume out loud, so the interviewer can correct me."
    },
    {
     "t": "table",
     "head": [
      "Question",
      "Assumed answer"
     ],
     "rows": [
      [
       "How big is a dataset?",
       "Up to 1M tasks, 10M responses, 10M grades, plus attachments in object storage."
      ],
      [
       "Are responses and grades immutable?",
       "Responses yes. Grades are append-only versions, so I copy the latest version or all, my call, and I say which."
      ],
      [
       "Is the copy a point-in-time snapshot while the source keeps changing?",
       "Yes. The copy reflects the source at the job's snapshot time."
      ],
      [
       "Same tenant only?",
       "Same tenant. A cross-tenant copy is a separate feature with an explicit grant."
      ],
      [
       "How soon must the copy be usable?",
       "Minutes for the largest case. The caller polls; the copy is hidden until it completes."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**2. Requirements.**"
    },
    {
     "t": "list",
     "items": [
      "Functional: POST creates a copy job and returns a job id at once.",
      "The copy has the same structure, new ids, same content.",
      "Status and progress are queryable; a job can be cancelled.",
      "Repeating the same request does not make two copies."
     ]
    },
    {
     "t": "list",
     "items": [
      "Submit returns in under 200 ms p99, since it only writes a job row.",
      "The largest copy finishes in about 10 to 15 minutes at a steady 10K rows per second.",
      "The copy must not slow live traffic: bulk writes are rate-limited to a share of the database.",
      "Resume after any crash loses at most one batch of work.",
      "The copy is atomic to readers: all of it appears at once or none of it."
     ]
    },
    {
     "t": "p",
     "text": "**3. Data model.** Tables, key columns and the indexes that make the hot queries cheap."
    },
    {
     "t": "table",
     "head": [
      "Table",
      "Key columns",
      "Indexes and constraints"
     ],
     "rows": [
      [
       "datasets",
       "id, tenant_id, name, status (copying, ready, failed), source_dataset_id",
       "PK id; (tenant_id, name) unique"
      ],
      [
       "tasks",
       "id, dataset_id, tenant_id, payload, blob_ref",
       "(dataset_id, id) for keyset scans"
      ],
      [
       "responses",
       "id, task_id, dataset_id, model, content_ref, created_at",
       "(dataset_id, id); (task_id)"
      ],
      [
       "grades",
       "id, response_id, dataset_id, rubric_id, score, version",
       "(dataset_id, id); (response_id)"
      ],
      [
       "copy_jobs",
       "id, tenant_id, source_id, target_id, snapshot_ts, status, phase, cursor, idempotency_key, lease_expires_at",
       "unique (tenant_id, idempotency_key)"
      ],
      [
       "id_map",
       "job_id, kind, old_id, new_id",
       "PK (job_id, kind, old_id)"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**4. API.**"
    },
    {
     "t": "table",
     "head": [
      "Endpoint",
      "Request",
      "Response"
     ],
     "rows": [
      [
       "POST /v1/datasets/{id}/copies  (header Idempotency-Key)",
       "{ name }",
       "202 { job_id, target_dataset_id, status: queued }; the same key returns the same job"
      ],
      [
       "GET /v1/copy-jobs/{job_id}",
       "none",
       "{ status, phase, progress: { tasks: {done, total}, responses: {...}, grades: {...} }, error }"
      ],
      [
       "POST /v1/copy-jobs/{job_id}/cancel",
       "none",
       "202 { status: cancelling }"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**5. Block diagram.**"
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Dataset copy path",
       "flow": [
        "client",
        "API",
        "copy_jobs row",
        "queue",
        "workers",
        "source (snapshot)",
        "target + id_map"
       ],
       "note": "The API only writes the job row and enqueues. Workers do all the copying and commit each batch together with the cursor."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Component",
      "Job"
     ],
     "rows": [
      [
       "API",
       "Authorise, check the idempotency key, insert the job row, enqueue the job id."
      ],
      [
       "Worker",
       "Leases a job, copies one phase at a time in batches, renews its lease."
      ],
      [
       "id_map",
       "Old to new id for each kind, so children can find their copied parents."
      ],
      [
       "Target dataset",
       "Created in status copying; flipped to ready in one update at the end."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**6. The hard part under concurrent load.**"
    },
    {
     "t": "list",
     "items": [
      "**Dependency order.** Parents first: datasets, tasks, responses, then grades. A response needs its task's new id before insert, so the worker reads the map for the batch's parents. Foreign keys enforce the order.",
      "**Remap ids deterministically.** new_id = uuid5(job_id, old_id). A retried batch computes the same ids, so a repeated insert is a no-op (ON CONFLICT DO NOTHING). The id_map table then records the mapping for audit and for tables whose ids cannot be derived, such as auto-increment integers.",
      "**Batching.** Keyset pagination: WHERE dataset_id = ? AND id > cursor ORDER BY id LIMIT 1000. Never OFFSET, which rescans. One transaction per batch writes the rows, the map rows and the new cursor, so cursor and data cannot disagree.",
      "**Snapshot.** The source keeps changing. Responses are immutable, so a snapshot is the set with created_at at or before snapshot_ts, plus the grade versions at that time. Say that a lock on the source is the alternative and why I would avoid it: it blocks writers for the whole copy.",
      "**Load on the database.** Several workers split the key range, but a shared limiter caps rows per second so live traffic keeps its p99.",
      "**Two identical requests at once.** The unique (tenant_id, idempotency_key) constraint makes exactly one insert win; the loser reads the winner's job."
     ]
    },
    {
     "t": "p",
     "text": "**7. Failure and recovery.**"
    },
    {
     "t": "list",
     "items": [
      "**Worker dies mid-batch.** The batch transaction rolls back. The lease expires, another worker takes the job and resumes from the stored cursor. Duplicate inserts are harmless because ids are deterministic.",
      "**Worker dies after commit, before it moves on.** The cursor is already in the same transaction, so nothing repeats.",
      "**Job fails for good.** The target stays in status copying and invisible. A cleanup job deletes rows by target dataset id. The source was never written, so there is nothing to undo there.",
      "**Cancel.** Workers check the status between batches and stop; cleanup then runs as for a failure.",
      "**Poison row** (a blob missing): fail the job with the row id in the error rather than skip silently, since a silent gap is a corrupt copy."
     ]
    },
    {
     "t": "p",
     "text": "**8. Trade-offs.**"
    },
    {
     "t": "list",
     "items": [
      "**Deep copy against copy-on-write.** A lazy copy with a parent pointer is instant, but every read walks the chain, deletes and edits need tombstones, and the original cannot be freed. A deep copy costs minutes and storage and is simple to reason about. I pick deep copy because the requirement is independent change.",
      "**Deterministic ids against a persisted map.** Derived ids need no lookup and survive any crash. A map table costs writes but works for any id type and gives an audit trail. Keep both.",
      "**Large batch against small.** Large is faster; small gives finer resume and shorter locks. About 1,000 rows is a normal start.",
      "**Blobs.** Reference the same object with a reference count instead of copying bytes. It is cheaper, but deletion then needs the count."
     ]
    },
    {
     "t": "p",
     "text": "**9. Security follow-ups this interviewer may push on.** He is a security engineer, so expect these."
    },
    {
     "t": "list",
     "items": [
      "**Authorisation on both ends.** Check read on the source and create on the target at submit, and again in the worker. The worker takes tenant_id from the job row, never from a request, so a changed request cannot redirect it.",
      "**IDOR on job ids.** A job id must only be readable by the tenant that owns it; use unguessable ids and check ownership on every GET.",
      "**Tenant boundary.** Every copied row keeps the same tenant_id; assert it in the insert query. A bug here is a cross-tenant leak.",
      "**Denial of service.** One tenant submitting hundreds of copies. Cap concurrent jobs per tenant and the total rows per day.",
      "**Sensitive content.** Grades and responses may hold personal data. The copy inherits retention and encryption settings, and the audit log records who copied what.",
      "**Blob access.** Copied rows point at objects. Do not copy signed URLs; sign at read time with the reader's permission."
     ]
    },
    {
     "t": "p",
     "text": "**10. What to say first.** Try it aloud before you open it."
    },
    {
     "t": "faq",
     "title": "Opening, about 60 seconds",
     "items": [
      {
       "q": "Say the design in one breath",
       "a": "How do you copy a dataset with millions of rows?"
      }
     ]
    }
   ]
  },
  {
   "id": "tenant-fair",
   "title": "2. Tenant-fair orchestration of slow LLM tasks",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** Many customers (tenants) submit tasks that each call a model for seconds to minutes. The model provider limits requests and tokens per minute for your whole account. Without care, one tenant that submits a million tasks fills the shared queue and everyone else waits behind it. The job runs in three layers: admission (how much can wait), fair dispatch (whose turn is it) and quota (may we call the provider now). The guide's [job scheduler](../SYSTEM%20DESIGN.html#/designs/job-scheduler) already gives the state machine, leases, retries and outbox. This section covers only what is new: per-tenant queues, weighted fair scheduling and token-bucket quotas."
    },
    {
     "t": "p",
     "text": "**1. Clarify.** Ask these first. Each has the answer I will assume out loud, so the interviewer can correct me."
    },
    {
     "t": "table",
     "head": [
      "Question",
      "Assumed answer"
     ],
     "rows": [
      [
       "What limits the provider gives us?",
       "Requests per minute and tokens per minute on one account; a 429 with Retry-After when exceeded."
      ],
      [
       "How long is a task?",
       "10 seconds to 5 minutes, several model calls each."
      ],
      [
       "Are tenants equal?",
       "No. Each has a weight from its plan, and a hard cap on concurrent tasks."
      ],
      [
       "Is a task restartable?",
       "Yes, as steps. Finished steps are stored, so a restart does not repeat paid calls."
      ],
      [
       "Is latency or fairness the priority?",
       "Fairness and no starvation first, then throughput. Interactive tasks may take a separate priority class."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**2. Requirements.**"
    },
    {
     "t": "list",
     "items": [
      "Functional: Submit tasks and read their status and results.",
      "Every tenant makes progress even when another floods the system.",
      "A task resumes from its last finished step after any failure.",
      "Per-tenant weights and concurrency caps are configurable."
     ]
    },
    {
     "t": "list",
     "items": [
      "Never exceed the provider's request and token limits; 429s stay under 1 percent of calls.",
      "A tenant with weight w gets about w over the sum of active weights of the capacity, within 10 percent.",
      "A quiet tenant's task starts within about one scheduling round of arriving.",
      "Dispatcher decision under 10 ms; the system holds 10M queued tasks.",
      "A lost worker's task is picked up within one lease period, for example 60 seconds."
     ]
    },
    {
     "t": "p",
     "text": "**3. Data model.** Tables, key columns and the indexes that make the hot queries cheap."
    },
    {
     "t": "table",
     "head": [
      "Table",
      "Key columns",
      "Indexes and constraints"
     ],
     "rows": [
      [
       "tenants",
       "id, weight, max_concurrency, max_queued, tpm_limit",
       "PK id"
      ],
      [
       "tasks",
       "id, tenant_id, status, priority, est_tokens, attempts, lease_expires_at, created_at",
       "(tenant_id, status, created_at); (status, lease_expires_at)"
      ],
      [
       "task_steps",
       "task_id, step_no, status, output_ref, tokens_used",
       "PK (task_id, step_no)"
      ],
      [
       "tenant_state (Redis)",
       "tenant_id, deficit, running_count, bucket tokens",
       "keyed by tenant_id"
      ],
      [
       "usage_ledger",
       "tenant_id, minute, tokens, requests",
       "PK (tenant_id, minute)"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**4. API.**"
    },
    {
     "t": "table",
     "head": [
      "Endpoint",
      "Request",
      "Response"
     ],
     "rows": [
      [
       "POST /v1/tasks",
       "{ input, priority }",
       "202 { task_id } or 429 when the tenant's queue is full"
      ],
      [
       "GET /v1/tasks/{id}",
       "none",
       "{ status, step, result_ref }"
      ],
      [
       "GET /v1/usage",
       "none",
       "{ running, queued, tokens_this_minute, limit }"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**5. Block diagram.**"
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Fair dispatch",
       "flow": [
        "submit",
        "per-tenant queue",
        "fair dispatcher",
        "token bucket",
        "worker",
        "model provider"
       ],
       "note": "The dispatcher picks the next tenant, the bucket decides whether the call may go now, and the worker runs the steps and records each one."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Component",
      "Job"
     ],
     "rows": [
      [
       "Per-tenant queue",
       "One logical queue per tenant, so a flood only lengthens that tenant's own line."
      ],
      [
       "Fair dispatcher",
       "Chooses which tenant's head task goes next using deficit round robin."
      ],
      [
       "Token buckets",
       "One global bucket for the provider's limit and one per tenant, in Redis, refilled at the limit rate."
      ],
      [
       "Worker",
       "Runs steps, extends its lease, stores each step's output before moving on."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**6. The hard part under concurrent load.**"
    },
    {
     "t": "list",
     "items": [
      "**Deficit round robin (DRR).** Each active tenant has a deficit counter. Each round the dispatcher adds quantum times weight to it. While the head task's estimated cost is at most the deficit, dispatch it and subtract the cost. Cost is in tokens, so a tenant with big tasks does not get more than its share by sending few large ones. A tenant with an empty queue has its deficit reset, so idle tenants do not bank credit. DRR is O(1) per decision and handles variable cost, which plain round robin does not.",
      "**Token bucket.** A bucket holds up to the burst size and refills at the rate limit. A call takes tokens first; if the bucket is short, the task waits. Do the check-and-take as one atomic Redis Lua script so two dispatchers cannot both spend the last tokens.",
      "**Reserve, then settle.** The real token count is known only after the reply. Reserve the estimate before the call and correct the bucket with the actual usage afterwards. Under-estimate and you hit 429s; over-estimate and you leave capacity idle.",
      "**Two buckets.** The tenant bucket enforces the plan. The global bucket protects the provider limit. A call needs both. A tenant below its own limit can still be held back when the global bucket is empty, and DRR decides who gets the global capacity.",
      "**Concurrency cap.** Each tenant has a maximum of running tasks, so a slow tenant cannot hold every worker.",
      "**Provider 429.** Treat it as a signal: slow the global refill rate for a while (additive increase, multiplicative decrease) and honour Retry-After."
     ]
    },
    {
     "t": "p",
     "text": "**7. Failure and recovery.**"
    },
    {
     "t": "list",
     "items": [
      "**Dispatcher crash.** It keeps no state that is not in the database or Redis. A new dispatcher rebuilds deficits as zero and carries on; fairness is lost for one round only.",
      "**Worker crash.** The task lease expires and the task returns to the queue. Because each finished step is stored, the next worker skips to the first unfinished step. At most one model call is repeated.",
      "**Lost Redis state.** The bucket refills full on restart, which can cause a burst of 429s. Keep the provider's own 429 handling as the backstop.",
      "**Provider outage.** Open a circuit breaker, stop dispatching, and let queues build up to their admission caps rather than fail tasks."
     ]
    },
    {
     "t": "p",
     "text": "**8. Trade-offs.**"
    },
    {
     "t": "list",
     "items": [
      "**Fairness against throughput.** Strict fairness leaves capacity unused when a tenant is below its quota but others have work. Work-conserving DRR hands unused capacity to the next tenant.",
      "**DRR against weighted fair queueing.** WFQ is more exact on latency but needs a priority heap and virtual-time bookkeeping. DRR is simpler and good enough here.",
      "**Estimated cost.** Estimates are cheap and wrong; exact counts arrive late. Reserve then settle gives both.",
      "**Central dispatcher against sharded.** One dispatcher is simple and fast enough to about 10K decisions per second; shard by tenant hash beyond that."
     ]
    },
    {
     "t": "p",
     "text": "**9. Security follow-ups this interviewer may push on.** He is a security engineer, so expect these."
    },
    {
     "t": "list",
     "items": [
      "**Isolation between tenants.** The queue key includes the tenant id, and every query filters on it. Prompts and results of one tenant must never reach another's worker context.",
      "**Resource-exhaustion attacks.** A tenant submitting millions of tasks or very long prompts. Enforce max_queued, a size limit per task and a token cap per task at admission.",
      "**Noisy neighbour as a denial of service.** Per-tenant buckets and concurrency caps are the control. Say so.",
      "**Provider keys.** One shared key means one tenant's abuse can get the whole account throttled or banned. Mention per-tenant keys or a content filter at admission.",
      "**Data in logs.** Log task ids and token counts, never prompts or outputs."
     ]
    },
    {
     "t": "p",
     "text": "**10. What to say first.** Try it aloud before you open it."
    },
    {
     "t": "faq",
     "title": "Opening, about 60 seconds",
     "items": [
      {
       "q": "Opening, about 60 seconds",
       "a": "How do you keep one tenant from starving the others?"
      }
     ]
    }
   ]
  },
  {
   "id": "chat-context",
   "title": "3. Persistent multi-thread AI chat with context-window management",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A user has many conversation threads that persist. The model sees only a fixed context window, so for each reply the system must build a prompt that fits: the instructions, what matters from the past, and the latest turns. Full history lives in the database forever; the prompt is a view of it. The design question is how to build that view cheaply and with little loss: keep recent turns verbatim, summarise older ones, retrieve specific old turns when the question points back at them, and drop the rest."
    },
    {
     "t": "p",
     "text": "**1. Clarify.** Ask these first. Each has the answer I will assume out loud, so the interviewer can correct me."
    },
    {
     "t": "table",
     "head": [
      "Question",
      "Assumed answer"
     ],
     "rows": [
      [
       "How long can a thread get?",
       "Thousands of messages; the window is about 128K tokens but I budget 16K for history to keep cost and latency down."
      ],
      [
       "Do threads share memory?",
       "Threads are separate by default. A small per-user memory is a later extension."
      ],
      [
       "Do replies stream?",
       "Yes, token by token, so a reply can fail halfway."
      ],
      [
       "Do users edit or delete messages?",
       "Delete a thread and delete message: yes, and deletion must remove derived data too."
      ],
      [
       "Multiple devices on one thread?",
       "Yes, so two requests to the same thread can race."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**2. Requirements.**"
    },
    {
     "t": "list",
     "items": [
      "Functional: Create, list, rename and delete threads.",
      "Send a message and stream the reply.",
      "Old threads reopen with full history.",
      "The model uses earlier context even after it has left the window."
     ]
    },
    {
     "t": "list",
     "items": [
      "First token under 1.5 s p95; the context build takes under 100 ms.",
      "History reads come back in under 100 ms p99 for the last 50 messages.",
      "No message is lost once acknowledged; durability before the model call.",
      "Ordering within a thread is strict and gapless.",
      "Deleting a thread removes messages, summaries and embeddings."
     ]
    },
    {
     "t": "p",
     "text": "**3. Data model.** Tables, key columns and the indexes that make the hot queries cheap."
    },
    {
     "t": "table",
     "head": [
      "Table",
      "Key columns",
      "Indexes and constraints"
     ],
     "rows": [
      [
       "threads",
       "id, user_id, title, created_at, last_message_at, version",
       "(user_id, last_message_at desc)"
      ],
      [
       "messages",
       "id, thread_id, seq, role, content, token_count, status, client_msg_id, created_at",
       "unique (thread_id, seq); unique (thread_id, client_msg_id)"
      ],
      [
       "summaries",
       "thread_id, covers_from_seq, covers_to_seq, text, version",
       "(thread_id, covers_to_seq desc)"
      ],
      [
       "embeddings",
       "message_id, user_id, thread_id, vector",
       "vector index; filter on user_id and thread_id"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**4. API.**"
    },
    {
     "t": "table",
     "head": [
      "Endpoint",
      "Request",
      "Response"
     ],
     "rows": [
      [
       "POST /v1/threads",
       "{ title? }",
       "201 { thread_id }"
      ],
      [
       "GET /v1/threads/{id}/messages?before_seq=&limit=",
       "none",
       "{ messages: [...], next_before_seq }"
      ],
      [
       "POST /v1/threads/{id}/messages",
       "{ content, client_msg_id }",
       "stream of events: { message_id, seq }, then deltas, then done"
      ],
      [
       "DELETE /v1/threads/{id}",
       "none",
       "202; derived data is removed by a background job"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**5. Block diagram.**"
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Reply path",
       "flow": [
        "client",
        "API",
        "messages table",
        "context builder",
        "model",
        "stream back + store"
       ],
       "note": "The user's message is stored first. The builder assembles the prompt from the summary, retrieved turns and recent turns. A background job writes summaries and embeddings."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Component",
      "Job"
     ],
     "rows": [
      [
       "Context builder",
       "Assembles the prompt to a token budget in a fixed order."
      ],
      [
       "Summariser",
       "Async job: when unsummarised turns pass a threshold, folds them into the thread summary."
      ],
      [
       "Embedder",
       "Async job: embeds each message for retrieval."
      ],
      [
       "Vector index",
       "Finds old turns by meaning, filtered to this user and thread."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**6. The hard part under concurrent load.**"
    },
    {
     "t": "list",
     "items": [
      "**The context budget.** Fill in this order and stop at the budget: system prompt, pinned facts, rolling summary, retrieved old turns (top 3 to 5), then as many recent turns verbatim as fit, newest first. Reserve room for the reply. Count tokens with the model's own tokenizer; a character estimate drifts.",
      "**Ordering under races.** Two devices send at once. Assign seq inside a transaction that locks the thread row, or use the unique (thread_id, seq) constraint and retry. Allow one in-flight generation per thread; a second request waits or gets a conflict, since two replies built on the same history make a forked conversation.",
      "**Idempotent send.** The client sends a client_msg_id. A retry after a timeout hits the unique constraint and returns the existing message instead of a duplicate.",
      "**Summary races.** The summariser covers a seq range and writes it only if no newer summary covers it (compare on covers_to_seq). A slightly stale summary is acceptable because recent turns are verbatim anyway.",
      "**Retrieval.** Embed the new user message, search this thread's vectors, take the top few not already in the window. This pulls back a detail from turn 40 that the summary dropped."
     ]
    },
    {
     "t": "p",
     "text": "**7. Failure and recovery.**"
    },
    {
     "t": "list",
     "items": [
      "**Model stream fails halfway.** Store the user message before calling the model. Store the assistant message with status partial as chunks arrive or at failure; the client can retry or continue. Never leave the user message unsaved.",
      "**API node dies mid-stream.** The client reconnects with the same client_msg_id and reads the stored state.",
      "**Summariser or embedder fails.** The thread still works: the builder falls back to more verbatim turns and truncation. These jobs retry from a queue and are safe to repeat for the same range.",
      "**Wrong summary.** Raw messages are never deleted, so a summary can be regenerated from them. Summarise from the raw turns plus the prior summary, never from a summary of a summary only, to limit drift."
     ]
    },
    {
     "t": "p",
     "text": "**8. Trade-offs.**"
    },
    {
     "t": "list",
     "items": [
      "**Summary against retrieval against truncation.** Truncation is free and loses information abruptly. Summaries keep the gist but lose exact details and can drift. Retrieval keeps exact details but costs an embedding call and a search, and can miss. Use all three in layers.",
      "**Large window against managed context.** Stuffing the whole thread in a big window is simplest, but cost and latency grow with each turn and quality drops on long inputs. Managing context costs engineering and is cheaper per turn.",
      "**Embed every message against embed chunks.** Per message is simple; chunking helps long messages.",
      "**Synchronous against async summarising.** Async keeps latency low and accepts a briefly stale summary."
     ]
    },
    {
     "t": "p",
     "text": "**9. Security follow-ups this interviewer may push on.** He is a security engineer, so expect these."
    },
    {
     "t": "list",
     "items": [
      "**Authorisation per thread.** Check user_id on every thread and message query. Guessable thread ids plus a missing check is the classic IDOR.",
      "**Retrieval scoping.** The vector search must filter on user_id as a hard condition. A global search across users would put one user's text in another's prompt.",
      "**Stored prompt injection.** Messages and tool outputs may contain instructions. A summary can launder them into a trusted-looking block. Keep roles on every stored line, and mark summaries and retrieved turns as untrusted data in the prompt.",
      "**Deletion and retention.** Deleting a message or thread must remove embeddings and summaries, and backups follow the retention policy. Say it is easy to forget the derived stores.",
      "**Encryption and logging.** Encrypt at rest, redact content from logs, and treat prompts as personal data."
     ]
    },
    {
     "t": "p",
     "text": "**10. What to say first.** Try it aloud before you open it."
    },
    {
     "t": "faq",
     "title": "Opening, about 60 seconds",
     "items": [
      {
       "q": "Opening, about 60 seconds",
       "a": "How do you handle a conversation longer than the model's context window?"
      }
     ]
    }
   ]
  },
  {
   "id": "prompt-injection",
   "title": "4. Prompt-injection defense for a tool-using agent",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** An agent reads text and calls tools: send email, query a database, fetch a web page, run code. Prompt injection is when text the agent reads, which is data, contains instructions, and the model follows them as if the user gave them. It is not fixable by a better prompt, because the model has no hard line between instructions and data. So the design assumes the model can be fooled and limits what a fooled model can do. The useful frame is three things together: access to private data, exposure to untrusted content, and a way to send data out. Remove one of the three and the worst attacks stop. The design is at trust-boundary level only."
    },
    {
     "t": "p",
     "text": "**1. Clarify.** Ask these first. Each has the answer I will assume out loud, so the interviewer can correct me."
    },
    {
     "t": "table",
     "head": [
      "Question",
      "Assumed answer"
     ],
     "rows": [
      [
       "What tools does the agent have?",
       "A mix: read-only (search, read file), write inside the user's data, and external (email, HTTP)."
      ],
      [
       "Whose data and credentials?",
       "Each run acts for one end user with that user's permissions."
      ],
      [
       "What is untrusted?",
       "Web pages, emails, documents, tool results and other users' content. Only the system prompt and the signed-in user's own message are trusted."
      ],
      [
       "Which actions cannot be undone?",
       "Sending, deleting, paying, sharing externally. These need the user's approval."
      ],
      [
       "What is the goal?",
       "A successful injection can waste a step but cannot leak data or cause a harmful action. No claim of prevention, only containment."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**2. Requirements.**"
    },
    {
     "t": "list",
     "items": [
      "Functional: Run an agent task with tools on behalf of a user.",
      "Each tool call is checked against what this run may do.",
      "Irreversible or external actions need explicit user approval.",
      "Every call is recorded for audit."
     ]
    },
    {
     "t": "list",
     "items": [
      "The policy check on a tool call adds under 20 ms.",
      "No tool credential ever appears in the model's context.",
      "A run has a step budget and a rate limit per tool.",
      "The audit log is append-only and complete for every call.",
      "A compromised run can be stopped and its grants revoked within seconds."
     ]
    },
    {
     "t": "p",
     "text": "**3. Data model.** Tables, key columns and the indexes that make the hot queries cheap."
    },
    {
     "t": "table",
     "head": [
      "Table",
      "Key columns",
      "Indexes and constraints"
     ],
     "rows": [
      [
       "tools",
       "name, json_schema, side_effect (read, write, external), requires_approval",
       "PK name"
      ],
      [
       "grants",
       "principal, tool, scope, expires_at",
       "(principal, tool)"
      ],
      [
       "agent_runs",
       "id, user_id, task, status, step_count, allowed_tools, started_at",
       "(user_id, started_at)"
      ],
      [
       "tool_calls",
       "id, run_id, tool, args_hash, args, result_ref, input_trust (trusted, untrusted), status, approved_by, created_at",
       "(run_id, created_at); append-only"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**4. API.**"
    },
    {
     "t": "table",
     "head": [
      "Endpoint",
      "Request",
      "Response"
     ],
     "rows": [
      [
       "POST /v1/runs",
       "{ task, allowed_tools? }",
       "202 { run_id }"
      ],
      [
       "GET /v1/runs/{id}",
       "none",
       "{ status, steps, pending_approval: { call_id, tool, args } }"
      ],
      [
       "POST /v1/runs/{id}/approvals/{call_id}",
       "{ decision: approve or deny }",
       "200; approval applies to exactly that call and its args hash"
      ],
      [
       "POST /v1/runs/{id}/stop",
       "none",
       "200; revokes the run's grants"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**5. Block diagram.**"
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "Where each check sits",
       "flow": [
        "user task",
        "model",
        "tool call proposed",
        "policy check in code",
        "tool runs with user's scope",
        "output check"
       ],
       "note": "The model only proposes. Ordinary code, outside the model, checks the call and runs it with scoped credentials, then checks the result before it goes back in."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Component",
      "Job"
     ],
     "rows": [
      [
       "Model",
       "Treated as untrusted. It proposes tool calls and never holds a secret."
      ],
      [
       "Policy check",
       "Plain code: is the tool allowed for this run, do the args match the schema and the user's scope, does it need approval?"
      ],
      [
       "Tool executor",
       "Holds credentials, runs with the end user's permissions, applies egress and size limits."
      ],
      [
       "Output check",
       "Scans model output and tool results for secrets, unexpected URLs and markup before display or reuse."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**6. The hard part under concurrent load.**"
    },
    {
     "t": "list",
     "items": [
      "**Separate content from instructions.** Put untrusted text in a clearly marked data section and tell the model it is data. This helps and is not a guarantee. Say so, so the interviewer does not think it is the defence.",
      "**Least privilege per run.** The run gets only the tools its task needs, read-only by default. A summarise-this-page run has no email tool at all, so no injection can send mail.",
      "**Break the three-way combination.** If a run reads untrusted content and holds private data, remove the outbound channel or require approval for it. Plan first, act after: fix the list of allowed actions from the trusted task, then read untrusted data, so the data cannot add new actions.",
      "**Quarantine.** A second model call reads the untrusted text with no tools and returns only a structured, validated summary. The tool-holding model never sees the raw text.",
      "**Parameter checks.** Validate arguments against the schema and the user's scope: allowlisted recipients or domains, bounded sizes, no arbitrary URLs. Block requests to internal addresses to stop fetch-based SSRF.",
      "**Approval bound to arguments.** The user approves one call with its exact args hash; if the args change, the approval is void. Otherwise an attacker swaps the args after approval.",
      "**Confused deputy.** Tools must run with the end user's identity and permissions, never a broad service account.",
      "**Parallel calls.** Each call is checked on its own; a step budget and tool rate limits cap the damage of a loop."
     ]
    },
    {
     "t": "p",
     "text": "**7. Failure and recovery.**"
    },
    {
     "t": "list",
     "items": [
      "**Injection succeeds anyway.** Containment limits the damage: scoped tools, approvals, egress allowlist. The audit log shows which untrusted input preceded each call.",
      "**Compromise found.** Stop the run, revoke its grants and rotate any credential it could reach. Grants have expiry by default.",
      "**Crash mid-run.** Resume from the tool_calls log. Side-effecting tools take an idempotency key from the call id, so a replay does not send twice.",
      "**Check service down.** Fail closed: no policy answer means no tool call."
     ]
    },
    {
     "t": "p",
     "text": "**8. Trade-offs.**"
    },
    {
     "t": "list",
     "items": [
      "**Security against autonomy.** More approvals are safer and train users to click yes. Reserve them for irreversible and external actions.",
      "**Classifier against structure.** Injection detectors are probabilistic, with misses and false positives. Structural limits (scoped tools, egress rules) do not depend on guessing intent. Use detectors as an extra signal.",
      "**Plan-first against flexibility.** A fixed plan blocks injected actions but also blocks tasks that must adapt to what they read.",
      "**Latency and cost.** A quarantine call and output checks add a model call and milliseconds. Worth it for runs with private data."
     ]
    },
    {
     "t": "p",
     "text": "**9. Security follow-ups this interviewer may push on.** He is a security engineer, so expect these."
    },
    {
     "t": "list",
     "items": [
      "**Indirect against direct injection.** Direct is the user typing it. Indirect is hidden in a page, email or file the agent reads. Indirect is the serious one because the user never sees it.",
      "**Exfiltration channels.** A tool call, a link the user clicks, or a rendered image URL with data in the query string. The output check strips or rewrites external URLs and markdown images.",
      "**Tool and server trust.** A tool description or a third-party tool server can itself carry instructions. Pin and review tool definitions; treat their output as untrusted.",
      "**Memory poisoning.** Text saved in memory or summaries comes back later as if trusted. Keep provenance on every stored item.",
      "**Secrets.** No credentials in prompts or logs; scoped, short-lived tokens in the executor.",
      "**Injection against jailbreak.** Jailbreak is the user attacking the model's rules. Injection is a third party attacking the user through the agent. Different threat, different controls."
     ]
    },
    {
     "t": "p",
     "text": "**10. What to say first.** Try it aloud before you open it."
    },
    {
     "t": "faq",
     "title": "Opening, about 60 seconds",
     "items": [
      {
       "q": "Opening, about 60 seconds",
       "a": "How do you defend an agent against prompt injection?"
      }
     ]
    }
   ]
  },
  {
   "id": "ml-pipeline",
   "title": "5. ML pipeline orchestration",
   "blocks": [
    {
     "t": "p",
     "text": "**What it is.** A pipeline is a directed acyclic graph (DAG) of steps: ingest data, build features, train, evaluate, and deploy if the evaluation passes. An orchestrator runs each step once its inputs are ready, retries failures, and records what produced what. Two ideas carry the design. Steps are idempotent, so rerunning one gives the same result and changes nothing twice. Artifacts are immutable and addressed by content hash, so lineage (which data and code made this model) is recoverable. Airflow's concept of a DAG is the reference vocabulary ([Airflow DAG docs](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html)), though the design stands without it."
    },
    {
     "t": "p",
     "text": "**1. Clarify.** Ask these first. Each has the answer I will assume out loud, so the interviewer can correct me."
    },
    {
     "t": "table",
     "head": [
      "Question",
      "Assumed answer"
     ],
     "rows": [
      [
       "How often and how big?",
       "Hundreds of pipelines, daily or on new data; steps run minutes to hours; training on GPUs."
      ],
      [
       "Who triggers a run?",
       "Schedule, new data arriving, or a person."
      ],
      [
       "What must be traceable?",
       "For any deployed model: the code version, the data version, the parameters and the evaluation."
      ],
      [
       "What gates deploy?",
       "An evaluation metric above a threshold and a baseline comparison, then a human approval for production."
      ],
      [
       "Build or buy?",
       "I would start from an existing orchestrator and say what I add; the interview wants the internals."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**2. Requirements.**"
    },
    {
     "t": "list",
     "items": [
      "Functional: Define a pipeline as a DAG; run it on a trigger.",
      "Retry failed steps; resume a failed run from the failed step.",
      "Store artifacts with lineage; register and deploy models.",
      "Skip steps whose inputs have not changed."
     ]
    },
    {
     "t": "list",
     "items": [
      "A scheduler decision under 1 s; 10K step instances running a day.",
      "No step runs twice concurrently for the same run; no half-written artifact is ever read.",
      "A crashed worker's step restarts within about 2 minutes.",
      "Lineage queries answer in under a second.",
      "Deploy promotion is atomic and auditable."
     ]
    },
    {
     "t": "p",
     "text": "**3. Data model.** Tables, key columns and the indexes that make the hot queries cheap."
    },
    {
     "t": "table",
     "head": [
      "Table",
      "Key columns",
      "Indexes and constraints"
     ],
     "rows": [
      [
       "pipelines",
       "id, name, version, dag_spec, code_ref",
       "(name, version)"
      ],
      [
       "runs",
       "id, pipeline_id, params_hash, trigger, status, run_key",
       "unique (pipeline_id, run_key)"
      ],
      [
       "step_instances",
       "run_id, step, attempt, status, input_hash, lease_expires_at, error_class, started_at, ended_at",
       "PK (run_id, step); (status, lease_expires_at)"
      ],
      [
       "artifacts",
       "id, uri, content_hash, kind, size, produced_by (run_id, step)",
       "unique content_hash; immutable"
      ],
      [
       "lineage",
       "artifact_id, consumed_by (run_id, step)",
       "both directions indexed"
      ],
      [
       "model_registry",
       "name, version, artifact_id, eval_report_id, stage (staging, prod), updated_version",
       "PK (name, version)"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**4. API.**"
    },
    {
     "t": "table",
     "head": [
      "Endpoint",
      "Request",
      "Response"
     ],
     "rows": [
      [
       "POST /v1/pipelines/{id}/runs",
       "{ params, run_key }",
       "202 { run_id }; the same run_key returns the same run"
      ],
      [
       "GET /v1/runs/{id}",
       "none",
       "{ status, steps: [{step, status, attempt}] }"
      ],
      [
       "POST /v1/runs/{id}/retry",
       "{ from_step }",
       "202; reruns the failed step and everything after it"
      ],
      [
       "GET /v1/artifacts/{id}/lineage",
       "none",
       "{ inputs: [...], produced_by, consumers: [...] }"
      ],
      [
       "POST /v1/models/{name}/{version}/promote",
       "{ stage, expected_version }",
       "200, or 409 when the registry changed underneath"
      ]
     ]
    },
    {
     "t": "p",
     "text": "**5. Block diagram.**"
    },
    {
     "t": "vis",
     "vis": [
      {
       "title": "A run",
       "flow": [
        "trigger",
        "scheduler",
        "ready steps",
        "workers",
        "artifact store",
        "eval gate",
        "registry + deploy"
       ],
       "note": "The scheduler holds state in the database. Workers write outputs to the artifact store, then mark the step done. Deploy happens only if the gate passes."
      }
     ]
    },
    {
     "t": "table",
     "head": [
      "Component",
      "Job"
     ],
     "rows": [
      [
       "Scheduler",
       "Finds steps whose upstream steps all succeeded and starts them, using atomic state changes."
      ],
      [
       "Workers",
       "Lease a step, run it, heartbeat, write outputs, report the result."
      ],
      [
       "Artifact store",
       "Immutable, content-addressed files: datasets, features, checkpoints, models, reports."
      ],
      [
       "Registry",
       "Names model versions, holds their evaluation, and tracks which one is in production."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**6. The hard part under concurrent load.**"
    },
    {
     "t": "list",
     "items": [
      "**Idempotent steps.** Compute a step key = hash(code version, parameters, input artifact hashes). If an artifact for that key exists, skip the step (a cache hit). Otherwise run, write the output to a temporary path, then commit it by renaming or by inserting the artifact row in one transaction. Rerunning cannot produce a half-written or duplicate result.",
      "**Two schedulers or two workers on one step.** Move state with a conditional update: set running where status is pending, and proceed only if one row changed. A lease with a heartbeat marks who owns the step. If the lease expires, another worker may take it and the old one's late write is rejected because it carries an old attempt number.",
      "**Same run triggered twice.** The unique (pipeline_id, run_key) constraint returns the existing run.",
      "**Fan-out and fan-in.** A hyperparameter sweep fans out to many train steps; the next step waits on all of them. Count completed parents, and fire when the count equals the number of upstream steps.",
      "**Scarce resources.** GPU capacity is limited. Queue by priority with per-team quotas so a big sweep does not block production retrains.",
      "**Racing deploys.** Promote with an expected version (optimistic concurrency). If two runs try to promote at once, the second gets 409 and re-evaluates against the new production model."
     ]
    },
    {
     "t": "p",
     "text": "**7. Failure and recovery.**"
    },
    {
     "t": "list",
     "items": [
      "**Worker dies.** The lease expires, the attempt number increments, the step reruns. Only committed artifacts count, so a partial output is never read.",
      "**Retry policy.** Retry transient errors (network, preemption, out of memory on a smaller batch) with exponential backoff and jitter and a maximum number of attempts. Do not retry deterministic errors such as a schema mismatch; fail fast and tell a person.",
      "**Resume.** A rerun from step X reuses every upstream artifact by its step key and runs only X and what follows.",
      "**Long training.** Write checkpoints to the artifact store at intervals so a retry continues instead of restarting.",
      "**Scheduler crash.** All state is in the database, so a new scheduler resumes by scanning for ready steps.",
      "**Bad model deployed.** The registry keeps the previous production version, so rollback is a promote of the old version."
     ]
    },
    {
     "t": "p",
     "text": "**8. Trade-offs.**"
    },
    {
     "t": "list",
     "items": [
      "**Caching against freshness.** Cache hits save hours but are wrong if data changes in place or a step reads the clock. Hash the inputs, and mark non-deterministic steps as never cached.",
      "**Central scheduler against event-driven.** A central scheduler is simple and consistent; an event-driven design scales further and is harder to debug.",
      "**Strict eval gate against velocity.** A tight threshold blocks regressions and blocks improvements the metric cannot see. Pair the metric with a baseline comparison and a human step for production.",
      "**Build against buy.** Existing orchestrators handle retries and UIs. The reasons to build are custom GPU scheduling and tight lineage."
     ]
    },
    {
     "t": "p",
     "text": "**9. Security follow-ups this interviewer may push on.** He is a security engineer, so expect these."
    },
    {
     "t": "list",
     "items": [
      "**Artifact integrity.** Verify the content hash on read, and sign model artifacts. A swapped model file is a supply-chain attack.",
      "**Unsafe model files.** Loading a pickled model runs arbitrary code. Prefer safe formats, and load untrusted artifacts in a sandbox.",
      "**Least privilege per step.** Each step has its own service identity with access only to its inputs and outputs. The train step cannot write to the production registry.",
      "**Separation of duties on deploy.** The person or job that trains cannot also promote to production without an approval, and every promotion is in an audit log.",
      "**Data and secrets.** Training data may contain personal data: access control, lineage for deletion requests, no secrets in parameters or logs. Pin container images by digest.",
      "**Data poisoning.** Lineage lets you find every model trained on a bad dataset and roll it back."
     ]
    },
    {
     "t": "p",
     "text": "**10. What to say first.** Try it aloud before you open it."
    },
    {
     "t": "faq",
     "title": "Opening, about 60 seconds",
     "items": [
      {
       "q": "Opening, about 60 seconds",
       "a": "How would you orchestrate a data, train, evaluate, deploy pipeline?"
      }
     ]
    }
   ]
  },
  {
   "id": "payments-recon",
   "title": "6. Payment processing with reconciliation",
   "blocks": [
    {
     "t": "p",
     "text": "**What is covered already.** The guide's [contractor payouts](../SYSTEM%20DESIGN.html#/designs/contractor-payouts) already covers the core of a payment endpoint: an idempotency key per payout, a state machine, the outbox, an append-only ledger and a reconciler that diffs by key. Use that design as the answer and add the deltas below. Do not redraw it. For the idempotency idea from the source, [Stripe's write-up on idempotency](https://stripe.com/blog/idempotency) is a good second read."
    },
    {
     "t": "p",
     "text": "**Deltas to add when the interviewer says reconciliation.**"
    },
    {
     "t": "table",
     "head": [
      "Topic",
      "What to add"
     ],
     "rows": [
      [
       "Three sources",
       "Match the internal ledger against the provider's settlement report and the bank statement. A payment is truly done only when the bank money matches."
      ],
      [
       "Match key",
       "Join on the provider's reference id, then check amount, currency and status. Fall back to amount and date only for orphans."
      ],
      [
       "Mismatch classes",
       "Missing at the provider, missing in the ledger, amount differs, duplicate, and timing (settles tomorrow). Each has its own queue and owner."
      ],
      [
       "Never edit history",
       "Fix a mismatch with an adjusting ledger entry that cites the reconciliation run. Totals of debits and credits stay equal."
      ],
      [
       "Cadence",
       "A daily full run plus a small frequent run that asks the provider about payments stuck in an unknown state."
      ],
      [
       "Webhooks",
       "Verify the signature, reject old timestamps to stop replay, dedupe by event id, and treat the webhook as a hint to fetch the real state."
      ],
      [
       "Money type",
       "Integer minor units with a currency code, never floats; rounding rules written down."
      ],
      [
       "Refunds and chargebacks",
       "Separate states and ledger entries that reference the original payment, and they arrive late."
      ]
     ]
    },
    {
     "t": "p",
     "text": "**Security follow-ups.**"
    },
    {
     "t": "list",
     "items": [
      "Amount tampering: the server computes the amount from its own records, never from the client.",
      "Webhook spoofing and replay: signature check, timestamp window, event-id dedupe.",
      "Scope reduction: card numbers never touch our servers; use the provider's tokens, which keeps the system out of most card-data rules.",
      "Insider fraud: separation of duties between who approves a payout and who runs it, and an append-only audit trail.",
      "Authorisation: a payout id must only be readable by its owner (IDOR), and provider keys live in a secret store with rotation."
     ]
    },
    {
     "t": "faq",
     "title": "Opening, about 45 seconds",
     "items": [
      {
       "q": "How do you make sure the books match the money?",
       "a": "Every payment has an idempotency key and a state machine, and the ledger is append-only with balanced entries. Reconciliation is the second line: a daily job matches the ledger against the provider's settlement report and the bank statement by the provider's reference id, then sorts the differences into missing, amount mismatch, duplicate and timing. Each difference gets an adjusting entry, never an edit. A faster job asks the provider about payments stuck in unknown. Webhooks are verified and treated as hints; the source of truth is a fetch. The payouts design in the guide has the rest."
      }
     ]
    }
   ]
  }
 ]
});
