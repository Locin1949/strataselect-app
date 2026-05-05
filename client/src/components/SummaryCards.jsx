import React from 'react';

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 bg-white border rounded shadow">
        <h3 className="text-sm text-slate-500">Income</h3>
        <p className="text-xl font-semibold text-emerald-600">${summary.income.toLocaleString()}</p>
      </div>

      <div className="p-4 bg-white border rounded shadow">
        <h3 className="text-sm text-slate-500">Expenses</h3>
        <p className="text-xl font-semibold text-red-600">${summary.expenses.toLocaleString()}</p>
      </div>

      <div className="p-4 bg-white border rounded shadow">
        <h3 className="text-sm text-slate-500">Net Position</h3>
        <p className="text-xl font-semibold">
          ${(summary.income - summary.expenses).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
