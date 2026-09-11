"use client";

import Image from "next/image";
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, CheckCircle2, ShieldCheck, Camera } from "lucide-react";
import { useState } from "react";
// Import the map overlay you created
import ItineraryMapOverlay from "@/components/itinerary/ItineraryMapOverlay";

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours";

// Example locations - replace with your actual itinerary data
const ITINERARY_LOCATIONS = [
  { id: '1', name: 'Ngorongoro Crater', latitude: -3.2351, longitude: 35.5804 },
  { id: '2', name: 'Serengeti', latitude: -2.3333, longitude: 34.8333 },
  { id: '3', name: 'Lake Manyara', latitude: -3.5670, longitude: 35.8330 },
];

export default function EastAfricanResidentsPage() {
  const handleBookNow = () => window.open(PESAPAL_BOOKING_URL, "_blank");

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section - Elevated to "Top Tier" with better readability */}
        <section className="relative h-[70vh] w-full">
          <Image
            src="/images/itineraries/ear-package.jpg"
            alt="East African Residents Safari"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl space-y-6">
              <span className="inline-block py-1 px-3 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                Exclusively for Residents
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Northern Circuit <br />Discovery
              </h1>
              <p className="text-xl md:text-2xl text-white/90">Ngorongoro, Serengeti & Manyara</p>
            </div>
          </div>
        </section>

        {/* Quick Stats Banner */}
        <section className="bg-white py-8 shadow-sm border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-8 justify-center">
            {[
              { icon: Calendar, label: "5 Days" },
              { icon: MapPin, label: "Northern Circuit" },
              { icon: Users, label: "Family Friendly" },
              { icon: Camera, label: "Professional Guide" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-600 font-semibold">
                <stat.icon className="text-orange-600" /> {stat.label}
              </div>
            ))}
          </div>
        </section>

        {/* Map Section - Integrated with your new ItineraryMapOverlay */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Your Route Map</h2>
          <ItineraryMapOverlay locations={ITINERARY_LOCATIONS} />
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-slate-900">Why Book With Escape?</h2>
              <ul className="space-y-4">
                {[
                  "Guaranteed best rates for East African residents",
                  "Expert-led game drives with 4x4 Land Cruisers",
                  "Hand-picked luxury lodge accommodations",
                  "Seamless planning & on-ground support"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-orange-600 shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
              <p className="text-sm font-bold uppercase tracking-wider text-orange-500">Package Starting From</p>
              <div className="text-5xl font-black">$2,500 <span className="text-xl font-normal text-slate-400">/ person</span></div>
              <Button onClick={handleBookNow} size="lg" className="w-full bg-orange-600 hover:bg-orange-700">
                Secure Your Spot
              </Button>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppFloat />
    </div>
  );
}