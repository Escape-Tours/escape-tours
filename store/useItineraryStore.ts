// store/useItineraryStore.ts
'use client';

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
  readonly quantity?: number;
  readonly slots?: number;
  readonly isDeduplicated?: boolean;
}

export interface ItineraryState {
  readonly version: number;
  readonly items: readonly ItineraryItem[];
  readonly cartItems: readonly ItineraryItem[];
  readonly tier: ResidencyTier;
  readonly totalDays: number;
  readonly adults: number;
  readonly children: number;
  readonly notifications: readonly string[];
  readonly rejectedCarDays: readonly number[];
  
  setTier: (tier: ResidencyTier) => void;
  setGuests: (adults: number, children: number) => void;
  addItem: (item: Omit<ItineraryItem, 'id' | 'price'> & { id?: string; price?: number }, dayId: number, timeSlot: SlotType) => void;
  removeItem: (id: string) => void;
  updateItemSlot: (itemId: string, dayId: number, timeSlot: SlotType) => void;
  updateRoomType: (itemId: string, roomType: string) => void;
  recalculatePrices: () => void;
  addDay: () => void;
  removeDay: () => void;
  clearItinerary: () => void;
  rejectCarForDay: (dayId: number) => void;

  addCartItem: (item: Omit<ItineraryItem, 'id' | 'price'> & { id?: string; price?: number }) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  buildFromCart: (targetDayId?: number, targetSlot?: SlotType) => void;
  
  getSlotItems: (dayId: number, timeSlot: SlotType) => ItineraryItem[];
  getCostBreakdown: () => { parkFees: number; accommodation: number; transport: number; vat: number; agencyFee: number; grandTotal: number; subtotal: number; notifications: string[] };
  reset: () => void;
}

const CURRENT_STORE_VERSION = 33;
const DEFAULT_SAFARI_CAR_PRICE = 200; // Standard daily safari vehicle cost

const resolvePrice = (item: any, tier: ResidencyTier, adults: number = 1, children: number = 0): number => {
  let unitPrice = 0;
  const rawPriceSource = item?.basePrice ?? item?.base_price ?? item?.price;
  const upperTier = String(tier || 'INTERNATIONAL').toUpperCase() as ResidencyTier;

  const translated = getStandardizedPrice(rawPriceSource, upperTier, item?.selectedRoomType);
  if (typeof translated === 'number' && !isNaN(translated) && translated > 0) {
    unitPrice = translated;
  } else if (rawPriceSource && typeof rawPriceSource === 'object') {
    const directMatch = 
      (upperTier === 'CITIZEN' ? (rawPriceSource['CITIZEN'] ?? rawPriceSource['citizen'] ?? rawPriceSource['TZS'] ?? rawPriceSource['tzs'] ?? rawPriceSource['Local'] ?? rawPriceSource['local'] ?? rawPriceSource['tanzanian'] ?? rawPriceSource['Tanzanian']) : undefined) ??
      (upperTier === 'RESIDENT' ? (rawPriceSource['RESIDENT'] ?? rawPriceSource['resident'] ?? rawPriceSource['EXPAT'] ?? rawPriceSource['expat'] ?? rawPriceSource['east_african'] ?? rawPriceSource['East_African']) : undefined) ??
      (upperTier === 'INTERNATIONAL' ? (rawPriceSource['INTERNATIONAL'] ?? rawPriceSource['international'] ?? rawPriceSource['FOREIGN'] ?? rawPriceSource['foreign'] ?? rawPriceSource['USD'] ?? rawPriceSource['usd'] ?? rawPriceSource['non_resident'] ?? rawPriceSource['Non_Resident']) : undefined);

    if (typeof directMatch === 'number' && directMatch > 0) {
      unitPrice = directMatch;
    } else {
      if (upperTier === 'CITIZEN') {
        unitPrice = rawPriceSource['CITIZEN'] || rawPriceSource['citizen'] || rawPriceSource['TZS'] || rawPriceSource['tzs'] || rawPriceSource['Local'] || rawPriceSource['local'] || rawPriceSource['tanzanian'] || 5;
      } else if (upperTier === 'RESIDENT') {
        unitPrice = rawPriceSource['RESIDENT'] || rawPriceSource['resident'] || rawPriceSource['EXPAT'] || rawPriceSource['expat'] || 15;
      } else {
        unitPrice = rawPriceSource['INTERNATIONAL'] || rawPriceSource['international'] || rawPriceSource['FOREIGN'] || rawPriceSource['foreign'] || rawPriceSource['USD'] || rawPriceSource['usd'] || rawPriceSource.price || 30;
      }
    }
  } else if (typeof rawPriceSource === 'number' && rawPriceSource > 0) {
    unitPrice = rawPriceSource;
  } else if (typeof item?.price === 'number' && item.price > 0) {
    unitPrice = item.price;
  }

  if (unitPrice <= 0 || isNaN(unitPrice)) {
    if (upperTier === 'CITIZEN') unitPrice = 5;
    else if (upperTier === 'RESIDENT') unitPrice = 15;
    else unitPrice = 30;
  }

  const effectiveGuests = (item?.type === 'parks') 
    ? (Math.max(1, adults) + (Math.max(0, children) * 0.5))
    : (item?.type === 'lodges' || item?.type === 'activities' || item?.type === 'treks')
      ? (Math.max(1, adults) + (Math.max(0, children) * 0.5))
      : 1;

  const quantityMultiplier = Number(item?.quantity ?? item?.slots ?? 1);

  return Math.round(unitPrice * effectiveGuests * quantityMultiplier);
};

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      version: CURRENT_STORE_VERSION,
      items: [],
      cartItems: [],
      tier: RESIDENCY_TIER.INTERNATIONAL,
      totalDays: 5,
      adults: 1, 
      children: 0,
      notifications: [],
      rejectedCarDays: [],

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
        items: (state.items || []).map(i => ({
          ...i,
          price: resolvePrice(i, state.tier, state.adults, state.children)
        }))
      })),

      addItem: (item, dayId, timeSlot) => set((state) => {
        const resolvedPrice = resolvePrice(item, state.tier, state.adults, state.children);
        const uniqueId = `item-${dayId}-${timeSlot}-${item?.originalId || item?.id || Date.now()}`;
        
        const newItem: ItineraryItem = {
          ...item,
          id: uniqueId,
          originalId: item?.originalId || item?.id || '',
          dayId,
          timeSlot,
          price: resolvedPrice,
          basePrice: item?.basePrice ?? item?.base_price ?? item?.price ?? resolvedPrice,
        };

        const filteredItems = (state.items || []).filter(
          (i) => !(i.dayId === dayId && i.timeSlot === timeSlot)
        );

        return { items: [...filteredItems, newItem] };
      }),

      removeItem: (id) => set((state) => ({
        items: (state.items || []).filter((i) => i.id !== id && i.originalId !== id)
      })),

      updateItemSlot: (itemId, dayId, timeSlot) => set((state) => ({
        items: (state.items || []).map((i) => (i.id === itemId || i.originalId === itemId) ? { ...i, dayId, timeSlot } : i)
      })),

      updateRoomType: (itemId, selectedRoomType) => set((state) => ({
        items: (state.items || []).map((i) => {
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
        const cleanedItems = (state.items || []).filter(i => (i.dayId ?? 1) <= newTotalDays);
        return { totalDays: newTotalDays, items: cleanedItems };
      }),

      rejectCarForDay: (dayId) => set((state) => ({
        rejectedCarDays: state.rejectedCarDays.includes(dayId) ? state.rejectedCarDays : [...state.rejectedCarDays, dayId]
      })),

      clearItinerary: () => set({ items: [], notifications: [], rejectedCarDays: [] }),

      addCartItem: (item) => set((state) => {
        const resolvedPrice = resolvePrice(item, state.tier, state.adults, state.children);
        const cartId = `cart-${item?.originalId || item?.id || Date.now()}`;
        const newCartItem: ItineraryItem = {
          ...item,
          id: cartId,
          originalId: item?.originalId || item?.id || '',
          price: resolvedPrice,
          basePrice: item?.basePrice ?? item?.base_price ?? item?.price ?? resolvedPrice,
        };
        return { cartItems: [...(state.cartItems || []), newCartItem] };
      }),

      removeCartItem: (id) => set((state) => ({
        cartItems: (state.cartItems || []).filter(i => i.id !== id && i.originalId !== id)
      })),

      clearCart: () => set({ cartItems: [] }),

      buildFromCart: (targetDayId = 1, targetSlot = 'MORNING') => set((state) => {
        const cartItems = state.cartItems || [];
        if (cartItems.length === 0) return {};

        const newItems = [...(state.items || [])];
        let currentDay = targetDayId;
        let currentSlot: SlotType = targetSlot;
        let maxDay = state.totalDays;
        
        const slotSequence: SlotType[] = ['MORNING', 'AFTERNOON', 'EVENING'];

        cartItems.forEach((cartItem) => {
          const resolvedPrice = resolvePrice(cartItem, state.tier, state.adults, state.children);
          const uniqueId = `item-${currentDay}-${currentSlot}-${cartItem.originalId || cartItem.id || Date.now()}`;
          
          const filteredIndex = newItems.findIndex(i => i.dayId === currentDay && i.timeSlot === currentSlot);
          if (filteredIndex !== -1) {
            newItems.splice(filteredIndex, 1);
          }

          newItems.push({
            ...cartItem,
            id: uniqueId,
            dayId: currentDay,
            timeSlot: currentSlot,
            price: resolvedPrice,
            basePrice: cartItem?.basePrice ?? cartItem?.base_price ?? cartItem?.price ?? resolvedPrice,
          });

          const currentSlotIdx = slotSequence.indexOf(currentSlot);
          if (currentSlotIdx < slotSequence.length - 1) {
            currentSlot = slotSequence[currentSlotIdx + 1];
          } else {
            currentSlot = 'MORNING';
            currentDay += 1;
            if (currentDay > maxDay) {
              maxDay = currentDay;
            }
          }
        });

        return {
          items: newItems,
          cartItems: [],
          totalDays: Math.max(state.totalDays, maxDay)
        };
      }),

      getSlotItems: (dayId, timeSlot) => 
        (get().items || []).filter(i => i.dayId === dayId && i.timeSlot === timeSlot),

      getCostBreakdown: () => {
        const state = get();
        const items = state.items || [];
        const notifications: string[] = [];

        // Group items by day
        const daysMap = new Map<number, ItineraryItem[]>();
        items.forEach(i => {
          const dId = i.dayId ?? 1;
          if (!daysMap.has(dId)) daysMap.set(dId, []);
          daysMap.get(dId)!.push(i);
        });

        let accommodation = 0;
        let parkFees = 0;
        let transport = 0;
        let otherItemsTotal = 0;

        const defaultParkFee = state.tier === 'CITIZEN' ? 5 : state.tier === 'RESIDENT' ? 15 : 30;

        daysMap.forEach((dayItems, dayId) => {
          // 1. Same-day lodge deduplication per day
          const lodgeItems = dayItems.filter(i => i?.type === 'lodges');
          if (lodgeItems.length > 0) {
            const uniqueLodgeIds = new Set(lodgeItems.map(l => l.originalId || l.id || l.name));
            if (uniqueLodgeIds.size === 1) {
              // Deduplicate: charge full price for only the first occurrence of the lodge on this day
              accommodation += Number(lodgeItems[0]?.price) || 0;
              notifications.push(`Day ${dayId}: Same-day lodging coverage detected (${lodgeItems[0].name}). Duplicate slot zeroed out.`);
            } else {
              // Different hotels/transition on same day
              lodgeItems.forEach(l => {
                accommodation += Number(l?.price) || 0;
              });
            }
          }

          // 2. Parks calculation
          const dayParks = dayItems.filter(i => i?.type === 'parks');
          const hasPark = dayParks.length > 0;
          const hasLodge = lodgeItems.length > 0;

          dayParks.forEach(p => {
            parkFees += Number(p?.price) > 0 ? Number(p.price) : defaultParkFee;
          });

          // 3. Explicit transport / car check
          const hasCar = dayItems.some(i => i?.type === 'transfers' || i?.type === 'car');
          if (hasCar) {
            dayItems.filter(i => i?.type === 'transfers' || i?.type === 'car').forEach(c => {
              transport += Number(c?.price) || 0;
            });
          } else if (hasLodge && hasPark && !state.rejectedCarDays.includes(dayId)) {
            // Chrono-flow rule: Hotel + Park selected without car -> Auto-add safari car & notify
            transport += DEFAULT_SAFARI_CAR_PRICE;
            notifications.push(`Chrono-Flow Notice: Day ${dayId} contains a hotel and a park. A safari vehicle ($${DEFAULT_SAFARI_CAR_PRICE}) has been included for logistics.`);
          }

          // 4. Other item types (activities, treks)
          dayItems.filter(i => !['lodges', 'parks', 'transfers', 'car'].includes(i?.type)).forEach(o => {
            otherItemsTotal += Number(o?.price) || 0;
          });
        });

        const subtotal = accommodation + parkFees + transport + otherItemsTotal;
        const vat = Math.round(subtotal * 0.18);
        const agencyFee = Math.round(subtotal * 0.20);
        const grandTotal = subtotal + vat + agencyFee;

        return { parkFees, accommodation, transport, vat, agencyFee, subtotal, grandTotal, notifications };
      },

      reset: () => set({ items: [], cartItems: [], tier: RESIDENCY_TIER.INTERNATIONAL, totalDays: 5, adults: 1, children: 0, notifications: [], rejectedCarDays: [] })
    }),
    { 
      name: 'itinerary-storage',
      storage: createJSONStorage(() => localStorage),
      version: CURRENT_STORE_VERSION,
      skipHydration: true,
      merge: (persistedState: any, currentState) => {
        if (!persistedState || persistedState.version !== CURRENT_STORE_VERSION) {
          return currentState;
        }

        const totalDays = persistedState.totalDays || currentState.totalDays;
        const currentTier = persistedState.tier || currentState.tier || RESIDENCY_TIER.INTERNATIONAL;
        const currentAdults = persistedState.adults || currentState.adults || 1;
        const currentChildren = persistedState.children || currentState.children || 0;

        const validItems = Array.isArray(persistedState.items)
          ? persistedState.items.map((i: any) => {
              if (!i || typeof i.dayId !== 'number' || i.dayId > totalDays || !i.timeSlot) return null;
              const recalculatedPrice = resolvePrice(i, currentTier, currentAdults, currentChildren);
              return {
                ...i,
                price: recalculatedPrice >= 0 ? recalculatedPrice : i.price
              };
            }).filter(Boolean)
          : [];

        return {
          ...currentState,
          ...persistedState,
          adults: Math.max(1, currentAdults),
          items: validItems,
        };
      },
      partialize: (state) => ({ 
        version: state.version,
        items: state.items || [], 
        cartItems: state.cartItems || [],
        tier: state.tier, 
        totalDays: state.totalDays, 
        adults: state.adults, 
        children: state.children,
        rejectedCarDays: state.rejectedCarDays
      })
    }
  )
);