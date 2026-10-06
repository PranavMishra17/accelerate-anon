"""Projects: one tab per project, each an overview and a topic per explainer video.

Edit this file, then `python projects/build.py` writes PROJECTS.html. A topic plays media/videos/<video>.mp4 when the
file exists locally; the public site has no video files, so it shows the topic without the player.

Topic fields: id, title, video, lead, points ("Head: text", head bold), code (where to look), plan ([label, href]
into the guide), gaps (what is not built, or where the docs and the code disagree; code wins).
Facts come from the code on main; topics are filled in as each video is made.
"""

G = "SYSTEM%20DESIGN.html#/patterns/"

PROJECTS = [
    {"id": "mockflow", "title": "MockFlow-AI",
     "tagline": "A voice mock-interview coach: it interviews out loud, reads live code as you type, and scores delivery.",
     "links": [["Live site", "https://mockflow.pranavmishra.dedyn.io"], ["Code", "https://github.com/PranavMishra17/MockFlow-AI"]],
     "stack": ["Python 3.12, Flask", "LiveKit Agents over WebRTC", "Deepgram speech to text", "OpenAI model and speech",
               "Postgres", "Piston code execution", "Google Cloud e2-micro, Docker Compose, Caddy"],
     "topics": []},
]
