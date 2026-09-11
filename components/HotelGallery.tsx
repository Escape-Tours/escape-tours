'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { HotelData } from "@/lib/types/HotelParkFees";
import { getStartingPrice } from '@/lib/pricing';

interface HotelGalleryProps {
  initialHotels?: Hotel[];
}

export default function HotelGallery({ initialHotels = [] }: HotelGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocation, setActiveLocation] = useState('All');

  const filteredHotels = useMemo(() => {
    const hotels = Array.isArray(initialHotels) ? initialHotels : [];
    return hotels.filter((hotel) => {
      const matchesLoc = activeLocation === 'All' || hotel?.location === activeLocation;
      const matchesSearch = hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLoc && matchesSearch;
    });
  }, [initialHotels, activeLocation, searchTerm]);

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <AnimatePresence mode="popLayout">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel, index) => {
            const price = getStartingPrice(hotel.room_prices);
            
            return (
              <motion.div
                key={hotel.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex"
              >
                <Link href={`/hotels/${hotel.slug}`} className="group flex-grow">
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={hotel.image || '/placeholder-hotel.jpg'}
                        alt={hotel.name || 'Hotel'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1 shadow-sm">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        {hotel.rating.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-black text-xl text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 font-medium">{hotel.location}</p>
                      
                      <div className="mt-auto pt-6 border-t border-gray-50">
                        <p className="text-amber-600 font-black text-lg">
                          {price > 0 ? `From $${price.toLocaleString()} / night` : "Inquire for Pricing"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-20 text-center text-gray-500"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p>Try adjusting your search criteria.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}