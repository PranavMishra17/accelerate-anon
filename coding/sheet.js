/* The coding cheat sheet and the side-by-side popup, shared by CODING.html and CHEATSHEET.html.
   Data is window.CODING from coding/data.js. Exposes window.CS for the pages. */
(function () {
  "use strict";
  var D = window.CODING, byId = {};
  D.patterns.forEach(function (p) { byId[p.id] = p; });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // Plain text with `code` spans.
  function md(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); }

  // A small Python highlighter: comments, strings, numbers, keywords, names after def or class, builtins.
  var KW = /^(def|class|return|if|elif|else|for|while|in|not|and|or|is|import|from|as|with|yield|lambda|pass|break|continue|try|except|finally|raise|None|True|False|nonlocal|global|del|assert|async|await)$/;
  var BI = /^(len|range|enumerate|min|max|sorted|set|dict|list|tuple|sum|zip|print|float|int|str|abs|any|all|map|isinstance|super|self)$/;
  function hl(src) {
    var re = /(#[^\n]*)|([rbf]?"(?:[^"\\\n]|\\.)*"|[rbf]?'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
    var out = "", last = 0, prev = "", m;
    while ((m = re.exec(src))) {
      var t = m[0];
      var cls = m[1] ? "tc" : m[2] ? "ts" : m[3] ? "tn" : KW.test(t) ? "tk" : (prev === "def" || prev === "class") ? "tf" : BI.test(t) ? "tb" : "";
      out += esc(src.slice(last, m.index)) + (cls ? '<span class="' + cls + '">' + esc(t) + "</span>" : esc(t));
      last = re.lastIndex;
      if (m[4]) { prev = t; }
    }
    return out + esc(src.slice(last));
  }
  function exLine(ex, short) {
    if (!ex) { return ""; }
    return '<span class="ex-in">' + esc(ex.i) + '</span><span class="ex-arrow">&rarr;</span><span class="ex-out">' + esc(ex.o) + "</span>" +
      (ex.w && !short ? '<span class="ex-w">' + esc(ex.w) + "</span>" : "");
  }
  // A full statement: the problem, two worked examples, constraints.
  function stHtml(st) {
    if (!st) { return ""; }
    var h = String(st.p).split(/\n\s*\n/).map(function (x) { return "<p>" + md(x) + "</p>"; }).join("");
    h += (st.ex || []).map(function (e, i) {
      return '<div class="st-ex"><b>Example ' + (i + 1) + '</b><div><span class="k">Input</span><code>' + esc(e.i) + '</code></div><div><span class="k">Output</span><code>' +
        esc(e.o) + "</code></div>" + (e.why ? '<div><span class="k">Why</span><span>' + md(e.why) + "</span></div>" : "") + "</div>";
    }).join("");
    if (st.k && st.k.length) { h += '<div class="st-k"><b>Constraints</b><ul>' + st.k.map(function (k) { return "<li>" + md(k) + "</li>"; }).join("") + "</ul></div>"; }
    return '<div class="st">' + h + "</div>";
  }
  // A shared figure from figures/figures.js, when the page loads the registry.
  function figHtml(key) {
    var f = window.FIGURES && window.FIGURES.DIA[key];
    if (!f) { return ""; }
    return '<figure class="cfig" data-fig="' + esc(key) + '"><div class="fig-svg">' + f.svg() + "</div><figcaption>" + f.cap + "</figcaption></figure>";
  }
  function li(t) { return "<li>" + t + "</li>"; }

  // A card: patterns and AI topics open their own popup; algorithm cards open a pattern at an item.
  function cardHtml(key) {
    var p = byId[key], c = p ? p.sheet : (D.algo[key] || D.extra[key]);
    if (!c) { return ""; }
    var target = p ? key : c.pop || "x:" + key, ex = p ? p.ex : c.ex;
    var h = target ? '<div class="cs-card cs-click" data-pop="' + target + '" data-at="' + (c.at || 0) + '" tabindex="0" role="button">' : '<div class="cs-card">';
    h += "<h3>" + esc(p ? p.title : c.title) + "</h3>";
    if (ex) { h += '<p class="cs-ex">' + exLine(ex, true) + "</p>"; }
    if (c.spot) { h += "<p><b>Spot:</b> " + c.spot + "</p>"; }
    if (c.move) { h += "<p><b>Move:</b> " + c.move + "</p>"; }
    if (c.code) { h += "<pre>" + hl(c.code) + "</pre>"; }
    // On a wide screen a clickable card keeps its sharpest nuance; a phone shows them all.
    if (c.notes) { h += "<ul>" + c.notes.map(function (n, i) { return "<li" + (target && i ? ' class="more"' : "") + ">" + n + "</li>"; }).join("") + "</ul>"; }
    return h + "</div>";
  }

  // Mount a sheet: tabs (one per D.sheets entry) and a grid that fits one screen on a wide display.
  function mountSheet(root) {
    var tabs = root.querySelector(".cs-tabs"), grid = root.querySelector(".cs-grid"), cur = D.sheets[0].id, timer = null;
    tabs.innerHTML = D.sheets.map(function (s) { return '<button type="button" data-s="' + s.id + '">' + esc(s.title) + "</button>"; }).join("");
    function fit() {
      root.style.fontSize = "";
      grid.style.columnCount = "";
      // A phone upright scrolls one readable column; on its side the cards become tiles on one screen.
      var w = window.innerWidth, h = window.innerHeight, upright = w <= 760 && h > w, sideways = h <= 560 && w > h;
      root.classList.toggle("scroll", upright);
      root.classList.toggle("compact", sideways);
      grid.style.gridTemplateColumns = "";
      if (root.hidden || upright) { return; }
      if (sideways) {
        // A phone on its side: every card a tile, all on one screen with no scrolling; a tap opens notes and code.
        var n = grid.children.length, rows = Math.max(1, Math.floor((grid.clientHeight - 8) / 56));
        grid.style.gridTemplateColumns = "repeat(" + Math.ceil(n / Math.min(rows, n)) + ", minmax(0, 1fr))";
        return;
      }
      var f = parseFloat(getComputedStyle(root).fontSize), cols = [6, 7, 8];
      function fits() { return grid.scrollWidth <= grid.clientWidth + 1; }
      // The largest font that fits in six, seven or eight columns.
      for (; f >= 8.5; f -= 0.25) {
        root.style.fontSize = f + "px";
        for (var i = 0; i < cols.length; i++) {
          grid.style.columnCount = cols[i];
          if (fits()) { return; }
        }
      }
    }
    function show(id) {
      var s = D.sheets.filter(function (x) { return x.id === id; })[0] || D.sheets[0];
      cur = s.id;
      grid.innerHTML = s.order.map(cardHtml).join("");
      grid.scrollTop = 0;
      tabs.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-s") === cur); });
      try { localStorage.setItem("coding.sheet", cur); } catch (e) { /* storage unavailable */ }
      fit();
    }
    tabs.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { show(b.getAttribute("data-s")); } });
    window.addEventListener("resize", function () { clearTimeout(timer); timer = setTimeout(fit, 120); });
    try { document.fonts.ready.then(fit); } catch (e) { /* no font loading API */ }
    var saved = null;
    try { saved = localStorage.getItem("coding.sheet"); } catch (e) { /* storage unavailable */ }
    show(saved || cur);
    return { fit: fit, show: show };
  }

  // The popup.
  var pop = null, popIn, popL, popR, items = [], at = 0, lastFocus = null;
  function pane(which) {
    popIn.classList.toggle("show-r", which === "r");
    pop.querySelectorAll(".pop-bar button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-pane") === which); });
  }
  function ensurePop() {
    if (pop) { return; }
    pop = document.createElement("div");
    pop.className = "pop";
    pop.hidden = true;
    pop.innerHTML = '<div class="pop-in" role="dialog" aria-modal="true" aria-label="Side by side"><div class="pop-bar"><button type="button" data-pane="l" class="on">Notes</button>' +
      '<button type="button" data-pane="r">Code</button></div><div class="pop-l"></div><div class="pop-r"></div><button type="button" class="pop-x">Close</button></div>';
    document.body.appendChild(pop);
    popIn = pop.querySelector(".pop-in");
    popL = pop.querySelector(".pop-l");
    popR = pop.querySelector(".pop-r");
    popL.addEventListener("click", function (e) {
      var b = e.target.closest(".pi");
      if (b) { pick(+b.getAttribute("data-i")); pane("r"); }
      if (e.target.closest(".pl-foot a")) { closePop(); }
    });
    pop.querySelector(".pop-bar").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { pane(b.getAttribute("data-pane")); } });
    pop.addEventListener("click", function (e) { if (e.target === pop) { closePop(); } });
    pop.querySelector(".pop-x").addEventListener("click", closePop);
  }
  function openPop(key, start) {
    if (key.indexOf("x:") === 0) { openRef(D.extra[key.slice(2)]); return; }
    var p = byId[key];
    if (!p) { return; }
    ensurePop();
    lastFocus = document.activeElement;
    function btn(i) {
      var it = items[i], sub = it.ex ? it.ex.i + " → " + it.ex.o : it.t || "";
      return '<button type="button" class="pi" data-i="' + i + '"><b>' + esc(it.n) + "</b><span>" + esc(sub) + "</span></button>";
    }
    var h = "<h2>" + esc(p.title) + '</h2><p class="spot">' + p.spot + "</p>" + (p.ex ? '<div class="ex">' + exLine(p.ex) + "</div>" : "");
    if (p.parts) {
      items = [{ kind: "End to end", n: "End to end", ex: p.ex, t: p.cx, code: p.tpl, fig: (p.figs || [])[0], hld: p.hld }]
        .concat(p.parts.map(function (c) { return { kind: "Component", n: c.n, t: c.t, code: c.code }; }))
        .concat(p.vars.map(function (v) { return { kind: "Variation", n: v.n, ex: v.ex, t: "What changes: " + v.t, code: v.code, st: v.st }; }));
      h += '<h4>What to remember</h4><ul class="nu">' + p.remember.map(function (r) { return li(md(r)); }).join("") + "</ul>" +
        "<h4>They will ask</h4>" + p.asks.map(function (a) { return '<details class="ask"><summary>' + md(a.q) + "</summary><p>" + md(a.a) + "</p></details>"; }).join("") +
        "<h4>The whole thing</h4>" + btn(0) +
        "<h4>Components</h4>" + p.parts.map(function (c, i) { return btn(1 + i); }).join("") +
        "<h4>Variations</h4>" + p.vars.map(function (v, i) { return btn(1 + p.parts.length + i); }).join("");
    } else {
      items = [{ kind: "The template", n: "Template", ex: p.ex, t: p.sheet.move ? "<b>The move.</b> " + p.sheet.move : p.sheet.spot, th: true, code: p.tpl, c: p.cx }]
        .concat(p.probs.map(function (q) { return { kind: "Classic problem", n: q.n, ex: q.ex, t: q.task, st: q.st, hint: q.hint, code: q.sol, c: q.c }; }))
        .concat(p.vars.map(function (v) { return { kind: "Variation", n: v.n, ex: v.ex, t: "What changes: " + v.t, st: v.st, code: v.code }; }));
      h += '<h4>Nuances</h4><ul class="nu">' + p.sheet.notes.map(li).join("") + li(esc(p.cx)) + "</ul>" +
        "<h4>The core</h4>" + btn(0) +
        "<h4>Classic problems</h4>" + p.probs.map(function (q, i) { return btn(1 + i); }).join("") +
        "<h4>Variations</h4>" + p.vars.map(function (v, i) { return btn(1 + p.probs.length + i); }).join("");
    }
    h += '<p class="pl-foot">Up and down arrows move; Esc closes. <a href="' + CS.pageBase + "#" + p.id + '"' + (/^https?:/.test(CS.pageBase) ? ' target="_blank" rel="noopener"' : "") + ">Open on the page</a></p>";
    popL.innerHTML = h;
    pop.hidden = false;
    document.body.style.overflow = "hidden";
    popL.scrollTop = 0;
    pick(start || 0);
    pane(start ? "r" : "l");
    pop.querySelector(".pop-x").focus();
  }
  // A reference card (Python tools, edge cases, traps): its notes on the left, its code, if any, on the right.
  function openRef(c) {
    if (!c) { return; }
    ensurePop();
    lastFocus = document.activeElement;
    items = [{ kind: "Reference", n: c.title, t: "", code: c.code || "" }];
    popL.innerHTML = "<h2>" + esc(c.title) + '</h2><ul class="nu">' + (c.notes || []).map(li).join("") + "</ul>";
    pop.hidden = false;
    document.body.style.overflow = "hidden";
    pick(0);
    pane("l");
    pop.querySelector(".pop-x").focus();
  }
  function pick(i) {
    at = Math.max(0, Math.min(items.length - 1, i));
    var it = items[at];
    var body = it.st ? stHtml(it.st) + (it.hint ? '<p class="cx"><b>Hint.</b> ' + esc(it.hint) + "</p>" : "")
      : '<p class="pr-t">' + (it.th ? it.t : md(it.t || "")) + "</p>";
    popR.innerHTML = '<div class="pr-kind">' + it.kind + "</div><h3>" + esc(it.n) + "</h3>" + (it.ex && !it.st ? '<div class="ex">' + exLine(it.ex) + "</div>" : "") + body +
      (it.hld ? '<ol class="nu">' + it.hld.map(function (x) { return li(md(x)); }).join("") + "</ol>" : "") +
      (it.fig ? figHtml(it.fig) : "") + (it.code ? "<pre><code>" + hl(it.code) + "</code></pre>" : "") + (it.c ? '<p class="cx">' + esc(it.c) + "</p>" : "");
    popL.querySelectorAll(".pi").forEach(function (b) { b.classList.toggle("on", +b.getAttribute("data-i") === at); });
    var on = popL.querySelector(".pi.on");
    if (on && on.scrollIntoView) { on.scrollIntoView({ block: "nearest" }); }
    popR.scrollTop = 0;
  }
  function closePop() {
    if (!pop || pop.hidden) { return; }
    pop.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* gone */ } }
    if (CS.onPopClose) { CS.onPopClose(); }
  }
  function popOpen() { return !!pop && !pop.hidden; }

  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-pop]");
    if (t && !t.closest(".pop")) { e.preventDefault(); openPop(t.getAttribute("data-pop"), +(t.getAttribute("data-at") || 0)); }
  });
  document.addEventListener("keydown", function (e) {
    if (popOpen()) {
      if (e.key === "Escape") { closePop(); e.preventDefault(); }
      else if (e.key === "ArrowDown") { pick(at + 1); e.preventDefault(); }
      else if (e.key === "ArrowUp") { pick(at - 1); e.preventDefault(); }
      return;
    }
    var t = e.target;
    if (e.key === "Enter" && t && t.getAttribute && t.getAttribute("data-pop")) { openPop(t.getAttribute("data-pop"), +(t.getAttribute("data-at") || 0)); }
  });

  function fullScreen() {
    // The whole document, so the popup stays visible over the sheet.
    try { if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); } else { document.exitFullscreen(); } } catch (e) { /* not supported */ }
  }

  var CS = window.CS = { data: D, byId: byId, esc: esc, md: md, hl: hl, exLine: exLine, stHtml: stHtml, figHtml: figHtml, cardHtml: cardHtml,
    mountSheet: mountSheet, openPop: openPop, closePop: closePop, popOpen: popOpen, fullScreen: fullScreen, pageBase: "", onPopClose: null };
}());
