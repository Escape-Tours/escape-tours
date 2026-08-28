export type ResidencyTier = 'INTERNATIONAL' | 'RESIDENT' | 'CITIZEN';

export interface BaseRates {
  INTERNATIONAL: number;
  RESIDENT: number;
  CITIZEN: number;
}

export interface SeasonalRates {
  lowSeasonMonths: number[];
  lowSeasonMultiplier: number;
}

export interface ParkFees {
  parkId: string;
  name: string;
  baseRates: BaseRates;
  conservationFee: BaseRates;
  currency: string;
  requiresVAT: boolean;
  vatRate: number;
  childMultiplier: number;
  seasonalRates?: SeasonalRates;
  requiresPermit?: boolean;
  isRemote?: boolean;
}

export interface FeeLineItem {
  // Identification
  label: string; 
  description: string;
  
  // Financials
  currency: string;
  subtotalBase: number;
  taxAmount: number;
  total: number; 
  
  // Logic & Metadata
  isTaxable: boolean;
  // Updated to use a Record to allow for strategy-specific data
  metadata: Record<string, any>; 
}

export interface CalculationOptions {
    tier: ResidencyTier;
    duration?: number;
    adults: number;
    children: number;
    date?: string;
    applyAgencyFee?: boolean;
}