"use client";

import { useState } from "react";
import { initiatePesapalPayment } from "@/actions/payment";
import { Button } from "@/components/ui/button";

export function BookingForm({ route, tier }: { route: any; tier: string }) {
  const [loading, setLoading] = useState(false);

  async function handleBooking(formData: FormData) {
    setLoading(true);
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    try {
      const result = await initiatePesapalPayment(route, tier, userData);
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (err) {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleBooking} className="space-y-4 p-6 bg-white rounded-2xl shadow-sm border">
      <input name="name" placeholder="Full Name" required className="w-full p-3 border rounded-lg" />
      <input name="email" type="email" placeholder="Email Address" required className="w-full p-3 border rounded-lg" />
      <input name="phone" placeholder="Phone Number (e.g. 255...)" required className="w-full p-3 border rounded-lg" />
      <Button type="submit" className="w-full bg-amber-500 py-6" disabled={loading}>
        {loading ? "Processing..." : "Confirm & Pay with PesaPal"}
      </Button>
    </form>
  );
}