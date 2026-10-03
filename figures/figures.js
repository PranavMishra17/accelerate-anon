/* The figures, drawn once and used everywhere: the tracker (index.html) and the interview
   loop pages (interviews/*.html) both read FIGURES.DIA by key. To improve a figure, edit it
   here; every page that shows it picks it up.

   Each entry: { title, cap (html), svg() -> svg markup }. Figures drawn with S use the
   d-* classes in figures.css; "fixed" ones carry their own colours and sit on white. */
var FIGURES = (function () {
  "use strict";

  var S = {};
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /* Every box is a node (data-n, from its id or its label) and every arrow an edge
     (data-e, "from>to"), so figures/viewer.js can explain them. Arrows are drawn before
     all their boxes exist, so each one is matched to the nearest boxes when the figure
     is framed. */
  var drawn = [];
  function slug(t) { return String(t).toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40); }
  function distTo(b, x, y) {
    var dx = Math.max(b.x - x, 0, x - (b.x + b.w)), dy = Math.max(b.y - y, 0, y - (b.y + b.h));
    return Math.sqrt(dx * dx + dy * dy);
  }
  function nearest(x, y) {
    var best = null, bd = 28;
    drawn.forEach(function (b) { var d = distTo(b, x, y); if (d < bd) { bd = d; best = b; } });
    return best;
  }
  S.frame = function (w, h, body) {
    var seen = {};
    body = body.replace(/data-e="@([\d.\-]+),([\d.\-]+),([\d.\-]+),([\d.\-]+)(?:\|([^"]*))?"/g, function (m, x1, y1, x2, y2, id) {
      if (id) { return 'data-e="' + id + '"'; }
      var a = nearest(+x1, +y1), c = nearest(+x2, +y2);
      if (!a || !c || a === c) { return 'data-e-free=""'; }
      var e = a.id + ">" + c.id;
      seen[e] = (seen[e] || 0) + 1;
      return 'data-e="' + e + (seen[e] > 1 ? "#" + seen[e] : "") + '"';
    });
    drawn = [];
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>' +
      '<g color="var(--faint)">' + body + '</g></svg>';
  };
  /* a Lucide icon (figures/icons.js), size in px, coloured by tone */
  S.icon = function (name, x, y, size, tone) {
    var inner = (typeof ICONS !== "undefined" && ICONS[name]) || "";
    if (!inner) { return ""; }
    var k = (size || 18) / 24;
    return '<g class="d-ic d-ic-' + (tone || "flat") + '" transform="translate(' + x + ' ' + y + ') scale(' + k + ')" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</g>';
  };
  /* wrap any markup as a node, for figures that are plots rather than boxes */
  S.node = function (id, markup) { return '<g data-n="' + id + '">' + markup + '</g>'; };
  S.box = function (o) {
    var tone = o.tone || "flat";
    var r = o.r === undefined ? 0 : o.r;
    var id = o.id || (o.label ? slug(o.label) : "");
    if (id) { drawn.push({ id: id, x: o.x, y: o.y, w: o.w, h: o.h }); }
    var s = '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="' + r +
      '" class="d-fill-' + tone + ' d-str-' + tone + '" stroke-width="1.25"' +
      (o.dash ? ' stroke-dasharray="4 3"' : '') + '/>';
    var tx = o.x + o.w / 2;
    if (o.icon) {
      var isz = Math.min(20, o.h - 14);
      s += S.icon(o.icon, o.x + 10, o.y + (o.h - isz) / 2, isz, tone);
      tx = o.x + 14 + isz + (o.w - 14 - isz) / 2;
    }
    if (o.label) {
      var cy = o.y + o.h / 2 + (o.sub ? -3 : 4);
      s += '<text x="' + tx + '" y="' + cy + '" text-anchor="middle" class="d-t-b">' + esc(o.label) + '</text>';
      if (o.sub) {
        s += '<text x="' + tx + '" y="' + (cy + 15) + '" text-anchor="middle" class="d-t-s">' + esc(o.sub) + '</text>';
      }
    }
    return id ? '<g data-n="' + id + '">' + s + '</g>' : s;
  };
  S.arrow = function (x1, y1, x2, y2, o) {
    o = o || {};
    var d = o.curve
      ? "M" + x1 + "," + y1 + " Q" + ((x1 + x2) / 2) + "," + (Math.min(y1, y2) - o.curve) + " " + x2 + "," + y2
      : "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
    var s = '<path d="' + d + '" class="fv-hit"/><path d="' + d + '" class="d-line" stroke-width="1.25" marker-end="url(#ah)"' +
      (o.dash ? ' stroke-dasharray="4 3"' : '') + '/>';
    if (o.label) {
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - (o.curve ? o.curve * 0.55 : 0) - 6;
      s += '<text x="' + mx + '" y="' + my + '" text-anchor="middle" class="d-t-s">' + esc(o.label) + '</text>';
    }
    return '<g data-e="@' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + (o.id ? "|" + o.id : "") + '">' + s + '</g>';
  };
  S.text = function (x, y, t, cls, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "start") + '" class="' +
      (cls || "d-t") + '">' + esc(t) + '</text>';
  };
  S.tag = function (x, y, t) {
    return S.text(x, y, String(t).toUpperCase(), "d-t-x");
  };
  S.bar = function (o) {
    var tone = o.tone || "flat";
    return '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h +
      '" rx="3" class="d-fill-' + tone + ' d-str-' + tone + '" stroke-width="1"/>';
  };
  S.dots = function (x, y, n, gap, tone) {
    var s = "", i;
    for (i = 0; i < n; i++) {
      s += '<circle cx="' + (x + i * gap) + '" cy="' + y + '" r="3.5" class="d-fill-' + tone +
        ' d-str-' + tone + '" stroke-width="1"/>';
    }
    return s;
  };
  S.path = function (d, tone, dash) {
    return '<path d="' + d + '" fill="none" class="d-str-' + (tone || "flat") + '" stroke-width="1.75"' +
      (dash ? ' stroke-dasharray="4 3"' : '') + '/>';
  };
  S.axes = function (x, y, w, h, xl, yl) {
    return '<path d="M' + x + ',' + y + ' L' + x + ',' + (y + h) + ' L' + (x + w) + ',' + (y + h) +
      '" class="d-line" stroke-width="1"/>' +
      S.text(x + w, y + h + 15, xl, "d-t-x", "end") +
      S.text(x - 4, y - 5, yl, "d-t-x", "start");
  };

  /* -------------------------------------------------------------- diagrams */

  var DIA = {};

  DIA.queue = {
    title: "A queue with no backpressure does not slow down. It dies.",
    cap: "<b>Above:</b> the unbounded queue absorbs the overload silently. Throughput on your dashboard looks unchanged, latency climbs without bound, memory climbs with it, and the process dies all at once. <b>Below:</b> a bounded queue fills, refuses work, and pushes that refusal back to the producer. Rejecting work is information. A silent five-minute queue is not.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "No backpressure");
      b += S.box({ id: "producer", x: 0, y: 24, w: 86, h: 40, label: "Producer", tone: "flat" });
      b += S.arrow(90, 44, 128, 44, { label: "fast" });
      b += S.box({ id: "queue-unbounded", x: 132, y: 24, w: 196, h: 40, tone: "alaap", dash: true, icon: "list" });
      b += S.dots(168, 44, 11, 14, "alaap");
      b += S.text(230, 80, "unbounded, growing", "d-t-s", "middle");
      b += S.arrow(332, 44, 370, 44, { label: "slow" });
      b += S.box({ id: "worker", x: 374, y: 24, w: 86, h: 40, label: "Worker", tone: "flat" });
      b += S.text(480, 36, "Latency climbs,", "d-t-s");
      b += S.text(480, 52, "memory climbs,", "d-t-s");
      b += S.text(480, 68, "then it is gone.", "d-t-b");

      b += S.tag(0, 128, "With backpressure");
      b += S.box({ id: "producer", x: 0, y: 138, w: 86, h: 40, label: "Producer", tone: "flat" });
      b += S.arrow(90, 158, 128, 158, {});
      b += S.box({ id: "queue-bounded", x: 132, y: 138, w: 196, h: 40, tone: "sys", icon: "list" });
      b += S.dots(168, 158, 6, 17, "sys");
      b += S.text(230, 194, "bounded, capped", "d-t-s", "middle");
      b += S.arrow(332, 158, 370, 158, {});
      b += S.box({ id: "worker", x: 374, y: 138, w: 86, h: 40, label: "Worker", tone: "flat" });
      b += S.arrow(230, 134, 60, 134, { curve: 34, label: "full — stop sending", dash: true });
      b += S.text(480, 150, "Producer slows.", "d-t-s");
      b += S.text(480, 166, "The system stays up.", "d-t-b");
      return S.frame(600, 210, b);
    }
  };

  DIA.tail = {
    title: "One slow shard in a hundred makes almost every request slow",
    cap: "<b>Fan-out amplifies tails.</b> If a request waits on 100 shards and each is slow 1% of the time, the chance that none is slow is 0.99 to the power 100 — about 37%. So roughly 63% of requests are slow. The p99 of a component becomes the typical case for the system, which is why tail latency is a system property rather than a component detail. The figure draws 12 shards to stand in for the 100.",
    svg: function () {
      var b = "", i, x, barsNormal = "", barsSlow = "";
      b += S.box({ id: "request", x: 0, y: 58, w: 84, h: 38, label: "Request", tone: "now", icon: "send" });
      for (i = 0; i < 12; i++) {
        x = 150 + i * 36;
        var slow = (i === 4 || i === 9);
        b += S.arrow(86, 77, x + 12, slow ? 30 : 48, { id: slow ? "request>shards-slow" : "request>shards-normal" });
        if (slow) { barsSlow += S.bar({ x: x, y: 30, w: 24, h: 74, tone: "alaap" }); }
        else { barsNormal += S.bar({ x: x, y: 48, w: 24, h: 38, tone: "sys" }); }
      }
      b += S.node("shards-normal", barsNormal);
      b += S.node("shards-slow", barsSlow);
      b += S.text(150, 126, "100 shards, 12 drawn: 2 slow, each 1% of the time", "d-t-s");
      b += S.text(150, 148, "P(no shard is slow) = 0.99^100 ≈ 37%", "d-t");
      b += S.text(150, 168, "So ~63% of requests wait on a slow shard.", "d-t-b");
      return S.frame(600, 180, b);
    }
  };

  DIA.skew = {
    title: "Hashing spreads keys evenly. It does not spread traffic evenly.",
    cap: "<b>Skew is a key-choice problem, not bad luck.</b> Real usage is power-law: one customer, one scenario family, one hour of the day carries a disproportionate share. All of that key's events hash to one partition however good the hash is, and that partition becomes the ceiling for the whole system.",
    svg: function () {
      var b = "", i;
      var heights = [26, 22, 30, 24, 96, 20, 28, 25];
      b += S.box({ id: "requests", x: 20, y: 0, w: 140, h: 32, label: "All requests", tone: "flat", icon: "inbox" });
      b += S.arrow(164, 16, 196, 16, {});
      b += S.box({ id: "hash", x: 200, y: 0, w: 140, h: 32, label: "hash(user id)", tone: "sys", icon: "shuffle" });
      var bars = "", tags = "";
      for (i = 0; i < 8; i++) {
        var h = heights[i];
        var hot = h > 60;
        if (!hot) { bars += S.bar({ x: i * 60, y: 176 - h, w: 44, h: h, tone: "sys" }); }
        tags += S.text(i * 60 + 22, 192, "p" + i, "d-t-s", "middle");
      }
      b += S.node("partitions", bars + tags);
      b += S.box({ id: "hot-partition", x: 4 * 60, y: 176 - 96, w: 44, h: 96, tone: "alaap" });
      b += S.path("M0,80 L480,80", "flat", true);
      b += S.text(486, 84, "capacity", "d-t-x");
      b += S.arrow(220, 32, 40, 74, { id: "hash>partitions", label: "everyone else" });
      b += S.arrow(262, 32, 262, 78, { id: "hash>hot-partition", label: "one user, 4%", dash: true });
      b += S.text(0, 220, "Every other partition is idle. The system's throughput is now one partition's throughput.", "d-t-s");
      return S.frame(600, 238, b);
    }
  };

  DIA.storage = {
    title: "Two ways to write, and what each one costs you",
    cap: "<b>An LSM-tree appends.</b> Writes go to memory, then flush as sorted files, and merging is deferred to background compaction — so writes are cheap and a read may have to check several layers. <b>A B-tree updates in place.</b> Reads go straight to the right page; writes pay for random IO. Eval traces are written once, never updated, read in bulk — which is why they belong in object storage rather than in either.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "LSM-tree — append");
      b += S.box({ x: 0, y: 24, w: 74, h: 34, label: "write", tone: "now" });
      b += S.arrow(78, 41, 108, 41, {});
      b += S.box({ x: 112, y: 24, w: 84, h: 34, label: "memtable", tone: "sys" });
      b += S.arrow(200, 41, 230, 41, { label: "flush" });
      b += S.bar({ x: 248, y: 26, w: 56, h: 30, tone: "sys" });
      b += S.bar({ x: 242, y: 23, w: 56, h: 32, tone: "sys" });
      b += S.box({ id: "sst-files", x: 230, y: 20, w: 76, h: 36, label: "SST", tone: "sys", icon: "layers" });
      b += S.text(230, 76, "sorted files, merged later", "d-t-s");
      b += S.text(430, 34, "cheap writes", "d-t-b");
      b += S.text(430, 50, "reads check layers", "d-t-s");

      b += S.tag(0, 116, "B-tree — update in place");
      b += S.box({ x: 112, y: 126, w: 84, h: 30, label: "root", tone: "math" });
      b += S.arrow(140, 158, 118, 178, {});
      b += S.arrow(168, 158, 190, 178, {});
      b += S.box({ x: 76, y: 180, w: 76, h: 30, label: "page", tone: "math" });
      b += S.box({ x: 162, y: 180, w: 76, h: 30, label: "page", tone: "math" });
      b += S.text(430, 152, "direct reads", "d-t-b");
      b += S.text(430, 168, "random-IO writes", "d-t-s");
      return S.frame(600, 222, b);
    }
  };

  DIA.retry = {
    title: "Retries arrive exactly when there is least capacity to serve them",
    cap: "<b>The retry storm.</b> A service slows, clients time out and retry, and the retries land on the thing that was already failing — so it never gets a recovery window. Backoff reduces the pressure; <b>jitter</b> is what stops every client returning in the same synchronised wave and recreating the spike.",
    svg: function () {
      var b = "", i;
      b += S.tag(0, 14, "Naive retry");
      b += S.box({ id: "clients", x: 0, y: 26, w: 90, h: 40, label: "Clients", tone: "flat", icon: "users" });
      b += S.box({ x: 250, y: 30, w: 96, h: 44, label: "Service", sub: "at capacity", tone: "alaap" });
      for (i = 0; i < 5; i++) {
        b += S.arrow(94, 30 + i * 9, 246, 46, { id: "clients>service" });
      }
      b += S.text(360, 46, "load rises as it degrades", "d-t-s");
      b += S.text(360, 64, "no recovery window", "d-t-b");

      b += S.tag(0, 132, "Backoff with jitter");
      b += S.box({ id: "clients", x: 0, y: 144, w: 90, h: 40, label: "Clients", tone: "flat", icon: "users" });
      b += S.box({ x: 250, y: 148, w: 96, h: 44, label: "Service", sub: "recovering", tone: "math" });
      var offs = [0, 26, 9, 41, 17];
      for (i = 0; i < 5; i++) {
        b += S.arrow(94, 148 + i * 9, 246, 164 + offs[i] * 0, { dash: true, id: "clients>service#2" });
      }
      b += S.text(360, 164, "returns are spread out", "d-t-s");
      b += S.text(360, 182, "the spike never re-forms", "d-t-b");
      return S.frame(600, 206, b);
    }
  };

  DIA.cache = {
    title: "Population happens in one place. Invalidation has to happen everywhere.",
    cap: "<b>The write path is the hard part.</b> A cached vector search is fine until the user adds a memory — at which point that user's cached results are wrong, and the product's one promise quietly breaks. Every write path in the system has to know what it invalidates, including code written later by someone who does not know the cache exists.",
    svg: function () {
      var b = "";
      b += S.box({ id: "user-turn", x: 0, y: 30, w: 92, h: 40, label: "user turn", tone: "now", icon: "user" });
      b += S.arrow(96, 50, 132, 50, {});
      b += S.box({ id: "cache", x: 136, y: 30, w: 104, h: 40, label: "cache", sub: "key: user + query", tone: "sys", icon: "zap" });
      b += S.arrow(244, 50, 286, 50, { label: "miss" });
      b += S.box({ id: "vector-search", x: 290, y: 30, w: 116, h: 40, label: "vector search", tone: "flat", icon: "search" });
      b += S.arrow(348, 74, 190, 74, { curve: -26, label: "fill", dash: true });

      b += S.box({ id: "new-memory", x: 0, y: 136, w: 92, h: 40, label: "new memory", tone: "req", icon: "notebook-pen" });
      b += S.arrow(96, 156, 132, 156, { label: "write" });
      b += S.box({ id: "store", x: 136, y: 136, w: 104, h: 40, label: "store", tone: "flat", icon: "database" });
      b += S.arrow(188, 132, 188, 76, { label: "must invalidate" });
      b += S.text(430, 142, "Miss this edge and the", "d-t-s");
      b += S.text(430, 158, "assistant keeps answering", "d-t-s");
      b += S.text(430, 174, "from a world without it.", "d-t-b");
      return S.frame(600, 190, b);
    }
  };

  DIA.logs = {
    title: "The log turns multiplication into addition",
    cap: "<b>This is why likelihoods get logged.</b> Multiplying thousands of small probabilities underflows to zero in floating point; the same quantities summed do not. It is also why an exponential plotted on a log axis becomes a straight line — the log undoes the exponential, so constant multiplicative growth reads as constant slope.",
    svg: function () {
      var b = "";
      b += S.box({ id: "product", x: 0, y: 26, w: 230, h: 44, label: "p₁ × p₂ × … × pₙ", sub: "underflows toward zero", tone: "alaap" });
      b += S.arrow(236, 48, 288, 48, { label: "log" });
      b += S.box({ id: "logsum", x: 294, y: 26, w: 246, h: 44, label: "log p₁ + log p₂ + …", sub: "stable, and easy to differentiate", tone: "math" });
      b += S.text(0, 96, "0.5 multiplied 1075 times underflows to exactly 0.0 in float64", "d-t-s");
      b += S.text(0, 114, "log(0.5) × 1075 ≈ −745.1 — nowhere near overflow", "d-t-s");

      b += S.node("linear-plot", S.axes(20, 142, 200, 76, "time", "linear") +
        S.path("M20,218 C90,216 140,202 180,154 L200,142", "sys"));
      b += S.node("log-plot", S.axes(300, 142, 200, 76, "time", "log scale") +
        S.path("M300,218 L500,146", "math"));
      b += S.text(20, 244, "same growth, plotted on a log axis: the curve becomes a line", "d-t-s");
      return S.frame(600, 256, b);
    }
  };

  DIA.nll = {
    title: "Log keeps the peak where it is. The minus sign turns it into a valley.",
    cap: "<b>Same best p on both sides.</b> Ten coin flips, seven heads. Left, the likelihood L(p) = p⁷(1−p)³ peaks at p = 0.7, at a height of about 0.002, already tiny with ten data points. Right, −log L(p) = −7 log p − 3 log(1−p) has its lowest point at the same p = 0.7. Log is increasing, so it never moves the top; the minus sign flips the top into a bottom, which is what a loss and gradient descent need.",
    svg: function () {
      var b = "", i, p, x, y, d1 = "", d2 = "";
      var X0 = 40, X1 = 330, Y = 30, W = 220, H = 120;
      var px = function (x0, q) { return x0 + (q - 0.05) / 0.9 * W; };
      var L = function (q) { return Math.pow(q, 7) * Math.pow(1 - q, 3); };
      var N = function (q) { return -(7 * Math.log(q) + 3 * Math.log(1 - q)); };
      var Lmax = L(0.7);
      for (i = 0; i <= 90; i++) {
        p = 0.05 + i * 0.01;
        x = px(X0, p); y = Y + H - L(p) / Lmax * (H - 8);
        d1 += (i ? " L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
        x = px(X1, p); y = Y + H - (Math.min(N(p), 16) - 5) / 11 * H;
        d2 += (i ? " L" : "M") + x.toFixed(1) + "," + Math.min(y, Y + H).toFixed(1);
      }
      b += S.tag(0, 14, "Likelihood: climb to the top");
      b += S.axes(X0, Y, W, H, "p", "L(p)");
      b += S.node("likelihood", S.path(d1, "math"));
      b += S.node("peak", S.path("M" + px(X0, 0.7).toFixed(1) + "," + Y + " L" + px(X0, 0.7).toFixed(1) + "," + (Y + H), "flat", true) +
        S.text(px(X0, 0.7) + 6, Y + 12, "highest at p = 0.7", "d-t-s"));
      b += S.tag(X1 - 40, 14, "Negative log-likelihood: walk to the bottom");
      b += S.axes(X1, Y, W, H, "p", "−log L(p)");
      b += S.node("nll", S.path(d2, "alaap"));
      b += S.node("valley", S.path("M" + px(X1, 0.7).toFixed(1) + "," + Y + " L" + px(X1, 0.7).toFixed(1) + "," + (Y + H), "flat", true) +
        S.text(px(X1, 0.7) - 6, Y + 12, "lowest at p = 0.7", "d-t-s", "end"));
      b += S.text(0, 182, "L(0.7) ≈ 0.0022 with 10 flips; with 1,000 examples a product like this is below 10⁻³⁰⁸ and rounds to 0", "d-t-s");
      b += S.text(0, 200, "−log L(0.7) ≈ 6.1, an ordinary number; the slope of log L is a sum, 7/p − 3/(1−p), zero at p = 0.7", "d-t-s");
      return S.frame(600, 212, b);
    }
  };

  DIA.chain = {
    title: "A network is a composition. The chain rule is how you differentiate one.",
    cap: "<b>Forward, then backward.</b> Each layer is a function; the network is their composition. Going forward you record what each layer saw — that recording is the tape. Going backward you multiply the local derivatives along the chain. Autograd is not magic added to PyTorch; it is this bookkeeping, done automatically.",
    svg: function () {
      var b = "", i;
      var ids = ["x", "f1", "f2", "f3", "loss"];
      var labels = ["x", "f₁", "f₂", "f₃", "loss"];
      for (i = 0; i < 5; i++) {
        b += S.box({ id: ids[i], x: i * 116, y: 30, w: 88, h: 40, label: labels[i], tone: i === 4 ? "now" : "math" });
        if (i < 4) { b += S.arrow(i * 116 + 92, 50, i * 116 + 112, 50, {}); }
      }
      b += S.text(0, 94, "forward — each box remembers what it saw (the tape)", "d-t-s");
      for (i = 4; i > 0; i--) {
        b += S.arrow(i * 116, 128, (i - 1) * 116 + 92, 128, { dash: true, id: ids[i] + ">" + ids[i - 1] });
      }
      b += S.text(0, 152, "backward — multiply the local derivatives along the chain", "d-t-s");
      b += S.text(0, 180, "∂loss/∂x = ∂loss/∂f₃ · ∂f₃/∂f₂ · ∂f₂/∂f₁ · ∂f₁/∂x", "d-t-b");
      b += S.text(0, 204, "if each local derivative is 0.5, four layers deep multiply to 0.5⁴ = 0.0625 — why gradients vanish", "d-t-s");
      return S.frame(600, 216, b);
    }
  };

  DIA.descent = {
    title: "The learning rate is a step size on the direction the gradient gives you",
    cap: "<b>θ ← θ − η ∇L(θ).</b> The gradient points uphill, so descent subtracts it. The learning rate multiplies the gradient and nothing else. Too small and you crawl; too large and you step past the minimum and oscillate — which is the whole intuition behind every scheduler you will ever read about.",
    svg: function () {
      var b = "", i;
      var curve = "M20,150 C90,150 120,40 200,40 C280,40 300,150 380,150";
      b += S.node("loss-curve", S.path(curve, "flat"));
      b += S.node("minimum", '<circle cx="200" cy="40" r="4" class="d-fill-now d-str-now" stroke-width="1.25"/>' + S.text(200, 26, "minimum", "d-t-s", "middle"));

      var small = [[60, 132], [104, 92], [150, 58], [196, 42]];
      var smallMarkup = "";
      for (i = 0; i < small.length; i++) {
        smallMarkup += '<circle cx="' + small[i][0] + '" cy="' + small[i][1] + '" r="5" class="d-fill-now d-str-now" stroke-width="1.25"/>';
        if (i < small.length - 1) {
          smallMarkup += '<path d="M' + (small[i][0] + 6) + ',' + (small[i][1] - 2) + ' L' + (small[i + 1][0] - 6) + ',' + (small[i + 1][1] + 2) + '" class="d-line" stroke-width="1.25" marker-end="url(#ah)"/>';
        }
      }
      b += S.node("small-eta-path", smallMarkup);

      var big = [[130, 60], [270, 60], [150, 92], [250, 45], [190, 100]];
      var bigMarkup = "";
      for (i = 0; i < big.length; i++) {
        bigMarkup += '<circle cx="' + big[i][0] + '" cy="' + big[i][1] + '" r="5" class="d-fill-alaap d-str-alaap" stroke-width="1.25"/>';
        if (i < big.length - 1) {
          bigMarkup += '<path d="M' + big[i][0] + ',' + big[i][1] + ' L' + big[i + 1][0] + ',' + big[i + 1][1] + '" class="d-line" stroke-width="1.25" stroke-dasharray="4 3" marker-end="url(#ah)"/>';
        }
      }
      b += S.node("large-eta-path", bigMarkup);

      b += S.text(410, 44, "small η — many steps, converges", "d-t-s");
      b += S.text(410, 66, "large η — overshoots, oscillates", "d-t-s");
      b += S.text(410, 100, "θ ← θ − η · ∇L", "d-t-b");
      b += S.text(410, 122, "worked step: θ=5.0, ∇L=2.0, η=0.1", "d-t-s");
      b += S.text(410, 140, "→ θ = 5.0 − 0.1×2.0 = 4.8", "d-t-s");
      b += S.text(410, 162, "η multiplies the gradient,", "d-t-s");
      b += S.text(410, 178, "never the loss or the parameters.", "d-t-s");
      return S.frame(600, 190, b);
    }
  };

  DIA.vectors = {
    title: "Cosine similarity is the dot product with the lengths divided out",
    cap: "<b>Direction carries the meaning; length often carries frequency.</b> The dot product is |a||b|cosθ. Normalise both and what is left is the cosine alone. That is why two embeddings can point the same way with very different magnitudes and still mean the same thing — and why you use this measure every day in the memory system.",
    svg: function () {
      var b = "";
      b += S.axes(30, 24, 200, 140, "", "");
      b += S.node("vector-a", '<path d="M30,164 L190,54" class="fv-hit"/><path d="M30,164 L190,54" class="d-line" stroke-width="1.5" marker-end="url(#ah)"/>' + S.text(196, 50, "a", "d-t-b"));
      b += S.node("vector-b", '<path d="M30,164 L140,44" class="fv-hit"/><path d="M30,164 L140,44" class="d-line" stroke-width="1.5" marker-end="url(#ah)"/>' + S.text(146, 40, "b", "d-t-b"));
      b += S.node("vector-c", '<path d="M30,164 L110,109" class="fv-hit"/><path d="M30,164 L110,109" class="d-line" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ah)"/>' + S.text(114, 116, "c", "d-t-b"));
      b += S.node("theta", S.path("M66,150 A38,38 0 0,1 82,138", "flat") + S.text(78, 156, "θ", "d-t"));
      b += S.text(280, 40, "a · b = |a| |b| cosθ", "d-t-b");
      b += S.text(280, 60, "divide the magnitudes out", "d-t-s");
      b += S.text(280, 82, "cosθ = (a · b) / (|a| |b|)", "d-t-b");
      b += S.text(280, 106, "a=(1,4), b=(3,3): a·b=15, |a|=4.12, |b|=4.24", "d-t-s");
      b += S.text(280, 122, "→ cosθ = 15 / (4.12×4.24) = 0.86", "d-t-b");
      b += S.text(280, 144, "c = 0.5a → cos(a,c) = 1: same direction, different length", "d-t-s");
      return S.frame(600, 172, b);
    }
  };

  DIA.bayes = {
    title: "A very accurate test for a very rare thing is mostly wrong",
    cap: "<b>Base rates decide this, not sensitivity.</b> Out of 100,000 people: 100 are ill and about 99 test positive; 99,900 are healthy and about 4,995 also test positive. A positive result is therefore roughly 99 out of 5,094 — about 2%. The false positives come from a pool five hundred times larger, so they swamp the true ones.",
    svg: function () {
      var b = "";
      b += S.box({ id: "people", x: 0, y: 50, w: 132, h: 46, label: "100,000 people", tone: "flat", icon: "users" });
      b += S.arrow(136, 62, 176, 34, {});
      b += S.arrow(136, 84, 176, 110, {});
      b += S.box({ id: "ill", x: 180, y: 16, w: 106, h: 38, label: "100 ill", tone: "req" });
      b += S.box({ id: "healthy", x: 180, y: 92, w: 106, h: 38, label: "99,900 healthy", tone: "flat" });
      b += S.arrow(290, 35, 328, 35, { label: "99%" });
      b += S.arrow(290, 111, 328, 111, { label: "5%" });
      b += S.box({ id: "pos-from-ill", x: 332, y: 16, w: 130, h: 38, label: "99 test positive", tone: "req" });
      b += S.box({ id: "pos-from-healthy", x: 332, y: 92, w: 130, h: 38, label: "4,995 test positive", tone: "alaap" });
      b += S.text(0, 146, "99% sensitivity (true-positive rate); 5% false-positive rate.", "d-t-s");
      b += S.text(0, 168, "Positive result: 99 true positives out of 5,094 total — about 2%.", "d-t-b");
      b += S.text(0, 190, "The false positives come from a pool 999× larger than the ill pool.", "d-t-s");
      return S.frame(600, 202, b);
    }
  };

  DIA.attention = {
    title: "Why the scores are divided by the square root of dₖ",
    cap: "<b>A variance argument.</b> A dot product sums over dₖ dimensions, so its variance grows with dₖ. Large raw scores push softmax into saturation, where one weight is almost 1 and the rest almost 0 — and the gradient there is almost nothing. Dividing by √dₖ holds the variance roughly constant, which keeps softmax in the range where it still learns.",
    svg: function () {
      var b = "", i;
      b += S.box({ id: "q", x: 0, y: 10, w: 72, h: 36, label: "Q", sub: "what I want", tone: "math", icon: "search" });
      b += S.box({ id: "k", x: 0, y: 58, w: 72, h: 36, label: "K", sub: "what I offer", tone: "math", icon: "key" });
      b += S.box({ id: "v", x: 0, y: 106, w: 72, h: 36, label: "V", sub: "what is carried", tone: "math", icon: "layers" });
      b += S.arrow(76, 28, 112, 44, {});
      b += S.arrow(76, 76, 112, 60, {});
      b += S.box({ id: "qk", x: 116, y: 34, w: 76, h: 36, label: "Q · K", tone: "flat" });
      b += S.arrow(196, 52, 232, 52, { label: "÷ √dₖ" });
      b += S.box({ id: "scale", x: 236, y: 34, w: 70, h: 36, label: "scaled", tone: "flat" });
      b += S.arrow(310, 52, 346, 52, {});
      b += S.box({ id: "softmax", x: 350, y: 34, w: 82, h: 36, label: "softmax", tone: "now" });
      b += S.arrow(391, 70, 391, 130, {});
      b += S.arrow(76, 124, 346, 148, {});
      b += S.box({ id: "output", x: 350, y: 130, w: 82, h: 36, label: "output", tone: "sys" });

      b += S.tag(0, 172, "unscaled: dk=64, std≈8");
      (function () {
        var s = "", h2, i2;
        for (i2 = 0; i2 < 6; i2++) { h2 = (i2 === 2 ? 42 : 4); s += S.bar({ x: i2 * 22, y: 224 - h2, w: 15, h: h2, tone: "alaap" }); }
        b += S.node("unscaled-softmax", s);
      })();
      b += S.text(0, 240, "saturated — one weight ≈ 1, gradient ≈ 0", "d-t-s");

      b += S.tag(220, 172, "scaled: divide by √64 = 8, std≈1");
      (function () {
        var s = "", hs = [10, 18, 26, 20, 13, 9], i2;
        for (i2 = 0; i2 < 6; i2++) { s += S.bar({ x: 220 + i2 * 22, y: 224 - hs[i2], w: 15, h: hs[i2], tone: "sys" }); }
        b += S.node("scaled-softmax", s);
      })();
      b += S.text(220, 240, "spread out — still learning", "d-t-s");
      return S.frame(600, 254, b);
    }
  };

  DIA.embed = {
    title: "Nobody puts the meaning in. It falls out of the objective.",
    cap: "<b>Where the numbers come from.</b> An embedding table starts as random numbers, one row per token, and those rows are parameters like any other. Gradient descent on the task drags rows that behave alike in the task toward each other. Structure appears because the objective rewards it, not because anyone encoded it.",
    svg: function () {
      var b = "", i;
      b += S.tag(0, 14, "At initialisation");
      var r1 = [[40, 60], [150, 48], [90, 120], [170, 110], [60, 96], [120, 74]];
      var initMarkup = '<rect x="0" y="24" width="210" height="130" rx="4" class="d-fill-flat d-str-flat" stroke-width="1.25"/>';
      for (i = 0; i < r1.length; i++) { initMarkup += '<circle cx="' + r1[i][0] + '" cy="' + r1[i][1] + '" r="5" class="d-fill-req d-str-req" stroke-width="1"/>'; }
      initMarkup += S.text(20, 168, "cat, dog, car, run — random rows", "d-t-s");
      b += S.node("init-embeddings", initMarkup);

      b += S.arrow(222, 90, 286, 90, { label: "training", id: "init-embeddings>trained-embeddings" });

      b += S.tag(300, 14, "After training");
      var r2 = [[356, 60], [372, 52], [364, 72], [456, 112], [470, 104], [444, 122]];
      var trainMarkup = '<rect x="300" y="24" width="210" height="130" rx="4" class="d-fill-flat d-str-flat" stroke-width="1.25"/>';
      for (i = 0; i < r2.length; i++) { trainMarkup += '<circle cx="' + r2[i][0] + '" cy="' + r2[i][1] + '" r="5" class="d-fill-sys d-str-sys" stroke-width="1"/>'; }
      trainMarkup += S.text(320, 168, "cat+dog, car+run — rows used alike drift together", "d-t-s");
      b += S.node("trained-embeddings", trainMarkup);
      return S.frame(600, 186, b);
    }
  };

  DIA.nyquist = {
    title: "A waveform is a list of pressure readings, taken at some rate",
    cap: "<b>Nyquist.</b> A sample rate of N represents frequencies up to N/2 and nothing above. Analysing audio at the wrong assumed rate shifts every frequency you measure by that ratio — which is exactly how a project juggling 16k, 22.05k, 24k and 44.1k ends up with a result that reverses once the rate is fixed.",
    svg: function () {
      var b = "", i, x, y;
      b += S.node("true-signal", S.path("M0,80 C40,20 80,140 120,80 C160,20 200,140 240,80 C280,20 320,140 360,80", "sys"));
      var dots = "";
      for (i = 0; i <= 18; i++) {
        x = i * 20;
        y = 80 - 52 * Math.sin(i * 20 / 120 * Math.PI);
        dots += '<circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="2.6" class="d-fill-now d-str-now" stroke-width="1"/>';
      }
      b += S.node("samples", dots);
      b += S.text(0, 132, "samples, taken at a fixed rate N", "d-t-s");

      b += S.box({ id: "below-nyquist", x: 400, y: 20, w: 220, h: 30, label: "0 to N/2 Hz", sub: "represented correctly", tone: "sys" });
      b += S.box({ id: "above-nyquist", x: 400, y: 58, w: 220, h: 30, label: "above N/2 Hz", sub: "aliases to a false frequency", tone: "alaap" });
      b += S.text(400, 106, "example: 16,000 Hz → limit 8,000 Hz", "d-t-s");
      b += S.text(400, 122, "content above it does not vanish, it aliases", "d-t-s");
      return S.frame(660, 142, b);
    }
  };

  DIA.source = {
    title: "Change the buzz and it is the same person. Change the tube and it is not.",
    cap: "<b>The source-filter split.</b> The vocal folds produce a buzz at F0 — that is the source, and it carries pitch. The vocal tract is a tube that resonates at certain frequencies — those are the formants, and they carry identity. Every measurement in Alaap sits on one side of this split, which is why a measure that leaks across it fails to separate anything.",
    svg: function () {
      var b = "";
      b += S.box({ id: "vocal-folds", x: 0, y: 40, w: 108, h: 50, label: "vocal folds", sub: "buzz at F0", tone: "req", icon: "waves" });
      b += S.arrow(112, 65, 152, 65, { label: "source" });
      b += S.box({ id: "vocal-tract", x: 156, y: 40, w: 122, h: 50, label: "vocal tract", sub: "resonant tube", tone: "sys", icon: "volume-2" });
      b += S.arrow(282, 65, 322, 65, { label: "filter" });
      b += S.box({ id: "voice", x: 326, y: 40, w: 108, h: 50, label: "voice", tone: "now", icon: "mic" });
      b += S.text(0, 128, "pitch lives here", "d-t-s");
      b += S.text(156, 128, "identity lives here", "d-t-b");
      b += S.text(0, 150, "f0_mean measures the source (pitch). Formants and vtl_cm measure the filter (identity).", "d-t-s");
      b += S.text(0, 172, "example: a ~17 cm adult male tract resonates near F1≈500, F2≈1500, F3≈2500 Hz", "d-t-s");
      b += S.text(0, 194, "a measure that mixes source and filter cannot separate speakers", "d-t-s");
      return S.frame(600, 206, b);
    }
  };

  DIA.arc = {
    title: "Milestone 1, in one picture",
    cap: "<b>Systems leads, mathematics runs underneath, Alaap stays warm.</b> The systems track moves outward from vocabulary to scale to failure. The mathematics track climbs deliberately toward one target: being ready for TrenTorch. They meet at the gate.",
    svg: function () {
      var b = "", i;
      var weeks = ["Words", "Partitioning", "Storage", "Failure", "Caching"];
      var math = ["Logs", "Derivatives", "Vectors", "Gradients", "Probability"];
      for (i = 0; i < 5; i++) {
        var x = i * 112;
        b += S.box({ x: x, y: 26, w: 96, h: 40, label: weeks[i], tone: "sys" });
        b += S.box({ x: x, y: 96, w: 96, h: 40, label: math[i], tone: "math" });
        b += S.text(x + 48, 16, "wk " + (i + 1), "d-t-x", "middle");
        if (i < 4) {
          b += S.arrow(x + 100, 46, x + 108, 46, {});
          b += S.arrow(x + 100, 116, x + 108, 116, {});
        }
      }
      b += S.arrow(544, 46, 570, 158, {});
      b += S.arrow(544, 116, 592, 158, {});
      b += S.box({ x: 520, y: 156, w: 120, h: 38, label: "the gate", tone: "now" });
      b += S.text(0, 178, "Alaap: orientation, sampling, source-filter — four hours in total, spread across the five weeks.", "d-t-s");
      b += S.text(0, 196, "DSA: deliberately zero until milestone 2.", "d-t-s");
      return S.frame(660, 206, b);
    }
  };

  DIA.eigen = {
    title: "Most vectors get turned. An eigenvector only gets stretched.",
    cap: "<b>The definition is geometric before it is algebraic.</b> Apply the transformation to any vector and it generally lands somewhere off its original line. An eigenvector is one of the rare vectors that stays on its own line: direction kept, length multiplied by the eigenvalue. That is the whole content of <i>Av = &#955;v</i>, and it is why the null-space answer, although it is a true fact about <i>A - &#955;I</i>, is the answer to a different question.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "An ordinary vector");
      b += S.axes(30, 24, 170, 130, "", "");
      b += S.node("v-ordinary", '<path d="M30,154 L140,64" class="fv-hit"/><path d="M30,154 L140,64" class="d-line" stroke-width="1.5" marker-end="url(#ah)"/>' + S.text(146, 60, "v", "d-t-b"));
      b += S.node("av-ordinary", '<path d="M30,154 L176,116" class="fv-hit"/><path d="M30,154 L176,116" class="d-line" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ah)"/>' + S.text(180, 114, "Av", "d-t-b"));
      b += S.text(30, 182, "off its line — turned", "d-t-s");

      b += S.tag(268, 14, "An eigenvector");
      b += S.axes(298, 24, 170, 130, "", "");
      b += S.node("v-eigen", '<path d="M298,154 L368,94" class="fv-hit"/><path d="M298,154 L368,94" class="d-line" stroke-width="1.5" marker-end="url(#ah)"/>' + S.text(360, 104, "v", "d-t-b"));
      b += S.node("av-eigen", '<path d="M298,154 L438,34" class="fv-hit"/><path d="M298,154 L438,34" class="d-line" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ah)"/>' + S.text(444, 32, "Av = λv", "d-t-b"));
      b += S.text(298, 182, "same line — scaled by λ", "d-t-s");
      b += S.text(0, 210, "check: A=[[2,0],[0,3]], v=(1,0) → Av=(2,0)=2v — eigenvalue λ=2, on its own line", "d-t-s");
      return S.frame(560, 222, b);
    }
  };

  DIA.overfit = {
    title: "The moment the two curves part is the whole diagnosis.",
    cap: "<b>Training loss falling is not evidence of anything.</b> It falls for a model that is learning and for one that is memorising, and the two look identical until validation loss turns. Every intervention is a different way of delaying or detecting that turn: early stopping reads it off the chart, regularisation flattens the climb, more data moves it right, and a smaller model never gets there. Naming the intervention is easy. Saying which part of this picture it acts on is the answer.",
    svg: function () {
      var b = "", i, x, y;
      b += S.axes(46, 20, 330, 150, "epochs", "loss");
      var tr = "M46,44";
      for (i = 1; i <= 33; i++) {
        x = 46 + i * 10;
        y = 44 + 110 * (1 - Math.exp(-i / 7));
        tr += " L" + x.toFixed(0) + "," + y.toFixed(1);
      }
      b += S.node("training-curve", S.path(tr, "sys"));
      var va = "M46,40";
      for (i = 1; i <= 33; i++) {
        x = 46 + i * 10;
        y = 40 + 78 * (1 - Math.exp(-i / 6)) - Math.max(0, (i - 13)) * 2.6;
        va += " L" + x.toFixed(0) + "," + y.toFixed(1);
      }
      b += S.node("validation-curve", S.path(va, "req", true));
      var bx = 46 + 13 * 10;
      b += S.node("divergence-point", '<line x1="' + bx + '" y1="24" x2="' + bx + '" y2="170" class="d-str-flat" stroke-width="1" stroke-dasharray="3 4"/>' + S.text(bx + 6, 36, "curves part here", "d-t-b"));
      b += S.text(390, 130, "training — keeps falling", "d-t-s");
      b += S.text(390, 62, "validation", "d-t-s");
      b += S.text(390, 78, "turns upward: memorising", "d-t-s");
      b += S.text(0, 204, "early stopping stops at the turn; regularisation flattens the climb and delays it.", "d-t-s");
      b += S.text(0, 222, "more data moves the turn right; a smaller model may never turn at all.", "d-t-s");
      return S.frame(600, 234, b);
    }
  };

  DIA.passk = {
    title: "One good run is not evidence. Eight are.",
    cap: "<b>pass@k asks whether the agent ever succeeds. pass^k asks whether it always does.</b> On tau-retail the paper reports its own result as bounds, and those bounds are the argument: under half the tasks pass a single trial, and under a quarter pass all eight. Nothing about the agent changed between the two bars. The only thing that changed is how many times it was asked, and that is the difference between a demo and a product. This is also the case for a replay bench: a recorded trajectory that passes once has told you almost nothing.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "gpt-4o on tau-retail, as the paper states it");
      b += S.axes(52, 30, 300, 150, "", "tasks passed");

      var y50 = 30 + 150 * 0.5, y25 = 30 + 150 * 0.75;
      b += '<line x1="52" y1="' + y50 + '" x2="352" y2="' + y50 +
        '" class="d-str-flat" stroke-width="1" stroke-dasharray="3 4"/>';
      b += '<line x1="52" y1="' + y25 + '" x2="352" y2="' + y25 +
        '" class="d-str-flat" stroke-width="1" stroke-dasharray="3 4"/>';
      b += S.text(48, y50 + 4, "50%", "d-t-x", "end");
      b += S.text(48, y25 + 4, "25%", "d-t-x", "end");

      b += S.node("pass1", S.bar({ x: 96, y: y50 + 4, w: 74, h: 180 - y50 - 4, tone: "iv" }) +
        S.text(133, y50 - 6, "under 50%", "d-t-b", "middle") +
        S.text(133, 196, "pass^1", "d-t-s", "middle"));

      b += S.node("pass8", S.bar({ x: 234, y: y25 + 4, w: 74, h: 180 - y25 - 4, tone: "now" }) +
        S.text(271, y25 - 6, "under 25%", "d-t-b", "middle") +
        S.text(271, 196, "pass^8", "d-t-s", "middle"));

      b += S.arrow(180, y50 + 12, 226, y25 - 2, { curve: 16, id: "pass1>pass8" });

      b += S.text(380, 46, "Same agent.", "d-t-b");
      b += S.text(380, 62, "Same tasks.", "d-t-s");
      b += S.text(380, 78, "Asked eight times", "d-t-s");
      b += S.text(380, 94, "instead of once.", "d-t-s");
      b += S.text(380, 122, "The gap is the", "d-t-s");
      b += S.text(380, 138, "reliability nobody", "d-t-s");
      b += S.text(380, 154, "measures.", "d-t-b");
      return S.frame(560, 210, b);
    }
  };

  DIA.oxusFrame = {
    title: "Thirty-five minutes, and where the twelve that matter go",
    cap: "<b>The hard part takes a third of the clock, and you choose it.</b> Requirements come before boxes precisely because they decide which deep dive earns those twelve minutes; for Oxus it is grounding, which is how the system knows a cited value really sits on that page. The last two minutes are not a summary. They are what you would build first, which is the thing a founding-engineer interview is actually measuring. <b>If she cuts in, follow her.</b> The shape is for when she does not.",
    svg: function () {
      var rows = [
        ["clarify", "Clarify", "who the user is, the unit of work, what done means", 4, "flat"],
        ["requirements", "Requirements", "the non-functional ones first", 4, "sys"],
        ["happy-path", "Happy path", "end to end, no depth yet", 8, "sys"],
        ["hard-part", "The hard part", "grounding: citation, verification, insufficient", 12, "iv"],
        ["failure-eval", "Failure and evaluation", "answered before she asks", 5, "sys"],
        ["build-first", "What you would build first", "the founding-engineer answer", 2, "now"]
      ];
      var b = S.tag(0, 12, "The thirty-five minutes");
      var y = 26, i, r, row;
      for (i = 0; i < rows.length; i++) {
        r = rows[i];
        row = S.text(0, y + 14, r[1], "d-t-b") + S.text(0, y + 28, r[2], "d-t-s") +
          S.bar({ x: 250, y: y + 3, w: r[3] * 23, h: 18, tone: r[4] }) +
          S.text(250 + r[3] * 23 + 8, y + 17, r[3] + " min", "d-t-s");
        b += S.node(r[0], row);
        y += 40;
      }
      return S.frame(600, y + 6, b);
    }
  };

  DIA.oxusControl = {
    title: "Testing one control: code owns the facts, the model owns the prose",
    cap: "<b>Blue is deterministic code, ochre is the model.</b> Sample selection is seeded code so the workpaper can be reproduced. The model reads evidence only through opaque handles and must cite one for every claim. A verifier then checks that the cited span actually contains the value, and fails closed. Exceptions are computed from attribute results by code, so the model cannot write \"effective\" over an exception. The model's job is the narrative a reviewer reads.",
    svg: function () {
      var b = "", i;
      var r1 = [["Control", "definition", "flat", "file-text"], ["Population", "pulled by query", "sys", "database"],
        ["Sample", "seeded, stored", "sys", "list"], ["Evidence", "chunks as E1..En", "sys", "file-scan"]];
      for (i = 0; i < r1.length; i++) {
        b += S.box({ x: i * 150, y: 22, w: 126, h: 44, label: r1[i][0], sub: r1[i][1], tone: r1[i][2], icon: r1[i][3] });
        if (i < r1.length - 1) { b += S.arrow(i * 150 + 128, 44, i * 150 + 148, 44, {}); }
      }
      b += S.arrow(513, 68, 60, 108, { curve: -10 });
      var r2 = [["Attribute test", "cites handles", "req"], ["Verify", "span holds value", "sys"],
        ["Exceptions", "computed", "sys"], ["Draft", "narrative only", "req"], ["Reviewer", "signs off", "now"]];
      for (i = 0; i < r2.length; i++) {
        b += S.box({ x: i * 128, y: 112, w: 112, h: 44, label: r2[i][0], sub: r2[i][1], tone: r2[i][2] });
        if (i < r2.length - 1) { b += S.arrow(i * 128 + 114, 134, i * 128 + 126, 134, {}); }
      }
      b += S.arrow(184, 110, 52, 110, { curve: 22, label: "fail closed", dash: true });
      b += S.bar({ x: 0, y: 186, w: 12, h: 12, tone: "sys" });
      b += S.text(18, 196, "deterministic code", "d-t-s");
      b += S.bar({ x: 140, y: 186, w: 12, h: 12, tone: "req" });
      b += S.text(158, 196, "model", "d-t-s");
      b += S.text(230, 196, "Every model call and reviewer decision lands in the audit log.", "d-t-s");
      return S.frame(640, 206, b);
    }
  };

  DIA.oxusIngest = {
    title: "If coordinates are lost at parse time, citations are impossible later",
    cap: "<b>The normalised document model is the design.</b> Every source type is parsed into spans that carry where they came from: document, page, bounding box, and for recordings a timestamp, plus a confidence from the parser. Tables stay tables. Retrieval is per tenant and hybrid, because invoice numbers, amounts and dates have to match exactly, which dense embeddings are bad at. Everything downstream cites these coordinates.",
    svg: function () {
      var b = "", i;
      var src = [["Native PDF", "file-text"], ["Scanned PDF", "image"], ["Spreadsheet", "table"], ["ERP screenshot", "image"], ["Walkthrough call", "mic"]];
      var how = ["text layer", "OCR + layout", "cells", "OCR + layout", "transcript"];
      for (i = 0; i < src.length; i++) {
        b += S.box({ x: 0, y: 8 + i * 38, w: 120, h: 30, label: src[i][0], tone: "flat", icon: src[i][1] });
        b += S.arrow(122, 23 + i * 38, 160, 23 + i * 38, {});
        b += S.box({ x: 164, y: 8 + i * 38, w: 100, h: 30, label: how[i], tone: "sys" });
        b += S.arrow(266, 23 + i * 38, 300, 100, {});
      }
      b += S.box({ id: "normalised-spans", x: 304, y: 64, w: 150, h: 72, label: "Normalised spans", sub: "doc, page, bbox, time, conf", tone: "req" });
      b += S.arrow(456, 100, 492, 100, {});
      b += S.box({ id: "per-tenant-index", x: 496, y: 64, w: 132, h: 72, label: "Per-tenant index", sub: "lexical + dense", tone: "now", icon: "database" });
      b += S.text(304, 160, "low OCR confidence travels forward", "d-t-s");
      b += S.text(304, 176, "and can force an insufficient result", "d-t-s");
      return S.frame(640, 200, b);
    }
  };

  DIA.oxusKB = {
    title: "Year over year, the risk lives in what changed",
    cap: "<b>Version the process graph and diff it.</b> Last year's walkthrough produced a graph of steps, actors, systems and controls, each node cited to a timestamp in the recording. This year's is built the same way. The diff is the valuable output: a new approver, a system swapped, a manual step appearing where there used to be an automated one. Those are exactly the places an auditor should look first.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "Prior year");
      b += S.box({ x: 0, y: 26, w: 92, h: 30, label: "Request", tone: "sys" });
      b += S.arrow(94, 41, 116, 41, {});
      b += S.box({ x: 118, y: 26, w: 92, h: 30, label: "Approve", sub: "", tone: "sys" });
      b += S.arrow(212, 41, 234, 41, {});
      b += S.box({ x: 236, y: 26, w: 92, h: 30, label: "Post", tone: "sys" });
      b += S.tag(0, 96, "This year");
      b += S.box({ x: 0, y: 108, w: 92, h: 30, label: "Request", tone: "sys" });
      b += S.arrow(94, 123, 116, 123, {});
      b += S.box({ x: 118, y: 108, w: 92, h: 30, label: "Approve", tone: "sys" });
      b += S.arrow(212, 123, 234, 123, {});
      b += S.box({ x: 236, y: 108, w: 92, h: 30, label: "Manual edit", tone: "alaap" });
      b += S.arrow(330, 123, 352, 123, {});
      b += S.box({ x: 354, y: 108, w: 92, h: 30, label: "Post", tone: "sys" });
      b += S.arrow(282, 142, 470, 170, { dash: true });
      b += S.box({ x: 472, y: 150, w: 156, h: 40, label: "Flag for the auditor", sub: "new manual step", tone: "now" });
      return S.frame(640, 200, b);
    }
  };

  DIA.zenEffects = {
    title: "Replay policy follows what a tool call does to the world",
    cap: "<b>Classify the call, then pick the policy.</b> Reads can be answered from the recording. Idempotent writes can go through a ledger keyed on session, step and canonical arguments, so a repeat is harmless. Calls with an external effect — an email, a refund — must never pass through by default on a forked replay. A new one the recording never saw either goes to a dry-run adapter or fails loudly. A silent live call is both a real side effect and a hidden false pass.",
    svg: function () {
      var b = "";
      b += S.box({ id: "tool-call", x: 0, y: 86, w: 104, h: 40, label: "Tool call", tone: "flat", icon: "zap" });
      b += S.arrow(106, 100, 176, 36, {});
      b += S.arrow(106, 106, 176, 106, {});
      b += S.arrow(106, 112, 176, 176, {});
      b += S.box({ x: 180, y: 16, w: 150, h: 40, label: "Read", sub: "no effect", tone: "sys", icon: "eye" });
      b += S.box({ x: 180, y: 86, w: 150, h: 40, label: "Idempotent write", sub: "safe to repeat", tone: "math", icon: "repeat" });
      b += S.box({ x: 180, y: 156, w: 150, h: 40, label: "External effect", sub: "email, refund", tone: "alaap", icon: "triangle-alert" });
      b += S.text(378, 32, "answer from the recording", "d-t-b");
      b += S.text(378, 48, "on a miss: explicit on_miss policy", "d-t-s");
      b += S.text(378, 102, "ledger, keyed on session + step + args", "d-t-b");
      b += S.text(378, 118, "a repeat returns the stored result", "d-t-s");
      b += S.text(378, 172, "never passthrough on a fork", "d-t-b");
      b += S.text(378, 188, "dry-run adapter, or fail loudly", "d-t-s");
      return S.frame(640, 206, b);
    }
  };

  DIA.multiturn = {
    title: "When the agent's reply changes, the recorded user stops making sense",
    cap: "<b>The hybrid.</b> Replay recorded user turns while the agent's replies stay equivalent to the recording. At the first real divergence, hand the user side to a simulator conditioned on the goal extracted from the original session, and hold that simulator fixed across baseline and fork so it is a controlled variable rather than a second thing that changed. Calibrate it first: run it against the unchanged baseline and check it reproduces the recorded user turns.",
    svg: function () {
      var b = "", i;
      b += S.tag(0, 14, "Recorded session");
      var rec = ["U1", "A1", "U2", "A2", "U3", "A3"];
      var recIds = ["rec-u1", "rec-a1", "rec-u2", "rec-a2", "rec-u3", "rec-a3"];
      for (i = 0; i < rec.length; i++) {
        b += S.box({ id: recIds[i], x: i * 72, y: 24, w: 56, h: 30, label: rec[i], tone: i % 2 ? "sys" : "flat" });
      }
      b += S.tag(0, 90, "Forked replay");
      b += S.box({ id: "fork-u1", x: 0, y: 100, w: 56, h: 30, label: "U1", tone: "flat" });
      b += S.box({ id: "fork-a1", x: 72, y: 100, w: 56, h: 30, label: "A1′", tone: "alaap" });
      b += S.text(72, 146, "diverges", "d-t-s");
      b += S.box({ id: "fork-u2", x: 144, y: 100, w: 56, h: 30, label: "U2", tone: "flat", dash: true });
      b += S.text(144, 146, "no longer fits", "d-t-s");
      b += S.arrow(172, 132, 250, 170, {});
      b += S.box({ id: "simulated-user", x: 254, y: 152, w: 150, h: 40, label: "Simulated user", sub: "goal from session", tone: "now", icon: "shuffle" });
      b += S.arrow(406, 172, 446, 172, {});
      b += S.box({ id: "fork-u2p", x: 450, y: 152, w: 56, h: 40, label: "U2′", tone: "req" });
      b += S.arrow(508, 172, 530, 172, {});
      b += S.box({ id: "fork-a2p", x: 532, y: 152, w: 56, h: 40, label: "A2′", tone: "sys" });
      return S.frame(640, 202, b);
    }
  };

  /* ZenML round 3: replay misses, the backend questions, and Kitaru's replay. */
  DIA.missFlow = {
    title: "A replay miss, made productive",
    cap: "<b>A miss is information: the agent's behaviour changed.</b> Instead of killing the run, show the recorded call beside what the new agent tried, and let one command accept the variant as equivalent. That writes a static alias, so the next replay hits, and every accepted pair is a labelled example for anything automatic later.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 78, w: 120, h: 44, label: "Replayed call", tone: "flat", icon: "repeat" });
      b += S.arrow(122, 100, 156, 100, {});
      b += S.box({ x: 160, y: 78, w: 120, h: 44, label: "Look up by key", tone: "sys", icon: "search" });
      b += S.arrow(282, 92, 326, 42, { label: "hit" });
      b += S.arrow(282, 108, 326, 158, { label: "miss" });
      b += S.box({ x: 330, y: 20, w: 150, h: 44, label: "Recorded result", tone: "math", icon: "file-text" });
      b += S.box({ x: 330, y: 136, w: 150, h: 44, label: "Diff", sub: "recorded against tried", tone: "req", icon: "file-scan" });
      b += S.arrow(482, 158, 506, 158, {});
      b += S.box({ x: 510, y: 136, w: 130, h: 44, label: "Accept as equal", sub: "writes a static alias", tone: "sys", icon: "check" });
      b += S.arrow(575, 134, 484, 50, { dash: true, label: "next run hits" });
      return S.frame(640, 190, b);
    }
  };

  DIA.skipLocked = {
    title: "Claiming a Postgres queue without two workers colliding",
    cap: "<b>FOR UPDATE SKIP LOCKED lets each worker take rows nobody holds.</b> Worker 1 locks its rows; worker 2 skips them instead of waiting. A cron drain's worst case is its interval, so the drain is triggered on the event (about ninety seconds down to about three) and cron stays as the backstop.",
    svg: function () {
      var b = "", i;
      for (i = 0; i < 5; i++) {
        b += S.box({ x: 250, y: 18 + i * 32, w: 120, h: 26, label: "job " + (i + 1), tone: i < 2 ? "sys" : i < 4 ? "math" : "flat" });
      }
      b += S.box({ x: 0, y: 24, w: 150, h: 44, label: "Worker 1", sub: "locks jobs 1 and 2", tone: "sys", icon: "cpu" });
      b += S.arrow(152, 40, 246, 31, {});
      b += S.arrow(152, 52, 246, 63, {});
      b += S.box({ x: 0, y: 108, w: 150, h: 44, label: "Worker 2", sub: "skips to 3 and 4", tone: "math", icon: "cpu" });
      b += S.arrow(152, 124, 246, 95, {});
      b += S.arrow(152, 136, 246, 127, {});
      b += S.box({ x: 470, y: 24, w: 170, h: 44, label: "Event trigger", sub: "drain now, about 3 s", tone: "req", icon: "zap" });
      b += S.arrow(468, 46, 374, 46, {});
      b += S.box({ x: 470, y: 108, w: 170, h: 44, label: "Cron", sub: "the backstop, kept", tone: "flat", dash: true, icon: "clock" });
      b += S.arrow(468, 130, 374, 130, { dash: true });
      return S.frame(640, 184, b);
    }
  };

  DIA.definerGrant = {
    title: "SECURITY DEFINER plus the default grant",
    cap: "<b>A function that deliberately bypasses row-level security was callable by everyone.</b> SECURITY DEFINER runs as the function's owner, which is how it sees past RLS to do its job; Postgres grants EXECUTE to PUBLIC on a new function by default. The fix is the class, not the instance: revoke from PUBLIC, grant to the one role that needs it, and test that no definer function keeps a PUBLIC grant.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 30, w: 130, h: 44, label: "Any signed-in user", tone: "flat", icon: "user" });
      b += S.arrow(132, 52, 246, 52, { label: "EXECUTE via PUBLIC" });
      b += S.text(189, 84, "the default on a new function", "d-t-x", "middle");
      b += S.box({ x: 250, y: 30, w: 180, h: 44, label: "SECURITY DEFINER function", sub: "runs as its owner", tone: "req" });
      b += S.arrow(432, 52, 466, 52, {});
      b += S.box({ x: 470, y: 30, w: 170, h: 44, label: "Every user's rows", sub: "RLS bypassed", tone: "alaap", icon: "database" });
      b += S.tag(250, 108, "The fix");
      b += S.box({ id: "revoke-grant", x: 250, y: 116, w: 390, h: 48, label: "REVOKE EXECUTE ... FROM PUBLIC; GRANT to one role", sub: "and a test that no definer function keeps a PUBLIC grant", tone: "math", icon: "shield" });
      return S.frame(640, 176, b);
    }
  };

  DIA.zenmlStack = {
    title: "ZenML's working vocabulary: steps, artifacts, pipelines, stacks",
    cap: "<b>A pipeline is steps; steps pass artifacts; a stack decides where it all runs.</b> Each step's outputs are stored as versioned artifacts with lineage, so a run can be traced and reused. The same pipeline code runs on a different stack by swapping components such as the orchestrator and the artifact store.",
    svg: function () {
      var b = "";
      b += S.text(0, 12, "Pipeline", "d-t-x");
      b += S.box({ x: 0, y: 20, w: 130, h: 40, label: "step: load", tone: "sys", icon: "inbox" });
      b += S.arrow(132, 40, 166, 40, {});
      b += S.box({ x: 170, y: 20, w: 130, h: 40, label: "step: train", tone: "sys", icon: "cpu" });
      b += S.arrow(302, 40, 336, 40, {});
      b += S.box({ x: 340, y: 20, w: 130, h: 40, label: "step: evaluate", tone: "sys", icon: "gauge" });
      b += S.arrow(65, 62, 65, 96, {});
      b += S.arrow(235, 62, 235, 96, {});
      b += S.arrow(405, 62, 405, 96, {});
      b += S.box({ x: 0, y: 100, w: 130, h: 40, label: "dataset v3", sub: "artifact", tone: "math", icon: "table" });
      b += S.box({ x: 170, y: 100, w: 130, h: 40, label: "model v7", sub: "artifact", tone: "math", icon: "box" });
      b += S.box({ x: 340, y: 100, w: 130, h: 40, label: "metrics", sub: "artifact", tone: "math", icon: "chart-line" });
      b += S.box({ x: 510, y: 20, w: 130, h: 120, label: "Stack", sub: "orchestrator, store", tone: "req", icon: "layers" });
      b += S.arrow(508, 80, 474, 80, { label: "runs on" });
      return S.frame(640, 150, b);
    }
  };

  DIA.forkReplay = {
    title: "Faithful baseline, then fork with one override",
    cap: "<b>Change one thing and compare against a baseline that reproduces the recording.</b> The baseline answers every tool from history, so it should reproduce the session; the fork changes one input, such as the prompt or the model, and the same evaluators score both runs. A difference is then attributable to the one change.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 78, w: 130, h: 44, label: "Recorded session", tone: "flat", icon: "history" });
      b += S.arrow(132, 92, 176, 42, {});
      b += S.arrow(132, 108, 176, 158, {});
      b += S.box({ x: 180, y: 20, w: 180, h: 44, label: "Baseline replay", sub: "every tool from history", tone: "math", icon: "repeat" });
      b += S.box({ x: 180, y: 136, w: 180, h: 44, label: "Fork", sub: "one override: prompt or model", tone: "req", icon: "git-branch" });
      b += S.arrow(362, 42, 406, 92, {});
      b += S.arrow(362, 158, 406, 108, {});
      b += S.box({ x: 410, y: 78, w: 120, h: 44, label: "Evaluators", sub: "score both runs", tone: "sys", icon: "scale" });
      b += S.arrow(532, 100, 556, 100, {});
      b += S.box({ x: 560, y: 78, w: 80, h: 44, label: "Verdict", tone: "now", icon: "check" });
      return S.frame(640, 190, b);
    }
  };

  /* Kitaru, from the teardown (E:/kitaru/kitaru-teardown.html), drawn as static svg. */
  DIA.kitaruPlanes = {
    title: "The server never runs your code",
    cap: "<b>The server never executes user code.</b> Everything inside \"your environment\" is an ordinary process on your machine, spawned by a worker that polls the Kitaru server for tasks. Two arrows leave the agent subprocess: one calls back to Kitaru for recorded tool results and node writes, the other goes live to the model provider and is never replayed.",
    svg: function () {
      var b = "";
      b += S.tag(0, 10, "Control plane");
      b += S.box({ x: 0, y: 20, w: 170, h: 56, label: "Kitaru server", sub: "REST API, runs no user code", tone: "req", icon: "server" });
      b += S.box({ x: 0, y: 90, w: 170, h: 46, label: "Postgres", sub: "sessions, session_nodes", tone: "math", icon: "database" });
      b += S.box({ x: 0, y: 150, w: 170, h: 40, label: "Blob store", sub: "plugins, trace payloads", tone: "math", icon: "hard-drive" });
      b += S.text(178, 86, "claims tasks", "d-t-s");

      b += S.tag(200, 10, "Your environment");
      b += S.box({ x: 200, y: 20, w: 130, h: 56, label: "Worker", sub: "claim loop, kill_tree", tone: "sys", icon: "cpu" });
      b += S.arrow(174, 48, 198, 48, {});
      b += S.text(335, 16, "spawns", "d-t-s");
      b += S.arrow(332, 34, 358, 40, {});
      b += S.arrow(332, 48, 358, 100, {});
      b += S.arrow(332, 60, 358, 146, {});
      b += S.box({ x: 360, y: 20, w: 220, h: 56, label: "Agent subprocess", sub: "your command, env, creds", tone: "alaap", icon: "terminal" });
      b += S.box({ x: 360, y: 86, w: 220, h: 38, label: "Evaluator subprocess", sub: "uv run, isolated env", tone: "flat", icon: "terminal" });
      b += S.box({ x: 360, y: 132, w: 220, h: 38, label: "Importer subprocess", sub: "uv run, isolated env", tone: "flat", icon: "terminal" });
      b += S.arrow(600, 76, 600, 206, {});
      b += S.box({ x: 360, y: 208, w: 220, h: 46, label: "Model provider", sub: "OpenAI, Anthropic", tone: "alaap", dash: true, icon: "cloud" });
      b += S.text(360, 268, "always live, never replayed", "d-t-s");
      b += S.arrow(400, 76, 85, 70, { curve: -90, label: "tool lookup, node writes" });
      return S.frame(640, 282, b);
    }
  };
  DIA.kitaruReplay = {
    title: "Replay is one environment variable",
    cap: "<b>The replay trigger is a single environment variable.</b> KITARU_REPLAY_ID switches a normal recording run into a replay; everything else — same filesystem, same network, same credentials — stays exactly as your process already had it. Isolation is a timeout and a kill-tree, nothing more.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 20, w: 150, h: 64, label: "build_process_env()", sub: "os.environ + overrides + secrets", tone: "sys", icon: "list" });
      b += S.arrow(152, 52, 176, 52, {});
      b += S.box({ x: 180, y: 6, w: 210, h: 92, label: "Injected into child", sub: "REPLAY_ID drives everything", tone: "math", icon: "key" });
      b += S.text(196, 76, "API_URL, API_TOKEN, TASK_ID,", "d-t-s");
      b += S.text(196, 90, "TASK_INPUTS, REPLAY_ID", "d-t-s");
      b += S.arrow(392, 52, 406, 52, {});
      b += S.box({ x: 410, y: 20, w: 210, h: 100, label: "platform.spawn()", sub: "your command, verbatim", tone: "req", icon: "terminal" });
      b += S.text(422, 96, "same fs, net, creds", "d-t-s");
      b += S.text(422, 110, "isolation: timeout + kill_tree", "d-t-s");
      b += S.arrow(480, 120, 350, 138, {});
      b += S.box({ x: 140, y: 140, w: 220, h: 60, label: "Adapter, in your process", sub: "reads REPLAY_ID, fetches policy", tone: "alaap", icon: "shuffle" });
      b += S.arrow(362, 170, 396, 170, {});
      b += S.box({ x: 400, y: 140, w: 220, h: 60, label: "wrap_model_request / wrap_tool_execute", sub: "PydanticAI capability hooks", tone: "alaap", icon: "code" });
      b += S.arrow(500, 202, 450, 218, { dash: true, label: "unrouted calls escape" });
      b += S.box({ x: 140, y: 220, w: 480, h: 50, label: "Not every call is hooked", sub: "a bare requests.post() or a direct DB write hits production for real", tone: "alaap" });
      return S.frame(640, 280, b);
    }
  };
  DIA.kitaruOrder = {
    title: "Ordered consumption, and when it holds",
    cap: "<b>Ordered consumption exists only under baseline scope, and only for calls that are not concurrent.</b> Three identical calls consume three recorded results in the order they were recorded; under agent or cohort_version scope the same three calls all get the newest recorded result, forever. The Claude Agent SDK adapter documents the concurrency race openly; the PydanticAI path has the same shape without the caveat.",
    svg: function () {
      var b = "", i;
      var y = [50, 92, 134];
      b += S.tag(0, 14, "Scope: baseline — ordered");
      for (i = 0; i < 3; i++) {
        b += S.box({ id: "base-call-" + (i + 1), x: 0, y: y[i], w: 110, h: 34, label: "call #" + (i + 1), tone: "flat" });
        b += S.box({ id: "base-result-" + "abc"[i], x: 230, y: y[i], w: 130, h: 34, label: "result " + "ABC"[i], tone: "math" });
        b += S.arrow(112, y[i] + 17, 228, y[i] + 17, { label: "occurrence=" + i });
      }
      b += S.text(0, 200, "candidate set: completed AND failed", "d-t-s");

      b += S.tag(380, 14, "agent | cohort_version — unordered");
      for (i = 0; i < 3; i++) {
        b += S.box({ id: "scoped-call-" + (i + 1), x: 380, y: y[i], w: 110, h: 34, label: "call #" + (i + 1), tone: "flat" });
        b += S.arrow(492, y[i] + 17, 528, 109, {});
      }
      b += S.box({ id: "newest-result", x: 532, y: 92, w: 100, h: 34, label: "newest result", tone: "alaap" });
      b += S.text(380, 200, "candidate set: completed only", "d-t-s");
      b += S.text(380, 216, "same row, forever — a retry loop replays one answer", "d-t-s");

      b += S.box({ id: "concurrency-race", x: 0, y: 232, w: 640, h: 58, label: "The concurrency race", sub: "read counter, await tool_lookup, write counter — on an unguarded dict", tone: "alaap", dash: true, icon: "triangle-alert" });
      return S.frame(640, 300, b);
    }
  };
  DIA.kitaruFreeze = {
    title: "Freezing the transcript against freezing the world",
    cap: "<b>Kitaru freezes the transcript; your harness froze the world.</b> Freezing the transcript scales to thousands of imported sessions with zero authoring, but a call the recording never saw is a miss. Freezing the world supports counterfactual exploration — a novel query still gets a true, consistent answer — which a transcript fundamentally cannot.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "Kitaru — call-log replay");
      b += S.box({ id: "k-agent-call", x: 0, y: 24, w: 130, h: 42, label: "Agent calls tool", tone: "flat", icon: "bot" });
      b += S.arrow(132, 45, 166, 45, {});
      b += S.box({ id: "k-lookup", x: 170, y: 24, w: 150, h: 42, label: "Hash lookup", sub: "tool body never runs", tone: "flat", icon: "key" });
      b += S.arrow(322, 45, 356, 45, {});
      b += S.box({ id: "k-call-log", x: 360, y: 12, w: 170, h: 60, label: "Recorded call log", sub: "one row per call, by args", tone: "math", icon: "database" });
      b += S.text(638, 40, "hit: exact replay,", "d-t-b", "end");
      b += S.text(638, 55, "perfect", "d-t-b", "end");
      b += S.arrow(400, 74, 400, 108, { dash: true, label: "agent asks something new" });
      b += S.box({ id: "k-miss", x: 170, y: 112, w: 360, h: 44, label: "Miss — no row with that hash", sub: "on_miss: kill run, error dict, or call production", tone: "alaap", icon: "triangle-alert" });

      b += S.tag(0, 182, "Snapshot harness — world-snapshot replay");
      b += S.box({ id: "h-agent-call", x: 0, y: 192, w: 130, h: 42, label: "Agent calls tool", tone: "flat", icon: "bot" });
      b += S.arrow(132, 213, 166, 213, {});
      b += S.box({ id: "h-tool-logic", x: 170, y: 192, w: 190, h: 42, label: "Tool logic runs for real", sub: "query, not lookup", tone: "sys" });
      b += S.arrow(362, 213, 386, 213, {});
      b += S.box({ id: "h-snapshot", x: 390, y: 180, w: 170, h: 66, label: "Snapshot SQLite", sub: "scenario and neighbors", tone: "math", icon: "database" });
      b += S.text(400, 236, "e.g. 3 Mikes, redacted", "d-t-s");
      b += S.arrow(475, 246, 475, 254, {});
      b += S.box({ id: "h-no-miss", x: 170, y: 256, w: 370, h: 44, label: "No miss concept", sub: "the world is frozen, not the call sequence", tone: "now", icon: "check" });
      return S.frame(640, 312, b);
    }
  };
  DIA.kitaruPosition = {
    title: "How Kitaru's positioning moved",
    cap: "<b>The tell is the comparison content.</b> Through mid-August the blog wrote against durable-execution competitors (Temporal, Inngest, Trigger.dev); from August 18 it repositioned to replay-based evals — a relaunch never posted to HN — and started writing against eval and observability vendors instead (Braintrust, Arize): independent corroboration of the pivot.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 20, w: 140, h: 70, label: "Mar 2026 — Pivot 1", sub: "durable-execution runtime", tone: "req" });
      b += S.arrow(142, 55, 153, 55, {});
      b += S.box({ x: 155, y: 20, w: 140, h: 70, label: "Apr – Jul 2026", sub: "competitor content", tone: "flat" });
      b += S.arrow(297, 55, 308, 55, {});
      b += S.box({ x: 310, y: 20, w: 140, h: 70, label: "Aug 18 2026 — Pivot 2", sub: "replay-based evals", tone: "iv" });
      b += S.arrow(452, 55, 463, 55, {});
      b += S.box({ x: 465, y: 20, w: 140, h: 70, label: "Sep 2026", sub: "sandbox research", tone: "flat" });
      b += S.arrow(380, 92, 380, 128, { label: "corroborating evidence" });
      b += S.box({ x: 260, y: 130, w: 240, h: 50, label: "Comparison content switches", sub: "now vs Braintrust, Arize", tone: "flat", icon: "file-text" });
      return S.frame(640, 194, b);
    }
  };

  DIA.queueOverload = {
    title: "An unbounded queue does not warn you. It goes vertical.",
    cap: "<b>Two views of the same collapse.</b> Left: queue length against wall-clock time under sustained overload — the unbounded queue never stops climbing, while a bounded one fills, plateaus at its cap, and starts shedding work. Right: the same story as one curve. For a simple queue, E[N] = ρ/(1−ρ) stays small while utilisation ρ is comfortably under 1, then diverges as ρ approaches 1 — the curve does not warn you gently, it goes vertical near the end.",
    svg: function () {
      var b = "", i, x, y;
      b += S.tag(0, 14, "Queue length over time");
      b += S.axes(30, 24, 180, 120, "time", "queue length");
      var unb = "M30,144";
      for (i = 1; i <= 18; i++) { x = 30 + i * 10; y = 144 - i * i * 0.36; unb += " L" + x.toFixed(1) + "," + y.toFixed(1); }
      b += S.node("unbounded-trace", S.path(unb, "alaap"));
      var bnd = "M30,144";
      for (i = 1; i <= 18; i++) { x = 30 + i * 10; y = 144 - Math.min(90, i * i * 0.9); bnd += " L" + x.toFixed(1) + "," + y.toFixed(1); }
      b += S.node("bounded-trace", S.path(bnd, "sys"));
      b += S.path("M30,54 L210,54", "flat", true);
      b += S.text(214, 58, "cap", "d-t-x");
      b += S.box({ id: "shed", x: 155, y: 43, w: 55, h: 22, label: "sheds", tone: "now" });
      b += S.text(150, 22, "unbounded", "d-t-s");
      b += S.text(80, 62, "bounded", "d-t-s");

      b += S.tag(300, 14, "E[N] = ρ / (1 − ρ)");
      b += S.axes(330, 24, 190, 120, "ρ (utilisation)", "E[N]");
      var util = "M330,144";
      for (i = 1; i <= 96; i++) {
        var rho = i / 100, val = rho / (1 - rho);
        x = 330 + i * 1.9; y = Math.max(24, 144 - val * 9);
        util += " L" + x.toFixed(1) + "," + y.toFixed(1);
      }
      b += S.node("utilisation-curve", S.path(util, "math"));
      b += S.path("M512,24 L512,144", "flat", true);
      b += S.text(400, 40, "ρ → 1", "d-t-s");
      b += S.text(400, 58, "E[N] → ∞", "d-t-b");
      return S.frame(640, 190, b);
    }
  };

  DIA.biasVarianceKnobs = {
    title: "Four interventions, two different axes to act on",
    cap: "<b>Where each intervention actually acts.</b> Against model complexity, L1, L2 and dropout all pull an over-fit model back to a lower effective complexity — L1 by driving weights to exactly zero, L2 and dropout by shrinking or randomly disabling capacity without removing it. More data does not change complexity at all; it shifts the point where the validation curve turns, delaying over-fitting rather than preventing it. Early stopping acts on a third axis entirely: training time, not model size — it reads the turn off the chart and halts before it happens.",
    svg: function () {
      var b = "", i, x, y;
      b += S.tag(0, 8, "vs. model complexity");
      b += S.axes(30, 18, 300, 130, "model complexity", "error");
      var tr = "M30,148";
      for (i = 1; i <= 30; i++) { x = 30 + i * 10; y = 30 + 110 * (1 - Math.exp(-i / 10)); tr += " L" + x.toFixed(1) + "," + y.toFixed(1); }
      b += S.node("train-curve", S.path(tr, "sys"));
      var va = "M30,138";
      for (i = 1; i <= 30; i++) {
        x = 30 + i * 10;
        y = 30 + 96 * (1 - Math.exp(-i / 8)) - Math.max(0, i - 16) * 5;
        va += " L" + x.toFixed(1) + "," + Math.max(20, y).toFixed(1);
      }
      b += S.node("val-curve", S.path(va, "alaap"));
      b += S.node("naive-fit", '<circle cx="310" cy="' + (30 + 96 * (1 - Math.exp(-28 / 8)) - 12 * 5).toFixed(1) + '" r="4.5" class="d-fill-alaap d-str-alaap" stroke-width="1.25"/>');
      b += S.node("regularized-fit", '<circle cx="190" cy="' + (30 + 96 * (1 - Math.exp(-16 / 8))).toFixed(1) + '" r="4.5" class="d-fill-sys d-str-sys" stroke-width="1.25"/>');
      b += S.arrow(305, 44, 195, 62, { id: "naive-fit>regularized-fit", curve: 18, label: "L1 / L2 / dropout: pull back" });
      b += S.text(30, 180, "L1: exact zeros. L2 / dropout: shrink toward zero.", "d-t-s");
      b += S.text(30, 194, "more data → shifts the turn right, does not remove it", "d-t-s");
      b += S.text(390, 40, "train", "d-t-s");
      b += S.text(390, 110, "validation", "d-t-s");

      b += S.tag(430, 8, "vs. training time");
      b += S.axes(450, 18, 180, 130, "epochs", "");
      var tr2 = "M450,148";
      for (i = 1; i <= 18; i++) { x = 450 + i * 10; y = 30 + 100 * (1 - Math.exp(-i / 6)); tr2 += " L" + x.toFixed(1) + "," + y.toFixed(1); }
      b += S.node("train-curve-b", S.path(tr2, "sys"));
      var va2 = "M450,140";
      for (i = 1; i <= 18; i++) {
        x = 450 + i * 10;
        y = 30 + 80 * (1 - Math.exp(-i / 5)) - Math.max(0, i - 9) * 6;
        va2 += " L" + x.toFixed(1) + "," + Math.max(20, y).toFixed(1);
      }
      b += S.node("val-curve-b", S.path(va2, "alaap"));
      var stopX = 450 + 9 * 10;
      b += S.box({ id: "earlyStop", x: stopX - 2, y: 18, w: 4, h: 130, tone: "now", dash: true });
      b += S.text(stopX + 6, 32, "stop here", "d-t-b");
      return S.frame(650, 212, b);
    }
  };

  DIA.sigmoidDerivative = {
    title: "The sigmoid learns fastest exactly where it is least sure",
    cap: "<b>The derivative peaks at the midpoint.</b> σ(x)(1−σ(x)) reaches its maximum, 0.25, exactly where σ(x) = 0.5 — the point of maximum uncertainty. At the saturated ends, where σ(x) is close to 0 or 1, the derivative flattens toward zero: the unit is confident and stops learning, which is the whole story behind vanishing gradients in deep sigmoid networks.",
    svg: function () {
      var b = "", i, x, xv, sig;
      b += S.axes(40, 18, 380, 140, "x", "");
      var sc = "", dc = "";
      for (i = 0; i <= 48; i++) {
        xv = -6 + i * 0.25;
        x = 40 + (xv + 6) * (380 / 12);
        sig = 1 / (1 + Math.exp(-xv));
        var ys = (160 - sig * 140).toFixed(1);
        var yd = (160 - sig * (1 - sig) * 140).toFixed(1);
        sc += (i === 0 ? "M" : " L") + x.toFixed(1) + "," + ys;
        dc += (i === 0 ? "M" : " L") + x.toFixed(1) + "," + yd;
      }
      b += S.node("sigmoid-curve", S.path(sc, "sys"));
      b += S.node("derivative-curve", S.path(dc, "math"));
      var px = 40 + 6 * (380 / 12), py = 160 - 0.25 * 140;
      b += S.node("peak", '<circle cx="' + px + '" cy="' + py.toFixed(1) + '" r="4.5" class="d-fill-math d-str-math" stroke-width="1.25"/>');
      b += S.text(px + 8, py - 6, "peak: 0.25 at x = 0", "d-t-b");
      b += S.text(50, 34, "saturated: gradient → 0", "d-t-s");
      b += S.text(240, 168, "saturated: gradient → 0", "d-t-s");
      b += S.text(300, 34, "σ(x)", "d-t-b");
      b += S.text(280, 136, "σ(x)(1−σ(x))", "d-t-b");
      return S.frame(460, 180, b);
    }
  };

  DIA.nyquistBand = {
    title: "Above N/2, a frequency does not disappear. It lies about itself.",
    cap: "<b>Everything above the Nyquist frequency folds back.</b> A rate of N represents frequencies from 0 up to N/2 faithfully. A true frequency above N/2 is not simply lost — it is recorded as a false, lower frequency inside the representable band, which is why sampling at the wrong assumed rate does not just blur a signal, it can invert what you measure.",
    svg: function () {
      var b = "";
      b += S.box({ id: "representable", x: 40, y: 20, w: 260, h: 140, label: "representable", sub: "0 to N/2", tone: "sys", icon: "waves" });
      b += S.box({ id: "aliased", x: 300, y: 20, w: 220, h: 140, label: "aliased region", sub: "folds back below N/2", tone: "alaap", icon: "triangle-alert" });
      b += S.path("M300,10 L300,170", "flat", true);
      b += S.text(304, 12, "N/2", "d-t-x");
      b += S.path("M520,10 L520,170", "flat", true);
      b += S.text(474, 12, "N (sample rate)", "d-t-x");
      b += S.node("trueFreq", '<circle cx="400" cy="150" r="4.5" class="d-fill-alaap d-str-alaap" stroke-width="1.25"/>');
      b += S.node("aliasedFreq", '<circle cx="200" cy="150" r="4.5" class="d-fill-sys d-str-sys" stroke-width="1.25"/>');
      b += S.arrow(400, 150, 200, 150, { id: "trueFreq>aliasedFreq", curve: 44, dash: true, label: "folds back (aliases)" });
      b += S.text(400, 168, "true: 0.6N", "d-t-s");
      b += S.text(200, 168, "measured: 0.4N", "d-t-s");
      return S.frame(560, 190, b);
    }
  };

  DIA.gradientVector = {
    title: "The gradient is just every partial derivative, collected into one vector",
    cap: "<b>Each partial derivative asks one question.</b> Hold every input still but one, nudge it, and see how the output moves — that is one partial derivative. Collect all of them and you have the gradient, a vector that points in the direction of steepest increase of the loss surface. Descent walks the other way: −∇L points straight at the nearest lower ground, here toward the minimum at the centre of the contours.",
    svg: function () {
      var b = "";
      b += S.axes(40, 20, 340, 140, "θ₁", "θ₂");
      b += S.node("contours", S.path("M210,90 a45,45 0 1,0 0.1,0", "flat") +
        S.path("M210,90 a80,80 0 1,0 0.1,0", "flat") +
        S.path("M210,90 a115,68 0 1,0 0.1,0", "flat"));
      b += S.node("minimum", '<circle cx="210" cy="90" r="4.5" class="d-fill-now d-str-now" stroke-width="1.25"/>');
      b += S.text(216, 84, "minimum", "d-t-s");
      b += S.node("theta", '<circle cx="300" cy="55" r="4.5" class="d-fill-req d-str-req" stroke-width="1.25"/>');
      b += S.text(230, 40, "θ (current point)", "d-t-b");
      b += S.arrow(300, 55, 350, 30, { id: "theta>ascent", label: "∇L: steepest ascent" });
      b += S.arrow(300, 55, 226, 84, { id: "theta>minimum", dash: true, label: "−∇L: descent" });
      b += S.path("M300,55 L300,160", "flat", true);
      b += S.path("M300,55 L40,55", "flat", true);
      b += S.text(250, 172, "∂L/∂θ₁", "d-t-s");
      b += S.text(10, 52, "∂L/∂θ₂", "d-t-s");
      return S.frame(420, 190, b);
    }
  };

  DIA.qkvAttention = {
    title: "One query, scored against every position, weighting what gets carried forward",
    cap: "<b>Q asks, K advertises, V is what moves.</b> The query for this token is scored by dot product against the key of every position, including its own. Softmax turns those raw scores into weights that sum to one, and the output is that weighted sum of every position's value vector — the position with the highest score dominates the output, but never exclusively.",
    svg: function () {
      var b = "";
      b += S.box({ id: "q", x: 10, y: 90, w: 100, h: 40, label: "query", sub: "this token", tone: "now" });
      b += S.box({ id: "pos1", x: 190, y: 16, w: 130, h: 40, label: "pos 1", sub: "key, value", tone: "flat" });
      b += S.box({ id: "pos2", x: 190, y: 90, w: 130, h: 40, label: "pos 2", sub: "key, value", tone: "flat" });
      b += S.box({ id: "pos3", x: 190, y: 164, w: 130, h: 40, label: "pos 3", sub: "key, value", tone: "flat" });
      b += S.arrow(112, 96, 186, 40, { label: "score = q · k" });
      b += S.arrow(112, 106, 186, 106, {});
      b += S.arrow(112, 116, 186, 172, {});
      b += S.box({ id: "output", x: 470, y: 90, w: 130, h: 40, label: "output", sub: "Σ weight · value", tone: "now" });
      b += S.arrow(320, 32, 466, 96, { label: "w = 0.70" });
      b += S.arrow(320, 106, 466, 106, { label: "w = 0.20" });
      b += S.arrow(320, 178, 466, 116, { label: "w = 0.10" });
      b += S.text(400, 200, "weights come from softmax(scores); they sum to one", "d-t-s");
      return S.frame(640, 216, b);
    }
  };

  DIA.softmaxCrossEntropy = {
    title: "The gradient stays large for exactly as long as the prediction is wrong",
    cap: "<b>Cross-entropy does not flatten out while you are wrong.</b> Plotted against p, the softmax probability assigned to the true class, the loss −log(p) rises sharply as p falls toward zero, and the gradient magnitude (1−p) stays large right alongside it. Only once the model is both confident and correct does the gradient shrink toward zero — unlike squared error on a saturated unit, this loss keeps pushing until the answer is right.",
    svg: function () {
      var b = "", i, p, x;
      var lc = "", gc = "";
      for (i = 1; i <= 50; i++) {
        p = i / 50;
        x = 40 + p * 400;
        var loss = -Math.log(p);
        var yl = (150 - Math.min(140, loss * 40)).toFixed(1);
        var yg = (150 - (1 - p) * 130).toFixed(1);
        lc += (i === 1 ? "M" : " L") + x.toFixed(1) + "," + yl;
        gc += (i === 1 ? "M" : " L") + x.toFixed(1) + "," + yg;
      }
      b += S.axes(40, 20, 400, 130, "p (probability of the true class)", "");
      b += S.node("loss-curve", S.path(lc, "alaap"));
      b += S.node("gradient-curve", S.path(gc, "math"));
      b += S.text(50, 16, "still wrong — gradient stays large", "d-t-s");
      b += S.text(60, 190, "confident, correct: gradient → 0", "d-t-s");
      b += S.text(360, 34, "loss = −log(p)", "d-t-b");
      b += S.text(360, 60, "gradient = (1−p)", "d-t-b");
      return S.frame(480, 206, b);
    }
  };

  DIA.spectrogramReading = {
    title: "The spacing is pitch. The shape of the envelope is who is speaking.",
    cap: "<b>Three things live in one picture.</b> The evenly-spaced harmonic lines are multiples of f0, and their spacing is the pitch. The smooth envelope riding over them is set by the vocal tract's resonances — its peaks are the formants, F1 to F3, and they carry identity, not pitch. The envelope's overall downward slope across frequency is the spectral tilt: a separate measurement of vocal effort that a naive estimator can confuse with the buzz rate of the source.",
    svg: function () {
      var b = "", i, x, h;
      b += S.axes(40, 18, 440, 140, "frequency", "energy");
      function env(xx) {
        return 20 + 42 * Math.exp(-Math.pow((xx - 140) / 42, 2)) +
          55 * Math.exp(-Math.pow((xx - 300) / 55, 2)) +
          34 * Math.exp(-Math.pow((xx - 420) / 55, 2));
      }
      var bars = "";
      for (i = 1; i <= 8; i++) {
        x = 60 + i * 45;
        h = Math.max(6, env(x) - i * 2.5);
        bars += S.bar({ x: x - 3, y: 158 - h, w: 6, h: h, tone: "now" });
      }
      b += S.node("harmonics", bars);
      var ec = "";
      for (i = 0; i <= 44; i++) { x = 60 + i * 10; ec += (i === 0 ? "M" : " L") + x + "," + (158 - env(x) - (x - 60) * 0.05).toFixed(1); }
      b += S.node("envelope", S.path(ec, "sys"));
      b += S.node("formant-f1", '<circle cx="140" cy="' + (158 - env(140) - 4).toFixed(1) + '" r="4" class="d-fill-req d-str-req" stroke-width="1.25"/>' + S.text(148, 158 - env(140) - 10, "F1", "d-t-b"));
      b += S.node("formant-f2", '<circle cx="300" cy="' + (158 - env(300) - 12).toFixed(1) + '" r="4" class="d-fill-req d-str-req" stroke-width="1.25"/>' + S.text(308, 158 - env(300) - 18, "F2", "d-t-b"));
      b += S.node("formant-f3", '<circle cx="420" cy="' + (158 - env(420) - 8).toFixed(1) + '" r="4" class="d-fill-req d-str-req" stroke-width="1.25"/>' + S.text(428, 158 - env(420) - 14, "F3", "d-t-b"));
      b += S.node("tilt-line", S.path("M75,150 L465,168", "flat", true));
      b += S.text(60, 178, "harmonics: spacing = f0", "d-t-s");
      b += S.text(60, 194, "spectral tilt: envelope's downward slope", "d-t-s");
      return S.frame(500, 210, b);
    }
  };

  DIA.hybridRetrieval = {
    title: "Exact matches need lexical search. Meaning needs dense. Use both.",
    cap: "<b>Neither retrieval method alone is enough for documents with numbers in them.</b> Lexical search (BM25 or Postgres full-text) is exact: it finds an invoice number or a date because it matches the token. Dense embeddings are good at meaning and bad at exact tokens. The two candidate sets are merged and reranked before the top-k are kept. Metadata (client, document type, date) is prefixed into the text before encoding, not blended into the vector space — embeddings do not have a clean way to combine two unrelated signals.",
    svg: function () {
      var b = "";
      b += S.box({ id: "query", x: 10, y: 80, w: 90, h: 40, label: "query", tone: "now", icon: "search" });
      b += S.box({ id: "lexical", x: 170, y: 16, w: 150, h: 42, label: "lexical", sub: "BM25 / pg_fts", tone: "sys", icon: "list" });
      b += S.box({ id: "dense", x: 170, y: 142, w: 150, h: 42, label: "dense", sub: "embedding", tone: "math", icon: "layers" });
      b += S.arrow(104, 92, 166, 40, {});
      b += S.arrow(104, 106, 166, 158, {});
      b += S.box({ id: "merge", x: 390, y: 80, w: 90, h: 40, label: "merge", tone: "flat", icon: "merge" });
      b += S.arrow(322, 34, 386, 92, {});
      b += S.arrow(322, 160, 386, 108, {});
      b += S.box({ id: "rerank", x: 540, y: 80, w: 100, h: 40, label: "rerank", tone: "now", icon: "trending-up" });
      b += S.arrow(482, 100, 536, 100, {});
      b += S.box({ id: "topk", x: 700, y: 80, w: 80, h: 40, label: "top-k", tone: "req", icon: "list-checks" });
      b += S.arrow(642, 100, 696, 100, {});
      b += S.text(170, 200, "metadata is prefixed into the text before encoding, never blended into the vector", "d-t-s");
      return S.frame(800, 218, b);
    }
  };

  DIA.graphDiffYearOverYear = {
    title: "The diff is the product. The graph is just how you compute it.",
    cap: "<b>Two versions of the same walkthrough, one year apart.</b> Most of the process graph is identical, which is exactly why the differences are worth surfacing automatically: a step that used to be automated is now done by hand, a new name appears as approver, and the downstream system was swapped. An auditor's first question every year is which of these three actually changed — highlighting them beats asking the client to describe the whole process again.",
    svg: function () {
      var b = "";
      b += S.tag(0, 8, "Year 1");
      b += S.box({ id: "y1intake", x: 0, y: 18, w: 110, h: 42, label: "intake", tone: "flat" });
      b += S.box({ id: "y1review", x: 150, y: 18, w: 140, h: 42, label: "review", sub: "automated", tone: "flat", icon: "repeat" });
      b += S.box({ id: "y1approve", x: 330, y: 18, w: 150, h: 42, label: "approver: Alex", tone: "flat", icon: "user" });
      b += S.box({ id: "y1system", x: 520, y: 18, w: 150, h: 42, label: "system: Oracle", tone: "flat", icon: "database" });
      b += S.arrow(112, 39, 146, 39, {});
      b += S.arrow(292, 39, 326, 39, {});
      b += S.arrow(482, 39, 516, 39, {});

      b += S.tag(0, 108, "Year 2");
      b += S.box({ id: "y2intake", x: 0, y: 118, w: 110, h: 42, label: "intake", tone: "flat" });
      b += S.box({ id: "y2review", x: 150, y: 118, w: 140, h: 42, label: "review", sub: "manual now", tone: "alaap", icon: "user" });
      b += S.box({ id: "y2approve", x: 330, y: 118, w: 150, h: 42, label: "approver: Priya", tone: "alaap", icon: "user" });
      b += S.box({ id: "y2system", x: 520, y: 118, w: 150, h: 42, label: "system: SAP", tone: "alaap", icon: "database" });
      b += S.arrow(112, 139, 146, 139, {});
      b += S.arrow(292, 139, 326, 139, {});
      b += S.arrow(482, 139, 516, 139, {});
      b += S.text(0, 190, "changed: review went from automated to manual, approver Alex → Priya, system Oracle → SAP.", "d-t-s");
      b += S.text(0, 206, "intake did not change — unhighlighted nodes are the diff's negative space.", "d-t-s");
      return S.frame(690, 220, b);
    }
  };

  /* ---- Kitaru, from the teardown sections that had no drawing (2026-09-26) ---- */

  DIA.kitaruModel = {
    title: "One recursive table: the SessionNode tree",
    cap: "<b>Import, replay and evaluation all read the same tree.</b> A session is a tree of nodes joined by parent_external_id: spans, model calls, tool calls and subagent calls. The importer writes nodes, replay joins a new tool call to a recorded one on cache_key, and an evaluator pins its verdict to a JSON path inside a node's payload rather than copying the text out.",
    svg: function () {
      var b = "";
      b += S.box({ id: "session", x: 0, y: 20, w: 220, h: 46, label: "Session", sub: "imported, recorded or replay", tone: "sys", icon: "database" });
      b += S.box({ id: "span", x: 40, y: 104, w: 150, h: 40, label: "span", sub: "the root of a turn", tone: "flat" });
      b += S.box({ id: "llm", x: 0, y: 180, w: 120, h: 44, label: "llm_call", sub: "always live", tone: "flat", icon: "brain" });
      b += S.box({ id: "tool", x: 135, y: 180, w: 170, h: 44, label: "tool_call", sub: "cache_key, started_at", tone: "math", icon: "key" });
      b += S.box({ id: "subagent", x: 320, y: 180, w: 150, h: 44, label: "subagent_call", sub: "a nested tree", tone: "flat", icon: "bot" });
      b += S.box({ id: "nested", x: 330, y: 258, w: 130, h: 40, label: "llm_call", sub: "inside the subagent", tone: "flat" });
      b += S.arrow(110, 68, 115, 102, {});
      b += S.arrow(90, 146, 60, 178, {});
      b += S.arrow(130, 146, 210, 178, {});
      b += S.arrow(180, 146, 380, 178, {});
      b += S.arrow(395, 226, 395, 256, {});
      b += S.box({ id: "importer", x: 500, y: 20, w: 140, h: 46, label: "Importer", sub: "from trace stores", tone: "req", icon: "inbox" });
      b += S.box({ id: "replay", x: 500, y: 104, w: 140, h: 46, label: "Replay", sub: "joins on the key", tone: "iv", icon: "history" });
      b += S.box({ id: "evaluator", x: 500, y: 256, w: 140, h: 44, label: "Evaluator", sub: "a JSON path", tone: "iv", icon: "scale" });
      b += S.arrow(498, 43, 224, 43, { label: "writes nodes" });
      b += S.arrow(498, 132, 307, 190, { label: "cache_key" });
      b += S.arrow(498, 278, 462, 278, {});
      b += S.text(0, 322, "parent_external_id builds the tree; started_at orders repeated calls.", "d-t-s");
      return S.frame(640, 332, b);
    }
  };

  DIA.kitaruPolicy = {
    title: "How one tool call is answered on replay",
    cap: "<b>Provider-native tools skip the policy, and the default policy is passthrough.</b> A registered tool's policy is found by exact name, then the default. history and static answer from recordings; passthrough runs the real tool; llm is modelled in the API and raises in the PydanticAI adapter. A miss goes to on_miss, whose passthrough value calls production just as the default policy does, and neither leaves a mocked mark on the node.",
    svg: function () {
      var b = "";
      b += S.box({ id: "call", x: 0, y: 16, w: 130, h: 44, label: "Tool call", tone: "flat", icon: "bot" });
      b += S.box({ id: "native", x: 0, y: 100, w: 130, h: 50, label: "Provider-native?", sub: "hosted search, code", tone: "alaap" });
      b += S.box({ id: "policy", x: 170, y: 100, w: 170, h: 50, label: "Policy lookup", sub: "exact name, then default", tone: "sys" });
      b += S.box({ id: "passthrough", x: 150, y: 190, w: 110, h: 44, label: "passthrough", sub: "the default", tone: "alaap" });
      b += S.box({ id: "history", x: 270, y: 190, w: 110, h: 44, label: "history", sub: "by cache_key", tone: "math" });
      b += S.box({ id: "static", x: 390, y: 190, w: 110, h: 44, label: "static", sub: "first case wins", tone: "math" });
      b += S.box({ id: "llm", x: 510, y: 190, w: 110, h: 44, label: "llm", sub: "adapter raises", tone: "flat" });
      b += S.box({ id: "live", x: 0, y: 272, w: 220, h: 48, label: "Runs live", sub: "no mocked mark on the node", tone: "alaap", icon: "zap" });
      b += S.box({ id: "hit", x: 250, y: 272, w: 120, h: 48, label: "Hit", sub: "recorded result", tone: "now", icon: "check" });
      b += S.box({ id: "miss", x: 390, y: 272, w: 230, h: 48, label: "Miss", sub: "on_miss decides", tone: "alaap", icon: "triangle-alert" });
      b += S.arrow(65, 62, 65, 98, {});
      b += S.arrow(132, 125, 168, 125, { label: "no" });
      b += S.arrow(40, 152, 40, 270, { label: "yes" });
      b += S.arrow(205, 152, 205, 188, {});
      b += S.arrow(260, 152, 320, 188, {});
      b += S.arrow(300, 152, 440, 188, {});
      b += S.arrow(335, 152, 560, 188, {});
      b += S.arrow(200, 236, 170, 270, {});
      b += S.arrow(310, 236, 305, 270, {});
      b += S.arrow(350, 236, 430, 270, {});
      b += S.arrow(420, 236, 355, 270, {});
      b += S.arrow(460, 236, 490, 270, {});
      b += S.text(390, 340, "fail: the run dies. error_result: an invented error.", "d-t-s");
      b += S.text(390, 355, "passthrough: production, unmarked.", "d-t-s");
      return S.frame(640, 364, b);
    }
  };

  DIA.kitaruKey = {
    title: "The replay join is one SHA-256, with no tolerance",
    cap: "<b>Any change to an argument is indistinguishable from a call that was never recorded.</b> The key is sha256 of the tool name, a NUL byte and canonical JSON (sorted keys, compact separators). Key order and formatting wash out; a space inside a string, 1 against 1.0, or true against 1 do not. NaN or infinity produce no key at all and fall to on_miss with no diagnostic.",
    svg: function () {
      var b = "";
      b += S.box({ id: "recorded", x: 0, y: 16, w: 200, h: 50, label: "Recorded call", sub: "lookup_order, order_id 4417", tone: "flat" });
      b += S.box({ id: "replayed", x: 0, y: 116, w: 200, h: 50, label: "Replayed call", sub: "the new agent's arguments", tone: "flat" });
      b += S.box({ id: "canon", x: 240, y: 66, w: 170, h: 50, label: "Canonical JSON", sub: "sorted keys, no spaces", tone: "sys" });
      b += S.box({ id: "hash", x: 450, y: 66, w: 170, h: 50, label: "SHA-256", sub: "name + NUL + JSON", tone: "math", icon: "key" });
      b += S.arrow(202, 41, 238, 80, {});
      b += S.arrow(202, 141, 238, 104, {});
      b += S.arrow(412, 91, 448, 91, {});
      b += S.box({ id: "nokey", x: 0, y: 206, w: 190, h: 50, label: "No key at all", sub: "NaN or infinity", tone: "alaap", icon: "x" });
      b += S.box({ id: "same", x: 230, y: 206, w: 190, h: 50, label: "Same key: hit", sub: "key order, formatting", tone: "now", icon: "check" });
      b += S.box({ id: "differ", x: 450, y: 206, w: 190, h: 50, label: "New key: miss", sub: "1 vs 1.0, inner space", tone: "alaap", icon: "triangle-alert" });
      b += S.arrow(260, 118, 120, 204, {});
      b += S.arrow(490, 118, 360, 204, {});
      b += S.arrow(545, 118, 545, 204, {});
      b += S.text(0, 280, "Non-ASCII matches only within one adapter language: Python escapes it, a JS adapter may not.", "d-t-s");
      return S.frame(640, 290, b);
    }
  };

  DIA.kitaruTurns = {
    title: "Multi-turn replay re-executes only the last turn",
    cap: "<b>Earlier turns are canned text; only the final turn runs.</b> Recorded user messages are replayed verbatim and earlier assistant turns are flattened to text, with their tool calls and results dropped. So a fork never writes its own earlier replies: its last turn runs on top of the old agent's history, with no evidence it ever looked anything up.",
    svg: function () {
      var b = "";
      b += S.tag(0, 16, "Frozen: injected as canned text");
      b += S.tag(535, 16, "Runs live");
      var xs = [0, 107, 214, 321, 428, 535];
      var lab = [["u1", "User 1", "verbatim"], ["a1", "Agent 1", "text only"], ["u2", "User 2", "verbatim"],
                 ["a2", "Agent 2", "text only"], ["u3", "User 3", "verbatim"], ["a3", "Agent 3", "the fork"]];
      lab.forEach(function (l, i) {
        var live = i === 5;
        b += S.box({ id: l[0], x: xs[i], y: 28, w: 95, h: 50, label: l[1], sub: l[2], tone: live ? "iv" : "flat", dash: !live && i % 2 === 1 });
        if (i < 5) { b += S.arrow(xs[i] + 96, 53, xs[i + 1] - 2, 53, {}); }
      });
      b += S.box({ id: "dropped", x: 0, y: 150, w: 300, h: 50, label: "Their tool calls and results", sub: "dropped from the replayed context", tone: "alaap", icon: "x" });
      b += S.box({ id: "fork", x: 330, y: 150, w: 310, h: 50, label: "The fork only writes turn 3", sub: "on the old agent's history", tone: "alaap", icon: "message-square" });
      b += S.arrow(154, 80, 150, 148, { dash: true });
      b += S.arrow(368, 80, 260, 148, { dash: true });
      b += S.arrow(582, 80, 560, 148, {});
      return S.frame(640, 212, b);
    }
  };

  DIA.kitaruLive = {
    title: "What runs live whatever you configure",
    cap: "<b>Only registered function tools pass through the policy.</b> Model calls are always live, so an unchanged baseline is billed and nondeterministic. Provider-native tools are recorded but never checked, so a history policy on one is a silent no-op. A bare HTTP call or database write is not a tool, so no hook fires and Kitaru never sees it. That is where \"no card gets refunded twice\" stops holding.",
    svg: function () {
      var b = "";
      b += S.box({ id: "agent", x: 0, y: 118, w: 140, h: 50, label: "Agent", sub: "your subprocess", tone: "sys", icon: "bot" });
      b += S.box({ id: "hook", x: 200, y: 16, w: 200, h: 46, label: "Registered tool", sub: "the hook applies policy", tone: "math", icon: "filter" });
      b += S.box({ id: "model", x: 200, y: 86, w: 200, h: 46, label: "Model call", sub: "every replay, billed", tone: "alaap", icon: "brain" });
      b += S.box({ id: "native", x: 200, y: 156, w: 200, h: 46, label: "Provider-native tool", sub: "recorded, never checked", tone: "alaap", icon: "globe" });
      b += S.box({ id: "bare", x: 200, y: 226, w: 200, h: 46, label: "Bare HTTP or DB write", sub: "not a tool, no hook", tone: "alaap", icon: "send" });
      b += S.box({ id: "answered", x: 440, y: 16, w: 200, h: 46, label: "Answered from log", sub: "history or static", tone: "now", icon: "check" });
      b += S.box({ id: "provider", x: 440, y: 86, w: 200, h: 46, label: "Model provider", sub: "nondeterministic", tone: "alaap", icon: "cloud" });
      b += S.box({ id: "hosted", x: 440, y: 156, w: 200, h: 46, label: "Hosted tool, live", sub: "a history policy is a no-op", tone: "alaap", icon: "zap" });
      b += S.box({ id: "prod", x: 440, y: 226, w: 200, h: 46, label: "Production", sub: "Kitaru never sees it", tone: "alaap", icon: "server" });
      b += S.arrow(142, 125, 198, 42, {});
      b += S.arrow(142, 135, 198, 110, {});
      b += S.arrow(142, 152, 198, 176, {});
      b += S.arrow(142, 162, 198, 246, {});
      b += S.arrow(402, 39, 438, 39, {});
      b += S.arrow(402, 109, 438, 109, {});
      b += S.arrow(402, 179, 438, 179, {});
      b += S.arrow(402, 249, 438, 249, {});
      return S.frame(640, 284, b);
    }
  };

  DIA.kitaruScale = {
    title: "What breaks when each design grows",
    cap: "<b>The two designs fail in complementary directions.</b> Your snapshot bench hits the authoring wall, schema drift and a growing store of near-production data before any technical limit. Kitaru's call-log replay punishes the divergence it exists to measure, has no machinery for variance, and pays a live run per session. Neither simulates the user, so both share the multi-turn ceiling.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "Your snapshot bench, at 10x then 100x");
      b += S.tag(340, 14, "Kitaru call-log replay, at the same scale");
      var L = [["authoring", "Fixture authoring", "expert work per case: the wall", "notebook-pen"],
               ["drift", "Schema drift", "every migration rots old snapshots", "layers"],
               ["redaction", "Redaction", "near-production data, growing", "lock"],
               ["kruns", "k runs per case", "cases times k model calls", "repeat"]];
      var R = [["divergence", "Better change, worse replay", "an improved call is a miss", "shuffle"],
               ["variance", "No variance machinery", "one replay per session", "activity"],
               ["cost", "Cost per cohort", "500 sessions, 500 live runs", "gauge"],
               ["adapters", "Cross-adapter keys", "canonical JSON can differ", "split"]];
      L.forEach(function (r, i) { b += S.box({ id: r[0], x: 0, y: 24 + i * 52, w: 300, h: 42, label: r[1], sub: r[2], tone: "req", icon: r[3] }); });
      R.forEach(function (r, i) { b += S.box({ id: r[0], x: 340, y: 24 + i * 52, w: 300, h: 42, label: r[1], sub: r[2], tone: "alaap", icon: r[3] }); });
      b += S.box({ id: "multiturn", x: 160, y: 254, w: 320, h: 44, label: "Both: multi-turn divergence", sub: "neither one simulates the user", tone: "iv", icon: "users" });
      b += S.arrow(150, 226, 220, 252, {});
      b += S.arrow(490, 226, 420, 252, {});
      return S.frame(640, 308, b);
    }
  };

  /* Voice agent design (SYSTEM DESIGN.html#/designs/voice-agent): 110 px a second, t = 0 at x = 16. */
  DIA.voiceParallel = {
    title: "Escalate then wait, or both agents on every turn",
    cap: "<b>Starting the heavy agent with the fast one saves the model turn and the handoff.</b> Illustrative timings for one read that needs the scheduling agent. Escalate-then-wait spends about 2.5 s deciding to escalate and handing off before any work starts. Sending the same utterance to both agents at once hides that time: the front agent acknowledges straight away and speaks the result when it lands. The price is a background run on every turn, including the ones the front agent answers alone.",
    svg: function () {
      var b = "";
      b += S.text(16, 14, "Escalate, then wait", "d-t-b");
      b += S.box({ id: "e-front", x: 16, y: 24, w: 86, h: 38, label: "Front turn", sub: "escalates", tone: "alaap" });
      b += S.box({ id: "e-hand", x: 106, y: 24, w: 183, h: 38, label: "Handoff", sub: "context moves, agent starts", tone: "alaap" });
      b += S.box({ id: "e-back", x: 293, y: 24, w: 271, h: 38, label: "Back agent works", sub: "reads the schedule", tone: "sys" });
      b += S.box({ id: "e-speak", x: 568, y: 24, w: 53, h: 38, label: "Speak", tone: "now" });
      b += S.path("M16,68 L16,74 L289,74 L289,68", "alaap");
      b += S.text(152, 90, "about 2.5 s before any work starts", "d-t-s", "middle");
      b += S.text(16, 110, "Both agents on every turn", "d-t-b");
      b += S.box({ id: "p-front", x: 16, y: 118, w: 86, h: 38, label: "Front turn", sub: "acknowledges", tone: "math" });
      b += S.box({ id: "p-speak", x: 293, y: 118, w: 53, h: 38, label: "Speak", tone: "now" });
      b += S.box({ id: "p-back", x: 16, y: 176, w: 273, h: 38, label: "Back agent works", sub: "started with the front turn", tone: "sys" });
      b += S.arrow(290, 195, 318, 158, { id: "p-back>p-speak" });
      b += S.text(360, 141, "the answer, about 2.5 s sooner", "d-t-s");
      b += S.text(330, 199, "result lands; the front agent speaks it", "d-t-s");
      b += '<path d="M16,236 L621,236" class="d-line" stroke-width="1"/>';
      [0, 1, 2, 3, 4, 5].forEach(function (s) { b += S.text(16 + s * 110, 250, s + " s", "d-t-x", "middle"); });
      b += S.text(621, 266, "seconds after the caller stops talking", "d-t-x", "end");
      return S.frame(640, 274, b);
    }
  };

  /* ---- AI engineering fundamentals, 13 figures added 2026-09-28 ---- */

  DIA.numpyShapes = {
    title: "Shapes must line up at the axis being combined; a size-1 axis stretches to fit instead.",
    cap: "<b>Three shape rules used constantly: matmul, broadcasting, and reduction.</b> A matmul needs the left operand's last axis to match the right operand's first axis — D here — and that shared axis disappears from the result, so (B, T, D) @ (D, H) gives (B, T, H). Broadcasting stretches a size-1 axis to match its partner without copying data, so (3, 1) plus (1, 4) becomes (3, 4). A reduction removes exactly the axis it runs over: summing (B, T, H) over axis=-1 drops H, leaving (B, T).",
    svg: function () {
      var b = "";
      b += S.tag(0, 8, "matmul");
      b += S.box({ id: "mm-x", x: 0, y: 18, w: 110, h: 44, label: "x", sub: "(B, T, D)", tone: "req" });
      b += S.box({ id: "mm-w", x: 0, y: 82, w: 110, h: 44, label: "W", sub: "(D, H)", tone: "math" });
      b += S.box({ id: "mm-out", x: 200, y: 50, w: 150, h: 44, label: "out", sub: "(B, T, H)", tone: "now" });
      b += S.arrow(110, 40, 196, 62, {});
      b += S.arrow(110, 104, 196, 82, {});
      b += S.tag(0, 150, "broadcast");
      b += S.box({ id: "bc-a", x: 0, y: 160, w: 100, h: 44, label: "a", sub: "(3, 1)", tone: "req" });
      b += S.box({ id: "bc-b", x: 0, y: 224, w: 100, h: 44, label: "b", sub: "(1, 4)", tone: "req" });
      b += S.box({ id: "bc-sum", x: 200, y: 192, w: 130, h: 44, label: "a + b", sub: "(3, 4)", tone: "now" });
      b += S.arrow(100, 182, 196, 204, {});
      b += S.arrow(100, 246, 196, 224, {});
      b += S.tag(0, 298, "reduction");
      b += S.box({ id: "red-in", x: 0, y: 308, w: 140, h: 44, label: "x", sub: "(B, T, H)", tone: "req" });
      b += S.box({ id: "red-out", x: 260, y: 308, w: 150, h: 44, label: "x.sum(-1)", sub: "(B, T)", tone: "now" });
      b += S.arrow(140, 330, 256, 330, { label: "sum(axis=-1)" });
      return S.frame(430, 372, b);
    }
  };

  DIA.trainLoop = {
    title: "One PyTorch training step is six calls, in a fixed order, repeated.",
    cap: "<b>Every step follows the same cycle, then loops.</b> A batch comes from the DataLoader, the model runs it forward, the criterion turns predictions into a loss, .backward() walks the autograd graph to compute gradients, the optimizer applies its update rule, and zero_grad() clears gradients before the next batch — skip that call and gradients silently accumulate across steps. Evaluation runs the same forward pass inside torch.no_grad(), which skips building the autograd graph since no backward pass will follow.",
    svg: function () {
      var b = "";
      b += S.box({ id: "batch", x: 0, y: 20, w: 110, h: 44, label: "batch", sub: "DataLoader", tone: "req", icon: "layers" });
      b += S.box({ id: "forward", x: 150, y: 20, w: 120, h: 44, label: "forward", sub: "model(x)", tone: "sys", icon: "bot" });
      b += S.box({ id: "loss", x: 310, y: 20, w: 100, h: 44, label: "loss", sub: "criterion", tone: "math" });
      b += S.box({ id: "backward", x: 310, y: 110, w: 120, h: 44, label: ".backward()", sub: "grads", tone: "math" });
      b += S.box({ id: "optimizer", x: 150, y: 110, w: 130, h: 44, label: "optimizer.step()", tone: "sys" });
      b += S.box({ id: "zerograd", x: 0, y: 110, w: 130, h: 44, label: "zero_grad()", tone: "flat" });
      b += S.box({ id: "eval", x: 480, y: 65, w: 140, h: 60, label: "eval", sub: "torch.no_grad()", tone: "alaap", icon: "eye" });
      b += S.arrow(110, 42, 146, 42, {});
      b += S.arrow(270, 42, 306, 42, {});
      b += S.arrow(360, 64, 370, 108, {});
      b += S.arrow(306, 132, 284, 132, {});
      b += S.arrow(146, 132, 134, 132, {});
      b += S.arrow(65, 110, 55, 64, { label: "next batch" });
      b += S.arrow(270, 42, 480, 95, { dash: true, curve: -40, label: "at eval time" });
      return S.frame(650, 190, b);
    }
  };

  DIA.ragPipeline = {
    title: "Indexing runs once; retrieval runs on every query, against the index indexing built.",
    cap: "<b>Two pipelines share one index.</b> At index time, the parser's output — blocks tagged with page and section — is chunked while keeping that structural metadata, then embedded into a vector index. At query time, the query is embedded, top-k chunks are retrieved from the same index, a rerank stage reorders them, and a prompt lists them as numbered sources so the LLM's answer can cite by number; a citation check confirms every cited number actually appears in the prompt.",
    svg: function () {
      var b = "";
      b += S.tag(0, 8, "index time");
      b += S.box({ id: "parser", x: 0, y: 20, w: 110, h: 44, label: "parser", sub: "page, section", tone: "req", icon: "file-scan" });
      b += S.box({ id: "chunk", x: 150, y: 20, w: 140, h: 44, label: "chunk", sub: "keeps metadata", tone: "sys", icon: "split" });
      b += S.box({ id: "embed", x: 330, y: 20, w: 110, h: 44, label: "embed", tone: "math" });
      b += S.box({ id: "index", x: 480, y: 20, w: 120, h: 44, label: "index", tone: "now", icon: "database" });
      b += S.arrow(110, 42, 146, 42, {});
      b += S.arrow(290, 42, 326, 42, {});
      b += S.arrow(440, 42, 476, 42, {});
      b += S.tag(0, 110, "query time");
      b += S.box({ id: "query", x: 0, y: 122, w: 100, h: 44, label: "query", tone: "req", icon: "search" });
      b += S.box({ id: "embedq", x: 140, y: 122, w: 140, h: 44, label: "embed query", tone: "math" });
      b += S.box({ id: "retrieve", x: 320, y: 122, w: 140, h: 44, label: "retrieve top k", tone: "sys" });
      b += S.box({ id: "rerank", x: 500, y: 122, w: 110, h: 44, label: "rerank", tone: "sys", icon: "trending-up" });
      b += S.arrow(100, 144, 136, 144, {});
      b += S.arrow(280, 144, 316, 144, {});
      b += S.arrow(460, 144, 496, 144, {});
      b += S.arrow(540, 64, 390, 120, { dash: true, label: "top k" });
      b += S.box({ id: "prompt", x: 500, y: 224, w: 170, h: 50, label: "prompt", sub: "numbered sources", tone: "flat" });
      b += S.arrow(555, 166, 585, 222, {});
      b += S.box({ id: "llm", x: 0, y: 326, w: 100, h: 50, label: "LLM", tone: "sys", icon: "bot" });
      b += S.box({ id: "answer", x: 150, y: 326, w: 170, h: 50, label: "answer", sub: "with citations", tone: "now" });
      b += S.box({ id: "check", x: 370, y: 326, w: 140, h: 50, label: "citation check", tone: "alaap" });
      b += S.arrow(585, 274, 50, 324, {});
      b += S.arrow(100, 351, 146, 351, {});
      b += S.arrow(320, 351, 366, 351, {});
      return S.frame(690, 400, b);
    }
  };

  DIA.graphRag = {
    title: "Retrieval walks a graph instead of ranking chunks; every fact still points back to its source chunk.",
    cap: "<b>Building the graph and querying it are two separate passes over the same structure.</b> An LLM reads chunks and extracts subject-relation-object triples, which become nodes and edges, each edge recording the chunk it came from. A query finds the entities it names, expands outward a fixed number of hops to gather nearby facts, pulls each fact's source chunk back in for grounding, and only then goes to the LLM for an answer.",
    svg: function () {
      var b = "";
      b += S.box({ id: "chunks", x: 0, y: 20, w: 100, h: 44, label: "chunks", tone: "req", icon: "file-text" });
      b += S.box({ id: "extract", x: 150, y: 20, w: 160, h: 44, label: "extract triples", sub: "LLM", tone: "sys", icon: "bot" });
      b += S.box({ id: "graph", x: 360, y: 20, w: 150, h: 50, label: "graph", sub: "nodes, edges, source", tone: "now", icon: "network" });
      b += S.arrow(100, 42, 146, 42, {});
      b += S.arrow(310, 42, 356, 42, {});
      b += S.box({ id: "query", x: 0, y: 130, w: 100, h: 44, label: "query", tone: "req", icon: "search" });
      b += S.box({ id: "findEntities", x: 150, y: 130, w: 160, h: 44, label: "find entities", tone: "sys" });
      b += S.box({ id: "expand", x: 360, y: 130, w: 150, h: 44, label: "expand k hops", tone: "sys" });
      b += S.arrow(100, 152, 146, 152, {});
      b += S.arrow(310, 152, 356, 152, {});
      b += S.arrow(435, 70, 435, 128, { dash: true, label: "reads graph" });
      b += S.box({ id: "facts", x: 150, y: 230, w: 200, h: 50, label: "facts + chunks", tone: "flat" });
      b += S.box({ id: "llmAnswer", x: 400, y: 230, w: 160, h: 50, label: "LLM answer", tone: "now", icon: "bot" });
      b += S.arrow(435, 174, 280, 228, {});
      b += S.arrow(350, 255, 396, 255, {});
      return S.frame(580, 300, b);
    }
  };

  DIA.agentLoop = {
    title: "The agent loop is one cycle: build context, call the model, maybe call a tool, repeat.",
    cap: "<b>Every turn re-enters the same loop.</b> A user message triggers context building from the system prompt, history and memory; the model either calls a tool or answers directly. A tool call is validated against its schema, run behind a guard, and its observation is appended back into context before the model runs again — the same loop, one step further. A step limit stops runaway loops even if the model never emits a final answer.",
    svg: function () {
      var b = "";
      b += S.box({ id: "user", x: 0, y: 20, w: 110, h: 44, label: "user message", tone: "req", icon: "user" });
      b += S.box({ id: "context", x: 150, y: 20, w: 170, h: 44, label: "build context", sub: "system, history, memory", tone: "sys" });
      b += S.box({ id: "model", x: 360, y: 20, w: 110, h: 44, label: "model", tone: "sys", icon: "bot" });
      b += S.box({ id: "branch", x: 360, y: 110, w: 130, h: 50, label: "tool call?", tone: "alaap" });
      b += S.box({ id: "validate", x: 530, y: 90, w: 140, h: 44, label: "validate args", tone: "math" });
      b += S.box({ id: "runTool", x: 530, y: 160, w: 140, h: 44, label: "run tool", sub: "behind a guard", tone: "sys", icon: "shield" });
      b += S.box({ id: "observation", x: 340, y: 230, w: 170, h: 44, label: "observation", sub: "appended", tone: "flat" });
      b += S.box({ id: "reply", x: 150, y: 230, w: 170, h: 44, label: "reply", sub: "and write memory", tone: "now" });
      b += S.box({ id: "stepLimit", x: 0, y: 110, w: 130, h: 50, label: "step limit", sub: "stops the loop", tone: "alaap" });
      b += S.arrow(110, 42, 146, 42, {});
      b += S.arrow(320, 42, 356, 42, {});
      b += S.arrow(415, 64, 425, 108, {});
      b += S.arrow(490, 120, 526, 112, {});
      b += S.arrow(600, 134, 600, 158, {});
      b += S.arrow(530, 204, 425, 228, {});
      b += S.arrow(425, 228, 415, 66, { curve: 60, label: "next turn" });
      b += S.arrow(400, 158, 235, 228, { label: "final answer" });
      b += S.arrow(360, 120, 130, 120, { dash: true, label: "n steps" });
      return S.frame(690, 300, b);
    }
  };

  DIA.webResearch = {
    title: "Research is plan, search, synthesise, then check coverage — and loop back to plan if something is missing.",
    cap: "<b>The loop that turns one question into a sourced answer.</b> A question is broken into sub-queries, each searched and fetched, and passages are extracted from the pages. Duplicate passages are collapsed and ranked before synthesis writes an answer with citations. A coverage check compares the answer against the question's sub-parts; anything still missing sends the loop back to planning for another round.",
    svg: function () {
      var b = "";
      b += S.box({ id: "question", x: 0, y: 20, w: 110, h: 44, label: "question", tone: "req" });
      b += S.box({ id: "plan", x: 150, y: 20, w: 150, h: 44, label: "plan sub-queries", tone: "sys" });
      b += S.box({ id: "search", x: 340, y: 20, w: 100, h: 44, label: "search", tone: "sys", icon: "search" });
      b += S.box({ id: "fetch", x: 480, y: 20, w: 100, h: 44, label: "fetch", tone: "sys", icon: "globe" });
      b += S.arrow(110, 42, 146, 42, {});
      b += S.arrow(300, 42, 336, 42, {});
      b += S.arrow(440, 42, 476, 42, {});
      b += S.box({ id: "extract", x: 0, y: 122, w: 170, h: 44, label: "extract passages", tone: "math" });
      b += S.box({ id: "dedupe", x: 210, y: 122, w: 170, h: 44, label: "dedupe and rank", tone: "math" });
      b += S.box({ id: "synth", x: 420, y: 122, w: 200, h: 44, label: "synthesise", sub: "with citations", tone: "now" });
      b += S.arrow(530, 64, 85, 120, {});
      b += S.arrow(170, 144, 206, 144, {});
      b += S.arrow(380, 144, 416, 144, {});
      b += S.box({ id: "coverage", x: 420, y: 224, w: 200, h: 44, label: "coverage check", tone: "alaap" });
      b += S.arrow(520, 166, 520, 222, {});
      b += S.arrow(420, 246, 180, 64, { dash: true, curve: 55, label: "gap found" });
      return S.frame(650, 290, b);
    }
  };

  DIA.voicePipeline = {
    title: "Voice is a pipeline of streaming stages, and the user talking again can interrupt any of them.",
    cap: "<b>Every stage streams into the next before the previous one finishes.</b> Microphone frames go through voice-activity detection and endpointing (~150 ms) to decide when the user stopped talking, then streaming speech-to-text (~300 ms), the LLM streaming tokens back, a sentence chunker that hands complete sentences to streaming text-to-speech (~200 ms) for playback. Barge-in: VAD detecting new speech cancels TTS mid-sentence, so the agent stops talking the moment the user interrupts.",
    svg: function () {
      var b = "";
      b += S.box({ id: "mic", x: 0, y: 20, w: 90, h: 44, label: "mic", sub: "frames", tone: "req", icon: "mic" });
      b += S.box({ id: "vad", x: 120, y: 20, w: 140, h: 44, label: "VAD", sub: "endpointing, ~150ms", tone: "sys" });
      b += S.box({ id: "stt", x: 290, y: 20, w: 150, h: 44, label: "streaming STT", sub: "~300ms", tone: "sys" });
      b += S.box({ id: "llm", x: 470, y: 20, w: 120, h: 44, label: "LLM", sub: "streaming tokens", tone: "sys", icon: "bot" });
      b += S.box({ id: "chunker", x: 290, y: 122, w: 150, h: 44, label: "sentence chunker", tone: "math" });
      b += S.box({ id: "tts", x: 470, y: 122, w: 120, h: 44, label: "streaming TTS", sub: "~200ms", tone: "sys", icon: "speaker" });
      b += S.box({ id: "playback", x: 620, y: 122, w: 100, h: 44, label: "playback", tone: "now", icon: "volume-2" });
      b += S.arrow(90, 42, 116, 42, {});
      b += S.arrow(260, 42, 286, 42, {});
      b += S.arrow(440, 42, 466, 42, {});
      b += S.arrow(500, 64, 365, 120, {});
      b += S.arrow(440, 144, 466, 144, {});
      b += S.arrow(590, 144, 616, 144, {});
      b += S.arrow(190, 66, 530, 120, { dash: true, label: "barge-in: cancel" });
      return S.frame(720, 190, b);
    }
  };

  DIA.transformerBlock = {
    title: "The same block repeats N times: normalise, attend causally, add back, normalise, transform, add back.",
    cap: "<b>One block, stacked N times, turns embeddings into next-token logits.</b> Tokens are embedded and combined with position information, then pass through N identical blocks: layer norm, causal multi-head attention (each position only attends to itself and earlier positions), a residual add, another layer norm, an MLP, and a second residual add. After the last block, a final norm and a linear projection produce logits over the vocabulary, and softmax turns them into the next-token distribution.",
    svg: function () {
      var b = "";
      b += S.box({ id: "tokens", x: 0, y: 20, w: 90, h: 44, label: "tokens", tone: "req" });
      b += S.box({ id: "embed", x: 130, y: 20, w: 140, h: 44, label: "embed + pos", tone: "math" });
      b += S.arrow(90, 42, 126, 42, {});
      b += S.arrow(200, 64, 70, 110, {});
      b += '<rect x="0" y="100" width="390" height="140" rx="6" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="5 4" opacity="0.5"/>';
      b += S.text(355, 114, "x N", "d-t-x");
      b += S.box({ id: "ln1", x: 20, y: 112, w: 100, h: 40, label: "LN", tone: "flat" });
      b += S.box({ id: "mha", x: 140, y: 112, w: 150, h: 40, label: "MHA", sub: "causal mask", tone: "sys" });
      b += S.box({ id: "add1", x: 310, y: 112, w: 80, h: 40, label: "add", sub: "+ input", tone: "flat" });
      b += S.box({ id: "ln2", x: 20, y: 180, w: 100, h: 40, label: "LN", tone: "flat" });
      b += S.box({ id: "mlp", x: 140, y: 180, w: 150, h: 40, label: "MLP", tone: "sys" });
      b += S.box({ id: "add2", x: 310, y: 180, w: 80, h: 40, label: "add", sub: "+ add1", tone: "flat" });
      b += S.arrow(120, 132, 136, 132, {});
      b += S.arrow(290, 132, 306, 132, {});
      b += S.arrow(350, 152, 70, 178, {});
      b += S.arrow(120, 200, 136, 200, {});
      b += S.arrow(290, 200, 306, 200, {});
      b += S.box({ id: "finalNorm", x: 430, y: 150, w: 120, h: 44, label: "final norm", tone: "flat" });
      b += S.box({ id: "logits", x: 430, y: 210, w: 110, h: 44, label: "logits", tone: "math" });
      b += S.box({ id: "softmax", x: 430, y: 270, w: 110, h: 44, label: "softmax", tone: "math" });
      b += S.box({ id: "nextToken", x: 430, y: 330, w: 140, h: 44, label: "next token", tone: "now" });
      b += S.arrow(390, 200, 426, 172, {});
      b += S.arrow(490, 194, 485, 208, {});
      b += S.arrow(485, 254, 485, 268, {});
      b += S.arrow(485, 314, 485, 328, {});
      return S.frame(600, 400, b);
    }
  };

  DIA.bpeMerge = {
    title: "BPE learns merges by frequency; encoding replays those same merges in the order they were learned.",
    cap: "<b>Training and encoding are the same operation, run in opposite directions.</b> Training starts from raw bytes or characters, counts every adjacent pair, and merges the single most frequent pair into a new symbol — for example \"l\" and \"o\" merging into \"lo\" — growing the vocabulary by one entry per merge, repeated thousands of times. Encoding new text applies those learned merges in the exact order they were learned, turning characters into the final token ids.",
    svg: function () {
      var b = "";
      b += S.box({ id: "text", x: 0, y: 20, w: 90, h: 44, label: "text", tone: "req" });
      b += S.box({ id: "chars", x: 130, y: 20, w: 140, h: 44, label: "characters", sub: "or bytes", tone: "flat" });
      b += S.box({ id: "countPairs", x: 310, y: 20, w: 170, h: 44, label: "count adjacent pairs", tone: "math" });
      b += S.box({ id: "mergePair", x: 520, y: 20, w: 180, h: 50, label: "merge top pair", sub: "\"l\"+\"o\" -> \"lo\"", tone: "now", icon: "merge" });
      b += S.arrow(90, 42, 126, 42, {});
      b += S.arrow(270, 42, 306, 42, {});
      b += S.arrow(480, 42, 516, 45, {});
      b += S.arrow(610, 70, 395, 64, { curve: -50, label: "repeat" });
      b += S.box({ id: "vocab", x: 520, y: 122, w: 180, h: 44, label: "vocabulary grows", tone: "flat" });
      b += S.arrow(610, 70, 610, 120, {});
      b += S.box({ id: "encodeText", x: 0, y: 224, w: 110, h: 44, label: "text", tone: "req" });
      b += S.box({ id: "applyMerges", x: 160, y: 224, w: 210, h: 44, label: "apply merges", sub: "learned order", tone: "sys" });
      b += S.box({ id: "ids", x: 420, y: 224, w: 100, h: 44, label: "ids", tone: "now" });
      b += S.arrow(610, 166, 370, 222, { dash: true, label: "learned merges" });
      b += S.arrow(110, 246, 156, 246, {});
      b += S.arrow(370, 246, 416, 246, {});
      return S.frame(720, 310, b);
    }
  };

  DIA.evalHarness = {
    title: "An eval harness is a release gate: score against a baseline, and block the ship on a regression.",
    cap: "<b>The same golden set runs through both the candidate and the baseline before either ships.</b> The system under test runs the golden set, and each output is scored by several scorers — exact match, an LLM judge against a rubric, a citation check — then aggregated into a pass rate and pass^k for flaky cases. That aggregate is compared against the baseline's own scores, and a regression gate decides ship or block from the comparison, not from the candidate's score alone.",
    svg: function () {
      var b = "";
      b += S.box({ id: "goldenSet", x: 0, y: 20, w: 130, h: 44, label: "golden set", tone: "req", icon: "list-checks" });
      b += S.box({ id: "runSystem", x: 160, y: 20, w: 140, h: 44, label: "run system", tone: "sys" });
      b += S.box({ id: "scorers", x: 330, y: 20, w: 200, h: 50, label: "scorers", sub: "exact match, judge, citation", tone: "math" });
      b += S.box({ id: "aggregate", x: 560, y: 20, w: 130, h: 50, label: "aggregate", sub: "pass rate, pass^k", tone: "now" });
      b += S.arrow(130, 42, 156, 42, {});
      b += S.arrow(300, 42, 326, 42, {});
      b += S.arrow(530, 45, 556, 45, {});
      b += S.box({ id: "baseline", x: 160, y: 130, w: 140, h: 44, label: "baseline", tone: "flat" });
      b += S.box({ id: "compare", x: 560, y: 130, w: 130, h: 44, label: "compare", sub: "vs baseline", tone: "sys" });
      b += S.arrow(625, 70, 625, 128, {});
      b += S.arrow(300, 152, 556, 150, {});
      b += S.box({ id: "gate", x: 560, y: 224, w: 130, h: 50, label: "regression gate", sub: "ship or block", tone: "now" });
      b += S.arrow(625, 174, 625, 222, {});
      return S.frame(700, 290, b);
    }
  };

  DIA.schemaRepair = {
    title: "A model's output is untrusted until it parses and validates; a validation error becomes the next prompt.",
    cap: "<b>Structured output is enforced by a retry loop, not by asking nicely.</b> The schema or tool definition is put in the prompt, the model produces output, and that output is parsed as JSON, then validated against the schema. A pass returns a typed object; a failure — bad JSON or a schema violation — feeds the error message back into the next prompt and retries, up to n times, after which the caller gets a clean failure instead of a silent bad object.",
    svg: function () {
      var b = "";
      b += S.box({ id: "schema", x: 0, y: 20, w: 110, h: 44, label: "schema", sub: "or tool def", tone: "req" });
      b += S.box({ id: "prompt", x: 150, y: 20, w: 150, h: 44, label: "prompt", tone: "sys" });
      b += S.box({ id: "modelOut", x: 340, y: 20, w: 140, h: 44, label: "model output", tone: "sys", icon: "bot" });
      b += S.box({ id: "parse", x: 520, y: 20, w: 110, h: 44, label: "parse JSON", tone: "math" });
      b += S.arrow(110, 42, 146, 42, {});
      b += S.arrow(300, 42, 336, 42, {});
      b += S.arrow(480, 42, 516, 42, {});
      b += S.box({ id: "validate", x: 520, y: 122, w: 110, h: 44, label: "validate", tone: "math" });
      b += S.arrow(575, 64, 575, 120, {});
      b += S.box({ id: "ok", x: 380, y: 224, w: 140, h: 44, label: "typed object", tone: "now" });
      b += S.box({ id: "errBox", x: 570, y: 224, w: 140, h: 44, label: "feed error back", tone: "alaap" });
      b += S.arrow(560, 166, 450, 222, { label: "pass" });
      b += S.arrow(600, 166, 630, 222, { label: "error" });
      b += S.box({ id: "retry", x: 380, y: 326, w: 150, h: 44, label: "retry", sub: "at most n", tone: "alaap" });
      b += S.arrow(620, 268, 480, 324, {});
      b += S.arrow(455, 326, 225, 64, { curve: 90, label: "retry" });
      b += S.box({ id: "cleanFail", x: 570, y: 326, w: 150, h: 44, label: "clean failure", sub: "after n", tone: "alaap" });
      b += S.arrow(530, 348, 566, 348, { dash: true, label: "n exceeded" });
      return S.frame(720, 390, b);
    }
  };

  DIA.servingPath = {
    title: "A request is cached, queued and batched before it reaches the model — and every stage reports to metrics.",
    cap: "<b>The path a single request takes through a serving stack.</b> The client's request hits an API endpoint, passes auth and rate limiting, and checks a cache — a hit returns immediately, skipping everything downstream. A miss joins a queue where a micro-batcher groups requests before they reach the model, which streams tokens back to the client over SSE. A side channel tracks metrics and timeouts at every stage, not just at the end.",
    svg: function () {
      var b = "";
      b += S.box({ id: "client", x: 0, y: 20, w: 100, h: 44, label: "client", tone: "req", icon: "user" });
      b += S.box({ id: "endpoint", x: 140, y: 20, w: 140, h: 44, label: "API endpoint", tone: "sys" });
      b += S.box({ id: "auth", x: 320, y: 20, w: 160, h: 44, label: "auth, rate limit", tone: "sys", icon: "lock" });
      b += S.box({ id: "cache", x: 520, y: 20, w: 140, h: 44, label: "cache check", tone: "math" });
      b += S.arrow(100, 42, 136, 42, {});
      b += S.arrow(280, 42, 316, 42, {});
      b += S.arrow(480, 42, 516, 42, {});
      b += S.box({ id: "queue", x: 320, y: 122, w: 170, h: 44, label: "queue + batch", sub: "micro-batcher", tone: "sys" });
      b += S.box({ id: "model", x: 520, y: 122, w: 140, h: 44, label: "model", tone: "sys", icon: "bot" });
      b += S.box({ id: "stream", x: 520, y: 224, w: 170, h: 44, label: "stream tokens", sub: "SSE", tone: "now" });
      b += S.box({ id: "metrics", x: 0, y: 122, w: 170, h: 60, label: "metrics, timeouts", sub: "every stage", tone: "flat" });
      b += S.arrow(560, 64, 400, 120, { label: "miss" });
      b += S.arrow(520, 42, 100, 42, { curve: -60, label: "hit" });
      b += S.arrow(490, 144, 516, 144, {});
      b += S.arrow(590, 166, 605, 222, {});
      b += S.arrow(520, 246, 50, 64, { curve: -100, label: "SSE" });
      b += S.arrow(320, 144, 170, 150, { dash: true });
      return S.frame(710, 300, b);
    }
  };

  DIA.lora = {
    title: "LoRA trains two small matrices instead of one big one; at inference they merge back into it for free.",
    cap: "<b>Only A and B train — W stays frozen the entire time.</b> Input x goes through the frozen weight W (d x k) and, in parallel, through A (r x k) then B (d x r), scaled by alpha/r, before the two paths sum into the output. r is small, often 8, which is the entire point: training d x k parameters costs d*k, training r*(d+k) costs far less once d and k are in the thousands. At inference, W' = W + (alpha/r) x B x A merges the adapter into one matrix, so serving pays no extra latency over the base model.",
    svg: function () {
      var b = "";
      b += S.box({ id: "x", x: 0, y: 100, w: 70, h: 44, label: "x", tone: "req" });
      b += S.box({ id: "W", x: 130, y: 20, w: 110, h: 44, label: "W", sub: "frozen, d x k", tone: "math" });
      b += S.box({ id: "A", x: 130, y: 100, w: 80, h: 44, label: "A", sub: "r x k", tone: "math" });
      b += S.box({ id: "B", x: 250, y: 100, w: 80, h: 44, label: "B", sub: "d x r", tone: "math" });
      b += S.box({ id: "scale", x: 360, y: 100, w: 110, h: 44, label: "x alpha/r", tone: "math" });
      b += S.box({ id: "sum", x: 510, y: 60, w: 90, h: 44, label: "sum", tone: "sys" });
      b += S.box({ id: "output", x: 630, y: 60, w: 90, h: 44, label: "output", tone: "now" });
      b += S.arrow(70, 110, 126, 55, {});
      b += S.arrow(70, 122, 126, 122, {});
      b += S.arrow(210, 122, 246, 122, {});
      b += S.arrow(330, 122, 356, 122, {});
      b += S.arrow(240, 55, 506, 75, {});
      b += S.arrow(470, 122, 506, 95, {});
      b += S.arrow(600, 82, 626, 82, {});
      b += S.box({ id: "merge", x: 250, y: 200, w: 280, h: 50, label: "merge for inference", sub: "W' = W + (alpha/r) B A", tone: "now" });
      b += S.arrow(185, 64, 390, 198, { dash: true, curve: -100, label: "fuse for serving" });
      b += S.arrow(290, 144, 290, 198, { dash: true });
      b += S.text(0, 280, "params to train: W is d*k; A + B is r*(d+k) — far smaller once r stays small, e.g. r=8.", "d-t-s");
      return S.frame(720, 300, b);
    }
  };

  /* ---- Voice agent mechanisms, 4 figures added 2026-09-30 ---- */

  DIA.callPath = {
    title: "How a phone call reaches a voice agent",
    cap: "<b>Signalling sets a call up; media carries the audio, and they travel as separate streams.</b> A phone call crosses the carrier and a SIP trunk as SIP messages (dashed) and RTP audio (solid). The media server's SIP service turns the call into a participant in a room, and a browser joins the same kind of room over WebRTC. The SFU forwards each track without mixing, and the agent worker is one more participant: it subscribes to the caller's audio and publishes its own.",
    svg: function () {
      var b = "";
      b += S.text(0, 14, "Dashed: signalling, which sets the call up. SIP sends INVITE, then ringing, then answered.", "d-t-s");
      b += S.text(0, 30, "Solid: media, the audio itself. RTP carries G.711 mu-law at 8 kHz, one packet every 20 ms.", "d-t-s");
      b += S.box({ id: "caller", x: 0, y: 42, w: 118, h: 56, label: "Caller", sub: "phone on the PSTN", tone: "req" });
      b += S.box({ id: "carrier", x: 174, y: 42, w: 118, h: 56, label: "Carrier", sub: "phone company", tone: "flat" });
      b += S.box({ id: "trunk", x: 348, y: 42, w: 118, h: 56, label: "SIP trunk", sub: "PSTN meets IP", tone: "flat" });
      b += S.box({ id: "sip", x: 522, y: 42, w: 118, h: 56, label: "SIP service", sub: "call joins a room", tone: "sys" });
      [["caller", "carrier", 118, "dial", "voice"], ["carrier", "trunk", 292, "SIP", "RTP"], ["trunk", "sip", 466, "SIP", "RTP"]].forEach(function (h) {
        b += S.arrow(h[2] + 2, 56, h[2] + 54, 56, { id: h[0] + ">" + h[1], dash: true, label: h[3] });
        b += S.arrow(h[2] + 2, 84, h[2] + 54, 84, { id: h[0] + ">" + h[1] + "#2", label: h[4] });
      });
      b += S.arrow(560, 100, 420, 168, { id: "sip>room" });
      b += S.text(498, 142, "caller's audio track", "d-t-s");
      b += S.box({ id: "browser", x: 0, y: 170, w: 120, h: 52, label: "Browser", sub: "WebRTC client", tone: "req", icon: "globe" });
      b += S.box({ id: "room", x: 250, y: 170, w: 190, h: 52, label: "Room on the SFU", sub: "forwards, never mixes", tone: "sys", icon: "server" });
      b += S.box({ id: "agent", x: 510, y: 170, w: 130, h: 52, label: "Agent worker", sub: "a participant", tone: "iv", icon: "bot" });
      b += S.arrow(122, 184, 248, 184, { id: "browser>room", dash: true, label: "WebSocket, SDP" });
      b += S.arrow(122, 210, 248, 210, { id: "browser>room#2", label: "DTLS-SRTP, Opus" });
      b += S.arrow(442, 184, 508, 184, { id: "room>agent", label: "subscribes" });
      b += S.arrow(508, 210, 442, 210, { id: "agent>room", label: "publishes" });
      b += S.box({ id: "nat", x: 0, y: 250, w: 240, h: 44, label: "ICE, STUN, TURN", sub: "find a path through NAT", tone: "math" });
      b += S.arrow(60, 248, 60, 224, { id: "nat>browser", dash: true });
      b += S.arrow(220, 248, 280, 224, { id: "nat>room", dash: true });
      return S.frame(640, 304, b);
    }
  };

  /* 160 px a second, t = 0 (the caller stops) at x = 260. */
  DIA.turnTaking = {
    title: "Turn-taking: deciding the caller has finished, then answering",
    cap: "<b>The agent cannot start its reply until it decides the caller has finished, and that decision is the largest wait in the turn.</b> Illustrative targets for one exchange: the end-of-turn detector waits 300 to 500 ms of silence, the final transcript lands 100 to 200 ms later, the LLM's first token 300 to 500 ms after that, and the first audio 100 to 200 ms after the token, so the caller hears the agent about 1 to 1.5 s after they stop. Below: while the agent speaks, a sound from the caller can be a backchannel, a real interruption or noise, and each needs a different response.",
    svg: function () {
      var b = "";
      function X(t) { return 260 + t * 160; }
      [[-1, "-1 s"], [-0.5, "-0.5 s"], [0.5, "0.5 s"], [1, "1 s"], [1.5, "1.5 s"], [2, "2 s"]].forEach(function (t) {
        b += S.text(X(t[0]), 12, t[1], "d-t-x", "middle");
      });
      b += S.text(260, 12, "caller stops", "d-t-x", "middle");
      b += S.path("M260,18 L260,168", "flat", true);
      ["Caller", "VAD", "End of turn", "STT", "LLM", "TTS"].forEach(function (l, i) { b += S.text(0, 39 + i * 30, l, "d-t-s"); });
      b += S.box({ id: "speech", x: 100, y: 24, w: 160, h: 22, label: "speaking", tone: "req" });
      b += S.box({ id: "vad", x: 104, y: 54, w: 164, h: 22, label: "speech detected", tone: "flat" });
      b += S.text(276, 69, "then silence", "d-t-s");
      b += S.box({ id: "eot", x: 260, y: 84, w: 64, h: 22, label: "waits", tone: "alaap" });
      b += S.text(332, 99, "decides the turn is over: 300 to 500 ms", "d-t-s");
      b += S.box({ id: "partials", x: 110, y: 114, w: 150, h: 22, label: "partials", tone: "flat", dash: true });
      b += S.box({ id: "final", x: 324, y: 114, w: 24, h: 22, tone: "sys" });
      b += S.text(356, 129, "final transcript, 100 to 200 ms later", "d-t-s");
      b += S.box({ id: "llm", x: 348, y: 144, w: 64, h: 22, tone: "sys" });
      b += S.text(420, 159, "first token, 300 to 500 ms", "d-t-s");
      b += S.text(404, 189, "first audio 100 to 200 ms after the first token", "d-t-s", "end");
      b += S.box({ id: "synth", x: 412, y: 174, w: 24, h: 22, tone: "sys" });
      b += S.box({ id: "audio", x: 436, y: 174, w: 184, h: 22, label: "agent speaks", tone: "now" });
      b += S.node("ttfa", S.path("M260,200 L260,210 L436,210 L436,200", "now") +
        S.text(348, 226, "time to first audio: about 1.1 s", "d-t-b", "middle"));

      b += S.text(0, 254, "A sound from the caller while the agent speaks", "d-t-b");
      var y = 266;
      b += S.node("backchannel", S.text(0, y + 13, "Backchannel", "d-t-s") +
        S.bar({ x: 100, y: y, w: 520, h: 18, tone: "now" }) + S.text(440, y + 13, "agent keeps talking", "d-t-s", "middle") +
        S.bar({ x: 220, y: y + 22, w: 50, h: 16, tone: "req" }) + S.text(245, y + 34, "mm-hm", "d-t-s", "middle") +
        S.text(280, y + 34, "short, asks for nothing: not a turn", "d-t-x"));
      y = 312;
      b += S.node("interruption", S.text(0, y + 13, "Interruption", "d-t-s") +
        S.bar({ x: 100, y: y, w: 232, h: 18, tone: "now" }) + S.text(216, y + 13, "agent speaks", "d-t-s", "middle") +
        S.text(342, y + 13, "stops within about 200 ms, listens", "d-t-s") +
        S.bar({ x: 300, y: y + 22, w: 320, h: 16, tone: "req" }) + S.text(460, y + 34, "caller: \"wait, make it Tuesday\"", "d-t-s", "middle"));
      y = 358;
      b += S.node("noise", S.text(0, y + 13, "Noise", "d-t-s") +
        S.bar({ x: 100, y: y, w: 200, h: 18, tone: "now" }) + S.text(200, y + 13, "agent speaks", "d-t-s", "middle") +
        S.text(340, y + 13, "pauses", "d-t-s", "middle") +
        S.bar({ x: 380, y: y, w: 240, h: 18, tone: "now" }) + S.text(500, y + 13, "resumes: no words heard", "d-t-s", "middle") +
        S.bar({ x: 290, y: y + 22, w: 36, h: 16, tone: "flat" }) + S.text(334, y + 34, "a door, a TV: sound but no words", "d-t-x"));
      return S.frame(640, 404, b);
    }
  };

  DIA.eventLoop = {
    title: "One event loop, many calls",
    cap: "<b>An asyncio event loop runs many calls on one thread by switching whenever a call awaits I/O.</b> Each call runs for a moment, then awaits audio frames, a model stream or a tool's HTTP reply, and the loop runs whichever call is ready. That only works while every call keeps awaiting: one call doing CPU work inline (VAD, resampling) holds the thread, and every call on the loop stalls with it. The fix moves that work off the loop, with asyncio.to_thread or run_in_executor on a thread or process pool, or into a separate worker process, so the loop stays free.",
    svg: function () {
      var b = "";
      var TONE = ["sys", "math", "iv"];
      function slices(xs, y, tone) { return xs.map(function (x) { return S.bar({ x: x, y: y, w: 16, h: 18, tone: tone }); }).join(""); }
      function waiting(x, y, w) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="18" rx="3" class="d-fill-flat d-str-alaap" stroke-width="1" stroke-dasharray="4 3"/>'; }
      var H = [[110, 230, 350, 470, 590], [130, 270, 390, 510], [150, 310, 430, 550]];
      var AW = [[178, "awaits audio"], [208, "awaits model tokens"], [238, "awaits tool HTTP"]];

      b += S.text(0, 12, "One thread, many calls: each runs until it awaits I/O, then the loop switches", "d-t-b");
      H.forEach(function (xs, i) {
        var y = 22 + i * 24;
        b += S.node("h-call" + (i + 1), S.text(0, y + 13, "Call " + (i + 1), "d-t-s") + slices(xs, y, TONE[i]) +
          S.text(AW[i][0], y + 13, AW[i][1], "d-t-x", "middle"));
      });
      b += S.node("h-thread", S.text(0, 107, "Thread", "d-t-s") + H.map(function (xs, i) { return slices(xs, 94, TONE[i]); }).join(""));

      b += S.text(0, 136, "Blocking: call 1 runs VAD on the loop, and every call stalls", "d-t-b");
      b += S.node("b-cpu", S.text(0, 159, "Call 1", "d-t-s") + S.bar({ x: 110, y: 146, w: 260, h: 18, tone: "alaap" }) +
        S.text(240, 159, "VAD inline: 200 ms of CPU, no await", "d-t-s", "middle") +
        S.text(380, 159, "the loop cannot switch", "d-t-x"));
      b += S.node("b-waiting", S.text(0, 183, "Call 2", "d-t-s") + waiting(150, 170, 220) +
        S.text(260, 183, "tokens ready, waiting", "d-t-x", "middle") + slices([370], 170, "math") +
        S.text(0, 207, "Call 3", "d-t-s") + waiting(170, 194, 220) +
        S.text(280, 207, "reply ready, waiting", "d-t-x", "middle") + slices([390], 194, "iv"));
      b += S.node("b-thread", S.text(0, 231, "Thread", "d-t-s") + S.bar({ x: 110, y: 218, w: 260, h: 18, tone: "alaap" }) +
        S.text(240, 231, "busy with call 1 only", "d-t-s", "middle") + slices([370], 218, "math") + slices([390], 218, "iv") +
        S.text(420, 231, "every call's audio queues up", "d-t-x"));

      b += S.text(0, 260, "Offloaded: call 1 awaits a worker thread, so the loop keeps switching", "d-t-b");
      b += S.text(0, 283, "Call 1", "d-t-s");
      b += S.box({ id: "f-call1", x: 110, y: 270, w: 16, h: 18, tone: "sys" });
      b += S.text(134, 283, "await asyncio.to_thread(vad)", "d-t-x");
      b += S.box({ id: "f-call1", x: 374, y: 270, w: 16, h: 18, tone: "sys" });
      b += S.text(396, 283, "result back, carries on", "d-t-x");
      b += S.node("f-others", S.text(0, 307, "Call 2", "d-t-s") + slices([150, 250, 330, 450, 550], 294, "math") +
        S.text(0, 331, "Call 3", "d-t-s") + slices([190, 290, 410, 510, 590], 318, "iv"));
      b += S.text(0, 355, "Pool", "d-t-s");
      b += S.box({ id: "f-pool", x: 130, y: 342, w: 240, h: 18, label: "VAD on a worker thread", tone: "math" });
      b += S.text(380, 355, "or a process pool, or a separate worker", "d-t-x");
      b += S.arrow(120, 290, 134, 340, {});
      b += S.arrow(366, 340, 380, 290, {});
      return S.frame(640, 370, b);
    }
  };

  DIA.idempotencyKey = {
    title: "A retry must not do it twice",
    cap: "<b>An idempotency key lets the server recognise a retry and answer it from the record instead of doing the work again.</b> The client sends the booking with a key. The server books the slot and stores the key with its result in the same transaction, so both happen or neither does. The response is lost, so the client retries with the same key; the server finds the key and returns the stored result, and the slot is booked once. With no key, the retry looks like a new request and books a second slot.",
    svg: function () {
      var b = "";
      b += S.box({ id: "client", x: 0, y: 0, w: 130, h: 40, label: "Client", sub: "retries on timeout", tone: "req" });
      b += S.box({ id: "server", x: 240, y: 0, w: 150, h: 40, label: "Booking API", tone: "sys", icon: "server" });
      b += S.box({ id: "db", x: 480, y: 0, w: 160, h: 40, label: "Database", tone: "math", icon: "database" });
      b += S.path("M65,42 L65,282", "flat", true);
      b += S.path("M315,42 L315,282", "flat", true);
      b += S.path("M560,42 L560,72", "flat", true);
      b += S.arrow(67, 62, 313, 62, { id: "client>server", label: "book 3 pm, key k7" });
      b += S.arrow(317, 100, 468, 100, { id: "server>tx", label: "one commit" });
      b += S.box({ id: "tx", x: 470, y: 74, w: 170, h: 52, label: "One transaction", sub: "book 3 pm + save k7", tone: "math" });
      b += S.arrow(313, 131, 198, 131, { id: "server>lost", dash: true, label: "201, booking 42" });
      b += S.box({ id: "lost", x: 120, y: 118, w: 74, h: 26, label: "lost", tone: "alaap", icon: "x" });
      b += S.text(67, 162, "the client times out and cannot tell if it booked", "d-t-s");
      b += S.arrow(555, 128, 555, 202, { id: "tx>ledger" });
      b += S.text(547, 170, "writes the row", "d-t-s", "end");
      b += S.node("ledger", '<rect x="440" y="204" width="200" height="52" rx="0" class="d-fill-math d-str-math" stroke-width="1.25"/>' +
        '<path d="M440,226 L640,226" class="d-str-math" stroke-width="1"/>' +
        S.text(452, 220, "key", "d-t-x") + S.text(494, 220, "status", "d-t-x") + S.text(556, 220, "result", "d-t-x") +
        S.text(452, 245, "k7", "d-t") + S.text(494, 245, "done", "d-t") + S.text(556, 245, "booking 42", "d-t"));
      b += S.arrow(67, 196, 313, 196, { id: "client>server#2", label: "retry, same key k7" });
      b += S.arrow(317, 222, 438, 222, { id: "server>ledger", label: "look up k7" });
      b += S.arrow(438, 248, 317, 248, { id: "ledger>server", dash: true, label: "found" });
      b += S.arrow(313, 274, 67, 274, { id: "server>client", label: "201, booking 42 again, no new booking" });
      b += S.text(0, 312, "Without a key", "d-t-b");
      b += S.box({ id: "nokey", x: 0, y: 322, w: 300, h: 44, label: "Retry with no key", sub: "the server cannot tell it is a repeat", tone: "alaap" });
      b += S.arrow(302, 344, 358, 344, { id: "nokey>twice" });
      b += S.box({ id: "twice", x: 360, y: 322, w: 280, h: 44, label: "Two bookings at 3 pm", sub: "booking 42 and booking 43", tone: "alaap", icon: "triangle-alert" });
      return S.frame(640, 376, b);
    }
  };

  /* ------------------------------------------------ NLP and conversational AI (wc25 to wc30) */

  function fLine(x1, y1, x2, y2, cls) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || "d-str-flat") + '" stroke-width="1"/>';
  }
  function fDot(x, y, tone, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3.5) + '" class="d-fill-' + tone + ' d-str-' + tone + '" stroke-width="1"/>';
  }
  function fArr(x1, y1, x2, y2) {
    return '<path d="M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2 + '" class="d-line" stroke-width="1.25" marker-end="url(#ah)"/>';
  }
  function fCell(x, y, w, h, tone) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="d-fill-' + tone + ' d-str-' + tone + '" stroke-width="1"/>';
  }

  DIA.nlpMap = {
    title: "The field of NLP as one map, with conversational AI built on top",
    cap: "<b>Conversational AI is not a separate field: it is a stack built from the tasks under it.</b> Read the map from the bottom up. Foundations turn text into units: tokens, morphology, tagging, parsing. Representations turn units into numbers, from counts and TF-IDF to contextual and sentence embeddings. Tasks use those numbers, and evaluation scores each task. A virtual assistant combines several of them: intent classification and NER in front, retrieval for knowledge, an LLM for generation and tool calls, plus dialogue state and safety. Along the bottom, the model eras say how each layer has been learned; each era replaced hand-built features with learned representations.",
    svg: function () {
      var b = "";
      b += S.tag(0, 10, "Where conversational AI sits");
      b += S.box({ id: "convai", x: 0, y: 16, w: 640, h: 46, label: "conversational AI", sub: "intents and NER in front, retrieval, an LLM, dialogue state, safety", tone: "iv", icon: "message-square" });
      b += S.arrow(74, 96, 74, 64, {});
      b += S.text(82, 84, "built from", "d-t-x");
      b += S.tag(0, 92, "Tasks");
      [["classification", "classification", "intent, sentiment"], ["ner", "NER, labelling", "a label per token"],
        ["qa", "question answering", "span or open domain"], ["summarization", "summarization", "watch faithfulness"],
        ["translation", "translation", "gave us attention"], ["retrieval", "retrieval", "BM25, dense, rerank"],
        ["dialogue", "dialogue", "task or open chat"], ["extraction", "extraction", "relations, events"]].forEach(function (t, i) {
        b += S.box({ id: t[0], x: (i % 4) * 164, y: 98 + Math.floor(i / 4) * 48, w: 148, h: 40, label: t[1], sub: t[2], tone: "sys" });
      });
      b += S.tag(0, 212, "Text to numbers");
      b += S.tag(416, 212, "How it is scored");
      b += S.box({ id: "repr", x: 0, y: 218, w: 400, h: 44, label: "representations", sub: "one-hot, counts, TF-IDF, static, contextual, sentence", tone: "math" });
      b += S.box({ id: "eval", x: 416, y: 218, w: 224, h: 44, label: "evaluation", sub: "F1, BLEU, perplexity, judges", tone: "now" });
      b += S.arrow(200, 216, 200, 188, {});
      b += S.arrow(450, 216, 450, 188, {});
      b += S.text(444, 200, "scores", "d-t-x", "end");
      b += S.tag(0, 292, "Text to units");
      b += S.box({ id: "foundations", x: 0, y: 300, w: 640, h: 44, label: "foundations", sub: "tokens and subwords, morphology, part-of-speech tagging, parsing", tone: "req" });
      b += S.arrow(200, 298, 200, 264, {});
      b += S.tag(0, 372, "Model eras: how each layer is learned");
      var eras = '<path d="M20,404 L622,404" class="d-line" stroke-width="1.25" marker-end="url(#ah)"/>';
      [["rules", "precise, brittle"], ["statistical", "NB, HMM, CRF, n-grams"], ["neural", "RNN, LSTM, seq2seq"],
        ["Transformers", "BERT, GPT, T5"], ["LLMs", "one model, many tasks"]].forEach(function (e, i) {
        var x = 64 + i * 128;
        eras += fDot(x, 404, "sys", 4.5) + S.text(x, 394, e[0], "d-t-b", "middle") + S.text(x, 422, e[1], "d-t-x", "middle");
      });
      b += S.node("eras", eras);
      return S.frame(640, 436, b);
    }
  };

  DIA.reprLadder = {
    title: "The representation ladder: each rung closes a gap the one below left open",
    cap: "<b>Every step up the ladder answers one complaint about the step below.</b> One-hot gives each word its own dimension, so every two words are equally far apart. Bag of words counts them, TF-IDF weights the counts by rarity, and n-grams add a little local order: all four are sparse counts. Static embeddings (word2vec, GloVe, fastText) learn one dense vector per word from the contexts it appears in, so similar words sit close, but \"bank\" has one vector. Contextual embeddings (ELMo, BERT) give each occurrence its own vector. Sentence embeddings (Sentence-BERT, contrastive training) give a whole text one vector where cosine means similar meaning; they drive semantic search, clustering and RAG.",
    svg: function () {
      var b = "";
      var R = [
        ["onehot", "one-hot", "one dimension per word", "the start: a word becomes a number", "still: every two words equally far apart"],
        ["bow", "bag of words", "counts, order ignored", "a whole text becomes one vector of counts", "still: \"the\" outweighs everything"],
        ["tfidf", "TF-IDF", "counts weighted by rarity", "common words count less, rare words carry signal", "still: no order, no synonyms"],
        ["ngrams", "n-grams", "counts of word sequences", "some local order: \"not good\" is not \"good\"", "still: synonyms look unrelated"],
        ["static", "static embeddings", "word2vec, GloVe, fastText", "dense and learned: similar words sit close", "still: one vector for \"bank\", river or money"],
        ["contextual", "contextual embeddings", "ELMo, BERT", "a vector per token, from the whole sentence", "still: pooled tokens make a poor sentence vector"],
        ["sentence", "sentence embeddings", "Sentence-BERT, contrastive", "one vector per text: cosine means similar meaning", "used for: semantic search, clustering, RAG"]
      ];
      b += S.text(70, 14, "rung", "d-t-x");
      b += S.text(268, 14, "the gap it closes, and what it still misses", "d-t-x");
      R.forEach(function (r, i) {
        var y = 24 + i * 50;
        b += S.box({ id: r[0], x: 70, y: y, w: 180, h: 38, label: r[1], sub: r[2], tone: i < 4 ? "req" : "math" });
        b += S.text(268, y + 16, r[3], "d-t-s");
        b += S.text(268, y + 31, r[4], "d-t-x");
        if (i < R.length - 1) { b += S.arrow(160, y + 39, 160, y + 49, {}); }
      });
      b += S.path("M64,26 L58,26 L58,210 L64,210", "flat");
      b += S.text(0, 122, "SPARSE", "d-t-x");
      b += S.path("M64,226 L58,226 L58,360 L64,360", "flat");
      b += S.text(0, 297, "DENSE", "d-t-x");
      return S.frame(640, 372, b);
    }
  };

  DIA.clfLadder = {
    title: "The text classification ladder: labelled data needed against cost per call",
    cap: "<b>Pick the cheapest rung that meets the bar, and measure what each bigger model buys on your own data.</b> TF-IDF with logistic regression trains in seconds on a CPU and tells you how hard the problem is. A fine-tuned encoder wins with thousands of labelled examples and strict latency. SetFit and a frozen encoder with a small head work from a few examples per class. Zero-shot NLI and LLM prompting need no labels but cost a forward pass per label or a full LLM call. One preprint measured a p50 of about 2.4 ms for fine-tuned RoBERTa against about 981 ms for an LLM. The hybrid route, a fast classifier with the LLM only for uncertain turns, came within 2% of the LLM's accuracy at half the latency in Amazon's study.",
    svg: function () {
      var b = "";
      b += S.axes(60, 20, 560, 270, "", "latency and cost per call");
      b += S.text(56, 50, "about 1 s", "d-t-x", "end");
      b += S.text(56, 270, "about 2 ms", "d-t-x", "end");
      b += S.text(145, 306, "none", "d-t-x", "middle");
      b += S.text(255, 306, "a few per class", "d-t-x", "middle");
      b += S.text(405, 306, "hundreds", "d-t-x", "middle");
      b += S.text(545, 306, "thousands", "d-t-x", "middle");
      b += S.text(340, 324, "labelled examples needed", "d-t-s", "middle");
      b += S.box({ id: "llm", x: 70, y: 30, w: 150, h: 40, label: "LLM prompting", sub: "zero or few shot", tone: "iv" });
      b += S.box({ id: "nli", x: 70, y: 100, w: 150, h: 40, label: "zero-shot NLI", sub: "one pass per label", tone: "iv" });
      b += S.box({ id: "embhead", x: 330, y: 150, w: 150, h: 40, label: "embeddings + head", sub: "50 to 500 per class", tone: "math" });
      b += S.box({ id: "setfit", x: 180, y: 196, w: 130, h: 40, label: "SetFit", sub: "8 to 64 per class", tone: "math" });
      b += S.box({ id: "encoder", x: 470, y: 196, w: 150, h: 40, label: "fine-tuned encoder", sub: "thousands, under 20 ms", tone: "sys" });
      b += S.box({ id: "tfidf", x: 330, y: 238, w: 150, h: 40, label: "TF-IDF + LR", sub: "CPU, seconds to train", tone: "req" });
      b += S.arrow(310, 194, 224, 60, { dash: true });
      b += S.text(280, 128, "uncertain turns only", "d-t-x");
      return S.frame(640, 334, b);
    }
  };

  DIA.contrastive = {
    title: "Contrastive training: pull the positive in, push the rest of the batch away",
    cap: "<b>A sentence embedding model learns by comparison, not by labels.</b> For each query, the loss (InfoNCE) is a softmax over its similarity to one positive and many negatives, so raising the positive means lowering the rest. With in-batch negatives, every other example's positive is a free negative, which is why large batches help. Hard negatives, close but wrong, teach the most. The temperature T divides every similarity before the softmax: a small T sharpens it, so the closest negatives are penalised hardest. SetFit uses the same idea on pairs built from a few labelled examples per class.",
    svg: function () {
      var b = "";
      b += S.tag(0, 12, "Embedding space");
      b += '<rect x="0" y="20" width="380" height="250" rx="8" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="5 4" opacity="0.5"/>';
      b += S.box({ id: "query", x: 140, y: 140, w: 80, h: 26, r: 13, label: "query", tone: "now" });
      b += S.box({ id: "positive", x: 250, y: 86, w: 90, h: 26, r: 13, label: "positive", tone: "math" });
      b += S.box({ id: "hardneg", x: 24, y: 84, w: 116, h: 26, r: 13, label: "hard negative", tone: "alaap" });
      b += S.box({ id: "neg1", x: 150, y: 34, w: 136, h: 26, r: 13, label: "in-batch negative", tone: "flat" });
      b += S.box({ id: "neg2", x: 24, y: 224, w: 136, h: 26, r: 13, label: "in-batch negative", tone: "flat" });
      b += S.box({ id: "neg3", x: 230, y: 214, w: 136, h: 26, r: 13, label: "in-batch negative", tone: "flat" });
      b += S.arrow(222, 146, 252, 114, {});
      b += S.text(240, 140, "pull", "d-t-s");
      b += S.arrow(150, 138, 110, 112, {});
      b += S.text(104, 132, "push", "d-t-s", "end");
      b += S.arrow(190, 138, 205, 62, {});
      b += S.arrow(160, 168, 110, 222, {});
      b += S.arrow(210, 168, 270, 212, {});
      b += S.node("infonce", S.text(400, 40, "InfoNCE, per query", "d-t-b") +
        S.text(400, 60, "a softmax over similarities: the", "d-t-s") +
        S.text(400, 76, "positive against every negative", "d-t-s") +
        S.text(400, 98, "loss = -log( e^(s+/T) / Σ e^(s/T) )", "d-t-s"));
      b += S.node("inbatch", S.text(400, 130, "In-batch negatives", "d-t-b") +
        S.text(400, 150, "every other pair's positive is a", "d-t-s") +
        S.text(400, 166, "free negative: a bigger batch gives", "d-t-s") +
        S.text(400, 182, "more, and harder, negatives", "d-t-s"));
      b += S.node("temperature", S.text(400, 214, "Temperature T", "d-t-b") +
        S.text(400, 234, "a small T sharpens the softmax, so", "d-t-s") +
        S.text(400, 250, "close negatives cost the most", "d-t-s"));
      return S.frame(640, 280, b);
    }
  };

  DIA.annIndex = {
    title: "Four ways to find nearest neighbours, each paying in memory, recall or speed",
    cap: "<b>Approximate search gives up a little recall for a lot of speed, and each index pays in a different currency.</b> Flat compares the query with every vector: exact, and fine up to roughly a million vectors. HNSW builds a layered proximity graph and descends greedily from a sparse top layer to the dense bottom one: very good recall and speed, high memory. IVF splits the space into nlist k-means cells and searches only the nprobe nearest. PQ cuts each vector into sub-vectors and stores a short code for each: 10x to 50x less memory at some recall cost. IVF-PQ combines the last two for billions of vectors.",
    svg: function () {
      var b = "";
      var P = [
        ["flat", "flat", "exact, every vector", ["memory: every vector", "recall: exact", "time: scans them all", "fine to about 1M"]],
        ["hnsw", "HNSW", "layered graph", ["memory: high, the graph", "recall: very good", "speed: fast", "knobs: M, efSearch"]],
        ["ivf", "IVF", "k-means cells", ["memory: lower", "recall: set by nprobe", "speed: a few cells", "knobs: nlist, nprobe"]],
        ["pq", "PQ", "short codes", ["memory: 10x to 50x less", "recall: some loss", "pairs with IVF", "IVF-PQ for billions"]]
      ];
      P.forEach(function (p, i) {
        var x0 = i * 164, d = "", k, j;
        b += S.box({ id: p[0], x: x0, y: 0, w: 148, h: 40, label: p[1], sub: p[2], tone: i === 0 ? "flat" : "sys" });
        if (p[0] === "flat") {
          for (k = 0; k < 4; k++) { for (j = 0; j < 3; j++) { d += fLine(x0 + 74, 130, x0 + 22 + k * 35, 70 + j * 40) + fDot(x0 + 22 + k * 35, 70 + j * 40, "sys"); } }
          d += fDot(x0 + 74, 130, "now", 5);
        } else if (p[0] === "hnsw") {
          [66, 108, 150].forEach(function (y) { d += S.path("M" + (x0 + 8) + "," + y + " L" + (x0 + 140) + "," + y, "flat", true); });
          [26, 116].forEach(function (x) { d += fDot(x0 + x, 66, "sys"); });
          [26, 60, 92, 116].forEach(function (x) { d += fDot(x0 + x, 108, "sys"); });
          for (k = 0; k < 8; k++) { d += fDot(x0 + 16 + k * 17, 150, "sys"); }
          d += S.path("M" + (x0 + 26) + ",66 L" + (x0 + 116) + ",66 L" + (x0 + 116) + ",108 L" + (x0 + 92) + ",108 L" + (x0 + 84) + ",150", "now");
          d += fDot(x0 + 84, 150, "now", 5);
        } else if (p[0] === "ivf") {
          d += fCell(x0 + 52, 56, 44, 52, "math") + fCell(x0 + 96, 56, 44, 52, "math");
          d += '<rect x="' + (x0 + 8) + '" y="56" width="132" height="104" fill="none" class="d-str-flat" stroke-width="1"/>';
          d += fLine(x0 + 52, 56, x0 + 52, 160) + fLine(x0 + 96, 56, x0 + 96, 160) + fLine(x0 + 8, 108, x0 + 140, 108);
          [30, 74, 118].forEach(function (x) { d += fDot(x0 + x, 82, "sys") + fDot(x0 + x, 134, "sys"); });
          d += fDot(x0 + 92, 92, "now", 5);
          d += S.text(x0 + 74, 176, "nprobe = 2 of 6 cells", "d-t-x", "middle");
        } else {
          d += S.text(x0 + 74, 56, "one vector", "d-t-x", "middle");
          d += fCell(x0 + 8, 64, 132, 20, "req");
          [41, 74, 107].forEach(function (x) { d += fLine(x0 + x, 64, x0 + x, 84); });
          ["12", "7", "201", "33"].forEach(function (c, n) {
            var cx = x0 + 24.5 + n * 33;
            d += fArr(cx, 86, cx, 117) + fCell(cx - 14, 120, 28, 22, "math") + S.text(cx, 135, c, "d-t", "middle");
          });
          d += S.text(x0 + 74, 162, "a short code per part", "d-t-x", "middle");
        }
        p[3].forEach(function (t, n) { d += S.text(x0 + 4, 198 + n * 16, t, "d-t-s"); });
        b += S.node(p[0], d);
      });
      b += S.node("choose", S.text(0, 276, "Under about a million vectors: flat or HNSW. Billions: IVF-PQ.", "d-t-b"));
      return S.frame(640, 288, b);
    }
  };

  DIA.llmLifecycle = {
    title: "From next-token predictor to assistant, and where your own changes plug in",
    cap: "<b>Three training stages make the model; inference is where it is used, and where most of your changes go.</b> Pretraining predicts the next token over raw text. Supervised fine-tuning on instruction and response pairs teaches format and following more than new knowledge. Preference tuning shapes quality and safety: RLHF trains a reward model on human rankings, then optimises the model with PPO and a KL penalty that keeps it near the SFT model; DPO skips both with a classification-style loss on preferred and rejected pairs. At inference, decoding picks each token. On the right, what you control: prompting and RAG change only what the model sees at call time, and LoRA trains small adapters on a frozen base. Knowledge goes in retrieval, behaviour goes in tuning, and prompting comes first.",
    svg: function () {
      var b = "";
      b += S.tag(0, 10, "How the model is made");
      b += S.box({ id: "pre", x: 0, y: 20, w: 220, h: 50, label: "pretraining", sub: "next token on raw text", tone: "math" });
      b += S.box({ id: "sft", x: 0, y: 110, w: 220, h: 50, label: "supervised fine-tuning", sub: "instruction, response pairs", tone: "sys" });
      b += S.box({ id: "pref", x: 0, y: 200, w: 220, h: 50, label: "preference tuning", sub: "preferred vs rejected answers", tone: "sys" });
      b += S.box({ id: "inf", x: 0, y: 310, w: 220, h: 50, label: "inference", sub: "one token at a time", tone: "now" });
      b += S.box({ id: "decoding", x: 0, y: 400, w: 220, h: 50, label: "decoding", sub: "greedy, temperature, top-k, top-p", tone: "flat" });
      b += S.arrow(110, 72, 110, 108, {});
      b += S.arrow(110, 162, 110, 198, {});
      b += S.arrow(110, 252, 110, 308, {});
      b += S.arrow(110, 362, 110, 398, {});
      b += S.box({ id: "rlhf", x: 260, y: 180, w: 190, h: 44, label: "RLHF", sub: "reward model, then PPO", tone: "iv" });
      b += S.box({ id: "dpo", x: 260, y: 236, w: 190, h: 44, label: "DPO", sub: "no reward model, no RL", tone: "iv" });
      b += S.arrow(222, 215, 258, 202, {});
      b += S.arrow(222, 235, 258, 256, {});
      b += S.text(236, 230, "or", "d-t-x", "middle");
      b += S.tag(490, 102, "What you change");
      b += S.box({ id: "lora", x: 490, y: 110, w: 150, h: 50, label: "LoRA", sub: "base frozen, adapters", tone: "alaap", dash: true });
      b += S.box({ id: "prompting", x: 490, y: 290, w: 150, h: 40, label: "prompting", sub: "first resort", tone: "alaap", dash: true });
      b += S.box({ id: "rag", x: 490, y: 340, w: 150, h: 40, label: "RAG", sub: "fresh, citable facts", tone: "alaap", dash: true });
      b += S.arrow(488, 135, 222, 135, { label: "tunes behaviour" });
      b += S.arrow(488, 310, 222, 325, { label: "no weights change" });
      b += S.arrow(488, 360, 222, 345, { label: "context at call time" });
      return S.frame(640, 460, b);
    }
  };

  DIA.vaTurn = {
    title: "One user turn through an enterprise virtual assistant",
    cap: "<b>A fast classifier decides most turns; the LLM and the human are for the turns it is unsure of.</b> The turn arrives by chat, or by voice through speech recognition. The NLU classifier returns an intent and a confidence, and the confidence falls in one of three bands: high, act; middle, ask \"did you mean X?\"; low, send the turn to an LLM fallback, which either resolves it or hands off to a human. Entities are extracted and then validated in code (an account number is checked, not guessed). Dialogue state holds the slots, the authentication and the current step; fulfilment calls the backend API, or retrieval for an FAQ. Every stage logs what it saw and decided, which is the raw material for error analysis.",
    svg: function () {
      var b = "";
      b += S.box({ id: "user", x: 0, y: 20, w: 140, h: 48, label: "user", tone: "req", icon: "user" });
      b += S.box({ id: "channel", x: 166, y: 20, w: 140, h: 48, label: "channel", sub: "chat, or voice + ASR", tone: "flat" });
      b += S.box({ id: "nlu", x: 332, y: 20, w: 140, h: 48, label: "NLU classifier", sub: "intent + confidence", tone: "sys" });
      b += S.box({ id: "llm", x: 500, y: 20, w: 140, h: 48, label: "LLM fallback", sub: "uncertain turns", tone: "iv", icon: "bot" });
      b += S.box({ id: "response", x: 0, y: 130, w: 140, h: 48, label: "response", sub: "text, or speech", tone: "now" });
      b += S.box({ id: "state", x: 166, y: 130, w: 140, h: 48, label: "dialogue state", sub: "slots, auth, step", tone: "math" });
      b += S.box({ id: "entities", x: 332, y: 130, w: 140, h: 48, label: "entities", sub: "validated in code", tone: "math" });
      b += S.box({ id: "handoff", x: 500, y: 130, w: 140, h: 48, label: "human handoff", sub: "summary, IDs, intent", tone: "alaap" });
      b += S.box({ id: "fulfilment", x: 166, y: 240, w: 140, h: 48, label: "fulfilment", sub: "API, or RAG for FAQ", tone: "sys" });
      b += S.box({ id: "log", x: 0, y: 320, w: 640, h: 40, label: "log every turn", sub: "text, intent, confidence, band, entities, outcome", tone: "flat", dash: true });
      b += S.arrow(140, 44, 164, 44, {});
      b += S.arrow(306, 44, 330, 44, {});
      b += S.arrow(472, 44, 498, 44, { label: "low" });
      b += S.arrow(402, 70, 402, 128, {});
      b += S.text(408, 102, "high: act", "d-t-s");
      b += S.arrow(340, 70, 120, 70, { curve: -44 });
      b += S.text(230, 110, "middle: did you mean X?", "d-t-s", "middle");
      b += S.arrow(520, 70, 474, 128, {});
      b += S.text(506, 114, "resolved", "d-t-s");
      b += S.arrow(570, 70, 570, 128, {});
      b += S.text(576, 102, "unsure", "d-t-s");
      b += S.arrow(330, 154, 308, 154, {});
      b += S.arrow(236, 180, 236, 238, {});
      b += S.arrow(166, 262, 110, 180, {});
      b += S.arrow(50, 128, 50, 70, {});
      b += S.text(56, 102, "reply", "d-t-s");
      b += S.arrow(236, 290, 236, 318, { dash: true });
      return S.frame(640, 370, b);
    }
  };

  DIA.thresholdBands = {
    title: "Three confidence bands: act, confirm, fall back",
    cap: "<b>One threshold forces a choice between acting wrongly and refusing too often; two thresholds make a middle band where the assistant asks.</b> The bands here are Cognigy's defaults: act above 0.4, confirm between 0.2 and 0.4, fall back below 0.2. Set your own from evaluation data, per intent family: a high-risk intent gets a higher bar and an explicit confirmation. The top score alone is not enough: when the top two are close (0.75 against 0.72 in the Lex docs) the request is ambiguous, so ask which. Thresholds only mean something if the scores are calibrated, so fit temperature scaling on validation data, and re-tune after every model change, because scores shift.",
    svg: function () {
      var b = "";
      function X(v) { return 40 + 560 * v; }
      b += S.tag(0, 12, "Top intent's confidence, Cognigy's default bands");
      b += S.node("fallback", S.bar({ x: X(0), y: 24, w: X(0.2) - X(0), h: 34, tone: "alaap" }) + S.text(96, 46, "fall back", "d-t-b", "middle") +
        S.text(96, 102, "None, a rephrase,", "d-t-s", "middle") + S.text(96, 118, "or the LLM", "d-t-s", "middle"));
      b += S.node("confirm", S.bar({ x: X(0.2), y: 24, w: X(0.4) - X(0.2), h: 34, tone: "req" }) + S.text(208, 46, "confirm", "d-t-b", "middle") +
        S.text(208, 102, "did you mean X?", "d-t-s", "middle") + S.text(208, 118, "or which of two?", "d-t-s", "middle"));
      b += S.node("act", S.bar({ x: X(0.4), y: 24, w: X(1) - X(0.4), h: 34, tone: "math" }) + S.text(400, 46, "act", "d-t-b", "middle") +
        S.text(400, 102, "run the intent and fill its slots", "d-t-s", "middle"));
      b += fLine(X(0), 66, X(1), 66, "d-line");
      [[0, "0"], [0.2, "0.2"], [0.4, "0.4"], [1, "1"]].forEach(function (t) { b += S.text(X(t[0]), 82, t[1], "d-t-x", "middle"); });
      b += S.node("perintent", '<line x1="' + X(0.8) + '" y1="18" x2="' + X(0.8) + '" y2="64" class="d-str-now" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        S.text(X(0.8) + 6, 12, "high-risk intent: a higher bar", "d-t-x"));
      b += S.text(0, 152, "Top-two margin", "d-t-b");
      function M(v) { return 220 + 380 * v; }
      b += S.node("close", S.text(0, 180, "0.75 against 0.72: too close", "d-t-s") + fLine(M(0), 176, M(1), 176) +
        fDot(M(0.72), 176, "req", 4.5) + fDot(M(0.75), 176, "req", 4.5) + S.text(M(0.735), 194, "ask which one", "d-t-x", "middle"));
      b += S.node("clear", S.text(0, 220, "0.95 against 0.65: clear", "d-t-s") + fLine(M(0), 216, M(1), 216) +
        fDot(M(0.65), 216, "flat", 4.5) + fDot(M(0.95), 216, "math", 4.5) + S.text(M(0.8), 234, "act on the top one", "d-t-x", "middle"));
      b += S.box({ id: "calibration", x: 0, y: 252, w: 640, h: 44, label: "calibrate, then set per intent", sub: "temperature scaling on validation data; scores shift with every model change", tone: "flat" });
      return S.frame(640, 304, b);
    }
  };

  DIA.repairLadder = {
    title: "Repair: escalate help on each miss, and confirm in proportion to risk",
    cap: "<b>Each failed turn should get more help, never the same prompt again.</b> On a no-match or a no-input, counted per state, the first reprompt is a short rephrase with a brief apology, not a verbatim repeat; the second offers options or examples; after about two failed attempts the assistant exits with a way out, a human or another channel, never a dead end. An explicit request for a human skips the ladder. On the right, confirmation: implicit (\"So, a table for two\") is the default because it keeps the flow; explicit yes or no is for when the cost of being wrong times the chance of being wrong is high: payments, deletions, names, or a low recognition score.",
    svg: function () {
      var b = "";
      b += S.box({ id: "event", x: 0, y: 10, w: 300, h: 44, label: "no-match or no-input", sub: "counted per state", tone: "flat" });
      b += S.box({ id: "a1", x: 0, y: 84, w: 300, h: 44, label: "1. rephrase", sub: "short, with a brief apology", tone: "req" });
      b += S.box({ id: "a2", x: 0, y: 158, w: 300, h: 44, label: "2. offer options", sub: "choices or examples", tone: "req" });
      b += S.box({ id: "exit", x: 0, y: 232, w: 300, h: 44, label: "3. exit with a way out", sub: "a human, or another channel; never a dead end", tone: "alaap" });
      b += S.arrow(150, 56, 150, 82, {});
      b += S.arrow(150, 130, 150, 156, {});
      b += S.arrow(150, 204, 150, 230, {});
      b += S.text(158, 73, "first miss", "d-t-x");
      b += S.text(158, 147, "still no match", "d-t-x");
      b += S.text(158, 221, "about two failed tries", "d-t-x");
      b += S.text(340, 14, "Confirm by cost x chance of being wrong", "d-t-b");
      b += S.text(374, 69, "high cost", "d-t-x", "end");
      b += S.text(374, 145, "low cost", "d-t-x", "end");
      b += S.box({ id: "explicit-cost", x: 380, y: 30, w: 125, h: 70, label: "explicit", sub: "payments, deletions", tone: "req" });
      b += S.box({ id: "explicit-both", x: 511, y: 30, w: 125, h: 70, label: "explicit", sub: "read back, or DTMF", tone: "alaap" });
      b += S.box({ id: "implicit", x: 380, y: 106, w: 125, h: 70, label: "implicit", sub: "\"a table for two\"", tone: "math" });
      b += S.box({ id: "explicit-unsure", x: 511, y: 106, w: 125, h: 70, label: "explicit", sub: "low confidence", tone: "req" });
      b += S.text(442, 192, "low chance", "d-t-x", "middle");
      b += S.text(573, 192, "high chance", "d-t-x", "middle");
      b += S.text(380, 214, "over-confirming costs turns", "d-t-x");
      return S.frame(640, 286, b);
    }
  };

  DIA.intentTaxonomy = {
    title: "An intent taxonomy for a bank: actions are intents, objects are entities",
    cap: "<b>An intent should map to a distinct next action; the things the action needs are entities.</b> Route by domain first (accounts, cards, payments, fraud) so each classifier has a manageable label space, with fraud and \"I want a human\" as priority routes. Under each domain sit the intents; the entities (account type, amount, date, account number) are shared across them and fill the slots. Two more branches: knowledge, where retrieval over FAQ content replaces dozens of FAQ intents, and None, trained with near misses, greetings and bare numbers so out-of-scope turns have somewhere to go. The test for a split: same flow and same API call means merge and use an entity; same words needing different handling means split.",
    svg: function () {
      var b = "";
      b += S.tag(0, 30, "Domains first, then intents");
      b += S.box({ id: "root", x: 220, y: 0, w: 200, h: 40, label: "bank assistant", sub: "route by domain first", tone: "now" });
      var D = [["accounts", "accounts", null, "sys", "check balance", "open account"], ["cards", "cards", null, "sys", "report lost card", "card declined"],
        ["payments", "payments", null, "sys", "transfer money", "dispute a charge"], ["fraud", "fraud", null, "sys", "report fraud", "to a human, fast"],
        ["knowledge", "knowledge", "RAG over FAQ", "math", "FAQ answers", "grounded, cited"], ["none", "None", "out of scope", "alaap", "near misses", "bare numbers"]];
      var starts = [250, 285, 310, 330, 355, 390];
      D.forEach(function (d, i) {
        var x = [0, 109, 218, 326, 435, 544][i], c = x + 48;
        b += S.box({ id: d[0], x: x, y: 80, w: 96, h: 40, label: d[1], sub: d[2] || undefined, tone: d[3] });
        b += S.arrow(starts[i], 42, c, 78, {});
        b += S.node(d[0], S.text(c, 140, d[4], "d-t-s", "middle") + S.text(c, 156, d[5], "d-t-s", "middle"));
      });
      b += S.tag(0, 194, "Entities, shared across intents");
      b += S.box({ id: "accounttype", x: 0, y: 202, w: 150, h: 40, label: "account type", sub: "list + synonyms", tone: "req" });
      b += S.box({ id: "amount", x: 163, y: 202, w: 150, h: 40, label: "amount", sub: "prebuilt number", tone: "req" });
      b += S.box({ id: "date", x: 326, y: 202, w: 150, h: 40, label: "date", sub: "prebuilt date", tone: "req" });
      b += S.box({ id: "accountno", x: 490, y: 202, w: 150, h: 40, label: "account number", sub: "regex, then validate", tone: "req" });
      b += S.arrow(266, 162, 238, 200, { dash: true, id: "payments>amount" });
      b += S.arrow(280, 162, 380, 200, { dash: true, id: "payments>date" });
      b += S.text(326, 172, "slots", "d-t-x");
      b += S.node("rules", S.text(0, 268, "Cancel is one intent and the product an entity: no \"Cancel Contoso\" intent.", "d-t-s") +
        S.text(0, 284, "Same flow and API call: merge. Same words, different handling: split.", "d-t-s"));
      return S.frame(640, 294, b);
    }
  };

  DIA.confusionMatrix = {
    title: "An intent confusion matrix: the diagonal is right, the hot cells are the work",
    cap: "<b>Per-intent metrics come from one table.</b> Rows are the true intent, columns the predicted one, and the counts here are illustrative. The diagonal is what the model got right. Read along a row: the diagonal over the row sum is recall, of the turns that really were that intent, how many it found. Read down a column: the diagonal over the column sum is precision, of the turns it predicted as that intent, how many were right. Two hot cells: lost card read as card declined, and dispute read as transfer. Read the actual utterances, then fix: merge if they are one action with different entities, add contrastive examples if the wording is ambiguous, or disambiguate with a question when the top two scores are close. Re-run the frozen test set so the error does not move to a neighbour.",
    svg: function () {
      var b = "";
      var L = ["balance", "lost card", "declined", "transfer", "dispute"];
      var C = [[47, 0, 1, 2, 0], [0, 38, 9, 0, 3], [1, 2, 46, 0, 1], [2, 0, 0, 44, 4], [0, 1, 1, 7, 41]];
      var hot = { "1,2": "hot1", "4,3": "hot2" };
      var diag = "", rest = "", i, j;
      function cx(j) { return 112 + j * 56; }
      function cy(i) { return 40 + i * 32; }
      b += S.text(252, 14, "predicted", "d-t-x", "middle");
      b += S.text(0, 32, "true intent", "d-t-x");
      L.forEach(function (l, k) {
        b += S.text(cx(k) + 27, 32, l, "d-t-s", "middle");
        b += S.text(106, cy(k) + 20, l, "d-t-s", "end");
      });
      for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
          var cell, n = String(C[i][j]);
          if (i === j) {
            diag += fCell(cx(j), cy(i), 54, 30, "math") + S.text(cx(j) + 27, cy(i) + 20, n, "d-t-b", "middle");
          } else if (hot[i + "," + j]) {
            cell = fCell(cx(j), cy(i), 54, 30, "alaap") + S.text(cx(j) + 27, cy(i) + 20, n, "d-t-b", "middle");
            b += S.node(hot[i + "," + j], cell);
          } else {
            rest += fCell(cx(j), cy(i), 54, 30, "flat") + S.text(cx(j) + 27, cy(i) + 20, n, "d-t-x", "middle");
          }
        }
      }
      b += rest + S.node("diagonal", diag);
      var rec = S.text(430, 32, "recall", "d-t-s", "middle"), prec = S.text(106, 222, "precision", "d-t-s", "end");
      for (i = 0; i < 5; i++) {
        var rs = 0, cs = 0;
        for (j = 0; j < 5; j++) { rs += C[i][j]; cs += C[j][i]; }
        rec += S.text(430, cy(i) + 20, Math.round(100 * C[i][i] / rs) + "%", "d-t-b", "middle");
        prec += S.text(cx(i) + 27, 222, Math.round(100 * C[i][i] / cs) + "%", "d-t-b", "middle");
      }
      b += S.node("recall", rec) + S.node("precision", prec);
      b += S.tag(480, 30, "Fix a hot cell");
      b += S.box({ id: "merge", x: 480, y: 40, w: 160, h: 44, label: "merge", sub: "one intent + an entity", tone: "sys" });
      b += S.box({ id: "examples", x: 480, y: 100, w: 160, h: 44, label: "add examples", sub: "contrastive pairs", tone: "sys" });
      b += S.box({ id: "disambiguate", x: 480, y: 160, w: 160, h: 44, label: "disambiguate", sub: "ask if top two close", tone: "sys" });
      b += S.text(0, 254, "Diagonal over its row sum is recall: of the true ones, how many found.", "d-t-s");
      b += S.text(0, 270, "Diagonal over its column sum is precision: of those predicted, how many right.", "d-t-s");
      return S.frame(640, 280, b);
    }
  };

  DIA.errorLoop = {
    title: "The production improvement loop: from logs back to logs",
    cap: "<b>Improvement is a loop run every week, not a project.</b> Sample transcripts by stratum (all escalations, abandoned sessions, low-confidence turns, negative feedback, and a random slice), not only at random. Label each failed conversation with one primary cause: ASR, NLU, entity, dialog, backend, content, policy or abandonment; the split says whether to fix training data, flows, integrations or content. Cluster the misses (embed, cluster, have an LLM name each cluster) into candidate intents, ranked by volume times cost. Every fix gets a regression test and a golden conversation, ships to a small traffic share first, and is watched on KPIs that tell the truth: containment beside resolution and repeat contact, plus fallback and escalation rates.",
    svg: function () {
      var b = "";
      b += S.box({ id: "logs", x: 0, y: 20, w: 140, h: 50, label: "transcripts, logs", sub: "every turn", tone: "req" });
      b += S.box({ id: "sample", x: 166, y: 20, w: 140, h: 50, label: "stratified sample", sub: "not only at random", tone: "sys" });
      b += S.box({ id: "label", x: 332, y: 20, w: 140, h: 50, label: "label the cause", sub: "one primary cause", tone: "sys" });
      b += S.box({ id: "cluster", x: 500, y: 20, w: 140, h: 50, label: "cluster misses", sub: "candidate intents", tone: "math" });
      b += S.arrow(140, 45, 164, 45, {});
      b += S.arrow(306, 45, 330, 45, {});
      b += S.arrow(472, 45, 498, 45, {});
      var tax = "";
      ["ASR", "NLU", "entity", "dialog", "backend", "content", "policy", "abandoned"].forEach(function (t, i) {
        var x = 162 + (i % 4) * 80, y = 104 + Math.floor(i / 4) * 26;
        tax += S.bar({ x: x, y: y, w: 74, h: 20, tone: "alaap" }) + S.text(x + 37, y + 14, t, "d-t-s", "middle");
      });
      tax += S.text(162, 168, "one primary cause per failed conversation", "d-t-x");
      b += S.node("taxonomy", tax);
      b += S.arrow(402, 72, 402, 102, { id: "label>taxonomy" });
      b += S.box({ id: "fix", x: 487, y: 200, w: 153, h: 50, label: "fix", sub: "data, flow, API, content", tone: "now" });
      b += S.box({ id: "tests", x: 318, y: 200, w: 145, h: 50, label: "regression tests", sub: "golden conversations", tone: "math" });
      b += S.box({ id: "canary", x: 164, y: 200, w: 130, h: 50, label: "canary, A/B", sub: "small traffic share", tone: "sys" });
      b += S.box({ id: "monitor", x: 0, y: 200, w: 140, h: 50, label: "monitor KPIs", sub: "fallback, escalation", tone: "now" });
      b += S.arrow(570, 72, 570, 198, {});
      b += S.arrow(485, 225, 465, 225, {});
      b += S.arrow(316, 225, 296, 225, {});
      b += S.arrow(162, 225, 142, 225, {});
      b += S.arrow(70, 198, 70, 72, {});
      b += S.text(78, 140, "back to logs", "d-t-s");
      b += S.node("kpis", S.text(0, 276, "Containment alone can hide a wall: pair it with resolution and repeat contact.", "d-t-s"));
      return S.frame(640, 288, b);
    }
  };

  return { S: S, DIA: DIA, slug: slug };
})();
