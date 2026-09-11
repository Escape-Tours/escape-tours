export type Tier = "CITIZEN" | "RESIDENT" | "INTERNATIONAL";

const priceCache = new Map<string, number | null>();

export const resolvePrice = (
  data: any, 
  tier: Tier, 
  context?: string
): number | null => {
  if (!data || typeof data !== 'object') return null;

  // 1. Generate cache key
  const cacheKey = `${JSON.stringify(data)}-${tier}-${context}`;
  if (priceCache.has(cacheKey)) return priceCache.get(cacheKey)!;

  const parsePrice = (val: any): number | null => {
    if (val === undefined || val === null) return null;
    const numeric = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
    return !isNaN(numeric) ? numeric : null;
  };

  let result: number | null = null;

  // 2. Contextual match: Look into the specific context sub-object
  if (context && data[context] !== undefined) {
    // We pass 'undefined' for context here so we don't infinitely recurse 
    // looking for the same context key inside itself
    result = resolvePrice(data[context], tier, undefined);
  }

  // 3. Direct hit: check if tier exists at this level
  if (result === null && Object.prototype.hasOwnProperty.call(data, tier)) {
    result = parsePrice(data[tier]);
  }

  // 4. Deep recursion: search children only if not found yet
  if (result === null) {
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        result = resolvePrice(data[key], tier, context);
        if (result !== null) break;
      }
    }
  }

  priceCache.set(cacheKey, result);
  return result;
};