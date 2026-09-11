import { create } from 'zustand';
import { ResidencyTier } from '@/types/tariffs';

export interface ItineraryItem {
  id: string;
  name: string;
  type: 'park' | 'hotel' | 'car';
  price: number;
}

interface ItineraryState {
  items: ItineraryItem[];
  tier: ResidencyTier;
  
  // Actions
  setTier: (tier: ResidencyTier) => void;
  addItem: (item: ItineraryItem) => void;
  removeItem: (id: string) => void;
  
  // Getters (Computed properties)
  totalPrice: () => number;
  isResident: () => boolean;
}

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  items: [],
  tier: ResidencyTier.INTERNATIONAL,

  setTier: (tier) => set({ tier }),

  addItem: (newItem) => {
    set((state) => {
      if (state.items.some((i) => i.id === newItem.id)) return state;

      const newItems = [...state.items, newItem];

      // Business Logic: Auto-add car for International Visitors
      if (state.tier === ResidencyTier.INTERNATIONAL) {
        const hasPark = newItems.some((i) => i.type === 'park');
        const hasHotel = newItems.some((i) => i.type === 'hotel');
        const hasCar = newItems.some((i) => i.type === 'car');

        if (hasPark && hasHotel && !hasCar) {
          newItems.push({
            id: 'auto-safari-car',
            name: 'Safari Vehicle (Required for Visitors)',
            type: 'car',
            price: 400000,
          });
        }
      }

      return { items: newItems };
    });
  },

  removeItem: (id) => set((state) => ({ 
    items: state.items.filter((i) => i.id !== id) 
  })),

  // Calculated values defined as functions
  totalPrice: () => get().items.reduce((acc, item) => acc + item.price, 0),
  
  isResident: () => get().tier !== ResidencyTier.INTERNATIONAL,
}));