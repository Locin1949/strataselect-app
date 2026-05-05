import React from 'react';

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search description…"
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
        className="border px-3 py-2 rounded w-48"
      />

      <select
        value={filters.category}
        onChange={e => setFilters({ ...filters, category: e.target.value })}
        className="border px-3 py-2 rounded"
      >
        <option value="All">All Categories</option>
        <option value="Admin">Admin</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Utilities">Utilities</option>
        <option value="Insurance">Insurance</option>
      </select>

      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
        className="border px-3 py-2 rounded"
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
        className="border px-3 py-2 rounded"
      />
    </div>
  );
}
