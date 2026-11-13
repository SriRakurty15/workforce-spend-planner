// Read-only computed views. Each handler reads rows, applies a shared business rule, returns JSON.
const express = require("express");
const { withTargetsVariance, targetsRollup, withHcDelta, withProjectedHc } = require("../03-allocation-engine/businessRules");

module.exports = function outputRoutes(prisma) {
  const router = express.Router();

  const filters = (q) => ({
    fiscalYear: q.fiscalYear ? Number(q.fiscalYear) : undefined,
    period: q.period && q.period !== "All" ? q.period : undefined,
    category: q.category && q.category !== "All" ? q.category : undefined,
  });
  const where = (f) => Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined));

  // try/catch on every async handler: an unhandled rejection would crash the whole Node process.
  router.get("/targets", async (req, res) => {
    try {
      const rows = await prisma.target.findMany({ where: where(filters(req.query)), orderBy: [{ fiscalYear: "asc" }, { period: "asc" }] });
      res.json({ rows: withTargetsVariance(rows), rollup: targetsRollup(rows) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get("/hc", async (req, res) => {
    try {
      res.json({ rows: withHcDelta(await prisma.headcount.findMany({ where: where(filters(req.query)) })) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get("/hcPipeline", async (req, res) => {
    try {
      res.json({ rows: withProjectedHc(await prisma.headcountPipeline.findMany({ where: where(filters(req.query)) })) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return router;
};
