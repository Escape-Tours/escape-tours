import { PaymentBookingPayload } from '@/lib/types/booking';

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
      id: bookingData.bookingId,
      currency: bookingData.currency || 'USD',
      amount: bookingData.total_amount.toNumber(),
      description: `Escape Tours: ${bookingData.hotelName || 'Booking'}`.substring(0, 100),
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking-success`,
      notification_id: process.env.PESAPAL_NOTIFICATION_ID,
      billing_address: {
          email_address: (bookingData.email || '').toLowerCase().trim(),
          phone_number: (bookingData.phone || '').replace(/\s+/g, ''),
          first_name: (bookingData.firstName || 'Guest').trim(),
          last_name: (bookingData.lastName || '').trim(),
          country_code: "TZ"
      }
  };

  try {
      const response = await fetch(PESA_PAL_ENDPOINT, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Correlation-ID': bookingData.bookingId
          },
          body: JSON.stringify(orderPayload),
          signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
          console.error(`[PesaPal Integration Failure] Ref: ${bookingData.bookingId}`, {
              status: response.status,
              response: data
          });
          throw new Error(`Payment Gateway Error (${response.status}): ${data.message || 'Unknown failure'}`);
      }

      return data;
  } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
          console.error(`[PesaPal Timeout] Request timed out for Ref: ${bookingData.bookingId}`);
          throw new Error('Payment gateway is taking too long to respond. Please try again.');
      }
      
      console.error(`[PesaPal System Error] Ref: ${bookingData.bookingId}`, error);
      throw error;
  }
}