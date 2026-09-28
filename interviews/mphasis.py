"""Mphasis, technical interview, 28 September 2026: agentic skills and AI fundamentals.

The recruiter's note: they will test agentic skills and may touch the fundamentals of
AI; there may be a short coding exercise on a shared screen. Two hours to prepare.
Algorithms live on their own page, CODING.html, which this page links to.
"""

LOOP = {
    "id": "mphasis",
    "title": "Mphasis, technical",
    "subtitle": "Agentic AI, AI fundamentals, a short coding exercise",
    "when_iso": "2026-09-28T14:30:00-04:00",
    "when": "Today, Monday 28 September (time in the invite)",
    "who": "A technical panel. The invite came from the RPO consultant, copying two others.",
    "format": ("Video on for the whole call, recorded. Personal laptop, not a phone, no headphones, "
               "an ID ready. A short coding exercise on a shared screen is likely. They will test "
               "agentic skills and may go into how AI works underneath."),
    "bar": ("Say what a thing is in one line, then show it from your own work. Code out loud: brute force "
            "first, then better, with the complexity said. Tie agentic answers to alfred_."),
    "plan_kicker": "The next two hours",
    "extra": ("Algorithms and coding patterns are on their own page: "
              "<a href=\"../CODING.html\" target=\"_blank\" rel=\"noopener\">Algorithms and coding</a>. "
              "Agent design at depth is in your "
              "<a href=\"../SYSTEM%20DESIGN.html#/designs/alfred\" target=\"_blank\" rel=\"noopener\">system design guide, alfred_</a>."),
}

SESSION_IDS = []

PREP_LEAD = ("Two hours. Read how to show up, then open the banks in order: Mphasis, AI fundamentals, agents, "
             "RAG and GraphRAG in code, quick Python. Then twenty minutes on the algorithms page.")

SHOW_UP = [
    ("The first two hours: a plan.", "20 min Mphasis and your story; 30 min AI fundamentals and agents; 30 min RAG and GraphRAG code; 20 min quick Python; 20 min algorithms page, patterns only."),
    ("Set up before you join.", "Laptop plugged in, camera at eye level, light in front of you, no headphones, ID on the desk, an editor open and a blank file ready to share, pop-up blocker off."),
    ("One line, then your own example.", "Every fundamentals answer: what it is in a sentence, then where you used it. Tokens and attention, then alfred_'s prompt caching; RAG, then MetaRAG."),
    ("Code out loud.", "Restate the problem, ask about input size and edge cases, say the brute force and its cost, then the better approach, then write it. Run one example by hand at the end."),
    ("Syntax is not the test.", "If you forget an API, say what it does and write a plausible call. Structure and reasoning score; a missing import doesn't."),
    ("Agents: loop, tools, memory, guardrails, evaluation.", "Every agent answer can be walked in that order, with alfred_ as the example."),
    ("They are an IT services company.", "Their clients are banks, insurers and airlines with old systems. Reliability, auditability and cost matter more than novelty. Say how you'd make it safe."),
    ("Don't bluff.", "'I haven't used that, here's how I'd reason about it' is a strong answer in a recorded round."),
]

STORY_BLURB = "Your career in ninety seconds, then why Mphasis, why this role, why leave alfred_ and why now, each written for Mphasis."

SOURCES = [
    {"label": "Mphasis NeoZeta: generative AI for legacy modernization", "url": "https://www.mphasis.ai/home/neozeta-generative-ai-enterprise-modernization-platform.html",
     "why": "Relearns legacy code (COBOL, C++, Natural, Java) with deterministic parsers plus generative AI into explainable knowledge."},
    {"label": "Mphasis unveils NeoCrux and NeoZeta (press release)", "url": "https://www.prnewswire.com/news-releases/mphasis-unveils-mphasis-neocrux-and-mphasis-neozeta-a-powerful-duo-for-ai-driven-software-engineering-and-enterprise-modernization-302207334.html",
     "why": "NeoCrux: AI-driven software engineering. NeoZeta: enterprise modernization."},
    {"label": "Mphasis.ai", "url": "https://www.mphasis.ai/home.html", "why": "Agentic and enterprise AI; an evergreen knowledge graph over code and documents."},
]

SCRIPTS = [
    {"id": "intro", "title": "Tell me about yourself", "length": "about 90 seconds",
     "when": "The opener. In an L1 AI/ML round it sets which of your projects they dig into, so put MetaRAG and alfred_ in it on purpose.",
     "probes": ["Tell me more about MetaRAG.", "What do you do day to day at alfred_?", "What's your strongest AI/ML work?", "Why Mphasis?"],
     "say": [
         "Sure. I started out in computer science research at UIC, where I worked on applied ML and LLM systems. That gave me a pretty strong foundation in actually building and evaluating these systems, rather than just using the models.",
         "One of those was MetaRAG, a retrieval framework for enterprise knowledge. It ended up running in a production code-translation use case, about ten thousand queries a day, and the paper got accepted at IEEE CAI.",
         "From there I joined WheelPrice, which was a much more startup-oriented environment. I was working across the stack and got a lot more exposure to shipping things that were actually being used by customers. It was a small engineering team, so I had to be pretty broad \u2014 backend, AI, infrastructure, and product work all kind of blended together.",
         "After that I joined alfred_, where I've been working as a founding LLM engineer. It's an AI assistant, and my work has become much more focused on reliability and evaluation \u2014 things like building the eval harness, production failure detection, working memory, and making sure agent changes actually improve the product rather than just looking better on a benchmark.",
         "The common thread through all of that has really been building AI systems in environments where you don't have a perfectly defined problem in front of you. You have to figure out what's broken, decide what to build, and then own it through production.",
         "And that's pretty much why Mphasis is interesting to me. Your clients run systems where a wrong answer is expensive, and making AI reliable and checkable on those systems is the work I've been doing, just with bigger stakes."],
     "swaps": [{"when": "If they cut you short: the one-line arc", "line": "Research on retrieval and multi-agent reasoning, then shipping products at a startup, and now making an agent reliable in production for five thousand users."},
               {"when": "If they ask for the numbers on MetaRAG", "line": "82.5% precision against a 73.3% content-only baseline, 0.925 hit rate at ten, and about 25% fewer hallucinations, measured with an automated evaluation framework."}],
     "land": "Research, then shipping products, then making agents reliable in production; Mphasis is the same problem with bigger stakes.",
     "notes": ["Changed from your ZenML intro: paragraphs 1, 3, 4 and 5 are your words, unchanged. Paragraph 2 (MetaRAG) is new, because a production code-translation use case is the closest thing you have to Mphasis's core work. The last line now points at Mphasis instead of Kitaru.",
               "About ninety seconds. Stop after the last line and let them pick where to go; MetaRAG and alfred_ are both baits you are ready for.",
               "Numbers if they dig: MetaRAG 82.5% precision, 0.925 Hit@10, 25% hallucination reduction, p99 under 300 ms, 10K queries a day, on SageMaker with MLflow. alfred_: 5,000+ active users."],
     "never": ["Don't say you worked on COBOL or legacy modernization. You worked on code translation retrieval; say exactly that.",
               "Never mention alfred_'s funding or a crunch."]},

    {"id": "why-mphasis", "title": "Why Mphasis?", "length": "about 60 seconds",
     "when": "Straight after the intro, or at the end. They want to hear you know what they do and why it fits you, not a compliment.",
     "probes": ["What do you know about us?", "Why a services company and not a product company?", "Have you worked with legacy systems?", "What would you want to work on here?"],
     "say": [
         "Honestly, two things. The first is the problems. Your clients are banks, insurers, airlines, with decades of systems underneath. That's where generative AI is hardest to get right, and I think also where it's most useful, because a lot of those systems aren't fully understood by anyone anymore.",
         "The second is how you're approaching it. What I read about NeoZeta is that it doesn't point an LLM at COBOL and hope. It parses the code deterministically first, builds a knowledge graph of what the system does, and uses the model on top of that. I think that's the right order.",
         "It's pretty much the lesson I learned at alfred_: let code decide what code can decide, and use the model for the language part. And it's close to my own research, since MetaRAG was retrieval over enterprise knowledge in a code-translation setting.",
         "So it's a problem I've already touched, in the place where getting it right matters most."],
     "swaps": [{"when": "If they ask: have you worked with legacy systems?", "line": "Not COBOL, no, and I'd rather be straight about that. What I have done is the pattern around it: retrieval for code translation with MetaRAG, and at alfred_, an agent that has to act on systems it doesn't own, where every action gets checked against what actually happened. COBOL itself I'd learn on the job."},
               {"when": "If they ask: why services and not a product company?", "line": "At a startup you go deep on one product. In services you see twenty problems, each with different data and different constraints. I've had the depth; now I want the range, and I want to learn how large clients actually adopt this, the security reviews, the data rules, getting people to trust it."}],
     "land": "The hardest place to make generative AI reliable, and you're approaching it in the right order: parse first, model second.",
     "notes": ["New for Mphasis, in your voice. NeoZeta facts are from their own page (in Sources): deterministic parsers plus generative AI relearn legacy code into explainable knowledge. Say 'what I read', not 'I know'.",
               "The alfred_ line maps to a real design choice: email rules are a deterministic matcher that fires before the model sees the mail, and the executor has no send path."]},

    {"id": "why-role", "title": "Why this role? Why AI/ML engineering?", "length": "about 60 seconds",
     "when": "Why an AI/ML engineer role, and what you would bring to it on day one.",
     "probes": ["How strong are you on classic ML, not only LLMs?", "What would you do in your first month?", "Have you trained models or only used APIs?"],
     "say": [
         "Because it's the work I like most: taking a model and making it do a real job, reliably. At alfred_ that's meant evals, guardrails, memory and cost. In research it was retrieval and multi-agent reasoning, including getting four-billion-parameter models to work as a team at about three times the speed of frontier models.",
         "In a role like this, I think the value usually isn't picking the fanciest model. It's knowing when RAG is enough, when a small model is enough, how you evaluate it before you trust it, and how you make it auditable for a client. That's where I've spent most of my time.",
         "And I like the variety. Different clients, different data, different constraints. I think that makes you a better engineer than going deeper into one product."],
     "swaps": [{"when": "If they ask about classic ML, not only LLMs", "line": "I'm comfortable there too. My master's coursework was advanced ML, NLP and computer vision, and I've trained and deployed models myself, for example an audio inference API I quantized to INT8 and served at 150 milliseconds p95."},
               {"when": "If they ask what you'd do in the first month", "line": "Learn one client's system end to end before touching it, find where AI output is being trusted without a check, and put an evaluation set around it. Every later change gets measured against that."}],
     "land": "The value isn't the fanciest model; it's knowing what's enough, evaluating it, and making it auditable.",
     "notes": ["New for Mphasis, in your voice. Facts: SLM-TeamMedAgents, 4B small models, 77.63% accuracy across 8 benchmarks, 3.1x inference speedup against frontier LLMs; audio API at 150 ms p95 via INT8.",
               "'L1' is the first technical round, so expect this to lead into fundamentals. The AI fundamentals bank is the follow-on."]},

    {"id": "leave", "title": "Why are you looking to leave alfred_?", "length": "about 45 seconds",
     "when": "You are exploring while employed. Make that clear without sounding defensive.",
     "probes": ["Is something wrong at alfred_?", "You've only been there since April. Why move so soon?", "Will you leave us quickly too?", "Is this about compensation or visa?"],
     "say": [
         "There's nothing particularly wrong with alfred_. I've actually learned a lot there and I still enjoy the work.",
         "I'm mostly looking at what I want the next few years of my career to look like. At alfred_, I've had a lot of ownership because it's a small team, and that's been great. But the work is ultimately internal to one product.",
         "What I'm increasingly interested in is range: taking what I've learned about making agents reliable and applying it across many problems and many clients, on systems that matter. That's the part a company like Mphasis gives me that one product can't.",
         "So it's less \u201cI need to get away from alfred_\u201d and more \u201cI've found a direction I want to go deeper into.\u201d"],
     "swaps": [{"when": "If they ask bluntly: why not just stay?", "line": "I could. And that's why I'm being selective about what I talk to. I'm not looking to leave just to change companies. It has to give me a meaningfully different scope, and going from one product to many clients' systems does."},
               {"when": "If they ask: only since April, why so soon?", "line": "Fair question. It's been a very dense six months, and the reliability pieces I built there are running. I'm not in a rush; this is one of very few conversations I'm having, because the scope is genuinely different."}],
     "land": "Less \u201cget away from alfred_\u201d, more \u201ca direction I want to go deeper into\u201d.",
     "notes": ["Changed from your ZenML version: paragraphs 1, 2 and 4 are your words, unchanged. Paragraph 3 was about building developer infrastructure for Kitaru; it is now range across clients, which is what services offers.",
               "Pay, visa and start date are prepared in chat, not on this public page. If asked here, say you're happy to go through it with the recruiter."]},

    {"id": "why-now", "title": "Why now?", "length": "about 30 seconds",
     "when": "Often tacked onto why leave, or asked as 'what changed?'. Short.",
     "probes": ["What changed recently?", "Are you interviewing elsewhere?"],
     "say": [
         "Two reasons. The things I built at alfred_, the eval harness, the failure scanner, working memory, are running in production, so it's a natural point to take what I learned somewhere bigger.",
         "And I think enterprise AI is at the point where it's moving from pilots to production. The hard part now is exactly what I've been working on: making it reliable, measurable and safe. I'd like to be doing that where it's hardest, which is on the systems your clients run."],
     "swaps": [{"when": "If they ask whether you're interviewing elsewhere", "line": "A few conversations, yes, and I'm being selective. This one stands out because it's the most direct fit between what I've done and what you're building."}],
     "land": "My pieces are running; enterprise AI is moving from pilots to production, which is the part I know.",
     "notes": ["New, in your voice. Keep it under thirty seconds; the leave answer carries the weight."]},

    {"id": "alfred-day", "title": "What does your day-to-day look like at alfred_?", "length": "about 60 seconds",
     "when": "How much you code, what 'founding LLM engineer' means, what you personally own.",
     "probes": ["How much do you actually code?", "What does \u201cfounding LLM engineer\u201d mean?", "What did you personally own?"],
     "say": [  # verbatim
         "It's pretty varied, which is one of the things I like about the role.",
         "A typical piece of work might start with a production failure. I'll look at the conversation and the tool trace, figure out whether it's a model problem, a tool problem, or something in our orchestration or memory layer.",
         "If it's something we need to reproduce, I'll add it to the eval harness. The harness takes a snapshot of the relevant user environment \u2014 email, calendar, whatever the task needs \u2014 and lets the actual agent code run against that state. So we're testing the same tool paths we use in production rather than mocking the whole agent.",
         "Then I'll usually build the fix, run the regression set, and look at whether we've actually improved the behavior without breaking something else.",
         "I've also worked on the production failure scanner, working memory, reliability infrastructure, and some of the cost and orchestration pieces.",
         "So it's a mix of debugging production behavior, building infrastructure, writing product code, and figuring out what we should build next."],
     "swaps": [{"when": "If they ask \u201chow much coding?\u201d", "line": "A lot. I'm usually in the codebase every day. The difference is that because we're a small team, the coding is usually preceded by figuring out what the right thing to build is."}],
     "land": "The coding is usually preceded by figuring out what the right thing to build is.",
     "notes": ["Your own words, unchanged from ZenML. It works for any company.",
               "For Mphasis, the regression-set sentence is the one to lean on: clients want proof a change didn't break anything."]},
]

QA = [
    {"group": "Mphasis, and generative AI on legacy systems", "blurb": "What Mphasis does with generative AI, and how you'd design for it.", "items": [
        {"q": "What do you know about Mphasis?", "short": "What Mphasis does", "tests": "Did you prepare?",
         "a": ["Mphasis is an IT services company whose clients are largely in banking, insurance and airlines, with a lot of legacy systems.",
               "On the AI side, the part I found most interesting is NeoZeta: it uses deterministic parsers together with generative AI to relearn legacy code like COBOL into explainable knowledge, a knowledge graph of what the system does, so it can be reviewed before anything is changed. And NeoCrux on the software-engineering side.",
               "That's close to what I care about: making AI reliable on systems where a wrong answer is expensive."],
         "land": "Services for regulated industries; NeoZeta turns legacy code into reviewable knowledge with parsers plus generative AI.",
         "notes": ["Their claim: modernization cost per line down 60% or more; a COBOL platform relearned in two months instead of 12 to 18. Say it as 'they report', not as fact."]},
        {"q": "How would you use generative AI to modernize a COBOL system?", "short": "GenAI for COBOL modernization", "tests": "An HLD for their core use case.",
         "probes": ["Where does the LLM fit, and where shouldn't it?", "How do you trust its output?", "How does retrieval help?"],
         "a": ["I wouldn't point an LLM at raw COBOL and ask for Java. First, parse deterministically: programs, copybooks, data structures, calls, file and DB access. That gives you a graph of the system you can trust.",
               "Then use the LLM where it's good: explaining what a paragraph or program does in business terms, grounded by retrieving the relevant nodes from that graph, and proposing a translation one unit at a time.",
               "And verify everything: generate tests from the old system's behaviour, run old and new side by side on the same inputs, and have a person review the explanations before code changes. The parser gives structure, the model gives language, the tests give trust."],
         "land": "Parse deterministically into a graph, let the LLM explain and translate with retrieval from it, and verify with side-by-side tests.",
         "parts": [
             {"title": "The pipeline",
              "items": ["**Parse:** COBOL programs, copybooks, JCL; extract calls, data flows, file and DB access. Deterministic.",
                        "**Graph:** nodes for programs, paragraphs, data items, tables; edges for calls, reads, writes.",
                        "**Explain:** the LLM summarises each node in business terms, with its neighbours retrieved from the graph as context (GraphRAG).",
                        "**Translate:** unit by unit, into the target language, with the explanation and interfaces in the prompt.",
                        "**Verify:** tests from recorded production inputs; old and new run side by side; differences flagged; human review for the rest.",
                        "**Audit:** every generated artefact traced to its source node and the model and prompt that produced it."]},
             {"title": "Where it breaks",
              "items": ["Hallucinated business rules: mitigate with retrieval from the graph and review.",
                        "Context limits on huge programs: chunk by the graph, not by line count.",
                        "Numeric semantics (COBOL decimals): test, don't trust."]},
         ]},
        {"q": "What worries you about generative AI for regulated clients?", "short": "GenAI risks in regulated work", "tests": "Maturity about risk.",
         "a": ["Four things. Hallucination, so outputs must be grounded and checked, not trusted. Data: where client data goes, and whether the model provider can see it. Auditability: being able to say which model, prompt and data produced an output. And evaluation: you need a regression suite before you change a prompt or a model.",
               "At alfred_ the version of this I lived was an agent claiming it had done something it hadn't. We fixed it by checking the claim against the real execution record, not the model's own account."],
         "land": "Ground it, protect the data, make it auditable, and evaluate before you change it."},
    ]},
    {"group": "AI fundamentals", "blurb": "How it works underneath: one line each, then an example from your work.", "items": [
        {"q": "How does a large language model work?", "short": "How an LLM works", "tests": "Fundamentals, plainly.",
         "a": ["Text is split into tokens, and each token becomes a vector, an embedding. A transformer then runs those vectors through layers of attention, where every token looks at the others and decides how much each one matters to it, plus feed-forward layers.",
               "The output is a probability for every possible next token. The model picks one, appends it, and repeats. That's all generation is: next-token prediction, over and over.",
               "It learns in stages: pretraining on huge amounts of text to predict the next token, then fine-tuning on instructions, then preference tuning, like RLHF or DPO, so it answers the way people want."],
         "land": "Tokens become vectors, attention mixes them, the model predicts the next token, repeatedly.",
         "figs": ["attention"],
         "parts": [
             {"title": "Terms to have ready, one line each",
              "items": ["**Token:** a piece of a word; cost and context are counted in tokens.",
                        "**Embedding:** a vector that captures meaning; similar meanings sit close together.",
                        "**Attention:** each token weighs every other token: softmax(QK^T / sqrt(d)) V.",
                        "**Context window:** how many tokens the model can see at once.",
                        "**Temperature:** how random the next-token choice is; 0 is near-deterministic.",
                        "**Top-p:** sample only from the smallest set of tokens covering probability p.",
                        "**Hallucination:** fluent output not grounded in fact; the model predicts plausible text, not true text."]},
         ]},
        {"q": "Prompting, RAG or fine-tuning: when do you use which?", "short": "Prompt, RAG or fine-tune", "tests": "Judgement.",
         "a": ["Prompting first, because it's cheapest and fastest to change. RAG when the model needs knowledge it doesn't have or that changes, like a company's documents; it also gives you citations. Fine-tuning when you need a consistent behaviour or format, or a smaller cheaper model to do one task well, not to add facts.",
               "In practice they combine: at alfred_ the agent is prompted with a carefully laid-out, cached prompt, and it retrieves the user's own data through tools rather than knowing it."],
         "land": "Prompt first; RAG for knowledge; fine-tune for behaviour or cost."},
        {"q": "What are embeddings, and how does similarity search work?", "short": "Embeddings and vector search", "tests": "The core of RAG.",
         "a": ["An embedding model turns text into a vector, so that similar meanings end up close together. To search, you embed the query and find the stored vectors closest to it, usually by cosine similarity.",
               "At scale you don't compare against everything: a vector index like HNSW finds approximate nearest neighbours fast. And you often combine it with keyword search, because embeddings can miss exact terms like an error code or a product name."],
         "land": "Embed, compare by cosine similarity, index with approximate nearest neighbours, and mix in keyword search.",
         "parts": [
             {"title": "Cosine similarity in NumPy",
              "code": "import numpy as np\n\ndef cosine_top_k(query_vec, doc_vecs, k=5):\n    q = query_vec / np.linalg.norm(query_vec)\n    d = doc_vecs / np.linalg.norm(doc_vecs, axis=1, keepdims=True)\n    scores = d @ q                    # one dot product per document\n    top = np.argsort(-scores)[:k]     # highest first\n    return top, scores[top]"},
         ]},
        {"q": "How do you reduce hallucination?", "short": "Reducing hallucination", "tests": "Practical reliability.",
         "a": ["Ground the model: give it the facts through retrieval or tools and tell it to answer only from them, with citations. Constrain the output: structured formats, and let the model select from real options rather than invent identifiers.",
               "Then check: verify claims against a source of truth after generation. At alfred_ the strongest fix was structural: in working memory the model only picks from real candidates behind opaque handles, and code attaches the ids, so it can't invent a thread. And at WheelPrice, the fitment assistant could only answer through four tools against verified data."],
         "land": "Ground it, constrain it, and verify it; make the worst hallucinations structurally impossible."},
        {"q": "What drives an LLM's cost and latency, and how do you reduce them?", "short": "Cost and latency", "tests": "Production sense.",
         "a": ["Tokens in and out, and which model. Latency is mostly the output tokens, which are generated one at a time, plus time to the first token.",
               "Levers: a smaller model where the stakes are low, prompt caching for a stable prefix, fewer tokens in the prompt, streaming so the user sees text early, and replacing a model call with code where you can. At alfred_ a deterministic matcher for email rules cut per-user LLM cost about 30 percent, and quantisation got an audio model to 150 ms p95 at UIC."],
         "land": "Tokens and model choice; cache, shrink, stream, route, and replace calls with code."},
    ]},
    {"group": "Agentic AI", "blurb": "Loop, tools, memory, guardrails, evaluation, each tied to alfred_.", "items": [
        {"q": "What is an AI agent, and how is it different from a chatbot?", "short": "What an agent is", "tests": "Core concept.",
         "a": ["A chatbot answers. An agent pursues a goal in a loop: it decides on an action, calls a tool, looks at the result, and decides again, until the goal is met or it stops.",
               "So an agent is a model plus tools plus a loop plus state. At alfred_, the user texts 'move my 3pm to tomorrow', and the agent looks up the calendar, finds the event, checks conflicts, proposes the change, and only moves it after a confirm, across several steps."],
         "land": "A model, tools, a loop and state, pursuing a goal.",
         "parts": [
             {"title": "An agent loop, in plain Python",
              "code": "def run_agent(goal, tools, llm, max_steps=12):\n    messages = [{\"role\": \"user\", \"content\": goal}]\n    for _ in range(max_steps):\n        reply = llm(messages, tools=[t.schema for t in tools.values()])\n        messages.append(reply)\n        if not reply.tool_calls:              # the model answered: done\n            return reply.content\n        for call in reply.tool_calls:         # the model asked for tools\n            result = tools[call.name].run(**call.arguments)\n            messages.append({\"role\": \"tool\", \"id\": call.id, \"content\": result})\n    return \"Stopped: step budget reached\"",
              "after": ["The step budget matters: alfred_'s agent stops at 12 steps on SMS."]},
         ]},
        {"q": "How does tool calling actually work?", "short": "Tool calling", "tests": "Mechanics, not magic.",
         "a": ["You describe each tool to the model with a name, a description and a JSON schema for its arguments. The model doesn't run anything: it returns a structured request, 'call this tool with these arguments'.",
               "Your code validates the arguments, runs the tool, and sends the result back as a message, and the model continues. At alfred_ every tool call goes through a wrapper stack before it runs: schema validation, a capability gate, a preview and confirmation for writes, an idempotency key, logging and a timeout."],
         "land": "The model asks, your code validates and runs, the result goes back into the conversation.",
         "figs": ["alfredWrap"]},
        {"q": "How do you give an agent memory?", "short": "Agent memory", "tests": "Short-term and long-term memory.",
         "a": ["Short-term is the conversation itself, trimmed to fit the context window, often with a rolling summary. Long-term is stored outside the model and brought back when needed: facts about the user, past conversations by similarity, and structured state.",
               "At alfred_ there are three: the recent messages and a summary, facts in the per-user part of the prompt, and working memory, open loops like owed replies, which the agent fetches with a tool instead of carrying in every prompt."],
         "land": "Short-term in the context, long-term in stores, brought back by retrieval or tools.",
         "figs": ["alfredMemory"]},
        {"q": "What is ReAct, and what are the common agent patterns?", "short": "ReAct and patterns", "tests": "Vocabulary.",
         "a": ["ReAct is reasoning and acting interleaved: the model thinks about what to do, takes an action, observes the result, and repeats. Most tool-using agents are a version of it.",
               "Other patterns: plan and execute, where a plan is made first and steps are run; routing to a specialist; and multi-agent setups where agents with different roles work together. My TeamMedAgents research was a multi-agent setup for medical reasoning, and MockFlow-AI uses a state machine the model moves through by calling a tool, so it can't drift between stages."],
         "land": "Think, act, observe, repeat; plus planning, routing and multiple agents."},
        {"q": "How do you keep an agent safe?", "short": "Agent guardrails", "tests": "Safety on real actions.",
         "a": ["Decide by what an action does, not by how confident the model sounds. At alfred_ every candidate action goes to one of five verdicts: act silently, notify, confirm first, clarify, or refuse, decided by deterministic risk scoring, not by another model.",
               "Irreversible actions like sending mail always need a confirmation. There's an undo window for reversible ones. Emails are treated as untrusted input because of prompt injection. And a guard checks the agent's claims against what actually ran."],
         "land": "Gate by what the action does, confirm irreversible ones, treat input as untrusted, verify claims."},
        {"q": "How do you evaluate an agent?", "short": "Evaluating agents", "tests": "Your strongest topic.",
         "a": ["Outcome first: did it reach the right end state? Then how: the right tools, no unsafe actions, how many steps. Then reliability: does it succeed every time over several runs, not just once.",
               "At alfred_ I built a bench from real production failures: a scanner flags failing conversations, a judge checks them, and real ones become cases. Each case runs the real agent against a snapshot of the user's world, with only the provider calls swapped, scored on tool calls per completed task and on assertions against the snapshot."],
         "land": "End state, then path, then repeatability; built from real failures.",
         "figs": ["benchLoop", "benchAdapter"]},
        {"q": "What is MCP?", "short": "MCP", "tests": "Current tooling.",
         "a": ["The Model Context Protocol is an open standard for connecting models to tools and data. A server exposes tools and resources; a client, like Claude, discovers and calls them in a standard way, so you don't write a custom integration per model.",
               "At alfred_ we ship an MCP connector: Claude can call alfred_'s tools as the user, through the same safety wrappers our own agent uses, with writes previewed and confirmed."],
         "land": "A standard way for models to discover and call tools; alfred_ ships one."},
    ]},
    {"group": "RAG and GraphRAG, in code", "blurb": "Enough code to draw the design correctly, whatever the exact syntax.", "items": [
        {"q": "Build a basic RAG pipeline.", "short": "RAG, end to end", "tests": "Can you code the HLD?",
         "a": ["Two phases. Indexing: load documents, split them into chunks with some overlap, embed each chunk, and store the vectors with their text and source. Querying: embed the question, retrieve the top matching chunks, put them in the prompt with an instruction to answer only from them and cite, and generate.",
               "Then evaluate both halves separately: did retrieval find the right chunks, and did the answer stay faithful to them? That split is what my MetaRAG work was about."],
         "land": "Chunk, embed, store; embed the question, retrieve, prompt with sources, generate; evaluate retrieval and answer separately.",
         "parts": [
             {"title": "The code (any embedding model and LLM)",
              "code": "import numpy as np\n\ndef chunk(text, size=800, overlap=100):\n    step = size - overlap\n    return [text[i:i + size] for i in range(0, len(text), step)]\n\nclass VectorStore:\n    def __init__(self):\n        self.vecs, self.items = [], []\n    def add(self, vec, text, source):\n        self.vecs.append(vec / np.linalg.norm(vec))\n        self.items.append({\"text\": text, \"source\": source})\n    def search(self, qvec, k=4):\n        q = qvec / np.linalg.norm(qvec)\n        scores = np.array(self.vecs) @ q\n        return [self.items[i] for i in np.argsort(-scores)[:k]]\n\ndef index(docs, embed, store):\n    for doc in docs:\n        for piece in chunk(doc[\"text\"]):\n            store.add(embed(piece), piece, doc[\"source\"])\n\ndef answer(question, embed, store, llm):\n    hits = store.search(embed(question))\n    context = \"\\n\\n\".join(f\"[{i}] ({h['source']}) {h['text']}\" for i, h in enumerate(hits))\n    prompt = (\"Answer only from the sources below and cite them like [0]. \"\n              \"If they don't contain the answer, say so.\\n\\n\"\n              f\"{context}\\n\\nQuestion: {question}\")\n    return llm(prompt)"},
             {"title": "What they'll probe",
              "items": ["**Chunk size:** too small loses context, too large dilutes relevance; overlap stops a sentence being cut in half.",
                        "**Hybrid search:** add keyword search (BM25) and merge the results, for exact terms.",
                        "**Reranking:** retrieve 20, rerank with a cross-encoder, keep the best 4.",
                        "**Evaluation:** retrieval recall at k; answer faithfulness to the sources; answer relevance."]},
         ]},
        {"q": "What is GraphRAG, and when does it beat plain RAG?", "short": "GraphRAG", "tests": "Beyond basic retrieval, and Mphasis's world.",
         "a": ["Plain RAG finds chunks that look like the question. It struggles with questions that need connections across many documents, like 'which systems depend on this table?' or 'what are the main themes across all of this?'.",
               "GraphRAG first extracts entities and relationships into a graph. For a specific question it retrieves an entity's neighbourhood, following the edges; for a broad question it uses summaries of clusters of the graph. For legacy code this is natural: programs, data and calls already form a graph, which is what NeoZeta's knowledge graph is about."],
         "land": "Retrieve by relationships, not just similarity: neighbourhoods for specific questions, cluster summaries for broad ones.",
         "parts": [
             {"title": "The code: build a graph, answer from a neighbourhood",
              "code": "from collections import defaultdict\n\ndef build_graph(chunks, extract):\n    # extract(text) -> [(\"PAYROLL\", \"reads\", \"EMP_TABLE\"), ...], an LLM or a parser\n    graph = defaultdict(list)\n    for c in chunks:\n        for head, rel, tail in extract(c[\"text\"]):\n            graph[head].append((rel, tail, c[\"source\"]))\n            graph[tail].append((f\"inverse {rel}\", head, c[\"source\"]))\n    return graph\n\ndef neighbourhood(graph, start, hops=2):\n    seen, frontier, facts = {start}, [start], []\n    for _ in range(hops):\n        nxt = []\n        for node in frontier:\n            for rel, other, src in graph[node]:\n                facts.append(f\"{node} {rel} {other} ({src})\")\n                if other not in seen:\n                    seen.add(other)\n                    nxt.append(other)\n        frontier = nxt\n    return facts\n\ndef graph_answer(question, entity, graph, llm):\n    facts = \"\\n\".join(neighbourhood(graph, entity))\n    return llm(f\"Using only these facts:\\n{facts}\\n\\nAnswer: {question}\")",
              "after": ["Finding the starting entity: match names in the question against graph nodes, or use vector search over node descriptions."]},
             {"title": "Local versus global",
              "items": ["**Local search:** start from the entities in the question and walk their neighbourhood. For 'what reads EMP_TABLE?'.",
                        "**Global search:** cluster the graph into communities, summarise each, and answer from the summaries. For 'what does this system do?'.",
                        "**Cost:** building the graph with an LLM is expensive; for code, a parser gives you the graph far more cheaply and reliably."]},
         ]},
    ]},
    {"group": "Quick Python", "blurb": "Short exercises that show up on shared screens. Algorithms are on the CODING page.", "items": [
        {"q": "Top k most frequent words in a text.", "short": "Top k frequent", "tests": "Collections and complexity.",
         "a": ["Count with a Counter, then take the k largest. Counter.most_common(k) does it; with a heap it's O(n log k)."],
         "land": "Counter plus a heap: O(n log k).",
         "parts": [{"title": "Code", "code": "import heapq, re\nfrom collections import Counter\n\ndef top_k_words(text, k):\n    words = re.findall(r\"[a-z']+\", text.lower())\n    counts = Counter(words)\n    return heapq.nlargest(k, counts.items(), key=lambda kv: kv[1])"}]},
        {"q": "Implement an LRU cache.", "short": "LRU cache", "tests": "Data structures.",
         "a": ["An ordered dict: on get, move the key to the end; on put, insert at the end and, if over capacity, pop the first. Both are O(1). The interview version without OrderedDict is a hash map plus a doubly linked list."],
         "land": "OrderedDict, move_to_end on use, pop the oldest when full.",
         "parts": [{"title": "Code", "code": "from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.data = OrderedDict()\n\n    def get(self, key):\n        if key not in self.data:\n            return -1\n        self.data.move_to_end(key)          # most recently used\n        return self.data[key]\n\n    def put(self, key, value):\n        self.data[key] = value\n        self.data.move_to_end(key)\n        if len(self.data) > self.cap:\n            self.data.popitem(last=False)   # evict the least recently used"}]},
        {"q": "Write a retry decorator with exponential backoff for an LLM call.", "short": "Retry with backoff", "tests": "Practical Python for AI systems.",
         "a": ["A decorator that catches the retryable error, waits base times two to the attempt, plus a little random jitter so many clients don't retry together, and gives up after a few attempts."],
         "land": "Catch, wait with exponential backoff and jitter, give up after n.",
         "parts": [{"title": "Code", "code": "import functools, random, time\n\ndef retry(times=4, base=0.5, retry_on=(TimeoutError, ConnectionError)):\n    def deco(fn):\n        @functools.wraps(fn)\n        def wrapper(*args, **kwargs):\n            for attempt in range(times):\n                try:\n                    return fn(*args, **kwargs)\n                except retry_on:\n                    if attempt == times - 1:\n                        raise\n                    time.sleep(base * 2 ** attempt + random.uniform(0, base))\n        return wrapper\n    return deco\n\n@retry()\ndef call_llm(prompt):\n    ...  # your client call here"}]},
        {"q": "Parse a model's JSON output safely.", "short": "Parsing model JSON", "tests": "Robustness.",
         "a": ["Strip code fences, try json.loads, and validate the shape with Pydantic. If it fails, retry once with the error message in the prompt. Better still, use the provider's structured output or tool calling so the model has to return the schema."],
         "land": "Strip, parse, validate with Pydantic, retry once with the error.",
         "parts": [{"title": "Code", "code": "import json\nfrom pydantic import BaseModel, ValidationError\n\nclass Ticket(BaseModel):\n    category: str\n    priority: int\n\ndef parse_ticket(raw: str) -> Ticket | None:\n    text = raw.strip().removeprefix(\"```json\").removesuffix(\"```\").strip()\n    try:\n        return Ticket.model_validate(json.loads(text))\n    except (json.JSONDecodeError, ValidationError):\n        return None   # caller retries with the error in the prompt"}]},
        {"q": "Merge overlapping intervals.", "short": "Merge intervals", "tests": "A classic that shows up everywhere.",
         "a": ["Sort by start, then walk: if the next interval starts before the last one ends, extend the last; otherwise start a new one. O(n log n) for the sort."],
         "land": "Sort by start, extend or append.",
         "parts": [{"title": "Code", "code": "def merge(intervals):\n    out = []\n    for start, end in sorted(intervals):\n        if out and start <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], end)\n        else:\n            out.append([start, end])\n    return out"}]},
    ]},
]

QA_ORDER = ["Mphasis, and generative AI on legacy systems", "AI fundamentals", "Agentic AI", "RAG and GraphRAG, in code", "Quick Python"]

ASK_3C = [
    {"id": "clarify", "title": "Clarifying", "when": "During coding and design questions.",
     "why": "It shows you think before you type, and it stops you solving the wrong problem.",
     "how": ["Restate the problem in one line.", "Ask about input size, edge cases and what to return on bad input.", "Say your assumption out loud if they say 'your choice'."],
     "items": [
         {"to": "Either", "q": "How big can the input get, and can it be empty?", "loop": "Before any code.", "why": "It decides the complexity you need."},
         {"to": "Either", "q": "Should I optimise for clarity or for speed here?", "loop": "Before choosing an approach.", "why": "It shows you know there's a trade-off."}]},
    {"id": "contribute", "title": "Contributing", "when": "At the end.",
     "why": "Show you're thinking about their work, not just the job.",
     "how": ["One question, then listen."],
     "items": [
         {"to": "Either", "q": "What kinds of agentic or generative AI projects would this role work on first: modernization like NeoZeta, or client-facing agents?", "loop": "Your first question.", "why": "Shows you read about them and want to know where you'd add value."},
         {"to": "Either", "q": "How do your clients evaluate an AI system before they trust it in production?", "loop": "After they describe a project.", "why": "Your strongest area, asked as curiosity."}]},
    {"id": "collaborate", "title": "Collaborating", "when": "At the end, if there's time.",
     "why": "How the team works day to day.",
     "how": ["Ask for a recent example."],
     "items": [
         {"to": "Either", "q": "How does the team work with client engineers on a project, day to day?", "loop": "Last.", "why": "Services work is collaborative; shows you know it."}]},
]
ASK = []

TRAPS = [
    ("Rambling on the opener", "Ninety seconds, then stop."),
    ("Coding silently", "Talk through every step; silence reads as stuck."),
    ("Skipping complexity", "Say the time and space cost before and after."),
    ("Bluffing a definition", "'Here's how I'd reason about it' beats a wrong confident answer."),
]

DRILLS = [
    {"id": "intro", "prompt": "Tell me about yourself.", "target": "90 seconds", "seconds": 90, "ref": "#say-intro"},
    {"id": "why-mphasis", "prompt": "Why Mphasis?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-mphasis"},
    {"id": "why-role", "prompt": "Why this role, and how strong are you on classic ML?", "target": "60 seconds", "seconds": 60, "ref": "#say-why-role"},
    {"id": "leave", "prompt": "Why leave alfred_ after six months?", "target": "45 seconds", "seconds": 45, "ref": "#say-leave"},
    {"id": "llm", "prompt": "How does a large language model work?", "target": "60 seconds", "seconds": 60, "ref": "#/prep/q-how-does-a-large-language-model-work"},
    {"id": "agent", "prompt": "What is an AI agent? Walk me through one you built.", "target": "90 seconds", "seconds": 90, "ref": "#/prep/q-what-is-an-ai-agent-and-how-is-it-different-from-a-chatbot"},
    {"id": "rag", "prompt": "Design a RAG system out loud, then code the query path.", "target": "3 minutes", "seconds": 180, "ref": "#/prep/q-build-a-basic-rag-pipeline"},
]

MOCK_HOW = "Say 'run the Mphasis mock, 15 minutes' in chat for a quick run."
