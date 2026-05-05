import React from 'react';

export default function ClassifyStep({ classified, onNext, onBack, onViewLogs }) {
  return (
    <div>
      <h3>Step 3: Classification</h3>

      {!classified && (
        <button onClick={onNext} className="px-4 py-2 bg-blue-600 text-white rounded">
          Run Classification
        </button>
      )}

      {classified && (
        <>
          <table className="min-w-full text-sm mt-4">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Vendor</th>
                <th className="px-2 py-1">Description</th>
                <th className="px-2 py-1">Amount</th>
                <th className="px-2 py-1">Suggested Category</th>
                <th className="px-2 py-1">Confidence</th>
                <th className="px-2 py-1">Logs</th>
              </tr>
            </thead>

            <tbody>
              {classified.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-2 py-1">{row.date}</td>
                  <td className="px-2 py-1">{row.vendor}</td>
                  <td className="px-2 py-1">{row.description}</td>
                  <td className="px-2 py-1">${row.amount}</td>
                  <td className="px-2 py-1">{row.suggestedCategory}</td>
                  <td className="px-2 py-1">{row.automationConfidence}%</td>
                  <td className="px-2 py-1">
                    <button
                      onClick={() => onViewLogs(row.automationLogs)}
                      className="text-blue-600 underline text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-2">
            <button onClick={onBack} className="px-4 py-2 bg-slate-500 text-white rounded">
              Back
            </button>

            <button onClick={onNext} className="px-4 py-2 bg-green-600 text-white rounded">
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}
