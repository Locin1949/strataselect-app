import React, { useState } from 'react';

// FIXED IMPORT — removed alias
import { CATEGORY_LIST } from '../data/categoryList';

export default function BulkActions({ selectedIds, onBulkDelete, onBulkCategory }) {
  const [category, setCategory] = useState('');

  if (selectedIds.length === 0) return null;

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-md p-4 flex items-center justify-between">
      <span className="text-sm text-slate-700">{selectedIds.length} selected</span>

      <div className="flex items-center gap-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Change category…</option>
          {CATEGORY_LIST.map(c => (
            <option key={c.name} value={c.name}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => onBulkCategory(category)}
          disabled={!category}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-40"
        >
          Apply
        </button>

        <button onClick={onBulkDelete} className="px-3 py-1 bg-red-600 text-white rounded">
          Delete Selected
        </button>
      </div>
    </div>
  );
}
