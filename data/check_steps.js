/* Every milestone step carries outside learning (a video, an outside article, or a book chapter) in
   data/reading.js, and every milestone session has at least one YouTube video and one outside article in its
   steps' READING[stepKey].res, the way the canonical sessions have since 3 October. A new session
   without them fails the rebuild instead of reaching Pranav. Run: node data/check_steps.js (in tools/rebuild.py). */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

// PLAN is a literal inside the tracker's IIFE: cut it out by bracket matching and evaluate it alone.
const start = html.indexOf("var PLAN = [");
if (start < 0) { console.error("check_steps: var PLAN not found in index.html"); process.exit(1); }
let i = html.indexOf("[", start), depth = 0, inStr = null, end = -1;
for (; i < html.length; i++) {
  const c = html[i];
  if (inStr) { if (c === "\\") { i++; } else if (c === inStr) { inStr = null; } continue; }
  if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
  if (c === "[" || c === "{") { depth++; }
  else if (c === "]" || c === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
}
const names = new Proxy({}, { has: () => true, get: (t, k) => (k === Symbol.unscopables ? undefined : new Proxy(function () {}, { get: () => "" })) });
const PLAN = new Function("scope", "with (scope) { return " + html.slice(html.indexOf("[", start), end) + "; }")(names);
const READING = new Function(fs.readFileSync(path.join(ROOT, "data", "reading.js"), "utf8") + ";return READING;")();

const missing = [];
let steps = 0;
const outside = function (r) { return r.kind === "video" || (r.kind === "read" && /^https?:/.test(r.url || "")); };
PLAN.forEach(function (week) {
  (week.sessions || []).forEach(function (s) {
    // Milestone sessions only (w1a, w5d): wildcard sessions (wc*) follow their loop page; requeue revisits earlier steps.
    if (!/^w\d/.test(s.id) || s.track === "Requeue") { return; }
    let video = false, article = false;
    (s.steps || []).forEach(function (st, n) {
      steps++;
      const rd = READING[s.id + ":" + n] || {}, res = rd.res || [];
      const books = (rd.read || []).some(function (r) { return r.book || /^https?:/.test(r.url || ""); });
      if (res.some(function (r) { return r.kind === "video"; })) { video = true; }
      if (res.some(function (r) { return r.kind === "read" && /^https?:/.test(r.url || ""); })) { article = true; }
      if (!res.some(outside) && !books) { missing.push(s.id + ":" + n + " " + (st.t || "").slice(0, 60) + " [no outside resource]"); }
    });
    if (!video) { missing.push(s.id + " " + s.name + " [no video in any step]"); }
    if (!article) { missing.push(s.id + " " + s.name + " [no outside article in any step]"); }
  });
});
if (missing.length) {
  console.error("check_steps: " + missing.length + " gap(s) in outside learning. Add READING[stepKey].res in data/reading.js:" +
    " two YouTube videos (Required, Optional; check each with python tools/yt.py) and one or two articles, opened first.\n  " + missing.join("\n  "));
  process.exit(1);
}
console.log("check_steps: " + steps + " milestone steps, each with outside learning; every session has a video and an article");
