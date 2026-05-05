import '../styles/Cards.css';
import '../styles/Forms.css';

import React from 'react';

export default function ReverseReviewStep({ exported, setReviewed, onNext, onBack }) {
  const hasData = Array.isArray(exported) && exported.length > 0;

  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2 className="text-xl font-semibold mb-2">Review Exported Data</h2>
      <p className="text-slate-600">
        Confirm the exported dataset before uploading your modified file.
      </p>

      {/* DATA PREVIEW */}
      <div
        style={{
          marginTop: '20px',
          maxHeight: '350px',
          overflowY: 'auto',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '12px'
        }}
      >
        {hasData ? (
          <pre className="text-sm text-slate-800">{JSON.stringify(exported, null, 2)}</pre>
        ) : (
          <p className="text-slate-500 italic">No exported data available.</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition"
        >
          Back
        </button>

        <button
          onClick={() => {
            setReviewed(exported);
            onNext();
          }}
          disabled={!hasData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
