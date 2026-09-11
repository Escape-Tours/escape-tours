// lib/services/eventService.ts
import { VendorLog } from '@/lib/types/vendor-types';

export const triggerVendorEvent = async (
  vendorId: string, 
  action: VendorLog['action'], 
  details: string,
  itineraryId?: string
) => {
  const logEntry: VendorLog = {
    id: `log-${Date.now()}`,
    vendorId,
    action,
    status: 'SUCCESS',
    timestamp: new Date(),
    details,
    itineraryId
  };

  // 1. Save to DB audit trail
  // await db.vendorLogs.create(logEntry);
  
  // 2. Trigger notification service (Email/Dashboard Alert)
  console.log(`Notification sent to Vendor ${vendorId}: ${details}`);
  
  return logEntry;
};