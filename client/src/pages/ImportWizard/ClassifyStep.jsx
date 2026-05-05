import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

import { importClassify } from '../../api';

export default function ClassifyStep({ detected, setClassified, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClassify() {
    try {
      setLoading(true);
      const stored = localStorage.getItem('committeeUser');
      const user = stored ? JSON.parse(stored) : null;

      const result = await importClassify(user.id, detected);
      setClassified(result);
      onNext();
    } catch {
      setError('Failed to classify data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2>Classify Data</h2>
      <p>Review the detected data and confirm classification.</p>

      {detected && <pre style={{ marginTop: '15px' }}>{JSON.stringify(detected, null, 2)}</pre>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <button onClick={onBack} style={{ marginRight: '10px' }}>
          Back
        </button>

        <button onClick={handleClassify} disabled={loading}>
          {loading ? 'Classifying…' : 'Next'}
        </button>
      </div>
    </div>
  );
}
