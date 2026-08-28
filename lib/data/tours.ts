// lib/types/tours.ts
export interface Highlight {
  text: string;
}

export interface Tour {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  duration: number; // Changed from string to number
  category: string;
  price: number;    // Changed from string to number
  highlights: string[];
  requiresPermit?: boolean;
}
// data/tours.ts
import { Tour } from "@/lib/types/tours";

export const TOURS: Tour[] = [
  {
    id: "east-african-residents",
    title: "5-Day East African Residents Package: Ngorongoro, Serengeti & Manyara",
    shortTitle: "East African Residents Package",
    description: "Special package designed for East African residents to experience the wonders of the Northern Circuit at exclusive rates.",
    image: "/images/itineraries/ear-package.jpg",
    duration: "5 Days",
    category: "Resident",
    price: "2,500",
    highlights: [
      "Ngorongoro Crater Floor Safari",
      "Serengeti National Park Game Drive",
      "Lake Manyara Wildlife Viewing",
      "Accommodation at Hellen's Lodge & Hippo Trails",
      "Special East African Resident Rates",
    ],
    requiresPermit: false,
  },
  {
    id: "zanzibar-beach-escape",
    title: "10-Day Zanzibar Island & Beach Relaxation Escape",
    shortTitle: "Zanzibar Beach Escape",
    description: "Immerse yourself in the tropical paradise of Zanzibar with pristine beaches, historic Stone Town, spice tours, and unforgettable island experiences.",
    image: "/images/zanzibar-beach-paradise.jpg",
    duration: "10 Days",
    category: "Beach",
    price: "6,500",
    highlights: [
      "Stone Town UNESCO Heritage Site",
      "Spice Farm Tours",
      "Prison Island & Giant Tortoises",
      "Dolphin Watching at Mnemba",
      "Jozani Forest Red Colobus Monkeys",
    ],
    requiresPermit: false,
  },
  {
    id: "southern-tanzania-safari",
    title: "13-Day Southern Tanzania Safari: Mikumi, Ruaha & Nyerere",
    shortTitle: "Southern Tanzania Safari",
    description: "Explore Tanzania's wild and remote southern circuit with incredible wildlife encounters in Mikumi, Ruaha, and Nyerere National Parks.",
    image: "/images/ruaha.jpg",
    duration: "13 Days",
    category: "Safari",
    price: "21,446",
    highlights: [
      "Ruaha National Park - Tanzania's Best-Kept Secret",
      "Boat Safari on Rufiji River",
      "Walking Safari in Nyerere",
      "Udzungwa Mountain Rainforest",
      "Mufindi Highlands Tea Estates",
    ],
    requiresPermit: true,
  },
  {
    id: "northern-tanzania-safari",
    title: "11-Day Northern Tanzania Safari: Serengeti & Ngorongoro",
    shortTitle: "Northern Tanzania Safari",
    description: "Witness the legendary Great Migration, explore the Ngorongoro Crater, and experience authentic cultural encounters with the Hadzabe tribe.",
    image: "/images/serengeti.jpg",
    duration: "11 Days",
    category: "Safari",
    price: "7,956",
    highlights: [
      "Great Wildebeest Migration",
      "Ngorongoro Crater - 7th Wonder",
      "Serengeti Big Five Safari",
      "Hadzabe Tribe Cultural Experience",
      "Lake Manyara Tree-Climbing Lions",
    ],
    requiresPermit: true,
  },
  {
    id: "safari-zanzibar-combo",
    title: "14-Day Tanzania Safari & Zanzibar Beach Escape",
    shortTitle: "Safari & Beach Combo",
    description: "The ultimate Tanzania experience combining thrilling wildlife safaris in Serengeti and Ngorongoro with relaxing beach days in Zanzibar.",
    image: "/images/ngorongoro.jpg",
    duration: "14 Days",
    category: "Combo",
    price: "8,159",
    highlights: [
      "Serengeti & Ngorongoro Safari",
      "Optional Hot Air Balloon Safari",
      "Lake Natron & Flamingos",
      "Zanzibar Beach Relaxation",
      "Stone Town & Spice Tours",
    ],
    requiresPermit: true,
  },
  {
    id: "ruaha-zanzibar-combo",
    title: "7-Day Southern Tanzania Safari (Ruaha) & Zanzibar Escape",
    shortTitle: "Ruaha & Zanzibar Combo",
    description: "Experience the wild beauty of Ruaha National Park followed by tropical relaxation in Zanzibar with dolphin tours and forest exploration.",
    image: "/images/mikumi.jpg",
    duration: "7 Days",
    category: "Combo",
    price: "4,376",
    highlights: [
      "Ruaha National Park Game Drives",
      "Prison Island Giant Tortoises",
      "Kizimkazi Dolphin Tour",
      "Jozani Forest Red Colobus Monkeys",
      "Stone Town Cultural Experience",
    ],
    requiresPermit: true,
  },
  {
    id: "kilimanjaro-marangu",
    title: "8-Day Mount Kilimanjaro Marangu Route Trek",
    shortTitle: "Kilimanjaro Marangu Route",
    description: "Climb Africa's highest peak via the Marangu Route with comfortable hut accommodation. Known as the 'Coca-Cola Route' for its gradual ascent.",
    image: "/images/marangu.jpg",
    duration: "8 Days",
    category: "Trekking",
    price: "2,986",
    highlights: [
      "Hut Accommodation on Mountain",
      "Acclimatization Day at Horombo",
      "Summit Uhuru Peak (5,895m)",
      "Rainforest & Alpine Desert Zones",
      "Summit Certificate Included",
    ],
    requiresPermit: true,
  },
  {
    id: "kilimanjaro-machame",
    title: "9-Day Mount Kilimanjaro Machame Route Trek",
    shortTitle: "Kilimanjaro Machame Route",
    description: "Conquer Kilimanjaro via the scenic Machame Route, known as the 'Whiskey Route'. Features stunning views and excellent acclimatization.",
    image: "/images/machame.jpg",
    duration: "9 Days",
    category: "Trekking",
    price: "2,986",
    highlights: [
      "Scenic Machame Route",
      "Great Barranco Wall Climb",
      "Summit Uhuru Peak (5,895m)",
      "Camping Under the Stars",
      "Professional Mountain Crew",
    ],
    requiresPermit: true,
  },
  {
    id: "northern-circuit-safari",
    title: "8-Day Tanzania Northern Safari Circuit",
    shortTitle: "Northern Circuit Safari",
    description: "Explore Tanzania's iconic northern parks including Tarangire, Ngorongoro Crater, Serengeti, and the stunning Lake Natron with its flamingos.",
    image: "/images/tarangire.jpg",
    duration: "8 Days",
    category: "Safari",
    price: "2,900",
    highlights: [
      "Tarangire Elephant Herds",
      "Ngorongoro Crater Floor Safari",
      "Serengeti Wildebeest Migration",
      "Lake Natron Flamingos",
      "Ngare Sero Waterfall Hike",
    ],
    requiresPermit: true,
  },
];