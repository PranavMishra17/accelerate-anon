# Exercise: retries with capped exponential backoff, full jitter and Retry-After; an SSE stream read under one total deadline.
# Run its test: python interviews/coframe_builds/async-retries-streaming_test.py
import asyncio
import random
from contextlib import aclosing
from dataclasses import dataclass, field

RETRYABLE = {408, 429, 500, 502, 503, 504}


@dataclass
class Resp:  # stands in for an httpx.Response
    status: int
    headers: dict = field(default_factory=dict)


def full_jitter(n: int, base: float, cap: float, rng: random.Random) -> float:
    return rng.uniform(0, min(cap, base * 2**n))  # spread retries out so workers do not stampede together


async def with_retries(send, *, attempts=4, base=0.5, cap=20.0, rng=None, sleep=asyncio.sleep):
    rng = rng or random.Random()
    for n in range(attempts):
        try:
            r = await send()
        except ConnectionError:  # httpx.TransportError in real code: timeouts and resets
            if n == attempts - 1:
                raise
            await sleep(full_jitter(n, base, cap, rng))
            continue
        if r.status not in RETRYABLE or n == attempts - 1:
            return r  # success, a 4xx that will never succeed, or out of attempts
        ra = r.headers.get("retry-after", "")
        await sleep(float(ra) if ra.isdigit() else full_jitter(n, base, cap, rng))


async def sse_data(lines):
    """Yield each event's data until [DONE]. A frame ends at a blank line; several data lines join with a newline."""
    buf: list[str] = []
    async for line in lines:
        if line == "":
            if buf:
                d = "\n".join(buf)
                buf = []
                if d == "[DONE]":
                    return
                yield d
        elif line.startswith("data:"):
            buf.append(line[5:].removeprefix(" "))
        # lines starting with ":" are comments (heartbeats); other fields ignored here


async def read_stream(lines, total: float) -> list[str]:
    out: list[str] = []
    async with asyncio.timeout(total):  # the read timeout is per chunk; this caps the whole stream
        # aclosing closes both generators on any exit (done, break, timeout); with httpx, `async with client.stream(...)` plays the outer part
        async with aclosing(lines), aclosing(sse_data(lines)) as events:
            async for d in events:
                out.append(d)
    return out
