// lib/pricing/aggregator.ts
import { PricingEngine } from '@/lib/utils/PricingEngine';
import { CalculationOptions, FeeLineItem } from '@/lib/types/TariffParkFees';

export interface ItineraryItem {
  id: string;
  type: string; // e.g., 'lodges', 'parks'
  [key: string]: any; // Allows for dynamic item data
}

/**
 * Orchestrates the calculation of an entire itinerary by delegating 
 * to the PricingEngine strategies.
 */
export async function aggregateItineraryCost(
  items: ItineraryItem[], 
  options: CalculationOptions
): Promise<{ lineItems: FeeLineItem[], grandTotal: number }> {
  
  // 1. Delegate each item to the Strategy-based PricingEngine
  const lineItems = await Promise.all(
    items.map(item => PricingEngine.calculate(item, options))
  );

  // 2. Sum the totals
  const grandTotal = lineItems.reduce((sum, item) => sum + item.total, 0);

  return {
    lineItems,
    grandTotal
  };
}