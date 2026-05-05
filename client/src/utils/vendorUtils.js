// src/utils/vendorUtils.js

/**
 * Normalize vendor names for consistent matching.
 * - Lowercase
 * - Trim whitespace
 * - Remove punctuation
 * - Collapse multiple spaces
 */
export function normalizeVendor(vendor) {
  if (!vendor) return '';

  return vendor
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .replace(/\s+/g, ' '); // collapse spaces
}

/**
 * Map raw vendor names into clusters.
 * This is a simple heuristic-based clustering system.
 *
 * Example:
 *  "Woolworths Southport" → "woolworths"
 *  "Woolworths Online" → "woolworths"
 *  "Bunnings Warehouse Nerang" → "bunnings"
 */
export function mapRawVendorToCluster(rawVendor) {
  const norm = normalizeVendor(rawVendor);

  if (!norm) return 'unknown';

  // Known vendor keywords → cluster keys
  const clusters = [
    'woolworths',
    'coles',
    'aldi',
    'bunnings',
    'officeworks',
    'kmart',
    'telstra',
    'optus',
    'amazon',
    'uber',
    'lyft',
    'bp',
    'caltex',
    'shell',
    'mcdonalds',
    'kfc',
    'subway'
  ];

  for (const key of clusters) {
    if (norm.includes(key)) return key;
  }

  // Default cluster = normalized vendor root word
  return norm.split(' ')[0] || 'unknown';
}
