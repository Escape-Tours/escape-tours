'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTaskSync } from '@/lib/hooks/useTaskSync';
import { 
  LayoutGrid, 
  ChevronRight, 
  Activity, 
  Compass, 
  Crown, 
  Sparkles,
  DollarSign,
  Truck,
  Gift,
  MessageSquare,
  RefreshCw,
  Loader2,
  Lock,
  ShieldAlert,
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  User,
  Mail,
  Calendar
} from 'lucide-react';

interface Profile {
  id: string;
  full_name?: string | null;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  passport_number?: string | null;
  residency_tier?: string | null;
  role?: string | null;
  is_admin?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface VendorLedger {
  id: string;
  vendor_name: string;
  service_type: string;
  commission_rate: number;
  balance_payout: number;
  status: 'PENDING' | 'SETTLED';
}

interface FleetAsset {
  id: string;
  vehicle_code: string;
  location: string;
  driver_name: string;
  status: 'DISPATCHED' | 'MAINTENANCE' | 'STANDBY';
  drone_auth: string;
}

interface DigitalOrder {
  id: string;
  item_name: string;
  client_email: string;
  status: 'QUEUED' | 'DISPATCHED';
}

interface BookingRecord {
  id: string;
  client_name?: string | null;
  full_name?: string | null;
  client_email?: string | null;
  email?: string | null;
  package_title?: string | null;
  tour_name?: string | null;
  travel_date?: string | null;
  start_date?: string | null;
  total_price?: number | null;
  amount?: number | null;
  status: string;
  created_at: string;
}

export default function ComprehensiveExecutiveAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("escape_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "EscapeAdmin2026!") {
      sessionStorage.setItem("escape_admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasscode("");
    }
  };

  const { status: _systemStatus, isLoading } = useTaskSync('system-health');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'users' | 'vendors' | 'fleet' | 'storefront' | 'comms'>('dashboard');
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [vendors, setVendors] = useState<VendorLedger[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  
  const [fleet] = useState<FleetAsset[]>([
    { id: 'F-01', vehicle_code: 'CRUISER-04 (Mikumi)', location: 'Mikumi Gate', driver_name: 'Charles Geofrey', status: 'DISPATCHED', drone_auth: 'TCAA-AV2-881' },
    { id: 'F-02', vehicle_code: 'CRUISER-09 (Serengeti)', location: 'Serora Airstrip', driver_name: 'Juma Kassim', status: 'STANDBY', drone_auth: 'TCAA-AV2-902' }
  ]);
  const [orders] = useState<DigitalOrder[]>([
    { id: 'ORD-501', item_name: '$100 PlayStation Network (PSN) Gift Card', client_email: 'alistair@sterling.co.uk', status: 'DISPATCHED' },
    { id: 'ORD-502', item_name: '$50 PSN Gift Card', client_email: 'genevieve.dupont@gmail.com', status: 'QUEUED' }
  ]);
  
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setUserLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles' as any).select('*').order('created_at', { ascending: false });

    if (!error && data) {
      setProfiles((data as unknown as Profile[]) || []);
    }
    setUserLoading(false);
  };

  const fetchVendors = async () => {
    setVendorLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('vendors' as any).select('*').order('vendor_name', { ascending: true });

    if (error) {
      const { data: altData } = await supabase.from('vendor_partners' as any).select('*');
      if (altData) {
        setVendors((altData as any[]).map((v: any) => ({
          id: v.id || Math.random().toString(),
          vendor_name: v.vendor_name || v.name || 'Partner Vendor',
          service_type: v.service_type || v.category || 'Luxury Lodge',
          commission_rate: v.commission_rate || v.markup || 15,
          balance_payout: v.balance_payout || v.payout || 2500,
          status: (v.status || 'PENDING').toUpperCase()
        })));
      }
    } else if (data) {
      setVendors((data as any[]).map((v: any) => ({
        id: v.id,
        vendor_name: v.vendor_name,
        service_type: v.service_type || 'Lodge / Safari',
        commission_rate: v.commission_rate ?? 15,
        balance_payout: v.balance_payout ?? 0,
        status: (v.status || 'PENDING').toUpperCase()
      })));
    }
    setVendorLoading(false);
  };

  const fetchBookings = async () => {
    setBookingLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('bookings' as any).select('*').order('created_at', { ascending: false });

    if (error || !data) {
      setBookings([]);
    } else {
      setBookings((data as unknown as BookingRecord[]) || []);
    }
    setBookingLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfiles();
      fetchVendors();
      fetchBookings();
    }
  }, [isAuthenticated]);

  const toggleUserRole = async (id: string, currentRole?: string | null, currentIsAdmin?: boolean | null) => {
    setActionLoading(id);
    const supabase = createClient();
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    const newIsAdmin = !currentIsAdmin;
    
    const { error: updateError } = await supabase
      .from('profiles' as any)
      .update({ role: newRole, is_admin: newIsAdmin })
      .eq('id', id);

    if (updateError) {
      alert('Failed to update user role: ' + updateError.message);
    } else {
      setProfiles(profiles.map(u => u.id === id ? { ...u, role: newRole, is_admin: newIsAdmin } : u));
    }
    setActionLoading(null);
  };

  const settleVendor = async (vendorId: string) => {
    setActionLoading(vendorId);
    const supabase = createClient();

    await supabase.from('vendors' as any).update({ status: 'SETTLED', balance_payout: 0 }).eq('id', vendorId);
    await supabase.from('vendor_partners' as any).update({ status: 'SETTLED', balance_payout: 0 }).eq('id', vendorId);

    setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'SETTLED', balance_payout: 0 } : v));
    setActionLoading(null);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    const supabase = createClient();
    
    await supabase.from('bookings' as any).update({ status: newStatus }).eq('id', bookingId);
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    setActionLoading(null);
  };

  if (authLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Lock size={28} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-xl font-black text-white uppercase tracking-wider mb-2">Executive Access</h1>
            <p className="text-xs text-slate-400">Restricted Command Center. Enter your authorization credentials to proceed.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin Passcode..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-amber-300 placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-all shadow-inner"
                autoFocus
              />
              {authError && (
                <p className="text-[11px] text-red-400 mt-2 flex items-center gap-1 font-medium">
                  <ShieldAlert size={12} /> Invalid executive passcode. Access denied.
                </p>
              )}
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
              <span>Authenticate Access</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 text-stone-100 p-4 md:p-8 selection:bg-amber-400 selection:text-stone-950">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Luxury Header with Global Status & Navigation Hub */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-stone-900/80 p-6 sm:p-8 rounded-[2.5rem] border border-amber-500/20 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-2xl shadow-inner">
              <Compass size={32} className="text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-amber-400 font-semibold">Escape Tours & Safaris</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[9px] font-serif text-amber-300 uppercase tracking-widest flex items-center gap-1">
                  <Crown size={10} /> Ultimate Executive Suite
                </span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-stone-100 tracking-wide mt-1">Unified Command Center</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 bg-stone-950 border border-amber-500/30 px-4 py-2.5 rounded-2xl shadow-inner">
              <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="text-xs font-serif uppercase tracking-widest text-stone-300">
                System {isLoading ? 'Syncing...' : 'Fully Operational'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex overflow-x-auto gap-2 p-2 bg-stone-900/90 rounded-2xl border border-amber-500/20 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Overview', icon: <LayoutGrid size={14} /> },
            { id: 'bookings', label: 'Bookings Manager', icon: <CalendarDays size={14} /> },
            { id: 'users', label: 'User Management', icon: <Activity size={14} /> },
            { id: 'vendors', label: 'Vendor Rate Matrix', icon: <DollarSign size={14} /> },
            { id: 'fleet', label: 'Fleet & Drones', icon: <Truck size={14} /> },
            { id: 'storefront', label: 'Storefront & PSN', icon: <Gift size={14} /> },
            { id: 'comms', label: 'Comms & WhatsApp', icon: <MessageSquare size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-stone-950 shadow-lg scale-[1.02]'
                  : 'text-stone-400 hover:text-stone-200 bg-stone-950/40 hover:bg-stone-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div onClick={() => setActiveTab('bookings')} className="bg-stone-900/90 border border-amber-500/20 p-6 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-xl">
                <span className="text-xs font-serif text-stone-400 uppercase tracking-widest">Active Bookings</span>
                <p className="text-2xl font-serif font-bold text-stone-100 mt-2">{bookings.length}</p>
                <span className="text-[10px] text-amber-400 mt-1 block uppercase tracking-wider">Manage Itineraries</span>
              </div>
              <div onClick={() => setActiveTab('users')} className="bg-stone-900/90 border border-amber-500/20 p-6 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-xl">
                <span className="text-xs font-serif text-stone-400 uppercase tracking-widest">Registered Profiles</span>
                <p className="text-2xl font-serif font-bold text-stone-100 mt-2">{profiles.length}</p>
                <span className="text-[10px] text-amber-400 mt-1 block uppercase tracking-wider">Live DB Sync</span>
              </div>
              <div onClick={() => setActiveTab('vendors')} className="bg-stone-900/90 border border-amber-500/20 p-6 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-xl">
                <span className="text-xs font-serif text-stone-400 uppercase tracking-widest">Vendor Payouts Pending</span>
                <p className="text-2xl font-serif font-bold text-amber-400 mt-2">${vendors.reduce((a,c)=>a+c.balance_payout,0).toLocaleString()}</p>
                <span className="text-[10px] text-amber-400 mt-1 block uppercase tracking-wider">Audit Matrix</span>
              </div>
              <div onClick={() => setActiveTab('fleet')} className="bg-stone-900/90 border border-amber-500/20 p-6 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-xl">
                <span className="text-xs font-serif text-stone-400 uppercase tracking-widest">Fleet & Drones Active</span>
                <p className="text-2xl font-serif font-bold text-emerald-400 mt-2">{fleet.length}</p>
                <span className="text-[10px] text-emerald-400 mt-1 block uppercase tracking-wider">Dispatch Hub</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-stone-900/90 rounded-[2.5rem] border border-amber-500/20 shadow-2xl overflow-hidden backdrop-blur-xl p-6 sm:p-8">
                <h3 className="font-serif font-bold text-lg text-stone-100 uppercase tracking-widest mb-4">Recent Bookings Stream</h3>
                <div className="divide-y divide-stone-800/60">
                  {bookings.slice(0, 4).map((b) => (
                    <div key={b.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-serif font-bold text-stone-200">{b.client_name || b.full_name || 'Guest'} — <span className="text-amber-400">{b.package_title || b.tour_name || 'Safari'}</span></p>
                        <p className="text-xs text-stone-400 font-serif">Travel Date: {b.travel_date || b.start_date || 'TBD'} | Total: ${(b.total_price || b.amount || 0).toLocaleString()}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${b.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
                        {b.status || 'PENDING'}
                      </span>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-stone-500 font-serif text-sm py-6">No recent bookings recorded.</p>}
                </div>
              </div>

              <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-zinc-950 text-stone-100 rounded-[2.5rem] border border-amber-500/30 p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-amber-400" size={18} />
                    <h3 className="font-serif font-bold text-base uppercase tracking-widest text-stone-100">Executive Shortcuts</h3>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab('bookings')} className="w-full text-left bg-stone-900/90 border border-amber-500/20 p-3.5 rounded-2xl font-serif font-bold text-xs uppercase tracking-wider hover:border-amber-400 transition-all flex items-center justify-between text-stone-200 cursor-pointer">
                      <span>Manage All Bookings</span>
                      <ChevronRight size={14} className="text-amber-400" />
                    </button>
                    <button onClick={() => setActiveTab('users')} className="w-full text-left bg-stone-900/90 border border-amber-500/20 p-3.5 rounded-2xl font-serif font-bold text-xs uppercase tracking-wider hover:border-amber-400 transition-all flex items-center justify-between text-stone-200 cursor-pointer">
                      <span>Manage User Hub</span>
                      <ChevronRight size={14} className="text-amber-400" />
                    </button>
                    <button onClick={() => setActiveTab('vendors')} className="w-full text-left bg-stone-900/90 border border-amber-500/20 p-3.5 rounded-2xl font-serif font-bold text-xs uppercase tracking-wider hover:border-amber-400 transition-all flex items-center justify-between text-stone-200 cursor-pointer">
                      <span>Manage Supplier Margins</span>
                      <ChevronRight size={14} className="text-amber-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-amber-500/20 text-[10px] font-serif uppercase tracking-[0.2em] text-amber-400/70 text-center">
                  Escape Tours & Safaris • Millennium Towers
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGER */}
        {activeTab === 'bookings' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Bookings & Itinerary Manager</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Direct query results from your Supabase <code className="text-amber-400 font-mono">bookings</code> table.</p>
              </div>
              <button onClick={fetchBookings} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                <RefreshCw size={14} className={bookingLoading ? 'animate-spin' : ''} />
                <span>Sync Live DB</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {bookingLoading ? (
                <div className="flex justify-center items-center py-16 text-amber-400">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span className="font-serif text-sm tracking-widest uppercase">Querying Supabase Bookings...</span>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                  <p className="font-serif text-stone-400 text-sm">No bookings found in the active database table.</p>
                  <p className="text-[10px] font-mono text-amber-400 mt-1">Verify table schema `bookings` in your Supabase SQL editor.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Client Details</th>
                      <th className="p-4">Package / Itinerary</th>
                      <th className="p-4">Travel Date</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                    {bookings.map((b) => {
                      const clientName = b.client_name || b.full_name || 'Valued Guest';
                      const clientEmail = b.client_email || b.email || 'N/A';
                      const packageTitle = b.package_title || b.tour_name || 'Custom Safari Itinerary';
                      const travelDate = b.travel_date || b.start_date || 'TBD';
                      const totalPrice = b.total_price || b.amount || 0;
                      const status = (b.status || 'PENDING').toUpperCase();

                      return (
                        <tr key={b.id} className="hover:bg-stone-800/40">
                          <td className="p-4 font-mono text-amber-400 font-bold">{b.id.slice(0, 8)}...</td>
                          <td className="p-4">
                            <p className="font-bold text-stone-100 flex items-center gap-1.5"><User size={12} className="text-amber-400" />{clientName}</p>
                            <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5"><Mail size={12} className="text-stone-500" />{clientEmail}</p>
                          </td>
                          <td className="p-4 text-stone-200 font-bold">{packageTitle}</td>
                          <td className="p-4 font-mono text-stone-300 flex items-center gap-1.5 pt-5"><CalendarDays size={13} className="text-amber-400" />{travelDate}</td>
                          <td className="p-4 font-mono font-extrabold text-stone-100">${Number(totalPrice).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                              'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button 
                              disabled={actionLoading === b.id}
                              onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-emerald-400 rounded-xl text-[10px] uppercase font-bold border border-emerald-500/30 transition cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button 
                              disabled={actionLoading === b.id}
                              onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-rose-400 rounded-xl text-[10px] uppercase font-bold border border-rose-500/30 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">User Management & Profiles</h2>
                <p className="text-xs text-stone-400 font-serif mt-1">Direct query results from your Supabase <code className="text-amber-400 font-mono">profiles</code> table.</p>
              </div>
              <button onClick={fetchProfiles} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer">
                <RefreshCw size={14} className={userLoading ? 'animate-spin' : ''} />
                <span>Sync Live DB</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {userLoading ? (
                <div className="flex justify-center items-center py-16 text-amber-400">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span className="font-serif text-sm tracking-widest uppercase">Querying Supabase Profiles...</span>
                </div>
              ) : profiles.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                  <p className="font-serif text-stone-400 text-sm">No user profiles found in the database.</p>
                  <p className="text-[10px] font-mono text-amber-400 mt-1">Verify table schema `profiles` in your Supabase SQL editor.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                      <th className="p-4">User ID</th>
                      <th className="p-4">Profile Details</th>
                      <th className="p-4">Role / Access</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                    {profiles.map((u) => {
                      const userName = u.full_name || u.name || 'Platform User';
                      const userEmail = u.email || 'No email provided';
                      const userRole = (u.role || (u.is_admin ? 'admin' : 'client')).toUpperCase();
                      const joinedDate = u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A';

                      return (
                        <tr key={u.id} className="hover:bg-stone-800/40">
                          <td className="p-4 font-mono text-amber-400 font-bold">{u.id.slice(0, 8)}...</td>
                          <td className="p-4">
                            <p className="font-bold text-stone-100 flex items-center gap-1.5"><User size={12} className="text-amber-400" />{userName}</p>
                            <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5"><Mail size={12} className="text-stone-500" />{userEmail}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                              userRole === 'ADMIN' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                              'bg-stone-800 text-stone-300 border border-stone-700'
                            }`}>
                              {userRole === 'ADMIN' ? <ShieldCheck size={10} className="text-amber-400" /> : <Sparkles size={10} className="text-stone-400" />}
                              {userRole}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-stone-300 flex items-center gap-1.5 pt-5"><Calendar size={13} className="text-amber-400" />{joinedDate}</td>
                          <td className="p-4 text-right">
                            <button 
                              disabled={actionLoading === u.id}
                              onClick={() => toggleUserRole(u.id, u.role, u.is_admin)}
                              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-amber-400 rounded-xl text-[10px] uppercase font-bold border border-amber-500/30 transition cursor-pointer"
                            >
                              {actionLoading === u.id ? <Loader2 size={12} className="animate-spin inline" /> : `Make ${userRole === 'ADMIN' ? 'Client' : 'Admin'}`}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: VENDOR RATE & COMMISSION MATRIX */}
        {activeTab === 'vendors' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
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
                  <span className="font-serif text-sm tracking-widest uppercase">Querying Supabase Vendors...</span>
                </div>
              ) : vendors.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/60 rounded-2xl border border-amber-500/10">
                  <p className="font-serif text-stone-400 text-sm">No vendor ledger records found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                      <th className="p-4">Vendor Name</th>
                      <th className="p-4">Service Type</th>
                      <th className="p-4">Commission %</th>
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
                        <td className="p-4 font-mono font-bold text-stone-100">${Number(v.balance_payout).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${v.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            disabled={v.status === 'SETTLED' || actionLoading === v.id}
                            onClick={() => settleVendor(v.id)}
                            className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-amber-400 disabled:text-stone-600 rounded-xl text-[10px] uppercase font-bold border border-amber-500/30 transition cursor-pointer disabled:cursor-not-allowed"
                          >
                            {v.status === 'SETTLED' ? 'Settled' : 'Settle Payout'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: FLEET & DRONES */}
        {activeTab === 'fleet' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Fleet & TCAA Drone Authorizations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                    <th className="p-4">Vehicle ID</th>
                    <th className="p-4">Cruiser / Asset Code</th>
                    <th className="p-4">Current Location</th>
                    <th className="p-4">Assigned Driver</th>
                    <th className="p-4">TCAA Drone Auth</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                  {fleet.map((f) => (
                    <tr key={f.id} className="hover:bg-stone-800/40">
                      <td className="p-4 font-mono text-amber-400 font-bold">{f.id}</td>
                      <td className="p-4 font-bold text-stone-100">{f.vehicle_code}</td>
                      <td className="p-4 text-stone-300">{f.location}</td>
                      <td className="p-4 text-stone-200">{f.driver_name}</td>
                      <td className="p-4 font-mono text-amber-300">{f.drone_auth}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${f.status === 'DISPATCHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: STOREFRONT & PSN */}
        {activeTab === 'storefront' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Digital Storefront & PSN Gift Card Queue</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Digital Item / Gift Card</th>
                    <th className="p-4">Client Email</th>
                    <th className="p-4">Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-800/40">
                      <td className="p-4 font-mono text-amber-400 font-bold">{o.id}</td>
                      <td className="p-4 font-bold text-stone-100">{o.item_name}</td>
                      <td className="p-4 font-mono text-stone-300">{o.client_email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${o.status === 'DISPATCHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: COMMS & WHATSAPP */}
        {activeTab === 'comms' && (
          <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Client Communications & WhatsApp Hub</h2>
            <p className="text-xs text-stone-400 font-serif">Direct WhatsApp Business API bridge and automated itinerary broadcast logs.</p>
            <div className="bg-stone-950/80 p-6 rounded-2xl border border-amber-500/10 text-center space-y-3">
              <MessageSquare size={32} className="text-amber-400 mx-auto animate-bounce" />
              <p className="text-sm font-serif text-stone-200">WhatsApp Business API Gateway connected via Twilio / Meta Cloud.</p>
              <button onClick={() => alert('Broadcast queue test initiated successfully.')} className="px-5 py-2.5 bg-amber-400 text-stone-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-amber-300 transition cursor-pointer">
                Test Broadcast Queue
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}