/* Baseline, the field atlas. Each field is one data file in baseline/fields/ that calls
   BASELINE.field({...}); this file draws the index, the map and the topics from them.

   A field:  { id, name, layer, ink, inkDark, lede, overview: [para], diagram, start: [read],
               clusters: [{ name, line, topics: [topic] }], see: [{ label, href }] }
   A topic:  { id, name, line, body: [para], where, nuance, read: [{ label, url, m }], see: [{ label, href }] }
   A read:   { label, url, m } where m is minutes for the part worth reading.
   diagram:  { nodes: [{ id, label, sub, col, row }], edges: [[from, to, label]], cap }
             A node whose id is a topic id opens that topic. Routes: #/<field>, #/<field>/<topic>. */
(function () {
  "use strict";
  var B = window.BASELINE;
  var LAYERS = ["Start", "Foundations", "Building", "Intelligence", "Worlds"];
  var ORDER = ["overview", "systems", "distributed", "data", "backend", "frontend", "mobile", "cloud", "devops",
    "ml", "ai", "inference", "audio", "graphics", "games"];
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
  function topicsOf(f) { var t = []; (f.clusters || []).forEach(function (c) { t = t.concat(c.topics); }); return t; }

  /* ------------------------------------------------------------------ index */
  function drawIndex(cur) {
    var ix = $(".index"), strip = $(".strip");
    var list = el("div", "fields");
    LAYERS.forEach(function (L) {
      var fs = fields.filter(function (f) { return f.layer === L; });
      if (!fs.length) { return; }
      if (L !== "Start") { list.appendChild(el("h4", "", L)); }
      fs.forEach(function (f) {
        var a = el("a", f.id === cur ? "here" : "", '<i style="--dot:' + ink(f) + '"></i>' + esc(f.name) +
          (f.id === "overview" ? "" : "<small>" + topicsOf(f).length + "</small>"));
        a.href = "#/" + f.id;
        list.appendChild(a);
      });
    });
    var keep = ix.querySelector("input");
    ix.innerHTML = "";
    ix.appendChild(keep || searchBox());
    var res = el("div", "results");
    res.hidden = true;
    ix.appendChild(res);
    ix.appendChild(list);
    strip.innerHTML = "";
    fields.forEach(function (f) {
      var a = el("a", f.id === cur ? "here" : "", '<i style="--dot:' + ink(f) + '"></i>' + esc(f.short || f.name));
      a.href = "#/" + f.id;
      strip.appendChild(a);
      if (f.id === cur) { setTimeout(function () { a.scrollIntoView({ inline: "center", block: "nearest" }); }, 0); }
    });
  }
  function searchBox() {
    var i = el("input");
    i.type = "search"; i.placeholder = "Find a topic  /"; i.setAttribute("aria-label", "Find a topic");
    i.addEventListener("input", function () { search(i.value); });
    return i;
  }
  function search(q) {
    var res = $(".results"), list = $(".fields");
    q = q.trim().toLowerCase();
    if (!q) { res.hidden = true; list.hidden = false; return; }
    var hits = [];
    fields.forEach(function (f) {
      topicsOf(f).forEach(function (t) {
        var hay = (t.name + " " + (t.line || "") + " " + (t.tags || []).join(" ")).toLowerCase();
        if (hay.indexOf(q) >= 0) { hits.push({ f: f, t: t, s: t.name.toLowerCase().indexOf(q) === 0 ? 0 : 1 }); }
      });
    });
    hits.sort(function (a, b) { return a.s - b.s; });
    res.innerHTML = hits.length ? "" : "<p>Nothing by that name yet.</p>";
    hits.slice(0, 30).forEach(function (h) {
      var a = el("a", "", esc(h.t.name) + "<span>" + esc(h.f.name) + "</span>");
      a.href = "#/" + h.f.id + "/" + h.t.id;
      res.appendChild(a);
    });
    res.hidden = false; list.hidden = true;
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
      var i = $(".index input"); if (i && i.offsetParent) { e.preventDefault(); i.focus(); }
    }
  });

  /* ---------------------------------------------------------------- the map */
  var BW = 168, BH = 48, XG = 52, YG = 26;
  function drawMap(f) {
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
      s += '<g class="n' + (go ? " t" : "") + '"' + (go ? ' data-t="' + go + '" tabindex="0" role="link"' : "") + ">";
      s += '<rect x="' + p.x + '" y="' + p.y + '" width="' + BW + '" height="' + BH + '" rx="4"/>';
      s += '<text x="' + (p.x + BW / 2) + '" y="' + (p.y + (n.sub ? 20 : 29)) + '" text-anchor="middle">' + esc(n.label) + "</text>";
      if (n.sub) { s += '<text class="s" x="' + (p.x + BW / 2) + '" y="' + (p.y + 37) + '" text-anchor="middle">' + esc(n.sub) + "</text>"; }
      s += "</g>";
    });
    s += "</svg>";
    var fig = el("figure", "map", s);
    if (d.cap) { fig.appendChild(el("figcaption", "", md(d.cap))); }
    fig.addEventListener("click", function (e) {
      var g = e.target.closest("[data-t]"); if (g) { location.hash = "#/" + g.getAttribute("data-t"); }
    });
    fig.addEventListener("keydown", function (e) {
      var g = e.target.closest("[data-t]"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); location.hash = "#/" + g.getAttribute("data-t"); }
    });
    return fig;
  }

  /* ------------------------------------------------------------- the leaf */
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
  function topic(f, t) {
    var d = el("details", "topic");
    d.id = "t-" + t.id;
    d.appendChild(el("summary", "", "<b>" + md(t.name) + "</b><span>" + md(t.line || "") + "</span>"));
    var body = el("div", "body prose");
    (t.body || []).forEach(function (p) { body.appendChild(el("p", "", md(p))); });
    if (t.where) { body.appendChild(el("p", "lead", "<b>Where you meet it.</b> " + md(t.where))); }
    if (t.nuance) { body.appendChild(el("p", "lead", "<b>The nuance.</b> " + md(t.nuance))); }
    if (t.read && t.read.length) { body.appendChild(reads(t.read)); }
    var sa = seeAlso(t.see); if (sa) { body.appendChild(sa); }
    d.appendChild(body);
    d.addEventListener("toggle", function () {
      if (d.open && location.hash !== "#/" + f.id + "/" + t.id) { history.replaceState(null, "", "#/" + f.id + "/" + t.id); }
    });
    return d;
  }
  function drawField(f, tid) {
    var leaf = $(".leaf");
    leaf.innerHTML = "";
    document.documentElement.style.setProperty("--field", ink(f));
    document.title = f.name + " · Baseline";
    leaf.appendChild(el("h1", "", esc(f.name)));
    if (f.lede) { leaf.appendChild(el("p", "lede", md(f.lede))); }
    (f.overview || []).forEach(function (p) { leaf.appendChild(el("p", "", md(p))); });
    var map = drawMap(f); if (map) { leaf.appendChild(map); }
    if (f.start && f.start.length) {
      leaf.appendChild(el("h2", "", "Start here"));
      var ul = el("ul", "start");
      f.start.forEach(function (r) {
        ul.appendChild(el("li", "", '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + md(r.label) + "</a>" +
          (r.m ? "<em>" + r.m + " min</em>" : "") + (r.why ? "<span>" + md(r.why) + "</span>" : "")));
      });
      leaf.appendChild(ul);
    }
    (f.sections || []).forEach(function (sec) {
      leaf.appendChild(el("h2", "", md(sec.title)));
      (sec.body || []).forEach(function (p) { leaf.appendChild(el("p", "", md(p))); });
      if (sec.read) { leaf.appendChild(reads(sec.read)); }
    });
    if (f.clusters && f.clusters.length) {
      var tools = el("div", "tools", "<button type=\"button\" data-a=\"open\">Open all</button><button type=\"button\" data-a=\"shut\">Close all</button>");
      tools.addEventListener("click", function (e) {
        var a = e.target.getAttribute("data-a"); if (!a) { return; }
        leaf.querySelectorAll("details.topic").forEach(function (d) { d.open = a === "open"; });
      });
      f.clusters.forEach(function (c, ci) {
        var sec = el("section", "cluster");
        sec.appendChild(el("h2", "", md(c.name) + "<small>" + c.topics.length + "</small>"));
        if (c.line) { sec.appendChild(el("p", "cline", md(c.line))); }
        if (ci === 0) { sec.appendChild(tools); }
        c.topics.forEach(function (t) { sec.appendChild(topic(f, t)); });
        leaf.appendChild(sec);
      });
    }
    var sa = seeAlso(f.see); if (sa) { leaf.appendChild(sa); }
    leaf.appendChild(el("p", "foot", "Baseline is a map, not a course: what each part of a field is, where it shows up, and what to read when you want depth. Every outside link was opened and checked when it was added."));
    if (tid) {
      var d = document.getElementById("t-" + tid);
      if (d) {
        d.open = true; d.classList.add("flash");
        setTimeout(function () { d.scrollIntoView({ block: "start" }); }, 0);
        setTimeout(function () { d.classList.remove("flash"); }, 1400);
      }
    } else { window.scrollTo(0, 0); }
  }

  function route() {
    var h = location.hash.replace(/^#\/?/, "").split("/");
    var f = B.byId[h[0]] || fields[0];
    drawIndex(f.id);
    drawField(f, h[1] || null);
    var i = $(".index input"); if (i && i.value) { i.value = ""; search(""); }
  }
  window.addEventListener("hashchange", route);
  route();
}());
