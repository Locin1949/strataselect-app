import '../styles/Tables.css';
import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useEffect, useState } from 'react';

import { getReverseImportHistory } from '../api';

export default function ReverseImportHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem('committeeUser');
        const user = stored ? JSON.parse(stored) : null;

        const data = await getReverseImportHistory(user.id);
        setHistory(data);
        setFiltered(data);
      } catch {
        setError('Failed to load reverse import history');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // FILTERING
  useEffect(() => {
    let result = [...history];

    if (search.trim() !== '') {
      result = result.filter(h => h.note.toLowerCase().includes(search.toLowerCase()));
    }

    if (status !== 'All') {
      result = result.filter(h => h.status === status);
    }

    setFiltered(result);
  }, [search, status, history]);

  // SUMMARY
  const total = history.length;
  const completed = history.filter(h => h.status === 'Completed').length;
  const failed = history.filter(h => h.status === 'Failed').length;

  if (loading) return <h2>Loading reverse import history…</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div>
      <h1>Reverse Import History</h1>

      {/* SUMMARY CARDS */}
      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>Total Reverse Imports</h3>
          <p>{total}</p>
        </div>

        <div className="dash-card">
          <h3>Completed</h3>
          <p style={{ color: '#16a34a' }}>{completed}</p>
        </div>

        <div className="dash-card">
          <h3>Failed</h3>
          <p style={{ color: '#dc2626' }}>{failed}</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '200px', marginRight: '10px' }}
        />

        <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '150px' }}>
          <option>All</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Status</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(h => (
            <tr key={h.id}>
              <td>{h.timestamp}</td>
              <td>{h.user_name}</td>
              <td>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    color: 'white',
                    background: h.status === 'Completed' ? '#16a34a' : '#dc2626'
                  }}
                >
                  {h.status}
                </span>
              </td>
              <td>{h.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
