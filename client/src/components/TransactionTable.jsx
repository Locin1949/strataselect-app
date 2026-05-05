import React, { useMemo, useState } from 'react';

import { getCategoryIcon } from '../utils/categoryHelpers';
import { paginate } from '../utils/pagination';
import { sortData } from '../utils/sortUtils';
// FIXED IMPORTS — removed alias paths
import Pagination from './Pagination';

export default function TransactionTable({ data, onEdit, onDelete, onSelectionChange }) {
  const [sort, setSort] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const pageSize = 10;

  // SORTED DATA
  const sorted = useMemo(() => sortData(data, sort), [data, sort]);

  // PAGINATED DATA
  const paginated = useMemo(() => paginate(sorted, page, pageSize), [sorted, page]);

  // SORT TOGGLE
  const toggleSort = key => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPage(1);
  };

  // ROW SELECTION
  const toggleSelect = id => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];

      onSelectionChange(next);
      return next;
    });
  };

  // SELECT ALL ON PAGE
  const toggleSelectAll = () => {
    const ids = paginated.map(t => t.id);
    const allSelected = ids.every(id => selectedIds.includes(id));

    const next = allSelected
      ? selectedIds.filter(id => !ids.includes(id))
      : [...new Set([...selectedIds, ...ids])];

    setSelectedIds(next);
    onSelectionChange(next);
  };

  const SortHeader = ({ label, keyName }) => (
    <th
      onClick={() => toggleSort(keyName)}
      className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none"
    >
      {label}
      {sort.key === keyName && (
        <span className="ml-1 text-slate-400">{sort.direction === 'asc' ? '▲' : '▼'}</span>
      )}
    </th>
  );

  return (
    <div className="flex flex-col">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={paginated.length > 0 && paginated.every(t => selectedIds.includes(t.id))}
                onChange={toggleSelectAll}
              />
            </th>

            <SortHeader label="Date" keyName="date" />
            <SortHeader label="Category" keyName="category" />
            <SortHeader label="Fund" keyName="fund" />
            <SortHeader label="Amount" keyName="amount" />
            <SortHeader label="Description" keyName="description" />

            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((t, idx) => (
            <tr key={t.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(t.id)}
                  onChange={() => toggleSelect(t.id)}
                />
              </td>

              <td className="px-4 py-2">{t.date}</td>

              <td className="px-4 py-2 flex items-center gap-2">
                <span>{getCategoryIcon(t.category)}</span>
                <span>{t.category}</span>
              </td>

              <td className="px-4 py-2">{t.fund}</td>

              <td className="px-4 py-2 text-right font-semibold">
                {Number(t.amount) >= 0 ? (
                  <span className="text-emerald-600">${Number(t.amount).toLocaleString()}</span>
                ) : (
                  <span className="text-red-600">${Number(t.amount).toLocaleString()}</span>
                )}
              </td>

              <td className="px-4 py-2">{t.description}</td>

              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => onEdit(t)}
                    className="px-2 py-1 text-xs bg-amber-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(t)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                  >
                    Del
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Pagination page={page} pageSize={pageSize} total={sorted.length} onPageChange={setPage} />
      </div>
    </div>
  );
}
