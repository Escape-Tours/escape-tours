import { UpdateBookingPayload as PaymentBookingPayload } from '@/lib/types/booking';

export async function getPesaPalToken(): Promise<string> {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  const authEndpoint = 'https://pay.pesapal.com/v3/api/Auth/RequestToken';

  const response = await fetch(authEndpoint, {
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

  const data = await response.json();

  if (!response.ok || !data.token) {
    throw new Error(`Failed to authenticate with PesaPal: ${data.message || 'Unknown error'}`);
  }

  return data.token;
}

export async function createPesaPalOrder(bookingData: PaymentBookingPayload, token: string) {
  const PESA_PAL_ENDPOINT = 'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest';
  
  // 1. Setup Timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  // 2. Validate Env Vars
  if (!process.env.PESAPAL_NOTIFICATION_ID) {
    throw new Error('Payment gateway configuration is missing.');
  }

  // 3. Safe Parsing
  // Using .toNumber() for Decimal types to ensure compatibility with PesaPal's numeric requirements
  const orderPayload = {
      id: (bookingData as any).bookingId,
      currency: (bookingData as any).currency || 'USD',
      amount: (bookingData as any).total_amount.toNumber(),
      description: `Escape Tours: ${(bookingData as any).hotelName || 'Booking'}`.substring(0, 100),
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking-success`,
      notification_id: process.env.PESAPAL_NOTIFICATION_ID,
      billing_address: {
          email_address: ((bookingData as any).email || '').toLowerCase().trim(),
          phone_number: ((bookingData as any).phone || '').replace(/\s+/g, ''),
          first_name: ((bookingData as any).firstName || 'Guest').trim(),
          last_name: ((bookingData as any).lastName || '').trim(),
          country_code: "TZ"
      }
  };

  try {
      const response = await fetch(PESA_PAL_ENDPOINT, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Correlation-ID': (bookingData as any).bookingId
          },
          body: JSON.stringify(orderPayload),
          signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
          console.error(`[PesaPal Integration Failure] Ref: ${(bookingData as any).bookingId}`, {
              status: response.status,
              response: data
          });
          throw new Error(`Payment Gateway Error (${response.status}): ${data.message || 'Unknown failure'}`);
      }

      return data;
  } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
          console.error(`[PesaPal Timeout] Request timed out for Ref: ${(bookingData as any).bookingId}`);
          throw new Error('Payment gateway is taking too long to respond. Please try again.');
      }
      
      console.error(`[PesaPal System Error] Ref: ${(bookingData as any).bookingId}`, error);
      throw error;
  }
}