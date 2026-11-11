/* Amazon loop, LLD part 0: the order of work for Wednesday 11 November, before rounds 3 and 4 on Thursday.
   Each section points at the drill that already teaches it; videos and articles hang off it from amazon-res.js
   under "lld-thu/<section id>". Hand-written. */
window.LOOP_CODING = window.LOOP_CODING || { parts: [] };
window.LOOP_CODING.parts.push({
 "tab": "lld",
 "id": "lld-thu",
 "n": 0,
 "one": true,
 "title": "Before Thursday: the order of work",
 "minutes": 480,
 "lead": "Wednesday 11 November, for rounds 3 and 4 on Thursday. About six hours of design and two of coding, in this order. Each tab says what to do, for how long, and links the drill that already teaches it; the videos and articles sit under it. Items 7 and 8 are Thursday morning, light.",
 "sections": [
  {"id": "thu-day", "title": "The day", "blocks": [
   {"t": "table", "head": ["#", "What", "Time", "Drill"], "rows": [
    ["1", "Delivery framework: say the seven steps without looking", "30 min", "[How the LLD round runs](#/lld/lld-round)"],
    ["2", "File search, like Unix find, with AND and OR filters", "50 min", "[File search](#/lld/lld-filesearch)"],
    ["3", "Parking lot, then the multi-threaded version", "70 min", "[Parking lot](#/lld/lld-parking)"],
    ["", "Coding block 1: Final day, problems 1 and 2", "60 min", "[Final day](#/daily/2026-11-11)"],
    ["4", "Amazon Locker, the whole round, timed", "45 min", "[Locker mock](#/lld/lld-mock-locker)"],
    ["5", "Rate limiter, then make it thread-safe", "50 min", "[Rate limiter](#/lld/lld-ratelimiter)"],
    ["6", "Splitwise", "45 min", "[Splitwise](#/lld/lld-splitwise)"],
    ["", "Coding block 2: Final day, problems 3 and 4", "60 min", "[Final day](#/daily/2026-11-11)"],
    ["7", "Thursday morning: pizza billing, then the breadth skim", "45 min", "[Breadth](#/lld/thu-breadth)"],
    ["8", "Thursday morning: one unseen Amazon prompt, cold, timed", "35 min", "[Unseen](#/lld/thu-unseen)"]]},
   {"t": "p", "text": "**Every design runs the same shape:** requirements said aloud, functional then non-functional; entities; classes and how they relate; the core flow in code; then extensions, naming which class changes. Breaks between blocks, not inside them."}]},
  {"id": "thu-frame", "title": "1 Framework", "blocks": [
   {"t": "p", "text": "**30 minutes.** Read [How the LLD round runs](#/lld/lld-round) once, then close it and say the seven steps aloud with a minute budget for each. Watch the first video at 1.5x if time allows."},
   {"t": "list", "items": ["Done when: you can say requirements, entities, classes, core flow, code, extensions in order, and what you ask in the first five minutes when no requirements are given."]}]},
  {"id": "thu-find", "title": "2 File search", "blocks": [
   {"t": "p", "text": "**50 minutes.** Do [File search](#/lld/lld-filesearch) from a blank editor first, then compare. It teaches Strategy (one class per filter) and Specification (filters combined with AND and OR) in under 100 lines."},
   {"t": "list", "items": ["Done when: a new filter is one new class, and AND, OR and NOT compose any two filters without touching the walker.", "Follow-up to have ready: a deep tree, so walk with an explicit stack instead of recursion."]}]},
  {"id": "thu-parking", "title": "3 Parking lot", "blocks": [
   {"t": "p", "text": "**70 minutes.** 40 on [Parking lot](#/lld/lld-parking): allocation, pricing as a Strategy passed to the lot. Then 30 on the multi-threaded version: two cars must never get the same spot."},
   {"t": "list", "items": ["Threaded version: say where the race is (find a free spot, then take it), then fix it with a lock per level or a per-spot try-acquire; never one global lock without saying its cost.", "Python: threading.Lock, with lock: around the check and the take; a queue of free spots per size makes the take one atomic pop.", "Concurrency basics if needed: the [concurrency guide on the coding page](../CODING.html#conc)."]}]},
  {"id": "thu-code", "title": "Coding", "blocks": [
   {"t": "p", "text": "**Two blocks of 60 minutes, out loud, timed, in a plain editor.** The four core problems are the Daily two's [Final day](#/daily/2026-11-11), with hints, solutions and follow-ups: rotting oranges (multi-source BFS), LRU cache (your own linked list, then a TTL), course schedule II (Kahn, then three-colour DFS), job scheduling (sort, binary search, DP). Block 1 is the first two, block 2 the last two."},
   {"t": "p", "text": "**Swap-ins**, if one of the four is too fresh or you finish early. Each opens on the Daily two with hints and a solution: the [Extra day](#/daily/2026-11-12), or the earlier day that already has it."},
   {"t": "list", "items": [
    "Graphs: [Number of Islands (200)](#/daily/d01-a), iterative DFS; [Find the Safest Path in a Grid (2812)](#/daily/d17-a), multi-source BFS plus binary search or Dijkstra; [Redundant Connection (684)](#/daily/d17-b), union-find over streaming edges.",
    "Streams and heaps: [Find Median from Data Stream (295)](#/daily/d12-b), two heaps, then heap internals.",
    "DP: [House Robber II (213)](#/daily/d17-c) or [Jump Game (55)](#/daily/d17-d), a quick check that your DP narration is smooth.",
    "Binary search: [Search in Rotated Sorted Array (33)](#/daily/d17-e), then the duplicates follow-up.",
    "Prefix sums and windows: [Subarray Sum Equals K (560)](#/daily/d07-b); [Max Consecutive Ones III (1004)](#/daily/d17-f), then return the flipped indices.",
    "Intervals: [Car Pooling (1094)](#/daily/d17-g), a sorted-map version, then a difference array, then how it scales to a database.",
    "Trees: [Lowest Common Ancestor of a Binary Tree II (1644)](#/daily/d17-h), where the nodes may not exist (Premium on LeetCode; free here).",
    "Weighted graphs: [Evaluate Division (399)](#/daily/d17-i), the currency conversion problem reported at SDE 2."]}]},
  {"id": "thu-locker", "title": "4 Amazon Locker", "blocks": [
   {"t": "p", "text": "**45 minutes, timed, as the real round.** [The Locker mock](#/lld/lld-mock-locker) is the most reported Amazon LLD ask: the same allocation skeleton as the parking lot, plus size fallback, pickup codes and expiry."},
   {"t": "list", "items": ["Done when: deposit picks the smallest free locker that fits, pickup checks the code and frees it, expired packages go back to the carrier, and you can say which class changes for a new locker size."]}]},
  {"id": "thu-rate", "title": "5 Rate limiter", "blocks": [
   {"t": "p", "text": "**50 minutes.** [Rate limiter](#/lld/lld-ratelimiter): token bucket and sliding window behind one interface, chosen per client. Then the follow-up that always comes: many threads calling allow() at once."},
   {"t": "list", "items": ["Thread safety: a lock per client bucket, not one for the whole limiter; refill lazily inside the lock from the elapsed time.", "Say the trade: token bucket allows bursts, sliding window log is exact but stores every timestamp."]}]},
  {"id": "thu-split", "title": "6 Splitwise", "blocks": [
   {"t": "p", "text": "**45 minutes.** [Splitwise](#/lld/lld-splitwise): expenses, a split Strategy (equal, exact, percent), balances per pair, then simplify debts."},
   {"t": "list", "items": ["Done when: a new split type is one class, validation lives in the split, and you can explain simplify-debts as net balance per person, then match the largest debtor with the largest creditor."]}]},
  {"id": "thu-breadth", "title": "7 Breadth", "blocks": [
   {"t": "p", "text": "**Thursday morning, 45 minutes, skim not build.** For each: the classes, the one pattern, and the one hard follow-up."},
   {"t": "list", "items": ["Pizza billing: Decorator (each topping wraps the pizza) against a rules class (a price table and one total()); say why rules win once toppings have combos or discounts.", "Elevator: [the drill](#/lld/lld-elevator); State per car plus a scheduler choosing which car takes a request.", "Vending machine: [the drill](#/lld/lld-vending); State: idle, has money, dispensing.", "Booking: [the drill](#/lld/lld-booking); hold a seat with an expiry, confirm on payment, the double-booking race.", "Package installer: dependencies as a graph, install in topological order, a cycle is an error you report with its path."]}]},
  {"id": "thu-unseen", "title": "8 Unseen prompt", "blocks": [
   {"t": "p", "text": "**Thursday morning, 35 minutes, cold, with a timer.** Pick one you have not seen and run the full shape. The point is handling ambiguity: ask, write the requirements down, decide."},
   {"t": "list", "items": ["Delivery-time estimation: what inputs, what rules, how a new carrier or region plugs in.", "Customer reviews: a review, ratings, helpful votes, moderation states, sorting.", "Issue management with escalations: tickets, states, an escalation policy on a timer, who is notified."]}]}
 ]
});
