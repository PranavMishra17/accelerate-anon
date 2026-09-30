"""River, founder call: Founding Engineer (likely). Date to be set: Pranav books it from Tarek's link.

Tarek Abillama, co-founder and CEO, reached out after his co-founder Sam suggested it. River sells
Liv, an AI account executive that joins live sales calls on video, demos the product through a
browser agent, handles objections and closes smaller deals. On site in New York.

Facts about River are only what is in SOURCES, checked 2026-09-29. Another company named River AI
shows up in search; it is unrelated. Pranav's facts come from his existing prep and the master
reference. Logistics answers (relocation, pay, work authorization, start date) stay in chat.
"""

LOOP = {
    "id": "river",
    "title": "River, founder call",
    "subtitle": "Tarek Abillama, CEO",
    # Brand colour for the hub's wordmark. River's blue: #006BFF on rivergtm.com's buttons and
    # badges (the most used accent in its markup). 4.6:1 on the light surface, and the wordmark
    # is large. brand_dark: the same hue lightened to 5.8:1 on the dark surface.
    "brand": "#006BFF", "brand_dark": "#5C9DFF",
    "when_iso": "",   # empty: the hub shows "Upcoming, date to be set"
    "when": "Date to be set: book from Tarek's link",
    "who": ("Tarek Abillama, co-founder and CEO. His brother Sam Abillama is the other co-founder and suggested "
            "the call. Third company for Tarek; with Sam he built Masterboard, a connected chessboard."),
    "format": ("A founder call on video. Expect him to pitch River and test whether you can own real-time, "
               "production systems with little help. No coding is likely on a first call."),
    "bar": ("A founder hiring engineer three or four. He wants range, speed and ownership, and someone who has "
            "shipped real-time voice. Talk like a builder: what you shipped, how fast, what broke."),
    "plan_kicker": "Before the call",
    "extra": ("River's site, the postings and the founder's writing are under <b>What this rests on</b> on the Prep tab."),
}

SESSION_IDS = []

PREP_LEAD = ("A founder call. Read how to show up, then say the intro, why River and the voice story out loud. "
             "The bank below is for his technical follow-ups.")

SHOW_UP = [
    ("Know the product in one line.", "Liv, an AI account executive that joins live sales calls on video, demos the product through a browser agent, and closes deals under about $25K."),
    ("Lead with MockFlow-AI.", "Real-time voice on LiveKit and WebRTC, Deepgram for speech, under 400 ms end to end. Their posting names LiveKit and WebRTC."),
    ("Then alfred_ for production.", "An agent 5,000-plus people use, and the evals and reliability under it. River's agent talks to paying prospects; a wrong answer costs a deal."),
    ("Founders sell too.", "Let him pitch. Ask one follow-up on what he says; interest counts."),
    ("Logistics: one line each.", "In office in New York, pay, work authorization, start date: your answers are in chat."),
    ("Close with next steps.", "Ask what the process looks like, and offer to walk through MockFlow-AI or a demo."),
]

STORY_BLURB = "Your intro, why River, the real-time voice story, and logistics."

# Every outside link, checked 2026-09-29.
SOURCES = [
    {"label": "River: company site", "url": "https://rivergtm.com",
     "why": "Liv, the AI account executive: inbound demos, objections and closing under about $25K, larger deals handed to people. Names founders of Ramp, Kalshi, Lean and Hearth as backers."},
    {"label": "Founding Engineer posting (Jack & Jill)", "url": "https://www.jackandjill.ai/jobs/engineer/founding-engineer-170k-220k-equity-at-river-b9f2a2ae-8c33-45a2-8653-56fc6370e0a4",
     "why": "$170K to $220K plus equity. 5+ years running production backends with on-call, real-time or WebRTC depth. TypeScript, Node, WebRTC, inference serving, CI/CD, observability."},
    {"label": "Founding Engineer posting (Workfindy)", "url": "https://workfindy.com/jobs/573b10f3-171b-40fc-bf4f-123f2b60cf3b",
     "why": "The live call: speech, a rendered avatar, several LLMs and a live browser-use agent. Adds Next.js, Postgres, Redis and LiveKit."},
    {"label": "Product Engineer posting and company facts (Paraform)", "url": "https://www.paraform.com/share/river/cmsoqj32l00070dl5jea9fndz",
     "why": "$2M pre-seed; a team of three; weekly revenue from $4,000 to $50,000 within days of launch (their claim). Founders moving to New York; in office four days minimum."},
    {"label": "River on Product Hunt", "url": "https://www.producthunt.com/products/river-9",
     "why": "Launched July 2026, fifth of the day. Multilingual; follow-up by email and WhatsApp."},
    {"label": "Tarek Abillama: chess lessons for fundraising and acquisitions (Entrepreneur UK, 27 August 2026)", "url": "https://uk.entrepreneur.com/finance/chess-lessons-for-fundraising-and-acquisitions",
     "why": "His third startup, two exits; Masterboard and Masterspace with Sam. Raise from strength, keep momentum, build for the long term."},
    {"label": "AI voices and the TCPA (Wiley)", "url": "https://www.wiley.law/alert-FCC-Extends-Regulatory-Reach-Over-AI-Announces-TCPA-Restrictions-Cover-AI-Generated-Voices-in-Outbound-Calls",
     "why": "Outbound AI calls need written consent. River's inbound, video-first design mostly avoids this."},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. Land on real-time voice and production agents.",
     "probes": ["What does alfred_ do?", "What have you built in voice?", "Why are you looking?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",  # verbatim
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad — backend, AI, infrastructure, and product work all kind of blended together.",  # verbatim
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation — things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",  # verbatim
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",  # verbatim
         "And on the side I've built real-time voice agents, a mock interview platform on LiveKit, which is why River caught my eye: a live agent in front of a paying customer is exactly where reliability matters most."],
     "land": "Production agents plus real-time voice; River is both at once.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged. Only the last line is new."]},

    {"id": "why-river", "title": "Why River?", "length": "about 60 seconds",
     "when": "After his pitch, or straight after the intro.",
     "probes": ["What do you know about us?", "Why a team of three?", "Why sales?"],
     "say": [
         "Honestly, it's the hardest version of a live agent. Liv isn't answering a support question; it's on a video call with a buyer, talking, showing the product through a browser agent and handling objections, all at once and in real time. If it stalls or gets a fact wrong, you lose the deal.",
         "That's the combination I've been working on from two sides: real-time voice with LiveKit, and making a production agent reliable enough that people trust it with their email.",
         "And it's measured in revenue, which I like. A sales agent either closes or it doesn't.",
         "Being engineer number three or four is the other part. I've been a founding engineer and I like owning the first version."],
     "swaps": [{"when": "If he asks what stood out", "line": "That Liv hands bigger deals to a person instead of guessing. Knowing when not to act is most of what makes an agent trustworthy."}],
     "land": "The hardest live agent, measured in revenue, at the stage I like.",
     "notes": ["Facts from River's site and postings (Sources). Say 'from what I read'."],
     "never": ["Don't quote their revenue figures as fact: 'you mentioned' or 'I read'."]},

    {"id": "voice", "title": "Tell me about your real-time voice work", "length": "about 90 seconds",
     "when": "The technical story he will care about most.",
     "probes": ["How did you get the latency down?", "How do you handle interruptions?", "How did the agent know when to move on?"],
     "say": [
         "MockFlow-AI is a real-time voice mock interview platform. It runs on LiveKit's agents SDK over WebRTC, with Deepgram for speech to text, a small GPT model, OpenAI's text to speech, and Silero for voice activity detection.",
         "End to end it's under 400 milliseconds, about five times faster than the polling version I started with, mostly from moving to streaming over WebSockets.",
         "The interesting part was control. Each interview is a state machine: welcome, intro, experience, closing. The model can't drift to the next stage on its own; it has to call a transition tool, with a minimum number of questions first and a quality score to exit early. A background timer forces the move if a stage runs long.",
         "And the edge case that took the most care: a transition firing while the user is still talking. I queue an acknowledgement so it hands over cleanly instead of cutting them off.",
         "Each session gets its own worker, and users bring their own API keys, encrypted at rest and never logged."],
     "swaps": [{"when": "If he asks how it maps to River", "line": "Liv has the same shape: a live conversation that has to move through stages, discovery, demo, objections, close, without the model wandering or talking over the buyer."}],
     "land": "Under 400 ms, explicit tool-driven stages, and clean handoffs mid-speech.",
     "notes": ["From the master reference, section 5.1. Live at mockflow-ai.onrender.com."]},

    {"id": "logistics", "title": "Logistics he may ask", "length": "a line each",
     "when": "Your answers are in chat, not on this page.",
     "probes": ["Would you relocate?", "Four days in office in New York?", "Pay?", "Work authorization?", "Start date?"],
     "say": [],
     "land": "Say each once, then back to the role.",
     "notes": ["**Relocation and office:** you've already told Tarek by email. Say it again in one line.",
               "**Pay:** the Founding Engineer posting lists $170K to $220K plus equity. Your number from chat.",
               "**Work authorization and start date:** your answers from chat, one sentence each."]},
]

QA = [
    {"group": "Real-time agents", "blurb": "The follow-ups a founder building live agents asks.", "items": [
        {"q": "How would you keep a live sales agent from saying something wrong?", "short": "Wrong answers, live", "tests": "Reliability thinking for a live agent.",
         "a": ["Answer from verified data only, through tools, never from the model's memory; I did that for a customer assistant at WheelPrice. Code checks anything with consequences, like price or terms, before it's said.",
               "And an eval set built from real calls: every bad call becomes a case the next version has to pass. That's what I built at alfred_, a little over a hundred cases from real failures."],
         "land": "Tools for facts, code for consequences, real failures as tests."},
        {"q": "How do you handle latency with several models in the loop?", "short": "Latency", "tests": "Real-time depth.",
         "a": ["Stream everything: speech in, tokens out, speech out, so no stage waits for the whole of the one before. Keep the model on the critical path small, and move the heavy work, like the browser agent, off it, with something to say while it runs.",
               "Then measure each stage separately. In MockFlow-AI most of the win was streaming instead of polling."],
         "land": "Stream every stage, small model on the critical path, measure each hop."},
        {"q": "How would you evaluate Liv's calls?", "short": "Evaluating calls", "tests": "Your strongest area, applied to theirs.",
         "a": ["Two layers. Outcomes: booked, closed, escalated, and where calls drop. And behaviour: a scanner over transcripts that flags wrong facts, talking over the buyer, missed objections, turned into a regression set.",
               "Then replay: run a new version against recorded calls before it ships, so you can say which cases got better and which got worse."],
         "land": "Outcomes, flagged behaviours as tests, replay before shipping."},
    ]},
]

QA_ORDER = ["Real-time agents"]

ASK_3C = [
    {"id": "tarek", "title": "For Tarek", "when": "At the end, or when he invites questions.",
     "why": "Founders like questions about the hard problem and the business.",
     "how": ["One or two, then listen."],
     "items": [
         {"to": "Tarek", "q": "What breaks most often on a live call today?", "loop": "First.", "why": "The real problem you'd own."},
         {"to": "Tarek", "q": "How do you decide when Liv hands a deal to a person?", "loop": "If he talks about the product.", "why": "Where trust is won or lost."},
         {"to": "Tarek", "q": "What would the first engineer hire own in the first three months?", "loop": "Middle.", "why": "Scope."},
         {"to": "Tarek", "q": "Are you staying on video, or moving to phone as well?", "loop": "If there's time.", "why": "Product direction; phone brings TCPA."},
         {"to": "Tarek", "q": "What does the rest of the process look like?", "loop": "Last.", "why": "Practical."}]},
]
ASK = []

TRAPS = [
    ("The wrong River", "River AI, with a large round, is a different company."),
    ("Quoting their numbers as fact", "Revenue and customer logos are their claims."),
    ("Overselling voice", "MockFlow-AI is a side project, live but small. Say so; alfred_ is the production proof."),
    ("Raising logistics first", "Only if he asks."),
    ("Funding, crunch, colleagues' names", "Never, about alfred_."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "why-river", "prompt": "Why River?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-river"},
    {"id": "voice", "prompt": "Tell me about your real-time voice work.", "target": "90 seconds", "seconds": 90, "ref": "#say-voice"},
]

MOCK_HOW = "Say 'run the River mock' in chat: Tarek pitches River, then probes real-time and reliability."
