# Exercise: one agent run as one TaskGroup: stopping the run cancels every child, and the finally saves a checkpoint that a second cancel cannot interrupt.
# Run its test: python interviews/coframe_builds/async-structured_test.py
import asyncio


async def run_agent(store: dict, tools: list[float], log: list[str]) -> None:
    async def tool(n: float):
        try:
            await asyncio.sleep(n)
            log.append(f"tool {n} done")
        except asyncio.CancelledError:
            log.append(f"tool {n} cancelled")
            raise

    async def heartbeat():
        while True:  # renews the run's lease so no other worker takes it over
            store["beats"] = store.get("beats", 0) + 1
            await asyncio.sleep(0.01)

    async def save_checkpoint():
        await asyncio.sleep(0.01)  # a database write
        store["checkpoint"] = list(log)

    try:
        async with asyncio.TaskGroup() as tg:  # no child outlives this block
            hb = tg.create_task(heartbeat())
            async with asyncio.TaskGroup() as tools_tg:
                for n in tools:
                    tools_tg.create_task(tool(n))
            hb.cancel()  # the work is done, stop the heartbeat
    finally:
        await asyncio.shield(asyncio.ensure_future(save_checkpoint()))  # must finish even while we are being cancelled
