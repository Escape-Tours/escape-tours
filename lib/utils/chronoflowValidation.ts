// utils/chronoflowValidation.ts

const ISLAND_ZONES = ['ZANZIBAR_COAST', 'MAFIA_ISLAND'];
const MAINLAND_NORTHERN = ['SERENGETI', 'NGORONGORO_HIGHLANDS', 'TARANGIRE', 'NORTHERN_CIRCUIT', 'RIFT_VALLEY'];

export function evaluateDayGeography(dayItems: Array<{ location?: string; region?: string; name?: string }>) {
  if (!Array.isArray(dayItems) || dayItems.length === 0) return { hasConflict: false };

  let hasIsland = false;
  let hasMainlandNorthern = false;

  for (const item of dayItems) {
    const loc = item?.location || item?.region || '';
    if (ISLAND_ZONES.some(zone => loc.includes(zone) || (item.name && item.name.toLowerCase().includes('island')))) {
      hasIsland = true;
    }
    if (MAINLAND_NORTHERN.some(zone => loc.includes(zone) || (item.name && (item.name.toLowerCase().includes('tarangire') || item.name.toLowerCase().includes('serengeti'))))) {
      hasMainlandNorthern = true;
    }
  }

  // If both a mainland park and an island are slotted into the same day
  if (hasIsland && hasMainlandNorthern) {
    return {
      hasConflict: true,
      penaltyScore: 50, // Massive penalty to drop the Chrono-Flow score instantly
      warningMessage: "Logistical Impossibility: Cannot combine mainland parks and island activities on the same day."
    };
  }

  return { hasConflict: false };
}