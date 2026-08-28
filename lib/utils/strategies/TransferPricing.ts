import { PricingStrategy } from '../strategies/PricingStrategy';
import { FeeLineItem, CalculationOptions } from '@/lib/types/TariffParkFees';
import Decimal from 'decimal.js';

export class TransferPricingStrategy implements PricingStrategy {
  calculate(item: any, options: CalculationOptions): FeeLineItem {
    // 1. Determine Pricing Model
    const isPerPerson = item.metadata?.pricing_model === 'per_person';

    // 2. Safe Price Extraction
    // If item.price is an object, extract the numeric value.
    let priceValue = 0;
    if (typeof item.price === 'object' && item.price !== null) {
      // Look for common price keys, fallback to 0
      priceValue = item.price.amount || item.price.value || item.price.price || 0;
    } else {
      priceValue = item.price || 0;
    }

    const rawPrice = new Decimal(priceValue);
    
    // 3. Calculate Total based on model
    const guestCount = new Decimal(options.adults + options.children);
    const totalCost = isPerPerson 
      ? rawPrice.mul(guestCount) 
      : rawPrice;

    // 4. Construct descriptive output
    const description = isPerPerson 
      ? `Private transfer for ${guestCount.toNumber()} passenger(s)`
      : `Private vehicle transfer (${item.route || "Standard Route"})`;

    return {
      label: item.name || "Transfer Service",
      description: description,
      currency: item.currency || 'USD',
      subtotalBase: totalCost.toNumber(),
      taxAmount: 0,
      total: totalCost.toNumber(),
      isTaxable: false,
      metadata: { 
        type: 'TRANSPORT',
        route: item.route,
        pricing_model: isPerPerson ? 'PER_PERSON' : 'PER_VEHICLE',
        unit_price: rawPrice.toNumber()
      }
    };
  }
}