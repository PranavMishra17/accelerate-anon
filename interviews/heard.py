"""Heard (heard.dev), Founding Engineer. Round 1: a call with Kelly Sun, founder, on Thursday 22 October 2026 (time picked
on her cal.com). Heard found him through MockFlow-AI on GitHub.

Page only, kept short (his request, like Overjoy and EcoGPT): what Heard is, the role, your intro and story in versions,
your projects, and questions in three tiers. Project stories about alfred_ internals live in the gitignored
private/loops/heard.js and show on the Prep tab when present.

Facts about Heard come from SOURCES, every link opened 21 October 2026. Kelly's background was not found publicly: ask.
Pranav's words are from E:/_Resume-Curator/INTRO.md, verbatim where marked. Logistics answers stay in chat.
"""

LOOP = {
    "id": "heard",
    "title": "Heard, Founding Engineer",
    "company": "Heard",
    "subtitle": "Round 1: a call with Kelly Sun, founder",
    # heard.dev is black and white; #58846B is the one accent in its stylesheet (read 2026-10-21); lighter for dark mode.
    "brand": "#58846B", "brand_dark": "#8FBF9F",
    "when_iso": "2026-10-22",
    "when": "Thursday 22 October (the time you booked on Kelly's cal.com)",
    "who": "Kelly Sun, founder of Heard (her background is not public; ask). The Product Hunt team also lists Abdul Rehman and Cruise Chen.",
    "format": "A first chat, 30 minutes on her calendar: what Heard is building, your background, and why you. They found you through MockFlow-AI.",
    "bar": ("Have you built real-time voice that people use, do you live inside coding agents yourself, and can you be engineer number one? "
            "Lead with the voice agent you run in production, keep MockFlow ready (it is why they wrote), and say how you use Claude Code."),
    "plan_kicker": "Before the call",
    "extra": ("<b>Twenty minutes of prep.</b> "
              "1. Install Heard and run one Claude Code session with it (they ask every applicant for three pieces of product feedback). "
              "2. Prep tab: your intro out loud (45 seconds). "
              "3. Your projects: the voice agent, then MockFlow. "
              "4. Pick one question from each tier."),
}

SESSION_IDS = []

PREP_LEAD = "Your intro, why Heard, your projects, three pieces of product feedback, and the questions to ask."

SHOW_UP = [
    ("Use it before the call.", "Their careers page asks every applicant for three pieces of product feedback. Have three real ones from your own session, specific, kind and useful."),
    ("You are their user.", "You run Claude Code all day with hooks, subagents and background workflows. Their thesis, 'parallelism is free now, attention isn't', is your week. Say so with one concrete example."),
    ("Voice in production, not a demo.", "The alfred_ voice agent runs on phone and web; MockFlow streams speech in and out under 400 ms. Talk latency budgets, barge-in and what happens when the model is slow."),
    ("Engineer number one.", "Small team, the first engineer. Say you want to own the engine end to end and that you ship fast with tests."),
    ("Thirty minutes goes fast.", "Two or three sentences per answer. Keep five minutes for your questions."),
]

STORY_BLURB = "Your intro, why Heard, why leave alfred_, what you want next, and logistics."

# Every outside link opened 2026-10-21.
SOURCES = [
    {"label": "Heard", "url": "https://heard.dev/", "why": "A voice for your coding agents: progress, blockers and decisions read aloud; 'Hey Parrot' replies typed into the right terminal."},
    {"label": "Heard: careers", "url": "https://heard.dev/careers", "why": "Founding Engineer, engineer number one: agentic systems, LLM, speech and real-time ML; 100K to 140K plus equity; SF, NYC, Toronto or remote."},
    {"label": "Heard: manifesto", "url": "https://heard.dev/manifesto", "why": "Attention, not intelligence, is the scarce resource; speak only when an agent finishes, is stuck or needs approval. Signed by Kelly Sun. Backers named."},
    {"label": "Heard: pricing", "url": "https://heard.dev/pricing", "why": "Free self-host, Pro and Power tiers; the agents it hooks into; the iPhone companion."},
    {"label": "heardlabs/heard on GitHub", "url": "https://github.com/heardlabs/heard", "why": "The open engine: Python, Apache 2.0; Claude Code hooks feed events; local Kokoro voice with ElevenLabs failover; personas in Markdown."},
    {"label": "Heard on Product Hunt", "url": "https://www.producthunt.com/products/heard-2", "why": "Number one product of the day; Kelly's launch comment on how it decides what to say."},
    {"label": "Heard: privacy policy", "url": "https://heard.dev/privacy", "why": "The stack: ElevenLabs, Anthropic, Groq, Supabase, Cloudflare Workers, Vercel."},
]

COMPANY = [
    "Heard is a voice layer for coding agents. While Claude Code or Codex works, Heard reads its progress, blockers and decisions aloud, and you answer by voice ('Hey Parrot'), with the reply typed into the right session. A Mac app with an iPhone companion; free to self-host, then 12 and 24 dollars a month. The engine is open source in Python; the listening side (push-to-talk, Parrot, the phone relay) is in the closed app.",
    "How it decides what to speak, from Kelly's launch note: hard signals from the agent's hooks (a permission prompt, a tool failure, a run ending) plus a context-aware pass over the session; simultaneous events queued by importance; the session state stays on the Mac. Summaries come from Anthropic, voices from local Kokoro or ElevenLabs.",
    "The company: SNACKAI Inc., doing business as Heard, in the Bay Area. Backed by Betaworks, Alpha Edison and the family office of Iron Mountain's CEO. Number one on Product Hunt in July. A small team; this is the first engineering hire. Kelly Sun is the founder; her background is not public.",
    "The hard parts, which are your opening: deciding what is worth saying (noise against a missed blocker), routing a spoken reply to the right one of many sessions, how far voice may act on your machine, latency from an agent event to first audio, cost per user on managed voices, and depending on hook formats they do not control.",
]

POSTING = {
    "url": "https://heard.dev/careers",
    "lead": "Founding Engineer: engineer number one, on agentic systems, LLMs, speech and real-time ML, building toward millions of agents.",
    "facts": [["Location", "SF, NYC, Toronto or remote"], ["Range", "100K to 140K USD plus equity"],
              ["Stack (reported)", "Python engine, a Rust CLI, Supabase, Cloudflare Workers, Vercel"], ["Voice", "Kokoro locally, ElevenLabs managed"]],
    "does": ["Build the agentic and real-time speech systems end to end.", "Shape the architecture to scale from one Mac to millions of agents.", "Work directly with the founder on what ships."],
    "wants": ["Projects you can link to; no cover letter.", "Hands-on with LLMs, speech or real-time ML.", "Three pieces of feedback on the product, sent to the founders."],
}

ROUNDS = [
    {"title": "Round 1: chat with Kelly Sun, founder",
     "when": "Thursday 22 October 2026",
     "who": "Kelly Sun",
     "format": "A first chat after she read your LinkedIn and experience.",
     "outcome": "Not yet held.",
     "notes": ["She wrote first, on 16 October: 'saw your MockFlow-AI project on GitHub'."],
     "asked": []},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 45 seconds",
     "when": "First, almost certainly. The short one, then stop.",
     "probes": ["What do you own at alfred_?", "Tell me about MockFlow."],
     "say": [
         "I'm currently a founding LLM engineer at alfred_, where I work across AI agent reliability, memory architecture, evaluation infrastructure, and automation for a product with 5,000-plus active users. A big part of my work has been taking ambiguous problems and building the systems underneath them that make AI actually work reliably in production.",  # verbatim
         "Before that, I worked at an early-stage startup called WheelPrice and did AI research at UIC. What I enjoy most is working across the stack, understanding a real problem, and building something that solves it end to end. And Heard is a problem I have every day: I run several coding agents at once, and I'm the bottleneck."],
     "swaps": [{"when": "If she asks for one line", "line": "I build the systems under production agents, including a voice agent on phone and web, and I built MockFlow, a real-time voice interviewer, on the side."}],
     "land": "Production agents and real-time voice, and you are Heard's user.",
     "notes": ["The first paragraph and the first two sentences of the second are yours from INTRO.md, unchanged. The last line is new: make it yours."]},
    {"id": "why-heard", "title": "Why Heard?", "length": "about 30 seconds",
     "when": "Likely.",
     "probes": ["What did you think of the product?", "Why a team this small?"],
     "vname": "A",
     "say": [
         "Honestly, because I'm the user. I run Claude Code most of the day, often several sessions and background agents at once, and the thing that breaks isn't the model, it's my attention: I miss the one session that's been waiting on a permission prompt for ten minutes.",
         "And the engineering is the kind I like: real-time voice, deciding what's worth saying, and routing a reply to the right agent. I've built pieces of that twice, and I'd like to build it properly as engineer number one."],
     "variants": [
         {"name": "B, the engineering", "land": "Real-time voice plus judgment about what to say: hard, and close to what you have built.",
          "say": ["The engineering problem. Speech in and out in real time is the part I know; the harder part is judgment, what's worth interrupting someone for, and that's an evaluation problem as much as a model one.",
                  "That mix, voice, agents and measuring whether the agent made a good call, is pretty much what I've done at alfred_ and in MockFlow."]},
         {"name": "C, the stage", "land": "The first engineer, from the open engine to millions of agents.",
          "say": ["I think it's the stage. You've got a product people use and an open engine, and the next step is making it hold for many agents at once, across machines and phones.",
                  "Being the first engineer on that, working directly with you, is the kind of ownership I'm looking for."]}],
     "land": "You live the problem, and you have built the parts.",
     "swaps": [{"when": "If she asks what you think of the product", "line": "Give your three pieces of feedback, from your own session: what worked, then the one thing you would change first, and how you would measure it."}],
     "notes": ["Written in your voice from the research and your own Claude Code use; make it yours. Only say 'several sessions at once' if it is true for you."]},
    {"id": "feedback", "title": "What feedback do you have on the product?", "length": "about 60 seconds",
     "when": "Likely: their careers page asks every applicant for three.",
     "probes": ["What would you build first?", "What annoyed you?"],
     "say": [],
     "land": "Three specific points from your own use: one that worked, two to change, each with how you would know it got better.",
     "notes": ["Fill this after you try it tonight: install, run one Claude Code session, let it narrate, try a reply. Note when it spoke and should not have, when it stayed quiet and should not have, and how long until first audio."]},
    {"id": "leave", "title": "Why leave alfred_?", "length": "about 30 seconds",
     "when": "If asked.",
     "probes": [],
     "say": [
         "I\u2019m not looking to leave because there\u2019s something fundamentally wrong with alfred_. The reason I'm exploring is more about the direction I want to take my career",  # verbatim
         "I've learned a lot at alfred_ and have had the opportunity to own important parts of a production AI product from the ground up. I've gradually moved beyond just building agent features and into building the systems around the agent \u2014 evaluations, observability, memory, reliability",  # verbatim
         "I'm still there and not looking to leave just for the sake of moving. I'm exploring roles where I can apply that experience to a broader range of problems, work directly with customers, and grow as an engineer who can own both the technical solution and its business outcome. Heard seems particularly aligned with that."],
     "vname": "Yours",
     "variants": [
         {"name": "B, a tool for builders", "land": "From an assistant for busy people to a tool for people like you.",
          "say": ["Nothing's wrong at alfred_. I've built a lot of the agent and voice side there. What pulls me here is building for developers, people like me, where I can judge the product from my own day and ship to them fast."]}],
     "land": "Not away from alfred_; toward a product you use yourself.",
     "notes": ["Your words from INTRO.md; only the company name changed."]},
    {"id": "next", "title": "What are you looking for next?", "length": "about 40 seconds",
     "when": "Possible.",
     "probes": ["IC or lead?"],
     "say": [
         "Short term, I want to be somewhere the agentic engineering is actually at the frontier \u2014 not a demo, but running against real stakes, where getting it wrong has weight. That's the fastest way I know to get good, seriously good, at this.",  # verbatim
         "Long term, I want to understand this domain and this kind of engineering deeply enough that I can actually lead it \u2014 see where the real bottlenecks are, and push us toward the better one before it costs months. But I don't want that to mean stepping back from the actual work."],  # verbatim
     "vname": "A",
     "variants": [
         {"name": "B, engineer number one", "land": "Own the engine now; lead the team it grows into.",
          "say": ["Short term, to be the first engineer on something I use myself, owning the engine end to end. Longer term, to lead the engineering as the team grows, still building."]}],
     "land": "Frontier agent work now; lead it later, hands in the code.",
     "notes": ["Your goals from INTRO.md."]},
    {"id": "logistics", "title": "Logistics she may ask", "length": "a line each",
     "when": "Possible at the end. Your answers are in chat, not on this page.",
     "probes": ["Where are you based?", "Start date?", "Work authorization?", "Compensation?"],
     "say": [],
     "land": "One sentence each.",
     "notes": ["Location, start date, pay and work authorization: your answers from chat. They are also talking to you while your Amazon loop is in early November; decide what you say about timing."]},
]

QA = []
TABS = ["overview", "prep", "rounds"]

ASK_3C = [
    {"id": "clarify", "title": "While she talks: clarifying", "when": "During her part on Heard. One or two, on her words.",
     "why": "Shows you are mapping the system as she describes it.",
     "how": ["Ask on her words: 'when you said X, do you mean...'"],
     "items": [
         {"to": "Kelly", "q": "With several sessions running, how does a spoken reply find the right one: is it explicit, or inferred from what was just said?",
          "loop": "When she mentions Parrot or replies.", "why": "Routing is a design problem you have solved in MockFlow with an explicit transition tool."},
         {"to": "Kelly", "q": "Who's on the team today, and what does the engine need most: the narration quality, the phone side, or more agents?",
          "loop": "When she mentions the team.", "why": "Where engineer number one starts."}]},
    {"id": "collab", "title": "Before the end: collaborating", "when": "When she asks for questions. Pick one.",
     "why": "Thinks with her about a real problem.",
     "how": ["Ask one, listen, then say in a sentence how you have handled the same thing."],
     "items": [
         {"to": "Kelly", "q": "Deciding what's worth saying is the core. How do you know it's getting better: is there a set of real sessions you replay, and how do you count a missed blocker against an interruption for noise?",
          "loop": "First choice.", "why": "Your eval bench: replay real conversations before a change ships."},
         {"to": "Kelly", "q": "Where do you want the line on voice acting on the machine: approvals from the phone, running commands? What has to be true before a spoken yes does something?",
          "loop": "If she talks about approvals or Parrot.", "why": "Your gate's ask verdict: the model reads the yes, code acts on it, once."},
         {"to": "Kelly", "q": "What's the latency budget from an agent event to first audio, and where does the time go today?",
          "loop": "If she talks about speed.", "why": "Your voice pipeline work."}]},
    {"id": "contribute", "title": "At the end: next steps", "when": "The last two minutes.",
     "why": "Leaves you knowing where you would add.",
     "how": ["Two at most, then close in your words from INTRO.md: \u201cReally appreciate you taking the time today. This was helpful \u2014 honestly, the more I hear about what the team is working on, the more excited I am about the fit. Looking forward to hearing about next steps whenever you have them.\u201d"],
     "items": [
         {"to": "Kelly", "q": "What does success look like for engineer number one in the first 90 days?", "loop": "First.", "why": "Your question from INTRO.md."},
         {"to": "Kelly", "q": "What does the process look like from here, and the rough timeline?", "loop": "Last.", "why": "Your question from INTRO.md."}]},
]
ASK = []
TRAPS = []

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "45 seconds", "seconds": 45, "ref": "#say-intro"},
    {"id": "voice", "prompt": "Tell me about the voice agent you built.", "target": "90 seconds", "seconds": 90, "ref": "#say-voice"},
    {"id": "why-heard", "prompt": "Why Heard?", "target": "30 seconds", "seconds": 30, "ref": "#say-why-heard"},
]
