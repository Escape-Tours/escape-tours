import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch('https://pay.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PESAPAL_TOKEN}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        // 1. Handle PesaPal Errors Explicitly
        if (!response.ok || data.error) {
            console.error("PesaPal API Error:", JSON.stringify(data, null, 2));
            return NextResponse.json(
                { error: "Payment initiation failed", details: data }, 
                { status: response.status }
            );
        }

        // 2. Successful response: Update Database
        if (data.order_tracking_id) {
            const { error: dbError } = await supabaseAdmin
                .from('bookings')
                .update({ order_tracking_id: data.order_tracking_id })
                .eq('merchant_reference', body.id);

            if (dbError) {
                console.error("Supabase update error:", dbError);
                // We proceed anyway so the user can still pay
            }
        }

        // 3. Ensure redirect_url exists before redirecting
       if (data.redirect_url) {
            return NextResponse.json({ redirectUrl: data.redirect_url });
        } else {
            throw new Error("No redirect_url received from PesaPal");
        }

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Booking failed", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}