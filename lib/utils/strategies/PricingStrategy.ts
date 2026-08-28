import { FeeLineItem, CalculationOptions } from '@/lib/types/TariffParkFees';

export interface PricingStrategy {
  calculate(item: any, options: CalculationOptions): FeeLineItem;
}