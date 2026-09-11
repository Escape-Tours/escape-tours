// Explicitly importing from index to bypass folder-level resolution ambiguity
import { 
  TAX_RATE, 
  AGENCY_COMMISSION, 
  resolvePrice, 
  ResidencyTier 
} from '@/lib/constants/index';

/**
 * Pricing breakdown with validation and safety checks.
 * Now handles zero-guest scenarios gracefully for the ItineraryBuilder.
 */
export const calculateDayPricing = (
  basePriceData: any, 
  tier: ResidencyTier, 
  adults: number, 
  kids: number
) => {
  const basePrice = resolvePrice(basePriceData, tier);

  // Safety check: If price resolution fails or no guests, do not proceed with math
  if (basePrice <= 0 || (adults === 0 && kids === 0)) {
    return { 
      basePrice: 0, 
      subtotal: 0, 
      vat: 0, 
      commission: 0, 
      total: 0, 
      isInvalid: true 
    };
  }

  // Calculate Subtotal
  const adultTotal = adults > 0 ? (adults * basePrice) : 0;
  const kidTotal = kids > 0 ? (kids * (basePrice * 0.5)) : 0;
  const subtotal = adultTotal + kidTotal;

  // Apply Fees
  const vat = subtotal * TAX_RATE;
  const commission = subtotal * AGENCY_COMMISSION;

  return {
    basePrice,
    subtotal,
    vat,
    commission,
    total: subtotal + vat + commission,
    isInvalid: false
  };
};

/**
 * Utility to format currency for the UI consistently
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};