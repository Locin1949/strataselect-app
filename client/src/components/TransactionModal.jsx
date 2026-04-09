import React, { useState } from "react";
import CategorySuggest from "./CategorySuggest";

export default function TransactionModal({ onClose, onSave, editItem, categoryList }) {
  const [form, setForm] = useState(
    editItem || {
      date: "",
      category: "",
      fund: "Admin",
      amount: "",
      description: "",
      receipt: null
    }
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (!form.date || !form.category || !form.amount) return;
    onSave(form);
  }

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h2 style={{ marginBottom: "10px" }}>
          {editItem ? "Edit Transaction" : "Add Transaction"}
        </h2>

        {/* DATE */}
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          style={input}
        />

        {/* CATEGORY AUTOSUGGEST */}
        <CategorySuggest
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          suggestions={categoryList}
          fund={form.fund}
        />

        {/* FUND */}
        <select
          name="fund"
          value={form.fund}
          onChange={handleChange}
          style={input}
        >
          <option>Admin</option>
          <option>Sinking</option>
        </select>

        {/* AMOUNT */}
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          style={input}
        />

        {/* DESCRIPTION */}
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={input}
        />

        {/* RECEIPT UPLOAD */}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) =>
            setForm({ ...form, receipt: e.target.files[0] })
          }
          style={input}
        />

        {form.receipt && (
          <div style={{ marginTop: "10px", fontSize: "14px" }}>
            Attached: {form.receipt.name}
          </div>
        )}

        {/* BUTTONS */}
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={handleSubmit} style={btnPrimary}>
            Save
          </button>
          <button onClick={onClose} style={btnSecondary}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalBox = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "350px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
};

const input = {
  width: "100%",
  padding: "8px",
  marginTop: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

const btnPrimary = {
  padding: "8px 14px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const btnSecondary = {
  padding: "8px 14px",
  background: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
