import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Define incompatible regional zones to prevent impossible same-day logistics
const ISLAND_ZONES = ['ZANZIBAR_COAST', 'MAFIA_ISLAND'];
const MAINLAND_NORTHERN = ['SERENGETI', 'NGORONGORO_HIGHLANDS', 'TARANGIRE', 'NORTHERN_CIRCUIT', 'RIFT_VALLEY'];

function validateItineraryGeography(items: any[]) {
  if (!Array.isArray(items)) return { isValid: true };

  let hasIsland = false;
  let hasMainlandNorthern = false;

  for (const item of items) {
    const loc = item?.location || item?.region || '';
    if (ISLAND_ZONES.includes(loc)) {
      hasIsland = true;
    }
    if (MAINLAND_NORTHERN.includes(loc)) {
      hasMainlandNorthern = true;
    }
  }

  if (hasIsland && hasMainlandNorthern) {
    return {
      isValid: false,
      error: "Logistical Conflict: Cannot combine mainland safari parks (e.g., Tarangire/Serengeti) and Zanzibar/Island activities on the same itinerary timeline without a transit/flight day."
    };
  }

  return { isValid: true };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, tier, totalDays, userId } = body;

    // 0. Validate Geographic Feasibility
    const geoValidation = validateItineraryGeography(items);
    if (!geoValidation.isValid) {
      return NextResponse.json({ error: geoValidation.error }, { status: 400 });
    }

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('itineraries')
      .insert([{ items, tier, total_days: totalDays, user_id: userId }])
      .select()
      .single();

    if (error) throw error;

    // 2. Generate PDF (using a headless browser to render a hidden printable view)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set content to a simplified HTML template
    await page.setContent(`<h1>Itinerary ${data.id}</h1><p>Tier: ${tier}</p>...`);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    
    await browser.close();

    // 3. Return as a streamable file (wrapped in Buffer.from to satisfy NextResponse types)
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="itinerary_${data.id}.pdf"`
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}