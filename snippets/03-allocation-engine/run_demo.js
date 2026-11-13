// Runs the engine on the synthetic CSVs and writes ../../outputs/allocation_output.csv
// Usage: node run_demo.js [period]   (default Q1)      No dependencies.
const fs = require("fs");
const path = require("path");
const { parseDelimited, validateRows } = require("../02-input-validation/parseRows");
const { computeAllocation, summarize } = require("./allocation");

const read = (f) => parseDelimited(fs.readFileSync(path.join(__dirname, "../../sample-data", f), "utf8"));
const period = process.argv[2] || "Q1";
const num = (rows, keys) => rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, keys.includes(k) ? Number(v) : v])));

// 1. validate an upload the same way the app does
const { summary } = validateRows("targets", read("targets.csv"));
console.log("targets.csv validation:", summary);

// 2. compute the allocation
const teams = num(read("teams.csv"), ["headcount"]);
const allocations = num(read("allocations.csv"), ["ratePerHead"]).filter((a) => a.period === period);
const rules = num(read("holdback_rules.csv"), ["holdbackPct"]).filter((r) => r.period === period);
const rows = computeAllocation({ teams, allocations, rules, categories: ["T&E", "Morale", "Training"] });

const header = Object.keys(rows[0]);
const csv = [header.join(","), ...rows.map((r) => header.map((h) => (typeof r[h] === "number" ? +r[h].toFixed(2) : r[h])).join(","))].join("\n");
fs.writeFileSync(path.join(__dirname, "../../outputs/allocation_output.csv"), csv + "\n");

const t = summarize(rows);
console.log(`${period} totals -> allocated $${t.allocated.toFixed(0)}, held back $${t.heldBack.toFixed(0)}, available $${t.available.toFixed(0)}`);
