# Test for dialogue.py: plain asserts.
# Run: python interviews/vanguard_builds/dialogue_test.py
from dialogue import Transfer

G = {"acct_checking": ["checking"], "acct_savings": ["savings"]}
BAL = {"acct_checking": 120000, "acct_savings": 50000}


def make():
    moves = []
    return Transfer(G, BAL, lambda f, t, c: moves.append((f, t, c))), moves


# happy path: slots over several turns, read back, explicit yes
d, moves = make()
assert d.say("i want to transfer money") == "Which account should it come from?"
assert d.say("checking") == "Which account should it go to?"
assert d.say("savings") == "How much?"
assert "Move $300.00 from checking to savings" in d.say("300 dollars")
assert moves == []  # not yet
assert "complete" in d.say("yes")
assert moves == [("acct_checking", "acct_savings", 30000)]

# several slots in one sentence, and a correction at the confirm turn
d, moves = make()
assert "$300.00" in d.say("move 300 dollars from checking to savings")
assert "$500.00" in d.say("no, 500") and d.state == "CONFIRM" and moves == []
d.say("yes")
assert moves == [("acct_checking", "acct_savings", 50000)]

# digression: balance question mid-flow, then the flow resumes with slots intact
d, moves = make()
d.say("transfer from checking")
reply = d.say("what is my savings balance")
assert "$500.00" in reply and reply.endswith("Which account should it go to?")
assert d.slots["from"] == "acct_checking"

# no money without an explicit yes: silence, maybe, or a plain no
for answer in ["hmm maybe", "ok i guess"]:
    d, moves = make()
    d.say("move 10 dollars from checking to savings")
    d.say(answer)
    assert moves == [] and d.state in ("CONFIRM", "HANDOFF")
d, moves = make()
d.say("move 10 dollars from checking to savings")
assert "Nothing was moved" in d.say("cancel") and moves == []

# handoff after two failed turns in a row; a good turn resets the count
d, moves = make()
d.say("transfer money")
assert d.say("blah").startswith("Sorry")
assert d.say("blah blah") == "I'm having trouble, so I'll connect you to a person." and d.state == "HANDOFF"
d, moves = make()
d.say("blah")
d.say("checking")  # progress resets the count
assert d.say("blah").startswith("Sorry") and d.state == "FILLING"
print("ok")
