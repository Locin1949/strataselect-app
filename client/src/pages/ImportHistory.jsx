import React, { useEffect,useState } from 'react';

const API = process.env.REACT_APP_API_URL;

function ImportHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    async function loadHistory() {
      try {
        const res = await fetch(`${API}/financials/import/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load import history');
        }

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message || 'Failed to load import history');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  async function reverseImport(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not logged in');
      return;
    }

    if (!window.confirm('Are you sure you want to reverse this import?')) return;

    try {
      const res = await fetch(`${API}/financials/import/reverse`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to reverse import');
      }

      alert('Import reversed successfully');
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div>Loading Import History…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Import History</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Filename</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Imported On</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Records</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.map(h => (
            <tr key={h.id}>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{h.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{h.filename}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{h.date}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{h.recordCount ?? '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                <button onClick={() => reverseImport(h.id)}>Reverse Import</button>
              </td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>
                No import history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ImportHistory;
