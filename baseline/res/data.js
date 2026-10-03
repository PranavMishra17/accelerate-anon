/* What to read and watch for each topic in the data field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("data", {
 "relational-sql": [
  {
   "kind": "video",
   "req": true,
   "label": "6 SQL Joins you MUST know! (Animated + Practice)",
   "url": "https://www.youtube.com/watch?v=Yh4CrPHVBdE",
   "m": 10,
   "yt": {
    "id": "Yh4CrPHVBdE",
    "ch": "Anton Putra"
   },
   "why": "The six joins drawn out, with practice queries."
  },
  {
   "kind": "video",
   "req": false,
   "label": "SQL Joins Explained",
   "url": "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
   "m": 11,
   "yt": {
    "id": "9yeOJ0ZMUYw",
    "ch": "Socratica"
   },
   "why": "A second pass on joins with clear examples."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Zi Chong Kao, Select Star SQL: an interactive book on a real dataset",
   "url": "https://selectstarsql.com/",
   "m": 90,
   "why": "Learn SQL by querying a real dataset; do the first chapters."
  }
 ],
 "indexes": [
  {
   "kind": "video",
   "req": true,
   "label": "How do B-Tree Indexes work?",
   "url": "https://www.youtube.com/watch?v=Z2OaqmxiH20",
   "m": 10,
   "yt": {
    "id": "Z2OaqmxiH20",
    "ch": "Jordan has no life"
   },
   "why": "How a B-tree lookup reads a few pages."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Understanding B-Trees: The Data Structure Behind Modern Databases",
   "url": "https://www.youtube.com/watch?v=K1a2Bk8NrYQ",
   "m": 13,
   "yt": {
    "id": "K1a2Bk8NrYQ",
    "ch": "Spanning Tree"
   },
   "why": "The B-tree itself: node splits and why depth stays small."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Markus Winand, Use the Index, Luke: chapter 1, Anatomy of an index",
   "url": "https://use-the-index-luke.com/",
   "m": 20,
   "why": "How a B-tree lookup reads a few pages, drawn out."
  },
  {
   "kind": "read",
   "req": false,
   "label": "PostgreSQL documentation: Index types",
   "url": "https://www.postgresql.org/docs/current/indexes-types.html",
   "m": 10,
   "why": "B-tree, hash, GIN and BRIN: which fits which query."
  }
 ],
 "lsm-trees": [
  {
   "kind": "video",
   "req": true,
   "label": "The Secret Sauce Behind NoSQL: LSM Tree",
   "url": "https://www.youtube.com/watch?v=I6jB0nM9SKU",
   "m": 8,
   "yt": {
    "id": "I6jB0nM9SKU",
    "ch": "ByteByteGo"
   },
   "why": "Memtable, SSTables and compaction in a few minutes."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LSM Tree + SSTable Database Indexes",
   "url": "https://www.youtube.com/watch?v=ciGAVER_erw",
   "m": 16,
   "yt": {
    "id": "ciGAVER_erw",
    "ch": "Jordan has no life"
   },
   "why": "The write path and read path of an LSM tree in detail."
  },
  {
   "kind": "read",
   "req": true,
   "label": "RocksDB wiki: RocksDB overview (memtable, SST files, compaction)",
   "url": "https://github.com/facebook/rocksdb/wiki/RocksDB-Overview",
   "m": 25,
   "why": "Memtable, SST files and compaction in one real engine."
  }
 ],
 "transactions-isolation": [
  {
   "kind": "video",
   "req": true,
   "label": "Transaction Isolation Levels With PostgreSQL as an example",
   "url": "https://www.youtube.com/watch?v=G8wDjV0N9tk",
   "m": 9,
   "yt": {
    "id": "G8wDjV0N9tk",
    "ch": "mkdev"
   },
   "why": "Each isolation level run in real Postgres sessions."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Isolation Levels in Database Management Systems",
   "url": "https://www.youtube.com/watch?v=-gxyut1VLcs",
   "m": 11,
   "yt": {
    "id": "-gxyut1VLcs",
    "ch": "Edredo for Learners"
   },
   "why": "The anomalies each level allows, with examples."
  },
  {
   "kind": "read",
   "req": true,
   "label": "PostgreSQL documentation: Transaction isolation",
   "url": "https://www.postgresql.org/docs/current/transaction-iso.html",
   "m": 25,
   "why": "Each isolation level, and the anomaly it allows."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Martin Kleppmann, Hermitage: testing what isolation levels really do in each database",
   "url": "https://github.com/ept/hermitage",
   "m": 15,
   "why": "Run the same anomaly against many databases."
  }
 ],
 "normalisation": [
  {
   "kind": "video",
   "req": true,
   "label": "Data Normalization vs Denormalization: Which is better when?",
   "url": "https://www.youtube.com/watch?v=W_5vn8TBLys",
   "m": 13,
   "yt": {
    "id": "W_5vn8TBLys",
    "ch": "IT k Funde"
   },
   "why": "When to normalise and when to copy data on purpose."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Learn Database Normalization: 1NF, 2NF, 3NF, 4NF, 5NF",
   "url": "https://www.youtube.com/watch?v=GFQaEYEc8_8",
   "m": 29,
   "yt": {
    "id": "GFQaEYEc8_8",
    "ch": "Decomplexify"
   },
   "why": "The normal forms with examples; watch up to third normal form."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Wikipedia, Database normalization",
   "url": "https://en.wikipedia.org/wiki/Database_normalization",
   "m": 15,
   "why": "The normal forms with examples."
  }
 ],
 "document-kv": [
  {
   "kind": "video",
   "req": true,
   "label": "7 Database Paradigms",
   "url": "https://www.youtube.com/watch?v=W2Z7fbCLSTw",
   "m": 10,
   "yt": {
    "id": "W2Z7fbCLSTw",
    "ch": "Fireship"
   },
   "why": "Document, key-value and the other database shapes in ten minutes."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How do NoSQL databases work? Simply Explained!",
   "url": "https://www.youtube.com/watch?v=0buKQHokLK8",
   "m": 8,
   "yt": {
    "id": "0buKQHokLK8",
    "ch": "Simply Explained"
   },
   "why": "How non-relational stores hold data and why they scale."
  },
  {
   "kind": "keep",
   "src": "book",
   "req": true,
   "label": "DDIA, 2e: ch. 3 Data Models → Relational Model Versus Document Model",
   "m": 45,
   "why": "The section on relational against document models.",
   "book": "DDIA, 2e: ch. 3 Data Models → Relational Model Versus Document Model"
  }
 ],
 "wide-column": [
  {
   "kind": "video",
   "req": true,
   "label": "Cassandra in 100 Seconds",
   "url": "https://www.youtube.com/watch?v=ziq7FUKpCS8",
   "m": 3,
   "yt": {
    "id": "ziq7FUKpCS8",
    "ch": "Fireship"
   },
   "why": "What Cassandra is and its partition and clustering model."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Cassandra Deep Dive",
   "url": "https://www.youtube.com/watch?v=TD3-INhm60Q",
   "m": 30,
   "yt": {
    "id": "TD3-INhm60Q",
    "ch": "Hello Interview"
   },
   "why": "Cassandra write path and data modelling; watch the architecture part."
  },
  {
   "kind": "keep",
   "src": "book",
   "req": true,
   "label": "DDIA, 2e: ch. 4 Storage and Retrieval → Log-Structured Storage → SSTables and LSM-Trees",
   "m": 40,
   "why": "How SSTables and LSM trees give heavy-write stores.",
   "book": "DDIA, 2e: ch. 4 Storage and Retrieval → Log-Structured Storage → SSTables and LSM-Trees"
  }
 ],
 "graph-db": [
  {
   "kind": "video",
   "req": true,
   "label": "What is a graph database? (in 10 minutes)",
   "url": "https://www.youtube.com/watch?v=REVkXVxvMQE",
   "m": 11,
   "yt": {
    "id": "REVkXVxvMQE",
    "ch": "Neo4j"
   },
   "why": "Nodes, relationships and when a graph beats joins."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Neo4j in 100 Seconds",
   "url": "https://www.youtube.com/watch?v=T6L9EoBy8Zk",
   "m": 3,
   "yt": {
    "id": "T6L9EoBy8Zk",
    "ch": "Fireship"
   },
   "why": "A fast look at a graph query language."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Neo4j, Getting started: what is a graph database",
   "url": "https://neo4j.com/docs/getting-started/graph-database/",
   "m": 10,
   "why": "Nodes, relationships and properties, and when a graph beats joins."
  }
 ],
 "vector-db": [
  {
   "kind": "video",
   "req": true,
   "label": "Vector Database Search: Hierarchical Navigable Small Worlds (HNSW) Explained",
   "url": "https://www.youtube.com/watch?v=77QH0Y2PYKg",
   "m": 9,
   "yt": {
    "id": "77QH0Y2PYKg",
    "ch": "DataMListic"
   },
   "why": "How HNSW finds nearest neighbours through layered graphs."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What is a Vector Database? Powering Semantic Search and AI Applications",
   "url": "https://www.youtube.com/watch?v=gl1r1XV0SLw",
   "m": 10,
   "yt": {
    "id": "gl1r1XV0SLw",
    "ch": "IBM Technology"
   },
   "why": "What a vector database stores and what it is used for."
  },
  {
   "kind": "read",
   "req": true,
   "label": "pgvector README: HNSW and IVFFlat indexes, and filtering",
   "url": "https://github.com/pgvector/pgvector",
   "m": 20,
   "why": "HNSW against IVFFlat, and filtered search, in a real extension."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Pinecone, Hierarchical navigable small worlds (HNSW)",
   "url": "https://www.pinecone.io/learn/series/faiss/hnsw/",
   "m": 25,
   "why": "A longer walk through HNSW."
  }
 ],
 "oltp-olap": [
  {
   "kind": "video",
   "req": true,
   "label": "OLAP vs OLTP",
   "url": "https://www.youtube.com/watch?v=iw-5kFzIdgY",
   "m": 6,
   "yt": {
    "id": "iw-5kFzIdgY",
    "ch": "IBM Technology"
   },
   "why": "Transactions against analytics in six minutes."
  },
  {
   "kind": "video",
   "req": false,
   "label": "OLTP vs OLAP and the row / column storage tradeoff",
   "url": "https://www.youtube.com/watch?v=wdJejI0bZRQ",
   "m": 18,
   "yt": {
    "id": "wdJejI0bZRQ",
    "ch": "Ben Dicken"
   },
   "why": "Why row storage suits OLTP and column storage suits OLAP."
  },
  {
   "kind": "read",
   "req": true,
   "label": "ClickHouse documentation: Why is ClickHouse so fast",
   "url": "https://clickhouse.com/docs/concepts/why-clickhouse-is-so-fast",
   "m": 15,
   "why": "Why column storage and vectorised scans make analytics fast."
  }
 ],
 "warehouses-lakehouses": [
  {
   "kind": "video",
   "req": true,
   "label": "Data Lake vs. Data Warehouse vs. Data Lakehouse: Which One to Choose?",
   "url": "https://www.youtube.com/watch?v=PQFWQmL3fLY",
   "m": 8,
   "yt": {
    "id": "PQFWQmL3fLY",
    "ch": "IBM Technology"
   },
   "why": "Warehouse, lake and lakehouse side by side, and what each trades away."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Apache Iceberg: What It Is and Why Everyone’s Talking About It.",
   "url": "https://www.youtube.com/watch?v=TsmhRZElPvM",
   "m": 14,
   "yt": {
    "id": "TsmhRZElPvM",
    "ch": "Confluent Developer"
   },
   "why": "What an Iceberg table adds to files on object storage: snapshots and transactions."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Armbrust, Ghodsi, Xin and Zaharia, Lakehouse (CIDR 2021): sections 1 to 3",
   "url": "https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf",
   "m": 30,
   "why": "Why warehouse and lake merged; sections 1 to 3."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Apache Iceberg table spec: overview (snapshots, manifests, metadata)",
   "url": "https://iceberg.apache.org/spec/",
   "m": 20,
   "why": "Snapshots and manifests: how a table is files plus metadata."
  }
 ],
 "batch-stream": [
  {
   "kind": "video",
   "req": true,
   "label": "Event Time and Watermarks | Apache Flink 101",
   "url": "https://www.youtube.com/watch?v=sdhwpUAjqaI",
   "m": 12,
   "yt": {
    "id": "sdhwpUAjqaI",
    "ch": "Confluent, an IBM Company"
   },
   "why": "Event time against processing time, and how watermarks decide when a window closes."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Batch Processing vs Stream Processing | System Design Primer | Tech Primers",
   "url": "https://www.youtube.com/watch?v=A3Mvy8WMk04",
   "m": 14,
   "yt": {
    "id": "A3Mvy8WMk04",
    "ch": "Tech Primers"
   },
   "why": "Bounded against unbounded data, and when each model fits."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Tyler Akidau, The world beyond batch: Streaming 101",
   "url": "https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/",
   "m": 30,
   "why": "Event time against processing time, and windows."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Apache Flink documentation: Timely stream processing (event time, watermarks)",
   "url": "https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/",
   "m": 15,
   "why": "Watermarks in a real engine."
  }
 ],
 "etl-elt": [
  {
   "kind": "video",
   "req": true,
   "label": "ETL vs ELT: Powering Data Pipelines for AI & Analytics",
   "url": "https://www.youtube.com/watch?v=KIv2Na2-u24",
   "m": 7,
   "yt": {
    "id": "KIv2Na2-u24",
    "ch": "IBM Technology"
   },
   "why": "Where the transform runs in each approach, and why cheap warehouse compute tipped it to ELT."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What Is DBT and Why Is It So Popular -  Intro To Data Infrastructure Part 3",
   "url": "https://www.youtube.com/watch?v=8FZZivIfJVo",
   "m": 10,
   "yt": {
    "id": "8FZZivIfJVo",
    "ch": "Seattle Data Guy"
   },
   "why": "What dbt does in the ELT stack: SQL models run in the warehouse in dependency order."
  },
  {
   "kind": "read",
   "req": true,
   "label": "dbt documentation: What is dbt",
   "url": "https://docs.getdbt.com/docs/introduction",
   "m": 10,
   "why": "Transform inside the warehouse with tested SQL models."
  }
 ],
 "cdc": [
  {
   "kind": "video",
   "req": true,
   "label": "Change Data Capture (CDC) Explained (with examples)",
   "url": "https://www.youtube.com/watch?v=5KN_feUhtTM",
   "m": 9,
   "yt": {
    "id": "5KN_feUhtTM",
    "ch": "Irtiza Hafiz"
   },
   "why": "Reading the database log and publishing each change, with examples."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Debezium - Change Data Capture Made Easy | Distributed Systems Deep Dives With Ex-Google SWE",
   "url": "https://www.youtube.com/watch?v=6VbRlQ0rL3I",
   "m": 16,
   "yt": {
    "id": "6VbRlQ0rL3I",
    "ch": "Jordan has no life"
   },
   "why": "How Debezium reads the log and what ordering and snapshots look like in practice."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Debezium documentation: Architecture",
   "url": "https://debezium.io/documentation/reference/stable/architecture.html",
   "m": 10,
   "why": "Reading the database log into Kafka, end to end."
  }
 ],
 "data-quality-lineage": [
  {
   "kind": "video",
   "req": true,
   "label": "Data Quality Explained",
   "url": "https://www.youtube.com/watch?v=5HcDJ8e9NwY",
   "m": 4,
   "yt": {
    "id": "5HcDJ8e9NwY",
    "ch": "IBM Technology"
   },
   "why": "The kinds of data quality checks and what each one catches."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Data Lineage (Data Architecture | Data Governance)",
   "url": "https://www.youtube.com/watch?v=a4HPjtRHaHk",
   "m": 9,
   "yt": {
    "id": "a4HPjtRHaHk",
    "ch": "Software Architecture Academy"
   },
   "why": "What lineage records and how it traces a bad number back to its source."
  },
  {
   "kind": "read",
   "req": true,
   "label": "dbt documentation: Add data tests to your DAG",
   "url": "https://docs.getdbt.com/docs/build/data-tests",
   "m": 15,
   "why": "Tests that fail a pipeline before bad data spreads."
  },
  {
   "kind": "read",
   "req": false,
   "label": "OpenLineage: an open standard for lineage metadata",
   "url": "https://openlineage.io/",
   "m": 10,
   "why": "The open standard for recording where data came from."
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
   "why": "Stampede, invalidation and the other ways a cache hurts you."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Basic Caching Techniques Explained - Spatial, Temporal, Distributed, Write-Through, Write-Back,Aside",
   "url": "https://www.youtube.com/watch?v=ccemOqDrc2I",
   "m": 10,
   "yt": {
    "id": "ccemOqDrc2I",
    "ch": "Hussein Nasser"
   },
   "why": "Cache-aside, write-through and write-back compared."
  },
  {
   "kind": "read",
   "req": true,
   "label": "AWS, Caching best practices (lazy caching, write-through, TTLs, thundering herd)",
   "url": "https://aws.amazon.com/caching/best-practices/",
   "m": 15,
   "why": "Lazy caching, write-through, TTLs and the thundering herd."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Nishtala et al., Scaling Memcache at Facebook (NSDI 2013): sections 3 and 4",
   "url": "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf",
   "m": 40,
   "why": "Memcache at Facebook scale; sections 3 and 4 only."
  }
 ]
});
