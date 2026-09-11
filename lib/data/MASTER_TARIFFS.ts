import { ParkFees } from '@/lib/types/TariffParkFees';

const DEFAULT_CHILD_MULTIPLIER = 0.5;
const DEFAULT_SEASONAL = {
  lowSeasonMonths: [4, 5, 11],
  lowSeasonMultiplier: 0.8
};

export const MASTER_TARIFFS: Record<string, ParkFees> = {
  SERENGETI: {
    parkId: 'SERENGETI',
    name: 'Serengeti National Park',
    baseRates: { INTERNATIONAL: 82.60, RESIDENT: 35.40, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 82.60, RESIDENT: 35.40, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  NGORONGORO: {
    parkId: 'NGORONGORO',
    name: 'Ngorongoro Conservation Area',
    baseRates: { INTERNATIONAL: 295, RESIDENT: 295, CITIZEN: 11800 },
    conservationFee: { INTERNATIONAL: 295, RESIDENT: 295, CITIZEN: 11800 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  TARANGIRE: {
    parkId: 'TARANGIRE',
    name: 'Tarangire National Park',
    baseRates: { INTERNATIONAL: 59.00, RESIDENT: 29.50, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 59.00, RESIDENT: 29.50, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  MANYARA: {
    parkId: 'MANYARA',
    name: 'Lake Manyara National Park',
    baseRates: { INTERNATIONAL: 59.00, RESIDENT: 29.50, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 59.00, RESIDENT: 29.50, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  ARUSHA_NP: {
    parkId: 'ARUSHA_NP',
    name: 'Arusha National Park',
    baseRates: { INTERNATIONAL: 59.00, RESIDENT: 29.50, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 59.00, RESIDENT: 29.50, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  KILIMANJARO: {
    parkId: 'KILIMANJARO',
    name: 'Kilimanjaro National Park',
    baseRates: { INTERNATIONAL: 82.60, RESIDENT: 35.40, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 82.60, RESIDENT: 35.40, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: 0.5
  },
  RUAHA: {
    parkId: 'RUAHA',
    name: 'Ruaha National Park',
    baseRates: { INTERNATIONAL: 35.40, RESIDENT: 17.70, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 35.40, RESIDENT: 17.70, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  NYERERE: {
    parkId: 'NYERERE',
    name: 'Nyerere National Park',
    baseRates: { INTERNATIONAL: 70.80, RESIDENT: 35.40, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 70.80, RESIDENT: 35.40, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  KATAVI: {
    parkId: 'KATAVI',
    name: 'Katavi National Park',
    baseRates: { INTERNATIONAL: 35.40, RESIDENT: 17.70, CITIZEN: 10000 },
    conservationFee: { INTERNATIONAL: 35.40, RESIDENT: 17.70, CITIZEN: 10000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    childMultiplier: DEFAULT_CHILD_MULTIPLIER,
    seasonalRates: DEFAULT_SEASONAL
  },
  MAHALE: {
    parkId: 'MAHALE',
    name: 'Mahale Mountains National Park',
    baseRates: { INTERNATIONAL: 94.40, RESIDENT: 47.20, CITIZEN: 5000 },
    conservationFee: { INTERNATIONAL: 94.40, RESIDENT: 47.20, CITIZEN: 5000 },
    currency: 'USD',
    requiresVAT: true,
    vatRate: 0.18,
    requiresPermit: true,
    isRemote: true,
    childMultiplier: 0.5
  },
  MESERANI: {
    parkId: 'MESERANI',
    name: 'Meserani Snake Park',
    baseRates: { INTERNATIONAL: 20.00, RESIDENT: 20.00, CITIZEN: 5000 },
    conservationFee: { INTERNATIONAL: 20.00, RESIDENT: 20.00, CITIZEN: 5000 },
    currency: 'USD',
    requiresVAT: false,
    vatRate: 0.18,
    childMultiplier: 0.5
  },
  THEMI_FALLS: {
    parkId: 'THEMI_FALLS',
    name: 'Themi Falls Leisure Park',
    baseRates: { INTERNATIONAL: 5.00, RESIDENT: 5.00, CITIZEN: 5000 },
    conservationFee: { INTERNATIONAL: 5.00, RESIDENT: 5.00, CITIZEN: 5000 },
    currency: 'USD',
    requiresVAT: false,
    vatRate: 0.18,
    childMultiplier: 0.5
  },
  AMANI: {
    parkId: 'AMANI',
    name: 'Amani Nature Forest Reserve',
    baseRates: { INTERNATIONAL: 10.00, RESIDENT: 5.00, CITIZEN: 2000 },
    conservationFee: { INTERNATIONAL: 10.00, RESIDENT: 5.00, CITIZEN: 2000 },
    currency: 'USD',
    requiresVAT: false,
    vatRate: 0.18,
    childMultiplier: 0.5
  },
  PUGU: {
    parkId: 'PUGU',
    name: 'Pugu Hills Nature Forest Reserve',
    baseRates: { INTERNATIONAL: 10.00, RESIDENT: 5.00, CITIZEN: 5000 },
    conservationFee: { INTERNATIONAL: 10.00, RESIDENT: 5.00, CITIZEN: 5000 },
    currency: 'USD',
    requiresVAT: false,
    vatRate: 0.18,
    childMultiplier: 0.5
  },
  DULUTI: {
    parkId: 'DULUTI',
    name: 'Lake Duluti Nature Reserve',
    baseRates: { INTERNATIONAL: 10.00, RESIDENT: 5.00, CITIZEN: 3000 },
    conservationFee: { INTERNATIONAL: 10.00, RESIDENT: 5.00, CITIZEN: 3000 },
    currency: 'USD',
    requiresVAT: false,
    vatRate: 0.18,
    childMultiplier: 0.5
  }
};