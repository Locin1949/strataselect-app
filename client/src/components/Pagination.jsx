import React from 'react';

export default function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const goToPage = next => {
    if (next < 1 || next > totalPages) return;
    onPageChange(next);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>

      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
