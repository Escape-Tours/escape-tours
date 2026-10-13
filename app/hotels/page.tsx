import { createClient } from '@/lib/supabase/server';
import EscapesPageClient from '@/components/hotel/EscapesPageClient';
import { Metadata } from 'next';

// SEO Metadata for search engines
export const metadata: Metadata = {
  title: 'ESCAPE + VISION | Curated Collection',
  description: 'Hand-picked luxury travel experiences and partner hotels by ESCAPE + VISION.',
};

// Revalidation strategy (cache for 1 hour to ensure lightning-fast page delivery)
export const revalidate = 3600;

export default async function EscapesPage() {
  let hotelsData: any[] = [];

  try {
    let supabase;
    try {
      supabase = await createClient();
    } catch (clientErr: any) {
      console.warn("Supabase client init warning:", clientErr?.message || clientErr);
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, slug, location, image, room_prices, rating, video_url')
        .order('name', { ascending: true });

      if (error) {
        console.warn("Supabase query warning on /hotels:", error.message);
      } else if (data) {
        hotelsData = data;
      }
    }
  } catch (err: any) {
    console.warn("Network fetch caught for /hotels, falling back to local structure:", err?.message || err);
  }

  // Fallback mock data if offline or network fetch fails so the UI never crashes
  if (!hotelsData || !Array.isArray(hotelsData) || hotelsData.length === 0) {
    hotelsData = [
      {
        id: 'fallback-1',
        name: 'Serengeti Migration Sanctuary',
        slug: 'serengeti-migration-sanctuary',
        location: 'Serengeti National Park',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
        room_prices: { standard: 450, deluxe: 650 },
        rating: 4.9,
        video_url: ''
      },
      {
        id: 'fallback-2',
        name: 'Ngorongoro Crater Lodge',
        slug: 'ngorongoro-crater-lodge',
        location: 'Ngorongoro Conservation Area',
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
        room_prices: { standard: 520, deluxe: 780 },
        rating: 4.8,
        video_url: ''
      }
    ];
  }

  const safeHotels = JSON.parse(JSON.stringify(hotelsData));

  return (
    <div className="min-h-screen bg-stone-50 antialiased selection:bg-amber-500 selection:text-white">
      <EscapesPageClient hotels={safeHotels} />
    </div>
  );
}