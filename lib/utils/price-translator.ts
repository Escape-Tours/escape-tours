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

  // Handle flat object where tiers might be top-level keys directly (e.g., { INTERNATIONAL: 450, CITIZEN: 50 })
  let data = basePrice[tier];
  
  if (typeof data === 'undefined') {
    const matchedKey = Object.keys(basePrice).find(k => k.toUpperCase() === tier.toUpperCase());
    if (matchedKey) {
      data = basePrice[matchedKey];
    } else if (typeof basePrice.CITIZEN === 'number' || typeof basePrice.INTERNATIONAL === 'number' || typeof basePrice.RESIDENT === 'number') {
      return 0;
    } else {
      data = basePrice;
    }
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