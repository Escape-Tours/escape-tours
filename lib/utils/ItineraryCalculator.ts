import { ParkFees, TieredPricing } from "@/lib/types/HotelParkFees";
import { ResidencyTier } from "@/lib/constants/residency";

const VAT_RATE = 0.18;
const AGENCY_FEE_PERCENTAGE = 0.20;

export interface BookingResult {
  nights: number;
  subtotalBase: number;
  agencyFee: number;
  vat: number;
  parkFeesTotal: number;
  totalAmount: number;
}

/**
 * Traverses nested JSON: Category -> Occupancy -> Season -> Residency
 */
const getBaseRate = (
  date: Date,
  categoryData: Record<string, any>, // Properly typed object to prevent implicit 'any' indexing errors
  adults: number,
  children: number,
  residency: ResidencyTier
): number => {
  const month = date.getMonth();
  const isHighSeason = (month >= 5 && month <= 9) || (month === 11 || month <= 1);
  const seasonKey = isHighSeason ? 'high' : 'low';

  // 1. Determine occupancy key (e.g., "Double", "Triple")
  const totalGuests = adults + children;
  const occupancyKey = totalGuests >= 4 ? "Quadruple" : 
                       totalGuests === 3 ? "Triple" : 
                       totalGuests === 2 ? "Double" : "Single";

  // 2. Navigate safely with typed lookups: Occupancy -> Season -> Residency
  const occupancyData = categoryData?.[occupancyKey] ?? Object.values(categoryData)[0] ?? {};
  const seasonData = occupancyData[seasonKey] ?? {};

  const rate = seasonData[residency] ?? seasonData['INTERNATIONAL'] ?? 0;

  return typeof rate === 'number' ? rate : Number(rate) || 0;
};

export const calculateBookingDetails = (
  checkIn: string,
  checkOut: string,
  categoryData: any,
  categoryName: string,
  adults: number = 1,
  children: number = 0,
  residency: ResidencyTier = 'INTERNATIONAL',
  parkFees?: ParkFees
): BookingResult => {
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  // 1. Get Base Rate from nested structure
  const baseRate = getBaseRate(start, categoryData, adults, children, residency);

  // 2. Room Math (Children default to 50% of adult rate)
  const sanitizedAdults = Math.max(1, Math.floor(adults));
  const sanitizedChildren = Math.max(0, Math.floor(children));
  const roomSubtotal = (baseRate * sanitizedAdults + (baseRate * 0.5) * sanitizedChildren) * nights;

  // 3. Park Fees Math
  let parkFeesTotal = 0;
  if (parkFees) {
    const perPersonFee = parkFees.conservationFee[residency] ?? parkFees.conservationFee.INTERNATIONAL;
    parkFeesTotal = (perPersonFee * (sanitizedAdults + sanitizedChildren)) + 
                     parkFees.craterServiceFee + 
                     parkFees.vehiclePermitFee;
  }

  const subtotalBase = roomSubtotal + parkFeesTotal;
  const agencyFee = subtotalBase * AGENCY_FEE_PERCENTAGE;
  const vat = (subtotalBase + agencyFee) * VAT_RATE;

  return {
    nights,
    subtotalBase: Math.round(subtotalBase),
    agencyFee: Math.round(agencyFee),
    vat: Math.round(vat),
    parkFeesTotal: Math.round(parkFeesTotal),
    totalAmount: Math.round(subtotalBase + agencyFee + vat)
  };
};