// components/itinerary/DayCard.tsx
'use client';

import { useTransition, useMemo, memo, useState } from 'react';
import { updateItineraryItemDay } from '@/actions/itineraryActions';
import { PricingEngine } from "@/lib/utils/PricingEngine";
import { ResidencyTier } from "@/lib/types/TariffParkFees";
import { Sun, Coffee, Moon, Trash2, X, Plus, MapPin, Sparkles, Compass } from 'lucide-react';
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';
import { useItineraryStore } from '@/store/useItineraryStore';
import AfterHoursPickerModal from './AfterHoursPickerModal';
import { AfterHoursVenue } from '@/lib/constants/index';

interface SlotRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slot: any;
  guests: { adults: number; children: number };
  tier: ResidencyTier;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemove: () => void;
  isEvening?: boolean;
  afterHoursVenue?: AfterHoursVenue | null;
  onOpenAfterHoursModal?: () => void;
  onRemoveAfterHours?: () => void;
}

interface DayCardProps {
  day: Day;
  onMoveItem: (dayId: string, slotId: string, item: ItineraryItem) => void;
  onRemoveItem: (dayId: string, slotId: string) => void;
  onDeleteDay: (dayId: string) => void;
  residencyTier?: ResidencyTier;
  guests?: { adults: number; children: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setGuests?: any;
}

const SlotRenderer = memo(function SlotRenderer({ 
  slot, guests, tier, onDrop, onRemove, isEvening, afterHoursVenue, onOpenAfterHoursModal, onRemoveAfterHours 
}: SlotRendererProps) {
  const safeAdults = guests?.adults ?? 1;
  const safeChildren = guests?.children ?? 0;

  const fee = useMemo(() => {
    if (!slot.item) return null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const calculated: any = PricingEngine.calculate(slot.item, { 
        tier, 
        duration: 1, 
        adults: safeAdults, 
        children: safeChildren, 
        date: new Date().toISOString() 
      });

      if (calculated && calculated.total !== undefined && calculated.total > 0) {
        return calculated;
      }

      if (slot.item.price !== undefined && slot.item.price > 0) {
        return {
          total: slot.item.price,
          currency: slot.item.currency || 'USD',
          label: slot.item.name
        };
      }

      return calculated || null;
    } catch (e) {
      console.error("Pricing error:", e);
      if (slot.item.price !== undefined && slot.item.price > 0) {
        return {
          total: slot.item.price,
          currency: slot.item.currency || 'USD',
          label: slot.item.name
        };
      }
      return null;
    }
  }, [slot.item, safeAdults, safeChildren, tier]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractPriceNumber = (p: any): number => {
    if (typeof p === 'number') return p;
    if (p && typeof p === 'object') {
      return Number(p.amount ?? p.price ?? p.total ?? 0);
    }
    return Number(p) || 0;
  };

  const rawAfterHoursPrice = extractPriceNumber(afterHoursVenue?.price);
  const calculatedAfterHoursTotal = rawAfterHoursPrice > 0 ? rawAfterHoursPrice * (safeAdults + (safeChildren * 0.5)) : 0;

  const itemCategoryType = String(slot.item?.type || slot.item?.category || 'Experience').toUpperCase();
  const itemNameDisplay = fee?.label || slot.item?.name || slot.item?.title || 'Selected Experience';

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

      <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border w-full shrink-0 ${config.badgeBg} backdrop-blur-md`}>
        <div className="flex items-center gap-1.5 min-w-0">
          {config.icon}
          <span className="text-[9px] font-black uppercase tracking-widest truncate">
            {config.label}
          </span>
        </div>
      </div>
      
      {!slot.item ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 group-hover/slot:text-amber-300 transition-colors py-4 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 flex items-center justify-center mb-1.5 group-hover/slot:border-amber-400/40 group-hover/slot:bg-amber-400/10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <Plus size={14} className="stroke-[2.5] transition-transform group-hover/slot:rotate-90 duration-300 text-amber-400/70 group-hover/slot:text-amber-300" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/slot:text-amber-200 text-center">Drop Experience</span>
        </div>
      ) : (
        <div className="relative z-10 bg-gradient-to-b from-slate-950/95 to-slate-900/90 p-3 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-white/[0.08] w-full animate-in fade-in duration-500 my-auto flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[8px] tracking-wider uppercase font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {itemCategoryType}
            </span>

            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }} 
              className="p-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg z-20"
              title="Remove item"
            >
              <Trash2 size={12} className="stroke-[2.2]" />
            </button>
          </div>

          <div className="flex items-start gap-1.5 min-w-0 pr-1">
            <div className="w-5 h-5 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
              <Compass size={11} className="text-amber-400" />
            </div>
            <p className="font-bold text-slate-100 text-[11px] leading-snug break-words tracking-wide line-clamp-2">
              {itemNameDisplay}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-wider font-extrabold text-slate-400">Total Investment</span>
              <span className="text-[11px] font-black text-amber-400 tracking-wider">
                {fee && fee.total !== undefined && fee.total > 0 ? `${fee.currency || 'USD'} ${fee.total.toLocaleString()}` : (slot.item.price ? `USD ${slot.item.price.toLocaleString()}` : "Complimentary")}
              </span>
            </div>
            
            {fee && (
              <div className="text-[7px] text-slate-300 flex justify-between items-center bg-slate-900/90 px-2 py-1 rounded-lg border border-white/5 shadow-inner">
                <span className="font-medium">{safeAdults} ADL {safeChildren > 0 ? `+ ${safeChildren} CHD` : ''}</span>
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

      {/* Embedded After Hours Sub-section inside Evening Slot */}
      {isEvening && (
        <div className="mt-3 pt-2.5 border-t border-white/[0.08] relative z-10 w-full">
          {afterHoursVenue ? (
            <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-3 flex flex-col gap-2 text-[10px] animate-in fade-in duration-300 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-amber-300/95 truncate">
                    {afterHoursVenue.category || 'Nightlife'} • After Dark
                  </span>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onOpenAfterHoursModal?.(); }}
                    className="text-[9px] text-amber-300 hover:text-white underline font-semibold px-1 py-0.5 cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemoveAfterHours?.(); }}
                    className="p-1 rounded-lg bg-slate-900 border border-white/15 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer z-30"
                    title="Remove After Hours Experience"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-white font-bold text-[10px] truncate tracking-wide">
                  {afterHoursVenue.name}
                </p>
                {calculatedAfterHoursTotal > 0 && (
                  <p className="text-[9px] text-amber-400 font-extrabold mt-0.5">
                    USD {calculatedAfterHoursTotal.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenAfterHoursModal?.(); }}
              className="w-full py-2 px-2.5 border border-dashed border-amber-400/30 hover:border-amber-400/60 rounded-xl text-amber-300/80 hover:text-amber-300 text-[9px] font-bold transition-all flex items-center justify-center gap-1.5 group bg-slate-950/40 hover:bg-amber-400/[0.04] shadow-inner cursor-pointer"
            >
              <span className="text-xs group-hover:scale-125 transition-transform duration-300">✨</span>
              <span className="tracking-wider uppercase text-[8px]">Add After Hours / Bush Party</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

SlotRenderer.displayName = 'SlotRenderer';

function DayCard({ 
  day, onMoveItem, onRemoveItem, onDeleteDay, residencyTier = 'INTERNATIONAL', guests = { adults: 1, children: 0 } 
}: DayCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isAfterHoursModalOpen, setIsAfterHoursModalOpen] = useState(false);
  
  const safeAdults = guests?.adults ?? 1;
  const safeChildren = guests?.children ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeItems = useItineraryStore((state: any) => state.items);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterHoursItems = useItineraryStore((state: any) => state.afterHoursItems);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addItemToStore = useItineraryStore((state: any) => state.addItem);

  // Directly derive the active after-hours venue for this specific day from the store
  const afterHoursVenue = useMemo(() => {
    // 1. Check dedicated afterHoursItems store state
    if (afterHoursItems && Array.isArray(afterHoursItems)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchedAh = afterHoursItems.find((i: any) => {
        const matchesDayNum = Number(i.day ?? i.dayId ?? 1) === Number(day.day_number);
        const matchesDayId = String(i.dayId || '') === String(day.id);
        return matchesDayNum || matchesDayId;
      });

      if (matchedAh) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawImg = (matchedAh as any).image || (matchedAh as any).img || '';
        return {
          id: matchedAh.originalId || matchedAh.id,
          name: matchedAh.name || matchedAh.title || 'Selected Venue',
          category: matchedAh.category || matchedAh.type || 'Nightlife',
          price: matchedAh.basePrice || matchedAh.price || matchedAh.cost || 0,
          perks: matchedAh.perks || [],
          description: matchedAh.description || '',
          image: typeof rawImg === 'string' ? rawImg : (rawImg?.url || ''),
          location: matchedAh.location || ''
        } as unknown as AfterHoursVenue;
      }
    }

    // 2. Fallback check inside main items array for items tagged as isAfterHours
    if (storeItems && Array.isArray(storeItems)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchedMainAh = storeItems.find((i: any) => {
        if (!i.isAfterHours) return false;
        const matchesDayNum = Number(i.day ?? i.dayId ?? 1) === Number(day.day_number);
        const matchesDayId = String(i.dayId || '') === String(day.id);
        return matchesDayNum || matchesDayId;
      });

      if (matchedMainAh) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawImg = (matchedMainAh as any).image || (matchedMainAh as any).img || '';
        return {
          id: matchedMainAh.originalId || matchedMainAh.id,
          name: matchedMainAh.name || matchedMainAh.title || 'Selected Venue',
          category: matchedMainAh.category || matchedMainAh.type || 'Nightlife',
          price: matchedMainAh.basePrice || matchedMainAh.price || matchedMainAh.cost || 0,
          perks: matchedMainAh.perks || [],
          description: matchedMainAh.description || '',
          image: typeof rawImg === 'string' ? rawImg : (rawImg?.url || ''),
          location: matchedMainAh.location || ''
        } as unknown as AfterHoursVenue;
      }
    }

    return null;
  }, [afterHoursItems, storeItems, day.day_number, day.id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const synchronizedSlots: any[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (day.slots || []).map((slot: any) => {
      let activeItem = slot.item || null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchedStoreItem = (storeItems || []).find((i: any) => {
        if (i.isAfterHours) return false;
        const matchesDay = Number(i.day ?? i.dayId ?? 1) === Number(day.day_number) || String(i.dayId) === String(day.id);
        const matchesSlotId = Boolean(i.slotId && slot.id && String(i.slotId) === String(slot.id));
        const matchesSlotType = Boolean(
          i.slot && slot.type && 
          String(i.slot).toUpperCase() === String(slot.type).toUpperCase() &&
          (!i.slotId || i.slotId === slot.id)
        );
        
        return matchesDay && (matchesSlotId || matchesSlotType);
      });
      
      let finalItem = matchedStoreItem || activeItem || null;

      return {
        ...slot,
        item: finalItem
      };
    });
  }, [day.slots, day.day_number, day.id, storeItems]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotId: string, slotType: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const droppedItem: ItineraryItem = JSON.parse(data);
      
      let calculatedPrice = droppedItem.price ?? 0;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const calculated: any = PricingEngine.calculate(droppedItem, { 
          tier: residencyTier, 
          duration: 1, 
          adults: safeAdults, 
          children: safeChildren, 
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

      if (typeof addItemToStore === 'function') {
        const fullStoreItem = {
          ...droppedItem,
          id: droppedItem.id || `item-${Date.now()}`,
          originalId: droppedItem.id,
          price: calculatedPrice,
          cost: calculatedPrice,
          amount: calculatedPrice,
          slotId: slotId,
          slot: slotType,
          timeSlot: slotType,
          day: Number(day.day_number) || 1,
          dayId: day.id
        } as unknown as ItineraryItem;
        addItemToStore(fullStoreItem);
      }
      
      startTransition(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void (updateItineraryItemDay as any)(droppedItem.id, day.id, slotId);
      });
    } catch (err) {
      console.error("Failed to process drop:", err);
    }
  };

  const handleRemove = (slotId: string, slotType: string, item?: ItineraryItem | null) => {
    onRemoveItem(day.id, slotId);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useItineraryStore.getState();
    const currentItems = state.items || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedItems = currentItems.filter((i: any) => {
      if (i.isAfterHours) return true;
      const matchesDay = Number(i.day ?? i.dayId ?? 1) === Number(day.day_number) || String(i.dayId) === String(day.id);
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
    } else if (typeof state.set === 'function') {
      state.set({ items: updatedItems });
    }

    const itemName = item?.name || "Item";
    const event = new CustomEvent('show-toast', { 
      detail: { message: `Successfully removed ${itemName} from itinerary timeline.` } 
    });
    window.dispatchEvent(event);

    if (item?.id) {
      startTransition(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void (updateItineraryItemDay as any)(item.id, "", slotId);
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractPriceNumber = (p: any): number => {
    if (typeof p === 'number') return p;
    if (p && typeof p === 'object') {
      return Number(p.amount ?? p.price ?? p.total ?? 0);
    }
    return Number(p) || 0;
  };

  const handleAttachAfterHours = (venue: AfterHoursVenue) => {
    const baseVenuePrice = extractPriceNumber(venue.price);
    const totalVenuePrice = baseVenuePrice > 0 ? baseVenuePrice * (safeAdults + (safeChildren * 0.5)) : 50;

    const afterHoursUniqueId = `after-hours-${venue.id}-${day.day_number}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useItineraryStore.getState();
    const currentAfterHours = state.afterHoursItems || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredAfterHours = currentAfterHours.filter((i: any) => Number(i.day ?? i.dayId ?? 1) !== Number(day.day_number) && String(i.dayId) !== String(day.id));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const venueImg = (venue as any).image || (venue as any).img || '';
    const exactVenueName = venue.name || 'After Hours Experience';

    const afterHoursPayload = {
      id: afterHoursUniqueId,
      originalId: venue.id,
      name: exactVenueName,
      price: totalVenuePrice,
      cost: totalVenuePrice,
      amount: totalVenuePrice,
      currency: 'USD',
      slotId: `after-hours-${day.id}`,
      slot: 'EVENING',
      timeSlot: 'EVENING',
      day: Number(day.day_number) || 1,
      dayId: day.id,
      isAfterHours: true,
      category: venue.category || 'Nightlife',
      basePrice: baseVenuePrice,
      perks: venue.perks,
      description: venue.description,
      image: typeof venueImg === 'string' ? venueImg : (venueImg?.url || ''),
      location: venue.location
    };

    const newAfterHoursList = [...filteredAfterHours, afterHoursPayload];

    // Update Zustand afterHoursItems store state
    if (typeof state.setAfterHoursItems === 'function') {
      state.setAfterHoursItems(newAfterHoursList);
    }

    // CRITICAL FIX: Also push the payload directly into the main store `items` array so the global checkout pricing engine picks it up instantly
    const currentItems = state.items || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredItems = currentItems.filter((i: any) => !(i.isAfterHours && (Number(i.day ?? i.dayId ?? 1) === Number(day.day_number) || String(i.dayId) === String(day.id))));
    const newItemsList = [...filteredItems, afterHoursPayload];

    if (typeof state.setItems === 'function') {
      state.setItems(newItemsList);
    }

    // Also call addItemToStore if available
    if (typeof addItemToStore === 'function') {
      try {
        addItemToStore(afterHoursPayload, Number(day.day_number) || 1, 'EVENING');
      } catch (err) {
        console.error("addItemToStore error:", err);
      }
    }

    // Fallback Zustand generic setter
    if (typeof state.set === 'function') {
      state.set({ 
        afterHoursItems: newAfterHoursList,
        items: newItemsList 
      });
    }

    const event = new CustomEvent('show-toast', { 
      detail: { message: `Attached ${exactVenueName} to Day ${day.day_number} After Hours and added to total.` } 
    });
    window.dispatchEvent(event);
  };

  const handleRemoveAfterHours = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useItineraryStore.getState();
    
    // 1. Clear from afterHoursItems array
    const currentAfterHours = state.afterHoursItems || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedAfterHours = currentAfterHours.filter((i: any) => Number(i.day ?? i.dayId ?? 1) !== Number(day.day_number) && String(i.dayId) !== String(day.id));
    if (typeof state.setAfterHoursItems === 'function') {
      state.setAfterHoursItems(updatedAfterHours);
    }

    // 2. Clear from main items array
    const currentItems = state.items || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedItems = currentItems.filter((i: any) => {
      if (!i.isAfterHours) return true;
      const isSameDayNum = Number(i.day ?? i.dayId ?? 1) === Number(day.day_number);
      const isSameDayId = String(i.dayId || '') === String(day.id);
      return !(isSameDayNum || isSameDayId);
    });
    if (typeof state.setItems === 'function') {
      state.setItems(updatedItems);
    }

    if (typeof state.removeItem === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const targetAh = currentAfterHours.find((i: any) => Number(i.day ?? i.dayId ?? 1) === Number(day.day_number) || String(i.dayId) === String(day.id));
      if (targetAh?.id) {
        try { state.removeItem(targetAh.id); } catch { /* ignore */ }
      }
    }

    if (typeof state.set === 'function') {
      state.set({ 
        afterHoursItems: updatedAfterHours,
        items: updatedItems 
      });
    }

    const event = new CustomEvent('show-toast', { 
      detail: { message: `Removed After Hours experience from Day ${day.day_number} and updated total.` } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="group relative bg-gradient-to-br from-[#0B132B]/95 via-[#070D1F]/98 to-[#040814] backdrop-blur-3xl p-5 sm:p-6 rounded-[2.5rem] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500 hover:border-amber-400/40 hover:shadow-[0_40px_90px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.08)] text-slate-100">
      
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
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {synchronizedSlots.map((slot: any) => {
          const isEveningSlot = String(slot.type || '').toUpperCase() === 'EVENING';
          return (
            <SlotRenderer 
              key={slot.id}
              slot={slot}
              guests={{ adults: safeAdults, children: safeChildren }}
              tier={residencyTier}
              onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, slot.id, slot.type)}
              onRemove={() => handleRemove(slot.id, slot.type, slot.item ?? null)}
              isEvening={isEveningSlot}
              afterHoursVenue={isEveningSlot ? afterHoursVenue : null}
              onOpenAfterHoursModal={() => setIsAfterHoursModalOpen(true)}
              onRemoveAfterHours={handleRemoveAfterHours}
            />
          );
        })}
      </div>

      <AfterHoursPickerModal
        isOpen={isAfterHoursModalOpen}
        onClose={() => setIsAfterHoursModalOpen(false)}
        onSelect={(venue: AfterHoursVenue) => {
          handleAttachAfterHours(venue);
          setIsAfterHoursModalOpen(false);
        }}
        residencyTier={residencyTier}
      />

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