/**
 * Interfaces define our data contract. 
 * Use these to ensure the quote engine never receives malformed data.
 */
export interface Park {
  id: string;
  name: string;
  base_price_usd: number;
  entry_fee_usd: number;
  seasonal_multiplier: number;
}

export interface QuoteResult {
  subtotal: number;
  tax: number;
  total: number;
  currency: 'USD';
  generatedAt: string;
}

/**
 * World-class calculation engine:
 * 1. Uses Immutable patterns.
 * 2. Provides clear, typed outputs.
 * 3. Includes error handling for empty or invalid inputs.
 */
export const buildQuote = (parks: Park[]): QuoteResult => {
  if (!Array.isArray(parks) || parks.length === 0) {
    throw new Error("Cannot build a quote for an empty itinerary.");
  }

  // Use reduce for efficient, clean calculation
  const subtotal = parks.reduce((acc, park) => {
    const parkTotal = park.base_price_usd + park.entry_fee_usd;
    return acc + (parkTotal * park.seasonal_multiplier);
  }, 0);

  const tax = subtotal * 0.18; // Assuming 18% VAT (common in Tanzania)

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number((subtotal + tax).toFixed(2)),
    currency: 'USD',
    generatedAt: new Date().toISOString(),
  };
};