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
          "A load balancer accepts connections at one address and forwards each request to a healthy server behind it. Layer 4 balancers forward TCP connections without reading them; layer 7 balancers (reverse proxies) parse HTTP, so they can terminate TLS, route by path or header and retry an idempotent request elsewhere. Health checks take a server out of rotation when it stops answering, which is also what lets you deploy one instance at a time.",
          "The algorithm matters. Round robin assumes every request costs the same; least outstanding requests adapts when one server is slow, the usual case once some requests call an LLM and others read a cache."
        ],
        uses: [
          "**AWS Application Load Balancer**: terminates TLS and routes by host or path to groups of instances or containers, checking each target's health.",
          "**Nginx and HAProxy**: the self-run reverse proxies in front of many web fleets, handling TLS, routing and connection limits.",
          "**Envoy in Istio**: runs as a sidecar beside every service, balancing and retrying the calls between services inside the mesh.",
          "**Cloudflare Load Balancing**: spreads traffic at the edge across origin servers in several regions and steers it away from an unhealthy one."
        ],
        example: "Three servers behind round robin. One request in ten calls an LLM and takes 8 s; the rest take 20 ms. By chance server B collects four slow requests and its queue grows while A and C sit idle. With least outstanding requests, the balancer sees four in flight on B and sends the next requests to A and C instead.",
        nuance: "Sticky sessions feel convenient and make every server stateful: a deploy or a crash logs users out. Keep session state in a shared store and let any server take any request.",
        read: [{ label: "Sam Rose: load balancing, an interactive essay on the algorithms", url: "https://samwho.dev/load-balancing/", m: 15 }],
        tags: ["nginx", "envoy", "haproxy", "alb", "reverse proxy", "l4", "l7"] },
      { id: "rest", name: "REST and HTTP APIs",
        line: "Resources at URLs, acted on with HTTP methods, with status codes and caching built in.",
        body: [
          "REST, from Roy Fielding's 2000 dissertation, is a set of constraints: a client and server that share no session state, resources named by URLs, a uniform set of methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), and responses that say whether they may be cached. In practice a REST API is JSON over HTTP with nouns in the path (`/orders/42`) and status codes that mean something.",
          "The method semantics are the useful part. `GET` is safe, and `PUT` and `DELETE` are idempotent, so proxies and clients may retry them; `POST` is neither, which is why payment APIs add idempotency keys. Versioning, cursor pagination and an OpenAPI description make an API pleasant to use."
        ],
        uses: [
          "**Stripe API**: the usual model of a well-designed REST API, with dated versions in a header, idempotency keys on `POST` and consistent error objects.",
          "**GitHub REST API**: repositories, issues and pull requests at predictable URLs, with pagination through `Link` headers.",
          "**OpenAI and Anthropic APIs**: one `POST` with a JSON body per model call, answered with JSON or a streamed response."
        ],
        example: "An order's life in status codes. `POST /v1/orders` with a JSON body returns `201 Created` and `Location: /v1/orders/42`. `GET /v1/orders/42` returns `200` and the order. Cancelling an order that already shipped returns `409 Conflict`; sending requests too fast returns `429` with `Retry-After: 2`. Listing uses a cursor, `GET /v1/orders?after=42&limit=20`, so new rows do not shift the pages.",
        nuance: "Most APIs called REST are HTTP plus JSON, and that is fine. What matters is correct status codes, safe retries and stable versioning, not hypermedia links.",
        read: [{ label: "Roy Fielding: dissertation chapter 5, the REST constraints derived one by one", url: "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm", m: 40 }],
        tags: ["http", "json", "openapi", "status codes", "versioning"] },
      { id: "grpc-graphql", name: "gRPC and GraphQL",
        line: "Two answers to REST's limits: typed binary calls between services, and client-shaped queries.",
        body: [
          "**gRPC** describes a service in a `.proto` file; generators produce a typed client and server in each language, and calls travel as Protocol Buffers over HTTP/2, with streaming in either direction. Messages are smaller and faster to parse than JSON, and a broken contract fails at compile time. Browsers cannot call it directly without a proxy, so it suits calls between your own services.",
          "**GraphQL** puts one endpoint in front of a typed schema, and the client asks for exactly the fields it needs, across related objects, in one round trip. The server cost is in resolvers: a naive one fetches each related object separately, so a batching layer such as DataLoader is standard."
        ],
        uses: [
          "**Kubernetes**: the kubelet talks to container runtimes such as containerd through the Container Runtime Interface, a gRPC API.",
          "**Netflix and Square**: gRPC carries calls between internal services, with generated clients in each language.",
          "**GitHub and Shopify**: publish public GraphQL APIs, so an integration fetches a repository with its issues, or a product with its variants, in one query.",
          "**Facebook**: built GraphQL in 2012 for its mobile apps, which needed different slices of the same feed data."
        ],
        example: "A mobile screen shows a user's name and their last three order totals. With REST it calls `GET /users/7`, then `GET /users/7/orders?limit=3`: two round trips and many unused fields. With GraphQL, one query: `{ user(id: 7) { name orders(last: 3) { total } } }`. On a list of 20 users, naive resolvers would run 20 order queries; DataLoader batches them into one.",
        nuance: "GraphQL hands query cost to the client, so a public GraphQL API needs depth and cost limits; HTTP caching also gets harder because every query is a `POST` to one URL.",
        read: [
          { label: "gRPC docs: introduction to gRPC and protocol buffers", url: "https://grpc.io/docs/what-is-grpc/introduction/", m: 10 },
          { label: "GraphQL docs: introduction to GraphQL", url: "https://graphql.org/learn/introduction/", m: 10 }
        ],
        tags: ["protobuf", "http/2", "schema", "resolvers", "dataloader"] },
      { id: "webhooks", name: "Webhooks",
        line: "An HTTP call from someone else's system to yours when something happens there.",
        body: [
          "A webhook is a reverse API call: you register a URL, and the provider sends a `POST` with an event payload when something happens, such as a payment succeeding. It replaces polling. The receiver verifies the request came from the provider (an HMAC signature over the raw body with a shared secret, plus a timestamp to stop replays), returns a 2xx quickly, and does the real work later from a queue.",
          "Delivery is at least once and unordered. Stripe retries failed deliveries with backoff for up to three days and does not promise order, so handlers store the event ids they have processed and treat a repeat as a no-op."
        ],
        uses: [
          "**Stripe**: sends events such as `payment_intent.succeeded`, signed in the `Stripe-Signature` header, and retries failed deliveries for up to three days.",
          "**GitHub**: posts push and pull request events to CI services and bots, signed with HMAC-SHA256 in `X-Hub-Signature-256`.",
          "**Twilio**: calls your status callback URL as a phone call moves through ringing, in progress and completed."
        ],
        example: "Stripe posts `evt_123`, a payment succeeded. Your handler checks the signature, inserts `evt_123` into a `processed_events` table with a unique constraint, enqueues a job and returns 200 in 40 ms. A network blip means Stripe never saw the 200, so it sends `evt_123` again an hour later. The insert fails on the unique key, the handler returns 200, and the order ships once.",
        nuance: "A handler that does the work inline and then times out gets the event again and does the work twice. Acknowledge, enqueue, then process idempotently.",
        read: [{ label: "Stripe docs: receive webhook events, the delivery behaviour and best practices sections", url: "https://docs.stripe.com/webhooks", m: 15 }],
        see: [{ label: "System design guide: idempotency keys", href: "SYSTEM%20DESIGN.html#/patterns/multi-step/idempotency" }],
        tags: ["hmac", "signature", "callbacks", "at least once"] },
      { id: "realtime", name: "Real-time: WebSockets and SSE",
        line: "Pushing updates to the client as they happen, instead of waiting to be asked.",
        body: [
          "Plain HTTP is request and response, so to push, the server must hold a connection open. **Server-sent events** (SSE) keep one HTTP response open and stream text events down it; the browser's `EventSource` reconnects on its own and resumes from the last event id. **WebSockets** upgrade an HTTP connection into a two-way message channel, which suits chat, collaboration and games.",
          "Both change the server's shape: each server holds thousands of long connections, a deploy must drain them, and a message for a user must reach whichever server holds that user's connection, usually through Redis pub/sub. Polling is still right when updates are rare."
        ],
        uses: [
          "**OpenAI and Anthropic APIs**: stream model output as SSE, one event per chunk of tokens, so a chat interface shows text as it is generated.",
          "**Discord and Slack**: clients hold a WebSocket to receive messages, typing indicators and presence as they happen.",
          "**Figma**: multiplayer editing sends each change over a WebSocket to a server that relays it to everyone in the file.",
          "**Pusher, Ably and Supabase Realtime**: hosted services that hold the connections and fan messages out, so your backend publishes with one call."
        ],
        example: "A chat reply over SSE. The client sends `POST /chat`; the server answers with `Content-Type: text/event-stream` and writes `data: {\"delta\":\"Hel\"}`, then `data: {\"delta\":\"lo\"}`, each followed by a blank line, as tokens arrive. The user sees text after 300 ms instead of waiting 6 s for the whole answer. The browser reads this stream with `fetch`, since `EventSource` can only send `GET`.",
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
          "A **JWT** carries its own claims (user id, roles, expiry), signed so any server can verify it without a lookup. That saves a read and suits calls between services, but a signed token cannot be revoked before it expires. The usual compromise is a short-lived access token with a revocable refresh token."
        ],
        uses: [
          "**Rails, Django and Laravel**: default to cookie sessions, with the session data kept server side or in an encrypted cookie.",
          "**Auth0, Clerk and Supabase Auth**: issue JWT access tokens that your API verifies with a key from the provider, with no call back to it.",
          "**AWS API Gateway**: a JWT authorizer checks the token's signature, issuer and audience before the request reaches your code."
        ],
        example: "A JWT is three base64url parts joined by dots: header, payload, signature. Decode a typical payload and you see `{\"sub\":\"user_42\",\"role\":\"editor\",\"exp\":1767225600}`. Any service with the key checks the signature and `exp`, with no database call. If user 42 is removed at 10:00 and the token expires at 10:15, it keeps working for 15 minutes unless something checks a deny list.",
        nuance: "A JWT is signed, not encrypted: anyone holding it can read the payload. And a token kept in `localStorage` is exposed to any XSS bug, which an `HttpOnly` cookie is not.",
        read: [
          { label: "OWASP: session management cheat sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html", m: 20 },
          { label: "jwt.io: introduction to JSON Web Tokens", url: "https://jwt.io/introduction", m: 8 }
        ],
        tags: ["jwt", "cookies", "authentication", "refresh token"] },
      { id: "oauth", name: "OAuth 2.0 and OpenID Connect",
        line: "Delegated access: an app gets a scoped token without ever seeing your password.",
        body: [
          "OAuth 2.0 lets a user grant an app limited access to an account held elsewhere. The app sends the user to the authorization server, the user logs in and approves the requested scopes, and the app receives a short code that it exchanges, server to server, for an access token. PKCE binds that exchange to the app that started it, and is now expected for every client.",
          "OAuth says what an app may do; **OpenID Connect** adds an ID token (a JWT) that says who the user is. For calls between machines, the client credentials grant leaves the user out. OAuth 2.1, still a draft, folds these practices into one document and drops the implicit and password grants."
        ],
        uses: [
          "**Sign in with Google or Apple**: OpenID Connect returns an ID token saying who the user is, so the app never handles a password.",
          "**Slack app installs**: a workspace admin approves scopes such as `chat:write`, and the app receives a bot token limited to them.",
          "**Remote MCP servers**: the Model Context Protocol authorises clients with OAuth 2.1, so an agent gets a scoped token for one user's tools.",
          "**Okta, Auth0 and Keycloak**: run the authorization server for a company's own apps and single sign-on."
        ],
        example: "Authorization code with PKCE, step by step. The app makes a random `code_verifier` and sends its SHA-256 hash as `code_challenge` while redirecting the user to Google. The user approves read access to their calendar. Google redirects back with `code=abc`. The app posts `code=abc` plus the original verifier; Google hashes it, sees a match, and returns an access token. A thief holding only `abc` gets nothing.",
        nuance: "OAuth is authorization, not authentication. Treating a bare access token as proof of who the user is was the classic bug that OpenID Connect exists to fix.",
        read: [{ label: "oauth.net: OAuth 2.0 overview, grant types and OAuth 2.1", url: "https://oauth.net/2/", m: 10 }],
        tags: ["oidc", "pkce", "sso", "scopes", "authorization code"] },
      { id: "authorization", name: "Authorization: RBAC and beyond",
        line: "Deciding what an authenticated caller may do, from roles to relationships.",
        body: [
          "Authentication says who you are; authorization decides what you may do. **RBAC** gives users roles (admin, editor, viewer) and roles permissions; it covers most internal tools. **ABAC** decides from attributes of the user, the resource and the request. **ReBAC** decides from relationships in a graph: you may edit this document because your team owns its folder.",
          "Where the check lives matters as much as the model. A check only in the UI is no check; checks scattered across handlers drift; a central policy (a library, a policy engine, or Postgres row-level security) keeps one source of truth. Google's Zanzibar answers ReBAC checks for Drive, YouTube and other products in under 10 ms at p95."
        ],
        uses: [
          "**Google Drive**: sharing a folder with a team grants access to every document inside it, decided by Zanzibar's relationship graph.",
          "**Supabase**: Postgres row-level security policies such as `owner_id = auth.uid()` filter every query by the caller.",
          "**AWS IAM**: JSON policies allow or deny actions on resources, with conditions on tags and request attributes, a mix of RBAC and ABAC.",
          "**OpenFGA and SpiceDB**: open-source Zanzibar-style services that answer whether user X may do Y on Z for your app."
        ],
        example: "A missing check, traced. User A calls `GET /invoices/1043`; the handler loads invoice 1043 by id and returns it. User A changes the URL to `/invoices/1044` and reads another company's invoice. The fix is one condition, `WHERE id = $1 AND org_id = $2` with `org_id` taken from the session, or a row-level security policy that adds it to every query.",
        nuance: "Roles multiply: teams add one per exception until there are hundreds, at which point relationships model access better. And the common breach is still a missing check, first in the OWASP API Security Top 10 as broken object level authorization.",
        read: [{ label: "Google: Zanzibar, Google's consistent, global authorization system (paper)", url: "https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/", m: 30 }],
        tags: ["rbac", "abac", "rebac", "rls", "permissions", "bola"] }
    ] },
    { name: "State", line: "Talking to the database, changing its shape, and keeping copies of what it returns.", topics: [
      { id: "orms", name: "ORMs and the N+1 problem",
        line: "Mapping rows to objects, and the queries that mapping hides from you.",
        body: [
          "An ORM maps tables to classes so code reads `user.orders` instead of SQL. It binds parameters (which prevents SQL injection), tracks relations and generates migrations, and it saves a lot of typing on ordinary create, read, update and delete. A query builder sits one step closer to SQL: typed and composable, with no hidden loading.",
          "The classic cost is the **N+1 query**: load 50 orders, touch each order's customer, and the ORM fires 51 queries. The fixes are eager loading (a `JOIN`, or a second query with `IN`) and reading the SQL your ORM emits. Complex reports are usually clearer as plain SQL."
        ],
        uses: [
          "**ActiveRecord in Rails**: `includes(:customer)` turns 51 queries into two, and the Bullet gem flags N+1 queries in development.",
          "**Django ORM**: `select_related` joins foreign keys and `prefetch_related` batches reverse and many-to-many relations.",
          "**SQLAlchemy**: the most used Python ORM, with a Core layer for plain SQL expressions and `selectinload` for eager loading.",
          "**Prisma, Drizzle and Kysely**: typed TypeScript clients; Drizzle and Kysely stay close to SQL as query builders."
        ],
        example: "A page lists 50 orders with customer names: `for o in Order.all(): print(o.customer.name)`. That is 1 query for the orders and 50 for customers, 51 round trips. At 1 ms each it costs 51 ms, and it grows with the page size. With eager loading the ORM runs `SELECT ... FROM customers WHERE id IN (...)` once: 2 queries in all, whatever the page size.",
        nuance: "The ORM does not remove the need to know SQL and indexes; it hides the moment you needed them. Turn on query logging in development and count the queries per request.",
        see: [{ label: "System design guide: indexing and query tuning", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/indexing" }],
        tags: ["sql", "activerecord", "sqlalchemy", "prisma", "n+1", "eager loading"] },
      { id: "connection-pools", name: "Connection pools",
        line: "A small set of open database connections, shared by many requests.",
        body: [
          "Opening a Postgres connection costs a TCP and TLS handshake, authentication and a new server process, several milliseconds each time. So a service keeps a pool of open connections and lends one to each query or transaction. Postgres handles hundreds of active connections poorly, so the pool is deliberately small: HikariCP's guidance starts near twice the database's CPU cores.",
          "When many app instances or serverless functions each open their own pool, an external pooler such as PgBouncer sits in front and multiplexes them; in transaction mode a server connection is held only for the length of one transaction."
        ],
        uses: [
          "**HikariCP**: the default pool in Spring Boot, sized by `maximumPoolSize`, which defaults to ten.",
          "**PgBouncer and Supavisor**: sit in front of Postgres so thousands of client connections share a few dozen server ones.",
          "**Amazon RDS Proxy**: pools connections for Lambda functions, which would otherwise open one per concurrent invocation."
        ],
        example: "Twenty app instances, each with a pool of 20, means 400 Postgres connections, far past the default `max_connections` of 100. Put PgBouncer in transaction mode in front with 40 server connections. Each instance still sees its pool of 20, but a server connection is borrowed only for the few milliseconds of a transaction, so 40 serve all 400.",
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
          "The safe pattern is **expand and contract**: add the new column or table, write to both, backfill in batches, move reads over, then drop the old one in a later deploy. In Postgres, watch the locks: building an index without `CONCURRENTLY` blocks writes on the table for as long as the build takes."
        ],
        uses: [
          "**Rails, Django and Alembic**: generate migration files from model changes and record the applied versions in a table in the database.",
          "**Flyway and Liquibase**: apply versioned SQL or changelog files for Java services, at application start or from CI.",
          "**Stripe**: moved live data between tables with a four-step dual-write migration, described in its post on online migrations.",
          "**GitHub's gh-ost**: changes large MySQL tables online by copying into a shadow table while following the binary log."
        ],
        example: "Renaming `users.name` to `full_name` without downtime. Deploy 1 adds `full_name` and writes both columns. A batch job copies `name` into `full_name`, 10,000 rows at a time. Deploy 2 reads `full_name`. Deploy 3 stops writing `name`, and a final migration drops it. A plain `RENAME COLUMN` would break every running old instance the moment it ran.",
        nuance: "Down migrations are rarely trusted in practice; teams roll forward with a new migration. What keeps you safe is making every step backward compatible, so the previous release still runs.",
        read: [{ label: "Stripe: online migrations at scale, the four-step dual-write pattern", url: "https://stripe.com/blog/online-migrations", m: 15 }],
        tags: ["alembic", "flyway", "expand and contract", "backfill", "ddl"] },
      { id: "caching", name: "Caching and invalidation",
        line: "Keeping a copy of an answer close by, and knowing when it went stale.",
        body: [
          "A cache trades freshness for speed: a Redis read on the same network takes well under a millisecond, where the query behind it may take tens. The common pattern is **cache-aside**: read the cache, and on a miss read the database and write the result back with a TTL. A CDN caches whole HTTP responses at the edge.",
          "Invalidation is the hard half: a short TTL (accept some staleness), deleting the key on write (a race can put the old value back), or versioned keys. A **stampede** happens when a hot key expires and a thousand requests hit the database at once; let one request refill while the others wait."
        ],
        uses: [
          "**Meta's Memcached fleet**: sits in front of MySQL for the social graph, serving billions of requests a second, as described in its 2013 paper on scaling Memcache.",
          "**Redis and Valkey**: the default cache for most services; Valkey is the Linux Foundation fork started after Redis changed its licence in 2024.",
          "**Cloudflare and Fastly**: cache whole responses at the edge, keyed by URL and governed by `Cache-Control` headers."
        ],
        example: "Cache-aside for a product page. `GET product:42` misses in Redis, so the handler runs the 30 ms query, writes `product:42` with a 300 s TTL, and returns. The next 10,000 reads take about 0.5 ms each. When the price changes, the writer deletes `product:42`, and the next read refills it with the new price.",
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
          "Anything slow, flaky or bursty (sending email, transcoding, calling a model, delivering webhooks) should not run inside the request. The handler writes a job to a queue and returns, often with `202 Accepted` and a job id; workers pull jobs, run them and acknowledge them. If a worker dies mid-job, the job becomes visible again after a timeout and another worker takes it.",
          "The queue can be a broker (SQS, RabbitMQ), a log (Kafka, where each consumer tracks its offset), or a Postgres table: with `SELECT ... FOR UPDATE SKIP LOCKED`, many workers claim different rows without blocking each other, and a job commits in the same transaction as its data."
        ],
        uses: [
          "**Sidekiq, Celery and BullMQ**: the job runners for Rails, Python and Node, with jobs held in Redis (or RabbitMQ for Celery) and retried with backoff.",
          "**Amazon SQS with Lambda**: Lambda polls the queue and invokes your function with batches of messages, deleting them when it succeeds.",
          "**Oban**: an Elixir job queue stored in Postgres, where workers claim jobs with `FOR UPDATE SKIP LOCKED`.",
          "**Temporal and Inngest**: durable multi-step workflows on top of queues, which resume a long run after a crash."
        ],
        example: "A user uploads a 2 GB video. Without a queue, the request waits four minutes for transcoding and is cut off by the load balancer's 60 s idle timeout. With one, the handler stores the file, inserts a job row and returns `202` with `job_id=881` in 80 ms. A worker claims the row with `SKIP LOCKED`, transcodes, marks it done, and the page learns of it by polling or a push.",
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
          "The standard fix is an **idempotency key**: the client generates a unique key per logical operation and sends it with every attempt. The server records the key and the result in the same transaction as the work; a repeat returns the stored result instead of acting again. Queue and webhook consumers do the same with message ids."
        ],
        uses: [
          "**Stripe**: accepts an `Idempotency-Key` header on any `POST`; a repeat within 24 hours returns the first response, errors included.",
          "**Adyen, PayPal and Square**: equivalent keys on their payment APIs, so an app on a dropped connection can retry a charge safely.",
          "**IETF**: a draft standard for the `Idempotency-Key` HTTP header, generalising the Stripe design."
        ],
        example: "A checkout sends `POST /charges` for $40 with `Idempotency-Key: 7f3a`. The server charges the card and stores `7f3a` with the result `ch_1`, but the reply is lost. The app retries with the same key. The server finds `7f3a`, skips the charge and returns `ch_1` again. The customer pays $40 once; without the key, the retry creates `ch_2` and a refund ticket.",
        nuance: "Recording the key after the work, in a separate step, leaves a window where a crash loses it. The key, the lock and the effect belong in one transaction, and an external call made inside needs its own key.",
        read: [{ label: "Brandur Leach: implementing Stripe-like idempotency keys in Postgres", url: "https://brandur.org/idempotency-keys", m: 25 }],
        see: [{ label: "System design guide: idempotency keys", href: "SYSTEM%20DESIGN.html#/patterns/multi-step/idempotency" }],
        tags: ["idempotency key", "retries", "exactly once", "dedupe"] },
      { id: "timeouts-retries", name: "Timeouts, retries and backoff",
        line: "Bounding how long you wait, and retrying without turning a blip into an outage.",
        body: [
          "Every network call needs a timeout, or one slow dependency holds threads and connections until the whole service stalls. A good timeout sits a little above the dependency's p99 latency, and the deadline should travel down the call chain, so inner calls stop when the outer caller has already given up.",
          "Retries fix transient failures and amplify real ones. The safeguards are exponential backoff with **jitter** (random spread, so clients do not retry in lockstep), a retry budget that caps retries as a share of traffic, retrying only idempotent calls, and a **circuit breaker** that stops calling a dependency that is clearly down."
        ],
        uses: [
          "**AWS SDKs**: retry throttling and transient errors with exponential backoff, jitter and a client-side retry quota by default.",
          "**gRPC**: a deadline set by the first caller travels with each call, so downstream services can stop work nobody is waiting for.",
          "**Envoy and Istio**: apply retry, timeout and circuit-breaker policy at the proxy, the same for every service in the mesh.",
          "**OpenAI and Anthropic SDKs**: retry rate-limit and overload errors with backoff, twice by default."
        ],
        example: "Retry amplification, worked. A request passes through three layers, each making up to three attempts. When the bottom service fails, one user request becomes 3 × 3 × 3 = 27 calls to it. At 1,000 requests a second, the struggling service now receives 27,000. Retrying only at one layer, with backoff of 100, 200 and 400 ms plus jitter, caps it at 3,000, spread out in time.",
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
          "A rate limiter counts requests per key (API key, user, IP address or tenant) and rejects the excess with `429 Too Many Requests`, ideally with a `Retry-After` header. The **token bucket** is the usual algorithm: a bucket refills at a steady rate and each request takes a token, which allows short bursts while holding the average. Fixed windows let through up to double the limit around a window boundary; sliding windows fix that.",
          "Across many servers the counters live in a shared store, typically Redis updated by an atomic script."
        ],
        uses: [
          "**OpenAI and Anthropic**: limit both requests and tokens per minute by usage tier, returning 429 with headers that show what remains.",
          "**GitHub API**: allows an authenticated user 5,000 requests an hour and reports what is left in a rate-limit header on every response.",
          "**Cloudflare and AWS API Gateway**: rate limit at the edge, before traffic reaches your servers.",
          "**Stripe**: layers a per-user request limiter, a concurrent-request limiter and two load shedders that drop low-priority traffic when the fleet is saturated."
        ],
        example: "A token bucket holds 10 tokens and refills at 5 a second. A client that has been idle sends 10 requests at once: all pass and the bucket is empty. An 11th, 50 ms later, finds no whole token and gets `429` with `Retry-After: 1`. From then on the client can sustain 5 requests a second, with bursts of up to 10 after quiet spells.",
        nuance: "A limit by IP punishes everyone behind one office NAT and misses an attacker with many addresses. Pick the key that matches what you are protecting, and limit concurrency as well as rate for slow endpoints.",
        read: [{ label: "Stripe: scaling your API with rate limiters", url: "https://stripe.com/blog/rate-limiters", m: 15 }],
        see: [{ label: "System design guide: rate limiting", href: "SYSTEM%20DESIGN.html#/patterns/reliability/rate-limiting" }],
        tags: ["token bucket", "429", "sliding window", "load shedding", "throttling"] }
    ] },
    { name: "Shape and operations", line: "How the service is deployed, divided, watched and tested.", topics: [
      { id: "serverless-edge", name: "Serverless and edge functions",
        line: "Code that runs per request on rented capacity, against a server you keep running.",
        body: [
          "A serverless function (AWS Lambda, Google Cloud Run functions) runs your handler on demand, bills per invocation and duration, and scales to zero when idle. The first request to a new instance pays a **cold start**: load the code, start the runtime and run your initialisation, from under 100 ms to over a second. A Lambda invocation is capped at 15 minutes.",
          "Edge functions (Cloudflare Workers, Deno Deploy) run in V8 isolates near users; an isolate starts in milliseconds, but the runtime is restricted and your database usually sits in one region. A long-running service (a container on ECS, Kubernetes or Fly.io) keeps memory and connections between requests, and costs money while idle."
        ],
        uses: [
          "**AWS Lambda behind API Gateway**: glue code, webhooks and scheduled jobs that run a few times a minute and cost nothing in between.",
          "**Cloudflare Workers**: auth checks, redirects and A/B routing in front of a site, running in data centres close to each user.",
          "**Vercel Functions**: run a Next.js site's server rendering and API routes, scaled per request.",
          "**Google Cloud Run**: runs any container per request and scales to zero, a middle ground for services too large for a function."
        ],
        example: "Cost, worked. A webhook handler takes 200 ms with 512 MB and runs 100,000 times a month: 100,000 × 0.2 s × 0.5 GB = 10,000 GB-seconds, well under a dollar at Lambda's list price, against paying for a server all month. A voice agent holding a ten-minute stream on every call reverses the sum: it wants a long-lived process.",
        nuance: "Serverless suits short, spiky, stateless work. It fits badly with long LLM streams, WebSockets, in-memory caches and database connection pools, which is why voice and agent backends usually run as long-lived services.",
        read: [
          { label: "AWS docs: the Lambda execution environment lifecycle and cold starts", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html", m: 15 },
          { label: "Cloudflare docs: how Workers works, isolates against containers", url: "https://developers.cloudflare.com/workers/reference/how-workers-works/", m: 8 }
        ],
        tags: ["lambda", "cloudflare workers", "cold start", "isolates", "faas"] },
      { id: "monolith-microservices", name: "Monolith or microservices",
        line: "One deployable or many: a choice about teams and boundaries more than technology.",
        body: [
          "A **monolith** is one codebase deployed as one unit; its parts call each other as functions, and one database transaction can cover everything. **Microservices** split the system into services that own their data and deploy on their own, talking over the network. The gain is independent deployment and scaling for many teams; the cost is calls that can fail, data with no shared transaction, and far more to operate.",
          "The middle path is the **modular monolith**: one deployable with enforced boundaries inside it. Most successful microservice systems began as a monolith that grew too large."
        ],
        uses: [
          "**Shopify**: runs one of the largest Rails monoliths, divided into components with public interfaces and checked by its Packwerk tool for calls across the lines.",
          "**Amazon, Netflix and Uber**: run hundreds or thousands of services, each owned by one team that deploys it on its own schedule.",
          "**Prime Video**: in 2023 moved a monitoring pipeline from serverless microservices into a single service and cut its infrastructure cost by 90%."
        ],
        example: "Placing an order in a monolith: one transaction inserts the order, decrements stock and records the payment, and any failure rolls all three back. Split into order, stock and payment services, the same action is three network calls. If payment fails after stock was reserved, someone must write the compensating step that releases it, a saga, and test what happens when that step fails too.",
        nuance: "Splitting by technical layer (an auth service, a database service) gives you the costs of both. Split, if at all, along business boundaries that change independently, and when team size has made the monolith the bottleneck.",
        read: [
          { label: "Martin Fowler: Monolith First", url: "https://martinfowler.com/bliki/MonolithFirst.html", m: 5 },
          { label: "Shopify Engineering: deconstructing the monolith", url: "https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity", m: 15 }
        ],
        tags: ["modular monolith", "service boundaries", "architecture"] },
      { id: "observability", name: "Observability: logs, metrics, traces",
        line: "The signals that let you answer questions about a running service you did not foresee.",
        body: [
          "**Logs** are timestamped events; structured as JSON with a request id, they become searchable. **Metrics** are numbers over time (request rate, error rate, latency percentiles, queue depth), cheap to store and the basis of alerts. **Traces** follow one request across services as a tree of spans, which is how you find which of twelve calls made a request slow.",
          "Google's SRE book names four golden signals for any service: latency, traffic, errors and saturation. Alert on symptoms users feel, tied to service level objectives, not on every CPU spike. OpenTelemetry is now the standard way to emit all three signals, so the backend that stores them can change without touching code."
        ],
        uses: [
          "**Datadog, Honeycomb and New Relic**: hosted backends that store logs, metrics and traces and link them by request.",
          "**Prometheus and Grafana**: Prometheus scrapes each service's metrics every few seconds; Grafana draws the dashboards, with Loki and Tempo for logs and traces.",
          "**Sentry**: groups exceptions by stack trace and points at the release that introduced them.",
          "**Langfuse and LangSmith**: trace LLM apps as spans of prompts, tool calls and token counts, on the same span model."
        ],
        example: "Checkout p99 jumps from 400 ms to 3 s and the latency alert fires. One slow trace shows 14 spans: 13 take under 20 ms, and a call to the tax service takes 2.6 s. That service's logs, filtered by the same trace id, show requests waiting for a free database connection. The metric said something was wrong, the trace said where, the logs said why.",
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
          "**Unit tests** check one function with its collaborators faked; they are fast and catch logic errors. **Integration tests** run the service against real dependencies, usually a real Postgres in a container, and catch the bugs that live in SQL, migrations and serialisation. **Contract tests** check that a provider still honours what its consumers expect. End-to-end tests drive the whole system; they are slow and flaky, so keep them few.",
          "For backends the balance has moved toward integration tests: a throwaway database is cheap, and a mocked database mostly tests the mock. Third-party APIs are faked at the HTTP boundary."
        ],
        uses: [
          "**Testcontainers**: starts a real Postgres, Redis or Kafka in Docker for each test run, with libraries for Java, Go, Python, Node and .NET.",
          "**Pact**: consumer-driven contracts, where the client's tests record what it expects and the provider's CI checks it still delivers.",
          "**WireMock and VCR-style recorders**: fake third-party HTTP APIs with hand-written or recorded responses, so tests never call Stripe or a model provider."
        ],
        example: "A test against a mocked repository passes, and production breaks: the query uses `ORDER BY due_date DESC`, Postgres puts `NULL`s first when sorting descending, and the code assumed they came last. An integration test that starts Postgres in Testcontainers, runs the migrations, inserts three rows and calls the endpoint catches it in about four seconds.",
        nuance: "A suite nobody trusts gets ignored. Flaky tests usually point at shared state, time or ordering; fix or delete them rather than retrying them in CI.",
        read: [{ label: "Ham Vocke: the practical test pyramid", url: "https://martinfowler.com/articles/practical-test-pyramid.html", m: 40 }],
        tags: ["pytest", "testcontainers", "pact", "contract tests", "integration tests"] }
    ] }
  ],
  see: [{ label: "System design guide", href: "SYSTEM%20DESIGN.html" }]
});
