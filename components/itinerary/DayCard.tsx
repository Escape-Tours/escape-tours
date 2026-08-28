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
      return PricingEngine.calculate(slot.item, { 
        tier, 
        duration: 1, 
        adults: guests.adults, 
        children: guests.children, 
        date: new Date().toISOString() 
      });
    } catch (e) {
      console.error("Pricing error:", e);
      return null;
    }
  }, [slot.item, guests, tier]);

  const getSlotConfig = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MORNING':
        return {
          icon: <Sun size={13} className="text-amber-400 shrink-0" />,
          label: 'Morning',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        };
      case 'AFTERNOON':
        return {
          icon: <Coffee size={13} className="text-orange-400 shrink-0" />,
          label: 'Afternoon',
          badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
        };
      default:
        return {
          icon: <Moon size={13} className="text-indigo-400 shrink-0" />,
          label: 'Evening',
          badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
        };
    }
  };

  const config = getSlotConfig(slot.type);

  return (
    <div 
      onDragOver={(e) => e.preventDefault()} 
      onDrop={onDrop} 
      className={`group/slot relative min-h-[250px] border-2 border-dashed rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl w-full overflow-hidden
        ${slot.item 
          ? 'border-amber-500/40 bg-slate-900/90 shadow-xl' 
          : 'border-white/10 bg-slate-950/40 hover:border-amber-500/50 hover:bg-slate-900/60 cursor-pointer'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/[0.03] to-amber-500/0 opacity-0 group-hover/slot:opacity-100 transition-opacity pointer-events-none" />

      {/* Header Badge */}
      <div className={`flex items-center justify-between px-2 py-1 rounded-lg border w-full shrink-0 ${config.badgeBg}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          {config.icon}
          <span className="text-[9px] font-black uppercase tracking-wider truncate">
            {config.label}
          </span>
        </div>
      </div>
      
      {/* Content State */}
      {!slot.item ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 group-hover/slot:text-amber-400 transition-colors py-4 relative z-10">
          <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-white/10 flex items-center justify-center mb-1 group-hover/slot:border-amber-500/40 group-hover/slot:bg-amber-500/10 transition-all duration-300 shadow-inner">
            <Plus size={13} className="stroke-[3] transition-transform group-hover/slot:rotate-90 duration-300" />
          </div>
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 group-hover/slot:text-amber-300 text-center">Drop</span>
        </div>
      ) : (
        <div className="relative z-10 bg-slate-950/95 p-2 rounded-xl shadow-inner border border-white/10 w-full animate-in fade-in duration-300 my-auto flex flex-col gap-2">
          <div className="flex items-start gap-1 pr-5">
            <Compass size={11} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="font-bold text-slate-100 text-[10px] leading-tight break-words">
              {fee?.label || slot.item.name}
            </p>
          </div>
          
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-wider font-extrabold text-slate-400">Total</span>
              <span className="text-[9px] font-black text-amber-400 tracking-wide">
                {fee ? `${fee.currency} ${fee.total.toLocaleString()}` : "Included"}
              </span>
            </div>
            
            {/* Live Pricing Breakdown Badge */}
            {fee && (
              <div className="text-[7px] text-slate-400 flex justify-between items-center bg-slate-900/80 px-1.5 py-0.5 rounded border border-white/5">
                <span>{guests.adults} ADL {guests.children > 0 ? `+ ${guests.children} CHD` : ''}</span>
                <span className="text-amber-300/80 font-semibold">Live Calc</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                Booked
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }} 
            className="absolute top-2 right-2 p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
            title="Remove item"
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}
    </div>
  );
});

function DayCard({ 
  day, onMoveItem, onRemoveItem, onDeleteDay, residencyTier = 'INTERNATIONAL', guests, setGuests 
}: DayCardProps) {
  const [isPending, startTransition] = useTransition();
  
  // Pull store items and actions directly
  const storeItems = useItineraryStore((state) => state.items);
  const addItemToStore = useItineraryStore((state) => state.addItem);
  const removeItemFromStore = useItineraryStore((state) => state.removeItem);

  // Synchronize slot contents with store state securely matching either slot id or timeSlot type
  const synchronizedSlots = useMemo(() => {
    return day.slots.map(slot => {
      const matchedStoreItem = storeItems.find((i: any) => {
        const matchesDay = Number(i.dayId) === Number(day.day_number);
        const matchesSlotType = String(i.timeSlot || '').toUpperCase() === String(slot.type).toUpperCase();
        const matchesSlotId = String(i.slotId || '') === String(slot.id);
        return matchesDay && (matchesSlotType || matchesSlotId);
      });
      
      return {
        ...slot,
        item: matchedStoreItem || slot.item || null
      };
    });
  }, [day.slots, day.day_number, storeItems]);

  const handleDrop = (e: React.DragEvent, slotId: string, slotType: string) => {
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
        if (calculated?.total) {
          calculatedPrice = calculated.total;
        }
      } catch (err) {
        console.error("Store pricing calculation error:", err);
      }

      onMoveItem(day.id, slotId, droppedItem);

      // Pass both slotId and timeSlot so the store state matches reliably
      addItemToStore(
        {
          ...droppedItem,
          id: droppedItem.id,
          originalId: droppedItem.id,
          price: calculatedPrice,
          slotId: slotId,
          timeSlot: slotType,
        } as any, 
        Number(day.day_number) || 1, 
        slotType as any
      );
      
      startTransition(async () => {
        await updateItineraryItemDay(droppedItem.id, day.id).catch(console.error);
      });
    } catch (err) {
      console.error("Failed to process drop:", err);
    }
  };

  const handleRemove = (slotId: string, item?: ItineraryItem | null) => {
    onRemoveItem(day.id, slotId);
    if (item?.id) {
      removeItemFromStore(item.id);
      startTransition(async () => {
        await updateItineraryItemDay(item.id, '').catch(console.error);
      });
    }
  };

  return (
    <div className="group relative bg-[#0B132B]/95 backdrop-blur-2xl p-4 sm:p-5 rounded-[2rem] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-500/40 text-slate-100">
      
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-500" />

      <button 
        type="button"
        onClick={() => onDeleteDay(day.id)}
        className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 backdrop-blur-md cursor-pointer"
        title="Remove Day"
      >
        <X size={14} className="transition-transform group-hover:rotate-90 duration-300" />
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 relative z-10 pr-8">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-1">
            <Sparkles size={12} className="fill-slate-950" />
            DAY {day.day_number}
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-amber-400 shadow-inner backdrop-blur-md">
            <MapPin size={12} className="animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-wider truncate max-w-[100px]">{day.location || 'Location'}</span>
          </div>
        </div>
      </div>
     
      {/* 3 columns grid utilizing synchronized slots */}
      <div className="grid grid-cols-3 gap-2.5 relative z-10 w-full">
        {synchronizedSlots.map((slot) => (
          <SlotRenderer 
            key={slot.id}
            slot={slot}
            guests={guests}
            tier={residencyTier}
            onDrop={(e: React.DragEvent) => handleDrop(e, slot.id, slot.type)}
            onRemove={() => handleRemove(slot.id, slot.item ?? null)}
          />
        ))}
      </div>

      {isPending && (
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-30 transition-opacity rounded-[2rem]">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 text-[10px] font-black tracking-widest uppercase shadow-2xl animate-pulse flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Syncing...
          </div>
        </div>
      )}
    </div>
  );
}

const MemoizedDayCard = memo(DayCard);
MemoizedDayCard.displayName = 'DayCard';

export default MemoizedDayCard;