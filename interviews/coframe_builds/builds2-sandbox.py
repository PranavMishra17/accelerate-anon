# Exercise: run untrusted generated Python in a child process: wall-clock timeout, output caps, scrubbed env, temp dir removed, structured result. Not a security boundary.
# Run its test: python interviews/coframe_builds/builds2-sandbox_test.py
import os
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from dataclasses import dataclass

# What this does NOT isolate: the child runs as your user, with your filesystem (it can read ~/.aws),
# your network (it can exfiltrate), and your kernel. Real isolation is a layer below: gVisor or a microVM,
# no network except through an allowlisting proxy, no credentials inside.


@dataclass
class Result:
    exit_code: int | None      # None when we killed it
    stdout: str
    stderr: str
    timed_out: bool
    truncated: bool
    seconds: float


def _drain(pipe, cap: int, buf: bytearray, flags: dict) -> None:
    # Keep reading after the cap so the child never blocks on a full pipe; drop the excess.
    while chunk := pipe.read1(65536):
        room = cap - len(buf)
        if room > 0:
            buf += chunk[:room]
        if len(chunk) > room:
            flags["truncated"] = True
    pipe.close()


def _env(workdir: str) -> dict[str, str]:
    # Allowlist, not denylist: nothing from the parent unless named here. No API keys, no tokens.
    env = {"PATH": os.path.dirname(sys.executable), "HOME": workdir, "TMPDIR": workdir, "TEMP": workdir, "TMP": workdir}
    if os.name == "nt" and "SYSTEMROOT" in os.environ:
        env["SYSTEMROOT"] = os.environ["SYSTEMROOT"]   # Windows Python cannot start without it
    return env


def _kill(proc: subprocess.Popen) -> None:
    if os.name == "nt":
        proc.kill()      # direct child only; a tree needs taskkill /T /F or a Job Object
    else:
        os.killpg(proc.pid, signal.SIGKILL)   # the whole group: grandchildren too


def run_untrusted(code: str, timeout_s: float = 5.0, max_output: int = 64_000) -> Result:
    workdir = tempfile.mkdtemp(prefix="sbx-")
    start = time.monotonic()
    try:
        with open(os.path.join(workdir, "main.py"), "w", encoding="utf-8") as f:
            f.write(code)
        proc = subprocess.Popen(
            [sys.executable, "-I", "-B", "main.py"],    # -I: ignore PYTHON* env and user site; -B: no .pyc
            cwd=workdir, env=_env(workdir),
            stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            start_new_session=os.name != "nt",          # own process group, so we can kill the tree
        )
        out, err, flags = bytearray(), bytearray(), {"truncated": False}
        readers = [threading.Thread(target=_drain, args=(p, max_output, b, flags), daemon=True)
                   for p, b in ((proc.stdout, out), (proc.stderr, err))]
        for t in readers:
            t.start()
        timed_out = False
        try:
            proc.wait(timeout=timeout_s)
        except subprocess.TimeoutExpired:
            timed_out = True
            _kill(proc)
            proc.wait()
        for t in readers:
            t.join(timeout=1)    # a surviving grandchild can hold the pipe open; do not hang on it
        return Result(
            None if timed_out else proc.returncode,
            out.decode("utf-8", "replace"), err.decode("utf-8", "replace"),
            timed_out, flags["truncated"], round(time.monotonic() - start, 3),
        )
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
