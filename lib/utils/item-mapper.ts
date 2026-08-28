import { BuilderItem } from '@/lib/types/itinerary-types';

/**
 * Maps raw database rows to the structure the Builder expects.
 * Stores the full pricing object and generates a unique ID to prevent React key collisions.
 */
export function mapDbItemToBuilderItem(dbItem: any, index: number): BuilderItem {
  if (!dbItem) {
    throw new Error("Cannot map an undefined or null database item.");
  }

  const parsedLat = typeof dbItem.latitude === 'number' ? dbItem.latitude : (typeof dbItem.lat === 'number' ? dbItem.lat : 0);
  const parsedLng = typeof dbItem.longitude === 'number' ? dbItem.longitude : (typeof dbItem.lng === 'number' ? dbItem.lng : 0);

  return {
    // Generate a unique ID using the original DB id and the array index
    // This solves the 'Encountered two children with the same key' error
    id: dbItem.id ? `${dbItem.id}-${index}` : `item-${index}`,
    name: dbItem.name ?? "Unnamed Item",
    type: dbItem.type ?? "generic",
    
    location: dbItem.location_name ?? "Unknown Location",
    
    // Explicitly set both naming conventions so components looking for latitude/longitude or lat/lng both work seamlessly
    latitude: parsedLat,
    longitude: parsedLng,
    lat: parsedLat,
    lng: parsedLng,
    
    // Pass the entire pricing object (JSON) so the PricingEngine can resolve it per-tier
    price: typeof dbItem.base_price === 'object' && dbItem.base_price !== null 
      ? dbItem.base_price 
      : {},
      
    image_url: dbItem.image_url ?? null,
    category: dbItem.category ?? null,
  };
}

/**
 * Helper to map an array of database items to an array of BuilderItems.
 */
export function mapDbItemsToBuilderItems(dbItems: any[]): BuilderItem[] {
  if (!Array.isArray(dbItems)) return [];
  // Pass the index to the mapper to ensure unique IDs for each item
  return dbItems.map((item, index) => mapDbItemToBuilderItem(item, index));
}