import { HotelData } from "@/lib/types/HotelParkFees";

export const INVENTORY: readonly HotelData[] = [
  {
    id: "serengeti-migration-lodge",
    name: "Serengeti Migration Lodge",
    slug: "serengeti-migration-lodge",
    type: "hotel",
    hero_image: "/images/lodge-hero.jpg",
    location: { lat: -2.33, lng: 34.83, address: "Serengeti, Tanzania" },
    room_categories: ["Luxury Suite"],
    room_images: { "Luxury Suite": "/images/suite.jpg" },
    room_prices: { "Luxury Suite": { low: 2300, high: 2500 } },
    lodge_environment: { images: ["/images/view.jpg"] },
    prices: { low: 2300, high: 2500 },
    priceRange: { low: 2300, high: 2500 },
    vatRate: 0.18,
    seo: { 
      title: "Luxury Safari Lodge in Serengeti", 
      description: "Experience the ultimate safari luxury.", 
      keywords: ["safari", "serengeti"] 
    },
    image: "/images/lodge-hero.jpg",
    rating: 5,
    gallery: [{ url: "/images/lodge-hero.jpg", alt: "View", priority: 1 }],
    amenities: ["WiFi"],
    updatedAt: "2026-06-03T17:09:00Z",
    parkFees: {
      name: "Serengeti National Park",
      conservationFee: { INTERNATIONAL: 82.60, RESIDENT: 41.30, CITIZEN: 11800 },
      craterServiceFee: 0,
      vehiclePermitFee: 40.00,
      GuideFee: { INTERNATIONAL: 23.60, RESIDENT: 23.60, CITIZEN: 11800 },
      currency: "USD"
    },
  },
  {
    id: "ngorongoro-crater-safari",
    name: "Ngorongoro Crater Safari",
    slug: "ngorongoro-crater-safari",
    type: "park",
    hero_image: "/images/tours/ngorongoro-hero.jpg",
    location: { lat: -3.23, lng: 35.58, address: "Ngorongoro Conservation Area, Tanzania" },
    room_categories: ["Full Day Crater Tour"],
    room_images: { "Full Day Crater Tour": "/images/crater.jpg" },
    room_prices: { "Full Day Crater Tour": { low: 450, high: 450 } },
    lodge_environment: { images: ["/images/tours/crater-view.jpg"] },
    prices: { low: 450, high: 450 },
    priceRange: { low: 450, high: 450 },
    vatRate: 0.18,
    seo: { 
      title: "Ngorongoro Crater Safari", 
      description: "Ultimate volcanic caldera tour.", 
      keywords: ["safari", "ngorongoro"] 
    },
    image: "/images/tours/ngorongoro-hero.jpg",
    rating: 5,
    gallery: [{ url: "/images/tours/crater-view.jpg", alt: "Crater View", priority: 1 }],
    amenities: ["Game Drive", "Guide"],
    updatedAt: "2026-06-03T17:09:00Z",
    parkFees: {
      name: "Ngorongoro Conservation Area",
      conservationFee: { INTERNATIONAL: 70.80, RESIDENT: 35.40, CITIZEN: 11800 },
      craterServiceFee: 295.00,
      vehiclePermitFee: 40.00,
      GuideFee: { INTERNATIONAL: 23.60, RESIDENT: 23.60, CITIZEN: 11800 },
      currency: "USD"
    },
  }
] as const;