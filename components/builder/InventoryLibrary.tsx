'use client';
import React, { useState } from 'react';
import { Sparkles, Search, Compass, Plus, Hotel, Compass as CompassIcon, Waves, Mountain } from 'lucide-react';
import { ItineraryItem } from '@/lib/types/itinerary-types';

export const InventoryLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'HOTELS' | 'ACTIVITIES' | 'MARINE' | 'TREKS'>('ALL');

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/80 p-5 text-white">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-amber-400" />
          <h3 className="text-sm font-black tracking-wider uppercase">Experience Inventory</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Catalog</span>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lodges, safaris, treks..."
          className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 custom-scrollbar shrink-0">
        {(['ALL', 'HOTELS', 'ACTIVITIES', 'MARINE', 'TREKS'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-400/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">Lodge</span>
            <span className="text-xs font-black text-amber-400">$150</span>
          </div>
          <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">Serengeti Migration Camp</h4>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Serengeti National Park, Tanzania</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-400/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">Marine</span>
            <span className="text-xs font-black text-cyan-400">$85</span>
          </div>
          <h4 className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">Zanzibar Sunset Cruise</h4>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Nungwi Beach, Zanzibar</p>
        </div>
      </div>
    </div>
  );
};