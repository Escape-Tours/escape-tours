// lib/types/vendor-types.ts

export type LogAction = 
  | 'PAYMENT_DISTRIBUTED' 
  | 'BOOKING_UPDATED' 
  | 'TASK_COMPLETED' 
  | 'PAYMENT_FAILED' 
  | 'VENDOR_ONBOARDED';

export interface VendorLog {
  id: string;
  vendorId: string;
  itineraryId?: string; // Optional: links log to a specific booking [cite: 47]
  adminId?: string;     // Identifies which admin/system performed the action [cite: 45]
  action: LogAction;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  timestamp: Date;
  details: string;      // Human-readable summary of the log entry [cite: 46]
  metadata?: Record<string, any>; // Flexible storage for specific transaction details (e.g., amount, currency) 
}