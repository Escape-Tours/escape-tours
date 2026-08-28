import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the interface for the raw DB record
interface InventoryRecord {
  id: string;
  name: string;
  type: string;
  base_price: any;
  trek_pricing: any;
  image_url: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type')?.toLowerCase();

    if (!type) {
      return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
    }

    // 1. Optimized Select: Fetch everything so the frontend has full context
    const { data, error } = await supabase
      .from('inventory')
      .select('id, name, type, base_price, trek_pricing, image_url, category, latitude, longitude')
      .eq('type', type);

    if (error) throw error;

    // 2. Pass-through Normalization
    // We return the full data object. This ensures the bridge is not broken by
    // stripping fields or assuming structure that might be null.
    const normalizedData = (data as InventoryRecord[] || []).map((item) => {
      return {
        ...item,
        // Ensure base_price is never undefined/null for the frontend logic
        base_price: item.base_price || {}
      };
    });

    // 3. Add Cache Headers
    return NextResponse.json(normalizedData, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        'Content-Type': 'application/json'
      }
    });

  } catch (err: any) {
    console.error('Inventory API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}