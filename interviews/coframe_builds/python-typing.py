# Exercise: typing that holds at check time and what survives at runtime (Protocol, TypedDict, generics, ParamSpec).
# Run its test: python interviews/coframe_builds/python-typing_test.py
import functools
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Literal, NotRequired, Protocol, TypedDict, overload, runtime_checkable


class Msg(TypedDict):
    role: Literal["user", "assistant"]
    content: str
    name: NotRequired[str]


@runtime_checkable
class Tool(Protocol):  # structural: anything with these members is a Tool, no inheritance
    name: str

    async def __call__(self, **kw) -> str: ...


class Echo:
    name = "echo"

    async def __call__(self, **kw) -> str:
        return str(kw)


class Impostor:  # wrong signature, sync not async: isinstance still says yes
    name = "nope"

    def __call__(self, a, b):
        return a + b


def register(t: Tool) -> str:
    return t.name


def first[T](xs: list[T]) -> T:  # 3.12 syntax, no TypeVar declaration
    return xs[0]


type Vec = list[float]  # 3.12 type alias


@dataclass
class Result[R]:
    ok: bool
    value: R | None = None
    error: str | None = None


def captured[**P, R](fn: Callable[P, R]) -> Callable[P, Result[R]]:
    # same parameters as fn, different return type: this is what ParamSpec is for
    @functools.wraps(fn)
    def wrap(*a: P.args, **k: P.kwargs) -> Result[R]:
        try:
            return Result(True, fn(*a, **k))
        except Exception as e:
            return Result(False, error=str(e))

    return wrap


@captured
def divide(a: int, b: int) -> float:
    return a / b


@overload
def parse(x: int) -> str: ...
@overload
def parse(x: str) -> int: ...
def parse(x):  # only this one exists at runtime
    return str(x) if isinstance(x, int) else int(x)


AsyncTool = Callable[..., Awaitable[str]]
