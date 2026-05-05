import React from 'react';

export default function ImportWizard({ detectMutation, classifyMutation, commitMutation }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-2">Import Wizard</h3>

      <button
        onClick={() => detectMutation.mutate()}
        className="px-3 py-2 bg-blue-600 text-white rounded mr-2"
      >
        Detect File
      </button>

      <button
        onClick={() => classifyMutation.mutate()}
        className="px-3 py-2 bg-amber-600 text-white rounded mr-2"
      >
        Classify
      </button>

      <button
        onClick={() => commitMutation.mutate()}
        className="px-3 py-2 bg-emerald-600 text-white rounded"
      >
        Commit Import
      </button>
    </div>
  );
}
