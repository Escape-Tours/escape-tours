// app/checkout/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { ShieldCheck, Lock, Loader2, ArrowRight, CreditCard, Sparkles, Compass } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  const tier = searchParams.get('tier') || 'INTERNATIONAL';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, amount, tier }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || 'Failed to initialize payment.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 text-stone-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-gradient-to-br from-stone-900/95 via-stone-950/98 to-zinc-950 p-6 sm:p-8 rounded-[2.5rem] border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative z-10">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-amber-500/15">
          <div className="p-3 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-2xl shadow-inner mb-3">
            <Compass size={24} className="text-amber-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-amber-400/90 font-semibold mb-1">Escape Tours & Safaris</span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 tracking-wide">Secure Bespoke Checkout</h1>
        </div>

        {/* Breakdown Card */}
        <div className="bg-stone-950/9output rounded-2xl p-4 sm:p-5 border border-amber-500/20 mb-6 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-stone-400 font-serif uppercase tracking-wider text-[11px]">Booking Reference</span>
            <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {bookingId || 'ESCP-BESPOKE'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-stone-400 font-serif uppercase tracking-wider text-[11px]">Residency Tier</span>
            <span className="font-serif font-semibold text-stone-200 tracking-wider">
              {tier.toUpperCase()}
            </span>
          </div>

          <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-serif font-bold text-amber-400/90 uppercase tracking-widest">Total Investment</span>
            <span className="text-lg sm:text-xl font-serif font-black text-amber-300 tracking-tight">
              ${amount ? Number(amount).toLocaleString() : '0.00'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="relative group overflow-hidden w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-[0.15em] transition-all shadow-[0_10px_25px_rgba(251,191,36,0.25)] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
              <span>Establishing Secure Gateway...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-stone-950 group-hover:scale-110 transition-transform" />
              <span>Proceed to PesaPal Payment</span>
              <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Security Trust Footnote */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-stone-500 font-serif tracking-wider uppercase">
          <Lock size={11} className="text-amber-500/70" />
          <span>256-Bit Encrypted Institutional Transaction</span>
        </div>

      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-stone-900 p-8 rounded-[2rem] border border-amber-500/20 text-center text-stone-400 flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-amber-400" size={24} />
          <span className="font-serif uppercase tracking-widest text-xs">Initializing secure environment...</span>
        </div>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}