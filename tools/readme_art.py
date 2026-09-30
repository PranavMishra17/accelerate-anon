"""Draw the README's header art: the Accelerate icon with a starfield, and a square button per page.

    python tools/readme_art.py        writes docs/art/*.svg

Everything is self-contained SVG (GitHub READMEs allow no CSS). The icon reuses brand/accelerate.svg;
the buttons reuse the site's Lucide icons (figures/icons.js) and the dark-theme colours of site/tokens.css.
"""
import io, json, os, re, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "art")
FONT = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif"

icons_js = io.open(os.path.join(ROOT, "figures", "icons.js"), encoding="utf-8").read()
def icon(name):
    m = re.search(r'"%s":\s*("(?:[^"\\]|\\.)*")' % re.escape(name), icons_js)   # a JSON string, quotes escaped
    if not m:
        raise SystemExit("no icon " + name)
    return json.loads(m.group(1))

# The four pages: file, label, icon, the page's colour (the dark-theme --cat-* token), a deeper shade for the glow.
PAGES = [
    ("system-design", ["System", "design"], "network", "#8DB0DD", "#3F6EA8"),
    ("coding", ["Coding", "primer"], "code", "#8FC4A1", "#3F7A55"),
    ("cheatsheet", ["Cheat", "sheet"], "layout-grid", "#DDA48A", "#A85F3F"),
    ("deep-learning", ["Deep", "learning"], "audio-waveform", "#C990AE", "#7A3B5C"),
]

def button(name, label, ic, colour, deep):
    lines = "".join('<text x="64" y="%d" text-anchor="middle">%s</text>' % (92 + 15 * i, w) for i, w in enumerate(label))
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">\n'
            '  <title>%s</title>\n'
            '  <defs>\n'
            '    <radialGradient id="g" cx="0.5" cy="0.3" r="0.75"><stop offset="0" stop-color="%s" stop-opacity="0.32"/>'
            '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>\n'
            '    <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.16"/>'
            '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0.04"/></linearGradient>\n'
            '  </defs>\n'
            '  <rect x="1" y="1" width="126" height="126" rx="26" fill="#1B1A1F"/>\n'
            '  <rect x="1" y="1" width="126" height="126" rx="26" fill="url(#g)"/>\n'
            '  <rect x="1.5" y="1.5" width="125" height="125" rx="25.5" fill="none" stroke="url(#rim)"/>\n'
            '  <g transform="translate(44 22) scale(1.6667)" fill="none" stroke="%s" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">%s</g>\n'
            '  <g fill="#ECEBF1" font-family="%s" font-size="13" font-weight="600">%s</g>\n'
            '</svg>\n') % (" ".join(label), deep, deep, colour, ic, FONT, lines)

def hero():
    src = io.open(os.path.join(ROOT, "brand", "accelerate.svg"), encoding="utf-8").read()
    rnd = random.Random(7)
    stars = []
    for _ in range(22):
        x, y = rnd.uniform(14, 242), rnd.uniform(14, 242)
        if 70 < x < 230 and 20 < y < 190:   # keep the ship's path clear
            continue
        stars.append('<circle cx="%.1f" cy="%.1f" r="%.2f" opacity="%.2f"/>' % (x, y, rnd.uniform(0.6, 1.5), rnd.uniform(0.35, 0.85)))
    twinkle = "".join(
        '<circle cx="%d" cy="%d" r="%.1f"><animate attributeName="opacity" values="0.15;0.95;0.15" dur="%ss" begin="%ss" repeatCount="indefinite"/></circle>'
        % (x, y, r, d, b) for x, y, r, d, b in [(40, 206, 1.6, 3.6, 0), (226, 222, 1.4, 4.4, 1.2), (24, 92, 1.3, 5.2, 2.1)])
    extra = ('<radialGradient id="bloom" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#9DB8FF" stop-opacity="0.38"/>'
             '<stop offset="0.55" stop-color="#3D72FF" stop-opacity="0.12"/><stop offset="1" stop-color="#3D72FF" stop-opacity="0"/></radialGradient>'
             '<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35"/>'
             '<stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.05"/><stop offset="1" stop-color="#9DB8FF" stop-opacity="0.25"/></linearGradient>')
    out = src.replace("</defs>", extra + "</defs>", 1)
    # A bloom of light behind the ship, more stars, three that twinkle, and a faint rim.
    out = out.replace('<g transform="translate(156 98) rotate(45)">',
                      '<circle cx="150" cy="104" r="96" fill="url(#bloom)"/>'
                      '<g fill="#FFFFFF">' + "".join(stars) + twinkle + '</g>'
                      '<g transform="translate(156 98) rotate(45)">', 1)
    out = out.replace("</svg>", '<rect x="1.5" y="1.5" width="253" height="253" rx="55" fill="none" stroke="url(#edge)" stroke-width="2"/></svg>', 1)
    return out

os.makedirs(OUT, exist_ok=True)
io.open(os.path.join(OUT, "accelerate.svg"), "w", encoding="utf-8", newline="\n").write(hero())
for name, label, ic, colour, deep in PAGES:
    io.open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8", newline="\n").write(button(name, label, icon(ic), colour, deep))
print("wrote docs/art: accelerate.svg and", len(PAGES), "buttons")
