'use client';

import { useState } from 'react';

interface HotelLocation {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
}

interface Props {
  userId: string;
  itineraryHotel: HotelLocation;
}

export function AirportRideBooking({ userId, itineraryHotel }: Props) {
  const [bookingState, setBookingState] = useState<'idle' | 'searching' | 'confirmed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBookRide = async () => {
    setBookingState('searching');
    setErrorMessage(null);

    try {
      const airportPickup = {
        name: 'Airport Arrival Terminal',
        latitude: -6.2220,
        longitude: 39.2230
      };

      const response = await fetch('/api/rides/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          pickup: airportPickup,
          dropoff: itineraryHotel
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book ride');
      }

      setBookingState('confirmed');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong');
      setBookingState('idle');
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
      <h3 className="font-semibold text-gray-900 text-lg">Arrived at the Airport?</h3>
      <p className="text-sm text-gray-600 mt-1">
        Book an instant transfer straight to your itinerary hotel: <span className="font-medium text-gray-900">{itineraryHotel.name}</span>
      </p>

      {errorMessage && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
          {errorMessage}
        </div>
      )}

      {bookingState === 'idle' && (
        <button
          onClick={handleBookRide}
          className="mt-4 w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Request Airport Ride
        </button>
      )}

      {bookingState === 'searching' && (
        <div className="mt-4 text-center py-3 text-gray-500 animate-pulse bg-gray-50 rounded-lg text-sm">
          Locating nearby drivers...
        </div>
      )}

      {bookingState === 'confirmed' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center justify-between">
          <span>Ride requested successfully! Dispatching nearest driver.</span>
        </div>
      )}
    </div>
  );
}