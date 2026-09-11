"use client";

import { useItineraryStore } from '@/store/useItineraryStore';
import { Button } from "@/components/ui/button";
import { createBrowserClient } from '@supabase/ssr';

export const AddToItineraryButton = ({ item }: { item: any }) => {
  const { addCartItem } = useItineraryStore();
  
  // Initialize Supabase client for the browser using standard @supabase/ssr
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // 1. Strictly enforce authentication check first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert("Please log in to your User Hub first to start building your itinerary.");
        window.location.href = '/user-hub'; // Redirects to User Hub / Login
        return;
      }

      // 2. Update local Zustand cart state using addCartItem (avoids missing dayId/timeSlot error)
      addCartItem({
        originalId: item.id || item.slug || item.title || item.name,
        name: item.title || item.name,
        type: item.type || 'activities',
        basePrice: item.basePrice || item.base_price || item.price || 0,
        price: item.price || 0,
        selectedRoomType: item.selectedRoomType,
      });
      console.log("Added to itinerary cart:", item.title || item.name);

      // 3. Find or create an active draft itinerary for this user in Supabase
      let { data: activeItinerary } = await supabase
        .from('itineraries')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'draft')
        .single();

      if (!activeItinerary) {
        const { data: newItinerary, error: createError } = await supabase
          .from('itineraries')
          .insert([
            {
              user_id: session.user.id,
              title: 'My Custom Expedition',
              status: 'draft',
              circuit: 'Tanzania Circuit'
            }
          ])
          .select('id')
          .single();

        if (createError) throw createError;
        activeItinerary = newItinerary;
      }

      // 4. Sync item to Supabase database for the User Hub session
      const itemName = item.title || item.name;
      const { error: itemError } = await supabase
        .from('itinerary_items')
        .insert([
          {
            itinerary_id: activeItinerary.id,
            item_id: item.id || item.slug || itemName.toLowerCase().replace(/\s+/g, '-'),
            item_type: item.type || 'tour',
            item_name: itemName
          }
        ]);

      if (itemError) {
        console.error("Supabase sync error:", itemError.message);
      } else {
        alert(`Success! "${itemName}" has been added to your itinerary cart.`);
      }

    } catch (err: any) {
      console.error("Error linking item to User Hub:", err.message);
    }
  };

  return (
    <Button 
      type="button"
      onClick={handleAdd}
      className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold"
    >
      Add to Itinerary Cart
    </Button>
  );
};