"""Capture the README's screenshots from the live site, in the site's dark theme, with Playwright.

    python tools/screenshots.py          writes docs/screenshots/*.png

Run it after the Pages deploy finishes, so the pictures show what is live. Page shots are one
screen (1440x900); diagram shots are the diagram element alone.
"""
import os
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://pranavmishra17.github.io/accelerate-anon/"
OUT = os.path.join(ROOT, "docs", "screenshots")

PAGES = {
    "system-design": "SYSTEM%20DESIGN.html#/designs/notebooklm/entities",
    "coding": "CODING.html#core",
    "cheatsheet": "CHEATSHEET.html",
    "deep-learning": "DEEP-LEARNING.html",
}
# Diagrams: (file, page, css selector, which match to take)
DIAGRAMS = [
    ("diagram-design", "SYSTEM%20DESIGN.html#/designs/email-agent/hld", "section:not([hidden]) .diagram svg", 0),
    ("diagram-pattern", "SYSTEM%20DESIGN.html#/patterns", ".tech .diagram svg, .diagram svg", 0),
    ("diagram-deep-learning", "DEEP-LEARNING.html#/architecture", "figure:visible svg", 1),
]


def open_page(page, path):
    page.goto(SITE + path, wait_until="networkidle")
    page.evaluate("document.fonts && document.fonts.ready")
    page.wait_for_timeout(1200)


def main():
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
        except Exception:
            browser = p.chromium.launch(channel="msedge")
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1.5, color_scheme="dark")
        page = ctx.new_page()
        for name, path in PAGES.items():
            open_page(page, path)
            page.evaluate("window.scrollTo(0, 0)")
            page.wait_for_timeout(300)
            out = os.path.join(OUT, name + ".png")
            page.screenshot(path=out)
            print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out) // 1024, "KB")
        for name, path, selector, nth in DIAGRAMS:
            open_page(page, path)
            el = page.locator(selector).nth(nth)
            el.scroll_into_view_if_needed()
            page.wait_for_timeout(400)
            out = os.path.join(OUT, name + ".png")
            el.screenshot(path=out)
            print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out) // 1024, "KB")
        browser.close()


if __name__ == "__main__":
    main()
