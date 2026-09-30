'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Gift, ShoppingCart, Sparkles, Loader2, Search, Filter, ShieldCheck, Zap, Trophy, Flame, Crown } from 'lucide-react';

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

    if (selectedCategory !== 'All') {
      result = result.filter(item => 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

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
    <div className="min-h-screen bg-black text-white pt-36 pb-28 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Subtle ambient luxury gold background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Imperial Hero Banner */}
        <div className="relative overflow-hidden rounded-[3rem] bg-zinc-950 border border-amber-500/30 p-8 sm:p-16 shadow-[0_0_80px_rgba(217,119,6,0.15)]">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-8 max-w-3xl">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-black tracking-[0.2em] uppercase">
              <Crown size={16} className="animate-pulse text-amber-400" />
              <span>Escape+ Imperial Concierge & Elite Rewards</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Lifestyle & Rewards Vault
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed max-w-2xl">
              Immerse yourself in premier digital vendor assets, curated PlayStation gift cards, and high-tier gaming privileges secured instantly through elite banking channels.
            </p>

            {/* Impeccably Clear Luxury Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-bold border-t border-zinc-800">
              <span className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-zinc-900 border border-emerald-500/50 text-emerald-300 shadow-xl">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" /> Instant Digital Delivery
              </span>
              <span className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-zinc-900 border border-amber-500/50 text-amber-300 shadow-xl">
                <Zap size={16} className="text-amber-400 shrink-0" /> Secured by PesaPal & DPO Direct
              </span>
              <span className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-zinc-900 border border-purple-500/50 text-purple-300 shadow-xl">
                <Trophy size={16} className="text-purple-400 shrink-0" /> Verified Vendor Network
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 bg-zinc-950 border border-amber-500/20 p-5 sm:p-6 rounded-[2.5rem] shadow-2xl">
          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 text-amber-400 px-2">
              <Filter size={16} />
              <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Filter:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-[1.02] font-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[280px] sm:w-88">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/70" />
            <input
              type="text"
              placeholder="Search elite rewards, assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-amber-500/30 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner font-medium"
            />
          </div>
        </div>

        {/* Store Grid Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Flame className="text-amber-500 fill-amber-500/20 animate-pulse" size={26} />
              Exclusive Vendor Collection
            </h2>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-5 py-2.5 rounded-xl border border-amber-500/30 shadow-md">
              {filteredItems.length} {filteredItems.length === 1 ? 'Privilege Available' : 'Privileges Available'}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-36 space-y-4 bg-zinc-950 rounded-[2.5rem] border border-amber-500/20">
              <Loader2 className="text-amber-400 animate-spin mx-auto" size={48} />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-500/80">Loading Imperial Vault...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-zinc-950 border border-amber-500/35 rounded-[2.5rem] p-24 text-center space-y-6 shadow-2xl">
              <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                <Gift size={44} />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-white">No privileges found</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'No items match your active filters or query. Please adjust your criteria.'
                    : 'Vendors can list items via the Vendor Hub under the "Digital Store" or "PSN Gift Cards" category to populate this concierge vault.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative bg-zinc-950 border border-amber-500/25 rounded-[2.5rem] p-8 shadow-2xl space-y-6 hover:border-amber-400 hover:shadow-[0_0_50px_rgba(245,158,11,0.25)] transition-all duration-500 flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500 pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 flex items-center justify-center text-black shadow-[0_10px_25px_rgba(245,158,11,0.35)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <Gift size={30} className="stroke-[2.5]" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30 shadow-md">
                        {item.stock_status || 'In Stock'}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30 inline-block">
                        {item.category || 'Digital Asset'}
                      </span>
                      <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      {item.description ? (
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-400 italic">
                          Instant automated digital dispatch upon successful transaction clearance.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800 flex items-center justify-between mt-auto relative z-10">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Valuation</p>
                      <p className="text-3xl font-black text-amber-300 tracking-tight">${item.price}</p>
                    </div>

                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handlePesaPalCheckout(item)}
                      className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black text-xs font-black uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 font-black"
                    >
                      {processingId === item.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-black" />
                          <span>Securing...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} className="text-black" />
                          <span>Acquire</span>
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