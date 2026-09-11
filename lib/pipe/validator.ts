"use server"

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database.types';

// Use the exact name you defined
type InventoryItem = Database['public']['Tables']['inventory']['Row'];

export async function validatePayload(
  item: InventoryItem, // Corrected from InventoryRow
  slotId: string, 
  residencyTier: string
): Promise<boolean> {
  const supabase = await createClient();

  // 1. Fetch item with strong typing
  const { data: inventoryItem, error } = await supabase
    .from('inventory')
    .select('id, name, pricing_rules, availability')
    .eq('id', item.id)
    .single();

  if (error || !inventoryItem) {
    console.error(`Validation failed: Item ${item.id} not found`, error);
    return false;
  }

  // 2. Perform Data Integrity Checks
  try {
    const checks = [
      checkAvailability(inventoryItem.availability),
      // Pass the typed JSON directly
      checkTierCompliance(inventoryItem.pricing_rules, residencyTier),
      checkSlotConflict(slotId)
    ];

    return checks.every(check => check === true);
  } catch (err) {
    console.error("Validation logic error:", err);
    return false;
  }
}

// Enhanced Helper Functions with Type Safety
function checkTierCompliance(rules: Database['public']['Tables']['inventory']['Row']['pricing_rules'], tier: string): boolean {
  // Narrowing the JSON type to an object we can inspect
  const rulesObj = rules as { allowed_tiers?: string[] };
  const allowedTiers = rulesObj?.allowed_tiers;
  return Array.isArray(allowedTiers) && allowedTiers.includes(tier);
}

function checkAvailability(availability: Database['public']['Tables']['inventory']['Row']['availability']): boolean {
  // You can now safely check the structure of your JSON availability column
  return availability !== null && typeof availability === 'object';
}

function checkSlotConflict(slotId: string): boolean {
  return typeof slotId === 'string' && slotId.length > 0;
}