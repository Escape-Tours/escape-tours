// types/staging.ts
import { ItineraryItem } from '@/lib/types/itinerary-types';
import { ResidencyTier } from '@/lib/utils/price-translator';

export interface ItineraryStagingPayload {
  itineraryId: string;
  version: string; // Added for cache-busting and audit trail
  status: 'STAGED' | 'VALIDATED' | 'FAILED'; // Expanded statuses for Admin Hub workflows
  metadata: {
    createdAt: string;
    updatedAt: string; // Added to track drift
    residencyTier: ResidencyTier;
    guestCount: { adults: number; children: number };
  };
  days: {
    day_number: number;
    location: string;
    slots: {
      morning: StagedItem | null;
      afternoon: StagedItem | null;
      evening: StagedItem | null;
    };
  }[];
}

export interface StagedItem extends ItineraryItem {
  resolvedSeason: string; 
  verifiedAt: string;
  // Enhancement: Add a flag for pricing override eligibility
  requiresManualReview: boolean; 
}