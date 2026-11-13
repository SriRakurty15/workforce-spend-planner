// Allocation engine: budget planned bottom-up (rate per person x headcount),
// then split into a centrally held portion and a portion released to teams.
// Pure functions: callers load rows (from the DB or CSVs) and pass them in.

const DEFAULT_SCOPE_ID = "Default";

/** team override -> location rate -> category default */
function resolveRate(allocations, { teamName, location }, category) {
  const match = (scopeType, scopeId) =>
    allocations.find((a) => a.category === category && a.scopeType === scopeType && a.scopeId === scopeId);
  return (match("team", teamName) ?? match("location", location) ?? match("location", DEFAULT_SCOPE_ID))?.ratePerHead ?? 0;
}

/** exact (category, location) -> category default -> 0% */
function resolveHoldback(rules, category, location) {
  return (
    (rules.find((r) => r.category === category && r.location === location) ??
      rules.find((r) => r.category === category && r.location === DEFAULT_SCOPE_ID))?.holdbackPct ?? 0
  );
}

function computeAllocation({ teams, allocations, rules, categories }) {
  const rows = [];
  for (const team of teams) {
    for (const category of categories) {
      const ratePerHead = resolveRate(allocations, { teamName: team.name, location: team.location }, category);
      const holdbackPct = resolveHoldback(rules, category, team.location);
      const allocated = ratePerHead * team.headcount;
      const heldBack = allocated * (holdbackPct / 100);
      rows.push({
        team: team.name, location: team.location, headcount: team.headcount, category,
        ratePerHead, holdbackPct, allocated, heldBack, available: allocated - heldBack,
      });
    }
  }
  return rows;
}

function summarize(rows) {
  return rows.reduce(
    (a, r) => ({ allocated: a.allocated + r.allocated, heldBack: a.heldBack + r.heldBack, available: a.available + r.available }),
    { allocated: 0, heldBack: 0, available: 0 }
  );
}

module.exports = { resolveRate, resolveHoldback, computeAllocation, summarize };
