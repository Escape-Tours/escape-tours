"use server";

import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/lib/supabase/database.types";

interface TrekRoute {
  name: string;
  price: Record<string, string | number>;
}

export async function initiatePesapalPayment(
  route: TrekRoute,
  tier: string,
  userData: { email: string; phone: string; name: string; climbers: number }
) {
  const supabase = await createClient();
  
  const rawPrice = String(route.price[tier] ?? "0");
  const baseAmountPerPerson = parseFloat(rawPrice.replace(/[^0-9.]/g, ""));
  const subtotal = baseAmountPerPerson * userData.climbers;

  // Integrated VAT and Agency Fee Calculation
  const vatRate = 0.18; // 18% Tanzania VAT
  const agencyFeePerPerson = 50; // Adjust flat agency fee as needed per your business rules
  
  const totalVat = subtotal * vatRate;
  const totalAgencyFee = agencyFeePerPerson * userData.climbers;
  const totalAmount = subtotal + totalVat + totalAgencyFee;

  const orderTrackingId = `EV-${uuidv4().substring(0, 8).toUpperCase()}`;

  try {
    // 1. Database Insertion
    const bookingData: TablesInsert<"bookings"> = {
      order_tracking_id: orderTrackingId,
      service_name: route.name,
      total_amount: totalAmount,
      full_name: userData.name,
      email: userData.email,
      phone: userData.phone, 
      climbers: userData.climbers,
      status: "PENDING",
    };

    const { error: dbError } = await supabase
      .from("bookings")
      .insert(bookingData);

    if (dbError) {
      console.error("Supabase Error Details:", dbError);
      throw new Error(`Database insertion failed: ${dbError.message}`);
    }

    // 2. Authenticate with PesaPal (Live URL)
    const authRes = await fetch("https://pay.pesapal.com/v3/api/Auth/RequestToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });
    
    const authData = await authRes.json();
    if (!authData.token) {
      console.error("PesaPal Authentication Error Response:", authData);
      throw new Error("PesaPal Authentication failed: " + (authData.message || JSON.stringify(authData)));
    }

    // Determine callback URL (falling back to production domain if local throws validation errors)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.includes("localhost") 
      ? "https://escapetourstz.com" 
      : (process.env.NEXT_PUBLIC_SITE_URL || "https://escapetourstz.com");

    // 3. Submit Order Request (Live URL)
    const response = await fetch("https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: orderTrackingId,
        currency: tier === "CITIZEN" && rawPrice.includes("TZS") ? "TZS" : "USD",
        amount: totalAmount,
        description: `Escape + Vision Trek: ${route.name} (${userData.climbers} climbers) - Includes VAT & Fees`,
        callback_url: `${baseUrl}/booking/success`,
        notification_id: process.env.PESAPAL_IPN_ID,
        billing_address: {
          email_address: userData.email,
          phone_number: userData.phone,
          first_name: userData.name.split(" ")[0] || "Guest",
          last_name: userData.name.split(" ")[1] || "",
        },
      }),
    });

    const result = await response.json();

    if (!result.redirect_url) {
      console.error("PesaPal API Error:", result);
      throw new Error(`PesaPal initiation failed: ${JSON.stringify(result)}`);
    }

    return {
      success: true,
      orderTrackingId,
      redirectUrl: result.redirect_url,
    };
  } catch (error: any) {
    console.error("Payment Initiation Detailed Error:", error);
    throw new Error(error.message || "Payment initiation failed. Please check server logs.");
  }
}