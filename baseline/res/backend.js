/* What to read and watch for each topic in the backend field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("backend", {
 "load-balancing": [
  {
   "kind": "video",
   "req": true,
   "label": "Top 6 Load Balancing Algorithms Every Developer Should Know",
   "url": "https://www.youtube.com/watch?v=dBmxNsS3BGE",
   "m": 6,
   "yt": {
    "id": "dBmxNsS3BGE",
    "ch": "ByteByteGo"
   },
   "why": "Round robin, least connections, hashing and the rest side by side."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Load balancing in Layer 4 vs Layer 7 with HAProxy examples",
   "url": "https://www.youtube.com/watch?v=aKMLgFVxZYk",
   "m": 38,
   "yt": {
    "id": "aKMLgFVxZYk",
    "ch": "Hussein Nasser"
   },
   "why": "Layer 4 against layer 7 shown in HAProxy; watch the first half."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Sam Rose: load balancing, an interactive essay on the algorithms",
   "url": "https://samwho.dev/load-balancing/",
   "m": 15,
   "why": "Interactive: watch each algorithm handle uneven requests."
  }
 ],
 "rest": [
  {
   "kind": "video",
   "req": true,
   "label": "REST API best practices: how to use the right HTTP methods and status codes",
   "url": "https://www.youtube.com/watch?v=XLQxfpDmqbM",
   "m": 6,
   "why": "Which method and which status code, and why, in six minutes.",
   "yt": {
    "id": "XLQxfpDmqbM",
    "ch": "Coding with Nam"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Roy Fielding: dissertation chapter 5, the REST constraints derived one by one",
   "url": "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm",
   "m": 40,
   "why": "The source of the constraints; read the constraints section only."
  }
 ],
 "grpc-graphql": [
  {
   "kind": "video",
   "req": true,
   "label": "tRPC, gRPC, GraphQL or REST: when to use what",
   "url": "https://www.youtube.com/watch?v=veAb1fSp1Lk",
   "m": 11,
   "why": "The decision between the four, from the client's and the team's side.",
   "yt": {
    "id": "veAb1fSp1Lk",
    "ch": "Software Developer Diaries"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "gRPC docs: introduction to gRPC and protocol buffers",
   "url": "https://grpc.io/docs/what-is-grpc/introduction/",
   "m": 10,
   "why": "How protobuf and the four call types work."
  },
  {
   "kind": "read",
   "req": false,
   "label": "GraphQL docs: introduction to GraphQL",
   "url": "https://graphql.org/learn/introduction/",
   "m": 10,
   "why": "Schema, queries and why the client picks the fields."
  }
 ],
 "webhooks": [
  {
   "kind": "video",
   "req": true,
   "label": "Webhooks explained again",
   "url": "https://www.youtube.com/watch?v=9zfAqoTm4-Q",
   "m": 7,
   "why": "Push against polling, and what the receiver has to handle.",
   "yt": {
    "id": "9zfAqoTm4-Q",
    "ch": "ByteMonk"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Stripe docs: receive webhook events, the delivery behaviour and best practices sections",
   "url": "https://docs.stripe.com/webhooks",
   "m": 15,
   "why": "Signatures, retries and ordering as a real provider does them."
  }
 ],
 "realtime": [
  {
   "kind": "video",
   "req": true,
   "label": "Long polling vs SSE vs WebSockets vs QUIC",
   "url": "https://www.youtube.com/watch?v=3Ud6Ds2abO8",
   "m": 11,
   "why": "The four options compared by direction, connection and cost.",
   "yt": {
    "id": "3Ud6Ds2abO8",
    "ch": "TechPrep"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "MDN: using server-sent events, the event stream format",
   "url": "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
   "m": 10,
   "why": "The event stream format and automatic reconnect."
  }
 ],
 "sessions-tokens": [
  {
   "kind": "video",
   "req": true,
   "label": "JWT vs session: which is better? (JWT explained in 10 minutes)",
   "url": "https://www.youtube.com/watch?v=tbD3Y5H8JoQ",
   "m": 10,
   "why": "What a signed token holds, and what you give up against a server session.",
   "yt": {
    "id": "tbD3Y5H8JoQ",
    "ch": "SystemBlueprint"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "jwt.io: introduction to JSON Web Tokens",
   "url": "https://jwt.io/introduction",
   "m": 8,
   "why": "The three parts of a token and how the signature is checked."
  },
  {
   "kind": "read",
   "req": false,
   "label": "OWASP: session management cheat sheet",
   "url": "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
   "m": 20,
   "why": "Cookie flags, rotation and expiry: the checklist."
  }
 ],
 "oauth": [
  {
   "kind": "video",
   "req": true,
   "label": "An illustrated guide to OAuth and OpenID Connect",
   "url": "https://www.youtube.com/watch?v=t18YB3xDfXI",
   "m": 17,
   "why": "The redirect, the code, the token, with pictures at each step.",
   "yt": {
    "id": "t18YB3xDfXI",
    "ch": "OktaDev"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "oauth.net: OAuth 2.0 overview, grant types and OAuth 2.1",
   "url": "https://oauth.net/2/",
   "m": 10,
   "why": "Grant types, and what OAuth 2.1 tightens."
  }
 ],
 "authorization": [
  {
   "kind": "video",
   "req": true,
   "label": "Authorization 101 for developers: RBAC, ReBAC and ABAC",
   "url": "https://www.youtube.com/watch?v=qprypVZ6Pxo",
   "m": 14,
   "why": "The three models and when roles stop being enough.",
   "yt": {
    "id": "qprypVZ6Pxo",
    "ch": "Descope"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "What is Google Zanzibar?",
   "url": "https://www.youtube.com/watch?v=MplJRRe6BuY",
   "m": 3,
   "why": "Relationship tuples in three minutes.",
   "yt": {
    "id": "MplJRRe6BuY",
    "ch": "Oso"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google: Zanzibar, Google's consistent, global authorization system (paper)",
   "url": "https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/",
   "m": 30,
   "why": "The paper behind relationship-based access control."
  }
 ],
 "orms": [
  {
   "kind": "video",
   "req": true,
   "label": "N+1 Problem: Eager Loading with Active Record",
   "url": "https://www.youtube.com/watch?v=wLMRzdOztUY",
   "m": 14,
   "yt": {
    "id": "wLMRzdOztUY",
    "ch": "AgentOps Show"
   },
   "why": "The N+1 pattern shown live, and the eager loading that removes it."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Raw SQL, SQL Query Builder, or ORM?",
   "url": "https://www.youtube.com/watch?v=x1fCJ7sUXCM",
   "m": 17,
   "yt": {
    "id": "x1fCJ7sUXCM",
    "ch": "ArjanCodes"
   },
   "why": "Raw SQL, query builder and ORM compared on what each hides."
  },
  {
   "kind": "read",
   "req": true,
   "label": "PlanetScale: what is the N+1 query problem and how to solve it",
   "url": "https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it",
   "m": 8,
   "why": "One query for the list, then one per row: how it happens and the join that fixes it."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Django docs: select_related and prefetch_related",
   "url": "https://docs.djangoproject.com/en/stable/ref/models/querysets/#select-related",
   "m": 10,
   "why": "The two eager-loading tools in one ORM, joins against extra queries."
  }
 ],
 "connection-pools": [
  {
   "kind": "video",
   "req": true,
   "label": "Connection Pooling in PostgresSQL with NodeJS (Performance Numbers)",
   "url": "https://www.youtube.com/watch?v=GTeCtIoV2Tw",
   "m": 13,
   "yt": {
    "id": "GTeCtIoV2Tw",
    "ch": "Hussein Nasser"
   },
   "why": "Measured numbers: pooled against unpooled Postgres connections."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Database Connection Pool Sizing - Demystified!",
   "url": "https://www.youtube.com/watch?v=Cp-aFYHLiCw",
   "m": 39,
   "yt": {
    "id": "Cp-aFYHLiCw",
    "ch": "Devoxx"
   },
   "why": "Why a small pool wins; watch for the sizing argument."
  },
  {
   "kind": "read",
   "req": true,
   "label": "HikariCP wiki: about pool sizing",
   "url": "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing",
   "m": 10,
   "why": "The short argument for a small pool, with numbers."
  },
  {
   "kind": "read",
   "req": false,
   "label": "PgBouncer: features, the three pooling modes",
   "url": "https://www.pgbouncer.org/features.html",
   "m": 5,
   "why": "Session, transaction and statement pooling in front of Postgres."
  }
 ],
 "migrations": [
  {
   "kind": "video",
   "req": true,
   "label": "Every engineer should know this (Expand-Contract Pattern)",
   "url": "https://www.youtube.com/watch?v=ONSCQWLD9d0",
   "m": 7,
   "yt": {
    "id": "ONSCQWLD9d0",
    "ch": "Software Developer Diaries"
   },
   "why": "Add, copy, switch, remove: the safe order for any schema change."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How do software projects achieve zero downtime database migrations?",
   "url": "https://www.youtube.com/watch?v=cw5K2O4AHJc",
   "m": 8,
   "yt": {
    "id": "cw5K2O4AHJc",
    "ch": "Web Dev Cody"
   },
   "why": "How a live system changes its schema without downtime."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Stripe: online migrations at scale, the four-step dual-write pattern",
   "url": "https://stripe.com/blog/online-migrations",
   "m": 15,
   "why": "Dual writes and backfill at a payments company."
  }
 ],
 "caching": [
  {
   "kind": "video",
   "req": true,
   "label": "Caching Pitfalls Every Developer Should Know",
   "url": "https://www.youtube.com/watch?v=wh98s0XhMmQ",
   "m": 7,
   "yt": {
    "id": "wh98s0XhMmQ",
    "ch": "ByteByteGo"
   },
   "why": "Stampede, stale data and the other ways a cache goes wrong."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Basic Caching Techniques Explained: Write-Through, Write-Back, Aside",
   "url": "https://www.youtube.com/watch?v=ccemOqDrc2I",
   "m": 10,
   "yt": {
    "id": "ccemOqDrc2I",
    "ch": "Hussein Nasser"
   },
   "why": "Cache-aside, write-through and write-back in one pass."
  },
  {
   "kind": "read",
   "req": true,
   "label": "AWS Builders' Library: caching challenges and strategies",
   "url": "https://aws.amazon.com/builders-library/caching-challenges-and-strategies/",
   "m": 20,
   "why": "Where to cache, what to evict and how invalidation goes wrong."
  }
 ],
 "queues-workers": [
  {
   "kind": "video",
   "req": true,
   "label": "What is a message queue and where is it used?",
   "url": "https://www.youtube.com/watch?v=oUJbuFMyBDk",
   "m": 10,
   "yt": {
    "id": "oUJbuFMyBDk",
    "ch": "Gaurav Sen"
   },
   "why": "Why work leaves the request and what a queue gives you."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How to implement Work Queues with Relational Databases and SQL SKIP LOCKED",
   "url": "https://www.youtube.com/watch?v=xzmd6cVoggc",
   "m": 8,
   "yt": {
    "id": "xzmd6cVoggc",
    "ch": "Vlad Mihalcea"
   },
   "why": "A job queue in plain Postgres with SKIP LOCKED."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Postgres docs: the locking clause of SELECT, including SKIP LOCKED",
   "url": "https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE",
   "m": 10,
   "why": "The locking clause that makes SKIP LOCKED work."
  }
 ],
 "idempotency": [
  {
   "kind": "video",
   "req": true,
   "label": "Designing Idempotent API Endpoints for Payments at Stripe",
   "url": "https://www.youtube.com/watch?v=J2IcD9FZvZU",
   "m": 15,
   "yt": {
    "id": "J2IcD9FZvZU",
    "ch": "Arpit Bhayani"
   },
   "why": "How a payments API makes a retried charge safe with a key."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Idempotency in APIs: you should be aware of this!",
   "url": "https://www.youtube.com/watch?v=t99NvIazD68",
   "m": 8,
   "yt": {
    "id": "t99NvIazD68",
    "ch": "Software Developer Diaries"
   },
   "why": "Which HTTP methods are idempotent and how to make the rest so."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Brandur Leach: implementing Stripe-like idempotency keys in Postgres",
   "url": "https://brandur.org/idempotency-keys",
   "m": 25,
   "why": "An idempotency key table built step by step in Postgres."
  }
 ],
 "timeouts-retries": [
  {
   "kind": "video",
   "req": true,
   "label": "Every engineer should know this (retries with jitter)",
   "url": "https://www.youtube.com/watch?v=yGO4Igb45V0",
   "m": 10,
   "yt": {
    "id": "yGO4Igb45V0",
    "ch": "Software Developer Diaries"
   },
   "why": "Why synchronized retries pile on, and the jitter that spreads them."
  },
  {
   "kind": "video",
   "req": false,
   "label": "4 Traffic Failure Handling Patterns: Timeout, Retry, Jitter, Backoff",
   "url": "https://www.youtube.com/watch?v=m28VAy2yZsE",
   "m": 17,
   "yt": {
    "id": "m28VAy2yZsE",
    "ch": "SoftwareDude"
   },
   "why": "Timeout, retry, jitter and backoff as one set of failure patterns."
  },
  {
   "kind": "read",
   "req": true,
   "label": "AWS Builders' Library: timeouts, retries and backoff with jitter",
   "url": "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
   "m": 20,
   "why": "Timeouts, retry budgets and full jitter, from the people who run it."
  }
 ],
 "rate-limiting": [
  {
   "kind": "video",
   "req": true,
   "label": "Rate Limiter System Design: Token Bucket, Leaky Bucket, Scaling",
   "url": "https://www.youtube.com/watch?v=YXkOdWBwqaA",
   "m": 8,
   "yt": {
    "id": "YXkOdWBwqaA",
    "ch": "ByteByteGo"
   },
   "why": "Token bucket and leaky bucket, then how to scale the limiter."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Five Rate Limiting Algorithms: Key Concepts in System Design",
   "url": "https://www.youtube.com/watch?v=mQCJJqUfn9Y",
   "m": 18,
   "yt": {
    "id": "mQCJJqUfn9Y",
    "ch": "Hello Byte"
   },
   "why": "The five algorithms compared, windows included."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Stripe: scaling your API with rate limiters",
   "url": "https://stripe.com/blog/rate-limiters",
   "m": 15,
   "why": "Four limiters one company runs, and why each exists."
  }
 ],
 "serverless-edge": [
  {
   "kind": "video",
   "req": true,
   "label": "AWS Lambda Function Execution and Cold Start",
   "url": "https://www.youtube.com/watch?v=BhQh9QZdiKQ",
   "m": 14,
   "yt": {
    "id": "BhQh9QZdiKQ",
    "ch": "Be A Better Dev"
   },
   "why": "What a cold start does, step by step."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What the heck is a V8 isolate?",
   "url": "https://www.youtube.com/watch?v=LXv5H8B-h5E",
   "m": 5,
   "yt": {
    "id": "LXv5H8B-h5E",
    "ch": "Annie Sexton"
   },
   "why": "What an isolate is and why it starts faster than a container."
  },
  {
   "kind": "read",
   "req": true,
   "label": "AWS docs: the Lambda execution environment lifecycle and cold starts",
   "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html",
   "m": 15,
   "why": "The execution environment lifecycle: init, invoke, freeze."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Cloudflare docs: how Workers works, isolates against containers",
   "url": "https://developers.cloudflare.com/workers/reference/how-workers-works/",
   "m": 8,
   "why": "How Workers avoid cold starts."
  }
 ],
 "monolith-microservices": [
  {
   "kind": "video",
   "req": true,
   "label": "Monolithic vs Microservice Architecture: Which To Use and When?",
   "url": "https://www.youtube.com/watch?v=NdeTGlZ__Do",
   "m": 11,
   "yt": {
    "id": "NdeTGlZ__Do",
    "ch": "Alex Hyett"
   },
   "why": "When one deployable is enough and when to split."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Moving from monoliths to microservices",
   "url": "https://www.youtube.com/watch?v=rckfN7xFig0",
   "m": 20,
   "yt": {
    "id": "rckfN7xFig0",
    "ch": "Gaurav Sen"
   },
   "why": "What changes in practice when a monolith is split."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Martin Fowler: Monolith First",
   "url": "https://martinfowler.com/bliki/MonolithFirst.html",
   "m": 5,
   "why": "Start with one deployable and split when a boundary proves itself."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Shopify Engineering: deconstructing the monolith",
   "url": "https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity",
   "m": 15,
   "why": "A large monolith kept and given module boundaries."
  }
 ],
 "observability": [
  {
   "kind": "video",
   "req": true,
   "label": "Metrics, Logs and Traces: What To Observe and Why",
   "url": "https://www.youtube.com/watch?v=aJpzr8648XE",
   "m": 9,
   "yt": {
    "id": "aJpzr8648XE",
    "ch": "Tech Upskill"
   },
   "why": "What each of logs, metrics and traces answers."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Distributed Tracing in Microservices",
   "url": "https://www.youtube.com/watch?v=XYvQHjWJJTE",
   "m": 8,
   "yt": {
    "id": "XYvQHjWJJTE",
    "ch": "ByteMonk"
   },
   "why": "How one request is followed across services with traces."
  },
  {
   "kind": "read",
   "req": true,
   "label": "OpenTelemetry: observability primer",
   "url": "https://opentelemetry.io/docs/concepts/observability-primer/",
   "m": 15,
   "why": "Logs, metrics and traces, and how they join."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google SRE book: ch. 6 Monitoring Distributed Systems",
   "url": "https://sre.google/sre-book/monitoring-distributed-systems/",
   "m": 25,
   "why": "What to alert on: the four golden signals."
  }
 ],
 "testing-services": [
  {
   "kind": "video",
   "req": true,
   "label": "Static, Unit, Integration, and End-to-End Tests Explained",
   "url": "https://www.youtube.com/watch?v=TLccnKIMggA",
   "m": 14,
   "yt": {
    "id": "TLccnKIMggA",
    "ch": "Lucas Paganini"
   },
   "why": "What unit, integration and end-to-end tests each catch."
  },
  {
   "kind": "video",
   "req": false,
   "label": "When To Unit, E2E, And Integration Test",
   "url": "https://www.youtube.com/watch?v=isI1c0eGSZ0",
   "m": 15,
   "yt": {
    "id": "isI1c0eGSZ0",
    "ch": "The PrimeTime"
   },
   "why": "How to choose the level for a given piece of code."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Ham Vocke: the practical test pyramid",
   "url": "https://martinfowler.com/articles/practical-test-pyramid.html",
   "m": 40,
   "why": "What each test level catches, with a worked service."
  }
 ]
});
