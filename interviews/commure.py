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
    "subtitle": "Recruiter screen, 15 minutes",
    # Brand colour for the hub's wordmark. Commure's accent is a light cyan, --velocity #A8F4FF,
    # on its buttons and links: kept for the dark surface (brand_dark). On the light surface the
    # same hue darkened to teal, #00707F, 5.8:1, so it reads apart from River's blue.
    "brand": "#00707F", "brand_dark": "#A8F4FF",
    "when_iso": "2026-10-05T09:00:00-05:00",   # the day is set; the time is a placeholder until the invite lands
    "when": "Monday 5 October (time to be confirmed)",
    "who": "Audrey Huynh, Commure talent team.",
    "format": ("Fifteen minutes with the recruiter: your story, why Commure and voice agents, and logistics. The six "
               "sessions are groundwork for the round after it, reported as practical Python builds, a system design "
               "round, then leadership."),
    "bar": ("Speed, ownership and plain communication are their stated values. Show you have shipped real-time "
            "voice and production agents, in Python, and that you care about the patient on the call."),
    "plan_kicker": "Before the call",
    "extra": ("<b>Work in this order.</b> For Monday's fifteen minutes: the first Learn module, your story, explained aloud and compared. "
              "For the round after: the other six modules in order, the call path, the conversation loop, the backend, Python async, "
              "your voice agent and the design; check yourself on each and 'Test me' until the weak squares turn. "
              "Then say 'run the Commure mock' in chat."),
}

# The Overview: the company and the role, from the posting (Ashby's public feed, read 2026-10-01).
COMPANY = [
    "Commure builds what they call the AI operating system for healthcare: Ambient AI and Dictation for documentation, Agents for patient and revenue workflows, and revenue cycle automation, on one platform integrated with 60+ EHRs. They report 500,000+ clinicians across 500+ organizations and over 200 million patient interactions.",
    "They raised $70M at a $7B valuation in May 2026, merged with Athelas in 2023 and bought Augmedix in 2024. The team works directly alongside clinicians, deploys daily, and values speed and ownership.",
]

POSTING = {
    "url": "https://jobs.ashbyhq.com/commure/0e3440aa-4ddc-4a43-b4c3-804e60a1b2ff",
    "label": "Software Engineer, Voice Agents, on Ashby",
    "checked": "1 October 2026",
    "lead": "Health system call centers can't keep up: they report that 85% of patients who can't get through never call back. The voice agents pick up every call and handle it end to end: scheduling, rescheduling, cancellations, confirmations, FAQs and intake, integrated with the EHR and telephony in real time. This role builds the systems they run on. Mid-level, on a small team that ships every day.",
    "facts": [["Where", "Mountain View, CA, on site five days a week"], ["Pay", "$130K to $180K, plus equity (the posting)"], ["Level", "Mid-level; 2 to 4 years of backend experience"]],
    "does": [
        "Python backend services for real-time voice agents: call orchestration, conversation state, tool execution and EHR write-back.",
        "Low-latency pipelines joining telephony, ASR, LLMs and TTS into one conversational loop.",
        "Integrations with Epic, Cerner, athena and others for scheduling, eligibility and intake.",
        "APIs, data models and event-driven workflows, designed with senior engineers.",
        "Features patient access teams actually use, with AI, product and operations.",
        "Own the quality of what you ship: latency, reliability, observability, release readiness.",
    ],
    "wants": [
        "2 to 4 years of backend work, mostly in Python.",
        "Production services, APIs and data models shipped.",
        "An intuition for how people talk to voice and text assistants.",
        "Async, event-driven or real-time systems, or the wish to grow into them.",
        "Testing, LLM evaluation, observability and reliability.",
        "A patient-centered mindset, a bias for action and ownership.",
    ],
}

# Tracker sessions for this loop, in order, with the day each belongs to.
# Groundwork for the round after the screen, whenever it lands; in this order.
SESSION_IDS = [
    ("wc19", "1"), ("wc20", "2"), ("wc21", "3"),
    ("wc22", "4"), ("wc23", "5"), ("wc24", "6"),
]

PREP_LEAD = ("Say comes last. Start with the <b>Understand first</b> bank: four questions that everything else rests on, each with its "
             "figure and the session that teaches it. Then the design, then your story out loud with the timer.")

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
               {"when": "If she asks how many users", "line": "alfred_ has 5,000-plus subscribers, and over a thousand use the phone agent daily. Every call leaves a record with its timing and cost, so we can see what's actually happening."},
               {"when": "If she asks about healthcare", "line": "My research is multi-agent medical reasoning, TeamMedAgents, and at the UIC lab I deployed an INT8 audio model at 150 milliseconds p95 for patient voice interaction on the hospital network."}],
     "land": "A live voice agent I own, phone and web, with a lean agent on the call and heavy work in parallel; and one I built from scratch.",
     "notes": ["For a recruiter, the first paragraph and one sentence of the second are enough. The rest is for when she asks.",
               "Numbers: sub-400ms and kappa 0.82 over 50 items (MockFlow-AI); 2 to 3 s escalation avoided (your estimate: confirm it)."]},

    {"id": "why-voice", "title": "Why voice AI?", "length": "about 45 seconds",
     "when": "Asked on its own, or folded into why Commure.",
     "probes": ["Why not text agents?", "What's hard about voice?", "Where do you think voice agents are going?"],
     "say": [
         "Honestly, because it's where the engineering gets hardest and the payoff is most direct. With text you can take a few seconds; on a phone call, silence sounds like the line dropped. So latency, interruptions and turn-taking stop being nice-to-haves.",
         "And for a lot of people, especially patients, the phone is still the default. Someone calling to book an appointment isn't going to open an app. If the agent can actually pick up and finish the job, that's a real difference for them.",
         "I've been doing this for a while now: I own alfred_'s voice agent on phone and web, I built a real-time voice platform on LiveKit from scratch, and at the UIC lab I worked on voice for patients in the hospital. So voice is pretty much where I want to keep going."],
     "swaps": [{"when": "If she asks where voice agents are going", "line": "Speech-to-speech models are getting good, but in a setting like healthcare you still want an orchestrator around them that decides what the agent is allowed to do. That's the part I find most interesting."}],
     "land": "Hardest engineering, most direct payoff; the phone is still how patients reach care; I already own a live voice agent.",
     "notes": ["New, in your voice, from your prep facts: alfred_'s voice agent (SIP and WebRTC into LiveKit), MockFlow-AI, the UIC patient voice work."]},

    {"id": "leave", "title": "Why are you looking to leave alfred_?", "length": "about 45 seconds",
     "when": "You are exploring while employed. Make that clear without sounding defensive.",
     "probes": ["Is something wrong at alfred_?", "You've only been there since April. Why move so soon?", "Will you leave us quickly too?"],
     "say": [
         "There's nothing particularly wrong with alfred_. I've actually learned a lot there and I still enjoy the work.",  # verbatim
         "I'm mostly looking at what I want the next few years of my career to look like. At alfred_, I've had a lot of ownership because it's a small team, and that's been great. But the work is ultimately internal to one product.",  # verbatim
         "What I'm increasingly interested in is voice agents that finish real work for people where it really matters. A patient calling to get care, and an agent that books it in Epic correctly, is about as direct as that gets, and Commure is doing it across a lot of health systems.",
         "So it's less \u201cI need to get away from Alfred\u201d and more \u201cI've found a direction I want to go deeper into.\u201d"],  # verbatim
     "swaps": [{"when": "If she asks bluntly: why not stay?", "line": "I could. And that's why I'm being selective about what I talk to. I'm not looking to leave just to change companies. It has to give me a meaningfully different scope, and voice agents in healthcare at Commure's scale does."},
               {"when": "If she asks: only since April, why so soon?", "line": "Fair question. It's been a very dense six months, and the pieces I built there are running. I'm not in a rush; I'm talking to very few places, because the scope has to be genuinely different."}],
     "land": "Less \u201cget away from alfred_\u201d, more \u201ca direction I want to go deeper into\u201d.",
     "notes": ["Paragraphs 1, 2 and 4 are your words, unchanged (from your Mphasis and Coframe answers). Paragraph 3 now names voice agents in healthcare.",
               "Pay, visa and start date are in chat, not on this page."]},

    {"id": "logistics", "title": "Logistics she will ask", "length": "a line each",
     "when": "Your answers are in chat, not on this page.",
     "probes": ["The role is on site in Mountain View, five days. Does that work?", "Would you relocate?", "Compensation?", "Work authorization?", "Start date?"],
     "say": [],
     "land": "Say each once, then back to the role.",
     "notes": ["**On site:** the posting says Mountain View, five days a week.",
               "**Pay:** the posting lists $130K to $180K for this level (a Senior version lists $170K to $230K). Your number from chat.",
               "**Work authorization, relocation, start date:** your answers from chat, one sentence each."]},
]

# The Prep bank and the sessions' material now live in one learning path: interviews/commure.learn.json
# (Learn tab), built 3 October 2026. The old bank is in git history.
QA = [
    {"group": "The recruiter screen: questions she is likely to ask", "blurb": "Short answers; each points to the script that carries it.", "items": [
        {"q": "Walk me through your background.", "short": "Your background", "tests": "A clear, short arc that lands on this role.",
         "a": ["Use your intro (Your story, Tell me about yourself): research at UIC, shipping at WheelPrice, founding LLM engineer at alfred_, and now the voice agent I own."],
         "land": "Research, shipping, production agents, a live voice agent."},
        {"q": "What do you know about Commure?", "short": "What you know about Commure", "tests": "Did you prepare?",
         "a": ["From what I read, Commure builds an AI platform for healthcare: ambient documentation, revenue cycle, and agents that handle patient calls end to end, scheduling, rescheduling, intake, written back to Epic, Cerner or athena.",
               "They report around 30% of patient calls go unanswered; the voice agents are there so every call gets picked up and finished."],
         "land": "AI across the healthcare admin stack; voice agents that pick up and finish every patient call.",
         "notes": ["Say 'they report' for their figures."]},
        {"q": "Why Commure?", "short": "Why Commure", "tests": "Motivation that fits the role.",
         "a": ["Use Why Commure: a real problem with a real patient on the other end, the hardest version of the work I like (real-time voice plus actions in a system of record), and healthcare I've worked in."],
         "land": "Real problem, hardest version of my work, a domain I know."},
        {"q": "Why voice AI?", "short": "Why voice AI", "tests": "Genuine interest, not a trend.",
         "a": ["Use Why voice AI: latency and turn-taking make it the hardest engineering, the phone is how patients reach care, and I already own a live voice agent."],
         "land": "Hard, direct, and already my work."},
        {"q": "Why are you leaving alfred_?", "short": "Why leave", "tests": "No red flags; a pull, not a push.",
         "a": ["Use Why leave: nothing wrong at alfred_, but the work is one product; I want voice agents doing real work where it matters, which is Commure."],
         "land": "A direction I want to go deeper into."},
        {"q": "Tell me about the project closest to this role.", "short": "Closest project", "tests": "Ownership and outcome.",
         "a": ["Use Your voice work: alfred_'s voice agent, which I own end to end and is live; a lean agent on the call with the main agent working in parallel; writes wait and the person confirms. Then MockFlow-AI, which I built from scratch."],
         "land": "A live voice agent I own; one I built from scratch."},
        {"q": "How much Python have you written?", "short": "Your Python", "tests": "The role is Python first.",
         "a": ["A lot. My research and the UIC backend were Python, the eval tooling and FastAPI services are Python, and MockFlow-AI's agent worker is Python on LiveKit. alfred_'s voice worker is Python too; most of alfred_'s product code is TypeScript."],
         "land": "Python across research, services, evals and voice workers.",
         "notes": ["Confirm the voice worker language in your own words if unsure; the prep says one Python worker serves phone and web."]},
        {"q": "Do you have healthcare experience?", "short": "Healthcare", "tests": "Domain fit.",
         "a": ["Some, from research rather than a health system: my research is multi-agent medical reasoning, TeamMedAgents, and at the UIC lab I deployed an audio model for patient voice interaction on the hospital network. I haven't integrated Epic myself, but the pattern I use for writes, read back and confirm, carries over directly."],
         "land": "Medical reasoning research and patient voice work; honest about Epic."},
        {"q": "What are you looking for in your next role?", "short": "What you want next", "tests": "Fit with the team.",
         "a": ["Owning a real-time agent in production, on a small team that ships fast, where what I build changes something for a real person on the other end of the call."],
         "land": "Ownership, speed, a real person on the other end."},
        {"q": "The role is on site in Mountain View, five days a week. Does that work?", "short": "On site", "tests": "Logistics.",
         "a": ["Your answer is in chat, one sentence, then back to the role."],
         "land": "Say it once."},
        {"q": "Are you interviewing elsewhere?", "short": "Other interviews", "tests": "Timeline.",
         "a": ["A few conversations, and I'm being selective. This one stands out because it's the most direct fit with what I already do: a live voice agent that takes real actions."],
         "land": "Selective; this is the closest fit."}]},
]
TABS = ["overview", "prep", "learn", "mocks"]

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
    ("Claiming EHR or telephony at scale", "You run a consumer assistant's phone line, not a health system's call center, and haven't integrated Epic. Say so, then say what carries over."),
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
