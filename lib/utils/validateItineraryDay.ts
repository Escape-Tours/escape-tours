// utils/validateItineraryDay.ts

const ISLAND_ZONES = ['ZANZIBAR_COAST', 'MAFIA_ISLAND', 'ZANZIBAR', 'PEMBA'];
const MAINLAND_NORTHERN = ['SERENGETI', 'NGORONGORO_HIGHLANDS', 'TARANGIRE', 'NORTHERN_CIRCUIT', 'RIFT_VALLEY', 'ARUSHA', 'MANYARA', 'KARATU'];
const SOUTHERN_PARKS = ['NYERERE', 'SELOUS', 'RUAHA', 'MIKUMI', 'SOUTHERN_PARKS', 'UDZUNGWA'];

export interface DayItem {
  name?: string;
  location?: string;
  region?: string;
  type?: string;
  [key: string]: any;
}

export interface DayValidationResult {
  isValid: boolean;
  hasConflict: boolean;
  penaltyScore: number;
  error?: string;
}

/**
 * Validates day items to detect impossible same-day geographic jumps,
 * while correctly accounting for local lodge logistics and same-circuit pairings (e.g., Karatu lodge + Tarangire safari).
 */
export function validateDayGeography(dayItems: DayItem[]): DayValidationResult {
  if (!Array.isArray(dayItems) || dayItems.length === 0) {
    return { isValid: true, hasConflict: false, penaltyScore: 0 };
  }

  let hasIsland = false;
  let hasMainlandNorthern = false;
  let hasSouthern = false;
  let hasTransport = false;
  let hasLodge = false;

  for (const item of dayItems) {
    const loc = (item?.location || item?.region || '').toUpperCase();
    const name = (item?.name || '').toLowerCase();
    const type = (item?.type || '').toUpperCase();

    if (
      type === 'TRANSPORT' || 
      type === 'TRANSFER' || 
      ['flight', 'transfer', 'drive', 'transit', 'transport', 'charter'].some(kw => name.includes(kw))
    ) {
      hasTransport = true;
    }

    if (
      type === 'LODGE' || 
      type === 'HOTEL' || 
      type === 'ACCOMMODATION' ||
      ['lodge', 'hotel', 'camp', 'resort', 'inn'].some(kw => name.includes(kw) || type.includes(kw))
    ) {
      hasLodge = true;
    }

    if (
      ISLAND_ZONES.some(zone => loc.includes(zone)) || 
      name.includes('island') || 
      name.includes('changuu') || 
      name.includes('prison island') ||
      name.includes('zanzibar')
    ) {
      hasIsland = true;
    }

    if (
      MAINLAND_NORTHERN.some(zone => loc.includes(zone)) || 
      name.includes('tarangire') || 
      name.includes('serengeti') || 
      name.includes('ngorongoro') ||
      name.includes('arusha') ||
      name.includes('karatu')
    ) {
      hasMainlandNorthern = true;
    }

    if (
      SOUTHERN_PARKS.some(zone => loc.includes(zone)) || 
      name.includes('nyerere') || 
      name.includes('selous') || 
      name.includes('ruaha') ||
      name.includes('mikumi') ||
      name.includes('rufiji')
    ) {
      hasSouthern = true;
    }
  }

  // A day containing a local lodge/hotel alongside a park within the same Northern circuit 
  // (e.g., Hellen's Lodge in Karatu + Tarangire National Park) is a fully valid, standard safari day.
  const isSameCircuitWithLodge = (hasMainlandNorthern && !hasSouthern && !hasIsland) && hasLodge;
  const isTransitionDay = hasTransport && hasLodge;

  if (isSameCircuitWithLodge || isTransitionDay) {
    return { isValid: true, hasConflict: false, penaltyScore: 0 };
  }

  // Conflict 1: Mixing Northern Mainland Parks and Island Zones without explicit transition
  if (hasIsland && hasMainlandNorthern && !isTransitionDay) {
    return {
      isValid: false,
      hasConflict: true,
      penaltyScore: 50,
      error: "Logistical Conflict: Cannot combine mainland northern parks and Zanzibar/Island activities on the same day without a transition/flight day."
    };
  }

  // Conflict 2: Mixing Northern and Southern Circuits without transition logistics
  if (hasMainlandNorthern && hasSouthern && !isTransitionDay) {
    return {
      isValid: false,
      hasConflict: true,
      penaltyScore: 50,
      error: "Logistical Conflict: Cannot combine Northern Circuit parks and Southern Circuit parks on the same day unless it is a structured circuit transition."
    };
  }

  // Conflict 3: Mixing Southern Circuit and Islands directly without transit
  if (hasIsland && hasSouthern && !isTransitionDay) {
    return {
      isValid: false,
      hasConflict: true,
      penaltyScore: 50,
      error: "Logistical Conflict: Cannot combine Southern Circuit parks and Island excursions on the same day without a flight connection."
    };
  }

  return { isValid: true, hasConflict: false, penaltyScore: 0 };
}