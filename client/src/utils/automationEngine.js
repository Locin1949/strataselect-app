// src/utils/automationEngine.js

import { loadLearning, saveLearning } from './learningStore';
import { detectSplit } from './splitEngine';
import { normalizeVendor } from './vendorUtils';

/**
 * Run the automation engine on a single transaction.
 * Returns:
 * {
 *   category,
 *   confidence,
 *   source,
 *   logs,
 *   split
 * }
 */
export function runAutomation(txn) {
  const logs = [];
  const learning = loadLearning();

  const description = (txn.description || '').toLowerCase();
  const vendor = normalizeVendor(txn.vendor || '');
  const amountKey = Number(txn.amount || 0).toFixed(2);

  let bestCategory = null;
  let bestConfidence = 0;
  let source = 'none';

  // -----------------------------------------
  // 1. Vendor rule
  // -----------------------------------------
  if (learning.vendorMap[vendor]) {
    bestCategory = learning.vendorMap[vendor];
    bestConfidence = 90;
    source = 'vendor-rule';
    logs.push(`Vendor rule matched: ${vendor} → ${bestCategory}`);
  }

  // -----------------------------------------
  // 2. Description rule
  // -----------------------------------------
  if (learning.descriptionMap[description]) {
    const cat = learning.descriptionMap[description];
    if (95 > bestConfidence) {
      bestCategory = cat;
      bestConfidence = 95;
      source = 'description-rule';
    }
    logs.push(`Description rule matched: "${description}" → ${cat}`);
  }

  // -----------------------------------------
  // 3. Amount rule
  // -----------------------------------------
  if (learning.amountMap[amountKey]) {
    const cat = learning.amountMap[amountKey];
    if (80 > bestConfidence) {
      bestCategory = cat;
      bestConfidence = 80;
      source = 'amount-rule';
    }
    logs.push(`Amount rule matched: $${amountKey} → ${cat}`);
  }

  // -----------------------------------------
  // 4. Split detection
  // -----------------------------------------
  const split = detectSplit(txn);
  if (split && split.length > 0) {
    logs.push(`Split detected: ${split.length} parts`);
    return {
      category: null,
      confidence: 0,
      source: 'split-detected',
      logs,
      split
    };
  }

  // -----------------------------------------
  // 5. Fallback heuristic
  // -----------------------------------------
  if (!bestCategory) {
    bestCategory = 'Uncategorised';
    bestConfidence = 20;
    source = 'fallback';
    logs.push('No rule matched — fallback to Uncategorised');
  }

  return {
    category: bestCategory,
    confidence: bestConfidence,
    source,
    logs,
    split: null
  };
}

/**
 * Learn from user correction.
 * Called when user edits a transaction and changes its category.
 */
export function learnFromUserCorrection(original, correctedCategory) {
  const learning = loadLearning();

  const vendor = normalizeVendor(original.vendor || '');
  const description = (original.description || '').toLowerCase();
  const amountKey = Number(original.amount || 0).toFixed(2);

  // Vendor learning
  if (vendor) {
    learning.vendorMap[vendor] = correctedCategory;
  }

  // Description learning
  if (description) {
    learning.descriptionMap[description] = correctedCategory;
  }

  // Amount learning
  learning.amountMap[amountKey] = correctedCategory;

  saveLearning(learning);
}
/**
 * Premium classifier used by Financials.jsx
 * Returns a structure compatible with the UI:
 * {
 *   category,
 *   autoAssigned
 * }
 */
export function classifyTransactionPremium(form, mode) {
  // Use the existing automation engine
  const result = runAutomation(form, { automationMode: mode });

  return {
    category: result.category,
    autoAssigned: result.source !== 'fallback'
  };
}
