/* Resources for one sub-pointer, drawn the same way on every page (tracker, loop pages, Baseline).
   A list of { kind, req, label, url, m, why, yt, book, src }:
     kind  "video" (a YouTube card: yt = { id, ch }), "read" (an outside article or doc),
           "keep" (your own references that don't count against the cap: an AI Engineering from
           Scratch lesson, a book chapter, the Alaap plan, a tutorial or roadmap; src names which)
     req   true for Required, false for Optional
     m     minutes; why one line on what you get; book text for a chapter with no link
   Res.render(list, { onClick(item) }) returns an element, or null for an empty list.
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
  function group(title, items, onClick) {
    if (!items.length) { return null; }
    var g = el("div", "res-group");
    g.appendChild(el("div", "res-label", title));
    var vids = items.filter(function (x) { return x.kind === "video" && x.yt && x.yt.id; });
    if (vids.length) {
      var vg = el("div", "res-videos");
      vids.forEach(function (x) { vg.appendChild(video(x, onClick)); });
      g.appendChild(vg);
    }
    var rest = items.filter(function (x) { return vids.indexOf(x) < 0; });
    if (rest.length) {
      var ul = el("ul", "res-list");
      rest.forEach(function (x) { ul.appendChild(row(x, onClick)); });
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
      var g = group(p[0], list.filter(function (x) { return !!x.req === p[1]; }), opts.onClick);
      if (g) { box.appendChild(g); }
    });
    return box;
  }
  window.Res = { render: render };
}());
