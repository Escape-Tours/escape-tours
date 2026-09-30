// components/BookingModal.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, X, Users, Baby, Hotel, Globe, Sparkles, MessageSquare, AlertCircle, ShieldCheck } from "lucide-react";
import { createBooking } from "@/actions/itineraryActions";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Input = ({ icon, ...props }: any) => (
  <div className="flex items-center gap-3 bg-stone-50/80 px-4 rounded-2xl border border-stone-200/80 focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:bg-white transition-all duration-300 shadow-sm">
    {icon && <div className="text-amber-700/60">{icon}</div>}
    <input {...props} className="bg-transparent py-3.5 w-full outline-none text-sm font-medium text-stone-900 placeholder:text-stone-400" />
  </div>
);

export function BookingModal({ hotel, isOpen, onCloseAction, activeTier, setTier, initialCategory }: any) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Local state to ensure dropdown changes immediately update the tier even if props lag
  const [selectedTier, setSelectedTier] = useState<string>(activeTier || "CITIZEN");

  // Keep local state in sync if prop changes
  useEffect(() => {
    if (activeTier) {
      setSelectedTier(activeTier);
    }
  }, [activeTier]);

  const handleTierChange = (newTier: string) => {
    setSelectedTier(newTier);
    if (setTier) {
      setTier(newTier);
    }
  };

  const resolvedTier = useMemo(() => {
    return selectedTier || 'INTERNATIONAL';
  }, [selectedTier]);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const roomCategories = useMemo(() => Object.keys(hotel?.room_prices || {}), [hotel?.room_prices]);
  
  const [bookingData, setBookingData] = useState({
    firstName: "", lastName: "", email: "", phone: "", 
    adults: 1, children: 0,
    checkIn: today,
    checkOut: tomorrow,
    category: initialCategory || roomCategories[0] || "",
    specialRequests: ""
  });

  useEffect(() => {
    if (initialCategory) {
      setBookingData(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const details = useMemo(() => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.category || !hotel?.room_prices) return null;
    
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const rawPriceData = hotel.room_prices?.[bookingData.category];
    let nightRate = 100;

    const currentTierEval = resolvedTier;

    if (typeof rawPriceData === 'number') {
      nightRate = rawPriceData;
    } else if (typeof rawPriceData === 'object' && rawPriceData !== null) {
      const tierKey = currentTierEval.toLowerCase();
      const target = rawPriceData[currentTierEval] || rawPriceData[tierKey] || rawPriceData.high || rawPriceData.low || Object.values(rawPriceData)[0];
      
      if (typeof target === 'number') {
        nightRate = target;
      } else if (typeof target === 'object' && target !== null) {
        nightRate = Number(target[currentTierEval] || target[tierKey] || Object.values(target)[0]) || 100;
      }
    }

    const adultsCount = Number(bookingData.adults) || 1;
    const childrenCount = Number(bookingData.children) || 0;
    
    const adultTotalPerNight = nightRate * adultsCount;
    const childTotalPerNight = (nightRate * 0.5) * childrenCount;
    const subtotalBase = (adultTotalPerNight + childTotalPerNight) * nights;

    const vat = subtotalBase * 0.18;
    const agencyFee = subtotalBase * 0.20;
    const totalAmount = subtotalBase + vat + agencyFee;

    return { nights, subtotalBase, vat, agencyFee, totalAmount };
  }, [bookingData, hotel, resolvedTier]);

  const handleConfirm = async () => {
    if (!details) return;
    setFormError("");

    if (!bookingData.firstName.trim() || !bookingData.lastName.trim() || !bookingData.email.trim() || !bookingData.phone) {
      setFormError("Please fill in all required personal details (First Name, Last Name, Email, Phone).");
      return;
    }

    setLoading(true);
    
    const payload = {
      hotel_id: hotel?.id,
      first_name: bookingData.firstName.trim(),
      last_name: bookingData.lastName.trim(),
      email: bookingData.email.trim(),
      phone: bookingData.phone.trim(),
      adults: Number(bookingData.adults) || 1,
      children: Number(bookingData.children) || 0,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      room_category: bookingData.category,
      residency_type: resolvedTier,
      special_requests: bookingData.specialRequests.trim(),
      nights: details.nights,
      subtotal: details.subtotalBase,
      vat: details.vat,
      agency_fee: details.agencyFee,
      total_amount: details.totalAmount,
      status: "pending"
    };

    console.log("Submitting validated booking payload:", payload);

    try {
      const response: any = await createBooking(payload);
      console.log("Create booking raw server response:", response);

      if (response?.error) {
        throw new Error(response.error.message || JSON.stringify(response.error));
      }
      
      const newBooking = response?.data || response;
      if (!newBooking || typeof newBooking !== 'object' || !('id' in newBooking)) {
        throw new Error("Booking record processed on server but no valid booking ID returned.");
      }
      
      window.location.href = `/api/checkout?bookingId=${(newBooking as any).id}&amount=${details.totalAmount}`;
    } catch (err: any) {
      console.error("Detailed Booking Execution Error:", err);
      setFormError(err?.message || "Invalid booking data provided.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-[520px] p-0 overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50/90 rounded-[2.5rem] border border-stone-200/60 shadow-2xl backdrop-blur-xl">
        <button 
          onClick={onCloseAction} 
          className="absolute right-5 top-5 z-50 p-2.5 bg-stone-100/80 hover:bg-stone-200/80 rounded-full text-stone-600 transition-colors duration-200 shadow-sm"
        >
          <X size={18}/>
        </button>
        
        <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Header Branding */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-amber-700 font-semibold tracking-[0.25em] uppercase text-[10px]">
              <Sparkles size={13} className="text-amber-600" /> Escape Safari Collection
            </div>
            <DialogTitle className="text-3xl font-serif tracking-tight text-stone-900">
              {hotel?.name}
            </DialogTitle>
          </div>
          
          {/* PERSONAL DETAILS SECTION */}
          <div className="space-y-3.5 bg-amber-50/30 p-5 rounded-3xl border border-amber-200/40 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-900/80">1. Guest Information</span>
              <ShieldCheck size={16} className="text-amber-700/60" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <Input placeholder="First Name *" value={bookingData.firstName} onChange={(e: any) => setBookingData({...bookingData, firstName: e.target.value})} />
              <Input placeholder="Last Name *" value={bookingData.lastName} onChange={(e: any) => setBookingData({...bookingData, lastName: e.target.value})} />
            </div>
            <Input type="email" placeholder="Email Address *" value={bookingData.email} onChange={(e: any) => setBookingData({...bookingData, email: e.target.value})} />
            <div className="bg-stone-50/80 px-4 rounded-2xl border border-stone-200/80 focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:bg-white transition-all shadow-sm">
              <PhoneInput defaultCountry="TZ" value={bookingData.phone} onChange={(val: any) => setBookingData(prev => ({ ...prev, phone: val || "" }))} className="py-2.5 text-stone-900" />
            </div>
          </div>

          {/* STAY DETAILS SECTION */}
          <div className="space-y-3.5 bg-stone-100/50 p-5 rounded-3xl border border-stone-200/60 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600">2. Stay Details & Residency</span>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2 flex items-center gap-3 bg-stone-50/80 px-4 rounded-2xl border border-stone-200/80 focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:bg-white transition-all shadow-sm">
                <Globe size={16} className="text-amber-700/60"/>
                <select value={resolvedTier} onChange={(e) => handleTierChange(e.target.value)} className="w-full bg-transparent py-3.5 outline-none text-sm font-medium text-stone-900 cursor-pointer">
                  <option value="CITIZEN">East African Citizen</option>
                  <option value="RESIDENT">Tanzania Resident</option>
                  <option value="INTERNATIONAL">International Guest</option>
                </select>
              </div>

              <div className="col-span-2 flex items-center gap-3 bg-stone-50/80 px-4 rounded-2xl border border-stone-200/80 focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:bg-white transition-all shadow-sm">
                <Hotel size={16} className="text-amber-700/60"/>
                <select name="category" value={bookingData.category} onChange={(e) => setBookingData({...bookingData, category: e.target.value})} className="w-full bg-transparent py-3.5 outline-none text-sm font-medium text-stone-900 cursor-pointer">
                  {roomCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <Input icon={<Users size={16}/>} type="number" placeholder="Adults" value={bookingData.adults} onChange={(e: any) => setBookingData({...bookingData, adults: e.target.value})} />
              <Input icon={<Baby size={16}/>} type="number" placeholder="Children (50%)" value={bookingData.children} onChange={(e: any) => setBookingData({...bookingData, children: e.target.value})} />
              
              <div className="space-y-1 col-span-1">
                <label className="text-[10px] uppercase font-bold text-stone-400 pl-1">Check-In</label>
                <Input type="date" min={today} value={bookingData.checkIn} onChange={(e: any) => setBookingData({...bookingData, checkIn: e.target.value})} />
              </div>
              <div className="space-y-1 col-span-1">
                <label className="text-[10px] uppercase font-bold text-stone-400 pl-1">Check-Out</label>
                <Input type="date" min={bookingData.checkIn || today} value={bookingData.checkOut} onChange={(e: any) => setBookingData({...bookingData, checkOut: e.target.value})} />
              </div>
              
              <div className="col-span-2 flex items-start gap-3 bg-stone-50/80 px-4 py-3 rounded-2xl border border-stone-200/80 focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:bg-white transition-all shadow-sm">
                 <MessageSquare size={16} className="text-amber-700/60 mt-2"/>
                 <textarea 
                    placeholder="Special requests, dietary needs, or milestone celebrations..." 
                    className="bg-transparent w-full outline-none text-sm font-medium text-stone-900 placeholder:text-stone-400 resize-none h-20 pt-1"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                 />
              </div>
            </div>
          </div>

          {details && (
            <div className="p-6 bg-stone-900 text-stone-300 rounded-3xl space-y-2.5 text-sm font-medium shadow-xl border border-stone-800">
              <div className="flex justify-between text-xs text-stone-400"><span>Base Accommodation ({details.nights} nights)</span><span>${details.subtotalBase.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs text-stone-400"><span>Government Tax (VAT 18%)</span><span>${details.vat.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs text-amber-400 font-semibold"><span>Concierge & Agency Fee (20%)</span><span>${details.agencyFee.toFixed(2)}</span></div>
              <div className="border-t border-stone-800 pt-3.5 flex justify-between font-serif text-xl font-bold text-white tracking-wide">
                <span>Total Investment</span>
                <span className="text-amber-400">${details.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {formError && (
            <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm">
              <AlertCircle size={16} className="shrink-0" />
              {formError}
            </div>
          )}

          <button 
            onClick={handleConfirm} 
            disabled={loading || !details} 
            className="w-full py-4.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto text-stone-950" size={18} /> : "Proceed to Secure Checkout"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}