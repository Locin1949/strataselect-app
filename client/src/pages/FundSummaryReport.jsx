import React, { useEffect, useState, useMemo } from "react";

function FundSummaryReport() {
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

  const funds = ["Admin", "Sinking"];

  const fundSummary = useMemo(() => {
    const summary = {
      Admin: { opening: 0, income: 0, expenses: 0, closing: 0 },
      Sinking: { opening: 0, income: 0, expenses: 0, closing: 0 }
    };

    const running = { Admin: 0, Sinking: 0 };

    rows.forEach((r) => {
      if (r.fund === "Admin") running.Admin += r.amount;
      if (r.fund === "Sinking") running.Sinking += r.amount;
    });

    summary.Admin.closing = running.Admin;
    summary.Sinking.closing = running.Sinking;

    rows.forEach((r) => {
      if (!funds.includes(r.fund)) return;
      if (r.amount >= 0) summary[r.fund].income += r.amount;
      else summary[r.fund].expenses += Math.abs(r.amount);
    });

    summary.Admin.opening = summary.Admin.closing - (summary.Admin.income - summary.Admin.expenses);
    summary.Sinking.opening = summary.Sinking.closing - (summary.Sinking.income - summary.Sinking.expenses);

    return summary;
  }, [rows]);

  const monthlyGroups = useMemo(() => {
    const groups = {};
    rows.forEach((r) => {
      const month = r.date?.slice(0, 7);
      if (!month) return;
      if (!groups[month]) groups[month] = [];
      groups[month].push(r);
    });
    return groups;
  }, [rows]);

  const categoryTotals = useMemo(() => {
    const totals = { Admin: {}, Sinking: {} };
    rows.forEach((r) => {
      if (!funds.includes(r.fund)) return;
      if (!totals[r.fund][r.category]) totals[r.fund][r.category] = 0;
      totals[r.fund][r.category] += r.amount;
    });
    return totals;
  }, [rows]);

  if (loading) return <div>Loading Fund Summary…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <style>
        {`
        @media print {
          button, nav {
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
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ marginBottom: "4px" }}>Surfers Palms North</h1>
          <h2 style={{ marginTop: "0" }}>Fund Summary Report</h2>
          <div style={{ opacity: 0.7 }}>{new Date().toLocaleDateString()}</div>
        </div>

        <h2>Fund Summary</h2>
        <table style={{ borderCollapse: "collapse", width: "80%", marginBottom: "30px" }}>
          <thead>
            <tr style={{ background: "#e8e8e8" }}>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Fund</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Opening</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Income</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Expenses</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Net</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Closing</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund, i) => {
              const f = fundSummary[fund];
              const net = f.income - f.expenses;
              return (
                <tr key={fund} style={{ background: i % 2 === 0 ? "#fafafa" : "white" }}>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{fund}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc", fontWeight: "bold" }}>{f.opening.toFixed(2)}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc", color: "green" }}>{f.income.toFixed(2)}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc", color: "red" }}>{f.expenses.toFixed(2)}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{net.toFixed(2)}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc", fontWeight: "bold" }}>{f.closing.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2>Monthly Movement</h2>
        <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "30px" }}>
          <thead>
            <tr style={{ background: "#e8e8e8" }}>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Month</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Admin Income</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Admin Expenses</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Admin Net</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Sinking Income</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Sinking Expenses</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Sinking Net</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyGroups)
              .sort(([a], [b]) => (a < b ? -1 : 1))
              .map(([month, items], i) => {
                const adminIncome = items.filter((i) => i.fund === "Admin" && i.amount >= 0).reduce((a, b) => a + b.amount, 0);
                const adminExpenses = items.filter((i) => i.fund === "Admin" && i.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
                const sinkingIncome = items.filter((i) => i.fund === "Sinking" && i.amount >= 0).reduce((a, b) => a + b.amount, 0);
                const sinkingExpenses = items.filter((i) => i.fund === "Sinking" && i.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);

                return (
                  <tr key={month} style={{ background: i % 2 === 0 ? "#fafafa" : "white" }}>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{month}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: "green" }}>{adminIncome.toFixed(2)}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: "red" }}>{adminExpenses.toFixed(2)}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{(adminIncome - adminExpenses).toFixed(2)}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: "green" }}>{sinkingIncome.toFixed(2)}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: "red" }}>{sinkingExpenses.toFixed(2)}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{(sinkingIncome - sinkingExpenses).toFixed(2)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <h2>Category Totals</h2>

        <div style={{ display: "flex", gap: "40px", marginBottom: "30px" }}>
          <div style={{ flex: 1 }}>
            <h3>Admin Fund</h3>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ background: "#e8e8e8" }}>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Category</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryTotals.Admin).map(([cat, total], i) => (
                  <tr key={cat} style={{ background: i % 2 === 0 ? "#fafafa" : "white" }}>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{cat}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: total < 0 ? "red" : "green" }}>
                      {total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Sinking Fund</h3>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ background: "#e8e8e8" }}>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Category</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryTotals.Sinking).map(([cat, total], i) => (
                  <tr key={cat} style={{ background: i % 2 === 0 ? "#fafafa" : "white" }}>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{cat}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc", color: total < 0 ? "red" : "green" }}>
                      {total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2>Notes</h2>
        <p style={{ opacity: 0.7 }}>
          This report summarises the movement of the Administrative and Sinking Funds for the selected period. It is intended for committee review, budgeting, and audit preparation.
        </p>
      </div>
    </div>
  );
}

export default FundSummaryReport;