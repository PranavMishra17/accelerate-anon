/* Every tracker step and study item with all the links it shows today, as JSON, for the resource pass.
   node tools/links.js [session ids, comma separated]    (default: every planned and wildcard session)
   Per sub-pointer: key (the progress key, as in data/reading.js), session, title, what it is (d or say),
   where (its own task link), links (step links, study res), do (study actions with links), and from
   data/reading.js: read, aieng, res (the curated list, when done). */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
function grab(decl) {
  const i = src.indexOf(decl);
  if (i < 0) { throw new Error("not found: " + decl); }
  let j = src.indexOf(decl.endsWith("[") ? "[" : "{", i), d = 0, q = null, k = j;
  for (; k < src.length; k++) {
    const c = src[k];
    if (q) { if (c === "\\") { k++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "{" || c === "[") d++;
    else if (c === "}" || c === "]") { d--; if (d === 0) break; }
  }
  return src.slice(j, k + 1);
}
function bk(t) { return { book: t }; }
function ddia(t) { return { book: "DDIA, 2e: " + t }; }
const L = eval("(" + grab("var L = {") + ")");
const R = eval("(" + grab("var R = {") + ")");
const PLAN = eval("(" + grab("var PLAN = [") + ")");
const WILDCARD = eval("(" + grab("var WILDCARD = {") + ")");
const STUDY = eval("(" + grab("var STUDY = {") + ")");
const RD = new Function(fs.readFileSync(path.join(ROOT, "data", "reading.js"), "utf8") + ";return READING;")();
const only = process.argv[2] ? process.argv[2].split(",") : null;
const sessions = [];
PLAN.forEach(w => w.sessions.forEach(s => sessions.push(s)));
WILDCARD.sessions.forEach(s => sessions.push(s));
const out = [];
const urlOf = r => r && (r.url ? { label: r.label || r.url, url: r.url, m: r.m } : r.book ? { book: r.book, m: r.m } : null);
for (const s of sessions) {
  if (only && only.indexOf(s.id) < 0) { continue; }
  const study = s.study || (STUDY[s.id] || {}).study || STUDY[s.id] || [];
  (Array.isArray(study) ? study : []).forEach((it, i) => {
    const k = s.id + ":s" + i, x = RD[k] || {};
    out.push({ key: k, session: s.id, sname: s.name, kind: "study", title: it.t, what: it.say || "",
      links: (it.res || []).map(urlOf).filter(Boolean), do: (it.do || []).filter(d => d.url).map(d => ({ a: d.a, url: d.url, m: d.m })),
      read: x.read || [], aieng: x.aieng || [], res: x.res || null });
  });
  (s.steps || []).forEach((st, i) => {
    const k = s.id + ":" + i, x = RD[k] || {};
    out.push({ key: k, session: s.id, sname: s.name, kind: "step", title: st.t, what: st.d || "",
      where: st.url ? { label: st.where || st.url, url: st.url } : null,
      links: (st.links || []).map(urlOf).filter(Boolean), read: x.read || [], aieng: x.aieng || [], res: x.res || null });
  });
}
process.stdout.write(JSON.stringify(out, null, 1));
