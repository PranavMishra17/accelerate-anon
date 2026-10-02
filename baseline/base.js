/* Baseline: the registry every field file writes into. Loaded before baseline/fields/*.js. */
window.BASELINE = { fields: [], byId: {}, quizzes: {},
  field: function (f) { this.fields.push(f); this.byId[f.id] = f; },
  /* baseline/quiz/<field>.js: multiple choice per topic, { topic id: [{ q, o, a, why, pair }] } */
  quiz: function (id, q) { this.quizzes[id] = Object.assign(this.quizzes[id] || {}, q); } };
