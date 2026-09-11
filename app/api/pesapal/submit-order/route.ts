import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, itemName, amount, vendorId, currency } = body;

    if (!amount || !itemName) {
      return NextResponse.json({ error: 'Missing required item details' }, { status: 400 });
    }

    // PesaPal API credentials from your environment variables
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const isLive = process.env.PESAPAL_ENV === 'live';
    const baseUrl = isLive 
      ? 'https://pay.pesapal.com/v3' 
      : 'https://cybqa.pesapal.com/v3';

    // 1. Authenticate with PesaPal to get token
    const authResponse = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    });

    const authData = await authResponse.json();

    if (!authData.token) {
      // Fallback for development/testing if PesaPal keys are not yet configured in .env.local
      console.warn('PesaPal authentication failed or keys missing. Using mock checkout redirect for testing.');
      return NextResponse.json({
        redirect_url: `https://cybqa.pesapal.com/v3/mock-checkout?item=${encodeURIComponent(itemName)}&amount=${amount}`
      });
    }

    const token = authData.token;

    // 2. Submit Order Request to PesaPal
    const orderTrackingId = `ESCAPE_${Date.now()}`;
    const orderPayload = {
      id: orderTrackingId,
      currency: currency || 'USD',
      amount: Number(amount),
      description: `Purchase of ${itemName} via Escape+ Store`,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/lifestyle-hub?order_id=${orderTrackingId}`,
      notification_id: process.env.PESAPAL_IPN_ID || '',
      billing_address: {
        email_address: 'customer@escapetourstz.com',
        phone_number: '',
        country_code: 'TZ',
        first_name: 'Escape',
        last_name: 'Customer',
      },
    };

    const orderResponse = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderResponse.json();

    if (orderData.redirect_url) {
      return NextResponse.json({ redirect_url: orderData.redirect_url });
    } else {
      return NextResponse.json({ error: orderData.message || 'Failed to generate PesaPal redirect URL' }, { status: 400 });
    }

  } catch (err: any) {
    console.error('PesaPal API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}