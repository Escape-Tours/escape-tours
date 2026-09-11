import { Database } from '@/lib/supabase/database.types';
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';

// Use the database row definition for the inventory contract
type InventoryRow = Database['public']['Tables']['inventory']['Row'];

// Extend the InventoryRow to include the required UI metadata
export interface StagedItineraryItem extends InventoryRow {
  seasonalMetadata: {
    resolvedSeason: string;
    [key: string]: any;
  };
}

/**
 * Validates the itinerary payload.
 * We map the Day interface here to ensure strict key compliance.
 */
export const validatePayload = (days: Day[], tier: string): boolean => {
  // 1. Basic sanity checks
  if (!tier || tier.trim() === '') return false;
  if (!Array.isArray(days) || days.length === 0) return false;

  // 2. Iterate through every slot to ensure Data Contract compliance
  for (const day of days) {
    // Accessing explicit keys instead of Object.values(day.slots)
    const slots = [day.slots.morning, day.slots.afternoon, day.slots.evening];
    
    for (const item of slots) {
      if (!item) continue; // Skip empty slots

      // Validate critical identity fields
      // Note: Cast item to any or ensure ItineraryItem covers these keys
      const typedItem = item as ItineraryItem & { seasonalMetadata?: any };

      if (!typedItem.id || !typedItem.type || !typedItem.name) {
        console.error('Validation Error: Item missing critical identity fields', typedItem);
        return false;
      }

      // Ensure seasonal metadata is resolved
      if (!typedItem.seasonalMetadata?.resolvedSeason) {
        console.error('Validation Error: Item missing seasonal metadata', typedItem.name);
        return false;
      }
    }
  }

  return true;
};