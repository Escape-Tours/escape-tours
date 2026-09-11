'use client';

import React from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { CONTEXTUAL_ADDONS, AddOnItem } from 'types/addon-types';
import { useItineraryStore } from 'store/useItineraryStore';

interface AddOnModalProps {
  currentAddedItemType?: string;
  onClose: () => void;
}

export const AddOnModal = ({ currentAddedItemType, onClose }: AddOnModalProps) => {
  // Filter add-ons matching the context of the user's latest action
  const relevantAddons = CONTEXTUAL_ADDONS.filter(
    addon => !currentAddedItemType || addon.triggerItemType === currentAddedItemType
  );

  return (
    <div className="absolute inset-x-4 bottom-20 bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 text-white shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={16} />
          <h4 className="text-xs font-black uppercase tracking-wider">Recommended VIP Upgrades</h4>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold">✕</button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {relevantAddons.map((addon) => (
          <div key={addon.id} className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <div>
              <p className="text-[11px] font-bold">{addon.name}</p>
              <span className="text-[9px] text-amber-400 font-black">${addon.price}</span>
            </div>
            <button 
              onClick={() => {
                // Hook into your itinerary store to add this extra
                console.log("Added upsell:", addon.name);
              }}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold rounded-lg transition-all"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};