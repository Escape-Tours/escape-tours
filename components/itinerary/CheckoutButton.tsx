"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useItineraryStore } from "@/store/useItineraryStore";
import { saveUserItinerary } from "@/lib/utils/itinerary-actions";
import { useUser } from "@/components/providers/UserContext";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";

interface CheckoutButtonProps {
  amount?: number;
  total?: number;
  itineraryId?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function CheckoutButton({ amount, total, itineraryId, className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { tier } = useUser();
  
  // Pull items and metadata directly from the store
  const { items, adults, children } = useItineraryStore();
  
  // Calculate live total price, ensuring proper numeric coercion
  const calculatedTotal = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [items]);

  // Resolve final total with bulletproof precedence: explicit props -> store calculation -> 0
  const finalTotal = (!items || items.length === 0) ? 0 : (amount ?? total ?? calculatedTotal);

  const handleCheckout = async () => {
    if (finalTotal <= 0 || isLoading) return;
    setIsLoading(true);

    try {
      // 1. Generate or resolve a robust booking reference ID
      const currentBookingId = itineraryId || `ESCP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // 2. Safely auto-save itinerary context to the database/User Hub prior to payment routing
      try {
        await saveUserItinerary();
      } catch (saveError) {
        console.warn("Non-blocking itinerary save warning:", saveError);
      }

      // 3. Dispatch structured payload to the payment gateway integration endpoint
      const response = await fetch('/api/checkout/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          tier, 
          adults, 
          children, 
          amount: finalTotal, 
          itineraryId: currentBookingId 
        }),
      });
      
      const data = await response.json();
      const redirectUrl = data.redirect_url || data.redirectUrl || data.payment_url || data.url;
      
      if (data.success && redirectUrl) {
        // Mobile-optimized navigation handler preventing async or popup-blocker issues on iOS/Android
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.assign(redirectUrl);
        } else {
          window.location.href = redirectUrl;
        }
      } else {
        console.error("Payment Gateway Initialization Error:", data);
        alert(data.error || "Unable to initialize secure checkout session. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Network or unexpected checkout error:", error);
      alert("A network error occurred while reaching the payment gateway. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button"
      onClick={handleCheckout} 
      disabled={isLoading || finalTotal <= 0}
      className={`relative group overflow-hidden w-full transition-all duration-300 shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        className || 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black tracking-wide py-4 rounded-2xl'
      }`}
    >
      <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%]" />
      
      <div className="relative flex items-center justify-center gap-2.5 w-full">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            <span className="text-xs uppercase tracking-[0.15em] font-black">Initializing Secure Gateway...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-slate-950/80 group-hover:scale-110 transition-transform" />
            <span className="text-xs uppercase tracking-[0.12em] font-black">
              Proceed to Checkout (${(Number(finalTotal) || 0).toLocaleString()})
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950/80 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </div>
    </Button>
  );
}