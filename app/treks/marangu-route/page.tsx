"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Mountain, CheckCircle2 } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";
import { Button } from "@/components/ui/button";

const itinerary = [
  { day: 1, title: "Arrival", desc: "Transfer to Moshi hotel for briefing." },
  { day: 2, title: "Rain Forest", desc: "Moshi to Mandara Hut (2,700m)." },
  { day: 3, title: "Moorland Zone", desc: "Mandara to Horombo Hut (3,720m)." },
  { day: 4, title: "Acclimatization", desc: "Excursion to Mawenzi Peak." },
  { day: 5, title: "Alpine Desert", desc: "Horombo to Kibo Hut (4,700m)." },
  { day: 6, title: "Summit Day", desc: "Uhuru Peak (5,895m) & descent." },
  { day: 7, title: "Departure", desc: "Return to Moshi via Park Gate." }
];

export default function MaranguRoutePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <section className="relative h-[60vh] flex items-end">
        <Image src="/images/kilimanjaro-hero.jpg" alt="Kilimanjaro" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto p-8 text-white">
          <h1 className="text-5xl font-black">MARANGU ROUTE</h1>
          <p className="flex items-center gap-2 text-amber-400 mt-2"><MapPin size={18} /> 6-Day Acclimatization Special</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Itinerary Breakdown</h2>
        <div className="space-y-4">
          {itinerary.map((step) => (
            <div key={step.day} className="flex gap-4 p-4 border rounded-2xl hover:border-amber-500 transition-colors">
              <div className="font-black text-amber-600">Day {step.day}</div>
              <div>
                <h4 className="font-bold">{step.title}</h4>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-slate-950 text-white rounded-3xl flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Book Your Trek</h3>
            <p className="text-slate-400">Group Price: $1,190 | Solo: $1,490</p>
          </div>
          <Button onClick={() => setIsBookingOpen(true)} className="rounded-full bg-amber-600 hover:bg-amber-700">
            Secure Your Spot <ChevronRight />
          </Button>
        </div>
      </main>

      <BookingModal
        bookingType="trek"
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Marangu Route 6-Day Trek"
        roomCategories={["Group Trek", "Solo Trek"]}
        roomPrices={{"Group Trek": 1190, "Solo Trek": 1490}}
      />
    </div>
  );
}