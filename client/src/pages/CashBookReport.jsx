// src/pages/CashBookReport.jsx
import React, { useEffect, useState, useMemo } from "react";

function CashBookReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/financials/cashbook", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load cashbook");
        }
        return res.json();
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const rowsWithBalance = useMemo(() => {
    let balance = 0;
    return rows.map((r) => {
      balance += r.amount;
      return { ...r, runningBalance: balance };
    });
  }, [rows]);

  const summary = useMemo(() => {
    if (rowsWithBalance.length === 0) {
      return {
        opening: 0,
        income: 0,
        expenses: 0,
        closing: 0,
        fundTotals: {},
        categoryTotals: {}
      };
    }

    const opening =
      rowsWithBalance[0].runningBalance - rowsWithBalance[0].amount;
    const closing =
      rowsWithBalance[rowsWithBalance.length - 1].runningBalance;

    let income = 0;
    let expenses = 0;

    const fundTotals = {};
    const categoryTotals = {};

    rowsWithBalance.forEach((r) => {
      if (r.amount >= 0) income += r.amount;
      else expenses += Math.abs(r.amount);

      if (!fundTotals[r.fund]) fundTotals[r.fund] = 0;
      fundTotals[r.fund] += r.amount;

      if (!categoryTotals[r.category]) categoryTotals[r.category] = 0;
      categoryTotals[r.category] += r.amount;
    });

    return { opening, income, expenses, closing, fundTotals, categoryTotals };
  }, [rowsWithBalance]);

  const monthlyGroups = useMemo(() => {
    const groups = {};
    rowsWithBalance.forEach((r) => {
      const month = r.date?.slice(0, 7) || "";
      if (!month) return;
      if (!groups[month]) groups[month] = [];
      groups[month].push(r);
    });
    return groups;
  }, [rowsWithBalance]);

  if (loading) return <div>Loading report…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <style>
        {`
        @media print {
          button, nav, input, select {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          table {
            page-break-inside: avoid;
          }
        }
      `}
      </style>

      <button onClick={() => window.print()}>Print PDF</button>

      <div id="print-area">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1>Surfers Palms North – Cash Book Report</h1>
          <div>{new Date().toLocaleDateString()}</div>
        </div>

        <h2>Summary</h2>
        <table
          style={{
            borderCollapse: "collapse",
            width: "60%",
            marginBottom: "20px"
          }}
        >
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                Opening Balance
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {summary.opening.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                Total Income
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px",
                  color: "green"
                }}
              >
                {summary.income.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                Total Expenses
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px",
                  color: "red"
                }}
              >
                {summary.expenses.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                Closing Balance
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {summary.closing.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Monthly Summary</h2>
        <table
          style={{
            borderCollapse: "collapse",
            width: "80%",
            marginBottom: "20px"
          }}
        >
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Month
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Income
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Expenses
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Net
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyGroups)
              .sort(([a], [b]) => (a < b ? -1 : 1))
              .map(([month, items]) => {
                const income = items
                  .filter((i) => i.amount >= 0)
                  .reduce((a, b) => a + b.amount, 0);
                const expenses = items
                  .filter((i) => i.amount < 0)
                  .reduce((a, b) => a + Math.abs(b.amount), 0);
                const net = income - expenses;

                return (
                  <tr key={month}>
                    <td
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      {month}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "6px",
                        color: "green"
                      }}
                    >
                      {income.toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "6px",
                        color: "red"
                      }}
                    >
                      {expenses.toFixed(2)}
                    </td>
                    <td
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      {net.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <h2>Fund Totals</h2>
        <table
          style={{
            borderCollapse: "collapse",
            width: "60%",
            marginBottom: "20px"
          }}
        >
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Fund
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary.fundTotals).map(([fund, total]) => (
              <tr key={fund}>
                <td
                  style={{ border: "1px solid #ccc", padding: "6px" }}
                >
                  {fund}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "6px",
                    color: total < 0 ? "red" : "green"
                  }}
                >
                  {total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Category Totals</h2>
        <table
          style={{
            borderCollapse: "collapse",
            width: "80%",
            marginBottom: "20px"
          }}
        >
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Category
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary.categoryTotals).map(([cat, total]) => (
              <tr key={cat}>
                <td
                  style={{ border: "1px solid #ccc", padding: "6px" }}
                >
                  {cat}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "6px",
                    color: total < 0 ? "red" : "green"
                  }}
                >
                  {total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Transactions</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc"
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Date
              </th>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Description
              </th>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Vendor
              </th>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Reference
              </th>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Fund
              </th>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Category
              </th>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Amount
              </th>
              <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                Running Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {rowsWithBalance.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                  {r.date}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                  {r.description}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                  {r.vendor}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                  {r.reference}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                  {r.fund}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                  {r.category}
                </td>
                <td
                  style={{
                    padding: "6px",
                    border: "1px solid #ccc",
                    color: r.amount < 0 ? "red" : "green"
                  }}
                >
                  {r.amount.toFixed(2)}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                  {r.runningBalance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashBookReport;