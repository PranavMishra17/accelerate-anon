/* The MCQ bank's registry (see data/mcq/README.md). Loaded before data/mcq/week*.js. */
window.MCQ = { bank: {},
  add: function (key, list) { this.bank[key] = (this.bank[key] || []).concat(list); } };
