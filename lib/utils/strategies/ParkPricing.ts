import { PricingStrategy } from '../strategies/PricingStrategy';
import { FeeLineItem, CalculationOptions } from '@/lib/types/TariffParkFees';
import Decimal from 'decimal.js';

export class ParkPricingStrategy implements PricingStrategy {
  calculate(item: any, options: CalculationOptions): FeeLineItem {
    const priceData = item.price;
    const tier = options.tier || 'INTERNATIONAL';
    const duration = new Decimal(options.duration || 1);
    
    if (!priceData || Object.keys(priceData).length === 0) {
      return this.fallbackFee(item);
    }

    // 1. Resolve rates with safe defaults
    const rawRate = priceData.entry_fee 
      ? (priceData.entry_fee[tier] || 0) 
      : (priceData[tier] || 0);

    const baseRatePerAdult = new Decimal(rawRate);
    
    // 2. Business Logic: Child rate handling
    // Check if item metadata defines a specific child_rate_multiplier
    const childMultiplier = item.metadata?.child_rate_multiplier 
      ? new Decimal(item.metadata.child_rate_multiplier) 
      : new Decimal(0.5); 

    const childRate = baseRatePerAdult.mul(childMultiplier);

    // 3. Calculation with high precision
    const totalAdultCost = baseRatePerAdult.mul(options.adults);
    const totalChildCost = childRate.mul(options.children);
    
    // Total = (Adults + Children) * Days/Nights
    const subtotalBase = totalAdultCost.add(totalChildCost).mul(duration);

    return {
      label: item.name || "Park Entry",
      description: `${options.adults} Adults, ${options.children} Children for ${duration.toNumber()} day(s)`,
      currency: item.currency || 'USD',
      subtotalBase: subtotalBase.toNumber(),
      taxAmount: 0, 
      total: subtotalBase.toNumber(),
      isTaxable: false,
      metadata: { 
        tier: tier,
        unit_price_adult: baseRatePerAdult.toNumber(),
        unit_price_child: childRate.toNumber(),
        duration: duration.toNumber(),
        calculatedAt: new Date().toISOString()
      }
    };
  }

  private fallbackFee(item: any): FeeLineItem {
    return {
      label: item.name || "Park Entry",
      description: "Pricing unavailable for selected tier",
      currency: 'USD',
      subtotalBase: 0,
      taxAmount: 0,
      total: 0,
      isTaxable: false,
      metadata: { error: "Missing pricing data" }
    };
  }
}