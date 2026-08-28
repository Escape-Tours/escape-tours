import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

import { createClient } from '@/lib/supabase/server';
import { Button } from "@/components/ui/button";
import { BookingWrapper } from "@/components/booking-wrapper";
import WhatsAppFloat from "@/components/whatsapp-float";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Stay at ${slug.replace(/-/g, ' ')} | Luxury Accommodation` };
}

export default async function HotelSlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: hotel, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !hotel) notFound();

  const safeParse = (val: any) => {
    try { return typeof val === 'string' ? JSON.parse(val) : (val || {}); } catch { return {}; }
  };

  const prices = safeParse(hotel.room_prices);
  const roomImages = safeParse(hotel.room_images);
  const envData = safeParse(hotel.lodge_environment);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[60vh] flex items-end">
        {typeof hotel.image === 'string' && hotel.image.trim().length > 5 && (
          <Image 
            src={hotel.image} 
            alt={hotel.name ?? "Hotel"} 
            fill 
            className="object-cover" 
            priority 
            sizes="100vw" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative max-w-7xl mx-auto p-10 w-full text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-4">{hotel.name}</h1>
          <p className="flex items-center gap-2 text-amber-400 text-lg font-medium">
            <MapPin size={20} /> {hotel.location ?? "Tanzania"}
          </p>
          <div className="mt-6 flex items-center gap-2 text-white/90">
            <ShieldCheck size={20} className="text-emerald-400" />
            <span className="text-sm font-medium tracking-wide uppercase">Hand-picked Luxury Selection</span>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black mb-16 text-center">Our Sanctuaries</h2>
        <div className="space-y-20">
          {(hotel.room_categories ?? []).map((cat: string, index: number) => (
            <div key={cat} className={`grid md:grid-cols-2 gap-10 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-xl bg-gray-100">
                {roomImages[cat] && typeof roomImages[cat] === 'string' && (
                  <Image src={roomImages[cat]} alt={cat} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                )}
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">{cat}</h3>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  {renderPrice(prices[cat])}
                </div>
                <div className="flex gap-4">
                  <BookingWrapper 
                    hotelName={hotel.name ?? ""} 
                    category={cat} 
                    hotel={hotel}
                    defaultTierId="INTERNATIONAL" 
                  />
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/itinerary-builder">Add to Itinerary</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-6 text-center">Lodge Environment</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            {envData.description ?? "Immerse yourself in the tranquility of the surrounding landscape."}
          </p>
          {envData.images && Array.isArray(envData.images) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {envData.images.map((url: string, idx: number) => (
                <div key={idx} className="relative h-64 rounded-xl overflow-hidden shadow-md">
                   {url && typeof url === 'string' && (
                     <Image src={url} alt="Env" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
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

function renderPrice(priceData: any) {
  if (!priceData) return <span className="text-gray-400 italic">Price on request</span>;

  // If it's a direct number or flat string value
  if (typeof priceData === 'number' || !isNaN(Number(priceData))) {
    return <span className="text-2xl font-black text-[#d97706]">${Number(priceData).toLocaleString()} / night</span>;
  }

  // If it's an object containing sub-structures (e.g. { low: { INTERNATIONAL: 150, RESIDENT: 100 } } or tier maps)
  if (typeof priceData === 'object') {
    // Flatten or check known keys like 'low', or map through entries recursively
    const entries = Object.entries(priceData);
    if (entries.length === 0) return <span className="text-gray-400 italic">Price on request</span>;

    return (
      <div className="space-y-2">
        {entries.map(([key, val]: [string, any]) => {
          // If the sub-value is also an object (e.g., tier map under 'low' or category name)
          if (typeof val === 'object' && val !== null) {
            return (
              <div key={key} className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{key} Season</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(val).map(([subKey, subVal]) => (
                    <div key={subKey} className="flex justify-between items-center text-sm font-semibold text-gray-700 bg-white p-2 rounded border border-gray-100">
                      <span className="uppercase text-[10px] text-gray-500">{subKey}:</span>
                      <span className="text-[#d97706]">${typeof subVal === 'number' ? subVal.toLocaleString() : subVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="flex justify-between items-center text-lg font-bold text-gray-700">
              <span className="capitalize">{key}:</span>
              <span className="text-[#d97706]">${typeof val === 'number' ? val.toLocaleString() : val} / night</span>
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-gray-400 italic">Price on request</span>;
}