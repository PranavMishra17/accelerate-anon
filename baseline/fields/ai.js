BASELINE.field({
  id: "ai", name: "AI engineering", short: "AI engineering", layer: "Intelligence",
  ink: "#3F7A55", inkDark: "#8FC4A1",
  lede: "Building products on foundation models someone else trained: choosing the model, giving it the right context and tools, and proving with evals that the system works.",
  overview: [
    "AI engineering is the applied field that grew up around foundation models. The model is rented through an API or downloaded as open weights; the work is the system around it. AI engineers, applied AI engineers, LLM engineers and forward deployed engineers spend their days writing prompts and assembling context, building retrieval, wiring tools and agents, designing evals, and cutting latency and cost. Chip Huyen's book draws the line well: ML engineering trains models, AI engineering adapts and evaluates them.",
    "It rests on backend engineering (an LLM app is a backend with one probabilistic component), borrows intuition from ML, and leans on inference for speed and cost. In 2026 the frontier models come from Anthropic, OpenAI and Google, with strong open-weight families from Meta, Mistral, DeepSeek and Qwen. Coding agents such as Claude Code, Cursor and Codex are mainstream, MCP has become the common way to plug tools into models, and the teams that win are usually the ones with the best evals, not the cleverest prompts.",
    "Read the map as one request: context assembled, a model called, tools invoked in a loop, output checked, everything traced. RAG and agents have dozens of named variants; this tab gives the map and the nuances that matter, and links out for depth."
  ],
  diagram: {
    nodes: [
      { id: "context-engineering", label: "Context", sub: "prompt, history, documents", col: 0, row: 0 },
      { id: "model-choice", label: "Model call", sub: "which model, which tier", col: 0, row: 1 },
      { id: "structured-output", label: "Structured output", sub: "JSON your code can trust", col: 0, row: 2 },
      { id: "guardrails", label: "Guardrails", sub: "checks before the user", col: 0, row: 3 },
      { id: "rag", label: "Retrieval (RAG)", sub: "find the right chunks", col: 1, row: 0 },
      { id: "tool-calling", label: "Tool calls", sub: "the model asks, code runs", col: 1, row: 1 },
      { id: "agents", label: "Agent loop", sub: "call, observe, repeat", col: 1, row: 2 },
      { id: "cost-latency", label: "Caching, routing", sub: "cost and latency", col: 1, row: 3 },
      { id: "mcp", label: "MCP servers", sub: "tools from anywhere", col: 2, row: 1 },
      { id: "observability", label: "Traces", sub: "every step, logged", col: 2, row: 2 },
      { id: "evaluation", label: "Evals", sub: "is it good, and better?", col: 2, row: 3 }
    ],
    edges: [
      ["rag", "context-engineering", "top chunks"], ["context-engineering", "model-choice", "prompt"],
      ["model-choice", "structured-output", "output"], ["structured-output", "guardrails", "validated"],
      ["model-choice", "tool-calling", "tool call"], ["tool-calling", "mcp", "served over"],
      ["tool-calling", "agents", "repeat"], ["agents", "cost-latency", "cost per task"],
      ["agents", "observability", "traced"], ["observability", "evaluation", "becomes test sets"]
    ],
    cap: "**One request, left to right: what the model sees, what it can do, and how you know it worked.** The left column is a single model call. The middle column feeds it: retrieved documents and tools, which an agent calls in a loop until the task is done. The right column watches: traces of every step become the eval sets that tell you whether a change helped."
  },
  start: [
    { label: "Chip Huyen, AI Engineering (O'Reilly, 2025): chapter 1 and the chapters on evaluation", url: "https://huyenchip.com/books/", m: 180, why: "The book that defines the field: the whole map, with evaluation at its centre." },
    { label: "Anthropic, Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents", m: 20, why: "Workflows against agents, five patterns, and the case for starting simple." },
    { label: "Hamel Husain, Your AI product needs evals", url: "https://hamel.dev/blog/posts/evals/", m: 30, why: "Why evals are the core loop of the work, from someone who builds them for clients." },
    { label: "What we learned from a year of building with LLMs: the tactical section", url: "https://applied-llms.org/", m: 45, why: "Six practitioners on prompting, RAG and evals in production." }
  ],
  clusters: [
    { name: "The model and what it sees", line: "Choosing a model and shaping its input and output.",
      topics: [
        { id: "model-choice", name: "Foundation models and choosing one",
          line: "Pick by task quality on your own evals, then by latency, cost, context and hosting.",
          body: [
            "A foundation model is a large model pretrained on broad data and post-trained to follow instructions, used as-is for many tasks. The choice has several axes: quality on your task, latency (time to first token and tokens per second), price per million input and output tokens, context window, modalities, tool-use reliability, and where it can run. Closed models (Claude, GPT, Gemini) are called through an API; open-weight models (Llama, Qwen, DeepSeek, Mistral, Gemma) can be self-hosted for data control or cost at high volume.",
            "Public leaderboards narrow the list; your own eval set decides. Most production systems use more than one model: a frontier model for hard reasoning and a small, fast one for classification, extraction or routing. Reasoning models that think before answering trade latency and tokens for accuracy on hard problems."
          ],
          where: "Artificial Analysis compares models on intelligence, speed and price; LMArena ranks them by human preference. Cloud platforms (AWS Bedrock, Google Vertex AI, Azure AI Foundry) and routers such as OpenRouter offer many models behind one API.",
          nuance: "Model choice is not permanent. A new release lands every few weeks, so keep the model behind an interface and the eval set ready, and switching becomes a one-day test instead of a rewrite.",
          read: [{ label: "Artificial Analysis: model comparison on intelligence, speed and price", url: "https://artificialanalysis.ai/", m: 10 }],
          tags: ["llm", "open weights", "reasoning models", "benchmarks", "leaderboard"] },
        { id: "prompting", name: "Prompting",
          line: "Clear instructions, examples and room to think, written for a reader with no context.",
          body: [
            "A prompt is the instruction set for one call. What works is plain: say what the task is, who it is for and what good looks like; give the reason behind a constraint; show two or three examples of input and ideal output (few-shot); separate instructions from data with clear delimiters such as XML tags; and say what to do when the input does not fit. Asking the model to reason before it answers (chain of thought, or the built-in thinking of reasoning models) helps on multi-step problems.",
            "Prompts are code. Keep them in version control, change one thing at a time, and run the eval set after every change. A system prompt sets standing behaviour; the user turn carries the request."
          ],
          where: "Every LLM feature starts here. Anthropic, OpenAI and Google each publish prompting guides tuned to their models; prompt management tools such as Langfuse and Braintrust version prompts against evals.",
          nuance: "Prompt tweaks that fix one example often break three others. Without an eval set you cannot tell whether a prompt change helped, and that is the most common failure in the field.",
          read: [{ label: "Anthropic docs: prompting best practices (general principles and examples sections)", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices", m: 30 }],
          tags: ["prompt engineering", "few-shot", "chain of thought", "system prompt"] },
        { id: "context-engineering", name: "Context engineering",
          line: "Deciding exactly which tokens the model sees on each call, and in what order.",
          body: [
            "The context window holds everything the model knows for this call: system prompt, tool definitions, conversation history, retrieved documents and tool results. Context engineering is choosing that set on purpose. Models do worse as context grows (sometimes called context rot): facts in the middle of a long input are used less well than those at the start or end, and irrelevant text distracts.",
            "The techniques: retrieve only what is relevant; load data **on demand** through tools instead of up front; **compact** long histories by summarising them; keep notes in external memory; give sub-agents a clean context and take back only their summary; and put stable content first so the prompt cache can reuse it."
          ],
          where: "Coding agents (Claude Code, Cursor) compact history and read files on demand rather than loading a repository. Customer-support bots trim conversation history to the last turns plus a summary.",
          nuance: "A million-token window does not mean a million useful tokens. The aim is the smallest set of high-signal tokens that gets the job done; more context often costs accuracy as well as money.",
          read: [
            { label: "Anthropic, Effective context engineering for AI agents", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", m: 20 },
            { label: "Lost in the middle: how language models use long contexts (abstract and figure 1)", url: "https://arxiv.org/abs/2307.03172", m: 10 }
          ],
          see: [{ label: "System design guide: context budgeting", href: "SYSTEM%20DESIGN.html#/patterns/llm-cost/context-budget" }],
          tags: ["context window", "compaction", "context rot", "memory"] },
        { id: "structured-output", name: "Structured output",
          line: "Make the model return JSON that matches a schema, so code can use it.",
          body: [
            "Free text is hard for code to use. Structured output asks for a specific shape, usually a JSON Schema: fields, types, required keys, allowed values. Three levels of strength exist. Asking in the prompt works most of the time. Validating and retrying (Pydantic or Zod, re-asking on failure) catches the rest. **Constrained decoding** guarantees it: at each step the engine masks out any token that would break the schema, so the output always parses.",
            "Most providers now offer the guaranteed mode (Anthropic and OpenAI structured outputs, Gemini response schemas), and open engines do it with libraries such as Outlines and XGrammar."
          ],
          where: "Extraction (invoices, résumés, support tickets into fields), classification with a fixed label set, and every tool call, which is structured output naming a function and its arguments.",
          nuance: "Valid JSON is not correct JSON. A schema guarantees shape, not truth, and forcing a strict format can lower answer quality; let the model reason in a free-text field before the structured one.",
          read: [{ label: "Anthropic docs: structured outputs (JSON outputs and strict tool use)", url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs", m: 15 }],
          see: [
            { label: "System design guide: structured outputs", href: "SYSTEM%20DESIGN.html#/patterns/grounding/structured" },
            { label: "Coding primer: structured output", href: "CODING.html#structured" }
          ],
          tags: ["json schema", "constrained decoding", "pydantic", "extraction"] }
      ] },
    { name: "Retrieval (RAG)", line: "Giving the model knowledge it was not trained on, at question time.",
      topics: [
        { id: "rag", name: "Retrieval-augmented generation",
          line: "Search your own data, paste the best passages into the prompt, and answer from them.",
          body: [
            "RAG answers from documents the model never saw in training. **Offline**, documents are parsed, split into chunks, embedded and indexed. **Online**, the question is (optionally) rewritten, the index returns candidate chunks, a reranker keeps the best few, and the model answers using them, ideally citing which chunk supports each claim. It keeps knowledge fresh without retraining, keeps private data out of model weights, and gives answers a source to check.",
            "Variants are many: query rewriting, multi-hop retrieval, GraphRAG over a knowledge graph, and **agentic RAG**, where the model decides when and what to search as tools in a loop. Most begin as the plain pipeline above and stay there."
          ],
          where: "Support assistants over help-centre articles, internal search (Glean), legal and medical research tools (Harvey), and the web-search grounding inside ChatGPT, Claude and Perplexity.",
          nuance: "Most RAG failures are retrieval failures: the right chunk was never found, so the model answered from nothing. Measure retrieval (recall at k) separately from answer quality, or you will tune the prompt for a search problem.",
          read: [{ label: "RAG paper (Lewis et al., 2020): abstract and figure 1", url: "https://arxiv.org/abs/2005.11401", m: 10 }],
          see: [
            { label: "System design guide: retrieval-augmented generation", href: "SYSTEM%20DESIGN.html#/patterns/grounding/rag" },
            { label: "Coding primer: RAG end to end", href: "CODING.html#rag" }
          ],
          tags: ["rag", "retrieval", "grounding", "citations", "graphrag"] },
        { id: "chunking-embeddings", name: "Chunking and embeddings",
          line: "Split documents into passages the size of an answer, then index them as vectors.",
          body: [
            "A **chunk** is the unit retrieval returns. Too small and it lacks the context to be understood; too large and it dilutes the embedding and wastes prompt space. A few hundred tokens with some overlap is a common start; splitting on document structure (headings, sections, functions in code) usually beats fixed sizes. Each chunk is then turned into a vector by an embedding model and stored in a vector index (HNSW is the usual algorithm) for nearest-neighbour search.",
            "Chunks lose context when cut out: a passage saying 'revenue grew 3%' does not say which company. Prepending a short generated description of where the chunk sits, Anthropic's **contextual retrieval**, cut top-20 retrieval failures by 35% in their tests, and by 49% with keyword search added."
          ],
          where: "pgvector inside Postgres for most teams, or dedicated stores such as Pinecone, Qdrant, Weaviate and Turbopuffer. Embeddings from OpenAI, Cohere, Voyage or open models such as BGE.",
          nuance: "Parsing is the unglamorous step that decides quality. Tables, PDFs with columns and scanned pages turned into garbled text cannot be rescued by a better embedding model.",
          read: [{ label: "Anthropic, Introducing contextual retrieval", url: "https://www.anthropic.com/engineering/contextual-retrieval", m: 15 }],
          see: [
            { label: "System design guide: vector index", href: "SYSTEM%20DESIGN.html#/patterns/search/vector" },
            { label: "Coding primer: embeddings", href: "CODING.html#embed" }
          ],
          tags: ["chunking", "embeddings", "vector database", "hnsw", "pgvector"] },
        { id: "hybrid-search-reranking", name: "Hybrid search and reranking",
          line: "Combine keyword and vector search, then let a slower model reorder the top results.",
          body: [
            "Vector search finds passages with similar meaning but misses exact terms: product codes, names, error strings. Keyword search (**BM25**) finds those but misses paraphrases. **Hybrid search** runs both and merges the lists, commonly with reciprocal rank fusion, which scores each passage by its rank in each list.",
            "A **reranker** then rescores the top 50 to 100 candidates. It is a cross-encoder: it reads the query and passage together, so it judges relevance far better than comparing two separate embeddings, but is too slow to run over the whole index. Retrieve wide and cheap, then rerank narrow and expensive. In Anthropic's tests, adding reranking to contextual embeddings and BM25 cut retrieval failures by 67%."
          ],
          where: "Elasticsearch, OpenSearch and Vespa support hybrid queries; Postgres can combine full-text search and pgvector. Cohere Rerank, Voyage rerankers and open BGE rerankers are the common rerank models.",
          nuance: "Each stage adds latency. A reranker over 100 passages can add a few hundred milliseconds, which matters in a voice agent and does not in a research tool.",
          see: [{ label: "System design guide: hybrid retrieval and reranking", href: "SYSTEM%20DESIGN.html#/patterns/search/hybrid-rerank" }],
          tags: ["bm25", "hybrid search", "reranker", "cross-encoder", "rrf"] }
      ] },
    { name: "Tools and agents", line: "Letting the model act: call functions, loop until done, and plug into other systems.",
      topics: [
        { id: "tool-calling", name: "Tool calling",
          line: "The model returns a function name and arguments; your code runs it and returns the result.",
          body: [
            "You describe tools to the model: a name, a description and a JSON Schema for the arguments. When the model decides a tool helps, it stops generating text and emits a structured call, for example `get_order(order_id=\"A123\")`. Your code executes it and sends back the result as a new message, and the model continues. The model never runs anything itself.",
            "Tool descriptions are prompts: the model chooses tools from their names and descriptions, so vague or overlapping tools cause wrong calls. Good tools are few, distinct, and return compact, useful errors. Tools that change things (send, pay, delete) need idempotency and often a human confirmation."
          ],
          where: "Every assistant that searches the web, queries a database, books a meeting or edits code. All major APIs (Anthropic, OpenAI, Gemini) and open engines support it.",
          nuance: "A tool call can fail, time out or succeed without you hearing back. Treat each one like a network call to an unreliable service: timeouts, retries only when safe, and results that say clearly what happened.",
          see: [
            { label: "System design guide: idempotent tools and unknown results", href: "SYSTEM%20DESIGN.html#/patterns/agent-durability/unknown-results" }
          ],
          tags: ["function calling", "tool use", "json schema"] },
        { id: "agents", name: "Agents: the loop and planning",
          line: "A model calling tools in a loop, choosing each next step, until the task is done.",
          body: [
            "An agent is a model in a loop: read the goal and context, choose an action (usually a tool call), observe the result, and repeat until it decides it is finished or hits a limit. ReAct (2022) named the pattern of interleaving reasoning and actions. **Planning** is how the agent breaks a task down: it may write a plan first, revise it as results arrive, or check its own work before stopping.",
            "Anthropic separates **workflows**, where code fixes the sequence of model calls (chains, routing, parallel calls), from **agents**, where the model decides the steps. Workflows are cheaper and more predictable; agents handle open-ended tasks whose steps cannot be known in advance. Start with the simplest that works."
          ],
          where: "Coding agents (Claude Code, Cursor, Codex, Devin), deep research tools in ChatGPT, Claude and Gemini, and customer-service agents that look up accounts and issue refunds.",
          nuance: "Errors compound: a step that is right 95% of the time is right about 60% of the time over ten steps. Agents need step budgets, loop detection, checkpoints, and evals over whole trajectories, not single replies.",
          read: [
            { label: "Chip Huyen, Agents (tools, planning and failure modes)", url: "https://huyenchip.com/2025/01/07/agents.html", m: 40 },
            { label: "ReAct paper: abstract and figure 1", url: "https://arxiv.org/abs/2210.03629", m: 10 }
          ],
          see: [
            { label: "System design guide: budget caps and loop detection", href: "SYSTEM%20DESIGN.html#/patterns/agent-safety/budgets" },
            { label: "Coding primer: an agent loop", href: "CODING.html#agent" }
          ],
          tags: ["react", "agent loop", "planning", "workflows", "reflection"] },
        { id: "agent-memory", name: "Agent memory",
          line: "What an agent keeps between steps and between sessions, beyond the context window.",
          body: [
            "**Short-term memory** is the context window itself: the conversation and tool results so far. When it fills up, the agent must compact it, summarising old turns and dropping raw tool output. **Long-term memory** lives outside the model: notes or facts written to a file or database, user preferences, past episodes, retrieved by search when relevant.",
            "The design questions are what to write (facts, decisions, user preferences), when to write it, how to retrieve it, and how to forget or correct it. Many products use something as plain as a markdown file the agent reads at start and edits as it learns."
          ],
          where: "ChatGPT and Claude memory features that recall user preferences across chats; CLAUDE.md and similar project files read by coding agents; libraries such as Mem0 and Letta.",
          nuance: "Memory that cannot be inspected or corrected turns one wrong inference into a permanent one. Let users see and edit what is remembered, and date each entry.",
          read: [{ label: "Lilian Weng, LLM powered autonomous agents: the memory section", url: "https://lilianweng.github.io/posts/2023-06-23-agent/", m: 20 }],
          tags: ["memory", "compaction", "long-term memory", "state"] },
        { id: "multi-agent", name: "Multi-agent systems",
          line: "A lead agent splits a task among sub-agents, each with its own clean context.",
          body: [
            "In the common **orchestrator and workers** shape, a lead agent plans, starts sub-agents for independent parts of the task, and combines their condensed results. Each sub-agent explores with a fresh context window, so the lead's context stays small. The win is breadth: many searches or files examined in parallel.",
            "Anthropic reported that its multi-agent research system beat a single agent by about 90% on an internal research eval, while using about 15 times the tokens of a chat. That trade only pays on valuable, parallel tasks. Tasks with tight dependencies between steps, such as most coding, gain less because agents need to share context they do not have."
          ],
          where: "Deep research features in Claude, ChatGPT and Gemini; coding agents that spawn sub-agents for search or review. Frameworks include the OpenAI Agents SDK, Claude Agent SDK, LangGraph and CrewAI.",
          nuance: "More agents means more ways to fail and more cost. Most problems that look multi-agent are better served by one agent with good tools, until evals show otherwise.",
          read: [{ label: "Anthropic, How we built our multi-agent research system", url: "https://www.anthropic.com/engineering/multi-agent-research-system", m: 25 }],
          tags: ["orchestrator", "sub-agents", "parallel agents", "deep research"] },
        { id: "mcp", name: "MCP (Model Context Protocol)",
          line: "An open protocol that lets any AI app use tools and data from any server.",
          body: [
            "Before MCP, each AI app wrote its own integration for each tool. MCP standardises the connection: an **MCP server** exposes **tools** (functions to call), **resources** (data to read) and **prompts** (templates), and an **MCP host** (Claude Code, Claude Desktop, VS Code, Cursor) opens one client connection per server. Messages are JSON-RPC 2.0. Local servers usually talk over stdio; remote servers over streamable HTTP, with OAuth for authorisation.",
            "Anthropic released it in late 2024; OpenAI, Google and Microsoft adopted it, and it is now governed in the open. The specification keeps moving: the 2026 revision made requests stateless and deprecated sampling."
          ],
          where: "Official servers from GitHub, Sentry, Stripe, Linear, Notion and many others; local servers for filesystems and databases; agent frameworks that load MCP tools directly.",
          nuance: "MCP is plumbing, not judgement. Connecting fifty servers floods the context with tool definitions and widens the attack surface; every server you add can return text that tries to instruct the model.",
          read: [{ label: "MCP docs: architecture overview (participants, layers, primitives)", url: "https://modelcontextprotocol.io/docs/learn/architecture", m: 20 }],
          tags: ["mcp", "json-rpc", "tools", "integrations"] }
      ] },
    { name: "Quality and safety", line: "Knowing whether it works, and keeping it from doing harm.",
      topics: [
        { id: "evaluation", name: "Evaluation: offline sets and online metrics",
          line: "A test set of real cases, scored automatically, run on every change; then production signals.",
          body: [
            "Evals are the core loop. Start by reading real traces and writing down how the system fails; those failure modes become **offline eval sets**: inputs with expected behaviour, drawn from production and edge cases. Score with code where you can (exact match, the right tool called, valid JSON, a test that passes) and with a model judge where you cannot. Run the set on every prompt, model or retrieval change, and gate releases on it.",
            "**Online**, watch what users do: thumbs up and down, edits to a draft, retries, escalations to a human, task completion, and A/B tests between versions. Online signals catch what the offline set does not cover; their failures feed back into the set."
          ],
          where: "Braintrust, Langfuse, LangSmith and Arize run evals over traces; OpenAI Evals and Inspect (from the UK AI Security Institute) are open frameworks. Every serious LLM product team keeps a golden set.",
          nuance: "Generic metrics (helpfulness scores, BLEU, public benchmarks) say little about your product. The useful evals are specific to your failure modes and written after looking at the data.",
          read: [{ label: "Eugene Yan, Patterns for building LLM-based systems: the evals section", url: "https://eugeneyan.com/writing/llm-patterns/", m: 20 }],
          see: [
            { label: "System design guide: eval suites as release gates", href: "SYSTEM%20DESIGN.html#/patterns/grounding/eval-gate" },
            { label: "Coding primer: an eval harness", href: "CODING.html#evals" }
          ],
          tags: ["evals", "golden set", "a/b testing", "regression", "error analysis"] },
        { id: "llm-as-judge", name: "LLM-as-judge and its calibration",
          line: "A model grades outputs against a rubric; trust it only after checking it against humans.",
          body: [
            "When quality is subjective (is this summary faithful, is this reply polite), a strong model can grade outputs. It can score one answer against a rubric, compare two answers (pairwise), or compare an answer with a reference. The 2023 MT-Bench study found GPT-4 as judge agreed with human preferences over 80% of the time, about as often as humans agreed with each other.",
            "Judges have known biases: they favour the first position in a pair, longer answers, and their own model family. Calibrate before trusting one: have people label a sample, measure agreement (or precision and recall on failures), refine the rubric, and recheck when the judge model changes. Binary pass or fail with a written reason is more reliable than a 1 to 10 score."
          ],
          where: "Most eval platforms ship judge templates for faithfulness, relevance and tone. Chatbot Arena-style leaderboards use pairwise human votes; many internal evals use pairwise model judges.",
          nuance: "An uncalibrated judge gives confident numbers that can drift without anyone noticing. The judge is itself a model in production: version it, test it, and keep a human-labelled set to check it against.",
          read: [
            { label: "Eugene Yan, Evaluating the effectiveness of LLM-evaluators", url: "https://eugeneyan.com/writing/llm-evaluators/", m: 40 },
            { label: "Judging LLM-as-a-judge with MT-Bench and Chatbot Arena: abstract", url: "https://arxiv.org/abs/2306.05685", m: 10 }
          ],
          tags: ["llm judge", "rubric", "pairwise", "position bias", "calibration"] },
        { id: "hallucination", name: "Hallucination",
          line: "Fluent, confident output that is false or unsupported by the given sources.",
          body: [
            "A model generates the most plausible continuation, not a checked fact, so it can state false things in the same confident tone as true ones. Two kinds matter in products: **unfaithful** answers that contradict or go beyond the provided context (a RAG answer citing a clause the contract does not contain), and **factual** errors from the model's own knowledge (an invented paper or API).",
            "Mitigations: ground answers in retrieved sources and require citations, verify each claim against its cited passage, give the model an explicit way to say 'I don't know', lower the temperature for factual tasks, and check high-stakes output with code or a second model. Measure the rate with a faithfulness eval rather than guessing."
          ],
          where: "Lawyers sanctioned for citing invented cases from ChatGPT; support bots promising refunds that policy does not allow. Every enterprise RAG product sells citation and grounding as its answer.",
          nuance: "Hallucination cannot be removed, only made rare and detectable. Product design matters as much as the model: show sources, make claims easy to verify, and keep a human in the loop where errors are costly.",
          read: [{ label: "Lilian Weng, Extrinsic hallucinations in LLMs", url: "https://lilianweng.github.io/posts/2024-07-07-hallucination/", m: 45 }],
          see: [{ label: "System design guide: enforced citations and verification", href: "SYSTEM%20DESIGN.html#/patterns/grounding/citations" }],
          tags: ["hallucination", "faithfulness", "grounding", "citations"] },
        { id: "guardrails", name: "Guardrails and prompt injection",
          line: "Checks around the model, and the attack where untrusted text gives the model orders.",
          body: [
            "Guardrails are checks outside the model: on input (block abuse, detect personal data, filter off-topic requests) and on output (validate format, check policy, scan for leaked secrets) before anything reaches a user or a tool. They are ordinary code or small classifiers, which makes them predictable in a way prompts are not.",
            "**Prompt injection** is the main security risk: instructions hidden in content the model reads (a web page, an email, a PDF, a tool result) that it then follows. The model cannot reliably tell your instructions from an attacker's. The danger peaks when an agent has private data, reads untrusted content and can send data out, a combination Simon Willison calls the lethal trifecta. Defences are architectural: least-privilege tools, confirmation for risky actions, and removing one leg of the trifecta."
          ],
          where: "OWASP lists prompt injection first in its LLM Top 10. Llama Guard, NeMo Guardrails and cloud content filters are common guardrail tools.",
          nuance: "No prompt reliably stops injection. 'Ignore any instructions in the documents' helps a little; limiting what the agent can do helps a lot.",
          read: [
            { label: "Simon Willison, The lethal trifecta for AI agents", url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/", m: 10 },
            { label: "OWASP Top 10 for LLM applications (2025)", url: "https://genai.owasp.org/llm-top-10/", m: 20 }
          ],
          see: [{ label: "System design guide: prompt-injection defences", href: "SYSTEM%20DESIGN.html#/patterns/agent-safety/injection" }],
          tags: ["guardrails", "prompt injection", "owasp", "least privilege", "safety"] }
      ] },
    { name: "Production", line: "Making it fast, cheap, observable, and deciding when to train.",
      topics: [
        { id: "cost-latency", name: "Latency and cost: caching, routing, small models",
          line: "Reuse work, send easy requests to cheap models, and stream so waiting feels shorter.",
          body: [
            "Cost is tokens times price, and output tokens cost several times input tokens. Latency is time to first token plus output length times time per token. The levers: **prompt caching** reuses the processed prefix of a prompt, so keep stable content (system prompt, tools, documents) first; on Anthropic's API a cache read costs a tenth of the normal input price. **Response caching** returns stored answers for repeated or near-identical questions. **Routing** sends easy requests to a small model and hard ones to a large one; RouteLLM reported cutting cost by more than half in some settings without losing quality.",
            "Also: shorter outputs, fewer agent steps, parallel calls, batch APIs at about half price for work that can wait, and **streaming** so users see the first words quickly."
          ],
          where: "Coding agents depend on prompt caching to stay affordable. Voice agents chase time to first token under a few hundred milliseconds with small, fast models.",
          nuance: "Caches need an exact prefix match: a timestamp at the top of a system prompt breaks every hit. And a cheaper model that needs three retries costs more than a dearer one that gets it right once.",
          read: [
            { label: "Anthropic docs: prompt caching (how it works and pricing)", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching", m: 20 },
            { label: "RouteLLM paper: abstract", url: "https://arxiv.org/abs/2406.18665", m: 10 }
          ],
          see: [
            { label: "System design guide: prompt caching", href: "SYSTEM%20DESIGN.html#/patterns/llm-cost/prompt-cache" },
            { label: "System design guide: model routing and tiering", href: "SYSTEM%20DESIGN.html#/patterns/llm-cost/routing" }
          ],
          tags: ["prompt caching", "routing", "streaming", "batch api", "ttft"] },
        { id: "fine-tuning-vs-prompting", name: "When fine-tuning beats prompting",
          line: "Train when you need a format, style or narrow skill at lower cost; retrieve for knowledge.",
          body: [
            "The usual order is prompting first, then retrieval, then fine-tuning. Fine-tuning earns its cost when prompting has plateaued on a measured eval and the gap is about **behaviour**: a strict output format, a house style, a narrow classification or extraction task, or a tool-calling pattern. It also pays to **distil**: fine-tune a small model on a large model's outputs so a cheap, fast model does one task as well as the expensive one.",
            "It is a poor way to add facts that change, because the model learns new knowledge slowly and unreliably and must be retrained when facts move; retrieval handles that. Fine-tuning also costs a data pipeline, training runs and an eval harness, and ties you to one base model."
          ],
          where: "OpenAI, Google Vertex and Together offer hosted fine-tuning; LoRA adapters on open models (Unsloth, Axolotl) for self-hosters. Common wins: support ticket triage, structured extraction, and small models distilled for latency.",
          nuance: "Most teams that fine-tune too early lacked an eval set, not a better model. Without one you cannot show the tuned model beats a better prompt.",
          see: [{ label: "Coding primer: LoRA", href: "CODING.html#lora" }],
          tags: ["fine-tuning", "distillation", "lora", "sft"] },
        { id: "observability", name: "Observability for LLM apps",
          line: "Trace every call and step: inputs, outputs, tokens, latency, cost and the tools used.",
          body: [
            "An LLM app fails quietly: no exception, only a worse answer. Observability means recording a **trace** per request: each model call with its prompt, output, model, token counts, latency and cost, each retrieval with what came back, each tool call with arguments and result, nested as spans so an agent's whole trajectory can be replayed. On top sit dashboards for cost, latency percentiles and error rates, and alerts on drift.",
            "Traces are also raw material: reading them is how you find failure modes, and the interesting ones become eval cases. OpenTelemetry has GenAI semantic conventions so traces can move between tools."
          ],
          where: "Langfuse, LangSmith, Braintrust, Arize Phoenix, Helicone and Datadog LLM Observability. Most teams start with structured logs and add a tracing tool when agents arrive.",
          nuance: "Logging prompts means logging user data. Decide what to redact and how long to keep it before the first trace ships, not after the first audit.",
          read: [{ label: "OpenTelemetry GenAI semantic conventions (repository)", url: "https://github.com/open-telemetry/semantic-conventions-genai", m: 15 }],
          tags: ["tracing", "spans", "opentelemetry", "langfuse", "monitoring"] },
        { id: "landscape-2026", name: "The industry in 2026",
          line: "Who makes the models, who builds on them, and where the work is moving.",
          body: [
            "**Model makers**: Anthropic, OpenAI and Google at the frontier; Meta, Mistral, DeepSeek, Qwen (Alibaba) and others releasing strong open weights, which keep pushing prices down. **Clouds** resell them (AWS Bedrock, Google Vertex AI, Azure AI Foundry), and inference providers (Together, Fireworks, Baseten, Groq) serve open models fast. **Application companies** build on top: coding (Cursor, Cognition), legal (Harvey), search (Perplexity), support (Sierra, Decagon), voice agents for calls in healthcare and sales.",
            "The direction of travel: from chat to agents that complete multi-step tasks, from single prompts to systems with tools and memory, and from 'which model' to 'whose evals and data'. Model prices per token keep falling for a given quality while total spend keeps rising, because agents use far more tokens."
          ],
          where: "Job titles follow it: AI engineer, applied AI engineer and forward deployed engineer roles at both labs and application companies, often asking for evals, agents and production backend skills together.",
          nuance: "Benchmarks and model rankings change monthly; the durable skills do not. Evaluation, retrieval, tool design, cost control and plain backend engineering transfer across every model release.",
          read: [{ label: "Artificial Analysis: current model and provider comparisons", url: "https://artificialanalysis.ai/", m: 10 }],
          tags: ["industry", "labs", "open weights", "agents", "market"] }
      ] }
  ],
  see: [
    { label: "System design guide", href: "SYSTEM%20DESIGN.html" },
    { label: "Coding primer: AI systems", href: "CODING.html#ai-systems" }
  ]
});
