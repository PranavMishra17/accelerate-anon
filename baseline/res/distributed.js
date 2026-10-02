/* What to read and watch for each topic in the distributed field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("distributed", {
 "why-distribute": [
  {
   "kind": "video",
   "req": true,
   "label": "Distributed Systems 1.1: Introduction",
   "url": "https://www.youtube.com/watch?v=UEAMfLPZZhE",
   "m": 15,
   "why": "Why we distribute, and what it costs.",
   "yt": {
    "id": "UEAMfLPZZhE",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kleppmann, Distributed systems (Cambridge notes): section 1, About distributed systems",
   "url": "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf",
   "m": 20,
   "why": "Section 1 of the course notes."
  }
 ],
 "partial-failure": [
  {
   "kind": "video",
   "req": true,
   "label": "Distributed Systems 2.1: The two generals problem",
   "url": "https://www.youtube.com/watch?v=MDuWnzVnfpI",
   "m": 12,
   "why": "Why a silent peer cannot be told apart from a slow one.",
   "yt": {
    "id": "MDuWnzVnfpI",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Wikipedia, Fallacies of distributed computing",
   "url": "https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing",
   "m": 8,
   "why": "The eight fallacies, each one a way to be surprised."
  }
 ],
 "clocks-ordering": [
  {
   "kind": "video",
   "req": true,
   "label": "Distributed Systems 3.1: Physical time",
   "url": "https://www.youtube.com/watch?v=FQ_2N3AQu0M",
   "m": 21,
   "why": "Why wall clocks drift and jump.",
   "yt": {
    "id": "FQ_2N3AQu0M",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "video",
   "req": true,
   "label": "Distributed Systems 4.1: Logical time",
   "url": "https://www.youtube.com/watch?v=x-D8iFU1d-o",
   "m": 25,
   "why": "Lamport and vector clocks: ordering by causality.",
   "yt": {
    "id": "x-D8iFU1d-o",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kleppmann, Distributed systems (Cambridge notes): sections 3 and 4, clocks and logical time",
   "url": "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf",
   "m": 40,
   "why": "Sections 3 and 4 of the notes, in text."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Leslie Lamport, Time, clocks, and the ordering of events in a distributed system (1978)",
   "url": "https://lamport.azurewebsites.net/pubs/time-clocks.pdf",
   "m": 40,
   "why": "The original paper on happened-before."
  }
 ],
 "replication-leader": [
  {
   "kind": "keep",
   "src": "book",
   "req": false,
   "label": "DDIA, 2e: ch. 6 Replication",
   "book": "DDIA, 2e: ch. 6 Replication",
   "m": 60,
   "why": "The chapter this topic follows."
  },
  {
   "kind": "video",
   "req": true,
   "label": "Single leader replication: how it works",
   "url": "https://www.youtube.com/watch?v=8h-a7TsXw28",
   "m": 13,
   "why": "How the leader streams changes and what failover breaks.",
   "yt": {
    "id": "8h-a7TsXw28",
    "ch": "Jordan has no life"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Replication summarized in 9 minutes",
   "url": "https://www.youtube.com/watch?v=uvRcYQ8fdMs",
   "m": 10,
   "why": "A recap of all three replication styles.",
   "yt": {
    "id": "uvRcYQ8fdMs",
    "ch": "Jordan has no life"
   }
  }
 ],
 "multi-leader": [
  {
   "kind": "keep",
   "src": "book",
   "req": false,
   "label": "DDIA, 2e: ch. 6 Replication (multi-leader and conflicts)",
   "book": "DDIA, 2e: ch. 6 Replication (multi-leader and conflicts)",
   "m": 30,
   "why": "The chapter this topic follows."
  },
  {
   "kind": "video",
   "req": true,
   "label": "Multi leader replication: chaos",
   "url": "https://www.youtube.com/watch?v=tffuvQtiTwY",
   "m": 14,
   "why": "Why several writers mean conflicts, and how to resolve them.",
   "yt": {
    "id": "tffuvQtiTwY",
    "ch": "Jordan has no life"
   }
  }
 ],
 "leaderless-quorums": [
  {
   "kind": "video",
   "req": true,
   "label": "Leaderless replication introduction",
   "url": "https://www.youtube.com/watch?v=Jy4Cm2WEZVg",
   "m": 11,
   "why": "Writing to many replicas with no leader.",
   "yt": {
    "id": "Jy4Cm2WEZVg",
    "ch": "Jordan has no life"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Quorums: leaderless replication continued",
   "url": "https://www.youtube.com/watch?v=DAONthD50g0",
   "m": 11,
   "why": "Quorums: why w plus r over n finds the latest write.",
   "yt": {
    "id": "DAONthD50g0",
    "ch": "Jordan has no life"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "DeCandia et al., Dynamo: Amazon's highly available key-value store (SOSP 2007): sections 4.1 to 4.7",
   "url": "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
   "m": 45,
   "why": "The Dynamo paper: sloppy quorums, hinted handoff, read repair."
  }
 ],
 "consistency-models": [
  {
   "kind": "video",
   "req": true,
   "label": "Distributed Systems 7.2: Linearizability",
   "url": "https://www.youtube.com/watch?v=noUNH3jDLC0",
   "m": 19,
   "why": "What linearizability promises and how it differs from weaker models.",
   "yt": {
    "id": "noUNH3jDLC0",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Distributed Systems 7.3: Eventual consistency",
   "url": "https://www.youtube.com/watch?v=9uCP3qHNbWw",
   "m": 15,
   "why": "Eventual consistency and what readers can see.",
   "yt": {
    "id": "9uCP3qHNbWw",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kyle Kingsbury, Strong consistency models",
   "url": "https://aphyr.com/posts/313-strong-consistency-models",
   "m": 25,
   "why": "A tour of the models with examples."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Jepsen, Consistency models (the clickable map)",
   "url": "https://jepsen.io/consistency",
   "m": 15,
   "why": "Jepsen's map of how the models relate."
  }
 ],
 "cap-pacelc": [
  {
   "kind": "video",
   "req": true,
   "label": "CAP theorem simplified",
   "url": "https://www.youtube.com/watch?v=BHqjEjzAicA",
   "m": 6,
   "why": "CAP in plain terms before the objections.",
   "yt": {
    "id": "BHqjEjzAicA",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Martin Kleppmann, Please stop calling databases CP or AP",
   "url": "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html",
   "m": 15,
   "why": "Why CP and AP are the wrong labels."
  },
  {
   "kind": "video",
   "req": false,
   "label": "PACELC theorem: beyond the CAP theorem",
   "url": "https://www.youtube.com/watch?v=rVF0Oi_R84Q",
   "m": 11,
   "why": "The latency case that PACELC adds.",
   "yt": {
    "id": "rVF0Oi_R84Q",
    "ch": "Tech Primers"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Daniel Abadi, Consistency tradeoffs in modern distributed database system design (IEEE Computer, 2012)",
   "url": "https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf",
   "m": 25,
   "why": "The paper that introduced PACELC."
  }
 ],
 "consensus-raft": [
  {
   "kind": "video",
   "req": true,
   "label": "Understand Raft without breaking your brain",
   "url": "https://www.youtube.com/watch?v=IujMVjKvWP4",
   "m": 9,
   "why": "Leader election and log replication, step by step.",
   "yt": {
    "id": "IujMVjKvWP4",
    "ch": "ankush"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "The secret lives of data: Raft, an animated walkthrough",
   "url": "https://thesecretlivesofdata.com/raft/",
   "m": 10,
   "why": "An animated walkthrough you can click through."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Distributed Systems 6.2: Raft",
   "url": "https://www.youtube.com/watch?v=uXEYuDwm7e4",
   "m": 39,
   "why": "A full lecture on Raft; watch the election and log parts.",
   "yt": {
    "id": "uXEYuDwm7e4",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Ongaro and Ousterhout, In search of an understandable consensus algorithm (Raft), sections 5.1 to 5.4",
   "url": "https://raft.github.io/raft.pdf",
   "m": 45,
   "why": "The Raft paper; sections 5 and 8 first."
  }
 ],
 "leases-fencing": [
  {
   "kind": "read",
   "req": true,
   "label": "Martin Kleppmann, How to do distributed locking",
   "url": "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html",
   "m": 20,
   "why": "The argument for fencing tokens over timing assumptions."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Distributed locking: systems design interview questions",
   "url": "https://www.youtube.com/watch?v=Lp8oITg0MiI",
   "m": 29,
   "why": "Lock design in practice; watch the part on fencing tokens.",
   "yt": {
    "id": "Lp8oITg0MiI",
    "ch": "Jordan has no life"
   }
  }
 ],
 "two-phase-commit": [
  {
   "kind": "video",
   "req": true,
   "label": "Two phase commit: distributed transactions",
   "url": "https://www.youtube.com/watch?v=7DoT2sTGulc",
   "m": 9,
   "why": "Prepare, commit, and why a crashed coordinator blocks everyone.",
   "yt": {
    "id": "7DoT2sTGulc",
    "ch": "Jordan has no life"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Distributed Systems 7.1: Two-phase commit",
   "url": "https://www.youtube.com/watch?v=-_rdWB9hN1c",
   "m": 19,
   "why": "The same protocol with the failure cases.",
   "yt": {
    "id": "-_rdWB9hN1c",
    "ch": "Martin Kleppmann"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kleppmann, Distributed systems (Cambridge notes): section 7.1, Two-phase commit",
   "url": "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf",
   "m": 15,
   "why": "Section 7.1 of the notes."
  }
 ],
 "sharding": [
  {
   "kind": "keep",
   "src": "book",
   "req": false,
   "label": "DDIA, 2e: ch. 7 Sharding",
   "book": "DDIA, 2e: ch. 7 Sharding",
   "m": 50,
   "why": "The chapter this topic follows."
  },
  {
   "kind": "video",
   "req": true,
   "label": "Introduction to partitioning",
   "url": "https://www.youtube.com/watch?v=Bt8ZMC_Yuys",
   "m": 11,
   "why": "Splitting data by key, and the hot spot problem.",
   "yt": {
    "id": "Bt8ZMC_Yuys",
    "ch": "Jordan has no life"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Database sharding and partitioning",
   "url": "https://www.youtube.com/watch?v=wXvljefXyEo",
   "m": 24,
   "why": "Partitioning schemes in more depth.",
   "yt": {
    "id": "wXvljefXyEo",
    "ch": "Arpit Bhayani"
   }
  }
 ],
 "consistent-hashing": [
  {
   "kind": "video",
   "req": true,
   "label": "Consistent hashing: algorithms you should know",
   "url": "https://www.youtube.com/watch?v=UF9Iqmg94tk",
   "m": 9,
   "why": "The ring and virtual nodes, drawn step by step.",
   "yt": {
    "id": "UF9Iqmg94tk",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "What is consistent hashing and where is it used?",
   "url": "https://www.youtube.com/watch?v=zaRkONvyGr8",
   "m": 11,
   "why": "A second explanation with where it is used.",
   "yt": {
    "id": "zaRkONvyGr8",
    "ch": "Gaurav Sen"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Wikipedia, Consistent hashing",
   "url": "https://en.wikipedia.org/wiki/Consistent_hashing",
   "m": 12,
   "why": "A reference for the algorithm and its variants."
  }
 ],
 "logs-queues": [
  {
   "kind": "video",
   "req": true,
   "label": "Apache Kafka fundamentals you should know",
   "url": "https://www.youtube.com/watch?v=-RDyEFvnTXI",
   "m": 5,
   "why": "Topics, partitions and consumer groups in Kafka.",
   "yt": {
    "id": "-RDyEFvnTXI",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Kafka vs RabbitMQ vs messaging middleware vs Pulsar",
   "url": "https://www.youtube.com/watch?v=x4k1XEjNzYQ",
   "m": 5,
   "why": "How a queue and a log differ in practice.",
   "yt": {
    "id": "x4k1XEjNzYQ",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Apache Kafka documentation: Design (persistence, the consumer, delivery semantics, replication)",
   "url": "https://kafka.apache.org/42/design/design/",
   "m": 40,
   "why": "Kafka's design page: persistence and delivery guarantees."
  }
 ],
 "exactly-once": [
  {
   "kind": "video",
   "req": true,
   "label": "Idempotency: what it is and how to implement it",
   "url": "https://www.youtube.com/watch?v=XAccGbtl3Z8",
   "m": 9,
   "why": "Making a retried request safe with idempotency.",
   "yt": {
    "id": "XAccGbtl3Z8",
    "ch": "Alex Hyett"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Brandur Leach, Implementing Stripe-like idempotency keys in Postgres",
   "url": "https://brandur.org/idempotency-keys",
   "m": 30,
   "why": "Idempotency keys implemented in Postgres."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Apache Kafka transactions: message delivery and exactly-once semantics",
   "url": "https://www.youtube.com/watch?v=Ki2D2o9aVl8",
   "m": 15,
   "why": "How Kafka's transactions build exactly-once on top.",
   "yt": {
    "id": "Ki2D2o9aVl8",
    "ch": "Confluent, an IBM Company"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Confluent, Exactly-once semantics are possible: here's how Kafka does it",
   "url": "https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/",
   "m": 20,
   "why": "How Kafka does exactly-once."
  }
 ],
 "load-shedding": [
  {
   "kind": "video",
   "req": true,
   "label": "Backpressure in software development",
   "url": "https://www.youtube.com/watch?v=3DTSIlj72Qs",
   "m": 9,
   "why": "A fast producer, a slow consumer, and the ways out.",
   "yt": {
    "id": "3DTSIlj72Qs",
    "ch": "Software Developer Diaries"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Rate limiting vs load shedding",
   "url": "https://www.youtube.com/watch?v=JAWgpC-NaW8",
   "m": 12,
   "why": "Where rate limiting ends and shedding begins.",
   "yt": {
    "id": "JAWgpC-NaW8",
    "ch": "Tech Primers"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google SRE book, ch. 21 Handling overload",
   "url": "https://sre.google/sre-book/handling-overload/",
   "m": 25,
   "why": "Google's account of overload handling."
  }
 ],
 "tail-latency": [
  {
   "kind": "video",
   "req": true,
   "label": "Percentile tail latency explained (95%, 99%)",
   "url": "https://www.youtube.com/watch?v=3JdQOExKtUY",
   "m": 7,
   "why": "Why the mean hides the slow requests.",
   "yt": {
    "id": "3JdQOExKtUY",
    "ch": "Hussein Nasser"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Jeffrey Dean and Luiz Andre Barroso, The tail at scale (CACM, 2013)",
   "url": "https://research.google/pubs/the-tail-at-scale/",
   "m": 30,
   "why": "Why fan-out makes the tail everyone's problem."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How NOT to measure latency",
   "url": "https://www.youtube.com/watch?v=lJ8ydIuPFeU",
   "m": 43,
   "why": "The classic talk on coordinated omission; watch the first 15 minutes.",
   "yt": {
    "id": "lJ8ydIuPFeU",
    "ch": "Strange Loop Conference"
   }
  }
 ]
});
