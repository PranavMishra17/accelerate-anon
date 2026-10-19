/* A step's cheat sheet and key terms, drawn the same way on every page (tracker and loop pages).
   Sheet.cheat(sheet): the sheet's `vis` blocks if it has them, else its `cheat` lines as a grid.
     vis blocks: {rule}, {flow: [steps], note}, {ladder: [[value, label, note]], note},
                 {calc: [[expression, result]]}, {vs: {cols: [..], rows: [[label, a, b, ..]]}},
                 {split: [[title, [items]], [title, [items]]]}, {code: "text", pins: [[line, note]]},
                 {lanes: [[name, [[label, kind, grow]]]], note}
   Sheet.terms(rows): each term as a small note: the term, its hook, the definition.
   Strings are trusted markup from data/sheets.js (<sub>, <sup>, <i>, <b>). */
(function () {
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (html != null) { n.innerHTML = html; }
    return n;
  }
  function lines(list) {
    var box = el("div", "sh-grid");
    list.forEach(function (line) {
      var m = /^([^:<]{2,48}):\s+([\s\S]+)$/.exec(line);
      box.appendChild(el("div", "sh-h" + (m ? "" : " sh-blank"), m ? m[1] : ""));
      box.appendChild(el("div", "sh-p", m ? m[2] : line));
    });
    return box;
  }
  var DRAW = {
    rule: function (b) { return el("p", "sv-rule", b.rule); },
    flow: function (b) {
      var f = el("ol", "sv-flow");
      f.style.gridTemplateColumns = "repeat(" + b.flow.length + ", minmax(0, 1fr))";
      b.flow.forEach(function (s) { f.appendChild(el("li", "sv-step", s)); });
      return f;
    },
    ladder: function (b) {
      var l = el("div", "sv-ladder");
      b.ladder.forEach(function (r) {
        var row = el("div", "sv-rung");
        row.appendChild(el("span", "sv-val", r[0]));
        row.appendChild(el("span", "sv-lab", r[1]));
        row.appendChild(el("span", "sv-note", r[2] || ""));
        l.appendChild(row);
      });
      return l;
    },
    calc: function (b) {
      var c = el("div", "sv-calc");
      b.calc.forEach(function (r) {
        c.appendChild(el("span", "sv-expr", r[0]));
        c.appendChild(el("span", "sv-eq", "="));
        c.appendChild(el("span", "sv-res", r[1]));
      });
      return c;
    },
    vs: function (b) {
      var t = el("table", "sv-vs"), hr = el("tr");
      hr.appendChild(el("th", "", ""));
      b.vs.cols.forEach(function (c) { hr.appendChild(el("th", "", c)); });
      t.appendChild(hr);
      b.vs.rows.forEach(function (r) {
        var tr = el("tr");
        r.forEach(function (c, i) {
          if (!i) { tr.appendChild(el("th", "", c)); return; }
          var m = /^(yes|no)(?![a-z])[:,]?\s*(.*)$/i.exec(c);
          tr.appendChild(el("td", "", m ? '<span class="sv-' + (m[1].toLowerCase() === "yes" ? "y" : "n") + '">' + (m[1].toLowerCase() === "yes" ? "✓" : "✕") + "</span>" + (m[2] ? '<span class="sv-why">' + m[2] + "</span>" : "") : c));
        });
        t.appendChild(tr);
      });
      return t;
    },
    split: function (b) {
      var s = el("div", "sv-split");
      b.split.forEach(function (col, i) {
        var c = el("div", "sv-col " + (i ? "sv-bad" : "sv-good"));
        c.appendChild(el("div", "sv-colh", col[0]));
        var ul = el("ul");
        col[1].forEach(function (it) { ul.appendChild(el("li", "", it)); });
        c.appendChild(ul);
        s.appendChild(c);
      });
      return s;
    },
    code: function (b) {
      var w = el("div", "sv-code"), pre = el("pre"), pins = {};
      (b.pins || []).forEach(function (p, i) { pins[p[0]] = i + 1; });
      b.code.split("\n").forEach(function (ln, i) {
        var row = el("span", "sv-ln");
        row.appendChild(document.createTextNode(ln));
        if (pins[i + 1]) { row.appendChild(el("span", "sv-pin", String(pins[i + 1]))); }
        pre.appendChild(row); pre.appendChild(document.createTextNode("\n"));
      });
      w.appendChild(pre);
      var notes = el("div", "sv-pins");
      (b.pins || []).forEach(function (p, i) {
        notes.appendChild(el("span", "sv-pin", String(i + 1)));
        notes.appendChild(el("span", "", p[1]));
      });
      w.appendChild(notes);
      return w;
    },
    parts: function (b) {
      var p = el("div", "sv-parts");
      b.parts.forEach(function (x) {
        var c = el("div", "sv-part" + (x[2] ? " sv-hot" : ""));
        c.appendChild(el("b", "", x[0]));
        if (x[1]) { c.appendChild(el("span", "", x[1])); }
        p.appendChild(c);
      });
      return p;
    },
    lanes: function (b) {
      var l = el("div", "sv-lanes");
      b.lanes.forEach(function (lane) {
        l.appendChild(el("span", "sv-lname", lane[0]));
        var bar = el("div", "sv-bar");
        lane[1].forEach(function (seg) {
          var s = el("span", "sv-seg sv-" + (seg[1] || "plain"), seg[0]);
          if (seg[2]) { s.style.flex = seg[2]; }
          if (seg[3]) { s.style.marginLeft = seg[3]; }
          bar.appendChild(s);
        });
        l.appendChild(bar);
      });
      return l;
    }
  };
  function cheat(sh) {
    if (!sh.vis || !sh.vis.length) { return lines(sh.cheat || []); }
    var box = el("div", "sv");
    sh.vis.forEach(function (b) {
      var kind = Object.keys(DRAW).filter(function (k) { return k in b; })[0];
      if (!kind) { return; }
      var blk = el("div", "sv-blk");
      if (b.title) { blk.appendChild(el("div", "sv-title", b.title)); }
      blk.appendChild(DRAW[kind](b));
      if (b.note) { blk.appendChild(el("p", "sv-foot", b.note)); }
      box.appendChild(blk);
    });
    return box;
  }
  function terms(rows) {
    var box = el("div", "sh-notes");
    rows.forEach(function (r) {
      if (r.group) { box.appendChild(el("div", "sh-grp", r.group)); return; }
      var n = el("div", "sh-note");
      n.appendChild(el("span", "sh-tag", r.t));
      if (r.mem) { n.appendChild(el("p", "sh-mem", r.mem)); }
      n.appendChild(el("p", "sh-d", r.d));
      box.appendChild(n);
    });
    return box;
  }
  window.Sheet = { cheat: cheat, terms: terms };
})();
