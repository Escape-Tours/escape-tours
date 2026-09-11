import { createClient } from '@/lib/supabase/server';
import EscapesClientGrid from '@/components/hotel/EscapesClientGrid';
import { Metadata } from 'next';
import { Suspense } from 'react';

// SEO Metadata for search engines
export const metadata: Metadata = {
  title: 'ESCAPE + VISION | Curated Collection',
  description: 'Hand-picked luxury travel experiences and partner hotels by ESCAPE + VISION.',
};

// Revalidation strategy (cache for 1 hour)
export const revalidate = 3600;

export default async function EscapesPage() {
  try {
    const supabase = await createClient();

    // 1. Optimized fetch: Select from 'hotels' table matching your exact database schema
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select('id, name, slug, location, image, room_prices, rating')
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase query error on /hotels:", error.message);
      return <ErrorState />;
    }

    // 2. Deep Serialization
    // Prevents Next.js hydration issues by forcing plain JSON structure
    const safeHotels = JSON.parse(JSON.stringify(hotels || []));

    if (safeHotels.length === 0) return <EmptyState />;

    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 sm:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 md:px-12 selection:bg-pink-500 selection:text-white overflow-x-hidden">
        <div className="container mx-auto max-w-7xl space-y-6 sm:space-y-8 w-full">
          <Header />
          
          {/* Suspense boundary for the client-side interactive grid */}
          <Suspense fallback={<GridLoading />}>
            <EscapesClientGrid hotels={safeHotels} />
          </Suspense>
        </div>
      </main>
    );
  } catch (err: any) {
    console.error("CRITICAL ERROR in ESCAPE + VISION Page:", err?.message || err);
    return <ErrorState />;
  }
}

// --- Sub-components ---

function Header() {
  return (
    <div className="mb-8 sm:mb-12 text-center md:text-left relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-pink-500/30 p-6 sm:p-8 shadow-2xl">
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[11px] sm:text-xs font-black tracking-wider uppercase">
          The ESCAPE + VISION Collection
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Visionary Escapes
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed font-light">
          Redefining luxury through the ESCAPE + VISION lens. Authentic, profound, and meticulously curated with live residency pricing tiers.
        </p>
      </div>
    </div>
  );
}

function GridLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-80 sm:h-96 bg-slate-900 border border-white/10 rounded-2xl" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center text-center p-4 sm:p-6">
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 sm:p-12 max-w-md w-full space-y-4 shadow-xl">
        <h2 className="text-lg sm:text-xl font-black text-white">Collection Coming Soon</h2>
        <p className="text-xs sm:text-sm text-slate-400">Check back shortly for new visionary escapes and partner hotel listings.</p>
      </div>
    </main>
  );
}

function ErrorState() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 text-center">
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 sm:p-12 max-w-md w-full space-y-4 shadow-xl">
        <h2 className="text-lg sm:text-xl font-black text-white">Service Unavailable</h2>
        <p className="text-xs sm:text-sm text-slate-400">The ESCAPE + VISION collection is currently unreachable. Please verify your Supabase environment variables or table permissions.</p>
      </div>
    </main>
  );
}