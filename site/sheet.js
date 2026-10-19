/* A step's cheat sheet and key terms, drawn the same way on every page (tracker and loop pages).
   Sheet.cheat(lines): a reference grid, each line split at its first colon into a head and the point.
   Sheet.terms(rows): term and hook on one line, the definition beneath; {group: "..."} rows label a group.
   Strings are trusted markup from data/sheets.js (<sub>, <sup>, <i>). */
(function () {
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (html != null) { n.innerHTML = html; }
    return n;
  }
  function cheat(lines) {
    var box = el("div", "sh-grid");
    lines.forEach(function (line) {
      var m = /^([^:<]{2,48}):\s+([\s\S]+)$/.exec(line);
      if (m) {
        box.appendChild(el("div", "sh-h", m[1]));
        box.appendChild(el("div", "sh-p", m[2]));
      } else {
        box.appendChild(el("div", "sh-h sh-blank", ""));
        box.appendChild(el("div", "sh-p", line));
      }
    });
    return box;
  }
  function terms(rows) {
    var box = el("div", "sh-terms");
    rows.forEach(function (r) {
      if (r.group) { box.appendChild(el("div", "sh-grp", r.group)); return; }
      var it = el("div", "sh-term");
      var top = el("div", "sh-top");
      top.appendChild(el("span", "sh-t", r.t));
      if (r.mem) { top.appendChild(el("span", "sh-mem", r.mem)); }
      it.appendChild(top);
      it.appendChild(el("div", "sh-d", r.d));
      box.appendChild(it);
    });
    return box;
  }
  window.Sheet = { cheat: cheat, terms: terms };
})();
