"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

const destinations = [
  {
    title: "Serengeti National Park",
    image: "/images/serengeti.jpg",
    description: "Home to the spectacular Great Migration where 2 million wildebeest traverse endless plains. Experience the most iconic African wilderness with predator-prey interactions and vast savannas.",
    highlights: ["The Great Migration", "Big Five Safaris", "Vast Savannas"],
  },
  {
    title: "Ngorongoro Crater",
    image: "/images/ngorongoro.jpg",
    description: "The world's largest inactive volcanic caldera. Often called 'Africa's Eden,' the crater floor provides the highest concentration of wildlife anywhere on Earth.",
    highlights: ["Africa's Eden", "Unique Ecosystem", "Guaranteed Sightings"],
  },
  {
    title: "Lake Manyara National Park",
    image: "/images/manyara.jpg",
    description: "Renowned for unique tree-climbing lions and massive flocks of pink flamingos. A photographer's paradise featuring groundwater forests and alkaline lake landscapes.",
    highlights: ["Tree-Climbing Lions", "Pink Flamingos", "Bird Watching"],
  },
  {
    title: "Tarangire National Park",
    image: "/images/tarangire.jpg",
    description: "Famous for massive elephant herds and ancient baobab trees. During the dry season, the Tarangire River becomes a magnet for incredible wildlife concentrations.",
    highlights: ["Massive Elephant Herds", "Ancient Baobabs", "Intimate Experience"],
  },
  {
    title: "Arusha National Park",
    image: "/images/arusha-national-park.jpg",
    description: "Dominated by the majestic Mount Meru. Offers unique walking safaris, canoeing adventures, and diverse habitats including montane forests and crater lakes.",
    highlights: ["Walking Safaris", "Mount Meru Views", "Canoeing Adventures"],
  },
];

export default function NorthernCircuitPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900" />
          <div className="text-center px-4 z-10 space-y-4">
            <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-sm">Tanzania Safari</span>
            <h1 className="text-5xl md:text-7xl font-black text-white">Northern Circuit</h1>
            <p className="text-xl text-slate-300 max-w-xl mx-auto">Tanzania's Wildlife Crown Jewels</p>
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
                        <CheckCircle2 className="text-orange-600" size={20} /> {h}
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
            <h2 className="text-4xl md:text-5xl font-black">Ready for the Adventure?</h2>
            <p className="text-xl text-slate-400">Experience the world's most spectacular wildlife circuit with Escape Tours experts.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-orange-600 hover:bg-orange-700 h-14 px-10 rounded-full text-lg font-bold">
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