import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResidencyTier, RESIDENCY_TIER } from '@/lib/constants/residency';
import { getStandardizedPrice } from '@/lib/utils/price-translator';

export type SlotType = 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface TariffMap {
  [key: string]: number | any;
}

export interface ItineraryItem {
  readonly id: string;
  readonly originalId: string;
  readonly name: string;
  readonly type: 'parks' | 'lodges' | 'transfers' | 'treks' | 'activities' | 'car';
  readonly basePrice: TariffMap | number;
  readonly base_price?: TariffMap | number;
  readonly price: number;
  readonly selectedRoomType?: string;
  readonly dayId?: number;
  readonly timeSlot?: SlotType;
}

export interface ItineraryState {
  readonly version: number;
  readonly items: readonly ItineraryItem[];
  readonly tier: ResidencyTier;
  readonly totalDays: number;
  readonly adults: number;
  readonly children: number;
  
  setTier: (tier: ResidencyTier) => void;
  setGuests: (adults: number, children: number) => void;
  addItem: (item: Omit<ItineraryItem, 'id' | 'price'> & { id?: string; price?: number }, dayId: number, timeSlot: SlotType) => void;
  removeItem: (id: string) => void;
  updateItemSlot: (itemId: string, dayId: number, timeSlot: SlotType) => void;
  updateRoomType: (itemId: string, roomType: string) => void;
  recalculatePrices: () => void;
  addDay: () => void;
  removeDay: () => void;
  
  getSlotItems: (dayId: number, timeSlot: SlotType) => ItineraryItem[];
  getCostBreakdown: () => { parkFees: number; accommodation: number; vat: number; grandTotal: number };
  reset: () => void;
}

const CURRENT_STORE_VERSION = 13; // Bumped version to invalidate old stale cache

const resolvePrice = (item: any, tier: ResidencyTier, adults: number = 1, children: number = 0): number => {
  const rawPriceSource = item.basePrice ?? item.base_price ?? item.price ?? 0;
  let unitPrice = 0;

  if (typeof item.price === 'number' && item.price > 0 && !item.basePrice && !item.base_price) {
    unitPrice = item.price;
  } else {
    const calculated = getStandardizedPrice(rawPriceSource, tier, item.selectedRoomType);
    if (typeof calculated === 'number' && !isNaN(calculated) && calculated > 0) {
      unitPrice = calculated;
    } else if (typeof rawPriceSource === 'number') {
      unitPrice = rawPriceSource;
    } else if (rawPriceSource && typeof rawPriceSource === 'object') {
      unitPrice = rawPriceSource[tier] || rawPriceSource['INTERNATIONAL'] || rawPriceSource.price || 165;
    } else {
      unitPrice = 165;
    }
  }

  const effectiveGuests = Math.max(1, adults) + (Math.max(0, children) * 0.5); 
  return Math.round(unitPrice * effectiveGuests);
};

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      version: CURRENT_STORE_VERSION,
      items: [],
      tier: RESIDENCY_TIER.INTERNATIONAL,
      totalDays: 5,
      adults: 1, 
      children: 0,

      setTier: (tier) => {
        set({ tier });
        get().recalculatePrices();
      },

      setGuests: (adults, children) => {
        const newAdults = Math.max(1, adults);
        const newChildren = Math.max(0, children);
        set({ adults: newAdults, children: newChildren });
        get().recalculatePrices();
      },

      recalculatePrices: () => set((state) => ({
        items: state.items.map(i => ({
          ...i,
          price: resolvePrice(i, state.tier, state.adults, state.children)
        }))
      })),

      addItem: (item, dayId, timeSlot) => set((state) => {
        const resolvedPrice = resolvePrice(item, state.tier, state.adults, state.children);
        const uniqueId = `item-${dayId}-${timeSlot}-${item.originalId || item.id || Date.now()}`;
        
        const newItem: ItineraryItem = {
          ...item,
          id: uniqueId,
          originalId: item.originalId || item.id || '',
          dayId,
          timeSlot,
          price: resolvedPrice,
          basePrice: item.basePrice ?? resolvedPrice,
        };

        const filteredItems = state.items.filter(
          (i) => !(i.dayId === dayId && i.timeSlot === timeSlot)
        );

        return {
          items: [...filteredItems, newItem]
        };
      }),

      removeItem: (id) => set((state) => {
        const updatedItems = state.items.filter((i) => i.id !== id && i.originalId !== id);
        return { items: updatedItems };
      }),

      updateItemSlot: (itemId, dayId, timeSlot) => set((state) => ({
        items: state.items.map((i) => (i.id === itemId || i.originalId === itemId) ? { ...i, dayId, timeSlot } : i)
      })),

      updateRoomType: (itemId, selectedRoomType) => set((state) => ({
        items: state.items.map((i) => {
          if (i.id !== itemId && i.originalId !== itemId) return i;
          const updatedItem = { ...i, selectedRoomType };
          return {
            ...updatedItem,
            price: resolvePrice(updatedItem, state.tier, state.adults, state.children)
          };
        })
      })),

      addDay: () => set((state) => ({ totalDays: state.totalDays + 1 })),
      removeDay: () => set((state) => {
        const newTotalDays = Math.max(1, state.totalDays - 1);
        const cleanedItems = state.items.filter(i => (i.dayId ?? 1) <= newTotalDays);
        return { totalDays: newTotalDays, items: cleanedItems };
      }),

      getSlotItems: (dayId, timeSlot) => 
        get().items.filter(i => i.dayId === dayId && i.timeSlot === timeSlot),

      getCostBreakdown: () => {
        const state = get();
        const items = state.items || [];
        
        const processedLodgeNights = new Set<string>();
        let accommodation = 0;

        items.forEach(i => {
          if (i.type === 'lodges') {
            const lodgeIdentifier = i.originalId || i.id;
            const nightKey = `${i.dayId}-${lodgeIdentifier}`;
            
            if (!processedLodgeNights.has(nightKey)) {
              processedLodgeNights.add(nightKey);
              accommodation += (Number(i.price) || 0);
            }
          }
        });

        const parkFees = items.filter(i => i.type === 'parks').reduce((a, b) => a + (Number(b.price) || 0), 0);
        
        const nonLodgeItemsTotal = items
          .filter(i => i.type !== 'lodges')
          .reduce((acc, i) => acc + (Number(i.price) || 0), 0);

        const baseTotal = accommodation + nonLodgeItemsTotal;
        const vat = Math.round(baseTotal * 0.18);
        
        return { parkFees, accommodation, vat, grandTotal: baseTotal + vat };
      },

      reset: () => set({ items: [], tier: RESIDENCY_TIER.INTERNATIONAL, totalDays: 5, adults: 1, children: 0 })
    }),
    { 
      name: 'itinerary-storage',
      storage: createJSONStorage(() => localStorage),
      version: CURRENT_STORE_VERSION,
      merge: (persistedState: any, currentState) => {
        if (!persistedState || persistedState.version !== CURRENT_STORE_VERSION) {
          return currentState;
        }

        const totalDays = persistedState.totalDays || currentState.totalDays;
        const validItems = Array.isArray(persistedState.items)
          ? persistedState.items.filter((i: any) => 
              i && 
              typeof i.dayId === 'number' && 
              i.dayId <= totalDays &&
              i.timeSlot && 
              Number(i.price) > 0
            )
          : [];

        return {
          ...currentState,
          ...persistedState,
          adults: Math.max(1, persistedState.adults || 1),
          items: validItems,
        };
      },
      partialize: (state) => ({ 
        version: state.version,
        items: state.items, 
        tier: state.tier, 
        totalDays: state.totalDays, 
        adults: state.adults, 
        children: state.children 
      })
    }
  )
);