import { FeeLineItem, CalculationOptions } from '@/lib/types/TariffParkFees';
import { PricingStrategy } from 'lib/utils/strategies/PricingStrategy';
import { ParkPricingStrategy } from 'lib/utils/strategies/ParkPricing';
import { HotelPricingStrategy } from 'lib/utils/strategies/HotelPricing';
import { TransferPricingStrategy } from 'lib/utils/strategies/TransferPricing';
import { MerchandisePricingStrategy } from 'lib/utils/strategies/MerchandisePricing';
import Decimal from 'decimal.js';

export class PricingEngine {
    private static readonly strategies: Record<string, PricingStrategy> = {
        'activities': new ParkPricingStrategy(),
        'lodges': new HotelPricingStrategy(),
        'transfers': new TransferPricingStrategy(),
        'parks': new ParkPricingStrategy(),
        'cruises': new ParkPricingStrategy(),
        'treks': new ParkPricingStrategy(),
        'merchandise': new MerchandisePricingStrategy(),
        'gift_card': new MerchandisePricingStrategy(),
    };

    public static calculate(item: any, options: CalculationOptions): FeeLineItem {
        if (!item) {
            throw new Error("[PricingEngine] Cannot calculate price for null item.");
        }

        const itemType = (item.type || '').toLowerCase();
        const strategy = this.strategies[itemType];
        
        if (!strategy) {
            console.warn(`[PricingEngine] No specific strategy for ${item.type}, using default.`);
            return this.defaultCalculation(item, options);
        }

        try {
            return strategy.calculate(item, options);
        } catch (err) {
            console.warn(`[PricingEngine] Strategy failed for ${item.type}, falling back to default calculation:`, err);
            return this.defaultCalculation(item, options);
        }
    }

    private static resolvePrice(priceData: any, tier: string): number {
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
            keys.push('citizen', 'tanzanian_citizen', 'tz_citizen', 'local');
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

    private static defaultCalculation(item: any, options: CalculationOptions): FeeLineItem {
        const tier = options.tier || 'INTERNATIONAL';
        const priceData = item.price || item.pricing || {};

        let resolvedPrice = 0;
        if (priceData.entry_fee) {
            resolvedPrice = this.resolvePrice(priceData.entry_fee, tier);
        } else if (priceData.concession_fee) {
            resolvedPrice = this.resolvePrice(priceData.concession_fee, tier);
        } else {
            resolvedPrice = this.resolvePrice(priceData, tier);
        }
        
        const unitPrice = new Decimal(resolvedPrice);
        const guestCount = new Decimal((options.adults || 1) + (options.children || 0));
        const total = unitPrice.mul(guestCount);
        
        const vatAmount = new Decimal(0);
        
        return {
            label: item.name || "Service Item",
            description: "Standard service rate",
            currency: item.currency || 'USD',
            subtotalBase: total.toNumber(),
            taxAmount: vatAmount.toNumber(),
            total: total.toNumber(),
            isTaxable: false,
            metadata: {
                calculatedAt: new Date().toISOString(),
                vat: vatAmount.toNumber(),
                strategy: 'DEFAULT_RESOLVER',
                itemId: item.id || 'N/A',
                guestCount: guestCount.toNumber(),
                tierUsed: tier
            }
        };
    }
}