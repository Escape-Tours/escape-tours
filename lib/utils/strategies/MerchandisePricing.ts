import { PricingStrategy } from '../strategies/PricingStrategy';
import { FeeLineItem, CalculationOptions } from '@/lib/types/TariffParkFees';
import Decimal from 'decimal.js';

export class MerchandisePricingStrategy implements PricingStrategy {
    calculate(item: any, options: CalculationOptions): FeeLineItem {
        // Merchandise/Digital items are usually priced per unit
        const unitPrice = new Decimal(item.price || 0);
        const quantity = options.adults + options.children;
        const total = unitPrice.mul(quantity > 0 ? quantity : 1);
        
        return {
            label: item.name || "Merchandise Item",
            description: `${item.name} x ${quantity}`,
            currency: item.currency || 'USD',
            subtotalBase: total.toNumber(),
            taxAmount: 0, // Merchandise tax logic can be added here if needed
            total: total.toNumber(),
            isTaxable: false,
            metadata: { 
                type: 'MERCHANDISE',
                unitPrice: unitPrice.toNumber()
            }
        };
    }
}