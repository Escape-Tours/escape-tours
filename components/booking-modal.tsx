"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, X, Users, Baby, Hotel, Globe, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createBooking } from "@/actions/itineraryActions";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Input = ({ icon, ...props }: any) => (
  <div className="flex items-center gap-3 bg-slate-50 px-4 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-amber-500 transition-all">
    {icon && <div className="text-slate-400">{icon}</div>}
    <input {...props} className="bg-transparent py-3 w-full outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400" />
  </div>
);

export function BookingModal({ hotel, isOpen, onCloseAction, activeTier, setTier, initialCategory }: any) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  
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

    if (typeof rawPriceData === 'number') {
      nightRate = rawPriceData;
    } else if (typeof rawPriceData === 'object' && rawPriceData !== null) {
      const tierKey = activeTier?.toLowerCase() || "";
      const target = rawPriceData[activeTier] || rawPriceData[tierKey] || rawPriceData.high || rawPriceData.low || Object.values(rawPriceData)[0];
      
      if (typeof target === 'number') {
        nightRate = target;
      } else if (typeof target === 'object' && target !== null) {
        nightRate = Number(target[activeTier] || target[tierKey] || Object.values(target)[0]) || 100;
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
  }, [bookingData, hotel, activeTier]);

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
      residency_type: activeTier,
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
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        <button onClick={onCloseAction} className="absolute right-4 top-4 z-50 p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
        
        <div className="p-8 space-y-5 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-amber-600 font-bold tracking-[0.2em] uppercase text-xs">
            <Sparkles size={14} /> Escape + Vision Booking
          </div>
          
          <DialogTitle className="text-2xl font-serif text-slate-900">Finalizing {hotel?.name}</DialogTitle>
          
          {/* PERSONAL DETAILS LOCKED AT THE TOP */}
          <div className="space-y-3 bg-amber-50/40 p-4 rounded-2xl border border-amber-100">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">1. Guest Information</p>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name *" value={bookingData.firstName} onChange={(e: any) => setBookingData({...bookingData, firstName: e.target.value})} />
              <Input placeholder="Last Name *" value={bookingData.lastName} onChange={(e: any) => setBookingData({...bookingData, lastName: e.target.value})} />
            </div>
            <Input type="email" placeholder="Email Address *" value={bookingData.email} onChange={(e: any) => setBookingData({...bookingData, email: e.target.value})} />
            <div className="bg-white px-4 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-amber-500">
              <PhoneInput defaultCountry="TZ" value={bookingData.phone} onChange={(val: any) => setBookingData(prev => ({ ...prev, phone: val || "" }))} className="py-2" />
            </div>
          </div>

          {/* STAY DETAILS SECTION */}
          <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">2. Stay Details</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex items-center gap-3 bg-white px-4 rounded-xl border border-slate-200">
                <Globe size={16} className="text-slate-400"/>
                <select value={activeTier} onChange={(e) => setTier?.(e.target.value as any)} className="w-full bg-transparent py-3 outline-none text-sm font-medium">
                  <option value="INTERNATIONAL">International</option>
                  <option value="RESIDENT">Resident</option>
                  <option value="CITIZEN">Citizen</option>
                </select>
              </div>

              <div className="col-span-2 flex items-center gap-3 bg-white px-4 rounded-xl border border-slate-200">
                <Hotel size={16} className="text-slate-400"/>
                <select name="category" value={bookingData.category} onChange={(e) => setBookingData({...bookingData, category: e.target.value})} className="w-full bg-transparent py-3 outline-none text-sm font-medium">
                  {roomCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <Input icon={<Users size={16}/>} type="number" placeholder="Adults" value={bookingData.adults} onChange={(e: any) => setBookingData({...bookingData, adults: e.target.value})} />
              <Input icon={<Baby size={16}/>} type="number" placeholder="Children (50%)" value={bookingData.children} onChange={(e: any) => setBookingData({...bookingData, children: e.target.value})} />
              
              <Input type="date" min={today} value={bookingData.checkIn} onChange={(e: any) => setBookingData({...bookingData, checkIn: e.target.value})} />
              <Input type="date" min={bookingData.checkIn || today} value={bookingData.checkOut} onChange={(e: any) => setBookingData({...bookingData, checkOut: e.target.value})} />
              
              <div className="col-span-2 flex items-start gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200">
                 <MessageSquare size={16} className="text-slate-400 mt-1"/>
                 <textarea 
                    placeholder="Special requests or dietary requirements..." 
                    className="bg-transparent w-full outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none h-16"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                 />
              </div>
            </div>
          </div>

          {details && (
            <div className="p-5 bg-slate-900 text-slate-300 rounded-2xl space-y-2 text-sm font-medium shadow-inner">
              <div className="flex justify-between"><span>Base ({details.nights} nights + children)</span><span>${details.subtotalBase.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>VAT (18%)</span><span>${details.vat.toFixed(2)}</span></div>
              <div className="flex justify-between text-amber-500"><span>Agency Fee (20%)</span><span>${details.agencyFee.toFixed(2)}</span></div>
              <div className="border-t border-slate-700 pt-3 flex justify-between font-black text-lg text-white">
                <span>Total Vision Investment</span><span>${details.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {formError && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} />
              {formError}
            </div>
          )}

          <button onClick={handleConfirm} disabled={loading || !details} className="w-full py-4 bg-amber-500 text-slate-900 font-black rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Confirm Reservation"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}