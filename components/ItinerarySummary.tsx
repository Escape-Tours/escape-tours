// components/ItinerarySummary.tsx
'use client';

import React from 'react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { motion } from 'framer-motion';

export function ItinerarySummary() {
  const { 
    totalDays, 
    rejectedCarDays, 
    rejectCarForDay, 
    getCostBreakdown 
  } = useItineraryStore();

  const breakdown = getCostBreakdown();
  
  // Check if all active days have their car rejected, or toggle for day 1 by default
  const isCarRejected = totalDays > 0 && Array.from({ length: totalDays }, (_, i) => i + 1).every(dayId => rejectedCarDays.includes(dayId));

  const handleVehicleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    // Toggle car rejection for all active days 1 to totalDays
    for (let dayId = 1; dayId <= totalDays; dayId++) {
      const isCurrentlyRejected = rejectedCarDays.includes(dayId);
      if (checked && !isCurrentlyRejected) {
        rejectCarForDay(dayId);
      } else if (!checked && isCurrentlyRejected) {
        // If unchecked, we remove it from rejectedCarDays by resetting or toggling
        // Since useItineraryStore has rejectCarForDay, let's make sure it handles re-adding if needed
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white max-w-xl w-full shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isCarRejected}
            onChange={(e) => {
              const checked = e.target.checked;
              for (let dayId = 1; dayId <= totalDays; dayId++) {
                const isRejected = rejectedCarDays.includes(dayId);
                if (checked && !isRejected) {
                  rejectCarForDay(dayId);
                } else if (!checked && isRejected) {
                  // To re-include, we clear or toggle rejectedCarDays
                  useItineraryStore.setState((state) => ({
                    rejectedCarDays: state.rejectedCarDays.filter(d => d !== dayId)
                  }));
                }
              }
            }}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm font-medium text-zinc-300">I have my own vehicle</span>
        </label>
        {!isCarRejected && (
          <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
            Includes 4x4 Safari Car ($350)
          </span>
        )}
      </div>

      <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm text-zinc-400">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-white font-semibold">${breakdown.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT (18%)</span>
          <span className="text-white font-semibold">+${breakdown.vat}</span>
        </div>
        <div className="flex justify-between">
          <span>Agency Fee</span>
          <span className="text-white font-semibold">+${breakdown.agencyFee}</span>
        </div>
      </div>

      <div className="border-t border-zinc-800 mt-4 pt-4 flex items-center justify-between">
        <span className="text-base font-bold text-white">GRAND TOTAL (INC. VAT & FEES)</span>
        <span className="text-2xl font-extrabold text-amber-400">${breakdown.grandTotal}</span>
      </div>

      <button className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-amber-500/20">
        PROCEED TO SECURE CHECKOUT
      </button>
    </motion.div>
  );
}