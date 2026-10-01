/* Check the MCQ bank:  node data/mcq/check.js [week1 ...]
   Shape, counts, words, and that every key names a real step in index.html. Exits 1 on any problem. */
"use strict";
const fs = require("fs"), path = require("path");
const HERE = __dirname, ROOT = path.resolve(HERE, "..", "..");
global.window = global;
require(path.join(HERE, "base.js"));
const want = process.argv.slice(2);
const files = fs.readdirSync(HERE).filter(f => /^week\d+\.js$/.test(f)).filter(f => !want.length || want.includes(f.replace(/\.js$/, "")));
files.forEach(f => require(path.join(HERE, f)));

/* The tracker's PLAN and WILDCARD, evaluated from index.html with unknown names stubbed. */
function planSteps() {
  const s = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const stub = function () { return {}; };
  const scope = new Proxy({}, {
    has: (t, k) => !(k in globalThis),
    get: (t, k) => (k === Symbol.unscopables ? undefined : new Proxy(stub, { get: () => ({}) }))
  });
  function grab(name, close) { const i = s.indexOf("var " + name + " = "), j = s.indexOf(close, i); return s.slice(s.indexOf("=", i) + 1, j + close.length - 1); }
  const ev = src => new Function("scope", "with (scope) { return (" + src + "); }")(scope);   // eslint-disable-line no-new-func
  const out = {};
  const add = x => { out[x.id] = { steps: (x.steps || []).length, study: (x.study || []).length }; };
  ev(grab("PLAN", "\n  ];")).forEach(w => w.sessions.forEach(add));
  ev(grab("WILDCARD", "\n  };")).sessions.forEach(add);
  return out;
}
const sessions = planSteps();
const BANNED = /—|\bsimply\b|\bjust\b|all of the above|none of the above/i;
const problems = [];
let total = 0;
Object.keys(MCQ.bank).forEach(key => {
  const mm = /^([a-z0-9]+):(s?)(\d+)$/.exec(key);
  if (!mm) { problems.push(key + ": key must look like w1a:0 or w1a:s0"); return; }
  const s = sessions[mm[1]], n = parseInt(mm[3], 10);
  if (!s) { problems.push(key + ": no session " + mm[1]); }
  else if (mm[2] ? n >= s.study : n >= s.steps) { problems.push(key + ": " + mm[1] + " has no " + (mm[2] ? "study item " : "step ") + n); }
  const list = MCQ.bank[key];
  if (list.length > 6) { problems.push(key + ": " + list.length + " questions (at most 6)"); }
  list.forEach((x, i) => {
    const id = key + "#" + i;
    total += 1;
    if (typeof x.q !== "string" || x.q.length < 12) { problems.push(id + ": question missing"); }
    if (!Array.isArray(x.o) || x.o.length !== 5) { problems.push(id + ": wants exactly 5 options"); }
    else {
      if (new Set(x.o.map(o => String(o).trim().toLowerCase())).size !== 5) { problems.push(id + ": duplicate options"); }
      x.o.forEach((o, k) => { if (typeof o !== "string" || !o.trim()) { problems.push(id + ": option " + k + " empty"); } });
    }
    if (!(Number.isInteger(x.a) && x.a >= 0 && x.a < 5)) { problems.push(id + ": a must be 0 to 4"); }
    if (typeof x.why !== "string" || x.why.length < 12) { problems.push(id + ": why missing"); }
    if (x.pair != null && !/^[a-z0-9-]+$/.test(x.pair)) { problems.push(id + ": pair must be kebab-case"); }
    [x.q, x.why].concat(x.o || []).forEach(t => { const b = String(t || "").match(BANNED); if (b) { problems.push(id + ": uses " + JSON.stringify(b[0])); } });
  });
});
/* answers should not all sit in one position */
const pos = [0, 0, 0, 0, 0];
Object.values(MCQ.bank).forEach(l => l.forEach(x => { if (Number.isInteger(x.a)) { pos[x.a] += 1; } }));
if (total >= 20 && Math.max.apply(null, pos) > total * 0.4) { problems.push("answer positions are lopsided: " + pos.join(", ")); }
console.log(Object.keys(MCQ.bank).length + " steps, " + total + " questions; correct answer positions " + pos.join("/"));
if (problems.length) { console.log("\n" + problems.join("\n")); process.exit(1); }
