'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { KILIMANJARO_ROUTES } from '@/lib/kilimanjaro-data';
import { Button } from '@/components/ui/button';
import { KilimanjaroBookingModal } from "@/components/kilimanjaro-booking-modal";
import { ArrowRight, Mountain, CheckCircle2 } from 'lucide-react';

export default function KilimanjaroPage() {
  const [booking, setBooking] = useState({ open: false, route: null });

  return (
    <div className="bg-slate-50 min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Editorial Header */}
        <div className="text-center space-y-4 mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-black tracking-tighter text-slate-900"
          >
            Conquer the Roof of Africa
          </motion.h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            Choose your ascent. Expertly curated routes designed for acclimatization and ultimate success.
          </p>
        </div>

        {/* Route Cards */}
        {KILIMANJARO_ROUTES.map((route, index) => (
          <motion.div 
            key={route.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row h-auto min-h-[500px]"
          >
            {/* Image Layer with Zoom */}
            <div className="relative w-full md:w-5/12 h-80 md:h-auto overflow-hidden">
              <img 
                src={route.image} 
                alt={route.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Route Duration</p>
                <p className="text-4xl font-black">{route.duration}</p>
              </div>
            </div>

            {/* Content Layer */}
            <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
              <div className="space-y-2 mb-8">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">{route.title}</h2>
                <p className="text-amber-600 font-bold uppercase tracking-widest text-sm">{route.subtitle}</p>
              </div>
              
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">{route.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {route.features.slice(0, 4).map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="text-emerald-500" size={20} /> {f}
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setBooking({ open: true, route })} 
                className="w-full py-8 text-lg rounded-2xl bg-slate-900 hover:bg-amber-500 hover:text-black transition-all font-black flex items-center justify-center gap-3 group/btn"
              >
                Book Ascent - ${route.price.toLocaleString()} 
                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {booking.route && (
        <KilimanjaroBookingModal 
          open={booking.open} 
          onOpenChange={(open: boolean) => setBooking({ open, route: null })} 
          route={booking.route} 
        />
      )}
    </div>
  );
}