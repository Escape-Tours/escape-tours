"use client";
import React, { useState } from "react";
import { Check, ShieldCheck, Users, BedDouble } from "lucide-react";
import {BookingModal} from "./booking-modal";
// Inside your BookingOptions component
const [isBooking, setIsBooking] = useState(false);

// Update your handle function in the {BookingModal} (passed via props)
const handleBooking = async (data) => {
    setIsBooking(true);
    try {
        const res = await fetch('/api/send-hotel-booking', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        // Add toast or alert feedback here
    } finally {
        setIsBooking(false);
    }
};
export default function BookingOptions() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black font-serif text-white mb-3">Available Accommodations</h2>
                <p className="text-gray-400">Select your ideal room configuration for an exceptional safari base</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Room Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:border-orange-500/50 transition-all duration-300">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-orange-500/10 text-orange-500 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                                Most Popular
                            </span>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Per Night</p>
                                <p className="text-3xl font-black text-white">$120</p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white font-serif mb-2">Luxury Cottage</h3>
                        <p className="text-sm text-gray-400 mb-6">Spacious private cottage featuring a pristine en-suite bathroom and scenic veranda views.</p>

                        <hr className="border-slate-800 my-6" />

                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-gray-300">
                            <div className="flex items-center gap-2"><Users size={16} className="text-orange-500" /> <span>2 Adults</span></div>
                            <div className="flex items-center gap-2"><BedDouble size={16} className="text-orange-500" /> <span>King Bed</span></div>
                            <div className="flex items-center gap-2"><Check size={16} className="text-orange-500" /> <span>Free Wi-Fi</span></div>
                            <div className="flex items-center gap-2"><Check size={16} className="text-orange-500" /> <span>Breakfast Inc.</span></div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all duration-200 uppercase tracking-wider text-sm"
                        >
                            Check Availability
                        </button>
                    </div>
                </div>
            </div>

            <{BookingModal}
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                hotelName="Hellen's Lodge Karatu"
                pricePerNight={120}
            />
        </section>
    );
}