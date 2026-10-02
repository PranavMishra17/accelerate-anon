/* What to read and watch for each topic in the data field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("data", {
 "relational-sql": [
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
