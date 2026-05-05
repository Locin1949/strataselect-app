import React, { useState } from 'react';

export default function LearningRuleEditor({ rule, onClose, onSave }) {
  const [category, setCategory] = useState(rule.value);

  return (
    <div style={overlay}>
      <div style={box}>
        <h2 className="text-xl font-semibold mb-4">Edit Rule</h2>

        <p className="text-slate-600 mb-2">
          <strong>{rule.key}</strong>
        </p>

        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-3 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => onSave(category)}
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
