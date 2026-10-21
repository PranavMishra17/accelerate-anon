"""The Home Depot, Principal Data Scientist - CX (Req189365), Store Support Center, Atlanta. Round 1: a call with
Kristen Bernal, Senior Recruiting Partner (Marketing and Online Data Science), date set by her calendar invite.

A recruiter screen: background, motivation, fit and logistics. The role: agentic AI for customer self-service
on the Customer Experience Data Science team, with evaluation, reliability and technical leadership. The posting
asks for 10 years of experience; the page prepares an honest answer on level. Project stories about alfred_ live
in the gitignored private/loops/homedepot.js. Facts from SOURCES, every link opened 21 October 2026. Logistics
answers (location, relocation, pay, work authorization, start date) stay in chat.
"""

LOOP = {
    "id": "homedepot",
    "title": "The Home Depot, Principal Data Scientist - CX",
    "company": "The Home Depot",
    "subtitle": "Round 1: recruiter call with Kristen Bernal",
    "brand": "#F96302", "brand_dark": "#FF8A3D",
    "when_iso": "",
    "when": "Date to be set (Kristen is sending the invite)",
    "who": "Kristen Bernal, Senior Recruiting Partner, Marketing and Online Data Science, Corporate Talent Acquisition.",
    "format": "A recruiter call, likely 30 minutes: your background, why this role, level and fit, logistics, and the process from here.",
    "bar": ("Can she put you in front of the hiring manager? She reached out for agentic AI, machine learning and stakeholder work. "
            "Show that the job's core, agents that resolve customer needs with evaluation and reliability behind them, is what you do "
            "every day, and handle the level question calmly."),
    "plan_kicker": "Before the call",
    "extra": ("<b>Twenty minutes of prep.</b> "
              "1. Your intro out loud (45 seconds). "
              "2. Why Home Depot and the level answer: read the versions, pick yours. "
              "3. Your projects: the short V8 version; the eval bench if she asks how you measure quality. "
              "4. Pick one question from each tier."),
}

SESSION_IDS = []

PREP_LEAD = "Your intro, why this role, the level answer, your projects, and questions in three tiers."

SHOW_UP = [
    ("The job is your job.", "The posting's focus is agents that apply 'the reasoning, context, and decision-making patterns used by skilled associates' so customers resolve complex needs themselves, with evaluation (hallucination, groundedness, cost and latency) behind them. That is what you build at alfred_. Say it in their words: intent, the next action, tools and data, evaluation."),
    ("Handle level calmly.", "The minimum is 10 years. Don't volunteer a number against it; describe scope: you own production agent systems end to end as a founding engineer, for 5,000+ users. Then ask how they're thinking about level for this search."),
    ("Know their AI.", "Magic Apron (March 2025), now in all 2,000+ US stores and answering millions of questions a month; conversational AI across SMS, chat and phone and AI voice agents being tested in stores (Google Cloud, January 2026); Blueprint Takeoffs for Pros."),
    ("Stakeholders are a fifth of the job.", "20% business collaboration and 20% project leadership and mentoring. Have one example of working with non-engineers: the founders and the product side at alfred_, deciding what the agent may do alone."),
    ("Logistics stay short.", "Onsite in Atlanta, start date, pay, work authorization: your answers are in chat. One sentence each."),
]

STORY_BLURB = "Your intro, why Home Depot, the level question, why leave alfred_, what you want next, and logistics."

# Every outside link opened 2026-10-21.
SOURCES = [
    {"label": "The posting: Principal Data Scientist - CX (Req189365)", "url": "https://homedepot.wd5.myworkdayjobs.com/CareerDepot/job/STORE-SUPPORT-CENTER-ATLANTA---9090/Principal-Data-Scientist---CX_Req189365",
     "why": "Agentic workflows for customer self-service, evaluation and reliability, technical leadership; onsite in Atlanta; 10 years minimum."},
    {"label": "Home Depot and Google Cloud: agentic AI tools (Jan 2026)", "url": "https://corporate.homedepot.com/news/partnerships/home-depot-and-google-cloud-launch-agentic-ai-tools-help-customers-and-associates",
     "why": "Project-level Magic Apron, conversational AI across SMS, chat and phone, voice agents in test, a materials list builder for Pros."},
    {"label": "Retail Dive: Magic Apron in stores (Sep 2026)", "url": "https://www.retaildive.com/news/the-home-depot-extends-ai-assistance-stores/829240/",
     "why": "All 2,000+ US stores; text, voice and image; millions of questions a month."},
    {"label": "Home Depot: Blueprint Takeoffs (Nov 2025)", "url": "https://corporate.homedepot.com/news/company/home-depot-launches-ai-powered-blueprint-takeoffs",
     "why": "AI material lists and quotes from blueprints for Pros, in days rather than weeks."},
    {"label": "Retail Dive: tech leadership consolidated (2026)", "url": "https://www.retaildive.com/news/home-depot-leadership-tech-innovation/827161/",
     "why": "800 Atlanta tech roles cut in January; store, supply chain and Pro tech consolidated under the CTO, who leads enterprise agentic AI."},
    {"label": "Home Depot: About", "url": "https://corporate.homedepot.com/about",
     "why": "2,300+ stores, about 475,000 associates; the inverted pyramid: customers and front-line associates first."},
]

COMPANY = [
    "The Home Depot is the largest home improvement retailer: 2,300+ stores across the US, Canada and Mexico, about 475,000 associates, and a growing Pro business (SRS in 2024, GMS in 2025). Its culture is the inverted pyramid: customers and front-line associates on top, corporate there to support them.",
    "Its customer AI is moving from answers to actions. Magic Apron, launched in March 2025, answers how-to and product questions; with Google Cloud in January 2026 it became project-level, and Home Depot added conversational AI across SMS, chat and phone and began testing AI voice agents in stores. By September 2026 Magic Apron was in all 2,000+ US stores, answering millions of questions a month.",
    "This role sits in Customer Experience Data Science at the Store Support Center (corporate HQ, Atlanta): the agentic self-service behind that, how workflows understand intent, choose the next action and use enterprise tools and data, with evaluation, monitoring and reliability, and technical leadership across data science.",
    "Know, don't raise: in January 2026 Home Depot cut about 800 tech roles in Atlanta, and in 2026 consolidated store, supply chain and Pro tech under its CTO, who also leads agentic AI across the company. Asking how the team is structured is fair; asking about the cuts is not for this call.",
]

POSTING = {
    "url": "https://homedepot.wd5.myworkdayjobs.com/CareerDepot/job/STORE-SUPPORT-CENTER-ATLANTA---9090/Principal-Data-Scientist---CX_Req189365",
    "lead": "Lead AI and data science for customer support and agentic workflows that resolve complex customer needs through self-service, raising resolution quality and lowering the cost to serve.",
    "facts": [["Team", "Customer Experience Data Science"], ["Where", "Store Support Center, Atlanta; onsite"], ["Reports to", "Senior Manager or above; leads projects, no direct reports"],
              ["Time", "35% exploration, 25% solutions, 20% business, 20% leading and mentoring"], ["Minimum", "10 years of work experience; US work authorization"]],
    "does": [
        "Design end-to-end AI: predictive models, generative AI, agentic workflows, decisioning and orchestration.",
        "Shape how AI workflows understand intent, decide, use enterprise tools and data, and pick the next action.",
        "Take solutions from proof of concept to production, with rigorous evaluation, experimentation, monitoring and reliability.",
        "Partner with Product, Engineering, Architecture and the business; translate customer problems into AI capabilities.",
        "Mentor data scientists, build reusable AI capabilities, help shape adoption of new AI across the company.",
    ],
    "wants": [
        "10+ years in data science, ML or AI; a Master's or PhD in a quantitative field preferred.",
        "Expert Python, modern ML libraries, advanced SQL, cloud data platforms such as BigQuery.",
        "Generative AI: RAG, embeddings, prompt engineering, model selection.",
        "Agentic systems: tool calling, multi-step workflows; LLM and agent evaluation (hallucination, groundedness, cost and latency).",
        "API-based AI architectures and MLOps.",
    ],
}

ROUNDS = [
    {"title": "Round 1: recruiter call with Kristen Bernal",
     "when": "Date to be set",
     "who": "Kristen Bernal, Senior Recruiting Partner",
     "format": "A recruiter call: background, motivation, level, logistics, process.",
     "outcome": "Not yet held.",
     "notes": ["She reached out on LinkedIn citing 'Agentic AI and machine learning, along with your stakeholder management skills in working with cross-functional teams'."],
     "asked": []},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 45 seconds",
     "when": "First. The short one, then stop.",
     "probes": ["What do you own at alfred_?", "How big is the team?"],
     "say": [
         "I'm currently a founding LLM engineer at alfred_, where I work across AI agent reliability, memory architecture, evaluation infrastructure, and automation for a product with 5,000-plus active users. A big part of my work has been taking ambiguous problems and building the systems underneath them that make AI actually work reliably in production.",  # verbatim
         "Before that, I worked at an early-stage startup called WheelPrice and did AI research at UIC. What I enjoy most is working across the stack, understanding a real problem, and building something that solves it end to end. That's what caught my attention about this role: agents that actually resolve what a customer needs, with the evaluation and reliability behind them to trust that at Home Depot's scale."],
     "land": "Production agent reliability and evaluation, and why this role: agents that resolve customer needs, at scale.",
     "notes": ["Yours from INTRO.md, unchanged except the last sentence, which replaces the Mercor line: make it yours."]},
    {"id": "why-hd", "title": "Why Home Depot, why this role?", "length": "about 30 seconds",
     "when": "Almost certainly.",
     "probes": ["What do you know about our AI work?", "Why a large company after a startup?"],
     "vname": "A, the problem",
     "say": [
         "Honestly, it's the problem. The posting talks about agents that use the reasoning an experienced associate would, so a customer can sort out something complicated on their own. That's exactly the hard part I work on: understanding what someone actually needs, deciding the next action, and knowing when the agent should not act alone. Doing that for millions of customers a month, across chat, SMS and voice, is a much bigger version of it."],
     "land": "The associate's judgment, built into self-service, at Home Depot's scale.",
     "variants": [
         {"name": "B, scale and stakes", "land": "Millions of real questions, where reliability and cost to serve are measured.",
          "say": ["I think it's the scale. Magic Apron is in every store now and answering millions of questions a month, and you're moving from answering to actually resolving things across chat, SMS and phone. At that scale reliability and cost to serve aren't side concerns, they're the job, and that's where I've spent most of my time at alfred_: making an agent dependable, and measuring it, not just making it work in a demo."]},
         {"name": "C, the craft", "land": "Evaluation, monitoring and the next action: the parts you already own.",
          "say": ["What stood out in the posting is how much of it is about rigor: evaluation, experimentation, monitoring, reliability, and how a workflow decides the next action. That's pretty much my day. At alfred_ I built the gate that decides what an agent may do alone and an eval bench that replays real conversations, and I'd like to bring that to a team where the customer base and the data are this large."]}]},
    {"id": "level", "title": "The posting asks for 10 years. How do you see yourself fitting?", "length": "about 30 seconds",
     "when": "Likely, or raise it yourself near the end as a question about level.",
     "probes": ["How many years of experience do you have?", "Have you led other data scientists?"],
     "vname": "A, scope first",
     "say": [
         "Fair question. In years I'm earlier than that, but as a founding engineer I've owned the production agent systems end to end: the architecture, the evaluation, the reliability, and the decisions with the product side about what the agent is allowed to do. That's the core of what this posting describes. I'm open on level; I'd rather be in the right seat on this team than hold out for a title."],
     "land": "Scope over years, and open on level.",
     "variants": [
         {"name": "B, ask her", "land": "Turn it into her read of the search.",
          "say": ["In years I'm earlier than the posting, but the work it describes, agents that pick the next action, evaluation, production reliability, is what I own today. How is the team thinking about level for this search? I'd be glad to be considered for whichever level fits."]},
         {"name": "C, the evidence", "land": "Three concrete things you've owned.",
          "say": ["Honestly, I'd point to what I've owned rather than the count. I rebuilt how our agent decides what it may do on its own, built the evaluation that replays real user conversations, and took a new engine to all of our SMS traffic with measured results. If the team needs someone at a different level to start, I'm open to that conversation."]}],
     "notes": ["Don't argue with the number, and don't apologise for it. The recruiter reached out to you; let her say how flexible the level is."]},
    {"id": "leave", "title": "Why leave alfred_?", "length": "about 30 seconds",
     "when": "Likely.",
     "probes": [],
     "vname": "Yours",
     "say": [
         "I’m not looking to leave because there’s something fundamentally wrong with alfred_. The reason I'm exploring is more about the direction I want to take my career",  # verbatim
         "I've learned a lot at alfred_ and have had the opportunity to own important parts of a production AI product from the ground up. I've gradually moved beyond just building agent features and into building the systems around the agent — evaluations, observability, memory, reliability",  # verbatim
         "I'm still there and not looking to leave just for the sake of moving. I'm exploring roles where I can apply that experience to a broader range of problems, work directly with customers, and grow as an engineer who can own both the technical solution and its business outcome."],  # verbatim
     "land": "Not away from alfred_; toward a broader version of the same work.",
     "variants": [
         {"name": "B, scale", "land": "From a small user base to customer AI at real scale.",
          "say": ["Nothing's wrong at alfred_; I've owned a lot of the production system there. What I want next is the same work at a scale where the data is rich and the impact is measurable, where an agent improving resolution by a few points means real customers and real cost. That's hard to get at a small startup."]},
         {"name": "C, leading", "land": "Toward technical leadership: mentoring and shaping how a team builds agents.",
          "say": ["I've spent the last year building the systems around our agent, the evaluation, memory, the reliability work. The next step for me is doing that with a team: shaping how several people build and evaluate agents, mentoring, and working with the business on what to build. A data science team at Home Depot is a good place for that."]}],
     "notes": ["Version Yours is INTRO.md word for word, minus its last sentence, which named Mercor."]},
    {"id": "next", "title": "What are you looking for next?", "length": "about 40 seconds",
     "when": "Possible.",
     "probes": ["Where do you see yourself in a few years?"],
     "vname": "A, real stakes",
     "say": [
         "Short term, I want to be somewhere the agentic engineering is actually at the frontier — not a demo, but running against real stakes, where getting it wrong has weight. That's the fastest way I know to get good, seriously good, at this.",  # verbatim
         "Long term, I want to understand this domain and this kind of engineering deeply enough that I can actually lead it — see where the real bottlenecks are, and push us toward the better one before it costs months. But I don't want that to mean stepping back from the actual work."],  # verbatim
     "land": "Real stakes now; lead the work later, still hands-on.",
     "variants": [
         {"name": "B, technical leadership", "land": "Hands-on technical leadership, which is what Principal means here.",
          "say": ["I want to grow into technical leadership without leaving the work: setting how a team evaluates and ships agents, mentoring, and being the person the business can bring a hard customer problem to. Over a few years, to be the one who calls the technical direction on customer AI and still builds it."]},
         {"name": "C, three things", "land": "Real customers, rigor, and people to learn from.",
          "say": ["Honestly, three things: real customers at real volume, so the work is measured; a team that takes evaluation and reliability seriously; and people I can learn from on the data science and business side. Longer term, to lead this kind of work."]}],
     "notes": ["Version A is your goals from INTRO.md, unchanged."]},
    {"id": "logistics", "title": "Logistics she will ask", "length": "a line each",
     "when": "Almost certainly on a recruiter call. Your answers are in chat, not on this page.",
     "probes": ["Onsite in Atlanta: are you open to relocating?", "Work authorization?", "Compensation expectations?", "Start date?"],
     "say": [],
     "land": "One sentence each, then back to the work.",
     "notes": ["Location, relocation, start date, pay and work authorization: your answers from chat."]},
]

QA = []
TABS = ["overview", "prep", "rounds"]

ASK_3C = [
    {"id": "clarify", "title": "While she talks: clarifying", "when": "When she describes the role or team. One or two, on her words.",
     "why": "Pins down what the role really is before you pitch yourself against it.",
     "how": ["Ask on what she just said: 'when you said X, is that...'"],
     "items": [
         {"to": "Kristen", "q": "Is the focus mainly the customer-facing agents, like the chat, SMS and voice support, or broader CX data science too?",
          "loop": "When she describes the team.", "why": "Tells you which project to lead with."},
         {"to": "Kristen", "q": "Is this a new seat, or replacing someone, and who would I report to?",
          "loop": "When she mentions the team.", "why": "Scope and the hiring manager."},
         {"to": "Kristen", "q": "How is the team thinking about level for this search?",
          "loop": "If level comes up.", "why": "Lets her tell you how flexible the 10 years is."}]},
    {"id": "collab", "title": "Before the end: collaborating", "when": "When she asks if you have questions. One.",
     "why": "Shows you think about the hiring problem with her.",
     "how": ["Ask one, listen, then tie her answer to one thing you've done."],
     "items": [
         {"to": "Kristen", "q": "What has been hardest to find for this role so far, and what made you reach out to me?",
          "loop": "First choice.", "why": "Tells you what to stress with the hiring manager."},
         {"to": "Kristen", "q": "What does the hiring manager care about most: building the agents, evaluating them, or working with the business side?",
          "loop": "Second.", "why": "Shapes how you prepare the next round."}]},
    {"id": "contribute", "title": "At the end: next steps", "when": "The last two minutes.",
     "why": "Leaves with a clear process and timeline.",
     "how": ["Two at most, then close, in your words from INTRO.md: “Really appreciate you taking the time today. This was helpful — honestly, the more I hear about what the team is working on, the more excited I am about the fit. Looking forward to hearing about next steps whenever you have them.”"],
     "items": [
         {"to": "Kristen", "q": "What does the full interview process look like from here, and the rough timeline?",
          "loop": "First.", "why": "Your question from INTRO.md."},
         {"to": "Kristen", "q": "Is there anything in my background you'd want me to make clearer for the hiring manager?",
          "loop": "Last.", "why": "Surfaces any concern while you can still answer it."}]},
]
ASK = []
TRAPS = []

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "45 seconds", "seconds": 45, "ref": "#say-intro"},
    {"id": "why-hd", "prompt": "Why this role at Home Depot?", "target": "30 seconds", "seconds": 30, "ref": "#say-why-hd"},
    {"id": "level", "prompt": "The posting asks for 10 years. How do you see yourself fitting?", "target": "30 seconds", "seconds": 30, "ref": "#say-level"},
]
