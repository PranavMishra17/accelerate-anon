# Exercise: test seams and memory diagnosis: an injectable model client, patch-where-used, tracemalloc diffs.
# Run its test: python interviews/coframe_builds/python-tooling_test.py
import tracemalloc
from os import getcwd  # this module now holds its own reference: patch python_tooling.getcwd, not os.getcwd


def where():
    return getcwd()


class Agent:
    def __init__(self, client):  # injected: tests pass a fake, never the network
        self.client = client
        self.history = []  # per-instance, never a module-level list

    def ask(self, q):
        self.history.append(q)
        return self.client(self.history)


_seen = {}  # ponytail: deliberately unbounded, this is the leak the test finds


def handle(req_id):
    _seen[req_id] = bytearray(1000)  # a fresh 1 KB buffer per request
    return len(_seen)


def top_growth(fn, n):
    tracemalloc.start()
    before = tracemalloc.take_snapshot()
    for i in range(n):
        fn(i)
    after = tracemalloc.take_snapshot()
    tracemalloc.stop()
    stats = after.compare_to(before, "lineno")
    return stats[0]  # biggest growth, by source line
