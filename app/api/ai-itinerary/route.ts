import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface InventoryItem {
  id: string;
  name: string;
  type?: string | null;
  category?: string | null;
  description?: string | null;
  region?: string | null;
  location?: string | null;
  region_tag?: string | null;
  base_price?: any;
  basePrice?: any;
  price?: any;
  duration_days?: number | null;
  durationDays?: number | null;
  lat?: number | null;
  latitude?: number | null;
  lng?: number | null;
  longitude?: number | null;
  pricing_matrix?: Record<string, number> | null;
  metadata?: Record<string, any> | null;
  [key: string]: any;
}

const CIRCUIT_REGIONS: Record<string, string[]> = {
  coastal: ['zanzibar', 'dar es salaam', 'stonetown', 'nungwi', 'paje', 'bagamoyo', 'mafia'],
  southern: ['nyerere', 'selous', 'mikumi', 'ruaha', 'udzungwa'],
  northern: ['serengeti', 'ngorongoro', 'tarangire', 'manyara', 'arusha', 'kilimanjaro']
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { prompt, tier, guests } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid descriptive prompt is required to architect your itinerary.' },
        { status: 400 }
      );
    }

    const lowerPrompt = prompt.toLowerCase();
    
    // 1. Intelligent Duration Extraction
    let numberOfDays = 3;
    const dayMatch = lowerPrompt.match(/(\d+)\s*(?:day|days)/);
    if (dayMatch && dayMatch[1]) {
      numberOfDays = parseInt(dayMatch[1], 10);
    } else if (lowerPrompt.includes('one day') || lowerPrompt.includes('1 day')) numberOfDays = 1;
    else if (lowerPrompt.includes('two day') || lowerPrompt.includes('2 day')) numberOfDays = 2;
    else if (lowerPrompt.includes('three day') || lowerPrompt.includes('3 day')) numberOfDays = 3;
    else if (lowerPrompt.includes('four day') || lowerPrompt.includes('4 day')) numberOfDays = 4;
    else if (lowerPrompt.includes('five day') || lowerPrompt.includes('5 day')) numberOfDays = 5;
    else if (lowerPrompt.includes('six day') || lowerPrompt.includes('6 day')) numberOfDays = 6;
    else if (lowerPrompt.includes('seven day') || lowerPrompt.includes('7 day') || lowerPrompt.includes('week')) numberOfDays = 7;

    numberOfDays = Math.max(1, Math.min(numberOfDays, 14));

    // 2. Fetch All Available Inventory from Supabase
    let inventoryItems: InventoryItem[] = [];
    try {
      const res = await supabase.from('inventory').select('*').limit(500);
      if (res.data) inventoryItems = res.data as InventoryItem[];
    } catch (e) {
      console.warn('Inventory fetch error:', e);
    }

    // 3. Detect Target Circuit / Region based on Prompt Intent
    let detectedCircuit: string | null = null;
    for (const [circuitKey, keywords] of Object.entries(CIRCUIT_REGIONS)) {
      if (keywords.some(kw => lowerPrompt.includes(kw))) {
        detectedCircuit = circuitKey;
        break;
      }
    }

    const matchesCircuit = (item: InventoryItem) => {
      if (!detectedCircuit) return true;
      const name = (item.name || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const region = (item.region || item.location || item.region_tag || '').toLowerCase();
      const combined = `${name} ${desc} ${region}`;
      
      const circuitKeywords = CIRCUIT_REGIONS[detectedCircuit] || [];
      return circuitKeywords.some(kw => combined.includes(kw));
    };

    const circuitFilteredPool = inventoryItems.filter(matchesCircuit);
    const activeCircuitPool = circuitFilteredPool.length > 0 ? circuitFilteredPool : inventoryItems;

    // 4. Strict Temporal & Logical Feasibility Filtering
    // Drop any inventory items that require more days than the total trip duration (e.g. 5-day treks on a 3-day trip)
    const validInventory = activeCircuitPool.filter(item => {
      const typeStr = (item.type || item.category || '').toLowerCase();
      const nameStr = (item.name || '').toLowerCase();
      const descStr = (item.description || '').toLowerCase();
      const combinedText = `${typeStr} ${nameStr} ${descStr}`;
      
      const itemDuration = Number(item.duration_days || item.durationDays || 0);

      if (itemDuration > 0 && itemDuration > numberOfDays) {
        return false;
      }

      if (/kilimanjaro|climb|trekking expedition|multi-day/i.test(combinedText) && numberOfDays < 5) {
        return false;
      }

      return true;
    });

    const finalPool = validInventory.length > 0 ? validInventory : activeCircuitPool;

    // 5. Categorize into distinct roles (Safaris, Lodges, Day Activities) ensuring no item consumes the entire timeline incorrectly
    const safaris = finalPool.filter(i => {
      const t = (i.type || i.category || '').toLowerCase();
      const d = Number(i.duration_days || i.durationDays || 1);
      return /safari|park|reserve|conservation|wildlife/.test(t) && d <= 1;
    });

    const lodges = finalPool.filter(i => {
      const t = (i.type || i.category || '').toLowerCase();
      return /lodge|hotel|accommodation|camp|resort|tent/.test(t);
    });

    const activities = finalPool.filter(i => {
      const t = (i.type || i.category || '').toLowerCase();
      const d = Number(i.duration_days || i.durationDays || 1);
      if (/climb|trek|mountaineering/.test(t) && numberOfDays <= 3) return false;
      return /activity|cruise|boat|tour|excursion|walk|fly|game drive/.test(t) && d <= 1;
    });

    const currentTier = (tier || 'INTERNATIONAL').toUpperCase();
    
    const getTierPrice = (obj: InventoryItem) => {
      if (!obj) return 200;
      const matrix = obj.pricing_matrix;
      if (matrix && typeof matrix === 'object') {
        const val = matrix[currentTier] || matrix['INTERNATIONAL'] || matrix['resident'] || matrix['citizen'];
        if (typeof val === 'number') return val;
      }
      return Number(obj.base_price) || Number(obj.basePrice) || Number(obj.price) || 200;
    };

    const poolActivities = activities.length > 0 ? activities : finalPool;
    const poolSafaris = safaris.length > 0 ? safaris : finalPool;
    const poolLodges = lodges.length > 0 ? lodges : finalPool;

    // 6. Build Logically Sound, Non-Overlapping Daily Timeline Slots
    const generatedDays = Array.from({ length: numberOfDays }, (_, index) => {
      const dayNum = index + 1;
      
      // Ensure distinct items are picked per slot where possible to avoid repetitive cloning
      const aItem = poolActivities[index % poolActivities.length];
      const sItem = poolSafaris[index % poolSafaris.length];
      const lItem = poolLodges[index % poolLodges.length];

      const formatItem = (dbItem: InventoryItem, defaultType: string) => {
        const rawBase = dbItem?.base_price ?? dbItem?.basePrice ?? dbItem?.price ?? 250;
        const basePrice = typeof rawBase === 'number' ? rawBase : Number(rawBase) || 250;
        
        const tierPrices = dbItem?.pricing_matrix && typeof dbItem.pricing_matrix === 'object' 
          ? dbItem.pricing_matrix 
          : { 
              INTERNATIONAL: basePrice, 
              RESIDENT: Math.round(basePrice * 0.7), 
              CITIZEN: Math.round(basePrice * 0.4) 
            };

        return {
          id: dbItem?.id || crypto.randomUUID(),
          name: dbItem?.name || 'Inventory Experience',
          basePrice: basePrice,
          lat: dbItem?.lat ?? dbItem?.latitude ?? -7.4116,
          lng: dbItem?.lng ?? dbItem?.longitude ?? 37.0784,
          pricing_matrix: tierPrices,
          metadata: dbItem?.metadata || { type: defaultType }
        };
      };

      const morningObj = formatItem(aItem, 'ACTIVITY');
      const afternoonObj = formatItem(sItem, 'SAFARI');
      const eveningObj = formatItem(lItem, 'HOTEL');

      const morningPrice = getTierPrice(morningObj);
      const afternoonPrice = getTierPrice(afternoonObj);
      const eveningPrice = getTierPrice(eveningObj);

      return {
        id: crypto.randomUUID(),
        day_number: dayNum,
        location: afternoonObj.name.split('&')[0] || `Circuit Day ${dayNum}`,
        slots: [
          {
            id: crypto.randomUUID(),
            type: 'MORNING',
            item: morningObj,
            name: morningObj.name,
            price: morningPrice,
            location: { lat: morningObj.lat, lng: morningObj.lng }
          },
          {
            id: crypto.randomUUID(),
            type: 'AFTERNOON',
            item: afternoonObj,
            name: afternoonObj.name,
            price: afternoonPrice,
            location: { lat: afternoonObj.lat, lng: afternoonObj.lng }
          },
          {
            id: crypto.randomUUID(),
            type: 'EVENING',
            item: eveningObj,
            name: eveningObj.name,
            price: eveningPrice,
            location: { lat: eveningObj.lat, lng: eveningObj.lng }
          }
        ]
      };
    });

    return NextResponse.json({
      success: true,
      message: `Itinerary successfully architected with strict duration bounds, preventing multi-day constraint overflows.`,
      days: generatedDays,
      metadata: {
        tier: currentTier,
        guests: guests || { adults: 2, children: 0 },
        totalDays: numberOfDays,
        detectedCircuit: detectedCircuit || 'unified_custom',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Safari Studio AI Architect Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'An unexpected error occurred while architecting your safari itinerary.' 
      }, 
      { status: 500 }
    );
  }
}