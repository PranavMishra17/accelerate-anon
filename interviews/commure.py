"""Commure, recruiter screen: Software Engineer, Voice Agents. Date to be set.

Audrey Huynh (Commure talent team) asked to schedule an initial recruiter interview. Commure's
voice agents answer patients' calls for health systems: scheduling, rescheduling, cancellations,
confirmations, FAQs and intake, written back to the EHR. The role builds the Python backend for
them: call orchestration, conversation state, tool execution and EHR write-back.

Facts about Commure are only what is in SOURCES, checked 2026-09-30. Pranav's facts come from the
resume he applied with (Resume_Pranav_Mishra.pdf, 10 Sep), his existing prep and the master
reference. Logistics answers (location, pay, work authorization, start date) stay in chat.
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
    "extra": ("The posting and what Commure publishes are under <b>What this rests on</b> on the Prep tab."),
}

SESSION_IDS = []

PREP_LEAD = ("A recruiter screen. Read how to show up, then say the intro, why Commure and the healthcare voice "
             "story out loud. The bank maps the posting to your work for the questions after.")

SHOW_UP = [
    ("Know the product in one line.", "AI call center agents that pick up every patient call: scheduling, rescheduling, cancellations, confirmations, FAQs and intake, written back to Epic, Cerner or Athena. Clinical questions go to staff."),
    ("Lead with healthcare voice.", "At UIC you deployed an INT8 audio model at 150 ms p95 for assistant-patient voice interaction, for 200 concurrent users across the hospital network. Then MockFlow-AI on LiveKit, under 400 ms."),
    ("Then production agents.", "alfred_: tool execution, conversation state, evals over 12 failure classes, and irreversible actions confirmed in code. EHR write-back is the same problem."),
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
         "And voice in healthcare is where a lot of that started for me: at the UIC lab I deployed an audio model for patient voice interaction across the hospital network. So a voice agent that actually answers patients' calls is pretty much where I want to be."],
     "land": "Research, shipping, production agents; and healthcare voice is where it started.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged. Only the last line is new."]},

    {"id": "why-commure", "title": "Why Commure? Why voice agents?", "length": "about 60 seconds",
     "when": "After the intro, or after her pitch.",
     "probes": ["What do you know about us?", "Why healthcare?", "Why not a general voice AI company?"],
     "say": [
         "A couple of things. From what I read, around 30% of patient calls never get answered, and each one is someone trying to see a doctor. Your agents pick up every call and actually finish the job: they book, reschedule, do intake, and write it back to Epic or Athena. That's a real problem with a real person on the other end.",
         "Second, it's the hardest version of the work I like. Real-time voice, where latency and interruptions matter, plus an agent that takes actions in a system of record, where a wrong booking is worse than no booking. I've worked on both sides: real-time voice with LiveKit, and a production agent that sends email and changes calendars for 5,000-plus people.",
         "And healthcare isn't new to me. At UIC I built the backend and deployed an audio model for patient voice interaction on the hospital network, and my research is on multi-agent medical reasoning.",
         "So it's a problem I care about, in a domain I've worked in, at a company that's already deployed at scale."],
     "swaps": [{"when": "If she asks what stood out", "line": "That clinical questions go to staff by design. Knowing what an agent shouldn't handle is most of what makes it safe."}],
     "land": "Every patient call answered and finished; real-time voice plus actions in the EHR; healthcare I've worked in.",
     "notes": ["Facts from Commure's own pages (Sources). Say 'from what I read' for their figures."],
     "never": ["Don't quote their savings figures as fact: 'they report'."]},

    {"id": "voice", "title": "Your voice and healthcare work", "length": "about 90 seconds",
     "when": "When she asks what you've done that's closest to the role. Outcomes first.",
     "probes": ["What was the latency?", "What did you own?", "Was it used by real patients?"],
     "say": [
         "Three pieces. At the UIC lab I deployed an audio ML inference service for assistant-patient voice interaction: the model quantized to INT8 and served with TorchScript at 150 milliseconds p95, with a Python and Postgres backend, supporting 200 concurrent users across the UIC hospital network.",
         "Then MockFlow-AI, a real-time voice interview platform I built on LiveKit: streaming speech-to-text and text-to-speech, under 400 milliseconds end to end, with the conversation moving through stages only when the model calls a tool, so it can't wander.",
         "And at alfred_, the production side: an agent that takes real actions, sending email and changing calendars, with an eval harness that replays production scenarios nightly across 12 failure classes, and code that confirms every irreversible action."],
     "swaps": [{"when": "If she asks how that maps to EHR write-back", "line": "It's the same shape as alfred_ confirming a send or a delete in code, whatever the model thinks: the model proposes the booking, code checks it and writes it."}],
     "land": "Healthcare voice in production, real-time voice under 400 ms, and agents that act safely.",
     "notes": ["Numbers from the resume you applied with: 150 ms p95, INT8, TorchScript, 200 concurrent users; sub-400ms; 12 failure classes."]},

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
               "I've done real-time voice twice, in a hospital setting and on LiveKit, and evaluation and tool execution for a production agent. What I haven't done is EHR integrations like Epic or telephony at call-center scale, and I'd rather say that plainly."],
         "land": "Real-time voice, tool execution and evals, done; EHRs and call-center telephony named as new.",
         "parts": [
             {"title": "Where you've done each line",
              "items": ["**Python backends:** the UIC Python and Postgres backend; FastAPI services; the eval tooling.",
                        "**Real-time voice pipeline:** MockFlow-AI: LiveKit over WebRTC, Deepgram, Silero VAD, streaming TTS, under 400 ms.",
                        "**Conversation state and tool execution:** alfred_'s agent loop and tools; MockFlow-AI's stage machine with tool-driven transitions.",
                        "**Write-back safely:** at alfred_ code confirms every send and irreversible delete, whatever the model thinks.",
                        "**LLM evaluation:** the eval harness, scenario replay, deterministic checks plus an LLM judge, 12 failure classes, nightly; MockFlow-AI's judge at weighted kappa 0.82 against human grades.",
                        "**Observability and reliability:** the production failure scanner over real conversations.",
                        "**Healthcare:** UIC hospital deployment; TeamMedAgents, multi-agent medical reasoning."]},
             {"title": "Not done yet: say so",
              "items": ["Epic, Cerner or Athena integrations.", "Telephony (SIP, PSTN) at call-center volume.", "HIPAA compliance work beyond a research setting."]},
         ]},
        {"q": "How would you keep a patient call from going wrong?", "short": "Safety on a live call", "tests": "Patient-centred judgement.",
         "a": ["Decide in code what the agent may do, and hand everything else to a person: clinical questions, anything it isn't sure of. Answer from the schedule through tools, never from the model's memory, and confirm a booking back to the patient before writing it.",
               "Then learn from real calls: flag the ones that went wrong, turn them into test cases, and run every change against them before it ships. That's how I work at alfred_."],
         "land": "Code decides what the agent may do; real failures become tests."},
        {"q": "What's hard about latency in a voice agent?", "short": "Latency", "tests": "Real-time depth, in plain words.",
         "a": ["Every stage adds up: speech recognition, the model, speech synthesis, and the phone line. So everything streams, so no stage waits for the whole of the one before, and the model on the critical path stays small. Slow work, like an EHR lookup, runs while the agent says something natural.",
               "In MockFlow-AI moving from polling to streaming was most of the win: about five times faster, under 400 milliseconds."],
         "land": "Stream every stage, keep the critical path small, cover slow lookups."},
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
    ("Claiming EHR or telephony work", "You haven't integrated Epic or run telephony at scale. Say so, then say what carries over."),
    ("Calling alfred_ Python", "alfred_'s product code is TypeScript. Your Python is UIC, FastAPI, evals and PyTorch."),
    ("Quoting their numbers as fact", "Savings and resolution rates are theirs: 'they report'."),
    ("Going deep technically", "A recruiter screen: outcomes and scope."),
    ("Raising logistics first", "Only if she asks."),
    ("Funding, crunch, colleagues' names", "Never, about alfred_."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "why-commure", "prompt": "Why Commure, and why voice agents?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-commure"},
    {"id": "voice", "prompt": "What have you done that's closest to this role?", "target": "90 seconds", "seconds": 90, "ref": "#say-voice"},
]

MOCK_HOW = "Say 'run the Commure mock' in chat: Audrey screens, sells the role, then asks for your questions."
