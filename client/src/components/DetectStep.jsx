import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

import { importDetect } from '../api';

export default function DetectStep({ file, setDetected, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDetect() {
    try {
      setLoading(true);
      const stored = localStorage.getItem('committeeUser');
      const user = stored ? JSON.parse(stored) : null;

      const result = await importDetect(user.id, file);
      setDetected(result);
      onNext();
    } catch {
      setError('Failed to detect structure');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2>Detect Structure</h2>
      <p>We will automatically analyze the file and detect column structure.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <button onClick={onBack} style={{ marginRight: '10px' }}>
          Back
        </button>

        <button onClick={handleDetect} disabled={loading}>
          {loading ? 'Detecting…' : 'Next'}
        </button>
      </div>
    </div>
  );
}
