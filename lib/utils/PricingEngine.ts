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

        return strategy.calculate(item, options);
    }

    private static defaultCalculation(item: any, options: CalculationOptions): FeeLineItem {
        const tier = options.tier || 'INTERNATIONAL';
        const priceData = item.price || {};

        // 1. Resolve Price
        let resolvedPrice = 0;
        if (priceData.entry_fee) {
            resolvedPrice = priceData.entry_fee[tier] || 0;
        } else if (priceData.concession_fee) {
            resolvedPrice = priceData.concession_fee[tier] || 0;
        } else {
            resolvedPrice = priceData[tier] || 0;
        }
        
        const unitPrice = new Decimal(resolvedPrice);
        const guestCount = new Decimal(options.adults + options.children || 1);
        const total = unitPrice.mul(guestCount);
        
        // 2. Default Tax Logic (Example: 0 for generic items)
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
                guestCount: guestCount.toNumber()
            }
        };
    }
}