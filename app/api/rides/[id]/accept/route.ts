import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = params.id;
    const body = await request.json();
    const { driverId } = body;

    if (!driverId) {
      return NextResponse.json({ error: 'Missing driverId' }, { status: 400 });
    }

    // Verify ride is still requested and unassigned
    const { data: currentRide, error: fetchError } = await supabase
      .from('rides')
      .select('status, driver_id')
      .eq('id', rideId)
      .single();

    if (fetchError || !currentRide) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    if (currentRide.status !== 'requested' || currentRide.driver_id !== null) {
      return NextResponse.json({ error: 'Ride is no longer available' }, { status: 409 });
    }

    // Assign ride to driver and update status to accepted
    const { data: updatedRide, error: updateError } = await supabase
      .from('rides')
      .update({
        driver_id: driverId,
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', rideId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, ride: updatedRide });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}