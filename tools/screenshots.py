"""Capture the README's screenshots from the live site with headless Edge.

    python tools/screenshots.py          writes docs/screenshots/*.png

Run it after the Pages deploy finishes, so the pictures show what is live.
"""
import os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
SITE = "https://pranavmishra17.github.io/self-study/"
OUT = os.path.join(ROOT, "docs", "screenshots")
SHOTS = {
    "home": "",
    "system-design": "SYSTEM%20DESIGN.html#/designs/notebooklm/entities",
    "coding": "CODING.html#core",
    "cheatsheet": "CHEATSHEET.html",
    "deep-learning": "DEEP-LEARNING.html",
}

os.makedirs(OUT, exist_ok=True)
for name, path in SHOTS.items():
    out = os.path.join(OUT, name + ".png")
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
                    "--window-size=1440,900", "--virtual-time-budget=6000", "--blink-settings=preferredColorScheme=1",
                    "--screenshot=" + out, SITE + path], check=True, capture_output=True, timeout=120)
    print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out) // 1024, "KB")
