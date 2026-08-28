'use client';

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  DollarSign, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Gift, 
  Compass, 
  TrendingUp,
  Lock,
  Mail,
  User as UserIcon,
  LogOut,
  Sparkles
} from 'lucide-react';
import { createClient } from '/lib/supabase/client'; // Adjust path if your supabase client is located elsewhere

interface InventoryItem {
  id: string;
  name: string;
  category: 'Lodge' | 'Activity' | 'Transport' | 'Digital Store';
  price: number;
  stockStatus: string;
  revenue: number;
  bookingsCount: number;
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
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Lodge');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Check active session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchVendorInventory(session.user.id);
      }
      setLoadingAuth(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchVendorInventory(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchVendorInventory = async (userId: string) => {
    setIsLoadingInventory(true);
    try {
      const { data, error } = await supabase
        .from('vendor_inventory')
        .select('*')
        .eq('vendor_id', userId);

      if (error) {
        console.error('Error fetching inventory:', error.message);
        setInventory([]);
      } else {
        setInventory(data || []);
      }
    } catch (err) {
      console.error(err);
      setInventory([]);
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: vendorName, role: 'vendor' }
        }
      });
      if (error) {
        setAuthError(error.message);
      } else {
        alert('Vendor account created! Check your email for confirmation if required, or sign in.');
        setIsLoginMode(true);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setInventory([]);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !user) return;

    const newItem = {
      vendor_id: user.id,
      name: newItemName,
      category: newItemCategory,
      price: parseFloat(newItemPrice) || 0,
      stock_status: 'Active',
      revenue: 0,
      bookings_count: 0
    };

    const { data, error } = await supabase
      .from('vendor_inventory')
      .insert([newItem])
      .select()
      .single();

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
        bookingsCount: data.bookings_count || 0
      }, ...inventory]);
    }

    setNewItemName('');
    setNewItemPrice('');
    setIsAddItemModalOpen(false);
  };

  // Dynamically calculate metrics from live account inventory
  const totalRevenue = inventory.reduce((acc, item) => acc + (Number(item.revenue) || 0), 0);
  const totalBookings = inventory.reduce((acc, item) => acc + (Number(item.bookingsCount) || 0), 0);

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
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-pink-500/30 rounded-3xl p-8 shadow-[0_25px_60px_rgba(236,72,153,0.2)] space-y-6">
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
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="Hellen's Lodge & Safaris"
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-xs font-black tracking-wider uppercase shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Catalog Item</span>
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
                <CheckCircle2 size={12} /> Live account count
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
            Split-Payment Ledger
          </button>
        </div>

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
                {inventory.map((item) => (
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

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Recent Vendor Activity</h3>
                <div className="space-y-3">
                  {inventory.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No recent activity recorded for this account yet.</p>
                  ) : (
                    inventory.slice(0, 3).map((item) => (
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
                    ))
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

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white tracking-tight">Live Reservations & Driver Dispatch</h2>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="text-center py-12 space-y-3">
                <Compass size={36} className="text-pink-400 mx-auto animate-spin-slow" />
                <h3 className="text-base font-black text-white">No pending dispatches</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  All confirmed itinerary bookings are currently synchronized with your assigned lodges and transport partners.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white tracking-tight">Split-Payment Ledger & Payouts</h2>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold">Available Payout Balance</p>
                  <h3 className="text-3xl font-black text-white mt-1">${totalRevenue.toLocaleString()}</h3>
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Request Payout
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Automated split-ledger calculates vendor commissions instantly upon client checkout via PesaPal and Flutterwave.
              </p>
            </div>
          </div>
        )}

        {isAddItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-pink-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_60px_rgba(236,72,153,0.3)] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">Add New Catalog Item</h3>
                <button 
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-pink-400 mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Serengeti Luxury Tent / PSN $100 Card"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-pink-400 mb-2">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Lodge">Lodge</option>
                    <option value="Activity">Activity</option>
                    <option value="Transport">Transport</option>
                    <option value="Digital Store">Digital Store (Gift Cards/Items)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-pink-400 mb-2">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="150"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddItemModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Publish to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}