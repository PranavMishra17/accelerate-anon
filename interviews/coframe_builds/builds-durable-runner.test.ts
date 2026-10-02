// Tests for builds-durable-runner.ts: crash a run at each point, restart with only the store, count the side effects.
// Run: node --experimental-strip-types interviews/coframe_builds/builds-durable-runner.test.ts
import assert from "node:assert/strict";
import { Runner, type Store } from "./builds-durable-runner.ts";

class Crash extends Error {}

class Repo {                                    // a fake GitHub that dedupes on the idempotency key
  prs: string[] = [];
  byKey = new Map<string, number>();
  async openPr(branch: string, key?: string): Promise<number> {
    if (key !== undefined && this.byKey.has(key)) return this.byKey.get(key)!;
    this.prs.push(branch);
    if (key !== undefined) this.byKey.set(key, this.prs.length);
    return this.prs.length;
  }
}

type Crashes = "before_pr" | "after_pr_before_record" | undefined;

async function workflow(r: Runner, run: string, repo: Repo, llm: string[], crashAt?: Crashes, sendKey = true) {
  const plan = await r.step(run, "plan", async () => { llm.push("plan"); return ["edit header", "run tests"]; });
  for (const [i, task] of plan.entries()) {
    await r.step(run, `tool:${i}`, async () => { llm.push(task); return `ok: ${task}`; });
  }
  if (crashAt === "before_pr") throw new Crash();
  return r.effect(run, "open_pr", async (key) => {
    const n = await repo.openPr(`agent/${run}`, sendKey ? key : undefined);
    if (crashAt === "after_pr_before_record") throw new Crash();   // the PR exists, the checkpoint does not
    return n;
  });
}

const store: Store = new Map();
const restart = () => new Runner(store);         // a new process: only the store survives

// 1. Crash before the side effect: the restart skips plan and both tool steps.
{
  const repo = new Repo(), llm: string[] = [];
  await assert.rejects(workflow(restart(), "r1", repo, llm, "before_pr"), Crash);
  assert.equal(await workflow(restart(), "r1", repo, llm), 1);
  assert.deepEqual(llm, ["plan", "edit header", "run tests"]);
  assert.deepEqual(repo.prs, ["agent/r1"]);
}

// 2. The in-flight problem, solved by the key.
{
  const repo = new Repo(), llm: string[] = [];
  await assert.rejects(workflow(restart(), "r2", repo, llm, "after_pr_before_record"), Crash);
  assert.deepEqual(restart().inFlight("r2"), ["open_pr"]);
  assert.equal(await workflow(restart(), "r2", repo, llm), 1);
  assert.deepEqual(repo.prs, ["agent/r2"]);
  assert.deepEqual(restart().inFlight("r2"), []);
}

// 3. The same crash with no key: two PRs.
{
  const repo = new Repo(), llm: string[] = [];
  await assert.rejects(workflow(restart(), "r3", repo, llm, "after_pr_before_record", false), Crash);
  await workflow(restart(), "r3", repo, llm, undefined, false);
  assert.deepEqual(repo.prs, ["agent/r3", "agent/r3"]);
}

// 4. A finished run replays from checkpoints; results come back as copies.
{
  const repo = new Repo(), llm: string[] = [];
  assert.equal(await workflow(restart(), "r1", repo, llm), 1);
  assert.deepEqual(llm, []);
  const r = restart();
  const a = await r.step("r5", "obj", async () => ({ n: 1 }));
  a.n = 99;                                       // mutating the result must not change the checkpoint
  assert.deepEqual(await restart().step("r5", "obj", async () => ({ n: 2 })), { n: 1 });
}
console.log("builds-durable-runner.ts: all tests passed");
