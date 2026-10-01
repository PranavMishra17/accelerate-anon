BASELINE.field({
  id: "backend", name: "Backend engineering", short: "Backend", layer: "Building",
  ink: "#2F5E8C", inkDark: "#8DB4DE",
  lede: "Backend engineering is the server side of software: the code that receives requests, checks who sent them, keeps state in databases and queues, and keeps answering when parts of it fail.",
  overview: [
    "Backend engineers build and run the services behind every app: the APIs a web or mobile client calls, the database schemas and queries under them, the jobs that run off the request path, and the integrations with payment, email and model providers. Titles vary: backend engineer, software engineer (backend), platform engineer, API engineer; at a small company the same person is the full-stack engineer. A typical day is a new endpoint and its migration, a slow query, a retry storm in an incident review, or a webhook that arrived twice.",
    "It sits between the fields. It takes requests from **frontend** and **mobile**, stores them with the tools of **data** and **distributed systems**, and runs on **cloud** under **DevOps** practice. In 2026 the common stack is plainer than conference talks suggest: Postgres as the default database, Redis for caching and rate limits, a queue (SQS, Kafka, or a table in Postgres), and a service in TypeScript, Python, Go or Java behind a managed load balancer. AI products made the work busier, not different: an LLM call is a slow, flaky, metered upstream, and every lesson here on timeouts, retries, idempotency and queues applies to it.",
    "Read the clusters in the order of a request's life: the path in, who is calling, the state it touches, the work pushed off the path and how failure is contained, then how the whole service is shaped, watched and tested. The map draws the same path."
  ],
  diagram: {
    nodes: [
      { id: "frontend", label: "Client", sub: "browser, app, service", col: 0, row: 0 },
      { id: "load-balancing", label: "Load balancer", sub: "TLS, routing, health", col: 0, row: 1 },
      { id: "rate-limiting", label: "Rate limiter", sub: "per key, per tenant", col: 0, row: 2 },
      { id: "sessions-tokens", label: "Auth check", sub: "session or token", col: 1, row: 0 },
      { id: "rest", label: "API handler", sub: "REST, gRPC, GraphQL", col: 1, row: 1 },
      { id: "queues-workers", label: "Queue and workers", sub: "work off the request", col: 1, row: 2 },
      { id: "webhooks", label: "Webhooks out", sub: "signed, retried", col: 1, row: 3 },
      { id: "caching", label: "Cache", sub: "Redis, cache-aside", col: 2, row: 0 },
      { id: "connection-pools", label: "Connection pool", sub: "a few dozen, shared", col: 2, row: 1 },
      { id: "data", label: "Database", sub: "Postgres, the truth", col: 2, row: 2 }
    ],
    edges: [
      ["frontend", "load-balancing", "HTTPS"], ["load-balancing", "rate-limiting"], ["rate-limiting", "rest", "allowed"],
      ["rest", "sessions-tokens", "who is it?"], ["rest", "caching", "read"], ["rest", "connection-pools", "miss"],
      ["connection-pools", "data", "SQL"], ["rest", "queues-workers", "enqueue"], ["queues-workers", "data", "writes"],
      ["queues-workers", "webhooks", "notify"]
    ],
    cap: "**One request, left to right: in through the load balancer, checked, handled, then read from storage or pushed to a queue.** The handler tries the cache first and the database on a miss; anything slow goes on a queue so the response does not wait for it. Click a box to open its topic; Client opens the frontend field and Database the data field."
  },
  start: [
    { label: "The Twelve-Factor App: all twelve factors", url: "https://12factor.net/", m: 30, why: "Twelve short rules for a service that deploys and scales cleanly; still the shared vocabulary of backend work." },
    { label: "AWS Builders' Library: timeouts, retries and backoff with jitter", url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/", m: 20, why: "How Amazon sets timeouts and retries so they fix blips without making an outage worse." },
    { label: "Brandur Leach: implementing Stripe-like idempotency keys in Postgres", url: "https://brandur.org/idempotency-keys", m: 25, why: "A worked design for making a request safe to retry, using only Postgres transactions." },
    { label: "DDIA, 2e: ch. 8 Transactions", url: "https://dataintensive.net/", m: 90, why: "What the database does and does not promise your code when requests run at the same time." }
  ],
  clusters: [
    { name: "The request's path", line: "How a request reaches your code, and the shapes an API can take.", topics: [
      { id: "load-balancing", name: "Load balancers and proxies",
        line: "One address in front of many servers, spreading requests and dropping the sick ones.",
        body: [
          "A load balancer accepts connections at one address and forwards each request to a healthy server behind it. Layer 4 balancers forward TCP connections without reading them; layer 7 balancers (reverse proxies) parse HTTP, so they can terminate TLS, route by path or header, add request ids, and retry an idempotent request on another server. Health checks take a server out of rotation when it stops answering, which is also what lets you deploy one instance at a time.",
          "The algorithm matters more than it looks. Round robin assumes every request costs the same; least connections or least outstanding requests adapt when one server is slow, which is the usual case once some requests call an LLM and others read a cache."
        ],
        where: "AWS Application Load Balancer and Google Cloud Load Balancing sit in front of most cloud services; Nginx, HAProxy and Envoy are the self-run proxies; Cloudflare and Fastly balance at the edge; Envoy is also the sidecar inside Istio service meshes.",
        nuance: "Sticky sessions feel convenient and make every server stateful: a deploy or a crash logs users out. Keep session state in a shared store and let any server take any request.",
        read: [{ label: "Sam Rose: load balancing, an interactive essay on the algorithms", url: "https://samwho.dev/load-balancing/", m: 15 }],
        tags: ["nginx", "envoy", "haproxy", "alb", "reverse proxy", "l4", "l7"] },
      { id: "rest", name: "REST and HTTP APIs",
        line: "Resources at URLs, acted on with HTTP methods, with status codes and caching built in.",
        body: [
          "REST, from Roy Fielding's 2000 dissertation, is a set of constraints: a client and server that share no session state, resources named by URLs, a uniform interface of methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), and responses that say whether they may be cached. In practice a REST API is JSON over HTTP with nouns in the path (`/orders/42`) and status codes that mean something: 201 created, 404 missing, 409 conflict, 429 slow down.",
          "The method semantics are the useful part. `GET` is safe, and `PUT` and `DELETE` are idempotent, so proxies and clients may retry them; `POST` is neither, which is why payment APIs add idempotency keys. Versioning (`/v1/`, or a dated header as Stripe does), cursor pagination rather than offsets, and an OpenAPI description are the conventions that make an API pleasant to use."
        ],
        where: "Stripe's API is the usual model of a well-designed REST API; GitHub, Twilio, and the OpenAI and Anthropic APIs are REST over HTTPS with JSON bodies and streamed responses.",
        nuance: "Most APIs called REST are HTTP plus JSON, and that is fine. What matters is correct status codes, safe retries and stable versioning, not hypermedia links.",
        read: [{ label: "Roy Fielding: dissertation chapter 5, the REST constraints derived one by one", url: "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm", m: 40 }],
        tags: ["http", "json", "openapi", "status codes", "versioning"] },
      { id: "grpc-graphql", name: "gRPC and GraphQL",
        line: "Two answers to REST's limits: typed binary calls between services, and client-shaped queries.",
        body: [
          "**gRPC** describes a service in a `.proto` file; code generators produce a typed client and server in each language, and calls travel as Protocol Buffers over HTTP/2, with streaming in either direction. Messages are smaller and faster to parse than JSON, and a broken contract fails at compile time. It suits calls between your own services; browsers cannot speak it directly without a proxy.",
          "**GraphQL** puts one endpoint in front of a typed schema, and the client asks for exactly the fields it needs, across related objects, in one round trip. It suits a product with many screens and clients that want different shapes of the same data. The server cost is in resolvers: a naive implementation fetches each related object separately, so a batching layer such as DataLoader is standard."
        ],
        where: "gRPC carries calls between microservices at Netflix and Square, and Kubernetes uses it to talk to container runtimes; GitHub and Shopify publish public GraphQL APIs, and Facebook built GraphQL for its mobile apps in 2012.",
        nuance: "GraphQL hands query cost to the client, so a public GraphQL API needs depth and cost limits; HTTP caching also gets harder because every query is a `POST` to one URL.",
        read: [
          { label: "gRPC docs: introduction to gRPC and protocol buffers", url: "https://grpc.io/docs/what-is-grpc/introduction/", m: 10 },
          { label: "GraphQL docs: introduction to GraphQL", url: "https://graphql.org/learn/introduction/", m: 10 }
        ],
        tags: ["protobuf", "http/2", "schema", "resolvers", "dataloader"] },
      { id: "webhooks", name: "Webhooks",
        line: "An HTTP call from someone else's system to yours when something happens there.",
        body: [
          "A webhook is a reverse API call: you register a URL, and the provider sends a `POST` with an event payload when something happens, such as a payment succeeding or a call ending. It replaces polling. The receiver has three jobs: verify the request came from the provider (an HMAC signature over the raw body with a shared secret, plus a timestamp to stop replays), return a 2xx quickly, and do the real work later from a queue.",
          "Delivery is at least once and unordered. Stripe, for example, retries failed deliveries with backoff for up to three days and does not promise order, so handlers store the event ids they have processed and treat a repeat as a no-op."
        ],
        where: "Stripe payment events, GitHub push and pull request events, Twilio call status callbacks, Slack events, and the completion callbacks of asynchronous model and transcription APIs.",
        nuance: "A handler that does the work inline and then times out gets the event again and does the work twice. Acknowledge, enqueue, then process idempotently.",
        read: [{ label: "Stripe docs: receive webhook events, the delivery behaviour and best practices sections", url: "https://docs.stripe.com/webhooks", m: 15 }],
        see: [{ label: "System design guide: idempotency keys", href: "SYSTEM%20DESIGN.html#/patterns/multi-step/idempotency" }],
        tags: ["hmac", "signature", "callbacks", "at least once"] },
      { id: "realtime", name: "Real-time: WebSockets and SSE",
        line: "Pushing updates to the client as they happen, instead of waiting to be asked.",
        body: [
          "Plain HTTP is request and response, so to push, the server must hold a connection open. **Server-sent events** (SSE) keep one HTTP response open and stream text events down it; the browser's `EventSource` reconnects on its own and resumes from the last event id. **WebSockets** upgrade an HTTP connection into a two-way channel for messages in both directions, which suits chat, collaboration and games.",
          "Both change the server's shape. Each client holds a connection for minutes or hours, so one server holds thousands at once, a deploy must drain them, and a message for a user has to reach whichever server holds that user's connection, usually through Redis pub/sub or a broker. Polling every few seconds is still the right answer when updates are rare."
        ],
        where: "Token streaming in the OpenAI and Anthropic APIs is SSE; Slack, Discord and Figma use WebSockets; Pusher, Ably, Supabase Realtime and Cloudflare Durable Objects hold the connections for you; WebRTC takes over for live audio and video.",
        nuance: "SSE over HTTP/1.1 hits the browser's limit of six connections per domain, shared across tabs; HTTP/2 removes it. Proxies with idle timeouts also cut quiet connections unless you send heartbeats.",
        read: [{ label: "MDN: using server-sent events, the event stream format", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events", m: 10 }],
        see: [
          { label: "System design guide: server-sent events", href: "SYSTEM%20DESIGN.html#/patterns/real-time/sse" },
          { label: "System design guide: WebSockets", href: "SYSTEM%20DESIGN.html#/patterns/real-time/websockets" }
        ],
        tags: ["sse", "websocket", "eventsource", "pubsub", "streaming"] }
    ] },
    { name: "Identity and access", line: "Who is calling, and what they are allowed to do.", topics: [
      { id: "sessions-tokens", name: "Sessions and tokens",
        line: "How a server remembers who you are between requests: a session id, or a signed token.",
        body: [
          "HTTP is stateless, so after login the server hands the client something to send back. A **session** is a random id in a cookie that points at a row in Redis or the database; the server looks it up on each request and can delete it to log you out. Set the cookie `HttpOnly`, `Secure` and `SameSite` so scripts cannot read it and other sites cannot send it.",
          "A **JWT** is a token that carries its own claims (user id, roles, expiry), signed so any server can verify it without a lookup. That saves a database read and suits calls between services, but a signed token cannot be revoked before it expires. The usual compromise is a short-lived access token (minutes) with a longer-lived refresh token that the server can revoke."
        ],
        where: "Rails, Django and Laravel default to cookie sessions; Auth0, Clerk, Supabase Auth and Firebase Auth issue JWTs; AWS API Gateway and most service meshes verify JWTs before the request reaches your code.",
        nuance: "A JWT is signed, not encrypted: anyone holding it can read the payload. And a token kept in `localStorage` is exposed to any XSS bug, which an `HttpOnly` cookie is not.",
        read: [
          { label: "OWASP: session management cheat sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html", m: 20 },
          { label: "jwt.io: introduction to JSON Web Tokens", url: "https://jwt.io/introduction", m: 8 }
        ],
        tags: ["jwt", "cookies", "authentication", "refresh token"] },
      { id: "oauth", name: "OAuth 2.0 and OpenID Connect",
        line: "Delegated access: an app gets a scoped token without ever seeing your password.",
        body: [
          "OAuth 2.0 lets a user grant an app limited access to an account held elsewhere. The app sends the user to the authorization server, the user logs in and approves the requested scopes, and the app receives a short code that it exchanges, server to server, for an access token. PKCE binds that exchange to the app that started it, and is now expected for every client, not only mobile ones.",
          "OAuth says what an app may do; **OpenID Connect** adds an ID token (a JWT) that says who the user is, which is what 'Sign in with Google' uses. For calls between machines, the client credentials grant leaves the user out entirely. OAuth 2.1, still a draft, folds these practices into one document and drops the implicit and password grants."
        ],
        where: "Sign in with Google, Apple and GitHub; Slack and Google Workspace app installs; remote Model Context Protocol servers authorise clients with OAuth 2.1; Okta, Auth0 and Keycloak run authorization servers for companies.",
        nuance: "OAuth is authorization, not authentication. Treating a bare access token as proof of who the user is was the classic bug that OpenID Connect exists to fix.",
        read: [{ label: "oauth.net: OAuth 2.0 overview, grant types and OAuth 2.1", url: "https://oauth.net/2/", m: 10 }],
        tags: ["oidc", "pkce", "sso", "scopes", "authorization code"] },
      { id: "authorization", name: "Authorization: RBAC and beyond",
        line: "Deciding what an authenticated caller may do, from roles to relationships.",
        body: [
          "Authentication says who you are; authorization decides what you may do. **RBAC** gives users roles (admin, editor, viewer) and roles permissions; it is simple and covers most internal tools. **ABAC** decides from attributes of the user, the resource and the request, such as department or owner. **ReBAC** decides from relationships in a graph: you may edit this document because you are in a team that owns its folder.",
          "Where the check lives matters as much as the model. A check only in the UI is no check; checks scattered across handlers drift; a central policy (a library, a policy engine, or row-level security in Postgres) keeps one source of truth. Google's Zanzibar, which runs ReBAC for Drive, YouTube and other products, answers checks in under 10 ms at p95 across trillions of access control lists."
        ],
        where: "Postgres row-level security in Supabase; OpenFGA, SpiceDB and Permify as open Zanzibar-style services; AWS IAM and its Cedar policy language; Open Policy Agent for Kubernetes admission.",
        nuance: "The common breach is not a weak model but a missing check: an endpoint that loads `/invoices/:id` without asking whether that invoice belongs to the caller. It tops the OWASP API Security Top 10 as broken object level authorization.",
        read: [{ label: "Google: Zanzibar, Google's consistent, global authorization system (paper)", url: "https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/", m: 30 }],
        tags: ["rbac", "abac", "rebac", "rls", "permissions", "bola"] }
    ] },
    { name: "State", line: "Talking to the database, changing its shape, and keeping copies of what it returns.", topics: [
      { id: "orms", name: "ORMs and the N+1 problem",
        line: "Mapping rows to objects, and the queries that mapping hides from you.",
        body: [
          "An ORM maps tables to classes so code reads `user.orders` instead of SQL. It binds parameters (which prevents SQL injection), tracks relations and generates migrations, and it saves a lot of typing on ordinary create, read, update and delete. A query builder sits one step closer to SQL: typed and composable, with no hidden loading.",
          "The classic cost is the **N+1 query**: load 50 orders, touch each order's customer, and the ORM fires 1 + 50 queries, fast on a laptop and slow under real data. The fixes are eager loading (a `JOIN`, or a second query with `IN`) and reading the SQL your ORM emits. Complex reports are usually clearer as plain SQL."
        ],
        where: "ActiveRecord in Rails, the Django ORM, SQLAlchemy in Python, Hibernate in Java, Prisma and Drizzle in TypeScript; Drizzle and Kysely sit at the query-builder end.",
        nuance: "The ORM does not remove the need to know SQL and indexes; it hides the moment you needed them. Turn on query logging in development and count the queries per request.",
        see: [{ label: "System design guide: indexing and query tuning", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/indexing" }],
        tags: ["sql", "activerecord", "sqlalchemy", "prisma", "n+1", "eager loading"] },
      { id: "connection-pools", name: "Connection pools",
        line: "A small set of open database connections, shared by many requests.",
        body: [
          "Opening a Postgres connection costs a TCP and TLS handshake, authentication and a new server process, several milliseconds each time. So a service keeps a pool of open connections and lends one to each query or transaction. Postgres handles hundreds of active connections poorly, so the pool is deliberately small.",
          "HikariCP's guidance puts the starting size near twice the database's CPU cores: a small pool with requests queueing for it beats a large one where the database thrashes. When many app instances or serverless functions each open their own pool, an external pooler such as PgBouncer sits in front and multiplexes them; in transaction mode a server connection is held only for the length of one transaction."
        ],
        where: "HikariCP in Java services, SQLAlchemy's pool in Python, PgBouncer and Supavisor in front of Postgres, and Amazon RDS Proxy for Lambda functions.",
        nuance: "Transaction pooling breaks anything that relies on session state: session-level `SET`, advisory locks held across transactions, `LISTEN`, and in older PgBouncer versions prepared statements. Lambda without a proxy runs out of connections at the first spike.",
        read: [
          { label: "HikariCP wiki: about pool sizing", url: "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing", m: 10 },
          { label: "PgBouncer: features, the three pooling modes", url: "https://www.pgbouncer.org/features.html", m: 5 }
        ],
        tags: ["pgbouncer", "hikaricp", "postgres", "rds proxy", "supavisor"] },
      { id: "migrations", name: "Schema migrations",
        line: "Versioned changes to the database schema, applied while the old code still runs.",
        body: [
          "A migration is a numbered script that moves the schema from one version to the next, checked into the repo and applied in order by a tool that records which ones ran. The hard part is that during a deploy, old and new code run against the same database, so each change must work with both.",
          "The safe pattern is **expand and contract**: add the new column or table, write to both, backfill in batches, move reads over, then drop the old one in a later deploy. Stripe's write-up on online migrations describes the same four steps at scale. In Postgres, watch the locks: building an index without `CONCURRENTLY`, or adding a column with a volatile default, can block writes on a large table for minutes."
        ],
        where: "Rails and Django migrations, Alembic for SQLAlchemy, Flyway and Liquibase in Java, Prisma Migrate, and Supabase's migration files; GitHub built gh-ost for online schema changes on MySQL.",
        nuance: "Down migrations are rarely trusted in practice; teams roll forward with a new migration. What keeps you safe is making every step backward compatible, so the previous release still runs.",
        read: [{ label: "Stripe: online migrations at scale, the four-step dual-write pattern", url: "https://stripe.com/blog/online-migrations", m: 15 }],
        tags: ["alembic", "flyway", "expand and contract", "backfill", "ddl"] },
      { id: "caching", name: "Caching and invalidation",
        line: "Keeping a copy of an answer close by, and knowing when it went stale.",
        body: [
          "A cache trades freshness for speed: a Redis read on the same network takes well under a millisecond, where the query behind it may take tens. The common pattern is **cache-aside**: read the cache, and on a miss read the database and write the result back with a TTL. Write-through updates the cache on every write; a CDN caches whole HTTP responses at the edge.",
          "Invalidation is the hard half. The options are a short TTL (accept some staleness), deleting the key on write (a race can put the old value back), or versioned keys. Two failures recur: a **stampede**, when a hot key expires and a thousand requests hit the database at once, fixed by letting one request refill while the others wait; and a cold cache after a restart, serving load the database was never sized for."
        ],
        where: "Redis, and Valkey, the Linux Foundation fork started after Redis changed its licence in 2024; Memcached fleets in front of Meta's social graph; Cloudflare and Fastly caching responses at the edge.",
        nuance: "A cache the system cannot run without is no longer a cache; it is a database with no durability. Know what load the database sees if the cache is empty.",
        read: [{ label: "AWS Builders' Library: caching challenges and strategies", url: "https://aws.amazon.com/builders-library/caching-challenges-and-strategies/", m: 20 }],
        see: [
          { label: "System design guide: cache-aside", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/cache-aside" },
          { label: "System design guide: cache invalidation", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/invalidation" }
        ],
        tags: ["redis", "valkey", "memcached", "ttl", "cdn", "thundering herd"] }
    ] },
    { name: "Work off the path, and failure", line: "Pushing slow work aside, and keeping one failure from becoming many.", topics: [
      { id: "queues-workers", name: "Queues and background jobs",
        line: "Slow or retryable work leaves the request, goes on a queue, and workers pick it up.",
        body: [
          "Anything slow, flaky or bursty (sending email, transcoding, calling a model, delivering webhooks) should not run inside the request. The handler writes a job to a queue and returns, often with `202 Accepted` and a job id; worker processes pull jobs, run them and acknowledge them. If a worker dies mid-job, the job becomes visible again after a timeout and another worker takes it.",
          "The queue can be a broker (SQS, RabbitMQ), a log (Kafka, where each consumer tracks its offset), or a table in Postgres. With `SELECT ... FOR UPDATE SKIP LOCKED`, many workers claim different rows without blocking each other, and a job can commit in the same transaction as the data it changes. For many products that is enough, and it saves running a second system."
        ],
        where: "Sidekiq for Rails, Celery and RQ in Python, BullMQ on Redis for Node, Oban and good_job on Postgres, SQS with Lambda consumers; Temporal and Inngest add durable multi-step workflows on top.",
        nuance: "Every mainstream queue delivers at least once. A job will sometimes run twice, so the work must be idempotent, and a job that always fails needs a dead-letter queue, not endless retries.",
        read: [{ label: "Postgres docs: the locking clause of SELECT, including SKIP LOCKED", url: "https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE", m: 10 }],
        see: [
          { label: "System design guide: queue plus worker pool", href: "SYSTEM%20DESIGN.html#/patterns/long-running/worker-pool" },
          { label: "System design guide: queue claiming with SKIP LOCKED", href: "SYSTEM%20DESIGN.html#/patterns/contention/claim-skip-locked" }
        ],
        tags: ["sqs", "kafka", "rabbitmq", "celery", "sidekiq", "skip locked", "dead-letter"] },
      { id: "idempotency", name: "Idempotency",
        line: "Making an operation safe to repeat, so a retry cannot charge a card twice.",
        body: [
          "An operation is idempotent if doing it twice leaves the same result as doing it once. Networks make this matter: a client that times out cannot tell whether the server never got the request or did the work and lost the reply, so it retries. `PUT` and `DELETE` are idempotent by definition; a `POST` that creates a charge is not.",
          "The standard fix is an **idempotency key**: the client generates a unique key per logical operation and sends it with every attempt. The server records the key and the result in the same transaction as the work; a repeat with the same key returns the stored result instead of acting again. Consumers of queues and webhooks do the same with message or event ids."
        ],
        where: "Stripe's `Idempotency-Key` header is the reference design; Adyen, PayPal and Square have equivalents, and the IETF has a draft standard for the header.",
        nuance: "Recording the key after the work, in a separate step, leaves a window where a crash loses it. The key, the lock and the effect belong in one transaction, and an external call made inside needs its own key.",
        read: [{ label: "Brandur Leach: implementing Stripe-like idempotency keys in Postgres", url: "https://brandur.org/idempotency-keys", m: 25 }],
        see: [{ label: "System design guide: idempotency keys", href: "SYSTEM%20DESIGN.html#/patterns/multi-step/idempotency" }],
        tags: ["idempotency key", "retries", "exactly once", "dedupe"] },
      { id: "timeouts-retries", name: "Timeouts, retries and backoff",
        line: "Bounding how long you wait, and retrying without turning a blip into an outage.",
        body: [
          "Every network call needs a timeout, or one slow dependency holds threads and connections until the whole service stalls. A good timeout sits a little above the dependency's p99 latency, and the deadline should travel down the call chain, so inner calls stop when the outer caller has already given up.",
          "Retries fix transient failures and amplify real ones: if each of three layers makes three attempts, one failing call becomes 27 at the bottom. The safeguards are exponential backoff with **jitter** (random spread, so clients do not retry in lockstep), a retry budget that caps retries as a share of traffic, retrying only idempotent calls, and a **circuit breaker** that stops calling a dependency that is clearly down."
        ],
        where: "AWS SDKs ship backoff with jitter and a retry quota by default; gRPC propagates deadlines across services; Envoy and Istio apply retry and circuit-breaker policy at the proxy; LLM clients retry rate-limit and overload errors with backoff.",
        nuance: "Many of the worst outages are retry storms: a dependency slows, clients time out and retry, and the extra load keeps it down. Fewer, slower retries recover faster.",
        read: [{ label: "AWS Builders' Library: timeouts, retries and backoff with jitter", url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/", m: 20 }],
        see: [
          { label: "System design guide: timeouts, retries, backoff, jitter", href: "SYSTEM%20DESIGN.html#/patterns/reliability/timeouts-retries" },
          { label: "System design guide: circuit breaker", href: "SYSTEM%20DESIGN.html#/patterns/reliability/circuit-breaker" }
        ],
        tags: ["jitter", "circuit breaker", "deadline", "retry storm", "backoff"] },
      { id: "rate-limiting", name: "Rate limiting",
        line: "Capping how fast each caller may send requests, to protect the service and share it fairly.",
        body: [
          "A rate limiter counts requests per key (API key, user, IP address or tenant) and rejects the excess with `429 Too Many Requests`, ideally with a `Retry-After` header. The **token bucket** is the usual algorithm: a bucket refills at a steady rate and each request takes a token, which allows short bursts while holding the average. Fixed windows are simpler but let through up to double the limit around a window boundary; sliding windows fix that.",
          "Across many servers the counters live in a shared store, typically Redis updated by an atomic script. Stripe describes four layers: a per-user request rate limiter, a limiter on concurrent requests, and two load shedders that drop lower-priority traffic when the fleet is saturated."
        ],
        where: "Stripe, GitHub and OpenAI publish per-key limits and return 429s; Cloudflare and AWS API Gateway rate-limit at the edge; LLM providers limit both requests and tokens per minute.",
        nuance: "A limit by IP punishes everyone behind one office NAT and misses an attacker with many addresses. Pick the key that matches what you are protecting, and limit concurrency as well as rate for slow endpoints.",
        read: [{ label: "Stripe: scaling your API with rate limiters", url: "https://stripe.com/blog/rate-limiters", m: 15 }],
        see: [{ label: "System design guide: rate limiting", href: "SYSTEM%20DESIGN.html#/patterns/reliability/rate-limiting" }],
        tags: ["token bucket", "429", "sliding window", "load shedding", "throttling"] }
    ] },
    { name: "Shape and operations", line: "How the service is deployed, divided, watched and tested.", topics: [
      { id: "serverless-edge", name: "Serverless and edge functions",
        line: "Code that runs per request on rented capacity, against a server you keep running.",
        body: [
          "A serverless function (AWS Lambda, Google Cloud Run functions) runs your handler on demand, bills per invocation and duration, and scales to zero when idle. The first request to a new instance pays a **cold start**: download the code, start the runtime and run your initialisation, from under 100 ms to over a second. A standard Lambda invocation is capped at 15 minutes, and each warm instance serves one request at a time.",
          "Edge functions (Cloudflare Workers, Deno Deploy) run in V8 isolates in hundreds of locations near users; an isolate starts in milliseconds, but the runtime is restricted and your database usually still sits in one region. A long-running service (a container on ECS, Kubernetes or Fly.io) keeps memory, connections and background threads between requests, and costs money while idle."
        ],
        where: "Lambda behind API Gateway for glue code and webhooks; Cloudflare Workers for auth, redirects and caching at the edge; Vercel and Netlify functions behind Next.js sites; Cloud Run and Fly.io as containers that scale to zero.",
        nuance: "Serverless suits short, spiky, stateless work. It fits badly with long LLM streams, WebSockets, in-memory caches and database connection pools, which is why voice and agent backends usually run as long-lived services.",
        read: [
          { label: "AWS docs: the Lambda execution environment lifecycle and cold starts", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html", m: 15 },
          { label: "Cloudflare docs: how Workers works, isolates against containers", url: "https://developers.cloudflare.com/workers/reference/how-workers-works/", m: 8 }
        ],
        tags: ["lambda", "cloudflare workers", "cold start", "isolates", "faas"] },
      { id: "monolith-microservices", name: "Monolith or microservices",
        line: "One deployable or many: a choice about teams and boundaries more than technology.",
        body: [
          "A **monolith** is one codebase deployed as one unit; calls between its parts are function calls, and one database transaction can cover everything. **Microservices** split the system into services that own their data and deploy on their own, talking over the network. The gain is independent deployment and scaling for many teams; the cost is calls that can fail, data spread across stores with no shared transaction, and far more to operate.",
          "The middle path is the **modular monolith**: one deployable with enforced boundaries inside it. Shopify runs one of the largest Rails monoliths this way, divided into components with public interfaces and tooling that flags calls across the lines. Most successful microservice systems began as a monolith that grew too large."
        ],
        where: "Shopify, GitHub and Basecamp run large monoliths; Amazon, Netflix and Uber run hundreds or thousands of services; in 2023 Prime Video moved one monitoring pipeline from serverless microservices back into a single service and cut its cost by 90%.",
        nuance: "Splitting by technical layer (an auth service, a database service) gives you the costs of both. Split, if at all, along business boundaries that change independently, and when team size has made the monolith the bottleneck.",
        read: [
          { label: "Martin Fowler: Monolith First", url: "https://martinfowler.com/bliki/MonolithFirst.html", m: 5 },
          { label: "Shopify Engineering: deconstructing the monolith", url: "https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity", m: 15 }
        ],
        tags: ["modular monolith", "service boundaries", "architecture"] },
      { id: "observability", name: "Observability: logs, metrics, traces",
        line: "The signals that let you answer questions about a running service you did not foresee.",
        body: [
          "**Logs** are timestamped events; structured as JSON with a request id, they become searchable. **Metrics** are numbers over time (request rate, error rate, latency percentiles, queue depth), cheap to store and the basis of alerts. **Traces** follow one request across services as a tree of spans, each with a start, a duration and attributes, which is how you find which of twelve calls made a request slow.",
          "Google's SRE book names four golden signals for any service: latency, traffic, errors and saturation. Alerts belong on symptoms users feel, tied to service level objectives (99.9% of requests under 300 ms, say), not on every CPU spike. OpenTelemetry is now the standard way to emit all three signals, so the backend that stores them can change without touching code."
        ],
        where: "Datadog, Grafana with Prometheus, Loki and Tempo, Honeycomb, New Relic and Sentry; LLM apps add Langfuse, LangSmith or Braintrust on top of the same spans.",
        nuance: "Averages hide the pain: a mean of 80 ms can sit on a p99 of four seconds. Track percentiles, and watch label cardinality, which is where metrics bills explode.",
        read: [
          { label: "OpenTelemetry: observability primer", url: "https://opentelemetry.io/docs/concepts/observability-primer/", m: 15 },
          { label: "Google SRE book: ch. 6 Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/", m: 25 }
        ],
        see: [{ label: "System design guide: monitoring and completeness checks", href: "SYSTEM%20DESIGN.html#/patterns/reliability/monitoring" }],
        tags: ["opentelemetry", "tracing", "prometheus", "slo", "golden signals", "p99"] },
      { id: "testing-services", name: "Testing a service",
        line: "Unit, integration and contract tests, and what each catches that the others miss.",
        body: [
          "**Unit tests** check one function with its collaborators faked; they are fast and catch logic errors. **Integration tests** run the service against real dependencies, usually a real Postgres in a container, and catch the bugs that live in SQL, migrations and serialisation. **Contract tests** check that a provider still honours what its consumers expect, so two teams can deploy separately. End-to-end tests drive the whole system; they are slow and flaky, so keep them few.",
          "For backends the balance has moved toward integration tests: Testcontainers makes a throwaway database cheap, and a mocked database mostly tests the mock. Third-party APIs (payments, model providers) are faked at the HTTP boundary with recorded or hand-written responses."
        ],
        where: "pytest, JUnit, Go's testing package and Vitest; Testcontainers for real databases in CI; Pact for consumer-driven contracts; WireMock and VCR-style recorders for third-party APIs.",
        nuance: "A suite nobody trusts gets ignored. Flaky tests usually point at shared state, time or ordering; fix or delete them rather than retrying them in CI.",
        read: [{ label: "Ham Vocke: the practical test pyramid", url: "https://martinfowler.com/articles/practical-test-pyramid.html", m: 40 }],
        tags: ["pytest", "testcontainers", "pact", "contract tests", "integration tests"] }
    ] }
  ],
  see: [{ label: "System design guide", href: "SYSTEM%20DESIGN.html" }]
});
