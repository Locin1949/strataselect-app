import React, { useEffect, useMemo,useState } from 'react';

const API = process.env.REACT_APP_API_URL;

function FundSummaryReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    fetch(`${API}/financials/cashbook`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load fund summary');
        }
        return res.json();
      })
      .then(data => {
        setRows(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load fund summary');
        setLoading(false);
      });
  }, []);

  const fundSummary = useMemo(() => {
    const totals = {};
    rows.forEach(r => {
      const amt = Number(r.amount || 0);
      if (!totals[r.fund]) {
        totals[r.fund] = { income: 0, expenses: 0, net: 0 };
      }
      if (amt >= 0) totals[r.fund].income += amt;
      else totals[r.fund].expenses += Math.abs(amt);
      totals[r.fund].net = totals[r.fund].income - totals[r.fund].expenses;
    });
    return totals;
  }, [rows]);

  if (loading) return <div>Loading Fund Summary…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const overall = Object.values(fundSummary).reduce(
    (acc, f) => ({
      income: acc.income + f.income,
      expenses: acc.expenses + f.expenses,
      net: acc.net + f.net
    }),
    { income: 0, expenses: 0, net: 0 }
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Fund Summary Report</h2>

      {/* Overall summary */}
      <table style={{ borderCollapse: 'collapse', width: '50%', marginBottom: '20px' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>Total Income</td>
            <td style={{ border: '1px solid #ccc', padding: '6px', color: 'green' }}>
              {overall.income.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>Total Expenses</td>
            <td style={{ border: '1px solid #ccc', padding: '6px', color: 'red' }}>
              {overall.expenses.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>Net Position</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{overall.net.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Per‑fund breakdown */}
      <table style={{ borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Fund</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Income</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Expenses</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Net</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fundSummary).map(([fund, vals]) => (
            <tr key={fund}>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{fund}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', color: 'green' }}>
                {vals.income.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '6px', color: 'red' }}>
                {vals.expenses.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{vals.net.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FundSummaryReport;
