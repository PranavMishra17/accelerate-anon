/* Baseline's maps, shared by BASELINE.html (atlas.js) and the tracker's home page.
   BASELINE.ui.drawMap(field, size, base) draws a field's diagram as an SVG figure;
   BASELINE.ui.fieldBrowser(field, base) draws the overview map beside a fixed preview of the
   field under the pointer. Hovering or focusing a node lights it, its neighbours and the arrows
   between them, and dims the rest. `base` is "" on Baseline itself and "BASELINE.html" from
   another page, so a click opens the right place. Loads after base.js and the field files. */
(function () {
  "use strict";
  var B = window.BASELINE;
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
  function href(f, t) { return "#/" + f.id + (t ? "/" + t.id : ""); }

  var FULL = { bw: 168, bh: 48, xg: 52, yg: 26 }, COMPACT = { bw: 138, bh: 44, xg: 30, yg: 16, compact: true };
  function drawMap(f, size, base) {
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
      s += '<g class="e" data-a="' + esc(e[0]) + '" data-b="' + esc(e[1]) + '" style="color:var(--ink-3)"><path d="' + path + '" marker-end="url(#ah)"/>';
      if (e[2]) { s += '<text x="' + (mx + (a.x === b.x ? 6 : 0)) + '" y="' + ((y1 + y2) / 2 - 4) + '" text-anchor="' + (a.x === b.x ? "start" : "middle") + '">' + esc(e[2]) + "</text>"; }
      s += "</g>";
    });
    d.nodes.forEach(function (n) {
      var p = pos[n.id], go = ids[n.id] ? f.id + "/" + n.id : (B.byId[n.id] && n.id !== f.id ? n.id : null);
      var glow = ids[n.id] && ((B.core || {})[f.id] || []).indexOf(n.id) >= 0;
      s += '<g class="n' + (go ? " t" : "") + (glow ? " core" : "") + '" data-id="' + esc(n.id) + '"' + (go ? ' data-t="' + go + '" tabindex="0" role="link"' : "") + ">";
      s += '<rect x="' + p.x + '" y="' + p.y + '" width="' + BW + '" height="' + BH + '" rx="4"/>';
      s += '<text x="' + (p.x + BW / 2) + '" y="' + (p.y + (n.sub ? BH / 2 - 4 : BH / 2 + 5)) + '" text-anchor="middle">' + esc(n.label) + "</text>";
      if (n.sub) { s += '<text class="s" x="' + (p.x + BW / 2) + '" y="' + (p.y + BH / 2 + 13) + '" text-anchor="middle">' + esc(n.sub) + "</text>"; }
      s += "</g>";
    });
    s += "</svg>";
    var fig = el("figure", "map" + (z.compact ? " compact" : ""), s);
    if (d.cap) { fig.appendChild(el("figcaption", "", md(d.cap))); }
    var svg = fig.querySelector("svg"), held = null;
    /* Light a node, its neighbours and the arrows between them; null clears. */
    function focus(id) {
      svg.classList.toggle("focus", !!id);
      var near = {};
      if (id) { near[id] = true; }
      svg.querySelectorAll(".e").forEach(function (g) {
        var a = g.getAttribute("data-a"), b = g.getAttribute("data-b"), on = !!id && (a === id || b === id);
        g.classList.toggle("hl", on);
        if (on) { near[a] = near[b] = true; }
      });
      svg.querySelectorAll(".n").forEach(function (g) { g.classList.toggle("hl", !!near[g.getAttribute("data-id")]); });
      if (fig.onFocus) { fig.onFocus(id ? (d.edges || []).filter(function (e) { return e[0] === id || e[1] === id; }) : []); }
    }
    svg.querySelectorAll(".n").forEach(function (g) {
      var id = g.getAttribute("data-id");
      g.addEventListener("mouseenter", function () { focus(id); });
      g.addEventListener("focus", function () { focus(id); });
    });
    svg.addEventListener("mouseleave", function () { focus(held); });
    fig.focusOn = function (id) { held = id; focus(id); };
    function open(e) {
      var g = e.target.closest("[data-t]");
      if (!g) { return; }
      if (base) { location.href = base + "#/" + g.getAttribute("data-t"); } else { location.hash = "#/" + g.getAttribute("data-t"); }
    }
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
    return fig;
  }

  /* The overview's map, with a preview beside it: hover a field to see its own map, click to
     keep it there. The preview's box is a fixed size, so nothing on the page moves. */
  function fieldBrowser(f, base) {
    base = base || "";
    var wrap = el("div", "browse");
    var fig = drawMap(f, COMPACT, base);
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
      open.href = base + href(g);
      head.appendChild(open);
      pane.appendChild(head);
      if (g.lede) { pane.appendChild(el("p", "pv-lede", md(g.lede))); }
      var m = drawMap(g, null, base);
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
      if (g) { e.stopImmediatePropagation(); pinned = g.getAttribute("data-t"); fig.focusOn(pinned); show(pinned); }
    }, true);
    fig.addEventListener("keydown", function (e) {
      var g = e.target.closest("[data-t]");
      if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.stopImmediatePropagation(); pinned = g.getAttribute("data-t"); fig.focusOn(pinned); show(pinned); }
    }, true);
    /* the lit arrows, spelled out under the map: on the small map their labels would cover boxes */
    var name = {}, line = el("p", "links");
    f.diagram.nodes.forEach(function (n) { name[n.id] = n.label; });
    fig.insertBefore(line, fig.querySelector("figcaption"));
    fig.onFocus = function (edges) {
      line.innerHTML = edges.map(function (e) { return esc(name[e[0]]) + " &rarr; " + esc(name[e[1]]) + (e[2] ? ": <i>" + esc(e[2]) + "</i>" : ""); }).join("<br>");
    };
    wrap.appendChild(fig);
    wrap.appendChild(pane);
    pinned = "systems";
    fig.focusOn(pinned);
    show(pinned);
    return wrap;
  }

  B.ui = { el: el, esc: esc, md: md, dark: dark, ink: ink, topicsOf: topicsOf, href: href,
    FULL: FULL, COMPACT: COMPACT, drawMap: drawMap, fieldBrowser: fieldBrowser };
}());
