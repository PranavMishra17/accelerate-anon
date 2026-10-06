/* Resources for one sub-pointer, drawn the same way on every page (tracker, loop pages, Baseline).
   A list of { kind, req, label, url, m, why, yt, book, src }:
     kind  "video" (a YouTube card: yt = { id, ch }), "read" (an outside article or doc),
           "keep" (your own references that don't count against the cap: an AI Engineering from
           Scratch lesson, a book chapter, the Alaap plan, a tutorial or roadmap; src names which)
     req   true for Required, false for Optional
     m     minutes; why one line on what you get; book text for a chapter with no link
   Res.render(list, { onClick(item), save }) returns an element, or null for an empty list. save, optional:
   { streams: [{ id, name }], def: stream id, onSave(item, id), savedIn(item) -> stream name or null } adds a
   small "For later" control to each linked item, to park a whole course in a stream's backlog.
   The cap (two articles and two videos per sub-pointer) is enforced by the checks, not here. */
(function () {
  "use strict";
  var SRC = { aieng: "Lesson", book: "Book", alaap: "Plan", tutorial: "Tutorial", roadmap: "Roadmap", course: "Course", site: "On this site" };
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) { n.className = cls; } if (text != null) { n.textContent = text; } return n; }
  function link(item, cls, onClick) {
    var a = el("a", cls);
    a.href = item.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    if (onClick) { a.addEventListener("click", function () { onClick(item); }); }
    return a;
  }
  function video(item, onClick) {
    var a = link(item, "res-video", onClick);
    var th = el("span", "res-thumb");
    var img = el("img"); img.loading = "lazy"; img.alt = ""; img.src = "https://i.ytimg.com/vi/" + item.yt.id + "/mqdefault.jpg";
    th.appendChild(img);
    if (item.m) { th.appendChild(el("span", "res-len", item.m + " min")); }
    a.appendChild(th);
    var tx = el("span", "res-vtext");
    tx.appendChild(el("span", "res-title", item.label));
    tx.appendChild(el("span", "res-ch", item.yt.ch || "YouTube"));
    if (item.why) { tx.appendChild(el("span", "res-why", item.why)); }
    a.appendChild(tx);
    return a;
  }
  function row(item, onClick) {
    var li = el("li", "res-row");
    if (item.kind === "keep" && SRC[item.src]) { li.appendChild(el("span", "res-tag", SRC[item.src])); }
    if (item.url) { var a = link(item, "res-link", onClick); a.textContent = item.label; li.appendChild(a); }
    else { li.appendChild(el("span", "res-link", item.book || item.label)); }
    if (item.m) { li.appendChild(el("span", "res-m", item.m + " min")); }
    if (item.why) { li.appendChild(el("span", "res-why", item.why)); }
    return li;
  }
  /* "For later": pick a stream (the step's own by default) and park the item in its backlog. */
  function saver(item, save) {
    var box = el("span", "res-save");
    function done(name) { box.innerHTML = ""; box.appendChild(el("span", "res-saved", "Saved for later: " + name)); }
    var was = save.savedIn(item);
    if (was) { done(was); return box; }
    var b = el("button", "res-save-b", "For later");
    b.type = "button";
    b.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      box.innerHTML = "";
      var sel = el("select", "res-save-s");
      save.streams.forEach(function (s) { var o = el("option", null, s.name); o.value = s.id; if (s.id === save.def) { o.selected = true; } sel.appendChild(o); });
      var ok = el("button", "res-save-b", "Save");
      ok.type = "button";
      ok.addEventListener("click", function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        save.onSave(item, sel.value);
        done(sel.options[sel.selectedIndex].textContent);
      });
      box.appendChild(sel); box.appendChild(ok);
    });
    box.appendChild(b);
    return box;
  }
  function savable(item) { return item.url && !(item.kind === "keep" && item.src === "site"); }
  /* A video's own bar: speed, open in a new tab, show in Explorer (tools/serve.py opens it), copy the file's path.
     Hotkeys act on the video last played, hovered or clicked, else the one on screen, never while typing:
     Space or K play and pause, Left and Right 5 s, J and L 10 s, Shift+> and Shift+< speed, 0 to 9 jump, F full screen, M mute. */
  var MEDIA_DIR = "", LOCAL = false, lastVideo = null, SPEEDS = [1, 1.25, 1.5, 1.75, 2];
  /* local-only */ MEDIA_DIR = "E:\\_Resume-Curator\\self-study\\media\\videos\\"; LOCAL = true; /* end local-only */
  function fileName(v) { return decodeURIComponent(v.getAttribute("src").split("/").pop()); }
  function onScreen() {
    var best = null;
    Array.prototype.forEach.call(document.querySelectorAll("video"), function (v) {
      var r = v.getBoundingClientRect();
      if (!best && r.bottom > 0 && r.top < window.innerHeight && r.width) { best = v; }
    });
    return best;
  }
  function videoBar(v) {
    var bar = el("div", "res-vbar"), btns = [];
    function mark() { btns.forEach(function (b) { b.classList.toggle("on", +b.dataset.r === v.playbackRate); }); }
    SPEEDS.forEach(function (r) {
      var b = el("button", "res-vb", r + "×"); b.type = "button"; b.dataset.r = r;
      b.addEventListener("click", function () { v.playbackRate = r; lastVideo = v; mark(); });
      btns.push(b); bar.appendChild(b);
    });
    v.addEventListener("ratechange", mark);
    var open = el("a", "res-vb", "Open in a new tab"); open.href = v.getAttribute("src"); open.target = "_blank"; open.rel = "noopener";
    if (LOCAL) {
      var show = el("button", "res-vb", "Show in Explorer"); show.type = "button";
      show.addEventListener("click", function () {
        fetch("/__reveal?f=" + encodeURIComponent(fileName(v))).then(function (r) { if (!r.ok) { throw 0; } show.textContent = "Opened"; },
          function () { show.textContent = "Start study.cmd to use this"; })
          .catch(function () { show.textContent = "Not found"; })
          .then(function () { setTimeout(function () { show.textContent = "Show in Explorer"; }, 2000); });
      });
      bar.appendChild(show);
    }
    var copy = el("button", "res-vb", "Copy file path"); copy.type = "button";
    copy.addEventListener("click", function () {
      var path = MEDIA_DIR + fileName(v);
      (navigator.clipboard ? navigator.clipboard.writeText(path) : Promise.reject()).then(function () { copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy file path"; }, 1500); },
        function () { window.prompt("Copy this path:", path); });
    });
    bar.insertBefore(open, show || null); bar.appendChild(copy);
    bar.appendChild(el("span", "res-keys", "Keys: Space, \u2190 \u2192 5 s, J L 10 s, < > speed, F, M"));
    ["play", "click", "mouseenter", "focus"].forEach(function (e) { v.addEventListener(e, function () { lastVideo = v; }); });
    mark();
    return bar;
  }
  document.addEventListener("keydown", function (e) {
    var v = lastVideo && document.contains(lastVideo) ? lastVideo : onScreen();
    if (!v || e.ctrlKey || e.metaKey || e.altKey) { return; }
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) { return; }
    var k = e.key, d = isFinite(v.duration) ? v.duration : 0, done = true;
    if (k === " " || k === "k" || k === "K") { if (v.paused) { v.play(); } else { v.pause(); } }
    else if (k === "ArrowRight") { v.currentTime = Math.min(d, v.currentTime + 5); }
    else if (k === "ArrowLeft") { v.currentTime = Math.max(0, v.currentTime - 5); }
    else if (k === "l" || k === "L") { v.currentTime = Math.min(d, v.currentTime + 10); }
    else if (k === "j" || k === "J") { v.currentTime = Math.max(0, v.currentTime - 10); }
    else if (k === ">") { v.playbackRate = Math.min(3, Math.round((v.playbackRate + 0.25) * 100) / 100); }
    else if (k === "<") { v.playbackRate = Math.max(0.5, Math.round((v.playbackRate - 0.25) * 100) / 100); }
    else if (/^[0-9]$/.test(k) && d) { v.currentTime = d * (+k) / 10; }
    else if (k === "f" || k === "F") { if (document.fullscreenElement) { document.exitFullscreen(); } else if (v.requestFullscreen) { v.requestFullscreen(); } }
    else if (k === "m" || k === "M") { v.muted = !v.muted; }
    else { done = false; }
    if (done) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  function enhanceVideo(v) { var wrap = el("div", "res-vwrap"); wrap.appendChild(v); wrap.appendChild(videoBar(v)); return wrap; }

  /* kind "clip": a local explainer video (media/videos, gitignored), played in place */
  function clip(item) {
    var f = el("figure", "res-clip");
    var v = document.createElement("video");
    v.controls = true; v.preload = "metadata"; v.src = item.url; v.playsInline = true;
    f.appendChild(enhanceVideo(v));
    var cap = el("figcaption", "res-clip-cap");
    cap.appendChild(el("span", "res-title", item.label));
    if (item.m) { cap.appendChild(el("span", "res-len-t", " " + item.m + " min")); }
    if (item.why) { cap.appendChild(el("span", "res-why", item.why)); }
    f.appendChild(cap);
    return f;
  }
  function group(title, items, onClick, save) {
    // Explainer clips live in gitignored media/videos, so the public site has no file to play: leave them out there.
    if (window.SITE_PUBLIC) { items = items.filter(function (x) { return x.kind !== "clip"; }); }
    if (!items.length) { return null; }
    var g = el("div", "res-group");
    g.appendChild(el("div", "res-label", title));
    items.filter(function (x) { return x.kind === "clip"; }).forEach(function (x) { g.appendChild(clip(x)); });
    var vids = items.filter(function (x) { return x.kind === "video" && x.yt && x.yt.id; });
    if (vids.length) {
      var vg = el("div", "res-videos");
      vids.forEach(function (x) {
        if (!save) { vg.appendChild(video(x, onClick)); return; }
        var cell = el("div", "res-vcell");
        cell.appendChild(video(x, onClick)); cell.appendChild(saver(x, save));
        vg.appendChild(cell);
      });
      g.appendChild(vg);
    }
    var rest = items.filter(function (x) { return vids.indexOf(x) < 0 && x.kind !== "clip"; });
    if (rest.length) {
      var ul = el("ul", "res-list");
      rest.forEach(function (x) { var li = row(x, onClick); if (save && savable(x)) { li.appendChild(saver(x, save)); } ul.appendChild(li); });
      g.appendChild(ul);
    }
    return g;
  }
  function render(list, opts) {
    list = (list || []).filter(function (x) { return x && (x.url || x.book); });
    if (!list.length) { return null; }
    opts = opts || {};
    var box = el("div", "res");
    [["Required", true], ["Optional", false]].forEach(function (p) {
      var g = group(p[0], list.filter(function (x) { return !!x.req === p[1]; }), opts.onClick, opts.save);
      if (g) { box.appendChild(g); }
    });
    return box;
  }
  window.Res = { render: render, enhanceVideo: enhanceVideo };
}());
