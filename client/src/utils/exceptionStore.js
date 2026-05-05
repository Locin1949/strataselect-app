// src/utils/exceptionStore.js

const STORAGE_KEY = 'import_exceptions_v1';

/**
 * Load all exceptions from localStorage.
 * Returns an array of exception objects.
 */
export function loadExceptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load exceptions:', err);
    return [];
  }
}

/**
 * Save the full exception list back to localStorage.
 */
export function saveExceptions(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save exceptions:', err);
  }
}

/**
 * Add a new exception.
 * Automatically assigns a unique ID.
 */
export function addException(exception) {
  const list = loadExceptions();

  const newItem = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...exception
  };

  list.push(newItem);
  saveExceptions(list);

  return newItem;
}

/**
 * Remove a single exception by ID.
 */
export function removeException(id) {
  const list = loadExceptions().filter(e => e.id !== id);
  saveExceptions(list);
}

/**
 * Clear all exceptions.
 */
export function clearExceptions() {
  saveExceptions([]);
}
