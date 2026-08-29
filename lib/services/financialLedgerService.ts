import { supabase } from '@/lib/supabase/client';

interface SplitLeg {
  recipientId: string;
  recipientType: 'VENDOR' | 'DRIVER' | 'PLATFORM';
  sharePercentage: number;
  fixedAmount?: number;
}

interface TransactionPayload {
  itineraryId: string;
  totalAmount: number;
  currency: string;
  gatewayReference: string;
  splits: SplitLeg[];
}

interface LedgerResult {
  success: boolean;
  ledgerId?: string;
  error?: string;
}

export async function processSplitPaymentLedger(payload: TransactionPayload): Promise<LedgerResult> {
  try {
    const { itineraryId, totalAmount, currency, gatewayReference, splits } = payload;
    
    const calculatedSplits = splits.map(split => {
      const amount = split.fixedAmount !== undefined 
        ? split.fixedAmount 
        : Number((totalAmount * (split.sharePercentage / 100)).toFixed(2));
        
      return {
        itinerary_id: itineraryId,
        recipient_id: split.recipientId,
        recipient_type: split.recipientType,
        share_percentage: split.sharePercentage,
        allocated_amount: amount,
        currency,
        gateway_reference: gatewayReference,
        status: 'PENDING',
        created_at: new Date().toISOString()
      };
    });

    const totalAllocated = calculatedSplits.reduce((sum, item) => sum + item.allocated_amount, 0);
    
    if (Math.abs(totalAllocated - totalAmount) > 0.05) {
      throw new Error(`Split distribution mismatch: Allocated sum ($${totalAllocated}) does not match total amount ($${totalAmount})`);
    }

    const { data, error } = await (supabase
      .from('financial_ledgers' as any) as any)
      .insert(calculatedSplits)
      .select('id');

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      ledgerId: data?.[0]?.id
    };
  } catch (err: any) {
    console.error("Financial ledger split processing failed:", err);
    return {
      success: false,
      error: err.message || 'Unknown ledger error'
    };
  }
}