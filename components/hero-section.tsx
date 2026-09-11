'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Dynamic Background with Subtle Parallax feel */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "linear" }}
        className="absolute inset-0 z-0"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 opacity-60" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs mb-4 block"
        >
          Escape Tours Tanzania
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6"
        >
          Ngorongoro <span className="text-amber-500">Oldeani Lodge</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
        >
          Authentic Tanzanian hospitality meets stunning landscapes on the edge of the Ngorongoro Crater.
        </motion.p>
      </div>
    </section>
  );
}