// lib/utils/price-translator.ts

export type ResidencyTier = 'CITIZEN' | 'RESIDENT' | 'INTERNATIONAL';

export const getStandardizedPrice = (
  basePrice: any, 
  tier: ResidencyTier,
  selectedRoomType?: string
): number => {
  // 1. Safe Guard: Handle missing basePrice
  if (!basePrice) return 0;

  // If basePrice is already a flat number, return it immediately
  if (typeof basePrice === 'number') return basePrice;

  const upperTier = String(tier || 'INTERNATIONAL').toUpperCase();

  // Flexible database key aliases per tier to capture variants like non_resident, foreigner, tanzanian, expat, etc.
  const tierKeys: Record<ResidencyTier, string[]> = {
    CITIZEN: ['CITIZEN', 'citizen', 'TZS', 'tzs', 'Local', 'local', 'tanzanian', 'Tanzanian', 'EAST_AFRICAN'],
    RESIDENT: ['RESIDENT', 'resident', 'EXPAT', 'expat', 'TANZANIAN_RESIDENT', 'east_african'],
    INTERNATIONAL: ['INTERNATIONAL', 'international', 'FOREIGN', 'foreign', 'USD', 'usd', 'NON_RESIDENT', 'non_resident', 'foreigner']
  };

  let data: any = undefined;

  // Try finding a matching key using our alias map
  const allowedKeys = tierKeys[upperTier as ResidencyTier] || [upperTier];
  for (const k of allowedKeys) {
    if (basePrice[k] !== undefined && basePrice[k] !== null) {
      data = basePrice[k];
      break;
    }
  }

  // Fallback to case-insensitive match against top-level keys
  if (data === undefined) {
    const matchedKey = Object.keys(basePrice).find(k => 
      allowedKeys.some(alias => k.toLowerCase() === alias.toLowerCase())
    );
    if (matchedKey) {
      data = basePrice[matchedKey];
    }
  }

  // If no tier match is found, do NOT fallback to the raw object (which exposes international rates).
  if (data === undefined) {
    return 0;
  }

  // 2. Direct number for the specific tier
  if (typeof data === 'number') return data;

  // 3. Handle object structures (Lodges with rooms/seasons)
  if (typeof data === 'object' && data !== null) {
    // A. Room Category Drill-down (If specific room type is requested)
    if (selectedRoomType && data[selectedRoomType]) {
      const roomData = data[selectedRoomType];
      if (typeof roomData === 'number') return roomData;
      if (typeof roomData === 'object' && roomData !== null) {
        return extractBestRate(roomData);
      }
    }

    // B. If no room selected, look for standard/double or pick a safe default rate from the object keys
    return extractBestRate(data);
  }

  return 0;
};

// Helper to pull a clean rate instead of grabbing random nested numbers blindly
const extractBestRate = (obj: any): number => {
  if (typeof obj !== 'object' || obj === null) return 0;

  // Prefer standard, double, or common rate keys first
  const preferredKeys = ['standard', 'double', 'rack', 'nett', 'STO_HB_2026', 'STO_FB_2026', 'HIGH', 'PEAK'];
  for (const key of preferredKeys) {
    const match = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
    if (match && typeof obj[match] === 'number') {
      return obj[match];
    }
    // If it's nested one level deeper under that key
    if (match && typeof obj[match] === 'object' && obj[match] !== null) {
      const subVal = findFirstNumber(obj[match]);
      if (subVal !== null) return subVal;
    }
  }

  const found = findFirstNumber(obj);
  return found ?? 0;
};

const findFirstNumber = (obj: any): number | null => {
  if (typeof obj !== 'object' || obj === null) return null;
  
  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'number') return val;
    if (typeof val === 'object' && val !== null) {
      const found = findFirstNumber(val);
      if (found !== null) return found;
    }
  }
  return null;
};