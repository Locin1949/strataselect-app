// src/utils/pagination.js

/**
 * Paginate an array of items.
 *
 * @param {Array} data - The full dataset.
 * @param {number} page - Current page number (1‑based).
 * @param {number} pageSize - Items per page.
 * @returns {Array} - The sliced page of results.
 */
export function paginate(data, page, pageSize) {
  if (!Array.isArray(data)) return [];

  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}
