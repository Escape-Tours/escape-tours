import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, tier, totalDays, userId } = body;

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

    // 3. Return as a streamable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="itinerary_${data.id}.pdf"`
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}