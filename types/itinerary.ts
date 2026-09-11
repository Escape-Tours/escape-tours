export interface ItineraryItem {
  id: string;
  day_id: string;
  type: 'hotel' | 'activity' | 'transfer' | 'meal';
  service_id: string;
  metadata: Record<string, any>; // Stores pricing tier (Suite, Deluxe, etc.)
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  location: string;
  itinerary_items: ItineraryItem[];
}