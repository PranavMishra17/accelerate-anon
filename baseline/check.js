/* Check every Baseline field file:  node baseline/check.js [field ...]
   Shape, counts, links, words and the map's geometry. Exits 1 on any problem. */
"use strict";
const fs = require("fs"), path = require("path");
const HERE = __dirname, ROOT = path.dirname(HERE);
global.window = global;
require(path.join(HERE, "base.js"));
const want = process.argv.slice(2);
const files = fs.readdirSync(path.join(HERE, "fields")).filter(f => f.endsWith(".js"))
  .filter(f => !want.length || want.includes(f.replace(/\.js$/, "")));
const problems = [];
const bad = (id, msg) => problems.push(id + ": " + msg);
const BANNED = /—|\bsimply\b|\bjust\b|\bseamless(ly)?\b|\brobust\b|\bpowerful\b|\bcomprehensive\b|\bunlock\b|\bleverage(s|d)?\b|\bdelve\b|\bgame-?changer\b|Pranav/i;
const FIELD_IDS = ["overview", "systems", "distributed", "data", "backend", "frontend", "mobile", "cloud", "devops",
  "ml", "ai", "inference", "audio", "nlp", "graphics", "games"];

function text(id, where, s) {
  if (typeof s !== "string" || !s.trim()) { bad(id, where + " is empty"); return; }
  const m = s.match(BANNED);
  if (m) { bad(id, where + " uses " + JSON.stringify(m[0])); }
}
function readList(id, where, list) {
  (list || []).forEach((r, i) => {
    if (!/^https:\/\/[^\s]+$/.test(r.url || "")) { bad(id, where + " read " + i + " has no https url"); }
    text(id, where + " read " + i + " label", r.label);
    if (r.m != null && !(r.m > 0 && r.m <= 600)) { bad(id, where + " read " + i + " minutes " + r.m); }
  });
}
function see(id, where, list) {
  (list || []).forEach(s => {
    const file = decodeURIComponent(String(s.href).split("#")[0]);
    if (!/^https?:/.test(s.href) && file && !fs.existsSync(path.join(ROOT, file))) { bad(id, where + " links a missing page " + s.href); }
  });
}

files.forEach(f => require(path.join(HERE, "fields", f)));
BASELINE.fields.forEach(F => {
  const id = F.id;
  if (!FIELD_IDS.includes(id)) { bad(id, "unknown field id"); }
  ["name", "lede"].forEach(k => text(id, k, F[k]));
  if (!/^#[0-9A-Fa-f]{6}$/.test(F.ink || "") || !/^#[0-9A-Fa-f]{6}$/.test(F.inkDark || "")) { bad(id, "ink and inkDark must be #rrggbb"); }
  (F.overview || []).forEach((p, i) => text(id, "overview " + i, p));
  readList(id, "start", F.start);
  see(id, "see", F.see);
  const topics = [];
  if (id !== "overview") {
    const cs = F.clusters || [];
    if (cs.length < 3 || cs.length > 5) { bad(id, cs.length + " clusters (want 3 to 5)"); }
    cs.forEach(c => { text(id, "cluster name", c.name); (c.topics || []).forEach(t => topics.push(t)); });
    if (topics.length < 12 || topics.length > 20) { bad(id, topics.length + " topics (want 12 to 20)"); }
    if (!(F.start || []).length) { bad(id, "no Start here reading"); }
    if ((F.overview || []).length < 2) { bad(id, "overview wants 2 to 3 paragraphs"); }
  }
  const seen = {};
  topics.forEach(t => {
    const tid = id + "/" + t.id;
    if (!/^[a-z0-9-]+$/.test(t.id || "")) { bad(tid, "topic id must be kebab-case"); }
    if (seen[t.id]) { bad(tid, "duplicate topic id"); } seen[t.id] = true;
    const wc = s => String(s || "").split(/\s+/).filter(Boolean).length;
    text(tid, "name", t.name); text(tid, "line", t.line); text(tid, "example", t.example); text(tid, "nuance", t.nuance);
    if (t.where) { bad(tid, "where is replaced by uses"); }
    if (wc(t.line) > 16) { bad(tid, "line over 16 words"); }
    const body = (t.body || []);
    if (body.length < 1 || body.length > 2) { bad(tid, "body wants 1 or 2 paragraphs"); }
    body.forEach((p, i) => text(tid, "body " + i, p));
    if (wc(body.join(" ")) < 40 || wc(body.join(" ")) > 150) { bad(tid, "body is " + wc(body.join(" ")) + " words (want 40 to 150)"); }
    const uses = t.uses || [];
    if (uses.length < 2 || uses.length > 4) { bad(tid, uses.length + " uses (want 2 to 4)"); }
    uses.forEach((u, i) => {
      text(tid, "use " + i, u);
      if (!/^\*\*[^*]+\*\*: /.test(u || "")) { bad(tid, "use " + i + " must start **Name**: "); }
      if (wc(u) > 35) { bad(tid, "use " + i + " is " + wc(u) + " words (at most 35)"); }
    });
    if (wc(t.example) < 20 || wc(t.example) > 90) { bad(tid, "example is " + wc(t.example) + " words (want 20 to 90)"); }
    if (wc(t.nuance) > 60) { bad(tid, "nuance is " + wc(t.nuance) + " words (at most 60)"); }
    readList(tid, "topic", t.read);
    see(tid, "see", t.see);
  });
  /* the map: a grid of boxes, no arrow through a box, at most 3 columns */
  const d = F.diagram;
  if (!d || !(d.nodes || []).length) { bad(id, "no map"); return; }
  const most = id === "overview" ? 16 : 14;   /* the overview holds a node per field */
  if (d.nodes.length < 5 || d.nodes.length > most) { bad(id, d.nodes.length + " map nodes (want 5 to " + most + ")"); }
  text(id, "map caption", d.cap);
  if (!/^\*\*/.test(d.cap || "")) { bad(id, "map caption must lead with a **bold sentence**"); }
  const at = {}, cell = {};
  d.nodes.forEach(n => {
    if (n.col > 2) { bad(id, "map node " + n.id + " in column " + n.col + " (at most 3 columns)"); }
    const k = n.col + "," + n.row;
    if (cell[k]) { bad(id, "map nodes " + cell[k] + " and " + n.id + " share a cell"); }
    cell[k] = n.id; at[n.id] = n;
    text(id, "map label " + n.id, n.label);
    if ((n.label || "").length > 22) { bad(id, "map label too long: " + n.label); }
    if ((n.sub || "").length > 26) { bad(id, "map sub too long: " + n.sub); }
  });
  (d.edges || []).forEach(e => {
    const a = at[e[0]], b = at[e[1]];
    if (!a || !b) { bad(id, "map edge " + e.join(">") + " names a missing node"); return; }
    if (a.col === b.col && Math.abs(a.row - b.row) !== 1) { bad(id, "map edge " + e.join(">") + " runs through a box (same column, not adjacent)"); }
    if (a.col !== b.col && Math.abs(a.col - b.col) !== 1) { bad(id, "map edge " + e.join(">") + " skips a column"); }
    if (e[2] && e[2].length > 18) { bad(id, "map edge label too long: " + e[2]); }
  });
  console.log((id + "            ").slice(0, 12) + topics.length + " topics, " + d.nodes.length + " map nodes");
});
if (problems.length) { console.log("\n" + problems.join("\n")); process.exit(1); }
console.log("\nBaseline: " + BASELINE.fields.length + " fields checked.");
