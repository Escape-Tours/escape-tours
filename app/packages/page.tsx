"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Mountain, Binoculars, Palmtree, Clock, MapPin, ShieldCheck, Hotel, Sparkles } from "lucide-react";
import { EXTENDED_SAFARI_PACKAGES, SafariPackage } from "@/lib/constants/itineraries";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  {
    title: "Safari Adventures",
    desc: "Experience the wild heart of Tanzania. From the Great Migration to remote southern reserves.",
    icon: <Binoculars size={32} />,
    href: "/safaris",
    color: "bg-orange-600",
    circuitFilter: ['NORTHERN', 'SOUTHERN']
  },
  {
    title: "Mountain Trekking",
    desc: "Conquer the Roof of Africa. Expert-led expeditions up Kilimanjaro and Mount Meru.",
    icon: <Mountain size={32} />,
    href: "/trekking",
    color: "bg-emerald-600",
    circuitFilter: []
  },
  {
    title: "Zanzibar Escapes",
    desc: "Unwind on pristine white sands. Spice tours, historic Stone Town, and turquoise waters.",
    icon: <Palmtree size={32} />,
    href: "/zanzibar",
    color: "bg-blue-600",
    circuitFilter: ['ZANZIBAR']
  }
];

export default function PackagesPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);
  const [selectedTier, setSelectedTier] = useState<'INTERNATIONAL' | 'RESIDENT' | 'CITIZEN'>('INTERNATIONAL');

  const handleBookNow = (pkg: SafariPackage) => {
    const cost = pkg.pricing[selectedTier].grandTotal;
    router.push(`/checkout?source=package&bookingId=${pkg.id.toUpperCase()}&amount=${cost}&tier=${selectedTier}`);
  };

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

        {/* Featured Itineraries Showcase Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div>
              <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Featured Itineraries</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Explore Circuit Collections</h2>
              <p className="text-slate-600 mt-2 text-sm">
                Ready-to-book multi-day expeditions crafted for ultimate wildlife and coastal immersion with full accommodation and logistics factoring.
              </p>
            </div>

            {/* Prominent Residency Tier Selector Card */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-slate-900 p-2 rounded-[2rem] shadow-xl border border-slate-800">
              <div className="flex items-center gap-2 px-4 py-1 text-xs font-bold text-amber-400">
                <Sparkles size={14} />
                <span>Select Pricing Tier:</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-[1.5rem]">
                {(['INTERNATIONAL', 'RESIDENT', 'CITIZEN'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      selectedTier === tier 
                        ? 'bg-amber-500 text-slate-950 shadow-lg scale-105' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXTENDED_SAFARI_PACKAGES.map((pkg: SafariPackage) => {
              const pricing = pkg.pricing[selectedTier];
              return (
                <div 
                  key={pkg.id}
                  className="bg-white border border-slate-200 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {pkg.circuit} Circuit
                      </span>
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                        <Clock size={14} className="text-amber-600" />
                        <span>{pkg.duration_days} Days</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {pkg.tagline}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-amber-600 shrink-0" />
                        <span className="truncate">Starts: {pkg.starting_hub}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel size={14} className="text-amber-600 shrink-0" />
                        <span className="truncate font-medium text-slate-900">{pkg.lodging_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">From ({selectedTier})</span>
                      <span className="text-lg font-black text-slate-900">
                        ${pricing.grandTotal.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/safaris/${pkg.id}`}
                        className="text-xs text-amber-600 hover:text-amber-700 font-bold underline underline-offset-2 cursor-pointer"
                      >
                        Slug Page
                      </Link>
                      <Button 
                        onClick={() => handleBookNow(pkg)}
                        className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider h-10 px-4 cursor-pointer shadow-md"
                      >
                        <ShieldCheck className="mr-1" size={14} /> PesaPal Pay
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Itinerary Details Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  {selectedPackage.circuit} Circuit • {selectedPackage.duration_days} Days
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">{selectedPackage.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackage(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Day-by-Day Expedition Schedule</h4>
                {selectedPackage.days.map((day) => (
                  <div key={day.day_number} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Day {day.day_number}: {day.title}</span>
                      {day.accommodation && (
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                          {day.accommodation}
                        </span>
                      )}
                    </div>
                    {day.bullets ? (
                      <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                        {day.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-1 text-xs text-slate-600">
                        {day.morning && <p><strong className="text-slate-900">Morning:</strong> {day.morning}</p>}
                        {day.afternoon && <p><strong className="text-slate-900">Afternoon:</strong> {day.afternoon}</p>}
                        {day.evening && <p><strong className="text-slate-900">Evening:</strong> {day.evening}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Comprehensive Cost Breakdown */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-3 shadow-xl">
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">Cost Breakdown ({selectedTier})</h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Accommodation & Full Board</span>
                    <span className="font-bold text-white">${selectedPackage.pricing[selectedTier].accommodationTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4x4 Safari Cruiser & Driver Guide</span>
                    <span className="font-bold text-white">${selectedPackage.pricing[selectedTier].transportTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Park Conservation & Concession Fees</span>
                    <span className="font-bold text-white">${selectedPackage.pricing[selectedTier].parkFeesTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guided Activities & Boat Safaris</span>
                    <span className="font-bold text-white">${selectedPackage.pricing[selectedTier].activitiesTotal}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">${selectedPackage.pricing[selectedTier].subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tanzania Tourism VAT (18%)</span>
                    <span>+${selectedPackage.pricing[selectedTier].vat}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Agency Coordination & Service Fee</span>
                    <span>+${selectedPackage.pricing[selectedTier].agencyFee}</span>
                  </div>
                  <div className="pt-3 border-t border-amber-500/40 flex justify-between items-center text-amber-400">
                    <span className="font-black uppercase tracking-wider text-xs">Estimated Grand Total</span>
                    <span className="text-xl font-black">${selectedPackage.pricing[selectedTier].grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <Button asChild variant="outline" className="w-1/2 rounded-2xl h-12 text-xs font-bold uppercase tracking-wider">
                <Link href={`/safaris/${selectedPackage.id}`}>View Slug Page</Link>
              </Button>
              <Button 
                onClick={() => {
                  const pkg = selectedPackage;
                  setSelectedPackage(null);
                  handleBookNow(pkg);
                }}
                className="w-1/2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest h-12 shadow-lg cursor-pointer"
              >
                <ShieldCheck className="mr-1" size={14} /> PesaPal Pay
              </Button>
            </div>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
}