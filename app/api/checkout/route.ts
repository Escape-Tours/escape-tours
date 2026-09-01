// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PESAPAL_ENV = process.env.PESAPAL_ENV || 'live';
const BASE_URL = PESAPAL_ENV === 'live' 
  ? 'https://pay.pesapal.com/v3' 
  : 'https://cybqa.pesapal.com/pesapalv3';

// Dynamically fetch a fresh live or sandbox token
async function getPesaPalToken() {
  const cleanKey = process.env.PESAPAL_CONSUMER_KEY?.trim();
  const cleanSecret = process.env.PESAPAL_CONSUMER_SECRET?.trim();

  const response = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: cleanKey,
      consumer_secret: cleanSecret,
    }),
  });

  const textResponse = await response.text();
  
  try {
    const data = JSON.parse(textResponse);
    if (!response.ok) {
      throw new Error(data.message || data.error?.message || 'Failed to authenticate with PesaPal');
    }
    return data.token;
  } catch (e: any) {
    console.error("PesaPal returned non-JSON response during auth:", textResponse);
    throw new Error("PesaPal live server returned an invalid response during token generation. Check your live consumer key and secret.");
  }
}

// Handle GET requests to prevent HTTP 405 errors if the route is accessed directly
export async function GET(req: Request) {
  const url = new URL(req.url);
  const bookingId = url.searchParams.get('bookingId');
  const amount = url.searchParams.get('amount');

  return NextResponse.redirect(new URL(`/checkout?bookingId=${bookingId || ''}&amount=${amount || ''}`, req.url));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { bookingId, amount, itineraryId, items, tier } = body;

    let totalAmount = Number(amount) || 0;
    let referenceId = bookingId || itineraryId || `ESC-${Date.now()}`;
    let customerEmail = "customer@escapetourstz.com";
    let customerPhone = "0700000000";
    let customerName = "Escape Customer";

    // 1. If a bookingId is provided, fetch the authoritative record from Supabase
    if (bookingId && bookingId !== 'ESCP-BESPOKE') {
      const { data: booking, error: dbError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (!dbError && booking) {
        totalAmount = Number(booking.total_amount) || totalAmount;
        referenceId = booking.id;
        if (booking.email) customerEmail = booking.email;
        if (booking.phone) customerPhone = String(booking.phone);
        if (booking.full_name) customerName = booking.full_name;
      }
    } 
    // 2. Fallback to items calculation if passed directly
    else if (items && Array.isArray(items) && items.length > 0) {
      const baseTotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      totalAmount = Math.round(baseTotal * 1.18);
      referenceId = `ESC-${Date.now()}`;
    } 
    // 3. Fallback to itineraryId lookup if passed
    else if (itineraryId && itineraryId !== 'pending-id') {
      const { data: dbItems, error: dbError } = await supabase
        .from('itinerary_items')
        .select('price')
        .eq('itinerary_id', itineraryId);

      if (!dbError && dbItems && dbItems.length > 0) {
        const baseTotal = dbItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        totalAmount = Math.round(baseTotal * 1.18);
        referenceId = itineraryId;
      }
    }

    if (totalAmount <= 0) {
      return NextResponse.json({ error: 'Total amount must be greater than zero' }, { status: 400 });
    }

    // Split full name safely for Pesapal billing requirements
    const nameParts = customerName.trim().split(' ');
    const firstName = nameParts[0] || 'Escape';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    // Fetch a fresh token dynamically
    const token = await getPesaPalToken();

    const orderPayload = {
      id: referenceId,
      currency: 'USD',
      amount: Number(totalAmount.toFixed(2)),
      description: `Escape Tours Payment (${tier || 'INTERNATIONAL'})`,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://escapetourstz.com'}/api/payment-callback`,
      notification_id: process.env.PESAPAL_IPN_ID?.trim(),
      billing_address: {
        email_address: customerEmail,
        phone_number: customerPhone,
        first_name: firstName,
        last_name: lastName,
        country_code: "TZ"
      }
    };

    console.log("Submitting PesaPal Order Payload:", JSON.stringify(orderPayload, null, 2));

    // Initiate PesaPal Request with the fresh dynamic token
    const response = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const responseText = await response.text();
    console.log("PesaPal Raw Response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Non-JSON Response from PesaPal:", responseText);
      throw new Error("Payment gateway returned an invalid response format.");
    }

    if (!response.ok) {
        console.error("Pesapal Error:", data);
        throw new Error(data.error?.message || data.message || "Payment gateway rejected the request");
    }

    return NextResponse.json({ redirectUrl: data.redirect_url });

  } catch (error: any) {
    console.error("Checkout System Error:", error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}