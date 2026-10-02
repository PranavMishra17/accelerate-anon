/* What to read and watch for each topic in the backend field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("backend", {
 "load-balancing": [
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
   "kind": "read",
   "req": true,
   "label": "Ham Vocke: the practical test pyramid",
   "url": "https://martinfowler.com/articles/practical-test-pyramid.html",
   "m": 40,
   "why": "What each test level catches, with a worked service."
  }
 ]
});
