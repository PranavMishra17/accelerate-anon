# Exercise: a lazy generator pipeline (read, filter, parse, batch), yield from, and close().
# Run its test: python interviews/coframe_builds/python-iteration_test.py
import itertools
import json


def read_lines(src):
    for line in src:
        yield line.rstrip("\n")


def nonblank(lines):
    return (l for l in lines if l)


def parse(lines):
    for l in lines:
        yield json.loads(l)


def pipeline(src, n):
    # nothing is materialised until the caller pulls a batch
    return itertools.batched(parse(nonblank(read_lines(src))), n)


def inner():
    got = yield 1
    return f"inner got {got}"


def outer():
    r = yield from inner()  # send() passes through; r is inner's return value
    yield r


def cleanup_gen(log):
    try:
        yield 1
        yield 2
    finally:
        log.append("closed")  # runs on close(): GeneratorExit is raised at the yield


def count_sessions(lines):
    # constant memory per session, not per line: a dict of small aggregates
    counts = {}
    for l in lines:
        sid = l.split(",", 1)[0]
        counts[sid] = counts.get(sid, 0) + 1
    return counts
