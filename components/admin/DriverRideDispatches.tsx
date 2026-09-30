'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Ride {
  id: string;
  user_id: string;
  pickup_name: string;
  dropoff_name: string;
  estimated_distance_km: number;
  estimated_duration_mins: number;
  fare_amount: number;
  currency: string;
  status: string;
}

interface Props {
  driverId: string;
}

export function DriverRideDispatches({ driverId }: Props) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRequestedRides();

    // Subscribe to real-time incoming ride requests
    const channel = supabase
      .channel('public:rides')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rides' },
        (payload) => {
          fetchRequestedRides();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequestedRides = async () => {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('status', 'requested')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRides(data);
    }
    setLoading(false);
  };

  const acceptRide = async (rideId: string) => {
    try {
      const response = await fetch(`/api/rides/${rideId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to accept ride');

      fetchRequestedRides();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading incoming dispatches...</div>;
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold text-gray-900">Live Airport Ride Dispatches</h2>
      {rides.length === 0 ? (
        <p className="text-sm text-gray-500 bg-white p-4 rounded-xl border border-gray-100">
          No pending ride requests from the airport right now.
        </p>
      ) : (
        rides.map((ride) => (
          <div key={ride.id} className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Airport Transfer</p>
              <p className="font-semibold text-gray-900 mt-1">To: {ride.dropoff_name}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Distance: {ride.estimated_distance_km} km ({ride.estimated_duration_mins} mins)
              </p>
              <p className="text-sm font-bold text-green-600 mt-2">
                Fare: {ride.currency} {ride.fare_amount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => acceptRide(ride.id)}
              className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Accept Ride
            </button>
          </div>
        ))
      )}
    </div>
  );
}