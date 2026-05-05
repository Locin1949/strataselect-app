import React, { useState } from 'react';

export default function VendorMergeTool({ vendorMap, onMerge }) {
  const vendors = Object.keys(vendorMap || {});
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Vendor Merge Tool</h2>

      <div className="flex gap-3">
        <select className="border p-2 rounded" value={from} onChange={e => setFrom(e.target.value)}>
          <option value="">Select vendor to merge</option>
          {vendors.map(v => (
            <option key={v}>{v}</option>
          ))}
        </select>

        <select className="border p-2 rounded" value={to} onChange={e => setTo(e.target.value)}>
          <option value="">Merge into…</option>
          {vendors.map(v => (
            <option key={v}>{v}</option>
          ))}
        </select>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            if (from && to && from !== to) onMerge(from, to);
          }}
        >
          Merge
        </button>
      </div>
    </div>
  );
}
