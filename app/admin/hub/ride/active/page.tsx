'use client';

import { useSearchParams } from 'next/navigation';
import { ActiveRideTracker } from '@/components/hub/ActiveRideTracker';

export default function ActiveRidePage() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get('rideId');
  const userId = searchParams.get('userId'); // Alternatively fetch from your auth session context

  if (!rideId || !userId) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Missing ride or user identification parameters.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Airport Transfer</h1>
      <ActiveRideTracker rideId={rideId} userId={userId} />
    </div>
  );
}