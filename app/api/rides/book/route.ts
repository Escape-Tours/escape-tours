import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key (or standard server auth client depending on your setup)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, pickup, dropoff } = body;

    if (!userId || !pickup || !dropoff) {
      return NextResponse.json({ error: 'Missing required booking parameters' }, { status: 400 });
    }

    // Simple Haversine formula calculation for distance in KM (or replace with Google/Mapbox Distance Matrix API)
    const distanceKm = calculateDistance(
      pickup.latitude,
      pickup.longitude,
      dropoff.latitude,
      dropoff.longitude
    );

    const durationMins = Math.round(distanceKm * 2.5); // Estimate 2.5 mins per km
    const baseFare = 5.00;
    const ratePerKm = 1.50;
    const totalFare = Number((baseFare + distanceKm * ratePerKm).toFixed(2));

    const { data: ride, error } = await supabase
      .from('rides')
      .insert({
        user_id: userId,
        pickup_name: pickup.name,
        pickup_lat: pickup.latitude,
        pickup_lng: pickup.longitude,
        dropoff_name: dropoff.name,
        dropoff_lat: dropoff.latitude,
        dropoff_lng: dropoff.longitude,
        estimated_distance_km: Number(distanceKm.toFixed(2)),
        estimated_duration_mins: durationMins,
        fare_amount: totalFare,
        currency: 'USD',
        status: 'requested'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, ride });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}