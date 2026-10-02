"""Vanguard, client interview, Wednesday 7 October 2026, 3 PM (moved from Friday 2 October): Conversational AI.

Vanguard's own team interviews; Mphasis (the systems integrator) organises the call. Mphasis said
Vanguard picked him, and Rama (Rajaratnam, Mphasis, the organiser) sent the two areas on 1 October: conversational AI (conversation design, intent and
entity modelling, error analysis, production improvements) and deep NLP and LLMs (text
classification, embeddings, LLM fundamentals, the Transformer). This page was first built as the
3 Dots IT page on 1 October and moved here when the client turned out to be Vanguard.

Facts about Vanguard come from the research in SOURCES. Platform facts and numbers come from the
docs and papers cited in each question's reading. Pranav's facts come from his master reference,
quoted exactly, and from his existing loop pages. He has not shipped on Dialogflow, Lex, CLU, Rasa,
Kore.ai or Cognigy, and the page never says he has. Logistics answers (rate, duration, location,
start date) stay in chat.
"""

LOOP = {
    "id": "vanguard",
    "title": "Vanguard, Conversational AI",
    "company": "Vanguard",
    "subtitle": "Client interview with Vanguard's team, via Mphasis",
    # Brand colour for the hub's wordmark. Vanguard's red: .vg-button--red
    # {background-color: #96151d} in investor.vanguard.com's clientlib-base CSS.
    # brand_dark: the same hue lightened to 5:1 on the dark surface, kept a step darker
    # than Mphasis's pink so the two read apart in dark mode.
    "brand": "#96151D", "brand_dark": "#EA6971",
    "when_iso": "2026-10-07T15:00:00-04:00",
    "when": "Wednesday 7 October, 3:00 PM",
    "who": ("Vanguard's team: three engineers on the invite (Sai Atukuri, Sai Krishna, Rajaratnam Rathnakumar), "
            "with Suruchi Kale optional. Mphasis organises it: Rama (Rajaratnam) sent the invite and the two areas; "
            "Mphasis colleagues are on it as optional."),
    "format": ("A client technical interview with the team you would join, most likely scenario-led: 'a bot "
               "misclassifies an intent, how do you debug it'. Expect your story first, then questions across the "
               "two areas: conversational AI (design, intents and entities, error analysis, production) and "
               "deep NLP and LLMs (classification, embeddings, LLM fundamentals, the Transformer)."),
    "bar": ("Senior here means answering a scenario with a method: what you'd look at first, the trade-off, and a "
            "real example from your work, with the financial-services line held: no advice, authenticated before "
            "account data, a licensed person for anything that needs one. Say plainly that you haven't shipped on "
            "the classic NLU platforms, and show that the NLP and the error analysis underneath them are yours."),
    "plan_kicker": "Before Wednesday, 3 PM",
    "extra": ("<b>Work in this order.</b> 1. Skim <a href=\"#/overview/onepage\">the one page</a> above. "
              "2. Learn: take the path a module at a time, learn, check, explain, say; the squares show where you stand. "
              "3. Test: 'Test me on everything' until the weak squares turn. "
              "4. Your work: the alfred_ module (private, on this device) before any mock. "
              "5. Mock: say 'run the Vanguard mock' in chat. "
              "Deeper material sits in the tracker sessions wc25 to wc31 and the guide's "
              "<a href=\"../SYSTEM%20DESIGN.html#/designs/virtual-assistant\" target=\"_blank\" rel=\"noopener\">enterprise virtual assistant</a>."),
}

SESSION_IDS = [
    ("wc25", "1"), ("wc26", "2"), ("wc27", "3"),
    ("wc28", "4"), ("wc29", "5"), ("wc30", "6"), ("wc31", "7"),
]

PREP_LEAD = ("Say comes last. Each area is taught first in its session, and every question here links back to that "
             "session, its Baseline topic and the reading. Then your story out loud with the timer, and two drills: two "
             "intents confused, and attention.")

SHOW_UP = [
    ("Lead with what you've built that matches.", "At alfred_ a fast first pass answers or escalates to a heavier agent, entities in chat resolve to real records, and anything that sends goes through a preview and an explicit confirm, with floors in code. A production failure scanner reads real conversations and separates genuine failures from expected behaviour. MetaRAG used TF-IDF weighted embeddings: 82.5% precision against a 73.3% baseline."),
    ("Ask about the platform early.", "Vanguard's assistant platform isn't public. In the first minutes ask which assistant the role supports (the investor chat, the phone channel, or crew-facing agent assist) and what it runs on: Vanguard's own stack on AWS, or a platform Mphasis brings. Mphasis is a Kore.ai partner, so Kore.ai is possible; that's inference, so ask, don't assume. Then use their words."),
    ("Hold the financial-services line.", "No investment advice: an advice-seeking question goes to a licensed person or the advice product, and compliance owns where education ends and advice starts. Authenticated before any account data, and the assistant never asks for a password, a full SSN or a security code; Vanguard's own security page says it never asks for a security code."),
    ("Say the platforms plainly.", "You haven't shipped on Dialogflow CX, Cognigy, Lex, CLU or Kore.ai. Say it once, then what carries over: the NLU underneath, the error analysis and the evals are the same work, and you know how each platform models intents, thresholds and fallbacks."),
    ("Answer a scenario with a method.", "What you'd check first, how you'd split the cause, the fix, and how you'd know it worked. 'Two intents are confused' starts at the confusion matrix and the actual utterances, not at the F1."),
    ("Numbers, exactly.", "5,000-plus active users at alfred_; per-user LLM cost down about 30%; notifications about 90 seconds to about 3. MetaRAG: 82.5% precision, 0.925 Hit@10, 25% hallucination reduction, p99 under 300 ms at 10K queries a day. MockFlow-AI: sub-400ms end to end. Vanguard's numbers are 'from what I read'."),
    ("Have the hybrid answer ready.", "A fast classifier for confident turns, an LLM for the uncertain ones and for out-of-scope, and deterministic code for anything that moves money or data. One Amazon paper measured that routing within 2% of the LLM's accuracy at half the latency."),
    ("Theory: the mechanism, then where you used it.", "Attention, embeddings, calibration: two sentences on how it works, one on where it showed up in your work. Then stop and let them go deeper."),
    ("Logistics: one line each.", "Rate, duration, location and start date: your answers are in chat. They are for Mphasis afterwards, not Vanguard's team."),
]

STORY_BLURB = "Your intro, why this role, the work closest to it, and logistics."

# Vanguard, its regulators and Mphasis: every link opened 2026-10-01 (r5, CONFIRMED only).
# One home: SOURCES lists them and the Vanguard questions link them by key through _S.
_V = {
    "v_letter": {"url": "https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/salim-letter-to-investors-2026.html", "label": "Vanguard: letter to investors, 2026",
                 "why": "Chat serves more than 2 million investors a month, AI features being added; an AI capability in Digital Advisor pilots later in 2026 and launches early 2027.", "m": 8},
    "v_fortune": {"url": "https://fortune.com/2025/12/24/vanguards-cio-niti-tandon-ai-digital-advisor/", "label": "Fortune: Vanguard's CIO on AI (Dec 2025)",
                  "why": "A chatbot piloted with about 2,000 employees; the CIO's concerns are hallucinations and the bot veering into financial advice.", "m": 6},
    "v_summaries": {"url": "https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/vanguards-new-genai-capability-for-advisors.html", "label": "Vanguard: generative AI article summaries for advisers (May 2025)",
                    "why": "Its first client-facing generative AI, in beta; it generates the disclosures that go with each summary.", "m": 4},
    "v_insights": {"url": "https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-launches-expert-insights-equipping-advisors-with-ai-powered-portfolio-analysis-expertise-04092026.html", "label": "Vanguard: Expert Insights for advisers (Apr 2026)",
                   "why": "AI portfolio analysis, piloted with select advisers.", "m": 4},
    "v_sloan": {"url": "https://sloanreview.mit.edu/article/investing-in-ai-payoffs-at-vanguard/", "label": "MIT Sloan Management Review: AI payoffs at Vanguard",
                "why": "Crew Assist on Azure OpenAI for contact-center crew; governance that evaluates models, detects bias and drift, and monitors use.", "m": 12},
    "v_agentassist": {"url": "https://www.vanguardjobs.com/career-blog/2025/05/14/ai-engineer/", "label": "Vanguard careers blog: an AI engineer's work (May 2025)",
                      "why": "Call Center Agent Assist in full production: generative AI for client service representatives.", "m": 5},
    "v_responsible": {"url": "https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/responsibly-scaling-ai-to-better-serve-our-clients.html", "label": "Vanguard: responsibly scaling AI (May 2026)",
                      "why": "Augment, not replace; trust and accuracy; AI diffused into the system.", "m": 5},
    "v_cloud": {"url": "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/sets-us-apart/client-centered-technology.html", "label": "Vanguard: client-centered technology",
                "why": "Enhancing phone and chat support; 85% of systems moved to the cloud in five years.", "m": 3},
    "v_analyst": {"url": "https://aws.amazon.com/blogs/machine-learning/building-ai-ready-data-vanguards-virtual-analyst-journey/", "label": "AWS blog: Vanguard's Virtual Analyst (Apr 2026)",
                  "why": "Natural-language questions to SQL on Amazon Bedrock with Guardrails; 50-plus ground-truth pairs used as few-shot examples and as the evaluation set.", "m": 10},
    "v_frontier": {"url": "https://corporate.vanguard.com/content/dam/corp/research/pdf/the_ai_advice_frontier.pdf", "label": "Vanguard research: The AI advice frontier (Sept 2026)",
                   "why": "About one in three investors used AI for financial guidance; most trust it little; they want human oversight and embedded disclosures.", "m": 20},
    "v_security": {"url": "https://investor.vanguard.com/trust-security", "label": "Vanguard: trust and security",
                   "why": "Voice ID, passkeys, security codes; Vanguard never asks for login details, an SSN or a security code.", "m": 4},
    "v_job_agentic": {"url": "https://www.vanguardjobs.com/job/23810105/lead-cloud-agentic-ai-engineer-dallas-tx/", "label": "Vanguard posting: Lead Cloud and Agentic AI Engineer",
                      "why": "Agentic AI on Amazon Bedrock, RAG and agent orchestration; evaluation and responsible AI preferred. Another team, the same stack.", "m": 5},
    "v_job_head": {"url": "https://www.vanguardjobs.com/job/23896184/head-of-ai-ml-for-advice-wealth-and-strategic-enablement-dallas-tx/", "label": "Vanguard posting: Head of AI/ML for Advice, Wealth and Strategic Enablement",
                   "why": "Evaluation baselines before production, human-in-the-loop, deterministic fallbacks, escalation to a human advisor, Model Risk Management.", "m": 8},
    "v_job_ape": {"url": "https://freehire.me/jobs/ai-engineer-vanguard-dpyotss6", "label": "Vanguard posting (aggregator): AI Engineer, AI Powered Experiences",
                  "why": "Builds the team's conversational AI orchestration platforms and shared AI infrastructure; Python or TypeScript, AWS.", "m": 5},
    "mph_ai": {"url": "https://www.mphasis.com/home/mphasis-ai-partnership.html", "label": "Mphasis: AI partnerships",
               "why": "Mphasis calls itself Kore.ai's only distinguished Platinum Partner for conversational and generative AI. Names no client.", "m": 4},
    "finra_2409": {"url": "https://www.finra.org/rules-guidance/notices/24-09", "label": "FINRA Regulatory Notice 24-09",
                   "why": "Rules are technology-neutral: Rule 2210 content standards apply whether a person or a tool wrote it; supervision covers model risk.", "m": 10},
    "finra_chat": {"url": "https://www.investmentnews.com/regulation-and-legislation/finra-clarifies-guidelines-around-ai-chatbot-communications/253319", "label": "InvestmentNews: FINRA on AI chatbot communications (May 2024)",
                   "why": "Chatbot messages are firm communications: supervised, held to content standards, retained.", "m": 4},
    "finra_2210": {"url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2210", "label": "FINRA Rule 2210: communications with the public",
                   "why": "Fair and balanced; no promissory or misleading statements; no performance predictions.", "m": 15},
    "finra_genai": {"url": "https://www.finra.org/rules-guidance/guidance/reports/2026-finra-annual-regulatory-oversight-report/gen-ai", "label": "FINRA 2026 oversight report: generative AI",
                    "why": "Prompt and output logging, model version tracking, human review; agents acting beyond scope.", "m": 10},
    "finra_4511": {"url": "https://www.finra.org/rules-guidance/rulebooks/finra-rules/4511", "label": "FINRA Rule 4511: books and records",
                   "why": "Six years by default, in a format that meets SEA Rule 17a-4.", "m": 3},
    "sec_care": {"url": "https://www.sec.gov/about/divisions-offices/division-trading-markets/broker-dealers/staff-bulletin-standards-conduct-broker-dealers-investment-advisers-care-obligations", "label": "SEC staff bulletin: care obligations",
                 "why": "A recommendation needs a reasonable basis in the client's profile, costs and alternatives. Why a bot can't answer 'should I sell?'.", "m": 15},
    "v_writer": {"url": "https://writer.com/blog/vanguard-customer-story/", "label": "Writer: Vanguard customer story",
                 "why": "Compliance, Legal and IT as partners in the build from the start; 'practical, risk-minded'.", "m": 5},
    "sr262": {"url": "https://www.federalreserve.gov/supervisionreg/srletters/SR2602.pdf", "label": "Federal Reserve SR 26-2: revised model risk guidance (17 Apr 2026)",
              "why": "Supersedes SR 11-7; keeps effective challenge, validation and monitoring; footnote 3 puts generative and agentic AI outside its scope.", "m": 20},
}

# Every outside link, checked 2026-10-01 (r1 for the similar postings, r5 for Vanguard).
SOURCES = [dict((k, v) for k, v in s.items() if k != "m") for s in _V.values()] + [
    {"label": "Similar posting: Conversational AI Developer, Galaxy i Technologies (Dice)", "url": "https://www.dice.com/job-detail/6d7bd820-388e-4d39-81e7-ed0e087eda91",
     "why": "Dialogflow CX, CCAI, BigQuery, Node.js, GCP; chatbots and voicebots, multi-turn with error handling, webhooks; creating intents and entities."},
    {"label": "Similar posting: Google Cloud Conversational AI Developer, ASCII Group (Dice)", "url": "https://www.dice.com/job-detail/5e08da59-2148-4749-a3af-2f9ea6de0edd",
     "why": "The same Dialogflow CX and CCAI stack."},
    {"label": "Similar posting: NICE CXone / Cognigy developer, United Technology (Dice)", "url": "https://www.dice.com/job-detail/e40592e9-8c84-4401-a025-29818721572b",
     "why": "Cognigy flows, voicebots and IVR, REST, production troubleshooting; NLU and intent recognition preferred."},
    {"label": "Similar posting: Lead Conversational AI Developer, SGA (Dice)", "url": "https://www.dice.com/job-detail/73324714-ba9d-4272-8005-59ec7d82649c",
     "why": "Azure Bot Framework v4, C#/.NET, Azure OpenAI preferred."},
    {"label": "Similar posting: Chatbot Developer, Triwave (Dice)", "url": "https://www.dice.com/job-detail/40145e8c-0dba-4647-8f94-b4d273073754",
     "why": "Bot Framework moving to Microsoft's agents stack; classical NLU combined with LLMs for routing."},
    {"label": "Similar posting: Senior AI Engineer, Conversational and Agentic AI, Trigint (Dice)", "url": "https://www.dice.com/job-detail/e0fd510e-109e-4e54-965f-19db6101e5e3",
     "why": "AWS Bedrock and AgentCore, RAG, embeddings, MCP, multi-turn, Langfuse, Ragas; Lex or Connect nice to have."},
    {"label": "Similar posting: Conversational AI Engineer, Eversana", "url": "https://zapply.jobs/jobs/63d1956f-79c2-48e5-ad45-9e1934e6ee9e/",
     "why": "Cognigy, NLU and intent modelling, production issue analysis; GenAI nice to have."},
]

# The Overview: Vanguard as the client, Mphasis as the organiser (inference said as such).
COMPANY = [
    "Vanguard is an investment manager, not a bank, serving investors, advisers and retirement plans. Its assistants today are staged by risk. Crew-facing generative AI is live: Crew Assist, on Azure OpenAI, answers contact-center crew from internal content, and Call Center Agent Assist is in full production. Client-facing work is careful and staged: article summaries for advisers in beta (May 2025) that generate their own disclosures, Expert Insights piloted with advisers (April 2026), and an AI capability inside Digital Advisor piloting later in 2026. Its investor chat already serves more than 2 million people a month. The concerns its CIO named are hallucinations and the bot veering into financial advice.",
    "Stack clues from Vanguard's own material: AWS (85% of systems moved to the cloud), Amazon Bedrock with Guardrails for its Virtual Analyst, and postings that ask for Bedrock, RAG, agent orchestration, evaluation and Model Risk Management, with Python or TypeScript. Summaries of the chat-assistant team's postings, now closed, also name LangGraph and MCP, but those were seen only in search results. No source names the vendor of the investor chat or the phone channel; don't assume one.",
    "Mphasis organises the call; no public source links Mphasis and Vanguard, so this is most likely a placement into a Vanguard team (inference). Mphasis calls itself Kore.ai's only distinguished Platinum Partner, so ask early which platform the role supports: Kore.ai through Mphasis, or Vanguard's own stack. That too is inference, not fact.",
]

POSTING = {
    "lead": "Rama at Mphasis sent the two areas the interview will concentrate on (1 October), quoted: “Conversational AI: Build and enhance complex virtual assistants, including conversation design, intent/entity modeling, error analysis, and production improvements.” And “Deep NLP & LLM: Strong expertise in NLP, text classification, embeddings, LLM fundamentals, and Transformer architecture.” The lists below come from those two areas and from similar postings, not from Vanguard.",
    "facts": [["Client", "Vanguard: the team you would join"], ["Arranged by", "Mphasis (Rama sent the invite and the two areas)"],
              ["When", "Wednesday 7 October, 3:00 PM"], ["Platform", "Not confirmed: ask early in the call"]],
    "does": [
        "Build and extend virtual assistants for chat and voice: multi-turn flows, prompts, reprompts and error handling.",
        "Model intents and entities: the taxonomy, training phrases, entity types, slots and confidence thresholds.",
        "Write webhooks and fulfillment that connect the assistant to backend systems (from similar postings).",
        "Analyse production transcripts: misclassified intents, fallbacks and escalations, fixed in batches.",
        "Improve the assistant from analytics: containment, no-match and escalation rates, A/B tests of flows.",
        "Add LLMs where they help: generative fallback, retrieval for FAQs, routing for uncertain turns.",
    ],
    "wants": [
        "Strong NLP: text classification, embeddings, LLM fundamentals and the Transformer.",
        "Conversation design for chat and voice.",
        "An enterprise NLU platform: Dialogflow CX and CCAI most often in similar postings, or Cognigy, Azure Bot Framework and CLU, Amazon Lex.",
        "Production troubleshooting and error analysis on real conversations.",
        "Generative AI with guardrails: RAG, prompting, evaluation.",
        "APIs and integrations: REST, Node.js or Python, a cloud platform (from similar postings).",
    ],
}

# Your story, in your words. Items marked "verbatim" are Pranav's own text: never polish them.
SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. Land on conversational AI and the NLP under it.",
     "probes": ["What does alfred_ do?", "What do you own there?", "Have you worked on a chatbot or virtual assistant?", "Which NLU platforms have you used?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",  # verbatim
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad — backend, AI, infrastructure, and product work all kind of blended together.",  # verbatim
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation — things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",  # verbatim
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",  # verbatim
         "And the closest part to this role is what sits in front of the agent. At alfred_ a fast first pass decides whether a message can be answered or needs the heavier agent, things like 'that email' resolve to real records, anything that sends goes through a confirm step in code, and a scanner reads real conversations every day to find what went wrong. So building an assistant and improving it from its transcripts is pretty much the work I already do."],
     "swaps": [{"when": "If they ask what alfred_ is, in a line", "line": "An AI executive assistant that works over text message and the web. It handles people's email and calendar end to end, for 5,000-plus active users."},
               {"when": "If they ask which NLU platforms you've used", "line": "Honestly, not Dialogflow or Lex in production. I've built the layer in front of LLM agents myself: routing, entity resolution, confirmation in code. The understanding there is an LLM with typed tool schemas, not a trained classifier, but the modelling and the error analysis are the same work, and I'd pick up the platform quickly."}],
     "land": "Research, shipping, production assistants, and the layer in front of the agent: understanding and improving it from real conversations.",
     "notes": ["Paragraphs 1 to 4 are your words, unchanged from ZenML and Coframe. Only the last line is new, pointed at conversational AI.",
               "About ninety seconds. Stop after the last line and let them choose where to go."],
     "never": ["Never say you've used Dialogflow, Lex, CLU, Rasa, Kore.ai or Cognigy.", "Never mention alfred_'s funding, a crunch, or colleagues' names."]},

    {"id": "why-role", "title": "Why this role?", "length": "about 60 seconds",
     "when": "After the intro, or when they ask why Vanguard or why conversational AI.",
     "probes": ["Why Vanguard?", "What do you know about our assistants?", "Why classic NLU when everyone is moving to LLMs?"],
     "say": [
         "Honestly, it's the way Vanguard is doing it. From what I read, the generative AI went to crew first, Crew Assist and agent assist in the contact center, and the client-facing side is staged: summaries for advisers in beta, then a pilot inside Digital Advisor. I think that's the right order, and it's how I'd do it.",
         "And the concern your CIO named, keeping the bot from veering into advice and watching for hallucinations, is pretty much the problem I work on. At alfred_ anything that sends or deletes goes through a confirm step in code before it runs, and a scanner reads real conversations every day to find what went wrong.",
         "The two areas in the role are the two halves of what I do. One is the assistant: how the conversation is designed, how intents and entities are modelled, and how you find and fix what's going wrong in production. The other is the NLP underneath: classification, embeddings, how the models work.",
         "So it's the work I already do, in a place where being right matters more than being first."],
     "swaps": [{"when": "If they ask why classic NLU at all", "line": "I think the classic layer is the part you can measure and control: a confusion matrix, a threshold, a test set. The LLM is great for the long tail and out-of-scope. Most good assistants I've read about use both, and that's how alfred_ works too."},
               {"when": "If they ask what you know about the scale", "line": "From what I read, your chat already serves more than 2 million investors a month, and you're adding AI features to it. At that volume a small error rate is a lot of people, so the evaluation has to come first."}],
     "land": "Vanguard is doing generative AI in the right order, and keeping an assistant inside its lines is my daily work.",
     "notes": ["New, in your voice. Vanguard's facts come from SOURCES: say 'from what I read', and don't name a vendor for their chat; none is public.",
               "Say 'your CIO', not a name. If they ask why a contract role through Mphasis, that's logistics: one line, then back to the work."]},

    {"id": "closest", "title": "What have you built that's closest to this?", "length": "about 2 minutes",
     "when": "When they ask about your experience with chatbots, virtual assistants or NLU. Outcome first, one design choice, then stop.",
     "probes": ["How does the first pass decide to escalate?", "How do you decide when to ask the user?", "How do you find failures?", "Was any of it on a platform like Dialogflow?"],
     "say": [
         "The closest is alfred_. It's an AI assistant over text and the web. A fast first pass answers what it can from what it can read and escalates the rest to a heavier agent, and code guards turn a reply that promises an action into an escalation instead of shipping it. I also built entity resolution in chat, so 'the second email' or 'that meeting' points at a real record, and the confirm flow: anything that sends gets a preview first and runs only on an explicit confirm, with floors in code that no prompt can override.",
         "Then error analysis. I built a production failure scanner that reads real conversations, separates genuine failures from expected behaviour, and promotes the real bugs for triage. Those feed a replay bench of real production turns, graded by a person, so a change is judged on what users actually hit before it ships.",
         "Before that, MockFlow-AI: a real-time voice interview platform I built from scratch, under 400 milliseconds end to end. The conversation moves through stages in a state machine, and the model can only move it by calling a transition tool. That's the nearest thing I've built to flows and pages.",
         "And on the NLP side, MetaRAG at UIC: TF-IDF weighted embeddings with recursive chunking got 82.5% precision against a 73.3% baseline, and 0.925 Hit Rate at 10."],
     "swaps": [{"when": "If they ask about WheelPrice", "line": "At WheelPrice I built an AI fitment assistant that could only answer through tools against verified data."},
               {"when": "If they ask about a classic platform", "line": "Not in production. The concepts map closely: a page with a form in Dialogflow CX is a stage with required slots, and a route is a transition. I'd want a week with their taxonomy and their transcripts."},
               {"when": "If they ask about voice", "line": "I own alfred_'s voice agent, phone and web. In MockFlow-AI the pipeline was Deepgram Nova-2 for speech and Silero for voice activity."}],
     "land": "A first pass that answers or escalates, entity resolution in chat, a confirm flow in code and a failure scanner in production; stages driven by tools in voice; TF-IDF weighted embeddings in research.",
     "notes": ["Checked against the alfred_ code on 2 October 2026 by your alfred_ agent: what is live is the first pass with its guards, entity resolution in chat, the confirm flow with code floors and idempotency, the grounding guards, and the failure scanner. The verdict gate (policyGate) was removed on 3 August; talk only about what is live.",
               "There is no risk score, no five verdicts and no trained intent classifier in the code today. The full map, with what is an LLM and what is code, is in the private alfred_ module on the Learn tab.",
               "The fitment line is worded as on the Coframe page; there is no more detail in your master reference, so don't add any."],
     "never": ["Don't call alfred_'s classifier 'Dialogflow-like' or name a platform you haven't used."]},

    {"id": "logistics", "title": "Logistics they may ask", "length": "a line each",
     "when": "Your answers are in chat, not on this page. Vanguard's team rarely asks; Mphasis will.",
     "probes": ["Are you available full time?", "Where are you based? Remote or on site?", "When could you start?", "Work authorization?", "Rate?"],
     "say": [],
     "land": "Say each once, then back to the role.",
     "notes": ["**Rate and terms:** for Mphasis, never Vanguard's team. Your number is in chat.",
               "**Location, start date, work authorization:** your answers from chat, one sentence each.",
               "**Duration:** ask Mphasis afterwards; similar postings run 6 to 12 months."],
     "never": ["Don't negotiate with Vanguard's team."]},
]

# Reading shared by many questions, as {url, label, why, m}.
# The question bank, the research pass and the sessions' material now live in one learning path:
# interviews/vanguard.learn.json (Learn tab), built 3 October 2026. The private alfred_ module is
# private/loops/vanguard.js. The old Prep bank and Research tab are in git history (before that date).
QA = []
TABS = ["overview", "learn", "mocks"]


# Questions you ask: Vanguard's team during the call, Mphasis after it.
ASK_3C = [
    {"id": "client", "title": "For Vanguard's team", "when": "The platform question early if nobody has said; the rest at the end.",
     "why": "The platform and the assistant aren't public, so the first answer reframes everything after it. The rest show you think about evaluation, compliance and failure, not only building.",
     "how": ["Ask the platform question in the first minutes, plainly.", "At the end, one or two; listen fully, then one follow-up on what they said."],
     "items": [
         {"to": "Vanguard's team", "q": "Which assistant does this role support: the investor chat, the phone channel, or crew-facing agent assist? And what does it run on?",
          "loop": "Early, if it hasn't come up.", "why": "Tells you which half of your prep to lean on, and lets you use their words."},
         {"to": "Vanguard's team", "q": "Is there an intent and entity layer beside the LLM and agent layer, or are they being merged?",
          "loop": "With the platform question.", "why": "The two areas in the invite read like both; this settles it."},
         {"to": "Vanguard's team", "q": "How do you evaluate a change before it ships, and who approves it?",
          "loop": "At the end, first.", "why": "Shows evaluation is how you work; their answer tells you how mature the loop is."},
         {"to": "Vanguard's team", "q": "Where does compliance review sit: on each prompt and content change, or on releases?",
          "loop": "At the end.", "why": "The real constraint on how fast the assistant can change."},
         {"to": "Vanguard's team", "q": "What would the first 90 days look like for someone in this role?",
          "loop": "At the end.", "why": "What they need first, and what success looks like to them."},
         {"to": "Vanguard's team", "q": "What's the hardest failure the assistant has right now?",
          "loop": "Last, if there's time.", "why": "You want the real problem; it's also what you'd work on first."}]},
    {"id": "mphasis", "title": "For Mphasis, afterwards", "when": "After the call, by message or phone.",
     "why": "Practical questions for Mphasis, never Vanguard's team.",
     "how": ["Rate and terms stay in chat; settle them with Mphasis."],
     "items": [
         {"to": "Mphasis", "q": "What's the scope of the role: which Vanguard team, which assistant, and who I'd work with day to day?", "loop": "After the call.", "why": "What you'd actually be doing."},
         {"to": "Mphasis", "q": "How long is the engagement, and what are the next steps after this call?", "loop": "After the call.", "why": "Duration and process."},
         {"to": "Mphasis", "q": "Rate and terms.", "loop": "With Mphasis only.", "why": "Your numbers are in chat."}]},
]
ASK = []

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "why-role", "prompt": "Why this role?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-role"},
    {"id": "two-intents", "prompt": "Two intents keep getting confused. What do you do?", "target": "90 seconds", "seconds": 90, "ref": "#q-two-intents"},
    {"id": "attention", "prompt": "Explain attention to me.", "target": "90 seconds", "seconds": 90, "ref": "#q-attention"},
]

MOCK_HOW = "Say 'run the Vanguard mock' in chat: Vanguard's engineers, scenario-led, 30 minutes."
