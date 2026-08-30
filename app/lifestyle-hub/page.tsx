'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Gift, ShoppingCart, Sparkles, Loader2, Search, Filter, ShieldCheck, Zap } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_status: string;
  vendor_id: string;
  description?: string;
  voucher_codes?: string[];
}

export default function LifestyleHubPage() {
  const supabase = createClient();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchStoreInventory = async (isInitial = false) => {
    try {
      const { data, error } = await (supabase
        .from('vendor_inventory' as any)
        .select('*') as any);

      if (error) {
        console.error('Error fetching store items:', error.message);
      } else {
        // Map raw data safely to StoreItem structure to resolve TypeScript union/missing property errors
        const mappedItems: StoreItem[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.title || item.name || 'Digital Item',
          category: item.category || 'Digital Store',
          price: Number(item.base_price ?? item.price ?? 0),
          stock_status: item.stock_status || 'In Stock',
          vendor_id: item.vendor_id || item.user_id || '',
          description: item.description,
          voucher_codes: item.voucher_codes
        }));

        // Filter items that belong to Digital Store or gift cards/vouchers
        const digitalItems = mappedItems.filter(
          item => item.category === 'Digital Store' || item.category === 'PSN Gift Cards' || item.category.toLowerCase().includes('gift')
        );
        setStoreItems(digitalItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStoreInventory(true);

    // Subscribe to real-time changes on vendor_inventory
    const channel = supabase
      .channel('lifestyle-hub-inventory-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendor_inventory' },
        (payload) => {
          console.log('Real-time inventory change detected:', payload);
          fetchStoreInventory(false);
        }
      )
      .subscribe();

    // Safety fallback poll every 4 seconds to guarantee sync with Vendor Hub deletions/additions
    const intervalId = setInterval(() => {
      fetchStoreInventory(false);
    }, 4000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let result = storeItems;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(item => 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, storeItems]);

  const handlePesaPalCheckout = async (item: StoreItem) => {
    setProcessingId(item.id);
    try {
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
          currency: 'USD'
        }),
      });

      const result = await response.json();

      if (result.redirect_url) {
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

  const categories = ['All', 'Digital Store', 'PSN Gift Cards'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-8 selection:bg-pink-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Magnificent Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-950/80 via-slate-900 to-purple-950/80 border border-pink-500/30 p-8 sm:p-12 shadow-[0_0_50px_rgba(236,72,153,0.15)]">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-20 top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black tracking-wider uppercase backdrop-blur-md">
              <Gift size={14} className="animate-bounce" />
              <span>Escape+ Digital Storefront & Rewards</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Lifestyle & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Rewards Hub</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Browse and purchase exclusive digital vendor items, PlayStation gift cards, and gaming vouchers instantly with secure local & international payments.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={16} /> Instant Digital Delivery
              </span>
              <span className="flex items-center gap-1.5 text-pink-400">
                <Zap size={16} /> Secured by PesaPal & DPO
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter size={16} className="text-pink-400 ml-2 mr-1 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search store items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Store Grid Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="text-pink-400" size={20} />
              Available Vendor Products
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-24 space-y-4">
              <Loader2 className="text-pink-400 animate-spin mx-auto" size={40} />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Loading digital catalog...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-slate-900/85 border border-white/10 rounded-3xl p-16 text-center space-y-4 shadow-2xl backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400">
                <Gift size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">No digital products found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'No products match your current filters or search query. Try broadening your search.'
                    : 'Vendors can add gift cards and items via the Vendor Hub under the "Digital Store" or "PSN Gift Cards" category, and they will appear here instantly.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-6 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Gift size={26} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm">
                        {item.stock_status || 'In Stock'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">
                          {item.category || 'Digital Asset'}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-pink-300 transition-colors">
                        {item.name}
                      </h3>
                      {item.description ? (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          Instant digital delivery upon successful checkout.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</p>
                      <p className="text-2xl font-black text-white">${item.price}</p>
                    </div>

                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handlePesaPalCheckout(item)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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