import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderTrackingId = searchParams.get('OrderTrackingId');
        
        if (!orderTrackingId) {
            throw new Error("No OrderTrackingId provided");
        }

        const { error } = await supabaseAdmin
            .from('bookings')
            .update({ status: 'paid' })
            .eq('order_tracking_id', orderTrackingId); 

        if (error) {
            console.error("Supabase update error:", error);
            throw error;
        }

        return NextResponse.redirect(new URL('https://escapetourstz.com/booking-success?status=success'));
    } catch (error) {
        console.error("Callback error:", error);
        return NextResponse.json({ error: "Callback failed" }, { status: 500 });
    }
}