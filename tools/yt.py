"""Check YouTube videos before linking them: python tools/yt.py <url or id> [...]

Prints one JSON line per video: {"id", "url", "title", "ch", "len"} where len is minutes (rounded
up), or {"url", "error"} when the video is missing, private or not embeddable. Title and channel
come from YouTube's oEmbed endpoint; the length from the watch page's lengthSeconds."""
import json, math, re, sys, urllib.parse, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept-Language": "en"}


def vid(s):
    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})", s)
    return m.group(1) if m else (s if re.fullmatch(r"[A-Za-z0-9_-]{11}", s) else None)


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20).read().decode("utf-8", "replace")


def check(s):
    i = vid(s)
    if not i:
        return {"url": s, "error": "not a YouTube video link"}
    url = "https://www.youtube.com/watch?v=" + i
    try:
        o = json.loads(get("https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(url, safe="")))
    except Exception as e:
        return {"url": url, "error": "oEmbed failed: %s" % e}
    out = {"id": i, "url": url, "title": o.get("title", ""), "ch": o.get("author_name", "")}
    try:
        m = re.search(r'"lengthSeconds":"(\d+)"', get(url))
        out["len"] = math.ceil(int(m.group(1)) / 60) if m else None
    except Exception as e:
        out["len"] = None
    return out


if __name__ == "__main__":
    for a in sys.argv[1:]:
        print(json.dumps(check(a), ensure_ascii=False))
