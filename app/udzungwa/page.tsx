"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Mountain, Droplets, MapPin, Compass, Info } from "lucide-react";
import Image from "next/image";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking-modal";

const trekOptions = {
  "Half Day Trek": 60,
  "Full Day Trek": 120,
  "Multi-Day Camping": 350
};

export default function UdzungwaPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Immersive Hero */}
      <section className="relative h-[70vh] flex items-end">
        <Image src="/images/udzungwa-waterfall.jpg" alt="Udzungwa Waterfall" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto p-8 w-full text-white">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-black">UDZUNGWA MOUNTAINS</motion.h1>
          <p className="flex items-center gap-2 text-green-400 mt-2 text-lg"><MapPin size={18} /> The Galapagos of Africa</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* 2. Descriptive Content */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-gray-900">A Hiker's Paradise</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Udzungwa is a lush, pristine sanctuary. Unlike typical safari parks, this is a trekker's dream. 
              Home to endemic primates found nowhere else on Earth, the park offers a rare glimpse into 
              prehistoric rainforests and spectacular 170-meter cascades.
            </p>
            <div className="flex gap-4">
              <div className="p-4 bg-green-50 rounded-2xl flex items-center gap-3"><Mountain className="text-green-700" /> <span className="font-bold">Endemic Wildlife</span></div>
              <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-3"><Droplets className="text-blue-700" /> <span className="font-bold">Natural Pools</span></div>
            </div>
          </div>
          
          {/* Fun Facts Box */}
          <div className="bg-gray-900 text-white p-8 rounded-3xl">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><Info className="text-orange-500" /> Did You Know?</h3>
            <ul className="space-y-4 text-gray-300">
              <li>• Udzungwa is known as the "Galapagos of Africa" due to its high level of biodiversity.</li>
              <li>• The park protects 30-40% of all plant species found in Tanzania.</li>
              <li>• It was officially opened by Prince Bernhard of the Netherlands in 1992.</li>
            </ul>
          </div>
        </section>

        {/* 3. Inclusions Section */}
        <section className="grid md:grid-cols-2 gap-12 bg-gray-50 p-10 rounded-3xl">
          <div>
            <h4 className="text-2xl font-bold mb-6 flex items-center gap-2"><Check className="text-green-600" /> What's Included</h4>
            <ul className="space-y-3 text-gray-700">
              <li>✓ Professional English-speaking guide</li>
              <li>✓ Park entrance and conservation fees</li>
              <li>✓ Bottled water and picnic lunch</li>
              <li>✓ Guided forest & waterfall trekking</li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-6 flex items-center gap-2"><X className="text-red-500" /> What's Excluded</h4>
            <ul className="space-y-3 text-gray-700">
              <li>× Personal trekking gear/boots</li>
              <li>× International/Domestic flights</li>
              <li>× Gratuities for guides/porters</li>
              <li>× Travel insurance</li>
            </ul>
          </div>
        </section>

        {/* 4. Booking CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl font-black">Ready for your breakthrough?</h2>
          <Button size="lg" onClick={() => setIsBookingOpen(true)} className="rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-10 py-8 text-xl">
            Book Your Udzungwa Expedition
          </Button>
        </section>
      </main>

      <BookingModal
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Udzungwa Mountains Expedition"
        roomCategories={Object.keys(trekOptions)}
        roomPrices={trekOptions}
      />
      
      <WhatsAppFloat />
    </div>
  );
}