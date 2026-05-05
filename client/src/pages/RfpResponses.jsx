import '../styles/Tables.css';
import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useEffect, useState } from 'react';

import { getRfpResponsesSummary } from '../api';

export default function RfpResponses() {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [contractor, setContractor] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem('committeeUser');
        const user = stored ? JSON.parse(stored) : null;

        const data = await getRfpResponsesSummary(user.id);
        setResponses(data);
        setFiltered(data);
      } catch {
        setError('Failed to load RFP responses');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // FILTERING
  useEffect(() => {
    let result = [...responses];

    if (search.trim() !== '') {
      result = result.filter(r => r.notes.toLowerCase().includes(search.toLowerCase()));
    }

    if (contractor !== 'All') {
      result = result.filter(r => r.contractor === contractor);
    }

    setFiltered(result);
  }, [search, contractor, responses]);

  // SUMMARY
  const total = responses.length;
  const avgQuote =
    total > 0 ? Math.round(responses.reduce((sum, r) => sum + Number(r.quote), 0) / total) : 0;

  const contractors = [...new Set(responses.map(r => r.contractor))];

  if (loading) return <h2>Loading RFP responses…</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div>
      <h1>RFP Responses</h1>

      {/* SUMMARY CARDS */}
      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>Total Responses</h3>
          <p>{total}</p>
        </div>

        <div className="dash-card">
          <h3>Contractors</h3>
          <p>{contractors.length}</p>
        </div>

        <div className="dash-card">
          <h3>Average Quote</h3>
          <p>${avgQuote.toLocaleString()}</p>
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

        <select
          value={contractor}
          onChange={e => setContractor(e.target.value)}
          style={{ width: '200px' }}
        >
          <option>All</option>
          {contractors.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Contractor</th>
            <th>Quote</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td>{r.contractor}</td>
              <td>${Number(r.quote).toLocaleString()}</td>
              <td>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
