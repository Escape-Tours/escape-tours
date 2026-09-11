"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Mountain, Users, CheckCircle2, XCircle, Info, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WhatsAppFloat from "@/components/whatsapp-float";
import { initiatePesapalPayment } from "@/actions/payment";
import { AddToItineraryButton } from '@/components/AddToItineraryButton';
import { ResidencyTier } from '@/lib/constants/residency';

const routes = [
  {
    name: "Kilimanjaro",
    image: "/images/trekking/kilimanjaro.jpg",
    description: "The Roof of Africa. Choose between Machame, Lemosho, or Marangu routes.",
    duration: "6-8 Days",
    difficulty: "Challenging",
    elevation: "5,895m",
    whatToBring: ["Thermal base layers", "4-season sleeping bag", "Sturdy trekking boots", "Hydration pack"],
    included: ["Park fees", "Professional guides", "Emergency oxygen", "All meals"],
    notIncluded: ["Travel insurance", "Tips for crew", "Personal climbing gear"],
    price: { INTERNATIONAL: 2800, RESIDENT: 2500, CITIZEN: 1700 },
    mandatoryFees: [
      { label: "Conservation Fee (per 24h)", amount: { INTERNATIONAL: "$70", RESIDENT: "$30", CITIZEN: "20,000 TZS" } },
      { label: "Camping/Hut Fee (per night)", amount: { INTERNATIONAL: "$60", RESIDENT: "$30", CITIZEN: "10,000 TZS" } },
      { label: "Rescue Fee (per trip)", amount: { INTERNATIONAL: "$20", RESIDENT: "$20", CITIZEN: "2,000 TZS" } },
      { label: "Ranger Escort Fee (per group)", amount: { INTERNATIONAL: "$15", RESIDENT: "$15", CITIZEN: "10,000 TZS" } }
    ]
  },
  {
    name: "Mount Meru",
    image: "/images/trekking/meru.jpg",
    description: "A perfect acclimatization climb featuring dramatic volcanic ridges and wildlife.",
    duration: "4 Days",
    difficulty: "Moderate",
    elevation: "4,562m",
    whatToBring: ["Lightweight layers", "Broken-in hiking boots", "Trekking poles", "Sun protection"],
    included: ["TANAPA Park permits", "Mountain huts", "Mandatory ranger", "Rescue fees", "Porters", "All meals"],
    notIncluded: ["Travel insurance", "Tips for crew", "Sleeping bag"],
    price: { INTERNATIONAL: 1800, RESIDENT: 1400, CITIZEN: 900 },
    mandatoryFees: [
      { label: "Conservation Fee (per 24h)", amount: { INTERNATIONAL: "$45", RESIDENT: "$25", CITIZEN: "10,000 TZS" } },
      { label: "Hut Fee (per night)", amount: { INTERNATIONAL: "$30", RESIDENT: "$30", CITIZEN: "10,000 TZS" } },
      { label: "Rescue Fee (per trip)", amount: { INTERNATIONAL: "$20", RESIDENT: "$20", CITIZEN: "2,000 TZS" } },
      { label: "Ranger Escort Fee (per group)", amount: { INTERNATIONAL: "$15", RESIDENT: "$15", CITIZEN: "10,000 TZS" } }
    ]
  },
  {
    name: "Ngorongoro Highlands",
    image: "/images/trekking/highlands.jpg",
    description: "Trek through Empakaai Crater and enjoy breathtaking panoramic views.",
    duration: "3 Days",
    difficulty: "Easy/Moderate",
    elevation: "2,800m",
    whatToBring: ["Comfortable trail shoes", "Camera", "Windbreaker", "Personal snacks"],
    included: ["Conservation fees", "Local guides", "Camping equipment", "All meals"],
    notIncluded: ["Travel insurance", "Tips for crew", "Personal clothing"],
    price: { INTERNATIONAL: 1500, RESIDENT: 1100, CITIZEN: 605 },
    mandatoryFees: [
      { label: "Crater Service Fee", amount: { INTERNATIONAL: "$295", RESIDENT: "$295", CITIZEN: "11,800 TZS" } },
      { label: "Concession Fee (per night)", amount: { INTERNATIONAL: "$59", RESIDENT: "$59", CITIZEN: "$59" } },
      { label: "Vehicle Entry Fee", amount: { INTERNATIONAL: "$50", RESIDENT: "$50", CITIZEN: "11,800 TZS" } }
    ]
  },
];

function BookingForm({ route, tier }: { route: any; tier: ResidencyTier }) {
  const [loading, setLoading] = useState(false);

  async function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      climbers: 1, // Default to 1 climber if not specified, adjust if input field exists
    };

    try {
      const result = await initiatePesapalPayment(route, tier, userData);
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleBooking} className="space-y-4 pt-4">
      <DialogHeader>
        <DialogTitle>Book {route.name}</DialogTitle>
      </DialogHeader>
      <input name="name" placeholder="Full Name" required className="w-full p-3 border rounded-lg" />
      <input name="email" type="email" placeholder="Email Address" required className="w-full p-3 border rounded-lg" />
      <input name="phone" placeholder="Phone Number (e.g. 255...)" required className="w-full p-3 border rounded-lg" />
      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 py-6 text-slate-900 font-bold" disabled={loading}>
        {loading ? "Processing..." : "Confirm & Pay with PesaPal"}
      </Button>
    </form>
  );
}

export default function TrekkingPage() {
  const [tier, setTier] = useState<ResidencyTier>("INTERNATIONAL");

  const getItineraryItem = (route: any) => ({
    id: route.name.toLowerCase().replace(/\s+/g, '-'),
    name: route.name,
    type: 'trek' as const,
    basePrice: route.price
  });

  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      <section className="relative h-[60vh] flex items-end">
        <Image src="/images/trekking/hero.jpg" alt="Trekking Adventures" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto p-8 md:p-12 w-full text-white">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">TREKKING ADVENTURES</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-16 flex justify-center">
          <div className="flex bg-slate-200 p-1 rounded-full">
            {(["INTERNATIONAL", "RESIDENT", "CITIZEN"] as ResidencyTier[]).map((t) => (
              <button key={t} onClick={() => setTier(t)} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${tier === t ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {routes.map((route) => (
            <motion.div key={route.name} layout className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
              <div className="h-64 relative rounded-2xl overflow-hidden mb-6">
                <Image src={route.image} alt={route.name} fill className="object-cover" />
              </div>
              
              <div className="px-3 pb-3 space-y-4">
                <h3 className="text-2xl font-black tracking-tight">{route.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{route.description}</p>
                
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline" className="w-full rounded-full border-slate-200 hover:bg-slate-50">View Details & Fees</Button></DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogTitle>{route.name} Expedition</DialogTitle>
                    <div className="mt-6 border-t pt-6">
                       <h4 className="font-bold flex items-center gap-2 mb-3"><DollarSign size={16}/> Mandatory Fees</h4>
                       <ul className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                          {route.mandatoryFees.map((fee, idx) => (
                            <li key={idx} className="bg-slate-50 p-3 rounded-lg">
                              <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{fee.label}</span>
                              <span className="font-black text-slate-900">{fee.amount[tier]}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Starting from</span>
                  <motion.span key={tier} className="text-xl font-black text-slate-900">
                    ${route.price[tier]}
                  </motion.span>
                </div>

                <div className="flex gap-2">
                  <AddToItineraryButton item={getItineraryItem(route)} />
                  <Dialog>
                    <DialogTrigger asChild><Button className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-6">Confirm Booking</Button></DialogTrigger>
                    <DialogContent><BookingForm route={route} tier={tier} /></DialogContent>
                  </Dialog>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <WhatsAppFloat />
    </main>
  );
}