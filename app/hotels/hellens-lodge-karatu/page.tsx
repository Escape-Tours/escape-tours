"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Play, Sparkles, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

import WhatsAppFloat from "@/components/whatsapp-float";
import { BookingModal } from "@/components/booking-modal";
import { VideoModal } from "@/components/video-modal";
import { Button } from "@/components/ui/button";
import { createClient as getSupabaseClient } from "@/lib/supabase/client"; 
import { Tables } from "@/lib/supabase/database.types";

type HotelRow = Tables<"hotels">;

// Helper to safely extract a numeric price from a nested season/tier JSON object
function getDisplayPrice(priceData: any, tier: string = "INTERNATIONAL"): number {
  if (!priceData) return 0;
  if (typeof priceData === 'number') return priceData;
  
  const target = priceData.low || priceData.high || priceData;
  if (typeof target === 'number') return target;

  if (typeof target === 'object' && target !== null) {
    if (target[tier]) return Number(target[tier]);
    const values = Object.values(target).map(v => Number(v)).filter(v => !isNaN(v));
    if (values.length > 0) return Math.min(...values);
  }

  return 0;
}

export default function HellensLodgePage() {
  const [loading, setLoading] = useState(true);
  const [lodge, setLodge] = useState<HotelRow | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<"INTERNATIONAL" | "RESIDENT" | "CITIZEN">("INTERNATIONAL");

  useEffect(() => {
    async function fetchLodgeData() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('slug', "hellens-lodge-karatu")
        .single();

      if (data) setLodge(data);
      setLoading(false);
    }
    fetchLodgeData();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 font-serif gap-4">
      <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 tracking-widest uppercase text-sm">Curating your vision...</p>
    </div>
  );

  if (!lodge) return <div className="text-center py-20 font-serif text-slate-500">Escape not found.</div>;

  const roomCategories = (Array.isArray(lodge.room_categories) ? lodge.room_categories : []) as string[];
  const roomImages = (typeof lodge.room_images === 'object' ? lodge.room_images : {}) as Record<string, string>;
  const roomPrices = (typeof lodge.room_prices === 'object' && lodge.room_prices !== null ? lodge.room_prices : {}) as Record<string, any>;
  const environmentImages = (typeof lodge.lodge_environment === 'object' && lodge.lodge_environment !== null 
    ? (lodge.lodge_environment as any).images : []) as string[];

  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* 1. Hero Section */}
      <section className="relative h-[90vh] flex items-end">
        <div className="absolute inset-0">
          {lodge.image && <Image src={lodge.image} alt={lodge.name || "Lodge"} fill className="object-cover" priority unoptimized />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pb-24 w-full">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <span className="text-amber-400 font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-2">
              <Sparkles size={14} /> Escape + Vision Collection
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tight mb-8">
              {(lodge.name || "").split(" ").slice(0,1)} <br/> 
              <span className="text-slate-300 font-light italic">{(lodge.name || "").split(" ").slice(1).join(" ")}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2 text-white/90 text-lg font-medium">
                <MapPin size={20} className="text-amber-500" /> {lodge.location}
              </span>
              {lodge.video_url && (
                <button onClick={() => setIsVideoOpen(true)} className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-amber-500 text-slate-900 rounded-full transition-all duration-500 font-bold shadow-xl">
                  <Play size={18} className="fill-current group-hover:scale-110 transition-transform" /> Watch the Vision
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Suites Section */}
      <main className="max-w-7xl mx-auto px-6 py-32">
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-xs font-bold text-amber-600 uppercase tracking-[0.3em] mb-4">Curated Living</h2>
            <p className="text-4xl md:text-6xl font-serif text-slate-900">Retreat into unparalleled comfort.</p>
          </div>
          
          {/* Global Residency Tier Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start">
            {(["INTERNATIONAL", "RESIDENT", "CITIZEN"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all uppercase ${
                  activeTier === tier ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roomCategories.map((roomName) => {
            const price = getDisplayPrice(roomPrices[roomName], activeTier);
            return (
              <motion.div key={roomName} whileHover={{ y: -10 }} className="group rounded-3xl overflow-hidden bg-slate-50 flex flex-col shadow-sm border border-slate-100 transition-shadow hover:shadow-2xl">
                <div className="h-[400px] relative overflow-hidden">
                  {roomImages[roomName] && <Image src={roomImages[roomName]} alt={roomName} fill className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" unoptimized />}
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif mb-2 text-slate-900">{roomName}</h3>
                  <p className="text-amber-700 font-bold text-lg mb-8">
                    {price > 0 ? `From $${price.toLocaleString()}` : "Price on request"}
                  </p>
                  
                  <div className="mt-auto flex flex-col gap-3">
                    <Button 
                      onClick={() => { 
                        setSelectedRoom(roomName); 
                        setIsBookingOpen(true); 
                      }} 
                      className="w-full bg-slate-900 hover:bg-amber-600 text-white rounded-full font-bold py-6"
                    >
                      Confirm Reservation
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 3. Atmosphere Section */}
      <section className="bg-slate-900 py-32 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
                <h2 className="text-5xl md:text-7xl font-serif leading-tight">Beyond the <br/><span className="text-amber-500">Ordinary.</span></h2>
                <p className="text-slate-400 leading-relaxed text-xl border-l-2 border-amber-500 pl-6 italic">
                    "Immerse yourself in the raw beauty of Karatu, knowing every detail has been curated to transform your vision of travel."
                </p>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards, Autoplay]} autoplay={{ delay: 3000 }} className="h-[450px] w-full">
                {environmentImages.map((url, i) => (
                  <SwiperSlide key={i} className="rounded-2xl overflow-hidden shadow-2xl">
                    <Image src={url} fill className="object-cover" alt="Atmosphere" unoptimized />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
        </div>
      </section>

      <WhatsAppFloat />
      <BookingModal 
        isOpen={isBookingOpen} 
        onCloseAction={() => setIsBookingOpen(false)} 
        hotel={lodge} 
        activeTier={activeTier}
        setTier={setActiveTier}
        initialCategory={selectedRoom}
      />
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoUrl={lodge.video_url || ""} />
    </div>
  );
}