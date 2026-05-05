// src/utils/sortUtils.js

/**
 * Sort an array of objects by a given key and direction.
 *
 * @param {Array} data - The dataset to sort.
 * @param {Object} sort - { key: string|null, direction: 'asc'|'desc' }
 * @returns {Array} - A new sorted array.
 */
export function sortData(data, sort) {
  if (!Array.isArray(data)) return [];
  if (!sort?.key) return data;

  const { key, direction } = sort;

  const sorted = [...data].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    // Handle undefined/null values
    if (valA == null && valB == null) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;

    // Numeric sort
    if (!isNaN(valA) && !isNaN(valB)) {
      return Number(valA) - Number(valB);
    }

    // Date sort (YYYY-MM-DD)
    if (isDateLike(valA) && isDateLike(valB)) {
      return new Date(valA) - new Date(valB);
    }

    // String sort
    return String(valA).localeCompare(String(valB));
  });

  return direction === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Detects if a value looks like a date string.
 */
function isDateLike(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value);
}
