// lib/supabase/hotel-service.ts
import { createClient } from '@/lib/supabase/client';
import { HotelData, isHotelData } from '@/types/hotel';

/**
 * Custom error class for granular debugging
 */
class HotelServiceError extends Error {
  constructor(public message: string, public code: string) {
    super(message);
    this.name = 'HotelServiceError';
  }
}

/**
 * Fetches hotel data by slug with runtime validation and error handling
 */
export const getHotelBySlug = async (slug: string): Promise<HotelData> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw new HotelServiceError(
      `Failed to fetch hotel: ${error.message}`,
      error.code || 'UNKNOWN_ERROR'
    );
  }

  // Runtime Type Guard: Ensures the DB response actually matches your interface
  if (!isHotelData(data)) {
    throw new HotelServiceError(
      'Database schema mismatch: Received data does not match HotelData interface.',
      'SCHEMA_MISMATCH'
    );
  }

  return data;
};