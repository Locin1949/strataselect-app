import html2canvas from 'html2canvas';
import React, { useMemo, useRef,useState } from 'react';

export default function FundPerformance({ transactions }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [year, setYear] = useState('');
  const [selectedFund, setSelectedFund] = useState('All');
  const [printMode, setPrintMode] = useState(false);

  const dashboardRef = useRef(null);

  // Unique years from transactions
  const years = useMemo(() => {
    const set = new Set();
    (transactions || []).forEach(tx => {
      if (!tx.date) return;
      const y = new Date(tx.date).getFullYear();
      if (!isNaN(y)) set.add(y);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Unique funds
  const funds = useMemo(() => {
    const set = new Set();
    (transactions || []).forEach(tx => {
      set.add(tx.fund || 'Admin');
    });
    return ['All', ...Array.from(set)];
  }, [transactions]);

  // Filter by date range, year, and fund
  const filtered = useMemo(() => {
    return (transactions || []).filter(tx => {
      const d = new Date(tx.date);
      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate)) return false;
      if (year && d.getFullYear().toString() !== year.toString()) return false;
      if (selectedFund !== 'All' && (tx.fund || 'Admin') !== selectedFund) {
        return false;
      }
      return true;
    });
  }, [transactions, startDate, endDate, year, selectedFund]);

  // Summaries by fund
  const summary = useMemo(() => {
    const byFund = {};

    filtered.forEach(tx => {
      const fund = tx.fund || 'Admin';
      if (!byFund[fund]) {
        byFund[fund] = { fund, inflow: 0, outflow: 0, net: 0 };
      }

      const amount = Number(tx.amount || 0);
      if (amount > 0) byFund[fund].inflow += amount;
      else byFund[fund].outflow += Math.abs(amount);

      byFund[fund].net = byFund[fund].inflow - byFund[fund].outflow;
    });

    return Object.values(byFund);
  }, [filtered]);

  // Per-category breakdown per fund
  const categoryBreakdown = useMemo(() => {
    const byFund = {};

    filtered.forEach(tx => {
      const fund = tx.fund || 'Admin';
      const category = tx.category || 'Uncategorized';
      if (!byFund[fund]) byFund[fund] = {};
      if (!byFund[fund][category]) byFund[fund][category] = 0;
      byFund[fund][category] += Number(tx.amount || 0);
    });

    return byFund;
  }, [filtered]);

  // CSV Export
  function exportCSV() {
    const header = 'Fund,Inflows,Outflows,Net\n';
    const rows = summary
      .map(r => `${r.fund},${r.inflow.toFixed(2)},${r.outflow.toFixed(2)},${r.net.toFixed(2)}`)
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'fund_performance.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Download dashboard as PNG
  async function downloadPNG() {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current);
    const dataUrl = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'fund_performance.png';
    a.click();
  }

  // Print-friendly mode
  function handlePrint() {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  }

  return (
    <div className={printMode ? 'bg-white' : 'bg-slate-50'}>
      <div ref={dashboardRef} className="p-6 space-y-10">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-900 flex-1">Fund Performance</h1>

          <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={exportCSV}>
            Export CSV
          </button>

          <button className="px-3 py-2 bg-emerald-600 text-white rounded" onClick={downloadPNG}>
            Download PNG
          </button>

          <button className="px-3 py-2 bg-slate-700 text-white rounded" onClick={handlePrint}>
            Print
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-slate-600">Start Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">End Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Year</label>
            <select
              className="border p-2 rounded"
              value={year}
              onChange={e => setYear(e.target.value)}
            >
              <option value="">All</option>
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600">Fund</label>
            <select
              className="border p-2 rounded"
              value={selectedFund}
              onChange={e => setSelectedFund(e.target.value)}
            >
              {funds.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Table */}
        <table className="w-full text-sm border bg-white">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">Fund</th>
              <th className="p-2">Inflows</th>
              <th className="p-2">Outflows</th>
              <th className="p-2">Net</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(row => (
              <tr key={row.fund} className="border-t">
                <td className="p-2">{row.fund}</td>
                <td className="p-2">${row.inflow.toFixed(2)}</td>
                <td className="p-2">${row.outflow.toFixed(2)}</td>
                <td className="p-2" style={{ color: row.net >= 0 ? 'green' : 'red' }}>
                  ${row.net.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Simple Bar Charts */}
        <div className="space-y-10 mt-10">
          {summary.map(row => (
            <div key={row.fund}>
              <h3 className="font-semibold mb-2">{row.fund} Bar Chart</h3>

              <div className="flex gap-4 items-end h-24">
                {/* Inflow */}
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      height: `${Math.min(row.inflow, 200)}px`,
                      width: '20px',
                      background: 'green'
                    }}
                  />
                  <span className="text-xs mt-1">In</span>
                </div>

                {/* Outflow */}
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      height: `${Math.min(row.outflow, 200)}px`,
                      width: '20px',
                      background: 'red'
                    }}
                  />
                  <span className="text-xs mt-1">Out</span>
                </div>

                {/* Net */}
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      height: `${Math.min(Math.abs(row.net), 200)}px`,
                      width: '20px',
                      background: row.net >= 0 ? 'green' : 'red'
                    }}
                  />
                  <span className="text-xs mt-1">Net</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trend Lines */}
        <div className="space-y-10 mt-10">
          {summary.map(row => {
            const monthly = Array(12).fill(0);

            filtered.forEach(tx => {
              if ((tx.fund || 'Admin') !== row.fund) return;
              const m = new Date(tx.date).getMonth();
              monthly[m] += Number(tx.amount || 0);
            });

            const max = Math.max(...monthly.map(v => Math.abs(v))) || 1;

            const points = monthly
              .map((v, i) => {
                const x = (i / 11) * 300;
                const y = 80 - (v / max) * 80;
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <div key={row.fund}>
                <h3 className="font-semibold mb-2">{row.fund} Monthly Trend</h3>

                <svg width="320" height="100" style={{ background: '#f1f5f9' }}>
                  <polyline
                    fill="none"
                    stroke={row.net >= 0 ? 'green' : 'red'}
                    strokeWidth="2"
                    points={points}
                  />
                </svg>
              </div>
            );
          })}
        </div>

        {/* Monthly Breakdown */}
        <div className="space-y-10 mt-10">
          {summary.map(row => {
            const monthly = Array(12).fill(0);

            filtered.forEach(tx => {
              if ((tx.fund || 'Admin') !== row.fund) return;
              const m = new Date(tx.date).getMonth();
              monthly[m] += Number(tx.amount || 0);
            });

            const max = Math.max(...monthly.map(v => Math.abs(v))) || 1;

            return (
              <div key={row.fund}>
                <h3 className="font-semibold mb-2">{row.fund} Monthly Breakdown</h3>

                <div className="flex gap-2 items-end h-32">
                  {monthly.map((v, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        style={{
                          height: `${(Math.abs(v) / max) * 120}px`,
                          width: '20px',
                          background: v >= 0 ? 'green' : 'red'
                        }}
                      />
                      <span className="text-xs mt-1">
                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Per-category breakdown per fund */}
        <div className="space-y-10 mt-10">
          {Object.entries(categoryBreakdown).map(([fund, categories]) => (
            <div key={fund}>
              <h3 className="font-semibold mb-2">{fund} — Category Breakdown</h3>
              <table className="w-full text-sm border bg-white">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="p-2">Category</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categories).map(([cat, total]) => (
                    <tr key={cat} className="border-t">
                      <td className="p-2">{cat}</td>
                      <td className="p-2">${Number(total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Admin vs Sinking Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Admin vs Sinking Comparison</h2>

          <div className="flex gap-10 flex-wrap">
            {['Admin', 'Sinking'].map(fund => {
              const row = summary.find(s => s.fund === fund) || {
                inflow: 0,
                outflow: 0,
                net: 0
              };

              return (
                <div key={fund} className="p-4 border rounded w-64 bg-white">
                  <h3 className="font-semibold mb-2">{fund}</h3>
                  <p>Inflows: ${row.inflow.toFixed(2)}</p>
                  <p>Outflows: ${row.outflow.toFixed(2)}</p>
                  <p style={{ color: row.net >= 0 ? 'green' : 'red' }}>
                    Net: ${row.net.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
