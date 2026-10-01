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
          uses: [
            "**Chrome site isolation**: runs each site in its own renderer process, so a compromised tab cannot read another site's memory.",
            "**Postgres**: forks one backend process per client connection, which is why poolers such as PgBouncer sit in front of busy databases.",
            "**Python 3.13**: shipped an optional free-threaded build without the GIL; before it, CPU-bound Python used `multiprocessing` for real parallelism.",
            "**Gunicorn**: runs a web app as several worker processes, so one crashing worker does not take the others down."
          ],
          example: "You type `ls` in bash. Bash calls `fork`, and now two copies of bash exist, sharing memory pages copy-on-write. The child calls `exec(\"/bin/ls\")`, which replaces its program with `ls` but keeps its open file descriptors, so the output still reaches your terminal. The parent calls `wait` and prints the next prompt when the child exits.",
          nuance: "Threads are not free parallelism. Shared memory needs locks, and a thousand threads mostly wait on each other and on the scheduler. For many connections that mostly wait on I/O, an event loop is cheaper.",
          read: [{ label: "OSTEP ch. 4: The abstraction: the process", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf", m: 25 }],
          tags: ["fork", "exec", "gil", "context switch", "multiprocessing"] },
        { id: "scheduling", name: "CPU scheduling",
          line: "The kernel decides which ready thread runs next, and for how long.",
          body: [
            "More threads are ready to run than there are cores, so the kernel time-slices: a timer interrupt fires, the scheduler picks the next thread, and the old one goes back in the queue. Good schedulers favour short interactive work so a keystroke is handled before a long batch job finishes its slice. The textbook design is the multi-level feedback queue; Linux used the Completely Fair Scheduler for years and moved to EEVDF in kernel 6.6 (2023).",
            "Language runtimes add their own layer. Go multiplexes many goroutines onto a few OS threads; Python's asyncio and Node run many tasks on one thread and switch only when a task awaits."
          ],
          uses: [
            "**Kubernetes CPU limits**: enforced by CFS bandwidth control; a container that spends its quota early in a 100 ms period is throttled for the rest of it.",
            "**Linux 6.6**: replaced the Completely Fair Scheduler with EEVDF, which runs the eligible task with the earliest virtual deadline.",
            "**Go runtime**: multiplexes goroutines onto a few OS threads, so one server can hold a hundred thousand goroutines cheaply.",
            "**Trading systems**: pin latency-critical threads to dedicated cores so the scheduler never moves or preempts them."
          ],
          example: "A container has a limit of 1 CPU: 100 ms of CPU time per 100 ms period. It runs 4 busy threads on a 4-core node, so the quota is spent after 25 ms of wall time and all four threads wait 75 ms for the next period. A request that needs 30 ms of CPU now takes over 100 ms, while the node sits mostly idle.",
          nuance: "A CPU limit can throttle a container even when the node is idle, which shows up as p99 spikes with low average CPU. Many teams set requests and drop limits for this reason.",
          read: [{ label: "OSTEP ch. 8: Scheduling: the multi-level feedback queue", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf", m: 25 }],
          tags: ["scheduler", "cfs", "eevdf", "throttling", "goroutines"] },
        { id: "system-calls", name: "The kernel and system calls",
          line: "The only door from your program into the hardware, and it has a cost.",
          body: [
            "The CPU runs your code in **user mode**, where it cannot touch devices or other processes' memory. To read a file, open a socket or allocate memory it makes a **system call**: a special instruction traps into the kernel, which checks the request, does the work in kernel mode and returns. Linux has a few hundred of them: `read`, `write`, `open`, `mmap`, `clone`, `epoll_wait` and so on.",
            "Each crossing costs far more than a function call, because of the mode switch and the caches it disturbs, and it cost more again after the 2018 Meltdown mitigations. That is why buffered I/O exists, why `gettimeofday` is served from the vDSO without a real trap, and why io_uring lets a program submit many operations per call."
          ],
          uses: [
            "**strace**: prints every system call a process makes, with arguments and results; the first tool when a program hangs or cannot open a file.",
            "**bpftrace and other eBPF tools**: run small verified programs inside the kernel to count and trace system calls in production with low overhead.",
            "**gVisor (GKE Sandbox)**: intercepts a sandboxed container's system calls in a user-space kernel, so untrusted code never reaches the host kernel directly.",
            "**io_uring**: lets a program queue many reads and writes in shared rings and submit them with one call instead of one trap each."
          ],
          example: "Copy a 1 GB file with 1-byte `read` and `write` calls: about two billion system calls, and at 100 ns each that is over three minutes spent crossing into the kernel. With a 64 KiB buffer it is about 32,000 calls, and the time goes to the disk instead.",
          nuance: "A program doing tiny reads and writes can spend most of its time crossing into the kernel. Batching (bigger buffers, fewer calls) is often the cheapest speed-up available.",
          read: [{ label: "OSTEP ch. 6: Mechanism: limited direct execution", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf", m: 25 }],
          tags: ["syscall", "user mode", "kernel mode", "strace", "ebpf", "vdso"] },
        { id: "virtual-memory", name: "Virtual memory",
          line: "Every process sees a private address space that the hardware maps onto real RAM.",
          body: [
            "Each process uses virtual addresses. The memory management unit translates them to physical addresses through **page tables**, one page (usually 4 KiB) at a time, and caches recent translations in the **TLB**. A page that is not mapped causes a **page fault**: the kernel loads it from disk, allocates a zeroed page, or kills the process for touching memory it does not own.",
            "This one mechanism gives isolation between processes, lazy allocation (memory is reserved but not backed until touched), `mmap` of files into memory, and copy-on-write after `fork`, where parent and child share pages until one writes. Huge pages (2 MiB or 1 GiB) cut TLB misses for large heaps, databases and ML workloads."
          ],
          uses: [
            "**Redis snapshots**: `BGSAVE` forks, and copy-on-write lets the child save a frozen view; a write-heavy instance can briefly need up to twice its memory.",
            "**Kubernetes OOMKilled**: the kernel's out-of-memory killer ended a container that crossed its cgroup memory limit.",
            "**Postgres and JVM heaps**: can use huge pages (2 MiB) for large buffers, cutting TLB misses.",
            "**LMDB**: maps the whole database file into memory with `mmap` and lets the kernel's page cache do the caching."
          ],
          example: "A program calls `malloc` for 1 GB. Linux returns at once, but no RAM is used yet: the pages are only reserved. When the program first writes to a page, the MMU finds no mapping, a page fault traps into the kernel, which allocates one zeroed 4 KiB page and resumes the program. Touch 10 MB of the gigabyte and resident memory grows by about 10 MB.",
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
          uses: [
            "**ClickHouse and DuckDB**: store each column contiguously, so a scan of one column reads dense cache lines instead of skipping across rows.",
            "**Parquet**: lays data out in column chunks for the same reason, and compresses well because similar values sit together.",
            "**Unity DOTS**: its entity component system keeps components in packed arrays so per-frame loops stream through memory.",
            "**LLM decoding**: each new token reads every weight from GPU memory once, so its speed is set by memory bandwidth, not arithmetic."
          ],
          example: "Sum a 4,096 by 4,096 array of 4-byte ints. Row by row, each 64-byte cache line delivers 16 useful values and the prefetcher stays ahead. Column by column, each access lands 16 KiB after the last, so nearly every read misses cache. Same work, same Big-O, and the column-order loop is commonly several times slower.",
          nuance: "Big-O hides constant factors of 100 between a cache hit and a DRAM miss. Measure with a profiler that shows cache misses (`perf stat`) before trusting the complexity alone.",
          read: [{ label: "Ulrich Drepper, What every programmer should know about memory: section 3, CPU caches", url: "https://people.freebsd.org/~lstewart/articles/cpumemory.pdf", m: 60 }],
          tags: ["cache line", "l1", "dram", "locality", "false sharing", "prefetch"] },
        { id: "latency-numbers", name: "Latency numbers worth knowing",
          line: "Orders of magnitude from a cache hit to a cross-ocean round trip.",
          body: [
            "The rough ladder, from the commonly cited table: an L1 cache hit about 1 ns, a main memory read about 100 ns, a random read from an SSD about 16 microseconds, a round trip inside one datacenter about 500 microseconds, and a packet from California to the Netherlands and back about 150 ms. Each step is roughly 100 to 1000 times the one before.",
            "These numbers are for estimating, not for quoting. What matters is the ratios: RAM against SSD is two orders of magnitude, and serving two continents from one region pays the speed of light on every request."
          ],
          uses: [
            "**System design interviews**: back-of-envelope estimates start from this ladder to size caches, round trips and replicas.",
            "**Cloudflare and Fastly**: run CDNs because the cross-ocean round trip cannot be optimised away, only moved closer to the user.",
            "**Spanner and CockroachDB**: pay a cross-region round trip on every consensus write across regions, which is why they let you place leaders near the writers."
          ],
          example: "A page makes 30 sequential database calls at 0.5 ms each inside one datacenter: 15 ms. Move the database to a region 70 ms away and the same page takes 2.1 seconds. Batch the 30 calls into one query and it is back to about 70 ms. Round trips, not bytes, set the cost.",
          nuance: "Memory and network latency have barely improved in years while bandwidth keeps growing. Many round trips hurt more than large payloads, so batch calls and avoid chatty protocols.",
          read: [{ label: "Colin Scott, Latency numbers every programmer should know (interactive)", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html", m: 5 }],
          tags: ["latency", "back of envelope", "estimation", "rtt"] },
        { id: "file-systems", name: "File systems and I/O",
          line: "Files, directories and the page cache between your write and the disk.",
          body: [
            "A file system maps names to files and files to blocks on a device. On Linux each file has an **inode** holding its metadata and block locations; a directory maps names to inode numbers. Reads and writes go through the **page cache** in RAM: `write` returns once the data is in memory, and the kernel flushes it to disk later. Only `fsync` asks the kernel to put it on stable storage and wait.",
            "Journaling file systems such as ext4 and XFS log metadata changes first so a crash cannot leave the directory tree half-updated. Copy-on-write designs such as ZFS and btrfs never overwrite in place, which makes snapshots cheap."
          ],
          uses: [
            "**Postgres**: writes the commit record to its write-ahead log and calls `fsync` before it tells the client a transaction committed.",
            "**Postgres and fsync (2018)**: found that after a failed `fsync` Linux could drop the dirty pages and a retry would report success; Postgres now crashes instead.",
            "**ZFS and btrfs**: copy-on-write file systems that never overwrite in place, so snapshots are nearly free.",
            "**SQLite**: uses a rollback journal or a write-ahead log, with careful fsyncs, so a crash mid-write leaves the database intact."
          ],
          example: "An app saves settings by rewriting `config.json` in place, and power fails halfway: the file is half old, half new. The safe sequence: write `config.json.tmp`, `fsync` it, `rename` it over `config.json` (atomic on POSIX), then `fsync` the directory so the rename itself is durable. After a crash you find either the old file or the new one.",
          nuance: "`write` returning is not durability. Neither is `fsync` on a disk or cloud volume that lies about its cache. Durable systems fsync the file, fsync the directory after a rename, and test with real power loss.",
          read: [{ label: "OSTEP ch. 39: Interlude: files and directories", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf", m: 35 }],
          tags: ["inode", "page cache", "fsync", "journaling", "ext4", "durability"] },
        { id: "gpu", name: "The GPU as a co-processor",
          line: "Thousands of simple cores the CPU hands work to, fed by very fast memory.",
          body: [
            "A GPU is a separate processor with its own memory. The CPU copies data over PCIe (or NVLink), then **launches a kernel**: one function run by thousands of threads at once. NVIDIA groups threads into **warps** of 32 that execute the same instruction together on a streaming multiprocessor, so branches that diverge inside a warp run one after the other. GPU memory (HBM) delivers terabytes per second, far more than a CPU's DRAM, but the trip across PCIe is much slower, so data should stay on the device.",
            "Whether a workload is fast depends on its arithmetic intensity: how many operations it does per byte read. Matrix multiplies do many and keep the cores busy; elementwise operations and LLM decoding do few and wait on memory."
          ],
          uses: [
            "**NVIDIA H100 and Blackwell**: train and serve most large models; CUDA is the programming model under PyTorch's GPU kernels.",
            "**FlashAttention**: computes attention in tiles held in on-chip SRAM, cutting reads and writes to HBM, which is where its speed-up comes from.",
            "**AMD MI300 with ROCm, and Google TPUs**: the main alternatives, each with its own compiler stack under PyTorch or JAX."
          ],
          example: "Add two vectors of a billion floats on an H100. The kernel reads 8 GB and writes 4 GB; at about 3 TB/s of HBM bandwidth that takes roughly 4 ms, with the arithmetic units nearly idle. Copying the same data over PCIe 5 at roughly 50 GB/s would take over 200 ms. Keep data on the device and do many operations per byte.",
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
          uses: [
            "**Go race detector**: `go test -race` instruments memory accesses and reports two goroutines touching the same variable without synchronisation.",
            "**Rust**: ownership and the `Send` and `Sync` traits reject data races at compile time.",
            "**Java ConcurrentHashMap**: reads without locking and locks only the bin being changed, so threads rarely wait on each other.",
            "**Postgres `SELECT ... FOR UPDATE`**: a mutex on rows; a second transaction that wants the same row waits until the first commits."
          ],
          example: "Two threads each run `count += 1` a million times on a shared counter. Each increment is three steps: load, add, store. Thread A loads 41, thread B loads 41, both store 42, and one increment is gone. The final total lands short of 2,000,000, differently on each run. With a mutex, or an atomic `fetch_add`, it is exactly 2,000,000.",
          nuance: "A race can pass every test and fail once a week in production. Prefer not sharing (message passing, one owner per piece of state) over sharing carefully.",
          read: [{ label: "OSTEP ch. 28: Locks", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf", m: 35 }],
          tags: ["race condition", "mutex", "atomic", "compare-and-swap", "critical section"] },
        { id: "deadlock", name: "Deadlock and its relatives",
          line: "Threads each holding what another needs, so none can move.",
          body: [
            "A deadlock needs four things at once: exclusive locks, holding one lock while waiting for another, no forced release, and a cycle of waiting (thread A holds X and wants Y, thread B holds Y and wants X). Break any one and it cannot happen. The usual fix is a global lock order: every thread takes X before Y.",
            "Relatives: **livelock**, where threads keep reacting to each other and make no progress; **starvation**, where one thread never gets its turn; and **priority inversion**, where a low-priority thread holds a lock a high-priority one needs while a medium-priority thread keeps the CPU."
          ],
          uses: [
            "**Postgres and MySQL**: detect cycles in the lock wait graph and abort one transaction with a deadlock error, so the application must retry.",
            "**Mars Pathfinder (1997)**: kept resetting because of priority inversion until engineers enabled priority inheritance on a mutex remotely.",
            "**Linux lockdep**: the kernel's lock validator records the order locks are taken in and warns about a possible deadlock before one happens."
          ],
          example: "A transfer from account 1 to account 2 locks row 1, then row 2. At the same moment a transfer from 2 to 1 locks row 2, then row 1. Each holds one lock and waits for the other: deadlock. The fix is a rule: always lock the lower account id first. Both transfers now start with row 1, so one waits briefly and the other finishes.",
          nuance: "Lock timeouts turn a deadlock into slow errors and hide the cause. When you see periodic timeouts under load, look for two code paths that take the same locks in different orders.",
          tags: ["deadlock", "livelock", "priority inversion", "lock ordering"] },
        { id: "event-loops", name: "Async I/O and event loops",
          line: "One thread serving thousands of connections by never waiting on any of them.",
          body: [
            "Most server time is spent waiting on the network or disk. Instead of one blocked thread per connection, an **event loop** asks the kernel which sockets are ready (`epoll` on Linux, `kqueue` on BSD and macOS), runs the code for those, and goes back to asking. Code is written as callbacks or as `async` functions whose `await` hands control back to the loop.",
            "There are two kernel models. Readiness (`epoll`) says a socket can be read now; completion (io_uring on Linux, IOCP on Windows) does the read and tells you when it has finished, and works for files too. io_uring uses two shared ring buffers, so many operations cost few system calls."
          ],
          uses: [
            "**Node.js**: runs JavaScript on libuv's event loop, one thread serving every connection, with a small thread pool for file I/O and DNS.",
            "**nginx**: each worker process runs an event loop over `epoll`, so a few workers hold tens of thousands of connections.",
            "**Redis**: executes commands on one main thread, which is why one slow command such as `KEYS *` blocks every client.",
            "**Voice agents and LLM gateways**: mostly async Python or Node, because they spend their time waiting on model calls and audio streams."
          ],
          example: "An async Python server takes 1,000 chat requests, each waiting 2 s on an LLM API. One thread per request would need 1,000 threads. On asyncio, each handler reaches `await client.post(...)`, hands control back, and the loop serves the others: one thread holds all 1,000. Then someone adds a blocking `requests.get` to a handler, and for 2 s nothing else on that loop runs.",
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
          uses: [
            "**AWS VPC**: a private IP range (a CIDR block such as `10.0.0.0/16`) split into subnets; a NAT gateway lets private instances reach the internet.",
            "**Kubernetes**: gives every pod its own IP address, so pods talk to each other without port mapping.",
            "**Facebook, October 2021**: a configuration change withdrew the BGP routes to its own DNS servers and took its services offline for about six hours.",
            "**Home routers**: use NAT so a whole household shares one public IPv4 address."
          ],
          example: "`10.0.0.0/16` fixes the first 16 bits, leaving 65,536 addresses from 10.0.0.0 to 10.0.255.255. Split into `/24` subnets of 256 addresses each, it gives 256 subnets, for example one public and one private subnet per availability zone. A packet for 10.0.3.9 is routed to the subnet `10.0.3.0/24`, then delivered to that host.",
          nuance: "Loss and reordering are normal, not failures. Everything above IP (TCP, QUIC, your retries) exists to cope with that, and its costs show up as latency.",
          tags: ["ip", "ipv6", "nat", "bgp", "mtu", "cidr", "vpc"] },
        { id: "tcp", name: "TCP",
          line: "A reliable, ordered byte stream built on top of unreliable packets.",
          body: [
            "TCP opens a connection with a three-way handshake (SYN, SYN-ACK, ACK), one round trip before any data. It numbers every byte, retransmits what is not acknowledged, and delivers bytes in order. **Flow control** stops a sender from overrunning the receiver; **congestion control** stops it from overrunning the network, starting slowly (slow start) and backing off on loss. Linux defaults to CUBIC; Google's BBR models bandwidth and delay instead of reacting to loss.",
            "Because delivery is in order, one lost packet holds up everything behind it (head-of-line blocking), even bytes that belong to an unrelated request."
          ],
          uses: [
            "**HTTP/1.1, HTTP/2, gRPC, Postgres and Redis**: all ride on TCP connections, so each new connection pays the handshake and slow start.",
            "**Connection pools (HikariCP, pgbouncer, HTTP keep-alive)**: reuse open connections, so a call skips the handshake and starts with a warm congestion window.",
            "**Google BBR**: congestion control that models bottleneck bandwidth and round-trip time, deployed by Google for YouTube and its own sites."
          ],
          example: "A new HTTPS request from London to a server in Virginia, about 80 ms round trip: TCP handshake 80 ms, TLS 1.3 handshake 80 ms, then the request and the first response bytes 80 ms. About 240 ms before the first byte, and slow start limits how fast the rest arrives. On a reused, warm connection the same request costs one round trip.",
          nuance: "TCP is a byte stream, not a message stream: one `send` can arrive as two reads, so protocols need framing (a length prefix or a delimiter). Closed connections linger in TIME_WAIT, which matters when a client opens thousands per second.",
          read: [{ label: "Ilya Grigorik, High Performance Browser Networking: Building blocks of TCP", url: "https://hpbn.co/building-blocks-of-tcp/", m: 30 }],
          tags: ["handshake", "congestion control", "slow start", "bbr", "cubic", "head-of-line blocking"] },
        { id: "udp", name: "UDP",
          line: "Datagrams with no connection, ordering or retransmission; you add only what you need.",
          body: [
            "UDP adds ports and a checksum to IP and nothing else. There is no handshake, so the first packet carries data; there is no retransmission, so a lost packet stays lost; there is no ordering, so packets arrive as the network delivers them. Applications that use it build the parts of reliability they need on top.",
            "That trade suits traffic where late data is worthless: a voice frame that arrives after its playback time is better dropped than retransmitted. It also suits protocols that want their own congestion control and streams without waiting for operating systems to change their TCP stacks."
          ],
          uses: [
            "**DNS**: most queries and answers are single UDP datagrams, with TCP as the fallback for large answers.",
            "**QUIC and HTTP/3**: build streams, reliability and congestion control in user space on top of UDP.",
            "**WebRTC**: carries voice and video as RTP over UDP, which is why video calls and real-time voice agents use it.",
            "**Multiplayer games**: send position updates many times a second over UDP; a lost update is replaced by the next one."
          ],
          example: "A voice call sends a 20 ms audio frame every 20 ms, and frame 51 is lost. Over TCP, frames 52 to 60 wait in the receiver's buffer until 51 is retransmitted a round trip later, and the listener hears a stall. Over UDP, the player conceals frame 51 and plays 52 on time: a 20 ms glitch instead of a freeze.",
          nuance: "Corporate firewalls often block or throttle UDP, so real-time products keep a TCP or TLS fallback (TURN over TCP for WebRTC). Without congestion control, a UDP sender can flood a link.",
          read: [{ label: "Ilya Grigorik, High Performance Browser Networking: Building blocks of UDP", url: "https://hpbn.co/building-blocks-of-udp/", m: 20 }],
          tags: ["datagram", "rtp", "webrtc", "quic", "games"] },
        { id: "dns", name: "DNS",
          line: "The distributed, cached directory that turns names into addresses.",
          body: [
            "Your machine asks a **recursive resolver** (your ISP's, or a public one such as 1.1.1.1 or 8.8.8.8). On a cache miss the resolver asks a root server which servers handle `.com`, asks those which servers are authoritative for `example.com`, and asks those for the record. Every answer carries a **TTL**, and every resolver along the way caches it for that long.",
            "Common records: `A` and `AAAA` (IPv4 and IPv6 addresses), `CNAME` (an alias for another name), `MX` (mail servers), `TXT` (domain verification, SPF). Because answers can differ by who asks, DNS is also a load balancer: services return different addresses by region or health."
          ],
          uses: [
            "**AWS Route 53, Cloudflare and Google Cloud DNS**: host authoritative zones, and can answer differently by region or by health check.",
            "**Kubernetes CoreDNS**: lets pods reach a service by a name such as `api.default.svc.cluster.local`.",
            "**CDN GeoDNS**: returns the address of the nearest edge, so users in Tokyo and Paris get different answers for one name.",
            "**1.1.1.1 and 8.8.8.8**: public recursive resolvers run by Cloudflare and Google."
          ],
          example: "Resolving `api.example.com` with a cold cache: the resolver asks a root server (try the `.com` servers), a `.com` server (try `ns1.example.com`), then `ns1.example.com`, which answers `A 203.0.113.7` with a TTL of 300. Three lookups the first time; for the next 300 seconds every client of that resolver gets the answer from its cache.",
          nuance: "Changes are not instant: old answers live in caches until their TTL expires, and some clients ignore TTLs. Lower the TTL days before a migration, not during it. When an outage makes no sense, check DNS first.",
          read: [{ label: "Julia Evans, A toy DNS resolver", url: "https://jvns.ca/blog/2022/02/01/a-dns-resolver-in-80-lines-of-go/", m: 15 }],
          tags: ["resolver", "ttl", "route 53", "cname", "authoritative"] },
        { id: "http", name: "HTTP/1.1, HTTP/2 and HTTP/3",
          line: "The same requests and responses, carried three different ways.",
          body: [
            "**HTTP/1.1** is text over TCP: one request at a time per connection, so browsers open several connections in parallel. **HTTP/2** (2015) keeps the same methods, headers and status codes but sends them as binary frames, multiplexing many streams over one TCP connection and compressing headers. **HTTP/3** (2022) runs over **QUIC**, a transport on UDP that builds TLS 1.3 into its handshake and gives each stream its own ordering.",
            "The reason for HTTP/3 is TCP's head-of-line blocking: under HTTP/2 one lost packet stalls every stream on the connection; under QUIC only the stream that lost data waits. QUIC also survives a change of network, such as a phone moving from Wi-Fi to mobile data."
          ],
          uses: [
            "**gRPC**: runs on HTTP/2, using its streams for many concurrent calls and for two-way streaming over one connection.",
            "**Google, Cloudflare and Meta**: serve a large share of their traffic over HTTP/3, and every major browser supports it.",
            "**Browsers on HTTP/1.1**: open about six connections per host to fetch resources in parallel."
          ],
          example: "A page loads 60 small images. Over HTTP/1.1 with six connections they go in about ten rounds of requests. Over HTTP/2 all 60 requests go out at once on one connection. Now one packet is lost: under HTTP/2 every image's stream waits for the retransmission; under HTTP/3 only the streams whose data was in that packet wait.",
          nuance: "HTTP/2 helps most on many small requests over a lossless link and can be slower than HTTP/1.1 on a lossy one. Long-lived HTTP/2 connections also defeat simple load balancers that balance per connection, not per request.",
          read: [{ label: "Daniel Stenberg, HTTP/3 explained: why QUIC (TCP head-of-line blocking)", url: "https://http3-explained.haxx.se/en/why-quic/why-tcphol", m: 15 }],
          tags: ["http2", "http3", "quic", "multiplexing", "grpc"] },
        { id: "tls", name: "TLS",
          line: "Encryption and server identity on top of a connection, set up in one round trip.",
          body: [
            "TLS gives a connection three things: privacy (encryption), integrity (tampering is detected) and authentication (you are talking to the owner of the name). In the handshake the server presents a **certificate** signed by a certificate authority the client trusts, and both sides agree a fresh session key with an ephemeral Diffie-Hellman exchange, so a stolen server key cannot decrypt past traffic (forward secrecy).",
            "TLS 1.3 (2018) cut the handshake to one round trip, on top of TCP's one, and allows 0-RTT resumption that sends data with the first packet. TLS 1.2 took two."
          ],
          uses: [
            "**Let's Encrypt**: issues free certificates through the ACME protocol, renewed automatically by clients such as Certbot, and secures a large part of the web.",
            "**Load balancers and CDNs**: terminate TLS at the edge and open separate connections to the backends.",
            "**Istio and Linkerd**: service meshes that use mutual TLS, so every service-to-service call is encrypted and both sides are authenticated."
          ],
          example: "A TLS 1.3 handshake: the client sends ClientHello with its Diffie-Hellman key share. The server replies with its own key share, its certificate for `example.com`, and a signature proving it holds the matching private key. Both sides derive the same session key; the client checks the certificate chain up to a trusted root and sends its request. One round trip, on top of TCP's.",
          nuance: "0-RTT data can be replayed by an attacker, so it must only carry requests that are safe to repeat. Terminating TLS at the edge means traffic behind it is plaintext unless you encrypt that hop too.",
          read: [{ label: "Ilya Grigorik, High Performance Browser Networking: Transport Layer Security", url: "https://hpbn.co/transport-layer-security-tls/", m: 30 }],
          tags: ["https", "certificate", "handshake", "mtls", "forward secrecy", "lets encrypt"] },
        { id: "sockets", name: "Sockets",
          line: "The programming interface to the network: a file descriptor for each connection.",
          body: [
            "A **socket** is the kernel object a program uses to talk over the network, and it is a file descriptor like any open file. A server calls `socket`, `bind` (to a port), `listen`, then `accept` in a loop; each `accept` returns a new socket for one client. A client calls `socket` then `connect`. After that both sides `read` and `write` (or `send` and `recv`).",
            "A TCP connection is identified by four values: source address, source port, destination address and destination port. Outgoing connections use an **ephemeral port** picked by the kernel, about 28,000 of them by default on Linux."
          ],
          uses: [
            "**Web frameworks and database drivers**: sit on `socket`, `connect`, `send` and `recv`, usually behind an event loop.",
            "**WebSockets**: despite the name, an HTTP request upgraded to a long-lived two-way channel on one TCP socket.",
            "**Docker and Postgres**: listen on Unix domain sockets (such as `/var/run/docker.sock`) for local clients, skipping the network stack."
          ],
          example: "A minimal TCP echo server: `s = socket()`, `bind(s, port 8080)`, `listen(s)`, then a loop: `c = accept(s)` waits for a client and returns a new descriptor, `data = recv(c)`, `send(c, data)`, `close(c)`. The listening socket stays on port 8080; each client gets its own descriptor, named by the four values of its connection.",
          nuance: "Two limits bite at scale: the per-process file descriptor limit (`ulimit -n`), and ephemeral port exhaustion when one client opens many short connections to the same server. Reusing connections fixes both.",
          read: [{ label: "Brian Hall, Beej's guide to network programming", url: "https://beej.us/guide/bgnet/", m: 90 }],
          tags: ["socket", "bind", "listen", "accept", "file descriptor", "ephemeral port", "ulimit"] }
      ] }
  ],
  see: [
    { label: "Deep learning from scratch", href: "DEEP-LEARNING.html" }
  ]
});
