import { NextResponse } from 'next/server';

export async function GET() {
    // 1. Get Access Token (Correct Production URL)
    const authResponse = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            consumer_key: process.env.PESAPAL_CONSUMER_KEY,
            consumer_secret: process.env.PESAPAL_CONSUMER_SECRET
        })
    });
    const authData = await authResponse.json();
    const token = authData.token;

    // 2. Register IPN (Correct Production URL)
    const regResponse = await fetch('https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            url: "https://escapetourstz.com/api/pesapal-ipn",
            ipn_notification_type: "POST"
        })
    });

    const data = await regResponse.json();
    return NextResponse.json(data);
}