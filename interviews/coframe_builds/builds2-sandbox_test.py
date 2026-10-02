# Test for builds2-sandbox.py: plain asserts, real child processes.
# Run: python interviews/coframe_builds/builds2-sandbox_test.py
import importlib.util
import os
import pathlib
import sys

_p = pathlib.Path(__file__).with_name("builds2-sandbox.py")
_spec = importlib.util.spec_from_file_location("builds2_sandbox", _p)
m = importlib.util.module_from_spec(_spec)
sys.modules["builds2_sandbox"] = m
_spec.loader.exec_module(m)

# Normal run: stdout, stderr and the exit code come back structured.
r = m.run_untrusted("import sys\nprint('hi')\nprint('warn', file=sys.stderr)\nsys.exit(3)")
assert (r.exit_code, r.stdout.strip(), r.stderr.strip(), r.timed_out, r.truncated) == (3, "hi", "warn", False, False), r

# A crash is a result, not an exception in the parent.
r = m.run_untrusted("raise ValueError('boom')")
assert r.exit_code == 1 and "ValueError: boom" in r.stderr

# Wall-clock timeout: an infinite loop is killed and reported.
r = m.run_untrusted("while True:\n    pass", timeout_s=0.5)
assert r.timed_out and r.exit_code is None and r.seconds < 5, r

# A sleeping process is caught by wall clock, which a CPU limit would miss.
r = m.run_untrusted("import time\ntime.sleep(30)", timeout_s=0.5)
assert r.timed_out and r.seconds < 5

# Output cap: a megabyte of output is cut to the cap, flagged, and the child is not blocked.
r = m.run_untrusted("print('x' * 1_000_000)", max_output=1000)
assert len(r.stdout) == 1000 and r.truncated and r.exit_code == 0 and not r.timed_out

# Scrubbed environment: a secret in the parent is not visible to the child.
os.environ["FAKE_API_KEY"] = "sk-test-not-real"
r = m.run_untrusted("import os\nprint(os.environ.get('FAKE_API_KEY'))\nprint(sorted(os.environ))")
assert r.stdout.splitlines()[0] == "None", r.stdout
assert "FAKE_API_KEY" not in r.stdout

# Temp working directory: the child runs inside it, and it is gone afterwards.
r = m.run_untrusted("import os\nopen('scratch.txt', 'w').write('x')\nprint(os.getcwd())")
cwd = r.stdout.strip()
assert os.path.basename(cwd).startswith("sbx-") and not os.path.exists(cwd), cwd

print("builds2-sandbox: ok")
