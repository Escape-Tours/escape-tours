'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { TablesInsert } from '@/lib/database.types'; // Import the generated type

/**
 * Handles the creation of new itinerary entries.
 * Now using the generated 'itineraries' table type.
 */
export async function submitItinerary(data: TablesInsert<'itineraries'>) {
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from('itineraries') // Changed from 'tours' to 'itineraries'
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Database Error:', error);
    throw new Error('Could not save the itinerary to the database.');
  }

  // Refreshes the itinerary-builder page data
  revalidatePath('/itinerary-builder');
  
  return result;
}