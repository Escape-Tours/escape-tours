'use client';
import React from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { Day } from '@/lib/types/itinerary-types';

interface TimelineViewProps {
  days: Day[];
  residencyTier: string;
}

export const TimelineView = ({ days, residencyTier }: TimelineViewProps) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950/60 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
      
      {/* Header Overview */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Master Timeline Manifest</h2>
            <p className="text-xs text-slate-400">Chronological itinerary flow across all booked days.</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          {residencyTier} Tariff
        </div>
      </div>

      {/* Days & Slots Chronological Sequence */}
      <div className="space-y-6">
        {days.map((day) => (
          <div key={day.id} className="relative pl-6 border-l-2 border-amber-400/30 space-y-4">
            
            {/* Day Badge */}
            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Day {day.day_number}</span>
                <h3 className="text-base font-black text-white">{day.location}</h3>
              </div>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {day.slots.map((slot) => (
                <div 
                  key={slot.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    slot.item 
                      ? 'bg-slate-900/90 border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                      : 'bg-slate-900/30 border-white/5 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase flex items-center gap-1">
                      <Clock size={12} className="text-amber-400" />
                      {slot.type}
                    </span>
                    {slot.item && (
                      <span className="text-[10px] font-black text-amber-400">
                        ${slot.item.price ?? slot.item.base_price ?? 150}
                      </span>
                    )}
                  </div>

                  {slot.item ? (
                    <div>
                      <h4 className="text-xs font-black text-white truncate mb-1">{slot.item.name}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin size={10} className="text-emerald-400 shrink-0" />
                        <span>{slot.item.location_name || 'Tanzania Safari Circuit'}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <span className="text-[11px] text-slate-600 font-bold block">Open Slot / Leisure</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};