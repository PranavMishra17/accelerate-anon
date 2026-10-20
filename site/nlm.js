/* NotebookLM sources for a session, for the one copy button at the top of a session.
   Every outside link the session names (its steps, study items and data/reading.js), then every
   session in the plan or the wildcard that covers at least half of this session's system design
   techniques, and every Baseline topic that points at one of them: so the caching session also
   carries the Mercor caching sessions and Baseline's caching reading. One per page (NotebookLM fetches the whole page, so
   #anchors would add it twice); localhost skipped. Used by the tracker and, through
   interviews/extract.js, the loop pages.
   NLM.links(session, allSessions, readingOf(key), baselineTopics) -> [url] */
(function (root) {
  function parts(s) {
    var out = [];
    (s.study || []).forEach(function (it, i) { out.push({ it: it, key: s.id + ":s" + i }); });
    (s.steps || []).forEach(function (it, i) { out.push({ it: it, key: s.id + ":" + i }); });
    return out;
  }
  function techs(list) {
    return (list || []).filter(function (q) { return q && q.p && q.t; }).map(function (q) { return q.p + "/" + q.t; });
  }
  function links(s, all, readingOf, topics) {
    var urls = [], seen = {};
    function walk(v) {
      if (typeof v === "string") {
        var u = v.replace(/#.*$/, ""), id = u.replace(/\/$/, "");
        if (/^https?:\/\//.test(u) && !/^https?:\/\/(localhost|127\.|\[::1\])/.test(u) && !seen[id]) { seen[id] = 1; urls.push(u); }
      } else if (v && typeof v === "object") {
        for (var k in v) { if (Object.prototype.hasOwnProperty.call(v, k)) { walk(v[k]); } }
      }
    }
    var mine = {};
    parts(s).forEach(function (p) {
      var r = readingOf(p.key) || {};
      walk(p.it); walk(r);
      techs(p.it.sd).concat(techs(r.sd)).forEach(function (t) { mine[t] = 1; });
    });
    var nMine = Object.keys(mine).length;
    (all || []).forEach(function (o) {
      if (o.id === s.id) { return; }
      /* the same subject: it covers at least half of this session's techniques, so a design
         session that touches ten techniques does not pull in every session that names one */
      var ps = parts(o), theirs = {}, shared = 0;
      ps.forEach(function (p) { var r = readingOf(p.key) || {}; techs(p.it.sd).concat(techs(r.sd)).forEach(function (t) { theirs[t] = 1; }); });
      for (var t in theirs) { if (mine[t]) { shared++; } }
      if (shared && shared * 2 >= nMine) { ps.forEach(function (p) { walk(p.it); walk(readingOf(p.key)); }); }
    });
    (topics || []).forEach(function (t) {
      var hit = (t.see || []).some(function (x) {
        var m = /#\/patterns\/([^/?#]+)\/([^/?#]+)/.exec(x.href || "");
        return m && mine[decodeURIComponent(m[1]) + "/" + decodeURIComponent(m[2])];
      });
      if (hit) { walk(t.read); }
    });
    return urls;
  }
  /* every Baseline topic, flat, from window.BASELINE once its fields are loaded */
  function baselineTopics(B) {
    var out = [];
    ((B && B.fields) || []).forEach(function (f) { (f.clusters || []).forEach(function (c) { (c.topics || []).forEach(function (t) { out.push(t); }); }); });
    return out;
  }
  root.NLM = { links: links, baselineTopics: baselineTopics };
})(typeof window !== "undefined" ? window : globalThis);
