import '../styles/Layout.css';

import React from 'react';

export default function PageWrapper({ title, actions, children }) {
  return (
    <div className="page-container">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <h1 className="page-title">{title}</h1>
        {actions && <div>{actions}</div>}
      </div>

      {children}
    </div>
  );
}
