import React from 'react';

export default function ConfidenceBadge({ confidence }) {
  if (confidence == null) return null;

  let color = '#e5e7eb';
  let text = '#374151';

  if (confidence >= 85) {
    color = '#d1fae5';
    text = '#065f46';
  } else if (confidence >= 60) {
    color = '#fef3c7';
    text = '#92400e';
  } else if (confidence > 0) {
    color = '#fee2e2';
    text = '#991b1b';
  }

  return (
    <span
      style={{
        background: color,
        color: text,
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600
      }}
    >
      {confidence}%
    </span>
  );
}
