// Exercise: run untrusted generated JavaScript in a child process: wall-clock timeout, output caps, scrubbed env, temp dir removed, structured result. Not a security boundary.
// Run its test: node --experimental-strip-types interviews/coframe_builds/builds2-sandbox.test.ts
import { spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

// What this does NOT isolate: the child runs as your user, with your filesystem, your network and your
// kernel. Node's --permission flag is a seat belt, not a sandbox. Real isolation: gVisor or a microVM,
// egress only through an allowlisting proxy, no credentials inside.

export type Result = { exitCode: number | null; stdout: string; stderr: string; timedOut: boolean; truncated: boolean; ms: number };

const WIN = process.platform === "win32";

function scrubbedEnv(workdir: string): Record<string, string> {
  // Allowlist: nothing from the parent unless named. NODE_OPTIONS is gone too, so no --require injection.
  const env: Record<string, string> = { PATH: dirname(process.execPath), HOME: workdir, TMPDIR: workdir, TEMP: workdir, TMP: workdir };
  if (WIN && process.env.SYSTEMROOT) env.SYSTEMROOT = process.env.SYSTEMROOT;
  return env;
}

function kill(child: ChildProcess): void {
  if (WIN || child.pid === undefined) child.kill("SIGKILL"); // direct child only on Windows (taskkill /T for a tree)
  else process.kill(-child.pid, "SIGKILL"); // negative pid: the whole process group
}

export async function runUntrusted(code: string, timeoutMs = 5000, maxOutput = 64_000): Promise<Result> {
  const workdir = mkdtempSync(join(tmpdir(), "sbx-"));
  const start = performance.now();
  try {
    writeFileSync(join(workdir, "main.mjs"), code);
    const child = spawn(process.execPath, ["main.mjs"], {
      cwd: workdir,
      env: scrubbedEnv(workdir),
      stdio: ["ignore", "pipe", "pipe"],
      detached: !WIN, // own process group on POSIX; on Windows it would open a console
      windowsHide: true,
    });
    let truncated = false;
    const collect = (stream: NodeJS.ReadableStream | null) => {
      const parts: Buffer[] = [];
      let size = 0;
      stream?.on("data", (chunk: Buffer) => {
        const room = maxOutput - size;
        if (room > 0) parts.push(chunk.subarray(0, room));
        if (chunk.length > room) truncated = true; // keep draining so the child never blocks
        size = Math.min(maxOutput, size + chunk.length);
      });
      return parts;
    };
    const out = collect(child.stdout);
    const err = collect(child.stderr);
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      kill(child);
    }, timeoutMs);
    const exit = await new Promise<number | null>((resolve, reject) => {
      child.once("error", reject); // spawn failure, for example a missing executable
      child.once("close", (c) => resolve(c));
    }).finally(() => clearTimeout(timer));
    return {
      exitCode: timedOut ? null : exit,
      stdout: Buffer.concat(out).toString("utf8"),
      stderr: Buffer.concat(err).toString("utf8"),
      timedOut,
      truncated,
      ms: Math.round(performance.now() - start),
    };
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }
}
