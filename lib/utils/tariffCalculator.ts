import { ResidencyTier } from "@/lib/constants/residency";
import { FeeLineItem, ParkFees } from "@/lib/types/TariffParkFees";

export const calculateParkFee = (
  tariff: ParkFees,
  tier: ResidencyTier,
  isLowSeason: boolean = false
): FeeLineItem => {
  // 1. Safe Indexing: Assert 'tier' as a keyof tariff.conservationFee
  // This resolves the "Implicit Any" / indexing error
  const baseRate = tariff.conservationFee[tier as keyof typeof tariff.conservationFee];

  // 2. Multiplier logic: Apply seasonal discount if the tariff supports it
  // We check if tariff.seasonalRates exists and if we should apply the discount
  const isEligibleForDiscount = isLowSeason && tariff.seasonalRates;
  const multiplier = isEligibleForDiscount ? tariff.seasonalRates!.lowSeasonMultiplier : 1;
  
  const amount = baseRate * multiplier;

  // 3. Tax calculation: Use the tariff's own vatRate property
  const taxAmount = tariff.requiresVAT ? amount * tariff.vatRate : 0;
  const total = amount + taxAmount;

 return {
    label: `${tariff.name} (${tier})`,
    // These 3 properties were missing and are required by your interface:
    description: `${tariff.name} Entry Fee - ${tier} - 1 night`, 
    total: Number(total.toFixed(2)),
    metadata: {
        baseRate: amount,
        taxApplied: Number(taxAmount.toFixed(2))
    },
    // Existing properties:
    subtotalBase: Number(amount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    currency: tariff.currency,
    isTaxable: tariff.requiresVAT
};
};