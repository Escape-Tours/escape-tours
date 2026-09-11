import { PricingStrategy } from '../strategies/PricingStrategy';
import { FeeLineItem, CalculationOptions } from '@/lib/types/TariffParkFees';
import Decimal from 'decimal.js';

export class ParkPricingStrategy implements PricingStrategy {
  public calculate(item: any, options: CalculationOptions): FeeLineItem {
    const priceData = item.price || item.pricing;
    const tier = options.tier || 'INTERNATIONAL';
    const duration = new Decimal(options.duration || 1);
    
    if (!priceData || Object.keys(priceData).length === 0) {
      return this.fallbackFee(item);
    }

    const rawRate = priceData.entry_fee 
      ? this.resolvePrice(priceData.entry_fee, tier) 
      : this.resolvePrice(priceData, tier);

    const baseRatePerAdult = new Decimal(rawRate);
    
    const childMultiplier = item.metadata?.child_rate_multiplier 
      ? new Decimal(item.metadata.child_rate_multiplier) 
      : new Decimal(0.5); 

    const childRate = baseRatePerAdult.mul(childMultiplier);

    const totalAdultCost = baseRatePerAdult.mul(options.adults || 1);
    const totalChildCost = childRate.mul(options.children || 0);
    
    const subtotalBase = totalAdultCost.add(totalChildCost).mul(duration);

    return {
      label: item.name || "Park Entry",
      description: `${options.adults || 1} Adults, ${options.children || 0} Children for ${duration.toNumber()} day(s)`,
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

  private resolvePrice(priceData: any, tier: string): number {
    if (!priceData) return 0;
    
    if (typeof priceData === 'number') return priceData;
    if (typeof priceData === 'string' && !isNaN(Number(priceData))) return Number(priceData);

    const t = (tier || 'INTERNATIONAL').toLowerCase();
    
    const keys: string[] = [
      t,
      t.toLowerCase(),
      t.toUpperCase(),
    ];

    if (t.includes('citizen') || t === 'local' || t === 'tz') {
      keys.push('citizen', 'tanzanian_citizen', 'tz_citizen', 'local', 'east_african');
    } else if (t.includes('resident') && !t.includes('non')) {
      keys.push('resident', 'expat_resident', 'foreign_resident', 'tanzanian_resident');
    } else {
      keys.push('international', 'non_resident', 'foreign', 'non_res');
    }

    for (const key of keys) {
      if (priceData[key] !== undefined && priceData[key] !== null) {
        const val = Number(priceData[key]);
        if (!isNaN(val)) return val;
      }
    }

    for (const val of Object.values(priceData)) {
      if (typeof val === 'number' && !isNaN(val)) return val;
      if (typeof val === 'object' && val !== null) {
        const nestedVal = this.resolvePrice(val, tier);
        if (nestedVal > 0) return nestedVal;
      }
    }

    return 0;
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