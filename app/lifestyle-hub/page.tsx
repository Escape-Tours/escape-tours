'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Gift, ShoppingCart, Sparkles, Loader2 } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_status: string;
  vendor_id: string;
}

export default function LifestyleHubPage() {
  const supabase = createClient();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStoreInventory();
  }, []);

  const fetchStoreInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_inventory')
        .select('*')
        .eq('category', 'Digital Store');

      if (error) {
        console.error('Error fetching store items:', error.message);
      } else {
        setStoreItems(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePesaPalCheckout = async (item: StoreItem) => {
    setProcessingId(item.id);
    try {
      // Calls your backend PesaPal initialization endpoint
      const response = await fetch('/api/pesapal/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          itemName: item.name,
          amount: item.price,
          vendorId: item.vendor_id,
          currency: 'USD' // Or TZS based on your configuration
        }),
      });

      const result = await response.json();

      if (result.redirect_url) {
        // Redirect user to PesaPal iframe/checkout page
        window.location.href = result.redirect_url;
      } else {
        alert('Failed to initialize PesaPal checkout: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An error occurred while connecting to PesaPal.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-950/80 via-slate-900 to-purple-950/80 border border-pink-500/30 p-8 shadow-2xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black tracking-wider uppercase">
              <Gift size={14} />
              <span>Escape+ Digital Storefront</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Lifestyle & Rewards Hub
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Browse and purchase digital vendor items, gift cards, and gaming vouchers instantly with secure local & international payments.
            </p>
          </div>
        </div>

        {/* Store Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-pink-400" size={20} />
            Available Vendor Products
          </h2>

          {loading ? (
            <div className="text-center py-16">
              <Sparkles className="text-pink-400 animate-spin mx-auto" size={32} />
            </div>
          ) : storeItems.length === 0 ? (
            <div className="bg-slate-900/85 border border-white/10 rounded-2xl p-12 text-center space-y-3 shadow-xl">
              <Gift className="text-slate-600 mx-auto" size={40} />
              <h3 className="text-base font-black text-white">No digital items listed yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Vendors can add gift cards and items via the Vendor Hub under the "Digital Store" category, and they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeItems.map((item) => (
                <div key={item.id} className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 hover:border-pink-500/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      <Gift size={22} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {item.stock_status || 'In Stock'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">Digital Asset</span>
                    <h3 className="text-lg font-black text-white">{item.name}</h3>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Price</p>
                      <p className="text-xl font-black text-white">${item.price}</p>
                    </div>

                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handlePesaPalCheckout(item)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {processingId === item.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          <span>Buy Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}