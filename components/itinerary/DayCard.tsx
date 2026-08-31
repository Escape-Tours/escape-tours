// components/itinerary/DayCard.tsx
'use client';

import { useTransition, useMemo, memo } from 'react';
import { updateItineraryItemDay } from '@/actions/itineraryActions';
import { PricingEngine } from "@/lib/utils/PricingEngine";
import { ResidencyTier } from "@/lib/types/TariffParkFees";
import { Sun, Coffee, Moon, Trash2, X, Plus, MapPin, Sparkles, Compass } from 'lucide-react';
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';
import { useItineraryStore } from 'store/useItineraryStore';

interface DayCardProps {
  day: Day;
  onMoveItem: (dayId: string, slotId: string, item: ItineraryItem) => void;
  onRemoveItem: (dayId: string, slotId: string) => void;
  onDeleteDay: (dayId: string) => void;
  residencyTier?: ResidencyTier;
  guests: { adults: number; children: number };
  setGuests: React.Dispatch<React.SetStateAction<{ adults: number; children: number }>>;
}

const SlotRenderer = memo(function SlotRenderer({ slot, guests, tier, onDrop, onRemove }: any) {
  const fee = useMemo(() => {
    if (!slot.item) return null;
    try {
      const calculated = PricingEngine.calculate(slot.item, { 
        tier, 
        duration: 1, 
        adults: guests.adults, 
        children: guests.children, 
        date: new Date().toISOString() 
      });

      if (calculated && calculated.total !== undefined && calculated.total > 0) {
        return calculated;
      }

      if (slot.item.price !== undefined && slot.item.price > 0) {
        return {
          total: slot.item.price * (guests.adults + (guests.children * 0.5)),
          currency: slot.item.currency || 'USD',
          label: slot.item.name
        };
      }

      return calculated;
    } catch (e) {
      console.error("Pricing error:", e);
      if (slot.item.price !== undefined && slot.item.price > 0) {
        return {
          total: slot.item.price * (guests.adults + (guests.children * 0.5)),
          currency: slot.item.currency || 'USD',
          label: slot.item.name
        };
      }
      return null;
    }
  }, [slot.item, guests, tier]);

  const getSlotConfig = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MORNING':
        return {
          icon: <Sun size={13} className="text-amber-300 shrink-0" />,
          label: 'Morning',
          badgeBg: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border-amber-400/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
        };
      case 'AFTERNOON':
        return {
          icon: <Coffee size={13} className="text-orange-300 shrink-0" />,
          label: 'Afternoon',
          badgeBg: 'bg-gradient-to-r from-orange-500/15 to-amber-500/15 border-orange-400/30 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
        };
      default:
        return {
          icon: <Moon size={13} className="text-indigo-300 shrink-0" />,
          label: 'Evening',
          badgeBg: 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border-indigo-400/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.1)]',
        };
    }
  };

  const config = getSlotConfig(slot.type);

  return (
    <div 
      onDragOver={(e) => e.preventDefault()} 
      onDrop={onDrop} 
      className={`group/slot relative min-h-[260px] border rounded-[1.75rem] p-3 flex flex-col justify-between transition-all duration-500 backdrop-blur-2xl w-full overflow-hidden shadow-2xl
        ${slot.item 
          ? 'border-amber-400/30 bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-[#0A0F1D] shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]' 
          : 'border-white/[0.08] bg-slate-950/50 hover:border-amber-400/40 hover:bg-slate-900/70 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/[0.04] via-transparent to-amber-500/[0.02] opacity-0 group-hover/slot:opacity-100 transition-opacity pointer-events-none" />

      {/* Header Badge */}
      <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border w-full shrink-0 ${config.badgeBg} backdrop-blur-md`}>
        <div className="flex items-center gap-1.5 min-w-0">
          {config.icon}
          <span className="text-[9px] font-black uppercase tracking-widest truncate">
            {config.label}
          </span>
        </div>
      </div>
      
      {/* Content State */}
      {!slot.item ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 group-hover/slot:text-amber-300 transition-colors py-4 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 flex items-center justify-center mb-1.5 group-hover/slot:border-amber-400/40 group-hover/slot:bg-amber-400/10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <Plus size={14} className="stroke-[2.5] transition-transform group-hover/slot:rotate-90 duration-300 text-amber-400/70 group-hover/slot:text-amber-300" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/slot:text-amber-200 text-center">Drop Experience</span>
        </div>
      ) : (
        <div className="relative z-10 bg-gradient-to-b from-slate-950/95 to-slate-900/90 p-2.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-white/[0.08] w-full animate-in fade-in duration-500 my-auto flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 min-w-0 pr-6">
              <div className="w-5 h-5 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                <Compass size={11} className="text-amber-400" />
              </div>
              <p className="font-bold text-slate-100 text-[10px] leading-snug break-words tracking-wide">
                {fee?.label || slot.item.name}
              </p>
            </div>

            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }} 
              className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg z-20"
              title="Remove item"
            >
              <Trash2 size={12} className="stroke-[2.2]" />
            </button>
          </div>
          
          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-wider font-extrabold text-slate-400">Total Investment</span>
              <span className="text-[10px] font-black text-amber-400 tracking-wider">
                {fee && fee.total > 0 ? `${fee.currency || 'USD'} ${fee.total.toLocaleString()}` : (slot.item.price ? `USD ${slot.item.price}` : "Complimentary")}
              </span>
            </div>
            
            {fee && (
              <div className="text-[7px] text-slate-300 flex justify-between items-center bg-slate-900/90 px-2 py-1 rounded-lg border border-white/5 shadow-inner">
                <span className="font-medium">{guests.adults} ADL {guests.children > 0 ? `+ ${guests.children} CHD` : ''}</span>
                <span className="text-amber-300 font-bold uppercase tracking-wider bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">Tier Verified</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-[0.15em] font-black px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-400/15 to-yellow-500/15 text-amber-300 border border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                Curated & Secured
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

function DayCard({ 
  day, onMoveItem, onRemoveItem, onDeleteDay, residencyTier = 'INTERNATIONAL', guests, setGuests 
}: DayCardProps) {
  const [isPending, startTransition] = useTransition();
  
  const storeItems = useItineraryStore((state) => state.items);
  const addItemToStore = useItineraryStore((state) => state.addItem);

  const synchronizedSlots = useMemo(() => {
    return day.slots.map(slot => {
      const matchedStoreItem = storeItems.find((i: any) => {
        const matchesDay = Number(i.day ?? i.dayId) === Number(day.day_number);
        const matchesSlotType = String(i.timeSlot || i.slot || '').toUpperCase() === String(slot.type).toUpperCase();
        const matchesSlotId = String(i.slotId || '') === String(slot.id);
        return matchesDay && (matchesSlotType || matchesSlotId);
      });
      
      return {
        ...slot,
        item: matchedStoreItem || slot.item || null
      };
    });
  }, [day.slots, day.day_number, storeItems]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotId: string, slotType: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const droppedItem: ItineraryItem = JSON.parse(data);
      
      let calculatedPrice = droppedItem.price ?? 0;
      try {
        const calculated = PricingEngine.calculate(droppedItem, { 
          tier: residencyTier, 
          duration: 1, 
          adults: guests.adults, 
          children: guests.children, 
          date: new Date().toISOString() 
        });
        if (calculated?.total !== undefined && calculated.total > 0) {
          calculatedPrice = calculated.total;
        } else if (droppedItem.price && droppedItem.price > 0) {
          calculatedPrice = droppedItem.price;
        }
      } catch (err) {
        console.error("Store pricing calculation error:", err);
        calculatedPrice = droppedItem.price ?? 0;
      }

      onMoveItem(day.id, slotId, droppedItem);

      // Fix applied here: Passed `day.id` and `slotId` as the 2nd and 3rd arguments
      addItemToStore({
        ...droppedItem,
        id: droppedItem.id,
        originalId: droppedItem.id,
        price: calculatedPrice,
        slotId: slotId,
        slot: slotType,
        timeSlot: slotType,
        day: Number(day.day_number) || 1,
        dayId: day.id
      }, day.id, slotId);
      
      startTransition(async () => {
        await updateItineraryItemDay(droppedItem.id, day.id, slotId).catch(console.error);
      });
    } catch (err) {
      console.error("Failed to process drop:", err);
    }
  };

  const handleRemove = (slotId: string, slotType: string, item?: ItineraryItem | null) => {
    onRemoveItem(day.id, slotId);
    
    const state = useItineraryStore.getState();
    const currentItems = state.items || [];
    const updatedItems = currentItems.filter((i: any) => {
      const matchesDay = Number(i.day ?? i.dayId ?? 1) === Number(day.day_number);
      const matchesSlot = String(i.slot || i.timeSlot || '').toUpperCase() === String(slotType).toUpperCase();
      const matchesSlotId = String(i.slotId || '') === String(slotId);
      
      if (matchesDay && (matchesSlot || matchesSlotId)) {
        return false;
      }
      if (item?.id && (i.id === item.id || i.originalId === item.id) && matchesDay) {
        return false;
      }
      return true;
    });

    if (typeof state.setItems === 'function') {
      state.setItems(updatedItems);
    }

    const itemName = item?.name || "Item";
    const event = new CustomEvent('show-toast', { 
      detail: { message: `Successfully removed ${itemName} from itinerary timeline.` } 
    });
    window.dispatchEvent(event);

    if (item?.id) {
      startTransition(async () => {
        await updateItineraryItemDay(item.id, "", slotId).catch(console.error);
      });
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-[#0B132B]/95 via-[#070D1F]/98 to-[#040814] backdrop-blur-3xl p-5 sm:p-6 rounded-[2.5rem] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500 hover:border-amber-400/40 hover:shadow-[0_40px_90px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.08)] text-slate-100">
      
      {/* Luxurious Background Glow */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-72 h-72 bg-gradient-to-br from-amber-400/10 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-amber-400/20 transition-all duration-700" />

      <button 
        type="button"
        onClick={() => onDeleteDay(day.id)}
        className="absolute top-5 right-5 p-2.5 rounded-2xl bg-slate-900/90 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/30 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-20 backdrop-blur-xl cursor-pointer"
        title="Remove Day"
      >
        <X size={15} className="transition-transform group-hover:rotate-90 duration-300" />
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10 pr-10">
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-1.5 border border-amber-200/50">
            <Sparkles size={13} className="fill-slate-950" />
            DAY {day.day_number}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-amber-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <MapPin size={13} className="animate-bounce text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider truncate max-w-[140px]">{day.location || 'Excursion Sanctuary'}</span>
          </div>
        </div>
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10 w-full">
        {synchronizedSlots.map((slot) => (
          <SlotRenderer 
            key={slot.id}
            slot={slot}
            guests={guests}
            tier={residencyTier}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, slot.id, slot.type)}
            onRemove={() => handleRemove(slot.id, slot.type, slot.item ?? null)}
          />
        ))}
      </div>

      {isPending && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-30 transition-opacity rounded-[2.5rem]">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-amber-400/40 text-amber-300 text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_10px_rgba(245,158,11,1)]" />
            Syncing Experience...
          </div>
        </div>
      )}
    </div>
  );
}

const MemoizedDayCard = memo(DayCard);
MemoizedDayCard.displayName = 'DayCard';

export default MemoizedDayCard;