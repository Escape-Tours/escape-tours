export const RESIDENCY_TIER = {
  INTERNATIONAL: 'INTERNATIONAL',
  RESIDENT: 'RESIDENT',
  CITIZEN: 'CITIZEN',
} as const;

export type ResidencyTier = typeof RESIDENCY_TIER[keyof typeof RESIDENCY_TIER];