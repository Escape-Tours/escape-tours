import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tour_title, amount, currency, email, phone, full_name, travel_date, participants, residency_tier } = body;

    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const isLive = process.env.PESAPAL_ENV === 'live';
    
    const baseUrl = isLive 
      ? 'https://pay.pesapal.com/v3' 
      : 'https://cybqa.pesapal.com/v3';

    // 1. Authenticate to get Bearer Token
    const authResponse = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret
      })
    });

    const authData = await authResponse.json();
    if (!authData.token) {
      throw new Error(authData.message || "Failed to authenticate with PesaPal");
    }

    const token = authData.token;
    const [firstName, ...lastNameArr] = full_name.split(" ");
    const lastName = lastNameArr.join(" ") || "Customer";

    // 2. Submit Order Request to PesaPal
    const orderResponse = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: `ESC-${Date.now()}`,
        currency: currency || 'USD',
        amount: Number(amount),
        description: `Booking: ${tour_title} (${participants} pax - ${residency_tier})`,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify`,
        notification_id: process.env.PESAPAL_IPN_ID,
        billing_address: {
          email_address: email,
          phone_number: phone,
          country_code: "TZ",
          first_name: firstName,
          last_name: lastName,
        }
      })
    });

    const orderData = await orderResponse.json();

    if (orderData.redirect_url) {
      return NextResponse.json({ success: true, redirect_url: orderData.redirect_url });
    } else {
      throw new Error(orderData.error?.message || "Failed to generate PesaPal redirect URL");
    }

  } catch (error: any) {
    console.error("PesaPal API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment initiation" },
      { status: 500 }
    );
  }
}