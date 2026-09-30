// app/api/pesapal/submit-order/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, description, email, first_name, last_name, phone_number, items } = body;

    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const isLive = process.env.PESAPAL_ENV === 'live';
    const baseUrl = isLive ? 'https://pay.pesapal.com/v3' : 'https://cybqa.pesapal.com/pesapalv3';

    // 1. Authenticate with PesaPal to get token
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
      throw new Error('Failed to authenticate with PesaPal API');
    }

    const token = authData.token;
    const trackingId = `ESC-${Date.now()}`;

    // 2. Submit Order Request to PesaPal
    const orderPayload = {
      id: trackingId,
      currency: currency || 'USD',
      amount: amount,
      description: description || 'Escape+ Storefront / Fleet Order',
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/user-hub?pesapal_order_tracking_id=${trackingId}`,
      notification_id: process.env.PESAPAL_IPN_ID || '', // Optional if pre-registered
      billing_address: {
        email_address: email || 'explorer@escapetourstz.com',
        phone_number: phone_number || '+255666281717',
        country_code: 'TZ',
        first_name: first_name || 'Valued',
        middle_name: '',
        last_name: last_name || 'Explorer',
        line_1: 'Escape Tours Headquarters',
        line_2: '',
        city: 'Arusha',
        state: 'Arusha',
        postal_code: '00000',
        zip_code: ''
      }
    };

    const orderResponse = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderPayload)
    });

    const orderData = await orderResponse.json();

    if (orderData.redirect_url) {
      return NextResponse.json({ redirect_url: orderData.redirect_url });
    } else {
      throw new Error(orderData.error?.message || 'Failed to generate PesaPal redirect URL');
    }

  } catch (error: any) {
    console.error('PesaPal API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}