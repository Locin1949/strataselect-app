import { CATEGORY_LIST } from '../data/categoryList';

// ============================
// INTERNAL: NORMALIZATION
// ============================
function normalize(str) {
  return (str || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

// ============================
// CATEGORY_MAP (O(1) lookup)
// ============================
export const CATEGORY_MAP = CATEGORY_LIST.reduce((map, cat) => {
  map[normalize(cat.name)] = cat;
  return map;
}, {});

// Optional: fund → categories map (for future use)
export const FUND_CATEGORY_MAP = CATEGORY_LIST.reduce((map, cat) => {
  if (!map[cat.fund]) map[cat.fund] = [];
  map[cat.fund].push(cat);
  return map;
}, {});

// ============================
// BASIC HELPERS
// ============================
export function getCategoryByName(name) {
  if (!name) return null;
  const key = normalize(name);
  return CATEGORY_MAP[key] || null;
}

export function getFundForCategory(name) {
  const cat = getCategoryByName(name);
  return cat?.fund || null;
}

export function getIconForCategory(name) {
  const cat = getCategoryByName(name);
  return cat?.icon || '📁';
}

// Backwards compatibility for older components
export const getCategoryIcon = getIconForCategory;

// ============================
// AUTO-SUGGEST
// ============================
export function suggestCategories(input, limit = 8) {
  const term = normalize(input);
  if (!term) return CATEGORY_LIST.slice(0, limit);

  const scored = CATEGORY_LIST.map(cat => {
    const n = normalize(cat.name);
    let score = 0;

    if (n === term) score += 100;
    else if (n.startsWith(term)) score += 60;
    else if (n.includes(term)) score += 40;

    return { cat, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.cat);
}

// ============================
// IMPORT MATCHING (simple version)
// ============================
export function matchCategoryForDescription(description) {
  const text = normalize(description);
  if (!text) return null;

  const candidates = CATEGORY_LIST.filter(cat => {
    const n = normalize(cat.name);
    return text.includes(n.split(' ')[0]);
  });

  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) return candidates[0];

  return null;
}
