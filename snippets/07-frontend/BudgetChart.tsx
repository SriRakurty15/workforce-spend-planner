import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type Row = { period: string; target: number; actual: number };

export function BudgetChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid stroke="#22304d" vertical={false} />
        <XAxis dataKey="period" stroke="#9aa7c2" />
        <YAxis stroke="#9aa7c2" tickFormatter={(v) => `$${v / 1000}K`} />
        <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="target" name="Target" fill="#70c0f2" />
        <Bar dataKey="actual" name="Actual" fill="#d9b369" />
      </BarChart>
    </ResponsiveContainer>
  );
}
