import { createClient } from '@/lib/supabase/client';
import { useItineraryStore } from '@/store/useItineraryStore';

export const saveUserItinerary = async () => {
  const supabase = createClient();
  
  // 1. Check if a user is currently logged in via Supabase Auth
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("You must be logged in to save an itinerary.");
    return null;
  }

  // 2. Pull state directly from your Zustand store
  const { totalDays, tier, items } = useItineraryStore.getState();
  
  // 3. Compute the live grand total quote from all added items
  const totalPrice = items.reduce((acc, i) => acc + (Number(i.price) || 0), 0);

  // 4. Insert the data into your Supabase 'itineraries' table with explicit typing to prevent never-type inference errors
  const insertPayload: Record<string, any> = {
    user_id: user.id,
    title: 'Safari Odyssey',
    total_price: totalPrice,
    total_days: totalDays,
    status: 'draft',
    tier: tier
  };

  const { data, error } = await supabase
    .from('itineraries')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("Error saving itinerary to Supabase:", error.message);
    return null;
  }

  return data;
};