BASELINE.field({
  id: "systems", name: "Systems fundamentals", short: "Systems", layer: "Foundations",
  ink: "#4E5D6C", inkDark: "#A9B8C7",
  lede: "How one computer runs code: the processes and threads it schedules, the memory and disks it reads, the kernel in between, and the network that carries every request.",
  overview: [
    "Systems is the layer under every framework. The operating system turns one CPU into many processes, a few gigabytes of RAM into a private address space for each, and a disk into files. The network stack turns wires and radio into reliable byte streams between machines. Engineers who work here day to day hold titles like systems engineer, kernel or performance engineer, SRE and infrastructure engineer, but every backend and ML engineer meets this layer the first time a service is slow and the profiler points below their own code.",
    "The questions here come back in every other field. Why a Python service stalls when one handler blocks (the event loop). Why a container gets OOMKilled at a number below its limit (virtual memory and page cache). Why a model server is limited by memory bandwidth and not by FLOPs (the memory hierarchy, then the GPU). Why a new HTTPS connection costs three round trips before the first byte (TCP and TLS). Distributed systems is this field with many machines and a network that fails; inference engineering is this field on a GPU.",
    "Read the map as one request's path through one machine: the network on the left, the kernel and your process in the middle, memory and storage on the right. Then the latency numbers: knowing that a memory read is about 100 ns and a cross-ocean round trip about 150 ms is what makes every later estimate possible."
  ],
  diagram: {
    nodes: [
      { id: "dns", label: "DNS", sub: "name to address", col: 0, row: 0 },
      { id: "tcp", label: "TCP", sub: "reliable byte stream", col: 0, row: 1 },
      { id: "tls", label: "TLS", sub: "encrypt, authenticate", col: 0, row: 2 },
      { id: "http", label: "HTTP/1.1, 2, 3", sub: "requests on the wire", col: 0, row: 3 },
      { id: "sockets", label: "Sockets", sub: "a file descriptor per peer", col: 1, row: 1 },
      { id: "event-loops", label: "Event loop", sub: "epoll, async I/O", col: 1, row: 2 },
      { id: "processes-threads", label: "Process and threads", sub: "your running code", col: 1, row: 3 },
      { id: "system-calls", label: "System calls", sub: "into the kernel", col: 1, row: 4 },
      { id: "gpu", label: "GPU", sub: "a co-processor", col: 1, row: 5 },
      { id: "memory-hierarchy", label: "Caches and RAM", sub: "L1 to DRAM", col: 2, row: 2 },
      { id: "virtual-memory", label: "Virtual memory", sub: "pages, page tables", col: 2, row: 3 },
      { id: "file-systems", label: "File system", sub: "page cache, fsync", col: 2, row: 4 }
    ],
    edges: [
      ["dns", "tcp", "then connect"], ["tcp", "tls"], ["tls", "http"],
      ["tcp", "sockets", "accept()"], ["sockets", "event-loops", "readiness"],
      ["event-loops", "processes-threads", "runs inside"], ["processes-threads", "system-calls"],
      ["system-calls", "gpu", "driver calls"], ["system-calls", "file-systems", "read, write"],
      ["processes-threads", "virtual-memory", "address space"], ["virtual-memory", "memory-hierarchy", "TLB, caches"],
      ["virtual-memory", "file-systems", "page cache"]
    ],
    cap: "**One request's path through one machine, from the name lookup to the disk.** The left column is the network, the middle is your process and the kernel it calls into, the right is memory and storage. Most performance problems live where a box in the middle waits on a box to its left or right."
  },
  start: [
    { label: "Arpaci-Dusseau, Operating Systems: Three Easy Pieces: ch. 4 Processes, ch. 18 Paging, ch. 26 Concurrency, ch. 39 Files", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", m: 120, why: "The clearest free OS book; each chapter opens with the one question it answers." },
    { label: "Ilya Grigorik, High Performance Browser Networking: Building blocks of TCP", url: "https://hpbn.co/building-blocks-of-tcp/", m: 30, why: "Handshakes, slow start and head-of-line blocking, with the latency cost of each." },
    { label: "Colin Scott, Latency numbers every programmer should know (interactive, by year)", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html", m: 5, why: "The orders of magnitude every estimate in this field starts from." },
    { label: "Kurose and Ross, Computer Networking: free online lectures and interactive problems", url: "https://gaia.cs.umass.edu/kurose_ross/", m: 60, why: "The standard networking text, top-down from HTTP to the link layer." }
  ],
  clusters: [
    { name: "Running programs", line: "How the operating system shares one machine between many programs.",
      topics: [
        { id: "processes-threads", name: "Processes and threads",
          line: "A process owns an address space; threads are paths of execution sharing it.",
          body: [
            "A **process** is a running program: its own virtual address space, open file descriptors, and at least one thread. A **thread** is a path of execution with its own registers and stack that shares everything else with the other threads in its process. Creating a process on Unix is `fork` (copy this one) then `exec` (replace it with a new program). Switching the CPU from one thread to another, a context switch, costs on the order of microseconds once you count the cache it disturbs.",
            "The choice is isolation against cost. Processes cannot corrupt each other's memory and can crash alone, but each one costs memory and they talk through pipes, sockets or shared memory. Threads share memory directly, which is fast and is also how data races happen."
          ],
          where: "Chrome runs each site in its own process so one bad tab cannot read another. Postgres forks a process per connection, which is why PgBouncer exists. Python's GIL long meant one thread runs Python at a time, so CPU-bound work used `multiprocessing`; an optional free-threaded build arrived in 3.13.",
          nuance: "Threads are not free parallelism. Shared memory needs locks, and a thousand threads mostly wait on each other and on the scheduler. For many connections that mostly wait on I/O, an event loop is cheaper.",
          read: [{ label: "OSTEP ch. 4: The abstraction: the process", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf", m: 25 }],
          tags: ["fork", "exec", "gil", "context switch", "multiprocessing"] },
        { id: "scheduling", name: "CPU scheduling",
          line: "The kernel decides which ready thread runs next, and for how long.",
          body: [
            "More threads are ready to run than there are cores, so the kernel time-slices: a timer interrupt fires, the scheduler picks the next thread, and the old one goes back in the queue. Good schedulers favour short interactive work so a keystroke is handled before a long batch job finishes its slice. The textbook design is the multi-level feedback queue; Linux used the Completely Fair Scheduler for years and moved to EEVDF in kernel 6.6 (2023).",
            "Language runtimes add their own layer. Go multiplexes many goroutines onto a few OS threads; Python's asyncio and Node run many tasks on one thread and switch only when a task awaits."
          ],
          where: "Kubernetes CPU limits are enforced by the kernel's CFS bandwidth control: a container that uses its quota early in a 100 ms period is throttled for the rest of it. Latency-sensitive services such as trading systems pin threads to cores to avoid being moved.",
          nuance: "A CPU limit can throttle a container even when the node is idle, which shows up as p99 spikes with low average CPU. Many teams set requests and drop limits for this reason.",
          read: [{ label: "OSTEP ch. 8: Scheduling: the multi-level feedback queue", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf", m: 25 }],
          tags: ["scheduler", "cfs", "eevdf", "throttling", "goroutines"] },
        { id: "system-calls", name: "The kernel and system calls",
          line: "The only door from your program into the hardware, and it has a cost.",
          body: [
            "The CPU runs your code in **user mode**, where it cannot touch devices or other processes' memory. To read a file, open a socket or allocate memory it makes a **system call**: a special instruction traps into the kernel, which checks the request, does the work in kernel mode and returns. Linux has a few hundred of them: `read`, `write`, `open`, `mmap`, `clone`, `epoll_wait` and so on.",
            "Each crossing costs far more than a function call, because of the mode switch and the caches it disturbs, and it cost more again after the 2018 Meltdown mitigations. That is why buffered I/O exists, why `gettimeofday` is served from the vDSO without a real trap, and why io_uring lets a program submit many operations per call."
          ],
          where: "`strace` shows every call a process makes and is the first tool when something hangs. eBPF tools observe calls in production with little overhead. gVisor, used for sandboxing in Google Cloud, intercepts system calls so untrusted code never reaches the host kernel directly.",
          nuance: "A program doing tiny reads and writes can spend most of its time crossing into the kernel. Batching (bigger buffers, fewer calls) is often the cheapest speed-up available.",
          read: [{ label: "OSTEP ch. 6: Mechanism: limited direct execution", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf", m: 25 }],
          tags: ["syscall", "user mode", "kernel mode", "strace", "ebpf", "vdso"] },
        { id: "virtual-memory", name: "Virtual memory",
          line: "Every process sees a private address space that the hardware maps onto real RAM.",
          body: [
            "Each process uses virtual addresses. The memory management unit translates them to physical addresses through **page tables**, one page (usually 4 KiB) at a time, and caches recent translations in the **TLB**. A page that is not mapped causes a **page fault**: the kernel loads it from disk, allocates a zeroed page, or kills the process for touching memory it does not own.",
            "This one mechanism gives isolation between processes, lazy allocation (memory is reserved but not backed until touched), `mmap` of files into memory, and copy-on-write after `fork`, where parent and child share pages until one writes. Huge pages (2 MiB or 1 GiB) cut TLB misses for large heaps, databases and ML workloads."
          ],
          where: "Redis snapshots with `fork` and relies on copy-on-write, so a write-heavy instance can briefly need up to twice its memory. In Kubernetes, `OOMKilled` means the kernel's out-of-memory killer ended a container that crossed its cgroup memory limit.",
          nuance: "Virtual size, resident size (RSS) and the page cache are different numbers, and dashboards mix them up. Linux overcommits by default, so allocation succeeds and the failure arrives later, as the OOM killer.",
          read: [{ label: "OSTEP ch. 18 Paging: introduction, and ch. 19 TLBs", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf", m: 40 }],
          tags: ["paging", "tlb", "page fault", "mmap", "copy-on-write", "oom"] }
      ] },
    { name: "Memory, storage and the GPU", line: "Where data sits, how long it takes to reach, and the co-processor beside the CPU.",
      topics: [
        { id: "memory-hierarchy", name: "The memory hierarchy and caches",
          line: "Small fast memory near the core, large slow memory far away; locality decides speed.",
          body: [
            "A core reads registers in under a nanosecond, its L1 cache in about one, L2 and L3 in a few to tens, and main memory (DRAM) in about 100 ns. Data moves between them in **cache lines**, 64 bytes on most x86 chips. When code walks memory in order, the hardware prefetches the next lines and nearly every read hits cache; when it chases pointers across the heap, nearly every read waits on DRAM.",
            "So the same algorithm can run ten times faster with a different layout. Arrays beat linked lists, a struct of arrays beats an array of structs when a loop reads one field, and two threads writing to different variables on the same cache line slow each other down (false sharing)."
          ],
          where: "Columnar databases such as ClickHouse and DuckDB, and formats such as Parquet, store a column contiguously so a scan reads only the bytes it needs. Game engines lay out entity data for cache-friendly loops. LLM decoding on GPUs is limited by memory bandwidth for the same reason.",
          nuance: "Big-O hides constant factors of 100 between a cache hit and a DRAM miss. Measure with a profiler that shows cache misses (`perf stat`) before trusting the complexity alone.",
          read: [{ label: "Ulrich Drepper, What every programmer should know about memory: section 3, CPU caches", url: "https://people.freebsd.org/~lstewart/articles/cpumemory.pdf", m: 60 }],
          tags: ["cache line", "l1", "dram", "locality", "false sharing", "prefetch"] },
        { id: "latency-numbers", name: "Latency numbers worth knowing",
          line: "Orders of magnitude from a cache hit to a cross-ocean round trip.",
          body: [
            "The rough ladder, from the commonly cited table: an L1 cache hit about 1 ns, a main memory read about 100 ns, a random read from an SSD about 16 microseconds, a round trip inside one datacenter about 500 microseconds, and a packet from California to the Netherlands and back about 150 ms. Each step is roughly 100 to 1000 times the one before.",
            "These numbers are for estimating, not for quoting. A design that makes 50 sequential calls across a datacenter has spent 25 ms before doing any work; one that reads from RAM instead of SSD saves two orders of magnitude; one that serves users on two continents from a single region pays the speed of light on every request."
          ],
          where: "Back-of-envelope estimates in system design interviews start here. CDNs such as Cloudflare and Fastly exist because the cross-ocean number cannot be optimised away, only moved closer to the user.",
          nuance: "Memory and network latency have barely improved in years while bandwidth keeps growing. Many round trips hurt more than large payloads, so batch calls and avoid chatty protocols.",
          read: [{ label: "Colin Scott, Latency numbers every programmer should know (interactive)", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html", m: 5 }],
          tags: ["latency", "back of envelope", "estimation", "rtt"] },
        { id: "file-systems", name: "File systems and I/O",
          line: "Files, directories and the page cache between your write and the disk.",
          body: [
            "A file system maps names to files and files to blocks on a device. On Linux each file has an **inode** holding its metadata and block locations; a directory maps names to inode numbers. Reads and writes go through the **page cache** in RAM: `write` returns once the data is in memory, and the kernel flushes it to disk later. Only `fsync` asks the kernel to put it on stable storage and wait.",
            "Journaling file systems such as ext4 and XFS log metadata changes first so a crash cannot leave the directory tree half-updated. Copy-on-write designs such as ZFS and btrfs never overwrite in place, which makes snapshots cheap."
          ],
          where: "Databases depend on this: Postgres writes its write-ahead log and calls `fsync` before it confirms a commit. In 2018 Postgres found that after a failed `fsync`, Linux could drop the dirty pages and a retry would report success, and changed its code to crash instead.",
          nuance: "`write` returning is not durability. Neither is `fsync` on a disk or cloud volume that lies about its cache. Durable systems fsync the file, fsync the directory after a rename, and test with real power loss.",
          read: [{ label: "OSTEP ch. 39: Interlude: files and directories", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf", m: 35 }],
          tags: ["inode", "page cache", "fsync", "journaling", "ext4", "durability"] },
        { id: "gpu", name: "The GPU as a co-processor",
          line: "Thousands of simple cores the CPU hands work to, fed by very fast memory.",
          body: [
            "A GPU is a separate processor with its own memory. The CPU copies data over PCIe (or NVLink), then **launches a kernel**: one function run by thousands of threads at once. NVIDIA groups threads into **warps** of 32 that execute the same instruction together on a streaming multiprocessor, so branches that diverge inside a warp run one after the other. GPU memory (HBM) delivers terabytes per second, far more than a CPU's DRAM, but the trip across PCIe is much slower, so data should stay on the device.",
            "Whether a workload is fast depends on its arithmetic intensity: how many operations it does per byte read. Matrix multiplies do many and keep the cores busy; elementwise operations and LLM decoding do few and wait on memory."
          ],
          where: "NVIDIA's H100 and Blackwell parts train and serve most large models; CUDA is the programming model under PyTorch. AMD's MI300 series with ROCm and Google's TPUs are the main alternatives. Kernel libraries such as FlashAttention exist to cut memory traffic.",
          nuance: "Most deep learning code is limited by memory bandwidth or Python overhead, not by FLOPs. Fusing operations so data stays in on-chip memory often beats a faster GPU.",
          read: [
            { label: "Pramod Goyal, CUDA from zero to hero #1", url: "https://x.com/goyal__pramod/status/2103565642800431533", m: 15 },
            { label: "Sasha Rush, GPU Puzzles: 14 CUDA exercises in Python with Numba", url: "https://github.com/srush/gpu-puzzles", m: 120 }
          ],
          tags: ["cuda", "warp", "hbm", "kernel", "pcie", "arithmetic intensity", "nvidia"] }
      ] },
    { name: "Concurrency", line: "Many things in flight at once, and the bugs that come from sharing.",
      topics: [
        { id: "races-locks", name: "Races, locks and atomics",
          line: "When two threads touch shared data, the result depends on timing unless something orders them.",
          body: [
            "A **race condition** happens when the outcome depends on how threads interleave. The classic case is `count += 1` from two threads: each reads the old value, adds one and writes back, and one increment is lost. The fix is to make the read-modify-write a **critical section** that one thread enters at a time, with a **mutex**, or to use an **atomic** instruction such as compare-and-swap that does it in one indivisible step.",
            "Locks are correct and easy to reason about; under contention, threads queue on them and throughput falls. Lock-free structures use atomics instead and are much harder to get right, because compilers and CPUs reorder memory operations unless told not to (memory ordering)."
          ],
          where: "Go ships a race detector (`go test -race`); Rust's ownership rules reject data races at compile time. Java's `ConcurrentHashMap` and Go's `sync.Map` split the lock so readers rarely wait. Databases use the same ideas as row locks.",
          nuance: "A race can pass every test and fail once a week in production. Prefer not sharing (message passing, one owner per piece of state) over sharing carefully.",
          read: [{ label: "OSTEP ch. 28: Locks", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf", m: 35 }],
          tags: ["race condition", "mutex", "atomic", "compare-and-swap", "critical section"] },
        { id: "deadlock", name: "Deadlock and its relatives",
          line: "Threads each holding what another needs, so none can move.",
          body: [
            "A deadlock needs four things at once: exclusive locks, holding one lock while waiting for another, no forced release, and a cycle of waiting (thread A holds X and wants Y, thread B holds Y and wants X). Break any one and it cannot happen. The usual fix is a global lock order: every thread takes X before Y.",
            "Relatives: **livelock**, where threads keep reacting to each other and make no progress; **starvation**, where one thread never gets its turn; and **priority inversion**, where a low-priority thread holds a lock a high-priority one needs while a medium-priority thread keeps the CPU."
          ],
          where: "Postgres and MySQL detect lock cycles between transactions and abort one with a deadlock error, so applications must retry. NASA's Mars Pathfinder kept resetting in 1997 because of priority inversion, fixed by enabling priority inheritance remotely.",
          nuance: "Lock timeouts turn a deadlock into slow errors and hide the cause. When you see periodic timeouts under load, look for two code paths that take the same locks in different orders.",
          tags: ["deadlock", "livelock", "priority inversion", "lock ordering"] },
        { id: "event-loops", name: "Async I/O and event loops",
          line: "One thread serving thousands of connections by never waiting on any of them.",
          body: [
            "Most server time is spent waiting on the network or disk. Instead of one blocked thread per connection, an **event loop** asks the kernel which sockets are ready (`epoll` on Linux, `kqueue` on BSD and macOS), runs the code for those, and goes back to asking. Code is written as callbacks or as `async` functions whose `await` hands control back to the loop.",
            "There are two kernel models. Readiness (`epoll`) says a socket can be read now; completion (io_uring on Linux, IOCP on Windows) does the read and tells you when it has finished, and works for files too. io_uring uses two shared ring buffers, so many operations cost few system calls."
          ],
          where: "Node.js runs on libuv's event loop; Python has asyncio with uvloop as a faster loop; Rust has tokio; nginx and Redis are built around one. LLM API gateways and voice agents are mostly async Python or Node because they spend their time waiting on model calls and audio streams.",
          nuance: "Async makes waiting cheap, not work fast. One blocking call (a synchronous HTTP client, a CPU-heavy loop) stalls every connection on that loop; move it to a thread pool or another process.",
          read: [
            { label: "Node.js, The event loop, timers and process.nextTick()", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", m: 15 },
            { label: "LWN, Ringing in a new asynchronous I/O API (io_uring)", url: "https://lwn.net/Articles/776703/", m: 15 }
          ],
          tags: ["epoll", "kqueue", "io_uring", "asyncio", "libuv", "async await", "nonblocking"] }
      ] },
    { name: "Networking", line: "How bytes get from one machine to another, layer by layer.",
      topics: [
        { id: "ip-packets", name: "IP, packets and routing",
          line: "Best-effort delivery of addressed packets, hop by hop, with no promises.",
          body: [
            "The Internet Protocol moves **packets**, each with a source and destination address, from router to router until they arrive. Each router looks up the destination in its routing table and forwards; between networks, BGP decides which paths exist. IP promises nothing: packets can be lost, duplicated, reordered or delayed. An Ethernet packet carries about 1500 bytes (the MTU), so larger messages are split.",
            "IPv4 addresses ran out years ago, so most devices sit behind **NAT**, which rewrites private addresses to a shared public one. IPv6 has enough addresses to make NAT unnecessary and carries a large share of traffic to big providers, though IPv4 is still everywhere inside networks."
          ],
          where: "An AWS VPC is a private IP range (a CIDR block such as 10.0.0.0/16) split into subnets; a NAT gateway lets private instances reach out. Kubernetes gives every pod its own IP. Facebook's six-hour outage in October 2021 began with a BGP change that withdrew the routes to its own DNS servers.",
          nuance: "Loss and reordering are normal, not failures. Everything above IP (TCP, QUIC, your retries) exists to cope with that, and its costs show up as latency.",
          tags: ["ip", "ipv6", "nat", "bgp", "mtu", "cidr", "vpc"] },
        { id: "tcp", name: "TCP",
          line: "A reliable, ordered byte stream built on top of unreliable packets.",
          body: [
            "TCP opens a connection with a three-way handshake (SYN, SYN-ACK, ACK), one round trip before any data. It numbers every byte, retransmits what is not acknowledged, and delivers bytes in order. **Flow control** stops a sender from overrunning the receiver; **congestion control** stops it from overrunning the network, starting slowly (slow start) and backing off on loss. Linux defaults to CUBIC; Google's BBR models bandwidth and delay instead of reacting to loss.",
            "Because delivery is in order, one lost packet holds up everything behind it (head-of-line blocking), even bytes that belong to an unrelated request."
          ],
          where: "HTTP/1.1, HTTP/2, gRPC, Postgres and Redis connections all ride on TCP. Connection pools in database drivers and HTTP clients exist to avoid paying the handshake and slow start on every call.",
          nuance: "TCP is a byte stream, not a message stream: one `send` can arrive as two reads, so protocols need framing (a length prefix or a delimiter). Closed connections linger in TIME_WAIT, which matters when a client opens thousands per second.",
          read: [{ label: "Ilya Grigorik, High Performance Browser Networking: Building blocks of TCP", url: "https://hpbn.co/building-blocks-of-tcp/", m: 30 }],
          tags: ["handshake", "congestion control", "slow start", "bbr", "cubic", "head-of-line blocking"] },
        { id: "udp", name: "UDP",
          line: "Datagrams with no connection, ordering or retransmission; you add only what you need.",
          body: [
            "UDP adds ports and a checksum to IP and nothing else. There is no handshake, so the first packet carries data; there is no retransmission, so a lost packet stays lost; there is no ordering, so packets arrive as the network delivers them. Applications that use it build the parts of reliability they need on top.",
            "That trade suits traffic where late data is worthless: a voice frame that arrives after its playback time is better dropped than retransmitted. It also suits protocols that want their own congestion control and streams without waiting for operating systems to change their TCP stacks."
          ],
          where: "DNS queries are UDP. QUIC, and with it HTTP/3, runs over UDP. WebRTC sends voice and video media over UDP (RTP), which is why real-time voice agents and video calls use it. Multiplayer games send position updates over UDP.",
          nuance: "Corporate firewalls often block or throttle UDP, so real-time products keep a TCP or TLS fallback (TURN over TCP for WebRTC). Without congestion control, a UDP sender can flood a link.",
          read: [{ label: "Ilya Grigorik, High Performance Browser Networking: Building blocks of UDP", url: "https://hpbn.co/building-blocks-of-udp/", m: 20 }],
          tags: ["datagram", "rtp", "webrtc", "quic", "games"] },
        { id: "dns", name: "DNS",
          line: "The distributed, cached directory that turns names into addresses.",
          body: [
            "Your machine asks a **recursive resolver** (your ISP's, or a public one such as 1.1.1.1 or 8.8.8.8). On a cache miss the resolver asks a root server which servers handle `.com`, asks those which servers are authoritative for `example.com`, and asks those for the record. Every answer carries a **TTL**, and every resolver along the way caches it for that long.",
            "Common records: `A` and `AAAA` (IPv4 and IPv6 addresses), `CNAME` (an alias for another name), `MX` (mail servers), `TXT` (domain verification, SPF). Because answers can differ by who asks, DNS is also a load balancer: services return different addresses by region or health."
          ],
          where: "AWS Route 53, Cloudflare and Google Cloud DNS host authoritative zones. Kubernetes runs CoreDNS so services find each other by name. GeoDNS sends users to the nearest region.",
          nuance: "Changes are not instant: old answers live in caches until their TTL expires, and some clients ignore TTLs. Lower the TTL days before a migration, not during it. When an outage makes no sense, check DNS first.",
          read: [{ label: "Julia Evans, A toy DNS resolver", url: "https://jvns.ca/blog/2022/02/01/a-dns-resolver-in-80-lines-of-go/", m: 15 }],
          tags: ["resolver", "ttl", "route 53", "cname", "authoritative"] },
        { id: "http", name: "HTTP/1.1, HTTP/2 and HTTP/3",
          line: "The same requests and responses, carried three different ways.",
          body: [
            "**HTTP/1.1** is text over TCP: one request at a time per connection, so browsers open several connections in parallel. **HTTP/2** (2015) keeps the same methods, headers and status codes but sends them as binary frames, multiplexing many streams over one TCP connection and compressing headers. **HTTP/3** (2022) runs over **QUIC**, a transport on UDP that builds TLS 1.3 into its handshake and gives each stream its own ordering.",
            "The reason for HTTP/3 is TCP's head-of-line blocking: under HTTP/2 one lost packet stalls every stream on the connection; under QUIC only the stream that lost data waits. QUIC also survives a change of network, such as a phone moving from Wi-Fi to mobile data."
          ],
          where: "gRPC runs on HTTP/2. Google, Cloudflare and Meta serve a large share of their traffic over HTTP/3, and every major browser supports it. Inside datacenters HTTP/1.1 and HTTP/2 still dominate.",
          nuance: "HTTP/2 helps most on many small requests over a lossless link and can be slower than HTTP/1.1 on a lossy one. Long-lived HTTP/2 connections also defeat simple load balancers that balance per connection, not per request.",
          read: [{ label: "Daniel Stenberg, HTTP/3 explained: why QUIC (TCP head-of-line blocking)", url: "https://http3-explained.haxx.se/en/why-quic/why-tcphol", m: 15 }],
          tags: ["http2", "http3", "quic", "multiplexing", "grpc"] },
        { id: "tls", name: "TLS",
          line: "Encryption and server identity on top of a connection, set up in one round trip.",
          body: [
            "TLS gives a connection three things: privacy (encryption), integrity (tampering is detected) and authentication (you are talking to the owner of the name). In the handshake the server presents a **certificate** signed by a certificate authority the client trusts, and both sides agree a fresh session key with an ephemeral Diffie-Hellman exchange, so a stolen server key cannot decrypt past traffic (forward secrecy).",
            "TLS 1.3 (2018) cut the handshake to one round trip, on top of TCP's one, and allows 0-RTT resumption that sends data with the first packet. TLS 1.2 took two."
          ],
          where: "Let's Encrypt issues free certificates automatically and secures a large part of the web. Load balancers and CDNs usually terminate TLS and talk to backends separately. Service meshes such as Istio and Linkerd use mutual TLS, where both sides present certificates.",
          nuance: "0-RTT data can be replayed by an attacker, so it must only carry requests that are safe to repeat. Terminating TLS at the edge means traffic behind it is plaintext unless you encrypt that hop too.",
          read: [{ label: "Ilya Grigorik, High Performance Browser Networking: Transport Layer Security", url: "https://hpbn.co/transport-layer-security-tls/", m: 30 }],
          tags: ["https", "certificate", "handshake", "mtls", "forward secrecy", "lets encrypt"] },
        { id: "sockets", name: "Sockets",
          line: "The programming interface to the network: a file descriptor for each connection.",
          body: [
            "A **socket** is the kernel object a program uses to talk over the network, and it is a file descriptor like any open file. A server calls `socket`, `bind` (to a port), `listen`, then `accept` in a loop; each `accept` returns a new socket for one client. A client calls `socket` then `connect`. After that both sides `read` and `write` (or `send` and `recv`).",
            "A TCP connection is identified by four values: source address, source port, destination address and destination port. Outgoing connections use an **ephemeral port** picked by the kernel, about 28,000 of them by default on Linux."
          ],
          where: "Every web framework, database driver and message broker client sits on these calls. WebSockets, despite the name, are an HTTP upgrade carried on one TCP socket. Unix domain sockets connect processes on one machine, as Postgres and Docker do locally.",
          nuance: "Two limits bite at scale: the per-process file descriptor limit (`ulimit -n`), and ephemeral port exhaustion when one client opens many short connections to the same server. Reusing connections fixes both.",
          read: [{ label: "Brian Hall, Beej's guide to network programming", url: "https://beej.us/guide/bgnet/", m: 90 }],
          tags: ["socket", "bind", "listen", "accept", "file descriptor", "ephemeral port", "ulimit"] }
      ] }
  ],
  see: [
    { label: "Deep learning from scratch", href: "DEEP-LEARNING.html" }
  ]
});
