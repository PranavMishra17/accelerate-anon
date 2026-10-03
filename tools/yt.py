"""Check YouTube videos before linking them: python tools/yt.py <url or id> [...]
Find them: python tools/yt.py --search "query" [n]   (YouTube's results page; id, title, channel, minutes, views)

Prints one JSON line per video: {"id", "url", "title", "ch", "len"} where len is minutes (rounded
up, null if YouTube would not say), or {"url", "error"} when the video is missing or private.
Title and channel come from YouTube's oEmbed endpoint; the length from the watch page.
Results are cached (YT_CACHE, default %TEMP%/yt-cache.json) so several agents never fetch the same
video twice, and requests are spaced and retried, because YouTube rate-limits bursts."""
import json, math, os, re, sys, tempfile, time, urllib.error, urllib.parse, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      "Accept-Language": "en", "Cookie": "CONSENT=YES+1; SOCS=CAI"}
CACHE = os.environ.get("YT_CACHE") or os.path.join(tempfile.gettempdir(), "yt-cache.json")


def load():
    try:
        return json.load(open(CACHE, encoding="utf-8"))
    except Exception:
        return {}


def save(c):
    try:
        cur = load(); cur.update(c)
        tmp = CACHE + ".%d" % os.getpid()
        json.dump(cur, open(tmp, "w", encoding="utf-8"))
        os.replace(tmp, CACHE)
    except Exception as e:
        print("cache write failed: %s" % e, file=sys.stderr)


def vid(s):
    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})", s)
    return m.group(1) if m else (s if re.fullmatch(r"[A-Za-z0-9_-]{11}", s) else None)


def get(url, tries=4):
    wait = 2.0
    for n in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20).read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and n < tries - 1:
                time.sleep(wait); wait *= 2; continue
            raise


def check(s, cache):
    i = vid(s)
    if not i:
        return {"url": s, "error": "not a YouTube video link"}
    if i in cache and (cache[i].get("error") or cache[i].get("len")):
        return cache[i]
    url = "https://www.youtube.com/watch?v=" + i
    try:
        o = json.loads(get("https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(url, safe="")))
    except urllib.error.HTTPError as e:
        out = {"url": url, "error": "oEmbed %s: missing, private or not embeddable" % e.code} if e.code in (400, 401, 403, 404) else {"url": url, "error": "oEmbed failed: %s" % e}
        if "missing" in out["error"]:
            cache[i] = out
        return out
    except Exception as e:
        return {"url": url, "error": "oEmbed failed: %s" % e}
    out = {"id": i, "url": url, "title": o.get("title", ""), "ch": o.get("author_name", ""), "len": None}
    if os.environ.get("YT_NO_LEN"):   # existence, title and channel only: fast when YouTube is rate-limiting the watch page
        return out
    try:
        time.sleep(1.2)
        page = get(url)
        m = re.search(r'"lengthSeconds":"(\d+)"', page) or re.search(r'itemprop="duration" content="PT(\d+)M(\d+)S"', page)
        if m:
            out["len"] = math.ceil(int(m.group(1)) / 60) if m.lastindex == 1 else int(m.group(1)) + (1 if int(m.group(2)) else 0)
    except Exception as e:
        print("length unavailable for %s: %s" % (i, e), file=sys.stderr)
    cache[i] = out
    return out


def minutes(text):
    parts = [int(p) for p in (text or "").split(":") if p.isdigit()]
    secs = 0
    for p in parts:
        secs = secs * 60 + p
    return math.ceil(secs / 60) if parts else None


def search(query, n, cache):
    """YouTube's own results page, no API key: [{id, url, title, ch, len, views}], videos only (no Shorts, live or mixes).
    Each result is cached with its length, so a later check needs no watch-page fetch."""
    page = get("https://www.youtube.com/results?search_query=" + urllib.parse.quote(query))
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", page)
    if not m:
        raise RuntimeError("no results data on the page (consent wall or layout change)")
    found = []

    def walk(o):
        if isinstance(o, dict):
            v = o.get("videoRenderer")
            if v and v.get("lengthText"):
                found.append({"id": v["videoId"], "url": "https://www.youtube.com/watch?v=" + v["videoId"],
                              "title": "".join(r.get("text", "") for r in v["title"]["runs"]),
                              "ch": "".join(r.get("text", "") for r in v.get("ownerText", {}).get("runs", [])),
                              "len": minutes(v["lengthText"].get("simpleText")),
                              "views": (v.get("viewCountText") or {}).get("simpleText", "")})
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)
    walk(json.loads(m.group(1)))
    for f in found:
        cache.setdefault(f["id"], {k: f[k] for k in ("id", "url", "title", "ch", "len")})
    return found[:n]


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8")   # titles carry any script; the Windows console default would crash
    except Exception:
        pass
    cache = load()
    if sys.argv[1:2] == ["--search"]:   # python tools/yt.py --search "query" [n]
        for r in search(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 10, cache):
            print(json.dumps(r, ensure_ascii=False))
        save(cache)
        sys.exit(0)
    for a in sys.argv[1:]:
        print(json.dumps(check(a, cache), ensure_ascii=False))
    save(cache)
