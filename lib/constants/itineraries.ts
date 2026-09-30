// lib/constants/itineraries.ts

export interface ItineraryDay {
  day_number: number;
  title: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  bullets?: string[];
  accommodation?: string;
}

export interface CostComponent {
  accommodationTotal: number;
  transportTotal: number;
  parkFeesTotal: number;
  activitiesTotal: number;
  subtotal: number;
  vat: number;
  agencyFee: number;
  grandTotal: number;
}

export interface SafariPackage {
  id: string;
  title: string;
  circuit: 'NORTHERN' | 'SOUTHERN' | 'ZANZIBAR';
  duration_days: number;
  tagline: string;
  starting_hub: string;
  image_url: string;
  lodging_name: string;
  pricing: {
    INTERNATIONAL: CostComponent;
    RESIDENT: CostComponent;
    CITIZEN: CostComponent;
  };
  days: ItineraryDay[];
}

export const EXTENDED_SAFARI_PACKAGES: SafariPackage[] = [
  // ==========================================
  // SOUTHERN CIRCUIT: 2-DAY SELOUS EXPEDITION
  // ==========================================
  {
    id: 'selous-2d-expedition',
    title: '2-Day Selous (Nyerere National Park) Expedition',
    circuit: 'SOUTHERN',
    duration_days: 2,
    tagline: 'Experience an unforgettable 2-day wilderness adventure featuring classic game drives, a tranquil Rufiji River boat safari, and an immersive walking safari led by armed rangers.',
    starting_hub: 'Dar es Salaam (DAR)',
    image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Selous Kinga Lodge (Full Board)',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 480, transportTotal: 750, parkFeesTotal: 118, activitiesTotal: 350, subtotal: 1698, vat: 305.64, agencyFee: 339.60, grandTotal: 2343 },
      RESIDENT: { accommodationTotal: 380, transportTotal: 750, parkFeesTotal: 60, activitiesTotal: 280, subtotal: 1470, vat: 264.60, agencyFee: 294, grandTotal: 2029 },
      CITIZEN: { accommodationTotal: 280, transportTotal: 600, parkFeesTotal: 30, activitiesTotal: 200, subtotal: 1110, vat: 199.80, agencyFee: 222, grandTotal: 1532 }
    },
    days: [
      {
        day_number: 1,
        title: 'Arrival, Game Drive & Sunset on the Rufiji River',
        accommodation: 'Selous Kinga Lodge (Full Board)',
        bullets: [
          'Arrival & Check-In: Settle into Selous Kinga Lodge and enjoy a delicious lunch overlooking the river.',
          'Afternoon Game Drive: Explore the expansive plains for elephants, giraffes, zebras, and lions.',
          'Sunset Boat Safari: Cruise the scenic Rufiji River surrounded by hippos, Nile crocodiles, and vibrant waterbirds.'
        ]
      },
      {
        day_number: 2,
        title: 'Walking Safari, Game Drive & Departure',
        accommodation: 'Selous Kinga Lodge (Breakfast & Brunch)',
        bullets: [
          'Dawn Walking Safari: Embark on an immersive wilderness experience on foot with armed rangers for tracking and flora examination.',
          'Brunch & Check-Out: Enjoy a relaxed late breakfast and final scenic river views before departure.',
          'Departure: Board your return 4x4 transfer back to Dar es Salaam.'
        ]
      }
    ]
  },

  // ==========================================
  // NORTHERN CIRCUIT PACKAGES
  // ==========================================
  {
    id: 'northern-circuit-2d',
    title: 'Northern Express: 2 Days Ngorongoro Crater & Tarangire',
    circuit: 'NORTHERN',
    duration_days: 2,
    tagline: 'A fast-paced weekend getaway into Tanzania’s iconic northern wildlife sanctuaries.',
    starting_hub: 'Arusha / Kilimanjaro Airport (JRO)',
    image_url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Marera Valley Lodge / Karatu Safari Lodge',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 520, transportTotal: 800, parkFeesTotal: 250, activitiesTotal: 300, subtotal: 1870, vat: 336.60, agencyFee: 374, grandTotal: 2580 },
      RESIDENT: { accommodationTotal: 400, transportTotal: 800, parkFeesTotal: 120, activitiesTotal: 240, subtotal: 1560, vat: 280.80, agencyFee: 312, grandTotal: 2153 },
      CITIZEN: { accommodationTotal: 300, transportTotal: 650, parkFeesTotal: 50, activitiesTotal: 180, subtotal: 1180, vat: 212.40, agencyFee: 236, grandTotal: 1628 }
    },
    days: [
      {
        day_number: 1,
        title: 'Arusha to Tarangire National Park',
        accommodation: 'Marera Valley Lodge, Karatu',
        morning: 'Early morning pickup from Arusha and drive to Tarangire National Park, famed for giant baobabs and elephant herds.',
        afternoon: 'Full afternoon game drive along the Tarangire River system.',
        evening: 'Dinner and overnight at a safari lodge near Karatu.'
      },
      {
        day_number: 2,
        title: 'Ngorongoro Crater Floor & Return to Arusha',
        accommodation: 'None (Departure evening)',
        morning: 'Early descent 600 meters into the Ngorongoro Crater floor for high-density Big Five wildlife viewing.',
        afternoon: 'Ascend the crater rim with a picnic lunch and drive back to Arusha.',
        evening: 'Drop-off at your hotel or Kilimanjaro International Airport.'
      }
    ]
  },
  {
    id: 'northern-circuit-4d',
    title: 'Northern Panorama: 4 Days Tarangire, Serengeti & Ngorongoro',
    circuit: 'NORTHERN',
    duration_days: 4,
    tagline: 'The ultimate classic northern circuit adventure covering three world heritage ecosystems.',
    starting_hub: 'Arusha / Kilimanjaro Airport (JRO)',
    image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Serengeti Tented Camp & Ngorongoro Rim Lodge',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 1350, transportTotal: 1600, parkFeesTotal: 580, activitiesTotal: 450, subtotal: 3980, vat: 716.40, agencyFee: 796, grandTotal: 5492 },
      RESIDENT: { accommodationTotal: 1050, transportTotal: 1600, parkFeesTotal: 240, activitiesTotal: 360, subtotal: 3250, vat: 585, agencyFee: 650, grandTotal: 4485 },
      CITIZEN: { accommodationTotal: 800, transportTotal: 1300, parkFeesTotal: 100, activitiesTotal: 280, subtotal: 2480, vat: 446.40, agencyFee: 496, grandTotal: 3422 }
    },
    days: [
      {
        day_number: 1,
        title: 'Arusha to Tarangire National Park',
        accommodation: 'Tarangire Safari Lodge',
        morning: 'Depart Arusha for Tarangire National Park.',
        afternoon: 'Afternoon game drive tracking elephants and lions among iconic baobabs.',
        evening: 'Dinner and overnight at a luxury tented camp.'
      },
      {
        day_number: 2,
        title: 'Tarangire to Central Serengeti (Seronera)',
        accommodation: 'Serengeti Heritage Tented Camp',
        morning: 'Scenic drive through the Ngorongoro Conservation Area down into the Serengeti plains.',
        afternoon: 'Serengeti Seronera Valley game drive targeting leopards and cheetahs.',
        evening: 'Overnight in the heart of the Serengeti.'
      },
      {
        day_number: 3,
        title: 'Full-Day Serengeti Exploration',
        accommodation: 'Serengeti Heritage Tented Camp',
        morning: 'Sunrise game drive across the endless savannah tracking active predator movements.',
        afternoon: 'Explore river systems and kopjes for resident wildlife.',
        evening: 'Sunset views over the wilderness.'
      },
      {
        day_number: 4,
        title: 'Ngorongoro Crater to Arusha',
        accommodation: 'None',
        morning: 'Morning transit to Ngorongoro Crater and game drive on the crater floor.',
        afternoon: 'Ascend and enjoy a scenic return drive to Arusha.',
        evening: 'End of expedition.'
      }
    ]
  },
  {
    id: 'northern-circuit-7d',
    title: 'Grand Serengeti & Ngorongoro Migration Odyssey: 7 Days',
    circuit: 'NORTHERN',
    duration_days: 7,
    tagline: 'An immersive 7-day deep dive into Lake Manyara, Serengeti, Ngorongoro, and Tarangire.',
    starting_hub: 'Arusha / Kilimanjaro Airport (JRO)',
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Multi-Location Luxury Circuit Lodges',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 2650, transportTotal: 2800, parkFeesTotal: 980, activitiesTotal: 750, subtotal: 7180, vat: 1292.40, agencyFee: 1436, grandTotal: 9908 },
      RESIDENT: { accommodationTotal: 2100, transportTotal: 2800, parkFeesTotal: 420, activitiesTotal: 600, subtotal: 5920, vat: 1065.60, agencyFee: 1184, grandTotal: 8170 },
      CITIZEN: { accommodationTotal: 1600, transportTotal: 2200, parkFeesTotal: 180, activitiesTotal: 450, subtotal: 4430, vat: 797.40, agencyFee: 886, grandTotal: 6113 }
    },
    days: [
      {
        day_number: 1,
        title: 'Arusha to Lake Manyara National Park',
        accommodation: 'Lake Manyara Wildlife Lodge',
        morning: 'Depart Arusha for Lake Manyara, famous for tree-climbing lions and flamingos.',
        afternoon: 'Forest groundwater game drive and lake shore exploration.',
        evening: 'Dinner and overnight near Lake Manyara.'
      },
      {
        day_number: 2,
        title: 'Lake Manyara to Serengeti National Park',
        accommodation: 'Serengeti Serena Safari Lodge',
        morning: 'Drive up the Rift Valley wall toward the Serengeti plains.',
        afternoon: 'Afternoon game drive in the Seronera region.',
        evening: 'Overnight at a Serengeti luxury lodge.'
      },
      {
        day_number: 3,
        title: 'Northern/Central Serengeti Migration Tracking',
        accommodation: 'Serengeti Serena Safari Lodge',
        morning: 'Full day tracking migration herds or river crossings depending on the season.',
        afternoon: 'Extended wilderness game drive with expert guide.',
        evening: 'Fireside storytelling under the African sky.'
      },
      {
        day_number: 4,
        title: 'Serengeti National Park Full Day',
        accommodation: 'Serengeti Serena Safari Lodge',
        morning: 'Sunrise balloon safari (optional) or morning game tracking.',
        afternoon: 'Visit kopjes and permanent water pools.',
        evening: 'Overnight in Serengeti.'
      },
      {
        day_number: 5,
        title: 'Serengeti to Ngorongoro Crater Rim',
        accommodation: 'Ngorongoro Serena Safari Lodge',
        morning: 'Morning game drive as you exit the Serengeti towards Ngorongoro.',
        afternoon: 'Arrive at the crater rim; relax and enjoy panoramic sunset views.',
        evening: 'Overnight on the Crater Rim.'
      },
      {
        day_number: 6,
        title: 'Ngorongoro Crater Floor Explorer',
        accommodation: 'Gibb’s Farm or Karatu Lodge',
        morning: 'Descend to the crater floor for a comprehensive wildlife game drive.',
        afternoon: 'Ascend and visit a traditional Maasai Boma.',
        evening: 'Dinner and overnight in Karatu.'
      },
      {
        day_number: 7,
        title: 'Tarangire National Park & Return to Arusha',
        accommodation: 'None',
        morning: 'Morning game drive in Tarangire National Park.',
        afternoon: 'Return transfer back to Arusha or Kilimanjaro Airport.',
        evening: 'Departure.'
      }
    ]
  },

  // ==========================================
  // SOUTHERN CIRCUIT PACKAGES
  // ==========================================
  {
    id: 'southern-circuit-3d',
    title: 'Southern Quick Escape: 3 Days Mikumi Wilderness',
    circuit: 'SOUTHERN',
    duration_days: 3,
    tagline: 'An accessible, wildlife-rich weekend safari starting straight from Dar es Salaam.',
    starting_hub: 'Dar es Salaam (DAR)',
    image_url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Mikumi Wildlife Camp',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 720, transportTotal: 1100, parkFeesTotal: 180, activitiesTotal: 250, subtotal: 2250, vat: 405, agencyFee: 450, grandTotal: 3105 },
      RESIDENT: { accommodationTotal: 580, transportTotal: 1100, parkFeesTotal: 90, activitiesTotal: 200, subtotal: 1970, vat: 354.60, agencyFee: 394, grandTotal: 2719 },
      CITIZEN: { accommodationTotal: 420, transportTotal: 900, parkFeesTotal: 45, activitiesTotal: 150, subtotal: 1515, vat: 272.70, agencyFee: 303, grandTotal: 2091 }
    },
    days: [
      {
        day_number: 1,
        title: 'Dar es Salaam to Mikumi National Park',
        accommodation: 'Mikumi Wildlife Camp',
        morning: 'Early morning departure from Dar es Salaam driving westward toward Mikumi.',
        afternoon: 'Afternoon game drive across the sweeping Mkata Floodplain.',
        evening: 'Dinner and overnight at a park lodge.'
      },
      {
        day_number: 2,
        title: 'Full-Day Game Tracking in Mikumi',
        accommodation: 'Mikumi Wildlife Camp',
        morning: 'Full day exploring hippos at the Hippo Pools and tracking elephant herds.',
        afternoon: 'Afternoon leopard and lion tracking sessions.',
        evening: 'Overnight at lodge.'
      },
      {
        day_number: 3,
        title: 'Mikumi to Dar es Salaam',
        accommodation: 'None',
        morning: 'Morning bush walk or final short game drive.',
        afternoon: 'Drive back to Dar es Salaam with arrival by late afternoon.',
        evening: 'End of tour.'
      }
    ]
  },
  {
    id: 'southern-circuit-6d',
    title: 'Southern Circuit Expedition: 6 Days Selous, Mikumi & Udzungwa',
    circuit: 'SOUTHERN',
    duration_days: 6,
    tagline: 'Off-the-path wilderness, boat safaris on the Rufiji River, and primate tracking.',
    starting_hub: 'Dar es Salaam (DAR)',
    image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Selous Kinga & Mikumi Lodge',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 1450, transportTotal: 2200, parkFeesTotal: 360, activitiesTotal: 650, subtotal: 4660, vat: 838.80, agencyFee: 932, grandTotal: 6431 },
      RESIDENT: { accommodationTotal: 1150, transportTotal: 2200, parkFeesTotal: 180, activitiesTotal: 500, subtotal: 4030, vat: 725.40, agencyFee: 806, grandTotal: 5561 },
      CITIZEN: { accommodationTotal: 880, transportTotal: 1800, parkFeesTotal: 90, activitiesTotal: 380, subtotal: 3150, vat: 567, agencyFee: 630, grandTotal: 4347 }
    },
    days: [
      {
        day_number: 1,
        title: 'Arrival & Rufiji River Boat Safari',
        accommodation: 'Selous Kinga Lodge',
        morning: 'Pickup from Dar es Salaam for a scenic drive to Nyerere National Park (Selous).',
        afternoon: 'Afternoon boat safari along the Rufiji River to view hippos and crocodiles.',
        evening: 'Overnight at a tented camp.'
      },
      {
        day_number: 2,
        title: 'Game Drives & Walking Safari in Selous',
        accommodation: 'Selous Kinga Lodge',
        morning: 'Full-day game drive across Africa’s largest game reserve.',
        afternoon: 'Guided walking safari with armed rangers.',
        evening: 'Campfire dinner.'
      },
      {
        day_number: 3,
        title: 'Transit to Mikumi National Park',
        accommodation: 'Mikumi Safari Lodge',
        morning: 'Overland drive northward toward Mikumi.',
        afternoon: 'Introductory evening game drive.',
        evening: 'Overnight at Mikumi lodge.'
      },
      {
        day_number: 4,
        title: 'Mikumi Floodplain Wildlife Exploration',
        accommodation: 'Mikumi Safari Lodge',
        morning: 'Full day tracking lions, giraffes, and buffaloes.',
        afternoon: 'Visit waterhole observation sites.',
        evening: 'Overnight lodge.'
      },
      {
        day_number: 5,
        title: 'Udzungwa Mountains Waterfall Hike',
        accommodation: 'Udzungwa Forest Camp',
        morning: 'Hike through lush rainforests to the Sanje Waterfalls.',
        afternoon: 'Swimming in natural rock pools.',
        evening: 'Overnight near Udzungwa.'
      },
      {
        day_number: 6,
        title: 'Return to Dar es Salaam',
        accommodation: 'None',
        morning: 'Breakfast and return transfer to Dar es Salaam.',
        evening: 'Departure.'
      }
    ]
  },

  // ==========================================
  // ZANZIBAR ESCAPES PACKAGES
  // ==========================================
  {
    id: 'zanzibar-escape-3d',
    title: 'Zanzibar Express Retreat: 3 Days Stone Town & Beach',
    circuit: 'ZANZIBAR',
    duration_days: 3,
    tagline: 'A relaxing coastal escape blending spice tours, historic alleyways, and pristine beaches.',
    starting_hub: 'Abeid Amani Karume International Airport (ZNZ)',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Park Hyatt & Zuri Zanzibar',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 1450, transportTotal: 450, parkFeesTotal: 120, activitiesTotal: 380, subtotal: 2400, vat: 432, agencyFee: 480, grandTotal: 3312 },
      RESIDENT: { accommodationTotal: 1100, transportTotal: 400, parkFeesTotal: 80, activitiesTotal: 300, subtotal: 1880, vat: 338.40, agencyFee: 376, grandTotal: 2594 },
      CITIZEN: { accommodationTotal: 850, transportTotal: 350, parkFeesTotal: 40, activitiesTotal: 220, subtotal: 1460, vat: 262.80, agencyFee: 292, grandTotal: 2015 }
    },
    days: [
      {
        day_number: 1,
        title: 'Stone Town Heritage & Spice Farm Tour',
        accommodation: 'Park Hyatt Zanzibar',
        morning: 'Arrival at ZNZ Airport and check-in at Stone Town hotel. Guided walking tour through historic winding alleyways.',
        afternoon: 'Immersive Spice Farm tour tasting tropical fruits and aromatic spices.',
        evening: 'Dinner at Forodhani Gardens waterfront.'
      },
      {
        day_number: 2,
        title: 'Mnemba Atoll Snorkeling & North Coast Beach',
        accommodation: 'Zuri Zanzibar Resort',
        morning: 'Excursion to Mnemba Atoll for world-class snorkeling and dolphin spotting.',
        afternoon: 'Transfer to a luxury beach resort in Nungwi or Kendwa.',
        evening: 'Sunset dinner by the Indian Ocean.'
      },
      {
        day_number: 3,
        title: 'Coastal Leisure & Departure',
        accommodation: 'None',
        morning: 'At leisure on the white sand beaches or spa treatment.',
        afternoon: 'Transfer to Abeid Amani Karume International Airport for departure flight.',
        evening: 'End of tour.'
      }
    ]
  },
  {
    id: 'zanzibar-escape-5d',
    title: 'Zanzibar Island Luxury Hideaway: 5 Days',
    circuit: 'ZANZIBAR',
    duration_days: 5,
    tagline: 'The ultimate luxury island holiday featuring private boat charters, Jozani forest, and sunset dhow cruises.',
    starting_hub: 'Abeid Amani Karume International Airport (ZNZ)',
    image_url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=1200',
    lodging_name: 'Baraza Resort & Spa / The Residence',
    pricing: {
      INTERNATIONAL: { accommodationTotal: 3100, transportTotal: 750, parkFeesTotal: 200, activitiesTotal: 650, subtotal: 4700, vat: 846, agencyFee: 940, grandTotal: 6486 },
      RESIDENT: { accommodationTotal: 2400, transportTotal: 650, parkFeesTotal: 120, activitiesTotal: 500, subtotal: 3670, vat: 660.60, agencyFee: 734, grandTotal: 5065 },
      CITIZEN: { accommodationTotal: 1850, transportTotal: 550, parkFeesTotal: 60, activitiesTotal: 380, subtotal: 2840, vat: 511.20, agencyFee: 568, grandTotal: 3919 }
    },
    days: [
      {
        day_number: 1,
        title: 'Arrival & Stone Town Waterfront Check-in',
        accommodation: 'Park Hyatt Zanzibar',
        morning: 'Airport pickup and check-in at a heritage waterfront hotel.',
        afternoon: 'Leisurely historical walking tour of Stone Town architectural landmarks.',
        evening: 'Sunset dinner overlooking the ocean.'
      },
      {
        day_number: 2,
        title: 'Jozani Forest Red Colobus & Paje Beach',
        accommodation: 'Baraza Resort & Spa',
        morning: 'Morning tour of Jozani Chwaka Bay National Park to see endemic red colobus monkeys.',
        afternoon: 'Transfer to southeast coast (Paje/Jambiani) for kite-surfing or beach relaxation.',
        evening: 'Overnight beach villa.'
      },
      {
        day_number: 3,
        title: 'Safari Blue Full-Day Boat Excursion',
        accommodation: 'Baraza Resort & Spa',
        morning: 'Full-day traditional dhow sailing trip around mangrove lagoons and sandbanks.',
        afternoon: 'Seafood barbecue lunch on Kwale Island with snorkeling.',
        evening: 'Return to resort for evening relaxation.'
      },
      {
        day_number: 4,
        title: 'North Coast Sunset Dhow Cruise & Leisure',
        accommodation: 'Baraza Resort & Spa',
        morning: 'Day at leisure enjoying resort amenities or diving.',
        afternoon: 'Classic sunset dhow cruise with refreshments.',
        evening: 'Farewell seafood dinner.'
      },
      {
        day_number: 5,
        title: 'Departure from Zanzibar',
        accommodation: 'None',
        morning: 'Final morning swim and breakfast.',
        afternoon: 'Private transfer to ZNZ airport for your onward journey.',
        evening: 'Tour concludes.'
      }
    ]
  }
];