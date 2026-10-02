"""Rebuild everything generated, then run every check. One command, so no step is skipped.

    python tools/rebuild.py            stamp, build (loop pages, the interviews hub, private pages when present, the sheet),
                                       check, then build and check the public site (_site/)
    python tools/rebuild.py --alaap    also rebuild ALAAP.html and DEEP-LEARNING.html (needs the Alaap repo and a TrenTorch checkout)

Order matters: figure and coding files first, then the pages that stamp or inline them.
Stops at the first step that fails and says which.
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOOPS = [f[:-3] for f in sorted(os.listdir(os.path.join(ROOT, "interviews")))
         if f.endswith(".py") and f not in ("build.py", "hub.py") and not f.startswith("_")]

steps = [["node", "figures/check.js"], ["node", "baseline/check.js"], ["node", "baseline/quiz/check.js"], ["node", "data/mcq/check.js"],["python", "coding/test_data.py"], ["python", "figures/stamp.py"]]
steps += [["python", "interviews/build.py", m] for m in LOOPS]
steps.append(["python", "interviews/hub.py"])   # INTERVIEWS.html, after the loop pages
PRIVATE = os.path.join(ROOT, "private")   # gitignored, local only: each private/<page>/build.py
if os.path.isdir(PRIVATE):
    steps += [["python", "private/%s/build.py" % d] for d in sorted(os.listdir(PRIVATE))
              if os.path.exists(os.path.join(PRIVATE, d, "build.py"))]
steps.append(["python", "coding/build_sheet.py"])
if "--alaap" in sys.argv:
    steps += [["python", "alaap/build.py"], ["python", "alaap/build.py", "--public"]]
steps.append(["python", "tools/build_public.py"])   # last: the public copy of everything above, checked

for cmd in steps:
    print("\n$ " + " ".join(cmd))
    r = subprocess.run(cmd, cwd=ROOT)
    if r.returncode:
        sys.exit("FAILED: " + " ".join(cmd))
print("\nAll rebuilt and checked.")
