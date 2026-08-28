/**
 * Core Types for the Escape Tours Inventory System.
 * Version: 2.0.0
 */

export type TourCategory = 'Safari' | 'Beach' | 'Combo' | 'Trekking' | 'Resident' | 'Cultural';
export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
export type CurrencyCode = 'USD' | 'TZS' | 'EUR';

export interface SEO {
  readonly title: string;
  readonly description: string;
  readonly keywords?: readonly string[];
}

/**
 * Geographic constraints for logistics.
 */
export interface TourLocation {
  readonly region: string;
  readonly meetingPoint?: string;
}

export interface Tour {
  // Identity
  readonly id: string;
  readonly slug: string;
  
  // Content
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly image: string;
  readonly gallery?: readonly string[];
  
  // Specs
  readonly duration: number; // In days
  readonly category: TourCategory;
  readonly tags?: readonly string[];
  readonly difficulty: DifficultyLevel;
  readonly location: TourLocation;
  
  // Financials
  readonly price: number;
  readonly currency: CurrencyCode;
  readonly discountPrice?: number; // Marketing feature
  
  // Logistics
  readonly highlights: readonly string[];
  readonly requiresPermit: boolean;
  readonly maxGroupSize: number;
  
  // SEO & State
  readonly seo?: SEO;
  readonly isActive: boolean;
  readonly isFeatured: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Utility types for Data Layer operations.
 */
export type CreateTourInput = Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTourInput = Partial<CreateTourInput>;

/**
 * Standardized API Response structure for consistent frontend consumption.
 */
export interface TourResponse<T = Tour> {
  readonly data: T;
  readonly error?: string;
  readonly meta?: {
    readonly timestamp: string;
    readonly version: string;
  };
}