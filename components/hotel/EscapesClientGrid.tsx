'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HotelImage360 from '@/components/hotel/HotelImage360';

type Tier = "CITIZEN" | "RESIDENT" | "INTERNATIONAL";

export default function EscapesClientGrid({ hotels }: { hotels: any[] }) {
  // Defaulting to INTERNATIONAL or RESIDENT tier for price calculation
  const defaultTier: Tier = "INTERNATIONAL";

  // DEFENSIVE: Safely calculate price based on the tier structure
  const getTierPrice = (hotel: any) => {
    if (!hotel?.room_prices) return null;

    // If room_prices is a direct number or string value
    if (typeof hotel.room_prices === 'number') return hotel.room_prices;
    if (typeof hotel.room_prices === 'string' && !isNaN(Number(hotel.room_prices))) {
      return Number(hotel.room_prices);
    }

    // If room_prices is stored as an object/array map
    if (typeof hotel.room_prices === 'object') {
      try {
        const roomValues = Object.values(hotel.room_prices);
        const prices = roomValues
          .map((room: any) => {
            if (typeof room === 'number') return room;
            // Check nested patterns e.g. room.low.INTERNATIONAL or room[tier]
            return room?.low?.[defaultTier] || room?.[defaultTier] || room?.price || null;
          })
          .filter((p): p is number => typeof p === 'number' && !isNaN(p));
          
        return prices.length > 0 ? Math.min(...prices) : null;
      } catch (e) {
        return null;
      }
    }

    return null;
  };

  return (
    <>
      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {hotels.map((hotel) => {
          const price = getTierPrice(hotel);
          
          return (
            <Link 
              href={`/hotels/${hotel.slug}`} 
              key={hotel.id} 
              className="group block bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-xl hover:border-pink-500/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-white/5">
                <HotelImage360 
                  image={hotel.image} 
                  name={hotel.name} 
                  has360={hotel.has_360 ?? false} 
                />
              </div>
              <div className="px-3 pb-3">
                <h2 className="text-xl font-black text-white mb-2">{hotel.name}</h2>
                <div className="flex items-center text-slate-400 text-xs mb-8">
                  <MapPin size={12} className="mr-1.5 text-pink-400" /> {hotel.location}
                </div>
                <div className="pt-5 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Starting from</span>
                  
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={`${hotel.id}-price`} 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="text-lg font-black text-white"
                    >
                      {price !== null ? `$${price.toLocaleString()}` : "Inquire"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}