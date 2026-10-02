"""Coframe, recruiter screen, Thursday 1 October 2026: Agent Platform Engineer.

Fifteen minutes on Google Meet with Neesha Malik, Founding Talent. She checks the resume is
real, gauges communication and seniority, sells the role and decides whether to pitch him to
the team. So the page is short: the story in outcomes, the questions after it, and what to ask.

Facts about Coframe are only what Coframe publishes (its site, blog and the Ashby posting) and
two news items, all in SOURCES, checked 2026-09-29. Pranav's facts come from his existing prep:
the alfred_ answers in zenml_round3.py and the master reference. Logistics answers (location,
pay, work authorization, start date) are kept in chat, never on this public page.
"""

LOOP = {
    "id": "coframe",
    "title": "Coframe, Agent Platform Engineer",
    "subtitle": "Round 2: a technical exercise with the technical co-founder",
    # Brand colour for the hub's wordmark. Coframe's violet: background:#5A52EC on the buttons
    # and labels of coframe.com (the most used accent in its inline styles; the logo SVG is
    # white and the favicon near-black). 5.4:1 on the light surface. brand_dark: the same hue
    # lightened to 7:1 on the dark surface, a step lighter than Oxus's indigo so the two read apart.
    "brand": "#5A52EC", "brand_dark": "#B79CF7",
    # Round 2 is the next call. The time is booked through Ashby's link; noon Eastern is a placeholder.
    "when_iso": "2026-10-09T12:00:00-04:00",
    "when": "Round 2: Friday 9 October, one hour (time from your booking)",
    "who": ("Round 2: Pavlo Razumovskyi, Coframe's technical co-founder. Round 1 (done, 1 October) was Neesha "
            "Malik, Founding Talent, who moved you forward."),
    "format": ("Round 2 is one hour with the technical co-founder: coding, system design and technical conversation, in Python and TypeScript. "
               "Coding plus technical conversation. AI tools you use daily are encouraged (Claude Code, Codex and so on). "
               "Have an environment ready to read and run Python and TypeScript scripts (VS Code or Cursor), and a setup "
               "that shares microphone, camera and screen (allow the browser to screen share)."),
    "bar": ("Working code, shown running, with your reasoning out loud: how you read an unfamiliar script, how you "
            "use the AI tool and check what it gives you, and the platform judgement from round 1 (isolation, "
            "retries and durability, latency and cost) applied to real code."),
    "plan_kicker": "Before the call",
    "extra": ("Round 1's six questions and the stronger answers to keep are on the <b>Rounds</b> tab; they are the likeliest to come back in more depth. "
              "Your own system at depth is on the "
              "<a href=\"../ALFRED.html\" target=\"_blank\" rel=\"noopener\">alfred_ page</a>."
              " Refresh the basics on Baseline: <a href=\"../BASELINE.html#/ai\" target=\"_blank\" rel=\"noopener\">AI engineering</a>, <a href=\"../BASELINE.html#/devops\" target=\"_blank\" rel=\"noopener\">DevOps</a>, <a href=\"../BASELINE.html#/distributed\" target=\"_blank\" rel=\"noopener\">Distributed systems</a>, <a href=\"../BASELINE.html#/backend\" target=\"_blank\" rel=\"noopener\">Backend</a>."),
}

SESSION_IDS = []

PREP_LEAD = ("Fifteen minutes. Read how to show up, then say your story out loud: the intro in ninety seconds and "
             "in thirty, why Coframe, why leave, and the one story. The banks are for the questions after.")

SHOW_UP = [
    ("Join two minutes early.", "The Meet link from the invite, camera and sound checked, the job post and this page open in another tab."),
    ("Fifteen minutes is about eight of you.", "Intro in ninety seconds, why Coframe in sixty, then her questions and her pitch. Around minute eleven, your two questions. She closes."),
    ("Outcomes and scope, not architecture.", "5,000-plus active users; a rewrite of the agent signed off by the eval harness; texts that arrive in three seconds instead of ninety. Leave LangGraph, pgmq and edge functions out unless she asks."),
    ("Stop after the pitch.", "After the intro, stop and let her pull the thread she cares about. A short answer invites the next question; a long one uses up her fifteen minutes."),
    ("Let her sell.", "When she describes Coframe, listen, then ask one follow-up about what she said. Selling the role is half her job, and interest in it counts."),
    ("Logistics: one line each.", "Location, office days, pay, work authorization, start date: your answers are in chat. Say each once, plainly, then go back to the role."),
    ("Close with next steps.", "Ask what the rest of the loop looks like, and whether anything in your background needs making clearer for the team."),
]

STORY_BLURB = "Your career in ninety seconds and in thirty, why Coframe, why leave alfred_, what you are working on, your days at alfred_, the background, and logistics."

# Every outside link, checked 2026-09-29. Coframe's own pages first, then the news.
SOURCES = [
    {"label": "Agent Platform Engineer: the job post (Ashby)", "url": "https://jobs.ashbyhq.com/Coframe/9edc35b8-e381-4c93-b9d9-ed6ac5c578de",
     "why": "On site in the SF Bay Area (Burlingame on the posting). Infrastructure for long-running agents, isolated execution, tracing and evaluation, durable workers and remote browsers, CI/CD, and internal platforms for non-engineering teams. Names Dropbox, Replit and Intuit as customers."},
    {"label": "Agent Engineer: the sibling role's post (Ashby)", "url": "https://jobs.ashbyhq.com/Coframe/c20a12c1-0aa6-4e37-80ef-63b3fbd48d47",
     "why": "The engineers who build what the agents do. The platform role builds what they run on."},
    {"label": "Coframe: company site", "url": "https://coframe.com/",
     "why": "Agents that generate, test and personalize website variations: copy, code and visuals. Case studies for Replit and StartEngine."},
    {"label": "Coframe careers: values", "url": "https://coframe.com/careers",
     "why": "Agency, Velocity, Truth-seeking, Growth. 'A small, talent-dense team'."},
    {"label": "Coframe and OpenAI: a UI code generation model and benchmark (1 October 2024)", "url": "https://coframe.com/post/coframe-openai-ui-code-generation-model",
     "why": "A fine-tuned GPT-4o vision model for on-brand UI code; BrandBench, an LLM-as-judge benchmark of 194 held-out sites; 26% better than the base model."},
    {"label": "Predicting website experiment winners (7 August 2026)", "url": "https://coframe.com/post/predicting-website-experiment-winners",
     "why": "Each design pair judged in both orders so a model gets no credit for position bias; 57.28% on the benchmark, 36 to 40% on production data, and they say so."},
    {"label": "Replit case study (23 March 2026)", "url": "https://coframe.com/post/driving-410-conversion-lift-for-replit",
     "why": "410% conversion lift on the enterprise funnel; experiments shipped in hours, not sprints."},
    {"label": "Coframe acquires Haystacks (4 March 2026)", "url": "https://coframe.com/post/coframe-acquires-haystacks",
     "why": "Names the AI Growth Agent: ideas, design, engineering, QA and analysis end to end. Mentions Dropbox and Replit."},
    {"label": "Coframe raises $9.3 million seed (Yahoo Finance, 29 October 2024)", "url": "https://finance.yahoo.com/news/coframe-raises-9-million-websites-130406581.html",
     "why": "Led by Khosla Ventures and NFDG (Nat Friedman and Daniel Gross). Josh Payne is the CEO."},
    {"label": "Coframe appoints a Chief Business Officer (press release, 3 November 2025)", "url": "https://natlawreview.com/press-releases/coframe-appoints-scott-tieman-chief-business-officer-accelerate-growth-and",
     "why": "Josh Payne previously co-founded Autograph. Expanding into e-commerce, retail, travel and financial services."},
]

# The Overview: the company and the role, from the posting (Ashby's public feed, read 2026-10-01).
COMPANY = [
    "Coframe builds agents that optimize websites: they come up with ideas, then design, code, test and ship A/B tests, landing pages and personalization, without the customer's engineers building each one. Customers include Dropbox, Replit and Intuit; they report $221.4M in incremental revenue for customers over six months, and 120% growth a quarter.",
    "Small and talent-dense, primarily in person in San Francisco, before its Series A. Backed by Khosla Ventures, Nat Friedman and Rich Miner. They co-train a model with OpenAI for UI code. The CEO, Josh Payne, co-founded a unicorn before.",
]

POSTING = {
    "url": "https://jobs.ashbyhq.com/Coframe/9edc35b8-e381-4c93-b9d9-ed6ac5c578de",
    "label": "Agent Platform Engineer, on Ashby",
    "checked": "1 October 2026",
    "lead": "Build the infrastructure, tooling and workflows that let AI agents run safely, reliably and at scale: agents that build customer interfaces, agents that work on Coframe's own codebase, and agents that automate engineering, go-to-market and operations.",
    "facts": [["Where", "SF Bay Area, on site; primarily in person"], ["Pay", "$180K to $300K, plus equity (the posting)"], ["Stage", "Before Series A; Khosla Ventures, Nat Friedman, Rich Miner"]],
    "does": [
        "Infrastructure for long-running agent execution, memory, planning, and stop-and-resume workflows.",
        "Platforms where agents implement features, run tests in isolated environments, read their execution traces and improve their own output.",
        "Secure, isolated execution environments.",
        "Tracing, observability, evaluation and monitoring for autonomous agents.",
        "Durable workers, serverless compute and remote browsers.",
        "Developer tooling for engineers working with agents; CI/CD, testing, deployment and dev environments.",
        "Internal AI platforms so non-engineering teams build their own agents.",
        "Production incidents: the immediate fix and the long-term one.",
    ],
    "wants": [
        "A strong platform or infrastructure background and solid fundamentals.",
        "Distributed systems, developer platforms, internal tooling or compute infrastructure.",
        "Cloud, serverless, CI/CD, end-to-end testing and production deployment.",
        "Deploying, scaling, profiling and operating agents or LLM systems in production.",
        "Long-running execution, durable workers, isolated environments, remote browsers, stateful workflows.",
        "Judgement across security, reliability, performance, cost and iteration speed.",
        "High ownership in ambiguous, fast-moving work. Infrastructure for AI agents is a major plus.",
    ],
}

# What each round asked, as he reported it. A record, not a mock.
ROUNDS = [
    {"title": "Round 1: recruiter screen",
     "when": "Thursday 1 October 2026, 2:20 PM Eastern",
     "who": "Neesha Malik, Founding Talent",
     "format": "Fifteen minutes on Google Meet, quick-fire: six questions, most of them technical for a recruiter screen.",
     "outcome": "You think it landed and expect to be put forward.",
     "notes": ["She opened on why you're looking, which took you aback; you handled it. Expect the same opener from the team, so the answer below is worth having cold."],
     "asked": [
         {"q": "Why are you looking for a new opportunity?", "short": "The opener",
          "said": ["Handled, after a moment's surprise that it came first."],
          "land": "Not away from alfred_; toward the platform under agents as the whole job.",
          "keep": ["There's nothing particularly wrong with alfred_. I've learned a lot there and I still enjoy the work.",
                   "What I'm increasingly interested in is the platform underneath agents: execution, isolation, evaluation and reliability that many agents depend on, not one. That's this role. So it's less getting away from alfred_ and more a direction I want to go deeper into."],
          "prep": "say-leave"},
         {"q": "What have you personally shipped in orchestration, delegation, and isolation or sandboxing?", "short": "Shipped, by name",
          "said": ["Orchestration and delegation at alfred_, the workers, and isolation."],
          "land": "One shipped thing for each word she used, then the gap.",
          "keep": ["Orchestration: the agent loop and its multi-turn rewrite, which I signed off with the eval bench.",
                   "Delegation: the voice agent, where a lean agent answers on the call while our main agent works the same request in parallel; and lean Python workers on Railway, each with one job, claiming work from a queue.",
                   "Isolation: each worker job runs in its own environment, and the eval harness runs the real agent against an isolated copy of a user's world with no path to live systems. Sandboxed code execution and remote browsers I haven't built yet."],
          "prep": "q-what-platform-and-agent-engineering-experience-do-you-have-a"},
         {"q": "What evaluation harness have you worked on?", "short": "The eval harness",
          "said": ["The alfred_ eval harness."],
          "land": "Real failures become cases; the real agent runs on a frozen copy of the user's world; it signed off a rewrite.",
          "keep": ["At alfred_ I built a harness that replays real user tasks against a new version of the agent before it ships: a little over a hundred cases, each from a real production failure, each running the real agent against a frozen copy of that user's email and calendar.",
                   "That's how we signed off the multi-turn rewrite: we could see which cases got better and which got worse, and tool calls per task went from about 2.5 to 2.2. A scanner reads real conversations every day, so the set grows with what users actually hit."],
          "prep": "say-now"},
         {"q": "What have you personally owned in these projects?", "short": "Ownership",
          "said": ["What you owned across them."],
          "land": "Name the things that are yours, plainly, and say the team is four.",
          "keep": ["We're four engineers, so ownership is real. Mine: the eval harness and the production failure scanner, working memory, the voice agent end to end, and a lot of the worker infrastructure underneath. I decided what to build in each, built it, and run it in production."]},
         {"q": "How do you think about latency and cost, and how do you design for them?", "short": "Latency and cost",
          "said": ["Workflows: creating one is the expensive part; running it is cheaper because the steps are known and mostly deterministic. Start from the most expensive setup to make it as good as possible, harden the workflow, then scale back and decide where you need what."],
          "land": "Spend where the thinking is, make the repeat cheap, step down only where evals say quality holds.",
          "keep": ["I start from where the thinking actually happens. In our workflows, creating one is the expensive part, so it gets the strongest model. Running it is cheap, because the steps are known and mostly deterministic.",
                   "So I start with the best model everywhere to get it right, harden the workflow, then step down stage by stage where the evals say quality holds. Latency works the same way: keep the critical path small and stream it, and push slow work off it. On voice, a lean agent answers on the call while the heavy one works in parallel."],
          "notes": ["Name the check that makes stepping down safe: the evals. Without it, 'scale back' sounds like a guess."]},
         {"q": "How do you make agent runs retryable and durable?", "short": "Retries and durability",
          "said": ["A policy matrix of what a run does: native or third-party integrations, delivering somewhere else, research such as web search, read-only or writing, and if writing, whether a rewrite is OK. The retry design follows from that."],
          "land": "Classify what the run touches; the class decides the retry; writes carry a key; the queue makes it durable.",
          "keep": ["I start by classifying what the run touches: only our own system, third-party integrations, or delivering somewhere outside; and whether it reads, does research like web search, or writes, and if it writes, whether doing it twice is harmless.",
                   "That decides the retry. Reads and research retry freely with backoff. A write carries an idempotency key, so a retry returns the stored result instead of acting twice. Anything that can't safely repeat waits for the person to confirm.",
                   "Durability is the queue: jobs sit in Postgres, a worker claims one with SKIP LOCKED, a job that dies becomes claimable again, and a scheduled sweep catches anything missed."],
          "notes": ["Check before the next round: how alfred_ marks a job claimable again after a crash (pgmq's visibility timeout or your own sweep), so you say it exactly."]},
     ]},
    {"title": "Round 2: technical exercise",
     "when": "Friday 9 October 2026, one hour (time from your booking)",
     "who": "Pavlo Razumovskyi, technical co-founder",
     "format": "One hour: coding, system design and technical conversation, in Python and TypeScript. AI tools encouraged; read and run Python and TypeScript; share microphone, camera and screen.",
     "outcome": "Not yet held.",
     "notes": ["Before the day: an editor (VS Code or Cursor) with Python 3 and Node with TypeScript (tsx or ts-node) that run a script in one command; Claude Code signed in and working in that folder; a screen share tested in the browser with camera and microphone.",
               "Expect to read, run, fix or extend Python and TypeScript, and to talk through the agent-platform judgement from round 1 on real code: isolated execution, retries and durability, tracing, latency and cost. Round 1's questions below are the ones most likely to come back in more depth.",
               "Say out loud how you use the AI tool and how you check its output: run it, read the diff, test it. That is part of what they are watching."],
     "asked": []},
]

# Your story, in your words. Items marked "verbatim" are Pranav's own text: never polish them.
SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. She is checking the resume is real and how clearly you tell it. It should land on why this role.",
     "probes": ["What does alfred_ do?", "What do you own there?", "Why are you looking?", "Why Coframe?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",  # verbatim
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad — backend, AI, infrastructure, and product work all kind of blended together.",  # verbatim
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation — things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",  # verbatim
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",  # verbatim
         "And that's pretty much why Coframe is interesting to me. At alfred_ I've ended up working on the layer underneath the agent: the evals, the reliability, the infrastructure it runs on. The Agent Platform role is that layer, at a company where the whole product is agents."],
     "swaps": [{"when": "If she asks what alfred_ is, in a line", "line": "An AI executive assistant that works over text message. It handles people's email and calendar end to end, for 5,000-plus active users."},
               {"when": "If she asks what you own", "line": "The reliability side of the agent: the eval harness, the scanner that catches production failures, working memory, and a lot of the infrastructure it runs on."}],
     "land": "Research, then shipping products, then the layer under a production agent. Coframe is that layer where the whole product is agents.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged from ZenML. Only the last line is new, pointed at Coframe.",
               "About ninety seconds. Stop after the last line and let her pick where to go.",
               "Numbers if she asks: 5,000-plus active users at alfred_; 10 to 20 thousand daily readers on the WheelPrice blog."],
     "never": ["Never mention alfred_'s funding, a crunch, or colleagues' names.", "No filler: 'so to say', 'essentially', 'in a sense'."]},

    {"id": "intro-short", "title": "The thirty-second version", "length": "about 30 seconds",
     "when": "If she says 'briefly', or the call starts late. Same arc, outcomes only.",
     "probes": ["Give me the short version.", "What do you do now?"],
     "say": [
         "I'm a founding LLM engineer at alfred_, an AI executive assistant that works over text message. It handles people's email and calendar end to end, for 5,000-plus active users.",
         "I own a lot of what sits under the agent: the eval harness, a scanner that catches production failures, working memory, and the reliability work.",
         "Before that I shipped products at WheelPrice, a small startup, and did applied ML and LLM research at UIC.",
         "The Agent Platform role is pretty much the layer I already work at, and I'd like to build it where the whole product is agents."],
     "land": "Founding LLM engineer, the layer under a production agent, and this role is that layer.",
     "notes": ["New, in your voice, from his brief's pitch. Four sentences; stop after the last one."]},

    {"id": "why-coframe", "title": "Why Coframe? Why this role?", "length": "about 60 seconds",
     "when": "Straight after the intro, or when she finishes her pitch. She wants to hear you know what they do and why it fits you.",
     "probes": ["What do you know about us?", "Why Agent Platform and not Agent Engineer?", "What would you want to work on first?", "Are you talking to other companies?"],
     "say": [
         "Honestly, a couple of things. The first is that at Coframe the agents are the product. From what I read, your agents design, code, test and ship website experiments for companies like Dropbox, Replit and Intuit. So the platform they run on isn't a side project; everything else stands on it.",
         "The second is the role itself. The posting talks about long-running agent execution, stop-and-resume, isolated environments, tracing and evaluation. That's pretty much the layer I've been working at, at alfred_: the agent loop, the workers for long jobs, the eval harness and the failure scanner. I've built it for one assistant. Here it would serve every agent you run, including the ones working on your own codebase.",
         "And I like that the work gets measured. Your product is judged on conversion lift, which is a real number, and I think that's the right pressure for an agent platform.",
         "So it's a problem I already care about, with a lot more agents on top of it."],
     "swaps": [{"when": "If she asks what stood out from what you read", "line": "The post on predicting experiment winners. They judged each pair of designs in both orders so a model couldn't score on position bias, and they said openly that accuracy dropped on production data. That's the kind of eval honesty I care about."},
               {"when": "If she asks why platform and not agent engineer", "line": "The agent engineers build what the agents do. The platform is what they run on: execution, isolation, tracing, evals. At alfred_ the part I've owned most is the second one, so that's where I'd add the most."}],
     "land": "The agents are the product, and the platform is the layer I already work at.",
     "notes": ["New, in your voice. Facts from the posting and Coframe's own posts (Sources): agents that design, code, debug and deploy tests, landing pages and personalization; customers Dropbox, Replit and Intuit; agents also contribute to Coframe's own codebase.",
               "Say 'from what I read', not 'I know'."],
     "never": ["Don't quote their revenue claims as fact. If you use one, 'they report'."]},

    {"id": "leave", "title": "Why are you looking to leave alfred_?", "length": "about 45 seconds",
     "when": "You are exploring while employed. Make that clear without sounding defensive.",
     "probes": ["Is something wrong at alfred_?", "You've only been there since April. Why move so soon?", "Will you leave us quickly too?"],
     "say": [
         "There's nothing particularly wrong with alfred_. I've actually learned a lot there and I still enjoy the work.",  # verbatim
         "I'm mostly looking at what I want the next few years of my career to look like. At alfred_, I've had a lot of ownership because it's a small team, and that's been great. But the work is ultimately internal to one product.",  # verbatim
         "What I'm increasingly interested in is the platform underneath agents: the execution, evaluation and reliability layer that a lot of agents depend on, not one. That's why this role caught my attention. It's very close to problems I've already been solving, but the platform is the thing I'd be building.",
         "So it's less “I need to get away from Alfred” and more “I've found a direction I want to go deeper into.”"],  # verbatim
     "swaps": [{"when": "If she asks bluntly: why not stay?", "line": "I could. And that's why I'm being selective about what I talk to. I'm not looking to leave just to change companies. It has to give me a meaningfully different scope, and going from one agent to a platform that every agent runs on does."},
               {"when": "If she asks: only since April, why so soon?", "line": "Fair question. It's been a very dense six months, and the reliability pieces I built there are running. I'm not in a rush; I'm talking to very few places, because the scope has to be genuinely different."}],
     "land": "Less “get away from alfred_”, more “a direction I want to go deeper into”.",
     "notes": ["Paragraphs 1, 2 and 4 are your words, unchanged. Paragraph 3 named Kitaru's developer infrastructure; it now names the agent platform.",
               "Pay, visa and start date are prepared in chat, not on this public page."]},

    {"id": "now", "title": "What are you working on right now?", "length": "about 60 seconds",
     "when": "One concrete production story, told for someone who isn't an engineer. Outcome first, then how, then the number.",
     "probes": ["What was the result?", "What was your part?", "How do you know it worked?"],
     "say": [
         "Right now most of my work is about making sure a change to our agent actually makes it better, not worse.",
         "The clearest example: we rewrote how the agent handles back-and-forth conversations. That's too big a change to test by trying it a few times. So I built a way to replay real user tasks against the new version before it ships: a little over a hundred cases, each one taken from a real failure in production, each running the real agent against a frozen copy of that user's email and calendar.",
         "That's how we signed off the rewrite. We could point at exactly which cases got better and which got worse, and the agent got to the same results in fewer steps: about 2.5 tool calls per task, down to 2.2.",
         "And the cases keep coming from production. A scanner reads real conversations every day and flags the ones that went wrong, so the test set grows with what users actually hit."],
     "swaps": [{"when": "If she wants a win users felt", "line": "Texts about important emails used to arrive about ninety seconds after the email. The delay was a timer, not the work, so I made the text go out the moment it's queued. It's about three seconds now."},
               {"when": "If she asks what 'tool calls per task' means", "line": "How many actions the agent takes to finish a job. Fewer, for the same result, means it found the answer more directly."}],
     "land": "We shipped a full rewrite of the agent with evidence it got better, because every change runs against real cases first.",
     "notes": ["New, in your voice, from the bench story. Keep the words 'SQLite', 'snapshot' and 'harness mode' out of it unless she asks how.",
               "Facts: a little over a hundred cases; the scanner runs daily; 2.5 to 2.2 tool calls per completed task; it signed off the multi-turn orchestration rewrite; notifications about 90 seconds to about 3."]},

    {"id": "alfred-day", "title": "What does your day-to-day look like at alfred_?", "length": "about 60 seconds",
     "when": "How much you code, what 'founding LLM engineer' means, what you personally own.",
     "probes": ["How much do you actually code?", "What does “founding LLM engineer” mean?", "What did you personally own?"],
     "say": [  # verbatim
         "It's pretty varied, which is one of the things I like about the role.",
         "A typical piece of work might start with a production failure. I'll look at the conversation and the tool trace, figure out whether it's a model problem, a tool problem, or something in our orchestration or memory layer.",
         "If it's something we need to reproduce, I'll add it to the eval harness. The harness takes a snapshot of the relevant user environment — email, calendar, whatever the task needs — and lets the actual agent code run against that state. So we're testing the same tool paths we use in production rather than mocking the whole agent.",
         "Then I'll usually build the fix, run the regression set, and look at whether we've actually improved the behavior without breaking something else.",
         "I've also worked on the production failure scanner, working memory, reliability infrastructure, and some of the cost and orchestration pieces.",
         "So it's a mix of debugging production behavior, building infrastructure, writing product code, and figuring out what we should build next."],
     "swaps": [{"when": "If she asks “how much coding?”", "line": "A lot. I'm usually in the codebase every day. The difference is that because we're a small team, the coding is usually preceded by figuring out what the right thing to build is."}],  # verbatim
     "land": "The coding is usually preceded by figuring out what the right thing to build is.",
     "notes": ["Your own words, unchanged from ZenML.", "For a recruiter, the swap line is the one to keep: it says senior without saying senior."]},

    {"id": "background", "title": "Walk me through your background", "length": "about 60 seconds",
     "when": "The resume, in order, with a reason for each move. She is checking the dates and titles line up.",
     "probes": ["What did you do at UIC?", "Why did you leave WheelPrice?", "Why alfred_?", "Are you a job hopper?"],
     "say": [
         "At UIC I did my master's and worked in a research lab on applied ML and LLM systems. One project, MetaRAG, a retrieval framework for enterprise knowledge, ran in a production code-translation use case at about ten thousand queries a day, and the paper was accepted at IEEE CAI. Another was multi-agent reasoning for medicine.",
         "Then WheelPrice. It was two engineers, so I owned a lot: a blog and content system that got to 10 to 20 thousand daily readers, and an AI fitment assistant that could only answer through tools against verified data.",
         "But the work I kept enjoying most was the AI systems side, and there it was one of many hats. alfred_ was a founding team with an agent in production and real users, and the reliability of that agent was mine to own. So it was a move toward depth in the same direction, not away from anything."],
     "swaps": [{"when": "If she asks whether you're a job hopper", "line": "Fair question. Both moves were toward the same thing, more depth in AI systems and more ownership, and each one widened the scope. This one would make the platform the whole job."},
               {"when": "If she asks the dates", "line": "WheelPrice from July 2025 to March 2026; alfred_ since April 2026."}],
     "land": "Research, then broad ownership at a two-person startup, then depth in agents in production.",
     "notes": ["From your WheelPrice and MetaRAG answers, in your voice. Say it plainly and move on.",
               "If she asks for MetaRAG's numbers: 82.5% precision, 0.925 Hit@10, 25% fewer hallucinations."]},

    {"id": "logistics", "title": "Logistics she will ask", "length": "a line each",
     "when": "Usually near the end. Your answers are in chat, not on this public page. How to handle each is below.",
     "probes": ["Where are you based, and would you relocate?", "The role is on site. Does that work?", "What are you looking for in compensation?",
                "Do you need sponsorship?", "When could you start?", "Are you interviewing elsewhere?"],
     "say": [],
     "land": "Say each once, in one sentence, then go back to the role.",
     "notes": ["**Location and relocation:** one sentence with your answer from chat; if she asks about timing, give it, then stop.",
               "**On site:** the posting says on site in the SF Bay Area and 'primarily in-person'. Ask her to confirm the office and the days, then answer in one sentence.",
               "**Compensation:** have your number ready; say it once; ask about the range for the role. Don't negotiate on this call.",
               "**Work authorization:** only if she asks. One sentence, then back to the role.",
               "**Start date:** your answer from chat, in one line.",
               "**Other interviews:** 'A few conversations, and I'm being selective.' No names."],
     "never": ["Don't raise work authorization, pay or relocation before she does.", "Don't explain or justify a logistics answer; the explanation invites the next question."]},
]

# The questions after the story. Each answer is short and in plain words.
QA = [
    {"group": "Coframe and the role", "blurb": "What they do, and how the posting maps to your work.", "items": [
        {"q": "What do you know about Coframe?", "short": "What Coframe does", "tests": "Did you prepare?",
         "a": ["Coframe builds agents that optimize websites. They come up with ideas, design and code the variations, test them on real traffic, and personalize what each visitor sees, without the customer's engineers having to build each test. Customers include Dropbox, Replit and Intuit; Replit reported a 410% conversion lift on its enterprise funnel.",
               "What I found interesting technically is the work with OpenAI on a model fine-tuned for UI code, with your own benchmark for it, and the recent post on predicting experiment winners, which was pretty honest about how much accuracy drops on production data.",
               "And from the posting, the agents aren't only in the product. They also work on Coframe's own codebase and internal workflows, which is what the platform supports."],
         "land": "Agents that design, build and test website experiments; the platform serves those and the company's own.",
         "notes": ["From Coframe's site, blog and posting (Sources). Seed round of $9.3 million in October 2024, led by Khosla Ventures and NFDG; the posting says pre-Series A. The CEO is Josh Payne, who co-founded Autograph before.",
                   "Their values: Agency, Velocity, Truth-seeking, Growth."]},
        {"q": "How does your background fit the Agent Platform role?", "short": "The posting, mapped to your work", "tests": "Is the resume real, and does it match what they need?",
         "a": ["Most of it maps to what I already do. The posting asks for infrastructure for long-running agents, tracing and evaluation, safe execution, and judgement on cost and reliability. At alfred_ I've worked on each of those for one agent in production, used by 5,000-plus people.",
               "Where I haven't worked yet is remote browsers and sandboxed code execution, and I'd rather say that plainly. The instincts carry over: the eval harness already runs the real agent in an isolated copy of the user's world with no path to live systems."],
         "land": "Each of the posting's asks, done for one production agent; the gaps named first.",
         "parts": [
             {"title": "What the posting asks, and where you've done it",
              "items": ["**Long-running execution, durable workers, stateful workflows:** quick turns run in Supabase edge functions; long work runs in containers on Railway, fed from one Postgres with pgmq queues and pg_cron schedules.",
                        "**Deploying and operating agents in production:** the agent loop on LangGraph with its own tools node, 12 steps on SMS and 50 on the web, for 5,000-plus active users.",
                        "**Tracing, observability, evaluation, monitoring:** the production failure scanner over real conversations; an eval harness on a snapshot of the user's world; a little over a hundred cases.",
                        "**Isolated environments:** in the harness the real agent runs against its own copy of the world, with no path to a live system, reset between cases.",
                        "**Memory and planning:** working memory, the user's open loops, which the agent fetches with a tool when it needs them.",
                        "**Security and reliability judgement:** no risk score; a code floor confirms every send and irreversible delete, whatever the model thinks. Row-level security in Postgres.",
                        "**Cost:** per-user LLM cost cut about 30% by replacing per-message model calls with a deterministic matcher for email rules.",
                        "**Testing before deploy:** a change runs against the cases it touches before it ships; the full set runs nightly.",
                        "**Engineering productivity:** Claude Code every day with project instructions, skills and hooks; an MCP connector that lets Claude use alfred_'s tools.",
                        "**Platforms for non-engineers:** the closest is the rules engine, where users write email rules in plain language from chat."]},
             {"title": "Not done yet: say so",
              "items": ["Remote browsers, sandboxed code execution, and serverless compute at Coframe's scale.",
                        "A platform used by several teams: yours has been one product."]},
         ],
         "notes": ["For a recruiter, say the first paragraph and stop. The list is for when she reads a line of the posting back to you."]},
        {"q": "Have you built infrastructure for long-running agents?", "short": "Long-running agents", "tests": "The posting's first line, in plain words.",
         "a": ["Yes, for one product. A quick reply to a text runs in a short serverless function. Anything long, like reading through someone's whole inbox, goes onto a queue and runs on workers in containers, with scheduled jobs as a backstop so nothing gets dropped.",
               "The lesson that stuck was about timing: our email-to-text notifications waited on a timer, about ninety seconds. Triggering on the event instead took it to about three."],
         "land": "Short work in functions, long work on queued workers, a schedule as the backstop.",
         "notes": ["Underneath, if an engineer asks: Supabase edge functions for the turn, containers on Railway, pgmq and pg_cron in one Postgres, claiming with SKIP LOCKED."]},
        {"q": "Why platform engineering?", "short": "Why platform", "tests": "Is this a real direction, or any job with 'agent' in it?",
         "a": ["I think it's where my work has been heading anyway. At alfred_ the part I kept ending up on wasn't what the agent says, it was what it runs on: the workers that pick up jobs, the eval harness, the scanner that catches failures in production.",
               "And that layer decides whether an agent is any good. A smart agent on a flaky platform still fails users. A platform that's reliable, traceable and easy to test makes every agent on it better.",
               "So I'd rather build the thing every agent depends on than one more agent."],
         "land": "It's the layer I kept ending up on, and it's what makes every agent on it better.",
         "swaps": [{"when": "If she asks why not Agent Engineer", "line": "The agent engineers build what the agents do. The platform is what they run on. The second is where I've owned the most, so that's where I'd add the most."}]},
        {"q": "What do you understand by agent platform engineering at Coframe?", "short": "What the platform is", "tests": "Did you read the posting, and can you say it plainly?",
         "a": ["From the posting, Coframe's agents do long jobs: they come up with a website experiment, design it, write the code, test it and ship it. The platform is everything those agents run on.",
               "That means a place for each agent to run safely on its own, isolated from the others, with remote browsers and code execution; workers that can run for a long time and stop and resume without losing work; tracing, so you can see exactly what an agent did; evals, so a change is tested before it ships; and keeping all of it fast and affordable.",
               "And it serves Coframe's own teams too, since agents also work on your codebase and internal workflows. So in a line: making agents safe, observable and reliable to run, at scale."],
         "land": "Everything the agents run on: isolated execution, durable long-running workers, tracing, evals, cost.",
         "notes": ["From the posting (Sources). Say 'from the posting', not 'I know'."]},
        {"q": "What platform and agent engineering experience do you have at alfred_?", "short": "Your platform and agent work", "tests": "Concrete things you built, not words from the posting.",
         "a": ["Both, really, for one product. On the platform side, I built a lot of what our agents run on. Quick replies run in serverless functions; anything longer goes onto a queue in Postgres and runs on our own Python workers on Railway.",
               "Each worker is lean and does one job: a routine worker for scheduled work, a document worker with its own environment that works on files, calls APIs and returns the output, and a voice worker that joins a live call and holds it. They sit in a warm pool, a free worker claims whatever comes in, and it scales with demand.",
               "On the agent side, I work on the agent itself: working memory, so it knows what's open for each user; the voice agent, where a lean agent answers on the call while our main agent works on the same request in parallel; and reliability, with an eval harness that runs the real agent against an isolated copy of a user's world, and a scanner that catches production failures every day.",
               "So I've built the run, the isolation and the testing layers, and the agent on top of them. What I haven't done yet is remote browsers or a platform shared by several teams, and that's the part I'd be growing into here."],
         "land": "Platform: lean Python workers, one job each, a warm pool that claims and scales. Agent: memory, voice, evals. Gaps named.",
         "swaps": [{"when": "If she wants it in twenty seconds", "line": "At alfred_ I built both the agent and a lot of what it runs on: lean Python workers that claim jobs from a queue and scale with demand, each with one job, like documents or live voice calls. Plus the eval harness and failure scanner that keep the agent reliable."},
                   {"when": "If she asks what you haven't done", "line": "Remote browsers and sandboxed code execution at Coframe's scale, and a platform shared by several teams. The patterns carry over: isolation, claiming from a queue, tracing every run."},
                   {"when": "If an engineer asks how jobs are claimed", "line": "Postgres queues with pgmq; a worker takes the next job with SKIP LOCKED, so two workers never get the same one, and a scheduled job catches anything missed."}],
         "notes": ["From your account on 1 October: routine worker, document worker with its own environment, voice worker joining a room, a warm pool claiming jobs, scaling with demand. Check the scaling details before saying more than 'scales with demand'."]},
    ]},
    {"group": "Your work, in plain words", "blurb": "Your strongest work, a hard problem, evals and a failure, each told outcome first.", "items": [
        {"q": "What's the project you're proudest of?", "short": "Strongest project", "tests": "Can you pick one and say why it mattered?",
         "a": ["The eval harness at alfred_. When I joined, nobody could say whether a new version of the agent was better than the old one; people tried it and had opinions.",
               "Now every real failure in production can become a test case, and a big change runs against a little over a hundred of them before it ships. It's how we signed off a full rewrite of how the agent handles conversations."],
         "land": "It turned 'we think it's better' into evidence."},
        {"q": "Tell me about a hard problem you solved in production.", "short": "A hard production problem", "tests": "Ownership, and whether you fix the cause or the symptom.",
         "a": ["Our assistant keeps track of what people owe others, from their inbox. The model kept inventing email threads, or getting who owes whom backwards, which is the worst thing an assistant can do to trust.",
               "Instead of prompting harder, I changed the design. The model now only picks from a list of real items and writes the sentence; code attaches the real ids. It can't invent a thread anymore, and tests enforce that. A whole class of mistake is gone rather than rarer."],
         "land": "Make the mistake impossible by design, not less likely by prompting."},
        {"q": "What's your experience with evaluation and reliability?", "short": "Evals and reliability", "tests": "The role's core, said so a non-engineer follows.",
         "a": ["It's most of what I do. Three pieces: a scanner that reads real conversations every day and flags the ones that went wrong; a test set built from those real failures; and a way to replay the real agent against a frozen copy of the user's world, so we can compare versions fairly.",
               "And safety rules in code, not in the model: the agent always asks before it sends an email or deletes something that can't be undone."],
         "land": "Find real failures, turn them into tests, and gate the risky actions in code."},
        {"q": "Tell me about a failure you learned from.", "short": "A failure you learned from", "tests": "Honesty, and what changed afterwards.",
         "a": ["Our test set passed an answer that was actually wrong. A user asked for a ledger of every financial event across their accounts, and the agent produced a clean one that left out two refunds. Every check we had passed, because we checked the shape of the answer, not whether it was complete.",
               "A user noticed, not us. The fix was to check against what we know is true: our snapshot knows how many events are in that window, so the test now asserts every one appears. I think about 'does it look right' versus 'is it right' a lot more since."],
         "land": "Check against ground truth you hold, not against how the answer looks."},
    ]},
    {"group": "How you work", "blurb": "Small teams, what you want next, and AI tools.", "items": [
        {"q": "How do you work in a small team?", "short": "Small teams", "tests": "Ownership without a backlog.",
         "a": ["I'm comfortable with nobody handing me a backlog. On a small team you look at what's breaking and what's being asked, and you decide.",
               "If I disagree, I make my case once, with evidence, ideally a real example or a quick prototype, and then commit to whatever we decide. Small teams can't afford relitigating."],
         "land": "Decide from what's breaking; argue once with evidence, then commit."},
        {"q": "What are you looking for next?", "short": "What you want next", "tests": "Does the role fit where you're headed?",
         "a": ["Owning the platform layer that a lot of agents run on, rather than one agent. And staying close enough to agents in production that I know what breaks before most teams hit it.",
               "A small, fast team where the agents are the product is pretty much the quickest way I know to get there."],
         "land": "The layer many agents run on, close to where they break."},
        {"q": "How do you use AI tools day to day?", "short": "AI tools, day to day", "tests": "Fluent with them, and careful.",
         "a": ["Heavily, with scaffolding: Claude Code with project instructions and skills for the jobs I repeat, a review pass, and a check that runs the real thing instead of trusting that it compiled.",
               "I let it drive on the well-tested, boring parts and take over on permissions, concurrency and database changes. And I don't trust an agent's own report of what it did, which is the same instinct as our product's guard against the agent claiming actions it never took."],
         "land": "Heavily, with checks; never trust a self-report, from a model or from yourself."},
    ]},
]

QA_ORDER = ["Coframe and the role", "Your work, in plain words", "How you work"]

# Questions you ask, three groups: for Neesha and the process, about the Agent Platform team,
# and about the company. One or two in total on a fifteen-minute call; the rest are spares.
ASK_3C = [
    {"id": "process", "title": "For Neesha, and the process", "when": "At the end, first. Around minute eleven.",
     "why": "She decides whether to pitch you. Asking how she decides, and inviting a concern, is what senior candidates do: it shows you want to meet the bar, not only pass the call.",
     "how": ["Ask one, then listen fully.", "If she raises a concern, answer it in two sentences; don't argue it."],
     "items": [
         {"to": "Neesha", "q": "What does the rest of the loop look like after today, and roughly what's the timeline?",
          "loop": "Your first question at the end, always.", "why": "Practical, and shows you're planning to go further."},
         {"to": "Neesha", "q": "When you bring someone to the team, what makes them stand out?",
          "loop": "After the timeline, if there's a minute.", "why": "It tells you what to lead with in the next round."},
         {"to": "Neesha", "q": "Is there anything in my background you'd want me to make clearer before you put me forward?",
          "loop": "Last, before she closes.", "why": "Inviting a concern while there's time to answer it is the most senior move on a screen."}]},
    {"id": "team", "title": "About the Agent Platform team", "when": "If she has sold the role and there's time. One question.",
     "why": "It shows you think about scope and how the work gets judged. If she doesn't know, that's fine: ask who in the loop would.",
     "how": ["Bridge from her pitch: 'You mentioned X...'", "If she says it's a question for the team, ask who you'd meet."],
     "items": [
         {"to": "Neesha", "q": "What does the platform team own, compared with the engineers building the agents themselves?",
          "loop": "After she describes the role.", "why": "Scope first: it shows you know there are two roles and where the line sits."},
         {"to": "Neesha", "q": "What's the hardest problem on the agent platform right now?",
          "loop": "If she's technical enough to answer; otherwise save it for the team.", "why": "You want the hard problem, not the perks."},
         {"to": "Neesha", "q": "How do agents get checked before a change ships, and how do you catch a regression after?",
          "loop": "Save for the technical rounds if she hesitates.", "why": "Your strongest area, asked as curiosity."},
         {"to": "Neesha", "q": "How big is the team, and who would I work with most?",
          "loop": "Any time she mentions the team.", "why": "Plain and useful; tells you the size of the job."}]},
    {"id": "company", "title": "About the company", "when": "Only if she opens the door, or there's time left over.",
     "why": "It shows you think about the customer, not only the code. Keep it to one.",
     "how": ["One question, then let her talk."],
     "items": [
         {"to": "Neesha", "q": "What do customers actually buy: the experiments, the lift, or the time saved?",
          "loop": "After she mentions a customer.", "why": "Commercial sense; it tells you what the platform is measured against."},
         {"to": "Neesha", "q": "Beyond the product, where do agents run inside Coframe today: your own codebase, go-to-market?",
          "loop": "If she talks about how the company works.", "why": "The posting says the platform serves both; you read it."},
         {"to": "Neesha", "q": "What's next for the product over the next year?",
          "loop": "Last, if nothing else fits.", "why": "Shows you're thinking about staying, not only joining."}]},
]
ASK = []

TRAPS = [
    ("Going deep technically", "She is listening for outcomes and scope. Leave out frameworks, queues and table names unless she asks how."),
    ("Rambling past ninety seconds", "Stop after the last line of the intro. Fifteen minutes has no room for a three-minute answer."),
    ("Raising work authorization first", "Only if she asks. One sentence, then back to the role."),
    ("Bluffing about Coframe", "Say 'from what I read'. If you don't know, ask; she is there to tell you."),
    ("Confusing her with someone else", "Another Neesha Malik works at a different company in New York. Nothing about her applies; use only what Coframe publishes."),
    ("Quoting their numbers as fact", "Revenue and lift figures are theirs: 'they report'."),
    ("Funding, crunch, colleagues' names", "Never, about alfred_."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "intro-short", "prompt": "Tell me about yourself, briefly.", "target": "30 seconds", "seconds": 30, "ref": "#say-intro-short"},
    {"id": "why-coframe", "prompt": "Why Coframe, and why Agent Platform?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-coframe"},
    {"id": "leave", "prompt": "Why leave alfred_ after six months?", "target": "45 seconds", "seconds": 45, "ref": "#say-leave"},
    {"id": "now", "prompt": "What are you working on right now? For someone who isn't an engineer.", "target": "60 seconds", "seconds": 60, "ref": "#say-now"},
]

MOCK_HOW = "Say 'run the Coframe mock, 15 minutes' in chat: Neesha screens, sells the role, then asks for your questions."
