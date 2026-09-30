'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RideChat } from './RideChat';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Ride {
  id: string;
  user_id: string;
  driver_id: string | null;
  pickup_name: string;
  dropoff_name: string;
  status: 'requested' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  estimated_distance_km: number;
  fare_amount: number;
  currency: string;
}

interface Props {
  rideId: string;
  userId: string;
}

export function ActiveRideTracker({ rideId, userId }: Props) {
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRideDetails();

    const channel = supabase
      .channel(`active-ride-${rideId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${rideId}`
        },
        (payload) => {
          setRide(payload.new as Ride);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  const fetchRideDetails = async () => {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single();

    if (!error && data) {
      setRide(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading ride tracking status...</div>;
  }

  if (!ride) {
    return <div className="p-4 text-sm text-red-500">Ride not found.</div>;
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-gray-100 rounded-full text-gray-700">
            Status: {ride.status}
          </span>
          <span className="text-sm font-bold text-green-600">
            {ride.currency} {ride.fare_amount.toFixed(2)}
          </span>
        </div>

        <div className="text-sm space-y-1">
          <p className="text-gray-500">From: <span className="text-gray-900 font-medium">{ride.pickup_name}</span></p>
          <p className="text-gray-500">To: <span className="text-gray-900 font-medium">{ride.dropoff_name}</span></p>
        </div>

        {ride.status === 'requested' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg animate-pulse">
            Looking for nearby drivers at the airport terminal...
          </div>
        )}

        {ride.status !== 'requested' && ride.driver_id && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg">
            Driver assigned! They are heading to your pickup point.
          </div>
        )}
      </div>

      {ride.driver_id && (
        <RideChat
          rideId={ride.id}
          currentUserId={userId}
          currentUserRole="user"
        />
      )}
    </div>
  );
}