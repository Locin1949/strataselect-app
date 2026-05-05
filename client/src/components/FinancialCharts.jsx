import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function FinancialCharts({ transactions }) {
  const monthly = useMemo(() => {
    const map = {};

    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!map[month]) {
        map[month] = { month, income: 0, expenses: 0 };
      }

      const amt = Number(t.amount);
      if (amt >= 0) map[month].income += amt;
      else map[month].expenses += Math.abs(amt);
    });

    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#16a34a" name="Income" />
            <Bar dataKey="expenses" fill="#dc2626" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Net Position Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthly.map(m => ({
              ...m,
              net: m.income - m.expenses
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} name="Net" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
