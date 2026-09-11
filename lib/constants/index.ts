// lib/constants/index.ts

export type ResidencyTier = 'CITIZEN' | 'RESIDENT' | 'INTERNATIONAL';

export const TAX_RATE = 0.18;
export const AGENCY_COMMISSION = 0.20;

export interface TieredPrice {
  CITIZEN?: number;
  RESIDENT?: number;
  INTERNATIONAL?: number;
  // Allows for recursive/nested structures
  [key: string]: any; 
}

export const resolvePrice = (
  priceData: TieredPrice | number | undefined, 
  tier: ResidencyTier
): number => {
  // 1. Primitive handling
  if (typeof priceData === 'number') return priceData;
  if (!priceData || typeof priceData !== 'object') return 0;

  // 2. Recursive search: Look deep into nested price structures first
  // We use Object.keys to iterate safely over the object
  for (const key of Object.keys(priceData)) {
    const value = priceData[key];
    if (typeof value === 'object' && value !== null) {
      const nestedResult = resolvePrice(value as TieredPrice, tier);
      if (nestedResult !== 0) return nestedResult;
    }
  }

  // 3. Direct tier match or base fallback
  if (typeof priceData[tier] === 'number') {
    return priceData[tier] as number;
  }
  
  if (typeof priceData.INTERNATIONAL === 'number') {
    return priceData.INTERNATIONAL as number;
  }

  return 0;
};

// Fleet & Dispatch Hub Expanded Locations
export const SAFARI_LOCATIONS = [
  "Mikumi Gate",
  "Seronera Airstrip",
  "Ngorongoro Crater Rim",
  "Tarangire Main Gate",
  "Lake Manyara National Park",
  "Nyerere National Park (Selous)",
  "Arusha National Park",
  "Ruaha National Park",
] as const;

export type SafariLocation = (typeof SAFARI_LOCATIONS)[number];