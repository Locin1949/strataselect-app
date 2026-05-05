import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

export default function SplitReview({ splitSuggestion = [], onApply, onCancel }) {
  const [rows, setRows] = useState(splitSuggestion);

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3">Review Split</h2>

      {rows.length === 0 && <p className="text-gray-600">No split suggestions available.</p>}

      {rows.map((row, index) => (
        <div key={index} className="mb-4 border p-3 rounded bg-gray-50">
          <div className="form-row">
            <label>Amount</label>
            <input
              type="number"
              value={row.amount}
              onChange={e => updateRow(index, 'amount', Number(e.target.value))}
            />
          </div>

          <div className="form-row">
            <label>Category</label>
            <input
              type="text"
              value={row.category}
              onChange={e => updateRow(index, 'category', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Description</label>
            <input
              type="text"
              value={row.description}
              onChange={e => updateRow(index, 'description', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        <button className="btn-primary" onClick={() => onApply(rows)}>
          Apply Split
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
