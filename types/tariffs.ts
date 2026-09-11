// types/tariffs.ts

export enum ResidencyTier {
  INTERNATIONAL = 'INTERNATIONAL',
  EAST_AFRICAN = 'EAST_AFRICAN',
  TANZANIAN = 'TANZANIAN'
}

export const RESIDENCY_TIER: Record<ResidencyTier, string> = {
  [ResidencyTier.INTERNATIONAL]: 'International Visitor',
  [ResidencyTier.EAST_AFRICAN]: 'East African Resident',
  [ResidencyTier.TANZANIAN]: 'Tanzanian Resident'
};

export interface TieredPrice {
  [ResidencyTier.INTERNATIONAL]: number;
  [ResidencyTier.EAST_AFRICAN]: number;
  [ResidencyTier.TANZANIAN]: number;
}

// Helper for type-safe label retrieval
export const getTierLabel = (tier: ResidencyTier): string => {
  return RESIDENCY_TIER[tier] || 'Unknown Tier';
};