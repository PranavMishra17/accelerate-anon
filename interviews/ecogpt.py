"""EcoGPT, Founding Engineer (Applied AI / AI Agents), New York. Round 1: a call with Ethan Leonard, founder and CEO,
booked on his cal.com after an intro from Azim Malik (Paraform), 21 October 2026. Date to be set.

Page only, kept short (his request, like Home Depot): the company, the role, your intro and story in versions to pick
from, your projects, and questions in three tiers. The project stories about alfred_ internals live in the
gitignored private/loops/ecogpt.js and show on the Prep tab when present.

Facts about EcoGPT come from SOURCES, every link opened 21 October 2026. Many numbers are the company's own and do not
agree with each other; the page says so. Pranav's words are from E:/_Resume-Curator/INTRO.md, verbatim where marked.
Logistics answers (in person, relocation, pay, work authorization, start date) stay in chat.
"""

LOOP = {
    "id": "ecogpt",
    "title": "EcoGPT, Founding Engineer",
    "company": "EcoGPT",
    "subtitle": "Round 1: a call with Ethan Leonard, founder and CEO",
    # #1473e6 is --accent in ecogpt.com's stylesheet (read 2026-10-21); a lighter blue for dark mode.
    "brand": "#1473E6", "brand_dark": "#7FB0F0",
    "when_iso": "",
    "when": "Date to be set: book a slot on Ethan's cal.com (you offered 9 to 10 AM or after 12 PM ET)",
    "who": ("Ethan Leonard, founder and CEO (his GitHub profile lists five on the team). Azim Malik of Paraform, who referred you, "
            "stays on the thread."),
    "format": ("A first call with the founder, likely 30 minutes: what EcoGPT is building and the role, then your background and "
               "the agent work. A conversation, not a technical screen; expect product questions."),
    "bar": ("Have you built agents beyond API calls (tools, memory, retrieval, evals) and shipped them to real users, can you own a "
            "feature from design to launch alone, and do you know what it costs to serve? Lead with V8 and working memory; have "
            "the open-model work ready."),
    "plan_kicker": "Before the call",
    "extra": ("<b>Twenty-five minutes of prep, in this order.</b> "
              "1. Use the product for ten minutes on your phone: chat, memory, search, the trees page. "
              "2. Prep tab: your intro out loud with the timer (45 seconds). "
              "3. Your projects: V8 out loud, then working memory short. "
              "4. Pick one question from each tier."),
}

SESSION_IDS = []

PREP_LEAD = "Your intro, why EcoGPT, your projects, the open-model question, and the questions to ask, in three tiers."

SHOW_UP = [
    ("Use the product first.", "A founder of a consumer app will ask what you think of it. Have one thing you liked and one thing you'd fix, from your own use."),
    ("Agents beyond API calls.", "The posting says it plainly. Your proof: the V8 gate, working memory with structural anti-hallucination, the eval bench that replays real conversations."),
    ("Talk about cost per message.", "Hundreds of thousands of free users a day on open models makes serving cost the business. Your prompt-cache numbers and the cold-start cut are the right register."),
    ("Be honest on open models.", "You've worked with Gemma and MedGemma in research and quantized a model for serving; you haven't run a GPU fleet. Say that, then say how you'd learn it."),
    ("Founder pace.", "Small team, in person, intense. Say you want ownership end to end; you already have it."),
]

STORY_BLURB = "Your intro, why EcoGPT, why leave alfred_, what you want next, and logistics."

# Every outside link opened 2026-10-21.
SOURCES = [
    {"label": "EcoGPT: Founding Engineer", "url": "https://ecogpt.com/careers/founding-engineer",
     "why": "The posting: agents, tool use, memory, retrieval, evals; latency, cost and reliability; in person in SoHo."},
    {"label": "EcoGPT: About", "url": "https://ecogpt.com/about",
     "why": "The company's own account: a public benefit corporation, hosting in Google Cloud's Finland region, open models."},
    {"label": "EcoGPT: Trees", "url": "https://ecogpt.com/trees",
     "why": "The tree counter (about 436K on 21 Oct) and the chats-per-tree rate."},
    {"label": "EcoGPT on the App Store", "url": "https://apps.apple.com/us/app/-/id6756059656",
     "why": "Features, plans and reviews (4.8 from about 8.5K ratings); complaints about slow replies and limits."},
    {"label": "Ethan Leonard on GitHub", "url": "https://github.com/ethan-leonard/ethan-leonard",
     "why": "His own profile: about 6M users and about 600K chatting daily, self-reported; the team of five by first name."},
    {"label": "FelloAI: EcoGPT review", "url": "https://felloai.com/ecogpt-review/",
     "why": "A detailed review: free tiers with ads, Pro at about $10 a month, the stack named (Google Cloud, Cloudflare, PlanetScale, Deepgram, OpenRouter)."},
    {"label": "Forklog: green AI or greenwashing?", "url": "https://forklog.com/en/ecogpt-says-it-plants-trees-for-prompts-green-ai-or-greenwashing/",
     "why": "The skeptical case: unnamed models, OpenRouter fallback, the redacted cloud contract, privacy limits."},
    {"label": "VRT NWS (Belgium), 25 Aug 2026", "url": "https://www.vrt.be/vrtnws/nl/2026/08/25/ecogpt/",
     "why": "In Dutch. Journalists asked to sign an NDA before the models were named; audited monthly figures promised, no date."},
]

COMPANY = [
    "EcoGPT is a consumer AI assistant (web, iPhone, Android) with search, images, voice and memory on Pro, that funds tree planting from use: about every 100 chats a tree, through Trees for the Future, with a counter on its site (about 436K trees on 21 Oct). Free with ads, Pro about $10 a month. It runs small open-source mixture-of-experts models (about 5 to 20B active parameters, unnamed) on Google Cloud in Finland, with OpenRouter as the fallback.",
    "Young and self-funded: EcoGPT, Inc. is a Delaware public benefit corporation formed in February 2026. Ethan's GitHub says about 6M users and about 600K chatting daily; the careers page says 5M+; Google Play says 1M+ downloads. The numbers are self-reported and measure different things. A team of about five, hiring a founding engineer, a chief of staff and a marketing associate, in person in SoHo.",
    "The hard parts, which are your opening: serving hundreds of thousands of free users a day on open models makes cost per message the business; quality against frontier models; keeping users once the green angle is familiar; and trust. The press has been skeptical (unnamed models, the fallback provider, ads that see message text while the pitch is privacy-first). The posting's agents, memory and evals would add stored user data, which sharpens the privacy question.",
    "Not verified: profitability, the Europe and Latin America split, Ethan's earlier roles, any co-founder. Ask rather than assume.",
]

POSTING = {
    "url": "https://ecogpt.com/careers/founding-engineer",
    "lead": "Founding Engineer, Applied AI and agents: ship features across the apps and backend, and build the agent stack (tools, memory, retrieval, evals) with the founders.",
    "facts": [["Location", "SoHo, New York, in person"], ["Range", "150K to 250K USD plus 1 to 3% equity"],
              ["Models", "Open-source mixture-of-experts, Google Cloud Finland, OpenRouter fallback"],
              ["Stack (reported)", "Google Cloud, Cloudflare, PlanetScale, Deepgram, Stripe"]],
    "does": [
        "Ship features across the iOS, Android and web apps and the backend.",
        "Build AI systems: agents, tool use, memory, retrieval; multi-agent work and MCP integrations.",
        "Improve model quality with evals; balance latency, cost and reliability.",
        "Scale the backend and database for growth; open models, fine-tuning, inference.",
        "Own architecture through launch, with the founders.",
    ],
    "wants": [
        "A product you shipped that people use.",
        "Strong full-stack or backend skills.",
        "Hands-on with models, ideally agents or harnesses beyond API calls.",
        "Product judgment and independence; projects over degrees; a public GitHub valued.",
    ],
}

ROUNDS = [
    {"title": "Round 1: call with Ethan Leonard, founder and CEO",
     "when": "To be booked on his cal.com",
     "who": "Ethan Leonard (Azim Malik of Paraform on the thread)",
     "format": "The role and what EcoGPT is building, then your background.",
     "outcome": "Not yet held.",
     "notes": ["From Ethan's reply: he'd 'love to chat more about the role and what we're building at EcoGPT.'"],
     "asked": []},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 45 seconds",
     "when": "First, almost certainly. The short one, then stop.",
     "probes": ["What do you own at alfred_?", "Which of your projects is public?"],
     "say": [
         "I'm currently a founding LLM engineer at alfred_, where I work across AI agent reliability, memory architecture, evaluation infrastructure, and automation for a product with 5,000-plus active users. A big part of my work has been taking ambiguous problems and building the systems underneath them that make AI actually work reliably in production.",  # verbatim
         "Before that, I worked at an early-stage startup called WheelPrice and did AI research at UIC. What I enjoy most is working across the stack, understanding a real problem, and building something that solves it end to end. That's what caught my attention about EcoGPT: an assistant people already use every day, where the next step is the agent itself, tools, memory and evals, at a scale where cost matters."],
     "swaps": [{"when": "If he asks for one line", "line": "I build the systems under production agents: memory, evals, reliability, and the gate that decides what an agent is allowed to do."},
               {"when": "If he asks about public work", "line": "My research on small open models working as a team is on GitHub, and MockFlow, an AI mock-interview tool, is in my portfolio."}],
     "land": "Production agent systems, end to end, and why EcoGPT: the agent layer on an assistant at real scale.",
     "notes": ["The first paragraph and the first two sentences of the second are yours from INTRO.md, unchanged. The last sentence is new for EcoGPT: make it yours."]},
    {"id": "why-ecogpt", "title": "Why EcoGPT?", "length": "about 30 seconds",
     "when": "Likely, after he describes the company.",
     "probes": ["What do you think of the product?", "Why consumer?", "Why a team this small?"],
     "say": [
         "A few things. You already have the hard part most AI startups don't: people using it every day, at a scale where every design choice shows up in cost and latency. The next step you're hiring for, agents with tools, memory and evals, is exactly what I've spent the last year building in production.",
         "And it's a tiny team, so I'd own whole features from design to launch, on the apps and the backend. That's how I work best."],
     "vname": "A",
     "variants": [
         {"name": "B, the engineering problem", "land": "Agent quality on open models, at a cost that works for a free tier.",
          "say": ["Honestly, the engineering problem. Making an assistant genuinely useful with memory and tools, on open models, at a cost per message that works for a free tier, is a harder and more interesting problem than doing it on the biggest model with no budget.",
                  "That's the kind of trade-off I like owning: what to cache, what to route to a small model, what to evaluate before it ships."]},
         {"name": "C, the stage", "land": "Past finding users; now the foundations under them.",
          "say": ["I think it's the stage. You've found the users; now it's the foundations under them, the agent layer, memory, evals, and a backend that holds as you grow.",
                  "That's founding-engineer work in the real sense, and it's the part I've done at alfred_."]}],
     "swaps": [{"when": "If he asks what you think of the product", "line": "Say one thing you liked and one thing you'd change, from your own use this week. Not from the reviews."}],
     "land": "Real daily use, the agent layer next, and ownership on a tiny team.",
     "notes": ["Written in your voice from the research; INTRO.md has no EcoGPT line yet. Make it yours.",
               "Keep the green mission to a sentence unless he leads with it; say what you'd build, not what you believe."]},
    {"id": "open-models", "title": "Have you worked with open-source models, fine-tuning or serving?", "length": "about 40 seconds",
     "when": "Likely; the posting lists it. Honest first, then what you have done.",
     "probes": ["Have you fine-tuned a model?", "Have you run GPUs in production?", "Which open models have you used?"],
     "say": [
         "In research, yes. My paper work at UIC was on small open models working as a team: Gemma and MedGemma, from half a billion to 27 billion parameters, recruited as specialist agents that deliberate. On eight medical benchmarks that got to about 77.6% accuracy and ran about 3.1 times faster than frontier models.",
         "On serving, at the UIC lab I put an audio model behind an API with INT8 quantization at 150 milliseconds p95. What I haven't done is run a GPU fleet in production; at alfred_ we call hosted models, and my work there is the layer that makes them cheap and reliable, prompt caching, routing, evals. That's the part I'd bring on day one, and I'd want to go deep on your serving side."],
     "vname": "A",
     "variants": [
         {"name": "B, shorter", "land": "Research on open models, quantized serving; no GPU fleet yet.",
          "say": ["Some. In research I built a multi-agent system on Gemma and MedGemma, small open models that got close to frontier accuracy at about 3.1 times the speed. And I've shipped a quantized model behind an API at 150 milliseconds p95.",
                  "I haven't run GPUs at your scale. I'd learn that fast, and meanwhile the agent and eval layer is where I'd add from the first week."]}],
     "land": "Honest about the gap, concrete about what you've done.",
     "notes": ["From your master reference: SLM-TeamMedAgents (Gemma, MedGemma, 500M to 27B, 77.63% across 8 benchmarks, 3.1x speedup) and INT8 quantization at 150 ms p95. No production fine-tuning is on record: do not claim it."]},
    {"id": "leave", "title": "Why leave alfred_?", "length": "about 30 seconds",
     "when": "If asked.",
     "probes": [],
     "say": [
         "I\u2019m not looking to leave because there\u2019s something fundamentally wrong with alfred_. The reason I'm exploring is more about the direction I want to take my career",  # verbatim
         "I've learned a lot at alfred_ and have had the opportunity to own important parts of a production AI product from the ground up. I've gradually moved beyond just building agent features and into building the systems around the agent \u2014 evaluations, observability, memory, reliability",  # verbatim
         "I'm still there and not looking to leave just for the sake of moving. I'm exploring roles where I can apply that experience to a broader range of problems, work directly with customers, and grow as an engineer who can own both the technical solution and its business outcome. EcoGPT seems particularly aligned with that."],
     "vname": "Yours",
     "variants": [
         {"name": "B, scale", "land": "From thousands of users to hundreds of thousands a day.",
          "say": ["Nothing's wrong at alfred_; I've owned a lot of the production system there. What I want next is the same kind of work at a much bigger scale, where the agent's memory and quality decide whether hundreds of thousands of people come back tomorrow, and where cost per message is a number I own."]},
         {"name": "C, the whole product", "land": "Own the product end to end, apps and backend, with the founder.",
          "say": ["I've spent the last year on the systems around the agent. The part I want more of is the whole product: the app people open, the backend under it, and working directly with a founder on what to build next.",
                  "A team of five is the most direct version of that."]}],
     "land": "Not away from alfred_; toward scale and owning the whole product.",
     "notes": ["Your words from INTRO.md; only the company name in the last sentence changed."]},
    {"id": "next", "title": "What are you looking for next?", "length": "about 45 seconds",
     "when": "Possible. Short term, then long term.",
     "probes": ["Where do you want to be in a few years?", "IC or lead?"],
     "say": [
         "Short term, I want to be somewhere the agentic engineering is actually at the frontier \u2014 not a demo, but running against real stakes, where getting it wrong has weight. That's the fastest way I know to get good, seriously good, at this.",  # verbatim
         "In the first few months, I'd want to get inside the codebase and the domain fast, start pulling weight on the agent side quickly since that's where I'm strongest, and be someone the team can hand a hard, ambiguous problem to without much hand-holding.",
         "Long term, I want to understand this domain and this kind of engineering deeply enough that I can actually lead it \u2014 see where the real bottlenecks are, and push us toward the better one before it costs months. But I don't want that to mean stepping back from the actual work."],  # verbatim
     "vname": "A",
     "variants": [
         {"name": "B, concrete first months", "land": "Ship the first agent feature; grow into leading the engineering.",
          "say": ["Short term, a small team where I own features end to end and they reach a lot of people quickly. In the first months I'd want to ship the first real agent feature, memory or a tool that people actually use, with evals around it so we know it got better.",
                  "Longer term, to lead the engineering as the team grows, still building."]},
         {"name": "C, three things", "land": "Scale, ownership, and a founder to build with.",
          "say": ["Three things, honestly. Real scale, so my decisions show up in usage and cost. Ownership end to end. And working closely with a founder on what to build.",
                  "Over a few years, I'd like to lead this kind of engineering, hands still in the code."]}],
     "land": "Frontier agent work with real stakes now; lead it later, hands still in the code.",
     "notes": ["Your goals from INTRO.md; the second paragraph is your short-term text with the domain left general."]},
    {"id": "logistics", "title": "Logistics he may ask", "length": "a line each",
     "when": "Possible at the end. Your answers are in chat, not on this page.",
     "probes": ["In person in SoHo, five days?", "Start date?", "Work authorization?", "Compensation?"],
     "say": [],
     "land": "One sentence each, then back to the work.",
     "notes": ["Location, relocation, start date, pay and work authorization: your answers from chat."]},
]

QA = []
TABS = ["overview", "prep", "rounds"]

ASK_3C = [
    {"id": "clarify", "title": "While he talks: clarifying", "when": "During his part on EcoGPT and the role. One or two, on his words.",
     "why": "Shows you're mapping the system as he describes it, and gets you the facts the later questions need.",
     "how": ["Ask on his words, not from a list: 'when you said X, do you mean...'"],
     "items": [
         {"to": "Ethan", "q": "When you say agents, what's shipped today and what's next: memory, search as a tool, actions in other apps?",
          "loop": "When he talks about the roadmap.", "why": "Tells you where you'd start and what exists."},
         {"to": "Ethan", "q": "How do you split traffic between your own deployment in Finland and the fallback, and what decides it: load, model, cost?",
          "loop": "When he mentions models or infrastructure.", "why": "Serving cost is the business; this is where it's decided."},
         {"to": "Ethan", "q": "Who's on the team today, and who owns the backend and the models?",
          "loop": "When he mentions the team.", "why": "The five on his GitHub are first names only."}]},
    {"id": "collab", "title": "Before the end: collaborating", "when": "When he asks for questions, or with about eight minutes left. Pick one.",
     "why": "Thinks with him about a real problem, the way you would as a teammate.",
     "how": ["Ask one, listen, then say in a sentence how you've handled the same thing."],
     "items": [
         {"to": "Ethan", "q": "When you swap the underlying model, how do you know the new one is better for your users? Is there an eval set, or is it ratings and retention after the fact?",
          "loop": "First choice.", "why": "Your eval bench story fits straight in: replay real conversations before a change ships."},
         {"to": "Ethan", "q": "With hundreds of thousands of free users a day, what does a message cost you, and which lever matters most: model size, caching, routing, or limits?",
          "loop": "If he talks about growth or cost.", "why": "Your prompt-cache numbers and the cold-start cut."},
         {"to": "Ethan", "q": "Memory makes the assistant better but means storing more about people. How do you want to handle that with privacy as part of the pitch?",
          "loop": "If he raises privacy or memory.", "why": "Your working-memory design; asked as a product question, not a gotcha."}]},
    {"id": "contribute", "title": "At the end: contributing", "when": "The last two or three minutes.",
     "why": "About the role and what's next, so you leave knowing where you'd add.",
     "how": ["Two at most, then close, in your words from INTRO.md: \u201cReally appreciate you taking the time today. This was helpful \u2014 honestly, the more I hear about what the team is working on, the more excited I am about the fit. Looking forward to hearing about next steps whenever you have them.\u201d"],
     "items": [
         {"to": "Ethan", "q": "What does success look like for this role in the first 90 days?",
          "loop": "First.", "why": "Your question from INTRO.md."},
         {"to": "Ethan", "q": "What's the one thing you'd want a founding engineer to take off your plate first?",
          "loop": "Second.", "why": "Founder-specific; tells you the real job."},
         {"to": "Ethan", "q": "What does the process look like from here, and the rough timeline?",
          "loop": "Last.", "why": "Your question from INTRO.md."}]},
]
ASK = []
TRAPS = []

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "45 seconds", "seconds": 45, "ref": "#say-intro"},
    {"id": "v8", "prompt": "Tell me about an agent system you built.", "target": "90 seconds", "seconds": 90, "ref": "#say-v8"},
    {"id": "open-models", "prompt": "Have you worked with open-source models or fine-tuning?", "target": "40 seconds", "seconds": 40, "ref": "#say-open-models"},
]
