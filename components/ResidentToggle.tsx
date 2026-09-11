'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Home } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { ResidencyTier, getTierLabel } from '@/types/tariffs';

export const ResidentToggle = () => {
  const tier = useItineraryStore((state) => state.tier);
  const setTier = useItineraryStore((state) => state.setTier);

  const isResident = tier !== ResidencyTier.INTERNATIONAL;

  const handleToggle = () => {
    setTier(isResident ? ResidencyTier.INTERNATIONAL : ResidencyTier.TANZANIAN);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleToggle}
      aria-label={`Current pricing: ${getTierLabel(tier)}`}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border shadow-sm ${
        isResident
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-white text-gray-700 border-gray-200 hover:border-amber-400"
      }`}
    >
      <motion.div
        key={tier}
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isResident ? <Home size={16} /> : <Globe size={16} />}
      </motion.div>
      
      {/* Clean, single source of truth for the label */}
      <span>{getTierLabel(tier)}</span>
    </motion.button>
  );
};