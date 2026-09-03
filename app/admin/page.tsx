'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Database, 
  Truck, 
  Store, 
  Users, 
  RefreshCw, 
  Loader2, 
  Lock, 
  DollarSign, 
  Activity, 
  Calendar, 
  LogOut,
  Plus,
  Trash2,
  UserCog
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FleetVehicle {
  id: string;
  vehicle_name: string;
  plate_number: string;
  station_location: string;
  status: 'ACTIVE' | 'ON_ROUTE' | 'MAINTENANCE' | 'STANDBY';
  driver_assigned: string;
  fuel_status: string;
}

interface VendorContract {
  id: string;
  vendor_name: string;
  service_type: string;
  commission_rate: number;
  balance_payout: number;
  status: 'PENDING' | 'SETTLED' | 'ACTIVE';
}

interface BookingRecord {
  id: string;
  client_name?: string;
  package_title?: string;
  total_amount?: number;
  payment_status?: string;
  payment_gateway?: string;
  created_at: string;
  is_draft?: boolean;
  status?: string;
}

interface UserRecord {
  id: string;
  email?: string;
  role?: string;
  created_at?: string;
  full_name?: string;
  name?: string;
}

interface StoreItem {
  id: string;
  item_name?: string;
  title?: string;
  category: string;
  stock_count?: number;
  stock?: number;
  price: number;
}

export default function ComprehensiveExecutiveAdmin() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'vendors' | 'inventory' | 'users' | 'financials' | 'bookings'>('dashboard');
  
  // Real DB state
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [fleetLoading, setFleetLoading] = useState(false);
  const [vendors, setVendors] = useState<VendorContract[]>([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [storeLoading, setStoreLoading] = useState(false);
  const [appUsers, setAppUsers] = useState<UserRecord[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    stripeRevenue: 0, 
    dpoRevenue: 0, 
    pesapalRevenue: 0, 
    activeBookings: 0, 
    fleetCount: 0 
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New Fleet Form Modal state
  const [showAddFleet, setShowAddFleet] = useState(false);
  const [newFleet, setNewFleet] = useState({
    vehicle_name: '',
    plate_number: '',
    station_location: 'National Parks & Expedition Hub',
    status: 'ACTIVE' as const,
    driver_assigned: '',
    fuel_status: 'Full Tank'
  });

  const supabase = createClient();
  const ADMIN_SECRET = 'EscapeAdmin2026!';

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('escape_executive_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_SECRET) {
      setIsAuthenticated(true);
      sessionStorage.setItem('escape_executive_auth', 'true');
      fetchAllData();
    } else {
      alert('Invalid Executive Passcode.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('escape_executive_auth');
    setPasscode('');
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchFleet(),
      fetchVendors(),
      fetchBookings(),
      fetchStoreItems(),
      fetchAppUsers()
    ]);
  };

  const fetchFleet = async () => {
    setFleetLoading(true);
    try {
      const { data, error } = await supabase
        .from('fleet_vehicles' as any)
        .select('*')
        .order('vehicle_name', { ascending: true });

      if (error) throw error;
      const list = (data as unknown as FleetVehicle[]) || [];
      setFleetVehicles(list);
      setStats(prev => ({ ...prev, fleetCount: list.length }));
    } catch (err) {
      console.error('Error fetching fleet from Supabase:', err);
      setFleetVehicles([]);
      setStats(prev => ({ ...prev, fleetCount: 0 }));
    } finally {
      setFleetLoading(false);
    }
  };

  const handleAddFleet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('fleet_vehicles' as any)
        .insert([newFleet] as any)
        .select();

      if (error) throw error;
      if (data) {
        const inserted = data as unknown as FleetVehicle[];
        setFleetVehicles(prev => [...prev, inserted[0]]);
        setStats(prev => ({ ...prev, fleetCount: prev.fleetCount + 1 }));
      }
      setShowAddFleet(false);
      setNewFleet({ vehicle_name: '', plate_number: '', station_location: 'National Parks & Expedition Hub', status: 'ACTIVE', driver_assigned: '', fuel_status: 'Full Tank' });
      fetchFleet();
    } catch (err: any) {
      console.error('Error inserting fleet:', err);
      alert(`Failed to insert fleet vehicle into Supabase: ${err.message || JSON.stringify(err)}`);
    }
  };

  const handleDeleteFleet = async (id: string) => {
    if (!confirm('Are you sure you want to remove this fleet vehicle asset?')) return;
    try {
      const { error } = await supabase
        .from('fleet_vehicles' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFleetVehicles(prev => prev.filter(v => v.id !== id));
      setStats(prev => ({ ...prev, fleetCount: Math.max(0, prev.fleetCount - 1) }));
    } catch (err: any) {
      console.error('Error deleting fleet vehicle:', err);
      alert(`Failed to delete vehicle: ${err.message || JSON.stringify(err)}`);
    }
  };

  const fetchVendors = async () => {
    setVendorLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendor_contracts' as any)
        .select('*')
        .order('vendor_name', { ascending: true });

      if (error) throw error;
      setVendors((data as unknown as VendorContract[]) || []);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setVendors([]);
    } finally {
      setVendorLoading(false);
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings' as any)
        .select('*')
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const records = (data as unknown as BookingRecord[]) || [];
      setBookings(records);

      let totalRev = 0;
      let stripeRev = 0;
      let dpoRev = 0;
      let pesapalRev = 0;

      records.forEach((b: any) => {
        const isCompleted = (b.payment_status || '').toUpperCase() === 'COMPLETED' || (b.payment_status || '').toUpperCase() === 'PAID';
        if (isCompleted) {
          const amt = Number(b.total_amount) || 0;
          totalRev += amt;
          const gateway = (b.payment_gateway || '').toLowerCase();
          if (gateway.includes('stripe')) stripeRev += amt;
          else if (gateway.includes('dpo')) dpoRev += amt;
          else if (gateway.includes('pesapal') || gateway.includes('pesa')) pesapalRev += amt;
          else stripeRev += amt;
        }
      });

      setStats(prev => ({
        ...prev,
        totalRevenue: totalRev,
        stripeRevenue: stripeRev,
        dpoRevenue: dpoRev,
        pesapalRevenue: pesapalRev,
        activeBookings: records.length
      }));
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchStoreItems = async () => {
    setStoreLoading(true);
    try {
      let items: StoreItem[] = [];
      const { data: storeData } = await supabase.from('store_items' as any).select('*');
      if (storeData) items = [...(storeData as unknown as StoreItem[])];

      const { data: hubData } = await supabase.from('storefront_items' as any).select('*');
      if (hubData) {
        (hubData as unknown as StoreItem[]).forEach((item: any) => {
          if (!items.some(i => i.id === item.id)) items.push(item);
        });
      }

      setStoreItems(items);
    } catch (err) {
      console.error('Error fetching store items:', err);
      setStoreItems([]);
    } finally {
      setStoreLoading(false);
    }
  };

  const fetchAppUsers = async () => {
    setUsersLoading(true);
    try {
      let { data, error } = await supabase
        .from('user_profiles' as any)
        .select('*');

      if (error || !data || data.length === 0) {
        const { data: altData } = await supabase
          .from('profiles' as any)
          .select('*');
        if (altData && altData.length > 0) {
          data = altData;
        }
      }

      setAppUsers((data as unknown as UserRecord[]) || []);
    } catch (err) {
      console.error('Error fetching profiles/users:', err);
      setAppUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      let { error } = await supabase
        .from('user_profiles' as any)
        .update({ role: newRole } as any)
        .eq('id', userId);

      if (error) {
        const { error: altError } = await supabase
          .from('profiles' as any)
          .update({ role: newRole } as any)
          .eq('id', userId);
        if (altError) throw altError;
      }

      setAppUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      console.error('Error updating user role:', err);
      alert(`Failed to update user role in Supabase: ${err.message || JSON.stringify(err)}`);
    } finally {
      setActionLoading(null);
    }
  };

  const settleVendor = async (id: string) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('vendor_contracts' as any)
        .update({ status: 'SETTLED', balance_payout: 0 } as any)
        .eq('id', id);

      if (error) throw error;
      setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'SETTLED', balance_payout: 0 } : v));
    } catch (err) {
      console.error('Error settling vendor:', err);
      alert('Failed to update vendor contract status in Supabase.');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900/90 border border-amber-500/35 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 mb-4">
              <Lock size={28} />
            </div>
            <h1 className="font-serif font-extrabold text-xl text-stone-100 tracking-wider uppercase">Executive Gateway</h1>
            <p className="text-xs text-stone-400 font-serif mt-1">Enter clearance passcode to access live Supabase admin operations.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Passcode..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 font-mono text-sm focus:outline-none focus:border-amber-500 transition"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Authenticate Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-stone-900/60 border-r border-amber-500/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-serif font-extrabold text-sm text-stone-100 uppercase tracking-widest">Escape Tours</h2>
              <p className="text-[10px] text-amber-400 font-mono">Executive Admin v2.6</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'fleet', label: 'Fleet Grid', icon: Truck },
              { id: 'vendors', label: 'Vendor Approvals', icon: Database },
              { id: 'inventory', label: 'Inventory Health', icon: Store },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'financials', label: 'Financials', icon: DollarSign },
              { id: 'bookings', label: 'Bookings & Payment', icon: Calendar },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-serif font-bold uppercase tracking-wider transition cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20' 
                      : 'text-stone-300 hover:bg-stone-800/60 hover:text-amber-400'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-stone-800/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl text-xs font-serif font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-6 shadow-xl backdrop-blur-xl">
          <div>
            <h1 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">
              {activeTab === 'dashboard' && 'Executive Control Hub'}
              {activeTab === 'fleet' && 'Expedition Fleet & Transport Matrix'}
              {activeTab === 'vendors' && 'Vendor Approvals & Contracts'}
              {activeTab === 'inventory' && 'Digital Storefront & Inventory Health'}
              {activeTab === 'users' && 'User & Client Role Management'}
              {activeTab === 'financials' && 'Revenue & Stripe/DPO Ledgers'}
              {activeTab === 'bookings' && 'Live Bookings & Payment Gateway'}
            </h1>
            <p className="text-xs text-stone-400 font-serif mt-1">Live Supabase synchronization for Escape Tours operations.</p>
          </div>
          <button 
            onClick={fetchAllData}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer"
          >
            <RefreshCw size={14} className={fleetLoading || vendorLoading || bookingsLoading || storeLoading || usersLoading ? 'animate-spin' : ''} />
            <span>Sync Live Database</span>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-6 space-y-3">
                <div className="flex justify-between items-center text-amber-400">
                  <span className="text-xs font-serif uppercase tracking-widest">Active Bookings</span>
                  <Calendar size={18} />
                </div>
                <div className="text-3xl font-serif font-extrabold text-stone-100">{stats.activeBookings}</div>
                <p className="text-xs text-stone-400 font-serif">Verified safaris & completed itineraries</p>
              </div>
              <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-6 space-y-3">
                <div className="flex justify-between items-center text-amber-400">
                  <span className="text-xs font-serif uppercase tracking-widest">Total Revenue (YTD)</span>
                  <DollarSign size={18} />
                </div>
                <div className="text-3xl font-serif font-extrabold text-stone-100">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-stone-400 font-serif">Live completed gateway receipts</p>
              </div>
              <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-6 space-y-3">
                <div className="flex justify-between items-center text-amber-400">
                  <span className="text-xs font-serif uppercase tracking-widest">Expedition Fleet Assets</span>
                  <Truck size={18} />
                </div>
                <div className="text-3xl font-serif font-extrabold text-emerald-400">{stats.fleetCount} Active</div>
                <p className="text-xs text-stone-400 font-serif">Safari vehicles deployed & serviced</p>
              </div>
            </div>

            <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-4">
              <h2 className="font-serif font-extrabold text-lg text-stone-100 uppercase tracking-widest">Quick Operations Shortcuts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setActiveTab('fleet')} className="p-4 bg-stone-950/60 hover:bg-stone-800/80 border border-stone-800 rounded-2xl text-left transition cursor-pointer space-y-2">
                  <Truck className="text-amber-400" size={20} />
                  <div className="font-serif font-bold text-sm text-stone-100">Manage Fleet</div>
                  <p className="text-[11px] text-stone-400">View license plates, drivers, and park stations.</p>
                </button>
                <button onClick={() => setActiveTab('vendors')} className="p-4 bg-stone-950/60 hover:bg-stone-800/80 border border-stone-800 rounded-2xl text-left transition cursor-pointer space-y-2">
                  <Database className="text-amber-400" size={20} />
                  <div className="font-serif font-bold text-sm text-stone-100">Vendor Payouts</div>
                  <p className="text-[11px] text-stone-400">Settle commission balances with lodges.</p>
                </button>
                <button onClick={() => setActiveTab('bookings')} className="p-4 bg-stone-950/60 hover:bg-stone-800/80 border border-stone-800 rounded-2xl text-left transition cursor-pointer space-y-2">
                  <Calendar className="text-amber-400" size={20} />
                  <div className="font-serif font-bold text-sm text-stone-100">Review Bookings</div>
                  <p className="text-[11px] text-stone-400">Inspect live completed itineraries and payments.</p>
                </button>
                <button onClick={() => setActiveTab('inventory')} className="p-4 bg-stone-950/60 hover:bg-stone-800/80 border border-stone-800 rounded-2xl text-left transition cursor-pointer space-y-2">
                  <Store className="text-amber-400" size={20} />
                  <div className="font-serif font-bold text-sm text-stone-100">Storefront Items</div>
                  <p className="text-[11px] text-stone-400">PSN gift cards & digital lifestyle inventory.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Expedition Fleet & Transport Assets</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Real-time national park and safari expedition vehicle assignments.</p>
              </div>
              <button 
                onClick={() => setShowAddFleet(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Plus size={16} />
                <span>Add Fleet Vehicle</span>
              </button>
            </div>

            {showAddFleet && (
              <form onSubmit={handleAddFleet} className="p-6 bg-stone-950/80 border border-amber-500/30 rounded-2xl space-y-4">
                <h3 className="font-serif font-bold text-sm text-amber-400 uppercase tracking-wider">Register New Safari Vehicle</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Vehicle Name (e.g. Land Cruiser V8)"
                    required
                    value={newFleet.vehicle_name}
                    onChange={e => setNewFleet({...newFleet, vehicle_name: e.target.value})}
                    className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 font-serif focus:border-amber-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Plate Number (e.g. T 452 ABC)"
                    required
                    value={newFleet.plate_number}
                    onChange={e => setNewFleet({...newFleet, plate_number: e.target.value})}
                    className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 font-mono focus:border-amber-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Station Location"
                    required
                    value={newFleet.station_location}
                    onChange={e => setNewFleet({...newFleet, station_location: e.target.value})}
                    className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 font-serif focus:border-amber-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Assigned Driver Name"
                    required
                    value={newFleet.driver_assigned}
                    onChange={e => setNewFleet({...newFleet, driver_assigned: e.target.value})}
                    className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 font-serif focus:border-amber-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddFleet(false)} className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-serif uppercase">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs font-serif uppercase">Save Vehicle</button>
                </div>
              </form>
            )}

            {fleetLoading ? (
              <div className="flex justify-center items-center py-16 text-amber-400">
                <Loader2 className="animate-spin mr-2" size={24} />
                <span className="font-serif text-sm tracking-widest uppercase">Querying Fleet Database...</span>
              </div>
            ) : fleetVehicles.length === 0 ? (
              <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                <p className="font-serif text-stone-400 text-sm">No fleet vehicles recorded in Supabase.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fleetVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="relative p-6 bg-stone-950/60 rounded-2xl border border-stone-800/80 space-y-4 shadow-lg hover:border-amber-500/40 transition">
                    <button 
                      onClick={() => handleDeleteFleet(vehicle.id)}
                      title="Remove Vehicle"
                      className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex justify-between items-start pr-8">
                      <div>
                        <h3 className="font-serif font-bold text-stone-100 text-sm">{vehicle.vehicle_name}</h3>
                        <p className="text-xs font-mono text-amber-400 mt-0.5">{vehicle.plate_number}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        vehicle.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        vehicle.status === 'ON_ROUTE' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                        'bg-stone-800 text-stone-400 border border-stone-700'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-serif text-stone-300 pt-2 border-t border-stone-800/60">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Station / Location:</span>
                        <span className="font-bold text-stone-100">{vehicle.station_location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Assigned Driver:</span>
                        <span className="font-bold text-stone-100">{vehicle.driver_assigned || 'Unassigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Fuel Status:</span>
                        <span className="font-mono text-amber-400">{vehicle.fuel_status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Vendor Rate & Commission Matrix</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Live Supabase supplier contracts, lodge markups, and payout settlements.</p>
              </div>
              <button onClick={fetchVendors} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                <RefreshCw size={14} className={vendorLoading ? 'animate-spin' : ''} />
                <span>Sync Live DB</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {vendorLoading ? (
                <div className="flex justify-center items-center py-16 text-amber-400">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span className="font-serif text-sm tracking-widest uppercase">Querying Vendor Ledgers...</span>
                </div>
              ) : vendors.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                  <p className="font-serif text-stone-400 text-sm">No active vendor contracts found in Supabase.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                      <th className="p-4">Vendor Name</th>
                      <th className="p-4">Service Type</th>
                      <th className="p-4">Commission Rate</th>
                      <th className="p-4">Balance Payout</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                    {vendors.map((v) => (
                      <tr key={v.id} className="hover:bg-stone-800/40">
                        <td className="p-4 font-bold text-stone-100">{v.vendor_name}</td>
                        <td className="p-4 text-stone-300">{v.service_type}</td>
                        <td className="p-4 font-mono text-amber-400">{v.commission_rate}%</td>
                        <td className="p-4 font-mono font-bold text-stone-100">${v.balance_payout.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            v.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {v.status !== 'SETTLED' && (
                            <button
                              disabled={actionLoading === v.id}
                              onClick={() => settleVendor(v.id)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-[10px] uppercase transition cursor-pointer shadow"
                            >
                              {actionLoading === v.id ? 'Processing...' : 'Settle Payout'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Digital Storefront & Lifestyle Hub Inventory</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">PSN gift cards, gear, and merchandise stock catalog.</p>
              </div>
              <button onClick={fetchStoreItems} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                <RefreshCw size={14} className={storeLoading ? 'animate-spin' : ''} />
                <span>Sync Live DB</span>
              </button>
            </div>

            {storeLoading ? (
              <div className="flex justify-center items-center py-16 text-amber-400">
                <Loader2 className="animate-spin mr-2" size={24} />
                <span className="font-serif text-sm tracking-widest uppercase">Querying Storefront Catalog...</span>
              </div>
            ) : storeItems.length === 0 ? (
              <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                <p className="font-serif text-stone-400 text-sm">No storefront items found in Supabase.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeItems.map((item) => (
                  <div key={item.id} className="p-6 bg-stone-950/60 rounded-2xl border border-stone-800/80 space-y-3 shadow-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif font-bold text-stone-100 text-sm">{item.item_name || item.title || 'Digital Item'}</h3>
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[9px] font-mono uppercase">
                        {item.category || 'General'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-stone-800/60 text-xs font-serif">
                      <span className="text-stone-400">Stock Available:</span>
                      <span className="font-mono font-bold text-emerald-400">{item.stock_count ?? item.stock ?? 100} units</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-serif">
                      <span className="text-stone-400">Unit Price:</span>
                      <span className="font-mono font-bold text-stone-100">${item.price?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">User & Client Role Management</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Manage registered profiles and assign executive, agent, or client roles.</p>
              </div>
              <button onClick={fetchAppUsers} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                <RefreshCw size={14} className={usersLoading ? 'animate-spin' : ''} />
                <span>Sync Live DB</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {usersLoading ? (
                <div className="flex justify-center items-center py-16 text-amber-400">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span className="font-serif text-sm tracking-widest uppercase">Querying User Database...</span>
                </div>
              ) : appUsers.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                  <p className="font-serif text-stone-400 text-sm">No user profiles discovered in Supabase.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                      <th className="p-4">User Email</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Registered Date</th>
                      <th className="p-4">Current Role</th>
                      <th className="p-4 text-right">Action / Change Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                    {appUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-800/40">
                        <td className="p-4 font-mono font-bold text-stone-100">{u.email || 'No Email Record'}</td>
                        <td className="p-4 text-stone-300">{u.full_name || u.name || 'Unnamed User'}</td>
                        <td className="p-4 font-mono text-stone-400">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            (u.role || '').toUpperCase() === 'ADMIN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            (u.role || '').toUpperCase() === 'AGENT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                            'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}>
                            {u.role || 'CLIENT'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            disabled={actionLoading === u.id}
                            value={u.role || 'client'}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            className="bg-stone-950 border border-stone-800 text-amber-400 font-bold rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="client">CLIENT</option>
                            <option value="agent">AGENT</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-6 space-y-3">
                <span className="text-xs font-serif uppercase tracking-widest text-amber-400">Stripe Gateway Receipts</span>
                <div className="text-3xl font-serif font-extrabold text-stone-100">${stats.stripeRevenue.toLocaleString()}</div>
                <p className="text-xs text-stone-400 font-serif">International Visa/Mastercard payments</p>
              </div>
              <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-6 space-y-3">
                <span className="text-xs font-serif uppercase tracking-widest text-amber-400">DPO Group Receipts</span>
                <div className="text-3xl font-serif font-extrabold text-stone-100">${stats.dpoRevenue.toLocaleString()}</div>
                <p className="text-xs text-stone-400 font-serif">East African regional card processor</p>
              </div>
              <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-6 space-y-3">
                <span className="text-xs font-serif uppercase tracking-widest text-amber-400">PesaPal Gateway Receipts</span>
                <div className="text-3xl font-serif font-extrabold text-stone-100">${stats.pesapalRevenue.toLocaleString()}</div>
                <p className="text-xs text-stone-400 font-serif">Mobile money and local bank settlements</p>
              </div>
            </div>

            <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-4">
              <h2 className="font-serif font-extrabold text-lg text-stone-100 uppercase tracking-widest">Financial Auditing & Gateway Summary</h2>
              <p className="text-xs text-stone-300 font-serif leading-relaxed">
                All receipts are securely tracked directly via live Supabase bookings and payment status columns. Gateway payouts settle automatically according to configured vendor commission agreements.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Live Bookings & Payment Gateway</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Verified safari itineraries and customer payment records.</p>
              </div>
              <button onClick={fetchBookings} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                <RefreshCw size={14} className={bookingsLoading ? 'animate-spin' : ''} />
                <span>Sync Live DB</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {bookingsLoading ? (
                <div className="flex justify-center items-center py-16 text-amber-400">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span className="font-serif text-sm tracking-widest uppercase">Querying Bookings Database...</span>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                  <p className="font-serif text-stone-400 text-sm">No completed bookings found in Supabase.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Package / Itinerary</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Gateway</th>
                      <th className="p-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-800/40">
                        <td className="p-4 font-bold text-stone-100">{b.client_name || 'Valued Client'}</td>
                        <td className="p-4 text-stone-300">{b.package_title || 'Custom Safari Expedition'}</td>
                        <td className="p-4 font-mono text-amber-400">${Number(b.total_amount || 0).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            (b.payment_status || '').toUpperCase() === 'COMPLETED' || (b.payment_status || '').toUpperCase() === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}>
                            {b.payment_status || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-stone-300 uppercase">{b.payment_gateway || 'Stripe'}</td>
                        <td className="p-4 text-right font-mono text-stone-400">{new Date(b.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}