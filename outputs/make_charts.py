"""Renders sample output images from the synthetic CSVs. Run: python3 make_charts.py"""
import csv, pathlib
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt

here = pathlib.Path(__file__).parent
rd = lambda p: list(csv.DictReader(open(p)))
BG, PANEL, TXT, GOLD, BLUE, GREEN = "#0d1423", "#152038", "#e8ecf4", "#d9b369", "#70c0f2", "#67ad81"

def style(ax):
    ax.set_facecolor(PANEL); ax.tick_params(colors=TXT)
    for s in ax.spines.values(): s.set_color("#22304d")
    ax.title.set_color(TXT); ax.yaxis.label.set_color(TXT)

# 1. target vs actual by quarter
t = rd(here / "../sample-data/targets.csv")
periods = ["Q1", "Q2", "Q3", "Q4"]
tgt = [sum(float(r["inputTarget"]) for r in t if r["period"] == p) / 1000 for p in periods]
act = [sum(float(r["outputActual"]) for r in t if r["period"] == p) / 1000 for p in periods]
fig, ax = plt.subplots(figsize=(7, 4), facecolor=BG); style(ax)
x = range(4)
ax.bar([i - 0.2 for i in x], tgt, 0.4, label="Target", color=BLUE)
ax.bar([i + 0.2 for i in x], act, 0.4, label="Actual", color=GOLD)
ax.set_xticks(list(x)); ax.set_xticklabels(periods); ax.set_ylabel("$K")
ax.set_title("Budget target vs actual by quarter (synthetic data)")
ax.legend(facecolor=PANEL, labelcolor=TXT, edgecolor="#22304d")
fig.tight_layout(); fig.savefig(here / "target_vs_actual.png", dpi=150, facecolor=BG)

# 2. Q1 allocation: held back vs available per team
a = rd(here / "allocation_output.csv")
teams = sorted({r["team"] for r in a})
avail = [sum(float(r["available"]) for r in a if r["team"] == n) / 1000 for n in teams]
held = [sum(float(r["heldBack"]) for r in a if r["team"] == n) / 1000 for n in teams]
fig, ax = plt.subplots(figsize=(8, 4.5), facecolor=BG); style(ax)
ax.barh(teams, avail, color=GREEN, label="Available")
ax.barh(teams, held, left=avail, color=GOLD, label="Held back")
ax.set_xlabel("$K"); ax.xaxis.label.set_color(TXT)
ax.set_title("Q1 allocation by team (synthetic data)")
ax.legend(facecolor=PANEL, labelcolor=TXT, edgecolor="#22304d")
fig.tight_layout(); fig.savefig(here / "allocation_by_team.png", dpi=150, facecolor=BG)
print("charts written")
