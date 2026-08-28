'use client';

import { useItineraryStore } from 'store/useItineraryStore';
import { useUser } from '@/components/providers/UserContext';
import { getStandardizedPrice } from "@/lib/utils/price-translator";
import { Receipt, ShieldCheck, Sparkles, DollarSign } from 'lucide-react';

export const FinalCostBreakdown = () => {
  const items = useItineraryStore((state) => state.items);
  const { tier } = useUser();
  const getCostBreakdown = useItineraryStore((state) => state.getCostBreakdown);
  
  const { parkFees, accommodation, vat, grandTotal } = getCostBreakdown();

  return (
    <div className="flex flex-col bg-slate-950/95 backdrop-blur-2xl rounded-3xl border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-slate-100 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Receipt size={16} className="text-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-slate-100 text-xs uppercase tracking-[0.2em]">Final Cost Breakdown</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Transparent itemized safari pricing</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl">
          {tier}
        </span>
      </div>

      {/* Itemized List */}
      <div className="space-y-3 max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
        {items.length > 0 ? (
          items.map((item) => {
            const itemPrice = getStandardizedPrice(item.basePrice ?? item.base_price, tier, item.selectedRoomType);
            return (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-200 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-amber-400 uppercase tracking-wider font-extrabold">{item.type}</span>
                    {item.selectedRoomType && (
                      <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-md">{item.selectedRoomType}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-black text-slate-100 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 flex-shrink-0">
                  ${(itemPrice || 0).toLocaleString()}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs italic">
            No items added to your itinerary timeline yet.
          </div>
        )}
      </div>

      {/* Summary Metrics */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Park Fees Subtotal</span>
          <span className="font-bold text-slate-200">${parkFees.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Accommodation Subtotal</span>
          <span className="font-bold text-slate-200">${accommodation.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Taxes & VAT (18%)</span>
          <span className="font-bold text-slate-200">${vat.toLocaleString()}</span>
        </div>
      </div>

      {/* Grand Total Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-amber-400" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-200">Grand Total</span>
        </div>
        <span className="text-xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          ${grandTotal.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
        <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
        <span>Secure booking guaranteed. Instant confirmation upon deposit.</span>
      </div>

    </div>
  );
};

export default FinalCostBreakdown;