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
  readonly type?: string;
  readonly basePrice?: TariffMap | number;
  readonly base_price?: TariffMap | number;
  readonly price: number;
  readonly cost?: number;
  readonly selectedRoomType?: string;
  readonly dayId?: number;
  readonly timeSlot?: SlotType;
  readonly slot?: SlotType;
  readonly quantity?: number;
  readonly slots?: number;
  readonly isAfterHours?: boolean;
  readonly isDeduplicated?: boolean;
}

export interface ItineraryState {
  readonly version: number;
  readonly items: readonly ItineraryItem[];
  readonly cartItems: readonly ItineraryItem[];
  readonly afterHoursItems: readonly ItineraryItem[];
  readonly tier: ResidencyTier;
  readonly totalDays: number;
  readonly adults: number;
  readonly children: number;
  readonly notifications: readonly string[];
  readonly rejectedCarDays: readonly number[];
  
  setTier: (tier: ResidencyTier) => void;
  setGuests: (adults: number, children: number) => void;
  addItem: (item: Omit<ItineraryItem, 'id' | 'price'> & { id?: string; price?: number }, dayId?: number, timeSlot?: SlotType) => void;
  addAfterHoursItem: (item: Omit<ItineraryItem, 'id' | 'price'> & { id?: string; price?: number }, dayId?: number) => void;
  removeItem: (id: string) => void;
  removeAfterHoursItem: (id: string) => void;
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
  getCostBreakdown: () => { parkFees: number; accommodation: number; transport: number; afterHours: number; vat: number; agencyFee: number; grandTotal: number; subtotal: number; notifications: string[] };
  reset: () => void;
}

const CURRENT_STORE_VERSION = 71;
const DEFAULT_SAFARI_CAR_PRICE = 350;

const resolvePrice = (item: any, tier: ResidencyTier, adults: number = 1, children: number = 0): number => {
  if (!item) return 0;
  
  const rawPriceSource = item?.basePrice ?? item?.base_price ?? item?.price ?? item?.cost;
  const upperTier = String(tier || 'INTERNATIONAL').toUpperCase() as ResidencyTier;

  let unitPrice = 0;
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
  } else if (typeof item?.cost === 'number' && item.cost > 0) {
    unitPrice = item.cost;
  }

  if (unitPrice <= 0 || isNaN(unitPrice)) {
    const typeStr = String(item?.type || '').toLowerCase();
    if (typeStr.includes('lodge')) unitPrice = 150;
    else if (typeStr.includes('park')) unitPrice = upperTier === 'CITIZEN' ? 5 : upperTier === 'RESIDENT' ? 15 : 30;
    else unitPrice = Number(item?.price || item?.cost || 50);
  }

  return Math.round(unitPrice);
};

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      version: CURRENT_STORE_VERSION,
      items: [],
      cartItems: [],
      afterHoursItems: [],
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

      recalculatePrices: () => set((state) => {
        const maxD = state.totalDays || 5;
        const validItems = (state.items || []).filter(i => i && i.id && (i.dayId ?? 1) <= maxD);
        const validAfterHours = (state.afterHoursItems || []).filter(i => i && i.id && (i.dayId ?? 1) <= maxD);
        return {
          items: validItems.map(i => ({
            ...i,
            price: resolvePrice(i, state.tier, state.adults, state.children)
          })),
          afterHoursItems: validAfterHours.map(i => ({
            ...i,
            price: resolvePrice(i, state.tier, state.adults, state.children)
          }))
        };
      }),

      addItem: (item, dayId = 1, timeSlot = 'MORNING') => set((state) => {
        if (!item || (!item.id && !item.originalId && !item.name)) return {};
        const typeStr = String(item?.type || '').toLowerCase();
        const isAfterHours = item?.isAfterHours || typeStr.includes('after_hours') || typeStr.includes('bush_party') || typeStr.includes('nightlife');

        if (isAfterHours) {
          const resolvedPrice = resolvePrice(item, state.tier, state.adults, state.children);
          const uniqueId = `afterhours-${dayId}-${item?.originalId || item?.id || Date.now()}`;
          const newItem: ItineraryItem = {
            ...item,
            id: uniqueId,
            originalId: item?.originalId || item?.id || '',
            dayId,
            isAfterHours: true,
            price: resolvedPrice > 0 ? resolvedPrice : 50,
            basePrice: item?.basePrice ?? item?.base_price ?? item?.price ?? resolvedPrice,
          };
          const filteredAfterHours = (state.afterHoursItems || []).filter(
            (ah) => ah && ah.id && ah.originalId !== newItem.originalId
          );
          return { afterHoursItems: [...filteredAfterHours, newItem] };
        }

        const resolvedPrice = resolvePrice(item, state.tier, state.adults, state.children);
        const uniqueId = `item-${dayId}-${timeSlot}-${item?.originalId || item?.id || Date.now()}`;
        
        const newItem: ItineraryItem = {
          ...item,
          id: uniqueId,
          originalId: item?.originalId || item?.id || '',
          dayId,
          timeSlot,
          slot: timeSlot,
          price: resolvedPrice > 0 ? resolvedPrice : 50,
          basePrice: item?.basePrice ?? item?.base_price ?? item?.price ?? resolvedPrice,
        };

        const filteredItems = (state.items || []).filter(
          (i) => i && i.id && !(i.dayId === dayId && (i.timeSlot === timeSlot || i.slot === timeSlot) && i.originalId === newItem.originalId)
        );

        return { items: [...filteredItems, newItem] };
      }),

      addAfterHoursItem: (item, dayId = 1) => set((state) => {
        if (!item || (!item.id && !item.originalId && !item.name)) return {};
        const resolvedPrice = resolvePrice(item, state.tier, state.adults, state.children);
        const uniqueId = `afterhours-${dayId}-${item?.originalId || item?.id || Date.now()}`;
        const newItem: ItineraryItem = {
          ...item,
          id: uniqueId,
          originalId: item?.originalId || item?.id || '',
          dayId,
          isAfterHours: true,
          price: resolvedPrice > 0 ? resolvedPrice : 50,
          basePrice: item?.basePrice ?? item?.base_price ?? item?.price ?? resolvedPrice,
        };
        const filteredAfterHours = (state.afterHoursItems || []).filter(
          (ah) => ah && ah.id && ah.originalId !== newItem.originalId
        );
        return { afterHoursItems: [...filteredAfterHours, newItem] };
      }),

      removeItem: (id) => set((state) => ({
        items: (state.items || []).filter((i) => i && i.id !== id && i.originalId !== id),
        afterHoursItems: (state.afterHoursItems || []).filter((i) => i && i.id !== id && i.originalId !== id)
      })),

      removeAfterHoursItem: (id) => set((state) => ({
        afterHoursItems: (state.afterHoursItems || []).filter((i) => i && i.id !== id && i.originalId !== id)
      })),

      updateItemSlot: (itemId, dayId, timeSlot) => set((state) => ({
        items: (state.items || []).map((i) => (i && (i.id === itemId || i.originalId === itemId)) ? { ...i, dayId, timeSlot, slot: timeSlot } : i)
      })),

      updateRoomType: (itemId, selectedRoomType) => set((state) => ({
        items: (state.items || []).map((i) => {
          if (!i || (i.id !== itemId && i.originalId !== itemId)) return i;
          const updatedItem = { ...i, selectedRoomType };
          return {
            ...updatedItem,
            price: resolvePrice(updatedItem, state.tier, state.adults, state.children)
          };
        }),
        afterHoursItems: (state.afterHoursItems || []).map((i) => {
          if (!i || (i.id !== itemId && i.originalId !== itemId)) return i;
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
        const cleanedItems = (state.items || []).filter(i => i && i.id && (i.dayId ?? 1) <= newTotalDays);
        const cleanedAfterHours = (state.afterHoursItems || []).filter(i => i && i.id && (i.dayId ?? 1) <= newTotalDays);
        return { totalDays: newTotalDays, items: cleanedItems, afterHoursItems: cleanedAfterHours };
      }),

      rejectCarForDay: (dayId) => set((state) => ({
        rejectedCarDays: state.rejectedCarDays.includes(dayId) ? state.rejectedCarDays : [...state.rejectedCarDays, dayId]
      })),

      clearItinerary: () => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('itinerary-storage');
          }
        } catch (e) {
          console.error(e);
        }
        set({ items: [], cartItems: [], afterHoursItems: [], notifications: [], rejectedCarDays: [] });
      },

      addCartItem: (item) => set((state) => {
        if (!item || (!item.id && !item.originalId && !item.name)) return {};
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
        cartItems: (state.cartItems || []).filter(i => i && i.id !== id && i.originalId !== id)
      })),

      clearCart: () => set({ cartItems: [] }),

      buildFromCart: (targetDayId = 1, targetSlot = 'MORNING') => set((state) => {
        const cartItems = (state.cartItems || []).filter(i => i && i.id);
        if (cartItems.length === 0) return {};

        const newItems = [...(state.items || []).filter(i => i && i.id)];
        const newAfterHours = [...(state.afterHoursItems || []).filter(ah => ah && ah.id)];
        let currentDay = targetDayId;
        let currentSlot: SlotType = targetSlot;
        let maxDay = state.totalDays;
        
        const slotSequence: SlotType[] = ['MORNING', 'AFTERNOON', 'EVENING'];

        cartItems.forEach((cartItem) => {
          const resolvedPrice = resolvePrice(cartItem, state.tier, state.adults, state.children);
          const typeStr = String(cartItem?.type || '').toLowerCase();
          const isAfterHours = cartItem?.isAfterHours || typeStr.includes('after_hours') || typeStr.includes('bush_party');

          if (isAfterHours) {
            newAfterHours.push({
              ...cartItem,
              id: `afterhours-${currentDay}-${cartItem.originalId || cartItem.id || Date.now()}`,
              dayId: currentDay,
              isAfterHours: true,
              price: resolvedPrice,
              basePrice: cartItem?.basePrice ?? cartItem?.base_price ?? cartItem?.price ?? resolvedPrice,
            });
            return;
          }

          const uniqueId = `item-${currentDay}-${currentSlot}-${cartItem.originalId || cartItem.id || Date.now()}`;

          newItems.push({
            ...cartItem,
            id: uniqueId,
            dayId: currentDay,
            timeSlot: currentSlot,
            slot: currentSlot,
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
          afterHoursItems: newAfterHours,
          cartItems: [],
          totalDays: Math.max(state.totalDays, maxDay)
        };
      }),

      getSlotItems: (dayId, timeSlot) => 
        (get().items || []).filter(i => i && i.id && ((i.dayId ?? 1) === dayId) && (i.timeSlot === timeSlot || i.slot === timeSlot)),

      getCostBreakdown: () => {
        const state = get();
        const maxD = state.totalDays || 5;
        const items = (state.items || []).filter(i => i && i.id && typeof i === 'object' && (i.dayId ?? 1) <= maxD);
        
        const afterHoursMap = new Map<string, ItineraryItem>();
        (state.afterHoursItems || []).filter(ah => ah && ah.id && (ah.dayId ?? 1) <= maxD).forEach(ah => {
          afterHoursMap.set(ah.id || ah.originalId, ah);
        });

        if (items.length === 0 && afterHoursMap.size === 0) {
          return { parkFees: 0, accommodation: 0, transport: 0, afterHours: 0, vat: 0, agencyFee: 0, subtotal: 0, grandTotal: 0, notifications: [] };
        }

        let accommodation = 0;
        let parkFees = 0;
        let transport = 0;
        let afterHoursTotal = 0;
        let explicitVehicleAdded = false;

        const defaultParkFee = state.tier === 'CITIZEN' ? 5 : state.tier === 'RESIDENT' ? 15 : 30;
        
        // Strict Hotel Deduplication per Day to prevent double-charging if a hotel item is selected twice on the same day
        const processedLodges = new Set<string>();

        items.forEach(i => {
          const itemType = String(i?.type || '').toLowerCase();
          const itemPrice = Number(i?.price || 0);
          const dayId = i?.dayId ?? 1;
          const slot = String(i?.timeSlot || i?.slot || '').toUpperCase();

          if (i?.isAfterHours || itemType.includes('after_hours') || slot === 'EVENING' && (itemType.includes('spa') || itemType.includes('party') || itemType.includes('dinner') || itemType.includes('night') || itemType.includes('after'))) {
            afterHoursTotal += itemPrice;
            return;
          }

          if (itemType.includes('lodge') || itemType === 'lodges' || itemType.includes('hotel') || itemType.includes('accommodation')) {
            const lodgeKey = `${dayId}-${i.originalId || i.id}`;
            if (!processedLodges.has(lodgeKey)) {
              processedLodges.add(lodgeKey);
              accommodation += itemPrice;
            }
          } else if (itemType.includes('park') || itemType === 'parks') {
            parkFees += itemPrice > 0 ? itemPrice : defaultParkFee;
          } else if (itemType === 'transfers' || itemType === 'car' || itemType === 'transport' || itemType === 'safari_car') {
            transport += itemPrice > 0 ? itemPrice : DEFAULT_SAFARI_CAR_PRICE;
            explicitVehicleAdded = true;
          } else {
            accommodation += itemPrice;
          }
        });

        afterHoursMap.forEach(ah => {
          const ahPrice = Number(ah?.price || 50);
          afterHoursTotal += ahPrice;
        });

        const activeDays = new Set<number>();
        items.forEach(i => activeDays.add(i.dayId ?? 1));
        afterHoursMap.forEach(ah => activeDays.add(ah.dayId ?? 1));

        if (!explicitVehicleAdded) {
          activeDays.forEach(dayId => {
            const dayItems = items.filter(i => (i.dayId ?? 1) === dayId);
            const hasParkActivity = dayItems.some(i => {
              const t = String(i?.type || '').toLowerCase();
              const name = String(i?.name || '').toLowerCase();
              return t.includes('park') || t === 'parks' || t.includes('safari') || name.includes('serengeti') || name.includes('ngorongoro') || name.includes('tarangire') || name.includes('manyara') || name.includes('mikumi');
            });

            if (hasParkActivity && !state.rejectedCarDays.includes(dayId)) {
              transport += DEFAULT_SAFARI_CAR_PRICE;
            }
          });
        }

        const subtotal = accommodation + parkFees + transport + afterHoursTotal;
        const vat = Math.round(subtotal * 0.18);
        const agencyFeePercentage = transport > 0 ? 0.25 : 0.20;
        const agencyFee = Math.round(subtotal * agencyFeePercentage);
        const grandTotal = subtotal + vat + agencyFee;

        return { parkFees, accommodation, transport, afterHours: afterHoursTotal, vat, agencyFee, subtotal, grandTotal, notifications: [] };
      },

      reset: () => set({ items: [], cartItems: [], afterHoursItems: [], tier: RESIDENCY_TIER.INTERNATIONAL, totalDays: 5, adults: 1, children: 0, notifications: [], rejectedCarDays: [] })
    }),
    { 
      name: 'itinerary-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            if (typeof window === 'undefined') return null;
            const str = localStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str);
            if (!parsed || parsed.version !== CURRENT_STORE_VERSION) {
              localStorage.removeItem(name);
              return null;
            }
            return str;
          } catch (e) {
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            if (typeof window === 'undefined') {
              localStorage.setItem(name, value);
            }
          } catch (e) {
            console.error(e);
          }
        },
        removeItem: (name) => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(name);
            }
          } catch (e) {
            console.error(e);
          }
        }
      })),
      version: CURRENT_STORE_VERSION,
      migrate: (persistedState: any) => {
        return {
          ...persistedState,
          items: [],
          afterHoursItems: [],
          cartItems: []
        };
      },
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.recalculatePrices();
        }
      },
      merge: (persistedState: any, currentState) => {
        if (!persistedState) return currentState;
        return {
          ...currentState,
          ...persistedState,
          items: [],
          afterHoursItems: [],
          cartItems: []
        };
      },
      partialize: (state: ItineraryState) => {
        const maxD = state.totalDays || 5;
        return { 
          version: state.version,
          items: (state.items || []).filter(i => i && i.id && (i.dayId ?? 1) <= maxD), 
          cartItems: (state.cartItems || []).filter(i => i && i.id),
          afterHoursItems: (state.afterHoursItems || []).filter(i => i && i.id && (i.dayId ?? 1) <= maxD),
          tier: state.tier, 
          totalDays: state.totalDays, 
          adults: state.adults, 
          children: state.children,
          rejectedCarDays: state.rejectedCarDays
        };
      }
    }
  )
);