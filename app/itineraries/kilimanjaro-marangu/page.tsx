"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Calendar, DollarSign, Mountain, CheckCircle2, Flame, MapPin } from "lucide-react";
import ItineraryMapOverlay from "@/components/itinerary/ItineraryMapOverlay";

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours";

// Real coordinates for the Marangu Route
const ITINERARY_LOCATIONS = [
  { id: '1', name: 'Marangu Gate', latitude: -3.2750, longitude: 37.5180 },
  { id: '2', name: 'Mandara Hut', latitude: -3.1550, longitude: 37.4720 },
  { id: '3', name: 'Horombo Hut', latitude: -3.1110, longitude: 37.4350 },
  { id: '4', name: 'Kibo Hut', latitude: -3.0780, longitude: 37.3680 },
  { id: '5', name: 'Uhuru Peak', latitude: -3.0674, longitude: 37.3556 },
];

export default function KilimanjaroMaranguPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section: Escape+ Visual Polish */}
        <section className="relative h-[80vh] w-full overflow-hidden">
          <Image
            src="/images/marangu.jpg"
            alt="Kilimanjaro Marangu Route"
            fill
            className="object-cover scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <Badge className="mb-6 bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 text-sm font-bold uppercase tracking-widest">
              The Classic Route
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6">Kilimanjaro<br />Marangu Trek</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light">
              Experience the "Coca-Cola" route with comfortable hut accommodations and iconic vistas.
            </p>
          </div>
        </section>

        {/* Premium Quick Info Bar */}
        <section className="bg-white border-b border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, label: "Duration", val: "8 Days" },
              { icon: MapPin, label: "Route", val: "Marangu" },
              { icon: Mountain, label: "Summit", val: "5,895m" },
              { icon: DollarSign, label: "From", val: "$2,986" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl text-orange-600">
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Route Map Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">Climb the Path</h2>
          <ItineraryMapOverlay locations={ITINERARY_LOCATIONS} />
        </section>

        {/* Itinerary Section: Full Detail, Premium Styling */}
<section className="py-20 bg-slate-50">
  <div className="max-w-4xl mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black text-slate-900 mb-4">Day by Day Itinerary</h2>
      <p className="text-lg text-slate-600">Your complete journey to the Roof of Africa.</p>
    </div>

    <div className="space-y-4">
      {[
        { d: "1", t: "Arrival", sub: "Arusha/Moshi | Hotel/Lodge", desc: "Transfer from JRO/Arusha airport. Equipment check and trek briefing." },
        { d: "2", t: "Marangu Gate to Mandara Hut", sub: "2,700m | Full Board", desc: "Ascent through lush rainforest. Stay in comfortable communal huts." },
        { d: "3", t: "Mandara Hut to Horombo Hut", sub: "3,720m | Full Board", desc: "Ascend into heath and moorland. Spot exotic giant lobelias." },
        { d: "4", t: "Acclimatization Day", sub: "3,720m | Full Board", desc: "Guided hike to Mawenzi Hut for acclimatization. Sleep high, climb low." },
        { d: "5", t: "Horombo Hut to Kibo Hut", sub: "4,700m | Full Board", desc: "Traverse the alpine desert. Early dinner before your midnight summit attempt." },
        { d: "6", t: "Summit Day to Horombo", sub: "5,895m | Full Board", desc: "Midnight climb to Uhuru Peak. Descend back to Horombo for a well-earned rest." },
        { d: "7", t: "Descent to Gate", sub: "1,980m | Full Board", desc: "Descend to Marangu Gate. Receive your summit certificate and transfer to your hotel." },
        { d: "8", t: "Departure", sub: "Breakfast", desc: "Transfer to airport or onward journey." }
      ].map((day) => (
        <div key={day.d} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center p-6 border-b border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-xl mr-6">
              {day.d}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{day.t}</h3>
              <p className="text-sm font-semibold text-orange-600">{day.sub}</p>
            </div>
          </div>
          <div className="px-6 py-4 text-slate-600">
            {day.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* High-Conversion Footer CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 bg-orange-600 rounded-[2rem] p-12 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="flex-1 space-y-4">
              <h3 className="text-4xl font-black">Your Summit Awaits</h3>
              <p className="text-lg text-white/90">Join the elite few who have stood at the Roof of Africa with Escape Tours.</p>
            </div>
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-slate-100 px-10 text-lg font-bold">
              <a href={PESAPAL_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book This Trek</a>
            </Button>
          </div>
        </section>
      </main>
      <WhatsAppFloat />
    </div>
  );
}