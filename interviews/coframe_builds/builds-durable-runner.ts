// Exercise: a durable step runner. Each step's result is checkpointed by (run id, step name); after a crash a rerun skips finished steps, and side effects carry an idempotency key.
// Run the test: node --experimental-strip-types interviews/coframe_builds/builds-durable-runner.test.ts

type Row = { status: "started" | "done"; out?: unknown };

// The store holds JSON strings, as a Postgres row would: what comes back is a copy, never the live object.
export type Store = Map<string, string>;

export class Runner {
  store: Store;
  constructor(store: Store) { this.store = store; }

  private get(run: string, name: string): Row | undefined {
    const s = this.store.get(`${run}\u0000${name}`);
    return s === undefined ? undefined : (JSON.parse(s) as Row);
  }

  private put(run: string, name: string, row: Row): void {
    this.store.set(`${run}\u0000${name}`, JSON.stringify(row));     // in production: an awaited upsert
  }

  /** Pure or repeatable work (an LLM call you are happy to pay for twice). Replays the recorded result. */
  async step<T>(run: string, name: string, fn: () => Promise<T>): Promise<T> {
    const row = this.get(run, name);
    if (row?.status === "done") return row.out as T;
    const out = await fn();
    this.put(run, name, { status: "done", out });
    return out;
  }

  /** A side effect. fn receives the idempotency key and must send it downstream. */
  async effect<T>(run: string, name: string, fn: (key: string) => Promise<T>): Promise<T> {
    const row = this.get(run, name);
    if (row?.status === "done") return row.out as T;
    this.put(run, name, { status: "started" });                     // after a crash we can see it was in flight
    const out = await fn(`${run}:${name}`);                         // the same key on every attempt
    this.put(run, name, { status: "done", out });
    return out;
  }

  inFlight(run: string): string[] {
    const prefix = `${run}\u0000`;
    return [...this.store].filter(([k, v]) => k.startsWith(prefix) && (JSON.parse(v) as Row).status === "started")
      .map(([k]) => k.slice(prefix.length));
  }
}
