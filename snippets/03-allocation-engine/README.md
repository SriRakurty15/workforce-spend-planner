# 03 - Allocation engine

Budget is planned bottom-up: `rate per head x team headcount`, then a hold-back % is withheld centrally.

Rate lookup falls back in order: **team override -> location rate -> category default**.
Hold-back lookup: **exact (category, location) -> category default -> 0%**.

The engine is pure functions in one module, so Reports, Analytics and the AI agent can never disagree.

```bash
node run_demo.js Q1      # reads ../../sample-data, writes ../../outputs/allocation_output.csv
```
