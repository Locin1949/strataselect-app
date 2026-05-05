import React, { useMemo, useState } from 'react';

import { getCategoryIcon } from '../utils/categoryHelpers';
import { paginate } from '../utils/pagination';
import { sortData } from '../utils/sortUtils';
// FIXED IMPORTS — removed alias paths
import ConfidenceBadge from './ConfidenceBadge';
import Pagination from './Pagination';

export default function TransactionTable({ data, onEdit, onDelete, onSelectionChange }) {
  const [sort, setSort] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const pageSize = 10;

  // SORTING + PAGINATION
  const sorted = useMemo(() => sortData(data, sort), [data, sort]);
  const paginated = useMemo(() => paginate(sorted, page, pageSize), [sorted, page]);

  const toggleSort = key => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelect = id => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];

      onSelectionChange(next);
      return next;
    });
  };

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
      style={{
        padding: '8px',
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: 600,
        color: '#6b7280',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      {label}
      {sort.key === keyName && (
        <span style={{ marginLeft: '4px', color: '#9ca3af' }}>
          {sort.direction === 'asc' ? '▲' : '▼'}
        </span>
      )}
    </th>
  );

  const getRowStyle = t => {
    if (t.aiConfidence != null && t.aiConfidence < 60) {
      return { background: '#fff7f7' };
    }
    return {};
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <table style={{ width: '100%', fontSize: '14px' }}>
        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <tr>
            <th style={{ padding: '8px' }}>
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

            <th
              style={{
                padding: '8px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6b7280'
              }}
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((t, idx) => (
            <tr
              key={t.id}
              style={{
                background: idx % 2 === 0 ? 'white' : '#f9fafb',
                ...getRowStyle(t)
              }}
            >
              <td style={{ padding: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(t.id)}
                  onChange={() => toggleSelect(t.id)}
                />
              </td>

              <td style={{ padding: '8px' }}>{t.date}</td>

              <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{getCategoryIcon(t.category)}</span>
                <span>{t.category}</span>

                {t.aiConfidence != null && <ConfidenceBadge confidence={t.aiConfidence} />}

                {t.aiAssigned && (
                  <span
                    style={{
                      fontSize: '10px',
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      marginLeft: '4px'
                    }}
                  >
                    AI
                  </span>
                )}
              </td>

              <td style={{ padding: '8px' }}>{t.fund}</td>

              <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                {Number(t.amount) >= 0 ? (
                  <span style={{ color: '#059669' }}>${Number(t.amount).toLocaleString()}</span>
                ) : (
                  <span style={{ color: '#dc2626' }}>${Number(t.amount).toLocaleString()}</span>
                )}
              </td>

              <td style={{ padding: '8px' }}>{t.description}</td>

              <td style={{ padding: '8px', textAlign: 'right' }}>
                <button
                  onClick={() => onEdit(t)}
                  style={{
                    marginRight: '8px',
                    padding: '4px 8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(t)}
                  style={{
                    padding: '4px 8px',
                    background: '#dc2626',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} total={sorted.length} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}
