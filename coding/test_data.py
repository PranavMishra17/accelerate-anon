"""Check coding/data.js: every code block runs, and every statement example that can be called directly
returns what the page says.

    python coding/test_data.py

A pattern's solutions and variations are defined, then each example whose input reads like keyword
arguments (nums = [2, 7], target = 9) is called and compared with its output. AI systems topics run their
components in order, then the end-to-end code, then each variation (needs numpy and torch).
"""
import ast, io, json, os, sys, inspect

HERE = os.path.dirname(os.path.abspath(__file__))
s = io.open(os.path.join(HERE, "data.js"), encoding="utf-8").read()
D = json.loads(s[s.index("window.CODING = ") + 16:].rstrip().rstrip(";"))


class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def linked(xs):
    head = None
    for x in reversed(xs):
        head = ListNode(x, head)
    return head


def tree(xs):
    """Level order with None for gaps, as the examples write trees."""
    if not xs or xs[0] is None:
        return None
    nodes = [None if x is None else TreeNode(x) for x in xs]
    kids = iter(nodes[1:])
    for n in nodes:
        if n:
            n.left, n.right = next(kids, None), next(kids, None)
    return nodes[0]


def shape(name, value):
    if isinstance(value, list) and name in ("head", "a", "b", "l1", "l2", "list1", "list2"):
        return linked(value)
    if isinstance(value, list) and name == "root":
        return tree(value)
    return value


def plain(got, want):
    if isinstance(got, ListNode) and isinstance(want, int):
        return got.val  # a node returned, its value named
    if isinstance(got, ListNode):
        out = []
        while got:
            out.append(got.val)
            got = got.next
        return out
    if got is None and want == []:
        return []
    if hasattr(got, "val") and not isinstance(want, (list, dict)):
        return got.val
    return got


def lit(text):
    try:
        return True, ast.literal_eval(text)
    except (ValueError, SyntaxError):
        return False, None


def kwargs(text):
    """'nums = [2, 7], target = 9' -> {'nums': [2, 7], 'target': 9}, or None if it is not that shape."""
    try:
        call = ast.parse("f(" + text.replace(" = ", "=") + ")", mode="eval").body
        return {k.arg: ast.literal_eval(k.value) for k in call.keywords} if call.keywords and not call.args else None
    except (ValueError, SyntaxError):
        return None


ran = checked = skipped = 0
fails = []
for p in D["patterns"]:
    if p.get("parts"):
        g = {"__name__": "topic_" + p["id"]}
        for c in p["parts"]:
            exec(c["code"], g)
        exec(p["tpl"], g)
        for v in p["vars"]:
            exec(v["code"], dict(g))
        ran += len(p["parts"]) + 1 + len(p["vars"])
        continue
    for item in p["probs"] + p["vars"]:
        g = {"ListNode": ListNode, "__name__": "p"}
        exec(item.get("sol") or item["code"], g)
        ran += 1
        fns = [v for k, v in g.items() if inspect.isfunction(v) and v.__module__ == "p" and not k.startswith("_")]
        for e in (item.get("st") or {}).get("ex", []):
            kw, (ok, want) = kwargs(e["i"]), lit(e["o"])
            fn = next((f for f in fns if kw and set(kw) == set(inspect.signature(f).parameters)), None)
            if not (kw and ok and fn):
                skipped += 1
                continue
            try:
                got = plain(fn(**{k: shape(k, v) for k, v in kw.items()}), want)
            except Exception as ex:  # an example that crashes the solution is a failure
                got = "raised " + repr(ex)
            if got != want and not (isinstance(got, float) and isinstance(want, float) and abs(got - want) < 1e-3):
                fails.append("%s: %s -> %r, page says %r" % (item["n"], e["i"], got, want))
            checked += 1

print("%d code blocks ran; %d examples checked, %d not directly callable" % (ran, checked, skipped))
for f in fails:
    print("MISMATCH", f)
sys.exit(1 if fails else 0)
