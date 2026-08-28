"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Mountain, Binoculars, Palmtree } from "lucide-react";

const categories = [
  {
    title: "Safari Adventures",
    desc: "Experience the wild heart of Tanzania. From the Great Migration to remote southern reserves.",
    icon: <Binoculars size={32} />,
    href: "/northern-circuit", // Or a dedicated safari-hub page
    color: "bg-orange-600"
  },
  {
    title: "Mountain Trekking",
    desc: "Conquer the Roof of Africa. Expert-led expeditions up Kilimanjaro and Mount Meru.",
    icon: <Mountain size={32} />,
    href: "/trekking",
    color: "bg-emerald-600"
  },
  {
    title: "Zanzibar Escapes",
    desc: "Unwind on pristine white sands. Spice tours, historic Stone Town, and turquoise waters.",
    icon: <Palmtree size={32} />,
    href: "/zanzibar",
    color: "bg-blue-600"
  }
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section */}
        <section className="relative py-32 bg-slate-900 text-center px-4 overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Curated Experiences</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">Our Packages</h1>
            <p className="text-xl text-slate-300">
              Your gateway to Tanzania's most iconic landscapes and cultures.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
                <div className={`${cat.color} text-white p-6 rounded-[1.5rem] mb-6`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{cat.title}</h3>
                <p className="text-slate-600 mb-8 flex-grow">{cat.desc}</p>
                <Button asChild className="w-full rounded-full h-12 bg-slate-900 hover:bg-slate-800">
                  <Link href={cat.href}>View Collection <ArrowRight className="ml-2" size={16} /></Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <WhatsAppFloat />
    </div>
  );
}