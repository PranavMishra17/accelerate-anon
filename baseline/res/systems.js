/* What to read and watch for each topic in the systems field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("systems", {
 "processes-threads": [
  {
   "kind": "video",
   "req": true,
   "label": "Process vs thread",
   "url": "https://www.youtube.com/watch?v=4rLW7zg21gI",
   "m": 4,
   "why": "What each owns and what they share.",
   "yt": {
    "id": "4rLW7zg21gI",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Why are threads needed on single core processors?",
   "url": "https://www.youtube.com/watch?v=M9HHWFp84f0",
   "m": 17,
   "why": "Why threads exist even on one core.",
   "yt": {
    "id": "M9HHWFp84f0",
    "ch": "Core Dumped"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "OSTEP ch. 4: The abstraction: the process",
   "url": "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf",
   "m": 25,
   "why": "The process abstraction in OSTEP."
  }
 ],
 "scheduling": [
  {
   "kind": "video",
   "req": true,
   "label": "CPU scheduling: MLQ and MLFQ",
   "url": "https://www.youtube.com/watch?v=NmFpCJdLd1g",
   "m": 9,
   "why": "How the multi-level feedback queue picks the next thread.",
   "yt": {
    "id": "NmFpCJdLd1g",
    "ch": "Tami Sorgente"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "OSTEP ch. 8: Scheduling: the multi-level feedback queue",
   "url": "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf",
   "m": 25,
   "why": "The MLFQ chapter, the text behind the video."
  }
 ],
 "system-calls": [
  {
   "kind": "video",
   "req": true,
   "label": "What really happens during a system call? User mode to kernel mode",
   "url": "https://www.youtube.com/watch?v=hhs09xhVwuo",
   "m": 4,
   "why": "The switch from user mode to kernel mode, step by step.",
   "yt": {
    "id": "hhs09xhVwuo",
    "ch": "8BrightBits"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "How a single bit inside your processor shields your operating system",
   "url": "https://www.youtube.com/watch?v=H4SDPLiUnv4",
   "m": 22,
   "why": "How the CPU enforces the boundary.",
   "yt": {
    "id": "H4SDPLiUnv4",
    "ch": "Core Dumped"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "OSTEP ch. 6: Mechanism: limited direct execution",
   "url": "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf",
   "m": 25,
   "why": "Limited direct execution: how traps work."
  }
 ],
 "virtual-memory": [
  {
   "kind": "video",
   "req": true,
   "label": "Why can't programs access each other's memory?",
   "url": "https://www.youtube.com/watch?v=Zmtxl7LZwjQ",
   "m": 15,
   "why": "Why every process sees its own address space.",
   "yt": {
    "id": "Zmtxl7LZwjQ",
    "ch": "Core Dumped"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Page tables and the MMU: how virtual memory works",
   "url": "https://www.youtube.com/watch?v=B6tJxvYBNrU",
   "m": 12,
   "why": "Page tables and the MMU, animated.",
   "yt": {
    "id": "B6tJxvYBNrU",
    "ch": "BitLemon"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "OSTEP ch. 18 Paging: introduction, and ch. 19 TLBs",
   "url": "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf",
   "m": 40,
   "why": "Paging and TLBs in OSTEP."
  }
 ],
 "memory-hierarchy": [
  {
   "kind": "video",
   "req": true,
   "label": "Cache hierarchy: how modern CPU caches are organized (L1, L2, L3)",
   "url": "https://www.youtube.com/watch?v=7yrK_9PderQ",
   "m": 7,
   "why": "L1, L2, L3 and why locality decides speed.",
   "yt": {
    "id": "7yrK_9PderQ",
    "ch": "BitLemon"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Ulrich Drepper, What every programmer should know about memory: section 3, CPU caches",
   "url": "https://people.freebsd.org/~lstewart/articles/cpumemory.pdf",
   "m": 60,
   "why": "The classic deep reference; sections 2 and 3 only."
  }
 ],
 "latency-numbers": [
  {
   "kind": "video",
   "req": true,
   "label": "Latency numbers programmers should know",
   "url": "https://www.youtube.com/watch?v=FqR5vESuKe0",
   "m": 7,
   "why": "The ladder of numbers, from a cache hit to a round trip.",
   "yt": {
    "id": "FqR5vESuKe0",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Latency numbers every programmer should know: 1000x slow-down",
   "url": "https://www.youtube.com/watch?v=4JSN0VpEv2I",
   "m": 7,
   "why": "The same numbers as a 1000x slow-down.",
   "yt": {
    "id": "4JSN0VpEv2I",
    "ch": "Gaurav Sen"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Colin Scott, Latency numbers every programmer should know (interactive)",
   "url": "https://colin-scott.github.io/personal_website/research/interactive_latency.html",
   "m": 5,
   "why": "Play with the numbers by year."
  }
 ],
 "file-systems": [
  {
   "kind": "video",
   "req": true,
   "label": "How file systems actually work: from save to SSD",
   "url": "https://www.youtube.com/watch?v=P2k4NJHkINo",
   "m": 10,
   "why": "What happens between save and the SSD.",
   "yt": {
    "id": "P2k4NJHkINo",
    "ch": "XOR"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Your SSD lies and that's ok",
   "url": "https://www.youtube.com/watch?v=JK2ZIx8jRu4",
   "m": 30,
   "why": "Why fsync matters and what disks do with it.",
   "yt": {
    "id": "JK2ZIx8jRu4",
    "ch": "Hussein Nasser"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "OSTEP ch. 39: Interlude: files and directories",
   "url": "https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf",
   "m": 35,
   "why": "Files and directories in OSTEP."
  }
 ],
 "gpu": [
  {
   "kind": "video",
   "req": true,
   "label": "GPU architecture deep dive: from HBM to tensor cores",
   "url": "https://www.youtube.com/watch?v=5UWphJWdAHY",
   "m": 8,
   "why": "The memory and compute layout of a GPU, drawn.",
   "yt": {
    "id": "5UWphJWdAHY",
    "ch": "Parallel Routines"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Nvidia CUDA in 100 seconds",
   "url": "https://www.youtube.com/watch?v=pPStdjuYzSI",
   "m": 4,
   "why": "What a CUDA kernel is, in three minutes.",
   "yt": {
    "id": "pPStdjuYzSI",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Pramod Goyal, CUDA from zero to hero #1",
   "url": "https://x.com/goyal__pramod/status/2103565642800431533",
   "m": 15,
   "why": "A walk through CUDA basics."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Sasha Rush, GPU Puzzles: 14 CUDA exercises in Python with Numba",
   "url": "https://github.com/srush/gpu-puzzles",
   "m": 120,
   "why": "Fourteen puzzles to build the intuition by doing."
  }
 ],
 "races-locks": [
  {
   "kind": "video",
   "req": true,
   "label": "The weirdest bug in programming: race conditions",
   "url": "https://www.youtube.com/watch?v=bhpzTWtee2A",
   "m": 19,
   "why": "How a race condition happens and why it is rare to see.",
   "yt": {
    "id": "bhpzTWtee2A",
    "ch": "Core Dumped"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "How hardware makes threads less of a nightmare",
   "url": "https://www.youtube.com/watch?v=IMceN4_rieo",
   "m": 19,
   "why": "What atomic instructions do in hardware.",
   "yt": {
    "id": "IMceN4_rieo",
    "ch": "Core Dumped"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "OSTEP ch. 28: Locks",
   "url": "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf",
   "m": 35,
   "why": "Locks in OSTEP."
  }
 ],
 "deadlock": [
  {
   "kind": "video",
   "req": true,
   "label": "Everything you should know about deadlock in three minutes or less",
   "url": "https://www.youtube.com/watch?v=oEbXlSH8hyE",
   "m": 3,
   "why": "The four conditions in three minutes.",
   "yt": {
    "id": "oEbXlSH8hyE",
    "ch": "Chris Kanich"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Deadlock: the most frustrating problem in computer science",
   "url": "https://www.youtube.com/watch?v=MWuc27pv9wk",
   "m": 6,
   "why": "Deadlock with examples and ways out.",
   "yt": {
    "id": "MWuc27pv9wk",
    "ch": "The Coding Gopher"
   }
  }
 ],
 "event-loops": [
  {
   "kind": "video",
   "req": true,
   "label": "How epoll actually works: the event mechanism behind Nginx, Redis and Node.js",
   "url": "https://www.youtube.com/watch?v=123OEuEuibM",
   "m": 10,
   "why": "How epoll lets one thread watch thousands of sockets.",
   "yt": {
    "id": "123OEuEuibM",
    "ch": "State & Flow"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "What the heck is the event loop anyway?",
   "url": "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
   "m": 27,
   "why": "The event loop and its queues, the classic talk.",
   "yt": {
    "id": "8aGhZQkoFbQ",
    "ch": "JSConf"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Node.js, The event loop, timers and process.nextTick()",
   "url": "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
   "m": 15,
   "why": "How Node.js orders timers and I/O."
  },
  {
   "kind": "read",
   "req": false,
   "label": "LWN, Ringing in a new asynchronous I/O API (io_uring)",
   "url": "https://lwn.net/Articles/776703/",
   "m": 15,
   "why": "io_uring, the newer asynchronous I/O interface."
  }
 ],
 "ip-packets": [
  {
   "kind": "video",
   "req": true,
   "label": "How the internet works in 9 minutes",
   "url": "https://www.youtube.com/watch?v=sMHzfigUxz4",
   "m": 10,
   "why": "A packet's trip from your laptop to a server.",
   "yt": {
    "id": "sMHzfigUxz4",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Packet traveling: how packets move through a network",
   "url": "https://www.youtube.com/watch?v=rYodcvhh7b8",
   "m": 15,
   "why": "Hop by hop through routers and switches.",
   "yt": {
    "id": "rYodcvhh7b8",
    "ch": "Practical Networking"
   }
  }
 ],
 "tcp": [
  {
   "kind": "video",
   "req": true,
   "label": "What is the TCP 3-way handshake and why backend engineers should understand it",
   "url": "https://www.youtube.com/watch?v=bW_BILl7n0Y",
   "m": 12,
   "why": "The handshake and why a backend engineer cares.",
   "yt": {
    "id": "bW_BILl7n0Y",
    "ch": "Hussein Nasser"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "TCP reliability, flow control and congestion control",
   "url": "https://www.youtube.com/watch?v=E4I6t0mI_is",
   "m": 12,
   "why": "Flow control and congestion control.",
   "yt": {
    "id": "E4I6t0mI_is",
    "ch": "JimKurose"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Ilya Grigorik, High Performance Browser Networking: Building blocks of TCP",
   "url": "https://hpbn.co/building-blocks-of-tcp/",
   "m": 30,
   "why": "TCP's building blocks, in text."
  }
 ],
 "udp": [
  {
   "kind": "video",
   "req": true,
   "label": "TCP vs UDP comparison",
   "url": "https://www.youtube.com/watch?v=uwoD5YsGACg",
   "m": 5,
   "why": "What UDP leaves out and why that is a feature.",
   "yt": {
    "id": "uwoD5YsGACg",
    "ch": "PowerCert Animated Videos"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "When to use UDP vs TCP in building a backend application?",
   "url": "https://www.youtube.com/watch?v=G86axGfnWag",
   "m": 21,
   "why": "When a backend should choose UDP.",
   "yt": {
    "id": "G86axGfnWag",
    "ch": "Hussein Nasser"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Ilya Grigorik, High Performance Browser Networking: Building blocks of UDP",
   "url": "https://hpbn.co/building-blocks-of-udp/",
   "m": 20,
   "why": "UDP's building blocks, in text."
  }
 ],
 "dns": [
  {
   "kind": "video",
   "req": true,
   "label": "Everything you need to know about DNS",
   "url": "https://www.youtube.com/watch?v=27r4Bzuj5NQ",
   "m": 6,
   "why": "The resolution path from laptop to authoritative server.",
   "yt": {
    "id": "27r4Bzuj5NQ",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "How does DNS resolve a name? One lookup, hop by hop",
   "url": "https://www.youtube.com/watch?v=Tx0sSdBXoIA",
   "m": 5,
   "why": "One lookup, hop by hop.",
   "yt": {
    "id": "Tx0sSdBXoIA",
    "ch": "Overengineering!"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Julia Evans, A toy DNS resolver",
   "url": "https://jvns.ca/blog/2022/02/01/a-dns-resolver-in-80-lines-of-go/",
   "m": 15,
   "why": "A resolver written in a few lines of Go."
  }
 ],
 "http": [
  {
   "kind": "video",
   "req": true,
   "label": "HTTP 1 vs HTTP 2 vs HTTP 3",
   "url": "https://www.youtube.com/watch?v=UMwQjFzTQXw",
   "m": 8,
   "why": "What changed in each HTTP version and why.",
   "yt": {
    "id": "UMwQjFzTQXw",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "HTTP/2 critical limitation that led to HTTP/3 and QUIC",
   "url": "https://www.youtube.com/watch?v=GriONb4EfPY",
   "m": 10,
   "why": "Why HTTP/2's flaw led to QUIC.",
   "yt": {
    "id": "GriONb4EfPY",
    "ch": "Hussein Nasser"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Daniel Stenberg, HTTP/3 explained: why QUIC (TCP head-of-line blocking)",
   "url": "https://http3-explained.haxx.se/en/why-quic/why-tcphol",
   "m": 15,
   "why": "Why QUIC replaced TCP under HTTP/3."
  }
 ],
 "tls": [
  {
   "kind": "video",
   "req": true,
   "label": "SSL, TLS, HTTPS explained",
   "url": "https://www.youtube.com/watch?v=j9QmMEWmcfo",
   "m": 6,
   "why": "How encryption and identity are set up for a connection.",
   "yt": {
    "id": "j9QmMEWmcfo",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "TLS handshake explained",
   "url": "https://www.youtube.com/watch?v=86cQJ0MMses",
   "m": 17,
   "why": "The handshake message by message.",
   "yt": {
    "id": "86cQJ0MMses",
    "ch": "Computerphile"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Ilya Grigorik, High Performance Browser Networking: Transport Layer Security",
   "url": "https://hpbn.co/transport-layer-security-tls/",
   "m": 30,
   "why": "TLS in High Performance Browser Networking."
  }
 ],
 "sockets": [
  {
   "kind": "video",
   "req": true,
   "label": "The Linux socket API explained",
   "url": "https://www.youtube.com/watch?v=XXfdzwEsxFk",
   "m": 16,
   "why": "The socket calls in order: socket, bind, listen, accept.",
   "yt": {
    "id": "XXfdzwEsxFk",
    "ch": "Chris Kanich"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "What's behind a file descriptor in Linux? Also i/o redirection with dup2",
   "url": "https://www.youtube.com/watch?v=rW_NV6rf0rM",
   "m": 21,
   "why": "What a file descriptor really points to.",
   "yt": {
    "id": "rW_NV6rf0rM",
    "ch": "Chris Kanich"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Brian Hall, Beej's guide to network programming",
   "url": "https://beej.us/guide/bgnet/",
   "m": 90,
   "why": "The standard guide to the sockets API."
  }
 ]
});
