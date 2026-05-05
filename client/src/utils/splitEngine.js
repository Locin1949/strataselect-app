// src/utils/splitEngine.js

import { loadLearning, saveLearning } from './learningStore';
import { normalizeVendor } from './vendorUtils';

/**
 * Detect split rules for a transaction.
 * Returns an array of split parts:
 * [
 *   { category, amount },
 *   { category, amount }
 * ]
 */
export function detectSplit(txn) {
  const learning = loadLearning();
  const vendorKey = normalizeVendor(txn.vendor || txn.description || '');

  const rules = learning.splitRules[vendorKey];
  if (!rules || rules.length === 0) return null;

  const total = Number(txn.amount || 0);
  const sum = rules.reduce((acc, r) => acc + Number(r.amount || 0), 0);

  // If the learned split doesn't match the amount, ignore it
  if (Math.abs(sum - total) > 0.01) {
    return null;
  }

  // Return a deep copy so UI can edit safely
  return rules.map(r => ({
    category: r.category,
    amount: Number(r.amount).toFixed(2)
  }));
}

/**
 * Learn a new split rule for a vendor.
 * rules = [{ category, amount }]
 */
export function learnSplitRule(vendor, rules) {
  const learning = loadLearning();
  const key = normalizeVendor(vendor || '');

  if (!learning.splitRules[key]) {
    learning.splitRules[key] = [];
  }

  learning.splitRules[key] = rules.map(r => ({
    category: r.category,
    amount: Number(r.amount).toFixed(2)
  }));

  saveLearning(learning);
}
