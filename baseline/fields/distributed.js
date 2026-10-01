BASELINE.field({
  id: "distributed", name: "Distributed systems", short: "Distributed", layer: "Foundations",
  ink: "#3E6A73", inkDark: "#93C3CC",
  lede: "What changes when one program runs on many machines that share nothing but an unreliable network: copies that disagree, clocks that drift, and failures that are only partial.",
  overview: [
    "A distributed system is any system whose state lives on more than one machine: a database with replicas, a sharded key-value store, a Kafka cluster, a fleet of stateless services behind a load balancer talking to all of them. The field is about keeping those machines giving one sensible answer when messages are lost, delayed or duplicated, when nodes pause or crash, and when no two clocks agree. People who work on it are called distributed systems, storage, infrastructure or platform engineers, and they build the databases, queues and coordination services that product engineers use without thinking about them.",
    "It sits on systems fundamentals (networking, processes, disks) and under almost everything else. Data engineering is distributed systems with a schema; cloud is renting it; backend design interviews are mostly this field in disguise. In 2026 few teams build consensus or replication themselves: they choose Postgres with replicas, DynamoDB, Spanner, CockroachDB or Kafka, and the skill is knowing what each guarantees and what it does not. Agent platforms have brought the old problems back: durable workflows, leases on work items, and retries that must not run a tool twice.",
    "Read the clusters in order. The first explains why the problems exist; the second is about copies of data and what readers see; the third is about getting machines to agree; the fourth is about splitting work and surviving load. The honest answer to most questions in this field starts with 'it depends on what you need to be true when the network fails'."
  ],
  diagram: {
    nodes: [
      { id: "client", label: "Client", sub: "a write with a key", col: 0, row: 0 },
      { id: "consistent-hashing", label: "Consistent hashing", sub: "which shard owns the key", col: 0, row: 1 },
      { id: "sharding", label: "Shard", sub: "one slice of the keys", col: 0, row: 2 },
      { id: "leases-fencing", label: "Lease", sub: "one leader at a time", col: 1, row: 1 },
      { id: "consensus-raft", label: "Raft leader", sub: "orders the writes", col: 1, row: 2 },
      { id: "replication-leader", label: "Followers", sub: "copies of the log", col: 1, row: 3 },
      { id: "partial-failure", label: "Partial failure", sub: "a node goes quiet", col: 1, row: 4 },
      { id: "logs-queues", label: "Change log", sub: "Kafka, for downstream", col: 2, row: 2 },
      { id: "exactly-once", label: "Consumers", sub: "idempotent effects", col: 2, row: 1 },
      { id: "consistency-models", label: "Reads", sub: "fresh or possibly stale", col: 2, row: 3 }
    ],
    edges: [
      ["client", "consistent-hashing"], ["consistent-hashing", "sharding", "routes to"],
      ["sharding", "consensus-raft", "led by"], ["leases-fencing", "consensus-raft", "who may lead"],
      ["consensus-raft", "replication-leader", "replicate log"], ["replication-leader", "partial-failure", "may go quiet"],
      ["consensus-raft", "logs-queues", "publish"], ["logs-queues", "exactly-once", "consume"],
      ["replication-leader", "consistency-models", "serve reads"]
    ],
    cap: "**One write's path through a sharded, replicated store, and out to the systems that react to it.** The key picks a shard, the shard's leader orders the write and copies it to followers, and a log carries it to consumers. Every arrow is a network hop that can be lost, delayed or repeated."
  },
  start: [
    { label: "Martin Kleppmann and Chris Riccomini, Designing Data-Intensive Applications, 2e: ch. 6 Replication, ch. 7 Sharding, ch. 9 Trouble with Distributed Systems, ch. 10 Consistency and Consensus", url: "https://dataintensive.net/", m: 300, why: "The standard map of this field for working engineers; read ch. 9 first." },
    { label: "Martin Kleppmann, Distributed systems (Cambridge lecture notes, 2021-22): sections 1 to 7", url: "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf", m: 180, why: "Free, short and precise: clocks, broadcast, quorums, Raft and linearizability in 90 pages." },
    { label: "Fly.io and Kyle Kingsbury, Gossip Glomers: six distributed systems challenges on Maelstrom", url: "https://fly.io/dist-sys/", m: 240, why: "Build broadcast, a counter and a Kafka-style log yourself and watch them fail under partitions." },
    { label: "MIT 6.5840 Distributed Systems: labs (MapReduce, KV server, Raft, sharded KV)", url: "https://pdos.csail.mit.edu/6.824/", m: 120, why: "The labs are the best way to learn Raft: implement it and pass the tests." }
  ],
  clusters: [
    { name: "Why it is hard", line: "Many machines, an unreliable network and no shared clock.",
      topics: [
        { id: "why-distribute", name: "Why use many machines",
          line: "Scale, fault tolerance and distance to users; each comes at a real cost.",
          body: [
            "There are three honest reasons to spread a system over machines. **Scale**: the data or traffic no longer fits one machine. **Fault tolerance**: a machine, a rack or a whole region can fail, and the service must survive it. **Latency**: users on another continent pay about 150 ms per round trip, so data moves closer to them.",
            "Each reason brings the same costs: partial failure, copies that disagree, coordination that adds round trips, and far harder debugging. One machine today can have hundreds of cores and terabytes of RAM, so the scale reason arrives later than most teams expect."
          ],
          uses: [
            "**Stack Overflow**: served its traffic for years from a small number of large SQL Server machines, the well-known case for scaling up first.",
            "**Google Search and WhatsApp**: could never fit on one machine; for them the scale reason is real.",
            "**A typical startup**: one Postgres primary with a replica or two, and stateless services scaled out behind a load balancer."
          ],
          example: "A service stores 2 TB and takes 5,000 writes per second. One large cloud machine with dozens of cores, hundreds of gigabytes of RAM and NVMe disks can handle that, so distribute for fault tolerance first: a standby replica in another zone. Sharding earns its cost when the data heads toward tens of terabytes or the writes outgrow one primary.",
          nuance: "Stateless services are easy to scale out; state is where all the difficulty lives. Distribute state only when a single machine plus replicas truly cannot do the job.",
          read: [{ label: "Kleppmann, Distributed systems (Cambridge notes): section 1, About distributed systems", url: "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf", m: 20 }],
          tags: ["scale out", "fault tolerance", "vertical scaling", "horizontal scaling"] },
        { id: "partial-failure", name: "Partial failure and timeouts",
          line: "Some parts fail while others keep going, and you cannot tell slow from dead.",
          body: [
            "On one machine a program usually works or crashes. Across a network, a request can be lost, the reply can be lost, the remote node can be crashed, paused for a garbage collection, or alive but overloaded. From the sender's side all of these look the same: no answer yet. The only tool is a **timeout**, and a timeout cannot tell you whether the operation happened.",
            "This is why the classic fallacies of distributed computing (the network is reliable, latency is zero, bandwidth is infinite, and so on) are fallacies. Systems must assume messages can be delayed without bound and design around unknown outcomes: retries with idempotency, leases that expire, and consensus that tolerates a minority being unreachable."
          ],
          uses: [
            "**Cloud outages**: most are partial, one zone, one dependency or one overloaded control plane, while everything else keeps running.",
            "**Jepsen**: injects partitions, pauses and clock skew into real databases, and has found lost or stale writes in many of them.",
            "**Payment APIs**: a timeout leaves the outcome unknown, so clients retry with an idempotency key rather than guess."
          ],
          example: "A service calls a payment API with a 2 s timeout. The request arrives, the card is charged, and the reply is held up by a garbage collection pause. At 2 s the caller times out and cannot know whether the charge happened. Retry without an idempotency key and the customer pays twice; give up and it may report a failure for a payment that went through.",
          nuance: "A timeout that fires does not mean the request failed; the server may have done the work. Any retry after a timeout must be safe to repeat, or you will charge the card twice.",
          read: [{ label: "Wikipedia, Fallacies of distributed computing", url: "https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing", m: 8 }],
          tags: ["timeouts", "network partition", "gc pause", "fallacies", "gray failure"] },
        { id: "clocks-ordering", name: "Clocks and ordering",
          line: "Machine clocks drift and jump, so order events by causality, not wall time.",
          body: [
            "Every machine's clock drifts, and NTP corrects it in steps, so two machines can disagree by milliseconds or more and a clock can jump backwards. Using wall-clock timestamps to decide which write came last therefore loses writes. Use a **monotonic clock** for measuring durations on one machine.",
            "For ordering across machines, **Lamport clocks** (1978) give every event a counter that respects cause and effect: if A could have caused B, A's number is smaller. **Vector clocks** go further and detect that two events were concurrent. **Hybrid logical clocks** combine wall time with a counter. Google's Spanner instead measures clock uncertainty with GPS and atomic clocks (TrueTime) and waits out that uncertainty, a few milliseconds, before a commit is visible."
          ],
          uses: [
            "**Cassandra**: resolves conflicting writes by timestamp (last writer wins), so clock skew between nodes becomes a correctness problem.",
            "**CockroachDB and YugabyteDB**: order transactions with hybrid logical clocks.",
            "**Google Spanner**: TrueTime gives each timestamp a known error bound from GPS and atomic clocks, and a commit waits out that bound before it is visible.",
            "**Riak**: kept concurrent versions with vector clocks and handed them to the client to merge."
          ],
          example: "Node A's clock runs 50 ms fast. A user sets their name to `Ann` on node A, stamped 10:00:00.050. Twenty milliseconds later they change it to `Anna` on node B, stamped 10:00:00.020. Last writer wins keeps `Ann`, the older write, because its stamp is larger. A counter carried from the first write to the second (a Lamport clock) would order them correctly.",
          nuance: "Last-writer-wins quietly drops one of two concurrent writes. If both writes matter, you need a merge rule (or a CRDT), not a better clock.",
          read: [
            { label: "Kleppmann, Distributed systems (Cambridge notes): sections 3 and 4, clocks and logical time", url: "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf", m: 40 },
            { label: "Leslie Lamport, Time, clocks, and the ordering of events in a distributed system (1978)", url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf", m: 40 }
          ],
          tags: ["lamport clock", "vector clock", "hlc", "truetime", "ntp", "clock skew"] }
      ] },
    { name: "Replication and consistency", line: "Keeping copies of the same data, and what a reader is allowed to see.",
      topics: [
        { id: "replication-leader", name: "Leader-follower replication",
          line: "One node takes writes and streams them to copies that serve reads and take over.",
          body: [
            "One replica, the **leader**, accepts all writes and appends them to a log; **followers** apply the same log in order. Reads can go to followers to spread load. If the leader dies, a follower is promoted (**failover**).",
            "Replication can be **synchronous** (the leader waits for a follower before confirming, so a confirmed write survives a leader crash, at the cost of latency) or **asynchronous** (fast, but writes not yet copied are lost on failover). Most systems use async or semi-sync with one synchronous follower. Followers lag: usually milliseconds, sometimes minutes under load."
          ],
          uses: [
            "**Postgres streaming replication**: the primary ships its write-ahead log to standbys, which replay it and serve read-only queries.",
            "**Amazon RDS and Aurora**: detect a failed primary and promote a replica automatically; Patroni does the same for self-run Postgres.",
            "**MySQL, MongoDB replica sets and Redis**: one writable leader per data set, with followers copying its log."
          ],
          example: "A user changes their email; the write commits on the primary. The next page load reads from a replica 300 ms behind and shows the old email. Two fixes: read from the primary for a few seconds after a user writes, or make the replica wait until it has replayed past that user's last write position (the LSN in Postgres).",
          nuance: "Failover is where the bugs are: an old leader that does not know it was replaced keeps accepting writes (split brain), and async replicas lose the last writes. Reading from a follower right after writing can show the old value.",
          read: [{ label: "DDIA, 2e: ch. 6 Replication", url: "https://dataintensive.net/", m: 60 }],
          see: [{ label: "System design guide: replication and failover", href: "SYSTEM%20DESIGN.html#/patterns/reliability/replication-failover" }],
          tags: ["primary", "replica", "failover", "replication lag", "split brain", "synchronous"] },
        { id: "multi-leader", name: "Multi-leader replication",
          line: "Several nodes accept writes and sync with each other, so conflicts are certain.",
          body: [
            "With more than one leader, each region (or device) accepts writes locally and replicates them to the others asynchronously. Writes are fast everywhere and a region can work while cut off. The price is **conflicts**: two leaders can change the same record at the same time, and the system must resolve them when they meet.",
            "Resolution strategies: last writer wins (simple, silently drops one write), application-level merge, or **CRDTs**, data types such as counters, sets and text sequences designed so concurrent edits always merge to the same result in any order."
          ],
          uses: [
            "**Automerge and Yjs**: CRDT libraries behind local-first and collaborative apps; each replica edits offline and merges later.",
            "**CouchDB and PouchDB**: built around multi-master sync, so a browser or phone can write offline and replicate when it reconnects.",
            "**DynamoDB global tables**: each region accepts writes and replicates to the others, resolving conflicts by last writer wins by default."
          ],
          example: "A shared shopping list syncs between two phones. Offline, phone A adds `milk` and phone B adds `eggs`. With last writer wins on the whole list, one phone's edit disappears on sync. With a CRDT set, both adds survive and the merged list holds `milk` and `eggs` whatever order the merges happen in. Deletes need a rule too: add-wins or remove-wins.",
          nuance: "It is rarely worth it for ordinary business data. If two regions can sell the same last seat, conflict resolution cannot fix that after the fact; route such keys to a single leader instead.",
          read: [{ label: "DDIA, 2e: ch. 6 Replication (multi-leader and conflicts)", url: "https://dataintensive.net/", m: 30 }],
          tags: ["active-active", "conflict resolution", "crdt", "local-first", "last writer wins"] },
        { id: "leaderless-quorums", name: "Leaderless replication and quorums",
          line: "Write to several replicas, read from several, and let overlap find the latest value.",
          body: [
            "In a leaderless design any replica accepts writes. With **n** replicas, a write succeeds when **w** of them confirm, and a read asks **r** of them and takes the newest value. If `w + r > n`, every read set overlaps every write set in at least one replica, so the read sees the latest confirmed write. A common choice is n = 3, w = 2, r = 2.",
            "Replicas that missed a write catch up through **read repair** (fixing stale copies found during reads) and **anti-entropy** (background comparison, often with Merkle trees). **Sloppy quorums** and hinted handoff keep writes flowing when the usual replicas are unreachable, at the cost of the overlap guarantee."
          ],
          uses: [
            "**Amazon Dynamo (2007)**: the internal store behind the shopping cart, whose paper defined quorums, sloppy quorums and hinted handoff.",
            "**Cassandra and ScyllaDB**: let each query choose a consistency level such as `ONE`, `QUORUM` or `ALL`.",
            "**Riak**: followed the Dynamo design, with n, r and w tunable per bucket.",
            "**Amazon DynamoDB**: despite the name, uses a leader per partition with Multi-Paxos, not Dynamo-style quorums."
          ],
          example: "Three replicas, w = 2, r = 2. A write of `x = 5` reaches replicas A and B; C is down and still holds `x = 4`. A read asks B and C, gets `5` and `4`, and returns `5` because its version is newer. It also writes `5` back to C (read repair). Since 2 + 2 > 3, any two replicas read include one that took the write.",
          nuance: "Quorums are not linearizable on their own: concurrent writes, sloppy quorums and partial failures can still show stale or conflicting values. Tunable consistency means you choose the anomaly.",
          read: [{ label: "DeCandia et al., Dynamo: Amazon's highly available key-value store (SOSP 2007): sections 4.1 to 4.7", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", m: 45 }],
          see: [{ label: "System design guide: quorum reads and writes", href: "SYSTEM%20DESIGN.html#/patterns/consistency/quorum" }],
          tags: ["quorum", "dynamo", "cassandra", "read repair", "anti-entropy", "merkle tree"] },
        { id: "consistency-models", name: "Consistency models",
          line: "A contract for what reads can return when copies and clients disagree.",
          body: [
            "**Linearizability** is the strongest common model: the system behaves as if there were one copy and each operation took effect at one instant between its start and end. Once a write is confirmed, every later read sees it. **Eventual consistency** is the weakest useful one: if writes stop, replicas converge, with no promise about what you read meanwhile.",
            "In between are models people actually need. **Read-your-writes**: you always see your own updates. **Monotonic reads**: you never see time go backwards. **Causal consistency**: if one write could have caused another, everyone sees them in that order. Note that serializability is a different axis: it is about transactions over many objects, not about the freshness of one."
          ],
          uses: [
            "**Amazon S3**: has given strong read-after-write consistency for all objects since December 2020.",
            "**Google Spanner**: offers external consistency, transactions that behave as if they ran one at a time in real-time order.",
            "**DynamoDB**: reads are eventually consistent by default; a strongly consistent read costs twice the read capacity.",
            "**Social feeds**: like and follower counts are eventually consistent, and nobody notices."
          ],
          example: "A user posts a comment; the write goes to the primary, and the page reloads from a replica 1 s behind. The comment is missing, so the user posts it again: a read-your-writes violation. On the next reloads, one request hits an up-to-date replica and the following one hits the lagging replica, so the comment appears, then vanishes: a monotonic reads violation.",
          nuance: "Pick the model per feature, not per system: a like count can be eventually consistent, a balance cannot. Many bugs blamed on caching are a missing read-your-writes guarantee after a replica read.",
          read: [
            { label: "Kyle Kingsbury, Strong consistency models", url: "https://aphyr.com/posts/313-strong-consistency-models", m: 25 },
            { label: "Jepsen, Consistency models (the clickable map)", url: "https://jepsen.io/consistency", m: 15 }
          ],
          see: [{ label: "System design guide: strong versus eventual, per feature", href: "SYSTEM%20DESIGN.html#/patterns/consistency/per-feature" }],
          tags: ["linearizability", "eventual consistency", "read your writes", "causal", "serializability"] },
        { id: "cap-pacelc", name: "CAP and PACELC",
          line: "During a partition choose consistency or availability; otherwise choose consistency or latency.",
          body: [
            "The **CAP theorem** (Brewer's conjecture in 2000, proved by Gilbert and Lynch in 2002) says that when a network partition separates replicas, a system must either refuse some requests (stay consistent, in the strict sense of linearizable) or answer them with possibly stale data (stay available). It does not say you pick two of three: partitions happen whether you like it or not.",
            "**PACELC**, from Daniel Abadi, adds the part that matters every day: if there is a Partition, choose Availability or Consistency; Else, when everything is healthy, choose Latency or Consistency. Synchronous replication across regions is consistent and slow even with no failure at all."
          ],
          uses: [
            "**Spanner and CockroachDB**: favour consistency, and pay cross-region latency on writes even when nothing is failing.",
            "**Cassandra, and DynamoDB's default reads**: favour availability and low latency, accepting possibly stale answers.",
            "**System design interviews**: CAP is the prompt to say what your design does when a region is cut off."
          ],
          example: "A ticket store has replicas in New York and London, and the link between them fails. A London user tries to buy the last ticket. The system can refuse until the link returns (consistent, not available) or sell from London's copy and risk New York selling it too (available, not consistent). With the link healthy, a synchronous write still waits about 70 ms for the other city: the latency half of PACELC.",
          nuance: "Labelling a database 'CP' or 'AP' is mostly meaningless: CAP's definitions are narrow, and most real systems are neither under them. Say which operations stay available and which guarantees they keep during a partition.",
          read: [
            { label: "Martin Kleppmann, Please stop calling databases CP or AP", url: "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html", m: 15 },
            { label: "Daniel Abadi, Consistency tradeoffs in modern distributed database system design (IEEE Computer, 2012)", url: "https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf", m: 25 }
          ],
          tags: ["cap theorem", "pacelc", "partition", "availability", "latency"] }
      ] },
    { name: "Agreement", line: "Getting machines to decide one thing together, despite failures.",
      topics: [
        { id: "consensus-raft", name: "Consensus and Raft",
          line: "A majority of nodes agree on one ordered log, so the cluster acts as one.",
          body: [
            "Consensus gets a group of nodes to agree on a value, and in practice on a sequence of values: a replicated log that every node applies in the same order (state machine replication). **Raft** (Ongaro and Ousterhout, 2014) was designed to be understandable. Nodes elect a **leader** for a numbered **term**; the leader appends client commands to its log and sends them to followers; an entry is **committed** once a majority has stored it. If the leader goes quiet, a follower times out, starts an election, and wins with a majority of votes.",
            "A cluster of 2f + 1 nodes survives f failures: three nodes tolerate one, five tolerate two. Paxos solves the same problem and came first; Raft is the version most new systems implement."
          ],
          uses: [
            "**etcd**: the Raft-based store that holds every Kubernetes cluster's state.",
            "**Kafka KRaft**: replaced ZooKeeper with a Raft-based controller quorum; Kafka 4.0 (2025) removed ZooKeeper entirely.",
            "**CockroachDB, TiKV and YugabyteDB**: run one Raft group per range of keys, many thousands per cluster.",
            "**Spanner and DynamoDB**: use Paxos variants per partition, the older algorithm that Raft was designed to make understandable."
          ],
          example: "Five nodes, the leader in term 7. A client writes `x = 1`. The leader appends it at index 42 and sends it to four followers. Two reply, so with the leader three of five have stored it: entry 42 is committed and the client gets its answer. The leader crashes. A follower times out and asks for votes in term 8; only a node whose log holds entry 42 can win, so the write survives.",
          nuance: "Consensus is slow by design: every committed write needs a majority round trip, and an even number of nodes adds cost without adding tolerance. Keep the consensus group small and put only coordination data in it.",
          read: [
            { label: "Ongaro and Ousterhout, In search of an understandable consensus algorithm (Raft), sections 5.1 to 5.4", url: "https://raft.github.io/raft.pdf", m: 45 },
            { label: "The secret lives of data: Raft, an animated walkthrough", url: "https://thesecretlivesofdata.com/raft/", m: 10 }
          ],
          tags: ["raft", "paxos", "leader election", "quorum", "etcd", "state machine replication"] },
        { id: "leases-fencing", name: "Leases and fencing tokens",
          line: "A lock that expires, plus a number that lets storage reject a stale holder.",
          body: [
            "A **lease** is a lock with a time limit: a node holds it for, say, 10 seconds and must renew it. If the holder crashes, the lease expires and someone else can take over without a human. The danger is a holder that pauses (a garbage collection, a stalled VM) past its expiry, wakes up, and still believes it holds the lease while a new holder is also writing.",
            "The fix is a **fencing token**: each time the lease is granted, the lock service hands out a number that only increases. The holder sends it with every write, and the storage rejects any write carrying a smaller number than one it has already seen."
          ],
          uses: [
            "**Kubernetes controllers**: elect a leader by holding a Lease object and renewing it every few seconds.",
            "**Google Chubby, etcd and ZooKeeper**: lock services that grant leases or ephemeral nodes; Chubby's sequencers play the part of fencing tokens.",
            "**Amazon SQS**: the visibility timeout leases a message to one worker; if the worker does not delete it in time, it reappears and is retried."
          ],
          example: "Worker A takes the lease with token 33, then stalls in a 15 s garbage collection pause; the 10 s lease expires. Worker B gets the lease with token 34 and writes to storage. A wakes and sends its write with token 33. Storage has already seen 34, so it rejects A's write. Without the token, both writes would land and one would silently overwrite the other.",
          nuance: "A lock built only on timing (such as Redlock on Redis) cannot be safe against pauses and clock jumps. If correctness matters, the resource itself must check a fencing token or a version.",
          read: [{ label: "Martin Kleppmann, How to do distributed locking", url: "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html", m: 20 }],
          see: [{ label: "System design guide: distributed locks and leases with TTL", href: "SYSTEM%20DESIGN.html#/patterns/contention/distributed-lock" }],
          tags: ["lease", "fencing token", "distributed lock", "redlock", "leader election", "chubby"] },
        { id: "two-phase-commit", name: "Distributed transactions",
          line: "Committing across several machines at once with two-phase commit, or giving up on it.",
          body: [
            "**Two-phase commit** makes a change on several nodes all-or-nothing. A coordinator asks every participant to **prepare** (write the change durably and promise to commit); if all say yes, it tells them to **commit**, otherwise to abort. Its weakness is blocking: a participant that voted yes cannot decide alone, so if the coordinator dies at the wrong moment, locks stay held until it comes back.",
            "Spanner runs two-phase commit across groups that are each replicated with Paxos, so no single machine's failure blocks it. Across separate services, teams usually avoid it and use **sagas**: a sequence of local transactions, each with a compensating action that undoes it if a later step fails."
          ],
          uses: [
            "**Postgres `PREPARE TRANSACTION`**: the participant half of two-phase commit, used by external transaction managers and XA.",
            "**Kafka transactions**: a transaction coordinator commits writes across several partitions atomically, a form of two-phase commit.",
            "**Spanner**: runs two-phase commit across Paxos groups, so no single machine's failure blocks a transaction.",
            "**Temporal**: runs sagas across microservices, retrying each step and calling compensations when a later step fails."
          ],
          example: "A trip booking saga: reserve the flight, reserve the hotel, charge the card. The hotel step fails, so the saga runs the compensation for each completed step in reverse: cancel the flight reservation. For those few seconds another user could see the seat as taken. Two-phase commit across all three would hide that, but a coordinator crash could leave the seat locked.",
          nuance: "A saga is not isolated: other requests can see the half-finished state between steps. Design each step and its compensation so that is acceptable, for example a 'pending' status.",
          read: [{ label: "Kleppmann, Distributed systems (Cambridge notes): section 7.1, Two-phase commit", url: "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf", m: 15 }],
          see: [{ label: "System design guide: two-phase commit versus sagas", href: "SYSTEM%20DESIGN.html#/patterns/contention/cross-service" }],
          tags: ["2pc", "two-phase commit", "saga", "xa", "compensation", "temporal"] }
      ] },
    { name: "Scale: shards, logs and load", line: "Splitting data across machines, moving work between them, and staying up under load.",
      topics: [
        { id: "sharding", name: "Sharding",
          line: "Split the data by key so each machine owns a slice.",
          body: [
            "When one machine cannot hold the data or take the writes, split the keyspace into **shards** (also called partitions), each owned by one node or one replica group. **Range sharding** gives each shard a contiguous key range, which keeps range scans fast but can concentrate new writes on one shard (time-ordered keys). **Hash sharding** spreads keys evenly but scatters ranges.",
            "The hard parts come after: queries that span shards, transactions across shards, **hot keys** that overload one shard no matter how many you add, and **rebalancing** data when shards are added without taking the system down."
          ],
          uses: [
            "**Vitess**: shards MySQL behind a proxy layer; it was built at YouTube and runs at Slack.",
            "**Instagram**: sharded Postgres by user id early on, with thousands of logical shards mapped onto fewer servers.",
            "**Citus**: extends Postgres to distribute tables by a column such as `tenant_id` across worker nodes.",
            "**Kafka**: splits a topic into partitions, which are shards of the log."
          ],
          example: "A chat app hashes `channel_id` across 16 shards. Loading one channel's history touches one shard. Searching all of a user's channels must ask all 16 and merge the results. When one huge channel takes a million writes a minute, its shard overloads however many shards you add: a hot key, which has to be split itself, for example by time bucket.",
          nuance: "The shard key is the most expensive decision to change later. Choose it from your main access pattern, so most queries touch one shard.",
          read: [{ label: "DDIA, 2e: ch. 7 Sharding", url: "https://dataintensive.net/", m: 50 }],
          see: [{ label: "System design guide: horizontal sharding", href: "SYSTEM%20DESIGN.html#/patterns/scaling-writes/sharding" }],
          tags: ["partitioning", "shard key", "hot key", "rebalancing", "vitess", "range", "hash"] },
        { id: "consistent-hashing", name: "Consistent hashing",
          line: "Place keys and nodes on a ring, so adding a node moves few keys.",
          body: [
            "With `hash(key) mod N`, changing N from 10 to 11 moves almost every key. **Consistent hashing** (Karger and others, 1997) hashes both keys and nodes onto a circle; each key belongs to the first node clockwise from it. Adding a node takes over only the keys between it and its neighbour, about 1/N of them.",
            "One position per node gives uneven slices, so each physical node takes many **virtual nodes** spread around the ring; this also lets a bigger machine take more. Alternatives with the same goal include rendezvous hashing and jump consistent hashing."
          ],
          uses: [
            "**Cassandra and Riak**: place data on a token ring, each physical node owning many virtual nodes.",
            "**Akamai**: the CDN grew out of the 1997 consistent hashing paper, which used it to spread cached content across servers.",
            "**Envoy and NGINX**: offer ring-hash or consistent-hash load balancing, so the same key reaches the same backend and its cache stays warm."
          ],
          example: "Ten cache servers, a million keys. With `hash(key) mod 10`, adding an eleventh server changes the owner of about 91 percent of the keys, and the cache goes cold. With consistent hashing the new server takes over about 1/11 of them, roughly 91,000 keys, and the rest stay where they were.",
          nuance: "It decides placement, not replication or rebalancing traffic, and it does nothing for a single hot key. Many modern databases use a fixed number of slots or ranges with a directory instead, which is easier to move around.",
          read: [{ label: "Wikipedia, Consistent hashing", url: "https://en.wikipedia.org/wiki/Consistent_hashing", m: 12 }],
          see: [{ label: "System design guide: consistent hashing", href: "SYSTEM%20DESIGN.html#/patterns/scaling-writes/consistent-hashing" }],
          tags: ["hash ring", "virtual nodes", "rendezvous hashing", "partitioning"] },
        { id: "logs-queues", name: "Queues and logs",
          line: "A buffer between producers and consumers; a log also keeps history to replay.",
          body: [
            "A **queue** (SQS, RabbitMQ) hands each message to one consumer and deletes it once acknowledged. A **log** (Kafka, Kinesis, Redpanda) appends messages to partitions in order and keeps them for a retention period; each consumer group tracks its own **offset**, so many independent consumers can read the same stream and replay it from any point.",
            "Both decouple producers from consumers: a spike is absorbed as backlog instead of overload, and a slow consumer does not slow the producer. Kafka orders messages only within a partition, so messages with the same key go to the same partition when their order matters."
          ],
          uses: [
            "**Kafka at LinkedIn**: began there to carry every page view and click as an event stream that many consumers read independently.",
            "**Amazon SQS**: a managed queue behind countless AWS job pipelines; a message is hidden while a worker handles it and deleted on success.",
            "**Uber and Netflix**: run Kafka as the backbone for events between services and into their data platforms.",
            "**Debezium**: streams a database's change log into Kafka topics."
          ],
          example: "An order service publishes `OrderPlaced` to a Kafka topic with 12 partitions, keyed by `order_id`. The email service, the analytics loader and the fraud model each read it in their own consumer group with their own offset. The analytics loader is down for an hour; on restart it resumes from its last offset and catches up, and the other two never noticed.",
          nuance: "Delivery is at-least-once unless proven otherwise: consumers will see duplicates after a crash or rebalance. Watch consumer lag; a queue hides an overload until the backlog is hours deep.",
          read: [{ label: "Apache Kafka documentation: Design (persistence, the consumer, delivery semantics, replication)", url: "https://kafka.apache.org/42/design/design/", m: 40 }],
          see: [{ label: "System design guide: queue buffering", href: "SYSTEM%20DESIGN.html#/patterns/scaling-writes/queue-buffer" }],
          tags: ["kafka", "sqs", "rabbitmq", "kinesis", "pubsub", "offset", "consumer group", "partition"] },
        { id: "exactly-once", name: "Exactly-once is at-least-once plus idempotency",
          line: "Messages may arrive twice; make the effect happen once.",
          body: [
            "Over a network that loses messages, a sender must retry until it gets an acknowledgment, and the acknowledgment itself can be lost. So delivery is **at-least-once**: duplicates are normal. What you can get is an exactly-once **effect**: the receiver recognises a repeat and does not apply it again.",
            "The tools: an **idempotency key** sent with each request and stored with its result, so a repeat returns the stored result; deduplication by message id inside the same transaction as the write; and naturally idempotent operations (set a value, not add to it). Kafka's exactly-once mode combines an idempotent producer with transactions, but it covers reads and writes within Kafka, not an email your consumer sends."
          ],
          uses: [
            "**Stripe API**: accepts an `Idempotency-Key` header and returns the stored result for a repeat, so a retried payment charges once.",
            "**Kafka exactly-once**: an idempotent producer plus transactions make read-process-write pipelines inside Kafka apply each record once.",
            "**Agent platforms**: replay a crashed run, so tool calls with side effects need idempotency keys or an email goes out twice."
          ],
          example: "A client sends `POST /charges` with `Idempotency-Key: k-81`. In one transaction the server inserts `k-81` into a keys table, creates the charge and stores the response. The reply is lost and the client retries with `k-81`. The insert hits the unique constraint, so the server returns the stored response instead of charging again.",
          nuance: "Store the idempotency key in the same transaction as the effect. Checking it first and writing later leaves a window where two retries both pass the check.",
          read: [
            { label: "Brandur Leach, Implementing Stripe-like idempotency keys in Postgres", url: "https://brandur.org/idempotency-keys", m: 30 },
            { label: "Confluent, Exactly-once semantics are possible: here's how Kafka does it", url: "https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/", m: 20 }
          ],
          see: [
            { label: "System design guide: exactly-once effects", href: "SYSTEM%20DESIGN.html#/patterns/consistency/exactly-once" },
            { label: "System design guide: idempotency keys", href: "SYSTEM%20DESIGN.html#/patterns/multi-step/idempotency" }
          ],
          tags: ["idempotency", "at-least-once", "deduplication", "idempotency key", "kafka transactions"] },
        { id: "load-shedding", name: "Back-pressure and load shedding",
          line: "Refuse work early and cheaply, before overload makes every request slow.",
          body: [
            "As a server nears full utilisation, queues grow and latency rises steeply, long before throughput stops growing. Past that point every request waits behind others and times out, clients retry, and the extra retries add load: the server spends its time on work nobody is waiting for any more.",
            "**Back-pressure** pushes the limit upstream: a full bounded queue makes producers slow down or block. **Load shedding** rejects excess requests early with a fast error (HTTP 429 or 503) so the ones accepted still finish in time. Good shedding is selective: drop the least important traffic first, and cap retries (a retry budget) so clients cannot multiply load during an incident."
          ],
          uses: [
            "**Google**: tags requests with criticality and sheds the least critical first under overload, as the SRE book describes.",
            "**Netflix concurrency-limits**: an open-source library that adjusts a service's concurrency limit from observed latency, in the spirit of TCP congestion control.",
            "**Envoy**: an adaptive concurrency filter and circuit breakers reject excess requests before they queue.",
            "**LLM APIs**: return HTTP 429 when a caller exceeds its requests or tokens per minute."
          ],
          example: "A service handles 1,000 requests per second at 50 ms. Traffic rises to 1,300. Without shedding the queue grows by 300 a second; after 10 s a new request waits 3 s, clients time out at 2 s and retry, and almost nothing is answered in time. Rejecting the extra 300 with a fast 503 keeps the other 1,000 at 50 ms.",
          nuance: "Unbounded queues turn overload into minutes of latency and then a crash. A system that rejects 10 percent of requests quickly is healthier than one that serves all of them too late.",
          read: [{ label: "Google SRE book, ch. 21 Handling overload", url: "https://sre.google/sre-book/handling-overload/", m: 25 }],
          see: [{ label: "System design guide: load shedding and backpressure", href: "SYSTEM%20DESIGN.html#/patterns/scaling-writes/load-shedding" }],
          tags: ["backpressure", "load shedding", "rate limiting", "retry budget", "429", "overload"] },
        { id: "tail-latency", name: "Tail latency at scale",
          line: "When a request fans out to many servers, the slowest one sets the pace.",
          body: [
            "Averages hide the requests that hurt. The 99th percentile (p99) is the latency only 1 in 100 requests exceeds, and at scale it dominates: a request that fans out to many servers is as slow as the slowest of them. Causes are ordinary: garbage collection, a noisy neighbour, a queue behind a big request, a background compaction.",
            "Dean and Barroso's remedies: **hedged requests** (send a second copy to another replica if the first has not replied by about the 95th percentile, and use whichever answers first), tied requests that cancel the duplicate once one starts, and splitting work into small pieces so a slow machine affects little."
          ],
          uses: [
            "**Google**: Dean and Barroso drew hedged and tied requests from its own fan-out services, such as web search across many index servers.",
            "**Feeds and ads**: a page at Meta or Amazon calls many services and shards, so each one's tail adds to the page's.",
            "**LLM serving**: tracks p99 time to first token, since one slow batch delays every request in it."
          ],
          example: "Each server answers in 10 ms at the median but takes 1 s at p99. A request that needs all of 100 servers waits for the slowest, so 1 - 0.99^100, about 63 percent of requests, take a second or more. Hedging sends a second copy to another replica for calls still pending at the 95th percentile, about 5 percent extra load, and the slow replies mostly stop mattering.",
          nuance: "Hedging adds load, so cap it to a few percent of requests. Measure percentiles from histograms; averaging per-server p99s gives a number that means nothing.",
          read: [{ label: "Jeffrey Dean and Luiz Andre Barroso, The tail at scale (CACM, 2013)", url: "https://research.google/pubs/the-tail-at-scale/", m: 30 }],
          tags: ["p99", "percentiles", "hedged requests", "fan-out", "latency"] }
      ] }
  ],
  see: [
    { label: "System design guide", href: "SYSTEM%20DESIGN.html" }
  ]
});
