export function getCurrentSeason(date: Date = new Date()): 'high' | 'low' {
  const month = date.getMonth(); // 0-indexed (0 = January, 11 = December)
  
  // High Season in Tanzania typically: June (5) through October (9), and January (0) - February (1)
  // Low/Green Season: March (2) through May (4), and November (10)
  if ((month >= 0 && month <= 1) || (month >= 5 && month <= 9)) {
    return 'high';
  }
  
  return 'low';
}

export function formatSeasonName(season: 'high' | 'low'): string {
  return season === 'high' ? 'High Season Rates (Active)' : 'Low Season Rates (Active)';
}