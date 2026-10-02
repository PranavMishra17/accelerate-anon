/* node baseline/quiz/check.js [field ...]
   Checks the multiple-choice files in baseline/quiz/: every question belongs to a real topic,
   2 or 3 per topic, exactly 5 options, one correct, a why, no em or en dashes, the correct answers
   spread across positions. With field ids, checks only those and lists topics still without questions. */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
global.window = global;
eval(fs.readFileSync(path.join(ROOT, "base.js"), "utf8"));
for (const f of fs.readdirSync(path.join(ROOT, "fields"))) { eval(fs.readFileSync(path.join(ROOT, "fields", f), "utf8")); }
const B = global.BASELINE;
B.quizzes = B.quizzes || {};
B.quiz = B.quiz || function (id, q) { B.quizzes[id] = Object.assign(B.quizzes[id] || {}, q); };
const only = process.argv.slice(2);
const files = fs.readdirSync(__dirname).filter(f => /^[a-z]+\.js$/.test(f) && f !== "check.js");
for (const f of files) { eval(fs.readFileSync(path.join(__dirname, f), "utf8")); }
let bad = 0;
const err = m => { bad++; console.log("  - " + m); };
for (const f of B.fields) {
  if (only.length && only.indexOf(f.id) < 0) { continue; }
  const topics = (f.clusters || []).reduce((a, c) => a.concat(c.topics), []);
  if (!topics.length) { continue; }
  const Q = B.quizzes[f.id] || {};
  const ids = new Set(topics.map(t => t.id));
  const pos = [0, 0, 0, 0, 0];
  console.log(f.id + ": " + Object.keys(Q).length + " of " + topics.length + " topics have questions");
  for (const k of Object.keys(Q)) {
    if (!ids.has(k)) { err(f.id + "/" + k + ": no such topic"); continue; }
    const qs = Q[k];
    if (!Array.isArray(qs) || qs.length < 2 || qs.length > 3) { err(f.id + "/" + k + ": " + (qs && qs.length) + " questions (want 2 or 3)"); }
    (qs || []).forEach((q, i) => {
      const at = f.id + "/" + k + " #" + i;
      if (!q.q) { err(at + ": no question"); }
      if (!Array.isArray(q.o) || q.o.length !== 5) { err(at + ": needs exactly 5 options"); }
      else if (new Set(q.o).size !== 5) { err(at + ": duplicate options"); }
      if (!Number.isInteger(q.a) || q.a < 0 || q.a > 4) { err(at + ": bad answer index"); } else { pos[q.a]++; }
      if (!q.why) { err(at + ": no why"); }
      const text = [q.q, q.why].concat(q.o || []).join(" ");
      if (/[—–]/.test(text)) { err(at + ": em or en dash"); }
      if (/all of the above|none of the above/i.test(text)) { err(at + ": 'all/none of the above'"); }
    });
  }
  const n = pos.reduce((a, b) => a + b, 0);
  if (n && Math.max.apply(null, pos) > 0.4 * n) { err(f.id + ": correct answers cluster on one position " + JSON.stringify(pos)); }
  if (only.length) { topics.filter(t => !Q[t.id]).forEach(t => err(f.id + "/" + t.id + ": no questions yet")); }
}
console.log(bad ? bad + " problems" : "Baseline quizzes: all good");
process.exit(bad ? 1 : 0);
