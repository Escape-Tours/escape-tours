"use client";

import React, { useState, useMemo } from "react";
import { Loader2, Calendar, Users, Briefcase, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function KilimanjaroBookingModal({ open, onOpenChange, route }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", climbDate: "", gearRental: "none", climbers: "1", customRequest: ""
  });

  // Calculate dynamic pricing based on climbers and gear
  const pricing = useMemo(() => {
    const numClimbers = parseInt(formData.climbers) || 1;
    const gearCost = (formData.gearRental === "full-kit" ? 300 : formData.gearRental === "sleeping-bag" ? 100 : 0) * numClimbers;
    const base = (route.price * numClimbers) + gearCost;
    const agencyFee = base * 0.05;
    const vat = (base + agencyFee) * 0.18;
    return { 
      subtotal: base + agencyFee, 
      vat: vat, 
      total: base + agencyFee + vat 
    };
  }, [route.price, formData.gearRental, formData.climbers]);

  // Calculate return date based on route duration
  const getEndDate = (startDate: string) => {
  if (!startDate) return "";
  // Create date object, ensuring it's treated as UTC to avoid timezone shifts
  const date = new Date(startDate);
  if (isNaN(date.getTime())) return "Invalid date"; 
  
  date.setDate(date.getDate() + (route.duration || 0));
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Log Lead
      await fetch("/api/send-kilimanjaro-booking", { 
        method: "POST", 
        body: JSON.stringify({ ...formData, routeName: route.title, total: pricing.total }) 
      });

      // 2. PesaPal Initiation
      const res = await fetch("/api/payment-init", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: pricing.total,
          email: formData.email,
          name: formData.fullName,
          id: `ORD_${Date.now()}` 
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; 
      } else {
        throw new Error("Payment initiation failed");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-black">SECURE YOUR EXPEDITION</DialogTitle>
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <Info size={16} /> <span>{route.title} • {route.duration} Days</span>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" required onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            <Input placeholder="Phone (with country code)" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input type="email" placeholder="Email Address" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
             <Input type="number" min="1" placeholder="Number of Climbers" required onChange={(e) => setFormData({...formData, climbers: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Calendar size={14}/> Start Date</label>
            <Input type="date" required onChange={(e) => setFormData({...formData, climbDate: e.target.value})} />
            {formData.climbDate && (
              <p className="text-xs text-emerald-600 font-bold px-2">Expedition concludes on: {getEndDate(formData.climbDate)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Briefcase size={14}/> Rental Gear</label>
            <Select onValueChange={(val) => setFormData({...formData, gearRental: val})}>
              <SelectTrigger><SelectValue placeholder="Select gear needs" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No gear needed</SelectItem>
                <SelectItem value="sleeping-bag">Sleeping Bag Only (+$100/climber)</SelectItem>
                <SelectItem value="full-kit">Full Rental Kit (+$300/climber)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea placeholder="Special Dietary Requirements or Itinerary Customizations?" onChange={(e) => setFormData({...formData, customRequest: e.target.value})} />

          <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
            <div>
              <p className="text-[10px] uppercase text-slate-400">Total Investment</p>
              <p className="text-2xl font-black">${pricing.total.toLocaleString()}</p>
            </div>
            <Button disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-black py-6 px-8 font-black rounded-xl">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "PAY NOW 🚀"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}