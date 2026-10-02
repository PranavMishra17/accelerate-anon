/* Baseline: the registry every field file writes into. Loaded before baseline/fields/*.js. */
window.BASELINE = { fields: [], byId: {}, quizzes: {},
  field: function (f) { this.fields.push(f); this.byId[f.id] = f; },
  /* baseline/quiz/<field>.js: multiple choice per topic, { topic id: [{ q, o, a, why, pair }] } */
  quiz: function (id, q) { this.quizzes[id] = Object.assign(this.quizzes[id] || {}, q); },
  /* baseline/res/<field>.js: the curated reading and videos per topic (site/res.js shape) */
  resources: {},
  res: function (id, r) { this.resources[id] = Object.assign(this.resources[id] || {}, r); } };
