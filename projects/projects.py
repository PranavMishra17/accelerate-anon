"""Projects: one tab per project, each an overview and a topic per explainer video.

Edit this file, then `python projects/build.py` writes PROJECTS.html. A topic plays media/videos/<video>.mp4 when the
file exists locally; the public site has no video files, so it shows the topic without the player.

Topic fields: id, title, video, lead, points ("Head: text", head bold), code (where to look), plan ([label, href]
into the guide), gaps (what is not built, or where the docs and the code disagree; code wins).
Facts come from the code on main; topics are filled in as each video is made.
"""

G = "SYSTEM%20DESIGN.html#/patterns/"

PROJECTS = [
    {"id": "mockflow", "title": "MockFlow-AI",
     "tagline": "A voice mock-interview coach: it interviews out loud, reviews the code you submit, and scores how you deliver.",
     "links": [["Live site", "https://mockflow.pranavmishra.dedyn.io"], ["Code", "https://github.com/PranavMishra17/MockFlow-AI"]],
     "stack": ["Python 3.12, Flask", "LiveKit Agents over WebRTC", "Deepgram speech to text", "OpenAI model and speech",
               "Postgres", "Piston code execution", "Google Cloud e2-micro, Docker Compose, Caddy"],
     "topics": [
        {"id": "system", "title": "The system", "video": "mockflow-system",
         "lead": "A Flask app on one small VM starts one agent process per interview. The process joins a LiveKit room in the user's own project with the user's own keys, talks through Deepgram and OpenAI, saves the transcript and exits; a separate judge call scores it.",
         "points": [
             "Pieces: Flask on gunicorn (one process, eight threads), a per-interview worker subprocess, LiveKit Cloud, Deepgram, OpenAI, Postgres, and Caddy with automatic TLS on a Google Cloud e2-micro.",
             "Spawn before mint: the worker is started before the browser's token is minted, so a failed spawn never hands out a room with no interviewer, and a free credit is claimed only after a successful spawn.",
             "Readiness: the app waits three seconds and treats the worker as ready if the process is alive at eight; it does not yet confirm the agent joined the room.",
             "The interview: a fixed greeting spoken by code, stages with fallback timers checked every five seconds, the transcript saved on the closing line, then the worker exits.",
             "The verdict: the feedback page calls a judge model at temperature zero in JSON mode and stores the scores.",
             "The limit: one interview at a time. The container has 768 MB with 2 GB of swap; the app idles near 263 MB and a worker is estimated at 300 to 400 MB."],
         "code": ["app.py (/api/token, /api/feedback/verdict)", "worker_manager.py", "agent_worker.py", "deploy/gcp/docker-compose.yml", "deploy/gcp/Caddyfile"],
         "plan": [["Async jobs", G + "long-running/async-job"], ["Worker pools", G + "long-running/worker-pool"], ["WebSockets", G + "real-time/websockets"]],
         "gaps": ["The live worker list is an in-memory dict, so a second web process or VM would break the one-interview cap.",
                  "The architecture doc and README still describe the earlier Render setup."]},
        {"id": "voice", "title": "The voice pipeline", "video": "mockflow-voice",
         "lead": "How the interviewer hears, decides you have finished, thinks, speaks and captions, with the settings the code actually uses.",
         "points": [
             "Hearing: Silero VAD tuned for a small CPU (0.3 second silence, 16 kHz) and Deepgram nova-2 with interim text.",
             "End of turn: no turn-detector model, so a turn ends on voice activity plus at least 0.8 seconds.",
             "Starting early: the per-answer assessment starts on interim text while the candidate is still talking and is reused if the final text matches; it has a 2.5 second budget, and a warm-up call at start avoids a three second cold call.",
             "Speaking: a gpt-4o-mini reply and OpenAI speech; barge-in is allowed except for the greeting, the closing and the coding time-out line.",
             "Captions: text streams arrive 33 ms after the first audio frame and are routed by track; the old data packet arrived 23.7 seconds late.",
             "Latency, honestly: text-only replies at p50 2.5 and p95 2.8 seconds, speech adding about a second; no runtime latency metrics yet."],
         "code": ["agent_worker.py (STT, LLM, TTS, VAD)", "interview_runtime.py (session settings)", "static/captions.js", "templates/interview.html"],
         "plan": [["Streaming", G + "llm-cost/streaming"], ["WebSockets", G + "real-time/websockets"]],
         "gaps": ["The voice architecture doc recommends settings the code does not use (a turn-detector model, shorter endpointing, a newer speech model, latency logging).",
                  "A sub-400 ms figure appears only in that research doc and was never measured."]},
        {"id": "agent", "title": "The interview agent", "video": "mockflow-agent",
         "lead": "The agent started as a model driving seven tools. Measured on twenty simulated interviews, it went silent and lost replies, so control moved into a code-owned turn loop over a state machine, and the model now only words each reply.",
         "points": [
             "Before: tools like transition_stage and ask_question let the model drive; it chained tools to the step limit and ended turns in silence, and a queued acknowledgement replaced real replies.",
             "The turn loop: the assessor classifies each answer, a coverage ledger records signals (levels only rise), and code decides whether to advance and which single move comes next.",
             "The move note: one instruction per turn, under 45 words, one question asked word for word; it is never shown in the transcript.",
             "The state machine: fixed stages and time limits per track, one path for every stage change, and a fallback timer that queues the next question as the reply to the candidate's next words.",
             "The closing: a line built in code with a sentinel; the interview finalizes only when the sentinel is spoken.",
             "Measured: across the same twenty personas, silent turns 18 to 0, praise turns 92 to 0, two-question turns 29 to 3, skips 8 to 0, and p95 6.0 to 2.8 seconds."],
         "code": ["interview_turn.py", "interview_coverage.py", "interview_runtime.py (prepare_turn, advance_to)", "fsm.py", "prompts.py", "docs/AGENT_AUDIT_2026-09.md"],
         "plan": [["State machines", G + "multi-step/state-machine"], ["Policy gate", G + "agent-safety/policy-gate"], ["Stateless loop", G + "agent-durability/stateless-loop"]],
         "gaps": ["The agent design doc, the README and the pitch scripts still describe the tool-driven design.",
                  "Open from the audit: a slightly metronomic rhythm, some two-part questions, occasional mis-tags, and voice behaviour not yet checked by machine."]},
        {"id": "byok", "title": "Your keys, one worker", "video": "mockflow-byok",
         "lead": "Each user brings their own LiveKit, OpenAI and Deepgram keys. They are encrypted at rest, decrypted only into one interview's process, and the design decides what a shared worker can and cannot do.",
         "points": [
             "Storage: five keys per user, each encrypted with Fernet from one server key; losing that key means every user re-enters theirs.",
             "Validation checks format only; it never calls a provider.",
             "Transport: decrypted keys reach the agent only through its process environment, never through room attributes.",
             "One process per interview: started per room, exits on its own; nothing reaps a stuck process yet.",
             "Free tier: the owner's keys, two calls per user and 500 a month, claimed atomically and only after a successful spawn. Off by default.",
             "Dispatch: a resident worker registers with one LiveKit project, so it cannot serve rooms in users' own projects; dispatch can only ever serve owner-key interviews, and it is not live."],
         "code": ["db.py (Fernet)", "app.py (resolve_interview_keys)", "worker_manager.py", "agent_mode.py"],
         "plan": [["Least privilege", G + "agent-safety/least-privilege"], ["Rate limiting", G + "reliability/rate-limiting"]],
         "gaps": ["Docs describe the free-tier cap in dollars; the code counts calls.",
                  "Dispatch is built but has never run against a live LiveKit project."]},
        {"id": "coding", "title": "The coding track", "video": "mockflow-coding",
         "lead": "Grading code fairly with a model as the grader: a vetted problem bank, execution in a sandbox, and test results as ground truth, plus an honest list of what is not wired yet.",
         "points": [
             "The naive version, tried first: problems invented each session and graded by reading, never run; the audit graded a wrong-shape Two Sum 'partial' and every persona 'pass'.",
             "The bank: six problems with tests and reference solutions, each reference tested against its own cases.",
             "On submit: the full code goes over the data channel, three attempts per problem, Piston runs it when enabled (12 seconds), and the model evaluator gets 'X of Y passed' as ground truth.",
             "Sandboxing: the local runner has no network or filesystem limits and is used only on trusted solutions; Piston does the sandboxing for candidate code.",
             "Feedback is spoken after each submit, and the interview moves on when the answer passes or on the third attempt."],
         "code": ["coding/problem_bank.py", "coding/piston_runner.py", "interview_runtime.py (_evaluate_code_async)", "templates/interview.html (editor)"],
         "plan": [["Structured output", G + "grounding/structured"], ["Evals as a gate", G + "grounding/eval-gate"]],
         "gaps": ["The whole problem, including hidden tests and the reference solution, is sent to the browser.",
                  "The editor's starter code does not name the function the tests call, so execution would likely fall back to model-only grading.",
                  "Senior candidates get the easiest problems because there are no hard ones yet.",
                  "The final verdict never sees the coding results.",
                  "Code reaches the agent only on submit, though the landing page says it watches every keystroke; Piston is off in production."]},
        {"id": "evaluation", "title": "Feedback you can trust", "video": "mockflow-evaluation",
         "lead": "Measure what can be measured, let the model judge only with evidence, compute the decision by formula, calibrate against a gold set, and test the agent itself with a harness and persona audits.",
         "points": [
             "The naive failure: pace estimated from word count made words per minute exactly 150 for every transcript.",
             "Measured delivery: fillers, and pace from real speaking windows; when any turn was typed, pace is reported as unknown.",
             "The judge: a band per signal, 'cannot determine' without evidence, and the hire recommendation computed by formula from the weighted bands, not by the model.",
             "Calibration: six gold interviews and weighted kappa with a target of 0.75 to 0.90; no recorded run yet.",
             "Testing the agent: a text harness runs the production agent with a fake transport and clock over five scenarios, and twenty LLM-played personas audit each change.",
             "The audit before and after the redesign: silent turns 18 to 0, praise 92 to 0, two-question turns 29 to 3, p95 6.0 to 2.8 seconds."],
         "code": ["speech_analytics.py", "feedback_scoring.py", "evaluator.py", "calibration.py, gold_set.json", "harness/", "tests/e2e/test_agent_audit.py"],
         "plan": [["Evals as a gate", G + "grounding/eval-gate"], ["Shadow and online evals", G + "grounding/shadow-online"], ["Citations", G + "grounding/citations"]],
         "gaps": ["The docs promise a verbatim quote as evidence; the code only checks that evidence is non-empty.",
                  "After the redesign every coding persona got the same lean hire, consistent with the verdict not seeing coding results."]},
     ]},
]
