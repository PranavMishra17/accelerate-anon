BASELINE.field({
  id: "data", name: "Data", short: "Data", layer: "Foundations",
  ink: "#6B5A2E", inkDark: "#CDB57A",
  lede: "How data is modelled, stored, indexed, kept correct under concurrent writes, and moved from the database that runs the product to the systems that analyse it.",
  overview: [
    "Every product is a thin layer over its data. This field covers the databases that hold the live state of an application (OLTP: Postgres, MySQL, DynamoDB, MongoDB), the structures inside them that make reads fast and writes safe (indexes, storage engines, transactions), the other data models for other shapes of data (documents, wide columns, graphs, vectors), and the analytics side, where copies of that data are moved into warehouses and lakehouses to be queried in bulk. Job titles: backend engineers own the first half; data engineers, analytics engineers and database engineers (DBAs, now often platform engineers) own the rest.",
    "It rests on systems (disks, the page cache, memory) and on distributed systems (replication, sharding, logs), and it feeds ML and AI: training sets, feature stores and the retrieval behind RAG all start in tables. The industry in 2026 has settled on a few defaults: Postgres for most applications, often with pgvector for embeddings; object storage with Parquet files and an open table format (Apache Iceberg or Delta Lake) for analytics; Snowflake, BigQuery and Databricks as the large platforms that query it; and dbt for transformations written in SQL.",
    "If time is short, read the relational cluster closely. Indexes and isolation levels come up in almost every backend interview, and they explain most slow queries and most concurrency bugs in production."
  ],
  diagram: {
    nodes: [
      { id: "caching", label: "Cache", sub: "Redis, hot reads", col: 0, row: 0 },
      { id: "relational-sql", label: "OLTP database", sub: "Postgres, rows, SQL", col: 0, row: 1 },
      { id: "indexes", label: "Indexes", sub: "B-tree lookups", col: 0, row: 2 },
      { id: "transactions-isolation", label: "Transactions", sub: "isolation, MVCC", col: 0, row: 3 },
      { id: "cdc", label: "Change data capture", sub: "read the WAL", col: 1, row: 1 },
      { id: "batch-stream", label: "Stream and batch", sub: "Kafka, Flink, Spark", col: 1, row: 2 },
      { id: "vector-db", label: "Vector index", sub: "embeddings for search", col: 1, row: 3 },
      { id: "warehouses-lakehouses", label: "Warehouse, lakehouse", sub: "Snowflake, Iceberg", col: 2, row: 1 },
      { id: "etl-elt", label: "Transform in SQL", sub: "ELT with dbt", col: 2, row: 2 },
      { id: "data-quality-lineage", label: "Quality and lineage", sub: "tests, where it came from", col: 2, row: 3 }
    ],
    edges: [
      ["caching", "relational-sql", "on a miss"], ["relational-sql", "indexes", "lookups"],
      ["indexes", "transactions-isolation"], ["relational-sql", "cdc", "WAL"],
      ["cdc", "batch-stream", "change events"], ["batch-stream", "vector-db", "embed"],
      ["batch-stream", "warehouses-lakehouses", "load"], ["warehouses-lakehouses", "etl-elt", "raw to models"],
      ["etl-elt", "data-quality-lineage", "tested"]
    ],
    cap: "**Data's path from the database that runs the product to the systems that analyse it.** The left column serves live reads and writes; the middle carries every change out as events; the right turns raw copies into trusted tables. A change made on the left reaches the right seconds to hours later, and that delay is a design choice."
  },
  start: [
    { label: "Markus Winand, Use the Index, Luke: chapters 1 and 2 (anatomy of an index, the where clause)", url: "https://use-the-index-luke.com/", m: 60, why: "The fastest way to understand why a query is slow, for any SQL database." },
    { label: "Martin Kleppmann and Chris Riccomini, Designing Data-Intensive Applications, 2e: ch. 3 Data Models, ch. 4 Storage and Retrieval, ch. 8 Transactions", url: "https://dataintensive.net/", m: 240, why: "The models, the storage engines and the isolation anomalies, in one consistent voice." },
    { label: "CMU 15-445/645 Intro to Database Systems (course page; lectures, notes, projects)", url: "https://15445.courses.cs.cmu.edu/", m: 120, why: "How a database works inside: storage, buffer pool, B+trees, concurrency control, recovery." },
    { label: "Michael Stonebraker and Andrew Pavlo, What goes around comes around... and around (SIGMOD Record, 2024)", url: "https://db.cs.cmu.edu/papers/2024/whatgoesaround-sigmodrec2024.pdf", m: 45, why: "Twenty years of data models and systems reviewed, and why SQL keeps winning." }
  ],
  clusters: [
    { name: "The relational core", line: "Tables, SQL, and the machinery that makes them fast and correct.",
      topics: [
        { id: "relational-sql", name: "The relational model and SQL",
          line: "Data as tables of rows; queries say what you want, the planner decides how.",
          body: [
            "The relational model (Codd, 1970) stores data as **tables** of rows with typed columns, links tables by keys, and enforces rules with constraints: primary keys, foreign keys, `NOT NULL`, `UNIQUE`, `CHECK`. SQL is **declarative**: you describe the result with `SELECT`, `JOIN`, `WHERE` and `GROUP BY`, and the **query planner** chooses indexes, join order and algorithms from statistics about the data.",
            "`EXPLAIN ANALYZE` shows the plan the database chose and the time each step took. Reading it is the core skill: a sequential scan over a large table, a nested loop over many rows, or an estimate that is far from the actual row count explains most slow queries."
          ],
          uses: [
            "**Postgres**: the most used database in recent Stack Overflow developer surveys; Supabase, Neon and AWS Aurora sell it managed.",
            "**SQLite**: embedded in every iPhone and Android phone and in the major browsers, a full SQL database in one file.",
            "**MySQL**: runs much of the older web, including Shopify and GitHub."
          ],
          example: "An endpoint is slow. `EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42` shows a `Seq Scan on orders` with `Rows Removed by Filter: 7999970`: it read 8 million rows to return 30. After `CREATE INDEX ON orders (customer_id)` the plan becomes an `Index Scan` that reads a few pages, and the query falls from hundreds of milliseconds to under one.",
          nuance: "ORMs hide the SQL and produce the N+1 query problem: one query for a list, then one more per row. Log the queries an endpoint runs before tuning anything else.",
          read: [{ label: "Zi Chong Kao, Select Star SQL: an interactive book on a real dataset", url: "https://selectstarsql.com/", m: 90 }],
          tags: ["sql", "postgres", "mysql", "query planner", "explain", "joins", "orm"] },
        { id: "indexes", name: "Indexes and B-trees",
          line: "A sorted structure beside the table, so a lookup reads a few pages, not all.",
          body: [
            "Without an index, finding rows means scanning the whole table. A **B-tree** index keeps keys sorted in a balanced tree of disk pages; each page holds hundreds of keys, so even a billion rows need only about four levels, and a lookup or range scan reads a handful of pages. It is the default index in Postgres, MySQL and SQLite.",
            "A **composite index** on `(a, b)` serves queries filtering on `a`, or on `a` and `b`, but not on `b` alone, because it is sorted by `a` first. A **covering index** includes every column the query needs, so the table itself is never read. Postgres adds other types: GIN for JSON and full-text search, BRIN for huge append-only tables, and HNSW through pgvector."
          ],
          uses: [
            "**Postgres, MySQL and SQLite**: use B-trees as the default index; MySQL's InnoDB also stores each table itself as a B-tree on the primary key.",
            "**Postgres GIN**: indexes `jsonb` and full-text search by mapping each key or word to the rows that contain it.",
            "**pgvector**: adds HNSW indexes to Postgres for embedding search.",
            "**Supabase index advisor**: suggests missing indexes for slow queries."
          ],
          example: "An index on `(customer_id, created_at)`. `WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20` walks to customer 42 and reads 20 entries already in order. `WHERE created_at > now() - interval '1 day'` on its own cannot use it, because dates are sorted only within each customer, so it scans. Even a billion-row B-tree is about four levels deep: four page reads per lookup.",
          nuance: "Every index slows every write and takes memory, and an unused one is pure cost. Functions on the column (`WHERE lower(email) = ...`) skip a plain index unless you index the expression.",
          read: [
            { label: "Markus Winand, Use the Index, Luke: chapter 1, Anatomy of an index", url: "https://use-the-index-luke.com/", m: 20 },
            { label: "PostgreSQL documentation: Index types", url: "https://www.postgresql.org/docs/current/indexes-types.html", m: 10 }
          ],
          see: [{ label: "System design guide: indexing and query tuning", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/indexing" }],
          tags: ["b-tree", "composite index", "covering index", "gin", "brin", "explain"] },
        { id: "lsm-trees", name: "LSM trees and storage engines",
          line: "Buffer writes in memory, flush sorted files, merge them later: fast writes, costlier reads.",
          body: [
            "A **log-structured merge tree** turns random writes into sequential ones. A write goes to a write-ahead log for durability and into an in-memory sorted table (the **memtable**). When the memtable fills, it is written to disk as an immutable sorted file (an **SSTable**). A read checks the memtable and then the files from newest to oldest, using **Bloom filters** to skip files that cannot hold the key. **Compaction** merges files in the background and drops overwritten and deleted values.",
            "Compared with an in-place B-tree, an LSM engine takes writes faster and compresses better, while reads may touch several files and compaction uses disk bandwidth in bursts."
          ],
          uses: [
            "**RocksDB**: Meta's LSM engine, embedded in TiKV, Kafka Streams state stores and MyRocks, the MySQL engine Facebook runs.",
            "**Cassandra, ScyllaDB and HBase**: LSM-based stores built for heavy write traffic.",
            "**CockroachDB**: stores its data in Pebble, an LSM engine written in Go."
          ],
          example: "Write `user:7 = Ann`: append to the WAL, insert into the memtable, return. Later that memtable is flushed as an SSTable. Write `user:7 = Anna`: it lands in the new memtable. A read of `user:7` finds `Anna` in memory and stops. A read of `user:9` checks memory, then each SSTable's Bloom filter, and opens only files that might hold it. Compaction later merges the files and drops `Ann`.",
          nuance: "Compaction can fall behind under heavy writes and cause latency spikes long after the write burst. Tuning an LSM store is mostly tuning compaction.",
          read: [{ label: "RocksDB wiki: RocksDB overview (memtable, SST files, compaction)", url: "https://github.com/facebook/rocksdb/wiki/RocksDB-Overview", m: 25 }],
          see: [{ label: "System design guide: write-optimized stores", href: "SYSTEM%20DESIGN.html#/patterns/scaling-writes/write-optimized" }],
          tags: ["lsm", "sstable", "memtable", "compaction", "bloom filter", "rocksdb", "write amplification"] },
        { id: "transactions-isolation", name: "Transactions and isolation levels",
          line: "Group writes so they succeed or fail together, and decide what concurrent ones see.",
          body: [
            "A transaction is **atomic** (all or nothing), keeps the database **consistent** with its constraints, is **isolated** from concurrent transactions to a chosen degree, and is **durable** once committed (ACID). Isolation is the hard part. Most databases use **MVCC**: writers create new row versions and readers see a snapshot, so reads do not block writes.",
            "The levels trade safety for concurrency. **Read committed** (Postgres's default) sees only committed data but can see different data on two reads. **Repeatable read** (snapshot isolation in Postgres, and the default in MySQL) sees one snapshot for the whole transaction but still allows **write skew**: two transactions each check a condition, then both write, and together break it. **Serializable** prevents every anomaly; Postgres does it by detecting dangerous patterns and aborting one transaction, which the application must retry."
          ],
          uses: [
            "**Booking, inventory and balance code**: where lost updates and write skew live, such as two bookings of the last room.",
            "**Postgres**: defaults to read committed and offers serializable snapshot isolation, which aborts transactions that could form an anomaly.",
            "**CockroachDB and Spanner**: default to serializable isolation.",
            "**Oracle**: its 'serializable' level is in fact snapshot isolation."
          ],
          example: "A hospital requires at least one doctor on call, and two are. Each doctor's request starts a transaction, reads `count(on_call) = 2`, decides it is safe to leave, and sets that doctor's own row to off call. Under snapshot isolation both commit, since they wrote different rows, and nobody is on call. That is write skew; serializable aborts one of them.",
          nuance: "A read-modify-write in application code (`SELECT` then `UPDATE`) loses updates at read committed. Use an atomic `UPDATE ... SET x = x - 1 WHERE x > 0`, `SELECT ... FOR UPDATE`, or serializable with retries.",
          read: [
            { label: "PostgreSQL documentation: Transaction isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html", m: 25 },
            { label: "Martin Kleppmann, Hermitage: testing what isolation levels really do in each database", url: "https://github.com/ept/hermitage", m: 15 }
          ],
          see: [{ label: "System design guide: optimistic concurrency", href: "SYSTEM%20DESIGN.html#/patterns/contention/optimistic" }],
          tags: ["acid", "mvcc", "isolation level", "write skew", "lost update", "serializable", "snapshot isolation"] },
        { id: "normalisation", name: "Normalisation and denormalisation",
          line: "Store each fact once; copy it on purpose when reads need speed.",
          body: [
            "**Normalisation** removes redundancy: each fact lives in one place and is referenced by key. A customer's address sits in the customers table, not repeated on every order. The normal forms (1NF to 3NF and BCNF) are rules for getting there; in practice, 3NF means every non-key column depends on the key, the whole key, and nothing but the key. The benefit is that an update happens once and cannot leave copies disagreeing.",
            "**Denormalisation** copies data deliberately to make reads cheap: a comment count stored on the post, an order row that keeps the price at the time of purchase, a materialised view that precomputes a join. Each copy needs a rule for keeping it right: a trigger, the same transaction, or an event that updates it."
          ],
          uses: [
            "**Application databases**: usually sit close to 3NF, so an update to a customer changes one row.",
            "**Analytics warehouses**: deliberately denormalise into star schemas, one fact table joined to several dimension tables.",
            "**DynamoDB single-table design**: denormalises around access patterns, storing related items under one partition key.",
            "**Postgres materialised views**: precompute a join or aggregate and refresh it on a schedule."
          ],
          example: "An orders table stores `customer_name` on every row. A customer changes their name, and 400 orders keep the old one unless all 400 are updated. Normalised, orders hold `customer_id` and the name lives once in `customers`. But `unit_price` should stay on each order line: when the catalogue price changes next month, old orders must still show what was paid.",
          nuance: "Some copies are not redundancy but history: the price on an old order must not change when the catalogue does. Decide which copies are caches and which are records.",
          read: [{ label: "Wikipedia, Database normalization", url: "https://en.wikipedia.org/wiki/Database_normalization", m: 15 }],
          see: [{ label: "System design guide: denormalization and materialized views", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/denormalize" }],
          tags: ["normal forms", "3nf", "denormalization", "materialized view", "redundancy"] }
      ] },
    { name: "Other data models", line: "Documents, wide columns, graphs and vectors, each for a different shape of data.",
      topics: [
        { id: "document-kv", name: "Document and key-value stores",
          line: "Store a whole object by key; fast by access pattern, weaker at joins.",
          body: [
            "A **key-value store** maps a key to an opaque value: get, put, delete, sometimes with a TTL. A **document store** keeps a JSON-like document per key and can query and index fields inside it. Both fit data that is read as a unit (a user profile, a cart, a session) and scale out by sharding on the key.",
            "The design method is the reverse of relational: list the access patterns first, then shape keys and documents so each pattern is one lookup. Related data is embedded in the document rather than joined at read time."
          ],
          uses: [
            "**Redis and Valkey**: hold sessions, rate-limit counters and caches as keys with TTLs.",
            "**DynamoDB**: backs much of Amazon's own retail systems and many serverless apps, with reads by key in single-digit milliseconds.",
            "**MongoDB and Firestore**: common document stores; Firestore syncs documents straight to mobile and web clients.",
            "**Postgres `jsonb`**: with a GIN index, covers many document needs inside a relational database."
          ],
          example: "A shopping cart in DynamoDB: partition key `USER#91`, one item holding the cart as a document with its line items. Showing the cart is one `GetItem` by key, a few milliseconds at any scale. Asking which carts contain product 55 has no key to look up: it needs a secondary index planned in advance, or a scan of the whole table.",
          nuance: "Schemaless means the schema lives in application code instead, and every old document shape must still be readable. Joins and new access patterns that were not planned for get expensive fast.",
          read: [{ label: "DDIA, 2e: ch. 3 Data Models (relational against document)", url: "https://dataintensive.net/", m: 45 }],
          tags: ["key-value", "document", "dynamodb", "mongodb", "redis", "jsonb", "single-table design"] },
        { id: "wide-column", name: "Wide-column stores",
          line: "Rows grouped by a partition key and sorted within it, built for heavy writes.",
          body: [
            "A wide-column store (the model from Google's Bigtable, 2006) organises rows by a **partition key**, which decides the node, and a **clustering key**, which sorts rows inside the partition. A query names one partition and reads a sorted slice of it, such as the latest 50 messages in one channel. Storage is usually an LSM tree, so writes are cheap and sequential.",
            "Tables are designed per query: the same data is often written to several tables, each keyed for a different read. There are no joins and secondary indexes are limited."
          ],
          uses: [
            "**Discord**: stores messages in ScyllaDB, after moving off Cassandra, partitioned by channel and time bucket.",
            "**Apple and Netflix**: run some of the largest Cassandra deployments.",
            "**Google Bigtable**: backs time-series and analytics workloads on Google Cloud; HBase is the open Hadoop-era version."
          ],
          example: "A messages table with partition key `(channel_id, bucket)`, where `bucket` is a 10-day window, and clustering key `message_id` in descending order. The latest 50 messages in channel 7 come from one partition, already sorted: one sequential slice. Bucketing by time stops a busy channel's partition from growing forever.",
          nuance: "'Wide-column' is not 'columnar': these are row stores grouped by partition, not analytics engines. A partition that grows without bound (one huge channel) becomes a hot spot; bucket by time.",
          read: [{ label: "DDIA, 2e: ch. 4 Storage and Retrieval (SSTables and LSM trees)", url: "https://dataintensive.net/", m: 40 }],
          tags: ["bigtable", "cassandra", "scylladb", "hbase", "partition key", "clustering key", "time series"] },
        { id: "graph-db", name: "Graph databases",
          line: "Nodes and relationships as first-class data, queried by walking the connections.",
          body: [
            "A **property graph** stores **nodes** (people, accounts, products) and **relationships** between them (follows, paid, bought), each carrying key-value properties. Queries describe patterns to walk, such as friends of friends who bought this product, in a language like Cypher; GQL became an ISO standard in 2024. Native graph stores keep each node's relationships next to it, so a hop costs about the same however large the graph is.",
            "Graphs earn their place when queries are many hops deep or the depth is not known in advance, where SQL would need many self-joins or recursive queries."
          ],
          uses: [
            "**Neo4j**: the best-known graph database, queried in Cypher; Amazon Neptune and Memgraph are others.",
            "**Fraud detection**: finds rings of accounts that share devices, cards or addresses several hops apart.",
            "**Microsoft GraphRAG**: builds a knowledge graph of entities and relations from documents, so retrieval can follow connections.",
            "**IT dependency maps**: answer which services break if this database goes down."
          ],
          example: "In Cypher, `MATCH (me:Person {id: 1})-[:FOLLOWS]->()-[:FOLLOWS]->(fof) WHERE NOT (me)-[:FOLLOWS]->(fof) RETURN fof LIMIT 10` finds people followed by people you follow. In SQL that is a self-join on a follows table, fine at two hops. At five hops, or at any depth, the joins multiply, while the graph walk stays cheap per hop.",
          nuance: "Many 'graph' problems are two or three hops and run fine in Postgres with joins or a recursive CTE. Move to a graph database when traversal depth or pattern queries are the main workload, not for a single feature.",
          read: [{ label: "Neo4j, Getting started: what is a graph database", url: "https://neo4j.com/docs/getting-started/graph-database/", m: 10 }],
          tags: ["neo4j", "cypher", "gql", "property graph", "neptune", "knowledge graph", "graphrag"] },
        { id: "vector-db", name: "Vector databases and indexes",
          line: "Find the nearest embeddings fast, trading a little accuracy for a lot of speed.",
          body: [
            "An embedding model turns text, images or audio into a vector of a few hundred to a few thousand numbers, placed so that similar meaning sits close together. Search becomes **nearest neighbour** search by cosine or dot-product distance. Exact search compares against every vector; **approximate** indexes avoid that. **HNSW** builds a layered graph and walks it greedily from coarse to fine; **IVF** clusters the vectors and searches only the nearest clusters.",
            "Every approximate index trades **recall** (how many of the true nearest it finds) for speed and memory, with parameters such as `ef_search` that you tune against a labelled test set."
          ],
          uses: [
            "**RAG and semantic search**: embed the question, fetch the nearest document chunks, and pass them to the model.",
            "**pgvector**: adds HNSW and IVFFlat indexes to Postgres and covers many teams' needs.",
            "**Pinecone, Qdrant, Weaviate, Milvus and turbopuffer**: dedicated vector search services.",
            "**Elasticsearch and OpenSearch**: combine vector search with keyword (BM25) search for hybrid ranking."
          ],
          example: "A support bot holds 2 million chunks as 1,536-dimension embeddings: about 12 GB of floats. Exact search compares each query with all 2 million. An HNSW index visits a few thousand vectors and answers in milliseconds. Measured on a labelled set, it might find 95 of the true top 100 at one `ef_search` setting and 99 at a higher one, with more latency.",
          nuance: "Filtering (only this tenant's documents) interacts badly with approximate indexes and can silently drop recall. Hybrid search with keywords plus a reranker usually beats tuning the vector index further.",
          read: [
            { label: "pgvector README: HNSW and IVFFlat indexes, and filtering", url: "https://github.com/pgvector/pgvector", m: 20 },
            { label: "Pinecone, Hierarchical navigable small worlds (HNSW)", url: "https://www.pinecone.io/learn/series/faiss/hnsw/", m: 25 }
          ],
          see: [{ label: "System design guide: vector index", href: "SYSTEM%20DESIGN.html#/patterns/search/vector" }],
          tags: ["embeddings", "hnsw", "ivf", "ann", "pgvector", "pinecone", "recall", "rag"] }
      ] },
    { name: "Analytics", line: "Copies of the data, organised for scanning billions of rows instead of fetching one.",
      topics: [
        { id: "oltp-olap", name: "OLTP against OLAP",
          line: "Many small reads and writes of whole rows, against few huge scans of some columns.",
          body: [
            "**OLTP** (online transaction processing) is the application's workload: thousands of small queries per second, each touching a few rows by key, many of them writes. Row-oriented storage suits it: a row's columns sit together, so one read fetches the whole record. **OLAP** (online analytical processing) is reporting and analysis: few queries, each scanning millions or billions of rows but only a handful of columns, aggregating as it goes.",
            "Columnar storage suits OLAP. Each column is stored contiguously and compresses well because neighbouring values are similar; a query reads only the columns it names, and engines process values in vectorised batches that use the CPU's SIMD instructions."
          ],
          uses: [
            "**Postgres and MySQL**: row stores for OLTP, where each request reads or writes a few whole rows.",
            "**ClickHouse, DuckDB, Snowflake, BigQuery and Redshift**: columnar OLAP engines for scans and aggregates; Parquet is the standard columnar file.",
            "**TiDB and SingleStore**: HTAP systems that keep row and column copies to serve both."
          ],
          example: "A table of a billion orders with 50 columns. OLTP: fetch order 812, one row with all 50 columns, by primary key. OLAP: revenue by month for 2025, which needs two columns of every row. A row store reads all 50 columns off disk; a column store reads 2 of 50, about 4 percent of the bytes, and those compress well.",
          nuance: "Running heavy analytics on the production database competes with users for the same CPU and cache. Replicate to an analytics store first, even for a small team; DuckDB on Parquet files is often enough.",
          read: [{ label: "ClickHouse documentation: Why is ClickHouse so fast", url: "https://clickhouse.com/docs/concepts/why-clickhouse-is-so-fast", m: 15 }],
          tags: ["oltp", "olap", "columnar", "parquet", "clickhouse", "duckdb", "vectorized"] },
        { id: "warehouses-lakehouses", name: "Warehouses and lakehouses",
          line: "Analytics over one copy of all the data, increasingly as open files on object storage.",
          body: [
            "A **data warehouse** loads data into its own managed columnar storage and queries it with SQL. Snowflake separated storage from compute, so many independent clusters query one copy of the data; BigQuery is serverless and bills by data scanned or by reserved capacity. A **data lake** keeps raw files (Parquet, JSON) in object storage such as S3: cheap and open, but with no transactions or schema enforcement.",
            "The **lakehouse** adds a **table format** over the lake: Apache Iceberg, Delta Lake or Apache Hudi keep metadata files listing which data files form each snapshot of a table. That brings atomic commits, schema evolution, time travel to earlier snapshots, and lets several engines (Spark, Trino, Snowflake, DuckDB) read the same tables."
          ],
          uses: [
            "**Snowflake**: separates storage from compute, so many virtual warehouses query one copy of the data.",
            "**BigQuery**: serverless, billed by bytes scanned or by reserved capacity.",
            "**Databricks**: built the lakehouse around Delta Lake, and in 2024 bought Tabular, the company of Iceberg's creators.",
            "**AWS S3 Tables**: managed Apache Iceberg tables in S3; Snowflake and BigQuery also read and write Iceberg."
          ],
          example: "An Iceberg table `events` points at metadata version 41, which lists 3,000 Parquet files. A job writes 20 new files, then commits by swapping the catalogue pointer to version 42 in one atomic step: readers see all 20 files or none. A bad load is undone by rolling back to the snapshot in version 41. Spark, Trino and Snowflake all read the same files.",
          nuance: "Open formats reduce lock-in to storage, not to the catalogue, governance and compute around them. Many small files from streaming writes slow every query until compaction rewrites them.",
          read: [
            { label: "Armbrust, Ghodsi, Xin and Zaharia, Lakehouse (CIDR 2021): sections 1 to 3", url: "https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf", m: 30 },
            { label: "Apache Iceberg table spec: overview (snapshots, manifests, metadata)", url: "https://iceberg.apache.org/spec/", m: 20 }
          ],
          tags: ["snowflake", "bigquery", "databricks", "iceberg", "delta lake", "data lake", "s3", "table format"] },
        { id: "batch-stream", name: "Batch and stream processing",
          line: "Process a finished dataset in bulk, or an endless one as events arrive.",
          body: [
            "**Batch** jobs run over a bounded dataset (yesterday's orders) and produce a result: MapReduce introduced the pattern, Spark made it fast and is now the default. Batch is simple to reason about and rerun, with latency of minutes to hours. **Stream processing** runs continuously over an unbounded sequence of events, updating results within seconds: Apache Flink, Kafka Streams and Spark Structured Streaming are the main engines.",
            "Streams force a distinction batch can ignore: **event time** (when something happened) against **processing time** (when the system saw it). Results are grouped into **windows** by event time, and **watermarks** estimate when a window has seen all its events, since some arrive late."
          ],
          uses: [
            "**Apache Flink at Uber, Netflix and Alibaba**: runs streaming jobs for fraud scoring, live metrics and feature updates.",
            "**Spark**: the default batch engine for nightly reports, training sets and backfills, on Databricks, EMR and Dataproc.",
            "**Kafka Streams**: a library for stream processing inside ordinary Java services, with its state kept in RocksDB."
          ],
          example: "Count taxi rides per 5-minute window. A ride at 10:03 reaches the system at 10:07 because the phone was offline. By processing time it lands in the 10:05 window, wrongly; by event time it belongs to 10:00 to 10:05. That window closes when the watermark passes 10:05. If the ride arrives after that, it is late, and an allowed-lateness rule decides whether to update the result.",
          nuance: "Streaming costs more to build and operate than most teams expect. If an hourly batch meets the need, run the batch; when results must be right, plan how to reprocess history after a bug.",
          read: [
            { label: "Tyler Akidau, The world beyond batch: Streaming 101", url: "https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/", m: 30 },
            { label: "Apache Flink documentation: Timely stream processing (event time, watermarks)", url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/", m: 15 }
          ],
          tags: ["spark", "flink", "mapreduce", "event time", "watermark", "windowing", "kafka streams"] },
        { id: "etl-elt", name: "ETL and ELT",
          line: "Extract, transform, load; now usually load raw first and transform in the warehouse.",
          body: [
            "**ETL** extracts data from sources, transforms it on a separate server, and loads only the cleaned result into the warehouse. **ELT** loads raw data first and transforms it inside the warehouse with SQL, since warehouse compute became cheap and elastic. ELT keeps the raw history, so a fixed transformation can be rerun over everything.",
            "A typical stack: Fivetran or Airbyte extract and load from SaaS tools and databases; **dbt** turns SQL `SELECT` statements into tables and views in dependency order, with tests and documentation; an orchestrator such as Airflow or Dagster schedules it all. The layers are often named raw, staging and marts (or bronze, silver and gold)."
          ],
          uses: [
            "**dbt**: turns SQL `SELECT` statements into tables and views in dependency order, with tests; analytics engineering grew up around it.",
            "**Fivetran and Airbyte**: extract and load from SaaS tools and databases into the warehouse.",
            "**Airflow and Dagster**: orchestrators that schedule loads and transformations and retry failed steps.",
            "**Hightouch and Census**: reverse ETL, pushing warehouse results back into CRMs and ad tools."
          ],
          example: "Fivetran copies the raw Stripe `charges` table into Snowflake every hour. A dbt model `stg_charges` renames columns and converts cents to dollars; `fct_revenue` selects from it and groups by day. When the currency logic turns out to be wrong, you fix `stg_charges` and rebuild: the raw table still holds every charge since day one.",
          nuance: "ELT moves the mess into the warehouse, where it can grow without limit: hundreds of models nobody owns. Treat transformations as code: reviews, tests, and deleting models no one reads.",
          read: [{ label: "dbt documentation: What is dbt", url: "https://docs.getdbt.com/docs/introduction", m: 10 }],
          tags: ["etl", "elt", "dbt", "fivetran", "airbyte", "airflow", "dagster", "medallion"] }
      ] },
    { name: "Moving and trusting data", line: "Getting changes out of a database, keeping copies honest, and caching reads.",
      topics: [
        { id: "cdc", name: "Change data capture",
          line: "Read the database's own log and turn every committed change into an event.",
          body: [
            "Every database already writes each committed change to a log for its own recovery and replication: the write-ahead log in Postgres (exposed through logical replication), the binlog in MySQL. **Change data capture** reads that log and publishes each insert, update and delete as an event, usually to Kafka, in commit order. Downstream systems (a search index, a cache, a warehouse) stay in sync without the application writing to each of them.",
            "This avoids **dual writes**, where the application writes to the database and then to a queue, and a crash in between leaves them disagreeing. The **transactional outbox** pattern is the cousin: write the event to an outbox table in the same transaction, and let CDC publish it."
          ],
          uses: [
            "**Debezium**: the standard open-source CDC tool, running on Kafka Connect and reading the Postgres WAL or the MySQL binlog.",
            "**AWS DMS, Fivetran and Airbyte**: use CDC to keep warehouse copies in sync with production databases.",
            "**Shopify**: built the change feed from its sharded MySQL monolith on Debezium."
          ],
          example: "An app changes a product's price. With dual writes it updates Postgres, then publishes to Kafka, and if it crashes in between, search shows the old price for good. With CDC the app only updates Postgres. Debezium reads the committed change from the WAL and publishes an event with `op: u`, `before: {price: 20}` and `after: {price: 18}`; the search indexer consumes it.",
          nuance: "CDC events carry the table's physical schema, so a column rename upstream breaks consumers downstream. Publish a stable event contract (often through the outbox) rather than raw tables for anything other teams depend on.",
          read: [{ label: "Debezium documentation: Architecture", url: "https://debezium.io/documentation/reference/stable/architecture.html", m: 10 }],
          see: [
            { label: "System design guide: change data capture", href: "SYSTEM%20DESIGN.html#/patterns/consistency/cdc" },
            { label: "System design guide: transactional outbox", href: "SYSTEM%20DESIGN.html#/patterns/multi-step/outbox" }
          ],
          tags: ["cdc", "debezium", "wal", "binlog", "logical replication", "outbox", "dual writes"] },
        { id: "data-quality-lineage", name: "Data quality and lineage",
          line: "Tests that catch bad data before it is used, and a map of its origins.",
          body: [
            "Data breaks quietly: a source starts sending nulls, a join duplicates rows, a pipeline stops and a dashboard shows yesterday's numbers as today's. **Data quality** checks catch this with assertions run on every load: a key is unique and not null, values fall in an accepted set, row counts and freshness are within bounds, and foreign keys match. **Data contracts** push the agreement upstream, so producers cannot change a schema without notice.",
            "**Lineage** records which jobs read which datasets and wrote which others, as a graph. When a number looks wrong, lineage shows every upstream table it depends on; when a source changes, it shows every downstream report affected."
          ],
          uses: [
            "**dbt tests**: `unique`, `not_null`, `accepted_values` and `relationships` run on every build, the most common checks.",
            "**Great Expectations and Soda**: standalone data validation tools; Monte Carlo sells data observability.",
            "**OpenLineage**: the open standard for lineage events, emitted by Airflow, Spark and dbt integrations."
          ],
          example: "A source system starts sending `country = 'UK'` instead of `'GB'`. Without checks, revenue by country quietly splits in two on the dashboard. An `accepted_values` test on `country` fails on the next load and stops the models downstream. Lineage then shows the three dashboards and one ML feature that read the column, so you know whom to warn.",
          nuance: "Tests at the end of the pipeline only find problems after they happened. Put the strictest checks where data enters, and alert on freshness, the failure dashboards hide best.",
          read: [
            { label: "dbt documentation: Add data tests to your DAG", url: "https://docs.getdbt.com/docs/build/data-tests", m: 15 },
            { label: "OpenLineage: an open standard for lineage metadata", url: "https://openlineage.io/", m: 10 }
          ],
          tags: ["data quality", "lineage", "data contracts", "freshness", "openlineage", "great expectations"] },
        { id: "caching", name: "Caching",
          line: "Keep a copy of hot data in memory, and decide how it goes stale.",
          body: [
            "A cache stores the result of an expensive read so the next one is cheap. **Cache-aside** (lazy loading) is the default: read the cache, and on a miss read the database and fill the cache. **Write-through** updates the cache on every write. Every entry gets a **TTL** so stale data eventually disappears even if invalidation misses it.",
            "The two classic failures: **invalidation** (the database changed and the cache did not), and the **stampede** (a hot key expires and thousands of requests hit the database at once). Fixes for the stampede are request coalescing, so one request refills while others wait, and refreshing hot keys before they expire."
          ],
          uses: [
            "**Redis, Valkey and Memcached**: the standard in-memory caches; Valkey is the open-source fork made after Redis changed its licence in 2024.",
            "**Facebook's memcache**: the best-documented large cache fleet, using leases to stop stampedes and stale sets.",
            "**Cloudflare and Fastly**: CDNs that cache whole responses at the edge, close to users.",
            "**LLM prompt caching**: providers reuse the computed state of a repeated prompt prefix, cutting cost and time to first token."
          ],
          example: "A product page reads `product:55` from Redis. On a miss it queries Postgres (20 ms), stores the result with a 300 s TTL, and returns. Reads for the next five minutes cost under a millisecond. When the price changes, the writer deletes `product:55` and the next read refills it. If 5,000 requests miss at once after expiry, a lock per key lets one refill while the rest wait.",
          nuance: "A cache hides load until it fails, and then the database receives traffic it was never sized for. Know what happens with an empty cache before relying on one.",
          read: [
            { label: "AWS, Caching best practices (lazy caching, write-through, TTLs, thundering herd)", url: "https://aws.amazon.com/caching/best-practices/", m: 15 },
            { label: "Nishtala et al., Scaling Memcache at Facebook (NSDI 2013): sections 3 and 4", url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf", m: 40 }
          ],
          see: [
            { label: "System design guide: cache-aside (Redis)", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/cache-aside" },
            { label: "System design guide: cache invalidation", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/invalidation" }
          ],
          tags: ["redis", "valkey", "memcached", "cache-aside", "ttl", "invalidation", "stampede", "thundering herd"] }
      ] }
  ],
  see: [
    { label: "System design guide", href: "SYSTEM%20DESIGN.html" }
  ]
});
