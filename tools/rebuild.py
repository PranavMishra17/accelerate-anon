"""Rebuild everything generated, then run every check. One command, so no step is skipped.

    python tools/rebuild.py            stamp, build, check
    python tools/rebuild.py --alaap    also rebuild ALAAP.html (needs the Alaap repo and a TrenTorch checkout)

Order matters: figure and coding files first, then the pages that stamp or inline them.
Stops at the first step that fails and says which.
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOOPS = [f[:-3] for f in sorted(os.listdir(os.path.join(ROOT, "interviews")))
         if f.endswith(".py") and f not in ("build.py",) and not f.startswith("_")]

steps = [["node", "figures/check.js"], ["python", "coding/test_data.py"], ["python", "figures/stamp.py"]]
steps += [["python", "interviews/build.py", m] for m in LOOPS]
if os.path.exists(os.path.join(ROOT, "alfred", "build.py")):
    steps.append(["python", "alfred/build.py"])
steps.append(["python", "coding/build_sheet.py"])
if "--alaap" in sys.argv:
    steps.append(["python", "alaap/build.py"])

for cmd in steps:
    print("\n$ " + " ".join(cmd))
    r = subprocess.run(cmd, cwd=ROOT)
    if r.returncode:
        sys.exit("FAILED: " + " ".join(cmd))
print("\nAll rebuilt and checked.")
