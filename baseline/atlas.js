/* Baseline, the field atlas. Each field is one data file in baseline/fields/ that calls
   BASELINE.field({...}); this file draws it in two panes: the field's outline on the left,
   one thing at a time on the right (the field's About, or one topic).

   A field:  { id, name, short, layer, ink, inkDark, lede, overview: [para], diagram, start: [read],
               sections: [{ title, body: [para], read }], clusters: [{ name, line, topics }], see }
   A topic:  { id, name, line, body: [para], uses: [string], example, nuance,
               read: [{ label, url, m }], see: [{ label, href }], tags }
   diagram:  { nodes: [{ id, label, sub, col, row }], edges: [[from, to, label]], cap }
             A node named after a topic opens it; one named after a field opens that field.
   Routes:   #/<field> (its About), #/<field>/<topic>. Arrow keys walk the field. */
(function () {
  "use strict";
  var B = window.BASELINE;
  var LAYERS = ["Start", "Foundations", "Building", "Intelligence", "Worlds"];
  var ORDER = ["overview", "systems", "distributed", "data", "backend", "frontend", "mobile", "cloud", "devops",
    "ml", "ai", "inference", "audio", "nlp", "graphics", "games"];
  var fields = ORDER.map(function (id) { return B.byId[id]; }).filter(Boolean);
  B.fields.forEach(function (f) { if (fields.indexOf(f) < 0) { fields.push(f); } });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (html != null) { e.innerHTML = html; }
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  /* Inline markup in content: `code`, **bold**, *italic*, [text](href). */
  function md(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, h) {
        var out = /^https?:/.test(h);
        return '<a href="' + h + '"' + (out ? ' target="_blank" rel="noopener"' : "") + ">" + t + "</a>";
      });
  }
  function dark() {
    var t = document.documentElement.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function ink(f) { return dark() ? (f.inkDark || f.ink) : f.ink; }
  function topicsOf(f) { var t = []; (f.clusters || []).forEach(function (c) { c.topics.forEach(function (x) { t.push(x); }); }); return t; }
  function clusterOf(f, t) { return (f.clusters || []).filter(function (c) { return c.topics.indexOf(t) >= 0; })[0]; }
  /* The walk through a field: its About, then every topic in order. */
  function walk(f) { return [null].concat(topicsOf(f)); }
  function href(f, t) { return "#/" + f.id + (t ? "/" + t.id : ""); }
  /* Know now (baseline/core.js): these topics glow wherever they are listed. */
  function core(f, t) { var c = (B.core || {})[f.id]; return !!(c && t && c.indexOf(t.id) >= 0); }

  var cur = { f: null, t: null };

  /* ------------------------------------------------------------ the rail */
  function drawPicker() {
    var sel = $(".pick select");
    sel.innerHTML = "";
    LAYERS.forEach(function (L) {
      var fs = fields.filter(function (f) { return f.layer === L; });
      if (!fs.length) { return; }
      var g = document.createElement("optgroup");
      g.label = L === "Start" ? "Baseline" : L;
      fs.forEach(function (f) {
        var o = document.createElement("option");
        o.value = f.id; o.textContent = f.name;
        g.appendChild(o);
      });
      sel.appendChild(g);
    });
  }
  function drawOutline() {
    var f = cur.f, box = $(".outline");
    box.innerHTML = "";
    var about = el("a", "about" + (cur.t ? "" : " here"), f.id === "overview" ? "How the fields fit" : "About this field");
    about.href = href(f);
    box.appendChild(about);
    if ((B.core || {})[f.id]) { box.appendChild(el("p", "corekey", '<span class="core">Glowing</span> topics: know these now.')); }
    (f.clusters || []).forEach(function (c) {
      box.appendChild(el("h4", "", md(c.name)));
      c.topics.forEach(function (t) {
        var a = el("a", (t === cur.t ? "here" : "") + (core(f, t) ? " core" : ""), md(t.name));
        a.href = href(f, t);
        a.title = (core(f, t) ? "Know now. " : "") + (t.line || "");
        box.appendChild(a);
      });
    });
    if (f.id === "overview") {
      box.appendChild(el("h4", "", "The fields"));
      fields.forEach(function (g) {
        if (g.id === "overview") { return; }
        var a = el("a", "", '<i style="--dot:' + ink(g) + '"></i>' + esc(g.name));
        a.href = href(g);
        box.appendChild(a);
      });
    }
    var here = box.querySelector(".here");
    if (here) { here.scrollIntoView({ block: "nearest" }); }
  }
  function search(q) {
    var res = $(".results"), out = $(".outline");
    q = q.trim().toLowerCase();
    if (!q) { res.hidden = true; out.hidden = false; return; }
    var hits = [];
    fields.forEach(function (f) {
      topicsOf(f).forEach(function (t) {
        var hay = (t.name + " " + (t.line || "") + " " + (t.tags || []).join(" ")).toLowerCase();
        if (hay.indexOf(q) >= 0) { hits.push({ f: f, t: t, s: t.name.toLowerCase().indexOf(q) === 0 ? 0 : 1 }); }
      });
    });
    hits.sort(function (a, b) { return a.s - b.s; });
    res.innerHTML = hits.length ? "" : "<p>Nothing by that name yet.</p>";
    hits.slice(0, 40).forEach(function (h) {
      var a = el("a", core(h.f, h.t) ? "core" : "", md(h.t.name) + "<span>" + esc(h.f.name) + "</span>");
      a.href = href(h.f, h.t);
      res.appendChild(a);
    });
    res.hidden = false; out.hidden = true;
  }

  /* ------------------------------------------------------------- the map */
  var FULL = { bw: 168, bh: 48, xg: 52, yg: 26 }, COMPACT = { bw: 138, bh: 44, xg: 30, yg: 16, compact: true };
  function drawMap(f, size) {
    var z = size || FULL, BW = z.bw, BH = z.bh, XG = z.xg, YG = z.yg;
    var d = f.diagram;
    if (!d || !d.nodes || !d.nodes.length) { return null; }
    var ids = {};
    topicsOf(f).forEach(function (t) { ids[t.id] = true; });
    var cols = 0, rows = 0, pos = {};
    d.nodes.forEach(function (n) { cols = Math.max(cols, n.col + 1); rows = Math.max(rows, n.row + 1); });
    var W = cols * BW + (cols - 1) * XG + 2, H = rows * BH + (rows - 1) * YG + 2;
    d.nodes.forEach(function (n) { pos[n.id] = { x: 1 + n.col * (BW + XG), y: 1 + n.row * (BH + YG) }; });
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(f.name) + ' map">';
    s += '<defs><marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor"/></marker></defs>';
    (d.edges || []).forEach(function (e) {
      var a = pos[e[0]], b = pos[e[1]];
      if (!a || !b) { return; }
      var x1, y1, x2, y2;
      if (a.x === b.x) { x1 = x2 = a.x + BW / 2; y1 = a.y < b.y ? a.y + BH : a.y; y2 = a.y < b.y ? b.y : b.y + BH; }
      else { x1 = a.x < b.x ? a.x + BW : a.x; y1 = a.y + BH / 2; x2 = a.x < b.x ? b.x : b.x + BW; y2 = b.y + BH / 2; }
      var mx = (x1 + x2) / 2, path = a.x === b.x ? "M" + x1 + "," + y1 + " L" + x2 + "," + y2
        : "M" + x1 + "," + y1 + " C" + mx + "," + y1 + " " + mx + "," + y2 + " " + x2 + "," + y2;
      s += '<g class="e" style="color:var(--ink-3)"><path d="' + path + '" marker-end="url(#ah)"/>';
      if (e[2]) { s += '<text x="' + (mx + (a.x === b.x ? 6 : 0)) + '" y="' + ((y1 + y2) / 2 - 4) + '" text-anchor="' + (a.x === b.x ? "start" : "middle") + '">' + esc(e[2]) + "</text>"; }
      s += "</g>";
    });
    d.nodes.forEach(function (n) {
      var p = pos[n.id], go = ids[n.id] ? f.id + "/" + n.id : (B.byId[n.id] && n.id !== f.id ? n.id : null);
      var glow = ids[n.id] && ((B.core || {})[f.id] || []).indexOf(n.id) >= 0;
      s += '<g class="n' + (go ? " t" : "") + (glow ? " core" : "") + '"' + (go ? ' data-t="' + go + '" tabindex="0" role="link"' : "") + ">";
      s += '<rect x="' + p.x + '" y="' + p.y + '" width="' + BW + '" height="' + BH + '" rx="4"/>';
      s += '<text x="' + (p.x + BW / 2) + '" y="' + (p.y + (n.sub ? BH / 2 - 4 : BH / 2 + 5)) + '" text-anchor="middle">' + esc(n.label) + "</text>";
      if (n.sub) { s += '<text class="s" x="' + (p.x + BW / 2) + '" y="' + (p.y + BH / 2 + 13) + '" text-anchor="middle">' + esc(n.sub) + "</text>"; }
      s += "</g>";
    });
    s += "</svg>";
    var fig = el("figure", "map" + (z.compact ? " compact" : ""), s);
    if (d.cap) { fig.appendChild(el("figcaption", "", md(d.cap))); }
    function open(e) { var g = e.target.closest("[data-t]"); if (g) { location.hash = "#/" + g.getAttribute("data-t"); } }
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
    return fig;
  }

  /* ----------------------------------------------------------- the reader */
  function reads(list) {
    var ul = el("ul", "reads");
    (list || []).forEach(function (r) {
      ul.appendChild(el("li", "", '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + md(r.label) + "</a>" + (r.m ? "<em>" + r.m + " min</em>" : "")));
    });
    return ul;
  }
  function seeAlso(list) {
    if (!list || !list.length) { return null; }
    return el("p", "seealso", "On this site: " + list.map(function (s) { return '<a href="' + esc(s.href) + '">' + esc(s.label) + "</a>"; }).join(" · "));
  }
  function block(title, node) { var s = el("section", "part"); s.appendChild(el("h3", "", title)); s.appendChild(node); return s; }

  function drawAbout(v, f) {
    v.appendChild(el("h1", "", esc(f.name)));
    if (f.lede) { v.appendChild(el("p", "lede", md(f.lede))); }
    (f.overview || []).forEach(function (p) { v.appendChild(el("p", "", md(p))); });
    if (f.id === "overview") { v.appendChild(fieldBrowser(f)); }
    else { var map = drawMap(f); if (map) { v.appendChild(map); } }
    if (f.start && f.start.length) {
      v.appendChild(el("h2", "", "Start here"));
      var ul = el("ul", "start");
      f.start.forEach(function (r) {
        ul.appendChild(el("li", "", '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + md(r.label) + "</a>" +
          (r.m ? "<em>" + r.m + " min</em>" : "") + (r.why ? "<span>" + md(r.why) + "</span>" : "")));
      });
      v.appendChild(ul);
    }
    (f.sections || []).forEach(function (sec) {
      v.appendChild(el("h2", "", md(sec.title)));
      (sec.body || []).forEach(function (p) { v.appendChild(el("p", "", md(p))); });
      if (sec.read) { v.appendChild(reads(sec.read)); }
    });
    if (f.clusters && f.clusters.length) {
      v.appendChild(el("h2", "", "In this field"));
      var grid = el("div", "contents");
      f.clusters.forEach(function (c) {
        var col = el("div", "");
        col.appendChild(el("h3", "", md(c.name)));
        if (c.line) { col.appendChild(el("p", "cline", md(c.line))); }
        c.topics.forEach(function (t) {
          var a = el("a", core(f, t) ? "core" : "", "<b>" + md(t.name) + "</b><span>" + md(t.line || "") + "</span>");
          a.href = href(f, t);
          col.appendChild(a);
        });
        grid.appendChild(col);
      });
      v.appendChild(grid);
    }
    var sa = seeAlso(f.see); if (sa) { v.appendChild(sa); }
  }
  /* The overview's map, with a preview beside it: hover a field to see its own map, click to
     keep it there. The preview's box is a fixed size, so nothing on the page moves. */
  function fieldBrowser(f) {
    var wrap = el("div", "browse");
    var fig = drawMap(f, COMPACT);
    fig.style.width = fig.querySelector("svg").getAttribute("width") + "px";   /* the caption wraps to the map, never widens it */
    var pane = el("aside", "preview");
    pane.setAttribute("aria-live", "polite");
    var pinned = null;
    function show(id) {
      var g = B.byId[id];
      if (!g || g === f) { return; }
      pane.innerHTML = "";
      pane.style.setProperty("--pv", ink(g));
      var head = el("div", "pv-head");
      head.appendChild(el("h3", "", esc(g.name)));
      var open = el("a", "pv-open", "Open the field &rarr;");
      open.href = href(g);
      head.appendChild(open);
      pane.appendChild(head);
      if (g.lede) { pane.appendChild(el("p", "pv-lede", md(g.lede))); }
      var m = drawMap(g);
      if (m) { var cap = m.querySelector("figcaption"); if (cap) { cap.remove(); } pane.appendChild(m); }
      fig.querySelectorAll(".n").forEach(function (n) { n.classList.toggle("on", n.getAttribute("data-t") === id); });
    }
    fig.querySelectorAll(".n.t").forEach(function (n) {
      var id = n.getAttribute("data-t");
      n.addEventListener("mouseenter", function () { show(id); });
      n.addEventListener("focus", function () { show(id); });
    });
    fig.addEventListener("mouseleave", function () { if (pinned) { show(pinned); } });
    /* a click keeps the preview instead of leaving the overview */
    fig.addEventListener("click", function (e) {
      var g = e.target.closest("[data-t]");
      if (g) { e.stopImmediatePropagation(); pinned = g.getAttribute("data-t"); show(pinned); }
    }, true);
    fig.addEventListener("keydown", function (e) {
      var g = e.target.closest("[data-t]");
      if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.stopImmediatePropagation(); pinned = g.getAttribute("data-t"); show(pinned); }
    }, true);
    wrap.appendChild(fig);
    wrap.appendChild(pane);
    pinned = "systems";
    show(pinned);
    return wrap;
  }

  function drawTopic(v, f, t) {
    var c = clusterOf(f, t);
    v.appendChild(el("p", "crumb", '<a href="' + href(f) + '">' + esc(f.name) + "</a>" + (c ? " &rsaquo; " + md(c.name) : "")));
    v.appendChild(el("h1", core(f, t) ? "core" : "", md(t.name)));
    if (t.line) { v.appendChild(el("p", "lede", md(t.line))); }
    var what = el("div", "prose");
    (t.body || []).forEach(function (p) { what.appendChild(el("p", "", md(p))); });
    v.appendChild(what);
    if (t.uses && t.uses.length) {
      var ul = el("ul", "uses");
      t.uses.forEach(function (u) { ul.appendChild(el("li", "", md(u))); });
      v.appendChild(block("Where it is used", ul));
    } else if (t.where) {
      v.appendChild(block("Where it is used", el("p", "", md(t.where))));
    }
    if (t.example) { v.appendChild(block("An example", el("p", "example", md(t.example)))); }
    if (t.nuance) { v.appendChild(block("The catch", el("p", "", md(t.nuance)))); }
    if (t.read && t.read.length) { v.appendChild(block("Read more", reads(t.read))); }
    var sa = seeAlso(t.see); if (sa) { v.appendChild(sa); }
  }
  function drawPager(v) {
    var w = walk(cur.f), i = w.indexOf(cur.t), prev = w[i - 1], next = w[i + 1];
    var nav = el("nav", "pager");
    function link(t, dir) {
      if (t === undefined) { return el("span", ""); }
      var a = el("a", dir, "<small>" + (dir === "prev" ? "Previous" : "Next") + "</small>" + (t ? md(t.name) : "About this field"));
      a.href = href(cur.f, t);
      return a;
    }
    nav.appendChild(link(prev, "prev"));
    nav.appendChild(el("span", "pos", (i === 0 ? "About" : i + " of " + (w.length - 1))));
    nav.appendChild(link(next, "next"));
    v.appendChild(nav);
  }
  function drawReader() {
    var v = $(".reader");
    v.innerHTML = "";
    var page = el("article", "page" + (cur.t || cur.f.id !== "overview" ? "" : " wide"));
    if (cur.t) { drawTopic(page, cur.f, cur.t); } else { drawAbout(page, cur.f); }
    v.appendChild(page);
    if (cur.f.clusters && cur.f.clusters.length) { drawPager(v); }
    v.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function route() {
    var h = location.hash.replace(/^#\/?/, "").split("/");
    var f = B.byId[h[0]] || fields[0], t = null;
    if (h[1]) { t = topicsOf(f).filter(function (x) { return x.id === h[1]; })[0] || null; }
    cur.f = f; cur.t = t;
    document.documentElement.style.setProperty("--field", ink(f));
    document.title = (t ? t.name.replace(/[*`]/g, "") + " · " : "") + f.name + " · Baseline";
    $(".pick select").value = f.id;
    var i = $(".find"); if (i.value) { i.value = ""; search(""); }
    drawOutline();
    drawReader();
    document.body.classList.remove("rail-open");
  }

  /* --------------------------------------------------------------- wiring */
  function init() {
    var rail = $(".rail");
    rail.innerHTML = '<div class="pick"><select aria-label="Field"></select></div>' +
      '<input class="find" type="search" placeholder="Find a topic  /" aria-label="Find a topic">' +
      '<div class="results" hidden></div><nav class="outline" aria-label="This field"></nav>';
    drawPicker();
    $(".pick select").addEventListener("change", function (e) { location.hash = "#/" + e.target.value; });
    $(".find").addEventListener("input", function (e) { search(e.target.value); });
    $(".contents-btn").addEventListener("click", function () { document.body.classList.toggle("rail-open"); });
    document.addEventListener("keydown", function (e) {
      if (/input|textarea|select/i.test(document.activeElement.tagName) || e.metaKey || e.ctrlKey || e.altKey) { return; }
      if (e.key === "/") { e.preventDefault(); document.body.classList.add("rail-open"); $(".find").focus(); return; }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var w = walk(cur.f), i = w.indexOf(cur.t), n = w[i + (e.key === "ArrowRight" ? 1 : -1)];
        if (n !== undefined && cur.f.clusters && cur.f.clusters.length) { e.preventDefault(); location.hash = href(cur.f, n); }
      }
      if (e.key === "Escape") { document.body.classList.remove("rail-open"); }
    });
    window.addEventListener("hashchange", route);
    route();
  }
  init();
}());
