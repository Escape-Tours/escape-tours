import { BuilderItem } from '@/lib/types/itinerary-types';

/**
 * Maps raw database rows to the robust structure the Itinerary Builder expects.
 * Preserves pricing JSON objects, resolves fallback coordinates, ensures unique React keys,
 * and normalizes location and region fields based on the BuilderItem type definition.
 */
export function mapDbItemToBuilderItem(dbItem: any, index: number): BuilderItem {
  if (!dbItem) {
    throw new Error("Cannot map an undefined or null database item.");
  }

  const parsedLat = typeof dbItem.latitude === 'number' ? dbItem.latitude : (typeof dbItem.lat === 'number' ? dbItem.lat : 0);
  const parsedLng = typeof dbItem.longitude === 'number' ? dbItem.longitude : (typeof dbItem.lng === 'number' ? dbItem.lng : 0);

  // Resolve location seamlessly across multiple potential database column naming conventions
  const resolvedLocation = dbItem.location || dbItem.location_name || dbItem.destination || dbItem.region || "Tanzania";

  return {
    // Generate a unique ID using the original DB id and the array index to solve React key collisions
    id: dbItem.id ? `${dbItem.id}-${index}` : `item-${index}`,
    name: dbItem.name ?? "Unnamed Item",
    type: dbItem.type ?? "generic",
    
    // Assign location to match the property defined in BuilderItem
    location: resolvedLocation,
    
    // Explicitly set both coordinate naming conventions so components looking for latitude/longitude or lat/lng work seamlessly
    latitude: parsedLat,
    longitude: parsedLng,
    lat: parsedLat,
    lng: parsedLng,
    
    // Pass the entire pricing object (JSON) so the pricing engine can resolve it per-tier
    price: typeof dbItem.base_price === 'object' && dbItem.base_price !== null 
      ? dbItem.base_price 
      : (typeof dbItem.price === 'object' && dbItem.price !== null ? dbItem.price : {}),
      
    image_url: dbItem.image_url ?? dbItem.imageUrl ?? null,
    category: dbItem.category ?? dbItem.type ?? null,
  };
}

/**
 * Helper to map an array of raw database items to an array of fully standardized BuilderItems.
 */
export function mapDbItemsToBuilderItems(dbItems: any[]): BuilderItem[] {
  if (!Array.isArray(dbItems)) return [];
  // Pass the index to the mapper to ensure unique IDs for each item
  return dbItems.map((item, index) => mapDbItemToBuilderItem(item, index));
}