"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

const destinations = [
  {
    title: "Ruaha National Park",
    image: "/images/ruaha.jpg",
    description: "Tanzania's largest national park, remote and wild. Famous for massive elephant herds and exceptional predator sightings in a rugged, untouched landscape.",
    highlights: ["Tanzania's Largest Park", "Pristine Wilderness", "Big Cat Sightings"],
  },
  {
    title: "Nyerere National Park (Selous)",
    image: "/images/nyerere.jpg",
    description: "A UNESCO World Heritage site and one of Africa's largest protected areas. Experience unique boat safaris on the Rufiji River and true off-the-beaten-path exploration.",
    highlights: ["Boat & Walking Safaris", "UNESCO Heritage Site", "Rufiji River Network"],
  },
  {
    title: "Saadani National Park",
    image: "/images/saadani-national-park.jpg",
    description: "The only wildlife sanctuary in Tanzania bordering the sea. Where the African bush meets the Indian Ocean coastline for a truly unique dual-experience.",
    highlights: ["Bush Meets Beach", "Elephants on the Coast", "Wami River Safaris"],
  },
  {
    title: "Mikumi National Park",
    image: "/images/mikumi.jpg",
    description: "Reliable, accessible, and stunning. Mikumi offers abundant plains game against a beautiful backdrop of mountain peaks, acting as the gateway to the southern wild.",
    highlights: ["Excellent Accessibility", "Abundant Plains Game", "Dramatic Landscapes"],
  },
  {
    title: "Udzungwa Mountains",
    image: "/images/udzungwa-southern.jpg",
    description: "A biodiversity hotspot and a hiker's paradise. Home to endemic primate species and the spectacular 170-meter Sanje Falls hidden within ancient montane forests.",
    highlights: ["Biodiversity Hotspot", "Hiking & Waterfalls", "Endemic Primate Species"],
  },
];

export default function SouthernCircuitPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900" />
          <div className="text-center px-4 z-10 space-y-4">
            <span className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-sm">Untamed Wilderness</span>
            <h1 className="text-5xl md:text-7xl font-black text-white">Southern Circuit</h1>
            <p className="text-xl text-slate-300 max-w-xl mx-auto">Tanzania's Wild and Remote Frontiers</p>
          </div>
        </section>

        {/* Destination Grid */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="space-y-24">
            {destinations.map((dest, i) => (
              <div key={i} className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
                  <Image src={dest.image} alt={dest.title} fill className="object-cover" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-slate-900">{dest.title}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{dest.description}</p>
                  <ul className="space-y-3">
                    {dest.highlights.map((h, j) => (
                      <li key={j} className="flex items-center gap-3 text-slate-800 font-medium">
                        <CheckCircle2 className="text-emerald-600" size={20} /> {h}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 rounded-full mt-4">
                    <Link href="/packages">View Packages <ArrowRight className="ml-2" size={16}/></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Escape+ CTA */}
        <section className="py-24 bg-slate-900 text-white text-center px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black">Ready to go off the map?</h2>
            <p className="text-xl text-slate-400">Explore the remote beauty of Southern Tanzania with Escape Tours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 h-14 px-10 rounded-full text-lg font-bold">
                <Link href="/packages">View All Packages</Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-10 rounded-full text-lg font-bold border-slate-700 bg-transparent hover:bg-slate-800">
                <Link href="/contact">Speak to an Expert</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppFloat />
    </div>
  );
}