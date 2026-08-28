'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CalendarDays, ArrowRight } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';

export function ItinerarySummary() {
  const { items, removeItem, totalPrice } = useItineraryStore();

  // Group items by day and timeSlot
  const groupedItinerary = useMemo(() => {
    const groups: any = {};
    items.forEach((item) => {
      if (!groups[item.dayId!]) groups[item.dayId!] = { MORNING: [], AFTERNOON: [], EVENING: [] };
      if (item.timeSlot) {
        groups[item.dayId!][item.timeSlot].push(item);
      }
    });
    return groups;
  }, [items]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="text-amber-600" size={28} />
        <h2 className="text-3xl font-black text-gray-900">Your Escape</h2>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[60vh]">
        {Object.keys(groupedItinerary).length === 0 ? (
          <p className="text-gray-500 italic text-center py-10">No items added yet. Drag items to your daily itinerary.</p>
        ) : (
          Object.entries(groupedItinerary).map(([day, slots]: [any, any]) => (
            <div key={day} className="space-y-2">
              <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest">Day {day}</h3>
              {Object.entries(slots).map(([slotName, slotItems]: [any, any]) => (
                slotItems.length > 0 && (
                  <div key={slotName} className="pl-4 border-l-2 border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{slotName}</p>
                    {slotItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center py-2">
                        <span className="text-sm font-bold">{item.name}</span>
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          ))
        )}
      </div>
      
      {items.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Total Estimate</span>
            <span className="text-3xl font-black">${totalPrice().toLocaleString()}</span>
          </div>
          <button className="w-full bg-black text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition-all">
            Request Booking <ArrowRight size={20} />
          </button>
        </div>
      )}
    </motion.div>
  );
}