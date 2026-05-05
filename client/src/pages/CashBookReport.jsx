import React, { useEffect, useMemo,useState } from 'react';

const API = process.env.REACT_APP_API_URL;

function CashBookReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load cashbook');
        }
        return res.json();
      })
      .then(data => {
        setRows(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // -----------------------------
  // RUNNING BALANCE
  // -----------------------------
  const rowsWithBalance = useMemo(() => {
    let balance = 0;
    return rows.map(r => {
      balance += Number(r.amount || 0);
      return { ...r, runningBalance: balance };
    });
  }, [rows]);

  // -----------------------------
  // SUMMARY
  // -----------------------------
  const summary = useMemo(() => {
    if (rowsWithBalance.length === 0) {
      return {
        opening: 0,
        income: 0,
        expenses: 0,
        closing: 0,
        fundTotals: {},
        categoryTotals: {}
      };
    }

    const opening = rowsWithBalance[0].runningBalance - rowsWithBalance[0].amount;
    const closing = rowsWithBalance[rowsWithBalance.length - 1].runningBalance;

    let income = 0;
    let expenses = 0;
    const fundTotals = {};
    const categoryTotals = {};

    rowsWithBalance.forEach(r => {
      const amt = Number(r.amount || 0);

      if (amt >= 0) income += amt;
      else expenses += Math.abs(amt);

      fundTotals[r.fund] = (fundTotals[r.fund] || 0) + amt;
      categoryTotals[r.category] = (categoryTotals[r.category] || 0) + amt;
    });

    return { opening, income, expenses, closing, fundTotals, categoryTotals };
  }, [rowsWithBalance]);

  // -----------------------------
  // MONTHLY GROUPING
  // -----------------------------
  const monthlyGroups = useMemo(() => {
    const groups = {};
    rowsWithBalance.forEach(r => {
      const month = r.date?.slice(0, 7);
      if (!month) return;
      if (!groups[month]) groups[month] = [];
      groups[month].push(r);
    });
    return groups;
  }, [rowsWithBalance]);

  if (loading) return <div>Loading report…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            button, nav, input, select { display: none !important; }
            body * { visibility: hidden; }
            #print-area, #print-area * { visibility: visible; }
            #print-area { position: absolute; left: 0; top: 0; width: 100%; }
            table { page-break-inside: avoid; }
          }
        `}
      </style>

      <button onClick={() => window.print()}>Print PDF</button>

      <div id="print-area">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1>Surfers Palms North – Cash Book Report</h1>
          <div>{new Date().toLocaleDateString()}</div>
        </div>

        {/* SUMMARY */}
        <h2>Summary</h2>
        <table className="report-table" style={{ width: '60%', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <td>Opening Balance</td>
              <td>{summary.opening.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total Income</td>
              <td style={{ color: 'green' }}>{summary.income.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total Expenses</td>
              <td style={{ color: 'red' }}>{summary.expenses.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Closing Balance</td>
              <td>{summary.closing.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* MONTHLY SUMMARY */}
        <h2>Monthly Summary</h2>
        <table className="report-table" style={{ width: '80%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyGroups)
              .sort(([a], [b]) => (a < b ? -1 : 1))
              .map(([month, items]) => {
                const income = items.filter(i => i.amount >= 0).reduce((a, b) => a + b.amount, 0);
                const expenses = items
                  .filter(i => i.amount < 0)
                  .reduce((a, b) => a + Math.abs(b.amount), 0);
                const net = income - expenses;

                return (
                  <tr key={month}>
                    <td>{month}</td>
                    <td style={{ color: 'green' }}>{income.toFixed(2)}</td>
                    <td style={{ color: 'red' }}>{expenses.toFixed(2)}</td>
                    <td>{net.toFixed(2)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* FUND TOTALS */}
        <h2>Fund Totals</h2>
        <table className="report-table" style={{ width: '60%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Fund</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary.fundTotals).map(([fund, total]) => (
              <tr key={fund}>
                <td>{fund}</td>
                <td style={{ color: total < 0 ? 'red' : 'green' }}>{total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CATEGORY TOTALS */}
        <h2>Category Totals</h2>
        <table className="report-table" style={{ width: '80%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary.categoryTotals).map(([cat, total]) => (
              <tr key={cat}>
                <td>{cat}</td>
                <td style={{ color: total < 0 ? 'red' : 'green' }}>{total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TRANSACTIONS */}
        <h2>Transactions</h2>
        <table className="report-table" style={{ width: '100%' }}>
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
            {rowsWithBalance.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.description}</td>
                <td>{r.vendor}</td>
                <td>{r.reference}</td>
                <td>{r.fund}</td>
                <td>{r.category}</td>
                <td style={{ color: r.amount < 0 ? 'red' : 'green' }}>{r.amount.toFixed(2)}</td>
                <td>{r.runningBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashBookReport;
