import { ResidencyTier } from '@/lib/constants/index';

export type SlotType = 'MORNING' | 'AFTERNOON' | 'EVENING';

export type InventoryCategory = 
  | 'LODGE' 
  | 'ACTIVITY' 
  | 'TRANSPORT' 
  | 'SAFARI' 
  | 'CRUISE' 
  | 'TREK';

export interface ItineraryItem {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  type: InventoryCategory | string;
  service_id?: string;
  image_url?: string;
  description?: string;
  price: number;
  base_price?: any; 
  resident_price?: number;
  ea_price?: number;
  location_name?: string;
  category?: string | null;
  metadata?: {
    type?: string;
    pricing_model?: 'per_person' | 'per_vehicle' | string;
    [key: string]: any; 
  };
}

/**
 * Slot now includes properties for both the slot's metadata 
 * and the specific item it currently holds.
 */
export interface Slot {
  id: string;
  type: SlotType;
  item: ItineraryItem | null;
  // Metadata for the slot location if an item is not yet assigned
  location: {
    lat: number | null;
    lng: number | null;
  };
  name: string | null; 
}

// Helper type to make property access easier in your components
export type FilledSlot = Slot & { item: ItineraryItem };

export interface Day {
  id: string;
  day_number: number;
  location: string;
  slots: Slot[];
}

export interface BuilderItem extends ItineraryItem {}

export interface ItineraryState {
  days: Day[];
  residencyTier: ResidencyTier;
  adultCount: number;
  kidCount: number;
}