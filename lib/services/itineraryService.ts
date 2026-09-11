import { createClient } from '@/lib/supabase/client';

export const saveItinerary = async (itineraryId: string, title: string, days: any[]) => {
  if (!itineraryId || !title) throw new Error("Itinerary ID and Title are required.");

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Use the authenticated user ID or the development fallback
  const userId = user?.id || '6590822a-f110-4c42-8c23-80afd256059d';

  // Ensure day_number is explicitly cast to a valid integer to satisfy the not-null constraint
  const daysToSave = days.map((d, index) => ({ 
    id: d.id, 
    itinerary_id: itineraryId, 
    day_number: Number(d.dayNumber) || index + 1 
  }));

  const itemsToSave = days.flatMap(day => 
    Object.entries(day.slots || {})
      .filter(([_, item]) => item !== null && item !== undefined)
      .map(([slot, item]: [string, any]) => ({
        itinerary_id: itineraryId,
        day_id: day.id,
        type: slot,
        day: Number(day.dayNumber) || 1,
        service_id: item.id || 'default',
        price: Number(item.price) || 0
      }))
  );

  // Call the Supabase RPC function using type assertion and clean parameters payload
  const { data, error } = await (supabase.rpc as any)('save_itinerary_full', {
    p_itinerary_id: itineraryId,
    p_user_id: userId,
    p_title: title,
    p_days: daysToSave,
    p_items: itemsToSave
  });

  if (error) {
    const errorMessage = error.message || JSON.stringify(error);
    const errorDetails = error.details || '';
    const errorHint = error.hint || '';
    const errorCode = error.code || '';

    console.error("Supabase RPC Error Details:", { 
      message: errorMessage, 
      details: errorDetails, 
      hint: errorHint,
      code: errorCode
    });
    
    throw new Error(`RPC Failed [${errorCode}]: ${errorMessage} ${errorDetails}`);
  }

  return { success: true, data };
};