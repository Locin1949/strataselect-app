import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFinancials } from "../hooks/useFinancials";
import { useToast } from "../components/ToastProvider";

import Card from "../components/Card";
import StatCard from "../components/StatCard";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonTable from "../components/SkeletonTable";

import TransactionModal from "../components/TransactionModal";
import TransactionTable from "../components/TransactionTable";

import { CATEGORY_LIST } from "../data/categories";

import {
  HiCurrencyDollar,
  HiChartBar,
  HiClipboardDocumentList
} from "react-icons/hi2";

export default function Financials() {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    monthly,
    transactions,
    addTxn,
    updateTxn,
    deleteTxn
  } = useFinancials();

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loading = monthly.isLoading || transactions.isLoading;

  const monthlyData = monthly.data || [];
  const txns = transactions.data || [];

  const totalActual = monthlyData.reduce((sum, m) => sum + m.actual, 0);
  const totalBudget = monthlyData.reduce((sum, m) => sum + m.monthly_budget, 0);

  const categoryTotals = txns.reduce((acc, t) => {
    const amount = Number(t.amount || 0);
    acc[t.category] = (acc[t.category] || 0) + amount;
    return acc;
  }, {});

  const filtered = txns.filter((t) =>
    JSON.stringify(t).toLowerCase().includes(filterText.toLowerCase())
  );

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  function handleSave(formData) {
    if (editItem) {
      updateTxn.mutate(
        { id: editItem.id, data: formData },
        {
          onSuccess: () => {
            toast.show("Transaction updated", "success");
            setShowModal(false);
            setEditItem(null);
          }
        }
      );
    } else {
      addTxn.mutate(formData, {
        onSuccess: () => {
          toast.show("Transaction added", "success");
          setShowModal(false);
        }
      });
    }
  }

  function handleDelete(id) {
    deleteTxn.mutate(id, {
      onSuccess: () => toast.show("Transaction deleted", "success")
    });
  }

  function exportCSV() {
    const rows = [
      ["Date", "Category", "Fund", "Amount", "Description"],
      ...txns.map((t) => [
        t.date,
        t.category,
        t.fund,
        t.amount,
        t.description
      ])
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  }

  return (
    <div
      style={{
        marginLeft: "240px",
        marginTop: "80px",
        padding: "20px",
        display: "grid",
        gap: "20px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Financials</h1>

        <button
          onClick={() => navigate("/financials/print")}
          style={{
            padding: "8px 14px",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            height: "40px"
          }}
        >
          Print Report
        </button>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              label="Total Actual"
              value={`$${totalActual.toLocaleString()}`}
              icon={<HiCurrencyDollar />}
              color="#16a34a"
            />
            <StatCard
              label="Total Budget"
              value={`$${totalBudget.toLocaleString()}`}
              icon={<HiChartBar />}
              color="#1d4ed8"
            />
            <StatCard
              label="Transactions"
              value={txns.length}
              icon={<HiClipboardDocumentList />}
              color="#7c3aed"
            />
          </>
        )}
      </div>

      {/* SEARCH */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />

        <button
          onClick={exportCSV}
          style={{
            padding: "6px 10px",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Export CSV
        </button>
      </div>

      {/* CATEGORY SUMMARY */}
      <Card title="Category Summary">
        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          Object.entries(categoryTotals).map(([cat, total]) => (
            <div key={cat} style={{ marginBottom: "6px" }}>
              <strong>{cat}:</strong> ${total.toLocaleString()}
            </div>
          ))
        )}
      </Card>

      {/* TRANSACTIONS */}
      <Card
        title="Transactions"
        actionButton={{
          label: "Add Transaction",
          onClick: () => {
            setEditItem(null);
            setShowModal(true);
          }
        }}
      >
        {loading ? (
          <SkeletonTable rows={8} />
        ) : (
          <TransactionTable
            data={paginated}
            onEdit={(t) => {
              setEditItem(t);
              setShowModal(true);
            }}
            onDuplicate={(t) => {
              const clone = { ...t, id: undefined };
              setEditItem(clone);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />
        )}

        {!loading && (
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </Card>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editItem={editItem}
          categoryList={CATEGORY_LIST}
        />
      )}
    </div>
  );
}
