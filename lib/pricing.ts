/**
 * Safely extracts the absolute lowest price from the hotel room_prices JSON,
 * regardless of whether the structure is flat, nested, or contains residency tiers.
 */
export const getStartingPrice = (roomPrices: any): number => {
  if (typeof roomPrices === 'number') return roomPrices;
  if (!roomPrices || typeof roomPrices !== 'object') return 0;

  const extractPrices = (obj: any): number[] => {
    let prices: number[] = [];

    if (typeof obj === 'number') {
      prices.push(obj);
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach((val) => {
        prices = prices.concat(extractPrices(val));
      });
    }
    return prices;
  };

  const allPrices = extractPrices(roomPrices);
  const validPrices = allPrices.filter((p) => p > 0);
  return validPrices.length > 0 ? Math.min(...validPrices) : 0;
};

/**
 * Extracts a price based on the selected tier.
 * Falls back to getStartingPrice if the tier is not explicitly found.
 */
export const getTieredPrice = (roomPrices: any, tier: string = 'NON_RESIDENT'): number => {
  if (typeof roomPrices === 'number') return roomPrices;
  if (!roomPrices || typeof roomPrices !== 'object') return 0;

  // Attempt to target the specific tier key
  const price = roomPrices[tier];

  // If found, return it
  if (typeof price === 'number') return price;
  
  // If the object has nested tiers, recursively find the lowest price within that tier
  if (typeof price === 'object' && price !== null) {
    return getStartingPrice(price);
  }
  
  // Final fallback: search the entire object structure
  return getStartingPrice(roomPrices);
};

/**
 * Calculates total cost including markup and tax, specific to a user's tier.
 */
export const calculateTotal = (
  basePrice: any,
  tier: string = 'NON_RESIDENT',
  nights: number = 1,
  markupPercent: number = 0.20,
  taxPercent: number = 0.18
): number => {
  // 1. Get the price for the specific tier
  const cleanBase = getTieredPrice(basePrice, tier);

  // 2. Validate
  if (isNaN(cleanBase) || cleanBase <= 0) return 0;

  // 3. Financial Calculation
  const priceWithMarkup = cleanBase * (1 + markupPercent);
  const subtotal = priceWithMarkup * nights;
  const total = subtotal * (1 + taxPercent);

  // 4. Return rounded value
  return Math.round(total * 100) / 100;
};