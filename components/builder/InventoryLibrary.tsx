// components/itinerary/InventoryLibrary.tsx
'use client';

import React, { useState } from 'react';
import { Search, Compass, Plus, Hotel, Waves, Mountain, Sparkles } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';

const CATALOG_ITEMS = [
  {
    id: 'serengeti-migration-camp',
    name: 'Serengeti Migration Camp',
    category: 'HOTELS',
    type: 'lodges' as const,
    price: { CITIZEN: 45, RESIDENT: 90, INTERNATIONAL: 150 },
    location: 'Serengeti National Park, Tanzania',
  },
  {
    id: 'zanzibar-sunset-cruise',
    name: 'Zanzibar Sunset Cruise',
    category: 'MARINE',
    type: 'activities' as const,
    price: { CITIZEN: 25, RESIDENT: 50, INTERNATIONAL: 85 },
    location: 'Nungwi Beach, Zanzibar',
  },
  {
    id: 'ngorongoro-crater-safari',
    name: 'Ngorongoro Crater Game Drive',
    category: 'ACTIVITIES',
    type: 'activities' as const,
    price: { CITIZEN: 50, RESIDENT: 110, INTERNATIONAL: 200 },
    location: 'Ngorongoro Conservation Area',
  },
  {
    id: 'kilimanjaro-machame-trek',
    name: 'Kilimanjaro Machame Route (Day Hike)',
    category: 'TREKS',
    type: 'treks' as const,
    price: { CITIZEN: 80, RESIDENT: 180, INTERNATIONAL: 350 },
    location: 'Mount Kilimanjaro',
  },
];

export const InventoryLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'HOTELS' | 'ACTIVITIES' | 'MARINE' | 'TREKS'>('ALL');
  
  const { addCartItem, tier } = useItineraryStore();

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddCatalogItem = (item: typeof CATALOG_ITEMS[0]) => {
    const currentTierKey = String(tier || 'INTERNATIONAL').toUpperCase();
    const resolvedBasePrice = 
      typeof item.price === 'object' && item.price !== null
        ? (item.price[currentTierKey as keyof typeof item.price] ?? item.price.INTERNATIONAL ?? 100)
        : item.price;

    addCartItem({
      originalId: item.id,
      name: item.name,
      type: item.type,
      basePrice: item.price,
      price: typeof resolvedBasePrice === 'number' ? resolvedBasePrice : 100,
    });
    alert(`Success! "${item.name}" has been added to your Itinerary Cart.`);
  };

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
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No inventory items found matching your search.
          </div>
        ) : (
          filteredItems.map((item) => {
            const currentTierKey = String(tier || 'INTERNATIONAL').toUpperCase();
            const displayPrice = 
              typeof item.price === 'object' && item.price !== null
                ? (item.price[currentTierKey as keyof typeof item.price] ?? item.price.INTERNATIONAL)
                : item.price;

            return (
              <div 
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-400/40 transition-all group flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      item.category === 'HOTELS' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                      item.category === 'MARINE' ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' :
                      item.category === 'TREKS' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                      'bg-purple-400/10 text-purple-400 border-purple-400/20'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-xs font-black text-amber-400">${displayPrice}</span>
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">{item.location}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddCatalogItem(item)}
                  className="w-full mt-1 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition-all font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/5"
                >
                  <Plus size={12} /> Add to Itinerary Cart
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};