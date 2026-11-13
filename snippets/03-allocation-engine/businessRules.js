// Formulas live here once, so Reports, Analytics and the AI agent all compute identical numbers.

const withTargetsVariance = (rows) => rows.map((r) => ({ ...r, variance: r.outputActual - r.inputTarget }));

function targetsRollup(rows) {
  const by = {};
  for (const r of rows) {
    by[r.category] ??= { category: r.category, target: 0, actual: 0 };
    by[r.category].target += r.inputTarget;
    by[r.category].actual += r.outputActual;
  }
  return Object.values(by).map((r) => ({ ...r, variance: r.actual - r.target }));
}

const withHcDelta = (rows) => rows.map((r) => ({ ...r, total: r.opex + r.cogs, delta: r.opex + r.cogs - r.fyTarget }));
const withProjectedHc = (rows) =>
  rows.map((r) => ({ ...r, projected: r.current + r.committed + r.recruiting - r.attrition }));

module.exports = { withTargetsVariance, targetsRollup, withHcDelta, withProjectedHc };
