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

// Handle GET requests by rendering the checkout confirmation UI directly with live booking data
export async function GET(req: Request) {
  const url = new URL(req.url);
  const bookingId = url.searchParams.get('bookingId');
  let amount = url.searchParams.get('amount') || '0';
  let residencyTier = 'INTERNATIONAL';

  if (bookingId && bookingId !== 'ESCP-BESPOKE') {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (booking) {
      console.log("FETCHED BOOKING RECORD FOR CHECKOUT:", JSON.stringify(booking, null, 2));
      if (booking.total_amount) amount = String(booking.total_amount);
      
      // Check all potential tier column variations
      const rawTier = booking.residency_type || booking.residency_tier || booking.tier;
      if (rawTier) {
        residencyTier = String(rawTier).toUpperCase();
      }
    } else {
      console.error("Failed to fetch booking record for checkout:", error);
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Secure Bespoke Checkout | Escape Tours</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        <div class="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Escape Tours & Safaris</div>
        <h1 class="text-2xl font-serif font-bold">Secure Bespoke Checkout</h1>
        
        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 text-left">
          <div>
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Booking Reference</span>
            <span class="text-xs font-mono text-amber-400 break-all">${bookingId || 'N/A'}</span>
          </div>
          <div>
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Residency Tier</span>
            <span class="text-sm font-bold text-white uppercase">${residencyTier}</span>
          </div>
          <div>
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Total Investment</span>
            <span class="text-xl font-black text-amber-500">$${Number(amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>

        <button id="payBtn" onclick="handlePayment()" class="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 cursor-pointer">
          Proceed to PesaPal Payment →
        </button>

        <p class="text-[11px] text-slate-500 tracking-wider uppercase">🔒 256-Bit Encrypted Institutional Transaction</p>
      </div>

      <script>
        async function handlePayment() {
          const btn = document.getElementById('payBtn');
          btn.innerText = "Initializing Gateway...";
          btn.disabled = true;

          try {
            const res = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId: '${bookingId}', amount: '${amount}', tier: '${residencyTier}' })
            });
            const data = await res.json();
            if (data.redirectUrl) {
              window.location.href = data.redirectUrl;
            } else {
              alert(data.error || 'Failed to initialize payment gateway.');
              btn.innerText = "Proceed to PesaPal Payment →";
              btn.disabled = false;
            }
          } catch (e) {
            alert('Network error connecting to payment gateway.');
            btn.innerText = "Proceed to PesaPal Payment →";
            btn.disabled = false;
          }
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: { 'Content-Type': 'text/html' },
  });
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
    let activeTier = tier || 'INTERNATIONAL';

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
        
        const rawTier = booking.residency_type || booking.residency_tier || booking.tier;
        if (rawTier) {
          activeTier = String(rawTier).toUpperCase();
        }
      }
    } 
    else if (items && Array.isArray(items) && items.length > 0) {
      const baseTotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      totalAmount = Math.round(baseTotal * 1.18);
      referenceId = `ESC-${Date.now()}`;
    } 
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

    const nameParts = customerName.trim().split(' ');
    const firstName = nameParts[0] || 'Escape';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    const token = await getPesaPalToken();

    const orderPayload = {
      id: referenceId,
      currency: 'USD',
      amount: Number(totalAmount.toFixed(2)),
      description: `Escape Tours Payment (${activeTier})`,
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