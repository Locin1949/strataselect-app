import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

import { importCommit } from '../../api';

export default function ReverseCommitStep({ uploaded, onBack }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleCommit() {
    try {
      setLoading(true);

      const stored = localStorage.getItem('committeeUser');
      const user = stored ? JSON.parse(stored) : null;

      await importCommit(user.id, uploaded);
      setDone(true);
    } catch {
      setError('Failed to commit reverse import');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2>Commit Reverse Import</h2>
      <p>Finalize the changes and update the system.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {done ? (
        <h3 style={{ color: '#16a34a' }}>Reverse Import Complete</h3>
      ) : (
        <>
          <div style={{ marginTop: '20px' }}>
            <button onClick={onBack} style={{ marginRight: '10px' }}>
              Back
            </button>

            <button onClick={handleCommit} disabled={loading}>
              {loading ? 'Committing…' : 'Commit Changes'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
