"""Agent runtime. A drill in the elevator shape: Agent, ToolRegistry, Tool, Budget, and three small values (Action, Event, RunResult).
run() is the loop; _execute_tool validates, then _call_with_retries owns the retry cap. The model is a fake in the demo."""
import textwrap

D = textwrap.dedent


def method(src):
    return D(src).strip("\n") + "\n"


def in_class(*methods):
    return "".join("\n" + textwrap.indent(m, "    ") for m in methods)


# ---- the agent: the loop ----
RUN = method('''
    def run(self, task: str) -> RunResult:
        """
        Core logic:
          1. Start a Budget, a history holding the task, and an empty trace
          2. While there is budget left, ask the model for its next action
          3. A final answer ends the run
          4. A tool call is executed, and what came back goes into the history
          5. Out of budget: stop, and say which limit
        Edge cases:
          1. max_steps of 0 -> the model is never called
          2. A tool error is text for the model, not an exception, so the run goes on and the model can fix its call
          3. A call's cost is known only after it, so cost can overshoot by one call; steps cannot
        """
        budget = Budget(self.max_steps, self.max_cost)
        history = [("user", task)]                                # Step 1: (role, text) pairs are all the model sees
        trace = []
        while self._within_budget(budget, trace):                 # Edge 1: checked before every model call
            action = self._next_action(history, budget, trace)    # Step 2: one model call, charged to the budget
            if action.is_final():                                 # Step 3
                trace.append(Event(budget.steps, "final", action.answer))
                return RunResult("done", action.answer, trace)
            observation = self._execute_tool(action, budget, trace)   # Step 4: the hard part, named now, written next
            history.append(("assistant", f"{action.tool} {action.args}"))
            history.append(("tool", observation))                 # Edge 2: the model reads errors here
        return RunResult("out_of_" + budget.exhausted(), None, trace)    # Step 5: "out_of_steps" or "out_of_cost"
''')

EXECUTE_TOOL = method('''
    def _execute_tool(self, action: Action, budget: Budget, trace: list) -> str:
        """
        Core logic:
          1. Look up the tool and validate the arguments
          2. Call it, with retries
          3. Return the result as text for the model
        Edge cases:
          1. Unknown tool or bad arguments -> an error observation, never retried: the same call would fail again
          2. The tool still fails after its retries -> an error observation, and the run goes on
        """
        try:
            tool = self.registry.get(action.tool)                 # Step 1: unknown name raises AgentError
            tool.validate(action.args)                            # Step 1: so does a wrong argument
        except AgentError as e:                                   # Edge 1: a bad call is the model's mistake, not the tool's
            trace.append(Event(budget.steps, "error", str(e)))
            return f"error: {e}"
        return self._call_with_retries(tool, action.args, budget, trace)   # Step 2: the retry cap lives there
''')

CALL_RETRIES = method('''
    def _call_with_retries(self, tool: Tool, args: dict, budget: Budget, trace: list) -> str:
        """
        Core logic:
          1. Try the call, at most 1 + max_retries times in all
          2. It works: record it and return the result
          3. It fails and attempts remain: record a retry and go round again
          4. The last attempt fails: record an error and return it as text
        Edge cases:
          1. max_retries of 0 -> exactly one attempt
          2. Retries use no model calls and no budget steps: they are attempts at one tool call
        """
        attempts = 1 + self.max_retries
        for attempt in range(1, attempts + 1):                    # Step 1
            try:
                result = str(tool.fn(**args))
            except Exception as e:                                # any failure inside the tool; bad arguments never reach here
                if attempt < attempts:                            # Step 3: the cap is the attempts count, so it always ends
                    trace.append(Event(budget.steps, "retry", f"{tool.name} attempt {attempt} failed: {e}"))
                    continue
                trace.append(Event(budget.steps, "error", f"{tool.name} failed after {attempts} attempts: {e}"))
                return f"error: {tool.name} failed: {e}"          # Step 4: the model decides what to do about it
            trace.append(Event(budget.steps, "tool", f"{tool.name} -> {result}"))
            return result                                         # Step 2
''')

AGENT_HELPERS = method('''
    def _within_budget(self, budget: Budget, trace: list) -> bool:
        reason = budget.exhausted()
        if reason is not None:                                    # record why the run stopped, once
            trace.append(Event(budget.steps, "stop", f"out of {reason}"))
        return reason is None

    def _next_action(self, history: list, budget: Budget, trace: list) -> Action:
        action = self.model.next(list(history))                   # a copy, so the model can't edit our history
        budget.charge(action.cost)                                # every model call is a step and has a cost
        what = action.answer if action.is_final() else f"{action.tool} {action.args}"
        trace.append(Event(budget.steps, "model", what))
        return action
''')

# ---- the tool: typed arguments ----
VALIDATE = method('''
    def validate(self, args: dict) -> None:
        """
        Core logic:
          1. Every declared parameter must be present
          2. Every given argument must be declared
          3. Each value must have exactly the declared type
        Edge cases:
          1. A bool for an int parameter -> error: in Python True is an int, so compare types exactly
          2. A string "3" for an int -> error: the model must fix its call, we don't guess
        """
        for name in self.params:                                  # Step 1
            if name not in args:
                raise AgentError(f"{self.name}: missing {name}")
        for name, value in args.items():
            if name not in self.params:                           # Step 2
                raise AgentError(f"{self.name}: unexpected {name}")
            if type(value) is not self.params[name]:              # Step 3 + Edge 1: exact type, not isinstance
                raise AgentError(f"{self.name}: {name} must be {self.params[name].__name__}")
''')

HEAD = D('''\
    from dataclasses import dataclass, field


    class AgentError(Exception):       # a bad call, reported back to the model as text; never a crash
        pass


    @dataclass(frozen=True)
    class Action:
        """What the model wants next: call a tool, or give the final answer."""
        tool: str | None = None
        args: dict = field(default_factory=dict)
        answer: str | None = None
        cost: int = 0                  # what this model call cost, in cost units

        def is_final(self) -> bool:
            return self.answer is not None


    @dataclass(frozen=True)
    class Event:
        """One line of the trace: which step, what kind of thing, and the detail."""
        step: int
        kind: str                      # "model", "tool", "retry", "error", "stop" or "final"
        detail: str

        def line(self) -> str:
            return f"{self.step} {self.kind}: {self.detail}"


    @dataclass(frozen=True)
    class RunResult:
        """How a run ended, with its answer (None unless it finished) and the whole trace."""
        status: str                    # "done", "out_of_steps" or "out_of_cost"
        answer: str | None
        trace: list

        def ok(self) -> bool:
            return self.status == "done"
    ''')

BUDGET = D('''\


    class Budget:
        """What one run may still spend. A new one per run, so runs never share a count."""

        def __init__(self, max_steps: int, max_cost: int):
            self.max_steps = max_steps       # model calls allowed
            self.max_cost = max_cost         # cost units allowed
            self.steps = 0
            self.cost = 0

        def charge(self, cost: int) -> None:
            self.steps += 1                  # one model call
            self.cost += cost

        def exhausted(self) -> str | None:
            """Which limit is reached, 'steps' or 'cost', else None. Steps first, so a tie reads the same every run."""
            if self.steps >= self.max_steps:
                return "steps"
            if self.cost >= self.max_cost:
                return "cost"
            return None
    ''')

TOOL = D('''\


    class Tool:
        """A function the model may call, and the typed arguments it accepts."""

        def __init__(self, name: str, params: dict, fn):
            self.name = name                 # what the model writes to call it
            self.params = params             # argument name -> exact type, e.g. {"a": int}
            self.fn = fn                     # the real function; it may raise
    ''')

REGISTRY = D('''\


    class ToolRegistry:
        """The tools the agent may use, by name."""

        def __init__(self):
            self.tools = {}                  # name -> Tool

        def register(self, tool: Tool) -> None:
            if tool.name in self.tools:      # a second tool under the same name would silently replace the first
                raise AgentError(f"tool {tool.name} is already registered")
            self.tools[tool.name] = tool

        def get(self, name: str) -> Tool:
            if name not in self.tools:
                raise AgentError(f"no tool {name}")
            return self.tools[name]
    ''')

AGENT = D('''\


    class Agent:
        """The entry point: runs the model-and-tools loop for one task, inside a budget."""

        def __init__(self, model, registry: ToolRegistry, max_steps: int = 5, max_cost: int = 100, max_retries: int = 2):
            self.model = model                 # anything with next(history) -> Action; a real model or a fake
            self.registry = registry
            self.max_steps = max_steps         # each run gets a fresh Budget with these
            self.max_cost = max_cost
            self.max_retries = max_retries     # extra attempts after the first, per tool call
    ''')

CORE = (HEAD + BUDGET + TOOL + in_class(VALIDATE) + REGISTRY
        + AGENT + in_class(RUN, EXECUTE_TOOL, CALL_RETRIES, AGENT_HELPERS))

DEMO = D('''\


    # ---- a quick run ----
    class FakeModel:
        """A stand-in for a model with no network: plays its script, then repeats the last action."""

        def __init__(self, script: list):
            self.script = script
            self.calls = 0

        def next(self, history: list) -> Action:
            action = self.script[min(self.calls, len(self.script) - 1)]
            self.calls += 1
            return action


    flaky = {"failures_left": 1}              # the weather tool times out once, then works


    def weather(city: str) -> str:
        if flaky["failures_left"] > 0:
            flaky["failures_left"] -= 1
            raise RuntimeError("timeout")
        return "3 degrees"


    def add(a: int, b: int) -> int:
        return a + b


    def broken(x: int) -> int:
        raise RuntimeError("down")


    def build(script: list, **limits) -> Agent:
        registry = ToolRegistry()
        registry.register(Tool("weather", {"city": str}, weather))
        registry.register(Tool("add", {"a": int, "b": int}, add))
        registry.register(Tool("broken", {"x": int}, broken))
        return Agent(FakeModel(script), registry, **limits)


    # a happy path, with one retry on the way
    r = build([Action("weather", {"city": "Oslo"}, cost=10), Action("add", {"a": 3, "b": 4}, cost=10),
               Action(answer="Oslo is 3 degrees and 3 + 4 = 7", cost=10)]).run("weather in Oslo, then 3 + 4")
    print(r.status, r.answer)
    for e in r.trace:
        print(e.line())

    # bad arguments come back as text, and the model fixes its call
    r = build([Action("add", {"a": "3", "b": 4}, cost=10), Action("add", {"a": 3, "b": 4}, cost=10),
               Action(answer="7", cost=10)]).run("add")
    print([e.line() for e in r.trace if e.kind == "error"], r.answer)

    # a tool that keeps failing: three attempts, then the model gets the error and gives up
    r = build([Action("broken", {"x": 1}, cost=10), Action(answer="could not", cost=10)]).run("break")
    print([e.kind for e in r.trace if e.kind in ("retry", "error")], r.answer)

    # a model that never stops is cut off by the step budget, then by the cost budget
    loop = [Action("add", {"a": 1, "b": 1}, cost=10)]
    r = build(loop, max_steps=3).run("loop")
    print(r.status, r.ok(), r.trace[-1].line())
    r = build([Action("add", {"a": 1, "b": 1}, cost=60)], max_cost=100).run("loop")
    print(r.status, r.trace[-1].line())
    r = build(loop, max_steps=0).run("loop")
    print(r.status, len(r.trace))
    try:
        build(loop).registry.register(Tool("add", {}, add))
    except AgentError as e:
        print(e)
    ''')
DEMO_OUT = ("done Oslo is 3 degrees and 3 + 4 = 7\n1 model: weather {'city': 'Oslo'}\n1 retry: weather attempt 1 failed: timeout\n"
            "1 tool: weather -> 3 degrees\n2 model: add {'a': 3, 'b': 4}\n2 tool: add -> 7\n"
            "3 model: Oslo is 3 degrees and 3 + 4 = 7\n3 final: Oslo is 3 degrees and 3 + 4 = 7\n"
            "['1 error: add: a must be int'] 7\n['retry', 'retry', 'error'] could not\n"
            "out_of_steps False 3 stop: out of steps\nout_of_cost 2 stop: out of cost\nout_of_steps 1\ntool add is already registered\n")

# ---- extensions ----
EXT_PARALLEL = D('''\
    from concurrent.futures import ThreadPoolExecutor


    class Action:
        ...
        calls: tuple = ()            # tool calls to make together, each one an Action with a tool and args


    class Agent:
        def _execute_all(self, action: Action, budget: Budget, trace: list) -> list:
            """Independent calls run together. Observations come back in the order the model asked."""
            with ThreadPoolExecutor(max_workers=4) as pool:
                return list(pool.map(lambda call: self._execute_tool(call, budget, trace), action.calls))
    ''')

EXT_APPROVAL = D('''\
    class Tool:
        def __init__(self, name: str, params: dict, fn, risky: bool = False):
            ...
            self.risky = risky           # a tool that deletes or sends something


    class Agent:
        def _execute_tool(self, action: Action, budget: Budget, trace: list) -> str:
            ...                          # the lookup and validate are unchanged
            if tool.risky and not self.approve(tool, action.args):    # the one new step
                trace.append(Event(budget.steps, "error", f"{tool.name} denied"))
                return f"error: {tool.name} was not approved"
            return self._call_with_retries(tool, action.args, budget, trace)
    ''')

EXT_MEMORY = D('''\
    class Agent:
        def __init__(self, ...):
            ...
            self.memory = []             # one line per finished run

        def run(self, task: str) -> RunResult:
            history = [("memory", m) for m in self.memory] + [("user", task)]   # the only change at the start
            ...
            if action.is_final():
                self.memory.append(f"{task} -> {action.answer}")    # remember only a run that finished
                ...
    ''')

# the final file: core + approval for risky tools + memory across runs
F_TOOL = D('''\


    class Tool:
        """A function the model may call, and the typed arguments it accepts."""

        def __init__(self, name: str, params: dict, fn, risky: bool = False):
            self.name = name
            self.params = params
            self.fn = fn
            self.risky = risky               # a tool that deletes or sends something needs an approval
    ''')

F_DENY = D('''\


    def deny_all(tool, args) -> bool:      # the default approver: nothing risky runs until a person says so
        return False
    ''')

F_AGENT = D('''\


    class Agent:
        """The entry point: runs the model-and-tools loop for one task, inside a budget."""

        def __init__(self, model, registry: ToolRegistry, max_steps: int = 5, max_cost: int = 100,
                     max_retries: int = 2, approve=deny_all):
            self.model = model
            self.registry = registry
            self.max_steps = max_steps
            self.max_cost = max_cost
            self.max_retries = max_retries
            self.approve = approve             # approve(tool, args) -> bool, asked before a risky tool runs
            self.memory = []                   # one line per finished run, shown to the model on the next
    ''')

F_RUN = method('''
    def run(self, task: str) -> RunResult:
        budget = Budget(self.max_steps, self.max_cost)
        history = [("memory", m) for m in self.memory] + [("user", task)]    # new: earlier runs come first
        trace = []
        while self._within_budget(budget, trace):
            action = self._next_action(history, budget, trace)
            if action.is_final():
                trace.append(Event(budget.steps, "final", action.answer))
                self.memory.append(f"{task} -> {action.answer}")             # new: only finished runs are kept
                return RunResult("done", action.answer, trace)
            observation = self._execute_tool(action, budget, trace)
            history.append(("assistant", f"{action.tool} {action.args}"))
            history.append(("tool", observation))
        return RunResult("out_of_" + budget.exhausted(), None, trace)
''')

F_EXECUTE_TOOL = method('''
    def _execute_tool(self, action: Action, budget: Budget, trace: list) -> str:
        try:
            tool = self.registry.get(action.tool)
            tool.validate(action.args)
        except AgentError as e:
            trace.append(Event(budget.steps, "error", str(e)))
            return f"error: {e}"
        if tool.risky and not self.approve(tool, action.args):    # new: a person decides before anything irreversible
            trace.append(Event(budget.steps, "error", f"{tool.name} denied"))
            return f"error: {tool.name} was not approved"
        return self._call_with_retries(tool, action.args, budget, trace)
''')

FINAL = (HEAD + BUDGET + F_TOOL + in_class(VALIDATE) + REGISTRY + F_DENY
         + F_AGENT + in_class(F_RUN, F_EXECUTE_TOOL, CALL_RETRIES, AGENT_HELPERS))

FINAL_DEMO = D('''\


    # ---- a quick run ----
    class FakeModel:
        def __init__(self, script: list):
            self.script = script
            self.calls = 0

        def next(self, history: list) -> Action:
            action = self.script[min(self.calls, len(self.script) - 1)]
            self.calls += 1
            return action


    class CountingModel:
        """A second model, to show the swap: it answers with how many lines it was shown."""

        def next(self, history: list) -> Action:
            return Action(answer=f"I was shown {len(history)} lines", cost=5)


    deleted = []


    def delete(name: str) -> str:
        deleted.append(name)
        return "deleted " + name


    registry = ToolRegistry()
    registry.register(Tool("delete", {"name": str}, delete, risky=True))
    agent = Agent(FakeModel([Action("delete", {"name": "notes.txt"}, cost=10), Action("delete", {"name": "tmp.txt"}, cost=10),
                             Action(answer="cleaned up", cost=10)]),
                  registry, approve=lambda tool, args: args["name"] == "tmp.txt")    # a person who only allows tmp.txt
    r = agent.run("clean up")
    print([e.line() for e in r.trace if e.kind == "error"], deleted, r.answer)
    agent.model = CountingModel()                  # swap the model: nothing else changes
    print(agent.run("what do you remember?").answer)
    print(agent.memory)
    ''')
FINAL_OUT = ("['1 error: delete denied'] ['tmp.txt'] cleaned up\nI was shown 2 lines\n"
             "['clean up -> cleaned up', 'what do you remember? -> I was shown 2 lines']\n")


PROBLEM = {
    "id": "agentrun", "title": "An agent runtime with tools", "part_id": "lld-agentrun", "n": 1,
    "part_title": "Agent runtime: tools, a loop, budgets", "minutes": 45,
    "lead": "An agent-runtime round in your order: a) clarify in three buckets, b) requirements, c) entities, d) class design as state and behaviour, e) implementation as logic, edge cases, then code, f) extensibility. The model is a fake with a script, so a run is deterministic and needs no network. Implementation starts with run(), the loop, and names its helpers before writing them; the retry cap gets its own box.",
    "prompt": "Design an agent runtime: it takes a task, calls a model, runs the tools the model asks for, and stops safely.",
    "evidence": "Not reported for Mercor's onsite; written because the Enterprise role builds and evaluates agents (Mercor's brief, the posting).",
    "drill": "part 1, Agent runtime.",

    "clarify": {
        "capabilities": [("What does one run look like?", "A task goes in; the model proposes a tool call or a final answer; we run the tool, feed the result back, and repeat"),
                         ("How do tools work?", "Each has a name and typed arguments, registered by name; the model asks for one by name with its arguments"),
                         ("What do we record?", "A trace: every model call, tool result, retry, error and the reason the run stopped")],
        "errors": [("The model asks for a tool that doesn't exist, or passes a wrong argument?", "Tell the model in text and let it try again; do not crash and do not retry the same call"),
                   ("A tool raises an error?", "Retry up to a cap, then give the model the error"),
                   ("The model never stops?", "A step budget and a cost budget; when either runs out the run ends with that reason")],
        "scope": [("A real model API?", "No: the model is any object with next(history) returning an action; the demo uses a fake"),
                  ("Parallel tools, approvals, memory between runs?", "Not yet: follow-ups"),
                  ("Streaming or async?", "Out of scope")],
    },
    "clarify_hint": "What a run does, how tools are described and called. A tool that doesn't exist, bad arguments, a tool that fails, a loop that never ends. A real model, concurrency, memory.",
    "clarify_say": "**I sort my questions into three buckets: what it must do, what goes wrong, where scope stops.** A run is a loop, so I ask what one turn looks like and how tools are described. Then the three failures: a bad call from the model, a failing tool, and a loop that never ends. Last, I ask to keep the model behind one method, so I can test with a fake.",
    "clarify_why": "Every question changes a class or a method. Typed tools give Tool.validate, the failing tool gives the retry cap, the endless loop gives Budget, and the model behind one method means the whole runtime is testable offline.",
    "answers": "A run is a loop: the model proposes a tool call or a final answer, we run the tool and feed the result back. Tools have a name and typed arguments and live in a registry. We record a trace. A bad tool name or bad arguments go back to the model as text, with no retry. A failing tool is retried up to a cap, then the model gets the error. A step budget and a cost budget end a run that never finishes. The model is any object with a next method; the demo uses a fake. Parallel tools, approvals and memory are follow-ups.",
    "playback": ["Thanks, that's clear. **So: a loop of model call, tool call and result, inside a step and cost budget, with typed tools, a capped retry, and a trace.** Bad calls go back to the model as text. The model sits behind one method. Out of scope: a real API, streaming, async."],

    "requirements": [
        ["A caller gives a task to run().", "The agent loops: ask the model for an action, run the tool it names, feed the result back", "Returns the answer when the model gives a final one"],
        ["The model names a tool with arguments.", "The registry finds the tool and checks the argument names and types", "An unknown tool or a bad argument is an error for the model to read, not retried"],
        ["A tool runs.", "If it fails, retry up to a cap, then give the model the error"],
        ["Each run has a step budget and a cost budget.", "Every model call is charged", "When either is used up the run stops and says which"],
        ["Every run records a trace.", "Each model call, tool result, retry, error and stop reason"],
    ],
    "out_of_scope": ["a real model API", "streaming and async", "parallel tool calls", "approvals", "memory between runs"],
    "req_hint": "The loop, calling a tool with checked arguments, a failing tool, the budgets, the trace.",
    "req_say": "From your answers I get five requirements. **Each becomes a piece of the loop: run, validate, retry, budget, trace.** Requirement 2 is the one people skip: a bad call is the model's mistake, so it goes back as text and is never retried, while a failing tool is retried.",
    "req_why": "1 is run, 2 is Tool.validate and the registry, 3 is _call_with_retries, 4 is Budget, 5 is the trace of Events. The split in 2 and 3 (never retry a bad call, do retry a failing tool) is the main design decision.",

    "entities": [("Agent", True, "The entry point: owns the loop, the limits and the model"),
                 ("Tool", True, "A name, typed parameters and a function; it checks its own arguments"),
                 ("Tool registry", True, "Finds a tool by name and refuses unknown names and duplicates"),
                 ("Budget", True, "Steps and cost used so far, and which limit is reached; new for each run"),
                 ("Action", True, "What the model wants: a tool call or a final answer, and what the call cost"),
                 ("Event (trace)", True, "One line of the trace; it knows how to print itself"),
                 ("Run result", True, "Status, answer and trace; it knows whether the run finished"),
                 ("Model", False, "External: any object with next(history); not our class"),
                 ("Prompt, token", False, "Nothing here reads them; the history is (role, text) pairs"),
                 ("User", False, "External actor")],
    "ent_hint": "What carries a rule? A tool checks arguments. A budget knows when it is used up. Which nouns are only text?",
    "ent_say": "I underline the nouns. **Agent, Tool, registry, Budget, Action, Event and RunResult stay,** because each one answers a question: does this call have valid arguments, is the budget used up, is this a final answer. The model is external and the prompt is only text.",
    "ent_why": "Tool earns its class because validation depends on its declared types. Budget earns its class because 'which limit stopped us' is a rule. Action, Event and RunResult are small frozen values, but each has a method somebody calls.",

    "classes": [
        {"name": "Agent", "state": ["model: any object with next(history)  # the only way we reach the outside",
                                    "registry: ToolRegistry  # tools by name",
                                    "max_steps: int, max_cost: int  # copied into a fresh Budget for each run",
                                    "max_retries: int  # extra attempts after the first, per tool call"],
         "behaviour": ["run(task) -> RunResult  # req 1: the loop",
                       "_execute_tool(action, budget, trace) -> str  # req 2: look up, validate, call",
                       "_call_with_retries(tool, args, budget, trace) -> str  # req 3: the retry cap",
                       "_within_budget(budget, trace) -> bool  # req 4: checked before every model call",
                       "_next_action(history, budget, trace) -> Action  # one charged model call"]},
        {"name": "ToolRegistry", "state": ["tools: dict name -> Tool  # lookup by the name the model writes"],
         "behaviour": ["register(tool) -> void | error  # a duplicate name is refused",
                       "get(name) -> Tool | error  # an unknown name is refused"]},
        {"name": "Tool", "state": ["name: string  # what the model calls it",
                                   "params: dict name -> type  # the typed arguments",
                                   "fn: function  # the real work; it may raise"],
         "behaviour": ["validate(args) -> void | error  # req 2: names and exact types"]},
        {"name": "Budget", "state": ["max_steps, max_cost: int  # the limits",
                                     "steps, cost: int  # used so far"],
         "behaviour": ["charge(cost) -> void  # one model call",
                       "exhausted() -> 'steps' | 'cost' | None  # req 4"]},
        {"name": "Action", "state": ["tool: string | None, args: dict  # a tool call",
                                     "answer: string | None  # or a final answer",
                                     "cost: int  # what this model call cost"],
         "behaviour": ["is_final() -> bool  # run: stop or keep going"]},
        {"name": "Event", "state": ["step: int, kind: string, detail: string  # one line of the trace"],
         "behaviour": ["line() -> string  # req 5"]},
        {"name": "RunResult", "state": ["status: string, answer: string | None, trace: Event[]"],
         "behaviour": ["ok() -> bool  # did the run finish with an answer"]},
    ],
    "class_hint": "The agent holds the model, the registry and the limits. A tool holds a name, typed parameters and a function. A budget holds what is used. Action, Event and RunResult are small records.",
    "class_say": "**I start from the methods and ask what each one has to read.** run has to call the model and the registry, so the agent keeps both. Checking a call needs the declared types, so a Tool holds its params. Stopping needs the used steps and cost next to their limits, so that is a Budget. And a trace is a list of Events, so each model call and tool result is one value.",
    "class_why": "The agent runs the loop and owns no tool logic. The tool checks its own arguments, the budget knows its own limits, the registry only finds by name. Each limit is a constructor argument, so a test can set a budget of two steps.",
    "class_qa": [{"ask": "Why is Budget a new object for each run and not fields on the Agent?",
                  "say": "Because the count belongs to one run. **If the agent kept the count, two runs would share it, and a second run could start already out of steps.** The agent keeps the limits; each run gets its own Budget with those limits.",
                  "explain": ["Agent.max_steps and max_cost are limits. Budget.steps and cost are usage."]},
                 {"ask": "Why does a tool error go back as text and not raise out of run()?",
                  "say": "Because the model is the one who can fix it. **A wrong argument is the model's mistake, so the model reads it and tries again; if run() raised, one bad call would end the whole task.** The budget stops it if the model keeps getting it wrong."}],

    "map": {"center": ("Agent", "run, _execute_tool"),
            "owned": [("ToolRegistry", "register, get"), ("Tool", "name, params, validate")],
            "uses": [("Budget", "steps, cost, exhausted"), ("Values", "Action, Event, Result")]},

    "skeleton": {"q": "First the small pieces: the error and the three values, Budget, Tool's __init__, the registry, and the agent's __init__.",
                 "hint": "Action, Event and RunResult are frozen dataclasses. Budget has charge and exhausted. The registry refuses duplicates and unknown names. The agent holds the model, the registry and three limits.",
                 "code": HEAD + BUDGET + TOOL + REGISTRY + AGENT,
                 "why": "These come straight from the - state lines. Writing them first means every method after only has to do its steps. Budget.exhausted is here because it is five lines with no helper."},
    "methods": [
        {"name": "run", "q": "Start with the most interesting method: run(task). Core logic and edge cases as comments, then the code. Name the hard parts as helpers.",
         "hint": "Budget, history, trace. While within budget: action = self._next_action(...); a final answer returns; else observation = self._execute_tool(...) goes into the history. After the loop, return the stop reason.",
         "code": RUN,
         "why": "It reads like the description of an agent. The three hard parts have names: _within_budget, _next_action, _execute_tool. A tool error is a string in the history, so the model sees it."},
        {"name": "_execute_tool", "q": "_execute_tool(action, budget, trace): from the model's request to a result string.",
         "hint": "Look up the tool, validate the arguments; if either raises, return an error string. Otherwise call it with retries.",
         "code": EXECUTE_TOOL,
         "why": "A bad call returns early and is never retried; the retry loop is only for a tool that fails. The retries get their own method, which is next."},
        {"name": "_call_with_retries", "q": "_call_with_retries(tool, args, budget, trace): the interesting helper. Try, retry up to a cap, record each attempt.",
         "hint": "attempts = 1 + max_retries. For each attempt, try the call. A failure that is not the last records a retry and continues. The last failure records an error and returns it as text.",
         "code": CALL_RETRIES,
         "why": "The loop is bounded by the attempts count, so it always ends. Each retry is traced, so you can see a flaky tool in the trace. No sleep here: a backoff is an extension, and the demo stays instant."},
        {"name": "Tool.validate", "q": "Tool.validate(args): check the arguments against the declared names and types.",
         "hint": "Every declared name present, no undeclared name, and each value of exactly the declared type.",
         "code": VALIDATE,
         "why": "Exact type, because in Python True is an int. It does not coerce \"3\" to 3: guessing hides the model's mistake from the model."},
    ],
    "helpers": [
        {"q": "The agent's helpers: _within_budget and _next_action.",
         "hint": "Ask the budget which limit is reached, record the stop once. Call the model with a copy of the history, charge the budget, record the call.",
         "code": AGENT_HELPERS,
         "why": "_within_budget is the only place the stop is recorded. _next_action is the only place the model is called and charged, so no call can skip the budget."},
    ],

    "design_check": {
        "lead": "SOLID is not a stage. You design small first, then check each choice against it in a minute, and a pattern appears only where something varies.",
        "solid": [
            ("Single responsibility", "The agent runs the loop, the tool checks its own arguments, the budget knows its limits, the registry finds by name."),
            ("Open/closed", "A new tool is a register call. A new limit is a check in Budget.exhausted. run() is not edited for either."),
            ("Liskov substitution", "The model is anything with next(history) returning an Action, so a fake and a real model are interchangeable."),
            ("Interface segregation", "The agent needs one method from the model, next, and nothing else."),
            ("Dependency inversion", "The agent depends on the shape of a model, not on a vendor. The demo passes a fake."),
        ],
        "varies": [
            ("Which model", "Strategy: already there as duck typing", "the agent only calls model.next"),
            ("Retry policy (backoff, which errors retry)", "Strategy, if more than one policy", "today one cap in _call_with_retries"),
            ("Who may run a risky tool", "A callback the agent asks", "one approve function, default deny"),
            ("Tool calls at the same time", "No pattern: a thread pool", "one method that maps _execute_tool over the calls"),
        ],
    },
    "extensions": [
        {"ask": "The model can ask for several independent tools at once.",
         "say": "The action carries a list of calls, and the agent maps _execute_tool over them with a thread pool. **_execute_tool is already one call in, one string out, so it needs no change.** The trace list gets appended from several threads, which is safe for append, and the budget is charged once per model call, so it has no race.",
         "code": EXT_PARALLEL, "code_title": "Parallel tool calls",
         "short_q": "Parallel tools", "short_a": "Action carries calls; a thread pool maps _execute_tool over them; budget is charged once per model call"},
        {"ask": "Some tools are risky, like deleting a file. A person must approve them.",
         "say": "A risky flag on Tool and an approve callback on the Agent. **One new check in _execute_tool, after validation and before the call, and the default approver says no.** A denied call is an error the model reads, so it can ask for something else.",
         "code": EXT_APPROVAL, "code_title": "Approval for risky tools",
         "short_q": "Human approval", "short_a": "Tool.risky; Agent.approve(tool, args); one check before the call; default deny"},
        {"ask": "The agent should remember earlier runs.",
         "say": "A list of one-line summaries on the Agent, put at the front of the next run's history. **Only finished runs are remembered,** so a run that hit its budget doesn't teach the agent a wrong answer. Later, the list becomes a store the model searches.",
         "code": EXT_MEMORY, "code_title": "Memory across runs",
         "short_q": "Memory", "short_a": "Agent.memory lines; start each history with them; keep only finished runs"},
        {"ask": "Swap the model for a different one.",
         "say": "Nothing changes in the runtime. **The agent only calls model.next(history) and reads an Action,** so a new model is a small adapter that turns its reply into an Action. The tests keep running on the fake.",
         "short_q": "Swap the model", "short_a": "an adapter with next(history) -> Action; the agent is untouched"},
    ],
    "faq": [("Why not retry a bad argument?", "The same call fails the same way, so a retry only wastes time. The model can fix its call if it sees the error, so the error goes to the model."),
            ("Why does a tool error not stop the run?", "The model may have another way to the answer. The step and cost budgets are what guarantee the run ends."),
            ("Why exact types, and not isinstance?", "isinstance(True, int) is true in Python, so a bool would pass as an int. Comparing the type exactly keeps 'must be int' honest. The stdlib shortcut for richer checks is a schema library; the loop here is the part to show."),
            ("What about backoff between retries?", "Add a sleep that doubles in _call_with_retries, with a jitter. It is kept out of the core so the demo is instant and deterministic.")],

    "summary": ["**One loop and a few small classes.** The Agent asks the model for an action, and a final answer ends the run. A tool call goes through the registry, the Tool checks its own typed arguments, and a failing tool is retried up to a cap. A bad call or a final failure goes back to the model as text. A fresh Budget per run ends a run that never finishes, and the trace records every step.",
                "**It extends in one place each time:** parallel calls map _execute_tool over a list, approval is one check before the call, memory is a list at the front of the history, and a new model is an adapter."],

    "apart": [
        "**The loop is the agent:** ask the model for the next action, run the tool, record it, stop on a final answer or a budget.",
        "**A bad call goes back to the model as text and is never retried; a failing tool is retried up to a cap.** Two different failures, two different answers.",
        "**The budget is checked before every model call,** and every call is charged in one place.",
        "**The model is anything with next(history),** so a fake makes every run the same."
    ],
    "golden": [
        ("A bad call goes back to the model as text and is never retried; a failing tool is retried up to a cap.", "the model can fix its own mistake, but retrying the same wrong call only wastes time."),
        ("run() reads like the description of an agent, and names _next_action, _execute_tool and _within_budget.", "the loop says the rule out loud, and each hard part has one place."),
        ("Every model call is charged in one place, and the budget is checked before the call.", "a run cannot skip the limit, so it always ends."),
        ("Tool.validate compares types exactly and does not coerce.", "True is an int in Python, and guessing hides the model's mistake from the model."),
        ("The model is anything with next(history), and the demo uses a fake.", "the whole runtime runs offline and the same every time."),
        ("A new Budget for each run, with limits from the agent.", "two runs never share a count."),
    ],

    "core_code": CORE, "demo": DEMO, "demo_out": DEMO_OUT,
    "final_intro": "The core with two extensions applied (approval for risky tools, memory across runs), and a run at the bottom that also swaps the model.",
    "final_title": "agent_runtime.py", "final_code": FINAL, "final_demo": FINAL_DEMO, "final_out": FINAL_OUT,
    "final_out_note": "notes.txt is denied and tmp.txt is deleted; the second run, on a swapped model, is shown 2 lines (the first run as a memory line, and its own task); the memory then holds both runs.",
}
