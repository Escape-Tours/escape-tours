// lib/services/itineraryAnalyzer.ts
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';

export interface PaceScoreResult {
  score: number;
  label: string;
  color: string;
  advice: string;
}

const getRegionCategory = (rawSlotOrItem: any): 'NORTHERN' | 'SOUTHERN' | 'WESTERN' | 'ZANZIBAR' | 'OTHER' => {
  const item = rawSlotOrItem?.item || rawSlotOrItem || {};
  const name = String(item?.name || rawSlotOrItem?.name || '').toLowerCase();
  const category = String(item?.category || rawSlotOrItem?.category || '').toLowerCase();
  const location = String(item?.location || rawSlotOrItem?.location || '').toLowerCase();

  // Universal Zanzibar / Coastal / Island Check
  if (
    location.includes('zanzibar') ||
    location.includes('stone town') ||
    location.includes('nungwi') ||
    location.includes('paje') ||
    location.includes('kendwa') ||
    location.includes('matemwe') ||
    location.includes('jambiani') ||
    location.includes('mnemba') ||
    location.includes('prison island') ||
    name.includes('zanzibar') || 
    name.includes('stone town') || 
    name.includes('mnemba') || 
    name.includes('nungwi') || 
    name.includes('paje') ||
    name.includes('kendwa') ||
    name.includes('matemwe') ||
    name.includes('prison island') ||
    name.includes('jambiani') ||
    name.includes('ycona') ||
    name.includes('mizingani') ||
    category.includes('cruises') ||
    category.includes('beaches')
  ) {
    return 'ZANZIBAR';
  }

  // Western Circuit (Mahale, Katavi, Gombe)
  if (
    location.includes('mahale') ||
    location.includes('katavi') ||
    location.includes('gombe') ||
    name.includes('mahale') ||
    name.includes('katavi') ||
    name.includes('gombe')
  ) {
    return 'WESTERN';
  }

  // Universal Southern Circuit Check (Ruaha, Selous / Nyerere National Park, Mikumi, Udzungwa)
  if (
    location.includes('ruaha') ||
    location.includes('selous') ||
    location.includes('nyerere') ||
    location.includes('mikumi') ||
    location.includes('udzungwa') ||
    name.includes('southern') ||
    name.includes('ruaha') || 
    name.includes('selous') || 
    name.includes('nyerere') || 
    name.includes('mikumi') ||
    name.includes('udzungwa')
  ) {
    return 'SOUTHERN';
  }

  // Universal Northern Circuit Check (Serengeti, Ngorongoro, Tarangire, Manyara, Arusha, Kilimanjaro)
  if (
    location.includes('arusha') ||
    location.includes('serengeti') ||
    location.includes('ngorongoro') ||
    location.includes('karatu') ||
    location.includes('tarangire') ||
    location.includes('manyara') ||
    location.includes('kilimanjaro') ||
    location.includes('lemosho') ||
    name.includes('northern') ||
    name.includes('serengeti') || 
    name.includes('ngorongoro') || 
    name.includes('karatu') ||
    name.includes('marera') ||
    name.includes('hellen') ||
    name.includes('tarangire') || 
    name.includes('manyara') || 
    name.includes('arusha') || 
    name.includes('kilimanjaro') || 
    name.includes('machame') || 
    name.includes('marangu') ||
    name.includes('lemosho') ||
    name.includes('rongai') ||
    name.includes('umbwe') ||
    name.includes('double g') ||
    name.includes('kudu') ||
    name.includes('coffee lodge')
  ) {
    return 'NORTHERN';
  }

  return 'OTHER';
};

const isLodgeItem = (slotOrItem: any): boolean => {
  if (!slotOrItem) return false;
  const item = slotOrItem?.item || slotOrItem;
  if (!item || (typeof item === 'object' && Object.keys(item).length === 0)) return false;
  
  const cat = String(item?.category || '').toUpperCase();
  const name = String(item?.name || '').toLowerCase();
  return cat === 'LODGES' || name.includes('lodge') || name.includes('camp') || name.includes('hotel') || name.includes('resort');
};

const isTrekItem = (slotOrItem: any): boolean => {
  if (!slotOrItem) return false;
  const item = slotOrItem?.item || slotOrItem;
  if (!item) return false;
  const cat = String(item?.category || '').toUpperCase();
  const name = String(item?.name || '').toLowerCase();
  return cat === 'TREKS' || name.includes('route') || name.includes('kilimanjaro') || name.includes('machame') || name.includes('marangu') || name.includes('lemosho');
};

const hasTransferOrFlight = (slots: any[]): boolean => {
  return (slots || []).some((s: any) => {
    if (!s) return false;
    const item = s.item || s;
    if (!item) return false;
    const cat = String(item?.category || '').toLowerCase();
    const name = String(item?.name || '').toLowerCase();
    return (
      cat === 'transport' ||
      name.includes('flight') ||
      name.includes('fly') ||
      name.includes('transfer') ||
      name.includes('boat') ||
      name.includes('ferry') ||
      name.includes('cruiser') ||
      name.includes('vehicle') ||
      name.includes('charter')
    );
  });
};

export function analyzeItineraryPace(days: Day[], allItineraryItems: any[]): PaceScoreResult {
  const validItems = (allItineraryItems || []).filter(s => s && ((s as any).item || s.name));

  if (validItems.length === 0) {
    return { 
      score: 100, 
      label: 'Pristine Canvas', 
      color: 'text-amber-400', 
      advice: 'Add your first safari experience to activate legendary chrono-routing intelligence.' 
    };
  }

  // 1. Kilimanjaro Altitude & Route Feasibility Lock
  const hasKilimanjaro = validItems.some((s: any) => {
    const item = s.item || s;
    const name = String(item?.name || '').toLowerCase();
    return name.includes('kilimanjaro') || name.includes('machame') || name.includes('marangu') || name.includes('lemosho') || name.includes('rongai');
  });

  if (hasKilimanjaro) {
    const trekItem = validItems.find((s: any) => {
      const item = s.item || s;
      const name = String(item?.name || '').toLowerCase();
      return name.includes('kilimanjaro') || name.includes('machame') || name.includes('marangu') || name.includes('lemosho') || name.includes('rongai');
    });
    
    const trekName = String((trekItem as any)?.item?.name || (trekItem as any)?.name || '').toLowerCase();
    let minRequiredDays = 5; // Absolute baseline
    if (trekName.includes('lemosho')) minRequiredDays = 7;
    else if (trekName.includes('machame')) minRequiredDays = 6;
    else if (trekName.includes('marangu')) minRequiredDays = 5;

    if (days.length < minRequiredDays) {
      return {
        score: 12,
        label: 'Logistical Impossibility: Severe Altitude Acclimatization Risk',
        color: 'text-rose-500',
        advice: `This Kili route requires a strict minimum of ${minRequiredDays} days for safe ascent and medical altitude safety.`
      };
    }
  }

  // Multi-Day Trek Lock-up & Span Verification across consecutive days
  let activeTrekSpanRemaining = 0;
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const daySlots = Array.isArray(day.slots) ? day.slots : [];
    const hasTrekOnDay = daySlots.some(s => isTrekItem(s));

    if (hasTrekOnDay) {
      const trekSlot = daySlots.find(s => isTrekItem(s));
      const item = trekSlot?.item || trekSlot;
      const name = String(item?.name || '').toLowerCase();
      const trekDaysMatch = name.match(/(\d+)\s*days?/i);
      const trekDuration = trekDaysMatch ? parseInt(trekDaysMatch[1], 10) : 6;
      activeTrekSpanRemaining = Math.max(activeTrekSpanRemaining, trekDuration);
    }

    if (activeTrekSpanRemaining > 0) {
      activeTrekSpanRemaining--;
    }
  }

  let hasParkOverall = false;

  for (const day of days) {
    const daySlots = Array.isArray(day.slots) ? day.slots : [];
    const populatedSlots = daySlots.filter((s: any) => s && (s.item !== null && s.item !== undefined || s.name));
    if (populatedSlots.length === 0) continue;

    const lodgesInDay = daySlots.filter((s: any) => isLodgeItem(s));
    const isOnTrek = daySlots.some(s => isTrekItem(s));

    // Daily Rule 1: Accommodation validation
    if (lodgesInDay.length === 0 && !isOnTrek) {
      return {
        score: 1,
        label: 'Logistical Impossibility: Missing Daily Accommodation',
        color: 'text-rose-600',
        advice: `Day ${day.day_number} is missing an accommodation slot. Every day requires a verified sanctuary or lodge booked.`
      };
    }

    // Daily Rule 2: Lodge ceiling (max 2 for split stays/transitions)
    if (lodgesInDay.length > 2) {
      return {
        score: 1,
        label: 'Logistical Impossibility: Excessive Lodge Slots',
        color: 'text-rose-600',
        advice: `Day ${day.day_number} has ${lodgesInDay.length} accommodation slots booked. Maximum of 2 lodges allowed per day for transit splits.`
      };
    }

    // Strict slot-by-slot timing check
    const isDayTransition = hasTransferOrFlight(daySlots) || lodgesInDay.length === 2;
    if (daySlots[1] && isLodgeItem(daySlots[1]) && !isDayTransition) {
      return {
        score: 1,
        label: 'Logistical Impossibility: Lodge in Midday Slot',
        color: 'text-rose-600',
        advice: `Day ${day.day_number}: Afternoon time slot cannot host a hotel check-in unless executing an explicit circuit transition.`
      };
    }

    // Back-to-back lodge check without transit
    if (daySlots[0] && isLodgeItem(daySlots[0]) && daySlots[2] && isLodgeItem(daySlots[2]) && !daySlots[1]) {
      return {
        score: 1,
        label: 'Logistical Impossibility: Vacant Midday Activity Corridor',
        color: 'text-rose-600',
        advice: `Day ${day.day_number}: Morning and evening lodge pairing requires an active safari game drive or transit in the afternoon slot.`
      };
    }

    const parksInDay = populatedSlots.filter((s: any) => {
      const item = s.item || s;
      const cat = String(item?.category || '').toUpperCase();
      return cat === 'SAFARIS' || cat === 'PARKS' || String(item?.name || '').toLowerCase().includes('park');
    });

    if (parksInDay.length > 0) hasParkOverall = true;

    // Cross-Circuit / Zanzibar mixing validations
    const slotRegions = populatedSlots.map((s: any) => getRegionCategory(s));
    const uniqueDayRegions = Array.from(new Set(slotRegions.filter(r => r !== 'OTHER')));

    const hasZanzibar = uniqueDayRegions.includes('ZANZIBAR');
    const hasNorthern = uniqueDayRegions.includes('NORTHERN');
    const hasSouthern = uniqueDayRegions.includes('SOUTHERN');
    const hasWestern = uniqueDayRegions.includes('WESTERN');

    if (hasZanzibar && (hasNorthern || hasSouthern || hasWestern)) {
      if (!hasTransferOrFlight(daySlots)) {
        return {
          score: 25,
          label: `Logistical Violation: Instant Mainland-Island Teleportation on Day ${day.day_number}`,
          color: 'text-rose-500',
          advice: `Day ${day.day_number} merges Zanzibar with mainland reserves without an explicit domestic flight or marine transfer hook.`
        };
      }
    }

    if ((hasNorthern && hasSouthern) || (hasNorthern && hasWestern) || (hasSouthern && hasWestern)) {
      if (!hasTransferOrFlight(daySlots)) {
        return {
          score: 25,
          label: `Logistical Violation: Impossible Cross-Circuit Drive on Day ${day.day_number}`,
          color: 'text-rose-500',
          advice: `Day ${day.day_number} attempts to combine disparate wildlife circuits without a registered bush flight or long-haul transfer.`
        };
      }
    }

    if (lodgesInDay.length === 2) {
      const uniqueLodgeRegions = Array.from(new Set(lodgesInDay.map((l: any) => getRegionCategory(l))));
      
      if (uniqueLodgeRegions.length > 1 && !hasTransferOrFlight(daySlots)) {
        return {
          score: 25,
          label: `Logistical Violation: Unlinked Multi-Region Lodging on Day ${day.day_number}`,
          color: 'text-rose-500',
          advice: `Day ${day.day_number} assigns split accommodations across distinct geographical regions (${uniqueLodgeRegions.join(', ')}) without transit.`
        };
      }
    }
  }

  // Transport & Safari Rig Verification
  const hasSafariActivityOrPark = validItems.some((s: any) => {
    const item = s.item || s;
    const cat = String(item?.category || '').toUpperCase();
    const name = String(item?.name || '').toLowerCase();
    return cat === 'SAFARIS' || cat === 'PARKS' || name.includes('game drive') || name.includes('park') || name.includes('safari') || name.includes('ngorongoro') || name.includes('serengeti');
  });

  const hasTransport = validItems.some((s: any) => {
    const item = s.item || s;
    const cat = String(item?.category || '').toUpperCase();
    const name = String(item?.name || '').toLowerCase();
    return cat === 'TRANSPORT' || name.includes('cruiser') || name.includes('4x4') || name.includes('vehicle') || name.includes('safari car') || name.includes('minibus') || name.includes('flight');
  });

  if (hasSafariActivityOrPark && !hasTransport) {
    return {
      score: 55,
      label: 'Logistical Advisory: 4x4 Safari Rig Recommended',
      color: 'text-amber-400',
      advice: 'Wildlife park activities detected. Chrono-Routing Engine advises embedding a dedicated 4x4 safari cruiser and driver-guide.'
    };
  }

  // Inter-day Circuit Transition & Flight Verification
  for (let i = 0; i < days.length - 1; i++) {
    const currentDayText = (days[i].slots || []).map((s: any) => {
      const item = s.item || s;
      return `${item?.name || ''} ${item?.location || ''}`;
    }).join(' ');

    const nextDayText = (days[i + 1].slots || []).map((s: any) => {
      const item = s.item || s;
      return `${item?.name || ''} ${item?.location || ''}`;
    }).join(' ');

    const currentRegion = getRegionCategory({ name: currentDayText, location: currentDayText });
    const nextRegion = getRegionCategory({ name: nextDayText, location: nextDayText });

    const isSmoothNorthernTransition = currentRegion === 'NORTHERN' && nextRegion === 'NORTHERN';

    if (currentRegion !== 'OTHER' && nextRegion !== 'OTHER' && currentRegion !== nextRegion && !isSmoothNorthernTransition) {
      const hasFlightOrTransfer = hasTransferOrFlight(days[i].slots || []) || hasTransferOrFlight(days[i + 1].slots || []);

      if (!hasFlightOrTransfer) {
        return {
          score: 35,
          label: 'Logistical Impossibility: Missing Inter-Circuit Connection',
          color: 'text-rose-500',
          advice: `Transitioning between Day ${days[i].day_number} (${currentRegion}) and Day ${days[i+1].day_number} (${nextRegion}) requires an authorized domestic flight or regional transit link.`
        };
      }
    }
  }

  const totalSlots = days.length * 3;
  const filledRatio = validItems.length / totalSlots;
  
  if (filledRatio < 0.4) {
    return { score: 72, label: 'Serene Expedition Pace', color: 'text-cyan-400', advice: 'Expansive breathing room between wildlife sightings and coastal retreats.' };
  }
  if (filledRatio <= 0.85) {
    return { score: 98, label: 'Legendary Safari Rhythm', color: 'text-emerald-400', advice: 'Flawless equilibrium of high-action game drives, scenic transfers, and leisure.' };
  }
  return { score: 85, label: 'High-Velocity Wilderness Odyssey', color: 'text-amber-400', advice: 'High-density schedule! Consider spacing out activities to fully absorb the wild.' };
}