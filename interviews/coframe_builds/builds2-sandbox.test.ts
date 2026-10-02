// Test for builds2-sandbox.ts: node:assert, real child processes.
// Run: node --experimental-strip-types interviews/coframe_builds/builds2-sandbox.test.ts
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { runUntrusted } from "./builds2-sandbox.ts";

let r = await runUntrusted("console.log('hi'); console.error('warn'); process.exit(3);");
assert.deepEqual([r.exitCode, r.stdout.trim(), r.stderr.trim(), r.timedOut, r.truncated], [3, "hi", "warn", false, false]);

r = await runUntrusted("throw new Error('boom')");
assert.equal(r.exitCode, 1);
assert.match(r.stderr, /Error: boom/);

r = await runUntrusted("for (;;) {}", 500);
assert.ok(r.timedOut && r.exitCode === null && r.ms < 5000);

r = await runUntrusted("setTimeout(() => {}, 30000)", 500); // idle, not burning CPU: wall clock still catches it
assert.ok(r.timedOut && r.ms < 5000);

r = await runUntrusted("process.stdout.write('x'.repeat(1_000_000))", 5000, 1000);
assert.equal(r.stdout.length, 1000);
assert.ok(r.truncated && r.exitCode === 0 && !r.timedOut);

process.env.FAKE_API_KEY = "sk-test-not-real";
r = await runUntrusted("console.log(String(process.env.FAKE_API_KEY)); console.log(Object.keys(process.env).join(','))");
assert.equal(r.stdout.split("\n")[0], "undefined");
assert.ok(!r.stdout.includes("FAKE_API_KEY"));

r = await runUntrusted("import { writeFileSync } from 'node:fs'; writeFileSync('scratch.txt', 'x'); console.log(process.cwd())");
const cwd = r.stdout.trim();
assert.ok(basename(cwd).startsWith("sbx-") && !existsSync(cwd), cwd);

console.log("builds2-sandbox.ts: ok");
