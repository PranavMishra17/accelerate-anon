/* Per step: a cheat sheet (read it cold; if every line makes sense, the step is done) and the key
   terms (term, a way to remember it, the definition). Keyed like progress: "<session>:<step>".
   A session's key-terms table is the union of its steps' terms, so each term has one home.
   Strings may carry <sub>, <sup> and <i>; nothing else. */
window.SHEETS = {

  /* ---------------------------------------------------------------- w3a Storage */
  "w3a:0": {
    cheat: [
      "Two ways to keep sorted keys on disk: append now and merge later (LSM-tree), or rewrite the page where the key lives (B-tree).",
      "LSM write path: write-ahead log, then the in-memory memtable, then flushed as a sorted file (SSTable), then merged in the background (compaction).",
      "LSM writes are cheap because they are sequential appends; a read may check the memtable and several SSTables, newest first.",
      "A Bloom filter per SSTable lets a read skip files that cannot hold the key.",
      "B-tree: fixed-size pages (about 4 KB) in a tree a few levels deep. A write finds its page and rewrites it in place: random I/O.",
      "B-tree reads are one walk from root to leaf, about log n pages, so they are cheap and predictable.",
      "Write amplification: one write by the application becomes several on disk (compaction in an LSM-tree; the page plus the log in a B-tree).",
      "Choose by which side you want cheap: write-heavy, append-only data suits an LSM-tree (Cassandra, RocksDB); read-heavy data with updates suits a B-tree (Postgres, MySQL).",
      "The simplest index of all is a hash map from key to byte offset in a log: fast point lookups, no range queries, and the keys must fit in memory."
    ],
    terms: [
      { t: "LSM-tree", mem: "Log first, sort later.", d: "Log-structured merge tree. Writes go to an in-memory memtable, are flushed to immutable sorted files, and the files are merged in the background." },
      { t: "Memtable", mem: "The notepad in memory.", d: "The in-memory sorted structure that takes new writes until it is full and flushed to disk." },
      { t: "SSTable", mem: "Sorted, sealed, never edited.", d: "Sorted string table: an immutable file of key-value pairs sorted by key, written when the memtable flushes." },
      { t: "Compaction", mem: "Tidying the drawers.", d: "The background merge of SSTables that drops overwritten and deleted keys and keeps the number of files small." },
      { t: "B-tree", mem: "Edit the page where it lives.", d: "A balanced tree of fixed-size pages. A write overwrites its page in place; a read walks root to leaf in about log n page reads." },
      { t: "Write amplification", mem: "One write, many disk writes.", d: "Bytes written to disk divided by bytes the application wrote. Compaction raises it for LSM-trees; page rewrites raise it for B-trees." },
      { t: "Bloom filter", mem: "A bouncer that can wrongly let you in, never wrongly turn you away.", d: "A compact probabilistic set that answers 'definitely not here' or 'maybe here'. No false negatives, some false positives." }
    ]
  },
  "w3a:1": {
    cheat: [
      "Memory reference: about 100 ns.",
      "SSD random read: about 100 µs, a thousand times memory.",
      "Round trip inside one data centre: about 0.5 ms.",
      "Object storage GET: tens of milliseconds; use 50 ms.",
      "Round trip across an ocean: about 150 ms.",
      "Each step up the ladder (memory, SSD, network, object storage) costs one to three orders of magnitude.",
      "1 KB × a million = 1 GB. 1 KB × a billion = 1 TB.",
      "A day is 86,400 s; call it 10<sup>5</sup>. A million a day is about 12 a second.",
      "One significant figure is enough. The goal is the right power of ten, said out loud."
    ],
    terms: [
      { t: "Latency", mem: "How long one thing takes.", d: "The time from asking to getting an answer for a single operation." },
      { t: "Throughput", mem: "How many per second.", d: "Operations completed per unit of time, such as queries per second (QPS). Independent of how long each one takes." },
      { t: "Order of magnitude", mem: "Count the zeros.", d: "A factor of ten. Two numbers an order of magnitude apart differ by about ten times." },
      { t: "Round trip time (RTT)", mem: "There and back.", d: "The time for a request to reach another machine and the reply to come back." },
      { t: "Back-of-envelope estimate", mem: "Arithmetic out loud, one figure each.", d: "A rough calculation from a few known numbers to decide whether a design is in the right range before any detail." }
    ]
  },
  "w3a:2": {
    cheat: [
      "Object storage (S3, GCS) keeps whole objects by key. The operations are put, get, delete and list by prefix.",
      "It is cheap per GB (about 2 cents a GB-month on the standard tier), very durable, and there is no server to run.",
      "No partial updates: change one byte and you rewrite the object.",
      "No query engine: you fetch a key or list a prefix; you cannot filter or join.",
      "It fits data that is written once, never updated, and read rarely or in bulk: traces, logs, media, backups, model checkpoints.",
      "It breaks when you need real-time filtering, joins, small frequent updates or transactions.",
      "The usual pattern: the payload in object storage, a small metadata row (the object key and the fields you filter on) in a database.",
      "Large uploads go straight from the client with a presigned URL, in parts (multipart upload), never through your servers."
    ],
    terms: [
      { t: "Object storage", mem: "A huge, cheap locker room: whole lockers only.", d: "A store of immutable objects addressed by key, with no query engine, priced per GB stored and per request." },
      { t: "Key and prefix", mem: "A path that is only a name.", d: "An object's full name, such as traces/2026/10/07/abc.json. A prefix is its start, used to list related objects; there are no real folders." },
      { t: "Append-only", mem: "Write once, never edit.", d: "Data that is only ever added, never changed in place. The shape object storage is cheapest at." },
      { t: "Presigned URL", mem: "A one-time pass to the locker.", d: "A URL signed by your server that lets a client upload or download one object directly for a limited time." },
      { t: "Multipart upload", mem: "Send it in pieces, retry a piece.", d: "Uploading a large object in parts that can be sent in parallel and retried one at a time." },
      { t: "Metadata index", mem: "The card catalogue for the stacks.", d: "A small database table holding the fields worth filtering on and a pointer to each object." }
    ]
  },
  "w3a:3": {
    cheat: [
      "The method: bytes per item × items per day = bytes a day; × 30 = a month. Keep the units at every step.",
      "10 KB × 10<sup>8</sup> = 10<sup>12</sup> bytes = 1 TB a day, about 30 TB a month.",
      "Per second: 10<sup>8</sup> a day / 10<sup>5</sup> s ≈ 1,000 writes a second (1,160 exactly).",
      "To hold 30 TB: 30,000 GB × $0.02 ≈ $600 a month, and the bill grows every month you keep the data.",
      "A year kept is about 360 TB. Storage grows in a straight line; so does its cost.",
      "Choose the store from the access pattern: written once and read in bulk means object storage.",
      "Retention is a decision: keep 30 days hot and cheaply queryable, then move to a colder tier or delete.",
      "Keeping everything forever is still a decision, just one nobody made on purpose."
    ],
    terms: [
      { t: "Capacity estimate", mem: "Size × count × time.", d: "Total storage or traffic worked out from the size of one item, items per unit of time, and how long they are kept." },
      { t: "GB-month", mem: "Rent per gigabyte per month.", d: "The unit object storage is billed in: one gigabyte held for one month." },
      { t: "Retention policy", mem: "When does it leave?", d: "The rule for how long data is kept in each tier and when it is moved or deleted." },
      { t: "Storage tier (hot, cold)", mem: "Desk drawer against the basement.", d: "Classes of storage that trade access speed and request cost for a lower price per GB." },
      { t: "Write rate", mem: "Per day, then per second.", d: "Writes per second, from the daily count divided by about 10<sup>5</sup> seconds; peak is usually a few times the average." }
    ]
  },
  "w3a:4": {
    cheat: [
      "The numbers: 1 TB a day, 30 TB a month, about $600 a month to hold.",
      "Holding the data is cheap. Querying it is where the cost hides.",
      "Without an index, every question is a scan of the objects: a terabyte for each day you look at.",
      "The fix: a metadata store with the fields you filter on (scenario, time, pass or fail) and the object key.",
      "Query the small table first, then fetch only the objects it points to.",
      "For analytics over the payloads, store them in a columnar format (Parquet) and query with an engine that reads it (Athena, BigQuery).",
      "The shape of the full answer: volume, cost, where it lives, retention, and what changes if it must be queried."
    ],
    terms: [
      { t: "Metadata store", mem: "The small table that points at the big pile.", d: "A database table of filterable fields plus a pointer to each object, so queries never touch the payloads." },
      { t: "Full scan", mem: "Read everything to find anything.", d: "Answering a query by reading every record, because there is no index to narrow it." },
      { t: "Columnar format", mem: "Store by column, read only the columns you ask for.", d: "A file layout such as Parquet that groups values by column, so an analytic query reads and compresses far less." },
      { t: "Query engine", mem: "The part that answers questions.", d: "Software that plans and runs queries over data, such as a database, or Athena and BigQuery over files in object storage." }
    ]
  },

  /* ---------------------------------------------------------------- w3b Matrices */
  "w3b:0": {
    cheat: [
      "A vector is something you can scale and add. In v = x·î + y·ĵ, the numbers (x, y) are only its weights.",
      "Span: everything you can reach as a·u + b·w.",
      "Linear means A(a·u + b·w) = a·Au + b·Aw: grid lines stay straight and evenly spaced, and the origin stays put.",
      "A matrix records only where î and ĵ land: those are its columns.",
      "Av = x·(Aî) + y·(Aĵ). The row-times-column rule is this sum written out.",
      "BA means do A first, then B. Read right to left.",
      "If one vector lies in the span of the others, they are linearly dependent and the span loses a dimension.",
      "Eigenvector: Av = λv with v ≠ 0. It stays on its own line and is scaled by λ."
    ],
    terms: [
      { t: "Vector", mem: "A recipe: so many of î, so many of ĵ.", d: "An object you can add and scale. In coordinates, its weights on the basis vectors." },
      { t: "Basis vectors (î, ĵ)", mem: "The two rulers everything is measured in.", d: "The unit vectors (1, 0) and (0, 1); every 2-D vector is a weighted sum of them." },
      { t: "Span", mem: "Everywhere you can walk with these steps.", d: "The set of all a·u + b·w for any numbers a and b." },
      { t: "Linear dependence", mem: "One of them is redundant.", d: "A set is dependent when one vector is a combination of the others, so removing it leaves the span unchanged." },
      { t: "Linear transformation", mem: "Straight grid lines, origin fixed.", d: "A map with A(a·u + b·w) = a·Au + b·Aw." },
      { t: "Matrix", mem: "Its columns are where î and ĵ land.", d: "The table that records a linear transformation by the images of the basis vectors." },
      { t: "Composition", mem: "Right acts first.", d: "Applying one transformation after another; BA is A then B, as one matrix." }
    ]
  },
  "w3b:1": {
    cheat: [
      "a · b = Σ a<sub>i</sub>b<sub>i</sub> in arithmetic, and |a||b| cos θ in geometry.",
      "|a| = √(a · a).",
      "cos θ = (a · b) / (|a||b|) = â · b̂, where â = a/|a|.",
      "The score is 1 for the same direction, 0 at right angles, −1 for opposite.",
      "Scaling a vector by any c > 0 leaves its cosine with anything unchanged: only direction counts.",
      "For unit vectors, |a − b|<sup>2</sup> = 2 − 2 cos θ, so ranking by cosine and by distance give the same order.",
      "An embedding's direction carries meaning; its length often carries something incidental, like frequency.",
      "Normalise once when you store vectors and the dot product is the cosine. Vector indexes do exactly this."
    ],
    terms: [
      { t: "Dot product", mem: "Multiply matching entries, add.", d: "a · b = Σ a<sub>i</sub>b<sub>i</sub> = |a||b| cos θ." },
      { t: "Magnitude (norm)", mem: "The length, by Pythagoras.", d: "|a| = √(a · a)." },
      { t: "Unit vector", mem: "Length one, direction only.", d: "â = a/|a|. Dividing by the length is called normalising." },
      { t: "Cosine similarity", mem: "The dot product, lengths divided out.", d: "cos θ = (a · b)/(|a||b|), between −1 and 1, blind to length." },
      { t: "Embedding", mem: "Meaning as a direction.", d: "A vector a model produces for a token, sentence or document, placed so that similar meanings point in similar directions." }
    ]
  },
  "w3b:2": {
    cheat: [
      "(m × n)(n × p) = (m × p): the inner sizes match and drop out, the outer sizes remain.",
      "(A<sup>T</sup>)<sub>ij</sub> = A<sub>ji</sub>. Transposing swaps rows and columns, and swaps the shape.",
      "(AB)<sub>ij</sub> = Σ<sub>k</sub> A<sub>ik</sub>B<sub>kj</sub>: row i of A against column j of B.",
      "(AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>. The order reverses.",
      "Shapes prove it: A is 4 × 3, B is 3 × 5, AB is 4 × 5, (AB)<sup>T</sup> is 5 × 4 = (5 × 3)(3 × 4). A<sup>T</sup>B<sup>T</sup> does not even multiply.",
      "Socks then shoes; to undo, shoes first. Inverses reverse the same way: (AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>."
    ],
    terms: [
      { t: "Transpose", mem: "Flip across the diagonal.", d: "A<sup>T</sup> has entry (i, j) equal to A's entry (j, i); an m × n matrix becomes n × m." },
      { t: "Inner dimension", mem: "The two middle numbers must shake hands.", d: "In (m × n)(n × p), the shared n that is summed over and disappears." },
      { t: "Shape", mem: "Rows by columns, always.", d: "The sizes of a matrix or tensor along each axis, written m × n." },
      { t: "Index notation", mem: "Write one entry, and the sum is the proof.", d: "Writing a product entry by entry, (AB)<sub>ij</sub> = Σ<sub>k</sub> A<sub>ik</sub>B<sub>kj</sub>, to prove identities term by term." }
    ]
  },
  "w3b:3": {
    cheat: [
      "Most vectors are turned onto a new line by a transformation.",
      "An eigenvector stays on its own line: Av = λv, v ≠ 0.",
      "λ > 1 stretches, 0 < λ < 1 shrinks, λ < 0 flips, λ = 0 collapses to the origin.",
      "In a diagonal matrix the basis vectors are the eigenvectors and the diagonal entries are the eigenvalues.",
      "The test: is Av a multiple of v? Under diag(2, −1), (1, 1) goes to (2, −1): no.",
      "A<sup>n</sup>v = λ<sup>n</sup>v. Applied again and again, the direction grows if |λ| > 1 and dies out if |λ| < 1.",
      "That is why eigenvalues decide stability: repeated multiplication, as in an RNN or power iteration."
    ],
    terms: [
      { t: "Eigenvector", mem: "The direction that survives.", d: "A non-zero v with Av = λv: the transformation keeps it on its own line." },
      { t: "Eigenvalue", mem: "How much the survivor is stretched.", d: "The λ in Av = λv; its sign says whether the eigenvector is flipped." },
      { t: "Diagonal matrix", mem: "Each axis scaled on its own.", d: "A matrix with zeros off the diagonal; its eigenvectors are the basis vectors." },
      { t: "Stability", mem: "Does repeating it blow up?", d: "Whether repeated application grows or shrinks a vector: set by whether |λ| is above or below 1." }
    ]
  },
  "w3b:4": {
    cheat: [
      "The rule: (m × n)(n × p) = (m × p). Check the inner pair, read off the outer pair.",
      "Row times column, (1 × n)(n × 1), is a 1 × 1 scalar: the dot product.",
      "Column times row, (n × 1)(1 × n), is n × n: the outer product. Same vectors, opposite order, very different shape.",
      "Two matrices of the same non-square shape never multiply directly. Transpose one: (5 × 2)<sup>T</sup>(5 × 2) = 2 × 2, (5 × 2)(5 × 2)<sup>T</sup> = 5 × 5.",
      "In PyTorch, A @ B contracts A's last axis with B's second-to-last (its first, for a plain matrix).",
      "Batch axes ride along: (B, T, D) @ (D, H) = (B, T, H). That is a linear layer.",
      "Reading a shape error: write both shapes, find the inner pair that does not match, decide which side to transpose."
    ],
    terms: [
      { t: "Outer product", mem: "Column times row makes a table.", d: "u v<sup>T</sup> for column vectors u and v: an n × n matrix of every u<sub>i</sub>v<sub>j</sub>." },
      { t: "Scalar", mem: "Just a number.", d: "A single value, a 1 × 1 result such as a dot product." },
      { t: "Batch axis", mem: "The stack of examples, carried along.", d: "A leading tensor axis holding independent examples; matmul applies to each one and leaves the axis unchanged." },
      { t: "Matmul (@)", mem: "Last axis meets second-to-last.", d: "PyTorch's matrix product; it contracts the left operand's last axis with the right operand's second-to-last." }
    ]
  },

  /* ---------------------------------------------------------------- w3c Nyquist */
  "w3c:0": {
    cheat: [
      "Digital audio is a list of readings: x[n] = x(n/N), N readings a second.",
      "f<sub>Nyq</sub> = N/2 is the highest frequency a rate of N can hold.",
      "A tone at f and a tone at N − f give identical readings.",
      "So a tone above N/2 is not lost: it folds down to N − f. That is aliasing.",
      "At 24 kHz the ceiling is 12 kHz, and a 15 kHz tone is recorded as 9 kHz.",
      "The rule: sample at N > 2·f<sub>max</sub>. Speech up to 10 kHz needs more than 20 kHz.",
      "Bit depth is how finely each reading is quantised: about 6 dB of range per bit, so 16-bit gives about 96 dB.",
      "Sample rate sets the ceiling; bit depth sets the noise floor."
    ],
    terms: [
      { t: "Sample rate", mem: "Readings per second.", d: "N, the number of pressure readings taken each second, in Hz or kHz." },
      { t: "Nyquist frequency", mem: "Half the rate is the ceiling.", d: "N/2, the highest frequency a sample rate of N can represent." },
      { t: "Aliasing", mem: "Above the ceiling, it folds back down.", d: "A frequency f above N/2 recorded as N − f, indistinguishable from a real tone there." },
      { t: "Bit depth", mem: "How fine each ruler mark is.", d: "Bits per reading; 16 bits give 2<sup>16</sup> = 65,536 levels." },
      { t: "Quantisation noise", mem: "The rounding error you hear as hiss.", d: "The error from rounding each reading to the nearest level; it sets the noise floor." },
      { t: "Decibel (dB)", mem: "Count the zeros of loudness.", d: "A log scale: 20 log<sub>10</sub> of an amplitude ratio. Every 6 dB is roughly a doubling of amplitude." }
    ]
  },
  "w3c:1": {
    cheat: [
      "f<sub>Hz</sub> = c · N. The readings fix c, cycles per reading; the rate N is stored beside them as metadata.",
      "Assume the wrong rate and every frequency is scaled by N<sub>assumed</sub> / N<sub>true</sub>.",
      "24 kHz read as 16 kHz: × 2/3, so 1000 Hz reads as 667 Hz. 22.05 kHz read as 44.1 kHz: × 2.",
      "Nothing errors: the file loads and the waveform looks valid.",
      "This project's rates: corpus 24 kHz, WavLM 16 kHz, MioCodec 44.1 kHz, Sarvam 22.05 kHz; ceilings 12, 8, 22.05 and 11.025 kHz.",
      "Change the rate properly: N<sub>new</sub> = N<sub>old</sub> · L/M. Insert zeros, low-pass at half the lower rate, keep every M-th reading.",
      "Going down discards the band above the new ceiling. Going up cannot bring it back.",
      "The cost here: S21 phase B reversed under a wrong assumed rate. Check the rate at every stage boundary."
    ],
    terms: [
      { t: "Resampling", mem: "Re-reading the same sound at a new rate.", d: "Converting a signal from one sample rate to another, filtering so nothing folds." },
      { t: "Low-pass filter", mem: "Lets the lows through.", d: "A filter that keeps frequencies below a cutoff and removes those above it." },
      { t: "Rational resampling (L/M)", mem: "Up by L, down by M.", d: "Change rate by L/M: upsample by L, low-pass, keep every M-th reading; 24 → 16 kHz is L = 2, M = 3." },
      { t: "Silent failure", mem: "Wrong, and nothing complains.", d: "An error that produces plausible output instead of an exception, such as analysing at the wrong sample rate." }
    ]
  },
  "w3c:2": {
    cheat: [
      "A spectrum shows how strong each frequency is. The FFT computes it from the readings; plot 20 log<sub>10</sub>|X(f)| in dB.",
      "The FFT of n readings has bins at k·N/n: one second at 24 kHz gives 1 Hz bins up to 12 kHz.",
      "Resampling 24 kHz to 16 kHz moves the ceiling from 12 kHz to 8 kHz.",
      "The resampler low-passes first: H(f) = 1 below 8 kHz, 0 above. Without it, 10 kHz would fold to 16 − 10 = 6 kHz, inside the band you keep.",
      "Expect the same shape below 8 kHz, a cliff at 8 kHz, and nothing above.",
      "A Fourier-method resampler (scipy.signal.resample) cuts sharply, so the edge is a cliff, not a slope.",
      "Resample back up to 24 kHz and the 8 to 12 kHz band stays empty: the content is gone."
    ],
    terms: [
      { t: "Spectrum", mem: "A bar chart of pitches.", d: "Strength against frequency for a clip, low on the left, high on the right." },
      { t: "FFT", mem: "Readings in, frequencies out.", d: "Fast Fourier transform: computes the spectrum X(f) of n readings in about n log n steps." },
      { t: "Frequency bin", mem: "One bar's width is N/n.", d: "One FFT output, at frequency k·N/n; a longer clip gives narrower bins." },
      { t: "Anti-aliasing filter", mem: "Cut before you drop readings.", d: "The low-pass applied before lowering the rate, so nothing above the new ceiling folds down." }
    ]
  },

  /* ---------------------------------------------------------------- wc4 Design: flowchart (folded into week 3) */
  "wc4:0": {
    cheat: [
      "Extract steps, actors, systems and controls from the walkthrough as structured nodes, each cited to a timestamp.",
      "The model proposes nodes and edges with evidence; code assembles the graph.",
      "A node without evidence is not added.",
      "The flowchart is rendered from the graph, never drawn by the model, so it cannot show a step nobody said.",
      "A graph is data: you can validate it, query it and diff it next year."
    ],
    terms: [
      { t: "Process graph", mem: "The flowchart as data.", d: "Nodes for steps, actors, systems and controls, edges for the flow, each carrying its evidence." },
      { t: "Walkthrough", mem: "The client explains, the recording listens.", d: "An audit meeting where the client describes how a process actually runs." },
      { t: "Provenance", mem: "Where did this come from?", d: "The source attached to a fact, here a timestamp in the recording." },
      { t: "Control", mem: "The check that stops a mistake.", d: "A step in a process that prevents or catches an error or fraud, such as an approval." }
    ]
  },
  "wc4:1": {
    cheat: [
      "The firm's risk taxonomy is the fixed vocabulary; the model may not invent risks.",
      "The model suggests a control-to-risk mapping with its reasoning; a person confirms it.",
      "Every confirmation is logged: who, when, what changed.",
      "Confirmed mappings become next year's starting point, so the work accumulates."
    ],
    terms: [
      { t: "Risk taxonomy", mem: "The closed list of what can go wrong.", d: "The firm's fixed set of risk categories every control is mapped to." },
      { t: "Human in the loop", mem: "The model proposes, a person disposes.", d: "A design where a person approves each model suggestion before it takes effect." },
      { t: "Audit log", mem: "Who did what, when.", d: "An append-only record of every confirmation and change." }
    ]
  },
  "wc4:2": {
    cheat: [
      "Store each year's graph as a version; never overwrite last year.",
      "The diff is the product: what changed in the process since last year.",
      "A new approver, a swapped system, a manual step where there used to be an automated one: that is where control risk concentrates.",
      "History you can diff comes from event sourcing or change data capture, not from rows you overwrite."
    ],
    terms: [
      { t: "Versioning", mem: "Keep every year, compare any two.", d: "Storing each state as a new version instead of updating in place." },
      { t: "Graph diff", mem: "What moved between two pictures.", d: "Nodes and edges added, removed or changed between two versions." },
      { t: "Event sourcing", mem: "Store what happened, derive what is.", d: "Keeping the sequence of changes as the source of truth; the current state is rebuilt from it." },
      { t: "Change data capture", mem: "Every row change, as an event.", d: "Streaming each insert, update and delete from a database so history can be kept elsewhere." }
    ]
  },
  "wc4:3": {
    cheat: [
      "Last year's reviewer comments are retrieved into this year's test of the same control.",
      "Store them as facts with provenance: who said it, about which control, when.",
      "The model reads them and never rewrites them.",
      "That way memory accumulates instead of drifting, the same lesson as your own memory system."
    ],
    terms: [
      { t: "Memory drift", mem: "Retold each year, slightly wrong each time.", d: "Stored knowledge degrading because a model rewrites or summarises it repeatedly." },
      { t: "Retrieval keyed by control", mem: "Look it up by what it is about.", d: "Fetching prior notes by the control's identifier, not by fuzzy similarity alone." }
    ]
  }
};
