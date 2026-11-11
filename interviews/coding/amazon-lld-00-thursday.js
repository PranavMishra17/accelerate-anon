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
    ["", "Coding block 1: two design-flavoured mediums", "60 min", "[Coding](#/lld/thu-code)"],
    ["4", "Amazon Locker, the whole round, timed", "45 min", "[Locker mock](#/lld/lld-mock-locker)"],
    ["5", "Rate limiter, then make it thread-safe", "50 min", "[Rate limiter](#/lld/lld-ratelimiter)"],
    ["6", "Splitwise", "45 min", "[Splitwise](#/lld/lld-splitwise)"],
    ["", "Coding block 2: redo the two you found hardest", "60 min", "[Daily two](#/daily)"],
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
  {"id": "thu-code", "title": "Coding block 1", "blocks": [
   {"t": "p", "text": "**60 minutes, out loud, timed, in a plain editor.** Two mediums that are small designs in themselves."},
   {"t": "list", "items": ["[LRU Cache (146)](https://leetcode.com/problems/lru-cache/): 30 minutes; a dict plus a doubly linked list, then say the OrderedDict version.", "[Insert Delete GetRandom O(1) (380)](https://leetcode.com/problems/insert-delete-getrandom-o1/): 30 minutes; a list plus an index map, swap with the last on delete."]}]},
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
