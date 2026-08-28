// components/hotel/HotelImage360.tsx
'use client';
import { useState } from 'react';
import { Pannellum } from 'pannellum-react';
import { Rotate3d, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HotelImage360({ image, name, has360 }: { image: string, name: string, has360?: boolean }) {
  const [is360, setIs360] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {is360 ? (
          <motion.div 
            key="360"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20"
          >
            <Pannellum width="100%" height="100%" image={image} pitch={0} yaw={0} hfov={110} autoRotate={2} />
            <button 
              onClick={() => setIs360(false)}
              className="absolute top-4 right-4 z-30 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur"
            >
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.img 
            key="static"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            src={image} alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
          />
        )}
      </AnimatePresence>

      {has360 && !is360 && (
        <button
          onClick={(e) => { e.preventDefault(); setIs360(true); }}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all text-xs font-bold uppercase tracking-widest text-slate-900"
        >
          <Rotate3d size={14} /> 360° View
        </button>
      )}
    </div>
  );
}