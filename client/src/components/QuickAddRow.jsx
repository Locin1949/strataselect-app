import React, { useState } from "react";
import CategorySuggest from "./CategorySuggest";
import { CATEGORY_LIST } from "../data/categories";

export default function QuickAddRow({ onAdd }) {
  const [form, setForm] = useState({
    date: "",
    category: "",
    fund: "Admin",
    amount: "",
    description: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit() {
    if (!form.date || !form.category || !form.amount) return;
    onAdd(form);
    setForm({ date: "", category: "", fund: "Admin", amount: "", description: "" });
  }

  return (
    <tr style={{ background: "#f9fafb" }}>
      <td>
        <input name="date" type="date" value={form.date} onChange={handleChange} style={input} />
      </td>

      <td>
        <CategorySuggest
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          suggestions={CATEGORY_LIST}
          fund={form.fund}
        />
      </td>

      <td>
        <select name="fund" value={form.fund} onChange={handleChange} style={input}>
          <option>Admin</option>
          <option>Sinking</option>
        </select>
      </td>

      <td>
        <input name="amount" type="number" value={form.amount} onChange={handleChange} style={input} />
      </td>

      <td>
        <input name="description" value={form.description} onChange={handleChange} style={input} />
      </td>

      <td>
        <button onClick={submit} style={btnSmall}>+</button>
      </td>
    </tr>
  );
}

const input = {
  width: "100%",
  padding: "6px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

const btnSmall = {
  padding: "4px 8px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
