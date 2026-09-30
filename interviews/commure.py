"""Commure, recruiter screen: Software Engineer, Voice Agents. Date to be set.

Audrey Huynh (Commure talent team) asked to schedule an initial recruiter interview. Commure's
voice agents answer patients' calls for health systems: scheduling, rescheduling, cancellations,
confirmations, FAQs and intake, written back to the EHR. The role builds the Python backend for
them: call orchestration, conversation state, tool execution and EHR write-back.

Facts about Commure are only what is in SOURCES, checked 2026-09-30. Pranav's facts come from the
resume he applied with (Resume_Pranav_Mishra.pdf, 10 Sep), his existing prep and the master
reference, and his write-up of alfred_'s voice agent (30 September). Sizing numbers are design
assumptions, said as 'we sized it for', never as traffic. Logistics answers (location, pay, work authorization, start date) stay in chat.
"""

LOOP = {
    "id": "commure",
    "title": "Commure, Voice Agents",
    "subtitle": "Recruiter screen",
    # Brand colour for the hub's wordmark. Commure's accent is a light cyan, --velocity #A8F4FF,
    # on its buttons and links: kept for the dark surface (brand_dark). On the light surface the
    # same hue darkened to teal, #00707F, 5.8:1, so it reads apart from River's blue.
    "brand": "#00707F", "brand_dark": "#A8F4FF",
    "when_iso": "",   # empty: the hub shows "Upcoming, date to be set"
    "when": "Date to be set: reply to Audrey to schedule",
    "who": "Audrey Huynh, Commure talent team.",
    "format": ("An initial recruiter interview, about 30 minutes by candidate reports (unconfirmed). Your background, "
               "why Commure and why voice agents, and logistics. Reported loop after it: two technical rounds that "
               "build something practical in Python, a system design round, then leadership."),
    "bar": ("Speed, ownership and plain communication are their stated values. Show you have shipped real-time "
            "voice and production agents, in Python, and that you care about the patient on the call."),
    "plan_kicker": "Before the call",
    "extra": ("The posting and what Commure publishes are under <b>What this rests on</b> on the Prep tab. "
              "For the system design round: the guide's "
              "<a href=\"../SYSTEM%20DESIGN.html#/designs/voice-agent\" target=\"_blank\" rel=\"noopener\">voice agent for patient calls</a>, worked in six steps."),
}

SESSION_IDS = []

PREP_LEAD = ("A recruiter screen. Read how to show up, then say the intro, why Commure and the healthcare voice "
             "story out loud. The bank maps the posting to your work for the questions after.")

SHOW_UP = [
    ("Know the product in one line.", "AI call center agents that pick up every patient call: scheduling, rescheduling, cancellations, confirmations, FAQs and intake, written back to Epic, Cerner or Athena. Clinical questions go to staff."),
    ("Lead with alfred_'s voice agent.", "You own it end to end and it is live for everyone: phone over SIP and the web over WebRTC into LiveKit, one Python worker, a lean agent on the call with the main agent started in parallel on every turn. Reads answer fast; writes wait and the person confirms. That is Commure's job: call orchestration, conversation state, tool execution and write-back."),
    ("Then MockFlow-AI.", "The one you built from scratch and have live: LiveKit, under 400 ms, stages that move only by tool call, and an LLM-as-judge calibrated against human grades."),
    ("Say Python.", "The role is Python first. Your Python: FastAPI services, the UIC backend, the eval tooling, PyTorch. alfred_'s product code is TypeScript; say so if asked."),
    ("Outcomes, then stop.", "A recruiter wants what changed and what you owned, with a number. Leave the architecture for the technical rounds."),
    ("Logistics: one line each.", "The posting says Mountain View, on site five days. Pay, relocation, work authorization, start date: your answers are in chat."),
    ("Close with next steps.", "Ask what the technical rounds look like, and whether anything in your background needs making clearer."),
]

STORY_BLURB = "Your intro, why Commure, the healthcare voice story, and logistics."

# Every outside link, checked 2026-09-30.
SOURCES = [
    {"label": "Software Engineer, Voice Agents: the job post (Ashby)", "url": "https://jobs.ashbyhq.com/commure/0e3440aa-4ddc-4a43-b4c3-804e60a1b2ff",
     "why": "The official posting. Its text is read from the mirror below."},
    {"label": "The same posting, full text (freehire mirror)", "url": "https://freehire.me/jobs/software-engineer-voice-agents-commure-kvlqymic",
     "why": "Python backend for real-time voice agents: call orchestration, conversation state, tool execution, EHR write-back; low-latency telephony, ASR, LLM and TTS; Epic, Cerner, Athena. 2 to 4 years; async and real-time; testing, LLM evaluation, observability. Mountain View, on site; $130K to $180K."},
    {"label": "Commure Agents: product page", "url": "https://www.commure.com/agents",
     "why": "69+ EHRs; 50% less manual call volume and $650K+ saved per 100 providers (their figures)."},
    {"label": "Commure launches Commure Agents (press release, 25 June 2025)", "url": "https://www.commure.com/press-releases/commure-launches-commure-agents---ai-assistants-that-fully-automate-physician-workflows",
     "why": "AI Call Center Agents, Orchestrator and Engage. Tanay Tandon is the CEO; HCA and Tenet named."},
    {"label": "Voice AI for patient call automation (Commure guide)", "url": "https://www.commure.com/blog-agents/voice-ai-systems-patient-call-automation",
     "why": "What gets automated and what doesn't: triage, authorizations and medication questions stay with people. Write-back so nothing is entered twice; escalation rules; PHI under a BAA."},
    {"label": "Best voice AI agents in healthcare (Commure)", "url": "https://www.commure.com/blog-agents/best-voice-ai-agents-in-healthcare",
     "why": "One deployment: 45+ locations, 225+ providers, 200K+ inbound calls a year, abandonment at or under 3%. Configured during implementation, not plug-and-play."},
    {"label": "How AI agents expand call center capacity (Commure)", "url": "https://www.commure.com/blog/how-ai-agents-expand-call-center-capacity-and-patient-access",
     "why": "30 to 80% of inbound calls resolved without staff, depending on the workflow."},
    {"label": "Commure raises $70M at a $7B valuation (TBPN, 19 May 2026)", "url": "https://www.tbpndigest.com/story/2026-05-19/commure-raises-70m-at-7b-valuation-to-deploy-ai-agents-across-the-full-healthcare-administrative-stack",
     "why": "Led by General Catalyst with Sequoia; hiring 40 to 50 engineers for an AI-native EMR and voice agents."},
    {"label": "Commure to acquire Augmedix (Healthcare Dive)", "url": "https://www.healthcaredive.com/news/commure-acquire-augmedix-ai-documentation/721978/",
     "why": "About $139M, July 2024: now the Ambient AI scribe line. Commure merged with Athelas in 2023."},
    {"label": "Inside Commure: culture (Commure blog)", "url": "https://www.commure.com/blog/inside-commure-building-healthcares-future-starts-with-culture",
     "why": "Speed above all, high ownership and output, working shoulder to shoulder with customers, clear communication."},
    {"label": "Commure: company site", "url": "https://www.commure.com",
     "why": "130+ health systems; '30% of patient calls never get answered' (their figure); Ambient AI, Dictation, revenue cycle, Agents."},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. Land on healthcare and real-time voice.",
     "probes": ["What does alfred_ do?", "What did you build at UIC?", "Why voice agents?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",  # verbatim
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad — backend, AI, infrastructure, and product work all kind of blended together.",  # verbatim
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation — things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",  # verbatim
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",  # verbatim
         "And for the last few months that's meant voice: I own alfred_'s voice agent, which people call from their phones, and before that I built a real-time voice platform on LiveKit from scratch. So an agent that actually answers patients' calls and finishes the job is pretty much where I want to be."],
     "land": "Research, shipping, production agents, and now a live voice agent I own.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged. Only the last line is new."]},

    {"id": "why-commure", "title": "Why Commure? Why voice agents?", "length": "about 60 seconds",
     "when": "After the intro, or after her pitch.",
     "probes": ["What do you know about us?", "Why healthcare?", "Why not a general voice AI company?"],
     "say": [
         "A couple of things. From what I read, around 30% of patient calls never get answered, and each one is someone trying to see a doctor. Your agents pick up every call and actually finish the job: they book, reschedule, do intake, and write it back to Epic or Athena. That's a real problem with a real person on the other end.",
         "Second, it's the hardest version of the work I like. Real-time voice, where latency and interruptions matter, plus an agent that takes actions in a system of record, where a wrong booking is worse than no booking. I do exactly that at alfred_: I own our voice agent, phone and web, and it works in people's real email and calendars, where a wrong action is worse than no action.",
         "And healthcare isn't new to me: my research is on multi-agent medical reasoning, and at the UIC lab I worked on voice for patients in the hospital.",
         "So it's a problem I care about, in a domain I've worked in, at a company that's already deployed at scale."],
     "swaps": [{"when": "If she asks what stood out", "line": "That clinical questions go to staff by design. Knowing what an agent shouldn't handle is most of what makes it safe."}],
     "land": "Every patient call answered and finished; real-time voice plus actions in the EHR; healthcare I've worked in.",
     "notes": ["Facts from Commure's own pages (Sources). Say 'from what I read' for their figures."],
     "never": ["Don't quote their savings figures as fact: 'they report'."]},

    {"id": "voice", "title": "Your voice work: alfred_ first, then MockFlow-AI", "length": "about 2 minutes",
     "when": "When she asks what you've done that's closest to the role. Outcome first, then one design choice, then stop.",
     "probes": ["What did you own?", "Is it live?", "How fast is it?", "How many users?", "What was hard?"],
     "say": [
         "The closest is alfred_'s voice agent, which I own end to end and which is live for everyone. You call alfred_ from your phone, or tap the mic in the web app, and talk to the same assistant that knows your email and calendar. Calls come in over a SIP trunk into LiveKit, the web joins over WebRTC, and one Python worker serves both.",
         "The design choice I'd point to: the agent on the call is deliberately lean, a small set of tools and two quick model calls, so it stays responsive. Every time the caller says something, the same request also goes, in parallel, to our main agent, the one behind chat and SMS. So when a request needs real work, there's no escalation step and no extra two to three seconds of silence. Reads it answers fast; anything that writes waits for the main agent, and the person confirms. It never acts on a half-heard instruction.",
         "Before alfred_, I built MockFlow-AI from scratch: a real-time voice interview platform on LiveKit, under 400 milliseconds end to end, where the conversation moves between stages only when the model calls a tool, so it can't drift. It's live, and it grades its own interviews with a judge I calibrated against human scores."],
     "swaps": [{"when": "If she asks how that maps to EHR write-back", "line": "It's the same policy: on the call, the agent can look things up fast, but a write waits for the careful path, gets read back, and the person confirms. For Commure that's a booking in Epic instead of an email."},
               {"when": "If she asks how many users", "line": "alfred_ has 5,000-plus subscribers, and we sized the voice stack for about a thousand daily actives: around twenty calls at once at peak. Every call leaves a record with its timing and cost, so we can see what's actually happening."},
               {"when": "If she asks about healthcare", "line": "My research is multi-agent medical reasoning, TeamMedAgents, and at the UIC lab I deployed an INT8 audio model at 150 milliseconds p95 for patient voice interaction on the hospital network."}],
     "land": "A live voice agent I own, phone and web, with a lean agent on the call and heavy work in parallel; and one I built from scratch.",
     "notes": ["For a recruiter, the first paragraph and one sentence of the second are enough. The rest is for when she asks.",
               "Say 'sized for', never 'we handle': measured chat traffic is far lower than the sizing. The sizing is on the Prep bank.",
               "Numbers: sub-400ms and kappa 0.82 over 50 items (MockFlow-AI); 2 to 3 s escalation avoided (your estimate: confirm it)."]},

    {"id": "logistics", "title": "Logistics she will ask", "length": "a line each",
     "when": "Your answers are in chat, not on this page.",
     "probes": ["The role is on site in Mountain View, five days. Does that work?", "Would you relocate?", "Compensation?", "Work authorization?", "Start date?"],
     "say": [],
     "land": "Say each once, then back to the role.",
     "notes": ["**On site:** the posting says Mountain View, five days a week.",
               "**Pay:** the posting lists $130K to $180K for this level (a Senior version lists $170K to $230K). Your number from chat.",
               "**Work authorization, relocation, start date:** your answers from chat, one sentence each."]},
]

QA = [
    {"group": "The posting, mapped to your work", "blurb": "Each line of the posting and where you've done it. Say the first answer; the rest are for when she reads a line back.", "items": [
        {"q": "How does your background fit the role?", "short": "The fit, in one answer", "tests": "Is the resume real, and does it match?",
         "a": ["Most of it maps directly. The posting asks for Python backends for real-time voice agents, conversation state and tool execution, low-latency pipelines from telephony through ASR, the LLM and TTS, and quality: testing, LLM evaluation and observability.",
               "I own a live voice agent end to end, phone and web, and I built another from scratch on LiveKit, with the evals and tool execution behind both. What I haven't done is EHR integrations like Epic or telephony at call-center scale, and I'd rather say that plainly."],
         "land": "Real-time voice, tool execution and evals, done; EHRs and call-center telephony named as new.",
         "parts": [
             {"title": "Where you've done each line",
              "items": ["**Python backends:** the UIC Python and Postgres backend; FastAPI services; the eval tooling.",
                        "**Real-time voice pipeline:** alfred_'s voice agent: SIP trunk and WebRTC into LiveKit, one Python worker, noise isolation, VAD and end-of-turn detection, streaming STT and TTS or a realtime model behind one seam. MockFlow-AI: Deepgram, Silero VAD, under 400 ms.",
                        "**Call orchestration and conversation state:** the lean voice agent on the call with the main agent in parallel on every turn; an explicit interruption policy; idle check-ins and graceful exits in code.",
                        "**Tool execution:** voice tools through the same MCP server as chat: mostly reads plus draft writes, the person confirms; MockFlow-AI's stage machine with tool-driven transitions.",
                        "**Write-back safely:** at alfred_ code confirms every send and irreversible delete, whatever the model thinks.",
                        "**LLM evaluation:** voice evals in three layers (text scenarios in CI, simulated noisy callers nightly, replay of real calls); the eval harness, scenario replay, deterministic checks plus an LLM judge, 12 failure classes, nightly; MockFlow-AI's judge at weighted kappa 0.82 against human grades.",
                        "**Observability and reliability:** a replayable record per call (per-turn timing, hashed config, what it declined, cost); the production failure scanner over real conversations.",
                        "**Healthcare:** UIC hospital deployment; TeamMedAgents, multi-agent medical reasoning."]},
             {"title": "Not done yet: say so",
              "items": ["Epic, Cerner or Athena integrations.", "Telephony at call-center volume: our SIP line is sized for tens of calls at once, not thousands.", "HIPAA compliance work beyond a research setting."]},
         ]},
        {"q": "How would you keep a patient call from going wrong?", "short": "Safety on a live call", "tests": "Patient-centred judgement.",
         "a": ["Decide in code what the agent may do, and hand everything else to a person: clinical questions, anything it isn't sure of. Answer from the schedule through tools, never from the model's memory, and confirm a booking back to the patient before writing it.",
               "Then learn from real calls: flag the ones that went wrong, turn them into test cases, and run every change against them before it ships. That's how I work at alfred_."],
         "land": "Code decides what the agent may do; real failures become tests."},
        {"q": "What's hard about latency in a voice agent?", "short": "Latency", "tests": "Real-time depth, in plain words.",
         "a": ["Every stage adds up: speech recognition, the model, speech synthesis, and the phone line. So everything streams, so no stage waits for the whole of the one before, and the model on the critical path stays small. Slow work, like an EHR lookup, runs while the agent says something natural.",
               "In MockFlow-AI moving from polling to streaming was most of the win: about five times faster, under 400 milliseconds."],
         "land": "Stream every stage, keep the critical path small, cover slow lookups."},
        {"q": "Walk me through one turn of a voice call, and the latency budget.", "short": "One turn, timed", "tests": "Real-time depth; for the technical rounds more than for her.",
         "a": ["The caller stops talking. Noise isolation, voice activity and end-of-turn detection decide they're done, about 300 to 500 ms: that's the number that makes it feel like a conversation. The streaming transcript is final about 100 to 200 ms later.",
               "A fast model starts answering, first token about 300 to 500 ms, and at the same moment the heavy agent has already started on the same request. Streaming speech out gives first audio in about 100 to 200 ms, and the phone line adds about 100 to 150.",
               "So first audio is about 1 to 1.5 seconds after they stop. If a lookup is running and nothing has been said for about a second, the worker, not the model, says 'let me check'."],
         "land": "About 1 to 1.5 s to first audio, timed stage by stage; the filler is code.",
         "notes": ["These are design targets. At alfred_ every turn logs the stages, so the argument about where time goes is settled with data."]},
        {"q": "How would you size a voice agent's infrastructure?", "short": "Sizing, on a whiteboard", "tests": "Capacity thinking.",
         "a": ["Start from calls, not users. For alfred_ we sized for about 1,000 daily actives out of 5,000-plus subscribers: say 20% use voice on a day, about 300 sessions of about 3 minutes, around 3,600 caller turns.",
               "The peak hour at about 15% of the day is 45 sessions; Little's law, 45 times 3 minutes over 60, is 2 to 3 calls at once, about 10 in a burst, so we provision 20. Noise isolation and turn detection run on CPU per call, so the capacity of one worker is the number you load-test."],
         "land": "Calls in the peak hour times duration: Little's law, a burst factor, then load-test one worker.",
         "notes": ["Sizing, not traffic: say 'sized for'. For Commure's scale, one health system they report takes 200K+ calls a year, about 800 a working day: the same arithmetic gives about 6 at once in the peak hour and about 25 in a burst."]},
        {"q": "How do you evaluate a voice agent?", "short": "Evals for voice", "tests": "The posting's 'LLM evaluation' line.",
         "a": ["Three layers, built before tuning. Text-mode scenarios in CI, where a wrong tool or a wrong argument fails the build. Simulated callers with background noise and network jitter, nightly. And replay of real calls.",
               "Every call leaves a replayable record: the timing of every turn, the exact config, what the agent declined to do, and the cost. When something sounds wrong on a call, we can see why."],
         "land": "CI scenarios, simulated noisy callers, real-call replay; a record per call."},
    ]},
]

QA_ORDER = ["The posting, mapped to your work"]

ASK_3C = [
    {"id": "audrey", "title": "For Audrey", "when": "At the end. One or two.",
     "why": "Practical questions about the process and the team.",
     "how": ["Ask one, then listen."],
     "items": [
         {"to": "Audrey", "q": "What do the technical rounds look like, and roughly what's the timeline?", "loop": "First.", "why": "Tells you what to prepare."},
         {"to": "Audrey", "q": "How big is the voice agents team, and who would I work with most?", "loop": "Middle.", "why": "Scope."},
         {"to": "Audrey", "q": "What makes someone stand out on this team?", "loop": "If there's time.", "why": "What to lead with next."},
         {"to": "Audrey", "q": "Is there anything in my background you'd want me to make clearer?", "loop": "Last.", "why": "Invites a concern while you can answer it."}]},
    {"id": "team", "title": "For the team, later", "when": "The technical rounds.",
     "why": "Keep for engineers.",
     "how": ["Save these."],
     "items": [
         {"to": "Engineer", "q": "How do you evaluate a change to the agent before it reaches patients?", "loop": "Early.", "why": "Your strongest area."},
         {"to": "Engineer", "q": "Where does latency go today: ASR, the model, TTS or the phone line?", "loop": "Middle.", "why": "Real-time depth."},
         {"to": "Engineer", "q": "How do you handle an EHR write that fails halfway through a call?", "loop": "Middle.", "why": "Reliability of actions."}]},
]
ASK = []

TRAPS = [
    ("Claiming EHR or telephony at scale", "You run a SIP line sized for tens of calls, not a call center, and haven't integrated Epic. Say so, then say what carries over."),
    ("Quoting sizing as traffic", "The 1,000 daily actives and 20 concurrent calls are what you sized for. Say 'sized for'."),
    ("Naming internals", "Say 'our main agent, the one behind chat and SMS'. Function names and schemas stay out of a recruiter call."),
    ("Calling alfred_ Python", "alfred_'s product code is TypeScript. Your Python is UIC, FastAPI, evals and PyTorch."),
    ("Quoting their numbers as fact", "Savings and resolution rates are theirs: 'they report'."),
    ("Going deep technically", "A recruiter screen: outcomes and scope."),
    ("Raising logistics first", "Only if she asks."),
    ("Funding, crunch, colleagues' names", "Never, about alfred_."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "why-commure", "prompt": "Why Commure, and why voice agents?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-commure"},
    {"id": "voice", "prompt": "What have you done that's closest to this role?", "target": "2 minutes", "seconds": 120, "ref": "#say-voice"},
]

MOCK_HOW = "Say 'run the Commure mock' in chat: Audrey screens, sells the role, then asks for your questions."
