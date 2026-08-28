import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

async function getPesaPalToken() {
    const response = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            consumer_key: process.env.PESAPAL_CONSUMER_KEY,
            consumer_secret: process.env.PESAPAL_CONSUMER_SECRET
        })
    });
    const data = await response.json();
    return data.token;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('orderTrackingId');

    try {
        const token = await getPesaPalToken();
        const response = await fetch(`https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const statusData = await response.json();

        // If status is 'Completed', update Supabase
        if (statusData.status === 'Completed') {
            await supabaseAdmin
                .from('bookings')
                .update({ status: 'confirmed' })
                .eq('order_tracking_id', orderTrackingId);
        }

        return NextResponse.json(statusData);
    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}