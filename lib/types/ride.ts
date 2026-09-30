export type RideStatus = 'requested' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface LocationCoordinates {
  name: string; // e.g., "Julius Nyerere International Airport - Terminal 3" or "Maru Maru Hotel, Zanzibar"
  latitude: number;
  longitude: number;
  address?: string;
}

export interface RideBooking {
  id: string;
  userId: string;
  driverId?: string | null;
  pickupLocation: LocationCoordinates;
  dropoffLocation: LocationCoordinates;
  status: RideStatus;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  fareAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface RideMessage {
  id: string;
  rideId: string;
  senderId: string;
  senderRole: 'user' | 'driver';
  message: string;
  createdAt: string;
}