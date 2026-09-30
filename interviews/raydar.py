"""Raydar, first round, Wednesday 30 September 2026: Founding Forward Deployed Engineer.

A 10 to 15 minute screen with the Raydar Interview Agent, an AI interviewer, on Google Meet.
Raydar is a recruiting agency; the role is for a client it does not name. The agent covers the
background, what you want next and pay, and its transcript is also used to match you to other
Raydar clients. David Phillips (founder) then connects fits to the hiring manager.

Facts about Raydar and the posting are only what is in SOURCES, checked 2026-09-29. Pranav's facts
come from his existing prep (coframe.py, zenml_round3.py) and the master reference. Logistics
answers (pay, location, work authorization, start date) are kept in chat, never on this page.
"""

LOOP = {
    "id": "raydar",
    "title": "Raydar, Founding FDE",
    "subtitle": "AI screen, 15 minutes",
    # Brand colour for the hub's wordmark. Raydar's orange: --rd-orange-700: #B75204 in
    # raydar.xyz/shared/brand.css (5:1 on the light surface). brand_dark: --rd-orange #FF6E00,
    # 5.7:1 on the dark surface. Their violet is too close to Coframe's.
    "brand": "#B75204", "brand_dark": "#FF6E00",
    "when_iso": "2026-09-30T09:00:00-05:00",
    "when": "Wednesday 30 September, morning (the time on your booking), Google Meet",
    "who": ("The Raydar Interview Agent, an AI. A human at Raydar reviews the recording; David Phillips, "
            "the founder, then introduces fits to the hiring manager."),
    "format": ("Ten to fifteen minutes on Google Meet, recorded and transcribed. Your background, what you want "
               "next, and pay (base, separate from equity). You can ask for a human at any point."),
    "bar": ("The transcript is scored against a rubric and read by a person. Clear structure, a number in every "
            "story, the posting's own words used naturally. One or two minutes an answer, then stop."),
    "plan_kicker": "Before the call",
    "extra": ("The posting and what Raydar publishes are under <b>What this rests on</b> on the Prep tab."),
}

SESSION_IDS = []

PREP_LEAD = ("One hour. Read how to show up (5 minutes). Say the stack walk-through and the resume lines out loud, "
             "item by item (25 minutes). Then the intro, why FDE, the one story and what you want next, with a timer "
             "(25 minutes). Have your pay number written down.")

SHOW_UP = [
    ("It grades the transcript, not your voice.", "Vendors that publish how they work score what you said against a rubric, with a reason and your quoted words for each score, and a person reads it. HireVue says it uses the transcript only. So the words count; pace and accent don't."),
    ("Say the tool's name out loud.", "'Postgres', 'LiveKit', 'Supabase edge functions', 'Redis'. A transcript can only quote what you said; 'our database' scores nothing."),
    ("Every answer: what, where, a number, in production.", "'At WheelPrice I cut API p95 from 1.5 seconds to 300 milliseconds with query-plan tuning, pooling and Redis.' That one sentence is the whole shape."),
    ("Keep the resume's numbers exactly.", "Some agents check what you say against your resume, and the reviewer sees both. Use the numbers on the resume you applied with, word for word."),
    ("The first follow-up is a depth check.", "'Tell me more about X' means: one decision you made, one trade-off, one result. Then stop. Don't open a new topic."),
    ("Thirty to forty-five seconds a stack item; up to two minutes a story.", "Then stop. It asks when it wants more."),
    ("No reading, no tab switching.", "Several vendors flag scripted answers, reading off a second screen, and switching tabs. Glance at a one-line note, then look at the camera."),
    ("Wait a beat before you speak.", "Voice agents can cut in on a pause. If it interrupts, finish your sentence; if it mishears, correct it plainly."),
    ("Pay: one base number, equity separate.", "Raydar asks base apart from equity. Your number is in chat; say it once."),
    ("If it goes wrong, ask for a human.", "Raydar says you can, at any time, with no penalty."),
]

STORY_BLURB = "Your intro, why FDE, the one story in STAR shape, what you want next, and logistics."

# Every outside link, checked 2026-09-29.
SOURCES = [
    {"label": "Founding Forward Deployed Engineer: the job post (Workable)", "url": "https://jobs.workable.com/view/4KUx4od5tWQuAWeMoxENqF/founding-forward-deployed-engineer-in-chicago-at-raydar",
     "why": "For an unnamed AI-first permanent-capital group that buys vertical SaaS companies: $50M+ raised, 8 businesses in under 2 years. Build the forward-deployed function, run discovery with executives, own deployments through adoption, build shared data infrastructure. 3 to 5 years; full stack, systems, data pipelines, LLM workflows. New York or Chicago, in office, travel."},
    {"label": "The same posting on Raydar's Workable page", "url": "https://apply.workable.com/raydar/j/6198E62EFE/",
     "why": "The original; the mirror above has the full text."},
    {"label": "Raydar: how it works", "url": "https://www.raydar.xyz/how-it-works",
     "why": "Free for candidates. The agent: Google Meet, 15 minutes, background, what you want next, base pay separate from equity; recorded and transcribed; ask for a human any time."},
    {"label": "Raydar: company site", "url": "https://www.raydar.xyz",
     "why": "An AI-powered recruiting agency. The team reviews every application; strong ones get the AI interview, then placement support."},
    {"label": "Raydar: open roles", "url": "https://www.raydar.xyz/open-roles",
     "why": "Other roles it may match you to, including a Forward Deployed ML Engineer."},
    {"label": "The Palantirization of everything (a16z)", "url": "https://a16z.com/the-palantirization-of-everything/",
     "why": "What an FDE is: embedded with the customer, wiring systems together, driving adoption, feeding back to product, and saying no to one-off custom work."},
    {"label": "Forward deployed engineers (The Pragmatic Engineer)", "url": "https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers",
     "why": "How FDEs are screened: shipped work owned end to end, ambiguity, technical depth and communication."},
    {"label": "AI interviews explained (HeyMilo, an AI interview vendor)", "url": "https://blog.heymilo.ai/ai-interviews-explained-what-candidates-and-recruiters-need-to-know",
     "why": "The agent scores each answer against a rubric, with a rationale and timestamped quotes; a person decides."},
    {"label": "How HeyMilo's scoring works (docs)", "url": "https://docs.admin.heymilo.ai/creating-your-interview-agents/how-our-scoring-system-works",
     "why": "A 1 to 5 scale: the recruiter defines a 1 and a 5, the AI places you between, with a reason per score; the recruiter can override."},
    {"label": "AI interviewers for hiring (BrightHire)", "url": "https://brighthire.com/ai-interviewers-for-hiring-the-complete-guide/",
     "why": "Questions are summary, yes/no qualification, or rubric-scored; recruiters get the transcript, recording, summary and scores with reasoning; follow-ups adapt."},
    {"label": "AI screening interviews (Metaview)", "url": "https://www.metaview.ai/resources/blog/ai-screening-interviews",
     "why": "Screens verify application claims and surface gaps between the resume and the conversation; vague answers get a follow-up."},
    {"label": "AI in hiring (HireVue)", "url": "https://www.hirevue.com/ai-in-hiring",
     "why": "Scores the transcript only: no facial, video or audio analysis."},
    {"label": "What to expect in a Tenzo AI interview (review)", "url": "https://recruitingtechreviews.com/articles/tenzo-ai-interview-what-to-expect",
     "why": "The agent references your resume during the call; tab switching and copy-paste are flagged."},
]

# Your story, in your words. Items marked "verbatim" are Pranav's own text: never polish them.
SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. The agent will quote from it, so land on the FDE line.",
     "probes": ["What does alfred_ do?", "What did you own?", "What are you looking for?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",  # verbatim
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad — backend, AI, infrastructure, and product work all kind of blended together.",  # verbatim
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation — things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",  # verbatim
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",  # verbatim
         "And that's pretty much what a forward deployed role is: sit with the business, figure out what's actually broken, and ship AI that people use, from the first deployment to adoption."],
     "swaps": [{"when": "If it asks what alfred_ is, in a line", "line": "An AI executive assistant that works over text message. It handles people's email and calendar end to end, for 5,000-plus active users."}],
     "land": "Research, then shipping for customers, then owning a production agent. FDE is that, across several businesses.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged. Only the last line is new.", "Stop after the last line."]},

    {"id": "why-fde", "title": "Why this role? Why forward deployed?", "length": "about 60 seconds",
     "when": "Straight after the intro. It checks you understand the job and that it fits.",
     "probes": ["What do you know about the role?", "Have you worked with customers directly?", "Why founding?"],
     "say": [
         "From the posting, it's for a group that buys vertical software companies and wants to make each of them AI-first. The job is to build the forward deployed function: go into each business, run discovery with the people running it, and ship AI into real workflows, then stay until it's adopted.",
         "That's pretty close to how I already work. At WheelPrice we were two engineers, so I was building straight for customers: a React and Node content system serving 15 thousand daily users, where I took API p95 from 1.5 seconds to 300 milliseconds, and an AI assistant that could only answer through tools against verified data, because a wrong answer to a customer is worse than no answer.",
         "At alfred_ I work from real users' failures: I read the conversation, find what broke, fix it, and make sure it stays fixed with an eval case. That's the loop an FDE runs, with the customer in the room.",
         "And founding appeals to me because there's no playbook yet. I like building the thing and the way it gets built."],
     "swaps": [{"when": "If it asks about working with executives", "line": "At a small company you're never far from the person who owns the outcome. I've learned to start from what they measure, and to say plainly what AI will and won't do for it."},
               {"when": "If it asks why founding", "line": "I've been a founding engineer at alfred_. I like owning the first version and deciding what gets built, not only building it."}],
     "land": "Discovery, ship into real workflows, stay until adoption; that's how I already work.",
     "notes": ["New, in your voice. Facts from the posting (Sources) and your master reference.", "Say 'from the posting', not 'I know'."],
     "never": ["Don't guess the client's name.", "Don't claim executive discovery work you haven't done."]},

    {"id": "story", "title": "The one story, in STAR shape", "length": "about 90 seconds",
     "when": "Any 'tell me about a time' question: an impact, a hard problem, owning something end to end.",
     "probes": ["What was the result?", "What was your part?", "How did you measure it?"],
     "say": [
         "Situation: at alfred_, when I joined, nobody could say whether a new version of the agent was better than the old one. People tried it and had opinions.",
         "Task: we were about to rewrite how the agent handles back-and-forth conversations, and that's too big to check by trying it a few times.",
         "Action: I built a way to replay real user tasks against the new version before it ships. A little over a hundred cases, each from a real production failure, each running the real agent against a frozen copy of that user's email and calendar. A scanner reads real conversations daily, so new failures keep becoming cases.",
         "Result: that's how we signed off the rewrite. We could point at which cases got better and which got worse, and the agent reached the same results in fewer steps, about 2.5 tool calls per task down to 2.2."],
     "swaps": [{"when": "If it wants a win users felt", "line": "Texts about important emails used to arrive about ninety seconds after the email. The delay was a timer, not the work, so I triggered on the event instead. About three seconds now."},
               {"when": "If it asks about cost or pragmatism", "line": "Not everything needs a model. Email rules were a model call on every message; I replaced that with a deterministic three-stage matcher: per-user LLM cost down 40%, under 50 milliseconds, same match accuracy."},
               {"when": "If it asks about a hard technical problem", "line": "The model kept inventing email threads. Instead of prompting harder, I made it pick from a list of real items while code attaches the ids. It can't invent a thread anymore."}],
     "land": "Real failures became tests, and a full rewrite shipped with evidence.",
     "notes": ["Say the four labels in your head, not out loud, unless it asks for STAR.", "The swaps are three more stories in one line each.",
               "**Check before the call:** the resume says 40% for the matcher; the September code check found about 30%. Say the number you can defend, and if asked, say what it was measured over."]},

    {"id": "next", "title": "What are you looking for next?", "length": "about 45 seconds",
     "when": "It asks this for matching across its clients too, so be specific and a little broad.",
     "probes": ["What kind of company?", "What kind of role?", "What matters most?"],
     "say": [
         "An early team shipping AI that people actually use. Forward deployed or applied AI engineering, where I'm close to the users and own things from the first version into production.",
         "The work I'm strongest at is agents in production: evaluation, reliability, and the infrastructure under them. I've also built real-time voice, a mock interview platform on LiveKit at under 400 milliseconds end to end, with its own LLM-as-judge grading.",
         "What matters most is ownership and a real problem. Stage matters less than that."],
     "land": "Early team, AI people use, close to users, owning it into production.",
     "notes": ["New, in your voice. MockFlow-AI facts from the master reference: LiveKit, Deepgram, sub-400ms latency.",
               "Location: the posting says New York or Chicago. Your answer is in chat."]},

    {"id": "logistics", "title": "Logistics it will ask", "length": "a line each",
     "when": "Pay for certain; the rest maybe. Your answers are in chat, not on this public page.",
     "probes": ["What base salary are you looking for?", "Equity expectations?", "Where are you based? In office five days?", "Travel?", "Work authorization?", "When could you start?"],
     "say": [],
     "land": "Say each once, in one sentence, then stop.",
     "notes": ["**Base:** one number, from chat. The posting lists $200K to $300K base plus equity.",
               "**Equity:** 'Open, depending on the stage and the grant.'",
               "**Location and office:** the posting says New York or Chicago, five days in office, with frequent travel. Your answer from chat.",
               "**Work authorization and start date:** your answers from chat, one sentence each."],
     "never": ["Don't explain a logistics answer; the explanation becomes the transcript."]},
]

QA = [
    {"group": "Your stack, item by item", "blurb": "Walk me through your stack: the order to say it, and one what, where, number for each. The first follow-up on any item is a depth check.", "items": [
        {"q": "Walk me through your tech stack.", "short": "The whole stack, in 45 seconds", "tests": "Breadth, and whether it matches the resume.",
         "a": ["Mostly TypeScript and Python. On the backend, Node and Deno, FastAPI, with Postgres as the main database, plus Redis and MongoDB where I've needed them. React on the front end.",
               "For AI: LLM APIs, Claude and Gemini, with tool calling and MCP, and a lot of evaluation work. PyTorch for models, and LiveKit for real-time voice.",
               "For running it: Supabase, containers on Railway, Docker, CI/CD, and AWS for the research deployment."],
         "land": "TypeScript and Python; Postgres; LLM tooling and evals; Supabase, Docker and AWS to run it.",
         "notes": ["Say this, then stop. It will pick one item to go deeper on; the answers below are those."]},
        {"q": "Full stack: React and Node.", "short": "Full stack", "tests": "The posting's 'full stack'.",
         "a": ["At WheelPrice I owned a React, Node and MongoDB CMS serving about 15 thousand daily users. I took API p95 from 1.5 seconds to 300 milliseconds with query-plan tuning, connection pooling and Redis caching, and added server-side rendering and dynamic SEO, which lifted organic traffic 25%."],
         "land": "Resume: WheelPrice, the CMS bullet.",
         "notes": ["**Depth check, 'how did you find the slow part?':** read the query plans for the slowest endpoints first; the fixes were indexes and fewer round trips, then pooling, then Redis for the hot reads."]},
        {"q": "TypeScript and Python.", "short": "Languages", "tests": "Which, and for what.",
         "a": ["TypeScript for product and agent code: alfred_'s agent and its services are TypeScript on Deno and Node. Python for ML and research: the eval tooling, PyTorch, the MetaRAG and TeamMedAgents work, and FastAPI services."],
         "land": "TypeScript for the product, Python for ML and research."},
        {"q": "Postgres and data.", "short": "Postgres, Redis, MongoDB", "tests": "Real database work, not only CRUD.",
         "a": ["At alfred_ everything runs on one Postgres in Supabase: the data, row-level security, and the job queues too, with pgmq for queues and pg_cron for schedules, so long jobs don't need a separate broker.",
               "At WheelPrice it was MongoDB with Redis in front for the hot reads."],
         "land": "One Postgres doing data, security and queues.",
         "notes": ["**Depth check, 'why queues in Postgres?':** one system to run and back up, transactions across the job and the data, and our volume doesn't need Kafka. The trade-off: you watch table bloat and claim jobs with SKIP LOCKED."]},
        {"q": "Where does the alfred_ agent actually run?", "short": "Where the agent runs", "tests": "Do you know your own system's infrastructure?",
         "a": ["A message comes in over SMS or the web and hits a Supabase edge function, which is Deno running serverless. That function runs the agent's turn: a LangGraph loop that calls the model and our tools, up to 12 steps on SMS and 50 on the web.",
               "Anything long, like reading through a whole inbox, goes onto a pgmq queue in Postgres and runs on worker containers on Railway. pg_cron is the backstop, so nothing gets dropped."],
         "land": "The turn in a Supabase edge function; long work on queued workers on Railway; Postgres underneath.",
         "notes": ["Say this one cold. Edge function first, then the queue and the workers."]},
        {"q": "Data pipelines.", "short": "Data pipelines", "tests": "The posting's shared data infrastructure line.",
         "a": ["At alfred_ the agent's data comes from users' real inboxes and calendars, Gmail, Outlook and IMAP, at over 100 thousand emails a day through the rules engine. That runs through queues and scheduled jobs, with checks that the result is complete, not only well formed.",
               "At WheelPrice I shipped an XGBoost churn pipeline at 0.85 AUC that flagged at-risk accounts weekly for the ops team."],
         "land": "Resume: the matcher bullet (100K+ daily emails) and the churn pipeline.",
         "notes": ["**Depth check, 'how do you know it's complete?':** the ledger story: a check once passed a result missing two refunds, so tests now assert against the counts we hold."]},
        {"q": "LLM workflows and evals.", "short": "LLM workflows and evals", "tests": "The core of the role.",
         "a": ["It's most of my work. At alfred_ I built the eval harness from scratch: it replays real production scenarios against the real agent, scored by deterministic checks plus an LLM judge, and catches regressions across 12 failure classes in nightly runs.",
               "And I re-architected memory so recall is grounded in verified state, which cut fabricated recall and false confirmations by 80%."],
         "land": "Resume: alfred_, the first and third bullets.",
         "notes": ["**Depth check, 'how do you trust the LLM judge?':** deterministic checks wherever there's a right answer; the judge only for judgement calls. In MockFlow-AI I calibrated a judge against 50 human-graded items, weighted Cohen's kappa 0.82."]},
        {"q": "Cloud and deployment.", "short": "Cloud and deployment", "tests": "Can you ship and run things.",
         "a": ["Supabase and Railway at alfred_, Docker and CI/CD for my projects, and AWS for MetaRAG's deployment at p99 under 300 milliseconds. At the UIC lab I deployed a quantized INT8 TorchScript audio model as a service at 150 milliseconds p95, for 200 concurrent users on the hospital network."],
         "land": "Resume: the UIC bullet and MetaRAG.",
         "notes": ["**If it asks about Kubernetes:** 'I've used Docker and managed platforms; I haven't run Kubernetes in production.' One sentence, honest, then move on."]},
        {"q": "Voice and real-time.", "short": "Voice and real-time", "tests": "A differentiator.",
         "a": ["MockFlow-AI: a real-time voice interview platform on LiveKit with streaming speech-to-text and text-to-speech, under 400 milliseconds end to end. The interview moves through stages only when the model calls a transition tool, so it can't drift."],
         "land": "Resume: MockFlow-AI.",
         "notes": ["Worth one line in any answer about agents: you've built an AI interviewer yourself."]},
    ]},
    {"group": "Resume lines to call out", "blurb": "The lines it may point at, in resume order, each with the one sentence to add.", "items": [
        {"q": "The eval harness (alfred_, bullet 1).", "short": "Eval harness", "tests": "Ownership of reliability.",
         "a": ["Built from scratch; replays real production scenarios; deterministic plus LLM-as-judge scoring; 12 failure classes; nightly. The sentence to add: it's how we signed off a full rewrite of the conversation handling."],
         "land": "It turned 'we think it's better' into evidence."},
        {"q": "The deterministic matcher (alfred_, bullet 2).", "short": "Matcher: cost down 40%", "tests": "Pragmatism: not everything needs a model.",
         "a": ["Per-message LLM calls in the email rules engine replaced by a three-stage deterministic matcher; per-user LLM cost down 40%, under 50 ms, same accuracy over 100K+ daily emails. The sentence to add: the model is the expensive fallback, not the default."],
         "land": "The model as the fallback, not the default.",
         "notes": ["Check the 40% before the call (see the story's notes)."]},
        {"q": "Grounded memory (alfred_, bullet 3).", "short": "Memory: 80% fewer fabrications", "tests": "Hallucination by design, not by prompt.",
         "a": ["Recall grounded in verified state; fabricated recall and false confirmations down 80%. The sentence to add: the model picks from real items and code attaches the ids, so it can't invent a thread."],
         "land": "Make the mistake impossible, not rarer."},
        {"q": "The CMS latency (WheelPrice).", "short": "p95 1.5 s to 300 ms", "tests": "Backend performance.",
         "a": ["15K daily users; p95 1.5 s to 300 ms via query plans, pooling and Redis; SSR and SEO lifted organic traffic 25%. The sentence to add: I found it by reading the query plans of the slowest endpoints first."],
         "land": "Measure first, then fix the biggest one."},
        {"q": "The audio inference service (UIC).", "short": "INT8 audio model at 150 ms", "tests": "Inference and deployment.",
         "a": ["A quantized INT8 TorchScript audio model at 150 ms p95, with the Python and Postgres backend, 200 concurrent users across the hospital network. The sentence to add: quantizing was what made it fit the latency budget."],
         "land": "Quantize to fit the budget, then serve it."},
        {"q": "MockFlow-AI's judge (Projects).", "short": "LLM-as-judge, kappa 0.82", "tests": "Evaluation rigour.",
         "a": ["Evidence-cited scoring across 5 competencies, the verdict computed in code, calibrated against 50 human-graded items at weighted Cohen's kappa 0.82. The sentence to add: the model gathers evidence; code makes the call."],
         "land": "The model cites evidence; code decides."},
    ]},
    {"group": "The role", "blurb": "What an FDE does, and how your work maps to it.", "items": [
        {"q": "What does a forward deployed engineer do?", "short": "What an FDE is", "tests": "Do you understand the job?",
         "a": ["An engineer who sits with the customer instead of behind a product team. You find what's actually broken in their workflow, wire their systems together, ship something they use, and stay until it's adopted. Then you feed what you learned back, so the next deployment is faster.",
               "The hard part isn't the code. It's saying no to one-off custom work and building the pieces that carry over to the next customer."],
         "land": "Sit with the customer, ship what they use, stay until adoption, and reuse what you learn."},
        {"q": "How would you approach a new portfolio company?", "short": "A new company, day one", "tests": "Discovery before building.",
         "a": ["Start with the people running it: what they measure, where time goes, and which work is repeated. Then read the data, because the workflow on paper is never the real one.",
               "Pick one workflow where AI saves real hours and a wrong answer is cheap to catch. Ship a small version in weeks, measure it against what they measure, and only then widen it. And check it against real cases before it goes live, the same way I do at alfred_."],
         "land": "Listen, read the data, ship one small thing that's measured, then widen."},
        {"q": "Tell me about working with data pipelines and messy data.", "short": "Data and integrations", "tests": "The posting's data infrastructure line.",
         "a": ["At alfred_ everything the agent knows comes from people's real inboxes and calendars across Gmail, Outlook and IMAP, so most of my data work is making messy sources reliable: queues for long jobs, scheduled backstops so nothing gets dropped, and checks that the result is complete, not just well shaped.",
               "The lesson that stuck: a test once passed a financial ledger that left out two refunds. Now we check against the ground truth we hold."],
         "land": "Messy real sources, made reliable, checked against ground truth."},
    ]},
]

QA_ORDER = ["Your stack, item by item", "Resume lines to call out", "The role"]

ASK_3C = [
    {"id": "agent", "title": "For the agent, at the end", "when": "When it asks if you have questions.",
     "why": "It records these, and David reads them. Keep them practical.",
     "how": ["One or two, short."],
     "items": [
         {"to": "Agent", "q": "What happens after this call, and when would I hear back?",
          "loop": "First.", "why": "Practical, and it tells you the timeline."},
         {"to": "Agent", "q": "Can you tell me more about the company behind the role, and how the FDE team would be set up?",
          "loop": "If there's time.", "why": "The client isn't named; this invites David to tell you."},
         {"to": "Agent", "q": "Are there other roles you'd match me with, in applied AI or forward deployed work?",
          "loop": "Last.", "why": "Uses the matching it offers."}]},
    {"id": "david", "title": "For David or the hiring manager, later", "when": "The next call, not this one.",
     "why": "Keep them for a person.",
     "how": ["Save these."],
     "items": [
         {"to": "Hiring manager", "q": "Which workflows in the portfolio do you expect AI to change first?", "loop": "Early.", "why": "Shows you think in outcomes."},
         {"to": "Hiring manager", "q": "How is an FDE's work measured: adoption, hours saved, revenue?", "loop": "Middle.", "why": "What you'd be judged on."},
         {"to": "Hiring manager", "q": "How do you decide what becomes shared across companies and what stays custom?", "loop": "Middle.", "why": "The hard part of the job, asked as curiosity."}]},
]
ASK = []

TRAPS = [
    ("Reading a script aloud", "It hears the flatness and the rubric rewards substance, not polish. Know the points; say them."),
    ("Keyword stuffing", "Use the posting's words where they're true. A list of terms reads badly in a transcript."),
    ("Talking over it", "Wait a beat after it stops. If you cut each other off, let it finish, then answer."),
    ("Leaving the result unsaid", "It can't infer 'and it worked'. Say the number."),
    ("A vague pay answer", "It asks base directly. One number."),
    ("Raising logistics first", "Work authorization and relocation only if asked. One sentence each."),
    ("The wrong posting", "Another 'Founding Forward Deployed Engineer' in New York is at Frontdesk, a different company."),
    ("Funding, crunch, colleagues' names", "Never, about alfred_."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "stack", "prompt": "Walk me through your tech stack.", "target": "45 seconds", "seconds": 45, "ref": "#/prep"},
    {"id": "where", "prompt": "Where does the alfred_ agent run?", "target": "30 seconds", "seconds": 30, "ref": "#/prep"},
    {"id": "why-fde", "prompt": "Why this role, and why forward deployed?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-fde"},
    {"id": "story", "prompt": "Tell me about something you owned end to end, and the result.", "target": "90 seconds", "seconds": 90, "ref": "#say-story"},
    {"id": "next", "prompt": "What are you looking for next?", "target": "45 seconds", "seconds": 45, "ref": "#say-next"},
]

MOCK_HOW = "Say 'run the Raydar mock' in chat: an AI-style screener, fifteen minutes, background, goals and pay."
