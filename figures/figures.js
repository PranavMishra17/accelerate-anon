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

  /* ZenML round 3: your bench, the backend questions, and Kitaru's replay. */
  DIA.benchLoop = {
    title: "The bench: production failures become regression cases",
    cap: "<b>Every case starts as a real failure.</b> The scanner's cheap signals over-fire, so a judge calibrated on hand labels keeps the real ones; a fix is promoted into the bench without duplicates; the real agent replays each case against its snapshot and is scored on tool calls per completed task and assertions against the snapshot.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 20, w: 120, h: 44, label: "Production", sub: "real conversations", tone: "flat", icon: "message-square" });
      b += S.arrow(122, 42, 156, 42, {});
      b += S.box({ x: 160, y: 20, w: 130, h: 44, label: "Scanner", sub: "12 failure signals", tone: "req", icon: "filter" });
      b += S.arrow(292, 42, 326, 42, {});
      b += S.box({ x: 330, y: 20, w: 130, h: 44, label: "LLM judge", sub: "about 3 in 4 real", tone: "req", icon: "brain" });
      b += S.arrow(462, 42, 496, 42, {});
      b += S.box({ x: 500, y: 20, w: 140, h: 44, label: "Fix, then promote", sub: "reconciler dedupes", tone: "sys", icon: "merge" });
      b += S.arrow(570, 66, 570, 124, {});
      b += S.box({ x: 500, y: 128, w: 140, h: 44, label: "Bench", sub: "100+ cases", tone: "math", icon: "list-checks" });
      b += S.arrow(498, 150, 464, 150, {});
      b += S.box({ x: 330, y: 128, w: 130, h: 44, label: "Replay", sub: "real agent, snapshot", tone: "sys", icon: "repeat" });
      b += S.arrow(328, 150, 294, 150, {});
      b += S.box({ x: 160, y: 128, w: 130, h: 44, label: "Score", sub: "tool calls per task", tone: "math", icon: "gauge" });
      b += S.arrow(158, 150, 124, 150, {});
      b += S.box({ x: 0, y: 128, w: 120, h: 44, label: "Sign-off", sub: "the rewrite shipped", tone: "now", icon: "check" });
      return S.frame(640, 182, b);
    }
  };

  DIA.harnessSeam = {
    title: "Swap the provider, not the tool",
    cap: "<b>The tool body runs for real.</b> Ranking, filtering and shaping are production code in every replay. Only the call across the provider boundary is routed, by a harness flag, to the case's SQLite snapshot, which answers in the provider's shape. Most bugs lived in the seam between tool output and the model, so that seam stays real.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 78, w: 100, h: 44, label: "Agent", tone: "flat", icon: "bot" });
      b += S.arrow(102, 100, 136, 100, {});
      b += S.box({ x: 140, y: 78, w: 180, h: 44, label: "Tool body, runs for real", sub: "ranking, filtering, shaping", tone: "sys", icon: "cpu" });
      b += S.arrow(322, 100, 356, 100, {});
      b += S.box({ x: 360, y: 78, w: 130, h: 44, label: "Provider boundary", tone: "req" });
      b += S.arrow(492, 92, 514, 42, { dash: true });
      b += S.arrow(492, 108, 514, 158, {});
      b += S.box({ x: 500, y: 20, w: 140, h: 44, label: "Gmail, calendar", sub: "production only", tone: "flat", dash: true });
      b += S.box({ x: 500, y: 136, w: 140, h: 44, label: "SQLite snapshot", sub: "harness flag on", tone: "math" });
      return S.frame(640, 190, b);
    }
  };

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

  DIA.completeness = {
    title: "Assert against ground truth you hold",
    cap: "<b>The snapshot knows the answer's size.</b> Because you own the fixture, you know how many financial events fall in the window, so the case can assert that every one appears. A pinned expected answer only checks shape; this caught the ledger that looked right and left out two refunds. It works only when the answer is enumerable from the fixture.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 20, w: 200, h: 44, label: "Snapshot", sub: "N financial events in the window", tone: "math", icon: "database" });
      b += S.box({ x: 0, y: 116, w: 200, h: 44, label: "Agent's ledger", sub: "clean, well formed, N − 2 events", tone: "sys", icon: "list" });
      b += S.arrow(202, 42, 256, 82, {});
      b += S.arrow(202, 138, 256, 98, {});
      b += S.box({ x: 260, y: 68, w: 180, h: 44, label: "Assert every event appears", tone: "req", icon: "list-checks" });
      b += S.arrow(442, 90, 476, 90, {});
      b += S.box({ x: 480, y: 68, w: 160, h: 44, label: "Fails", sub: "two refunds missing", tone: "alaap", icon: "x" });
      return S.frame(640, 170, b);
    }
  };

  DIA.sqliteTemplate = {
    title: "One snapshot per case: a SQLite file or a template database",
    cap: "<b>Both give each case its own copy; only one is the production engine.</b> A SQLite file is trivial to copy and inspect, but it tests agent behaviour, not database behaviour: no row-level security, different type affinity. CREATE DATABASE ... TEMPLATE clones a Postgres database per case on the real engine, at the cost of a server in the test path.",
    svg: function () {
      var b = "";
      b += S.text(0, 14, "What you built", "d-t-x");
      b += S.box({ x: 0, y: 22, w: 150, h: 44, label: "Base snapshot", tone: "flat", icon: "database" });
      b += S.arrow(152, 44, 296, 44, { label: "copy the file" });
      b += S.box({ x: 300, y: 22, w: 140, h: 44, label: "case.sqlite", sub: "fast, no server", tone: "math", icon: "hard-drive" });
      b += S.arrow(442, 44, 466, 44, {});
      b += S.box({ x: 470, y: 22, w: 170, h: 44, label: "Not the real engine", sub: "no RLS, other type rules", tone: "alaap", icon: "triangle-alert" });
      b += S.text(0, 116, "What you would build today", "d-t-x");
      b += S.box({ x: 0, y: 124, w: 150, h: 44, label: "Template database", tone: "flat", icon: "database" });
      b += S.arrow(152, 146, 296, 146, {});
      b += S.text(224, 136, "CREATE DATABASE", "d-t-s", "middle");
      b += S.text(224, 160, "... TEMPLATE", "d-t-s", "middle");
      b += S.box({ x: 300, y: 124, w: 140, h: 44, label: "case database", sub: "real Postgres", tone: "sys", icon: "database" });
      b += S.arrow(442, 146, 466, 146, {});
      b += S.box({ x: 470, y: 124, w: 170, h: 44, label: "Costs a server", sub: "in the test path", tone: "req", icon: "server" });
      return S.frame(640, 178, b);
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

      b += S.tag(0, 182, "Alfred harness — world-snapshot replay");
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

  /* ---- alfred_, the system you own, for the ZenML loop (drawn from the guide's alfred_ design) ---- */

  DIA.alfredHld = {
    title: "alfred_: three doors, one brain, one tool package",
    cap: "<b>Two loops share one tool layer.</b> SMS, web and MCP converge on packages/tools; a background pipeline watches the mailbox, triages, and acts alone, but never sends. Everything lives in one Supabase project: Postgres with RLS, pg_cron and pgmq, and Deno edge functions. The eval scanner turns real failing turns into regression cases.",
    svg: function () {
      var b = "";
      b += S.box({ id: "sms", x: 0, y: 10, w: 200, h: 44, label: "SMS", sub: "conv-v6 ingress, jobs, turn", tone: "iv", icon: "message-square" });
      b += S.box({ id: "web", x: 0, y: 62, w: 200, h: 44, label: "Web + mobile", sub: "conv-v6-web, SSE", tone: "iv", icon: "layout-grid" });
      b += S.box({ id: "mcp", x: 0, y: 114, w: 200, h: 44, label: "Claude via MCP", sub: "mcp-exec, allowlisted", tone: "iv", icon: "bot" });
      b += S.box({ id: "tools", x: 250, y: 50, w: 160, h: 66, label: "packages/tools", sub: "one registry, wrappers", tone: "math", icon: "package" });
      b += S.box({ id: "models", x: 460, y: 10, w: 180, h: 44, label: "Models", sub: "cached prompt prefix", tone: "flat", icon: "brain" });
      b += S.box({ id: "prov", x: 460, y: 90, w: 180, h: 44, label: "Google, Microsoft", sub: "mail, calendar, Zoom", tone: "flat", icon: "cloud" });
      b += S.box({ id: "pg", x: 250, y: 160, w: 160, h: 46, label: "Postgres", sub: "RLS, pg_cron, pgmq", tone: "math", icon: "database" });
      b += S.box({ id: "eval", x: 0, y: 176, w: 200, h: 44, label: "Eval scanner", sub: "failing turns to cases", tone: "req", icon: "scan-text" });
      b += S.box({ id: "notify", x: 0, y: 256, w: 140, h: 44, label: "Notify + send", sub: "send after approval", tone: "iv", icon: "send" });
      b += S.box({ id: "act", x: 160, y: 256, w: 150, h: 44, label: "Executor", sub: "silent acts, drafts", tone: "sys" });
      b += S.box({ id: "triage", x: 330, y: 256, w: 140, h: 44, label: "donna-triage", sub: "rules, then model", tone: "sys" });
      b += S.box({ id: "ingest", x: 490, y: 256, w: 150, h: 44, label: "Ingestion", sub: "push and poll", tone: "sys", icon: "inbox" });
      b += S.arrow(202, 32, 248, 62, {});
      b += S.arrow(202, 84, 248, 84, {});
      b += S.arrow(202, 136, 248, 106, {});
      b += S.arrow(412, 62, 458, 36, { label: "loop" });
      b += S.arrow(412, 98, 458, 110, {});
      b += S.arrow(330, 118, 330, 158, { label: "traces, effects" });
      b += S.arrow(248, 186, 202, 196, {});
      b += S.arrow(560, 136, 560, 254, { label: "push, pull" });
      b += S.arrow(488, 278, 472, 278, {});
      b += S.arrow(328, 278, 312, 278, {});
      b += S.arrow(158, 278, 142, 278, {});
      b += S.arrow(390, 254, 380, 208, {});
      return S.frame(640, 310, b);
    }
  };

  DIA.alfredTurn = {
    title: "alfred_: one chat turn, in layer order",
    cap: "<b>Acknowledge fast, then lease, trace, prompt, loop, guard, reply.</b> The SMS webhook gets a 200 at once and becomes a job row; the turn takes a lease on the conversation so two isolates cannot both answer, builds a four-block cached prompt, and runs a LangGraph agent graph of at most 12 steps on SMS (50 on web). Every tool call goes through the compose() wrappers and writes the effects ledger. A cheaper v7 first pass, still in rollout, hands the job to this turn when it can't answer. The web surface skips ingress and jobs; MCP skips the graph.",
    svg: function () {
      var b = "";
      b += S.box({ id: "linq", x: 0, y: 20, w: 110, h: 44, label: "Linq SMS", sub: "signed webhook", tone: "iv" });
      b += S.box({ id: "ingress", x: 130, y: 20, w: 120, h: 44, label: "Ingress", sub: "HMAC, dedupe", tone: "sys" });
      b += S.box({ id: "job", x: 270, y: 20, w: 120, h: 44, label: "Job row", sub: "SKIP LOCKED", tone: "sys", icon: "list" });
      b += S.box({ id: "turn", x: 410, y: 20, w: 120, h: 44, label: "Turn", sub: "lease, trace", tone: "sys", icon: "lock" });
      b += S.box({ id: "prompt", x: 550, y: 20, w: 90, h: 44, label: "Prompt", sub: "4 blocks", tone: "flat" });
      b += S.box({ id: "loop", x: 520, y: 120, w: 120, h: 44, label: "Agent graph", sub: "LangGraph, 12 steps", tone: "sys" });
      b += S.box({ id: "wrappers", x: 350, y: 120, w: 150, h: 44, label: "compose()", sub: "gate, preview, replay", tone: "math" });
      b += S.box({ id: "tools", x: 180, y: 120, w: 150, h: 44, label: "packages/tools", sub: "ToolDef registry", tone: "flat" });
      b += S.box({ id: "effects", x: 0, y: 120, w: 160, h: 44, label: "Effects ledger", sub: "turn_effects", tone: "math", icon: "database" });
      b += S.box({ id: "guards", x: 520, y: 220, w: 120, h: 44, label: "Turn guards", sub: "fabrication", tone: "req", icon: "shield" });
      b += S.box({ id: "outbound", x: 350, y: 220, w: 150, h: 44, label: "Outbound", sub: "tone filter", tone: "sys" });
      b += S.box({ id: "reply", x: 180, y: 220, w: 150, h: 44, label: "Reply", sub: "back through Linq", tone: "iv", icon: "send" });
      b += S.arrow(111, 42, 128, 42, {});
      b += S.arrow(251, 42, 268, 42, {});
      b += S.arrow(391, 42, 408, 42, {});
      b += S.arrow(531, 42, 548, 42, {});
      b += S.arrow(595, 66, 595, 118, {});
      b += S.arrow(518, 142, 502, 142, {});
      b += S.arrow(348, 142, 332, 142, {});
      b += S.arrow(178, 142, 162, 142, {});
      b += S.arrow(580, 166, 580, 218, { label: "before reply" });
      b += S.arrow(518, 242, 502, 242, {});
      b += S.arrow(348, 242, 332, 242, {});
      b += S.text(0, 30 + 262, "200 goes back to the webhook before any work; the job row carries the turn.", "d-t-s");
      return S.frame(640, 302, b);
    }
  };

  DIA.alfredWrap = {
    title: "alfred_: what one tool call passes through",
    cap: "<b>No surface calls execute(); every call goes through one wrapper stack.</b> The model's tool_use is validated, gated by the tool's declared capability, previewed and confirmed by the user if it writes, replayed from its idempotency key if it is a retry, then executed with a timeout and logged with its effects. Kitaru's adapter hook sits at the same seam, answering from a recording instead of executing.",
    svg: function () {
      var b = "";
      b += S.box({ id: "model", x: 0, y: 20, w: 100, h: 44, label: "Model", sub: "tool_use", tone: "flat", icon: "brain" });
      b += S.box({ id: "schema", x: 120, y: 20, w: 100, h: 44, label: "Schema", sub: "zod", tone: "math" });
      b += S.box({ id: "gate", x: 240, y: 20, w: 120, h: 44, label: "Capability", sub: "read, write, bulk", tone: "math" });
      b += S.box({ id: "preview", x: 380, y: 20, w: 120, h: 44, label: "Preview", sub: "confirm first", tone: "math" });
      b += S.box({ id: "idem", x: 520, y: 20, w: 120, h: 44, label: "Idempotency", sub: "replay on retry", tone: "math" });
      b += S.box({ id: "user", x: 380, y: 124, w: 120, h: 44, label: "User", sub: "confirms", tone: "iv", icon: "user" });
      b += S.box({ id: "execute", x: 520, y: 124, w: 120, h: 44, label: "Execute", sub: "with timeout", tone: "sys", icon: "zap" });
      b += S.box({ id: "log", x: 520, y: 220, w: 120, h: 44, label: "Log + effects", sub: "v6_tool_executions", tone: "math" });
      b += S.box({ id: "kitaru", x: 0, y: 214, w: 440, h: 50, label: "Kitaru's adapter hook sits at this seam", sub: "it answers from the recorded log instead of executing", tone: "iv", dash: true, icon: "history" });
      b += S.arrow(101, 42, 118, 42, {});
      b += S.arrow(221, 42, 238, 42, {});
      b += S.arrow(361, 42, 378, 42, {});
      b += S.arrow(501, 42, 518, 42, {});
      b += S.arrow(425, 66, 425, 122, {});
      b += S.arrow(460, 122, 460, 66, {});
      b += S.text(418, 98, "preview", "d-t-s", "end");
      b += S.text(467, 98, "confirmed", "d-t-s");
      b += S.arrow(580, 66, 580, 122, {});
      b += S.arrow(580, 170, 580, 218, {});
      b += S.arrow(442, 226, 518, 158, { dash: true });
      return S.frame(640, 276, b);
    }
  };

  DIA.alfredPipe = {
    title: "alfred_: the pipeline acts on mail, and never sends",
    cap: "<b>Nine steps, two model calls, and no send path in the executor.</b> Mail lands in staging through a queue or the poller; deterministic rules fire before triage; triage writes one pending action per email with a category and an autonomy level. Silent actions are archive, label and move. Only one function sends, after the user approves, and a reconciler checks every effect against the provider.",
    svg: function () {
      var b = "";
      b += S.box({ id: "provider", x: 0, y: 20, w: 130, h: 44, label: "Gmail, Outlook", sub: "IMAP too", tone: "flat", icon: "mail" });
      b += S.box({ id: "staging", x: 160, y: 20, w: 140, h: 44, label: "Staging", sub: "idempotent upsert", tone: "math", icon: "inbox" });
      b += S.box({ id: "rules", x: 330, y: 20, w: 130, h: 44, label: "Email rules", sub: "fire first", tone: "req", icon: "filter" });
      b += S.box({ id: "triage", x: 490, y: 20, w: 150, h: 44, label: "donna-triage", sub: "category, autonomy", tone: "sys", icon: "brain" });
      b += S.box({ id: "pending", x: 450, y: 110, w: 190, h: 44, label: "Pending actions", sub: "one row per email", tone: "math", icon: "database" });
      b += S.box({ id: "exec", x: 250, y: 110, w: 170, h: 44, label: "Executor", sub: "archive, label, move", tone: "sys" });
      b += S.box({ id: "drafter", x: 250, y: 190, w: 170, h: 44, label: "donna-worker", sub: "writes the draft", tone: "sys", icon: "brain" });
      b += S.box({ id: "user", x: 0, y: 190, w: 190, h: 44, label: "User approves", sub: "SMS, app, email", tone: "iv", icon: "user" });
      b += S.box({ id: "send", x: 0, y: 270, w: 190, h: 44, label: "Send approved draft", sub: "the only send path", tone: "req", icon: "send" });
      b += S.box({ id: "reconcile", x: 450, y: 190, w: 190, h: 44, label: "Reconciler", sub: "verify, or reverse", tone: "req", icon: "undo-2" });
      b += S.arrow(132, 42, 158, 42, {});
      b += S.arrow(302, 42, 328, 42, {});
      b += S.arrow(462, 42, 488, 42, {});
      b += S.arrow(565, 66, 565, 108, {});
      b += S.arrow(448, 124, 422, 124, {});
      b += S.arrow(460, 156, 422, 200, {});
      b += S.arrow(248, 212, 192, 212, { label: "draft" });
      b += S.arrow(95, 236, 95, 268, {});
      b += S.arrow(250, 126, 70, 66, { dash: true, label: "write back" });
      b += S.arrow(545, 188, 545, 156, {});
      return S.frame(640, 326, b);
    }
  };

  DIA.alfredVsKitaru = {
    title: "What alfred_ records, and where Kitaru keeps the same thing",
    cap: "<b>The two systems keep the same records for different jobs.</b> alfred_'s turn traces and tool executions are what Kitaru's sessions and nodes would import. The idempotency key and the cache key are both a hash of a call's arguments: one replays a retry, the other replays a recording. The effects ledger is what Kitaru lacks: a record of what actually changed, which would answer the provenance gap.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "alfred_ in production");
      b += S.tag(440, 14, "Kitaru at replay");
      var rows = [["a-trace", "v6_turn_traces", "one row per turn", "k-session", "Session", "one run, a tree", "a unit of work"],
                  ["a-exec", "v6_tool_executions", "latency, preview", "k-node", "tool_call node", "inputs, outputs", "one tool call"],
                  ["a-idem", "Idempotency key", "replays a retry", "k-key", "cache_key", "replays a recording", "a hash of the args"],
                  ["a-cap", "Capability", "read, write, bulk", "k-policy", "Tool policy", "default passthrough", "what a call may do"],
                  ["a-effects", "turn_effects", "what changed", "k-mocked", "mocked attribute", "absent on passthrough", "what happened"]];
      rows.forEach(function (r, i) {
        var y = 26 + i * 54;
        b += S.box({ id: r[0], x: 0, y: y, w: 200, h: 42, label: r[1], sub: r[2], tone: i === 4 ? "now" : "math" });
        b += S.box({ id: r[3], x: 440, y: y, w: 200, h: 42, label: r[4], sub: r[5], tone: i === 4 ? "alaap" : "iv" });
        b += S.arrow(202, y + 21, 438, y + 21, { label: r[6] });
      });
      return S.frame(640, 300, b);
    }
  };

  /* ---- the alfred_ bench's provider seam and the world it answers from (2026-09-27) ---- */

  DIA.benchAdapter = {
    title: "The swap: one provider interface, two implementations",
    cap: "<b>I don't emulate every provider. I emulate the contract the agent actually depends on.</b> The agent and the tool code are production code in every run. They call a provider interface, like GmailAdapter.search() or CalendarAdapter.createEvent(). In production that interface calls Gmail, Google Calendar, Outlook or Asana; with the harness flag on, the same interface is backed by an implementation that reads and writes the case's SQLite snapshot. The agent never knows which one it is talking to.",
    svg: function () {
      var b = "";
      b += S.box({ id: "agent", x: 0, y: 16, w: 150, h: 48, label: "alfred_ agent", sub: "the real loop", tone: "sys", icon: "bot" });
      b += S.box({ id: "tools", x: 180, y: 16, w: 190, h: 48, label: "Tool code", sub: "ranking, filtering: real", tone: "sys", icon: "code" });
      b += S.box({ id: "iface", x: 400, y: 10, w: 236, h: 60, label: "Provider interface", sub: "search, send, createEvent", tone: "math", icon: "layers" });
      b += S.arrow(152, 40, 178, 40, {});
      b += S.arrow(372, 40, 398, 40, {});
      b += S.box({ id: "flag", x: 0, y: 128, w: 200, h: 48, label: "Harness flag", sub: "picks the implementation", tone: "req", icon: "filter" });
      b += S.arrow(202, 140, 438, 72, { dash: true });
      b += S.box({ id: "prod", x: 240, y: 128, w: 190, h: 48, label: "Production adapters", sub: "Gmail, GCal, Outlook, Asana", tone: "flat" });
      b += S.box({ id: "harness", x: 450, y: 128, w: 186, h: 48, label: "Harness adapters", sub: "same interface, SQLite", tone: "math" });
      b += S.arrow(470, 72, 360, 126, {});
      b += S.arrow(575, 72, 560, 126, {});
      b += S.box({ id: "live", x: 240, y: 232, w: 190, h: 48, label: "Live providers", sub: "never reached in a run", tone: "alaap", icon: "cloud" });
      b += S.box({ id: "snapshot", x: 450, y: 232, w: 186, h: 48, label: "SQLite snapshot", sub: "one per task, reset per case", tone: "math", icon: "database" });
      b += S.arrow(335, 178, 335, 230, { dash: true });
      b += S.arrow(545, 178, 545, 230, {});
      b += S.text(553, 208, "reads and writes", "d-t-s");
      b += S.text(0, 222, "gmail.search()  -> query threads, messages", "d-t-s");
      b += S.text(0, 240, "gmail.send()  -> insert a message", "d-t-s");
      b += S.text(0, 258, "calendar.create()  -> insert an event", "d-t-s");
      b += S.text(0, 276, "asana.createTask()  -> insert a task", "d-t-s");
      return S.frame(640, 292, b);
    }
  };

  DIA.benchSchema = {
    title: "A small relational model of the user's world",
    cap: "<b>Model the subset of the provider's domain the evals need, not the provider's database.</b> People are one table, so the same person can appear as a sender, a recipient and an attendee, and three people called Michael stay three rows. Threads hold messages; participants and attendees are join tables; tasks point back at the message they came from. Two harness tables sit beside the world: the case's metadata (its world version and a pinned 'now') and a log of every call with how it was served. A model like this is what the harness adapters read and write.",
    svg: function () {
      var b = "";
      function tbl(id, x, y, title, cols, tone) {
        var w = 192, h = 26 + cols.length * 15 + 6, s = "";
        s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" class="d-fill-' + tone + ' d-str-' + tone + '" stroke-width="1.25"/>';
        s += S.text(x + 10, y + 17, title, "d-t-b");
        s += '<path d="M' + x + ',' + (y + 24) + ' L' + (x + w) + ',' + (y + 24) + '" class="d-str-' + tone + '" stroke-width="1"/>';
        cols.forEach(function (c, i) { s += S.text(x + 10, y + 39 + i * 15, c, "d-t-s"); });
        b += S.node(id, s);
        return { x: x, y: y, w: w, h: h };
      }
      tbl("contacts", 0, 0, "contacts", ["id, name, email, org", "three Michaels = three rows"], "sys");
      tbl("threads", 222, 0, "threads", ["id, subject", "labels, last_message_at"], "sys");
      tbl("events", 444, 0, "events", ["id, title, start, end", "organizer_id, location"], "sys");
      tbl("participants", 0, 100, "participants", ["message_id, contact_id", "role: from, to, cc"], "flat");
      tbl("messages", 222, 100, "messages", ["id, thread_id, sent_at", "snippet, body, is_read", "attachments (name, type)"], "sys");
      tbl("attendees", 444, 100, "attendees", ["event_id, contact_id", "response: yes, no, maybe"], "flat");
      tbl("case_meta", 0, 214, "case_meta  (harness)", ["case_id, world_version", "pinned_now, user_id"], "req");
      tbl("tasks", 222, 214, "tasks", ["id, title, due, status", "source_message_id"], "sys");
      tbl("call_log", 444, 214, "call_log  (harness)", ["turn, tool, args_hash", "served_by"], "req");
      b += S.arrow(194, 132, 220, 132, { id: "participants>messages" });
      b += S.arrow(98, 98, 98, 64, { id: "participants>contacts" });
      b += S.arrow(320, 98, 320, 64, { id: "messages>threads" });
      b += S.arrow(320, 212, 320, 179, { id: "tasks>messages" });
      b += S.arrow(542, 98, 542, 64, { id: "attendees>events" });
      b += S.text(0, 300, "search -> threads, messages  ·  send -> messages, participants", "d-t-s");
      b += S.text(0, 318, "createEvent -> events, attendees  ·  createTask -> tasks", "d-t-s");
      return S.frame(640, 330, b);
    }
  };

  DIA.alfredDeploy = {
    title: "alfred_: where everything runs",
    cap: "<b>Compute is Deno edge functions on Supabase plus a few long-running containers on Railway; state is one Postgres.</b> Every request surface lands on an edge function: SMS on conv-v6 (ingress, job worker, turn), the web app on conv-v6-web, Claude over MCP on mcp-exec. Work that outlives a request, like writing documents, scheduled routines and live phone calls, runs in Railway containers that claim jobs from the same Postgres. Postgres holds the jobs, traces and product data, runs the queues (pgmq and job rows) and the schedules (pg_cron).",
    svg: function () {
      var b = "";
      b += S.tag(0, 12, "Where requests come in");
      b += S.box({ id: "sms", x: 0, y: 20, w: 150, h: 46, label: "SMS", sub: "Linq webhook", tone: "iv", icon: "message-square" });
      b += S.box({ id: "web", x: 163, y: 20, w: 150, h: 46, label: "Web app", sub: "Next.js on Vercel", tone: "iv", icon: "layout-grid" });
      b += S.box({ id: "mcp", x: 326, y: 20, w: 150, h: 46, label: "Claude via MCP", sub: "/api/mcp on Vercel", tone: "iv", icon: "bot" });
      b += S.box({ id: "phone", x: 489, y: 20, w: 147, h: 46, label: "Phone calls", sub: "LiveKit, Cloudflare", tone: "iv", icon: "mic" });
      b += S.tag(0, 110, "Compute");
      b += S.box({ id: "edge", x: 0, y: 118, w: 400, h: 64, label: "Supabase edge functions (Deno)", sub: "conv-v6 ingress, job worker, turn; conv-v6-web; mcp-exec; email pipeline", tone: "sys", icon: "zap" });
      b += S.box({ id: "railway", x: 420, y: 118, w: 216, h: 64, label: "Railway containers", sub: "doc, routines, phone; EmailEngine", tone: "sys", icon: "server" });
      b += S.box({ id: "ext", x: 0, y: 234, w: 190, h: 64, label: "Models, providers", sub: "Anthropic, Gemini; Google", tone: "flat", icon: "cloud" });
      b += S.box({ id: "pg", x: 210, y: 234, w: 426, h: 64, label: "Supabase Postgres", sub: "jobs, traces, product data; pgmq queues; pg_cron; storage", tone: "math", icon: "database" });
      b += S.arrow(75, 68, 75, 116, {});
      b += S.arrow(238, 68, 238, 116, {});
      b += S.arrow(401, 68, 330, 116, {});
      b += S.arrow(562, 68, 562, 116, {});
      b += S.arrow(95, 184, 95, 232, {});
      b += S.text(103, 204, "model calls", "d-t-s");
      b += S.arrow(300, 184, 300, 232, {});
      b += S.text(308, 204, "read, write", "d-t-s");
      b += S.arrow(528, 184, 528, 232, {});
      b += S.text(536, 204, "claim jobs", "d-t-s");
      b += S.text(0, 322, "Where does the agent run? In a Deno edge function on Supabase. Long work: Railway. State: Postgres.", "d-t-s");
      return S.frame(640, 332, b);
    }
  };
  DIA.alfredMemory = {
    title: "alfred_: memory across conversations",
    cap: "<b>Three memories, three ways into a turn.</b> The conversation: the last 30 messages trimmed to 6,000 tokens go in as messages, and a rolling summary refreshed every 8 messages plus the three most related past chats go in the per-turn block. Facts: written by the agent's own tools and by a background job every 12 messages, up to 40 of them in the cached per-user block, and editable by the user. Working memory: loops (owed replies, awaited replies, obligations) built by scheduled reconcilers from email and calendar, fetched on demand by a lookup tool rather than put in every prompt.",
    svg: function () {
      var b = "";
      b += S.tag(0, 10, "Written by");
      b += S.tag(225, 10, "Stored as");
      b += S.tag(455, 10, "Reaches the turn as");
      b += S.box({ id: "conv", x: 0, y: 20, w: 190, h: 48, label: "This conversation", sub: "SMS or web messages", tone: "iv", icon: "message-square" });
      b += S.box({ id: "jobs", x: 0, y: 118, w: 190, h: 48, label: "Background jobs", sub: "every 8 and 12 messages", tone: "sys", icon: "repeat" });
      b += S.box({ id: "mail", x: 0, y: 240, w: 190, h: 48, label: "Email and calendar", sub: "cron reconcilers", tone: "sys", icon: "mail" });
      b += S.box({ id: "recent", x: 225, y: 20, w: 195, h: 48, label: "Recent messages", sub: "30, trimmed to 6k tokens", tone: "math" });
      b += S.box({ id: "summary", x: 225, y: 85, w: 195, h: 48, label: "Rolling summary", sub: "plus 3 related past chats", tone: "math" });
      b += S.box({ id: "facts", x: 225, y: 150, w: 195, h: 48, label: "Facts", sub: "user can read and edit", tone: "math", icon: "notebook-pen" });
      b += S.box({ id: "wm", x: 225, y: 240, w: 195, h: 48, label: "Working memory", sub: "owed, awaited, obligations", tone: "math", icon: "list-checks" });
      b += S.box({ id: "msgs", x: 455, y: 20, w: 185, h: 48, label: "Messages", sub: "the turn's transcript", tone: "flat" });
      b += S.box({ id: "b3", x: 455, y: 85, w: 185, h: 48, label: "Block 3, per turn", sub: "uncached", tone: "flat" });
      b += S.box({ id: "b2", x: 455, y: 150, w: 185, h: 48, label: "Block 2, per user", sub: "cached, up to 40 facts", tone: "flat" });
      b += S.box({ id: "tool", x: 455, y: 240, w: 185, h: 48, label: "Lookup tool", sub: "on demand, not in prompt", tone: "flat", icon: "search" });
      b += S.arrow(192, 44, 223, 44, {});
      b += S.arrow(192, 132, 223, 112, {});
      b += S.arrow(192, 152, 223, 170, {});
      b += S.arrow(192, 264, 223, 264, {});
      b += S.arrow(422, 44, 453, 44, {});
      b += S.arrow(422, 109, 453, 109, {});
      b += S.arrow(422, 174, 453, 174, {});
      b += S.arrow(422, 264, 453, 264, {});
      b += S.arrow(422, 252, 470, 135, { id: "wm>b3", dash: true });
      b += S.text(0, 312, "Dashed: open loops for people named in the message, dialled by a rollout setting.", "d-t-s");
      return S.frame(640, 322, b);
    }
  };

  return { S: S, DIA: DIA, slug: slug };
})();
