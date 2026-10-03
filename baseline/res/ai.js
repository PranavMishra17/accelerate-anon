/* What to read and watch for each topic in the ai field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("ai", {
 "model-choice": [
  {
   "kind": "read",
   "req": true,
   "label": "Artificial Analysis: model comparison on intelligence, speed and price",
   "url": "https://artificialanalysis.ai/",
   "m": 10,
   "why": "Live numbers on quality, speed and price to compare models."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LLM evals: find the cheapest model that passes your tests",
   "url": "https://www.youtube.com/watch?v=Tzz0UeENXkU",
   "m": 18,
   "why": "Run your own tests on several models and pick the cheapest that passes.",
   "yt": {
    "id": "Tzz0UeENXkU",
    "ch": "CloudYeti | Practical AI Engineering"
   }
  }
 ],
 "prompting": [
  {
   "kind": "video",
   "req": true,
   "label": "Prompting 101",
   "url": "https://www.youtube.com/watch?v=ysPbXH0LpIE",
   "m": 25,
   "why": "Anthropic's applied AI team builds a real prompt step by step.",
   "yt": {
    "id": "ysPbXH0LpIE",
    "ch": "Anthropic"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Anthropic docs: prompting best practices (general principles and examples sections)",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
   "m": 30,
   "why": "The official principles and examples to check your prompts against."
  }
 ],
 "context-engineering": [
  {
   "kind": "video",
   "req": true,
   "label": "Context engineering explained: What every AI developer should know",
   "url": "https://www.youtube.com/watch?v=BBPQYtR7oUk",
   "m": 11,
   "yt": {
    "id": "BBPQYtR7oUk",
    "ch": "Google Cloud Tech and Smitha Kolan - Machine Learning Engineer"
   },
   "why": "Shows what goes into the window on each call and why order and selection matter."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Context Engineering for Agents",
   "url": "https://www.youtube.com/watch?v=4GiqzUHD5AA",
   "m": 23,
   "yt": {
    "id": "4GiqzUHD5AA",
    "ch": "LangChain"
   },
   "why": "The write, select, compress and isolate moves, with agent examples."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Anthropic, Effective context engineering for AI agents",
   "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
   "m": 20,
   "why": "Anthropic's definition of context engineering and the techniques for long tasks."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Lost in the middle: how language models use long contexts (abstract and figure 1)",
   "url": "https://arxiv.org/abs/2307.03172",
   "m": 10,
   "why": "Why facts in the middle of a long context get missed."
  }
 ],
 "structured-output": [
  {
   "kind": "video",
   "req": true,
   "label": "Structured Output from LLMs: Grammars, Regex, and State Machines",
   "url": "https://www.youtube.com/watch?v=xpvFinvqRCA",
   "m": 18,
   "yt": {
    "id": "xpvFinvqRCA",
    "ch": "Efficient NLP"
   },
   "why": "How constrained decoding forces a schema-valid answer, token by token."
  },
  {
   "kind": "video",
   "req": false,
   "label": "OpenAI Structured Output - All You Need to Know",
   "url": "https://www.youtube.com/watch?v=fuMKrKlaku4",
   "m": 25,
   "yt": {
    "id": "fuMKrKlaku4",
    "ch": "Dave Ebbelaar"
   },
   "why": "Schema in, validated object out, in practice with Pydantic."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Anthropic docs: structured outputs (JSON outputs and strict tool use)",
   "url": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
   "m": 15,
   "why": "How to get schema-valid JSON and strict tool inputs from the API."
  }
 ],
 "rag": [
  {
   "kind": "video",
   "req": true,
   "label": "What is retrieval-augmented generation (RAG)?",
   "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
   "m": 7,
   "why": "The retrieve-then-generate idea in a few minutes, from IBM.",
   "yt": {
    "id": "T-D1OfcDW1M",
    "ch": "IBM Technology"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "RAG paper (Lewis et al., 2020): abstract and figure 1",
   "url": "https://arxiv.org/abs/2005.11401",
   "m": 10,
   "why": "The original paper: the idea and the architecture figure."
  }
 ],
 "chunking-embeddings": [
  {
   "kind": "video",
   "req": true,
   "label": "Chunking Strategies Explained",
   "url": "https://www.youtube.com/watch?v=ZTOtxiWb2bE",
   "m": 9,
   "yt": {
    "id": "ZTOtxiWb2bE",
    "ch": "Redis"
   },
   "why": "Fixed, recursive and semantic chunking, and the trade-off in chunk size."
  },
  {
   "kind": "video",
   "req": false,
   "label": "The Best RAG Technique Yet? Anthropic's Contextual Retrieval Explained",
   "url": "https://www.youtube.com/watch?v=tmiBae2goJM",
   "m": 17,
   "yt": {
    "id": "tmiBae2goJM",
    "ch": "Prompt Engineering"
   },
   "why": "Why a bare chunk loses meaning and how a short added context fixes retrieval."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Anthropic, Introducing contextual retrieval",
   "url": "https://www.anthropic.com/engineering/contextual-retrieval",
   "m": 15,
   "why": "Why a chunk loses its context, and how adding context before embedding fixes retrieval."
  }
 ],
 "hybrid-search-reranking": [
  {
   "kind": "read",
   "req": true,
   "label": "Anthropic, Introducing contextual retrieval (the BM25, embedding and reranking sections)",
   "url": "https://www.anthropic.com/engineering/contextual-retrieval",
   "m": 15,
   "why": "Measured gains from BM25 plus embeddings plus a reranker."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Hybrid retrieval and reranking for RAG: BM25, vector search, RRF, cross-encoders",
   "url": "https://www.youtube.com/watch?v=PP49RulTXp8",
   "m": 10,
   "why": "BM25, vector search, rank fusion and a cross-encoder reranker in one pipeline.",
   "yt": {
    "id": "PP49RulTXp8",
    "ch": "Engineering Insider"
   }
  }
 ],
 "tool-calling": [
  {
   "kind": "video",
   "req": true,
   "label": "What is tool calling? Connecting LLMs to your data",
   "url": "https://www.youtube.com/watch?v=h8gMhXYAv1k",
   "m": 5,
   "why": "How a model asks for a function call and your code runs it.",
   "yt": {
    "id": "h8gMhXYAv1k",
    "ch": "IBM Technology"
   }
  }
 ],
 "agents": [
  {
   "kind": "video",
   "req": true,
   "label": "How we build effective agents",
   "url": "https://www.youtube.com/watch?v=D7_ipDqhtwk",
   "m": 16,
   "why": "Anthropic's rules for when and how to build an agent.",
   "yt": {
    "id": "D7_ipDqhtwk",
    "ch": "AI Engineer"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "ReAct paper: abstract and figure 1",
   "url": "https://arxiv.org/abs/2210.03629",
   "m": 10,
   "why": "The think, act, observe loop that most agents copy."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Chip Huyen, Agents (tools, planning and failure modes)",
   "url": "https://huyenchip.com/2025/01/07/agents.html",
   "m": 40,
   "why": "Tools, planning and failure modes in depth."
  }
 ],
 "agent-memory": [
  {
   "kind": "video",
   "req": true,
   "label": "The four types of memory every AI agent needs",
   "url": "https://www.youtube.com/watch?v=BacJ6sEhqMo",
   "m": 11,
   "why": "Working, episodic, semantic and procedural memory, from IBM.",
   "yt": {
    "id": "BacJ6sEhqMo",
    "ch": "IBM Technology"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Lilian Weng, LLM powered autonomous agents: the memory section",
   "url": "https://lilianweng.github.io/posts/2023-06-23-agent/",
   "m": 20,
   "why": "The memory section: short-term, long-term, retrieval."
  }
 ],
 "multi-agent": [
  {
   "kind": "video",
   "req": true,
   "label": "Multi Agent Systems Explained: How AI Agents & LLMs Work Together",
   "url": "https://www.youtube.com/watch?v=sWH0T4Zez6I",
   "m": 8,
   "yt": {
    "id": "sWH0T4Zez6I",
    "ch": "IBM Technology"
   },
   "why": "The lead and worker shape, and when splitting a task helps."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Conceptual Guide: Multi Agent Architectures",
   "url": "https://www.youtube.com/watch?v=4nZl32FwU-o",
   "m": 9,
   "yt": {
    "id": "4nZl32FwU-o",
    "ch": "LangChain"
   },
   "why": "Supervisor, network and hierarchical layouts compared."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Anthropic, How we built our multi-agent research system",
   "url": "https://www.anthropic.com/engineering/multi-agent-research-system",
   "m": 25,
   "why": "Anthropic's orchestrator and workers design, with what broke and what it cost."
  }
 ],
 "mcp": [
  {
   "kind": "video",
   "req": true,
   "label": "How Model Context Protocol (MCP) actually works",
   "url": "https://www.youtube.com/watch?v=cGuyrANVi4A",
   "m": 8,
   "why": "What the client, server and tools do on the wire.",
   "yt": {
    "id": "cGuyrANVi4A",
    "ch": "Google Cloud Tech"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "MCP docs: architecture overview (participants, layers, primitives)",
   "url": "https://modelcontextprotocol.io/docs/learn/architecture",
   "m": 20,
   "why": "The official architecture page: participants, layers and primitives."
  }
 ],
 "evaluation": [
  {
   "kind": "video",
   "req": true,
   "label": "Error Analysis: The Highest ROI Technique In AI Engineering",
   "url": "https://www.youtube.com/watch?v=e2i6JbU2R-s",
   "m": 13,
   "yt": {
    "id": "e2i6JbU2R-s",
    "ch": "Hamel Husain"
   },
   "why": "Start from real traces, name the failure modes, then build the eval set."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LLM Evals: Common Mistakes",
   "url": "https://www.youtube.com/watch?v=GL0XhAj5LPE",
   "m": 29,
   "yt": {
    "id": "GL0XhAj5LPE",
    "ch": "Hamel Husain"
   },
   "why": "What goes wrong in eval sets and metrics; watch the first half."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Eugene Yan, Patterns for building LLM-based systems: the evals section",
   "url": "https://eugeneyan.com/writing/llm-patterns/",
   "m": 20,
   "why": "The evals section: how to build and run an eval set."
  }
 ],
 "llm-as-judge": [
  {
   "kind": "video",
   "req": true,
   "label": "LLM as a Judge: Scaling AI Evaluation Strategies",
   "url": "https://www.youtube.com/watch?v=trfUBIDeI1Y",
   "m": 7,
   "yt": {
    "id": "trfUBIDeI1Y",
    "ch": "IBM Technology"
   },
   "why": "Rubrics, pairwise and single-score judging, and the biases to check."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Eugene Yan, Evaluating the effectiveness of LLM-evaluators",
   "url": "https://eugeneyan.com/writing/llm-evaluators/",
   "m": 40,
   "why": "How to calibrate an LLM judge against human labels."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Judging LLM-as-a-judge with MT-Bench and Chatbot Arena: abstract",
   "url": "https://arxiv.org/abs/2306.05685",
   "m": 10,
   "why": "The paper that named the judge's biases: position, length, self-preference."
  }
 ],
 "hallucination": [
  {
   "kind": "video",
   "req": true,
   "label": "Why Large Language Models Hallucinate",
   "url": "https://www.youtube.com/watch?v=cfqtFvWOfg0",
   "m": 10,
   "yt": {
    "id": "cfqtFvWOfg0",
    "ch": "IBM Technology"
   },
   "why": "Why a plausible continuation is not a checked fact, and the usual mitigations."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Why do AI models hallucinate?",
   "url": "https://www.youtube.com/watch?v=005JLRt3gXI",
   "m": 6,
   "yt": {
    "id": "005JLRt3gXI",
    "ch": "Claude and Anthropic"
   },
   "why": "A short lab view of where false answers come from."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Lilian Weng, Extrinsic hallucinations in LLMs",
   "url": "https://lilianweng.github.io/posts/2024-07-07-hallucination/",
   "m": 45,
   "why": "Causes of unsupported output and how to detect and reduce it."
  }
 ],
 "guardrails": [
  {
   "kind": "video",
   "req": true,
   "label": "Prompt Injection, explained",
   "url": "https://www.youtube.com/watch?v=FgxwCaL6UTA",
   "m": 13,
   "yt": {
    "id": "FgxwCaL6UTA",
    "ch": "Simon Willison"
   },
   "why": "The attack from the person who named it, and why filters alone do not stop it."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What Is a Prompt Injection Attack?",
   "url": "https://www.youtube.com/watch?v=jrHRe9lSqqA",
   "m": 11,
   "yt": {
    "id": "jrHRe9lSqqA",
    "ch": "IBM Technology"
   },
   "why": "Direct and indirect injection with the defences around the model."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Simon Willison, The lethal trifecta for AI agents",
   "url": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
   "m": 10,
   "why": "The three conditions that make an agent exploitable by injected text."
  },
  {
   "kind": "read",
   "req": false,
   "label": "OWASP Top 10 for LLM applications (2025)",
   "url": "https://genai.owasp.org/llm-top-10/",
   "m": 20,
   "why": "The standard checklist of LLM application risks."
  }
 ],
 "cost-latency": [
  {
   "kind": "video",
   "req": true,
   "label": "What is Prompt Caching? Optimize LLM Latency with AI Transformers",
   "url": "https://www.youtube.com/watch?v=u57EnkQaUTY",
   "m": 10,
   "yt": {
    "id": "u57EnkQaUTY",
    "ch": "IBM Technology"
   },
   "why": "How a reused prompt prefix skips work, and what breaks the cache."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What is an LLM Router?",
   "url": "https://www.youtube.com/watch?v=V_K6PCmdtRg",
   "m": 10,
   "yt": {
    "id": "V_K6PCmdtRg",
    "ch": "Sam Witteveen"
   },
   "why": "Sending easy requests to a cheap model and hard ones to a strong one."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Anthropic docs: prompt caching (how it works and pricing)",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
   "m": 20,
   "why": "How cache hits cut cost and latency, and what to put in the prefix."
  },
  {
   "kind": "read",
   "req": false,
   "label": "RouteLLM paper: abstract",
   "url": "https://arxiv.org/abs/2406.18665",
   "m": 10,
   "why": "Routing easy requests to a cheap model, with measured savings."
  }
 ],
 "fine-tuning-vs-prompting": [
  {
   "kind": "video",
   "req": true,
   "label": "RAG vs Fine-Tuning vs Prompt Engineering: Optimizing AI Models",
   "url": "https://www.youtube.com/watch?v=zYGDpG-pTho",
   "m": 14,
   "yt": {
    "id": "zYGDpG-pTho",
    "ch": "IBM Technology"
   },
   "why": "The ladder: prompt first, retrieve for knowledge, fine-tune for style or format."
  },
  {
   "kind": "video",
   "req": false,
   "label": "RAG vs. Fine Tuning",
   "url": "https://www.youtube.com/watch?v=00Q0G84kq3M",
   "m": 9,
   "yt": {
    "id": "00Q0G84kq3M",
    "ch": "IBM Technology"
   },
   "why": "A shorter pass on when each one wins."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Eugene Yan, Patterns for building LLM-based systems (the fine-tuning section)",
   "url": "https://eugeneyan.com/writing/llm-patterns/",
   "m": 20,
   "why": "When fine-tuning is worth it, next to retrieval and caching."
  }
 ],
 "observability": [
  {
   "kind": "video",
   "req": true,
   "label": "LLM Observability Explained: Why do you need LLM Observability?",
   "url": "https://www.youtube.com/watch?v=o76xU3RQ47Q",
   "m": 4,
   "yt": {
    "id": "o76xU3RQ47Q",
    "ch": "Agenta AI"
   },
   "why": "Why LLM apps fail quietly and what a trace has to record."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Langfuse Intro - Observability & Tracing Deep Dive",
   "url": "https://www.youtube.com/watch?v=pTneXS_m1rk",
   "m": 12,
   "yt": {
    "id": "pTneXS_m1rk",
    "ch": "Langfuse"
   },
   "why": "Traces, spans, cost and latency views on a real app."
  },
  {
   "kind": "read",
   "req": true,
   "label": "OpenTelemetry GenAI semantic conventions (repository)",
   "url": "https://github.com/open-telemetry/semantic-conventions-genai",
   "m": 15,
   "why": "The standard span and attribute names for LLM calls, tokens and tools."
  }
 ],
 "landscape-2026": [
  {
   "kind": "read",
   "req": true,
   "label": "Artificial Analysis: current model and provider comparisons",
   "url": "https://artificialanalysis.ai/",
   "m": 10,
   "why": "Current leaders by provider and model, with prices."
  }
 ]
});
