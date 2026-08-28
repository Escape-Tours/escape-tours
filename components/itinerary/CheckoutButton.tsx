"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useItineraryStore } from "store/useItineraryStore";
import { saveUserItinerary } from "@/lib/utils/itinerary-actions";
import { useUser } from "@/components/providers/UserContext";

interface CheckoutButtonProps {
  amount?: number;
  total?: number;
  itineraryId?: string;
  className?: string;
  [key: string]: any;
}

export default function CheckoutButton({ amount, total, itineraryId, className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { tier } = useUser();
  
  // Pull items directly from the store
  const { items, adults, children } = useItineraryStore();
  
  // Calculate live total price, forcing 0 if there are no items selected
  const calculatedTotal = useMemo(() => {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((acc, item) => {
      return acc + (Number(item.price) || 0);
    }, 0);
  }, [items]);

  // Fallback order: Explicit amount -> Explicit total -> Live calculated store total (or 0 if empty)
  const finalTotal = (!items || items.length === 0) ? 0 : (amount ?? total ?? calculatedTotal);

  const handleCheckout = async () => {
    if (finalTotal <= 0) return;
    setIsLoading(true);
    try {
      // 1. Automatically save the itinerary to the database/User Hub on checkout attempt
      await saveUserItinerary();

      // 2. Proceed with the payment gateway request passing full itinerary state items to the correct PesaPal endpoint route
      const res = await fetch('/api/checkout/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          tier, 
          adults, 
          children, 
          amount: finalTotal, 
          itineraryId 
        }),
      });
      
      const data = await res.json();
      
      // Support all variations of the redirect URL returned by APIs
      const redirectUrl = data.redirect_url || data.redirectUrl || data.payment_url || data.url;
      
      if (data.success && redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("No redirect URL returned from checkout API", data);
        alert(data.error || "Checkout initialization failed");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An unexpected error occurred during checkout initialization.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={isLoading || finalTotal <= 0}
      className={`w-full font-black ${className || 'bg-amber-500 hover:bg-amber-600 text-black'}`}
    >
      {isLoading ? "Processing..." : `Proceed to Secure Checkout ($${(Number(finalTotal) || 0).toLocaleString()})`}
    </Button>
  );
}