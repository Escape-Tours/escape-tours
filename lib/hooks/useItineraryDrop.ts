import { useState } from 'react';
import { validatePayload } from '@/lib/pipe/validator';
import { StagedItineraryItem } from '@/lib/services/stagingValidator';

export const useItineraryDrop = (slotId: string, currentResidencyTier: string) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');

  /**
   * Handles the drop event, validates against the Data Integrity Pipe,
   * and triggers the UI handshake.
   */
  const handleDrop = async (item: StagedItineraryItem): Promise<boolean> => {
    // 1. Initial State Transition
    setStatus('verifying');
    
    try {
      // 2. Data Integrity Pipe check
      // Validates item structure and business rules against the residency tier
      const isValid = await validatePayload(item, slotId, currentResidencyTier);

      if (isValid) {
        setStatus('verified');
        return true;
      } else {
        console.warn(`Drop validation failed for item: ${item.id} in slot: ${slotId}`);
        setStatus('error');
        return false;
      }
    } catch (err) {
      console.error("Critical error during drop validation:", err);
      setStatus('error');
      return false;
    }
  };

  return { status, handleDrop, setStatus };
};