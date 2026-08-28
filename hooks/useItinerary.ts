import { useState, useCallback } from 'react';

export interface ItineraryItem {
  id: string;
  name: string;
  category: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  items: ItineraryItem[];
}

export const useItinerary = () => {
  const [days, setDays] = useState<ItineraryDay[]>([
    { id: 'day-1', dayNumber: 1, items: [] }
  ]);

  // 1. Add item
  const addItemToDay = useCallback((dayId: string, item: ItineraryItem) => {
    setDays(prev => prev.map(day => 
      day.id === dayId ? { ...day, items: [...day.items, item] } : day
    ));
  }, []);

  // 2. Remove item
  const removeItemFromDay = useCallback((dayId: string, itemId: string) => {
    setDays(prev => prev.map(day => 
      day.id === dayId ? { ...day, items: day.items.filter(i => i.id !== itemId) } : day
    ));
  }, []);

  // 3. Add a new day
  const addDay = useCallback(() => {
    setDays(prev => [...prev, { 
      id: `day-${prev.length + 1}`, 
      dayNumber: prev.length + 1, 
      items: [] 
    }]);
  }, []);

  // 4. Reorder item WITHIN the same day
  const reorderItemsInDay = useCallback((dayId: string, startIndex: number, endIndex: number) => {
    setDays(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      const newItems = Array.from(day.items);
      const [removed] = newItems.splice(startIndex, 1);
      newItems.splice(endIndex, 0, removed);
      return { ...day, items: newItems };
    }));
  }, []);

  // 5. Move item between days
  const moveItem = useCallback((sourceDayId: string, targetDayId: string, itemId: string) => {
    setDays(prev => {
      let movingItem: ItineraryItem | undefined;
      const updatedDays = prev.map(day => {
        if (day.id === sourceDayId) {
          movingItem = day.items.find(i => i.id === itemId);
          return { ...day, items: day.items.filter(i => i.id !== itemId) };
        }
        return day;
      });

      return updatedDays.map(day => {
        if (day.id === targetDayId && movingItem) {
          return { ...day, items: [...day.items, movingItem] };
        }
        return day;
      });
    });
  }, []);

  // 6. Batch Clear (Reset a full day)
  const clearDay = useCallback((dayId: string) => {
    setDays(prev => prev.map(day => day.id === dayId ? { ...day, items: [] } : day));
  }, []);

  // 7. Bulk Delete (Remove everything)
  const resetItinerary = useCallback(() => {
    setDays([{ id: 'day-1', dayNumber: 1, items: [] }]);
  }, []);

  return { 
    days, 
    addItemToDay, 
    removeItemFromDay, 
    addDay, 
    reorderItemsInDay, 
    moveItem, 
    clearDay, 
    resetItinerary 
  };
};