// Idempotent startup seeding. Azure App Service can recycle and lose local state, and a release can add
// tables nothing has written to yet. Rule: seed a dataset only when it has ZERO rows. Once it holds
// anything (seed data or user-entered figures) it is never rewritten, so a deploy can't revert user edits.

const prisma = require("./db"); // your PrismaClient instance

const DATASETS = [
  { name: "targets",   count: () => prisma.target.count(),   seed: require("./seeders").seedTargets },
  { name: "teams",     count: () => prisma.team.count(),     seed: require("./seeders").seedTeams },
  { name: "cph",       count: () => prisma.costPerHead.count(), seed: require("./seeders").seedCph },
];

async function autoSeedEmpty() {
  const seeded = [], skipped = [], failed = [];
  for (const { name, count, seed } of DATASETS) {
    try {
      if ((await count()) === 0) { await seed(); seeded.push(name); }
      else skipped.push(name);
    } catch (e) {
      // Isolated: one failing dataset must not abort the rest (or silently pass the deploy).
      failed.push({ dataset: name, error: e.message });
    }
  }
  return { seeded, skipped, failed };
}

module.exports = { autoSeedEmpty };
