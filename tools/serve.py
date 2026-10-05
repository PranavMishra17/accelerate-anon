"""Serve the study site on localhost with HTTP Range support, so videos can be scrubbed and skipped.

python tools/serve.py [port]   (default 8000; study.cmd runs it)

Python's http.server answers every request with the whole file, and browsers cannot seek in a video served that
way. This adds byte ranges (206 Partial Content) and nothing else."""
import os, re, subprocess, sys
from urllib.parse import parse_qs, urlparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class RangeHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # /__reveal?f=<name>: select a video in Explorer. Only files in media/videos, by bare name.
        u = urlparse(self.path)
        if u.path == "/__reveal":
            name = os.path.basename(parse_qs(u.query).get("f", [""])[0])
            path = os.path.join(self.directory, "media", "videos", name)
            if not name or not os.path.isfile(path):
                self.send_error(404, "no such video"); return
            subprocess.Popen(["explorer", "/select,", os.path.normpath(path)])
            self.send_response(204); self.end_headers(); return
        super().do_GET()

    def send_head(self):
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not rng or os.path.isdir(path) or not os.path.isfile(path):
            return super().send_head()
        m = re.match(r"bytes=(\d*)-(\d*)$", rng.strip())
        size = os.path.getsize(path)
        if not m or (not m.group(1) and not m.group(2)):
            return super().send_head()
        if m.group(1):
            start = int(m.group(1)); end = int(m.group(2)) if m.group(2) else size - 1
        else:                                   # bytes=-N: the last N bytes
            start = max(0, size - int(m.group(2))); end = size - 1
        if start >= size:
            self.send_error(416, "Range not satisfiable"); return None
        end = min(end, size - 1)
        f = open(path, "rb")
        f.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        self._left = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        left = getattr(self, "_left", None)
        if left is None:
            return super().copyfile(source, outputfile)
        while left > 0:
            chunk = source.read(min(64 * 1024, left))
            if not chunk:
                break
            try:
                outputfile.write(chunk)
            except (BrokenPipeError, ConnectionResetError):   # the browser cancelled a range it no longer needs
                break
            left -= len(chunk)
        self._left = None

    def end_headers(self):
        if not self.headers.get("Range"):
            self.send_header("Accept-Ranges", "bytes")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ThreadingHTTPServer(("127.0.0.1", port), partial(RangeHandler, directory=root)).serve_forever()
