import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

import { importCommit } from '../../api';

export default function CommitStep({ classified, onBack }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleCommit() {
    try {
      setLoading(true);
      const stored = localStorage.getItem('committeeUser');
      const user = stored ? JSON.parse(stored) : null;

      await importCommit(user.id, classified);
      setDone(true);
    } catch {
      setError('Failed to commit import');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2>Commit Import</h2>
      <p>Finalize the import and write the data into the system.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {done ? (
        <h3 style={{ color: '#16a34a' }}>Import Complete</h3>
      ) : (
        <>
          <pre style={{ marginTop: '15px' }}>{JSON.stringify(classified, null, 2)}</pre>

          <div style={{ marginTop: '20px' }}>
            <button onClick={onBack} style={{ marginRight: '10px' }}>
              Back
            </button>

            <button onClick={handleCommit} disabled={loading}>
              {loading ? 'Committing…' : 'Commit Import'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
