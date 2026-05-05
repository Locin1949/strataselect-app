import React, { useState } from 'react';

import { runAutomation } from '@/automation/orchestrator';
import AutomationLogPanel from '@/components/AutomationLogPanel';

export default function AutomationSandbox() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [logs, setLogs] = useState(null);

  function runSandbox() {
    const lines = input.split('\n').filter(l => l.trim() !== '');

    const parsed = lines.map(line => {
      const [date, description, vendor, amount, fund] = line.split(',');

      const auto = runAutomation({
        date,
        description,
        vendor,
        amount,
        fund: fund || 'Admin'
      });

      return {
        line,
        ...auto
      };
    });

    setResults(parsed);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Automation Sandbox</h1>
      <p className="text-slate-600">Paste CSV rows (date, description, vendor, amount, fund).</p>

      <textarea
        className="w-full border p-3 rounded h-40"
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={runSandbox}>
        Run Automation
      </button>

      <table className="w-full text-sm border mt-6">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="p-2">Input</th>
            <th className="p-2">Category</th>
            <th className="p-2">Confidence</th>
            <th className="p-2">Split</th>
            <th className="p-2">Logs</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{r.line}</td>
              <td className="p-2">{r.category || '—'}</td>
              <td className="p-2">{r.confidence}</td>
              <td className="p-2">{r.split ? `${r.split.length} parts` : '—'}</td>
              <td className="p-2">
                <button className="text-blue-600 underline" onClick={() => setLogs(r.logs)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {logs && <AutomationLogPanel logs={logs} onClose={() => setLogs(null)} />}
    </div>
  );
}
