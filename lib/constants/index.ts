// lib/constants/index.ts

export type ResidencyTier = 'CITIZEN' | 'RESIDENT' | 'INTERNATIONAL';

export const TAX_RATE = 0.18;
export const AGENCY_COMMISSION = 0.20;

export interface TieredPrice {
  CITIZEN?: number;
  RESIDENT?: number;
  INTERNATIONAL?: number;
  // Allows for recursive/nested structures
  [key: string]: any; 
}

export const resolvePrice = (
  priceData: TieredPrice | number | undefined, 
  tier: ResidencyTier
): number => {
  // 1. Primitive handling
  if (typeof priceData === 'number') return priceData;
  if (!priceData || typeof priceData !== 'object') return 0;

  // 2. Recursive search: Look deep into nested price structures first
  // We use Object.keys to iterate safely over the object
  for (const key of Object.keys(priceData)) {
    const value = priceData[key];
    if (typeof value === 'object' && value !== null) {
      const nestedResult = resolvePrice(value as TieredPrice, tier);
      if (nestedResult !== 0) return nestedResult;
    }
  }

  // 3. Direct tier match or base fallback
  if (typeof priceData[tier] === 'number') {
    return priceData[tier] as number;
  }
  
  if (typeof priceData.INTERNATIONAL === 'number') {
    return priceData.INTERNATIONAL as number;
  }

  return 0;
};

// Comprehensive Nationwide Fleet & Dispatch Hub Locations (Airports, Major Cities, Coastal, and Safari Circuit Hotels)
export const SAFARI_LOCATIONS = [
  // --- Dar es Salaam & Coastal Hubs ---
  "Julius Nyerere International Airport (DAR)",
  "Hyatt Regency Dar es Salaam (The Kilimanjaro)",
  "Dar es Salaam Serena Hotel",
  "Johari Rotana",
  "Sea Cliff Hotel, Masaki",
  "Hotel Slipway, Msasani Peninsula",
  "Four Points by Sheraton Dar es Salaam New Africa",
  "Ramada Resort by Wyndham Dar es Salaam",
  "Southern Sun Dar es Salaam",
  "Golden Tulip Dar es Salaam",
  "Mediterraneo Hotel & Restaurant, Kawe Beach",
  "Best Western Jangwani Sea Breeze Hotel",
  "White Sands Resort & Conference Centre",

  // --- Arusha & Northern Circuit Gateway ---
  "Kilimanjaro International Airport (JRO)",
  "Gran Melia Arusha",
  "Arusha Serena Hotel (Lake Duluti)",
  "Mount Meru Hotel",
  "Kibo Palace Hotel",
  "The Arusha Coffee Lodge",
  "The Legendary Lodge",
  "Rivertrees Country Inn",
  "The African Tulip",
  "Arusha City Center",
  "Arusha National Park",

  // --- Moshi & Kilimanjaro Foothills ---
  "Parkview Inn Hotel",
  "Chanya Lodge",
  "Altezza Lodge",
  "Springlands Hotel",
  "Moshi Leopard Hotel",
  "Africa Amini Maasai Lodge",

  // --- Serengeti National Park ---
  "Seronera Airstrip (Serengeti)",
  "Serenada Seronera Wildlife Lodge",
  "Four Seasons Safari Lodge Serengeti",
  "Serengeti Serena Safari Lodge",
  "Melia Serengeti Lodge",
  "Singita Sasakwa Lodge",
  "AndBeyond Serengeti Under Canvas",

  // --- Ngorongoro Crater ---
  "Ngorongoro Crater Rim",
  "Ngorongoro Serena Safari Lodge",
  "Ngorongoro Crater Lodge (AndBeyond)",
  "Gibb's Farm (Karatu)",
  "Kitela Lodge (Karatu)",
  "Ngorongoro Farm House",

  // --- Tarangire & Lake Manyara ---
  "Tarangire Main Gate",
  "Tarangire Treetops",
  "Tarangire Sopa Lodge",
  "Ndolie Lodge Tarangire",
  "Lake Manyara National Park",
  "Lake Manyara Tree Lodge",
  "Lake Manyara Serena Safari Lodge",
  "Escarpment Luxury Lodge Manyara",

  // --- Southern Circuit (Mikumi, Selous / Nyerere, Ruaha) ---
  "Mikumi Gate",
  "Mikumi Wildlife Camp",
  "Stanley’s Kopje (Ruaha)",
  "Ruaha National Park",
  "Jongomero Camp (Ruaha)",
  "Nyerere National Park (Selous)",
  "Selous Serena Camp",
  "The Retreat Selous",

  // --- Zanzibar Archipelago ---
  "Abeid Amani Karume International Airport (ZNZ)",
  "Park Hyatt Zanzibar (Stone Town)",
  "Zuri Zanzibar (Nungwi)",
  "The Residence Zanzibar (Kizimkazi)",
  "Johari Beach Resort (Kizimkazi)",
  "Kwanza Resort by SUNRISE",
  "Fruit & Spice Wellness Resort Zanzibar",
  "Essque Zalu Zanzibar (Nungwi)",
  "Kendwa Rocks Beach Hotel"
] as const;

export type SafariLocation = (typeof SAFARI_LOCATIONS)[number];

// Hot Air Balloon Eligible Parks & Validation Helper
export const HOT_AIR_BALLOON_ELIGIBLE_LOCATIONS = [
  'serengeti',
  'tarangire',
  'ruaha',
  'selous',
  'nyerere'
] as const;

/**
 * Checks if a given location name supports hot air balloon excursions.
 */
export const isBalloonEligibleLocation = (locationName: string): boolean => {
  if (!locationName) return false;
  const lowerName = locationName.toLowerCase();
  return HOT_AIR_BALLOON_ELIGIBLE_LOCATIONS.some(park => lowerName.includes(park));
};

// --- Top Zanzibar Luxury Accommodations Catalog ---
export interface AccommodationItem {
  id: string;
  name: string;
  category: 'LODGES';
  region: 'ZANZIBAR';
  location_name: string;
  international_price: number;
  resident_price: number;
  citizen_price: number;
  lat: number;
  lng: number;
  description: string;
}

export const TOP_ZANZIBAR_ACCOMMODATIONS: AccommodationItem[] = [
  {
    id: 'zanzibar-mnemba-island',
    name: '&Beyond Mnemba Island',
    category: 'LODGES',
    region: 'ZANZIBAR',
    location_name: 'Mnemba Atoll, Northeast Coast',
    international_price: 1650,
    resident_price: 1200,
    citizen_price: 950,
    lat: -5.8234,
    lng: 39.3812,
    description: 'The pinnacle of barefoot luxury located on a private coral atoll off the northeast coast, offering absolute seclusion and pristine dive sites.'
  },
  {
    id: 'zanzibar-baraza-resort',
    name: 'Baraza Resort & Spa',
    category: 'LODGES',
    region: 'ZANZIBAR',
    location_name: 'Bwejuu-Paje, Southeast Coast',
    international_price: 950,
    resident_price: 700,
    citizen_price: 550,
    lat: -6.2145,
    lng: 39.5489,
    description: 'An opulent, all-inclusive luxury resort inspired by the grand heritage of the Omani sultanate era with hand-carved details and private plunge pools.'
  },
  {
    id: 'zanzibar-zuri-zanzibar',
    name: 'Zuri Zanzibar',
    category: 'LODGES',
    region: 'ZANZIBAR',
    location_name: 'Kendwa, Northwest Coast',
    international_price: 720,
    resident_price: 520,
    citizen_price: 410,
    lat: -5.7289,
    lng: 39.2934,
    description: 'A sophisticated and design-forward resort near Kendwa celebrated for its calm turquoise waters, vivid sunset views, and lush spice gardens.'
  },
  {
    id: 'zanzibar-kilindi',
    name: 'Elewana Kilindi Zanzibar',
    category: 'LODGES',
    region: 'ZANZIBAR',
    location_name: 'Nungwi, Northwest Coast',
    international_price: 1100,
    resident_price: 820,
    citizen_price: 650,
    lat: -5.7212,
    lng: 39.3021,
    description: 'An exclusive adults-only sanctuary featuring distinctive white-domed pavilion suites, private plunge pools, and dedicated private valets.'
  },
  {
    id: 'zanzibar-white-sand',
    name: 'Zanzibar White Sand Luxury Villas & Spa',
    category: 'LODGES',
    region: 'ZANZIBAR',
    location_name: 'Paje Beach, Southeast Coast',
    international_price: 880,
    resident_price: 640,
    citizen_price: 500,
    lat: -6.2587,
    lng: 39.5312,
    description: 'A premier eco-luxe retreat on Paje Beach offering expansive private villas, direct kiting and beach access, and world-class wellness facilities.'
  },
  {
    id: 'zanzibar-the-residence',
    name: 'The Residence Zanzibar',
    category: 'LODGES',
    region: 'ZANZIBAR',
    location_name: 'Kizimkazi, Southwest Coast',
    international_price: 850,
    resident_price: 610,
    citizen_price: 480,
    lat: -6.4523,
    lng: 39.4621,
    description: 'Nestled along a tranquil 32-hectare forested estate featuring lavish standalone villas with private pools and secluded beachfront.'
  },
  {
    id: 'zanzibar-park-hyatt',
    name: 'Park Hyatt Zanzibar',
    category: 'LODGES',
    region: 'ZANZIBAR',
    location_name: 'Stone Town Waterfront',
    international_price: 550,
    resident_price: 400,
    citizen_price: 320,
    lat: -6.1659,
    lng: 39.2026,
    description: 'The ultimate heritage luxury destination located right on the beachfront of Stone Town, blending historic Swahili architecture with modern five-star elegance.'
  }
];