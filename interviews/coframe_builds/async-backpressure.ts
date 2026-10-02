// Exercise: a hand p-limit, a pull-based async generator, and a Web Stream whose pull() stops at the highWaterMark.
// Run its test: node --experimental-strip-types interviews/coframe_builds/async-backpressure.test.ts

// p-limit in ten lines: at most n functions running; the waiting queue itself is unbounded.
export function limiter(n: number) {
  let running = 0;
  const waiting: (() => void)[] = [];
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    while (running >= n) await new Promise<void>((r) => waiting.push(r));
    running++;
    try {
      return await fn();
    } finally {
      running--;
      waiting.shift()?.();
    }
  };
}

// An async generator only runs when the consumer asks for the next value.
export async function* produce(log: string[]): AsyncGenerator<number> {
  for (let i = 0; i < 100; i++) {
    log.push(`made ${i}`);
    yield i;
  }
}

// A ReadableStream calls pull() only while desiredSize (highWaterMark minus queued) is above zero.
export function counted(highWaterMark: number): { stream: ReadableStream<number>; pulls: () => number } {
  let pulls = 0;
  const stream = new ReadableStream<number>(
    { pull(c) { c.enqueue(pulls++); } },
    new CountQueuingStrategy({ highWaterMark }),
  );
  return { stream, pulls: () => pulls };
}
