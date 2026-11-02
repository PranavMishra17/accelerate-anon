"""Chess. A drill in the Locker shape: Game, Board, an abstract Piece with one subclass per kind, Move and two enums.
make_move validates, simulates the move to keep your own king safe, then works out check, checkmate or stalemate for the next player."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the game: one turn ----
MAKE_MOVE = method('''
    def make_move(self, player: Colour, frm: tuple, to: tuple) -> Move:
        """
        Core logic:
          1. Reject if the game is over or it is not this player's turn
          2. Find the piece at frm; it must be this player's
          3. Ask whether the move is legal (own piece, the piece's rule, own king safe)
          4. Apply it on the board and record a Move
          5. Pass the turn, then work out check, checkmate or stalemate for the next player
        Edge cases:
          1. Game over -> error
          2. Not your turn -> error
          3. Off the board, an empty square, or the other side's piece -> error
          4. Illegal move -> error, and the board and the turn stay as they were
        """
        if self.is_over():                                          # Edge 1
            raise ChessError("the game is over")
        if player is not self.turn:                                 # Edge 2
            raise ChessError(f"it is {self.turn.value}'s turn")
        if not (self.board.in_bounds(frm) and self.board.in_bounds(to)):   # Edge 3: before any indexing
            raise ChessError("that square is off the board")
        piece = self.board.piece_at(frm)                            # Step 2
        if piece is None or piece.colour is not player:             # Edge 3
            raise ChessError("you have no piece there")
        reason = self._why_illegal(piece, frm, to)                  # Step 3: the higher logic, named now, written next
        if reason is not None:                                      # Edge 4: nothing has changed yet
            raise ChessError(reason)
        captured = self.board.move(frm, to)                         # Step 4: the board returns what it captured
        move = Move(piece, frm, to, captured)
        self.moves.append(move)
        self.turn = player.other()                                  # Step 5: the next player is the one who may be mated
        self._update_status()
        return move
''')

WHY_ILLEGAL = method('''
    def _why_illegal(self, piece: Piece, frm: tuple, to: tuple) -> str | None:
        """
        Core logic:
          1. The target must not hold the mover's own piece
          2. The piece's own rule must allow the move (shape and a clear path)
          3. The move must not leave the mover's own king attacked
        Edge cases:
          1. None means legal; a string says why not, so make_move and the mate search share one rule
        """
        target = self.board.piece_at(to)
        if target is not None and target.colour is piece.colour:    # Step 1: also catches frm == to
            return "that square holds your own piece"
        if not piece.can_move(self.board, frm, to):                 # Step 2: each kind answers for itself
            return f"a {type(piece).__name__.lower()} cannot move there"
        if self._leaves_king_in_check(piece.colour, frm, to):       # Step 3: the hard part, written next
            return "that move leaves your king in check"
        return None
''')

LEAVES_CHECK = method('''
    def _leaves_king_in_check(self, colour: Colour, frm: tuple, to: tuple) -> bool:
        """
        Core logic:
          1. Make the move on the real board, remembering what it captured
          2. Ask whether the mover's king is now attacked
          3. Put everything back, whatever the answer
        Edge cases:
          1. The king itself moving: find_king looks again, so it sees the new square
          2. A capture that removes the attacker: it is gone from the board, so the king is safe
        """
        captured = self.board.move(frm, to)                         # Step 1: try it for real, then take it back
        try:
            return self._in_check(colour)                           # Step 2
        finally:
            self.board.undo_move(frm, to, captured)                 # Step 3: always, so the board is never left half-moved
''')

IS_ATTACKED = method('''
    def is_attacked(self, pos: tuple, by: Colour) -> bool:
        """
        Core logic:
          1. Walk every piece of the attacking colour
          2. Ask each one: could you move onto pos?
          3. Any yes means pos is attacked
        Edge cases:
          1. A pawn attacks only diagonally: its can_move refuses a straight capture, so a king ahead of it is safe
          2. Used only on a king's square, which holds a piece, so a pawn's diagonal rule applies correctly
        """
        for frm, piece in self.pieces_of(by):
            if piece.can_move(self, frm, pos):               # the same rule that moves the piece also attacks with it
                return True
        return False
''')

UPDATE_STATUS = method('''
    def _update_status(self) -> None:
        """
        Core logic:
          1. The player to move is now self.turn; ask whether their king is attacked
          2. If they have a legal move: CHECK when attacked, else ACTIVE
          3. No legal move and attacked: CHECKMATE, and the other side wins
          4. No legal move and not attacked: STALEMATE, a draw
        Edge cases:
          1. Checkmate and stalemate differ only by whether the king is attacked
        """
        in_check = self._in_check(self.turn)                        # Step 1
        if self._has_any_legal_move(self.turn):                     # Step 2: the search is written next
            self.status = Status.CHECK if in_check else Status.ACTIVE
        elif in_check:                                              # Step 3
            self.status = Status.CHECKMATE
            self.winner = self.turn.other()
        else:                                                       # Step 4: no winner
            self.status = Status.STALEMATE
''')

HAS_LEGAL = method('''
    def _has_any_legal_move(self, colour: Colour) -> bool:
        """
        Core logic:
          1. For each piece of this colour, try every square on the board
          2. Use the same legality rule as make_move
          3. The first legal move answers yes; none at all answers no
        Edge cases:
          1. Brute force: at most 16 pieces x 64 squares, fine for one move
        """
        for frm, piece in self.board.pieces_of(colour):
            for row in range(8):
                for col in range(8):
                    if self._why_illegal(piece, frm, (row, col)) is None:   # one rule, shared with make_move
                        return True
        return False
''')

RESIGN = method('''
    def resign(self, player: Colour) -> None:
        """
        Core logic:
          1. The resigning player loses: status RESIGNED, the other colour wins
        Edge cases:
          1. Game already over -> error
          2. A player may resign when it is not their turn
        """
        if self.is_over():                                          # Edge 1
            raise ChessError("the game is over")
        self.status = Status.RESIGNED                               # Edge 2 needs no check: resigning ignores the turn
        self.winner = player.other()
''')

GAME_HELPERS = method('''
    def is_over(self) -> bool:
        return self.status in (Status.CHECKMATE, Status.STALEMATE, Status.RESIGNED)   # CHECK is not over

    def _in_check(self, colour: Colour) -> bool:
        king = self.board.find_king(colour)
        return self.board.is_attacked(king, colour.other())
''')

# ---- the board ----
IS_PATH_CLEAR = method('''
    def is_path_clear(self, frm: tuple, to: tuple) -> bool:
        """
        Core logic:
          1. Work out the one-square step along the line (row and column each -1, 0 or 1)
          2. Start one step past frm
          3. Any piece on a square before reaching to blocks the path
        Edge cases:
          1. to itself is not checked: an enemy there is a capture, and an own piece is Game's check
          2. The caller guarantees a straight or diagonal line; a knight never calls this
        """
        step_row = self._sign(to[0] - frm[0])               # Step 1
        step_col = self._sign(to[1] - frm[1])
        row, col = frm[0] + step_row, frm[1] + step_col     # Step 2
        while (row, col) != to:
            if self.grid[row][col] is not None:             # Step 3
                return False
            row += step_row
            col += step_col
        return True
''')

BOARD_HELPERS = method('''
    def in_bounds(self, pos: tuple) -> bool:
        return 0 <= pos[0] < 8 and 0 <= pos[1] < 8

    def pieces_of(self, colour: Colour) -> list:
        found = []                                          # (position, piece) pairs, in a fixed row-then-column order
        for row in range(8):
            for col in range(8):
                piece = self.grid[row][col]
                if piece is not None and piece.colour is colour:
                    found.append(((row, col), piece))
        return found

    def find_king(self, colour: Colour) -> tuple:
        for pos, piece in self.pieces_of(colour):
            if isinstance(piece, King):
                return pos
        raise ChessError(f"no {colour.value} king")         # unreachable in a real game

    def move(self, frm: tuple, to: tuple) -> Piece | None:
        captured = self.piece_at(to)                        # whatever stood on the target leaves the board
        self.grid[to[0]][to[1]] = self.piece_at(frm)
        self.grid[frm[0]][frm[1]] = None
        return captured

    def undo_move(self, frm: tuple, to: tuple, captured: Piece | None) -> None:
        self.grid[frm[0]][frm[1]] = self.piece_at(to)
        self.grid[to[0]][to[1]] = captured                  # put the captured piece back, or None

    def _sign(self, n: int) -> int:
        if n > 0:
            return 1
        if n < 0:
            return -1
        return 0
''')

# ---- the pieces ----
ROOK_CAN_MOVE = method('''
    def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
        """
        Core logic:
          1. A rook moves along one row or one column
          2. Every square between must be empty
        Edge cases:
          1. Onto an enemy piece is fine here: the capture is the target square, which is not between
          2. Onto its own piece is Game's check, not the rook's
        """
        straight = frm[0] == to[0] or frm[1] == to[1]       # Step 1
        return straight and board.is_path_clear(frm, to)    # Step 2: a slider asks the board; the knight never does
''')

PAWN_CAN_MOVE = method('''
    def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
        """
        Core logic:
          1. Straight ahead, one square, onto an empty square
          2. From the start row, two squares, both empty
          3. Diagonally one square ahead, only onto an enemy piece
        Edge cases:
          1. Backwards or sideways -> never
          2. Straight onto any piece -> no: a pawn cannot capture forward
        """
        dr, dc = to[0] - frm[0], to[1] - frm[1]
        target = board.piece_at(to)
        if dc == 0:
            if target is not None:                          # Edge 2
                return False
            if dr == self.step:                             # Step 1: self.step is +1 for white, -1 for black
                return True
            if dr == 2 * self.step and frm[0] == self.start_row:   # Step 2: only from the start row
                return board.piece_at((frm[0] + self.step, frm[1])) is None   # the square it jumps over
            return False
        capture = target is not None and target.colour is not self.colour
        return abs(dc) == 1 and dr == self.step and capture     # Step 3: a diagonal needs something to take
''')

HEAD = D('''\
    from abc import ABC, abstractmethod
    from dataclasses import dataclass
    from enum import Enum


    class Colour(Enum):
        WHITE = "white"
        BLACK = "black"

        def other(self) -> "Colour":
            return Colour.BLACK if self is Colour.WHITE else Colour.WHITE


    class Status(Enum):
        ACTIVE = 1       # play continues
        CHECK = 2        # the player to move is in check, and has a way out
        CHECKMATE = 3    # in check with no legal move: the other side won
        STALEMATE = 4    # not in check, no legal move: a draw
        RESIGNED = 5     # a player gave up: the other side won


    class ChessError(Exception):    # one error type the caller can catch for every refusal
        pass
    ''')

MOVE = D('''\


    @dataclass(frozen=True)          # a finished fact; the history is a list of them
    class Move:
        """One move played: what moved, where from and to, and what it took."""
        piece: "Piece"
        frm: tuple
        to: tuple
        captured: "Piece | None"
    ''')

PIECE = D('''\


    class Piece(ABC):
        """One piece. Each kind owns its movement rule; the board and the game never ask which kind it is."""

        def __init__(self, colour: Colour):
            self.colour = colour             # whose piece it is; make_move rejects the other side's

        @abstractmethod
        def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
            """Does this kind's own rule allow frm -> to? Shape and path only; check is the game's concern."""
    ''')

ROOK = D('''\


    class Rook(Piece):
        """Slides along a row or a column."""
    ''')

BISHOP = D('''\


    class Bishop(Piece):
        """Slides along a diagonal."""
    ''')

QUEEN = D('''\


    class Queen(Piece):
        """Slides along a row, a column or a diagonal."""
    ''')

KNIGHT = D('''\


    class Knight(Piece):
        """Jumps in an L; nothing in between can block it."""
    ''')

KING = D('''\


    class King(Piece):
        """One square in any direction."""
    ''')

PAWN = D('''\


    class Pawn(Piece):
        """The only piece whose move depends on its colour and on whether it captures."""

        def __init__(self, colour: Colour):
            super().__init__(colour)
            self.step = 1 if colour is Colour.WHITE else -1             # white climbs the rows, black descends
            self.start_row = 1 if colour is Colour.WHITE else 6         # the double step is allowed only from here
    ''')

BISHOP_CAN_MOVE = method('''
    def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
        dr, dc = abs(to[0] - frm[0]), abs(to[1] - frm[1])
        return dr == dc and board.is_path_clear(frm, to)    # equal row and column distance is a diagonal
''')

QUEEN_CAN_MOVE = method('''
    def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
        dr, dc = abs(to[0] - frm[0]), abs(to[1] - frm[1])
        straight = dr == 0 or dc == 0                       # the rook's shape
        diagonal = dr == dc                                 # the bishop's shape
        return (straight or diagonal) and board.is_path_clear(frm, to)
''')

KNIGHT_CAN_MOVE = method('''
    def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
        dr, dc = abs(to[0] - frm[0]), abs(to[1] - frm[1])
        return (dr, dc) in ((1, 2), (2, 1))                 # an L; no path check, it jumps
''')

KING_CAN_MOVE = method('''
    def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
        dr, dc = abs(to[0] - frm[0]), abs(to[1] - frm[1])
        return max(dr, dc) == 1                             # one square any way; staying put is max 0, so no
''')

OTHER_PIECES = (BISHOP + in_class(BISHOP_CAN_MOVE) + QUEEN + in_class(QUEEN_CAN_MOVE)
                + KNIGHT + in_class(KNIGHT_CAN_MOVE) + KING + in_class(KING_CAN_MOVE))

BOARD = D('''\


    class Board:
        """The 8x8 grid. It knows what stands where and whether a line is clear, not the rules of any piece."""

        def __init__(self):
            self.grid = [[None] * 8 for _ in range(8)]       # grid[row][col]; row 0 is white's back rank
            back_rank = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]
            for col, kind in enumerate(back_rank):
                self.grid[0][col] = kind(Colour.WHITE)
                self.grid[7][col] = kind(Colour.BLACK)
            for col in range(8):
                self.grid[1][col] = Pawn(Colour.WHITE)
                self.grid[6][col] = Pawn(Colour.BLACK)

        def piece_at(self, pos: tuple) -> Piece | None:
            return self.grid[pos[0]][pos[1]]
    ''')

GAME = D('''\


    class Game:
        """The entry point: whose turn it is, whether play continues, and the history."""

        def __init__(self):
            self.board = Board()                 # the start position
            self.turn = Colour.WHITE             # white moves first
            self.status = Status.ACTIVE
            self.winner = None                   # a Colour once someone wins; None while playing and in a draw
            self.moves = []                      # Move objects, oldest first
    ''')

CORE = (HEAD + MOVE + PIECE
        + ROOK + in_class(ROOK_CAN_MOVE) + OTHER_PIECES + PAWN + in_class(PAWN_CAN_MOVE)
        + BOARD + in_class(IS_ATTACKED, IS_PATH_CLEAR, BOARD_HELPERS)
        + GAME + in_class(MAKE_MOVE, WHY_ILLEGAL, LEAVES_CHECK, UPDATE_STATUS, HAS_LEGAL, RESIGN, GAME_HELPERS))

SKELETON = (HEAD + MOVE + PIECE
            + D('''\


            class Rook(Piece): ...      # Rook, Bishop, Queen, Knight, King: each only overrides can_move
            ''') + PAWN + BOARD + GAME)

DEMO = D('''\


    # ---- a quick run ----
    def sq(name: str) -> tuple:
        return (int(name[1]) - 1, "abcdefgh".index(name[0]))     # "f2" -> (1, 5): the digit is the row, the letter the column

    def play(game: Game, who: Colour, line: str) -> None:
        try:
            game.make_move(who, sq(line[:2]), sq(line[2:]))
            print(who.value, line)
        except ChessError as e:
            print(e)

    g = Game()                                    # fool's mate
    play(g, Colour.BLACK, "e7e5")                 # out of turn
    play(g, Colour.WHITE, "a1a3")                 # the rook is blocked by its own pawn
    play(g, Colour.WHITE, "f2f3")
    play(g, Colour.BLACK, "e7e5")
    play(g, Colour.WHITE, "g2g4")
    play(g, Colour.BLACK, "d8h4")                 # the queen slides down the diagonal to the king
    play(g, Colour.WHITE, "a2a3")                 # the game is over
    print(g.status.name, g.winner.value)

    h = Game()                                    # a pinned pawn
    for who, line in ((Colour.WHITE, "e2e4"), (Colour.BLACK, "e7e5"), (Colour.WHITE, "f1b5")):
        play(h, who, line)
    play(h, Colour.BLACK, "d7d6")                 # would open the bishop's line to the king
    print(h.turn.value)                           # still black's turn
    h.resign(Colour.BLACK)
    print(h.status.name, h.winner.value)

    s = Game()                                    # stalemate: an empty board, then pieces placed by hand
    s.board.grid = [[None] * 8 for _ in range(8)]
    for pos, piece in (("a1", King(Colour.WHITE)), ("h8", King(Colour.BLACK)), ("f6", Queen(Colour.WHITE))):
        s.board.grid[sq(pos)[0]][sq(pos)[1]] = piece
    play(s, Colour.WHITE, "f6f7")                 # black's king has no safe square and is not attacked
    print(s.status.name, s.winner)
    ''')
DEMO_OUT = ("it is white's turn\na rook cannot move there\nwhite f2f3\nblack e7e5\nwhite g2g4\nblack d8h4\n"
            "the game is over\nCHECKMATE black\nwhite e2e4\nblack e7e5\nwhite f1b5\n"
            "that move leaves your king in check\nblack\nRESIGNED white\nwhite f6f7\nSTALEMATE None\n")

# ---- extensions ----
EXT_PROMOTE = D('''\
    class Pawn(Piece):
        def __init__(self, colour: Colour):
            ...
            self.last_row = 7 if colour is Colour.WHITE else 0    # the far rank

    class Game:
        def make_move(self, player: Colour, frm: tuple, to: tuple, promote_to: type = Queen) -> Move:
            ...
            captured = self.board.move(frm, to)
            if isinstance(piece, Pawn) and to[0] == piece.last_row:   # a pawn reached the far rank
                self.board.grid[to[0]][to[1]] = promote_to(player)    # the player's choice, a Queen by default
            ...
    ''')

EXT_CASTLE = D('''\
    class Piece(ABC):
        def __init__(self, colour: Colour):
            ...
            self.has_moved = False         # Game sets it to True after the piece's first move

    class King(Piece):
        def can_move(self, board: "Board", frm: tuple, to: tuple) -> bool:
            dr, dc = abs(to[0] - frm[0]), abs(to[1] - frm[1])
            if dr == 0 and dc == 2 and not self.has_moved:
                return self._can_castle(board, frm, to)    # rook unmoved, squares between empty, none of the king's squares attacked
            return max(dr, dc) == 1

    class Move:
        rook_move: tuple | None = None     # a castle moves two pieces, so the Move records the second
    ''')

EXT_UNDO = D('''\
    class Game:
        def undo(self) -> Move:
            """Take back the last move. Move already holds the piece and what it captured."""
            if not self.moves:
                raise ChessError("nothing to undo")
            move = self.moves.pop()
            self.board.undo_move(move.frm, move.to, move.captured)
            self.turn = move.piece.colour          # it is that player's turn again
            self.winner = None
            self._update_status()                  # recompute: the position before may have been check
            return move
    ''')

# ---- the final file: core + promotion ----
F_PAWN = D('''\


    class Pawn(Piece):
        """The only piece whose move depends on its colour and on whether it captures."""

        def __init__(self, colour: Colour):
            super().__init__(colour)
            self.step = 1 if colour is Colour.WHITE else -1
            self.start_row = 1 if colour is Colour.WHITE else 6
            self.last_row = 7 if colour is Colour.WHITE else 0          # new: the far rank, where it promotes
    ''')

F_MAKE_MOVE = method('''
    def make_move(self, player: Colour, frm: tuple, to: tuple, promote_to: type = Queen) -> Move:
        """Same steps as before, plus promotion."""
        if self.is_over():
            raise ChessError("the game is over")
        if player is not self.turn:
            raise ChessError(f"it is {self.turn.value}'s turn")
        if not (self.board.in_bounds(frm) and self.board.in_bounds(to)):
            raise ChessError("that square is off the board")
        piece = self.board.piece_at(frm)
        if piece is None or piece.colour is not player:
            raise ChessError("you have no piece there")
        reason = self._why_illegal(piece, frm, to)
        if reason is not None:
            raise ChessError(reason)
        captured = self.board.move(frm, to)
        if isinstance(piece, Pawn) and to[0] == piece.last_row:         # new: a pawn reached the far rank
            self.board.grid[to[0]][to[1]] = promote_to(player)          # the player's choice, a Queen by default
        move = Move(piece, frm, to, captured)
        self.moves.append(move)
        self.turn = player.other()
        self._update_status()
        return move
''')

FINAL = (HEAD + MOVE + PIECE
         + ROOK + in_class(ROOK_CAN_MOVE) + OTHER_PIECES + F_PAWN + in_class(PAWN_CAN_MOVE)
         + BOARD + in_class(IS_ATTACKED, IS_PATH_CLEAR, BOARD_HELPERS)
         + GAME + in_class(F_MAKE_MOVE, WHY_ILLEGAL, LEAVES_CHECK, UPDATE_STATUS, HAS_LEGAL, RESIGN, GAME_HELPERS))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    def sq(name: str) -> tuple:
        return (int(name[1]) - 1, "abcdefgh".index(name[0]))

    def lone_pawn() -> Game:
        g = Game()
        g.board.grid = [[None] * 8 for _ in range(8)]          # kings and one white pawn on a7
        g.board.grid[0][4] = King(Colour.WHITE)
        g.board.grid[5][7] = King(Colour.BLACK)
        g.board.grid[6][0] = Pawn(Colour.WHITE)
        return g

    for choice in (Queen, Knight):                              # the default, then an under-promotion
        g = lone_pawn()
        g.make_move(Colour.WHITE, sq("a7"), sq("a8"), choice)
        print(type(g.board.piece_at(sq("a8"))).__name__, g.status.name)
    ''')
FINAL_OUT = "Queen ACTIVE\nKnight ACTIVE\n"


PROBLEM = {
    "id": "chess", "title": "Chess", "part_id": "lld-chess", "n": 9,
    "part_title": "Chess", "minutes": 45,
    "lead": "A chess round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. The pieces are real polymorphism: one subclass per kind, each with its own can_move. The hard parts are a move that leaves your own king in check, and telling checkmate from stalemate. Implementation starts with the most interesting method and names its helpers before writing them.",
    "prompt": "Design chess for two players.",
    "evidence": "GeeksforGeeks (three loops, one a bar raiser where the LLD caused the rejection); LeetCode Discuss Jun 2025 (L5, with an API and request/response per call). Probed hard: a reason for every class and method placement.",
    "drill": "part 9, Chess.",

    "clarify": {
        "capabilities": [("Local or online?", "Two players at one board; online only if you ask"),
                         ("Do we need the full rules?", "Normal moves for all six pieces and captures; castling, en passant and promotion are follow-ups"),
                         ("How does a game end?", "Checkmate, stalemate or resignation")],
        "errors": [("What if a move is illegal?", "Reject it, say why, and keep the same player's turn"),
                   ("Can a player leave their own king in check?", "No: that move is rejected"),
                   ("Check, checkmate and stalemate?", "Detect all three after every move: no legal move left is mate if the king is attacked, else stalemate")],
        "scope": [("Timers, undo, an engine or AI opponent?", "None of them at first; keep the move history"),
                  ("Draw by repetition or the fifty-move rule?", "Out of scope"),
                  ("A display or a user interface?", "No: moves are two (row, column) positions")],
    },
    "clarify_hint": "Local or online, how much of the rules, how a game ends. An illegal move, moving into check, mate and stalemate. Timers, undo, an AI, draw rules.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** The rules question comes first, because castling, en passant and promotion each add to a piece, so I want them named as follow-ups, not built now. Then illegal moves, and above all moving into check, since that is the rule that makes the game a game.",
    "clarify_why": "Every question changes a class or a method. 'Normal moves' is why Piece is abstract with one subclass per kind. 'No move into check' is why make_move simulates the move. 'Mate or stalemate' is why the status has more than two values.",
    "answers": "Two players at one board, white first. Normal moves and captures for all six pieces; castling, en passant and promotion come later. The game ends in checkmate, stalemate or resignation. An illegal move is rejected with a reason and the turn stays; so is a move that leaves your own king in check. Check, checkmate and stalemate are detected after every move. No timers, undo, AI, draw rules or UI; keep the history.",
    "playback": ["Thanks, that's clear. **So: two players alternate, each piece decides its own move, and a move is legal only if it leaves your own king safe.** After every move I work out check, checkmate or stalemate for the next player. Out of scope: castling, en passant and promotion for now, timers, undo, an AI, draw rules and a UI."],

    "requirements": [
        ["Two players alternate turns, white first.", "The game tracks whose turn it is and its status", "A move out of turn, or after the game ends, is rejected"],
        ["A player moves a piece from one square to another.", "The piece's own rule and a clear path decide; a move onto an enemy piece captures it", "An illegal move, an own piece on the target, or a move that leaves your king in check is rejected; the board and the turn stay as they were"],
        ["After every move the game works out the next player's situation.", "The status becomes CHECK, CHECKMATE (the other side wins) or STALEMATE (a draw)", "Once the game is over no more moves are accepted"],
        ["A player can resign at any time.", "The other player wins"],
        ["Anyone can read the status, the winner and the move history."],
    ],
    "out_of_scope": ["castling, en passant and promotion (extensions)", "draw by repetition, fifty moves, insufficient material", "timers", "online play", "an AI opponent", "a display or UI"],
    "req_hint": "Turns, a move and its legality, check and the end of the game, resigning, reading the state.",
    "req_say": "From your answers I get five requirements. **Each is something that happens, and each becomes a method: make_move, resign, and the status the others read.** Requirement 2 is the hard one: a move is legal only if the piece allows it and my own king is safe afterwards. Requirement 3 is the same king question asked about the next player.",
    "req_why": "Requirement 1 and 2 are make_move. 3 is _update_status, which runs after every move. 4 is resign. 5 is the status, winner and moves the game keeps.",

    "entities": [("Game", True, "Owns the board, whose turn it is, the status and the history; the entry point"),
                 ("Board", True, "Holds the 8x8 grid, finds a king, and answers whether a path is clear or a square is attacked"),
                 ("Piece (abstract)", True, "Each kind has its own rule for where it can move"),
                 ("Rook, Bishop, Queen, Knight, King, Pawn", True, "One subclass per kind: six different can_move rules, which is real polymorphism, not a pre-emptive one"),
                 ("Move", True, "Piece, from, to and what was captured; a list of these is the history, and undo would pop one"),
                 ("Colour", True, "An enum with other(); decides whose turn and whose piece"),
                 ("Status", True, "An enum: active, check, checkmate, stalemate, resigned"),
                 ("Player", False, "A name nothing reads; the colour is all the game needs"),
                 ("Square / Cell", False, "A (row, col) tuple is enough; no class"),
                 ("Clock, spectator, engine", False, "Not in the requirements")],
    "ent_hint": "What does each kind of piece need? Does a player need a class, or is a colour enough? What does the game end in?",
    "ent_say": "I underline the nouns. **The game, the board, the piece and the move stay, and the piece becomes six subclasses because each kind moves by a different rule.** A player is only a colour here, so Colour is an enum. A square is a tuple. The status is an enum because a game ends in one of three ways.",
    "ent_why": "Game orchestrates, Board holds the grid, Piece and its subclasses answer 'can I move there?'. Move earns its class because history needs a record of what moved and what was taken.",

    "classes": [
        {"name": "Game", "state": ["board: Board  # make_move reads the pieces and the squares",
                                   "turn: Colour  # req 1: reject a move out of turn; also who may be mated next",
                                   "status: Status  # req 3, 4: no moves once the game is over",
                                   "winner: Colour | None  # req 3, 4: set by checkmate or resignation, None in a draw",
                                   "moves: Move[]  # req 5: the history"],
         "behaviour": ["make_move(player, frm, to) -> Move | error  # req 1 to 3: the one entry for a turn",
                       "resign(player) -> void  # req 4: the other way a game ends",
                       "is_over() -> bool  # make_move and resign refuse once true",
                       "_why_illegal(piece, frm, to) -> string | None  # one legality rule, shared by make_move and the mate search",
                       "_leaves_king_in_check(colour, frm, to) -> bool  # req 2: simulate, ask, undo",
                       "_update_status() -> void  # req 3: check, checkmate or stalemate for the next player",
                       "_has_any_legal_move(colour) -> bool  # req 3: decides mate or stalemate"]},
        {"name": "Board", "state": ["grid: Piece | None [8][8]  # which piece is on each square"],
         "behaviour": ["piece_at(pos) -> Piece | None  # make_move and every can_move read squares",
                       "is_path_clear(frm, to) -> bool  # req 2: sliding pieces cannot jump",
                       "is_attacked(pos, by) -> bool  # req 2, 3: could any piece of colour by move onto pos?",
                       "find_king(colour) -> position  # the square the check question is about",
                       "pieces_of(colour) -> (position, piece)[]  # attack and the mate search walk these",
                       "move(frm, to) -> Piece | None  # req 2: a capture leaves the board",
                       "undo_move(frm, to, captured) -> void  # put a simulated move back"]},
        {"name": "Piece (abstract)", "state": ["colour: Colour  # make_move rejects moving the other side's piece"],
         "behaviour": ["can_move(board, frm, to) -> bool  (Rook, Bishop, Queen, Knight, King and Pawn each override it)  # req 2: each kind owns its rule"]},
        {"name": "Pawn", "state": ["step: int  # +1 for white, -1 for black: pawns only go forward",
                                   "start_row: int  # the double step is allowed only from here"],
         "behaviour": ["can_move(board, frm, to) -> bool  # forward onto empty, double from start, diagonal only to capture"]},
        {"name": "Move", "state": ["piece: Piece  # what moved",
                                   "frm: (row, col)  # where it came from",
                                   "to: (row, col)  # where it landed",
                                   "captured: Piece | None  # undo restores it"], "behaviour": []},
    ],
    "class_hint": "Game holds the board, the turn, the status and the history. The board is a grid. A piece knows its colour; a pawn also knows which way is forward.",
    "class_say": "**I start from the methods the requirements gave me: make_move, resign and the status.** Make_move has to read the board, whose turn it is and whether the game is over, so Game holds those. To keep my own king safe it asks the board whether a square is attacked, so the board needs a way to ask every enemy piece. The board knows where pieces are, each piece knows its own rule, and a pawn also needs its direction and start row, which is why it has two fields.",
    "class_why": "Game decides what is legal and when the game ends; Board only answers geometry questions; each Piece answers for its own shape. Rules sit in pieces, geometry in the board, turns in the game, so each class has one job.",
    "class_qa": [{"ask": "Why does the piece decide its move, and not the game or the board?",
                  "say": "Because the rule is different for each kind and needs only the piece's own colour and the squares. **Adding a piece changes one class, and make_move never asks which kind it is.** The board stays the same for all of them.",
                  "explain": ["Rook, Bishop and Queen ask board.is_path_clear. Knight, King and Pawn do not need it."]},
                 {"ask": "Why does the board answer 'is this square attacked', and not the game?",
                  "say": "Because it only walks the pieces and asks each one can_move onto the square. **The same rule that moves a piece also says what it attacks,** so there is no second rule table to keep in step."},
                 {"ask": "Why no Player class?",
                  "say": "Nothing reads a name. **A colour says whose turn it is and whose piece it is,** which is all make_move needs."}],

    "map": {"center": ("Game", "turns, make_move"),
            "owned": [("Board", "8x8 grid, pieces"), ("Move", "history")],
            "uses": [("Piece (abstract)", "six kinds, can_move"), ("Colour, Status", "enums")]},

    "skeleton": {"q": "First the small pieces: the enums, the error, Move, the abstract Piece, Pawn's fields, the board's __init__ and piece_at, and the game's __init__.",
                 "hint": "Colour with other(), Status with five values. Move is a frozen dataclass. Piece holds a colour and an abstract can_move. The board is an 8x8 grid set up with the back rank and two rows of pawns. Game holds the board, the turn, the status, the winner and the moves.",
                 "code": SKELETON,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps."},
    "methods": [
        {"name": "make_move", "q": "Start with the most interesting method: make_move(player, frm, to). Core logic and edge cases as comments, then the code. Name the hard part as a helper.",
         "hint": "Game over, turn, bounds, the piece is yours. Then reason = self._why_illegal(...). Apply, record, pass the turn, update the status.", "code": MAKE_MOVE,
         "why": "Every cheap rejection comes first and changes nothing. The legality question is the higher logic, so it gets a name here and its own method next."},
        {"name": "_why_illegal", "q": "_why_illegal(piece, frm, to): when is a move not allowed? Write the three tests in order.",
         "hint": "Own piece on the target, the piece's own rule, then does it leave my king in check. Return a reason or None.", "code": WHY_ILLEGAL,
         "why": "Returning a reason lets make_move raise it and the mate search ignore it: one rule, two callers."},
        {"name": "_leaves_king_in_check", "q": "_leaves_king_in_check(colour, frm, to): how do you know a move exposes your own king?",
         "hint": "Make the move on the board, ask whether the king is attacked, undo it. Undo even if something goes wrong.", "code": LEAVES_CHECK,
         "why": "Simulating on the real board is the simplest rule that is always right: a pinned piece, a king stepping into attack and a capture that removes the attacker all fall out of it."},
        {"name": "Board.is_attacked", "q": "Board.is_attacked(pos, by): can any piece of colour by reach this square?",
         "hint": "Walk the pieces of that colour; ask each can_move onto the square.", "code": IS_ATTACKED,
         "why": "It reuses can_move, so a pawn attacks diagonally and a slider is blocked exactly as it would be when moving. No second rule table."},
        {"name": "_update_status", "q": "_update_status(): after the turn passes, what is the situation of the player to move?",
         "hint": "In check or not, any legal move or not: four cases.", "code": UPDATE_STATUS,
         "why": "Checkmate and stalemate are the same test with one difference: is the king attacked."},
        {"name": "_has_any_legal_move", "q": "_has_any_legal_move(colour): does this player have any legal move?",
         "hint": "For each piece, try every square, using the same legality rule as make_move. Stop at the first yes.", "code": HAS_LEGAL,
         "why": "Brute force, at most 16 pieces by 64 squares. Reusing _why_illegal means mate detection cannot disagree with move validation."},
        {"name": "Rook.can_move", "q": "Rook.can_move(board, frm, to): the slider pattern.",
         "hint": "One row or one column, and the board says the path is clear.", "code": ROOK_CAN_MOVE,
         "why": "Shape first, then ask the board about blocking. Bishop and Queen use the same two parts with a different shape."},
        {"name": "Board.is_path_clear", "q": "Board.is_path_clear(frm, to): is anything between the two squares?",
         "hint": "Step one square at a time from frm toward to; any piece before reaching to blocks.", "code": IS_PATH_CLEAR,
         "why": "The target is never checked here: an enemy there is a capture, an own piece is Game's rule."},
        {"name": "Pawn.can_move", "q": "Pawn.can_move(board, frm, to): the odd one out. Which way is forward, and when does it capture?",
         "hint": "Straight onto an empty square, two from the start row if both are empty, diagonal one only onto an enemy piece.", "code": PAWN_CAN_MOVE,
         "why": "A pawn moves one way and captures another, so it is the one piece that reads the target square. The Knight, by contrast, is one line and needs no path check."},
        {"name": "resign", "q": "resign(player): the other way a game ends.",
         "hint": "Not if it is already over. Status RESIGNED, the other colour wins.", "code": RESIGN,
         "why": "It ignores the turn: a player may resign any time."},
    ],
    "helpers": [
        {"q": "The other four pieces: Bishop, Queen, Knight and King.",
         "hint": "Bishop: equal row and column distance, path clear. Queen: rook shape or bishop shape, path clear. Knight: an L, no path. King: one square.",
         "code": OTHER_PIECES,
         "why": "Each is one or two lines. Queen is the Rook and Bishop shapes joined, written out, not inherited."},
        {"q": "The board's helpers: in_bounds, pieces_of, find_king, move, undo_move and _sign.",
         "hint": "Range check. Every (position, piece) of a colour. The king's square. Move returns what it captured; undo puts it back.",
         "code": BOARD_HELPERS,
         "why": "pieces_of is shared by is_attacked, find_king and the mate search, so the walk lives in one place."},
        {"q": "The game's helpers: is_over and _in_check.",
         "hint": "Checkmate, stalemate and resigned are over; check is not. In check means the king's square is attacked by the other colour.",
         "code": GAME_HELPERS,
         "why": "_in_check is the one question asked by both the simulation and the status update."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies. Here the Piece subclasses are real polymorphism the problem asks for, not a pre-emptive pattern.",
        "solid": [
            ("Single responsibility", "Game runs turns and status, Board holds squares and lines, each Piece decides its own move, Move records one move."),
            ("Open/closed", "A new kind of piece is a new Piece subclass with its own can_move. make_move, the board and the status check are not edited."),
            ("Liskov substitution", "Any Piece subclass works where Piece does: same can_move contract, shape and path only. Check is never the piece's job."),
            ("Interface segregation", "Piece has one question, can_move. Nothing more is asked of a piece."),
            ("Dependency inversion", "Nothing is injected yet. Game builds its Board; hand it one if a test needs a hand-placed position."),
        ],
        "varies": [
            ("Movement rule per piece", "No pattern: subclass", "each Piece has its own can_move"),
            ("Castling, en passant, promotion", "No pattern: a flag and a field", "has_moved on Piece, extra effect recorded on Move"),
            ("Timers per player", "No pattern: a field. Observer only if others must hear", "a Clock Game starts and stops where the turn switches"),
            ("Check and checkmate", "No pattern: simulate", "try the move on Board, ask is_attacked, undo"),
        ],
    },
    "extensions": [
        {"ask": "Add pawn promotion.",
         "say": "A pawn that reaches the far rank is replaced by another piece. **Pawn gets a last_row, and make_move swaps the pawn for the player's choice, a queen by default, right after the board moves it.** Legality is unchanged: the piece that left the square is what mattered for check.",
         "code": EXT_PROMOTE, "code_title": "Promotion",
         "short_q": "Promotion", "short_a": "Pawn.last_row; make_move swaps in the chosen piece, a queen by default"},
        {"ask": "Add castling and en passant.",
         "say": "Both are piece rules, so they stay inside the pieces. **Piece gets a has_moved flag, and the King allows the two-square castle only if neither it nor the rook has moved, the squares between are empty and none is attacked.** Move records the rook's move too. En passant needs the last move: a pawn may capture diagonally onto the square a pawn has skipped.",
         "code": EXT_CASTLE, "code_title": "Castling",
         "short_q": "Castling, en passant", "short_a": "has_moved on Piece; King allows the castle; Move records the second piece; en passant reads the last Move"},
        {"ask": "Add undo.",
         "say": "Move already stores the piece, both squares and the captured piece, and the board has undo_move. **Undo pops the last Move, puts it back, gives the turn back and recomputes the status.** A promotion or castle would need the Move to record the extra effect.",
         "code": EXT_UNDO, "code_title": "Undo",
         "short_q": "Undo", "short_a": "pop the last Move; board.undo_move; restore the turn; recompute status"},
        {"ask": "Add timers per player.",
         "say": "A Clock owned by Game that starts and stops on each turn change. **Game calls it at the one place the turn switches,** so it is a field, not a pattern. An Observer only appears if other things, a display or a log, must hear about every move.",
         "short_q": "Timers", "short_a": "a Clock owned by Game, started and stopped where the turn switches"},
    ],
    "faq": [("Why does the board ask can_move to see what is attacked?", "One rule for moving and attacking. A pawn's straight move cannot capture, so a king in front of a pawn is safe, and the diagonal does attack. A slider is blocked exactly as when it moves."),
            ("Why simulate on the real board and undo, not copy the board?", "A copy is 64 squares for every candidate move; make and undo is two assignments. The try/finally guarantees the board comes back."),
            ("How do you tell checkmate from stalemate?", "Both are 'no legal move'. If the king is attacked it is checkmate and the other side wins; if not it is a draw."),
            ("Why is Queen not a subclass of Rook and Bishop?", "Inheriting a movement rule from two parents saves three lines and costs a diamond. Writing the two shapes side by side is clearer."),
            ("Could the pieces share one table of directions?", "Yes: a table of offsets and a max range per kind. It is shorter, but six small can_move methods read better and make the pawn's special rule obvious.")],

    "summary": ["**Five classes and two enums.** Game takes a move, checks the cheap things first, then asks one legality question: the target is not my own piece, the piece's own can_move allows it, and simulating it on the board does not leave my king attacked. Each piece is a subclass that answers only for its own shape; the board answers whether a line is clear or a square is attacked.",
                "**After every move the same king question is asked about the next player.** Any legal move left means CHECK or ACTIVE; none means CHECKMATE if the king is attacked, else STALEMATE. It extends in one place each time: promotion is a field and a swap, castling is a flag on the pieces, undo pops a Move, and a clock is a field on Game."],

    "golden": [
        ("Piece is abstract and each kind owns its movement rule; Game never asks what kind it is.", "adding a piece changes one class, and it is the reason interviewers probe placement."),
        ("A move is legal if the target is not my own piece, the piece's can_move allows it, and my own king is safe afterwards.", "three tests in that order, one method, shared by make_move and the mate search."),
        ("To test king safety, make the move on the board, ask is_attacked, and undo.", "pins, a king stepping into attack and capturing the attacker all fall out with no special case."),
        ("The board knows what is on each square and whether a path is clear; it does not know the rules.", "rules in pieces, geometry in the board, turns in the game: each class has one job."),
        ("Checkmate and stalemate are the same test: no legal move. Checkmate is when the king is attacked.", "one search, one extra question, and a reason to keep Status an enum."),
        ("An illegal move is rejected before anything changes, so the turn and the board stay valid.", "the caller can try again, and simulation never leaves a half-moved board."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with one extension applied (pawn promotion), and a run at the bottom.",
    "final_title": "chess.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "the pawn reaches a8 and becomes a queen by default, or the knight when asked; the position stays active because the black king is not attacked and can still move.",
}
