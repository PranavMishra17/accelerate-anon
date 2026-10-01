/* Baseline: the registry every field file writes into. Loaded before baseline/fields/*.js. */
window.BASELINE = { fields: [], byId: {},
  field: function (f) { this.fields.push(f); this.byId[f.id] = f; } };
