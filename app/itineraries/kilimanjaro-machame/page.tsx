"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Mountain, CheckCircle2, ShieldCheck, Flame } from "lucide-react";
import ItineraryMapOverlay from "@/components/itinerary/ItineraryMapOverlay";

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours";

// Replace with coordinates for your specific Machame route points
const ITINERARY_LOCATIONS = [
  { id: '1', name: 'Machame Gate', latitude: -3.2351, longitude: 37.2564 },
  { id: '2', name: 'Shira Camp', latitude: -3.0764, longitude: 37.3364 },
  { id: '3', name: 'Barranco Camp', latitude: -3.0900, longitude: 37.3550 },
  { id: '4', name: 'Barafu Camp', latitude: -3.0750, longitude: 37.3700 },
  { id: '5', name: 'Uhuru Peak', latitude: -3.0674, longitude: 37.3556 },
];

export default function KilimanjaroMachamePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section - Refined Typography & Layout */}
        <section className="relative h-[80vh] w-full overflow-hidden">
          <Image
            src="/images/machame.jpg"
            alt="Kilimanjaro Machame Route"
            fill
            className="object-cover scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="mb-4 inline-flex items-center gap-2 text-orange-500 font-bold tracking-[0.2em] uppercase text-sm">
              <Flame size={16} /> The Whiskey Route
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6">Mount Kilimanjaro<br />Machame Trek</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light">
              9 days of unparalleled scenic beauty, acclimatization, and personal achievement.
            </p>
          </div>
        </section>

        {/* Premium Info Bar */}
        <section className="bg-white border-b border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, label: "Duration", val: "9 Days" },
              { icon: MapPin, label: "Route", val: "Machame" },
              { icon: Mountain, label: "Summit", val: "5,895m" },
              { icon: Flame, label: "Difficulty", val: "Challenging" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl text-orange-600">
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-2">Route Overview</h2>
          <p className="text-slate-600 mb-8">Follow the path to the Roof of Africa.</p>
          <ItineraryMapOverlay locations={ITINERARY_LOCATIONS} />
        </section>

        {/* Itinerary Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black mb-12 text-center">The Ascent Strategy</h2>
            <div className="space-y-4">
              {/* Add your day-by-day components here with improved visual styling */}
            </div>
          </div>
        </section>

        {/* Conversion Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-center bg-orange-600 p-12 rounded-[2rem] text-white">
            <div className="flex-1 space-y-4">
              <h3 className="text-4xl font-black">Ready to Conquer the Peak?</h3>
              <p className="text-lg text-white/90">Our expert team handles the logistics so you can focus on the climb.</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="text-center text-4xl font-black">$2,986</div>
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-slate-100 px-10 text-lg font-bold">
                <a href={PESAPAL_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Now</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppFloat />
    </div>
  );
}