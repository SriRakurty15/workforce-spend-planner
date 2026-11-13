// Shared validation for the two bulk-entry paths: pasted CSV/TSV text and uploaded Excel.
// Collects *every* problem per row instead of throwing on the first, so the UI can show
// a full preview (valid / error / duplicate / will-overwrite) before anything is written.

const PERIODS = ["Q1", "Q2", "Q3", "Q4"];
const CATEGORIES = ["T&E", "Morale", "Training"];
const LOCATIONS = ["US", "EU", "India", "ROW"];

const SCHEMAS = {
  targets: {
    key: ["fiscalYear", "period", "category"],
    fields: {
      fiscalYear: { type: "int", min: 2000, max: 2100 },
      period: { type: "enum", values: PERIODS },
      category: { type: "enum", values: CATEGORIES },
      inputTarget: { type: "number", min: 0 },
      holdbackAmount: { type: "number", min: 0 },
      outputActual: { type: "number", min: 0 },
    },
  },
  cph: {
    key: ["fiscalYear", "location"],
    fields: {
      fiscalYear: { type: "int", min: 2000, max: 2100 },
      location: { type: "enum", values: LOCATIONS },
      morale: { type: "number", min: 0 },
      training: { type: "number", min: 0 },
      computer: { type: "number", min: 0 },
      te: { type: "number", min: 0 },
    },
  },
};

function parseDelimited(text) {
  const lines = text.trim().split(/\r?\n/);
  const delim = lines[0].includes("\t") ? "\t" : ",";
  const header = lines[0].split(delim).map((h) => h.trim());
  return lines.slice(1).map((l) => Object.fromEntries(l.split(delim).map((v, i) => [header[i], v.trim()])));
}

function validateField(name, raw, rule) {
  if (raw === undefined || raw === "") return { error: `${name} is required` };
  if (rule.type === "enum") {
    return rule.values.includes(raw) ? { value: raw } : { error: `${name} must be one of ${rule.values.join(", ")}` };
  }
  const n = Number(raw);
  if (Number.isNaN(n)) return { error: `${name} must be a number` };
  if (rule.type === "int" && !Number.isInteger(n)) return { error: `${name} must be a whole number` };
  if (rule.min !== undefined && n < rule.min) return { error: `${name} must be >= ${rule.min}` };
  if (rule.max !== undefined && n > rule.max) return { error: `${name} must be <= ${rule.max}` };
  return { value: n };
}

/** @returns {{ rows: {status, data, errors}[], summary }} */
function validateRows(dataset, rawRows, existingKeys = new Set()) {
  const schema = SCHEMAS[dataset];
  const seen = new Set();
  const rows = rawRows.map((raw) => {
    const data = {};
    const errors = [];
    for (const [name, rule] of Object.entries(schema.fields)) {
      const r = validateField(name, raw[name], rule);
      r.error ? errors.push(r.error) : (data[name] = r.value);
    }
    const key = schema.key.map((k) => data[k]).join("|");
    let status = "valid";
    if (errors.length) status = "error";
    else if (seen.has(key)) { status = "duplicate"; errors.push("duplicate row in upload"); }
    else if (existingKeys.has(key)) status = "will-overwrite";
    seen.add(key);
    return { status, data, errors };
  });
  const summary = rows.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] || 0) + 1 }), {});
  return { rows, summary };
}

module.exports = { parseDelimited, validateRows, SCHEMAS };
