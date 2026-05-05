import React, { useEffect, useMemo,useState } from 'react';

const API = process.env.REACT_APP_API_URL;

function CashBook() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundFilter, setFundFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');

  // -----------------------------
  // FETCH DATA
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    fetch(`${API}/financials/cashbook`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load data');
        }
        return res.json();
      })
      .then(data => {
        setRows(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error loading data');
        setLoading(false);
      });
  }, []);

  // -----------------------------
  // FILTERED ROWS
  // -----------------------------
  const filteredRows = useMemo(() => {
    return rows
      .filter(r => (fundFilter === 'all' ? true : r.fund === fundFilter))
      .filter(r => (categoryFilter ? r.category === categoryFilter : true))
      .filter(r =>
        search ? Object.values(r).join(' ').toLowerCase().includes(search.toLowerCase()) : true
      );
  }, [rows, fundFilter, categoryFilter, search]);

  // -----------------------------
  // RUNNING BALANCE
  // -----------------------------
  const rowsWithBalance = useMemo(() => {
    let running = 0;
    return filteredRows.map(r => {
      running += Number(r.amount || 0);
      return { ...r, runningBalance: running };
    });
  }, [filteredRows]);

  // -----------------------------
  // SUMMARY CALCULATIONS
  // -----------------------------
  const summary = useMemo(() => {
    const total = filteredRows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const categoryTotals = {};
    filteredRows.forEach(r => {
      if (!categoryTotals[r.category]) categoryTotals[r.category] = 0;
      categoryTotals[r.category] += Number(r.amount || 0);
    });

    return { total, categoryTotals };
  }, [filteredRows]);

  // -----------------------------
  // LOADING / ERROR STATES
  // -----------------------------
  if (loading) return <div>Loading Cash Book…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // -----------------------------
  // UNIQUE FILTER OPTIONS
  // -----------------------------
  const uniqueFunds = [...new Set(rows.map(r => r.fund).filter(Boolean))];
  const uniqueCategories = [...new Set(rows.map(r => r.category).filter(Boolean))];

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div style={{ padding: '20px' }}>
      <h2>Cash Book</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: '20px' }}>
        <select value={fundFilter} onChange={e => setFundFilter(e.target.value)}>
          <option value="all">All Funds</option>
          {uniqueFunds.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>

      {/* SUMMARY */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Total:</strong> ${summary.total.toFixed(2)}
      </div>

      {/* TABLE */}
      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Vendor</th>
            <th>Reference</th>
            <th>Fund</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Running Balance</th>
          </tr>
        </thead>
        <tbody>
          {rowsWithBalance.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.description}</td>
              <td>{r.vendor}</td>
              <td>{r.reference}</td>
              <td>{r.fund}</td>
              <td>{r.category}</td>
              <td>${Number(r.amount).toFixed(2)}</td>
              <td>${r.runningBalance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CashBook;
