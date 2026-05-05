import React, { useState } from 'react';

import AutomationLogPanel from '@/components/AutomationLogPanel';
import ExceptionTable from '@/components/ExceptionTable';
import { clearExceptions,loadExceptions, saveExceptions } from '@/utils/exceptionStore';

export default function ExceptionReview() {
  const [exceptions, setExceptions] = useState(loadExceptions());
  const [logs, setLogs] = useState(null);

  function refresh() {
    setExceptions(loadExceptions());
  }

  function handleApprove(row) {
    const updated = exceptions.filter(x => x !== row);
    saveExceptions(updated);
    refresh();
  }

  function handleDelete(row) {
    const updated = exceptions.filter(x => x !== row);
    saveExceptions(updated);
    refresh();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Exception Review</h1>
      <p className="text-slate-600">
        These transactions require manual review due to low confidence or split suggestions.
      </p>

      <ExceptionTable
        data={exceptions}
        onApprove={handleApprove}
        onDelete={handleDelete}
        onViewLogs={l => setLogs(l)}
      />

      <button
        className="px-4 py-2 bg-red-600 text-white rounded mt-4"
        onClick={() => {
          clearExceptions();
          refresh();
        }}
      >
        Clear All Exceptions
      </button>

      {logs && <AutomationLogPanel logs={logs} onClose={() => setLogs(null)} />}
    </div>
  );
}
