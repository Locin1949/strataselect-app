import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

import { getFinancialTransactions } from '../../api';

export default function ReverseExportStep({ setExported, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleExport() {
    try {
      setLoading(true);
      setError('');

      const stored = localStorage.getItem('committeeUser');
      const user = stored ? JSON.parse(stored) : null;

      const data = await getFinancialTransactions(user.id);
      setExported(data);

      // Build CSV with proper escaping
      const headers = ['id', 'date', 'category', 'fund', 'amount', 'description'];

      const escape = value =>
        typeof value === 'string' && value.includes(',')
          ? `"${value.replace(/"/g, '""')}"`
          : (value ?? '');

      const rows = [headers, ...data.map(t => headers.map(h => escape(t[h])))];

      const csv = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'reverse_export.csv';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      onNext();
    } catch {
      setError('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2 className="text-xl font-semibold mb-2">Export Data</h2>
      <p className="text-slate-600">
        Download the current financial dataset to review, modify, and prepare for reverse import.
      </p>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleExport}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Exporting…' : 'Export Data'}
        </button>
      </div>
    </div>
  );
}
