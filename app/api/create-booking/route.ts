import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculateBookingDetails } from '@/lib/utils/ItineraryCalculator';
import { getHotelBySlug } from '@/lib/supabase/hotel-service';

/**
 * World-Class Booking API
 * Features: Server-side validation, Fail-safe state handling, and Audit Logging
 */
export async function POST(request: Request) {
    let bookingId: string | null = null;

    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, slug, checkIn, checkOut, currency, bookingType } = body;

        // 1. Fetch Source of Truth
        const hotel = await getHotelBySlug(slug);
        if (!hotel) return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });

        // 2. Server-side Re-calculation
        const pricing = calculateBookingDetails(checkIn, checkOut, hotel.prices);

        // 3. Database: Create 'pending' record
        const { data: booking, error: dbError } = await supabaseAdmin
            .from('bookings')
            .insert([{
                full_name: `${firstName} ${lastName}`,
                email, phone, service_type: bookingType, service_name: hotel.name,
                total_amount: pricing.totalAmount, base_price: pricing.subtotalBase,
                vat_amount: pricing.vat, agent_fee: pricing.agencyFee,
                check_in: checkIn, check_out: checkOut, nights: pricing.nights,
                currency: currency || 'USD', status: 'pending'
            }])
            .select('id')
            .single();

        if (dbError || !booking) throw new Error("Database insertion failed");
        bookingId = booking.id;

        // 4. Initiate PesaPal Transaction
        const token = await getPesaPalToken();
        const paymentResponse = await fetch('https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `BK-${booking.id}`,
                currency: currency || 'USD',
                amount: parseFloat(pricing.totalAmount.toFixed(2)),
                description: `Booking: ${hotel.name}`,
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking-success`,
                notification_id: process.env.PESAPAL_NOTIFICATION_ID,
                billing_address: {
                    email_address: email.toLowerCase(),
                    phone_number: phone,
                    first_name: firstName,
                    last_name: lastName,
                    country_code: "TZ"
                }
            })
        });

        const paymentData = await paymentResponse.json();

        // 5. Success Path
        if (paymentResponse.ok && paymentData.order_tracking_id) {
            await supabaseAdmin.from('bookings')
                .update({ order_tracking_id: paymentData.order_tracking_id })
                .eq('id', booking.id);

            return NextResponse.json({ success: true, redirect_url: paymentData.redirect_url });
        }

        // 6. Fail-Safe Path (Payment Gateway Rejection)
        throw new Error(paymentData.message || "Payment Gateway rejected request");

    } catch (error: any) {
        console.error("[Booking API Error]:", error);
        
        // If we created a booking record but the payment failed, mark it as failed
        if (bookingId) {
            await supabaseAdmin.from('bookings')
                .update({ status: 'failed', error_log: error.message })
                .eq('id', bookingId);
        }

        return NextResponse.json({ error: "Booking initiation failed. Please try again." }, { status: 500 });
    }
}

async function getPesaPalToken() {
    const response = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            consumer_key: process.env.PESAPAL_CONSUMER_KEY,
            consumer_secret: process.env.PESAPAL_CONSUMER_SECRET
        })
    });
    if (!response.ok) throw new Error("PesaPal Authentication failed");
    const data = await response.json();
    return data.token;
}