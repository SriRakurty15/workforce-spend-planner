# Sample data

All data in this folder is **synthetic**. The company ("Acme Corp"), teams, locations, rates and
budget figures are invented and are not derived from any real organisation.

| File | Mirrors table | Grain |
|---|---|---|
| `targets.csv` | Targets | fiscal year x quarter x category |
| `headcount.csv` | Headcount | fiscal year x funding source |
| `headcount_pipeline.csv` | HeadcountPipeline | current / committed / recruiting / attrition |
| `cost_per_head.csv` | CostPerHead | fiscal year x location |
| `teams.csv` | Teams | team, location, headcount |
| `allocations.csv` | Allocations | rate per head (location default, location, or team override) |
| `holdback_rules.csv` | HoldbackRules | hold-back % per category x location |

Regenerate with `python3 generate_sample_data.py` (deterministic seed, standard library only).
