"""Overjoy, Product Engineer (New York). Round 1: a 30-minute call with Jun Kwak, co-founder and CTO, on
Thursday 22 October 2026 (time picked on his Calendly).

Jun shares Overjoy and the engineering team, then digs into the background, one project, and what comes next.
No technical prep beyond the story: this page is the intro, the story, the projects and the questions, kept
short on purpose (his request). The project stories about alfred_ internals (V8, working memory) and MockFlow
live in the gitignored private/loops/overjoy.js and show on the Prep tab when present.

Facts about Overjoy come from SOURCES, every link opened 21 October 2026. The interview process and recent
joiners: nothing public was found. Pranav's words are from E:/_Resume-Curator/INTRO.md, verbatim where marked;
the lines naming a company are adapted to Overjoy and say so. Logistics answers (location, relocation, pay,
work authorization, start date) stay in chat.
"""

LOOP = {
    "id": "overjoy",
    "title": "Overjoy, Product Engineer",
    "company": "Overjoy",
    "subtitle": "Round 1: 30 minutes with Jun Kwak, co-founder and CTO",
    # #766AF0 is the violet in overjoy.ai's inline styles (read 2026-10-21); #EADDFF from the same page for dark.
    "brand": "#766AF0", "brand_dark": "#EADDFF",
    "when_iso": "",
    "when": "Thursday 22 October, 30 minutes (book the time on Jun's Calendly)",
    "who": ("Jun Kwak, co-founder and CTO (co-founded Overjoy with Alex Han; earlier at Google, Snap and Robinhood per one "
            "third-party review). Also on the email: Ishaan (likely Ishaan Nagpal, Head of Engineering) and Lyza Jacobo, recruiting ops."),
    "format": ("Thirty minutes. Jun tells you about Overjoy and the engineering team, then digs into your background, one project "
               "you've worked on, and what you're looking for next. A conversation, not a technical screen."),
    "bar": ("Can you own a feature end to end, have you built agents that do real work in production, and do you want the "
            "intensity of a small team? Lead with V8: one gate, a measured runtime win, agents and humans handing work back and forth."),
    "plan_kicker": "Before the call",
    "extra": ("<b>Thirty minutes of prep, in this order.</b> "
              "1. Prep tab: your intro out loud with the timer (45 seconds). "
              "2. Your projects: V8 out loud (90 seconds), then the working-memory short version. "
              "3. Read the three tiers of questions and pick one from each. "
              "4. Skim the Pydantic case study below: it is how their agent team works, and it is your world."),
}

SESSION_IDS = []

PREP_LEAD = "Your intro, your projects, why Overjoy, and the questions to ask, in three tiers."

SHOW_UP = [
    ("Lead with outcomes, not features.", "They sell won accounts, not software. Say what changed for users: 100% of SMS on V8, a cold boot cut by more than half, a model that can no longer confirm an action on its own."),
    ("Agents plus humans is their core.", "Their agents work alongside a services team. Your gate's ask verdict is exactly that handoff: the agent stages the action, a person says yes, code runs it once."),
    ("Their stack is your stack's cousin.", "Python and FastAPI, Postgres, Pydantic AI with Logfire, Temporal, GCP. You ran agents on Postgres queues with an eval bench and a priced ledger; say how that maps, and that you'd like to learn Temporal."),
    ("Want the intensity, plainly.", "The posting says it isn't a 9-to-5 and the autonomy cuts both ways. Say you want that: you already own production systems end to end."),
    ("Thirty minutes goes fast.", "Two or three sentences per answer, then stop. Keep five minutes for your questions."),
]

STORY_BLURB = "Your intro, why Overjoy, why leave alfred_, what you want next, and logistics."

# Every outside link opened 2026-10-21.
SOURCES = [
    {"label": "Overjoy: About", "url": "https://www.overjoy.ai/about",
     "why": "The sales department of the future: people and AI agents as one department; founders Alex Han and Jun Kwak; the team (19 listed)."},
    {"label": "Overjoy: AI agents", "url": "https://www.overjoy.ai/features/ai-agents",
     "why": "Six agents: conversion, reorder, Faire commission tracking, order processing, live intent scoring, wholesale marketing. It does not say when a human takes over."},
    {"label": "Pydantic case study: Overjoy (29 Apr 2026)", "url": "https://pydantic.dev/case-studies/overjoy",
     "why": "Five engineers run the stack; replaced LangChain and LangSmith with Pydantic AI and Logfire; debugging from half a day to minutes; caught a 20x cost spike; evals on production data ('I just label 100 rows')."},
    {"label": "Overjoy blog: the rename from Oversee (Jan 2025)", "url": "https://blog.overjoy.ai/overjoy-announcement/",
     "why": "Started as Oversee, lead generation for wholesale; renamed Overjoy in January 2025 as an AI-powered CRM for consumer brands; written by Jun."},
    {"label": "Overjoy blog: case studies", "url": "https://blog.overjoy.ai",
     "why": "Sol Soils: a two-person team opened 100 wholesale accounts without a sales rep; Musee: 84 new accounts in 9 months; Craftmix: $32K new revenue."},
    {"label": "Wellfound: Senior Backend Engineer at Overjoy", "url": "https://wellfound.com/jobs/4522317-senior-backend-engineer",
     "why": "A sibling posting: grew 5x in 12 months; Temporal or FastAPI in production as a bonus."},
]

COMPANY = [
    "Overjoy runs wholesale sales for small consumer brands: finding the right retailers, reaching out, closing the account and keeping it reordering, with people, AI agents and the CRM it built for that job. Founded in 2022 in New York as Oversee (lead generation for wholesale), renamed Overjoy in January 2025, now 'an AI-native sales company' that sells the outcome. 800+ brands; Simply Gum, Sol Soils, Musee and Vitruvi are named customers.",
    "Small and lean: about 19 people on the About page, five engineers on the stack. Backed by Bessemer, OSV and Floodgate (about $3.2M seed per a third-party source), and six customers invested. A sibling posting says it grew 5x in a year.",
    "How the agent team works (the Pydantic case study, April 2026): they replaced LangChain and LangSmith with Pydantic AI and Logfire, so one dashboard shows traces, token cost and eval results; debugging went from half a day to minutes; they caught an agent whose cost spiked 20x; and they improve agents by labelling about 100 production rows and letting the agent iterate toward a quality bar. That is your eval bench and your V8 ledger, in their words.",
    "The open question for you to probe: their agents page lists six agents and says nothing about when a human takes over. That handoff is your strongest story.",
]

POSTING = {
    "url": "https://www.overjoy.ai/",
    "lead": "Product Engineer: across the stack, close to the founders, shipping agents that find retailers, work the pipeline and capture orders alongside the services team.",
    "facts": [["Location", "New York City"], ["Range", "130K to 220K USD"], ["Stack", "Python/FastAPI, Postgres, React/TypeScript"],
              ["Agents", "Pydantic AI, Temporal"], ["Infra", "Docker, App Engine, GCP"]],
    "does": [
        "Hard problems in data pipelines, AI-driven workflows and scale.",
        "Features end to end across the stack, from scope to deploy.",
        "REST APIs for CRM, Inbox, Campaigns and Automations.",
        "Production agents (Pydantic AI, Temporal) that find retailers, work the pipeline and capture orders, alongside humans.",
        "Integrations: Shopify, Faire, WooCommerce, QuickBooks, Gmail.",
        "Debug production, support the customer team, shape product with the founders.",
    ],
    "wants": [
        "2+ years of software engineering.",
        "Own projects end to end.",
        "Fluent in Python/FastAPI, Postgres or React/TypeScript, keen to learn the rest.",
        "Clean, maintainable code, speed balanced with quality.",
        "Thrives early-stage: many hats, drives own roadmap.",
    ],
}

ROUNDS = [
    {"title": "Round 1: call with Jun Kwak, co-founder and CTO",
     "when": "Thursday 22 October 2026, 30 minutes",
     "who": "Jun Kwak (Ishaan and Lyza Jacobo on the invite email)",
     "format": "Overjoy and the engineering team, then your background, one project, and what you're looking for next.",
     "outcome": "Not yet held.",
     "notes": ["From Lyza's email: Jun 'will share more about Overjoy and the engineering team, and spend some time digging into your background, a project you've worked on, and what you're looking for next.'"],
     "asked": []},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 45 seconds",
     "when": "First, almost certainly. The short one, then stop.",
     "probes": ["What do you own at alfred_?", "What does a founding LLM engineer do day to day?"],
     "say": [
         "I'm currently a founding LLM engineer at alfred_, where I work across AI agent reliability, memory architecture, evaluation infrastructure, and automation for a product with 5,000-plus active users. A big part of my work has been taking ambiguous problems and building the systems underneath them that make AI actually work reliably in production.",  # verbatim
         "Before that, I worked at an early-stage startup called WheelPrice and did AI research at UIC. What I enjoy most is working across the stack, understanding a real problem, and building something that solves it end to end. That's what caught my attention about Overjoy: agents that do the actual sales work, alongside people, where the result is a won account, not a feature."],
     "swaps": [{"when": "If he asks for one line", "line": "I build the systems under production agents: memory, evals, reliability, and the gate that decides what an agent is allowed to do."}],
     "land": "Production AI reliability, end to end, and why Overjoy: agents that do real work for an outcome.",
     "notes": ["The first paragraph and the first two sentences of the second are yours from INTRO.md, unchanged. The last sentence replaces the Mercor line: make it yours."]},
    {"id": "why-overjoy", "title": "Why Overjoy?", "length": "about 30 seconds",
     "when": "Likely, after he describes the company.",
     "probes": ["What do you know about us?", "Why a small team?", "Why sales and wholesale?"],
     "say": [
         "Three things. You've already got pull: 800 brands, and the work has moved from tools for people to agents doing the work, so the hard problems are real ones, reliability, handoffs, data correctness. Second, it's agents alongside humans for an outcome, which is the part I've spent the last year on: deciding what an agent can do alone and what it has to ask a person first. And third, a small team where I'd own features end to end, across the stack."],
     "swaps": [
         {"when": "If he asks what you know", "line": "You started as Oversee, lead generation for wholesale, became Overjoy last year, and now run the whole wholesale motion for brands with a services team and agents. And from the Pydantic case study, five engineers, Pydantic AI and Logfire, and evals on production data."},
         {"when": "If he asks why not a bigger company", "line": "I do my best work when I own the whole thing and can see the outcome. Here the outcome is a won account, and that's a very honest metric."}],
     "vname": "A",
     "variants": [
         {"name": "B, the work itself", "land": "The agent does the job; you build where it hands to a person.",
          "say": ["Honestly, it's the shape of the work. Your agents don't help a salesperson, they do the job: find the retailer, follow up, take the order, and someone on your team steps in where judgment matters.",
                  "That split, what the agent does alone and what it hands to a person, is pretty much what I've spent this year building at alfred_. I'd like to do it where the result is an order on the books."]},
         {"name": "C, the stage", "land": "Foundations under real pull, owned end to end, with an outcome you can read.",
          "say": ["I think it's the stage you're at. You're past finding the product, and now it's the foundations under it: the pipelines, the integrations, the agents that have to keep working every day for 800 brands.",
                  "With a small team that means owning things end to end, which is how I work best. And the result is simple to read: did the brand get the account or not."]}],
     "land": "Real pull, agents plus humans for an outcome, and end-to-end ownership.",
     "notes": ["Written in your voice from the research; your INTRO.md has no Overjoy line yet. Make it yours."]},
    {"id": "leave", "title": "Why leave alfred_?", "length": "about 30 seconds",
     "when": "If asked.",
     "probes": [],
     "say": [
         "I\u2019m not looking to leave because there\u2019s something fundamentally wrong with alfred_. The reason I'm exploring is more about the direction I want to take my career",  # verbatim
         "I've learned a lot at alfred_ and have had the opportunity to own important parts of a production AI product from the ground up. I've gradually moved beyond just building agent features and into building the systems around the agent \u2014 evaluations, observability, memory, reliability",  # verbatim
         "I'm still there and not looking to leave just for the sake of moving. I'm exploring roles where I can apply that experience to a broader range of problems, work directly with customers, and grow as an engineer who can own both the technical solution and its business outcome. Overjoy seems particularly aligned with that."],
     "vname": "Yours",
     "variants": [
         {"name": "B, short", "land": "From the systems around an agent to a result you can see.",
          "say": ["Nothing's wrong at alfred_; I've owned a lot of the production system there. What I want next is to put that to work where the agent's output is a business result I can see, an account or an order, and where I own more of the stack around it, the integrations and the data, not only the agent."]},
         {"name": "C, the other side", "land": "Real customers and integrations, on a team that sells the outcome.",
          "say": ["I've spent the last year on the systems around the agent: the gate, memory, evals. The part I want more of is the other side of it: real customers, real integrations, and seeing the result in their numbers.",
                  "That fits a small team selling an outcome better than where I am now."]}],
     "land": "Not away from alfred_; toward customers and owning the outcome.",
     "notes": ["Your words from INTRO.md; only the company name in the last sentence changed (it said Mercor's Enterprise team)."]},
    {"id": "next", "title": "What are you looking for next?", "length": "about 45 seconds",
     "when": "Jun said he'll ask this. Short term, then long term.",
     "probes": ["Where do you want to be in a few years?", "IC or lead?"],
     "say": [
         "Short term, I want to be somewhere the agentic engineering is actually at the frontier \u2014 not a demo, but running against real stakes, where getting it wrong has weight. That's the fastest way I know to get good, seriously good, at this.",  # verbatim
         "In the first few months, I'd want to get inside the codebase and the domain fast, start pulling weight on the agent side quickly since that's where I'm strongest, and be someone the team can hand a hard, ambiguous problem to without much hand-holding.",
         "Long term, I want to understand this domain and this kind of engineering deeply enough that I can actually lead it \u2014 see where the real bottlenecks are, and push us toward the better one before it costs months. But I don't want that to mean stepping back from the actual work."],  # verbatim
     "vname": "A",
     "variants": [
         {"name": "B, concrete first months", "land": "Own features end to end now; call the direction later, still building.",
          "say": ["Short term, a team small enough that I own features end to end, where the agents run against something real every day. In the first months I'd want to get into the pipelines and integrations quickly and take one agent from good to reliable.",
                  "Longer term, to be the person who can call the technical direction on how agents and people share the work, and still build it."]},
         {"name": "C, three things", "land": "Real stakes, end-to-end ownership, people to learn from.",
          "say": ["Honestly, three things. Real stakes, so the agent's mistakes cost something and I have to get it right. Ownership end to end, from scoping to deploy. And people I can learn from.",
                  "Over a few years I'd like to lead this kind of engineering, but staying hands-on."]}],
     "land": "Frontier agent work with real stakes now; lead it later, hands still in the code.",
     "notes": ["Your goals from INTRO.md. The second paragraph is your short-term text with 'the clinical domain' (written for a clinical company) changed to 'the domain' and 'agent and eval side' to 'agent side'."]},
    {"id": "logistics", "title": "Logistics they may ask", "length": "a line each",
     "when": "Possible at the end of a founder call. Your answers are in chat, not on this page.",
     "probes": ["In person in New York?", "Start date?", "Work authorization?", "Compensation expectations?"],
     "say": [],
     "land": "One sentence each, then back to the work.",
     "notes": ["Location, relocation, start date, pay and work authorization: your answers from chat."]},
]

QA = []
TABS = ["overview", "prep", "rounds"]

ASK_3C = [
    {"id": "clarify", "title": "While he talks: clarifying", "when": "During his part on Overjoy and the team. One or two, short, on what he just said.",
     "why": "Shows you're mapping the system as he describes it, and gets you the facts the later questions need.",
     "how": ["Ask on his words, not from a list: 'when you said X, do you mean...'"],
     "items": [
         {"to": "Jun", "q": "When the agents and the services team hand work back and forth, where's the line today: does the agent stage an action for a specialist to approve, or does the specialist take over the account?",
          "loop": "When he mentions agents and people.", "why": "Their agents page doesn't say; it's your V8 story's home ground."},
         {"to": "Jun", "q": "When you say you sell the outcome, what's the unit: accounts opened, first orders, or reorders?",
          "loop": "When he mentions pricing or the model.", "why": "Tells you what an agent change has to move."},
         {"to": "Jun", "q": "Is Temporal running the always-on agents today, or mostly the syncs and order capture?",
          "loop": "When he mentions the stack.", "why": "Where durability matters to them, and where you'd start."}]},
    {"id": "collab", "title": "Before the end: collaborating", "when": "When he asks if you have questions, or with about eight minutes left. Pick one.",
     "why": "Thinks with him about a real problem, the way you would as a teammate.",
     "how": ["Ask one, listen, then say in a sentence how you've handled the same thing."],
     "items": [
         {"to": "Jun", "q": "Ishaan's Pydantic write-up mentions labelling about a hundred production rows and letting the agent iterate toward a bar. When you sell the outcome, what does an agent change have to move before it ships, and how do you tell a better agent from a lucky batch of leads?",
          "loop": "First choice.", "why": "Your eval bench and replay story fit straight in."},
         {"to": "Jun", "q": "Across Shopify, Faire, QuickBooks and Gmail, what breaks most in production: API drift, retries duplicating emails or orders, or workflow versioning? And how do you keep order capture idempotent?",
          "loop": "If he talks about integrations.", "why": "Your idempotency keys and intent rows from V8."},
         {"to": "Jun", "q": "To get to know the product, what are some recent pain points you've solved, and some that are ongoing work?",
          "loop": "Safe fallback.", "why": "Your question from INTRO.md, spelling fixed."}]},
    {"id": "contribute", "title": "At the end: contributing", "when": "The last two or three minutes.",
     "why": "About the role, the team and what's next, so you leave knowing where you'd add.",
     "how": ["Two at most, then close, in your words from INTRO.md: “Really appreciate you taking the time today. This was helpful — honestly, the more I hear about what the team is working on, the more excited I am about the fit. Looking forward to hearing about next steps whenever you have them.”"],
     "items": [
         {"to": "Jun", "q": "What does success look like for this role in the first 90 days?",
          "loop": "First.", "why": "Your question from INTRO.md."},
         {"to": "Jun", "q": "How has the engineering team changed as you went from a platform to running the sales process yourselves, and how do you want it to work as it grows?",
          "loop": "Second.", "why": "Your culture question from INTRO.md, finished for Overjoy."},
         {"to": "Jun", "q": "What does the full interview process look like from here, and the rough timeline?",
          "loop": "Last.", "why": "Your question from INTRO.md."}]},
]
ASK = []
TRAPS = []

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "45 seconds", "seconds": 45, "ref": "#say-intro"},
    {"id": "v8", "prompt": "Tell me about a project you've worked on.", "target": "90 seconds", "seconds": 90, "ref": "#say-v8"},
    {"id": "next", "prompt": "What are you looking for next?", "target": "45 seconds", "seconds": 45, "ref": "#say-next"},
]

