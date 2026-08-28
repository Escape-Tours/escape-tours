"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, Users, Sparkles, Phone } from "lucide-react";

import WhatsAppFloat from "@/components/whatsapp-float";
import { BookingModal } from "@/components/booking-modal";
import { Button } from "@/components/ui/button";

type Tier = "CITIZEN" | "RESIDENT" | "INTERNATIONAL";

const rooms = [
  {
    name: "Family Room",
    image: "/images/hotels/merera-family.jpg",
    description: "Spacious sanctuary with traditional craftsmanship and vast vistas.",
    prices: { CITIZEN: 60, RESIDENT: 150, INTERNATIONAL: 270 }
  },
  {
    name: "Double Room",
    image: "/images/hotels/merera-double.jpg",
    description: "A perfect marriage of traditional aesthetic and modern luxury.",
    prices: { CITIZEN: 83, RESIDENT: 191, INTERNATIONAL: 250 }
  },
  {
    name: "Single Room",
    image: "/images/hotels/merera-single.jpg",
    description: "An intimate space for the solo visionary, offering mountain serenity.",
    prices: { CITIZEN: 45, RESIDENT: 90, INTERNATIONAL: 120 }
  },
];

export default function MereraVillageLodgePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0].name);
  const [tier, setTier] = useState<Tier>("RESIDENT");

  // Improved Price Logic: Handles potential missing data gracefully
  const tierPrices = useMemo(() => {
    return rooms.reduce((acc, room) => {
      const price = room.prices[tier];
      acc[room.name] = price ? `$${price.toLocaleString()}` : "Inquire";
      return acc;
    }, {} as Record<string, string>);
  }, [tier]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 selection:bg-orange-200">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <Image src="/images/hotels/merera-exterior.jpg" alt="Merera Village Lodge" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto p-8 md:p-12 w-full text-white">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-orange-400 mb-4">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">The Escape + Vision Collection</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">MERERA VILLAGE</h1>
          <p className="flex items-center gap-2 text-slate-200 font-light"><MapPin size={16} /> Karatu, Tanzania</p>
        </div>
      </section>

      {/* Tier Switcher Sticky Nav */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Users size={14} /> Residency Tier
          </div>
          <div className="flex bg-slate-100 p-1 rounded-full w-full md:w-auto shadow-inner">
            {(["CITIZEN", "RESIDENT", "INTERNATIONAL"] as Tier[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`relative flex-1 md:flex-none px-6 py-2 rounded-full text-[10px] font-bold transition-all duration-300 ${tier === t ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tier === t && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white shadow-sm rounded-full" />}
                <span className="relative z-10 uppercase tracking-widest">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <motion.div key={room.name} layout className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="h-64 relative overflow-hidden">
                <Image src={room.image} alt={room.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-8 space-y-6 flex-grow flex flex-col">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">{room.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{room.description}</p>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Nightly</span>
                    <AnimatePresence mode="wait">
                      <motion.span key={`${room.name}-${tier}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-black">
                        {tierPrices[room.name]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <Button onClick={() => { setSelectedRoom(room.name); setIsBookingOpen(true); }} className="rounded-full bg-slate-900 hover:bg-orange-600 text-white font-medium px-6 transition-all shadow-lg hover:shadow-orange-500/20">
                    Book <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <WhatsAppFloat />
      <BookingModal
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Merera Village Lodge"
        roomCategories={rooms.map(r => r.name)}
        defaultCategory={selectedRoom}
        roomPrices={tierPrices}
      />
    </div>
  );
}