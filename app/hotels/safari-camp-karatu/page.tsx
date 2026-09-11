  "use client";

  import { useState, useEffect } from "react";
  import Image from "next/image";
  import { motion } from "framer-motion";
  import { MapPin, ChevronRight, Loader2, Play } from "lucide-react";
  import WhatsAppFloat from "@/components/whatsapp-float";
  import { BookingModal } from "@/components/booking-modal";
  import { VideoModal } from "@/components/video-modal";
  import { Button } from "@/components/ui/button";
  import { getSupabaseClient } from "@/lib/supabase/client";

  export default function SafariCampPage() {
    const [loading, setLoading] = useState(true);
    const [lodge, setLodge] = useState<any>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState("");

    useEffect(() => {
      async function fetchLodgeData() {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from('hotels')
          .select('*')
          .eq('slug', "safari-camp-karatu")
          .single();

        if (data) {
          setLodge(data);
          setSelectedRoom(data.room_categories[0]);
        }
        setLoading(false);
      }
      fetchLodgeData();
    }, []);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    if (!lodge) return <div className="text-center py-20">Safari Camp not found.</div>;

    const basePrices = lodge.room_prices ? Object.fromEntries(
      Object.entries(lodge.room_prices).map(([room, details]: [string, any]) => [room, details.low])
    ) : {};

    return (
      <div className="bg-white min-h-screen">
        {/* 1. Hero Section with Video Trigger */}
        <section className="relative h-[60vh] flex items-end">
          <Image 
            src={lodge.image || "/images/fallback-hero.jpg"} 
            alt={lodge.name} fill className="object-cover" priority unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="relative max-w-7xl mx-auto p-8 w-full text-white">
            <div className="flex items-center gap-4">
              <motion.h1 className="text-5xl md:text-7xl font-black">{lodge.name.toUpperCase()}</motion.h1>
              {lodge.video_url && (
                <button 
                  onClick={() => setIsVideoOpen(true)} 
                  className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/20"
                >
                  <Play size={24} className="fill-white" />
                </button>
              )}
            </div>
            <p className="flex items-center gap-2 text-amber-400 mt-2"><MapPin size={18} /> {lodge.location}</p>
          </div>
        </section>

        {/* 2. Rooms Grid with Polished Pricing */}
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {lodge.room_categories.map((roomName: string) => (
              <motion.div key={roomName} whileHover={{ y: -10 }} className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all">
                <div className="h-64 relative">
                  <Image 
                    src={lodge.room_images[roomName] || "/images/fallback-room.jpg"} 
                    alt={roomName} fill className="object-cover" unoptimized 
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold">{roomName}</h3>
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium text-slate-500">From</span>
                      <span className="text-3xl font-extrabold text-blue-600 tracking-tight">${basePrices[roomName] || "0"}</span>
                      <span className="text-xs text-slate-400 font-medium">/night</span>
                    </div>
                    <Button onClick={() => { setSelectedRoom(roomName); setIsBookingOpen(true); }} className="rounded-full">
                      Book Now <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        {/* 3. Lodge Environment */}
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100">
          <h2 className="text-4xl font-bold mb-8">Lodge Environment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lodge.lodge_environment?.images?.map((url: string, index: number) => (
              <div key={index} className="relative h-64 w-full">
                <Image src={url} alt={`Environment ${index + 1}`} fill className="object-cover rounded-2xl" unoptimized />
              </div>
            ))}
          </div>
        </section>

        <WhatsAppFloat />
        
        {/* Modals */}
        <BookingModal
        bookingType="hotel"
          isOpen={isBookingOpen}
          onCloseAction={() => setIsBookingOpen(false)}
          hotelName={lodge.name}
          roomCategories={lodge.room_categories}
          defaultCategory={selectedRoom}
          roomPrices={basePrices}
        />
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={lodge.video_url}
        />
      </div>
    );
  }