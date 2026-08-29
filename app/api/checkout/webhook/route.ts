import { NextResponse } from 'next/server';
import { processSplitPaymentLedger } from '@/lib/services/financialLedgerService';

interface CheckoutWebhookPayload {
  itineraryId: string;
  totalAmount: number;
  currency: string;
  gatewayReference: string;
  vendorId: string;
  driverId: string;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutWebhookPayload = await request.json();
    const { itineraryId, totalAmount, currency, gatewayReference, vendorId, driverId } = body;

    if (!itineraryId || !totalAmount || !gatewayReference) {
      return NextResponse.json({ success: false, error: 'Missing required checkout parameters' }, { status: 400 });
    }

    const platformSharePercentage = 15;
    const vendorSharePercentage = 65;
    const driverSharePercentage = 20;

    const ledgerResult = await processSplitPaymentLedger({
      itineraryId,
      totalAmount,
      currency: currency || 'USD',
      gatewayReference,
      splits: [
        {
          recipientId: '00000000-0000-0000-0000-000000000001',
          recipientType: 'PLATFORM',
          sharePercentage: platformSharePercentage
        },
        {
          recipientId: vendorId,
          recipientType: 'VENDOR',
          sharePercentage: vendorSharePercentage
        },
        {
          recipientId: driverId,
          recipientType: 'DRIVER',
          sharePercentage: driverSharePercentage
        }
      ]
    });

    if (!ledgerResult.success) {
      throw new Error(ledgerResult.error || 'Failed to record split ledger distribution');
    }

    return NextResponse.json({
      success: true,
      message: 'Checkout payment verified and split ledger successfully distributed.',
      ledgerId: ledgerResult.ledgerId
    }, { status: 200 });

  } catch (err: any) {
    console.error("Payment checkout webhook error:", err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}