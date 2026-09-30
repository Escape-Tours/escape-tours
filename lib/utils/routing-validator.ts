// lib/utils/routing-validator.ts

interface LocationNode {
  name: string;
  region: 'NORTHERN' | 'SOUTHERN' | 'ZANZIBAR' | 'HIGHLANDS';
}

// Simple rule table for minimum transit times (in hours) between regions
const TRANSIT_MATRIX: Record<string, Record<string, number>> = {
  NORTHERN: { NORTHERN: 2, SOUTHERN: 12, ZANZIBAR: 6, HIGHLANDS: 3 },
  SOUTHERN: { NORTHERN: 12, SOUTHERN: 3, ZANZIBAR: 4, HIGHLANDS: 14 },
  ZANZIBAR: { NORTHERN: 6, SOUTHERN: 4, ZANZIBAR: 1, HIGHLANDS: 7 },
  HIGHLANDS: { NORTHERN: 3, SOUTHERN: 14, ZANZIBAR: 7, HIGHLANDS: 2 }
};

export function validateDailyRoute(morningLocation: string, eveningLocation: string): { isValid: boolean; transitHours: number; warning?: string } {
  // If regions differ significantly and transit exceeds allowable day hours (e.g., > 6 hours)
  // Flag as logistically impossible for a single day.
  
  // Example check for Mainland <-> Zanzibar same-day mixing without flight allocation
  if (
    (morningLocation.toLowerCase().includes('tarangire') || morningLocation.toLowerCase().includes('serengeti')) &&
    eveningLocation.toLowerCase().includes('zanzibar')
  ) {
    return {
      isValid: false,
      transitHours: 8,
      warning: "Logistically Impossible: Cannot transition from Northern Mainland safari to Zanzibar in a single afternoon without a dedicated transit/flight day."
    };
  }

  return { isValid: true, transitHours: 2 };
}