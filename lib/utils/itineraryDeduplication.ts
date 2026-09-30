// utils/itineraryDeduplication.ts

export function processDayLodgingDeduplication(dayItems: Array<{ type?: string; name?: string; price?: number; [key: string]: any }>) {
  if (!Array.isArray(dayItems) || dayItems.length <= 1) {
    return { adjustedItems: dayItems, hasDeduplication: false, message: null };
  }

  const lodgeItems = dayItems.filter(item => 
    item?.type === 'LODGE' || 
    item?.type === 'HOTEL' || 
    (item?.name && /lodge|hotel|camp|resort|inn/i.test(item.name))
  );

  // If there are multiple accommodation slots booked on the same day
  if (lodgeItems.length > 1) {
    // Check if they are different hotels (Hotel-to-Hotel move) or the same hotel booked across slots
    const uniqueLodgeNames = new Set(lodgeItems.map(l => l.name));
    
    if (uniqueLodgeNames.size === 1) {
      // Same hotel booked across multiple slots (e.g., Morning & Evening slots) -> Deduplicate pricing!
      let primaryLodgeKept = false;
      const adjustedItems = dayItems.map(item => {
        const isLodge = item?.type === 'LODGE' || item?.type === 'HOTEL' || (item?.name && /lodge|hotel|camp|resort|inn/i.test(item.name));
        if (isLodge) {
          if (!primaryLodgeKept) {
            primaryLodgeKept = true;
            return item; // Keep full price for the primary slot
          } else {
            // Zero out price for the redundant duplicate slot on the same day
            return { ...item, price: 0, subtotal: 0, totalAmount: 0, isDeduplicated: true };
          }
        }
        return item;
      });

      return {
        adjustedItems,
        hasDeduplication: true,
        message: "Chrono-Flow Notice: Double-booking detected for the same lodge on this day. You are only charged once for the full day's accommodation; duplicate slots have been zeroed out."
      };
    } else {
      // Different hotels = Hotel-to-Hotel transition (Valid separate charges apply)
      return {
        adjustedItems: dayItems,
        hasDeduplication: false,
        message: "Chrono-Flow Notice: Hotel-to-hotel transition detected. Standard transfer rates apply."
      };
    }
  }

  return { adjustedItems: dayItems, hasDeduplication: false, message: null };
}