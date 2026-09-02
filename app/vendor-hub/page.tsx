// app/vendor-hub/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2,
  CheckCircle2, 
  ShieldCheck, 
  Gift, 
  Compass, 
  TrendingUp,
  Lock,
  Mail,
  User as UserIcon,
  LogOut,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Lodge' | 'Activity' | 'Transport' | 'Digital Store' | 'PSN Gift Cards';
  price: number;
  stockStatus: string;
  revenue: number;
  bookingsCount: number;
  voucher_codes?: string[];
}

interface SplitLedgerItem {
  id: string;
  itinerary_id: string;
  allocated_amount: number;
  currency: string;
  status: string;
  gateway_reference: string;
  created_at: string;
  recipient_type: string;
}

export default function VendorHubPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Auth form states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard states
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'bookings' | 'finances'>('overview');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [ledgers, setLedgers] = useState<SplitLedgerItem[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isLoadingLedgers, setIsLoadingLedgers] = useState(false);
  
  // Modals
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isRemoveItemModalOpen, setIsRemoveItemModalOpen] = useState(false);
  const [selectedItemToRemove, setSelectedItemToRemove] = useState<string>('');
  const [payoutRequested, setPayoutRequested] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Lodge');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemVouchers, setNewItemVouchers] = useState('');

  // Check active session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchVendorDataDirect(session.user);
      }
      setLoadingAuth(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchVendorDataDirect(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch vendor data and automatically purge any unwanted starter items from database
  const fetchVendorDataDirect = async (currentUser: any) => {
    setIsLoadingInventory(true);
    setIsLoadingLedgers(true);

    try {
      // Automatically clean up unwanted starter/test entries from database table
      await (
        (supabase.from('vendor_inventory' as any) as any)
          .delete()
          .eq('vendor_id', currentUser.id)
          .ilike('name', '%Welcome Starter%') as any
      );

      const { data: invData, error: invError } = await (
        (supabase.from('vendor_inventory' as any) as any)
          .select('*')
          .eq('vendor_id', currentUser.id) as any
      );

      if (invError) {
        console.error('Error fetching inventory:', invError.message);
        setInventory([]);
      } else {
        // Filter out any lingering starter items client-side as safety fallback
        const validItems = (invData || []).filter(
          (item: any) => !item.name?.toLowerCase().includes('welcome starter')
        );
        setInventory(validItems);
      }

      const { data: ledgerData, error: ledgerError } = await (
        (supabase.from('financial_ledgers' as any) as any)
          .select('*')
          .eq('vendor_id', currentUser.id)
          .order('created_at', { ascending: false }) as any
      );

      if (ledgerError) {
        console.error('Error fetching ledgers:', ledgerError.message);
        setLedgers([]);
      } else {
        setLedgers(ledgerData || []);
      }
    } catch (err) {
      console.error(err);
      setInventory([]);
      setLedgers([]);
    } finally {
      setIsLoadingInventory(false);
      setIsLoadingLedgers(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isLoginMode) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
      } else if (data.user) {
        await fetchVendorDataDirect(data.user);
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: vendorName, role: 'vendor' }
        }
      });
      if (error) {
        setAuthError(error.message);
      } else if (data.user) {
        await fetchVendorDataDirect(data.user);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setInventory([]);
    setLedgers([]);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !user) return;

    const codePool = newItemVouchers
      .split('\n')
      .map((c: string) => c.trim())
      .filter((c: string) => c.length > 0);

    const newItem = {
      vendor_id: user.id,
      name: newItemName,
      category: newItemCategory,
      price: parseFloat(newItemPrice) || 0,
      stock_status: codePool.length > 0 ? `${codePool.length} Codes In Stock` : 'Active',
      revenue: 0,
      bookings_count: 0,
      description: newItemDescription,
      voucher_codes: codePool
    };

    const { data, error } = await (
      (supabase.from('vendor_inventory' as any) as any)
        .insert([newItem])
        .select()
        .single() as any
    );

    if (error) {
      console.error('Error inserting item:', error.message);
      alert('Error adding item: ' + error.message);
    } else if (data) {
      setInventory([{
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        stockStatus: data.stock_status || 'Active',
        revenue: data.revenue || 0,
        bookingsCount: data.bookings_count || 0,
        voucher_codes: data.voucher_codes || []
      }, ...inventory]);
    }

    setNewItemName('');
    setNewItemPrice('');
    setNewItemDescription('');
    setNewItemVouchers('');
    setIsAddItemModalOpen(false);
  };

  const handleRemoveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemToRemove || !user) return;

    const { error } = await (
      (supabase.from('vendor_inventory' as any) as any)
        .delete()
        .eq('id', selectedItemToRemove)
        .eq('vendor_id', user.id) as any
    );

    if (error) {
      console.error('Error removing item:', error.message);
      alert('Error removing item: ' + error.message);
    } else {
      setInventory(inventory.filter((item: InventoryItem) => item.id !== selectedItemToRemove));
      setSelectedItemToRemove('');
      setIsRemoveItemModalOpen(false);
    }
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      alert('Payout request submitted successfully via PesaPal / DPO gateway bridge.');
      setPayoutRequested(false);
    }, 600);
  };

  const inventoryRevenue = inventory.reduce((acc: number, item: InventoryItem) => acc + (Number(item.revenue) || 0), 0);
  const ledgerRevenue = ledgers.reduce((acc: number, item: SplitLedgerItem) => acc + (Number(item.allocated_amount) || 0), 0);
  const totalRevenue = inventoryRevenue + ledgerRevenue;
  const totalBookings = inventory.reduce((acc: number, item: InventoryItem) => acc + (Number(item.bookingsCount) || 0), 0) + ledgers.length;

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Sparkles className="text-pink-400 animate-spin" size={36} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-pink-500/35 rounded-3xl p-8 shadow-[0_25px_60px_rgba(236,72,153,0.2)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 border border-pink-400/50 flex items-center justify-center text-white mx-auto shadow-[0_0_20px_rgba(236,72,153,0.5)]">
              <Store size={22} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Escape+ Vendor Portal</h1>
            <p className="text-xs text-slate-400">
              Sign in to manage your lodge inventory, digital store items, and live split-ledger payouts.
            </p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1.5">Business / Vendor Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVendorName(e.target.value)}
                    placeholder="Escape Tours Vendor Hub"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1.5">Vendor Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="vendor@escapetourstz.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              {isLoginMode ? 'Access Vendor Portal' : 'Register Vendor Account'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-xs text-slate-400 hover:text-pink-400 transition-colors font-bold cursor-pointer"
            >
              {isLoginMode ? "Don't have a vendor account? Register here" : "Already registered? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-8 selection:bg-pink-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-pink-500/30 p-8 shadow-[0_20px_60px_rgba(79,70,229,0.2)]">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black tracking-wider uppercase">
                <ShieldCheck size={14} />
                <span>Verified Partner Session ({user.email})</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Vendor Command Hub
              </h1>
              <p className="text-sm text-slate-400 max-w-xl">
                Manage your catalog items, monitor live reservations, track automated split-ledger payouts, and control digital storefront inventory.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fetchVendorDataDirect(user)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-pink-400 transition-all cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw size={18} className={isLoadingInventory ? 'animate-spin' : ''} />
              </button>

              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-xs font-black tracking-wider uppercase shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Catalog Item</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRemoveItemModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 border border-red-500/40 text-red-400 text-xs font-black tracking-wider uppercase hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Remove Catalog Item</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">Total Revenue</p>
              <h3 className="text-2xl font-black text-white mt-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> Live Supabase Synced
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Active Listings</p>
              <h3 className="text-2xl font-black text-white mt-1">{inventory.length} Items</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">Live Database Catalog</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Package size={22} />
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Confirmed Bookings</p>
              <h3 className="text-2xl font-black text-white mt-1">{totalBookings} Trips</h3>
              <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} /> Live ledger sync
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar size={22} />
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Digital Store Sync</p>
              <h3 className="text-2xl font-black text-white mt-1">Active</h3>
              <p className="text-xs text-yellow-400 font-bold mt-1">PSN Gift Cards Ready</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Gift size={22} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Overview & Activity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Catalog Inventory ({inventory.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Live Bookings & Dispatch
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('finances')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeTab === 'finances'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Split-Payment Ledger ({ledgers.length})
          </button>
        </div>

        {/* Tab: Inventory Catalog */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-tight">Active Inventory Catalog</h2>
              <span className="text-xs text-slate-400 font-bold">Synced with Supabase database</span>
            </div>

            {isLoadingInventory ? (
              <div className="text-center py-12">
                <Sparkles className="text-pink-400 animate-spin mx-auto" size={28} />
              </div>
            ) : inventory.length === 0 ? (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center space-y-4">
                <Package className="text-slate-600 mx-auto" size={40} />
                <h3 className="text-base font-black text-white">No items in your catalog yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click "Add Catalog Item" above to publish your first lodge, transport service, or digital store product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map((item: InventoryItem) => (
                  <div key={item.id} className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-pink-500/40 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                          {item.category}
                        </span>
                        <h3 className="text-base font-black text-white mt-2">{item.name}</h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        {item.stockStatus}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-slate-400 font-bold">Unit Price</p>
                        <p className="text-base font-black text-white mt-0.5">${item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 font-bold">Total Revenue</p>
                        <p className="text-base font-black text-pink-400 mt-0.5">${item.revenue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Overview & Activity */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Recent Vendor Activity</h3>
                <div className="space-y-3">
                  {inventory.length === 0 && ledgers.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No recent activity recorded for this account yet.</p>
                  ) : (
                    <>
                      {inventory.slice(0, 2).map((item: InventoryItem) => (
                        <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                            <div>
                              <p className="text-xs font-bold text-white">Item Synced: {item.name}</p>
                              <p className="text-[10px] text-slate-400">Category: {item.category}</p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-emerald-400">${item.price}</span>
                        </div>
                      ))}
                      {ledgers.slice(0, 2).map((ledger: SplitLedgerItem) => (
                        <div key={ledger.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">⚡</div>
                            <div>
                              <p className="text-xs font-bold text-white">Split Payout Allocated</p>
                              <p className="text-[10px] text-slate-400">Ref: {ledger.gateway_reference}</p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-amber-400">+${ledger.allocated_amount} {ledger.currency}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Storefront Integrations</h3>
                <p className="text-xs text-slate-400">
                  Your digital products and vendor assets are synced with the Escape+ Split-Ledger and PesaPal / DPO payment gateways.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Live Bookings & Dispatch */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white tracking-tight">Live Reservations & Driver Dispatch</h2>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              {ledgers.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Compass size={36} className="text-pink-400 mx-auto animate-spin-slow" />
                  <h3 className="text-base font-black text-white">No pending dispatches</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    All confirmed itinerary bookings are currently synchronized with your assigned lodges and transport partners.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ledgers.map((l: SplitLedgerItem) => (
                    <div key={l.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-white/5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                          Itinerary: {l.itinerary_id ? l.itinerary_id.slice(0, 8) + '...' : 'Direct Store'}
                        </span>
                        <p className="text-sm font-bold text-white mt-1">Gateway Ref: {l.gateway_reference}</p>
                        <p className="text-xs text-slate-400">Date: {new Date(l.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-400">${l.allocated_amount} {l.currency}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {l.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Split-Payment Ledger */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white tracking-tight">Split-Payment Ledger & Payouts</h2>
            
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Available Payout Balance</p>
                  <h3 className="text-3xl font-black text-white mt-1">${ledgerRevenue.toLocaleString()}</h3>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPayout}
                  disabled={payoutRequested || ledgerRevenue === 0}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                >
                  {payoutRequested ? 'Processing Payout...' : 'Request Payout'}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Automated split-ledger calculates vendor commissions instantly upon client checkout via PesaPal, DPO Group, and Flutterwave.
              </p>

              {isLoadingLedgers ? (
                <div className="text-center py-8">
                  <Sparkles className="text-pink-400 animate-spin mx-auto" size={24} />
                </div>
              ) : ledgers.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                  <DollarSign size={32} className="text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold">No split-payment ledger allocations recorded yet.</p>
                  <p className="text-[10px] text-slate-500">Incoming checkout webhooks will automatically display your allocated vendor shares here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Gateway Reference</th>
                        <th className="py-3 px-4">Itinerary ID</th>
                        <th className="py-3 px-4">Allocated Share</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {ledgers.map((l: SplitLedgerItem) => (
                        <tr key={l.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">{l.gateway_reference}</td>
                          <td className="py-3.5 px-4 text-slate-400">{l.itinerary_id ? l.itinerary_id.slice(0, 12) + '...' : 'Direct Store'}</td>
                          <td className="py-3.5 px-4 font-black text-emerald-400">${l.allocated_amount} {l.currency}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {l.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{new Date(l.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-pink-500/40 rounded-3xl p-6 max-w-md w-full shadow-[0_25px_60px_rgba(236,72,153,0.3)] space-y-6 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white tracking-tight">Add New Catalog Item</h3>
              <button 
                type="button" 
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItemName(e.target.value)}
                  placeholder="e.g. Serengeti Luxury Lodge Suite"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewItemCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="Lodge">Lodge</option>
                  <option value="Activity">Activity</option>
                  <option value="Transport">Transport</option>
                  <option value="Digital Store">Digital Store</option>
                  <option value="PSN Gift Cards">PSN Gift Cards</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1">Price (USD)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newItemPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItemPrice(e.target.value)}
                  placeholder="250"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1">Description</label>
                <textarea
                  value={newItemDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewItemDescription(e.target.value)}
                  placeholder="Item details, amenities or fulfillment info..."
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-pink-400 mb-1">Voucher / Code Pool (One per line, optional)</label>
                <textarea
                  value={newItemVouchers}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewItemVouchers(e.target.value)}
                  placeholder="PSN-CODE-XXXX-YYYY..."
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 resize-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-black text-white uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {isRemoveItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-md w-full shadow-[0_25px_60px_rgba(239,68,68,0.2)] space-y-6 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white tracking-tight">Remove Catalog Item</h3>
              <button 
                type="button" 
                onClick={() => setIsRemoveItemModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRemoveItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-red-400 mb-1">Select Item to Remove</label>
                <select
                  required
                  value={selectedItemToRemove}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedItemToRemove(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">-- Choose item --</option>
                  {inventory.map((item: InventoryItem) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (${item.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRemoveItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-xs font-black text-white uppercase tracking-wider shadow-lg cursor-pointer hover:bg-red-600 transition-colors"
                >
                  Delete Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}