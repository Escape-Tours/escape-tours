import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const PESAPAL_ENV = process.env.PESAPAL_ENV || 'live';
const BASE_URL = PESAPAL_ENV === 'live' 
  ? 'https://pay.pesapal.com/v3' 
  : 'https://cybqa.pesapal.com/pesapalv3';

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
    console.error("PesaPal returned non-JSON response:", textResponse);
    throw new Error(e.message?.includes('Failed to authenticate') ? e.message : "PesaPal live server is currently returning a non-JSON or 500 error. Please check your merchant account status or API settings.");
  }
}

function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, itineraryId, email, phoneNumber, firstName, lastName } = body;

    const token = await getPesaPalToken();
    const safeItineraryId = (itineraryId && isValidUUID(itineraryId)) ? itineraryId : randomUUID();

    const orderPayload = {
      id: `ESC-${Date.now()}`,
      currency: 'USD',
      amount: Number(amount),
      description: `Escape Tours Itinerary Payment - Ref: ${safeItineraryId}`,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://escapetourstz.com'}/checkout/success`,
      notification_id: process.env.PESAPAL_IPN_ID?.trim(),
      billing_address: {
        email_address: email || 'customer@escapetourstz.com',
        phone_number: phoneNumber || '+255000000000',
        country_code: 'TZ',
        first_name: firstName || 'Valued',
        last_name: lastName || 'Client',
      },
    };

    const orderResponse = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderTextResponse = await orderResponse.text();
    let orderData;
    
    try {
      orderData = JSON.parse(orderTextResponse);
    } catch (err) {
      console.error('PesaPal Order Non-JSON Response:', orderTextResponse);
      throw new Error('Payment gateway returned an invalid response format. Check your PesaPal environment and token.');
    }

    if (!orderResponse.ok) {
      console.error('PesaPal Order Error Details:', orderData);
      throw new Error(orderData.message || orderData.error?.message || 'Failed to submit order to PesaPal');
    }

    return NextResponse.json({ 
      success: true, 
      redirect_url: orderData.redirect_url,
      order_tracking_id: orderData.order_tracking_id 
    });

  } catch (error: any) {
    console.error('PesaPal Checkout Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}