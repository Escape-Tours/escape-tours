"use client";

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, ShieldCheck, Hotel, Sparkles, Binoculars } from "lucide-react";
import { EXTENDED_SAFARI_PACKAGES, SafariPackage } from "@/lib/constants/itineraries";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SafarisHubPage() {
  const router = useRouter();
  const [selectedCircuit, setSelectedCircuit] = useState<'ALL' | 'NORTHERN' | 'SOUTHERN'>('ALL');
  const [selectedTier, setSelectedTier] = useState<'INTERNATIONAL' | 'RESIDENT' | 'CITIZEN'>('INTERNATIONAL');

  const filteredPackages = EXTENDED_SAFARI_PACKAGES.filter(pkg => {
    if (pkg.circuit === 'ZANZIBAR') return false;
    if (selectedCircuit === 'ALL') return true;
    return pkg.circuit === selectedCircuit;
  });

  const handleBookNow = (pkg: SafariPackage) => {
    const cost = pkg.pricing[selectedTier].grandTotal;
    router.push(`/checkout?source=package&bookingId=${pkg.id.toUpperCase()}&amount=${cost}&tier=${selectedTier}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section */}
        <section className="relative py-32 bg-slate-900 text-center px-4 overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-sm block">Wilderness Expeditions</span>
            <h1 className="text-5xl md:text-7xl font-black text-white">Northern & Southern Circuits</h1>
            <p className="text-xl text-slate-300">
              Explore Tanzania’s premier wildlife sanctuaries, from the great savanna migrations to remote southern river reserves.
            </p>
          </div>
        </section>

        {/* Filter & Tier Bar */}
        <section className="py-12 px-4 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
            {/* Circuit Selector Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto justify-center">
              {(['ALL', 'NORTHERN', 'SOUTHERN'] as const).map(circuit => (
                <button
                  key={circuit}
                  onClick={() => setSelectedCircuit(circuit)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                    selectedCircuit === circuit ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {circuit} Circuit
                </button>
              ))}
            </div>

            {/* Residency Tier Selector */}
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl text-white">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-bold mr-1">Tier:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl">
                {(['INTERNATIONAL', 'RESIDENT', 'CITIZEN'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider transition cursor-pointer ${
                      selectedTier === tier ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg: SafariPackage) => {
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
                        Details
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
      <WhatsAppFloat />
    </div>
  );
}