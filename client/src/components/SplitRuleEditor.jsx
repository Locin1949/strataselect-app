import React, { useState } from 'react';

export default function SplitRuleEditor({ rule, onClose, onSave }) {
  const [splits, setSplits] = useState(rule.value);

  function updateSplit(i, field, value) {
    const updated = [...splits];
    updated[i][field] = value;
    setSplits(updated);
  }

  return (
    <div style={overlay}>
      <div style={box}>
        <h2 className="text-xl font-semibold mb-4">Edit Split Rule</h2>

        {splits.map((s, i) => (
          <div key={i} className="mb-3">
            <input
              className="border p-1 mr-2"
              value={s.category}
              onChange={e => updateSplit(i, 'category', e.target.value)}
            />
            <input
              className="border p-1 w-20"
              value={s.amount}
              onChange={e => updateSplit(i, 'amount', e.target.value)}
            />
          </div>
        ))}

        <div className="flex gap-3 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => onSave(splits)}
          >
            Save
          </button>
          <button className="px-4 py-2 bg-slate-500 text-white rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
};

const box = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '360px'
};
