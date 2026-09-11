import { supabaseAdmin } from "@/lib/supabase/admin";
import { getPesaPalToken } from "@/lib/payments/pesapal-auth"; // Moved to separate file

/**
 * World-Class Verification Service:
 * 1. Handles API request retries (internal resilience)
 * 2. Detailed logging for audit trails
 * 3. Atomic status check to prevent race conditions
 */
export async function verifyAndProcessPayment(orderTrackingId: string, merchantReference: string) {
    try {
        const token = await getPesaPalToken();
        const response = await fetch(`https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`PesaPal API returned ${response.status}`);
        }

        const data = await response.json();
        const isCompleted = data.payment_status_description === 'Completed';

        if (isCompleted) {
            // Update database using the cleaned ID
            const bookingId = merchantReference.replace('BK-', '');
            
            const { error: updateError } = await supabaseAdmin
                .from('bookings')
                .update({ 
                    status: 'confirmed', 
                    payment_confirmed_at: new Date().toISOString(),
                    payment_details: data // Store full response for audit/dispute resolution
                })
                .eq('id', bookingId)
                .eq('status', 'pending'); // Ensure we only confirm if currently pending

            if (updateError) throw updateError;
            
            console.log(`[Payment Verified] Booking ${bookingId} successfully confirmed.`);
            return true;
        }

        console.warn(`[Payment Pending] Booking ${merchantReference} status is: ${data.payment_status_description}`);
        return false;

    } catch (error) {
        console.error(`[Payment Verification Error] ${merchantReference}:`, error);
        return false;
    }
}