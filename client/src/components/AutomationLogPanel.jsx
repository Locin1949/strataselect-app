import React from 'react';

export default function AutomationLogPanel({ logs, onClose }) {
  return (
    <div style={overlay}>
      <div style={box}>
        <h2 style={title}>Automation Logs</h2>

        <div style={logContainer}>
          {logs.map((line, i) => (
            <div key={i} style={logLine}>
              • {line}
            </div>
          ))}
        </div>

        <button onClick={onClose} style={btnClose}>
          Close
        </button>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
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
  width: '480px',
  maxHeight: '70vh',
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const title = {
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '12px'
};

const logContainer = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '12px',
  marginBottom: '16px'
};

const logLine = {
  fontSize: '14px',
  marginBottom: '6px',
  color: '#334155'
};

const btnClose = {
  padding: '8px 14px',
  background: '#475569',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
