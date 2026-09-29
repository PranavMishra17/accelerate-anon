"""Oxus technical, 23 September 2026: a minimal archive page.

The loop has happened. Its three general system design sessions moved into the
main plan (weeks 2 to 4); what stays here is the Oxus-specific preparation, kept
for reference and still counted in the tracker.
"""

LOOP = {
    "id": "oxus",
    "title": "Oxus, technical",
    "subtitle": "Audit automation, founding engineer",
    # Brand colour for the hub's wordmark. The indigo of the logo (oxus-ai.com,
    # /logo_horizontal_transparent.png, #0D1666; the favicon is the same). Too dark on the
    # dark surface, so brand_dark is the same hue lightened to 6:1.
    "brand": "#0D1666", "brand_dark": "#909AF1",
    "when_iso": "2026-09-23T14:00:00-04:00",
    "when": "Wednesday 23 September, afternoon",
    "who": "The Oxus technical round.",
    "format": "This loop has happened. The page keeps what was prepared for it, for reference.",
    "bar": "",
    "extra": ("The three design sessions are general system design practice now, in the main plan: "
              "<a href=\"../index.html#/s/2/4\">week 2, evidence ingestion from messy documents</a>, "
              "<a href=\"../index.html#/s/3/4\">week 3, walkthrough to flowchart</a>, and "
              "<a href=\"../index.html#/s/4/4\">week 4, an agent that tests a SOX control</a>."),
    "plan_kicker": "What was prepared",
}

SESSION_IDS = [("wc1", "Before the call"), ("wc5", "Before the call"), ("wc6", "The last hour")]
