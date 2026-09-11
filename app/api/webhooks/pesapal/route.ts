import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPesaPalToken } from '@/lib/payments/pesapal'; // Reusing your auth helper

/**
 * PesaPal Webhook (IPN) Route
 * Triggered by PesaPal when a payment status changes.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantReference = searchParams.get('OrderMerchantReference'); // e.g., "BK-123"

    if (!orderTrackingId || !merchantReference) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        const bookingId = merchantReference.replace('BK-', '');

        // 1. Authenticate with PesaPal to query status
        const token = await getPesaPalToken();

        // 2. Query PesaPal for the source of truth
        const statusResponse = await fetch(
            `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const statusData = await statusResponse.json();

        // 3. Logic: Confirm if payment is actually 'Completed'
        if (statusData.payment_status_description === 'Completed') {
            
            // 4. Atomic Update: Prevent double-processing
            const { error: updateError } = await supabaseAdmin
                .from('bookings')
                .update({ 
                    status: 'confirmed', 
                    payment_confirmed_at: new Date().toISOString(),
                    payment_details: statusData 
                })
                .eq('id', bookingId)
                .neq('status', 'confirmed'); // Only update if not already confirmed

            if (updateError) throw updateError;

            console.log(`[Webhook Success] Booking ${bookingId} confirmed.`);
            return new NextResponse('OK', { status: 200 });
        }

        return new NextResponse('Payment not completed', { status: 200 });

    } catch (error) {
        console.error("[Webhook Processing Error]:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}