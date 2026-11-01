"""Part 0.5, first tab: the ten questions, how often they were reported, and the five shapes."""
SECTION = {"id": "t10-overview", "title": "The ten, and the five shapes", "blocks": [
    {"t": "p", "text": "These are the LLD questions Amazon candidates actually reported, counted from first-hand write-ups (LeetCode Discuss, roundz, GeeksforGeeks, Taro, PracHub, TechPrep, 1point3acres), mostly 2024 to 2026. **No source ranks Amazon's questions by frequency, so the counts are lower bounds**, but the top of the list is clear: Amazon Locker shows up more than anything else."},
    {"t": "table", "head": ["#", "Question", "Reports found", "Shape"], "rows": [
        ["1", "Amazon Locker (and 'find space for an incoming package')", "about 7, Apr 2024 to Apr 2026", "Container of slots"],
        ["2", "Parking lot or garage", "about 4", "Container of slots"],
        ["3", "Chess", "about 4", "Turn-based game"],
        ["4", "Splitwise (expense sharing)", "3, Dec 2024 to Apr 2026", "Ledger"],
        ["5", "Ticket booking: movie or train", "3", "Container of slots, with holds"],
        ["6", "Vending machine", "about 3", "State machine"],
        ["7", "Elevator", "2", "State machine plus scheduler"],
        ["8", "Rate limiter", "2", "Pluggable algorithm"],
        ["9", "Meeting room reservation", "2", "Container of slots, over time"],
        ["10", "File search, like Unix find", "2, mostly older", "Composable filters"]]},
    {"t": "p", "text": "Also reported once each: LRU cache, pub/sub, digital wallet, issue management with escalation, restaurant management, school management, library, a chat messenger, a calculator. Your drills already cover LRU and the key-value cache (part 7), library (part 5) and the shopping cart (part 4)."},
    {"t": "table", "head": ["Shape", "Questions", "The skeleton you reuse"], "rows": [
        ["Container of slots", "Locker, parking, booking, meeting rooms", "A container owns resources; an allocation Strategy picks one; a reservation records who has it until when; a lock around choose-and-reserve; physical state on the resource, relational state in the container"],
        ["State machine", "Vending machine, elevator", "One object whose behaviour depends on its state; State classes or an enum with guarded transitions; illegal moves raise"],
        ["Turn-based game", "Chess", "Game owns Board and players; an abstract Piece with polymorphic moves; Move objects for history and undo"],
        ["Ledger", "Splitwise", "Money in integer cents; transactions append; balances derived; a Strategy per split type"],
        ["Pluggable rules", "Rate limiter, file search", "One interface, many interchangeable implementations (algorithms or filters); composites for AND/OR; new rule = new class"]]},
    {"t": "p", "text": "**What interviewers probed across the reports:** a reason for every class and where each method lives (chess, elevator), extensibility and SOLID by name, concurrency (parking garage, locker), and a twist mid-round (priority scheduling, currency conversion, events instead of movies). The round is often 30 minutes beside two leadership questions, and it is sometimes labelled HLD. Code is written, not run."}
]}
