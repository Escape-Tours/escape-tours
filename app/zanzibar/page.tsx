"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Clock, MessageCircle, Sparkles, Check } from "lucide-react";
import { useState, useEffect } from "react";

const tours = [
  { id: "stone-town", title: "Stone Town Tour", duration: "Half Day", price: 238, image: "/images/stone-town.jpg", desc: "Explore the historic UNESCO World Heritage Site, wandering through winding streets filled with architectural influences." },
  { id: "prison-island", title: "Prison Island Tour", duration: "Half Day", price: 300, image: "/images/prison-island-tortoise.jpg", desc: "Meet the giant Aldabra tortoises and enjoy world-class snorkeling in crystal-clear reefs." },
  { id: "spice-tour", title: "Spice Tour", duration: "Half Day", price: 220, image: "/images/spice-tour.jpg", desc: "An aromatic journey through Zanzibar's lush plantations. Learn the history of cloves, nutmeg, and vanilla." },
  { id: "turtle-sanctuary", title: "Nungwi Turtle Sanctuary", duration: "Half Day", price: 200, image: "/images/sea-turtle.jpg", desc: "Support marine conservation by visiting endangered sea turtles in their natural lagoon." },
  { id: "rock-restaurant", title: "The Rock Restaurant", duration: "Evening", price: 200, image: "/images/rock-restaurant.jpg", desc: "Dine at one of the world's most iconic locations, perched on a rock amidst the Indian Ocean tides." },
  { id: "nakupenda-beach", title: "Nakupenda Beach", duration: "Full Day", price: 340, image: "/images/nakupenda-beach.jpg", desc: "Escape to a pristine sandbank paradise that appears only at low tide. Includes a fresh seafood barbecue." },
  { id: "dhow-cruise", title: "Sunset Dhow Cruise", duration: "Evening", price: 200, image: "/images/sunset-dhow-cruise.jpg", desc: "Sail the Indian Ocean on a traditional wooden dhow while the sky transforms into brilliant colors." },
];

export default function ZanzibarPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchCartState() {
      const currentItineraryId = typeof window !== 'undefined' ? localStorage.getItem('active_itinerary_id') : null;
      if (!currentItineraryId) return;

      const { data, error } = await supabase
        .from("itinerary_items")
        .select("service_id")
        .eq("itinerary_id", currentItineraryId);

      if (!error && data) {
        const map: Record<string, boolean> = {};
        data.forEach((item) => {
          if (item.service_id) map[item.service_id] = true;
        });
        setAddedItems(map);
      }
    }
    fetchCartState();
  }, [supabase]);

  const addToItinerary = async (tour: typeof tours[0]) => {
    setLoadingId(tour.id);
    let currentItineraryId = typeof window !== 'undefined' ? localStorage.getItem('active_itinerary_id') : null;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!currentItineraryId || currentItineraryId.startsWith("ITIN-") || currentItineraryId.startsWith("EV-")) {
        currentItineraryId = crypto.randomUUID();
        localStorage.setItem('active_itinerary_id', currentItineraryId);
        
        const { error: itinError } = await supabase
          .from("itineraries")
          .insert([{ 
            id: currentItineraryId, 
            user_id: user ? user.id : null, 
            title: "Custom Zanzibar Itinerary",
            status: 'draft' 
          }]);

        if (itinError) {
          console.error("Itinerary parent row creation error:", JSON.stringify(itinError, null, 2));
          throw new Error(itinError.message || "Failed to initialize itinerary session");
        }
      } else {
        const { data: existingItin } = await supabase
          .from("itineraries")
          .select("id")
          .eq("id", currentItineraryId)
          .maybeSingle();

        if (!existingItin) {
          const { error: itinError } = await supabase
            .from("itineraries")
            .insert([{ 
              id: currentItineraryId, 
              user_id: user ? user.id : null, 
              title: "Custom Zanzibar Itinerary",
              status: 'draft' 
            }]);

          if (itinError) {
            console.error("Itinerary parent row recreation error:", JSON.stringify(itinError, null, 2));
            throw new Error(itinError.message || "Failed to initialize itinerary session");
          }
        }
      }

      // Check if an itinerary day exists for this itinerary, or create a default day to satisfy day_id foreign key
      let { data: daysData, error: daysError } = await supabase
        .from("itinerary_days")
        .select("id")
        .eq("itinerary_id", currentItineraryId)
        .order("day_number", { ascending: true })
        .limit(1);

      let targetDayId: string;

      if (daysError || !daysData || daysData.length === 0) {
        const newDayId = crypto.randomUUID();
        const { error: createDayError } = await supabase
          .from("itinerary_days")
          .insert([{ 
            id: newDayId, 
            itinerary_id: currentItineraryId, 
            day_number: 1, 
            title: "Day 1: Zanzibar Exploration" 
          }]);

        if (createDayError) {
          console.error("Itinerary day creation error:", JSON.stringify(createDayError, null, 2));
          throw new Error(createDayError.message || "Failed to initialize itinerary day");
        }
        targetDayId = newDayId;
      } else {
        targetDayId = daysData[0].id;
      }

      const { error } = await supabase
        .from("itinerary_items")
        .insert([{ 
          itinerary_id: currentItineraryId, 
          day_id: targetDayId,
          type: "tour", 
          service_id: tour.id, 
          price: tour.price 
        }]);

      if (error) {
        console.error("Itinerary item insert error:", JSON.stringify(error, null, 2));
        throw new Error(error.message || "Failed to insert itinerary item");
      }

      setAddedItems((prev) => ({ ...prev, [tour.id]: true }));
      toast({ 
        title: "Added to Itinerary Cart", 
        description: `${tour.title} is ready in your active builder session.` 
      });
      window.dispatchEvent(new Event("itinerary_updated"));
    } catch (err: any) {
      console.error("Full Itinerary addition error object:", err);
      toast({ 
        title: "Action Failed", 
        description: err?.message || "Could not add tour to your cart. Please check console.", 
        variant: "destructive" 
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white">
      <main>
        {/* Hero Section */}
        <section className="relative h-[65vh] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-50 z-10" />
          <div className="absolute inset-0 bg-[url('/images/zanzibar-hero.jpg')] bg-cover bg-center scale-105 animate-fade-in" />
          <div className="text-center px-4 z-20 space-y-4 max-w-4xl mx-auto mt-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-blue-300 font-semibold text-xs tracking-widest uppercase border border-white/15">
              <Sparkles size={14} /> Island Paradise Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-sm">Zanzibar Experiences</h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
              Curated spice tours, pristine sandbanks, and historic Indian Ocean excursions built right into your custom itinerary.
            </p>
          </div>
        </section>

        {/* Tours Grid */}
        <section className="py-20 px-4 max-w-7xl mx-auto -mt-10 relative z-25">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour, i) => {
              const isAdded = addedItems[tour.id];
              const isLoading = loadingId === tour.id;

              return (
                <div key={i} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-6 group">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full font-black text-slate-900 shadow-md text-sm">
                      ${tour.price}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-600 mb-2 font-bold text-xs tracking-wider uppercase">
                    <Clock size={14} /> {tour.duration}
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{tour.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-grow">{tour.desc}</p>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    <Button 
                      onClick={() => addToItinerary(tour)} 
                      disabled={isLoading}
                      className={`w-full rounded-full h-13 font-bold transition-all shadow-lg ${
                        isAdded 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">Adding to Cart...</span>
                      ) : isAdded ? (
                        <span className="flex items-center gap-2"><Check size={18} /> Added to Itinerary Cart</span>
                      ) : (
                        "Add to Itinerary Cart"
                      )}
                    </Button>
                    
                    <Button asChild variant="ghost" className="w-full rounded-full h-12 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold">
                      <Link href="/contact" className="flex items-center gap-2">
                        <MessageCircle size={18} /> Speak to an Expert
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <WhatsAppFloat />
    </div>
  );
}