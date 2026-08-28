import { ResidencyTier } from "@/lib/constants/residency";

/**
 * Represents the specific price for a category across residency tiers.
 */
export type TieredPricing = Record<ResidencyTier, number>;

/**
 * Represents pricing separated by season.
 */
export interface SeasonalPrice {
  readonly low: TieredPricing;
  readonly high: TieredPricing;
}

/**
 * Core Park Fee structure with residency-based conservation fees.
 */
export interface ParkFees {
  readonly name: string;
  readonly conservationFee: Record<ResidencyTier, number>;
  readonly currency: 'USD' | 'TZS';
  readonly craterServiceFee: number;
  readonly vehiclePermitFee: number;
  readonly GuideFee: Record<ResidencyTier, number>;
}

/**
 * Main Hotel Data Interface
 */
export interface HotelData {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly type: string;
  
  // Database & Media
  readonly hero_image: string;
  readonly video_url?: string;
  readonly location: {
    readonly lat: number;
    readonly lng: number;
    readonly address: string;
  };
  
  // Refined Pricing Structure
  readonly room_categories: readonly string[];
  readonly room_images: Readonly<Record<string, string>>;
  
  // Maps category strings to a full seasonal object
  readonly room_prices: Readonly<Record<string, SeasonalPrice>>;
  
  readonly lodge_environment: { readonly images: readonly string[] };

  // Metadata
  readonly vatRate: number;
  readonly seo: { 
    readonly title: string; 
    readonly description: string; 
    readonly keywords: readonly string[] 
  };
  readonly rating: number;
  readonly gallery: readonly { 
    readonly url: string; 
    readonly alt: string; 
    readonly priority: number 
  }[];
  readonly amenities: readonly string[];
  readonly updatedAt: string;
  
  // Optional relations and fees
  readonly parkFees?: ParkFees;
}

/**
 * Robust Type Guard for API validation.
 * Verifies the integrity of the data structure before passing it to the calculator.
 */
export const isHotelData = (data: unknown): data is HotelData => {
  if (typeof data !== 'object' || data === null) return false;
  
  const d = data as Record<string, unknown>;
  
  return (
    typeof d.id === 'string' &&
    typeof d.room_prices === 'object' &&
    d.room_prices !== null &&
    typeof d.vatRate === 'number' &&
    Array.isArray(d.room_categories)
  );
};