/* Know now: the topics to have cold first, picked from the work this site was built around
   (agents and evals in production, voice agents, Postgres-backed backends) and the interviews
   that work leads to. They glow in every outline, contents list and map. 41 of 266. */
BASELINE.core = {
  ai: ["context-engineering", "rag", "tool-calling", "agents", "evaluation", "llm-as-judge", "hallucination", "cost-latency"],
  ml: ["loss-functions", "gradient-descent", "backpropagation", "overfitting-regularisation", "transformers", "embeddings", "fine-tuning-lora"],
  backend: ["rest", "sessions-tokens", "caching", "queues-workers", "idempotency", "timeouts-retries", "realtime"],
  systems: ["processes-threads", "event-loops", "latency-numbers", "tcp", "http"],
  distributed: ["replication-leader", "sharding", "exactly-once", "load-shedding", "tail-latency"],
  data: ["indexes", "transactions-isolation"],
  inference: ["prefill-decode", "kv-cache", "continuous-batching", "metrics"],
  audio: ["vad", "voice-agent-pipeline", "turn-taking"]
};
