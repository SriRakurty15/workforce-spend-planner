// AI finance agent, tool-calling first: the model never invents numbers. It can only call the tools below,
// which query the live database (or run the forecast). Grounding stays the same whether the "planner"
// is an LLM or a keyword matcher; swapping providers changes who plans, not where the numbers come from.

const { linearForecast } = require("../04-forecast/forecast");
const { withTargetsVariance } = require("../03-allocation-engine/businessRules");

const TOOLS = [
  {
    name: "query_facts",
    description: "Query rows from a dataset (targets, hc, hcPipeline, cph), optionally filtered.",
    input_schema: {
      type: "object",
      properties: {
        dataset: { type: "string", enum: ["targets", "hc", "hcPipeline", "cph"] },
        fiscalYear: { type: "number" }, period: { type: "string" }, category: { type: "string" },
      },
      required: ["dataset"],
    },
  },
  {
    name: "get_forecast",
    description: "Linear-trend forecast with confidence band for a Targets category.",
    input_schema: {
      type: "object",
      properties: { category: { type: "string", enum: ["T&E", "Morale", "Training"] }, horizon: { type: "number" } },
      required: ["category"],
    },
  },
];

async function runTool(prisma, name, input) {
  if (name === "query_facts" && input.dataset === "targets") {
    const rows = await prisma.target.findMany({
      where: { ...(input.fiscalYear && { fiscalYear: input.fiscalYear }), ...(input.period && { period: input.period }), ...(input.category && { category: input.category }) },
    });
    return withTargetsVariance(rows);
  }
  if (name === "get_forecast") {
    const rows = await prisma.target.findMany({ where: { category: input.category }, orderBy: [{ fiscalYear: "asc" }, { period: "asc" }] });
    return linearForecast(rows.map((r) => r.outputActual), input.horizon ?? 2);
  }
  throw new Error(`Unknown tool: ${name}`);
}

module.exports = { TOOLS, runTool };
