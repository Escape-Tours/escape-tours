import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Comprehensive inventory of airports, airstrips, and major hotels across Tanzania
const defaultInventory = [
  // Major International & Domestic Airports
  "Julius Nyerere International Airport (DAR) - Dar es Salaam",
  "Kilimanjaro International Airport (JRO) - Arusha/Moshi",
  "Abeid Amani Karume International Airport (ZNZ) - Zanzibar",
  "Arusha Airport (ARK) - Arusha",
  "Mwanza Airport (MWZ)",
  "Dodoma Airport (DOD)",
  "Songwe Airport (MBI) - Mbeya",
  "Tanga Airport (TGT)",
  "Bukoba Airport (BKZ)",
  "Mafia Airport (MFA)",

  // Safari Circuit Airstrips
  "Seronera Airstrip - Serengeti National Park",
  "Kogatende Airstrip - Northern Serengeti",
  "Lobo Airstrip - Serengeti",
  "Ndutu Airstrip - Southern Serengeti / Ngorongoro",
  "Lake Manyara Airstrip",
  "Tarangire Airstrip",
  "Manyara Airstrip",
  "Msembe Airstrip - Ruaha National Park",
  "Selous / Nyerere National Park Airstrips",
  "Katavi Airstrip",
  "Mahale / Greystoke Airstrip",

  // Major Cities & Hubs
  "Arusha City Center",
  "Stone Town, Zanzibar",
  "Zanzibar Stone Town",
  "Moshi Town Center",
  "Bagamoyo",
  "Mikumi National Park HQ",
  "Ngorongoro Crater Conservation Area",
  "Ngorongoro Crater rim",
  "Serengeti National Park Gate",
  "Tarangire National Park Gate",

  // Arusha & Moshi Hotels
  "Gran Meliá Arusha",
  "Four Points by Sheraton Arusha, The New Safari Hotel",
  "Mount Meru Hotel",
  "Arusha Coffee Lodge",
  "Arusha Serena Hotel",
  "Kibo Palace Hotel",

  // Serengeti Lodges & Camps
  "Serengeti Serena Safari Lodge",
  "Four Seasons Safari Lodge Serengeti",
  "Meliá Serengeti Lodge",
  "Serengeti Sopa Lodge",
  "Sayari Camp",
  "Grumeti Migration Camp",
  "Singita Sasakwa Lodge",
  "Olakira Camp",

  // Ngorongoro & Manyara Lodges
  "Ngorongoro Serena Safari Lodge",
  "Ngorongoro Crater Lodge &Beyond",
  "Ngorongoro Sopa Lodge",
  "Lake Manyara Serena Safari Lodge",
  "Lake Manyara Tree Lodge",
  "Kitela Lodge - Karatu",
  "Hellen's Lodge - Karatu",

  // Tarangire Lodges
  "Tarangire Sopa Lodge",
  "Tarangire Treetops",
  "Oliver's Camp",
  "Maramboi Tented Camp",

  // Zanzibar & Coast Hotels
  "Zanzibar Serena Hotel",
  "Park Hyatt Zanzibar",
  "Zuri Zanzibar",
  "The Residence Zanzibar",
  "Baraza Resort & Spa Zanzibar",
  "Matemwe Lodge",
  "DoubleTree by Hilton Zanzibar",

  // Dar es Salaam Hotels
  "Hyatt Regency Dar es Salaam, The Kilimanjaro",
  "Dar es Salaam Serena Hotel",
  "Sea Cliff Hotel Dar es Salaam",
  "Golden Tulip Dar es Salaam",
  "Protea Hotel Courtyard Dar es Salaam"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim().toLowerCase();

  try {
    let dbCombined: string[] = [];

    // Try fetching from database first
    try {
      const { data: lodgings } = await (supabase.from("lodgings" as any))
        .select("name")
        .ilike("name", `%${query}%`)
        .limit(5);

      const { data: transport } = await (supabase.from("transport_inventory" as any))
        .select("location_name")
        .ilike("location_name", `%${query}%`)
        .limit(5);

      dbCombined = [
        ...(lodgings || []).map((l: any) => l.name),
        ...(transport || []).map((t: any) => t.location_name),
      ].filter(Boolean);
    } catch (dbErr) {
      console.warn("Database query skipped/failed, using fallback inventory:", dbErr);
    }

    let uniqueLocations = Array.from(new Set(dbCombined));

    // Token-based fallback matching so partial words and variations match smoothly
    const queryTokens = query.split(/\s+/).filter(Boolean);
    
    const matchedDefaults = defaultInventory.filter((item) => {
      const itemLower = item.toLowerCase();
      if (queryTokens.length === 0) return true; // Show all when empty/focused
      return queryTokens.every((token) => itemLower.includes(token));
    });

    // Merge database results with matched fallback options
    const combinedResults = [...uniqueLocations, ...matchedDefaults];
    uniqueLocations = Array.from(new Set(combinedResults));

    return NextResponse.json({ locations: uniqueLocations.slice(0, 10) });
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    const fallback = defaultInventory.filter((item) =>
      item.toLowerCase().includes(query)
    );
    return NextResponse.json({ locations: fallback.slice(0, 10) });
  }
}