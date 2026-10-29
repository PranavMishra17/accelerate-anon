"""Fail the build when new CSS brings back the patterns DESIGN.md calls AI slop.

Flags, per CSS rule:
  card    a background fill together with a 2 px or wider coloured border-left/top (a tinted card with a spine)
  italic  font-style: italic
  px-size a literal font-size in px instead of var(--fs-*)
Rules that already break these are grandfathered in tools/design_lint_baseline.json; only new ones fail.

  python tools/design_lint.py                 check the repo
  python tools/design_lint.py FILE...         check these files (still against the baseline)
  python tools/design_lint.py --write-baseline  re-grandfather everything (needs Pranav's say-so)
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASELINE = ROOT / "tools" / "design_lint_baseline.json"
SKIP = {"_site", "archive", "node_modules", ".claude", "private", ".fleet"}
FIX = {
    "card": "no tinted card with a coloured rule (DESIGN.md 5, 9): separate with a hairline (border-top: 1px solid var(--rule)) and label with the page's own small muted label (.sxl in the tracker, .lab on loop pages)",
    "italic": "no italic (one style per section): use colour (var(--soft) or var(--muted)) or weight 600",
    "px-size": "font sizes come from the six tokens: var(--fs-xs|sm|md|lg|xl|2xl)",
}
RULE = re.compile(r"([^{}]+)\{([^{}]*)\}")


def files():
    for p in list(ROOT.glob("*.html")) + [ROOT / "interviews" / "template.html"] + list(ROOT.rglob("*.css")):
        if not SKIP & set(p.relative_to(ROOT).parts) and p.exists():
            yield p


def css_of(p):
    s = p.read_text(encoding="utf-8")
    return s if p.suffix == ".css" else "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", s, re.S))


def flags(body):
    b = body.lower()
    out = []
    fill = re.search(r"background(-color)?\s*:\s*(?!none|transparent|inherit)[^;]+", b)
    spine = re.search(r"border-(left|top)\s*:\s*([2-9]|\d\d)px", b) or re.search(r"border-(left|top)-width\s*:\s*([2-9]|\d\d)px", b)
    if fill and spine:
        out.append("card")
    if re.search(r"font-style\s*:\s*italic", b):
        out.append("italic")
    if re.search(r"font-size\s*:\s*\d+(\.\d+)?px", b):
        out.append("px-size")
    return out


def scan(paths):
    found = set()
    for p in paths:
        css = re.sub(r"/\*.*?\*/", "", css_of(p), flags=re.S)
        for sel, body in RULE.findall(css):
            sel = " ".join(sel.split())
            if sel.startswith("@"):
                continue
            for f in flags(body):
                found.add((p.relative_to(ROOT).as_posix() if p.is_relative_to(ROOT) else p.name, sel, f))
    return found


def main(argv):
    if argv[:1] == ["--write-baseline"]:
        BASELINE.write_text(json.dumps(sorted(map(list, scan(files()))), indent=1) + "\n", encoding="utf-8")
        print("baseline written")
        return 0
    paths = [Path(a).resolve() for a in argv] or list(files())
    known = {tuple(x) for x in json.loads(BASELINE.read_text(encoding="utf-8"))}
    known_sel = {(s, f) for _, s, f in known}
    new = sorted(x for x in scan(paths) if x not in known and (x[1], x[2]) not in known_sel)
    for f, sel, kind in new:
        print(f"{f}: `{sel}`: {kind}: {FIX[kind]}")
    if new:
        print(f"design_lint: {len(new)} new slop pattern(s). Fix them; DESIGN.md has the rules.")
        return 1
    print("design_lint: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
