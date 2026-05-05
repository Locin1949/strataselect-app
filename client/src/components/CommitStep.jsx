import React from 'react';

export default function CommitStep({ classified, onBack, onCommit }) {
  return (
    <div>
      <h3>Step 4: Commit</h3>

      {!classified && <p>No classified data found.</p>}

      {classified && (
        <>
          <p className="mt-2">
            You are about to commit <strong>{classified.rows.length}</strong> transactions.
          </p>

          <table className="min-w-full text-sm mt-4">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Vendor</th>
                <th className="px-2 py-1">Description</th>
                <th className="px-2 py-1">Amount</th>
                <th className="px-2 py-1">Category</th>
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
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-2">
            <button onClick={onBack} className="px-4 py-2 bg-slate-500 text-white rounded">
              Back
            </button>

            <button onClick={onCommit} className="px-4 py-2 bg-green-600 text-white rounded">
              Commit Import
            </button>
          </div>
        </>
      )}
    </div>
  );
}
