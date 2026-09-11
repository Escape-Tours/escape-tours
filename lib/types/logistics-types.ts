// lib/types/logistics-types.ts

export type TaskStatus = 'PENDING' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';

export interface DriverManifest {
  id: string;
  driverId: string;
  itineraryId: string;
  taskType: 'AIRPORT_PICKUP' | 'TRANSFER' | 'SAFARI_LEG';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  scheduledTime: Date;
  status: TaskStatus;
  priority: 'NORMAL' | 'URGENT';
  lastUpdated: Date;
  notes?: string; // For special instructions (e.g., "VIP guest", "Extra luggage")
  metadata: {
    guestName: string;
    flightNumber?: string;
    passengerCount: number;
    contactNumber: string; // Essential for real-time coordination
  };
}