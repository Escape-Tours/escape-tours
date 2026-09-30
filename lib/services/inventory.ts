import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function fetchInventoryByRegion(regionTag: 'coastal' | 'southern' | 'northern') {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('region_tag', regionTag);

  if (error) {
    throw new Error(`Failed to fetch inventory for region ${regionTag}: ${error.message}`);
  }

  // Populate all possible location property keys to guarantee the frontend reads it
  return (data || []).map(item => {
    const resolvedLocation = item.location || item.region_tag || regionTag || 'Serengeti';
    return {
      ...item,
      location: resolvedLocation,
      region: resolvedLocation,
      destination: resolvedLocation,
    };
  });
}

export async function validateItineraryDayStops(itemIds: string[]): Promise<boolean> {
  const { data, error } = await supabase
    .from('inventory')
    .select('id, region_tag')
    .in('id', itemIds);

  if (error || !data) return false;

  const firstRegion = data[0]?.region_tag;
  const allSameRegion = data.every(item => item.region_tag === firstRegion);

  return allSameRegion;
}