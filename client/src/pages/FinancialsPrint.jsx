import React, { useEffect, useState } from "react";
import { getMonthlyFinancials, getFinancialTransactions } from "../api";

export default function FinancialsPrint() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const token = localStorage.getItem("token");

    const [monthly, txns] = await Promise.all([
      getMonthlyFinancials(token),
      getFinancialTransactions(token)
    ]);

    setMonthlyData(monthly);
    setTransactions(txns);

    // Auto‑open print dialog
    setTimeout(() => window.print(), 500);
  }

  const totalActual = monthlyData.reduce((sum, m) => sum + m.actual, 0);
  const totalBudget = monthlyData.reduce((sum, m) => sum + m.monthly_budget, 0);

  return (
    <div style={page}>
      <h1 style={title}>Financial Report</h1>

      <section>
        <h2>Summary</h2>
        <p><strong>Total Actual:</strong> ${totalActual.toLocaleString()}</p>
        <p><strong>Total Budget:</strong> ${totalBudget.toLocaleString()}</p>
      </section>

      <section>
        <h2>Monthly Performance</h2>
        <table style={table}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Budget</th>
              <th>Actual</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((m) => (
              <tr key={m.month}>
                <td>{m.month}</td>
                <td>${m.monthly_budget}</td>
                <td>${m.actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Transactions</h2>
        <table style={table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Fund</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.category}</td>
                <td>{t.fund}</td>
                <td>${t.amount}</td>
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// PRINT STYLES
// -------------------------------------------------------------
const page = {
  padding: "40px",
  fontFamily: "Arial",
  color: "#000"
};

const title = {
  textAlign: "center",
  marginBottom: "40px"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "30px"
};

table.th = {
  borderBottom: "2px solid #000",
  padding: "8px"
};

table.td = {
  borderBottom: "1px solid #ccc",
  padding: "6px"
};

// Hide everything except the report when printing
const printCSS = `
@media print {
  button, nav, .sidebar, .no-print {
    display: none !important;
  }
}
`;

const style = document.createElement("style");
style.innerHTML = printCSS;
document.head.appendChild(style);
