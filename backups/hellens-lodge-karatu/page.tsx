"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, Calendar, Users, Sparkles } from "lucide-react";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import { BookingModal } from "@/components/booking-modal";

export default function HellensLodgePage() {
    const [nights, setNights] = useState(1);
    const [guests, setGuests] = useState(2);
    const [activeTier, setActiveTier] = useState<"INTERNATIONAL" | "RESIDENT" | "CITIZEN">("INTERNATIONAL");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic pricing based on tier selection
    const tierMultipliers = {
        INTERNATIONAL: 180,
        RESIDENT: 120,
        CITIZEN: 75
    };
    const pricePerNight = tierMultipliers[activeTier];
    const totalPrice = nights * guests * pricePerNight;

    const today = new Date().toISOString().split('T')[0];

    // Mock hotel object structure required for the BookingModal & PesaPal checkout
    const lodgeData = {
        id: "hellens-lodge-karatu",
        name: "Hellen's Lodge Karatu",
        location: "Karatu, Tanzania",
        room_prices: {
            "Standard Room": {
                low: { INTERNATIONAL: 180, RESIDENT: 120, CITIZEN: 75 }
            }
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
            {/* Hero Section */}
            <section className="relative h-[55vh] flex items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-slate-950">
                    <div className="w-full h-full opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>
                
                <div className="relative max-w-7xl mx-auto p-8 md:p-12 w-full z-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-wider uppercase mb-4">
                        <Sparkles size={14} /> Sanctuary Details
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight text-white">Hellen's Lodge Karatu</h1>
                    <p className="flex items-center gap-2 text-amber-400 text-base font-medium">
                        <MapPin size={18} /> Karatu, Tanzania
                    </p>
                </div>
            </section>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Left & Middle: Overview & Description */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
                            <h2 className="text-2xl font-black text-white">Experience Tranquility</h2>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base font-light">
                                Nestled in the highlands of Karatu, Hellen's Lodge serves as the gateway to the Ngorongoro Crater and Lake Manyara. Designed for explorers seeking absolute comfort, modern amenities, and authentic Tanzanian hospitality.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    <ShieldCheck size={18} className="text-emerald-400" /> Verified Stay
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    <Calendar size={18} className="text-amber-400" /> Free Cancellation
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Calculator & PesaPal Quick Booking Card */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 sticky top-28">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <h3 className="text-lg font-black text-white">Stay Calculator</h3>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Live Rates
                                </span>
                            </div>

                            {/* Residency Tier Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing Tier</label>
                                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                                    {(["INTERNATIONAL", "RESIDENT", "CITIZEN"] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setActiveTier(t)}
                                            className={`py-2 rounded-lg text-[9px] font-black tracking-wider transition-all uppercase ${
                                                activeTier === t ? "bg-amber-500 text-slate-950 shadow-lg" : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            {t.slice(0, 4)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs Grid */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Check-in Date</label>
                                    <input 
                                        type="date" 
                                        min={today} 
                                        className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-sm font-medium text-white outline-none focus:border-amber-500" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nights</label>
                                        <input
                                            type="number" 
                                            min="1" 
                                            value={nights}
                                            onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                                            className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-sm font-medium text-white outline-none focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Guests</label>
                                        <input
                                            type="number" 
                                            min="1" 
                                            value={guests}
                                            onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                                            className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-sm font-medium text-white outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price readout */}
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Estimate</span>
                                <span className="text-2xl font-black text-amber-400">${totalPrice.toLocaleString()}</span>
                            </div>

                            {/* PesaPal Checkout Trigger */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] uppercase tracking-wider text-xs"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* PesaPal Booking Dialog Modal Integration */}
            {isModalOpen && (
                <BookingModal 
                    isOpen={isModalOpen}
                    onCloseAction={() => setIsModalOpen(false)}
                    hotel={lodgeData}
                    hotelName="Hellen's Lodge Karatu"
                    defaultCategory="Standard Room"
                    activeTier={activeTier}
                    setTier={setActiveTier}
                />
            )}

            <WhatsAppFloat />
            <Footer />
        </main>
    );
}