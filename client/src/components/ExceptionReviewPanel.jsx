import React from 'react';

import ConfidenceBadge from './ConfidenceBadge';

export default function ExceptionReviewPanel({ exceptions, onFixCategory }) {
  if (!exceptions || exceptions.length === 0) return null;

  return (
    <div style={panel}>
      <h3 style={title}>Exceptions Requiring Review</h3>

      {exceptions.map(ex => (
        <div key={ex.id} style={row}>
          <div style={{ flex: 1 }}>
            <div style={desc}>{ex.description}</div>
            <div style={small}>Amount: ${ex.amount}</div>
          </div>

          <ConfidenceBadge confidence={ex.confidence} />

          <select
            value={ex.category || ''}
            onChange={e => onFixCategory(ex.id, e.target.value)}
            style={select}
          >
            <option value="">Select category…</option>
            {ex.allCategories.map(c => (
              <option key={c.name} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

const panel = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '16px'
};

const title = {
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '12px'
};

const row = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 0',
  borderBottom: '1px solid #f3f4f6'
};

const desc = { fontSize: '14px', fontWeight: 500 };
const small = { fontSize: '12px', color: '#6b7280' };

const select = {
  padding: '6px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};
