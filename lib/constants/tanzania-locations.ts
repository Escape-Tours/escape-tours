export interface LocationItem {
  id: string;
  name: string;
  category: 'Airport' | 'National Park' | 'Hotel' | 'City / Hub';
  region: string;
  code?: string; // IATA code for airports
}

export const TANZANIA_LOCATIONS: LocationItem[] = [
  // --- MAJOR AIRPORTS & AIRSTRIPS ---
  { id: 'dar', name: 'Julius Nyerere International Airport (DAR)', category: 'Airport', region: 'Dar es Salaam', code: 'DAR' },
  { id: 'jro', name: 'Kilimanjaro International Airport (JRO)', category: 'Airport', region: 'Kilimanjaro', code: 'JRO' },
  { id: 'znz', name: 'Abeid Amani Karume International Airport (ZNZ)', category: 'Airport', region: 'Zanzibar', code: 'ZNZ' },
  { id: 'ark', name: 'Arusha Airport (ARK)', category: 'Airport', region: 'Arusha', code: 'ARK' },
  { id: 'seronera', name: 'Seronera Airstrip', category: 'Airport', region: 'Serengeti', code: 'SEU' },
  { id: 'kogatende', name: 'Kogatende Airstrip', category: 'Airport', region: 'Northern Serengeti', code: 'KOT' },
  { id: 'manyara-air', name: 'Lake Manyara Airstrip', category: 'Airport', region: 'Manyara', code: 'LKY' },
  { id: 'dodoma', name: 'Dodoma Airport', category: 'Airport', region: 'Dodoma', code: 'DOD' },
  { id: 'mwanza', name: 'Mwanza Airport', category: 'Airport', region: 'Mwanza', code: 'MWZ' },
  { id: 'songwe', name: 'Songwe International Airport (Mbeya)', category: 'Airport', region: 'Mbeya', code: 'MBI' },
  { id: 'kigoma', name: 'Kigoma Airport', category: 'Airport', region: 'Kigoma', code: 'TKQ' },
  { id: 'bukoba', name: 'Bukoba Airport', category: 'Airport', region: 'Kagera', code: 'BKZ' },
  { id: 'mafia', name: 'Mafia Airport', category: 'Airport', region: 'Pwani', code: 'MFA' },

  // --- NATIONAL PARKS & CONSERVATION AREAS ---
  { id: 'serengeti', name: 'Serengeti National Park', category: 'National Park', region: 'Mara/Simiyu' },
  { id: 'ngorongoro', name: 'Ngorongoro Crater Conservation Area', category: 'National Park', region: 'Arusha' },
  { id: 'kilimanjaro-np', name: 'Kilimanjaro National Park', category: 'National Park', region: 'Kilimanjaro' },
  { id: 'tarangire', name: 'Tarangire National Park', category: 'National Park', region: 'Manyara' },
  { id: 'lake-manyara', name: 'Lake Manyara National Park', category: 'National Park', region: 'Manyara' },
  { id: 'arusha-np', name: 'Arusha National Park', category: 'National Park', region: 'Arusha' },
  { id: 'nyerere', name: 'Nyerere National Park (Selous)', category: 'National Park', region: 'Rufiji' },
  { id: 'mikumi', name: 'Mikumi National Park', category: 'National Park', region: 'Morogoro' },
  { id: 'ruaha', name: 'Ruaha National Park', category: 'National Park', region: 'Iringa' },
  { id: 'saadani', name: 'Saadani National Park', category: 'National Park', region: 'Pwani' },
  { id: 'katavi', name: 'Katavi National Park', category: 'National Park', region: 'Katavi' },
  { id: 'mahale', name: 'Mahale Mountains National Park', category: 'National Park', region: 'Kigoma' },
  { id: 'gombe', name: 'Gombe Stream National Park', category: 'National Park', region: 'Kigoma' },
  { id: 'mkomazi', name: 'Mkomazi National Park', category: 'National Park', region: 'Tanga/Kilimanjaro' },
  { id: 'udzungwa', name: 'Udzungwa Mountains National Park', category: 'National Park', region: 'Iringa/Morogoro' },
  { id: 'rubondo', name: 'Rubondo Island National Park', category: 'National Park', region: 'Geita' },
  { id: 'kitulo', name: 'Kitulo National Park', category: 'National Park', region: 'Njombe' },
  { id: 'burigi', name: 'Burigi-Chato National Park', category: 'National Park', region: 'Geita/Kagera' },

  // --- POPULAR HOTELS & LODGES (Catering to major hubs) ---
  { id: 'serena-arusha', name: 'Arusha Serena Hotel, Resort & Spa', category: 'Hotel', region: 'Arusha' },
  { id: 'ngorongoro-serena', name: 'Ngorongoro Serena Safari Lodge', category: 'Hotel', region: 'Ngorongoro' },
  { id: 'serengeti-serena', name: 'Serengeti Serena Safari Lodge', category: 'Hotel', region: 'Serengeti' },
  { id: 'four-seasons-serengeti', name: 'Four Seasons Safari Lodge Serengeti', category: 'Hotel', region: 'Serengeti' },
  { id: 'MANYARA-SERENA', name: 'Lake Manyara Serena Safari Lodge', category: 'Hotel', region: 'Manyara' },
  { id: 'hyatt-dar', name: 'Hyatt Regency Dar es Salaam, The Kilimanjaro', category: 'Hotel', region: 'Dar es Salaam' },
  { id: 'sea-cliff-znz', name: 'Sea Cliff Resort & Spa Zanzibar', category: 'Hotel', region: 'Zanzibar' },
  { id: 'emelda-arusha', name: 'Mount Meru Hotel', category: 'Hotel', region: 'Arusha' }
];