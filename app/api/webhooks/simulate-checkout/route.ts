import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      vendor_id, 
      itinerary_id, 
      allocated_amount, 
      currency = 'USD', 
      gateway_reference 
    } = body;

    if (!vendor_id || !allocated_amount || !gateway_reference) {
      return NextResponse.json(
        { error: 'Missing required split-ledger parameters: vendor_id, allocated_amount, gateway_reference' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('financial_ledgers')
      .insert([
        {
          vendor_id,
          recipient_id: vendor_id,
          itinerary_id: itinerary_id || null,
          allocated_amount: parseFloat(allocated_amount),
          currency,
          status: 'SETTLED',
          gateway_reference,
          recipient_type: 'vendor'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase ledger simulation error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Checkout webhook simulated successfully and ledger updated.',
      ledger: data
    });

  } catch (err: any) {
    console.error('Simulation webhook error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}