import React from "react";

export function KpiTile({ label, value, sub, tone = "neutral" }: {
  label: string; value: string; sub?: string; tone?: "good" | "bad" | "neutral";
}) {
  const color = { good: "#67ad81", bad: "#d45d52", neutral: "#e8ecf4" }[tone];
  return (
    <div style={{ background: "#152038", borderRadius: 4, padding: "8px 18px 32px 12px" }}>
      <div style={{ color: "#9aa7c2", fontSize: 13 }}>{label}</div>
      <div style={{ color, fontSize: 30, fontWeight: 600 }}>{value}</div>
      {sub && <div style={{ color: "#9aa7c2", fontSize: 13 }}>{sub}</div>}
    </div>
  );
}
