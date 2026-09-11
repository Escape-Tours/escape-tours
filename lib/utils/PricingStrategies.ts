import { FeeLineItem, CalculationOptions } from '../types/TariffParkFees';

export interface PricingStrategy {
  calculate: (item: any, options: CalculationOptions) => FeeLineItem;
}