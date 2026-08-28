'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export const SlideTrigger = ({ onOpen }: { onOpen: () => void }) => {
  // Constraints: Dragging left (negative X)
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, -100], [1, 0]);

  return (
    <div className="relative w-48 h-16 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-full border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-1.5 flex items-center justify-end overflow-hidden">
      
      {/* Pull Label */}
      <span className="absolute right-16 text-white/80 font-bold text-[10px] uppercase tracking-[0.2em] pointer-events-none">
        Pull to Slide
      </span>

      {/* The Knob */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          // Trigger when pulled left past 80px
          if (info.offset.x < -80) onOpen();
        }}
        style={{ x }}
        className="h-12 w-12 bg-gradient-to-b from-white to-slate-200 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-grab border border-white/50 active:cursor-grabbing"
      >
        {/* Animated Chevron to signal direction */}
        <motion.div style={{ opacity }}>
          <ChevronLeft className="text-slate-700" size={20} />
        </motion.div>
      </motion.div>
    </div>
  );
};