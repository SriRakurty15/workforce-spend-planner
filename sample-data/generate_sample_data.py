"""Generates fully synthetic data for the Workforce & Spend Planner portfolio demo.

Nothing here is derived from any real company. Company: "Acme Corp" (fictional).
Run:  python3 generate_sample_data.py      (stdlib only, deterministic seed)
"""
import csv, random, pathlib

random.seed(42)
OUT = pathlib.Path(__file__).parent
FY = 2027
PERIODS = ["Q1", "Q2", "Q3", "Q4"]
CATEGORIES = ["T&E", "Morale", "Training"]
LOCATIONS = ["US", "EU", "India", "ROW"]
FUNDING = ["Core", "Other"]
TEAMS = [
    ("Platform Engineering", "US", 42), ("Data Services", "US", 28),
    ("Cloud Operations", "EU", 31), ("Identity & Access", "EU", 19),
    ("Quality Engineering", "India", 55), ("Support Tooling", "India", 38),
    ("Mobile Apps", "US", 24), ("Analytics", "ROW", 17),
    ("Developer Experience", "EU", 14), ("Business Systems", "ROW", 21),
]

def write(name, header, rows):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)
    print(f"{name}: {len(rows)} rows")

# Targets: quarterly budget per category, actuals a few % either side of plan
base = {"T&E": 410_000, "Morale": 120_000, "Training": 180_000}
rows = []
for p_i, p in enumerate(PERIODS):
    for c in CATEGORIES:
        target = round(base[c] * (1 + 0.03 * p_i) * random.uniform(0.95, 1.05), -2)
        holdback = round(target * 0.10, -2)
        actual = round(target * random.uniform(0.82, 1.06), -2) if p_i < 3 else 0
        rows.append([FY, p, c, target, holdback, actual])
write("targets.csv", ["fiscalYear", "period", "category", "inputTarget", "holdbackAmount", "outputActual"], rows)

# Headcount: spend type vs target per funding source
rows = []
for fs, (opex, cogs, tgt) in zip(FUNDING, [(120, 38, 170), (96, 22, 110)]):
    rows.append([FY, fs, opex, cogs, tgt])
write("headcount.csv", ["fiscalYear", "fundingSource", "opex", "cogs", "fyTarget"], rows)

# Pipeline
write("headcount_pipeline.csv",
      ["fiscalYear", "fundingSource", "current", "committed", "recruiting", "attrition"],
      [[FY, "Core", 150, 8, 12, 6], [FY, "Other", 112, 4, 7, 5]])

# Cost per head by location
cph = {"US": (95, 140, 2400, 5200), "EU": (80, 120, 2200, 4300),
       "India": (40, 70, 1500, 2100), "ROW": (60, 90, 1800, 3000)}
write("cost_per_head.csv", ["fiscalYear", "location", "morale", "training", "computer", "te"],
      [[FY, loc, *v] for loc, v in cph.items()])

# Teams
write("teams.csv", ["fiscalYear", "name", "location", "headcount"],
      [[FY, n, l, h] for n, l, h in TEAMS])

# Allocation rates (per head per quarter): location defaults + one team override
rates = {"T&E": {"US": 1300, "EU": 1075, "India": 525, "ROW": 800},
         "Morale": {"US": 24, "EU": 20, "India": 10, "ROW": 15},
         "Training": {"US": 35, "EU": 30, "India": 18, "ROW": 22}}
rows = []
for p in PERIODS:
    for c in CATEGORIES:
        rows.append([FY, p, c, "location", "Default", round(sum(rates[c].values()) / 4, 2)])
        for loc, r in rates[c].items():
            rows.append([FY, p, c, "location", loc, r])
    rows.append([FY, p, "Training", "team", "Developer Experience", 60])  # override
write("allocations.csv", ["fiscalYear", "period", "category", "scopeType", "scopeId", "ratePerHead"], rows)

# Hold-back % per category x location x quarter
rows = []
for p in PERIODS:
    for c in CATEGORIES:
        rows.append([FY, p, c, "Default", 10])
        rows.append([FY, p, c, "US", 15 if c == "T&E" else 10])
write("holdback_rules.csv", ["fiscalYear", "period", "category", "location", "holdbackPct"], rows)
