"""Evaluation harness. A drill in the elevator shape: EvalHarness, three graders, Report, and small values (Case, Score, DimStats, Regression).
run_suite() is the entry; _run_case separates the system's crash (0.0) from a grader's crash (Unknown). The system and the judge are fakes."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the harness: run a suite, compare reports ----
RUN_SUITE = method('''
    def run_suite(self, cases: list, system) -> Report:
        """
        Core logic:
          1. Check the suite
          2. Run and grade each case
          3. Gather the scores into a Report
        Edge cases:
          1. Empty suite -> error: a report of nothing would pass every comparison
          2. Two cases with one id -> error: scores are filed by case id
          3. A case no grader applies to -> it stays in the report with no scores, not hidden
        """
        self._check_suite(cases)                                  # Edge 1 and 2, named now, written in the helpers
        scores = {}
        for case in cases:                                        # Step 2: one case at a time, so a run is deterministic
            scores[case.id] = self._run_case(case, system)        # the hard part, named now, written next
        return Report(scores)                                     # Step 3: the Report does the aggregation
''')

RUN_CASE = method('''
    def _run_case(self, case: Case, system) -> list:
        """
        Core logic:
          1. Find the graders that apply to this case
          2. Run the system on the prompt
          3. The system raised: every applicable dimension scores 0.0, with the error as the note
          4. Otherwise each grader scores the output
        Edge cases:
          1. A crash of the system is its failure, so 0.0. A crash of a grader is ours, so Unknown (in _safe_grade)
        """
        graders = [g for g in self.graders if g.applies(case)]    # Step 1: the grader decides, run_suite never looks at kinds
        try:
            output = system(case.prompt)                          # Step 2
        except Exception as e:                                    # Step 3 + Edge 1: the system failed the case
            return [Score(g.dimension, 0.0, f"system error: {e}") for g in graders]
        return [self._safe_grade(g, case, output) for g in graders]   # Step 4
''')

COMPARE = method('''
    def compare(self, report: Report, baseline: dict) -> list:
        """
        Core logic:
          1. Take this report's mean for each dimension
          2. For each dimension in the baseline, look up the mean now
          3. Flag it if the mean fell by more than the tolerance, or can no longer be measured
        Edge cases:
          1. A dimension not in the baseline is new, never a regression
          2. A baseline dimension with no known score now -> flagged with after None: silence would hide the loss
          3. A fall of exactly the tolerance is not flagged; only more than it is
        """
        now = {dim: stats.mean for dim, stats in report.summary().items()}   # Step 1
        regressions = []
        for dim, before in sorted(baseline.items()):              # sorted: the same order every run
            after = now.get(dim)                                  # Edge 2: absent, or all Unknown, gives None
            # round, so a fall from 0.8 to 0.75 is exactly 0.05 and not 0.05000000000000004 (Edge 3)
            if after is None or round(before - after, 6) > self.tolerance:   # Step 3
                regressions.append(Regression(dim, before, after))
        return regressions
''')

HARNESS_HELPERS = method('''
    def _safe_grade(self, grader, case: Case, output: str) -> Score:
        try:
            return grader.grade(case, output)
        except Exception as e:                                    # a broken grader says nothing about the system
            return Score(grader.dimension, None, f"grader error: {e}")

    def _check_suite(self, cases: list) -> None:
        if not cases:
            raise EvalError("empty suite")
        ids = [c.id for c in cases]
        if len(set(ids)) != len(ids):                             # a set drops repeats, so a shorter set means a repeat
            raise EvalError("two cases share an id")
''')

# ---- the graders: each scores one dimension ----
JUDGE_GRADE = method('''
    def grade(self, case: Case, output: str) -> Score:
        """
        Core logic:
          1. Build the judge's prompt from the rubric, the question and the answer
          2. Ask the judge model
          3. A whole number from 1 to 5 maps onto 0.0 to 1.0
          4. Anything else is Unknown
        Edge cases:
          1. 'unsure' or any other text -> Unknown, with the reply as the note; we never guess a number
          2. A number outside 1 to 5 -> Unknown: the judge broke the scale, so we don't clamp it
        """
        prompt = (f"Rubric: {self.rubric}\\nQuestion: {case.prompt}\\nAnswer: {output}\\n"
                  "Reply with a number from 1 to 5, or 'unsure'.")           # Step 1
        reply = self.judge.rate(prompt).strip()                              # Step 2
        if reply.isdigit() and 1 <= int(reply) <= 5:                         # Step 3 + Edge 2
            return Score(self.dimension, (int(reply) - 1) / 4, f"judge said {reply}")   # 1 -> 0.0, 5 -> 1.0
        return Score(self.dimension, None, f"judge said {reply!r}")          # Step 4 + Edge 1
''')

CODE_GRADE = method('''
    def grade(self, case: Case, output: str) -> Score:
        """
        Core logic:
          1. Run the output as Python, in a fresh namespace, and find solution
          2. Call solution(*args) for each of the case's tests
          3. The score is the share of tests that pass
        Edge cases:
          1. The output doesn't load, or has no solution -> 0.0 with the error as the note: broken code is a failure
          2. A test that raises counts as failed, and the other tests still run
        """
        namespace = {}
        try:
            exec(output, namespace)                               # Step 1: demo only; a real harness sandboxes this
            solution = namespace["solution"]
        except Exception as e:                                    # Edge 1
            return Score(self.dimension, 0.0, f"does not load: {e}")
        passed = sum(1 for args, want in case.tests if self._passes(solution, args, want))   # Step 2
        return Score(self.dimension, passed / len(case.tests), f"{passed}/{len(case.tests)} tests")   # Step 3
''')

CODE_HELPERS = method('''
    def applies(self, case: Case) -> bool:
        return len(case.tests) > 0                                # no tests, nothing to run

    def _passes(self, solution, args: tuple, want) -> bool:
        try:
            return solution(*args) == want
        except Exception:                                         # Edge 2: this test fails, the rest go on
            return False
''')

SUMMARY = method('''
    def summary(self) -> dict:
        """
        Core logic:
          1. Group every score by its dimension
          2. For each dimension, count the known scores and the Unknown ones
          3. The mean of the known ones; None when none are known
        Edge cases:
          1. Unknown is left out of the mean, never counted as 0 or 1, and it is counted so the report shows how much was left out
          2. A dimension with only Unknown scores -> mean None
        """
        by_dim = {}
        for case_scores in self.scores.values():                  # Step 1
            for score in case_scores:
                by_dim.setdefault(score.dimension, []).append(score)
        stats = {}
        for dim in sorted(by_dim):                                # sorted: a stable order in every printout
            known = [s.value for s in by_dim[dim] if s.is_known()]
            mean = sum(known) / len(known) if known else None     # Step 3 + Edge 2
            stats[dim] = DimStats(mean, len(known), len(by_dim[dim]) - len(known))   # Step 2 + Edge 1
        return stats
''')

REPORT_HELPERS = method('''
    def baseline(self) -> dict:
        """What to store for the next comparison: each dimension's mean, leaving out the ones with no known score."""
        return {dim: stats.mean for dim, stats in self.summary().items() if stats.mean is not None}

    def lines(self) -> list:
        return [f"{dim}: {stats.line()}" for dim, stats in self.summary().items()]
''')

HEAD = D('''\
    import json
    from dataclasses import dataclass


    class EvalError(Exception):        # one error type for a suite that can't be run
        pass


    @dataclass(frozen=True)
    class Case:
        """One test: a prompt for the system, and what a good answer looks like."""
        id: str
        prompt: str
        expected: str | None = None    # the reference answer, for ExactMatch
        tests: tuple = ()              # (args, result) pairs, for CodeCheck


    @dataclass(frozen=True)
    class Score:
        """How one grader rated one output on one dimension."""
        dimension: str
        value: float | None            # 0.0 to 1.0, or None: the grader could not tell
        note: str = ""                 # why, for whoever reads the report

        def is_known(self) -> bool:
            return self.value is not None


    @dataclass(frozen=True)
    class DimStats:
        """One dimension across the suite: its mean and how many scores it rests on."""
        mean: float | None             # None when every score was Unknown
        known: int
        unknown: int                   # shown, so a mean over 3 of 40 cases can't pass for a mean over 40

        def line(self) -> str:
            mean = "n/a" if self.mean is None else f"{self.mean:.2f}"
            return f"{mean} ({self.known} known, {self.unknown} unknown)"


    @dataclass(frozen=True)
    class Regression:
        """A dimension that got worse since the baseline."""
        dimension: str
        before: float
        after: float | None            # None: it can no longer be measured

        def line(self) -> str:
            now = "unmeasured" if self.after is None else f"{self.after:.2f}"
            return f"{self.dimension} fell from {self.before:.2f} to {now}"
    ''')

EXACT = D('''\


    class ExactMatch:
        """Scores 1.0 when the output equals the reference, ignoring case and outer spaces."""

        def __init__(self, dimension: str = "correctness"):
            self.dimension = dimension       # every grader names the dimension it scores

        def applies(self, case: Case) -> bool:
            return case.expected is not None

        def grade(self, case: Case, output: str) -> Score:
            same = output.strip().lower() == case.expected.strip().lower()
            return Score(self.dimension, 1.0 if same else 0.0)
    ''')

JUDGE = D('''\


    class RubricJudge:
        """Scores against a written rubric, using a judge model."""

        def __init__(self, dimension: str, rubric: str, judge):
            self.dimension = dimension
            self.rubric = rubric             # what a 5 looks like, in words
            self.judge = judge               # anything with rate(prompt) -> text; a fake in the demo

        def applies(self, case: Case) -> bool:
            return True                      # a rubric needs no reference answer
    ''')

CODE = D('''\


    class CodeCheck:
        """Runs the output as code and checks it against the case's tests."""

        def __init__(self, dimension: str = "code"):
            self.dimension = dimension
    ''')

REPORT = D('''\


    class Report:
        """The scores of one run, by case, and what they add up to."""

        def __init__(self, scores: dict):
            self.scores = scores             # case id -> list of Score
    ''')

HARNESS = D('''\


    class EvalHarness:
        """The entry point: runs a suite against a system, builds a Report, compares it with a baseline."""

        def __init__(self, graders: list, tolerance: float = 0.05):
            self.graders = graders           # run_suite only asks each one applies() and grade()
            self.tolerance = tolerance       # how far a mean may fall before it is a regression
    ''')

CORE = (HEAD + EXACT + JUDGE + in_class(JUDGE_GRADE) + CODE + in_class(CODE_GRADE, CODE_HELPERS)
        + REPORT + in_class(SUMMARY, REPORT_HELPERS)
        + HARNESS + in_class(RUN_SUITE, RUN_CASE, COMPARE, HARNESS_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    class FakeJudge:
        """A stand-in for a judge model with no network: it rates by the answer it is shown."""
        replies = {"Paris": "5", "Lima": "4", "Light scatters in air": "unsure"}

        def rate(self, prompt: str) -> str:
            answer = prompt.split("Answer: ", 1)[1].split("\\n")[0]
            return self.replies.get(answer, "3")


    CASES = [Case("capital-fr", "Capital of France?", expected="Paris"),
             Case("capital-pe", "Capital of Peru?", expected="Lima"),
             Case("double", "Write solution(x) that doubles x", tests=(((2,), 4), ((5,), 10))),
             Case("sky", "Why is the sky blue?"),
             Case("summary", "Summarize this report")]

    v1 = {"Capital of France?": "Paris", "Capital of Peru?": "Lima", "Write solution(x) that doubles x": "def solution(x):\\n    return x * 2",
          "Why is the sky blue?": "Light scatters in air", "Summarize this report": "A short summary"}
    v2 = dict(v1, **{"Capital of Peru?": "Cusco", "Write solution(x) that doubles x": "def solution(x):\\n    return x + 2"})


    def system_v1(prompt: str) -> str:
        return v1[prompt]


    def system_v2(prompt: str) -> str:
        if prompt == "Summarize this report":
            raise RuntimeError("timeout")                 # the new system crashes on one case
        return v2[prompt]


    harness = EvalHarness([ExactMatch("correctness"), CodeCheck("code"), RubricJudge("helpfulness", "Is the answer useful?", FakeJudge())])
    first = harness.run_suite(CASES, system_v1)
    print("\\n".join(first.lines()))
    stored = json.dumps(first.baseline())                 # what a nightly job would save
    print(stored)
    second = harness.run_suite(CASES, system_v2)
    print("\\n".join(second.lines()))
    for r in harness.compare(second, json.loads(stored)):
        print(r.line())
    print(harness.compare(first, json.loads(stored)))     # the same system against its own baseline: nothing
    print(second.scores["summary"][0].note)
    for bad in ([], [CASES[0], CASES[0]]):
        try:
            harness.run_suite(bad, system_v1)
        except EvalError as e:
            print(e)
    ''')
DEMO_OUT = 'code: 1.00 (1 known, 0 unknown)\ncorrectness: 1.00 (2 known, 0 unknown)\nhelpfulness: 0.69 (4 known, 1 unknown)\n{"code": 1.0, "correctness": 1.0, "helpfulness": 0.6875}\ncode: 0.50 (1 known, 0 unknown)\ncorrectness: 0.50 (2 known, 0 unknown)\nhelpfulness: 0.50 (4 known, 1 unknown)\ncode fell from 1.00 to 0.50\ncorrectness fell from 1.00 to 0.50\nhelpfulness fell from 0.69 to 0.50\n[]\nsystem error: timeout\nempty suite\ntwo cases share an id\n'

# ---- extensions ----
EXT_CALIBRATE = D('''\
    class EvalHarness:
        def calibrate(self, report: Report, labels: dict, dimension: str) -> dict:
            """How far a judge's scores are from human labels (case id -> 0.0 to 1.0)."""
            gaps, unknown = [], 0
            for case_id, case_scores in report.scores.items():
                for score in case_scores:
                    if score.dimension != dimension or case_id not in labels:
                        continue
                    if score.is_known():
                        gaps.append(abs(score.value - labels[case_id]))
                    else:
                        unknown += 1                  # the judge could not tell: counted, not guessed
            mean_gap = sum(gaps) / len(gaps) if gaps else None
            return {"labelled": len(gaps) + unknown, "unknown": unknown, "mean_gap": mean_gap}
    ''')

EXT_FLAKY = D('''\
    class EvalHarness:
        def _run_case(self, case: Case, system, reruns: int = 3) -> list:
            runs = [self._run_once(case, system) for _ in range(reruns)]   # the old _run_case, renamed
            return self._median_scores(runs)       # the median per dimension; Unknown if most reruns were Unknown

        def _median_scores(self, runs: list) -> list:
            merged = []
            for i, first in enumerate(runs[0]):
                values = sorted(r[i].value for r in runs if r[i].value is not None)
                if len(values) * 2 <= len(runs):   # fewer than half the reruns gave a number
                    merged.append(Score(first.dimension, None, "mostly unknown across reruns"))
                else:
                    flaky = values[-1] - values[0] > 0.5       # the reruns disagree a lot: say so in the note
                    merged.append(Score(first.dimension, values[len(values) // 2], "flaky" if flaky else first.note))
            return merged
    ''')

EXT_PARALLEL = D('''\
    from concurrent.futures import ThreadPoolExecutor


    class EvalHarness:
        def run_suite(self, cases: list, system, workers: int = 4) -> Report:
            self._check_suite(cases)
            with ThreadPoolExecutor(max_workers=workers) as pool:
                # cases are independent and map keeps their order, so the report is the same as a serial run
                results = list(pool.map(lambda case: self._run_case(case, system), cases))
            return Report({case.id: scores for case, scores in zip(cases, results)})
    ''')

EXT_NEW_GRADER = D('''\
    class LengthLimit:
        """A new kind of grader. run_suite is not edited: it only calls applies() and grade()."""

        def __init__(self, max_chars: int, dimension: str = "concise"):
            self.dimension = dimension
            self.max_chars = max_chars

        def applies(self, case: Case) -> bool:
            return True

        def grade(self, case: Case, output: str) -> Score:
            return Score(self.dimension, 1.0 if len(output) <= self.max_chars else 0.0, f"{len(output)} chars")


    harness.graders.append(LengthLimit(40))        # the whole change
    ''')

# the final file: core + a new grader (LengthLimit) + judge calibration
LENGTH = D('''\


    class LengthLimit:
        """A grader added later. EvalHarness is not edited: it only calls applies() and grade()."""

        def __init__(self, max_chars: int, dimension: str = "concise"):
            self.dimension = dimension
            self.max_chars = max_chars

        def applies(self, case: Case) -> bool:
            return True

        def grade(self, case: Case, output: str) -> Score:
            return Score(self.dimension, 1.0 if len(output) <= self.max_chars else 0.0, f"{len(output)} chars")
    ''')

CALIBRATE = method('''
    def calibrate(self, report: Report, labels: dict, dimension: str) -> dict:
        """How far a judge's scores are from human labels (case id -> 0.0 to 1.0)."""
        gaps, unknown = [], 0
        for case_id, case_scores in report.scores.items():
            for score in case_scores:
                if score.dimension != dimension or case_id not in labels:
                    continue
                if score.is_known():
                    gaps.append(abs(score.value - labels[case_id]))
                else:
                    unknown += 1                          # the judge could not tell: counted, not guessed
        mean_gap = sum(gaps) / len(gaps) if gaps else None
        return {"labelled": len(gaps) + unknown, "unknown": unknown, "mean_gap": mean_gap}
''')

FINAL = (HEAD + EXACT + JUDGE + in_class(JUDGE_GRADE) + CODE + in_class(CODE_GRADE, CODE_HELPERS) + LENGTH
         + REPORT + in_class(SUMMARY, REPORT_HELPERS)
         + HARNESS + in_class(RUN_SUITE, RUN_CASE, COMPARE, CALIBRATE, HARNESS_HELPERS))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    class FakeJudge:
        replies = {"Paris": "5", "Lima": "4", "Light scatters in air": "unsure"}

        def rate(self, prompt: str) -> str:
            answer = prompt.split("Answer: ", 1)[1].split("\\n")[0]
            return self.replies.get(answer, "3")


    CASES = [Case("capital-fr", "Capital of France?", expected="Paris"),
             Case("capital-pe", "Capital of Peru?", expected="Lima"),
             Case("sky", "Why is the sky blue?")]
    answers = {"Capital of France?": "Paris", "Capital of Peru?": "Lima", "Why is the sky blue?": "Light scatters in air"}

    harness = EvalHarness([RubricJudge("helpfulness", "Is the answer useful?", FakeJudge())])
    harness.graders.append(LengthLimit(10))                # a new dimension, with no edit to run_suite
    report = harness.run_suite(CASES, lambda prompt: answers[prompt])
    print("\\n".join(report.lines()))
    humans = {"capital-fr": 1.0, "capital-pe": 0.5, "sky": 0.75}     # what people gave the same answers
    print(harness.calibrate(report, humans, "helpfulness"))
    ''')
FINAL_OUT = "concise: 0.67 (3 known, 0 unknown)\nhelpfulness: 0.88 (2 known, 1 unknown)\n{'labelled': 3, 'unknown': 1, 'mean_gap': 0.125}\n"


PROBLEM = {
    "id": "evalharness", "title": "An evaluation harness with rubric graders", "part_id": "lld-evalharness", "n": 2,
    "part_title": "Eval harness: cases, graders, a report", "minutes": 45,
    "lead": "An evaluation-harness round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. The system under test and the judge are fakes, so a run is deterministic. Implementation starts with run_suite(), names _run_case before writing it, and keeps the system's crash (a zero) apart from a grader's crash (Unknown).",
    "prompt": "Design an evaluation harness: run a suite of cases against a system, score each answer, and report whether the system got better or worse.",
    "evidence": "Not reported for Mercor's onsite; written because the Enterprise role builds and evaluates agents (Mercor's brief, the posting).",
    "drill": "part 2, Eval harness.",

    "clarify": {
        "capabilities": [("What is a case?", "A prompt, plus a reference answer, or tests for code, or neither"),
                         ("What kinds of grader?", "Exact match, a rubric judged by a model, and a code check that runs tests"),
                         ("What does the report hold?", "A score per dimension, such as correctness, code and helpfulness, averaged over the suite")],
        "errors": [("A grader can't tell, such as a judge that says 'unsure'?", "That is Unknown: not 0 and not 1, left out of the mean and counted"),
                   ("The system under test crashes on a case?", "The case scores 0.0 on every dimension that applies to it"),
                   ("The grader itself crashes?", "Unknown: that says nothing about the system")],
        "scope": [("How do we know it got worse?", "Compare the report with a stored baseline, one mean per dimension, with a tolerance"),
                  ("A real model, a database, a UI?", "No: the system and the judge are anything callable; the baseline is a dict that can be saved as JSON"),
                  ("Reruns, human labels, parallel runs?", "Follow-ups")],
    },
    "clarify_hint": "What a case is, which graders, what the report shows. A grader that can't tell, a system that crashes, a grader that crashes. Regression against a baseline, and what is out of scope.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** I ask what a case holds and which graders exist, because that decides the classes. Then the three failures: a grader that can't tell, a system that crashes, a grader that crashes. Those are three different outcomes, and getting them right is most of the design.",
    "clarify_why": "Every question changes a class or a rule. Three grader kinds give three grader classes, 'can't tell' gives Score an Unknown, and the two crashes give _run_case its split between 0.0 and Unknown. The baseline question gives compare.",
    "answers": "A case is a prompt with a reference answer, or tests for code, or neither. Three graders: exact match, a rubric scored by a judge model, and a code check that runs tests. Each grader scores one dimension from 0.0 to 1.0, or Unknown when it can't tell. Unknown is left out of the mean and counted. A system crash scores 0.0; a grader crash is Unknown. The report averages per dimension. A comparison with a stored baseline flags any dimension that fell by more than a tolerance. The system and the judge are fakes. Reruns, human labels and parallel runs are follow-ups.",
    "playback": ["Thanks, that's clear. **So: cases, three kinds of grader, scores that can be Unknown, a report with a mean per dimension, and a comparison with a stored baseline.** A system crash is a zero, a grader crash is Unknown. Out of scope: a real model, a UI, reruns, human labels, parallel runs."],

    "requirements": [
        ["A caller runs a suite of cases against a system.", "Each case goes to the system, and every grader that applies scores the answer", "An error for an empty suite or two cases with one id"],
        ["A grader scores one dimension.", "Exact match compares to the reference, a rubric judge asks a model, a code check runs tests", "A score is 0.0 to 1.0, or Unknown when the grader can't tell"],
        ["A failure is scored by who failed.", "If the system crashes, the case scores 0.0 on each dimension that applies", "If a grader crashes, that score is Unknown"],
        ["The caller reads a report.", "A mean per dimension over the known scores, with the number known and the number Unknown"],
        ["The caller compares a report with a stored baseline.", "Any dimension whose mean fell by more than the tolerance is flagged", "A dimension that can no longer be measured is flagged too"],
    ],
    "out_of_scope": ["a real model or API", "a UI or storage", "reruns and flaky cases", "human labels", "parallel runs"],
    "req_hint": "Running a suite, what a grader returns, the two kinds of crash, the report, the comparison.",
    "req_say": "From your answers I get five requirements. **Each becomes a method: run_suite, grade, _run_case, summary, compare.** Requirement 3 is the one to say out loud: if the system crashes it failed, so zero; if the grader crashes, we failed, so Unknown.",
    "req_why": "1 is run_suite, 2 is the three grade methods, 3 is _run_case and _safe_grade, 4 is Report.summary, 5 is compare. Unknown in 2 is what makes 3 and 4 honest.",

    "entities": [("Eval harness", True, "The entry point: runs a suite, builds a report, compares reports"),
                 ("Case", True, "A prompt, a reference answer or tests; the graders read what they need from it"),
                 ("Grader (exact, rubric, code)", True, "Scores one dimension; each decides whether it applies to a case"),
                 ("Score", True, "A value or Unknown, with a note; it knows whether it is known"),
                 ("Report", True, "The scores by case, and the mean per dimension"),
                 ("Dimension stats", True, "A mean with its known and Unknown counts; it prints itself"),
                 ("Regression", True, "A dimension that fell, from what to what; it prints itself"),
                 ("Suite", False, "A list of cases; nothing to add"),
                 ("Baseline", False, "A dict of dimension to mean; the report makes it, the harness reads it"),
                 ("System under test, judge model", False, "External: anything callable, not our classes"),
                 ("Dimension", False, "A string; the graders name it")],
    "ent_hint": "What decides how a case is scored? What has to be remembered between two runs? Which nouns are only a string or a list?",
    "ent_say": "I underline the nouns. **The harness, case, graders, score and report stay,** and so do the two small records that print themselves. A suite is a list, a dimension is a string, and the baseline is a dict, so none of those need a class.",
    "ent_why": "Score earns its class because Unknown is a rule: it must stay out of the mean and still be counted. Each grader is a class because each reads a different part of the Case and decides for itself whether it applies.",

    "classes": [
        {"name": "EvalHarness", "state": ["graders: Grader[]  # run_suite asks each if it applies, then grades",
                                          "tolerance: float  # how far a mean may fall before it is a regression"],
         "behaviour": ["run_suite(cases, system) -> Report | error  # req 1",
                       "_run_case(case, system) -> Score[]  # req 3: crash of system vs crash of grader",
                       "compare(report, baseline) -> Regression[]  # req 5",
                       "_safe_grade(grader, case, output) -> Score  # a grader crash is Unknown",
                       "_check_suite(cases) -> void | error  # empty or repeated ids"]},
        {"name": "ExactMatch", "state": ["dimension: string  # what it scores"],
         "behaviour": ["applies(case) -> bool  # the case has a reference answer",
                       "grade(case, output) -> Score  # 1.0 or 0.0"]},
        {"name": "RubricJudge", "state": ["dimension: string", "rubric: string  # what a 5 looks like",
                                          "judge: object with rate(prompt)  # a model, or a fake"],
         "behaviour": ["applies(case) -> bool  # always",
                       "grade(case, output) -> Score  # req 2: 1 to 5 becomes 0.0 to 1.0, else Unknown"]},
        {"name": "CodeCheck", "state": ["dimension: string"],
         "behaviour": ["applies(case) -> bool  # the case has tests",
                       "grade(case, output) -> Score  # req 2: the share of tests that pass"]},
        {"name": "Report", "state": ["scores: dict case id -> Score[]  # one entry for every case, even with no scores"],
         "behaviour": ["summary() -> dict dimension -> DimStats  # req 4",
                       "baseline() -> dict dimension -> mean  # what to store",
                       "lines() -> string[]  # to print"]},
        {"name": "Score", "state": ["dimension: string", "value: float | None  # None is Unknown", "note: string  # why"],
         "behaviour": ["is_known() -> bool  # summary leaves Unknown out of the mean"]},
        {"name": "Case, DimStats, Regression", "state": ["Case: id, prompt, expected, tests", "DimStats: mean, known, unknown",
                                                          "Regression: dimension, before, after"],
         "behaviour": ["line() -> string  # DimStats and Regression print themselves"]},
    ],
    "class_hint": "The harness holds graders. Each grader holds its dimension and what it needs to score. A Score is a value that may be Unknown. The report holds scores by case.",
    "class_say": "**I start from the methods and ask what each one has to read.** run_suite loops over cases and graders, so the harness keeps the grader list. Aggregating needs every score with its dimension and whether it is known, which is why Score has an Unknown. And compare needs a mean per dimension, so the report computes it, and the harness only reads it.",
    "class_why": "The harness orchestrates and never looks at what kind of grader it has: each grader says if it applies and grades. The report owns aggregation. Score owns 'known or not'. That keeps run_suite short, and a new grader needs no edit to it.",
    "class_qa": [{"ask": "Why is Unknown left out of the mean and not counted as zero?",
                  "say": "Because a zero says the system was wrong, and Unknown says we don't know. **Counting it as zero punishes the system for the judge's doubt, and counting it as one hides real failures.** So the mean uses the known scores, and the report prints how many were Unknown.",
                  "explain": ["DimStats.known and DimStats.unknown are shown beside the mean."]},
                 {"ask": "Why does a grader decide if it applies, and not the harness?",
                  "say": "Because each grader knows what it needs from a Case. **ExactMatch needs a reference, CodeCheck needs tests, a rubric needs nothing.** If run_suite checked kinds, every new grader would mean editing it."}],

    "map": {"center": ("EvalHarness", "run_suite, compare"),
            "owned": [("Graders", "ExactMatch, RubricJudge"), ("Report", "scores, summary")],
            "uses": [("Score", "value or Unknown"), ("Values", "Case, DimStats, Regression")]},

    "skeleton": {"q": "First the small pieces: the error, the values, the three graders' __init__ (and applies for the first two), the report's __init__, and the harness's __init__.",
                 "hint": "Case, Score, DimStats and Regression are frozen dataclasses. ExactMatch needs a reference. RubricJudge holds a rubric and a judge. The report holds scores by case. The harness holds the graders and a tolerance.",
                 "code": HEAD + EXACT + JUDGE + CODE + REPORT + HARNESS,
                 "why": "These come straight from the - state lines. ExactMatch is complete here because it is three lines. The grading of the other two, and the aggregation, get their own boxes."},
    "methods": [
        {"name": "run_suite", "q": "Start with the most interesting public method: run_suite(cases, system). Core logic and edge cases as comments, then the code. Name the hard part as a helper.",
         "hint": "Check the suite. For each case, scores[case.id] = self._run_case(case, system). Return a Report of the scores.",
         "code": RUN_SUITE,
         "why": "Five lines of real work. Where the two kinds of failure are told apart is the hard part, so it gets a name here and its own method next."},
        {"name": "_run_case", "q": "_run_case(case, system): run one case and score it. What if the system raises? What if a grader raises?",
         "hint": "The applicable graders first. Call the system; if it raises, 0.0 on each applicable dimension. Otherwise each grader grades, through a safe wrapper.",
         "code": RUN_CASE,
         "why": "Two crashes, two outcomes. The system failing the case is a zero. A grader failing is Unknown, because it says nothing about the system."},
        {"name": "compare", "q": "compare(report, baseline): which dimensions got worse?",
         "hint": "The report's mean for each baseline dimension. Flag a fall of more than the tolerance, and flag a dimension that can no longer be measured.",
         "code": COMPARE,
         "why": "A lost dimension is flagged because silence would hide it. A new dimension is not a regression. The round() makes the tolerance check exact for decimals like 0.8 and 0.75."},
        {"name": "RubricJudge.grade", "q": "RubricJudge.grade(case, output): ask the judge and turn the reply into a Score.",
         "hint": "Build a prompt from the rubric, question and answer. A whole number 1 to 5 becomes 0.0 to 1.0. Anything else is Unknown, with the reply as the note.",
         "code": JUDGE_GRADE,
         "why": "This is where Unknown comes from. A number out of range is Unknown too: clamping it would invent a score the judge never gave."},
        {"name": "CodeCheck.grade", "q": "CodeCheck.grade(case, output): run the output as code against the case's tests.",
         "hint": "Load solution from the output. The score is the share of tests that pass. A load failure is 0.0, a raising test is a failed test.",
         "code": CODE_GRADE,
         "why": "Broken code is a failure of the system, so 0.0, not Unknown. The exec is for the demo only; a real harness runs it in a sandbox with a timeout."},
        {"name": "Report.summary", "q": "Report.summary(): the mean per dimension, with how many scores were known and Unknown.",
         "hint": "Group scores by dimension. Mean of the known values, None if there are none. Count the Unknown ones.",
         "code": SUMMARY,
         "why": "Unknown is out of the mean and in the count. Sorting the dimensions keeps every printout in the same order."},
    ],
    "helpers": [
        {"q": "The harness's helpers: _safe_grade and _check_suite.",
         "hint": "Catch a grader's exception and return an Unknown score. Refuse an empty suite and repeated ids.",
         "code": HARNESS_HELPERS,
         "why": "_safe_grade is the only place a grader's crash is caught, so it can only become Unknown. The suite checks run before any call to the system."},
        {"q": "CodeCheck's helpers (applies, _passes) and the report's (baseline, lines).",
         "hint": "A code check applies when the case has tests. One test passes or raises. The baseline is the mean per dimension, leaving out any with no known score.",
         "code": CODE_HELPERS + "\n" + REPORT_HELPERS,
         "why": "baseline() leaves out an unmeasured dimension, so the stored file only ever holds numbers that were real."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "A grader scores one dimension, the report aggregates, the harness orchestrates and compares."),
            ("Open/closed", "A new grader is a new class with applies and grade. run_suite is not edited."),
            ("Liskov substitution", "Any object with dimension, applies and grade can sit in the grader list, and a fake judge can replace a real one."),
            ("Interface segregation", "run_suite needs only applies and grade from a grader, and rate from a judge."),
            ("Dependency inversion", "The harness depends on the shape of a grader, not on the three classes. The system and the judge are passed in."),
        ],
        "varies": [
            ("The kind of grader", "Strategy: already there as the grader list", "today ExactMatch, RubricJudge and CodeCheck"),
            ("How scores are aggregated (mean, median, worst case)", "Strategy, if asked", "today one mean in Report.summary"),
            ("The judge model", "Duck typing, as for the system", "rate(prompt) returns text"),
            ("Running cases at the same time", "No pattern: a thread pool", "one line in run_suite"),
        ],
    },
    "extensions": [
        {"ask": "How do you know the judge can be trusted?",
         "say": "I compare its scores with human labels on the same cases. **A calibrate method returns the mean gap and how many cases the judge left Unknown,** so a judge that is close on 5 cases but unsure on 30 doesn't look good. If the gap is large, the rubric needs rewriting before any score is believed.",
         "code": EXT_CALIBRATE, "code_title": "Judge calibration",
         "short_q": "Trust the judge", "short_a": "calibrate: mean gap to human labels, plus the Unknown count"},
        {"ask": "Some cases are flaky: the same system gets different scores.",
         "say": "Run each case a few times and keep the median per dimension. **The case is marked flaky when the reruns disagree by more than a set amount,** so a flaky case can't cause a regression by itself. The rerun count is a parameter, and reruns cost money, so only flaky cases are rerun.",
         "code": EXT_FLAKY, "code_title": "Reruns and flaky cases",
         "short_q": "Flaky cases", "short_a": "rerun, take the median, mark flaky when reruns disagree"},
        {"ask": "The suite has 2,000 cases and the system is slow.",
         "say": "Cases are independent, so run them in a thread pool. **map keeps the order, so the report is identical to a serial run.** The limit is the judge model's rate limit, so the worker count is a parameter.",
         "code": EXT_PARALLEL, "code_title": "Parallel runs",
         "short_q": "Parallel runs", "short_a": "thread pool mapped over cases; map keeps the order; workers limited by the judge's rate limit"},
        {"ask": "Add a new grader, like a length limit, without changing run_suite.",
         "say": "A new class with a dimension, applies and grade, appended to the harness's grader list. **run_suite only calls applies and grade, so it is not edited,** and the report gets a new dimension automatically.",
         "code": EXT_NEW_GRADER, "code_title": "A new grader",
         "short_q": "New grader type", "short_a": "a class with dimension, applies, grade; append to graders; run_suite unchanged"},
    ],
    "faq": [("Why is a system crash 0.0 and a grader crash Unknown?", "Because of who failed. A system that raises on a case did not produce an answer. A grader that raises says nothing about the answer, so claiming a zero would blame the system for our bug."),
            ("Why a tolerance on regressions?", "Scores move a little between runs, mostly from judge noise. Flagging every small fall would train people to ignore the flag."),
            ("Why exec the output of the system?", "The demo is offline, with a fake system. A real harness runs generated code in a subprocess or a container with a timeout and no network."),
            ("What is the stdlib shortcut for the mean?", "statistics.mean. The loop is written out so Unknown is visibly left out.")],

    "summary": ["**One entry class, three graders and a report.** EvalHarness runs each case against the system and asks every grader whether it applies. A system crash scores 0.0, and a grader crash or a judge that can't tell is Unknown, which stays out of the mean and is counted. The Report gives a mean per dimension, and compare flags any dimension that fell by more than the tolerance against a stored baseline.",
                "**It extends in one place each time:** calibrating a judge is one method on the harness, reruns wrap _run_case, parallel runs are a thread pool in run_suite, and a new grader is a new class in the list."],

    "apart": [
        "**A crash in the system scores 0; a crash in the grader is Unknown.** One is the system failing, the other is you not knowing.",
        "**Unknown is left out of the mean and counted in the report,** so it never hides as a pass or a fail.",
        "**Each grader says whether it applies and grades;** run_suite never checks kinds, so a new grader is a new class.",
        "**Compare against a stored baseline,** and flag a dimension that can no longer be measured as a regression too."
    ],
    "golden": [
        ("A system crash scores 0.0 and a grader crash is Unknown.", "it blames the right party: the system for its failure, never the system for ours."),
        ("Unknown is left out of the mean and counted in the report.", "a zero would punish the system for doubt, and hiding the count would make a small sample look big."),
        ("run_suite reads like the description of a run, and names _run_case.", "the loop says the rule out loud and the hard part has one place."),
        ("Each grader says if it applies and grades; run_suite never checks kinds.", "a new grader type is a new class, not an edit."),
        ("A dimension that can no longer be measured is flagged by compare.", "silence would hide a lost measurement."),
        ("The system and the judge are fakes, so a run is the same every time.", "you can check the report by hand."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with two extensions applied (a new grader type, judge calibration), and a run at the bottom.",
    "final_title": "eval_harness.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "the new grader adds a concise dimension with no edit to run_suite (two short answers pass, the long one fails); helpfulness rests on 2 known scores and 1 Unknown; calibration against the human labels gives a mean gap of 0.125 over 2 known scores, and counts the Unknown one.",
}
