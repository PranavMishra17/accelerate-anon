// Exercise: JS has no TaskGroup, so build the scope by hand: one AbortController, abort the rest on the first failure, wait for every child.
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-structured.test.ts

export type Spawn = <T>(fn: (signal: AbortSignal) => Promise<T>) => Promise<T>;

export async function scope<R>(body: (spawn: Spawn, signal: AbortSignal) => Promise<R>, parent?: AbortSignal): Promise<R> {
  const ac = new AbortController();
  const onParent = () => ac.abort(parent?.reason); // Stop from above reaches every child
  parent?.addEventListener("abort", onParent, { once: true });
  const children: Promise<unknown>[] = [];
  let failed: { e: unknown } | undefined;
  const fail = (e: unknown) => {
    if (failed) return;
    failed = { e };
    ac.abort(e); // the first failure stops the siblings
  };
  const spawn: Spawn = (fn) => {
    const p = fn(ac.signal);
    children.push(p.catch(fail));
    return p;
  };
  let result: R | undefined;
  try {
    result = await body(spawn, ac.signal);
  } catch (e) {
    fail(e);
  }
  // ponytail: waits for children spawned so far; a child that spawns after this point is not tracked
  await Promise.allSettled(children); // no child outlives the scope
  parent?.removeEventListener("abort", onParent); // no listener leak on a long-lived signal
  if (parent?.aborted) throw parent.reason;
  if (failed) throw failed.e;
  return result as R;
}
