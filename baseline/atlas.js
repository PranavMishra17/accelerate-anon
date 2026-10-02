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
  var U = B.ui, el = U.el, esc = U.esc, md = U.md, ink = U.ink, topicsOf = U.topicsOf, href = U.href,
    drawMap = U.drawMap, fieldBrowser = U.fieldBrowser;   /* from map.js */
  function clusterOf(f, t) { return (f.clusters || []).filter(function (c) { return c.topics.indexOf(t) >= 0; })[0]; }
  /* The walk through a field: its About, then every topic in order. */
  function walk(f) { return [null].concat(topicsOf(f)); }
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
        var a = el("a", (t === cur.t ? "here" : "") + (core(f, t) ? " core" : ""), (qOf(f, t).length ? lvMark(levelOf(f, t)) : "") + md(t.name));
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

  /* ------------------------------------------------------------ check yourself
     baseline/quiz/<field>.js: BASELINE.quiz(field, { topic: [{ q, o: [5], a, why, pair }] }).
     Answers live in this browser (localStorage 'baseline.quiz.v1'); a topic's level is Know when
     every question is right and not guessed, Not yet when under half are, Partly otherwise. */
  var QKEY = "baseline.quiz.v1", LV = { know: "Know", partly: "Partly", notyet: "Not yet" };
  function qOf(f, t) { return ((B.quizzes || {})[f.id] || {})[t.id] || []; }
  function qStore() { try { return JSON.parse(localStorage.getItem(QKEY) || "{}"); } catch (e) { console.error("Could not read quiz answers", e); return {}; } }
  function qSave(s) { try { localStorage.setItem(QKEY, JSON.stringify(s)); } catch (e) { console.error("Could not save quiz answers", e); } }
  function levelOf(f, t, s) {
    var qs = qOf(f, t); if (!qs.length) { return null; }
    s = s || qStore();
    var n = 0, ok = 0;
    qs.forEach(function (q, i) { var r = s[f.id + "/" + t.id + "/" + i]; if (r) { n++; if (r.ok && !r.g) { ok++; } } });
    if (!n) { return null; }
    if (ok / n < 0.5) { return "notyet"; }
    return ok === qs.length ? "know" : "partly";
  }
  function lvMark(lv) { return '<i class="lv lv-' + (lv || "none") + '" title="' + (lv ? LV[lv] : "Not checked yet") + '"></i>'; }
  /* one question; done() after the answer shows */
  function askOne(host, f, t, i, done) {
    var q = qOf(f, t)[i], key = f.id + "/" + t.id + "/" + i;
    var box = el("div", "mq");
    box.appendChild(el("p", "mq-q", md(q.q)));
    var opts = el("div", "mq-opts"), lab = el("label", "mq-guess"), cb = el("input"), after = el("div", "");
    cb.type = "checkbox"; lab.appendChild(cb); lab.appendChild(document.createTextNode(" I'm guessing"));
    function pick(k) {
      var s = qStore(); s[key] = { k: k, ok: k === q.a, g: k >= 0 && cb.checked, at: Date.now() }; qSave(s);
      opts.querySelectorAll("button").forEach(function (b, bi) {
        b.disabled = true;
        if (bi === q.a) { b.classList.add("right"); } else if (bi === k) { b.classList.add("wrong"); }
      });
      cb.disabled = true;
      after.appendChild(el("p", "mq-why", "<b>" + (k < 0 ? "Not known." : k === q.a ? (cb.checked ? "Right, but guessed." : "Right.") : "Not quite.") + "</b> " + md(q.why || "")));
      done();
    }
    q.o.forEach(function (o, k) {
      var b = el("button", "mq-o", "<span>" + "ABCDE".charAt(k) + "</span>" + md(o));
      b.addEventListener("click", function () { pick(k); });
      opts.appendChild(b);
    });
    var idk = el("button", "mq-o mq-idk", "I don't know");
    idk.addEventListener("click", function () { pick(-1); });
    opts.appendChild(idk);
    box.appendChild(opts); box.appendChild(lab); box.appendChild(after);
    host.appendChild(box);
  }
  function drawCheck(v, f, t) {
    var qs = qOf(f, t);
    if (!qs.length) { return; }
    var sec = el("section", "part check"), lv = levelOf(f, t);
    sec.appendChild(el("h3", "", "Check yourself"));
    var head = el("p", "check-head", qs.length + " questions." + (lv ? " Your level: " + lvMark(lv) + " <b>" + LV[lv] + "</b>." : " Say 'I don't know' when you don't."));
    sec.appendChild(head);
    var host = el("div", ""), start = el("button", "btn", lv ? "Check again" : "Start");
    sec.appendChild(start); sec.appendChild(host);
    start.addEventListener("click", function () {
      start.remove();
      var i = 0;
      (function next() {
        host.innerHTML = "";
        host.appendChild(el("p", "check-n", "Question " + (i + 1) + " of " + qs.length));
        askOne(host, f, t, i, function () {
          i++;
          var b;
          if (i < qs.length) { b = el("button", "btn", "Next question"); b.addEventListener("click", next); }
          else {
            var L = levelOf(f, t);
            host.appendChild(el("p", "check-done", "Done. Your level: " + lvMark(L) + " <b>" + (L ? LV[L] : "") + "</b>."));
            drawOutline();
            b = null;
          }
          if (b) { host.appendChild(b); b.focus({ preventScroll: true }); }
        });
      }());
    });
    v.appendChild(sec);
  }
  /* A field's standing and a test across it, weakest first, in a pop-up. */
  function drawStanding(v, f) {
    var tops = topicsOf(f).filter(function (t) { return qOf(f, t).length; });
    if (!tops.length) { return; }
    var s = qStore(), c = { know: 0, partly: 0, notyet: 0, none: 0 };
    tops.forEach(function (t) { c[levelOf(f, t, s) || "none"]++; });
    var p = el("div", "standing");
    p.appendChild(el("p", "", "<b>Where you stand.</b> " + lvMark("know") + c.know + " know, " + lvMark("partly") + c.partly + " partly, " +
      lvMark("notyet") + c.notyet + " not yet, " + lvMark(null) + c.none + " not checked."));
    var b = el("button", "btn", "Test this field");
    b.addEventListener("click", function () { testField(f); });
    p.appendChild(b);
    v.appendChild(p);
  }
  function testField(f) {
    var s = qStore(), pool = [];
    topicsOf(f).forEach(function (t) {
      qOf(f, t).forEach(function (q, i) {
        var r = s[f.id + "/" + t.id + "/" + i];
        pool.push({ t: t, i: i, w: !r ? 1 : (!r.ok || r.g) ? 0 : 2, r: Math.random() });
      });
    });
    pool.sort(function (a, b) { return a.w - b.w || a.r - b.r; });
    pool = pool.slice(0, 15);
    var dlg = el("dialog", "qtest"), box = el("div", "qtest-box"), n = 0, right = 0;
    dlg.appendChild(box); document.body.appendChild(dlg);
    dlg.addEventListener("close", function () { dlg.remove(); drawOutline(); drawReader(); });
    function step() {
      box.innerHTML = "";
      var head = el("div", "qtest-head", "<b>" + esc(f.name) + "</b><span>" + (n < pool.length ? (n + 1) + " of " + pool.length : "Done") + "</span>");
      var x = el("button", "linkish", "Close"); x.addEventListener("click", function () { dlg.close(); });
      head.appendChild(x); box.appendChild(head);
      if (n >= pool.length) { box.appendChild(el("p", "check-done", right + " of " + pool.length + " right, guesses not counted.")); return; }
      var p = pool[n];
      box.appendChild(el("p", "check-n", md(p.t.name)));
      askOne(box, f, p.t, p.i, function () {
        var r = qStore()[f.id + "/" + p.t.id + "/" + p.i]; if (r.ok && !r.g) { right++; }
        var nb = el("button", "btn", n + 1 < pool.length ? "Next" : "See how you did");
        nb.addEventListener("click", function () { n++; step(); });
        box.appendChild(nb); nb.focus();
      });
    }
    step();
    try { dlg.showModal(); } catch (e) { dlg.setAttribute("open", ""); }
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
    drawStanding(v, f);
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
    var cur_res = ((B.resources || {})[f.id] || {})[t.id];
    if (cur_res && window.Res) { var rr = Res.render(cur_res); if (rr) { v.appendChild(block("Read and watch", rr)); } }
    else if (t.read && t.read.length) { v.appendChild(block("Read more", reads(t.read))); }
    drawCheck(v, f, t);
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
