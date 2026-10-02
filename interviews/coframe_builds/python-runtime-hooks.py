# Exercise: descriptors, __slots__, a sync-or-async tracing decorator, and contextvars for a run id.
# Run its test: python interviews/coframe_builds/python-runtime-hooks_test.py
import contextvars
import functools
import inspect
import time
from collections.abc import Callable
from dataclasses import dataclass, field

run_id: contextvars.ContextVar[str] = contextvars.ContextVar("run_id", default="-")  # module level, always


class Positive:  # a data descriptor: defines __set__, so it beats the instance __dict__
    def __set_name__(self, owner, name):
        self.attr = "_" + name

    def __get__(self, obj, objtype=None):
        return self if obj is None else getattr(obj, self.attr)

    def __set__(self, obj, v):
        if v <= 0:
            raise ValueError("must be positive")
        setattr(obj, self.attr, v)


class Cfg:
    retries = Positive()

    def __init__(self, r):
        self.retries = r


@dataclass(slots=True, frozen=True)
class Span:
    name: str
    tags: list[str] = field(default_factory=list)


def naive_timed(fn, log):  # the bug: on an async def this times creating the coroutine, not running it
    @functools.wraps(fn)
    def wrap(*a, **k):
        t0 = time.perf_counter()
        try:
            return fn(*a, **k)
        finally:
            log.append(time.perf_counter() - t0)

    return wrap


def traced[**P, R](fn: Callable[P, R], log: list) -> Callable[P, R]:
    if inspect.iscoroutinefunction(fn):

        @functools.wraps(fn)
        async def awrap(*a: P.args, **k: P.kwargs):
            t0 = time.perf_counter()
            try:
                return await fn(*a, **k)
            finally:
                log.append((run_id.get(), time.perf_counter() - t0))

        return awrap  # type: ignore[return-value]

    @functools.wraps(fn)
    def wrap(*a: P.args, **k: P.kwargs) -> R:
        t0 = time.perf_counter()
        try:
            return fn(*a, **k)
        finally:
            log.append((run_id.get(), time.perf_counter() - t0))

    return wrap
