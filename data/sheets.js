/* Per step: a cheat sheet (read it cold; if every line makes sense, the step is done) and the key
   terms (term, a way to remember it, the definition). Keyed like progress: "<session>:<step>".
   A session's key-terms table is the union of its steps' terms, so each term has one home.
   Strings may carry <sub>, <sup> and <i>; nothing else. */
window.SHEETS = {

  /* ---------------------------------------------------------------- w1a Throughput, latency, queues, backpressure */
  "w1a:0": {
    cheat: [
      "Response time is a distribution, not a number. Describe it with percentiles.",
      "p50 is the median: half of all requests finish faster than this.",
      "p95 and p99 are the latencies that 95 or 99 percent of requests beat. The slow tail lives beyond them.",
      "The mean is dominated by the bulk of fast requests, so it hides the tail.",
      "The tail is not random. The slowest requests are often the heaviest users, who have the most data.",
      "Retries make the tail worse: they add load to paths that are already slow.",
      "Plan capacity from the tail (p99), not the mean.",
      "An average can look healthy while the slowest requests are the ones hurting."
    ],
    terms: [
      { t: "Response time", mem: "What the user feels.", d: "The time from a request being sent to the reply arriving, as the client sees it. It varies request to request, so it is a distribution." },
      { t: "Percentile", mem: "The line that p percent of requests beat.", d: "The value below which p percent of observations fall. p50 is the median; p99 is the value the slowest one percent exceed." },
      { t: "Median (p50)", mem: "The typical request.", d: "The middle response time: half of requests are faster, half slower." },
      { t: "Tail latency", mem: "The slow end of the curve.", d: "The high percentiles (p95, p99 and beyond), where the slowest requests sit. It is where heavy users and retries live." },
      { t: "Mean", mem: "Pulled around by the crowd.", d: "The sum of response times divided by their count. The bulk of fast requests dominates it, so it says little about the tail." },
      { t: "Retry amplification", mem: "Pouring water on a flooded floor.", d: "The extra load that retries add to a path that is already slow, which pushes it further into overload." }
    ]
  },
  "w1a:1": {
    cheat: [
      "Throughput is requests completed per second. Latency is how long one request takes end to end.",
      "They are different measures. High throughput says nothing about how long each request waits.",
      "p50 is the median latency. p99 is the latency the slowest one percent cross, where the pain lives.",
      "A bounded queue has a fixed capacity and refuses work once full.",
      "An unbounded queue has no limit, so it keeps absorbing work instead of refusing it.",
      "Backpressure pushes the overload signal back so the producer slows down.",
      "Load shedding deliberately drops some work so the rest stays fast.",
      "Each definition fits in about fifteen words. A longer one is not understood yet."
    ],
    terms: [
      { t: "Throughput", mem: "Per second, counted at the exit.", d: "The number of requests completed per unit of time." },
      { t: "Latency", mem: "One request, start to end.", d: "How long a single request takes from arrival to completion." },
      { t: "Bounded queue", mem: "A waiting room with a door that shuts.", d: "A queue with a fixed capacity. When it is full it rejects new work, which fails fast and loud." },
      { t: "Unbounded queue", mem: "A waiting room with no walls.", d: "A queue with no capacity limit. It accepts everything, so overload shows up late and silently, as memory growth." },
      { t: "Backpressure", mem: "The refusal travels upstream.", d: "A full queue pushes its limit back to the producer, so the producer slows down instead of piling work onto the consumer." },
      { t: "Load shedding", mem: "Drop on purpose, keep the rest fast.", d: "Deliberately discarding some work, usually low priority, so the remaining work is still served quickly." }
    ]
  },
  "w1a:2": {
    cheat: [
      "Arrival rate above service rate means the queue only grows.",
      "An unbounded queue accepts every request, so nothing is rejected and no error rate rises.",
      "Throughput looks unchanged, because work is still being completed.",
      "Latency climbs as the backlog grows, and memory climbs because every queued item has to be held somewhere.",
      "Then the process runs out of memory and dies all at once. The dashboard everyone watched showed nothing until then.",
      "A bounded queue fails early and loud: it rejects work when full, and the rejection is information.",
      "Watch queue depth, not only throughput. Depth shows saturation; throughput does not.",
      "Unbounded fails slow and silent. Bounded fails fast and loud."
    ],
    terms: [
      { t: "Saturation", mem: "Out of room to absorb more.", d: "The point where a resource, such as workers or memory, is fully used and extra load can only wait or be refused." },
      { t: "Queue depth", mem: "How long the line is.", d: "The number of items waiting in a queue. It rises under overload when throughput does not show it." },
      { t: "Backlog", mem: "The pile that has not been done yet.", d: "Work that has arrived but not completed. It grows whenever arrivals exceed the rate of service." },
      { t: "Silent failure", mem: "Green dashboard, dying process.", d: "A failure with no early error signal. An unbounded queue is the standard case: it looks healthy until memory is exhausted." },
      { t: "Fail fast", mem: "Say no now, not later.", d: "Refusing work immediately when there is no capacity, so the caller and the operators learn at once rather than after a crash." }
    ]
  },
  "w1a:3": {
    cheat: [
      "A hundred million a day is a rate before it is a size: 10<sup>8</sup> / 10<sup>5</sup> s ≈ 1,000 a second, about 1,200 on average, and up to 10 thousand at peak (3 to 10 times the average).",
      "Little's law: requests in flight = rate × time in the system. 10,000 a second × 200 ms = 2,000 in flight. That sets workers and connections.",
      "If the caller does not need the result now, put the work on a queue and return at once. Bound the queue on purpose, so overload becomes backpressure or deliberate shedding.",
      "Past one queue and one database, split the work by a key you can defend, and assume the key is skewed. The hottest partition is the ceiling for everything.",
      "At this rate a one-in-a-million failure happens about a hundred times a day. Rare becomes constant.",
      "So handlers are idempotent with a key, retries back off with jitter and a cap, and work that keeps failing goes to a dead-letter queue.",
      "A rate limit per caller at the edge stops one heavy tenant starving the rest.",
      "Size from p99 and peak, not the mean. Watch queue depth, age of the oldest item, p99 and rejections."
    ],
    terms: [
      { t: "Little's law", mem: "In flight = rate × time.", d: "The average number of items in a system equals the arrival rate multiplied by the average time each spends in it. It sizes workers and connections." },
      { t: "Peak factor", mem: "Average is not the worst hour.", d: "The ratio of peak traffic to average traffic, typically 3 to 10 times. Capacity is sized for the peak." },
      { t: "Partition (shard) key", mem: "Which drawer does it go in?", d: "The field used to split work or data across partitions. A poor key sends most traffic to one partition." },
      { t: "Skewed key", mem: "One customer eats the whole line.", d: "A key where one value, a customer or an hour, carries a disproportionate share of traffic. The hottest partition then caps the whole system." },
      { t: "Idempotent handler", mem: "Do it twice, same result.", d: "A handler that can safely run more than once for the same request, usually by checking an idempotency key. It makes retries and duplicates harmless." },
      { t: "Backoff with jitter", mem: "Wait longer, and not in lockstep.", d: "Retrying after growing, randomised delays, with a cap on attempts, so retries do not arrive together and re-overload the system." },
      { t: "Dead-letter queue", mem: "Where the poison goes.", d: "A separate queue that receives work that keeps failing, so it stops blocking the main flow and can be inspected." }
    ]
  },
  "w1a:4": {
    cheat: [
      "Two minutes, spoken once, no notes. Week five is not the first attempt.",
      "Rate first: how many a second, how big each one is, steady or bursty. A hundred million a day is about 1,200 a second, up to 10 thousand at peak.",
      "Bound the queue. Unbounded absorbs overload silently and dies all at once while the dashboard looks fine.",
      "A full bounded queue pushes back on the producer, or I shed load on purpose.",
      "Split on a key and assume skew. Real traffic is power-law, so the hottest partition is the ceiling however many machines sit behind it.",
      "Make rare failures safe: one in a million is a hundred a day, so every handler is idempotent and retries are capped.",
      "Size from the tail (p99 and peak), not the mean.",
      "No product names. The same sentences hold whichever vendor is underneath."
    ],
    terms: [
      { t: "Primitives", mem: "Ideas, not brands.", d: "The vendor-neutral building blocks of an answer: queues, partitions, keys, retries. They hold whatever product sits underneath." },
      { t: "Hot partition", mem: "One lane jammed, the rest empty.", d: "The partition that receives the most traffic. When it saturates it limits the whole system while the others sit idle." },
      { t: "Power-law traffic", mem: "A few giants, many minnows.", d: "A distribution where a small number of keys account for most of the load, so uniform spreading cannot be assumed." },
      { t: "Admission control", mem: "Check the ticket at the door.", d: "Limiting what enters the system, for example a rate limit per caller, so overload degrades by priority instead of all at once." }
    ]
  },

  /* ---------------------------------------------------------------- w1b Functions, exponentials, logarithms */
  "w1b:0": {
    cheat: [
      "Calculus approximates a hard, curved problem with something simple, then studies how the error shrinks.",
      "The method: replace the curve with something constant or straight, then make the pieces finer.",
      "Worked example: the area of a circle by slicing it into thin rings, each straightened into a rectangle.",
      "As the ring width goes to zero, the approximation error goes to zero.",
      "A derivative is what that approximation converges to as the slice width goes to zero.",
      "It is a limit: where the approximation settles, not a leap straight to an instant.",
      "The power rule is a shortcut for computing a derivative. The definition is the limit.",
      "Understand the limit first, then the rules."
    ],
    terms: [
      { t: "Derivative", mem: "Where the approximation settles.", d: "The limit of a simple approximation, such as a slope over a small step, as the step size goes to zero." },
      { t: "Limit", mem: "Where it is heading.", d: "The value a quantity approaches as a parameter, here the slice width, shrinks towards zero." },
      { t: "Approximation error", mem: "What the simple version gets wrong.", d: "The gap between the simple stand-in and the true quantity. In calculus it shrinks to zero in the limit." },
      { t: "Ring slicing", mem: "Peel the circle like an onion.", d: "Cutting a disc into thin concentric rings, each of which straightens into a near-rectangle, so the area becomes a sum of simple pieces." },
      { t: "Power rule", mem: "A shortcut, not the definition.", d: "The rule that lowers an exponent by one when differentiating x<sup>n</sup>. It computes a derivative; it does not define it." }
    ]
  },
  "w1b:1": {
    cheat: [
      "A logarithm reads an exponent back off: log<sub>c</sub> a = x means c<sup>x</sup> = a. It is the inverse of exponentiation.",
      "Product rule: log(ab) = log a + log b. Multiplying numbers is adding their exponents.",
      "Proof: let a = c<sup>x</sup> and b = c<sup>y</sup>. Then ab = c<sup>x+y</sup>, so log<sub>c</sub> ab = x + y.",
      "On a log vertical axis an exponential curve becomes a straight line: constant multiplicative growth is constant slope.",
      "A likelihood is a product of many small probabilities. Thousands of them multiply to zero in floating point (underflow).",
      "Summing logs does not underflow, and a sum differentiates term by term.",
      "To compare models over a large dataset, compute the sum of per-example log-probabilities, never the raw product."
    ],
    terms: [
      { t: "Logarithm", mem: "The exponent, read back.", d: "log<sub>c</sub> a is the power to which c must be raised to give a. It is the inverse of exponentiation." },
      { t: "Exponentiation", mem: "Repeated multiplying.", d: "Raising a base c to a power x, written c<sup>x</sup>. Multiplying two powers of one base adds their exponents." },
      { t: "Product rule for logs", mem: "Times becomes plus.", d: "log(ab) = log a + log b. It turns a product into a sum." },
      { t: "Underflow", mem: "So small it becomes zero.", d: "A floating-point result too small to represent, which rounds to zero. Multiplying thousands of small probabilities causes it." },
      { t: "Likelihood", mem: "How probable the data is.", d: "The probability of the observed data under a given parameter. For independent examples it is the product of per-example probabilities." },
      { t: "Log axis", mem: "Equal steps are equal ratios.", d: "A scale where each step is a multiplication by a fixed factor. Exponential growth plots as a straight line on it." }
    ]
  },
  "w1b:2": {
    cheat: [
      "Definition: log<sub>2</sub> 32 = 5, since 2<sup>5</sup> = 32. log<sub>3</sub> 1 = 0, since anything to the power 0 is 1.",
      "Product: log 100 + log 10 = log 1000 = 3.",
      "Quotient: log<sub>2</sub> 8 − log<sub>2</sub> 2 = log<sub>2</sub> 4 = 2.",
      "Power: log(a<sup>n</sup>) = n log a. So log<sub>5</sub> 25<sup>3</sup> = 3 × log<sub>5</sub> 25 = 3 × 2 = 6.",
      "Zero, one and negative exponents: 5<sup>0</sup> = 1, e<sup>1</sup> = e, 2<sup>−3</sup> = 1/8.",
      "Solve all ten cold on paper first, and check afterwards. That is what makes the rules automatic.",
      "Aim: never look up the product or power rule again."
    ],
    terms: [
      { t: "Quotient rule for logs", mem: "Divide becomes minus.", d: "log(a/b) = log a − log b. Dividing numbers subtracts their exponents." },
      { t: "Power rule for logs", mem: "Pull the exponent out front.", d: "log(a<sup>n</sup>) = n log a." },
      { t: "Zero exponent", mem: "Anything to the 0 is 1.", d: "For any non-zero base, c<sup>0</sup> = 1. It is why log of 1 is 0 in every base." },
      { t: "Negative exponent", mem: "Flip it.", d: "c<sup>−n</sup> = 1/c<sup>n</sup>. For example 2<sup>−3</sup> = 1/8." },
      { t: "Base of a log", mem: "Which number are we counting powers of?", d: "The number being raised to a power. log<sub>2</sub> counts powers of 2; log<sub>e</sub>, the natural log, counts powers of e." }
    ]
  },
  "w1b:3": {
    cheat: [
      "Likelihood: L(θ) = ∏<sub>i</sub> p(x<sub>i</sub> | θ), the probability of the data you saw for one value of θ. Independent points multiply.",
      "Maximum likelihood: θ̂ = arg max L(θ). Pick the θ that makes your data most probable. Everything else only rewrites this.",
      "Move 1, take the log. Log is increasing: a > b ⇔ log a > log b, so the top stays at the same θ and only the heights change.",
      "The log turns the product into a sum: log L = Σ log p(x<sub>i</sub> | θ). No underflow, and it differentiates term by term.",
      "Move 2, put a minus in front. arg max f = arg min (−f), so NLL(θ) = −Σ log p(x<sub>i</sub> | θ) is a loss that descent can minimise.",
      "Example: 7 heads in 10 flips. L(p) = p<sup>7</sup>(1 − p)<sup>3</sup>, so log L = 7 log p + 3 log(1 − p).",
      "d/dp log L = 7/p − 3/(1 − p) = 0 ⇒ p̂ = 0.7. The same answer as the product, with no product rule.",
      "Scale: 0.01<sup>1000</sup> = 10<sup>−2000</sup>, below the smallest float64 (10<sup>−308</sup>) and rounds to 0. 1000 · log 0.01 ≈ −4605 is an ordinary number."
    ],
    terms: [
      { t: "Maximum likelihood", mem: "Make the data least surprising.", d: "Choosing the parameter θ̂ that maximises the likelihood of the observed data." },
      { t: "arg max / arg min", mem: "Where, not how high.", d: "The input at which a function is largest or smallest, rather than the value itself. arg max f = arg min (−f)." },
      { t: "Increasing function", mem: "Order-preserving.", d: "A function where a larger input always gives a larger output. Applying it changes heights but not where the maximum is." },
      { t: "Negative log-likelihood (NLL)", mem: "Log, then flip.", d: "NLL(θ) = −Σ log p(x<sub>i</sub> | θ). Minimising it gives the same θ̂ as maximising the likelihood." },
      { t: "Loss function", mem: "The thing you walk downhill on.", d: "A quantity that training minimises. Optimisers descend, so a likelihood is turned into a loss by negating its log." },
      { t: "Cross-entropy (log loss)", mem: "NLL, averaged.", d: "The negative log-likelihood averaged over examples. It is the loss minimised when training a classifier." },
      { t: "Bias p", mem: "The coin's chance of heads.", d: "The probability of heads for a coin. With 7 heads in 10 flips the maximum-likelihood estimate is p̂ = 0.7." }
    ]
  },

  /* ---------------------------------------------------------------- w1c Alaap part 0, orientation */
  "w1c:0": {
    cheat: [
      "Run scripts/demo_script_render.py from the VoiceForge TTV Pipeline v3 repo root, then listen to demo_out/audio/.",
      "The demo mints a voice identity from a text description through the mapper.",
      "Then it renders scripted lines through the frozen TTS using that fixed identity.",
      "The gates (drift, consistency, uniqueness, CER) check identity and intelligibility.",
      "None of them checks whether the voice sounds natural. The naturalness floor is proposed, never enforced.",
      "So a render can pass every gate and still sound synthetic.",
      "Listening is the only check that catches that. No number substitutes for it."
    ],
    terms: [
      { t: "Mapper", mem: "Words in, voice vector out.", d: "The small trained component that turns a text description of a voice into a speaker vector. It carries all of this system's learning." },
      { t: "Frozen TTS", mem: "A fixed speaker, never retrained.", d: "The text-to-speech model whose weights are never updated. It turns a speaker vector plus text into audio." },
      { t: "Voice identity", mem: "Who is speaking.", d: "The fixed speaker vector that defines a voice, kept separate from per-line direction such as emotion or rate." },
      { t: "CER", mem: "Characters wrong per characters said.", d: "Character error rate: the share of characters in a transcript of the audio that differ from the intended text. A measure of intelligibility." },
      { t: "Quality gate", mem: "A pass mark before storing.", d: "A check on a render, such as drift, consistency, uniqueness or CER, that must pass before an identity is accepted." }
    ]
  },
  "w1c:1": {
    cheat: [
      "Two towers. Tower A is learned: a text encoder plus a trained mapper turns free text into a speaker vector.",
      "Tower B is frozen: an acoustic language model with weights never updated turns that vector plus text into audio.",
      "The speaker vector is the only channel between the towers.",
      "Identity stays fixed; per-line direction (emotion, rate) stays separate, so identity never carries performance.",
      "Five gates run before an identity is stored: drift, consistency, uniqueness, CER, and a naturalness gate that has never rejected anything (its floor of 75 is a proposal).",
      "The identity store keeps a seed clip as well as the vector, because an encoder change has orphaned stored vectors once before.",
      "The renderer has already changed once: from the dead, licence-poisoned Zonos-v0.1 to Qwen3-TTS-1.7B.",
      "So the only thing that learns is the mapper, and the renderer behind it can be swapped."
    ],
    terms: [
      { t: "Two-tower design", mem: "One tower learns, one stands still.", d: "A trained mapper (Tower A) feeding a frozen TTS (Tower B). All learning sits in the mapper, so the renderer can be swapped." },
      { t: "Speaker vector", mem: "The one wire between towers.", d: "The numeric representation of a voice that the mapper produces and the TTS consumes as its voice-identity input." },
      { t: "Mint pipeline", mem: "Create an identity.", d: "The flow that turns a text description into a stored voice identity, with gates checked before it is saved." },
      { t: "Render pipeline", mem: "Speak a line as that voice.", d: "The flow that takes a stored identity and scripted text and produces audio through the frozen TTS." },
      { t: "Seed clip", mem: "The original audio, kept as insurance.", d: "The source audio stored alongside each speaker vector so identities can be re-extracted if the encoder changes." },
      { t: "Naturalness gate", mem: "A floor that never bites.", d: "A gate with a proposed floor of 75 for how natural a render sounds. Unlike the four gates beside it, it has never rejected a render." }
    ]
  },
  "w1c:2": {
    cheat: [
      "All the learning lives in the mapper, a small head that maps a description into a speaker-vector space the frozen model already knows how to consume.",
      "The speaker vector is the only channel through which training affects the audio.",
      "Training the TTS would break swappability. This project already swapped its renderer once, from Zonos-v0.1 to Qwen3-TTS.",
      "A dependency trained into one checkpoint's quirks would have made that swap far more expensive.",
      "Data cost: training the TTS needs paired description-to-speech data at the scale of the base acoustic model, not the much smaller amount a mapper needs.",
      "Fine-tuning risks catastrophic forgetting of the general speech quality the model already has.",
      "Keeping it frozen makes training one cheap, well-scoped job: learning a mapping into an existing space."
    ],
    terms: [
      { t: "Fine-tuning", mem: "Re-teaching a trained model.", d: "Continuing to train a pretrained model on new data, which changes its weights. Here it is avoided for the TTS." },
      { t: "Catastrophic forgetting", mem: "Learn the new, lose the old.", d: "The loss of previously learned abilities, such as general speech quality, when a model is trained further on narrow data." },
      { t: "Swappability", mem: "Unplug and replace.", d: "The ability to replace a component without redoing the rest. A frozen renderer stays swappable; a fine-tuned one does not." },
      { t: "Paired data", mem: "Description with its recording.", d: "Training examples that link a text description to matching speech. Training the TTS would need them at large scale." }
    ]
  },

  /* ---------------------------------------------------------------- w2a How work splits */
  "w2a:0": {
    cheat: [
      "Sharding splits one dataset across machines by a partition key. The key you choose decides what stays together and what scatters.",
      "Key-range partitioning: each partition owns a contiguous range of keys. Range scans stay on one or few partitions.",
      "Its cost: skewed access (all writes to today's date, say) concentrates load on one partition.",
      "Hash partitioning: a hash of the key picks the partition. Load spreads evenly, but neighbouring keys scatter and range scans are lost.",
      "Rebalancing: when partitions are added, move only a share of the data proportional to the change.",
      "Never tie a key's partition to the total partition count (hash mod N): change N and almost every key moves.",
      "Request routing: a client must find which node holds a key, through any node, a routing tier or a client that knows the map.",
      "Secondary indexes cut across the partition key, so a lookup by another field has to ask every partition or keep a separate index.",
      "The choice is range queries against even load."
    ],
    terms: [
      { t: "Sharding (partitioning)", mem: "One big table, many small pieces.", d: "Splitting a dataset across machines so each holds a part and handles a part of the load." },
      { t: "Partition key", mem: "The label that decides the address.", d: "The field whose value determines which partition a record lives on." },
      { t: "Key-range partitioning", mem: "Dictionary tabs: A to C, D to F.", d: "Each partition owns a contiguous range of keys. Range queries are efficient; skewed access concentrates load." },
      { t: "Hash partitioning", mem: "Shuffle the deck first.", d: "A hash of the key picks the partition. It spreads keys evenly but destroys efficient range scans." },
      { t: "Rebalancing", mem: "Move only what the change needs.", d: "Redistributing data across partitions when nodes are added or removed, without moving far more than the change requires." },
      { t: "Consistent hashing", mem: "A ring, so adding a node steals only a slice.", d: "A scheme that places keys and nodes on a ring so that changing the node count moves only a share of the keys." },
      { t: "Request routing", mem: "Which door has my key?", d: "How a client finds the partition and node that hold a given key." }
    ]
  },
  "w2a:1": {
    cheat: [
      "A key that looks uniform in the abstract is rarely uniform in production: real usage follows a power law.",
      "One customer, one time window or one category dominates the traffic.",
      "A hash spreads the space of possible keys evenly. It does nothing about how much traffic each actual key carries.",
      "So every event for the dominant key still lands on one partition, however good the hash.",
      "In the skew figure: eight partitions, one tall bar (one user carrying four percent of all events), seven well under the capacity line and idle.",
      "That one partition's capacity is the ceiling for the whole system.",
      "A hot partition is a key-choice problem, not a hash-function problem."
    ],
    terms: [
      { t: "Skew", mem: "Uneven pile.", d: "Load or data unevenly distributed across partitions, so some do far more work than others." },
      { t: "Hot partition (hot spot)", mem: "One checkout lane with the queue.", d: "A partition that receives a disproportionate share of traffic and limits the whole system." },
      { t: "Power-law distribution", mem: "A few giants, a long tail of small ones.", d: "A pattern where a few keys carry most of the traffic and most keys carry very little." },
      { t: "Key space versus traffic", mem: "Names are spread, visits are not.", d: "A hash balances the set of possible keys; it cannot balance how often each key is used." },
      { t: "Throughput ceiling", mem: "The slowest lane sets the pace.", d: "The point where the busiest partition is full, so adding other partitions no longer helps." }
    ]
  },
  "w2a:2": {
    cheat: [
      "Fan-out: one request is split into calls to many shards, and the answer waits for all of them.",
      "If each shard is fast with probability 0.99, all 100 are fast with probability 0.99<sup>100</sup>.",
      "ln 0.99 ≈ −0.01, × 100 ≈ −1.005, and e<sup>−1.005</sup> ≈ 0.366. So about 37 percent of requests are fully fast.",
      "That means about 63 percent hit at least one slow shard: 1 − 0.99<sup>100</sup> ≈ 63%.",
      "A component's one-percent tail becomes the system's typical case.",
      "In the tail figure, two of the twelve drawn shards are slow, standing in for each real shard's one-in-a-hundred chance.",
      "Cut the fan-out to 20 shards and 0.99<sup>20</sup> ≈ 0.82, so only about 18 percent of requests are slow.",
      "The cure is fewer things fanned out to, not faster average shards."
    ],
    terms: [
      { t: "Fan-out", mem: "One question, many askees.", d: "A request that is split into calls to many shards or services." },
      { t: "Tail latency", mem: "The slow end of the distribution.", d: "The response times at the high percentiles, such as p99, which are slower than most requests." },
      { t: "p99", mem: "One in a hundred is worse.", d: "The 99th percentile: 99 percent of requests are at least this fast, and the other one percent are slower." },
      { t: "Tail latency amplification", mem: "Many small chances add up to a big one.", d: "The effect where fanning out to many components makes a request likely to hit at least one slow one, so the component's tail becomes the system's typical case." },
      { t: "Independent events", mem: "One shard's bad moment says nothing about another's.", d: "Events whose probabilities multiply. All 100 shards are fast with probability 0.99<sup>100</sup>." }
    ]
  },
  "w2a:3": {
    cheat: [
      "The eval harness replays conversations at a hundred million replays; no single machine holds them or keeps up.",
      "Partition key: scenario id. The scenario is the natural unit of comparison.",
      "All replays of one scenario sit on one shard, so aggregating that scenario stays local instead of scattered across the cluster.",
      "Failure mode: if one scenario family (the default happy-path conversation) is a thousand times more common, its shard is the hot partition.",
      "That hot shard is the ceiling for the whole run, just as a hot user id would be.",
      "The fix: split that one family further by hashing a secondary key such as replay id.",
      "Smaller families stay on one shard, where their results are easy to aggregate.",
      "Adding shards overall does not help: the hot key still sends everything to one shard."
    ],
    terms: [
      { t: "Scenario id", mem: "The test case's name tag.", d: "The key the harness shards by: the unit across which results are compared and aggregated." },
      { t: "Local aggregation", mem: "Add up at home.", d: "Computing a result from data that sits on one shard, with no cross-cluster merge." },
      { t: "Secondary key split", mem: "Break the big pile into smaller piles.", d: "Hashing a second field, such as replay id, inside one oversized key so its load spreads over several shards." },
      { t: "Replay", mem: "Run the recorded conversation again.", d: "One re-execution of a scenario through the system under test, whose result the harness records." },
      { t: "Pay only where needed", mem: "A tax on the heavy family only.", d: "The principle that the cost of splitting is paid only for the family that needs it; the others keep the simple layout." }
    ]
  },
  "w2a:4": {
    cheat: [
      "Shard by user id, and one user is four percent of all traffic.",
      "Four percent of the whole system's load goes to one shard. That shard is the bottleneck, whatever the shard count.",
      "The skew figure shows the same picture: system throughput becomes one partition's throughput while every other partition sits idle.",
      "The change: hash user id together with a secondary key such as session id or a time bucket.",
      "That spreads the heavy user's events across several shards.",
      "The cost: reading all of that user's history, once a simple lookup by user id, must now fan out across those shards and be merged.",
      "That is the tail-latency amplification trade-off from the fan-out diagram.",
      "More than one answer is reasonable. Pick one and state what it costs."
    ],
    terms: [
      { t: "Composite key", mem: "Two labels on one box.", d: "A partition key made from more than one field, such as user id plus session id." },
      { t: "Session id", mem: "One visit, one tag.", d: "An identifier for a single session, used as a secondary key to split a heavy user's events." },
      { t: "Time bucket", mem: "A drawer per hour.", d: "A key made from a slice of time, used to spread one key's events across partitions over time." },
      { t: "Merge on read", mem: "Collect the pieces when asked.", d: "Combining results from several shards at query time, which is the price of splitting one key's data." },
      { t: "Bottleneck", mem: "The narrow part of the bottle.", d: "The component whose capacity limits the whole system." }
    ]
  },

  /* ---------------------------------------------------------------- w2b Derivatives, properly */
  "w2b:0": {
    cheat: [
      "Derivative: f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] / h, the slope of the tangent at one exact point. An instantaneous rate, not an average.",
      "Working form: f(x + dx) ≈ f(x) + f′(x)·dx, so df = f′(x) dx. A tiny nudge in becomes f′ times that nudge out.",
      "Square: (x + dx)<sup>2</sup> = x<sup>2</sup> + 2x·dx + dx<sup>2</sup>. The tiny corner dx<sup>2</sup> vanishes, so d/dx x<sup>2</sup> = 2x.",
      "Standard rules: d/dx x<sup>n</sup> = n x<sup>n−1</sup>, d/dx sin x = cos x, d/dx e<sup>x</sup> = e<sup>x</sup>.",
      "Product rule: (f·g)′ = f′g + fg′. A rectangle f by g grows by two thin strips.",
      "Chain rule: y = f(g(x)) gives dy/dx = f′(g(x))·g′(x). dx becomes dg = g′dx, then dy = f′(g)dg. Scalings compose by multiplying.",
      "Example: d/dx sin(x<sup>2</sup>) = cos(x<sup>2</sup>)·2x.",
      "Number check: (3.01)<sup>2</sup> = 9.0601, a change of 0.0601 against 2·3·0.01 = 0.06."
    ],
    terms: [
      { t: "Derivative", mem: "Slope right here.", d: "The instantaneous rate of change of a function at a point: the slope of the tangent line there." },
      { t: "Tangent line", mem: "The line that just touches.", d: "The straight line that touches a curve at one point and has the curve's slope there." },
      { t: "Nudge (dx)", mem: "A tiny push on the input.", d: "A very small change in the input. The derivative is the factor that scales it into the change in the output." },
      { t: "Product rule", mem: "Two thin strips on a rectangle.", d: "(f·g)′ = f′g + fg′: differentiate one factor at a time and add." },
      { t: "Chain rule", mem: "Nested nudges multiply.", d: "For a function inside a function, the derivative is the outer derivative evaluated at the inner value, times the inner derivative." },
      { t: "Composition", mem: "One function feeding another.", d: "A function built by passing the output of one function into another, written f(g(x))." }
    ]
  },
  "w2b:1": {
    cheat: [
      "Read the outermost operation: a product, a quotient, a power or a sum. Name it before writing anything.",
      "Power: (x<sup>n</sup>)′ = n x<sup>n−1</sup>, so (x<sup>5</sup>)′ = 5x<sup>4</sup>.",
      "Constants come out and sums split: (3x<sup>4</sup> − 2x + 7)′ = 12x<sup>3</sup> − 2. The 7 differentiates to zero.",
      "Product: (f·g)′ = f′g + fg′, so (x<sup>3</sup> sin x)′ = 3x<sup>2</sup> sin x + x<sup>3</sup> cos x.",
      "Quotient: (f/g)′ = (f′g − fg′) / g<sup>2</sup>. Top-prime times bottom, minus top times bottom-prime, over bottom squared. The order matters.",
      "(x<sup>2</sup>/(x + 1))′ = (2x(x + 1) − x<sup>2</sup>) / (x + 1)<sup>2</sup> = (x<sup>2</sup> + 2x) / (x + 1)<sup>2</sup>.",
      "Check by nudging: at x = 1 the formula gives 0.75 and the measured slope from 1 to 1.01 is about 0.751.",
      "Special case: (1/g)′ = −g′/g<sup>2</sup>, which returns with the sigmoid.",
      "Drill fifteen to twenty by hand, rule chosen without looking."
    ],
    terms: [
      { t: "Power rule", mem: "Bring the exponent down, lower it by one.", d: "(x<sup>n</sup>)′ = n x<sup>n−1</sup>." },
      { t: "Quotient rule", mem: "Low d-high minus high d-low, over low squared.", d: "(f/g)′ = (f′g − fg′)/g<sup>2</sup>. The minus sign makes the order matter." },
      { t: "Linearity", mem: "Pull constants out, split the sum.", d: "(c·f + g)′ = c·f′ + g′: constants factor out and sums are differentiated term by term." },
      { t: "Outermost operation", mem: "Peel the outside first.", d: "The last operation applied when the expression is evaluated; it decides which rule to use first." },
      { t: "Numerical check", mem: "Nudge and compare.", d: "Change x by a small amount such as 0.01 and compare the real change in f with the formula's prediction." }
    ]
  },
  "w2b:2": {
    cheat: [
      "Goal: reach σ′(x) = σ(x)(1 − σ(x)) by hand.",
      "Rewrite: σ(x) = 1/(1 + e<sup>−x</sup>) = (1 + e<sup>−x</sup>)<sup>−1</sup>. Outer u<sup>−1</sup>, inner u = 1 + e<sup>−x</sup>.",
      "Chain rule: dσ/dx = −(1 + e<sup>−x</sup>)<sup>−2</sup> · d/dx(1 + e<sup>−x</sup>), and the inside gives −e<sup>−x</sup>.",
      "The two minus signs cancel: σ′(x) = e<sup>−x</sup> / (1 + e<sup>−x</sup>)<sup>2</sup>. Already correct.",
      "Split the square: [1/(1 + e<sup>−x</sup>)] · [e<sup>−x</sup>/(1 + e<sup>−x</sup>)]. The first factor is σ(x).",
      "Write 1 as (1 + e<sup>−x</sup>)/(1 + e<sup>−x</sup>): 1 − σ(x) = e<sup>−x</sup>/(1 + e<sup>−x</sup>), the second factor.",
      "σ(0) = 0.5 ⇒ σ′(0) = 0.25, the peak slope. σ(4) ≈ 0.982 ⇒ σ′(4) ≈ 0.0177, nearly flat in the tails.",
      "Why it is worth having: the forward pass already holds σ(x), so the gradient costs one subtraction and one multiplication."
    ],
    terms: [
      { t: "Sigmoid σ(x)", mem: "The S-shaped squash to 0 and 1.", d: "σ(x) = 1/(1 + e<sup>−x</sup>). It maps any real number to a value between 0 and 1." },
      { t: "Self-referential derivative", mem: "The answer is built from its own output.", d: "A derivative written using the function's own value, as σ′ = σ(1 − σ), so no fresh evaluation of the exponential is needed." },
      { t: "Forward pass", mem: "The trip in, values saved.", d: "Computing the model's outputs from its inputs. The values it produces are kept for use when computing gradients." },
      { t: "Saturation (flat tails)", mem: "Far out, the slope is almost nothing.", d: "Where the function is nearly flat, so its derivative is close to zero. For the sigmoid, σ′(4) ≈ 0.0177." },
      { t: "Backprop", mem: "Gradients walked backwards.", d: "Computing gradients from the output back to the inputs by multiplying local derivatives with the chain rule." }
    ]
  },
  "w2b:3": {
    cheat: [
      "The chain rule differentiates a function inside a function; the power, product and quotient rules cannot.",
      "Notation: x → u → y gives dy/dx = dy/du · du/dx. One ordinary derivative per link.",
      "Evaluate each factor at the value the forward pass left there: the outer derivative at the inner value, not at x.",
      "Example: (3x + 1)<sup>2</sup> at x = 2. u = 7, dy/du = 2u = 14, du/dx = 3, so dy/dx = 14 · 3 = 42.",
      "Check by expanding: 9x<sup>2</sup> + 6x + 1 gives 18x + 6 = 42 at x = 2. Same answer.",
      "With the sigmoid outside: y = σ(2x) gives σ(2x)(1 − σ(2x))·2, and at x = 0 that is 0.25 · 2 = 0.5.",
      "Longer chain x → f<sub>1</sub> → f<sub>2</sub> → f<sub>3</sub> → y: dy/dx = dy/df<sub>3</sub> · df<sub>3</sub>/df<sub>2</sub> · df<sub>2</sub>/df<sub>1</sub> · df<sub>1</sub>/dx.",
      "No factor looks at the whole chain, so it never needs expanding and it scales to long chains.",
      "Autograd is this bookkeeping done automatically: each box remembers what it saw forward, and the backward pass multiplies the local derivatives."
    ],
    terms: [
      { t: "Local derivative", mem: "One link's own slope.", d: "The ordinary derivative of a single function in the chain, evaluated at the value that reached it." },
      { t: "Inner and outer function", mem: "The one inside, the one wrapping it.", d: "In f(g(x)), g is inner and f is outer. The outer derivative is evaluated at g(x)." },
      { t: "Autograd", mem: "The chain rule on a tape.", d: "Automatic differentiation: the framework records the forward pass and multiplies local derivatives backward to give gradients." },
      { t: "Tape", mem: "What each box remembers going forward.", d: "The record of inputs and outputs at each step, which lets the backward pass avoid recomputing the forward pass." },
      { t: "Partial derivative", mem: "One variable moves, the rest stand still.", d: "The derivative with respect to one input of a function of many. Networks need them; they come in week 4 on top of this rule." }
    ]
  },

  /* ---------------------------------------------------------------- w2c Overfitting, by mechanism */
  "w2c:0": {
    cheat: [
      "Training loss falling proves nothing alone: a model that learns and one that memorises look identical until validation loss turns.",
      "In the overfit figure the dashed 'stop here' line marks where validation loss has just turned upward while training loss is still falling.",
      "L2 penalises the sum of squared weights. It shrinks every weight toward zero, never exactly to it, so no one feature can drive a sharp response.",
      "L1 penalises the sum of absolute weights. It drives some weights to exactly zero: feature selection, not only shrinkage.",
      "Early stopping changes when training stops, not what the model could fit. It reads the turn off the validation curve, before there is time to fit noise.",
      "Dropout removes units at random during training, so no single path can be relied on. It forces redundancy.",
      "More or augmented data raises the amount of real structure to explain, so memorising examples becomes a worse strategy than learning the pattern.",
      "Name each by its mechanism, not its label."
    ],
    terms: [
      { t: "Overfitting", mem: "Memorised the answers, not the subject.", d: "A model fits noise and specifics of the training set, so training loss keeps falling while loss on held-out data rises." },
      { t: "Validation loss", mem: "The exam on unseen questions.", d: "The loss measured on held-out data the model is not trained on; its upward turn signals overfitting." },
      { t: "L2 regularisation", mem: "Shrink, never delete.", d: "A penalty on the sum of squared weights that shrinks them toward zero without making them exactly zero." },
      { t: "L1 regularisation", mem: "Prune to exactly zero.", d: "A penalty on the sum of absolute weights that drives some weights to exactly zero, selecting features." },
      { t: "Early stopping", mem: "Leave when the exam score turns.", d: "Halting training when validation loss starts to rise, before the model fits noise." },
      { t: "Dropout", mem: "Bench some players each game.", d: "Randomly removing units during training so no single path can be relied on, which forces redundancy." },
      { t: "Data augmentation", mem: "More examples from the ones you have.", d: "Creating varied versions of training examples so the model has more structure to explain before memorising pays off." }
    ]
  },
  "w2c:1": {
    cheat: [
      "Pick one intervention as the first choice on your own work, and give the reason.",
      "Early stopping first, because it costs nothing to add.",
      "A held-out metric is already tracked on every run in the eval harness, so watching it turn and stopping there reuses what exists.",
      "It is not an architecture change and not a new hyperparameter.",
      "Regularisation and dropout each need a guess in advance: a penalty strength or a drop rate.",
      "Better to see the overfitting once, with early stopping catching it, before guessing at those knobs.",
      "Reach for regularisation or dropout once early stopping alone is not enough.",
      "Mechanisms differ: dropout removes paths, L2 shrinks magnitudes, more data moves the turning point right."
    ],
    terms: [
      { t: "Hyperparameter", mem: "A knob you set before training.", d: "A setting chosen ahead of training, such as a penalty strength or a drop rate, rather than learned from data." },
      { t: "Held-out metric", mem: "The score on data kept aside.", d: "A measure computed on data not used for training, tracked each run in the eval harness." },
      { t: "Penalty strength", mem: "How hard the weights are taxed.", d: "The coefficient on a regularisation term, which sets how strongly large weights are discouraged." },
      { t: "Drop rate", mem: "Share of units benched.", d: "The fraction of units dropout removes at random during each training step." },
      { t: "Cost of an intervention", mem: "Free, or needs a guess?", d: "What it takes to add: extra tuning, an architecture change, or nothing beyond signals you already track." }
    ]
  },

  /* ---------------------------------------------------------------- wc3 Design: evidence ingestion */
  "wc3:0": {
    cheat: [
      "The path: upload, then type detection, then a parser per type, then one normalised document model.",
      "Native PDFs: use the text layer.",
      "Scans and ERP screenshots: OCR with layout analysis.",
      "Spreadsheets: read as cells, never flattened into text.",
      "Walkthrough recordings: transcripts with timestamps.",
      "Large documents go straight to storage by presigned upload (multipart), with a metadata split from the payload."
    ],
    terms: [
      { t: "Type detection", mem: "Look at the file before choosing the tool.", d: "Identifying a document's kind so the right parser handles it." },
      { t: "Text layer", mem: "Text already inside the PDF.", d: "The machine-readable text embedded in a native PDF, which needs no OCR." },
      { t: "OCR", mem: "Reading pictures of text.", d: "Optical character recognition: turning scanned or image text into characters." },
      { t: "Layout analysis", mem: "Where things sit on the page.", d: "Finding the regions, tables and reading order on a page, alongside recognising the text." },
      { t: "Normalised document model", mem: "One shape for every source.", d: "A common internal form that every parser's output is converted into." }
    ]
  },
  "wc3:1": {
    cheat: [
      "Every span carries its document, page and bounding box; for recordings, a timestamp.",
      "Derived artifacts keep a pointer back to their source spans.",
      "This is the most important decision in the system.",
      "If coordinates are dropped at parse time, citations become impossible later.",
      "No amount of cleverness downstream recovers them.",
      "The same need appears in three-hundred-page records: point at the exact passage."
    ],
    terms: [
      { t: "Span", mem: "A marked stretch of text.", d: "A piece of extracted content with its source location attached." },
      { t: "Bounding box", mem: "A rectangle around it on the page.", d: "The coordinates of the region on a page that a span occupies." },
      { t: "Provenance", mem: "Where did this come from?", d: "The record linking a derived value back to the source spans it was built from." },
      { t: "Citation", mem: "A pointer you can click.", d: "A reference from an answer to the exact source passage, possible only if coordinates were kept." },
      { t: "Derived artifact", mem: "Made from the source, points back to it.", d: "Anything computed from source content, such as a summary or extracted value, which keeps pointers to its spans." }
    ]
  },
  "wc3:2": {
    cheat: [
      "Fixed-size chunking cuts tables in half and separates a value from its column header.",
      "Keep tables as structured objects with cell coordinates.",
      "An extracted amount can then be cited to an exact cell.",
      "Treat screenshots as structure too, not as a flat block of text.",
      "MetaRAG: chunking and metadata interact, and the right choice depends on the corpus."
    ],
    terms: [
      { t: "Fixed-size chunking", mem: "Cut every N characters.", d: "Splitting text into equal-sized pieces regardless of structure, which can cut a table in half." },
      { t: "Structured table object", mem: "Rows and columns kept as such.", d: "A table stored with its cells and headers rather than as text." },
      { t: "Cell coordinates", mem: "Row and column address.", d: "The position of a cell in a table, kept so a value can be cited to it." },
      { t: "Column header", mem: "The label that gives a number meaning.", d: "The title of a column; a value without it is ambiguous." },
      { t: "MetaRAG finding", mem: "Chunking and metadata interact.", d: "The result that the best chunking and metadata choice depends on the corpus." }
    ]
  },
  "wc3:3": {
    cheat: [
      "OCR gives a confidence per region.",
      "A low-confidence value that an attribute test depends on must not be quietly trusted.",
      "It pushes the result to insufficient, or forces a human check.",
      "Dropping the item would bias the sample.",
      "Say the honest line: no OCR in production yet; the layers on both sides of it are built.",
      "Expect to be slow on OCR specifics for a couple of weeks and fast on everything around them."
    ],
    terms: [
      { t: "Parser confidence", mem: "How sure the reader is.", d: "A per-region score from OCR of how likely its reading is correct." },
      { t: "Attribute test", mem: "A check on a value.", d: "An audit check whose outcome depends on a particular extracted value." },
      { t: "Insufficient", mem: "Not enough to decide.", d: "A result state used when the evidence is too uncertain to pass or fail an item." },
      { t: "Human check", mem: "Hand it to a person.", d: "Routing a low-confidence case to someone to verify." },
      { t: "Carry uncertainty forward", mem: "Surface it, never hide it.", d: "Passing confidence along with the value so later steps and users can see it." }
    ]
  },
  "wc3:4": {
    cheat: [
      "One index per client engagement, never shared.",
      "Hybrid retrieval: lexical plus dense.",
      "Invoice numbers, dates and amounts must match exactly: lexical search is good at that and dense embeddings are bad at it.",
      "MetaRAG transfers: prefix metadata into the text before encoding.",
      "Do not blend sparse and dense vectors that do not share a space.",
      "NotebookLM example: hybrid retrieval filtered by notebook, reranked from about forty candidates to twelve."
    ],
    terms: [
      { t: "Tenant index", mem: "One engagement, one index.", d: "A separate search index for each client engagement, never shared across clients." },
      { t: "Lexical search", mem: "Exact words and numbers.", d: "Retrieval that matches the literal terms, strong for identifiers like invoice numbers." },
      { t: "Dense retrieval", mem: "Meaning, not letters.", d: "Retrieval by embedding similarity, which captures meaning but is weak on exact identifiers." },
      { t: "Hybrid retrieval", mem: "Both, then merge.", d: "Combining lexical and dense results for coverage of exact and semantic matches." },
      { t: "Metadata prefix", mem: "Label the text before encoding.", d: "Adding metadata to the text before it is embedded, instead of blending vectors from different spaces." },
      { t: "Rerank", mem: "A second, closer look.", d: "Reordering a candidate list with a stronger model, for example from about forty to twelve." }
    ]
  },
  "wc3:5": {
    cheat: [
      "Per-tenant storage and encryption keys.",
      "No cross-tenant index or cache.",
      "Model calls stay inside the tenant boundary, or go to a provider with zero data retention.",
      "Isolation constrains which models you can use.",
      "That makes it a question worth asking of any vendor in this space.",
      "Prompt injection can arrive inside a user's own sources."
    ],
    terms: [
      { t: "Tenant isolation", mem: "No leaking between clients.", d: "Keeping each client's data, keys, indexes and caches separate from every other client's." },
      { t: "VPC deployment", mem: "Runs inside the client's walls.", d: "Deploying the system inside the client's own virtual private cloud." },
      { t: "Per-tenant encryption key", mem: "A separate lock for each client.", d: "A distinct key for each tenant's data, so one key cannot unlock another's." },
      { t: "Zero data retention", mem: "The provider keeps nothing.", d: "A provider's commitment not to store the prompts and outputs it processes." },
      { t: "Prompt injection", mem: "Instructions hidden in the data.", d: "Text in a source document that tries to steer the model; here it can arrive inside a user's own sources." }
    ]
  },
  "wc3:6": {
    cheat: [
      "An engagement might mean tens of thousands of pages.",
      "Estimate OCR cost and time per page.",
      "Estimate storage per page, with coordinates.",
      "Latency barely matters: this is batch work.",
      "Correctness matters absolutely.",
      "Saying which constraint does not matter is as useful as saying which does."
    ],
    terms: [
      { t: "Batch work", mem: "Done in bulk, not on demand.", d: "Processing a large set of items in the background, where throughput matters more than response time." },
      { t: "Cost per page", mem: "Price tag per sheet.", d: "The OCR and processing cost for one page, multiplied by the page count to size the job." },
      { t: "Storage per page", mem: "Bytes a page leaves behind.", d: "The space one page needs, including its text and coordinates." },
      { t: "Binding constraint", mem: "The one that actually limits.", d: "The requirement that governs the design; here correctness, not latency." },
      { t: "Non-constraint", mem: "Name what you can ignore.", d: "A requirement that does not matter for this workload, such as latency for batch ingestion." }
    ]
  },

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
  },

  /* ---------------------------------------------------------------- w4a Things break at a hundred million */
  "w4a:0": {
    cheat: [
      "Distributed systems fail in parts. Partial failure, where some of an operation succeeds and some silently fails, is the defining problem.",
      "Networks: packets can be delayed, dropped, reordered or duplicated. A timeout cannot tell a slow response from a lost one.",
      "Clocks: they drift and can jump on resynchronisation, so wall-clock timestamps cannot order events across machines.",
      "Truth: a node cannot fully trust its own view. After a long pause it may still believe it holds a lock it has lost.",
      "Fencing token: the resource checks the token on every write and rejects one from a stale lock holder.",
      "Exactly-once delivery is not available from an unreliable network.",
      "What is available: at-least-once delivery plus idempotent processing, which gives an exactly-once effect.",
      "That combination is the design target whenever the network cannot be trusted."
    ],
    terms: [
      { t: "Partial failure", mem: "Half done, nobody told.", d: "A failure where part of an operation succeeds and part does not, with no single point where the whole thing visibly breaks." },
      { t: "Timeout", mem: "A guess dressed as a fact.", d: "A limit on how long to wait for a reply. When it fires, the caller cannot tell whether the request was slow, lost or never processed." },
      { t: "Unreliable clock", mem: "Two watches, two times.", d: "A machine's wall clock drifts relative to others and can jump when resynchronised, so timestamps from different machines do not reliably give the order of events." },
      { t: "Fencing token", mem: "A ticket number the door checks.", d: "A number that increases each time a lock is granted. The resource rejects a write carrying an older token, so a paused node with a lost lock cannot corrupt data." },
      { t: "At-least-once delivery", mem: "Keep sending until it is acknowledged.", d: "A guarantee that a message arrives one or more times, never zero. Duplicates are possible, so the receiver has to cope with them." },
      { t: "Exactly-once effect", mem: "Delivered twice, applied once.", d: "The outcome that an operation takes effect once even if its message arrives several times. It comes from at-least-once delivery plus idempotent processing." }
    ]
  },
  "w4a:1": {
    cheat: [
      "A retry storm: every failed client retries at once, adding load exactly when the service has the least capacity to spare.",
      "Retries wait behind the same congestion that caused the timeouts, so the service never gets a lull to drain its backlog.",
      "Without spacing, N contending clients can force roughly N<sup>2</sup> total work, because they keep colliding every round.",
      "Exponential backoff: each client waits longer after each failure. That slows individual clients.",
      "Backoff alone still returns clients in synchronised clusters, so the spikes re-form round after round.",
      "Jitter: randomise the wait inside each backoff window. It spreads the clusters into something close to a constant rate.",
      "With a hundred contending clients, backoff plus jitter cut call counts by more than half compared with backoff alone.",
      "Ship them together: jitter is what makes backoff actually work."
    ],
    terms: [
      { t: "Retry storm", mem: "Everyone knocks again at once.", d: "A surge of retries from many failed clients that adds load to an already overloaded service and can turn a brownout into an outage." },
      { t: "Exponential backoff", mem: "Wait twice as long each time.", d: "A retry policy where the delay grows by a fixed factor after each failed attempt, so a client eases off the longer the failure lasts." },
      { t: "Jitter", mem: "Shake the schedule.", d: "Randomness added to the backoff delay so that clients do not all come back at the same moment." },
      { t: "Synchronised wave", mem: "A marching band, not a crowd.", d: "Many clients arriving together because they waited the same interval. It recreates the spike that caused the failure." },
      { t: "Recovery window", mem: "A lull to catch your breath.", d: "A brief drop in load during which an overloaded service can drain its backlog. Retries that keep arriving remove it." }
    ]
  },
  "w4a:2": {
    cheat: [
      "Idempotent: a request can be retransmitted or retried with no additional side effects. The result happens once however many times the call is made.",
      "The mechanism is a unique, caller-provided request token.",
      "The token is not derived from the parameters: identical parameters can still be two different intents.",
      "A retry with the same token gets back the same response as the original call, so it is transparent to the caller.",
      "The same token with different parameters is rejected as an error: it signals a mismatched intent, not a resend.",
      "Retries are guaranteed to happen under at-least-once delivery. Idempotency guarantees they are harmless when they do.",
      "That is why exactly-once delivery is mostly a marketing claim and at-least-once plus idempotency is how real systems get the effect.",
      "The same token idea applies to payments, emails and any other side effect."
    ],
    terms: [
      { t: "Idempotent", mem: "Press the lift button twice: same lift.", d: "Describes an operation that can be applied more than once with the same result as applying it once." },
      { t: "Idempotency key", mem: "A receipt number the caller brings.", d: "A unique token supplied by the caller with a request. The server uses it to recognise a retry and return the stored response instead of acting again." },
      { t: "Side effect", mem: "Something that leaves a mark.", d: "A change outside the function's return value, such as a charge, an email or a database write. These are what make retries dangerous." },
      { t: "Mismatched intent", mem: "Same ticket, different order.", d: "A request that reuses an earlier idempotency key with different parameters. It is rejected as an error, not treated as a retry." },
      { t: "Outbox", mem: "Write the letter and the note together.", d: "A pattern where the intent to perform a side effect is stored in the same transaction as the data change, then delivered later, so neither is lost or repeated." }
    ]
  },
  "w4a:3": {
    cheat: [
      "The exercise: three percent of a hundred million replays fail mid-run, which is three million failures.",
      "Do not treat the three percent as one bucket. Split it by failure signature.",
      "Deterministic failure: it fails the same way every attempt (a malformed payload, a scenario the harness cannot construct). Dead-letter it at once, because retrying only burns capacity.",
      "Coin-flip failure: a timeout or a transient lock. Retry with exponential backoff and jitter, capped at a small number of attempts.",
      "Dedup key: the replay's scenario id, with the attempt number stored beside it.",
      "A retried replay then overwrites its own prior partial result instead of appending a second one.",
      "That keeps the operation idempotent under at-least-once delivery.",
      "The dead-letter queue is where deterministic failures wait for a person."
    ],
    terms: [
      { t: "Dead-letter queue", mem: "The pile for what cannot be delivered.", d: "A queue that holds items which have failed for good, so they stop consuming retries and can be inspected by a person." },
      { t: "Deterministic failure", mem: "Fails the same way every time.", d: "A failure caused by the input itself, so every retry hits the same error. Retrying cannot help." },
      { t: "Transient failure", mem: "A coin flip.", d: "A failure that may not recur, such as a timeout or a brief lock. It is worth retrying, with backoff, jitter and a cap." },
      { t: "Retry cap", mem: "A limit on knocking.", d: "A small maximum number of attempts, after which the item is dead-lettered. It stops retries recreating the storm." },
      { t: "Deduplication key", mem: "The label that spots a repeat.", d: "A stable identifier, here the scenario id with its attempt number, used to make a repeated operation overwrite its earlier result." }
    ]
  },
  "w4a:4": {
    cheat: [
      "Question: why do retries sometimes finish off a struggling service?",
      "It is already at or past capacity, so every retry adds load when there is least capacity to spare.",
      "The retries wait behind the same congestion that caused the timeouts.",
      "Clients keep re-arriving faster than the service can drain, so it never gets the lull it needs. That is the retry storm.",
      "The fix has two halves: backoff spaces out when each client comes back.",
      "Jitter stops every client's backoff landing on the same schedule and rebuilding the spike.",
      "Neither half works well alone. The answer to name is exponential backoff with jitter."
    ],
    terms: [
      { t: "Brownout", mem: "Dim, not dark.", d: "A state where a service is overloaded and slow but still partly working. Retries can push it into a full outage." },
      { t: "Backlog", mem: "The queue of work not yet done.", d: "Requests waiting to be processed. A service recovers only when the backlog shrinks faster than new work arrives." },
      { t: "Capacity headroom", mem: "Spare room in the bucket.", d: "The difference between what a service can handle and what it is being asked to handle. Retries consume it exactly when it is smallest." }
    ]
  },

  /* ---------------------------------------------------------------- w4b Gradients and descent */
  "w4b:0": {
    cheat: [
      "Take f(w<sub>1</sub>, w<sub>2</sub>) = w<sub>1</sub><sup>2</sup> + 3w<sub>2</sub><sup>2</sup>, a stand-in for a loss with two parameters.",
      "Partial derivative: ∂f/∂w<sub>1</sub> = lim<sub>h→0</sub> [f(w<sub>1</sub> + h, w<sub>2</sub>) − f(w<sub>1</sub>, w<sub>2</sub>)] / h. Nudge one input, hold the others fixed.",
      "In practice, differentiate in one variable and treat the rest as constants: ∂f/∂w<sub>1</sub> = 2w<sub>1</sub>, ∂f/∂w<sub>2</sub> = 6w<sub>2</sub>.",
      "Gradient: ∇f = (∂f/∂w<sub>1</sub>, …, ∂f/∂w<sub>n</sub>), one entry per input. At (1, 1), ∇f = (2, 6).",
      "Why it points uphill: for a small step u, f(w + εu) ≈ f(w) + ε ∇f · u, and ∇f · u = |∇f| cos θ.",
      "That is largest when θ = 0, so the steepest rise is along ∇f and the steepest fall is along −∇f. The length |∇f| is the steepness.",
      "One descent step of size 0.1: (1, 1) − 0.1 · (2, 6) = (0.8, 0.4).",
      "f falls from 1 + 3 = 4 to 0.64 + 0.48 = 1.12."
    ],
    terms: [
      { t: "Partial derivative", mem: "Wiggle one dial, freeze the rest.", d: "The rate at which a function's output changes when one input is nudged and every other input is held fixed." },
      { t: "Gradient", mem: "The list of all the slopes.", d: "The vector ∇f of all the partial derivatives, one per input, evaluated at a point. It points in the direction of steepest increase." },
      { t: "Dot product", mem: "Biggest when they line up.", d: "u · v = |u||v| cos θ. For a given length it is largest when the two vectors point the same way." },
      { t: "Steepest descent direction", mem: "Straight downhill.", d: "The direction −∇f. It lowers f faster than any other direction for a small step." },
      { t: "Gradient magnitude", mem: "How steep, not which way.", d: "The length |∇f|. A large value means f is changing quickly at that point." }
    ]
  },
  "w4b:1": {
    cheat: [
      "The rule: θ ← θ − η ∇L(θ). θ is the parameters, ∇L(θ) the gradient of the loss, η the learning rate.",
      "One parameter at a time: θ<sub>j</sub> ← θ<sub>j</sub> − η ∂L/∂θ<sub>j</sub>. η multiplies the gradient and nothing else.",
      "Why the minus: L(θ − η g) ≈ L(θ) − η |g|<sup>2</sup> with g = ∇L(θ). A step along −g lowers L. A plus would raise it by the same amount.",
      "Run it on L(θ) = θ<sup>2</sup>, ∇L = 2θ, minimum at 0, from θ = 3.",
      "η = 0.1: θ ← 0.8θ, so 3 → 2.4 → 1.92 → 1.54. It walks to 0 with shrinking steps.",
      "η = 1.1: θ ← −1.2θ, so 3 → −3.6 → 4.32 → −5.18. Each step jumps past 0 and lands farther away.",
      "η = 1.0: θ ← −θ, so 3 → −3 → 3. It bounces forever. Below 1.0 this loss converges.",
      "η sets how far you step. The gradient sets which way."
    ],
    terms: [
      { t: "Update rule", mem: "New = old minus a nudge.", d: "The formula θ ← θ − η ∇L(θ) that moves the parameters one step against the gradient." },
      { t: "Learning rate (η)", mem: "Stride length.", d: "The step size. It scales the gradient and leaves its direction alone. Too large overshoots; too small crawls." },
      { t: "Parameters (θ)", mem: "The dials being turned.", d: "The numbers the update changes. The loss is only read, never changed directly." },
      { t: "Overshoot", mem: "Right direction, too far.", d: "A step so large that it jumps past the minimum and lands at a higher loss, so the steps oscillate or grow." },
      { t: "Divergence", mem: "Getting worse each step.", d: "When the iterates move away from the minimum without settling. On L = θ<sup>2</sup> it happens for η > 1." },
      { t: "Gradient ascent", mem: "Climb instead of descend.", d: "Adding the gradient instead of subtracting it. It moves toward higher loss." }
    ]
  },
  "w4b:2": {
    cheat: [
      "A network is a function with many tunable numbers: its weights and biases. Training changes those numbers.",
      "The cost is one number for how wrong the network is on the training data. Lower is better.",
      "Gradient descent needs, for every weight, how much a small nudge would move the cost. That list is the gradient.",
      "Backprop computes that gradient efficiently. In plain words, it is the blame each weight carries for the error.",
      "An early weight changes the cost only through every layer after it, so its blame depends on each later layer's sensitivity.",
      "So the blame is worked out backward: start at the output, where the error is measured, and pass each layer's share to the layer before it.",
      "Say that plain version before opening the calculus chapter. The maths is then detail on something already understood."
    ],
    terms: [
      { t: "Weights and biases", mem: "The network's dials.", d: "The tunable numbers of a network. Training adjusts them so the output matches what is wanted." },
      { t: "Cost function", mem: "One number for how wrong.", d: "A single value measuring the network's error over the training data. Gradient descent nudges every parameter to lower it." },
      { t: "Backpropagation", mem: "Hand the blame backward.", d: "An efficient way to compute the gradient of the cost with respect to every weight by working backward from the output, layer by layer." },
      { t: "Sensitivity", mem: "How much a nudge matters.", d: "How much the cost moves for a small change in a weight or an activation. It is what blame means here." }
    ]
  },
  "w4b:3": {
    cheat: [
      "The network: h = w<sub>1</sub>x, a = σ(h), z = w<sub>2</sub>a, L = (z − y)<sup>2</sup>. Take x = 2, w<sub>1</sub> = 0.5, w<sub>2</sub> = 1.5, y = 1.",
      "Forward pass, and keep every value: h = 1.0, a ≈ 0.731, z ≈ 1.097, L ≈ 0.0093.",
      "Local derivatives, one per step: dL/dz = 2(z − y), dz/da = w<sub>2</sub>, da/dh = a(1 − a), dh/dw<sub>1</sub> = x.",
      "Backward starts at the loss: dL/dz = 2(1.097 − 1) ≈ 0.193.",
      "w<sub>2</sub> is one step from the loss: dL/dw<sub>2</sub> = dL/dz · dz/dw<sub>2</sub> = 0.193 · a ≈ 0.193 · 0.731 ≈ 0.141.",
      "w<sub>1</sub> is three steps back: dL/dw<sub>1</sub> = dL/dz · dz/da · da/dh · dh/dw<sub>1</sub>.",
      "With numbers: a(1 − a) = 0.731 · 0.269 ≈ 0.197, so dL/dw<sub>1</sub> ≈ 0.193 · 1.5 · 0.197 · 2 ≈ 0.114.",
      "Check by nudging: [L(w<sub>1</sub> + 0.001) − L(w<sub>1</sub>)] / 0.001 ≈ 0.114.",
      "Each local derivative is evaluated at the value that step saw on the forward pass. That is the tape autograd keeps."
    ],
    terms: [
      { t: "Chain rule", mem: "Multiply the slopes along the path.", d: "∂L/∂x = ∂L/∂y · ∂y/∂x. The derivative of a composition is the product of the derivatives of its parts." },
      { t: "Local derivative", mem: "One step's own slope.", d: "The derivative of a single step with respect to its input, such as dz/da = w<sub>2</sub>. It looks at that step only." },
      { t: "Forward pass", mem: "Compute and keep the numbers.", d: "Running the network from input to loss while storing every intermediate value, because the backward pass needs them." },
      { t: "Backward pass", mem: "Multiply back along the chain.", d: "Walking from the loss back to each weight, multiplying the local derivatives on the path." },
      { t: "Sigmoid", mem: "The S-shaped squash.", d: "σ(h) squashes any number into (0, 1). Its slope can be written with its own output: σ′ = a(1 − a)." },
      { t: "Numerical gradient check", mem: "Nudge it and see.", d: "Estimating a derivative as [L(w + δ) − L(w)] / δ for a small δ, to confirm a chain-rule answer." }
    ]
  },
  "w4b:4": {
    cheat: [
      "A network is a composition: L = f<sub>3</sub>(f<sub>2</sub>(f<sub>1</sub>(x))).",
      "Chain rule: dL/dx = (dL/df<sub>3</sub>) · (df<sub>3</sub>/df<sub>2</sub>) · (df<sub>2</sub>/df<sub>1</sub>) · (df<sub>1</sub>/dx), each factor at the value it saw.",
      "Backward walk: δ<sub>k</sub> = ∂L/∂f<sub>k</sub>, and δ<sub>k−1</sub> = δ<sub>k</sub> · ∂f<sub>k</sub>/∂f<sub>k−1</sub>.",
      "A weight's gradient is the sensitivity already at its layer times one local factor: ∂L/∂w<sub>k</sub> = δ<sub>k</sub> · ∂f<sub>k</sub>/∂w<sub>k</sub>.",
      "So the path product is not redone for each weight. Every weight in or before a layer reuses the same δ.",
      "Payoff: one backward pass for all n weights, against n passes if you start over for each.",
      "Autograd is not a separate trick. It is the chain rule applied automatically to the tape recorded on the forward pass.",
      "Two sentences: layers compose, so the chain rule gives a product; one backward walk reuses that product for every weight."
    ],
    terms: [
      { t: "Composition", mem: "Functions in a row.", d: "A function built by feeding the output of one function into the next, as f<sub>3</sub>(f<sub>2</sub>(f<sub>1</sub>(x))). A network is one." },
      { t: "Sensitivity δ", mem: "The blame already at this layer.", d: "δ<sub>k</sub> = ∂L/∂f<sub>k</sub>, how the loss reacts to layer k's output. Each earlier layer's δ is the next one's times a local derivative." },
      { t: "Reuse", mem: "Compute once, share.", d: "Every weight in or before a layer needs the same δ, so backward computes it once instead of per weight." },
      { t: "Autograd", mem: "The chain rule on a tape.", d: "Automatic differentiation: record the forward pass as a tape, then apply the chain rule to it backward." },
      { t: "Cost of training", mem: "One pass, not n.", d: "Backward gives all the gradients for a small constant times the cost of one forward pass, instead of n times that." }
    ]
  },

  /* ---------------------------------------------------------------- w4c Embeddings and attention */
  "w4c:0": {
    cheat: [
      "The embedding table is E ∈ ℝ<sup>V×d</sup>: V rows, one per token, d numbers per row, filled with small random values (about 0.01) before training. Nothing in it means anything yet.",
      "A lookup is a one-hot vector times E: e<sub>t</sub> = E[t] = onehot(t) · E. So E is an ordinary weight matrix and a lookup is a row pick.",
      "Because the picked row sits inside the loss, the gradient reaches it and gradient descent updates it like any weight.",
      "Skip-gram objective: p(o | c) = exp(u<sub>o</sub> · v<sub>c</sub>) / ∑<sub>w</sub> exp(u<sub>w</sub> · v<sub>c</sub>), with L = −log p(o | c).",
      "Gradient on the row: ∂L/∂v<sub>c</sub> = −u<sub>o</sub> + ∑<sub>w</sub> p(w | c) · u<sub>w</sub>.",
      "Update: v<sub>c</sub> ← v<sub>c</sub> + η (u<sub>o</sub> − ∑<sub>w</sub> p(w | c) · u<sub>w</sub>). The row moves toward the word that really appeared and away from the ones the model over-favoured.",
      "Only looked-up rows move: ∂L/∂E[t′] = 0 for every token not in the example.",
      "Worked step with η = 0.5: u<sub>o</sub> = (1.0, 0.5) and ∑ p u = (0.2, 0.1) move v<sub>c</sub> by (0.4, 0.2).",
      "Tokens in similar contexts get similar pulls, again and again, so their rows end up close. The meaning is a side effect of the objective."
    ],
    terms: [
      { t: "Embedding table", mem: "A dictionary of vectors.", d: "A V×d weight matrix with one row of d numbers per token. It starts random and is trained like any other weight." },
      { t: "One-hot vector", mem: "All zeros, one switch on.", d: "A vector of zeros with a single 1 at the token's position. Multiplied by the table, it picks out that token's row." },
      { t: "Softmax", mem: "Scores to shares of 1.", d: "Raise e to each score, then divide by the total, so every output is positive and they add to 1." },
      { t: "Skip-gram", mem: "Guess the neighbour.", d: "A training task: given a centre token c, predict a neighbouring token o. The loss is −log p(o | c)." },
      { t: "Objective (loss)", mem: "What the training rewards.", d: "The quantity gradient descent lowers. Useful arrangements of the rows are those that make it smaller." },
      { t: "Zero gradient for unused rows", mem: "Only what you touch moves.", d: "A token not in the current example has ∂L/∂E[t′] = 0, so its row does not change in that step." }
    ]
  },
  "w4c:1": {
    cheat: [
      "Q, K and V are three learned projections of the same input: q<sub>i</sub> = x<sub>i</sub> W<sup>Q</sup>, k<sub>i</sub> = x<sub>i</sub> W<sup>K</sup>, v<sub>i</sub> = x<sub>i</sub> W<sup>V</sup>.",
      "The idea borrowed is a dictionary lookup: return the value stored under the key that matches the query. Only one record answers.",
      "Attention makes it soft. Score the query against every key: s<sub>ij</sub> = q<sub>i</sub> · k<sub>j</sub>.",
      "Softmax turns scores into weights that are positive and add to 1: α<sub>ij</sub> = exp(s<sub>ij</sub>) / ∑<sub>l</sub> exp(s<sub>il</sub>).",
      "Output is the weighted blend of values: out<sub>i</sub> = ∑<sub>j</sub> α<sub>ij</sub> v<sub>j</sub>.",
      "Query: what this position is looking for. Key: what each position offers, which decides how much to read. Value: the content that is carried forward.",
      "V is value, not vector. Every one of Q, K and V is a vector.",
      "All at once: Attention(Q, K, V) = softmax(Q K<sup>T</sup> / √d<sub>k</sub>) V. The √d<sub>k</sub> is the next step.",
      "Example with d<sub>k</sub> = 2, scaling left out: q = (1, 0), keys (2, 0), (0, 2), (1, 0) give s = (2, 0, 1), α ≈ (0.665, 0.090, 0.245), and with v = (1, 0), (0, 1), (1, 1) the output is ≈ (0.910, 0.335)."
    ],
    terms: [
      { t: "Query", mem: "The question being asked.", d: "A projection of a position's input, x W<sup>Q</sup>, saying what that position is looking for." },
      { t: "Key", mem: "The label on the shelf.", d: "A projection, x W<sup>K</sup>, advertising what a position offers. It is matched against queries and decides how much is read." },
      { t: "Value", mem: "What you take off the shelf.", d: "A projection, x W<sup>V</sup>, holding the content a position hands over once it is read. V stands for value, not vector." },
      { t: "Soft lookup", mem: "A dictionary that blends.", d: "Instead of one exact key matching, every key is scored against the query and the scores weight a blend of all the values." },
      { t: "Attention weights (α)", mem: "Shares of attention, sum to 1.", d: "The softmax of the query-key scores. Weight α<sub>ij</sub> says how much position i reads from position j." },
      { t: "Dot-product score", mem: "How well they line up.", d: "s<sub>ij</sub> = q<sub>i</sub> · k<sub>j</sub>, a number that is larger when the key fits the query." }
    ]
  },
  "w4c:2": {
    cheat: [
      "A score is a sum of d<sub>k</sub> products: q · k = ∑<sub>m=1..d<sub>k</sub></sub> q<sub>m</sub> k<sub>m</sub>.",
      "Assume entries have mean 0, variance 1 and are independent. Real vectors are only roughly like this.",
      "Each product term has mean 0, so Var(q<sub>m</sub> k<sub>m</sub>) = E[q<sub>m</sub><sup>2</sup>] · E[k<sub>m</sub><sup>2</sup>] = 1.",
      "Independent terms add their variances: Var(q · k) = d<sub>k</sub>, so the spread is √d<sub>k</sub>. This is the heart of the step.",
      "Large scores saturate softmax: one weight goes near 1 and the rest near 0.",
      "Then ∂α<sub>j</sub>/∂s<sub>j</sub> = α<sub>j</sub>(1 − α<sub>j</sub>) → 0, so almost no gradient passes back and learning stalls.",
      "Dividing by c divides the variance by c<sup>2</sup>: Var(q · k / √d<sub>k</sub>) = d<sub>k</sub> / d<sub>k</sub> = 1. Choosing c = √d<sub>k</sub> cancels the growth exactly.",
      "d<sub>k</sub> = 64 gives std = 8. Unscaled, softmax(16, 0, −8) ≈ (1.0000, 0.0000001, 0.00000000004): one weight takes everything.",
      "Scaled by 8, softmax(2, 0, −1) ≈ (0.84, 0.11, 0.04). The gradient factor for the top weight is 0.84 · 0.16 ≈ 0.13.",
      "It is a variance argument, not an arbitrary constant."
    ],
    terms: [
      { t: "Variance", mem: "The spread, squared.", d: "Var(x) is the average squared distance from the average. When the average is 0 it is the average of x squared." },
      { t: "Additive variance", mem: "Independent terms stack.", d: "The variance of a sum of independent terms is the sum of their variances. A dot product over d<sub>k</sub> dimensions therefore has variance d<sub>k</sub>." },
      { t: "Softmax saturation", mem: "Winner takes all.", d: "When scores are far apart, one weight goes near 1 and the rest near 0, so the gradient α(1 − α) is nearly zero." },
      { t: "Scaled dot-product", mem: "Divide to keep the spread at 1.", d: "Dividing scores by √d<sub>k</sub> brings their standard deviation back to about 1 whatever d<sub>k</sub> is, since dividing by c divides variance by c<sup>2</sup>." },
      { t: "Softmax gradient", mem: "α times one-minus-α.", d: "∂α<sub>j</sub>/∂s<sub>j</sub> = α<sub>j</sub>(1 − α<sub>j</sub>). It is near 0 when α<sub>j</sub> is near 0 or 1, the same shape as the sigmoid slope σ(1 − σ)." }
    ]
  },

  /* ---------------------------------------------------------------- wc2 Design: an agent that tests a SOX control */
  "wc2:0": {
    cheat: [
      "The exercise: given a control (every journal entry over fifty thousand dollars is approved by a second person before posting) and a pile of evidence, produce a workpaper a reviewer will sign.",
      "The pipeline: control definition, test plan with attributes, population query, sample, evidence retrieval per item, attribute testing, citation verification, exceptions, drafted conclusion, reviewer queue.",
      "Only attribute testing and the drafted narrative are the model.",
      "Everything that decides a fact is code.",
      "Say that split out loud. It is the whole design in one sentence."
    ],
    terms: [
      { t: "Control", mem: "A rule the company must follow.", d: "A stated procedure whose operation is tested, here that journal entries over fifty thousand dollars get a second approver before posting." },
      { t: "Workpaper", mem: "The signed record of the test.", d: "The document an auditor produces to show what was tested, how, on what evidence, and what was concluded. A reviewer signs it." },
      { t: "Population", mem: "Everything that could be tested.", d: "The full set of items the control applies to, pulled by a query before any sample is taken." },
      { t: "Attribute", mem: "One thing to check per item.", d: "A single property tested on each sampled item, such as whether a second person approved it before posting." },
      { t: "Code versus model split", mem: "Facts in code, prose in the model.", d: "Deterministic steps decide every fact; the model does only attribute testing and the narrative." }
    ]
  },
  "wc2:1": {
    cheat: [
      "Sample selection is seeded code, not a prompt.",
      "Random sampling uses a stored seed. Judgmental sampling has a human record the reason.",
      "The seed, the population query and its row count all go into the workpaper, so anyone can rerun the selection and get the same items.",
      "Sample size comes from the firm's methodology table, not from a prompt.",
      "Underneath: a deterministic, side-effect-free step can be re-run, which is why it belongs in code and not in a model call."
    ],
    terms: [
      { t: "Seeded sampling", mem: "Same seed, same sample.", d: "Random selection driven by a stored seed, so the same population and seed always yield the same items." },
      { t: "Judgmental sampling", mem: "A person chooses, and says why.", d: "Selection by a human who records the reason for each choice in the workpaper." },
      { t: "Methodology table", mem: "The firm's lookup for how many.", d: "The firm's own rule for sample size, which the code reads instead of a prompt deciding." },
      { t: "Deterministic step", mem: "Rerun it, get the same answer.", d: "A step whose output depends only on its inputs, so it can be repeated and checked." },
      { t: "Reproducibility", mem: "Anyone can redo it.", d: "The property that a reviewer can rerun the selection from the recorded seed, query and row count and obtain the same items." }
    ]
  },
  "wc2:2": {
    cheat: [
      "Citation is constrained selection, not generation.",
      "Evidence is chunked with its coordinates: document, page, bounding box, character span.",
      "The model sees chunks labelled E1 to En and must cite handles. It never writes a document name or page number.",
      "Code resolves each handle to coordinates and renders the red box.",
      "A verifier then checks that the cited span contains the extracted value: exact match for amounts, dates and IDs.",
      "If it does not match, it fails closed.",
      "Same structure as the opaque handles in your memory system. Say so."
    ],
    terms: [
      { t: "Evidence chunk", mem: "A piece with its address.", d: "A segment of a source document stored together with its document, page, bounding box and character span." },
      { t: "Opaque handle", mem: "A label with no meaning to invent.", d: "A short identifier such as E3 that the model can select but not forge, which code resolves to coordinates." },
      { t: "Constrained selection", mem: "Pick from a menu, do not write.", d: "Letting the model choose from options code supplied, so a fabricated citation becomes impossible, not merely unlikely." },
      { t: "Span verification", mem: "Check the quote holds the value.", d: "A deterministic check that the cited span actually contains the extracted value, by exact match for amounts, dates and IDs." },
      { t: "Fail closed", mem: "When unsure, refuse.", d: "On a failed check, reject the result instead of letting it through." }
    ]
  },
  "wc2:3": {
    cheat: [
      "Each sampled item gets a structured result per attribute: pass, fail, or insufficient.",
      "With it come the cited handles, the extracted value and a short rationale.",
      "Insufficient is not an error. It is the honest answer when the evidence is thin, and it routes to a human.",
      "This is the WheelPrice coverage-score story in a new domain.",
      "A partial answer stated as partial beats a confident wrong one."
    ],
    terms: [
      { t: "Three-valued result", mem: "Pass, fail, or not enough.", d: "An attribute outcome with a third value, insufficient, so the system does not have to force a yes or no." },
      { t: "Insufficient", mem: "The honest shrug.", d: "The result for thin or ambiguous evidence. It is a first-class answer that routes to a human, not an error." },
      { t: "Structured output", mem: "Fields, not free text.", d: "A fixed shape for each result: outcome, cited handles, extracted value and a short rationale." },
      { t: "Human routing", mem: "Hand it to a person.", d: "Sending uncertain items to a reviewer rather than guessing." }
    ]
  },
  "wc2:4": {
    cheat: [
      "Exceptions are derived by code from the attribute results.",
      "The conclusion's verdict comes from a rule over the exception count and severity.",
      "The model drafts the narrative around a verdict it cannot change.",
      "So the model can never write that a control is operating effectively when code has recorded an exception."
    ],
    terms: [
      { t: "Exception", mem: "A failed attribute, recorded.", d: "An item where a tested attribute failed, derived by code from the attribute results." },
      { t: "Verdict rule", mem: "Counts and severity decide.", d: "A rule over the exception count and severity that sets the conclusion, so the model does not." },
      { t: "Constrained conclusion", mem: "Words around a fixed answer.", d: "A narrative the model drafts around a verdict it cannot alter." },
      { t: "Operating effectively", mem: "The claim code protects.", d: "The conclusion that a control works. It cannot be written while code has recorded an exception." }
    ]
  },
  "wc2:5": {
    cheat: [
      "Log every model call: the handles it saw, its output, the model version and the prompt version.",
      "Log every reviewer decision too, including overrides.",
      "Overrides are the most valuable data the company has: labelled examples of exactly where the system is wrong.",
      "They feed evaluation directly.",
      "The systems name is event sourcing: an append-only log of immutable facts.",
      "The workpaper is a derived view that can be rebuilt from the log.",
      "Say that sentence and the audit log stops sounding like logging."
    ],
    terms: [
      { t: "Audit log", mem: "The record that cannot be edited.", d: "An append-only record of every model call and reviewer decision, with versions of the model and prompt." },
      { t: "Event sourcing", mem: "Store the facts, derive the view.", d: "A design where an append-only log of immutable facts is the source of truth and current state is derived from it." },
      { t: "Override", mem: "The reviewer says no.", d: "A reviewer decision that changes the system's output. Each one is a labelled example of an error." },
      { t: "Derived view", mem: "Rebuildable from the log.", d: "A representation, here the workpaper, that can be recomputed at any time from the logged events." },
      { t: "Human in the loop", mem: "A person signs.", d: "A reviewer approves or overrides the output before it counts, appropriate where someone signs the result." }
    ]
  },
  "wc2:6": {
    cheat: [
      "Build a gold set from past signed workpapers.",
      "Track attribute-level agreement with reviewers, not just end verdicts.",
      "Citation precision is fully deterministic (does the cited span contain the value), so it can gate releases.",
      "Watch the insufficient rate: rising means evidence retrieval got worse; falling suddenly may mean the model started guessing.",
      "Replay the gold set on every model or prompt change. That is your eval harness."
    ],
    terms: [
      { t: "Gold set", mem: "Answers already signed.", d: "A set of past signed workpapers used as the reference the system is scored against." },
      { t: "Attribute-level agreement", mem: "Agree on the parts, not just the whole.", d: "How often the system's result on each attribute matches the reviewer's, rather than only the final verdict." },
      { t: "Citation precision", mem: "Does the quote hold the value.", d: "The share of citations whose span contains the extracted value. It is checkable by match, so it needs no human labels and can gate a release." },
      { t: "Insufficient rate", mem: "A dial that signals drift.", d: "The share of results marked insufficient. A rise points to worse retrieval and a sudden fall may mean guessing." },
      { t: "Replay", mem: "Run the old cases again.", d: "Running the gold set through the system on every model or prompt change to catch regressions." }
    ]
  },
  "wc2:7": {
    cheat: [
      "Say the whole design out loud in eight minutes.",
      "Then write its three weakest points in the Answer field.",
      "Likely weak point: retrieval missing the right evidence entirely, which no verifier can catch.",
      "Likely weak point: OCR errors on scanned evidence.",
      "Likely weak point: controls whose attributes are judgment calls rather than checkable facts."
    ],
    terms: [
      { t: "Retrieval miss", mem: "The right page never shown.", d: "A failure where the needed evidence is never retrieved. A verifier checks only what was cited, so it cannot catch this." },
      { t: "OCR error", mem: "The scan misread.", d: "A mistake in text extracted from scanned evidence, which can make a correct value look wrong or the reverse." },
      { t: "Judgment attribute", mem: "No fact to check.", d: "An attribute that depends on judgment rather than a checkable fact, so code cannot verify it by matching." }
    ]
  },

  /* ---------------------------------------------------------------- w5a Caching, then putting it together */
  "w5a:0": {
    cheat: [
      "A leader takes the writes and copies them to followers, which serve reads.",
      "The copy arrives a moment late. That delay is replication lag.",
      "Read your own write from a lagging follower and you can get stale data, with no cache anywhere.",
      "Read-your-writes: a user immediately sees their own write, even when reads come from a lagging replica.",
      "Monotonic reads: a user never sees data go backwards in time. Consistent prefix reads: writes appear in the order they happened.",
      "Eventual consistency: replicas converge if no new writes arrive. It gives no bound on how long that takes, so it cannot say how stale a read is.",
      "A cache adds a second, independent source of staleness on top of this one.",
      "Skip leader election, multi-leader conflicts and leaderless replication for this pass."
    ],
    terms: [
      { t: "Replication lag", mem: "The copy arrives late.", d: "The delay between a write landing on the leader and that write becoming visible on a follower." },
      { t: "Leader", mem: "The one that takes writes.", d: "The replica that accepts writes and sends them on to the followers." },
      { t: "Follower", mem: "Reads from the copy.", d: "A replica that applies the leader's writes and serves reads, so it can be slightly behind." },
      { t: "Read-your-writes", mem: "See what you just did.", d: "The guarantee that a user immediately sees their own write, even when reads are served from a lagging replica." },
      { t: "Eventual consistency", mem: "Gets there, no deadline.", d: "Replicas converge given enough time with no new writes. It makes no promise about how long that takes." },
      { t: "Monotonic reads", mem: "Time never runs backwards.", d: "A guarantee that a user who has seen newer data will not later read older data from another replica." }
    ]
  },
  "w5a:1": {
    cheat: [
      "A cache is a copy kept close to the reader. It is staleness you choose to accept for speed.",
      "Placement: the cache sits between the request path and whatever is expensive to recompute.",
      "Key: exactly what makes a result reusable. User plus query, so one user's results never reach another.",
      "Too broad a key merges requests that differ; too narrow a key never gets a hit.",
      "TTL: a bet that staleness up to a bounded window is acceptable. It costs nothing on the write path.",
      "Explicit invalidation: a promise, kept on every write path, to clear the entries that write affects.",
      "Invalidation fails silently: a missed path serves wrong answers until something else clears them, and a later write path can break it unseen.",
      "Settle in this order: placement, key, staleness window, then the invalidation rule."
    ],
    terms: [
      { t: "Cache-aside", mem: "Look, miss, fetch, fill.", d: "The application checks the cache first, and on a miss reads the source and stores the result in the cache." },
      { t: "Cache key", mem: "What counts as the same request.", d: "The value that identifies a cached entry. It decides which requests share a result." },
      { t: "TTL", mem: "An expiry timer.", d: "Time to live: an entry is dropped after a fixed window. It bounds staleness by the clock, not by writes." },
      { t: "Explicit invalidation", mem: "Clear it when it changes.", d: "Removing or updating cached entries as part of every write that changes the underlying data." },
      { t: "Staleness window", mem: "How wrong, for how long.", d: "The span of time during which a cached answer may differ from the source and still be acceptable." },
      { t: "Hot key", mem: "One entry everyone wants.", d: "A single cached key that receives a disproportionate share of requests, so it becomes a load point of its own." }
    ]
  },
  "w5a:2": {
    cheat: [
      "Question: a memory assistant caches vector-search results. A user adds a memory. What happens to the cache?",
      "Where it sits: in front of the vector search step.",
      "Key: user id plus the query, so one user's results never leak into another's.",
      "Rule: explicit invalidation, not TTL. A write for that user clears their cached searches at once.",
      "Why not TTL: the window would let the assistant answer from a world that no longer exists. The product's promise is that it remembers.",
      "What you give up: cache effectiveness right after every write. Write then search is a guaranteed miss.",
      "Operating cost: every write path must honour the rule, including ones added later by someone unaware of the cache.",
      "The tradeoff is the answer, not the fact that a cache exists."
    ],
    terms: [
      { t: "Scoped invalidation", mem: "Clear one user's shelf.", d: "Invalidating only the entries belonging to the user who wrote, so the cost stays small and other users keep their hits." },
      { t: "Guaranteed miss", mem: "Write, then search, then pay.", d: "A search that must go to the source because the write just cleared its cached result." },
      { t: "Write path", mem: "Every door that changes data.", d: "Any code that changes the underlying data. Each one must carry out the invalidation rule." },
      { t: "Four-part answer", mem: "Where, key, rule, cost.", d: "The shape of a cache answer: where it sits, what the key is, the invalidation rule, and what you give up." },
      { t: "Read-your-writes (cache)", mem: "It remembers what it was told.", d: "In this answer, the guarantee that a search right after a write reflects that write. A stale cache breaks it." }
    ]
  },
  "w5a:3": {
    cheat: [
      "This step is a performance: five minutes, out loud, no notes, no product names. The recording is the artifact.",
      "Start with rate: units per second, size of each, and even or bursty. Bursts need headroom an average hides.",
      "Bound the queue on purpose. An unbounded queue hides overload until memory runs out, then fails all at once.",
      "Backpressure pushes the limit upstream so the producer slows. If it cannot, shed load deliberately.",
      "Partition by a key you can defend, and assume skew. Real usage follows a power law, so plan for the hot partition.",
      "At this scale a one-in-a-million failure happens about a hundred times a day. Partial failure is normal.",
      "Retries use exponential backoff with jitter, and the operation must be idempotent. At-least-once plus idempotency gives exactly-once effects.",
      "Size from p99, not the mean. Every primitive carries a cost: queue for memory, partitions for coordination, retries for capacity."
    ],
    terms: [
      { t: "Throughput", mem: "How many per second.", d: "Units of work arriving or completing per second. A hundred million of anything is a throughput question before a storage one." },
      { t: "Bounded queue", mem: "A queue with a ceiling.", d: "A queue with a fixed maximum size, so overload shows early instead of being absorbed silently." },
      { t: "Backpressure", mem: "Tell the sender to slow down.", d: "Pushing the capacity limit upstream so the producer slows rather than the consumer piling up work it cannot finish." },
      { t: "Load shedding", mem: "Drop on purpose.", d: "Deliberately refusing some work when overloaded, on your own terms, instead of letting the system fail unpredictably." },
      { t: "Partition key and skew", mem: "Even in theory, lopsided in practice.", d: "The key that splits data across partitions. Skew is one partition carrying far more than an even share." },
      { t: "Idempotency", mem: "Safe to do twice.", d: "An operation whose repeat has the same effect as one run, which makes retries safe." },
      { t: "Tail latency", mem: "The slowest one percent.", d: "Latency at a high percentile such as p99. It is dominated by heavy users and made worse by their retries." }
    ]
  },
  "w5a:4": {
    cheat: [
      "Listen back twice: once for content, once for delivery.",
      "Content asks whether every primitive got said. Delivery asks how: filler words, order, pace.",
      "Write exactly three sentences for next time, each a concrete change.",
      "Cut the filler that shows under pressure first. Here that is 'so'.",
      "Order should follow cause and effect. A skewed key often causes the saturation, so name the partition key before the queue's response.",
      "Trim what ran long. The cost section becomes one line on the tradeoff between resilience and capacity.",
      "A listener should be able to say back the constraint you were optimising for, not the vocabulary."
    ],
    terms: [
      { t: "Filler word", mem: "The verbal crutch.", d: "A word such as 'so' used as a connector between sentences, which shows most under pressure." },
      { t: "Content versus delivery", mem: "What, then how.", d: "Content is whether each primitive was said. Delivery is how it was said: filler, ordering and pacing." },
      { t: "Cause-and-effect order", mem: "Say it as it fails.", d: "Ordering the answer to match how the failure happens, such as skew before the queue saturating." },
      { t: "Time budget", mem: "Five minutes is the wall.", d: "The fixed length of the answer. A long section either pushes something out or runs past the mark." },
      { t: "Optimised constraint", mem: "What you were protecting.", d: "The limit each choice was made for, which a listener should be able to name after the answer." }
    ]
  },

  /* ---------------------------------------------------------------- w5b Probability */
  "w5b:0": {
    cheat: [
      "A random variable X: Ω → ℝ turns each outcome into a number. Die: X = the face showing.",
      "A distribution is p(x) = P(X = x) ≥ 0 with Σ<sub>x</sub> p(x) = 1. Fair die: six values of 1/6.",
      "P(A | B) = P(A ∩ B) / P(B): keep only the outcomes in B, then rescale.",
      "Die, A = six, B = even: P(A | B) = (1/6) / (1/2) = 1/3. Three even outcomes, one of them a six.",
      "P(B | A) = P(even | 6) = 1, so P(A | B) ≠ P(B | A). The two directions count over different groups.",
      "P(A ∩ B) = P(A | B) · P(B) = P(B | A) · P(A): the same overlap written two ways.",
      "Equate them and divide by P(B): P(A | B) = P(B | A) · P(A) / P(B). That is Bayes' theorem.",
      "P(B) = P(B | A) · P(A) + P(B | ¬A) · P(¬A): B can arrive by either route, so add both."
    ],
    terms: [
      { t: "Random variable", mem: "A number tagged onto each outcome.", d: "A rule X: Ω → ℝ that assigns a number to every outcome of a random process." },
      { t: "Distribution", mem: "The list of chances that adds to one.", d: "The probabilities p(x) = P(X = x) of each value. Each is at least zero and together they sum to one." },
      { t: "Conditional probability", mem: "Shrink the world to B, then rescale.", d: "P(A | B) = P(A ∩ B) / P(B): the share of the outcomes in B that are also in A." },
      { t: "Base-rate fallacy", mem: "Swapping the bar and ignoring how common things are.", d: "Treating P(A | B) as if it were P(B | A). The two condition on different populations." },
      { t: "Bayes' theorem", mem: "Conditioning written two ways.", d: "P(A | B) = P(B | A) · P(A) / P(B). It flips a conditional when you know the reverse direction." },
      { t: "Total probability", mem: "Add every route to B.", d: "P(B) = P(B | A) P(A) + P(B | ¬A) P(¬A). It is the usual denominator in Bayes." }
    ]
  },
  "w5b:1": {
    cheat: [
      "The question: 99% sensitive, 5% false positive rate, 1 person in 1,000 ill. Given a positive, P(ill)?",
      "Count people, not percentages. Take 100,000: ill = 0.001 × 100,000 = 100, healthy = 99,900.",
      "Ill group: true positives = 0.99 × 100 = 99, false negatives = 1.",
      "Healthy group: false positives = 0.05 × 99,900 = 4,995, true negatives = 94,905.",
      "Positive column = 99 + 4,995 = 5,094.",
      "P(ill | +) = 99 / 5,094 ≈ 0.0194 ≈ 2%.",
      "Bayes gives the same: (0.99 × 0.001) / (0.99 × 0.001 + 0.05 × 0.999) = 0.00099 / 0.05094 ≈ 0.0194.",
      "Why: the healthy pool is 999 times the ill one, and the test claws back only a factor of about 20, leaving about 50 false alarms per true case."
    ],
    terms: [
      { t: "Sensitivity", mem: "The share of the ill the test catches.", d: "P(+ | ill). Here 0.99, so 99 of 100 ill people test positive." },
      { t: "False positive rate", mem: "Healthy people the test wrongly flags.", d: "P(+ | healthy). Here 0.05, which on 99,900 healthy people gives 4,995." },
      { t: "Prevalence", mem: "How rare the thing is to begin with.", d: "The share of the population that is ill before any test. Here 1 in 1,000." },
      { t: "Population table", mem: "Four cells of people.", d: "Ill and healthy, each split by the test result. The answer is read off the positive column." },
      { t: "Posterior", mem: "The belief after the evidence.", d: "P(ill | +), the chance of being ill once you know the test came back positive. Here about 2%." },
      { t: "Positive predictive value", mem: "Of those flagged, how many are real.", d: "The ill share of the positive column: true positives over all positives, 99 / 5,094." }
    ]
  },
  "w5b:2": {
    cheat: [
      "One formula for the table: P(ill | +) = s·r / (s·r + f·(1 − r)), with r prevalence, s sensitivity, f false positive rate.",
      "r = 1/10,000 per 100,000: 10 ill, 9.9 caught; 99,990 healthy, 4,999.5 false alarms; 9.9 / (9.9 + 4,999.5) ≈ 0.002.",
      "Fraud 1/500, caught 90%, false alarm 2%: 200 fraud, 180 flagged; 99,800 fine, 1,996 flagged; 180 / 2,176 ≈ 0.083, about 11 of 12 flags false.",
      "Same test (s = 0.99, f = 0.05), four prevalences: r = 0.001 gives 1.9%, 0.01 gives 17%, 0.1 gives 69%, 0.5 gives 95%.",
      "Odds form: posterior odds = prior odds × s/f. Here 1/999 × 0.99/0.05 ≈ 0.0198, about 1 to 50.",
      "The test multiplies odds by about 20 and no more, so the starting point decides the answer.",
      "Break-even: s·r = f·(1 − r) ⇒ r = f / (s + f) = 0.05 / 1.04 ≈ 0.048.",
      "Below about 4.8% prevalence, a positive from this test is more likely wrong than right."
    ],
    terms: [
      { t: "Prior odds", mem: "Where you start before the test.", d: "r / (1 − r), the odds of the condition in the population. At 1 in 1,000 that is 1 to 999." },
      { t: "Likelihood ratio", mem: "The most the test can multiply your odds.", d: "s / f, sensitivity over false positive rate. About 20 here (0.99 / 0.05 = 19.8)." },
      { t: "Posterior odds", mem: "Prior odds times the test's factor.", d: "r/(1 − r) × s/f. It is the odds form of Bayes' theorem." },
      { t: "Break-even prevalence", mem: "Where true and false alarms tie.", d: "r = f / (s + f), found by setting s·r = f·(1 − r). About 4.8% for this test." },
      { t: "False alarm", mem: "A flag on something that is fine.", d: "A positive from the healthy group. When the condition is rare, false alarms outnumber real cases." },
      { t: "Fixed test, moving base rate", mem: "Same test, different answer.", d: "With s and f held constant, the answer to P(ill | +) is set by r alone, from 1.9% at 0.001 to 95% at 0.5." }
    ]
  },
  "w5b:3": {
    cheat: [
      "Softmax: p<sub>i</sub> = e<sup>z<sub>i</sub></sup> / Σ<sub>j</sub> e<sup>z<sub>j</sub></sup>. Exponentiate each score, divide by the total.",
      "It is a distribution: e<sup>z</sup> > 0 gives p<sub>i</sub> > 0, and dividing by the sum gives Σ<sub>i</sub> p<sub>i</sub> = 1.",
      "z = (2, 1, 0) ⇒ e<sup>z</sup> = (7.39, 2.72, 1.00), sum 11.11 ⇒ p = (0.665, 0.245, 0.090).",
      "Cross-entropy with a one-hot y: L = −Σ y<sub>i</sub> log p<sub>i</sub> = −log p<sub>c</sub>, the negative log of the true class's probability.",
      "That is negative log-likelihood, so minimising it is maximum likelihood.",
      "L = −z<sub>c</sub> + log Σ e<sup>z<sub>j</sub></sup> ⇒ ∂L/∂z<sub>i</sub> = p<sub>i</sub> − y<sub>i</sub>. Big when wrong, small when right, nothing else multiplied in.",
      "Squared error on softmax carries p(1 − p) factors, which go to zero as softmax saturates.",
      "True score 0, wrong score 6: p<sub>true</sub> ≈ 0.0025. Cross-entropy pushes with ≈ −0.998, squared error with ≈ −0.0049, about 200 times weaker."
    ],
    terms: [
      { t: "Softmax", mem: "Exponentiate, then normalise.", d: "Maps scores z to p<sub>i</sub> = e<sup>z<sub>i</sub></sup> / Σ<sub>j</sub> e<sup>z<sub>j</sub></sup>, entries that are positive and sum to one." },
      { t: "Probability distribution", mem: "Non-negative, adds to one.", d: "A list of chances that are never negative and total one. That is the whole definition." },
      { t: "One-hot label", mem: "A 1 on the right class, 0 elsewhere.", d: "The target vector y with y<sub>c</sub> = 1 for the true class c, which leaves one term in the cross-entropy sum." },
      { t: "Cross-entropy", mem: "Surprise at the true class.", d: "L = −Σ y<sub>i</sub> log p<sub>i</sub>. With a one-hot label it is −log p<sub>c</sub>." },
      { t: "Negative log-likelihood", mem: "Same loss, seen as fitting.", d: "−log of the probability the model gives the observed answer. Minimising it is maximum likelihood." },
      { t: "Saturation", mem: "Output pinned near 0 or 1.", d: "When softmax is near-certain, p(1 − p) is near zero, so squared error's gradient nearly vanishes even when the model is wrong." },
      { t: "Gradient p − y", mem: "Prediction minus target.", d: "The derivative of softmax cross-entropy with respect to the scores. Its size tracks the error directly." }
    ]
  },

  /* ---------------------------------------------------------------- w5c The source-filter model */
  "w5c:0": {
    cheat: [
      "A voiced sound has two parts: a source (what makes it) and a filter (what shapes it).",
      "Y(f) = E(f) · H(f): source spectrum times filter gain, frequency by frequency. Two independent factors.",
      "Source: the vocal folds buzz at F<sub>0</sub>, so energy sits at f<sub>k</sub> = k · F<sub>0</sub>. Adult male F<sub>0</sub> is roughly 85 to 180 Hz.",
      "Filter: the tract resonates at F<sub>n</sub> = (2n − 1) · c / (4L). With L = 17.5 cm and c = 350 m/s: 500, 1500, 2500 Hz.",
      "On a dB scale the product is a sum: log |Y| = log |E| + log |H|, so a spectrum plot lets you read them apart.",
      "Change the source: F<sub>0</sub> 100 → 200 Hz moves the harmonics to 200, 400, 600 Hz. The formants stay at 500, 1500, 2500.",
      "Change the filter: L 17.5 → 15 cm lifts the formants to 583, 1750, 2917 Hz. F<sub>0</sub> does not move.",
      "So pitch lives on the source and identity lives on the filter.",
      "Where it bends: [s] and [f] have a noise source with no F<sub>0</sub>, and the same filter still shapes it."
    ],
    terms: [
      { t: "Source", mem: "What makes the sound.", d: "The raw sound before shaping: vocal-fold vibration for vowels and nasals, or turbulence noise for sounds like [s], [f] and [sh]." },
      { t: "Filter", mem: "What shapes the sound.", d: "The vocal tract, whose shape decides which frequencies are amplified and which are damped. It multiplies the source spectrum." },
      { t: "F<sub>0</sub> (fundamental frequency)", mem: "The buzz rate.", d: "How many times a second the vocal folds buzz. It sets the pitch." },
      { t: "Harmonics", mem: "Multiples of the buzz.", d: "The energy of a repeating buzz sits at F<sub>0</sub>, 2F<sub>0</sub>, 3F<sub>0</sub> and so on. They move when F<sub>0</sub> moves." },
      { t: "Formants", mem: "The tube's loud notes.", d: "The peaks of the filter, F<sub>1</sub>, F<sub>2</sub>, F<sub>3</sub>: the frequencies the tract's shape resonates at and boosts. They move with tract shape and length, not with F<sub>0</sub>." },
      { t: "Transfer function H(f)", mem: "Out over in, per frequency.", d: "The filter's gain at each frequency: the amplitude B at the lips divided by the amplitude A of a pure tone fed in at the glottis." },
      { t: "Closed-open tube", mem: "Odd multiples of c/4L.", d: "A tube closed at one end and open at the other resonates at (2n − 1) · c / (4L). It is the simple model of the tract." }
    ]
  },
  "w5c:1": {
    cheat: [
      "A measurement is clean only if it moves when its own side moves and stays put when the other side does.",
      "f0_mean = (1/N) Σ F<sub>0</sub>(t): the mean pitch track over voiced frames. Source side; no formant enters it.",
      "L = ½ [ c / (4F<sub>1</sub>) + 5c / (4F<sub>3</sub>) ], using F<sub>1</sub> and F<sub>3</sub> only. Filter side; F<sub>0</sub> is not in it.",
      "Check: F<sub>1</sub> = 500, F<sub>3</sub> = 2500, c = 35 000 cm/s gives ½ (17.5 + 17.5) = 17.5 cm.",
      "Spectral tilt is meant to read the source's shape: a least-squares slope of dB against log<sub>2</sub> f, in dB per octave.",
      "The slope weights each bin by w<sub>i</sub> = (x<sub>i</sub> − x̄)<sup>2</sup> / Σ (x<sub>j</sub> − x̄)<sup>2</sup>. Bins far from the band's middle count most.",
      "Linear bins crowd the top of an octave axis, so 27 bins below 500 Hz carry 43.2% of the fit. 500 Hz to 4 kHz: 27.4% over 308 bins. Above 4 kHz: 29.4% over 341 bins.",
      "Those 27 bins hold the first F<sub>0</sub> harmonics: F<sub>0</sub> = 100 Hz puts four under 500, F<sub>0</sub> = 220 Hz puts two.",
      "So moving F<sub>0</sub> moves 43% of the fit with the filter fixed. S21 measured r = +0.918 with F<sub>0</sub> on voices of constant envelope slope."
    ],
    terms: [
      { t: "f0_mean", mem: "Source only.", d: "The mean of the pitch track over voiced frames, pitch tracked with pYIN in this project. It sits entirely on the source side." },
      { t: "Vocal-tract length estimate", mem: "Built from F<sub>1</sub> and F<sub>3</sub>.", d: "L = ½ [ c / (4F<sub>1</sub>) + 5c / (4F<sub>3</sub>) ], with c = 35 000 cm/s. F<sub>2</sub> is left out because it swings with the vowel." },
      { t: "Spectral tilt", mem: "Slope of the average spectrum.", d: "The least-squares slope of level in dB against frequency in octaves. It is meant to read the source's spectral shape." },
      { t: "Least-squares slope", mem: "The line closest to all points.", d: "The slope Σ (x − x̄)(y − ȳ) / Σ (x − x̄)<sup>2</sup>, where x̄ is the mean of x. It minimises the squared vertical gaps to the points." },
      { t: "Octave axis", mem: "A doubling is one step.", d: "x = log<sub>2</sub> f counts octaves, since an octave is a doubling of frequency." },
      { t: "Leverage weight w<sub>i</sub>", mem: "Far from the middle pulls hardest.", d: "The share of the slope that bin i carries, set by how far its x is from x̄. The 27 bins below 500 Hz carry 43.2%." },
      { t: "Leak across the split", mem: "A source wobble inside a filter number.", d: "A measure meant for one side that also moves when the other side changes. Source and filter vary independently, so a leaking measure cannot tell which changed." }
    ]
  },
  "w5c:2": {
    cheat: [
      "Harmonics are samples of the envelope, taken every F<sub>0</sub> hertz. The tilt is a line fitted to whatever samples it is given.",
      "Two voices, one filter. Harmonic level A<sub>k</sub> = |E(f<sub>k</sub>)| · |H(f<sub>k</sub>)|: same curves, different sample points.",
      "Across 80 to 8000 Hz: N ≈ 7920 / F<sub>0</sub>, so 88 harmonics at 90 Hz and 32 at 250 Hz. That is 2.8 times fewer.",
      "FFT bin width = 24 000 / 2048 = 11.7 Hz. Bins per harmonic: 90 Hz → 7.7, 250 Hz → 21.3.",
      "Each harmonic fills about one bin; the rest is the floor between peaks. The higher voice has 2.8 times more floor per harmonic.",
      "A flat floor pulls the slope toward 0 dB per octave. Real voices filter that floor too, which softens the effect.",
      "The heavy bins (27 below 500 Hz, 43.2% of the fit) hold five harmonics for 90 Hz (90 to 450) but one for 250 Hz (250).",
      "So tilt follows F<sub>0</sub> while the envelope stays put. S21: r = +0.918 with the envelope slope held constant.",
      "What tilt reads is how the harmonics happen to sample the envelope, not the envelope."
    ],
    terms: [
      { t: "Harmonic spacing", mem: "Neighbours are F<sub>0</sub> apart.", d: "Harmonics sit at multiples of F<sub>0</sub>, so a 90 Hz voice samples the envelope every 90 Hz and a 250 Hz voice every 250 Hz." },
      { t: "Envelope", mem: "The curve under the peaks.", d: "The smooth shape set by source and filter together. Harmonics are samples of it, not the envelope itself." },
      { t: "Spectral floor", mem: "Low ground between peaks.", d: "The low-energy bins between harmonics. The tilt fit sees them as well as the peaks." },
      { t: "FFT bin width", mem: "Rate over window.", d: "Sample rate divided by n_fft: 24 000 / 2048 = 11.7 Hz at this project's settings." },
      { t: "Sampling artefact", mem: "The pitch, not the voice.", d: "A difference in a measure caused by how a source property samples the thing measured. With identical filters, the tilt gap between two pitches is entirely this." },
      { t: "Correlation r", mem: "Plus one: they rise together.", d: "A number from −1 to +1; near +1 the two quantities rise together. S21's r = +0.918 between F<sub>0</sub> and tilt, with the envelope slope held constant, means the axis reads pitch." }
    ]
  },

  /* ---------------------------------------------------------------- wc32 The cache code review (Mercor) */
  "wc32:0": {
    cheat: [
      "Assumptions first: one process or many, threads or asyncio, cost of compute, pure or not, read-to-write ratio, staleness allowed, user input or not.",
      "Then the same order every time: one caller, concurrency, memory, errors, staleness, visibility.",
      "One caller: read it literally. await in a non-async function, or a set with no value, is a bug before any race.",
      "Concurrency: two misses on one key both run compute: double cost, double side effects.",
      "Memory: a dict that never evicts grows with every distinct key and keeps every value alive.",
      "Errors: an exception stores nothing, so every caller retries at once; a stored failure is served forever.",
      "Staleness: no expiry means wrong forever once the source changes.",
      "Visibility: without hit ratio, size and timing, nobody knows if the cache helps."
    ],
    terms: [
      { t: "Cache hit, cache miss", mem: "Found it, or go and get it.", d: "A hit returns a stored value; a miss means computing or fetching it from the source." },
      { t: "Pure function", mem: "Same in, same out, nothing else touched.", d: "A function whose result depends only on its inputs and that has no side effects; only these are safe to cache without care." },
      { t: "Side effect", mem: "Something changes outside the function.", d: "Any effect beyond the return value, such as a write, a payment or a message; running it twice does it twice." },
      { t: "Staleness", mem: "Old, and still being served.", d: "How far a cached value may lag the source; the tolerance is a product decision, stated per kind of data." }
    ]
  },
  "wc32:1": {
    cheat: [
      "Check-then-act is two steps: a second caller can miss between the check and the set.",
      "In CPython one dict get or set is atomic under the GIL; check plus set is not.",
      "One lock around everything is correct but makes every hit wait behind a slow miss.",
      "Double-checked locking: check, take the lock only on a miss, check again, compute, store.",
      "Per-key locks stop one slow key from blocking the others.",
      "Single-flight: the first miss stores a future; later callers await it. Compute runs once.",
      "asyncio: cache the Task, not the coroutine (a coroutine can be awaited once); drop the Task if it fails.",
      "lru_cache keeps its structure safe but may call the function twice for one key.",
      "Across hosts: set-if-absent with an expiry, or a lease; a process lock does nothing there."
    ],
    terms: [
      { t: "Race condition", mem: "Two callers, one gap, wrong outcome.", d: "A bug where the result depends on how two concurrent operations interleave." },
      { t: "Check-then-act", mem: "Looked empty, someone filled it meanwhile.", d: "Deciding on a check and acting on it later, with nothing stopping the state changing in between." },
      { t: "Double-checked locking", mem: "Check, lock, check again.", d: "Checking without the lock, taking it only on a miss, and checking again inside before doing the work." },
      { t: "Single-flight", mem: "One request in the air per key.", d: "Duplicate calls for the same key share the result of the one call already in flight; also called request coalescing." },
      { t: "GIL", mem: "One Python thread runs bytecode at a time.", d: "CPython's global interpreter lock; it makes single dict operations atomic but not a sequence of them." },
      { t: "Task (asyncio)", mem: "A coroutine already running, awaitable by many.", d: "A scheduled coroutine; any number of callers can await the same Task and get its result." }
    ]
  },
  "wc32:2": {
    cheat: [
      "Bound the size: LRU drops least recently used, LFU least frequently used.",
      "Bound by bytes when values vary in size.",
      "A TTL on every entry limits staleness and clears dead keys.",
      "Don't store an exception as a value; retry with backoff instead.",
      "Frequent, expensive failures: cache them briefly on purpose, with a shorter TTL (negative caching).",
      "A failed asyncio Task stays failed; remove it when it raises.",
      "A timeout on compute releases the lock and the waiters if the call hangs.",
      "Hit ratio = hits / (hits + misses). Evictions up and hit ratio down: the cache is too small."
    ],
    terms: [
      { t: "Eviction", mem: "Full, so something has to go.", d: "Removing entries to stay within a size limit, chosen by a policy." },
      { t: "LRU", mem: "Untouched longest, out first.", d: "Least recently used: evicts the entry whose last access is oldest." },
      { t: "LFU", mem: "Used least often, out first.", d: "Least frequently used: evicts the entry with the fewest accesses, usually with counts that decay." },
      { t: "TTL", mem: "A use-by date on every entry.", d: "Time to live: how long an entry stays before it expires." },
      { t: "Negative caching", mem: "Remember the no, briefly.", d: "Storing 'not found' or a failure for a short time so repeated misses do not reach the source." },
      { t: "Hit ratio", mem: "How often the cache answers.", d: "hits / (hits + misses); with eviction counts, it tells you whether the cache is sized right." }
    ]
  },

  /* ---------------------------------------------------------------- wc33 Caching under load (Mercor) */
  "wc33:0": {
    cheat: [
      "Cache-aside: read the cache; on a miss, read the database and fill; on a write, update the database, then delete the key.",
      "Delete rather than update: deletes are idempotent; concurrent updates can land out of order.",
      "Database first, then invalidate; the other order lets a reader refill the old value.",
      "Remaining race: reader reads old row, writer commits and deletes, reader sets old value. It stays until it expires.",
      "TTL bounds it; a lease (token cancelled by the delete) or a version check stops it.",
      "Read your own writes: read through to the database for the user who just wrote.",
      "Say the tolerance: a few seconds is fine for a dashboard, never for a balance or a permission."
    ],
    terms: [
      { t: "Cache-aside", mem: "The app fetches and fills.", d: "The application reads the cache, loads from the source on a miss and fills the cache; writes go to the source and invalidate the key." },
      { t: "Invalidation", mem: "Throw the old copy away.", d: "Removing or expiring a cached entry because the source changed." },
      { t: "Lease", mem: "A ticket to write back, cancelled by any delete.", d: "A token handed out on a miss; a set must present it, and a delete in between cancels it, so a late stale set is refused." },
      { t: "Read-your-writes", mem: "I saved it, so I see it.", d: "The guarantee that a user's own write is visible to that user's next read." },
      { t: "Idempotent", mem: "Twice is the same as once.", d: "An operation whose repeated application has the same effect as applying it once, like a delete." }
    ]
  },
  "wc33:1": {
    cheat: [
      "Stampede: a hot key expires and every request misses together.",
      "Burst size ≈ request rate × recompute time: 10 per second × 3 s = 30 recomputes.",
      "Coalesce: one recompute per key; the rest wait.",
      "Soft TTL serves stale and refreshes in the background; the hard TTL is the limit.",
      "XFetch refreshes early with a probability that rises as expiry nears.",
      "Jitter the TTL so entries filled together do not expire together.",
      "A refresh lock needs its own expiry.",
      "Facebook's lease throttle: one token per key per 10 s; peak database load fell from 17K/s to 1.3K/s."
    ],
    terms: [
      { t: "Cache stampede", mem: "Everyone runs to the database at once.", d: "Many concurrent misses on one expired key, all recomputing it; also called a thundering herd or dogpile." },
      { t: "Soft TTL", mem: "Past its best, still served while one refreshes.", d: "An age after which a value is refreshed in the background but still returned, until a hard TTL." },
      { t: "Stale-while-revalidate", mem: "Answer now, update behind.", d: "Serving the old value while one request fetches the new one." },
      { t: "TTL jitter", mem: "Shake the use-by dates.", d: "Adding a small random amount to each TTL so expiries spread out instead of arriving together." },
      { t: "Probabilistic early expiration", mem: "Refresh early, by a coin whose odds rise.", d: "Recomputing before expiry with a probability that grows as expiry nears (XFetch), so one request refreshes ahead of the crowd." }
    ]
  },
  "wc33:2": {
    cheat: [
      "In-process: nanoseconds, but one copy per process: N misses, N times the memory, invalidation must reach all.",
      "Shared cache: one copy, about 0.5 ms away in the same data centre, survives deploys, has its own failures.",
      "Two tiers: a small local cache with a short TTL in front of the shared one.",
      "Hot key: one key saturates one node; spread it with a local tier, replicas, or key#0 to key#N.",
      "Locks across machines: set-if-absent with an expiry, or a lease; a fencing token if a stale holder could still write.",
      "Connections: a bounded pool, a borrow timeout, never one connection per request."
    ],
    terms: [
      { t: "Local (in-process) cache", mem: "In my own memory, only mine.", d: "A cache inside one process: fastest, but duplicated in every process." },
      { t: "Shared cache", mem: "One copy, one hop away.", d: "A separate service such as Redis or Memcached that every process reads; consistent across processes at the cost of a network call." },
      { t: "Hot key", mem: "One key doing most of the work.", d: "A key taking a disproportionate share of traffic, enough to overload the node that holds it." },
      { t: "Fencing token", mem: "A number that only goes up.", d: "A counter issued with a lock; the store rejects writes carrying an older number, so a holder that lost the lock cannot write." },
      { t: "Connection pool", mem: "A fixed set of lines, borrowed and returned.", d: "A bounded set of reusable connections; borrowers wait, with a timeout, when all are in use." }
    ]
  },
  "wc33:3": {
    cheat: [
      "Load on the source = 1 − hit ratio. At 95%, losing the cache means 1 / 0.05 = 20 times normal load.",
      "The cache is an optimisation, not a dependency: fall back to the source through a concurrency limit, and time out the cache call.",
      "Warm new nodes before traffic; restart cache nodes one at a time.",
      "Negative caching with a short TTL keeps missing keys off the source.",
      "Source down: serve stale within a cap, or fail fast with a circuit breaker.",
      "Retries with backoff and jitter; idempotency keys on writes.",
      "Know two numbers: the hit ratio, and the load the source survives without the cache."
    ],
    terms: [
      { t: "Modal behaviour", mem: "Two modes: cached, and suddenly not.", d: "A system that behaves very differently when the cache is cold or down, because the source was sized for the cached mode." },
      { t: "Load shedding", mem: "Drop some to save the rest.", d: "Rejecting part of the traffic on purpose so the remaining requests are served." },
      { t: "Circuit breaker", mem: "Stop calling what keeps failing.", d: "After repeated failures, calls fail immediately for a while instead of waiting on a broken dependency." },
      { t: "Cache warming", mem: "Fill it before the crowd arrives.", d: "Loading likely keys into a cache before it takes live traffic." },
      { t: "Backoff with jitter", mem: "Wait longer each time, not in step.", d: "Retrying after growing, randomised delays so clients do not retry in synchronised waves." }
    ]
  },

  /* ---------------------------------------------------------------- wc34 Caching LLM calls (Mercor) */
  "wc34:0": {
    cheat: [
      "Key = model and version, prompt version, tools, parameters, normalised input, and tenant when the answer is per-user.",
      "Versions in the key: a prompt change is a miss, not a purge.",
      "Temperature above 0 or an LLM judge: a cache freezes one sample. Decide if that is wanted.",
      "Semantic cache: embedding distance under a threshold counts as a hit; more hits, and false positives.",
      "Never share across tenants: an input that changes the answer but is not in the key leaks answers.",
      "Prompt caching is the provider's prefix cache: tools, system, messages; exact match to the breakpoint; 5 min TTL refreshed on use.",
      "Embeddings: key by content hash and model; re-embed only when the hash changes."
    ],
    terms: [
      { t: "Response cache", mem: "Same question, saved answer.", d: "Your own store of model outputs keyed by everything that determines them." },
      { t: "Prompt caching", mem: "The provider remembers the start of the prompt.", d: "A provider feature that reuses the processed prefix of a prompt; it saves cost and latency but does not cache the answer." },
      { t: "Semantic cache", mem: "Close enough counts as a hit.", d: "A cache that returns a stored answer for an input whose embedding is within a threshold of a stored one." },
      { t: "False positive (cache)", mem: "A hit with the wrong answer.", d: "A semantic match that returns an answer meant for a different question." },
      { t: "Cache poisoning", mem: "One bad entry served to everyone.", d: "A harmful or wrong response stored under a key that others share, often because an input that changes the response is left out of the key." },
      { t: "Content hash", mem: "A fingerprint of the text.", d: "A hash of the content used as part of a key, so a change in content means a new key." }
    ]
  },
  "wc34:1": {
    cheat: [
      "Every alfred_ cache is per-instance memory; nothing is shared; no Redis.",
      "Tokens: reused until minutes before expiry; per-user refresh has no lock, so two workers can refresh at once. Fix: a lease or compare-and-set.",
      "Outlook calendar list: one in-flight request shared by concurrent callers, 30 s TTL, added after Microsoft 503s for too many concurrent calls.",
      "Some maps expire only on read with no size cap; fix with a bounded LRU.",
      "The attachment cache does it right: 30 minutes, at most 80 entries, nothing over 300K characters.",
      "A deliberate negative cache: a failed subscriber lookup caches 'unknown' for 60 s and publishes everything.",
      "Notes are re-embedded only when a chunk's content hash changes; model calls use prompt caching.",
      "Confirm which of these you built before you name them."
    ],
    terms: [
      { t: "Compare-and-set", mem: "Write only if it is still what I read.", d: "An atomic update that succeeds only if the current value matches the expected one; a safe way to refresh a shared token." },
      { t: "Fail open", mem: "When unsure, let it through.", d: "Choosing availability on an error, here publishing every event when the lookup fails." },
      { t: "Cold start", mem: "A fresh instance knows nothing.", d: "A new serverless instance with empty in-memory caches, so its first requests all miss." }
    ]
  }
};

/* Drawn cheat sheets: `vis` blocks per step (see site/sheet.js for the kinds). A step with `vis` shows it
   in place of its `cheat` lines. Written by hand, a session at a time. */
(function () {
  var V = {
    "w3a:0": [
      { rule: "Two ways to keep sorted keys on disk: append now and merge later, or rewrite the page where the key lives." },
      { title: "An LSM-tree write", flow: ["write", "write-ahead log", "memtable (memory)", "flush: sorted SSTable", "compaction merges files"],
        note: "Every step is sequential, so writes are cheap. A read checks the memtable, then SSTables newest first; a Bloom filter skips files that cannot hold the key." },
      { title: "Which side is cheap", vs: { cols: ["LSM-tree", "B-tree"], rows: [
        ["Writes", "cheap: sequential appends", "random I/O: find the page, rewrite it"],
        ["Reads", "may check several files", "one walk, root to leaf, about log n pages"],
        ["Extra writes", "compaction rewrites data", "page plus write-ahead log"],
        ["Used by", "Cassandra, RocksDB", "Postgres, MySQL"],
        ["Pick it for", "write-heavy, append-only", "read-heavy, with updates"]] } }
    ],
    "w3a:1": [
      { title: "The latency ladder: one significant figure", ladder: [
        ["100 ns", "memory reference", ""],
        ["100 µs", "SSD random read", "× 1,000"],
        ["0.5 ms", "round trip, same data centre", "× 5"],
        ["50 ms", "object storage GET", "× 100: network plus the service's work"],
        ["150 ms", "round trip across an ocean", ""]] },
      { title: "Sizes and rates to do in your head", calc: [
        ["1 KB × 10<sup>6</sup>", "1 GB"],
        ["1 KB × 10<sup>9</sup>", "1 TB"],
        ["1 day", "86,400 s ≈ 10<sup>5</sup> s"],
        ["10<sup>6</sup> a day", "about 12 a second"]] }
    ],
    "w3a:2": [
      { rule: "Object storage keeps whole objects by key: put, get, delete, list a prefix. No query engine, no partial update." },
      { split: [["Belongs there", ["written once, never updated", "read rarely, or in bulk", "traces, logs, media, backups, checkpoints", "about 2 cents a GB-month"]],
                ["Wrong place", ["filter or join in real time", "small, frequent updates", "transactions", "anything you must query, not fetch"]]] },
      { title: "The usual shape", flow: ["client", "presigned URL", "object storage: the payload", "database row: key + fields you filter on"],
        note: "Large uploads go straight from the client in parts (multipart upload), never through your servers." }
    ],
    "w3a:3": [
      { title: "The arithmetic, out loud", calc: [
        ["10 KB × 10<sup>8</sup> a day", "10<sup>12</sup> B = 1 TB a day"],
        ["1 TB × 30", "30 TB a month"],
        ["30,000 GB × $0.02", "about $600 a month to hold"],
        ["10<sup>8</sup> / 10<sup>5</sup> s", "about 1,000 writes a second (1,160)"],
        ["30 TB × 12", "360 TB after a year"]] },
      { title: "Retention is a decision", flow: ["hot: last 30 days, queryable", "cold tier", "delete when it stops helping"],
        note: "Keeping everything forever is still a decision, one nobody made on purpose." }
    ],
    "w3a:4": [
      { rule: "Holding a terabyte a day is cheap. Querying it is where the cost hides." },
      { split: [["With a metadata store", ["a small table: scenario, time, pass or fail, object key", "query the table first", "fetch only the objects it points to"]],
                ["Without one", ["every question scans the objects", "a terabyte for each day you look at", "object storage has no index"]]] },
      { title: "The answer, in order", flow: ["volume: 1 TB a day, 30 a month", "cost: about $600 a month", "where: object storage", "retention: 30 days hot", "if queried: add the index"],
        note: "For analytics over the payloads: a columnar format (Parquet) and an engine that reads it (Athena, BigQuery)." }
    ]
  };
  for (var k in V) { if (window.SHEETS[k]) { window.SHEETS[k].vis = V[k]; } }
})();

/* Drawn sheets for the Mercor sessions (wc32 to wc34). */
(function () {
  var V = {
    "wc32:0": [
      { rule: "Say what you assume, then walk the same order every time: one caller, concurrency, memory, errors, staleness, visibility." },
      { title: "The snippet, with each problem pinned to its line",
        code: "cache = {}\ndef get(x):\n    if x in cache:\n        return cache[x]\n    v = compute(x)\n    cache[x] = v\n    return v",
        pins: [[1, "never evicts: grows with every new x, keeps every value alive"],
               [3, "check, then act: a second caller can miss in the gap"],
               [5, "slow and fallible: no timeout; if it raises, every caller retries at once"],
               [6, "no expiry: once the source changes, wrong until restart"]] },
      { title: "Ask before you judge", parts: [["process?", "one or many"], ["threads?", "or asyncio"], ["compute", "cost, pure?"], ["reads : writes", "ratio"], ["staleness", "allowed?"], ["x", "from a user?"]] }
    ],
    "wc32:1": [
      { title: "The race, in time", lanes: [
          ["A", [["check: miss", "plain"], ["compute (3 s)", "hot", "3"], ["set", "plain"]]],
          ["B", [["check: miss", "plain", "", "48px"], ["compute again", "hot", "3"], ["set", "plain"]]]],
        note: "B checks before A has stored. One dict get or set is atomic under the GIL; the check and the set together are not." },
      { title: "The fixes, compared", vs: { cols: ["Correct", "Hits stay fast", "Runs once", "Across hosts"], rows: [
          ["One lock around all", "yes", "no: hits wait behind a slow miss", "yes", "no"],
          ["Lock the miss, check again", "yes", "yes", "yes", "no"],
          ["Per-key lock", "yes", "yes, and keys don't block each other", "yes", "no"],
          ["Share the in-flight future", "yes", "yes", "yes: everyone awaits one", "no"],
          ["Set-if-absent with expiry", "yes", "yes", "yes", "yes"]] } },
      { title: "In asyncio", code: "inflight = {}\ndef get(x):\n    if x not in inflight:\n        inflight[x] = asyncio.ensure_future(compute(x))\n    return inflight[x]   # every caller awaits the same Task",
        pins: [[4, "cache the Task, not the coroutine: a coroutine can be awaited once"], [5, "if it fails, remove it, or every caller gets the same exception"]] }
    ],
    "wc32:2": [
      { title: "A week in a busy service", split: [["Without a bound", ["memory grows until the process dies", "one failure cached is served all week", "a hung compute holds its waiters", "nobody knows the hit ratio"]],
                ["With one", ["max size, LRU or by bytes", "TTL on every entry", "failures not cached, or briefly on purpose", "timeout on compute; metrics on hits, size, evictions"]]] },
      { title: "Is it sized right?", calc: [["hit ratio", "hits / (hits + misses)"], ["evictions ↑, hit ratio ↓", "too small"], ["hit ratio flat, memory ↑", "too big, or keys never reused"]] }
    ],
    "wc33:0": [
      { title: "How the old value wins", lanes: [
          ["Reader", [["miss", "plain"], ["reads old row", "plain", "2"], ["", "gap", "2"], ["sets OLD value", "hot", "2"]]],
          ["Writer", [["", "gap", "2", "40px"], ["commits new row", "done", "2"], ["deletes key", "done"]]]],
        note: "The reader's late set lands after the delete. The stale value stays until it expires." },
      { title: "What stops it", vs: { cols: ["What it does", "Cost"], rows: [
          ["TTL", "'forever' becomes at most one TTL", "more misses"],
          ["Write DB, then delete", "deletes are idempotent; order matters", "one round trip"],
          ["Lease", "a delete cancels the reader's token; the late set is refused", "a token per miss"],
          ["Version", "never overwrite a newer version", "a version on every value"]] } }
    ],
    "wc33:1": [
      { rule: "A hot key expires and every request misses at once." },
      { title: "How big the burst is", calc: [["burst", "request rate × recompute time"], ["10 / s × 3 s", "30 identical recomputes"], ["Facebook, with leases", "17K/s peak → 1.3K/s"]] },
      { title: "Four ways out", flow: ["coalesce: one recompute per key", "serve stale, refresh behind (soft TTL)", "refresh early at random (XFetch)", "jitter TTLs so expiries spread"],
        note: "Any lock that guards a refresh needs its own expiry." }
    ],
    "wc33:2": [
      { title: "Where the cache lives", vs: { cols: ["In-process", "Shared (Redis)", "Both"], rows: [
          ["Speed", "nanoseconds", "about 0.5 ms", "local hit, else shared"],
          ["Copies", "one per process", "one", "small local + one"],
          ["Invalidation", "must reach every process", "one place", "short local TTL"],
          ["Survives a deploy", "no", "yes", "shared part does"],
          ["Watch for", "N misses per key", "hot key on one node", "staleness of the local copy"]] } },
      { title: "Locks and connections across machines", parts: [["SET key NX", "atomic set-if-absent"], ["EX 30", "the lock expires"], ["fencing token", "rejects a stale holder"], ["pool max", "bounded connections"], ["borrow timeout", "never wait forever"]] }
    ],
    "wc33:3": [
      { title: "What the source suddenly sees", ladder: [["5%", "of traffic, with a 95% hit ratio", "what the database is sized for"], ["100%", "when the cache is cold or down", "1 / (1 − 0.95) = 20× the load"]] },
      { title: "Behave on purpose", flow: ["cache error", "fall back to the source", "through a concurrency limit", "shed the rest", "serve stale if allowed"],
        note: "Warm new cache nodes before traffic, restart them one at a time; negative-cache 'not found' briefly; retry with backoff and jitter." }
    ],
    "wc34:0": [
      { title: "Anatomy of the key", parts: [["model@version", "which model"], ["prompt v7", "a change is a miss"], ["tools", "hash of definitions"], ["temp, max_tokens", "parameters"], ["normalised input", "the question"], ["tenant", "never share across", true]] },
      { split: [["Safe to cache", ["temperature 0, versioned key", "per-tenant key for per-user answers", "embeddings keyed by content hash and model", "exact match first"]],
                ["Careful", ["temperature above 0: freezes one sample", "LLM judge in evals: hides variance", "semantic match: false positives", "anything that changes the answer but isn't in the key"]]] },
      { title: "Two different caches", vs: { cols: ["Your response cache", "Provider prompt caching"], rows: [
          ["Stores", "the answer", "the processed prompt prefix"],
          ["Hit needs", "the same key", "an exact prefix: tools, system, messages"],
          ["Lives", "as long as you set", "about 5 minutes, refreshed on use"],
          ["Saves", "the whole call", "input cost and latency"]] } }
    ],
    "wc34:1": [
      { title: "Your caches at alfred_: what, the risk, the fix", vs: { cols: ["What it does", "Risk", "Fix or point"], rows: [
          ["Outlook calendar", "one in-flight request shared, 30 s TTL", "it was added after Microsoft 503s", "single-flight, in production"],
          ["Mail tokens", "reused until minutes before expiry", "two workers refresh at once, no lock", "a lease or compare-and-set"],
          ["Per-user flag maps", "60 s TTL, expire only on read", "no size cap: grows", "a bounded LRU"],
          ["Attachments", "30 min, at most 80, skip > 300K chars", "none", "the one done right"],
          ["Subscriber lookup", "on failure, caches 'unknown' 60 s", "publishes everything", "fail open, on purpose"],
          ["Notes and model calls", "re-embed only on content-hash change; prompt caching", "none", "cost and latency"]] },
        note: "All per-instance memory; no Redis. Confirm which you built before you name them." }
    ]
  };
  for (var k in V) { if (window.SHEETS[k]) { window.SHEETS[k].vis = V[k]; } }
})();

/* Drawn sheets for weeks 1 to 5 (the rest of milestone 1), drawn against w3a and the Mercor sheets. */
(function () {
  var V = {
  "w1a:0": [
    { rule: "Response time is a distribution. Describe it with percentiles, and plan from the tail." },
    { title: "Where each number sits", ladder: [
      ["p50", "the median", "half of requests are faster"],
      ["p95", "95 percent beat it", "the slow tail starts here"],
      ["p99", "99 percent beat it", "heavy users and retries live here"]] },
    { title: "Mean against percentile", vs: { cols: ["Mean", "p99"], rows: [
      ["Dominated by", "the bulk of fast requests", "the slowest one percent"],
      ["Shows the tail", "no: hides it", "yes"],
      ["Size capacity from it", "no", "yes"]] },
      note: "An average can look healthy while the slowest requests are the ones hurting." }
  ],
  "w1a:1": [
    { title: "Two different measures", vs: { cols: ["Throughput", "Latency"], rows: [
      ["Counts", "requests completed per second", "one request, start to end"],
      ["Says how long one waits", "no", "yes"],
      ["Tail view", "none", "p50 and p99"]] } },
    { title: "Bounded against unbounded queue", split: [["Bounded", ["fixed capacity", "refuses work once full", "fails early and loud"]],
      ["Unbounded", ["no limit", "keeps absorbing work", "shows up late, as memory growth"]]] },
    { title: "When the queue is full", flow: ["queue full", "backpressure: producer slows", "or load shedding: drop some work", "the rest stays fast"] }
  ],
  "w1a:2": [
    { rule: "Unbounded fails slow and silent. Bounded fails fast and loud." },
    { title: "How an unbounded queue dies", flow: ["arrivals above service rate", "backlog grows", "latency and memory climb", "out of memory: dies at once"],
      note: "Throughput looks unchanged and no error rate rises, so the dashboard shows nothing until the crash." },
    { title: "What each one tells you", vs: { cols: ["Bounded", "Unbounded"], rows: [
      ["On overload", "rejects work when full", "accepts everything"],
      ["Error signal", "yes: the rejection", "no: nothing until the crash"],
      ["Visible in throughput", "no", "no: only queue depth shows it"]] },
      note: "Watch queue depth, not only throughput." }
  ],
  "w1a:3": [
    { title: "Rate and concurrency, worked", calc: [
      ["10<sup>8</sup> a day / 10<sup>5</sup> s", "about 1,000 a second (1,200 on average)"],
      ["peak: 3 to 10 × the average", "up to 10 thousand a second"],
      ["10,000 a second × 200 ms", "2,000 in flight (Little's law)"],
      ["1 in 10<sup>6</sup> failing × 10<sup>8</sup> a day", "about 100 failures a day"]] },
    { title: "The shape of the answer", flow: ["rate first", "queue it, bounded", "split on a key", "idempotent handlers, capped retries", "dead-letter queue, per-caller limit"],
      note: "Assume the key is skewed: the hottest partition is the ceiling for everything." }
  ],
  "w1a:4": [
    { rule: "Two minutes, spoken once, no notes. No product names." },
    { title: "The answer, in order", flow: ["rate: per second, size, bursts", "bound the queue", "backpressure or shed", "split on a key, assume skew", "idempotent, capped retries", "size from p99 and peak"],
      note: "The same sentences hold whichever vendor is underneath." },
    { title: "Why skew matters", split: [["Assumed uniform", ["spread evenly across machines", "adding machines adds capacity"]],
      ["Real traffic is power-law", ["a few keys carry most load", "the hottest partition is the ceiling however many machines sit behind it"]]] }
  ],
  "w1b:0": [
    { rule: "Replace the curve with something simple, then make the pieces finer. The derivative is where that settles." },
    { title: "The method, on a circle", flow: ["slice into thin rings", "straighten each ring", "sum the rectangles", "ring width to zero", "error to zero"],
      note: "The derivative is a limit: where the approximation settles, not a leap to an instant." },
    { title: "Definition and shortcut", split: [["The definition", ["a limit of slope over a small step", "step size goes to zero", "learn this first"]],
      ["The power rule", ["lowers the exponent of x<sup>n</sup> by one", "computes a derivative", "does not define it"]]] }
  ],
  "w1b:1": [
    { rule: "log(ab) = log a + log b. Times becomes plus." },
    { title: "The product rule, proved", calc: [
      ["a = c<sup>x</sup>, b = c<sup>y</sup>", "ab = c<sup>x+y</sup>"],
      ["log<sub>c</sub> ab", "x + y = log a + log b"]] },
    { title: "Why likelihoods use logs", split: [["The raw product", ["thousands of small probabilities", "multiplies to zero in floating point (underflow)"]],
      ["The sum of logs", ["no underflow", "differentiates term by term", "compare models by summed log-probabilities"]]],
      note: "On a log vertical axis an exponential curve is a straight line." }
  ],
  "w1b:2": [
    { title: "The rules, with the answers", calc: [
      ["log<sub>2</sub> 32", "5, since 2<sup>5</sup> = 32"],
      ["log<sub>3</sub> 1", "0, since anything to the 0 is 1"],
      ["log 100 + log 10", "log 1000 = 3"],
      ["log<sub>2</sub> 8 − log<sub>2</sub> 2", "log<sub>2</sub> 4 = 2"],
      ["log<sub>5</sub> 25<sup>3</sup>", "3 × log<sub>5</sub> 25 = 3 × 2 = 6"]] },
    { title: "Zero, one and negative exponents", calc: [
      ["5<sup>0</sup>", "1"], ["e<sup>1</sup>", "e"], ["2<sup>−3</sup>", "1/8"]] },
    { title: "The three log rules", vs: { cols: ["Rule"], rows: [
      ["Product", "log(ab) = log a + log b"],
      ["Quotient", "log(a/b) = log a − log b"],
      ["Power", "log(a<sup>n</sup>) = n log a"]] },
      note: "Solve all ten cold on paper first, then check." }
  ],
  "w1b:3": [
    { rule: "Maximum likelihood: pick the θ that makes your data most probable. Everything else rewrites that." },
    { title: "From likelihood to loss", flow: ["L(θ) = ∏ p(x<sub>i</sub> | θ)", "take the log: a sum, no underflow", "put a minus in front", "NLL(θ) = −Σ log p(x<sub>i</sub> | θ)", "minimise by descent"],
      note: "Log is increasing, so the top stays at the same θ. arg max f = arg min (−f)." },
    { title: "7 heads in 10 flips, and the scale", calc: [
      ["L(p)", "p<sup>7</sup>(1 − p)<sup>3</sup>"],
      ["log L", "7 log p + 3 log(1 − p)"],
      ["d/dp log L = 7/p − 3/(1 − p) = 0", "p̂ = 0.7"],
      ["0.01<sup>1000</sup>", "10<sup>−2000</sup>: below float64, rounds to 0"],
      ["1000 · log 0.01", "about −4605: an ordinary number"]] }
  ],
  "w1c:0": [
    { rule: "A render can pass every gate and still sound synthetic. Listening is the only check that catches it." },
    { title: "What the demo does", flow: ["scripts/demo_script_render.py", "mint a voice from a text description", "render scripted lines, fixed identity", "listen to demo_out/audio/"] },
    { title: "What the gates check", vs: { cols: ["Checked"], rows: [
      ["Drift", "yes: identity"],
      ["Consistency", "yes: identity"],
      ["Uniqueness", "yes: identity"],
      ["CER", "yes: intelligibility"],
      ["Naturalness", "no: floor proposed, never enforced"]] } }
  ],
  "w1c:1": [
    { title: "Two towers, one wire", flow: ["description (text)", "Tower A: encoder + mapper (learned)", "speaker vector", "Tower B: frozen acoustic LM", "audio"],
      note: "The speaker vector is the only channel between the towers. Direction (emotion, rate) stays separate from identity." },
    { title: "Gates before an identity is stored", parts: [["drift", ""], ["consistency", ""], ["uniqueness", ""], ["CER", ""], ["naturalness", "floor 75, never rejected", true]] },
    { title: "What has already changed", split: [["Kept as insurance", ["a seed clip beside each vector", "an encoder change orphaned vectors once"]],
      ["Swapped once", ["Zonos-v0.1, dead and licence-poisoned", "to Qwen3-TTS-1.7B", "only the mapper learns"]]] }
  ],
  "w1c:2": [
    { rule: "Only the mapper learns. A frozen renderer stays swappable." },
    { title: "Train the mapper or fine-tune the TTS", vs: { cols: ["Train the mapper", "Fine-tune the TTS"], rows: [
      ["Small dataset enough", "yes", "no: paired data at base-model scale"],
      ["Keeps general speech quality", "yes", "no: risks catastrophic forgetting"],
      ["Renderer stays swappable", "yes", "no: tied to one checkpoint's quirks"]] } },
    { title: "Where the learning sits", flow: ["description", "mapper: the only part trained", "speaker vector", "frozen TTS consumes it"],
      note: "The speaker vector is the only channel through which training affects the audio." }
  ],
  "w2a:0": [
    { rule: "The partition key decides what stays together and what scatters." },
    { title: "Two ways to cut the key space", vs: { cols: ["Key range", "Hash of the key"], rows: [
      ["Each partition owns", "a contiguous range", "whatever the hash lands on"],
      ["Range scans", "yes: stay on one or few partitions", "no: neighbours scatter"],
      ["Load", "no: skews, e.g. all writes to today's date", "yes: spread evenly"],
      ["Pick it for", "range queries", "even load"]] } },
    { title: "Rebalancing and routing", split: [
      ["Do", ["move only a share proportional to the change", "route through any node, a routing tier, or a client that knows the map"]],
      ["Avoid", ["hash mod N: change N and almost every key moves", "secondary index lookups: ask every partition, or keep a separate index"]]] }
  ],
  "w2a:1": [
    { title: "Why a good hash still leaves a hot partition", flow: ["real usage follows a power law", "one key carries the traffic", "hash spreads the key space, not the traffic", "that partition is full, the rest idle"],
      note: "That one partition's capacity is the ceiling for the whole system." },
    { title: "The skew figure", ladder: [
      ["8", "partitions", ""],
      ["1", "tall bar", "one user carrying 4% of all events"],
      ["7", "idle, well under the capacity line", ""]] },
    { rule: "A hot partition is a key-choice problem, not a hash-function problem." }
  ],
  "w2a:2": [
    { title: "Fan-out to 100 shards", calc: [
      ["P(all 100 fast) = 0.99<sup>100</sup>", "e<sup>100 ln 0.99</sup> ≈ e<sup>−1.005</sup> ≈ 0.366"],
      ["P(at least one slow) = 1 − 0.99<sup>100</sup>", "≈ 63%"],
      ["Fan-out cut to 20: 0.99<sup>20</sup>", "≈ 0.82, so about 18% slow"]] },
    { title: "How it builds", flow: ["one request", "split into 100 shard calls", "wait for all of them", "one slow shard makes it slow"],
      note: "A component's one-percent tail becomes the system's typical case." },
    { rule: "The cure is fewer things fanned out to, not faster average shards." }
  ],
  "w2a:3": [
    { title: "Sharding the eval harness by scenario id", flow: ["replay", "partition key: scenario id", "all replays of a scenario on one shard", "aggregate locally"],
      note: "Scale: a hundred million replays, more than one machine can hold or keep up with." },
    { split: [
      ["Why scenario id fits", ["the scenario is the natural unit of comparison", "aggregating a scenario stays local, not scattered across the cluster"]],
      ["Where it breaks", ["one family (the happy-path conversation) a thousand times more common", "its shard is the hot partition and the ceiling for the run", "adding shards does not help: the hot key still goes to one"]] ] },
    { title: "The fix", flow: ["find the oversized family", "hash a secondary key, e.g. replay id", "spread it over several shards", "other families stay on one shard"],
      note: "Pay the cost of splitting only where it is needed." }
  ],
  "w2a:4": [
    { rule: "Shard by user id, and one user is 4% of all traffic: that shard is the bottleneck, whatever the shard count." },
    { title: "The change and its price", vs: { cols: ["user id alone", "user id + secondary key"], rows: [
      ["Heavy user's writes", "no: all on one shard", "yes: spread over several shards"],
      ["Throughput", "no: one partition's throughput", "yes: others share the load"],
      ["Read one user's history", "yes: one lookup", "no: fan out and merge"]] },
      note: "Secondary key: session id or a time bucket." },
    { title: "Trade-off to state", flow: ["split the hot key", "history read fans out", "tail-latency amplification", "pick one answer, say what it costs"] }
  ],
  "w2b:0": [
    { title: "The idea", parts: [
      ["f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] / h", "slope of the tangent at one exact point", true],
      ["df = f′(x) dx", "a tiny nudge in becomes f′ times that nudge out"]] },
    { title: "Rules", vs: { cols: ["Meaning"], rows: [
      ["Power", "d/dx x<sup>n</sup> = n x<sup>n−1</sup>"],
      ["Product", "(f·g)′ = f′g + fg′: a rectangle grows by two strips"],
      ["Chain", "dy/dx = f′(g(x))·g′(x): scalings multiply"],
      ["Also", "d/dx sin x = cos x, d/dx e<sup>x</sup> = e<sup>x</sup>"]] } },
    { title: "Worked checks", calc: [
      ["(x + dx)<sup>2</sup>", "x<sup>2</sup> + 2x·dx + dx<sup>2</sup> ⇒ 2x"],
      ["d/dx sin(x<sup>2</sup>)", "cos(x<sup>2</sup>)·2x"],
      ["(3.01)<sup>2</sup> = 9.0601", "change 0.0601 ≈ 2·3·0.01 = 0.06"]] }
  ],
  "w2b:1": [
    { title: "Pick the rule from the outermost operation", flow: ["read the outermost operation", "name it: sum, product, quotient or power", "apply its rule", "check by nudging"] },
    { title: "Each rule worked", calc: [
      ["(x<sup>5</sup>)′", "5x<sup>4</sup>"],
      ["(3x<sup>4</sup> − 2x + 7)′", "12x<sup>3</sup> − 2"],
      ["(x<sup>3</sup> sin x)′", "3x<sup>2</sup> sin x + x<sup>3</sup> cos x"],
      ["(f/g)′", "(f′g − fg′) / g<sup>2</sup>"],
      ["(x<sup>2</sup>/(x + 1))′", "(x<sup>2</sup> + 2x) / (x + 1)<sup>2</sup>"]] },
    { title: "Check at x = 1", ladder: [
      ["0.75", "the formula", ""],
      ["≈ 0.751", "measured slope from 1 to 1.01", "the nudge agrees"]],
      note: "Special case: (1/g)′ = −g′/g<sup>2</sup>, which returns with the sigmoid." }
  ],
  "w2b:2": [
    { title: "Reaching σ′ = σ(1 − σ)", flow: ["rewrite as (1 + e<sup>−x</sup>)<sup>−1</sup>", "chain rule: −u<sup>−2</sup> · (−e<sup>−x</sup>)", "minus signs cancel", "split the square into two factors", "σ and 1 − σ"] },
    { title: "The algebra", calc: [
      ["σ′(x)", "e<sup>−x</sup> / (1 + e<sup>−x</sup>)<sup>2</sup>"],
      ["= [1/(1 + e<sup>−x</sup>)] · [e<sup>−x</sup>/(1 + e<sup>−x</sup>)]", "σ(x) · (1 − σ(x))"]] },
    { title: "Slope along the curve", ladder: [
      ["0.25", "σ′(0), with σ(0) = 0.5", "peak slope"],
      ["0.0177", "σ′(4), with σ(4) ≈ 0.982", "nearly flat in the tails"]],
      note: "The forward pass already holds σ(x), so the gradient costs one subtraction and one multiplication." }
  ],
  "w2b:3": [
    { title: "The chain", flow: ["x", "u = g(x)", "y = f(u)", "dy/dx = dy/du · du/dx"],
      note: "Evaluate the outer derivative at the inner value u, not at x." },
    { title: "(3x + 1)<sup>2</sup> at x = 2", calc: [
      ["u = 3x + 1", "7"],
      ["dy/du = 2u", "14"],
      ["du/dx", "3"],
      ["dy/dx = 14 · 3", "42"],
      ["check: 9x<sup>2</sup> + 6x + 1 ⇒ 18x + 6", "42"]] },
    { title: "Longer chains", parts: [
      ["dy/df<sub>3</sub>", "outermost link"],
      ["df<sub>3</sub>/df<sub>2</sub>", "one ordinary derivative per link"],
      ["df<sub>2</sub>/df<sub>1</sub>", ""],
      ["df<sub>1</sub>/dx", "innermost link"]],
      note: "Multiply the four. This is what autograd does: each box remembers what it saw forward, then the backward pass multiplies." }
  ],
  "w2c:0": [
    { title: "Spotting it", flow: ["training loss falling", "validation loss turns upward", "stop here: memorising, not learning"],
      note: "Falling training loss proves nothing alone." },
    { title: "Name each fix by its mechanism", vs: { cols: ["What it does"], rows: [
      ["L2", "shrinks every weight toward zero, never exactly"],
      ["L1", "drives some weights to exactly zero: feature selection"],
      ["Early stopping", "stops before there is time to fit noise"],
      ["Dropout", "removes units at random: forces redundancy"],
      ["More or augmented data", "more real structure, so memorising pays less"]] } }
  ],
  "w2c:1": [
    { title: "First choice: early stopping", split: [
      ["Why it goes first", ["costs nothing to add", "a held-out metric is already tracked on every run in the eval harness", "not an architecture change, not a new hyperparameter"]],
      ["Why not the others first", ["L2 and dropout each need a guess in advance: penalty strength, drop rate", "see the overfitting once before guessing at knobs"]] ] },
    { title: "Order of reach", flow: ["early stopping", "still not enough?", "regularisation or dropout", "or more data"],
      note: "Dropout removes paths, L2 shrinks magnitudes, more data moves the turning point right." }
  ],
  "wc3:0": [
    { title: "The ingestion path", flow: ["upload", "type detection", "parser per type", "one normalised document model"] },
    { title: "Parser by source", vs: { cols: ["Parser"], rows: [
      ["Native PDF", "use the text layer"],
      ["Scan or ERP screenshot", "OCR with layout analysis"],
      ["Spreadsheet", "read as cells, never flattened to text"],
      ["Walkthrough recording", "transcript with timestamps"]] },
      note: "Large documents go straight to storage by presigned upload (multipart), metadata split from the payload." }
  ],
  "wc3:1": [
    { title: "What every span carries", parts: [
      ["document", "which file"],
      ["page", ""],
      ["bounding box", "the region on the page", true],
      ["timestamp", "for recordings"]],
      note: "Derived artifacts keep a pointer back to their source spans." },
    { split: [
      ["Keep coordinates", ["citations can point at the exact passage", "same need in a three-hundred-page record"]],
      ["Drop them at parse time", ["citations become impossible later", "no cleverness downstream recovers them"]] ] },
    { rule: "The most important decision in the system: coordinates at parse time." }
  ],
  "wc3:2": [
    { title: "Fixed-size chunks against structured tables", vs: { cols: ["Fixed-size chunks", "Table as an object"], rows: [
      ["Table intact", "no: cut in half", "yes: kept whole"],
      ["Value and header", "no: separated", "yes: header stays with the cell"],
      ["Cite an amount", "no: vague", "yes: exact cell coordinates"]] },
      note: "Treat screenshots as structure too, not as a flat block of text." },
    { rule: "MetaRAG: chunking and metadata interact, and the right choice depends on the corpus." }
  ],
  "wc3:3": [
    { title: "A low-confidence value", flow: ["OCR confidence per region", "an attribute test depends on the value", "low: do not trust it quietly", "insufficient, or a human check"],
      note: "Dropping the item would bias the sample." },
    { split: [
      ["Say plainly", ["no OCR in production yet", "the layers on both sides of it are built"]],
      ["Expect", ["slow on OCR specifics for a couple of weeks", "fast on everything around them"]] ] }
  ],
  "wc3:4": [
    { title: "Retrieval per tenant", flow: ["one index per client engagement, never shared", "lexical + dense", "prefix metadata into the text", "rerank about forty candidates to twelve"] },
    { title: "Why hybrid", vs: { cols: ["Lexical", "Dense"], rows: [
      ["Exact invoice numbers, dates, amounts", "yes: matches exactly", "no: weak on exact identifiers"],
      ["Meaning, not letters", "no: literal terms only", "yes: embedding similarity"]],
      }, note: "Do not blend sparse and dense vectors that do not share a space." }
  ],
  "wc3:5": [
    { title: "Inside the tenant boundary", parts: [
      ["storage", "per tenant"],
      ["encryption keys", "per tenant", true],
      ["index and cache", "no cross-tenant sharing"],
      ["model calls", "stay inside, or zero data retention"]] },
    { split: [
      ["What isolation buys", ["one client's data cannot reach another's", "a question worth asking of any vendor here"]],
      ["What it costs or risks", ["constrains which models you can use", "prompt injection can arrive inside a user's own sources"]] ] }
  ],
  "wc3:6": [
    { title: "Sizing an engagement of tens of thousands of pages", flow: ["pages in the engagement", "OCR cost and time per page", "storage per page, with coordinates", "multiply out"] },
    { title: "Which constraint matters", vs: { cols: ["Matters?"], rows: [
      ["Latency", "no: batch work"],
      ["Correctness", "yes: absolutely"]] },
      note: "Saying which constraint does not matter is as useful as saying which does." }
  ],
  "w3b:0": [
    { rule: "A matrix is only where î and ĵ land. Everything else follows from that." },
    { title: "From weights to a transformed vector", flow: ["v = x·î + y·ĵ", "A moves î and ĵ", "columns of A: Aî, Aĵ", "Av = x·(Aî) + y·(Aĵ)"],
      note: "The row-times-column rule is this sum written out. BA means A first, then B: read right to left." },
    { split: [["Linear", ["grid lines stay straight", "evenly spaced", "origin stays put", "A(a·u + b·w) = a·Au + b·Aw"]],
              ["Not linear, or dependent", ["origin moves, or lines bend", "one vector inside the span of the others", "the span loses a dimension"]]] }
  ],
  "w3b:1": [
    { title: "Two readings of one number", calc: [
      ["a · b", "Σ a<sub>i</sub>b<sub>i</sub> = |a||b| cos θ"],
      ["|a|", "√(a · a)"],
      ["cos θ", "(a · b) / (|a||b|) = â · b̂"],
      ["unit vectors", "|a − b|<sup>2</sup> = 2 − 2 cos θ"]] },
    { title: "Where the score sits", ladder: [
      ["1", "same direction", "θ = 0"],
      ["0", "right angles", "unrelated"],
      ["−1", "opposite", "θ = 180°"]] },
    { rule: "Cosine looks at direction only. Normalise once on storage and the dot product is the cosine." }
  ],
  "w3b:2": [
    { title: "Shapes prove the identity", calc: [
      ["A is 4 × 3, B is 3 × 5", "AB is 4 × 5"],
      ["(AB)<sup>T</sup>", "5 × 4 = (5 × 3)(3 × 4) = B<sup>T</sup>A<sup>T</sup>"],
      ["A<sup>T</sup>B<sup>T</sup>", "(3 × 4)(5 × 3): does not multiply"],
      ["(AB)<sub>ij</sub>", "Σ<sub>k</sub> A<sub>ik</sub>B<sub>kj</sub>"]] },
    { title: "The inner sizes drop out", parts: [["(m × n)", "left"], ["n = n", "match, summed away", true], ["(n × p)", "right"], ["= (m × p)", "outer sizes remain"]] },
    { rule: "Reverse the order: socks then shoes, undo with shoes first. (AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>." }
  ],
  "w3b:3": [
    { title: "What λ does to the eigenvector", ladder: [
      ["λ > 1", "stretches", "stays on its line"],
      ["0 < λ < 1", "shrinks", "stays on its line"],
      ["λ < 0", "flips", "still on its line"],
      ["λ = 0", "collapses to the origin", ""]] },
    { title: "The test, under diag(2, −1)", calc: [
      ["A(1, 0)", "(2, 0) = 2·(1, 0): eigenvector, λ = 2"],
      ["A(0, 1)", "(0, −1) = −1·(0, 1): eigenvector, λ = −1"],
      ["A(1, 1)", "(2, −1): not a multiple of (1, 1), so no"]] },
    { title: "Why eigenvalues decide stability", split: [
      ["|λ| > 1", ["A<sup>n</sup>v = λ<sup>n</sup>v grows", "direction blows up with repeats"]],
      ["|λ| < 1", ["A<sup>n</sup>v = λ<sup>n</sup>v dies out", "as in an RNN or power iteration"]]] }
  ],
  "w3b:4": [
    { title: "The one rule", parts: [["(m × n)", "left"], ["n", "inner pair: must match", true], ["(n × p)", "right"], ["(m × p)", "outer pair: the result"]] },
    { title: "Same vectors, opposite order", vs: { cols: ["Row times column", "Column times row"], rows: [
      ["Shape", "(1 × n)(n × 1)", "(n × 1)(1 × n)"],
      ["Result", "1 × 1 scalar", "n × n table"],
      ["Name", "dot product", "outer product"]] } },
    { title: "Shape errors and layers", calc: [
      ["(5 × 2)<sup>T</sup>(5 × 2)", "2 × 2"],
      ["(5 × 2)(5 × 2)<sup>T</sup>", "5 × 5"],
      ["(B, T, D) @ (D, H)", "(B, T, H): a linear layer"]],
      note: "Reading a shape error: write both shapes, find the inner pair that does not match, decide which side to transpose." }
  ],
  "w3c:0": [
    { title: "The ceiling and the fold", ladder: [
      ["N", "readings per second", "x[n] = x(n/N)"],
      ["N/2", "Nyquist: highest frequency held", "f<sub>Nyq</sub>"],
      ["N − f", "where a tone above N/2 lands", "aliasing"]] },
    { title: "At 24 kHz", calc: [
      ["24 kHz / 2", "12 kHz ceiling"],
      ["15 kHz tone", "24 − 15 = 9 kHz recorded"],
      ["speech to 10 kHz", "sample at N > 2 · 10 = 20 kHz"]] },
    { split: [["Sample rate sets", ["the ceiling", "N > 2·f<sub>max</sub>"]],
              ["Bit depth sets", ["the noise floor", "about 6 dB a bit: 16-bit gives about 96 dB"]]] }
  ],
  "w3c:1": [
    { rule: "The file stores readings, not Hz. Assume the wrong rate and every frequency scales by N<sub>assumed</sub> / N<sub>true</sub>, with no error." },
    { title: "Wrong rate, wrong pitch", calc: [
      ["24 kHz read as 16 kHz", "× 2/3: 1000 Hz reads as 667 Hz"],
      ["22.05 kHz read as 44.1 kHz", "× 2"],
      ["f<sub>Hz</sub>", "c · N"]] },
    { title: "Rates in this project", ladder: [
      ["24 kHz", "corpus", "ceiling 12 kHz"],
      ["16 kHz", "WavLM", "ceiling 8 kHz"],
      ["44.1 kHz", "MioCodec", "ceiling 22.05 kHz"],
      ["22.05 kHz", "Sarvam", "ceiling 11.025 kHz"]] },
    { title: "Resample by L/M", flow: ["insert zeros (L)", "low-pass at half the lower rate", "keep every M-th reading"],
      note: "Going down discards the band above the new ceiling. Going up cannot bring it back." }
  ],
  "w3c:2": [
    { title: "Resampling 24 kHz to 16 kHz", flow: ["readings", "FFT: spectrum", "low-pass: 1 below 8 kHz, 0 above", "keep every M-th reading"],
      note: "Without the low-pass, 10 kHz would fold to 16 − 10 = 6 kHz, inside the band you keep." },
    { title: "What the spectrum should show", split: [
      ["Expect", ["same shape below 8 kHz", "a cliff at 8 kHz, not a slope", "nothing above"]],
      ["Warning signs", ["energy above 8 kHz: no filter", "a mirror image below 8 kHz: aliasing", "8 to 12 kHz refilled after resampling up: impossible"]]] },
    { title: "FFT bins", calc: [
      ["bins at k·N/n", "1 s at 24 kHz: 1 Hz bins to 12 kHz"],
      ["plot", "20 log<sub>10</sub>|X(f)| in dB"]] }
  ],
  "wc4:0": [
    { title: "Walkthrough to flowchart", flow: ["recording", "model proposes nodes and edges + evidence", "code assembles graph", "chart rendered from graph"],
      note: "A node without evidence is not added, so the chart cannot show a step nobody said." },
    { title: "What a node carries", parts: [["step / actor / system / control", "the node"], ["edge", "the flow"], ["timestamp", "its evidence", true]] },
    { rule: "A graph is data: you can validate it, query it and diff it next year." }
  ],
  "wc4:1": [
    { title: "Control to risk", flow: ["control", "model suggests risk + reasoning", "person confirms", "logged: who, when, what changed", "next year's start"],
      note: "The firm's risk taxonomy is the fixed vocabulary; the model may not invent risks." },
    { split: [["Model does", ["proposes a mapping", "explains why"]],
              ["Person does", ["confirms or changes it", "owns the logged decision"]]] }
  ],
  "wc4:2": [
    { title: "One graph per year", flow: ["year 1 graph", "year 2 graph", "diff", "auditor looks here first"],
      note: "Never overwrite last year: store each as a version." },
    { title: "Where control risk concentrates", split: [
      ["Shows up in the diff", ["a new approver", "a swapped system", "manual step where one was automated"]],
      ["How history is kept", ["event sourcing", "change data capture", "not rows you overwrite"]]] }
  ],
  "wc4:3": [
    { title: "Reviewer memory", flow: ["last year's comment", "stored as a fact + provenance", "retrieved by control", "read into this year's test"],
      note: "Provenance is who said it, about which control, when." },
    { split: [["Model may", ["read the notes", "use them in this year's test"]],
              ["Model may not", ["rewrite them", "summarise them over time: that is drift"]]] }
  ],
  "w4a:0": [
    { rule: "A timeout cannot tell a slow response from a lost one, so every layer has to assume the call may have happened." },
    { title: "Where each thing lies to you", vs: { cols: ["What goes wrong", "What you do about it"], rows: [
      ["Network", "delayed, dropped, reordered, duplicated", "timeouts; treat silence as unknown"],
      ["Clocks", "drift and jump on resync", "never order events by wall clock"],
      ["A node's own state", "a long pause leaves it holding a lost lock", "fencing token, rejected if stale"],
      ["Partial failure", "part succeeds, part silently fails", "design for it as the normal case"]] } },
    { title: "Exactly-once, honestly", flow: ["at-least-once delivery", "idempotent processing", "exactly-once effect"],
      note: "The network alone never gives exactly-once delivery. The effect is what you can build." }
  ],
  "w4a:1": [
    { title: "How a retry storm forms and stops", flow: ["service overloaded", "clients time out", "all retry at once", "more load, no recovery", "backoff + jitter spreads them"],
      note: "Backoff alone makes every client wait the same interval, so they return in the same wave." },
    { title: "What each fix does", vs: { cols: ["Backoff only", "Backoff + jitter"], rows: [
      ["Wait before retry", "same interval for everyone", "random inside each window"],
      ["Retries spread out", "no: synchronised clusters", "yes: close to a constant rate"],
      ["Spike stays gone", "no: it re-forms round after round", "yes: it stays spread"],
      ["Calls, 100 contending clients", "baseline", "more than half fewer"]] } }
  ],
  "w4a:2": [
    { rule: "Idempotent means a repeat has no further effect: the result happens once however many times the call is made." },
    { title: "One request, three retries", parts: [
      ["Idempotency key", "unique, caller-provided token, not built from the parameters", true],
      ["Same key, same parameters", "returns the original response, no new side effect"],
      ["Same key, different parameters", "rejected as an error: mismatched intent"]] },
    { title: "Why it matters", flow: ["at-least-once delivery: retries will happen", "idempotency: retries are harmless", "exactly-once effect"] }
  ],
  "w4a:3": [
    { title: "Split the three percent by failure signature", vs: { cols: ["Fails every time", "Fails on a coin flip"], rows: [
      ["Example", "malformed payload, scenario the harness cannot build", "timeout, transient lock"],
      ["Retry it", "no: it burns capacity on a sure failure", "yes: backoff and jitter, small cap"],
      ["Where it goes", "dead-letter queue, waits for a person", "retried, then dead-lettered if still failing"]] } },
    { title: "The arithmetic", calc: [
      ["3% × 10<sup>8</sup> replays", "3 × 10<sup>6</sup> = 3,000,000 failures to handle"]] },
    { title: "Deduplication key", parts: [
      ["scenario id", "the replay's identity", true],
      ["attempt number", "stored beside it"],
      ["effect", "a retry overwrites its own partial result, never appends a second"]] }
  ],
  "w4a:4": [
    { rule: "A struggling service needs a lull to drain its backlog. Retries take that lull away." },
    { title: "Why retries finish it off", flow: ["already at capacity", "timeouts trigger retries", "retries queue behind the same congestion", "backlog never drains", "service falls over"],
      note: "Retries add load exactly when there is least capacity to spare." },
    { title: "The fix, in two halves", split: [["Backoff", ["spaces out when each client returns", "slows individual clients"]],
                                              ["Jitter", ["randomises the wait in each window", "stops every client landing on the same schedule"]]] }
  ],
  "w4b:0": [
    { title: "The running example", calc: [
      ["f(w<sub>1</sub>, w<sub>2</sub>)", "w<sub>1</sub><sup>2</sup> + 3w<sub>2</sub><sup>2</sup>"],
      ["∂f/∂w<sub>1</sub>, ∂f/∂w<sub>2</sub>", "2w<sub>1</sub>, 6w<sub>2</sub>"],
      ["∇f(1, 1)", "(2, 6)"],
      ["w − 0.1 · ∇f = (1, 1) − 0.1 · (2, 6)", "(0.8, 0.4)"],
      ["f(1, 1) = 1 + 3", "4"],
      ["f(0.8, 0.4) = 0.64 + 0.48", "1.12"]] },
    { title: "Why the gradient points uphill", flow: ["small step u of size ε", "f changes by ε ∇f · u", "∇f · u = |∇f| cos θ", "biggest at θ = 0: u along ∇f"],
      note: "So ∇f is the steepest way up, and −∇f the steepest way down." },
    { title: "Reading (2, 6)", parts: [
      ["∂f/∂w<sub>1</sub> = 2", "f rises 2 per unit of w<sub>1</sub>"],
      ["∂f/∂w<sub>2</sub> = 6", "f rises 6 per unit of w<sub>2</sub>: watch this one", true]] }
  ],
  "w4b:1": [
    { rule: "θ ← θ − η ∇L(θ): the gradient sets the direction, η only sets the size." },
    { title: "Parts of the rule", parts: [
      ["θ", "the parameters being updated"],
      ["∇L(θ)", "gradient of the loss: steepest way up"],
      ["−", "flips it to downhill: L falls by η|g|<sup>2</sup>", true],
      ["η", "learning rate: multiplies the gradient, nothing else"]] },
    { title: "L = θ<sup>2</sup>, ∇L = 2θ, start at θ = 3", vs: { cols: ["η = 0.1", "η = 1.0", "η = 1.1"], rows: [
      ["Update", "θ ← 0.8θ", "θ ← −θ", "θ ← −1.2θ"],
      ["Path", "3, 2.4, 1.92, 1.54", "3, −3, 3", "3, −3.6, 4.32, −5.18"],
      ["Settles at 0", "yes: steps shrink", "no: bounces between two points", "no: overshoots farther each step"]] } }
  ],
  "w4b:2": [
    { title: "Backprop in plain words", flow: ["forward: input to output", "cost: one number for how wrong", "start at the output error", "hand blame back one layer", "every weight has its share"],
      note: "An early weight's effect passes through every layer after it, so the blame has to travel backward." },
    { title: "What each piece is", parts: [
      ["Network", "a function with many tunable numbers"],
      ["Cost", "how wrong it is on the training data"],
      ["Gradient", "for each weight, how far a nudge moves the cost", true]] }
  ],
  "w4b:3": [
    { title: "Forward pass: keep every number", calc: [
      ["h = w<sub>1</sub>x = 0.5 · 2", "1.0"],
      ["a = σ(1.0)", "≈ 0.731"],
      ["z = w<sub>2</sub>a = 1.5 · 0.731", "≈ 1.097"],
      ["L = (z − y)<sup>2</sup> = (1.097 − 1)<sup>2</sup>", "≈ 0.0093"]] },
    { title: "Backward: multiply local derivatives", calc: [
      ["dL/dz = 2(z − y) = 2(0.097)", "≈ 0.193"],
      ["dL/dw<sub>2</sub> = 0.193 · a = 0.193 · 0.731", "≈ 0.141"],
      ["dL/da = 0.193 · w<sub>2</sub> = 0.193 · 1.5", "≈ 0.290"],
      ["da/dh = a(1 − a) = 0.731 · 0.269", "≈ 0.197"],
      ["dL/dw<sub>1</sub> = 0.290 · 0.197 · 2", "≈ 0.114"]] },
    { title: "The check", flow: ["nudge w<sub>1</sub> by 0.001", "rerun forward pass", "[L(w<sub>1</sub> + 0.001) − L(w<sub>1</sub>)] / 0.001 ≈ 0.114", "matches the chain rule"] }
  ],
  "w4b:4": [
    { rule: "Backprop is the chain rule computed once, backward, with each layer's sensitivity reused." },
    { title: "Two sentences, four moves", flow: ["L = f<sub>3</sub>(f<sub>2</sub>(f<sub>1</sub>(x))): a composition", "chain rule: product of local derivatives", "δ<sub>k−1</sub> = δ<sub>k</sub> · ∂f<sub>k</sub>/∂f<sub>k−1</sub>: reuse", "∂L/∂w<sub>k</sub> = δ<sub>k</sub> · ∂f<sub>k</sub>/∂w<sub>k</sub>"] },
    { title: "Why backward wins", vs: { cols: ["Backward walk", "Redo per weight"], rows: [
      ["Passes for n weights", "1", "n"],
      ["Reuses δ", "yes: shared by every weight at that layer", "no: path product rebuilt each time"],
      ["Cost", "a small constant times one forward pass", "n times that"]] } }
  ],
  "w4c:0": [
    { title: "Where an embedding row comes from", flow: ["table E, V × d, small random numbers", "lookup: one-hot · E picks row t", "loss reaches that row", "v<sub>c</sub> ← v<sub>c</sub> − η ∂L/∂v<sub>c</sub>", "similar contexts pull rows together"],
      note: "Only rows that were looked up get a gradient. The rest stay put that step." },
    { title: "One update, d = 2, η = 0.5", calc: [
      ["u<sub>o</sub> − ∑ p u = (1.0, 0.5) − (0.2, 0.1)", "(0.8, 0.4)"],
      ["η · (0.8, 0.4)", "(0.4, 0.2)"],
      ["v<sub>cat</sub> = (0.1, −0.2) + (0.4, 0.2)", "(0.5, 0.0)"],
      ["v<sub>dog</sub> = (−0.3, 0.3) + (0.4, 0.2)", "(0.1, 0.5)"],
      ["u<sub>o</sub> · v<sub>cat</sub>: 0.0 → 0.5", "higher"],
      ["u<sub>o</sub> · v<sub>dog</sub>: −0.15 → 0.35", "higher"]] },
    { title: "The gradient on the row", parts: [
      ["−u<sub>o</sub>", "the true neighbour's vector"],
      ["+ ∑ p(w | c) u<sub>w</sub>", "what the model currently believes"],
      ["step", "toward the word that appeared, away from the ones over-favoured", true]] }
  ],
  "w4c:1": [
    { rule: "V is value, not vector. The key decides how much to read; the value decides what is read." },
    { title: "Three projections of one input", parts: [
      ["q = x W<sup>Q</sup>", "what I am looking for"],
      ["k = x W<sup>K</sup>", "what this position advertises"],
      ["v = x W<sup>V</sup>", "the content carried forward", true]] },
    { title: "Three positions, d<sub>k</sub> = 2, q = (1, 0)", calc: [
      ["s = q · k = (2, 0, 1)", "k<sub>1</sub> = (2, 0), k<sub>2</sub> = (0, 2), k<sub>3</sub> = (1, 0)"],
      ["α = softmax(2, 0, 1)", "≈ (0.665, 0.090, 0.245)"],
      ["out = 0.665 · (1, 0) + 0.090 · (0, 1) + 0.245 · (1, 1)", "≈ (0.910, 0.335)"]] },
    { title: "A dictionary made soft", flow: ["score query against every key", "softmax: weights add to 1", "blend the values by weight"] }
  ],
  "w4c:2": [
    { rule: "Divide by √d<sub>k</sub> so the spread of a score stays 1 whatever d<sub>k</sub> is." },
    { title: "Variance, step by step", calc: [
      ["Var(q<sub>m</sub> k<sub>m</sub>) = E[q<sub>m</sub><sup>2</sup>] · E[k<sub>m</sub><sup>2</sup>]", "1 · 1 = 1"],
      ["Var(q · k) = ∑<sub>m=1..d<sub>k</sub></sub> 1", "d<sub>k</sub>, so std = √d<sub>k</sub>"],
      ["Var(q · k / √d<sub>k</sub>) = d<sub>k</sub> / (√d<sub>k</sub>)<sup>2</sup>", "1"]] },
    { title: "d<sub>k</sub> = 64: std = 8", vs: { cols: ["Unscaled (16, 0, −8)", "Divided by 8: (2, 0, −1)"], rows: [
      ["Softmax", "≈ (1.0000, 0.0000001, 0.00000000004)", "≈ (0.84, 0.11, 0.04)"],
      ["Top weight's gradient α(1 − α)", "about 0.0000001", "0.84 · 0.16 ≈ 0.13"],
      ["Can it still learn", "no: saturated", "yes: spread out"]] },
      note: "A saturated softmax passes almost no gradient back." }
  ],
  "wc2:0": [
    { title: "The pipeline, and who does each stage", flow: ["control definition", "test plan + attributes", "population (query)", "sample", "evidence per item", "attribute testing", "citation check", "exceptions", "drafted conclusion", "reviewer queue"] },
    { title: "Code or model", vs: { cols: ["Code", "Model"], rows: [
      ["Decides a fact", "yes", "no"],
      ["Attribute testing", "no", "yes: pass, fail, insufficient"],
      ["Narrative", "no", "yes: drafted around a fixed verdict"],
      ["Everything else", "yes: query, sample, retrieve, verify, exceptions", "no"]] } }
  ],
  "wc2:1": [
    { title: "What goes in the workpaper", parts: [
      ["Seed", "stored, so the draw can be repeated", true],
      ["Population query", "and its row count"],
      ["Sample size", "from the firm's methodology table, not a prompt"],
      ["Judgmental sample", "a human records the reason"]] },
    { title: "Why this is code", flow: ["same query + same seed", "same items", "anyone can re-run it"],
      note: "A deterministic, side-effect-free step can simply be re-run, so it belongs in code, not a model call." }
  ],
  "wc2:2": [
    { rule: "The model selects handles. It never writes a document name or a page number." },
    { title: "Citation as constrained selection", flow: ["chunk evidence with coordinates", "label chunks E1 to En", "model cites handles", "code resolves to coordinates, draws the box", "verifier: span contains the value"],
      note: "Exact match for amounts, dates and IDs. If the span does not contain the value, fail closed." },
    { title: "Generated or selected", vs: { cols: ["Model writes the reference", "Model selects a handle"], rows: [
      ["Citations always real", "no: it can invent one", "yes: impossible to invent, not just unlikely"],
      ["Who resolves it", "the model", "code"]] } }
  ],
  "wc2:3": [
    { title: "Each attribute, three answers", vs: { cols: ["Pass", "Fail", "Insufficient"], rows: [
      ["Meaning", "evidence supports it", "evidence contradicts it", "evidence is thin"],
      ["Routes to", "next stage", "exceptions", "a human"],
      ["Is it a valid result", "yes", "yes", "yes: the honest answer"]] } },
    { title: "What a result carries", parts: [
      ["Result", "pass, fail or insufficient", true],
      ["Cited handles", "which evidence"],
      ["Extracted value", "what was read"],
      ["Rationale", "short"]] },
    { rule: "A partial answer stated as partial beats a confident wrong one." }
  ],
  "wc2:4": [
    { title: "From results to conclusion", flow: ["attribute results", "code derives exceptions", "rule over count and severity", "verdict fixed", "model drafts narrative around it"] },
    { title: "Who controls what", split: [["Code owns", ["the exceptions", "the verdict, by a rule over count and severity"]],
                                          ["Model cannot", ["change the verdict", "write 'operating effectively' when an exception is recorded"]]] }
  ],
  "wc2:5": [
    { title: "Event sourcing, in this design", flow: ["every model call logged", "every reviewer decision logged", "append-only log of immutable facts", "workpaper = a view rebuilt from it"] },
    { title: "What each log entry holds", parts: [
      ["Model call", "handles seen, output, model version, prompt version"],
      ["Reviewer decision", "including overrides", true]] },
    { rule: "Overrides are labelled examples of exactly where the system is wrong, and they feed evaluation." }
  ],
  "wc2:6": [
    { title: "The evaluation answer", flow: ["gold set from past signed workpapers", "attribute-level agreement with reviewers", "citation precision gates releases", "watch the insufficient rate", "replay on every model or prompt change"] },
    { title: "Reading the insufficient rate", vs: { cols: ["Rising", "Falling suddenly"], rows: [
      ["Likely cause", "evidence retrieval got worse", "the model started guessing"],
      ["Action", "check retrieval", "check for guessed passes"]] } },
    { title: "The deterministic gate", parts: [
      ["Citation precision", "does the cited span contain the value", true],
      ["Needs human labels", "no: a string and number match"]] }
  ],
  "wc2:7": [
    { title: "Three likely weak points", parts: [
      ["Retrieval misses the evidence", "no verifier can catch what was never fetched", true],
      ["OCR errors", "scanned evidence read wrongly"],
      ["Judgment-call controls", "attributes that are not checkable facts"]] },
    { title: "The eight minutes", flow: ["pipeline: code vs model", "sample, citation", "three-valued results, exceptions", "reviewer loop, audit log", "evaluation", "three weakest points"] }
  ],
  "w5a:0": [
    { title: "Where a stale read comes from", flow: ["write lands on the leader", "copy sent to followers", "follower applies it late", "a read hits that follower", "old data comes back"],
      note: "No cache anywhere. The delay in the middle is replication lag." },
    { title: "What each guarantee promises", vs: { cols: ["Promise", "Without it"], rows: [
      ["Read-your-writes", "you see your own write at once", "no: your write seems lost"],
      ["Monotonic reads", "never see data go backwards", "no: new then old"],
      ["Consistent prefix", "writes appear in order", "no: effect before cause"],
      ["Eventual consistency", "replicas converge, no deadline", "no: gives no bound on staleness"]] } },
    { rule: "A cache adds a second, independent source of staleness on top of replication lag." }
  ],
  "w5a:1": [
    { title: "Settle in this order", flow: ["placement", "key", "staleness window", "invalidation rule"] },
    { title: "TTL or explicit invalidation", vs: { cols: ["TTL", "Explicit invalidation"], rows: [
      ["What it is", "a bet that a bounded window is fine", "a promise kept on every write path"],
      ["Write path", "yes: costs nothing", "no: every write must clear entries"],
      ["Staleness", "up to the window", "none, if no path is missed"],
      ["Fails by", "serving old answers until expiry", "silently, when a path is missed"]] } },
    { title: "Getting the key right", split: [["Right key", ["user plus query", "one user's results never reach another"]], ["Wrong key", ["too broad: merges requests that differ", "too narrow: never gets a hit"]]] }
  ],
  "w5a:2": [
    { title: "A memory assistant caches vector search: the four parts", parts: [["Where", "in front of the vector search"], ["Key", "user id plus the query"], ["Rule", "explicit invalidation, not TTL", true], ["Cost", "write, then search is a guaranteed miss"]] },
    { title: "A user adds a memory", flow: ["write for that user", "clear their cached searches", "next search misses", "fills from the source"],
      note: "Why not TTL: the window would answer from a world that no longer exists." },
    { rule: "The tradeoff is the answer, not the fact that a cache exists." }
  ],
  "w5a:3": [
    { title: "Five minutes, out loud, no notes", flow: ["rate: units per second, bursts", "bounded queue", "backpressure or shed load", "partition key, assume skew", "retries: backoff, jitter, idempotent", "size from p99"] },
    { title: "Each primitive and what it costs", vs: { cols: ["Why", "Cost"], rows: [
      ["Queue", "absorbs bursts", "memory"],
      ["Partitions", "spread load across the key", "coordination"],
      ["Retries", "survive partial failure", "capacity"]] } },
    { title: "Scale turns rare into daily", calc: [["1 in 10<sup>6</sup> failure × 10<sup>8</sup> a day", "about 100 a day"]],
      note: "At-least-once plus idempotency gives exactly-once effects." }
  ],
  "w5a:4": [
    { title: "Listen back twice", flow: ["content: was every primitive said", "delivery: filler, order, pace", "write three sentences for next time"] },
    { title: "The three fixes in this recording", split: [["Change", ["cut the filler that shows under pressure: 'so'", "name the partition key before the queue's response", "cost becomes one line: resilience against capacity"]], ["Test", ["a listener can say back the constraint you optimised for", "the vocabulary alone does not count"]]] }
  ],
  "w5b:0": [
    { title: "Conditioning shrinks the world", calc: [
      ["P(A | B) = P(A ∩ B) / P(B)", "keep B, rescale"],
      ["die: A = six, B = even", "(1/6) / (1/2) = 1/3"],
      ["P(B | A) = P(even | 6)", "1 ≠ 1/3"]],
      note: "The two directions count over different groups." },
    { title: "From the overlap to Bayes", flow: ["P(A ∩ B) = P(A | B) · P(B)", "also = P(B | A) · P(A)", "equate, divide by P(B)", "P(A | B) = P(B | A) · P(A) / P(B)"] },
    { title: "The denominator", parts: [["P(B)", "all the ways B arrives"], ["P(B | A) · P(A)", "route through A"], ["P(B | ¬A) · P(¬A)", "route through not-A"]], note: "Add both routes: total probability." }
  ],
  "w5b:1": [
    { title: "100,000 people", calc: [
      ["ill: 0.001 × 100,000", "100"],
      ["healthy: 100,000 − 100", "99,900"],
      ["true positives: 0.99 × 100", "99"],
      ["false positives: 0.05 × 99,900", "4,995"],
      ["positive column: 99 + 4,995", "5,094"],
      ["P(ill | +) = 99 / 5,094", "≈ 0.0194, about 2%"]] },
    { title: "The four cells", vs: { cols: ["Positive", "Negative"], rows: [
      ["Ill (100)", "99", "1"],
      ["Healthy (99,900)", "4,995", "94,905"]] },
      note: "Read the answer off the positive column." },
    { rule: "Healthy people outnumber ill ones 999 to 1, so false alarms swamp true cases." }
  ],
  "w5b:2": [
    { title: "One formula for the table", parts: [["s · r", "true positives"], ["f · (1 − r)", "false positives"], ["P(ill | +)", "s·r / (s·r + f·(1 − r))", true]], note: "r prevalence, s sensitivity, f false positive rate." },
    { title: "Same test, s = 0.99 and f = 0.05, four prevalences", ladder: [
      ["1.9%", "r = 0.001", ""],
      ["17%", "r = 0.01", ""],
      ["69%", "r = 0.1", ""],
      ["95%", "r = 0.5", "the test is the same each time"]] },
    { title: "Worked and break-even", calc: [
      ["fraud 1/500: 180 / (180 + 1,996)", "180 / 2,176 ≈ 0.083"],
      ["odds: 1/999 × 0.99/0.05", "≈ 0.0198, about 1 to 50"],
      ["r = f / (s + f) = 0.05 / 1.04", "≈ 0.048"]],
      note: "Below about 4.8% prevalence a positive is more likely wrong than right." }
  ],
  "w5b:3": [
    { title: "Softmax, scores to chances", calc: [
      ["p<sub>i</sub> = e<sup>z<sub>i</sub></sup> / Σ<sub>j</sub> e<sup>z<sub>j</sub></sup>", "positive, sums to 1"],
      ["z = (2, 1, 0)", "e<sup>z</sup> = (7.39, 2.72, 1.00), sum 11.11"],
      ["p", "(0.665, 0.245, 0.090)"]] },
    { title: "Cross-entropy and its gradient", flow: ["one-hot y: L = −Σ y<sub>i</sub> log p<sub>i</sub>", "L = −log p<sub>c</sub>", "L = −z<sub>c</sub> + log Σ e<sup>z<sub>j</sub></sup>", "∂L/∂z<sub>i</sub> = p<sub>i</sub> − y<sub>i</sub>"],
      note: "Minimising it is maximum likelihood." },
    { title: "Wrong by a lot: true score 0, wrong score 6", vs: { cols: ["Push on the true score"], rows: [
      ["Cross-entropy", "≈ −0.998"],
      ["Squared error", "≈ −0.0049: p(1 − p) goes to zero, about 200 times weaker"]] } }
  ],
  "w5c:0": [
    { title: "Two independent factors", parts: [["Y(f)", "what you hear"], ["E(f)", "source: the buzz, at k · F<sub>0</sub>"], ["H(f)", "filter: the tract, formants F<sub>n</sub>", true]], note: "On a dB scale the product is a sum, so a spectrum plot reads them apart." },
    { title: "Move one side, the other stays", vs: { cols: ["Harmonics", "Formants"], rows: [
      ["F<sub>0</sub> 100 → 200 Hz", "200, 400, 600 Hz", "stay at 500, 1500, 2500"],
      ["L 17.5 → 15 cm", "do not move", "583, 1750, 2917 Hz"]] } },
    { title: "Tract as a closed-open tube", calc: [
      ["F<sub>n</sub> = (2n − 1) · c / (4L)", "L = 17.5 cm, c = 350 m/s"],
      ["n = 1, 2, 3", "500, 1500, 2500 Hz"]],
      note: "Pitch lives on the source, identity on the filter." }
  ],
  "w5c:1": [
    { title: "Which side each measure reads", vs: { cols: ["Source side", "Filter side"], rows: [
      ["f0_mean", "yes: mean pitch over voiced frames", "no: no formant enters it"],
      ["Tract length L", "no: F<sub>0</sub> is not in it", "yes: uses F<sub>1</sub> and F<sub>3</sub> only"],
      ["Spectral tilt", "meant to be", "it leaks: see below"]] } },
    { title: "Check the length formula", calc: [
      ["L = ½ [ c / (4F<sub>1</sub>) + 5c / (4F<sub>3</sub>) ]", "F<sub>1</sub> = 500, F<sub>3</sub> = 2500"],
      ["½ (17.5 + 17.5)", "17.5 cm"]] },
    { title: "Where the tilt fit gets its weight", ladder: [
      ["43.2%", "below 500 Hz", "27 bins"],
      ["27.4%", "500 Hz to 4 kHz", "308 bins"],
      ["29.4%", "above 4 kHz", "341 bins: w<sub>i</sub> = (x<sub>i</sub> − x̄)<sup>2</sup> / Σ (x<sub>j</sub> − x̄)<sup>2</sup>"]],
      note: "Those 27 bins hold the first F<sub>0</sub> harmonics, so moving F<sub>0</sub> moves 43% of the fit." }
  ],
  "w5c:2": [
    { title: "Same filter, two pitches", vs: { cols: ["90 Hz voice", "250 Hz voice"], rows: [
      ["Harmonics in 80 to 8000 Hz", "88", "32"],
      ["Bins per harmonic (11.7 Hz)", "7.7", "21.3"],
      ["Harmonics under 500 Hz", "five: 90 to 450", "one: 250"],
      ["Floor per harmonic", "less", "2.8 times more"]] } },
    { title: "The arithmetic", calc: [
      ["N ≈ 7920 / F<sub>0</sub>", "88 at 90 Hz, 32 at 250 Hz"],
      ["88 / 32", "2.8 times"],
      ["24 000 / 2048", "11.7 Hz per bin"]] },
    { rule: "Harmonics sample the envelope every F<sub>0</sub> hertz, so tilt reads the sampling, not the envelope." }
  ]
  };
  for (var k in V) { if (window.SHEETS[k]) { window.SHEETS[k].vis = V[k]; } }
})();

/* ---------------------------------------------------------------- w5d Low-level design: the foundations (23 Oct 2026) */
(function () {
  var S = window.SHEETS = window.SHEETS || {};
  S["w5d:0"] = {
    cheat: ["High-level: boxes across machines (cache, shard, queue) and what fails between them.",
            "Low-level: one box opened up: classes, what each owns, how they call each other, code that runs.",
            "Same habits: requirements first, a trade-off for every choice, say what you leave out.",
            "Seven steps: clarify, use cases, entities, relationships, class sketch, core code with a dry run, extensions.",
            "Core code gets about a third of the 45 minutes; the interviewer reads it line by line."],
    terms: [
      { t: "Low-level design (LLD)", mem: "Inside one service.", d: "The classes of one program: their responsibilities, relationships and interfaces, shown in code that runs." },
      { t: "High-level design (HLD)", mem: "Across machines.", d: "How work spreads over services, stores and queues, and how it survives failure. The milestone's systems work so far." },
      { t: "Responsibility", mem: "What a class is for.", d: "The one job a class owns, data and the rules about it. A split is good when each change touches one class." },
      { t: "Dry run", mem: "Run it in your head, out loud.", d: "Walking one example through the code line by line, saying the values, when there is no run button." }],
    vis: [
      { title: "Two zoom levels", vs: { cols: ["High-level design", "Low-level design"], rows: [
        ["Unit", "a service, a store, a queue", "a class"],
        ["Fails by", "a dead node, a hot partition", "a bad split of responsibilities"],
        ["Output", "a box diagram and numbers", "a class sketch and running code"]] } },
      { title: "The round", flow: ["Clarify", "Use cases", "Entities", "Relationships", "Class sketch", "Core code", "Extensions"], note: "Core code is about a third of the time." }]
  };
  S["w5d:1"] = {
    cheat: ["The prompt is thin on purpose: your questions set the scope, and they are scored.",
            "Ask: actors, three or four use cases, scale, concurrent actions, persistence, money, failure.",
            "Each answer changes the design: an order that can change needs states; discounts need a pricing strategy.",
            "Money in integer cents, never floats.",
            "Say the scope back in three sentences, what is in and out, and get a yes before sketching."],
    terms: [
      { t: "Eliciting", mem: "Drawing out what they want.", d: "Asking the questions that turn a one-line prompt into an agreed scope." },
      { t: "Actor", mem: "Who acts.", d: "A person or system that uses the design: a customer, a barista, an admin." },
      { t: "Use case", mem: "A verb it must do.", d: "One thing the system does for an actor, written as a short sentence: place an order, mark it ready." },
      { t: "Scope", mem: "In and out, agreed.", d: "The use cases you will build and the ones you leave out, said back and confirmed." }],
    vis: [
      { title: "Question to design decision", vs: { cols: ["Ask", "Changes"], rows: [
        ["Actors", "Who acts?", "the classes with methods"],
        ["Change after placing", "Can an order be edited or cancelled?", "whether order needs states"],
        ["Money", "Discounts, loyalty?", "a pricing strategy; cents"],
        ["Concurrency", "Can two baristas take one order?", "a claim step or a lock"]] } },
      { rule: "Say the scope back before you sketch." }]
  };
  S["w5d:2"] = {
    cheat: ["Nouns that own data or a rule are class candidates; nouns no use case needs are not.",
            "has-a (composition) by default; uses for a call without ownership; is-a only when children are truly interchangeable.",
            "Abstract base class: a family of variants behind one method, so a new variant is a new class.",
            "Enum for a fixed set of values (status, size); dataclass for plain data.",
            "Protocol when you only care which methods something has."],
    terms: [
      { t: "Composition (has-a)", mem: "Built from parts.", d: "A class holds other objects as fields and delegates to them. Parts can be swapped without touching the holder." },
      { t: "Inheritance (is-a)", mem: "A kind of the parent.", d: "A child class that can be used wherever the parent is. Ties the child to the parent's details." },
      { t: "Abstract base class", mem: "A contract with no body.", d: "abc.ABC with @abstractmethod: it names the methods every child must implement and cannot be built itself." },
      { t: "Enum", mem: "A fixed set of names.", d: "Named values such as OrderStatus.READY, instead of loose strings that can be misspelled." },
      { t: "dataclass", mem: "Plain data, less typing.", d: "@dataclass writes __init__, repr and equality from the field list." }],
    vis: [
      { title: "Coffee-shop sketch", parts: [["Order", "has-a lines, a status Enum, total()"], ["OrderLine", "has-a MenuItem, a size, a quantity"], ["Payment", "abstract: pay(amount_cents)", true], ["Card, Cash", "is-a Payment"], ["Barista", "uses Order"]] },
      { title: "Which relationship", vs: { cols: ["Use it when"], rows: [
        ["has-a", "the class owns the part and its lifetime"], ["uses", "it calls something it does not own"], ["is-a", "the child works anywhere the parent does"]] } }]
  };
  S["w5d:3"] = {
    cheat: ["SOLID is five checks on a split: one reason to change, add not edit, substitutable children, small interfaces, depend on the abstraction.",
            "Strategy: interchangeable rules (pricing, discounts). Cost: one more class per rule.",
            "Factory: build the right variant from a type. State: actions depend on status. Observer: tell listeners when something happens.",
            "Singleton: mostly refuse; it hides a global and makes tests share state.",
            "Say choice, reason, cost for every pattern; name what you leave out."],
    terms: [
      { t: "Single responsibility", mem: "One reason to change.", d: "Each class changes for one kind of reason, so a change touches one place." },
      { t: "Open-closed", mem: "Add, don't edit.", d: "New behaviour arrives as a new class; working code is not edited." },
      { t: "Liskov substitution", mem: "Children are drop-ins.", d: "Anywhere the parent works, every child works too, without surprises." },
      { t: "Dependency inversion", mem: "Depend on the contract.", d: "High-level code calls an abstraction (Payment), not a concrete class (CardPayment)." },
      { t: "State pattern", mem: "Behaviour follows status.", d: "Each status is a class that decides which actions are allowed, instead of one long if-chain." },
      { t: "Strategy pattern", mem: "Swap the rule.", d: "A family of interchangeable algorithms behind one method, chosen at run time." }],
    vis: [
      { title: "Five patterns", vs: { cols: ["Use it when", "Too much when"], rows: [
        ["Strategy", "rules vary and will grow", "there is one rule"],
        ["Factory", "the type is chosen at run time", "there is one type"],
        ["State", "actions depend on status, four or more", "two statuses and a boolean"],
        ["Observer", "several things react to one event", "one caller would do"],
        ["Singleton", "almost never", "nearly always"]] } },
      { rule: "The pattern is the means; the reason and the cost are the answer." }]
  };
})();
