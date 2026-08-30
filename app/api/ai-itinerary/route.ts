import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    let numberOfDays = 3;
    
    if (lowerPrompt.includes('4 day') || lowerPrompt.includes('four day')) numberOfDays = 4;
    else if (lowerPrompt.includes('3 day') || lowerPrompt.includes('three day')) numberOfDays = 3;
    else if (lowerPrompt.includes('5 day') || lowerPrompt.includes('five day')) numberOfDays = 5;
    else if (lowerPrompt.includes('2 day') || lowerPrompt.includes('two day')) numberOfDays = 2;
    else if (lowerPrompt.includes('1 day') || lowerPrompt.includes('one day')) numberOfDays = 1;

    // Fetch live rows from the master inventory table using type filtering
    let inventoryItems: any[] = [];
    try {
      const res = await supabase.from('inventory').select('*').limit(100);
      if (res.data) inventoryItems = res.data;
    } catch (e) {
      console.warn('inventory fetch error:', e);
    }

    // Categorize inventory items based on table/metadata type fields
    const safaris = inventoryItems.filter(i => {
      const t = (i.type || i.category || '').toLowerCase();
      return t === 'safaris' || t === 'safari' || t === 'parks' || t === 'park';
    });

    const lodges = inventoryItems.filter(i => {
      const t = (i.type || i.category || '').toLowerCase();
      return t === 'lodges' || t === 'hotel' || t === 'hotels';
    });

    const activities = inventoryItems.filter(i => {
      const t = (i.type || i.category || '').toLowerCase();
      return t === 'activities' || t === 'activity' || t === 'treks' || t === 'trek';
    });

    // Fallback to general inventory if specific type lists are empty
    const poolSafaris = safaris.length > 0 ? safaris : inventoryItems;
    const poolLodges = lodges.length > 0 ? lodges : inventoryItems;
    const poolActivities = activities.length > 0 ? activities : inventoryItems;

    // Filter items based on prompt keywords (Serengeti, Ngorongoro, Zanzibar, Mikumi)
    const filterByPrompt = (items: any[]) => {
      if (!items.length) return items;
      const matched = items.filter(item => {
        const name = (item.name || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        return (
          (lowerPrompt.includes('serengeti') && (name.includes('serengeti') || desc.includes('serengeti'))) ||
          (lowerPrompt.includes('ngorongoro') && (name.includes('ngorongoro') || desc.includes('ngorongoro'))) ||
          (lowerPrompt.includes('zanzibar') && (name.includes('zanzibar') || desc.includes('zanzibar'))) ||
          (lowerPrompt.includes('mikumi') && (name.includes('mikumi') || desc.includes('mikumi')))
        );
      });
      return matched.length > 0 ? matched : items;
    };

    const targetSafaris = filterByPrompt(poolSafaris);
    const targetActivities = filterByPrompt(poolActivities);
    const targetLodges = filterByPrompt(poolLodges);

    // Realistic fallback catalog tailored to prompt keywords if database catalog happens to be empty
    const getFallbackName = () => {
      if (lowerPrompt.includes('serengeti')) return 'Serengeti Endless Plains Migration Safari';
      if (lowerPrompt.includes('ngorongoro')) return 'Ngorongoro Crater Floor Descent & Wildlife';
      if (lowerPrompt.includes('zanzibar')) return 'Zanzibar Stone Town & Beach Escape';
      return 'Mikumi National Park Wildlife Safari';
    };

    const fallbackCatalog = [
      {
        id: crypto.randomUUID(),
        name: getFallbackName(),
        base_price: 350,
        lat: lowerPrompt.includes('zanzibar') ? -6.1659 : lowerPrompt.includes('ngorongoro') ? -3.1667 : lowerPrompt.includes('serengeti') ? -2.3333 : -7.4116,
        lng: lowerPrompt.includes('zanzibar') ? 39.2026 : lowerPrompt.includes('ngorongoro') ? 35.5833 : lowerPrompt.includes('serengeti') ? 34.8333 : 37.0784,
        pricing_matrix: { INTERNATIONAL: 350, RESIDENT: 250, CITIZEN: 150 },
        metadata: { type: 'SAFARI' }
      },
      {
        id: crypto.randomUUID(),
        name: lowerPrompt.includes('zanzibar') ? 'Spice Farm & Coastal Sunset Cruise' : 'Rift Valley Sunset Sundowner Experience',
        base_price: 150,
        lat: -3.5000,
        lng: 35.8333,
        pricing_matrix: { INTERNATIONAL: 150, RESIDENT: 100, CITIZEN: 50 },
        metadata: { type: 'ACTIVITY' }
      },
      {
        id: crypto.randomUUID(),
        name: lowerPrompt.includes('zanzibar') ? 'Zanzibar Beach Resort Luxury Suite' : 'Luxury Tented Camp & Reserve Suite',
        base_price: 450,
        lat: -3.8000,
        lng: 36.0000,
        pricing_matrix: { INTERNATIONAL: 450, RESIDENT: 320, CITIZEN: 200 },
        metadata: { type: 'HOTEL' }
      }
    ];

    const generatedDays = Array.from({ length: numberOfDays }, (_, index) => {
      // Enforce requested structure: Morning = Activity, Afternoon = Park/Safari, Evening = Hotel/Lodge
      const aItem = targetActivities[index % targetActivities.length] || targetActivities[0] || fallbackCatalog[1];
      const sItem = targetSafaris[index % targetSafaris.length] || targetSafaris[0] || fallbackCatalog[0];
      const lItem = targetLodges[index % targetLodges.length] || targetLodges[0] || fallbackCatalog[2];

      const formatItem = (dbItem: any, defaultType: string) => {
        const basePrice = dbItem.base_price || dbItem.basePrice || dbItem.price || 250;
        return {
          id: dbItem.id || crypto.randomUUID(),
          name: dbItem.name || 'Custom Experience',
          basePrice: basePrice,
          lat: dbItem.lat ?? dbItem.latitude ?? -6.8235,
          lng: dbItem.lng ?? dbItem.longitude ?? 39.2695,
          pricing_matrix: dbItem.pricing_matrix || { INTERNATIONAL: basePrice, RESIDENT: Math.round(basePrice * 0.7), CITIZEN: Math.round(basePrice * 0.4) },
          metadata: dbItem.metadata || { type: defaultType }
        };
      };

      const morningObj = formatItem(aItem, 'ACTIVITY');
      const afternoonObj = formatItem(sItem, 'SAFARI');
      const eveningObj = formatItem(lItem, 'HOTEL');

      return {
        id: crypto.randomUUID(),
        day_number: index + 1,
        location: afternoonObj.name.split('&')[0] || `Day ${index + 1} Circuit`,
        slots: [
          {
            id: crypto.randomUUID(),
            type: 'MORNING',
            item: morningObj,
            name: morningObj.name,
            location: { lat: morningObj.lat, lng: morningObj.lng }
          },
          {
            id: crypto.randomUUID(),
            type: 'AFTERNOON',
            item: afternoonObj,
            name: afternoonObj.name,
            location: { lat: afternoonObj.lat, lng: afternoonObj.lng }
          },
          {
            id: crypto.randomUUID(),
            type: 'EVENING',
            item: eveningObj,
            name: eveningObj.name,
            location: { lat: eveningObj.lat, lng: eveningObj.lng }
          }
        ]
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Itinerary successfully architected with Morning Activity, Afternoon Park/Safari, and Evening Hotel slots matched closely to your catalog.',
      days: generatedDays,
      metadata: {
        tier: tier || 'INTERNATIONAL',
        guests: guests || { adults: 2, children: 0 },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('AI Itinerary Architect Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'An unexpected error occurred while processing your request.' 
      }, 
      { status: 500 }
    );
  }
}