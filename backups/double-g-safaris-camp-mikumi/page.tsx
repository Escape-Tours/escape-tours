"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, User, CalendarDays } from "lucide-react";

interface BookingModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    hotelName: string;
    roomCategories: string[];
    defaultCategory?: string;
    roomPrices: Record<string, number>;
}

const SERVICE_FEE_PERCENTAGE = 0.25; // 25% Agency Fee

export default function {BookingModal}({
    isOpen,
    onCloseAction,
    hotelName,
    roomCategories,
    defaultCategory = "",
    roomPrices
}: BookingModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingData, setBookingData] = useState({
        name: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        roomType: defaultCategory || roomCategories[0],
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setBookingData(prev => ({
                ...prev,
                roomType: defaultCategory || prev.roomType
            }));
        }
    }, [isOpen, defaultCategory]);

    // Precise Math Logic
    const { nights, subtotal, agencyFee, totalAmount } = useMemo(() => {
        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);

        // Ensure valid date range
        const calculatedNights = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

        const baseRate = roomPrices[bookingData.roomType] || 0;
        const sub = baseRate * bookingData.guests * calculatedNights;
        const fee = sub * SERVICE_FEE_PERCENTAGE;

        return { nights: calculatedNights, subtotal: sub, agencyFee: fee, totalAmount: sub + fee };
    }, [bookingData.checkIn, bookingData.checkOut, bookingData.guests, bookingData.roomType, roomPrices]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: name === "guests" ? Math.max(1, parseInt(value) || 1) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/dpo-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...bookingData, totalAmount, hotelName }),
            });
            const result = await response.json();
            if (result.redirectUrl) window.location.href = result.redirectUrl;
        } catch (error) {
            console.error("Booking error:", error);
            alert("Payment gateway connection failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-md bg-white p-6 shadow-2xl rounded-2xl border-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900">{hotelName}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-3">
                        <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border">
                            <User className="w-4 h-4 text-slate-400" />
                            <input name="name" required placeholder="Full Name" onChange={handleInputChange} className="bg-transparent w-full ml-2 outline-none text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <input type="email" name="email" required placeholder="Email" onChange={handleInputChange} className="bg-transparent w-full ml-2 outline-none text-sm" />
                            </div>
                            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <input type="tel" name="phone" required placeholder="Phone" onChange={handleInputChange} className="bg-transparent w-full ml-2 outline-none text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border">
                                <CalendarDays className="w-4 h-4 text-slate-400" />
                                <input type="date" min={minDate} name="checkIn" required onChange={handleInputChange} className="bg-transparent w-full ml-2 outline-none text-sm" />
                            </div>
                            <input type="date" min={bookingData.checkIn || minDate} name="checkOut" required onChange={handleInputChange} className="p-2 rounded-lg border bg-slate-50 text-sm" />
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Subtotal ({nights} nights)</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Agency Fee (25%)</span>
                            <span>${agencyFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-700">
                            <span>Total Payable</span>
                            <span className="text-amber-400">${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting || nights === 0} className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg rounded-xl transition-all">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}