import React from 'react';

import CategorySuggest from './CategorySuggest';

export default function SplitEditor({ splits, onChange, categoryList }) {
  const update = (index, field, value) => {
    const next = [...splits];
    next[index][field] = value;
    onChange(next);
  };

  return (
    <div style={box}>
      <h3 style={title}>Split Transaction</h3>

      {splits.map((s, i) => (
        <div key={i} style={row}>
          <input
            type="number"
            placeholder="Amount"
            value={s.amount || ''}
            onChange={e => update(i, 'amount', e.target.value)}
            style={amountInput}
          />

          <CategorySuggest
            value={s.category}
            onChange={v => update(i, 'category', v)}
            suggestions={categoryList}
            fund="Admin"
            description={s.description}
            amount={s.amount}
            automationMode="assisted"
          />
        </div>
      ))}
    </div>
  );
}

const box = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '12px',
  marginTop: '12px'
};

const title = { fontSize: '16px', fontWeight: 600, marginBottom: '8px' };

const row = {
  display: 'flex',
  gap: '8px',
  marginBottom: '8px'
};

const amountInput = {
  width: '100px',
  padding: '6px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};
