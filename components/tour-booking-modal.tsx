"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResidencyTier, RESIDENCY_TIER } from '@/lib/constants/residency';
import { calculateTotal } from "@/lib/pricing"

interface TourBookingModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tourTitle?: string
    basePriceByTier?: Record<ResidencyTier, number> 
}

export function TourBookingModal({ open, onOpenChange, tourTitle, basePriceByTier }: TourBookingModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [cars, setCars] = useState<any[]>([])
    const [selectedCarPrice, setSelectedCarPrice] = useState(0)
    const [tier, setTier] = useState<ResidencyTier>(RESIDENCY_TIER.INTERNATIONAL)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+1",
        phone: "",
        travelDate: "",
        duration: "1",
        adults: "1",
        children: "0",
        accommodation: "mid-range",
        message: "",
    })

    useEffect(() => {
        const fetchCars = async () => {
            const supabase = createClient();
            const { data } = await supabase.from('safari_cars').select('*');
            setCars(data || []);
        };
        if (open) fetchCars();
    }, [open]);

    const countryCodes = [
        { code: "+1", name: "United States/Canada", flag: "🇺🇸" },
        { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
        { code: "+255", name: "Tanzania", flag: "🇹🇿" },
        { code: "+254", name: "Kenya", flag: "🇰🇪" },
        { code: "+27", name: "South Africa", flag: "🇿🇦" },
        { code: "+91", name: "India", flag: "🇮🇳" },
        { code: "+86", name: "China", flag: "🇨🇳" },
        { code: "+81", name: "Japan", flag: "🇯🇵" },
        { code: "+49", name: "Germany", flag: "🇩🇪" },
        { code: "+33", name: "France", flag: "🇫🇷" },
        { code: "+39", name: "Italy", flag: "🇮🇹" },
        { code: "+34", name: "Spain", flag: "🇪🇸" },
        { code: "+31", name: "Netherlands", flag: "🇳🇱" },
        { code: "+32", name: "Belgium", flag: "🇧🇪" },
        { code: "+41", name: "Switzerland", flag: "🇨🇭" },
        { code: "+43", name: "Austria", flag: "🇦🇹" },
        { code: "+61", name: "Australia", flag: "🇦🇺" },
        { code: "+64", name: "New Zealand", flag: "🇳🇿" },
        { code: "+971", name: "UAE", flag: "🇦🇪" },
        { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
    ]

    const estimatedTotal = useMemo(() => {
        const nights = parseInt(formData.duration) || 0
        const adults = parseInt(formData.adults) || 1
        const basePrice = basePriceByTier ? basePriceByTier[tier] : 0
        const dailyRate = basePrice + selectedCarPrice
        return calculateTotal(dailyRate * adults, nights)
    }, [formData.duration, formData.adults, basePriceByTier, selectedCarPrice, tier])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const bookingData = { ...formData, phone: `${formData.countryCode} ${formData.phone}`, tourTitle, estimatedTotal, tier }
            const response = await fetch("/api/send-tour-booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            })
            if (!response.ok) throw new Error("Failed to send request")
            alert("Thank you for your booking request!")
            onOpenChange(false)
        } catch (error) {
            setSubmitError("Failed to send booking request.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl md:text-4xl font-black text-brand-dark text-center mb-2">
                        BOOK THIS TOUR NOW
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Residency Status */}
                    <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Residency Status</Label>
                        <RadioGroup value={tier} onValueChange={(v: ResidencyTier) => setTier(v)} className="flex gap-4">
                            {(['INTERNATIONAL', 'RESIDENT', 'CITIZEN'] as const).map((t) => (
                                <div key={t} className="flex items-center space-x-2">
                                    <RadioGroupItem value={t} id={t} />
                                    <Label htmlFor={t}>{t}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-gray-700 font-semibold">First Name *</Label>
                            <Input id="firstName" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-gray-700 font-semibold">Last Name *</Label>
                            <Input id="lastName" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-semibold">Email *</Label>
                            <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone *</Label>
                            <div className="flex gap-2">
                                <select value={formData.countryCode} onChange={(e) => setFormData({...formData, countryCode: e.target.value})} className="w-24 border border-gray-300 rounded-md p-2 text-sm">
                                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                                </select>
                                <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="travelDate" className="text-gray-700 font-semibold">Travel Date *</Label>
                            <Input id="travelDate" type="date" required value={formData.travelDate} onChange={(e) => setFormData({...formData, travelDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration" className="text-gray-700 font-semibold">Duration (Nights) *</Label>
                            <Input id="duration" type="number" min="1" required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 font-semibold">Select Safari Vehicle</Label>
                        <select className="w-full border border-gray-300 rounded-md p-2" onChange={(e) => setSelectedCarPrice(Number(e.target.value))}>
                            <option value="0">No Vehicle Needed</option>
                            {cars.map((car) => (
                                <option key={car.id} value={car.price_per_day}>{car.name} (${car.price_per_day}/day)</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700 font-semibold">Special Requests</Label>
                        <Textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border text-center">
                        <p className="text-sm font-semibold text-gray-600 uppercase">Estimated Quote ({tier})</p>
                        <p className="text-3xl font-black text-brand-dark">${estimatedTotal.toLocaleString()}</p>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-dark py-6 text-lg">
                        {isSubmitting ? "Sending..." : "Send Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}