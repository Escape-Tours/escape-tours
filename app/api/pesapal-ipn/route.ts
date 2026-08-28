import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// PesaPal sends IPNs via POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = body;

    console.log("PesaPal IPN Received:", { OrderTrackingId, OrderMerchantReference });

    // 1. You MUST acknowledge the IPN immediately with a 200 OK
    // 2. Then, verify the status by calling PesaPal's 'GetTransactionStatus' API
    // 3. Finally, update your database record where id = OrderMerchantReference
    
    return NextResponse.json({ message: "Acknowledged" }, { status: 200 });
  } catch (error) {
    console.error("IPN Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}