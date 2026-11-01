"""Chess. Cheat only: one screen in part 0.5."""

PROBLEM = {
    "id": "chess", "title": "Chess",
    "prompt": "Design chess for two players.",
    "evidence": "GeeksforGeeks (three loops, one a bar raiser where the LLD caused the rejection); LeetCode Discuss Jun 2025 (L5, with an API and request/response per call). Probed hard: a reason for every class and method placement.",

    "clarify": {
        "capabilities": [("Local or online?", "Two players at one board; online only if you ask"),
                         ("Do we need the full rules?", "Normal moves and captures; special moves are a follow-up"),
                         ("How does a game end?", "Checkmate or resignation")],
        "errors": [("What if a move is illegal?", "Reject it, say why, and keep the same player's turn"),
                   ("Check and checkmate?", "Detect check; checkmate if no legal move is left")],
        "scope": [("Timers, undo, an engine or AI opponent?", "None of them at first; keep the move history")],
    },

    "requirements": [
        ["Two players alternate turns, white first.", "The game tracks whose turn it is and its status", "A move out of turn is rejected"],
        ["A player moves a piece from one square to another.", "The piece decides whether the move fits its own rule and the path is clear", "An illegal move is rejected and the turn stays"],
        ["A move onto an enemy piece captures it.", "The captured piece leaves the board", "Moving onto your own piece is rejected"],
        ["The game ends in checkmate or resignation.", "The game status changes and no more moves are accepted"],
    ],
    "out_of_scope": ["castling, en passant, promotion (a line each in extensions)", "check detection beyond a line", "timers", "online play", "an AI opponent"],

    "entities": [("Game", True, "Owns the board, the players and whose turn it is; the entry point"),
                 ("Board", True, "Holds the 8x8 squares and which piece is on each"),
                 ("Piece", True, "Abstract; each kind knows its own movement rule"),
                 ("Move", True, "Piece, from, to and what was captured; a list of these gives history and undo"),
                 ("Player", True, "A name and a colour"),
                 ("Square / Cell", False, "A (row, col) pair is enough; no class"),
                 ("Spectator / Clock", False, "Not in the requirements")],

    "classes": [
        {"name": "Game", "state": ["board: Board", "players: Player[2]", "turn: Colour", "status: Status", "moves: Move[]"],
         "behaviour": ["make_move(player, frm, to) -> Move | error", "resign(player) -> void", "get_status() -> Status"]},
        {"name": "Board", "state": ["grid: Piece | None [8][8]"],
         "behaviour": ["piece_at(pos) -> Piece | None", "move(frm, to) -> Piece | None  (the captured piece)", "path_clear(frm, to) -> boolean"]},
        {"name": "Piece (abstract)", "state": ["colour: Colour"],
         "behaviour": ["can_move(board, frm, to) -> boolean  (King, Queen, Rook, Bishop, Knight and Pawn each override it)"]},
        {"name": "Move", "state": ["piece: Piece", "frm: (row, col)", "to: (row, col)", "captured: Piece | None"], "behaviour": []},
        {"name": "Player", "state": ["name: string", "colour: Colour"], "behaviour": []},
    ],

    "map": {"center": ("Game", "turns, make_move"),
            "owned": [("Board", "8x8 grid"), ("Player", "name, colour"), ("Move", "history")],
            "uses": [("Piece (abstract)", "can_move per kind"), ("Colour, Status", "enums")]},

    "methods": [
        {"name": "make_move",
         "logic": ["Reject if the game is over or it is not this player's turn",
                   "Get the piece at the start square; reject if empty or not this player's colour",
                   "Ask the piece can_move(board, frm, to); reject if no",
                   "Reject if the target holds your own piece",
                   "Board moves it and returns any captured piece; record a Move",
                   "If the captured piece is a king, finish the game; else switch turns"]},
        {"name": "resign", "logic": ["The resigning player loses: set the status to the other colour's win"]},
        {"name": "can_move (per piece)",
         "logic": ["Rook: same row or column, path clear", "Bishop: equal row and column distance, path clear",
                   "Queen: rook or bishop rule", "Knight: an L (2 and 1), jumps, no path check",
                   "King: one square any way", "Pawn: forward one (two from start), diagonal only to capture"]},
        {"name": "path_clear", "logic": ["Step from frm toward to one square at a time", "Any piece on a square strictly between them blocks"]},
    ],

    "extensions": [
        {"ask": "Add castling, en passant and promotion.",
         "say": "These are piece rules, so they stay inside the pieces. **The King's can_move allows the two-square castle only if neither piece has moved**, so Piece gets a has_moved flag, and Move records a rook move or a promotion. Game and Board don't change shape.",
         "short_q": "Castling, en passant, promotion", "short_a": "inside the pieces: a has_moved flag, and Move records the extra effect"},
        {"ask": "Detect check and checkmate.",
         "say": "After a move I ask whether my own king is attacked: **simulate the move on the board, test if any enemy piece can_move onto my king, and undo if so.** That also rejects moves that leave your king in check. Checkmate is check with no legal move left.",
         "short_q": "Check and checkmate", "short_a": "simulate the move, test if the king is attacked, undo if so; mate means no legal move"},
        {"ask": "Add undo and a move history.",
         "say": "Move already stores the piece, both squares and the captured piece, so undo pops the last Move and puts everything back. **Add has_moved to the Move so castling undoes correctly.**",
         "short_q": "Undo", "short_a": "pop the last Move; it holds the captured piece"},
        {"ask": "Add timers per player.",
         "say": "A Clock owned by Game that starts and stops on each turn change. **Game calls it at the one place the turn switches.**",
         "short_q": "Timers", "short_a": "a Clock owned by Game, started and stopped where the turn switches"},
    ],

    "golden": [
        ("Piece is abstract and each kind owns its movement rule; Game never asks what kind it is.", "adding a piece changes one class, and it is the reason interviewers probe placement."),
        ("The Board knows what is on each square and whether a path is clear; it does not know the rules.", "rules in pieces, geometry in the board, turns in the game: each class has one job."),
        ("Special moves and check detection are mentioned as extensions, not designed up front.", "it shows scope judgment and keeps the core to five classes in 40 minutes."),
        ("Move holds the piece, both squares and the capture.", "it gives history and undo for free, and check detection can simulate and reverse a move."),
        ("An illegal move is rejected without changing the turn or the board.", "the board stays valid, so the caller can try again."),
    ],
}
