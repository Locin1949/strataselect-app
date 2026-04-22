// src/pages/CashBook.jsx
import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL;   // ← THIS FIXES THE SQUIGGLY

function CashBook() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fundFilter, setFundFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    fetch(`${API}/financials/cashbook`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load data");
        }
        return res.json();
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      });
  }, []);
}

export default CashBook;


  const rowsWithBalance = useMemo(() => {
    let balance = 0;
    return rows.map((r) => {
      balance += r.amount;
      return { ...r, runningBalance: balance };
    });
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rowsWithBalance.filter((r) => {
      if (fundFilter !== "all" && r.fund !== fundFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;

      const s = search.toLowerCase();
      if (s) {
        const haystack = `${r.description} ${r.vendor || ""} ${r.reference || ""}`.toLowerCase();
        if (!haystack.includes(s)) return false;
      }

      return true;
    });
  }, [rowsWithBalance, fundFilter, categoryFilter, search]);

  const summary = useMemo(() => {
    if (filteredRows.length === 0) {
      return {
        opening: 0,
        income: 0,
        expenses: 0,
        closing: 0,
        fundTotals: {},
        categoryTotals: {}
      };
    }

    const opening = filteredRows[0].runningBalance - filteredRows[0].amount;
    const closing = filteredRows[filteredRows.length - 1].runningBalance;

    let income = 0;
    let expenses = 0;

    const fundTotals = {};
    const categoryTotals = {};

    filteredRows.forEach((r) => {
      if (r.amount >= 0) income += r.amount;
      else expenses += Math.abs(r.amount);

      if (!fundTotals[r.fund]) fundTotals[r.fund] = 0;
      fundTotals[r.fund] += r.amount;

      if (!categoryTotals[r.category]) categoryTotals[r.category] = 0;
      categoryTotals[r.category] += r.amount;
    });

    return { opening, income, expenses, closing, fundTotals, categoryTotals };
  }, [filteredRows]);

  const monthlyGroups = useMemo(() => {
    const groups = {};
    filteredRows.forEach((r) => {
      const month = r.date?.slice(0, 7) || "";
      if (!month) return;
      if (!groups[month]) groups[month] = [];
      groups[month].push(r);
    });
    return groups;
  }, [filteredRows]);

  const exportCSV = () => {
    if (filteredRows.length === 0) return;

    const headers = [
      "Date",
      "Description",
      "Vendor",
      "Reference",
      "Fund",
      "Category",
      "Amount",
      "Running Balance"
    ];

    const csvRows = [
      headers.join(","),
      ...filteredRows.map((r) =>
        [
          r.date,
          `"${(r.description || "").replace(/"/g, '""')}"`,
          `"${(r.vendor || "").replace(/"/g, '""')}"`,
          `"${(r.reference || "").replace(/"/g, '""')}"`,
          r.fund || "",
          r.category || "",
          r.amount,
          r.runningBalance
        ].join(",")
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cashbook_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Chart data ----------

  const months = useMemo(
    () => Object.keys(monthlyGroups).sort(),
    [monthlyGroups]
  );

  const incomeExpenseChartData = useMemo(() => {
    const incomeData = months.map((m) =>
      monthlyGroups[m]
        .filter((t) => t.amount >= 0)
        .reduce((a, b) => a + b.amount, 0)
    );
    const expenseData = months.map((m) =>
      monthlyGroups[m]
        .filter((t) => t.amount < 0)
        .reduce((a, b) => a + Math.abs(b.amount), 0)
    );

    return {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "green",
          backgroundColor: "rgba(0, 128, 0, 0.2)",
          tension: 0.2
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          tension: 0.2
        }
      ]
    };
  }, [months, monthlyGroups]);

  const fundBalanceChartData = useMemo(() => {
    let admin = 0;
    let sinking = 0;
    const adminData = [];
    const sinkingData = [];

    months.forEach((m) => {
      monthlyGroups[m].forEach((t) => {
        if (t.fund === "Admin") admin += t.amount;
        if (t.fund === "Sinking") sinking += t.amount;
      });
      adminData.push(admin);
      sinkingData.push(sinking);
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Admin Fund",
          data: adminData,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          tension: 0.2
        },
        {
          label: "Sinking Fund",
          data: sinkingData,
          borderColor: "orange",
          backgroundColor: "rgba(255, 165, 0, 0.2)",
          tension: 0.2
        }
      ]
    };
  }, [months, monthlyGroups]);

  const categoryPieData = useMemo(() => {
    const entries = Object.entries(summary.categoryTotals || {}).filter(
      ([cat]) => cat
    );
    const labels = entries.map(([cat]) => cat);
    const data = entries.map(([, total]) => total);

    const colors = [
      "#3366CC",
      "#DC3912",
      "#FF9900",
      "#109618",
      "#990099",
      "#0099C6",
      "#DD4477",
      "#66AA00",
      "#B82E2E",
      "#316395"
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map((_, i) => colors[i % colors.length])
        }
      ]
    };
  }, [summary.categoryTotals]);

  if (loading) return <div>Loading Cash Book…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const uniqueFunds = [...new Set(rows.map((r) => r.fund).filter(Boolean))];
  const uniqueCategories = [
    ...new Set(rows.map((r) => r.category).filter(Boolean))
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cash Book</h2>

      <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
        <button onClick={exportCSV}>Export CSV (Filtered View)</button>
      </div>

      {/* Summary bar */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          padding: "15px",
          background: "#f7f7f7",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}
      >
        <div>
          <strong>Opening Balance:</strong> {summary.opening.toFixed(2)}
        </div>
        <div>
          <strong>Total Income:</strong>{" "}
          <span style={{ color: "green" }}>
            {summary.income.toFixed(2)}
          </span>
        </div>
        <div>
          <strong>Total Expenses:</strong>{" "}
          <span style={{ color: "red" }}>
            {summary.expenses.toFixed(2)}
          </span>
        </div>
        <div>
          <strong>Closing Balance:</strong> {summary.closing.toFixed(2)}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", marginBottom: "30px" }}>
        <div>
          <h3>Income vs Expenses (Monthly)</h3>
          {months.length > 0 ? (
            <Line data={incomeExpenseChartData} />
          ) : (
            <div>No data for chart</div>
          )}
        </div>
        <div>
          <h3>Category Breakdown</h3>
          {categoryPieData.labels.length > 0 ? (
            <Pie data={categoryPieData} />
          ) : (
            <div>No category data</div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3>Fund Balances Over Time</h3>
        {months.length > 0 ? (
          <Line data={fundBalanceChartData} />
        ) : (
          <div>No data for chart</div>
        )}
      </div>

      {/* Monthly breakdown */}
      <h3>Monthly Breakdown</h3>
      {Object.entries(monthlyGroups).map(([month, items]) => {
        const monthIncome = items
          .filter((i) => i.amount >= 0)
          .reduce((a, b) => a + b.amount, 0);
        const monthExpenses = items
          .filter((i) => i.amount < 0)
          .reduce((a, b) => a + Math.abs(b.amount), 0);
        const monthNet = monthIncome - monthExpenses;

        return (
          <div key={month} style={{ marginBottom: "12px" }}>
            <strong>{month}:</strong>{" "}
            Income {monthIncome.toFixed(2)} | Expenses{" "}
            {monthExpenses.toFixed(2)} | Net {monthNet.toFixed(2)}
          </div>
        );
      })}

      {/* Fund totals */}
      <h3>Fund Totals</h3>
      <table
        style={{
          borderCollapse: "collapse",
          width: "50%",
          marginBottom: "20px"
        }}
      >
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Fund</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary.fundTotals).map(([fund, total]) => (
            <tr key={fund}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
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

      {/* Category totals */}
      <h3>Category Totals</h3>
      <table
        style={{
          borderCollapse: "collapse",
          width: "70%",
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
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
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

      {/* Filters */}
      <h3>Transactions</h3>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <label>Fund: </label>
          <select
            value={fundFilter}
            onChange={(e) => setFundFilter(e.target.value)}
          >
            <option value="all">All</option>
            {uniqueFunds.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Category: </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Search: </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Description, vendor, reference…"
          />
        </div>
      </div>

      {/* Transactions table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          border: "1px solid #ccc"
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Date</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>
              Description
            </th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>
              Vendor
            </th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>
              Reference
            </th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Fund</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>
              Category
            </th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>
              Amount
            </th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>
              Running Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {r.date}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {r.description}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {r.vendor}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {r.reference}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {r.fund}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {r.category}
              </td>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  color: r.amount < 0 ? "red" : "green"
                }}
              >
                {r.amount.toFixed(2)}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {r.runningBalance.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CashBook;