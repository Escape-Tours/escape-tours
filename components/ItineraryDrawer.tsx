'use client';

import React from 'react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { ResidencyTier, RESIDENCY_TIER } from '@/lib/constants/residency';
import { getStandardizedPrice } from '@/lib/utils/price-translator';
import { Settings2, Trash2 } from 'lucide-react';

export const ItineraryDrawer = () => {
  const { items, tier, setTier, removeItem } = useItineraryStore();
  const isEmpty = items.length === 0;

  const totalPrice = items.reduce((acc, item) => {
    const standardized = getStandardizedPrice(item.price, tier);
    const numericPrice = typeof standardized === 'number' ? standardized : 0;
    const quantity = Number(item.quantity ?? item.slots ?? 1);
    return acc + (numericPrice * quantity);
  }, 0);

  return (
    <aside className="p-6 border-l shadow-xl bg-white h-full transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Itinerary</h2>
        {/* Residency Tier Switcher */}
        <div className="relative group">
          <button type="button" className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
            <Settings2 size={12} />
            {RESIDENCY_TIER[tier]}
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-lg shadow-xl p-1 hidden group-hover:block z-50">
            {(['INTERNATIONAL', 'RESIDENT', 'CITIZEN'] as ResidencyTier[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTier(t)}
                className={`w-full text-left px-4 py-2 text-xs rounded-md transition-colors cursor-pointer ${tier === t ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'}`}
              >
                {RESIDENCY_TIER[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
          <p className="text-sm">Your itinerary is empty.</p>
          <p className="text-[11px]">Start adding treks, parks, or hotels.</p>
        </div>
      ) : (
        <ul className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {items.map((item) => {
            const itemPrice = getStandardizedPrice(item.price, tier);
            return (
              <li key={item.id} className="group flex justify-between items-start p-3 border rounded-xl hover:border-slate-300 transition-all">
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{item.type}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {typeof itemPrice === 'number' ? `$${itemPrice.toLocaleString()}` : itemPrice}
                  </span>
                  <button 
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!isEmpty && (
        <div className="mt-4 pt-6 border-t">
          <div className="flex justify-between items-end mb-6">
            <span className="text-sm text-slate-500">Total Price</span>
            <span className="text-2xl font-black text-blue-600">${totalPrice.toLocaleString()}</span>
          </div>
          <button type="button" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all cursor-pointer">
            Proceed to Checkout
          </button>
        </div>
      )}
    </aside>
  );
};

export default ItineraryDrawer;