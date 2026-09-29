"""Vanguard, technical round: a skeleton, to be filled when the details arrive.

The round is coming; the date, the panel and the format are not known yet. Fill LOOP
first (when_iso, when, who, format, bar), then add prep the way mphasis.py does it:
SHOW_UP, SCRIPTS, QA and QA_ORDER, and SESSION_IDS if the tracker gets sessions for it.
Each section's tab appears on the page once it has content.
"""

LOOP = {
    "id": "vanguard",
    "title": "Vanguard, technical",
    "subtitle": "Details to be filled",
    # Brand colour for the hub's wordmark. Vanguard's red: .vg-button--red
    # {background-color: #96151d} in investor.vanguard.com's clientlib-base CSS.
    # brand_dark: the same hue lightened to 5:1 on the dark surface, kept a step darker
    # than Mphasis's pink so the two read apart in dark mode.
    "brand": "#96151D", "brand_dark": "#EA6971",
    "when_iso": "",   # empty: the hub shows "Upcoming, date to be set"
    "when": "Date to be set",
    "who": "To be filled.",
    "format": "To be filled: the length, who is on the call, and whether there is coding on a shared screen.",
    "bar": "",
    "extra": ("Nothing is prepared yet. When the details arrive, this page gets a Prep tab with your "
              "story and the question banks, and the tracker gets sessions for it."),
}

SESSION_IDS = []

SOURCES = [
    {"label": "Vanguard: company site", "url": "https://corporate.vanguard.com/",
     "why": "Company information and investment research."},
]
