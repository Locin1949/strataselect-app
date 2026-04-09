import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

import { getMonthlyFinancials, getFinancialTransactions } from "../api";

export default function FinancialCharts() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ marginLeft: "240px", marginTop: "80px", padding: "20px" }}>
        Loading charts...
      </div>
    );
  }

  const categoryTotals = {};
  transactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });

  const categoryData = Object.keys(categoryTotals).map((key) => ({
    name: key,
    value: categoryTotals[key]
  }));

  const COLORS = [
    "#1e3a8a",
    "#0ea5e9",
    "#22c55e",
    "#eab308",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
    "#f97316"
  ];

  const adminTotal = transactions
    .filter((t) => t.fund === "Admin")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const sinkingTotal = transactions
    .filter((t) => t.fund === "Sinking")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const fundData = [
    { name: "Admin Fund", value: adminTotal },
    { name: "Sinking Fund", value: sinkingTotal }
  ];

  return (
    <div
      style={{
        marginLeft: "240px",
        marginTop: "80px",
        padding: "20px",
        display: "grid",
        gap: "40px"
      }}
    >
      <h1>Financial Charts</h1>

      <div style={card}>
        <h2>Monthly Actual vs Budget</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" fill="#1e3a8a" name="Actual" />
            <Bar dataKey="monthly_budget" fill="#0ea5e9" name="Budget" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={card}>
        <h2>Category Breakdown</h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={card}>
        <h2>Admin vs Sinking Fund</h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={fundData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              <Cell fill="#1e3a8a" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};
