// app/hotels/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, Globe, Calendar } from "lucide-react";
import { Metadata } from "next";

import { createClient } from '@/lib/supabase/server';
import { Button } from "@/components/ui/button";
import { BookingWrapper } from "@/components/booking-wrapper";
import WhatsAppFloat from "@/components/whatsapp-float";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = typeof slug === 'string' ? slug : 'sanctuary';
  return { title: `Stay at ${cleanSlug.replace(/-/g, ' ')} | Escape Tours & Safaris` };
}

// Automated season detector based on East African safari patterns (High: Jun-Oct & Jan-Feb; Low: Mar-May & Nov-Dec)
function getCurrentSeason(date: Date = new Date()): 'high' | 'low' {
  const month = date.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
  if ((month >= 0 && month <= 1) || (month >= 5 && month <= 9)) {
    return 'high';
  }
  return 'low';
}

export default async function HotelSlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  
  let hotel: any = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      hotel = data;
    }
  } catch (err) {
    console.warn("Supabase fetch exception on hotel slug page:", err);
  }

  // Fallback fallback if offline or record not found in DB
  if (!hotel) {
    hotel = {
      name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Luxury Sanctuary',
      location: 'Tanzania Safari Circuit',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      room_categories: ['Standard Suite', 'Deluxe Villa'],
      room_prices: {
        'Standard Suite': { High: { CITIZEN: 250, RESIDENT: 300, INTERNATIONAL: 450 }, Low: { CITIZEN: 180, RESIDENT: 220, INTERNATIONAL: 350 } },
        'Deluxe Villa': { High: { CITIZEN: 400, RESIDENT: 500, INTERNATIONAL: 700 }, Low: { CITIZEN: 300, RESIDENT: 380, INTERNATIONAL: 550 } }
      },
      room_images: {},
      lodge_environment: { description: 'Immerse yourself in the tranquility of the surrounding landscape and untamed wildlife.' }
    };
  }

  const safeParse = (val: any) => {
    try { 
      if (typeof val === 'string') return JSON.parse(val);
      if (typeof val === 'object' && val !== null) return val;
      return {}; 
    } catch { return {}; }
  };

  const prices = safeParse(hotel.room_prices);
  const roomImages = safeParse(hotel.room_images);
  const envData = safeParse(hotel.lodge_environment);
  const roomCategories = Array.isArray(hotel.room_categories) ? hotel.room_categories : Object.keys(prices);

  // Automatically determine season based on current date
  const activeSeason = getCurrentSeason();
  const activeSeasonKey = activeSeason === 'high' ? 'High' : 'Low';

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-end">
        {typeof hotel.image === 'string' && hotel.image.trim().length > 5 && (
          <Image 
            src={hotel.image} 
            alt={hotel.name ?? "Luxury Lodge"} 
            fill 
            className="object-cover" 
            priority 
            sizes="100vw" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto p-10 w-full text-white space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-[0.2em] text-xs">
            <Globe size={14} /> Featured Itinerary Sanctuary
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight">{hotel.name}</h1>
          <p className="flex items-center gap-2 text-stone-200 text-base font-medium">
            <MapPin size={18} className="text-amber-400" /> {hotel.location ?? "Tanzania Safari Circuit"}
          </p>
          <div className="pt-2 flex items-center gap-2 text-stone-300">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span className="text-xs font-semibold tracking-wider uppercase">Verified Luxury Partner Property</span>
          </div>
        </div>
      </section>

      {/* Room Categories Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-amber-700 text-xs font-bold uppercase tracking-[0.25em]">Accommodations</span>
          <h2 className="text-4xl font-serif text-stone-900">Sanctuaries & Suites</h2>
          <p className="text-stone-600 text-sm">Select your preferred room configuration below to proceed with your booking calculation.</p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold tracking-wide mt-2">
            <Calendar size={14} />
            System Auto-Selected: {activeSeasonKey} Season Rates ({new Date().toLocaleDateString()})
          </div>
        </div>

        <div className="space-y-20">
          {roomCategories.map((cat: string, index: number) => (
            <div key={cat} className={`grid md:grid-cols-2 gap-12 items-center bg-white p-8 rounded-[2.5rem] border border-stone-200/60 shadow-xl shadow-stone-200/40 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="relative h-80 w-full overflow-hidden rounded-3xl shadow-inner bg-stone-100">
                {roomImages[cat] && typeof roomImages[cat] === 'string' ? (
                  <Image src={roomImages[cat]} alt={cat} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm italic bg-stone-200/50">Sanctuary View</div>
                )}
              </div>
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800/80">Room Category</span>
                  <h3 className="text-3xl font-serif text-stone-900">{cat}</h3>
                </div>
                
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/60">
                  {renderActiveSeasonPrice(prices[cat], activeSeasonKey)}
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <BookingWrapper 
                    hotelName={hotel.name ?? ""} 
                    category={cat} 
                    hotel={hotel}
                    defaultTierId="CITIZEN" 
                  />
                  <Button variant="outline" size="lg" className="rounded-xl border-stone-300 font-semibold text-stone-700 hover:bg-stone-100" asChild>
                    <Link href="/itinerary-builder">Add to Itinerary Builder</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lodge Environment Section */}
      <section className="py-24 bg-stone-900 text-white border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.25em]">Surroundings</span>
            <h2 className="text-3xl md:text-4xl font-serif">Lodge Environment & Wilderness</h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              {envData.description ?? "Immerse yourself in the tranquility of the surrounding landscape and untamed wildlife."}
            </p>
          </div>

          {envData.images && Array.isArray(envData.images) && envData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {envData.images.map((url: string, idx: number) => (
                <div key={idx} className="relative h-72 rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
                   {url && typeof url === 'string' && (
                     <Image src={url} alt="Lodge Environment" fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
                   )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <WhatsAppFloat />
    </main>
  );
}

function renderActiveSeasonPrice(priceData: unknown, targetSeason: string): React.ReactNode {
  try {
    if (!priceData) return <span className="text-stone-400 italic text-sm">Price on request</span>;

    if (typeof priceData === 'number' || !isNaN(Number(priceData))) {
      return <span className="text-2xl font-serif font-bold text-amber-700">${Number(priceData).toLocaleString()} <span className="text-xs font-sans text-stone-500 font-normal">/ night</span></span>;
    }

    if (typeof priceData === 'object' && priceData !== null) {
      const entries = Object.entries(priceData);
      if (entries.length === 0) return <span className="text-stone-400 italic text-sm">Price on request</span>;

      // Find matching season safely
      const matchingEntry = entries.find(([key]) => key && typeof key === 'string' && key.toLowerCase().includes(targetSeason.toLowerCase())) || entries[0];
      if (!matchingEntry) return <span className="text-stone-400 italic text-sm">Price on request</span>;

      const [seasonKey, seasonVal] = matchingEntry;

      if (typeof seasonVal === 'object' && seasonVal !== null) {
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-stone-200 pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                {String(seasonKey)} Season Rates (Active)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(seasonVal as Record<string, unknown>).map(([occupancyKey, occupancyVal]) => {
                if (typeof occupancyVal === 'object' && occupancyVal !== null) {
                  return (
                    <div key={occupancyKey} className="bg-white p-3.5 rounded-xl border border-stone-200/85 shadow-sm space-y-1.5">
                      <span className="text-[10px] font-black tracking-wider uppercase text-stone-400 block">{occupancyKey}</span>
                      <div className="space-y-1 pt-1">
                        {Object.entries(occupancyVal as Record<string, unknown>).map(([residencyKey, finalPrice]) => (
                          <div key={residencyKey} className="flex justify-between items-center text-xs">
                            <span className="text-stone-600 font-medium capitalize">{String(residencyKey).toLowerCase()}:</span>
                            <span className="text-amber-700 font-bold">
                              ${typeof finalPrice === 'number' ? finalPrice.toLocaleString() : String(finalPrice ?? '0')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={occupancyKey} className="flex justify-between items-center text-sm font-semibold text-stone-700 bg-white p-3 rounded-xl border border-stone-200/85 shadow-sm">
                    <span className="uppercase text-[11px] text-stone-500">{occupancyKey}:</span>
                    <span className="text-amber-700 font-bold">
                      ${typeof occupancyVal === 'number' ? occupancyVal.toLocaleString() : String(occupancyVal ?? '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div className="flex justify-between items-center text-lg font-serif font-bold text-stone-800">
          <span className="capitalize">{String(seasonKey)} (Active):</span>
          <span className="text-amber-700">${typeof seasonVal === 'number' ? seasonVal.toLocaleString() : String(seasonVal)} <span className="text-xs font-sans text-stone-500 font-normal">/ night</span></span>
        </div>
      );
    }

    return <span className="text-stone-400 italic text-sm">Price on request</span>;
  } catch (err) {
    console.warn("Error rendering season price safely:", err);
    return <span className="text-stone-400 italic text-sm">Price on request</span>;
  }
}