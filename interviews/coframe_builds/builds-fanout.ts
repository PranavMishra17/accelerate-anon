// Exercise: call a flaky, rate-limited model API for N items with bounded concurrency, a token bucket, retries with full jitter on retryable errors only, a per-call timeout, and cancellation of the rest when the caller gives up.
// Run the test: node --experimental-strip-types interviews/coframe_builds/builds-fanout.test.ts

/** 429, 5xx, a dropped connection. retryAfterMs carries the server's Retry-After. */
export class RetryableError extends Error {
  retryAfterMs?: number;
  constructor(msg: string, retryAfterMs?: number) { super(msg); this.retryAfterMs = retryAfterMs; }
}
/** 400, 401, a schema error: retrying sends the same bad request again. */
export class FatalError extends Error {}

export type Sleep = (ms: number, signal?: AbortSignal) => Promise<void>;
export type Result<R> = { ok: true; value: R } | { ok: false; error: unknown };

export const realSleep: Sleep = (ms, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(signal.reason);
  const t = setTimeout(() => { signal?.removeEventListener("abort", onAbort); resolve(); }, ms);
  const onAbort = () => { clearTimeout(t); reject(signal!.reason); };
  signal?.addEventListener("abort", onAbort, { once: true });
});

/** Reservation style: take() books a token now (tokens may go negative) and waits until it is due.
 *  No lock: the refill, check and booking run with no await in between, so nothing interleaves. */
export class TokenBucket {
  rate: number; burst: number; tokens: number; t: number;
  now: () => number; sleep: Sleep;
  constructor(ratePerSec: number, burst: number, now: () => number = () => performance.now(), sleep: Sleep = realSleep) {
    this.rate = ratePerSec / 1000; this.burst = burst; this.tokens = burst;
    this.now = now; this.sleep = sleep; this.t = now();
  }
  async take(signal?: AbortSignal): Promise<void> {
    const t = this.now();
    this.tokens = Math.min(this.burst, this.tokens + (t - this.t) * this.rate);
    this.t = t;
    this.tokens -= 1;
    if (this.tokens >= 0) return;
    try { await this.sleep(-this.tokens / this.rate, signal); }
    catch (e) { this.tokens += 1; throw e; }                      // give the booking back
  }
}

/** A semaphore in ten lines. Queued work that is aborted never runs. */
function limiter(n: number) {
  let running = 0;
  const queue: (() => void)[] = [];
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    if (running >= n) await new Promise<void>((r) => queue.push(r));
    running++;
    try { return await fn(); } finally { running--; queue.shift()?.(); }
  };
}

const isTimeout = (e: unknown) => e instanceof DOMException && e.name === "TimeoutError";

export type FanOutOpts = {
  limit: number; bucket: TokenBucket; attempts?: number; baseMs?: number; capMs?: number;
  timeoutMs?: number; signal?: AbortSignal; sleep?: Sleep; rand?: () => number;
};

/** One result per item, in order. If the caller's signal aborts, in-flight calls see it, queued items
 *  never start, and the returned promise rejects with the caller's reason. */
export async function fanOut<T, R>(items: T[], call: (item: T, signal: AbortSignal) => Promise<R>,
  o: FanOutOpts): Promise<Result<R>[]> {
  const { attempts = 4, baseMs = 500, capMs = 8000, timeoutMs = 30000, sleep = realSleep, rand = Math.random } = o;
  const slot = limiter(o.limit);

  async function one(item: T): Promise<Result<R>> {
    for (let n = 0; ; n++) {
      let err: unknown;
      try {
        return await slot(async (): Promise<Result<R>> => {      // a slot only while calling, not while backing off
          o.signal?.throwIfAborted();                              // queued and the caller left: do not start
          await o.bucket.take(o.signal);                           // every attempt spends rate
          // Per-call deadline joined with the caller's signal. A ref'd timer, cleared when the call ends.
          const ac = new AbortController();
          const timer = setTimeout(() => ac.abort(new DOMException("call timed out", "TimeoutError")), timeoutMs);
          const signal = o.signal ? AbortSignal.any([o.signal, ac.signal]) : ac.signal;
          try { return { ok: true, value: await call(item, signal) }; } finally { clearTimeout(timer); }
        });
      } catch (e) {
        if (o.signal?.aborted) throw o.signal.reason;              // the caller gave up: stop everything
        if (!(e instanceof RetryableError || isTimeout(e))) return { ok: false, error: e };
        err = e;
      }
      if (n === attempts - 1) return { ok: false, error: err };
      const ra = err instanceof RetryableError ? err.retryAfterMs : undefined;
      await sleep(ra ?? rand() * Math.min(capMs, baseMs * 2 ** n), o.signal);     // full jitter, abortable
    }
  }

  // Promise.all, not allSettled: per-item failures are already values, so a rejection here means the caller aborted.
  return Promise.all(items.map(one));
}
