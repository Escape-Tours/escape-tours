import { PricingStrategy } from '../strategies/PricingStrategy'; 
import { FeeLineItem, CalculationOptions } from '@/lib/types/TariffParkFees';
import { getStandardizedPrice } from '@/lib/utils/price-translator';
import Decimal from 'decimal.js';

export class HotelPricingStrategy implements PricingStrategy {
  calculate(item: any, options: CalculationOptions): FeeLineItem {
    // 1. Configuration (Constants)
    const VAT_RATE = new Decimal(0.18);
    const AGENCY_FEE_RATE = new Decimal(0.20);
    
    // 2. Safe Price Resolution
    const nightlyRate = new Decimal(getStandardizedPrice(item.price, options.tier));
    
    // Prioritize item quantity / slots booked, then options.duration, defaulting to 1
    const quantity = Number(item.quantity ?? item.slots ?? options.duration ?? 1);
    const effectiveMultiplier = quantity > 0 ? quantity : 1;

    // 3. Calculation Logic
    const subtotalBase = nightlyRate.mul(effectiveMultiplier);
    const vatAmount = subtotalBase.mul(VAT_RATE);
    const agencyFeeAmount = subtotalBase.mul(AGENCY_FEE_RATE);
    
    const totalTaxAndFees = vatAmount.add(agencyFeeAmount);
    const total = subtotalBase.add(totalTaxAndFees);

    return {
      label: item.name || "Lodge accommodation",
      description: `Accommodation for ${effectiveMultiplier} slot(s) at ${item.name}`,
      currency: item.currency || 'USD',
      subtotalBase: subtotalBase.toNumber(),
      taxAmount: totalTaxAndFees.toNumber(),
      total: total.toNumber(),
      isTaxable: true,
      metadata: {
          calculatedAt: new Date().toISOString(),
          vat: vatAmount.toNumber(),
          agencyFee: agencyFeeAmount.toNumber(),
          quantity: effectiveMultiplier,
          rateUsed: nightlyRate.toNumber()
      }
    };
  }
}