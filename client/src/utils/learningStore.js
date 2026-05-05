// src/utils/learningStore.js

const STORAGE_KEY = 'learningStore_v1';

/**
 * Load learning data from localStorage.
 * Ensures all required structures exist.
 */
export function loadLearning() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyStore();
    }

    const parsed = JSON.parse(raw);

    return {
      vendorMap: parsed.vendorMap || {},
      descriptionMap: parsed.descriptionMap || {},
      amountMap: parsed.amountMap || {},
      splitRules: parsed.splitRules || {},
      vendorClusters: parsed.vendorClusters || {}
    };
  } catch (err) {
    console.error('Failed to load learning store:', err);
    return createEmptyStore();
  }
}

/**
 * Save learning data back to localStorage.
 */
export function saveLearning(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save learning store:', err);
  }
}

/**
 * Create a fresh empty learning store.
 */
function createEmptyStore() {
  return {
    vendorMap: {},
    descriptionMap: {},
    amountMap: {},
    splitRules: {},
    vendorClusters: {}
  };
}

/**
 * Add or update a vendor → category rule.
 */
export function addVendorRule(vendor, category) {
  const store = loadLearning();
  store.vendorMap[vendor.toLowerCase()] = category;
  saveLearning(store);
}

/**
 * Add or update a description → category rule.
 */
export function addDescriptionRule(description, category) {
  const store = loadLearning();
  store.descriptionMap[description.toLowerCase()] = category;
  saveLearning(store);
}

/**
 * Add or update an amount → category rule.
 */
export function addAmountRule(amount, category) {
  const store = loadLearning();
  const key = Number(amount).toFixed(2);
  store.amountMap[key] = category;
  saveLearning(store);
}

/**
 * Add or update split rules for a vendor.
 * rules = [{ category, amount }]
 */
export function addSplitRule(vendor, rules) {
  const store = loadLearning();
  const key = vendor.toLowerCase();

  if (!store.splitRules[key]) {
    store.splitRules[key] = [];
  }

  store.splitRules[key] = rules;
  saveLearning(store);
}
